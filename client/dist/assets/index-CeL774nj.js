(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const p of i.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&n(p)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const N="/api";async function P(e,s){const t=await fetch(`${N}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function re(e){await fetch(`${N}${e}`,{method:"DELETE"})}async function ie(e=null){const s=e?`${N}/topics?level=${encodeURIComponent(e)}`:`${N}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function oe(){const e=await fetch(`${N}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function ce(){const e=await fetch(`${N}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function le(){const e=await fetch(`${N}/features`);return e.ok?e.json():{}}async function de(e,s,t=!0,n=!0,r=!1,i="university"){return P("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:n,diagrams_enabled:r,audience_level:i})}async function pe(e,s,t,n="",r={}){return P(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:r})}async function ue(e){return P("/search",{query:e})}async function me(e,s){return P(`/sessions/${e}/new-topic`,{topic:s})}async function ve(e){return re(`/sessions/${e}`)}async function he(e){return P(`/sessions/${e}/newspaper`,{})}async function ge(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const i=await s.json().catch(()=>({detail:s.statusText}));throw new Error(i.detail||s.statusText)}const t=await s.blob(),n=URL.createObjectURL(t),r=document.createElement("a");r.href=n,r.download="philosophers-bar-podcast.mp3",document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(n)}async function be(e,s,t={}){const n={drinks:t};return s!==null&&(n.heat=s),P(`/sessions/${e}/cheat`,n)}function fe(e,s){const t=new EventSource(`${N}/sessions/${e}/stream`);return t.onmessage=n=>{try{const r=JSON.parse(n.data);s(r)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const Y="https://github.com/mhughes72/fungame03";function J(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function n(){t.remove()}t.querySelector(".info-close").addEventListener("click",n),t.addEventListener("click",r=>{r.target===t&&n()}),document.addEventListener("keydown",function r(i){i.key==="Escape"&&(n(),document.removeEventListener("keydown",r))})}function V(){J("ABOUT",`
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
    <p><a class="info-link" href="${Y}" target="_blank" rel="noopener">${Y}</a></p>
  `)}function X(){J("HOW TO PLAY",`
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
  `)}function ye(e,s,t){e.innerHTML=`
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
              data-desc="${A(o.known_for)}"
              data-category="${A(o.category||"")}"
              data-portrait="${A(o.name.replace(/ /g,"_"))}">
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
  `;const n=e.querySelectorAll("#char-list input[type=checkbox]"),r=e.querySelectorAll(".char-row"),i=e.querySelector("#char-no-results"),p=e.querySelector("#char-filter");p.addEventListener("input",()=>{const o=p.value.toLowerCase().trim();let E=0;r.forEach(S=>{const T=!o||S.dataset.name.includes(o);S.style.display=T?"":"none",T&&E++}),i.style.display=E===0?"":"none"});const a=document.createElement("div");a.className="char-tooltip",a.style.display="none",document.body.appendChild(a);function l(o){const{desc:E,category:S,portrait:T}=o.currentTarget.dataset;if(!E)return;const q=`/portraits/${T}.png`;a.innerHTML=`
      <div class="tt-inner">
        <img class="tt-portrait" src="${q}" alt="" onerror="this.style.display='none'" />
        <div class="tt-body">
          ${S?`<span class="tt-category">${A(S)}</span>`:""}
          <span class="tt-desc">${A(E)}</span>
        </div>
      </div>`,a.style.display="block",m(o)}function m(o){const S=a.offsetWidth,T=a.offsetHeight;let q=o.clientX+14,_=o.clientY+14;q+S>window.innerWidth-14&&(q=o.clientX-S-14),_+T>window.innerHeight-14&&(_=o.clientY-T-14),a.style.left=q+"px",a.style.top=_+"px"}function u(){a.style.display="none"}r.forEach(o=>{o.addEventListener("mouseenter",l),o.addEventListener("mousemove",m),o.addEventListener("mouseleave",u)});const c=new MutationObserver(()=>{document.body.contains(e)||(a.remove(),c.disconnect())});c.observe(document.body,{childList:!0,subtree:!0});const v=e.querySelector("#selection-hint"),f=e.querySelector("#start-btn"),k=e.querySelector("#setup-error");function g(){const o=[...n].filter(E=>E.checked).length;o<2?(v.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",v.classList.remove("hint-ok","hint-warn")):o>4?(v.textContent=`Too many — deselect ${o-4}`,v.classList.add("hint-warn"),v.classList.remove("hint-ok")):(v.textContent=`${o} selected`,v.classList.add("hint-ok"),v.classList.remove("hint-warn")),f.disabled=o<2||o>4}g(),n.forEach(o=>o.addEventListener("change",g));function y(){const o=e.querySelector('input[name="audience"]:checked');return{commentator:e.querySelector("#toggle-commentator").checked,moderator:e.querySelector("#toggle-moderator").checked,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:o?o.value:"university"}}f.addEventListener("click",()=>{const o=[...n].filter(S=>S.checked).map(S=>S.value),E=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";k.textContent="",t({characters:o,topic:E,...y()})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!f.disabled&&f.click()}),e.querySelector("#setup-about").addEventListener("click",V),e.querySelector("#setup-help").addEventListener("click",X);const h=e.querySelector("#dotd-card"),$={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let x=[],L=null;function b(){const o=e.querySelector('input[name="audience"]:checked');return o?o.value:"university"}function w(o){return x.filter(E=>E.audience_level===o)}function H(o,E=null){if(!o.length)return null;const S=E?o.filter(_=>_.id!==E.id):o,T=S.length?S:o,q=[];for(const _ of T)q.push(_),_.source==="curated"&&(q.push(_),q.push(_));return q[Math.floor(Math.random()*q.length)]}function U(o){L=o;const E=$[o.category]||"var(--text-dim)",S=o.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>';h.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── SUGGESTED DEBATE ──</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${E}">${o.category.toUpperCase()}</span>
          ${S}
        </span>
      </div>
      <div class="dotd-cast">${o.characters.join(" · ")}</div>
      <div class="dotd-topic">${A(o.topic)}</div>
      <div class="dotd-tagline">${A(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Next suggestion ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,h.querySelector("#dotd-start").addEventListener("click",()=>{t({characters:o.characters,topic:o.topic,...y()})}),h.querySelector("#dotd-new").addEventListener("click",()=>{const T=H(w(b()),L);T&&U(T)})}function I(){const o=H(w(b()));o?U(o):h.style.display="none"}return ie().then(o=>{x=o,I()}).catch(()=>{h.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(o=>{o.addEventListener("change",I)}),{showError(o){k.textContent=o}}}function A(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function j(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function we(e,s,t="",n,r=null,i=[]){return new Promise(p=>{const a=document.createElement("div");a.className="steer-drawer",a.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${j(t)}</div>`:""}

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
        ${s.map(h=>`
          <button
            class="style-item${h.style===e?" style-selected":""}"
            data-style="${j(h.style)}"
          >
            <span class="style-name">${j(h.style)}</span>
            <span class="style-desc">${j(h.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(n||document.body).appendChild(a);const m=a.querySelector("#steer-text-input"),u=a.querySelector("#evidence-query"),c=a.querySelector("#evidence-search"),v=a.querySelector("#evidence-preview");m.focus();let f=e,k="";async function g(){const h=u.value.trim();if(!(!h||!r)){c.disabled=!0,c.textContent="Searching…",v.style.display="none",k="";try{const $=await r(h);k=$.finding,v.style.display="block",v.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${j($.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,v.querySelector("#evidence-accept").addEventListener("click",()=>{v.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${j(k)}</div>`}),v.querySelector("#evidence-discard").addEventListener("click",()=>{k="",v.style.display="none"})}catch($){v.style.display="block",v.textContent=`Search failed: ${$.message}`}finally{c.disabled=!1,c.textContent="Search"}}}c.addEventListener("click",g),u.addEventListener("keydown",h=>{h.key==="Enter"&&g()}),a.querySelectorAll(".style-item").forEach(h=>{h.addEventListener("click",()=>{a.querySelectorAll(".style-item").forEach($=>$.classList.remove("style-selected")),h.classList.add("style-selected"),f=h.dataset.style,y()})});function y(){const h=m.value.trim();a.remove(),p({text:h,style:f,evidence:k})}a.querySelector("#steer-submit").addEventListener("click",y),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),p(null)}),m.addEventListener("keydown",h=>{h.key==="Enter"&&y()})})}function F(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Q=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function $e(e,s,t,n,r=null,i=null){return new Promise(p=>{var f,k;const a={};t.forEach(g=>{a[g]=0});const l=document.createElement("div");l.className="cheat-overlay",l.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${Q[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(g=>`
            <div class="drink-row">
              <span class="drink-name">${F(g)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${F(g)}">−</button>
                <span class="drink-count" id="drink-count-${F(g.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${F(g)}">+</button>
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
    `,document.body.appendChild(l);const m=l.querySelector("#cheat-heat-slider"),u=l.querySelector("#cheat-heat-value");m.addEventListener("input",()=>{const g=parseInt(m.value,10);u.textContent=`${g} — ${Q[g]}`}),l.querySelectorAll(".drink-btn").forEach(g=>{g.addEventListener("click",()=>{const y=g.dataset.name,h=g.classList.contains("drink-plus")?1:-1;a[y]=Math.max(0,(a[y]||0)+h);const $=y.replace(/ /g,"_"),x=l.querySelector(`#drink-count-${$}`);x&&(x.textContent=a[y])})});function c(){l.remove(),p()}async function v(){const g=parseInt(m.value,10),y=Object.fromEntries(Object.entries(a).filter(([,$])=>$>0)),h=g!==s;try{await n(e,h?g:null,y)}catch($){console.error("Cheat failed:",$)}c()}l.querySelector("#cheat-apply").addEventListener("click",v),l.querySelector("#cheat-close").addEventListener("click",c),(f=l.querySelector("#cheat-paper"))==null||f.addEventListener("click",()=>{c(),r()}),(k=l.querySelector("#cheat-podcast"))==null||k.addEventListener("click",()=>{c(),i()}),l.addEventListener("click",g=>{g.target===l&&c()})})}function Ee(e,s){e.innerHTML=s.map(a=>{const l=Se(a),m=ke(a);return`
      <div class="seat" id="seat-${K(a)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${l}" alt="${B(a)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${B(m)}</div>
        </div>
        <div class="seat-name">${B(Le(a))}</div>
      </div>
    `}).join("");let t=null;function n(a){return e.querySelector(`#seat-${K(a)}`)}function r(){clearTimeout(t),e.querySelectorAll(".seat").forEach(a=>{a.classList.remove("seat-thinking","seat-speaking")})}function i(a){var l;r(),(l=n(a))==null||l.classList.add("seat-thinking")}function p(a){r();const l=n(a);l&&(l.classList.add("seat-speaking"),t=setTimeout(()=>l.classList.remove("seat-speaking"),3e3))}return{setThinking:i,setSpeaking:p,clearAll:r}}function Se(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ke(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function Le(e){return e.split(" ").at(-1)}function K(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function B(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function xe(e,s,t,n,r,i){e.innerHTML=`
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
  `;const p=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),l=e.querySelector("#sidebar"),m=e.querySelector("#left-col");let u="socratic",c=0,v=null,f=!1,k=!1,g={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const y=Ee(p,t);D(l,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const L=document.createElement("div");L.id="debate-starting",L.className="debate-starting",L.innerHTML='<span class="debate-starting-text">Opening the bar</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>',a.appendChild(L)}function h(){var L;(L=a.querySelector("#debate-starting"))==null||L.remove()}function $({type:L,data:b}){switch(L){case"speaker":h(),y.setThinking(b.name),je(a,b.name);break;case"message":h(),O(a),b.backchannel||y.setSpeaking(b.name),Te(a,b);break;case"bars":c=b.heat??c,Me(l,b.heat,b.concession_total??0);break;case"debug":{const w=b.data!=null?b.data:"",H=typeof w=="object"?`
`+Object.entries(w).map(([U,I])=>`  ${U}: ${JSON.stringify(I)}`).join(`
`):w?` — ${w}`:"";console.log(`[${b.channel}] ${b.label}${H}`);break}case"state":O(a),u=b.moderator_style,c=b.heat??c,g=b,D(l,{topic:n,...b});break;case"steer_needed":if(k)break;k=!0,u=b.current_style,b.drift_topic&&(M(a,`── DRIFT ── conversation has shifted to: ${b.drift_topic}`),M(a,`   original topic: ${n}`)),a.scrollTop=a.scrollHeight,we(u,r,Re(g),m,i.searchEvidence,t).then(w=>{k=!1,w===null?z(a,g,t,x,s,i):(u=w.style,D(l,{topic:n,...g,moderator_style:w.style}),i.steer(s,w.text,w.style,w.evidence||"",w.drinks||{}).catch(H=>M(a,`Steer error: ${H.message}`)))});break;case"consensus":if(f)break;f=!0,v&&(v(),v=null),O(a),y.clearAll(),Ne(a,b,{onNewTopic(w){i.newTopic(s,w).then(()=>{f=!1,g={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=w,D(l,{topic:w,...g,moderator_style:u,points_of_agreement:[]}),y.clearAll(),v=i.openStream(s,$)}).catch(H=>M(a,`Error: ${H.message}`))},onQuit:x},g,s,i,t);break;case"game_over":if(f)break;f=!0,v&&(v(),v=null),O(a),y.clearAll(),z(a,b,t,x,s,i);break;case"bar_beat":h(),qe(a,b.text);break;case"commentator":h(),_e(a,b.text);break;case"evidence":h(),Ce(a,b.finding);break;case"diagram":h(),He(a,b);break;case"system":h(),M(a,b.text);break;case"error":h(),M(a,`⚠ ${b.text}`);break}}function x(){v&&v(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",V),e.querySelector("#help-btn").addEventListener("click",X),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const b=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=b?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{$e(s,c,t,i.cheat,()=>W(s,i,t),()=>Ae(s,i))}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(f){x();return}g.turn>0?(f=!0,v&&(v(),v=null),z(a,g,t,x,s,i)):x()}),v=i.openStream(s,$)}function Te(e,{role:s,name:t,content:n,backchannel:r}){const i=document.createElement("div");if(r)i.className="msg msg-bc",i.innerHTML=`<span class="bc-name">${d(t)}:</span> <em>${R(n)}</em>`;else if(s==="moderator")i.className="msg msg-moderator",i.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${R(n)}</div>`;else if(s==="user")i.className="msg msg-user",i.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${R(n)}</div>`;else{const p=`/portraits/${t.replace(/ /g,"_")}.png`,a=t.split(" ").map(l=>l[0]).join("").slice(0,2).toUpperCase();i.className="msg msg-philosopher",i.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${p}" alt="${d(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${d(a)}</div></div><div class="msg-body"><div class="msg-name">${d(t)}</div><div class="msg-content">${R(n)}</div></div>`}C(e,i)}function qe(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=R(s),C(e,t)}function M(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,C(e,t)}function _e(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${d(s)}</span>`,C(e,t)}function Ce(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${d(s)}`,C(e,t)}function He(e,{speaker:s,title:t,thumb_url:n,url:r,page_url:i}){const p=document.createElement("div");p.className="msg msg-diagram",p.innerHTML=`<div class="diagram-label">${d(s)} produces a diagram</div><a class="diagram-link" href="${d(i)}" target="_blank" rel="noopener"><img class="diagram-img" src="${d(n)}" alt="${d(t)}" /><div class="diagram-caption">${d(t)}</div></a>`,C(e,p)}function Ne(e,{summary:s,points:t},{onNewTopic:n,onQuit:r},i={},p,a,l=[]){const m=document.createElement("div");m.className="consensus-panel",m.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${d(s)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(c=>`<li>${d(c)}</li>`).join("")}
      </ul>
    `:""}
    ${Z(i)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="newspaper-btn" id="consensus-paper">Read the morning paper 📰</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,C(e,m);const u=m.querySelector("#consensus-topic-input");u.focus(),m.querySelector("#consensus-continue").addEventListener("click",()=>{const c=u.value.trim();c&&n(c)}),u.addEventListener("keydown",c=>{if(c.key==="Enter"){const v=u.value.trim();v&&n(v)}}),m.querySelector("#consensus-end").addEventListener("click",r),m.querySelector("#consensus-paper").addEventListener("click",()=>W(p,a,l))}function z(e,s,t,n,r,i){var m;O(e);const p=document.createElement("div");p.className="game-over-panel";const a=s.turn||0,l=a?`${a} turn${a!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";p.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${d(l)}</div>
    ${Z(s)}
    <div class="game-over-actions">
      ${r?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,C(e,p),p.querySelector("#game-over-leave").addEventListener("click",n),r&&((m=p.querySelector("#game-over-paper"))==null||m.addEventListener("click",()=>W(r,i,t)))}async function Ae(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(n){alert(`Podcast failed: ${n.message}`)}finally{t.remove()}}async function W(e,s,t=[]){const n=document.createElement("div");n.className="newspaper-overlay",n.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(n);let r;try{r=await s.fetchNewspaper(e)}catch(i){n.remove(),alert(`Could not print the paper: ${i.message}`);return}n.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${d(r.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${d(r.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${d(r.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${d(r.headline)}</div>
        <div class="newspaper-subhead">${d(r.subheadline)}</div>

        ${t.length?`
        <div class="newspaper-portrait-strip">
          ${t.map(i=>`
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/newspaper_portraits/${encodeURIComponent(i.replace(/ /g,"_"))}.png"
                   alt="${d(i)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${d(i)}</div>
            </div>
          `).join("")}
        </div>
        `:""}

        <div class="newspaper-columns">
          <div class="newspaper-main-col">
            <p class="newspaper-lede">${d(r.lede)}</p>
            <p class="newspaper-body">${d(r.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${d(r.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${d(r.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${d(r.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${d(r.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,n.querySelector("#newspaper-close").addEventListener("click",()=>n.remove()),n.addEventListener("click",i=>{i.target===n&&n.remove()}),n.querySelector("#newspaper-download").addEventListener("click",()=>{var a,l;const i=n.querySelector(".newspaper-modal").cloneNode(!0);i.querySelectorAll("img").forEach(m=>{m.src&&!m.src.startsWith("http")&&(m.src=window.location.origin+m.getAttribute("src"))}),(a=i.querySelector("#newspaper-close"))==null||a.remove(),(l=i.querySelector("#newspaper-download"))==null||l.remove();const p=window.open("","_blank");p.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${d(r.newspaper_name)}</title>
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
</head><body>${i.outerHTML}</body></html>`),p.document.close(),p.addEventListener("load",()=>{p.focus(),p.print()})})}function Z(e){const{turn:s=0,heat:t=0,partial_agreements:n=[],points_of_agreement:r=[],remaining_disagreements:i=[]}=e;if(!s)return"";const p=se(t),a=te(t),l="█".repeat(t),m="░".repeat(10-t);let u='<div class="report-stats">';return u+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,u+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${a}">${l}<span style="color:var(--text-dim)">${m}</span> ${p}</span>
  </div>`,r.length&&(u+='<div class="report-section-label">agreements reached</div>',u+=r.map(c=>`<div class="report-agree-item">✓ ${d(c)}</div>`).join("")),n.length&&(u+='<div class="report-section-label">alignments that formed</div>',u+=n.map(c=>`<div class="report-partial"><span class="report-partial-names">${d(c.participants.join(" + "))}</span> — <span class="report-partial-on">${d(c.on)}</span></div>`).join("")),i.length&&(u+='<div class="report-section-label">still unresolved</div>',u+=i.map(c=>typeof c=="object"&&c!==null?`<div class="report-tension">
          <span class="report-tension-topic">${d(c.topic)}</span>
          <span class="report-tension-stance">${d(c.participant_a)}: ${d(c.stance_a)}</span>
          <span class="report-tension-stance">${d(c.participant_b)}: ${d(c.stance_b)}</span>
        </div>`:`<div class="report-tension">${d(String(c))}</div>`).join("")),u+="</div>",u}function je(e,s){O(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${d(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,C(e,t)}function O(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function D(e,s){const{topic:t,turn:n=0,heat:r=0,concession_total:i=0,moderator_style:p="socratic",partial_agreements:a=[],points_of_agreement:l=[],remaining_disagreements:m=[]}=s;let u=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${d(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${n}</div>
  `;l.length&&(u+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${l.map(c=>`<div class="sb-agree-item">✓ ${d(c)}</div>`).join("")}
      </div>
    `),a.length&&(u+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${a.map(c=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${d(c.participants.join(" + "))}</div>
            <div class="sb-partial-on">${d(c.on)}</div>
          </div>
        `).join("")}
      </div>
    `),m.length&&(u+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${m.map(c=>typeof c=="object"&&c!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${d(c.topic)}</div>
                <div class="sb-tension-stance">${d(c.participant_a)}: ${d(c.stance_a)}</div>
                <div class="sb-tension-stance">${d(c.participant_b)}: ${d(c.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${d(String(c))}</div>`).join("")}
      </div>
    `),u+=`
    <div class="sb-section" id="sb-bars">
      ${ee(r,i)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${d(p)}</div>
    </div>
  `,e.innerHTML=u}function R(e){return d(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function C(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ee(e,s){const t=te(e),n=se(e),r="█".repeat(e),i="░".repeat(10-e),p=Math.min(s,10),a=Oe(s),l="█".repeat(p),m="░".repeat(10-p),u=Pe(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${r}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${t}">${n}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${a}">${l}</span><span class="sb-heat-empty">${m}</span>
      <span class="sb-heat-label" style="color:${a}">${u} (${s})</span>
    </div>
  `}function Me(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=ee(s,t))}function te(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function se(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Oe(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Pe(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Re(e,s){const{turn:t,heat:n,partial_agreements:r,remaining_disagreements:i,drift_topic:p}=e;if(!t)return"The debate is just getting started.";if(p)return`The conversation has drifted from the original topic toward ${p}.`;const a=r||[],l=i||[];if(a.length&&l.length){const u=a[0],c=l[0],v=u.participants.join(" and "),f=typeof c=="object"?c.topic:String(c);return`${v} are finding common ground, but the group remains divided on ${f}.`}if(a.length){const u=a[0];return`${u.participants.join(" and ")} are converging on ${u.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(l.length){const u=l[0];return typeof u=="object"?`${u.participant_a} and ${u.participant_b} are sharply divided over ${u.topic}.`:`The room is deadlocked — ${String(u)}.`}const m=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${m}.`}const G=document.querySelector("#app");let ae={};async function ne(){let e,s;try{[e,s,ae]=await Promise.all([oe(),ce(),le()])}catch(n){G.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=ye(G,e,async({characters:n,topic:r,commentator:i=!0,moderator:p=!0,diagrams:a=!1,audienceLevel:l="university"})=>{try{const m=await de(n,r,i,p,a,l);Ue(m.session_id,n,r,s)}catch(m){t.showError(`Could not start session: ${m.message}`)}})}function Ue(e,s,t,n){xe(G,e,s,t,n,{steer:pe,cheat:be,deleteSession:ve,newTopic:me,openStream:fe,searchEvidence:ue,fetchNewspaper:he,exportPodcast:ae.podcast?ge:null}),G.addEventListener("debate:quit",()=>ne(),{once:!0})}ne();
