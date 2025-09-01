"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// データ型
export type ExerciseSet = {
  id: string;
  exercise: string;
  sets: number;
  weight: number;
  reps: number;
  date: string;
};

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

// Props
type Props = {
  records: ExerciseSet[];
  onAddRecord: (record: ExerciseSet) => void;
  onDeleteRecord: (id: string) => void;
};

export default function Ex({ records, onAddRecord, onDeleteRecord }: Props) {
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState(1);
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);

  const addRecord = () => {
    if (!exercise) return;
    const newRecord: ExerciseSet = {
      id: uuidv4(),
      exercise,
      sets,
      weight,
      reps,
      date: new Date().toISOString(),
    };
    onAddRecord(newRecord);
    setExercise("");
    setSets(1);
    setWeight(0);
    setReps(0);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">トレーニング記録（Exコンポーネント）</h2>

      {/* 入力フォーム */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="種目名（カテゴリをクリックでも選択可）"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        {/* カテゴリリスト */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
          {muscleCategories.map((category) => (
            <button
              key={category.id}
              className="p-2 border rounded-lg text-center hover:bg-gray-100"
              onClick={() => setExercise(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col">
            <label className="text-sm">セット数</label>
            <input
              type="number"
              min={1}
              value={sets}
              onChange={(e) => setSets(Number(e.target.value))}
              className="border px-2 py-1 rounded w-20"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm">重量(kg)</label>
            <input
              type="number"
              min={0}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="border px-2 py-1 rounded w-20"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm">回数</label>
            <input
              type="number"
              min={1}
              value={reps}
              onChange={(e) => setReps(Number(e.target.value))}
              className="border px-2 py-1 rounded w-20"
            />
          </div>
        </div>

        <button
          onClick={addRecord}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>

      {/* 記録一覧 */}
      <div className="flex flex-col gap-2">
        {records.map((r) => (
          <div key={r.id} className="flex justify-between items-center border p-2 rounded">
            <div>
              <span className="font-semibold">{r.exercise}</span>{" "}
              {r.sets}セット × {r.weight}kg × {r.reps}回
            </div>
            <button
              onClick={() => onDeleteRecord(r.id)}
              className="text-red-500 hover:text-red-700"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
