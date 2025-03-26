"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// Define a type for the supported languages
type Language = "en" | "es" | "zh";

// Create the context with the correct type
const LanguageContext = createContext<{
  language: Language; // Use the Language type
  setLanguage: (lang: Language) => void; // Use the Language type
} | null>(null);

// Create provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en"); // Set the initial language to 'en'

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for using the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
