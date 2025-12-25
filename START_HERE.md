# 🚀 ShopComp Backend - Complete Setup Guide

## ✅ Project Created Successfully!

Your complete Node.js backend project is ready with all components integrated:

```
🎯 ShopComp Backend
├── 📚 Express API Server (3 endpoints)
├── 🤖 Gemini AI Integration
├── 🕷️  Puppeteer Web Automation
├── 🔌 MCP Server (4 tools)
└── 📦 Docker Support
```

## 📋 What You Have

### API Endpoints
```
POST   /api/analyze          Fetch & analyze webpages with AI
POST   /api/generate         Generate content with Gemini
POST   /api/extract          Extract structured data
GET    /health               Check server status
```

### Services
```
✓ Gemini AI Service        - Content analysis & generation
✓ Puppeteer Service        - Web automation & scraping
✓ MCP Server               - AI tool integration
✓ Express API              - REST endpoints
```

### Key Files
```
src/
  ├── index.ts                      Main server
  ├── routes/api.ts                 API endpoints
  ├── services/
  │   ├── gemini.service.ts         AI integration
  │   └── puppeteer.service.ts      Web automation
  ├── utils/
  │   ├── middleware.ts             Request handling
  │   └── helpers.ts                Utilities
  ├── types/index.ts                TypeScript types
  └── mcp-server/server.ts          MCP server

Configuration:
  ├── package.json                  Dependencies
  ├── tsconfig.json                 TypeScript config
  ├── Dockerfile                    Docker image
  ├── docker-compose.yml            Docker compose
  └── .env.example                  Environment template

Documentation:
  ├── README.md                     Full documentation
  ├── QUICKSTART.md                 Quick start (READ THIS FIRST!)
  ├── API-DOCUMENTATION.md          API reference & diagrams
  ├── SETUP_COMPLETE.md             Setup overview
  └── FILES-SUMMARY.md              File listing

Examples:
  ├── examples.sh                   API calls (Linux/Mac)
  ├── examples.bat                  API calls (Windows)
  └── postman-collection.json       Postman collection
```

## 🚀 Getting Started (3 Steps)

### Step 1️⃣: Install Dependencies
```bash
npm install
```

### Step 2️⃣: Configure API Key
```bash
# Copy example config
cp .env.example .env

# Edit .env and add your Gemini API key
# Get one free at: https://ai.google.dev/
```

Your `.env` should look like:
```
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_key_here
MCP_SERVER_PORT=3001
LOG_LEVEL=debug
```

### Step 3️⃣: Start the Server
```bash
npm run dev
```

Server will start on: `http://localhost:3000`

## 🧪 Test the API

### Option A: Using curl
```bash
# Analyze a webpage
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "prompt": "What is this website about?"
  }'
```

### Option B: Using example scripts
```bash
# Linux/Mac
bash examples.sh

# Windows
examples.bat
```

### Option C: Using Postman
1. Import `postman-collection.json` into Postman
2. Set `base_url` variable to `http://localhost:3000`
3. Run requests

## 📚 Documentation Guide

| Document | Read When | Purpose |
|----------|-----------|---------|
| **QUICKSTART.md** | 🔴 FIRST | Fast setup & basic testing |
| **README.md** | Next | Complete API documentation |
| **API-DOCUMENTATION.md** | As needed | Detailed endpoints & diagrams |
| **SETUP_COMPLETE.md** | Reference | Overview of what's built |
| **FILES-SUMMARY.md** | Reference | File structure details |

**👉 Start with QUICKSTART.md for immediate setup!**

## 🛠️ Common Commands

```bash
# Development (auto-reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Start MCP server only
npm run mcp-server

# Both server and MCP (in separate terminals)
npm run dev        # Terminal 1
npm run mcp-server # Terminal 2
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up

# Runs on ports 3000 (API) and 3001 (MCP)
```

## 🎯 What Each Endpoint Does

### 1. Analyze (`POST /api/analyze`)
Fetch a webpage and ask AI questions about it.

**Use for**:
- Summarizing content
- Extracting information
- Q&A about pages
- Content understanding

**Example**:
```json
{
  "url": "https://example.com",
  "prompt": "What products do you sell?"
}
```

### 2. Generate (`POST /api/generate`)
Generate content with AI.

**Use for**:
- Product descriptions
- Marketing copy
- Creative writing
- SEO content

**Example**:
```json
{
  "prompt": "Write a product description",
  "context": "Laptop 16GB RAM, SSD storage"
}
```

### 3. Extract (`POST /api/extract`)
Extract data from pages using CSS selectors.

**Use for**:
- Web scraping
- Data collection
- Link extraction
- List gathering

**Example**:
```json
{
  "url": "https://example.com/products",
  "selector": ".product"
}
```

## 🔐 Security Notes

✅ API keys stored in `.env` (not committed)
✅ Input validation on all endpoints
✅ Error messages don't leak sensitive info
✅ HTTPS recommended for production
✅ Rate limiting recommended for production

## ❓ Troubleshooting

### "GEMINI_API_KEY is not set"
```bash
# Make sure .env exists and has your key
cat .env | grep GEMINI_API_KEY
```

### "Port already in use"
```bash
# Change PORT in .env to another number
PORT=3001
```

### TypeScript errors after changes
```bash
npm run build
```

### Browser launch fails
```bash
# Use Docker instead
docker-compose up
```

## 📞 Support

1. **Check documentation** - See README.md and API-DOCUMENTATION.md
2. **Review examples** - Run examples.sh or examples.bat
3. **Check source code** - Comments in src/ files
4. **Test with Postman** - Import postman-collection.json

## 🎉 You're All Set!

Your backend is ready to use. Next steps:

1. ✅ Read QUICKSTART.md
2. ✅ Start the server with `npm run dev`
3. ✅ Test endpoints with curl or examples
4. ✅ Check documentation as needed
5. ✅ Customize for your needs

## 📖 Documentation Map

```
START HERE ──▶ QUICKSTART.md
                  │
                  ├──▶ README.md (Full API docs)
                  ├──▶ API-DOCUMENTATION.md (Diagrams)
                  ├──▶ SETUP_COMPLETE.md (Overview)
                  └──▶ FILES-SUMMARY.md (File listing)
```

## 🚀 Production Deployment

When ready to deploy:

1. Build: `npm run build`
2. Create `.env` with production keys
3. Deploy `dist/` folder
4. Run: `npm start`
5. Or use Docker: `docker-compose up`

---

## 🎯 Quick Links

- **Gemini API**: https://ai.google.dev/
- **Puppeteer Docs**: https://pptr.dev/
- **Express Docs**: https://expressjs.com/
- **MCP Docs**: https://modelcontextprotocol.io/

---

**Happy coding! 🎉**

Built with Node.js, Gemini AI, Puppeteer, Express, and TypeScript

For questions, check the documentation files in this project.
