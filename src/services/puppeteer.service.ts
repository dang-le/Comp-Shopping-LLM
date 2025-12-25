import puppeteer, { Browser, Page } from 'puppeteer';

class PuppeteerService {
  private browser: Browser | null = null;

  async initBrowser(): Promise<void> {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-blink-features=AutomationControlled',
        ],
      });
    }
  }

  async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private async setUserAgent(page: Page): Promise<void> {
    // Set realistic User-Agent to avoid "Access Denied"
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    await page.setUserAgent(userAgent);
    await page.setViewport({ width: 1920, height: 1080 });
    // Set additional headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    });
  }

  async fetchPageContent(url: string): Promise<string> {
    await this.initBrowser();

    if (!this.browser) {
      throw new Error('Browser failed to initialize');
    }

    let page: Page | null = null;
    try {
      page = await this.browser.newPage();
      await this.setUserAgent(page);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      // Get page content
      const content = await page.content();
      
      // Extract text content for analysis (use globalThis to avoid TypeScript DOM lib issues)
      const textContent = await page.evaluate(() => {
        return (globalThis as any).document?.body?.innerText || '';
      });

      return textContent || content;
    } catch (error) {
      throw new Error(`Puppeteer fetch error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async takeScreenshot(url: string, outputPath: string): Promise<void> {
    await this.initBrowser();

    if (!this.browser) {
      throw new Error('Browser failed to initialize');
    }

    let page: Page | null = null;
    try {
      page = await this.browser.newPage();
      await this.setUserAgent(page);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.screenshot({ path: outputPath, fullPage: true });
    } catch (error) {
      throw new Error(`Screenshot error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async extractData(url: string, selector: string): Promise<any[]> {
    await this.initBrowser();

    if (!this.browser) {
      throw new Error('Browser failed to initialize');
    }

    let page: Page | null = null;
    try {
      page = await this.browser.newPage();
      await this.setUserAgent(page);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      const data = await page.evaluate((sel: string) => {
        const elements = (globalThis as any).document.querySelectorAll(sel);
        return Array.from(elements).map((el: any) => ({
          text: el.textContent,
          html: el.innerHTML,
        }));
      }, selector);

      return data;
    } catch (error) {
      throw new Error(`Data extraction error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async executePromptActions(url: string, prompt: string): Promise<{ name: string; price: string; options: any[]; content: string }> {
    await this.initBrowser();

    if (!this.browser) {
      throw new Error('Browser failed to initialize');
    }

    let page: Page | null = null;
    try {
      page = await this.browser.newPage();
      await this.setUserAgent(page);
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

      console.log(`\n=== Executing prompt-based actions ===`);
      console.log(`Prompt: ${prompt}\n`);

      // Extract product name first
      let name = '';
      const nameSelectors = ['h1', '.product-name', '.product-title', '[itemprop="name"]'];
      for (const sel of nameSelectors) {
        const result = await page.evaluate((selector: string) => {
          const el = (globalThis as any).document.querySelector(selector);
          return el?.textContent?.trim() || '';
        }, sel);
        if (result && result.length > 3) {
          name = result.substring(0, 200);
          break;
        }
      }

      // Parse prompt to extract action keywords
      const lowerPrompt = prompt.toLowerCase();
      const actions: string[] = [];

      if (lowerPrompt.includes('select') || lowerPrompt.includes('option') || lowerPrompt.includes('click')) {
        actions.push('click_select_options');
      }
      if (lowerPrompt.includes('fill') || lowerPrompt.includes('enter') || lowerPrompt.includes('type')) {
        actions.push('fill_forms');
      }
      if (lowerPrompt.includes('scroll')) {
        actions.push('scroll');
      }
      if (lowerPrompt.includes('dropdown') || lowerPrompt.includes('select')) {
        actions.push('interact_dropdowns');
      }

      // Default: try to click any button that might reveal options/price
      if (actions.length === 0) {
        actions.push('click_select_options');
      }

      // Execute actions
      for (const action of actions) {
        await this.executeAction(page, action, prompt);
      }

      // Extract product options/variants
      const options = await this.extractOptions(page);

      // Extract price after all actions
      const price = await this.extractPrice(page);

      // Get final page content
      const content = await page.evaluate(() => {
        return (globalThis as any).document?.body?.innerText || '';
      });

      return {
        name: name || 'Product name not found',
        price,
        options,
        content,
      };
    } catch (error) {
      throw new Error(`Prompt execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  private async executeAction(page: Page, action: string, prompt: string): Promise<void> {
    console.log(`Executing action: ${action}`);

    switch (action) {
      case 'click_select_options':
        await this.clickSelectOptionsButton(page);
        break;
      case 'fill_forms':
        await this.fillForms(page, prompt);
        break;
      case 'scroll':
        await this.scrollPage(page, prompt);
        break;
      case 'interact_dropdowns':
        await this.interactWithDropdowns(page);
        break;
    }

    // Wait for any dynamic content to load
    await page.waitForTimeout(1500);
  }

  private async clickSelectOptionsButton(page: Page): Promise<void> {
    console.log('Looking for "Select options" button or similar...');

    // Strategy 1: XPath to find any button/link with "select" and "option" text
    try {
      const xpath = "//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'select') and contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'option')]";
      const elements = await page.$x(xpath);
      if (elements.length > 0) {
        console.log(`Found "Select options" via XPath, clicking...`);
        await elements[0].click();
        return;
      }
    } catch (e) {
      console.log('XPath search failed');
    }

    // Strategy 2: Find buttons with "select" text
    try {
      const xpath = "//*[button or a][contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'select')]";
      const elements = await page.$x(xpath);
      if (elements.length > 0) {
        console.log(`Found button with "select" text, clicking...`);
        await elements[0].click();
        return;
      }
    } catch (e) {
      // Continue
    }

    // Strategy 3: Click any visible button that's not hidden
    try {
      const buttons = await page.$$('button, a[role="button"]');
      for (const btn of buttons) {
        const text = await page.evaluate((el: any) => el.textContent, btn);
        if (text && (text.toLowerCase().includes('select') || text.toLowerCase().includes('option') || text.toLowerCase().includes('choose'))) {
          console.log(`Found button with text: "${text}", clicking...`);
          await btn.click();
          return;
        }
      }
    } catch (e) {
      console.log('Could not find clickable button');
    }
  }

  private async fillForms(page: Page, prompt: string): Promise<void> {
    console.log('Attempting to fill forms based on prompt...');

    const inputs = await page.$$('input[type="text"], input:not([type]), textarea, select');
    if (inputs.length === 0) {
      console.log('No input fields found');
      return;
    }

    for (let i = 0; i < inputs.length && i < 3; i++) {
      try {
        const inputType = await page.evaluate((el: any) => el.type || el.tagName, inputs[i]);
        const placeholder = await page.evaluate((el: any) => el.placeholder || el.name || '', inputs[i]);

        if (inputType === 'select') {
          // Select first non-empty option
          await page.evaluate((el: any) => {
            const options = el.querySelectorAll('option');
            if (options.length > 1) {
              el.value = options[1].value;
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }, inputs[i]);
          console.log(`Selected option in dropdown`);
        } else {
          // Type first word from prompt or generic text
          const textToType = prompt.split(' ').slice(0, 2).join(' ') || 'Test';
          await inputs[i].type(textToType);
          console.log(`Typed "${textToType}" in input field`);
        }
      } catch (e) {
        console.log(`Could not fill input ${i}:`, e);
      }
    }
  }

  private async interactWithDropdowns(page: Page): Promise<void> {
    console.log('Interacting with dropdown elements...');

    const selects = await page.$$('select');
    for (let i = 0; i < selects.length && i < 2; i++) {
      try {
        // Get first non-empty option
        const firstOption = await page.evaluate((el: any) => {
          const options = el.querySelectorAll('option');
          return options.length > 1 ? options[1].value : null;
        }, selects[i]);

        if (firstOption) {
          await page.evaluate(
            (el: any, val: string) => {
              el.value = val;
              el.dispatchEvent(new Event('change', { bubbles: true }));
            },
            selects[i],
            firstOption
          );
          console.log(`Selected first option in dropdown ${i}`);
        }
      } catch (e) {
        console.log(`Could not interact with dropdown ${i}`);
      }
    }
  }

  private async scrollPage(page: Page, prompt: string): Promise<void> {
    console.log('Scrolling page...');

    const scrollAmount = prompt.toLowerCase().includes('up') ? -500 : 500;
    const times = prompt.toLowerCase().includes('much') || prompt.toLowerCase().includes('all') ? 5 : 1;

    for (let i = 0; i < times; i++) {
      await page.evaluate((amount: number) => {
        (globalThis as any).window?.scrollBy(0, amount);
      }, scrollAmount);
      await page.waitForTimeout(300);
    }
    console.log(`Scrolled page`);
  }

  private async extractOptions(page: Page): Promise<any[]> {
    const options: any[] = [];

    // Extract from visible buttons/links that look like options
    try {
      const optionElements = await page.$$('[data-option], .option, .variant, .size, .color, button[class*="option"]');
      for (const el of optionElements) {
        const text = await page.evaluate((e: any) => e.textContent?.trim() || '', el);
        const value = await page.evaluate((e: any) => e.value || e.getAttribute('data-value') || '', el);
        if (text) {
          options.push({ text: text.substring(0, 100), value });
        }
      }
    } catch (e) {
      // Continue
    }

    // Extract from select dropdowns
    try {
      const selects = await page.$$('select');
      for (const select of selects) {
        const optionsData = await page.evaluate((el: any) => {
          return Array.from(el.querySelectorAll('option')).map((opt: any) => ({
            text: opt.textContent?.trim(),
            value: opt.value,
          }));
        }, select);
        options.push(...optionsData);
      }
    } catch (e) {
      // Continue
    }

    return options.slice(0, 10); // Return first 10 options
  }

  private async extractPrice(page: Page): Promise<string> {
    let price = '';

    const priceSelectors = [
      '.price',
      '.product-price',
      '[data-price]',
      '.amount',
      'span.price',
      '[itemprop="price"]',
      '.current-price',
      '.final-price',
      '.price-value',
    ];

    for (const sel of priceSelectors) {
      try {
        const result = await page.evaluate((selector: string) => {
          const el = (globalThis as any).document.querySelector(selector);
          if (!el) return '';
          const dataPrice = el.getAttribute?.('data-price');
          if (dataPrice) return dataPrice;
          return el?.textContent?.trim() || '';
        }, sel);
        if (result && /[\d,.$]/.test(result)) {
          price = result.substring(0, 100);
          console.log(`Found price: ${price}`);
          return price;
        }
      } catch (e) {
        // Continue
      }
    }

    // Fallback: search in text
    if (!price) {
      const allText = await page.evaluate(() => {
        return (globalThis as any).document?.body?.innerText || '';
      });
      const priceMatch = allText.match(/\$[\d,]+\.?\d*|\d{1,3}(?:,\d{3})*(?:\.\d{2})?/);
      if (priceMatch) {
        price = priceMatch[0];
        console.log(`Found price in text: ${price}`);
      }
    }

    return price || 'Price not found';
  }
}

export default new PuppeteerService();
