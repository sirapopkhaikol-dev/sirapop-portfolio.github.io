const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../components/sitePath.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function helpers(basePath) {
  const target = { exports: {} };
  new Function('process', 'module', 'exports', compiled)({ env: { NEXT_PUBLIC_BASE_PATH: basePath } }, target, target.exports);
  return target.exports;
}

test('Root hosting keeps asset, document and navigation URLs unchanged', () => {
  const { sitePath, withoutBasePath } = helpers('');
  for (const value of ['/portrait.jpg', '/resume.pdf', '/resume/', '/#journey']) assert.equal(sitePath(value), value);
  assert.equal(withoutBasePath('/contact/'), '/contact/');
});
test('GitHub project Pages prefix local paths once and retain route detection', () => {
  const base = '/sirapop-portfolio.github.io';
  const { sitePath, withoutBasePath } = helpers(base + '/');
  for (const value of ['/portrait.jpg', '/resume.pdf', '/resume/', '/#values']) {
    assert.equal(sitePath(value), base + value);
    assert.equal(sitePath(sitePath(value)), base + value);
  }
  assert.equal(withoutBasePath(base + '/contact/'), '/contact/');
  assert.equal(withoutBasePath(base), '/');
  assert.equal(withoutBasePath(base + '-other/'), base + '-other/');
});
test('External links, email, phone and document anchors remain unchanged', () => {
  const { sitePath } = helpers('/project');
  for (const value of ['https://moneymonkey.trade/', 'mailto:hello@example.com', 'tel:+66970833356', '#editor', '//example.com/image.png']) assert.equal(sitePath(value), value);
});
