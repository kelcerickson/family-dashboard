# Family Operating System

A private family dashboard for Ryan & Brienne to review vision, annual goals, quarterly priorities, and weekly plans.

---

## Deploy in 4 Steps

### Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) and open your project
2. In the left sidebar, click **SQL Editor**
3. Paste the entire contents of `supabase-schema.sql` and click **Run**
4. Go to **Project Settings → API**
5. Copy your **Project URL** and **anon/public key** — you'll need these in Step 3

### Step 2 — Push to GitHub

1. Create a new repository on GitHub (name it `family-os` or anything you like)
2. Upload all files from this folder to the repository
   - You can drag and drop the files in GitHub's web UI, or use Git on the command line
3. Make sure `.env` is NOT included (it's in `.gitignore` for safety)

### Step 3 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New Project**
2. Import your GitHub repository
3. Before deploying, click **Environment Variables** and add:
   - `VITE_SUPABASE_URL` → your Supabase Project URL from Step 1
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key from Step 1
4. Click **Deploy**
5. Vercel will build and host the app — you'll get a URL like `family-os.vercel.app`

### Step 4 — Bookmark it

Open the URL on both your phones and computers. Bookmark it. You're done.

---

## How it works

- **Vision & Roadmap** — Your five-year picture and milestones. Edit once a year.
- **Annual Plan** — One objective per year. Mark complete at year-end with a reflection.
- **Quarterly Priorities** — Three priorities per quarter. Each can be marked active, complete, or dropped.
- **Weekly Review** — Fill in each week's four actions. Last week is shown read-only for comparison. Mark each week complete at week's end.

All data saves automatically to Supabase as you type.

---

## Local development (optional)

```bash
npm install
cp .env.example .env
# Fill in your Supabase credentials in .env
npm run dev
```
