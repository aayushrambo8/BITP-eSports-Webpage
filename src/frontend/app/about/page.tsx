'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useEsportsModal } from '@/context/ModalContext';
import { 
  CLUB_PILLARS, ABOUT_PAGE_ASSETS, CONTACT_INFO, type ClubOfficer,
  localResourceImage,
} from '@/data/esportsData';
import { 
  Gamepad2, Users, Video, Monitor, Calendar, MessageSquare, 
  Info, ExternalLink, ShieldCheck, Cpu 
} from 'lucide-react';

export default function AboutPage() {
  const { openModal, playTacticalSound } = useEsportsModal();
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

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {officers.map((officer) => (
            <div
              key={officer.name}
              className="border border-[#33343b] bg-[#191b22] flex flex-col justify-between hover:border-[#cdf200] transition-colors"
            >
              <div className="h-64 bg-[#111319] relative border-b border-[#33343b] overflow-hidden group">
                <img
                  src={localResourceImage(officer.imageUrl, '/resources/people/default-avatar.svg')}
                  alt={officer.name}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-[#0c0e14] border border-[#33343b] px-1.5 py-0.5">
                  <span className="font-label-mono-sm text-[#cdf200] text-xs">{officer.tag}</span>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <span className="font-label-mono-sm text-[#cdf200] uppercase block text-xs">
                  {officer.role}
                </span>
                <h3 className="font-headline-sm uppercase text-white">{officer.name}</h3>
                <p className="font-body-sm text-[#8f96a3]">{officer.yearMajor}</p>
                <div className="pt-2 border-t border-[#33343b]/50 text-[11px] font-label-mono-sm text-[#8f96a3]">
                  Discord: {officer.discord}
                </div>
              </div>
            </div>
          ))}
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
