/**
 * Prompt Transformer
 * Input sanitization and pipeline orchestration
 */

import { classifyIntent } from './classifier.js';
import { getTemplate, populateTemplate } from './templates.js';

/**
 * Sanitize user input to prevent injection and normalize formatting
 * @param {string} input - Raw user input
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();

  // Normalize excessive whitespace (preserve single line breaks)
  sanitized = sanitized.replace(/[ \t]+/g, ' ');
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  // Remove potential injection patterns (system prompt overrides)
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

/**
 * Transform raw input into an optimized prompt
 * @param {string} rawInput - User's original input
 * @returns {{ 
 *   optimizedPrompt: string, 
 *   metadata: { 
 *     intent: string, 
 *     confidence: number, 
 *     templateName: string,
 *     inputLength: number,
 *     outputLength: number,
 *     processingTimeMs: number
 *   } 
 * }}
 */
export function transformPrompt(rawInput) {
  const startTime = performance.now();

  // Step 1: Sanitize input
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
        processingTimeMs: 0
      }
    };
  }

  // Step 2: Classify intent
  const { intent, confidence, matchedBy } = classifyIntent(cleanInput);

  // Step 3: Get appropriate template
  const template = getTemplate(intent);

  // Step 4: Populate template with input
  const optimizedPrompt = populateTemplate(template.template, {
    input: cleanInput
  });

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
      processingTimeMs: Math.round((endTime - startTime) * 100) / 100
    }
  };
}
