/** Phone: capped mockups. Tablet/desktop: fixed 320px beside copy. */
export const DEVICE_MOCKUP_WIDTH_CLASS =
  "mx-auto min-w-0 w-full max-w-[340px] sm:max-w-[380px] md:w-[320px] md:max-w-[320px]";

/** Tighter cap on mobile so Next serves smaller src (LCP + below-fold). */
export const DEVICE_MOCKUP_IMAGE_SIZES =
  "(max-width: 767px) 380px, 320px";
