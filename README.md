# pelican

Pelican is the support chat of a small outdoor gear shop: a chat page and an API route where an LLM assistant answers questions about orders and stock, calling two tools (`lookup_order`, `check_stock`) against in-memory data.

**Stack:** Next.js 15 (App Router, TypeScript) + the OpenAI SDK

It is intentionally small.

## Layout

- `app/page.tsx` the chat UI
- `app/api/chat/route.ts` the assistant: system prompt, tool-calling loop (up to five rounds), plain-text answer
- `lib/tools.ts` the two tools and the sample data

## Key user actions

send a message · assistant answers · assistant calls a tool · hand-over to a person

## Running it

```bash
npm install
cp .env.example .env.local   # add OPENAI_API_KEY
npm run dev                  # http://localhost:3000
```
