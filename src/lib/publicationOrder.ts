import type { Publication } from '@/types/publication';

const authorRank = { first: 0, 'co-first': 1, other: 2 };
const categoryOrder = [
  'Embodied AI & Robot Learning',
  'Generative Models & Image Editing',
  'Image Generation & Editing',
  'Visual Perception',
  'Vision-Language Models & Safety',
];

function monthNumber(month?: string): number {
  if (!month) return 0;
  const number = Number(month);
  if (Number.isFinite(number)) return number;
  const names = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return names.indexOf(month.slice(0, 3).toLowerCase()) + 1;
}

/** Authorship has priority over recency; title makes same-date order deterministic. */
export function comparePublications(a: Publication, b: Publication): number {
  return authorRank[a.authorship || 'other'] - authorRank[b.authorship || 'other']
    || b.year - a.year
    || monthNumber(b.month) - monthNumber(a.month)
    || a.title.localeCompare(b.title);
}

export function groupPublications(publications: Publication[]) {
  const groups = new Map<string, Publication[]>();
  for (const publication of [...publications].sort(comparePublications)) {
    const category = publication.category || 'Other Research';
    const group = groups.get(category) || [];
    group.push(publication);
    groups.set(category, group);
  }
  const rank = (category: string) => {
    const index = categoryOrder.indexOf(category);
    return index === -1 ? categoryOrder.length : index;
  };
  return Array.from(groups, ([category, items]) => ({ category, publications: items }))
    .sort((a, b) => rank(a.category) - rank(b.category) || a.category.localeCompare(b.category));
}
