"use client";

import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { imageDimensions } from "./imageDimensions";
import { withoutBasePath } from "./sitePath";
import styles from "./LoadingImage.module.css";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "onLoad" | "onError"> & {
  src: string;
  fill?: boolean;
  compact?: boolean;
  frameClassName?: string;
};

function ImageResource({ src, alt = "", width, height, fill, compact, frameClassName = "", ...props }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const dimensions = imageDimensions[withoutBasePath(src).split(/[?#]/)[0]] ?? [960, 600];
  useEffect(() => {
    const element = ref.current;
    let active = true;
    if (element?.complete) {
      if (!element.naturalWidth) setState("error");
      else {
        const decoded = element.decode?.() ?? Promise.resolve();
        void decoded.catch(() => {}).then(() => { if (active) setState("ready"); });
      }
    }
    return () => { active = false; };
  }, []);

  return <span data-image-frame data-image-state={state} data-compact={compact || undefined}
    className={`${styles.frame} ${fill ? styles.fill : ""} ${frameClassName}`} aria-busy={state === "loading"}>
    <img {...props} src={src} alt={alt} width={width ?? dimensions[0]} height={height ?? dimensions[1]} ref={ref}
      onLoad={event => {
        const element = event.currentTarget;
        void (element.decode?.() ?? Promise.resolve()).catch(() => {}).then(() => setState(element.naturalWidth ? "ready" : "error"));
      }} onError={() => setState("error")}/>
    {state !== "ready" && <span className={styles.placeholder} role="status">
      <span className={state === "error" ? styles.error : styles.spinner} aria-hidden="true">{state === "error" ? "!" : null}</span>
      <span className={styles.message}>{state === "loading" ? "Loading image…" : "Image unavailable"}</span>
      {!compact && <span className={styles.note}>{state === "loading" ? "Please wait a moment" : "Please try refreshing the page"}</span>}
    </span>}
  </span>;
}

// Remount on source changes so a previously loaded gallery photo never hides
// the loading state for the next photo. Cached files are checked on mount.
export default function LoadingImage(props: Props) {
  return <ImageResource key={props.src} {...props}/>;
}
