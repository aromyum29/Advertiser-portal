#!/usr/bin/env bash
# Rebuilds the case study and packages it as a downloadable zip.
set -euo pipefail
cd "$(dirname "$0")"
node build.mjs
rm -rf .pkg koko-advertiser-case-study.zip
mkdir -p .pkg/koko-advertiser-case-study
cp -a index.html artifact.html README.md TEMPLATE-GUIDE.md build.mjs src shots .pkg/koko-advertiser-case-study/
(cd .pkg && zip -qr9 ../koko-advertiser-case-study.zip koko-advertiser-case-study)
rm -rf .pkg
echo "koko-advertiser-case-study.zip written ($(du -h koko-advertiser-case-study.zip | cut -f1))"
