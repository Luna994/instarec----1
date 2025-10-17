import React, { useState } from 'react';
import type { RecipeOutput } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { SendIcon } from './icons/SendIcon';
import { sendToGoogleSheet } from '../services/googleSheetService';

interface OutputDisplayProps {
  output: RecipeOutput;
}

const OutputSection: React.FC<{ title: string; content: string; pre?: boolean }> = ({ title, content, pre = false }) => {
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


export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSendToSheet = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitError(null);
    try {
      await sendToGoogleSheet(output);
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
      setSubmitError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Ваш пост готов! ✨</h2>
        <OutputSection title="Номер рецепта" content={output.Номер} />
        <OutputSection title="Заголовок" content={output.Заголовок} />
        <OutputSection title="Текст рецепта" content={output.Рецепт} pre={true} />
        <OutputSection title="Совет/Лайфхак" content={output.Совет} />
        <OutputSection title="ДопИнфа (КБЖУ)" content={output.ДопИнфа} />
        <OutputSection title="Диеты/Показания" content={output.Диеты} />
        <OutputSection title="Хэштеги" content={output.Хэштеги} />
        <OutputSection title="Промпт для визуала" content={output.Промпт} />

        <div className="mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleSendToSheet}
              disabled={isSubmitting || submitStatus === 'success'}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              {isSubmitting ? (
                'Отправка...'
              ) : submitStatus === 'success' ? (
                '✓ Отправлено'
              ) : (
                <>
                  <SendIcon className="w-5 h-5" />
                  Отправить в Google Таблицу
                </>
              )}
            </button>
            {submitStatus === 'error' && (
              <p className="text-red-600 text-sm mt-2 text-center">
                <strong>Данные не отправлены.</strong>
                <span className="block">{submitError}</span>
              </p>
            )}
            {submitStatus === 'success' && (
              <p className="text-green-600 text-sm mt-2 text-center">Данные успешно отправлены!</p>
            )}
        </div>
    </div>
  );
};
