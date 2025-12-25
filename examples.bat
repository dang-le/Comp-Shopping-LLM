@echo off
REM Example usage of the ShopComp Backend API for Windows

set BASE_URL=http://localhost:3000

echo === ShopComp Backend API Examples ===
echo.

REM 1. Health check
echo 1. Health Check
echo ---
curl -X GET "%BASE_URL%/health" ^
  -H "Content-Type: application/json"
echo.
echo.

REM 2. Analyze a page with a prompt
echo 2. Analyze Page with Gemini AI
echo ---
curl -X POST "%BASE_URL%/api/analyze" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\": \"https://example.com\", \"prompt\": \"What is this website about?\"}"
echo.
echo.

REM 3. Generate content with Gemini
echo 3. Generate Content with Gemini
echo ---
curl -X POST "%BASE_URL%/api/generate" ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\": \"Write a product description\", \"context\": \"Wireless Headphones\"}"
echo.
echo.

REM 4. Extract data from a page
echo 4. Extract Structured Data
echo ---
curl -X POST "%BASE_URL%/api/extract" ^
  -H "Content-Type: application/json" ^
  -d "{\"url\": \"https://example.com\", \"selector\": \"a\"}"
echo.
echo.

echo === End of Examples ===
