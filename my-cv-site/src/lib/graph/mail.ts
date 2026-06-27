import { Client } from "@microsoft/microsoft-graph-client";

export interface SendMailOptions {
  to: string;
  toName?: string;
  subject: string;
  body: string;
  isHtml?: boolean;
  replyTo?: string;
  replyToName?: string;
}

interface GraphRecipient {
  emailAddress: { address: string; name: string };
}

interface GraphMessage {
  subject: string;
  body: { contentType: "HTML" | "Text"; content: string };
  toRecipients: GraphRecipient[];
  replyTo?: GraphRecipient[];
}

/**
 * Send an email as `userEmail` via Microsoft Graph. Single implementation
 * replacing the three near-duplicate `sendEmailViaGraph` helpers; the
 * optional `replyTo` supports the contact form's reply-to-sender behaviour.
 */
export async function sendMail(
  client: Client,
  userEmail: string,
  options: SendMailOptions
): Promise<void> {
  const message: GraphMessage = {
    subject: options.subject,
    body: {
      contentType: options.isHtml ? "HTML" : "Text",
      content: options.body,
    },
    toRecipients: [
      {
        emailAddress: {
          address: options.to,
          name: options.toName || options.to,
        },
      },
    ],
  };

  if (options.replyTo) {
    message.replyTo = [
      {
        emailAddress: {
          address: options.replyTo,
          name: options.replyToName || options.replyTo,
        },
      },
    ];
  }

  await client.api(`/users/${userEmail}/sendMail`).post({ message });
}
