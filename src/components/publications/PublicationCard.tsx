'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRightIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import type { Publication } from '@/types/publication';
import { assetPath } from '@/lib/assetPath';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from './FormattedBibTeXText';

interface PublicationCardProps {
  publication: Publication;
  compact?: boolean;
}

const actionClass = 'inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export default function PublicationCard({ publication: pub, compact = false }: PublicationCardProps) {
  const messages = useMessages();
  const [showBibtex, setShowBibtex] = useState(false);
  const [showAbstract, setShowAbstract] = useState(false);
  const [copyStatus, setCopyStatus] = useState('');
  const citationRef = useRef<HTMLTextAreaElement>(null);
  const paperUrl = pub.url || pub.pdfUrl || (pub.doi ? `https://doi.org/${pub.doi}` : undefined);
  const previewPath = pub.preview && (/^(?:https?:|\/)/.test(pub.preview) ? pub.preview : `/papers/${pub.preview}`);
  const venue = pub.conference || pub.journal || 'Preprint';
  const Heading = compact ? 'h4' : 'h3';

  async function copyCitation() {
    if (!pub.bibtex) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(pub.bibtex);
      setCopyStatus('Citation copied.');
    } catch {
      citationRef.current?.focus();
      citationRef.current?.select();
      setCopyStatus('Citation selected. Press Ctrl+C or Command+C to copy, or use your device’s Copy command.');
    }
  }

  return (
    <article className={`min-w-0 rounded-xl border border-neutral-200 bg-background ${compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6'}`}>
      <div className={`flex flex-col ${compact ? 'sm:flex-row' : 'md:flex-row'} gap-5`}>
        {previewPath && (
          <div className={`relative aspect-[16/10] shrink-0 overflow-hidden rounded-lg bg-white ${compact ? 'sm:w-36 sm:self-start' : 'md:w-48 md:self-start'}`}>
            <Image src={assetPath(previewPath)} alt={`Overview of ${pub.title}`} fill className="object-contain p-1" sizes={compact ? '(max-width: 640px) 90vw, 144px' : '(max-width: 768px) 90vw, 192px'} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
            <span className="font-medium text-neutral-500">{venue}{!venue.includes(String(pub.year)) && ` · ${pub.year}`}</span>
            {pub.authorship && pub.authorship !== 'other' && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-medium text-accent-dark dark:text-accent">{pub.authorship === 'first' ? 'First author' : 'Co-first author'}</span>
            )}
          </div>
          <Heading className={`mb-2 font-semibold leading-snug text-primary ${compact ? 'text-base' : 'text-lg'}`}>
            {paperUrl ? (
              <a href={paperUrl} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"><FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} /></a>
            ) : <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />}
          </Heading>
          <p className="text-sm leading-relaxed text-neutral-600">
            {pub.authors.map((author, index) => (
              <span key={`${author.name}-${index}`}>
                <span className={author.isHighlighted ? 'font-semibold text-primary underline decoration-accent/60 underline-offset-4' : undefined}>{author.name}</span>
                {author.isCoAuthor && <sup title="Equal contribution">*</sup>}
                {author.isCorresponding && <sup title="Corresponding author">†</sup>}
                {index < pub.authors.length - 1 && ', '}
              </span>
            ))}
          </p>
          {pub.description && <p className="mt-2 text-sm leading-relaxed text-neutral-500">{pub.description}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {paperUrl && <a href={paperUrl} target="_blank" rel="noopener noreferrer" className={actionClass}>Paper <ArrowUpRightIcon aria-hidden="true" className="h-3 w-3" /></a>}
            {pub.code && <a href={pub.code} target="_blank" rel="noopener noreferrer" className={actionClass}>Repository <ArrowUpRightIcon aria-hidden="true" className="h-3 w-3" /></a>}
            {pub.project && <a href={pub.project} target="_blank" rel="noopener noreferrer" className={actionClass}>Project <ArrowUpRightIcon aria-hidden="true" className="h-3 w-3" /></a>}
            {pub.abstract && !compact && <button type="button" className={actionClass} aria-expanded={showAbstract} aria-controls={`abstract-${pub.id}`} onClick={() => setShowAbstract(!showAbstract)}>{messages.publications.abstract}</button>}
            {pub.bibtex && !compact && <button type="button" className={actionClass} aria-expanded={showBibtex} aria-controls={`bibtex-${pub.id}`} onClick={() => { setShowBibtex(!showBibtex); setCopyStatus(''); }}>{messages.publications.bibtex}</button>}
          </div>
          {showAbstract && pub.abstract && <div id={`abstract-${pub.id}`} className="mt-4 rounded-lg bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-600">{pub.abstract}</div>}
          {showBibtex && pub.bibtex && (
            <div id={`bibtex-${pub.id}`} className="mt-4 min-w-0 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-neutral-500">BibTeX</span>
                <button type="button" className={actionClass} onClick={copyCitation} aria-label={`Copy citation for ${pub.title}`}><ClipboardDocumentIcon aria-hidden="true" className="h-3.5 w-3.5" /> Copy</button>
              </div>
              <textarea ref={citationRef} readOnly value={pub.bibtex} rows={Math.min(pub.bibtex.split('\n').length + 1, 12)} aria-label={`BibTeX citation for ${pub.title}`} className="block w-full min-w-0 resize-y rounded bg-transparent p-1 font-mono text-xs leading-relaxed text-neutral-600 focus:outline-2 focus:outline-accent" spellCheck={false} />
              <p role="status" className="mt-1 text-xs text-neutral-500">{copyStatus}</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
