/**
 * Currency formatting utilities for Tanzanian Shillings
 */

/**
 * Format a number as Tanzanian Shillings
 * @param amount - The amount to format
 * @returns Formatted currency string with TSh symbol
 */
export function formatCurrency(amount: number | string): string {
  // Convert string to number if needed
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Handle invalid numbers
  if (isNaN(numAmount)) {
    return 'TSh0';
  }
  
  // Format with commas as thousand separators
  return `TSh${numAmount.toLocaleString('en-TZ')}`;
}

/**
 * Parse a currency string back to a number
 * @param currencyString - The currency string to parse (e.g., "TSh1,234")
 * @returns The numeric value
 */
export function parseCurrency(currencyString: string): number {
  // Remove TSh prefix and commas
  const cleaned = currencyString.replace('TSh', '').replace(/,/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Format a large number with appropriate scale (K for thousands, M for millions)
 * @param amount - The amount to format
 * @returns Formatted currency string with scale indicator
 */
export function formatCurrencyWithScale(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return 'TSh0';
  }
  
  if (numAmount >= 1000000) {
    return `TSh${(numAmount / 1000000).toFixed(1)}M`;
  }
  
  if (numAmount >= 1000) {
    return `TSh${(numAmount / 1000).toFixed(1)}K`;
  }
  
  return `TSh${numAmount.toLocaleString('en-TZ')}`;
}

export default {
  formatCurrency,
  parseCurrency,
  formatCurrencyWithScale
};