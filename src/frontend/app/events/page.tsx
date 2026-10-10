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
  Search,
  Users,
} from 'lucide-react';
import {
  formatEventTime,
  isEventEndedIST,
  type TournamentEvent,
} from '@/data/esportsData';

type EventView = 'upcoming' | 'past';

function eventDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date to be announced';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

function EventImage({ event, priority = false }: { event: TournamentEvent; priority?: boolean }) {
  return (
    <Image
      src={event.posterUrl || '/art/neon-arena.svg'}
      alt={event.posterUrl ? `${event.title} event poster` : ''}
      fill
      priority={priority}
      unoptimized={Boolean(event.posterUrl)}
      sizes="(max-width: 760px) 100vw, 50vw"
    />
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<TournamentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<EventView>('upcoming');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    let active = true;
    void fetch('/api/events', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Event listings are temporarily unavailable.');
        const data: { events?: TournamentEvent[] } = await response.json();
        if (!Array.isArray(data.events)) throw new Error('The event listing response was invalid.');
        if (active) setEvents(data.events);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Event listings are temporarily unavailable.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const sortedEvents = useMemo(() => {
    const visible = events.filter((event) => isEventEndedIST(event) === (view === 'past'));
    return visible.sort((left, right) => {
      const direction = view === 'past' ? -1 : 1;
      return direction * (new Date(left.isoDate).getTime() - new Date(right.isoDate).getTime());
    });
  }, [events, view]);

  const categories = useMemo(
    () => [...new Set(events.map((event) => event.discipline.trim()).filter(Boolean))]
      .sort((left, right) => left.localeCompare(right)),
    [events],
  );

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return sortedEvents.filter((event) => {
      const matchesCategory = category === 'all' || event.discipline === category;
      const matchesSearch = !query || [
        event.title,
        event.discipline,
        event.location,
        event.format,
        event.description ?? '',
      ].some((value) => value.toLocaleLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [category, search, sortedEvents]);

  const featuredEvent = view === 'upcoming' ? sortedEvents[0] : undefined;

  return (
    <main className="xp-page xp-inner-page">
      <section className="xp-directory-hero">
        <div className="xp-directory-copy">
          <p className="xp-kicker"><span /> XORDIUM 5.0 / THE EVENT DIRECTORY</p>
          <h1>EVENTS<br /><span>DIRECTORY</span><i>{' // 競技一覧'}</i></h1>
          <p>Find your next match, follow the festival line-up, and get the details you need before you arrive.</p>
        </div>
        <div className="xp-directory-art" aria-hidden="true">
          <Image src="/art/neon-arena.svg" alt="" fill priority sizes="(max-width: 760px) 100vw, 32vw" />
          <span>THE CITY PLAYS TONIGHT</span>
        </div>
        <div className="xp-directory-counter">
          <span>FESTIVAL PROGRAM</span>
          <strong>{String(events.length).padStart(2, '0')}</strong>
          <small>LISTED EVENTS</small>
        </div>
      </section>

      {featuredEvent && (
        <section className="xp-featured-event">
          <div className="xp-featured-event-copy">
            <p className="xp-kicker xp-kicker-cyan"><span /> FEATURED EVENT / {featuredEvent.statusBadge}</p>
            <span className="xp-featured-discipline">{featuredEvent.discipline}</span>
            <h2>{featuredEvent.title}</h2>
            {featuredEvent.description && <p className="xp-featured-description">{featuredEvent.description}</p>}
            <div className="xp-event-details">
              <span><CalendarDays size={15} />{eventDate(featuredEvent.isoDate)}</span>
              <span><Clock3 size={15} />{formatEventTime(featuredEvent)}</span>
              <span><MapPin size={15} />{featuredEvent.location}</span>
              <span><Users size={15} />{featuredEvent.format}</span>
            </div>
            <Link className="xp-button xp-button-red" href="/contact">ASK ABOUT THIS EVENT <ArrowRight size={15} /></Link>
          </div>
          <div className="xp-featured-event-art">
            <EventImage event={featuredEvent} priority />
            <span>UP NEXT / XORDIUM 5.0</span>
          </div>
        </section>
      )}

      <section className="xp-directory-section" aria-labelledby="xp-directory-heading">
        <div className="xp-section-heading">
          <div>
            <p className="xp-kicker xp-kicker-cyan"><span /> FESTIVAL PROGRAM / {view === 'upcoming' ? 'UPCOMING' : 'PAST EVENTS'}</p>
            <h2 id="xp-directory-heading">SELECT YOUR <span>EVENT</span></h2>
          </div>
          <div className="xp-event-view-toggle" aria-label="Event date filter">
            <button aria-pressed={view === 'upcoming'} className={view === 'upcoming' ? 'is-active' : ''} onClick={() => setView('upcoming')} type="button">
              UPCOMING <span>{events.filter((event) => !isEventEndedIST(event)).length}</span>
            </button>
            <button aria-pressed={view === 'past'} className={view === 'past' ? 'is-active' : ''} onClick={() => setView('past')} type="button">
              ARCHIVE <span>{events.filter((event) => isEventEndedIST(event)).length}</span>
            </button>
          </div>
        </div>

        <div className="xp-directory-toolbar">
          <label className="xp-event-search">
            <Search size={16} />
            <input
              aria-label="Search events"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="SEARCH EVENT, GAME, FORMAT, OR VENUE..."
              type="search"
              value={search}
            />
          </label>
          <span className="xp-search-count"><Gamepad2 size={14} /> {filteredEvents.length} RESULTS</span>
        </div>

        <div className="xp-category-filters" aria-label="Filter events by game">
          <button aria-pressed={category === 'all'} className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')} type="button">
            ALL EVENTS <span>· {events.length}</span>
          </button>
          {categories.map((name) => (
            <button aria-pressed={category === name} className={category === name ? 'is-active' : ''} key={name} onClick={() => setCategory(name)} type="button">
              {name}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="xp-directory-message" role="status">Loading the festival program…</p>
        ) : error ? (
          <div className="xp-directory-message xp-directory-error" role="alert">
            <strong>EVENT FEED OFFLINE</strong>
            <span>{error} Check the database connection and try again.</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="xp-directory-message">
            <strong>{events.length === 0 ? 'THE FESTIVAL PROGRAM IS TAKING SHAPE.' : 'NO MATCHING EVENTS.'}</strong>
            <span>
              {events.length === 0
                ? 'Published event details will appear here.'
                : 'Adjust the search or category to see more of the line-up.'}
            </span>
          </div>
        ) : (
          <div className="xp-event-grid">
            {filteredEvents.map((event, index) => (
              <article className="xp-event-card" key={event.id}>
                <div className="xp-event-card-art">
                  <EventImage event={event} />
                  <span className="xp-event-card-index">EVENT / {String(index + 1).padStart(2, '0')}</span>
                  <span className="xp-event-card-tag">{event.discipline}</span>
                </div>
                <div className="xp-event-card-body">
                  <span className="xp-event-state"><i /> {event.statusBadge}</span>
                  <h3>{event.title}</h3>
                  {event.description && <p className="xp-event-card-description">{event.description}</p>}
                  <div className="xp-event-card-details">
                    <span><CalendarDays size={13} />{eventDate(event.isoDate)}</span>
                    <span><MapPin size={13} />{event.location}</span>
                    <span><Users size={13} />{event.format}</span>
                  </div>
                  <Link className="xp-event-card-link" href="/contact">EVENT DETAILS <ArrowUpRight size={14} /></Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
