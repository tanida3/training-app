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
  // 最初は今日を選択日付に
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [form, setForm] = useState({
    exercise: '',
    sets: 0,
    weight: 0,
    reps: 0
  });

  // 日付クリックでselectedDate更新
  const handleDateClick = (value: Date) => {
    setSelectedDate(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value
    });
  };

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

  // 選択中の日付の記録のみ抽出
  const selectedDateRecords = records.filter(
    (record) => record.date === selectedDate.toISOString().split('T')[0]
  );

  return (
    <div>
      {/* カレンダーは常に表示 */}
      <Calendar onClickDay={handleDateClick} value={selectedDate} />

      {/* フォームも常に表示。選択中の日付の記録を追加 */}
      <div className="mt-4 p-4 border rounded">
        <h2>{selectedDate.toDateString()} の記録</h2>

        {selectedDateRecords.length > 0 ? (
          <ul className="mb-4 list-disc list-inside">
            {selectedDateRecords.map((record, index) => (
              <li key={index}>
                {record.exercise}：{record.sets}セット × {record.reps}回（{record.weight}kg）
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mb-2">記録がありません。</p>
        )}

        <div className="flex flex-col gap-2 mt-4">
          <input
            type="text"
            name="exercise"
            placeholder="種目名"
            value={form.exercise}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="number"
            name="sets"
            placeholder="セット数"
            value={form.sets}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="number"
            name="weight"
            placeholder="重量 (kg)"
            value={form.weight}
            onChange={handleInputChange}
            className="border p-2"
          />
          <input
            type="number"
            name="reps"
            placeholder="回数"
            value={form.reps}
            onChange={handleInputChange}
            className="border p-2"
          />
          <button
            onClick={handleAddRecord}
            className="bg-blue-500 text-white px-4 py-2 mt-2"
          >
            記録を追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomCalendar;
