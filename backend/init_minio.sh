#!/bin/bash

# MinIO 初始化脚本

echo "🪣 MinIO 初始化脚本"
echo "================================"
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    echo "请先安装 Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# 配置 Docker 国内镜像源
echo "🔧 配置 Docker 国内镜像源..."
if [ ! -f ~/.docker/daemon.json ]; then
    echo "📝 创建 Docker 配置文件..."
    mkdir -p ~/.docker
    cat > ~/.docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com",
    "https://dockerproxy.com",
    "https://docker.nju.edu.cn"
  ]
}
EOF
    echo "✅ Docker 镜像源配置完成"
    echo "⚠️  请重启 Docker 服务使配置生效"
    echo "   macOS: 重启 Docker Desktop"
    echo "   Linux: sudo systemctl restart docker"
    echo ""
    read -p "是否已重启 Docker？(y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "请重启 Docker 后重新运行此脚本"
        exit 1
    fi
else
    echo "✅ Docker 配置文件已存在"
fi

# 检查 MinIO 容器是否运行
echo ""
echo "🔍 检查 MinIO 容器..."
if ! docker ps | grep -q utils-web-minio-dev; then
    echo "⚠️  MinIO 容器未运行"
    echo ""
    
    # 检查镜像是否已存在
    if docker images | grep -q "minio/minio"; then
        echo "✅ MinIO 镜像已存在，跳过拉取"
    else
        echo "📥 拉取 MinIO 镜像（使用国内镜像源）..."
        echo "💡 提示：如果拉取失败，可以尝试以下方法："
        echo "   1. 重启 Docker Desktop"
        echo "   2. 检查网络连接"
        echo "   3. 手动拉取：docker pull minio/minio:latest"
        echo ""
        
        # 尝试拉取镜像，设置超时
        if timeout 300 docker pull minio/minio:latest; then
            echo "✅ MinIO 镜像拉取成功"
        else
            echo "❌ MinIO 镜像拉取失败"
            echo ""
            echo "🔧 尝试使用备用方案："
            echo "   1. 使用已有镜像（如果存在）"
            echo "   2. 或者手动下载镜像"
            echo ""
            
            # 检查是否有旧版本镜像
            if docker images | grep -q "minio/minio"; then
                echo "✅ 发现已有 MinIO 镜像，将使用现有镜像"
            else
                echo "❌ 未找到 MinIO 镜像，请手动拉取："
                echo "   docker pull minio/minio:latest"
                echo ""
                read -p "是否继续使用 docker-compose 启动（可能会自动拉取）？(y/n) " -n 1 -r
                echo ""
                if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                    echo "已取消"
                    exit 1
                fi
            fi
        fi
    fi
    
    echo ""
    echo "🚀 启动 MinIO 容器..."
    cd ../docker
    
    # 使用 docker-compose 启动，设置超时
    if timeout 120 docker compose -f docker-compose.dev.yml up -d minio; then
        echo "✅ MinIO 容器启动命令执行成功"
    else
        echo "❌ MinIO 容器启动失败"
        cd ../backend
        exit 1
    fi
    
    cd ../backend
    
    # 等待 MinIO 启动（智能等待）
    echo "⏳ 等待 MinIO 启动..."
    MAX_WAIT=60
    WAIT_COUNT=0
    
    while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
        if docker ps | grep -q utils-web-minio-dev; then
            # 检查健康状态
            if docker exec utils-web-minio-dev curl -f http://localhost:9000/minio/health/live &>/dev/null; then
                echo ""
                echo "✅ MinIO 已启动并就绪"
                break
            fi
        fi
        echo -n "."
        sleep 1
        WAIT_COUNT=$((WAIT_COUNT + 1))
    done
    
    if [ $WAIT_COUNT -ge $MAX_WAIT ]; then
        echo ""
        echo "⚠️  MinIO 启动超时，但容器可能仍在启动中"
        echo "   请稍后手动检查：docker ps | grep minio"
    fi
    echo ""
fi

echo "✅ MinIO 容器正在运行"
echo ""

# 配置 MinIO Client
echo "🔧 配置 MinIO Client..."
docker exec utils-web-minio-dev mc alias set local http://localhost:9000 minioadmin minioadmin123

# 创建 bucket
echo ""
echo "📦 创建 utils-web bucket..."
docker exec utils-web-minio-dev mc mb local/utils-web 2>/dev/null || echo "   Bucket 已存在"

# 设置 bucket 为公开访问
echo ""
echo "🔓 设置 bucket 为公开访问..."
docker exec utils-web-minio-dev mc anonymous set public local/utils-web

# 查看 bucket 列表
echo ""
echo "📋 Bucket 列表:"
docker exec utils-web-minio-dev mc ls local/

# 查看 bucket 策略
echo ""
echo "🔐 Bucket 策略:"
docker exec utils-web-minio-dev mc anonymous get local/utils-web

echo ""
echo "================================"
echo "✅ MinIO 初始化完成！"
echo ""
echo "📍 访问地址:"
echo "   - MinIO API: http://localhost:9000"
echo "   - MinIO Console: http://localhost:9001"
echo ""
echo "🔑 登录信息:"
echo "   - 用户名: minioadmin"
echo "   - 密码: minioadmin123"
echo ""
echo "📦 Bucket 信息:"
echo "   - Bucket 名称: utils-web"
echo "   - 访问权限: 公开读取"
echo "   - API 地址: http://localhost:9000/utils-web/"
echo ""
echo "💡 测试上传:"
echo "   echo 'Hello MinIO' > test.txt"
echo "   docker exec utils-web-minio-dev mc cp test.txt local/utils-web/"
echo "   curl http://localhost:9000/utils-web/test.txt"
echo ""
echo "🔧 Docker 镜像源配置:"
echo "   - 配置文件: ~/.docker/daemon.json"
echo "   - 镜像源: 中科大、网易、百度、南京大学"
echo ""

