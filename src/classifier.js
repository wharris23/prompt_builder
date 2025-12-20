/**
 * Intent Classifier - Level 1 (Regex/Keyword)
 * Deterministic classification of user input into prompt categories
 */

const INTENT_PATTERNS = {
  coding: {
    keywords: ['code', 'function', 'bug', 'error', 'implement', 'debug', 'fix', 'program', 'script', 'api', 'database', 'algorithm', 'class', 'method', 'variable', 'syntax', 'compile', 'runtime'],
    patterns: [
      /\b(write|create|build|make)\s+(a\s+)?(function|class|script|program|code)/i,
      /\b(how\s+to|how\s+do\s+i)\s+(code|implement|program|write)/i,
      /\b(fix|debug|solve)\s+(this|the|my)?\s*(error|bug|issue|problem)/i,
      /```[\s\S]*```/,  // Code blocks
      /\b(python|javascript|java|c\+\+|rust|go|typescript|sql|html|css)\b/i,
    ],
    weight: 1.2
  },
  
  explanation: {
    keywords: ['explain', 'what is', 'how does', 'why', 'describe', 'define', 'meaning', 'understand', 'concept', 'difference between', 'compare'],
    patterns: [
      /\b(what|how|why)\s+(is|does|are|do|did|would|should|can)/i,
      /\bexplain\s+(to\s+me\s+)?(how|what|why|the)/i,
      /\b(can\s+you\s+)?(describe|define|clarify)/i,
      /\bdifference\s+between\b/i,
    ],
    weight: 1.0
  },
  
  creative: {
    keywords: ['write', 'story', 'poem', 'creative', 'imagine', 'fiction', 'narrative', 'character', 'plot', 'dialogue', 'essay', 'article', 'blog'],
    patterns: [
      /\b(write|create|compose)\s+(a\s+)?(story|poem|essay|article|song|script|dialogue)/i,
      /\bimagine\s+(a|that|if)/i,
      /\b(creative|fiction|narrative)\s+writing/i,
      /\bonce\s+upon\s+a\s+time/i,
    ],
    weight: 1.1
  },
  
  analysis: {
    keywords: ['analyze', 'evaluate', 'assess', 'review', 'critique', 'pros and cons', 'advantages', 'disadvantages', 'strengths', 'weaknesses', 'compare', 'contrast'],
    patterns: [
      /\b(analyze|evaluate|assess|review)\s+(this|the|my)/i,
      /\b(pros\s+and\s+cons|advantages\s+and\s+disadvantages)/i,
      /\b(what\s+are\s+the\s+)(strengths|weaknesses|benefits|drawbacks)/i,
      /\bcompare\s+and\s+contrast/i,
    ],
    weight: 1.0
  }
};

/**
 * Classify user input into an intent category
 * @param {string} input - Raw user input
 * @returns {{ intent: string, confidence: number, matchedBy: string }}
 */
export function classifyIntent(input) {
  if (!input || typeof input !== 'string') {
    return { intent: 'general', confidence: 0, matchedBy: 'fallback' };
  }

  const normalizedInput = input.toLowerCase().trim();
  const scores = {};

  for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
    let score = 0;
    let matchType = null;

    // Check regex patterns first (higher confidence)
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
    return { intent: 'general', confidence: 0, matchedBy: 'fallback' };
  }

  entries.sort((a, b) => b[1].score - a[1].score);
  const [topIntent, { score, matchType }] = entries[0];

  // Normalize confidence to 0-1 range (cap at 10 for max score)
  const confidence = Math.min(score / 10, 1);

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
  return [...Object.keys(INTENT_PATTERNS), 'general'];
}
