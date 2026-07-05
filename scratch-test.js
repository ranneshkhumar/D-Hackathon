const { Ollama } = require('ollama');
const { fetch: undiciFetch, Agent } = require('undici');

const customAgent = new Agent({
  headersTimeout: 300000, // 5 minutes
  bodyTimeout: 300000,    // 5 minutes
});

const customFetch = (input, init) => {
  return undiciFetch(input, {
    ...init,
    dispatcher: customAgent,
  });
};

const ollama = new Ollama({
  host: 'http://127.0.0.1:11434',
  fetch: customFetch
});

async function run() {
  try {
    console.log("Sending chat request with customFetch (5-minute timeout) to gemma4:latest...");
    const response = await ollama.chat({
      model: 'gemma4:latest',
      messages: [{ role: 'user', content: 'Respond with exactly "Hello world".' }],
    });
    console.log("Response:", response.message.content);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

run();
