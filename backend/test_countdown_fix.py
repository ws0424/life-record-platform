#!/usr/bin/env python3
"""测试倒计时接口修复"""

import requests
import json

# API 基础 URL
BASE_URL = "http://localhost:8000/api/v1"

def test_countdown_list():
    """测试获取倒计时列表"""
    print("🔍 测试倒计时列表接口...")
    
    # 这里需要替换为实际的 token
    # 你可以先登录获取 token，或者使用已有的 token
    headers = {
        "Authorization": "Bearer YOUR_TOKEN_HERE"
    }
    
    url = f"{BASE_URL}/tools/countdown?page=1&page_size=100"
    
    try:
        response = requests.get(url, headers=headers)
        print(f"状态码: {response.status_code}")
        print(f"响应内容: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        
        if response.status_code == 200:
            print("✅ 接口调用成功！")
            data = response.json()
            if data.get('code') == 200:
                print("✅ 数据格式正确！")
                return True
            else:
                print(f"❌ 返回错误: {data.get('msg')}")
                return False
        else:
            print(f"❌ HTTP 错误: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ 请求失败: {str(e)}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("倒计时接口修复测试")
    print("=" * 50)
    print()
    print("⚠️  请确保:")
    print("1. 后端服务已启动 (python backend/main.py)")
    print("2. 修改脚本中的 YOUR_TOKEN_HERE 为实际的认证 token")
    print()
    
    # test_countdown_list()
    
    print()
    print("=" * 50)
    print("修复说明:")
    print("=" * 50)
    print("✅ 已在所有 Response Schema 中添加 UUID 到字符串的转换器")
    print("✅ 修复的 Schema:")
    print("   - CountdownResponse")
    print("   - TodoResponse")
    print("   - ExpenseResponse")
    print("   - HabitResponse")
    print("   - HabitRecordResponse")
    print("   - NoteResponse")
    print()
    print("🔧 修复方法:")
    print("   使用 @field_validator 装饰器在序列化前将 UUID 对象转换为字符串")
    print()
    print("📝 需要重启后端服务以应用更改:")
    print("   cd backend && python main.py")

