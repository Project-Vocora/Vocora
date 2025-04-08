"use client"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Settings, LogOut, Plus, Trash2, Menu, X, Sparkles, User } from 'lucide-react'
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Word {
  id: string;
  word: string;
  translation?: string;
  language: string;
}

export default function WordListPage() {
  const wordList: Word[] = []
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-white">
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

      <main className="flex-1 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="border-purple-100 shadow-md dark:border-purple-800 dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-800 dark:text-purple-300">
                  Vocabulary List
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {wordList.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Your vocabulary list is empty</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 gap-2">
                        <Plus className="h-4 w-4" />
                        Add Words
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50 gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Words
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {wordList.map((word, index) => (
                        <motion.div
                          key={word.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            variant="outline"
                            className="px-3 py-1.5 border-purple-200 text-purple-800 bg-purple-50 hover:bg-purple-100 cursor-pointer dark:border-purple-700 dark:text-purple-300 dark:bg-purple-900/50 dark:hover:bg-purple-900"
                          >
                            {word.word}
                            {word.translation && (
                              <span className="ml-2 text-slate-500 dark:text-slate-400">
                                ({word.translation})
                              </span>
                            )}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                      <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 gap-2">
                        <Plus className="h-4 w-4" />
                        Add Words
                      </Button>
                      <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50 gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete Words
                      </Button>
                    </div>
                  </>
                )}

                <div className="mt-8 p-4 md:p-6 bg-purple-50 rounded-lg border border-purple-100 dark:bg-purple-900/30 dark:border-purple-800">
                  <h3 className="text-lg font-medium text-purple-800 dark:text-purple-300 mb-2">Success!</h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Your account has been created successfully. You can now start learning with Vocora!
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <footer className="bg-white border-t border-purple-100 py-4 dark:bg-slate-800 dark:border-purple-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center text-sm text-slate-500 dark:text-slate-400">
            © 2025 Vocora. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
