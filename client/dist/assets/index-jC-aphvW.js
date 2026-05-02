(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&n(u)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const q="/api";async function _(e,s){const t=await fetch(`${q}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function X(e){await fetch(`${q}${e}`,{method:"DELETE"})}async function R(e=0){const s=await fetch(`${q}/debate-of-the-day?index=${e}`);if(!s.ok)throw new Error("Failed to load debate of the day");return s.json()}async function ee(){const e=await fetch(`${q}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function te(){const e=await fetch(`${q}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function se(e,s,t=!0,n=!0){return _("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:n})}async function ae(e,s,t,n="",r={}){return _(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:r})}async function ne(e){return _("/search",{query:e})}async function re(e,s){return _(`/sessions/${e}/new-topic`,{topic:s})}async function ie(e){return X(`/sessions/${e}`)}async function oe(e){return _(`/sessions/${e}/newspaper`,{})}async function ce(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const i=await s.json().catch(()=>({detail:s.statusText}));throw new Error(i.detail||s.statusText)}const t=await s.blob(),n=URL.createObjectURL(t),r=document.createElement("a");r.href=n,r.download="philosophers-bar-podcast.mp3",document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(n)}async function le(e,s,t={}){const n={drinks:t};return s!==null&&(n.heat=s),_(`/sessions/${e}/cheat`,n)}function de(e,s){const t=new EventSource(`${q}/sessions/${e}/stream`);return t.onmessage=n=>{try{const r=JSON.parse(n.data);s(r)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const I="https://github.com/mhughes72/fungame03";function B(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function n(){t.remove()}t.querySelector(".info-close").addEventListener("click",n),t.addEventListener("click",r=>{r.target===t&&n()}),document.addEventListener("keydown",function r(i){i.key==="Escape"&&(n(),document.removeEventListener("keydown",r))})}function G(){B("ABOUT",`
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
    <p><a class="info-link" href="${I}" target="_blank" rel="noopener">${I}</a></p>
  `)}function z(){B("HOW TO PLAY",`
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
  `)}function pe(e,s,t){e.innerHTML=`
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
          ${s.map(o=>`
            <label class="char-row" data-name="${o.name.toLowerCase()}">
              <input type="checkbox" value="${o.name}" />
              <span class="char-name">${o.name}</span>
              <span class="char-era">${o.era}</span>
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

        <div class="setup-toggles">
          <label class="setup-toggle">
            <input type="checkbox" id="toggle-commentator" checked />
            <span class="toggle-label">Commentator</span>
            <span class="toggle-desc">play-by-play after each round</span>
          </label>
          <label class="setup-toggle">
            <input type="checkbox" id="toggle-moderator" checked />
            <span class="toggle-label">Moderator</span>
            <span class="toggle-desc">AI steers debate at each break</span>
          </label>
        </div>

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
  `;const n=e.querySelectorAll("#char-list input[type=checkbox]"),r=e.querySelectorAll(".char-row"),i=e.querySelector("#char-no-results"),u=e.querySelector("#char-filter");u.addEventListener("input",()=>{const o=u.value.toLowerCase().trim();let b=0;r.forEach($=>{const S=!o||$.dataset.name.includes(o);$.style.display=S?"":"none",S&&b++}),i.style.display=b===0?"":"none"});const a=e.querySelector("#selection-hint"),l=e.querySelector("#start-btn"),m=e.querySelector("#setup-error");function d(){const o=[...n].filter(b=>b.checked).length;o<2?(a.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",a.classList.remove("hint-ok","hint-warn")):o>4?(a.textContent=`Too many — deselect ${o-4}`,a.classList.add("hint-warn"),a.classList.remove("hint-ok")):(a.textContent=`${o} selected`,a.classList.add("hint-ok"),a.classList.remove("hint-warn")),l.disabled=o<2||o>4}d(),n.forEach(o=>o.addEventListener("change",d));function c(){return{commentator:e.querySelector("#toggle-commentator").checked,moderator:e.querySelector("#toggle-moderator").checked}}l.addEventListener("click",()=>{const o=[...n].filter($=>$.checked).map($=>$.value),b=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";m.textContent="",t({characters:o,topic:b,...c()})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!l.disabled&&l.click()}),e.querySelector("#setup-about").addEventListener("click",G),e.querySelector("#setup-help").addEventListener("click",z);const h=e.querySelector("#dotd-card"),y={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let w=0;function v(o){const b=y[o.category]||"var(--text-dim)";h.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── DEBATE OF THE DAY ──</span>
        <span class="dotd-category" style="color:${b}">${o.category.toUpperCase()}</span>
      </div>
      <div class="dotd-cast">${o.characters.join(" · ")}</div>
      <div class="dotd-topic">${U(o.topic)}</div>
      <div class="dotd-tagline">${U(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Generate new one ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,h.querySelector("#dotd-start").addEventListener("click",()=>{t({characters:o.characters,topic:o.topic,...c()})}),h.querySelector("#dotd-new").addEventListener("click",()=>{w++,f(w)})}function f(o){h.innerHTML='<div class="dotd-loading">generating…</div>',R(o).then(v).catch(()=>{o===0?h.style.display="none":(w--,R(w).then(v).catch(()=>{h.style.display="none"}))})}return f(0),{showError(o){m.textContent=o}}}function U(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function L(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ue(e,s,t="",n,r=null,i=[]){return new Promise(u=>{const a=document.createElement("div");a.className="steer-drawer",a.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${L(t)}</div>`:""}

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
        ${s.map(o=>`
          <button
            class="style-item${o.style===e?" style-selected":""}"
            data-style="${L(o.style)}"
          >
            <span class="style-name">${L(o.style)}</span>
            <span class="style-desc">${L(o.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(n||document.body).appendChild(a);const m=a.querySelector("#steer-text-input"),d=a.querySelector("#evidence-query"),c=a.querySelector("#evidence-search"),h=a.querySelector("#evidence-preview");m.focus();let y=e,w="";async function v(){const o=d.value.trim();if(!(!o||!r)){c.disabled=!0,c.textContent="Searching…",h.style.display="none",w="";try{const b=await r(o);w=b.finding,h.style.display="block",h.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${L(b.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,h.querySelector("#evidence-accept").addEventListener("click",()=>{h.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${L(w)}</div>`}),h.querySelector("#evidence-discard").addEventListener("click",()=>{w="",h.style.display="none"})}catch(b){h.style.display="block",h.textContent=`Search failed: ${b.message}`}finally{c.disabled=!1,c.textContent="Search"}}}c.addEventListener("click",v),d.addEventListener("keydown",o=>{o.key==="Enter"&&v()}),a.querySelectorAll(".style-item").forEach(o=>{o.addEventListener("click",()=>{a.querySelectorAll(".style-item").forEach(b=>b.classList.remove("style-selected")),o.classList.add("style-selected"),y=o.dataset.style,f()})});function f(){const o=m.value.trim();a.remove(),u({text:o,style:y,evidence:w})}a.querySelector("#steer-submit").addEventListener("click",f),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),u(null)}),m.addEventListener("keydown",o=>{o.key==="Enter"&&f()})})}function N(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const D=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function me(e,s,t,n,r=null,i=null){return new Promise(u=>{var y,w;const a={};t.forEach(v=>{a[v]=0});const l=document.createElement("div");l.className="cheat-overlay",l.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${D[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(v=>`
            <div class="drink-row">
              <span class="drink-name">${N(v)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${N(v)}">−</button>
                <span class="drink-count" id="drink-count-${N(v.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${N(v)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="cheat-footer">
          ${r?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          ${i?'<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>':""}
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(l);const m=l.querySelector("#cheat-heat-slider"),d=l.querySelector("#cheat-heat-value");m.addEventListener("input",()=>{const v=parseInt(m.value,10);d.textContent=`${v} — ${D[v]}`}),l.querySelectorAll(".drink-btn").forEach(v=>{v.addEventListener("click",()=>{const f=v.dataset.name,o=v.classList.contains("drink-plus")?1:-1;a[f]=Math.max(0,(a[f]||0)+o);const b=f.replace(/ /g,"_"),$=l.querySelector(`#drink-count-${b}`);$&&($.textContent=a[f])})});function c(){l.remove(),u()}async function h(){const v=parseInt(m.value,10),f=Object.fromEntries(Object.entries(a).filter(([,b])=>b>0)),o=v!==s;try{await n(e,o?v:null,f)}catch(b){console.error("Cheat failed:",b)}c()}l.querySelector("#cheat-apply").addEventListener("click",h),l.querySelector("#cheat-close").addEventListener("click",c),(y=l.querySelector("#cheat-paper"))==null||y.addEventListener("click",()=>{c(),r()}),(w=l.querySelector("#cheat-podcast"))==null||w.addEventListener("click",()=>{c(),i()}),l.addEventListener("click",v=>{v.target===l&&c()})})}function he(e,s){e.innerHTML=s.map(a=>{const l=ve(a),m=ge(a);return`
      <div class="seat" id="seat-${F(a)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${l}" alt="${j(a)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${j(m)}</div>
        </div>
        <div class="seat-name">${j(be(a))}</div>
      </div>
    `}).join("");let t=null;function n(a){return e.querySelector(`#seat-${F(a)}`)}function r(){clearTimeout(t),e.querySelectorAll(".seat").forEach(a=>{a.classList.remove("seat-thinking","seat-speaking")})}function i(a){var l;r(),(l=n(a))==null||l.classList.add("seat-thinking")}function u(a){r();const l=n(a);l&&(l.classList.add("seat-speaking"),t=setTimeout(()=>l.classList.remove("seat-speaking"),3e3))}return{setThinking:i,setSpeaking:u,clearAll:r}}function ve(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ge(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function be(e){return e.split(" ").at(-1)}function F(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function j(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function fe(e,s,t,n,r,i){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${p(n)}</span>
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
  `;const u=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),l=e.querySelector("#sidebar"),m=e.querySelector("#left-col");let d="socratic",c=0,h=null,y=!1,w=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const f=he(u,t);O(l,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const S=document.createElement("div");S.id="debate-starting",S.className="debate-starting",S.innerHTML='<span class="debate-starting-text">Opening the bar</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>',a.appendChild(S)}function o(){var S;(S=a.querySelector("#debate-starting"))==null||S.remove()}function b({type:S,data:g}){switch(S){case"speaker":o(),f.setThinking(g.name),Le(a,g.name);break;case"message":o(),T(a),g.backchannel||f.setSpeaking(g.name),ye(a,g);break;case"bars":c=g.heat??c,xe(l,g.heat,g.concession_total??0);break;case"debug":{const E=g.data!=null?g.data:"",C=typeof E=="object"?`
`+Object.entries(E).map(([V,Z])=>`  ${V}: ${JSON.stringify(Z)}`).join(`
`):E?` — ${E}`:"";console.log(`[${g.channel}] ${g.label}${C}`);break}case"state":T(a),d=g.moderator_style,c=g.heat??c,v=g,O(l,{topic:n,...g});break;case"steer_needed":if(w)break;w=!0,d=g.current_style,g.drift_topic&&(x(a,`── DRIFT ── conversation has shifted to: ${g.drift_topic}`),x(a,`   original topic: ${n}`)),a.scrollTop=a.scrollHeight,ue(d,r,_e(v),m,i.searchEvidence,t).then(E=>{w=!1,E===null?M(a,v,t,$,s,i):(d=E.style,O(l,{topic:n,...v,moderator_style:E.style}),i.steer(s,E.text,E.style,E.evidence||"",E.drinks||{}).catch(C=>x(a,`Steer error: ${C.message}`)))});break;case"consensus":if(y)break;y=!0,h&&(h(),h=null),T(a),f.clearAll(),Se(a,g,{onNewTopic(E){i.newTopic(s,E).then(()=>{y=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=E,O(l,{topic:E,...v,moderator_style:d,points_of_agreement:[]}),f.clearAll(),h=i.openStream(s,b)}).catch(C=>x(a,`Error: ${C.message}`))},onQuit:$},v,s,i,t);break;case"game_over":if(y)break;y=!0,h&&(h(),h=null),T(a),f.clearAll(),M(a,g,t,$,s,i);break;case"bar_beat":o(),we(a,g.text);break;case"commentator":o(),$e(a,g.text);break;case"evidence":o(),Ee(a,g.finding);break;case"system":o(),x(a,g.text);break;case"error":o(),x(a,`⚠ ${g.text}`);break}}function $(){h&&h(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",G),e.querySelector("#help-btn").addEventListener("click",z),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const g=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=g?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{me(s,c,t,i.cheat,()=>P(s,i,t),()=>ke(s,i))}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(y){$();return}v.turn>0?(y=!0,h&&(h(),h=null),M(a,v,t,$,s,i)):$()}),h=i.openStream(s,b)}function ye(e,{role:s,name:t,content:n,backchannel:r}){const i=document.createElement("div");if(r)i.className="msg msg-bc",i.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${H(n)}</em>`;else if(s==="moderator")i.className="msg msg-moderator",i.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${H(n)}</div>`;else if(s==="user")i.className="msg msg-user",i.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${H(n)}</div>`;else{const u=`/portraits/${t.replace(/ /g,"_")}.png`,a=t.split(" ").map(l=>l[0]).join("").slice(0,2).toUpperCase();i.className="msg msg-philosopher",i.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${u}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(a)}</div></div><div class="msg-body"><div class="msg-name">${p(t)}</div><div class="msg-content">${H(n)}</div></div>`}k(e,i)}function we(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=H(s),k(e,t)}function x(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,k(e,t)}function $e(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${p(s)}</span>`,k(e,t)}function Ee(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,k(e,t)}function Se(e,{summary:s,points:t},{onNewTopic:n,onQuit:r},i={},u,a,l=[]){const m=document.createElement("div");m.className="consensus-panel",m.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(s)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(c=>`<li>${p(c)}</li>`).join("")}
      </ul>
    `:""}
    ${Y(i)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="newspaper-btn" id="consensus-paper">Read the morning paper 📰</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,k(e,m);const d=m.querySelector("#consensus-topic-input");d.focus(),m.querySelector("#consensus-continue").addEventListener("click",()=>{const c=d.value.trim();c&&n(c)}),d.addEventListener("keydown",c=>{if(c.key==="Enter"){const h=d.value.trim();h&&n(h)}}),m.querySelector("#consensus-end").addEventListener("click",r),m.querySelector("#consensus-paper").addEventListener("click",()=>P(u,a,l))}function M(e,s,t,n,r,i){var m;T(e);const u=document.createElement("div");u.className="game-over-panel";const a=s.turn||0,l=a?`${a} turn${a!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";u.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(l)}</div>
    ${Y(s)}
    <div class="game-over-actions">
      ${r?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,k(e,u),u.querySelector("#game-over-leave").addEventListener("click",n),r&&((m=u.querySelector("#game-over-paper"))==null||m.addEventListener("click",()=>P(r,i,t)))}async function ke(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(n){alert(`Podcast failed: ${n.message}`)}finally{t.remove()}}async function P(e,s,t=[]){const n=document.createElement("div");n.className="newspaper-overlay",n.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(n);let r;try{r=await s.fetchNewspaper(e)}catch(i){n.remove(),alert(`Could not print the paper: ${i.message}`);return}n.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${p(r.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${p(r.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${p(r.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${p(r.headline)}</div>
        <div class="newspaper-subhead">${p(r.subheadline)}</div>

        ${t.length?`
        <div class="newspaper-portrait-strip">
          ${t.map(i=>`
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/newspaper_portraits/${encodeURIComponent(i.replace(/ /g,"_"))}.png"
                   alt="${p(i)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${p(i)}</div>
            </div>
          `).join("")}
        </div>
        `:""}

        <div class="newspaper-columns">
          <div class="newspaper-main-col">
            <p class="newspaper-lede">${p(r.lede)}</p>
            <p class="newspaper-body">${p(r.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${p(r.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${p(r.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${p(r.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${p(r.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,n.querySelector("#newspaper-close").addEventListener("click",()=>n.remove()),n.addEventListener("click",i=>{i.target===n&&n.remove()}),n.querySelector("#newspaper-download").addEventListener("click",()=>{var a,l;const i=n.querySelector(".newspaper-modal").cloneNode(!0);i.querySelectorAll("img").forEach(m=>{m.src&&!m.src.startsWith("http")&&(m.src=window.location.origin+m.getAttribute("src"))}),(a=i.querySelector("#newspaper-close"))==null||a.remove(),(l=i.querySelector("#newspaper-download"))==null||l.remove();const u=window.open("","_blank");u.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${p(r.newspaper_name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IM+Fell+English:ital@0;1&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f2ebd4; font-family: Georgia, 'Times New Roman', serif; }

  .newspaper-modal {
    background: #f2ebd4; color: #1a1008;
    max-width: 760px; margin: 0 auto;
    padding: 2.5rem 2.5rem 2rem;
    font-family: Georgia, 'Times New Roman', serif;
  }
  .newspaper-masthead { text-align: center; margin-bottom: 0.6rem; }
  .newspaper-name {
    font-size: 2.4rem; font-weight: 900;
    font-family: 'IM Fell English', Georgia, serif;
    letter-spacing: 0.08em; line-height: 1; color: #0d0700; text-transform: uppercase;
  }
  .newspaper-meta {
    font-size: 0.72rem; color: #5a4020; letter-spacing: 0.06em;
    text-transform: uppercase; margin: 0.35rem 0 0.5rem;
  }
  .newspaper-meta-sep { margin: 0 0.5rem; color: #9a7040; }
  .newspaper-rule { border: none; border-top: 3px double #1a1008; margin: 0.4rem 0 0.8rem; }
  .newspaper-headline {
    font-size: 1.9rem; font-weight: 900;
    font-family: 'IM Fell English', Georgia, serif;
    line-height: 1.15; text-align: center; margin-bottom: 0.4rem;
    color: #0d0700; text-transform: uppercase; letter-spacing: 0.01em;
  }
  .newspaper-subhead {
    font-size: 1.0rem; font-style: italic; text-align: center; color: #3a2800;
    margin-bottom: 1rem; font-family: 'IM Fell English', Georgia, serif;
    border-top: 1px solid #8a6a20; border-bottom: 1px solid #8a6a20; padding: 0.3rem 0;
  }
  .newspaper-portrait-strip {
    display: flex; justify-content: center; gap: 1rem;
    margin: 0.75rem 0 1rem; padding: 0.5rem 0;
    border-top: 1px solid #8a6a20; border-bottom: 1px solid #8a6a20;
  }
  .newspaper-portrait-item { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
  .newspaper-portrait-img {
    width: 80px; height: 100px; object-fit: cover; object-position: top;
    filter: grayscale(100%) sepia(30%) contrast(1.1); border: 1px solid #8a6a20;
  }
  .newspaper-portrait-name {
    font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.08em;
    color: #3a2800; font-family: 'IM Fell English', Georgia, serif;
    text-align: center; max-width: 80px;
  }
  .newspaper-columns {
    display: grid; grid-template-columns: 1fr 220px; gap: 1.5rem;
    border-top: 2px solid #1a1008; padding-top: 0.9rem;
  }
  .newspaper-main-col { display: flex; flex-direction: column; gap: 0.75rem; }
  .newspaper-lede { font-size: 0.95rem; line-height: 1.7; font-weight: 600; color: #0d0700; }
  .newspaper-body { font-size: 0.88rem; line-height: 1.75; color: #1a1008; text-align: justify; }
  .newspaper-pullquote {
    border-left: 3px solid #8a6a20; border-right: 3px solid #8a6a20;
    padding: 0.6rem 1rem; text-align: center; margin: 0.5rem 0;
  }
  .newspaper-pullquote-text {
    font-size: 1.05rem; font-style: italic;
    font-family: 'IM Fell English', Georgia, serif; color: #2a1a00; line-height: 1.5;
  }
  .newspaper-pullquote-attr {
    font-size: 0.78rem; letter-spacing: 0.06em; text-transform: uppercase;
    color: #5a4020; margin-top: 0.35rem;
  }
  .newspaper-scandal-col { border-left: 2px solid #8a6a20; padding-left: 1rem; }
  .newspaper-scandal-head {
    font-size: 1.0rem; font-weight: 900; text-transform: uppercase;
    font-family: 'IM Fell English', Georgia, serif; color: #7a1008; line-height: 1.2; margin-bottom: 0.3rem;
  }
  .newspaper-scandal-rule { border: none; border-top: 2px solid #7a1008; margin-bottom: 0.5rem; }
  .newspaper-scandal-body { font-size: 0.84rem; line-height: 1.7; color: #1a1008; text-align: justify; }

  @page { size: A4 portrait; margin: 0.6cm; }
  @media print {
    html { zoom: 0.68; }
    body { margin: 0; }
    .newspaper-modal { max-width: 100%; padding: 0 0.5rem; }
    .newspaper-portrait-img { width: 60px; height: 76px; }
    .newspaper-portrait-strip { gap: 0.6rem; }
  }
</style>
</head><body>${i.outerHTML}</body></html>`),u.document.close(),u.addEventListener("load",()=>{u.focus(),u.print()})})}function Y(e){const{turn:s=0,heat:t=0,partial_agreements:n=[],points_of_agreement:r=[],remaining_disagreements:i=[]}=e;if(!s)return"";const u=K(t),a=Q(t),l="█".repeat(t),m="░".repeat(10-t);let d='<div class="report-stats">';return d+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,d+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${a}">${l}<span style="color:var(--text-dim)">${m}</span> ${u}</span>
  </div>`,r.length&&(d+='<div class="report-section-label">agreements reached</div>',d+=r.map(c=>`<div class="report-agree-item">✓ ${p(c)}</div>`).join("")),n.length&&(d+='<div class="report-section-label">alignments that formed</div>',d+=n.map(c=>`<div class="report-partial"><span class="report-partial-names">${p(c.participants.join(" + "))}</span> — <span class="report-partial-on">${p(c.on)}</span></div>`).join("")),i.length&&(d+='<div class="report-section-label">still unresolved</div>',d+=i.map(c=>typeof c=="object"&&c!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(c.topic)}</span>
          <span class="report-tension-stance">${p(c.participant_a)}: ${p(c.stance_a)}</span>
          <span class="report-tension-stance">${p(c.participant_b)}: ${p(c.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(c))}</div>`).join("")),d+="</div>",d}function Le(e,s){T(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,k(e,t)}function T(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function O(e,s){const{topic:t,turn:n=0,heat:r=0,concession_total:i=0,moderator_style:u="socratic",partial_agreements:a=[],points_of_agreement:l=[],remaining_disagreements:m=[]}=s;let d=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${n}</div>
  `;l.length&&(d+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${l.map(c=>`<div class="sb-agree-item">✓ ${p(c)}</div>`).join("")}
      </div>
    `),a.length&&(d+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${a.map(c=>`
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
      ${W(r,i)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(u)}</div>
    </div>
  `,e.innerHTML=d}function H(e){return p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function k(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function W(e,s){const t=Q(e),n=K(e),r="█".repeat(e),i="░".repeat(10-e),u=Math.min(s,10),a=Te(s),l="█".repeat(u),m="░".repeat(10-u),d=qe(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${r}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${t}">${n}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${a}">${l}</span><span class="sb-heat-empty">${m}</span>
      <span class="sb-heat-label" style="color:${a}">${d} (${s})</span>
    </div>
  `}function xe(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=W(s,t))}function Q(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function K(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Te(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function qe(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function _e(e,s){const{turn:t,heat:n,partial_agreements:r,remaining_disagreements:i,drift_topic:u}=e;if(!t)return"The debate is just getting started.";if(u)return`The conversation has drifted from the original topic toward ${u}.`;const a=r||[],l=i||[];if(a.length&&l.length){const d=a[0],c=l[0],h=d.participants.join(" and "),y=typeof c=="object"?c.topic:String(c);return`${h} are finding common ground, but the group remains divided on ${y}.`}if(a.length){const d=a[0];return`${d.participants.join(" and ")} are converging on ${d.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(l.length){const d=l[0];return typeof d=="object"?`${d.participant_a} and ${d.participant_b} are sharply divided over ${d.topic}.`:`The room is deadlocked — ${String(d)}.`}const m=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${m}.`}const A=document.querySelector("#app");async function J(){let e,s;try{[e,s]=await Promise.all([ee(),te()])}catch(n){A.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=pe(A,e,async({characters:n,topic:r,commentator:i=!0,moderator:u=!0})=>{try{const a=await se(n,r,i,u);Ce(a.session_id,n,r,s)}catch(a){t.showError(`Could not start session: ${a.message}`)}})}function Ce(e,s,t,n){fe(A,e,s,t,n,{steer:ae,cheat:le,deleteSession:ie,newTopic:re,openStream:de,searchEvidence:ne,fetchNewspaper:oe,exportPodcast:ce}),A.addEventListener("debate:quit",()=>J(),{once:!0})}J();
