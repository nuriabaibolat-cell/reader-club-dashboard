import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const kemelAI = {
  /**
   * AI Coach for book discussion
   */
  async discussBook(bookTitle: string, userMessage: string, history: any[]) {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `Сен "Кемел Мектеп" жобасының ЖИ-коучысың. Пайдаланушымен "${bookTitle}" кітабы туралы талқылайсың. 
        Сенің мақсатың - оқушының сыни ойлауын дамыту. Сұрақтар қой, терең мағыналарды ашуға көмектес. 
        Қазақ тілінде сөйле. Рухани және интеллектуалдық дамуға баса назар аудар.`,
      },
    });

    // Note: In this SDK, sendMessage only takes { message: string }
    // We handle history via the chat state if we persist the chat object, 
    // or we can recreate it. For simplicity in this demo, we'll use a new chat each time 
    // but the actual implementation would ideally persist the chat session.
    const result = await chat.sendMessage({ message: userMessage });
    return result.text;
  },

  /**
   * Generate a quiz for teachers
   */
  async generateQuiz(subject: string, topic: string) {
    const prompt = `Create a 5-question multiple choice quiz for a "${subject}" lesson about "${topic}". 
    Format: JSON array of objects with {question: string, options: string[], answerIndex: number}. 
    Language: Kazakh. Focus on deep understanding based on PISA/PIRLS standards. 
    Only return the JSON array, no extra text.`;
    
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    try {
      const text = result.text || "[]";
      return JSON.parse(text);
    } catch (e) {
      console.error("Quiz generation failed", e);
      return [];
    }
  }
};

