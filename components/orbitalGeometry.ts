// The torus, orbital paths and CubeSat share one model-space coordinate system.
// Positive camera depth points toward the viewer.
type Point = [number, number, number];
type Face = { indices: number[]; tone: number; edge?: string; fill?: string };
type Mesh = { vertices: Point[]; faces: Face[] };
type Camera = { yaw: number; pitch: number; roll: number };

const TAU = Math.PI * 2;
const radius = .78;
const tube = .31;

function makeTorus(): Mesh {
  const vertices: Point[] = [];
  const faces: Face[] = [];
  const slices = 72, rings = 24;
  for (let u = 0; u < slices; u++) {
    const a = u / slices * TAU;
    for (let v = 0; v < rings; v++) {
      const b = v / rings * TAU;
      const radial = radius + tube * Math.cos(b);
      vertices.push([radial * Math.cos(a), radial * Math.sin(a), tube * Math.sin(b)]);
      const nextU = (u + 1) % slices, nextV = (v + 1) % rings;
      const light = .5 + .5 * (Math.cos(a + 2.2) * Math.cos(b) * .6 + Math.sin(b) * .8);
      faces.push({ indices: [u*rings+v, nextU*rings+v, nextU*rings+nextV, u*rings+nextV], tone: light });
    }
  }
  return { vertices, faces };
}

const torus = makeTorus();
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
    const h = b*cp-z*sp, depth = b*sp+z*cp;
    const zoom = scale * 6.8 / (6.8-depth);
    return [ox+(a*cr-h*sr)*zoom, oy-(a*sr+h*cr)*zoom, depth];
  };
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
  paintMesh(torus.vertices.map(project), torus.faces,true);
  drawTracks(true);
  if (isNear) drawProbe();
  [1,2].forEach((n) => {
    const tr=trajectories[n], t=elapsed*(n===1 ? -.13:.1) + n*1.1;
    const [x,y,z]=project(orbit(t,tr.distance,tr.inclination,tr.node));
    if (z<0 && Math.hypot(x-ox,y-oy)<scale*1.1) return;
    ctx.fillStyle="#ceeaa3"; ctx.beginPath();ctx.arc(x,y,1.7,0,TAU);ctx.fill();
  });
}
