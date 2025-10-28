import Calendar from "../components/Calendar";
import TodayBotton from "../components/TodayBotton";
import TrainingAddButton from "../components/TrainingAddButton";

export default function Home() {
  return (
    <>
      {/* カレンダーを中央に配置 */}
      <div className="flex-1 flex items-start justify-start p-4">
        <Calendar />
      </div>
      
      <TodayBotton/>
      
      {/* トレーニング追加ボタン（右下固定） */}
      <TrainingAddButton />
    </>
  );
}