import {syntheticPeople,modules} from './data.js';
import {bankFor,mdoaiMapping} from './adaptive-data.js';
import {BKT_PARAMS,chooseNextItem,replayMastery,ruleRecommendation,bktRecommendation,masteryTrace,summarize,validateParams} from './adaptive-engine.js';
const STORAGE='mdoai-adaptengine-demo-v1';
const clone=x=>JSON.parse(JSON.stringify(x));
const seed={
 S100:{M01:[{questionId:'M01-Q1',correct:true,selected:1,synthetic:true},{questionId:'M01-P1',correct:true,selected:0,synthetic:true}]},
 S101:{M02:[{questionId:'M02-Q1',correct:false,selected:2,synthetic:true},{questionId:'M02-P1',correct:false,selected:1,synthetic:true}]},
 S102:{M04:[{questionId:'M04-Q1',correct:true,selected:0,synthetic:true},{questionId:'M04-P1',correct:false,selected:2,synthetic:true}]},S103:{}
};
const defaults=()=>({lang:'en',mode:'rule',learner:'S100',module:'M01',tab:'practice',params:{...BKT_PARAMS},history:clone(seed),feedback:null,notice:''});
export class AdaptModel{
 constructor(){this.s=defaults();try{const obj=JSON.parse(localStorage.getItem(STORAGE)||'null');if(obj&&obj.history&&obj.params){this.s={...this.s,...obj};validateParams(this.s.params)}}catch{this.s=defaults()}}
 persist(){try{localStorage.setItem(STORAGE,JSON.stringify(this.s))}catch{}}
 set(change){Object.assign(this.s,change);this.persist()}
 get learner(){return syntheticPeople.find(p=>p.id===this.s.learner)||syntheticPeople[0]}
 get course(){return modules.find(m=>m.id===this.s.module)||modules[0]}
 get history(){return this.s.history[this.s.learner]?.[this.s.module]||[]}
 get choice(){return chooseNextItem(bankFor(this.s.module),this.history,this.s.mode,this.s.params)}
 get rule(){return ruleRecommendation(this.history)}
 get bkt(){return bktRecommendation(this.history,this.s.params)}
 get mastery(){return replayMastery(this.history,this.s.params)}
 get trace(){return masteryTrace(this.history,this.s.params)}
 get map(){return mdoaiMapping[this.s.module]}
 answer(questionId,index){
  const {item}=this.choice;
  if(!item||questionId!==item.id)return {error:'Current question has changed. Try again.'};
  if(!Number.isInteger(index)||index<0||index>=item.choices.en.length)return {error:'Select one answer.'};
  const attempt={questionId:item.id,correct:index===item.answer,selected:index,mode:this.s.mode,synthetic:true,at:new Date().toISOString()};
  this.s.history[this.s.learner]??={};this.s.history[this.s.learner][this.s.module]??=[];
  this.s.history[this.s.learner][this.s.module].push(attempt);
  this.s.feedback={itemId:item.id,correct:attempt.correct,selected:index};
  this.persist();return {ok:true};
 }
 next(){this.s.feedback=null;this.persist()}
 select(change){this.set({...change,feedback:null,notice:''})}
 resetCurrent(){this.s.history[this.s.learner]??={};this.s.history[this.s.learner][this.s.module]=[];this.s.feedback=null;this.persist()}
 resetAll(){this.s=defaults();this.persist()}
 changeParam(key,value){if(!['initial','learn','guess','slip'].includes(key))return;const p={...this.s.params,[key]:Number(value)};try{validateParams(p);this.s.params=p;this.s.feedback=null;this.persist()}catch{}}
 aggregate(){return modules.map(m=>({id:m.id,mapping:mdoaiMapping[m.id],...summarize(this.s.history[this.s.learner]?.[m.id]||[],this.s.params)}))}
 export(){return {name:'m-DOAI AdaptEngine — SYNTHETIC DEMO',generatedAt:new Date().toISOString(),notRealEvidence:true,
  mode:this.s.mode,params:this.s.params,selectedModule:this.s.module,summary:this.aggregate(),
  perModule:modules.map(m=>({module:m.id,trace:masteryTrace(this.s.history[this.s.learner]?.[m.id]||[],this.s.params)})),
  note:'No names, emails or identifiers exported. Not a validated model, credential or experiment.'}}
}
