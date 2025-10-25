@echo off
REM Finance Tracker - Quick Deploy Script for Windows
REM This script helps you deploy to Vercel quickly

echo.
echo 🚀 Finance Tracker Deployment Helper
echo ====================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Vercel CLI not found
    echo.
    set /p install_choice="Install Vercel CLI globally? (y/n): "
    if /i "%install_choice%"=="y" (
        echo 📦 Installing Vercel CLI...
        call npm install -g vercel
        echo ✅ Vercel CLI installed
    ) else (
        echo ℹ️  Please install manually: npm install -g vercel
        exit /b 1
    )
)

:menu
echo.
echo 🎯 Deployment Options:
echo 1. Deploy Frontend to Vercel
echo 2. Deploy to Production
echo 3. Open Vercel Dashboard
echo 4. View Deployment Guide
echo 5. Exit
echo.

set /p option="Choose option (1-5): "

if "%option%"=="1" goto deploy
if "%option%"=="2" goto production
if "%option%"=="3" goto dashboard
if "%option%"=="4" goto guide
if "%option%"=="5" goto end
goto invalid

:deploy
echo 🚀 Deploying Frontend to Vercel...
cd frontend
call vercel
echo ✅ Deployment initiated!
echo 🌐 Check your Vercel dashboard for the URL
goto end

:production
echo 🚀 Deploying to Production...
cd frontend
call vercel --prod
echo ✅ Production deployment complete!
goto end

:dashboard
echo 🌐 Opening Vercel Dashboard...
start https://vercel.com/dashboard
goto end

:guide
echo 📚 Opening Deployment Guide...
start VERCEL_READY.md
goto end

:invalid
echo ❌ Invalid option
goto menu

:end
echo.
echo 🎉 Done!
echo.
echo 📚 For more details, see VERCEL_READY.md
echo.
pause
