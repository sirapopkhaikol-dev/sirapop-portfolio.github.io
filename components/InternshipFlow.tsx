"use client";

import { useEffect, useId, useState } from "react";
import Icon from "./Icon";
import styles from "./InternshipFlow.module.css";

const windows = [
  { label: "Jan–Mar", start: "01 Jan", end: "01 Apr" },
  { label: "Apr–Jun", start: "01 Apr", end: "01 Jul" },
  { label: "Jul–Sep", start: "01 Jul", end: "01 Oct" },
  { label: "Oct–Dec", start: "01 Oct", end: "01 Jan (next year)" },
];
const streamSteps = [
  { name: "Machine → PLC", detail: "The machine and PLC provide the signals used to monitor equipment status.", nodes: [0, 1] },
  { name: "Capture & store", detail: "Collection software receives the machine data and writes it to the database. The backend service makes that stored data available to the application.", nodes: [2, 3, 4] },
  { name: "Publish & subscribe", detail: "Redis Pub/Sub distributes live update messages to subscribing services. The database holds the stored records, while Pub/Sub carries the notifications.", nodes: [5] },
  { name: "SSE → dashboard", detail: "The server sends updates to the browser through an SSE connection, allowing the web dashboard to refresh its machine status and alerts.", nodes: [6, 7] },
];
const nodes = [
  { x: 16, y: 22, label: "Machine", type: "machine" },
  { x: 156, y: 22, label: "PLC", type: "chip" },
  { x: 296, y: 22, label: "Collector", type: "code" },
  { x: 436, y: 22, label: "Database", type: "database" },
  { x: 436, y: 181, label: "Service API", type: "code" },
  { x: 296, y: 181, label: "Redis Pub/Sub", type: "publish" },
  { x: 156, y: 181, label: "SSE endpoint", type: "publish" },
  { x: 16, y: 181, label: "Web dashboard", type: "screen" },
];

function DiagramIcon({ type }: { type: string }) {
  return <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    {type === "database" ? <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v13c0 4 18 4 18 0V5M3 11c0 4 18 4 18 0"/></> :
      type === "chip" ? <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="8" y="8" width="8" height="8"/><path d="M8 1v3m8-3v3M8 20v3m8-3v3M1 8h3m-3 8h3m16-8h3m-3 8h3"/></> :
      type === "screen" ? <><rect x="2" y="3" width="20" height="15" rx="2"/><path d="M8 22h8m-4-4v4M5 13l4-3 4 2 6-6"/></> :
      type === "publish" ? <><circle cx="12" cy="12" r="3"/><path d="M6 6a8.5 8.5 0 0 0 0 12m12-12a8.5 8.5 0 0 1 0 12M3 3a13 13 0 0 0 0 18M21 3a13 13 0 0 1 0 18"/></> :
      type === "machine" ? <><path d="M3 21h18M5 21v-4l5-3-3-6 5-5 5 5-4 4 3 4m-3-4 5-2 3 3m-3-3 2-3"/><circle cx="10" cy="14" r="2"/><circle cx="12" cy="5" r="2"/></> :
      <><path d="m8 5-6 7 6 7m8-14 6 7-6 7m-3-17-2 20"/></>}
  </g>;
}

export default function InternshipFlow({ kind }: { kind: "migration" | "stream" }) {
  const [quarter, setQuarter] = useState(0);
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [revision, setRevision] = useState(0);
  const id = useId();
  const range = windows[quarter];

  useEffect(() => {
    if (!running || kind !== "migration") return;
    const timer = window.setTimeout(() => {
      if (quarter === windows.length - 1) setRunning(false);
      else setQuarter(value => value + 1);
    }, 1500);
    return () => clearTimeout(timer);
  }, [running, quarter, kind]);

  return <div className={styles.flow}>
    <div className={styles.heading}><Icon name="branch" size={16}/>{kind === "migration" ? "A bounded migration loop" : "Machine-to-browser data flow"}<span>CONCEPTUAL DIAGRAM</span></div>
    {kind === "migration" ? <>
      <div className={styles.windows} role="group" aria-label="Illustrative three-month windows">
        {windows.map((item,index)=><button type="button" key={item.label} aria-pressed={quarter===index}
          onClick={()=>{setRunning(false);setQuarter(index);}}><span>{index+1}</span>{item.label}</button>)}
      </div>
      <div className={styles.viewport} tabIndex={0} role="region" aria-label="MongoDB migration flow diagram">
        <svg className={styles.chart} viewBox="0 0 560 206" role="img" aria-labelledby={id+"-title"}>
          <title id={id+"-title"}>Select a three-month range, filter matching documents, join and transform, write and verify, then move to the next date window.</title>
          <defs><marker id={id+"-arrow"} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="m1 1 8 4-8 4" fill="none" stroke="#b9d993" strokeWidth="1.3"/></marker></defs>
          <path className={styles.connector} markerEnd={"url(#"+id+"-arrow)"} d="M128 77h23m105 0h23m105 0h23M464 115v48H72v-42"/>
          <path key={quarter+"-"+running} className={styles.signal} pathLength="1" d="M128 77h23m105 0h23m105 0h23M464 115v48H72v-42"/>
          {[{label:"Date window",icon:"database"}, {label:"Filter first",icon:"chip"}, {label:"Join & transform",icon:"code"}, {label:"Write & verify",icon:"database"}].map((item,index)=><g key={item.label} transform={`translate(${16+index*132} 36)`} className={styles.node}>
            <rect width="112" height="80" rx="7"/><g transform="translate(44 12)"><DiagramIcon type={item.icon}/></g>
            <text x="56" y="64" textAnchor="middle">{item.label}</text>
          </g>)}
          <text className={styles.annotation} x="272" y="186" textAnchor="middle">Advance the range, then repeat</text>
        </svg>
      </div>
      <div className={styles.filter} aria-live="polite"><span>Illustrative date filter</span><code>date ≥ {range.start}<br/>date &lt; {range.end}</code></div>
      <div className={styles.controls}><button type="button" onClick={()=>{
        if (running) setRunning(false);
        else { if(quarter===3)setQuarter(0);setRunning(true); }
      }}>{running ? "Pause demo" : quarter===3 ? "Replay batch demo" : "Run batch demo"}<Icon name="arrow" size={14}/></button><span>One window at a time</span></div>
    </> : <>
      <div className={styles.viewport} tabIndex={0} role="region" aria-label="Western Digital data flow diagram">
        <svg className={styles.chart} viewBox="0 0 568 300" role="img" aria-labelledby={id+"-title"}>
          <title id={id+"-title"}>Machine to PLC, collector, database, service API, Redis Pub/Sub, SSE endpoint, and the web dashboard.</title>
          <defs><marker id={id+"-arrow"} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="m1 1 8 4-8 4" fill="none" stroke="#b9d993" strokeWidth="1.3"/></marker></defs>
          <g className={styles.connector} markerEnd={"url(#"+id+"-arrow)"}>
            <path d="M128 62h25M268 62h25M408 62h25M492 102v76M436 221h-25M296 221h-25M156 221h-25"/>
          </g>
          <path key={step+"-"+revision} className={styles.signal} pathLength="1" d={["M128 62h25","M268 62h25m115 0h25m59 40v76","M436 221h-25","M296 221h-25m-115 0h-25"][step]}/>
          {nodes.map((node,index)=><g key={node.label} className={styles.node} data-active={streamSteps[step].nodes.includes(index)} transform={`translate(${node.x} ${node.y})`}>
            <rect width="112" height="80" rx="7"/><g transform="translate(44 12)"><DiagramIcon type={node.type}/></g>
            <text x="56" y="64" textAnchor="middle">{node.label}</text>
          </g>)}
          <text className={styles.annotation} x="280" y="145" textAnchor="middle">Capture → store → publish → display</text>
        </svg>
      </div>
      <div className={styles.steps} role="group" aria-label="Explore the live data flow">
        {streamSteps.map((item,index)=><button type="button" key={item.name} aria-pressed={step===index}
          onClick={()=>{setStep(index);setRevision(value=>value+1);}}>{item.name}</button>)}
      </div>
      <p key={step} className={styles.explanation} aria-live="polite">{streamSteps[step].detail}</p>
      <div className={styles.sources}><a href="https://redis.io/docs/latest/develop/use-cases/pub-sub/" target="_blank" rel="noreferrer">Redis Pub/Sub ↗</a><a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events" target="_blank" rel="noreferrer">SSE ↗</a></div>
    </>}
    <span className={styles.scrollHint}>Scroll sideways to follow the whole diagram.</span>
  </div>;
}
