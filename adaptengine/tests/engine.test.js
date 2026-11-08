import test from 'node:test';
import assert from 'node:assert/strict';
import {BKT_PARAMS,updateBKT,replayMastery,masteryTrace,bktRecommendation,ruleRecommendation,chooseNextItem,validateParams} from '../src/adaptive-engine.js';
import {bankFor,adaptiveItems} from '../src/adaptive-data.js';
test('BKT probability updating a correct answer matches Bayes then learn',()=>{
 const r=updateBKT(.2,true);const posterior=(.2*.9)/(.2*.9+.8*.2);
 assert.ok(Math.abs(r-(posterior+(1-posterior)*.15))<1e-12);
});
test('BKT correct and incorrect answers update differently',()=>{
 assert.ok(updateBKT(.2,true)>updateBKT(.2,false));
 assert.ok(replayMastery([])===BKT_PARAMS.initial);
 assert.ok(replayMastery([{correct:true},{correct:true}])>replayMastery([{correct:false},{correct:false}]));
});
test('rule recommendation depends on recent answers',()=>{
 assert.equal(ruleRecommendation([]).level,'foundation');
 assert.equal(ruleRecommendation([{correct:true},{correct:true}]).level,'advanced');
 assert.equal(ruleRecommendation([{correct:true},{correct:false}]).level,'developing');
 assert.equal(ruleRecommendation([{correct:false},{correct:false}]).level,'foundation');
});
test('choose next item avoids repeats, respects difficulty and exhausts cleanly',()=>{
 const bank=[{id:'a',difficulty:'foundation'},{id:'b',difficulty:'developing'},{id:'c',difficulty:'advanced'}];
 assert.equal(chooseNextItem(bank,[]).item.id,'a');
 const hist=[{questionId:'a',correct:true},{questionId:'b',correct:true}];
 assert.equal(chooseNextItem(bank,hist,'rule').item.id,'c');
 assert.equal(chooseNextItem(bank,[...hist,{questionId:'c',correct:true}]).exhausted,true);
});
test('all six modules have a minimum of six multilingual questions',()=>{
 assert.equal(adaptiveItems.length,36);
 for(const id of ['M01','M02','M03','M04','M05','M06']){
  const b=bankFor(id);assert.equal(b.length,6);
  for(const i of b){assert.equal(i.choices.en.length,3);assert.ok(i.answer>=0&&i.answer<=2);
   for(const language of ['en','ms','zh','ta']){assert.ok(i.question[language]);assert.equal(i.choices[language].length,3)} }
 }
});
test('bad BKT parameters are rejected and trace length consistent',()=>{
 assert.throws(()=>validateParams({...BKT_PARAMS,guess:2}),RangeError);
 assert.throws(()=>updateBKT(.2,'yes'),TypeError);
 assert.equal(masteryTrace([{correct:true},{correct:false}]).length,2);
 assert.ok(bktRecommendation([{correct:true}]).mastery<=1);
});
