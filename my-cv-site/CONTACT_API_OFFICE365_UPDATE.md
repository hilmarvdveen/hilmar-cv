# Contact API Office 365 Update

## Overview

Updated the contact form API to use Office 365 SMTP with nodemailer instead of Resend, bringing it in line with the CV download and booking APIs for consistent email infrastructure.

## Changes Made

### 🔄 Email Service Migration

**From:** Resend service  
**To:** Office 365 SMTP with nodemailer

### 📧 Environment Variables Updated

**Old Variables (Removed):**

- `RESEND_API_KEY`
- `EMAIL_FROM`
- `EMAIL_TO`

**New Variables (Required):**

- `SMTP_USER` - Your Office 365 email address
- `SMTP_PASS` - Your Office 365 app password

### 🛠️ Technical Changes

#### 1. Dependencies

- **Removed:** `import { Resend } from "resend"`
- **Added:** `import nodemailer from "nodemailer"`
- **Added:** `export const runtime = "nodejs"`

#### 2. SMTP Configuration

```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
```

#### 3. Enhanced Features

- **Email Validation:** Server-side email format validation
- **Error Handling:** Improved error messages and logging
- **Confirmation Emails:** Automatic confirmation sent to form submitters
- **Better Formatting:** Professional email templates with timestamps
- **Reply-To Support:** Direct reply capability to sender's email

### 📨 Email Flow

#### For Site Owner (You)

```
Subject: Nieuw bericht van [Name]
Content:
- Sender details
- Message content
- Interests (if selected)
- Timestamp
- Source tracking
```

#### For Form Submitter

```
Subject: Bedankt voor je bericht - Hilmar van der Veen
Content:
- Thank you message
- Response time expectation (24 hours)
- Direct contact information
- Professional signature
```

### 🔧 Configuration Required

#### Environment Variables

Create/update your `.env.local` file:

```env
SMTP_USER=hilmar@hilmarvanderveen.com
SMTP_PASS=your-office365-app-password
```

#### Office 365 App Password Setup

1. Go to Microsoft Account Security settings
2. Enable 2-factor authentication (required)
3. Generate an app-specific password
4. Use this password in `SMTP_PASS`

### ✅ Benefits

#### 🎯 Consistency

- All APIs now use the same email infrastructure
- Unified environment variable naming
- Consistent error handling patterns

#### 🛡️ Reliability

- Office 365 enterprise-grade delivery
- Better spam filtering compliance
- Professional email authentication

#### 📊 Enhanced Features

- Automatic confirmation emails
- Better error logging
- Email validation
- Professional formatting

#### 💰 Cost Efficiency

- No external service fees (Resend)
- Uses existing Office 365 subscription
- No API rate limits

### 🚀 Testing

#### Test Contact Form

1. Fill out contact form on `/contact`
2. Check for email delivery to your Office 365 inbox
3. Verify confirmation email sent to form submitter
4. Test error handling with invalid email

#### Environment Setup

```bash
# Test environment variables
npm run dev
# Submit test form
# Check console logs for successful submission
```

### 📋 Migration Checklist

- [x] Updated contact API route
- [x] Removed Resend dependency references
- [x] Added nodemailer SMTP configuration
- [x] Updated environment variable names
- [x] Added email validation
- [x] Enhanced error handling
- [x] Added confirmation emails
- [x] Updated documentation

### 🔍 Verification Steps

1. **Environment Variables:** Ensure `SMTP_USER` and `SMTP_PASS` are set
2. **Email Delivery:** Test contact form submission
3. **Confirmation Emails:** Verify users receive confirmation
4. **Error Handling:** Test with invalid data
5. **Console Logging:** Check for successful submission logs

## Result

The contact API now seamlessly integrates with your Office 365 email infrastructure, providing a consistent, reliable, and professional email experience across all your website's communication features.
