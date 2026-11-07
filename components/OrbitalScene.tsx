"use client";

import LoadingImage from "./LoadingImage";
import { sitePath } from "./sitePath";
import { useEffect, useId, useRef, useState } from "react";
import { drawOrbit, homeCamera } from "./orbitalGeometry";
import styles from "./OrbitalScene.module.css";

const clampPitch = (angle: number) => Math.max(-1.48, Math.min(1.48, angle));

type SceneControls = { toggle: () => void; reset: () => void; focus: () => void; suspend: (value: boolean) => void };

export default function OrbitalScene({ suspended = false }: { suspended?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useRef<SceneControls | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const instructions = useId();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let running = !motion.matches;
    let inView = true, suspended = false;
    let width = 0, height = 0, elapsed = 0, lastDraw = 0;
    let yaw = homeCamera.yaw, pitch = homeCamera.pitch;
    let frame: number | null = null;
    let drag: { id: number; x: number; y: number } | null = null;
    let painted = false;
    const isVisible = () => inView && !suspended && !document.hidden && width > 0 && height > 0;

    function paint() {
      if (!isVisible() || !ctx) return;
      const camera = {
        yaw: yaw + .065 * Math.sin(elapsed * .16),
        pitch: pitch + .025 * Math.sin(elapsed * .26),
        roll: homeCamera.roll + .018 * Math.sin(elapsed * .16),
      };
      drawOrbit(ctx, width, height, camera, elapsed);
      if (!painted) { painted = true; setReady(true); }
    }
    function tick(now: number) {
      frame = null;
      if (!isVisible() || !running) return;
      // A modest frame rate leaves room for page interactions on mobile GPUs.
      if (!lastDraw || now - lastDraw >= 1000 / 30 - 1) {
        if (lastDraw) elapsed += Math.min(now - lastDraw, 100) / 1000;
        lastDraw = now;
        paint();
      }
      frame = requestAnimationFrame(tick);
    }
    function refresh() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      lastDraw = 0;
      if (!isVisible()) return;
      paint();
      if (running) frame = requestAnimationFrame(tick);
    }
    function resize() {
      if (!canvas || !ctx) return;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      refresh();
    }
    function setRunning(value: boolean) {
      running = value;
      setPlaying(value);
      refresh();
    }
    function reset() {
      yaw = homeCamera.yaw;
      pitch = homeCamera.pitch;
      elapsed = 0;
      refresh();
    }
    function startDrag(event: PointerEvent) {
      if (!canvas || drag || event.button !== 0 || !event.isPrimary) return;
      canvas.setPointerCapture(event.pointerId);
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      canvas.dataset.dragging = "true";
    }
    function moveDrag(event: PointerEvent) {
      if (!drag || drag.id !== event.pointerId) return;
      yaw -= (event.clientX - drag.x) * .009;
      pitch = clampPitch(pitch - (event.clientY - drag.y) * .008);
      drag.x = event.clientX;
      drag.y = event.clientY;
      if (!running) paint();
    }
    function endDrag(event: PointerEvent) {
      if (drag?.id !== event.pointerId || !canvas) return;
      drag = null;
      delete canvas.dataset.dragging;
      if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    }
    function keyboard(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowLeft": yaw += .13; break;
        case "ArrowRight": yaw -= .13; break;
        case "ArrowUp": pitch = clampPitch(pitch + .11); break;
        case "ArrowDown": pitch = clampPitch(pitch - .11); break;
        default: return;
      }
      event.preventDefault();
      paint();
    }
    controls.current = {
      toggle: () => setRunning(!running),
      reset,
      focus: () => { yaw = homeCamera.yaw; pitch = homeCamera.pitch; refresh(); },
      suspend: value => { suspended = value; refresh(); },
    };
    const motionChange = () => setRunning(!motion.matches);
    const sizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      refresh();
    });
    sizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    motion.addEventListener("change", motionChange);
    document.addEventListener("visibilitychange", refresh);
    canvas.addEventListener("pointerdown", startDrag);
    canvas.addEventListener("pointermove", moveDrag);
    canvas.addEventListener("lostpointercapture", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("keydown", keyboard);
    setPlaying(running);
    resize();
    return () => {
      controls.current = null;
      if (frame !== null) cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      visibilityObserver.disconnect();
      motion.removeEventListener("change", motionChange);
      document.removeEventListener("visibilitychange", refresh);
      canvas.removeEventListener("pointerdown", startDrag);
      canvas.removeEventListener("pointermove", moveDrag);
      canvas.removeEventListener("lostpointercapture", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("keydown", keyboard);
    };
  }, []);
  useEffect(() => { controls.current?.suspend(suspended); }, [suspended]);

  return <div className={styles.scene}>
    {!ready && <LoadingImage fill frameClassName={styles.fallback} className={styles.fallback} src={sitePath("/earth-orbital-field.svg")}  width="660" height="430" alt="Earth facing Southeast Asia, with a Bangkok marker and an orbiting satellite."/>}
    <canvas ref={canvasRef} className={styles.canvas} tabIndex={ready ? 0 : -1}
      role="img" aria-label="Interactive 3D Earth with a Bangkok, Thailand marker and an orbiting CubeSat"
      aria-hidden={!ready} aria-describedby={instructions}/>
    {ready && <>
      <div className={styles.location}><span>BASED IN</span><strong>Bangkok, Thailand</strong></div>
      <div id={instructions} className={styles.hint}>
        <svg aria-hidden="true" width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2"><ellipse cx="10" cy="10" rx="8" ry="3.7" transform="rotate(-28 10 10)"/><circle cx="10" cy="10" r="2"/><circle cx="16.5" cy="5.7" r="1.4" fill="currentColor"/></svg>
        Drag to orbit<span className={styles.sr}>. Use the arrow keys to turn the model when focused.</span>
      </div>
      <div className={styles.controls} aria-label="Orbital scene controls">
        <button type="button" aria-label={playing ? "Pause orbit" : "Play orbit"} title={playing ? "Pause orbit" : "Play orbit"} onClick={() => controls.current?.toggle()}>
          <svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" fill="currentColor">{playing ? <path d="M4 3h2.5v10H4zm5.5 0H12v10H9.5z"/> : <path d="m4 2 9 6-9 6z"/>}</svg>
        </button>
        <button type="button" aria-label="Reset orbital view" title="Reset orbital view" onClick={() => controls.current?.reset()}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9a6 6 0 1 1 1.6 5.3M4 4.6V9h4.4"/></svg>
        </button>
        <button type="button" className={styles.focus} onClick={() => controls.current?.focus()} aria-label="Focus Bangkok on Earth"><svg aria-hidden="true" width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="10" cy="10" r="5"/><circle cx="10" cy="10" r="1.5"/><path d="M10 1v4m0 10v4M1 10h4m10 0h4"/></svg>Focus Bangkok</button>
      </div>
    </>}
  </div>;
}
