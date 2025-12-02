# 🚀 AdaptLearn Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [x] All TypeScript errors fixed
- [x] All ESLint errors resolved
- [x] Console logs wrapped with DEV checks
- [x] Unused imports removed
- [x] Production build successful (`npm run build`)

### Configuration Files
- [x] `.env.example` created with all required variables
- [x] `vercel.json` created for SPA routing
- [x] `index.html` updated with SEO meta tags
- [x] README updated with deployment instructions
- [x] `.gitignore` includes `.env`

### Database
- [ ] All 8 migrations applied to production Supabase instance (including security fixes)
- [ ] RLS policies active on all tables
- [ ] Database backups configured in Supabase
- [ ] Test data added (optional)
- [x] Security and performance issues fixed (migration applied)

### Authentication
- [ ] Supabase Auth configured correctly
- [ ] Email confirmation settings configured (enabled/disabled)
- [ ] Password requirements set appropriately
- [ ] Email templates customized (optional)
- [ ] **IMPORTANT:** Enable "Password Protection" (leaked password detection) in Supabase Dashboard → Authentication → Settings

### Edge Functions
- [ ] `send-email` edge function deployed to Supabase
- [ ] `RESEND_API_KEY` secret configured in Supabase Edge Functions
- [ ] Edge function tested and working

### Email System
- [ ] Resend account created
- [ ] Resend API key obtained
- [ ] For production: Domain verified in Resend (if sending to non-verified emails)
- [ ] Email templates reviewed and tested

---

## 🌐 Vercel Deployment Steps

### 1. GitHub Setup
- [ ] Code pushed to GitHub repository
- [ ] Repository is public or Vercel has access

### 2. Vercel Project Setup
- [ ] New project created in Vercel
- [ ] GitHub repository connected
- [ ] Framework preset set to **Vite**
- [ ] Build settings configured:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

### 3. Environment Variables
Add these in Vercel → Settings → Environment Variables:

- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
- [ ] `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

**Important:**
- ✅ DO add `VITE_` prefixed variables
- ❌ DO NOT add `RESEND_API_KEY` (it's in Supabase Edge Functions)

### 4. Deploy
- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete (should take 1-2 minutes)
- [ ] Check deployment logs for any errors
- [ ] Visit deployment URL to verify app is live

---

## 🧪 Post-Deployment Testing

### Authentication Flow
- [ ] Sign up with a new account
- [ ] Verify email confirmation flow (if enabled)
- [ ] Check welcome email received
- [ ] Sign in with new account
- [ ] Sign out works correctly

### Core Features
- [ ] Dashboard loads correctly
- [ ] Assessment can be completed
- [ ] Courses page displays courses
- [ ] Course enrollment works
- [ ] Course detail page shows content
- [ ] Progress tracking updates correctly

### Admin Features (if applicable)
- [ ] Admin dashboard accessible with admin role
- [ ] Course builder works
- [ ] New courses can be created
- [ ] Modules and lessons can be added

### Email Notifications
- [ ] Welcome email sends on signup
- [ ] Achievement emails send correctly
- [ ] Email preferences work
- [ ] Email log table updated in database

---

## 🔧 Common Issues & Solutions

### Build Fails on Vercel
**Symptoms:** Build process errors out
**Solutions:**
- Check Vercel build logs for specific errors
- Ensure all dependencies are in `package.json`, not just `devDependencies`
- Verify Node version matches local (should be 18+)
- Run `npm run build` locally to reproduce

### Environment Variables Not Working
**Symptoms:** Blank page, Supabase connection errors
**Solutions:**
- Ensure variables start with `VITE_` prefix
- Verify values don't have extra spaces or quotes
- Redeploy after adding environment variables
- Check browser console for specific errors

### 404 on Page Refresh
**Symptoms:** Direct URLs work, but refresh gives 404
**Solutions:**
- Verify `vercel.json` is present and deployed
- Check Vercel dashboard → Settings → General → "Rewrites and Redirects"
- Should see rule: `/*` → `/index.html`

### Authentication Redirects Not Working
**Symptoms:** After login, stays on login page or errors
**Solutions:**
- Check Supabase Dashboard → Authentication → URL Configuration
- Add your Vercel domain to "Site URL"
- Add Vercel domain to "Redirect URLs"

### Emails Not Sending
**Symptoms:** Welcome emails don't arrive
**Solutions:**
- Check Supabase Edge Function logs for errors
- Verify `RESEND_API_KEY` is set in Edge Function secrets
- For production: Ensure domain is verified in Resend
- Check `email_log` table in database for error messages
- Verify edge function is deployed (not just the code uploaded)

### Database Connection Issues
**Symptoms:** Can't fetch data, RLS errors
**Solutions:**
- Verify Supabase project is active
- Check RLS policies allow the operations
- Ensure `VITE_SUPABASE_ANON_KEY` is the anon key, not service role key
- Check browser network tab for 401/403 errors

---

## 🎯 Production Optimizations

### Performance
- [ ] Enable Vercel Analytics
- [ ] Set up Vercel Speed Insights
- [ ] Configure caching headers (optional)
- [ ] Enable compression (default in Vercel)

### Monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up Supabase alerts
- [ ] Monitor database usage

### Security
- [ ] Review RLS policies for edge cases
- [ ] Enable Supabase database backups
- [ ] Set up rate limiting on Edge Functions (optional)
- [ ] Review CORS settings

### SEO
- [ ] Add robots.txt (optional)
- [ ] Add sitemap.xml (optional)
- [ ] Verify meta tags are correct
- [ ] Test Open Graph preview

---

## 📊 Go-Live Checklist

### Final Checks Before Going Live
- [ ] All features tested in production environment
- [ ] Test user accounts created and working
- [ ] Admin access verified
- [ ] Email notifications working
- [ ] No console errors in browser
- [ ] No 404s or broken links
- [ ] Mobile responsive design verified
- [ ] Performance is acceptable (load times < 3s)

### Documentation
- [ ] README up to date
- [ ] Environment variables documented
- [ ] API documentation complete (if applicable)
- [ ] Known issues documented

### Communication
- [ ] Stakeholders notified of go-live
- [ ] Support channels established
- [ ] Backup plan in place
- [ ] Rollback procedure documented

---

## 🔄 Continuous Deployment

After initial deployment, every push to your main branch will trigger a new deployment.

### For Each Deployment:
1. Test locally first: `npm run build && npm run preview`
2. Push to GitHub: `git push origin main`
3. Vercel auto-deploys
4. Monitor deployment logs
5. Test critical user flows
6. Check error tracking for new issues

### Branch Deployments:
- Every pull request gets a preview deployment
- Test features on preview URLs before merging
- Preview URLs are temporary and deleted after PR merge

---

## 📱 Custom Domain Setup (Optional)

### Adding a Custom Domain
1. Purchase domain from registrar (Namecheap, GoDaddy, etc.)
2. In Vercel → Settings → Domains → Add Domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)
5. Update Supabase Auth redirect URLs with new domain

### SSL Certificate
- Vercel automatically provisions SSL certificates
- Force HTTPS in Vercel settings (enabled by default)

---

## ✨ Launch Day!

Once everything is checked and tested:

1. **Make Announcement** 🎉
   - Share with intended users
   - Post on relevant channels
   - Gather feedback

2. **Monitor Closely**
   - Watch error logs
   - Monitor performance metrics
   - Be ready to respond to issues

3. **Iterate**
   - Collect user feedback
   - Prioritize bug fixes
   - Plan new features

---

## 📝 Notes

- Keep a log of any production issues and solutions
- Document any custom configurations
- Update this checklist as your deployment process evolves

---

**Deployment Status:** ⬜ Not Started | 🟨 In Progress | ✅ Complete

Current Status: 🟨 Ready for Deployment
