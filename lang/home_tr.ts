"use client";

// lang/home.ts

const homeTranslations = {
    en: {
      title: "Vocora",
      description: "Enter your email below to sign in to your account",
      emailLabel: "Email",
      emailPlaceholder: "m@example.com",
      passwordLabel: "Password",
      signInButton: "Sign In",
      googleSignIn: "Sign in with Google",
      signUpLink: "Don't have an account? Sign up",
      errorEmailNotConfirmed: "Please verify your email before logging in",
      unexpectedError: "An unexpected error occurred",
    },
    es: {
      title: "Iniciar sesión",
      description: "Ingresa tu correo electrónico a continuación para iniciar sesión en tu cuenta",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "m@ejemplo.com",
      passwordLabel: "Contraseña",
      signInButton: "Iniciar sesión",
      googleSignIn: "Iniciar sesión con Google",
      signUpLink: "¿No tienes una cuenta? Regístrate",
      errorEmailNotConfirmed: "Por favor, verifica tu correo electrónico antes de iniciar sesión",
      unexpectedError: "Ocurrió un error inesperado",
    },
    zh: {
      title: "登录",
      description: "请在下面输入您的电子邮件以登录您的帐户",
      emailLabel: "电子邮件",
      emailPlaceholder: "m@example.com",
      passwordLabel: "密码",
      signInButton: "登录",
      googleSignIn: "使用谷歌登录",
      signUpLink: "还没有账户？注册",
      errorEmailNotConfirmed: "请在登录之前验证您的电子邮件",
      unexpectedError: "发生了意外错误",
    },
  } as const;
  
  export default homeTranslations;
  