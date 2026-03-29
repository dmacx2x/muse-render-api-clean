import { v4 as uuidv4 } from "uuid";
import { getDB } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { title, scenes } = req.body;

    if (!title || !scenes || !Array.isArray(scenes)) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const sql = getDB();

    // 🔥 Create Job
    const jobId = uuidv4();

    await sql`
      INSERT INTO jobs (id, title, status)
      VALUES (${jobId}, ${title}, 'queued')
    `;

    const createdScenes = [];

    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const sceneId = uuidv4();

      // 🔥 Insert Scene
      await sql`
        INSERT INTO scenes (id, job_id, prompt, duration, scene_order, status)
        VALUES (
          ${sceneId},
          ${jobId},
          ${scene.prompt},
          ${scene.duration},
          ${i},
          'queued'
        )
      `;

      // 🔥 SEND TO RUNPOD
      const response = await fetch(process.env.RENDER_WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`,
        },
        body: JSON.stringify({
          input: {
            job_id: sceneId,
            prompt: scene.prompt,

            // 🔥 FIXED CALLBACK URL (NO ENV — HARD SET)
            update_job_url:
              "https://muse-render-api-clean.vercel.app/api/update-job",
          },
        }),
      });

      const data = await response.json();

      // 🔥 Save RunPod Job ID
      await sql`
        UPDATE scenes
        SET runpod_job_id = ${data.id}
        WHERE id = ${sceneId}
      `;

      createdScenes.push({
        sceneId,
        runpodJobId: data.id,
      });
    }

    return res.status(200).json({
      jobId,
      scenes: createdScenes,
    });
  } catch (error) {
    console.error("Render API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}