"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import styles from "./ModelDiagram.module.css";

const views = [
  {
    name: "Regional models",
    steps: [
      { name: "Group by area", detail: "Split the data by geography so each model can learn patterns within its own region." },
      { name: "Train local models", detail: "Train a separate model for each area. North, East, and Bangkok illustrate the regional branches in the model design." },
      { name: "Combine predictions", detail: "Concatenate the predictions from the regional branches into a single prediction set." },
    ],
  },
  {
    name: "Ensemble network",
    steps: [
      { name: "Validation folds", detail: "Divide training data into four folds. Each model trains on one portion and validates on the held-out portion, as shown in the reference design." },
      { name: "Train CatBoost", detail: "Train a CatBoost model for each fold. Validation predictions from held-out data form the out-of-fold prediction set." },
      { name: "Average predictions", detail: "Run the test data through the trained models, then average their predictions into one final prediction set." },
      { name: "Evaluate", detail: "Use the out-of-fold predictions for the cross-validation score. The competition evaluates the submitted predictions using AUC." },
    ],
  },
];

function Box({ x, y, width, label, active = false, warm = false }: { x: number; y: number; width: number; label: string; active?: boolean; warm?: boolean }) {
  return <g className={active ? styles.activeBox : styles.box} data-warm={warm}>
    <rect x={x} y={y} width={width} height="32" rx="5"/>
    <text x={x + width / 2} y={y + 20} textAnchor="middle">{label}</text>
  </g>;
}

export default function ModelDiagram() {
  const [view, setView] = useState(0);
  const [step, setStep] = useState(0);
  const [revision, setRevision] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const marker = id + "-arrow";
  const activate = (index: number) => { setView(index); setStep(0); setRevision(value => value + 1); };
  const chooseStep = (index: number) => { setStep(index); setRevision(value => value + 1); };
  function navigate(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : 1 - view;
    activate(next);
    buttons.current[next]?.focus();
  }
  return <div className={styles.model}>
    <div className={styles.tabs} role="tablist" aria-label="Model architecture">
      {views.map((item, index) => <button key={item.name} type="button" role="tab" ref={node => { buttons.current[index] = node; }}
        id={id + "-tab-" + index} aria-controls={id + "-panel"} aria-selected={view === index}
        tabIndex={view === index ? 0 : -1} onClick={() => activate(index)} onKeyDown={navigate}>{item.name}</button>)}
    </div>
    <div id={id + "-panel"} role="tabpanel" aria-labelledby={id + "-tab-" + view}>
      <div className={styles.viewport} tabIndex={0} role="region" aria-label="Model flow diagram">
      <svg key={view + "-" + revision} className={styles.chart} viewBox={view === 0 ? "0 0 560 310" : "0 0 560 350"}
        role="img" aria-labelledby={id + "-title " + id + "-desc"}>
        <title id={id + "-title"}>{views[view].name}</title>
        <desc id={id + "-desc"}>{view === 0 ? "Data is grouped by area, sent to North, East and Bangkok models, then each regional prediction is concatenated into one output." : "Four training and validation folds feed four CatBoost models. Held-out predictions yield a cross-validation AUC score. Test predictions from the models are averaged into the final predictions."}</desc>
        <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="m1 1 8 4-8 4" fill="none" stroke="currentColor" strokeWidth="1.5"/></marker></defs>
        {view === 0 ? <>
          <g className={styles.edges} markerEnd={"url(#" + marker + ")"}>
            <path d="M280 46v25M280 103v19H100v27M280 103v46M280 122h180v27M100 181v25M280 181v25M460 181v25M100 238v15h180v20M280 238v35M460 238v15H280"/>
          </g>
          <g className={styles.signal} markerEnd={"url(#" + marker + ")"}><path pathLength="1" d={step === 0 ? "M280 46v25" : step === 1 ? "M280 103v19H100v27" : "M100 238v15h180v20"}/></g>
          <Box x={175} y={14} width={210} label="Input data" active={step === 0}/>
          <Box x={175} y={71} width={210} label="Group by area" active={step === 0}/>
          {["North", "East", "Bangkok"].map((area, i) => <g key={area}>
            <Box x={32+i*180} y={149} width={136} label={area + " model"} active={step === 1}/>
            <Box x={32+i*180} y={206} width={136} label={area + " predictions"} active={step === 2}/>
          </g>)}
          <Box x={158} y={273} width={244} label="Concatenate predictions" active={step === 2}/>
        </> : <>
          <g className={styles.edges} markerEnd={"url(#" + marker + ")"}>
            <path d="M106 46v18M298 46v13h-78v160M365 90v154H106v12M548 90v154h-72v12M106 288v25M476 288v25"/>
            {[90,130,170,210].map(y=><path key={y} d={`M190 ${y}h42M220 ${y-8}h12M350 ${y}h61M540 ${y}h8`}/>)}
          </g>
          <Box x={28} y={14} width={156} label="Training data" active={step === 0}/>
          <Box x={242} y={14} width={112} label="Test data" warm/>
          <rect className={styles.foldFrame} x="20" y="64" width="178" height="168" rx="7"/>
          {[0,1,2,3].map(fold=><g key={fold}>
            {[0,1,2,3].map(part=><rect key={part} x={29+part*40} y={77+fold*40} width="36" height="25" rx="3" className={part===fold ? styles.validation : styles.training}/>)}
            <text className={styles.foldLabel} x="106" y={94+fold*40} textAnchor="middle">Fold {fold+1} · train / val</text>
            <Box x={234} y={74+fold*40} width={116} label={"CatBoost " + (fold+1)} active={step === 1}/>
            <Box x={412} y={74+fold*40} width={128} label={"Prediction " + (fold+1)} active={step === 2}/>
          </g>)}
          <g className={styles.signal} markerEnd={"url(#" + marker + ")"}><path pathLength="1" d={step===0 ? "M106 46v18" : step===1 ? "M190 90h42" : step===2 ? "M350 90h61" : "M106 288v25"}/></g>
          <Box x={20} y={256} width={172} label="Out-of-fold predictions" active={step===1 || step===3}/>
          <Box x={412} y={256} width={128} label="Average" active={step===2}/>
          <Box x={20} y={313} width={172} label="CV AUC score" active={step===3} warm/>
          <Box x={396} y={313} width={160} label="Final predictions" active={step===2}/>
        </>}
      </svg>
      </div>
      <span className={styles.hint}>Scroll sideways to explore the full diagram.</span>
      <div className={styles.steps} role="group" aria-label="Explore model steps">
        {views[view].steps.map((item,index)=><button key={item.name} type="button" aria-pressed={step===index} onClick={()=>chooseStep(index)}><span>{index+1}</span>{item.name}</button>)}
      </div>
      <p className={styles.explanation} key={view+"-"+step} aria-live="polite">{views[view].steps[step].detail}</p>
    </div>
  </div>;
}
