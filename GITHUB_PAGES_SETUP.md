# GitHub Pages Setup Guide

## 🚀 Quick Deployment Steps

### 1. Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Repository name: `spec-driven`
3. Description: `Spec-driven development framework with interactive portfolio`
4. Set to **Public** (required for GitHub Pages)
5. **DO NOT** initialize with README (we already have one)
6. Click **Create repository**

### 2. Push Code to GitHub
```bash
# Run the deployment script with your GitHub username
./deploy-to-github.sh YOUR_GITHUB_USERNAME

# Example:
./deploy-to-github.sh voducdan
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically deploy your portfolio

### 4. Access Your Portfolio
Your portfolio will be available at:
```
https://YOUR_USERNAME.github.io/spec-driven/
```

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/spec-driven.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🏗️ Build Process

The GitHub Actions workflow automatically:
1. Installs Node.js dependencies
2. Builds the portfolio app with Vite
3. Deploys to GitHub Pages
4. Updates the live site

## 🔄 Automatic Updates

Every time you push changes to the `main` branch:
- The portfolio will automatically rebuild and deploy
- Changes appear live within 2-3 minutes
- No manual intervention required

## 📁 Repository Structure

After deployment, your repository will contain:
- **Source code**: All development files
- **Documentation**: README, guides, templates
- **Automated deployment**: GitHub Actions workflow
- **Live portfolio**: Accessible via GitHub Pages

## ⚠️ Troubleshooting

### Build Failures
- Check the Actions tab for build logs
- Ensure all dependencies are in package.json
- Verify Vite configuration is correct

### Pages Not Loading
- Confirm repository is public
- Check that GitHub Pages source is set to "GitHub Actions"
- Wait 5-10 minutes for first deployment

### URL Issues
- Portfolio loads at `/spec-driven/` subdirectory
- Vite config handles the base path automatically
- Update any hardcoded URLs if needed

## 🎯 Next Steps

After successful deployment:
1. Test the live portfolio
2. Share the URL with potential employers
3. Continue developing new features
4. Push updates to automatically deploy

## 📞 Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review the Vite build output
3. Ensure all files are committed and pushed
4. Verify GitHub Pages settings
