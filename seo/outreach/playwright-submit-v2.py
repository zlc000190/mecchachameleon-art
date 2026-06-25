#!/usr/bin/env python3
"""
playwright-submit-v2.py — 半自动 itch.io + GameJolt 投递脚本

用法 (3 步):
  1. 第一次跑: 浏览器打开, 你手动 Google 登录一次 (cookie 自动存)
  2. 第二次跑: 自动填表, 你按 Submit/Save
  3. 不要重复跑同一站 (itch/GameJolt 会标记)

前置:
  pip install playwright
  playwright install chromium

Reddit 4 个目标已在 v2 删除 (用户偏好).
"""
import json
import sys
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("❌ playwright 没装. 跑: pip install playwright && playwright install chromium")
    sys.exit(1)

# ============ 配置 ============
COOKIE_PATH = Path.home() / ".config" / "google-cookie.json"
SUBMISSIONS_FILE = Path(__file__).parent / "playwright-submissions-v2.json"

# ============ 投递目标 (v2: 去掉 Reddit) ============
SUBMISSIONS = [
    {
        "name": "itch.io Page",
        "url": "https://itch.io/page/new",
        "kind": "itch-page",
        "title": "Meccha Chameleon Art — fan-made browser atlas of 50 hiding spots",
        "body_file": "itch-page-body.md",
    },
    {
        "name": "GameJolt Game",
        "url": "https://gamejolt.com/games/new",
        "kind": "gamejolt-game",
        "title": "Meccha Chameleon Art — fan-made browser atlas of 50 hiding spots",
        "body_file": "gamejolt-game-body.md",
    },
]

# ============ Body 内容加载 ============
def load_body(filename):
    p = Path(__file__).parent / filename
    if p.exists():
        return p.read_text()
    return ""

# ============ 主流程 ============
def main():
    headless = "--headless" in sys.argv
    print(f"Browser headless: {not headless}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)

        ctx_args = {}
        if COOKIE_PATH.exists():
            print(f"✓ 加载 cookie: {COOKIE_PATH}")
            ctx_args["storage_state"] = str(COOKIE_PATH)

        ctx = browser.new_context(**ctx_args)
        page = ctx.new_page()

        results = []
        for sub in SUBMISSIONS:
            print(f"\n===== {sub['name']} =====")
            print(f"  URL: {sub['url']}")

            try:
                page.goto(sub["url"], timeout=30000)

                # 首次跑没 cookie 时, 等用户手动登录
                if not COOKIE_PATH.exists():
                    print("  ⚠️  请在浏览器中手动 Google 登录 (一次)")
                    input("  登录完成后按 Enter 继续...")
                    ctx.storage_state(path=str(COOKIE_PATH))
                    print(f"  ✓ Cookie 已保存")

                kind = sub["kind"]
                if kind == "itch-page":
                    page.wait_for_selector("input[name='title']", timeout=15000)
                    page.fill("input[name='title']", sub["title"])
                    body = load_body(sub["body_file"])
                    page.evaluate(f"""
                        const editors = document.querySelectorAll('[contenteditable="true"]');
                        editors.forEach((ed, i) => {{
                            ed.innerHTML = {json.dumps(body[:5000])};
                            ed.dispatchEvent(new Event('input', {{bubbles: true}}));
                        }});
                    """)
                    print(f"  ✓ 填完 title + body, 等你按 Save")

                elif kind == "gamejolt-game":
                    page.wait_for_selector("input[name='title']", timeout=15000)
                    page.fill("input[name='title']", sub["title"])
                    body = load_body(sub["body_file"])
                    page.evaluate(f"""
                        const tas = document.querySelectorAll('textarea');
                        if (tas.length > 0) {{
                            tas[0].value = {json.dumps(body)};
                            tas[0].dispatchEvent(new Event('input', {{bubbles: true}}));
                        }}
                    """)
                    print(f"  ✓ 填完 title + body, 等你按 Save")

                print(f"  → 浏览器显示给你了, 你按 Submit/Save")
                if not headless:
                    input("  按 Enter 后下一个...")
                results.append({"name": sub["name"], "status": "filled"})

            except Exception as e:
                print(f"  ✗ 失败: {e}")
                results.append({"name": sub["name"], "status": "error", "error": str(e)})

        SUBMISSIONS_FILE.write_text(json.dumps(results, indent=2, ensure_ascii=False))
        print(f"\n✓ 结果保存到 {SUBMISSIONS_FILE}")

        if not headless:
            input("最后按 Enter 关闭浏览器...")
        browser.close()

if __name__ == "__main__":
    main()
