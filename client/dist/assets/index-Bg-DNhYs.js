(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))a(c);new MutationObserver(c=>{for(const t of c)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function n(c){const t={};return c.integrity&&(t.integrity=c.integrity),c.referrerPolicy&&(t.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?t.credentials="include":c.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function a(c){if(c.ep)return;c.ep=!0;const t=n(c);fetch(c.href,t)}})();const $="/api";async function H(e,s){const n=await fetch(`${$}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!n.ok){const a=await n.text();throw new Error(`${n.status} ${n.statusText}: ${a}`)}return n.json()}async function O(e){await fetch(`${$}${e}`,{method:"DELETE"})}async function A(){const e=await fetch(`${$}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function M(){const e=await fetch(`${$}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function P(e,s){return H("/sessions",{characters:e,topic:s})}async function B(e,s,n){return H(`/sessions/${e}/steer`,{text:s,style:n})}async function R(e,s){return H(`/sessions/${e}/new-topic`,{topic:s})}async function I(e){return O(`/sessions/${e}`)}function D(e,s){const n=new EventSource(`${$}/sessions/${e}/stream`);return n.onmessage=a=>{try{const c=JSON.parse(a.data);s(c)}catch{console.error("Unparseable SSE frame:",a.data)}},n.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>n.close()}function F(e,s,n){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${s.map(i=>`
            <label class="char-row" data-name="${i.name}">
              <input type="checkbox" value="${i.name}" />
              <span class="char-name">${i.name}</span>
              <span class="char-era">${i.era}</span>
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
  `;const a=e.querySelectorAll("input[type=checkbox]"),c=new Set(["Abraham Lincoln","Nikola Tesla"]);a.forEach(i=>{c.has(i.value)&&(i.checked=!0)});const t=e.querySelector("#selection-hint"),l=e.querySelector("#start-btn"),o=e.querySelector("#setup-error");function d(){const i=[...a].filter(r=>r.checked).length;i<2?(t.textContent=`Select ${2-i} more`,t.classList.remove("hint-ok","hint-warn")):i>4?(t.textContent=`Too many — deselect ${i-4}`,t.classList.add("hint-warn"),t.classList.remove("hint-ok")):(t.textContent=`${i} selected`,t.classList.add("hint-ok"),t.classList.remove("hint-warn")),l.disabled=i<2||i>4}return d(),a.forEach(i=>i.addEventListener("change",d)),l.addEventListener("click",()=>{const i=[...a].filter(p=>p.checked).map(p=>p.value),r=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";o.textContent="",n({characters:i,topic:r})}),e.querySelector("#topic-input").addEventListener("keydown",i=>{i.key==="Enter"&&!l.disabled&&l.click()}),{showError(i){o.textContent=i}}}function E(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function U(e,s,n="",a){return new Promise(c=>{const t=document.createElement("div");t.className="steer-drawer",t.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${n?`<div class="steer-summary">${E(n)}</div>`:""}

      <div class="steer-input-row">
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="Speak into the debate — or leave blank for the moderator…"
          autocomplete="off"
        />
        <button class="steer-submit-btn" id="steer-submit">Steer ▶</button>
      </div>

      <div class="steer-styles-row">
        <span class="steer-or">approach:</span>
        <div class="style-chips" id="style-chips">
          ${s.map(r=>`
            <button
              class="style-chip${r.style===e?" style-selected":""}"
              data-style="${E(r.style)}"
              title="${E(r.description)}"
            >${E(r.style)}</button>
          `).join("")}
        </div>
      </div>
    `,(a||document.body).appendChild(t);const o=t.querySelector("#steer-text-input");o.focus();let d=e;t.querySelectorAll(".style-chip").forEach(r=>{r.addEventListener("click",()=>{t.querySelectorAll(".style-chip").forEach(p=>p.classList.remove("style-selected")),r.classList.add("style-selected"),d=r.dataset.style})});function i(){const r=o.value.trim();t.remove(),c({text:r,style:d})}t.querySelector("#steer-submit").addEventListener("click",i),t.querySelector("#steer-quit").addEventListener("click",()=>{t.remove(),c(null)}),o.addEventListener("keydown",r=>{r.key==="Enter"&&i()})})}const _={2:[[18,50],[82,50]],3:[[14,24],[86,24],[50,84]],4:[[14,20],[86,20],[14,80],[86,80]]};function Q(e,s){const n=Math.min(s.length,4),a=_[n]||_[4];e.innerHTML=`
    <div class="seating-area">
      <div class="seating-table">
        <span class="seating-table-label">THE BAR</span>
      </div>
      ${s.map((i,r)=>{const[p,h]=a[r]||[50,50],f=W(i),m=J(i);return`
          <div class="seat" id="seat-${x(i)}"
               style="left:${p}%;top:${h}%">
            <div class="seat-portrait-wrap">
              <img class="seat-img" src="${f}" alt="${k(i)}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
              <div class="seat-initials" style="display:none">${k(m)}</div>
            </div>
            <div class="seat-name">${k(z(i))}</div>
          </div>
        `}).join("")}
    </div>
  `;let c=null;function t(i){return e.querySelector(`#seat-${x(i)}`)}function l(){clearTimeout(c),e.querySelectorAll(".seat").forEach(i=>{i.classList.remove("seat-thinking","seat-speaking")})}function o(i){var r;l(),(r=t(i))==null||r.classList.add("seat-thinking")}function d(i){l();const r=t(i);r&&(r.classList.add("seat-speaking"),c=setTimeout(()=>r.classList.remove("seat-speaking"),3e3))}return{setThinking:o,setSpeaking:d,clearAll:l}}function W(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function J(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function z(e){return e.split(" ").at(-1)}function x(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function G(e,s,n,a,c,t){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${u(a)}</span>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="seats-bar" id="seats-bar"></div>

      <div class="debate-layout">
        <div class="left-col" id="left-col">
          <div class="convo-pane" id="convo-pane"></div>
        </div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `;const l=e.querySelector("#seats-bar"),o=e.querySelector("#convo-pane"),d=e.querySelector("#sidebar"),i=e.querySelector("#left-col");let r="socratic",p=null,h={turn:0,heat:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const f=Q(l,n);C(d,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function m({type:j,data:v}){switch(j){case"speaker":f.setThinking(v.name),V(o,v.name);break;case"message":q(o),v.backchannel||f.setSpeaking(v.name),K(o,v);break;case"state":r=v.moderator_style,h=v,C(d,{topic:a,...v});break;case"steer_needed":r=v.current_style,v.drift_topic&&(g(o,`── DRIFT ── conversation has shifted to: ${v.drift_topic}`),g(o,`   original topic: ${a}`)),U(r,c,te(h),i).then(b=>{b===null?L():t.steer(s,b.text,b.style).catch(T=>g(o,`Steer error: ${T.message}`))});break;case"consensus":q(o),f.clearAll(),Z(o,v,{onNewTopic(b){t.newTopic(s,b).catch(T=>g(o,`Error: ${T.message}`))},onQuit:L});break;case"bar_beat":Y(o,v.text);break;case"system":g(o,v.text);break;case"error":g(o,`⚠ ${v.text}`);break}}function L(){p&&p(),t.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#quit-btn").addEventListener("click",L),p=t.openStream(s,m)}function K(e,{role:s,name:n,content:a,backchannel:c}){const t=document.createElement("div");c?(t.className="msg msg-bc",t.innerHTML=`<span class="bc-name">${u(n)}:</span> <em>${y(a)}</em>`):s==="moderator"?(t.className="msg msg-moderator",t.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${y(a)}</div>`):s==="user"?(t.className="msg msg-user",t.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${y(a)}</div>`):(t.className="msg msg-philosopher",t.innerHTML=`<div class="msg-name">${u(n)}</div><div class="msg-content">${y(a)}</div>`),S(e,t)}function Y(e,s){const n=document.createElement("div");n.className="msg msg-beat",n.innerHTML=y(s),S(e,n)}function g(e,s){const n=document.createElement("div");n.className="msg msg-system",n.textContent=s,S(e,n)}function Z(e,{summary:s,points:n},{onNewTopic:a,onQuit:c}){const t=document.createElement("div");t.className="consensus-panel",t.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${u(s)}</div>
    ${n.length?`
      <ul class="consensus-points">
        ${n.map(o=>`<li>${u(o)}</li>`).join("")}
      </ul>
    `:""}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,S(e,t);const l=t.querySelector("#consensus-topic-input");l.focus(),t.querySelector("#consensus-continue").addEventListener("click",()=>{const o=l.value.trim();o&&a(o)}),l.addEventListener("keydown",o=>{if(o.key==="Enter"){const d=l.value.trim();d&&a(d)}}),t.querySelector("#consensus-end").addEventListener("click",c)}function V(e,s){q(e);const n=document.createElement("div");n.className="msg msg-typing",n.id="typing-indicator",n.innerHTML=`<span class="typing-name">${u(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,S(e,n)}function q(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function C(e,s){const{topic:n,turn:a=0,heat:c=0,moderator_style:t="socratic",partial_agreements:l=[],points_of_agreement:o=[],remaining_disagreements:d=[]}=s,i=X(c),r=ee(c),p="█".repeat(c),h="░".repeat(10-c);let f=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${u(n)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;o.length&&(f+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${o.map(m=>`<div class="sb-agree-item">✓ ${u(m)}</div>`).join("")}
      </div>
    `),l.length&&(f+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${l.map(m=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${u(m.participants.join(" + "))}</div>
            <div class="sb-partial-on">${u(m.on)}</div>
          </div>
        `).join("")}
      </div>
    `),d.length&&(f+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${d.map(m=>typeof m=="object"&&m!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${u(m.topic)}</div>
                <div class="sb-tension-stance">${u(m.participant_a)}: ${u(m.stance_a)}</div>
                <div class="sb-tension-stance">${u(m.participant_b)}: ${u(m.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${u(String(m))}</div>`).join("")}
      </div>
    `),f+=`
    <div class="sb-section">
      <div class="sb-label">── HEAT ──</div>
      <div class="sb-heat">
        <span style="color:${i}">${p}</span><span class="sb-heat-empty">${h}</span>
        <span class="sb-heat-label" style="color:${i}">${r}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${u(t)}</div>
    </div>
  `,e.innerHTML=f}function y(e){return u(e).replace(/\n/g,"<br>").replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>')}function S(e,s){const n=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),n&&(e.scrollTop=e.scrollHeight)}function u(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function X(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function ee(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function te(e,s){const{turn:n,heat:a,partial_agreements:c,remaining_disagreements:t,drift_topic:l}=e;if(!n)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const o=c||[],d=t||[];if(o.length&&d.length){const r=o[0],p=d[0],h=r.participants.join(" and "),f=typeof p=="object"?p.topic:String(p);return`${h} are finding common ground, but the group remains divided on ${f}.`}if(o.length){const r=o[0];return`${r.participants.join(" and ")} are converging on ${r.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(d.length){const r=d[0];return typeof r=="object"?`${r.participant_a} and ${r.participant_b} are sharply divided over ${r.topic}.`:`The room is deadlocked — ${String(r)}.`}const i=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${n} turns in, no clear alignments yet — the room is ${i}.`}const w=document.querySelector("#app");async function N(){let e,s;try{[e,s]=await Promise.all([A(),M()])}catch(a){w.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${a.message}</div>`;return}const n=F(w,e,async({characters:a,topic:c})=>{try{const t=await P(a,c);se(t.session_id,a,c,s)}catch(t){n.showError(`Could not start session: ${t.message}`)}})}function se(e,s,n,a){G(w,e,s,n,a,{steer:B,deleteSession:I,newTopic:R,openStream:D}),w.addEventListener("debate:quit",()=>N(),{once:!0})}N();
