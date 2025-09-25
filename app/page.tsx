import Header from "../components/Header";
import Calendar from "../components/Calendar";
import Footer from "../components/Footer"
import TodayBotton from "../components/TodayBotton"


export default function Home() {
  return (
    <>
      {/* カレンダーを中央に配置 */}
      <div className="flex-1 flex items-start justify-start p-4">
        <Calendar />
      </div>
      あ
      <TodayBotton/>
        <Footer />
  </>
  );
}
