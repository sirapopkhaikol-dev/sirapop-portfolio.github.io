"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import styles from "./Assistant.module.css";

const suggestions = [
  "Tell me about Sirapop",
  "What’s his experience?",
  "What does STAR mean?",
];

const topics = [
  {
    matches: /\b(contact|reach|connect|email|message|hire|hiring|available|availability|linkedin)\b/i,
    answer: "For contact details and current availability, you’ll need to check with Sirapop directly. I can help you explore his background and projects here.",
  },
  {
    matches: /\b(star|values?|principles?|curiosity|mindset|approach|feedback|philosophy)\b/i,
    answer: "Sirapop describes his approach with STAR. Start with curiosity, Test ideas, Act on feedback, and Repeat with purpose.",
  },
  {
    matches: /\b(educat\w*|stud\w*|degrees?|master\w*|bachelor\w*|universit\w*|colleges?|schools?|academ\w*)\b/i,
    answer: "Sirapop completed his bachelor’s degree and is now pursuing a master’s. His university years included hackathons, an internship, and hands-on projects.",
  },
  {
    matches: /\b(projects?|built|builds?|portfolio work|hackathons?|intern\w*)\b/i,
    answer: "Sirapop’s path includes a hackathon, an internship, and university projects. The Journey section covers those milestones. In the Logic lab, you can run the sorting and search demos yourself.",
  },
  {
    matches: /\b(experien\w*|career|jobs?|employ\w*|worked|working|works?|journey|background|professional|roles?)\b/i,
    answer: "Sirapop has one year of software development work experience. Earlier, he gained hands-on experience through university projects, hackathons, and an internship.",
  },
  {
    matches: /\b(who am i|who (is|are) (sirapop|he|you)|about (sirapop|him|yourself)|introduce (sirapop|him|yourself)|overview|profile|bio)\b|^(hello|hi|hey)[!?.\s]*$/i,
    answer: "Sirapop Khaikol is a software developer with one year of professional experience. He’s currently pursuing his master’s degree. You can ask about his work, education, or the STAR values that guide his approach.",
  },
];

function answerQuestion(question: string) {
  return topics.find(({ matches }) => matches.test(question))?.answer
    ?? "I don’t have that detail in this portfolio. I can help with Sirapop’s experience, education, projects, and STAR values.";
}

type Exchange = { question: string; answer: string };
type AssistantProps = { open: boolean; onClose: () => void };

function ChatIcon() {
  return (
    <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 4.5h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3h-7l-5.8 3v-3.6a3 3 0 0 1-1.2-2.4v-7a3 3 0 0 1 3-3Z" />
      <path d="M8.5 9.5h7m-7 3.5h4" />
    </svg>
  );
}

export default function Assistant({ open, onClose }: AssistantProps) {
  const [draft, setDraft] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    const target = window.matchMedia("(pointer: fine)").matches ? inputRef.current : titleRef.current;
    target?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => {
    const history = historyRef.current;
    if (open && history && exchanges.length) history.scrollTop = history.scrollHeight;
  }, [open, exchanges]);

  function ask(value: string) {
    const question = value.trim();
    if (!question) return;
    setExchanges((previous) => [...previous, { question, answer: answerQuestion(question) }]);
    setDraft("");
    inputRef.current?.focus({ preventScroll: true });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(draft);
  }

  return (
    <dialog
      aria-labelledby={titleId}
      className={styles.dialog}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
      }}
      ref={dialogRef}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <span className={styles.avatar}><ChatIcon /></span>
          <div>
            <p className={styles.kicker}>Portfolio assistant</p>
            <h2 className={styles.title} id={titleId} ref={titleRef} tabIndex={-1}>Ask Sirapop</h2>
          </div>
          <button aria-label="Close assistant" className={styles.close} onClick={onClose} type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </header>
        <div className={styles.history} ref={historyRef}>
          <p className={styles.intro}>What would you like to know about Sirapop?</p>
          {exchanges.length === 0 && (
            <div className={styles.suggestions} aria-label="Suggested questions" role="group">
              {suggestions.map((prompt) => (
                <button type="button" key={prompt} onClick={() => ask(prompt)} className={styles.suggestion}>
                  {prompt}<span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          )}
          <div role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions">
            {exchanges.map((exchange, index) => (
              <div className={styles.exchange} key={index}>
                <p className={styles.question}><span className={styles.srOnly}>You asked. </span>{exchange.question}</p>
                <p className={styles.answer}><span className={styles.srOnly}>Portfolio assistant. </span>{exchange.answer}</p>
              </div>
            ))}
          </div>
        </div>
        <form className={styles.form} onSubmit={submit}>
          <div className={styles.inputBar}>
            <input ref={inputRef} aria-label="Your question" placeholder="Ask a question…" maxLength={1000} value={draft} onChange={(event) => setDraft(event.target.value)} className={styles.input} autoComplete="off" />
            <button type="submit" aria-label="Send question" className={styles.send} disabled={!draft.trim()}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
            </button>
          </div>
          <p className={styles.privacy}>This conversation stays on your device.</p>
        </form>
      </div>
    </dialog>
  );
}
