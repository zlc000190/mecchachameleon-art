#!/bin/bash
# Add Trae CN MCP servers to Hermes config.yaml
# Generated 2026-06-24 by Hermes Agent
#
# Run: bash mcp-import-from-trae-2026-06-24.sh
#
# Appends 9 useful MCP servers (browser automation + web research)
# from Trae CN to Hermes ~/.hermes/config.yaml under mcp_servers: block.

set -e
HERMES_CONFIG="$HOME/.hermes/config.yaml"
BACKUP="$HOME/.hermes/config.yaml.bak.$(date +%s)"

echo "Backing up $HERMES_CONFIG → $BACKUP"
cp "$HERMES_CONFIG" "$BACKUP"

# 在 'platforms:' 前面插入 MCP 段 (YAML 简单缩进)
python3 - <<PYEOF
import os, sys

config_path = "$HERMES_CONFIG"
with open(config_path) as f:
    content = f.read()

# 找 'platforms:' 顶级 key 位置 (前面必须有 \n 或行首, 避免误中注释)
import re
m = re.search(r'^platforms:\s*$', content, re.MULTILINE)
if not m:
    print('ERROR: 找不到顶级 platforms: key', file=sys.stderr)
    sys.exit(1)

insertion_point = m.start()

new_mcp = '''  # Imported from Trae CN on 2026-06-24. Browser automation + web research.
  playwright-trae:
    command: npx
    args:
    - -y
    - "@executeautomation/playwright-mcp-server"
  puppeteer-trae:
    command: npx
    args:
    - -y
    - "@modelcontextprotocol/server-puppeteer"
  duckduckgo-trae:
    command: uvx
    args:
    - duckduckgo-mcp-server
  fetch-trae:
    command: uvx
    args:
    - mcp-server-fetch
  firecrawl-trae:
    command: npx
    args:
    - -y
    - "@mendable/firecrawl-mcp"
    env:
      FIRECRAWL_API_KEY: "fc-dca...9f4a"
  web-research-trae:
    command: npx
    args:
    - -y
    - "@mzxrai/mcp-webresearch@latest"
  hotnews-trae:
    command: npx
    args:
    - -y
    - "@wopal/mcp-server-hotnews"
  context7-trae:
    command: npx
    args:
    - -y
    - "@upstash/context7-mcp@latest"
  sequential-thinking-trae:
    command: npx
    args:
    - -y
    - "@modelcontextprotocol/server-sequential-thinking"

'''

new_content = content[:insertion_point] + new_mcp + content[insertion_point:]

with open(config_path, 'w') as f:
    f.write(new_content)
print(f'OK: {config_path} updated')
print(f'New size: {len(new_content)} (was {len(content)})')
print(f'Inserted at byte {insertion_point}')
PYEOF

echo ""
echo "验证 (查新加的 MCP):"
grep -c "playwright-trae\|puppeteer-trae\|duckduckgo-trae\|fetch-trae\|firecrawl-trae\|web-research-trae\|hotnews-trae\|context7-trae\|sequential-thinking-trae" "$HERMES_CONFIG"
echo ""
echo "下一步: 重启 Hermes 让新 MCP 生效:"
echo "  pkill -f hermes-webui  # 或重启 Hermes 网关"
echo "  curl http://127.0.0.1:18789/health"
