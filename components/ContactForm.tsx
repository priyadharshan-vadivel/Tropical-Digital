"use client";

import { FormEvent, useState } from "react";
import { serviceFamilies } from "@/lib/content";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "loading" | "success" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    organisation: "",
    interest: "",
    message: "",
    company: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function validate(): Errors {
    const next: Errors = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!values.email.trim()) {
      next.email = "Enter your work email.";
    } else if (!EMAIL_PATTERN.test(values.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!values.message.trim()) next.message = "Tell us what you are working on.";
    return next;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (values.company.trim()) {
      // Honeypot filled: behave as if this succeeded without sending anything.
      setStatus("success");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    setStatusMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();

      if (response.ok && data.ok) {
        setStatus("success");
        return;
      }

      setStatus("error");
      setStatusMessage(data.error || "Something went wrong. Please try again later.");
      if (data.fieldErrors) setErrors(data.fieldErrors);
    } catch {
      setStatus("error");
      setStatusMessage("Something went wrong while sending. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-[#cfc6b8] bg-[#fbf9f4] p-7" role="status">
        <p className="mono text-[#713b2b]">Enquiry received</p>
        <p className="mt-5 text-lg leading-7 text-[#25231f]">
          Thank you — your message has been sent to Tropical Digital.
        </p>
        <p className="mt-4 text-sm leading-6 text-[#635d54]">
          We aim to respond as soon as possible. A published response-time commitment is not yet available.
        </p>
      </div>
    );
  }

  return (
    <form className="border border-[#cfc6b8] bg-[#fbf9f4] p-7" onSubmit={handleSubmit} noValidate>
      <p className="mono text-[#713b2b]">Your enquiry</p>
      <div className="mt-7 grid gap-5">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(event) => setValues((v) => ({ ...v, company: event.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="name" className="sr-only">
            Name
          </label>
          <input
            id="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="w-full border-b border-[#cfc6b8] bg-transparent px-0 py-3 outline-none placeholder:text-[#635d54]"
            placeholder="Name"
            value={values.name}
            onChange={(event) => setValues((v) => ({ ...v, name: event.target.value }))}
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-xs text-[#a45135]">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="sr-only">
            Work email
          </label>
          <input
            id="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="w-full border-b border-[#cfc6b8] bg-transparent px-0 py-3 outline-none placeholder:text-[#635d54]"
            placeholder="Work email"
            type="email"
            value={values.email}
            onChange={(event) => setValues((v) => ({ ...v, email: event.target.value }))}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-xs text-[#a45135]">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="organisation" className="sr-only">
            Organisation
          </label>
          <input
            id="organisation"
            className="w-full border-b border-[#cfc6b8] bg-transparent px-0 py-3 outline-none placeholder:text-[#635d54]"
            placeholder="Organisation"
            value={values.organisation}
            onChange={(event) => setValues((v) => ({ ...v, organisation: event.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="interest" className="sr-only">
            Area of interest
          </label>
          <select
            id="interest"
            className="w-full border-b border-[#cfc6b8] bg-transparent px-0 py-3 text-[#25231f] outline-none"
            value={values.interest}
            onChange={(event) => setValues((v) => ({ ...v, interest: event.target.value }))}
          >
            <option value="">Area of interest (optional)</option>
            {serviceFamilies.map((family) => (
              <option key={family.title} value={family.title}>
                {family.title}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="sr-only">
            Message
          </label>
          <textarea
            id="message"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="min-h-32 w-full border-b border-[#cfc6b8] bg-transparent px-0 py-3 outline-none placeholder:text-[#635d54]"
            placeholder="Tell us what you are working on"
            value={values.message}
            onChange={(event) => setValues((v) => ({ ...v, message: event.target.value }))}
          />
          {errors.message && (
            <p id="message-error" className="mt-2 text-xs text-[#a45135]">
              {errors.message}
            </p>
          )}
        </div>

        {status === "error" && statusMessage && (
          <p role="alert" className="text-sm leading-6 text-[#a45135]">
            {statusMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-3 rounded-full bg-[#25231f] px-6 py-3 text-sm font-semibold text-[#f3efe7] transition hover:bg-[#3a352f] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Submit enquiry"}
        </button>

        <p className="text-xs leading-5 text-[#8f8676]">
          By submitting, you agree to be contacted about your enquiry. See our{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-[#635d54]">
            privacy notice
          </a>
          .
        </p>
      </div>
    </form>
  );
}
