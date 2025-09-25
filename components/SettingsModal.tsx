"use client";
import { useState, useEffect } from "react";
import ReactModal from "react-modal";

interface SettingsModalProps {
  height: number | null;
  setHeight: (h: number) => void;
}

export default function SettingsModal({ height, setHeight }: SettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetWeight, setTargetWeight] = useState<number | "">("");
  const [localHeight, setLocalHeight] = useState<number | "">(height ?? "");

  const handleSave = () => {
    if (localHeight !== "") {
      setHeight(Number(localHeight));
    }
    console.log("目標体重:", targetWeight, "身長:", localHeight);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded m-4"
      >
        設定を開く
      </button>

      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="設定"
        style={{
          content: {
            maxWidth: "400px",
            margin: "auto",
            padding: "20px",
            borderRadius: "8px",
          },
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>設定</h2>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold" }}>目標体重 (kg):</label>
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value === "" ? "" : parseFloat(e.target.value))}
            style={{
              width: "100%",
              marginTop: "4px",
              padding: "8px",
              border: "2px solid #888",
              borderRadius: "6px",
              fontSize: "16px",
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label style={{ fontWeight: "bold" }}>身長 (cm):</label>
          <input
            type="number"
            value={localHeight}
            onChange={(e) => setLocalHeight(e.target.value === "" ? "" : parseFloat(e.target.value))}
            style={{
              width: "100%",
              marginTop: "4px",
              padding: "8px",
              border: "2px solid #888",
              borderRadius: "6px",
              fontSize: "16px",
            }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            marginTop: "16px",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "1px solid #888",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          保存
        </button>
      </ReactModal>
    </>
  );
}
