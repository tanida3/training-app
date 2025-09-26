"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import ReactModal from "react-modal";

interface RecordItem {
  date?: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  waist?: number;
}

interface BodyStatsProps {
  height: number | null;
}

export default function BodyStats({ height }: BodyStatsProps) {
  const [record, setRecord] = useState<RecordItem>({});
  const [recordsHistory, setRecordsHistory] = useState<RecordItem[]>([]);
  const [memo, setMemo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ name: string }>({ name: "" });

  // ===== localStorageから復元 =====
  useEffect(() => {
    const savedMemo = localStorage.getItem("memo");
    if (savedMemo) setMemo(savedMemo);

    const savedRecords = localStorage.getItem("recordsHistory");
    if (savedRecords) setRecordsHistory(JSON.parse(savedRecords));
  }, []);

  // ===== localStorageに保存 =====
  useEffect(() => {
    localStorage.setItem("memo", memo);
  }, [memo]);

  useEffect(() => {
    localStorage.setItem("recordsHistory", JSON.stringify(recordsHistory));
  }, [recordsHistory]);

  // ===== 計算 =====
  const bmi =
    record.weight && height
      ? +(record.weight / ((height / 100) ** 2)).toFixed(2)
      : 0;

  const bodyFatAmount =
    record.weight && record.bodyFat
      ? +((record.weight * record.bodyFat) / 100).toFixed(2)
      : 0;

  const leanBodyMass =
    record.weight && bodyFatAmount
      ? +(record.weight - bodyFatAmount).toFixed(2)
      : 0;

  const muscleWeight = record.muscleMass ? +record.muscleMass.toFixed(2) : 0;

  // ===== 入力・削除 =====
  const handleInputChange = (key: keyof RecordItem, value: string) => {
    if (key === "date") {
      setRecord((prev) => ({ ...prev, date: value }));
      // 選択した日付に既存のレコードがあればフォームに反映
      const existing = recordsHistory.find((r) => r.date === value);
      if (existing) {
        setRecord((prev) => ({ ...prev, ...existing }));
      }
      return;
    }
    const num = parseFloat(value);
    setRecord((prev) => ({ ...prev, [key]: isNaN(num) ? undefined : num }));
  };

  const handleDelete = (key: keyof RecordItem) => {
    setRecord((prev) => ({ ...prev, [key]: undefined }));
  };

  // ===== 記録保存 =====
  const handleSaveRecord = () => {
    const today = new Date().toISOString().split("T")[0];
    const dateKey = record.date || today;

    const newRecord: RecordItem = {
      date: dateKey,
      weight: record.weight,
      bodyFat: record.bodyFat,
      muscleMass: record.muscleMass,
      waist: record.waist,
    };

    setRecordsHistory((prev) => {
      const existingIndex = prev.findIndex((r) => r.date === dateKey);
      if (existingIndex !== -1) {
        // 上書き
        const newHistory = [...prev];
        newHistory[existingIndex] = newRecord;
        return newHistory;
      } else {
        return [...prev, newRecord];
      }
    });

    // 入力フォームは保持したいのでrecordをクリアしない
  };

  // ===== モーダル =====
  const openModal = (name: string) => {
    setModalData({ name });
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const getChartData = (name: string) => {
    return recordsHistory
      .sort((a, b) => (a.date! > b.date! ? 1 : -1))
      .map((r) => {
        let value = 0;
        switch (name) {
          case "BMI":
            value = r.weight && height ? +(r.weight / ((height / 100) ** 2)).toFixed(2) : 0;
            break;
          case "体脂肪量":
            value = r.weight && r.bodyFat ? +((r.weight * r.bodyFat) / 100).toFixed(2) : 0;
            break;
          case "除脂肪体重":
            value = r.weight && r.bodyFat ? +(r.weight - (r.weight * r.bodyFat) / 100).toFixed(2) : 0;
            break;
          case "筋重量":
            value = r.muscleMass ?? 0;
            break;
          case "体重(kg)":
            value = r.weight ?? 0;
            break;
          case "体脂肪(%)":
            value = r.bodyFat ?? 0;
            break;
          case "筋肉量(kg)":
            value = r.muscleMass ?? 0;
            break;
          case "ウエスト(cm)":
            value = r.waist ?? 0;
            break;
          default:
            value = 0;
        }
        return { time: r.date, value };
      });
  };

  return (
    <div style={{ padding: "16px", maxWidth: "600px", margin: "auto" }}>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {/* 入力項目 */}
        {(
          [
            ["日付", "date"],
            ["体重(kg)", "weight"],
            ["体脂肪(%)", "bodyFat"],
            ["筋肉量(kg)", "muscleMass"],
            ["ウエスト(cm)", "waist"],
          ] as [string, keyof RecordItem][]
        ).map(([label, key]) => (
          <li
            key={key}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span style={{ width: "120px", fontWeight: "bold" }}>{label}:</span>
            <input
              type={key === "date" ? "date" : "number"}
              value={record[key] ?? ""}
              onChange={(e) => handleInputChange(key, e.target.value)}
              style={{
                flex: 1,
                marginRight: "8px",
                padding: "8px",
                border: "1px solid #bbb",
                borderRadius: "6px",
                fontSize: "15px",
              }}
            />
            {key !== "date" && (
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => handleDelete(key)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #aaa",
                    background: "#f8f8f8",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
                <button
                  onClick={() => openModal(label)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #aaa",
                    background: "#eef6ff",
                    cursor: "pointer",
                  }}
                >
                  📈
                </button>
              </div>
            )}
          </li>
        ))}

        {/* 計算項目 */}
        {(
          [
            ["BMI", bmi],
            ["体脂肪量", bodyFatAmount],
            ["除脂肪体重", leanBodyMass],
            ["筋重量", muscleWeight],
          ] as [string, number][]
        ).map(([label, value], idx) => (
          <li
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <span style={{ width: "120px", fontWeight: "bold" }}>{label}:</span>
            <input
              type="number"
              value={value}
              readOnly
              style={{
                flex: 1,
                marginRight: "8px",
                padding: "8px",
                border: "1px solid #bbb",
                borderRadius: "6px",
                fontSize: "15px",
                backgroundColor: "#f9f9f9",
              }}
            />
            <button
              onClick={() => openModal(label)}
              style={{
                padding: "6px 10px",
                borderRadius: "4px",
                border: "1px solid #aaa",
                background: "#eef6ff",
                cursor: "pointer",
              }}
            >
              📈
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSaveRecord}
        style={{
          padding: "10px 18px",
          marginTop: "12px",
          borderRadius: "6px",
          border: "none",
          background: "#4a90e2",
          color: "#fff",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        記録を保存
      </button>

      {/* メモ欄 */}
      <div style={{ marginTop: "20px" }}>
        <label style={{ fontWeight: "bold" }}>メモ:</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            marginTop: "6px",
            padding: "10px",
            border: "1px solid #bbb",
            borderRadius: "6px",
            fontSize: "15px",
          }}
        />
      </div>

      {/* グラフモーダル */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="グラフ"
        appElement={typeof document !== "undefined" ? document.body : undefined}
        style={{
          content: {
            maxWidth: "640px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid #ccc",
          },
        }}
      >
        <h2 style={{ marginBottom: "16px" }}>{modalData.name}の推移</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getChartData(modalData.name)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#4a90e2" />
          </LineChart>
        </ResponsiveContainer>
        <button
          onClick={closeModal}
          style={{
            marginTop: "16px",
            padding: "8px 14px",
            borderRadius: "6px",
            border: "1px solid #aaa",
            cursor: "pointer",
            background: "#f8f8f8",
          }}
        >
          閉じる
        </button>
      </ReactModal>
    </div>
  );
}
