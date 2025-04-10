import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { PracticeTab } from "./PracticeTab"
import { VocabTab} from "./vocabTab";
import { SettingsTab } from "./settingsTab"
import { useLanguage } from "@/lang/LanguageContext"; // Import the useLanguage hook
import headerTranslations from "@/lang/header"; // Import the login translations

export function Header() {
  const [showPractice, setShowPractice] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const tabRef = useRef<HTMLDivElement>(null);

  // Fetch user session
  useEffect(() => {
    const fetchUserSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession(); 
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setUser(session?.user || null);
      }
    };
    
    fetchUserSession();
  },[]);
  
  // Toggle functions (only one tab at a time)
  const togglePractice = () => {
    setShowPractice((prev) => !prev);
    setShowVocab(false);
    setShowSettings(false);
  };
  
  const toggleVocab = () => {
    setShowVocab((prev) => !prev);
    setShowPractice(false);
    setShowSettings(false);
  };
  
  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
    setShowPractice(false);
    setShowVocab(false);
  };
  
  // Close tabs when clicking outside or pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPractice(false);
        setShowVocab(false);
        setShowSettings(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
        <div className="flex-1 flex items-center justify-end gap-4" ref={tabRef}>
          {/* Practice Button */}
          <div className="relative">
            <Button
              className="bg-[#FF9147] text-white hover:bg-[#E67E33]"
              onClick={togglePractice}
            >
              {headerTranslations[language].practice}
            </Button>
            {showPractice && <PracticeTab onClose={() => setShowPractice(false)} />}
          </div>

          {/* Vocab Button */}
          <div className="relative">
            <Button 
              className="bg-[#9747FF] text-white hover:bg-[#8A3DEE]"
              onClick={toggleVocab}
            >
              {headerTranslations[language].vocab}
            </Button>
            {showVocab && <VocabTab user = {user} onClose={() => setShowVocab(false)}/>}
          </div>

          {/* Settings Button */}
          <div className="relative flex items-center">
            <button
              className="flex items-center gap-2 text-black"
              onClick={toggleSettings}
            >
              {showSettings && (
                <span className="text-sm font-semibold">Settings</span>)}
                <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-md hover:bg-gray-300">
                  <Image src="/gear_icon.png" alt="Settings" width={20} height={20} />
                </div>
            </button>
            {showSettings && (
              <div className="absolute top-full left-0 mt-2 z-50">
                <SettingsTab onClose={() => setShowSettings(false)} />
              </div>
            )}
          </div>

          <Link href="/">
            <span className="text-sm text-red-600 hover:text-red-700" onClick={handleLogout}>
            {headerTranslations[language].logout}
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
