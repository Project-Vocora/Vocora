"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import {SetStateAction, useState } from "react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [language, setLanguage] = useState("en")
  const router = useRouter()

  const handleLanguageChange = (lang: SetStateAction<string>) => {
    setLanguage(lang)
    if (lang == "es") {
      router.push("/es")
    }
    else if (lang == "zh") {
      alert("中文页面即将推出！(Mandarin page is coming soon!)");
    }
    //would add the rest of the languages here later
  }
  const loginUrl = `/${language.toLowerCase()}/login`;
  const signupUrl = `/${language.toLowerCase()}/signup`;

  return (
    <nav className="w-full bg-[#9747FF] px-6 py-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-white text-3xl font-semibold">
              Vocora
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href={loginUrl}>
            <Button variant="ghost" className="text-white hover:bg-[#9747FF]/90 hover:text-white">
              Log In
            </Button>
          </Link>
          <Link href={signupUrl}>
            <Button className="bg-[#9747FF] text-white hover:bg-[#8A3DEE]">
              Sign Up
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white text-black gap-2"> {language === "en" ? "English" : language === "es" ? "Español" : "中文"} <ChevronDown className="h-4 w-4" />
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
  )
} 