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
        </div>
      </div>
    </footer>
  );
}
