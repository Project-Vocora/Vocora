"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Navbar } from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lang/LanguageContext"; // Import the useLanguage hook
import loginTranslations from "@/lang/login"; // Import the login translations

export default function LoginPage() {
  const { language } = useLanguage(); // Get current language from context
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        // Update error message for email not confirmed
        if (signInError.message.includes("Email not confirmed")) {
          throw new Error(loginTranslations[language].errorEmailNotConfirmed);
        } else {
          throw new Error(signInError.message);
        }
      }

      console.log("Authentication successful.", loginData);
      // When we successfully complete the Home page our login page will redirect towards it.
      // router.push(`/home?lang=${language}`);
      // For right now : 
      router.push(`/success`);
    } catch (error) {
      console.error("Error during form submission:", error);
      setError(error instanceof Error ? error.message : loginTranslations[language].unexpectedError);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    setError(null);

    const googleLang = language === "es" ? "es-419" : language;
    // const redirectURL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/home?lang=${language}`;
    // For right now: 
    const redirectURL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/success`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectURL,
        queryParams: {
          // Changes the Google OAuth login screen language
          hl: googleLang,
        },
      },
    });

    if (error) {
      console.error("Google OAuth Error:", error.message);
      setError(error.message);
    }
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 72px)" }}>
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{loginTranslations[language].title}</CardTitle>
            <CardDescription>
              {loginTranslations[language].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{loginTranslations[language].emailLabel}</Label>
                <Input id="email" name="email" type="email" placeholder={loginTranslations[language].emailPlaceholder} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{loginTranslations[language].passwordLabel}</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-[#9747FF] text-white hover:bg-[#8A3DEE]" disabled={isLoading}>
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                {loginTranslations[language].signInButton}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button variant="outline" className="w-full border-[#9747FF] text-[#9747FF] hover:bg-[#9747FF]/10" onClick={handleGoogleSignIn}>
              <Icons.google className="mr-2 h-4 w-4" />
              {loginTranslations[language].googleSignIn}
            </Button>
            <Button variant="link" className="w-full" onClick={() => router.push(`/${language}/signup`)}>
              {loginTranslations[language].signUpLink}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
