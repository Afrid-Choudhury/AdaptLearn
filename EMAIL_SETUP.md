# Email System Setup

## Overview
This project uses Resend for transactional emails and Supabase for email tracking and preferences.

## Configuration

### Email Confirmation Settings

By default, Supabase requires email confirmation for new user signups. You have two options:

#### Option 1: Disable Email Confirmation (Recommended for Development)
1. Go to your Supabase Dashboard
2. Navigate to Authentication → Settings
3. Find "Enable email confirmations" and toggle it OFF
4. Users will be immediately logged in after signup

#### Option 2: Keep Email Confirmation Enabled (Recommended for Production)
1. Users will receive a confirmation email after signup
2. They must click the link in the email to confirm their account
3. The welcome email will be sent automatically after they confirm

### Resend API Key

The Resend API key is configured in `.env`:
```
RESEND_API_KEY=re_Fr8Baw9w_2vsdrSKRyUnL1RomWfFTRerr
```

## How It Works

### Welcome Emails
- Automatically sent when users sign up (after email confirmation if enabled)
- Triggered by the `useWelcomeEmail` hook on the Dashboard page
- Only sent to users who created their account within the last minute
- Includes links to take assessment and visit dashboard

### Email Sending Flow
1. User signs up → Account created in Supabase
2. If email confirmation is disabled: User is immediately logged in → Dashboard loads → Welcome email sent
3. If email confirmation is enabled: User receives confirmation email → Clicks link → Logs in → Dashboard loads → Welcome email sent

### Achievement System
- "Welcome Aboard" achievement is awarded automatically on signup
- Achievement unlocking is integrated with email notifications
- Other achievements are awarded based on user actions (enrollments, assessments, etc.)

## Testing

### Test Page
Navigate to `/email-test` to send test emails to yourself:
- Welcome Email
- Assessment Reminder
- Achievement Unlocked

### Manual Testing
1. Sign up for a new account
2. Wait 2-3 seconds after reaching the dashboard
3. Check your email inbox (and spam folder) for the welcome email

## Email Templates

All email templates are in `src/lib/email-templates.ts`:
- `generateWelcomeEmail()` - Welcome message with call-to-action
- `generatePasswordRecoveryEmail()` - Password reset with security tips
- `generateAchievementEmail()` - Achievement celebration
- `generateAssessmentReminderEmail()` - Encouragement to take assessment

## Database Tables

### `user_notification_preferences`
Stores user email preferences (opt-in/opt-out for different email types)

### `email_log`
Tracks all sent emails with status, timestamps, and error messages

### `achievements`
Stores all available achievements and their unlock criteria

### `user_achievements`
Tracks which achievements each user has unlocked

## Troubleshooting

### "Database error saving new user"
This was fixed by consolidating triggers. If it reoccurs, check that only one trigger exists on `auth.users`.

### "Page freezes after signup"
- Check if email confirmation is enabled in Supabase
- Verify the signup flow returns data properly
- Check browser console for errors

### "Email not sending"
- Verify Resend API key is correct
- Check email logs in database: `SELECT * FROM email_log ORDER BY created_at DESC`
- Ensure edge function is deployed: Visit Supabase Dashboard → Edge Functions
- Check edge function logs for errors

### "Welcome email sends multiple times"
The `useWelcomeEmail` hook has protection against this with `useRef`, but if it happens:
- Clear browser cache and local storage
- Check that only one Dashboard component is mounted
