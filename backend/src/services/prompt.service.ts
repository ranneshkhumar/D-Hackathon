export class PromptService {
  /**
   * Compiles prompt templates by loading raw prompt guidelines and injecting variables
   * E.g. replacing {{businessName}} with context variables
   */
  static async loadAndCompile(templateName: string, variables: Record<string, any>): Promise<string> {
    console.log(`[PromptService] Loading prompt: ${templateName}`);

    // Skeleton loader: in later phases, this will read files from the src/prompts directory
    // and execute template placeholder swaps.
    let promptText = `Template: ${templateName}\n`;
    
    // Simple placeholder compiler
    for (const [key, value] of Object.entries(variables)) {
      const valStr = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      promptText += `Context [${key}]: ${valStr}\n`;
    }

    return promptText;
  }
}
