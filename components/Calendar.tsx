'use client';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type TrainingRecord = {
  date: string;
  exercise: string;
  sets: number;
  weight: number;
  reps: number;
};

const CustomCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [form, setForm] = useState({
    exercise: '',
    sets: 0,
    weight: 0,
    reps: 0
  });

  // 日付クリック
  const handleDateClick = (value: Date) => {
    setSelectedDate(value);
  };

  // 入力フォーム変更
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
    });
  };

  // 記録追加
  const handleAddRecord = () => {
    const isoDate = selectedDate.toISOString().split('T')[0];

    const newRecord: TrainingRecord = {
      date: isoDate,
      ...form
    };

    setRecords([...records, newRecord]);

    setForm({
      exercise: '',
      sets: 0,
      weight: 0,
      reps: 0
    });
  };

  // ★ 記録削除
  const handleDeleteRecord = (index: number) => {
    const isoDate = selectedDate.toISOString().split('T')[0];
    const newRecords = records.filter(
      (record, i) => !(i === index && record.date === isoDate)
    );
    setRecords(newRecords);
  };

  // 選択中の日付の記録だけ抽出
  const selectedDateRecords = records.filter(
    (record) => record.date === selectedDate.toISOString().split('T')[0]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* 上：カレンダー */}
      <div>
        <Calendar onClickDay={handleDateClick} value={selectedDate} />
      </div>

      {/* 下：記録フォーム */}
      <div className="p-4 border rounded">
        <h2>{selectedDate.toDateString()} の記録</h2>

        {selectedDateRecords.length > 0 ? (
          <ul className="mb-4 list-disc list-inside">
            {selectedDateRecords.map((record, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>
                  {record.exercise || '（種目未入力）'}：
                  {record.sets}セット × {record.reps}回（{record.weight}kg）
                </span>
                <button
                  onClick={() => handleDeleteRecord(index)}
                  className="ml-2 text-red-500 hover:underline"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mb-2">記録がありません。</p>
        )}

        {/* 入力フォーム */}
<div className="flex flex-col gap-0.4 mt-4">
  <input
    type="text"
    name="exercise"
    placeholder="種目名"
    value={form.exercise}
    onChange={handleInputChange}
    className="border p-1 text-sm rounded"
  />
  <input
    type="number"
    name="sets"
    placeholder="セット数"
    value={form.sets} 
    onChange={handleInputChange}
    className="border p-1 text-sm rounded"
  />

  <input
    type="number"
    name="weight"
    placeholder="重量 (kg)"
    value={form.weight}
    onChange={handleInputChange}
    className="border p-1 text-sm rounded"
  />
  <input
    type="number"
    name="reps"
    placeholder="回数"
    value={form.reps}
    onChange={handleInputChange}
    className="border p-1 text-sm rounded"
  />
  <button
    onClick={handleAddRecord}
    className="bg-blue-500 text-white px-3 py-1 mt-2 rounded text-sm"
  >
    記録を追加
  </button>
</div>

      </div>
    </div>
  );
};

export default CustomCalendar;
