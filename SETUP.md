# AI Toolkit - Setup Guide

This guide will help you set up the AI Toolkit SaaS application with Supabase authentication.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works fine)
- Git (optional, for version control)

## TL;DR - Local Development (5 minutes)

1. `npm install`
2. Create Supabase project → Copy URL & anon key to `.env.local`
3. In Supabase: Enable Google OAuth (use default config)
4. In Supabase: Add `http://localhost:3000/callback` to redirect URLs
5. `npm run dev`

Done! No Google Cloud Console needed for local development.

---

## Detailed Setup Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

#### Step 2.1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Navigate to **Project Settings** (gear icon in the sidebar)
4. Click on **API** in the settings menu
5. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

#### Step 2.2: Update Environment Variables

1. Open the `.env.local` file in the root directory
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Enable Google OAuth in Supabase

#### For Local Development (Easiest - No Google Cloud needed!)

1. In your Supabase Dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and **toggle it ON**
3. **Leave "Use default configuration" enabled** - Supabase will use their own Google OAuth credentials
4. Save the configuration

That's it! For local development, Supabase provides default OAuth credentials so you can test immediately.

#### For Production (When you deploy)

When you're ready to deploy to production, you'll need your own Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure the OAuth consent screen
6. For **Application type**, select **Web application**
7. Add authorized redirect URI:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
8. Copy the **Client ID** and **Client Secret**
9. In Supabase, **disable** "Use default configuration" and paste your credentials
10. Save the configuration

### 4. Configure Redirect URLs in Supabase

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Add the following URL to **Redirect URLs**:
   ```
   http://localhost:3000/callback
   ```
3. Save the configuration

*Note: When you deploy to production, add your production URL here too.*

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
toolkitai.io/
├── app/
│   ├── (auth)/
│   │   ├── login/              # Login page with Google OAuth
│   │   └── callback/           # OAuth callback handler
│   ├── (dashboard)/
│   │   └── tools/              # Tools dashboard and individual tool pages
│   ├── api/                    # API routes (for future integration)
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── Navbar.tsx              # Navigation bar with auth
│   └── ToolCard.tsx            # Reusable tool card component
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server Supabase client
│   └── types.ts                # TypeScript types
├── middleware.ts               # Auth middleware (protects routes)
└── .env.local                  # Environment variables
```

## Authentication Flow

1. User clicks "Sign in with Google" on `/login`
2. Supabase redirects to Google OAuth
3. User authorizes the app
4. Google redirects back to `/callback`
5. Callback handler exchanges code for session
6. User is redirected to `/tools` (dashboard)
7. Middleware protects all `/tools/*` routes

## Adding Python API Endpoints

When you're ready to integrate your Python FastAPI backend:

1. Create API routes in `app/api/tools/[tool-name]/route.ts`
2. Example structure:

```typescript
// app/api/tools/face-swap/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  // Check authentication
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get request data
  const formData = await request.formData()
  
  // Forward to Python API
  const response = await fetch('https://your-python-api.com/face-swap', {
    method: 'POST',
    body: formData,
  })
  
  const result = await response.json()
  return NextResponse.json(result)
}
```

3. Update the tool pages to call your Next.js API routes instead of being disabled

## Database Setup (Optional - For Future Features)

When you need to add credits, usage tracking, etc.:

1. In Supabase Dashboard, go to **SQL Editor**
2. Create tables for users, credits, usage logs:

```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  credits integer default 100,
  created_at timestamp with time zone default now()
);

-- Usage logs
create table public.usage_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id),
  tool_name text,
  credits_used integer,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.usage_logs enable row level security;

-- Policies
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can view own usage" 
  on public.usage_logs for select 
  using (auth.uid() = user_id);
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click **New Project** → Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

Don't forget to update the redirect URLs in Supabase with your production domain.

## Troubleshooting

### "Invalid redirect URL" error

- Make sure you added the callback URL to Supabase's allowed redirect URLs
- Check that the URL format is correct (including `/callback`)

### User gets redirected to login after signing in

- Verify your middleware configuration
- Check that cookies are being set correctly
- Ensure your Supabase credentials are correct

### OAuth not working

- Double-check your Google OAuth credentials
- Make sure the Google OAuth consent screen is configured
- Verify the redirect URI in Google Cloud Console matches Supabase

## Next Steps

1. ✅ You have authentication working
2. ✅ You have a beautiful UI with tool placeholders
3. 🔄 Build your Python FastAPI endpoints
4. 🔄 Create Next.js API routes to forward requests
5. 🔄 Add credits system (Supabase database)
6. 🔄 Integrate Stripe for payments
7. 🔄 Deploy to production

## Support

If you need help:
- Check [Supabase Documentation](https://supabase.com/docs)
- Check [Next.js Documentation](https://nextjs.org/docs)
- Review the code comments in this project

Happy coding! 🚀

