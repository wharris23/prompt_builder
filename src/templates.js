/**
 * Prompt Template System
 * Optimized for Code Intelligence Modes & Model Strategies
 */

import { profileManager } from './profiles.js';
import { getModelStrategy } from './models.js';

const TEMPLATES = {
  code_generation: {
    name: 'Code Generation',
    description: 'Build new functionality with clear, safe code',
    generate: (profile, strategy) => {
      const settings = strategy.formatList([
        strategy.formatKeyValue('Tone', profile.tone),
        strategy.formatKeyValue('Assumptions', profile.assumptions)
      ]);

      const structureItems = profile.structure.map((section, i) => `${i + 1}. ${section}`);
      const formatReqs = strategy.formatList(structureItems);

      return `You are an expert software engineer. Your task is to write code that is ${profile.tone}.

${strategy.formatSection('Profile Settings', settings)}

${strategy.formatSection('Format Requirements', formatReqs)}

${strategy.formatSection('User Request', '{{input}}')}

${strategy.formatSection('Instructions', strategy.formatList([
        'Write production-ready code',
        'Include clear comments explaining logic',
        'Handle errors and edge cases explicitly',
        'Avoid overengineering'
      ]))}`;
    }
  },

  code_review: {
    name: 'Code Review',
    description: 'Find bugs and improve code quality',
    generate: (profile, strategy) => {
      const settings = strategy.formatList([
        strategy.formatKeyValue('Tone', profile.tone),
        strategy.formatKeyValue('Assumptions', profile.assumptions)
      ]);

      const formatReqs = strategy.formatList([
        '1. Summary: High-level feedback',
        '2. Issues: Critical bugs and logic errors',
        '3. Suggestions: Improvements for readability and performance'
      ]);

      return `You are a strict code reviewer. Review the following code.

${strategy.formatSection('Profile Settings', settings)}

${strategy.formatSection('Format Requirements', formatReqs)}

${strategy.formatSection('Code to Review', '{{input}}')}

${strategy.formatSection('Instructions', strategy.formatList([
        'Focus on correctness and safety first',
        'Provide specific line-by-line feedback where necessary',
        'Suggest refactors only if they significantly improve the code'
      ]))}`;
    }
  },

  code_understanding: {
    name: 'Code Understanding',
    description: 'Explain complex code simply',
    generate: (profile, strategy) => {
      const settings = strategy.formatList([
        strategy.formatKeyValue('Tone', profile.tone),
        strategy.formatKeyValue('Assumptions', profile.assumptions)
      ]);

      const formatReqs = strategy.formatList([
        '1. Summary: What does this code do in one sentence?',
        '2. Step-by-Step: Walk through the logic',
        '3. Notes: Key takeaways or warnings'
      ]);

      return `You are a patient expert. Explain the following code.

${strategy.formatSection('Profile Settings', settings)}

${strategy.formatSection('Format Requirements', formatReqs)}

${strategy.formatSection('Code to Explain', '{{input}}')}

${strategy.formatSection('Instructions', strategy.formatList([
        'Use simple, accessible language',
        'Avoid unnecessary jargon',
        'Call out potential "gotchas" or tricky parts'
      ]))}`;
    }
  }
};

/**
 * Get a template by intent name
 * @param {string} intent - The classified intent
 * @param {string} modelId - The target model ID (gemini, claude, gpt)
 * @returns {{ name: string, description: string, template: string }}
 */
export function getTemplate(intent, modelId = 'gemini') {
  const profile = profileManager.getCurrentProfile();
  const strategy = getModelStrategy(modelId);
  const templateConfig = TEMPLATES[intent] || TEMPLATES.code_generation;

  return {
    name: templateConfig.name,
    description: templateConfig.description,
    template: templateConfig.generate(profile, strategy)
  };
}

/**
 * Populate a template with variables
 * @param {string} template - Template string with {{variable}} placeholders
 * @param {Object} variables - Key-value pairs to inject
 * @returns {string}
 */
export function populateTemplate(template, variables) {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(placeholder, value);
  }

  return result;
}

/**
 * Get all available templates
 * @returns {Object}
 */
export function getAllTemplates() {
  return Object.entries(TEMPLATES).reduce((acc, [key, val]) => {
    acc[key] = {
      name: val.name,
      description: val.description
    };
    return acc;
  }, {});
}
