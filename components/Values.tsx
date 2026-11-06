"use client";

import { useRef, useState, type KeyboardEvent } from "react";
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
    motto: "Ideals don’t work until you do.",
  },
  {
    letter: "A", verb: "Act", title: "Act on feedback", x: 62, y: 53,
    description: "I watch where someone hesitates, change that part, and ask them to try it again. Their second attempt tells me whether the change helped.",
    motto: "Build, learn, improve, repeat.",
  },
  {
    letter: "R", verb: "Repeat", title: "Repeat with purpose", x: 82, y: 25,
    description: "At the end of a round, I write down what got easier and what still takes effort. I use that note to choose the next improvement.",
    motto: "Build, learn, improve, repeat.",
  },
];

const sky = [
  [7, 34], [18, 18], [26, 54], [33, 81], [45, 15], [48, 66],
  [54, 32], [67, 17], [76, 73], [92, 56], [87, 83], [9, 77],
  [57, 88], [69, 64], [22, 40], [36, 13], [74, 42], [93, 28],
];

export default function Values() {
  const [selected, setSelected] = useState(0);
  const stars = useRef<(HTMLButtonElement | null)[]>([]);
  const current = values[selected];

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
    <section className={styles.values} aria-labelledby="values-title">
      <header className={styles.heading}>
        <h1 id="values-title">Values<span>.</span></h1>
        <p>Select a star to explore how I approach a project.</p>
      </header>
      <div className={styles.layout}>
        <div className={styles.map} role="radiogroup" aria-label="STAR values">
          <span className={styles.mapTitle} aria-hidden="true">STAR constellation</span>
          <svg className={styles.sky} viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
            <g className={styles.grid}>
              <path d="M0 80H600 M0 160H600 M0 240H600 M0 320H600 M120 0V400 M240 0V400 M360 0V400 M480 0V400" />
              <path d="M-50 356Q262 373 617 13 M-64 400Q315 418 661 32 M-17 307Q241 319 579 -18" />
            </g>
            {sky.map(([x, y]) => <circle key={x} cx={x * 6} cy={y * 4} r="1.15" fill="#bfc9b3" opacity=".56" />)}
            <g className={styles.skyCrosses}>
              <path d="M57 111h8m-4 -4v8 M426 326h8m-4 -4v8 M541 66h6m-3 -3v6" />
            </g>
            <polyline className={styles.connection} points={values.map(v => `${v.x * 6},${v.y * 4}`).join(" ")} />
          </svg>
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
              onFocus={() => setSelected(index)}
              onClick={() => setSelected(index)}
              onKeyDown={event => navigate(event, index)}
            >
              <span className={styles.starMark}>
                <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
                  <path d="M14 1.5 16.3 11.7 26.5 14 16.3 16.3 14 26.5 11.7 16.3 1.5 14 11.7 11.7Z" fill="currentColor" />
                </svg>
              </span>
              <span className={styles.starName}>{value.verb}</span>
            </button>
          ))}
        </div>
        <article id="selected-value" className={styles.detail} aria-live="polite" aria-atomic="true">
          <span className={styles.initial} aria-hidden="true">{current.letter}</span>
          <h2 key={current.letter + "-title"}>{current.title}<span>.</span></h2>
          <p key={current.letter + "-description"}>{current.description}</p>
          <div className={styles.motto}>
            <span>Personal motto</span>
            <blockquote>“{current.motto}”</blockquote>
          </div>
        </article>
      </div>
    </section>
  );
}
