"""Monitor F16 submissions — HN item 48660126 + Dev.to post.

Checks every poll:
- HN: score, flag count, comment count
- Dev.to: reaction count, new comments

Outputs a status line. Cron will deliver any CHANGES.
"""
import subprocess, json, time, sys

def check_hn():
    """Use opencli to fetch HN item state."""
    try:
        subprocess.run(["opencli","browser","itch","open",
                        "https://news.ycombinator.com/item?id=48660126"],
                       capture_output=True, timeout=30)
        e = subprocess.run(["opencli","browser","itch","eval",
            "(function(){const all=document.body.innerText;"
            "const score=all.match(/(\\d+)\\s*points?/)?.[1];"
            "const flag=(all.indexOf('[flagged]')>=0)?'1':'0';"
            "const cmts=all.match(/(\\d+)\\s*comments?/i)?.[1]||'0';"
            "const age=all.match(/(\\d+)\\s*(minute|hour|day)s?\\s*ago/)?.[0];"
            "return JSON.stringify({score,flag,cmts,age});})()"],
            capture_output=True, text=True, timeout=30)
        d = json.loads(e.stdout.strip().split('\n')[0])
        return d
    except Exception as ex:
        return {"error": str(ex)[:120]}

def check_devto():
    """Use opencli to fetch Dev.to post state."""
    try:
        subprocess.run(["opencli","browser","itch","open",
                        "https://dev.to/dive-one-person-comp/building-a-fan-made-source-code-portal-for-indie-games-3eee"],
                       capture_output=True, timeout=30)
        e = subprocess.run(["opencli","browser","itch","eval",
            "(function(){const all=document.body.innerText;"
            "const react=document.querySelector('#reaction-drawer-count, .reaction-drawer__count')?.innerText||document.querySelector('.article-header + div .reaction-count,[data-reaction-count]')?.innerText||(all.match(/^(\\d+)$/m)?.[1])||'?';"
            "const cmts=document.querySelectorAll('#comments-wrapper .comment,.comment,[id^=comment-node]').length;"
            "return JSON.stringify({reactions:react,commentsInDOM:cmts});})()"],
            capture_output=True, text=True, timeout=30)
        d = json.loads(e.stdout.strip().split('\n')[0])
        return d
    except Exception as ex:
        return {"error": str(ex)[:120]}

def main():
    hn = check_hn()
    dt = check_devto()
    line = f"HN id=48660126 score={hn.get('score','?')} flag={hn.get('flag','?')} cmts={hn.get('cmts','?')} age={hn.get('age','?')} || Dev.to react={dt.get('reactions','?')} cmts={dt.get('commentsInDOM','?')}"
    print(line, flush=True)

if __name__ == "__main__":
    main()
