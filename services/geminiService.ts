
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateEnemyImage = async (name: string, archetype: string) => {
  const ai = getAI();
  try {
    const prompt = `Pixel art sprite of a dark medieval enemy. 
    Archetype: ${archetype}. Name: ${name}. 
    Style: Undertale-inspired black and white pixel art with red accents. 
    Grimdark like Dark Souls. 1-bit style with high contrast. 
    The design should visually represent its style (Heavy armor for Rock, Robes for Paper, Daggers for Scissors). 
    Centered on black background.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return `https://picsum.photos/seed/${name}/300/300`;
  } catch (error) {
    return `https://picsum.photos/seed/${name}/300/300`;
  }
};

export const generateRuneImage = async (runeName: string) => {
  const ai = getAI();
  try {
    const prompt = `Small pixel art icon for a magical rune named '${runeName}'. 
    Style: Glowing white/yellow symbol on dark stone, pixel art 32x32 aesthetic. 
    Undertale UI style. High contrast.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return '';
  } catch {
    return '';
  }
};

export const generateBossLore = async (name: string, arch: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Narrator for 'Shattered Souls'. Intro for ${name} (${arch}). 
      Style: Undertale quirky + Dark Souls grim. Max 40 words. 
      Vaguely hint if they are heavy(rock), scholarly(paper), or sharp(scissors).`,
    });
    return response.text || "A shadow looms.";
  } catch {
    return "Your determination wavers as a shadow appears.";
  }
};
