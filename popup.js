/**
 * Prompt Compiler - UI Logic
 */

import { transformPrompt } from './src/transformer.js';
import { profileManager } from './src/profiles.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputArea = document.getElementById('inputArea');
  const outputContent = document.getElementById('outputContent');
  const charCount = document.getElementById('charCount');
  const templateSelect = document.getElementById('templateSelect'); // Mode selector
  const profileSelect = document.getElementById('profileSelect'); // Profile selector
  const modelSelect = document.getElementById('modelSelect'); // Model selector
  const confidenceFill = document.getElementById('confidenceFill');
  const confidenceValue = document.getElementById('confidenceValue');
  const copyBtn = document.getElementById('copyBtn');
  const templateNameEl = document.getElementById('templateName');
  const processingTime = document.getElementById('processingTime');

  let currentOutput = '';
  let debounceTimer = null;

  // Initialize Profiles
  function initProfiles() {
    const profiles = profileManager.getProfiles();
    profileSelect.innerHTML = '';

    for (const [id, profile] of Object.entries(profiles)) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = profile.name;
      if (id === 'beginner_default') option.selected = true;
      profileSelect.appendChild(option);
    }
  }

  function updateUI(result) {
    const { optimizedPrompt, metadata } = result;

    currentOutput = optimizedPrompt;

    if (optimizedPrompt) {
      outputContent.textContent = optimizedPrompt;
      outputContent.classList.remove('placeholder');
      copyBtn.disabled = false;
    } else {
      outputContent.innerHTML = '<span class="placeholder">Start typing to see the optimized prompt...</span>';
      copyBtn.disabled = true;
    }

    const confidencePercent = Math.round(metadata.confidence * 100);
    confidenceFill.style.width = `${confidencePercent}%`;
    confidenceValue.textContent = metadata.matchedBy === 'manual' ? 'Manual' : `${confidencePercent}%`;

    templateNameEl.textContent = metadata.templateName;
    processingTime.textContent = `${metadata.processingTimeMs}ms`;
  }

  function handleInput() {
    const input = inputArea.value;
    charCount.textContent = `${input.length} chars`;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const selectedMode = templateSelect.value;
      const selectedModel = modelSelect.value;

      const result = transformPrompt(
        input,
        selectedMode === 'auto' ? null : selectedMode,
        selectedModel
      );
      updateUI(result);
    }, 50);
  }

  function handleProfileChange() {
    profileManager.setProfile(profileSelect.value);
    handleInput(); // Re-transform with new profile
  }

  async function copyToClipboard() {
    if (!currentOutput) return;

    try {
      if (window.electronAPI) {
        await window.electronAPI.copyToClipboard(currentOutput);
      } else {
        await navigator.clipboard.writeText(currentOutput);
      }

      copyBtn.classList.add('copied');
      copyBtn.querySelector('span').textContent = 'Copied!';

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.querySelector('span').textContent = 'Copy';
      }, 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && window.electronAPI) {
      window.electronAPI.hideWindow();
    }

    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && currentOutput) {
      copyToClipboard();
    }
  }

  // Event Listeners
  inputArea.addEventListener('input', handleInput);
  templateSelect.addEventListener('change', handleInput);
  profileSelect.addEventListener('change', handleProfileChange);
  modelSelect.addEventListener('change', handleInput);
  copyBtn.addEventListener('click', copyToClipboard);
  document.addEventListener('keydown', handleKeydown);

  // Initial Setup
  initProfiles();

  if (window.electronAPI) {
    window.electronAPI.onFocusInput(() => {
      inputArea.focus();
      inputArea.select();
    });
  }

  handleInput();
});
