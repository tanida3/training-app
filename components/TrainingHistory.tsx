"use client";

import { ExerciseSet } from "./ExerciseLogger";

type Props = {
  records: ExerciseSet[];
};

export default function TrainingHistory({ records }: Props) {
  // 日付ごとにまとめる
  const recordsByDate = records.reduce<Record<string, ExerciseSet[]>>(
    (acc, r) => {
      if (!acc[r.date]) acc[r.date] = [];
      acc[r.date].push(r);
      return acc;
    },
    {}
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">履歴</h2>
      {Object.keys(recordsByDate)
        .sort((a, b) => (a < b ? 1 : -1))
        .map((date) => (
          <div key={date} className="mb-4">
            <h3 className="font-semibold">{date}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {recordsByDate[date].map((r) => (
                <div
                  key={r.id}
                  className="border rounded-lg p-2 text-center"
                >
                  {r.sets}セット × {r.weight}kg × {r.reps}回
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}
