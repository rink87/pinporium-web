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
                        <strong>Account information</strong> — email address, username,
                        profile details, and authentication data when you sign up or sign
                        in.
                    </li>
                    <li>
                        <strong>Collection and vault data</strong> — pins you add, boards,
                        ISO/grail/DISO/trader status, notes, estimated values, and related
                        metadata you choose to store.
                    </li>
                    <li>
                        <strong>Photos and media</strong> — images you upload for your
                        collection, catalog submissions, or identification features.
                    </li>
                    <li>
                        <strong>Catalog contributions</strong> — submission forms, proposed
                        pin names, variants, artists, and reviewer feedback tied to
                        community catalog entries.
                    </li>
                    <li>
                        <strong>Usage and device data</strong> — app interactions, crash
                        logs, device type, operating system, and general analytics to keep
                        the Service reliable.
                    </li>
                    <li>
                        <strong>Communications</strong> — messages you send us (support,
                        feedback, or legal requests).
                    </li>
                </ul>
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
                    <li>Provide and maintain your account, vault, and catalog features</li>
                    <li>Process and display your collection, boards, and hunt lists</li>
                    <li>Review and moderate community catalog submissions</li>
                    <li>Send service-related notices (e.g. security, submission outcomes)</li>
                    <li>
                        Send optional notifications you enable (e.g. ISO or drop alerts,
                        when available)
                    </li>
                    <li>Improve performance, fix bugs, and develop new features</li>
                    <li>Protect against abuse, fraud, and policy violations</li>
                    <li>Comply with law and enforce our Terms of Service</li>
                </ul>
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
                        <strong>Service providers</strong> — e.g. hosting, database,
                        authentication, analytics, and email providers that help us run
                        Pinporium under contractual obligations to protect your data.
                    </li>
                    <li>
                        <strong>Other users</strong> — only what you choose to make
                        visible (e.g. public profile or shared collection features, when
                        offered).
                    </li>
                    <li>
                        <strong>Moderators and reviewers</strong> — catalog submission
                        content needed to approve, reject, or normalize entries.
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
        id: "ugc",
        title: "User content and the community catalog",
        content: (
            <>
                <p>
                    Content you submit to the community catalog (photos, titles, artist
                    names, variants) may be stored, displayed to reviewers, and—if
                    approved—used as part of the shared catalog available to other
                    collectors. Do not submit content you do not have the right to share.
                </p>
                <p>
                    Approved catalog contributions may remain in the database even if you
                    delete your account, where needed to preserve catalog integrity; we will
                    disassociate personal identifiers where reasonably possible.
                </p>
            </>
        ),
    },
    {
        id: "retention",
        title: "How long we keep information",
        content: (
            <p>
                We retain information for as long as your account is active or as needed
                to provide the Service, resolve disputes, enforce agreements, and meet
                legal obligations. You may request deletion of your account and associated
                personal data subject to exceptions (e.g. fraud prevention, backup
                cycles, or catalog records that must remain for the community).
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
                    <li>Opt out of marketing emails (service emails may still be sent)</li>
                    <li>Withdraw consent where processing is based on consent</li>
                    <li>Lodge a complaint with a supervisory authority</li>
                </ul>
                <p>
                    To delete your account and associated personal data, follow the steps
                    on our{" "}
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
