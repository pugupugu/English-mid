const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = path.join(__dirname, '..', 'data');
const sb = { window: {} }; vm.createContext(sb);
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort();
const by = {};
for (const f of files) { sb.window.WORDS = []; vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), sb); by[f] = sb.window.WORDS.slice(); }
const all = Object.entries(by).flatMap(([f, a]) => a.map(x => ({ ...x, f })));
const cnt = {}; all.forEach(x => (cnt[x.lv] = (cnt[x.lv] || 0) + 1));
const seen = {}, dups = [];
all.forEach(x => { if (seen[x.w]) dups.push(`${x.w} (${seen[x.w]} / ${x.f})`); else seen[x.w] = x.f; });
console.log('files', files.length, 'total', all.length, cnt, 'dups', dups);
