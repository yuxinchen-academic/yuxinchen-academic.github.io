'use client';

import { useMemo, useState } from 'react';
import type { Publication } from '@/types/publication';
import type { PublicationPageConfig } from '@/types/page';
import { groupPublications } from '@/lib/publicationOrder';
import { useMessages } from '@/lib/i18n/useMessages';
import PublicationCard from './PublicationCard';

interface PublicationsListProps {
  config: PublicationPageConfig;
  publications: Publication[];
  embedded?: boolean;
}

export default function PublicationsList({ config, publications, embedded = false }: PublicationsListProps) {
  const messages = useMessages();
  const [year, setYear] = useState('all');
  const [category, setCategory] = useState('all');
  const years = useMemo(() => Array.from(new Set(publications.map(pub => pub.year))).sort((a, b) => b - a), [publications]);
  const categories = useMemo(() => groupPublications(publications).map(group => group.category), [publications]);
  const filtered = useMemo(() => publications.filter(pub => {
    return (year === 'all' || pub.year === Number(year))
      && (category === 'all' || (pub.category || 'Other Research') === category);
  }), [publications, year, category]);
  const groups = useMemo(() => groupPublications(filtered), [filtered]);
  const Heading = embedded ? 'h2' : 'h1';
  const filterClass = 'min-w-0 rounded-lg border border-neutral-200 bg-background px-3 py-2.5 text-sm text-neutral-600 focus:outline-2 focus:outline-accent';

  return (
    <div className="min-w-0">
      <div className="mb-8">
        <Heading className={`${embedded ? 'text-2xl' : 'text-4xl'} mb-3 font-serif font-bold text-primary`}>{config.title}</Heading>
        {config.description && <p className="max-w-2xl text-base leading-relaxed text-neutral-600">{config.description}</p>}
        <p className="mt-3 text-xs leading-relaxed text-neutral-500">Grouped by research area. First-author work, followed by co-first-author work, then other collaborations. * Equal contribution; † Corresponding author.</p>
      </div>
      <div className="mb-8 flex flex-wrap gap-3">
        <label className="min-w-0 grow sm:grow-0">
          <span className="sr-only">Filter by research area</span>
          <select value={category} onChange={event => setCategory(event.target.value)} className={`${filterClass} w-full sm:max-w-72`}>
            <option value="all">All research areas</option>
            {categories.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="min-w-0 grow sm:grow-0">
          <span className="sr-only">Filter by publication year</span>
          <select value={year} onChange={event => setYear(event.target.value)} className={`${filterClass} w-full`}>
            <option value="all">All years</option>
            {years.map(item => <option key={item} value={String(item)}>{item}</option>)}
          </select>
        </label>
      </div>
      <p role="status" className="sr-only">{filtered.length} publications found.</p>
      {groups.length ? (
        <div className="space-y-10">
          {groups.map(group => (
            <section key={group.category} aria-label={group.category} className="min-w-0">
              <h2 className="mb-4 border-b border-neutral-200 pb-3 font-serif text-xl font-bold text-primary">{group.category}</h2>
              <div className="space-y-4">{group.publications.map(pub => <PublicationCard key={pub.id} publication={pub} />)}</div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 px-5 py-12 text-center">
          <p className="text-neutral-500">{messages.publications.noResults}</p>
          <button type="button" onClick={() => { setYear('all'); setCategory('all'); }} className="mt-3 text-sm font-medium text-accent hover:underline">Clear filters</button>
        </div>
      )}
    </div>
  );
}
