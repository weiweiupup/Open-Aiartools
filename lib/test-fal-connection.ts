import { fal } from './fal-client';

// 类型定义
interface TestResult {
  data?: {
    images?: Array<{ url: string }>;
  };
}

// 测试 fal AI 连接
export async function testFalConnection(): Promise<{ success: boolean; message: string }> {
  try {
    // 检查API密钥是否已配置
    if (!process.env.FAL_KEY) {
      return {
        success: false,
        message: 'FAL_KEY 环境变量未配置。请在 .env.local 文件中设置您的 fal AI API 密钥。'
      };
    }

    // 尝试调用 Kontext Pro 模型来测试连接
    const result = await fal.subscribe("fal-ai/flux-pro/kontext", {
      input: {
        prompt: "test connection - make it slightly brighter",
        image_url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        guidance_scale: 3.5,
        sync_mode: true,
        num_images: 1,
      },
      logs: true,
    }) as TestResult;

    if (result && result.data && result.data.images && result.data.images.length > 0) {
      return {
        success: true,
        message: '✅ Fal AI Kontext Pro 连接成功！现在可以使用最新的前沿图像编辑模型。'
      };
    } else {
      return {
        success: false,
        message: 'API 调用成功但未返回预期结果。请检查您的 API 配额。'
      };
    }

  } catch (error) {
    console.error('Fal AI connection test failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return {
          success: false,
          message: 'API 密钥无效。请检查您的 FAL_KEY 配置。访问 https://fal.ai 获取有效密钥。'
        };
      }
      
      if (error.message.includes('quota') || error.message.includes('limit')) {
        return {
          success: false,
          message: 'API 配额已用完。请检查您的 fal.ai 账户余额或升级套餐。'
        };
      }

      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        return {
          success: false,
          message: '无权限访问 Kontext Pro 模型。请确保您的账户已开通相应权限。'
        };
      }
      
      return {
        success: false,
        message: `连接失败: ${error.message}`
      };
    }

    return {
      success: false,
      message: '未知错误，请稍后重试。'
    };
  }
}

// 获取模型信息
export async function getFalAccountInfo() {
  try {
    return {
      success: true,
      message: '如需查看账户信息，请访问 https://fal.ai 控制台',
      models: {
        'kontext-pro': 'FLUX.1 Kontext [pro] - 前沿图像编辑模型'
      },
      features: [
        '智能图像编辑',
        '精确细节调整', 
        '创意风格变换',
        '背景移除'
      ],
      documentation: 'https://fal.ai/models/fal-ai/flux-pro/kontext/api'
    };
  } catch (error) {
    return {
      success: false,
      message: '无法获取模型信息'
    };
  }
} 