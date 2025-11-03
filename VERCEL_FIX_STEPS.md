# 🔧 EXACT STEPS TO FIX 404 ERROR

## 🎯 The Problem:
Vercel is returning 404 for `/user` route because Angular routing isn't working.

## ✅ Solution - Follow These Steps EXACTLY:

### Step 1: Go to Vercel Dashboard
1. Open: https://vercel.com/dashboard
2. Click: **omra-frontend-public1**

### Step 2: Check Settings → Build and Deployment
1. Click **Settings** tab
2. Click **Build and Deployment** (in left sidebar)
3. Verify these EXACT values:
   - **Framework Preset:** `Angular`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist/hotels_front/browser` ⚠️ CRITICAL!
   - **Install Command:** Leave default or `npm install`
   - **Root Directory:** `.` (empty or dot)

### Step 3: If Output Directory is DIFFERENT:
1. Click the **Output Directory** field
2. Clear it
3. Type exactly: `dist/hotels_front/browser`
4. Click **Save** (button appears at top)

### Step 4: Delete vercel.json Conflict
**IMPORTANT:** If Vercel Dashboard settings are overriding vercel.json, we need to ensure they match.

**Option A: Remove vercel.json** (Recommended if dashboard settings are correct)
- Delete `vercel.json` from repository
- Let Vercel use dashboard settings only

**Option B: Keep vercel.json but ensure no conflicts**
- vercel.json should NOT have `outputDirectory`
- vercel.json should ONLY have routing rules
- Output Directory MUST be set in Vercel dashboard

### Step 5: Force Fresh Deployment
1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Delete"** (to remove cached build)
4. Confirm deletion

### Step 6: Create New Deployment
**Option A: Auto-deploy from Git** (if connected to GitHub)
- Just wait for auto-deploy after code push

**Option B: Manual Deploy**
1. Click **"Add New..."** → **"Deployment"**
2. Connect your Git repository
3. Select branch: `main`
4. Click **"Deploy"**
5. **IMPORTANT:** When prompted, **UNCHECK** "Use existing Build Cache"

### Step 7: Watch Build Logs
1. Click on the new deployment
2. Click **"View Build Logs"**
3. Verify:
   - ✅ Build completes successfully
   - ✅ No errors about Output Directory
   - ✅ Files are generated in `dist/hotels_front/browser/`

### Step 8: Wait for "Ready"
- Status must show **"Ready"** (green)
- Don't test while it says "Building" or "Queued"

### Step 9: Test
1. Visit: `https://omra-frontend-public1.vercel.app/user`
2. Should load without 404 ✅
3. Refresh page (F5) - should still work ✅

---

## 🐛 If STILL Getting 404:

### Check 1: Verify Build Output
1. Go to **Deployments** → Latest
2. Click **"View Source Files"** or use Vercel CLI
3. Check if `index.html` exists in the deployed files
4. Check if files are in correct location

### Check 2: Test Root URL
1. Visit: `https://omra-frontend-public1.vercel.app/`
2. Does the root work? (Should redirect to `/user`)
3. If root works but `/user` doesn't → routing issue

### Check 3: Check Browser Console
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Visit `/user` route
4. Look for JavaScript errors
5. Share any errors you see

### Check 4: Try Incognito Mode
1. Open incognito/private window
2. Visit `/user` route
3. Does it work? (Might be browser cache)

### Check 5: Verify Angular Base Href
The `index.html` should have:
```html
<base href="/">
```
Not `/user/` or anything else!

---

## 💡 Why This Happens:

The 404 occurs because:
1. Vercel receives request for `/user`
2. Vercel looks for file at `/user/index.html` → doesn't exist
3. Vercel returns 404 instead of serving `/index.html`

**Solution:** `vercel.json` rewrite rule tells Vercel: "Any route → serve `/index.html`"
Angular then handles routing client-side.

---

## 📝 Current vercel.json:
```json
{
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel: "All routes → serve index.html"

---

## 🎯 Most Likely Fix:

1. ✅ Verify Output Directory in Vercel dashboard = `dist/hotels_front/browser`
2. ✅ Delete old deployment
3. ✅ Redeploy with cache disabled
4. ✅ Wait for "Ready" status
5. ✅ Test after deployment completes

**The Output Directory MUST match exactly what Angular builds!**

