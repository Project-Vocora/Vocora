"use server"

export async function signIn(formData: FormData) {
  const email = formData.get("correo electrónico")
  const password = formData.get("contraseña")


  console.log("Sign in attempt:", { email, password })

  return { success: true, message: "Sesión Iniciada!" }
}

