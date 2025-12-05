import axios from 'axios';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma2:2b';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  model: string;
  done: boolean;
}

export class AIService {
  /**
   * Generate a completion using Ollama
   */
  async generateCompletion(
    prompt: string,
    systemPrompt?: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> {
    console.log('=== Ollama API Call ===');
    console.log('Model:', OLLAMA_MODEL);
    console.log('Base URL:', OLLAMA_BASE_URL);
    console.log('Prompt length:', prompt.length);
    console.log('System prompt length:', systemPrompt?.length || 0);
    
    try {
      const messages: AIMessage[] = [];

      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      messages.push({
        role: 'user',
        content: prompt,
      });

      console.log('Sending request to Ollama...');
      const requestBody: any = {
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        options: {
          temperature: options?.temperature || 0.7,
          num_predict: options?.maxTokens || 2000,
        },
      };
      
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, requestBody);

      console.log('Ollama response received. Content length:', response.data.message.content.length);
      return response.data.message.content;
    } catch (error: any) {
      console.error('=== Ollama API Error ===');
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw new Error('Failed to generate AI completion');
    }
  }

  /**
   * Generate a structured JSON response using Ollama's JSON format mode
   */
  async generateJSON<T>(
    prompt: string,
    systemPrompt?: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<T> {
    console.log('=== Generating JSON with Ollama ===');
    console.log('Model:', OLLAMA_MODEL);
    
    const fullPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include any explanatory text, markdown formatting, or code blocks. Start directly with { and end with }.`;

    try {
      const messages: AIMessage[] = [];

      if (systemPrompt) {
        messages.push({
          role: 'system',
          content: systemPrompt,
        });
      }

      messages.push({
        role: 'user',
        content: fullPrompt,
      });

      console.log('Sending JSON request to Ollama...');
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, {
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        format: 'json', // Force JSON output
        options: {
          temperature: options?.temperature || 0.3,
          num_predict: options?.maxTokens || 2000,
        },
      });

      const content = response.data.message.content;
      console.log('=== Parsing JSON Response ===');
      console.log('Raw response (first 500 chars):', content.substring(0, 500));

      // Remove markdown code blocks if present
      let cleanedResponse = content.trim();
      
      // Remove ```json and ``` markers
      cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '');
      cleanedResponse = cleanedResponse.replace(/^```\s*/i, '');
      cleanedResponse = cleanedResponse.replace(/\s*```$/i, '');
      
      // Remove any text before the first {
      const firstBrace = cleanedResponse.indexOf('{');
      if (firstBrace > 0) {
        cleanedResponse = cleanedResponse.substring(firstBrace);
      }
      
      // Remove any text after the last }
      const lastBrace = cleanedResponse.lastIndexOf('}');
      if (lastBrace !== -1 && lastBrace < cleanedResponse.length - 1) {
        cleanedResponse = cleanedResponse.substring(0, lastBrace + 1);
      }

      console.log('Cleaned response (first 500 chars):', cleanedResponse.substring(0, 500));
      
      // Try to parse the cleaned response
      const parsed = JSON.parse(cleanedResponse);
      console.log('JSON parsed successfully');
      return parsed;
    } catch (error: any) {
      console.error('=== JSON Generation Failed ===');
      console.error('Error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      throw new Error('AI returned invalid JSON');
    }
  }

  /**
   * Check if Ollama is available
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get list of available models
   */
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await axios.get(`${OLLAMA_BASE_URL}/api/tags`);
      return response.data.models.map((model: any) => model.name);
    } catch (error) {
      console.error('Failed to get models:', error);
      return [];
    }
  }

  /**
   * Check if the configured model is available
   */
  async isModelAvailable(): Promise<boolean> {
    try {
      const models = await this.getAvailableModels();
      return models.includes(OLLAMA_MODEL);
    } catch (error) {
      return false;
    }
  }
}

export const aiService = new AIService();
