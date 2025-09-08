"use client";

import React from "react";

// --- 筋トレ部位の型定義 ---
export type MuscleCategory = {
  id: string;   // 一意のID
  name: string; // 表示名
};

// --- カテゴリリスト（固定データ） ---
const muscleCategories: MuscleCategory[] = [
  { id: "chest", name: "胸" },
  { id: "back", name: "背中" },
  { id: "legs", name: "脚" },
  { id: "shoulders", name: "肩" },
  { id: "arms", name: "腕" },
  { id: "core", name: "体幹" },
  { id: "glutes", name: "お尻" },
  { id: "forearms", name: "前腕" },
  { id: "calves", name: "ふくらはぎ" },
  { id: "fullbody", name: "全身" },
];

// --- Props型定義 ---
type Props = {
  onSelectCategory?: (category: MuscleCategory) => void; // カテゴリ選択時のコールバック
};

// --- カテゴリ一覧表示コンポーネント ---
const MuscleCategoryList: React.FC<Props> = ({ onSelectCategory }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-4">
      {muscleCategories.map((category) => (
        <button
          key={category.id} // リストを描画する際の一意キー
          className="p-3 border rounded-lg text-center hover:bg-gray-100"
          onClick={() => onSelectCategory && onSelectCategory(category)} // 選択時に親コンポーネントに通知
        >
          {category.name} {/* ボタンに部位名を表示 */}
        </button>
      ))}
    </div>
  );
};

export default MuscleCategoryList;
