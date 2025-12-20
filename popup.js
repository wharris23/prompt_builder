/**
 * Prompt Compiler - All-in-one Bundle for Electron
 * With manual template selection support
 */

// ============================================
// CLASSIFIER (Improved)
// ============================================

const INTENT_PATTERNS = {
  coding: {
    keywords: ['code', 'function', 'bug', 'error', 'implement', 'debug', 'fix', 'program', 'script', 'api', 'database', 'algorithm', 'class', 'method', 'variable', 'syntax', 'compile', 'runtime', 'website', 'app', 'application', 'frontend', 'backend', 'component', 'page', 'build', 'develop', 'create'],
    patterns: [
      /\b(write|create|build|make|develop)\s+(a\s+)?(function|class|script|program|code|website|web\s*app|app|application|component|page)/i,
      /\b(how\s+to|how\s+do\s+i)\s+(code|implement|program|write|build|create|make)/i,
      /\b(fix|debug|solve)\s+(this|the|my)?\s*(error|bug|issue|problem)/i,
      /```[\s\S]*```/,
      /\b(python|javascript|java|c\+\+|rust|go|typescript|sql|html|css|react|vue|angular|node|next\.?js)\b/i,
      /\b(calendar|dashboard|form|login|signup|landing)\s*(page|website|app|component)?/i,
    ],
    weight: 1.3
  },
  
  explanation: {
    keywords: ['explain', 'what is', 'how does', 'why', 'describe', 'define', 'meaning', 'understand', 'concept', 'difference between', 'compare'],
    patterns: [
      /\b(what|why)\s+(is|are|does|do|did|would|should|can)\b/i,
      /\bexplain\s+(to\s+me\s+)?(how|what|why|the)/i,
      /\b(can\s+you\s+)?(describe|define|clarify)\b/i,
      /\bdifference\s+between\b/i,
      /\bhow\s+does\s+.+\s+work/i,
    ],
    weight: 1.0
  },
  
  creative: {
    keywords: ['story', 'poem', 'creative', 'imagine', 'fiction', 'narrative', 'character', 'plot', 'dialogue', 'essay', 'article', 'blog'],
    patterns: [
      /\b(write|create|compose)\s+(a\s+)?(story|poem|essay|article|song|script|dialogue|novel|fiction)/i,
      /\bimagine\s+(a|that|if)/i,
      /\b(creative|fiction|narrative)\s+writing/i,
      /\bonce\s+upon\s+a\s+time/i,
    ],
    weight: 1.1
  },
  
  analysis: {
    keywords: ['analyze', 'evaluate', 'assess', 'review', 'critique', 'pros and cons', 'advantages', 'disadvantages', 'strengths', 'weaknesses', 'compare', 'contrast'],
    patterns: [
      /\b(analyze|evaluate|assess|review|critique)\s+(this|the|my)/i,
      /\b(pros\s+and\s+cons|advantages\s+and\s+disadvantages)/i,
      /\b(what\s+are\s+the\s+)(strengths|weaknesses|benefits|drawbacks)/i,
      /\bcompare\s+and\s+contrast/i,
    ],
    weight: 1.0
  }
};

function classifyIntent(input) {
  if (!input || typeof input !== 'string') {
    return { intent: 'general', confidence: 0, matchedBy: 'fallback' };
  }

  const normalizedInput = input.toLowerCase().trim();
  const scores = {};

  for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    let matchType = null;

    for (const pattern of config.patterns) {
      if (pattern.test(input)) {
        score += 3;
        matchType = 'pattern';
      }
    }

    for (const keyword of config.keywords) {
      if (normalizedInput.includes(keyword)) {
        score += 1;
        if (!matchType) matchType = 'keyword';
      }
    }

    score *= config.weight;

    if (score > 0) {
      scores[intent] = { score, matchType };
    }
  }

  const entries = Object.entries(scores);
  if (entries.length === 0) {
    return { intent: 'general', confidence: 0, matchedBy: 'fallback' };
  }

  entries.sort((a, b) => b[1].score - a[1].score);
  const [topIntent, { score, matchType }] = entries[0];
  const confidence = Math.min(score / 10, 1);

  return {
    intent: topIntent,
    confidence: Math.round(confidence * 100) / 100,
    matchedBy: matchType
  };
}

// ============================================
// TEMPLATES
// ============================================

const TEMPLATES = {
  coding: {
    name: 'Code Assistant',
    description: 'Optimized for programming tasks',
    template: `You are an expert software engineer. Help me build the following.

## Instructions
- Think step-by-step before writing code
- Consider edge cases and error handling
- Provide clear, well-commented code
- Use modern best practices

## Request
{{input}}

## Expected Response
1. **Plan**: Outline your approach
2. **Implementation**: Complete, working code
3. **Explanation**: Key decisions explained
4. **Next Steps**: What to do after`
  },

  explanation: {
    name: 'Concept Explainer',
    description: 'Structured explanations',
    template: `You are a knowledgeable educator. Explain the following clearly.

## Instructions
- Start with a simple one-sentence summary
- Use analogies to make concepts concrete
- Provide concrete examples
- Build from simple to complex

## Question
{{input}}

## Expected Response
1. **TL;DR**: One-sentence summary
2. **Core Concept**: Detailed explanation with analogies
3. **Examples**: 2-3 concrete examples
4. **Common Pitfalls**: Misconceptions to avoid`
  },

  creative: {
    name: 'Creative Writer',
    description: 'Creative prompts',
    template: `You are a skilled creative writer. Create the following.

## Instructions
- Use vivid, sensory language
- Develop authentic voice and tone
- Show, don't tell
- Create engaging hooks and satisfying conclusions

## Brief
{{input}}

## Guidelines
- Match the tone implied by the request
- Use appropriate formatting for the medium`
  },

  analysis: {
    name: 'Critical Analyst',
    description: 'Systematic evaluation',
    template: `You are a thoughtful analyst. Analyze the following.

## Instructions
- Consider multiple perspectives
- Use evidence and reasoning
- Acknowledge limitations and uncertainties
- Provide actionable insights

## Request
{{input}}

## Expected Response
1. **Context**: Brief background
2. **Key Factors**: Main elements to consider
3. **Analysis**: Detailed examination from multiple angles
4. **Trade-offs**: Pros, cons, and considerations
5. **Recommendation**: Clear, justified conclusion`
  },

  general: {
    name: 'General Assistant',
    description: 'Universal wrapper',
    template: `You are a helpful, accurate, and thorough assistant.

## Instructions
- Understand the request fully before responding
- Be direct and concise while being complete
- Structure your response for clarity
- If the request is ambiguous, address the most likely interpretation

## Request
{{input}}`
  }
};

function getTemplate(intent) {
  return TEMPLATES[intent] || TEMPLATES.general;
}

function populateTemplate(template, variables) {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(placeholder, value);
  }
  return result;
}

// ============================================
// TRANSFORMER (with manual override support)
// ============================================

function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();
  sanitized = sanitized.replace(/[ \t]+/g, ' ');
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts)/gi,
    /you\s+are\s+now\s+a/gi,
    /forget\s+(everything|all)/gi,
    /new\s+instructions?:/gi,
    /system\s*:\s*/gi,
  ];

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  }

  return sanitized;
}

function transformPrompt(rawInput, overrideIntent = null) {
  const startTime = performance.now();

  const cleanInput = sanitizeInput(rawInput);
  
  if (!cleanInput) {
    return {
      optimizedPrompt: '',
      metadata: {
        intent: 'none',
        confidence: 0,
        templateName: 'None',
        inputLength: 0,
        outputLength: 0,
        processingTimeMs: 0,
        isManual: false
      }
    };
  }

  // Use override intent if provided, otherwise auto-detect
  let intent, confidence, matchedBy;
  const isManual = overrideIntent && overrideIntent !== 'auto';
  
  if (isManual) {
    intent = overrideIntent;
    confidence = 1;
    matchedBy = 'manual';
  } else {
    const classification = classifyIntent(cleanInput);
    intent = classification.intent;
    confidence = classification.confidence;
    matchedBy = classification.matchedBy;
  }

  const template = getTemplate(intent);
  const optimizedPrompt = populateTemplate(template.template, { input: cleanInput });

  const endTime = performance.now();

  return {
    optimizedPrompt,
    metadata: {
      intent,
      confidence,
      matchedBy,
      templateName: template.name,
      inputLength: rawInput.length,
      outputLength: optimizedPrompt.length,
      processingTimeMs: Math.round((endTime - startTime) * 100) / 100,
      isManual
    }
  };
}

// ============================================
// UI LOGIC
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  const inputArea = document.getElementById('inputArea');
  const outputContent = document.getElementById('outputContent');
  const charCount = document.getElementById('charCount');
  const templateSelect = document.getElementById('templateSelect');
  const confidenceFill = document.getElementById('confidenceFill');
  const confidenceValue = document.getElementById('confidenceValue');
  const copyBtn = document.getElementById('copyBtn');
  const templateNameEl = document.getElementById('templateName');
  const processingTime = document.getElementById('processingTime');

  let currentOutput = '';
  let debounceTimer = null;

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
    
    // Update dropdown to show detected intent (only if in auto mode)
    if (templateSelect.value === 'auto' && metadata.intent !== 'none') {
      // Don't change the dropdown, but show what was detected
    }
    
    const confidencePercent = Math.round(metadata.confidence * 100);
    confidenceFill.style.width = `${confidencePercent}%`;
    confidenceValue.textContent = metadata.isManual ? 'Manual' : `${confidencePercent}%`;
    
    templateNameEl.textContent = metadata.templateName;
    processingTime.textContent = `${metadata.processingTimeMs}ms`;
  }

  function handleInput() {
    const input = inputArea.value;
    charCount.textContent = `${input.length} chars`;
    
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const selectedTemplate = templateSelect.value;
      const result = transformPrompt(input, selectedTemplate === 'auto' ? null : selectedTemplate);
      updateUI(result);
    }, 50);
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
  copyBtn.addEventListener('click', copyToClipboard);
  document.addEventListener('keydown', handleKeydown);

  if (window.electronAPI) {
    window.electronAPI.onFocusInput(() => {
      inputArea.focus();
      inputArea.select();
    });
  }

  handleInput();
});
