# Aiartools - AI 图像编辑工具

一个现代化的 AI 图像编辑 Web 应用，基于 Next.js 15 构建，使用 **FLUX.1 Kontext [pro]** 前沿模型提供强大的图像编辑功能。

## ✨ 主要特性

- 🎨 **智能图像编辑** - 基于 FLUX.1 Kontext Pro 的前沿 AI 模型
- 🌍 **多语言支持** - 支持中文和英文界面
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🚀 **实时处理** - 快速的图像处理和预览
- 💡 **多种编辑模式** - 智能、精确、创意三种编辑模式
- 🎯 **背景移除** - 基于 Kontext Pro 的智能背景移除
- 📐 **纵横比控制** - 支持9种纵横比选项 (21:9, 16:9, 4:3, 3:2, 1:1, 2:3, 3:4, 9:16, 9:21)
- 🖼️ **多格式支持** - 支持 JPG, JPEG, PNG, WebP, AVIF 格式
- 📁 **本地下载** - 支持处理结果本地保存
- 🔒 **安全性保障** - 文件验证与 API 密钥保护

## 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 组件**: Shadcn/ui + Tailwind CSS
- **AI 模型**: FLUX.1 Kontext [pro] (通过 fal.ai)
- **国际化**: next-intl
- **类型检查**: TypeScript
- **样式**: Tailwind CSS + CSS Variables
- **数据库**: Drizzle ORM
- **认证**: NextAuth.js
- **图像处理**: Sharp
- **状态管理**: Zustand

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/ItusiAI/Open-Aiartools.git
cd Open-Aiartools
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 3. 环境配置

复制 `.env.example` 到 `.env.local` 文件并添加您的 API 密钥：

```env
# Fal AI API配置
# 从 https://fal.ai 获取您的API密钥
FAL_KEY=your_fal_api_key_here

# DeepSeek API配置
# 从 https://platform.deepseek.com 获取您的API密钥
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 数据库配置
# Neon数据库连接字符串
DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require

# NextAuth.js配置
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Resend邮件服务配置
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com

# JWT配置
JWT_SECRET=your_jwt_secret_here

# Stripe支付配置
# 从 https://stripe.com 获取您的API密钥
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
STRIPE_PRICE_ID=your_stripe_price_id_here
```

环境变量配置说明：
1. 访问 [fal.ai](https://fal.ai) 注册账户，获取FAL_KEY
2. 访问 [platform.deepseek.com](https://platform.deepseek.com) 注册账户，获取DEEPSEEK_API_KEY
3. 访问 [neon.tech](https://neon.tech) 创建数据库，获取DATABASE_URL
4. 访问 [resend.com](https://resend.com) 注册账户，获取RESEND_API_KEY
5. 访问 [stripe.com](https://stripe.com) 注册账户，获取Stripe API密钥和价格ID
6. 生成安全的密钥用于NEXTAUTH_SECRET和JWT_SECRET

### 4. 获取 API 密钥

访问 [fal.ai](https://fal.ai) 获取您的 API 密钥，该密钥用于访问 FLUX.1 Kontext [pro] 模型。

### 5. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📋 API 端点

### POST /api/edit-image

上传图像并进行 AI 编辑。

**支持的操作 (action):**
- `smart` - 智能编辑（默认）
- `precise` - 精确编辑
- `creative` - 创意编辑  
- `remove_background` - 背景移除

**请求参数:**
- `image` (File) - 图像文件 (支持 JPG, JPEG, PNG, WebP, AVIF)
- `prompt` (String) - 编辑提示词（背景移除时可选）
- `action` (String) - 操作类型（可选，默认为 smart）
- `guidance_scale` (Number) - 引导比例（可选）
- `strength` (Number) - 编辑强度（可选）
- `aspect_ratio` (String) - 生成图片纵横比（可选）

### GET /api/edit-image

获取 API 信息和使用说明。

## 🎯 AI 模型

本项目专注使用 **FLUX.1 Kontext [pro]** 模型：

- `fal-ai/flux-pro/kontext` - 前沿图像编辑模型，具有强大的上下文理解能力

## 🌐 多语言支持

支持以下语言：
- 🇨🇳 中文 (简体)
- 🇺🇸 English

语言文件位于 `messages/` 目录下。

## 📁 项目结构

```
Open-Aiartools/
├── app/                    # Next.js 14 App Router
│   ├── [locale]/          # 国际化路由
│   │   ├── auth/          # 认证相关页面
│   │   ├── dashboard/     # 用户仪表盘
│   │   ├── payment/       # 支付相关页面
│   │   └── page.tsx       # 主页面
│   ├── api/               # API 路由
│   │   ├── auth/          # 认证 API
│   │   ├── edit-image/    # 图像编辑 API
│   │   ├── batch-process/ # 批量处理 API
│   │   └── stripe/        # 支付 API
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── ui/                # UI 基础组件
│   ├── editor/            # 编辑器相关组件
│   ├── hero-section.tsx   # 首页英雄区组件
│   ├── features-section.tsx # 特性展示组件
│   └── ...                # 其他业务组件
├── lib/                   # 工具库
│   ├── fal-client.ts      # Fal AI 客户端
│   ├── auth.ts            # 认证工具
│   ├── db.ts              # 数据库连接
│   ├── schema.ts          # 数据库模式
│   ├── image-utils.ts     # 图像处理工具
│   └── utils.ts           # 工具函数
├── hooks/                 # 自定义 React Hooks
├── store/                 # 状态管理
├── drizzle/               # 数据库迁移
├── messages/              # 国际化消息
├── public/                # 静态资源
│   ├── images/            # 图片资源
│   └── ...                # 其他静态资源
└── styles/                # 样式文件
```

## 🧪 开发工具

### 连接测试

```bash
# 测试 Fal AI 连接
npm run test:fal
```

### 数据库管理

```bash
# 运行数据库迁移
npm run db:migrate

# 生成新的迁移文件
npm run db:generate
```

### 代码检查

```bash
# TypeScript 类型检查
npm run type-check

# ESLint 检查
npm run lint

# 格式化代码
npm run format
```

## 🎨 自定义主题

项目使用 CSS Variables 进行主题定制，主要变量定义在 `styles/globals.css` 中。您可以通过修改这些变量来自定义应用的外观。支持亮色和暗色两种主题模式。

## 📱 响应式设计

- 移动端优先的响应式设计
- 支持触摸操作和手势
- 适配各种屏幕尺寸，从手机到超宽显示器
- 针对不同设备优化的用户界面
- 支持横屏和竖屏模式切换

## 🔒 安全性

- 文件类型验证和过滤
- 文件大小限制 (最大 5MB)
- API 密钥环境变量管理
- 内容安全策略 (CSP)
- 用户认证和授权
- 数据加密和安全存储
- 防止 XSS 和 CSRF 攻击

## 📄 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📞 支持

如需帮助，请：
1. 查看 [Issues](https://github.com/ItusiAI/Open-Aiartools/issues)
2. 创建新的 Issue
3. 查看 [fal.ai 文档](https://fal.ai/models/fal-ai/flux-pro/kontext/api)
4. 联系项目维护者

## 📐 纵横比支持

支持以下纵横比选项：
- `21:9` - 超宽屏
- `16:9` - 宽屏  
- `4:3` - 标准
- `3:2` - 经典
- `1:1` - 正方形
- `2:3` - 竖版经典
- `3:4` - 竖版标准
- `9:16` - 竖版宽屏
- `9:21` - 竖版超宽

## 📁 支持的文件格式

- **JPG/JPEG** - 标准JPEG格式
- **PNG** - 支持透明背景的PNG格式  
- **WebP** - 现代Web图片格式
- **AVIF** - 最新一代图片格式
- **文件大小限制**: 5MB
---

使用 ❤️ 和 AI 构建 | [官方网站](https://aiartools.com) | [GitHub](https://github.com/ItusiAI/Open-Aiartools)