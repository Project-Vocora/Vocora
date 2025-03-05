import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function Navbar() {
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
          <Link href="/login">
            <Button variant="ghost" className="text-white hover:bg-[#9747FF]/90 hover:text-white">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-[#9747FF] text-white hover:bg-[#8A3DEE]">
              Sign Up
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-white text-black gap-2">
                English <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>Spanish</DropdownMenuItem>
              <DropdownMenuItem>Chinese</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
} 