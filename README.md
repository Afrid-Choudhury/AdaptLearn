# 🌱 AdaptLearn

**AdaptLearn** is an adaptive learning platform designed to provide a **personalized educational experience** based on user assessments. It dynamically tailors course content according to each learner's strengths and weaknesses, helping them master topics more efficiently.

---

## 🧠 Project Overview

AdaptLearn uses assessment data to build custom learning paths for students.

**Key Features:**
- Evaluate each learner's skill level through initial assessments
- Generate dynamic and adaptive course material
- Track progress and performance with detailed analytics
- Role-based access (Students, Instructors, Admins)
- Email notifications for achievements and milestones
- Course builder for instructors to create custom content

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Email** | Resend API |
| **Edge Functions** | Supabase Edge Functions (Deno) |
| **Deployment** | Vercel |
| **Icons** | Lucide React |

---

## 📋 Prerequisites

Before getting started, ensure you have the following installed:

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/) v18+ (includes **npm**)

Verify your installations:
```bash
git --version
node --version
npm --version
```

---

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd adaptlearn
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
RESEND_API_KEY=re_YourResendApiKey
```

**Where to find these values:**
- **Supabase URL & Anon Key**: [Supabase Dashboard](https://app.supabase.com) → Your Project → Settings → API
- **Resend API Key**: [Resend Dashboard](https://resend.com/api-keys)

### 4. Set Up Database

The database schema is managed through Supabase migrations. All migrations are located in `supabase/migrations/`.

**Required Migrations:**
1. `20251006203402_create_adaptive_learning_schema.sql` - Core tables
2. `20251116230138_create_course_enrollment_and_module_structure.sql` - Course structure
3. `20251116231615_create_admin_roles_and_permissions.sql` - Role-based access
4. `20251117030133_fix_user_roles_signup_permissions.sql` - RLS fixes
5. `20251117030527_fix_trigger_rls_bypass.sql` - Trigger fixes
6. `20251202011927_create_email_system.sql` - Email system
7. `20251202012657_fix_user_signup_triggers.sql` - Signup flow fixes
8. `20251202030000_fix_security_performance_issues.sql` - Security & performance optimizations

These migrations should be automatically applied if you're using Supabase CLI or can be run manually through the Supabase Dashboard.

**Security Note:** After migrations, enable "Password Protection" in Supabase Dashboard → Authentication → Settings to prevent use of compromised passwords.

### 5. Deploy Edge Functions

The email sending functionality requires a deployed edge function:

```bash
# The send-email edge function is in supabase/functions/send-email/
# Deploy it through Supabase Dashboard or CLI
```

**Configure Edge Function Secrets:**
In your Supabase Dashboard → Edge Functions → Secrets, add:
- `RESEND_API_KEY`: Your Resend API key

### 6. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🏗️ Build for Production

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## 🌐 Deployment to Vercel

### Prerequisites
- A [Vercel account](https://vercel.com)
- Your Supabase project set up with all migrations applied
- Edge functions deployed in Supabase

### Step-by-Step Deployment

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select **Vite** as the framework preset

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**

   In Vercel → Settings → Environment Variables, add:

   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   **Note:** Do NOT add `RESEND_API_KEY` to Vercel. It's only used in Supabase Edge Functions.

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Post-Deployment

1. **Test Authentication Flow**
   - Sign up for a new account
   - Verify email confirmation works (if enabled)
   - Check that welcome emails are sent

2. **Configure Email Confirmation** (Optional)
   - Go to Supabase Dashboard → Authentication → Settings
   - Toggle "Enable email confirmations" based on your needs
   - For production, it's recommended to keep this enabled

3. **Set Up Custom Domain** (Optional)
   - Vercel → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

4. **Enable Production Email Sending**
   - To send emails to any address (not just your verified email):
   - Go to [Resend Dashboard](https://resend.com/domains)
   - Add and verify your custom domain
   - Update the `from` address in `supabase/functions/send-email/index.ts`
   - Redeploy the edge function

---

## 📁 Project Structure

```
adaptlearn/
├── src/
│   ├── contexts/          # React context providers (Auth, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   │   ├── supabase.ts    # Supabase client
│   │   ├── database.types.ts  # TypeScript types
│   │   ├── email-service.ts   # Email sending logic
│   │   └── email-templates.ts # Email HTML templates
│   └── pages/             # Application pages/routes
├── supabase/
│   ├── migrations/        # Database migrations
│   └── functions/         # Edge functions
├── .env.example           # Environment variable template
├── vercel.json            # Vercel configuration (SPA routing)
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

---

## 🔐 Security Notes

- Never commit `.env` files to version control
- Row Level Security (RLS) is enabled on all database tables
- API keys are scoped with minimal permissions
- Authentication is required for all sensitive operations
- Console logs are disabled in production builds

---

## 📧 Email System

The email system uses Resend API and supports:
- Welcome emails on signup
- Achievement unlocked notifications
- Assessment reminders
- Password recovery emails

**Testing Mode:**
In development/testing, Resend only sends to your verified email address. All emails are redirected and prefixed with `[TEST for original@email.com]`.

**Production Mode:**
After verifying a domain in Resend, emails will be sent to actual recipients.

See `EMAIL_SETUP.md` for detailed configuration instructions.

---

## 🐛 Troubleshooting

### Build Fails
- Run `npm run typecheck` to identify TypeScript errors
- Run `npm run lint` to check for code issues
- Ensure all environment variables are set correctly

### Authentication Issues
- Verify Supabase URL and Anon Key are correct
- Check that RLS policies are properly configured
- Ensure email confirmation settings match your flow

### Email Not Sending
- Check that edge function is deployed in Supabase
- Verify RESEND_API_KEY is set in Edge Function secrets
- Review edge function logs in Supabase Dashboard
- Check email logs in database: `SELECT * FROM email_log ORDER BY created_at DESC`

### Database Connection Issues
- Verify Supabase project is active
- Check that all migrations are applied
- Ensure RLS policies allow your operations

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For issues and questions:
- Check existing documentation in the repo
- Review Supabase logs for backend errors
- Check browser console for frontend errors
- Review `EMAIL_SETUP.md` for email-specific issues

---

Built with ❤️ using React, TypeScript, Supabase, and Vercel.
