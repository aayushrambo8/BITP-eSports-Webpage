import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Crosshair,
  Gamepad2,
  Globe2,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | Xordium 5.0',
  description: 'Get to know Xordium 5.0, BIT’s campus esports festival built around competition and community.',
};

const values = [
  {
    index: '01',
    icon: Crosshair,
    title: 'COMPETITION, WITH PURPOSE',
    description: 'A stage for campus players to challenge themselves, represent their teams, and play at their best.',
    accent: 'red',
  },
  {
    index: '02',
    icon: Users,
    title: 'A COMMUNITY IN PLAY',
    description: 'Players, fans, first-timers, and friends all have a place in the Xordium crowd.',
    accent: 'cyan',
  },
  {
    index: '03',
    icon: Globe2,
    title: 'BUILT AROUND CAMPUS',
    description: 'A student-powered festival made for the energy, imagination, and spirit of BIT.',
    accent: 'red',
  },
];

const principles = [
  { icon: Gamepad2, title: 'FIND YOUR GAME', text: 'Explore the event directory and discover the competitions that interest you.' },
  { icon: ShieldCheck, title: 'PLAY WITH RESPECT', text: 'Help keep the event welcoming for teams, spectators, and first-time players.' },
  { icon: Users, title: 'MAKE IT A TEAM EFFORT', text: 'Bring your friends, support your squad, and celebrate good play.' },
];

export default function AboutPage() {
  return (
    <main className="xp-page xp-inner-page">
      <section className="xp-about-masthead">
        <div>
          <p className="xp-kicker"><span /> BIT / ESPORTS COMMUNITY <i>·</i> ABOUT XORDIUM</p>
          <h1>ABOUT <span>XORDIUM 5.0</span></h1>
          <p className="xp-about-subtitle">{'// CAMPUS GAMING. SHARED CULTURE. ONE FESTIVAL.'}</p>
          <p className="xp-about-lede">
            Xordium brings competition and campus community together—making space for players to step up and for everyone to be part of the moment.
          </p>
        </div>
        <aside className="xp-about-stamp">
          <span>THE FESTIVAL</span>
          <strong>BIT<span>·</span>XP</strong>
          <small>IGNITE × ESPORTS</small>
        </aside>
      </section>

      <section className="xp-about-story">
        <div className="xp-about-photo" aria-hidden="true">
          <Image src="/art/neon-runner.svg" alt="" fill priority sizes="(max-width: 760px) 100vw, 42vw" />
          <span className="xp-about-photo-caption"><i /> XORDIUM 5.0 / CAMPUS IN PLAY</span>
        </div>
        <div className="xp-about-story-copy">
          <p className="xp-kicker xp-kicker-red"><span /> WHY WE PLAY / 01</p>
          <h2>“THE BEST PART<br />IS <span>PLAYING TOGETHER.</span>”</h2>
          <p>
            Xordium is more than a bracket or a final score. It’s the energy of a room full of people who care about the game—teams testing their skill, friends cheering them on, and new faces finding their community.
          </p>
          <p>
            Built around BIT’s student esports culture, the festival brings those moments together under one roof and gives everyone a reason to join in.
          </p>
          <Link className="xp-text-link" href="/events">DISCOVER THE FESTIVAL <ArrowRight size={14} /></Link>
          <div className="xp-about-tags"><span>CAMPUS-LED</span><span>PLAYER-FOCUSED</span><span>OPEN TO THE COMMUNITY</span></div>
        </div>
      </section>

      <section className="xp-about-values">
        <div className="xp-section-heading">
          <div>
            <p className="xp-kicker xp-kicker-cyan"><span /> WHAT BRINGS US TOGETHER</p>
            <h2>THE XORDIUM <span>SPIRIT</span></h2>
          </div>
          <p className="xp-about-section-note">Different games. Different playstyles. One campus community.</p>
        </div>
        <div className="xp-value-grid">
          {values.map(({ index, icon: Icon, title, description, accent }) => (
            <article className={`xp-value-card xp-value-${accent}`} key={index}>
              <div className="xp-value-card-top"><span>{index} / PRINCIPLE</span><Icon size={17} /></div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="xp-value-line" />
            </article>
          ))}
        </div>
      </section>

      <section className="xp-about-principles">
        <div className="xp-section-heading">
          <div>
            <p className="xp-kicker xp-kicker-red"><span /> THE PLAYER EXPERIENCE / FIELD GUIDE</p>
            <h2>GOOD GAMES. <span>GOOD ENERGY.</span></h2>
          </div>
        </div>
        <div className="xp-principle-grid">
          {principles.map(({ icon: Icon, title, text }, index) => (
            <article className="xp-principle-card" key={title}>
              <span className="xp-principle-index">0{index + 1}</span>
              <Icon size={19} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="xp-campus-info">
        <div className="xp-campus-info-copy">
          <p className="xp-kicker xp-kicker-cyan"><span /> COORDINATES / CAMPUS NODE</p>
          <h2>BIRLA INSTITUTE<br />OF <span>TECHNOLOGY</span></h2>
          <p className="xp-campus-institution">MESRA CAMPUS <i>·</i> RANCHI, JHARKHAND</p>
          <p>Xordium is a BIT campus esports festival. The venue and arrival information for each activity will be listed with its event details.</p>
          <Link className="xp-text-link" href="/events">CHECK EVENT DETAILS <ArrowUpRight size={14} /></Link>
        </div>
        <div className="xp-campus-info-image" aria-hidden="true">
          <Image src="/art/xordium-city.svg" alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
          <span><MapPin size={14} /> BIT MESRA / RANCHI</span>
        </div>
      </section>

      <section className="xp-about-cta">
        <div>
          <p className="xp-kicker"><span /> COME BE PART OF IT</p>
          <h2>READY TO <span>PLAY?</span></h2>
          <p>Explore the line-up or talk to the Xordium team.</p>
        </div>
        <div className="xp-about-cta-actions">
          <Link className="xp-button xp-button-red" href="/events">EXPLORE EVENTS <ArrowRight size={15} /></Link>
          <Link className="xp-button xp-button-outline" href="/contact">GET IN TOUCH <ArrowUpRight size={14} /></Link>
        </div>
      </section>
    </main>
  );
}
