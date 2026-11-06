"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./LogicLab.module.css";

type Algorithm = "bubble" | "merge" | "quick" | "binary";
type Frame = {
  values: number[];
  active: number[];
  settled: number[];
  range?: [number, number];
  comparisons: number;
  note: string;
};

const input = [54, 18, 73, 35, 89, 26, 67, 9, 42, 58];
const sortedInput = [...input].sort((a, b) => a - b);
const algorithms: Record<Algorithm, { name: string; complexity: string; description: string }> = {
  bubble: { name: "Bubble sort", complexity: "O(n²) worst case", description: "Compare neighbors and move the larger value to the right." },
  merge: { name: "Merge sort", complexity: "O(n log n) worst case", description: "Split the array, then merge the smaller sorted runs in order." },
  quick: { name: "Quick sort", complexity: "O(n log n) average", description: "Choose a pivot and partition the values on either side of it." },
  binary: { name: "Binary search", complexity: "O(log n) worst case", description: "Check the middle of a sorted range and discard half at each step." },
};

function buildFrames(algorithm: Algorithm, target: number): Frame[] {
  const values = [...(algorithm === "binary" ? sortedInput : input)];
  const settled = new Set<number>();
  const frames: Frame[] = [];
  let comparisons = 0;
  function record(note: string, active: number[] = [], range?: [number, number]) {
    frames.push({ values: [...values], active, settled: [...settled], range, comparisons, note });
  }
  function swap(a: number, b: number) {
    [values[a], values[b]] = [values[b], values[a]];
  }
  record(algorithms[algorithm].description);

  if (algorithm === "binary") {
    let low = 0;
    let high = values.length - 1;
    while (low <= high) {
      const middle = Math.floor((low + high) / 2);
      const candidate = values[middle];
      comparisons++;
      if (candidate === target) {
        settled.add(middle);
        record(`Found ${target} at index ${middle}.`, [], [low, high]);
        return frames;
      }
      if (candidate < target) {
        record(`${candidate} < ${target}. Search to the right of index ${middle}.`, [middle], [low, high]);
        low = middle + 1;
      } else {
        record(`${candidate} > ${target}. Search to the left of index ${middle}.`, [middle], [low, high]);
        high = middle - 1;
      }
    }
    record(`The search range is empty. ${target} does not appear in the array.`, [], [0, -1]);
    return frames;
  }

  if (algorithm === "bubble") {
    for (let end = values.length - 1; end > 0; end--) {
      let changed = false;
      for (let j = 0; j < end; j++) {
        comparisons++;
        const a = values[j];
        const b = values[j + 1];
        if (a > b) {
          record(`${a} > ${b}. Swap this pair.`, [j, j + 1]);
          swap(j, j + 1);
          record(`${b} now comes before ${a}.`, [j, j + 1]);
          changed = true;
        } else {
          record(`${a} ≤ ${b}. Keep this pair in place.`, [j, j + 1]);
        }
      }
      settled.add(end);
      record(`${values[end]} has reached its final position at index ${end}.`);
      if (!changed) break;
    }
  }

  if (algorithm === "merge") {
    function mergeSort(start: number, end: number) {
      if (start >= end) return;
      const middle = Math.floor((start + end) / 2);
      record(`Divide indices ${start}–${end} into two runs.`, [], [start, end]);
      mergeSort(start, middle);
      mergeSort(middle + 1, end);
      const merged: number[] = [];
      let left = start;
      let right = middle + 1;
      while (left <= middle && right <= end) {
        const leftValue = values[left];
        const rightValue = values[right];
        const takeLeft = leftValue <= rightValue;
        const next = takeLeft ? leftValue : rightValue;
        comparisons++;
        record(`Compare ${leftValue} and ${rightValue}. Copy ${next} into the merged run.`, [left, right], [start, end]);
        merged.push(next);
        if (takeLeft) left++;
        else right++;
      }
      merged.push(...values.slice(left, middle + 1), ...values.slice(right, end + 1));
      values.splice(start, merged.length, ...merged);
      record(`Write the merged run [${merged.join(", ")}] back to the array.`, [], [start, end]);
    }
    mergeSort(0, values.length - 1);
  }

  if (algorithm === "quick") {
    function quickSort(start: number, end: number) {
      if (start > end) return;
      if (start === end) {
        settled.add(start);
        return;
      }
      const pivot = values[end];
      record(`Partition indices ${start}–${end} around pivot ${pivot}.`, [end], [start, end]);
      let boundary = start;
      for (let scan = start; scan < end; scan++) {
        const candidate = values[scan];
        comparisons++;
        if (candidate <= pivot) {
          record(`${candidate} ≤ pivot ${pivot}. Include it in the left partition.`, [scan, end], [start, end]);
          if (boundary !== scan) {
            swap(boundary, scan);
            record(`Move ${candidate} to index ${boundary} in the left partition.`, [boundary, scan], [start, end]);
          }
          boundary++;
        } else {
          record(`${candidate} > pivot ${pivot}. Leave it in the right partition.`, [scan, end], [start, end]);
        }
      }
      swap(boundary, end);
      settled.add(boundary);
      record(`Place pivot ${pivot} at its final index, ${boundary}.`, [], [start, end]);
      quickSort(start, boundary - 1);
      quickSort(boundary + 1, end);
    }
    quickSort(0, values.length - 1);
  }

  values.forEach((_, index) => settled.add(index));
  record("Sorted. Every value is in ascending order.");
  return frames;
}

function ControlIcon({ kind }: { kind: "play" | "pause" | "step" | "reset" | "arrow" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {kind === "play" && <path d="m5 3 7 5-7 5z" fill="currentColor" stroke="none" />}
      {kind === "pause" && <path d="M5 3.5v9m6-9v9" strokeWidth="2.5" />}
      {kind === "step" && <path d="m3.5 3.5 6 4.5-6 4.5zM12.5 3.5v9" />}
      {kind === "reset" && <path d="M3.4 6a5 5 0 1 1 .6 5M2.5 2.9v3.8h3.8" />}
      {kind === "arrow" && <path d="m4 6 4 4 4-4" />}
    </svg>
  );
}

export default function LogicLab() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("bubble");
  const [target, setTarget] = useState(67);
  const [position, setPosition] = useState(0);
  const [running, setRunning] = useState(false);
  const [intervalMs, setIntervalMs] = useState(450);
  const frames = useMemo(() => buildFrames(algorithm, target), [algorithm, target]);
  const frame = frames[position];
  const last = frames.length - 1;
  const complete = position === last;

  useEffect(() => {
    if (!running || complete) return;
    const timer = window.setTimeout(() => {
      setPosition(position + 1);
      if (position + 1 === last) setRunning(false);
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [running, complete, position, last, intervalMs]);

  function reset() {
    setRunning(false);
    setPosition(0);
  }
  function toggleRun() {
    if (complete) setPosition(0);
    setRunning(previous => !previous);
  }
  const status = complete ? "Complete" : running ? "Running" : position > 0 ? "Paused" : "Ready";

  return (
    <section className={styles.lab} aria-label="Logic Lab">
      <div className={styles.heading}>
        <h1>Logic Lab<span>.</span></h1>
        <p>Explore sorting and searching algorithms one step at a time.</p>
      </div>
      <div className={styles.panel}>
        <div className={styles.toolbar}>
          <label className={styles.field}>Algorithm
            <span className={styles.select}>
              <select value={algorithm} onChange={event => { reset(); setAlgorithm(event.target.value as Algorithm); }}>
                {Object.entries(algorithms).map(([key, meta]) => <option key={key} value={key}>{meta.name}</option>)}
              </select>
              <ControlIcon kind="arrow" />
            </span>
          </label>
          {algorithm === "binary" && <label className={styles.field}>Target
            <span className={styles.select}>
              <select value={target} onChange={event => { reset(); setTarget(Number(event.target.value)); }}>
                {[...sortedInput, 99].map(value => <option key={value} value={value}>{value}</option>)}
              </select>
              <ControlIcon kind="arrow" />
            </span>
          </label>}
          <label className={styles.field}>Speed
            <span className={styles.select}>
              <select value={intervalMs} onChange={event => setIntervalMs(Number(event.target.value))}>
                <option value={900}>0.5×</option><option value={450}>1×</option><option value={225}>2×</option>
              </select>
              <ControlIcon kind="arrow" />
            </span>
          </label>
        </div>
        <div className={styles.plot}>
          <div className={styles.plotMeta}>
            <span><i aria-hidden="true" />{status}</span>
            <span>{algorithms[algorithm].complexity}</span>
          </div>
          <div className={styles.bars} role="img" aria-label={`Array values: ${frame.values.join(", ")}. ${frame.note}`}>
            {frame.values.map((value, i) => {
              const muted = frame.range && (i < frame.range[0] || i > frame.range[1]);
              const state = frame.settled.includes(i) ? "settled" : frame.active.includes(i) ? "active" : muted ? "muted" : "idle";
              return <div className={styles.column} key={i} data-state={state}>
                <span className={styles.bar} style={{ height: `${value}%` }}><span>{value}</span></span>
                <span className={styles.index}>{String(i).padStart(2, "0")}</span>
              </div>;
            })}
          </div>
        </div>
        <div className={styles.progress} aria-hidden="true"><span style={{ width: `${position / last * 100}%` }} /></div>
        <div className={styles.readout} aria-live={running ? "off" : "polite"} aria-atomic="true">
          <span>Step {String(position).padStart(2, "0")} / {last} <b>·</b> {frame.comparisons} {frame.comparisons === 1 ? "comparison" : "comparisons"}</span>
          <p>{frame.note}</p>
        </div>
        <div className={styles.controls}>
          <button type="button" className={styles.primary} onClick={toggleRun}><ControlIcon kind={running ? "pause" : "play"} />{running ? "Pause" : complete ? "Replay" : position ? "Resume" : "Run"}</button>
          <button type="button" disabled={complete} onClick={() => { setRunning(false); setPosition(index => Math.min(index + 1, last)); }}><ControlIcon kind="step" />Step</button>
          <button type="button" disabled={position === 0 && !running} onClick={reset}><ControlIcon kind="reset" />Reset</button>
        </div>
      </div>
    </section>
  );
}
