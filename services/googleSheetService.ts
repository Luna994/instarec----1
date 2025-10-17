import type { RecipeOutput } from '../types';

// URL вебхука для Make.com, который интегрируется с Google Таблицей.
const MAKE_WEBHOOK_URL = 'https://hook.eu2.make.com/jo52w67and9w23pahdk86vdbiaqtzfcd';

/**
 * Отправляет данные рецепта в Google Таблицу через веб-приложение Apps Script.
 * @param data - Объект с данными рецепта.
 */
export const sendToGoogleSheet = async (data: RecipeOutput): Promise<void> => {
  if (!MAKE_WEBHOOK_URL) {
    const errorMessage = 'URL вебхука не настроен.';
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  try {
    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Отправляем данные в формате, который соответствует схеме OpenAPI (вложены в post_content)
      body: JSON.stringify({
        post_content: data,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Формируем подробное сообщение об ошибке для отображения в UI
      throw new Error(`Код: ${response.status}. Объяснение: ${errorText || response.statusText}`);
    }

  } catch (error) {
    console.error('Не удалось отправить данные через вебхук:', error);
    if (error instanceof Error) {
      // Если это уже наша кастомная ошибка, пробрасываем ее дальше
      if (error.message.startsWith('Код:')) {
        throw error;
      }
      // Для сетевых ошибок
      throw new Error(`Ошибка сети: ${error.message}`);
    }
    throw new Error('Произошла неизвестная ошибка при отправке данных.');
  }
};
