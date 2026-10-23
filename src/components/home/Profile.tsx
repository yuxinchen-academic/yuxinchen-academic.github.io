'use client';

import Image from 'next/image';
import { AcademicCapIcon, MapPinIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Github, ArrowUpRight } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import { assetPath } from '@/lib/assetPath';

interface ProfileProps {
  author: SiteConfig['author'];
  social: SiteConfig['social'];
  features: SiteConfig['features'];
  researchInterests?: string[];
}

export default function Profile({ author, social, researchInterests }: ProfileProps) {
  return (
    <aside className="lg:sticky lg:top-28">
      <div className="relative w-56 h-64 mx-auto lg:mx-0 mb-7 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
        {author.avatar ? (
          <Image src={assetPath(author.avatar)} alt={author.name} width={448} height={512}
            className="absolute left-[-17.5%] top-[-17.5%] h-[135%] w-[135%] max-w-none object-cover object-[45%_50%]" priority />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-[#eae7df] text-[#283a49]" aria-label="Yuxin Chen initials">
            <span className="font-serif text-7xl tracking-tight">YC</span>
            <span className="mt-5 text-[10px] tracking-[0.32em] uppercase">Yuxin Chen</span>
          </div>
        )}
      </div>
      <div className="text-center lg:text-left">
        <h1 className="text-4xl font-serif font-bold text-primary tracking-tight mb-3">{author.name}</h1>
        <p className="text-sm text-accent font-medium mb-3">{author.title}</p>
        <p className="text-sm leading-relaxed text-neutral-600 max-w-[280px] mx-auto lg:mx-0">{author.institution}</p>
        {social.location && <p className="flex items-center justify-center lg:justify-start gap-1.5 mt-3 text-sm text-neutral-500"><MapPinIcon className="h-4 w-4" />{social.location}</p>}
      </div>
      <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3">
        {social.google_scholar && <a className="profile-link" href={social.google_scholar} target="_blank" rel="noopener noreferrer"><AcademicCapIcon className="h-4 w-4" />Scholar<ArrowUpRight className="h-3 w-3" /></a>}
        {social.github && <a className="profile-link" href={social.github} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" />GitHub<ArrowUpRight className="h-3 w-3" /></a>}
      </div>
      {social.email && <div className="mt-5 flex items-start justify-center lg:justify-start gap-2 text-xs text-neutral-600"><EnvelopeIcon className="h-4 w-4 shrink-0" /><span className="break-all select-all">{social.email}</span></div>}
      {!!researchInterests?.length && <div className="mt-8 pt-5 border-t border-neutral-200">
        <h2 className="text-[11px] uppercase tracking-[0.16em] text-neutral-500 font-semibold mb-4">Research interests</h2>
        <ul className="space-y-2.5 text-sm text-neutral-600">{researchInterests.map(interest => <li key={interest}>{interest}</li>)}</ul>
      </div>}
    </aside>
  );
}
