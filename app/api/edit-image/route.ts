import { NextRequest, NextResponse } from 'next/server';
import { smartImageEdit, preciseImageEdit, creativeImageEdit, removeBackground, type AspectRatio } from '@/lib/fal-client';
import { auth } from '@/lib/auth';
import { deductCredits } from '@/lib/credit-service';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { CREDIT_CONFIG } from '@/lib/constants';

// 翻译消息
const messages = {
  zh: {
    loginRequired: '请先登录后再使用图片编辑功能',
    userNotFound: '用户不存在',
    insufficientCredits: '积分不足，每次编辑需要10积分',
    noFile: '请上传图片文件',
    unsupportedImageFormat: '不支持的图片格式，请上传 JPG、PNG、WebP 或 AVIF 格式的图片',
    imageTooLarge: '图片文件过大，请上传小于 5MB 的图片',
    preciseNeedsPrompt: '精确编辑模式需要提供编辑指令',
    creativeNeedsPrompt: '创意编辑模式需要提供编辑指令',
    smartNeedsPrompt: '智能编辑模式需要提供编辑指令',
    processingError: '图片处理失败，请重试'
  },
  en: {
    loginRequired: 'Please log in first to use image editing features',
    userNotFound: 'User not found',
    insufficientCredits: 'Insufficient credits, 10 credits required per edit',
    noFile: 'Please upload an image file',
    unsupportedImageFormat: 'Unsupported image format, please upload JPG, PNG, WebP or AVIF format images',
    imageTooLarge: 'Image file too large, please upload images smaller than 5MB',
    preciseNeedsPrompt: 'Precise editing requires a prompt',
    creativeNeedsPrompt: 'Creative editing requires a prompt',
    smartNeedsPrompt: 'Smart editing requires a prompt',
    processingError: 'Image processing failed, please try again'
  }
};

// 获取翻译消息
function getMessage(locale: string, key: keyof typeof messages.zh): string {
  const lang = (locale === 'zh' || locale === 'zh-CN') ? 'zh' : 'en';
  return messages[lang][key];
}

// 文件转换为 Data URL
async function fileToDataUrl(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  return `data:${file.type};base64,${base64}`;
}

// 支持的图片格式
const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/avif'
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const locale = (formData.get('locale') as string) || 'en';
    
    // 检查用户认证状态
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: getMessage(locale, 'loginRequired') },
        { status: 401 }
      );
    }

    // 获取用户信息
    const user = await db.query.users.findFirst({
      where: eq(users.email, session.user.email),
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: getMessage(locale, 'userNotFound') },
        { status: 404 }
      );
    }

    // 检查用户积分是否足够（先检查，但不扣除）
    if (user.credits < 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: getMessage(locale, 'insufficientCredits')
        },
        { status: 402 } // Payment Required
      );
    }
    
    const file = formData.get('image') as File;
    const prompt = formData.get('prompt') as string;
    const action = (formData.get('action') as string) || 'smart';
    const guidanceScale = formData.get('guidance_scale') ? parseFloat(formData.get('guidance_scale') as string) : undefined;
    const strength = formData.get('strength') ? parseFloat(formData.get('strength') as string) : undefined;
    const aspectRatio = formData.get('aspect_ratio') as AspectRatio | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: getMessage(locale, 'noFile') },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          error: getMessage(locale, 'unsupportedImageFormat')
        },
        { status: 400 }
      );
    }

    // 验证文件大小（限制为 5MB）
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: getMessage(locale, 'imageTooLarge') },
        { status: 400 }
      );
    }

    // 先进行图片编辑，不扣除积分
    const imageDataUrl = await fileToDataUrl(file);
    let result;

    switch (action) {
      case 'remove_background':
      case 'remove-background':
        result = await removeBackground(imageDataUrl, {
          aspect_ratio: aspectRatio || undefined,
        });
        break;
      
      case 'precise':
        if (!prompt) {
          return NextResponse.json(
            { success: false, error: getMessage(locale, 'preciseNeedsPrompt') },
            { status: 400 }
          );
        }
        result = await preciseImageEdit(imageDataUrl, prompt, {
          guidance_scale: guidanceScale,
          aspect_ratio: aspectRatio || undefined,
        });
        break;
      
      case 'creative':
        if (!prompt) {
          return NextResponse.json(
            { success: false, error: getMessage(locale, 'creativeNeedsPrompt') },
            { status: 400 }
          );
        }
        result = await creativeImageEdit(imageDataUrl, prompt, {
          guidance_scale: guidanceScale,
          aspect_ratio: aspectRatio || undefined,
        });
        break;
      
      case 'edit':
      case 'smart':
      default:
        if (!prompt) {
          return NextResponse.json(
            { success: false, error: getMessage(locale, 'smartNeedsPrompt') },
            { status: 400 }
          );
        }
        result = await smartImageEdit(imageDataUrl, prompt, {
          guidance_scale: guidanceScale,
          sync_mode: true,
          aspect_ratio: aspectRatio || undefined,
        });
        break;
    }

    // 只有在图片编辑成功后才扣除积分
    if (result.success) {
      const creditDeductResult = await deductCredits(
        user.id,
        CREDIT_CONFIG.COSTS.IMAGE_EDIT,
        action === 'remove_background' ? 'credit_description.background_removal' : `credit_description.image_edit:${prompt?.substring(0, 100) || 'Image Edit'}`,
        {
          action: action,
          prompt: prompt,
          file_size: file.size,
          file_type: file.type,
          aspect_ratio: aspectRatio,
          type: 'image_edit',
        }
      );

      // 返回成功结果，包含积分信息
      return NextResponse.json({
        success: true,
        data: result.data,
        error: null,
        action: action,
        credits: creditDeductResult.credits
      });
    } else {
      // 图片编辑失败，不扣除积分
      return NextResponse.json({
        success: false,
        data: null,
        error: result.error,
        action: action
      });
    }

  } catch (error) {
    console.error('Image edit API error:', error);
    
    // 尝试从 formData 中获取 locale，如果失败则默认为 'en'
    let locale = 'en';
    try {
      const formData = await request.formData();
      locale = (formData.get('locale') as string) || 'en';
    } catch {
      // 如果无法读取 formData，使用默认语言
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : getMessage(locale, 'processingError')
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: '图片编辑 API',
    version: '1.0.0',
    supported_actions: ['smart', 'precise', 'creative', 'remove_background'],
    supported_formats: ['JPG', 'JPEG', 'PNG', 'WebP', 'AVIF'],
    max_file_size: '5MB',
    models: {
      smart: 'flux-kontext-dev',
      precise: 'flux-kontext-dev',
      creative: 'flux-kontext-dev',
      remove_background: 'flux-kontext-dev'
    },
    credit_cost: `${CREDIT_CONFIG.COSTS.IMAGE_EDIT} credits per edit`
  });
} 