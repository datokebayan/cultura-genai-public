import test from 'node:test';
import assert from 'node:assert/strict';
import {DemoModel} from '../src/model.js';
import {render} from '../src/view.js';
const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
test('Academy renders main navigation including the adaptive lab',()=>{
 const model=new DemoModel();
 for(const page of ['overview','courses','module','adaptive','coach','portfolio','dashboard','audit','research']){
  model.set({page});const h=render(model);assert.ok(h.includes('CADG'));assert.ok(h.includes('adaptive'));assert.ok(h.length>5000);
 }
});
test('adaptive answer changes next question, without issuing credential',()=>{
 const m=new DemoModel();m.set({studentId:'S103',adaptiveModule:'M06',adaptiveMode:'bkt',adaptiveDisplay:'question'});m.resetAdaptiveModule();
 const before=m.getAdaptiveStatus();assert.ok(before.item);
 const badges=m.state.badges.length;
 const r=m.answerAdaptive(before.item.id,before.item.answer);assert.equal(r.ok,true);
 assert.equal(m.getAdaptiveHistory().length,1);
 assert.equal(m.state.badges.length,badges);
 m.nextAdaptive();assert.notEqual(m.getAdaptiveStatus().item?.id,before.item.id);
});
test('educator review remains separate from adaptive practice',()=>{
 const m=new DemoModel();const s=m.state.submissions.find(x=>x.id==='SUB-102');assert.ok(s);
 const before=m.state.badges.length;
 const r=m.review(s.id,'approved','This evidence is complete for the simulated assessment.');assert.equal(r.ok,true);
 assert.equal(m.state.badges.length,before+1);
 assert.ok(m.state.badges.at(-1).demo);
});
