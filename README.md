# NextFlow — Visual AI Workflow Builder

Built for Galaxy.ai assignment.

## Tech Stack
Next.js 14, TypeScript, PostgreSQL (Neon), Prisma, 
Clerk Auth, React Flow, Google Gemini AI, 
Trigger.dev, Transloadit, Zustand, TailwindCSS

## Setup
1. Clone repo
2. npm install
3. Add .env.local (see .env.example)
4. npx prisma db push
5. npm run dev

## Features
- Visual drag-drop workflow canvas
- 6 node types (Text, Image, Video, LLM, Crop, Frame)
- Google Gemini AI integration
- Parallel execution with DAG ordering
- Workflow history persistence
- Clerk authentication
