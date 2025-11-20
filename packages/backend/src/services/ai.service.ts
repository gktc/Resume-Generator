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

      const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, {
        model: OLLAMA_MODEL,
        messages,
        stream: false,
        options: {
          temperature: options?.temperature || 0.7,
          num_predict: options?.maxTokens || 2000,
        },
      });

      return response.data.message.content;
    } catch (error) {
      console.error('Ollama API error:', error);
      throw new Error('Failed to generate AI completion');
    }
  }

  /**
   * Generate a structured JSON response
   */
  async generateJSON<T>(
    prompt: string,
    systemPrompt?: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<T> {
    const fullPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include any explanatory text before or after the JSON.`;

    const response = await this.generateCompletion(fullPrompt, systemPrompt, {
      ...options,
      temperature: options?.temperature || 0.3, // Lower temperature for more consistent JSON
    });

    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return JSON.parse(response);
    } catch (error) {
      console.error('Failed to parse JSON response:', response);
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
