"use client";
import React, { useState, useEffect } from "react";

// --- 動画の型定義 ---
type Video = {
  id: string;       // YouTube動画ID
  title?: string;   // 動画タイトル（取得できなければundefined）
};

const VideoApp: React.FC = () => {
  // --- state管理 ---
  const [videos, setVideos] = useState<Video[]>([]);  // 動画リスト
  const [input, setInput] = useState("");            // URL入力欄
  const [loading, setLoading] = useState(false);     // 追加処理中フラグ

  // --- LocalStorageから初期データ読み込み ---
  useEffect(() => {
    const saved = localStorage.getItem("videos");   // 保存済みデータ取得
    if (saved) {
      setVideos(JSON.parse(saved));                // JSONを配列に変換してstateに反映
    }
  }, []);

  // --- LocalStorageへ保存 ---
  const saveToLocalStorage = (items: Video[]) => {
    localStorage.setItem("videos", JSON.stringify(items)); // 配列をJSON文字列化して保存
  };

  // --- URLから動画IDを抽出 ---
  const extractVideoId = (url: string): string | null => {
    try {
      const parsed = new URL(url);               // URLを解析
      if (parsed.hostname.includes("youtube.com")) {
        return parsed.searchParams.get("v");    // youtube.comの場合 ?v=XXXX を取得
      } else if (parsed.hostname === "youtu.be") {
        return parsed.pathname.substring(1);    // youtu.beの場合 /XXXX を取得
      }
      return null;                               // YouTube以外はnull
    } catch {
      return null;                               // 無効なURLはnull
    }
  };

  // --- 動画を追加（タイトル自動取得） ---
  const handleAddVideo = async () => {
    const videoId = extractVideoId(input.trim());   // URLからID抽出
    if (!videoId) {
      alert("正しいYouTubeのURLを入力してください。");
      return;
    }

    setLoading(true); // 追加中フラグON

    // タイトル自動取得
    let title: string | undefined;
    try {
      const res = await fetch(
        `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
      );
      const data = await res.json();
      title = data.title || undefined;  // タイトルが取得できなければundefined
    } catch {
      title = undefined;                 // 取得失敗時もundefined
    }

    const newVideo: Video = { id: videoId, title }; // 新しい動画オブジェクト作成
    const newVideos = [...videos, newVideo];        // 既存リストに追加
    setVideos(newVideos);                           // state更新
    saveToLocalStorage(newVideos);                  // LocalStorage保存

    setInput("");       // 入力欄クリア
    setLoading(false);  // 追加中フラグOFF
  };

  // --- 動画を削除 ---
  const handleDeleteVideo = (id: string) => {
    const filtered = videos.filter((v) => v.id !== id); // 削除対象以外を残す
    setVideos(filtered);                                // state更新
    saveToLocalStorage(filtered);                       // LocalStorage更新
  };

  return (
    <div className="p-4">
      {/* タイトル */}
      <h2 className="text-xl font-bold mb-4">MY LIST</h2>

      {/* URL入力フォーム */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="YouTubeのURLを入力"
          className="border p-2 flex-1 rounded"
        />
        <button
          onClick={handleAddVideo}
          disabled={loading} // 追加中はボタン無効化
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-500"}`}
        >
          {loading ? "追加中…" : "追加"}
        </button>
      </div>

      {/* ギャラリー表示 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="border p-2 rounded shadow">
            {/* 動画リンク */}
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* サムネイル */}
              <img
                src={`https://img.youtube.com/vi/${video.id}/0.jpg`}
                alt={video.title || "YouTube動画"}
                className="w-full rounded"
              />
              {/* タイトル */}
              <p className="text-center mt-2">
                {video.title ? video.title : "動画を見る"}
              </p>
            </a>
            {/* 削除ボタン */}
            <button
              onClick={() => handleDeleteVideo(video.id)}
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded w-full"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoApp;
