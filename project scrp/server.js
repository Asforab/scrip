import express from 'express';
import OpenAI from 'openai';
import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const apifyClient = new ApifyClient({
  token: process.env.APIFY_API_TOKEN
});

async function runApifyScraper(url) {
  const input = {
    "startUrls": [{ "url": url }],
    "useSitemaps": true,
    "crawlerType": "playwright:adaptive",
    "maxCrawlDepth": 20,
    "maxConcurrency": 200,
    "proxyConfiguration": {
      "useApifyProxy": true
    },
    "saveMarkdown": true
  };

  const run = await apifyClient.actor("aYG0l9s7dbB7j3gbS").call(input);
  return await apifyClient.dataset(run.defaultDatasetId).listItems();
}

app.post('/process', async (req, res) => {
  try {
    const { url, query } = req.body;

    // Create a thread
    const thread = await openai.beta.threads.create();

    // If URL is provided, scrape it
    let scrapedContent = '';
    if (url) {
      const scrapingResults = await runApifyScraper(url);
      scrapedContent = JSON.stringify(scrapingResults);
    }

    // Create message in thread
    const message = `${query}\n\nScraping Results: ${scrapedContent}`;
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });

    // Run assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID
    });

    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    // Get messages
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];

    res.json({
      response: lastMessage.content[0].text.value,
      threadId: thread.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
