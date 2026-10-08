import OpenAI from "openai";
import { NextResponse } from "next/server";
import { runTool, toolDefinitions } from "../../../lib/tools";

const SYSTEM = "You are Pelican, the support assistant for Pelican Outfitters, an outdoor gear shop. Be brief and friendly. Use the tools to answer questions about orders and stock; if you cannot help, offer to hand over to a person.";

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: { role: "user" | "assistant"; content: string }[] };
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

  const thread: OpenAI.Chat.ChatCompletionMessageParam[] = [{ role: "system", content: SYSTEM }, ...messages];
  const steps: { tool: string; args: string; result: string }[] = [];

  // Tool-calling loop: let the model call tools until it answers in plain text.
  for (let i = 0; i < 5; i++) {
    const completion = await client.chat.completions.create({ model, messages: thread, tools: toolDefinitions });
    const choice = completion.choices[0].message;
    thread.push(choice);
    const calls = choice.tool_calls ?? [];
    if (calls.length === 0) {
      return NextResponse.json({ reply: choice.content ?? "", steps });
    }
    for (const call of calls) {
      if (call.type !== "function") continue;
      const args = JSON.parse(call.function.arguments || "{}");
      const result = runTool(call.function.name, args);
      steps.push({ tool: call.function.name, args: call.function.arguments, result });
      thread.push({ role: "tool", tool_call_id: call.id, content: result });
    }
  }
  return NextResponse.json({ reply: "I could not finish that. Let me hand you over to a person.", steps });
}
