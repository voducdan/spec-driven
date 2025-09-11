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

### 3. Enable GitHub Pages (CRITICAL STEP)
**⚠️ This must be done BEFORE the GitHub Action runs successfully:**

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select **GitHub Actions** 
   - **Important**: Do NOT select "Deploy from a branch"
   - Must be "GitHub Actions" for the workflow to work
5. Click **Save**
6. Wait 2-3 minutes for the setting to take effect

**🔍 Verify Pages is enabled:**
- The Pages section should show: "Your site is ready to be published at https://YOUR_USERNAME.github.io/spec-driven/"
- If you see "Get started with GitHub Pages", the setup is incomplete

**🚨 If you get "Not Found" errors in GitHub Actions:**
1. Double-check that Pages source is set to "GitHub Actions"
2. Repository must be **Public** (required for free GitHub Pages)
3. Re-run the failed workflow after enabling Pages
4. Allow up to 10 minutes for first deployment

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

### "Not Found" Error in GitHub Actions
**Error**: `Get Pages site failed. Please verify that the repository has Pages enabled`

**Solution**:
1. **Check Repository Visibility**: Must be Public (not Private)
2. **Enable Pages First**:
   - Go to Settings → Pages
   - Set Source to "GitHub Actions" 
   - Click Save and wait 2-3 minutes
3. **Re-run the Workflow**:
   - Go to Actions tab
   - Click on the failed workflow
   - Click "Re-run all jobs"
4. **Verify Permissions**: Repository owner must have Pages access

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
