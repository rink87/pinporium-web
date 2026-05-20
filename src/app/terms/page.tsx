import type { Metadata } from "next";

import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { legal } from "@/data/legal";
import { siteDetails } from "@/data/siteDetails";

export const metadata: Metadata = {
    title: `Terms of Service — ${siteDetails.siteName}`,
    description: `Terms and conditions for using the ${siteDetails.siteName} app and website.`,
};

const sections: LegalSection[] = [
    {
        id: "agreement",
        title: "Agreement to these terms",
        content: (
            <>
                <p>
                    These Terms of Service (“Terms”) govern your access to and use of the
                    Pinporium mobile application, website, and related services
                    (collectively, the “Service”) operated by {legal.operatorName} (“we,”
                    “us”). By creating an account or using the Service, you agree to these
                    Terms and our{" "}
                    <a href="/privacy">Privacy Policy</a>.
                </p>
                <p>
                    If you do not agree, do not use the Service.
                </p>
            </>
        ),
    },
    {
        id: "eligibility",
        title: "Eligibility",
        content: (
            <p>
                You must be at least 13 years old (or older if required where you live) and
                able to form a binding contract. You are responsible for ensuring your use
                of Pinporium complies with local laws.
            </p>
        ),
    },
    {
        id: "account",
        title: "Your account",
        content: (
            <>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate registration information and keep it updated.</li>
                    <li>Keep your login credentials confidential.</li>
                    <li>
                        You are responsible for activity under your account unless you
                        notify us promptly of unauthorized access.
                    </li>
                    <li>
                        We may suspend or terminate accounts that violate these Terms or
                        pose risk to the community or Service.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "service",
        title: "The Service",
        content: (
            <>
                <p>
                    Pinporium helps enamel pin collectors organize collections, discover
                    pins, contribute to a community catalog, track ISOs and grails, and
                    (over time) participate in social and marketplace features.
                </p>
                <p>
                    We may add, change, or remove features at any time. Beta or early
                    features may be incomplete or change without notice.
                </p>
            </>
        ),
    },
    {
        id: "catalog",
        title: "Community catalog and submissions",
        content: (
            <>
                <p>When you submit catalog entries or photos, you agree that:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        Your submission is accurate to the best of your knowledge and does
                        not infringe others’ rights.
                    </li>
                    <li>
                        You will not submit misleading, duplicate, or malicious entries.
                    </li>
                    <li>
                        Moderators may approve, edit, merge, reject, or remove submissions
                        at their discretion.
                    </li>
                    <li>
                        Approved catalog data may be used by all users of the Service as
                        part of the shared reference database.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "license",
        title: "Your content and license to us",
        content: (
            <p>
                You retain ownership of content you upload. By submitting content to the
                Service, you grant us a worldwide, non-exclusive, royalty-free license to
                host, store, reproduce, display, and adapt that content solely to operate,
                improve, and promote Pinporium (including the community catalog). This
                license continues for catalog content that remains in the database after
                account deletion, to the extent necessary for the community reference.
            </p>
        ),
    },
    {
        id: "conduct",
        title: "Acceptable use",
        content: (
            <>
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Violate laws or others’ intellectual property or privacy rights</li>
                    <li>Harass, threaten, or impersonate others</li>
                    <li>Upload malware, scrape the Service abusively, or attempt unauthorized access</li>
                    <li>
                        List counterfeit pins as authentic without clear disclosure where
                        applicable
                    </li>
                    <li>Spam the catalog or manipulate reviews, scores, or rankings</li>
                    <li>Use the Service for unlawful resale schemes or fraud</li>
                </ul>
            </>
        ),
    },
    {
        id: "ip",
        title: "Intellectual property",
        content: (
            <>
                <p>
                    Pinporium’s name, logo, app design, and original materials are owned
                    by us or our licensors. You may not copy or use them without permission.
                </p>
                <p>
                    Pinporium is an independent collector platform. We are not affiliated
                    with, endorsed by, or sponsored by Disney, Lucasfilm, pin artists,
                    brands, or rights holders unless we expressly say so. Pins, artist
                    names, and trademarks belong to their respective owners.
                </p>
            </>
        ),
    },
    {
        id: "grading",
        title: "Grading, values, and estimates",
        content: (
            <p>
                Condition grades (e.g. Pinporium’s grading scale), collection values, and
                market estimates are provided for convenience and community reference only.
                They are not professional appraisals, investment advice, or guarantees of
                authenticity or resale price. You are responsible for verifying pins and
                transactions.
            </p>
        ),
    },
    {
        id: "trades",
        title: "Trades and marketplace (current and future)",
        content: (
            <>
                <p>
                    Trading and buy/sell features may be introduced over time. Unless we
                    explicitly state otherwise:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        Transactions between users are between those users; Pinporium is not
                        a party to the sale or trade.
                    </li>
                    <li>
                        We do not guarantee item condition, delivery, payment, or dispute
                        outcomes.
                    </li>
                    <li>
                        Future marketplace fees, if any, will be disclosed before you are
                        charged.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "premium",
        title: "Subscriptions and paid features",
        content: (
            <p>
                If we offer paid subscriptions or one-time purchases, additional terms and
                pricing will be shown at checkout. Payments may be processed by Apple,
                Google, or other payment providers; their terms also apply. Refunds follow
                applicable store policies and our stated refund rules.
            </p>
        ),
    },
    {
        id: "third-party",
        title: "Third-party services and links",
        content: (
            <p>
                The Service may link to artist shops, social platforms, or other sites we do
                not control. We are not responsible for third-party content or practices.
            </p>
        ),
    },
    {
        id: "disclaimer",
        title: "Disclaimers",
        content: (
            <p>
                THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF
                ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
                PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
                SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
            </p>
        ),
    },
    {
        id: "liability",
        title: "Limitation of liability",
        content: (
            <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR AFFILIATES, OFFICERS,
                EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA,
                OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR
                ANY CLAIM RELATING TO THE SERVICE IS LIMITED TO THE GREATER OF (A) AMOUNTS
                YOU PAID US IN THE TWELVE MONTHS BEFORE THE CLAIM, OR (B) ONE HUNDRED U.S.
                DOLLARS ($100).
            </p>
        ),
    },
    {
        id: "indemnity",
        title: "Indemnity",
        content: (
            <p>
                You agree to defend and indemnify us against claims arising from your use of
                the Service, your content, your violations of these Terms, or your
                interactions with other users (including trades or sales), except where
                caused by our gross negligence or willful misconduct.
            </p>
        ),
    },
    {
        id: "termination",
        title: "Termination",
        content: (
            <p>
                You may stop using the Service at any time. We may suspend or terminate
                access for any reason, including violations of these Terms. Provisions
                that by nature should survive (licenses for catalog content, disclaimers,
                liability limits, indemnity, dispute terms) will survive termination.
            </p>
        ),
    },
    {
        id: "disputes",
        title: "Disputes and governing law",
        content: (
            <>
                <p>
                    These Terms are governed by the laws of the United States and the State
                    of Delaware, without regard to conflict-of-law rules, except where
                    mandatory consumer protection laws in your country of residence apply.
                </p>
                <p>
                    For U.S. users, disputes will be resolved in the state or federal courts
                    located in Delaware, unless applicable law requires otherwise. You may
                    also have the right to bring claims in your home jurisdiction where
                    required by consumer law.
                </p>
            </>
        ),
    },
    {
        id: "changes",
        title: "Changes to these terms",
        content: (
            <p>
                We may update these Terms. We will post the new version on this page and
                update the effective date. Continued use after changes become effective
                constitutes acceptance. Material changes may be notified in the app or by
                email.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact",
        content: (
            <p>
                Questions about these Terms:{" "}
                <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
            </p>
        ),
    },
];

export default function TermsPage() {
    return (
        <LegalDocument
            title="Terms of Service"
            effectiveDate={legal.effectiveDate}
            intro="Please read these terms carefully. They explain your rights and responsibilities when using Pinporium as a collector, contributor, or visitor."
            sections={sections}
        />
    );
}
