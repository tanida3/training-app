'use client';

import { useState } from 'react';
import TrainingSession from '../components/TrainingSessionPage';

export default function TrainingAddButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* トレーニング追加ボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-3 flex items-center gap-2 shadow-lg transition-all z-40 hover:scale-105"
        aria-label="本日のトレーニングを追加"
      >
        <span className="text-2xl">⊕</span>
        <span className="font-semibold whitespace-nowrap">本日のトレーニングを追加</span>
      </button>

      {/* トレーニングセッションモーダル */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
          <TrainingSession onClose={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
}