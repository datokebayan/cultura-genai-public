import {readdirSync,readFileSync} from 'node:fs';import{join,resolve}from'node:path';
const root=resolve(import.meta.dirname,'..');
function files(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]);}
const all=files(root);
for(const [path,rel] of [['academy/src/adaptive-engine.js','../../packages/adaptengine/core.js'],['adaptengine/src/adaptive-engine.js','../../packages/adaptengine/core.js']]){
 const expected=readFileSync(join(root,path),'utf8');if(!expected.includes(rel))throw new Error('GitHub Pages shared engine import must stay inside published web folder: '+path);
}
const violations=[];
for(const p of all){
 if(/\.(sql|ts)$/.test(p))violations.push(`Sensitive server-only file under web: ${p}`);
 if(!/\.(js|html|json|md|toml|yml|yaml)$/.test(p))continue;
 const s=readFileSync(p,'utf8');
 if(/(?:OPENAI_API_KEY\s*[:=]\s*['"]sk-|SUPABASE_SECRET_KEY\s*[:=]\s*['"]\w|sb_secret_[A-Za-z0-9]{12,}|sk-proj-[A-Za-z0-9_-]{12,})/.test(s))violations.push(`Possible credential in ${p}`);
 if(p.includes('/pilot/')&&/\b(answer\s*:\s*[0-3]|correctIndex\s*:|finalBank\s*=)/.test(s))violations.push(`Possible hidden exam key in pilot: ${p}`);
}
if(violations.length){console.error(violations.join('\n'));process.exit(1)}
console.log(`Public artifact safety check passed (${all.length} files, no server quiz bank or detected secrets).`);
