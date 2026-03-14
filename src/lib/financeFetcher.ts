import yahooFinance from 'yahoo-finance2';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface FinanceData {
  cmp: number | null;
  peRatio: string;
  latestEarnings: string;
}

export async function fetchStockData(symbol: string, exchange: string): Promise<FinanceData> {
  let cmp: number | null = null;
  let peRatio = 'N/A';
  let latestEarnings = 'N/A';

  try {
    // 1. Fetch CMP from Yahoo Finance
    const quote = await yahooFinance.quote(symbol);
    cmp = quote.regularMarketPrice || null;
  } catch (error) {
    console.error(`Yahoo Finance error for ${symbol}:`, error);
  }

  try {
    // 2. Fetch P/E and Earnings from Google Finance
    // Format: RELIANCE:NSE
    const ticker = symbol.split('.')[0];
    const googleUrl = `https://www.google.com/finance/quote/${ticker}:${exchange}`;
    
    const { data } = await axios.get(googleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 5000
    });

    const $ = cheerio.load(data);
    
    // Scrape data from the stats section
    // Google Finance uses specific classes for keys and values
    // We'll search for text content
    $('.P66Pgc').each((_i, el) => {
      const val = $(el).text().trim();
      const label = $(el).parent().find('.mfs7Fc').text().trim() || $(el).prev().text().trim();
      
      if (label.toLowerCase().includes('p/e ratio')) {
        peRatio = val;
      }
      if (label.toLowerCase().includes('earnings per share') || label.toLowerCase().includes('eps')) {
        latestEarnings = val;
      }
    });

  } catch (error) {
    console.error(`Google Finance scraping error for ${symbol}:`, error);
  }

  return { cmp, peRatio, latestEarnings };
}
