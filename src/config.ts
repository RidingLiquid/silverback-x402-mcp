import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(import.meta.dirname, '../.env') });

export const config = {
  apiUrl: process.env.SILVERBACK_API_URL || 'https://x402.silverbackdefi.app',
  privateKey: process.env.PRIVATE_KEY || '',
};

export function log(message: string): void {
  process.stderr.write(`[silverback-mcp] ${message}\n`);
}

export function validateConfig(): void {
  if (!config.privateKey) {
    log('ERROR: PRIVATE_KEY environment variable is required');
    log('Your wallet needs USDC on Base to pay for API calls.');
    log('');
    log('Usage: PRIVATE_KEY=0xYourKey npx silverback-x402-mcp');
    process.exit(1);
  }
  if (!config.privateKey.startsWith('0x')) {
    log('ERROR: PRIVATE_KEY must start with 0x');
    process.exit(1);
  }
}
