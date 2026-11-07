"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Icon from "./Icon";
import styles from "./LearningMap.module.css";

const areas = [
  {
    title: "Capture signals",
    subtitle: "Sensors · PLC · Arduino · ESP32",
    icon: "sensor",
    description: "I studied collecting raw data from sensors, PLCs, Arduino, ESP32, and other hardware. Industrial physics helped me connect those measurements to the physical behavior behind them.",
    topics: ["Physical measurement", "Sensors & controllers", "Hardware interfaces"],
  },
  {
    title: "Prepare data",
    subtitle: "Clean · analyze · combine",
    icon: "database",
    description: "I learned to clean, organize, analyze, and combine raw data before applying it in an information system. This connects the original measurements to the data an application or model can work with.",
    topics: ["Data cleaning", "Analysis & synthesis", "Structured information"],
  },
  {
    title: "Build applications",
    subtitle: "Web services & user interfaces",
    icon: "window",
    description: "I learned to build web services and applications using object-oriented programming, frontend and backend development, and databases. UX/UI studies helped me consider how people understand and interact with the result.",
    topics: ["OOP", "UX/UI", "Frontend & backend", "Databases"],
  },
  {
    title: "Learn from data",
    subtitle: "Machine learning & deep learning",
    icon: "neural",
    description: "Statistics, probability, and mathematics supported my study of machine learning and deep learning, including prediction and classification. These subjects gave me another way to use the data collected from a system.",
    topics: ["Statistics & probability", "Mathematics", "Prediction", "Classification"],
  },
  {
    title: "Deploy & connect",
    subtitle: "Cloud, servers & networking",
    icon: "network",
    description: "My studies included cloud deployment and the infrastructure behind self-hosted services: servers, data centers, switches, routers, and LAN connections. I learned how those parts connect an application to the people and devices using it.",
    topics: ["Cloud deployment", "Servers & data centers", "Switches & routers", "LAN & routing"],
  },
  {
    title: "Protect access",
    subtitle: "Cybersecurity & firewalls",
    icon: "shield",
    description: "I studied cybersecurity and firewall configuration as part of connecting systems. Thinking about which traffic and services should be accessible belongs alongside understanding how the network works.",
    topics: ["Cybersecurity foundations", "Firewall rules", "Network access"],
  },
] as const;

export default function LearningMap() {
  const [selected, setSelected] = useState(0);
  const [revision, setRevision] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const current = areas[selected];

  function select(index: number) {
    setSelected(index);
    setRevision(value => value + 1);
  }
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown": next = (index + 1) % areas.length; break;
      case "ArrowLeft":
      case "ArrowUp": next = (index + areas.length - 1) % areas.length; break;
      case "Home": next = 0; break;
      case "End": next = areas.length - 1; break;
      default: return;
    }
    event.preventDefault();
    buttons.current[next]?.focus();
  }

  function node(index: number) {
    const area = areas[index];
    return <button key={area.title} type="button" role="radio" aria-label={(index + 1) + " " + area.title}
      aria-checked={selected === index} aria-controls={id + "-detail"}
      tabIndex={selected === index ? 0 : -1} ref={el => { buttons.current[index] = el; }}
      onFocus={() => { if (selected !== index) select(index); }}
      onClick={() => select(index)} onKeyDown={event => navigate(event, index)}
      className={styles.node}>
      <span className={styles.number}>{index + 1}</span>
      <Icon name={area.icon} size={29}/>
      <strong>{area.title}</strong>
      <small>{area.subtitle}</small>
    </button>;
  }

  return <div className={styles.map}>
    <div className={styles.title}><Icon name="branch" size={17}/> Follow the connections<span>STUDY MAP</span></div>
    <p className={styles.instruction}>Select an area to explore what I studied.</p>
    <div className={styles.graph} role="radiogroup" aria-label="Areas of undergraduate study">
      <div className={styles.row}>{node(0)}{node(1)}<span className={styles.horizontalArrow} aria-hidden="true">→</span></div>
      <svg className={styles.junction} viewBox="0 0 600 48" preserveAspectRatio="none" aria-hidden="true">
        <path d="M450 0V24H150V46M450 24V46"/>
        <path key={"branch-" + revision} className={styles.trace} pathLength="1"
          d={selected === 2 ? "M450 0V24H150V46" : "M450 0V46"} data-visible={selected === 1 || selected === 2 || selected === 3}/>
        <path className={styles.arrowhead} d="m146 41 4 5 4-5m292 0 4 5 4-5"/>
      </svg>
      <div className={styles.row}>{node(2)}{node(3)}</div>
      <div className={styles.supportConnector} aria-hidden="true"><i/><span>Infrastructure supports both paths</span><i/></div>
      <div className={styles.support}>
        <div className={styles.row}>{node(4)}{node(5)}</div>
      </div>
    </div>
    <div className={styles.detail} id={id + "-detail"} aria-live="polite" aria-atomic="true">
      <div key={current.title + revision} className={styles.detailContent}>
        <div className={styles.detailHeading}><span>{selected + 1}</span><h4>{current.title}</h4></div>
        <p>{current.description}</p>
        <ul aria-label={"Topics in " + current.title}>{current.topics.map(topic => <li key={topic}>{topic}</li>)}</ul>
      </div>
    </div>
    <div className={styles.foundation}><Icon name="lab" size={17}/><span>Physical measurement · Mathematics · Statistics · Probability</span></div>
  </div>;
}
