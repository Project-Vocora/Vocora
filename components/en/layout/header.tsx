import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { PracticeTab } from "./PracticeTab"
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { SettingsTab } from "./SettingsTab"

export function Header() {
  const [showPractice, setShowPractice] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();

  // Toggle functions
  const togglePractice = () => setShowPractice((prev) => !prev);
  const toggleSettings = () => setShowSettings((prev) => !prev);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto px-6 flex h-[72px] items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-semibold">Vocora</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
        
          <div className="relative">
            <Button
              className="bg-[#FF9147] text-white hover:bg-[#E67E33]"
              onClick={togglePractice}
            >
              Practice
            </Button>
            {showPractice && <PracticeTab onClose={() => setShowSettings(false)} />}
          </div>
          
          <Link href="/vocab">
            <Button className="bg-[#9747FF] text-white hover:bg-[#8A3DEE]">
              Vocab
            </Button>
          </Link>

          {/* Settings Button */}
          <div className="relative">
            <button
              className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={toggleSettings}
            >
              <Image src="/gear_icon.png" alt="Settings" width={24} height={24} />
            </button>
            {showSettings && <SettingsTab onClose={() => setShowSettings(false)} />}
          </div>

          <Link href="/">
            <span className="text-sm text-red-600 hover:text-red-700" onClick={handleLogout}>
              Log out
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
