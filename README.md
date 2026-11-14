# Admit Ledger

Live, privacy-aware student admissions dashboard. The public page masks names (for example, `A*** K****`), while authenticated admins can add and remove records.

## Setup

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL Editor.
2. In Supabase Auth, create your admin user (disable public sign-ups in Auth settings).
3. Copy `.env.example` to `.env.local` and fill in the Supabase URL and anon key.
4. Install and run: `npm install && npm run dev`.
5. Import this repository into Vercel, then add the same two environment variables under **Project Settings → Environment Variables**.

The application uses Supabase Auth for the `/admin` area and Supabase Row Level Security for admissions records.
