import { IFAQ } from "@/types";
import { siteDetails } from "./siteDetails";

export const faqs: IFAQ[] = [
    {
        question: `Is ${siteDetails.siteName} only for artist-made pins?`,
        answer:
            `${siteDetails.siteName} is for your whole enamel pin collection — artist releases, licensed and pop-culture pins, limited editions, chases, and con pickups. If you collect it, you can catalog it here.`,
    },
    {
        question: `Can I track Disney or park trading pins in ${siteDetails.siteName}?`,
        answer:
            "Yes, if they’re part of your collection. Park trading can stay its own thing; Pinporium is the home for everything else you collect across fandoms and artists.",
    },
    {
        question: "What’s a vault? Isn’t that just a collection?",
        answer:
            "Your vault is your collection in Pinporium — what you own, what you’d trade, and what you’re still looking for — organized with boards, search, and hunt lists.",
    },
    {
        question: "What does the catalog cover?",
        answer:
            "We’re building a broad pin catalog: studio and shop releases, licensed pins, limited editions, chases, and more. It grows as collectors submit pins and our team reviews them.",
    },
    {
        question: "How does the catalog stay accurate?",
        answer:
            "Collectors submit pins with photos and details; our team reviews and approves entries before they’re shared. That keeps names and variants consistent for everyone.",
    },
    {
        question: "Can pin artists and studios work with you?",
        answer:
            "We’re inviting artists and shops to claim verified listings. Email help@pinporium.app if you’d like to partner early.",
    },
    {
        question: "When can I download the app?",
        answer:
            "Beta is on iOS (TestFlight) for now; Android is coming soon. Apply on this site — we’ll email you a welcome message with the TestFlight link after we review your request. App Store and Google Play listings are coming later. Already in the beta? Use in-app feedback (shake on iOS), our Discord, or email help@pinporium.app.",
    },
];
