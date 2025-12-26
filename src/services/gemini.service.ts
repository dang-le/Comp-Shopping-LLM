import axios from 'axios';
import dotenv from 'dotenv';

// Ensure dotenv is loaded before accessing env vars
dotenv.config();

class GeminiService {
  private apiKey: string | undefined;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-lite';
    console.log('GeminiService initialized with model:', this.model);
    console.log('GeminiService initialized with apiKey:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'undefined');
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY not set — Gemini requests will fail until provided');
    }
  }

  async generateContent(prompt: string, context?: string): Promise<string> {
    const fullPrompt = context ? `${context}\n\n${prompt}` : prompt;

    if (!this.apiKey) {
      // Fallback: return the prompt when no API key is configured
      return `NO_API_KEY: ${fullPrompt}`;
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const body = {
        contents: [
          {
            parts: [
              {
                text: fullPrompt,
              },
            ],
          },
        ],
      };

      const resp = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });

      // Parse response
      const data: any = resp.data;
      
      if (data?.candidates && data.candidates.length > 0) {
        const candidate = data.candidates[0];
        if (candidate.content?.parts && candidate.content.parts.length > 0) {
          const text = candidate.content.parts[0].text;
          return text || JSON.stringify(candidate.content.parts[0]);
        }
        return JSON.stringify(candidate);
      }
      if (data?.output) return data.output;
      if (typeof data === 'string') return data;

      return JSON.stringify(data);
    } catch (error: any) {
      console.error('Gemini API Error Details:', error.response?.data || error.message);
      throw new Error(`Gemini API error: ${error?.message || String(error)}`);
    }
  }

  async analyzePageContent(pageContent: string, prompt: string): Promise<string> {
    const analysisPrompt = `Analyze the following web page content and answer the question:\n\nPAGE CONTENT:\n${pageContent}\n\nQUESTION:\n${prompt}\n\nProvide a comprehensive and concise answer based on the page content.`;

    return this.generateContent(analysisPrompt);
  }
}

export default new GeminiService();
