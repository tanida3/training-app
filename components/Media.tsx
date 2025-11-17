import { FaYoutube } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen text-black p-4 pb-24 sm:w-200 mx-auto">
      {/* 胸 */}
      <div className="mb-6">
        <div className="bg-blue-500 text-white px-3 py-2 rounded-t-md font-semibold">
          胸
        </div>
        <div className="bg-white border border-gray-300 border-t-0 rounded-b-md divide-y divide-gray-300">
          {["ベンチプレス", "ペックフライ", "チェストプレス"].map((item) => (
            <div key={item} className="flex justify-between items-center px-3 py-2">
              <span>{item}</span>
              <a
                href={`https://www.youtube.com/results?search_query=${item}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 背中 */}
      <div className="mb-6">
        <div className="bg-blue-500 text-white px-3 py-2 rounded-t-md font-semibold">
          背中
        </div>
        <div className="bg-white border border-gray-300 border-t-0 rounded-b-md divide-y divide-gray-300">
          {["ラットプルダウン", "ベントオーバーロー", "デッドリフト"].map((item) => (
            <div key={item} className="flex justify-between items-center px-3 py-2">
              <span>{item}</span>
              <a
                href={`https://www.youtube.com/results?search_query=${item}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 脚 */}
      <div className="mb-6">
        <div className="bg-blue-500 text-white px-3 py-2 rounded-t-md font-semibold">
          脚
        </div>
        <div className="bg-white border border-gray-300 border-t-0 rounded-b-md divide-y divide-gray-300">
          {["スクワット", "レッグプレス"].map((item) => (
            <div key={item} className="flex justify-between items-center px-3 py-2">
              <span>{item}</span>
              <a
                href={`https://www.youtube.com/results?search_query=${item}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 腕 */}
      <div className="mb-6">
        <div className="bg-blue-500 text-white px-3 py-2 rounded-t-md font-semibold">
          腕
        </div>
        <div className="bg-white border border-gray-300 border-t-0 rounded-b-md divide-y divide-gray-300">
          {["アームカール", "バーベルカール", "ケーブルプレスダウン"].map((item) => (
            <div key={item} className="flex justify-between items-center px-3 py-2">
              <span>{item}</span>
              <a
                href={`https://www.youtube.com/results?search_query=${item}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 肩 */}
      <div className="mb-6">
        <div className="bg-blue-500 text-white px-3 py-2 rounded-t-md font-semibold">
          肩
        </div>
        <div className="bg-white border border-gray-300 border-t-0 rounded-b-md divide-y divide-gray-300">
          {["サイドレイズ", "ショルダープレス", "フロントレイズ"].map((item) => (
            <div key={item} className="flex justify-between items-center px-3 py-2">
              <span>{item}</span>
              <a
                href={`https://www.youtube.com/results?search_query=${item}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* 腹筋 */}
      <div className="mb-6">
        <div className="bg-blue-500 text-white px-3 py-2 rounded-t-md font-semibold">
          腹筋
        </div>
        <div className="bg-white border border-gray-300 border-t-0 rounded-b-md divide-y divide-gray-300">
          {["プランク", "上体起こし"].map((item) => (
            <div key={item} className="flex justify-between items-center px-3 py-2">
              <span>{item}</span>
              <a
                href={`https://www.youtube.com/results?search_query=${item}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800"
              >
                <FaYoutube size={20} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
