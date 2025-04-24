"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import homeTransla from "@/lang/home";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language = (searchParams?.get("lang") || "en") as "en" | "es" | "zh";
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleContinue = () => {
    router.push("/success");
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>{homeTransla[language].loading}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            {homeTransla[language].welcomeTitle}
          </h1>
          <p className="text-xl text-gray-600">
            {homeTransla[language].welcomeDescription}
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {homeTransla[language].featuresTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="text-center">
                <Image
                  src="/icons/conversation.svg"
                  alt="Conversation"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <p>{homeTransla[language].feature1}</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <Image
                  src="/icons/feedback.svg"
                  alt="Feedback"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <p>{homeTransla[language].feature2}</p>
              </div>
            </Card>
            <Card className="p-6">
              <div className="text-center">
                <Image
                  src="/icons/progress.svg"
                  alt="Progress"
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                />
                <p>{homeTransla[language].feature3}</p>
              </div>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={handleContinue}
            className="px-8 py-2 text-lg"
          >
            {homeTransla[language].continue}
          </Button>
        </div>
      </div>
    </div>
  );
} 