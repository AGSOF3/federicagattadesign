import { NextResponse } from "next/server";
import { services } from "@/data/content";
export async function POST(request: Request) {
  const endpoint = process.env.FORM_ENDPOINT;
  if (!endpoint || !/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint))
    return NextResponse.json(
      { error: "Contact service unavailable" },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length")) > 4 * 1024 * 1024)
    return NextResponse.json({ error: "Too large" }, { status: 413 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const form = await request.formData();
    if (form.get("website"))
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 },
      );
    const name = String(form.get("name") || "").trim(),
      email = String(form.get("email") || "").trim(),
      description = String(form.get("description") || "").trim(),
      service = String(form.get("service") || "");
    if (
      !name ||
      name.length > 120 ||
      !/^\S+@\S+\.\S+$/.test(email) ||
      email.length > 254 ||
      description.length < 20 ||
      description.length > 10000 ||
      !(services as readonly string[]).includes(service)
    )
      return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
    const upload = form.get("reference");
    if (
      upload instanceof File &&
      upload.size &&
      (upload.size > 3 * 1024 * 1024 ||
        process.env.FORM_UPLOADS_ENABLED !== "true" ||
        !["image/jpeg", "image/png", "image/webp"].includes(upload.type))
    )
      return NextResponse.json({ error: "Invalid file" }, { status: 400 });
    const payload = new FormData();
    for (const key of [
      "name",
      "email",
      "business",
      "service",
      "description",
      "budget",
      "deadline",
      "reference",
    ]) {
      const value = form.get(key);
      if (value !== null && (!(value instanceof File) || value.size > 0))
        payload.set(key, value);
    }
    const result = await fetch(endpoint, {
      method: "POST",
      body: payload,
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
    if (!result.ok)
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    return NextResponse.json({ sent: true });
  } catch {
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }
}
