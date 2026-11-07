const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

// Exercise the actual renderer with identifiable geographic landmarks as its
// land samples. Record their canvas positions instead of duplicating its math.
const landmarks = [[100.5, 13.75], [100.5, 35], [100.5, -6], [78, 13.75], [120, 13.75]];
const source = fs.readFileSync(path.join(__dirname, '../components/orbitalGeometry.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText;
const renderer = { exports: {} };
new Function('require', 'module', 'exports', compiled)(
  name => {
    assert.equal(name, './earthLand');
    return { coastlines: [], landPoints: landmarks };
  }, renderer, renderer.exports,
);
const { drawOrbit, homeCamera } = renderer.exports;

function renderLandmarks(camera, width = 660, height = 430) {
  const points = [];
  let arc;
  const noop = () => {};
  const gradient = () => ({ addColorStop: noop });
  const context = {
    save: noop, restore: noop, clearRect: noop, fillRect: noop, clip: noop,
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop,
    stroke: noop, fillText: noop, createRadialGradient: gradient,
    createLinearGradient: gradient,
    arc(x, y) { arc = { x, y }; },
    fill() {
      if (typeof this.fillStyle === 'string' && this.fillStyle.startsWith('rgba(180,220,137,')) points.push(arc);
    },
  };
  drawOrbit(context, width, height, camera, 0);
  assert.equal(points.length, landmarks.length, 'All reference landmarks must be visible');
  for (const p of points) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
  return points;
}

for (const [width, height] of [[660, 430], [347, 230]]) {
  test(`North and south have correct screen positions at ${width}px`, () => {
    const [bangkok, north, south] = renderLandmarks(homeCamera, width, height);
    assert.ok(north.y < bangkok.y, 'Northern latitude must appear above Bangkok');
    assert.ok(south.y > bangkok.y, 'Southern latitude must appear below Bangkok');
  });
  test(`East and west are not mirrored at ${width}px`, () => {
    const [bangkok, , , west, east] = renderLandmarks(homeCamera, width, height);
    assert.ok(west.x < bangkok.x, 'India-side longitudes must appear to the left');
    assert.ok(east.x > bangkok.x, 'Eastern longitudes must appear to the right');
  });
}

test('Gentle camera animation preserves geographic orientation', () => {
  for (const seconds of [0, 5, 15, 30, 60]) {
    const camera = {
      yaw: homeCamera.yaw + .065 * Math.sin(seconds * .16),
      pitch: homeCamera.pitch + .025 * Math.sin(seconds * .26),
      roll: homeCamera.roll + .018 * Math.sin(seconds * .16),
    };
    const [bangkok, north, south, west, east] = renderLandmarks(camera);
    assert.ok(north.y < bangkok.y && south.y > bangkok.y);
    assert.ok(west.x < bangkok.x && east.x > bangkok.x);
  }
});
