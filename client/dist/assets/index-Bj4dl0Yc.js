(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))a(c);new MutationObserver(c=>{for(const r of c)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(c){const r={};return c.integrity&&(r.integrity=c.integrity),c.referrerPolicy&&(r.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?r.credentials="include":c.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(c){if(c.ep)return;c.ep=!0;const r=t(c);fetch(c.href,r)}})();const L="/api";async function T(e,s){const t=await fetch(`${L}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function Z(e){await fetch(`${L}${e}`,{method:"DELETE"})}async function M(e=0){const s=await fetch(`${L}/debate-of-the-day?index=${e}`);if(!s.ok)throw new Error("Failed to load debate of the day");return s.json()}async function X(){const e=await fetch(`${L}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function ee(){const e=await fetch(`${L}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function te(e,s){return T("/sessions",{characters:e,topic:s})}async function se(e,s,t,a="",c={}){return T(`/sessions/${e}/steer`,{text:s,style:t,evidence:a,drinks:c})}async function ne(e){return T("/search",{query:e})}async function ae(e,s){return T(`/sessions/${e}/new-topic`,{topic:s})}async function ie(e){return Z(`/sessions/${e}`)}async function re(e){return T(`/sessions/${e}/newspaper`,{})}async function ce(e,s,t={}){const a={drinks:t};return s!==null&&(a.heat=s),T(`/sessions/${e}/cheat`,a)}function oe(e,s){const t=new EventSource(`${L}/sessions/${e}/stream`);return t.onmessage=a=>{try{const c=JSON.parse(a.data);s(c)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const R="https://github.com/mhughes72/fungame03";function B(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",c=>{c.target===t&&a()}),document.addEventListener("keydown",function c(r){r.key==="Escape"&&(a(),document.removeEventListener("keydown",c))})}function D(){B("ABOUT",`
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
    <p><a class="info-link" href="${R}" target="_blank" rel="noopener">${R}</a></p>
  `)}function F(){B("HOW TO PLAY",`
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
  `)}function le(e,s,t){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <input
          id="char-filter"
          class="char-filter-input"
          type="text"
          placeholder="Filter thinkers…"
          autocomplete="off"
          spellcheck="false"
        />

        <div class="char-list" id="char-list">
          ${s.map(d=>`
            <label class="char-row" data-name="${d.name.toLowerCase()}">
              <input type="checkbox" value="${d.name}" />
              <span class="char-name">${d.name}</span>
              <span class="char-era">${d.era}</span>
            </label>
          `).join("")}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
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

        <div class="setup-or">── or ──</div>

        <div class="dotd-card" id="dotd-card">
          <div class="dotd-loading">generating tonight's debate…</div>
        </div>
      </div>
    </div>
  `;const a=e.querySelectorAll("input[type=checkbox]"),c=e.querySelectorAll(".char-row"),r=e.querySelector("#char-no-results"),l=e.querySelector("#char-filter");l.addEventListener("input",()=>{const d=l.value.toLowerCase().trim();let m=0;c.forEach(f=>{const q=!d||f.dataset.name.includes(d);f.style.display=q?"":"none",q&&m++}),r.style.display=m===0?"":"none"});const n=e.querySelector("#selection-hint"),u=e.querySelector("#start-btn"),h=e.querySelector("#setup-error");function o(){const d=[...a].filter(m=>m.checked).length;d<2?(n.textContent=d===0?"Select 2 to 4 thinkers":"Select 1 more",n.classList.remove("hint-ok","hint-warn")):d>4?(n.textContent=`Too many — deselect ${d-4}`,n.classList.add("hint-warn"),n.classList.remove("hint-ok")):(n.textContent=`${d} selected`,n.classList.add("hint-ok"),n.classList.remove("hint-warn")),u.disabled=d<2||d>4}o(),a.forEach(d=>d.addEventListener("change",o)),u.addEventListener("click",()=>{const d=[...a].filter(f=>f.checked).map(f=>f.value),m=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";h.textContent="",t({characters:d,topic:m})}),e.querySelector("#topic-input").addEventListener("keydown",d=>{d.key==="Enter"&&!u.disabled&&u.click()}),e.querySelector("#setup-about").addEventListener("click",D),e.querySelector("#setup-help").addEventListener("click",F);const i=e.querySelector("#dotd-card"),v={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let g=0;function y(d){const m=v[d.category]||"var(--text-dim)";i.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── DEBATE OF THE DAY ──</span>
        <span class="dotd-category" style="color:${m}">${d.category.toUpperCase()}</span>
      </div>
      <div class="dotd-cast">${d.characters.join(" · ")}</div>
      <div class="dotd-topic">${P(d.topic)}</div>
      <div class="dotd-tagline">${P(d.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Generate new one ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,i.querySelector("#dotd-start").addEventListener("click",()=>{t({characters:d.characters,topic:d.topic})}),i.querySelector("#dotd-new").addEventListener("click",()=>{g++,$(g)})}function $(d){i.innerHTML='<div class="dotd-loading">generating…</div>',M(d).then(y).catch(()=>{d===0?i.style.display="none":(g--,M(g).then(y).catch(()=>{i.style.display="none"}))})}return $(0),{showError(d){h.textContent=d}}}function P(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function de(e,s,t="",a,c=null,r=[]){return new Promise(l=>{const n=document.createElement("div");n.className="steer-drawer",n.innerHTML=`
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
    `,(a||document.body).appendChild(n);const h=n.querySelector("#steer-text-input"),o=n.querySelector("#evidence-query"),i=n.querySelector("#evidence-search"),v=n.querySelector("#evidence-preview");h.focus();let g=e,y="";async function $(){const m=o.value.trim();if(!(!m||!c)){i.disabled=!0,i.textContent="Searching…",v.style.display="none",y="";try{const f=await c(m);y=f.finding,v.style.display="block",v.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${S(f.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,v.querySelector("#evidence-accept").addEventListener("click",()=>{v.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${S(y)}</div>`}),v.querySelector("#evidence-discard").addEventListener("click",()=>{y="",v.style.display="none"})}catch(f){v.style.display="block",v.textContent=`Search failed: ${f.message}`}finally{i.disabled=!1,i.textContent="Search"}}}i.addEventListener("click",$),o.addEventListener("keydown",m=>{m.key==="Enter"&&$()}),n.querySelectorAll(".style-item").forEach(m=>{m.addEventListener("click",()=>{n.querySelectorAll(".style-item").forEach(f=>f.classList.remove("style-selected")),m.classList.add("style-selected"),g=m.dataset.style,d()})});function d(){const m=h.value.trim();n.remove(),l({text:m,style:g,evidence:y})}n.querySelector("#steer-submit").addEventListener("click",d),n.querySelector("#steer-quit").addEventListener("click",()=>{n.remove(),l(null)}),h.addEventListener("keydown",m=>{m.key==="Enter"&&d()})})}function x(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const I=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function pe(e,s,t,a){return new Promise(c=>{const r={};t.forEach(i=>{r[i]=0});const l=document.createElement("div");l.className="cheat-overlay",l.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${I[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(i=>`
            <div class="drink-row">
              <span class="drink-name">${x(i)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${x(i)}">−</button>
                <span class="drink-count" id="drink-count-${x(i.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${x(i)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="cheat-footer">
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(l);const n=l.querySelector("#cheat-heat-slider"),u=l.querySelector("#cheat-heat-value");n.addEventListener("input",()=>{const i=parseInt(n.value,10);u.textContent=`${i} — ${I[i]}`}),l.querySelectorAll(".drink-btn").forEach(i=>{i.addEventListener("click",()=>{const v=i.dataset.name,g=i.classList.contains("drink-plus")?1:-1;r[v]=Math.max(0,(r[v]||0)+g);const y=v.replace(/ /g,"_"),$=l.querySelector(`#drink-count-${y}`);$&&($.textContent=r[v])})});function h(){l.remove(),c()}async function o(){const i=parseInt(n.value,10),v=Object.fromEntries(Object.entries(r).filter(([,y])=>y>0)),g=i!==s;try{await a(e,g?i:null,v)}catch(y){console.error("Cheat failed:",y)}h()}l.querySelector("#cheat-apply").addEventListener("click",o),l.querySelector("#cheat-close").addEventListener("click",h),l.addEventListener("click",i=>{i.target===l&&h()})})}function ue(e,s){e.innerHTML=s.map(n=>{const u=ve(n),h=he(n);return`
      <div class="seat" id="seat-${U(n)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${u}" alt="${O(n)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${O(h)}</div>
        </div>
        <div class="seat-name">${O(me(n))}</div>
      </div>
    `}).join("");let t=null;function a(n){return e.querySelector(`#seat-${U(n)}`)}function c(){clearTimeout(t),e.querySelectorAll(".seat").forEach(n=>{n.classList.remove("seat-thinking","seat-speaking")})}function r(n){var u;c(),(u=a(n))==null||u.classList.add("seat-thinking")}function l(n){c();const u=a(n);u&&(u.classList.add("seat-speaking"),t=setTimeout(()=>u.classList.remove("seat-speaking"),3e3))}return{setThinking:r,setSpeaking:l,clearAll:c}}function ve(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function he(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function me(e){return e.split(" ").at(-1)}function U(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function O(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function be(e,s,t,a,c,r){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${p(a)}</span>
        <button class="info-btn" id="about-btn">About</button>
        <button class="info-btn" id="help-btn">Help</button>
        <button class="cheat-btn" id="cheat-btn">Cheat</button>
        <button class="sidebar-toggle-btn" id="sidebar-toggle">Stats</button>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="debate-layout">
        <div class="left-col" id="left-col">
          <div class="convo-pane" id="convo-pane"></div>
        </div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `;const l=e.querySelector("#seats-bar"),n=e.querySelector("#convo-pane"),u=e.querySelector("#sidebar"),h=e.querySelector("#left-col");let o="socratic",i=0,v=null,g=!1,y=!1,$={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const d=ue(l,t);N(u,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function m({type:q,data:b}){switch(q){case"speaker":d.setThinking(b.name),we(n,b.name);break;case"message":H(n),b.backchannel||d.setSpeaking(b.name),ge(n,b);break;case"bars":i=b.heat??i,Ee(u,b.heat,b.concession_total??0);break;case"debug":{const w=b.data!=null?b.data:"",_=typeof w=="object"?`
`+Object.entries(w).map(([V,z])=>`  ${V}: ${JSON.stringify(z)}`).join(`
`):w?` — ${w}`:"";console.log(`[${b.channel}] ${b.label}${_}`);break}case"state":o=b.moderator_style,i=b.heat??i,$=b,N(u,{topic:a,...b});break;case"steer_needed":if(y)break;y=!0,o=b.current_style,b.drift_topic&&(k(n,`── DRIFT ── conversation has shifted to: ${b.drift_topic}`),k(n,`   original topic: ${a}`)),n.scrollTop=n.scrollHeight,de(o,c,Le($),h,r.searchEvidence,t).then(w=>{y=!1,w===null?j(n,$,t,f,s,r):(o=w.style,N(u,{topic:a,...$,moderator_style:w.style}),r.steer(s,w.text,w.style,w.evidence||"",w.drinks||{}).catch(_=>k(n,`Steer error: ${_.message}`)))});break;case"consensus":if(g)break;g=!0,v&&(v(),v=null),H(n),d.clearAll(),$e(n,b,{onNewTopic(w){r.newTopic(s,w).then(()=>{g=!1,$={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=w,N(u,{topic:w,...$,moderator_style:o,points_of_agreement:[]}),d.clearAll(),v=r.openStream(s,m)}).catch(_=>k(n,`Error: ${_.message}`))},onQuit:f},$,s,r,t);break;case"game_over":if(g)break;g=!0,v&&(v(),v=null),H(n),d.clearAll(),j(n,b,t,f,s,r);break;case"bar_beat":fe(n,b.text);break;case"evidence":ye(n,b.finding);break;case"system":k(n,b.text);break;case"error":k(n,`⚠ ${b.text}`);break}}function f(){v&&v(),r.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",D),e.querySelector("#help-btn").addEventListener("click",F),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const b=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=b?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{pe(s,i,t,r.cheat)}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(g){f();return}$.turn>0?(g=!0,v&&(v(),v=null),j(n,$,t,f,s,r)):f()}),v=r.openStream(s,m)}function ge(e,{role:s,name:t,content:a,backchannel:c}){const r=document.createElement("div");if(c)r.className="msg msg-bc",r.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${C(a)}</em>`;else if(s==="moderator")r.className="msg msg-moderator",r.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${C(a)}</div>`;else if(s==="user")r.className="msg msg-user",r.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${C(a)}</div>`;else{const l=`/portraits/${t.replace(/ /g,"_")}.png`,n=t.split(" ").map(u=>u[0]).join("").slice(0,2).toUpperCase();r.className="msg msg-philosopher",r.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${l}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(n)}</div></div><div class="msg-body"><div class="msg-name">${p(t)}</div><div class="msg-content">${C(a)}</div></div>`}E(e,r)}function fe(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=C(s),E(e,t)}function k(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,E(e,t)}function ye(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,E(e,t)}function $e(e,{summary:s,points:t},{onNewTopic:a,onQuit:c},r={},l,n,u=[]){const h=document.createElement("div");h.className="consensus-panel",h.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(s)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(i=>`<li>${p(i)}</li>`).join("")}
      </ul>
    `:""}
    ${Y(r)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="newspaper-btn" id="consensus-paper">Read the morning paper 📰</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,E(e,h);const o=h.querySelector("#consensus-topic-input");o.focus(),h.querySelector("#consensus-continue").addEventListener("click",()=>{const i=o.value.trim();i&&a(i)}),o.addEventListener("keydown",i=>{if(i.key==="Enter"){const v=o.value.trim();v&&a(v)}}),h.querySelector("#consensus-end").addEventListener("click",c),h.querySelector("#consensus-paper").addEventListener("click",()=>G(l,n,u))}function j(e,s,t,a,c,r){var h;H(e);const l=document.createElement("div");l.className="game-over-panel";const n=s.turn||0,u=n?`${n} turn${n!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(u)}</div>
    ${Y(s)}
    <div class="game-over-actions">
      ${c?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,E(e,l),l.querySelector("#game-over-leave").addEventListener("click",a),c&&((h=l.querySelector("#game-over-paper"))==null||h.addEventListener("click",()=>G(c,r,t)))}async function G(e,s,t=[]){const a=document.createElement("div");a.className="newspaper-overlay",a.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(a);let c;try{c=await s.fetchNewspaper(e)}catch(r){a.remove(),alert(`Could not print the paper: ${r.message}`);return}a.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${p(c.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${p(c.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${p(c.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${p(c.headline)}</div>
        <div class="newspaper-subhead">${p(c.subheadline)}</div>

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
            <p class="newspaper-lede">${p(c.lede)}</p>
            <p class="newspaper-body">${p(c.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${p(c.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${p(c.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${p(c.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${p(c.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,a.querySelector("#newspaper-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",r=>{r.target===a&&a.remove()})}function Y(e){const{turn:s=0,heat:t=0,partial_agreements:a=[],points_of_agreement:c=[],remaining_disagreements:r=[]}=e;if(!s)return"";const l=K(t),n=Q(t),u="█".repeat(t),h="░".repeat(10-t);let o='<div class="report-stats">';return o+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,o+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${n}">${u}<span style="color:var(--text-dim)">${h}</span> ${l}</span>
  </div>`,c.length&&(o+='<div class="report-section-label">agreements reached</div>',o+=c.map(i=>`<div class="report-agree-item">✓ ${p(i)}</div>`).join("")),a.length&&(o+='<div class="report-section-label">alignments that formed</div>',o+=a.map(i=>`<div class="report-partial"><span class="report-partial-names">${p(i.participants.join(" + "))}</span> — <span class="report-partial-on">${p(i.on)}</span></div>`).join("")),r.length&&(o+='<div class="report-section-label">still unresolved</div>',o+=r.map(i=>typeof i=="object"&&i!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(i.topic)}</span>
          <span class="report-tension-stance">${p(i.participant_a)}: ${p(i.stance_a)}</span>
          <span class="report-tension-stance">${p(i.participant_b)}: ${p(i.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(i))}</div>`).join("")),o+="</div>",o}function we(e,s){H(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,E(e,t)}function H(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function N(e,s){const{topic:t,turn:a=0,heat:c=0,concession_total:r=0,moderator_style:l="socratic",partial_agreements:n=[],points_of_agreement:u=[],remaining_disagreements:h=[]}=s;let o=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;u.length&&(o+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${u.map(i=>`<div class="sb-agree-item">✓ ${p(i)}</div>`).join("")}
      </div>
    `),n.length&&(o+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${n.map(i=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(i.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(i.on)}</div>
          </div>
        `).join("")}
      </div>
    `),h.length&&(o+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${h.map(i=>typeof i=="object"&&i!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(i.topic)}</div>
                <div class="sb-tension-stance">${p(i.participant_a)}: ${p(i.stance_a)}</div>
                <div class="sb-tension-stance">${p(i.participant_b)}: ${p(i.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(i))}</div>`).join("")}
      </div>
    `),o+=`
    <div class="sb-section" id="sb-bars">
      ${W(c,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(l)}</div>
    </div>
  `,e.innerHTML=o}function C(e){return p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function E(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function W(e,s){const t=Q(e),a=K(e),c="█".repeat(e),r="░".repeat(10-e),l=Math.min(s,10),n=Se(s),u="█".repeat(l),h="░".repeat(10-l),o=ke(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${c}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${n}">${u}</span><span class="sb-heat-empty">${h}</span>
      <span class="sb-heat-label" style="color:${n}">${o} (${s})</span>
    </div>
  `}function Ee(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=W(s,t))}function Q(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function K(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Se(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function ke(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Le(e,s){const{turn:t,heat:a,partial_agreements:c,remaining_disagreements:r,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const n=c||[],u=r||[];if(n.length&&u.length){const o=n[0],i=u[0],v=o.participants.join(" and "),g=typeof i=="object"?i.topic:String(i);return`${v} are finding common ground, but the group remains divided on ${g}.`}if(n.length){const o=n[0];return`${o.participants.join(" and ")} are converging on ${o.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(u.length){const o=u[0];return typeof o=="object"?`${o.participant_a} and ${o.participant_b} are sharply divided over ${o.topic}.`:`The room is deadlocked — ${String(o)}.`}const h=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${h}.`}const A=document.querySelector("#app");async function J(){let e,s;try{[e,s]=await Promise.all([X(),ee()])}catch(a){A.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${a.message}</div>`;return}const t=le(A,e,async({characters:a,topic:c})=>{try{const r=await te(a,c);Te(r.session_id,a,c,s)}catch(r){t.showError(`Could not start session: ${r.message}`)}})}function Te(e,s,t,a){be(A,e,s,t,a,{steer:se,cheat:ce,deleteSession:ie,newTopic:ae,openStream:oe,searchEvidence:ne,fetchNewspaper:re}),A.addEventListener("debate:quit",()=>J(),{once:!0})}J();
