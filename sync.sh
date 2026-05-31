#!/usr/bin/env bash
#
# sync.sh — 把 具身智能/ 里的 VLA 报告与论文细读同步到本站点并自动发布
#
# 用法:
#   ./sync.sh                 # 用默认提交信息(带时间戳)
#   ./sync.sh "更新基准横评表"  # 自定义提交信息
#   SKIP_BUILD=1 ./sync.sh    # 跳过本地构建校验(更快,但不推荐)
#
set -euo pipefail
export PATH="/opt/homebrew/bin:$PATH"

# ---- 路径配置(如有变动改这里)----
SRC="/Users/zhuyun/Desktop/具身智能"
SITE="/Users/zhuyun/Desktop/embodied-ai-learning"
DEST="$SITE/docs/vla"

REPORT="$SRC/VLA发展深度调研报告.md"
MSG="${1:-同步 VLA 报告与论文细读 ($(date '+%Y-%m-%d %H:%M'))}"

cd "$SITE"

echo "▶ 1/5 校验源文件..."
[ -f "$REPORT" ] || { echo "✗ 找不到主报告: $REPORT"; exit 1; }
[ -d "$SRC/papers" ] || { echo "✗ 找不到论文目录: $SRC/papers"; exit 1; }

echo "▶ 2/5 同步内容到站点..."
# 主报告 -> 站点首页文档
cp "$REPORT" "$DEST/index.md"
# 「如何阅读本站 / 更新日志」单页(源端维护;放在 $DEST 根,不进 papers/ 的 --delete 范围)
for page in guide changelog; do
  [ -f "$SRC/$page.md" ] && cp "$SRC/$page.md" "$DEST/$page.md"
done
# 论文 md + 图片(--delete 让源端的删除也同步过来;排除杂项)
rsync -a --delete \
  --exclude='.omc' --exclude='.DS_Store' --exclude='.git' \
  "$SRC/papers/" "$DEST/papers/"
# 保险:清掉可能混入的隐藏目录
rm -rf "$DEST/papers/images/.omc" 2>/dev/null || true

# WAM 调研轨:总览(wam/index.md)+ 论文细读(wam/papers/),独立 /wam/ 目录树
if [ -d "$SRC/wam" ]; then
  mkdir -p "$SITE/docs/wam"
  rsync -a --delete \
    --exclude='.omc' --exclude='.DS_Store' --exclude='.git' \
    "$SRC/wam/" "$SITE/docs/wam/"
fi

echo "▶ 3/5 修复论文返回链接(适配 VitePress 路由)..."
# ../VLA发展深度调研报告.md -> ../index.md
find "$DEST/papers" -name '*.md' -print0 | while IFS= read -r -d '' f; do
  perl -i -pe 's/\.\.\/VLA发展深度调研报告\.md/..\/index.md/g' "$f"
done
remaining=$( { grep -rl 'VLA发展深度调研报告.md' "$DEST/papers" 2>/dev/null || true; } | wc -l | tr -d ' ')
[ "$remaining" = "0" ] || { echo "✗ 仍有 $remaining 个文件含旧链接"; exit 1; }

if [ "${SKIP_BUILD:-0}" != "1" ]; then
  echo "▶ 4/5 本地构建校验(VitePress build)..."
  npm run docs:build >/tmp/vla_build.log 2>&1 || {
    echo "✗ 构建失败,已中止发布。日志末尾:"; tail -15 /tmp/vla_build.log; exit 1;
  }
  echo "  ✓ 构建通过"
else
  echo "▶ 4/5 跳过构建校验(SKIP_BUILD=1)"
fi

echo "▶ 5/5 提交并推送..."
git add -A
if git diff --cached --quiet; then
  echo "  ⓘ 无变更,无需提交。"
  exit 0
fi
git commit -q -m "$MSG"
git push -q origin main
echo ""
echo "✅ 已推送。GitHub Actions 正在自动构建发布(约 1 分钟)。"
echo "   仓库:  https://github.com/ZhuYun97/embodied-ai-learning"
echo "   网站:  https://zhuyun97.github.io/embodied-ai-learning/"
echo "   进度:  gh run list --repo ZhuYun97/embodied-ai-learning --limit 1"
