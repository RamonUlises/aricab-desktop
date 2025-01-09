import { Navbar } from "../components/Navbar";

export function Layout({ children, onClickk }: { children: React.ReactNode, onClickk?: () => void }) {
  return (
    <main className="flex flex-col h-screen">
      <Navbar />
      <div onClick={onClickk} className="w-full h-full flex flex-col bg-slate-200">
        {children}
      </div>
    </main>
  )
}
