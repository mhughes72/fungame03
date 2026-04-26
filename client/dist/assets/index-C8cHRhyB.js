(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&t(l)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();const g="/api";async function T(e,a){const s=await fetch(`${g}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!s.ok){const t=await s.text();throw new Error(`${s.status} ${s.statusText}: ${t}`)}return s.json()}async function x(e){await fetch(`${g}${e}`,{method:"DELETE"})}async function _(){const e=await fetch(`${g}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function C(){const e=await fetch(`${g}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function N(e,a){return T("/sessions",{characters:e,topic:a})}async function O(e,a,s){return T(`/sessions/${e}/steer`,{text:a,style:s})}async function M(e,a){return T(`/sessions/${e}/new-topic`,{topic:a})}async function j(e){return x(`/sessions/${e}`)}function A(e,a){const s=new EventSource(`${g}/sessions/${e}/stream`);return s.onmessage=t=>{try{const r=JSON.parse(t.data);a(r)}catch{console.error("Unparseable SSE frame:",t.data)}},s.onerror=t=>{console.error("SSE error",t),a({type:"error",data:{text:"Connection lost."}})},()=>s.close()}function P(e,a,s){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${a.map(c=>`
            <label class="char-row" data-name="${c.name}">
              <input type="checkbox" value="${c.name}" />
              <span class="char-name">${c.name}</span>
              <span class="char-era">${c.era}</span>
            </label>
          `).join("")}
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">What should they discuss?</label>
        <input
          id="topic-input"
          class="topic-input"
          type="text"
          placeholder="What is the nature of justice?"
          maxlength="500"
          autocomplete="off"
        />

        <button class="start-btn" id="start-btn" disabled>Open the bar ▶</button>
        <p class="setup-error" id="setup-error"></p>
      </div>
    </div>
  `;const t=e.querySelectorAll("input[type=checkbox]"),r=new Set(["Abraham Lincoln","Nikola Tesla"]);t.forEach(c=>{r.has(c.value)&&(c.checked=!0)});const n=e.querySelector("#selection-hint"),l=e.querySelector("#start-btn"),i=e.querySelector("#setup-error");function u(){const c=[...t].filter(p=>p.checked).length;c<2?(n.textContent=`Select ${2-c} more`,n.classList.remove("hint-ok","hint-warn")):c>4?(n.textContent=`Too many — deselect ${c-4}`,n.classList.add("hint-warn"),n.classList.remove("hint-ok")):(n.textContent=`${c} selected`,n.classList.add("hint-ok"),n.classList.remove("hint-warn")),l.disabled=c<2||c>4}return u(),t.forEach(c=>c.addEventListener("change",u)),l.addEventListener("click",()=>{const c=[...t].filter(m=>m.checked).map(m=>m.value),p=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";i.textContent="",s({characters:c,topic:p})}),e.querySelector("#topic-input").addEventListener("keydown",c=>{c.key==="Enter"&&!l.disabled&&l.click()}),{showError(c){i.textContent=c}}}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function B(e,a){return new Promise(s=>{const t=document.createElement("div");t.className="steer-overlay",t.innerHTML=`
      <div class="steer-box">
        <div class="steer-title">── STEER THE DEBATE ──</div>

        <label class="steer-field-label" for="steer-text-input">
          Speak directly into the debate:
        </label>
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="Leave blank to let the moderator intervene…"
          autocomplete="off"
        />

        <div class="steer-or">── or choose a moderator approach ──</div>

        <div class="style-list" id="style-list">
          ${a.map(i=>`
            <label class="style-item${i.style===e?" style-selected":""}">
              <input type="radio" name="mod-style" value="${k(i.style)}"
                     ${i.style===e?"checked":""} />
              <span class="style-name">${k(i.style)}</span>
              <span class="style-desc">${k(i.description)}</span>
            </label>
          `).join("")}
        </div>

        <div class="steer-actions">
          <button class="steer-quit-btn" id="steer-quit">Quit game</button>
          <button class="steer-submit-btn" id="steer-submit">Steer  ▶</button>
        </div>
      </div>
    `,document.body.appendChild(t);const r=t.querySelector("#steer-text-input");r.focus(),t.querySelectorAll(".style-item input").forEach(i=>{i.addEventListener("change",()=>{t.querySelectorAll(".style-item").forEach(u=>u.classList.remove("style-selected")),i.closest(".style-item").classList.add("style-selected")})});function n(){const i=t.querySelector("input[name=mod-style]:checked");return i?i.value:e}function l(){const i=r.value.trim(),u=n();t.remove(),s({text:i,style:u})}t.querySelector("#steer-submit").addEventListener("click",l),t.querySelector("#steer-quit").addEventListener("click",()=>{t.remove(),s(null)}),r.addEventListener("keydown",i=>{i.key==="Enter"&&l()}),t.addEventListener("click",i=>{i.target===t&&l()})})}function R(e,a,s,t,r,n){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${d(t)}</span>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="seats-bar" id="seats-bar"></div>

      <div class="debate-layout">
        <div class="convo-pane" id="convo-pane"></div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `;const l=e.querySelector("#seats-bar"),i=e.querySelector("#convo-pane"),u=e.querySelector("#sidebar");let c="socratic",p=null;S(l,s,""),q(u,{topic:t,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function m({type:v,data:o}){switch(v){case"speaker":S(l,s,o.name),Q(i,o.name);break;case"message":w(i),S(l,s,""),D(i,o);break;case"state":c=o.moderator_style,q(u,{topic:t,...o});break;case"steer_needed":c=o.current_style,o.drift_topic&&(b(i,`── DRIFT ── conversation has shifted to: ${o.drift_topic}`),b(i,`   original topic: ${t}`)),B(c,r).then(h=>{h===null?f():n.steer(a,h.text,h.style).catch(L=>b(i,`Steer error: ${L.message}`))});break;case"consensus":w(i),S(l,s,""),I(i,o,{onNewTopic(h){n.newTopic(a,h).catch(L=>b(i,`Error: ${L.message}`))},onQuit:f});break;case"bar_beat":F(i,o.text);break;case"system":b(i,o.text);break;case"error":b(i,`⚠ ${o.text}`);break}}function f(){p&&p(),n.deleteSession(a).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#quit-btn").addEventListener("click",f),p=n.openStream(a,m)}function D(e,{role:a,name:s,content:t,backchannel:r}){const n=document.createElement("div");r?(n.className="msg msg-bc",n.innerHTML=`<span class="bc-name">${d(s)}:</span> <em>${y(t)}</em>`):a==="moderator"?(n.className="msg msg-moderator",n.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${y(t)}</div>`):a==="user"?(n.className="msg msg-user",n.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${y(t)}</div>`):(n.className="msg msg-philosopher",n.innerHTML=`<div class="msg-name">${d(s)}</div><div class="msg-content">${y(t)}</div>`),$(e,n)}function F(e,a){const s=document.createElement("div");s.className="msg msg-beat",s.innerHTML=y(a),$(e,s)}function b(e,a){const s=document.createElement("div");s.className="msg msg-system",s.textContent=a,$(e,s)}function I(e,{summary:a,points:s},{onNewTopic:t,onQuit:r}){const n=document.createElement("div");n.className="consensus-panel",n.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${d(a)}</div>
    ${s.length?`
      <ul class="consensus-points">
        ${s.map(i=>`<li>${d(i)}</li>`).join("")}
      </ul>
    `:""}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,$(e,n);const l=n.querySelector("#consensus-topic-input");l.focus(),n.querySelector("#consensus-continue").addEventListener("click",()=>{const i=l.value.trim();i&&t(i)}),l.addEventListener("keydown",i=>{if(i.key==="Enter"){const u=l.value.trim();u&&t(u)}}),n.querySelector("#consensus-end").addEventListener("click",r)}function Q(e,a){w(e);const s=document.createElement("div");s.className="msg msg-typing",s.id="typing-indicator",s.innerHTML=`<span class="typing-name">${d(a)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,$(e,s)}function w(e){var a;(a=e.querySelector("#typing-indicator"))==null||a.remove()}function S(e,a,s){e.innerHTML=a.map(t=>{const r=t===s,n=t.split(" ").at(-1);return`<span class="seat${r?" seat-active":""}">${r?"●":"○"} ${d(n)}</span>`}).join("")}function q(e,a){const{topic:s,turn:t=0,heat:r=0,moderator_style:n="socratic",partial_agreements:l=[],points_of_agreement:i=[],remaining_disagreements:u=[]}=a,c=U(r),p=W(r),m="█".repeat(r),f="░".repeat(10-r);let v=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${d(s)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${t}</div>
  `;i.length&&(v+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${i.map(o=>`<div class="sb-agree-item">✓ ${d(o)}</div>`).join("")}
      </div>
    `),l.length&&(v+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${l.map(o=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${d(o.participants.join(" + "))}</div>
            <div class="sb-partial-on">${d(o.on)}</div>
          </div>
        `).join("")}
      </div>
    `),u.length&&(v+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${u.map(o=>typeof o=="object"&&o!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${d(o.topic)}</div>
                <div class="sb-tension-stance">${d(o.participant_a)}: ${d(o.stance_a)}</div>
                <div class="sb-tension-stance">${d(o.participant_b)}: ${d(o.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${d(String(o))}</div>`).join("")}
      </div>
    `),v+=`
    <div class="sb-section">
      <div class="sb-label">── HEAT ──</div>
      <div class="sb-heat">
        <span style="color:${c}">${m}</span><span class="sb-heat-empty">${f}</span>
        <span class="sb-heat-label" style="color:${c}">${p}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${d(n)}</div>
    </div>
  `,e.innerHTML=v}function y(e){return d(e).replace(/\n/g,"<br>").replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>')}function $(e,a){const s=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(a),s&&(e.scrollTop=e.scrollHeight)}function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function U(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function W(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}const E=document.querySelector("#app");async function H(){let e,a;try{[e,a]=await Promise.all([_(),C()])}catch(t){E.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${t.message}</div>`;return}const s=P(E,e,async({characters:t,topic:r})=>{try{const n=await N(t,r);J(n.session_id,t,r,a)}catch(n){s.showError(`Could not start session: ${n.message}`)}})}function J(e,a,s,t){R(E,e,a,s,t,{steer:O,deleteSession:j,newTopic:M,openStream:A}),E.addEventListener("debate:quit",()=>H(),{once:!0})}H();
