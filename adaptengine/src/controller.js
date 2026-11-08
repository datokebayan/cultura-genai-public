import {AdaptModel} from './model.js';
import {render} from './view.js';
import {BKT_PARAMS} from './adaptive-engine.js';
const model=new AdaptModel();
const root=document.querySelector('#app');
function draw(){root.innerHTML=render(model);document.documentElement.lang=model.s.lang;document.title='m-DOAI AdaptEngine · Adaptive Learning';}
function notify(msg){model.set({notice:msg});draw()}
function exportJSON(){const file=new Blob([JSON.stringify(model.export(),null,2)],{type:'application/json'});const u=URL.createObjectURL(file);const anchor=document.createElement('a');anchor.href=u;anchor.download='mdoai-adaptengine-SYNTHETIC-summary.json';anchor.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
root.addEventListener('change',event=>{
 const e=event.target;
 if(e.id==='lang')model.set({lang:e.value});
 else if(e.id==='learner')model.select({learner:e.value});
 else if(e.id==='module')model.select({module:e.value});
 else if(e.id==='mode')model.select({mode:e.value});
 else return;
 draw();
});
root.addEventListener('change',event=>{
 const p=event.target.dataset.param;if(!p)return;
 model.changeParam(p,event.target.value);draw();
});
root.addEventListener('click',event=>{
 const b=event.target.closest('[data-tab],[data-action],[data-module]');if(!b)return;
 if(b.dataset.tab){model.set({tab:b.dataset.tab,notice:''});draw();document.querySelector('#content')?.focus({preventScroll:true});return}
 if(b.dataset.module){model.select({module:b.dataset.module,tab:'practice'});draw();return}
 switch(b.dataset.action){
  case 'next':model.next();draw();break;
  case 'reset':if(confirm('Clear practice attempts for this demo learner and module?')){model.resetCurrent();draw()}break;
  case 'defaults':model.set({params:{...BKT_PARAMS}});draw();break;
  case 'export':exportJSON();break;
  case 'resetAll':if(confirm('Reset this local demo?')){model.resetAll();draw()}break;
 }
});
root.addEventListener('submit',event=>{
 if(event.target.id!=='answerForm')return;
 event.preventDefault();const radio=event.target.querySelector('input[name="selected"]:checked');
 if(!radio){notify('Please choose an answer.');return}
 const result=model.answer(event.target.dataset.id,Number(radio.value));
 if(result.error)notify(result.error);else draw();
});
draw();
if('serviceWorker' in navigator && location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
