import type { Metadata } from "next";

import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { legal } from "@/data/legal";
import { siteDetails } from "@/data/siteDetails";

export const metadata: Metadata = {
    title: `Privacy Policy — ${siteDetails.siteName}`,
    description: `How ${siteDetails.siteName} collects, uses, and protects your information.`,
};

const sections: LegalSection[] = [
    {
        id: "who",
        title: "Who we are",
        content: (
            <>
                <p>
                    {legal.operatorName} (“Pinporium,” “we,” “us”) operates the Pinporium
                    mobile application and the website at{" "}
                    <a href={legal.websiteUrl}>{legal.websiteUrl}</a> (together, the
                    “Service”). This Privacy Policy explains how we handle personal
                    information when you use the Service.
                </p>
                <p>
                    Questions about privacy:{" "}
                    <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
                </p>
            </>
        ),
    },
    {
        id: "collect",
        title: "Information we collect",
        content: (
            <>
                <p>Depending on how you use Pinporium, we may collect:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Account information</strong> — email address, authentication
                        data, and sign-in via Apple, Google, or email and password (Supabase
                        Auth). Public <strong>username</strong> (<code>@handle</code>),
                        optional display name, optional location, and optional avatar.
                    </li>
                    <li>
                        <strong>Vault and pin photos</strong> — pins you add (Owns, Traders,
                        ISOs, Grails, DISOs), Pin Boards, notes, nicknames, grade, artist
                        and variant details, price paid, and photos you take or pick from
                        your library (front and back of pins, not only a profile photo).
                    </li>
                    <li>
                        <strong>Offers (trade and for sale)</strong> — offer terms, notes,
                        status you report, shipping address you save for coordination, and
                        (for sales) a sale contact email. Pinporium does not process
                        payments.
                    </li>
                    <li>
                        <strong>Public profile choices</strong> — what other collectors can
                        see (stats, Traders gallery, vault pins, Pin Boards). Defaults: stats
                        and trade pins on; full vault and Pin Boards off.
                    </li>
                    <li>
                        <strong>Catalog contributions</strong> — pin data and photos you
                        submit for the shared community catalog, plus reviewer outcomes.
                    </li>
                    <li>
                        <strong>Push tokens</strong> — Expo Push device identifiers used to
                        hand off to Apple APNs or Google FCM, stored for signed-in
                        collectors who allow notifications.
                    </li>
                    <li>
                        <strong>Crash and device context</strong> — crash logs and coarse
                        device or app context via Sentry. We do not send vault photos to
                        Sentry as a product feature.
                    </li>
                    <li>
                        <strong>Communications</strong> — messages you send us (support,
                        feedback, or legal requests), and transactional email we send you
                        (for example catalog submission decisions).
                    </li>
                    <li>
                        <strong>Website usage</strong> — if you visit pinporium.app, standard
                        web analytics or similar tools we configure for the site.
                    </li>
                </ul>
                <p>
                    <strong>Demo mode</strong> uses local sample data on your device. It
                    does not create a Pinporium account, profile, or push token.
                </p>
            </>
        ),
    },
    {
        id: "photos",
        title: "Pin photos, cutouts, and identify",
        content: (
            <>
                <p>
                    Collectors photograph pins (front and back) or pick images from the
                    library. Photos are stored in our storage; pin metadata (artist,
                    variant, grade, notes, price paid, and similar fields) is stored in our
                    database.
                </p>
                <p>
                    Optional background removal can run <strong>on your device</strong>{" "}
                    (iOS Vision / Android ML Kit). That processing stays on the device.
                </p>
                <p>
                    If on-device cutout is unavailable, the app may send a pin photo to{" "}
                    <strong>remove.bg</strong> <strong>through Pinporium servers</strong>.
                    The app does not ship that vendor API key.
                </p>
                <p>
                    Optional pin identify and catalog-match helpers may send a pin photo to{" "}
                    <strong>Anthropic Claude Haiku</strong>{" "}
                    <strong>through Pinporium servers</strong>. The app does not ship that
                    vendor API key. We send photos for identification or cutout, not to
                    train our own models. Vendors process data under their own policies —
                    see{" "}
                    <a href="https://www.anthropic.com/legal/privacy">Anthropic Privacy</a>{" "}
                    and{" "}
                    <a href="https://www.remove.bg/privacy">remove.bg Privacy</a>. We do
                    not promise how those vendors train their systems.
                </p>
            </>
        ),
    },
    {
        id: "use",
        title: "How we use information",
        content: (
            <>
                <p>We use information to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Provide your account, Vault, catalog, Hunt lists, and Pin Boards</li>
                    <li>
                        Help collectors coordinate Offers (trades and for-sale listings) —
                        matching, status, and details you choose to share with a counterparty
                    </li>
                    <li>Review and moderate catalog submissions and other user content</li>
                    <li>
                        Send optional push notifications you enable: Offers (trade and for
                        sale) and catalog submission decisions
                    </li>
                    <li>Send transactional email (for example catalog review outcomes)</li>
                    <li>Fix crashes, keep the Service reliable, and prevent abuse</li>
                    <li>Comply with law and enforce our Terms of Service</li>
                </ul>
                <p>
                    We do not send Hunt ISO match alerts, Drop Zone push, or marketing
                    blasts today.
                </p>
            </>
        ),
    },
    {
        id: "sharing",
        title: "When we share information",
        content: (
            <>
                <p>
                    We do not sell your personal information. We may share information
                    with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Service providers</strong> — the processors listed below,
                        under obligations to handle data only as needed to run Pinporium.
                    </li>
                    <li>
                        <strong>Other collectors</strong> — information you choose to make
                        visible on your public profile, plus coordination details after you
                        agree to an Offer (username, shipping address, sale contact email,
                        offer terms, or tracking you enter).
                    </li>
                    <li>
                        <strong>Moderators</strong> — catalog submissions and, when needed,
                        Offer or report records to investigate abuse.
                    </li>
                    <li>
                        <strong>Legal and safety</strong> — when required by law, court
                        order, or to protect rights, safety, and integrity of the Service.
                    </li>
                    <li>
                        <strong>Business transfers</strong> — in connection with a merger,
                        acquisition, or asset sale, with notice where required by law.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "processors",
        title: "Processors we use",
        content: (
            <>
                <p>
                    These providers help us operate the Service. Each has its own privacy
                    policy.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Supabase</strong> (Postgres, Auth, Storage, Edge Functions)
                        — account, Vault, Offers, catalog, and files
                    </li>
                    <li>
                        <strong>Apple and Google</strong> — sign-in
                    </li>
                    <li>
                        <strong>Expo, Apple APNs, and Google FCM</strong> — push delivery
                    </li>
                    <li>
                        <strong>Anthropic</strong> — optional pin identify (photo via our
                        server)
                    </li>
                    <li>
                        <strong>remove.bg</strong> — optional cutout fallback (photo via our
                        server)
                    </li>
                    <li>
                        <strong>Sentry</strong> — crash reports
                    </li>
                    <li>
                        <strong>Resend</strong> — transactional email (catalog decisions and
                        similar service messages)
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "offers",
        title: "Offers (trade and for sale)",
        content: (
            <>
                <p>
                    Offers are <strong>coordination only</strong>. Pinporium does not
                    process payments, hold escrow, or run platform checkout. After
                    collectors agree, they may share a shipping address and (for sales) a
                    sale contact email so they can ship to each other. Pinporium is not a
                    party to the trade or sale.
                </p>
                <p>
                    Do not share more personal information than you are comfortable
                    providing to another collector.
                </p>
            </>
        ),
    },
    {
        id: "ugc",
        title: "User content and the community catalog",
        content: (
            <>
                <p>
                    User-generated content includes vault photos, public profiles, Offer
                    notes, and catalog submissions. Do not submit content you do not have
                    the right to share.
                </p>
                <p>
                    The community catalog is a shared reference. Approved catalog entries{" "}
                    <strong>can remain after account deletion</strong>, with the contributor
                    id cleared so your name is not shown. That is intentional — the catalog
                    is a community database.
                </p>
            </>
        ),
    },
    {
        id: "moderation",
        title: "Report and block",
        content: (
            <>
                <p>
                    You can <strong>report a collector</strong> from their profile menu
                    (spam, harassment, scam or trading fraud, inappropriate content, or
                    other). Reports are reviewed by Pinporium and do not auto-block.
                </p>
                <p>
                    You can <strong>block a collector</strong> to hide both sides from new
                    Offers. Open unshipped Offer threads are cancelled. Their profile can
                    still open with a banner and no listing actions. Unblock from the
                    profile or Settings.
                </p>
                <p>
                    Pin or catalog data issues use <strong>Report an issue</strong> on pin
                    detail — not the collector report.
                </p>
            </>
        ),
    },
    {
        id: "retention",
        title: "How long we keep information",
        content: (
            <p>
                We retain information while your account is active and as needed to
                provide the Service, resolve disputes, enforce agreements, and meet legal
                obligations. See{" "}
                <a href="/delete-account">Delete your account</a> for what we remove when
                you delete, and what may remain (approved catalog rows, anonymized Offer
                history for the other collector, and similar exceptions).
            </p>
        ),
    },
    {
        id: "security",
        title: "Security",
        content: (
            <p>
                We use reasonable technical and organizational measures to protect
                information. No method of transmission or storage is completely secure;
                use a strong password and keep your device credentials private.
            </p>
        ),
    },
    {
        id: "rights",
        title: "Your choices and rights",
        content: (
            <>
                <p>Depending on where you live, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Access, correct, or delete personal information we hold about you</li>
                    <li>Export your data where the product supports it</li>
                    <li>Control public profile visibility in Settings</li>
                    <li>Turn off Push: Offers and Push: Catalog in the app (and OS permission)</li>
                    <li>Withdraw consent where processing is based on consent</li>
                    <li>Lodge a complaint with a supervisory authority</li>
                </ul>
                <p>
                    To delete your account, use in-app <strong>Settings → Delete Account</strong>{" "}
                    (two confirms). Steps are also on our{" "}
                    <a href="/delete-account">account deletion page</a>. For other rights,
                    contact{" "}
                    <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
                    We may need to verify your identity before responding.
                </p>
            </>
        ),
    },
    {
        id: "children",
        title: "Children",
        content: (
            <p>
                Pinporium is not directed to children under 13 (or the minimum age required
                in your country). We do not knowingly collect personal information from
                children. If you believe a child has provided us data, contact us and we
                will take appropriate steps to delete it.
            </p>
        ),
    },
    {
        id: "international",
        title: "International users",
        content: (
            <p>
                If you access Pinporium from outside the United States, your information
                may be processed in the U.S. or other countries where our providers
                operate. Those countries may have different data protection laws than
                yours.
            </p>
        ),
    },
    {
        id: "changes",
        title: "Changes to this policy",
        content: (
            <p>
                We may update this Privacy Policy from time to time. We will post the
                revised version on this page and update the effective date. Material
                changes may be communicated in the app or by email where appropriate.
                Continued use after changes take effect means you accept the updated
                policy.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact",
        content: (
            <p>
                Privacy inquiries:{" "}
                <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
            </p>
        ),
    },
];

export default function PrivacyPage() {
    return (
        <LegalDocument
            title="Privacy Policy"
            effectiveDate={legal.effectiveDate}
            intro="This policy describes how Pinporium handles personal information when you use our app and website. We built Pinporium for collectors — your trust matters as much as your vault."
            sections={sections}
        />
    );
}
