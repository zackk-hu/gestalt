# Gestalt - AI Prompt Compiler
FROM node:18-alpine

WORKDIR /home/user/app

# 安装必要的依赖（s3fs 等可能需要的系统库）
RUN apk add --no-cache libc6-compat

# 复制 package 文件并安装依赖
COPY package*.json ./
RUN npm ci

# 复制源代码并构建
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# --- 关键修改部分 ---
# 设置运行环境
ENV NODE_ENV=production
ENV PORT=7860
ENV HOSTNAME=0.0.0.0

# 确保静态资源被正确链接（standalone 模式必需）
RUN cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/public

# 暴露端口
EXPOSE 7860

# 使用 node 直接运行 standalone 脚本，而不是 npm start
CMD ["node", ".next/standalone/server.js"]