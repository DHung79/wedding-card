#!/usr/bin/env bash
# ============================================================
#  BUILD SCRIPT — gộp source thành 1 file HTML standalone
#  Chạy: ./build.sh
#  Output: dist/wedding-card.html  (gửi trực tiếp, không cần hosting)
# ============================================================

set -euo pipefail

BASE="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$BASE/dist"

python3 "$BASE/build.py" "$BASE"
