import { Router, Request, Response } from 'express';
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
    options?: any[];
    analysis?: string;
    pageUrl: string;
    prompt: string;
    timestamp: string;
  };
  error?: string;
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

    console.log(`Processing request for URL: ${url}`);
    console.log(`User prompt: ${prompt}`);

    // Use smart prompt-based control to interact with the page
    const { name, price, options, content } = await puppeteerService.executePromptActions(url, prompt);

    // Use Gemini for additional analysis if needed
    let analysis: string | undefined;
    if (prompt.toLowerCase().includes('analysis') || prompt.toLowerCase().includes('analyze')) {
      analysis = await geminiService.analyzePageContent(content, prompt);
    }

    res.json({
      success: true,
      data: {
        name,
        price,
        options,
        analysis,
        pageUrl: url,
        prompt,
        timestamp: new Date().toISOString(),
      },
    });
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

    res.json({
      success: true,
      data: {
        result,
        prompt,
        timestamp: new Date().toISOString(),
      },
    });
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

    res.json({
      success: true,
      data: {
        url,
        selector,
        count: data.length,
        items: data,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error in /extract endpoint:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
});

export default router;
