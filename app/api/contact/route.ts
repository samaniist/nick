import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/* Sends the contact form to hello@nexlytic.de via IONOS SMTP.
   Requires SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS (and optionally
   SMTP_FROM/SMTP_TO) in the environment; without them the endpoint
   answers 503 and the client falls back to a mailto: draft. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_TO } =
    process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return NextResponse.json({ error: "not-configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const { name, email, topic, phone, message } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !EMAIL_RE.test(email) ||
    name.length > 200 ||
    email.length > 320 ||
    message.length > 5000
  ) {
    return NextResponse.json({ error: "invalid-fields" }, { status: 400 });
  }
  const topicStr =
    typeof topic === "string" && topic.trim() ? topic.slice(0, 100) : "";
  const phoneStr =
    typeof phone === "string" && phone.trim() ? phone.trim().slice(0, 40) : "";

  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465, // IONOS: 465 = implicit TLS, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: SMTP_FROM || `Nexlytic Website <${SMTP_USER}>`,
      to: SMTP_TO || "hello@nexlytic.de",
      replyTo: email,
      subject: `Project inquiry${topicStr ? ` — ${topicStr}` : ""} (${name.trim()})`,
      text: `${message.trim() || "(no project details provided)"}\n\n— ${name.trim()}\n${email}${phoneStr ? `\n${phoneStr}` : ""}${topicStr ? `\nTopic: ${topicStr}` : ""}`,
    });
  } catch {
    return NextResponse.json({ error: "send-failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
