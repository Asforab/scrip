import { ApifyClient } from 'apify-client';

const client = new ApifyClient({
  token: '<YOUR_API_TOKEN>',
});

const input = {
  "runMode": "DEVELOPMENT",
  "startUrls": [
    {
      "url": "https://crawlee.dev"
    }
  ],
  "keepUrlFragments": false,
  "linkSelector": "a[href]",
  "globs": [
    {
      "glob": "https://crawlee.dev/*/*"
    }
  ],
  "pseudoUrls": [],
  "excludes": [
    {
      "glob": "/**/*.{png,jpg,jpeg,pdf}"
    }
  ],
  "pageFunction": `async function pageFunction(context) {
    const $ = context.jQuery;
    const pageTitle = $('title').first().text();
    const h1 = $('h1').first().text();
    const first_h2 = $('h2').first().text();
    const random_text_from_the_page = $('p').first().text();

    context.log.info(\`URL: \${context.request.url}, TITLE: \${pageTitle}\`);

    await context.enqueueRequest({ url: 'http://www.example.com' });

    return {
      url: context.request.url,
      pageTitle,
      h1,
      first_h2,
      random_text_from_the_page
    };
  }`,
  "injectJQuery": true,
  "proxyConfiguration": {
    "useApifyProxy": true
  },
  "proxyRotation": "RECOMMENDED",
  "initialCookies": [],
  "useChrome": false,
  "headless": true,
  "ignoreSslErrors": false,
  "ignoreCorsAndCsp": false,
  "downloadMedia": true,
  "downloadCss": true,
  "maxRequestRetries": 3,
  "maxPagesPerCrawl": 0,
  "maxResultsPerCrawl": 0,
  "maxCrawlingDepth": 0,
  "maxConcurrency": 50,
  "pageLoadTimeoutSecs": 60,
  "pageFunctionTimeoutSecs": 60,
  "waitUntil": [
    "networkidle2"
  ],
  "preNavigationHooks": `[async (crawlingContext, gotoOptions) => {}]`,
  "postNavigationHooks": `[async (crawlingContext) => {}]`,
  "breakpointLocation": "NONE",
  "closeCookieModals": false,
  "maxScrollHeightPixels": 5000,
  "debugLog": false,
  "browserLog": false,
  "customData": {}
};

try {
  const run = await client.actor("moJRLRc85AitArpNN").call(input);
  console.log('Results from dataset');
  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  items.forEach((item) => {
    console.dir(item);
  });
} catch (error) {
  console.error('Error:', error);
}
