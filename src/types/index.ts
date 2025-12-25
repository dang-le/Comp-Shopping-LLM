/**
 * Type definitions for the ShopComp Backend API
 */

/**
 * Request payload for analyzing a webpage
 */
export interface AnalyzeRequest {
  url: string;
  prompt: string;
}

/**
 * Response from analyze endpoint
 */
export interface AnalyzeResponse {
  success: boolean;
  data?: {
    analysis: string;
    pageUrl: string;
    prompt: string;
    timestamp: string;
  };
  error?: string;
}

/**
 * Request payload for generating content
 */
export interface GenerateRequest {
  prompt: string;
  context?: string;
}

/**
 * Response from generate endpoint
 */
export interface GenerateResponse {
  success: boolean;
  data?: {
    result: string;
    prompt: string;
    timestamp: string;
  };
  error?: string;
}

/**
 * Request payload for extracting data
 */
export interface ExtractRequest {
  url: string;
  selector: string;
}

/**
 * Response from extract endpoint
 */
export interface ExtractResponse {
  success: boolean;
  data?: {
    url: string;
    selector: string;
    count: number;
    items: Array<{
      text: string | null;
      html: string;
    }>;
    timestamp: string;
  };
  error?: string;
}

/**
 * Health check response
 */
export interface HealthResponse {
  status: 'OK' | 'ERROR';
  timestamp: string;
}

/**
 * Error response
 */
export interface ErrorResponse {
  success: false;
  error: string;
}
