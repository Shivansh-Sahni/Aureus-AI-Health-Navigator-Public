"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Send, ThumbsUp, ThumbsDown, RotateCcw, AlertTriangle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  isEmergency?: boolean;
  feedbackGiven?: "up" | "down" | null;
};

function OwlMascot({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#0F4C81" />
      <ellipse cx="35" cy="45" rx="12" ry="14" fill="#E8F4F8" />
      <ellipse cx="65" cy="45" rx="12" ry="14" fill="#E8F4F8" />
      <circle cx="35" cy="47" r="6" fill="#333333" />
      <circle cx="65" cy="47" r="6" fill="#333333" />
      <circle cx="37" cy="45" r="2" fill="#FFFFFF" />
      <circle cx="67" cy="45" r="2" fill="#FFFFFF" />
      <path d="M45 62 L50 70 L55 62" fill="#B31942" stroke="#B31942" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 25 Q35 15 45 28" fill="none" stroke="#0F4C81" strokeWidth="4" />
      <path d="M70 25 Q65 15 55 28" fill="none" stroke="#0F4C81" strokeWidth="4" />
      <ellipse cx="35" cy="30" rx="3" ry="4" fill="#E8F4F8" />
      <ellipse cx="65" cy="30" rx="3" ry="4" fill="#E8F4F8" />
    </svg>
  );
}

function EmergencyBanner({ onDismiss }: { onDismiss: () => void }) {
  const [confirmingDismiss, setConfirmingDismiss] = useState(false);

  return (
    <div 
      role="alert" 
      aria-live="assertive"
      className="bg-[#DC2626] text-white p-4 flex items-start gap-3 animate-fade-in"
    >
      <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <p className="font-bold text-lg mb-1">EMERGENCY ALERT</p>
        <p className="text-sm leading-relaxed">
          If you or someone with you is experiencing a life-threatening medical or mental health emergency, 
          please call <strong>911</strong> or go to the nearest emergency room now. 
          For immediate crisis counseling, call or text <strong>988</strong>.
        </p>
      </div>
      {!confirmingDismiss ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setConfirmingDismiss(true)}
          className="text-white hover:bg-white/20 flex-shrink-0"
          aria-label="Dismiss emergency alert"
        >
          <X className="w-5 h-5" />
        </Button>
      ) : (
        <div className="flex flex-col gap-2 flex-shrink-0">
          <p className="text-xs">Was this a false alarm?</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onDismiss}
              className="text-white border-white hover:bg-white/20 text-xs px-2 py-1"
            >
              Yes, dismiss
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setConfirmingDismiss(false)}
              className="text-white hover:bg-white/20 text-xs px-2 py-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatMessage(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, lineIndex) => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    while ((match = linkRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      parts.push(
        <a
          key={`link-${lineIndex}-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0F4C81] hover:text-[#3C3B6E] underline font-medium"
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }
    
    if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(
        <li key={lineIndex} className="ml-4 mb-1">
          {parts.length > 0 ? parts : line.slice(2)}
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<br key={lineIndex} />);
    } else {
      elements.push(
        <p key={lineIndex} className="mb-2">
          {parts.length > 0 ? parts : line}
        </p>
      );
    }
  });
  
  return <div className="prose prose-sm max-w-none">{elements}</div>;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        role: "assistant",
        content: "Hello! I'm Sam the Owl, your guide to finding verified healthcare resources. I'm here to help veterans, rural communities, and individuals with disabilities connect with the care they need.\n\nTo get started, please tell me:\n- What type of healthcare service are you looking for?\n- Your ZIP code or city/state\n\nI'll search our verified database and provide you with relevant resources."
      }]);
    }
  }, [messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();

      if (data.isEmergency) {
        setShowEmergencyBanner(true);
      }

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: "assistant",
        content: data.message || data.error || "I apologize, but I encountered an error. Please try again.",
        isEmergency: data.isEmergency
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      setMessages(prev => [...prev, {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment."
      }]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFeedback = async (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, feedbackGiven: helpful ? "up" : "down" } : m
    ));

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, messageId, helpful })
      });
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setShowEmergencyBanner(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
        {showEmergencyBanner && (
          <EmergencyBanner onDismiss={() => setShowEmergencyBanner(false)} />
        )}
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <OwlMascot className="w-10 h-10" />
            <div>
              <span className="text-lg font-bold text-[#0F4C81] block" style={{ fontFamily: "'Libre Baskerville', serif" }}>
                Aureus
              </span>
              <span className="text-xs text-[#6B7280]">AI Health Navigator</span>
            </div>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={startNewConversation}
            className="text-[#0F4C81] border-[#0F4C81] hover:bg-[#E8F4F8]"
            aria-label="Start new conversation"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>
        <div className="bg-[#FEF3C7] px-4 py-2 text-center text-sm text-[#92400E]">
          <strong>Disclaimer:</strong> Aureus does not provide medical advice, diagnoses, or treatment recommendations. 
          Always consult qualified healthcare professionals.
        </div>
      </header>

      <main 
        className="flex-1 overflow-y-auto pb-32"
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
      >
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[#E8F4F8] text-[#333333] rounded-br-md"
                    : "bg-white border border-[#E5E7EB] text-[#333333] rounded-bl-md shadow-sm"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#E5E7EB]">
                    <OwlMascot className="w-6 h-6" />
                    <span className="text-sm font-medium text-[#0F4C81]">Sam the Owl</span>
                  </div>
                )}
                <div className="text-sm leading-relaxed">
                  {formatMessage(message.content)}
                </div>
                {message.role === "assistant" && message.id !== "welcome" && (
                  <div className="mt-3 pt-2 border-t border-[#E5E7EB] flex items-center gap-2">
                    <span className="text-xs text-[#6B7280]">Was this helpful?</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(message.id, true)}
                      disabled={message.feedbackGiven !== undefined}
                      className={`p-1 h-auto ${message.feedbackGiven === "up" ? "text-[#059669]" : "text-[#6B7280] hover:text-[#059669]"}`}
                      aria-label="Mark as helpful"
                      aria-pressed={message.feedbackGiven === "up"}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(message.id, false)}
                      disabled={message.feedbackGiven !== undefined}
                      className={`p-1 h-auto ${message.feedbackGiven === "down" ? "text-[#DC2626]" : "text-[#6B7280] hover:text-[#DC2626]"}`}
                      aria-label="Mark as not helpful"
                      aria-pressed={message.feedbackGiven === "down"}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-fade-in">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <OwlMascot className="w-6 h-6" />
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Sam is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message... (e.g., 'I need mental health services near 90210')"
              className="flex-1 min-h-[44px] max-h-32 resize-none border-[#E5E7EB] focus:border-[#0F4C81] focus:ring-[#0F4C81] rounded-xl"
              disabled={isLoading}
              aria-label="Message input"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-[#0F4C81] hover:bg-[#3C3B6E] text-white h-11 px-4 rounded-xl"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-[#6B7280] text-center mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </footer>
    </div>
  );
}
