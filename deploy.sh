#!/bin/bash
set -euo pipefail

echo "Building chillbuilder..."
npm run build

echo "Deploying chillbuilder to S3"
aws s3 sync ./dist/ s3://chillbuilder.alexmeub.com --cache-control max-age=604800 \
    --delete

# Set shorter cache on index.html so updates propagate quickly
aws s3 cp s3://chillbuilder.alexmeub.com/index.html s3://chillbuilder.alexmeub.com/index.html \
    --cache-control "max-age=60" \
    --content-type "text/html" \
    --metadata-directive REPLACE

echo "Creating CloudFront invalidation"
aws cloudfront create-invalidation --distribution-id E3SOERE1PB4DM4 --paths "/*"

echo "Deploy complete! https://chillbuilder.alexmeub.com"
