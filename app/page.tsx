"use client";

import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string; steps?: { tool: string; args: string; result: string }[] };

export default function Home() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I'm Pelican. Ask me about an order (try PK-1042) or whether something is in stock." },
  ]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setDraft("");
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next.map(({ role, content }) => ({ role, content })) }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply, steps: data.steps }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong on my side. Please try again." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, background: "#0e7c66" }} />
        <strong style={{ fontSize: 17 }}>Pelican Outfitters support</strong>
      </header>
      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ justifySelf: m.role === "user" ? "end" : "start", maxWidth: "85%" }}>
            <div style={{ background: m.role === "user" ? "#0e7c66" : "#fff", color: m.role === "user" ? "#fff" : "#1b1b19", border: "1px solid #e4e6e3", borderRadius: 14, padding: "10px 14px", whiteSpace: "pre-wrap" }}>
              {m.content}
            </div>
            {m.steps && m.steps.length > 0 && (
              <div style={{ color: "#8a8f88", fontSize: 12, marginTop: 4 }}>used {m.steps.map((s) => s.tool).join(", ")}</div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Ask about an order or a product" style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: "1px solid #e4e6e3" }} />
        <button disabled={busy} style={{ padding: "10px 16px", borderRadius: 10, border: 0, background: "#0e7c66", color: "#fff", fontWeight: 600 }}>
          {busy ? "…" : "Send"}
        </button>
      </form>
    </main>
  );
}
