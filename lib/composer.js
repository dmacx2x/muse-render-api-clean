import fs from "fs";
import path from "path";
import os from "os";
import { exec } from "child_process";

export function stitchVideos(videoPaths, outputPath) {
  return new Promise((resolve, reject) => {
    const listFile = path.join(os.tmpdir(), `videos_${Date.now()}.txt`);

    const fileList = videoPaths
      .map(p => `file '${p}'`)
      .join("\n");

    fs.writeFileSync(listFile, fileList);

    const cmd = `ffmpeg -f concat -safe 0 -i ${listFile} -c copy ${outputPath}`;

    exec(cmd, (err) => {
      if (err) return reject(err);
      resolve(outputPath);
    });
  });
}