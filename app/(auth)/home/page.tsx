"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/lang/LanguageContext";
import homeTransla from "@/lang/home_tr";
import { supabase } from "@/lib/supabase";

export default function HomePage() {
  const { language, setLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const langFromURL = searchParams?.get("lang");
  const [languageReady, setLanguageReady] = useState(false);

  // If language is in URL, update the language context.
  useEffect(() => {
    if (langFromURL && ["en", "es", "zh"].includes(langFromURL)) {
      setLanguage(langFromURL as "en" | "es" | "zh");
    }
  }, [langFromURL, setLanguage]);

  // Markes language as "ready" once language matches URL.
  useEffect(() => {
    if (langFromURL && language === langFromURL) {
      setLanguageReady(true);
    }
  }, [langFromURL, language]);

  // Prevents all actions until language is "ready".
  useEffect(() => {
    if (!languageReady) return;

    const logUserLanguage = async () => {
      // Gets the current user session.
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;

      if (!session) {
        console.warn("No session found.");
        return;
      }

      // Extracts user's information.
      const user = session.user;
      
      // Inserts user's preferences into Supabase table.
      const { error: insertError } = await supabase
        .from("user_preferences")
        .insert({
          uid: user.id,
          preferred_lang: language,
          practice_lang: language,
        })
        .select();
      
      // If row already exists, update it.
      if (insertError) {
        if (insertError.code === "23505" || insertError.message.includes("duplicate key")) {
          console.warn("Insert failed: row exists. Updating instead.");

          const { error: updateError } = await supabase
            .from("user_preferences")
            .update({
              preferred_lang: language,
              practice_lang: language,
            })
            .eq("uid", user.id);

          if (updateError) {
            console.error("User preferences update failed:", updateError.message);
          } else {
            console.log("User preferences updated successfully!");
          }
        } else {
          console.error("User preferences insert failed:", insertError.message);
        }
      } else {
        console.log("User preferences inserted successfully!");
      }
    };
    // Runs when language changes
    logUserLanguage();
  }, [languageReady]);

  // If the language is not ready, DO NOT render anything.
  if (!languageReady) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">{homeTransla[language].title}</h1>
    </div>
  );
}

