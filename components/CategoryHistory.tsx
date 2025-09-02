"use client";

import { ExerciseSet } from "./ExerciseLogger";

type Props = {
  records: ExerciseSet[];
  onDeleteRecord: (id: string) => void;
};

export default function CategoryHistory({ records, onDeleteRecord }: Props) {
  // カテゴリごとにグループ化
  const grouped = records.reduce((acc, record) => {
    const category = record.exercise; // 今は exercise にカテゴリ名を入れている想定
    if (!acc[category]) acc[category] = [];
    acc[category].push(record);
    return acc;
  }, {} as Record<string, ExerciseSet[]>);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">カテゴリ別トレーニング履歴</h2>
      {Object.entries(grouped).map(([category, recs]) => (
        <div key={category} className="border rounded-lg p-3 bg-white shadow">
          <h3 className="font-semibold mb-2">{category}</h3>
          <ul className="space-y-1">
            {recs.map((r) => (
              <li key={r.id} className="flex justify-between items-center border-b pb-1">
                <span>
                  {new Date(r.date).toLocaleDateString()} - {r.sets}セット x {r.reps}回 ({r.weight}kg)
                </span>
                <button
                  onClick={() => onDeleteRecord(r.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
