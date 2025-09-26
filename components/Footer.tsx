import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md flex justify-around py-2 z-50">
      <Link
        href="/"
        className="flex flex-col items-center text-sm text-black hover:text-blue-500"
      >
        <Image
          src="/home-icon.png"
          alt="ホーム"
          width={24}
          height={24}
          className="mb-1"
        />
        ホーム
      </Link>

      <Link
        href="/trainingu"
        className="flex flex-col items-center text-sm text-black hover:text-blue-500"
      >
        <Image
          src="/training-icon.png"
          alt="トレーニング"
          width={24}
          height={24}
          className="mb-1"
        />
        トレーニング
      </Link>

      <Link
        href="/sokutei"
        className="flex flex-col items-center text-sm text-black hover:text-blue-500"
      >
        <Image
          src="/measure-icon.png"
          alt="測定"
          width={24}
          height={24}
          className="mb-1"
        />
        体組成
      </Link>
    </div>
  );
}
