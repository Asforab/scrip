import OpenAI from 'openai';
import { ApifyService } from '../apify/apifyClient';

export class WebScrapingAssistant {
  constructor(
    private openai: OpenAI,
    private assistantId: string,
    private apifyService: ApifyService
  ) {}

  async processUrl(url: string): Promise<any> {
    try {
      const scrapedData = await this.apifyService.extractDataFromUrl(url);
      const thread = await this.openai.beta.threads.create();
      
      await this.openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: `Process this scraped data: ${JSON.stringify(scrapedData)}`
      });

      const run = await this.openai.beta.threads.runs.create(thread.id, {
        assistant_id: this.assistantId
      });

      let runStatus = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
      while (runStatus.status !== 'completed') {
        if (runStatus.status === 'failed') {
          throw new Error('Assistant run failed');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      const messages = await this.openai.beta.threads.messages.list(thread.id);
      return {
        processedData: messages.data[0]?.content[0]?.text?.value,
        rawData: scrapedData
      };
    } catch (error) {
      console.error('Web scraping error:', error);
      throw error;
    }
  }
}

export class ChiefOfData {
  constructor(
    private openai: OpenAI,
    private assistantId: string,
    private webScrapingAssistant: WebScrapingAssistant
  ) {}

  async processMessage(message: string): Promise<string> {
    try {
      const thread = await this.openai.beta.threads.create();
      
      await this.openai.beta.threads.messages.create(thread.id, {
        role: 'user',
        content: message
      });

      const run = await this.openai.beta.threads.runs.create(thread.id, {
        assistant_id: this.assistantId
      });

      let runStatus = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      while (runStatus.status !== 'completed') {
        if (runStatus.status === 'failed') {
          throw new Error('Assistant run failed');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(thread.id, run.id);
      }

      const messages = await this.openai.beta.threads.messages.list(thread.id);
      const response = messages.data[0]?.content[0]?.text?.value;

      // Check if response contains a URL
      const urlMatch = response?.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        const scrapingResult = await this.webScrapingAssistant.processUrl(urlMatch[0]);
        return this.formatResponse(scrapingResult);
      }

      return response ?? "I couldn't process your request.";
    } catch (error) {
      console.error('Chief of Data error:', error);
      throw error;
    }
  }

  private formatResponse(data: any): string {
    const summary = data.processedData;
    const rawDataUrl = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data.rawData))}`;
    
    return `${summary}\n\n[View complete data](${rawDataUrl})`;
  }
}
