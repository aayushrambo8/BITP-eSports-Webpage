<<<<<<< HEAD
import Link from 'next/link';
import { ArrowUpRight, Radio } from 'lucide-react';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'About Xordium', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="xp-footer">
      <div className="xp-footer-inner">
        <div className="xp-footer-main">
          <div>
            <Link className="xp-brand" href="/">
              <span className="xp-brand-mark">X<span>.</span></span>
              <span className="xp-brand-copy">
                <span>XORDIUM <strong>5.0</strong></span>
                <small>IGNITE × ESPORTS · BIT</small>
              </span>
            </Link>
            <p className="xp-footer-description">A campus festival for players, fans, and the people who bring them together.</p>
          </div>
          <div className="xp-footer-column">
            <span className="xp-footer-label">EXPLORE</span>
            {links.map(({ label, href }) => <Link href={href} key={href}>{label}</Link>)}
          </div>
          <div className="xp-footer-column">
            <span className="xp-footer-label">GET INVOLVED</span>
            <Link href="/events">Event briefing <ArrowUpRight size={13} /></Link>
            <Link href="/contact">Contact the organizers <ArrowUpRight size={13} /></Link>
          </div>
          <div className="xp-footer-column xp-footer-status">
            <span className="xp-footer-label">FESTIVAL SIGNAL</span>
            <span><Radio size={13} /> XORDIUM 5.0</span>
            <span>Birla Institute of Technology</span>
            <span>Ranchi, Jharkhand</span>
          </div>
        </div>
        <div className="xp-footer-bottom">
          <span>© XORDIUM 5.0 · IGNITE × ESPORTS · BIT</span>
          <span>MADE FOR CAMPUS. BUILT AROUND PLAY.</span>
=======
'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#262a36] bg-[#0c0e14] py-8 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto mt-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Brand */}
        <div className="space-y-1">
          <Link href="/" className="font-headline-sm uppercase text-white font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#88c425]"></span>
            <span className="normal-case">BITPeSports</span>
          </Link>
          <p className="font-body-sm text-[#94a3b8]">
            Official Student Esports & Gaming Community
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-label-caps">
          <Link href="/" className="text-[#94a3b8] hover:text-[#88c425] transition-colors">
            Home
          </Link>
          <Link href="/events" className="text-[#94a3b8] hover:text-[#88c425] transition-colors">
            Events
          </Link>
          <Link href="/about" className="text-[#94a3b8] hover:text-[#88c425] transition-colors">
            About Us
          </Link>
          <Link href="/contact" className="text-[#94a3b8] hover:text-[#88c425] transition-colors">
            Contact
          </Link>
          <a
            href="https://discord.gg/rXHBTSDkcf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#94a3b8] hover:text-[#88c425] transition-colors"
          >
            Discord
          </a>
          <a
            href="https://www.instagram.com/bitpesports.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#94a3b8] hover:text-[#88c425] transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>

      <div className="border-t border-[#1e222b] mt-6 pt-4 text-xs font-body-sm text-[#64748b] flex flex-col sm:flex-row justify-between items-center gap-2">
        <div>© 2025 <span className="normal-case">BITPeSports</span>. All rights reserved.</div>
        <div className="font-label-mono-sm text-[11px] text-[#64748b]">
          EA FC • VALORANT • FREE FIRE • BGMI
>>>>>>> origin/main
        </div>
      </div>
    </footer>
  );
}
