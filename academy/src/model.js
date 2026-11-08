import {modules, syntheticPeople,cadg} from './data.js';
import {bankFor} from './adaptive-data.js';
import {chooseNextItem,replayMastery,ruleRecommendation,bktRecommendation} from './adaptive-engine.js';
const KEY='culturagenai-demo-v1';
const sampleEvidence={
 D:'Target learners: mixed-language Form 4 class; use plain Malay and English, keyboard access and no real student identifiers.',
 O:'Compared a bilingual lesson outline and a visual glossary; selected both for different learner needs.',
 A:'Prompt v1 requested a lesson. Verified three claims, added explicit sources, refined v2 and asked a teacher to review.',
 I:'Teacher retained the final decision, removed a stereotypical example and disclosed AI assistance; no personal data was shared.'
};
const base={
 language:'en',role:'student',studentId:'S100',page:'overview',currentModule:'M01',
 quizzes:{S100:{M01:{correct:3,total:3,at:'2026-11-04'}},S101:{M02:{correct:3,total:3,at:'2026-11-03'}},S102:{M03:{correct:3,total:3,at:'2026-11-02'}}},
 submissions:[
 {id:'SUB-101',studentId:'S100',moduleId:'M01',evidence:{...sampleEvidence},sources:'Museum publication and a government education resource; reviewed original pages.',declaration:true,privacy:true,status:'approved',at:'2026-11-04',reviewedAt:'2026-11-05',reviewer:'Demo Educator',feedback:'Clear source verification and human oversight. Simulated approval.'},
 {id:'SUB-102',studentId:'S101',moduleId:'M02',evidence:{...sampleEvidence,D:'TVET prompt scenario rewritten using non-identifiable synthetic records.'},sources:'Institutional privacy policy and training guidance (example only).',declaration:true,privacy:true,status:'pending',at:'2026-11-03',reviewedAt:null,reviewer:null,feedback:''},
 {id:'SUB-103',studentId:'S102',moduleId:'M03',evidence:{...sampleEvidence,A:'Draft disclosure prepared; original source checking remains incomplete.'},sources:'Original source links need verification (sample).',declaration:true,privacy:true,status:'revision',at:'2026-11-02',reviewedAt:'2026-11-03',reviewer:'Demo Educator',feedback:'Please document verification of two original sources.'}
 ],
 badges:[{id:'DEMO-BADGE-001',studentId:'S100',moduleId:'M01',date:'2026-11-05',reviewer:'Demo Educator',demo:true}],
 audit:cadg.map((_,i)=>({score:i%3,note:''})),
 community:[{name:'Community reviewer (synthetic)',text:'Use locally meaningful examples and test translations with native speakers.',date:'2026-11-01'}],
 reflections:Array.from({length:20},()=>3),
 coachHistory:[],drafts:{},notice:'',
 adaptiveMode:'rule',adaptiveModule:'M01',adaptiveDisplay:'question',
 adaptive:{S100:{M01:[{questionId:'M01-Q1',selected:1,correct:true,at:'2026-11-02T09:00:00Z',mode:'rule',synthetic:true},{questionId:'M01-P1',selected:0,correct:true,at:'2026-11-02T09:05:00Z',mode:'rule',synthetic:true}]},S101:{M02:[{questionId:'M02-Q1',selected:0,correct:false,at:'2026-11-02T09:00:00Z',mode:'rule',synthetic:true}]},S102:{M03:[{questionId:'M03-Q1',selected:0,correct:true,at:'2026-11-02T09:00:00Z',mode:'rule',synthetic:true}]},S103:{}}
};
const clone=o=>JSON.parse(JSON.stringify(o));
export class DemoModel{
 constructor(){let stored=null;try{stored=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}this.state=stored&&stored.submissions&&stored.quizzes?{...clone(base),...stored}:clone(base);this.normalize()}
 normalize(){if(!Array.isArray(this.state.audit)||this.state.audit.length!==10)this.state.audit=clone(base.audit);if(!Array.isArray(this.state.reflections)||this.state.reflections.length!==20)this.state.reflections=clone(base.reflections);if(!this.state.adaptive||typeof this.state.adaptive!=='object')this.state.adaptive=clone(base.adaptive);if(!['rule','bkt'].includes(this.state.adaptiveMode))this.state.adaptiveMode='rule';if(!modules.some(x=>x.id===this.state.adaptiveModule))this.state.adaptiveModule='M01';if(!['question','feedback'].includes(this.state.adaptiveDisplay))this.state.adaptiveDisplay='question'}
 persist(){try{localStorage.setItem(KEY,JSON.stringify(this.state))}catch(e){console.warn('Local demo storage unavailable:',e)}}
 set(patch){Object.assign(this.state,patch);this.persist()}
 notify(message){this.state.notice=message;this.persist()}
 clearNotice(){this.state.notice='';this.persist()}
 reset(){this.state=clone(base);this.persist()}
 activePerson(){return syntheticPeople.find(p=>p.id===this.state.studentId)||syntheticPeople[0]}
 getQuiz(studentId,moduleId){return this.state.quizzes?.[studentId]?.[moduleId]||null}
 checkQuiz(studentId,moduleId,answers){const mod=modules.find(m=>m.id===moduleId);if(!mod)return {error:'Module not found'};const correct=mod.quiz.filter((q,i)=>Number(answers[i])===q.answer).length;this.state.quizzes[studentId]??={};this.state.quizzes[studentId][moduleId]={correct,total:mod.quiz.length,at:new Date().toISOString()};this.persist();return {correct,total:mod.quiz.length,passed:correct>=2}}
 getSubmission(studentId,moduleId){return this.state.submissions.find(s=>s.studentId===studentId&&s.moduleId===moduleId)}
 saveDraft(studentId,moduleId,draft){this.state.drafts[studentId+'-'+moduleId]=draft;this.persist()}
 getDraft(studentId,moduleId){return this.state.drafts[studentId+'-'+moduleId]||this.getSubmission(studentId,moduleId)||null}
 saveSubmission(studentId,moduleId,record){const quiz=this.getQuiz(studentId,moduleId);if(!quiz||quiz.correct<2)return {error:'Complete the quiz with at least 2 of 3 correct answers before submission.'};const keys=['D','O','A','I'];if(keys.some(k=>(record.evidence[k]||'').trim().length<20))return {error:'Each D/O/A/I reflection needs at least 20 characters.'};if((record.sources||'').trim().length<20)return {error:'Please describe a meaningful source or verification step (20+ characters).'};if(!record.declaration||!record.privacy)return {error:'Both ethical declarations are required.'};let s=this.getSubmission(studentId,moduleId);if(s?.status==='approved')return {error:'Approved submissions are locked in this demo.'};if(s){Object.assign(s,record,{status:'pending',at:new Date().toISOString(),reviewer:null,reviewedAt:null,feedback:''})}else{this.state.submissions.push({id:'SUB-'+String(Date.now()).slice(-7),studentId,moduleId,...record,status:'pending',at:new Date().toISOString(),reviewer:null,reviewedAt:null,feedback:''})}this.persist();return {ok:true}}
 review(id,decision,feedback){const item=this.state.submissions.find(s=>s.id===id);if(!item)return {error:'Not found'};if(!['approved','revision'].includes(decision))return {error:'Invalid decision'};if(decision==='revision'&&feedback.trim().length<8)return {error:'Explain revision in at least 8 characters.'};const quiz=this.getQuiz(item.studentId,item.moduleId);if(!quiz||quiz.correct<2||!['D','O','A','I'].every(k=>(item.evidence?.[k]||'').length>=20)||!item.privacy||!item.declaration||!(item.sources||'').trim())return {error:'Missing assessment criteria'};item.status=decision;item.feedback=feedback.trim();item.reviewer='Demo Educator';item.reviewedAt=new Date().toISOString();if(decision==='approved'&&!this.state.badges.some(b=>b.studentId===item.studentId&&b.moduleId===item.moduleId))this.state.badges.push({id:'DEMO-BADGE-'+String(Date.now()).slice(-7),studentId:item.studentId,moduleId:item.moduleId,date:new Date().toISOString(),reviewer:'Demo Educator',demo:true});this.persist();return {ok:true}}
 auditUpdate(index,score,note){this.state.audit[index]={score:Number(score),note:String(note||'').slice(0,300)};this.persist()}
 suggest(name,text){if(String(text||'').trim().length<15)return {error:'Enter a suggestion of at least 15 characters.'};this.state.community.unshift({name:String(name||'Demo Community').slice(0,60),text:String(text).slice(0,700),date:new Date().toISOString()});this.persist();return {ok:true}}
 updateReflection(index,val){if(index<0||index>19)return;this.state.reflections[index]=Math.min(5,Math.max(1,Number(val)));this.persist()}
 getAdaptiveHistory(studentId=this.state.studentId,moduleId=this.state.adaptiveModule){return this.state.adaptive?.[studentId]?.[moduleId]||[]}
 getAdaptiveStatus(studentId=this.state.studentId,moduleId=this.state.adaptiveModule){
  const history=this.getAdaptiveHistory(studentId,moduleId);
  const mode=this.state.adaptiveMode;
  return {...chooseNextItem(bankFor(moduleId),history,mode),history,mastery:replayMastery(history),rule:ruleRecommendation(history),bkt:bktRecommendation(history)};
 }
 answerAdaptive(questionId,selected){
  const id=this.state.adaptiveModule,person=this.state.studentId;
  if(this.state.adaptiveDisplay==='feedback')return {error:'Continue to the next question first.'};
  const status=this.getAdaptiveStatus(person,id);
  if(!status.item)return {error:'Question bank complete. Choose another module or reset practice.'};
  if(status.item.id!==questionId)return {error:'Question changed. Please review the current item.'};
  const answer=Number(selected);
  if(!Number.isInteger(answer)||answer<0||answer>=status.item.choices.en.length)return {error:'Please select one answer.'};
  this.state.adaptive[person]??={};this.state.adaptive[person][id]??=[];
  const correct=answer===status.item.answer;
  this.state.adaptive[person][id].push({questionId:status.item.id,selected:answer,correct,at:new Date().toISOString(),mode:this.state.adaptiveMode,synthetic:true});
  this.state.adaptiveDisplay='feedback';this.persist();return {ok:true,correct};
 }
 nextAdaptive(){this.state.adaptiveDisplay='question';this.persist()}
 selectAdaptive(moduleId){if(!modules.some(m=>m.id===moduleId))return;this.state.adaptiveModule=moduleId;this.state.adaptiveDisplay='question';this.persist()}
 setAdaptiveMode(mode){if(!['rule','bkt'].includes(mode))return;this.state.adaptiveMode=mode;this.state.adaptiveDisplay='question';this.persist()}
 resetAdaptiveModule(){const sid=this.state.studentId,id=this.state.adaptiveModule;this.state.adaptive[sid]??={};this.state.adaptive[sid][id]=[];this.state.adaptiveDisplay='question';this.persist()}
 stats(){return {learners:syntheticPeople.length,approved:this.state.badges.length,pending:this.state.submissions.filter(s=>s.status==='pending').length,safety:this.state.submissions.filter(s=>s.privacy).length,submissions:this.state.submissions.length,quizAttempts:Object.values(this.state.quizzes).reduce((a,v)=>a+Object.keys(v).length,0),adaptivePracticeAttempts:Object.values(this.state.adaptive).reduce((n,mods)=>n+Object.values(mods).reduce((k,h)=>k+h.length,0),0)}}
 exportSummary(){return {meta:{title:'CulturaGenAI Academy — SYNTHETIC DEMO EXPORT',generatedAt:new Date().toISOString(),warning:'Synthetic demonstration records, not study evidence or accredited credentials.'},statistics:this.stats(),audit:this.state.audit.map((a,i)=>({criterion:cadg[i][0],...a})),moduleCompletion:modules.map(m=>({module:m.id,badges:this.state.badges.filter(b=>b.moduleId===m.id).length})),communityCount:this.state.community.length,adaptiveDemo:Object.entries(this.state.adaptive).map(([studentId,modMap])=>({studentId,modules:Object.entries(modMap).map(([moduleId,history])=>({moduleId,attempts:history.length,correct:history.filter(x=>x.correct).length,estimatedBktMastery:replayMastery(history),note:'Illustrative probabilities; synthetic records only'}))}))}}
}
