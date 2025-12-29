
import { GoogleGenAI, Type } from "@google/genai";
import { ClassifiedAd } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function optimizeClassifiedsForTV(classifieds: ClassifiedAd[]): Promise<ClassifiedAd[]> {
  try {
    const prompt = `
      Você é um especialista em marketing para painéis digitais (Digital Signage). 
      Dada a lista de anúncios classificados do site StandLocal, resuma cada um em uma frase curta, impactante e vendedora de no máximo 40 caracteres para ser exibida em uma TV.
      
      Anúncios:
      ${classifieds.map(c => `ID: ${c.id}, Título: ${c.title}, Preço: ${c.price}`).join('\n')}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              highlight: { type: Type.STRING }
            },
            required: ["id", "highlight"]
          }
        }
      }
    });

    const highlights = JSON.parse(response.text);
    
    return classifieds.map(c => {
      const h = highlights.find((item: any) => item.id === c.id);
      return { ...c, aiHighlight: h ? h.highlight : c.title };
    });
  } catch (error) {
    console.error("Gemini optimization failed", error);
    return classifieds;
  }
}
