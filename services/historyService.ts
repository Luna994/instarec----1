import type { HistoryItem } from '../types';

const HISTORY_KEY = 'instaRecipeHistory';
const MAX_HISTORY_ITEMS = 20;

export const getHistory = (): HistoryItem[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Failed to parse history from localStorage', error);
    return [];
  }
};

export const saveToHistory = (newItem: HistoryItem): HistoryItem[] => {
  const currentHistory = getHistory();
  // Add new item to the beginning
  const updatedHistory = [newItem, ...currentHistory];
  // Limit the number of items
  const slicedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(slicedHistory));
  } catch (error) {
    console.error('Failed to save history to localStorage', error);
  }
  return slicedHistory;
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear history from localStorage', error);
  }
};
