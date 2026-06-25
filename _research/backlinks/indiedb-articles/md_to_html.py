#!/usr/bin/env python3
"""Convert IndieDB article markdown -> HTML for TinyMCE description field.

Rules:
- No headers (#, ##, ###) — IndieDB guidelines say avoid excessive headers
- Wrap each blank-separated paragraph in <p>
- Convert **bold** to <strong>
- Convert *italic* to <em>
- Convert [text](url) to <a href="url" rel="nofollow noopener" target="_blank">text</a>
- Convert code blocks (```) to <pre><code>
- Convert inline `code` to <code>
- Convert unordered list (- ...) to <ul><li>
- Strip the reminder block (we already showed it in summary)
"""
import re
import sys
import html

def md_to_html(md):
    lines = md.split('\n')
    out = []
    in_code = False
    code_buf = []
    in_list = False
    list_items = []

    def flush_list():
        nonlocal in_list, list_items
        if in_list and list_items:
            out.append('<ul>')
            for it in list_items:
                out.append(f'  <li>{it}</li>')
            out.append('</ul>')
            list_items = []
        in_list = False

    def inline(t):
        # code spans first (so we don't bold-italic inside code)
        t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
        # links
        t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)',
                   lambda m: f'<a href="{html.escape(m.group(2))}" rel="nofollow noopener" target="_blank">{m.group(1)}</a>', t)
        # bold then italic
        t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
        t = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', t)
        return t

    for raw in lines:
        line = raw.rstrip()
        # skip horizontal rules
        if re.match(r'^-{3,}$', line.strip()):
            continue
        # code fence
        if line.strip().startswith('```'):
            if in_code:
                out.append('<pre><code>' + html.escape('\n'.join(code_buf)) + '</code></pre>')
                code_buf = []
                in_code = False
            else:
                flush_list()
                in_code = True
            continue
        if in_code:
            code_buf.append(line)
            continue
        # blank line = paragraph break
        if not line.strip():
            flush_list()
            continue
        # strip the Reminder block (already in summary) — match "Reminder:" prefix line + any following lines until blank
        if line.startswith('Reminder:'):
            continue
        # skip the title line if it's a H1 style (no # but our files have plain first line as title)
        # convert "- " bullet
        if re.match(r'^\s*-\s+', line):
            in_list = True
            list_items.append(inline(re.sub(r'^\s*-\s+', '', line)))
            continue
        else:
            flush_list()
        # numbered list?
        if re.match(r'^\d+\.\s+', line):
            out.append('<p>' + inline(re.sub(r'^\d+\.\s+', '', line)) + '</p>')
            continue
        # plain paragraph
        out.append('<p>' + inline(line) + '</p>')

    flush_list()
    if in_code and code_buf:
        out.append('<pre><code>' + html.escape('\n'.join(code_buf)) + '</code></pre>')

    return '\n'.join(out)


if __name__ == '__main__':
    src = sys.stdin.read() if not sys.argv[1:] else open(sys.argv[1]).read()
    # remove frontmatter if present
    src = re.sub(r'^---\n.*?\n---\n', '', src, count=1, flags=re.DOTALL)
    print(md_to_html(src))