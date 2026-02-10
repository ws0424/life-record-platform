#!/bin/bash

# 后端服务启动脚本

echo "🚀 启动后端服务..."
echo ""

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "❌ 虚拟环境不存在！"
    echo "请先运行: ./setup.sh"
    exit 1
fi

# 激活虚拟环境
echo "📦 激活虚拟环境..."
source venv/bin/activate

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚠️  .env 文件不存在，从 .env.example 复制..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件配置数据库和邮件服务"
fi

# 启动服务
echo ""
echo "🌐 启动 FastAPI 服务..."
echo "📍 访问地址:"
echo "   - API 文档: http://localhost:8000/docs"
echo "   - ReDoc: http://localhost:8000/redoc"
echo "   - 健康检查: http://localhost:8000/health"
echo ""
echo "💡 提示:"
echo "   - 按 Ctrl+C 停止服务"
echo "   - 数据库未启动时服务仍可运行，但无法使用需要数据库的功能"
echo ""

python main.py

