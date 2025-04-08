"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { FcGoogle } from "react-icons/fc"
import { Menu } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log({ firstName, lastName, email, password })
    // Redirect to wordlist page after successful signup
    window.location.href = "/wordlist"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Vocora
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/signin" className="text-white hover:text-purple-100 transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="text-white hover:text-purple-100 transition-colors">
              Sign Up
            </Link>
            <Select defaultValue="english">
              <SelectTrigger className="w-[120px] bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button className="text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-purple-700 py-3 px-4 flex flex-col gap-3">
            <Link
              href="/signin"
              className="text-white hover:text-purple-100 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="text-white hover:text-purple-100 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
            <Select defaultValue="english">
              <SelectTrigger className="w-full bg-white/20 border-white/30 text-white mt-1">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="chinese">Chinese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-purple-100 shadow-md dark:border-purple-800 dark:bg-slate-800">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Sign up</CardTitle>
                <CardDescription className="text-center dark:text-slate-400">
                  Enter your information below to create your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="dark:text-slate-200">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="dark:text-slate-200">
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-slate-200">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="dark:text-slate-200">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-purple-200 focus-visible:ring-purple-500 dark:border-purple-800 dark:bg-slate-900"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600"
                  >
                    Sign Up
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-purple-200 dark:border-purple-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-purple-200 text-slate-700 hover:bg-purple-50 flex items-center gap-2 justify-center dark:border-purple-800 dark:text-slate-300 dark:hover:bg-purple-900/50"
                  >
                    <FcGoogle className="h-5 w-5" />
                    <span>Sign up with Google</span>
                  </Button>

                  <div className="text-center text-sm mt-6">
                    <span className="text-slate-600 dark:text-slate-400">Already have an account? </span>
                    <Link
                      href="/signin"
                      className="text-purple-600 hover:text-purple-800 font-medium dark:text-purple-400 dark:hover:text-purple-300"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
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
