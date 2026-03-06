#!/usr/bin/env python3
"""
Prompt Optimizer - AI 提示词优化器
ModelScope Studio 入口文件

此脚本用于启动 Next.js 生产服务器
服务监听 0.0.0.0:7860
"""

import os
import subprocess
import sys

def main():
    # 设置环境变量
    os.environ['PORT'] = '7860'
    os.environ['HOSTNAME'] = '0.0.0.0'
    
    print("=" * 50)
    print("Prompt Optimizer - AI 提示词优化器")
    print("服务地址: http://0.0.0.0:7860")
    print("=" * 50)
    
    # 检查并安装依赖
    if not os.path.exists('node_modules'):
        print("正在安装依赖...")
        subprocess.run(['npm', 'ci'], check=True)
    
    # 检查是否已构建
    if not os.path.exists('.next'):
        print("正在构建项目...")
        subprocess.run(['npm', 'run', 'build'], check=True)
    
    # 启动 Next.js 生产服务器
    print("启动服务...")
    subprocess.run(['npm', 'start'], check=True)

if __name__ == '__main__':
    main()
