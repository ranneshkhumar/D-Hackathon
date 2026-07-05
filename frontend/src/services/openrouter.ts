import { Message } from '@/types';

const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const model = process.env.NEXT_PUBLIC_OPENROUTER_MODEL || 'google/gemini-2.5-flash';

export const OpenRouterService = {
  async ask(prompt: string, messages: Message[] = []): Promise<string> {
    if (!apiKey) {
      // Return a premium mock response if the key is missing, so the prototype remains functional and readable
      return `### 💡 Notice: Demonstration Mode (API Key Missing)
Your \`NEXT_PUBLIC_OPENROUTER_API_KEY\` is not configured in your environment.
To experience real AI-generated strategies, create a \`.env.local\` file in the root of the frontend folder with:
\`\`\`env
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_OPENROUTER_MODEL=google/gemini-2.5-flash
\`\`\`

---

### Executive Analysis: "${prompt}"

As the **Business Growth Operating System**, here is the strategic recommendation:

1. **Strategic Prioritization**
   - Perform an objective audit of current operations.
   - Establish high-leverage key performance indicators (KPIs) to track marketing and sales convergence.

2. **AI Workspace Activation**
   - Once specializations (CEO, Marketing, Finance, Sales) are operational, assign autonomous agents to crawl marketing metrics.
   - Use centralized Business Memory to build cross-departmental knowledge sharing.

3. **Financial Alignment**
   - Audit operational overhead. Shift resource allocation to customer-acquisition workflows.
   - Track monthly recurring revenue metrics via real-time intelligence feeds.`;
    }

    try {
      // Format history for chat context. OpenRouter uses standard chat message arrays.
      const formattedHistory = messages
        .slice(-10)
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: m.content
        }));

      const systemInstruction = `You are the Business Growth Operating System Assistant (Version 1 Prototype). 
You act as a premium, highly strategic, professional executive business advisor. 
You provide structured, high-value, and actionable executive recommendations, marketing/operational blueprints, and financial insights.
Always respond in clear, beautiful Markdown. Use bullet points, headers, bold text, and code blocks where appropriate.
Adopt a confident, authoritative, helpful, and executive tone.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/ranneshkhumar/D-Hackathon',
          'X-Title': 'Aegis OS'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemInstruction },
            ...formattedHistory,
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API responded with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'Empty response from OpenRouter.';
    } catch (error: unknown) {
      console.error('OpenRouter API error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `### ⚠️ Connection Error
An error occurred while communicating with the OpenRouter Service.

**Details**: ${errorMessage}`;
    }
  }
};
