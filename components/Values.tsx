"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import ChartSky from "./ChartSky";
import styles from "./Values.module.css";

const values = [
  {
    letter: "S", verb: "Start", title: "Start with curiosity", x: 16, y: 66,
    description: "Before I open an editor, I ask what someone was trying to do and where they got stuck. That gives me a specific question to explore.",
    motto: "Same Person Bigger Goals",
  },
  {
    letter: "T", verb: "Test", title: "Test ideas", x: 39, y: 34,
    description: "I build the smallest version that can answer my question. Trying it with real inputs shows me which of my assumptions hold up.",
    motto: "Ideals Don’t Work Until You Do.",
  },
  {
    letter: "A", verb: "Act", title: "Act on feedback", x: 62, y: 53,
    description: "I watch where someone hesitates, change that part, and ask them to try it again. Their second attempt tells me whether the change helped.",
    motto: "Good Code Brighter Tomorrow",
  },
  {
    letter: "R", verb: "Repeat", title: "Repeat with purpose", x: 82, y: 25,
    description: "At the end of a round, I write down what got easier and what still takes effort. I use that note to choose the next improvement.",
    motto: "Build, Learn, Improve, Repeat.",
  },
];

function routeBetween(from: number, to: number) {
  const stops = values.slice(Math.min(from, to), Math.max(from, to) + 1);
  if (from > to) stops.reverse();
  return stops.map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x * 6} ${y * 4}`).join(" ");
}

const fullRoute = routeBetween(0, values.length - 1);

export default function Values({ suspended = false }: { suspended?: boolean }) {
  const [selection, setSelection] = useState({ index: 0, previous: 0, trace: false });
  const [paused, setPaused] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const stars = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = selection.index;
  const current = values[selected];
  const moving = motionAllowed && !paused && !suspended;
  const travelPath = routeBetween(selection.previous, selected);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setMotionAllowed(!preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);

    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  function select(index: number) {
    setSelection(old => old.index === index ? old : { index, previous: old.index, trace: moving });
  }

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (index + 1) % values.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        next = (index + values.length - 1) % values.length;
        break;
      case "Home": next = 0; break;
      case "End": next = values.length - 1; break;
      default: return;
    }
    event.preventDefault();
    stars.current[next]?.focus();
  }

  return (
    <section className={styles.values} aria-labelledby="values-title" data-moving={moving}>
      <header className={styles.heading}>
        <h1 id="values-title">Values<span>.</span></h1>
        <p>Select a star to explore how I approach a project.</p>
      </header>
      <div className={styles.layout}>
        <div className={styles.map}>
          <ChartSky animated={moving}/>
          <span className={styles.mapTitle} aria-hidden="true">STAR constellation</span>
          <svg className={styles.sky} viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
            <path className={styles.connectionGlow} d={fullRoute}/>
            <path className={styles.connection} d={fullRoute} pathLength="1"/>
            <g className={styles.ambient} key={current.letter}>
              <path className={styles.trail} d={fullRoute} pathLength="1"/>
              <path className={styles.beacon} d={fullRoute} pathLength="1"/>
            </g>
            {selection.trace && <g key={travelPath} className={styles.transfer}>
              <path className={styles.wake} d={travelPath} pathLength="1"/>
              <path className={styles.ship} d={travelPath} pathLength="1"/>
            </g>}
          </svg>
          <div className={styles.starGroup} role="radiogroup" aria-label="STAR values">
            {values.map((value, index) => (
              <button
                key={value.letter}
                type="button"
                role="radio"
                aria-label={value.title}
                aria-checked={index === selected}
                aria-controls="selected-value"
                tabIndex={index === selected ? 0 : -1}
                ref={element => { stars.current[index] = element; }}
                className={styles.star}
                style={{ left: `${value.x}%`, top: `${value.y}%` }}
                onFocus={() => select(index)}
                onClick={() => select(index)}
                onKeyDown={event => navigate(event, index)}
              >
                <span className={styles.starMark}>
                  {index === selected && <span className={styles.tracker} aria-hidden="true">
                    <svg viewBox="0 0 72 72" className={styles.orbitRing}>
                      <circle cx="36" cy="36" r="29" pathLength="100" strokeDasharray="21 4 2 5 18 50"/>
                      <circle cx="36" cy="36" r="24" pathLength="100" strokeDasharray="1 9"/>
                      <circle className={styles.moon} cx="65" cy="36" r="2.2"/>
                    </svg>
                    <i className={styles.pulse}/>
                  </span>}
                  <svg className={styles.starGlyph} width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                    <path d="M14 1.5 16.3 11.7 26.5 14 16.3 16.3 14 26.5 11.7 16.3 1.5 14 11.7 11.7Z" fill="currentColor" />
                  </svg>
                </span>
                <span className={styles.starName}>{value.verb}</span>
              </button>
            ))}
          </div>
          {motionAllowed && <button type="button" className={styles.motionToggle}
            aria-label={paused ? "Play constellation motion" : "Pause constellation motion"}
            onClick={() => setPaused(value => !value)}>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d={paused ? "M4 2.5 13 8l-9 5.5z" : "M3.5 3h3v10h-3zm6 0h3v10h-3z"}/>
            </svg>
            {paused ? "Play sky" : "Pause sky"}
          </button>}
        </div>
        <article id="selected-value" className={styles.detail} aria-live="polite" aria-atomic="true">
          <span key={current.letter} className={styles.initial} aria-hidden="true">{current.letter}</span>
          <h2 key={current.letter + "-title"}>{current.title}<span>.</span></h2>
          <p key={current.letter + "-description"}>{current.description}</p>
          <div key={current.letter + "-motto"} className={styles.motto}>
            <span>Personal motto</span>
            <blockquote>“{current.motto}”</blockquote>
          </div>
        </article>
      </div>
    </section>
  );
}
