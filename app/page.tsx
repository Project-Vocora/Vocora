import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "next-i18next"

export default function HomePage() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-6 flex items-center justify-center" style={{ minHeight: "calc(100vh - 72px)" }}>
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <Image 
            src="/VocoraMascot.svg" 
            alt="Vocora Mascot"
            width={500}
            height={50}
            priority
            className="object-contain"
          />
          <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
            <h1 className="text-3xl font-medium max-w-[500px]">
              {t("hero_text")}
            </h1>
            <div className="mt-8">
              <Link href="/en/login">
                <Button className="bg-[#9747FF] text-white hover:bg-[#8A3DEE] px-8 py-6 text-lg">
                {t("get_started")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

