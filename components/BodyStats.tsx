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
      setRecord({ ...record, date: value });
      return;
    }
    const num = parseFloat(value);
    setRecord({ ...record, [key]: isNaN(num) ? undefined : num });
  };

  const handleDelete = (key: keyof RecordItem) => {
    setRecord({ ...record, [key]: undefined });
  };

  // ===== 記録保存 =====
  const handleSaveRecord = () => {
    const today = new Date().toISOString().split("T")[0];
    const newRecord: RecordItem = {
      date: record.date || today,
      weight: record.weight,
      bodyFat: record.bodyFat,
      muscleMass: record.muscleMass,
      waist: record.waist,
    };
    setRecordsHistory([...recordsHistory, newRecord]);
    setRecord({});
  };

  // ===== モーダル =====
  const openModal = (name: string) => {
    setModalData({ name });
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const getChartData = (name: string) => {
    return recordsHistory.map((r) => {
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
    <div style={{ padding: "16px" }}>
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
          <li key={key} style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ width: "120px", fontWeight: "bold" }}>{label}:</span>
            <input
              type={key === "date" ? "date" : "number"}
              value={record[key] ?? ""}
              onChange={(e) => handleInputChange(key, e.target.value)}
              style={{
                flex: 1,
                marginRight: "8px",
                padding: "8px",
                border: "2px solid #888",
                borderRadius: "6px",
                fontSize: "16px",
              }}
            />
            {key !== "date" && (
              <>
                <button onClick={() => handleDelete(key)} style={{ marginRight: "4px" }}>×</button>
                <button onClick={() => openModal(label)}>📈</button>
              </>
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
          <li key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ width: "120px", fontWeight: "bold" }}>{label}:</span>
            <input
              type="number"
              value={value}
              readOnly
              style={{
                flex: 1,
                marginRight: "8px",
                padding: "8px",
                border: "2px solid #888",
                borderRadius: "6px",
                fontSize: "16px",
                backgroundColor: "#f0f0f0",
              }}
            />
            <button onClick={() => openModal(label)}>📈</button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSaveRecord}
        style={{
          padding: "8px 16px",
          marginTop: "8px",
          borderRadius: "6px",
          border: "1px solid #888",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        記録を保存
      </button>

      {/* メモ欄 */}
      <div style={{ marginTop: "16px" }}>
        <label style={{ fontWeight: "bold" }}>メモ:</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
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

      {/* グラフモーダル */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="グラフ"
        style={{
          content: { maxWidth: "600px", margin: "auto", padding: "20px", borderRadius: "8px" },
        }}
      >
        <h2>{modalData.name}の推移</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getChartData(modalData.name)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <button
          onClick={closeModal}
          style={{
            marginTop: "12px",
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #888",
            cursor: "pointer",
          }}
        >
          閉じる
        </button>
      </ReactModal>
    </div>
  );
}
