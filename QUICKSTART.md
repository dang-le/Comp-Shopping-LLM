# Quick Start Guide

## Step 1: Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure your Gemini API key**:
   - Get a free API key from [Google AI Studio](https://ai.google.dev/)
   - Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Step 2: Run the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## Step 3: Test the API

### Using curl (Linux/Mac/Windows PowerShell):

**Analyze a webpage:**
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "prompt": "What is the main purpose of this website?"
  }'
```

**Generate content:**
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Write a catchy tagline for an online bookstore"
  }'
```

**Extract data:**
```bash
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "selector": ".product"
  }'
```

### Using example scripts:

**Linux/Mac:**
```bash
bash examples.sh
```

**Windows:**
```cmd
examples.bat
```

## Step 4: Run MCP Server (Optional)

The MCP server allows Claude and other AI tools to use your services:

```bash
npm run mcp-server
```

## Available Endpoints

- `POST /api/analyze` - Fetch and analyze webpage with Gemini AI
- `POST /api/generate` - Generate text with Gemini AI
- `POST /api/extract` - Extract structured data with Puppeteer
- `GET /health` - Health check

## Troubleshooting

**"Cannot find module" errors:**
```bash
npm install
npm run build
```

**Gemini API errors:**
- Check your API key is valid and set in `.env`
- Verify you have quota available in your Google Cloud project

**Puppeteer issues:**
- On Linux, you may need additional system packages (see README.md)
- Ensure you have enough disk space for browser downloads

## Docker Deployment

To run with Docker:

```bash
docker-compose up
```

This will start both the API server (port 3000) and expose port 3001 for MCP.

## Next Steps

1. Explore the API endpoints in the README.md
2. Check the MCP server implementation in `src/mcp-server/server.ts`
3. Customize services in `src/services/` for your needs
4. Add more routes in `src/routes/api.ts`

For detailed information, see [README.md](./README.md)
