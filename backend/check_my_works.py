#!/usr/bin/env python3
"""
检查我的创作相关的后端路由配置
"""
import sys
import os

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def check_routes():
    """检查路由配置"""
    print("=" * 60)
    print("🔍 检查后端路由配置")
    print("=" * 60)
    
    try:
        from app.api.v1.content import router
        
        print("\n📋 已注册的路由:")
        print("-" * 60)
        
        routes = []
        for route in router.routes:
            if hasattr(route, 'path') and hasattr(route, 'methods'):
                path = route.path
                methods = list(route.methods)
                name = route.name if hasattr(route, 'name') else 'N/A'
                routes.append((methods, path, name))
        
        # 按路径排序
        routes.sort(key=lambda x: x[1])
        
        # 我的创作相关的路由
        my_works_routes = [
            ('GET', '/my/works', 'get_my_works'),
            ('GET', '/my/views', 'get_my_views'),
            ('GET', '/my/likes', 'get_my_likes'),
            ('GET', '/my/comments', 'get_my_comments'),
            ('POST', '/{content_id}/hide', 'hide_content'),
            ('POST', '/{content_id}/show', 'show_content'),
            ('DELETE', '/my/views/{content_id}', 'delete_view_record'),
        ]
        
        print("\n✅ 我的创作相关路由:")
        found_routes = []
        
        for methods, path, name in routes:
            for expected_method, expected_path, expected_name in my_works_routes:
                if expected_path in path and expected_method in methods:
                    print(f"  {expected_method:6} {path:40} ({name})")
                    found_routes.append(expected_path)
        
        print("\n📊 路由检查结果:")
        print("-" * 60)
        
        for method, path, name in my_works_routes:
            if path in found_routes:
                print(f"  ✅ {method:6} {path}")
            else:
                print(f"  ❌ {method:6} {path} - 未找到")
        
        print("\n" + "=" * 60)
        
        if len(found_routes) == len(my_works_routes):
            print("🎉 所有路由配置正确！")
            return True
        else:
            print(f"⚠️  缺少 {len(my_works_routes) - len(found_routes)} 个路由")
            return False
            
    except Exception as e:
        print(f"\n❌ 检查失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def check_models():
    """检查数据模型"""
    print("\n" + "=" * 60)
    print("🗄️ 检查数据模型")
    print("=" * 60)
    
    try:
        from app.models.content import Content, ContentView, ContentLike, ContentSave, Comment
        
        models = [
            ('Content', Content),
            ('ContentView', ContentView),
            ('ContentLike', ContentLike),
            ('ContentSave', ContentSave),
            ('Comment', Comment),
        ]
        
        print("\n✅ 已定义的模型:")
        for name, model in models:
            table_name = model.__tablename__
            print(f"  ✅ {name:20} -> {table_name}")
        
        # 检查 ContentView 的字段
        print("\n📋 ContentView 模型字段:")
        for column in ContentView.__table__.columns:
            print(f"  - {column.name:20} {column.type}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ 检查失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def check_services():
    """检查服务方法"""
    print("\n" + "=" * 60)
    print("🔧 检查服务方法")
    print("=" * 60)
    
    try:
        from app.services.content_service import ContentService
        
        required_methods = [
            'get_user_views',
            'get_user_likes',
            'get_user_comments',
            'toggle_content_visibility',
            'delete_view_record',
        ]
        
        print("\n✅ 服务方法:")
        for method_name in required_methods:
            if hasattr(ContentService, method_name):
                print(f"  ✅ {method_name}")
            else:
                print(f"  ❌ {method_name} - 未找到")
        
        return True
        
    except Exception as e:
        print(f"\n❌ 检查失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """主函数"""
    results = []
    
    results.append(("路由配置", check_routes()))
    results.append(("数据模型", check_models()))
    results.append(("服务方法", check_services()))
    
    print("\n" + "=" * 60)
    print("📊 总体检查结果")
    print("=" * 60)
    
    for name, result in results:
        status = "✅" if result else "❌"
        print(f"{status} {name}")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    print(f"\n通过: {passed}/{total}")
    
    if passed == total:
        print("\n🎉 所有检查通过！后端配置正确。")
        return 0
    else:
        print("\n⚠️  部分检查失败，请修复问题。")
        return 1

if __name__ == "__main__":
    sys.exit(main())

