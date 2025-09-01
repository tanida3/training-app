"use client";

import React from "react";

// 筋トレ部位の型
export type MuscleCategory = {
  id: string;
  name: string;
};

// カテゴリリスト
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

type Props = {
  onSelectCategory?: (category: MuscleCategory) => void;
};

const MuscleCategoryList: React.FC<Props> = ({ onSelectCategory }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-4">
      {muscleCategories.map((category) => (
        <button
          key={category.id}
          className="p-3 border rounded-lg text-center hover:bg-gray-100"
          onClick={() => onSelectCategory && onSelectCategory(category)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default MuscleCategoryList;
