/** CulturaGenAI Secure Pilot frontend. No exam answers, secret keys, roles or grades are trusted in this client. */
const $ = (s,root=document)=>root.querySelector(s);
import {esc} from './security.js';
const config=window.CULTURA_CONFIG||{};
const ready=/^https:\/\/[^/]+\.supabase\.co\/?$/.test(config.supabaseUrl||'')&&/^sb_publishable_|^eyJ/.test(config.publishableKey||'');
const endpoint=String(config.supabaseUrl||'').replace(/\/$/,'');
const names={M01:'GenAI Foundations & Human Agency',M02:'Privacy, Consent & Safe AI Use',M03:'Academic Integrity, Disclosure & Verification',M04:'CADG, Bias, Culture & Inclusive AI',M05:'Responsible Prompting & Human–AI Iteration',M06:'AI Governance, Assurance & Ethical Leadership'};
const mods=Object.keys(names);
const app={page:'dashboard',session:null,user:null,memberships:[],institutionId:null,role:null,dashboard:null,question:null,practiceFeedback:null,mode:'bkt',moduleId:'M01',exam:null,examResult:null,certificate:null,agentResult:null};
const screen=$('#screen');
const message=$('#message');
function show(text,bad=false){message.hidden=false;message.classList.toggle('error',bad);message.textContent=String(text);message.scrollIntoView({block:'nearest',behavior:'smooth'});}
function clearMessage(){message.hidden=true;message.textContent='';}
function persist(){if(app.session)sessionStorage.setItem('culturagenai-pilot-auth',JSON.stringify(app.session));else sessionStorage.removeItem('culturagenai-pilot-auth');}
async function request(path, options={}){
 if(!ready)throw Error('Set your public Supabase URL and publishable key in pilot/config.js first.');
 let headers={'apikey':config.publishableKey,'Content-Type':'application/json',...options.headers};
 if(options.auth!==false){await refresh();if(app.session?.access_token)headers.Authorization=`Bearer ${app.session.access_token}`;}
 const ctrl=new AbortController();const timeout=setTimeout(()=>ctrl.abort(),18000);
 try{
  const res=await fetch(`${endpoint}${path}`,{method:options.method||'GET',headers,body:options.body?JSON.stringify(options.body):undefined,signal:ctrl.signal,cache:'no-store'});
  const body=await res.json().catch(()=>({error:'Unparseable API response'}));
  if(!res.ok)throw Error(body.error||body.msg||body.message||`HTTP ${res.status}`);
  return body;
 }finally{clearTimeout(timeout)}
}
async function refresh(){
 if(!app.session?.refresh_token)return;
 if((app.session.expires_at||0)>Date.now()/1000+90)return;
 const res=await fetch(`${endpoint}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:config.publishableKey,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:app.session.refresh_token}),cache:'no-store'});
 if(!res.ok){app.session=null;persist();throw Error('Your session expired. Please sign in again.');}
 const data=await res.json();app.session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Math.floor(Date.now()/1000)+(data.expires_in||3600)};persist();
}
async function api(action,body={}){
 return await request('/functions/v1/pilot',{method:'POST',body:{action,institutionId:app.institutionId,...body}});
}
async function signIn(email,password){
 const data=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password},auth:false});
 app.session={access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Math.floor(Date.now()/1000)+(data.expires_in||3600)};
 persist();await loadAccount();
}
async function loadAccount(){
 const result=await request('/auth/v1/user');app.user=result;
 const memberships=await request('/rest/v1/memberships?select=institution_id,role,institutions(name)');
 app.memberships=Array.isArray(memberships)?memberships:[];
 const selected=app.memberships.find(x=>x.institution_id===app.institutionId)||app.memberships[0];
 app.institutionId=selected?.institution_id||null;app.role=selected?.role||null;
 if(app.institutionId)await loadDashboard();
 render();
}
async function signOut(){
 try{if(app.session)await request('/auth/v1/logout',{method:'POST',body:{}})}catch{};
 app.session=null;app.user=null;app.memberships=[];app.institutionId=null;app.role=null;app.dashboard=null;app.exam=null;app.certificate=null;persist();render();
}
async function loadDashboard(){app.dashboard=await api('dashboard');}
function topnav(){
 const tabs=[['dashboard','Dashboard'],['practice','Adaptive practice'],['evidence','m-DOAI evidence'],['exam','Final examination'],['agent','NADI agent']];
 const role=app.role||'';
 $('#nav').innerHTML=app.institutionId?tabs.map(([key,label])=>`<button type="button" data-nav="${key}" aria-current="${app.page===key?'page':'false'}">${esc(label)}</button>`).join('')+`<button type="button" data-signout="1" class="secondary">Sign out</button>`:`<p class="muted">Sign in to view your institution.</p>`;
}
function formSignin(){return `<section class="panel"><h2>Sign in to the secure pilot</h2><p>Only enrolled institutional accounts can access protected records. This is not the public synthetic demo.</p>
<form id="login"><label for="email">Email</label><input id="email" name="email" type="email" required autocomplete="username" maxlength="254"><label for="password">Password</label><input id="password" name="password" type="password" required autocomplete="current-password" minlength="6"><button type="submit">Sign in securely</button></form>
<p class="small muted">Ask your institutional administrator for an invite. There is no public self-assigned admin role.</p></section>`}
function dashboardView(){
 const d=app.dashboard||{},hist=d.history||{};
 const approved=(d.evidence||[]).filter(e=>e.status==='approved'&&e.user_id===app.user?.id).length;
 const evidenceCount=(d.evidence||[]).filter(e=>e.user_id===app.user?.id).length;
 return `<section class="panel"><div class="stack"><div><h2>Learning dashboard</h2><p class="muted">${esc(app.user?.email)} · <span class="role">${esc(app.role)}</span></p></div>
${app.memberships.length>1?`<label>Institution <select id="institution">${app.memberships.map(m=>`<option value="${esc(m.institution_id)}" ${m.institution_id===app.institutionId?'selected':''}>${esc(m.institutions?.name||m.institution_id)}</option>`).join('')}</select></label>`:''}</div>
<div class="grid"><div class="metric"><strong>${approved}/6</strong><small>Educator-approved modules</small></div><div class="metric"><strong>${evidenceCount}</strong><small>Your evidence submissions</small></div><div class="metric"><strong>${(d.exams||[]).length}</strong><small>Final exam attempts</small></div><div class="metric"><strong>${(d.certificates||[]).length}</strong><small>Completion records</small></div></div>
<p class="hint">Learning estimates are illustrative. The final decision on every microcredential belongs to a human educator.</p></section>
<section class="panel"><h2>Microcredential progress</h2><div class="grid">${mods.map(m=>{
 const h=hist[m]||{attempts:0,correct:0,mastery:20};
 const evidence=(d.evidence||[]).find(e=>e.user_id===app.user?.id&&e.module_id===m);
 return `<div class="metric"><strong style="font-size:1rem">${m} · ${esc(names[m])}</strong><p>${h.attempts} practice attempts · ${h.correct} correct</p><div class="progressbar"><i style="width:${Math.max(0,Math.min(100,Number(h.mastery)||0))}%"></i></div><p class="checkpoint">Estimated mastery ${h.mastery}% (uncalibrated)</p><span class="tag">Evidence: ${esc(evidence?.status||'not submitted')}</span></div>`}).join('')}</div></section>
${app.role!=='learner'?`<section class="panel"><h2>Educator review queue</h2>${reviewQueue(d.evidence||[])}</section>`:''}`;
}
function reviewQueue(rows){
 const list=rows.filter(e=>e.status!=='approved');
 if(!list.length)return '<p class="muted">No pending or revision submissions.</p>';
 return `<div class="listrows">${list.map(e=>`<div class="listrow"><strong>${esc(e.module_id)}</strong> · <span class="status ${esc(e.status)}">${esc(e.status)}</span><small>Learner ID: ${esc(e.user_id.slice(0,8))}… · ${esc(e.updated_at||'')}</small>
 <details><summary>Review evidence (read-only until approval)</summary>${['d_text','o_text','a_text','i_text','sources'].map(k=>`<h4>${esc(k.toUpperCase())}</h4><p>${esc(e[k]||'')}</p>`).join('')}</details>
 <form class="review-form" data-evidence-id="${esc(e.id)}"><label>Feedback to learner (10–1200 characters)<textarea name="feedback" required minlength="10" maxlength="1200"></textarea></label>
 <button type="submit" name="decision" value="revision" class="secondary">Request revision</button> <button type="submit" name="decision" value="approved">Approve as educator</button></form></div>`).join('')}</div>`;
}
function practiceView(){
 if(app.role!=='learner')return `<section class="panel"><h2>Adaptive learning</h2><p>This activity is available to learner accounts only.</p></section>`;
 const q=app.question,fb=app.practiceFeedback;
 return `<section class="panel"><h2>Adaptive learning · Rule-Based + BKT</h2><p>Each answer changes your next recommended difficulty. BKT uses fixed, provisional assumptions rather than a trained model.</p>
 <div class="grid"><label>Microcredential<select id="module">${mods.map(m=>`<option value="${m}" ${app.moduleId===m?'selected':''}>${m} · ${esc(names[m])}</option>`).join('')}</select></label>
 <label>Adaptation mode<select id="mode"><option value="bkt" ${app.mode==='bkt'?'selected':''}>Bayesian Knowledge Tracing</option><option value="rule" ${app.mode==='rule'?'selected':''}>Rule-Based Learning</option></select></label></div>
 ${q?`<form id="answer-form"><fieldset><legend>${esc(q.difficulty)} · ${esc(q.moduleId)} · ${esc(q.id)}</legend><p><strong>${esc(q.question)}</strong></p>${q.options.map((o,i)=>`<label class="choice"><input type="radio" name="answer" value="${i}" required> <span>${esc(o)}</span></label>`).join('')}</fieldset><button type="submit">Submit answer</button></form>`:''}
 ${fb?`<div class="hint"><strong>${fb.correct?'Correct — well done.':'Not quite — review this.'}</strong><p>${esc(fb.explanation)}</p><p>Estimated BKT mastery: ${Number(fb.mastery)}% (not validated). Next: ${esc(fb.recommendedLevel)}</p></div>`:''}
 <p><button type="button" data-action="next-practice" class="secondary">${q?'Skip this question':'Get my next question'}</button></p></section>`;
}
function evidenceView(){
 if(app.role!=='learner')return `<section class="panel"><h2>Evidence</h2><p>Educators can review submissions from Dashboard.</p></section>`;
 return `<section class="panel"><h2>Submit m-DOAI evidence</h2><p>After practising, document your learning in all four constructs. No real student identifiers, private records or passwords.</p>
 <form id="evidence-form"><label>Module<select name="moduleId">${mods.map(m=>`<option value="${m}" ${app.moduleId===m?'selected':''}>${esc(names[m])}</option>`).join('')}</select></label>
 <label>D — Human-Centred GenAI Design<textarea name="D" required minlength="30" maxlength="1500" placeholder="Audience, context, access and cultural safeguards..."></textarea></label>
 <label>O — Generative Learning Opportunities<textarea name="O" required minlength="30" maxlength="1500" placeholder="Ideas explored and alternatives compared..."></textarea></label>
 <label>A — Iterative Human–AI Activity<textarea name="A" required minlength="30" maxlength="1500" placeholder="Prompt, examine, verify, revise, reflect..."></textarea></label>
 <label>I — Human-Regulated Generative Intelligence<textarea name="I" required minlength="30" maxlength="1500" placeholder="Human judgment, ethics and accountability..."></textarea></label>
 <label>Original sources checked<textarea name="sources" required minlength="20" maxlength="1200"></textarea></label>
 <label class="choice"><input name="declaredAI" type="checkbox" required> <span>I disclose AI use and retain responsibility for my work.</span></label>
 <label class="choice"><input name="declaredPrivacy" type="checkbox" required> <span>I have not included sensitive personal data.</span></label>
 <button type="submit">Submit for human educator review</button></form></section>`;
}
function examView(){
 if(app.role!=='learner')return `<section class="panel"><h2>Final examination</h2><p>Learner account required.</p></section>`;
 const x=app.exam,r=app.examResult;
 return `<section class="panel"><h2>Responsible GenAI Final Examination</h2><p>The server selects and grades <strong>18 questions</strong> (three per module). Passing mark: 80%. Two submissions maximum. Quiz passing alone does not issue a verified microcredential.</p>
 <p class="warning">Questions and answer keys are server-side. Each session expires after 35 minutes. Do not close the browser during an active attempt.</p>
 ${!x&&!r?'<button data-action="start-exam">Start final examination</button>':''}
 ${x?`<p class="tag">Expires ${esc(new Date(x.expiresAt).toLocaleTimeString())}</p><form id="exam-form">${x.questions.map((q,i)=>`<fieldset><legend>Question ${i+1} / ${x.questions.length} · ${esc(q.moduleId)}</legend><p>${esc(q.question)}</p>${q.options.map((o,j)=>`<label class="choice"><input required type="radio" name="${esc(q.id)}" value="${j}"><span>${esc(o)}</span></label>`).join('')}</fieldset>`).join('')}<button type="submit">Submit final answers</button></form>`:''}
 ${r?`<div class="hint"><p class="big">${r.correct}/${r.total} · ${r.percent}%</p><strong>${r.passed?'Examination passed':'Review your learning and ask about a retake'}</strong><p>Certified completion additionally requires approved D/O/A/I evidence for all six modules.</p></div>`:''}
 <div class="divider"></div><button class="secondary" data-action="issue-certificate">Check completion record eligibility</button><div id="certificate-area"></div></section>`;
}
function agentView(){
 return `<section class="panel"><h2>NADI — embodied AI learning companion</h2><p>NADI may observe your authorised practice summary, read approved course notes and propose an activity. <strong>It cannot modify grades or issue credentials.</strong></p>
 <div class="grid"><label>Learning module<select id="agent-module">${mods.map(m=>`<option value="${m}" ${app.moduleId===m?'selected':''}>${esc(names[m])}</option>`).join('')}</select></label><div class="metric"><strong style="font-size:1rem">Bounded read-only agent</strong><small>Tools: read progress · read approved learning notes. 10 model requests per learner per day.</small></div></div>
 <form id="agent-form"><label>Ask NADI for a supervised learning recommendation<textarea name="message" required minlength="4" maxlength="600" placeholder="I find it difficult to verify AI-generated sources. What should I practise next?"></textarea></label>
 <label class="choice"><input type="checkbox" name="consent" required> <span>I agree to send this question to the configured AI provider if enabled. I will not enter private information.</span></label>
 <button type="submit">Ask NADI</button></form><p class="small muted">Without a server-side API key, NADI uses a transparent offline planning response. In live mode, the model can only call two read-only tools.</p>
 ${app.agentResult?`<div class="hint" id="agent-response"><strong>${esc(app.agentResult.mode)}</strong><p>${esc(app.agentResult.reply)}</p><small>Recommended: ${esc(app.agentResult.level)} · mastery estimate ${app.agentResult.mastery}% · user confirmation required</small><p><button data-action="accept-advice" type="button">Yes, open adaptive practice</button></p></div>`:''}</section>`;
}
function render(){
 clearMessage();topnav();
 if(!ready){screen.innerHTML=`<section class="panel"><h2>Configure Supabase to activate the secure pilot</h2><p>This website is intentionally locked until you set the public URL and publishable key in <code>pilot/config.js</code>. Never paste a service-role key or AI key here.</p><p>In the meantime, the two <strong>synthetic demonstration apps</strong> are available:</p><div class="stack"><a href="../academy/">Open CulturaGenAI Academy Demo</a><a href="../adaptengine/">Open AdaptEngine Demo</a></div><p class="hint">Read SYSTEM_MANUAL.md before enabling real learners.</p></section>`;return;}
 if(!app.session){screen.innerHTML=formSignin();return;}
 if(!app.institutionId){screen.innerHTML=`<section class="panel"><h2>Account authenticated, but not yet enrolled</h2><p>Your institution's administrator must add your account to a membership using the secure administrative setup. Signing in does not create permissions automatically.</p><button data-signout="1">Sign out</button></section>`;return;}
 const page={dashboard:dashboardView,practice:practiceView,evidence:evidenceView,exam:examView,agent:agentView}[app.page]||dashboardView;
 screen.innerHTML=page();
 if(app.certificate)showCertificate();
}
function showCertificate(){
 const c=app.certificate,container=$('#certificate-area');if(!container)return;
 container.innerHTML=`<div class="certificate"><p>DEMONSTRATION OF COMPLETION RECORD · NOT ACCREDITATION</p><h2>Certificate of Completion</h2><p>This protected institutional record is issued to the authenticated account:</p><strong>${esc(app.user?.email||'Authenticated learner')}</strong><h3>${esc(c.programme)}</h3><p>Based on successful final assessment and six educator-approved learning submissions.</p><p><strong>Programme modules:</strong> ${mods.map(m=>esc(`${m} — ${names[m]}`)).join(' · ')}</p><p class="code">Record ID: ${esc(c.certificate.id)}<br>Verification code: ${esc(c.certificate.verification_code)}</p><p>Issued ${esc(new Date(c.certificate.created_at).toLocaleDateString())}</p><p class="small">Identity verification and formal institutional accreditation are outside this pilot.</p></div><button type="button" data-action="print">Print my completion record</button>`;
}
async function busy(operation){
 try{screen.classList.add('await');await operation();render()}catch(err){show(err instanceof Error?err.message:'Request failed',true)}finally{screen.classList.remove('await')}
}
document.addEventListener('click',event=>{
 const btn=event.target.closest('[data-nav],[data-action],[data-signout]');if(!btn)return;
 if(btn.dataset.nav){app.page=btn.dataset.nav;app.question=null;app.practiceFeedback=null;render();return;}
 if(btn.dataset.signout!==undefined){busy(signOut);return;}
 const action=btn.dataset.action;
 if(action==='next-practice')busy(async()=>{app.practiceFeedback=null;const res=await api('practice_next',{moduleId:app.moduleId,mode:app.mode});app.question=res.question;if(!res.question)show('Practice bank exhausted; review your learning notes.');});
 if(action==='start-exam')busy(async()=>{app.exam=await api('exam_start');app.examResult=null;});
 if(action==='issue-certificate')busy(async()=>{const res=await api('certificate_issue');app.certificate=res;await loadDashboard();});
 if(action==='accept-advice'){app.page='practice';app.question=null;app.practiceFeedback=null;render();}
 if(action==='print')window.print();
});
document.addEventListener('change',event=>{
 if(event.target.id==='module'||event.target.id==='agent-module'){app.moduleId=event.target.value;app.question=null;app.practiceFeedback=null;}
 if(event.target.id==='mode'){app.mode=event.target.value;app.question=null;app.practiceFeedback=null;}
 if(event.target.id==='institution')busy(async()=>{app.institutionId=event.target.value;await loadDashboard();});
});
document.addEventListener('submit',event=>{
 const form=event.target;if(!(form instanceof HTMLFormElement))return;event.preventDefault();const data=new FormData(form);
 if(form.id==='login')busy(async()=>{await signIn(String(data.get('email')||''),String(data.get('password')||''));});
 if(form.id==='answer-form')busy(async()=>{if(!app.question)return;app.practiceFeedback=await api('practice_answer',{moduleId:app.moduleId,mode:app.mode,questionId:app.question.id,selection:Number(data.get('answer'))});app.question=null;await loadDashboard();});
 if(form.id==='evidence-form')busy(async()=>{await api('evidence_submit',{moduleId:data.get('moduleId'),evidence:{D:data.get('D'),O:data.get('O'),A:data.get('A'),I:data.get('I')},sources:data.get('sources'),declaredAI:data.get('declaredAI')==='on',declaredPrivacy:data.get('declaredPrivacy')==='on'});await loadDashboard();show('Evidence submitted for educator review.');});
 if(form.classList.contains('review-form'))busy(async()=>{await api('evidence_review',{evidenceId:form.dataset.evidenceId,decision:event.submitter?.value||'revision',feedback:data.get('feedback')});await loadDashboard();show('Review decision securely recorded.');});
 if(form.id==='exam-form')busy(async()=>{const answers={};for(const q of app.exam.questions)answers[q.id]=Number(data.get(q.id));app.examResult=await api('exam_submit',{sessionId:app.exam.sessionId,answers});app.exam=null;await loadDashboard();});
 if(form.id==='agent-form')busy(async()=>{if(data.get('consent')!=='on')throw Error('Consent is required');app.agentResult=await api('agent',{message:String(data.get('message')),moduleId:app.moduleId,aiConsent:true});});
});
(async()=>{
 try{app.session=JSON.parse(sessionStorage.getItem('culturagenai-pilot-auth')||'null');if(ready&&app.session)await loadAccount();else render();}
 catch(err){console.warn('Session could not be restored');app.session=null;persist();render()}
})();
