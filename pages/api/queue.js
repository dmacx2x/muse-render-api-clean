let renderQueue = [];

export default async function handler(req, res) {

if (req.method === "GET") {
return res.status(200).json(renderQueue);
}

if (req.method === "POST") {

```
const job = {
  id: Date.now(),
  project: req.body.project,
  status: "queued",
  created: new Date().toISOString()
};

renderQueue.push(job);

return res.status(200).json(job);
```

}

if (req.method === "PATCH") {

```
const { id, status } = req.body;

renderQueue = renderQueue.map(job =>
  job.id === id ? { ...job, status } : job
);

return res.status(200).json(renderQueue);
```

}

return res.status(405).json({ error: "Method Not Allowed" });

}
