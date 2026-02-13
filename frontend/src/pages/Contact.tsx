import { usePageMeta } from "@/hooks/useTitle";
import { type ChangeEvent, useEffect, useRef, useState } from "react";

import { SelectArrowIcon } from "../components/icons/SelectArrowIcon";
import { sendContactMessage } from "../data/contact";
import type { ContactForm } from "../types/contactForm";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

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

  // State für das Sicherheits-Token, das nach erfolgreicher Verifizierung von Cloudflare kommt
  const [turnstileToken, setTurnstileToken] = useState<string>("");

  // Referenz auf das HTML-Element (div), in dem das Widget erscheinen soll
  const widgetRef = useRef<HTMLDivElement>(null);

  // Speichert die interne ID des Widgets, um es später gezielt ansteuern oder löschen zu können
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    // Wenn das Ziel-Element (div) noch nicht im DOM existiert, breche ab
    if (!widgetRef.current) return;

    // Interne Funktion, die das Widget tatsächlich initialisiert
    const renderWidget = () => {
      // Verhindert, dass das Widget mehrfach gerendert wird (Doppel-Check)
      if (widgetId.current) return;

      // Prüft, ob das Cloudflare-Skript (window.turnstile) und das Ziel-Element bereit sind
      if (window.turnstile && widgetRef.current) {
        // Rendert das Widget und speichert die zurückgegebene ID in der Referenz
        widgetId.current = window.turnstile.render(widgetRef.current, {
          sitekey: turnstileSiteKey, // Öffentlicher Key von Cloudflare
          // Wird aufgerufen, wenn der User die Prüfung besteht (liefert das Token)
          callback: (token: string) => {
            setTurnstileToken(token); // Token speichern für das Formular-Senden
            setError(""); // Etwaige alte Fehlermeldungen löschen
          },
          // Wird aufgerufen, wenn Cloudflare einen Fehler feststellt
          "error-callback": () => {
            setError("Cloudflare Security Error. Please refresh.");
            setTurnstileToken(""); // Token zurücksetzen
          },
          // Wird aufgerufen, wenn das Token zu lange ungenutzt blieb (Timeout)
          "expired-callback": () => {
            setError("Security token expired. Please verify again.");
            setTurnstileToken(""); // Token zurücksetzen
          },
          theme: "light", // Optisches Design des Widgets
        });
      }
    };

    // Falls das Skript bereits geladen ist, direkt rendern
    if (window.turnstile) {
      renderWidget();
    } else {
      // Falls das Skript noch lädt, suchen wir das <script> Tag im HTML...
      const script = document.querySelector(
        'script[src*="turnstile/v0/api.js"]',
      );
      // ...und warten mit dem Rendern, bis das Skript vollständig geladen ist
      if (script) {
        script.addEventListener("load", renderWidget);
      }
    }

    // Cleanup-Funktion: Wird ausgeführt, wenn die Komponente entfernt wird (Unmount)
    return () => {
      const script = document.querySelector(
        'script[src*="turnstile/v0/api.js"]',
      );
      // Listener entfernen, um Memory Leaks zu vermeiden
      if (script) {
        script.removeEventListener("load", renderWidget);
      }
      // Das Widget explizit aus dem Speicher von Cloudflare löschen
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      }
    };
  }, []);

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

    if (!canSubmit || !turnstileToken) {
      setError("Please solve the security check.");
      return;
    }

    try {
      setSubmitting(true);

      await sendContactMessage({ ...form, turnstileToken });

      setSuccess("Thank you! Your message has been sent.");
      setForm(initialForm);

      if (widgetId.current) {
        window.turnstile.reset(widgetId.current);
      }
      setTurnstileToken("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send a message");

      if (widgetId.current) {
        window.turnstile.reset(widgetId.current);
        setTurnstileToken("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <section className="mx-auto max-w-3xl px-4 py-14 md:px-8">
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
            <label htmlFor="name" className="sr-only">
              Full name
            </label>
            <input
              id="name"
              name="name"
              className="ui-input"
              type="text"
              placeholder="Full name"
              value={form.name}
              onChange={onChange("name")}
              required
              disabled={submitting}
            />
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              className="ui-input"
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={onChange("email")}
              required
              disabled={submitting}
            />

            <div className="relative">
              <label htmlFor="subject" className="sr-only">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
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
            <label htmlFor="message" className="sr-only">
              Message
            </label>
            <textarea
              id="message"
              name="message"
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
            select <em>“Chef collaboration”</em> and tell us about your cuisine.
          </p>

          <div className="mt-4" ref={widgetRef}></div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={submitting || !canSubmit || !turnstileToken}
              className="cursor-pointer rounded-xl bg-(--accent-olive) px-10 py-3 text-sm font-semibold text-white transition hover:bg-(--accent-wine) disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
