(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const A="/api";async function j(e,s){const t=await fetch(`${A}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function oe(e){await fetch(`${A}${e}`,{method:"DELETE"})}async function ce(e=null){const s=e?`${A}/topics?level=${encodeURIComponent(e)}`:`${A}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function le(){const e=await fetch(`${A}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function de(){const e=await fetch(`${A}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function pe(){const e=await fetch(`${A}/features`);return e.ok?e.json():{}}async function ue(e,s,t=!0,n=!0,i=!1,r="university"){return j("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:n,diagrams_enabled:i,audience_level:r})}async function me(e,s,t,n="",i={}){return j(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:i})}async function ve(e){return j("/search",{query:e})}async function he(e,s){return j(`/sessions/${e}/new-topic`,{topic:s})}async function ge(e){return oe(`/sessions/${e}`)}async function be(e){return j(`/sessions/${e}/newspaper`,{})}async function fe(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const r=await s.json().catch(()=>({detail:s.statusText}));throw new Error(r.detail||s.statusText)}const t=await s.blob(),n=URL.createObjectURL(t),i=document.createElement("a");i.href=n,i.download="philosophers-bar-podcast.mp3",document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(n)}async function ye(e,s,t={}){const n={drinks:t};return s!==null&&(n.heat=s),j(`/sessions/${e}/cheat`,n)}function we(e,s){const t=new EventSource(`${A}/sessions/${e}/stream`);return t.onmessage=n=>{try{const i=JSON.parse(n.data);s(i)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const Q="https://github.com/mhughes72/fungame03";function X(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function n(){t.remove()}t.querySelector(".info-close").addEventListener("click",n),t.addEventListener("click",i=>{i.target===t&&n()}),document.addEventListener("keydown",function i(r){r.key==="Escape"&&(n(),document.removeEventListener("keydown",i))})}function Z(){X("ABOUT",`
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
    <p><a class="info-link" href="${Q}" target="_blank" rel="noopener">${Q}</a></p>
  `)}function ee(){X("HOW TO PLAY",`
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
  `)}function $e(e,s,t){e.innerHTML=`
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
            <label class="char-row"
              data-name="${o.name.toLowerCase()}"
              data-desc="${M(o.known_for)}"
              data-category="${M(o.category||"")}"
              data-portrait="${M(o.name.replace(/ /g,"_"))}">
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
          <label class="setup-toggle">
            <input type="checkbox" id="toggle-diagrams" />
            <span class="toggle-label">Diagrams</span>
            <span class="toggle-desc">characters produce supporting images <span class="toggle-wip">· work in progress</span></span>
          </label>
        </div>

        <div class="setup-audience">
          <span class="audience-label">Audience level</span>
          <div class="audience-options">
            <label class="audience-opt"><input type="radio" name="audience" value="grade5" /> Grade 5</label>
            <label class="audience-opt"><input type="radio" name="audience" value="highschool" /> High School</label>
            <label class="audience-opt"><input type="radio" name="audience" value="university" checked /> University</label>
            <label class="audience-opt"><input type="radio" name="audience" value="expert" /> Expert</label>
          </div>
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
  `;const n=e.querySelectorAll("#char-list input[type=checkbox]"),i=e.querySelectorAll(".char-row"),r=e.querySelector("#char-no-results"),c=e.querySelector("#char-filter");c.addEventListener("input",()=>{const o=c.value.toLowerCase().trim();let S=0;i.forEach(k=>{const T=!o||k.dataset.name.includes(o);k.style.display=T?"":"none",T&&S++}),r.style.display=S===0?"":"none"});const a=document.createElement("div");a.className="char-tooltip",a.style.display="none",document.body.appendChild(a);function m(o){const{desc:S,category:k,portrait:T}=o.currentTarget.dataset;if(!S)return;const _=`/portraits/${T}.png`;a.innerHTML=`
      <div class="tt-inner">
        <img class="tt-portrait" src="${_}" alt="" onerror="this.style.display='none'" />
        <div class="tt-body">
          ${k?`<span class="tt-category">${M(k)}</span>`:""}
          <span class="tt-desc">${M(S)}</span>
        </div>
      </div>`,a.style.display="block",u(o)}function u(o){const k=a.offsetWidth,T=a.offsetHeight;let _=o.clientX+14,C=o.clientY+14;_+k>window.innerWidth-14&&(_=o.clientX-k-14),C+T>window.innerHeight-14&&(C=o.clientY-T-14),a.style.left=_+"px",a.style.top=C+"px"}function l(){a.style.display="none"}i.forEach(o=>{o.addEventListener("mouseenter",m),o.addEventListener("mousemove",u),o.addEventListener("mouseleave",l)});const v=new MutationObserver(()=>{document.body.contains(e)||(a.remove(),v.disconnect())});v.observe(document.body,{childList:!0,subtree:!0});const p=e.querySelector("#selection-hint"),b=e.querySelector("#start-btn"),x=e.querySelector("#setup-error");function w(){const o=[...n].filter(S=>S.checked).length;o<2?(p.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",p.classList.remove("hint-ok","hint-warn")):o>4?(p.textContent=`Too many — deselect ${o-4}`,p.classList.add("hint-warn"),p.classList.remove("hint-ok")):(p.textContent=`${o} selected`,p.classList.add("hint-ok"),p.classList.remove("hint-warn")),b.disabled=o<2||o>4}w(),n.forEach(o=>o.addEventListener("change",w));function E(){const o=e.querySelector('input[name="audience"]:checked');return{commentator:e.querySelector("#toggle-commentator").checked,moderator:e.querySelector("#toggle-moderator").checked,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:o?o.value:"university"}}b.addEventListener("click",()=>{const o=[...n].filter(k=>k.checked).map(k=>k.value),S=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";x.textContent="",t({characters:o,topic:S,...E()})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!b.disabled&&b.click()}),e.querySelector("#setup-about").addEventListener("click",Z),e.querySelector("#setup-help").addEventListener("click",ee);const g=e.querySelector("#dotd-card"),L={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let f=[],$=null;function h(){const o=e.querySelector('input[name="audience"]:checked');return o?o.value:"university"}function y(o){return f.filter(S=>S.audience_level===o)}function q(o,S=null){if(!o.length)return null;const k=S?o.filter(C=>C.id!==S.id):o,T=k.length?k:o,_=[];for(const C of T)_.push(C),C.source==="curated"&&(_.push(C),_.push(C));return _[Math.floor(Math.random()*_.length)]}function D(o){$=o;const S=L[o.category]||"var(--text-dim)",k=o.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>';g.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── SUGGESTED DEBATE ──</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${S}">${o.category.toUpperCase()}</span>
          ${k}
        </span>
      </div>
      <div class="dotd-cast">${o.characters.join(" · ")}</div>
      <div class="dotd-topic">${M(o.topic)}</div>
      <div class="dotd-tagline">${M(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Next suggestion ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,g.querySelector("#dotd-start").addEventListener("click",()=>{t({characters:o.characters,topic:o.topic,...E()})}),g.querySelector("#dotd-new").addEventListener("click",()=>{const T=q(y(h()),$);T&&D(T)})}function I(){const o=q(y(h()));o?D(o):g.style.display="none"}return ce().then(o=>{f=o,I()}).catch(()=>{g.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(o=>{o.addEventListener("change",I)}),{showError(o){x.textContent=o}}}function M(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function O(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ee(e,s,t="",n,i=null,r=[]){return new Promise(c=>{const a=document.createElement("div");a.className="steer-drawer",a.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${O(t)}</div>`:""}

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
        ${s.map(g=>`
          <button
            class="style-item${g.style===e?" style-selected":""}"
            data-style="${O(g.style)}"
          >
            <span class="style-name">${O(g.style)}</span>
            <span class="style-desc">${O(g.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(n||document.body).appendChild(a);const u=a.querySelector("#steer-text-input"),l=a.querySelector("#evidence-query"),v=a.querySelector("#evidence-search"),p=a.querySelector("#evidence-preview");u.focus();let b=e,x="";async function w(){const g=l.value.trim();if(!(!g||!i)){v.disabled=!0,v.textContent="Searching…",p.style.display="none",x="";try{const L=await i(g);x=L.finding,p.style.display="block",p.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${O(L.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,p.querySelector("#evidence-accept").addEventListener("click",()=>{p.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${O(x)}</div>`}),p.querySelector("#evidence-discard").addEventListener("click",()=>{x="",p.style.display="none"})}catch(L){p.style.display="block",p.textContent=`Search failed: ${L.message}`}finally{v.disabled=!1,v.textContent="Search"}}}v.addEventListener("click",w),l.addEventListener("keydown",g=>{g.key==="Enter"&&w()}),a.querySelectorAll(".style-item").forEach(g=>{g.addEventListener("click",()=>{a.querySelectorAll(".style-item").forEach(L=>L.classList.remove("style-selected")),g.classList.add("style-selected"),b=g.dataset.style,E()})});function E(){const g=u.value.trim();a.remove(),c({text:g,style:b,evidence:x})}a.querySelector("#steer-submit").addEventListener("click",E),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),c(null)}),u.addEventListener("keydown",g=>{g.key==="Enter"&&E()})})}function G(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const K=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function Se(e,s,t,n,i=null,r=null,c=null,a=null){return new Promise(m=>{var w,E,g,L;const u={};t.forEach(f=>{u[f]=0});const l=document.createElement("div");l.className="cheat-overlay",l.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${K[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(f=>`
            <div class="drink-row">
              <span class="drink-name">${G(f)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${G(f)}">−</button>
                <span class="drink-count" id="drink-count-${G(f.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${G(f)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        ${i||r?`
        <div class="cheat-utils-row">
          ${i?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          ${r?'<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>':""}
        </div>`:""}

        ${a||c?`
        <div class="cheat-section-label">── END THE EVENING ──</div>
        <div class="cheat-end-row">
          ${a?'<button class="cheat-consensus-btn" id="cheat-consensus">Force Consensus ✓</button>':""}
          ${c?'<button class="cheat-end-btn" id="cheat-end">End Game ✕</button>':""}
        </div>`:""}

        <div class="cheat-footer">
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(l);const v=l.querySelector("#cheat-heat-slider"),p=l.querySelector("#cheat-heat-value");v.addEventListener("input",()=>{const f=parseInt(v.value,10);p.textContent=`${f} — ${K[f]}`}),l.querySelectorAll(".drink-btn").forEach(f=>{f.addEventListener("click",()=>{const $=f.dataset.name,h=f.classList.contains("drink-plus")?1:-1;u[$]=Math.max(0,(u[$]||0)+h);const y=$.replace(/ /g,"_"),q=l.querySelector(`#drink-count-${y}`);q&&(q.textContent=u[$])})});function b(){l.remove(),m()}async function x(){const f=parseInt(v.value,10),$=Object.fromEntries(Object.entries(u).filter(([,y])=>y>0)),h=f!==s;try{await n(e,h?f:null,$)}catch(y){console.error("Cheat failed:",y)}b()}l.querySelector("#cheat-apply").addEventListener("click",x),l.querySelector("#cheat-close").addEventListener("click",b),(w=l.querySelector("#cheat-paper"))==null||w.addEventListener("click",()=>{b(),i()}),(E=l.querySelector("#cheat-podcast"))==null||E.addEventListener("click",()=>{b(),r()}),(g=l.querySelector("#cheat-consensus"))==null||g.addEventListener("click",()=>{b(),a()}),(L=l.querySelector("#cheat-end"))==null||L.addEventListener("click",()=>{b(),c()}),l.addEventListener("click",f=>{f.target===l&&b()})})}function ke(e,s){e.innerHTML=s.map(a=>{const m=Le(a),u=xe(a);return`
      <div class="seat" id="seat-${J(a)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${m}" alt="${z(a)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${z(u)}</div>
        </div>
        <div class="seat-name">${z(Te(a))}</div>
      </div>
    `}).join("");let t=null;function n(a){return e.querySelector(`#seat-${J(a)}`)}function i(){clearTimeout(t),e.querySelectorAll(".seat").forEach(a=>{a.classList.remove("seat-thinking","seat-speaking")})}function r(a){var m;i(),(m=n(a))==null||m.classList.add("seat-thinking")}function c(a){i();const m=n(a);m&&(m.classList.add("seat-speaking"),t=setTimeout(()=>m.classList.remove("seat-speaking"),3e3))}return{setThinking:r,setSpeaking:c,clearAll:i}}function Le(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function xe(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function Te(e){return e.split(" ").at(-1)}function J(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function z(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function qe(e,s,t,n,i,r){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${d(n)}</span>
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
  `;const c=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),m=e.querySelector("#sidebar"),u=e.querySelector("#left-col");let l="socratic",v=0,p=null,b=!1,x=!1,w={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const E=ke(c,t);R(m,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const $=document.createElement("div");$.id="debate-starting",$.className="debate-starting",$.innerHTML='<span class="debate-starting-text">Opening the bar</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>',a.appendChild($)}function g(){var $;($=a.querySelector("#debate-starting"))==null||$.remove()}function L({type:$,data:h}){switch($){case"speaker":g(),E.setThinking(h.name),je(a,h.name);break;case"message":g(),N(a),h.backchannel||E.setSpeaking(h.name),_e(a,h);break;case"bars":v=h.heat??v,Pe(m,h.heat,h.concession_total??0);break;case"debug":{const y=h.data!=null?h.data:"",q=typeof y=="object"?`
`+Object.entries(y).map(([D,I])=>`  ${D}: ${JSON.stringify(I)}`).join(`
`):y?` — ${y}`:"";console.log(`[${h.channel}] ${h.label}${q}`);break}case"state":N(a),l=h.moderator_style,v=h.heat??v,w=h,R(m,{topic:n,...h});break;case"steer_needed":if(x)break;x=!0,l=h.current_style,h.drift_topic&&He(a,h.drift_topic,n),a.scrollTop=a.scrollHeight,Ee(l,i,De(w),u,r.searchEvidence,t).then(y=>{x=!1,y===null?B(a,w,t,f,s,r):(l=y.style,R(m,{topic:n,...w,moderator_style:y.style}),r.steer(s,y.text,y.style,y.evidence||"",y.drinks||{}).catch(q=>P(a,`Steer error: ${q.message}`)))});break;case"consensus":if(b)break;b=!0,p&&(p(),p=null),N(a),E.clearAll(),V(a,h,{onNewTopic(y){r.newTopic(s,y).then(()=>{b=!1,w={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=y,R(m,{topic:y,...w,moderator_style:l,points_of_agreement:[]}),E.clearAll(),p=r.openStream(s,L)}).catch(q=>P(a,`Error: ${q.message}`))},onQuit:f},w,s,r,t);break;case"game_over":if(b)break;b=!0,p&&(p(),p=null),N(a),E.clearAll(),B(a,{...w,...h},t,f,s,r);break;case"bar_beat":g(),Ce(a,h.text);break;case"commentator":g(),Ne(a,h.text);break;case"evidence":g(),Ae(a,h.finding);break;case"diagram":g(),Me(a,h);break;case"system":g(),P(a,h.text);break;case"error":g(),P(a,`⚠ ${h.text}`);break}}function f(){p&&p(),r.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",Z),e.querySelector("#help-btn").addEventListener("click",ee),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const h=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=h?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{b||Se(s,v,t,r.cheat,()=>Y(s,r,t),()=>Oe(s,r),()=>{b=!0,p&&(p(),p=null),N(a),E.clearAll(),B(a,w,t,f,s,r)},()=>{b=!0,p&&(p(),p=null),N(a),E.clearAll(),V(a,{summary:"The bar has called it — the evening ends in agreement.",points:w.points_of_agreement||[]},{onNewTopic($){r.newTopic(s,$).then(()=>{b=!1,w={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=$,R(m,{topic:$,...w,moderator_style:l,points_of_agreement:[]}),E.clearAll(),p=r.openStream(s,L)}).catch(h=>P(a,`Error: ${h.message}`))},onQuit:f},w,s,r,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(b){f();return}w.turn>0?(b=!0,p&&(p(),p=null),B(a,w,t,f,s,r)):f()}),p=r.openStream(s,L)}function _e(e,{role:s,name:t,content:n,backchannel:i}){const r=document.createElement("div");if(i)r.className="msg msg-bc",r.innerHTML=`<span class="bc-name">${d(t)}:</span> <em>${U(n)}</em>`;else if(s==="moderator")r.className="msg msg-moderator",r.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${U(n)}</div>`;else if(s==="user")r.className="msg msg-user",r.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${U(n)}</div>`;else{const c=`/portraits/${t.replace(/ /g,"_")}.png`,a=t.split(" ").map(m=>m[0]).join("").slice(0,2).toUpperCase();r.className="msg msg-philosopher",r.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${c}" alt="${d(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${d(a)}</div></div><div class="msg-body"><div class="msg-name">${d(t)}</div><div class="msg-content">${U(n)}</div></div>`}H(e,r)}function Ce(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=U(s),H(e,t)}function P(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,H(e,t)}function He(e,s,t){const n=document.createElement("div");n.className="msg msg-drift",n.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${d(s)}</div><div class="drift-orig">original: ${d(t)}</div>`,H(e,n)}function Ne(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${d(s)}</span>`,H(e,t)}function Ae(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${d(s)}`,H(e,t)}function Me(e,{speaker:s,title:t,thumb_url:n,url:i,page_url:r}){const c=document.createElement("div");c.className="msg msg-diagram",c.innerHTML=`<div class="diagram-label">${d(s)} produces a diagram</div><a class="diagram-link" href="${d(r)}" target="_blank" rel="noopener"><img class="diagram-img" src="${d(n)}" alt="${d(t)}" /><div class="diagram-caption">${d(t)}</div></a>`,H(e,c)}function V(e,{summary:s,points:t},{onNewTopic:n,onQuit:i},r={},c,a,m=[]){var v;const u=document.createElement("div");u.className="end-panel",u.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${d(s)}</blockquote>
    ${te(r)}
    ${se(t,r)}
    <div class="end-actions">
      <div class="end-new-topic-row">
        <input class="end-topic-input" id="consensus-topic-input" type="text" placeholder="New topic…" autocomplete="off" />
        <button class="end-continue-btn" id="consensus-continue">Continue ▶</button>
      </div>
      <div class="end-btn-row">
        ${c?'<button class="end-paper-btn" id="consensus-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="consensus-end">End the evening</button>
      </div>
    </div>
  `,H(e,u);const l=u.querySelector("#consensus-topic-input");l.focus(),u.querySelector("#consensus-continue").addEventListener("click",()=>{const p=l.value.trim();p&&n(p)}),l.addEventListener("keydown",p=>{if(p.key==="Enter"){const b=l.value.trim();b&&n(b)}}),u.querySelector("#consensus-end").addEventListener("click",i),(v=u.querySelector("#consensus-paper"))==null||v.addEventListener("click",()=>Y(c,a,m))}function B(e,s,t,n,i,r){var u;N(e);const c=document.createElement("div");c.className="end-panel";const a=s.turn||0,m=a?`${a} turn${a!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";c.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${d(m)}</blockquote>
    ${te(s)}
    ${se([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${i?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,H(e,c),c.querySelector("#game-over-leave").addEventListener("click",n),(u=c.querySelector("#game-over-paper"))==null||u.addEventListener("click",()=>Y(i,r,t))}async function Oe(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(n){alert(`Podcast failed: ${n.message}`)}finally{t.remove()}}async function Y(e,s,t=[]){const n=document.createElement("div");n.className="newspaper-overlay",n.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(n);let i;try{i=await s.fetchNewspaper(e)}catch(r){n.remove(),alert(`Could not print the paper: ${r.message}`);return}n.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${d(i.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${d(i.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${d(i.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${d(i.headline)}</div>
        <div class="newspaper-subhead">${d(i.subheadline)}</div>

        ${t.length?`
        <div class="newspaper-portrait-strip">
          ${t.map(r=>`
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/newspaper_portraits/${encodeURIComponent(r.replace(/ /g,"_"))}.png"
                   alt="${d(r)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${d(r)}</div>
            </div>
          `).join("")}
        </div>
        `:""}

        <div class="newspaper-columns">
          <div class="newspaper-main-col">
            <p class="newspaper-lede">${d(i.lede)}</p>
            <p class="newspaper-body">${d(i.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${d(i.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${d(i.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${d(i.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${d(i.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,n.querySelector("#newspaper-close").addEventListener("click",()=>n.remove()),n.addEventListener("click",r=>{r.target===n&&n.remove()}),n.querySelector("#newspaper-download").addEventListener("click",()=>{var a,m;const r=n.querySelector(".newspaper-modal").cloneNode(!0);r.querySelectorAll("img").forEach(u=>{u.src&&!u.src.startsWith("http")&&(u.src=window.location.origin+u.getAttribute("src"))}),(a=r.querySelector("#newspaper-close"))==null||a.remove(),(m=r.querySelector("#newspaper-download"))==null||m.remove();const c=window.open("","_blank");c.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${d(i.newspaper_name)}</title>
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
</head><body>${r.outerHTML}</body></html>`),c.document.close(),c.addEventListener("load",()=>{c.focus(),c.print()})})}function te(e){const{turn:s=0,heat:t=0,concession_total:n=0}=e;if(!s)return"";const i=ne(t),r=re(t);return`
    <div class="end-scoreboard">
      <div class="end-stat">
        <span class="end-stat-num">${s}</span>
        <span class="end-stat-lbl">turns</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num" style="color:${i}">${t}<span class="end-stat-denom">/10</span></span>
        <span class="end-stat-lbl">${r}</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num">${n}</span>
        <span class="end-stat-lbl">concessions</span>
      </div>
    </div>
  `}function se(e,s){const{partial_agreements:t=[],points_of_agreement:n=[],remaining_disagreements:i=[]}=s,r=[...new Set([...e,...n])];let c="";return r.length&&(c+=`<div class="end-section end-section-agree">
      <div class="end-section-label">agreements reached</div>
      ${r.map(a=>`<div class="end-item-agree">✓ ${d(a)}</div>`).join("")}
    </div>`),t.length&&(c+=`<div class="end-section end-section-partial">
      <div class="end-section-label">alignments that formed</div>
      ${t.map(a=>`<div class="end-partial">
          <span class="end-partial-names">${d(a.participants.join(" + "))}</span>
          <span class="end-partial-on">${d(a.on)}</span>
        </div>`).join("")}
    </div>`),i.length&&(c+=`<div class="end-section end-section-tension">
      <div class="end-section-label">still unresolved</div>
      ${i.map(a=>typeof a=="object"&&a!==null?`<div class="end-tension">
            <span class="end-tension-topic">${d(a.topic)}</span>
            <span class="end-tension-stances">${d(a.participant_a)}: ${d(a.stance_a)} · ${d(a.participant_b)}: ${d(a.stance_b)}</span>
          </div>`:`<div class="end-tension">${d(String(a))}</div>`).join("")}
    </div>`),c}function je(e,s){N(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${d(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,H(e,t)}function N(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function R(e,s){const{topic:t,turn:n=0,heat:i=0,concession_total:r=0,moderator_style:c="socratic",partial_agreements:a=[],points_of_agreement:m=[],remaining_disagreements:u=[]}=s;let l=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${d(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${n}</div>
  `;m.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${m.map(v=>`<div class="sb-agree-item">✓ ${d(v)}</div>`).join("")}
      </div>
    `),a.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${a.map(v=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${d(v.participants.join(" + "))}</div>
            <div class="sb-partial-on">${d(v.on)}</div>
          </div>
        `).join("")}
      </div>
    `),u.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${u.map(v=>typeof v=="object"&&v!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${d(v.topic)}</div>
                <div class="sb-tension-stance">${d(v.participant_a)}: ${d(v.stance_a)}</div>
                <div class="sb-tension-stance">${d(v.participant_b)}: ${d(v.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${d(String(v))}</div>`).join("")}
      </div>
    `),l+=`
    <div class="sb-section" id="sb-bars">
      ${ae(i,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${d(c)}</div>
    </div>
  `,e.innerHTML=l}function U(e){return d(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function H(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ae(e,s){const t=ne(e),n=re(e),i="█".repeat(e),r="░".repeat(10-e),c=Math.min(s,10),a=Re(s),m="█".repeat(c),u="░".repeat(10-c),l=Ue(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${i}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${n}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${a}">${m}</span><span class="sb-heat-empty">${u}</span>
      <span class="sb-heat-label" style="color:${a}">${l} (${s})</span>
    </div>
  `}function Pe(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=ae(s,t))}function ne(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function re(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Re(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Ue(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function De(e,s){const{turn:t,heat:n,partial_agreements:i,remaining_disagreements:r,drift_topic:c}=e;if(!t)return"The debate is just getting started.";if(c)return`The conversation has drifted from the original topic toward ${c}.`;const a=i||[],m=r||[];if(a.length&&m.length){const l=a[0],v=m[0],p=l.participants.join(" and "),b=typeof v=="object"?v.topic:String(v);return`${p} are finding common ground, but the group remains divided on ${b}.`}if(a.length){const l=a[0];return`${l.participants.join(" and ")} are converging on ${l.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(m.length){const l=m[0];return typeof l=="object"?`${l.participant_a} and ${l.participant_b} are sharply divided over ${l.topic}.`:`The room is deadlocked — ${String(l)}.`}const u=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${u}.`}const F=document.querySelector("#app");let W={};async function ie(){let e,s;try{[e,s,W]=await Promise.all([le(),de(),pe()])}catch(n){F.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=$e(F,e,async({characters:n,topic:i,commentator:r=!0,moderator:c=!0,diagrams:a=!1,audienceLevel:m="university"})=>{try{const u=await ue(n,i,r,c,a,m);Ie(u.session_id,n,i,s)}catch(u){t.showError(`Could not start session: ${u.message}`)}})}function Ie(e,s,t,n){qe(F,e,s,t,n,{steer:me,cheat:ye,deleteSession:ge,newTopic:he,openStream:we,searchEvidence:ve,fetchNewspaper:be,exportPodcast:W.podcast?fe:null,isLocal:!!W.local}),F.addEventListener("debate:quit",()=>ie(),{once:!0})}ie();
