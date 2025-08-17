# Vercel Deployment Guide for CVCraft

## Pre-deployment Checklist

### 1. Environment Variables Setup

In your Vercel dashboard, add these environment variables:

```bash
# Required for Gemini AI Analysis
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-pro
```

**Important Notes:**

- Use `GEMINI_API_KEY` (without NEXT*PUBLIC* prefix) for security
- Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- The app will fallback to mock analysis if API key is not set

### 2. Build Configuration

The project is configured with:

- ✅ Next.js 15.2.4 (Vercel-optimized)
- ✅ TypeScript compilation
- ✅ ESLint checks during build
- ✅ Proper static asset optimization

### 3. Deployment Steps

1. **Connect Repository to Vercel**

   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel

   # Deploy from project root
   vercel
   ```

2. **Set Environment Variables in Vercel Dashboard**

   - Go to your project settings
   - Add `GEMINI_API_KEY` with your actual API key
   - Add `GEMINI_MODEL` with value `gemini-1.5-pro`

3. **Deploy**
   - Push to your connected Git repository
   - Vercel will automatically build and deploy

### 4. Post-deployment Verification

Test these endpoints after deployment:

- `https://your-app.vercel.app/` - Home page
- `https://your-app.vercel.app/builder` - Resume builder
- `https://your-app.vercel.app/analysis` - Resume analysis
- `https://your-app.vercel.app/api/ats-analysis` - API health check

## Known Issues & Solutions

### Issue 1: Environment Variables

**Problem**: API key exposed on client-side
**Solution**: ✅ Fixed - Now using server-side only env vars

### Issue 2: Large Bundle Size

**Problem**: Builder page is 137kB (large)
**Solution**: Consider code splitting for builder components

### Issue 3: Static Asset References

**Problem**: Some OG images referenced but not present
**Solution**: ✅ Fixed - Updated to use existing images

## Performance Optimizations

1. **Bundle Analysis**: Builder page is large (137kB) - consider lazy loading
2. **Image Optimization**: All images are unoptimized (set in next.config.mjs)
3. **API Routes**: All routes are dynamic (ƒ) which is correct for this app

## Security Considerations

1. ✅ **API Keys**: Now properly secured server-side
2. ✅ **CORS**: Configured in vercel.json
3. ✅ **Input Validation**: Proper validation in API routes
4. ✅ **Error Handling**: Graceful fallbacks implemented

## Monitoring & Debugging

After deployment, monitor:

- Vercel function logs for API errors
- Console logs for Gemini API responses
- Build logs for any compilation issues

## Fallback Strategy

The app is designed to work even without the Gemini API:

- Mock analysis provides comprehensive feedback
- All features remain functional
- No breaking errors if API key is missing
