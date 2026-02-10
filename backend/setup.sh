#!/bin/bash

echo "🚀 后端项目初始化脚本"
echo "================================"
echo ""

# 检查 Python 版本
echo "📌 检查 Python 版本..."
python3 --version

# 检查虚拟环境
echo ""
if [ -d "venv" ]; then
    echo "✅ 虚拟环境已存在: backend/venv"
    echo "📦 激活虚拟环境..."
    source venv/bin/activate
    echo "✅ 虚拟环境已激活"
else
    echo "📦 虚拟环境不存在，是否创建？(y/n)"
    read -r create_venv
    if [ "$create_venv" = "y" ]; then
        echo "创建虚拟环境..."
        python3 -m venv venv
        echo "激活虚拟环境..."
        source venv/bin/activate
        echo "✅ 虚拟环境已创建并激活"
    fi
fi

# 安装依赖
echo ""
echo "📥 安装依赖包..."
if [ -d "venv" ] && [ -n "$VIRTUAL_ENV" ]; then
    pip install -r requirements.txt
else
    pip3 install -r requirements.txt
fi

# 创建 .env 文件
echo ""
if [ ! -f .env ]; then
    echo "📝 创建 .env 文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件，配置数据库、Redis 和邮件服务"
else
    echo "✅ .env 文件已存在"
fi

# 配置 Docker 国内镜像源
echo ""
echo "🐳 配置 Docker 国内镜像源..."
if command -v docker &> /dev/null; then
    echo "✅ Docker 已安装"
    
    # 检查是否已配置镜像源
    if [ -f ~/.docker/daemon.json ]; then
        echo "📝 Docker 配置文件已存在"
    else
        echo "📝 创建 Docker 配置文件..."
        mkdir -p ~/.docker
        cat > ~/.docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF
        echo "✅ Docker 镜像源配置完成"
        echo "⚠️  请重启 Docker 服务使配置生效"
        echo "   macOS: 重启 Docker Desktop"
        echo "   Linux: sudo systemctl restart docker"
    fi
else
    echo "⚠️  Docker 未安装"
    echo "   请先安装 Docker: https://docs.docker.com/get-docker/"
fi

# 检查 PostgreSQL
echo ""
echo "🔍 检查 PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL 已安装"
else
    echo "⚠️  PostgreSQL 未安装"
    echo "   使用 Docker 启动: docker run -d --name postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=utils_web -p 5432:5432 postgres:15"
fi

# 检查 Redis
echo ""
echo "🔍 检查 Redis..."
if command -v redis-cli &> /dev/null; then
    echo "✅ Redis 已安装"
else
    echo "⚠️  Redis 未安装"
    echo "   使用 Docker 启动: docker run -d --name redis -p 6379:6379 redis:7"
fi

echo ""
echo "================================"
echo "✅ 初始化完成！"
echo ""
echo "📖 下一步："
echo "   1. 编辑 .env 文件配置数据库和邮件服务"
echo "   2. 如果配置了 Docker 镜像源，请重启 Docker"
echo "   3. 启动 PostgreSQL 和 Redis"
echo "   4. 激活虚拟环境: source venv/bin/activate"
echo "   5. 运行服务: python main.py"
echo ""
echo "💡 提示："
echo "   - 虚拟环境位置: backend/venv"
echo "   - 激活命令: source venv/bin/activate"
echo "   - 退出命令: deactivate"
echo "   - Docker 镜像源配置: ~/.docker/daemon.json"
echo ""

