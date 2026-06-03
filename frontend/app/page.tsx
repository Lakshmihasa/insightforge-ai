"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-5xl font-bold mb-4">
        InsightForge AI
      </h1>

      <p className="text-xl text-gray-600 mb-8">
        AI-Powered Dataset Analytics Platform
      </p>

      <div className="bg-white p-6 rounded-xl shadow max-w-2xl">
        <button
          type="button"
          onClick={() => {
            alert("Button Working 🚀");
            setMessage("Button Clicked Successfully");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg cursor-pointer"
        >
          Test Button
        </button>

        {message && (
          <p className="mt-4 text-green-600 font-semibold">
            {message}
          </p>
        )}
      </div>
    </main>
  );
}