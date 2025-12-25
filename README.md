# ShopComp Backend Server

A powerful Node.js backend application combining Gemini AI with Puppeteer web automation and a Model Context Protocol (MCP) server. This system receives requests with URLs and prompts to fetch, analyze, and extract data from web pages intelligently.

## Features

- **Express.js REST API**: Simple HTTP endpoints for all operations
- **Gemini AI Integration**: Leverage Google's Generative AI for intelligent content analysis
- **Puppeteer Web Automation**: Fetch and interact with web pages
- **MCP Server**: Model Context Protocol server for advanced AI interactions
- **TypeScript**: Full type safety and better developer experience
- **Error Handling**: Comprehensive error management and logging
- **Environment Configuration**: Secure configuration management with `.env` files

## Prerequisites

- Node.js 18+ and npm
- Google Gemini API key ([Get one here](https://ai.google.dev/))
- Modern browser compatible with Puppeteer (Chrome/Chromium)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
MCP_SERVER_PORT=3001
LOG_LEVEL=debug
```

### 3. Build the Project

```bash
npm run build
```

## Usage

### Development Mode

Run with auto-reload:

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Run MCP Server

```bash
npm run mcp-server
```

## API Endpoints

### 1. Analyze Page Content with Prompt

**Endpoint**: `POST /api/analyze`

Fetches a webpage and analyzes its content using Gemini AI based on your prompt.

**Request**:
```json
{
  "url": "https://example.com",
  "prompt": "What are the main products offered?"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "analysis": "Based on the page content...",
    "pageUrl": "https://example.com",
    "prompt": "What are the main products offered?",
    "timestamp": "2024-12-24T10:30:00Z"
  }
}
```

### 2. Generate Content with Gemini

**Endpoint**: `POST /api/generate`

Generate text using Gemini AI with optional context.

**Request**:
```json
{
  "prompt": "Write a product description for an online shop",
  "context": "The product is a laptop with 16GB RAM"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "result": "Generated content...",
    "prompt": "Write a product description...",
    "timestamp": "2024-12-24T10:30:00Z"
  }
}
```

### 3. Extract Structured Data

**Endpoint**: `POST /api/extract`

Extract structured data from a webpage using CSS selectors.

**Request**:
```json
{
  "url": "https://example.com/products",
  "selector": ".product-item"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/products",
    "selector": ".product-item",
    "count": 5,
    "items": [
      {
        "text": "Product name",
        "html": "<div class=\"product-item\">...</div>"
      }
    ],
    "timestamp": "2024-12-24T10:30:00Z"
  }
}
```

### 4. Health Check

**Endpoint**: `GET /health`

Check if the server is running.

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-12-24T10:30:00Z"
}
```

## MCP Server Tools

The MCP server exposes the following tools:

1. **fetch_page_content**: Fetch text content from a URL
2. **analyze_page**: Fetch and analyze page content with a prompt
3. **extract_data**: Extract structured data using CSS selectors
4. **generate_text**: Generate text using Gemini AI

## Project Structure

```
BackEnd/
├── src/
│   ├── index.ts                 # Express app entry point
│   ├── routes/
│   │   └── api.ts               # API route handlers
│   ├── services/
│   │   ├── gemini.service.ts   # Gemini AI integration
│   │   └── puppeteer.service.ts # Puppeteer automation
│   ├── utils/
│   │   └── middleware.ts        # Express middleware
│   └── mcp-server/
│       └── server.ts            # MCP server implementation
├── dist/                         # Compiled JavaScript
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript config
├── .env.example                 # Environment template
└── README.md                    # This file
```

## Error Handling

All endpoints return a consistent error response:

```json
{
  "success": false,
  "error": "Error description"
}
```

Common HTTP status codes:
- **200**: Success
- **400**: Bad request (invalid parameters)
- **404**: Endpoint not found
- **500**: Server error

## Performance Considerations

- **Puppeteer**: Uses headless Chrome with optimized settings
- **Page Timeout**: 30 seconds for page loads
- **Content Limit**: Responses are truncated to prevent memory issues
- **Browser Reuse**: Browser instance is reused across requests
- **Error Recovery**: Graceful error handling and resource cleanup

## Security Best Practices

1. **API Key Management**: Never commit `.env` files with real keys
2. **Input Validation**: All inputs are validated before processing
3. **URL Validation**: URLs are validated before fetching
4. **Resource Limits**: Implement rate limiting for production use
5. **HTTPS**: Use HTTPS in production

## Troubleshooting

### "GEMINI_API_KEY is not set"

Make sure your `.env` file has the `GEMINI_API_KEY` set:
```bash
GEMINI_API_KEY=your_actual_api_key
```

### Browser launch failed

Ensure you have all dependencies:
```bash
npm install
```

If on Linux, you may need system packages:
```bash
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libpango-1.0-0 libx11-6 libxss1
```

### Timeout errors

Increase the timeout in `puppeteer.service.ts`:
```typescript
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue in the repository.
