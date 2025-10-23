# Deployment Instructions

## Environment Variables

Make sure to set the following environment variable in your deployment platform:

```
VITE_API_URL=https://tria-assignment.onrender.com/api
```

## Build Configuration

- Node.js Version: 18.x
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: Vite

## Pre-deployment Checklist

1. ✅ Build works locally (`npm run build`)
2. ✅ Environment variables are configured
3. ✅ All dependencies are installed
4. ✅ Tailwind CSS is properly configured
5. ✅ PostCSS configuration is correct

## Troubleshooting

If the build fails:

1. Check Node.js version (should be 18.x)
2. Verify environment variables are set
3. Ensure all dependencies are installed
4. Check PostCSS and Tailwind configuration
