import { NextRequest, NextResponse } from 'next/server';
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

export const runtime = 'nodejs';

const BOOKING_EMAIL = 'hilmar@hilmarvanderveen.com';
const TIMEZONE = 'Europe/Amsterdam';

function getMicrosoftGraphClient(accessToken: string) {
  return Client.init({
    authProvider: (done) => done(null, accessToken),
  });
}

async function getMicrosoftAccessToken(clientId: string, clientSecret: string, tenantId: string) {
  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      scope: 'https://graph.microsoft.com/.default',
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error_description || 'Failed to get Microsoft Graph token');
  }
  return data.access_token;
}

// Helper to generate 30-minute slots between 09:00–17:00 for a given date
function generateTimeSlots(date: string) {
  const slots: string[] = [];
  const base = new Date(date);
  base.setHours(9, 0, 0, 0); // 09:00

  for (let i = 0; i < 16; i++) { // 16 slots (09:00 - 17:00)
    slots.push(new Date(base.getTime() + i * 30 * 60000).toISOString());
  }
  return slots;
}

interface CalendarEvent {
  start: { dateTime: string };
  end: { dateTime: string };
}

function isSlotAvailable(slotStart: Date, events: CalendarEvent[]) {
  // slot is 30 minutes
  const slotEnd = new Date(slotStart.getTime() + 30 * 60000);
  return !events.some(ev => {
    const evStart = new Date(ev.start.dateTime);
    const evEnd = new Date(ev.end.dateTime);
    return (slotStart < evEnd) && (slotEnd > evStart);
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date'); // YYYY-MM-DD

    if (!date) {
      return NextResponse.json({ error: 'Missing date parameter' }, { status: 400 });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
    }

    // Check if date is in the past
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return NextResponse.json({ error: 'Cannot book slots in the past' }, { status: 400 });
    }

    // Get environment variables
    const clientId = process.env.MS_CLIENT_ID;
    const clientSecret = process.env.MS_CLIENT_SECRET;
    const tenantId = process.env.MS_TENANT_ID;

    if (!clientId || !clientSecret || !tenantId) {
      console.error("Missing required environment variables for calendar service");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const accessToken = await getMicrosoftAccessToken(clientId, clientSecret, tenantId);
    const client = getMicrosoftGraphClient(accessToken);

    // Get all events for that day
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const result = await client
      .api(`/users/${BOOKING_EMAIL}/calendarview`)
      .query({
        startDateTime: startOfDay.toISOString(),
        endDateTime: endOfDay.toISOString(),
        $orderby: 'start/dateTime',
      })
      .header('Prefer', `outlook.timezone="${TIMEZONE}"`)
      .get();

    const events = result.value || [];

    // Generate 30min slots, filter out those overlapping with any events
    const slots = generateTimeSlots(date);
    const availableSlots = slots.filter((iso) => isSlotAvailable(new Date(iso), events));

    // Format slots for better display
    const formattedSlots = availableSlots.map(slot => ({
      value: slot,
      label: new Date(slot).toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: TIMEZONE,
      })
    }));

    return NextResponse.json({ 
      slots: formattedSlots,
      date,
      totalAvailable: formattedSlots.length 
    });
    
  } catch (error: unknown) {
    console.error('Slots API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    
    return NextResponse.json({ 
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { 
        details: error instanceof Error ? error.stack : String(error) 
      })
    }, { status: 500 });
  }
} 