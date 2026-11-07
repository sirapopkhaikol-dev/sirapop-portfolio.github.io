"use client";

import { sitePath } from "./sitePath";
import { useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";
import ModelDiagram from "./ModelDiagram";
import styles from "./Hackathon.module.css";

const media = [
  { src: "/Aihack-person.png", label: "With the AiHack team", alt: "A group photograph with the AiHack team and an AUC leaderboard award" },
  { src: "/Aihack-cert-2024.png", label: "2024 participation certificate", alt: "AiHack Thailand 2024 participation certificate for Sirapop Khaikol, December 7–9, 2024" },
  { src: "/Aihack-cert-2025.png", label: "2025 final-round certificate", alt: "AiHack Thailand 2025 final-round participation certificate for Sirapop Khaikol, December 10–12, 2025" },
];

export default function Hackathon() {
  const [image, setImage] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const captionId = useId();
  const selected = image === null ? null : media[image];

  useEffect(() => {
    const element = dialog.current;
    if (!selected || !element) return;
    const opener = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [selected]);

  return <div className={styles.chapter}>
    <div className={styles.eyebrow}><Icon name="code" size={15}/> FINANCIAL MODELING · 2024–2025</div>
    <h2>AiHack Thailand<span>.</span></h2>
    <p>I joined AiHack to build financial forecasting models with a team and test our predictions against real outcomes. We competed in the AUC Tournament, where our models were evaluated using the competition’s AUC score.</p>
    <div className={styles.result}>
      <Icon name="star" size={29}/>
      <div className={styles.rank}>4<sup>th</sup></div>
      <div><strong>AUC Tournament · 2024</strong><span>Out of 32 competing teams</span></div>
    </div>
    <div className={styles.gallery}>
      {media.map((item, index) => <button type="button" key={item.src} className={index === 0 ? styles.team : styles.certificate}
        aria-label={"Enlarge " + item.label} aria-haspopup="dialog" onClick={() => setImage(index)}>
        <div className={styles.photo}><img src={sitePath(item.src)} alt={item.alt} loading="lazy"/></div>
        <span>{item.label}<Icon name="upRight" size={13}/></span>
      </button>)}
    </div>
    <details className={styles.return}>
      <summary>Returning in 2025 <span>Final round · 7th place</span></summary>
      <p>I returned for a second year and finished seventh in the AUC Tournament. Taking part again gave me another chance to test ideas, learn from the process, and develop my modeling skills.</p>
    </details>
    <div className={styles.sectionHeading}><Icon name="branch" size={20}/><h3>How the model comes together</h3></div>
    <p>The approach combines models trained for different regions with an ensemble. Explore the two parts below to follow the data from training to predictions.</p>
    <ModelDiagram/>
    <div className={styles.lesson}>
      <Icon name="star" size={23}/>
      <div><h3>More than a place on the leaderboard</h3>
        <p>The prize money was part of the motivation. The lasting value was learning to compare approaches, discuss decisions with a team, and use evaluation results to decide what to try next. I came away with more experience and a clearer sense of how I wanted to improve.</p>
      </div>
    </div>
    <dialog ref={dialog} className={styles.lightbox} aria-labelledby={captionId}
      onCancel={event => { event.preventDefault(); setImage(null); }}
      onKeyDown={event => { if (event.key === "Escape") event.stopPropagation(); }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setImage(null);
      }}>
      <button type="button" aria-label="Close AiHack image" onClick={() => setImage(null)}><Icon name="close" size={20}/></button>
      {selected && <figure><img src={sitePath(selected.src)} alt={selected.alt}/><figcaption id={captionId}>{selected.label}</figcaption></figure>}
    </dialog>
  </div>;
}
