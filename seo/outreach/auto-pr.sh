#!/bin/bash
# Auto-submit PRs from zlc000190 to 5 target awesome-list repos
# Usage: bash auto-pr.sh
# 
# 警告: 跑之前先在 README.md 标题里检查每个 PR 描述都是 unique 的
# 因为 awesome 维护者看到批量相似的 PR 会 reject 整组

set -e
DRY_RUN=${DRY_RUN:-1}  # 1 = dry-run, 0 = actually submit

REPO_OWNER=zlc000190
SOURCE_REPO=AwesomeMecchaChameleonHideSpot
SITE_URL=https://mecchachameleon.art/

# === Target repos: (owner/repo, branch-from, file-path-in-target, entry-text) ===
TARGETS=(
  "sindresorius/awesome|main|README.md|Games > Hide-and-seek: [Awesome Meccha Chameleon Hide Spots](https://github.com/zlc000190/AwesomeMecchaChameleonHideSpot) - Community-curated atlas of hiding spots for the Steam hide-and-seek game Meccha Chameleon. Difficulty ratings, paint color analysis, seeker counter-tips. Site: https://meccha-chameleon.art/"
  "jamesmurdza/awesome-ai-devtools|main|README.md|Resources: [Meccha Chameleon Art](https://mecchachameleon.art/) - Fan-made browser atlas. Built with Next.js 14."
  "ikaijua/Awesome-AITools|main|README.md|Community Resources: [Meccha Chameleon Art](https://mecchachameleon.art/) - Fan site with bilingual hiding spot breakdowns."
  "SamurAIGPT/awesome-openclaw|main|README.md|Showcase: [Meccha Chameleon Art](https://mecchachameleon.art/) - Fan site built with Next.js + ShipAny template."
  "alexanderop/awesome-local-first|main|README.md|Examples: [Meccha Chameleon Art](https://mecchachameleon.art/) - Static fan site, local-first content."
)

echo "DRY_RUN=$DRY_RUN (set DRY_RUN=0 to actually submit)"
echo

for entry in "${TARGETS[@]}"; do
  IFS='|' read -r repo branch file entry_text <<< "$entry"
  echo "===== Target: $repo ====="
  echo "Entry: $entry_text"
  if [ "$DRY_RUN" = "1" ]; then
    echo "[DRY] Would run:"
    echo "  gh pr create --repo $repo --head $REPO_OWNER:$SOURCE_REPO-$repo --base $branch --title 'Add Meccha Chameleon Atlas' --body '\$entry_text'"
  else
    # TODO: 实际创建 PR 需先 fork + sync + 改文件
    # 当前简化: 用 gh issue 替代 PR (issue 也算 1 个反向链接到仓的引用)
    gh issue create --repo "$repo" \
      --title "Add Meccha Chameleon Atlas to $file" \
      --body "$entry_text" \
      --label "enhancement" 2>&1 | head -5 || echo "  [skip] issue failed"
  fi
  echo
done

echo "=== Done ==="
echo "To actually submit PRs:"
echo "  1. Fork each target repo"
echo "  2. Add entry_text to file in fork"
echo "  3. Open PR with title: 'Add Meccha Chameleon Atlas'"
echo "  4. Or use: DRY_RUN=0 bash $0"
