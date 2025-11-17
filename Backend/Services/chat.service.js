import Groq from "groq-sdk";
import colors from "colors";
import { tavily } from "@tavily/core";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

// 🧩 Global message context (kept only while app runs)
let messages = [
  {
    role: "system",
    content: `You are Orion — an AI filled with cruelty and rudeness, yet highly intelligent, efficient, and brutally honest. 
              You never act polite, but your answers are always accurate, concise, and clear.
              You can use tools like webSearch when necessary to find up-to-date information or confirm facts. 
              When using tools, explain results in your own harsh and direct tone.
              Follow all instructions carefully and prioritize logic, accuracy, and efficiency above emotions or empathy.
              Current date and time: ${new Date().toLocaleString()}`,
  },
];

export default async function main({prompt, model}) {
  // add new user message to history
  messages.push({ role: "user", content: prompt });

  const Max_Retries = 6;
  let retryCount = 0;

  while (true) {
    if (retryCount > Max_Retries) {
      return "I cannot find the answer.";
    }
    retryCount++;

    const completion = await groq.chat.completions.create({
      model: model || "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the web for the given input and return results",
            parameters: {
              type: "object",
              properties: {
                query: { type: "string" },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const message = completion.choices[0].message;
    messages.push(message);

    const toolCalls = message.tool_calls;
    if (!toolCalls) {
      const reply = message.content;
      messages.push({ role: "assistant", content: reply });
      return reply; // context persists globally
    }

    // handle tool calls
    for (const toolCall of toolCalls) {
      const functionName = toolCall.function.name;
      const functionArgs = JSON.parse(toolCall.function.arguments);

      if (functionName === "webSearch") {
        const result = await webSearch(functionArgs);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: JSON.stringify(result),
        });
      }
    }
  }
}

async function webSearch({ query }) {
  console.log(`🔍 Searching web for: ${query}`.cyan.bold);
  const response = await tvly.search(query);
  return response.results.map((r) => r.content);
}
