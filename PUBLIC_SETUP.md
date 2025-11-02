# Public Repository Setup for Vercel

This repository contains only the frontend code and is set up for public deployment on Vercel.

## 🚀 Deploying to Vercel

### Step 1: Create Public Repository on GitHub

1. Go to GitHub and create a **new public repository**
   - Repository name: `omra-frontend-public` (or any name you prefer)
   - Make it **Public**
   - Do NOT initialize with README (we already have one)

2. Push this code to the new repository:
```bash
cd hotels_front_public
git remote add public https://github.com/YOUR_USERNAME/omra-frontend-public.git
git branch -M main
git push -u public main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub

2. Click **"Add New"** → **"Project"**

3. Import your **public repository** (`omra-frontend-public`)

4. Vercel will auto-detect Angular. Configure:
   - **Framework Preset**: Angular (auto-detected)
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist/hotels_front/browser` (already configured in vercel.json)
   
5. **Environment Variables** (if needed):
   - Add any environment variables for API URLs if required

6. Click **"Deploy"**

### Step 3: Verify Deployment

After deployment, your app will be available at:
- `https://omra-frontend-public.vercel.app` (or your custom domain)

The root URL (`/`) should now work correctly and redirect to `/user` automatically.

## 🔧 Troubleshooting

If you see **404 errors** on the root URL:

1. Make sure `vercel.json` is committed and pushed
2. Check that `outputDirectory` in vercel.json matches your build output
3. Verify the build completes successfully
4. Check Vercel deployment logs for any errors

## 📝 Notes

- This repository is **public** and contains only frontend code
- Backend code remains private in the main repository
- The app uses static data as fallback when API is unavailable (for demo purposes)
- All app functionality works normally when backend is connected

