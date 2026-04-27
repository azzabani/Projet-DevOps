"use client";

import { useState, useRef, useEffect } from "react";

export default function ProfessionalChat() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ sender: "user" | "bot"; text: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages([...messages, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: "bot", text: data.reply || "Aucune réponse" }]);
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "❌ Erreur serveur" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-indigo-600 text-white text-xl font-bold p-4 shadow-md text-center">
        💬 Auto Excellence Chat
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col space-y-4 h-full justify-center items-center px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenue! 👋</h2>
              <p className="text-gray-600">Posez vos questions sur nos véhicules</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {[
                { icon: "🚗", text: "Quels véhicules avez-vous?" },
                { icon: "💰", text: "Quels sont les tarifs?" },
                { icon: "📋", text: "Comment acheter une voiture?" },
                { icon: "🔧", text: "Avez-vous un service après-vente?" },
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(suggestion.text);
                    setMessages([{ sender: "user", text: suggestion.text }]);
                  }}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg hover:scale-105 transition-all border-2 border-orange-200 text-left cursor-pointer"
                >
                  <span className="text-2xl block mb-2">{suggestion.icon}</span>
                  <p className="text-sm font-semibold text-gray-800">{suggestion.text}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`max-w-[75%] p-3 rounded-2xl shadow-sm break-words ${
                  msg.sender === "user"
                    ? "self-end bg-orange-500 text-white rounded-br-none"
                    : "self-start bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex p-4 bg-white border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Posez votre question..."
          className="flex-1 border border-gray-300 rounded-l-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-orange-600 text-white px-5 py-2 rounded-r-2xl hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </div>
    </div>
  );
}
