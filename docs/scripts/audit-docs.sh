#!/bin/bash
# Zeabur Docs 健康檢查腳本
# 用途：掃描所有語系，找出重複頁面、_meta.ts 不一致、死鏈等問題
# 用法：cd docs && bash scripts/audit-docs.sh

PAGES="pages"
LOCALES=(en-US zh-TW zh-CN ja-JP es-ES)
REF=en-US
ISSUES=0

red()   { printf "\033[31m%s\033[0m\n" "$*"; }
green() { printf "\033[32m%s\033[0m\n" "$*"; }
yellow(){ printf "\033[33m%s\033[0m\n" "$*"; }
bold()  { printf "\033[1m%s\033[0m\n" "$*"; }

issue() { yellow "  $*"; ISSUES=$((ISSUES+1)); }

# ─── 1. _meta.ts 跨語系結構一致性 ───────────────────────────────────────────
bold "═══ 1. _meta.ts 跨語系 visible keys 一致性（基準：$REF）═══"

visible_keys() {
  # 從 _meta.ts 提取非 hidden、非 separator 的 key
  grep -E "^\s+['\"]?[a-zA-Z]" "$1" 2>/dev/null \
    | grep -v 'display' \
    | grep -v 'separator' \
    | grep -oE "['\"]?[a-zA-Z0-9_-]+['\"]?\s*:" \
    | sed "s/[':\" ]//g" \
    | sort || true
}

find "$PAGES/$REF" -name '_meta.ts' -not -path '*/node_modules/*' | sort | while read ref_meta; do
  rel="${ref_meta#$PAGES/$REF/}"
  for L in "${LOCALES[@]}"; do
    [ "$L" = "$REF" ] && continue
    tgt="$PAGES/$L/$rel"
    if [ ! -f "$tgt" ]; then
      issue "[MISSING _meta] $L/$rel"
      continue
    fi
    ref_k=$(visible_keys "$ref_meta")
    tgt_k=$(visible_keys "$tgt")
    if [ "$ref_k" != "$tgt_k" ]; then
      only_ref=$(comm -23 <(echo "$ref_k") <(echo "$tgt_k") | tr '\n' ', ')
      only_tgt=$(comm -13 <(echo "$ref_k") <(echo "$tgt_k") | tr '\n' ', ')
      msg="[DRIFT] $rel — $L vs $REF"
      [ -n "$only_ref" ] && msg="$msg | 只在 $REF: $only_ref"
      [ -n "$only_tgt" ] && msg="$msg | 只在 $L: $only_tgt"
      issue "$msg"
    fi
  done
done

# ─── 2. 內部連結指向已知舊路徑 ───────────────────────────────────────────────
bold ""
bold "═══ 2. 內部連結指向已知舊路徑 ═══"

OLD_PATHS=(
  "/pricing/referral"
  "/pricing/reward"
  "/billing/sponsor"
  "/community/referral"
  "/community/contribution"
  "/deploy/templates/"
  "/billing-legal/"
)

for pat in "${OLD_PATHS[@]}"; do
  hits=$(grep -rn "$pat" "$PAGES" --include='*.mdx' 2>/dev/null || true)
  if [ -n "$hits" ]; then
    issue "[OLD LINK] '$pat':"
    echo "$hits" | while read line; do echo "    $line"; done
  fi
done

# ─── 3. 同 basename 的 .mdx 出現在不同目錄（重複 sidebar 風險）──────────────
bold ""
bold "═══ 3. 同名 .mdx 出現在多個 visible 目錄 ═══"

for L in "${LOCALES[@]}"; do
  find "$PAGES/$L" -name '*.mdx' -not -name 'index.mdx' 2>/dev/null \
    | sed "s|$PAGES/$L/||" \
    | while read f; do echo "$(basename "$f" .mdx) $f"; done \
    | sort \
    | awk '{
        if ($1 == prev_name && $1 != "") {
          if (!printed_prev) { print prev_locale, prev_path; printed_prev=1 }
          print prev_locale, $2
        } else {
          printed_prev=0
        }
        prev_name=$1; prev_path=$2; prev_locale="'$L'"
      }'  | while read loc path; do
        issue "[$loc] 重複 basename: $path"
      done
done

# ─── 4. 語系間 .mdx 檔案缺漏 ───────────────────────────────────────────────
bold ""
bold "═══ 4. 語系間 .mdx 缺漏（$REF 有但其他語系缺少）═══"

find "$PAGES/$REF" -name '*.mdx' 2>/dev/null | sed "s|$PAGES/$REF/||" | sort | while read rel; do
  for L in "${LOCALES[@]}"; do
    [ "$L" = "$REF" ] && continue
    if [ ! -f "$PAGES/$L/$rel" ]; then
      issue "[$L] 缺少 $rel"
    fi
  done
done

# ─── 5. .mdx 缺少 frontmatter title ────────────────────────────────────────
bold ""
bold "═══ 5. .mdx 缺少 frontmatter title ═══"

for L in "${LOCALES[@]}"; do
  find "$PAGES/$L" -name '*.mdx' -not -name 'index.mdx' 2>/dev/null | while read f; do
    if ! head -5 "$f" | grep -q '^title:'; then
      issue "[$L] $(echo "$f" | sed "s|$PAGES/||") 無 title"
    fi
  done
done

# ─── Summary ────────────────────────────────────────────────────────────────
bold ""
if [ "$ISSUES" -gt 0 ]; then
  red "══ 發現 $ISSUES 個問題 ══"
else
  green "══ 全部通過 ══"
fi
