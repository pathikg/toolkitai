# Environment Variables Setup Guide

This project uses environment variables to manage configuration across development and production environments.

---

## 📁 Files Overview

### Frontend (Next.js)
```
.env.example              # Template - safe to commit
.env.development          # Development config - safe to commit
.env.production.example   # Production template - safe to commit
.env.local               # Your local secrets - NOT committed
.env.production          # Production secrets - NOT committed
```

### Backend (FastAPI)
```
backend/.env.example              # Template - safe to commit
backend/.env.development          # Development config - safe to commit  
backend/.env.production.example   # Production template - safe to commit
backend/.env.production          # Production secrets on EC2 - NOT committed
```

---

## 🚀 Quick Setup

### 1. Local Development Setup

#### Frontend (.env.local)
```bash
# Create your local environment file
cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...

# Local backend
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
```

#### Backend (.env.production)
```bash
cd backend

# For local testing, copy development config
cp .env.development .env.production

# Or create with your values
cat > .env.production << 'EOF'
ALLOWED_ORIGINS=http://localhost:3000
ENVIRONMENT=development
DEBUG=true
EOF
```

### 2. Production Setup (EC2)

#### SSH into EC2
```bash
ssh ubuntu@100.30.3.16
cd toolkitai.io/backend
```

#### Create production environment file
```bash
cat > .env.production << 'EOF'
# CORS - Add your Vercel domain after deployment
ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app

# Environment
ENVIRONMENT=production
DEBUG=false

# Add API keys as you implement more tools
# OPENAI_API_KEY=sk-proj-xxxxx
EOF
```

#### Restart services
```bash
docker-compose restart
```

### 3. Vercel Deployment

When deploying to Vercel, add these environment variables in the dashboard:

**Vercel Dashboard → Your Project → Settings → Environment Variables**

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
NEXT_PUBLIC_API_URL=http://100.30.3.16
```

Or use Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_API_URL
# Paste: http://100.30.3.16
```

---

## 🔄 Updating CORS After Vercel Deployment

After deploying to Vercel (e.g., `https://toolkitai.vercel.app`):

1. **Update backend environment on EC2:**
```bash
ssh ubuntu@100.30.3.16
cd toolkitai.io/backend
nano .env.production
```

2. **Add your Vercel URL:**
```bash
ALLOWED_ORIGINS=http://localhost:3000,https://toolkitai.vercel.app
```

3. **Restart backend:**
```bash
docker-compose restart
```

---

## 📝 Variable Reference

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbG...` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://100.30.3.16` or `https://api.yourdomain.com` |

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000,https://app.vercel.app` |
| `ENVIRONMENT` | Environment name | `development` or `production` |
| `DEBUG` | Enable debug mode | `true` or `false` |
| `OPENAI_API_KEY` | OpenAI API key (for poem generator) | `sk-proj-...` |

---

## ✅ Testing Your Setup

### Test Frontend Connection
```bash
# Start Next.js
npm run dev

# Visit: http://localhost:3000/tools/bg-removal
# Upload an image and test
```

### Test Backend
```bash
# Health check
curl http://100.30.3.16/

# Should return:
# {"status":"online","message":"ToolkitAI Backend is running"}
```

### Test CORS
```bash
# From browser console on localhost:3000
fetch('http://100.30.3.16/')
  .then(r => r.json())
  .then(console.log)

# Should work without CORS errors
```

---

## 🔒 Security Notes

1. **Never commit** `.env.local` or `.env.production` files
2. **Always use** `.env.example` files as templates
3. **Rotate secrets** if accidentally committed
4. **Use different keys** for development and production
5. **Restrict CORS** to only your domains (no wildcards `*`)

---

## 🆘 Troubleshooting

### CORS Error?
- Check `ALLOWED_ORIGINS` in backend `.env.production`
- Restart backend: `docker-compose restart`
- Verify frontend is using correct API URL

### API Not Found?
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify EC2 Security Group allows port 80
- Test backend health: `curl http://100.30.3.16/`

### Environment Variables Not Loading?
- Restart Next.js dev server (`npm run dev`)
- Restart Docker on EC2 (`docker-compose restart`)
- Check file names (no typos!)

---

## 📚 More Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [FastAPI Settings Management](https://fastapi.tiangolo.com/advanced/settings/)
- [Docker Compose Env Files](https://docs.docker.com/compose/environment-variables/)

