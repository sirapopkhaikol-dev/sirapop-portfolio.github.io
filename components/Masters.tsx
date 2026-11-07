"use client";

import { useState } from "react";
import Icon from "./Icon";
import styles from "./Masters.module.css";

const policies = [
  { name: "Round Robin", icon: "journey", detail: "A baseline that sends requests to servers in turn. I’m interested in how this simple distribution behaves when request costs or server conditions differ.", feedback: "Cyclic routing across the server pool" },
  { name: "Aware", icon: "network", detail: "Here, Aware represents a resource-aware policy family. The research considers how observed server conditions could inform routing. The exact signals, weights, and decision rules are part of the investigation.", feedback: "Resource observations can inform routing" },
  { name: "Machine learning", icon: "neural", detail: "I’m also exploring machine learning approaches to routing. This involves investigating whether features describing workload and server conditions can support useful decisions, and how those decisions compare with the baselines.", feedback: "Workload and resource features inform a model-based policy" },
] as const;
const metrics = [
  { name: "Throughput", unit: "Completed requests / time", detail: "How much work does the system complete during the observation period? I want to compare useful completed work alongside the resources it consumes." },
  { name: "Error rate", unit: "Failed requests / total requests", detail: "How often do requests fail under the test conditions? Looking at errors alongside throughput helps make the comparison more informative." },
  { name: "Bandwidth", unit: "Network traffic / time", detail: "How much data moves through the system? This adds a network perspective to the comparison of routing methods." },
  { name: "CPU", unit: "Processor utilization", detail: "How is processing demand distributed across servers? CPU utilization helps describe whether some machines are carrying more work than others." },
  { name: "RAM", unit: "Memory usage", detail: "How much memory does each server use during a run? Memory is a separate resource to observe alongside CPU utilization." },
  { name: "Storage", unit: "Disk activity & storage usage", detail: "What happens to disk reads, writes, and storage usage while requests are processed? These observations can add context to resource pressure." },
  { name: "Latency", unit: "Response time", detail: "An additional comparison lens is how long requests take to return. Looking at the response-time distribution can show behavior that an average alone may hide." },
];

export default function Masters() {
  const [policy, setPolicy] = useState(0);
  const [metric, setMetric] = useState(0);
  const current = policies[policy];
  return <div className={styles.chapter}>
    <div className={styles.present}><span aria-hidden="true"/> CURRENT CHAPTER · RESEARCH IN PROGRESS</div>
    <h2>Studying how servers<br/>share the load<span>.</span></h2>
    <div className={styles.degree}>
      <Icon name="lab" size={25}/>
      <div><strong>AIoT and Information Engineering</strong><span>Master’s degree · Currently studying</span></div>
    </div>
    <p>I’m currently pursuing my master’s degree in AIoT and Information Engineering at King Mongkut’s Institute of Technology Ladkrabang. My research focuses on server optimization through the comparison of load-balancing methods, including Round Robin, Aware policies, and machine learning approaches.</p>
    <div className={styles.question}><Icon name="branch" size={23}/><div><span>Research question</span><p>How do different routing methods affect system performance and server resource use?</p></div></div>
    <div className={styles.sectionHeading}><Icon name="network" size={22}/><h3>One system, different routing decisions</h3></div>
    <p>The comparison centers on what changes when the routing policy changes. A shared workload and server setup provide a basis for examining throughput, failures, traffic, and resource use.</p>
    <div className={styles.experiment}>
      <div className={styles.experimentTitle}>Explore the comparison<span>CONCEPTUAL DIAGRAM</span></div>
      <div className={styles.policies} role="group" aria-label="Load-balancing policy">
        {policies.map((item,index)=><button key={item.name} type="button" aria-pressed={policy===index} onClick={()=>setPolicy(index)}><span>{index+1}</span>{item.name}</button>)}
      </div>
      <div className={styles.diagram} key={"diagram-" + policy} role="img" aria-label={"Shared workload enters the " + current.name + " policy, which distributes requests across three backend servers. Telemetry is collected for comparison."}>
        <div className={styles.workload}><Icon name="code" size={20}/><div><strong>Shared test workload</strong><small>Requests into the same test setup</small></div></div>
        <span className={styles.down} aria-hidden="true">↓</span>
        <div className={styles.router}><Icon name={current.icon} size={26}/><div><small>Policy under comparison</small><strong>{current.name}</strong></div></div>
        <svg className={styles.paths} viewBox="0 0 600 44" preserveAspectRatio="none" aria-hidden="true">
          <path d="M300 0V20H100V42M300 20V42M300 20H500V42"/>
          <path className={styles.packet} pathLength="1" d="M300 0V20H100V42"/>
          <path className={styles.packet} pathLength="1" d="M300 0V42"/>
          <path className={styles.packet} pathLength="1" d="M300 0V20H500V42"/>
        </svg>
        <div className={styles.servers}>{["A","B","C"].map(letter=><div key={letter}>
          <svg width="27" height="29" viewBox="0 0 28 30" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><rect x="3" y="2" width="22" height="11" rx="2"/><rect x="3" y="17" width="22" height="11" rx="2"/><path d="M8 7.5h1m4 0h7M8 22.5h1m4 0h7"/></svg>
          <strong>Server {letter}</strong><small>Backend instance</small>
        </div>)}</div>
        <div className={styles.telemetry}><Icon name="grid" size={18}/><span>Collect performance &amp; resource observations</span></div>
        <div className={styles.feedback}><Icon name="branch" size={15}/>{current.feedback}</div>
      </div>
      <p className={styles.policyDetail} key={"policy-detail-" + policy} aria-live="polite">{current.detail}</p>
      <a className={styles.source} href="https://nginx.org/en/docs/http/load_balancing.html" target="_blank" rel="noopener noreferrer">Load-balancing background ↗</a>
    </div>
    <div className={styles.sectionHeading}><Icon name="grid" size={22}/><h3>What I’m comparing</h3></div>
    <p>I’m looking at both application performance and server health. CPU, RAM, and storage describe different resources, so I consider them separately.</p>
    <div className={styles.metrics}>
      <div className={styles.metricTabs} role="group" aria-label="Research comparison metrics">
        {metrics.map((item,index)=><button type="button" key={item.name} aria-pressed={metric===index} onClick={()=>setMetric(index)}>{item.name}</button>)}
      </div>
      <div className={styles.metricDetail} key={metric} aria-live="polite"><span>{metrics[metric].unit}</span><h4>{metrics[metric].name}</h4><p>{metrics[metric].detail}</p></div>
    </div>
    <div className={styles.sectionHeading}><Icon name="journey" size={22}/><h3>A cycle of testing and learning</h3></div>
    <ol className={styles.workflow}>
      {["Define comparable test conditions", "Run the candidate policies", "Collect and examine measurements", "Compare trade-offs and refine the experiment"].map((item,index)=><li key={item}><span>{index+1}</span>{item}</li>)}
    </ol>
    <div className={styles.reflection}><Icon name="star" size={24}/><div><h3>This is what I’m working on now</h3><p>The research is ongoing. I’m building on my software and infrastructure background to understand how routing decisions interact with workload, resource use, and reliability.</p><p>I want to be able to explain the conditions behind a result and use those observations to guide the next experiment.</p></div></div>
  </div>;
}
