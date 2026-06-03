import { Fragment } from "react";

/** Renders `**bold**` segments from release note copy. */
export function renderBoldMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.+?\*\*)/g);
  return parts.map((part, index) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) {
      return <strong key={index}>{bold[1]}</strong>;
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function formatReleaseNoteDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
