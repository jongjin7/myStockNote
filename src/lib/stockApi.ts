export async function fetchStockPrice(symbol: string): Promise<number | null> {
  try {
    const trimmedSymbol = symbol.trim();
    let yahooSymbol = trimmedSymbol;
    
    // Check if it's a 6-digit Korean stock code
    if (/^\d{6}$/.test(trimmedSymbol)) {
      yahooSymbol = `${trimmedSymbol}.KS`; 
    }

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1m&range=1d`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();
    const result = JSON.parse(data.contents);
    
    let meta = result.chart?.result?.[0]?.meta;

    // If .KS fails for Korean stocks, try .KQ (KOSDAQ)
    if (!meta?.regularMarketPrice && yahooSymbol.endsWith('.KS')) {
      const kqSymbol = yahooSymbol.replace('.KS', '.KQ');
      const kqUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${kqSymbol}?interval=1m&range=1d`;
      const kqProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(kqUrl)}`;
      
      const kqRes = await fetch(kqProxyUrl);
      const kqData = await kqRes.json();
      const kqResult = JSON.parse(kqData.contents);
      meta = kqResult.chart?.result?.[0]?.meta;
    }

    if (!meta?.regularMarketPrice) {
      return null;
    }

    return Math.round(meta.regularMarketPrice);
  } catch (error) {
    console.error('Failed to fetch stock price:', error);
    return null;
  }
}
