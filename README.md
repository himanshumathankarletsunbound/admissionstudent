# Admit Ledger

Live, privacy-aware student admissions dashboard. The public page masks names (for example, `A*** K****`), while authenticated admins can add and remove records.

## Setup

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL Editor.
2. Enable Google in Supabase Authentication > Providers, create your admin user, and set the Google OAuth callback URL to `https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback`. The schema bootstraps `himanshu.m@letsunbound.com` as the first approved administrator.
3. Copy `.env.example` to `.env.local` and fill in the Supabase URL and publishable key.
4. Install and run: `npm install && npm run dev`.
5. Import this repository into Vercel, then add the same two environment variables under **Project Settings → Environment Variables**.

The application uses Supabase Auth for the `/admin` area and Supabase Row Level Security for admissions records. Public visitors only receive database-masked names; raw names are restricted to approved admins. Admins can allow or revoke other Google accounts from the Users section.
