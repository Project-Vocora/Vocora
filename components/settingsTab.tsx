import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface SettingsTabProps {
  onClose: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ onClose }) => {
  const [words, setWords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [hoveredWord, setHoveredWord] = useState<{ word: string; index: number } | null>(null);
  const [definitions, setDefinitions] = useState<{ [key: string]: { definition: string; partOfSpeech: string } }>({});

  
  return (
    <div
      className="absolute top-16 left-1/2 transform -translate-x-1/2 w-[500px] max-h-[80vh] p-4 bg-white shadow-lg rounded-md overflow-visible"
      style={{
        left: `min(50%, calc(100vw - 500px - 16px))`,
        transform: `translateX(-50%)`,
      }}
    >
      <h2 className="text-lg font-semibold mb-4">Practice Tab</h2>

      <div className="mb-4 text-gray-700 font-roboto">
        <h3 className="text-md font-semibold">Words:</h3>
        <p>
          {words.map((word, index) => (
            <span
              key={index}
              className="cursor-pointer hover:underline text-blue-600"
              onMouseEnter={() => setHoveredWord({ word, index })}
              onMouseLeave={() => setHoveredWord(null)}
            >
              {word}
              {index < words.length - 1 && ", "}
            </span>
          ))}
        </p>
      </div>

      {story && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">Generated Story:</h3>
          <p className="text-gray-700 relative text-lg leading-6">
            {story.split(/\b/).map((word, index) => {
              const cleanWord = word.replace(/[^\w]/g, "").toLowerCase();

              return cleanWord ? (
                <span
                  key={index}
                  className={`relative inline-block cursor-pointer hover:underline ${
                    words.includes(cleanWord) ? "bg-yellow-300" : ""
                  }`}
                  onMouseEnter={() => setHoveredWord({ word: cleanWord, index })}
                  onMouseLeave={() => setHoveredWord(null)}
                >
                  {word}
                  {hoveredWord && hoveredWord.word === cleanWord && hoveredWord.index === index && definitions[cleanWord] && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 bg-gray-100 border border-gray-300 shadow-lg rounded-lg p-3 text-sm overflow-visible">
                      <p className="font-bold text-black">{cleanWord}</p>
                      <p className="text-gray-500 italic">{definitions[cleanWord]?.partOfSpeech || "noun"}</p>
                      <p className="text-gray-700">{definitions[cleanWord]?.definition || "No definition found."}</p>

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
      )}

      <Button className="mt-4" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};
