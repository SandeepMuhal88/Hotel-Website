import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';
import { conciergeChat } from '../services/localApi.js';

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! 🙏 I am Aanya, your AI Concierge for Las Cabanas Resort, Pushkar. How may I assist you today? Ask me about our swimming pool, organic breakfast, or local sightseeing!'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const data = await conciergeChat(query);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.text || "I'd be happy to assist! Call our front desk at +91 063672 76121 for immediate help."
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Namaste! For immediate assistance, please call our 24/7 Front Desk at +91 063672 76121.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group border-2 border-amber-300"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-extrabold text-xs uppercase tracking-wider hidden sm:inline">
            Aanya AI Host
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-80 sm:w-96 bg-white border border-amber-300 rounded-3xl shadow-2xl flex flex-col text-slate-900 overflow-hidden max-h-[550px] h-[80vh]">
          
          {/* Header */}
          <div className="bg-stone-50 p-4 border-b border-amber-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 flex items-center justify-center font-bold shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-sm">Aanya • AI Concierge</h4>
                <p className="text-[10px] text-emerald-700 font-bold">● Online • Las Cabanas Host</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-amber-800 p-1 rounded-full hover:bg-amber-100/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="p-2.5 bg-amber-50/50 border-b border-amber-200/80 flex items-center gap-1.5 overflow-x-auto text-[10px] text-stone-700 whitespace-nowrap">
            <button
              onClick={() => handleSendMessage("Tell me about the swimming pool")}
              className="px-2.5 py-1 bg-white hover:bg-amber-700 hover:text-white rounded-full transition-colors border border-stone-200 font-semibold shadow-xs"
            >
              🏊 Swimming Pool
            </button>
            <button
              onClick={() => handleSendMessage("What is included in the free breakfast?")}
              className="px-2.5 py-1 bg-white hover:bg-amber-700 hover:text-white rounded-full transition-colors border border-stone-200 font-semibold shadow-xs"
            >
              🍳 Free Breakfast
            </button>
            <button
              onClick={() => handleSendMessage("How far is Pushkar Lake from the resort?")}
              className="px-2.5 py-1 bg-white hover:bg-amber-700 hover:text-white rounded-full transition-colors border border-stone-200 font-semibold shadow-xs"
            >
              🕌 Pushkar Lake
            </button>
            <button
              onClick={() => handleSendMessage("Is the resort pet-friendly?")}
              className="px-2.5 py-1 bg-white hover:bg-amber-700 hover:text-white rounded-full transition-colors border border-stone-200 font-semibold shadow-xs"
            >
              🐶 Pet Policy
            </button>
          </div>

          {/* Messages Body */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 border border-amber-300 font-bold shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-700 text-white font-medium rounded-tr-none shadow-sm'
                      : 'bg-amber-50/60 border border-stone-200 text-slate-800 font-medium rounded-tl-none shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center shrink-0 border border-stone-300 font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-amber-900 text-xs italic font-semibold">
                <Bot className="w-4 h-4 text-amber-700 animate-spin" />
                <span>Aanya is typing response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-stone-50 border-t border-amber-200/80 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about cottages, pool, or menu..."
              className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-600"
            />
            <button
              type="submit"
              disabled={loading}
              className="p-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold shrink-0 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
