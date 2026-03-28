export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method Not Allowed" });
}

const { product } = req.body;

if (!product) {
return res.status(400).json({ error: "Product required" });
}

const scenes = [

{ duration:3, prompt:`${product} cinematic brand reveal` },

{ duration:4, prompt:`close up of ${product} with dramatic lighting` },

{ duration:4, prompt:`${product} lifestyle usage scene` },

{ duration:3, prompt:`${product} logo and call to action` }

];

res.status(200).json({
title:`${product} Advertisement`,
scenes
});

}
