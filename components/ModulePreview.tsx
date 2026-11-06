import styles from "./ModulePreview.module.css";

export type ModuleId = "journey" | "logic" | "values";

const route = "M0 63h39l31-24h54l31 16h34l47-36h84";
const constellation = "m13 65 63-36 65 24 59-39 62 39 47-28";
const stops = [[39, 63], [70, 39], [124, 39], [155, 55], [189, 55], [236, 19], [282, 19]];
const bars = [16, 28, 20, 42, 32, 52, 24, 44, 36, 56, 48, 65, 54, 72, 60, 78];
const stars = [[13, 65, 3], [76, 29, 7], [141, 53, 5], [200, 14, 7], [262, 53, 6], [309, 25, 3]];

export default function ModulePreview({ type }: { type: ModuleId }) {
  return (
    <svg className="module-plot" viewBox="0 0 320 84" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <pattern id={`pattern-${type}`} width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".8" fill="currentColor" opacity=".21"/></pattern>
        {type === "logic" && (
          <linearGradient id="bar-fill" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#bacf89" stopOpacity=".9"/>
            <stop offset="1" stopColor="#718548" stopOpacity=".23"/>
          </linearGradient>
        )}
      </defs>
      <rect width="320" height="84" fill={`url(#pattern-${type})`}/>
      {type === "journey" && <g stroke="currentColor" fill="none">
        <path d={route} strokeWidth="1.6"/>
        <path className={styles.trace} d={route} pathLength="1" strokeWidth="2"/>
        <path d="M70 39v32m54-32V18m65 37V72m47-53V5" strokeDasharray="2 4" opacity=".38"/>
        {stops.map(([x, y], i) => (
          <g key={x} className={styles.stop} style={{ animationDelay: `${60 + i * 60}ms` }}>
            <circle cx={x} cy={y} r={i === 5 ? 6 : 3.8} fill="#17161e" strokeWidth="1.5"/>
            {i === 5 && <circle cx={x} cy={y} r="2.3" fill="currentColor" stroke="none"/>}
          </g>
        ))}
      </g>}
      {type === "logic" && <g>
        <path d="M12 76h296" stroke="currentColor" opacity=".2"/>
        {bars.map((height, i) => (
          <rect key={i} className={styles.bar} style={{ animationDelay: `${i * 28}ms` }}
            x={18 + i * 18} y={76 - height * .8} height={height * .8} width="10"
            fill="url(#bar-fill)" stroke="currentColor" strokeOpacity=".55" strokeWidth=".6"/>
        ))}
      </g>}
      {type === "values" && <g fill="currentColor">
        <g fill="none" stroke="currentColor">
          <path d={constellation} strokeWidth="1.15"/>
          <path d={constellation} className={styles.trace} pathLength="1" strokeWidth="1.6"/>
          <path d="m76 29 124-15 62 39-121 0z" strokeWidth=".6" opacity=".42" strokeDasharray="3 4"/>
        </g>
        {stars.map(([x, y, radius], i) => (
          <g key={x} transform={`translate(${x} ${y}) scale(${radius})`}>
            <path className={styles.spark} style={{ animationDelay: `${i * 88}ms` }}
              d="M0-1 .26-.26 1 0 .26.26 0 1 -.26.26 -1 0 -.26-.26Z"/>
          </g>
        ))}
      </g>}
    </svg>
  );
}
