"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// ===== データ型 =====

// 運動記録1件を表す型
export type ExerciseSet = {
  id: string;        // 一意のID
  exercise: string;  // 種目名（カテゴリー名と組み合わせる）
  sets: number;      // セット数
  weight: number;    // 重量(kg)
  reps: number;      // 回数
  date: string;      // 日付 (YYYY-MM-DD)
};

// 筋トレ部位カテゴリ
export type MuscleCategory = {
  id: string;   // 内部ID
  name: string; // 表示名
};

// 筋トレカテゴリの一覧
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

// ===== フォーム用状態型 =====
type FormState = {
  exercise: string; // 種目名入力
  sets: number;     // セット数
  weight: number;   // 重量
  reps: number;     // 回数
};

// ===== Props =====
type Props = {
  records: ExerciseSet[];                      // 記録一覧
  onAddRecord: (record: ExerciseSet) => void; // 記録追加コールバック
  onDeleteRecord: (id: string) => void;       // 記録削除コールバック
};

// ===== コンポーネント =====
const CategoryExerciseLogger: React.FC<Props> = ({
  records,
  onAddRecord,
  onDeleteRecord,
}) => {
  // 現在開いているカテゴリーID（アコーディオン）
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // カテゴリーごとのフォーム状態を管理
  const [formStates, setFormStates] = useState<Record<string, FormState>>(
    () =>
      muscleCategories.reduce((acc, cat) => {
        acc[cat.id] = { exercise: "", sets: 1, weight: 0, reps: 0 };
        return acc;
      }, {} as Record<string, FormState>)
  );

  // ===== 記録追加処理 =====
  const handleAdd = (categoryId: string) => {
    const state = formStates[categoryId];
    if (!state.exercise) return; // 種目名が空なら追加しない

    const categoryName = muscleCategories.find(c => c.id === categoryId)?.name || "";

    // 新しい運動記録を作成
    const newRecord: ExerciseSet = {
      id: uuidv4(), // 一意ID生成
      exercise: `${categoryName} - ${state.exercise}`, // カテゴリー名 + 種目名
      sets: state.sets,
      weight: state.weight,
      reps: state.reps,
      date: new Date().toISOString().split("T")[0], // 今日の日付
    };

    onAddRecord(newRecord); // 親に追加通知

    // フォームをリセット
    setFormStates(prev => ({
      ...prev,
      [categoryId]: { exercise: "", sets: 1, weight: 0, reps: 0 },
    }));
  };

  // ===== フォーム入力変更処理 =====
  const handleChange = (
    categoryId: string,
    field: keyof FormState,
    value: string | number
  ) => {
    setFormStates(prev => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], [field]: value },
    }));
  };

  // ===== JSX =====
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-4">
      {muscleCategories.map(cat => {
        const state = formStates[cat.id]; // このカテゴリのフォーム状態
        return (
          <div key={cat.id} className="border p-2 rounded">
            {/* カテゴリー名ボタン（クリックで開閉） */}
            <button
              className="font-semibold mb-2 w-full text-left"
              onClick={() =>
                setOpenCategory(openCategory === cat.id ? null : cat.id)
              }
            >
              {cat.name}
            </button>

            {/* カテゴリー開いたときのフォーム */}
            {openCategory === cat.id && (
              <div className="flex flex-col gap-2 mt-2">
                {/* 種目名入力 */}
                <input
                  type="text"
                  placeholder="種目名"
                  value={state.exercise}
                  onChange={e =>
                    handleChange(cat.id, "exercise", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />

                {/* セット数・重量・回数入力 */}
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <label className="text-sm">セット数</label>
                    <input
                      type="number"
                      min={1}
                      value={state.sets}
                      onChange={e =>
                        handleChange(cat.id, "sets", Number(e.target.value))
                      }
                      className="border px-2 py-1 rounded w-20"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm">重量(kg)</label>
                    <input
                      type="number"
                      min={0}
                      value={state.weight}
                      onChange={e =>
                        handleChange(cat.id, "weight", Number(e.target.value))
                      }
                      className="border px-2 py-1 rounded w-20"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm">回数</label>
                    <input
                      type="number"
                      min={1}
                      value={state.reps}
                      onChange={e =>
                        handleChange(cat.id, "reps", Number(e.target.value))
                      }
                      className="border px-2 py-1 rounded w-20"
                    />
                  </div>
                </div>

                {/* 入力内容のプレビュー */}
                {state.exercise && (
                  <div className="text-gray-700 text-sm mt-1">
                    {cat.name} - {state.exercise} {state.sets}セット ×{" "}
                    {state.weight}kg × {state.reps}回
                  </div>
                )}

                {/* 追加ボタン */}
                <button
                  onClick={() => handleAdd(cat.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  追加
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* ===== 記録一覧 ===== */}
      <div className="col-span-full mt-4 flex flex-col gap-2">
        {records.map(r => (
          <div
            key={r.id}
            className="flex justify-between items-center border p-2 rounded"
          >
            <div>
              {r.exercise} {r.sets}セット × {r.weight}kg × {r.reps}回
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
};

export default CategoryExerciseLogger;
