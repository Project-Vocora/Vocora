"use client"

import { Construction, Menu, X, Sparkles, Settings, LogOut, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState } from "react"

export default function ProgressPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Vocora
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/progress">
              <Badge
                variant="outline"
                className="flex gap-1 items-center px-3 py-1.5 border-white/30 bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-white" />
                <span>Day 12</span>
              </Badge>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link href="/">
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/account">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback className="bg-white/20 text-white">UV</AvatarFallback>
              </Avatar>
            </Link>

            <div className="border-l border-white/20 pl-4 ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <button className="text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="border-l border-white/20 pl-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-purple-700 py-3 px-4 flex flex-col gap-3">
            <Link href="/progress" className="py-2 flex items-center gap-2 text-white">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>Day 12</span>
            </Link>
            <Link href="/account" className="py-2 flex items-center gap-2 text-white">
              <User size={16} />
              <span>Account</span>
            </Link>
            <Link href="/settings" className="py-2 flex items-center gap-2 text-white">
              <Settings size={16} />
              <span>Settings</span>
            </Link>
            <Link href="/" className="py-2 flex items-center gap-2 text-white">
              <LogOut size={16} />
              <span>Log Out</span>
            </Link>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold flex items-center justify-center gap-3">
                <Construction className="h-8 w-8 text-purple-500" />
                Progress Tracking
              </CardTitle>
              <CardDescription className="text-lg dark:text-slate-400">
                This feature is coming soon
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-300 mb-8">
                We're working on an amazing progress tracking system to help you monitor your language learning journey.
                Check back soon!
              </p>
              <Link href="/dashboard">
                <Button 
                  variant="outline" 
                  className="border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/50"
                >
                  Return to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 