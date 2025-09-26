"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import BodyStats from "@/components/BodyStats";

export default function Home() {
  const [height, setHeight] = useState<number | null>(null);

  // localStorageから復元
  useEffect(() => {
    const savedHeight = localStorage.getItem("height");
    if (savedHeight) {
      setHeight(parseFloat(savedHeight));
    }
  }, []);

  return (
<<<<<<< HEAD
    <div className="p-4">
      {/* ホームリンク - ヘッダーの直下 */}
      <div className="mb-4">
        <Link
          href="/"
          className="text-1xl inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-300 transition"
        >
          ホームに戻る
        </Link>
      </div>

      {/* BodyStats コンポーネント */}
      <BodyStats height={height} />
=======
    <div>
    
>>>>>>> 41-履歴コンポーネント
    </div>
  );
}
