import { NextResponse } from "next/server";

/* Sends the contact form to hello@nexlytic.de via Resend.
   Requires RESEND_API_KEY in the environment (plus a verified
   nexlytic.de domain in Resend); without it the endpoint answers 503
   and the client falls back to a mailto: draft. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "not-configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const { name, email, topic, message } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !EMAIL_RE.test(email) ||
    message.trim().length < 10 ||
    name.length > 200 ||
    email.length > 320 ||
    message.length > 5000
  ) {
    return NextResponse.json({ error: "invalid-fields" }, { status: 400 });
  }
  const topicStr =
    typeof topic === "string" && topic.trim() ? topic.slice(0, 100) : "";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Nexlytic Website <hello@nexlytic.de>",
      to: ["hello@nexlytic.de"],
      reply_to: email,
      subject: `Project inquiry${topicStr ? ` — ${topicStr}` : ""} (${name.trim()})`,
      text: `${message.trim()}\n\n— ${name.trim()}\n${email}${topicStr ? `\nTopic: ${topicStr}` : ""}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
