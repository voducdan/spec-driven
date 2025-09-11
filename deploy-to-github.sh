#!/bin/bash
# GitHub Deployment Script for Spec-Driven Portfolio

echo "🚀 GitHub Deployment Helper"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "portfolio-app" ]; then
    echo "❌ Error: Please run this script from the spec_driven directory"
    exit 1
fi

# Check if user has provided GitHub username
if [ -z "$1" ]; then
    echo "Usage: $0 <your-github-username>"
    echo "Example: $0 voducdan"
    exit 1
fi

GITHUB_USERNAME="$1"
REPO_NAME="spec-driven"

echo "📋 Repository Configuration:"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Repository Name: $REPO_NAME"
echo "   Remote URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
echo ""

# Confirm with user
read -p "🤔 Does this look correct? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Aborted by user"
    exit 1
fi

echo "🔗 Adding GitHub remote..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 Next Steps for GitHub Pages:"
    echo "1. Go to https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
    echo "2. Source: Select 'GitHub Actions'"
    echo "3. The workflow will automatically deploy your portfolio"
    echo ""
    echo "🎯 Your portfolio will be available at:"
    echo "   https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
    echo ""
    echo "📊 Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
else
    echo ""
    echo "❌ Failed to push to GitHub"
    echo "Please check:"
    echo "1. Repository exists and is public"
    echo "2. You have push permissions"
    echo "3. GitHub credentials are configured"
fi
