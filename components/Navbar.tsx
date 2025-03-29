"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lang/LanguageContext"; // Import the useLanguage hook
import navbarTranslations from "@/lang/Navbar_tr"; // Ensure the import is correct

export function Navbar() {
  const { language, setLanguage } = useLanguage(); // Get language and setter

  // Handle language change
  const handleLanguageChange = (lang: "en" | "es" | "zh") => {
    setLanguage(lang); // Update the language in context
    // You may want to redirect to the homepage or update the URL if needed
    // Example: router.push(`/${lang}/home`);
  };

  return (
    <nav className="w-full bg-[#9747FF] px-6 py-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-white text-3xl font-semibold">Vocora</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href='/login'>
            <Button variant="ghost" className="text-white hover:bg-[#9747FF]/90 hover:text-white">
              {navbarTranslations[language].login} {/* Use translation for Log In */}
            </Button>
          </Link>
          <Link href='/signup'>
            <Button className="bg-[#9747FF] text-white hover:bg-[#8A3DEE]">
              {navbarTranslations[language].signup} {/* Use translation for Sign Up */}
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white text-black gap-2">
                {language === "en" ? "English" : language === "es" ? "Español" : "中文"} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleLanguageChange("en")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("es")}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("zh")}>中文</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
