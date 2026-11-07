"use client";

import { useState } from "react";
import Icon from "./Icon";
import { contactDetails } from "./contactDetails";
import styles from "./Contact.module.css";

export default function Contact({ onOpenResume }: { onOpenResume: () => void }) {
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(id: string, value: string, name: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      setFeedback(name + " copied" + (contactDetails.isPlaceholder ? " — example details." : "."));
    } catch {
      setCopied(null);
      setFeedback("Copy is unavailable. You can select and copy the contact text directly.");
    }
  }
  return <section className={styles.contact} aria-labelledby="contact-title">
    <div className={styles.kicker}><Icon name="sensor" size={16}/> OPEN A CONNECTION</div>
    <h1 id="contact-title">Good things start<br/>with a conversation<span>.</span></h1>
    <p className={styles.lead}>Have a software challenge, a project idea, or a role to talk about? Let’s connect and explore what we could build together.</p>
    {contactDetails.isPlaceholder && <div className={styles.notice}><span aria-hidden="true"/><p>Example contact details — these will be updated. Social links currently open placeholder pages.</p></div>}
    <div className={styles.channels}>
      {contactDetails.channels.map((channel, index) => <article className={styles.channel} key={channel.id}>
        <div className={styles.channelTop}><span className={styles.number}>{index + 1}</span><span>{channel.name}</span><Icon name={channel.icon} size={21}/></div>
        <a className={styles.value} href={channel.href} target={channel.id === "github" || channel.id === "linkedin" ? "_blank" : undefined} rel="noopener noreferrer">{channel.value}<Icon name="upRight" size={14}/></a>
        <p>{channel.note}</p>
        <button type="button" onClick={() => copy(channel.id, channel.value, channel.name)} aria-label={"Copy " + channel.name}><Icon name={copied === channel.id ? "check" : "copy"} size={14}/>{copied === channel.id ? "Copied" : "Copy " + channel.name.toLowerCase()}</button>
      </article>)}
    </div>
    <p className={styles.feedback} role="status" aria-live="polite">{feedback || "Choose a channel above to open it, or copy the details."}</p>
    <div className={styles.resumeCard}><div className={styles.documentIcon}><Icon name="file" size={30}/></div><div><span>FOR RECRUITERS & COLLABORATORS</span><h2>The background, in one place.</h2><p>Read my résumé online or take the original PDF with you.</p></div><a href="/resume/" onClick={event => { event.preventDefault(); onOpenResume(); }}>View résumé <Icon name="arrow" size={16}/></a></div>
    <div className={styles.signature}><Icon name="star" size={22}/><span>Build. Learn. Improve. Repeat.</span></div>
  </section>;
}
