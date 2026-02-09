#!/usr/bin/env python3
"""
Git 自动提交分析脚本
分析当前 Git 变更并生成语义化的 commit message
"""

import subprocess
import sys
import os
from pathlib import Path
from typing import List, Tuple, Dict

# 提交类型映射
COMMIT_TYPES = {
    'feat': '新功能',
    'fix': '修复',
    'docs': '文档',
    'style': '样式',
    'refactor': '重构',
    'perf': '性能',
    'test': '测试',
    'chore': '构建',
    'ci': 'CI/CD',
}

# 文件路径到范围的映射
SCOPE_MAPPING = {
    'frontend/src/app/': 'page',
    'frontend/src/components/': 'ui',
    'frontend/src/lib/api/': 'api',
    'frontend/src/lib/store/': 'store',
    'frontend/src/styles/': 'style',
    'backend/app/api/': 'api',
    'backend/app/models/': 'db',
    'backend/app/schemas/': 'schema',
    'backend/app/services/': 'service',
    'backend/app/crud/': 'crud',
    'docker/': 'docker',
    '.md': 'docs',
}

def run_command(cmd: List[str]) -> Tuple[int, str]:
    """执行命令并返回结果"""
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False
        )
        return result.returncode, result.stdout.strip()
    except Exception as e:
        return 1, str(e)

def get_git_status() -> List[str]:
    """获取 Git 状态"""
    code, output = run_command(['git', 'status', '--porcelain'])
    if code != 0:
        return []
    return [line for line in output.split('\n') if line.strip()]

def analyze_changes(status_lines: List[str]) -> Dict:
    """分析变更内容"""
    changes = {
        'added': [],
        'modified': [],
        'deleted': [],
        'renamed': [],
    }
    
    for line in status_lines:
        status = line[:2].strip()
        filepath = line[3:].strip()
        
        if status in ['A', '??']:
            changes['added'].append(filepath)
        elif status == 'M':
            changes['modified'].append(filepath)
        elif status == 'D':
            changes['deleted'].append(filepath)
        elif status.startswith('R'):
            changes['renamed'].append(filepath)
    
    return changes

def detect_commit_type(changes: Dict) -> str:
    """检测提交类型"""
    all_files = (
        changes['added'] + 
        changes['modified'] + 
        changes['deleted'] + 
        changes['renamed']
    )
    
    # 只有文档变更
    if all(f.endswith('.md') for f in all_files):
        return 'docs'
    
    # 只有样式变更
    if all(f.endswith(('.css', '.less', '.scss')) for f in all_files):
        return 'style'
    
    # 只有测试文件
    if all('test' in f.lower() for f in all_files):
        return 'test'
    
    # 只有配置文件
    config_files = ['package.json', 'requirements.txt', 'docker-compose', '.env.example']
    if all(any(cf in f for cf in config_files) for f in all_files):
        return 'chore'
    
    # 有新增文件，可能是新功能
    if changes['added']:
        return 'feat'
    
    # 默认为修复
    return 'fix'

def detect_scope(changes: Dict) -> str:
    """检测变更范围"""
    all_files = (
        changes['added'] + 
        changes['modified'] + 
        changes['deleted'] + 
        changes['renamed']
    )
    
    # 统计每个范围的文件数
    scope_count = {}
    for filepath in all_files:
        for pattern, scope in SCOPE_MAPPING.items():
            if pattern in filepath:
                scope_count[scope] = scope_count.get(scope, 0) + 1
                break
    
    # 返回最多的范围
    if scope_count:
        return max(scope_count.items(), key=lambda x: x[1])[0]
    
    return ''

def generate_subject(commit_type: str, changes: Dict) -> str:
    """生成提交主题"""
    if commit_type == 'feat':
        if changes['added']:
            first_file = Path(changes['added'][0]).stem
            return f"添加{first_file}功能"
        return "添加新功能"
    
    elif commit_type == 'fix':
        return "修复问题"
    
    elif commit_type == 'docs':
        return "更新文档"
    
    elif commit_type == 'style':
        return "优化样式"
    
    elif commit_type == 'refactor':
        return "重构代码"
    
    elif commit_type == 'chore':
        if any('package.json' in f for f in changes['modified']):
            return "更新依赖"
        if any('docker' in f for f in changes['modified']):
            return "更新Docker配置"
        return "更新配置"
    
    return "更新代码"

def generate_body(changes: Dict) -> str:
    """生成提交正文"""
    lines = []
    
    if changes['added']:
        lines.append("新增文件:")
        for f in changes['added'][:5]:  # 最多显示5个
            lines.append(f"- {f}")
    
    if changes['modified']:
        lines.append("\n修改文件:")
        for f in changes['modified'][:5]:
            lines.append(f"- {f}")
    
    if changes['deleted']:
        lines.append("\n删除文件:")
        for f in changes['deleted'][:5]:
            lines.append(f"- {f}")
    
    return '\n'.join(lines)

def generate_commit_message(changes: Dict) -> str:
    """生成完整的 commit message"""
    commit_type = detect_commit_type(changes)
    scope = detect_scope(changes)
    subject = generate_subject(commit_type, changes)
    
    # 构建第一行
    if scope:
        first_line = f"{commit_type}({scope}): {subject}"
    else:
        first_line = f"{commit_type}: {subject}"
    
    # 构建完整消息
    body = generate_body(changes)
    if body:
        return f"{first_line}\n\n{body}"
    
    return first_line

def main():
    """主函数"""
    print("🔍 分析 Git 变更...")
    print()
    
    # 检查是否是 Git 仓库
    code, _ = run_command(['git', 'rev-parse', '--git-dir'])
    if code != 0:
        print("❌ 错误: 当前目录不是 Git 仓库")
        sys.exit(1)
    
    # 获取状态
    status_lines = get_git_status()
    if not status_lines:
        print("✓ 没有需要提交的变更")
        sys.exit(0)
    
    # 分析变更
    changes = analyze_changes(status_lines)
    
    # 显示变更统计
    print(f"📊 变更统计:")
    print(f"  新增: {len(changes['added'])} 个文件")
    print(f"  修改: {len(changes['modified'])} 个文件")
    print(f"  删除: {len(changes['deleted'])} 个文件")
    print()
    
    # 生成 commit message
    commit_msg = generate_commit_message(changes)
    
    print("📝 建议的提交信息:")
    print("─" * 50)
    print(commit_msg)
    print("─" * 50)
    print()
    
    # 输出到文件供脚本使用
    with open('.git-commit-msg.txt', 'w', encoding='utf-8') as f:
        f.write(commit_msg)
    
    print("✓ 提交信息已生成")
    print("💡 使用 ./git-commit.sh 执行提交")

if __name__ == '__main__':
    main()

