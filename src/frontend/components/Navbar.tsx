'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="xp-header">
      <div className="xp-header-inner">
        <Link className="xp-brand" href="/" aria-label="Xordium 5.0 home" onClick={() => setMenuOpen(false)}>
          <span className="xp-brand-mark">X<span>.</span></span>
          <span className="xp-brand-copy">
            <span>XORDIUM <strong>5.0</strong><i>{'// ゾルディウム'}</i></span>
            <small>IGNITE × ESPORTS · BIT</small>
          </span>
        </Link>
        <div className="xp-header-status"><span /> CAMPUS ESPORTS FESTIVAL</div>
        <nav className={`xp-nav${menuOpen ? ' is-open' : ''}`} id="site-navigation" aria-label="Main navigation">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                aria-current={active ? 'page' : undefined}
                className={`xp-nav-link${active ? ' is-active' : ''}`}
                href={href}
                key={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          <Link className="xp-mobile-portal" href="/events" onClick={() => setMenuOpen(false)}>Explore events <ArrowUpRight size={15} /></Link>
        </nav>
        <div className="xp-header-actions">
          <Link className="xp-portal-button" href="/events">EVENT BRIEFING <ArrowUpRight size={14} /></Link>
          <button
            aria-controls="site-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="xp-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>
    </header>
  );
}
