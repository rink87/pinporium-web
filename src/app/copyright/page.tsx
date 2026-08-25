import type { Metadata } from "next";

import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { legal } from "@/data/legal";
import { siteDetails } from "@/data/siteDetails";

export const metadata: Metadata = {
    title: `Copyright Policy — ${siteDetails.siteName}`,
    description: `DMCA and copyright complaints for the ${siteDetails.siteName} collector catalog.`,
};

const copyrightMailto = `mailto:${legal.copyrightEmail}`;

const sections: LegalSection[] = [
    {
        id: "about",
        title: "About Pinporium and third-party content",
        content: (
            <>
                <p>
                    Pinporium helps enamel pin collectors organize personal vaults and
                    contribute to a <strong>community reference catalog</strong>. Catalog
                    entries may include photos and names of commercially sold or traded
                    collectible pins, including pins that depict characters or brands
                    owned by third parties.
                </p>
                <p>
                    Pinporium is an <strong>independent platform</strong>. We are not
                    affiliated with, endorsed by, or sponsored by Disney, Pixar,
                    Lucasfilm, Marvel, pin artists, brands, or other rights holders unless
                    we say so expressly.
                </p>
                <p>
                    Collectors submit catalog content. Pinporium does not claim ownership
                    of third-party trademarks or character designs shown in user-submitted
                    pin photos. We host this material solely to operate the catalog and
                    vault features described in our{" "}
                    <a href="/terms">Terms of Service</a>.
                </p>
            </>
        ),
    },
    {
        id: "reporting",
        title: "Reporting copyright infringement",
        content: (
            <>
                <p>
                    If you believe content on Pinporium infringes your copyright, send a
                    notice to:
                </p>
                <p>
                    <strong>Email:</strong>{" "}
                    <a href={copyrightMailto}>{legal.copyrightEmail}</a>
                    <br />
                    <strong>Subject line:</strong> DMCA Notice — Pinporium
                </p>
                <p>Include:</p>
                <ol className="list-decimal pl-6 space-y-2">
                    <li>
                        <strong>Your contact information</strong> — legal name, mailing
                        address, phone, and email.
                    </li>
                    <li>
                        <strong>Identification of the copyrighted work</strong> — e.g. the
                        character, artwork, or image you own or represent.
                    </li>
                    <li>
                        <strong>Identification of the infringing material</strong> — pin
                        name, artist/maker, Pinporium URL or in-app path, and screenshots
                        if helpful.
                    </li>
                    <li>
                        <strong>Good-faith statement</strong> — that you have a good-faith
                        belief the use is not authorized by the rights owner, its agent, or
                        the law.
                    </li>
                    <li>
                        <strong>Accuracy statement</strong> — that the information in the
                        notice is accurate, and under penalty of perjury, that you are
                        authorized to act on behalf of the rights owner.
                    </li>
                    <li>
                        <strong>Signature</strong> — physical or electronic.
                    </li>
                </ol>
                <p>
                    We may forward your notice to the user who submitted the content. You
                    may want to consult an attorney before filing a notice.
                </p>
            </>
        ),
    },
    {
        id: "response",
        title: "Our response",
        content: (
            <p>
                We aim to review valid notices within <strong>3 business days</strong>. We
                may remove or disable access to reported catalog entries or photos,
                request additional information, or decline notices that are incomplete or
                abusive.
            </p>
        ),
    },
    {
        id: "repeat",
        title: "Repeat infringers",
        content: (
            <p>
                We may suspend or terminate accounts of users who repeatedly submit
                infringing content, as described in our{" "}
                <a href="/terms">Terms of Service</a>.
            </p>
        ),
    },
    {
        id: "counter",
        title: "Counter-notification",
        content: (
            <>
                <p>
                    If you believe your content was removed by mistake, reply to{" "}
                    <a href={copyrightMailto}>{legal.copyrightEmail}</a> with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        Identification of the removed material and its location before
                        removal
                    </li>
                    <li>
                        A statement under penalty of perjury that removal was a mistake or
                        misidentification
                    </li>
                    <li>
                        Your name, address, phone, email, and consent to jurisdiction of
                        the federal district court for your address (or Delaware if outside
                        the U.S.)
                    </li>
                    <li>Your physical or electronic signature</li>
                </ul>
            </>
        ),
    },
    {
        id: "trademarks",
        title: "Trademarks",
        content: (
            <p>
                This policy addresses <strong>copyright</strong>. Trademark concerns
                (e.g. confusion about affiliation with a brand) may also be sent to{" "}
                <a href={copyrightMailto}>{legal.copyrightEmail}</a> or{" "}
                <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a> with
                “Trademark” in the subject line.
            </p>
        ),
    },
    {
        id: "other",
        title: "Other issues",
        content: (
            <p>
                For catalog accuracy (wrong artist, duplicate entry, scrappers),
                collectors can use <strong>Report an issue</strong> in the app on pin
                detail. That route is for community catalog quality, not a substitute
                for a legal copyright notice.
            </p>
        ),
    },
    {
        id: "contact",
        title: "Contact",
        content: (
            <p>
                Copyright / DMCA:{" "}
                <a href={copyrightMailto}>{legal.copyrightEmail}</a>
                <br />
                General:{" "}
                <a href={`mailto:${legal.contactEmail}`}>{legal.contactEmail}</a>
            </p>
        ),
    },
];

export default function CopyrightPage() {
    return (
        <LegalDocument
            title="Copyright Policy"
            effectiveDate={legal.copyrightEffectiveDate}
            intro="How Pinporium handles copyright complaints for the community pin catalog and collector-submitted photos."
            sections={sections}
        />
    );
}
