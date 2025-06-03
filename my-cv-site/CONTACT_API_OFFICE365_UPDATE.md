# Contact & CV Download API Microsoft Graph Update

## Overview

Updated both the contact form and CV download APIs to use Microsoft Graph instead of SMTP, bringing them in line with the booking API for a unified email infrastructure using Azure App Registration.

## Changes Made

### 🔄 Email Service Migration

**From:** SMTP with nodemailer  
**To:** Microsoft Graph API with Azure App Registration

### 📧 Environment Variables Updated

**Old Variables (Removed):**

- `SMTP_USER`
- `SMTP_PASS`

**New Variables (Required):**

- `MS_CLIENT_ID` - Azure App Registration Client ID
- `MS_CLIENT_SECRET` - Azure App Registration Client Secret
- `MS_TENANT_ID` - Azure Active Directory Tenant ID

### 🛠️ Technical Changes

#### 1. Dependencies

- **Removed:** `import nodemailer from "nodemailer"`
- **Added:** `import { Client } from "@microsoft/microsoft-graph-client"`
- **Added:** `import "isomorphic-fetch"`
- **Consistent:** `export const runtime = "nodejs"`

#### 2. Microsoft Graph Configuration

```typescript
async function getMicrosoftAccessToken(
  clientId: string,
  clientSecret: string,
  tenantId: string
) {
  const res = await fetch(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
        scope: "https://graph.microsoft.com/.default",
      }),
    }
  );
  return data.access_token;
}
```

#### 3. Enhanced Email Features

- **HTML Support:** Rich email formatting with links and styling
- **Reply-To Support:** Direct reply capability (contact form)
- **Professional Templates:** Better formatting and branding
- **Centralized Authentication:** Single token for all email operations
- **Error Handling:** Better Microsoft Graph error messages

### 📨 Updated Email Flow

#### Contact Form

**For Site Owner (You):**

```
Subject: Nieuw bericht van [Name]
Content:
- Sender details with reply-to capability
- Message content and interests
- Timestamp with Europe/Amsterdam timezone
- Source tracking
```

**For Form Submitter:**

```
Subject: Bedankt voor je bericht - Hilmar van der Veen
Content:
- Professional HTML email with links
- 24-hour response commitment
- Direct contact information (phone, email, LinkedIn)
- Professional signature
```

#### CV Download

**For Site Owner (You):**

```
Subject: CV Download Lead: [Name]
Content:
- Lead information and purpose
- Localized purpose text (EN/NL)
- Timestamp tracking
- Source identification
```

**For Downloader:**

```
Subject: Bedankt voor het downloaden van mijn CV / Thank you for downloading my CV
Content:
- Localized thank you message (HTML)
- Complete contact information with clickable links
- Professional branding
- Follow-up encouragement
```

### 🔧 Configuration Required

#### Environment Variables

Create/update your `.env.local` file:

```env
MS_CLIENT_ID=your-azure-app-client-id
MS_CLIENT_SECRET=your-azure-app-client-secret
MS_TENANT_ID=your-azure-tenant-id
```

#### Azure App Registration Setup

1. Go to Azure Portal → App Registrations
2. Create new registration or use existing
3. Add Microsoft Graph permissions:
   - `Mail.Send` (Application permission)
   - `Calendars.ReadWrite` (for booking integration)
4. Generate client secret
5. Grant admin consent for permissions

### ✅ Benefits

#### 🎯 Unified Infrastructure

- All APIs use the same authentication mechanism
- Consistent error handling patterns
- Single Azure App Registration for all services

#### 🛡️ Enterprise Security

- OAuth 2.0 client credentials flow
- Azure Active Directory authentication
- Application-level permissions
- Enterprise-grade security

#### 📊 Enhanced Features

- Rich HTML email formatting
- Better deliverability through Microsoft infrastructure
- Professional email templates
- Clickable links and proper formatting

#### 💰 Cost & Scalability

- Uses existing Microsoft 365 subscription
- No SMTP rate limits
- Better scalability for high volume
- Unified monitoring and logging

### 🚀 Testing

#### Test Both APIs

1. **Contact Form:** Fill out form on `/contact`
2. **CV Download:** Use CV download modal
3. **Verify Emails:** Check HTML formatting and links
4. **Error Handling:** Test with invalid data
5. **Console Logs:** Check Microsoft Graph responses

#### Environment Setup

```bash
# Test environment variables
npm run dev
# Test contact form submission
# Test CV download modal
# Check Azure App Registration logs
```

### 📋 Migration Checklist

#### Contact API

- [x] Updated to Microsoft Graph
- [x] Removed nodemailer dependency
- [x] Added HTML email templates
- [x] Enhanced reply-to functionality
- [x] Added proper TypeScript types

#### CV Download API

- [x] Updated to Microsoft Graph
- [x] Removed nodemailer dependency
- [x] Added HTML email templates
- [x] Enhanced localization support
- [x] Professional contact information

#### Environment

- [x] Updated environment variable requirements
- [x] Documented Azure setup process
- [x] Updated all documentation

### 🔍 Verification Steps

1. **Environment Variables:** Ensure all MS\_\* variables are set
2. **Azure Permissions:** Verify Mail.Send permission granted
3. **Email Delivery:** Test both contact and CV download flows
4. **HTML Rendering:** Verify email formatting and links
5. **Error Handling:** Test with invalid/missing data
6. **Console Logging:** Check for successful Graph API calls

## Result

Both APIs now use Microsoft Graph for enterprise-grade email delivery with professional HTML templates, unified authentication, and better scalability. This completes the migration to a fully integrated Microsoft 365 email infrastructure across all website communication features.
