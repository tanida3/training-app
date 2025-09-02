"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// 以前の ExerciseSet 型を使用
export type ExerciseSet = {
  id: string;
  exercise: string;
  sets: number;
  weight: number;
  reps: number;
  date: string;
};

export type MuscleCategory = {
  id: string;
  name: string;
};

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

type FormState = {
  exercise: string;
  sets: number;
  weight: number;
  reps: number;
};

type Props = {
  records: ExerciseSet[];
  onAddRecord: (record: ExerciseSet) => void;
  onDeleteRecord: (id: string) => void;
};

const CategoryExerciseLogger: React.FC<Props> = ({
  records,
  onAddRecord,
  onDeleteRecord,
}) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [formStates, setFormStates] = useState<Record<string, FormState>>(
    () =>
      muscleCategories.reduce((acc, cat) => {
        acc[cat.id] = { exercise: "", sets: 1, weight: 0, reps: 0 };
        return acc;
      }, {} as Record<string, FormState>)
  );

  // 追加処理
  const handleAdd = (categoryId: string) => {
    const state = formStates[categoryId];
    if (!state.exercise) return;

    const categoryName = muscleCategories.find(c => c.id === categoryId)?.name || "";

    // カテゴリー名を exercise にまとめて格納
    const newRecord: ExerciseSet = {
      id: uuidv4(),
      exercise: `${categoryName} - ${state.exercise}`,
      sets: state.sets,
      weight: state.weight,
      reps: state.reps,
      date: new Date().toISOString().split("T")[0],
    };

    onAddRecord(newRecord);

    // フォームをリセット
    setFormStates(prev => ({
      ...prev,
      [categoryId]: { exercise: "", sets: 1, weight: 0, reps: 0 },
    }));
  };

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

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 p-4">
      {muscleCategories.map(cat => {
        const state = formStates[cat.id];
        return (
          <div key={cat.id} className="border p-2 rounded">
            <button
              className="font-semibold mb-2 w-full text-left"
              onClick={() =>
                setOpenCategory(openCategory === cat.id ? null : cat.id)
              }
            >
              {cat.name}
            </button>

            {openCategory === cat.id && (
              <div className="flex flex-col gap-2 mt-2">
                <input
                  type="text"
                  placeholder="種目名"
                  value={state.exercise}
                  onChange={e =>
                    handleChange(cat.id, "exercise", e.target.value)
                  }
                  className="border px-2 py-1 rounded"
                />
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

                {state.exercise && (
                  <div className="text-gray-700 text-sm mt-1">
                    {cat.name} - {state.exercise} {state.sets}セット ×{" "}
                    {state.weight}kg × {state.reps}回
                  </div>
                )}

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

      {/* 記録一覧 */}
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
