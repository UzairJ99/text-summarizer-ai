"use client";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarizeFeature = async () => {
    // let the UI render the loading screen
    setLoading(true);

    try {
      const response = await fetch("api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-area">
      <h1 className="title">Summarizer.AI</h1>
      <textarea
        className="text-area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to summarize"
        rows={4}
        cols={60}
      />
      <button className="summarizeBtn" onClick={handleSummarizeFeature} disabled={loading || !text}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      {summary && (
        <div>
          <h2>Summary:</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
