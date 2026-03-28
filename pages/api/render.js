import { getDB } from "../../lib/db";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const sql = getDB();
    const { title, scenes } = req.body;

    if (!Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({ error: "Scenes required" });
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
      const prompt = scene.prompt;

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

      console.log("🚀 Sending to RunPod:", sceneId);

      let data = {};
      let responseText = "";

      try {
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

        responseText = await response.text();

        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseErr) {
          console.error("❌ RunPod JSON parse failed:", responseText);
          data = {};
        }

        if (!response.ok) {
          console.error("❌ RunPod request failed:", {
            status: response.status,
            body: responseText
          });
        }
      } catch (fetchErr) {
        console.error("❌ RUNPOD FETCH ERROR:", fetchErr);
        data = {};
      }

      await sql`
        UPDATE scenes
        SET runpod_job_id = ${data.id || null}
        WHERE id = ${sceneId}
      `;

      results.push({
        sceneId,
        runpodJobId: data.id || null
      });
    }

    return res.status(200).json({
      jobId,
      scenes: results
    });
  } catch (err) {
    console.error("❌ RENDER ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
}