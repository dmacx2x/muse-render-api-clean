import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ error: "jobId required" });
    }

    if (!process.env.RENDER_WORKER_URL) {
      return res.status(500).json({ error: "Missing RENDER_WORKER_URL" });
    }

    if (!process.env.RUNPOD_API_KEY) {
      return res.status(500).json({ error: "Missing RUNPOD_API_KEY" });
    }

    const statusUrl = process.env.RENDER_WORKER_URL.replace(
      "/run",
      `/status/${jobId}`
    );

    const response = await fetch(statusUrl, {
      headers: {
        Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`
      }
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({
        error: "Invalid JSON from status endpoint",
        raw: text
      });
    }

    return res.status(200).json({
      status: data.status,
      output: data.output
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}