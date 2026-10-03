export interface ParsedVoiceQuery {
  rawQuery: string;
  categorySlug?: string;
  color?: string;
  maxPrice?: number;
  occasion?: string;
  gender?: string;
  textSearch: string;
}

export function parseVoiceQuery(query: string): ParsedVoiceQuery {
  const normalized = query.toLowerCase().trim();
  const result: ParsedVoiceQuery = {
    rawQuery: query,
    textSearch: normalized,
  };

  // 1. Detect Category / Item type
  if (normalized.includes('saree') || normalized.includes('साड़ी') || normalized.includes('sadi')) {
    result.categorySlug = 'sarees';
  } else if (normalized.includes('kurta') || normalized.includes('कुर्ता') || normalized.includes('shirt') || normalized.includes('men')) {
    result.categorySlug = 'men';
    result.gender = 'men';
  } else if (normalized.includes('suit') || normalized.includes('सूट') || normalized.includes('kurti') || normalized.includes('कुर्ती') || normalized.includes('lehenga') || normalized.includes('लहंगा') || normalized.includes('women')) {
    result.categorySlug = 'women';
    result.gender = 'women';
  } else if (normalized.includes('kids') || normalized.includes('बच्चे') || normalized.includes('frock') || normalized.includes('लड़का') || normalized.includes('लड़की')) {
    result.categorySlug = 'kids';
  } else if (normalized.includes('baby') || normalized.includes('शिशु') || normalized.includes('jhabla') || normalized.includes('झबला') || normalized.includes('newborn')) {
    result.categorySlug = 'baby';
    result.gender = 'baby';
  }

  // 2. Detect Color
  if (normalized.includes('red') || normalized.includes('लाल') || normalized.includes('crimson')) {
    result.color = 'Red';
  } else if (normalized.includes('black') || normalized.includes('काला') || normalized.includes('काली')) {
    result.color = 'Black';
  } else if (normalized.includes('green') || normalized.includes('हरा') || normalized.includes('हरी')) {
    result.color = 'Green';
  } else if (normalized.includes('yellow') || normalized.includes('पीला') || normalized.includes('पीली') || normalized.includes('haldi')) {
    result.color = 'Yellow';
  } else if (normalized.includes('blue') || normalized.includes('नीला') || normalized.includes('नीली')) {
    result.color = 'Blue';
  } else if (normalized.includes('pink') || normalized.includes('गुलाबी')) {
    result.color = 'Pink';
  } else if (normalized.includes('white') || normalized.includes('सफेद')) {
    result.color = 'White';
  } else if (normalized.includes('maroon') || normalized.includes('मैरून')) {
    result.color = 'Maroon';
  }

  // 3. Detect Price / Budget
  // Handle Hindi number words: "दो हजार" -> 2000, "पांच सौ" -> 500, "एक हजार" -> 1000
  if (normalized.includes('दो हजार') || normalized.includes('2000') || normalized.includes('2 हजार')) {
    result.maxPrice = 2000;
  } else if (normalized.includes('एक हजार') || normalized.includes('1000') || normalized.includes('1 हजार')) {
    result.maxPrice = 1000;
  } else if (normalized.includes('पांच सौ') || normalized.includes('500')) {
    result.maxPrice = 500;
  } else if (normalized.includes('पांच हजार') || normalized.includes('5000') || normalized.includes('5 हजार')) {
    result.maxPrice = 5000;
  } else if (normalized.includes('तीन हजार') || normalized.includes('3000')) {
    result.maxPrice = 3000;
  } else {
    // Regex for numeric "under 1500", "below 2000", "< 2500"
    const match = normalized.match(/(?:under|below|less than|अंदर|तक)\s*₹?\s*(\d+)/i) ||
                  normalized.match(/(\d+)\s*(?:के अंदर|तक|रुपये)/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num)) {
        result.maxPrice = num;
      }
    }
  }

  // 4. Detect Occasion
  if (normalized.includes('shaadi') || normalized.includes('शादी') || normalized.includes('wedding') || normalized.includes('विवाह')) {
    result.occasion = 'Wedding';
  } else if (normalized.includes('tyohar') || normalized.includes('त्योहार') || normalized.includes('festival') || normalized.includes('puja') || normalized.includes('पूजा')) {
    result.occasion = 'Festival';
  } else if (normalized.includes('party') || normalized.includes('पार्टी') || normalized.includes('reception')) {
    result.occasion = 'Party';
  } else if (normalized.includes('daily') || normalized.includes('रोज़') || normalized.includes('simple') || normalized.includes('साधारण')) {
    result.occasion = 'Daily Wear';
  }

  return result;
}
