export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface WelcomeEmailData {
  username: string;
  email: string;
  assessmentUrl: string;
  dashboardUrl: string;
}

export interface PasswordRecoveryEmailData {
  username: string;
  resetLink: string;
  expirationTime: string;
}

export interface AchievementEmailData {
  username: string;
  achievementName: string;
  achievementDescription: string;
  achievementIcon: string;
  totalAchievements: number;
  dashboardUrl: string;
}

export interface AssessmentReminderEmailData {
  username: string;
  assessmentUrl: string;
  estimatedMinutes: string;
}

const getBaseStyles = () => `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1f2937;
    background-color: #f9fafb;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .header {
    background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
    color: #ffffff;
    padding: 40px 30px;
    text-align: center;
  }
  .logo {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .content {
    padding: 40px 30px;
  }
  .button {
    display: inline-block;
    padding: 14px 32px;
    background-color: #2563eb;
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    margin: 20px 0;
    transition: background-color 0.2s;
  }
  .button:hover {
    background-color: #1d4ed8;
  }
  .footer {
    background-color: #f3f4f6;
    padding: 30px;
    text-align: center;
    font-size: 14px;
    color: #6b7280;
  }
  .achievement-badge {
    display: inline-block;
    font-size: 64px;
    margin: 20px 0;
  }
  .stats {
    background-color: #f0f9ff;
    border-left: 4px solid #2563eb;
    padding: 16px;
    margin: 20px 0;
    border-radius: 4px;
  }
  .warning {
    background-color: #fef3c7;
    border-left: 4px solid #f59e0b;
    padding: 16px;
    margin: 20px 0;
    border-radius: 4px;
  }
`;

export function generateWelcomeEmail(data: WelcomeEmailData): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to AdaptLearn</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📚 AdaptLearn</div>
          <p style="margin: 0; font-size: 18px;">Welcome to Your Learning Journey!</p>
        </div>
        <div class="content">
          <h1 style="color: #1f2937; margin-top: 0;">Hi ${data.username}! 👋</h1>
          <p style="font-size: 16px;">
            We're thrilled to have you join AdaptLearn! Your account has been successfully created,
            and you're now ready to embark on a personalized learning experience.
          </p>
          <div class="stats">
            <strong>🎯 Next Step: Take Your Skill Assessment</strong>
            <p style="margin: 10px 0 0 0;">
              Discover your current skill level and get personalized course recommendations tailored just for you.
              It only takes 5-10 minutes!
            </p>
          </div>
          <div style="text-align: center;">
            <a href="${data.assessmentUrl}" class="button">Take Assessment Now</a>
          </div>
          <p style="font-size: 16px; margin-top: 30px;">
            <strong>What you can do on AdaptLearn:</strong>
          </p>
          <ul style="font-size: 16px; line-height: 1.8;">
            <li>📊 Track your progress across multiple courses</li>
            <li>🏆 Earn achievements and badges</li>
            <li>🎓 Learn at your own pace with structured modules</li>
            <li>📈 Get personalized recommendations based on your skill level</li>
          </ul>
          <p style="font-size: 16px;">
            Ready to start? <a href="${data.dashboardUrl}" style="color: #2563eb; text-decoration: none;">Visit your dashboard</a>
          </p>
        </div>
        <div class="footer">
          <p>You're receiving this email because you created an account on AdaptLearn.</p>
          <p style="margin-top: 10px;">
            <a href="${data.dashboardUrl}" style="color: #2563eb; text-decoration: none;">Dashboard</a> •
            <a href="${data.assessmentUrl}" style="color: #2563eb; text-decoration: none;">Take Assessment</a>
          </p>
          <p style="margin-top: 20px; font-size: 12px;">© 2025 AdaptLearn. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to AdaptLearn!

Hi ${data.username}!

We're thrilled to have you join AdaptLearn! Your account has been successfully created, and you're now ready to embark on a personalized learning experience.

Next Step: Take Your Skill Assessment
Discover your current skill level and get personalized course recommendations tailored just for you. It only takes 5-10 minutes!

Take Assessment: ${data.assessmentUrl}

What you can do on AdaptLearn:
- Track your progress across multiple courses
- Earn achievements and badges
- Learn at your own pace with structured modules
- Get personalized recommendations based on your skill level

Visit your dashboard: ${data.dashboardUrl}

© 2025 AdaptLearn. All rights reserved.
  `;

  return {
    subject: 'Welcome to AdaptLearn - Start Your Learning Journey! 🚀',
    html,
    text,
  };
}

export function generatePasswordRecoveryEmail(data: PasswordRecoveryEmailData): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📚 AdaptLearn</div>
          <p style="margin: 0; font-size: 18px;">Password Reset Request</p>
        </div>
        <div class="content">
          <h1 style="color: #1f2937; margin-top: 0;">Hi ${data.username},</h1>
          <p style="font-size: 16px;">
            We received a request to reset your password for your AdaptLearn account.
            Click the button below to create a new password.
          </p>
          <div style="text-align: center;">
            <a href="${data.resetLink}" class="button">Reset Password</a>
          </div>
          <div class="warning">
            <strong>⏰ Important:</strong> This password reset link will expire in ${data.expirationTime}.
          </div>
          <p style="font-size: 16px;">
            <strong>Security Tips:</strong>
          </p>
          <ul style="font-size: 16px; line-height: 1.8;">
            <li>🔒 Never share your password reset link with anyone</li>
            <li>✉️ If you didn't request this reset, please ignore this email</li>
            <li>🛡️ Your password will not change unless you click the link above</li>
          </ul>
          <div class="stats">
            <p style="margin: 0;">
              <strong>Didn't request this?</strong> Your account is still secure.
              You can safely ignore this email if you didn't request a password reset.
            </p>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <span style="word-break: break-all; color: #2563eb;">${data.resetLink}</span>
          </p>
        </div>
        <div class="footer">
          <p>This is an automated security email from AdaptLearn.</p>
          <p style="margin-top: 20px; font-size: 12px;">© 2025 AdaptLearn. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Reset Your Password - AdaptLearn

Hi ${data.username},

We received a request to reset your password for your AdaptLearn account. Click the link below to create a new password.

Reset Password: ${data.resetLink}

Important: This password reset link will expire in ${data.expirationTime}.

Security Tips:
- Never share your password reset link with anyone
- If you didn't request this reset, please ignore this email
- Your password will not change unless you click the link above

Didn't request this? Your account is still secure. You can safely ignore this email if you didn't request a password reset.

© 2025 AdaptLearn. All rights reserved.
  `;

  return {
    subject: 'Reset Your AdaptLearn Password 🔐',
    html,
    text,
  };
}

export function generateAchievementEmail(data: AchievementEmailData): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Achievement Unlocked!</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📚 AdaptLearn</div>
          <p style="margin: 0; font-size: 18px;">Achievement Unlocked! 🎉</p>
        </div>
        <div class="content">
          <h1 style="color: #1f2937; margin-top: 0;">Congratulations, ${data.username}! 🎊</h1>
          <p style="font-size: 16px;">
            You've just unlocked a new achievement! Your dedication to learning is paying off.
          </p>
          <div style="text-align: center; margin: 40px 0;">
            <div class="achievement-badge">${data.achievementIcon}</div>
            <h2 style="color: #2563eb; margin: 20px 0 10px 0; font-size: 24px;">
              ${data.achievementName}
            </h2>
            <p style="color: #6b7280; font-size: 16px; margin: 0;">
              ${data.achievementDescription}
            </p>
          </div>
          <div class="stats">
            <strong>🏆 Your Achievement Stats</strong>
            <p style="margin: 10px 0 0 0; font-size: 16px;">
              You now have <strong style="color: #2563eb;">${data.totalAchievements}</strong>
              achievement${data.totalAchievements !== 1 ? 's' : ''} unlocked!
            </p>
          </div>
          <p style="font-size: 16px; margin-top: 30px;">
            Keep up the amazing work! Every achievement brings you one step closer to mastering your skills.
          </p>
          <div style="text-align: center;">
            <a href="${data.dashboardUrl}" class="button">View All Achievements</a>
          </div>
          <p style="font-size: 16px; text-align: center; color: #6b7280; margin-top: 30px;">
            What's next? Continue your learning journey to unlock even more achievements!
          </p>
        </div>
        <div class="footer">
          <p>You're receiving this email because you unlocked an achievement on AdaptLearn.</p>
          <p style="margin-top: 10px;">
            <a href="${data.dashboardUrl}" style="color: #2563eb; text-decoration: none;">Dashboard</a>
          </p>
          <p style="margin-top: 20px; font-size: 12px;">© 2025 AdaptLearn. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Achievement Unlocked! - AdaptLearn

Congratulations, ${data.username}!

You've just unlocked a new achievement! Your dedication to learning is paying off.

${data.achievementIcon} ${data.achievementName}
${data.achievementDescription}

Your Achievement Stats
You now have ${data.totalAchievements} achievement${data.totalAchievements !== 1 ? 's' : ''} unlocked!

Keep up the amazing work! Every achievement brings you one step closer to mastering your skills.

View All Achievements: ${data.dashboardUrl}

What's next? Continue your learning journey to unlock even more achievements!

© 2025 AdaptLearn. All rights reserved.
  `;

  return {
    subject: `🎉 Achievement Unlocked: ${data.achievementName}!`,
    html,
    text,
  };
}

export function generateAssessmentReminderEmail(data: AssessmentReminderEmailData): EmailTemplate {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Complete Your Skill Assessment</title>
      <style>${getBaseStyles()}</style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">📚 AdaptLearn</div>
          <p style="margin: 0; font-size: 18px;">Your Learning Journey Awaits</p>
        </div>
        <div class="content">
          <h1 style="color: #1f2937; margin-top: 0;">Hi ${data.username},</h1>
          <p style="font-size: 16px;">
            We noticed you haven't completed your skill assessment yet. Taking the assessment is the
            first step to unlocking a personalized learning experience tailored specifically for you!
          </p>
          <div class="stats">
            <strong>📊 Why Take the Assessment?</strong>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Discover your current skill level</li>
              <li>Get personalized course recommendations</li>
              <li>Start learning at the right difficulty for you</li>
              <li>Track your progress from day one</li>
            </ul>
          </div>
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0; text-align: center;">
            <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">
              ⏱️ Takes only ${data.estimatedMinutes}
            </p>
            <p style="margin: 10px 0 0 0; color: #6b7280;">
              Quick, easy, and helps us serve you better
            </p>
          </div>
          <div style="text-align: center;">
            <a href="${data.assessmentUrl}" class="button">Start Assessment Now</a>
          </div>
          <p style="font-size: 16px; margin-top: 30px;">
            <strong>What happens after the assessment?</strong>
          </p>
          <ul style="font-size: 16px; line-height: 1.8;">
            <li>🎯 Instant skill level results</li>
            <li>📚 Curated course recommendations</li>
            <li>🚀 Begin your personalized learning path</li>
            <li>🏆 Start earning achievements right away</li>
          </ul>
          <p style="font-size: 16px; color: #6b7280;">
            Don't worry - there are no wrong answers! The assessment simply helps us understand
            where you are in your learning journey so we can recommend the best courses for you.
          </p>
        </div>
        <div class="footer">
          <p>You're receiving this reminder because you haven't completed your assessment yet.</p>
          <p style="margin-top: 10px;">
            <a href="${data.assessmentUrl}" style="color: #2563eb; text-decoration: none;">Take Assessment</a>
          </p>
          <p style="margin-top: 20px; font-size: 12px;">© 2025 AdaptLearn. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Complete Your Skill Assessment - AdaptLearn

Hi ${data.username},

We noticed you haven't completed your skill assessment yet. Taking the assessment is the first step to unlocking a personalized learning experience tailored specifically for you!

Why Take the Assessment?
- Discover your current skill level
- Get personalized course recommendations
- Start learning at the right difficulty for you
- Track your progress from day one

Takes only ${data.estimatedMinutes} - Quick, easy, and helps us serve you better

Start Assessment: ${data.assessmentUrl}

What happens after the assessment?
- Instant skill level results
- Curated course recommendations
- Begin your personalized learning path
- Start earning achievements right away

Don't worry - there are no wrong answers! The assessment simply helps us understand where you are in your learning journey so we can recommend the best courses for you.

© 2025 AdaptLearn. All rights reserved.
  `;

  return {
    subject: '📊 Ready to Discover Your Skill Level? Complete Your Assessment',
    html,
    text,
  };
}
