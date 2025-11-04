'use client';
export default function Home() {
  return (
    <div className="flex gap-6 p-6">
      {/* 右側：ダッシュボード */}
      <div className="absolute top-20 right-2 w-1/2 space-y-4">
        
        {/* 合計負荷量 / 7日間 */}
        <div className="bg-white text-blue-700 p-4 rounded-lg shadow border border-blue-300">
          <h2 className="text-sm font-semibold">合計負荷量 / 7日間</h2>
          <p className="text-3xl font-bold mt-2">0 t</p>
          <p className="text-xs flex items-center mt-1">🚗 × 0.0</p>

          {/* 棒グラフ（全部ゼロ） */}
          <div className="mt-3 space-y-1 text-xs min-h-[155px]">
            {["今週","1週前","2週前","3週前","4週前","5週前"].map((label, idx) => (
              <div className="flex items-center" key={idx}>
                <span className="w-12 text-gray-600">{label}</span>
                <div className="flex-1 bg-blue-200 h-2 ml-2 rounded">
                  <div className="bg-blue-500 h-2 rounded w-0"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 合計負荷量 / 28日間 */}
        <div className="bg-white text-blue-700 p-4 rounded-lg shadow border border-blue-300">
          <h2 className="text-sm font-semibold">合計負荷量 / 28日間</h2>
          <p className="text-3xl font-bold mt-2">0 t</p>
          <p className="text-xs flex items-center mt-1">🚌 × 0.0</p>
        </div>

        {/* 総合負荷量 */}
        <div className="bg-white text-blue-700 p-4 rounded-lg shadow border border-blue-300">
          <h2 className="text-sm font-semibold">総合負荷量</h2>
          <p className="text-3xl font-bold mt-2">0 t</p>
          <p className="text-xs flex items-center mt-1">✈️ × 0.0</p>
        </div>
      </div>
    </div>
  );
}
