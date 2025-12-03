import React, { useState, useRef } from "react";
import { FaSpinner } from "react-icons/fa";

export default function MenuChatModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);

  const askBackend = async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResponse("Please type something before asking.");
      return;
    }

    setLoading(true);
    setResponse("");
    setError(null);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);

      const data = await res.json();
      setResponse(data.reply || "No reply received");
    } catch (err) {
      if (err.name === "AbortError") {
        console.log("Request cancelled");
      } else {
        console.error(err);
        setError("Backend is not reachable. Make sure Flask is running on port 5000.");
      }
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  };

  const handleClose = () => {
    if (controllerRef.current) controllerRef.current.abort();
    setQuery("");
    setResponse("");
    setError(null);
    setLoading(false);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-br from-pink-500 via-fuchsia-500 to-yellow-400 text-white rounded-full shadow-2xl flex items-center justify-center text-3xl border-4 border-white focus:outline-none focus:ring-4 focus:ring-pink-300 transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none group"
        aria-label="Open Menu Chat"
        style={{ boxShadow: '0 8px 32px 0 rgba(249, 168, 212, 0.35)' }}
      >
        <span className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-pink-300 via-fuchsia-200 to-yellow-200 opacity-40 blur-2xl animate-ping group-hover:opacity-0"></span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 relative z-10">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-3.5A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm p-4">
          <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md mx-auto flex flex-col overflow-hidden border-2 border-pink-100 animate-fade-in-up" style={{ minHeight: 480 }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 p-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8l-4 1 1-3.5A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                Menu Chatbot
              </h2>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-900 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-colors duration-200"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-br from-pink-50 via-fuchsia-50 to-yellow-50 flex flex-col gap-4">
              {/* User message bubble (if query exists) */}
              {query && (
                <div className="self-end max-w-[80%] bg-pink-500 text-white rounded-2xl px-5 py-3 shadow-md mb-2 animate-fade-in-up">
                  {query}
                </div>
              )}
              {/* Bot response bubble */}
              {response && !error && (
                <div className="self-start max-w-[80%] bg-white border border-pink-200 text-gray-800 rounded-2xl px-5 py-3 shadow-md animate-fade-in-up">
                  {response}
                </div>
              )}
              {/* Error bubble */}
              {error && (
                <div className="self-start max-w-[80%] bg-red-100 border border-red-300 text-red-800 rounded-2xl px-5 py-3 shadow-md animate-fade-in-up">
                  {error}
                </div>
              )}
            </div>
            {/* Input area */}
            <div className="bg-white dark:bg-gray-800 p-4 border-t border-pink-100 flex gap-2 items-center sticky bottom-0">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask something about the menu..."
                className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:text-gray-200 transition-shadow text-base"
                disabled={loading}
                onKeyPress={(e) => e.key === "Enter" && askBackend()}
              />
              <button
                onClick={askBackend}
                className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-yellow-400 text-white font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                    Ask
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
