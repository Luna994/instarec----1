
import React, { useState, useCallback } from 'react';
import type { ImageFile } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface InputAreaProps {
  onGenerate: (text: string, images: ImageFile[]) => void;
  isLoading: boolean;
}

type InputType = 'text' | 'image';

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

export const InputArea = ({ onGenerate, isLoading }: InputAreaProps) => {
  const [inputType, setInputType] = useState<InputType>('text');
  const [text, setText] = useState<string>('');
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      await processFiles(event.target.files);
    }
  };

  const processFiles = useCallback(async (files: FileList) => {
    const imageFiles: ImageFile[] = [];
    for (const file of Array.from(files)) {
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        imageFiles.push({ name: file.name, base64, type: file.type });
      }
    }
    setImages(prev => [...prev, ...imageFiles]);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    if(event.dataTransfer.files) {
        await processFiles(event.dataTransfer.files);
    }
  }, [processFiles]);

  const handleSubmit = useCallback(() => {
    onGenerate(text, images);
  }, [text, images, onGenerate]);

  const removeImage = useCallback((index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex border-b border-slate-200 mb-4">
        <button
          onClick={() => setInputType('text')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputType === 'text'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Текст рецепта
        </button>
        <button
          onClick={() => setInputType('image')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputType === 'image'
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Скриншоты
        </button>
      </div>

      {inputType === 'text' && (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Вставьте сюда текст рецепта из книги..."
          className="w-full h-64 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow resize-y"
          disabled={isLoading}
        />
      )}

      {inputType === 'image' && (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}>
          <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-2 text-sm text-slate-600">
            Перетащите файлы сюда или{' '}
            <label htmlFor="file-upload" className="font-medium text-emerald-600 hover:text-emerald-500 cursor-pointer">
              выберите для загрузки
            </label>
          </p>
          <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleFileChange} disabled={isLoading} />
        </div>
      )}
      
      {images.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-sm text-slate-600 mb-2">Загруженные изображения:</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {images.map((image, index) => (
                    <li key={index} className="relative group">
                        <img src={`data:${image.type};base64,${image.base64}`} alt={image.name} className="w-full h-20 object-cover rounded-md" />
                        <button onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs">&times;</button>
                        <p className="text-xs truncate text-slate-500 mt-1" title={image.name}>{image.name}</p>
                    </li>
                ))}
            </ul>
          </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || (text.trim() === '' && images.length === 0)}
        className="mt-6 w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Генерация...' : 'Сгенерировать пост'}
      </button>
    </div>
  );
};
