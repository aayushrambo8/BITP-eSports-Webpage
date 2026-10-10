'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Send,
} from 'lucide-react';

type SubmitState = { type: 'success' | 'error'; message: string } | null;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSubmitState(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      topic: String(formData.get('topic') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result: { success?: boolean; message?: string; error?: string } = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Your message could not be sent. Please try again.');
      }
      form.reset();
      setSubmitState({ type: 'success', message: result.message || 'Your message has reached the festival team.' });
    } catch (error: unknown) {
      setSubmitState({
        type: 'error',
        message: error instanceof Error ? error.message : 'Your message could not be sent. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="xp-page xp-inner-page">
      <section className="xp-contact-masthead">
        <p className="xp-kicker"><span /> COMMUNICATION CHANNEL / XORDIUM 5.0</p>
        <h1>CONTACT <span>THE TEAM</span><i>{' // 連絡'}</i></h1>
        <p>Questions about an event, joining the festival, or getting involved? Send a message to the Xordium organizers.</p>
      </section>

      <section className="xp-contact-layout">
        <aside className="xp-contact-aside">
          <div className="xp-contact-art" aria-hidden="true">
            <Image src="/art/neon-contact.svg" alt="" fill sizes="(max-width: 760px) 100vw, 36vw" />
            <span>OPEN CHANNEL / 05</span>
          </div>
          <div className="xp-contact-aside-heading">
            <p className="xp-kicker xp-kicker-cyan"><span /> OPEN CHANNELS / 01</p>
            <h2>REACH THE<br /><span>ORGANIZERS.</span></h2>
            <p>Choose a channel or send us a note. For event questions, include the event name so the team can help.</p>
          </div>
          <div className="xp-contact-channels">
            <a href="#contact-form">
              <span className="xp-contact-icon"><Send size={17} /></span>
              <span><small>MESSAGE / FESTIVAL TEAM</small><strong>Send a message through this site</strong></span>
              <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="xp-contact-location">
            <span className="xp-kicker"><AtSign size={13} /> FESTIVAL BASE</span>
            <strong>Birla Institute of Technology</strong>
            <span>Mesra · Ranchi, Jharkhand</span>
          </div>
        </aside>

        <div className="xp-contact-form-panel">
          <div className="xp-contact-form-heading">
            <div><p className="xp-kicker xp-kicker-red"><span /> TRANSMIT A MESSAGE / 02</p><h2>WHAT’S ON YOUR MIND?</h2></div>
            <span className="xp-contact-form-number">X/05</span>
          </div>
          <form className="xp-contact-form" id="contact-form" onSubmit={handleSubmit}>
            <div className="xp-form-row">
              <label>
                YOUR NAME <span>*</span>
                <input autoComplete="name" maxLength={100} name="name" placeholder="Enter your name" required />
              </label>
              <label>
                EMAIL ADDRESS <span>*</span>
                <input autoComplete="email" maxLength={254} name="email" placeholder="you@example.com" required type="email" />
              </label>
            </div>
            <label>
              SUBJECT <small>OPTIONAL</small>
              <input maxLength={100} name="topic" placeholder="Event question, partnership, or just saying hello" />
            </label>
            <label>
              MESSAGE <span>*</span>
              <textarea maxLength={4000} minLength={1} name="message" placeholder="Write your message here…" required rows={6} />
            </label>
            {submitState && (
              <p className={`xp-form-feedback ${submitState.type}`} role={submitState.type === 'error' ? 'alert' : 'status'}>
                {submitState.message}
              </p>
            )}
            <div className="xp-form-actions">
              <button className="xp-button xp-button-red" disabled={submitting} type="submit">
                {submitting ? 'TRANSMITTING…' : 'SEND MESSAGE'} <Send size={14} />
              </button>
              <span>YOUR MESSAGE GOES TO THE FESTIVAL ORGANIZERS.</span>
            </div>
          </form>
        </div>
      </section>

      <section className="xp-contact-bottom">
        <span className="xp-kicker xp-kicker-cyan"><span /> NOT SURE WHERE TO START?</span>
        <p>Browse the event directory to find details about the festival.</p>
        <Link className="xp-text-link" href="/events">OPEN EVENT DIRECTORY <ArrowRight size={14} /></Link>
      </section>
    </main>
  );
}
