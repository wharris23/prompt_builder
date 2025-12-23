/**
 * Intent Classifier - Code Intelligence
 * Specialized classification for coding tasks
 */

const INTENT_PATTERNS = {
  code_review: {
    keywords: ['review', 'check', 'audit', 'optimize', 'refactor', 'smell', 'bugs', 'issues', 'critique'],
    patterns: [
      /\b(review|check|audit|critique)\s+(this|my)?\s*code/i,
      /\b(find|spot)\s+(bugs|issues|errors)/i,
      /\bhow\s+can\s+i\s+(improve|optimize)\s+this/i,
      /\b(is|are)\s+there\s+any\s+(bugs|issues)/i,
    ],
    weight: 1.5
  },

  code_understanding: {
    keywords: ['explain', 'understand', 'what does', 'how does', 'meaning', 'analyze', 'walk me through'],
    patterns: [
      /\b(explain|describe)\s+(this|the)\s+(code|function|class|snippet)/i,
      /\bwhat\s+(does|do)\s+(this|the)\s+(code|function|do)/i,
      /\bhelp\s+me\s+understand/i,
      /\bwalk\s+me\s+through/i,
    ],
    weight: 1.4
  },

  code_generation: {
    keywords: ['write', 'create', 'build', 'implement', 'make', 'generate', 'bug', 'fix', 'develop'],
    patterns: [
      /\b(write|create|build|make|implement)\s+(a|an|some)\s+/i,
      /\bhow\s+to\s+/i,
      /\b(fix|solve|debug)\s+/i, // "Fix" often implies writing new code
    ],
    weight: 1.0 // Default fallback for coding queries
  }
};

/**
 * Classify user input into a coding intent category
 * @param {string} input - Raw user input
 * @returns {{ intent: string, confidence: number, matchedBy: string }}
 */
export function classifyIntent(input) {
  if (!input || typeof input !== 'string') {
    return { intent: 'code_generation', confidence: 0, matchedBy: 'fallback' };
  }

  const normalizedInput = input.toLowerCase().trim();
  const scores = {};

  for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    let matchType = null;

    // Check regex patterns
    for (const pattern of config.patterns) {
      if (pattern.test(input)) {
        score += 3;
        matchType = 'pattern';
      }
    }

    // Check keywords
    for (const keyword of config.keywords) {
      if (normalizedInput.includes(keyword)) {
        score += 1;
        if (!matchType) matchType = 'keyword';
      }
    }

    // Apply weight
    score *= config.weight;

    if (score > 0) {
      scores[intent] = { score, matchType };
    }
  }

  // Find highest scoring intent
  const entries = Object.entries(scores);
  if (entries.length === 0) {
    // Default to code generation for unmatched inputs as per "Code Intelligence" focus
    return { intent: 'code_generation', confidence: 0.1, matchedBy: 'default' };
  }

  entries.sort((a, b) => b[1].score - a[1].score);
  const [topIntent, { score, matchType }] = entries[0];

  const confidence = Math.min(score / 5, 1);

  return {
    intent: topIntent,
    confidence: Math.round(confidence * 100) / 100,
    matchedBy: matchType
  };
}

/**
 * Get all available intent categories
 * @returns {string[]}
 */
export function getIntentCategories() {
  return Object.keys(INTENT_PATTERNS);
}
