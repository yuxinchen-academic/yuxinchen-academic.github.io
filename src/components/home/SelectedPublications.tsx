'use client';

import Link from 'next/link';
import type { Publication } from '@/types/publication';
import { useMessages } from '@/lib/i18n/useMessages';
import { groupPublications } from '@/lib/publicationOrder';
import PublicationCard from '@/components/publications/PublicationCard';

interface SelectedPublicationsProps {
  publications: Publication[];
  title?: string;
  enableOnePageMode?: boolean;
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false }: SelectedPublicationsProps) {
  const messages = useMessages();
  const groups = groupPublications(publications);

  return (
    <section className="min-w-0">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-serif text-2xl font-bold text-primary">{title || messages.home.selectedPublications}</h2>
        <Link href={enableOnePageMode ? '/#publications' : '/publications'} className="text-sm font-medium text-accent hover:underline">{messages.home.viewAll} →</Link>
      </div>
      <p className="mb-5 text-xs text-neutral-500">* Equal contribution; † Corresponding author.</p>
      <div className="space-y-7">
        {groups.map(group => (
          <section key={group.category} aria-label={group.category}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">{group.category}</h3>
            <div className="space-y-4">{group.publications.map(pub => <PublicationCard key={pub.id} publication={pub} compact />)}</div>
          </section>
        ))}
      </div>
    </section>
  );
}
