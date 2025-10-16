
import React from 'react';
import { RecipeIcon } from './icons/RecipeIcon';

export const Header = () => {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">
           <RecipeIcon className="w-8 h-8"/>
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-800">
                Insta-Recipe Генератор
            </h1>
            <p className="text-sm text-slate-500">
                Превратите рецепт в идеальный пост для «Вкусно. Просто. Полезно.»
            </p>
        </div>
      </div>
    </header>
  );
};
