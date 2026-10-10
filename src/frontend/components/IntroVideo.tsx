'use client';

import { useRef, useState, type AnimationEvent } from 'react';

export default function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [muted, setMuted] = useState(true);

  function finishIntro() {
    setExiting(true);
  }

  function handleExitAnimationEnd(event: AnimationEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && event.animationName === 'xp-intro-exit') {
      setVisible(false);
    }
  }

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  if (!visible) return null;

  return (
    <div
      className={`xp-intro${exiting ? ' is-exiting' : ''}`}
      onAnimationEnd={handleExitAnimationEnd}
      role="dialog"
      aria-modal="true"
      aria-label="Xordium cyberpunk intro"
    >
      <video
        autoPlay
        className="xp-intro-video"
        muted
        onEnded={finishIntro}
        onError={finishIntro}
        playsInline
        preload="auto"
        ref={videoRef}
      >
        <source src="/art/cyberpunk-intro.mp4" type="video/mp4" />
      </video>
      <div className="xp-intro-controls">
        <div>
          <button className="xp-intro-sound" disabled={exiting} onClick={toggleSound} type="button">
            {muted ? 'ENABLE SOUND' : 'MUTE SOUND'}
          </button>
          <button className="xp-intro-skip" disabled={exiting} onClick={finishIntro} type="button">
            SKIP INTRO <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
