'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [clonedHTML, setClonedHTML] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const saved = localStorage.getItem('darkMode');
    setDarkMode(saved ? JSON.parse(saved) : isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleClone = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setError('');
    setLoading(true);
    setClonedHTML('');
    const BACKEND_URL = 'https://web-cloner-4.onrender.com';

    try {
      const scrapeRes = await fetch(`${BACKEND_URL}/scrape/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!scrapeRes.ok) throw new Error('Failed to scrape website');
      const scrapeData = await scrapeRes.json();

      const cloneRes = await fetch(`${BACKEND_URL}/clone/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: scrapeData.html, stylesheets: scrapeData.stylesheets }),
      });

      if (!cloneRes.ok) throw new Error('Failed to clone website');
      const cloneData = await cloneRes.json();
      setClonedHTML(cloneData.cloned_html);
    } catch  {
      setError('An error occurred while cloning the website');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen transition-colors duration-300">
      <div className="bg-gradient-to-br from-rose-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                <span>🌸</span>
                <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-transparent bg-clip-text">
                  Orchid Cloner
                </span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Clone any website with a single click</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>

          {/* Input section */}
          <div className="space-y-4 mb-8">
            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 text-lg border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              onClick={handleClone}
              disabled={loading}
              className={`w-full py-3 text-lg font-semibold text-white rounded-lg shadow-md transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
              } flex justify-center items-center gap-2`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Cloning...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                    <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                  </svg>
                  Clone Website
                </>
              )}
            </button>
          </div>

          {/* Placeholder / Result box */}
          {!clonedHTML && !loading && (
            <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-400 dark:border-gray-600 p-6 text-center text-gray-500 dark:text-gray-400 rounded-lg">
              🔍 Your cloned HTML will appear here...
            </div>
          )}

          {loading && (
            <div className="animate-bounce p-4 bg-white dark:bg-gray-800 border border-purple-300 dark:border-purple-700 text-center text-purple-500 rounded-lg shadow-inner mt-6">
              ✨ Cloning in progress...
            </div>
          )}

          {/* Cloned Output */}
          {clonedHTML && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Cloned Preview</h2>
              <iframe
                srcDoc={clonedHTML}
                sandbox=""
                className="w-full h-[600px] border rounded-lg shadow-lg"
                title="Cloned Preview"
              />
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer">View raw HTML</summary>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 mt-2 rounded overflow-x-auto text-xs whitespace-pre-wrap">
                  {clonedHTML}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
