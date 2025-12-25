# 📊 ShopComp Backend - Complete Project Tree

## Full Directory Structure

```
BackEnd/
│
├── 📄 Configuration & Setup Files
│   ├── package.json                    # Dependencies: Express, Puppeteer, Gemini, MCP
│   ├── tsconfig.json                   # TypeScript compiler settings
│   ├── .env.example                    # Environment variables template
│   ├── .gitignore                      # Git ignore rules
│   ├── Dockerfile                      # Docker image definition
│   └── docker-compose.yml              # Docker multi-container setup
│
├── 📚 Documentation Files (START HERE!)
│   ├── START_HERE.md                   # 🔴 READ THIS FIRST! - Visual setup guide
│   ├── QUICKSTART.md                   # 3-step quick start guide
│   ├── README.md                       # Complete API documentation
│   ├── API-DOCUMENTATION.md            # Detailed endpoints & flow diagrams
│   ├── SETUP_COMPLETE.md               # Project overview & features
│   ├── FILES-SUMMARY.md                # File structure reference
│   └── COMPLETED.md                    # Setup completion summary
│
├── 🧪 Testing & Examples
│   ├── examples.sh                     # Example API calls (Linux/Mac)
│   ├── examples.bat                    # Example API calls (Windows)
│   └── postman-collection.json         # Postman API collection
│
├── 📂 src/ (Source Code - 8 TypeScript Files)
│   │
│   ├── 🎯 index.ts
│   │   └── Express server entry point, middleware setup
│   │
│   ├── 🔌 routes/
│   │   └── api.ts
│   │       ├── POST   /api/analyze   ← Fetch & analyze with Gemini
│   │       ├── POST   /api/generate  ← Generate content
│   │       ├── POST   /api/extract   ← Extract data
│   │       └── GET    /health        ← Health check
│   │
│   ├── 🤖 services/ (Business Logic Layer)
│   │   ├── gemini.service.ts
│   │   │   ├── generateContent(prompt, context)
│   │   │   └── analyzePageContent(content, prompt)
│   │   │
│   │   └── puppeteer.service.ts
│   │       ├── fetchPageContent(url)
│   │       ├── takeScreenshot(url, path)
│   │       └── extractData(url, selector)
│   │
│   ├── 🔧 utils/ (Helper Functions)
│   │   ├── middleware.ts
│   │   │   ├── requestLogger - Log all requests
│   │   │   └── errorHandler - Catch & format errors
│   │   │
│   │   └── helpers.ts
│   │       ├── logger - Logging utility
│   │       ├── isValidUrl() - URL validation
│   │       ├── sanitizeText() - Text cleanup
│   │       ├── retry() - Retry async operations
│   │       └── formatError() - Error formatting
│   │
│   ├── 📋 types/ (TypeScript Interfaces)
│   │   └── index.ts
│   │       ├── AnalyzeRequest/Response
│   │       ├── GenerateRequest/Response
│   │       ├── ExtractRequest/Response
│   │       ├── HealthResponse
│   │       └── ErrorResponse
│   │
│   └── 🌐 mcp-server/ (AI Integration)
│       └── server.ts
│           ├── Tool: fetch_page_content
│           ├── Tool: analyze_page
│           ├── Tool: extract_data
│           └── Tool: generate_text
│
├── 📦 dist/ (Compiled JavaScript - Generated)
│   └── [Compiled .js files from src/]
│
└── 🗂️ Other Root Files
    ├── .env (Created from .env.example)
    └── node_modules/ (Created by npm install)
```

---

## 📊 Statistics

### Code Files
- **TypeScript Files**: 8 files
- **Total Lines of Code**: 1,000+
- **Type Definitions**: 8 interfaces
- **Express Routes**: 4 endpoints
- **MCP Tools**: 4 tools

### Documentation
- **README Files**: 7 files
- **Example Scripts**: 2 files (sh, bat)
- **API Collection**: 1 Postman file
- **Configuration Files**: 6 files

### Total Project Files: 25+

---

## 🔄 Data Flow Architecture

```
                          CLIENT REQUEST
                                │
                    ┌───────────┴───────────┐
                    │                       │
                    ▼                       ▼
            HTTP REST API (Express)    MCP Server (Stdio)
                    │                       │
        ┌───────────┴─────────────────────┬┘
        │           │           │         │
        ▼           ▼           ▼         ▼
    /analyze    /generate    /extract   Tools
        │           │           │         │
        └─────┬─────┴─────┬─────┴────────┘
              │           │
        ┌─────▼───────────▼──────┐
        │   Services Layer       │
        └─────┬────────────┬──────┘
              │            │
        ┌─────▼──────┐ ┌──▼──────────┐
        │Gemini API  │ │ Puppeteer   │
        │(Content)   │ │ (Web)       │
        └────────────┘ └─────────────┘
              │            │
              └────────┬───┘
                       │
               External Websites
```

---

## 🚀 Service Dependencies

### Express Server (`index.ts`)
↓
├── Routes (`routes/api.ts`)
│   ├── Gemini Service
│   ├── Puppeteer Service
│   └── Middleware
│
└── Middleware (`utils/middleware.ts`)
    └── Helpers (`utils/helpers.ts`)

### MCP Server (`mcp-server/server.ts`)
↓
├── Gemini Service
└── Puppeteer Service

---

## 🔐 Environment Variables

```
PORT=3000                    # Server port
NODE_ENV=development         # Environment
GEMINI_API_KEY=***          # Your API key (REQUIRED)
MCP_SERVER_PORT=3001        # MCP port
LOG_LEVEL=debug             # Logging level
```

---

## 📋 Endpoint Summary

### 1. POST /api/analyze
- **Input**: URL + Prompt
- **Process**: Fetch page → Analyze with Gemini
- **Output**: Analysis result + metadata
- **Use Case**: Q&A, summarization, content analysis

### 2. POST /api/generate
- **Input**: Prompt + Optional context
- **Process**: Generate with Gemini
- **Output**: Generated text
- **Use Case**: Content creation, copy writing

### 3. POST /api/extract
- **Input**: URL + CSS selector
- **Process**: Fetch page → Query elements
- **Output**: Array of matched elements
- **Use Case**: Data scraping, list extraction

### 4. GET /health
- **Input**: None
- **Output**: Server status + timestamp
- **Use Case**: Health monitoring

---

## 🛠️ Technology Stack

```
Frontend/Client
    ↓
Express.js (Node.js)
    ├── TypeScript (Type Safety)
    ├── Puppeteer (Web Automation)
    ├── Google Gemini (AI)
    ├── MCP SDK (Protocol)
    └── Utilities (Logging, Validation)
        ↓
    External APIs & Websites
```

---

## 📦 npm Dependencies

```json
{
  "express": "^4.18.2",              // Web framework
  "puppeteer": "^21.6.0",            // Web automation
  "google-generative-ai": "^0.3.0",  // Gemini AI
  "@modelcontextprotocol/sdk": "^1.0.0",  // MCP
  "dotenv": "^16.3.1",               // Environment vars
  "typescript": "^5.3.3",            // TypeScript
  "ts-node": "^10.9.2",              // TS runner
  "axios": "^1.6.2"                  // HTTP client
}
```

---

## 🚦 Development Workflow

```
1. Edit TypeScript Files (src/)
        ↓
2. npm run build (Compile to dist/)
        ↓
3. npm run dev (Auto-reload development)
        ↓
4. Test API (curl, Postman, scripts)
        ↓
5. Check Logs (Server output)
        ↓
6. Deploy (npm start or Docker)
```

---

## 🔄 Request-Response Lifecycle

```
Client Request
    ↓
Express Middleware (Logging)
    ↓
Route Handler (/analyze, /generate, /extract)
    ↓
Input Validation
    ↓
Service Processing
    ├── Puppeteer (if needed) → Fetch web content
    └── Gemini (if needed) → Process with AI
    ↓
Format Response
    ↓
Error Handling (if error)
    ↓
Client Response (JSON)
```

---

## 📱 Integration Points

### HTTP API
- Client libraries (fetch, axios, etc.)
- Browser-based requests
- Mobile apps
- Third-party services

### MCP Server
- Claude (Anthropic)
- Other LLMs
- AI applications
- Tool-using agents

---

## 🔐 Security Features

✅ Environment variable protection
✅ Input validation (URL, selectors)
✅ Error message sanitization
✅ Request logging
✅ HTTPS ready (configure in production)
✅ Type safety (TypeScript)

---

## 🚀 Scalability Considerations

- Browser instance pooling (Puppeteer)
- Timeout management (30 second default)
- Content size limits (10KB cutoff)
- Error recovery (retry logic)
- Logging infrastructure
- Docker containerization

---

## 📚 Quick Reference

### File Purposes

| File | Purpose |
|------|---------|
| `index.ts` | Express app setup |
| `api.ts` | API route handlers |
| `gemini.service.ts` | AI integration |
| `puppeteer.service.ts` | Web automation |
| `middleware.ts` | Request/error handling |
| `helpers.ts` | Utility functions |
| `index.ts` (types) | Type definitions |
| `server.ts` (mcp) | MCP server |

### Command Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Production server |
| `npm run mcp-server` | Start MCP server |

---

## 🎯 Next Steps

1. **Setup**: Follow [START_HERE.md](./START_HERE.md)
2. **Test**: Run examples with `examples.sh` or `examples.bat`
3. **Develop**: Customize services for your needs
4. **Deploy**: Use Docker or npm start

---

## 📞 Support Resources

- **Setup**: QUICKSTART.md
- **API Docs**: README.md & API-DOCUMENTATION.md
- **Examples**: examples.sh, examples.bat, postman-collection.json
- **Troubleshooting**: README.md Troubleshooting section
- **Code**: Source code comments in src/

---

**Everything is organized and ready to use!** 🎉

Start with [START_HERE.md](./START_HERE.md) for next steps.
