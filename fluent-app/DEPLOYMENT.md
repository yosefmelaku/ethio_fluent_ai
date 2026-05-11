# Deployment Guide for Fluent App

This guide will help you deploy the Fluent App to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select the `fluent-app` folder as the root directory

2. **Configure Build Settings**:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set Environment Variables**:
   - In the Vercel dashboard, go to your project settings
   - Navigate to "Environment Variables"
   - Add: `OPENAI_API_KEY` with your OpenAI API key value
   - Make sure it's available for all environments (Production, Preview, Development)

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the fluent-app directory**:
   ```bash
   cd fluent-app
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   Enter your OpenAI API key when prompted.

5. **Redeploy with Environment Variables**:
   ```bash
   vercel --prod
   ```

## Environment Variables Required

- `OPENAI_API_KEY`: Your OpenAI API key for accessing GPT models and other OpenAI services

## Post-Deployment

1. **Test Your Deployment**:
   - Visit your deployed URL
   - Test the voice recording functionality
   - Verify API endpoints are working

2. **Custom Domain** (Optional):
   - In Vercel dashboard, go to your project
   - Navigate to "Domains"
   - Add your custom domain

## Troubleshooting

### Build Errors
- Check that all dependencies are properly listed in `package.json`
- Ensure TypeScript compilation passes locally with `npm run build`

### Runtime Errors
- Verify environment variables are set correctly
- Check Vercel function logs in the dashboard
- Ensure OpenAI API key has sufficient credits and permissions

### API Route Issues
- API routes are automatically deployed as Vercel Functions
- Check function logs in Vercel dashboard for errors
- Verify CORS settings if needed for external API calls

## Performance Optimization

The app is already optimized for Vercel deployment with:
- Static generation where possible
- API routes as serverless functions
- Automatic code splitting
- Image optimization (if using Next.js Image component)

## Monitoring

- Use Vercel Analytics for performance monitoring
- Check Vercel Function logs for API route debugging
- Monitor OpenAI API usage in your OpenAI dashboard