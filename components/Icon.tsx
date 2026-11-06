import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
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
