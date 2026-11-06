import { useId } from "react";
import styles from "./ChartSky.module.css";

// A fixed catalog keeps every star in place when the chart re-renders.
function makeCatalog() {
  let seed = 419;
  function sample() {
    seed = (Math.imul(1664525, seed) + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  const stars = Array.from({ length: 205 }, (_, index) => ({
    x: +(sample() * 1000).toFixed(2),
    y: +(sample() * 540).toFixed(2),
    radius: +(0.45 + sample() ** 3 * 1.05).toFixed(2),
    opacity: +(0.22 + sample() * 0.57).toFixed(2),
    warm: sample() > 0.79,
    flicker: index % 9 === 0,
    period: (5 + sample() * 7).toFixed(2),
    phase: (sample() * 12).toFixed(2),
  }));

  // Fine dust follows a sloping, uneven band and is batched into one path.
  const dust = Array.from({ length: 480 }, () => {
    const x = sample() * 1000;
    const midline = 486 - x * 0.4 + 26 * Math.sin(x / 113);
    const y = midline + (sample() + sample() + sample() - 1.5) * 86;
    return `M${x.toFixed(1)} ${y.toFixed(1)}h.12`;
  }).join("");
  return { stars, dust };
}

const { stars, dust } = makeCatalog();

const meridians = [-330, -150, 30, 210, 390, 570, 750, 930, 1110].map(x =>
  `M${x} -100 Q${x + 55} 210 ${x + 155 + x * 0.075} 680`
).join("");
const parallels = [-200, -75, 50, 175, 300, 425, 550, 675].map(y =>
  `M-200 ${y + 130} Q470 ${y - 43} 1200 ${y + 27}`
).join("");

export default function ChartSky({ animated }: { animated: boolean }) {
  const prefix = useId();
  const haze = `${prefix}-haze`;
  const tail = `${prefix}-tail`;
  const meteorShape = <>
    <path d="M-48 -17.5 0 -.65 0 .65Z" fill={`url(#${tail})`}/>
    <circle r=".9" fill="#e5e9cb"/>
  </>;

  return (
    <div className={styles.sky} aria-hidden="true" data-animated={animated}>
      <svg className={styles.plate} viewBox="0 0 1000 540" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <radialGradient id={haze}>
            <stop stopColor="#9f9e70" stopOpacity=".08"/>
            <stop offset=".48" stopColor="#969575" stopOpacity=".035"/>
            <stop offset="1" stopColor="#969575" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id={tail} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop stopColor="#cbcfaa" stopOpacity="0"/>
            <stop offset=".68" stopColor="#ccd0ae" stopOpacity=".32"/>
            <stop offset="1" stopColor="#e6ebcb" stopOpacity=".86"/>
          </linearGradient>
        </defs>
        <g fill={`url(#${haze})`} transform="rotate(-22 500 280)">
          <ellipse cx="330" cy="307" rx="365" ry="57"/>
          <ellipse cx="689" cy="286" rx="264" ry="38"/>
          <ellipse cx="919" cy="261" rx="185" ry="62"/>
        </g>
        <g className={styles.grid}>
          <path d={meridians}/>
          <path d={parallels}/>
        </g>
        <path d={dust} className={styles.dust}/>
        <g fill="#d4dccc">
          {stars.map((star, index) =>
            <circle key={index} cx={star.x} cy={star.y} r={star.radius}
              fill={star.warm ? "#dacf9d" : undefined} fillOpacity={star.opacity}
              className={star.flicker ? styles.twinkle : undefined}
              style={star.flicker ? { animationDuration: `${star.period}s`, animationDelay: `-${star.phase}s` } : undefined}
            />
          )}
        </g>
        <g transform="translate(364 63)">
          <g className={styles.meteor}>{meteorShape}</g>
        </g>
        <g transform="translate(840 342) rotate(147)">
          <g className={`${styles.meteor} ${styles.later}`}>{meteorShape}</g>
        </g>
      </svg>
      <div className={styles.ticks}/>
    </div>
  );
}
