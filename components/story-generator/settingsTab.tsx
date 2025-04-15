import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/lang/LanguageContext";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import settingsTranslations from "@/lang/SettingsTab";

interface SettingsTabProps {
  onClose: () => void;
}

export function SettingsTab({ onClose }: SettingsTabProps) {
  const { language, setLanguage } = useLanguage();
  const [preferredLang, setPreferredLang] = useState<"en" | "es" | "zh">("en");
  const [practiceLang, setPracticeLang] = useState<"en" | "es" | "zh">("en");

  useEffect(() => {
    const fetchPreferences = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) return;

      const { data, error } = await supabase
        .from("user_preferences")
        .select("preferred_lang, practice_lang")
        .eq("uid", session.user.id)
        .single();

      if (!error && data) {
        setPreferredLang(data.preferred_lang);
        setPracticeLang(data.practice_lang);
      }
    };

    fetchPreferences();
  }, []);

  const updatePreference = async (field: "preferred_lang" | "practice_lang", value: "en" | "es" | "zh") => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) return;

    const { error } = await supabase
      .from("user_preferences")
      .update({ [field]: value })
      .eq("uid", session.user.id);

    if (!error && field === "preferred_lang") {
      setLanguage(value);
    }
  };

  const fallbackTranslation = {
    preferredLanguage: "Language",
    practiceLanguage: "Practice Language"
  };

  const translations = {
    ...fallbackTranslation,
    ...settingsTranslations[language as keyof typeof settingsTranslations]
  };

  return (
    <div className="w-[350px] max-h-[80vh] p-4 bg-white shadow-lg rounded-md overflow-visible">
      <div className="flex items-center justify-between">
        <span className="font-medium text-black">{translations.preferredLanguage}</span>
        <Select value={preferredLang} onValueChange={(val) => {
          setPreferredLang(val as "en" | "es" | "zh");
          updatePreference("preferred_lang", val as "en" | "es" | "zh");
        }}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-medium text-black">{translations.practiceLanguage}</span>
        <Select value={practiceLang} onValueChange={(val) => {
          setPracticeLang(val as "en" | "es" | "zh");
          updatePreference("practice_lang", val as "en" | "es" | "zh");
        }}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end">
        <Button onClick={onClose} className="mt-2 text-sm">Close</Button>
      </div>
    </div>
  );
}