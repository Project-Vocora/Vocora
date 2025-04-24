"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lang/LanguageContext";
import { Settings, Sparkles, Menu, X,} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { LogOut, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import dashBoardTranslations from "@/lang/Dashboard";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { language } = useLanguage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userInitials, setUserInitials] = useState("UV");
    const router = useRouter();
    const translated = dashBoardTranslations[language];

    // Get user's initials from email
    useEffect(() => {
        const getUserInitials = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) {
                const email = session.user.email;
                const initials = email.split('@')[0].slice(0, 2).toUpperCase();
                setUserInitials(initials);
            }
        };
        getUserInitials();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };
  
    return (
        <header className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-violet-500 text-white">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div>
                        <Link href="/">
                            <h1 className="text-2xl font-bold text-white hover:text-purple-100 transition-colors">Vocora</h1>
                        </Link>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/dashboard/progress">
                        <Badge
                            variant="outline"
                            className="flex gap-1 items-center px-3 py-1.5 border-white/30 bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                        >
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                            <span>{translated.navBar.progressDays}</span>
                        </Badge>
                    </Link>

                    <Link href="/dashboard/account">
                        <Avatar>
                            <AvatarFallback className="bg-white/20 text-white">{userInitials}</AvatarFallback>
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
                        <DropdownMenuLabel>{translated.navBar.settings}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/account">
                                <User className="mr-2 h-4 w-4" />
                                <span>{translated.navBar.profile}</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{translated.navBar.logout}</span>
                        </DropdownMenuItem>
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
                    <Link 
                        href="/dashboard/progress" 
                        className="py-2 flex items-center gap-2 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                        <span>{translated.navBar.progressDays}</span>
                    </Link>
                    <Link 
                        href="/dashboard/account" 
                        className="py-2 flex items-center gap-2 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <User size={16} />
                        <span>{translated.navBar.account}</span>
                    </Link>
                    <Link 
                        href="/dashboard/settings" 
                        className="py-2 flex items-center gap-2 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <Settings size={16} />
                        <span>{translated.navBar.settings}</span>
                    </Link>
                    <button 
                        onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                        }}
                        className="py-2 flex items-center gap-2 text-white"
                    >
                        <LogOut size={16} />
                        <span>{translated.navBar.logout}</span>
                    </button>
                </div>
            )}
      </header>
    );
}