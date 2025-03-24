"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { SpanishNavbar } from "@/components/Span-Navbar" // Change to Span-Navbar for Spanish
import { supabase } from "@/lib/supabase"

function LoginForm({
  isLoading,
  onSubmit,
}: { isLoading: boolean; onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <Input id="email" name="email" type="email" placeholder="m@ejemplo.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" className="w-full bg-[#9747FF] text-white hover:bg-[#8A3DEE]" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Iniciar Sesión
      </Button>
    </form>
  )
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [language, setLanguage] = useState("es");
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      let data, error;
      const { data:loginData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      data = loginData;
      error = signInError;

      if (error) {
        // Update error message for email not confirmed
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Por favor, verifica tu correo electrónico antes de iniciar sesión");
        } else {
          throw new Error(error.message);
        }
      }

      // Navigate to the success page
      console.log("Autenticación exitosa.", data);
      router.push("/es/success")
    } catch (error) {
      console.error("Error durante la presentación del formulario:", error)
      setError(error instanceof Error ? error.message : "Ocurrió un error inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    // Set loading state and clear any previous errors
    setIsLoading(true);
    setError(null);

    // Set spanish to es-419 Latin America Spanish for Google OAuth
    const googleLang = language === "es" ? "es-419" : language;

    // Redirect URL for OAuth
    const redirectURL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/${language.toLowerCase()}/success`;

    // Initiates sign-in process w/ Google using Supabase authentication
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectURL,
        queryParams: {
          // Changes the Google OAuth login screen language
          hl: googleLang,
        },
      },
    });

    if (error) {
      console.error("Error de OAuth de Google:", error.message);
      setError(error.message);
    }

    // Reset loading state
    setIsLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SpanishNavbar />
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 72px)" }}>
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{"Iniciar sesión"}</CardTitle>
            <CardDescription>
              Ingresa tu correo electrónico para iniciar sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
            <LoginForm isLoading={isLoading} onSubmit={onSubmit} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button variant="outline" className="w-full border-[#9747FF] text-[#9747FF] hover:bg-[#9747FF]/10" onClick={handleGoogleSignIn}>
              <Icons.google className="mr-2 h-4 w-4" />
              Iniciar sesión con Google
            </Button>
            <Button variant="link" className="w-full" onClick={() => router.push('/es/auth/signup')}>
              Crear cuenta nueva
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
