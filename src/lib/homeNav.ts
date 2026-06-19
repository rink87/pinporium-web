/** Hash links to homepage sections — use `/#id` so they work from any route. */
export function homeSectionAnchor(section: string): string {
  const id = section.startsWith("#") ? section.slice(1) : section;
  return `/#${id}`;
}
