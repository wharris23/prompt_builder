/**
 * Prompt Compiler - Main Application
 */

import { transformPrompt } from './src/transformer.js';

// DOM Elements
const inputArea = document.getElementById('inputArea');
const outputContent = document.getElementById('outputContent');
const charCount = document.getElementById('charCount');
const intentBadge = document.getElementById('intentBadge');
const confidenceFill = document.getElementById('confidenceFill');
const confidenceValue = document.getElementById('confidenceValue');
const copyBtn = document.getElementById('copyBtn');
const statsFooter = document.getElementById('statsFooter');
const templateName = document.getElementById('templateName');
const matchType = document.getElementById('matchType');
const processingTime = document.getElementById('processingTime');
const outputLength = document.getElementById('outputLength');

// State
let currentOutput = '';
let debounceTimer = null;

/**
 * Update the UI with transformation results
 */
function updateUI(result) {
  const { optimizedPrompt, metadata } = result;
  
  currentOutput = optimizedPrompt;
  
  // Update output content
  if (optimizedPrompt) {
    outputContent.textContent = optimizedPrompt;
    outputContent.classList.remove('empty');
    copyBtn.disabled = false;
    statsFooter.style.display = 'flex';
  } else {
    outputContent.textContent = 'Start typing to see the optimized prompt...';
    outputContent.classList.add('empty');
    copyBtn.disabled = true;
    statsFooter.style.display = 'none';
  }
  
  // Update intent badge
  intentBadge.textContent = metadata.intent.charAt(0).toUpperCase() + metadata.intent.slice(1);
  intentBadge.className = `intent-badge ${metadata.intent}`;
  
  // Update confidence
  const confidencePercent = Math.round(metadata.confidence * 100);
  confidenceFill.style.width = `${confidencePercent}%`;
  confidenceValue.textContent = `${confidencePercent}%`;
  
  // Update stats
  templateName.textContent = metadata.templateName;
  matchType.textContent = metadata.matchedBy || '—';
  processingTime.textContent = `${metadata.processingTimeMs}ms`;
  outputLength.textContent = `${metadata.outputLength} chars`;
}

/**
 * Handle input changes with debouncing
 */
function handleInput() {
  const input = inputArea.value;
  
  // Update character count immediately
  charCount.textContent = `${input.length} characters`;
  
  // Debounce transformation
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const result = transformPrompt(input);
    updateUI(result);
  }, 100);
}

/**
 * Copy output to clipboard
 */
async function copyToClipboard() {
  if (!currentOutput) return;
  
  try {
    await navigator.clipboard.writeText(currentOutput);
    
    // Visual feedback
    const originalText = copyBtn.innerHTML;
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      Copied!
    `;
    
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = originalText;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
}

// Event Listeners
inputArea.addEventListener('input', handleInput);
copyBtn.addEventListener('click', copyToClipboard);

// Initial state
handleInput();
