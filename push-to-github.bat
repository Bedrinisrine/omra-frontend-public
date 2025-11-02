@echo off
echo ========================================
echo Push to Public GitHub Repository
echo ========================================
echo.
echo STEP 1: First create a PUBLIC repository on GitHub
echo Go to: https://github.com/new
echo Repository name: omra-frontend-public
echo Make it PUBLIC
echo DO NOT add README
echo.
echo STEP 2: After creating, enter your GitHub username:
set /p USERNAME="Your GitHub Username (e.g., Bedrinisrine): "
echo.
echo STEP 3: Adding remote and pushing...
git remote remove public 2>nul
git remote add public https://github.com/%USERNAME%/omra-frontend-public.git
git branch -M main
git push -u public main
echo.
if %errorlevel% equ 0 (
    echo ========================================
    echo SUCCESS! Code pushed to GitHub
    echo ========================================
    echo.
    echo Next step: Go to Vercel.com and:
    echo 1. Import this repository
    echo 2. Deploy!
) else (
    echo ========================================
    echo ERROR: Make sure you created the repository first!
    echo ========================================
)
echo.
pause
