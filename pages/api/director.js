export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method Not Allowed" });
}

const { prompt } = req.body;

if (!prompt) {
return res.status(400).json({ error: "Prompt required" });
}

const scenes = [
{ duration: 3, prompt: `${prompt}, cinematic opening shot` },
{ duration: 4, prompt: `${prompt}, hero visual focus` },
{ duration: 4, prompt: `${prompt}, lifestyle action scene` },
{ duration: 3, prompt: `${prompt}, logo reveal and call to action` }
];

return res.status(200).json({
project_prompt: prompt,
scenes
});

}
