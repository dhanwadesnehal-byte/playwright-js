#!/usr/bin/env node

/**
 * MCP Server for Playwright Test Automation
 * This server provides tools for AI-assisted test generation and execution
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Create the MCP server
const server = new Server(
  {
    name: 'playwright-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'run_playwright_test',
        description: 'Run a specific Playwright test file or test case',
        inputSchema: {
          type: 'object',
          properties: {
            testPath: {
              type: 'string',
              description: 'Path to the test file (e.g., Tests/LoginTests/EC-71.spec.js)',
            },
            testName: {
              type: 'string',
              description: 'Optional specific test name to run (grep pattern)',
            },
            browser: {
              type: 'string',
              enum: ['chromium', 'firefox', 'webkit'],
              description: 'Browser to run tests on (default: chromium)',
            },
            headed: {
              type: 'boolean',
              description: 'Run tests in headed mode (visible browser)',
            },
          },
          required: ['testPath'],
        },
      },
      {
        name: 'list_test_files',
        description: 'List all available Playwright test files in the project',
        inputSchema: {
          type: 'object',
          properties: {
            directory: {
              type: 'string',
              description: 'Directory to search for test files (default: Tests)',
            },
          },
        },
      },
      {
        name: 'get_test_results',
        description: 'Get the latest test results from the last test run',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'generate_test_script',
        description: 'Generate a new Playwright test script based on test case description',
        inputSchema: {
          type: 'object',
          properties: {
            testCaseId: {
              type: 'string',
              description: 'Test case ID (e.g., EC-71)',
            },
            testDescription: {
              type: 'string',
              description: 'Description of what the test should verify',
            },
            category: {
              type: 'string',
              enum: ['LoginTests', 'DashboardTests', 'AddStandaloneConnectionTests'],
              description: 'Test category/folder',
            },
          },
          required: ['testCaseId', 'testDescription', 'category'],
        },
      },
      {
        name: 'take_screenshot',
        description: 'Navigate to a URL and take a screenshot',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to navigate to',
            },
            filename: {
              type: 'string',
              description: 'Screenshot filename (without extension)',
            },
          },
          required: ['url', 'filename'],
        },
      },
      {
        name: 'generate_allure_report',
        description: 'Generate Allure report from test results',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_element_locators',
        description: 'Analyze a page and suggest Playwright locators for elements',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL of the page to analyze',
            },
            elementType: {
              type: 'string',
              enum: ['buttons', 'inputs', 'links', 'forms', 'all'],
              description: 'Type of elements to find locators for',
            },
          },
          required: ['url'],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'run_playwright_test': {
        const testPath = args.testPath;
        const browser = args.browser || 'chromium';
        const headed = args.headed ? '--headed' : '';
        const testName = args.testName ? `-g "${args.testName}"` : '';

        const command = `npx playwright test ${testPath} --project=${browser} ${headed} ${testName}`.trim();

        try {
          const { stdout, stderr } = await execAsync(command, {
            cwd: process.cwd(),
            timeout: 300000, // 5 minute timeout
          });
          return {
            content: [
              {
                type: 'text',
                text: `Test execution completed:\n\nCommand: ${command}\n\nOutput:\n${stdout}\n${stderr ? `Errors:\n${stderr}` : ''}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Test execution failed:\n\nCommand: ${command}\n\nError: ${error.message}\n\nOutput:\n${error.stdout || ''}\n${error.stderr || ''}`,
              },
            ],
          };
        }
      }

      case 'list_test_files': {
        const directory = args.directory || 'Tests';
        const { stdout } = await execAsync(`find ${directory} -name "*.spec.js" | sort`, {
          cwd: process.cwd(),
        });

        const files = stdout.trim().split('\n').filter(Boolean);
        return {
          content: [
            {
              type: 'text',
              text: `Found ${files.length} test files:\n\n${files.join('\n')}`,
            },
          ],
        };
      }

      case 'get_test_results': {
        try {
          const resultsPath = 'test-results';
          const { stdout } = await execAsync(`find ${resultsPath} -name "*.json" -type f 2>/dev/null | head -5`, {
            cwd: process.cwd(),
          });

          if (!stdout.trim()) {
            return {
              content: [
                {
                  type: 'text',
                  text: 'No test results found. Run tests first using run_playwright_test tool.',
                },
              ],
            };
          }

          return {
            content: [
              {
                type: 'text',
                text: `Test results found:\n${stdout}\n\nUse generate_allure_report to view detailed results.`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Error getting test results: ${error.message}`,
              },
            ],
          };
        }
      }

      case 'generate_test_script': {
        const { testCaseId, testDescription, category } = args;
        const testNumber = testCaseId.replace(/\D/g, '');

        const scriptContent = `// @ts-check
import { test, expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter';

const LOGIN_URL = 'https://demo.ehrconnect.healthconnect.systems/login';
const VALID_USERNAME = 'administrator';
const VALID_PASSWORD = 'Mindbowser@123';

// Helper function to login
async function login(page) {
  await page.goto(LOGIN_URL);
  const usernameField = page.locator('input[type="text"], input[type="email"], input[name="username"], input[name="email"]').first();
  const passwordField = page.locator('input[type="password"]');
  const loginButton = page.locator('button[type="submit"], input[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();

  await usernameField.fill(VALID_USERNAME);
  await passwordField.fill(VALID_PASSWORD);
  await loginButton.click();
  await page.waitForTimeout(3000);
}

// ${testCaseId}: ${testDescription}
test(qase(${testNumber}, '${testCaseId}: ${testDescription}'), async ({ page }) => {
  await login(page);

  // TODO: Add test implementation based on description
  // Test: ${testDescription}

  // Add your test assertions here
  await expect(page.locator('body')).toBeVisible();
});
`;

        const filePath = `Tests/${category}/${testCaseId}.spec.js`;
        await fs.mkdir(`Tests/${category}`, { recursive: true });
        await fs.writeFile(filePath, scriptContent);

        return {
          content: [
            {
              type: 'text',
              text: `Test script generated successfully!\n\nFile: ${filePath}\n\nContent:\n${scriptContent}`,
            },
          ],
        };
      }

      case 'take_screenshot': {
        const { url, filename } = args;
        const screenshotPath = `screenshots/${filename}.png`;

        await fs.mkdir('screenshots', { recursive: true });

        const script = `
          const { chromium } = require('@playwright/test');
          (async () => {
            const browser = await chromium.launch();
            const page = await browser.newPage();
            await page.goto('${url}');
            await page.screenshot({ path: '${screenshotPath}', fullPage: true });
            await browser.close();
          })();
        `;

        try {
          await execAsync(`node -e "${script.replace(/\n/g, ' ')}"`, {
            cwd: process.cwd(),
            timeout: 60000,
          });

          return {
            content: [
              {
                type: 'text',
                text: `Screenshot saved to: ${screenshotPath}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Screenshot failed: ${error.message}`,
              },
            ],
          };
        }
      }

      case 'generate_allure_report': {
        try {
          await execAsync('npx allure generate allure-results --clean -o allure-report', {
            cwd: process.cwd(),
            timeout: 60000,
          });

          return {
            content: [
              {
                type: 'text',
                text: 'Allure report generated successfully!\n\nRun "npx allure open allure-report" to view the report.',
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to generate Allure report: ${error.message}`,
              },
            ],
          };
        }
      }

      case 'get_element_locators': {
        const { url, elementType = 'all' } = args;

        const script = `
          const { chromium } = require('@playwright/test');
          (async () => {
            const browser = await chromium.launch();
            const page = await browser.newPage();
            await page.goto('${url}');

            const locators = [];

            if ('${elementType}' === 'all' || '${elementType}' === 'buttons') {
              const buttons = await page.locator('button').all();
              for (const btn of buttons) {
                const text = await btn.textContent();
                if (text) locators.push({ type: 'button', text: text.trim(), locator: \`button:has-text("\${text.trim()}")\` });
              }
            }

            if ('${elementType}' === 'all' || '${elementType}' === 'inputs') {
              const inputs = await page.locator('input').all();
              for (const input of inputs) {
                const name = await input.getAttribute('name');
                const type = await input.getAttribute('type');
                const placeholder = await input.getAttribute('placeholder');
                if (name) locators.push({ type: 'input', name, locator: \`input[name="\${name}"]\` });
                else if (placeholder) locators.push({ type: 'input', placeholder, locator: \`input[placeholder="\${placeholder}"]\` });
              }
            }

            if ('${elementType}' === 'all' || '${elementType}' === 'links') {
              const links = await page.locator('a').all();
              for (const link of links) {
                const text = await link.textContent();
                const href = await link.getAttribute('href');
                if (text && text.trim()) locators.push({ type: 'link', text: text.trim(), href, locator: \`a:has-text("\${text.trim()}")\` });
              }
            }

            console.log(JSON.stringify(locators, null, 2));
            await browser.close();
          })();
        `;

        try {
          const { stdout } = await execAsync(`node -e "${script.replace(/\n/g, ' ').replace(/"/g, '\\"')}"`, {
            cwd: process.cwd(),
            timeout: 60000,
          });

          return {
            content: [
              {
                type: 'text',
                text: `Element locators for ${url}:\n\n${stdout}`,
              },
            ],
          };
        } catch (error) {
          return {
            content: [
              {
                type: 'text',
                text: `Failed to get locators: ${error.message}`,
              },
            ],
          };
        }
      }

      default:
        return {
          content: [
            {
              type: 'text',
              text: `Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing tool ${name}: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'playwright://config',
        name: 'Playwright Configuration',
        description: 'Current Playwright configuration file',
        mimeType: 'application/javascript',
      },
      {
        uri: 'playwright://test-structure',
        name: 'Test Structure',
        description: 'Overview of test file organization',
        mimeType: 'text/plain',
      },
    ],
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'playwright://config') {
    try {
      const config = await fs.readFile('playwright.config.js', 'utf-8');
      return {
        contents: [
          {
            uri,
            mimeType: 'application/javascript',
            text: config,
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: `Error reading config: ${error.message}`,
          },
        ],
      };
    }
  }

  if (uri === 'playwright://test-structure') {
    try {
      const { stdout } = await execAsync('find Tests -name "*.spec.js" | sort', {
        cwd: process.cwd(),
      });

      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: `Test File Structure:\n\n${stdout}`,
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri,
            mimeType: 'text/plain',
            text: `Error reading test structure: ${error.message}`,
          },
        ],
      };
    }
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Playwright MCP Server running on stdio');
}

main().catch(console.error);
