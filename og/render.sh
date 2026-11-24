#!/usr/bin/env bash
# Render the social preview cards (og:image) to assets/og-*.jpg at 1200×630.
#
#   bash og/render.sh
#
# Needs: python3 (with Pillow), firefox. Run from anywhere; paths resolve from the repo root.
# Snap-packaged Firefox can only write under ~/snap/firefox/common, so captures go there first.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT=8799
WORK="$HOME/snap/firefox/common/og-render"
[ -d "$HOME/snap/firefox" ] || WORK="$(mktemp -d)"
mkdir -p "$WORK"

python3 -m http.server "$PORT" --directory "$ROOT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null; rm -rf "$WORK"' EXIT
sleep 1

for name in og-home og-servicios; do
  PROFILE="$(mktemp -d -p "$WORK" profile.XXXX)"
  timeout 90 firefox --headless --profile "$PROFILE" --window-size=1200,630 \
    --screenshot "$WORK/$name.png" "http://localhost:$PORT/og/$name.html" >/dev/null 2>&1
  python3 - "$WORK/$name.png" "$ROOT/assets/$name.jpg" <<'PY'
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB').crop((0, 0, 1200, 630))
im.save(dst, 'JPEG', quality=86, optimize=True, progressive=True)
PY
  echo "wrote assets/$name.jpg ($(du -k "$ROOT/assets/$name.jpg" | cut -f1) KB)"
done
