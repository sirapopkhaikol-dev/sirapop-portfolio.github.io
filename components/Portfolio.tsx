"use client";

import { sitePath, withoutBasePath } from "./sitePath";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Assistant from "./Assistant";
import Journey from "./Journey";
import LogicLab from "./LogicLab";
import Values from "./Values";
import Icon from "./Icon";
import ModulePreview, { type ModuleId } from "./ModulePreview";
import OrbitalScene from "./OrbitalScene";
import ProfileDialog from "./ProfileDialog";
import Contact from "./Contact";
import Resume from "./Resume";

const modules = [
  { id: "journey", title: "My journey", file: "journey.md", description: "From my first line of code to my master’s degree.", icon: "journey" },
  { id: "logic", title: "Logic lab", file: "logic-lab.ts", description: "See how algorithms think, one step at a time.", icon: "code" },
  { id: "values", title: "STAR values", file: "values.json", description: "Four principles behind how I work and grow.", icon: "star" },
] as const;
const tabs = [
  { id: "overview", label: "Overview", file: "profile.tsx" },
  { id: "journey", label: "Journey", file: "journey.md" },
  { id: "logic", label: "Logic lab", file: "logic-lab.ts" },
  { id: "values", label: "Values", file: "values.json" },
  { id: "contact", label: "Contact", file: "contact.json" },
  { id: "resume", label: "Résumé", file: "resume.md" },
] as const;
type TabId = "overview" | ModuleId | "contact" | "resume";
const tabHref = (id: TabId) => sitePath(id === "resume" || id === "contact" ? "/" + id + "/" : "/#" + id);
type WindowMode = "normal" | "expanded" | "minimized" | "closed";

function useCursorEffect() {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const move = (event: PointerEvent) => {
      if (!cursor.current || !media.matches || event.pointerType === "touch") return;
      cursor.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.current.style.opacity = "1";
    };
    const hide = () => { if (cursor.current) cursor.current.style.opacity = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, []);
  return cursor;
}

export default function Portfolio({ portrait, initialTab = "overview" }: { portrait?: string; initialTab?: TabId }) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const [mode, setMode] = useState<WindowMode>("normal");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const windowRef = useRef<HTMLElement>(null);
  const windowTransition = useRef<ViewTransition | null>(null);
  const cursor = useCursorEffect();
  const currentFile = tabs.find((item) => item.id === tab)!.file;

  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.slice(1);
      const route = withoutBasePath(window.location.pathname).replace(/\//g, "");
      setTab(tabs.find((item) => item.id === id)?.id ?? (route === "resume" || route === "contact" ? route : "overview"));
      setMode("normal");
    };
    sync();
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    return () => { window.removeEventListener("hashchange", sync); window.removeEventListener("popstate", sync); };
  }, []);

  useEffect(() => { document.title = tab === "resume" ? "Résumé | Sirapop Khaikol" : tab === "contact" ? "Contact | Sirapop Khaikol" : "Sirapop Khaikol | Software Developer"; }, [tab]);

  const changeWindow = (update: () => void) => {
    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      update();
      return;
    }
    windowTransition.current?.skipTransition();
    const transition = document.startViewTransition(() => flushSync(update));
    windowTransition.current = transition;
    void transition.finished.finally(() => {
      if (windowTransition.current === transition) windowTransition.current = null;
    });
  };
  const navigate = (next: TabId) => {
    const destination = tabHref(next);
    if (window.location.pathname + window.location.hash !== destination) history.pushState(null, "", destination);
    window.scrollTo({ top: 0, behavior: "instant" });
    const select = () => {
      setTab(next);
      setMode("normal");
      windowRef.current?.focus({ preventScroll: true });
    };
    if (next === tab && mode === "normal") select();
    else changeWindow(select);
  };
  const closeAssistant = useCallback(() => setAssistantOpen(false), []);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  const toggleExpanded = () => changeWindow(() => setMode((previous) => previous === "expanded" ? "normal" : "expanded"));
  const toggleMinimized = () => changeWindow(() => setMode((previous) => previous === "minimized" ? "normal" : "minimized"));
  useEffect(() => {
    if (mode !== "expanded") return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" && !event.defaultPrevented && !assistantOpen && !profileOpen) setMode("normal"); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, assistantOpen, profileOpen]);

  return (
    <div className="portfolio">
      <a className="skip" href="#editor">Skip to portfolio content</a>
      <header className="masthead"><div className="masthead-inner">
        <div className="identity">
          {portrait && <button type="button" className="profile-trigger" aria-haspopup="dialog" aria-label="View Sirapop’s photo and profile" title="View Sirapop’s profile" onClick={() => setProfileOpen(true)}>
            <img src={sitePath(portrait)} alt="" width="40" height="40"/>
            <span aria-hidden="true"><Icon name="upRight" size={9}/></span>
          </button>}
          <a className="brand" href={sitePath("/#overview")}  aria-label="Sirapop portfolio home" onClick={(e) => { e.preventDefault(); navigate("overview"); }}>
            {!portrait && <span className="brand-mark"><Icon name="terminal" size={22}/></span>}
            <span>sirapop<span className="brand-domain">.dev</span></span>
          </a>
        </div>
        <nav aria-label="Portfolio sections">{tabs.map((item) => <a key={item.id} href={tabHref(item.id)} aria-current={tab === item.id ? "page" : undefined} onClick={(e) => { e.preventDefault(); navigate(item.id); }}>{item.label}</a>)}</nav>
        <button type="button" className="top-chat" onClick={() => setAssistantOpen(true)}><Icon name="bot" size={17}/><span>Ask assistant</span><Icon name="upRight" size={13}/></button>
      </div></header>
      <main className="page-body">
        <section ref={windowRef} id="editor" tabIndex={-1} aria-label={`${tab} editor`} className={`editor ${mode}`}>
          {mode === "closed" ? <div className="reopen"><Icon name="window" size={22}/><span>Editor closed</span><button className="thin-button" onClick={() => changeWindow(() => setMode("normal"))}>Reopen {currentFile} <Icon name="arrow" size={14}/></button></div> : <>
            <div className="window-bar">
              <div className="window-buttons" aria-label="Editor window controls">
                <button className="traffic red" aria-label="Close editor" title="Close editor" onClick={() => changeWindow(() => setMode("closed"))}><Icon name="close" size={9}/></button>
                <button className="traffic yellow" aria-label={mode === "minimized" ? "Restore editor" : "Minimize editor"} title={mode === "minimized" ? "Restore editor" : "Minimize editor"} onClick={toggleMinimized}><Icon name="minus" size={9}/></button>
                <button className="traffic green" aria-label={mode === "expanded" ? "Restore editor size" : "Maximize editor"} title={mode === "expanded" ? "Restore editor size" : "Maximize editor"} onClick={toggleExpanded}><Icon name="maximize" size={9}/></button>
              </div>
              <span className="file-tab"><Icon name={tab === "journey" ? "file" : "code"} size={15}/>{currentFile}</span>
              <span className="file-path">~/workspace/portfolio</span>
              {mode === "minimized" && <button className="restore-action" onClick={toggleMinimized}>Restore window</button>}
            </div>
            <div className="editor-contents" key={tab} hidden={mode === "minimized"}>
              {tab === "overview" && <div className="hero">
                <div className="hero-copy">
                  <p className="command"><span>➜</span> <b>~</b> whoami</p>
                  <h1>Sirapop<br/>Khaikol<span className="caret" aria-hidden="true"/></h1>
                  <p className="role"><Icon name="code" size={19}/> Software Developer</p>
                  <p className="intro">One year of professional experience building software. Now pursuing my master’s degree and exploring the logic behind the code.</p>
                  <div className="hero-actions">
                    <button className="primary-button" onClick={() => navigate("journey")}>Explore my journey <Icon name="arrow" size={16}/></button>
                    <button className="secondary-button" onClick={() => setAssistantOpen(true)}><Icon name="chat" size={16}/> Ask about me</button>
                  </div>
                  <div className="hero-links"><a href={sitePath("/resume/")}  onClick={event => { event.preventDefault(); navigate("resume"); }}><Icon name="file" size={13}/>View résumé</a><a href={sitePath("/contact/")}  onClick={event => { event.preventDefault(); navigate("contact"); }}>Get in touch <Icon name="upRight" size={12}/></a></div>
                </div>
                <figure className="orbit-figure">
                  <OrbitalScene suspended={profileOpen || assistantOpen || mode === "minimized"}/>
                  <figcaption><span className="figure-cross">+</span> FIG. 01 <i/> ORBITAL FIELD</figcaption>
                </figure>
              </div>}
              {tab === "journey" && <Journey/>}
              {tab === "logic" && <LogicLab/>}
              {tab === "values" && <Values suspended={profileOpen || assistantOpen || mode === "minimized"}/>}
              {tab === "contact" && <Contact onOpenResume={() => navigate("resume")}/>}
              {tab === "resume" && <Resume portrait={portrait} onContact={() => navigate("contact")}/>}
              <div className="editor-status"><div><span><Icon name="branch" size={13}/> main</span><i/><span><span className="status-circle"/> Ready</span></div><div><span>UTF-8</span><i/><span>{tab === "journey" || tab === "resume" ? "Markdown" : tab === "values" || tab === "contact" ? "JSON" : "TypeScript"}</span></div></div>
            </div>
          </>}
        </section>
        <section className="workspace" aria-labelledby="workspace-title">
          <div className="workspace-hd"><div><Icon name="grid" size={19}/><h2 id="workspace-title">Workspace</h2></div><span>03 modules</span></div>
          <div className="module-grid">{modules.map((module) => <a href={tabHref(module.id)} key={module.id} className={`module-card mod-${module.id}`} onClick={(e) => { e.preventDefault(); navigate(module.id); }}>
            <div className="card-top"><span><Icon name={module.icon} size={15}/>{module.file}</span><Icon name="upRight" size={16}/></div>
            <ModulePreview type={module.id}/>
            <div className="card-copy"><h3>{module.title}</h3><p>{module.description}</p></div>
          </a>)}</div>
          <div className="recruiter-links"><span>Continue the conversation</span><a href={sitePath("/contact/")}  onClick={event => { event.preventDefault(); navigate("contact"); }}><Icon name="mail" size={14}/>Contact <Icon name="upRight" size={12}/></a><a href={sitePath("/resume/")}  onClick={event => { event.preventDefault(); navigate("resume"); }}><Icon name="file" size={14}/>Read résumé <Icon name="arrow" size={13}/></a></div>
        </section>
      </main>
      <footer><div className="footer-inner"><span>© Sirapop Khaikol</span><span><Icon name="code" size={13}/> Built with Next.js &amp; TypeScript</span></div></footer>
      <Assistant open={assistantOpen} onClose={closeAssistant}/>
      {portrait && <ProfileDialog portrait={portrait} open={profileOpen} onClose={closeProfile}/>}
      <div ref={cursor} className="cursor-aura" aria-hidden="true"><span/></div>
    </div>
  );
}
