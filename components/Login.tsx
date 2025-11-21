"use client";

import { useRouter } from "next/navigation";

export default function SignUpButton() {
  const router = useRouter();

  const goToTraining = () => {
    router.push("/login"); // ← 遷移先は自由に変更OK
  };

  return (
    <div className="absolute top-4 left-4 w-32">
      <button
        onClick={goToTraining}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-blue-400 transform hover:scale-95 "
      >
        ログイン
      </button>
    </div>
  );
}
