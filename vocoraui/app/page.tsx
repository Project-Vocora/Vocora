"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { Menu } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { VocoraMascot } from "@/components/vocora-mascot"

export default function StartPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
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

      <main className="flex-1 flex items-center bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-[250px] md:max-w-[400px]"
            >
              <div className="w-full h-auto bg-purple-100 dark:bg-purple-900 rounded-full p-8 flex items-center justify-center">
                <VocoraMascot className="w-full h-auto" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-6 text-center md:text-left max-w-[600px]"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                Learn Languages with AI
              </h1>
              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300">
                Using cutting-edge AI technology to help push your language learning journey to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600"
                  >
                    Let's Get Started
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Personalized Learning",
                description: "AI-powered lessons adapt to your skill level and learning style for maximum efficiency.",
                icon: "🧠",
              },
              {
                title: "Interactive Practice",
                description: "Engage in natural conversations with our AI language partners anytime, anywhere.",
                icon: "🗣️",
              },
              {
                title: "Track Your Progress",
                description: "Visualize your improvement with detailed analytics and achievement badges.",
                icon: "📈",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md border border-purple-100 hover:shadow-lg hover:border-purple-200 transition-all dark:bg-slate-800 dark:border-purple-800 dark:hover:border-purple-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-purple-300">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 md:mt-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent inline-block">
                Join other users in language learning today
              </h2>
              <div className="flex justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600"
                  >
                    Sign Up for Free
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-purple-100 py-6 md:py-8 dark:bg-slate-800 dark:border-purple-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <VocoraMascot width={24} height={24} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-violet-500 bg-clip-text text-transparent">
                Vocora
              </span>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-slate-600 hover:text-purple-600 transition-colors dark:text-slate-300 dark:hover:text-purple-400"
              >
                About
              </Link>
              <Link
                href="#"
                className="text-slate-600 hover:text-purple-600 transition-colors dark:text-slate-300 dark:hover:text-purple-400"
              >
                Privacy
              </Link>
              <Link
                href="#"
                className="text-slate-600 hover:text-purple-600 transition-colors dark:text-slate-300 dark:hover:text-purple-400"
              >
                Terms
              </Link>
              <Link
                href="#"
                className="text-slate-600 hover:text-purple-600 transition-colors dark:text-slate-300 dark:hover:text-purple-400"
              >
                Contact
              </Link>
            </div>

            <div className="text-sm text-slate-500 mt-4 md:mt-0 dark:text-slate-400">
              © 2025 Vocora. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
