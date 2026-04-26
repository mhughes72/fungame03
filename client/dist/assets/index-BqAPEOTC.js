(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const t of o)if(t.type==="childList")for(const l of t.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function s(o){const t={};return o.integrity&&(t.integrity=o.integrity),o.referrerPolicy&&(t.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?t.credentials="include":o.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(o){if(o.ep)return;o.ep=!0;const t=s(o);fetch(o.href,t)}})();const S="/api";async function q(e,n){const s=await fetch(`${S}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!s.ok){const r=await s.text();throw new Error(`${s.status} ${s.statusText}: ${r}`)}return s.json()}async function B(e){await fetch(`${S}${e}`,{method:"DELETE"})}async function R(){const e=await fetch(`${S}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function I(){const e=await fetch(`${S}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function D(e,n){return q("/sessions",{characters:e,topic:n})}async function F(e,n,s){return q(`/sessions/${e}/steer`,{text:n,style:s})}async function U(e,n){return q(`/sessions/${e}/new-topic`,{topic:n})}async function Q(e){return B(`/sessions/${e}`)}function W(e,n){const s=new EventSource(`${S}/sessions/${e}/stream`);return s.onmessage=r=>{try{const o=JSON.parse(r.data);n(o)}catch{console.error("Unparseable SSE frame:",r.data)}},s.onerror=r=>{console.error("SSE error",r),n({type:"error",data:{text:"Connection lost."}})},()=>s.close()}function G(e,n,s){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${n.map(i=>`
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
  `;const r=e.querySelectorAll("input[type=checkbox]"),o=new Set(["Abraham Lincoln","Nikola Tesla"]);r.forEach(i=>{o.has(i.value)&&(i.checked=!0)});const t=e.querySelector("#selection-hint"),l=e.querySelector("#start-btn"),c=e.querySelector("#setup-error");function u(){const i=[...r].filter(a=>a.checked).length;i<2?(t.textContent=`Select ${2-i} more`,t.classList.remove("hint-ok","hint-warn")):i>4?(t.textContent=`Too many — deselect ${i-4}`,t.classList.add("hint-warn"),t.classList.remove("hint-ok")):(t.textContent=`${i} selected`,t.classList.add("hint-ok"),t.classList.remove("hint-warn")),l.disabled=i<2||i>4}return u(),r.forEach(i=>i.addEventListener("change",u)),l.addEventListener("click",()=>{const i=[...r].filter(d=>d.checked).map(d=>d.value),a=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";c.textContent="",s({characters:i,topic:a})}),e.querySelector("#topic-input").addEventListener("keydown",i=>{i.key==="Enter"&&!l.disabled&&l.click()}),{showError(i){c.textContent=i}}}function L(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function J(e,n,s="",r){return new Promise(o=>{const t=document.createElement("div");t.className="steer-drawer",t.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${s?`<div class="steer-summary">${L(s)}</div>`:""}

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

      <div class="steer-or">── choose a moderator approach ──</div>

      <div class="style-list" id="style-list">
        ${n.map(a=>`
          <button
            class="style-item${a.style===e?" style-selected":""}"
            data-style="${L(a.style)}"
          >
            <span class="style-name">${L(a.style)}</span>
            <span class="style-desc">${L(a.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(r||document.body).appendChild(t);const c=t.querySelector("#steer-text-input");c.focus();let u=e;t.querySelectorAll(".style-item").forEach(a=>{a.addEventListener("click",()=>{t.querySelectorAll(".style-item").forEach(d=>d.classList.remove("style-selected")),a.classList.add("style-selected"),u=a.dataset.style})});function i(){const a=c.value.trim();t.remove(),o({text:a,style:u})}t.querySelector("#steer-submit").addEventListener("click",i),t.querySelector("#steer-quit").addEventListener("click",()=>{t.remove(),o(null)}),c.addEventListener("keydown",a=>{a.key==="Enter"&&i()})})}const H={2:[[18,50],[82,50]],3:[[14,24],[86,24],[50,84]],4:[[14,20],[86,20],[14,80],[86,80]]};function z(e,n){const s=Math.min(n.length,4),r=H[s]||H[4];e.innerHTML=`
    <div class="seating-area">
      <div class="seating-table">
        <span class="seating-table-label">THE BAR</span>
      </div>
      ${n.map((i,a)=>{const[d,g]=r[a]||[50,50],f=K(i),m=Y(i);return`
          <div class="seat" id="seat-${x(i)}"
               style="left:${d}%;top:${g}%">
            <div class="seat-portrait-wrap">
              <img class="seat-img" src="${f}" alt="${_(i)}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
              <div class="seat-initials" style="display:none">${_(m)}</div>
            </div>
            <div class="seat-name">${_(Z(i))}</div>
          </div>
        `}).join("")}
    </div>
  `;let o=null;function t(i){return e.querySelector(`#seat-${x(i)}`)}function l(){clearTimeout(o),e.querySelectorAll(".seat").forEach(i=>{i.classList.remove("seat-thinking","seat-speaking")})}function c(i){var a;l(),(a=t(i))==null||a.classList.add("seat-thinking")}function u(i){l();const a=t(i);a&&(a.classList.add("seat-speaking"),o=setTimeout(()=>a.classList.remove("seat-speaking"),3e3))}return{setThinking:c,setSpeaking:u,clearAll:l}}function K(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Y(e){return e.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}function Z(e){return e.split(" ").at(-1)}function x(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function _(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function V(e,n,s,r,o,t){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${p(r)}</span>
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
  `;const l=e.querySelector("#seats-bar"),c=e.querySelector("#convo-pane"),u=e.querySelector("#sidebar"),i=e.querySelector("#left-col");let a="socratic",d=null,g={turn:0,heat:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const f=z(l,s);j(u,{topic:r,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function m({type:P,data:v}){switch(P){case"speaker":f.setThinking(v.name),se(c,v.name);break;case"message":T(c),v.backchannel||f.setSpeaking(v.name),X(c,v);break;case"state":a=v.moderator_style,g=v,j(u,{topic:r,...v});break;case"steer_needed":a=v.current_style,v.drift_topic&&(h(c,`── DRIFT ── conversation has shifted to: ${v.drift_topic}`),h(c,`   original topic: ${r}`)),J(a,o,ne(g),i).then(y=>{y===null?C(c,g,s,E):t.steer(n,y.text,y.style).catch(k=>h(c,`Steer error: ${k.message}`))});break;case"consensus":T(c),f.clearAll(),te(c,v,{onNewTopic(y){t.newTopic(n,y).catch(k=>h(c,`Error: ${k.message}`))},onQuit:E},g);break;case"bar_beat":ee(c,v.text);break;case"system":h(c,v.text);break;case"error":h(c,`⚠ ${v.text}`);break}}function E(){d&&d(),t.deleteSession(n).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#quit-btn").addEventListener("click",()=>{g.turn>0?C(c,g,s,E):E()}),d=t.openStream(n,m)}function X(e,{role:n,name:s,content:r,backchannel:o}){const t=document.createElement("div");o?(t.className="msg msg-bc",t.innerHTML=`<span class="bc-name">${p(s)}:</span> <em>${$(r)}</em>`):n==="moderator"?(t.className="msg msg-moderator",t.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${$(r)}</div>`):n==="user"?(t.className="msg msg-user",t.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${$(r)}</div>`):(t.className="msg msg-philosopher",t.innerHTML=`<div class="msg-name">${p(s)}</div><div class="msg-content">${$(r)}</div>`),b(e,t)}function ee(e,n){const s=document.createElement("div");s.className="msg msg-beat",s.innerHTML=$(n),b(e,s)}function h(e,n){const s=document.createElement("div");s.className="msg msg-system",s.textContent=n,b(e,s)}function te(e,{summary:n,points:s},{onNewTopic:r,onQuit:o},t={}){const l=document.createElement("div");l.className="consensus-panel",l.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(n)}</div>
    ${s.length?`
      <ul class="consensus-points">
        ${s.map(u=>`<li>${p(u)}</li>`).join("")}
      </ul>
    `:""}
    ${N(t)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,b(e,l);const c=l.querySelector("#consensus-topic-input");c.focus(),l.querySelector("#consensus-continue").addEventListener("click",()=>{const u=c.value.trim();u&&r(u)}),c.addEventListener("keydown",u=>{if(u.key==="Enter"){const i=c.value.trim();i&&r(i)}}),l.querySelector("#consensus-end").addEventListener("click",o)}function C(e,n,s,r){T(e);const o=document.createElement("div");o.className="game-over-panel";const t=n.turn||0,l=t?`${t} turn${t!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";o.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(l)}</div>
    ${N(n)}
    <div class="game-over-actions">
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,b(e,o),o.querySelector("#game-over-leave").addEventListener("click",r)}function N(e){const{turn:n=0,heat:s=0,partial_agreements:r=[],points_of_agreement:o=[],remaining_disagreements:t=[]}=e;if(!n)return"";const l=A(s),c=O(s),u="█".repeat(s),i="░".repeat(10-s);let a='<div class="report-stats">';return a+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${n}</span>
  </div>`,a+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${c}">${u}<span style="color:var(--text-dim)">${i}</span> ${l}</span>
  </div>`,o.length&&(a+='<div class="report-section-label">agreements reached</div>',a+=o.map(d=>`<div class="report-agree-item">✓ ${p(d)}</div>`).join("")),r.length&&(a+='<div class="report-section-label">alignments that formed</div>',a+=r.map(d=>`<div class="report-partial"><span class="report-partial-names">${p(d.participants.join(" + "))}</span> — <span class="report-partial-on">${p(d.on)}</span></div>`).join("")),t.length&&(a+='<div class="report-section-label">still unresolved</div>',a+=t.map(d=>typeof d=="object"&&d!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(d.topic)}</span>
          <span class="report-tension-stance">${p(d.participant_a)}: ${p(d.stance_a)}</span>
          <span class="report-tension-stance">${p(d.participant_b)}: ${p(d.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(d))}</div>`).join("")),a+="</div>",a}function se(e,n){T(e);const s=document.createElement("div");s.className="msg msg-typing",s.id="typing-indicator",s.innerHTML=`<span class="typing-name">${p(n)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,b(e,s)}function T(e){var n;(n=e.querySelector("#typing-indicator"))==null||n.remove()}function j(e,n){const{topic:s,turn:r=0,heat:o=0,moderator_style:t="socratic",partial_agreements:l=[],points_of_agreement:c=[],remaining_disagreements:u=[]}=n,i=O(o),a=A(o),d="█".repeat(o),g="░".repeat(10-o);let f=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(s)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${r}</div>
  `;c.length&&(f+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${c.map(m=>`<div class="sb-agree-item">✓ ${p(m)}</div>`).join("")}
      </div>
    `),l.length&&(f+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${l.map(m=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(m.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(m.on)}</div>
          </div>
        `).join("")}
      </div>
    `),u.length&&(f+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${u.map(m=>typeof m=="object"&&m!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(m.topic)}</div>
                <div class="sb-tension-stance">${p(m.participant_a)}: ${p(m.stance_a)}</div>
                <div class="sb-tension-stance">${p(m.participant_b)}: ${p(m.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(m))}</div>`).join("")}
      </div>
    `),f+=`
    <div class="sb-section">
      <div class="sb-label">── HEAT ──</div>
      <div class="sb-heat">
        <span style="color:${i}">${d}</span><span class="sb-heat-empty">${g}</span>
        <span class="sb-heat-label" style="color:${i}">${a}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(t)}</div>
    </div>
  `,e.innerHTML=f}function $(e){return p(e).replace(/\n/g,"<br>").replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>')}function b(e,n){const s=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(n),s&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function O(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function A(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function ne(e,n){const{turn:s,heat:r,partial_agreements:o,remaining_disagreements:t,drift_topic:l}=e;if(!s)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const c=o||[],u=t||[];if(c.length&&u.length){const a=c[0],d=u[0],g=a.participants.join(" and "),f=typeof d=="object"?d.topic:String(d);return`${g} are finding common ground, but the group remains divided on ${f}.`}if(c.length){const a=c[0];return`${a.participants.join(" and ")} are converging on ${a.on}, ${r>=6?"though tempers are running high":"with the room following closely"}.`}if(u.length){const a=u[0];return typeof a=="object"?`${a.participant_a} and ${a.participant_b} are sharply divided over ${a.topic}.`:`The room is deadlocked — ${String(a)}.`}const i=r>=8?"at flashpoint":r>=5?"heating up":r>=3?"warming up":"still feeling each other out";return`${s} turns in, no clear alignments yet — the room is ${i}.`}const w=document.querySelector("#app");async function M(){let e,n;try{[e,n]=await Promise.all([R(),I()])}catch(r){w.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${r.message}</div>`;return}const s=G(w,e,async({characters:r,topic:o})=>{try{const t=await D(r,o);ae(t.session_id,r,o,n)}catch(t){s.showError(`Could not start session: ${t.message}`)}})}function ae(e,n,s,r){V(w,e,n,s,r,{steer:F,deleteSession:Q,newTopic:U,openStream:W}),w.addEventListener("debate:quit",()=>M(),{once:!0})}M();
