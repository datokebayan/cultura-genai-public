/**
 * m-DOAI AdaptEngine core — open, dependency-free, reusable JavaScript.
 * IMPORTANT: fixed BKT parameters are illustrative, not learned or validated.
 * Works in browsers and Node 18+; no personal information is sent anywhere.
 */
export const BKT_PARAMS = Object.freeze({initial:0.20,learn:0.15,guess:0.20,slip:0.10});
export const DIFFICULTIES = Object.freeze(['foundation','developing','advanced']);
export const clamp = (number,min=0,max=1) => Math.min(max,Math.max(min,Number.isFinite(Number(number))?Number(number):min));

export function validateParams(params=BKT_PARAMS){
 for (const key of ['initial','learn','guess','slip']){
  if (!Number.isFinite(params[key]) || params[key]<0 || params[key]>1) throw new RangeError(`BKT ${key} must be a probability in [0,1]`);
 }
 return params;
}

/** Classic two-state, no-forgetting BKT. First update knowledge with the
 * observed response (Bayes' theorem), then apply the learn transition. */
export function bktStep(prior, correct, params=BKT_PARAMS){
 validateParams(params);
 if (typeof correct!=='boolean') throw new TypeError('correct must be boolean');
 const p=clamp(prior);
 const knownLikelihood=correct ? 1-params.slip : params.slip;
 const unknownLikelihood=correct ? params.guess : 1-params.guess;
 const evidence = p*knownLikelihood + (1-p)*unknownLikelihood;
 const posterior = evidence>0 ? (p*knownLikelihood/evidence) : p;
 const next = clamp(posterior + (1-posterior)*params.learn);
 return {prior:p,posterior,mastery:next,likelihood:evidence};
}
export function updateBKT(prior,correct,params=BKT_PARAMS){return bktStep(prior,correct,params).mastery}
export function replayMastery(history=[],params=BKT_PARAMS){
 validateParams(params);
 return history.reduce((p,a)=>updateBKT(p,Boolean(a.correct),params),params.initial);
}
export function masteryTrace(history=[],params=BKT_PARAMS){
 let p=params.initial;
 return history.map((attempt,index)=>{
  const step=bktStep(p,Boolean(attempt.correct),params);p=step.mastery;
  return {attempt:index+1,questionId:attempt.questionId||null,correct:!!attempt.correct,mastery:p,posterior:step.posterior};
 });
}
export function ruleRecommendation(history=[]){
 if (!history.length) return {level:'foundation',why:'Start with a foundation-level question.',rate:null};
 const recent=history.slice(-3), rate=recent.filter(a=>a.correct).length/recent.length;
 if (recent.length>=2 && rate>=0.8) return {level:'advanced',why:'Most recent answers were correct. Try an advanced challenge.',rate};
 if (recent.length>=2 && rate>=0.5) return {level:'developing',why:'Build confidence with an intermediate challenge.',rate};
 return {level:'foundation',why:'Review the basics using a foundation challenge.',rate};
}
export function bktRecommendation(history=[],params=BKT_PARAMS){
 const mastery=replayMastery(history,params);
 return {level:mastery>=0.80?'advanced':mastery>=0.50?'developing':'foundation',
  why:`Illustrative BKT mastery estimate: ${Math.round(mastery*100)}%. This is not a validated proficiency score.`,mastery};
}
export function chooseNextItem(items=[],history=[],mode='rule',params=BKT_PARAMS){
 if(!['rule','bkt'].includes(mode))throw new RangeError('Mode must be rule or bkt');
 const seen=new Set(history.map(a=>a.questionId));
 const available=items.filter(q=>!seen.has(q.id));
 const recommendation=mode==='bkt'?bktRecommendation(history,params):ruleRecommendation(history);
 if (!available.length)return {item:null,recommendation,exhausted:true};
 const target=DIFFICULTIES.indexOf(recommendation.level);
 const sorted=[...available].sort((a,b)=>{
  const da=Math.abs(DIFFICULTIES.indexOf(a.difficulty)-target),db=Math.abs(DIFFICULTIES.indexOf(b.difficulty)-target);
  return da-db || String(a.id).localeCompare(String(b.id));
 });
 return {item:sorted[0],recommendation,exhausted:false};
}
/** Safely reduce data to a skill-only summary, without student identifiers. */
export function summarize(history=[],params=BKT_PARAMS){
 const correct=history.filter(x=>x.correct).length;
 return {attempts:history.length,correct,accuracy:history.length?correct/history.length:null,
  estimatedMastery:replayMastery(history,params),note:'Illustrative BKT with uncalibrated parameters; not a diagnostic score.'};
}
