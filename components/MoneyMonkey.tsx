"use client";

import { sitePath } from "./sitePath";
import { useState } from "react";
import Icon from "./Icon";
import ImageLightbox, { type GalleryImage } from "./ImageLightbox";
import gallery from "./Internships.module.css";
import styles from "./MoneyMonkey.module.css";

const screens: GalleryImage[] = [
  { src: "/moneymonkey-home.png", label: "Project homepage", alt: "MoneyMonkey homepage introducing AI inflation forecasting in a black and gold interface" },
  { src: "/moneymonkey-how-it-works.png", label: "How it works", alt: "MoneyMonkey’s three-step explanation: enter an amount, forecast inflation, and explore the result" },
  { src: "/moneymonkey-forecast.png", label: "Forecast dashboard", alt: "MoneyMonkey forecast dashboard with amount and time-horizon inputs, an estimated future value, and a line chart" },
];
const team: GalleryImage = {
  src: "/moneymonkey-team.jpg",
  label: "With the MoneyMonkey project team",
  alt: "A group photograph with the MoneyMonkey project team gathered around a laptop",
};
const stages = [
  { title: "Prepare & train", owner: "Data Science & AI Engineering", icon: "lab", detail: "The Data Science and AI Engineering teams cleaned the data and trained the inflation forecasting model. Their work provided the model that I helped bring into the web application." },
  { title: "Model microservice", owner: "My contribution", icon: "code", detail: "I helped integrate the trained AI model as a microservice, making its predictions available to the application through an API." },
  { title: "Central backend", owner: "My contribution", icon: "branch", detail: "I connected the model service API to the central backend so the application could request predictions and pass the results to the frontend." },
  { title: "Frontend & sign-in", owner: "My contribution", icon: "window", detail: "I connected the frontend to display the model’s results and managed Google login, helping turn the model into a web experience that people could use." },
] as const;

export default function MoneyMonkey() {
  const [screen, setScreen] = useState(0);
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<GalleryImage | null>(null);
  return <div className={styles.chapter}>
    <div className={styles.eyebrow}><Icon name="code" size={16}/> AI INFLATION FORECASTING</div>
    <h2>MoneyMonkey<span>.</span></h2>
    <div className={styles.context}><span>7-person team</span><i/><span>Full Stack Developer</span></div>
    <p>MoneyMonkey is a web application that uses AI to estimate future inflation and presents the results through a website. Users can enter an amount and a time horizon to explore what inflation could mean for their money over time.</p>
    <a className={`primary-button ${styles.visit}`} href="https://moneymonkey.trade/" target="_blank" rel="noopener noreferrer" aria-label="Visit MoneyMonkey (opens in a new tab)">
      Visit MoneyMonkey <Icon name="upRight" size={16}/>
    </a>
    <div className={gallery.showcase}>
      <button type="button" className={gallery.screen} aria-label={"Enlarge "+screens[screen].label} aria-haspopup="dialog" onClick={()=>setImage(screens[screen])}>
        <img key={screen} className={styles.projectImage} src={sitePath(screens[screen].src)} alt={screens[screen].alt} loading="lazy"/>
        <span>{screens[screen].label}<Icon name="upRight" size={14}/></span>
      </button>
      <div className={gallery.screenNav} role="group" aria-label="MoneyMonkey screenshots">
        {screens.map((item,index)=><button type="button" key={item.src} aria-pressed={screen===index} onClick={()=>setScreen(index)}><span>{index+1}</span>{item.label}</button>)}
      </div>
    </div>
    <div className={styles.sectionTitle}><Icon name="branch" size={22}/><h3>Bringing the model into the product</h3></div>
    <p>Once my teammates had prepared the data and trained the model, my work focused on the integration: the model microservice, its connection to the central backend, the frontend, and Google login.</p>
    <div className={styles.architecture}>
      <div className={styles.diagramTitle}>From trained model to web experience<span>CONCEPTUAL FLOW</span></div>
      <ol className={styles.pipeline} aria-label="MoneyMonkey integration flow">
        {stages.map((stage,index)=><li key={stage.title} data-active={step===index}>
          <Icon name={stage.icon} size={28}/>
          <strong>{stage.title}</strong>
          <small>{stage.owner}</small>
        </li>)}
      </ol>
      <div className={styles.steps} role="group" aria-label="Explore project contributions">
        {stages.map((stage,index)=><button type="button" key={stage.title} aria-pressed={step===index} onClick={()=>setStep(index)}><span>{index+1}</span>{stage.title}</button>)}
      </div>
      <p className={styles.explanation} key={step} aria-live="polite">{stages[step].detail}</p>
      <div className={styles.auth}><Icon name="check" size={16}/> Google login <span>Part of my full stack contribution</span></div>
    </div>
    <div className={styles.sectionTitle}><Icon name="star" size={22}/><h3>Making inflation easier to explore</h3></div>
    <p>The project is designed to give people a clearer starting point for thinking about future finances.</p>
    <ul className={styles.benefits}>
      <li><Icon name="journey" size={22}/><div><h4>Plan future expenses</h4><p>Explore how rising prices could change the cost of a future goal or budget.</p></div></li>
      <li><Icon name="star" size={22}/><div><h4>Give savings goals more context</h4><p>Bring inflation estimates into conversations about a target amount and time horizon.</p></div></li>
      <li><Icon name="grid" size={22}/><div><h4>Make model output understandable</h4><p>Use a web interface and charts to make the team’s forecasts easier to inspect and discuss.</p></div></li>
    </ul>
    <button type="button" className={styles.team} aria-label={"Enlarge "+team.label} aria-haspopup="dialog" onClick={()=>setImage(team)}>
      <img src={sitePath(team.src)} alt={team.alt} loading="lazy"/>
      <span>{team.label}<Icon name="upRight" size={14}/></span>
    </button>
    <ImageLightbox image={image} onClose={()=>setImage(null)}/>
  </div>;
}
