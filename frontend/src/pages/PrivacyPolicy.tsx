import { NavLink } from "react-router";
import { usePageMeta } from "@/hooks/useTitle";

export default function PrivacyPolicy() {
  usePageMeta({
    title: "Privacy Policy",
    description:
      "Privacy Policy for Culinaire — how we handle user data, recipes, notes, and contact requests.",
  });

  return (
    <div className="w-full">
      <section className="mx-auto max-w-4xl px-4 py-12 md:px-8 md:py-14">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-(--text-title) md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-(--text-muted) md:text-base">
            This Privacy Policy explains what information Culinaire collects and
            how it is used. Culinaire is a student project created for
            educational purposes.
          </p>
          <div className="mt-8 border-t border-(--border-soft)" />
        </div>

        {/* Content */}
        <div className="ui-surface mt-10 p-7 md:p-10">
          <div className="space-y-10 text-sm leading-6 text-(--text-body) md:text-base">
            <section>
              <h2 className="text-xl font-semibold text-(--text-title) md:text-2xl">
                Important notice
              </h2>
              <p className="mt-4 text-sm leading-6 text-(--text-body) md:text-base">
                Culinaire is an online platform. We do not represent a
                registered company and do not provide commercial services. If
                you are reviewing this project (e.g., during a course
                evaluation), please treat it as a demo application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-(--text-title)">
                1. What we collect
              </h2>
              <p className="mt-3 text-(--text-body)">
                Depending on how you use Culinaire, we may collect:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-(--text-body)">
                <li>
                  <span className="font-semibold text-(--text-title)">
                    Account data:
                  </span>{" "}
                  name, email, and profile details you provide.
                </li>
                <li>
                  <span className="font-semibold text-(--text-title)">
                    User content:
                  </span>{" "}
                  favorites, notes, and any other content you create while
                  logged in.
                </li>
                <li>
                  <span className="font-semibold text-(--text-title)">
                    Admin content:
                  </span>{" "}
                  recipes, chefs, and categories created/edited via the admin
                  panel.
                </li>
                <li>
                  <span className="font-semibold text-(--text-title)">
                    Contact requests:
                  </span>{" "}
                  information you submit through the contact form (e.g., name,
                  email, subject, message).
                </li>
                <li>
                  <span className="font-semibold text-(--text-title)">
                    Technical data:
                  </span>{" "}
                  basic logs required to operate the service (e.g., error logs).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-(--text-title)">
                2. How we use information
              </h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-(--text-body)">
                <li>
                  To provide core features (authentication, favorites, notes).
                </li>
                <li>
                  To operate the admin panel (create, edit, delete content).
                </li>
                <li>
                  To respond to contact requests (via an email delivery
                  service).
                </li>
                <li>
                  To generate downloadable PDFs (e.g., shoplist / ingredients
                  summary).
                </li>
                <li>
                  To improve reliability (debugging and basic performance
                  monitoring).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-(--text-title)">
                3. Third-party services
              </h2>
              <p className="mt-3 text-(--text-body)">
                Culinaire may use third-party providers to deliver the service:
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-(--text-body)">
                <li>Database hosting (e.g., MongoDB hosting provider).</li>
                <li>Image hosting and delivery (e.g., Cloudinary).</li>
                <li>
                  Email delivery service for contact form messages (e.g.,
                  Resend).
                </li>
                <li>Hosting provider for deployment (e.g., Render).</li>
              </ul>
              <p className="mt-4 text-(--text-muted)">
                These providers process data only as needed to provide their
                services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-(--text-title)">
                4. Cookies & authentication
              </h2>
              <p className="mt-3 text-(--text-body)">
                We use authentication mechanisms (e.g., tokens / cookies) to
                keep you signed in and to protect user-specific features like
                favorites and notes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-(--text-title)">
                5. Data retention
              </h2>
              <p className="mt-3 text-(--text-body)">
                We keep user data only as long as necessary to provide the
                service or for legitimate operational reasons (e.g., security
                and troubleshooting).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-(--text-title)">
                6. Security
              </h2>
              <p className="mt-3 text-(--text-body)">
                We take reasonable measures to protect data, but no online
                service can guarantee complete security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-(--text-title)">
                7. Contact
              </h2>
              <p className="mt-3 text-(--text-body)">
                If you have questions about this project or privacy, you can use
                our{" "}
                <NavLink
                  to="/contact"
                  className="font-semibold text-(--accent-olive) hover:text-(--accent-wine)"
                >
                  contact form
                </NavLink>
                .
              </p>
              <p className="mt-2 text-(--text-muted)">
                This website is a student project and is provided “as is” for
                demonstration purposes.
              </p>
            </section>

            <div className="border-t border-(--border-soft) pt-6 text-center text-sm text-(--text-muted)">
              Last updated: February 2026
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}