import puppeteer from "puppeteer";
import puppeteerExtra from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import RecaptchaPlugin from "puppeteer-extra-plugin-recaptcha";
import { SearchResult } from "./search.types";

export class SearchService {
  // Original method for manual CAPTCHA solving
  async googleSearchManual(
    query: string,
    numResults: number = 10
  ): Promise<SearchResult[]> {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.goto("https://www.google.com");
      await page.type("textarea#APjFqb", query);
      await page.keyboard.press("Enter");

      try {
        await page.waitForSelector("div.g", { timeout: 5000 });
      } catch {
        console.log("Please solve the CAPTCHA manually...");
        await page.waitForSelector("div.g", { timeout: 60000 });
      }

      const results = await page.evaluate((maxResults) => {
        const searchResults: SearchResult[] = [];
        const elements = document.querySelectorAll("div.g");

        elements.forEach((el, index) => {
          if (index >= maxResults) return;
          const titleEl = el.querySelector("h3");
          const linkEl = el.querySelector("a");
          const snippetEl = el.querySelector("div.VwiC3b");

          if (titleEl && linkEl && snippetEl) {
            searchResults.push({
              title: titleEl.textContent || "",
              link: linkEl.getAttribute("href") || "",
              description: snippetEl.textContent || "",
            });
          }
        });
        return searchResults;
      }, numResults);

      return results;
    } finally {
      await browser.close();
    }
  }

  // Method using 2captcha
  async googleSearchWithApi(
    query: string,
    apiKey: string,
    numResults: number = 10
  ): Promise<SearchResult[]> {
    puppeteerExtra.use(StealthPlugin());
    puppeteerExtra.use(
      RecaptchaPlugin({
        provider: {
          id: "2captcha",
          token: apiKey,
        },
      })
    );

    const browser = await puppeteerExtra.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      await page.goto("https://www.google.com");
      await page.type("textarea#APjFqb", query);
      await page.solveRecaptchas();
      await page.keyboard.press("Enter");
      await page.waitForSelector("div.g");

      const results = await page.evaluate((maxResults) => {
        const searchResults: SearchResult[] = [];
        const elements = document.querySelectorAll("div.g");

        elements.forEach((el, index) => {
          if (index >= maxResults) return;
          const titleEl = el.querySelector("h3");
          const linkEl = el.querySelector("a");
          const snippetEl = el.querySelector("div.VwiC3b");

          if (titleEl && linkEl && snippetEl) {
            searchResults.push({
              title: titleEl.textContent || "",
              link: linkEl.getAttribute("href") || "",
              description: snippetEl.textContent || "",
            });
          }
        });
        return searchResults;
      }, numResults);

      return results;
    } finally {
      await browser.close();
    }
  }

  async googleSearch(
    query: string,
    numResults: number = 10
  ): Promise<SearchResult[]> {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      await page.goto("https://www.google.com");

      await page.type("textarea#APjFqb", query);
      await page.keyboard.press("Enter");

      await page.waitForNavigation();

      const captchaIframeSelector = 'iframe[src*="recaptcha"]';
      const captchaFrameHandle = await page
        .$(captchaIframeSelector)
        .catch(() => null);

      if (captchaFrameHandle) {
        const frame = await captchaFrameHandle.contentFrame();
        if (frame) {
          await frame.waitForSelector("#recaptcha-anchor", { visible: true });
          await frame.click("#recaptcha-anchor");

          await page.waitForFunction(
            () => !document.querySelector('iframe[src*="recaptcha"]'),
            { timeout: 60000 }
          );
        }
      }

      await page.waitForSelector("div.g");

      const results = await page.evaluate((maxResults) => {
        const searchResults: SearchResult[] = [];
        const elements = document.querySelectorAll("div.g");

        elements.forEach((el, index) => {
          if (index >= maxResults) return;

          const titleEl = el.querySelector("h3");
          const linkEl = el.querySelector("a");
          const snippetEl = el.querySelector("div.VwiC3b");

          if (titleEl && linkEl && snippetEl) {
            searchResults.push({
              title: titleEl.textContent || "",
              link: linkEl.getAttribute("href") || "",
              description: snippetEl.textContent || "",
            });
          }
        });

        return searchResults;
      }, numResults);

      return results;
    } finally {
      await browser.close();
    }
  }
}
