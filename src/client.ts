import { x402Client, wrapFetchWithPayment } from '@x402/fetch';
import { registerExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';
import { log } from './config.js';

export class SilverbackClient {
  public readonly apiUrl: string;
  public readonly fetchWithPayment: typeof fetch;
  public readonly account: PrivateKeyAccount;

  constructor(apiUrl: string, privateKey: `0x${string}`) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.account = privateKeyToAccount(privateKey);

    const client = new x402Client();
    registerExactEvmScheme(client, { signer: this.account });
    this.fetchWithPayment = wrapFetchWithPayment(fetch, client);

    log(`Wallet: ${this.account.address}`);
    log(`API: ${this.apiUrl}`);
  }

  async callEndpoint(
    path: string,
    method: string,
    params?: Record<string, unknown>,
  ): Promise<unknown> {
    let url = `${this.apiUrl}${path}`;

    // For GET requests, params go as query string
    if (method === 'GET' && params && Object.keys(params).length > 0) {
      const qs = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          qs.set(key, String(value));
        }
      }
      url = `${url}?${qs.toString()}`;
    }

    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    // For POST requests, params go as body
    if (method === 'POST' && params) {
      options.body = JSON.stringify(params);
    }

    const response = await this.fetchWithPayment(url, options);
    const data = await response.json();

    if (!response.ok) {
      const errorMsg =
        typeof data === 'object' && data !== null && 'error' in data
          ? (data as { error: string }).error
          : JSON.stringify(data);
      throw new Error(`API error ${response.status}: ${errorMsg}`);
    }

    return data;
  }
}
