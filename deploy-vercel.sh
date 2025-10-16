#!/bin/bash

# Cyber Oasis - Vercel Deployment Script
# This script ensures animations work properly on Vercel

echo "🚀 Starting Cyber Oasis deployment to Vercel..."

# Step 1: Clean and rebuild CSS
echo "📦 Building CSS with animations..."
npm run build:css

# Step 2: Verify animations are included
echo "🔍 Verifying animations in built CSS..."
if grep -q "animate-fade-in" public/main.css; then
    echo "✅ Animations found in built CSS"
else
    echo "❌ Animations missing from built CSS"
    exit 1
fi

# Step 3: Test locally (optional)
echo "🧪 Testing animations locally..."
if [ -f "test-animations.html" ]; then
    echo "📄 Test file available at test-animations.html"
    echo "   Open it in your browser to verify animations work"
fi

# Step 4: Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Check your Vercel URL to verify animations work"
echo "💡 If animations don't work, the fallback JavaScript will activate"
