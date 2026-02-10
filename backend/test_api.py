#!/usr/bin/env python3
"""
测试后端 API 的基本功能
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_health_check():
    """测试健康检查"""
    print("🔍 测试健康检查...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

def test_send_code():
    """测试发送验证码"""
    print("📧 测试发送验证码...")
    data = {
        "email": "test@example.com",
        "type": "register"
    }
    response = requests.post(f"{BASE_URL}/api/auth/send-code", json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    print()

def test_register():
    """测试用户注册"""
    print("👤 测试用户注册...")
    data = {
        "email": "test@example.com",
        "code": "123456",
        "username": "测试用户",
        "password": "test123",
        "confirm_password": "test123"
    }
    response = requests.post(f"{BASE_URL}/api/auth/register", json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()
    return response.json()

def test_login():
    """测试用户登录"""
    print("🔐 测试用户登录...")
    data = {
        "email": "test@example.com",
        "password": "test123",
        "remember": False
    }
    response = requests.post(f"{BASE_URL}/api/auth/login", json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print()
    return response.json()

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 开始测试后端 API")
    print("=" * 60)
    print()
    
    try:
        # 测试健康检查
        test_health_check()
        
        # 测试发送验证码
        # test_send_code()
        
        # 测试注册
        # test_register()
        
        # 测试登录
        # test_login()
        
        print("=" * 60)
        print("✅ 测试完成")
        print("=" * 60)
    except requests.exceptions.ConnectionError:
        print("❌ 错误: 无法连接到服务器")
        print("请确保后端服务已启动: python main.py")
    except Exception as e:
        print(f"❌ 错误: {e}")

