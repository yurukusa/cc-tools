#!/usr/bin/env node
/**
 * cc-tools — Which tools does your Claude Code AI use most?
 * Shows the distribution of tool calls across your session history.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const showCategories = args.includes('--categories');
const showHelp = args.includes('--help') || args.includes('-h');
const topFlag = args.find(a => a.startsWith('--top='));
const topN = topFlag ? parseInt(topFlag.split('=')[1]) : 15;

if (showHelp) {
  console.log(`cc-tools — Which tools does your Claude Code AI call most?

Usage:
  npx cc-tools                  # Top 15 tools
  npx cc-tools --top=20         # Top 20 tools
  npx cc-tools --categories     # Group by category
  npx cc-tools --json           # JSON output
`);
  process.exit(0);
}

// Category groupings
const CATEGORIES = {
  'Explorer': ['Read', 'Grep', 'Glob'],
  'Executor': ['Bash'],
  'Builder':  ['Edit', 'Write', 'NotebookEdit'],
  'Orchestrator': ['Task', 'TaskCreate', 'TaskUpdate', 'TaskList', 'TaskGet', 'TaskOutput', 'TodoWrite', 'ExitPlanMode', 'EnterPlanMode', 'AskUserQuestion', 'Agent'],
  'Researcher': ['WebSearch', 'WebFetch'],
  'Communicator': ['SendMessage', 'TeamCreate', 'TeamDelete'],
  'MCP': [],  // catch-all for mcp__* tools
};

function categorize(name) {
  if (name.startsWith('mcp__')) return 'MCP';
  for (const [cat, tools] of Object.entries(CATEGORIES)) {
    if (cat === 'MCP') continue;
    if (tools.includes(name)) return cat;
  }
  return 'Other';
}

const claudeDir = join(homedir(), '.claude', 'projects');

function scanProjects(dir) {
  const toolCounts = {};
  let projectDirs;
  try {
    projectDirs = readdirSync(dir);
  } catch {
    return toolCounts;
  }

  for (const projDir of projectDirs) {
    const projPath = join(dir, projDir);
    try {
      const stat = statSync(projPath);
      if (!stat.isDirectory()) continue;
    } catch {
      continue;
    }

    let entries;
    try {
      entries = readdirSync(projPath);
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.endsWith('.jsonl')) continue;
      const filePath = join(projPath, entry);
      try {
        const stat = statSync(filePath);
        if (!stat.isFile()) continue;
      } catch {
        continue;
      }

      let content;
      try {
        content = readFileSync(filePath, 'utf8');
      } catch {
        continue;
      }

      // Fast pattern matching: find tool_use blocks
      // Pattern: "type":"tool_use",...,"name":"ToolName"
      const matches = content.match(/"type":"tool_use","id":"[^"]*","name":"([^"]+)"/g);
      if (!matches) continue;

      for (const m of matches) {
        const nameMatch = m.match(/"name":"([^"]+)"/);
        if (nameMatch) {
          const name = nameMatch[1];
          toolCounts[name] = (toolCounts[name] || 0) + 1;
        }
      }
    }
  }

  return toolCounts;
}

const toolCounts = scanProjects(claudeDir);
const sorted = Object.entries(toolCounts).sort((a, b) => b[1] - a[1]);
const grandTotal = sorted.reduce((a, b) => a + b[1], 0);

if (grandTotal === 0) {
  console.error('No tool usage data found.');
  process.exit(1);
}

if (jsonMode) {
  const categories = {};
  for (const [name, count] of sorted) {
    const cat = categorize(name);
    if (!categories[cat]) categories[cat] = { total: 0, tools: [] };
    categories[cat].total += count;
    categories[cat].tools.push({ name, count });
  }
  console.log(JSON.stringify({
    total_calls: grandTotal,
    unique_tools: sorted.length,
    top_tools: sorted.slice(0, topN).map(([name, count]) => ({
      name,
      count,
      pct: Math.round(count / grandTotal * 100),
      category: categorize(name),
    })),
    categories: Object.entries(categories)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([name, data]) => ({
        name,
        total: data.total,
        pct: Math.round(data.total / grandTotal * 100),
        tools: data.tools.slice(0, 5),
      })),
  }, null, 2));
  process.exit(0);
}

const BAR_WIDTH = 28;
const maxCount = sorted[0]?.[1] || 1;

function bar(count) {
  const filled = Math.round((count / maxCount) * BAR_WIDTH);
  return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
}

function rpad(str, len) {
  return str + ' '.repeat(Math.max(0, len - str.length));
}

if (showCategories) {
  // Aggregate by category
  const catData = {};
  for (const [name, count] of sorted) {
    const cat = categorize(name);
    if (!catData[cat]) catData[cat] = 0;
    catData[cat] += count;
  }

  const catSorted = Object.entries(catData).sort((a, b) => b[1] - a[1]);
  const catMax = catSorted[0]?.[1] || 1;
  const maxCatLabel = Math.max(...catSorted.map(([c]) => c.length));

  console.log('cc-tools — Tool calls by category\n');
  for (const [cat, count] of catSorted) {
    const label = rpad(cat, maxCatLabel);
    const countStr = count.toLocaleString().padStart(7);
    const pct = (count / grandTotal * 100).toFixed(1).padStart(5);
    const filled = Math.round((count / catMax) * BAR_WIDTH);
    const b = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
    console.log(`  ${label}  ${b}  ${countStr}  (${pct}%)`);
  }

  console.log('\n' + '─'.repeat(60));
  console.log(`  Total calls: ${grandTotal.toLocaleString()}  |  Unique tools: ${sorted.length}`);
  process.exit(0);
}

// Default: top N tools
const display = sorted.slice(0, topN);
const maxLabel = Math.max(...display.map(([n]) => n.length));

console.log(`cc-tools — Top ${topN} tool calls\n`);
for (const [name, count] of display) {
  const label = rpad(name, maxLabel);
  const countStr = count.toLocaleString().padStart(7);
  const pct = (count / grandTotal * 100).toFixed(1).padStart(5);
  console.log(`  ${label}  ${bar(count)}  ${countStr}  (${pct}%)`);
}

console.log('\n' + '─'.repeat(65));
console.log(`  Total calls: ${grandTotal.toLocaleString()}  |  Unique tools: ${sorted.length}`);
console.log(`  Run with --categories to see grouped view`);
