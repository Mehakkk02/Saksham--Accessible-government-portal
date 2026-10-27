#!/usr/bin/env node
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Automated Guardrails Scanner for Project Saksham
 *
 * Rules:
 * 1. type="checkbox" or type="radio" used for barrier choices
 * 2. speechSynthesis.speak outside the speech helper (src/utils/speech.ts)
 * 3. localStorage/sessionStorage use outside one storage helper (src/utils/storage.ts)
 * 4. fetch/XHR/FormData sending a File, Blob or image (images never leave the device)
 * 5. GEMINI_API_KEY or secret env values in client code (server-side only)
 * 6. The words "AUTHENTICATED", "256-Bit", "Government of India" in UI text
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

// Scan targets
const DIRS_TO_SCAN = ['src', 'app', 'components', 'lib', 'store'];
const EXTRA_FILES_TO_SCAN = ['index.html'];
const EXTENSIONS_TO_SCAN = ['.ts', '.tsx', '.js', '.jsx', '.html', '.mjs', '.cjs'];


const violations = [];

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === 'dist' ||
        entry.name === '.git' ||
        entry.name === '.playwright-cli'
      ) {
        continue;
      }
      getAllFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS_TO_SCAN.includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

function scanFiles() {
  const files = [];

  for (const dirName of DIRS_TO_SCAN) {
    const dirPath = path.join(ROOT_DIR, dirName);
    getAllFiles(dirPath, files);
  }

  for (const relFile of EXTRA_FILES_TO_SCAN) {
    const fullPath = path.join(ROOT_DIR, relFile);
    if (fs.existsSync(fullPath)) {
      files.push(fullPath);
    }
  }

  for (const filePath of files) {
    const relativePath = normalizePath(path.relative(ROOT_DIR, filePath));
    checkFile(filePath, relativePath);
  }
}

function checkFile(fullPath, relativePath) {
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');

  const isSpeechHelper = relativePath.endsWith('src/utils/speech.ts') || relativePath.endsWith('utils/speech.ts');
  const isStorageHelper = relativePath.endsWith('src/utils/storage.ts') || relativePath.endsWith('utils/storage.ts');
  const isBarrierFile =
    relativePath.toLowerCase().includes('barrier') ||
    relativePath.toLowerCase().includes('onboarding');
  const isTestFile = relativePath.endsWith('.test.ts') || relativePath.endsWith('.test.tsx');

  lines.forEach((lineText, index) => {
    const lineNum = index + 1;
    const trimmed = lineText.trim();

    // Skip pure comment lines for code syntax checks
    const isSingleLineComment = trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');

    // Rule 1: type="checkbox" or type="radio" used for barrier choices
    if (isBarrierFile) {
      if (!isSingleLineComment && /type\s*=\s*["'](checkbox|radio)["']/i.test(lineText)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: 'type="checkbox" or type="radio" used for barrier choices (use accessible button cards instead)',
          snippet: trimmed,
        });
      }
    } else if (!isSingleLineComment && /barrier/i.test(lineText) && /type\s*=\s*["'](checkbox|radio)["']/i.test(lineText)) {
      violations.push({
        file: relativePath,
        line: lineNum,
        rule: 'type="checkbox" or type="radio" used for barrier choices',
        snippet: trimmed,
      });
    }

    // Rule 2: speechSynthesis.speak outside the speech helper
    if (!isSpeechHelper && !isSingleLineComment) {
      if (/\bspeechSynthesis\.speak\b/.test(lineText)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: 'speechSynthesis.speak outside the speech helper (route all speech through src/utils/speech.ts)',
          snippet: trimmed,
        });
      }
    }

    // Rule 3: localStorage/sessionStorage use outside one storage helper
    if (!isStorageHelper && !isSingleLineComment) {
      // Check for active localStorage/sessionStorage calls
      if (/\b(?:window\.)?(localStorage|sessionStorage)\b/.test(lineText)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: 'localStorage/sessionStorage use outside one storage helper (use src/utils/storage.ts)',
          snippet: trimmed,
        });
      }
    }

    // Rule 4: fetch/XHR/FormData sending a File, Blob or image
    if (!isSingleLineComment) {
      // FormData append of File/Blob/image
      if (/\b(?:formData|fd|data)\.append\s*\([^)]*(?:file|blob|image|photo|canvas)/i.test(lineText)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: 'fetch/XHR/FormData sending a File, Blob or image (images must never leave device)',
          snippet: trimmed,
        });
      }
      // fetch sending File, Blob or FormData containing image
      if (/fetch\s*\([^)]*body:\s*(?:file|blob|image|photo|formData|fd)/i.test(lineText)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: 'fetch/XHR/FormData sending a File, Blob or image (images must never leave device)',
          snippet: trimmed,
        });
      }
      // XHR send File/Blob/image
      if (/\.send\s*\([^)]*(?:file|blob|image|photo|formData|fd)/i.test(lineText)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: 'fetch/XHR/FormData sending a File, Blob or image (images must never leave device)',
          snippet: trimmed,
        });
      }
    }

    // Rule 5: GEMINI_API_KEY or secret env values in client code
    if (!isSingleLineComment) {
      if (
        /\bGEMINI_API_KEY\b/.test(lineText) ||
        /\bprocess\.env\.(?:GEMINI|API_KEY|SECRET)\b/.test(lineText) ||
        /\bVITE_GEMINI\b/.test(lineText)
      ) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: 'GEMINI_API_KEY or secret env values in client code (Gemini key must stay server-side)',
          snippet: trimmed,
        });
      }
    }

    // Rule 6: the words "AUTHENTICATED", "256-Bit", "Government of India" in UI text
    // (Exclude test assertions checking that forbidden patterns are absent)
    if (!isSingleLineComment && !isTestFile) {
      if (/\bAUTHENTICATED\b/i.test(lineText)) {
        // Allow if it's purely a function or standard OAuth method name if any, but in UI text flag it
        if (/["'`>]|(?:\bAuthenticated\b|\bAUTHENTICATED\b)/.test(lineText)) {
          violations.push({
            file: relativePath,
            line: lineNum,
            rule: 'the word "AUTHENTICATED" in UI text (never claim real government verification)',
            snippet: trimmed,
          });
        }
      }

      if (/\b256-bit\b/i.test(lineText)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: 'the phrase "256-Bit" in UI text',
          snippet: trimmed,
        });
      }

      if (/\bGovernment of India\b/i.test(lineText)) {
        violations.push({
          file: relativePath,
          line: lineNum,
          rule: 'the phrase "Government of India" in UI text (use official Swavlamban portal naming)',
          snippet: trimmed,
        });
      }
    }
  });
}

// Run scanner
scanFiles();

if (violations.length > 0) {
  console.error(`\n❌ Automated Guardrails failed with ${violations.length} violation(s):\n`);
  for (const v of violations) {
    console.error(`${v.file}:${v.line}: Rule broken: ${v.rule}`);
    console.error(`   > ${v.snippet}\n`);
  }
  process.exit(1);
} else {
  console.log('✓ Automated Guardrails: All project rules passed cleanly.');
  process.exit(0);
}
