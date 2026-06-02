import type { Metadata } from "next";

import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { legal } from "@/data/legal";
import { siteDetails } from "@/data/siteDetails";

const deleteRequestMailto = `mailto:${legal.contactEmail}?subject=${encodeURIComponent(
    "Pinporium account deletion request",
)}`;

export const metadata: Metadata = {
    title: `Delete your account — ${siteDetails.siteName}`,
    description:
        "Request deletion of your Pinporium account and associated personal data.",
};

const sections: LegalSection[] = [
    {
        id: "overview",
        title: "Request account deletion for Pinporium",
        content: (
            <>
                <p>
                    <strong>{siteDetails.siteName}</strong> ({legal.operatorName}) lets
                    you delete your collector account and the personal data we hold about
                    you. This page explains how to request deletion, what we remove, what
                    may be kept, and how long retention can last.
                </p>
                <p>
                    In-app self-service deletion is not available yet. Use the steps
                    below to submit a request by email.
                </p>
            </>
        ),
    },
    {
        id: "steps",
        title: "Steps to request deletion",
        content: (
            <ol className="list-decimal pl-6 space-y-3">
                <li>
                    Send an email from the <strong>same address</strong> tied to your
                    Pinporium account to{" "}
                    <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>.
                </li>
                <li>
                    Use the subject line:{" "}
                    <strong>Pinporium account deletion request</strong> (or use{" "}
                    <a href={deleteRequestMailto}>this mail link</a> to prefill it).
                </li>
                <li>
                    In the message, include your <strong>@username</strong> (if you
                    remember it) so we can locate your profile quickly.
                </li>
                <li>
                    We will reply to confirm your identity if needed, then process the
                    request.
                </li>
                <li>
                    After deletion is complete, we will send a final confirmation email
                    when possible.
                </li>
            </ol>
        ),
    },
    {
        id: "deleted",
        title: "Data we delete",
        content: (
            <>
                <p>
                    When your request is approved and processed, we delete or
                    disassociate personal data tied to your account, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Account and profile</strong> — sign-in identity, email,
                        username, display name, avatar, profile settings, and notification
                        preferences
                    </li>
                    <li>
                        <strong>Vault and collection</strong> — pins you added, photos you
                        uploaded, boards, hunt/ISO/grail/trader flags, notes, and personal
                        vault history
                    </li>
                    <li>
                        <strong>Social and activity</strong> — follows, achievements and
                        collector score tied to you, in-app feedback you submitted, and
                        similar account-linked activity
                    </li>
                    <li>
                        <strong>Trades</strong> — trade coordination data where you are a
                        participant (we remove or anonymize your identifying details on
                        trade records as needed for the other collector&apos;s history)
                    </li>
                    <li>
                        <strong>Stored files</strong> — profile and vault images in our
                        storage that are only associated with your account
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "kept",
        title: "Data we may keep",
        content: (
            <>
                <p>Some information may be retained after account deletion:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Community catalog</strong> — pin designs, variants, or
                        photos you submitted that were <strong>approved</strong> for the
                        shared catalog may remain so the database stays accurate for other
                        collectors. We disassociate your name, email, and account ID from
                        those records where reasonably possible.
                    </li>
                    <li>
                        <strong>Backups</strong> — encrypted backups may retain copies for
                        a limited period (see retention below), then are purged on a
                        normal backup cycle.
                    </li>
                    <li>
                        <strong>Legal and safety</strong> — records we must keep to comply
                        with law, resolve disputes, prevent abuse, or enforce our{" "}
                        <a href="/terms">Terms of Service</a>.
                    </li>
                    <li>
                        <strong>Aggregated analytics</strong> — non-identifying statistics
                        (for example, crash counts or feature usage totals) that cannot
                        reasonably be linked back to you.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "retention",
        title: "Processing time and retention period",
        content: (
            <>
                <p>
                    We aim to complete verified deletion requests within{" "}
                    <strong>30 days</strong> of confirming your identity. Complex requests
                    may take longer; we will tell you if that applies.
                </p>
                <p>
                    After deletion, residual copies in backups and logs are typically
                    removed within <strong>90 days</strong>, except where a longer period
                    is required by law or for legitimate security purposes.
                </p>
            </>
        ),
    },
    {
        id: "before",
        title: "Before you delete",
        content: (
            <p>
                Deletion is permanent for your vault, boards, and private collection
                data. Export anything you want to keep before requesting deletion. If you
                only want to stop using the app, you can sign out and uninstall without
                deleting your account.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Questions",
        content: (
            <p>
                Privacy or deletion questions:{" "}
                <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>. See
                also our <a href="/privacy">Privacy Policy</a>.
            </p>
        ),
    },
];

export default function DeleteAccountPage() {
    return (
        <LegalDocument
            title="Delete your Pinporium account"
            effectiveDate={legal.effectiveDate}
            intro="Use this page to request deletion of your Pinporium account and associated personal data. Pinporium is the enamel pin collector app listed on Google Play and the Apple App Store under the name Pinporium."
            sections={sections}
        />
    );
}
