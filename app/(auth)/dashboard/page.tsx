"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lang/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Bookmark, Lightbulb, List, MessageSquare, Mic, Sparkles, X, Plus } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation";
import dashBoardTranslations from "@/lang/Dashboard";
import { Navbar } from "@/components/dashboard/navbar";
import {SupportChat} from "@/components/support-chat";
import storyGenerator from "@/lang/Story-Generator/story-generator";
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2 } from "lucide-react"
import { useVocabWords } from "@/hooks/useVocabWords";
import { useStoryGenerator } from "@/hooks/useStoryGenerator";
import { useAudio } from "@/hooks/useAudio";
import { useHoverWord } from "@/hooks/useHoverDefinitions";

function useSetLanguageFromURL() {
  const { language, setLanguage } = useLanguage();
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
          email: user.email,
          preferred_lang: language,
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

  return languageReady;
};

function DashboardPage() {
  const languageReady = useSetLanguageFromURL();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const translated = dashBoardTranslations[language];
  const storyTranslated = storyGenerator[language];
  const [newWord, setNewWord] = useState("");
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [highlightedStory, setHighlightedStory] = useState("");
  const [progress, setProgress] = useState(68);
  const [storyLength, setStoryLength] = useState<"short" | "medium" | "long">("medium");
  const [practiceLang, setPracticeLang] = useState<"en" | "es" | "zh">("en");
  const [savedStories, setSavedStories] = useState<any[]>([]);
  const { words, setWords, addWord, deleteWord } = useVocabWords(practiceLang);
  const { story, setStory, imageUrl, setImageUrl, loading,generateStory, generateImageFromStory,} = useStoryGenerator();
  const { audioSrc, convertToSpeech, setAudioSrc } = useAudio();
  const { hoveredWord, setHoveredWord, definitions, handleAddHoveredWord,} = useHoverWord(practiceLang, words, setWords, story || "", language);
  const [isStorySaved, setIsStorySaved] = useState(false);
  const [savingMessage, setSavingMessage] = useState("");
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [isStorySelected, setIsStorySelected] = useState<boolean>(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    setSavingMessage(translated.saveStory);
  }, [language]);

  useEffect(() => {
    const fetchSavedStories = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
  
      const { data, error } = await supabase
        .from("user_stories")
        .select("*")
        .eq("uid", user.id)
        .order("created_at", { ascending: false });
  
      if (!error && data) {
        setSavedStories(data);  // Update the state with the fetched stories
      } else {
        console.error("Error fetching saved stories:", error);
      }
    };
  
    fetchSavedStories();  // Call the function to fetch saved stories
  }, [router]);  // This effect runs whenever the router (and thus the session) changes
  

  const applyHighlighting = (text: string) => {
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

  const handleGenerateStory = async () => {
    if (selectedWords.size === 0) {
      alert(storyTranslated.listError);
      return;
    }
    const result = await generateStory(Array.from(selectedWords), storyLength);
    if (result) {
      applyHighlighting(result);
      await generateImageFromStory(result);
    } else {
      toast.error("Failed to generate story.");
    }
  };

  const handleConvertToSpeech = async () => {
    if (!story) return alert(storyTranslated.speechError1);
    await convertToSpeech(story);
  };

  const handleAddWord = async () => {
    const trimmed = newWord.trim();
    if (!trimmed) return;

    if (words.some((w) => w.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("This word is already in your list");
      return;
    }

    const { error } = await addWord(trimmed, practiceLang);
    if (!error) {
      setNewWord("");
      toast.success("Word added");
    } else {
      toast.error("Failed to add word");
    }
  };

  const handleDeleteWord = async (word: string) => {
    await deleteWord(word);
    setSelectedWords((prev) => {
      const updated = new Set(prev);
      updated.delete(word);
      return updated;
    });
    toast.success("Deleted word");
  };
  const fetchSavedStories = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("user_stories")
      .select("*")
      .eq("uid", user.id)
      .eq("language", practiceLang)
      .order("created_at", { ascending: false });

    if (!error && data) setSavedStories(data);
  };

  const handleSaveStory = async () => {
    console.log("handleSaveStory called"); 
    if (!story || !imageUrl) {
      toast.error("No story or image to save");
      return;
    }
  
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
   
    if (isStorySaved) {
      // Unsaving the story
      try {
        const { error: deleteError } = await supabase
          .from("user_stories")
          .delete()
          .eq("uid", user.id)
          .eq("story", story);
  
        if (deleteError) throw deleteError;
  
        setIsStorySaved(false);
        setSavingMessage(translated.saveStory);

        fetchSavedStories();
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        // Check if the image URL is a base64 string
        let base64Image = imageUrl;
        if (!base64Image.startsWith('data:image')) {
          // Convert image URL to base64
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          
          base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              if (reader.result === null) {
                reject(new Error("Failed to read image as base64"));
              } else if (typeof reader.result === 'string') {
                resolve(reader.result);
              } else {
                reject(new Error("Failed to read image as base64"));
              }
            };
            reader.onerror = () => reject(new Error("Error reading image file"));
            reader.readAsDataURL(blob);
          });
        }
    
        // Save the story and image to the database
        const { error: saveError } = await supabase
          .from("user_stories")
          .upsert([
            {
              uid: user.id,
              story: story,
              image: base64Image,
              language: practiceLang,
              created_at: new Date().toISOString(),
            },
          ]);
    
        if (saveError) throw saveError;
        
        setIsStorySaved(true);
        setSavingMessage(translated.savedStory);

        fetchSavedStories();
      }catch (err) {
        console.error(err);
      }
    }
  };  

  const handleDeleteStory = async (id: number) => {
    const { error } = await supabase.from("saved_stories").delete().eq("id", id);
    if (error) return toast.error("Failed to delete");
    setSavedStories((prev) => prev.filter((s) => s.id !== id));
    toast.success("Story deleted");
  };

  const handleStoryLengthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStoryLength(e.target.value as "short" | "medium" | "long");
  };

  useEffect(() => {
    const fetchLang = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;
      if (!session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("user_preferences")
        .select("practice_lang")
        .eq("uid", session.user.id)
        .single();

      if (data?.practice_lang && ["en", "es", "zh"].includes(data.practice_lang)) {
        setPracticeLang(data.practice_lang);
      }
    };

    fetchLang();
    fetchSavedStories();
  }, [router]);

  const handlePracticeLangChange = async (val: "en" | "es" | "zh") => {
    setPracticeLang(val);
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) return;

    await supabase
      .from("user_preferences")
      .update({ practice_lang: val })
      .eq("uid", session.user.id);
  };

    // Toggle word selection
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

    // Delete all words
  const handleDeleteAllWords = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to delete words");
        return;
      }

      const { error } = await supabase
        .from("vocab_words")
        .delete()
        .eq("uid", user.id)
        .eq("language", language);

      if (error) {
        toast.error("Failed to delete all words");
        return;
      }

      setWords([]);
      toast.success("All words deleted successfully");
    } catch (error) {
      console.error("Error deleting all words:", error);
      toast.error("Failed to delete all words");
    }
  };

  if (!languageReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-purple-950 dark:to-slate-900 dark:text-white">
      <Navbar/>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Welcome Section */}
          <section>
            <Card className="overflow-hidden border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-purple-600 to-violet-500 p-6 md:p-8 text-white">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{translated.greeting}</h2>
                      <p className="text-purple-100 text-lg">{translated.continue}</p>
                    </div>

                    <Select value={practiceLang} onValueChange={handlePracticeLangChange}>
                      <SelectTrigger className="w-full md:w-[180px] bg-white/20 border-white/30 text-white">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{translated.progress}</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2.5 bg-white/20" />
                  </div> */}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Main Features Grid */}
          <section>
            <div className="grid gap-6">
              {/* <Link href="/dashboard/speaking">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-purple-100 dark:border-purple-800 dark:bg-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-xl dark:bg-purple-900">
                        <Mic className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{translated.speaking}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{translated.practice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link> */}

              {/* <Link href="/dashboard/reading">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-purple-100 dark:border-purple-800 dark:bg-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-xl dark:bg-purple-900">
                        <BookOpen className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{translated.reading}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{translated.practice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link> */}

              <Link href="/dashboard/writing">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-purple-100 dark:border-purple-800 dark:bg-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-xl dark:bg-purple-900">
                        <MessageSquare className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{translated.writing}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{translated.practice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* <Link href="/dashboard/quiz">
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-purple-100 dark:border-purple-800 dark:bg-slate-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-xl dark:bg-purple-900">
                        <Lightbulb className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{translated.quiz}</h3>
                        <p className="text-slate-600 dark:text-slate-400">{translated.practice}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link> */}
            </div>
          </section>

          {/* Word List Section */}
          <section>
            <Card className="border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <List className="h-5 w-5 text-purple-500" />
                    {translated.extras.option1}
                  </CardTitle>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {words.length} {words.length === 1 ? translated.wordLists.word : translated.wordLists.words}
                  </div>
                </div>
                <CardDescription>{translated.extras.option1Description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        placeholder={storyTranslated.typeWord}
                        value={newWord}
                        onChange={(e) => setNewWord(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddWord();
                          }
                        }}
                        className={`${
                          newWord.trim() !== "" && words.some(word => word.toLowerCase() === newWord.trim().toLowerCase())
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                      {newWord.trim() !== "" && words.some(word => word.toLowerCase() === newWord.trim().toLowerCase()) && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 text-sm">
                          {translated.wordLists.error}
                        </div>
                      )}
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={handleAddWord}
                            className="bg-purple-600 hover:bg-purple-700"
                            disabled={newWord.trim() !== "" && words.some(word => word.toLowerCase() === newWord.trim().toLowerCase())}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{translated.wordLists.add}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {words.map((word) => (
                      <div key={word} className="relative group">
                        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 px-3 py-1.5">
                          <span className="text-slate-700 dark:text-slate-300">{word}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                                  onClick={() => handleDeleteWord(word)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{translated.wordLists.delete}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                    {words.length > 0 && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleDeleteAllWords}
                              className="h-8 px-3 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                            >
                              <X className="h-4 w-4 mr-1" />
                              {translated.wordLists.deleteAll}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{translated.wordLists.deleteAllWords}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  {words.length === 0 && (
                    <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                      {translated.wordLists.description}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Story Generator Section */}
          <section>
            <Card className="border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-500" />
                  {translated.generateStoryTitle}
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                  {translated.generateStoryDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Word Selection */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-slate-700 dark:text-slate-300">
                      {storyTranslated.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {words.map((word) => (
                        <Button
                          key={word}
                          variant={selectedWords.has(word) ? "default" : "outline"}
                          onClick={() => toggleWord(word)}
                          className={`transition-all duration-200 ${
                            selectedWords.has(word)
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          {word}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Story Length Selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{translated.storyType.title}</span>
                    <Select
                      value={storyLength}
                      onValueChange={(value) => setStoryLength(value as "short" | "medium" | "long")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">{translated.storyType.short}</SelectItem>
                        <SelectItem value="medium">{translated.storyType.medium}</SelectItem>
                        <SelectItem value="long">{translated.storyType.long}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Generate Button */}
                  {!story && (
                    <Button
                      onClick={handleGenerateStory}
                      disabled={selectedWords.size === 0 || loading}
                      className={`w-full h-12 text-lg transition-all duration-200 ${
                        selectedWords.size === 0
                          ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white"
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{translated.generateLoad}</span>
                        </div>
                      ) : (
                        translated.generateStoryButton
                      )}
                    </Button>
                  )}

                  {/* Generated Story */}
                  {story && (
                    <div className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Story and Speech Controls */}
                        <div className="space-y-4">
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">

                            <div className="text-lg text-slate-700 dark:text-slate-300">
                              {story?.split(/\b/).map((word, index) => {
                                const clean = word.replace(/[^\w]/g, "").toLowerCase();
                                return clean ? (
                                  <span
                                    key={index}
                                    className={`relative inline-block cursor-pointer hover:underline ${selectedWords.has(clean) ? 'bg-yellow-300' : ''}`}
                                    onMouseEnter={() => setHoveredWord({ word: clean, index })}
                                    onMouseLeave={() => setHoveredWord(null)}
                                  >
                                    {word}
                                    {hoveredWord?.word === clean && hoveredWord?.index === index && definitions[clean] && (
                                      <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 bg-white dark:bg-slate-800 border rounded shadow p-3 w-60 text-sm z-50">
                                        <p className="font-bold">{clean}</p>
                                          {definitions[clean]?.translatedWord && (
                                            <p className="text-sm text-gray-500 italic">({definitions[clean].translatedWord})</p>
                                          )}
                                          <p className="italic text-gray-500">{definitions[clean].partOfSpeech}</p>
                                          <p>{definitions[clean].definition}</p>

                                        <Button
                                          onClick={handleAddHoveredWord}
                                          className="mt-2 w-full text-xs bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                          {translated.wordLists.addHovered}
                                        </Button>
                                        <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-4 h-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rotate-45 z-[-1]" />
                                      </div>
                                    )}
                                  </span>
                                ) : (
                                  word
                                );
                              })}
                            </div>

                            <div className="mt-6 flex flex-col gap-4">
                              <div className="flex gap-4">
                                <Button
                                  onClick={handleConvertToSpeech}
                                  className="flex-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-2 border-purple-200 dark:border-purple-800"
                                  variant="outline"
                                >
                                  <div className="flex items-center gap-2">
                                    <Mic className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    <span>{translated.readStory}</span>
                                  </div>
                                </Button>
                                <div className="flex items-center gap-2">
                                  <Button
                                    onClick={handleSaveStory}
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                                    variant="default"
                                  >
                                    {isStorySaved ? (
                                      <Bookmark className="h-5 w-5 fill-white" />
                                    ) : (
                                      <Bookmark className="h-5 w-5 text-purple-400" />
                                    )}
                                    <span className="ml-2">{savingMessage}</span>
                                  </Button>
                                </div>
                              </div>
                              {audioSrc && (
                                <audio controls className="w-full">
                                  <source src={audioSrc} type="audio/mpeg" />
                                  {storyTranslated.audioError}
                                </audio>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Generated Image */}
                        {imageUrl && (
                          <div className="relative group h-full">
                            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-md h-full">
                              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                                <img
                                  src={imageUrl}
                                  alt="Generated story illustration"
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {story && (
                        <Button
                          onClick={handleGenerateStory}
                          disabled={selectedWords.size === 0 || loading}
                          className={`w-full h-12 text-lg transition-all duration-200 ${
                            selectedWords.size === 0
                              ? "bg-slate-300 dark:bg-slate-700 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white"
                          }`}
                        >
                          {loading ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>{translated.generateLoad}</span>
                            </div>
                          ) : (
                            translated.generateStoryButton
                          )}
                        </Button>
                      )}

                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setStory("");
                            setHighlightedStory("");
                            setImageUrl(null);
                            setAudioSrc(null);
                            setStory(null);
                          }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                        >
                          <X className="h-4 w-4 mr-2" />
                          {translated.clearStory}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Scroll to Top Button */}
          <ScrollToTop />

          {/* Saved Items Section */}
          <section>
            <Card className="border-purple-100 shadow-lg dark:border-purple-800 dark:bg-slate-800">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-purple-500" />
                  {translated.extras.option2}
                </CardTitle>
                <CardDescription>{translated.extras.option2Description}</CardDescription>
              </CardHeader>
              <CardContent>

              <div className="flex">
                {/* Left Side: */}
                <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 pr-4">
                  <div className="space-y-4">
                    {savedStories.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        {translated.saveStoryDescription}
                      </div>
                    ) : (
                      savedStories.map((savedStory) => (
                        <div
                          key={savedStory.id}
                          onClick={() => {
                            if (selectedStory?.id === savedStory.id) {
                              // Deselect the story
                              setSelectedStory(null);
                              setIsStorySelected(false);
                            } else {
                              // Select the new story
                              setSelectedStory(savedStory);
                              setIsStorySelected(true);
                            }
                          }}
                          className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-4 rounded-md transition-all"
                        >
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-semibold">
                            {savedStory.story.split(".")[0]}.
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(savedStory.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Right Side */}
                <div className="w-2/3 pl-4">
                  {selectedStory ? (
                    <div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {selectedStory.story}
                        </p>
                      </div>
                      {selectedStory.image && (
                        <div className="mt-4 flex justify-center">
                          <img
                            src={selectedStory.image}
                            alt={selectedStory.title || "Story Image"}
                            className="w-1/2 h-auto object-cover rounded-lg shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      {translated.selectStoryMessage}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
       <SupportChat />
        </div>
      </main>

      <footer className="mt-12 border-t border-purple-100 py-8 text-center text-sm text-slate-500 dark:border-purple-900 dark:text-slate-400">
        <div className="container mx-auto">
          <p>{translated.footerText}</p>
        </div>
      </footer>
    </div>
  );
}

function DashboardPageWrapper() {
  const { language, setLanguage } = useLanguage();

  return (
    <Suspense fallback={<div>{dashBoardTranslations[language].loading}</div>}>
      <DashboardPage />
    </Suspense>
  );
}

export default DashboardPageWrapper;