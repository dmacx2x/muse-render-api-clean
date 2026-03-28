import { getDB } from '../../lib/db';
import { getAuth } from "@clerk/nextjs/server";

export default async function handler(req, res) {

  try {
    // 🔐 GET USER FROM CLERK SESSION
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized"
      });
    }

    const sql = getDB();

    const result = await sql`
      SELECT * FROM jobs 
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return res.status(200).json({
      jobs: result
    });

  } catch (err) {
    console.error("LIBRARY ERROR:", err);

    return res.status(500).json({
      error: "library fetch failed",
      message: err.message
    });
  }
}