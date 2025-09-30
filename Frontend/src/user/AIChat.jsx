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
        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
      >
        Open Menu Chat
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm p-4">
          <div className="relative bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 scale-95 md:scale-100">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <h2 className="text-3xl font-extrabold text-pink-600 dark:text-pink-500 mb-6 text-center">
              Ask about the Menu 💬
            </h2>

            <div className="space-y-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask something about the menu..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-gray-200 transition-shadow"
                disabled={loading}
                onKeyPress={(e) => e.key === "Enter" && askBackend()}
              />

              <button
                onClick={askBackend}
                className="w-full bg-pink-600 text-white font-semibold py-3 rounded-lg hover:bg-pink-700 transition-colors duration-300 disabled:bg-pink-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Loading...
                  </>
                ) : (
                  "Ask"
                )}
              </button>

              {response && !error && (
                <div className="mt-4 p-4 text-sm bg-pink-50 dark:bg-pink-900 border border-pink-200 dark:border-pink-700 rounded-lg text-gray-800 dark:text-gray-200 whitespace-pre-wrap animate-fade-in-up">
                  {response}
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 text-sm bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg text-red-800 dark:text-red-200 whitespace-pre-wrap animate-fade-in-up">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
