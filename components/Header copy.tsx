type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  return (
    <header className={`bg-blue-500 h-16 flex items-center justify-center ${className || ""}`}>
      <h1 className="text-white text-xl font-bold">PowerLog</h1>
    </header>
  );
}
