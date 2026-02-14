"""
相册 API 测试脚本

测试相册的创建、查询、统计、搜索等功能
"""

import requests
import json
from datetime import datetime

# 配置
BASE_URL = "http://localhost:8000/api/v1"
TEST_USER = {
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123456"
}

# 全局变量
token = None
album_id = None


def print_response(title, response):
    """打印响应信息"""
    print(f"\n{'='*60}")
    print(f"📋 {title}")
    print(f"{'='*60}")
    print(f"状态码: {response.status_code}")
    try:
        data = response.json()
        print(f"响应: {json.dumps(data, indent=2, ensure_ascii=False)}")
    except:
        print(f"响应: {response.text}")
    print(f"{'='*60}\n")


def register_and_login():
    """注册并登录"""
    global token
    
    print("🔐 步骤 1: 注册用户")
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json=TEST_USER
    )
    print_response("注册结果", response)
    
    print("🔐 步骤 2: 登录")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "username": TEST_USER["username"],
            "password": TEST_USER["password"]
        }
    )
    print_response("登录结果", response)
    
    if response.status_code == 200:
        data = response.json()
        token = data["data"]["access_token"]
        print(f"✅ 登录成功，Token: {token[:50]}...")
    else:
        print("❌ 登录失败")
        return False
    
    return True


def create_test_albums():
    """创建测试相册"""
    global album_id
    
    albums = [
        {
            "type": "album",
            "title": "春日樱花",
            "description": "2024年春天的樱花季，记录了最美的粉色时光",
            "content": "在京都的春天，樱花盛开的季节，我用镜头记录下了这些美好的瞬间。",
            "tags": ["樱花", "春天", "京都", "摄影"],
            "images": [
                "https://example.com/sakura1.jpg",
                "https://example.com/sakura2.jpg",
                "https://example.com/sakura3.jpg",
                "https://example.com/sakura4.jpg"
            ],
            "videos": [],
            "video_thumbnails": [],
            "location": "日本京都",
            "extra_data": {
                "photo_count": 24,
                "cover_images": [
                    "https://example.com/sakura1.jpg",
                    "https://example.com/sakura2.jpg",
                    "https://example.com/sakura3.jpg",
                    "https://example.com/sakura4.jpg"
                ]
            },
            "is_public": True
        },
        {
            "type": "album",
            "title": "夏日海边",
            "description": "阳光、沙滩、海浪，夏天的美好回忆",
            "content": "在海边度过的美好时光，蓝天白云，碧海金沙。",
            "tags": ["海边", "夏天", "旅行", "度假"],
            "images": [
                "https://example.com/beach1.jpg",
                "https://example.com/beach2.jpg",
                "https://example.com/beach3.jpg"
            ],
            "videos": [],
            "video_thumbnails": [],
            "location": "三亚",
            "extra_data": {
                "photo_count": 36,
                "cover_images": [
                    "https://example.com/beach1.jpg",
                    "https://example.com/beach2.jpg",
                    "https://example.com/beach3.jpg",
                    "https://example.com/beach4.jpg"
                ]
            },
            "is_public": True
        },
        {
            "type": "album",
            "title": "秋天的童话",
            "description": "金黄的银杏叶，火红的枫叶，秋天的色彩",
            "content": "秋天是最美的季节，满眼的金黄和火红。",
            "tags": ["秋天", "银杏", "枫叶", "摄影"],
            "images": [
                "https://example.com/autumn1.jpg",
                "https://example.com/autumn2.jpg"
            ],
            "videos": [],
            "video_thumbnails": [],
            "location": "北京",
            "extra_data": {
                "photo_count": 18,
                "cover_images": [
                    "https://example.com/autumn1.jpg",
                    "https://example.com/autumn2.jpg",
                    "https://example.com/autumn3.jpg",
                    "https://example.com/autumn4.jpg"
                ]
            },
            "is_public": True
        },
        {
            "type": "album",
            "title": "京都红叶",
            "description": "秋日的京都，红叶如火",
            "content": "京都的秋天，红叶满山，美不胜收。",
            "tags": ["红叶", "秋天", "京都", "摄影"],
            "images": [
                "https://example.com/kyoto1.jpg",
                "https://example.com/kyoto2.jpg"
            ],
            "videos": [],
            "video_thumbnails": [],
            "location": "日本京都",
            "extra_data": {
                "photo_count": 30,
                "cover_images": [
                    "https://example.com/kyoto1.jpg",
                    "https://example.com/kyoto2.jpg",
                    "https://example.com/kyoto3.jpg",
                    "https://example.com/kyoto4.jpg"
                ]
            },
            "is_public": True
        }
    ]
    
    print("📸 步骤 3: 创建测试相册")
    
    for i, album_data in enumerate(albums, 1):
        response = requests.post(
            f"{BASE_URL}/content",
            headers={"Authorization": f"Bearer {token}"},
            json=album_data
        )
        print_response(f"创建相册 {i}: {album_data['title']}", response)
        
        if response.status_code == 200 and i == 1:
            data = response.json()
            album_id = data["data"]["id"]
            print(f"✅ 保存第一个相册 ID: {album_id}")


def test_album_list():
    """测试相册列表"""
    print("📋 步骤 4: 获取相册列表")
    
    response = requests.get(
        f"{BASE_URL}/content/albums/list",
        params={"page": 1, "page_size": 20}
    )
    print_response("相册列表", response)


def test_album_detail():
    """测试相册详情"""
    if not album_id:
        print("⚠️  跳过相册详情测试（没有相册 ID）")
        return
    
    print("📖 步骤 5: 获取相册详情")
    
    response = requests.get(
        f"{BASE_URL}/content/{album_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    print_response("相册详情", response)


def test_album_stats():
    """测试相册统计"""
    print("📊 步骤 6: 相册统计")
    
    # 按地点统计
    print("\n📍 6.1 按地点统计")
    response = requests.get(f"{BASE_URL}/content/albums/stats/location")
    print_response("地点统计", response)
    
    # 按标签统计
    print("\n🏷️  6.2 按标签统计")
    response = requests.get(f"{BASE_URL}/content/albums/stats/tag")
    print_response("标签统计", response)
    
    # 按时间轴统计（按月）
    print("\n📅 6.3 按时间轴统计（按月）")
    response = requests.get(
        f"{BASE_URL}/content/albums/stats/timeline",
        params={"group_by": "month"}
    )
    print_response("时间轴统计（月）", response)
    
    # 按时间轴统计（按年）
    print("\n📅 6.4 按时间轴统计（按年）")
    response = requests.get(
        f"{BASE_URL}/content/albums/stats/timeline",
        params={"group_by": "year"}
    )
    print_response("时间轴统计（年）", response)


def test_search():
    """测试搜索功能"""
    print("🔍 步骤 7: 搜索功能")
    
    # 按标题搜索
    print("\n🔍 7.1 搜索标题包含'樱花'的相册")
    response = requests.get(
        f"{BASE_URL}/content/search",
        params={"keyword": "樱花", "type": "album"}
    )
    print_response("标题搜索", response)
    
    # 按作者搜索
    print("\n🔍 7.2 搜索作者名称包含'test'的内容")
    response = requests.get(
        f"{BASE_URL}/content/search",
        params={"author": "test", "type": "album"}
    )
    print_response("作者搜索", response)
    
    # 综合搜索
    print("\n🔍 7.3 综合搜索（标题+作者）")
    response = requests.get(
        f"{BASE_URL}/content/search",
        params={"keyword": "京都", "author": "test", "type": "album"}
    )
    print_response("综合搜索", response)


def test_like_and_save():
    """测试点赞和收藏"""
    if not album_id:
        print("⚠️  跳过点赞和收藏测试（没有相册 ID）")
        return
    
    print("❤️  步骤 8: 点赞和收藏")
    
    # 点赞
    print("\n👍 8.1 点赞相册")
    response = requests.post(
        f"{BASE_URL}/content/{album_id}/like",
        headers={"Authorization": f"Bearer {token}"}
    )
    print_response("点赞", response)
    
    # 收藏
    print("\n⭐ 8.2 收藏相册")
    response = requests.post(
        f"{BASE_URL}/content/{album_id}/save",
        headers={"Authorization": f"Bearer {token}"}
    )
    print_response("收藏", response)


def test_comments():
    """测试评论功能"""
    if not album_id:
        print("⚠️  跳过评论测试（没有相册 ID）")
        return
    
    print("💬 步骤 9: 评论功能")
    
    # 创建评论
    print("\n💬 9.1 创建评论")
    response = requests.post(
        f"{BASE_URL}/content/{album_id}/comments",
        headers={"Authorization": f"Bearer {token}"},
        json={"comment_text": "太美了！拍得真好！", "parent_id": None}
    )
    print_response("创建评论", response)
    
    # 获取评论列表
    print("\n💬 9.2 获取评论列表")
    response = requests.get(
        f"{BASE_URL}/content/{album_id}/comments",
        params={"page": 1, "page_size": 20}
    )
    print_response("评论列表", response)


def test_my_albums():
    """测试我的相册"""
    print("📚 步骤 10: 我的相册")
    
    response = requests.get(
        f"{BASE_URL}/content/my/works",
        headers={"Authorization": f"Bearer {token}"},
        params={"type": "album"}
    )
    print_response("我的相册", response)


def main():
    """主函数"""
    print("\n" + "="*60)
    print("🚀 开始测试相册 API")
    print("="*60 + "\n")
    
    try:
        # 1. 注册并登录
        if not register_and_login():
            print("❌ 登录失败，终止测试")
            return
        
        # 2. 创建测试相册
        create_test_albums()
        
        # 3. 测试相册列表
        test_album_list()
        
        # 4. 测试相册详情
        test_album_detail()
        
        # 5. 测试相册统计
        test_album_stats()
        
        # 6. 测试搜索功能
        test_search()
        
        # 7. 测试点赞和收藏
        test_like_and_save()
        
        # 8. 测试评论功能
        test_comments()
        
        # 9. 测试我的相册
        test_my_albums()
        
        print("\n" + "="*60)
        print("✅ 所有测试完成！")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ 测试过程中出现错误: {str(e)}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()


