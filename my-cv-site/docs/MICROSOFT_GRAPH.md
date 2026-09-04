# Microsoft Graph API Troubleshooting

## Common Issues and Solutions

### 1. "/me request is only valid with delegated authentication flow"

**Error:** `Failed to track CV download: /me request is only valid with delegated authentication flow.`

**Cause:** Using `/me` endpoint with application authentication (client credentials flow).

**Solution:** Use specific user endpoint instead:

```typescript
// ❌ Wrong - only works with delegated auth
await client.api("/me/sendMail").post({ message });

// ✅ Correct - works with application auth
await client
  .api("/users/hilmar@hilmarvanderveen.com/sendMail")
  .post({ message });
```

### 2. Authentication Failures

**Error:** `Failed to get Microsoft Graph token`

**Possible Causes:**

- Incorrect `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, or `MS_TENANT_ID`
- Client secret expired
- Missing permissions

**Solutions:**

1. Verify environment variables in `.env.local`
2. Check Azure App Registration settings
3. Regenerate client secret if expired
4. Ensure `Mail.Send` permission is granted with admin consent

### 3. Permission Denied Errors

**Error:** `Forbidden` or `Insufficient privileges`

**Cause:** Missing or insufficient Microsoft Graph permissions.

**Solution:**

1. Go to Azure Portal → App Registrations → Your App
2. Navigate to "API permissions"
3. Add required permissions:
   - `Mail.Send` (Application permission)
   - `Calendars.ReadWrite` (Application permission - for booking)
4. **Important:** Click "Grant admin consent" button

### 4. Invalid User/Mailbox Errors

**Error:** `Resource not found` or `Invalid user`

**Cause:** The specified user email doesn't exist or isn't accessible.

**Solutions:**

1. Verify the email address exists in your Azure AD tenant
2. Ensure the user has an Exchange Online mailbox
3. Check that the application has permission to access the mailbox

### 5. Environment Variable Issues

**Error:** `Server configuration error`

**Cause:** Missing required environment variables.

**Required Variables:**

```env
MS_CLIENT_ID=your-azure-app-client-id
MS_CLIENT_SECRET=your-azure-app-client-secret
MS_TENANT_ID=your-azure-tenant-id
```

**Verification:**

```bash
# Check if variables are loaded
console.log('MS_CLIENT_ID:', process.env.MS_CLIENT_ID ? 'Set' : 'Missing');
console.log('MS_CLIENT_SECRET:', process.env.MS_CLIENT_SECRET ? 'Set' : 'Missing');
console.log('MS_TENANT_ID:', process.env.MS_TENANT_ID ? 'Set' : 'Missing');
```

## Azure App Registration Setup

### Step-by-Step Configuration

1. **Create App Registration:**

   - Go to Azure Portal → Azure Active Directory → App registrations
   - Click "New registration"
   - Name: "Hilmar CV Site API"
   - Supported account types: "Accounts in this organizational directory only"

2. **Configure Permissions:**

   - Go to "API permissions"
   - Click "Add a permission"
   - Select "Microsoft Graph"
   - Choose "Application permissions"
   - Add:
     - `Mail.Send`
     - `Calendars.ReadWrite`
   - Click "Grant admin consent for [Your Tenant]"

3. **Generate Client Secret:**

   - Go to "Certificates & secrets"
   - Click "New client secret"
   - Add description: "CV Site API Secret"
   - Choose expiration (recommend 24 months)
   - **Copy the value immediately** (you won't see it again)

4. **Get Required IDs:**
   - **Client ID:** Found on app registration "Overview" page
   - **Tenant ID:** Found on Azure AD "Overview" page
   - **Client Secret:** Generated in step 3

## Testing Microsoft Graph Connection

### Built-in health endpoint (preferred)

The site ships a gated diagnostic route that tests the whole pipeline stage by
stage (environment variables, token acquisition, mailbox reachability, calendar
read) and names the most likely cause on failure, including the AADSTS code for
an expired client secret:

```bash
# 1. Set DIAGNOSTICS_TOKEN to a long random string in the hosting environment
#    (Vercel project settings) and redeploy.
# 2. Call the endpoint with the same token:
curl -H "x-diagnostics-token: <token>" https://www.hilmarvanderveen.com/api/booking/health
```

Without a configured `DIAGNOSTICS_TOKEN` (or with a wrong header) the route
returns a plain 404, so it is invisible to the public.

The mailbox stage reads `/users/{SMTP_USER}/calendar`, not a bare user
lookup. It needs only the `Calendars.ReadWrite` application permission the
booking and slots routes already use, so a working booking flow now also
means a healthy mailbox stage. A 403 there means `Calendars.ReadWrite` is
missing as an application permission or was not granted admin consent. A
404 means `SMTP_USER` is not a mailbox that exists and has a licence in
this tenant.

Timezone note: slot generation, availability checks, and event creation all go
through `src/lib/graph/calendar.ts`, which converts explicitly between UTC
instants and Europe/Amsterdam wall-clock time. Never use `new Date()` math on
Graph's offset-less dateTime strings, and never send `toISOString()` output
(with its trailing Z) in a `dateTimeTimeZone` body.

### Quick Test Script

```typescript
// Test in a standalone file or API endpoint
async function testGraphConnection() {
  try {
    const token = await getMicrosoftAccessToken(
      process.env.MS_CLIENT_ID!,
      process.env.MS_CLIENT_SECRET!,
      process.env.MS_TENANT_ID!
    );

    console.log("✅ Token acquired successfully");

    const client = Client.init({
      authProvider: (done) => done(null, token),
    });

    // Test with a simple API call
    const user = await client.api("/users/hilmar@hilmarvanderveen.com").get();
    console.log("✅ User found:", user.displayName);
  } catch (error) {
    console.error("❌ Graph connection failed:", error);
  }
}
```

## Teams meetings

Every booking event is created with `isOnlineMeeting: true` and
`onlineMeetingProvider: "teamsForBusiness"` in
`src/lib/graph/calendar.ts`, so Microsoft Graph creates a Microsoft Teams
meeting alongside the calendar event and returns its join link in the same
response (`response.onlineMeeting.joinUrl`). `Calendars.ReadWrite` is the
only permission this needs, already granted for booking. The mailbox
itself needs a Microsoft Teams licence for Graph to create the meeting.

When the mailbox has no Teams licence, or Graph otherwise rejects the two
online-meeting fields, `createCalendarEvent` retries once with a plain
event (no `isOnlineMeeting`, no `onlineMeetingProvider`) so the booking
still succeeds. The confirmation email, the owner notification and the
calendar body then carry no join link, only the moment and the details.

To verify after a deploy, make a real test booking through `/book` and
check that the confirmation email carries a Teams join button and that
the calendar invitation opens a Teams meeting. A missing Teams licence on
the mailbox is the most common cause of a booking that succeeds with no
join link.

## Reminders

Every calendar event created by `createCalendarEvent` carries `isReminderOn: true`
and `reminderMinutesBeforeStart: 60`, so Outlook shows Hilmar its own native
60-minute reminder regardless of anything below.

On top of that, `GET /api/booking/reminders` sends the visitor a reminder email
the day before the call. Vercel Cron calls it once a day per `vercel.json`:

```json
{
  "crons": [{ "path": "/api/booking/reminders", "schedule": "0 7 * * *" }]
}
```

Cron schedules on Vercel run in UTC. `0 7 * * *` is 09:00 in Amsterdam during
summer time (CEST, UTC+2) and 08:00 during winter time (CET, UTC+1), because a
fixed UTC cron expression cannot itself track daylight saving. Either time
lands well before a normal working day starts, which is what the reminder
needs.

The route reads the mailbox calendar for the next Amsterdam calendar day,
keeps only events whose subject starts with `Kennismaking:` or `Intro call:`
(the two prefixes the booking route writes), and sends one reminder email per
event that has at least one attendee. Running the route once a day is what
keeps this idempotent: a booking for tomorrow only ever falls inside one
day's run.

The route is gated the same way as the health endpoint, but on a different
variable: it reads `CRON_SECRET` from the environment and compares it to the
`Authorization: Bearer <token>` header. Vercel sends that header
automatically on every cron invocation once `CRON_SECRET` is set as an
environment variable on the project. No extra configuration is needed.
Without a configured `CRON_SECRET` (or with a header that does not match) the route
returns a plain 404, so it is invisible to the public exactly like
`/api/booking/health`.

To test it by hand:

```bash
curl -H "Authorization: Bearer <CRON_SECRET>" https://www.hilmarvanderveen.com/api/booking/reminders
```

A healthy call returns `{ "sent": <count> }` and never includes an attendee
address in the response.

This only runs in production after two things happen: `CRON_SECRET` is set in
Vercel project settings (the same way `DIAGNOSTICS_TOKEN` was set, value on
stdin, never as a command-line argument), and this work is pushed and
deployed. Locally committed code with no push and no variable set means the
cron entry in `vercel.json` is inert.

## Best Practices

### 1. Error Handling

```typescript
try {
  await sendEmailViaGraph(accessToken, emailData);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error("Graph API Error:", error.message);
    // Log specific Graph errors for debugging
    if (error.message.includes("Forbidden")) {
      console.error("Check Mail.Send permissions and admin consent");
    }
  }
  // Always provide fallback or graceful degradation
}
```

### 2. Token Caching (Future Enhancement)

Consider implementing token caching for better performance:

```typescript
// Cache tokens for ~55 minutes (they expire after 60 minutes)
const tokenCache = new Map<string, { token: string; expires: Date }>();
```

### 3. Monitoring and Logging

- Log successful API calls for monitoring
- Track error rates and types
- Monitor token acquisition failures

## Production Considerations

1. **Security:**

   - Store secrets securely (Azure Key Vault in production)
   - Rotate client secrets regularly
   - Monitor for unauthorized access

2. **Reliability:**

   - Implement retry logic for transient failures
   - Add circuit breaker pattern for repeated failures
   - Consider fallback email methods

3. **Performance:**
   - Cache access tokens (they last 60 minutes)
   - Use batch requests for multiple operations
   - Monitor API rate limits
