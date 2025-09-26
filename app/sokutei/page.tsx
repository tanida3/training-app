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
    <div className="p-4">
      {/* BodyStats コンポーネント */}
      <BodyStats height={height} />
    </div>
  );
}
