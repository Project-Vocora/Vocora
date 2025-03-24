"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/en/layout/header";
import { supabase } from "@/lib/supabase";

export default function SuccessPage() {
  const [words, setWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [generatedStory, setGeneratedStory] = useState("");
  const [highlightedStory, setHighlightedStory] = useState("");
  const [hoveredWord, setHoveredWord] = useState<{ word: string; index: number } | null>(null);
  const [definitions, setDefinitions] = useState<{ [key: string]: { definition: string; partOfSpeech: string } }>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // Fetch words from Supabase database
  useEffect(() => {
    localStorage.setItem("language", "en");
    
    const fetchWords = async () => {
      const { data, error: userError } = await supabase.auth.getUser();

      const userId = data.user?.id;
      const sharedUserId = process.env.NEXT_PUBLIC_SHARED_USER_ID;
      const selectedLanguage = localStorage.getItem("language") || "en"; 
      
      const { data: wordsData, error } = await supabase.from("messages").select("text").in("uid", [userId, sharedUserId]).eq("language", selectedLanguage);
      if (error) {
        console.error("Error fetching words:", error);
      } else {
        setWords(wordsData.map((row) => row.text));
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
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user){
      console.error("Error adding new word:", userError);
      return;
    }

    const selectedLanguage = localStorage.getItem("language") || "en";

    const { error } = await supabase.from("messages").insert([
      { text: newWord, uid: user.id, language: selectedLanguage }
    ]);
    if (error) {
      console.error("Error adding new word:", error);
    } else {
      setWords([...words, newWord]);
      setNewWord("");
    }
  };

  // Function to add the hovered word to the database
  const handleAddHoveredWord = async () => {
    if (!hoveredWord?.word) return;

    const selectedLanguage = localStorage.getItem("language") || "en";

    // Add the word to the database if it's not already present
    if (!words.includes(hoveredWord.word)) {
      const { error } = await supabase.from("messages").insert([{ text: hoveredWord.word, language: selectedLanguage }]);
      if (error) {
        console.error("Error adding hovered word:", error);
      } else {
        setWords([...words, hoveredWord.word]);
      }
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
      setStory(data.story);
      applyHighlighting(data.story);
      await generateImageFromStory(data.story);
    } else {
      setGeneratedStory("Failed to generate story.");
    }
  };

  // This function generates an image from the story
  const generateImageFromStory = async (story: string) => {
    try {
      setLoading(true);
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });

      // Convert response to Blob
      const blob = await response.blob();

      // Convert Blob to Object URL
      const imageObjectURL = URL.createObjectURL(blob);
      console.log("Generated Image URL:", imageObjectURL);
  
      setImageUrl(imageObjectURL);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
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


  // this function converts the text to speech
  const handleConvertToSpeech = async () => {

      if (!story) return alert("Generate a story first!");

      try {
        const response = await fetch("/api/generate-full-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: story }),
        });
    
        if (!response.ok) {
          console.error("Error fetching audio:", response.statusText);
          return alert("Failed to generate audio.");
        }
    
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioSrc(audioUrl); 

        console.log("Audio generated:", audioUrl);
      }
      
      catch (error) {
        console.error("Error in TTS request:", error);
      }
    

  };

  

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex justify-between p-6 max-w-6xl mx-auto w-full gap-8">
        {/* Left-Aligned Content */}
        <div className="flex flex-col items-start justify-center w-1/2 space-y-8">
          <h2 className="text-lg font-semibold self-center w-full text-center">Vocabulary List:</h2>

          {/* Word Input Field */}
          <div className="w-full max-w-2xl">
            <Input
              type="text"
              placeholder="Type a new word..."
              className="w-full h-12 text-lg px-4 rounded-md"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
            />
          </div>

          {/* Word Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              className="bg-purple-500 text-white hover:bg-purple-600"
              onClick={handleAddWord}
            >
              + Add
            </Button>
            {words.map((word, index) => (
              <Button
                key={index}
                variant="outline"
                className={`text-lg ${
                  selectedWords.has(word)
                    ? "bg-purple-600 text-white hover:bg-purple-600 hover:text-white"
                    : "hover:bg-purple-600 hover:text-white bg-white text-black"
                }`}
                onClick={() => toggleWord(word)}
              >
                {word}
              </Button>
            ))}
          </div>

          {/* Story Generation Section */}
          <div className="w-full max-w-2xl mt-8">
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="mb-4 border-purple-500" onClick={handleGenerateStory}>
                + Generate Story
              </Button>

              {generatedStory && (
                <Button variant="secondary" className="bg-purple-500 text-white hover:bg-purple-600" onClick={handleConvertToSpeech}>
                  Read Aloud
                </Button>
              )}

              
              {audioSrc && (
                <audio key={audioSrc} controls autoPlay className="mt-0">
                <source src={audioSrc} type="audio/mpeg" />
                  Your browser does not support the audio element.
              </audio>
            )}
            </div>

            {/* Story Output */}
            <div className="bg-gray-50 rounded-lg p-6 mt-4">
              <p className="text-gray-600 relative text-2xl">
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

                          <button className="mt-2 w-full bg-purple-500 text-white py-1 px-2 rounded text-xs flex items-center justify-center hover:bg-purple-600" onClick={handleAddHoveredWord}>
                            Add to List +
                          </button>

                          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-gray-100 rotate-45 border border-gray-300"></div>
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
        </div>

        {/* Right-Aligned Image Section */}
        <div className="flex w-1/2 justify-center items-center">
          {/* Loading Spinner Section */}
          {loading ? (
            <div className="mt-8 flex justify-center">
              <div className="spinner-border animate-spin border-4 border-t-4 border-purple-500 rounded-full w-16 h-16"></div>
            </div>
          ) : (
            // Displays the image once it's generated
            imageUrl && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4"></h3>
                <img src={imageUrl} alt="Generated Image" className="w-full max-w-2xl h-auto object-contain rounded-lg shadow-lg" />
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}