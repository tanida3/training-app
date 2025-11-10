"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim() === "") return;
    setTasks([...tasks, input]);
    setInput("");
  };

  const handleDelete = (indexToRemove: number) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div className="text-center my-6">
        <h1 className="text-3xl font-bold text-gray-800">あなたのトレーニング目標を記録しよう！</h1>
        <p className="text-gray-500 mt-2">達成したい目標を入力して、モチベーションをキープしましょう。</p>
      </div>

      <form onSubmit={handleAdd} className="mb-4 space-y-4 p-4 bg-white rounded-lg shadow">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="例：1ヶ月で体脂肪-3%"
          className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:border-blue-400"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-400 transform hover:scale-95 duration-200 mt-2"
        >
          追加
        </button>
      </form>

      <div className="p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">登録された目標</h2>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-white p-2 rounded shadow"
            >
              <span>{task}</span>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
