import { siteDetails } from "./siteDetails";

/** Update contactEmail when your domain inbox is live (e.g. legal@pinporium.app). */
export const legal = {
    effectiveDate: "May 20, 2026",
    operatorName: "Pinporium",
    contactEmail: siteDetails.supportEmail || "legal@pinporium.app",
    websiteUrl: siteDetails.siteUrl,
};
