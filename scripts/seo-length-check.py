#!/usr/bin/env python3
"""SEO length audit for mecchachameleon.art

Limits (Google SERP):
- title <= 60 chars
- description <= 160 chars

Source of truth: Next.js generateMetadata() + layout.tsx / page.tsx metadata.
We grep `title:` and `description:` in TS/TSX files and print rows that
exceed the limit, with a `must_change` flag for non-fan-made wording.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TARGETS = [
    ROOT / "src" / "app",
    ROOT / "content",
]
TITLE_LIMIT = 60
DESC_LIMIT = 160

# Hard rule from user (memory): "Unofficial" can be removed,
# but "fan-made / not the official" trademark disclaimer MUST remain.
TRADEMARK_TERMS = ["fan-made", "fan made", "not the official", "unofficial"]


def iter_files():
    for t in TARGETS:
        if not t.exists():
            continue
        for f in t.rglob("*"):
            if f.suffix not in {".ts", ".tsx", ".mdx", ".md"}:
                continue
            yield f


def scan():
    title_re = re.compile(r'(?:title|metadata\.title)\s*[:=]\s*[`"\']([^`"\']+)[`"\']')
    desc_re = re.compile(r'(?:description|metadata\.description)\s*[:=]\s*[`"\']([^`"\']+)[`"\']')
    rows = []
    for f in iter_files():
        try:
            text = f.read_text(encoding="utf-8")
        except Exception:
            continue
        for m in title_re.finditer(text):
            t = m.group(1).strip()
            if len(t) >= 5:
                rows.append(("title", t, len(t), f.relative_to(ROOT)))
        for m in desc_re.finditer(text):
            d = m.group(1).strip()
            if len(d) >= 20:
                rows.append(("description", d, len(d), f.relative_to(ROOT)))
    return rows


def main():
    rows = scan()
    over = []
    for kind, text, n, f in rows:
        limit = TITLE_LIMIT if kind == "title" else DESC_LIMIT
        flag = ""
        if n > limit:
            flag += " OVER"
        has_trademark = any(term in text.lower() for term in TRADEMARK_TERMS)
        if not has_trademark and "art" in str(f).lower():
            flag += " NO_TRADEMARK"
        if flag:
            over.append((kind, n, limit, text, f, flag.strip()))
    over.sort(key=lambda r: (r[0], -r[1]))
    print(f"Scanned {len(rows)} metadata entries (title/description).")
    print(f"Limit: title<={TITLE_LIMIT} / description<={DESC_LIMIT}")
    print()
    print(f"{'kind':12} {'len':>5}/{'lim':<3} flag file")
    for kind, n, limit, text, f, flag in over:
        short = (text[:80] + "…") if len(text) > 80 else text
        print(f"{kind:12} {n:>4}/{limit:<3} {flag:30} {f}")
        print(f"    {short}")
    if not over:
        print("All scanned entries are within limits.")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
