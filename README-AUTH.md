# Aiartools 用户认证系统

## 概述

本项目实现了一个完整的用户认证系统，包括用户注册、登录、邮箱验证等功能。

## 功能特性

### ✅ 已实现功能

1. **用户注册**
   - 邮箱和密码注册
   - 密码强度验证（至少8位，包含大小写字母和数字）
   - 邮箱格式验证
   - 重复密码确认

2. **邮箱验证**
   - 注册后自动发送验证邮件
   - 24小时有效期的验证令牌
   - 验证成功后激活账户

3. **用户登录**
   - 邮箱密码登录
   - JWT令牌认证
   - HTTP-only Cookie安全存储

4. **用户登出**
   - 清除认证Cookie
   - 客户端状态重置

5. **用户仪表板**
   - 显示用户基本信息
   - 账户状态查看
   - 快速操作菜单

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **UI组件**: Radix UI + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Neon PostgreSQL + Drizzle ORM
- **邮件服务**: Resend
- **认证**: JWT + HTTP-only Cookies
- **密码加密**: bcryptjs

## 文件结构

```
├── app/
│   ├── [locale]/
│   │   ├── auth/
│   │   │   ├── login/page.tsx           # 登录页面
│   │   │   ├── register/page.tsx        # 注册页面
│   │   │   ├── verify-email/page.tsx    # 邮箱验证页面
│   │   │   └── verify-email-sent/page.tsx # 验证邮件发送成功页面
│   │   └── dashboard/page.tsx           # 用户仪表板
│   └── api/auth/
│       ├── register/route.ts            # 注册API
│       ├── login/route.ts              # 登录API
│       ├── logout/route.ts             # 登出API
│       ├── verify-email/route.ts       # 邮箱验证API
│       └── me/route.ts                 # 获取用户信息API
├── lib/
│   ├── db.ts                           # 数据库连接
│   ├── schema.ts                       # 数据库模式定义
│   ├── user-service.ts                 # 用户相关服务函数
│   ├── auth-utils.ts                   # 认证工具函数
│   ├── auth-middleware.ts              # 认证中间件
│   └── email.ts                        # 邮件服务
└── drizzle/                            # 数据库迁移文件
```

## 数据库模式

### 用户表 (users)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  name TEXT,
  email_verified TIMESTAMP,
  image TEXT,
  is_email_verified BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 验证令牌表 (verification_tokens)
```sql
CREATE TABLE verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  type TEXT NOT NULL, -- 'email_verification' | 'password_reset'
  created_at TIMESTAMP DEFAULT now()
);
```

## 环境变量配置

请确保在 `.env.local` 文件中设置以下环境变量：

```env
# 数据库配置
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# JWT配置
JWT_SECRET=your_jwt_secret_here

# Resend邮件服务配置
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# NextAuth配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 使用指南

### 1. 数据库设置

```bash
# 生成数据库迁移文件
npm run db:generate

# 运行数据库迁移
npm run db:migrate

# 打开数据库管理界面（可选）
npm run db:studio
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问页面

- 注册页面: `/auth/register`
- 登录页面: `/auth/login`
- 用户仪表板: `/dashboard`

## API 端点

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/verify-email?token=xxx` - 邮箱验证
- `GET /api/auth/me` - 获取当前用户信息

### 请求/响应格式

#### 注册请求
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "用户姓名",
  "locale": "zh"
}
```

#### 登录请求
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

#### 成功响应
```json
{
  "message": "操作成功",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "用户姓名",
    "isEmailVerified": true
  }
}
```

#### 错误响应
```json
{
  "error": "错误信息"
}
```

## 安全特性

1. **密码安全**
   - bcryptjs加密，12轮加盐
   - 密码强度验证

2. **会话安全**
   - JWT令牌认证
   - HTTP-only Cookie存储
   - 7天过期时间

3. **邮箱验证**
   - 24小时有效期令牌
   - 随机生成的安全令牌

4. **输入验证**
   - 邮箱格式验证
   - 密码强度检查
   - SQL注入防护

## 故障排除

### 常见问题

1. **JWT错误**: 确保设置了正确的 `JWT_SECRET` 环境变量
2. **邮件发送失败**: 检查 `RESEND_API_KEY` 和 `RESEND_FROM_EMAIL` 配置
3. **数据库连接错误**: 验证 `DATABASE_URL` 格式和数据库访问权限

### 调试技巧

1. 查看浏览器控制台的错误信息
2. 检查服务器日志
3. 使用 `npm run db:studio` 查看数据库状态

## 后续开发

### 待实现功能

- [ ] 忘记密码功能
- [ ] 社交登录（Google、GitHub等）
- [ ] 双因素认证
- [ ] 用户资料编辑
- [ ] 密码修改
- [ ] 账户删除

### 扩展建议

1. 添加用户角色和权限系统
2. 实现API访问频率限制
3. 添加用户活动日志
4. 集成第三方认证服务

## 贡献

欢迎提交Issues和Pull Requests来改进这个认证系统！ 