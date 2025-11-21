import Calendar from "../components/Calendar";
import TodayBotton from "../components/TodayBotton"
import Goal from "../components/Goal"
import Login from "../components/Login";

export default function Home() {
  return (
    <>
      {/* カレンダーを中央に配置 */}
      <Login/>
      <div className="flex-1 flex items-start justify-start p-4">
        <Calendar />
      </div>
      <TodayBotton/>
      
      <Goal/>

        
  </>
  );
}
