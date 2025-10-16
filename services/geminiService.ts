
import { GoogleGenAI } from "@google/genai";
import type { RecipeOutput, ImageFile } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY;

if (!API_KEY) {
  throw new Error("VITE_API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = ai.models;

const mainPrompt = `
# РОЛЬ И ЗАДАЧА
Ты — копирайтер и иллюстратор проекта «Вкусно. Просто. Полезно.». Твоя задача — переработать рецепт диетического питания из предоставленного текста и/или изображений в готовый пост для Instagram.

# ГЛАВНЫЙ ПРИНЦИП
Используй только данные из предоставленного рецепта. Если информации для какого-то поля (например, КБЖУ) нет — честно напиши, что не можешь рассчитать, но не выдумывай.

# ФОРМАТ РЕЗУЛЬТАТА
Твой ответ ДОЛЖЕН быть строго в формате JSON. Не добавляй никакого текста, объяснений или markdown-разметки (\`\`\`json) до или после JSON объекта. Структура JSON должна быть следующей:
{
  "recipe": "...",
  "kbju": "...",
  "diets": "...",
  "hashtags": "...",
  "prompt": "..."
}

# ДЕТАЛЬНЫЕ ИНСТРУКЦИИ ПО ЗАПОЛНЕНИЮ ПОЛЕЙ JSON:

1.  **recipe**:
    *   Напиши готовый текст рецепта простым, тёплым, спокойным языком.
    *   Избегай медицинских терминов и канцелярита. Вместо них используй мягкие формулировки: «если важно следить за сахаром», «для лёгкого рациона», «подходит тем, кто снижает нагрузку на ЖКТ», «вариант для тех, кто избегает жареного».
    *   НИКОГДА не упоминай номера диет (например, "диета №5").
    *   Раздели приготовление на 3–4 чётких шага.
    *   В конце добавь полезный совет, лайфхак или призыв "Сохрани рецепт ❤️".

2.  **kbju**:
    *   Рассчитай КБЖУ (калории, белки, жиры, углеводы) на одну порцию, если это возможно на основе данных.
    *   Формат: "КБЖУ на 1 порцию: ~ К: ... ккал, Б: ... г, Ж: ... г, У: ... г".
    *   Если данных недостаточно, напиши: "Недостаточно данных для точного расчёта КБЖУ."

3.  **diets**:
    *   Укажи номера диет и медицинские показания, если они есть в исходном тексте.
    *   Формат: "Подходит для диет: №5, №8. Рекомендовано при заболеваниях ЖКТ, для контроля веса."
    *   Если данных нет, оставь поле пустым "".

4.  **hashtags**:
    *   Обязательные хэштеги: #ВкусноПростоПолезно #щадящеепитание #вкуснополезно
    *   Если в исходных данных есть номер диеты, добавь хэштег для него, например, #диета5.

5.  **prompt**:
    *   Сгенерируй промпт для визуала для нейросети.
    *   Основывайся на названии и внешнем виде готового блюда из рецепта.
    *   Используй следующий шаблон, заполнив [НАЗВАНИЕ БЛЮДА] и [КРАТКОЕ ОПИСАНИЕ]: "Instagram post, 1080x1350 (4:5). Minimalist food photography, close-up shot of [НАЗВАНИЕ БЛЮДА], [КРАТКОЕ ОПИСАНИЕ]. The dish is beautifully plated on a simple ceramic plate. Soft, natural daylight from a side window creates gentle shadows. The background is a cozy, slightly blurred home kitchen with light, neutral tones (white, beige, olive green). A linen napkin and a simple fork are placed beside the plate. The overall mood is warm, calm, and healthy. On the image, add elegant, readable text: Title - '[НАЗВАНИЕ БЛЮДА]', Subtitle - 'Вкусно. Просто. Полезно.'".

Вот рецепт для обработки:
`;


type Part = { text: string } | { inlineData: { mimeType: string; data: string } };

export const generateInstagramPost = async (text: string, images: ImageFile[]): Promise<RecipeOutput> => {
  const parts: Part[] = [{ text: mainPrompt }];

  if (text) {
    parts.push({ text });
  }

  if (images.length > 0) {
    parts.push(...images.map(image => ({
      inlineData: {
        mimeType: image.type,
        data: image.base64,
      }
    })));
  }

  try {
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
    });

    const responseText = response.text.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const jsonResponse = JSON.parse(jsonMatch[0]);
    return jsonResponse as RecipeOutput;
  } catch (error) {
    console.error("Failed to generate post:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate Instagram post");
  }
};
