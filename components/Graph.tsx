"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { ExerciseSet } from "./ExerciseLogger";

type Props = {
  records: ExerciseSet[];
};

type ChartData = {
  date: string;
  totalWeight: number;
  details: ExerciseSet[];
};

export default function ExerciseGraph({ records }: Props) {
  // 日付ごとの総重量と詳細をまとめる
  const dateMap: Record<string, ChartData> = {};

  records.forEach(r => {
    const dateKey = r.date.slice(0, 10); // YYYY-MM-DD
    if (!dateMap[dateKey]) {
      dateMap[dateKey] = { date: dateKey, totalWeight: 0, details: [] };
    }
    dateMap[dateKey].totalWeight += r.weight * r.reps * r.sets;
    dateMap[dateKey].details.push(r);
  });

  const chartData: ChartData[] = Object.values(dateMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // カスタムツールチップ
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: ChartData = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{data.date}</p>
          {data.details.map((d) => (
            <p key={d.id}>
              {d.exercise}: {d.sets}セット × {d.weight}kg × {d.reps}回
            </p>
          ))}
          <p className="font-semibold">合計重量: {data.totalWeight}kg</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">日ごとのトレーニング詳細</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="totalWeight" stroke="#8884d8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
