import { NextRequest, NextResponse } from "next/server";
import {
  getGraphCredentials,
  getAccessToken,
  getGraphClient,
  generateTimeSlots,
  isSlotAvailable,
  BOOKING_TIMEZONE,
} from "@/lib/graph";
import { serverErrorResponse, enforceRateLimit } from "@/lib/security";

export const runtime = "nodejs";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const limited = enforceRateLimit(req, "read");
    if (limited) return limited;

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // YYYY-MM-DD

    if (!date) {
      return NextResponse.json({ error: "Missing date parameter" }, { status: 400 });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json({ error: "Invalid date format. Use YYYY-MM-DD" }, { status: 400 });
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return NextResponse.json({ error: "Cannot book slots in the past" }, { status: 400 });
    }

    const credentials = getGraphCredentials();
    if (!credentials) {
      console.error("Missing required environment variables for calendar service");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const accessToken = await getAccessToken(credentials);
    const client = getGraphClient(accessToken);
    const { smtpUser } = credentials;

    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    const result = await client
      .api(`/users/${smtpUser}/calendarview`)
      .query({
        startDateTime: startOfDay.toISOString(),
        endDateTime: endOfDay.toISOString(),
        $orderby: "start/dateTime",
      })
      .header("Prefer", `outlook.timezone="${BOOKING_TIMEZONE}"`)
      .get();

    const events = result.value || [];

    const slots = generateTimeSlots(date);
    const availableSlots = slots.filter((iso) => isSlotAvailable(new Date(iso), events));

    const formattedSlots = availableSlots.map((slot) => ({
      value: slot,
      label: new Date(slot).toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: BOOKING_TIMEZONE,
      }),
    }));

    return NextResponse.json({
      slots: formattedSlots,
      date,
      totalAvailable: formattedSlots.length,
    });
  } catch (error: unknown) {
    console.error("Slots API error:", error);
    return serverErrorResponse(error);
  }
}
