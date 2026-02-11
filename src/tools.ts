import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { SilverbackClient } from './client.js';
import { log } from './config.js';

/**
 * Endpoint definition used to register MCP tools.
 * Pricing synced with server.ts paidEndpointPrices (Feb 2026).
 */
interface ToolDef {
  name: string;
  description: string;
  path: string;
  method: 'GET' | 'POST';
  price: string;
  schema: Record<string, z.ZodTypeAny>;
}

// ============================================================================
// Tool Definitions — 19 x402 endpoints
// ============================================================================

const TOOLS: ToolDef[] = [
  // ── Core DeFi Services ────────────────────────────────────────────────
  {
    name: 'swap_quote',
    description: 'Get optimal swap route with price impact analysis on Base chain',
    path: '/api/v1/swap-quote',
    method: 'POST',
    price: '$0.002',
    schema: {
      tokenIn: z.string().describe('Input token address or symbol (e.g. "USDC", "0x833589...")'),
      tokenOut: z.string().describe('Output token address or symbol (e.g. "ETH", "WETH")'),
      amountIn: z.string().describe('Amount to swap in token units (e.g. "100" for 100 USDC)'),
    },
  },
  {
    name: 'swap',
    description: 'Execute non-custodial Permit2 swap with EIP-712 signing data',
    path: '/api/v1/swap',
    method: 'POST',
    price: '$0.05',
    schema: {
      tokenIn: z.string().describe('Input token address or symbol'),
      tokenOut: z.string().describe('Output token address or symbol'),
      amountIn: z.string().describe('Amount to swap in token units'),
      slippage: z.number().optional().describe('Max slippage percentage (default 0.5)'),
      recipient: z.string().optional().describe('Recipient address (default: sender)'),
    },
  },
  {
    name: 'pool_analysis',
    description: 'Deep liquidity pool analysis with TVL, volume, fees, and impermanent loss risk',
    path: '/api/v1/pool-analysis',
    method: 'POST',
    price: '$0.005',
    schema: {
      pool: z.string().optional().describe('Pool address to analyze'),
      token: z.string().optional().describe('Token to find pools for'),
    },
  },
  {
    name: 'technical_analysis',
    description: 'Technical analysis with RSI, MACD, Bollinger Bands, support/resistance levels',
    path: '/api/v1/technical-analysis',
    method: 'POST',
    price: '$0.02',
    schema: {
      token: z.string().describe('Token symbol or address to analyze'),
      timeframe: z.string().optional().describe('Timeframe: 1h, 4h, 1d (default: 4h)'),
    },
  },
  {
    name: 'defi_yield',
    description: 'DeFi yield opportunities across Aerodrome, Morpho, and other Base protocols',
    path: '/api/v1/defi-yield',
    method: 'POST',
    price: '$0.02',
    schema: {
      token: z.string().optional().describe('Token to find yield for (optional — omit for top yields)'),
      riskTolerance: z.enum(['low', 'medium', 'high']).optional().describe('Risk tolerance level'),
      amount: z.string().optional().describe('Amount to invest (for APY calculations)'),
    },
  },
  {
    name: 'backtest',
    description: 'Strategy backtesting with historical data and performance metrics',
    path: '/api/v1/backtest',
    method: 'POST',
    price: '$0.10',
    schema: {
      token: z.string().describe('Token to backtest'),
      strategy: z.string().optional().describe('Strategy type: momentum, mean-reversion, breakout'),
      days: z.number().optional().describe('Number of days to backtest (default: 30)'),
    },
  },

  // ── Market Data ───────────────────────────────────────────────────────
  {
    name: 'top_pools',
    description: 'Top liquidity pools on Base by TVL and volume',
    path: '/api/v1/top-pools',
    method: 'GET',
    price: '$0.001',
    schema: {
      limit: z.number().optional().describe('Number of pools (default 10)'),
    },
  },
  {
    name: 'top_protocols',
    description: 'Top DeFi protocols on Base by TVL',
    path: '/api/v1/top-protocols',
    method: 'GET',
    price: '$0.001',
    schema: {
      limit: z.number().optional().describe('Number of protocols (default 10)'),
    },
  },
  {
    name: 'top_coins',
    description: 'Top cryptocurrencies by market cap with price and 24h change',
    path: '/api/v1/top-coins',
    method: 'GET',
    price: '$0.001',
    schema: {
      limit: z.number().optional().describe('Number of coins (default 20)'),
    },
  },
  {
    name: 'gas_price',
    description: 'Current Base chain gas prices in gwei',
    path: '/api/v1/gas-price',
    method: 'GET',
    price: '$0.001',
    schema: {},
  },
  {
    name: 'trending_tokens',
    description: 'Trending tokens by chain from CoinGecko',
    path: '/api/v1/trending-tokens',
    method: 'GET',
    price: '$0.001',
    schema: {
      chain: z.string().optional().describe('Chain filter (default: base)'),
    },
  },
  {
    name: 'token_metadata',
    description: 'Token metadata including price, market cap, description, and links',
    path: '/api/v1/token-metadata',
    method: 'GET',
    price: '$0.001',
    schema: {
      token: z.string().describe('Token symbol or CoinGecko ID'),
    },
  },
  {
    name: 'correlation_matrix',
    description: 'Price correlation matrix between tokens for portfolio diversification',
    path: '/api/v1/correlation-matrix',
    method: 'GET',
    price: '$0.005',
    schema: {
      tokens: z.string().optional().describe('Comma-separated token symbols (default: top tokens)'),
    },
  },
  {
    name: 'arbitrage_scanner',
    description: 'Cross-DEX arbitrage opportunity scanner on Base',
    path: '/api/v1/arbitrage-scanner',
    method: 'GET',
    price: '$0.02',
    schema: {
      minProfit: z.number().optional().describe('Minimum profit threshold in USD'),
    },
  },

  // ── Intelligence Services ─────────────────────────────────────────────
  {
    name: 'token_audit',
    description: 'Token security audit — contract analysis, holder distribution, liquidity locks, rug risk',
    path: '/api/v1/token-audit',
    method: 'POST',
    price: '$0.01',
    schema: {
      token: z.string().describe('Token address or symbol to audit'),
    },
  },
  {
    name: 'whale_moves',
    description: 'Whale transaction tracker — large transfers, accumulation/distribution patterns',
    path: '/api/v1/whale-moves',
    method: 'POST',
    price: '$0.01',
    schema: {
      token: z.string().describe('Token to track whale activity for'),
    },
  },
  {
    name: 'agent_reputation',
    description: 'Query ERC-8004 agent reputation scores and on-chain feedback',
    path: '/api/v1/agent-reputation',
    method: 'POST',
    price: '$0.001',
    schema: {
      agentId: z.string().describe('Agent ID or address to query'),
      chainId: z.number().optional().describe('Chain ID (default: 8453 for Base)'),
    },
  },
  {
    name: 'agent_discover',
    description: 'Discover ERC-8004 registered agents by capability tags',
    path: '/api/v1/agent-discover',
    method: 'POST',
    price: '$0.002',
    schema: {
      tags: z.string().optional().describe('Comma-separated capability tags to search'),
      chainId: z.number().optional().describe('Chain ID (default: 8453 for Base)'),
    },
  },

  // ── Chat ──────────────────────────────────────────────────────────────
  {
    name: 'chat',
    description: 'AI-powered DeFi assistant — ask anything about crypto, DeFi, tokens, or markets',
    path: '/api/v1/chat',
    method: 'POST',
    price: '$0.05',
    schema: {
      message: z.string().describe('Your question or request'),
    },
  },

  // Keeta data endpoints removed (Feb 2026) — SDK unstable
  // Keeta USDC payment network still active
];

// ============================================================================
// Tool Registration
// ============================================================================

export async function registerAllTools(
  server: McpServer,
  client: SilverbackClient,
): Promise<void> {
  for (const tool of TOOLS) {
    const description = `${tool.description} (${tool.price} USDC per call)`;

    server.tool(tool.name, description, tool.schema, async (params) => {
      try {
        const result = await client.callEndpoint(tool.path, tool.method, params as Record<string, unknown>);
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text' as const,
              text: `Error calling ${tool.name}: ${message}`,
            },
          ],
          isError: true,
        };
      }
    });

    log(`  ${tool.name} (${tool.method} ${tool.path}) ${tool.price}`);
  }

  log(`Registered ${TOOLS.length} tools`);
}
