# Vocora: AI-Powered Language Reinforcement Platform
Vocora is a full-stack web application designed to assist learners reinforce their vocabulary through AI-generated stories, personalized feedback, synthesized audio, and tailored imagery. Built for multilingual learners, Vocora combines modern web tech with smart language tools to make learning interactive, fun, and effective.

## Core Features 
- **Multilingual Interface & Personalized Practice**
  - Vocora adapts to each user’s native and target languages — from UI localization to vocabulary translations — creating a personalized practice learning environment.
    
- **Vocabulary Management**
  - Words are tracked in customizable vocab lists.
    
- **Story Generation and Caching**
  - Users select vocabulary words, and Vocora generates AI-powered stories with real-time hover definitions, parts of speech, speech playback, and translations. Each story is hashed and cached in Supabase to avoid redundant API calls to OpenAI and ensure efficient performance.

- **Writing Feedback Powered by LLMs**
  - Users can submit written practice and receive instant grammar, clarity, and vocabulary feedback powered by Gemini, tailored to their selected languages.
    
- **Interactive Chat-Based Practice**
  - A built-in concersation system which preserves user's chat history and provides relevant responses to reinforce additional learning.

- **Security and Data Protection**
  - RLS policies ensure authenticated users can only access their own vocabulary and stories, with a shared user (Vocora) for defaulted words. 

## Built With
- **Next.js** & **React** – Frontend framework
- **TypeScript** – Type safety
- **TailwindTS** – Styling
- **Supabase** (PostgreSQL, Authorization, Row-Level Security policies) – Database & Auth
- **OpenAI model o1-mini-2024-09-12 API** – Story generation, contextual definitions
- **OpenAI model TTS-1 API** - Audio generation
- **Fireworks AI stable-diffusion-xl-1024-v1-0** - Image generation
- **Google Gemini-2.0 flash** - Chat functionality, interactive writing practice

## Screenshots


## Get Started (Dev)

```bash
git clone https://github.com/Project-Vocora/Vocora.git
cd vocora
npm install
npm run dev
