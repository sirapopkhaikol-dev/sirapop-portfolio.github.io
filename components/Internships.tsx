"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Icon from "./Icon";
import ImageLightbox, { type GalleryImage } from "./ImageLightbox";
import InternshipFlow from "./InternshipFlow";
import styles from "./Internships.module.css";

const photos = {
  company: { src: "/Qchang-company.jpg", label: "Qchang company", alt: "Q-CHANG company sign at the office entrance" },
  qcert: { src: "/Qchang-cert.png", label: "Qchang internship certificate", alt: "Qchang certificate confirming Sirapop Khaikol’s Full Stack Developer internship" },
  team: { src: "/Western-Digital-person.jpg", label: "With the Western Digital team", alt: "A group photograph with the team in front of a Western Digital sign" },
  wcert: { src: "/Western-Digital-cert.png", label: "Western Digital internship certificate", alt: "Western Digital internship certificate for Sirapop Khaikol, April 28 to October 31, 2025" },
  reference: { src: "/Wd-Diagram.png", label: "Project architecture reference", alt: "Original project flow from machine and PLC through software, database, service API and deployed web application" },
} satisfies Record<string, GalleryImage>;
const screens: GalleryImage[] = [
  { src: "/Wd-1.jpg", label: "3D machine overview", alt: "Censored dashboard showing a 3D factory layout and highlighted machine alert" },
  { src: "/Wd-2.jpg", label: "Error analysis", alt: "Censored dashboard with error charts, alerts and activity summaries" },
  { src: "/Wd-4.jpg", label: "Event duration history", alt: "Censored dashboard showing a history of events and their durations" },
  { src: "/Wd-5.jpg", label: "Cell status and alerts", alt: "Censored dashboard showing machine cell status and alert details" },
];

export default function Internships() {
  const [company, setCompany] = useState(0);
  const [screen, setScreen] = useState(0);
  const [image, setImage] = useState<GalleryImage | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  function navigate(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - company;
    setCompany(next);
    tabs.current[next]?.focus();
  }
  function thumbnail(item: GalleryImage) {
    return <button type="button" className={styles.media} onClick={() => setImage(item)} aria-label={"Enlarge " + item.label} aria-haspopup="dialog" key={item.src}>
      <img src={item.src} alt={item.alt} loading="lazy"/>
      <span>{item.label}<Icon name="upRight" size={13}/></span>
    </button>;
  }
  return <div className={styles.chapter}>
    <div className={styles.eyebrow}><Icon name="code" size={15}/> INDUSTRY EXPERIENCE · 2025</div>
    <h2>Learning in production<span>.</span></h2>
    <p>Two internships let me work across frontend, backend, and data systems, while learning how to communicate with the people who rely on them.</p>
    <div className={styles.employers} role="tablist" aria-label="Internship employers">
      {["Qchang", "Western Digital"].map((name,index)=><button key={name} type="button" role="tab"
        ref={el=>{tabs.current[index]=el;}} aria-selected={company===index} tabIndex={company===index?0:-1}
        id={id+"-tab-"+index} aria-controls={id+"-panel"} onClick={()=>setCompany(index)} onKeyDown={navigate}>
        <Icon name={index===0 ? "code" : "branch"} size={19}/>
        <span><strong>{name}</strong><small>{index===0 ? "Full Stack Developer Intern" : "Software Developer Intern"}</small></span>
      </button>)}
    </div>
    <section key={company} id={id+"-panel"} role="tabpanel" aria-labelledby={id+"-tab-"+company} className={styles.employer} data-company={company}>
      <div className={styles.dates}>{company===0 ? <><span>Remote · Discord collaboration</span><time dateTime="2025-01-06">6 Jan</time> – <time dateTime="2025-04-11">11 Apr 2025</time></> : <><span>Onsite · Manufacturing</span><time dateTime="2025-04-28">28 Apr</time> – <time dateTime="2025-10-31">31 Oct 2025</time></>}</div>
      {company===0 ? <>
        <h3>Full stack work, with the whole team</h3>
        <p>Qchang provides comprehensive home services. As a Full Stack Developer Intern, I helped fix and improve features across the frontend and backend, including database migration work.</p>
        <p>Working remotely through Discord taught me to explain problems clearly, ask useful questions, and keep the team informed as I worked through a change.</p>
        <div className={styles.evidence}>{thumbnail(photos.company)}{thumbnail(photos.qcert)}</div>
        <div className={styles.sectionTitle}><Icon name="branch" size={21}/><h3>A migration lesson from a senior developer</h3></div>
        <p>When a large collection needed a structure or value change, my senior showed me how to work through bounded date ranges. Processing three months at a time made the work easier to control and review.</p>
        <InternshipFlow kind="migration"/>
        <p className={styles.note}>Filtering early can reduce the data reaching expensive joins and transformations. Suitable date and join indexes, and checking the query plan, are part of making that approach effective. <a href="https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/" target="_blank" rel="noreferrer">MongoDB pipeline guidance ↗</a></p>
      </> : <>
        <h3>From machine signals to a live dashboard</h3>
        <p>At Western Digital, a manufacturer of storage devices such as HDDs and SSDs, I worked as a Software Developer Intern in the Manufacturing Department.</p>
        <p>I helped build a web dashboard that carried machine data from the PLC through collection software, backend services, and a database to the frontend. Redis Pub/Sub and Server-Sent Events (SSE) supported live updates so the team could track machines in real time and reduce human errors.</p>
        <div className={styles.showcase}>
          <button type="button" className={styles.screen} onClick={()=>setImage(screens[screen])} aria-label={"Enlarge " + screens[screen].label} aria-haspopup="dialog">
            <img key={screen} src={screens[screen].src} alt={screens[screen].alt} loading="lazy"/>
            <span>{screens[screen].label}<Icon name="upRight" size={14}/></span>
          </button>
          <div className={styles.screenNav} role="group" aria-label="Dashboard views">{screens.map((item,index)=><button type="button" key={item.src} aria-pressed={screen===index} onClick={()=>setScreen(index)}>{item.label}</button>)}</div>
          <p className={styles.note}>Project screenshots supplied with confidential values censored.</p>
        </div>
        <div className={styles.sectionTitle}><Icon name="branch" size={21}/><h3>Follow a machine update</h3></div>
        <InternshipFlow kind="stream"/>
        <details className={styles.reference}><summary>View the original architecture diagram</summary>{thumbnail(photos.reference)}</details>
        <div className={styles.evidence}>{thumbnail(photos.team)}{thumbnail(photos.wcert)}</div>
      </>}
    </section>
    <div className={styles.reflection}>
      <Icon name="star" size={25}/>
      <div><h3>Use AI thoughtfully. Understand the result.</h3>
        <p>These internships also gave me practice in prompt engineering. As AI tools improve, I want to keep learning how to use them effectively: give clear context, examine the output, and check that I understand the logic before using it.</p>
        <p>AI can help me work more efficiently. Reviewing its suggestions and taking responsibility for the code are part of that work.</p>
      </div>
    </div>
    <ImageLightbox image={image} onClose={()=>setImage(null)}/>
  </div>;
}
