/* eslint-disable @next/next/no-img-element -- Satori OG renderer requires <img>, not next/image */
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { heroDetails } from "@/data/hero";
import { siteDetails } from "@/data/siteDetails";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageAlt = siteDetails.metadata.title;

function toDataUrl(buffer: Buffer, mime: string) {
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

async function loadPublicImage(filename: string, mime: string) {
  const buffer = await readFile(join(process.cwd(), "public", "images", filename));
  return toDataUrl(buffer, mime);
}

/** 1.91:1 card for iMessage, Slack, Twitter, etc. — not the tall app screenshot. */
export async function createOgImage() {
  const [logoSrc, phoneSrc] = await Promise.all([
    loadPublicImage("logo-wordmark.png", "image/png"),
    loadPublicImage("hero-home.png", "image/png"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(165deg, #eadbcc 0%, #f1e5d8 48%, #eadbcc 100%)",
          padding: "44px 52px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
            maxWidth: 640,
            paddingRight: 32,
          }}
        >
          <img
            src={logoSrc}
            alt=""
            height={44}
            width={260}
            style={{
              objectFit: "contain",
              objectPosition: "left center",
            }}
          />
          <p
            style={{
              marginTop: 28,
              fontSize: 17,
              color: "#524e5f",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Vault · Discover · Flex · Trade
          </p>
          <p
            style={{
              marginTop: 18,
              fontSize: 48,
              fontWeight: 600,
              color: "#2c3345",
              lineHeight: 1.12,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            {heroDetails.heading}
          </p>
          <p
            style={{
              marginTop: 20,
              fontSize: 21,
              color: "#524e5f",
              lineHeight: 1.35,
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Curate your vault, hunt ISOs and grails, and trade in-app.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              padding: 7,
              borderRadius: 34,
              background:
                "linear-gradient(145deg, #31333a 0%, #050507 42%, #1a1b20 100%)",
              boxShadow: "0 20px 50px rgba(26, 26, 46, 0.4)",
            }}
          >
            <div
              style={{
                display: "flex",
                borderRadius: 26,
                overflow: "hidden",
                width: 248,
                height: 500,
                background: "#fff9f5",
              }}
            >
              <img
                src={phoneSrc}
                alt=""
                width={248}
                height={620}
                style={{
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...ogImageSize,
    },
  );
}
