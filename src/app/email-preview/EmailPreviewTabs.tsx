"use client";

import { useMemo, useState } from "react";

import type { BetaPlatform } from "@/lib/betaTester";
import {
  betaActiveNoPinsCheckInEmailHtml,
  betaActiveNoPinsCheckInEmailSubject,
} from "@/lib/email/templates/betaActiveNoPinsCheckIn";
import {
  betaActiveUserCheckInEmailHtml,
  betaActiveUserCheckInEmailSubject,
} from "@/lib/email/templates/betaActiveUserCheckIn";
import {
  betaNotYetStartedEmailHtml,
  betaNotYetStartedEmailSubject,
} from "@/lib/email/templates/betaNotYetStarted";
import {
  betaSignupReceivedEmailHtml,
  betaSignupReceivedEmailSubject,
} from "@/lib/email/templates/betaSignupReceived";
import {
  betaThanksEmailHtml,
  betaThanksEmailSubject,
} from "@/lib/email/templates/betaThanks";
import {
  linkVerificationApprovedEmailHtml,
  linkVerificationApprovedEmailSubject,
} from "@/lib/email/templates/submission/linkVerificationApproved";
import {
  sampleCatalogVariant,
  sampleLinkRejectedSubmission,
  sampleLinkVerificationSubmission,
  sampleNewPinSubmissionWithAdjustments,
  sampleRejectedSubmission,
} from "@/lib/email/templates/submission/sampleData";
import {
  submissionApprovedEmailHtml,
  submissionApprovedEmailSubject,
} from "@/lib/email/templates/submission/submissionApproved";
import {
  submissionRejectedEmailHtml,
  submissionRejectedEmailSubject,
} from "@/lib/email/templates/submission/submissionRejected";

type EmailPreviewContext = {
  name: string;
  wordmarkSrc: string;
  assetsBaseUrl: string;
};

type TabId =
  | "beta-signup"
  | "beta-welcome"
  | "beta-not-started"
  | "beta-active-no-pins"
  | "beta-active"
  | "submission-catalog-approved"
  | "submission-link-verified"
  | "submission-catalog-rejected"
  | "submission-link-rejected";

type TabConfig = {
  id: TabId;
  group: "Beta" | "Submissions";
  label: string;
  subject: string;
  description?: string;
  minHeight: number;
  render: (ctx: EmailPreviewContext) => string | { ios: string; android: string };
};

const platforms: BetaPlatform[] = ["ios", "android"];

function betaPlatformHtml(
  ctx: EmailPreviewContext,
  render: (platform: BetaPlatform) => string,
): { ios: string; android: string } {
  return {
    ios: render("ios"),
    android: render("android"),
  };
}

function buildTabs(): TabConfig[] {
  return [
    {
      id: "beta-signup",
      group: "Beta",
      label: "Signup received",
      subject: betaSignupReceivedEmailSubject(),
      minHeight: 420,
      render: ctx =>
        betaPlatformHtml(ctx, platform =>
          betaSignupReceivedEmailHtml({
            name: ctx.name,
            platform,
            wordmarkSrc: ctx.wordmarkSrc,
            assetsBaseUrl: ctx.assetsBaseUrl,
          }),
        ),
    },
    {
      id: "beta-welcome",
      group: "Beta",
      label: "Welcome",
      subject: betaThanksEmailSubject("ios"),
      description: "Sent after Slack approval.",
      minHeight: 780,
      render: ctx =>
        betaPlatformHtml(ctx, platform =>
          betaThanksEmailHtml({
            name: ctx.name,
            platform,
            wordmarkSrc: ctx.wordmarkSrc,
            assetsBaseUrl: ctx.assetsBaseUrl,
          }),
        ),
    },
    {
      id: "beta-not-started",
      group: "Beta",
      label: "Not started",
      subject: betaNotYetStartedEmailSubject(),
      description: "Manual send — welcome email but no app account yet.",
      minHeight: 920,
      render: ctx =>
        betaPlatformHtml(ctx, platform =>
          betaNotYetStartedEmailHtml({
            name: ctx.name,
            platform,
            email: "collector@example.com",
            wordmarkSrc: ctx.wordmarkSrc,
            assetsBaseUrl: ctx.assetsBaseUrl,
          }),
        ),
    },
    {
      id: "beta-active-no-pins",
      group: "Beta",
      label: "Signed in, no pins",
      subject: betaActiveNoPinsCheckInEmailSubject(),
      description: "Manual send — signed in but vault is empty.",
      minHeight: 920,
      render: ctx =>
        betaPlatformHtml(ctx, platform =>
          betaActiveNoPinsCheckInEmailHtml({
            name: ctx.name,
            platform,
            email: "collector@example.com",
            wordmarkSrc: ctx.wordmarkSrc,
            assetsBaseUrl: ctx.assetsBaseUrl,
          }),
        ),
    },
    {
      id: "beta-active",
      group: "Beta",
      label: "Active — has pins",
      subject: betaActiveUserCheckInEmailSubject(),
      description: "Manual send — signed in with at least one vault pin.",
      minHeight: 880,
      render: ctx =>
        betaPlatformHtml(ctx, platform =>
          betaActiveUserCheckInEmailHtml({
            name: ctx.name,
            platform,
            email: "collector@example.com",
            wordmarkSrc: ctx.wordmarkSrc,
            assetsBaseUrl: ctx.assetsBaseUrl,
          }),
        ),
    },
    {
      id: "submission-catalog-approved",
      group: "Submissions",
      label: "Catalog approved",
      subject: submissionApprovedEmailSubject(
        sampleNewPinSubmissionWithAdjustments,
        sampleCatalogVariant,
      ),
      description: "New pin added to the community catalog.",
      minHeight: 960,
      render: ctx =>
        submissionApprovedEmailHtml({
          row: sampleNewPinSubmissionWithAdjustments,
          variant: sampleCatalogVariant,
          recipientFirstName: ctx.name,
          assetsBaseUrl: ctx.assetsBaseUrl,
          wordmarkSrc: ctx.wordmarkSrc,
        }),
    },
    {
      id: "submission-link-verified",
      group: "Submissions",
      label: "Link verified",
      subject: linkVerificationApprovedEmailSubject(
        sampleLinkVerificationSubmission,
        sampleCatalogVariant,
      ),
      description: "Vault pin linked to an existing catalog listing — no new entry created.",
      minHeight: 880,
      render: ctx =>
        linkVerificationApprovedEmailHtml({
          row: sampleLinkVerificationSubmission,
          variant: {
            ...sampleCatalogVariant,
            design_name: "Grogu",
            artist_name: "Disney",
          },
          recipientFirstName: ctx.name,
          assetsBaseUrl: ctx.assetsBaseUrl,
          wordmarkSrc: ctx.wordmarkSrc,
        }),
    },
    {
      id: "submission-catalog-rejected",
      group: "Submissions",
      label: "Catalog rejected",
      subject: submissionRejectedEmailSubject(sampleRejectedSubmission),
      description: "New catalog submission not approved.",
      minHeight: 920,
      render: ctx =>
        submissionRejectedEmailHtml({
          row: sampleRejectedSubmission,
          recipientFirstName: ctx.name,
          assetsBaseUrl: ctx.assetsBaseUrl,
          wordmarkSrc: ctx.wordmarkSrc,
        }),
    },
    {
      id: "submission-link-rejected",
      group: "Submissions",
      label: "Link not verified",
      subject: submissionRejectedEmailSubject(sampleLinkRejectedSubmission),
      description: "Link verification failed — catalog link removed from vault pin.",
      minHeight: 920,
      render: ctx =>
        submissionRejectedEmailHtml({
          row: sampleLinkRejectedSubmission,
          recipientFirstName: ctx.name,
          assetsBaseUrl: ctx.assetsBaseUrl,
          wordmarkSrc: ctx.wordmarkSrc,
        }),
    },
  ];
}

function EmailFrame({
  title,
  html,
  minHeight,
}: {
  title: string;
  html: string;
  minHeight: number;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-medium text-navy">{title}</h3>
      <iframe
        title={title}
        srcDoc={html}
        className="w-full rounded-lg border border-gold-deco/30 bg-white shadow-lg"
        style={{ minHeight }}
      />
    </section>
  );
}

export function EmailPreviewTabs({
  name,
  wordmarkSrc,
  assetsBaseUrl,
}: EmailPreviewContext) {
  const tabs = useMemo(() => buildTabs(), []);
  const [activeId, setActiveId] = useState<TabId>("submission-link-verified");

  const activeTab = tabs.find(tab => tab.id === activeId) ?? tabs[0];
  const ctx = { name, wordmarkSrc, assetsBaseUrl };
  const rendered = activeTab.render(ctx);

  const betaTabs = tabs.filter(tab => tab.group === "Beta");
  const submissionTabs = tabs.filter(tab => tab.group === "Submissions");

  return (
    <div>
      <div className="mb-6 max-w-3xl space-y-4">
        <p className="text-sm text-foreground-accent">
          Local dev only. Transactional submission templates mirror{" "}
          <code className="text-xs">pinporium/supabase/functions/_shared/email/</code>.
        </p>
      </div>

      <div className="mb-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-accent">
          Beta
        </p>
        <div className="flex flex-wrap gap-2">
          {betaTabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeId === tab.id
                  ? "bg-secondary text-white"
                  : "bg-cream/80 text-navy border border-gold-deco/40 hover:bg-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-accent pt-2">
          Submissions
        </p>
        <div className="flex flex-wrap gap-2">
          {submissionTabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveId(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeId === tab.id
                  ? "bg-secondary text-white"
                  : "bg-cream/80 text-navy border border-gold-deco/40 hover:bg-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 max-w-3xl rounded-lg border border-gold-deco/40 bg-cream/80 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-foreground-accent mb-1">
          Subject
        </p>
        <p className="text-navy font-medium">{activeTab.subject}</p>
        {activeTab.description ? (
          <p className="mt-2 text-sm text-foreground-accent">{activeTab.description}</p>
        ) : null}
      </div>

      {typeof rendered === "string" ? (
        <EmailFrame title={activeTab.label} html={rendered} minHeight={activeTab.minHeight} />
      ) : (
        <div className="grid gap-10 lg:grid-cols-2">
          {platforms.map(platform => (
            <EmailFrame
              key={platform}
              title={platform === "ios" ? "iPhone" : "Android"}
              html={rendered[platform]}
              minHeight={activeTab.minHeight}
            />
          ))}
        </div>
      )}
    </div>
  );
}
