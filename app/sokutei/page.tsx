"use client";
import { useState, useEffect } from "react";
import BodyStats from "../../components/BodyStats";
import SettingsModal from "../../components/SettingsModal";

export default function Home() {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    // react-modal のルート要素を登録
    import("react-modal").then((ReactModal) => {
      ReactModal.setAppElement("body");
    });

    const savedHeight = localStorage.getItem("height");
    if (savedHeight) {
      setHeight(parseFloat(savedHeight));
    }
  }, []);

  // 身長変更時に localStorage に保存
  const handleSetHeight = (h: number) => {
    setHeight(h);
    localStorage.setItem("height", h.toString());
  };

  return (
    <div className="p-4 relative min-h-screen pb-20">
      {/* BodyStats コンポーネント */}
      <BodyStats height={height} />

      {/* ヘッダー下右上に設定ボタンを配置 */}
      <div className="absolute top-0 right-0 mt-4 mr-4">
        <SettingsModal height={height} setHeight={handleSetHeight} />
      </div>
    </div>
  );
}