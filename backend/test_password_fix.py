"""
测试密码修复
"""
import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_reset_password():
    """测试密码重置"""
    print("🧪 测试密码重置功能...")
    
    # 1. 发送验证码
    print("\n1️⃣ 发送验证码...")
    response = requests.post(
        f"{BASE_URL}/auth/send-code",
        json={
            "email": "test@example.com",
            "type": "reset"
        }
    )
    print(f"状态码: {response.status_code}")
    print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    if response.status_code != 200 or response.json().get("code") != 200:
        print("❌ 发送验证码失败")
        return
    
    # 2. 输入验证码
    code = input("\n请输入收到的验证码: ")
    
    # 3. 重置密码
    print("\n2️⃣ 重置密码...")
    response = requests.post(
        f"{BASE_URL}/auth/reset-password",
        json={
            "email": "test@example.com",
            "code": code,
            "new_password": "test123",
            "confirm_password": "test123"
        }
    )
    print(f"状态码: {response.status_code}")
    result = response.json()
    print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False)}")
    
    if result.get("code") == 200:
        print("✅ 密码重置成功！")
    else:
        print(f"❌ 密码重置失败: {result.get('errMsg')}")
        return
    
    # 4. 测试登录
    print("\n3️⃣ 测试登录...")
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "identifier": "test@example.com",
            "password": "test123",
            "remember": False
        }
    )
    print(f"状态码: {response.status_code}")
    result = response.json()
    print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False)}")
    
    if result.get("code") == 200:
        print("✅ 登录成功！密码修复验证通过！")
    else:
        print(f"❌ 登录失败: {result.get('errMsg')}")

def test_login_with_old_password():
    """测试使用旧密码登录（自动迁移）"""
    print("\n🧪 测试旧密码自动迁移...")
    
    email = input("请输入邮箱: ")
    password = input("请输入密码: ")
    
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "identifier": email,
            "password": password,
            "remember": False
        }
    )
    print(f"状态码: {response.status_code}")
    result = response.json()
    print(f"响应: {json.dumps(result, indent=2, ensure_ascii=False)}")
    
    if result.get("code") == 200:
        print("✅ 登录成功！")
        if "自动迁移" in str(result):
            print("✅ 密码已自动迁移到新格式")
    else:
        print(f"❌ 登录失败: {result.get('errMsg')}")

if __name__ == "__main__":
    print("=" * 60)
    print("密码修复测试")
    print("=" * 60)
    
    print("\n请选择测试类型:")
    print("1. 测试密码重置")
    print("2. 测试旧密码自动迁移")
    
    choice = input("\n请输入选项 (1/2): ")
    
    if choice == "1":
        test_reset_password()
    elif choice == "2":
        test_login_with_old_password()
    else:
        print("❌ 无效选项")

