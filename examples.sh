#!/usr/bin/env bash
# Example usage of the ShopComp Backend API

BASE_URL="http://localhost:3000"

echo "=== ShopComp Backend API Examples ==="
echo

# 1. Health check
echo "1. Health Check"
echo "---"
curl -X GET "$BASE_URL/health" \
  -H "Content-Type: application/json"
echo
echo

# 2. Analyze a page with a prompt
echo "2. Analyze Page with Gemini AI"
echo "---"
curl -X POST "$BASE_URL/api/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "prompt": "What is this website about? Provide a brief summary."
  }'
echo
echo

# 3. Generate content with Gemini
echo "3. Generate Content with Gemini"
echo "---"
curl -X POST "$BASE_URL/api/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a product description for an e-commerce website",
    "context": "Product: Wireless Headphones, Features: Noise cancellation, 30-hour battery, Bluetooth 5.0"
  }'
echo
echo

# 4. Extract data from a page
echo "4. Extract Structured Data"
echo "---"
curl -X POST "$BASE_URL/api/extract" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "selector": "a"
  }'
echo
echo

echo "=== End of Examples ==="
