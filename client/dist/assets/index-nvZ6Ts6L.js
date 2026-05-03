(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const A="/api";async function j(e,s){const t=await fetch(`${A}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function le(e){await fetch(`${A}${e}`,{method:"DELETE"})}async function ce(e=null){const s=e?`${A}/topics?level=${encodeURIComponent(e)}`:`${A}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function de(){const e=await fetch(`${A}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function pe(){const e=await fetch(`${A}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function ue(){const e=await fetch(`${A}/features`);return e.ok?e.json():{}}async function me(e,s,t=!0,n=!0,r=!1,i="university",c="normal",a="normal",d="normal"){return j("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:n,diagrams_enabled:r,audience_level:i,philosopher_length:c,commentator_length:a,moderator_length:d})}async function he(e,s,t,n="",r={}){return j(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:r})}async function ve(e){return j("/search",{query:e})}async function ge(e,s){return j(`/sessions/${e}/new-topic`,{topic:s})}async function be(e){return le(`/sessions/${e}`)}async function fe(e){return j(`/sessions/${e}/newspaper`,{})}async function ye(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const i=await s.json().catch(()=>({detail:s.statusText}));throw new Error(i.detail||s.statusText)}const t=await s.blob(),n=URL.createObjectURL(t),r=document.createElement("a");r.href=n,r.download="philosophers-bar-podcast.mp3",document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(n)}async function we(e,s,t={}){const n={drinks:t};return s!==null&&(n.heat=s),j(`/sessions/${e}/cheat`,n)}function $e(e,s){const t=new EventSource(`${A}/sessions/${e}/stream`);return t.onmessage=n=>{try{const r=JSON.parse(n.data);s(r)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const K="https://github.com/mhughes72/fungame03";function Z(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function n(){t.remove()}t.querySelector(".info-close").addEventListener("click",n),t.addEventListener("click",r=>{r.target===t&&n()}),document.addEventListener("keydown",function r(i){i.key==="Escape"&&(n(),document.removeEventListener("keydown",r))})}function ee(){Z("ABOUT",`
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
    <p><a class="info-link" href="${K}" target="_blank" rel="noopener">${K}</a></p>
  `)}function te(){Z("HOW TO PLAY",`
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
  `)}function Ee(e,s,t,{isLocal:n=!1}={}){e.innerHTML=`
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

        <div class="setup-lengths" id="setup-lengths" style="display:none">
          <div class="length-group">
            <span class="length-label">Philosopher length</span>
            <div class="length-options">
              <label class="length-opt"><input type="radio" name="phil-length" value="punchy" /> Punchy</label>
              <label class="length-opt"><input type="radio" name="phil-length" value="normal" checked /> Normal</label>
              <label class="length-opt"><input type="radio" name="phil-length" value="conversational" /> Conversational</label>
              <label class="length-opt"><input type="radio" name="phil-length" value="expansive" /> Expansive</label>
            </div>
          </div>
          <div class="length-group">
            <span class="length-label">Commentator</span>
            <div class="length-options">
              <label class="length-opt"><input type="radio" name="comm-length" value="off" /> Off</label>
              <label class="length-opt"><input type="radio" name="comm-length" value="normal" checked /> Normal</label>
              <label class="length-opt"><input type="radio" name="comm-length" value="verbose" /> Verbose</label>
            </div>
          </div>
          <div class="length-group">
            <span class="length-label">Moderator</span>
            <div class="length-options">
              <label class="length-opt"><input type="radio" name="mod-length" value="brief" /> Brief</label>
              <label class="length-opt"><input type="radio" name="mod-length" value="normal" checked /> Normal</label>
              <label class="length-opt"><input type="radio" name="mod-length" value="elaborate" /> Elaborate</label>
            </div>
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
  `;const r=e.querySelectorAll("#char-list input[type=checkbox]"),i=e.querySelectorAll(".char-row"),c=e.querySelector("#char-no-results"),a=e.querySelector("#char-filter");a.addEventListener("input",()=>{const o=a.value.toLowerCase().trim();let E=0;i.forEach(S=>{const T=!o||S.dataset.name.includes(o);S.style.display=T?"":"none",T&&E++}),c.style.display=E===0?"":"none"});const d=document.createElement("div");d.className="char-tooltip",d.style.display="none",document.body.appendChild(d);function m(o){const{desc:E,category:S,portrait:T}=o.currentTarget.dataset;if(!E)return;const _=`/portraits/${T}.png`;d.innerHTML=`
      <div class="tt-inner">
        <img class="tt-portrait" src="${_}" alt="" onerror="this.style.display='none'" />
        <div class="tt-body">
          ${S?`<span class="tt-category">${M(S)}</span>`:""}
          <span class="tt-desc">${M(E)}</span>
        </div>
      </div>`,d.style.display="block",l(o)}function l(o){const S=d.offsetWidth,T=d.offsetHeight;let _=o.clientX+14,C=o.clientY+14;_+S>window.innerWidth-14&&(_=o.clientX-S-14),C+T>window.innerHeight-14&&(C=o.clientY-T-14),d.style.left=_+"px",d.style.top=C+"px"}function h(){d.style.display="none"}i.forEach(o=>{o.addEventListener("mouseenter",m),o.addEventListener("mousemove",l),o.addEventListener("mouseleave",h)});const u=new MutationObserver(()=>{document.body.contains(e)||(d.remove(),u.disconnect())});u.observe(document.body,{childList:!0,subtree:!0}),n&&(e.querySelector("#setup-lengths").style.display="");const v=e.querySelector("#selection-hint"),x=e.querySelector("#start-btn"),w=e.querySelector("#setup-error");function L(){const o=[...r].filter(E=>E.checked).length;o<2?(v.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",v.classList.remove("hint-ok","hint-warn")):o>4?(v.textContent=`Too many — deselect ${o-4}`,v.classList.add("hint-warn"),v.classList.remove("hint-ok")):(v.textContent=`${o} selected`,v.classList.add("hint-ok"),v.classList.remove("hint-warn")),x.disabled=o<2||o>4}L(),r.forEach(o=>o.addEventListener("change",L));function b(){const o=e.querySelector('input[name="audience"]:checked'),E=e.querySelector('input[name="phil-length"]:checked'),S=e.querySelector('input[name="comm-length"]:checked'),T=e.querySelector('input[name="mod-length"]:checked');return{commentator:e.querySelector("#toggle-commentator").checked,moderator:e.querySelector("#toggle-moderator").checked,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:o?o.value:"university",philosopherLength:E?E.value:"normal",commentatorLength:S?S.value:"normal",moderatorLength:T?T.value:"normal"}}x.addEventListener("click",()=>{const o=[...r].filter(S=>S.checked).map(S=>S.value),E=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";w.textContent="",t({characters:o,topic:E,...b()})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!x.disabled&&x.click()}),e.querySelector("#setup-about").addEventListener("click",ee),e.querySelector("#setup-help").addEventListener("click",te);const k=e.querySelector("#dotd-card"),f={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let $=[],g=null;function y(){const o=e.querySelector('input[name="audience"]:checked');return o?o.value:"university"}function q(o){return $.filter(E=>E.audience_level===o)}function D(o,E=null){if(!o.length)return null;const S=E?o.filter(C=>C.id!==E.id):o,T=S.length?S:o,_=[];for(const C of T)_.push(C),C.source==="curated"&&(_.push(C),_.push(C));return _[Math.floor(Math.random()*_.length)]}function I(o){g=o;const E=f[o.category]||"var(--text-dim)",S=o.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>';k.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── SUGGESTED DEBATE ──</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${E}">${o.category.toUpperCase()}</span>
          ${S}
        </span>
      </div>
      <div class="dotd-cast">${o.characters.join(" · ")}</div>
      <div class="dotd-topic">${M(o.topic)}</div>
      <div class="dotd-tagline">${M(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Next suggestion ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,k.querySelector("#dotd-start").addEventListener("click",()=>{t({characters:o.characters,topic:o.topic,...b()})}),k.querySelector("#dotd-new").addEventListener("click",()=>{const T=D(q(y()),g);T&&I(T)})}function Q(){const o=D(q(y()));o?I(o):k.style.display="none"}return ce().then(o=>{$=o,Q()}).catch(()=>{k.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(o=>{o.addEventListener("change",Q)}),{showError(o){w.textContent=o}}}function M(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function O(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Se(e,s,t="",n,r=null,i=[]){return new Promise(c=>{const a=document.createElement("div");a.className="steer-drawer",a.innerHTML=`
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
        ${s.map(b=>`
          <button
            class="style-item${b.style===e?" style-selected":""}"
            data-style="${O(b.style)}"
          >
            <span class="style-name">${O(b.style)}</span>
            <span class="style-desc">${O(b.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(n||document.body).appendChild(a);const m=a.querySelector("#steer-text-input"),l=a.querySelector("#evidence-query"),h=a.querySelector("#evidence-search"),u=a.querySelector("#evidence-preview");m.focus();let v=e,x="";async function w(){const b=l.value.trim();if(!(!b||!r)){h.disabled=!0,h.textContent="Searching…",u.style.display="none",x="";try{const k=await r(b);x=k.finding,u.style.display="block",u.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${O(k.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,u.querySelector("#evidence-accept").addEventListener("click",()=>{u.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${O(x)}</div>`}),u.querySelector("#evidence-discard").addEventListener("click",()=>{x="",u.style.display="none"})}catch(k){u.style.display="block",u.textContent=`Search failed: ${k.message}`}finally{h.disabled=!1,h.textContent="Search"}}}h.addEventListener("click",w),l.addEventListener("keydown",b=>{b.key==="Enter"&&w()}),a.querySelectorAll(".style-item").forEach(b=>{b.addEventListener("click",()=>{a.querySelectorAll(".style-item").forEach(k=>k.classList.remove("style-selected")),b.classList.add("style-selected"),v=b.dataset.style,L()})});function L(){const b=m.value.trim();a.remove(),c({text:b,style:v,evidence:x})}a.querySelector("#steer-submit").addEventListener("click",L),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),c(null)}),m.addEventListener("keydown",b=>{b.key==="Enter"&&L()})})}function B(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const V=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function ke(e,s,t,n,r=null,i=null,c=null,a=null){return new Promise(d=>{var w,L,b,k;const m={};t.forEach(f=>{m[f]=0});const l=document.createElement("div");l.className="cheat-overlay",l.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${V[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(f=>`
            <div class="drink-row">
              <span class="drink-name">${B(f)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${B(f)}">−</button>
                <span class="drink-count" id="drink-count-${B(f.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${B(f)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        ${r||i?`
        <div class="cheat-utils-row">
          ${r?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          ${i?'<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>':""}
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
    `,document.body.appendChild(l);const h=l.querySelector("#cheat-heat-slider"),u=l.querySelector("#cheat-heat-value");h.addEventListener("input",()=>{const f=parseInt(h.value,10);u.textContent=`${f} — ${V[f]}`}),l.querySelectorAll(".drink-btn").forEach(f=>{f.addEventListener("click",()=>{const $=f.dataset.name,g=f.classList.contains("drink-plus")?1:-1;m[$]=Math.max(0,(m[$]||0)+g);const y=$.replace(/ /g,"_"),q=l.querySelector(`#drink-count-${y}`);q&&(q.textContent=m[$])})});function v(){l.remove(),d()}async function x(){const f=parseInt(h.value,10),$=Object.fromEntries(Object.entries(m).filter(([,y])=>y>0)),g=f!==s;try{await n(e,g?f:null,$)}catch(y){console.error("Cheat failed:",y)}v()}l.querySelector("#cheat-apply").addEventListener("click",x),l.querySelector("#cheat-close").addEventListener("click",v),(w=l.querySelector("#cheat-paper"))==null||w.addEventListener("click",()=>{v(),r()}),(L=l.querySelector("#cheat-podcast"))==null||L.addEventListener("click",()=>{v(),i()}),(b=l.querySelector("#cheat-consensus"))==null||b.addEventListener("click",()=>{v(),a()}),(k=l.querySelector("#cheat-end"))==null||k.addEventListener("click",()=>{v(),c()}),l.addEventListener("click",f=>{f.target===l&&v()})})}function Le(e,s){e.innerHTML=s.map(a=>{const d=xe(a),m=Te(a);return`
      <div class="seat" id="seat-${J(a)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${d}" alt="${W(a)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${W(m)}</div>
        </div>
        <div class="seat-name">${W(qe(a))}</div>
      </div>
    `}).join("");let t=null;function n(a){return e.querySelector(`#seat-${J(a)}`)}function r(){clearTimeout(t),e.querySelectorAll(".seat").forEach(a=>{a.classList.remove("seat-thinking","seat-speaking")})}function i(a){var d;r(),(d=n(a))==null||d.classList.add("seat-thinking")}function c(a){r();const d=n(a);d&&(d.classList.add("seat-speaking"),t=setTimeout(()=>d.classList.remove("seat-speaking"),3e3))}return{setThinking:i,setSpeaking:c,clearAll:r}}function xe(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Te(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function qe(e){return e.split(" ").at(-1)}function J(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function W(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function _e(e,s,t,n,r,i){e.innerHTML=`
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
  `;const c=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),d=e.querySelector("#sidebar"),m=e.querySelector("#left-col");let l="socratic",h=0,u=null,v=!1,x=!1,w={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const L=Le(c,t);R(d,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const $=document.createElement("div");$.id="debate-starting",$.className="debate-starting",$.innerHTML='<span class="debate-starting-text">Opening the bar</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>',a.appendChild($)}function b(){var $;($=a.querySelector("#debate-starting"))==null||$.remove()}function k({type:$,data:g}){switch($){case"speaker":b(),L.setThinking(g.name),Pe(a,g.name);break;case"message":b(),H(a),g.backchannel||L.setSpeaking(g.name),Ce(a,g);break;case"bars":h=g.heat??h,Re(d,g.heat,g.concession_total??0);break;case"debug":{const y=g.data!=null?g.data:"",q=typeof y=="object"?`
`+Object.entries(y).map(([D,I])=>`  ${D}: ${JSON.stringify(I)}`).join(`
`):y?` — ${y}`:"";console.log(`[${g.channel}] ${g.label}${q}`);break}case"state":H(a),l=g.moderator_style,h=g.heat??h,w=g,R(d,{topic:n,...g});break;case"steer_needed":if(x)break;x=!0,l=g.current_style,g.drift_topic&&He(a,g.drift_topic,n),a.scrollTop=a.scrollHeight,Se(l,r,Ie(w),m,i.searchEvidence,t).then(y=>{x=!1,y===null?G(a,w,t,f,s,i):(l=y.style,R(d,{topic:n,...w,moderator_style:y.style}),i.steer(s,y.text,y.style,y.evidence||"",y.drinks||{}).catch(q=>P(a,`Steer error: ${q.message}`)))});break;case"consensus":if(v)break;v=!0,u&&(u(),u=null),H(a),L.clearAll(),X(a,g,{onNewTopic(y){i.newTopic(s,y).then(()=>{v=!1,w={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=y,R(d,{topic:y,...w,moderator_style:l,points_of_agreement:[]}),L.clearAll(),u=i.openStream(s,k)}).catch(q=>P(a,`Error: ${q.message}`))},onQuit:f},w,s,i,t);break;case"game_over":if(v)break;v=!0,u&&(u(),u=null),H(a),L.clearAll(),G(a,{...w,...g},t,f,s,i);break;case"bar_beat":b(),Ne(a,g.text);break;case"commentator":b(),Ae(a,g.text);break;case"evidence":b(),Me(a,g.finding);break;case"diagram":b(),Oe(a,g);break;case"system":b(),P(a,g.text);break;case"error":b(),P(a,`⚠ ${g.text}`);break}}function f(){u&&u(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",ee),e.querySelector("#help-btn").addEventListener("click",te),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const g=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=g?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{v||ke(s,h,t,i.cheat,()=>Y(s,i,t),()=>je(s,i),()=>{v=!0,u&&(u(),u=null),H(a),L.clearAll(),G(a,w,t,f,s,i)},()=>{v=!0,u&&(u(),u=null),H(a),L.clearAll(),X(a,{summary:"The bar has called it — the evening ends in agreement.",points:w.points_of_agreement||[]},{onNewTopic($){i.newTopic(s,$).then(()=>{v=!1,w={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=$,R(d,{topic:$,...w,moderator_style:l,points_of_agreement:[]}),L.clearAll(),u=i.openStream(s,k)}).catch(g=>P(a,`Error: ${g.message}`))},onQuit:f},w,s,i,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(v){f();return}w.turn>0?(v=!0,u&&(u(),u=null),G(a,w,t,f,s,i)):f()}),u=i.openStream(s,k)}function Ce(e,{role:s,name:t,content:n,backchannel:r}){const i=document.createElement("div");if(r)i.className="msg msg-bc",i.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${U(n)}</em>`;else if(s==="moderator")i.className="msg msg-moderator",i.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${U(n)}</div>`;else if(s==="user")i.className="msg msg-user",i.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${U(n)}</div>`;else{const c=`/portraits/${t.replace(/ /g,"_")}.png`,a=t.split(" ").map(d=>d[0]).join("").slice(0,2).toUpperCase();i.className="msg msg-philosopher",i.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${c}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(a)}</div></div><div class="msg-body"><div class="msg-name">${p(t)}</div><div class="msg-content">${U(n)}</div></div>`}N(e,i)}function Ne(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=U(s),N(e,t)}function P(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,N(e,t)}function He(e,s,t){const n=document.createElement("div");n.className="msg msg-drift",n.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${p(s)}</div><div class="drift-orig">original: ${p(t)}</div>`,N(e,n)}function Ae(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${p(s)}</span>`,N(e,t)}function Me(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,N(e,t)}function Oe(e,{speaker:s,title:t,thumb_url:n,url:r,page_url:i}){const c=document.createElement("div");c.className="msg msg-diagram",c.innerHTML=`<div class="diagram-label">${p(s)} produces a diagram</div><a class="diagram-link" href="${p(i)}" target="_blank" rel="noopener"><img class="diagram-img" src="${p(n)}" alt="${p(t)}" /><div class="diagram-caption">${p(t)}</div></a>`,N(e,c)}function X(e,{summary:s,points:t},{onNewTopic:n,onQuit:r},i={},c,a,d=[]){var h;const m=document.createElement("div");m.className="end-panel",m.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${p(s)}</blockquote>
    ${se(i)}
    ${ae(t,i)}
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
  `,N(e,m);const l=m.querySelector("#consensus-topic-input");l.focus(),m.querySelector("#consensus-continue").addEventListener("click",()=>{const u=l.value.trim();u&&n(u)}),l.addEventListener("keydown",u=>{if(u.key==="Enter"){const v=l.value.trim();v&&n(v)}}),m.querySelector("#consensus-end").addEventListener("click",r),(h=m.querySelector("#consensus-paper"))==null||h.addEventListener("click",()=>Y(c,a,d))}function G(e,s,t,n,r,i){var m;H(e);const c=document.createElement("div");c.className="end-panel";const a=s.turn||0,d=a?`${a} turn${a!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";c.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${p(d)}</blockquote>
    ${se(s)}
    ${ae([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${r?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,N(e,c),c.querySelector("#game-over-leave").addEventListener("click",n),(m=c.querySelector("#game-over-paper"))==null||m.addEventListener("click",()=>Y(r,i,t))}async function je(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(n){alert(`Podcast failed: ${n.message}`)}finally{t.remove()}}async function Y(e,s,t=[]){const n=document.createElement("div");n.className="newspaper-overlay",n.innerHTML=`
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
  `,n.querySelector("#newspaper-close").addEventListener("click",()=>n.remove()),n.addEventListener("click",i=>{i.target===n&&n.remove()}),n.querySelector("#newspaper-download").addEventListener("click",()=>{var a,d;const i=n.querySelector(".newspaper-modal").cloneNode(!0);i.querySelectorAll("img").forEach(m=>{m.src&&!m.src.startsWith("http")&&(m.src=window.location.origin+m.getAttribute("src"))}),(a=i.querySelector("#newspaper-close"))==null||a.remove(),(d=i.querySelector("#newspaper-download"))==null||d.remove();const c=window.open("","_blank");c.document.write(`<!DOCTYPE html>
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
</head><body>${i.outerHTML}</body></html>`),c.document.close(),c.addEventListener("load",()=>{c.focus(),c.print()})})}function se(e){const{turn:s=0,heat:t=0,concession_total:n=0}=e;if(!s)return"";const r=ie(t),i=re(t);return`
    <div class="end-scoreboard">
      <div class="end-stat">
        <span class="end-stat-num">${s}</span>
        <span class="end-stat-lbl">turns</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num" style="color:${r}">${t}<span class="end-stat-denom">/10</span></span>
        <span class="end-stat-lbl">${i}</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num">${n}</span>
        <span class="end-stat-lbl">concessions</span>
      </div>
    </div>
  `}function ae(e,s){const{partial_agreements:t=[],points_of_agreement:n=[],remaining_disagreements:r=[]}=s,i=[...new Set([...e,...n])];let c="";return i.length&&(c+=`<div class="end-section end-section-agree">
      <div class="end-section-label">agreements reached</div>
      ${i.map(a=>`<div class="end-item-agree">✓ ${p(a)}</div>`).join("")}
    </div>`),t.length&&(c+=`<div class="end-section end-section-partial">
      <div class="end-section-label">alignments that formed</div>
      ${t.map(a=>`<div class="end-partial">
          <span class="end-partial-names">${p(a.participants.join(" + "))}</span>
          <span class="end-partial-on">${p(a.on)}</span>
        </div>`).join("")}
    </div>`),r.length&&(c+=`<div class="end-section end-section-tension">
      <div class="end-section-label">still unresolved</div>
      ${r.map(a=>typeof a=="object"&&a!==null?`<div class="end-tension">
            <span class="end-tension-topic">${p(a.topic)}</span>
            <span class="end-tension-stances">${p(a.participant_a)}: ${p(a.stance_a)} · ${p(a.participant_b)}: ${p(a.stance_b)}</span>
          </div>`:`<div class="end-tension">${p(String(a))}</div>`).join("")}
    </div>`),c}function Pe(e,s){H(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,N(e,t)}function H(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function R(e,s){const{topic:t,turn:n=0,heat:r=0,concession_total:i=0,moderator_style:c="socratic",partial_agreements:a=[],points_of_agreement:d=[],remaining_disagreements:m=[]}=s;let l=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${n}</div>
  `;d.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${d.map(h=>`<div class="sb-agree-item">✓ ${p(h)}</div>`).join("")}
      </div>
    `),a.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${a.map(h=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(h.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(h.on)}</div>
          </div>
        `).join("")}
      </div>
    `),m.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${m.map(h=>typeof h=="object"&&h!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(h.topic)}</div>
                <div class="sb-tension-stance">${p(h.participant_a)}: ${p(h.stance_a)}</div>
                <div class="sb-tension-stance">${p(h.participant_b)}: ${p(h.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(h))}</div>`).join("")}
      </div>
    `),l+=`
    <div class="sb-section" id="sb-bars">
      ${ne(r,i)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(c)}</div>
    </div>
  `,e.innerHTML=l}function U(e){return p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function N(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ne(e,s){const t=ie(e),n=re(e),r="█".repeat(e),i="░".repeat(10-e),c=Math.min(s,10),a=Ue(s),d="█".repeat(c),m="░".repeat(10-c),l=De(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${r}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${t}">${n}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${a}">${d}</span><span class="sb-heat-empty">${m}</span>
      <span class="sb-heat-label" style="color:${a}">${l} (${s})</span>
    </div>
  `}function Re(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=ne(s,t))}function ie(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function re(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Ue(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function De(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Ie(e,s){const{turn:t,heat:n,partial_agreements:r,remaining_disagreements:i,drift_topic:c}=e;if(!t)return"The debate is just getting started.";if(c)return`The conversation has drifted from the original topic toward ${c}.`;const a=r||[],d=i||[];if(a.length&&d.length){const l=a[0],h=d[0],u=l.participants.join(" and "),v=typeof h=="object"?h.topic:String(h);return`${u} are finding common ground, but the group remains divided on ${v}.`}if(a.length){const l=a[0];return`${l.participants.join(" and ")} are converging on ${l.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(d.length){const l=d[0];return typeof l=="object"?`${l.participant_a} and ${l.participant_b} are sharply divided over ${l.topic}.`:`The room is deadlocked — ${String(l)}.`}const m=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${m}.`}const F=document.querySelector("#app");let z={};async function oe(){let e,s;try{[e,s,z]=await Promise.all([de(),pe(),ue()])}catch(r){F.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${r.message}</div>`;return}const t=!!z.local,n=Ee(F,e,async({characters:r,topic:i,commentator:c=!0,moderator:a=!0,diagrams:d=!1,audienceLevel:m="university",philosopherLength:l="normal",commentatorLength:h="normal",moderatorLength:u="normal"})=>{try{const v=await me(r,i,c,a,d,m,l,h,u);Be(v.session_id,r,i,s)}catch(v){n.showError(`Could not start session: ${v.message}`)}},{isLocal:t})}function Be(e,s,t,n){_e(F,e,s,t,n,{steer:he,cheat:we,deleteSession:be,newTopic:ge,openStream:$e,searchEvidence:ve,fetchNewspaper:fe,exportPodcast:z.podcast?ye:null,isLocal:!!z.local}),F.addEventListener("debate:quit",()=>oe(),{once:!0})}oe();
