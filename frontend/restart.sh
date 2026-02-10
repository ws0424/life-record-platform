#!/bin/bash

echo "🚀 重启前端服务以应用更新..."
echo "================================"
echo ""

# 停止现有的前端进程
echo "📌 停止现有前端进程..."
pkill -f "next dev"
sleep 2

# 检查端口占用
echo ""
echo "📌 检查端口占用..."
PORT_3001=$(lsof -ti :3001)
if [ ! -z "$PORT_3001" ]; then
    echo "⚠️  端口 3001 被占用，正在释放..."
    kill -9 $PORT_3001
    sleep 1
fi

# 启动前端服务
echo ""
echo "📌 启动前端服务..."
cd "$(dirname "$0")"
npm run dev > frontend.log 2>&1 &

# 等待服务启动
echo ""
echo "⏳ 等待服务启动..."
sleep 5

# 检查服务状态
echo ""
if lsof -ti :3001 > /dev/null; then
    echo "✅ 前端服务启动成功！"
    echo ""
    echo "🌐 访问地址："
    echo "   - 首页: http://localhost:3001/"
    echo "   - 登录: http://localhost:3001/login"
    echo "   - 注册: http://localhost:3001/register"
    echo "   - 忘记密码: http://localhost:3001/forgot-password"
    echo ""
    echo "📝 查看日志："
    echo "   tail -f frontend.log"
    echo ""
    echo "🎉 开始测试吧！"
else
    echo "❌ 前端服务启动失败"
    echo ""
    echo "📝 查看错误日志："
    echo "   tail -20 frontend.log"
fi

echo ""

