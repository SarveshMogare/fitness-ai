# FitForge AI - Personal AI Fitness Architect

FitForge AI is an intelligent, personalized fitness and nutrition planning application. It leverages artificial intelligence to create adaptive workout routines and TDEE-based meal plans that evolve with your progress, powered by science and user feedback.

## 🚀 Features

- **Personalized Onboarding:** Tailors the experience by collecting user metrics (age, height, weight), fitness goals, experience levels, available equipment, and dietary preferences.
- **Adaptive AI Workouts:** Generates complete 7-day workout plans using AI. The system learns from your post-workout feedback (difficulty rating, completion rate) to adjust the intensity, volume, and exercises for future plans.
- **TDEE Meal Plans:** Automatically calculates your Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor equation and generates macro-optimized meal plans that strictly adhere to your dietary preferences (Vegan, Keto, Paleo, etc.).
- **Progress Insights:** Tracks key metrics such as weight, body fat percentage, energy levels, sleep hours, and mood over time, visualized through interactive charts.
- **Authentication:** Secure user authentication and session management powered by Supabase.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/) components
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL & Supabase Auth)
- **AI Integration:** [Vercel AI SDK](https://sdk.vercel.ai/) (`@ai-sdk/google`, `@ai-sdk/openai`)
- **State Management & Data Fetching:** React Hooks, SWR
- **Forms & Validation:** React Hook Form, Zod
- **Charts:** Recharts

## 📂 Project Structure

- `/app`: Next.js App Router application directory.
  - `/api`: API routes for generating plans (`/api/generate-plan`), handling feedback (`/api/feedback`), and managing profiles.
  - `/auth`: Login and Sign-up pages.
  - `/dashboard`: Main authenticated user dashboard.
  - `/onboarding`: Initial user setup flow.
- `/components`: Reusable UI components (buttons, dialogs, form elements, charts).
- `/lib`: Core business logic and utilities.
  - `/ai`: Contains the AI `system-prompt.ts` which dictates how the AI behaves as a personal trainer and dietitian, including the adaptive difficulty rules.
  - `/supabase`: Supabase client configuration for server and client components.
  - `types.ts`: Comprehensive TypeScript interfaces mapping to the Supabase database schema (Profiles, Workouts, Nutrition, Feedback).

## 🧠 How the AI Works

The AI generation is centered around `lib/ai/system-prompt.ts`. When a user requests a new plan or updates their profile:
1. **Context Gathering:** The system fetches the user's `Profile` (goals, metrics, equipment) and recent `WorkoutFeedback`.
2. **Adaptive Rules:** If a user rated recent workouts as too difficult (e.g., > 4/5), the AI prompt automatically instructs the model to reduce intensity by 15-20%. If it was too easy, it increases intensity.
3. **Generation:** The Vercel AI SDK calls the LLM with this structured prompt, returning a guaranteed JSON structure (defined in `types.ts` as `AIGeneratedPlan`).
4. **Storage:** The parsed JSON is then stored in Supabase across the `WorkoutPlan`, `DailyWorkout`, `Exercise`, `NutritionPlan`, and `Meal` tables.

## 🏁 Getting Started

1. Clone the repository and navigate into it.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables by copying `.env.example` to `.env.local` (You will need Supabase URL/Anon Key and AI Provider API Keys like Google Gemini or OpenAI).
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
