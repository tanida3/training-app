import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen pt-16">
      <Header />
      <div className="relative min-h-screen">
        {/* コンテンツ部分 */}
      </div>
      <Footer />
    </div>
  );
}