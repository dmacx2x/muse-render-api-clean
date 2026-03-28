import { getDB } from "../../lib/db";

export default async function handler(req, res) {

  try {
    const sql = getDB();
    const { jobId } = req.query;

    if (!jobId) {
      return res.status(400).json({ error: "jobId required" });
    }

    // 🔥 GET SCENES
    const scenes = await sql`
      SELECT id, status, output_url
      FROM scenes
      WHERE job_id = ${jobId}
      ORDER BY scene_order ASC
    `;

    // 🔥 DEBUG LOG
    console.log("CHECK JOB DB RESULT:", scenes);

    return res.status(200).json({
      success: true,
      scenes
    });

  } catch (err) {
    console.error("CHECK JOB ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
}