import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto px-6 flex h-[72px] items-center justify-between">
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-semibold">Vocora</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-end gap-4">
          <Link href="/vocab">
            <Button className="bg-[#9747FF] text-white hover:bg-[#8A3DEE]">
              Vocab
            </Button>
          </Link>
          <Link href="/settings" className="mr-4">
            <span className="text-sm hover:text-gray-600">Settings</span>
          </Link>
          <Link href="/">
            <span className="text-sm text-red-600 hover:text-red-700">Log out</span>
          </Link>
        </div>
      </div>
    </header>
  )
} 