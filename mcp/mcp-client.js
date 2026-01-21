#!/usr/bin/env node

/**
 * MCP Client for Playwright Test Automation
 * Interactive CLI to use MCP tools for test management
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';
import readline from 'readline';

class PlaywrightMCPClient {
  constructor() {
    this.client = null;
    this.transport = null;
  }

  async connect() {
    // Spawn the MCP server
    const serverProcess = spawn('node', ['mcp/playwright-server.js'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    this.transport = new StdioClientTransport({
      reader: serverProcess.stdout,
      writer: serverProcess.stdin,
    });

    this.client = new Client(
      {
        name: 'playwright-mcp-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      }
    );

    await this.client.connect(this.transport);
    console.log('Connected to Playwright MCP Server\n');
  }

  async listTools() {
    const response = await this.client.listTools();
    console.log('\nAvailable Tools:');
    console.log('================');
    response.tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}`);
      console.log(`   Description: ${tool.description}`);
      console.log('');
    });
    return response.tools;
  }

  async callTool(toolName, args = {}) {
    console.log(`\nExecuting: ${toolName}...`);
    const response = await this.client.callTool({
      name: toolName,
      arguments: args,
    });

    if (response.content && response.content.length > 0) {
      console.log('\nResult:');
      console.log('-------');
      response.content.forEach((item) => {
        if (item.type === 'text') {
          console.log(item.text);
        }
      });
    }

    return response;
  }

  async listResources() {
    const response = await this.client.listResources();
    console.log('\nAvailable Resources:');
    console.log('====================');
    response.resources.forEach((resource, index) => {
      console.log(`${index + 1}. ${resource.name}`);
      console.log(`   URI: ${resource.uri}`);
      console.log(`   Description: ${resource.description}`);
      console.log('');
    });
    return response.resources;
  }

  async readResource(uri) {
    const response = await this.client.readResource({ uri });
    console.log('\nResource Content:');
    console.log('-----------------');
    response.contents.forEach((content) => {
      console.log(content.text);
    });
    return response;
  }

  async disconnect() {
    if (this.transport) {
      await this.transport.close();
    }
  }
}

// Interactive CLI
async function main() {
  const client = new PlaywrightMCPClient();

  try {
    await client.connect();

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const prompt = () => {
      rl.question('\nMCP> ', async (input) => {
        const [command, ...args] = input.trim().split(' ');

        try {
          switch (command.toLowerCase()) {
            case 'help':
              console.log(`
Available Commands:
  tools           - List all available tools
  resources       - List all available resources
  run <file>      - Run a test file
  run-all         - Run all tests
  list            - List test files
  generate        - Generate a new test script
  report          - Generate Allure report
  screenshot      - Take a screenshot of a URL
  locators        - Get element locators for a page
  quit/exit       - Exit the CLI
              `);
              break;

            case 'tools':
              await client.listTools();
              break;

            case 'resources':
              await client.listResources();
              break;

            case 'run':
              if (args.length === 0) {
                console.log('Usage: run <test-file-path>');
              } else {
                await client.callTool('run_playwright_test', {
                  testPath: args.join(' '),
                  browser: 'chromium',
                });
              }
              break;

            case 'run-all':
              await client.callTool('run_playwright_test', {
                testPath: 'Tests/',
                browser: 'chromium',
              });
              break;

            case 'list':
              await client.callTool('list_test_files', {
                directory: args[0] || 'Tests',
              });
              break;

            case 'generate':
              rl.question('Test Case ID (e.g., EC-200): ', async (testCaseId) => {
                rl.question('Test Description: ', async (description) => {
                  rl.question('Category (LoginTests/DashboardTests/AddStandaloneConnectionTests): ', async (category) => {
                    await client.callTool('generate_test_script', {
                      testCaseId,
                      testDescription: description,
                      category,
                    });
                    prompt();
                  });
                });
              });
              return;

            case 'report':
              await client.callTool('generate_allure_report', {});
              break;

            case 'screenshot':
              if (args.length < 2) {
                console.log('Usage: screenshot <url> <filename>');
              } else {
                await client.callTool('take_screenshot', {
                  url: args[0],
                  filename: args[1],
                });
              }
              break;

            case 'locators':
              if (args.length === 0) {
                console.log('Usage: locators <url> [element-type]');
              } else {
                await client.callTool('get_element_locators', {
                  url: args[0],
                  elementType: args[1] || 'all',
                });
              }
              break;

            case 'quit':
            case 'exit':
              console.log('Goodbye!');
              await client.disconnect();
              rl.close();
              process.exit(0);

            case '':
              break;

            default:
              console.log(`Unknown command: ${command}. Type 'help' for available commands.`);
          }
        } catch (error) {
          console.error(`Error: ${error.message}`);
        }

        prompt();
      });
    };

    console.log("Type 'help' for available commands.\n");
    prompt();
  } catch (error) {
    console.error('Failed to connect to MCP server:', error.message);
    process.exit(1);
  }
}

main();
