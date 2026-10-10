'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Gamepad2,
  MapPin,
  Radio,
  Trophy,
  Users,
} from 'lucide-react';
import {
  formatEventTime,
  isEventEndedIST,
  type FestivalGame,
  type TournamentEvent,
} from '@/data/esportsData';

function formatEventDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date to be announced';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

export default function HomePage() {
  const [games, setGames] = useState<FestivalGame[]>([]);
  const [events, setEvents] = useState<TournamentEvent[]>([]);
  const [contentUnavailable, setContentUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    const loadContent = async () => {
      const [eventResponse, gameResponse] = await Promise.all([
        fetch('/api/events', { cache: 'no-store' }),
        fetch('/api/games', { cache: 'no-store' }),
      ]);
      if (!eventResponse.ok || !gameResponse.ok) {
        throw new Error('Event content is temporarily unavailable.');
      }
      const [eventData, gameData]: [
        { events?: TournamentEvent[] },
        { games?: FestivalGame[] },
      ] = await Promise.all([eventResponse.json(), gameResponse.json()]);
      if (!Array.isArray(eventData.events) || !Array.isArray(gameData.games)) {
        throw new Error('Unexpected event content response.');
      }
      if (!active) return;
      setEvents(eventData.events);
      if (gameData.games.length > 0) setGames(gameData.games);
    };

    void loadContent().catch((error: unknown) => {
      if (active) setContentUnavailable(true);
      console.error('Unable to load festival content:', error instanceof Error ? error.name : 'Unknown error');
    });
    return () => {
      active = false;
    };
  }, []);

  const upcomingEvents = useMemo(
    () => events
      .filter((event) => !isEventEndedIST(event))
      .sort((left, right) => new Date(left.isoDate).getTime() - new Date(right.isoDate).getTime()),
    [events],
  );
  const featuredEvent = upcomingEvents[0];
  const briefingEvents = upcomingEvents.slice(0, 3);

  return (
    <main className="xp-page">
      <section className="xp-home-hero">
        <div className="xp-hero-image" aria-hidden="true">
          <Image src="/art/xordium-city.svg" alt="" fill priority sizes="100vw" />
        </div>
        <div className="xp-hero-glow" aria-hidden="true" />
        <div className="xp-home-hero-inner">
          <div className="xp-hero-copy">
            <div className="xp-hero-tags">
              <span className="xp-tag xp-tag-red">XORDIUM PRESENTS</span>
              <span className="xp-tag xp-tag-cyan">CAMPUS ESPORTS FESTIVAL</span>
            </div>
            <h1>XORDIUM <span>5.0</span></h1>
            <p className="xp-hero-jp">IGNITE × ESPORTS <b>·</b> BIT</p>
            <p className="xp-hero-description">
              Campus gaming takes the stage. Find your game, bring your people, and be part of the Xordium 5.0 festival.
            </p>
            <div className="xp-hero-actions">
              <Link className="xp-button xp-button-red" href="/events">EXPLORE EVENTS <ArrowRight size={15} /></Link>
              <Link className="xp-button xp-button-outline" href="/about">ABOUT THE FESTIVAL <ArrowUpRight size={14} /></Link>
            </div>
          </div>

          <aside className="xp-hero-brief" aria-label="Featured event briefing">
            <div className="xp-brief-topline">
              <span><i /> EVENT BRIEFING</span>
              <span className="xp-mono-muted">XORDIUM / 05</span>
            </div>
            {featuredEvent ? (
              <>
                <p className="xp-brief-kicker">{featuredEvent.discipline} <span>·</span> {featuredEvent.statusBadge}</p>
                <h2>{featuredEvent.title}</h2>
                <div className="xp-brief-meta">
                  <span><CalendarDays size={14} />{formatEventDate(featuredEvent.isoDate)}</span>
                  <span><Clock3 size={14} />{formatEventTime(featuredEvent)}</span>
                  <span><MapPin size={14} />{featuredEvent.location}</span>
                </div>
                {featuredEvent.description && <p className="xp-brief-description">{featuredEvent.description}</p>}
              </>
            ) : (
              <>
                <p className="xp-brief-kicker">NEXT UP <span>·</span> CAMPUS FESTIVAL</p>
                <h2>{contentUnavailable ? 'Event schedule unavailable' : 'The next match starts here.'}</h2>
                <p className="xp-brief-description">
                  {contentUnavailable
                    ? 'Connect the event database to show the live briefing.'
                    : 'The event briefing will appear here as soon as the schedule is published.'}
                </p>
              </>
            )}
            <Link className="xp-brief-link" href="/events">OPEN EVENT DIRECTORY <ArrowUpRight size={14} /></Link>
          </aside>
        </div>
        <div className="xp-hero-foot">
          <span>01 <i /> PLAY</span><span>02 <i /> COMPETE</span><span>03 <i /> CONNECT</span>
          <span className="xp-hero-coordinates">BIRLA INSTITUTE OF TECHNOLOGY · RANCHI</span>
        </div>
      </section>

      <section className="xp-metric-strip" aria-label="Festival overview">
        <div className="xp-metric">
          <span className="xp-metric-label"><Trophy size={13} /> UPCOMING EVENTS</span>
          <strong>{String(upcomingEvents.length).padStart(2, '0')}</strong>
          <small>ON THE FESTIVAL CALENDAR</small>
        </div>
        <div className="xp-metric">
          <span className="xp-metric-label"><Gamepad2 size={13} /> GAME TITLES</span>
          <strong>{String(games.length).padStart(2, '0')}</strong>
          <small>WAYS TO FIND YOUR GAME</small>
        </div>
        <div className="xp-metric">
          <span className="xp-metric-label"><Users size={13} /> THE COMMUNITY</span>
          <strong>CAMPUS</strong>
          <small>BUILT BY PLAYERS, FOR PLAYERS</small>
        </div>
        <div className="xp-metric">
          <span className="xp-metric-label"><MapPin size={13} /> LOCATION NODE</span>
          <strong>RANCHI</strong>
          <small>BIRLA INSTITUTE OF TECHNOLOGY</small>
        </div>
      </section>

      <section className="xp-section xp-competitions" id="competitions">
        <div className="xp-section-heading">
          <div>
            <p className="xp-kicker"><span /> THE LINE-UP / GAME TITLES</p>
            <h2>FEATURED <span>COMPETITIONS</span></h2>
            <p className="xp-section-intro">Meet the games bringing campus together. Pick your title, find your squad, and follow the event briefing for updates.</p>
          </div>
          <Link className="xp-text-link" href="/events">ALL EVENTS <ArrowUpRight size={14} /></Link>
        </div>
        <div className="xp-game-grid">
          {games.slice(0, 4).map((game, index) => (
            <article className={`xp-game-card xp-game-card-${index + 1}`} key={game.id}>
              <div className="xp-game-image">
                <span className="xp-game-index">TRACK / 0{index + 1}</span>
                <span className="xp-game-division">{game.divisionBadge}</span>
              </div>
              <div className="xp-game-info">
                <p className="xp-game-tag">{game.tag} <span>·</span> {game.category}</p>
                <h3>{game.name}</h3>
                <p>{game.description}</p>
                <div className="xp-game-bottom">
                  <span>{game.league}</span>
                  <Link href="/events" aria-label={`See ${game.name} events`}><ArrowUpRight size={15} /></Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {games.length === 0 && (
          <div className="xp-empty-panel">
            <Gamepad2 size={17} />
            <p>{contentUnavailable ? 'Game listings are temporarily unavailable. Connect the game database to load the line-up.' : 'The festival line-up will appear here once game details are published.'}</p>
            <Link href="/events">VIEW EVENT DIRECTORY <ArrowRight size={14} /></Link>
          </div>
        )}
      </section>

      <section className="xp-section xp-briefing-section" id="briefing">
        <div className="xp-section-heading">
          <div>
            <p className="xp-kicker xp-kicker-cyan"><span /> LIVE EVENT FEED / SCHEDULE</p>
            <h2>FESTIVAL <span>SCHEDULE</span></h2>
            <p className="xp-section-intro">The latest dates, locations, and formats from the event directory.</p>
          </div>
          <Link className="xp-text-link" href="/events">OPEN DIRECTORY <ArrowUpRight size={14} /></Link>
        </div>
        {briefingEvents.length > 0 ? (
          <div className="xp-schedule-list">
            {briefingEvents.map((event, index) => (
              <Link className="xp-schedule-row" href="/events" key={event.id}>
                <span className="xp-schedule-index">0{index + 1}</span>
                <span className="xp-schedule-date"><CalendarDays size={14} />{formatEventDate(event.isoDate)}</span>
                <span className="xp-schedule-event"><strong>{event.title}</strong><small>{event.discipline} · {event.format}</small></span>
                <span className="xp-schedule-location"><MapPin size={13} />{event.location}</span>
                <ArrowUpRight className="xp-schedule-arrow" size={15} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="xp-empty-panel">
            <Radio size={17} />
            <p>{contentUnavailable ? 'Live schedule unavailable. Connect the event database to load event details.' : 'The festival schedule will appear here once event details are published.'}</p>
            <Link href="/events">VIEW EVENT DIRECTORY <ArrowRight size={14} /></Link>
          </div>
        )}
      </section>

      <section className="xp-campus-panel">
        <div className="xp-campus-copy">
          <p className="xp-kicker xp-kicker-cyan"><span /> THE VENUE / BIT RANCHI</p>
          <h2>ONE CAMPUS.<br /><span>COUNTLESS PLAYS.</span></h2>
          <p>Xordium brings the energy of gaming and esports to the Birla Institute of Technology community. Event-specific venue details are shared with each listing.</p>
          <Link className="xp-button xp-button-red" href="/about">MEET THE FESTIVAL <ArrowRight size={15} /></Link>
        </div>
        <div className="xp-campus-image" aria-hidden="true">
          <Image src="/art/neon-arena.svg" alt="" fill sizes="(max-width: 760px) 100vw, 48vw" />
          <div className="xp-campus-image-label"><MapPin size={14} /> BIT MESRA · RANCHI</div>
        </div>
      </section>

      <section className="xp-home-cta">
        <p className="xp-kicker"><span /> READY WHEN YOU ARE</p>
        <h2>ENTER THE <span>XORDIUM 5.0 ARENA</span></h2>
        <p>Explore the event line-up or get in touch with the organizing team.</p>
        <div className="xp-hero-actions">
          <Link className="xp-button xp-button-red" href="/events">EXPLORE EVENTS <ArrowRight size={15} /></Link>
          <Link className="xp-button xp-button-outline" href="/contact">CONTACT THE TEAM <ArrowUpRight size={14} /></Link>
        </div>
      </section>
    </main>
  );
}
