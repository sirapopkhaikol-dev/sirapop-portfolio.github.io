"use client";

import { sitePath } from "./sitePath";
import { useId, useRef, useState, type ComponentType, type KeyboardEvent } from "react";
import styles from "./Journey.module.css";
import Hackathon from "./Hackathon";
import Internships from "./Internships";
import MoneyMonkey from "./MoneyMonkey";
import Bachelors from "./Bachelors";
import Masters from "./Masters";
import FirstYear from "./FirstYear";

const detailedChapters: Record<string, ComponentType | undefined> = {
  "First year at university": FirstYear,
  Hackathon,
  Internship: Internships,
  Projects: MoneyMonkey,
  "Bachelor’s degree": Bachelors,
  "Master’s degree": Masters,
};

type Milestone = {
  title: string;
  reflection: string;
  takeaway: string;
  photo?: { src: string; subject: string };
  diagram?: [string, string, string];
};

const milestones: Milestone[] = [
  {
    title: "First year at university",
    reflection: "A program can produce the right answer while its workings are still a mystery. In my first year, I started tracing small examples by hand. Watching a variable change made the code easier to explain.",
    takeaway: "I still reach for a pencil when a piece of logic surprises me.",
    photo: { src: "/journey-campus.jpg", subject: "University life" },
  },
  {
    title: "Hackathon",
    reflection: "A short deadline made choosing what to build just as interesting as writing the code. I like starting with the one interaction someone needs to try, then deciding which details can wait.",
    takeaway: "My favorite question at that stage is simple. What would someone actually do with this first version?",
    diagram: ["Sketch", "Build", "Try"],
  },
  {
    title: "Internship",
    reflection: "Reading someone else’s code asks something different of me. Before changing a line, I want to know who calls it, what they expect, and where I can check that I understood.",
    takeaway: "I try to leave enough context with a change for the next person to follow my reasoning.",
    diagram: ["Trace", "Change", "Review"],
  },
  {
    title: "Projects",
    reflection: "Working on a project gives me room to follow a question all the way to something I can use. The part I enjoy most is trying the first rough version and noticing where my assumptions break.",
    takeaway: "I keep that first version small enough to revise without hesitation.",
    photo: { src: "/journey-code.jpg", subject: "Software development" },
  },
  {
    title: "Bachelor’s degree",
    reflection: "Looking back at my undergraduate work, the ideas that stayed with me were the ones I could put side by side. Two solutions can give the same answer and behave very differently as the input grows.",
    takeaway: "When I choose an approach now, I want to explain the trade-off in terms someone else can check.",
    diagram: ["Input", "Compare", "Explain"],
  },
  {
    title: "Master’s degree",
    reflection: "Graduate study makes me more careful about the question I am asking. I like writing down an assumption and deciding what evidence would make me reconsider it.",
    takeaway: "That habit gives me a concrete next step when an answer is uncertain.",
    diagram: ["Ask", "Test", "Revisit"],
  },
];

function ProcessDiagram({ steps }: { steps: [string, string, string] }) {
  return (
    <figure className={styles.diagram}>
      <ol aria-label="Process" className={styles.diagramSteps}>
        {steps.map((step, i) => (
          <li key={step}>
            <svg aria-hidden="true" width="31" height="31" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.25">
              {i === 0 && <><path d="m16 3 13 13-13 13L3 16Z" /><circle cx="16" cy="16" r="2.7" /></>}
              {i === 1 && <><rect x="5" y="5" width="22" height="22" rx="1" /><path d="M10 12h12m-12 4h12m-12 4h7" /></>}
              {i === 2 && <><circle cx="16" cy="16" r="12" /><path d="m10.5 16.3 3.5 3.5 7.5-8" /></>}
            </svg>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export default function Journey() {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const prefix = useId();
  const milestone = milestones[selected];
  const Chapter = detailedChapters[milestone.title];

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight": next = (index + 1) % milestones.length; break;
      case "ArrowUp":
      case "ArrowLeft": next = (index + milestones.length - 1) % milestones.length; break;
      case "Home": next = 0; break;
      case "End": next = milestones.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className={styles.journey} aria-label="Journey">
      <h1>My journey<span>.</span></h1>
      <div className={styles.layout}>
        <div className={styles.timeline} role="tablist" aria-label="Milestones" aria-orientation="vertical">
          {milestones.map(({ title }, index) => (
            <button type="button" role="tab" key={title} id={`${prefix}-tab-${index}`}
              aria-selected={index === selected} tabIndex={index === selected ? 0 : -1}
              aria-controls={`${prefix}-story-${index}`}
              ref={button => { tabs.current[index] = button; }}
              onClick={() => setSelected(index)} onKeyDown={event => navigate(event, index)}>
              <i aria-hidden="true" /><span>{title}{title === "Master’s degree" && <> <small className={styles.current}>Now</small></>}</span>
            </button>
          ))}
        </div>
        {milestones.map((entry, index) => (
          <article key={entry.title} id={`${prefix}-story-${index}`} role="tabpanel"
            aria-labelledby={`${prefix}-tab-${index}`} className={styles.story}
            hidden={index !== selected} tabIndex={0}>
            {index === selected && (Chapter ? <Chapter/> : <>
              <h2>{milestone.title}</h2>
              <p>{milestone.reflection}</p>
              <p>{milestone.takeaway}</p>
              {milestone.photo && <figure className={styles.photograph}>
                <img src={sitePath(milestone.photo.src)} alt="" width="900" height="510" />
                <figcaption>{milestone.photo.subject} <span aria-hidden="true">/</span> Illustrative photograph</figcaption>
              </figure>}
              {milestone.diagram && <ProcessDiagram steps={milestone.diagram} />}
            </>)}
          </article>
        ))}
      </div>
    </section>
  );
}
