const puppeteer = require('puppeteer');

/**
 * Scrapes a URL using Puppeteer for better JS support and takes a screenshot
 * @param {string} url 
 * @returns {Promise<{text: string, screenshot: string}>} base64 screenshot and full text
 */
const scrapeWithPuppeteer = async (url) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Emulate a standard desktop browser
        await page.setViewport({ width: 1280, height: 800 });

        console.log(`Navigating to ${url}...`);
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Capture screenshot
        const screenshot = await page.screenshot({
            encoding: 'base64',
            fullPage: false // Capturing just the fold is usually enough for review
        });

        // Extract clean text
        const text = await page.evaluate(() => {
            // Remove junk
            const cleaners = ['script', 'style', 'nav', 'footer', 'header', 'noscript', 'iframe'];
            cleaners.forEach(tag => {
                const elements = document.getElementsByTagName(tag);
                while (elements.length > 0) elements[0].parentNode.removeChild(elements[0]);
            });
            return document.body.innerText;
        });

        return {
            text: text.replace(/\s+/g, ' ').trim(),
            screenshot: `data:image/png;base64,${screenshot}`
        };
    } catch (err) {
        console.error('Puppeteer scrape error:', err.message);
        throw err;
    } finally {
        if (browser) await browser.close();
    }
};

module.exports = { scrapeWithPuppeteer };
