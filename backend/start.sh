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

# 检查 Docker 服务
echo ""
echo "🔍 检查 Docker 服务..."
if command -v docker &> /dev/null; then
    # 检查 PostgreSQL
    if docker ps | grep -q utils-web-db-dev; then
        echo "✅ PostgreSQL 正在运行"
    else
        echo "⚠️  PostgreSQL 未运行"
        echo "   启动命令: cd ../docker && docker compose -f docker-compose.dev.yml up -d db"
    fi
    
    # 检查 Redis
    if docker ps | grep -q utils-web-redis-dev; then
        echo "✅ Redis 正在运行"
    else
        echo "⚠️  Redis 未运行"
        echo "   启动命令: cd ../docker && docker compose -f docker-compose.dev.yml up -d redis"
    fi
    
    # 检查 MinIO
    if docker ps | grep -q utils-web-minio-dev; then
        echo "✅ MinIO 正在运行"
        
        # 初始化 MinIO Bucket（如果需要）
        echo "🪣 检查 MinIO Bucket..."
        docker exec utils-web-minio-dev mc alias set local http://localhost:9000 minioadmin minioadmin123 2>/dev/null || true
        docker exec utils-web-minio-dev mc mb local/utils-web 2>/dev/null || true
        docker exec utils-web-minio-dev mc anonymous set public local/utils-web 2>/dev/null || true
    else
        echo "⚠️  MinIO 未运行"
        echo "   启动命令: cd ../docker && docker compose -f docker-compose.dev.yml up -d minio"
    fi
else
    echo "⚠️  Docker 未安装或未运行"
fi

# 启动服务
echo ""
echo "🌐 启动 FastAPI 服务..."
echo "📍 访问地址:"
echo "   - API 文档: http://localhost:8000/docs"
echo "   - ReDoc: http://localhost:8000/redoc"
echo "   - 健康检查: http://localhost:8000/health"
echo ""
echo "📦 MinIO 服务:"
echo "   - MinIO API: http://localhost:9000"
echo "   - MinIO Console: http://localhost:9001"
echo "   - 用户名: minioadmin"
echo "   - 密码: minioadmin123"
echo ""
echo "💡 提示:"
echo "   - 按 Ctrl+C 停止服务"
echo "   - 数据库未启动时服务仍可运行，但无法使用需要数据库的功能"
echo "   - MinIO 未启动时无法上传文件"
echo ""

python main.py

