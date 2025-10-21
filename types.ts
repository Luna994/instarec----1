export interface RecipeOutput {
  "Номер": string;
  "Заголовок": string;
  "Рецепт": string;
  "Совет": string;
  "ДопИнфа": string;
  "Диеты": string;
  "Хэштеги": string;
  "Промпт": string;
  "Визуал"?: string;
}

export interface ImageFile {
  name: string;
  base64: string;
  type: string;
}

export interface HistoryItem {
  id: number;
  timestamp: string;
  inputText: string;
  inputImages: ImageFile[];
  output: RecipeOutput;
}
