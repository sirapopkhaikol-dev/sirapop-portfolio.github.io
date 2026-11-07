"use client";

import { sitePath } from "./sitePath";
import { useState } from "react";
import Icon from "./Icon";
import ImageLightbox, { type GalleryImage } from "./ImageLightbox";
import LearningMap from "./LearningMap";
import styles from "./Bachelors.module.css";

const photos: GalleryImage[] = [
  {
    src: "/Bachelor-Final-Present.jpg",
    label: "Final presentation",
    alt: "Sirapop presenting with a microphone beside a projected slide in a classroom",
  },
  {
    src: "/Bachelor-Final-Present-Zoom-Face.jpg",
    label: "Presenting my work",
    alt: "A closer view of Sirapop speaking during the final presentation",
  },
];

export default function Bachelors() {
  const [image, setImage] = useState<GalleryImage | null>(null);

  return <div className={styles.chapter}>
    <div className={styles.eyebrow}><Icon name="lab" size={16}/> KMITL · DUAL-DEGREE GRADUATE</div>
    <h2>From physical signals<br/>to software<span>.</span></h2>
    <p>I graduated from King Mongkut’s Institute of Technology Ladkrabang with a dual-degree background spanning the School of Engineering and the School of Science. Studying both helped me connect physical measurement, data analysis, and the software that turns data into something people can use.</p>
    <div className={styles.degrees} aria-label="Bachelor’s degrees">
      <div><Icon name="code" size={23}/><span>Bachelor of Engineering</span><h3>IoT System and<br/>Information Engineering</h3><p>School of Engineering</p></div>
      <div><Icon name="lab" size={23}/><span>Bachelor of Science</span><h3>Industrial Physics</h3><p>School of Science</p></div>
    </div>
    <a className={styles.program} href="https://www.iote.kmitl.ac.th/dual-degree/" target="_blank" rel="noopener noreferrer">KMITL dual-degree program <Icon name="upRight" size={12}/></a>
    <div className={styles.photos}>
      {photos.map(photo => <button type="button" key={photo.src} onClick={() => setImage(photo)} aria-label={"Enlarge " + photo.label} aria-haspopup="dialog">
        <img src={sitePath(photo.src)} alt={photo.alt} loading="lazy" width="1448" height="1086"/>
        <span>{photo.label}<Icon name="upRight" size={13}/></span>
      </button>)}
    </div>
    <div className={styles.sectionHeading}><Icon name="branch" size={22}/><h3>How the learning connects</h3></div>
    <p>A sensor reading is one starting point. My studies followed what happens next: preparing the data, building applications or models around it, and understanding the infrastructure that supports those systems.</p>
    <LearningMap/>
    <div className={styles.reflection}>
      <Icon name="star" size={25}/>
      <div><h3>Understanding the system around the code</h3>
        <p>This foundation helps me trace a problem across boundaries. I can think about where a reading came from, how it was processed, what the application needs, and how the service is connected and deployed.</p>
        <p>I want to keep building on those connections as I work on software, data, and systems that interact with the physical world.</p>
      </div>
    </div>
    <ImageLightbox image={image} onClose={() => setImage(null)}/>
  </div>;
}
