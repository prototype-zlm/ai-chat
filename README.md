# AI Chat

基于 Next.js 16（App Router）从零搭建的 AI 对话应用：支持多对话管理、流式输出、思考过程展示、Markdown 渲染、用户登录，数据持久化到 MongoDB。

## 功能特性

- 用户注册 / 登录（NextAuth Credentials + bcrypt 密码加密）
- 多对话管理：新建、切换、重命名、删除，自动生成对话标题
- 流式 AI 回复（SSE），支持思考过程（thinking）展开查看
- Markdown 渲染 + 代码高亮 + 代码块复制按钮
- 模型自定义：在应用内添加 OpenAI 兼容协议的模型（model / apiKey / baseUrl），支持多模型切换，无需改动环境变量
- 头像与文件上传
- 桌面端 / 移动端响应式布局
- 对话数据存储在 MongoDB，登录后跨设备同步

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Next.js 16（App Router）、React 19、TypeScript |
| 样式 | Tailwind CSS 4、github-markdown-css、highlight.js |
| 状态管理 | Zustand 5 |
| 数据库 | MongoDB + Mongoose 9 |
| 认证 | NextAuth 4（Credentials Provider，JWT Session） |
| Markdown | react-markdown + remark-gfm + rehype-highlight |

## 快速开始

### 1. 准备 Node 环境

需要 Node.js ≥ 20.9（建议使用 LTS 版本），可通过以下命令检查：

```bash
node -v
```

### 2. 安装依赖

```bash
npm install
```

### 3. 创建环境变量文件

在项目根目录创建 `.env`，参考 `.env.example`、`.env.development.example` 模板进行配置：

```bash
# 上传文件目录
UPLOAD_DIR=public/uploads/ai-chat

# MongoDB 连接字符串
MONGODB_URI=

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

# 系统提示词（可选）
QWEN_SYSTEM_PROMPT_ROLE_RULE=
QWEN_SYSTEM_PROMPT_THINKING_RULE=
```

> `NEXTAUTH_SECRET` 用于加密 Session，可通过 `openssl rand -base64 32` 生成一个随机字符串。

### 4. 创建 MongoDB Atlas 项目

1. 前往 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 注册并创建项目
2. 创建一个免费集群（M0 即可）
3. 在 Database Access 中创建数据库用户，在 Network Access 中放行 IP（本地开发可暂设为 `0.0.0.0/0`）
4. 点击 Connect → Drivers，复制连接字符串（形如 `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>`）
5. 将连接字符串填入 `.env` 的 `MONGODB_URI`

### 5. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。首次使用请先注册账号，然后在「设置」中添加你的模型（apiKey / baseUrl / 模型名）即可开始对话。

## 环境变量说明

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `MONGODB_URI` | 是 | MongoDB 连接字符串 |
| `NEXTAUTH_URL` | 是 | 站点地址，本地开发为 `http://localhost:3000` |
| `NEXTAUTH_SECRET` | 是 | NextAuth 加密密钥 |
| `UPLOAD_DIR` | 是 | 上传文件的存储目录 |
| `QWEN_SYSTEM_PROMPT_ROLE_RULE` | 否 | AI 角色身份系统提示词 |
| `QWEN_SYSTEM_PROMPT_THINKING_RULE` | 否 | 推理语言规则系统提示词 |

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run start` | 启动生产服务器 |
| `npm run lint` | 运行 ESLint 检查 |

## 项目结构

```
aichat/
├── app/                # 路由与接口（App Router）
│   ├── (auth)/         #   登录、注册页面
│   ├── (chat)/         #   对话主界面
│   └── api/            #   后端接口（auth、chat、dialogues、models、uploads 等）
├── components/         # 组件（chat、sidebar、header、ui、userSetDialog 等）
├── hooks/              # 自定义 Hooks（useChat、useDialogueList 等）
├── stores/             # Zustand 全局状态（chat、user、models、toast）
├── services/           # 前端 API 请求封装
├── lib/                # 后端核心（数据库连接、认证、AI 调用、模型协议）
├── models/             # Mongoose 数据模型（User、Dialogue、Message、Models）
├── types/              # TypeScript 类型定义
├── utils/              # 工具函数（SSE 解析、消息打包等）
└── constants/          # 常量定义
```
