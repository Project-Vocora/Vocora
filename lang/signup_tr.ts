// lang/signup_tr.ts
"use client";

const signupTranslations = {
    en: {
      title: "Sign up",
      description: "Enter your information below to create your account",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      emailLabel: "Email",
      emailPlaceholder: "m@example.com",
      passwordLabel: "Password",
      signUpButton: "Sign Up",
      googleSignUp: "Sign up with Google",
      signInLink: "Already have an account? Sign in",
      unexpectedError: "An unexpected error occurred",
    },
    es: {
      title: "Regístrate",
      description: "Ingresa tu información a continuación para crear tu cuenta",
      firstNameLabel: "Nombre",
      lastNameLabel: "Apellido",
      emailLabel: "Correo electrónico",
      emailPlaceholder: "m@ejemplo.com",
      passwordLabel: "Contraseña",
      signUpButton: "Registrarse",
      googleSignUp: "Regístrate con Google",
      signInLink: "¿Ya tienes una cuenta? Inicia sesión",
      unexpectedError: "Ocurrió un error inesperado",
    },
    zh: {
      title: "注册",
      description: "在下面输入您的信息以创建帐户",
      firstNameLabel: "名字",
      lastNameLabel: "姓氏",
      emailLabel: "电子邮件",
      emailPlaceholder: "m@example.com",
      passwordLabel: "密码",
      signUpButton: "注册",
      googleSignUp: "使用谷歌注册",
      signInLink: "已经有账户？ 登录",
      unexpectedError: "发生了意外错误",
    },
  } as const; // Use 'as const' to make the structure readonly
  
  export default signupTranslations;
  