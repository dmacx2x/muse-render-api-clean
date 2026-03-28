import fs from "fs";
import path from "path";
import os from "os";
import fetch from "node-fetch";
import { getDB } from "../../lib/db";
import { stitchVideos } from "../../lib/composer";

async function download(url, dest) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

export default async function handler(req, res) {
  const { jobId } = req.body;
  const sql = getDB();

  const scenes = await sql`
    SELECT * FROM scenes WHERE job_id = ${jobId} ORDER BY scene_order
  `;

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "muse-"));
  const files = [];

  for (let i = 0; i < scenes.length; i++) {
    const file = path.join(tempDir, `scene_${i}.mp4`);
    await download(scenes[i].output_url, file);
    files.push(file);
  }

  const finalPath = path.join(tempDir, `${jobId}.mp4`);

  await stitchVideos(files, finalPath);

  await sql`
    UPDATE jobs SET status = 'completed', output_url = ${finalPath}
    WHERE id = ${jobId}
  `;

  res.status(200).json({ finalPath });
}