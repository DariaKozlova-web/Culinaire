import { usePageMeta } from "@/hooks/useTitle";
import { type ChangeEvent, useState } from "react";

import { SelectArrowIcon } from "../components/icons/SelectArrowIcon";

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: ContactForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  usePageMeta({
    title: "Contact",
    description:
      "Questions, feedback, or chef collaboration? Contact Culinaire — we’d love to hear from you and explore new culinary stories together.",
    image: "/og-default.png",
  });

  const [form, setForm] = useState<ContactForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onChange =
    (key: keyof ContactForm) =>
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const canSubmit =
    form.name.trim() &&
    form.email.trim() &&
    form.subject.trim() &&
    form.message.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!canSubmit) return;

    try {
      setSubmitting(true);

      // later: replace with real API call
      await new Promise((res) => setTimeout(res, 600));

      setSuccess("Thank you! Your message has been sent.");
      setForm(initialForm);
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold text-(--text-title)">
            Contact Culinaire
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-(--text-muted) md:text-base">
            We are an online platform connecting home cooks and chefs.
            <br />
            If you have questions, ideas, or want to collaborate — we’d love to
            hear from you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="ui-surface p-8 md:p-10">
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <input
              className="ui-input"
              placeholder="Full name"
              value={form.name}
              onChange={onChange("name")}
              required
              disabled={submitting}
            />

            <input
              className="ui-input"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={onChange("email")}
              required
              disabled={submitting}
            />

            <div className="relative">
              <select
                className="ui-input appearance-none pr-10"
                value={form.subject}
                onChange={onChange("subject")}
                required
                disabled={submitting}
              >
                <option value="" disabled hidden>
                  Subject
                </option>
                <option value="general">General question</option>
                <option value="chef">Chef collaboration</option>
                <option value="technical">Technical issue</option>
                <option value="feedback">Feedback / idea</option>
              </select>
              <SelectArrowIcon className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-(--text-muted) transition-colors" />
            </div>

            <textarea
              className="ui-input min-h-32 resize-none"
              placeholder="Your message"
              value={form.message}
              onChange={onChange("message")}
              required
              disabled={submitting}
            />
          </div>

          <p className="mt-5 text-sm text-(--text-muted)">
            <strong className="font-medium text-(--text-title)">
              For chefs:
            </strong>{" "}
            select <em>“Chef collaboration”</em> and tell us about your cuisine,
            style, and restaurant.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="rounded-xl bg-(--accent-olive) px-10 py-3 text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
