"""
测试内容 API
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/v1"

# 测试用的 token（需要先登录获取）
TOKEN = None

def login():
    """登录获取 token"""
    global TOKEN
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "username": "test",
            "password": "test123456"
        }
    )
    if response.status_code == 200:
        data = response.json()
        TOKEN = data["data"]["access_token"]
        print(f"✅ 登录成功，Token: {TOKEN[:20]}...")
        return True
    else:
        print(f"❌ 登录失败: {response.text}")
        return False

def get_headers():
    """获取请求头"""
    return {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }

def test_create_content():
    """测试创建内容"""
    print("\n📝 测试创建内容...")
    
    # 创建日常记录
    response = requests.post(
        f"{BASE_URL}/content/",
        headers=get_headers(),
        json={
            "type": "daily",
            "title": "测试日常记录",
            "description": "这是一条测试的日常记录",
            "content": "今天天气很好，心情也很好！",
            "tags": ["测试", "日常"],
            "images": [],
            "is_public": True
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        content_id = data["data"]["id"]
        print(f"✅ 创建成功，ID: {content_id}")
        return content_id
    else:
        print(f"❌ 创建失败: {response.text}")
        return None

def test_get_content(content_id):
    """测试获取内容详情"""
    print(f"\n🔍 测试获取内容详情 - ID: {content_id}")
    
    response = requests.get(
        f"{BASE_URL}/content/{content_id}",
        headers=get_headers()
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 获取成功")
        print(f"   标题: {data['data']['title']}")
        print(f"   浏览数: {data['data']['view_count']}")
        print(f"   点赞数: {data['data']['like_count']}")
        return True
    else:
        print(f"❌ 获取失败: {response.text}")
        return False

def test_list_contents():
    """测试获取内容列表"""
    print("\n📋 测试获取内容列表...")
    
    response = requests.get(
        f"{BASE_URL}/content/",
        headers=get_headers(),
        params={"page": 1, "page_size": 10}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 获取成功")
        print(f"   总数: {data['data']['total']}")
        print(f"   当前页: {data['data']['page']}")
        print(f"   每页数量: {data['data']['page_size']}")
        return True
    else:
        print(f"❌ 获取失败: {response.text}")
        return False

def test_toggle_like(content_id):
    """测试点赞"""
    print(f"\n👍 测试点赞 - ID: {content_id}")
    
    response = requests.post(
        f"{BASE_URL}/content/{content_id}/like",
        headers=get_headers()
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 点赞成功")
        print(f"   是否点赞: {data['data']['is_liked']}")
        print(f"   点赞数: {data['data']['like_count']}")
        return True
    else:
        print(f"❌ 点赞失败: {response.text}")
        return False

def test_toggle_save(content_id):
    """测试收藏"""
    print(f"\n⭐ 测试收藏 - ID: {content_id}")
    
    response = requests.post(
        f"{BASE_URL}/content/{content_id}/save",
        headers=get_headers()
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 收藏成功")
        print(f"   是否收藏: {data['data']['is_saved']}")
        print(f"   收藏数: {data['data']['save_count']}")
        return True
    else:
        print(f"❌ 收藏失败: {response.text}")
        return False

def test_create_comment(content_id):
    """测试创建评论"""
    print(f"\n💬 测试创建评论 - ID: {content_id}")
    
    response = requests.post(
        f"{BASE_URL}/content/{content_id}/comments",
        headers=get_headers(),
        json={
            "comment_text": "这是一条测试评论"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        comment_id = data["data"]["id"]
        print(f"✅ 评论成功，ID: {comment_id}")
        return comment_id
    else:
        print(f"❌ 评论失败: {response.text}")
        return None

def test_get_comments(content_id):
    """测试获取评论列表"""
    print(f"\n📋 测试获取评论列表 - ID: {content_id}")
    
    response = requests.get(
        f"{BASE_URL}/content/{content_id}/comments",
        headers=get_headers(),
        params={"page": 1, "page_size": 10}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 获取成功")
        print(f"   评论数: {data['data']['total']}")
        return True
    else:
        print(f"❌ 获取失败: {response.text}")
        return False

def test_daily_list():
    """测试获取日常记录列表"""
    print("\n📋 测试获取日常记录列表...")
    
    response = requests.get(
        f"{BASE_URL}/content/daily/list",
        headers=get_headers(),
        params={"page": 1, "page_size": 10}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 获取成功")
        print(f"   总数: {data['data']['total']}")
        return True
    else:
        print(f"❌ 获取失败: {response.text}")
        return False

def test_explore():
    """测试探索接口"""
    print("\n🔍 测试探索接口...")
    
    response = requests.get(
        f"{BASE_URL}/content/explore/list",
        headers=get_headers(),
        params={"page": 1, "page_size": 10, "category": "all"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ 获取成功")
        print(f"   总数: {data['data']['total']}")
        return True
    else:
        print(f"❌ 获取失败: {response.text}")
        return False

def main():
    """主函数"""
    print("=" * 50)
    print("开始测试内容 API")
    print("=" * 50)
    
    # 登录
    if not login():
        print("\n❌ 登录失败，无法继续测试")
        return
    
    # 创建内容
    content_id = test_create_content()
    if not content_id:
        print("\n❌ 创建内容失败，无法继续测试")
        return
    
    # 获取内容详情
    test_get_content(content_id)
    
    # 获取内容列表
    test_list_contents()
    
    # 点赞
    test_toggle_like(content_id)
    
    # 收藏
    test_toggle_save(content_id)
    
    # 创建评论
    comment_id = test_create_comment(content_id)
    
    # 获取评论列表
    if comment_id:
        test_get_comments(content_id)
    
    # 获取日常记录列表
    test_daily_list()
    
    # 测试探索接口
    test_explore()
    
    print("\n" + "=" * 50)
    print("✅ 所有测试完成！")
    print("=" * 50)

if __name__ == "__main__":
    main()

