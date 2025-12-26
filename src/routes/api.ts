import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import geminiService from '../services/gemini.service';
import puppeteerService from '../services/puppeteer.service';

const router = Router();

interface AnalyzeRequest {
  url: string;
  prompt: string;
}

interface AnalyzeResponse {
  success: boolean;
  data?: {
    name?: string;
    price?: string;
    sku?: string;
    analysis?: string;
    pageUrl: string;
    prompt: string;
    timestamp: string;
  };
  error?: string;
}

// Helper function to save response to JSON file
function saveResponseToFile(data: any, endpoint: string) {
  const resultsDir = path.join(__dirname, '../../results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${endpoint}-${timestamp}.json`;
  const filepath = path.join(resultsDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`Response saved to ${filepath}`);
}

// Main endpoint: Analyze URL content with Gemini prompt
router.post('/analyze', async (req: Request, res: Response<AnalyzeResponse>) => {
  try {
    const { url, prompt } = req.body as AnalyzeRequest;

    // Validate input
    if (!url || !prompt) {
      return res.status(400).json({
        success: false,
        error: 'Both URL and prompt are required',
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format',
      });
    }

    // Use smart prompt-based control to interact with the page
    const { name, price, sku, content } = await puppeteerService.executePromptActions(url, prompt);

    // Use Gemini for additional analysis if needed
    let analysis: string | undefined;
    analysis = await geminiService.analyzePageContent(content, prompt);

    const responseData = {
      success: true,
      data: {
        name,
        price,
        sku,
        analysis,
        pageUrl: url,
        prompt,
        timestamp: new Date().toISOString(),
      },
    };

    // Save response to file
    saveResponseToFile(responseData, 'analyze');

    res.json(responseData);
  } catch (error) {
    console.error('Error in /analyze endpoint:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

// Endpoint: Generate content with Gemini
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, context } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required',
      });
    }

    const result = await geminiService.generateContent(prompt, context);

    const responseData = {
      success: true,
      data: {
        result,
        prompt,
        timestamp: new Date().toISOString(),
      },
    };

    // Save response to file
    saveResponseToFile(responseData, 'generate');

    res.json(responseData);
  } catch (error) {
    console.error('Error in /generate endpoint:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

// Endpoint: Extract structured data from URL
router.post('/extract', async (req: Request, res: Response) => {
  try {
    const { url, selector } = req.body;

    if (!url || !selector) {
      return res.status(400).json({
        success: false,
        error: 'Both URL and selector are required',
      });
    }

    const data = await puppeteerService.extractData(url, selector);

    const responseData = {
      success: true,
      data: {
        url,
        selector,
        count: data.length,
        items: data,
        timestamp: new Date().toISOString(),
      },
    };

    // Save response to file
    saveResponseToFile(responseData, 'extract');

    res.json(responseData);
  } catch (error) {
    console.error('Error in /extract endpoint:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});


// Main endpoint: Analyze URL content with Gemini prompt
router.post('/ai', async (req: Request, res: Response<AnalyzeResponse>) => {
  try {
    const { url, prompt } = req.body as AnalyzeRequest;

    // Validate input
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL are required',
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format',
      });
    }
    var prompts = prompt + " " + url;
    // Use smart prompt-based control to interact with the page
    const { name, price, sku, content } = await puppeteerService.executePromptActions(url, "");

    // Use Gemini for additional analysis if needed
    let analysis: string | undefined;
    analysis = await geminiService.generateContent(prompts);

    const responseData = {
      success: true,
      data: {
        name,
        price,
        sku,
        analysis,
        pageUrl: url,
        prompt : prompts,
        timestamp: new Date().toISOString(),
      },
    };

    // Save response to file
    saveResponseToFile(responseData, 'analyze');

    res.json(responseData);
  } catch (error) {
    console.error('Error in /analyze endpoint:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

export default router;
