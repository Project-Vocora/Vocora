import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import  { PracticeTab } from "./PracticeTab"
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

  const clearGoogleCookies = () => {
    // Clear Google OAuth cookies
    document.cookie = 'G_AUTHUSER_H=0; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'G_AUTHUSER_H=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  };
  
  const handleLogout = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
  
    // Sign out from Google
    if (window.gapi) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      await auth2.signOut();
    }
  
    // Clear Google OAuth cookies
    clearGoogleCookies();
  
    // Get the previously stored language
    const language = localStorage.getItem('language') || 'en';
  
    // Redirect the user to the appropriate homepage
    router.push(`/${language}`);
  
    localStorage.removeItem("language");
  };
  

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto px-6 flex h-[72px] items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link href="/spanish" className="flex items-center">
            <span className="text-3xl font-semibold">Vocora</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
        
        <div className="relative">
            <Button
              className="bg-[#FF9147] text-white hover:bg-[#E67E33]"
              onClick={togglePractice}
            >
              Practicar
            </Button>
            {showPractice && <PracticeTab onClose={togglePractice} />} {}
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
            <span className="text-sm text-red-600 hover:text-red-700"onClick={handleLogout}>Cerrar sesión</span>
          </Link>
        </div>
      </div>
    </header>
  )
} 