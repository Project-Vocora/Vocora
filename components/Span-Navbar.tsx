// components/Span-Navbar.tsx
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
import { SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";

export function SpanishNavbar() {
  const [language, setLanguage] = useState("Español");
  const router = useRouter();

  const handleLanguageChange = (lang: SetStateAction<string>) => {
    setLanguage(lang);
    if (lang === "Español") {
      router.push("/spanish"); // Navigate to the Spanish page
    } else if (lang === "English") {
      router.push("/"); // Redirect to the English home page
    } else if (lang === "Mandarin") {
      router.push("/mandarin-page"); // Adjust as necessary
    }
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
          <Link href="/spanish/login">
            <Button variant="ghost" className="text-white hover:bg-[#9747FF]/90 hover:text-white">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/spanish/signup">
            <Button className="bg-[#9747FF] text-white hover:bg-[#8A3DEE]">
              Registrarse
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white text-black gap-2">
                {language} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleLanguageChange("Español")}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("English")}>English</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange("Mandarin")}>中文</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
