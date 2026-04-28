(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const _="/api";async function H(e,s){const t=await fetch(`${_}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function W(e){await fetch(`${_}${e}`,{method:"DELETE"})}async function Q(){const e=await fetch(`${_}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function Y(){const e=await fetch(`${_}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function K(e,s){return H("/sessions",{characters:e,topic:s})}async function J(e,s,t,a=""){return H(`/sessions/${e}/steer`,{text:s,style:t,evidence:a})}async function Z(e){return H("/search",{query:e})}async function z(e,s){return H(`/sessions/${e}/new-topic`,{topic:s})}async function V(e){return W(`/sessions/${e}`)}function X(e,s){const t=new EventSource(`${_}/sessions/${e}/stream`);return t.onmessage=a=>{try{const n=JSON.parse(a.data);s(n)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const N="https://github.com/mhughes72/fungame03";function j(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",function n(i){i.key==="Escape"&&(a(),document.removeEventListener("keydown",n))})}function M(){j("ABOUT",`
    <p class="info-lead">
      A debate simulator where 2–4 historical figures argue a topic of your choosing,
      powered by <strong>LangGraph</strong> and <strong>OpenAI</strong>.
    </p>

    <div class="info-section-label">HOW SPEAKER SELECTION WORKS</div>
    <p>Each turn, every character is scored by keyword overlap with the most recent message — whoever is most "activated" by what was just said speaks next. On a tie, a second LLM call arbitrates. This means the debate naturally responds to what's being argued rather than taking turns mechanically.</p>

    <div class="info-section-label">THE MODERATOR</div>
    <p>Every N×2 turns (N = number of participants) the debate pauses for a steer break. You can inject a message directly, or let the moderator intervene using one of 8 selectable styles — from Socratic bridge-building to combative contradiction-hunting.</p>

    <div class="info-section-label">CONSENSUS & AGREEMENTS</div>
    <p>A consensus checker runs at every steer break. It detects full group agreement (ends the debate), partial alignments between subsets of participants, and open tensions — all surfaced live in the sidebar.</p>

    <div class="info-section-label">OTHER MECHANICS</div>
    <ul class="info-list">
      <li>The <strong>heat meter</strong> tracks debate temperature — rises on combative exchanges, drops on concessions. At heat 6+, characters are nudged toward personal shots.</li>
      <li><strong>Backchannel reactions</strong> fire randomly (50% chance) from non-speaking characters — short interjections rendered in dim italic.</li>
      <li>Once the conversation history grows long, older messages are <strong>compressed</strong> into a summary and each character gets a first-person arc recap to maintain continuity.</li>
      <li><strong>Stage directions</strong> appear in <em>italicised brackets</em> — atmosphere from the characters and from the bar itself.</li>
    </ul>

    <div class="info-section-label">SOURCE</div>
    <p><a class="info-link" href="${N}" target="_blank" rel="noopener">${N}</a></p>
  `)}function I(){j("HOW TO PLAY",`
    <div class="info-section-label">SETUP</div>
    <p>Pick 2–4 historical figures from the list and give them a topic. The more specific the topic, the sharper the debate. Press Enter or click <em>Open the bar</em> to start.</p>

    <div class="info-section-label">WATCHING THE DEBATE</div>
    <p>Characters take turns based on who is most activated by what was just said. The seating chart shows who is thinking (pulsing gold ring) and who is speaking (solid glow). The sidebar tracks the live state: agreements forming, tensions holding, current heat.</p>

    <div class="info-section-label">STEER BREAKS</div>
    <p>Every several turns the debate pauses and the steer panel slides up. You have three options:</p>
    <ul class="info-list">
      <li><strong>Type a message</strong> — injected directly into the debate as a human voice. The characters will respond to it.</li>
      <li><strong>Leave it blank</strong> — the moderator generates an intervention using the selected style.</li>
      <li><strong>Change the moderator style</strong> — pick from the list. The description explains each approach. Takes effect immediately.</li>
    </ul>

    <div class="info-section-label">CALLING SOMEONE OUT</div>
    <p>Mention a character's name anywhere in your steer message and they will be forced to respond on the very next turn — regardless of keyword scoring. Useful for redirecting who holds the floor.</p>

    <div class="info-section-label">THE HEAT METER</div>
    <p>Displayed in the sidebar. Rises when exchanges get combative (strong language, exclamation marks). Falls when a character concedes a point. At <strong>heat 6+</strong>, characters are nudged to land pointed personal shots. Reaching flashpoint (10) means things have gotten very personal.</p>

    <div class="info-section-label">TOPIC DRIFT</div>
    <p>If the consensus checker notices the conversation has wandered far from the original topic, a drift notice appears before the steer panel. You can steer back or follow the new thread.</p>

    <div class="info-section-label">CONSENSUS</div>
    <p>When all participants reach full agreement the debate ends naturally. You'll see a summary with all agreements reached and an option to start a new topic with the same cast.</p>

    <div class="info-section-label">QUITTING</div>
    <p>Click <em>Quit</em> in the header or <em>Quit game</em> in the steer panel at any time. A closing report shows how many turns ran, the heat at close, any alignments that formed, and tensions still unresolved.</p>
  `)}function ee(e,s,t){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${s.map(r=>`
            <label class="char-row" data-name="${r.name}">
              <input type="checkbox" value="${r.name}" />
              <span class="char-name">${r.name}</span>
              <span class="char-era">${r.era}</span>
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
        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `;const a=e.querySelectorAll("input[type=checkbox]"),n=e.querySelector("#selection-hint"),i=e.querySelector("#start-btn"),l=e.querySelector("#setup-error");function o(){const r=[...a].filter(m=>m.checked).length;r<2?(n.textContent=r===0?"Select 2 to 4 thinkers":"Select 1 more",n.classList.remove("hint-ok","hint-warn")):r>4?(n.textContent=`Too many — deselect ${r-4}`,n.classList.add("hint-warn"),n.classList.remove("hint-ok")):(n.textContent=`${r} selected`,n.classList.add("hint-ok"),n.classList.remove("hint-warn")),i.disabled=r<2||r>4}return o(),a.forEach(r=>r.addEventListener("change",o)),i.addEventListener("click",()=>{const r=[...a].filter(d=>d.checked).map(d=>d.value),m=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";l.textContent="",t({characters:r,topic:m})}),e.querySelector("#topic-input").addEventListener("keydown",r=>{r.key==="Enter"&&!i.disabled&&i.click()}),e.querySelector("#setup-about").addEventListener("click",M),e.querySelector("#setup-help").addEventListener("click",I),{showError(r){l.textContent=r}}}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function te(e,s,t="",a,n=null){return new Promise(i=>{const l=document.createElement("div");l.className="steer-drawer",l.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${S(t)}</div>`:""}

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

      <div class="steer-or">── inject evidence ──</div>

      <div class="evidence-search-row">
        <input
          class="steer-text-input"
          id="evidence-query"
          type="text"
          placeholder="Search term — result will be injected as empirical fact…"
          autocomplete="off"
        />
        <button class="steer-search-btn" id="evidence-search">Search</button>
      </div>

      <div id="evidence-preview" class="evidence-preview" style="display:none"></div>

      <div class="steer-or">── choose a moderator approach ──</div>

      <div class="style-list" id="style-list">
        ${s.map(u=>`
          <button
            class="style-item${u.style===e?" style-selected":""}"
            data-style="${S(u.style)}"
          >
            <span class="style-name">${S(u.style)}</span>
            <span class="style-desc">${S(u.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(a||document.body).appendChild(l);const r=l.querySelector("#steer-text-input"),m=l.querySelector("#evidence-query"),d=l.querySelector("#evidence-search"),c=l.querySelector("#evidence-preview");r.focus();let f=e,h="";async function g(){const u=m.value.trim();if(!(!u||!n)){d.disabled=!0,d.textContent="Searching…",c.style.display="none",h="";try{const y=await n(u);h=y.finding,c.style.display="block",c.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${S(y.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,c.querySelector("#evidence-accept").addEventListener("click",()=>{c.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${S(h)}</div>`}),c.querySelector("#evidence-discard").addEventListener("click",()=>{h="",c.style.display="none"})}catch(y){c.style.display="block",c.textContent=`Search failed: ${y.message}`}finally{d.disabled=!1,d.textContent="Search"}}}d.addEventListener("click",g),m.addEventListener("keydown",u=>{u.key==="Enter"&&g()}),l.querySelectorAll(".style-item").forEach(u=>{u.addEventListener("click",()=>{l.querySelectorAll(".style-item").forEach(y=>y.classList.remove("style-selected")),u.classList.add("style-selected"),f=u.dataset.style,E()})});function E(){const u=r.value.trim();l.remove(),i({text:u,style:f,evidence:h})}l.querySelector("#steer-submit").addEventListener("click",E),l.querySelector("#steer-quit").addEventListener("click",()=>{l.remove(),i(null)}),r.addEventListener("keydown",u=>{u.key==="Enter"&&E()})})}function se(e,s){e.innerHTML=s.map(o=>{const r=ne(o),m=ae(o);return`
      <div class="seat" id="seat-${A(o)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${r}" alt="${C(o)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${C(m)}</div>
        </div>
        <div class="seat-name">${C(ie(o))}</div>
      </div>
    `}).join("");let t=null;function a(o){return e.querySelector(`#seat-${A(o)}`)}function n(){clearTimeout(t),e.querySelectorAll(".seat").forEach(o=>{o.classList.remove("seat-thinking","seat-speaking")})}function i(o){var r;n(),(r=a(o))==null||r.classList.add("seat-thinking")}function l(o){n();const r=a(o);r&&(r.classList.add("seat-speaking"),t=setTimeout(()=>r.classList.remove("seat-speaking"),3e3))}return{setThinking:i,setSpeaking:l,clearAll:n}}function ne(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ae(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function ie(e){return e.split(" ").at(-1)}function A(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function C(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function re(e,s,t,a,n,i){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${p(a)}</span>
        <button class="info-btn" id="about-btn">About</button>
        <button class="info-btn" id="help-btn">Help</button>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="debate-layout">
        <div class="left-col" id="left-col">
          <div class="convo-pane" id="convo-pane"></div>
        </div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `;const l=e.querySelector("#seats-bar"),o=e.querySelector("#convo-pane"),r=e.querySelector("#sidebar"),m=e.querySelector("#left-col");let d="socratic",c=null,f=!1,h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const g=se(l,t);O(r,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function E({type:y,data:v}){switch(y){case"speaker":g.setThinking(v.name),pe(o,v.name);break;case"message":T(o),v.backchannel||g.setSpeaking(v.name),oe(o,v);break;case"bars":ue(r,v.heat,v.concession_total??0);break;case"debug":{const b=v.data!=null?v.data:"",k=typeof b=="object"?`
`+Object.entries(b).map(([F,G])=>`  ${F}: ${JSON.stringify(G)}`).join(`
`):b?` — ${b}`:"";console.log(`[${v.channel}] ${v.label}${k}`);break}case"state":d=v.moderator_style,h=v,O(r,{topic:a,...v});break;case"steer_needed":d=v.current_style,v.drift_topic&&(w(o,`── DRIFT ── conversation has shifted to: ${v.drift_topic}`),w(o,`   original topic: ${a}`)),o.scrollTop=o.scrollHeight,te(d,n,he(h),m,i.searchEvidence).then(b=>{b===null?x(o,h,t,u):i.steer(s,b.text,b.style,b.evidence||"").catch(k=>w(o,`Steer error: ${k.message}`))});break;case"consensus":if(f)break;f=!0,c&&(c(),c=null),T(o),g.clearAll(),de(o,v,{onNewTopic(b){i.newTopic(s,b).then(()=>{f=!1,h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=b,O(r,{topic:b,...h,moderator_style:d,points_of_agreement:[]}),g.clearAll(),c=i.openStream(s,E)}).catch(k=>w(o,`Error: ${k.message}`))},onQuit:u},h);break;case"game_over":if(f)break;f=!0,c&&(c(),c=null),T(o),g.clearAll(),x(o,v,t,u);break;case"bar_beat":ce(o,v.text);break;case"evidence":le(o,v.finding);break;case"system":w(o,v.text);break;case"error":w(o,`⚠ ${v.text}`);break}}function u(){c&&c(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",M),e.querySelector("#help-btn").addEventListener("click",I),e.querySelector("#quit-btn").addEventListener("click",()=>{if(f){u();return}h.turn>0?(f=!0,c&&(c(),c=null),x(o,h,t,u)):u()}),c=i.openStream(s,E)}function oe(e,{role:s,name:t,content:a,backchannel:n}){const i=document.createElement("div");if(n)i.className="msg msg-bc",i.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${L(a)}</em>`;else if(s==="moderator")i.className="msg msg-moderator",i.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${L(a)}</div>`;else if(s==="user")i.className="msg msg-user",i.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${L(a)}</div>`;else{const l=`/portraits/${t.replace(/ /g,"_")}.png`,o=t.split(" ").map(r=>r[0]).join("").slice(0,2).toUpperCase();i.className="msg msg-philosopher",i.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${l}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(o)}</div></div><div class="msg-body"><div class="msg-name">${p(t)}</div><div class="msg-content">${L(a)}</div></div>`}$(e,i)}function ce(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=L(s),$(e,t)}function w(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,$(e,t)}function le(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,$(e,t)}function de(e,{summary:s,points:t},{onNewTopic:a,onQuit:n},i={}){const l=document.createElement("div");l.className="consensus-panel",l.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(s)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(r=>`<li>${p(r)}</li>`).join("")}
      </ul>
    `:""}
    ${P(i)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,$(e,l);const o=l.querySelector("#consensus-topic-input");o.focus(),l.querySelector("#consensus-continue").addEventListener("click",()=>{const r=o.value.trim();r&&a(r)}),o.addEventListener("keydown",r=>{if(r.key==="Enter"){const m=o.value.trim();m&&a(m)}}),l.querySelector("#consensus-end").addEventListener("click",n)}function x(e,s,t,a){T(e);const n=document.createElement("div");n.className="game-over-panel";const i=s.turn||0,l=i?`${i} turn${i!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";n.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(l)}</div>
    ${P(s)}
    <div class="game-over-actions">
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,$(e,n),n.querySelector("#game-over-leave").addEventListener("click",a)}function P(e){const{turn:s=0,heat:t=0,partial_agreements:a=[],points_of_agreement:n=[],remaining_disagreements:i=[]}=e;if(!s)return"";const l=U(t),o=B(t),r="█".repeat(t),m="░".repeat(10-t);let d='<div class="report-stats">';return d+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,d+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${o}">${r}<span style="color:var(--text-dim)">${m}</span> ${l}</span>
  </div>`,n.length&&(d+='<div class="report-section-label">agreements reached</div>',d+=n.map(c=>`<div class="report-agree-item">✓ ${p(c)}</div>`).join("")),a.length&&(d+='<div class="report-section-label">alignments that formed</div>',d+=a.map(c=>`<div class="report-partial"><span class="report-partial-names">${p(c.participants.join(" + "))}</span> — <span class="report-partial-on">${p(c.on)}</span></div>`).join("")),i.length&&(d+='<div class="report-section-label">still unresolved</div>',d+=i.map(c=>typeof c=="object"&&c!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(c.topic)}</span>
          <span class="report-tension-stance">${p(c.participant_a)}: ${p(c.stance_a)}</span>
          <span class="report-tension-stance">${p(c.participant_b)}: ${p(c.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(c))}</div>`).join("")),d+="</div>",d}function pe(e,s){T(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,$(e,t)}function T(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function O(e,s){const{topic:t,turn:a=0,heat:n=0,concession_total:i=0,moderator_style:l="socratic",partial_agreements:o=[],points_of_agreement:r=[],remaining_disagreements:m=[]}=s;let d=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;r.length&&(d+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${r.map(c=>`<div class="sb-agree-item">✓ ${p(c)}</div>`).join("")}
      </div>
    `),o.length&&(d+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${o.map(c=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(c.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(c.on)}</div>
          </div>
        `).join("")}
      </div>
    `),m.length&&(d+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${m.map(c=>typeof c=="object"&&c!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(c.topic)}</div>
                <div class="sb-tension-stance">${p(c.participant_a)}: ${p(c.stance_a)}</div>
                <div class="sb-tension-stance">${p(c.participant_b)}: ${p(c.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(c))}</div>`).join("")}
      </div>
    `),d+=`
    <div class="sb-section" id="sb-bars">
      ${R(n,i)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(l)}</div>
    </div>
  `,e.innerHTML=d}function L(e){let t=p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>');return t=t.replace(/\*([A-Z][^*]+?)\*(?!\])/g,(a,n)=>n.includes("[")||n.includes("]")?a:`<em class="stage-dir">[${n}]</em>`),t.replace(/\n/g,"<br>")}function $(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(e,s){const t=B(e),a=U(e),n="█".repeat(e),i="░".repeat(10-e),l=Math.min(s,10),o=ve(s),r="█".repeat(l),m="░".repeat(10-l),d=me(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${n}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${o}">${r}</span><span class="sb-heat-empty">${m}</span>
      <span class="sb-heat-label" style="color:${o}">${d} (${s})</span>
    </div>
  `}function ue(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=R(s,t))}function B(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function U(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function ve(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function me(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function he(e,s){const{turn:t,heat:a,partial_agreements:n,remaining_disagreements:i,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const o=n||[],r=i||[];if(o.length&&r.length){const d=o[0],c=r[0],f=d.participants.join(" and "),h=typeof c=="object"?c.topic:String(c);return`${f} are finding common ground, but the group remains divided on ${h}.`}if(o.length){const d=o[0];return`${d.participants.join(" and ")} are converging on ${d.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(r.length){const d=r[0];return typeof d=="object"?`${d.participant_a} and ${d.participant_b} are sharply divided over ${d.topic}.`:`The room is deadlocked — ${String(d)}.`}const m=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${m}.`}const q=document.querySelector("#app");async function D(){let e,s;try{[e,s]=await Promise.all([Q(),Y()])}catch(a){q.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${a.message}</div>`;return}const t=ee(q,e,async({characters:a,topic:n})=>{try{const i=await K(a,n);be(i.session_id,a,n,s)}catch(i){t.showError(`Could not start session: ${i.message}`)}})}function be(e,s,t,a){re(q,e,s,t,a,{steer:J,deleteSession:V,newTopic:z,openStream:X,searchEvidence:Z}),q.addEventListener("debate:quit",()=>D(),{once:!0})}D();
