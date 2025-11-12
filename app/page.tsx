"use client";
import { useState, useEffect } from "react";
import Calendar from "../components/Calendar";
import TodayBotton from "../components/TodayBotton";
import Goal from "../components/Goal";

export default function Home() {
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 640);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <>
      {/* 画面幅によってカレンダーとボタンの配置を切り替える */}
      {isLargeScreen ? (
        <div className="flex-1 flex items-start justify-center p-4 gap-4">
          <Calendar />
          <TodayBotton />
        </div>
      ) : (
        <div className="p-4 flex flex-col items-center gap-4">
          <Calendar />
          <TodayBotton />
        </div>
      )}

      <Goal />
    </>
  );
}
