# AI Toolkit SaaS

A modern, full-stack SaaS platform providing AI-powered tools for image, video, audio, and text processing.

## Features

### Current Features ✅
- **Google OAuth Authentication** via Supabase
- **Beautiful, Responsive UI** built with Next.js 14 and Tailwind CSS
- **Featured Tools Section** highlighting popular tools
- **Tool Dashboard** with organized grid layout
- **5 Main Tools** with placeholder UIs:
  - Face Swap
  - Background Removal
  - GIF Maker
  - Mugshot Generator
  - Poem Generator
- **Protected Routes** with middleware authentication
- **Modern Component Library** using shadcn/ui

### Coming Soon 🚀
- Python FastAPI backend integration
- Usage-based billing with Stripe
- Credits system
- File upload and processing
- Real-time processing status
- Download processed files
- Usage history and analytics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase Postgres (future)
- **Backend**: Next.js API Routes → Python FastAPI (future)
- **Deployment**: Vercel (future)

## Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Configure Supabase**
   - Create a Supabase project
   - Add credentials to `.env.local`
   - Enable Google OAuth
   - Configure redirect URLs

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── api/                 # API routes (future)
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── Navbar.tsx           # Navigation with auth
│   └── ToolCard.tsx         # Tool card component
├── lib/
│   ├── supabase/            # Supabase client utilities
│   └── types.ts             # TypeScript types
└── middleware.ts            # Route protection
```

## Available Tools

### Featured Tools
1. **Face Swap** - Swap faces in photos with AI precision
2. **Background Removal** - Remove backgrounds instantly
3. **GIF Maker** - Create animated GIFs from videos/images
4. **Mugshot Generator** - Generate mugshot-style photos
5. **Poem Generator** - Create poems with AI language models

### Additional Tools
- Video Enhancer
- Image Upscaler
- Voice Cloner
- Text Summarizer

*Note: All tools currently show placeholder UIs. Backend integration coming soon.*

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Tools

1. Create a new page in `app/(dashboard)/tools/[tool-name]/page.tsx`
2. Add the tool to the tools array in `app/(dashboard)/tools/page.tsx`
3. Create an API route in `app/api/tools/[tool-name]/route.ts`
4. Connect to your Python backend endpoint

## Architecture

### Current Architecture
```
User → Next.js (UI + Auth) → Supabase (Auth)
```

### Future Architecture
```
User → Next.js (UI + API Gateway) → Python FastAPI (ML Processing)
     → Supabase (Auth + DB)
     → Stripe (Payments)
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

Remember to update Supabase redirect URLs with your production domain.

## Contributing

This is a personal project. Feel free to fork and adapt for your own use.

## License

MIT

## Support

For setup help, see [SETUP.md](./SETUP.md).

---

Built with ❤️ using Next.js, Supabase, and shadcn/ui
