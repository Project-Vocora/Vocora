import { useState } from "react";

export function useStoryGenerator() {
  const [story, setStory] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [highlightedStory, setHighlightedStory] = useState<string>("");

  const generateStory = async (words: string[], length: string = "medium") => {
    const response = await fetch("/api/generate-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ words, length }),
    });

    const data = await response.json();
    if (data?.story) {
      setStory(data.story);
      return data.story;
    }
    return null;
  };

  const generateImageFromStory = async (story: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });

      const blob = await response.blob();
      const imageObjectURL = URL.createObjectURL(blob);
      setImageUrl(imageObjectURL);
    } catch (e) {
      console.error("Failed to generate image", e);
    } finally {
      setLoading(false);
    }
  };

  const applyHighlighting = (text: string, selectedWords: Set<string>) => {
    let highlighted = text;
    Array.from(selectedWords).forEach((word) => {
      const regex = new RegExp(`\\b${word.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&")}\\b`, "gi");
      highlighted = highlighted.replace(
        regex,
        `<span class="bg-yellow-300 font-bold px-1 rounded">${word}</span>`
      );
    });
    setHighlightedStory(highlighted);
  };

  return {
    story,
    highlightedStory,
    setHighlightedStory,
    loading,
    generateStory,
    generateImageFromStory,
    setStory,
    imageUrl,
    setImageUrl,
    applyHighlighting
  };
}
