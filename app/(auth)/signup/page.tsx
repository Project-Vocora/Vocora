"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { Navbar } from "@/components/Navbar"
import { supabase } from "@/lib/supabase"

function SignUpForm({
  isLoading,
  onSubmit,
}: { isLoading: boolean; onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void> }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input id="firstName" name="firstName" type="text" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input id="lastName" name="lastName" type="text" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <Button type="submit" className="w-full bg-[#9747FF] text-white hover:bg-[#8A3DEE]" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Sign Up
      </Button>
    </form>
  )
}

export default function SignUpPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
  
    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        const form = event.currentTarget
        const formData = new FormData(form)
        const firstName = formData.get('firstName') as string
        const lastName = formData.get('lastName') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
  
        try {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                display_name: `${firstName} ${lastName}`,
            },
            },
        })
        if (signUpError) throw new Error(signUpError.message)
        
        console.log("Sign-up successful.", signUpData)
        router.push("/success")
    } catch (error) {
        setError(error instanceof Error ? error.message : "An unexpected error occurred")
    } finally {
        setIsLoading(false)
    }
}

async function handleGoogleSignUp() {
  // Set loading state and clear any previous errors
  setIsLoading(true);
  setError(null);
  
  // Redirect URL for OAuth
  const redirectURL = process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URL;

  // Initiates sign-up process w/ Google using Supabase authentication
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectURL,
    },
  });

  if (error) {
    console.error("Google OAuth Error:", error.message);
    setError(error.message);
  }

  // Reset loading state
  setIsLoading(false);
}
  

return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center" style={{ minHeight: "calc(100vh - 72px)" }}>
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">{"Sign up"}</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
            <SignUpForm isLoading={isLoading} onSubmit={onSubmit} />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
          <Button variant="outline" className="w-full border-[#9747FF] text-[#9747FF] hover:bg-[#9747FF]/10" onClick={handleGoogleSignUp}
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Sign up with Google
            </Button>
            <Button variant="link" className="w-full" onClick={() => router.push('/login')}>
              Already have an account? Sign in
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

