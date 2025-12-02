# 🚀 Quick Deploy Guide

**Fast-track deployment guide for AdaptLearn to Vercel.**

---

## Prerequisites (5 minutes)

1. **Supabase Setup**
   - ✅ Supabase project created
   - ✅ All migrations applied
   - ✅ `send-email` edge function deployed with `RESEND_API_KEY` secret

2. **Resend Setup**
   - ✅ Resend account created
   - ✅ API key obtained

3. **Code Ready**
   - ✅ Latest code pushed to GitHub

---

## Deploy to Vercel (10 minutes)

### Step 1: Import Project
1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

### Step 2: Configure Project
- **Framework Preset:** Vite
- **Root Directory:** ./
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### Step 3: Add Environment Variables
Click "Environment Variables" and add:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Where to find these:**
- Supabase Dashboard → Settings → API

### Step 4: Deploy
1. Click "Deploy"
2. Wait 1-2 minutes for build
3. Click the deployment URL to view your live app

---

## Post-Deploy (5 minutes)

### Test Core Flow
1. Visit your deployment URL
2. Sign up for a new account
3. Verify you receive welcome email
4. Complete assessment
5. View courses

### Update Supabase Auth URLs
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

---

## Troubleshooting

### ❌ Build Failed
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Try running `npm run build` locally

### ❌ Blank Page After Deploy
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure `VITE_` prefix on all client variables

### ❌ 404 on Refresh
- Verify `vercel.json` is in root directory
- Check it contains the rewrite rule

### ❌ Can't Sign In
- Add your Vercel domain to Supabase Auth URLs
- Check environment variables match your Supabase project

### ❌ No Welcome Email
- Verify edge function is deployed in Supabase
- Check `RESEND_API_KEY` is set in Edge Function secrets
- In testing mode, emails only go to your verified Resend email

---

## Next Steps

### For Production Use
1. **Verify a domain in Resend** to send emails to any address
   - Go to [resend.com/domains](https://resend.com/domains)
   - Add and verify your domain
   - Update edge function `from` address

2. **Add a custom domain** (optional)
   - Vercel → Settings → Domains
   - Follow DNS setup instructions

3. **Enable email confirmation** (recommended)
   - Supabase → Authentication → Settings
   - Toggle "Enable email confirmations"

### Monitoring
- Enable Vercel Analytics
- Set up error tracking
- Monitor Supabase usage

---

## 📚 More Information

- Full deployment guide: `DEPLOYMENT_CHECKLIST.md`
- General documentation: `README.md`
- Email setup: `EMAIL_SETUP.md`

---

**That's it! Your app should now be live.** 🎉
