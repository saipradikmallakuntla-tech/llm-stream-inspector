(function () {
'use strict';
const LIMIT = 1048576;
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
const frame = (data, event) => (event ? 'event: ' + event + '\n' : '') + 'data: ' + (typeof data === 'string' ? data : JSON.stringify(data)) + '\n\n';
const samples = {
 openai: [
  {choices:[{index:0,delta:{content:'Checking the weather. '}}]},
  {choices:[{index:0,delta:{tool_calls:[{index:0,id:'call_demo',function:{name:'weather',arguments:'{"city":'}}]}}]},
  {choices:[{index:0,delta:{tool_calls:[{index:0,function:{arguments:'"Lisbon"}'}}]}}]},
  {choices:[{index:0,delta:{},finish_reason:'tool_calls'}],usage:{prompt_tokens:12,completion_tokens:8}},
  '[DONE]'
 ].map(x=>frame(x)).join(''),
 anthropic: [
  {type:'message_start',message:{usage:{input_tokens:15}}},
  {type:'content_block_start',index:0,content_block:{type:'text',text:''}},
  {type:'content_block_delta',index:0,delta:{type:'text_delta',text:'Hello from a local fixture.'}},
  {type:'content_block_stop',index:0},
  {type:'content_block_start',index:1,content_block:{type:'tool_use',id:'tool_demo',name:'lookup',input:{}}},
  {type:'content_block_delta',index:1,delta:{type:'input_json_delta',partial_json:'{"query":'}},
  {type:'content_block_delta',index:1,delta:{type:'input_json_delta',partial_json:'"docs"}'}},
  {type:'content_block_stop',index:1},
  {type:'message_delta',delta:{stop_reason:'tool_use'},usage:{output_tokens:10}},
  {type:'message_stop'}
 ].map(x=>frame(x,x.type)).join(''),
 truncated: frame({choices:[{index:0,delta:{tool_calls:[{index:0,id:'partial',function:{name:'lookup',arguments:'{"query":'}}]}}]}),
 timed: [
  {timestamp_ms:1000,data:{choices:[{index:0,delta:{role:'assistant'}}]}},
  {timestamp_ms:1125,data:{choices:[{index:0,delta:{content:'Hello 🌍'}}]}},
  {timestamp_ms:1400,data:{choices:[{index:0,delta:{},finish_reason:'stop'}]}}
 ].map(x=>JSON.stringify(x)).join('\n'),
 malformed: 'data: {not valid JSON}\n\ndata: [DONE]\n\n'
};
function analyzeCapture(input) {
 if (typeof input !== 'string' || !input.trim()) throw new Error('Paste or load a capture first.');
 if (input.length > LIMIT) throw new Error('Capture exceeds the 1 MiB character limit.');
 const source=input.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
 const isSSE=/^(?:data:|event:|id:|retry:|:)/m.test(source);
 const records=[]; const findings=[];
 const note=(severity,code,message)=>findings.push({severity,code,message});
 if (isSSE) {
  for (const block of source.split(/\n\n+/)) {
   let event='message'; const data=[];
   for (const line of block.split('\n')) {
    if (!line || line.startsWith(':')) continue;
    const at=line.indexOf(':'); const field=at<0?line:line.slice(0,at);
    let value=at<0?'':line.slice(at+1); if(value.startsWith(' ')) value=value.slice(1);
    if(field==='data') data.push(value); else if(field==='event') event=value;
   }
   if(data.length) records.push({event,raw:data.join('\n'),timestamp:null});
  }
 } else {
  source.split('\n').forEach(line=>{if(line.trim())records.push({event:'message',raw:line.trim(),timestamp:null});});
 }
 if(records.length>10000)throw new Error('More than 10,000 events. Split the capture before inspecting.');
 const choices=new Map(), tools=new Map(), events=[]; let usage=null, done=false, anthropicStop=false, sawOpenAI=false, sawAnthropic=false, firstTextTime=null;
 const textParts=[];
 const getChoice=i=>{if(!choices.has(i))choices.set(i,{text:'',finished:false});return choices.get(i);};
 const getTool=(key,defaults)=>{if(!tools.has(key))tools.set(key,{key,id:'',name:'',arguments:'',initial:null,...defaults});return tools.get(key);};
 function appendText(text,time,choice) {
  if(typeof text!=='string'||!text)return;
  if(firstTextTime===null&&Number.isFinite(time))firstTextTime=time;
  if(choice!==undefined)getChoice(choice).text+=text; else textParts.push(text);
 }
 records.forEach((record,idx)=>{
  let payload; let raw=record.raw; let time=null;
  try {
   if(raw==='[DONE]'){done=true;events.push({index:idx+1,type:'[DONE]',timestamp:null});return;}
   payload=JSON.parse(raw);
   if(payload&&typeof payload==='object'&&own(payload,'timestamp_ms')&&own(payload,'data')){
    time=typeof payload.timestamp_ms==='number'&&Number.isFinite(payload.timestamp_ms)?payload.timestamp_ms:null;
    payload=payload.data;
    if(typeof payload==='string'){
     if(payload==='[DONE]'){done=true;events.push({index:idx+1,type:'[DONE]',timestamp:time});return;}
     payload=JSON.parse(payload);
    }
   }
  } catch(e) {note('error','INVALID_JSON','Event '+(idx+1)+' is not valid JSON: '+e.message);events.push({index:idx+1,type:'invalid JSON',timestamp:time});return;}
  if(!payload||typeof payload!=='object'||Array.isArray(payload)){note('warning','UNSUPPORTED_EVENT','Event '+(idx+1)+' is not a provider event object.');return;}
  const eventType=typeof payload.type==='string'?payload.type:Array.isArray(payload.choices)?'openai.chunk':record.event;
  events.push({index:idx+1,type:eventType,timestamp:time});
  if(payload.error||eventType==='error')note('error','PROVIDER_ERROR','Provider error event at '+(idx+1)+'. Inspect the original capture locally.');
  if(Array.isArray(payload.choices)){
   sawOpenAI=true;
   payload.choices.forEach((c,position)=>{
    const ci=Number.isInteger(c.index)?c.index:position; const choice=getChoice(ci); const delta=c.delta||{};
    appendText(delta.content,time,ci);
    if(Array.isArray(delta.tool_calls))delta.tool_calls.forEach((t,ti)=>{
     const key=ci+':'+(Number.isInteger(t.index)?t.index:ti);const tool=getTool(key,{choice:ci});
     if(typeof t.id==='string')tool.id=t.id;
     if(t.function){if(typeof t.function.name==='string')tool.name+=t.function.name;if(typeof t.function.arguments==='string')tool.arguments+=t.function.arguments;}
    });
    if(delta.function_call){const t=getTool(ci+':legacy',{choice:ci});if(typeof delta.function_call.name==='string')t.name+=delta.function_call.name;if(typeof delta.function_call.arguments==='string')t.arguments+=delta.function_call.arguments;}
    if(c.finish_reason!==null&&c.finish_reason!==undefined)choice.finished=true;
   });
   if(payload.usage&&typeof payload.usage==='object')usage=payload.usage;
  } else if(['message_start','content_block_start','content_block_delta','content_block_stop','message_delta','message_stop','ping'].includes(eventType)){
   sawAnthropic=true;
   if(eventType==='message_start'&&payload.message&&payload.message.usage)usage={...payload.message.usage};
   if(eventType==='content_block_start'&&payload.content_block){const b=payload.content_block;if(b.type==='text')appendText(b.text,time);if(b.type==='tool_use')getTool('a:'+payload.index,{id:b.id||'',name:b.name||'',initial:b.input||{}});}
   if(eventType==='content_block_delta'&&payload.delta){const d=payload.delta;if(d.type==='text_delta')appendText(d.text,time);if(d.type==='input_json_delta'){const t=getTool('a:'+payload.index,{});if(typeof d.partial_json==='string')t.arguments+=d.partial_json;}}
   if(eventType==='message_delta'&&payload.usage)usage={...(usage||{}),...payload.usage};
   if(eventType==='message_stop')anthropicStop=true;
  } else if(!payload.error)note('warning','UNRECOGNIZED_EVENT','Event '+(idx+1)+' is outside the supported provider adapters.');
 });
 const complete=sawAnthropic?anthropicStop:sawOpenAI&&(done||(choices.size>0&&Array.from(choices.values()).every(c=>c.finished)));
 if(!records.length)note('warning','NO_DATA','No data-bearing events found.');
 if(!sawOpenAI&&!sawAnthropic)note('warning','NO_PROTOCOL','No supported provider stream detected.');
 if(!complete)note('warning','NO_TERMINAL','No supported terminal signal was found. The capture may be incomplete.');
 if(sawAnthropic&&sawOpenAI)note('warning','MIXED_PROTOCOLS','Capture mixes provider protocols; inspect streams separately.');
 const outputTools=Array.from(tools.values()).map(t=>{
  const argumentText=t.arguments||(t.initial!==null?JSON.stringify(t.initial):'');let parsed=null,error=null;
  try{parsed=JSON.parse(argumentText);}catch(e){error=e.message;note('error','INVALID_TOOL_JSON','Tool '+(t.name||t.key)+' has incomplete or invalid final JSON arguments.');}
  return {key:t.key,id:t.id,name:t.name,arguments:argumentText,parsed,error};
 });
 const ordered=Array.from(choices.entries()).sort((a,b)=>a[0]-b[0]);
 const text=ordered.length>1?ordered.map(([i,c])=>'Choice '+i+':\n'+c.text).join('\n\n'):ordered.length?ordered[0][1].text:textParts.join('');
 const first=events[0]&&events[0].timestamp,last=events.length&&events[events.length-1].timestamp;
 const durationMs=Number.isFinite(first)&&Number.isFinite(last)&&last>=first?last-first:null;
 const firstTextMs=Number.isFinite(first)&&Number.isFinite(firstTextTime)&&firstTextTime>=first?firstTextTime-first:null;
 if(!findings.length)note('info','OK','Supported framing and final tool JSON checks passed. Semantic correctness is not evaluated.');
 return {format:sawAnthropic?(sawOpenAI?'mixed':'Anthropic Messages'):sawOpenAI?'OpenAI Chat Completions':isSSE?'SSE / unknown':'NDJSON / unknown',eventCount:records.length,complete,text,tools:outputTools,usage,firstTextMs,durationMs,events,findings};
}
function exportReport(report,includeContent){
 if(includeContent)return {schemaVersion:1,...report};
 return {schemaVersion:1,contentOmitted:true,format:report.format,eventCount:report.eventCount,complete:report.complete,toolCount:report.tools.length,invalidToolCount:report.tools.filter(t=>t.error).length,firstTextMs:report.firstTextMs,durationMs:report.durationMs,findingCodes:report.findings.map(f=>({severity:f.severity,code:f.code}))};
}
function selfTest(){
 const checks=[
 ['OpenAI fragments reconstruct JSON',()=>analyzeCapture(samples.openai).tools[0].parsed.city==='Lisbon'],
 ['OpenAI terminal and text',()=>{const r=analyzeCapture(samples.openai);return r.complete&&r.text==='Checking the weather. ';}],
 ['Anthropic text and input deltas',()=>{const r=analyzeCapture(samples.anthropic);return r.complete&&r.tools[0].parsed.query==='docs'&&r.usage.output_tokens===10;}],
 ['Truncation produces a finding',()=>{const r=analyzeCapture(samples.truncated);return !r.complete&&r.tools[0].error;}],
 ['Malformed frame is not ignored',()=>analyzeCapture(samples.malformed).findings.some(f=>f.code==='INVALID_JSON')],
 ['CRLF captures work',()=>analyzeCapture(samples.openai.replace(/\n/g,'\r\n')).tools[0].parsed.city==='Lisbon'],
 ['Timestamped capture measures real supplied times',()=>{const r=analyzeCapture(samples.timed);return r.firstTextMs===125&&r.durationMs===400&&r.text==='Hello 🌍';}],
 ['No invented timing',()=>analyzeCapture(samples.openai).firstTextMs===null],
 ['Safe export omits names and content',()=>{const s=JSON.stringify(exportReport(analyzeCapture(samples.openai),false));return !s.includes('Lisbon')&&!s.includes('weather')&&!s.includes('call_demo');}]
 ];
 return checks.map(([name,fn])=>{try{return {name,pass:!!fn()};}catch(e){return {name,pass:false,error:e.message};}});
}
const api={analyzeCapture,exportReport,samples,selfTest};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(typeof globalThis!=='undefined')globalThis.StreamInspector=api;
if(typeof document==='undefined')return;
const $=id=>document.getElementById(id);let current=null;
function item(parent,text,kind){const li=document.createElement('li');li.textContent=text;if(kind)li.className=kind;parent.append(li);}
function render(r){
 current=r;$('results').hidden=false;$('event-count').textContent=r.eventCount;$('complete').textContent=r.complete?'Yes':'No';$('tool-count').textContent=r.tools.length;$('latency').textContent=r.firstTextMs===null?'Unavailable':r.firstTextMs+' ms';
 $('findings').replaceChildren();r.findings.forEach(f=>item($('findings'),f.code+': '+f.message,f.severity));
 $('text-output').textContent=r.text||'(No text deltas)';$('usage-output').textContent=r.usage?JSON.stringify(r.usage,null,2):'Not present in capture.';
 $('tool-output').replaceChildren();if(!r.tools.length){const p=document.createElement('p');p.textContent='No tool calls.';$('tool-output').append(p);}
 r.tools.forEach((t,i)=>{const h=document.createElement('h4');h.textContent=(i+1)+'. '+(t.name||'Unnamed tool');const p=document.createElement('pre');p.textContent=t.error?'Invalid final JSON: '+t.arguments:JSON.stringify(t.parsed,null,2);$('tool-output').append(h,p);});
 $('timeline').replaceChildren();r.events.slice(0,200).forEach(e=>{const tr=document.createElement('tr');[e.index,e.type,e.timestamp===null?'—':e.timestamp].forEach(v=>{const td=document.createElement('td');td.textContent=String(v);tr.append(td);});$('timeline').append(tr);});
 $('status').textContent='Inspected '+r.eventCount+' events locally · '+r.format+'.';
}
function inspect(){try{render(analyzeCapture($('capture').value));}catch(e){$('status').textContent=e.message;$('results').hidden=true;current=null;}}
$('analysis-form').addEventListener('submit',e=>{e.preventDefault();inspect();});
$('load-sample').addEventListener('click',()=>{$('capture').value=samples[$('sample').value];$('include-content').checked=false;inspect();});
$('clear').addEventListener('click',()=>{$('capture').value='';$('results').hidden=true;$('include-content').checked=false;current=null;$('status').textContent='Capture and report cleared from the interface.';$('capture').focus();});
$('capture-file').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;if(file.size>LIMIT){$('status').textContent='File exceeds 1 MiB.';e.target.value='';return;}try{$('capture').value=await file.text();$('include-content').checked=false;inspect();}catch(err){$('status').textContent='Could not read file: '+err.message;}e.target.value='';});
$('run-tests').addEventListener('click',()=>{const results=selfTest();$('tests').hidden=false;$('test-results').replaceChildren();results.forEach(t=>item($('test-results'),(t.pass?'PASS · ':'FAIL · ')+t.name,t.pass?'pass':'error'));$('status').textContent=results.filter(t=>t.pass).length+'/'+results.length+' synthetic tests passed.';});
$('export').addEventListener('click',()=>{if(!current)return;const blob=new Blob([JSON.stringify(exportReport(current,$('include-content').checked),null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='llm-stream-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('capture').value=samples.openai;inspect();
})();
