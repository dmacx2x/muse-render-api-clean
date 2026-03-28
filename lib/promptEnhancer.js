export function enhancePrompt(prompt, style = "cinematic") {
  const styles = {
    cinematic: "cinematic lighting, depth of field, ultra realistic, 4k, dramatic shadows",
    luxury: "luxury product lighting, gold reflections, premium composition, dark background",
    healthcare: "clean lighting, professional environment, soft tones, high trust visuals"
  };

  return `${prompt}, ${styles[style] || styles.cinematic}`;
}