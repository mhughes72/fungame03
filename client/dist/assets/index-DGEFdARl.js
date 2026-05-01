(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const C="/api";async function L(e,s){const t=await fetch(`${C}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function V(e){await fetch(`${C}${e}`,{method:"DELETE"})}async function z(){const e=await fetch(`${C}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function Z(){const e=await fetch(`${C}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function X(e,s){return L("/sessions",{characters:e,topic:s})}async function ee(e,s,t,n="",a={}){return L(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:a})}async function te(e){return L("/search",{query:e})}async function se(e,s){return L(`/sessions/${e}/new-topic`,{topic:s})}async function ne(e){return V(`/sessions/${e}`)}async function ae(e){return L(`/sessions/${e}/newspaper`,{})}async function ie(e,s,t={}){const n={drinks:t};return s!==null&&(n.heat=s),L(`/sessions/${e}/cheat`,n)}function re(e,s){const t=new EventSource(`${C}/sessions/${e}/stream`);return t.onmessage=n=>{try{const a=JSON.parse(n.data);s(a)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const j="https://github.com/mhughes72/fungame03";function P(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function n(){t.remove()}t.querySelector(".info-close").addEventListener("click",n),t.addEventListener("click",a=>{a.target===t&&n()}),document.addEventListener("keydown",function a(r){r.key==="Escape"&&(n(),document.removeEventListener("keydown",a))})}function U(){P("ABOUT",`
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
  `)}function B(){P("HOW TO PLAY",`
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
  `)}function ce(e,s,t){e.innerHTML=`
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
  `;const n=e.querySelectorAll("input[type=checkbox]"),a=e.querySelector("#selection-hint"),r=e.querySelector("#start-btn"),d=e.querySelector("#setup-error");function i(){const o=[...n].filter(u=>u.checked).length;o<2?(a.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",a.classList.remove("hint-ok","hint-warn")):o>4?(a.textContent=`Too many — deselect ${o-4}`,a.classList.add("hint-warn"),a.classList.remove("hint-ok")):(a.textContent=`${o} selected`,a.classList.add("hint-ok"),a.classList.remove("hint-warn")),r.disabled=o<2||o>4}return i(),n.forEach(o=>o.addEventListener("change",i)),r.addEventListener("click",()=>{const o=[...n].filter(l=>l.checked).map(l=>l.value),u=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";d.textContent="",t({characters:o,topic:u})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!r.disabled&&r.click()}),e.querySelector("#setup-about").addEventListener("click",U),e.querySelector("#setup-help").addEventListener("click",B),{showError(o){d.textContent=o}}}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function oe(e,s,t="",n,a=null,r=[]){return new Promise(d=>{const i=document.createElement("div");i.className="steer-drawer",i.innerHTML=`
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
    `,(n||document.body).appendChild(i);const u=i.querySelector("#steer-text-input"),l=i.querySelector("#evidence-query"),c=i.querySelector("#evidence-search"),v=i.querySelector("#evidence-preview");u.focus();let b=e,g="";async function y(){const m=l.value.trim();if(!(!m||!a)){c.disabled=!0,c.textContent="Searching…",v.style.display="none",g="";try{const $=await a(m);g=$.finding,v.style.display="block",v.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${S($.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,v.querySelector("#evidence-accept").addEventListener("click",()=>{v.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${S(g)}</div>`}),v.querySelector("#evidence-discard").addEventListener("click",()=>{g="",v.style.display="none"})}catch($){v.style.display="block",v.textContent=`Search failed: ${$.message}`}finally{c.disabled=!1,c.textContent="Search"}}}c.addEventListener("click",y),l.addEventListener("keydown",m=>{m.key==="Enter"&&y()}),i.querySelectorAll(".style-item").forEach(m=>{m.addEventListener("click",()=>{i.querySelectorAll(".style-item").forEach($=>$.classList.remove("style-selected")),m.classList.add("style-selected"),b=m.dataset.style,w()})});function w(){const m=u.value.trim();i.remove(),d({text:m,style:b,evidence:g})}i.querySelector("#steer-submit").addEventListener("click",w),i.querySelector("#steer-quit").addEventListener("click",()=>{i.remove(),d(null)}),u.addEventListener("keydown",m=>{m.key==="Enter"&&w()})})}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const M=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function le(e,s,t,n){return new Promise(a=>{const r={};t.forEach(c=>{r[c]=0});const d=document.createElement("div");d.className="cheat-overlay",d.innerHTML=`
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
    `,document.body.appendChild(d);const i=d.querySelector("#cheat-heat-slider"),o=d.querySelector("#cheat-heat-value");i.addEventListener("input",()=>{const c=parseInt(i.value,10);o.textContent=`${c} — ${M[c]}`}),d.querySelectorAll(".drink-btn").forEach(c=>{c.addEventListener("click",()=>{const v=c.dataset.name,b=c.classList.contains("drink-plus")?1:-1;r[v]=Math.max(0,(r[v]||0)+b);const g=v.replace(/ /g,"_"),y=d.querySelector(`#drink-count-${g}`);y&&(y.textContent=r[v])})});function u(){d.remove(),a()}async function l(){const c=parseInt(i.value,10),v=Object.fromEntries(Object.entries(r).filter(([,g])=>g>0)),b=c!==s;try{await n(e,b?c:null,v)}catch(g){console.error("Cheat failed:",g)}u()}d.querySelector("#cheat-apply").addEventListener("click",l),d.querySelector("#cheat-close").addEventListener("click",u),d.addEventListener("click",c=>{c.target===d&&u()})})}function de(e,s){e.innerHTML=s.map(i=>{const o=pe(i),u=ue(i);return`
      <div class="seat" id="seat-${R(i)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${o}" alt="${O(i)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${O(u)}</div>
        </div>
        <div class="seat-name">${O(ve(i))}</div>
      </div>
    `}).join("");let t=null;function n(i){return e.querySelector(`#seat-${R(i)}`)}function a(){clearTimeout(t),e.querySelectorAll(".seat").forEach(i=>{i.classList.remove("seat-thinking","seat-speaking")})}function r(i){var o;a(),(o=n(i))==null||o.classList.add("seat-thinking")}function d(i){a();const o=n(i);o&&(o.classList.add("seat-speaking"),t=setTimeout(()=>o.classList.remove("seat-speaking"),3e3))}return{setThinking:r,setSpeaking:d,clearAll:a}}function pe(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ue(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function ve(e){return e.split(" ").at(-1)}function R(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function O(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function he(e,s,t,n,a,r){e.innerHTML=`
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
  `;const d=e.querySelector("#seats-bar"),i=e.querySelector("#convo-pane"),o=e.querySelector("#sidebar"),u=e.querySelector("#left-col");let l="socratic",c=0,v=null,b=!1,g=!1,y={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const w=de(d,t);N(o,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function m({type:Q,data:h}){switch(Q){case"speaker":w.setThinking(h.name),ye(i,h.name);break;case"message":q(i),h.backchannel||w.setSpeaking(h.name),me(i,h);break;case"bars":c=h.heat??c,$e(o,h.heat,h.concession_total??0);break;case"debug":{const f=h.data!=null?h.data:"",T=typeof f=="object"?`
`+Object.entries(f).map(([K,J])=>`  ${K}: ${JSON.stringify(J)}`).join(`
`):f?` — ${f}`:"";console.log(`[${h.channel}] ${h.label}${T}`);break}case"state":l=h.moderator_style,c=h.heat??c,y=h,N(o,{topic:n,...h});break;case"steer_needed":if(g)break;g=!0,l=h.current_style,h.drift_topic&&(k(i,`── DRIFT ── conversation has shifted to: ${h.drift_topic}`),k(i,`   original topic: ${n}`)),i.scrollTop=i.scrollHeight,oe(l,a,Se(y),u,r.searchEvidence,t).then(f=>{g=!1,f===null?A(i,y,t,$,s,r):(l=f.style,N(o,{topic:n,...y,moderator_style:f.style}),r.steer(s,f.text,f.style,f.evidence||"",f.drinks||{}).catch(T=>k(i,`Steer error: ${T.message}`)))});break;case"consensus":if(b)break;b=!0,v&&(v(),v=null),q(i),w.clearAll(),ge(i,h,{onNewTopic(f){r.newTopic(s,f).then(()=>{b=!1,y={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=f,N(o,{topic:f,...y,moderator_style:l,points_of_agreement:[]}),w.clearAll(),v=r.openStream(s,m)}).catch(T=>k(i,`Error: ${T.message}`))},onQuit:$},y,s,r,t);break;case"game_over":if(b)break;b=!0,v&&(v(),v=null),q(i),w.clearAll(),A(i,h,t,$,s,r);break;case"bar_beat":be(i,h.text);break;case"evidence":fe(i,h.finding);break;case"system":k(i,h.text);break;case"error":k(i,`⚠ ${h.text}`);break}}function $(){v&&v(),r.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",U),e.querySelector("#help-btn").addEventListener("click",B),e.querySelector("#cheat-btn").addEventListener("click",()=>{le(s,c,t,r.cheat)}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(b){$();return}y.turn>0?(b=!0,v&&(v(),v=null),A(i,y,t,$,s,r)):$()}),v=r.openStream(s,m)}function me(e,{role:s,name:t,content:n,backchannel:a}){const r=document.createElement("div");if(a)r.className="msg msg-bc",r.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${_(n)}</em>`;else if(s==="moderator")r.className="msg msg-moderator",r.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${_(n)}</div>`;else if(s==="user")r.className="msg msg-user",r.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${_(n)}</div>`;else{const d=`/portraits/${t.replace(/ /g,"_")}.png`,i=t.split(" ").map(o=>o[0]).join("").slice(0,2).toUpperCase();r.className="msg msg-philosopher",r.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${d}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(i)}</div></div><div class="msg-body"><div class="msg-name">${p(t)}</div><div class="msg-content">${_(n)}</div></div>`}E(e,r)}function be(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=_(s),E(e,t)}function k(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,E(e,t)}function fe(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,E(e,t)}function ge(e,{summary:s,points:t},{onNewTopic:n,onQuit:a},r={},d,i,o=[]){const u=document.createElement("div");u.className="consensus-panel",u.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(s)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(c=>`<li>${p(c)}</li>`).join("")}
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
  `,E(e,u);const l=u.querySelector("#consensus-topic-input");l.focus(),u.querySelector("#consensus-continue").addEventListener("click",()=>{const c=l.value.trim();c&&n(c)}),l.addEventListener("keydown",c=>{if(c.key==="Enter"){const v=l.value.trim();v&&n(v)}}),u.querySelector("#consensus-end").addEventListener("click",a),u.querySelector("#consensus-paper").addEventListener("click",()=>I(d,i,o))}function A(e,s,t,n,a,r){var u;q(e);const d=document.createElement("div");d.className="game-over-panel";const i=s.turn||0,o=i?`${i} turn${i!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";d.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(o)}</div>
    ${D(s)}
    <div class="game-over-actions">
      ${a?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,E(e,d),d.querySelector("#game-over-leave").addEventListener("click",n),a&&((u=d.querySelector("#game-over-paper"))==null||u.addEventListener("click",()=>I(a,r,t)))}async function I(e,s,t=[]){const n=document.createElement("div");n.className="newspaper-overlay",n.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(n);let a;try{a=await s.fetchNewspaper(e)}catch(r){n.remove(),alert(`Could not print the paper: ${r.message}`);return}n.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${p(a.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${p(a.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${p(a.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${p(a.headline)}</div>
        <div class="newspaper-subhead">${p(a.subheadline)}</div>

        ${t.length?`
        <div class="newspaper-portrait-strip">
          ${t.map(r=>`
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/newspaper_portraits/${encodeURIComponent(r.replace(/ /g,"_"))}.png"
                   alt="${p(r)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${p(r)}</div>
            </div>
          `).join("")}
        </div>
        `:""}

        <div class="newspaper-columns">
          <div class="newspaper-main-col">
            <p class="newspaper-lede">${p(a.lede)}</p>
            <p class="newspaper-body">${p(a.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${p(a.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${p(a.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${p(a.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${p(a.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,n.querySelector("#newspaper-close").addEventListener("click",()=>n.remove()),n.addEventListener("click",r=>{r.target===n&&n.remove()})}function D(e){const{turn:s=0,heat:t=0,partial_agreements:n=[],points_of_agreement:a=[],remaining_disagreements:r=[]}=e;if(!s)return"";const d=W(t),i=F(t),o="█".repeat(t),u="░".repeat(10-t);let l='<div class="report-stats">';return l+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,l+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${i}">${o}<span style="color:var(--text-dim)">${u}</span> ${d}</span>
  </div>`,a.length&&(l+='<div class="report-section-label">agreements reached</div>',l+=a.map(c=>`<div class="report-agree-item">✓ ${p(c)}</div>`).join("")),n.length&&(l+='<div class="report-section-label">alignments that formed</div>',l+=n.map(c=>`<div class="report-partial"><span class="report-partial-names">${p(c.participants.join(" + "))}</span> — <span class="report-partial-on">${p(c.on)}</span></div>`).join("")),r.length&&(l+='<div class="report-section-label">still unresolved</div>',l+=r.map(c=>typeof c=="object"&&c!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(c.topic)}</span>
          <span class="report-tension-stance">${p(c.participant_a)}: ${p(c.stance_a)}</span>
          <span class="report-tension-stance">${p(c.participant_b)}: ${p(c.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(c))}</div>`).join("")),l+="</div>",l}function ye(e,s){q(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,E(e,t)}function q(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function N(e,s){const{topic:t,turn:n=0,heat:a=0,concession_total:r=0,moderator_style:d="socratic",partial_agreements:i=[],points_of_agreement:o=[],remaining_disagreements:u=[]}=s;let l=`
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
      ${G(a,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(d)}</div>
    </div>
  `,e.innerHTML=l}function _(e){return p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function E(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function G(e,s){const t=F(e),n=W(e),a="█".repeat(e),r="░".repeat(10-e),d=Math.min(s,10),i=we(s),o="█".repeat(d),u="░".repeat(10-d),l=Ee(s);return`
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
  `}function $e(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=G(s,t))}function F(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function W(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function we(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Ee(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Se(e,s){const{turn:t,heat:n,partial_agreements:a,remaining_disagreements:r,drift_topic:d}=e;if(!t)return"The debate is just getting started.";if(d)return`The conversation has drifted from the original topic toward ${d}.`;const i=a||[],o=r||[];if(i.length&&o.length){const l=i[0],c=o[0],v=l.participants.join(" and "),b=typeof c=="object"?c.topic:String(c);return`${v} are finding common ground, but the group remains divided on ${b}.`}if(i.length){const l=i[0];return`${l.participants.join(" and ")} are converging on ${l.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(o.length){const l=o[0];return typeof l=="object"?`${l.participant_a} and ${l.participant_b} are sharply divided over ${l.topic}.`:`The room is deadlocked — ${String(l)}.`}const u=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${u}.`}const x=document.querySelector("#app");async function Y(){let e,s;try{[e,s]=await Promise.all([z(),Z()])}catch(n){x.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=ce(x,e,async({characters:n,topic:a})=>{try{const r=await X(n,a);ke(r.session_id,n,a,s)}catch(r){t.showError(`Could not start session: ${r.message}`)}})}function ke(e,s,t,n){he(x,e,s,t,n,{steer:ee,cheat:ie,deleteSession:ne,newTopic:se,openStream:re,searchEvidence:te,fetchNewspaper:ae}),x.addEventListener("debate:quit",()=>Y(),{once:!0})}Y();
