"use client";
import { useState } from "react";

export default function Studio() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Idle");

  const handleRender = async () => {
    if (!prompt || !title) {
      alert("Enter title and prompt");
      return;
    }

    setStatus("Rendering...");

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project_id: title,
          prompt: prompt,
          scenes: [
            {
              duration: 5,
              visual_prompt: prompt,
            },
          ],
        }),
      });

      const data = await res.json();
      console.log(data);

      setStatus("Render Started");
    } catch (err) {
      console.error(err);
      setStatus("Error");
    }
  };

  return (
    <div style={{ padding: "40px", color: "white", background: "#0B0B0F", minHeight: "100vh" }}>
      <h1>ATA Muse Studio</h1>

      <input
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          background: "#111",
          color: "white",
          border: "1px solid #333",
        }}
      />

      <textarea
        placeholder="Enter prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          background: "#111",
          color: "white",
          border: "1px solid #333",
        }}
      />

      <button onClick={handleRender} style={{ padding: "10px 20px" }}>
        Generate
      </button>

      <p>Status: {status}</p>
    </div>
  );
}