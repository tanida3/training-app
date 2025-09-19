"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// ===== データ型 =====
export type ExerciseSet = {
  id: string;        // 一意なID（UUID）
  exercise: string;  // 種目名（カテゴリを含むことも可）
  sets: number;      // セット数
  weight: number;    // 重量(kg)
  reps: number;      // 回数
  date: string;      // 記録日時（ISO文字列）
};

// ===== 筋トレ部位の型 =====
export type MuscleCategory = {
  id: string;   // カテゴリID
  name: string; // カテゴリ名（例：胸、背中）
};

// ===== カテゴリリスト =====
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

// ===== Props =====
type Props = {
  records: ExerciseSet[];                     // 記録一覧
  onAddRecord: (record: ExerciseSet) => void; // 記録追加コールバック
  onDeleteRecord: (id: string) => void;       // 記録削除コールバック
};

// ===== コンポーネント =====
export default function Ex({ records, onAddRecord, onDeleteRecord }: Props) {
  // ===== 入力フォームのステート =====
  const [exercise, setExercise] = useState(""); // 種目名
  const [sets, setSets] = useState(1);          // セット数
  const [weight, setWeight] = useState(0);      // 重量
  const [reps, setReps] = useState(0);         // 回数

  // ===== 記録追加処理 =====
  const addRecord = () => {
    if (!exercise) return; // 種目が空なら追加しない

    const newRecord: ExerciseSet = {
      id: uuidv4(),           // UUIDで一意なID
      exercise,               // 入力された種目名
      sets,
      weight,
      reps,
      date: new Date().toISOString(), // 現在日時をISO文字列で保存
    };

    onAddRecord(newRecord);   // 親コンポーネントに通知

    // フォームをリセット
    setExercise("");
    setSets(1);
    setWeight(0);
    setReps(0);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-sm">
      {/* タイトル */}
      <h2 className="text-lg font-semibold mb-2">トレーニング記録（Exコンポーネント）</h2>

      {/* 入力フォーム */}
      <div className="flex flex-col gap-2 mb-4">
        {/* 種目名入力 */}
        <input
          type="text"
          placeholder="種目名（カテゴリをクリックでも選択可）"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        {/* カテゴリボタン一覧 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
          {muscleCategories.map((category) => (
            <button
              key={category.id}
              className="p-2 border rounded-lg text-center hover:bg-gray-100"
              onClick={() => setExercise(category.name)} // ボタン押下で種目名にカテゴリ名をセット
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* セット数・重量・回数入力 */}
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

        {/* 追加ボタン */}
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
