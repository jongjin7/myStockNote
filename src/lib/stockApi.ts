export async function fetchStockPrice(symbol: string): Promise<number | null> {
  try {
    const trimmedSymbol = symbol.trim().toUpperCase();
    
    // If user provided a specific suffix, respect it
    if (trimmedSymbol.includes('.') || !/^\d{6}$/.test(trimmedSymbol)) {
      const result = await fetchSingleSymbolPrice(trimmedSymbol);
      return result ? result.price : null;
    }

    // For 6-digit Korean stocks, try both .KS and .KQ and pick the more recent one
    const results = await Promise.all([
      fetchSingleSymbolPrice(`${trimmedSymbol}.KS`),
      fetchSingleSymbolPrice(`${trimmedSymbol}.KQ`)
    ]);

    const validResults = results
      .filter((r): r is { price: number; time: number } => r !== null)
      .sort((a, b) => b.time - a.time); // Sort by most recent

    if (validResults.length === 0) return null;
    
    // Return the price from the most recently updated symbol
    return validResults[0].price;

  } catch (error) {
    console.error('Failed to fetch stock price:', error);
    return null;
  }
}

async function fetchSingleSymbolPrice(symbol: string): Promise<{ price: number; time: number } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}&_=${Date.now()}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();
    const result = JSON.parse(data.contents);
    
    const meta = result.chart?.result?.[0]?.meta;

    if (!meta || typeof meta.regularMarketPrice !== 'number') {
      return null;
    }

    return {
      price: Math.round(meta.regularMarketPrice),
      time: meta.regularMarketTime || 0
    };
  } catch (e) {
    return null;
  }
}
