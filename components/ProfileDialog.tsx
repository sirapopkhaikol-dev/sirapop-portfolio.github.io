import LoadingImage from "./LoadingImage";
import { sitePath } from "./sitePath";
import { useEffect, useId, useRef } from "react";
import Icon from "./Icon";
import styles from "./ProfileDialog.module.css";

type ProfileDialogProps = {
  portrait: string;
  open: boolean;
  onClose: () => void;
};

export default function ProfileDialog({ portrait, open, onClose }: ProfileDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef(false);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    const opener = document.activeElement;
    dialog.scrollTop = 0;
    dialog.showModal();
    return () => {
      dialog.close();
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => { if (event.key === "Escape") event.stopPropagation(); }}
      onPointerDown={(event) => { backdropPress.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (backdropPress.current && event.target === event.currentTarget) onClose();
        backdropPress.current = false;
      }}
    >
      <div className={styles.sheet}>
        <button type="button" className={styles.close} aria-label="Close profile" onClick={onClose}>
          <Icon name="close" size={20} />
        </button>
        <div className={styles.matte}>
          <LoadingImage src={sitePath(portrait)} alt="Sirapop Khaikol, smiling in a white shirt and tie" width={360} height={360} />
        </div>
        <section className={styles.identity}>
          <h2 id={titleId}>Sirapop <span>Khaikol</span></h2>
          <p className={styles.role}>Software developer</p>
          <div className={styles.bio}>
            <p>I’ve spent a year building software professionally, and I’m now pursuing my master’s degree.</p>
            <p>I’m interested in 3D visualization for space projects. I like how turning a model can reveal something that’s hard to see from a single angle.</p>
          </div>
        </section>
      </div>
    </dialog>
  );
}
