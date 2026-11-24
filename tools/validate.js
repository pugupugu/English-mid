// usage: node tools/validate.js <file> <lv:중급|고급> <count> <letters e.g. ab>
const fs = require('fs'), vm = require('vm');
const [file, lv, count, letters] = process.argv.slice(2);
const sb = { window: {} }; vm.createContext(sb);
try { vm.runInContext(fs.readFileSync(file, 'utf8'), sb); } catch (e) { console.log('SYNTAX/RUNTIME ERROR:', e.message); process.exit(1); }
const W = sb.window.WORDS || [], errs = [], seen = new Set();
if (W.length !== +count) errs.push(`count ${W.length} != ${count}`);
W.forEach((x, i) => {
  const t = `#${i + 1} ${x.w}`;
  if (!/^[a-z]+$/.test(x.w || '')) errs.push(`${t}: w must be one lowercase word`);
  if (seen.has(x.w)) errs.push(`${t}: duplicate`); seen.add(x.w);
  if (letters && !letters.includes((x.w || '')[0])) errs.push(`${t}: initial letter outside ${letters}`);
  if (x.lv !== lv) errs.push(`${t}: lv`);
  for (const k of ['pos', 'ph', 'mean', 'easy', 'img', 'nuance']) if (typeof x[k] !== 'string' || x[k].length < 3) errs.push(`${t}: ${k} missing`);
  if (!/^\/.+\/$/.test(x.ph || '')) errs.push(`${t}: ph must look like /.../`);
  if (!Array.isArray(x.parts) || x.parts.some(p => !Array.isArray(p) || p.length !== 2)) errs.push(`${t}: parts must be [] or [[elem,meaning],..]`);
  if (!Array.isArray(x.colloc) || x.colloc.length < 3 || !x.colloc.every(c => c.includes(x.w))) errs.push(`${t}: colloc need >=3 items each containing the headword`);
  if (!Array.isArray(x.syn) || x.syn.length < 2) errs.push(`${t}: syn >=2`);
  if (!Array.isArray(x.ant)) errs.push(`${t}: ant must be array (may be empty)`);
  if (!Array.isArray(x.s) || x.s.length !== 4) errs.push(`${t}: s must have exactly 4 sentences`);
  else x.s.forEach((s, j) => {
    if (s.length !== 3) return errs.push(`${t} s${j + 1}: need [en, ko, context]`);
    const m = s[0].match(/\[\[(.+?)\]\]/g) || [];
    if (m.length !== 1 || m[0] !== `[[${x.w}]]`) errs.push(`${t} s${j + 1}: must contain exactly one [[${x.w}]] (headword unchanged)`);
    if (/[가-힣]/.test(s[0])) errs.push(`${t} s${j + 1}: English sentence has Korean`);
    if (!/[가-힣]/.test(s[1])) errs.push(`${t} s${j + 1}: ko translation missing`);
  });
  for (const k of ['mean', 'easy', 'img', 'nuance']) if (/[\u4e00-\u9fff]/.test(x[k] || '')) errs.push(`${t}: avoid hanja in ${k}`);
});
console.log(errs.length ? errs.slice(0, 60).join('\n') + `\n${errs.length} problem(s)` : `OK ${W.length} words`);
process.exit(errs.length ? 1 : 0);
