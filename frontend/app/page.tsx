"use client";

import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const [datasets, setDatasets] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);

  const fetchDatasets = async () => {
    try {
      const response = await api.get("/datasets/");
      setDatasets(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSummary = async (id: number) => {
    try {
      const response = await api.get(
        `/datasets/${id}/summary`
      );

      setSummary(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStatistics = async (id: number) => {
    try {
      const response = await api.get(
        `/datasets/${id}/statistics`
      );

      setStatistics(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInsights = async (id: number) => {
    try {
      const response = await api.get(
        `/datasets/${id}/insights`
      );

      setInsights(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(
        "/datasets/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(
        `Uploaded successfully: ${response.data.filename}`
      );

      fetchDatasets();
    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-5xl font-bold">
        InsightForge AI
      </h1>

      <p className="text-xl text-gray-600 mt-4">
        AI-Powered Dataset Analytics Platform
      </p>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <input
          type="file"
          accept=".csv"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />

        <button
          onClick={handleUpload}
          className="ml-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Upload Dataset
        </button>

        {message && (
          <p className="mt-4 font-semibold">
            {message}
          </p>
        )}
      </div>

      {/* Dataset List */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">
          Uploaded Datasets
        </h2>

        {datasets.length === 0 ? (
          <p>No datasets uploaded yet.</p>
        ) : (
          datasets.map((dataset) => (
            <div
              key={dataset.id}
              className="border p-4 rounded mb-4"
            >
              <h3 className="font-bold text-lg">
                {dataset.filename}
              </h3>

              <p>Rows: {dataset.rows}</p>
              <p>Columns: {dataset.columns}</p>

              <div className="mt-3 flex gap-3 flex-wrap">
                <button
                  onClick={() =>
                    fetchSummary(dataset.id)
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  View Summary
                </button>

                <button
                  onClick={() =>
                    fetchStatistics(dataset.id)
                  }
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  View Statistics
                </button>

                <button
                  onClick={() =>
                    fetchInsights(dataset.id)
                  }
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                >
                  AI Insights
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">
            Dataset Summary
          </h2>

          <p>
            <strong>Filename:</strong>{" "}
            {summary.filename}
          </p>

          <p>
            <strong>Rows:</strong>{" "}
            {summary.rows}
          </p>

          <p>
            <strong>Columns:</strong>{" "}
            {summary.columns}
          </p>

          <div className="mt-4">
            <strong>Column Names:</strong>

            <ul className="list-disc ml-6 mt-2">
              {summary.column_names.map(
                (col: string) => (
                  <li key={col}>{col}</li>
                )
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Statistics */}
      {statistics && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">
            Statistics
          </h2>

          {Object.entries(
            statistics.statistics
          ).map(([column, stats]: any) => (
            <div
              key={column}
              className="border p-4 rounded mb-4"
            >
              <h3 className="font-bold text-lg">
                {column}
              </h3>

              <p>Mean: {stats.mean}</p>
              <p>Median: {stats.median}</p>
              <p>Min: {stats.min}</p>
              <p>Max: {stats.max}</p>
              <p>Std Dev: {stats.std}</p>
            </div>
          ))}
        </div>
      )}

      {/* AI Insights */}
      {insights && (
        <div className="mt-8 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">
            AI Insights
          </h2>

          <ul className="list-disc ml-6">
            {insights.insights.map(
              (insight: string, index: number) => (
                <li
                  key={index}
                  className="mb-2"
                >
                  {insight}
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </main>
  );
}