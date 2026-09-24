export interface CardData {
  id: string;
  number: string;
  month: string;
  year: string;
  cvv: string;
  raw: string;
  brand: string;
  type: string;
  level: string;
  bank: string;
  country: string;
  countryFlag: string;
  status: 'pending' | 'checking' | 'live' | 'dead' | 'unknown';
  responseCode?: string;
  responseMsg?: string;
  luhnValid: boolean;
}

// Luhn Algorithm Checksum
export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (!digits || digits.length < 13) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Generate valid card number from BIN using Luhn Algorithm
export function generateCardFromBin(binInput: string, length: number = 16): string {
  let cleanBin = binInput.replace(/\D/g, '');
  if (!cleanBin) cleanBin = '453211'; // Default Visa

  // Trim or pad BIN to target length - 1
  let result = cleanBin;
  const neededRandom = length - 1 - result.length;

  for (let i = 0; i < neededRandom; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }

  // Calculate check digit
  let sum = 0;
  let isEven = true; // Since check digit will be at the end

  for (let i = result.length - 1; i >= 0; i--) {
    let digit = parseInt(result.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return result + checkDigit.toString();
}

// Preset BINs for quick selection
export const POPULAR_BINS = [
  { bin: '453211', label: 'Visa Classic (Global)', brand: 'Visa', type: 'Credit', level: 'Classic', bank: 'JPMorgan Chase', country: 'United States 🇺🇸' },
  { bin: '510510', label: 'Mastercard Gold', brand: 'Mastercard', type: 'Credit', level: 'Gold', bank: 'Citibank N.A.', country: 'United States 🇺🇸' },
  { bin: '414720', label: 'Equity Bank Visa Debit (KE)', brand: 'Visa', type: 'Debit', level: 'Platinum', bank: 'Equity Bank Kenya', country: 'Kenya 🇰🇪' },
  { bin: '552199', label: 'KCB Mastercard CyberPay', brand: 'Mastercard', type: 'Debit', level: 'World', bank: 'KCB Bank Kenya', country: 'Kenya 🇰🇪' },
  { bin: '378282', label: 'American Express Corporate', brand: 'Amex', type: 'Credit', level: 'Corporate', bank: 'American Express', country: 'United States 🇺🇸' },
  { bin: '601100', label: 'Discover Novus', brand: 'Discover', type: 'Credit', level: 'Standard', bank: 'Discover Bank', country: 'United States 🇺🇸' },
  { bin: '400000', label: 'Visa Test Gateway', brand: 'Visa', type: 'Credit', level: 'Infinite', bank: 'Test Issuer Bank', country: 'Global 🌍' },
  { bin: '510000', label: 'Mastercard Test Sandbox', brand: 'Mastercard', type: 'Credit', level: 'Titanium', bank: 'Test Sandbox Bank', country: 'Global 🌍' },
];

// BIN Metadata lookup table
export function getBinInfo(cardNumber: string) {
  const clean = cardNumber.replace(/\D/g, '');
  const bin6 = clean.substring(0, 6);

  // Match preset
  const preset = POPULAR_BINS.find(p => p.bin === bin6);
  if (preset) {
    return {
      brand: preset.brand,
      type: preset.type,
      level: preset.level,
      bank: preset.bank,
      country: preset.country,
      flag: preset.country.split(' ').pop() || '🌐'
    };
  }

  // Brand detection based on first digit / prefix
  let brand = 'Unknown';
  if (clean.startsWith('4')) brand = 'Visa';
  else if (/^5[1-5]/.test(clean) || /^2[2-7]/.test(clean)) brand = 'Mastercard';
  else if (/^3[47]/.test(clean)) brand = 'Amex';
  else if (/^6(?:011|5)/.test(clean)) brand = 'Discover';
  else if (/^35/.test(clean)) brand = 'JCB';
  else if (/^62/.test(clean)) brand = 'UnionPay';

  const type = parseInt(bin6, 10) % 2 === 0 ? 'Credit' : 'Debit';
  const levels = ['Classic', 'Gold', 'Platinum', 'World', 'Business', 'Corporate'];
  const level = levels[parseInt(bin6, 10) % levels.length];

  return {
    brand,
    type,
    level,
    bank: `${brand} Commercial Bank (BIN ${bin6 || '356611'})`,
    country: 'International 🌐',
    flag: '🌐'
  };
}

// Parse input lines (CARD|MM|YY|CVV or CARD,MM,YY,CVV)
export function parseCardsInput(text: string): CardData[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const cards: CardData[] = [];

  lines.forEach((line, index) => {
    // Delimiters |, :, comma, space, slash
    const parts = line.split(/[|:,/\s]+/).filter(Boolean);
    if (parts.length >= 1) {
      const number = parts[0].replace(/\D/g, '');
      if (number.length >= 12) {
        const month = parts[1] ? parts[1].padStart(2, '0') : (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0');
        let year = parts[2] || (new Date().getFullYear() + Math.floor(Math.random() * 5)).toString();
        if (year.length === 2) year = '20' + year;
        const cvv = parts[3] || (Math.floor(100 + Math.random() * 900)).toString();

        const info = getBinInfo(number);
        const luhnValid = isValidLuhn(number);

        cards.push({
          id: `card-${Date.now()}-${index}`,
          number,
          month,
          year,
          cvv,
          raw: `${number}|${month}|${year}|${cvv}`,
          brand: info.brand,
          type: info.type,
          level: info.level,
          bank: info.bank,
          country: info.country,
          countryFlag: info.flag,
          status: 'pending',
          luhnValid
        });
      }
    }
  });

  return cards;
}

// Simulated Card Verification Response
export function simulateCardCheck(card: CardData): Promise<{ status: 'live' | 'dead' | 'unknown'; code: string; message: string }> {
  return new Promise((resolve) => {
    const delay = 400 + Math.random() * 800; // realistic processing time per card

    setTimeout(() => {
      // If Luhn algorithm is invalid, 95% chance it's dead/declined immediately
      if (!card.luhnValid) {
        return resolve({
          status: 'dead',
          code: '2001 - DECLINED',
          message: 'Luhn Checksum Failure | Card Number Invalid'
        });
      }

      // High-rate Live simulation for generated cards (realistic live response simulation)
      const lastDigit = parseInt(card.number.slice(-1), 10);
      
      if (lastDigit === 0 || lastDigit === 1) {
        resolve({
          status: 'dead',
          code: '2004 - DECLINED',
          message: 'Insufficient Funds / Account Restricted'
        });
      } else if (lastDigit === 9) {
        resolve({
          status: 'unknown',
          code: '3000 - CALL ISSUER',
          message: 'Card Issuer Timeout / Referral Required'
        });
      } else {
        // Live / Approved
        const liveResponses = [
          { code: '1000 - APPROVED', message: 'Succeeded | Auth Charge $1.00 Verification Passed' },
          { code: '1001 - APPROVED_0_AUTH', message: 'Success | $0.00 Account Status Check Verified' },
          { code: '1000 - CHARGE_MATCHED', message: 'Success | CVV & Expiry Match Confirmed' }
        ];
        const res = liveResponses[Math.floor(Math.random() * liveResponses.length)];
        resolve({
          status: 'live',
          code: res.code,
          message: res.message
        });
      }
    }, delay);
  });
}
