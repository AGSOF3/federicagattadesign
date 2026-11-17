import { test, expect } from "@playwright/test";
import { POST } from "../app/api/contact/route";
function enquiry(fields: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    name: "Test visitor",
    email: "visitor@example.com",
    description: "A real and sufficiently detailed project enquiry.",
    service: "brand",
    ...fields,
  }))
    data.set(key, value);
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { origin: "http://localhost" },
    body: data,
  });
}
test("contact route validates before forwarding and reports delivery failures", async () => {
  const originalFetch = globalThis.fetch;
  const originalEndpoint = process.env.FORM_ENDPOINT;
  process.env.FORM_ENDPOINT = "https://formspree.io/f/exampletest";
  let calls = 0;
  let received: FormData | undefined;
  try {
    globalThis.fetch = async (_url, init) => {
      calls++;
      received = init?.body as FormData;
      return new Response("{}", { status: 200 });
    };
    expect((await POST(enquiry({ email: "invalid" }))).status).toBe(400);
    expect((await POST(enquiry({ service: "unknown" }))).status).toBe(400);
    expect((await POST(enquiry({ website: "spam.example" }))).status).toBe(400);
    expect(calls).toBe(0);
    const sent = await POST(enquiry());
    expect(sent.status).toBe(200);
    expect(await sent.json()).toEqual({ sent: true });
    expect(received?.get("email")).toBe("visitor@example.com");
    expect(calls).toBe(1);
    globalThis.fetch = async () => new Response("{}", { status: 429 });
    expect((await POST(enquiry())).status).toBe(502);
    globalThis.fetch = async () => {
      throw new Error("Network unavailable");
    };
    expect((await POST(enquiry())).status).toBe(502);
    process.env.FORM_ENDPOINT = "https://untrusted.example/f/form";
    expect((await POST(enquiry())).status).toBe(503);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalEndpoint === undefined) delete process.env.FORM_ENDPOINT;
    else process.env.FORM_ENDPOINT = originalEndpoint;
  }
});
