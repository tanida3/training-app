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
  categoryId?: string;   // 追加
  categoryName?: string; // 追加
};

// Props
type Props = {
  onAddRecord: (record: ExerciseSet) => void; // 親に追加を通知
  records: ExerciseSet[];                     // 親から記録データを受け取る
};

export default function ExerciseLogger({ onAddRecord, records }: Props) {
  // 入力フォームの state
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState(1);
  const [weight, setWeight] = useState(0);
  const [reps, setReps] = useState(0);

  // 追加処理
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
    onAddRecord(newRecord); // ✅ 親に追加
    setExercise("");
    setSets(1);
    setWeight(0);
    setReps(0);
  };

  // 削除処理
  const deleteRecord = (id: string) => {
    // 親で管理している場合は親に削除用の関数を作る
    // ここでは簡易的にフィルターして onAddRecord を使う方法は非推奨
    alert("削除する場合は親コンポーネントに削除関数を渡してください");
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">トレーニング記録</h2>

      {/* 入力フォーム */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          placeholder="種目名"
          value={exercise}
          onChange={e => setExercise(e.target.value)}
          className="border px-2 py-1 rounded"
        />

        <div className="flex gap-2">
          <div className="flex flex-col">
            <label className="text-sm">セット数</label>
            <input
              type="number"
              min={1}
              value={sets}
              onChange={e => setSets(Number(e.target.value))}
              className="border px-2 py-1 rounded w-20"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm">重量(kg)</label>
            <input
              type="number"
              min={0}
              value={weight}
              onChange={e => setWeight(Number(e.target.value))}
              className="border px-2 py-1 rounded w-20"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm">回数</label>
            <input
              type="number"
              min={1}
              value={reps}
              onChange={e => setReps(Number(e.target.value))}
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
        {records.map(r => (
          <div key={r.id} className="flex justify-between items-center border p-2 rounded">
            <div>
              <span className="font-semibold">{r.exercise}</span>{" "}
              {r.sets}セット × {r.weight}kg × {r.reps}回
            </div>
            <button
              onClick={() => deleteRecord(r.id)}
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
