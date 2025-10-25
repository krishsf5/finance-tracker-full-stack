#!/bin/bash

# Finance Tracker - Quick Deploy Script
# This script helps you deploy to Vercel quickly

echo "🚀 Finance Tracker Deployment Helper"
echo "===================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found!"
    echo "Run: git init"
    exit 1
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Uncommitted changes detected"
    echo ""
    read -p "Commit all changes? (y/n): " commit_choice
    
    if [ "$commit_choice" = "y" ]; then
        echo "💾 Committing changes..."
        git add .
        read -p "Enter commit message: " commit_msg
        git commit -m "$commit_msg"
        echo "✅ Changes committed"
    fi
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "⚠️  Vercel CLI not found"
    echo ""
    read -p "Install Vercel CLI globally? (y/n): " install_choice
    
    if [ "$install_choice" = "y" ]; then
        echo "📦 Installing Vercel CLI..."
        npm install -g vercel
        echo "✅ Vercel CLI installed"
    else
        echo "ℹ️  Please install manually: npm install -g vercel"
        exit 1
    fi
fi

echo ""
echo "🎯 Deployment Options:"
echo "1. Deploy Frontend to Vercel"
echo "2. Set up environment variables"
echo "3. Deploy to production"
echo "4. Exit"
echo ""

read -p "Choose option (1-4): " option

case $option in
    1)
        echo "🚀 Deploying Frontend to Vercel..."
        cd frontend
        vercel
        echo "✅ Deployment initiated!"
        echo "🌐 Check your Vercel dashboard for the URL"
        ;;
    2)
        echo "🔐 Setting Environment Variables..."
        cd frontend
        echo ""
        read -p "Enter your backend API URL (e.g., https://your-backend.railway.app/api): " api_url
        vercel env add VITE_API_URL production
        echo "$api_url" | vercel env add VITE_API_URL production
        
        vercel env add VITE_APP_NAME production
        echo "Finance Tracker" | vercel env add VITE_APP_NAME production
        
        echo "✅ Environment variables set!"
        ;;
    3)
        echo "🚀 Deploying to Production..."
        cd frontend
        vercel --prod
        echo "✅ Production deployment complete!"
        ;;
    4)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "🎉 Done!"
echo ""
echo "📚 For more details, see VERCEL_READY.md"
