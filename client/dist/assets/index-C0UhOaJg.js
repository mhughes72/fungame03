(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const C="/api";async function L(e,s){const t=await fetch(`${C}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function J(e){await fetch(`${C}${e}`,{method:"DELETE"})}async function V(){const e=await fetch(`${C}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function z(){const e=await fetch(`${C}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function Z(e,s){return L("/sessions",{characters:e,topic:s})}async function X(e,s,t,n="",i={}){return L(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:i})}async function ee(e){return L("/search",{query:e})}async function te(e,s){return L(`/sessions/${e}/new-topic`,{topic:s})}async function se(e){return J(`/sessions/${e}`)}async function ne(e){return L(`/sessions/${e}/newspaper`,{})}async function ae(e,s,t={}){const n={drinks:t};return s!==null&&(n.heat=s),L(`/sessions/${e}/cheat`,n)}function ie(e,s){const t=new EventSource(`${C}/sessions/${e}/stream`);return t.onmessage=n=>{try{const i=JSON.parse(n.data);s(i)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const j="https://github.com/mhughes72/fungame03";function P(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function n(){t.remove()}t.querySelector(".info-close").addEventListener("click",n),t.addEventListener("click",i=>{i.target===t&&n()}),document.addEventListener("keydown",function i(r){r.key==="Escape"&&(n(),document.removeEventListener("keydown",i))})}function B(){P("ABOUT",`
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
    <p><a class="info-link" href="${j}" target="_blank" rel="noopener">${j}</a></p>
  `)}function U(){P("HOW TO PLAY",`
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
  `)}function re(e,s,t){e.innerHTML=`
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
  `;const n=e.querySelectorAll("input[type=checkbox]"),i=e.querySelector("#selection-hint"),r=e.querySelector("#start-btn"),d=e.querySelector("#setup-error");function a(){const o=[...n].filter(u=>u.checked).length;o<2?(i.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",i.classList.remove("hint-ok","hint-warn")):o>4?(i.textContent=`Too many — deselect ${o-4}`,i.classList.add("hint-warn"),i.classList.remove("hint-ok")):(i.textContent=`${o} selected`,i.classList.add("hint-ok"),i.classList.remove("hint-warn")),r.disabled=o<2||o>4}return a(),n.forEach(o=>o.addEventListener("change",a)),r.addEventListener("click",()=>{const o=[...n].filter(l=>l.checked).map(l=>l.value),u=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";d.textContent="",t({characters:o,topic:u})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!r.disabled&&r.click()}),e.querySelector("#setup-about").addEventListener("click",B),e.querySelector("#setup-help").addEventListener("click",U),{showError(o){d.textContent=o}}}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ce(e,s,t="",n,i=null,r=[]){return new Promise(d=>{const a=document.createElement("div");a.className="steer-drawer",a.innerHTML=`
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
        ${s.map(m=>`
          <button
            class="style-item${m.style===e?" style-selected":""}"
            data-style="${S(m.style)}"
          >
            <span class="style-name">${S(m.style)}</span>
            <span class="style-desc">${S(m.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(n||document.body).appendChild(a);const u=a.querySelector("#steer-text-input"),l=a.querySelector("#evidence-query"),c=a.querySelector("#evidence-search"),v=a.querySelector("#evidence-preview");u.focus();let f=e,b="";async function y(){const m=l.value.trim();if(!(!m||!i)){c.disabled=!0,c.textContent="Searching…",v.style.display="none",b="";try{const $=await i(m);b=$.finding,v.style.display="block",v.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${S($.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,v.querySelector("#evidence-accept").addEventListener("click",()=>{v.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${S(b)}</div>`}),v.querySelector("#evidence-discard").addEventListener("click",()=>{b="",v.style.display="none"})}catch($){v.style.display="block",v.textContent=`Search failed: ${$.message}`}finally{c.disabled=!1,c.textContent="Search"}}}c.addEventListener("click",y),l.addEventListener("keydown",m=>{m.key==="Enter"&&y()}),a.querySelectorAll(".style-item").forEach(m=>{m.addEventListener("click",()=>{a.querySelectorAll(".style-item").forEach($=>$.classList.remove("style-selected")),m.classList.add("style-selected"),f=m.dataset.style,w()})});function w(){const m=u.value.trim();a.remove(),d({text:m,style:f,evidence:b})}a.querySelector("#steer-submit").addEventListener("click",w),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),d(null)}),u.addEventListener("keydown",m=>{m.key==="Enter"&&w()})})}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const M=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function oe(e,s,t,n){return new Promise(i=>{const r={};t.forEach(c=>{r[c]=0});const d=document.createElement("div");d.className="cheat-overlay",d.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${M[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(c=>`
            <div class="drink-row">
              <span class="drink-name">${H(c)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${H(c)}">−</button>
                <span class="drink-count" id="drink-count-${H(c.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${H(c)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="cheat-footer">
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(d);const a=d.querySelector("#cheat-heat-slider"),o=d.querySelector("#cheat-heat-value");a.addEventListener("input",()=>{const c=parseInt(a.value,10);o.textContent=`${c} — ${M[c]}`}),d.querySelectorAll(".drink-btn").forEach(c=>{c.addEventListener("click",()=>{const v=c.dataset.name,f=c.classList.contains("drink-plus")?1:-1;r[v]=Math.max(0,(r[v]||0)+f);const b=v.replace(/ /g,"_"),y=d.querySelector(`#drink-count-${b}`);y&&(y.textContent=r[v])})});function u(){d.remove(),i()}async function l(){const c=parseInt(a.value,10),v=Object.fromEntries(Object.entries(r).filter(([,b])=>b>0)),f=c!==s;try{await n(e,f?c:null,v)}catch(b){console.error("Cheat failed:",b)}u()}d.querySelector("#cheat-apply").addEventListener("click",l),d.querySelector("#cheat-close").addEventListener("click",u),d.addEventListener("click",c=>{c.target===d&&u()})})}function le(e,s){e.innerHTML=s.map(a=>{const o=de(a),u=pe(a);return`
      <div class="seat" id="seat-${R(a)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${o}" alt="${x(a)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${x(u)}</div>
        </div>
        <div class="seat-name">${x(ue(a))}</div>
      </div>
    `}).join("");let t=null;function n(a){return e.querySelector(`#seat-${R(a)}`)}function i(){clearTimeout(t),e.querySelectorAll(".seat").forEach(a=>{a.classList.remove("seat-thinking","seat-speaking")})}function r(a){var o;i(),(o=n(a))==null||o.classList.add("seat-thinking")}function d(a){i();const o=n(a);o&&(o.classList.add("seat-speaking"),t=setTimeout(()=>o.classList.remove("seat-speaking"),3e3))}return{setThinking:r,setSpeaking:d,clearAll:i}}function de(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function pe(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function ue(e){return e.split(" ").at(-1)}function R(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function x(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ve(e,s,t,n,i,r){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${p(n)}</span>
        <button class="info-btn" id="about-btn">About</button>
        <button class="info-btn" id="help-btn">Help</button>
        <button class="cheat-btn" id="cheat-btn">Cheat</button>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="debate-layout">
        <div class="left-col" id="left-col">
          <div class="convo-pane" id="convo-pane"></div>
        </div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `;const d=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),o=e.querySelector("#sidebar"),u=e.querySelector("#left-col");let l="socratic",c=0,v=null,f=!1,b={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const y=le(d,t);A(o,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function w({type:$,data:h}){switch($){case"speaker":y.setThinking(h.name),ge(a,h.name);break;case"message":_(a),h.backchannel||y.setSpeaking(h.name),he(a,h);break;case"bars":c=h.heat??c,ye(o,h.heat,h.concession_total??0);break;case"debug":{const g=h.data!=null?h.data:"",T=typeof g=="object"?`
`+Object.entries(g).map(([Q,K])=>`  ${Q}: ${JSON.stringify(K)}`).join(`
`):g?` — ${g}`:"";console.log(`[${h.channel}] ${h.label}${T}`);break}case"state":l=h.moderator_style,c=h.heat??c,b=h,A(o,{topic:n,...h});break;case"steer_needed":l=h.current_style,h.drift_topic&&(k(a,`── DRIFT ── conversation has shifted to: ${h.drift_topic}`),k(a,`   original topic: ${n}`)),a.scrollTop=a.scrollHeight,ce(l,i,we(b),u,r.searchEvidence,t).then(g=>{g===null?O(a,b,t,m,s,r):r.steer(s,g.text,g.style,g.evidence||"",g.drinks||{}).catch(T=>k(a,`Steer error: ${T.message}`))});break;case"consensus":if(f)break;f=!0,v&&(v(),v=null),_(a),y.clearAll(),fe(a,h,{onNewTopic(g){r.newTopic(s,g).then(()=>{f=!1,b={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=g,A(o,{topic:g,...b,moderator_style:l,points_of_agreement:[]}),y.clearAll(),v=r.openStream(s,w)}).catch(T=>k(a,`Error: ${T.message}`))},onQuit:m},b,s,r);break;case"game_over":if(f)break;f=!0,v&&(v(),v=null),_(a),y.clearAll(),O(a,h,t,m,s,r);break;case"bar_beat":me(a,h.text);break;case"evidence":be(a,h.finding);break;case"system":k(a,h.text);break;case"error":k(a,`⚠ ${h.text}`);break}}function m(){v&&v(),r.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",B),e.querySelector("#help-btn").addEventListener("click",U),e.querySelector("#cheat-btn").addEventListener("click",()=>{oe(s,c,t,r.cheat)}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(f){m();return}b.turn>0?(f=!0,v&&(v(),v=null),O(a,b,t,m,s,r)):m()}),v=r.openStream(s,w)}function he(e,{role:s,name:t,content:n,backchannel:i}){const r=document.createElement("div");if(i)r.className="msg msg-bc",r.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${q(n)}</em>`;else if(s==="moderator")r.className="msg msg-moderator",r.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${q(n)}</div>`;else if(s==="user")r.className="msg msg-user",r.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${q(n)}</div>`;else{const d=`/portraits/${t.replace(/ /g,"_")}.png`,a=t.split(" ").map(o=>o[0]).join("").slice(0,2).toUpperCase();r.className="msg msg-philosopher",r.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${d}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(a)}</div></div><div class="msg-body"><div class="msg-name">${p(t)}</div><div class="msg-content">${q(n)}</div></div>`}E(e,r)}function me(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=q(s),E(e,t)}function k(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,E(e,t)}function be(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,E(e,t)}function fe(e,{summary:s,points:t},{onNewTopic:n,onQuit:i},r={},d,a){const o=document.createElement("div");o.className="consensus-panel",o.innerHTML=`
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
  `,E(e,o);const u=o.querySelector("#consensus-topic-input");u.focus(),o.querySelector("#consensus-continue").addEventListener("click",()=>{const l=u.value.trim();l&&n(l)}),u.addEventListener("keydown",l=>{if(l.key==="Enter"){const c=u.value.trim();c&&n(c)}}),o.querySelector("#consensus-end").addEventListener("click",i),o.querySelector("#consensus-paper").addEventListener("click",()=>I(d,a))}function O(e,s,t,n,i,r){var u;_(e);const d=document.createElement("div");d.className="game-over-panel";const a=s.turn||0,o=a?`${a} turn${a!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";d.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(o)}</div>
    ${D(s)}
    <div class="game-over-actions">
      ${i?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,E(e,d),d.querySelector("#game-over-leave").addEventListener("click",n),i&&((u=d.querySelector("#game-over-paper"))==null||u.addEventListener("click",()=>I(i,r)))}async function I(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(t);let n;try{n=await s.fetchNewspaper(e)}catch(i){t.remove(),alert(`Could not print the paper: ${i.message}`);return}t.innerHTML=`
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
  `,t.querySelector("#newspaper-close").addEventListener("click",()=>t.remove()),t.addEventListener("click",i=>{i.target===t&&t.remove()})}function D(e){const{turn:s=0,heat:t=0,partial_agreements:n=[],points_of_agreement:i=[],remaining_disagreements:r=[]}=e;if(!s)return"";const d=W(t),a=F(t),o="█".repeat(t),u="░".repeat(10-t);let l='<div class="report-stats">';return l+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,l+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${a}">${o}<span style="color:var(--text-dim)">${u}</span> ${d}</span>
  </div>`,i.length&&(l+='<div class="report-section-label">agreements reached</div>',l+=i.map(c=>`<div class="report-agree-item">✓ ${p(c)}</div>`).join("")),n.length&&(l+='<div class="report-section-label">alignments that formed</div>',l+=n.map(c=>`<div class="report-partial"><span class="report-partial-names">${p(c.participants.join(" + "))}</span> — <span class="report-partial-on">${p(c.on)}</span></div>`).join("")),r.length&&(l+='<div class="report-section-label">still unresolved</div>',l+=r.map(c=>typeof c=="object"&&c!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(c.topic)}</span>
          <span class="report-tension-stance">${p(c.participant_a)}: ${p(c.stance_a)}</span>
          <span class="report-tension-stance">${p(c.participant_b)}: ${p(c.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(c))}</div>`).join("")),l+="</div>",l}function ge(e,s){_(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,E(e,t)}function _(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function A(e,s){const{topic:t,turn:n=0,heat:i=0,concession_total:r=0,moderator_style:d="socratic",partial_agreements:a=[],points_of_agreement:o=[],remaining_disagreements:u=[]}=s;let l=`
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
    `),a.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${a.map(c=>`
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
      ${G(i,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(d)}</div>
    </div>
  `,e.innerHTML=l}function q(e){return p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function E(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function G(e,s){const t=F(e),n=W(e),i="█".repeat(e),r="░".repeat(10-e),d=Math.min(s,10),a=$e(s),o="█".repeat(d),u="░".repeat(10-d),l=Ee(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${i}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${n}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${a}">${o}</span><span class="sb-heat-empty">${u}</span>
      <span class="sb-heat-label" style="color:${a}">${l} (${s})</span>
    </div>
  `}function ye(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=G(s,t))}function F(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function W(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function $e(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Ee(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function we(e,s){const{turn:t,heat:n,partial_agreements:i,remaining_disagreements:r,drift_topic:d}=e;if(!t)return"The debate is just getting started.";if(d)return`The conversation has drifted from the original topic toward ${d}.`;const a=i||[],o=r||[];if(a.length&&o.length){const l=a[0],c=o[0],v=l.participants.join(" and "),f=typeof c=="object"?c.topic:String(c);return`${v} are finding common ground, but the group remains divided on ${f}.`}if(a.length){const l=a[0];return`${l.participants.join(" and ")} are converging on ${l.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(o.length){const l=o[0];return typeof l=="object"?`${l.participant_a} and ${l.participant_b} are sharply divided over ${l.topic}.`:`The room is deadlocked — ${String(l)}.`}const u=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${u}.`}const N=document.querySelector("#app");async function Y(){let e,s;try{[e,s]=await Promise.all([V(),z()])}catch(n){N.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=re(N,e,async({characters:n,topic:i})=>{try{const r=await Z(n,i);Se(r.session_id,n,i,s)}catch(r){t.showError(`Could not start session: ${r.message}`)}})}function Se(e,s,t,n){ve(N,e,s,t,n,{steer:X,cheat:ae,deleteSession:se,newTopic:te,openStream:ie,searchEvidence:ee,fetchNewspaper:ne}),N.addEventListener("debate:quit",()=>Y(),{once:!0})}Y();
