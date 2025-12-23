/**
 * Model Strategies
 * Defines formatting rules for different LLMs
 */

const STRATEGIES = {
    markdown: {
        formatSection: (title, content) => `## ${title}\n${content}`,
        formatList: (items) => items.map(item => `- ${item}`).join('\n'),
        formatKeyValue: (key, value) => `- **${key}**: ${value}`
    },
    xml: {
        formatSection: (title, content) => {
            const tag = title.toLowerCase().replace(/\s+/g, '_');
            return `<${tag}>\n${content}\n</${tag}>`;
        },
        formatList: (items) => items.map(item => `<item>${item}</item>`).join('\n'),
        formatKeyValue: (key, value) => `<${key.toLowerCase().replace(/\s+/g, '_')}>${value}</${key.toLowerCase().replace(/\s+/g, '_')}>`
    }
};

export const MODELS = {
    gemini: {
        name: 'Gemini 1.5 Pro',
        strategy: 'markdown'
    },
    claude: {
        name: 'Claude 3.5 Sonnet',
        strategy: 'xml'
    },
    gpt: {
        name: 'GPT-4o',
        strategy: 'markdown'
    }
};

/**
 * Get the formatting strategy for a specific model
 * @param {string} modelId 
 * @returns {Object} Strategy object with format functions
 */
export function getModelStrategy(modelId) {
    const model = MODELS[modelId] || MODELS.gemini;
    return STRATEGIES[model.strategy];
}

/**
 * Get all available models
 * @returns {Object}
 */
export function getModels() {
    return MODELS;
}
