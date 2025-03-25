import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import  { PracticeTab } from "./PracticeTab"
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function Header() {
  const [showTab, setShowTab] = useState(false);
  const router = useRouter();
  const handleToggle = () => {
    setShowTab((prev) => !prev);
  };
  const handleClose = () => {
    setShowTab(false);
  };

  const handleLogout = async () => {
    // Log the user out using Supabase
    await supabase.auth.signOut();
    
    // Redirect the user back to the homepage w/ its appropriate language
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
              onClick={handleToggle}
            >
              Practice
            </Button>
            {showTab && <PracticeTab onClose={handleClose} />} {}
          </div>
          
          <Link href="/vocab">
            <Button className="bg-[#9747FF] text-white hover:bg-[#8A3DEE]">
              Vocab
            </Button>
          </Link>
          <Link href="/settings" className="mr-4">
            <span className="text-sm hover:text-gray-600">Settings</span>
          </Link>
          <Link href="/">
            <span className="text-sm text-red-600 hover:text-red-700" onClick={handleLogout}>Log out</span>
          </Link>
        </div>
      </div>
    </header>
  )
} 