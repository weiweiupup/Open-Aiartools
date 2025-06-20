// 积分系统配置
export const CREDIT_CONFIG = {
  // 注册赠送积分
  REGISTRATION_BONUS: 10,
  
  // 各种操作消耗的积分
  COSTS: {
    IMAGE_EDIT: 10,
    MULTI_IMAGE_EDIT: 20,
    BACKGROUND_REMOVAL: 10,
  },
  
  // 订阅相关积分
  SUBSCRIPTION: {
    PRO_MONTHLY_CREDITS: 800,
  }
} as const;

// 用户相关配置
export const USER_CONFIG = {
  // 密码最小长度
  MIN_PASSWORD_LENGTH: 6,
  
  // 文件上传限制
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// 支持的文件格式
export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
] as const; 