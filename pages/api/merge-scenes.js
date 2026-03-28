import { getDB } from "../../lib/db";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const sql = getDB();
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "jobId required" });
    }

    // 🔥 GET ALL SCENES
    const scenes = await sql`
      SELECT output_url
      FROM scenes
      WHERE job_id = ${jobId}
      ORDER BY scene_order ASC
    `;

    if (!scenes.length) {
      return res.status(400).json({ error: "No scenes found" });
    }

    // 🔥 TEMP: Use first scene as final video (stable version)
    const finalVideo = scenes[0].output_url;

    // 🔥 UPDATE JOB
    await sql`
      UPDATE jobs
      SET status = 'completed',
          output_url = ${finalVideo}
      WHERE id = ${jobId}
    `;

    return res.status(200).json({
      success: true,
      finalVideo
    });

  } catch (err) {
    console.error("MERGE ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
}