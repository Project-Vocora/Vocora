import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useHoverWord(practiceLang: string, words: string[], setWords: React.Dispatch<React.SetStateAction<string[]>>) {
  const [hoveredWord, setHoveredWord] = useState<{ word: string; index: number } | null>(null);
  const [definitions, setDefinitions] = useState<{ [key: string]: { definition: string; partOfSpeech: string } }>({});

  useEffect(() => {
    if (!hoveredWord || definitions[hoveredWord.word]) return;

    const fetchDefinition = async () => {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${hoveredWord.word}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setDefinitions((prev) => ({
            ...prev,
            [hoveredWord.word]: {
              definition: data[0].meanings[0].definitions[0].definition,
              partOfSpeech: data[0].meanings[0].partOfSpeech,
            },
          }));
        } else {
          setDefinitions((prev) => ({
            ...prev,
            [hoveredWord.word]: {
              definition: "Definition not found.",
              partOfSpeech: "Unknown",
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching definition:", error);
        setDefinitions((prev) => ({
          ...prev,
          [hoveredWord.word]: {
            definition: "Error retrieving definition.",
            partOfSpeech: "Unknown",
          },
        }));
      }
    };

    fetchDefinition();
  }, [hoveredWord]);

  const handleAddHoveredWord = async () => {
    if (!hoveredWord?.word) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (!words.includes(hoveredWord.word)) {
      const { error } = await supabase
        .from("vocab_words")
        .insert([{ word: hoveredWord.word, language: practiceLang, uid: user.id}]);

      if (error) {
        console.error("Error adding hovered word:", error);
      } else {
        setWords([...words, hoveredWord.word]);
      }
    }
  };

  return {
    hoveredWord,
    setHoveredWord,
    definitions,
    handleAddHoveredWord,
  };
}
