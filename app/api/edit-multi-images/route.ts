import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, userActivities } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import * as fal from '@fal-ai/serverless-client';
import { deductCredits } from '@/lib/credit-service';
import { CREDIT_CONFIG, USER_CONFIG, SUPPORTED_IMAGE_FORMATS } from '@/lib/constants';

// 配置fal.ai客户端
fal.config({
  credentials: process.env.FAL_KEY!
});

// 翻译消息
const messages = {
  zh: {
    loginRequired: '请先登录后再使用多图编辑功能',
    userNotFound: '用户不存在',
    insufficientCredits: `积分不足，多图编辑需要${CREDIT_CONFIG.COSTS.MULTI_IMAGE_EDIT}积分`,
    noFiles: '请上传至少一张图片',
    tooManyFiles: '一次最多可上传20张图片',
    unsupportedImageFormat: '不支持的图片格式，请上传 JPG、PNG 或 WebP 格式的图片',
    imageTooLarge: '图片文件过大，请上传小于 5MB 的图片',
    promptRequired: '多图编辑需要提供编辑指令',
    processingError: '多图编辑失败，请重试',
    partialSuccess: '图片编辑部分成功',
    allSuccess: '图片编辑成功',
    // API错误消息
    pleaseLogin: '请先登录',
    enterPrompt: '请输入编辑指令',
    maxImagesLimit: '最多只能上传10张图片',
    creditInsufficient: '积分不足，需要 {needed} 积分，当前有 {current} 积分',
    imageSizeExceeded: '图片 {name} 超过5MB限制',
    imageFormatNotSupported: '图片 {name} 格式不支持，请使用 JPEG、PNG 或 WebP 格式',
    imageUploadFailed: '图片 {name} 上传失败: {error}',
    imageUrlVerificationFailed: '图片URL验证失败，请重试',
    promptEmpty: '提示词不能为空',
    needAtLeastOneImage: '至少需要一张图片',
    invalidImageUrl: '无效的图片URL格式: {url}',
    apiReturnEmpty: 'API返回数据为空',
    apiNoValidImages: 'API未返回有效的图片数据',
    imageDataMissingUrl: '返回的图片数据缺少URL',
    validationFailed: '参数验证失败: {details}',
    // 通用错误处理
    processingFailed: '处理失败，请稍后重试',
    creditsInsufficient: '积分不足或配额已用完',
    rateLimited: '请求过于频繁，请稍后重试',
    invalidImageFormat: '图片格式不正确或已损坏，请检查图片格式',
    contentPolicyViolation: '内容不符合使用政策，请修改提示词或图片',
    requestTimeout: '处理超时，请稍后重试',
    modelUnavailable: '模型服务暂时不可用，请稍后重试',
    aiProcessingFailed: 'AI处理失败，请重新尝试或联系客服'
  },
  en: {
    loginRequired: 'Please log in first to use multi-image editing features',
    userNotFound: 'User not found',
    insufficientCredits: `Insufficient credits, ${CREDIT_CONFIG.COSTS.MULTI_IMAGE_EDIT} credits required for multi-image editing`,
    noFiles: 'Please upload at least one image',
    tooManyFiles: 'Maximum 20 images can be uploaded at once',
    unsupportedImageFormat: 'Unsupported image format, please upload JPG, PNG or WebP format images',
    imageTooLarge: 'Image file too large, please upload images smaller than 5MB',
    promptRequired: 'Multi-image editing requires a prompt',
    processingError: 'Multi-image editing failed, please try again',
    partialSuccess: 'Image editing partially successful',
    allSuccess: 'Image editing successful',
    // API错误消息
    pleaseLogin: 'Please log in first',
    enterPrompt: 'Please enter editing instructions',
    maxImagesLimit: 'Maximum 10 images can be uploaded',
    creditInsufficient: 'Insufficient credits, need {needed} credits, currently have {current} credits',
    imageSizeExceeded: 'Image {name} exceeds 5MB limit',
    imageFormatNotSupported: 'Image {name} format not supported, please use JPEG, PNG or WebP format',
    imageUploadFailed: 'Image {name} upload failed: {error}',
    imageUrlVerificationFailed: 'Image URL verification failed, please try again',
    promptEmpty: 'Prompt cannot be empty',
    needAtLeastOneImage: 'At least one image is required',
    invalidImageUrl: 'Invalid image URL format: {url}',
    apiReturnEmpty: 'API returned empty data',
    apiNoValidImages: 'API did not return valid image data',
    imageDataMissingUrl: 'Returned image data is missing URL',
    validationFailed: 'Parameter validation failed: {details}',
    // 通用错误处理
    processingFailed: 'Processing failed, please try again later',
    creditsInsufficient: 'Insufficient credits or quota exhausted',
    rateLimited: 'Too many requests, please try again later',
    invalidImageFormat: 'Image format is incorrect or corrupted, please check image format',
    contentPolicyViolation: 'Content does not comply with usage policy, please modify prompt or images',
    requestTimeout: 'Processing timeout, please try again later',
    modelUnavailable: 'Model service temporarily unavailable, please try again later',
    aiProcessingFailed: 'AI processing failed, please try again or contact customer service'
  }
};

// 获取翻译消息
function getMessage(locale: string, key: keyof typeof messages.zh): string {
  const lang = (locale === 'zh' || locale === 'zh-CN') ? 'zh' : 'en';
  return messages[lang][key];
}

// 获取带参数的翻译消息
function getMessageWithParams(locale: string, key: keyof typeof messages.zh, params: Record<string, string | number>): string {
  const lang = (locale === 'zh' || locale === 'zh-CN') ? 'zh' : 'en';
  let message = messages[lang][key];
  
  // 替换占位符
  Object.keys(params).forEach(paramKey => {
    message = message.replace(`{${paramKey}}`, String(params[paramKey]));
  });
  
  return message;
}

// 文件转换为 Data URL
async function fileToDataUrl(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}

// 最大文件数量限制
const MAX_FILES = 20;

export async function POST(request: NextRequest) {
  try {
    // 解析表单数据以获取locale
    const formData = await request.formData();
    const locale = formData.get('locale') as string || 'zh';
    
    // 检查用户认证
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: getMessage(locale, 'pleaseLogin') },
        { status: 401 }
      );
    }

    // 获取用户信息
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email)
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: getMessage(locale, 'userNotFound') },
        { status: 404 }
      );
    }

    // 获取其他表单数据
    const images = formData.getAll('images') as File[];
    const prompt = formData.get('prompt') as string;
    const aspectRatio = formData.get('aspect_ratio') as string;

    // 验证输入
    if (!images || images.length === 0) {
      return NextResponse.json(
        { success: false, error: getMessage(locale, 'noFiles') },
        { status: 400 }
      );
    }

    if (!prompt?.trim()) {
      return NextResponse.json(
        { success: false, error: getMessage(locale, 'enterPrompt') },
        { status: 400 }
      );
    }

    // 检查文件数量限制
    if (images.length > 10) {
      return NextResponse.json(
        { success: false, error: getMessage(locale, 'maxImagesLimit') },
        { status: 400 }
      );
    }

    // 计算所需积分 - 使用配置文件中的积分值
    const creditsNeeded = CREDIT_CONFIG.COSTS.MULTI_IMAGE_EDIT;
    const totalCredits = (user.credits || 0) + (user.subscriptionCredits || 0);

    if (totalCredits < creditsNeeded) {
      return NextResponse.json(
        { success: false, error: getMessageWithParams(locale, 'creditInsufficient', { needed: creditsNeeded, current: totalCredits }) },
        { status: 400 }
      );
    }

    // 上传图片到fal.ai存储
    const imageUrls: string[] = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      console.log(`处理图片 ${i + 1}/${images.length}: ${image.name}, 大小: ${image.size} bytes, 类型: ${image.type}`);
      
      // 检查文件大小
      if (image.size > USER_CONFIG.MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: getMessageWithParams(locale, 'imageSizeExceeded', { name: image.name }) },
          { status: 400 }
        );
      }

      // 检查文件类型
      if (!SUPPORTED_IMAGE_FORMATS.includes(image.type as any)) {
        return NextResponse.json(
          { success: false, error: getMessageWithParams(locale, 'imageFormatNotSupported', { name: image.name }) },
          { status: 400 }
        );
      }

      try {
        // 上传到fal.ai存储
        console.log(`开始上传图片: ${image.name}`);
        const uploadedUrl = await fal.storage.upload(image);
        console.log(`图片上传成功: ${image.name} -> ${uploadedUrl}`);
        imageUrls.push(uploadedUrl);
      } catch (uploadError) {
        console.error(`图片上传失败: ${image.name}`, uploadError);
        return NextResponse.json(
          { success: false, error: getMessageWithParams(locale, 'imageUploadFailed', { name: image.name, error: uploadError instanceof Error ? uploadError.message : String(uploadError) }) },
          { status: 500 }
        );
      }
    }

    console.log(`所有图片上传完成，共 ${imageUrls.length} 张图片`);

    // 等待图片URL变为可访问状态
    console.log('等待图片URL变为可访问状态...');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

    // 验证图片URL是否可访问
    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      try {
        console.log(`验证图片URL ${i + 1}: ${url}`);
        const response = await fetch(url, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`图片URL不可访问: ${response.status} ${response.statusText}`);
        }
        console.log(`图片URL ${i + 1} 验证成功`);
      } catch (fetchError) {
        console.error(`图片URL验证失败: ${url}`, fetchError);
        return NextResponse.json(
          { success: false, error: getMessage(locale, 'imageUrlVerificationFailed') },
          { status: 500 }
        );
      }
    }

    // 准备API请求参数 - 使用最简配置
    const apiParams: any = {
      prompt: prompt.trim(),
      image_urls: imageUrls
    };

    console.log('调用fal.ai多图编辑API，参数:', {
      prompt: apiParams.prompt,
      image_urls_count: imageUrls.length,
      image_urls_sample: imageUrls.slice(0, 1) // 显示第一个URL作为示例
    });

    // 确保prompt不为空且格式正确
    if (!apiParams.prompt || apiParams.prompt.trim().length === 0) {
      throw new Error(getMessage(locale, 'promptEmpty'));
    }

    // 确保至少有一张图片
    if (!imageUrls || imageUrls.length === 0) {
      throw new Error(getMessage(locale, 'needAtLeastOneImage'));
    }

    // 验证图片URL格式
    for (const url of imageUrls) {
      if (!url || typeof url !== 'string' || !url.startsWith('https://')) {
        throw new Error(getMessageWithParams(locale, 'invalidImageUrl', { url }));
      }
    }

    try {
      // 调用fal.ai多图编辑API - 使用效果更好的max模型
      const result = await fal.subscribe("fal-ai/flux-pro/kontext/max/multi", {
        input: apiParams,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            console.log('处理进度:', update.logs?.map(log => log.message).join(', '));
          }
        },
      }) as any;

      console.log('fal.ai API响应:', result);
      
      // 验证API响应 - fal.ai直接返回包含images的对象
      if (!result) {
        throw new Error(getMessage(locale, 'apiReturnEmpty'));
      }

      // 检查返回的图片数据 - 直接检查images数组
      if (!result.images || !Array.isArray(result.images) || result.images.length === 0) {
        throw new Error(getMessage(locale, 'apiNoValidImages'));
      }

      // 验证每个图片对象的结构
      for (const image of result.images) {
        if (!image.url) {
          throw new Error(getMessage(locale, 'imageDataMissingUrl'));
        }
      }

      // 扣除积分并记录活动
      const creditDeductResult = await deductCredits(
        user.id,
        creditsNeeded,
        `credit_description.multi_image_edit:${prompt.trim().substring(0, 100)}`,
        {
          prompt: prompt.trim(),
          imageCount: images.length,
          creditsUsed: creditsNeeded,
          aspectRatio: aspectRatio || 'original',
          locale,
          type: 'multi_image_edit'
        }
      );

      if (!creditDeductResult.success) {
        return NextResponse.json(
          { success: false, error: creditDeductResult.message },
          { status: 400 }
        );
      }

      // 返回成功响应
      return NextResponse.json({
        success: true,
        data: {
          images: result.images,
          model_used: 'flux-pro-kontext-max-multi',
          input_count: images.length,
          output_count: result.images.length,
          message: `成功编辑了 ${images.length} 张图片，生成了 ${result.images.length} 张结果图片`
        },
        credits: creditDeductResult.credits
      });

    } catch (falError) {
      console.error('fal.ai API调用失败:', {
        error: falError,
        message: falError instanceof Error ? falError.message : String(falError),
        stack: falError instanceof Error ? falError.stack : undefined,
        // 显示详细的验证错误
        body: (falError as any)?.body,
        detail: (falError as any)?.body?.detail,
        status: (falError as any)?.status,
        apiParams: {
          ...apiParams,
          image_urls: `${imageUrls.length} URLs`
        }
      });

      // 如果是验证错误，尝试提取详细信息
      if ((falError as any)?.status === 422 && (falError as any)?.body?.detail) {
        const details = (falError as any).body.detail;
        console.error('验证错误详情:', details);
        
        // 构建更友好的错误消息
        let detailMessage = getMessageWithParams(locale, 'validationFailed', { 
          details: Array.isArray(details) ? details.map((d: any) => {
            if (typeof d === 'string') return d;
            if (d.msg) return `${d.loc ? d.loc.join('.') + ': ' : ''}${d.msg}`;
            return JSON.stringify(d);
          }).join(', ') : JSON.stringify(details)
        });
        
        throw new Error(detailMessage);
      }
      
      throw falError;
    }

  } catch (error) {
    console.error('多图编辑API错误:', error);
    
    // 尝试从request中获取locale，如果失败则使用默认值
    let locale = 'zh';
    try {
      const formData = await request.formData();
      locale = (formData.get('locale') as string) || 'zh';
    } catch {
      // 如果无法读取formData，使用默认语言
    }
    
    let errorMessage = getMessage(locale, 'processingFailed');
    let statusCode = 500;
    
    if (error instanceof Error) {
      // fal.ai API特定错误处理
      if (error.message.includes('insufficient credits') || error.message.includes('quota')) {
        errorMessage = getMessage(locale, 'creditsInsufficient');
        statusCode = 402;
      } else if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
        errorMessage = getMessage(locale, 'rateLimited');
        statusCode = 429;
      } else if (error.message.includes('invalid image') || error.message.includes('unsupported format')) {
        errorMessage = getMessage(locale, 'invalidImageFormat');
        statusCode = 400;
      } else if (error.message.includes('content policy') || error.message.includes('safety')) {
        errorMessage = getMessage(locale, 'contentPolicyViolation');
        statusCode = 400;
      } else if (error.message.includes('timeout') || error.message.includes('request timeout')) {
        errorMessage = getMessage(locale, 'requestTimeout');
        statusCode = 408;
      } else if (error.message.includes('model not found') || error.message.includes('endpoint not found')) {
        errorMessage = getMessage(locale, 'modelUnavailable');
        statusCode = 503;
      } else if (error.message.includes(getMessage(locale, 'apiReturnEmpty')) || error.message.includes(getMessage(locale, 'apiNoValidImages'))) {
        errorMessage = getMessage(locale, 'aiProcessingFailed');
        statusCode = 502;
      } else {
        // 记录详细错误信息用于调试
        console.error('未知错误详情:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        errorMessage = `${getMessage(locale, 'processingFailed')}: ${error.message}`;
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        debug: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: statusCode }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '多图像编辑 API',
    version: '1.0.0',
    supported_actions: ['multi_image_edit', 'image_edit'],
    supported_formats: ['JPG', 'JPEG', 'PNG', 'WebP'],
    max_file_size: '5MB',
    max_files: MAX_FILES,
    processing_modes: ['edit'],
    credit_cost: `${CREDIT_CONFIG.COSTS.MULTI_IMAGE_EDIT} credits per edit`,
    models: ['flux-pro-kontext-max-multi']
  });
} 