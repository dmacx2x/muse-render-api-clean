import { getDB } from '../../lib/db';

export default async function handler(req, res) {
  try {
    const sql = getDB();

    // 🔹 JOBS TABLE (main project container)
    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT,
        prompt TEXT,
        status TEXT DEFAULT 'pending',
        output_url TEXT,
        user_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 🔹 SCENES TABLE (NEW - REQUIRED FOR MUSE UPGRADE)
    await sql`
      CREATE TABLE IF NOT EXISTS scenes (
        id TEXT PRIMARY KEY,
        job_id TEXT,
        prompt TEXT,
        duration INTEGER,
        scene_order INTEGER,
        output_url TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 🔹 INDEXES (performance)
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_scenes_job_id ON scenes(job_id)`;

    return res.status(200).json({
      success: true,
      message: "Muse DB initialized (Jobs + Scenes ready)"
    });

  } catch (err) {
    console.error("INIT DB ERROR:", err);

    return res.status(500).json({
      error: "Database init failed",
      message: err.message
    });
  }
}