import type { NextApiRequest, NextApiResponse } from "next";

// Use your real mail handler (e.g. nodemailer or third-party API)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // 🔔 Replace with real email logic
    console.log("Send email", { name, email, message });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending contact form:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
}