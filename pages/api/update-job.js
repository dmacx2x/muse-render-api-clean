import { getDB } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const sql = getDB();

    const { id, status, output_url } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Scene ID required"
      });
    }

    console.log("🔄 UPDATE JOB CALLED:", {
      id,
      status,
      output_url
    });

    const result = await sql`
      UPDATE scenes
      SET
        status = ${status || "completed"},
        output_url = ${output_url || null}
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      console.log("❌ NO SCENE FOUND FOR ID:", id);

      return res.status(404).json({
        error: "Scene not found",
        id
      });
    }

    console.log("✅ SCENE UPDATED:", result[0]);

    return res.status(200).json({
      success: true,
      scene: result[0]
    });
  } catch (err) {
    console.error("❌ UPDATE JOB ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
}