# Create Public Repository - Step by Step

## Step 1: Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `omra-frontend-public` (or any name you like)
3. Description: "Public frontend for Omra booking application"
4. Make it **PUBLIC** ✅
5. **DO NOT** check "Add a README file"
6. **DO NOT** check "Add .gitignore"
7. **DO NOT** check "Choose a license"
8. Click **"Create repository"**

## Step 2: After Creating Repository

GitHub will show you commands. Use these instead (already prepared):

```bash
cd C:\Users\hp\Desktop\testhotelgit\hotels_front_public
git remote add public https://github.com/YOUR_USERNAME/omra-frontend-public.git
git branch -M main
git push -u public main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

For example, if your username is `Bedrinisrine`, use:
```bash
git remote add public https://github.com/Bedrinisrine/omra-frontend-public.git
```

## Step 3: Push the Code

Run these commands in order:

```bash
cd C:\Users\hp\Desktop\testhotelgit\hotels_front_public
git remote add public https://github.com/YOUR_USERNAME/omra-frontend-public.git
git branch -M main
git push -u public main
```

## Step 4: Connect to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import the **public** repository you just created
4. Configure:
   - Framework: Angular (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist/hotels_front/browser` (already in vercel.json)
5. Click "Deploy"

## Done! 🎉

Your app will be available at: `https://omra-frontend-public.vercel.app`

The root URL will now work correctly!

