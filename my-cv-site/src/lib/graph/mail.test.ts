import { describe, it, expect, vi } from "vitest";
import { sendMail } from "./mail";
import type { Client } from "@microsoft/microsoft-graph-client";

function mockClient() {
  const post = vi.fn().mockResolvedValue(undefined);
  const api = vi.fn(() => ({ post }));
  return { client: { api } as unknown as Client, api, post };
}

describe("sendMail", () => {
  it("posts to the user's sendMail endpoint with the correct message", async () => {
    const { client, api, post } = mockClient();
    await sendMail(client, "owner@example.com", {
      to: "jane@example.com",
      toName: "Jane",
      subject: "Hello",
      body: "<p>Hi</p>",
      isHtml: true,
    });

    expect(api).toHaveBeenCalledWith("/users/owner@example.com/sendMail");
    expect(post).toHaveBeenCalledWith({
      message: {
        subject: "Hello",
        body: { contentType: "HTML", content: "<p>Hi</p>" },
        toRecipients: [{ emailAddress: { address: "jane@example.com", name: "Jane" } }],
      },
    });
  });

  it("uses Text content type when isHtml is not set and defaults the name to the address", async () => {
    const { client, post } = mockClient();
    await sendMail(client, "owner@example.com", {
      to: "jane@example.com",
      subject: "Plain",
      body: "text",
    });
    const message = post.mock.calls[0][0].message;
    expect(message.body.contentType).toBe("Text");
    expect(message.toRecipients[0].emailAddress.name).toBe("jane@example.com");
    expect(message.replyTo).toBeUndefined();
  });

  it("includes replyTo only when provided", async () => {
    const { client, post } = mockClient();
    await sendMail(client, "owner@example.com", {
      to: "jane@example.com",
      subject: "S",
      body: "b",
      replyTo: "reply@example.com",
      replyToName: "Reply Guy",
    });
    const message = post.mock.calls[0][0].message;
    expect(message.replyTo).toEqual([
      { emailAddress: { address: "reply@example.com", name: "Reply Guy" } },
    ]);
  });
});
