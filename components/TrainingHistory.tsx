"use client";

import { ExerciseSet } from "./ExerciseLogger";

// Propsの型定義: 親から受け取るトレーニング記録リスト
type Props = {
  records: ExerciseSet[];
};

export default function TrainingHistory({ records }: Props) {
  // 日付ごとにトレーニング記録をまとめる
  // reduceでオブジェクトに変換。キーが日付、値がその日のExerciseSet配列
  const recordsByDate = records.reduce<Record<string, ExerciseSet[]>>(
    (acc, r) => {
      if (!acc[r.date]) acc[r.date] = []; // 初めての日付なら配列を作る
      acc[r.date].push(r);                 // その日付の配列に追加
      return acc;
    },
    {}
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">履歴</h2>

      {/* 日付順に逆順で表示（最新日付が上にくる） */}
      {Object.keys(recordsByDate)
        .sort((a, b) => (a < b ? 1 : -1))
        .map((date) => (
          <div key={date} className="mb-4">
            {/* 日付タイトル */}
            <h3 className="font-semibold">{date}</h3>

            {/* その日のトレーニング記録をグリッドで表示 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {recordsByDate[date].map((r) => (
                <div
                  key={r.id}
                  className="border rounded-lg p-2 text-center"
                >
                  {/* 各セットの詳細表示 */}
                  {r.sets}セット × {r.weight}kg × {r.reps}回
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
