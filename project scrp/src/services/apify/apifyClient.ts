import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';

dotenv.config();

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN ?? "",
});

export class ApifyService {
  async extractDataFromUrl(url: string): Promise<any> {
    const input = {
      "startUrls": [{ "url": url }],
      "useSitemaps": true,
      "crawlerType": "playwright:adaptive",
      "maxCrawlDepth": 20,
      "maxConcurrency": 200,
      "proxyConfiguration": {
        "useApifyProxy": true
      },
      "saveMarkdown": true,
      "removeElementsCssSelector": `nav, footer, script, style, noscript, svg, img[src^='data:'],
        [role="alert"], [role="banner"], [role="dialog"], [role="alertdialog"],
        [role="region"][aria-label*="skip" i], [aria-modal="true"]`
    };

    try {
      const run = await client.actor("aYG0l9s7dbB7j3gbS").call(input);
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      return items;
    } catch (error) {
      console.error('Apify API error:', error);
      throw error;
    }
  }
}

export default new ApifyService();
