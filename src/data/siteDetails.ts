export const siteDetails = {
    siteName: 'Pinporium',
    siteUrl: 'https://pinporium.app',
    /** Set when you have a public inbox; FAQ and footer hide the link if empty. */
    supportEmail: 'help@pinporium.app',
    metadata: {
        title: 'Pinporium — The pin collection app you’ll actually use',
        description:
            'Curate your vault, hunt ISOs and grails on The Hunt, trade or sell from the Offers subtab, flex badges, share wins, and grow the catalog — built for collectors who treat enamel pins like tiny trophies.',
    },
    language: 'en-us',
    locale: 'en-US',
    /** Horizontal enamel wordmark (transparent PNG) */
    siteLogo: `${process.env.BASE_PATH || ''}/images/logo-wordmark.png`,
    logoWidth: 697,
    /** Tight-cropped wordmark (reduced vertical padding) */
    logoHeight: 140,
    /** Set NEXT_PUBLIC_GA_MEASUREMENT_ID or GOOGLE_ANALYTICS_ID in env (wired in app/layout.tsx). */
    /** Optional: Ko-fi, Buy Me a Coffee, Patreon, etc. — set NEXT_PUBLIC_SUPPORT_TIP_URL */
    supportTipUrl: process.env.NEXT_PUBLIC_SUPPORT_TIP_URL ?? '',
    supportTipLabel: 'Buy me a coffee',
};
