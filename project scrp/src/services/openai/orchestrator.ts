import OpenAI from 'openai';
import dotenv from 'dotenv';
import { WebScrapingAssistant, ChiefOfData } from './agents';
import apifyService from '../apify/apifyClient';

dotenv.config();

const CHIEF_OF_DATA_ID = process.env.CHIEF_OF_DATA_ID;
const WEB_SCRAPING_ASSISTANT_ID = process.env.WEB_SCRAPING_ASSISTANT_ID;

if (!CHIEF_OF_DATA_ID || !WEB_SCRAPING_ASSISTANT_ID) {
  throw new Error('Missing required environment variables');
}

export class Orchestrator {
  private chiefOfData: ChiefOfData;

  constructor(private openai: OpenAI) {
    const webScrapingAssistant = new WebScrapingAssistant(
      openai,
      WEB_SCRAPING_ASSISTANT_ID,
      apifyService
    );

    this.chiefOfData = new ChiefOfData(
      openai,
      CHIEF_OF_DATA_ID,
      webScrapingAssistant
    );
  }

  async processInput(message: string): Promise<string> {
    try {
      return await this.chiefOfData.processMessage(message);
    } catch (error) {
      console.error('Orchestration error:', error);
      return 'An error occurred while processing your request.';
    }
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
export default new Orchestrator(openai);
