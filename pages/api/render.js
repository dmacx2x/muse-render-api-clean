import fetch from "node-fetch";
import { getDB } from "../../lib/db";
import { enhancePrompt } from "../../lib/promptEnhancer";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const sql = getDB();
    const { title, scenes } = req.body;

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({ error: "Scenes array is required" });
    }

    if (!process.env.RENDER_WORKER_URL) {
      return res.status(500).json({ error: "Missing RENDER_WORKER_URL" });
    }

    if (!process.env.RUNPOD_API_KEY) {
      return res.status(500).json({ error: "Missing RUNPOD_API_KEY" });
    }

    if (!process.env.UPDATE_JOB_URL) {
      return res.status(500).json({ error: "Missing UPDATE_JOB_URL" });
    }

    const jobId = uuidv4();

    await sql`
      INSERT INTO jobs (id, title, status)
      VALUES (${jobId}, ${title || "Untitled"}, 'processing')
    `;

    const results = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const sceneId = uuidv4();

      const prompt = enhancePrompt(scene.prompt, scene.style);

      await sql`
        INSERT INTO scenes (id, job_id, prompt, duration, scene_order, status)
        VALUES (
          ${sceneId},
          ${jobId},
          ${prompt},
          ${scene.duration || 5},
          ${i},
          'queued'
        )
      `;

      console.log("🚀 Sending scene to RunPod:", {
        sceneId,
        prompt,
        updateJobUrl: process.env.UPDATE_JOB_URL
      });

      const response = await fetch(process.env.RENDER_WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.RUNPOD_API_KEY}`
        },
        body: JSON.stringify({
          input: {
            prompt,
            job_id: sceneId,
            update_job_url: process.env.UPDATE_JOB_URL
          }
        })
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return res.status(500).json({
          error: "Invalid JSON from RunPod worker",
          raw: text
        });
      }

      if (!response.ok) {
        return res.status(500).json({
          error: data?.error || "RunPod request failed",
          details: data
        });
      }

      await sql`
        UPDATE scenes
        SET runpod_job_id = ${data.id || null}, status = 'queued'
        WHERE id = ${sceneId}
      `;

      results.push({
        sceneId,
        runpodJobId: data.id || null,
        runpodStatus: data.status || null
      });
    }

    return res.status(200).json({
      jobId,
      scenes: results
    });
  } catch (err) {
    console.error("RENDER API ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
}