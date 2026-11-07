"use client";

import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";
import { sitePath } from "./sitePath";
import styles from "./AmbientMusic.module.css";

export default function AmbientMusic() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [volume, setVolume] = useState(12);
  const [error, setError] = useState("");
  const audio = useRef<HTMLAudioElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    const element = audio.current;
    if (element) element.volume = .12;
    return () => { element?.pause(); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  async function togglePlayback() {
    const element = audio.current;
    if (!element) return;
    setError("");
    if (!element.paused) { element.pause(); return; }
    setBusy(true);
    try { await element.play(); }
    catch { setError("Unable to play right now. Please try again."); }
    finally { setBusy(false); }
  }

  return <div className={styles.music} ref={root}>
    <audio ref={audio} src={sitePath("/audio/floating-in-space.wav")} preload="none" loop
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}
      onError={() => { setPlaying(false); setBusy(false); setError("Audio could not load. Please try again later."); }}/>
    <button ref={trigger} className={styles.trigger} type="button" aria-label="Ambient music controls" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(value => !value)}>
      <span className={styles.wave} data-playing={playing} aria-hidden="true"><i/><i/><i/><i/></span><span>{playing ? "Sound on" : "Sound off"}</span>
    </button>
    {open && <section className={styles.panel} id={panelId} aria-label="Ambient music">
      <div className={styles.heading}><span>ORBITAL SOUNDSCAPE</span><button type="button" aria-label="Close music controls" onClick={() => { setOpen(false); trigger.current?.focus(); }}><Icon name="close" size={16}/></button></div>
      <h2>Floating in Space</h2><p className={styles.artist}>by Umplix · Ambient / Space</p>
      <button type="button" className={styles.play} disabled={busy} onClick={togglePlayback} aria-label={playing ? "Pause ambient music" : "Play ambient music"}>
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">{playing ? <path d="M4 3h2.5v10H4zm5.5 0H12v10H9.5z"/> : <path d="m4 2 9 6-9 6z"/>}</svg>{busy ? "Loading…" : playing ? "Pause music" : "Play music"}
      </button>
      <label className={styles.volume}>Volume <output>{volume}%</output><input aria-label="Music volume" type="range" min="0" max="100" value={volume} onChange={event => { const next = Number(event.target.value); setVolume(next); if (audio.current) audio.current.volume = next / 100; }}/></label>
      <p className={styles.status} role="status">{error || (playing ? "A quiet backdrop for exploring the portfolio." : "Optional sound. Starts off, at a quiet volume.")}</p>
      <div className={styles.credit}><a href="https://opengameart.org/content/floating-in-space" target="_blank" rel="noopener noreferrer">Track & artist ↗</a><a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener noreferrer">CC0 · Public domain ↗</a></div>
    </section>}
  </div>;
}
