# AdaptLearn

A Java learning platform that starts with a placement assessment and points each
learner at the course that fits their level, then keeps them moving with hands-on
coding exercises, XP, achievements and a leaderboard.

## What it does

- **Placement assessment.** New learners take a short assessment; their score sets a
  skill level (beginner, intermediate or advanced), and the course catalog
  recommends the course at that level.
- **Three Java courses** (Fundamentals, Intermediate, Advanced/Enterprise), organized
  into modules and lessons: reading, video, quiz and coding exercises.
- **In-browser coding exercises.** Lessons with code use the Monaco editor (the editor
  behind VS Code). Submissions are checked against per-lesson validation rules and,
  where enabled, compiled and run against test cases by a Supabase Edge Function.
  Learners can see their submission history.
- **Progress and motivation.** Per-module and per-lesson progress, XP for completed
  lessons, unlockable achievements and a global leaderboard.
- **Role-based tools.** Students, instructors and admins. Instructors and admins get a
  course builder (courses, modules, lessons) and a test-case manager for exercises.
- **Email.** Welcome, achievement and assessment-reminder emails via Resend, with
  per-user notification preferences and one-click unsubscribe.

## Tech

| | |
| --- | --- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, React Router, Monaco Editor, Lucide icons |
| **Backend** | Supabase: PostgreSQL with row-level security, Auth, Edge Functions (Deno) |
| **Email** | Resend |

The database is defined by the migrations in `supabase/migrations/`: schema, row-level
security policies, the functions behind XP, achievements, the leaderboard and platform
stats, and the seeded course content.

## Security

- **Row-level security on all 20 tables**; roles live in `user_roles` and are checked
  in the policies, not just in the UI.
- **`send-email`** only sends for a signed-in user, and only to that user's own address.
  The sender is fixed by server configuration.
- **`execute-java-code`** requires a signed-in user, rate-limits submissions, rejects
  code that uses disallowed APIs (such as `ProcessBuilder`), and runs each test with time
  and memory limits, without going through a shell.

## Running it locally

```bash
npm install
cp .env.example .env    # add your Supabase URL and anon key
npm run dev             # http://localhost:5173
```

To run your own backend:

1. Create a Supabase project and apply `supabase/migrations/` in order (for example
   with the Supabase CLI: `supabase db push`).
2. Deploy the functions in `supabase/functions/`, and set these secrets for them:
   - `RESEND_API_KEY`: from resend.com
   - `EMAIL_FROM_ADDRESS`: an address on a domain verified in Resend. Without one,
     Resend runs in testing mode and can only deliver to your own account.
   - `RESEND_VERIFIED_EMAIL`: in testing mode, the address that receives every email.
3. Code exercises that run test cases need the `execute-java-code` function to run
   somewhere with a JDK (`javac` and `java` on the path).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build to `dist/` |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build |

## How it was built

AdaptLearn was started with [Bolt.new](https://bolt.new), an AI app builder, and
developed from there with AI assistance. A later pass with
[Claude Code](https://claude.com/claude-code) tightened security (the email and
code-execution functions), brought the database types in line with the migrations
(`npm run typecheck` went from 107 errors to none), and fixed bugs that surfaced along
the way, including database calls that had silently stopped updating course enrollment
counts and lesson XP.
