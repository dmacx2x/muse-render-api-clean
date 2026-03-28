export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {

    const { prompt, duration_seconds, title } = req.body;

    const scenes = [
      {
        scene_id: "scene_01",
        duration: 4,
        visual_prompt: "cinematic futuristic hospital hallway glowing gold and white, confident african nurse walking forward",
        text_overlay: "A New Future for Nurses",
        voiceover: "A new future is opening for nurses."
      },
      {
        scene_id: "scene_02",
        duration: 6,
        visual_prompt: "busy african hospital ward with skilled nurses working professionally",
        text_overlay: "Talent Is Everywhere",
        voiceover: "Talent exists everywhere across Africa."
      },
      {
        scene_id: "scene_03",
        duration: 6,
        visual_prompt: "modern digital healthcare network connecting hospitals globally",
        text_overlay: "ATA Creates Opportunity",
        voiceover: "Angels Touch America connects talent to opportunity."
      },
      {
        scene_id: "scene_04",
        duration: 6,
        visual_prompt: "nurse studying medical books preparing for international exams",
        text_overlay: "Training and Guidance",
        voiceover: "Training, preparation, and guidance."
      },
      {
        scene_id: "scene_05",
        duration: 4,
        visual_prompt: "luxury gold and white ATA logo animation glowing",
        text_overlay: "Join ATA",
        voiceover: "Join the movement today."
      }
    ];

    const project = {
      project_id: "muse_" + Date.now(),
      title: title || "Muse Generated Video",
      duration_seconds: duration_seconds || 30,
      scenes
    };

    return res.status(200).json({
      status: "scenes_generated",
      project
    });

  } catch (err) {

    return res.status(500).json({
      error: "scene builder failed",
      message: err.message
    });

  }

}