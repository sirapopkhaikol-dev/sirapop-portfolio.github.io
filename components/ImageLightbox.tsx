"use client";

import { useEffect, useId, useRef } from "react";
import Icon from "./Icon";
import styles from "./Hackathon.module.css";

export type GalleryImage = { src: string; label: string; alt: string };

export default function ImageLightbox({ image, onClose }: { image: GalleryImage | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const captionId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (!image || !element) return;
    const opener = document.activeElement;
    element.showModal();
    return () => {
      element.close();
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [image]);
  return <dialog ref={dialog} className={styles.lightbox} aria-labelledby={captionId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onKeyDown={event => { if (event.key === "Escape") event.stopPropagation(); }}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
    <button type="button" aria-label="Close image" onClick={onClose}><Icon name="close" size={20}/></button>
    {image && <figure><img src={image.src} alt={image.alt}/><figcaption id={captionId}>{image.label}</figcaption></figure>}
  </dialog>;
}
