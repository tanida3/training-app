"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ReactModal from "react-modal";
import BodyStats from "@/components/BodyStats";

export default function Home() {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    // react-modal のルート要素を登録（この page 内のすべてのモーダルに有効）
    ReactModal.setAppElement("body");

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
