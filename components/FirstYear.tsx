"use client";

import LoadingImage from "./LoadingImage";
import { sitePath } from "./sitePath";
import { useState } from "react";
import Icon from "./Icon";
import ImageLightbox, { type GalleryImage } from "./ImageLightbox";
import styles from "./FirstYear.module.css";

const memories: GalleryImage[] = [
  { src: "/first-year-friends.jpg", label: "University days, shared with friends", alt: "A group of university friends taking a photo together near outdoor stalls" },
  { src: "/first-year-night.jpg", label: "A view from university life", alt: "An atmospheric night photograph of a road and pedestrian bridge, with lights reflecting through the scene" },
];

const steps = [
  { name: "Ask", icon: "chat", title: "Start with a question", text: "What is the problem, what do I already know, and what do I need to understand? A clear question gives the next step a purpose.", code: "question → break it into smaller parts" },
  { name: "Try", icon: "code", title: "Make the idea tangible", text: "Turn one small idea into something that can be tried. A sketch, a calculation, or a short piece of code makes an assumption easier to examine.", code: "small idea → a first attempt" },
  { name: "Understand", icon: "branch", title: "Look at why it happened", text: "Compare the result with the expectation. Follow the steps, ask for another perspective, and use mistakes to find the part that needs more attention.", code: "expected result ↔ observed result" },
  { name: "Repeat", icon: "journey", title: "Carry the lesson forward", text: "Change one part, try again, and keep what the attempt taught you. Small improvements build a foundation for more complex work.", code: "reflection → improvement → next question" },
];

export default function FirstYear() {
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<GalleryImage | null>(null);
  return <div className={styles.chapter}>
    <div className={styles.eyebrow}><span aria-hidden="true"/> CHAPTER 01 · KMITL</div>
    <h2>Every journey starts<br/>with curiosity<span>.</span></h2>
    <div className={styles.location}><Icon name="lab" size={19}/><div><strong>King Mongkut’s Institute of Technology Ladkrabang</strong><span>The beginning of my bachelor’s journey</span></div></div>
    <p>My journey at KMITL began with a bachelor’s path connecting engineering and science. Before the hackathons, internships, and larger projects, this was the starting point: university life and a foundation to build on.</p>
    <div className={styles.memories} aria-label="First-year university memories">
      {memories.map((photo, index) => <button type="button" key={photo.src} className={index === 0 ? styles.friends : styles.night}
        aria-label={"Enlarge " + photo.label} aria-haspopup="dialog" onClick={() => setImage(photo)}>
        <LoadingImage src={sitePath(photo.src)} alt={photo.alt} width={index === 0 ? 1440 : 720} height={index === 0 ? 1109 : 720} loading="lazy"/>
        <span><span className={styles.number}>{index + 1}</span>{index === 0 ? "People & memories" : "A little atmosphere"}<Icon name="upRight" size={13}/></span>
      </button>)}
    </div>
    <div className={styles.memoryNote}><Icon name="star" size={18}/><p>The people and everyday moments are part of this story, too. These photos make room for the university life behind the technical work.</p></div>
    <div className={styles.sectionHeading}><Icon name="branch" size={23}/><h3>A foundation for what comes next</h3></div>
    <p>Looking back across my bachelor’s studies, I see connections between logical thinking, mathematics, physical systems, and software. This first chapter marks the beginning of the path that later brought those ideas together.</p>
    <div className={styles.loop}>
      <div className={styles.loopHeader}><span>A learning loop</span><small>EXPLORE EACH STEP</small></div>
      <p className={styles.intro}>A simple way to approach an unfamiliar problem.</p>
      <div className={styles.steps} role="group" aria-label="Learning loop steps">
        {steps.map((item, index) => <button type="button" key={item.name} aria-pressed={step === index} onClick={() => setStep(index)}>
          <span className={styles.number}>{index + 1}</span><Icon name={item.icon} size={24}/><span>{item.name}</span>
        </button>)}
      </div>
      <div className={styles.returnPath} aria-hidden="true"><span key={step}/>← bring the lesson into the next attempt</div>
      <div className={styles.detail} key={"step-" + step} aria-live="polite" aria-atomic="true"><span>0{step + 1} / LEARNING LOOP</span><h4>{steps[step].title}</h4><p>{steps[step].text}</p><code><span aria-hidden="true">› </span>{steps[step].code}<i aria-hidden="true"/></code></div>
      <button className={styles.next} type="button" onClick={() => setStep(value => (value + 1) % steps.length)}>{step === 3 ? "Back to the question" : "Next step"}<Icon name="arrow" size={15}/></button>
    </div>
    <div className={styles.reflection}><Icon name="star" size={25}/><div><span>THE MINDSET I WANT TO KEEP</span><h3>Build. Learn.<br/>Improve. Repeat.</h3><p>This is the thread connecting the chapters that follow: keep learning, put ideas into practice, and use each experience to improve the next attempt.</p></div></div>
    <ImageLightbox image={image} onClose={() => setImage(null)}/>
  </div>;
}
