#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { config, log, validateConfig } from './config.js';
import { SilverbackClient } from './client.js';
import { registerAllTools } from './tools.js';

async function main(): Promise<void> {
  validateConfig();

  const server = new McpServer({
    name: 'silverback-x402-mcp',
    version: '1.0.0',
  });

  // Resource for service discovery
  server.resource('info', 'silverback://info', async () => ({
    contents: [
      {
        uri: 'silverback://info',
        mimeType: 'application/json',
        text: JSON.stringify({
          name: 'Silverback DeFi Intelligence',
          description:
            'AI-powered DeFi intelligence for the agent economy. ' +
            '26 x402 endpoints: swap routing, yield analysis, token audits, ' +
            'whale tracking, technical analysis, backtesting, and more. ' +
            'Pay per call with USDC on Base.',
          apiUrl: config.apiUrl,
          website: 'https://silverbackdefi.app',
          networks: ['Base (EVM)', 'Solana', 'SKALE Base', 'Keeta'],
          erc8004Agent: 'https://8004agents.ai/ethereum/agent/13026',
        }),
      },
    ],
  }));

  // Create x402-aware client and register all tools
  const client = new SilverbackClient(
    config.apiUrl,
    config.privateKey as `0x${string}`,
  );

  log('Registering tools...');
  await registerAllTools(server, client);

  // Connect via stdio
  const transport = new StdioServerTransport();
  await server.connect(transport);
  log('Server running on stdio — ready for tool calls');
}

main().catch((error) => {
  log(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
