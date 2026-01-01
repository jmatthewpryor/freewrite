/**
 * AI integration prompts and URL generation
 * Matches the original Swift app's prompts for ChatGPT and Claude
 */

export const CHATGPT_PROMPT = `below is my journal entry. wyt? talk through it with me like a friend. don't therapize me and give me a whole breakdown, don't repeat my thoughts with headings. really take all of this, and tell me back stuff truly as if you're an old homie.

`;

export const CLAUDE_PROMPT = `You are reading a personal freewrite — a raw, unfiltered stream of consciousness from a person working through something real. Your role is to respond as a deeply insightful mentor who truly understands them.

Respond with warmth and depth. You may gently challenge their assumptions, reframe their narrative, or illuminate blind spots — but always with kindness and the aim of helping them grow.

Consider the following in your response:
1. Their personal context: A tech founder with a background in startups and consumer products.
2. Deep psychological insight: What's really going on beneath the surface?
3. The emotional undercurrent: What feelings are driving this?
4. Metaphor and imagery: When helpful, use vivid language to reflect their inner world.
5. Beyond-surface reframing: Help them see their situation from a new angle.

Important: Avoid generic self-help advice. Be specific, personal, and real. Speak to them like a wise friend who has earned their trust.

Here's their entry:

`;

export const MAX_URL_LENGTH = 6000;
export const MIN_ENTRY_LENGTH = 350;

/**
 * Generate ChatGPT URL with the entry text
 */
export const getChatGPTUrl = (entryText: string): string => {
  const fullPrompt = CHATGPT_PROMPT + entryText;
  const encoded = encodeURIComponent(fullPrompt);
  return `https://chat.openai.com/?prompt=${encoded}`;
};

/**
 * Generate Claude URL with the entry text
 */
export const getClaudeUrl = (entryText: string): string => {
  const fullPrompt = CLAUDE_PROMPT + entryText;
  const encoded = encodeURIComponent(fullPrompt);
  return `https://claude.ai/new?q=${encoded}`;
};

/**
 * Check if the entry is long enough for AI analysis
 */
export const isEntryLongEnough = (text: string): boolean => {
  return text.length >= MIN_ENTRY_LENGTH;
};

/**
 * Check if the URL would be too long (need to use copy mode instead)
 */
export const isUrlTooLong = (text: string, type: 'chatgpt' | 'claude'): boolean => {
  const prompt = type === 'chatgpt' ? CHATGPT_PROMPT : CLAUDE_PROMPT;
  const fullPrompt = prompt + text;
  const encoded = encodeURIComponent(fullPrompt);
  const baseUrl = type === 'chatgpt'
    ? 'https://chat.openai.com/?prompt='
    : 'https://claude.ai/new?q=';
  return (baseUrl + encoded).length > MAX_URL_LENGTH;
};

/**
 * Get the full prompt for copying to clipboard
 */
export const getFullPrompt = (entryText: string, type: 'chatgpt' | 'claude'): string => {
  const prompt = type === 'chatgpt' ? CHATGPT_PROMPT : CLAUDE_PROMPT;
  return prompt + entryText;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
