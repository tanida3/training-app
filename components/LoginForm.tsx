"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/src/firebase";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ← 成功メッセージ用

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("ログインに成功しました！");
      setError(""); // エラーをリセット
      // 少し遅延させてからページ遷移（0.5秒後など）
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err: any) {
      console.error("ログイン失敗:", err.message);
      setError("ログインに失敗しました。メールアドレスまたはパスワードが間違っています。");
      setSuccess(""); // 成功メッセージをリセット
    }
  };

  const registration = () => {
    router.push("/Registration");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white border rounded-2xl shadow-2xl">
        <h2 className="text-2xl mb-6 font-bold text-center">ログイン</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>} {/* 成功メッセージ表示 */}

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded text-lg"
        />

        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded text-lg"
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 text-white py-3 text-lg rounded hover:bg-blue-700 transition"
        >
          ログイン
        </button>

        <button
          onClick={registration}
          className="w-full bg-blue-600 text-white py-3 text-lg rounded mt-2 hover:bg-blue-700 transition"
        >
          新規登録
        </button>
      </div>
    </div>
  );
}
