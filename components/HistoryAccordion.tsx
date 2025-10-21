import React, { useState } from 'react';
import type { HistoryItem } from '../types';
import { HistoryIcon } from './icons/HistoryIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface HistoryAccordionProps {
  history: HistoryItem[];
  onLoadItem: (id: number) => void;
  onClearHistory: () => void;
}

export const HistoryAccordion: React.FC<HistoryAccordionProps> = ({ history, onLoadItem, onClearHistory }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearHistory();
  };

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center"
        aria-expanded={isOpen}
        aria-controls="history-content"
      >
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-6 h-6 text-slate-500" />
          <h2 className="text-lg font-bold text-slate-700">История генераций</h2>
        </div>
        <div className="flex items-center gap-4">
             {history.length > 0 && (
                <button 
                    onClick={handleClear}
                    className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors hidden sm:block"
                >
                    Очистить историю
                </button>
            )}
            <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <div 
        id="history-content"
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[600px] mt-4 pt-4 border-t border-slate-200' : 'max-h-0'}`}
      >
        {history.length === 0 ? (
          <div className="text-center text-slate-500 py-10">
            <p>Ваша история генераций пуста.</p>
            <p className="text-sm mt-1">Новые посты появятся здесь.</p>
          </div>
        ) : (
          <>
            <ul className="space-y-2 max-h-[540px] overflow-y-auto pr-2">
              {history.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onLoadItem(item.id)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <p className="font-semibold text-slate-800 truncate">{item.output.Заголовок || 'Без заголовка'}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(item.timestamp).toLocaleString('ru-RU')}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
             <button 
                onClick={onClearHistory}
                className="mt-4 w-full text-sm text-red-500 hover:text-red-700 font-medium transition-colors sm:hidden border-t border-slate-200 pt-3"
            >
                Очистить историю
            </button>
          </>
        )}
      </div>
    </div>
  );
};