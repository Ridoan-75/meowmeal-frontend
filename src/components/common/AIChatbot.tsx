"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, User, Sparkles, Bot } from "lucide-react";
import Image from "next/image";
import api from "@/lib/axios";
import { usePathname } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I am MeowMeal AI assistant. I can help you find meals, suggest restaurants, or answer any food-related questions. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!loading && open) inputRef.current?.focus();
  }, [loading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  if (pathname === "/login" || pathname === "/register") return null;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
      const res = await api.post("/ai/chat", {
        message: userMessage,
        conversationHistory: messages,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.data.message }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I could not process your request. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Chat Window ── */}
      {open && (
        <div className="fixed bottom-32 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-card border border-border rounded-3xl shadow-2xl shadow-primary/10 flex flex-col overflow-hidden max-h-[60vh]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 rounded-full overflow-hidden border-2 border-white/30">
                <Image src="/chatbot.png" alt="MeowMeal AI" fill className="object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-white font-bold text-sm">MeowMeal AI</p>
                  <Sparkles className="h-3 w-3 text-white/80" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-white/70 text-[10px]">Always here to help</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-7 w-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0"
            style={{ overscrollBehavior: "contain" }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${msg.role === "assistant" ? "bg-primary/10" : "bg-secondary"}`}>
                  {msg.role === "assistant" ? (
                    <Image src="/chatbot.png" alt="AI" width={28} height={28} className="rounded-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === "assistant" ? "bg-secondary text-foreground rounded-tl-none" : "bg-primary text-white rounded-tr-none"}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                  <Image src="/chatbot.png" alt="AI" width={28} height={28} className="rounded-full object-cover" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-tl-none px-3 py-2">
                  <div className="flex gap-1 items-center h-4">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex items-center gap-2 shrink-0 bg-card">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about food..."
              disabled={loading}
              className="flex-1 h-10 px-3 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary transition-all disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shrink-0 hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* ── Toggle Button ── */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end gap-2">
        {/* Button */}
        <button
          onClick={() => setOpen(!open)}
          className="relative h-16 w-16 rounded-2xl flex items-center justify-center transition-all hover:scale-110 overflow-visible"
        >
          {/* Ping rings */}
          {!open && (
            <>
              <span className="absolute inset-0 rounded-2xl bg-primary/25 animate-ping" />
              <span className="absolute inset-1 rounded-2xl bg-primary/15 animate-pulse" />
            </>
          )}

          {/* Main button */}
          <div className={`relative z-10 h-16 w-16 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 transition-all duration-300 overflow-hidden ${open ? "bg-primary" : "bg-primary"}`}>
            {open ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Image
                src="/chatbot.png"
                alt="MeowMeal AI"
                fill
                className="object-cover"
              />
            )}
          </div>

          {/* AI badge */}
          {!open && (
            <div className="absolute -top-2 -right-2 z-20 bg-accent text-accent-foreground text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md">
              AI
            </div>
          )}
        </button>
      </div>
    </>
  );
}