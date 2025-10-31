"use client";

import React from "react";
// Rechartsの各種コンポーネントをインポート
import {
  LineChart,       // 折れ線グラフ
  Line,            // 折れ線
  XAxis,           // X軸
  YAxis,           // Y軸
  CartesianGrid,   // グリッド線
  Tooltip,         // ツールチップ
  ResponsiveContainer // レスポンシブ対応コンテナ
} from "recharts";
import { ExerciseSet } from "./ExerciseLogger"; // トレーニング記録型をインポート

// Props型: 親コンポーネントから受け取る記録データ
type Props = {
  records: ExerciseSet[];
};

// チャート用のデータ型
type ChartData = {
  date: string;              // 日付（YYYY-MM-DD）
  totalWeight: number;       // その日の総重量
  details: ExerciseSet[];    // その日の記録詳細
};

export default function ExerciseGraph({ records }: Props) {
  // 日付ごとのデータをまとめるオブジェクト
  const dateMap: Record<string, ChartData> = {};

  // recordsを日付ごとに集計
  records.forEach(r => {
    const dateKey = r.date.slice(0, 10); // 日付部分だけ取り出す (YYYY-MM-DD)
    if (!dateMap[dateKey]) {
      // 初めてのデータなら初期化
      dateMap[dateKey] = { date: dateKey, totalWeight: 0, details: [] };
    }
    // 合計重量を計算 (重量 × 回数 × セット数)
    dateMap[dateKey].totalWeight += r.weight * r.reps * r.sets;
    // 詳細も格納
    dateMap[dateKey].details.push(r);
  });

  // オブジェクトを配列に変換して日付順にソート
  const chartData: ChartData[] = Object.values(dateMap).sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // カスタムツールチップの定義
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload) {
      const data: ChartData = payload[0].payload; // 選択されたデータを取得
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-semibold">{data.date}</p>
          {/* その日の記録詳細を表示 */}
          {data.details.map((d) => (
            <p key={d.id}>
              {d.exercise}: {d.sets}セット × {d.weight}kg × {d.reps}回
            </p>
          ))}
          <p className="font-semibold">合計重量: {data.totalWeight}kg</p>
        </div>
      );
    }
    return null; // ツールチップ非表示
  };

  return (
    <div className="w-full h-64 bg-white p-4 rounded-lg shadow-sm">
      {/* グラフタイトル */}
      <h2 className="text-lg font-semibold mb-2">日ごとのトレーニング詳細</h2>
      <ResponsiveContainer width="100%" height="100%">
        {/* 折れ線グラフ */}
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" /> {/* グリッド線 */}
          <XAxis dataKey="date" />                 {/* X軸に日付 */}
          <YAxis />                                {/* Y軸（自動スケール） */}
          <Tooltip content={<CustomTooltip />} /> {/* カスタムツールチップ */}
          <Line
            type="monotone"        // 曲線の補間方法
            dataKey="totalWeight"  // Y軸に表示する値
            stroke="#8884d8"       // 線の色
            strokeWidth={2}        // 線の太さ
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
