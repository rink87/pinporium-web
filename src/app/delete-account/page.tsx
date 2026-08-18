import type { Metadata } from "next";

import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { legal } from "@/data/legal";
import { siteDetails } from "@/data/siteDetails";

const helpMailto = `mailto:${legal.contactEmail}?subject=${encodeURIComponent(
    "Pinporium account deletion help",
)}`;

export const metadata: Metadata = {
    title: `Delete your account — ${siteDetails.siteName}`,
    description:
        "How to delete your Pinporium account in the app, and what we remove.",
};

const sections: LegalSection[] = [
    {
        id: "how",
        title: "How to delete your account",
        content: (
            <>
                <p>
                    Account deletion happens <strong>in the Pinporium app</strong>. This
                    page is for collectors who land here from Play Data safety, App Store
                    listings, or email.
                </p>
                <ol className="list-decimal pl-6 space-y-3">
                    <li>Open Pinporium on your phone and sign in.</li>
                    <li>
                        Go to <strong>Settings → Delete Account</strong>.
                    </li>
                    <li>Confirm twice.</li>
                    <li>
                        If you cannot open the app, email{" "}
                        <a href={helpMailto}>{legal.contactEmail}</a> from the address on
                        the account and we will help.
                    </li>
                </ol>
                <p>
                    Demo mode does not have an account. Sign in with a real account to
                    delete.
                </p>
            </>
        ),
    },
    {
        id: "deleted",
        title: "What we remove",
        content: (
            <>
                <p>When deletion completes, we remove:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Sign-in</strong> — you cannot sign back into that account
                    </li>
                    <li>
                        <strong>Profile</strong> — it becomes a tombstone (a{" "}
                        <code>deleted_…</code> username, “Deleted collector”, no avatar or
                        location)
                    </li>
                    <li>
                        <strong>Vault photos</strong>, notes, nicknames, prices, shipping
                        address, and sale contact email
                    </li>
                    <li>
                        <strong>Push tokens</strong>, notifications, Pin Boards, Hunt wants,
                        follows, and blocks you created
                    </li>
                    <li>
                        <strong>Storage</strong> — objects under your pin-images folder
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "kept",
        title: "What may remain",
        content: (
            <>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Approved catalog</strong> rows stay in the community
                        database. The contributor id is cleared so your name is not shown.
                    </li>
                    <li>
                        <strong>Anonymized vault row shells</strong> if Offers history still
                        references them (those rows cannot be fully deleted). Photos and
                        personal fields are stripped; status is archived.
                    </li>
                    <li>
                        <strong>Completed or already-shipped Offers</strong> remain for the
                        other collector so their thread does not vanish.
                    </li>
                    <li>
                        Open Offers that have <strong>not</strong> shipped are cancelled.
                        Already-shipped agreed trades are not silently cancelled.
                    </li>
                    <li>
                        Records we must keep to comply with law, prevent abuse, or enforce
                        our <a href="/terms">Terms of Service</a>, plus residual copies in
                        backups for a limited cycle.
                    </li>
                </ul>
            </>
        ),
    },
    {
        id: "before",
        title: "Before you delete",
        content: (
            <p>
                Deletion is permanent for your vault photos, Pin Boards, and private
                collection data. Export anything you want to keep first. If you only want
                to stop using the app, you can sign out and uninstall without deleting
                your account.
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
            intro="Delete your account in the Pinporium app: Settings → Delete Account, then confirm twice. Pinporium is the enamel pin collector app on the App Store and Google Play."
            sections={sections}
        />
    );
}
