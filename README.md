# silverback-x402-mcp

MCP server for **Silverback DeFi Intelligence** — 26 paid endpoints via x402 micropayments. No API keys, no subscriptions. Your AI agent pays per call in USDC on Base.

## Quick Start

```bash
PRIVATE_KEY=0xYourKey npx -y silverback-x402-mcp
```

The server registers 26 DeFi intelligence tools over stdio. Your agent can immediately query swap routes, yield opportunities, token audits, whale movements, and more.

## Requirements

- Node.js 20+
- Wallet private key with USDC on Base (+ small amount of ETH for gas)

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `PRIVATE_KEY` | Wallet private key (hex, 0x-prefixed) | **required** |
| `SILVERBACK_API_URL` | Silverback API endpoint | `https://x402.silverbackdefi.app` |

## Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "silverback": {
      "command": "npx",
      "args": ["-y", "silverback-x402-mcp"],
      "env": {
        "PRIVATE_KEY": "0xYourPrivateKeyHere"
      }
    }
  }
}
```

Restart Claude Desktop. You'll see Silverback tools in the tools menu.

## Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "silverback": {
      "command": "npx",
      "args": ["-y", "silverback-x402-mcp"],
      "env": {
        "PRIVATE_KEY": "0xYourPrivateKeyHere"
      }
    }
  }
}
```

## Claude Code

```bash
claude mcp add silverback -- npx -y silverback-x402-mcp
```

Set `PRIVATE_KEY` in your environment.

## Available Tools (26)

### Core DeFi Services

| Tool | Description | Price |
|------|-------------|-------|
| `swap_quote` | Optimal swap route with price impact on Base | $0.002 |
| `swap` | Non-custodial Permit2 swap with EIP-712 signing | $0.05 |
| `pool_analysis` | Liquidity pool analysis (TVL, volume, IL risk) | $0.005 |
| `technical_analysis` | RSI, MACD, Bollinger Bands, support/resistance | $0.02 |
| `defi_yield` | Yield opportunities on Aerodrome, Morpho, etc. | $0.02 |
| `backtest` | Strategy backtesting with historical data | $0.10 |

### Market Data

| Tool | Description | Price |
|------|-------------|-------|
| `top_pools` | Top liquidity pools by TVL and volume | $0.001 |
| `top_protocols` | Top DeFi protocols on Base | $0.001 |
| `top_coins` | Top cryptocurrencies by market cap | $0.001 |
| `gas_price` | Current Base chain gas prices | $0.001 |
| `dex_metrics` | Base DEX volume, TVL, top pairs | $0.002 |
| `trending_tokens` | Trending tokens by chain | $0.001 |
| `token_metadata` | Token price, market cap, description | $0.001 |
| `correlation_matrix` | Token correlation for diversification | $0.005 |
| `arbitrage_scanner` | Cross-DEX arbitrage opportunities | $0.02 |

### Intelligence

| Tool | Description | Price |
|------|-------------|-------|
| `token_audit` | Security audit: contract, holders, rug risk | $0.01 |
| `whale_moves` | Whale transfers and accumulation patterns | $0.01 |
| `agent_reputation` | ERC-8004 agent reputation scores | $0.001 |
| `agent_discover` | Discover registered agents by capability | $0.002 |

### Chat

| Tool | Description | Price |
|------|-------------|-------|
| `chat` | AI DeFi assistant — ask anything about crypto | $0.05 |

### Keeta Blockchain

| Tool | Description | Price |
|------|-------------|-------|
| `keeta_network_stats` | Network stats (block height, TPS) | $0.001 |
| `keeta_account` | Account info and balance | $0.001 |
| `keeta_representatives` | Network representatives | $0.001 |
| `keeta_dex_pools` | DEX liquidity pools | $0.001 |
| `keeta_dex_prices` | DEX token prices | $0.001 |
| `keeta_dex_quote` | DEX swap quote | $0.001 |

## How It Works

```
AI Agent (Claude, Cursor, etc.)
  |  stdio JSON-RPC
  v
silverback-x402-mcp (local, has your wallet)
  |  1. Tool call from agent
  |  2. HTTP request to Silverback API
  |  3. Server returns 402 Payment Required
  |  4. MCP server auto-signs USDC payment
  |  5. Retries with payment proof
  |  6. Returns data to agent
  v
Silverback API (x402.silverbackdefi.app)
```

Payment is invisible to the agent. It calls a tool, the MCP server handles x402 payment, and returns the data.

## Payment Networks

Silverback accepts USDC on:
- **Base** (primary) — via CDP facilitator
- **Solana** — via PayAI facilitator
- **SKALE Base** — zero gas fees
- **Keeta** — zero gas fees

This MCP server pays via Base USDC by default.

## Links

- **API**: https://x402.silverbackdefi.app
- **Website**: https://silverbackdefi.app
- **ERC-8004 Agent**: https://8004agents.ai/ethereum/agent/13026
- **X**: https://x.com/silverbackdefi

## License

MIT
