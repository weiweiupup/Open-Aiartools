import * as fal from "@fal-ai/serverless-client";

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

// 配置 fal client
fal.config({
  credentials: process.env.FAL_KEY,
});

// 智能图像编辑 - 使用 Kontext Pro 模型
export async function smartImageEdit(imageUrl: string, prompt: string, options?: {
  guidance_scale?: number;
  num_images?: number;
  sync_mode?: boolean;
  aspect_ratio?: AspectRatio;
  output_format?: "jpeg" | "png";
  seed?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
}) {
  try {
    console.log('Calling Kontext Pro model for smart editing...');
    
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
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
      throw new Error('API returned invalid image data');
    }

    if (images.length === 0) {
      throw new Error('API did not return any images');
    }

    return {
      success: true,
      data: {
        images: images,
        model_used: 'flux-pro-kontext',
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
      error: error instanceof Error ? error.message : 'Unknown error occurred'
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
}) {
  try {
    console.log('Calling Kontext Pro model for precise editing...');
    
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
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
      throw new Error('API returned invalid image data');
    }

    return {
      success: true,
      data: {
        images: images,
        model_used: 'flux-pro-kontext-precise',
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
      error: error instanceof Error ? error.message : 'Unknown error occurred'
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
}) {
  try {
    console.log('Calling Kontext Pro model for creative editing...');
    
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
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
      throw new Error('API returned invalid image data');
    }

    return {
      success: true,
      data: {
        images: images,
        model_used: 'flux-pro-kontext-creative',
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
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// 通用编辑函数（保持与interactive-demo的兼容性）
export async function editImage(imageUrl: string, prompt: string) {
  return await smartImageEdit(imageUrl, prompt);
}

// 背景移除功能（使用Kontext Pro实现）
export async function removeBackground(imageUrl: string, options?: {
  aspect_ratio?: AspectRatio;
  output_format?: "jpeg" | "png";
  seed?: number;
  safety_tolerance?: "1" | "2" | "3" | "4" | "5" | "6";
}) {
  try {
    console.log('Calling Kontext Pro model for background removal...');
    
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
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
      throw new Error('API returned invalid image data');
    }

    return {
      success: true,
      data: {
        images: images,
        model_used: 'flux-pro-kontext-background-removal',
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
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// 导出纵横比类型
export type { AspectRatio };

// 导出 fal 客户端以供其他用途
export { fal }; 