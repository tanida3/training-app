"use client";

import React, { useState } from "react"; // React本体とuseStateフックをインポート
import { v4 as uuidv4 } from "uuid";     // ユニークIDを生成するuuidライブラリをインポート

// データ型: 1つのトレーニング記録を表す
export type ExerciseSet = {
  id: string;           // 一意に識別するID
  exercise: string;     // 種目名
  sets: number;         // セット数
  weight: number;       // 重量(kg)
  reps: number;         // 回数
  date: string;         // 記録日（ISO形式）
  categoryId?: string;   // カテゴリID(オプション)
  categoryName?: string; // カテゴリ名(オプション)
};

// Props型: 親コンポーネントから受け取る値
type Props = {
  onAddRecord: (record: ExerciseSet) => void; // 記録を追加するときに親に通知
  records: ExerciseSet[];                     // 親から渡される記録データの配列
};

export default function ExerciseLogger({ onAddRecord, records }: Props) {
  // 入力フォームの state（フォームの各値を管理）
  const [exercise, setExercise] = useState(""); // 種目名
  const [sets, setSets] = useState(1);          // セット数（初期値1）
  const [weight, setWeight] = useState(0);      // 重量（初期値0kg）
  const [reps, setReps] = useState(0);          // 回数（初期値0回）

  // 記録追加処理
  const addRecord = () => {
    if (!exercise) return; // 種目名が空なら追加しない

    // 新しい記録オブジェクトを作成
    const newRecord: ExerciseSet = {
      id: uuidv4(),        // ユニークIDを生成
      exercise,            // 種目名
      sets,                // セット数
      weight,              // 重量
      reps,                // 回数
      date: new Date().toISOString(), // 現在日時をISO形式で保存
    };

    onAddRecord(newRecord); // 親コンポーネントに追加を通知

    // フォームをリセット
    setExercise("");
    setSets(1);
    setWeight(0);
    setReps(0);
  };

  // 記録削除処理（親で管理する想定）
  const deleteRecord = (id: string) => {
    // 注意: このコンポーネントだけで削除は行わない
    alert("削除する場合は親コンポーネントに削除関数を渡してください");
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-sm">
      {/* タイトル */}
      <h2 className="text-lg font-semibold mb-2">トレーニング記録</h2>

      {/* 入力フォーム */}
      <div className="flex flex-col gap-2 mb-4">
        {/* 種目名入力 */}
        <input
          type="text"
          placeholder="種目名"
          value={exercise}                     // 入力値をstateと連動
          onChange={e => setExercise(e.target.value)} // 入力時にstate更新
          className="border px-2 py-1 rounded"
        />

        {/* セット数・重量・回数入力 */}
        <div className="flex gap-2">
          {/* セット数 */}
          <div className="flex flex-col">
            <label className="text-sm">セット数</label>
            <input
              type="number"
              min={1}                           // 最小値1
              value={sets}                      // stateと連動
              onChange={e => setSets(Number(e.target.value))} // 数値に変換して更新
              className="border px-2 py-1 rounded w-20"
            />
          </div>

          {/* 重量 */}
          <div className="flex flex-col">
            <label className="text-sm">重量(kg)</label>
            <input
              type="number"
              min={0}                           // 最小値0
              value={weight}                    // stateと連動
              onChange={e => setWeight(Number(e.target.value))} // 数値に変換して更新
              className="border px-2 py-1 rounded w-20"
            />
          </div>

          {/* 回数 */}
          <div className="flex flex-col">
            <label className="text-sm">回数</label>
            <input
              type="number"
              min={1}                           // 最小値1
              value={reps}                      // stateと連動
              onChange={e => setReps(Number(e.target.value))} // 数値に変換して更新
              className="border px-2 py-1 rounded w-20"
            />
          </div>
        </div>

        {/* 追加ボタン */}
        <button
          onClick={addRecord}                    // クリックで追加処理
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>

      {/* 記録一覧表示 */}
      <div className="flex flex-col gap-2">
        {records.map(r => (
          <div key={r.id} className="flex justify-between items-center border p-2 rounded">
            {/* 記録内容 */}
            <div>
              <span className="font-semibold">{r.exercise}</span>{" "} 
              {r.sets}セット × {r.weight}kg × {r.reps}回
            </div>

            {/* 削除ボタン */}
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
