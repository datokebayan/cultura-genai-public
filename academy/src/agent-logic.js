/**
 * NADI — bounded human-centred learning agent planner.
 * This planner works without an LLM; it is NOT a generative model.
 * Tool-like observation -> planning -> consented action -> reflection steps are explicit.
 */
import {bktRecommendation,ruleRecommendation} from './adaptive-engine.js';
export const TOPICS=Object.freeze({
 M01:{en:'GenAI foundations',ms:'Asas GenAI',zh:'生成式 AI 基础',ta:'GenAI அடிப்படைகள்'},
 M02:{en:'privacy and consent',ms:'privasi dan persetujuan',zh:'隐私与同意',ta:'தனியுரிமை மற்றும் ஒப்புதல்'},
 M03:{en:'verification and integrity',ms:'pengesahan dan integriti',zh:'核验与诚信',ta:'சரிபார்ப்பு மற்றும் நேர்மை'},
 M04:{en:'culture and inclusivity',ms:'budaya dan keterangkuman',zh:'文化与包容',ta:'பண்பாடு மற்றும் உள்ளடக்கம்'},
 M05:{en:'responsible prompting',ms:'prompt bertanggungjawab',zh:'负责任的提示词',ta:'பொறுப்பான prompt'},
 M06:{en:'AI governance',ms:'tadbir urus AI',zh:'AI 治理',ta:'AI ஆளுகை'}
});
const terms=[
 ['M02',/privac|consent|personal|password|data|rahsia|persetujuan|privasi|隐私|同意|தனியுரிமை/i],
 ['M03',/verif|fact|source|cit|hallucin|integrit|semak|sumber|fakta|核查|来源|சரிபார்|ஆதாரம்/i],
 ['M04',/cultur|local|bias|cadg|inklusi|budaya|tempatan|偏见|文化|பண்பாடு|சார்பு/i],
 ['M05',/prompt|instruction|ask ai|question|arahan|soalan|提示词|கேள்வி/i],
 ['M06',/govern|policy|rules|lead|tadbir|dasar|governance|治理|கொள்கை/i],
 ['M01',/what is ai|genai|begin|basic|asas|pemula|基础|அடிப்படை/i]
];
export function detectTopic(input,defaultModule='M01'){
 const s=String(input||'').slice(0,500);
 return terms.find(([,re])=>re.test(s))?.[0] || (TOPICS[defaultModule]?defaultModule:'M01');
}
function bound(n,a,b){return Math.min(b,Math.max(a,Number.isFinite(Number(n))?Number(n):a));}
export function safeContext(ctx={}){
 const moduleId=TOPICS[ctx.moduleId]?ctx.moduleId:'M01';
 const raw=Array.isArray(ctx.history)?ctx.history:[];
 const history=raw.slice(-25).map(x=>({correct:!!x.correct,questionId:String(x.questionId||'').slice(0,40)}));
 const lang=['ms','en','zh','ta'].includes(ctx.language)?ctx.language:'en';
 return {moduleId,language:lang,history,attempts:bound(ctx.attempts??history.length,0,500),
   // Demographic identifiers, raw responses and evidence text are intentionally omitted.
   synthetic:true};
}
export function makeLearningPlan(userText,context={}){
 const c=safeContext(context),moduleId=detectTopic(userText,c.moduleId),h=moduleId===c.moduleId?c.history:[];
 const rule=ruleRecommendation(h),bkt=bktRecommendation(h);
 // One engine's skill estimate is uncalibrated. The rules are a transparent fallback.
 const level=h.length<2?'foundation':h.length>=2?rule.level:'foundation';
 const name=TOPICS[moduleId][c.language] || TOPICS[moduleId].en;
 const msgs={
 en:`Let's practise ${name}. Based on ${h.length} recorded demo answers, I recommend a ${level} challenge. I'll explain the reasoning and let you decide whether to start.`,
 ms:`Mari berlatih ${name}. Berdasarkan ${h.length} jawapan demo yang direkodkan, saya cadangkan latihan tahap ${level}. Saya akan jelaskan sebabnya dan anda yang memutuskan untuk mula.`,
 zh:`我们来练习${name}。根据 ${h.length} 次演示作答，建议尝试${level}级任务；是否开始由你决定。`,
 ta:`${name} பற்றி பயிற்சி செய்வோம். ${h.length} மாதிரி பதில்களின் அடிப்படையில் ${level} நிலையை பரிந்துரைக்கிறேன்; தொடங்குவது உங்கள் முடிவு.`
 };
 return {
  moduleId,level,suggestedAction:'open_practice',statement:msgs[c.language],
  observations:{attempts:h.length,correct:h.filter(x=>x.correct).length,illustrativeMastery:bound(bkt.mastery,0,1)},
  steps:[
   {kind:'observe',detail:`Reviewed ${h.length} synthetic practice attempts (${h.filter(x=>x.correct).length} correct).`},
   {kind:'plan',detail:`Selected ${moduleId} and ${level} practice; rule recommendation: ${rule.level}.`},
   {kind:'recommend',detail:'Ready to open adaptive practice only with learner confirmation.'},
   {kind:'reflect',detail:'After practice, inspect new evidence and revise the recommendation.'}
  ],
  disclaimer:'Rule-based offline agent simulation. BKT parameters are illustrative; no credential is awarded by the agent.'
 };
}
