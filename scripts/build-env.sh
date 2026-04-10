#!/bin/sh
# Generates public/env.js from env vars or .env file.
# Reads:  PRODUCT_TYPE (default: gotgam — safe fallback)
# Writes: public/env.js → window.__HORANG_CONFIG__
set -e
cd "$(dirname "$0")/.."

if [ -f .env ]; then
    set -a
    . ./.env
    set +a
fi

PRODUCT_TYPE="${PRODUCT_TYPE:-gotgam}"

mkdir -p public
cat > public/env.js <<EOF
window.__HORANG_CONFIG__ = {
    productType: "${PRODUCT_TYPE}"
};
EOF

echo "Generated public/env.js (productType=${PRODUCT_TYPE})"
