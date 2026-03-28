export default async function handler(req, res) {

  const templates = {

    luxury_ad: {
      name: "Luxury Product Ad",
      scenes: [
        { duration: 3, prompt: "luxury brand logo reveal with gold lighting" },
        { duration: 4, prompt: "hero product closeup on marble table" },
        { duration: 4, prompt: "lifestyle shot showing premium usage" },
        { duration: 3, prompt: "brand call to action screen" }
      ]
    },

    real_estate: {
      name: "Real Estate Promo",
      scenes: [
        { duration: 4, prompt: "drone shot of modern luxury home exterior" },
        { duration: 4, prompt: "interior living room cinematic pan" },
        { duration: 4, prompt: "kitchen and bedroom showcase" },
        { duration: 3, prompt: "contact information call to action" }
      ]
    },

    startup: {
      name: "Tech Startup Launch",
      scenes: [
        { duration: 3, prompt: "futuristic tech logo animation" },
        { duration: 4, prompt: "product interface demonstration" },
        { duration: 4, prompt: "team collaboration workspace" },
        { duration: 3, prompt: "launch announcement screen" }
      ]
    }

  };

  return res.status(200).json(templates);

}