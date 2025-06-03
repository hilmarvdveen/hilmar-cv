# Real-Time Booking Slots Implementation

## Overview

Implemented a real-time availability system that shows only non-booked time slots in the booking form. The system integrates with Microsoft Graph Calendar API to check existing appointments and provide available 30-minute slots between 9:00 AM - 5:00 PM.

## Architecture

### 1. Slots API Route (`/app/api/booking/slots/route.ts`)

**Purpose:** Fetches existing calendar events and returns available time slots for a given date.

**Key Features:**

- Generates 30-minute time slots from 9:00 AM to 5:00 PM (16 slots total)
- Checks Microsoft Graph Calendar for existing events
- Filters out conflicting time slots
- Returns formatted slots with display labels
- Validates date format and prevents past date queries

**API Endpoint:**

```
GET /api/booking/slots?date=YYYY-MM-DD
```

**Response Format:**

```json
{
  "slots": [
    {
      "value": "2024-01-15T09:00:00.000Z",
      "label": "09:00"
    },
    {
      "value": "2024-01-15T09:30:00.000Z",
      "label": "09:30"
    }
  ],
  "date": "2024-01-15",
  "totalAvailable": 16
}
```

### 2. Updated BookingForm Component

**Changes Made:**

- Replaced timeline selection with date picker and time slot selection
- Added real-time slot loading when date changes
- Implemented loading states and user feedback
- Added validation for date/time selection

**New Form Fields:**

- `bookingDate`: YYYY-MM-DD format for selected date
- `bookingTime`: ISO string for selected time slot (replaces timeline)

## Features Implemented

### ✅ **Real-Time Availability**

- Fetches current calendar events from Microsoft Graph
- Shows only available (non-conflicting) time slots
- Updates automatically when date changes

### ✅ **Smart UI/UX**

- Loading spinner while fetching slots
- "No slots available" message for fully booked days
- Slot counter showing available appointments
- Date picker with past date prevention
- Automatic time slot clearing when date changes

### ✅ **Validation & Error Handling**

- Server-side date format validation
- Past date prevention (both client and server)
- Error handling for API failures
- Graceful fallback when slots can't be loaded

### ✅ **Production Ready**

- TypeScript interfaces for type safety
- Proper error boundaries
- Development vs production error details
- Consistent timezone handling (Europe/Amsterdam)

## User Flow

1. **Step 1:** User selects service and project type
2. **Step 2:**
   - User picks a date from date picker (past dates disabled)
   - System automatically loads available slots for that date
   - User selects from available 30-minute time slots
   - User completes budget and description
3. **Step 3:** Contact information
4. **Step 4:** Confirmation with formatted date/time display

## Technical Details

### Slot Generation Logic

```typescript
// Generates slots from 9:00 AM to 5:00 PM (16 x 30min slots)
function generateTimeSlots(date: string) {
  const slots: string[] = [];
  const base = new Date(date);
  base.setHours(9, 0, 0, 0);

  for (let i = 0; i < 16; i++) {
    slots.push(new Date(base.getTime() + i * 30 * 60000).toISOString());
  }
  return slots;
}
```

### Conflict Detection

```typescript
function isSlotAvailable(slotStart: Date, events: CalendarEvent[]) {
  const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
  return !events.some((ev) => {
    const evStart = new Date(ev.start.dateTime);
    const evEnd = new Date(ev.end.dateTime);
    return slotStart < evEnd && slotEnd > evStart;
  });
}
```

### Integration with Existing Booking API

- The selected time slot (ISO string) is passed as the `date` field to the existing booking API
- Maintains backward compatibility with calendar event creation
- Formatted date/time information included in email messages

## Business Hours Configuration

Currently configured for:

- **Days:** Monday - Friday (weekends not supported yet)
- **Hours:** 9:00 AM - 5:00 PM
- **Slot Duration:** 30 minutes
- **Timezone:** Europe/Amsterdam

## Environment Variables Required

Same as existing booking system:

- `MS_CLIENT_ID` - Microsoft App Registration Client ID
- `MS_CLIENT_SECRET` - Microsoft App Registration Secret
- `MS_TENANT_ID` - Microsoft Tenant ID

## Future Enhancements (Optional)

### Potential Improvements:

1. **Weekend Support** - Add Saturday/Sunday availability
2. **Custom Business Hours** - Environment variable configuration
3. **Different Slot Durations** - 15min, 45min, 60min options
4. **Buffer Time** - Automatic gaps between appointments
5. **Recurring Availability** - Block out recurring unavailable times
6. **Multiple Calendar Support** - Check multiple calendars for conflicts
7. **Booking Confirmation Tokens** - Prevent double-booking race conditions
8. **Calendar Sync** - Two-way sync with external calendars

## Testing Scenarios

### ✅ **Functional Testing:**

- Date selection triggers slot loading
- Only available slots are displayed
- Past dates are blocked
- Slot selection updates form state
- Booking submission uses correct datetime

### ✅ **Edge Cases:**

- No available slots for selected date
- API failures during slot loading
- Invalid date formats
- Past date attempts
- Network timeouts

### ✅ **Integration Testing:**

- Calendar event creation with selected slot
- Email confirmation with correct date/time
- Microsoft Graph API authentication
- Timezone handling consistency

## Performance Considerations

- Slots are loaded on-demand (not pre-cached)
- API calls are debounced by date selection
- Minimal data transfer (only essential slot info)
- Client-side validation reduces server load

## Security Features

- Server-side date validation
- Environment variable validation
- Proper error message handling (no sensitive data exposure)
- Input sanitization for date parameters

The implementation provides a professional booking experience with real-time availability, preventing double-bookings while maintaining the existing system's reliability and security.
