# ShopComp Backend - Architecture & API Documentation

## System Architecture

```
┌─────────────────┐
│  Client/AI Tool │
└────────┬────────┘
         │
         ├─────────────────────────────────────────────┐
         │                                             │
         ▼                                             ▼
    ┌─────────────┐                          ┌──────────────┐
    │  HTTP API   │                          │  MCP Server  │
    │ (Express)   │                          │ (Stdio)      │
    └──────┬──────┘                          └──────┬───────┘
           │                                        │
           ├────────────────┬──────────────────────┤
           │                │                      │
           ▼                ▼                      ▼
    ┌─────────────────────────────────────────────────┐
    │      Request Router / Handler                   │
    └─────────────────────────────────────────────────┘
           │           │              │
           ▼           ▼              ▼
    ┌──────────┐ ┌──────────┐ ┌──────────────┐
    │ /analyze │ │/generate │ │   /extract   │
    └─────┬────┘ └────┬─────┘ └──────┬───────┘
          │           │              │
          └─────┬─────┴──────┬───────┘
                │            │
                ▼            ▼
          ┌──────────────────────────┐
          │      Services Layer      │
          └──────────────────────────┘
                │            │
        ┌───────┴────────────┴────────┐
        │                            │
        ▼                            ▼
   ┌─────────────────┐        ┌──────────────┐
   │  Gemini AI      │        │  Puppeteer   │
   │  (Google Cloud) │        │ (Chromium)   │
   └─────────────────┘        └──────────────┘
         │                            │
         └───────────┬────────────────┘
                     │
                     ▼
          External URLs & Websites
```

## Data Flow Diagrams

### 1. Analyze Endpoint Flow

```
Client Request (URL + Prompt)
    │
    ▼
┌──────────────────────────────┐
│ POST /api/analyze            │
│ {                            │
│   "url": "https://...",      │
│   "prompt": "What is...?"    │
│ }                            │
└──────────────┬───────────────┘
               │
               ▼
        ┌─────────────────┐
        │ Puppeteer       │──▶ Fetch & Parse HTML/Text
        │ Service         │
        └────────┬────────┘
                 │
                 ▼ Page Content
        ┌─────────────────┐
        │ Gemini Service  │──▶ Analyze with Prompt
        │                 │
        └────────┬────────┘
                 │
                 ▼ Analysis Result
        ┌─────────────────┐
        │ Format Response │
        └────────┬────────┘
                 │
                 ▼
        JSON Response with
        Analysis + Metadata
```

### 2. Generate Endpoint Flow

```
Client Request (Prompt + Optional Context)
    │
    ▼
┌──────────────────────────────┐
│ POST /api/generate           │
│ {                            │
│   "prompt": "Write...",      │
│   "context": "Details..."    │
│ }                            │
└──────────────┬───────────────┘
               │
               ▼
        ┌─────────────────┐
        │ Gemini Service  │──▶ Generate Content
        │                 │
        └────────┬────────┘
                 │
                 ▼ Generated Text
        ┌─────────────────┐
        │ Format Response │
        └────────┬────────┘
                 │
                 ▼
        JSON Response with
        Generated Content
```

### 3. Extract Endpoint Flow

```
Client Request (URL + CSS Selector)
    │
    ▼
┌──────────────────────────────┐
│ POST /api/extract            │
│ {                            │
│   "url": "https://...",      │
│   "selector": ".item"        │
│ }                            │
└──────────────┬───────────────┘
               │
               ▼
        ┌─────────────────┐
        │ Puppeteer       │──▶ Load Page
        │ Service         │
        └────────┬────────┘
                 │
                 ▼ DOM Ready
        ┌─────────────────┐
        │ Query Selector  │──▶ Extract Elements
        │                 │
        └────────┬────────┘
                 │
                 ▼ Element List
        ┌─────────────────┐
        │ Format Response │
        └────────┬────────┘
                 │
                 ▼
        JSON Response with
        Extracted Data List
```

## API Endpoint Reference

### POST /api/analyze
**Purpose**: Fetch webpage and analyze with Gemini AI

**Request**:
```json
{
  "url": "https://example.com",
  "prompt": "What are the main topics?"
}
```

**Response** (Success):
```json
{
  "success": true,
  "data": {
    "analysis": "Based on the page content...",
    "pageUrl": "https://example.com",
    "prompt": "What are the main topics?",
    "timestamp": "2024-12-24T10:30:00Z"
  }
}
```

**Response** (Error):
```json
{
  "success": false,
  "error": "Invalid URL format"
}
```

---

### POST /api/generate
**Purpose**: Generate content using Gemini AI

**Request**:
```json
{
  "prompt": "Write a product description",
  "context": "Laptop with 16GB RAM and SSD"
}
```

**Response** (Success):
```json
{
  "success": true,
  "data": {
    "result": "A powerful and efficient laptop...",
    "prompt": "Write a product description",
    "timestamp": "2024-12-24T10:30:00Z"
  }
}
```

---

### POST /api/extract
**Purpose**: Extract structured data from webpage

**Request**:
```json
{
  "url": "https://example.com/products",
  "selector": ".product"
}
```

**Response** (Success):
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/products",
    "selector": ".product",
    "count": 12,
    "items": [
      {
        "text": "Product Name",
        "html": "<div class=\"product\">...</div>"
      }
    ],
    "timestamp": "2024-12-24T10:30:00Z"
  }
}
```

---

### GET /health
**Purpose**: Check if server is running

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-12-24T10:30:00Z"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error description"
}
```

### HTTP Status Codes
- `200`: Success
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Server Error

### Common Errors
- **Invalid URL**: "Invalid URL format"
- **Missing Field**: "Both URL and prompt are required"
- **API Error**: "[Service] error: description"
- **Network Error**: "Failed to fetch page content"

## Service Integration Points

### Gemini Service
- Location: `src/services/gemini.service.ts`
- Key Methods:
  - `generateContent(prompt, context)` - Generate text
  - `analyzePageContent(content, prompt)` - Analyze page

### Puppeteer Service
- Location: `src/services/puppeteer.service.ts`
- Key Methods:
  - `fetchPageContent(url)` - Get page text
  - `takeScreenshot(url, path)` - Capture page
  - `extractData(url, selector)` - Extract elements

## Request/Response Lifecycle

1. **Request Arrives** → Express middleware processes
2. **Validation** → Input validation (URL format, required fields)
3. **Processing** → Service layer handles business logic
4. **Response** → Formatted JSON response sent back
5. **Error Handling** → Caught and formatted consistently

## Performance Considerations

- **Timeouts**: 30 seconds for page loads
- **Content Limits**: 10,000 characters for analysis
- **Browser Reuse**: Single browser instance for efficiency
- **Error Recovery**: Automatic retries on network failures

---

For implementation details, see the source code in `src/` directory.
For testing, use the Postman collection: `postman-collection.json`
