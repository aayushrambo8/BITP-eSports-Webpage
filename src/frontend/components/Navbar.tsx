'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEsportsModal } from '@/context/ModalContext';
import { Menu, X, User } from 'lucide-react';
import { CONTACT_INFO } from '@/data/esportsData';

export default function Navbar() {
  const pathname = usePathname();
  const { playTacticalSound } = useEsportsModal();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="w-full border-b border-[#33343b] bg-[#111319] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            onClick={() => playTacticalSound('click')}
            className="font-headline-md tracking-wider uppercase text-[#e2e2ea] font-bold flex items-center gap-2 group hover:text-white transition-colors"
          >
            <span className="w-3 h-3 bg-[#cdf200] inline-block group-hover:scale-110 transition-transform"></span>
            <span>APEX ESPORTS</span>
          </Link>
          <span className="hidden xl:inline-block font-label-mono-sm text-[#8f96a3] border border-[#33343b] px-2 py-0.5">
            EST. 2020 // CAMPUS DIVISION
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => playTacticalSound('click')}
                className={`font-label-caps uppercase tracking-wider py-1 transition-colors duration-150 text-[13px] ${
                  isActive
                    ? 'border-b-2 border-[#cdf200] text-[#cdf200] font-bold'
                    : 'text-[#8f96a3] hover:text-[#e2e2ea]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Trailing Actions: JOIN DISCORD only & LOGIN button */}
        <div className="flex items-center gap-3">
          <a
            href={CONTACT_INFO.discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playTacticalSound('click')}
            className="bg-[#cdf200] text-[#0c0e14] font-label-caps uppercase px-4 py-2 hover:bg-white transition-colors duration-150 font-bold tracking-wider text-[13px]"
          >
            JOIN DISCORD
          </a>

          <Link
            href="/admin"
            className="bg-[#1d1f26] border border-[#33343b] text-[#e2e2ea] px-3.5 py-2 font-label-caps uppercase tracking-wider text-[13px] font-bold hover:border-[#cdf200] hover:text-white transition-colors duration-150 flex items-center gap-1.5"
          >
            <User className="w-3.5 h-3.5 text-[#cdf200]" />
            <span>LOGIN</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              playTacticalSound('click');
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 text-[#8f96a3] hover:text-[#e2e2ea] border border-[#33343b] bg-[#1d1f26]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#33343b] bg-[#0c0e14] px-4 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="font-label-mono-sm text-[#8f96a3] uppercase tracking-wider pb-2 border-b border-[#262a36] flex justify-between">
            <span>TERMINAL NAVIGATION</span>
            <span className="text-[#cdf200]">CAMPUS DIVISION</span>
          </div>
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    playTacticalSound('click');
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2.5 font-headline-sm uppercase tracking-wide border flex items-center justify-between ${
                    isActive
                      ? 'border-[#cdf200] bg-[#1d1f26] text-[#cdf200]'
                      : 'border-[#262a36] bg-[#12141a] text-[#8f96a3] hover:text-[#e2e2ea]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 bg-[#cdf200]"></span>}
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#262a36] flex flex-col gap-2">
            <a
              href={CONTACT_INFO.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-[#cdf200] text-[#0c0e14] py-2.5 font-label-caps font-bold uppercase tracking-wider"
            >
              JOIN DISCORD
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#1d1f26] border border-[#33343b] text-[#e2e2ea] py-2.5 font-label-caps font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4 text-[#cdf200]" />
              <span>ADMIN LOGIN</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
