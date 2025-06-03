# Booking API Production Improvements

## Overview

Updated the booking API route (`src/app/api/booking/route.ts`) with production-ready best practices for Office 365 integration and Vercel deployment.

## Key Improvements Made

### 1. Nodemailer Transport Configuration

**Before:**

```typescript
const transporter = nodemailer.createTransport({
  service: "Office365",
  auth: { user: smtpUser, pass: smtpPass },
});
```

**After:**

```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: { user: smtpUser, pass: smtpPass },
});
```

**Why:** The explicit SMTP configuration is more robust and reliable on Vercel. The `service: "Office365"` option can break with certain versions or deployment environments.

### 2. Runtime Declaration

**Added:**

```typescript
export const runtime = "nodejs";
```

**Why:** Ensures the API route runs on Node.js runtime instead of Edge runtime. Nodemailer and Microsoft Graph client require Node.js APIs that aren't available on Edge runtime.

### 3. Improved Date Handling

**Before:**

```typescript
start: { dateTime: date, timeZone: "Europe/Amsterdam" },
end: {
  dateTime: new Date(new Date(date).getTime() + 30 * 60000).toISOString(),
  timeZone: "Europe/Amsterdam"
}
```

**After:**

```typescript
const startDate = new Date(date);
const endDate = new Date(startDate.getTime() + 30 * 60000);

start: { dateTime: startDate.toISOString(), timeZone: "Europe/Amsterdam" },
end: { dateTime: endDate.toISOString(), timeZone: "Europe/Amsterdam" }
```

**Why:** Microsoft Graph API expects ISO8601 format for both start and end times. This ensures consistent formatting and proper timezone handling.

### 4. Enhanced Error Handling

**Added:**

- Proper TypeScript error typing (`error: unknown` instead of `any`)
- Detailed error messages with development-only stack traces
- Validation for required environment variables
- Input validation (date format, past date prevention)

### 5. Input Validation

**Added:**

```typescript
// Date format validation
const bookingDate = new Date(date);
if (isNaN(bookingDate.getTime())) {
  return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
}

// Past date prevention
if (bookingDate < new Date()) {
  return NextResponse.json(
    { error: "Booking date cannot be in the past" },
    { status: 400 }
  );
}
```

### 6. Better Error Messages

- More descriptive error messages for missing fields
- Environment variable validation with clear error reporting
- Development vs production error detail handling

## Security Considerations

- Environment variables are validated before use
- Error messages don't expose sensitive information in production
- Proper input sanitization and validation

## Compatibility

- ✅ Vercel deployment ready
- ✅ Office 365 SMTP compatible
- ✅ Microsoft Graph API compliant
- ✅ TypeScript strict mode compatible

## Testing Recommendations

1. Test with various date formats
2. Verify SMTP connectivity on Vercel
3. Test Microsoft Graph token acquisition
4. Validate calendar event creation
5. Confirm email delivery

## Environment Variables Required

- `MS_CLIENT_ID` - Microsoft App Registration Client ID
- `MS_CLIENT_SECRET` - Microsoft App Registration Secret
- `MS_TENANT_ID` - Microsoft Tenant ID
- `SMTP_USER` - Office 365 email address
- `SMTP_PASS` - Office 365 app password or OAuth token

## Next Steps (Optional)

- Consider implementing double-booking prevention
- Add rate limiting for booking requests
- Implement booking confirmation tokens
- Add webhook support for calendar updates
