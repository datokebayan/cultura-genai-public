import test from 'node:test';
import assert from 'node:assert/strict';
import {AdaptModel} from '../src/model.js';
import {render} from '../src/view.js';
import {modules} from '../src/data.js';
const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
test('standalone app renders all three sections',()=>{
 const model=new AdaptModel();
 for(const tab of ['practice','insights','explain']){
  model.set({tab});const html=render(model);
  assert.match(html,/m-DOAI/);assert.match(html,/AdaptEngine/);
  assert.match(html,/<main id="content"/);
  assert.ok(html.length>3500);
 }
});
test('standalone demonstrates answer, adaptive progress and export without identity',()=>{
 const m=new AdaptModel();m.set({learner:'S103',module:'M06',mode:'bkt',tab:'practice',feedback:null});m.resetCurrent();
 const start=m.choice.item;assert.ok(start);
 const answer=m.answer(start.id,start.answer);
 assert.equal(answer.ok,true);assert.equal(m.history.length,1);
 assert.notEqual(m.choice.item?.id,start.id);
 assert.equal(m.trace.length,1);
 assert.ok(m.mastery>0 && m.mastery<1);
 m.next();assert.ok(render(m).includes('answerForm'));
 const exported=JSON.stringify(m.export());
 assert.equal(exported.includes(m.learner.name),false);
 assert.equal(m.export().notRealEvidence,true);
});
test('all six modules can be selected and display localized questions',()=>{
 const m=new AdaptModel();for(const x of modules){m.select({module:x.id,lang:'ms',tab:'practice',feedback:null});assert.ok(render(m).includes('Microcredential')||render(m).includes('Mikro-kredensial'));assert.ok(m.choice.item)}
});
