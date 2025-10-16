
import React, { useState } from 'react';
import { Header } from './components/Header';
import { InputArea } from './components/InputArea';
import { OutputDisplay } from './components/OutputDisplay';
import { Loader } from './components/Loader';
import { generateInstagramPost } from './services/geminiService';
import type { RecipeOutput, ImageFile } from './types';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<RecipeOutput | null>(null);

  const handleGenerate = async (text: string, images: ImageFile[]) => {
    setIsLoading(true);
    setError(null);
    setOutput(null);

    if (!text && images.length === 0) {
      setError('Пожалуйста, введите текст рецепта или загрузите изображение.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await generateInstagramPost(text, images);
      setOutput(result);
    } catch (e) {
      console.error(e);
      setError('Не удалось сгенерировать пост. Пожалуйста, проверьте консоль для получения подробной информации об ошибке и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="w-full">
            <InputArea onGenerate={handleGenerate} isLoading={isLoading} />
          </div>
          <div className="w-full">
            {isLoading && <Loader />}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Ошибка: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {output && !isLoading && <OutputDisplay output={output} />}
            {!output && !isLoading && !error && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center text-slate-500 h-full flex flex-col justify-center">
                    <p className="text-lg">Здесь появится ваш готовый пост для Instagram.</p>
                    <p className="mt-2 text-sm">Просто введите или загрузите рецепт и нажмите "Сгенерировать".</p>
                </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-slate-400 text-xs">
        <p>Создано с ❤️ для проекта «Вкусно. Просто. Полезно.»</p>
      </footer>
    </div>
  );
};

export default App;
