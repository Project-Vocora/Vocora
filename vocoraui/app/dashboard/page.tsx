"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Bookmark,
  Globe,
  Lightbulb,
  List,
  MessageSquare,
  Mic,
  Settings,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { LogOut, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("spanish")
  const [progress, setProgress] = useState(68)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <Link href="/">
                <h1 className="text-2xl font-bold text-white">Vocora</h1>
              </Link>
            </div>
          </div>

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

            <Link href="/account">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback className="bg-white/20 text-white">UV</AvatarFallback>
              </Avatar>
            </Link>

            <div className="border-l border-white/20 pl-4 ml-2">
              <ThemeToggle />
            </div>

            <div className="border-l border-white/20 pl-4 ml-2">
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
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <div className="border-l border-white/20 pl-4">
              <ThemeToggle />
            </div>
            <button className="text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          <section className="mb-8">
            <Card className="overflow-hidden border-purple-100 shadow-md dark:border-purple-800 dark:bg-slate-800">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-4 md:p-6 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-xl font-bold mb-1">Welcome back!</h2>
                      <p className="text-purple-100">Continue your language journey</p>
                    </div>

                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-full md:w-[180px] bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                    <Link href="/speaking" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-2 md:py-3 px-2 md:px-4 border-purple-100 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/50"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Mic className="h-5 w-5 text-purple-500" />
                          <span className="text-sm md:text-base">Speaking</span>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/reading" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-2 md:py-3 px-2 md:px-4 border-purple-100 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/50"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <BookOpen className="h-5 w-5 text-purple-500" />
                          <span className="text-sm md:text-base">Reading</span>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/writing" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-2 md:py-3 px-2 md:px-4 border-purple-100 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/50"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <MessageSquare className="h-5 w-5 text-purple-500" />
                          <span className="text-sm md:text-base">Writing</span>
                        </div>
                      </Button>
                    </Link>
                    <Link href="/quiz" className="w-full">
                      <Button
                        variant="outline"
                        className="w-full h-auto py-2 md:py-3 px-2 md:px-4 border-purple-100 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-900/50"
                      >
                        <div className="flex flex-col items-center gap-1">
                          <Lightbulb className="h-5 w-5 text-purple-500" />
                          <span className="text-sm md:text-base">Quiz</span>
                        </div>
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Practice</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Beginner", "Intermediate", "Advanced"].map((level, index) => (
                <motion.div
                  key={level}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer group dark:border-purple-800 dark:bg-slate-800 dark:hover:border-purple-700">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg group-hover:text-purple-600 transition-colors dark:group-hover:text-purple-400">
                        {level}
                      </CardTitle>
                      <CardDescription className="dark:text-slate-400">
                        {index === 0
                          ? "Perfect for newcomers"
                          : index === 1
                            ? "Enhance your skills"
                            : "Master the language"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-black hover:bg-gray-800 text-white dark:bg-black dark:hover:bg-gray-800 dark:text-white">
                        Start Lesson
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Story Generator</h2>
            <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Generate a story in {selectedLanguage}</CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Create a custom story to practice reading and vocabulary
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-3">
                <Select defaultValue="short">
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Story length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short story</SelectItem>
                    <SelectItem value="medium">Medium story</SelectItem>
                    <SelectItem value="long">Long story</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Story
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="grid md:grid-cols-2 gap-6">
            <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5 text-purple-500" />
                  Word Lists
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Review and learn vocabulary words</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/wordlist">
                  <Button variant="outline" className="w-full border-purple-200 dark:border-purple-800">
                    View Words
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-purple-100 dark:border-purple-800 dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-purple-500" />
                  Saved Items
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Access your bookmarked lessons and words
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/saved">
                  <Button variant="outline" className="w-full border-purple-200 dark:border-purple-800">
                    View Saved
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <footer className="mt-8 md:mt-12 border-t border-purple-100 py-6 text-center text-sm text-slate-500 dark:border-purple-900 dark:text-slate-400">
        <div className="container mx-auto">
          <p>© 2025 Vocora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
