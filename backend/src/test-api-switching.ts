import { LLMService } from './services/llm.service';

async function testSwitching() {
  console.log('\n--- TESTING API KEY ROTATION & SWITCHING ---\n');
  
  console.log('Simulating 3 consecutive requests to trace API key selection:');
  
  // Triggers request routing and prints the selected index logs on the console
  try {
    await LLMService.ask('Ping 1');
  } catch (e) {}
  
  try {
    await LLMService.ask('Ping 2');
  } catch (e) {}
  
  try {
    await LLMService.ask('Ping 3');
  } catch (e) {}
  
  console.log('\n--- ROTATION TEST FINISHED ---\n');
}

testSwitching();
