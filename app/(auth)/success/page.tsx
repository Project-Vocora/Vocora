"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/layout/header";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const [words, setWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [generatedStory, setGeneratedStory] = useState("");
  const [highlightedStory, setHighlightedStory] = useState("");
  const [hoveredWord, setHoveredWord] = useState<{ word: string; index: number } | null>(null);
  const [definitions, setDefinitions] = useState<{ [key: string]: { definition: string; partOfSpeech: string } }>({});

  // Fetch words from Supabase database
  useEffect(() => {
    const fetchWords = async () => {
      const { data, error } = await supabase.from("messages").select("text");
      if (error) {
        console.error("Error fetching words:", error);
      } else {
        setWords(data.map((row) => row.text));
      }
    };
    fetchWords();
  }, []);

  // This function toggles the selection of a word
  const toggleWord = (word: string) => {
    setSelectedWords((prev) => {
      const newSelectedWords = new Set(prev);
      if (newSelectedWords.has(word)) {
        newSelectedWords.delete(word);
      } else {
        newSelectedWords.add(word);
      }
      return newSelectedWords;
    });
  };

  // This function adds a new word to the database
  const handleAddWord = async () => {
    if (newWord.trim() === "") return;
    const { error } = await supabase.from("messages").insert([{ text: newWord }]);
  
    if (error) {
      console.error("Error adding new word:", error);
    } else {
      setWords([...words, newWord]);
      setNewWord("");
    }
  };

  // This function applies highlighting to the generated story
  const applyHighlighting = (story: string) => {
    let highlightedText = story;

    Array.from(selectedWords).forEach((word) => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\b`, "gi");
      highlightedText = highlightedText.replace(regex, `<span class="bg-yellow-300 font-bold px-1 rounded">${word}</span>`);
    });

    setHighlightedStory(highlightedText);
  };

  // This function handles word selection and triggers story generation
  const handleGenerateStory = async () => {
    if (selectedWords.size === 0) return alert("Please select at least one word for the story.");

    const response = await fetch("/api/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words: Array.from(selectedWords) }),
    });

    const data = await response.json();
    if (data?.story) {
      setGeneratedStory(data.story);
      applyHighlighting(data.story);
    } else {
      setGeneratedStory("Failed to generate story.");
    }
  };

  // This function fetches the definition of a word
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
            [hoveredWord.word]: { definition: "Definition not found.", partOfSpeech: "unknown" },
          }));
        }
      } catch (error) {
        console.error("Error fetching definition:", error);
        setDefinitions((prev) => ({
          ...prev,
          [hoveredWord.word]: { definition: "Error fetching definition.", partOfSpeech: "unknown" },
        }));
      }
    };

    fetchDefinition();
  }, [hoveredWord]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center p-6 max-w-4xl mx-auto w-full">
        <div className="w-full max-w-2xl mt-16">
          <Input
            type="text"
            placeholder="Type a new word..."
            className="w-full h-12 text-lg px-4 rounded-md"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
          />
        </div>

        <div className="w-full max-w-2xl mt-12">
          <h2 className="text-lg font-semibold mb-4">Vocabulary List:</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" className="bg-purple-500 text-white hover:bg-purple-600" onClick={handleAddWord}>
              + Add
            </Button>
            {words.map((word, index) => (
              <Button key={index} variant="outline" className={`text-lg ${selectedWords.has(word) ? "bg-purple-600 text-white hover:bg-purple-600 hover:text-white" : "hover:bg-purple-600 hover:text-white bg-white text-black"}`} onClick={() => toggleWord(word)}>
                {word}
              </Button>
            ))}
          </div>
        </div>

        <div className="w-full max-w-2xl mt-12">
          <Button className="bg-purple-500 text-white hover:bg-purple-600 text-lg" onClick={handleGenerateStory}>
            Generate Story
          </Button>
          <div className="bg-gray-50 rounded-lg p-6 mt-4 relative">
            <p className="text-gray-600 relative text-2xl" >
              {generatedStory.split(/\b/).map((word, index) => {
                const cleanWord = word.replace(/[^\w]/g, "").toLowerCase();

                return cleanWord ? (
                  <span
                    key={index}
                    className={`relative inline-block cursor-pointer hover:underline ${selectedWords.has(cleanWord) ? 'bg-yellow-300' : ''}`}
                    
                    onMouseEnter={() => setHoveredWord({ word: cleanWord, index })}
                    onMouseLeave={() => setHoveredWord(null)}
                  >
                    {word}
                    {hoveredWord && hoveredWord.word === cleanWord && hoveredWord.index === index && definitions[cleanWord] && (
                      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 bg-gray-100 border border-gray-300 shadow-lg rounded-lg p-3 text-sm">
                        <p className="font-bold text-black">{cleanWord}</p>
                        <p className="text-gray-500 italic">{definitions[cleanWord]?.partOfSpeech || "noun"}</p>
                        <p className="text-gray-700">{definitions[cleanWord]?.definition || "No definition found."}</p>

                      <button className="mt-2 w-full bg-purple-500 text-white py-1 px-2 rounded text-xs flex items-center justify-center hover:bg-purple-600">
                        Add to List +
                      </button>

                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-3 h-3 bg-gray-100 rotate-45 border border-gray-300"></div>
                      </div>
                    )}
                  </span>
                ) : (
                  word
                );
              })}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
