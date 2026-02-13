#!/usr/bin/env python3
"""
测试我的创作相关的 API 接口
"""
import requests
import json
import sys

# 配置
BASE_URL = "http://localhost:8000"
TOKEN = None  # 需要先登录获取 token

def print_result(name, success, message=""):
    """打印测试结果"""
    status = "✅" if success else "❌"
    print(f"{status} {name}")
    if message:
        print(f"   {message}")

def get_headers():
    """获取请求头"""
    if not TOKEN:
        return {"Content-Type": "application/json"}
    return {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {TOKEN}"
    }

def test_login():
    """测试登录并获取 token"""
    global TOKEN
    
    print("\n🔐 测试登录...")
    
    # 这里需要替换为实际的测试账号
    data = {
        "username": "test@example.com",
        "password": "test123456"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            TOKEN = result.get("data", {}).get("access_token")
            print_result("登录", True, f"Token: {TOKEN[:20]}...")
            return True
        else:
            print_result("登录", False, f"状态码: {response.status_code}")
            return False
    except Exception as e:
        print_result("登录", False, str(e))
        return False

def test_my_works():
    """测试获取我的作品"""
    print("\n📝 测试获取我的作品...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/content/my/works?page=1&page_size=12",
            headers=get_headers()
        )
        
        if response.status_code == 200:
            result = response.json()
            data = result.get("data", {})
            total = data.get("total", 0)
            print_result("获取我的作品", True, f"总数: {total}")
            return True
        else:
            print_result("获取我的作品", False, f"状态码: {response.status_code}")
            print(f"   响应: {response.text}")
            return False
    except Exception as e:
        print_result("获取我的作品", False, str(e))
        return False

def test_my_views():
    """测试获取浏览记录"""
    print("\n👀 测试获取浏览记录...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/content/my/views?page=1&page_size=12",
            headers=get_headers()
        )
        
        if response.status_code == 200:
            result = response.json()
            data = result.get("data", {})
            total = data.get("total", 0)
            print_result("获取浏览记录", True, f"总数: {total}")
            return True
        else:
            print_result("获取浏览记录", False, f"状态码: {response.status_code}")
            return False
    except Exception as e:
        print_result("获取浏览记录", False, str(e))
        return False

def test_my_likes():
    """测试获取点赞记录"""
    print("\n❤️ 测试获取点赞记录...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/content/my/likes?page=1&page_size=12",
            headers=get_headers()
        )
        
        if response.status_code == 200:
            result = response.json()
            data = result.get("data", {})
            total = data.get("total", 0)
            print_result("获取点赞记录", True, f"总数: {total}")
            return True
        else:
            print_result("获取点赞记录", False, f"状态码: {response.status_code}")
            return False
    except Exception as e:
        print_result("获取点赞记录", False, str(e))
        return False

def test_my_comments():
    """测试获取评论记录"""
    print("\n💬 测试获取评论记录...")
    
    try:
        response = requests.get(
            f"{BASE_URL}/api/content/my/comments?page=1&page_size=12",
            headers=get_headers()
        )
        
        if response.status_code == 200:
            result = response.json()
            data = result.get("data", {})
            total = data.get("total", 0)
            print_result("获取评论记录", True, f"总数: {total}")
            return True
        else:
            print_result("获取评论记录", False, f"状态码: {response.status_code}")
            return False
    except Exception as e:
        print_result("获取评论记录", False, str(e))
        return False

def test_content_visibility():
    """测试隐藏/公开作品"""
    print("\n👁️ 测试隐藏/公开作品...")
    
    # 首先获取一个作品 ID
    try:
        response = requests.get(
            f"{BASE_URL}/api/content/my/works?page=1&page_size=1",
            headers=get_headers()
        )
        
        if response.status_code != 200:
            print_result("获取作品ID", False, "无法获取作品列表")
            return False
        
        result = response.json()
        items = result.get("data", {}).get("items", [])
        
        if not items:
            print_result("测试隐藏/公开", False, "没有作品可测试")
            return False
        
        content_id = items[0]["id"]
        
        # 测试隐藏
        response = requests.post(
            f"{BASE_URL}/api/content/{content_id}/hide",
            headers=get_headers()
        )
        
        if response.status_code == 200:
            print_result("隐藏作品", True)
        else:
            print_result("隐藏作品", False, f"状态码: {response.status_code}")
            return False
        
        # 测试公开
        response = requests.post(
            f"{BASE_URL}/api/content/{content_id}/show",
            headers=get_headers()
        )
        
        if response.status_code == 200:
            print_result("公开作品", True)
            return True
        else:
            print_result("公开作品", False, f"状态码: {response.status_code}")
            return False
            
    except Exception as e:
        print_result("测试隐藏/公开", False, str(e))
        return False

def test_database():
    """测试数据库表是否存在"""
    print("\n🗄️ 测试数据库...")
    
    try:
        import sys
        import os
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        
        from sqlalchemy import inspect
        from app.core.database import engine
        
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        required_tables = ['contents', 'content_views', 'content_likes', 'content_saves', 'comments']
        
        for table in required_tables:
            if table in tables:
                print_result(f"表 {table}", True)
            else:
                print_result(f"表 {table}", False, "表不存在")
        
        return True
    except Exception as e:
        print_result("数据库检查", False, str(e))
        return False

def main():
    """主函数"""
    print("=" * 60)
    print("🧪 我的创作功能 API 测试")
    print("=" * 60)
    
    # 测试数据库
    test_database()
    
    # 测试登录
    if not test_login():
        print("\n⚠️  需要先登录才能测试其他接口")
        print("请在代码中设置正确的测试账号")
        return
    
    # 测试各个接口
    results = []
    results.append(("我的作品", test_my_works()))
    results.append(("浏览记录", test_my_views()))
    results.append(("点赞记录", test_my_likes()))
    results.append(("评论记录", test_my_comments()))
    results.append(("隐藏/公开", test_content_visibility()))
    
    # 统计结果
    print("\n" + "=" * 60)
    print("📊 测试结果统计")
    print("=" * 60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\n通过: {passed}/{total}")
    print(f"失败: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 所有测试通过！")
    else:
        print("\n⚠️  部分测试失败，请检查日志")

if __name__ == "__main__":
    main()

