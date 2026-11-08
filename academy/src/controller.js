import {DemoModel} from './model.js';
import {render,esc} from './view.js';
import {modules} from './data.js';
const m=new DemoModel();
const root=document.querySelector('#root');
function draw(){root.innerHTML=render(m);document.title='CulturaGenAI Academy · CADG × m-DOAI';}
function update(page,extra={}){m.set({page,...extra,notice:''});draw();document.querySelector('#main')?.focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'})}
function show(msg){m.notify(msg);draw()}
function download(name,data){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function formData(form){return Object.fromEntries(new FormData(form).entries())}
function quizSubmission(form){const mod=modules.find(x=>x.id===form.dataset.module);const values=mod.quiz.map((_,i)=>form.querySelector(`input[name="q${i}"]:checked`)?.value);if(values.some(v=>v===undefined)){show('Please answer all three quiz questions.');return;}const r=m.checkQuiz(m.state.studentId,mod.id,values);show(`${r.correct}/3 correct. ${r.passed?'Formative check passed; prepare D/O/A/I evidence.':'Review the learning notes and retry.'}`)}
function evidenceSubmission(form){const fd=formData(form),record={evidence:{D:fd.evidenceD||'',O:fd.evidenceO||'',A:fd.evidenceA||'',I:fd.evidenceI||''},sources:fd.sources||'',declaration:!!fd.declaration,privacy:!!fd.privacy};m.saveDraft(m.state.studentId,form.dataset.module,record);const res=m.saveSubmission(m.state.studentId,form.dataset.module,record);show(res.error||'Evidence submitted for simulated educator review. Switch to Educator to evaluate it.');}
function reviewSubmission(form,decision){const r=m.review(form.dataset.id,decision,form.querySelector('textarea[name="feedback"]')?.value||'');show(r.error||(decision==='approved'?'Simulated educator approval recorded. Demo badge added.':'Revision requested.'));}
function promptFeedback(prompt){const text=prompt.toLowerCase(),criteria=[
 ['Clear task',/(create|draft|compare|explain|design|write|generate|evaluate|bina|hasilkan|banding|jelaskan|cipta|创建|设计|உருவாக்கு|ஒப்பிடு)/i],
 ['Learner / audience',/(student|learner|teacher|parent|school|community|pelajar|murid|guru|komuniti|学生|教师|மாணவர்|ஆசிரியர்)/i],
 ['Local & cultural context',/(malay|malaysia|local|cultur|rural|bilingual|bahasa|tempatan|budaya|dwibahasa|luar bandar|本地|文化|உள்ளூர்|பண்பாடு)/i],
 ['Source checking / verification',/(verif|check|source|evidence|citation|semak|sumber|sah|核查|来源|சரிபார்|ஆதாரம்)/i],
 ['Safeguards / privacy',/(privac|consent|personal|anonym|safe|risk|etika|privasi|persetujuan|risiko|隐私|同意|தனியுரிமை|அபாயம்)/i],
 ['AI transparency / human oversight',/(disclos|human|review|responsib|teacher|pendidik|manusia|nyatakan|人工|责任|மனித|பொறுப்பு)/i]
 ];const scores=criteria.map(([name,re])=>({name,ok:re.test(text)}));const count=scores.filter(x=>x.ok).length;return `<div class="coach-score"><strong>${count}/6</strong><div><b>Heuristic prompt checklist</b><small>SIMULATED feedback, not an LLM or validated assessment</small></div></div>${scores.map(x=>`<div class="check-result ${x.ok?'good':'weak'}"><span>${x.ok?'✓':'!'}</span>${esc(x.name)} — ${x.ok?'mentioned':'consider adding'}</div>`).join('')}<div class="notice-card"><strong>Sample responsible revision</strong><p>State the task, learner age and language, local culture, no personal data, evidence verification expectations, and who makes the final decision. Request alternative outputs and uncertainty notes.</p><small>Rule-based guidance only; no content is sent to a remote service.</small></div>`}
root.addEventListener('click',e=>{
 const button=e.target.closest('[data-page],[data-action],[data-open-module],[data-example]');if(!button)return;
 if(button.dataset.page){update(button.dataset.page);return}
 if(button.dataset.openModule){update('module',{currentModule:button.dataset.openModule});return}
 if(button.dataset.example!==undefined){const samples={en:['Create a bilingual GenAI lesson plan for 14-year-olds without student records. Include source checks and cultural examples.','Compare three ethical alternatives for using AI in a rural school. Flag uncertain facts and privacy risks.'],ms:['Cipta rancangan pengajaran GenAI dwibahasa untuk pelajar 14 tahun tanpa data sebenar. Sertakan semakan sumber dan contoh tempatan.','Banding tiga pilihan etika penggunaan AI di sekolah luar bandar. Tandakan fakta yang belum pasti dan risiko privasi.'],zh:['为14岁学生创建双语生成式 AI 课程，无须个人数据，并包含来源核查与本地案例。','比较乡村学校使用 AI 的三种伦理方案，标明不确定事实及隐私风险。'],ta:['14 வயது மாணவருக்கான இருமொழி GenAI பாடத்தை தனிநபர் தரவின்றி எழுதவும்; ஆதாரச் சரிபார்ப்பும் உள்ளூர் உதாரணமும் சேர்க்கவும்.','கிராமப் பள்ளியில் AI-யின் மூன்று நெறிமுறை வழிகளை ஒப்பிட்டு உறுதியற்ற தகவல், தனியுரிமை அபாயம் காட்டவும்.']};document.querySelector('#prompt-input').value=samples[m.state.language][Number(button.dataset.example)];return}
 const act=button.dataset.action;
 if(act==='toCourses')update('courses');else if(act==='toAdaptive')update('adaptive');else if(act==='adaptiveNext'){m.nextAdaptive();draw()}else if(act==='adaptiveNotes')update('module',{currentModule:m.state.adaptiveModule});else if(act==='adaptiveReset'){if(confirm('Reset adaptive practice for this demo learner and module?')){m.resetAdaptiveModule();show('Adaptive practice reset for the selected demo learner and module.')}}else if(act==='toCoach')update('coach');else if(act==='toPortfolio')update('portfolio');else if(act==='openModule')update('module',{currentModule:button.dataset.id});else if(act==='openBadge')update('badge',{badgeId:button.dataset.id});else if(act==='dismiss'){m.clearNotice();draw()}else if(act==='download'){download('culturagenai-SYNTHETIC-DEMO-summary.json',m.exportSummary());show('Downloaded synthetic data only; not a real research evidence pack.')}else if(act==='print'){window.print()}
 else if(act==='reset'){if(confirm('Reset all local sample data? This cannot be undone.')){m.reset();draw();}}
});
root.addEventListener('change',e=>{const el=e.target;
 if(el.id==='language-select'){m.set({language:el.value});draw()}
 else if(el.id==='role-select'){m.set({role:el.value,notice:''});draw()}
 else if(el.id==='student-select'){m.set({studentId:el.value,adaptiveDisplay:'question'});draw()}
 else if(el.id==='adaptive-module-select'){m.selectAdaptive(el.value);draw()}
 else if(el.id==='adaptive-mode-select'){m.setAdaptiveMode(el.value);draw()}
 else if(el.dataset.audit!==undefined){const idx=Number(el.dataset.audit),note=m.state.audit[idx]?.note||'';m.auditUpdate(idx,el.value,note);draw()}
 else if(el.dataset.reflection!==undefined){m.updateReflection(Number(el.dataset.reflection),el.value);}
});
root.addEventListener('focusout',e=>{const el=e.target;if(el.dataset.auditNote!==undefined){const index=Number(el.dataset.auditNote);m.auditUpdate(index,m.state.audit[index]?.score||0,el.value)}});
root.addEventListener('submit',e=>{const form=e.target;if(!(form instanceof HTMLFormElement))return;e.preventDefault();if(form.id==='adaptive-question-form'){const chosen=form.querySelector('input[name="answer"]:checked')?.value;const res=m.answerAdaptive(form.dataset.question,chosen);if(res.error)show(res.error);else draw();}else if(form.id==='quiz-form')quizSubmission(form);else if(form.id==='evidence-form')evidenceSubmission(form);else if(form.classList.contains('review-form'))reviewSubmission(form,e.submitter?.value||'revision');else if(form.id==='community-form'){const fd=formData(form),r=m.suggest(fd.name,fd.text);show(r.error||'Demo cultural suggestion recorded.')}else if(form.id==='coach-form'){const v=String(new FormData(form).get('prompt')||'');if(v.length<15)return;document.querySelector('#coach-feedback').innerHTML=promptFeedback(v);}});
draw();
if('serviceWorker' in navigator&&location.protocol==='https:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}))}
