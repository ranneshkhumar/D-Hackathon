import { LLMService } from './services/llm.service';
import { config } from './config';

async function testJson() {
  console.log('Testing askJson with model:', config.OPENROUTER_MODEL);
  try {
    const result = await LLMService.askJson<any>(
      'Return a JSON object with a single field "success" set to true.',
      'You are a helpful assistant.'
    );
    console.log('JSON test succeeded! Result:', result);
  } catch (error) {
    console.error('JSON test failed with error:', error);
  }
}

testJson();
