# Deployment Guide - Free Frontend Hosting

This guide will help you deploy the Angular frontend to **Vercel** (free hosting).

## Prerequisites
- GitHub account (free)
- Vercel account (free) - Sign up at https://vercel.com

## Step 1: Push Your Code to GitHub

1. Initialize git repository (if not already done):
```bash
cd hotels/hotels_front
git init
```

2. Add and commit your files:
```bash
git add .
git commit -m "Prepare for deployment"
```

3. Create a new repository on GitHub (https://github.com/new)
4. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Via Vercel Website (Easiest)

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Angular
   - **Root Directory**: `hotels/hotels_front` (if deploying from the whole repo) OR just the frontend folder
   - **Build Command**: `npm run build` (already configured in vercel.json)
   - **Output Directory**: `dist/hotels_front/browser` (already configured in vercel.json)
5. Click "Deploy"

### Option B: Via Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Navigate to your frontend folder:
```bash
cd hotels/hotels_front
```

4. Deploy:
```bash
vercel
```

5. Follow the prompts:
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

## Step 3: Configure Environment Variables (if needed)

If you need to change the backend URL later, you can:
1. Go to your project on Vercel dashboard
2. Settings → Environment Variables
3. Add any needed variables

## Important Notes

- The app is configured to use backend API at: `http://217.160.21.217:8000`
- Production build is configured in `environment.prod.ts`
- The deployment will automatically rebuild when you push to GitHub (if connected)

## Alternative: Deploy to Netlify

If you prefer Netlify:

1. Sign up at https://www.netlify.com
2. Create a new site from Git
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/hotels_front/browser`
4. Deploy!

## Access Your Deployed App

Once deployed, Vercel will provide you with a URL like:
- `https://your-app-name.vercel.app`

You can share this URL with others to show them the frontend!

