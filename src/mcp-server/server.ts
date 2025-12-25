import ServerModule from '@modelcontextprotocol/sdk/server/index.js';
// SDK typings vary; use dynamic access to avoid build-time type errors
const Server: any = (ServerModule as any).Server || (ServerModule as any).default || ServerModule;
const StdioServerTransport: any = (ServerModule as any).StdioServerTransport || (ServerModule as any).StdioTransport;
type CallToolRequest = any;
type Tool = any;
type TextContent = any;

// RequestSchema typing may not be exported as a type; use any
type RequestSchema = any;
import puppeteerService from '../services/puppeteer.service';
import geminiService from '../services/gemini.service';

const server = new Server({
  name: 'shopcomp-mcp-server',
  version: '1.0.0',
});

// Define available tools
const tools: any[] = [
  {
    name: 'fetch_page_content',
    description: 'Fetches the text content from a given URL',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to fetch content from',
        },
      },
      required: ['url'],
    } as RequestSchema,
  },
  {
    name: 'analyze_page',
    description: 'Fetches a page and analyzes its content with Gemini AI based on a prompt',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to analyze',
        },
        prompt: {
          type: 'string',
          description: 'The prompt/question to ask about the page content',
        },
      },
      required: ['url', 'prompt'],
    } as RequestSchema,
  },
  {
    name: 'extract_data',
    description: 'Extracts structured data from a URL using CSS selectors',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to extract data from',
        },
        selector: {
          type: 'string',
          description: 'CSS selector to target elements',
        },
      },
      required: ['url', 'selector'],
    } as RequestSchema,
  },
  {
    name: 'generate_text',
    description: 'Generate text using Gemini AI',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'The prompt to generate text from',
        },
        context: {
          type: 'string',
          description: 'Optional context information',
        },
      },
      required: ['prompt'],
    } as RequestSchema,
  },
];

// List available tools
server.setRequestHandler(
  { method: 'tools/list' },
  async () => ({
    tools,
  })
);

// Handle tool calls
server.setRequestHandler(
  { method: 'tools/call' },
  async (request: CallToolRequest) => {
    const { name, arguments: args } = request;

    try {
      switch (name) {
        case 'fetch_page_content': {
          const url = (args as any).url;
          if (!url) throw new Error('URL is required');

          const content = await puppeteerService.fetchPageContent(url);
          return {
            content: [
              {
                type: 'text',
                text: content.substring(0, 10000), // Limit response size
              } as TextContent,
            ],
          };
        }

        case 'analyze_page': {
          const url = (args as any).url;
          const prompt = (args as any).prompt;

          if (!url || !prompt) {
            throw new Error('Both URL and prompt are required');
          }

          const pageContent = await puppeteerService.fetchPageContent(url);
          const analysis = await geminiService.analyzePageContent(pageContent, prompt);

          return {
            content: [
              {
                type: 'text',
                text: analysis,
              } as TextContent,
            ],
          };
        }

        case 'extract_data': {
          const url = (args as any).url;
          const selector = (args as any).selector;

          if (!url || !selector) {
            throw new Error('Both URL and selector are required');
          }

          const data = await puppeteerService.extractData(url, selector);

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(data, null, 2),
              } as TextContent,
            ],
          };
        }

        case 'generate_text': {
          const prompt = (args as any).prompt;
          const context = (args as any).context;

          if (!prompt) throw new Error('Prompt is required');

          const result = await geminiService.generateContent(prompt, context);

          return {
            content: [
              {
                type: 'text',
                text: result,
              } as TextContent,
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          } as TextContent,
        ],
        isError: true,
      };
    }
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('ShopComp MCP Server started successfully');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
