import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '@/types';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const GeminiService = {
  async ask(prompt: string, messages: Message[] = []): Promise<string> {
    if (!apiKey) {
      // Return a premium mock response if the key is missing, so the prototype remains functional and readable
      return `### 💡 Notice: Demonstration Mode (API Key Missing)
Your \`NEXT_PUBLIC_GEMINI_API_KEY\` is not configured in your environment.
To experience real AI-generated strategies, create a \`.env.local\` file in the root of the project with:
\`\`\`env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
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
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.5-flash',
        systemInstruction: `You are the Business Growth Operating System Assistant (Version 1 Prototype). 
You act as a premium, highly strategic, professional executive business advisor. 
You provide structured, high-value, and actionable executive recommendations, marketing/operational blueprints, and financial insights.
Always respond in clear, beautiful Markdown. Use bullet points, headers, bold text, and code blocks where appropriate.
Adopt a confident, authoritative, helpful, and executive tone.`
      });

      // Format previous history for Gemini Chat. Map roles from user/assistant to user/model.
      // Take up to the last 10 messages for context window stability.
      const formattedHistory = messages
        .slice(-10)
        .map(m => ({
          role: m.role === 'user' ? 'user' as const : 'model' as const,
          parts: [{ text: m.content }]
        }));

      const chat = model.startChat({
        history: formattedHistory,
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      return response.text();
    } catch (error: unknown) {
      console.error('Gemini API error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `### ⚠️ Connection Error
An error occurred while communicating with the Gemini Service.

**Details**: ${errorMessage}`;
    }
  }
};
