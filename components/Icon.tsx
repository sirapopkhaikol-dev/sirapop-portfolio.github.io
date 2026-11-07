import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/></>,
  phone: <path d="M5 3h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4c0 2-2 3-4 2C9 19 5 15 3 7 2 5 3 3 5 3Z"/>,
  github: <><path d="M8 21v-4c-4 1-4-2-6-2m14 6v-4c3-1 5-3 5-6a6 6 0 0 0-2-5c0-1 0-3-1-4-2 0-4 1-5 2h-2C10 3 8 2 6 2 5 3 5 5 5 6a6 6 0 0 0-2 5c0 3 2 5 5 6"/></>,
  linkedin: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7m0-10v.1M11 17v-7m0 3c0-4 6-4 6 0v4"/></>,
  copy: <><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 15v6h16v-6"/></>,
  sensor: <><circle cx="12" cy="12" r="3"/><path d="M7 7a7 7 0 0 0 0 10m10-10a7 7 0 0 1 0 10M3.5 3.5a12 12 0 0 0 0 17m17-17a12 12 0 0 1 0 17M12 15v6m-4 0h8"/></>,
  database: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 4 18 4 18 0V5M3 12c0 4 18 4 18 0"/></>,
  neural: <><circle cx="4" cy="5" r="2"/><circle cx="4" cy="19" r="2"/><circle cx="12" cy="9" r="2"/><circle cx="12" cy="17" r="2"/><circle cx="20" cy="5" r="2"/><circle cx="20" cy="19" r="2"/><path d="m6 6 4 2m-4 9 4-7m-4 9 4-2m4-7 4 7m-4-1 4-9m-4 11 4 1"/></>,
  network: <><rect x="8" y="2" width="8" height="6" rx="1"/><rect x="2" y="17" width="8" height="5" rx="1"/><rect x="14" y="17" width="8" height="5" rx="1"/><path d="M12 8v5M6 17v-4h12v4"/></>,
  shield: <><path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Z"/><path d="m8 12 3 3 5-6"/></>,
  terminal: <><path d="m5 6 6 6-6 6m8 0h6" /></>,
  code: <><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16" /></>,
  file: <><path d="M5 3h10l4 4v14H5zM14 3v5h5m-11 5h8m-8 3h6" /></>,
  folder: <path d="M3 6h7l2 3h9v11H3z" />,
  journey: <><circle cx="6" cy="5" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v7a5 5 0 0 0 5 5h5m-7-7h6a4 4 0 0 0 4-4V4m-3 3 3-3 3 3"/></>,
  lab: <><path d="M7 4h10m-7 0v6L4.5 19a1.3 1.3 0 0 0 1.1 2h12.8a1.3 1.3 0 0 0 1.1-2L14 10V4M8 15h8"/></>,
  star: <path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2Z"/>,
  arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
  upRight: <path d="M6 18 18 6M6 6h12v12" />,
  bot: <><rect x="3" y="6" width="18" height="14" rx="4"/><path d="M12 3v3m-5 5v2m10-2v2m-8 3h6"/></>,
  chat: <><path d="M4 4h16v12H9l-5 4z"/><path d="M8 9h8m-8 3h5"/></>,
  branch: <><circle cx="7" cy="5" r="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="8" r="2"/><path d="M7 7v10m0-3c6 0 10-1 10-4"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  shrink: <path d="M4 9h5V4m11 11h-5v5"/>,
  maximize: <path d="M4 9V4h5m6 16h5v-5"/>,
  minus: <path d="M5 12h14"/>,
  window: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  chevron: <path d="m9 5 7 7-7 7"/>,
};

export default function Icon({ name, size = 18 }: { name: keyof typeof paths; size?: number }) {
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
