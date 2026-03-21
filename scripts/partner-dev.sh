#!/bin/bash
export PATH="/Users/ling/.nvm/versions/node/v24.11.1/bin:/Users/ling/.nvm/versions/node/v24.11.1/lib/node_modules/corepack/shims:$PATH"
cd /Users/ling/Code/partner.zeabur.com
exec npx next dev --port 3001
