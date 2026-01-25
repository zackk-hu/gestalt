# Gestalt - AI Prompt Compiler
# Dockerfile for ModelScope Studio

FROM node:18-alpine

WORKDIR /home/user/app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 设置运行环境
ENV NODE_ENV=production
ENV PORT=7860
ENV HOSTNAME=0.0.0.0

# 暴露端口
EXPOSE 7860

# 启动命令
CMD ["npm", "start"]
