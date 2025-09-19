"use client";

import { ExerciseSet } from "./Ex";


// ===== Props =====
type Props = {
  records: ExerciseSet[];               // 親コンポーネントから渡される運動記録一覧
  onDeleteRecord: (id: string) => void; // 記録削除時のコールバック
};

// ===== コンポーネント =====
export default function CategoryHistory({ records, onDeleteRecord }: Props) {
  // ===== カテゴリごとにグループ化 =====
  // records 内の ExerciseSet を exercise 名（ここではカテゴリ名込み）でまとめる
  const grouped = records.reduce((acc, record) => {
    const category = record.exercise; // 現状、exercise にカテゴリ名 + 種目名が入っている想定
    if (!acc[category]) acc[category] = []; // 初めてのカテゴリなら配列を作る
    acc[category].push(record);             // 同じカテゴリに追加
    return acc;
  }, {} as Record<string, ExerciseSet[]>);

  return (
    <div className="space-y-4">
      {/* タイトル */}
      <h2 className="text-xl font-bold">カテゴリ別トレーニング履歴</h2>

      {/* グループごとに表示 */}
      {Object.entries(grouped).map(([category, recs]) => (
        <div key={category} className="border rounded-lg p-3 bg-white shadow">
          {/* カテゴリ名 */}
          <h3 className="font-semibold mb-2">{category}</h3>

          {/* 記録リスト */}
          <ul className="space-y-1">
            {recs.map((r) => (
              <li key={r.id} className="flex justify-between items-center border-b pb-1">
                {/* 日付・セット・回数・重量 */}
                <span>
                  {new Date(r.date).toLocaleDateString()} - {r.sets}セット x {r.reps}回 ({r.weight}kg)
                </span>

                {/* 削除ボタン */}
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
