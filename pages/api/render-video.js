import fetch from "node-fetch";

export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method Not Allowed" });
}

try {

```
const project = req.body;

const response = await fetch(
  "https://muse-render-api.vercel.app/api/render",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(project)
  }
);

const data = await response.json();

const runpod = data.runpod_response;

if (runpod.output && runpod.output.video_base64) {

  const videoBuffer = Buffer.from(runpod.output.video_base64, "base64");

  res.setHeader("Content-Type", "video/mp4");

  return res.status(200).send(videoBuffer);

}

return res.status(200).json(data);
```

} catch (err) {

```
return res.status(500).json({
  error: "render pipeline failed",
  message: err.message
});
```

}

}
