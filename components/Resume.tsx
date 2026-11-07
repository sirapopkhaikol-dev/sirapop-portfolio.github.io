import Icon from "./Icon";
import { contactDetails } from "./contactDetails";
import styles from "./Resume.module.css";

const skills = [
  { title: "Programming & web", items: ["Python", "JavaScript", "SQL", "HTML / XML", "CSS", "React", "Tailwind CSS", "Node.js", "RESTful APIs"] },
  { title: "Data & tools", items: ["PostgreSQL", "MongoDB", "Redis", "Git", "GitHub", "Bitbucket", "Postman"] },
  { title: "Engineering", items: ["Systems integration", "Debugging", "Data structures", "PLC integration", "Real-time dashboards", "CI/CD"] },
  { title: "Working together", items: ["Communication", "Teamwork", "Problem-solving", "Scrum collaboration"] },
];

function Heading({ number, children }: { number: string; children: React.ReactNode }) {
  return <h2 className={styles.sectionTitle}><span>{number}</span>{children}</h2>;
}

export default function Resume({ portrait, onContact }: { portrait?: string; onContact: () => void }) {
  return <article className={styles.resume} aria-labelledby="resume-name">
    <div className={styles.toolbar}><span><Icon name="file" size={15}/> RÉSUMÉ / WEB EDITION</span><a href="/resume.pdf" target="_blank" rel="noopener noreferrer">Open original PDF <Icon name="upRight" size={13}/></a></div>
    <header className={styles.header}>
      <div><div className={styles.kicker}>SOFTWARE · SYSTEMS · CONTINUOUS LEARNING</div><h1 id="resume-name">Sirapop Khaikol<span>.</span></h1><p className={styles.role}>Software Developer</p></div>
      {portrait && <div className={styles.portrait}><img src={portrait} alt="Sirapop Khaikol" width="106" height="120"/></div>}
    </header>
    <p className={styles.summary}>Software developer with practical experience in API development, frontend and backend troubleshooting, and systems integration. I build web applications that connect data to useful interfaces, with a focus on reliability, performance, and understanding the system behind the code.</p>
    <div className={styles.actions}><a className="primary-button" href="/resume.pdf" download="Sirapop-Khaikol-Resume.pdf"><Icon name="download" size={16}/>Download résumé PDF</a><a className="secondary-button" href="/#contact" onClick={event => { event.preventDefault(); onContact(); }}><Icon name="mail" size={16}/>Contact me</a><span>Original document · 2 pages · PDF</span></div>
    <div className={styles.facts}><div><strong>1 year</strong><span>Software development experience</span></div><div><strong>Dual degree</strong><span>Engineering & science · KMITL</span></div><div><strong>Master’s</strong><span>AIoT & Information Engineering · In progress</span></div></div>
    <div className={styles.layout}>
      <div className={styles.main}>
        <section aria-labelledby="experience-title"><Heading number="01"><span id="experience-title">Experience</span></Heading>
          <div className={styles.job}><div className={styles.jobTop}><span>Western Digital</span><time>Apr – Oct 2025</time></div><h3>Software Developer Intern</h3><p className={styles.organization}>Western Digital Storage Technologies (Thailand) Ltd. · Manufacturing · Onsite</p><ul><li>Built a real-time machine-monitoring web application to reduce manual reporting and support maintenance.</li><li>Designed the system architecture and integrated PLC data through the backend, database, and frontend.</li><li>Used Redis publish/subscribe and server-sent events to stream updates to the dashboard.</li><li>Implemented CI/CD and deployed the application, helping reduce human error in monitoring.</li></ul></div>
          <div className={styles.job}><div className={styles.jobTop}><span>Q-CHANG</span><time>Jan – Apr 2025</time></div><h3>Full Stack Developer Intern</h3><p className={styles.organization}>Nexter Digital and Solution Co., Ltd. · Remote</p><ul><li>Maintained and enhanced a production web application within an agile, sprint-based team.</li><li>Resolved frontend and backend issues and developed and tested RESTful APIs.</li><li>Integrated database data into frontend features and contributed to database migration work.</li><li>Learned an existing codebase and collaborated with senior developers to deliver sprint tasks.</li></ul></div>
        </section>
        <section aria-labelledby="projects-title"><Heading number="02"><span id="projects-title">Selected projects</span></Heading>
          <div className={styles.project}><div className={styles.projectTop}><h3>MoneyMonkey</h3><a href="https://moneymonkey.trade/" target="_blank" rel="noopener noreferrer">Visit project <Icon name="upRight" size={12}/></a></div><span className={styles.projectMeta}>AI inflation forecasting · 7-person team · Full Stack Developer</span><p>Integrated the AI model as a microservice, connected its API to the central backend and frontend, and implemented Google login. The website makes inflation forecasts easier to explore for future financial planning.</p></div>
          <div className={styles.project}><div className={styles.projectTop}><h3>Shopping Cart Order Website</h3><a href="https://shop.moneymonkey.trade/" target="_blank" rel="noopener noreferrer">Visit project <Icon name="upRight" size={12}/></a></div><p>Built a responsive shopping-cart application that calculates totals by applying multiple discount types, developing pricing logic and interface design skills.</p></div>
          <div className={styles.project}><h3>Personal Portfolio Website</h3><p>A responsive website presenting my work, technical skills, and experience through interactive explanations and visual storytelling.</p></div>
        </section>
        <section aria-labelledby="education-title"><Heading number="03"><span id="education-title">Education</span></Heading>
          <div className={styles.education}><span className={styles.current}><i aria-hidden="true"/> CURRENT STUDY</span><h3>Master’s · AIoT and Information Engineering</h3><p>King Mongkut’s Institute of Technology Ladkrabang</p><p>Researching server optimization by comparing load-balancing methods, including Round Robin, resource-aware policies, and machine learning approaches. Observing throughput, errors, network traffic, latency, and server resource use.</p></div>
          <div className={styles.education}><span className={styles.dates}>2022 – 2026 · DUAL DEGREE</span><h3>IoT and Information Engineering<br/>& Industrial Physics</h3><p>King Mongkut’s Institute of Technology Ladkrabang<br/>School of Engineering & School of Science</p><div className={styles.honors}><Icon name="star" size={15}/>First-class honors <span>GPA 3.55</span></div></div>
        </section>
      </div>
      <aside className={styles.aside} aria-label="Skills and qualifications">
        <section><Heading number="04">Skills</Heading>{skills.map(group => <div className={styles.skillGroup} key={group.title}><h3>{group.title}</h3><ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</section>
        <section><Heading number="05">Credentials</Heading><div className={styles.credential}><Icon name="check" size={16}/><div><h3>TOEIC · 565</h3><p>English · CEFR B1</p></div></div><div className={styles.credential}><Icon name="lab" size={17}/><div><h3>My Order Cloud Hero #2</h3><p>Cloud learning covering cloud architecture, big data, machine learning, and cloud-native applications.</p></div></div></section>
        <section><Heading number="06">Languages</Heading><dl className={styles.languages}><div><dt>Thai</dt><dd>Native</dd></div><div><dt>English</dt><dd>B1 · TOEIC 565</dd></div></dl></section>
        <section><Heading number="07">Beyond the code</Heading><div className={styles.activity}><h3>KMITL Innovation Expo 2025</h3><p>Exhibition staff, supporting event management, teamwork, and communication.</p></div><div className={styles.activity}><h3>AiHack 2024</h3><p>4th of 32 teams in the AUC Tournament, developing financial forecasting models.</p></div></section>
        <section className={styles.connect}><Icon name="chat" size={21}/><h3>Let’s connect</h3><p>Find my contact channels and professional profiles.</p><a href="/#contact" onClick={event => { event.preventDefault(); onContact(); }}>Go to Contact <Icon name="arrow" size={13}/></a>{contactDetails.isPlaceholder && <small>Contact details are currently examples.</small>}</section>
      </aside>
    </div>
    <footer className={styles.note}><Icon name="file" size={16}/><p>This web edition brings together the supplied résumé and the current study and project details in this portfolio. The download is the original PDF, unchanged.</p><a href="/resume.pdf" download="Sirapop-Khaikol-Resume.pdf">Download PDF <Icon name="download" size={13}/></a></footer>
  </article>;
}
