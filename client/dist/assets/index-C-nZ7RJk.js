(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const L="/api";async function T(e,n){const t=await fetch(`${L}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function Z(e){await fetch(`${L}${e}`,{method:"DELETE"})}async function P(e=0){const n=await fetch(`${L}/debate-of-the-day?index=${e}`);if(!n.ok)throw new Error("Failed to load debate of the day");return n.json()}async function X(){const e=await fetch(`${L}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function ee(){const e=await fetch(`${L}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function te(e,n){return T("/sessions",{characters:e,topic:n})}async function se(e,n,t,a="",i={}){return T(`/sessions/${e}/steer`,{text:n,style:t,evidence:a,drinks:i})}async function ne(e){return T("/search",{query:e})}async function ae(e,n){return T(`/sessions/${e}/new-topic`,{topic:n})}async function ie(e){return Z(`/sessions/${e}`)}async function re(e){return T(`/sessions/${e}/newspaper`,{})}async function ce(e,n,t={}){const a={drinks:t};return n!==null&&(a.heat=n),T(`/sessions/${e}/cheat`,a)}function oe(e,n){const t=new EventSource(`${L}/sessions/${e}/stream`);return t.onmessage=a=>{try{const i=JSON.parse(a.data);n(i)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),n({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const R="https://github.com/mhughes72/fungame03";function I(e,n){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${n}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",i=>{i.target===t&&a()}),document.addEventListener("keydown",function i(r){r.key==="Escape"&&(a(),document.removeEventListener("keydown",i))})}function F(){I("ABOUT",`
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
  `)}function G(){I("HOW TO PLAY",`
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
  `)}function le(e,n,t){e.innerHTML=`
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
          ${n.map(l=>`
            <label class="char-row" data-name="${l.name.toLowerCase()}">
              <input type="checkbox" value="${l.name}" />
              <span class="char-name">${l.name}</span>
              <span class="char-era">${l.era}</span>
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

        <div class="setup-or">── or ──</div>

        <div class="dotd-card" id="dotd-card">
          <div class="dotd-loading">generating tonight's debate…</div>
        </div>

        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `;const a=e.querySelectorAll("input[type=checkbox]"),i=e.querySelectorAll(".char-row"),r=e.querySelector("#char-no-results"),u=e.querySelector("#char-filter");u.addEventListener("input",()=>{const l=u.value.toLowerCase().trim();let b=0;i.forEach(f=>{const q=!l||f.dataset.name.includes(l);f.style.display=q?"":"none",q&&b++}),r.style.display=b===0?"":"none"});const s=e.querySelector("#selection-hint"),d=e.querySelector("#start-btn"),m=e.querySelector("#setup-error");function o(){const l=[...a].filter(b=>b.checked).length;l<2?(s.textContent=l===0?"Select 2 to 4 thinkers":"Select 1 more",s.classList.remove("hint-ok","hint-warn")):l>4?(s.textContent=`Too many — deselect ${l-4}`,s.classList.add("hint-warn"),s.classList.remove("hint-ok")):(s.textContent=`${l} selected`,s.classList.add("hint-ok"),s.classList.remove("hint-warn")),d.disabled=l<2||l>4}o(),a.forEach(l=>l.addEventListener("change",o)),d.addEventListener("click",()=>{const l=[...a].filter(f=>f.checked).map(f=>f.value),b=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";m.textContent="",t({characters:l,topic:b})}),e.querySelector("#topic-input").addEventListener("keydown",l=>{l.key==="Enter"&&!d.disabled&&d.click()}),e.querySelector("#setup-about").addEventListener("click",F),e.querySelector("#setup-help").addEventListener("click",G);const c=e.querySelector("#dotd-card"),h={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let v=0;function y(l){const b=h[l.category]||"var(--text-dim)";c.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── DEBATE OF THE DAY ──</span>
        <span class="dotd-category" style="color:${b}">${l.category.toUpperCase()}</span>
      </div>
      <div class="dotd-cast">${l.characters.join(" · ")}</div>
      <div class="dotd-topic">${D(l.topic)}</div>
      <div class="dotd-tagline">${D(l.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Generate new one ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,c.querySelector("#dotd-start").addEventListener("click",()=>{t({characters:l.characters,topic:l.topic})}),c.querySelector("#dotd-new").addEventListener("click",()=>{v++,$(v)})}function $(l){c.innerHTML='<div class="dotd-loading">generating…</div>',P(l).then(y).catch(()=>{l===0?c.style.display="none":(v--,P(v).then(y).catch(()=>{c.style.display="none"}))})}return $(0),{showError(l){m.textContent=l}}}function D(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function de(e,n,t="",a,i=null,r=[]){return new Promise(u=>{const s=document.createElement("div");s.className="steer-drawer",s.innerHTML=`
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
        ${n.map(b=>`
          <button
            class="style-item${b.style===e?" style-selected":""}"
            data-style="${S(b.style)}"
          >
            <span class="style-name">${S(b.style)}</span>
            <span class="style-desc">${S(b.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(a||document.body).appendChild(s);const m=s.querySelector("#steer-text-input"),o=s.querySelector("#evidence-query"),c=s.querySelector("#evidence-search"),h=s.querySelector("#evidence-preview");m.focus();let v=e,y="";async function $(){const b=o.value.trim();if(!(!b||!i)){c.disabled=!0,c.textContent="Searching…",h.style.display="none",y="";try{const f=await i(b);y=f.finding,h.style.display="block",h.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${S(f.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,h.querySelector("#evidence-accept").addEventListener("click",()=>{h.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${S(y)}</div>`}),h.querySelector("#evidence-discard").addEventListener("click",()=>{y="",h.style.display="none"})}catch(f){h.style.display="block",h.textContent=`Search failed: ${f.message}`}finally{c.disabled=!1,c.textContent="Search"}}}c.addEventListener("click",$),o.addEventListener("keydown",b=>{b.key==="Enter"&&$()}),s.querySelectorAll(".style-item").forEach(b=>{b.addEventListener("click",()=>{s.querySelectorAll(".style-item").forEach(f=>f.classList.remove("style-selected")),b.classList.add("style-selected"),v=b.dataset.style,l()})});function l(){const b=m.value.trim();s.remove(),u({text:b,style:v,evidence:y})}s.querySelector("#steer-submit").addEventListener("click",l),s.querySelector("#steer-quit").addEventListener("click",()=>{s.remove(),u(null)}),m.addEventListener("keydown",b=>{b.key==="Enter"&&l()})})}function x(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const U=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function pe(e,n,t,a,i=null){return new Promise(r=>{var h;const u={};t.forEach(v=>{u[v]=0});const s=document.createElement("div");s.className="cheat-overlay",s.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${n}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${n} — ${U[n]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(v=>`
            <div class="drink-row">
              <span class="drink-name">${x(v)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${x(v)}">−</button>
                <span class="drink-count" id="drink-count-${x(v.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${x(v)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="cheat-footer">
          ${i?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(s);const d=s.querySelector("#cheat-heat-slider"),m=s.querySelector("#cheat-heat-value");d.addEventListener("input",()=>{const v=parseInt(d.value,10);m.textContent=`${v} — ${U[v]}`}),s.querySelectorAll(".drink-btn").forEach(v=>{v.addEventListener("click",()=>{const y=v.dataset.name,$=v.classList.contains("drink-plus")?1:-1;u[y]=Math.max(0,(u[y]||0)+$);const l=y.replace(/ /g,"_"),b=s.querySelector(`#drink-count-${l}`);b&&(b.textContent=u[y])})});function o(){s.remove(),r()}async function c(){const v=parseInt(d.value,10),y=Object.fromEntries(Object.entries(u).filter(([,l])=>l>0)),$=v!==n;try{await a(e,$?v:null,y)}catch(l){console.error("Cheat failed:",l)}o()}s.querySelector("#cheat-apply").addEventListener("click",c),s.querySelector("#cheat-close").addEventListener("click",o),(h=s.querySelector("#cheat-paper"))==null||h.addEventListener("click",()=>{o(),i()}),s.addEventListener("click",v=>{v.target===s&&o()})})}function ue(e,n){e.innerHTML=n.map(s=>{const d=ve(s),m=he(s);return`
      <div class="seat" id="seat-${B(s)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${d}" alt="${A(s)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${A(m)}</div>
        </div>
        <div class="seat-name">${A(me(s))}</div>
      </div>
    `}).join("");let t=null;function a(s){return e.querySelector(`#seat-${B(s)}`)}function i(){clearTimeout(t),e.querySelectorAll(".seat").forEach(s=>{s.classList.remove("seat-thinking","seat-speaking")})}function r(s){var d;i(),(d=a(s))==null||d.classList.add("seat-thinking")}function u(s){i();const d=a(s);d&&(d.classList.add("seat-speaking"),t=setTimeout(()=>d.classList.remove("seat-speaking"),3e3))}return{setThinking:r,setSpeaking:u,clearAll:i}}function ve(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function he(e){return e.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}function me(e){return e.split(" ").at(-1)}function B(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function A(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function be(e,n,t,a,i,r){e.innerHTML=`
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
  `;const u=e.querySelector("#seats-bar"),s=e.querySelector("#convo-pane"),d=e.querySelector("#sidebar"),m=e.querySelector("#left-col");let o="socratic",c=0,h=null,v=!1,y=!1,$={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const l=ue(u,t);N(d,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function b({type:q,data:g}){switch(q){case"speaker":l.setThinking(g.name),we(s,g.name);break;case"message":H(s),g.backchannel||l.setSpeaking(g.name),ge(s,g);break;case"bars":c=g.heat??c,Ee(d,g.heat,g.concession_total??0);break;case"debug":{const w=g.data!=null?g.data:"",_=typeof w=="object"?`
`+Object.entries(w).map(([V,z])=>`  ${V}: ${JSON.stringify(z)}`).join(`
`):w?` — ${w}`:"";console.log(`[${g.channel}] ${g.label}${_}`);break}case"state":o=g.moderator_style,c=g.heat??c,$=g,N(d,{topic:a,...g});break;case"steer_needed":if(y)break;y=!0,o=g.current_style,g.drift_topic&&(k(s,`── DRIFT ── conversation has shifted to: ${g.drift_topic}`),k(s,`   original topic: ${a}`)),s.scrollTop=s.scrollHeight,de(o,i,Le($),m,r.searchEvidence,t).then(w=>{y=!1,w===null?j(s,$,t,f,n,r):(o=w.style,N(d,{topic:a,...$,moderator_style:w.style}),r.steer(n,w.text,w.style,w.evidence||"",w.drinks||{}).catch(_=>k(s,`Steer error: ${_.message}`)))});break;case"consensus":if(v)break;v=!0,h&&(h(),h=null),H(s),l.clearAll(),$e(s,g,{onNewTopic(w){r.newTopic(n,w).then(()=>{v=!1,$={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=w,N(d,{topic:w,...$,moderator_style:o,points_of_agreement:[]}),l.clearAll(),h=r.openStream(n,b)}).catch(_=>k(s,`Error: ${_.message}`))},onQuit:f},$,n,r,t);break;case"game_over":if(v)break;v=!0,h&&(h(),h=null),H(s),l.clearAll(),j(s,g,t,f,n,r);break;case"bar_beat":fe(s,g.text);break;case"evidence":ye(s,g.finding);break;case"system":k(s,g.text);break;case"error":k(s,`⚠ ${g.text}`);break}}function f(){h&&h(),r.deleteSession(n).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",F),e.querySelector("#help-btn").addEventListener("click",G),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const g=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=g?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{pe(n,c,t,r.cheat,()=>M(n,r,t))}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(v){f();return}$.turn>0?(v=!0,h&&(h(),h=null),j(s,$,t,f,n,r)):f()}),h=r.openStream(n,b)}function ge(e,{role:n,name:t,content:a,backchannel:i}){const r=document.createElement("div");if(i)r.className="msg msg-bc",r.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${C(a)}</em>`;else if(n==="moderator")r.className="msg msg-moderator",r.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${C(a)}</div>`;else if(n==="user")r.className="msg msg-user",r.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${C(a)}</div>`;else{const u=`/portraits/${t.replace(/ /g,"_")}.png`,s=t.split(" ").map(d=>d[0]).join("").slice(0,2).toUpperCase();r.className="msg msg-philosopher",r.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${u}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(s)}</div></div><div class="msg-body"><div class="msg-name">${p(t)}</div><div class="msg-content">${C(a)}</div></div>`}E(e,r)}function fe(e,n){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=C(n),E(e,t)}function k(e,n){const t=document.createElement("div");t.className="msg msg-system",t.textContent=n,E(e,t)}function ye(e,n){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(n)}`,E(e,t)}function $e(e,{summary:n,points:t},{onNewTopic:a,onQuit:i},r={},u,s,d=[]){const m=document.createElement("div");m.className="consensus-panel",m.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(n)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(c=>`<li>${p(c)}</li>`).join("")}
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
  `,E(e,m);const o=m.querySelector("#consensus-topic-input");o.focus(),m.querySelector("#consensus-continue").addEventListener("click",()=>{const c=o.value.trim();c&&a(c)}),o.addEventListener("keydown",c=>{if(c.key==="Enter"){const h=o.value.trim();h&&a(h)}}),m.querySelector("#consensus-end").addEventListener("click",i),m.querySelector("#consensus-paper").addEventListener("click",()=>M(u,s,d))}function j(e,n,t,a,i,r){var m;H(e);const u=document.createElement("div");u.className="game-over-panel";const s=n.turn||0,d=s?`${s} turn${s!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";u.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(d)}</div>
    ${Y(n)}
    <div class="game-over-actions">
      ${i?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,E(e,u),u.querySelector("#game-over-leave").addEventListener("click",a),i&&((m=u.querySelector("#game-over-paper"))==null||m.addEventListener("click",()=>M(i,r,t)))}async function M(e,n,t=[]){const a=document.createElement("div");a.className="newspaper-overlay",a.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(a);let i;try{i=await n.fetchNewspaper(e)}catch(r){a.remove(),alert(`Could not print the paper: ${r.message}`);return}a.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${p(i.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${p(i.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${p(i.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${p(i.headline)}</div>
        <div class="newspaper-subhead">${p(i.subheadline)}</div>

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
            <p class="newspaper-lede">${p(i.lede)}</p>
            <p class="newspaper-body">${p(i.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${p(i.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${p(i.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${p(i.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${p(i.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,a.querySelector("#newspaper-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",r=>{r.target===a&&a.remove()}),a.querySelector("#newspaper-download").addEventListener("click",()=>{var d;const r=a.querySelector(".newspaper-page").outerHTML,u=((d=document.querySelector("link[rel=stylesheet]"))==null?void 0:d.href)||"",s=window.open("","_blank");s.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${p(i.newspaper_name)}</title>
${u?`<link rel="stylesheet" href="${u}">`:""}
<style>
  body { margin: 0; background: #f2ebd4; }
  .newspaper-page { max-width: 760px; margin: 0 auto; padding: 2.5rem 2.5rem 2rem; }
  @media print { body { margin: 0; } }
</style>
</head><body>${r}</body></html>`),s.document.close(),s.addEventListener("load",()=>{s.focus(),s.print()})})}function Y(e){const{turn:n=0,heat:t=0,partial_agreements:a=[],points_of_agreement:i=[],remaining_disagreements:r=[]}=e;if(!n)return"";const u=K(t),s=Q(t),d="█".repeat(t),m="░".repeat(10-t);let o='<div class="report-stats">';return o+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${n}</span>
  </div>`,o+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${s}">${d}<span style="color:var(--text-dim)">${m}</span> ${u}</span>
  </div>`,i.length&&(o+='<div class="report-section-label">agreements reached</div>',o+=i.map(c=>`<div class="report-agree-item">✓ ${p(c)}</div>`).join("")),a.length&&(o+='<div class="report-section-label">alignments that formed</div>',o+=a.map(c=>`<div class="report-partial"><span class="report-partial-names">${p(c.participants.join(" + "))}</span> — <span class="report-partial-on">${p(c.on)}</span></div>`).join("")),r.length&&(o+='<div class="report-section-label">still unresolved</div>',o+=r.map(c=>typeof c=="object"&&c!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(c.topic)}</span>
          <span class="report-tension-stance">${p(c.participant_a)}: ${p(c.stance_a)}</span>
          <span class="report-tension-stance">${p(c.participant_b)}: ${p(c.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(c))}</div>`).join("")),o+="</div>",o}function we(e,n){H(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(n)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,E(e,t)}function H(e){var n;(n=e.querySelector("#typing-indicator"))==null||n.remove()}function N(e,n){const{topic:t,turn:a=0,heat:i=0,concession_total:r=0,moderator_style:u="socratic",partial_agreements:s=[],points_of_agreement:d=[],remaining_disagreements:m=[]}=n;let o=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;d.length&&(o+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${d.map(c=>`<div class="sb-agree-item">✓ ${p(c)}</div>`).join("")}
      </div>
    `),s.length&&(o+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${s.map(c=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(c.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(c.on)}</div>
          </div>
        `).join("")}
      </div>
    `),m.length&&(o+=`
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
    `),o+=`
    <div class="sb-section" id="sb-bars">
      ${W(i,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(u)}</div>
    </div>
  `,e.innerHTML=o}function C(e){return p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function E(e,n){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(n),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function W(e,n){const t=Q(e),a=K(e),i="█".repeat(e),r="░".repeat(10-e),u=Math.min(n,10),s=Se(n),d="█".repeat(u),m="░".repeat(10-u),o=ke(n);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${i}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${s}">${d}</span><span class="sb-heat-empty">${m}</span>
      <span class="sb-heat-label" style="color:${s}">${o} (${n})</span>
    </div>
  `}function Ee(e,n,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=W(n,t))}function Q(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function K(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Se(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function ke(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Le(e,n){const{turn:t,heat:a,partial_agreements:i,remaining_disagreements:r,drift_topic:u}=e;if(!t)return"The debate is just getting started.";if(u)return`The conversation has drifted from the original topic toward ${u}.`;const s=i||[],d=r||[];if(s.length&&d.length){const o=s[0],c=d[0],h=o.participants.join(" and "),v=typeof c=="object"?c.topic:String(c);return`${h} are finding common ground, but the group remains divided on ${v}.`}if(s.length){const o=s[0];return`${o.participants.join(" and ")} are converging on ${o.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(d.length){const o=d[0];return typeof o=="object"?`${o.participant_a} and ${o.participant_b} are sharply divided over ${o.topic}.`:`The room is deadlocked — ${String(o)}.`}const m=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${m}.`}const O=document.querySelector("#app");async function J(){let e,n;try{[e,n]=await Promise.all([X(),ee()])}catch(a){O.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${a.message}</div>`;return}const t=le(O,e,async({characters:a,topic:i})=>{try{const r=await te(a,i);Te(r.session_id,a,i,n)}catch(r){t.showError(`Could not start session: ${r.message}`)}})}function Te(e,n,t,a){be(O,e,n,t,a,{steer:se,cheat:ce,deleteSession:ie,newTopic:ae,openStream:oe,searchEvidence:ne,fetchNewspaper:re}),O.addEventListener("debate:quit",()=>J(),{once:!0})}J();
