#!/bin/bash
# 将 .claude/skills/ 同步到 .catpaw/skills/（单向，以 .claude/skills 为准）
# 如需支持其他 AI 编辑器目录，参照 TARGET 变量复制即可。

set -e

SOURCE=".claude/skills"
TARGET=".catpaw/skills"

if [ ! -d "$SOURCE" ]; then
    echo "❌ 未找到 $SOURCE 目录，请在项目根目录运行"
    exit 1
fi

mkdir -p "$TARGET"

# --delete 保证目标目录与源目录完全一致，消除手工复制产生的漂移
rsync -a --delete "$SOURCE/" "$TARGET/"

echo "✅ 已将 $SOURCE/ 同步到 $TARGET/"
