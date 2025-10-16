
import React, { useState } from 'react';
import type { RecipeOutput } from '../types';
import { CopyIcon } from './icons/CopyIcon';

interface OutputDisplayProps {
  output: RecipeOutput;
}

const OutputSection = ({ title, content, pre = false }: { title: string; content: string; pre?: boolean }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (!content) return null;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
          title="Скопировать"
        >
          <CopyIcon className="w-4 h-4" />
          {copied ? 'Готово!' : 'Копировать'}
        </button>
      </div>
      <div className="bg-slate-100 p-4 rounded-lg text-slate-800">
        {pre ? (
           <pre className="whitespace-pre-wrap text-sm font-sans">{content}</pre>
        ) : (
          <p className="whitespace-pre-wrap text-sm">{content}</p>
        )}
      </div>
    </div>
  );
};


export const OutputDisplay = ({ output }: OutputDisplayProps) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Ваш пост готов! ✨</h2>
        <OutputSection title="Текст рецепта" content={output.recipe} pre={true} />
        <OutputSection title="КБЖУ" content={output.kbju} />
        <OutputSection title="Диеты/Показания" content={output.diets} />
        <OutputSection title="Хэштеги" content={output.hashtags} />
        <OutputSection title="Промпт для визуала" content={output.prompt} />
    </div>
  );
};
