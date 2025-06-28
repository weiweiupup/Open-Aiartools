import * as fal from "@fal-ai/serverless-client";
import { getTranslations } from 'next-intl/server';

// 类型定义
interface FalImageResult {
  url: string;
  width?: number;
  height?: number;
  content_type?: string;
}

// 纵横比类型
type AspectRatio = "21:9" | "16:9" | "4:3" | "3:2" | "1:1" | "2:3" | "3:4" | "9:16" | "9:21";

interface FalResponse {
  images?: FalImageResult[];
  image?: FalImageResult;
  data?: {
    images?: FalImageResult[];
    image?: FalImageResult;
  };
  timings?: any;
  seed?: number;
  has_nsfw_concepts?: boolean[];
  prompt?: string;
  requestId?: string;
  logs?: any[];
}

// 翻译函数
async function getErrorMessage(key: string, locale?: string): Promise<string> {
  try {
    const t = await getTranslations({ locale: locale || 'en', namespace: 'errors.imageProcessing' });
    return t(key);
  } catch (error) {
    // 如果翻译失败，返回英文默认值
    const fallbackMessages: Record<string, string> = {
      'invalidImageData': 'API returned invalid image data',
      'noImagesReturned': 'API did not return any images',
      'noProcessedImages': 'API did not return any processed images',
      'unknownError': 'Unknown error occurred',
      'multiImageProcessingError': 'Unknown error occurred during multi-image processing',
      'batchProcessingError': 'Unknown error occurred during batch processing',
      'multiImageNoData': 'Multi-image processing found no image data',
      'batchProcessingFailed': 'Some batches failed to process',
      'batchError': 'processing failed',
      'batchException': 'processing error'
    };
    return fallbackMessages[key] || 'Unknown error occurred';
  }
}

// 配置 fal client
fal.config({
  credentials: process.env.FAL_KEY,
});

// 智能图像编辑 - 使用 Kontext Dev 模型
export async function smartImageEdit(imageUrl: string, prompt: string, options?: {
  guidance_scale?: number;
  num_images?: number;
  sync_mode?: boolean;
  aspect_ratio?: AspectRatio;
  output_format?: "jpeg" | "png";
  seed?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  locale?: string;
}) {
  try {
    console.log('Calling Kontext Dev model for smart editing...');
    
    const result = await fal.subscribe("fal-ai/flux-kontext/dev", {
      input: {
        prompt: prompt,
        image_url: imageUrl,
        guidance_scale: options?.guidance_scale ?? 3.5,
        num_images: options?.num_images ?? 1,
        sync_mode: options?.sync_mode ?? true,
        safety_tolerance: options?.safety_tolerance ?? "2",
        output_format: options?.output_format ?? "jpeg",
        ...(options?.aspect_ratio && { aspect_ratio: options.aspect_ratio }),
        ...(options?.seed && { seed: options.seed }),
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Processing...", update.logs);
        }
      },
    }) as FalResponse;

    console.log('Fal AI response:', result);
    
    // 添加更详细的调试信息
    console.log('========== Fal AI detailed response analysis ==========');
    console.log('Complete response object:', JSON.stringify(result, null, 2));
    console.log('result.images:', result.images);
    console.log('result.data:', result.data);
    console.log('result.data type:', typeof result.data);
    if (result.data) {
      console.log('result.data.images:', result.data.images);
      console.log('result.data.image:', result.data.image);
    }
    console.log('=======================================');

    // 处理不同的响应格式
    let images: FalImageResult[] = [];
    
    // 首先检查根对象中的 images
    if (result.images && Array.isArray(result.images)) {
      images = result.images;
    } 
    // 然后检查根对象中的 image
    else if (result.image) {
      images = [result.image];
    }
    // 最后检查 data 对象中的数据
    else if (result.data?.images && Array.isArray(result.data.images)) {
      images = result.data.images;
    } else if (result.data?.image) {
      images = [result.data.image];
    } else {
      console.error('Image data not found:', result);
      const errorMessage = await getErrorMessage('invalidImageData', options?.locale);
      throw new Error(errorMessage);
    }

    if (images.length === 0) {
      const errorMessage = await getErrorMessage('noImagesReturned', options?.locale);
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: {
        images: images,
        model_used: 'flux-kontext-dev',
        prompt_used: prompt,
        parameters: {
          guidance_scale: options?.guidance_scale ?? 3.5,
          aspect_ratio: options?.aspect_ratio,
          output_format: options?.output_format ?? "jpeg",
        }
      }
    };
  } catch (error) {
    console.error('Smart image edit error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : await getErrorMessage('unknownError', options?.locale)
    };
  }
}

// 精确图像编辑（用于细节调整）
export async function preciseImageEdit(imageUrl: string, prompt: string, options?: {
  guidance_scale?: number;
  num_images?: number;
  aspect_ratio?: AspectRatio;
  output_format?: "jpeg" | "png";
  seed?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  locale?: string;
}) {
  try {
    console.log('Calling Kontext Dev model for precise editing...');
    
    const result = await fal.subscribe("fal-ai/flux-kontext/dev", {
      input: {
        prompt: prompt,
        image_url: imageUrl,
        guidance_scale: options?.guidance_scale ?? 4.5,
        num_images: options?.num_images ?? 1,
        sync_mode: true,
        safety_tolerance: options?.safety_tolerance ?? "1",
        output_format: options?.output_format ?? "jpeg",
        ...(options?.aspect_ratio && { aspect_ratio: options.aspect_ratio }),
        ...(options?.seed && { seed: options.seed }),
      },
      logs: true,
    }) as FalResponse;

    console.log('Fal AI response:', result);

    // 处理不同的响应格式
    let images: FalImageResult[] = [];
    
    if (result.images && Array.isArray(result.images)) {
      images = result.images;
    } else if (result.image) {
      images = [result.image];
    } else if (result.data?.images && Array.isArray(result.data.images)) {
      images = result.data.images;
    } else if (result.data?.image) {
      images = [result.data.image];
    } else {
      const errorMessage = await getErrorMessage('invalidImageData', options?.locale);
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: {
        images: images,
        model_used: 'flux-kontext-dev-precise',
        prompt_used: prompt,
        parameters: {
          guidance_scale: options?.guidance_scale ?? 4.5,
          aspect_ratio: options?.aspect_ratio,
          output_format: options?.output_format ?? "jpeg",
        }
      }
    };
  } catch (error) {
    console.error('Precise image edit error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : await getErrorMessage('unknownError', options?.locale)
    };
  }
}

// 创意图像编辑（用于大幅度变换）
export async function creativeImageEdit(imageUrl: string, prompt: string, options?: {
  guidance_scale?: number;
  num_images?: number;
  aspect_ratio?: AspectRatio;
  output_format?: "jpeg" | "png";
  seed?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  locale?: string;
}) {
  try {
    console.log('Calling Kontext Dev model for creative editing...');
    
    const result = await fal.subscribe("fal-ai/flux-kontext/dev", {
      input: {
        prompt: prompt,
        image_url: imageUrl,
        guidance_scale: options?.guidance_scale ?? 2.5,
        num_images: options?.num_images ?? 1,
        sync_mode: true,
        safety_tolerance: options?.safety_tolerance ?? "3",
        output_format: options?.output_format ?? "jpeg",
        ...(options?.aspect_ratio && { aspect_ratio: options.aspect_ratio }),
        ...(options?.seed && { seed: options.seed }),
      },
      logs: true,
    }) as FalResponse;

    console.log('Fal AI response:', result);

    // 处理不同的响应格式
    let images: FalImageResult[] = [];
    
    if (result.images && Array.isArray(result.images)) {
      images = result.images;
    } else if (result.image) {
      images = [result.image];
    } else if (result.data?.images && Array.isArray(result.data.images)) {
      images = result.data.images;
    } else if (result.data?.image) {
      images = [result.data.image];
    } else {
      const errorMessage = await getErrorMessage('invalidImageData', options?.locale);
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: {
        images: images,
        model_used: 'flux-kontext-dev-creative',
        prompt_used: prompt,
        parameters: {
          guidance_scale: options?.guidance_scale ?? 2.5,
          aspect_ratio: options?.aspect_ratio,
          output_format: options?.output_format ?? "jpeg",
        }
      }
    };
  } catch (error) {
    console.error('Creative image edit error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : await getErrorMessage('unknownError', options?.locale)
    };
  }
}

// 通用编辑函数（保持与interactive-demo的兼容性）
export async function editImage(imageUrl: string, prompt: string, locale?: string) {
  return await smartImageEdit(imageUrl, prompt, { locale });
}

// 背景移除功能（使用Kontext Dev实现）
export async function removeBackground(imageUrl: string, options?: {
  aspect_ratio?: AspectRatio;
  output_format?: "jpeg" | "png";
  seed?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  locale?: string;
}) {
  try {
    console.log('Calling Kontext Dev model for background removal...');
    
    const result = await fal.subscribe("fal-ai/flux-kontext/dev", {
      input: {
        prompt: "remove background, transparent background, clean cutout",
        image_url: imageUrl,
        guidance_scale: 4.0,
        num_images: 1,
        sync_mode: true,
        safety_tolerance: options?.safety_tolerance ?? "1",
        output_format: options?.output_format ?? "png",
        ...(options?.aspect_ratio && { aspect_ratio: options.aspect_ratio }),
        ...(options?.seed && { seed: options.seed }),
      },
      logs: true,
    }) as FalResponse;

    console.log('Fal AI response:', result);

    // 处理不同的响应格式
    let images: FalImageResult[] = [];
    
    if (result.images && Array.isArray(result.images)) {
      images = result.images;
    } else if (result.image) {
      images = [result.image];
    } else if (result.data?.images && Array.isArray(result.data.images)) {
      images = result.data.images;
    } else if (result.data?.image) {
      images = [result.data.image];
    } else {
      const errorMessage = await getErrorMessage('invalidImageData', options?.locale);
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: {
        images: images,
        model_used: 'flux-kontext-dev-background-removal',
        parameters: {
          aspect_ratio: options?.aspect_ratio,
          output_format: options?.output_format ?? "png",
        }
      }
    };
  } catch (error) {
    console.error('Remove background error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : await getErrorMessage('unknownError', options?.locale)
    };
  }
}

// 多图像处理 - 使用 Kontext Max Multi 模型
export async function multiImageEdit(imageUrls: string[], prompt: string, options?: {
  guidance_scale?: number;
  num_images?: number;
  sync_mode?: boolean;
  aspect_ratio?: AspectRatio;
  output_format?: "jpeg" | "png";
  seed?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  batch_size?: number;
  locale?: string;
}) {
  try {
    console.log('Calling Kontext Max Multi model for multi-image editing...');
    console.log('Input image count:', imageUrls.length);
    
    const result = await fal.subscribe("fal-ai/flux-pro/kontext/max/multi", {
      input: {
        prompt: prompt,
        image_urls: imageUrls,
        guidance_scale: options?.guidance_scale ?? 3.5,
        num_images: options?.num_images ?? imageUrls.length,
        sync_mode: options?.sync_mode ?? true,
        safety_tolerance: options?.safety_tolerance ?? "2",
        output_format: options?.output_format ?? "jpeg",
        batch_size: options?.batch_size ?? Math.min(imageUrls.length, 4), // Limit batch size
        ...(options?.aspect_ratio && { aspect_ratio: options.aspect_ratio }),
        ...(options?.seed && { seed: options.seed }),
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log("Processing multi-images...", update.logs);
        }
      },
    }) as FalResponse;

    console.log('Fal AI Multi response:', result);
    
    // Handle multi-image response format
    let images: FalImageResult[] = [];
    
    if (result.images && Array.isArray(result.images)) {
      images = result.images;
    } else if (result.data?.images && Array.isArray(result.data.images)) {
      images = result.data.images;
    } else if (result.image) {
      images = [result.image];
    } else if (result.data?.image) {
      images = [result.data.image];
    } else {
      console.error('Multi-image processing found no image data:', result);
      const errorMessage = await getErrorMessage('multiImageNoData', options?.locale);
      throw new Error(errorMessage);
    }

    if (images.length === 0) {
      const errorMessage = await getErrorMessage('noProcessedImages', options?.locale);
      throw new Error(errorMessage);
    }

    return {
      success: true,
      data: {
        images: images,
        model_used: 'flux-pro-kontext-max-multi',
        prompt_used: prompt,
        input_count: imageUrls.length,
        output_count: images.length,
        parameters: {
          guidance_scale: options?.guidance_scale ?? 3.5,
          aspect_ratio: options?.aspect_ratio,
          output_format: options?.output_format ?? "jpeg",
          batch_size: options?.batch_size ?? Math.min(imageUrls.length, 4),
        }
      }
    };
  } catch (error) {
    console.error('Multi-image edit error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : await getErrorMessage('multiImageProcessingError', options?.locale)
    };
  }
}

// Batch image processing (for handling large numbers of images in batches)
export async function batchImageEdit(imageUrls: string[], prompt: string, options?: {
  guidance_scale?: number;
  aspect_ratio?: AspectRatio;
  output_format?: "jpeg" | "png";
  seed?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
  batch_size?: number;
  max_concurrent?: number;
  locale?: string;
}) {
  try {
    const batchSize = options?.batch_size ?? 4;
    const maxConcurrent = options?.max_concurrent ?? 2;
    const batches: string[][] = [];
    
    // Split images into batches
    for (let i = 0; i < imageUrls.length; i += batchSize) {
      batches.push(imageUrls.slice(i, i + batchSize));
    }
    
    console.log(`Batch processing: ${imageUrls.length} images split into ${batches.length} batches`);
    
    const allResults: FalImageResult[] = [];
    const errors: string[] = [];
    
    // Process batches concurrently
    for (let i = 0; i < batches.length; i += maxConcurrent) {
      const currentBatches = batches.slice(i, i + maxConcurrent);
      
      const batchPromises = currentBatches.map(async (batch, batchIndex) => {
        try {
          const result = await multiImageEdit(batch, prompt, {
            ...options,
            batch_size: batch.length,
          });
          
          if (result.success && result.data?.images) {
            return result.data.images;
          } else {
            const errorMessage = await getErrorMessage('batchError', options?.locale);
            errors.push(`Batch ${i + batchIndex + 1} ${errorMessage}: ${result.error}`);
            return [];
          }
        } catch (error) {
          const errorMessage = await getErrorMessage('batchException', options?.locale);
          const unknownError = await getErrorMessage('unknownError', options?.locale);
          errors.push(`Batch ${i + batchIndex + 1} ${errorMessage}: ${error instanceof Error ? error.message : unknownError}`);
          return [];
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(images => allResults.push(...images));
    }
    
    const batchFailedMessage = await getErrorMessage('batchProcessingFailed', options?.locale);
    
    return {
      success: allResults.length > 0,
      data: {
        images: allResults,
        model_used: 'flux-pro-kontext-max-multi-batch',
        prompt_used: prompt,
        input_count: imageUrls.length,
        output_count: allResults.length,
        batch_count: batches.length,
        errors: errors.length > 0 ? errors : undefined,
        parameters: {
          guidance_scale: options?.guidance_scale ?? 3.5,
          aspect_ratio: options?.aspect_ratio,
          output_format: options?.output_format ?? "jpeg",
          batch_size: batchSize,
          max_concurrent: maxConcurrent,
        }
      },
      error: errors.length > 0 ? `${batchFailedMessage}: ${errors.join('; ')}` : undefined
    };
  } catch (error) {
    console.error('Batch image edit error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : await getErrorMessage('batchProcessingError', options?.locale)
    };
  }
}

// 导出纵横比类型
export type { AspectRatio };

// 导出 fal 客户端以供其他用途
export { fal }; 