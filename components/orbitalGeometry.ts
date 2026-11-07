import { coastlines, landPoints } from "./earthLand";

// Earth, orbital paths and the original CubeSat share model-space coordinates.
// Positive camera depth points toward the viewer.
type Point = [number, number, number];
type Face = { indices: number[]; tone: number; edge?: string; fill?: string };
type Mesh = { vertices: Point[]; faces: Face[] };
export type Camera = { yaw: number; pitch: number; roll: number };

const TAU = Math.PI * 2;
export const EARTH_RADIUS = .89;
export const bangkok = { latitude: 13.75, longitude: 100.5 };
export const homeCamera: Camera = { yaw: 1.35, pitch: 1.16, roll: .10 };

// Coordinates indicate Bangkok at city scale, rather than a personal address.
export function geographicPoint(latitude: number, longitude: number, radius = EARTH_RADIUS): Point {
  const lat = latitude * Math.PI / 180, lon = longitude * Math.PI / 180;
  return [radius * Math.cos(lat) * Math.sin(lon), radius * Math.cos(lat) * Math.cos(lon), radius * Math.sin(lat)];
}

const shorelines = coastlines.map(ring => ring.map(([lon, lat]) => geographicPoint(lat, lon)));
const land = landPoints.map(([lon, lat]) => geographicPoint(lat, lon));
const graticule = [
  ...Array.from({ length: 24 }, (_, i) => Array.from({ length: 61 }, (_, j) => geographicPoint(-90 + j * 3, i * 15))),
  ...Array.from({ length: 11 }, (_, i) => Array.from({ length: 121 }, (_, j) => geographicPoint(-75 + i * 15, -180 + j * 3))),
];
const homePoint = geographicPoint(bangkok.latitude, bangkok.longitude, EARTH_RADIUS + .008);
const surfaceColors = Array.from({length: 32}, (_, i) => {
  const f = i / 31;
  return { fill: `rgb(${Math.round(15+f*13)},${Math.round(22+f*17)},${Math.round(15+f*7)})`,
    line: `rgba(${Math.round(115+f*81)},${Math.round(150+f*77)},${Math.round(81+f*61)},${.33+f*.54})` };
});

function orbit(angle: number, distance: number, inclination: number, node: number): Point {
  const x = Math.cos(angle) * distance, y = Math.sin(angle) * distance;
  const b = y * Math.cos(inclination);
  return [x * Math.cos(node) - b * Math.sin(node), x * Math.sin(node) + b * Math.cos(node), y * Math.sin(inclination)];
}
const probeOrbit = { distance: 1.36, inclination: -.19, node: -.12 };
function probePosition(t: number) { return orbit(t, probeOrbit.distance, probeOrbit.inclination, probeOrbit.node); }

const trajectories = [
  { distance: probeOrbit.distance, inclination: probeOrbit.inclination, node: probeOrbit.node, color: "rgba(189,180,132,.46)" },
  { distance: 1.42, inclination: .75, node: -.72, color: "rgba(154,178,137,.32)" },
  { distance: 1.38, inclination: -.83, node: .7, color: "rgba(156,180,142,.26)" },
].map(track => ({ ...track, points: Array.from({length: 145}, (_, i) => orbit(i / 144 * TAU, track.distance, track.inclination, track.node)) }));

function makeProbe(): Mesh {
  const vertices: Point[] = [], faces: Face[] = [];
  const quad = (points: Point[], fill: string, edge: string) => {
    const start = vertices.length;
    vertices.push(...points);
    faces.push({indices: [start, start+1, start+2, start+3], tone: 0, fill, edge});
  };
  const x = .057, y = .053, z = .065;
  const trim = "#e8d6a6";
  quad([[-x,-y,z],[x,-y,z],[x,y,z],[-x,y,z]], "#c6a66a", trim);
  quad([[-x,y,-z],[x,y,-z],[x,-y,-z],[-x,-y,-z]], "#69624f", trim);
  quad([[x,-y,-z],[x,y,-z],[x,y,z],[x,-y,z]], "#b79359", trim);
  quad([[-x,-y,z],[-x,y,z],[-x,y,-z],[-x,-y,-z]], "#807454", trim);
  quad([[x,y,-z],[-x,y,-z],[-x,y,z],[x,y,z]], "#e2ca91", trim);
  quad([[-x,-y,-z],[x,-y,-z],[x,-y,z],[-x,-y,z]], "#94805b", trim);
  for (const side of [-1, 1]) {
    quad([[side*x,-.008,0],[side*.081,-.008,0],[side*.081,.008,0],[side*x,.008,0]], "#c5b68e", "#c5b68e");
    for (let col=0; col<4; col++) for (let row=0; row<2; row++) {
      const left=side*(.081+col*.048), right=left+side*.048, bottom=-.054+row*.054;
      quad([[left,bottom,0],[right,bottom,0],[right,bottom+.054,0],[left,bottom+.054,0]], (col+row)%2 ? "#344953" : "#2c3e49", "#9baeb0");
    }
  }
  return {vertices, faces};
}
const probe = makeProbe();
const stars = Array.from({ length: 67 }, (_, i) => {
  const random = (n:number) => { const k = Math.sin(n * 127.1 + 311.7)*43758.5453; return k-Math.floor(k); };
  return { x: random(i*3+1), y: random(i*3+2), size: .42+random(i*3+3)*.64 };
});

export function drawOrbit(ctx: CanvasRenderingContext2D, width: number, height: number, camera: Camera, elapsed: number) {
  const cy = Math.cos(camera.yaw), sy = Math.sin(camera.yaw);
  const cp = Math.cos(camera.pitch), sp = Math.sin(camera.pitch);
  const cr = Math.cos(camera.roll), sr = Math.sin(camera.roll);
  const scale = Math.min(width / 3.13, height / 2.18);
  const ox = width * .505, oy = height * .515;
  const project = ([x,y,z]: Point): Point => {
    const a = x*cy-y*sy, b = x*sy+y*cy;
    // Geographic north must point up before converting to canvas's downward Y.
    const h = z*sp-b*cp, depth = b*sp+z*cp;
    const zoom = scale * 6.8 / (6.8-depth);
    return [ox+(a*cr-h*sr)*zoom, oy-(a*sr+h*cr)*zoom, depth];
  };
  const globeRadius = scale * EARTH_RADIUS * 6.8 / Math.sqrt(6.8 ** 2 - EARTH_RADIUS ** 2);
  // With perspective, the horizon is slightly in front of the center plane.
  const horizon = EARTH_RADIUS ** 2 / 6.8;
  const visible = (p: Point) => p[2] >= horizon;
  function drawSurfaceLine(points: Point[], color: string, lineWidth: number) {
    ctx.beginPath(); ctx.strokeStyle = color; ctx.lineWidth = lineWidth;
    for (let i = 1; i < points.length; i++) {
      const a = points[i-1], b = points[i];
      const av = visible(a), bv = visible(b);
      if (!av && !bv) continue;
      const t = av !== bv ? (horizon - a[2]) / (b[2] - a[2]) : 0;
      const cut: Point = [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t, horizon];
      const start = av ? a : cut, end = bv ? b : cut;
      ctx.moveTo(start[0], start[1]); ctx.lineTo(end[0], end[1]);
    }
    ctx.stroke();
  }
  function drawEarth() {
    ctx.save();
    // A dark opaque ocean masks the far-side paths and keeps the globe solid.
    const ocean = ctx.createRadialGradient(ox-globeRadius*.38, oy-globeRadius*.4, globeRadius*.07, ox, oy, globeRadius);
    ocean.addColorStop(0, "#233b32"); ocean.addColorStop(.63, "#15291f"); ocean.addColorStop(1, "#0d1813");
    ctx.beginPath(); ctx.arc(ox, oy, globeRadius, 0, TAU);
    ctx.fillStyle = ocean; ctx.fill(); ctx.clip();
    for (const line of graticule) drawSurfaceLine(line.map(project), "rgba(132,178,132,.17)", .55);
    for (const point of land) {
      const p = project(point);
      if (!visible(p)) continue;
      const light = Math.max(0, Math.min(1, (p[2]-horizon) / EARTH_RADIUS));
      ctx.fillStyle = `rgba(180,220,137,${.28 + light*.45})`;
      ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(.6, scale*.0054) * (.65+light*.35), 0, TAU); ctx.fill();
    }
    for (const line of shorelines) drawSurfaceLine(line.map(project), "rgba(188,224,154,.66)", .8);
    const shade = ctx.createLinearGradient(ox-globeRadius, oy-globeRadius, ox+globeRadius, oy+globeRadius);
    shade.addColorStop(0, "rgba(7,15,13,0)"); shade.addColorStop(.6, "rgba(7,15,13,.03)"); shade.addColorStop(1, "rgba(4,9,8,.57)");
    ctx.fillStyle = shade; ctx.fillRect(ox-globeRadius, oy-globeRadius, globeRadius*2, globeRadius*2);
    ctx.restore();
    const atmosphere = ctx.createRadialGradient(ox, oy, globeRadius*.97, ox, oy, globeRadius*1.09);
    atmosphere.addColorStop(0, "rgba(154,219,177,0)"); atmosphere.addColorStop(.25, "rgba(154,219,177,.16)"); atmosphere.addColorStop(1, "rgba(115,205,179,0)");
    ctx.fillStyle = atmosphere; ctx.beginPath(); ctx.arc(ox, oy, globeRadius*1.09, 0, TAU); ctx.fill();
    ctx.strokeStyle = "rgba(173,226,185,.59)"; ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(ox, oy, globeRadius, 0, TAU); ctx.stroke();
  }
  function drawBangkok() {
    const p = project(homePoint);
    if (!visible(p)) return;
    const pulse = (Math.sin(elapsed*2.5)+1)/2;
    const halo = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], 17);
    halo.addColorStop(0, "rgba(209,255,153,.48)"); halo.addColorStop(1, "rgba(195,247,123,0)");
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(p[0], p[1], 17, 0, TAU); ctx.fill();
    ctx.strokeStyle = `rgba(212,255,165,${.55-pulse*.2})`; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(p[0], p[1], 6+pulse*5, 0, TAU); ctx.stroke();
    ctx.fillStyle = "#e1ffb0"; ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, TAU); ctx.fill();
    // The leader stays inside the canvas even when the user rotates the globe.
    const endX = Math.min(width-70, Math.max(12, p[0]+22));
    const endY = Math.min(height-64, Math.max(55, p[1]-29));
    ctx.strokeStyle = "rgba(202,238,159,.8)"; ctx.lineWidth = .8;
    ctx.beginPath(); ctx.moveTo(p[0]+4, p[1]-4); ctx.lineTo(endX, endY); ctx.lineTo(endX+57, endY); ctx.stroke();
    ctx.fillStyle = "#dcf6b9"; ctx.font = "9px Consolas, monospace"; ctx.fillText("BANGKOK", endX+2, endY-6);
  }
  const paintFace = (points: Point[], face: Face, fromMesh: boolean) => {
    const ink = surfaceColors[Math.round(face.tone*31)];
    ctx.beginPath();
    face.indices.forEach((index, i) => { const p=points[index]; if (i===0) ctx.moveTo(p[0],p[1]); else ctx.lineTo(p[0],p[1]); });
    ctx.closePath();
    ctx.fillStyle = face.fill ?? ink.fill; ctx.fill();
    ctx.lineWidth = fromMesh ? .65 : .8;
    ctx.strokeStyle = face.edge ?? ink.line; ctx.stroke();
  };
  const paintMesh = (points: Point[], faces: Face[], cull: boolean) => {
    const plane = faces.flatMap(face => {
      const [a,b,c,d] = face.indices.map(i => points[i]);
      if (cull && (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]) >= 0) return [];
      return [{face, depth: a[2]+b[2]+c[2]+d[2]}];
    });
    plane.sort((a,b) => a.depth-b.depth);
    for (const item of plane) paintFace(points,item.face,cull);
  };

  ctx.clearRect(0,0,width,height);
  const glow=ctx.createRadialGradient(ox,oy,0, ox,oy,scale*1.35);
  glow.addColorStop(0,"rgba(91,118,49,.10)"); glow.addColorStop(1,"rgba(91,118,49,0)");
  ctx.fillStyle=glow; ctx.fillRect(0,0,width,height);
  for (const star of stars) {
    ctx.fillStyle = `rgba(183,200,159,${star.size*.6})`;
    const x=star.x*width, y=star.y*height;
    ctx.fillRect(x,y,star.size,star.size);
    if (star.size>1.035) { ctx.fillRect(x-2,y,5,.65); ctx.fillRect(x,y-2,.65,5); }
  }
  const lines = trajectories.map(track => ({color: track.color, points: track.points.map(project)}));
  const drawTracks = (near: boolean) => {
    for (const line of lines) {
      ctx.beginPath(); ctx.lineWidth=.78; ctx.strokeStyle=line.color;
      line.points.slice(1).forEach((p,i) => {
        const prev=line.points[i];
        if ((p[2]+prev[2]>=0)===near) {ctx.moveTo(prev[0],prev[1]);ctx.lineTo(p[0],p[1]);}
      }); ctx.stroke();
    }
  };
  const angle=2.14+elapsed*.18, center=probePosition(angle);
  const tangent=orbit(angle+Math.PI/2,1,probeOrbit.inclination,probeOrbit.node);
  const radial=orbit(angle,1,probeOrbit.inclination,probeOrbit.node);
  const normal: Point = [
    radial[1]*tangent[2]-radial[2]*tangent[1],
    radial[2]*tangent[0]-radial[0]*tangent[2],
    radial[0]*tangent[1]-radial[1]*tangent[0]
  ];
  const onProbe = ([x,y,z]: Point): Point => [0,1,2].map(i => center[i]+x*tangent[i]+y*radial[i]+z*normal[i]) as Point;
  const drawProbe = () => {
    for(let i=1;i<=22;i++) {
      const a=project(probePosition(angle-(i-1)*.014)), b=project(probePosition(angle-i*.014));
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);
      ctx.strokeStyle=`rgba(224,194,128,${.47*(1-i/23)})`;ctx.lineWidth=1.25;ctx.stroke();
    }
    paintMesh(probe.vertices.map(p=>project(onProbe(p))),probe.faces,false);
  };
  const isNear=project(center)[2]>=0;
  drawTracks(false);
  if (!isNear) drawProbe();
  drawEarth();
  drawTracks(true);
  if (isNear) drawProbe();
  drawBangkok();
  [1,2].forEach((n) => {
    const tr=trajectories[n], t=elapsed*(n===1 ? -.13:.1) + n*1.1;
    const [x,y,z]=project(orbit(t,tr.distance,tr.inclination,tr.node));
    if (z<0 && Math.hypot(x-ox,y-oy)<globeRadius) return;
    ctx.fillStyle="#ceeaa3"; ctx.beginPath();ctx.arc(x,y,1.7,0,TAU);ctx.fill();
  });
}
