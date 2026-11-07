"use client";

import { useState } from "react";
import Icon from "./Icon";
import RoutingExplainer from "./RoutingExplainer";
import styles from "./Masters.module.css";

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
  const [metric, setMetric] = useState(0);
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
    <p>The comparison centers on what changes when the routing policy changes. A shared workload and server setup provide a basis for examining throughput, failures, traffic, and resource use. Explore the decision rules below: the first three relate to my research focus, while the additional methods provide background for comparison. These examples explain the logic; they are not experimental findings.</p>
    <RoutingExplainer/>
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
