'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useEsportsModal } from '@/context/ModalContext';
import { 
  CLUB_PILLARS, ABOUT_PAGE_ASSETS, CONTACT_INFO, type ClubOfficer,
  localResourceImage,
} from '@/data/esportsData';
import { 
  Calendar, ChevronLeft, ChevronRight, Gamepad2, MessageSquare,
} from 'lucide-react';

const carouselOffsets = [-1, 0, 1, 2] as const;

function OfficerCarousel({ title, officers }: { title: string; officers: ClubOfficer[] }) {
  const [index, setIndex] = useState(0);
  const sortedOfficers = useMemo(
    () => [...officers].sort((left, right) => left.name.localeCompare(right.name, 'en', { sensitivity: 'base' })),
    [officers]
  );

  const move = (direction: -1 | 1) => {
    setIndex((current) => (current + direction + sortedOfficers.length) % sortedOfficers.length);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#33343b] pb-3">
        <h3 className="font-headline-md uppercase text-white">{title}</h3>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={`Previous ${title.toLowerCase()}`}
            onClick={() => move(-1)}
            disabled={sortedOfficers.length < 2}
            className="border border-[#33343b] bg-[#191b22] p-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label={`Next ${title.toLowerCase()}`}
            onClick={() => move(1)}
            disabled={sortedOfficers.length < 2}
            className="border border-[#33343b] bg-[#191b22] p-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      {sortedOfficers.length === 0 ? (
        <p className="border border-[#33343b] bg-[#0c0e14] p-5 text-sm text-[#8f96a3]">
          No {title.toLowerCase()} profiles have been added yet.
        </p>
      ) : (
        <div className="relative h-[25rem] overflow-hidden sm:h-[31rem] lg:h-auto lg:aspect-[8/5]" aria-roledescription="carousel">
          {carouselOffsets.map((offset) => {
            const officerIndex = (index + offset + sortedOfficers.length) % sortedOfficers.length;
            const officer = sortedOfficers[officerIndex];
            return (
              <article
                key={`${offset}-${officer.id}`}
                aria-hidden={offset === -1 || offset === 2}
                className="absolute top-0 w-[37.5%] border border-[#33343b] bg-[#191b22]"
                style={{ left: `${12.5 + offset * 37.5}%` }}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#111319]">
                  <Image
                    src={officer.photoUrl ?? localResourceImage(officer.imageUrl, '/resources/people/default-avatar.svg')}
                    alt={officer.name}
                    fill
                    sizes="(max-width: 768px) 38vw, 450px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="min-h-24 border-t border-[#33343b] p-3 sm:p-4">
                  <h4 className="truncate font-headline-sm uppercase text-white">{officer.name}</h4>
                  <p className="mt-1 truncate font-label-mono-sm text-xs uppercase text-[#cdf200]">{officer.role}</p>
                  <p className="mt-1 truncate text-xs text-[#8f96a3]">Roll No: {officer.rollNo}</p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function AboutPage() {
  const { playTacticalSound } = useEsportsModal();
  const [officers, setOfficers] = useState<ClubOfficer[]>([]);

  useEffect(() => {
    let active = true;
    void fetch('/api/officers', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unable to load committee information.');
        const data = await response.json();
        if (active && Array.isArray(data.officers)) setOfficers(data.officers);
      })
      .catch((error: unknown) => {
        console.error('Unable to refresh officers:', error instanceof Error ? error.name : 'Unknown error');
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="flex-grow w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 space-y-16">
      {/* 1. PAGE HEADER & STORY SECTION */}
      <section className="border border-[#33343b] bg-[#0c0e14] p-6 sm:p-8 md:p-12 relative overflow-hidden tactical-grid-bg">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#1d1f26] border border-[#33343b] px-3 py-1">
              <span className="w-2 h-2 bg-[#cdf200]"></span>
              <span className="font-label-mono-sm text-[#cdf200] uppercase tracking-wider text-xs">
                OFFICIAL CHARTERED STUDENT ORGANIZATION
              </span>
            </div>
            <h1 className="font-headline-xl text-white uppercase tracking-tight leading-none text-4xl sm:text-5xl md:text-6xl">
              STUDENT RUN.
              <span className="text-[#cdf200]"> CAMPUS BUILT.</span>
            </h1>
            <p className="font-body-lg text-[#8f96a3] max-w-2xl leading-relaxed">
              BITPeSports is the official competitive gaming and esports student organization on campus.
            </p>
          </div>
        </div>

        {/* Configurable campus photo assets are in the frontend data module. */}
        <div className="mt-10 border border-[#33343b] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#33343b] bg-[#111319]">
          {/* Photo 1 */}
          <div className="relative h-64 overflow-hidden group">
            <img
              src={ABOUT_PAGE_ASSETS.photo1}
              alt="Esports arena"
              className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Photo 2 */}
          <div className="relative h-64 overflow-hidden group">
            <img
              src={ABOUT_PAGE_ASSETS.photo2}
              alt="Livestream broadcast studio"
              className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Photo 3 */}
          <div className="relative h-64 overflow-hidden group">
            <img
              src={ABOUT_PAGE_ASSETS.photo3}
              alt="Campus gaming"
              className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* 2. CLUB PILLARS / WHAT WE DO */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#33343b] pb-3">
          <div>
            <span className="font-label-mono-sm text-[#cdf200] uppercase text-xs">CORE PURPOSE</span>
            <h2 className="font-headline-lg uppercase text-white">WHAT WE DO // CLUB PILLARS</h2>
          </div>
          <span className="font-label-mono-sm text-[#8f96a3] hidden sm:inline-block text-xs">
            PROGRAM ARCHITECTURE [4 STACKS]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CLUB_PILLARS.map((pillar) => (
            <div
              key={pillar.code}
              className="border border-[#33343b] bg-[#191b22] p-6 flex flex-col justify-between hover:border-[#cdf200] transition-colors duration-150 group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-label-mono-sm text-[#cdf200] text-xs font-bold">{pillar.code}</span>
                  <Gamepad2 className="w-5 h-5 text-[#8f96a3] group-hover:text-[#cdf200] transition-colors" />
                </div>
                <h3 className="font-headline-sm uppercase text-white">{pillar.title}</h3>
                <p className="font-body-sm text-[#8f96a3] leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#33343b] flex items-center justify-between text-[#8f96a3] font-label-mono-sm text-xs">
                <span>{pillar.metaLeft}</span>
                <span className="text-[#cdf200]">{pillar.metaRight}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXECUTIVE BOARD & OFFICERS */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#33343b] pb-3">
          <div>
            <span className="font-label-mono-sm text-[#cdf200] uppercase text-xs">STUDENT LEADERSHIP</span>
            <h2 className="font-headline-lg uppercase text-white">EXECUTIVE BOARD & OFFICERS</h2>
          </div>
          <span className="font-label-mono-sm text-[#8f96a3] text-xs">ELECTED BY MEMBERSHIP</span>
        </div>

        <div className="space-y-10">
          <OfficerCarousel title="President" officers={officers.filter((officer) => officer.role.trim().toLowerCase() === 'president')} />
          <OfficerCarousel title="Senior Coordinator" officers={officers.filter((officer) => officer.role.trim().toLowerCase() === 'senior coordinator')} />
          <OfficerCarousel title="Junior Coordinator" officers={officers.filter((officer) => officer.role.trim().toLowerCase() === 'junior coordinator')} />
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="border-2 border-[#cdf200] bg-[#0c0e14] p-8 md:p-16 text-center space-y-4 relative">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="font-label-mono-sm text-[#cdf200] uppercase tracking-widest block text-xs">
            JOIN THE COMMUNITY
          </span>
          <h2 className="font-headline-xl uppercase text-white leading-tight">
            WANT TO GET INVOLVED?
          </h2>
          <p className="font-body-md text-[#8f96a3] leading-relaxed">
            Join our weekly general body meetings or drop into our Discord. Whether you&apos;re looking to compete on varsity, learn stream production, or just play casual games after class, you have a spot here.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <a
            className="bg-[#cdf200] text-[#0a0b0e] font-label-caps px-8 py-3.5 uppercase font-bold tracking-wider hover:bg-white transition-colors flex items-center gap-2 text-sm"
            href={CONTACT_INFO.discordUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => playTacticalSound('click')}
          >
            <MessageSquare className="w-4 h-4" />
            <span>JOIN THE CLUB DISCORD</span>
          </a>
          <Link
            className="border border-[#33343b] bg-[#191b22] text-white font-label-caps px-8 py-3.5 uppercase font-bold tracking-wider hover:border-white transition-colors flex items-center gap-2 text-sm"
            href="/events"
            onClick={() => playTacticalSound('click')}
          >
            <Calendar className="w-4 h-4 text-[#cdf200]" />
            <span>VIEW EVENTS SCHEDULE</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
