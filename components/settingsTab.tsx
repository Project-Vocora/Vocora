import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lang/LanguageContext";

const translations: Record<"en" | "es", { title: string; options: string; description: string; close: string }> = {
  en: {
    title: "Settings",
    options: "Settings Options:",
    description: "⚙️ Add your settings here (e.g., theme, notifications, preferences).",
    close: "Close",
  },
  es: {
    title: "Configuración",
    options: "Opciones de configuración:",
    description: "⚙️ Agrega tu configuración aquí (ej. tema, notificaciones, preferencias).",
    close: "Cerrar",
  },
};

export const SettingsTab: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { language } = useLanguage();
  const t = translations[language as "en" | "es"] || translations.en; // Ensure valid language fallback
  const tabRef = useRef<HTMLDivElement | null>(null);

  // Close tab if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabRef.current && !tabRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={tabRef}
      className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[min(90vw,500px)] max-h-[80vh] p-4 bg-white shadow-lg rounded-md overflow-y-auto bg-white"
    >
      <h2 className="text-lg font-semibold mb-4">{t.title}</h2>
      <div className="mb-4 text-gray-700">
        <h3 className="text-md font-semibold">{t.options}</h3>
        <p>{t.description}</p>
      </div>
      <Button className="mt-4 bg-gray-500 text-white hover:bg-gray-600" onClick={onClose}>
        {t.close}
      </Button>
    </div>
  );
};
