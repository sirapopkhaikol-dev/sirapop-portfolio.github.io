"use client";

import { useState } from "react";
import Icon from "./Icon";
import { routingDecision, routingMethods, sampleServers, type RoutingMethod } from "./routingMethods";
import base from "./Masters.module.css";
import styles from "./RoutingExplainer.module.css";

export default function RoutingExplainer() {
  const [method, setMethod] = useState<RoutingMethod>("round");
  const [request, setRequest] = useState(0);
  const [visitor, setVisitor] = useState("visitor-A");
  const current = routingMethods.find(item => item.id === method)!;
  const decision = routingDecision(method, request, visitor);
  function select(next: RoutingMethod) { setMethod(next); setRequest(0); }
  function methods(from: number, to: number) {
    return routingMethods.slice(from, to).map((item, index) => <button type="button" key={item.id}
      aria-pressed={method === item.id} onClick={() => select(item.id)}><span>{from + index + 1}</span>{item.name}</button>);
  }
  return <div className={base.experiment}>
    <div className={base.experimentTitle}>How does a method choose?<span>ILLUSTRATIVE ROUTING LOGIC</span></div>
    <div className={styles.groupTitle}>My research focus</div>
    <div className={base.policies} role="group" aria-label="Research routing methods">{methods(0, 3)}</div>
    <div className={styles.groupTitle}>Other methods to explore</div>
    <div className={base.policies} role="group" aria-label="Additional routing methods">{methods(3, 8)}</div>
    <div className={styles.logic} key={"logic-" + method}>
      <h4>{current.name}</h4><p>{current.rule}</p><code>{current.formula}</code>
    </div>
    {method === "hash" && <label className={styles.keyField}>Example visitor key
      <select value={visitor} onChange={event => { setVisitor(event.target.value); setRequest(0); }}>
        {["visitor-A", "visitor-B", "visitor-C"].map(key => <option key={key}>{key}</option>)}
      </select>
    </label>}
    <figure className={styles.diagram} aria-label="Illustrative routing decision">
      <figcaption>Example inputs before request {request + 1}<span>Three available servers</span></figcaption>
      <div className={base.router}><Icon name={method === "ml" ? "neural" : "network"} size={25}/><div><small>Decision rule</small><strong>{current.name}</strong></div></div>
      <svg className={base.paths} viewBox="0 0 600 44" preserveAspectRatio="none" aria-hidden="true">
        <path d="M300 0V20H100V42M300 20V42M300 20H500V42"/>
        <path key={method + "-" + request + "-" + visitor} className={base.packet} pathLength="1"
          d={["M300 0V20H100V42", "M300 0V42", "M300 0V20H500V42"][decision.target]}/>
      </svg>
      <div className={styles.servers}>{sampleServers.map((server, index) => <div key={server.name}
        data-chosen={decision.target === index} data-candidate={method === "two" && decision.candidates.includes(index)}>
        <Icon name="network" size={24}/><strong>Server {server.name}</strong>
        <dl>
          {(method === "round" || method === "weighted" || method === "connections" || method === "two") && <><dt>Active</dt><dd>{decision.connections[index]}</dd></>}
          {method === "weighted" && <><dt>Weight</dt><dd>{server.weight}</dd></>}
          {method === "latency" && <><dt>Response</dt><dd>{server.response} ms</dd></>}
          {method === "aware" && <><dt>CPU</dt><dd>{server.cpu}%</dd><dt>RAM</dt><dd>{server.ram}%</dd><dt>Score</dt><dd>{decision.resourceScores[index]}</dd></>}
          {method === "ml" && <><dt>Mock cost</dt><dd>{server.prediction} ms</dd></>}
          {method === "hash" && <><dt>Pool index</dt><dd>{index}</dd></>}
        </dl>
        <span className={styles.chosen}>{decision.target === index ? "Chosen" : method === "two" && decision.candidates.includes(index) ? "Sampled" : "Available"}</span>
      </div>)}</div>
    </figure>
    <div className={styles.decision} aria-live="polite" aria-atomic="true"><span>Request {request + 1} → Server {sampleServers[decision.target].name}</span><p>{decision.reason}</p></div>
    <div className={styles.controls}>
      <button type="button" disabled={request === 11} onClick={() => setRequest(index => index + 1)}>Next request <Icon name="arrow" size={14}/></button>
      <button type="button" onClick={() => setRequest(0)}>Reset example</button>
      <span>{request + 1} / 12</span>
    </div>
    <p className={styles.notes}>Sample inputs are illustrative. Earlier example requests stay connected until reset. CPU, RAM, timing, and mock model estimates are held fixed to make each rule easy to inspect.</p>
    <div className={styles.tradeoff}><strong>What to consider</strong><p>{current.tradeoff}</p></div>
    <div className={styles.sources}><a href="https://nginx.org/en/docs/http/load_balancing.html" target="_blank" rel="noopener noreferrer">Round Robin, weights &amp; connections ↗</a><a href="https://nginx.org/en/docs/http/ngx_http_upstream_module.html" target="_blank" rel="noopener noreferrer">Hashing, timing &amp; random-two variants ↗</a></div>
  </div>;
}
