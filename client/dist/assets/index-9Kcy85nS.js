(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const v of r.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&n(v)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const _="/api";async function q(e,s){const t=await fetch(`${_}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function Y(e){await fetch(`${_}${e}`,{method:"DELETE"})}async function K(){const e=await fetch(`${_}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function J(){const e=await fetch(`${_}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function z(e,s){return q("/sessions",{characters:e,topic:s})}async function V(e,s,t,n="",a={}){return q(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:a})}async function Z(e){return q("/search",{query:e})}async function X(e,s){return q(`/sessions/${e}/new-topic`,{topic:s})}async function ee(e){return Y(`/sessions/${e}`)}async function te(e){return q(`/sessions/${e}/newspaper`,{})}function se(e,s){const t=new EventSource(`${_}/sessions/${e}/stream`);return t.onmessage=n=>{try{const a=JSON.parse(n.data);s(a)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const M="https://github.com/mhughes72/fungame03";function P(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function n(){t.remove()}t.querySelector(".info-close").addEventListener("click",n),t.addEventListener("click",a=>{a.target===t&&n()}),document.addEventListener("keydown",function a(r){r.key==="Escape"&&(n(),document.removeEventListener("keydown",a))})}function B(){P("ABOUT",`
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
    <p><a class="info-link" href="${M}" target="_blank" rel="noopener">${M}</a></p>
  `)}function I(){P("HOW TO PLAY",`
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
  `)}function ne(e,s,t){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${s.map(o=>`
            <label class="char-row" data-name="${o.name}">
              <input type="checkbox" value="${o.name}" />
              <span class="char-name">${o.name}</span>
              <span class="char-era">${o.era}</span>
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
  `;const n=e.querySelectorAll("input[type=checkbox]"),a=e.querySelector("#selection-hint"),r=e.querySelector("#start-btn"),v=e.querySelector("#setup-error");function i(){const o=[...n].filter(u=>u.checked).length;o<2?(a.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",a.classList.remove("hint-ok","hint-warn")):o>4?(a.textContent=`Too many — deselect ${o-4}`,a.classList.add("hint-warn"),a.classList.remove("hint-ok")):(a.textContent=`${o} selected`,a.classList.add("hint-ok"),a.classList.remove("hint-warn")),r.disabled=o<2||o>4}return i(),n.forEach(o=>o.addEventListener("change",i)),r.addEventListener("click",()=>{const o=[...n].filter(l=>l.checked).map(l=>l.value),u=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";v.textContent="",t({characters:o,topic:u})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!r.disabled&&r.click()}),e.querySelector("#setup-about").addEventListener("click",B),e.querySelector("#setup-help").addEventListener("click",I),{showError(o){v.textContent=o}}}function $(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ae(e,s,t="",n,a=null,r=[]){return new Promise(v=>{const i={};r.forEach(d=>{i[d]=0});const o=r.length?`
      <div class="steer-or">── buy a round ──</div>
      <div class="drinks-grid" id="drinks-grid">
        ${r.map(d=>`
          <div class="drink-row" data-name="${$(d)}">
            <span class="drink-name">${$(d)}</span>
            <div class="drink-controls">
              <button class="drink-btn drink-minus" data-name="${$(d)}">−</button>
              <span class="drink-count" id="drink-count-${$(d.replace(/ /g,"_"))}">0</span>
              <button class="drink-btn drink-plus" data-name="${$(d)}">+</button>
            </div>
          </div>
        `).join("")}
      </div>
    `:"",u=document.createElement("div");u.className="steer-drawer",u.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${$(t)}</div>`:""}

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

      ${o}

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
        ${s.map(d=>`
          <button
            class="style-item${d.style===e?" style-selected":""}"
            data-style="${$(d.style)}"
          >
            <span class="style-name">${$(d.style)}</span>
            <span class="style-desc">${$(d.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(n||document.body).appendChild(u);const c=u.querySelector("#steer-text-input"),g=u.querySelector("#evidence-query"),b=u.querySelector("#evidence-search"),f=u.querySelector("#evidence-preview");c.focus();let S=e,y="";u.querySelectorAll(".drink-btn").forEach(d=>{d.addEventListener("click",()=>{const h=d.dataset.name,k=d.classList.contains("drink-plus")?1:-1;i[h]=Math.max(0,(i[h]||0)+k);const x=h.replace(/ /g,"_"),A=u.querySelector(`#drink-count-${x}`);A&&(A.textContent=i[h])})});async function C(){const d=g.value.trim();if(!(!d||!a)){b.disabled=!0,b.textContent="Searching…",f.style.display="none",y="";try{const h=await a(d);y=h.finding,f.style.display="block",f.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${$(h.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,f.querySelector("#evidence-accept").addEventListener("click",()=>{f.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${$(y)}</div>`}),f.querySelector("#evidence-discard").addEventListener("click",()=>{y="",f.style.display="none"})}catch(h){f.style.display="block",f.textContent=`Search failed: ${h.message}`}finally{b.disabled=!1,b.textContent="Search"}}}b.addEventListener("click",C),g.addEventListener("keydown",d=>{d.key==="Enter"&&C()}),u.querySelectorAll(".style-item").forEach(d=>{d.addEventListener("click",()=>{u.querySelectorAll(".style-item").forEach(h=>h.classList.remove("style-selected")),d.classList.add("style-selected"),S=d.dataset.style,m()})});function m(){const d=c.value.trim(),h=Object.fromEntries(Object.entries(i).filter(([,k])=>k>0));u.remove(),v({text:d,style:S,evidence:y,drinks:h})}u.querySelector("#steer-submit").addEventListener("click",m),u.querySelector("#steer-quit").addEventListener("click",()=>{u.remove(),v(null)}),c.addEventListener("keydown",d=>{d.key==="Enter"&&m()})})}function ie(e,s){e.innerHTML=s.map(i=>{const o=re(i),u=oe(i);return`
      <div class="seat" id="seat-${R(i)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${o}" alt="${N(i)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${N(u)}</div>
        </div>
        <div class="seat-name">${N(ce(i))}</div>
      </div>
    `}).join("");let t=null;function n(i){return e.querySelector(`#seat-${R(i)}`)}function a(){clearTimeout(t),e.querySelectorAll(".seat").forEach(i=>{i.classList.remove("seat-thinking","seat-speaking")})}function r(i){var o;a(),(o=n(i))==null||o.classList.add("seat-thinking")}function v(i){a();const o=n(i);o&&(o.classList.add("seat-speaking"),t=setTimeout(()=>o.classList.remove("seat-speaking"),3e3))}return{setThinking:r,setSpeaking:v,clearAll:a}}function re(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function oe(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function ce(e){return e.split(" ").at(-1)}function R(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function N(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function le(e,s,t,n,a,r){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${p(n)}</span>
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
  `;const v=e.querySelector("#seats-bar"),i=e.querySelector("#convo-pane"),o=e.querySelector("#sidebar"),u=e.querySelector("#left-col");let l="socratic",c=null,g=!1,b={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const f=ie(v,t);j(o,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function S({type:C,data:m}){switch(C){case"speaker":f.setThinking(m.name),me(i,m.name);break;case"message":T(i),m.backchannel||f.setSpeaking(m.name),de(i,m);break;case"bars":he(o,m.heat,m.concession_total??0);break;case"debug":{const d=m.data!=null?m.data:"",h=typeof d=="object"?`
`+Object.entries(d).map(([k,x])=>`  ${k}: ${JSON.stringify(x)}`).join(`
`):d?` — ${d}`:"";console.log(`[${m.channel}] ${m.label}${h}`);break}case"state":l=m.moderator_style,b=m,j(o,{topic:n,...m});break;case"steer_needed":l=m.current_style,m.drift_topic&&(w(i,`── DRIFT ── conversation has shifted to: ${m.drift_topic}`),w(i,`   original topic: ${n}`)),i.scrollTop=i.scrollHeight,ae(l,a,ge(b),u,r.searchEvidence,t).then(d=>{d===null?O(i,b,t,y,s,r):r.steer(s,d.text,d.style,d.evidence||"",d.drinks||{}).catch(h=>w(i,`Steer error: ${h.message}`))});break;case"consensus":if(g)break;g=!0,c&&(c(),c=null),T(i),f.clearAll(),ve(i,m,{onNewTopic(d){r.newTopic(s,d).then(()=>{g=!1,b={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=d,j(o,{topic:d,...b,moderator_style:l,points_of_agreement:[]}),f.clearAll(),c=r.openStream(s,S)}).catch(h=>w(i,`Error: ${h.message}`))},onQuit:y},b,s,r);break;case"game_over":if(g)break;g=!0,c&&(c(),c=null),T(i),f.clearAll(),O(i,m,t,y,s,r);break;case"bar_beat":pe(i,m.text);break;case"evidence":ue(i,m.finding);break;case"system":w(i,m.text);break;case"error":w(i,`⚠ ${m.text}`);break}}function y(){c&&c(),r.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",B),e.querySelector("#help-btn").addEventListener("click",I),e.querySelector("#quit-btn").addEventListener("click",()=>{if(g){y();return}b.turn>0?(g=!0,c&&(c(),c=null),O(i,b,t,y,s,r)):y()}),c=r.openStream(s,S)}function de(e,{role:s,name:t,content:n,backchannel:a}){const r=document.createElement("div");if(a)r.className="msg msg-bc",r.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${L(n)}</em>`;else if(s==="moderator")r.className="msg msg-moderator",r.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${L(n)}</div>`;else if(s==="user")r.className="msg msg-user",r.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${L(n)}</div>`;else{const v=`/portraits/${t.replace(/ /g,"_")}.png`,i=t.split(" ").map(o=>o[0]).join("").slice(0,2).toUpperCase();r.className="msg msg-philosopher",r.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${v}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(i)}</div></div><div class="msg-body"><div class="msg-name">${p(t)}</div><div class="msg-content">${L(n)}</div></div>`}E(e,r)}function pe(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=L(s),E(e,t)}function w(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,E(e,t)}function ue(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,E(e,t)}function ve(e,{summary:s,points:t},{onNewTopic:n,onQuit:a},r={},v,i){const o=document.createElement("div");o.className="consensus-panel",o.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(s)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(l=>`<li>${p(l)}</li>`).join("")}
      </ul>
    `:""}
    ${D(r)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="newspaper-btn" id="consensus-paper">Read the morning paper 📰</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,E(e,o);const u=o.querySelector("#consensus-topic-input");u.focus(),o.querySelector("#consensus-continue").addEventListener("click",()=>{const l=u.value.trim();l&&n(l)}),u.addEventListener("keydown",l=>{if(l.key==="Enter"){const c=u.value.trim();c&&n(c)}}),o.querySelector("#consensus-end").addEventListener("click",a),o.querySelector("#consensus-paper").addEventListener("click",()=>U(v,i))}function O(e,s,t,n,a,r){var u;T(e);const v=document.createElement("div");v.className="game-over-panel";const i=s.turn||0,o=i?`${i} turn${i!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";v.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(o)}</div>
    ${D(s)}
    <div class="game-over-actions">
      ${a?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,E(e,v),v.querySelector("#game-over-leave").addEventListener("click",n),a&&((u=v.querySelector("#game-over-paper"))==null||u.addEventListener("click",()=>U(a,r)))}async function U(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(t);let n;try{n=await s.fetchNewspaper(e)}catch(a){t.remove(),alert(`Could not print the paper: ${a.message}`);return}t.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${p(n.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${p(n.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${p(n.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${p(n.headline)}</div>
        <div class="newspaper-subhead">${p(n.subheadline)}</div>

        <div class="newspaper-columns">
          <div class="newspaper-main-col">
            <p class="newspaper-lede">${p(n.lede)}</p>
            <p class="newspaper-body">${p(n.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${p(n.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${p(n.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${p(n.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${p(n.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,t.querySelector("#newspaper-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",a=>{a.target===t&&t.remove()})}function D(e){const{turn:s=0,heat:t=0,partial_agreements:n=[],points_of_agreement:a=[],remaining_disagreements:r=[]}=e;if(!s)return"";const v=W(t),i=G(t),o="█".repeat(t),u="░".repeat(10-t);let l='<div class="report-stats">';return l+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,l+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${i}">${o}<span style="color:var(--text-dim)">${u}</span> ${v}</span>
  </div>`,a.length&&(l+='<div class="report-section-label">agreements reached</div>',l+=a.map(c=>`<div class="report-agree-item">✓ ${p(c)}</div>`).join("")),n.length&&(l+='<div class="report-section-label">alignments that formed</div>',l+=n.map(c=>`<div class="report-partial"><span class="report-partial-names">${p(c.participants.join(" + "))}</span> — <span class="report-partial-on">${p(c.on)}</span></div>`).join("")),r.length&&(l+='<div class="report-section-label">still unresolved</div>',l+=r.map(c=>typeof c=="object"&&c!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(c.topic)}</span>
          <span class="report-tension-stance">${p(c.participant_a)}: ${p(c.stance_a)}</span>
          <span class="report-tension-stance">${p(c.participant_b)}: ${p(c.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(c))}</div>`).join("")),l+="</div>",l}function me(e,s){T(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,E(e,t)}function T(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function j(e,s){const{topic:t,turn:n=0,heat:a=0,concession_total:r=0,moderator_style:v="socratic",partial_agreements:i=[],points_of_agreement:o=[],remaining_disagreements:u=[]}=s;let l=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${n}</div>
  `;o.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${o.map(c=>`<div class="sb-agree-item">✓ ${p(c)}</div>`).join("")}
      </div>
    `),i.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${i.map(c=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(c.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(c.on)}</div>
          </div>
        `).join("")}
      </div>
    `),u.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${u.map(c=>typeof c=="object"&&c!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(c.topic)}</div>
                <div class="sb-tension-stance">${p(c.participant_a)}: ${p(c.stance_a)}</div>
                <div class="sb-tension-stance">${p(c.participant_b)}: ${p(c.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(c))}</div>`).join("")}
      </div>
    `),l+=`
    <div class="sb-section" id="sb-bars">
      ${F(a,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(v)}</div>
    </div>
  `,e.innerHTML=l}function L(e){return p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function E(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function F(e,s){const t=G(e),n=W(e),a="█".repeat(e),r="░".repeat(10-e),v=Math.min(s,10),i=be(s),o="█".repeat(v),u="░".repeat(10-v),l=fe(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${a}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${n}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${i}">${o}</span><span class="sb-heat-empty">${u}</span>
      <span class="sb-heat-label" style="color:${i}">${l} (${s})</span>
    </div>
  `}function he(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=F(s,t))}function G(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function W(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function be(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function fe(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function ge(e,s){const{turn:t,heat:n,partial_agreements:a,remaining_disagreements:r,drift_topic:v}=e;if(!t)return"The debate is just getting started.";if(v)return`The conversation has drifted from the original topic toward ${v}.`;const i=a||[],o=r||[];if(i.length&&o.length){const l=i[0],c=o[0],g=l.participants.join(" and "),b=typeof c=="object"?c.topic:String(c);return`${g} are finding common ground, but the group remains divided on ${b}.`}if(i.length){const l=i[0];return`${l.participants.join(" and ")} are converging on ${l.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(o.length){const l=o[0];return typeof l=="object"?`${l.participant_a} and ${l.participant_b} are sharply divided over ${l.topic}.`:`The room is deadlocked — ${String(l)}.`}const u=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${u}.`}const H=document.querySelector("#app");async function Q(){let e,s;try{[e,s]=await Promise.all([K(),J()])}catch(n){H.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=ne(H,e,async({characters:n,topic:a})=>{try{const r=await z(n,a);ye(r.session_id,n,a,s)}catch(r){t.showError(`Could not start session: ${r.message}`)}})}function ye(e,s,t,n){le(H,e,s,t,n,{steer:V,deleteSession:ee,newTopic:X,openStream:se,searchEvidence:Z,fetchNewspaper:te}),H.addEventListener("debate:quit",()=>Q(),{once:!0})}Q();
