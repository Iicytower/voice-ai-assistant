export enum OpenRouterModel {
  // Free models
  QWEN3_30B_FREE = 'qwen/qwen3-30b-a3b:free',
  QWEN3_0_6B_FREE = 'qwen/qwen3-0.6b-04-28:free',

  // Paid models
  CLAUDE_3_OPUS = 'anthropic/claude-3-opus-20240229',
  CLAUDE_3_SONNET = 'anthropic/claude-3-sonnet-20240229',
  CLAUDE_2_1 = 'anthropic/claude-2.1',
  GPT4_TURBO = 'openai/gpt-4-turbo-preview',
  GPT4 = 'openai/gpt-4',
  GPT35_TURBO = 'openai/gpt-3.5-turbo',
  MISTRAL_LARGE = 'mistral/mistral-large-latest',
  MISTRAL_MEDIUM = 'mistral/mistral-medium-latest',
  MISTRAL_SMALL = 'mistral/mistral-small-latest',
  GEMINI_PRO = 'google/gemini-pro',
}

export const FREE_MODELS = [
  OpenRouterModel.QWEN3_30B_FREE,
  OpenRouterModel.QWEN3_0_6B_FREE,
] as const;

// Model capabilities and context windows
export const MODEL_INFO = {
  [OpenRouterModel.QWEN3_30B_FREE]: {
    contextWindow: 40960,
    description: 'Powerful free model with 30B parameters, good for general tasks',
  },
  [OpenRouterModel.QWEN3_0_6B_FREE]: {
    contextWindow: 32000,
    description: 'Lightweight free model with 0.6B parameters, good for simple tasks',
  },
  [OpenRouterModel.CLAUDE_3_OPUS]: {
    contextWindow: 200000,
    description: 'Most powerful Claude model with extensive capabilities',
  },
  [OpenRouterModel.CLAUDE_3_SONNET]: {
    contextWindow: 200000,
    description: 'Balanced Claude model optimized for performance and cost',
  },
  [OpenRouterModel.CLAUDE_2_1]: {
    contextWindow: 100000,
    description: 'Previous generation Claude model',
  },
  [OpenRouterModel.GPT4_TURBO]: {
    contextWindow: 128000,
    description: 'Latest GPT-4 model with improved capabilities',
  },
  [OpenRouterModel.GPT4]: {
    contextWindow: 8192,
    description: 'Standard GPT-4 model',
  },
  [OpenRouterModel.GPT35_TURBO]: {
    contextWindow: 16385,
    description: 'Fast and cost-effective GPT-3.5 model',
  },
  [OpenRouterModel.MISTRAL_LARGE]: {
    contextWindow: 32768,
    description: 'Largest Mistral model with strong performance',
  },
  [OpenRouterModel.MISTRAL_MEDIUM]: {
    contextWindow: 32768,
    description: 'Mid-sized Mistral model balancing performance and cost',
  },
  [OpenRouterModel.MISTRAL_SMALL]: {
    contextWindow: 32768,
    description: 'Smallest Mistral model optimized for speed',
  },
  [OpenRouterModel.GEMINI_PRO]: {
    contextWindow: 32768,
    description: "Google's advanced model with strong reasoning capabilities",
  },
} as const;
