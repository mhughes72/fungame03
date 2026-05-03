(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();const A="/api";async function I(e,s){const t=await fetch(`${A}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function me(e){await fetch(`${A}${e}`,{method:"DELETE"})}async function ve(e=null){const s=e?`${A}/topics?level=${encodeURIComponent(e)}`:`${A}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function he(){const e=await fetch(`${A}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function ge(){const e=await fetch(`${A}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function fe(){const e=await fetch(`${A}/features`);return e.ok?e.json():{}}async function be(e,s,t=!0,n=!0,r=!1,o="university",l="normal",a="normal",p="normal",h="",c=null){return I("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:n,diagrams_enabled:r,audience_level:o,philosopher_length:l,commentator_length:a,moderator_length:p,debate_format:h,format_roles:c})}async function ye(e,s,t,n="",r={}){return I(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:r})}async function $e(e){return I("/search",{query:e})}async function we(e,s){return I(`/sessions/${e}/new-topic`,{topic:s})}async function Ee(e){return me(`/sessions/${e}`)}async function Se(e){return I(`/sessions/${e}/newspaper`,{})}async function ke(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const o=await s.json().catch(()=>({detail:s.statusText}));throw new Error(o.detail||s.statusText)}const t=await s.blob(),n=URL.createObjectURL(t),r=document.createElement("a");r.href=n,r.download="philosophers-bar-podcast.mp3",document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(n)}async function xe(e,s,t={}){const n={drinks:t};return s!==null&&(n.heat=s),I(`/sessions/${e}/cheat`,n)}function Le(e,s){const t=new EventSource(`${A}/sessions/${e}/stream`);return t.onmessage=n=>{try{const r=JSON.parse(n.data);s(r)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const ee="https://github.com/mhughes72/fungame03";function ne(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function n(){t.remove()}t.querySelector(".info-close").addEventListener("click",n),t.addEventListener("click",r=>{r.target===t&&n()}),document.addEventListener("keydown",function r(o){o.key==="Escape"&&(n(),document.removeEventListener("keydown",r))})}function re(){ne("ABOUT",`
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
    <p><a class="info-link" href="${ee}" target="_blank" rel="noopener">${ee}</a></p>
  `)}function ie(){ne("HOW TO PLAY",`
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
  `)}function Te(e,s,t,{isLocal:n=!1}={}){e.innerHTML=`
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
          ${s.map(i=>`
            <label class="char-row"
              data-name="${i.name.toLowerCase()}"
              data-desc="${M(i.known_for)}"
              data-category="${M(i.category||"")}"
              data-portrait="${M(i.name.replace(/ /g,"_"))}">
              <input type="checkbox" value="${i.name}" />
              <span class="char-name">${i.name}</span>
              <span class="char-era">${i.era}</span>
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

        <div class="setup-format" id="setup-format" style="display:none">
          <span class="length-label">Debate format</span>
          <div class="length-options">
            <label class="length-opt"><input type="radio" name="debate-format" value="" checked /> Freeform</label>
            <label class="length-opt"><input type="radio" name="debate-format" value="oxford" /> Oxford-style</label>
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
              <label class="length-opt"><input type="radio" name="mod-length" value="off" /> Off</label>
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
  `;const r=e.querySelectorAll("#char-list input[type=checkbox]"),o=e.querySelectorAll(".char-row"),l=e.querySelector("#char-no-results"),a=e.querySelector("#char-filter");a.addEventListener("input",()=>{const i=a.value.toLowerCase().trim();let x=0;o.forEach(S=>{const N=!i||S.dataset.name.includes(i);S.style.display=N?"":"none",N&&x++}),l.style.display=x===0?"":"none"});const p=document.createElement("div");p.className="char-tooltip",p.style.display="none",document.body.appendChild(p);function h(i){const{desc:x,category:S,portrait:N}=i.currentTarget.dataset;if(!x)return;const q=`/portraits/${N}.png`;p.innerHTML=`
      <div class="tt-inner">
        <img class="tt-portrait" src="${q}" alt="" onerror="this.style.display='none'" />
        <div class="tt-body">
          ${S?`<span class="tt-category">${M(S)}</span>`:""}
          <span class="tt-desc">${M(x)}</span>
        </div>
      </div>`,p.style.display="block",c(i)}function c(i){const S=p.offsetWidth,N=p.offsetHeight;let q=i.clientX+14,C=i.clientY+14;q+S>window.innerWidth-14&&(q=i.clientX-S-14),C+N>window.innerHeight-14&&(C=i.clientY-N-14),p.style.left=q+"px",p.style.top=C+"px"}function f(){p.style.display="none"}o.forEach(i=>{i.addEventListener("mouseenter",h),i.addEventListener("mousemove",c),i.addEventListener("mouseleave",f)});const u=new MutationObserver(()=>{document.body.contains(e)||(p.remove(),u.disconnect())});u.observe(document.body,{childList:!0,subtree:!0}),e.querySelector("#setup-format").style.display="",n&&(e.querySelector("#setup-lengths").style.display="");const v=e.querySelector("#selection-hint"),E=e.querySelector("#start-btn"),k=e.querySelector("#setup-error");function L(){const i=[...r].filter(x=>x.checked).length;i<2?(v.textContent=i===0?"Select 2 to 4 thinkers":"Select 1 more",v.classList.remove("hint-ok","hint-warn")):i>4?(v.textContent=`Too many — deselect ${i-4}`,v.classList.add("hint-warn"),v.classList.remove("hint-ok")):(v.textContent=`${i} selected`,v.classList.add("hint-ok"),v.classList.remove("hint-warn")),E.disabled=i<2||i>4}const m=e.querySelector("#char-list"),$=e.querySelector("#char-filter"),b=e.querySelector("#topic-input");function y(i){m.classList.toggle("oxford-locked",i),$.disabled=i,b.disabled=i,r.forEach(x=>{x.disabled=i}),i?(E.disabled=!0,v.textContent="Select a suggested Oxford debate below",v.classList.remove("hint-ok","hint-warn")):L()}L(),r.forEach(i=>i.addEventListener("change",L));function _(){const i=e.querySelector('input[name="audience"]:checked'),x=e.querySelector('input[name="phil-length"]:checked'),S=e.querySelector('input[name="comm-length"]:checked'),N=e.querySelector('input[name="mod-length"]:checked'),q=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:i?i.value:"university",philosopherLength:x?x.value:"normal",commentatorLength:S?S.value:"normal",moderatorLength:N?N.value:"normal",debateFormat:q?q.value:""}}E.addEventListener("click",()=>{const i=[...r].filter(S=>S.checked).map(S=>S.value),x=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";k.textContent="",t({characters:i,topic:x,..._()})}),e.querySelector("#topic-input").addEventListener("keydown",i=>{i.key==="Enter"&&!E.disabled&&E.click()}),e.querySelector("#setup-about").addEventListener("click",re),e.querySelector("#setup-help").addEventListener("click",ie);const w=e.querySelector("#dotd-card"),g={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let T=[],O=null;function D(){const i=e.querySelector('input[name="audience"]:checked');return i?i.value:"university"}function Y(){const i=e.querySelector('input[name="debate-format"]:checked');return i?i.value:""}function J(i){const x=Y();return T.filter(S=>S.audience_level===i&&(x==="oxford"?S.format==="oxford":S.format!=="oxford"))}function X(i,x=null){if(!i.length)return null;const S=x?i.filter(C=>C.id!==x.id):i,N=S.length?S:i,q=[];for(const C of N)q.push(C),C.source==="curated"&&(q.push(C),q.push(C));return q[Math.floor(Math.random()*q.length)]}function Z(i){O=i;const x=g[i.category]||"var(--text-dim)",S=i.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',N=i.format==="oxford"?'<span class="dotd-oxford">Oxford</span>':"",q=i.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${i.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${i.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${i.characters.join(" · ")}</div>`;w.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── SUGGESTED DEBATE ──</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${x}">${i.category.toUpperCase()}</span>
          ${N}
          ${S}
        </span>
      </div>
      ${q}
      <div class="dotd-topic">${M(i.topic)}</div>
      <div class="dotd-tagline">${M(i.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Next suggestion ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,w.querySelector("#dotd-start").addEventListener("click",()=>{const C=i.format==="oxford"?"oxford":"";t({characters:i.characters,topic:i.topic,..._(),debateFormat:C,formatRoles:i.roles||null})}),w.querySelector("#dotd-new").addEventListener("click",()=>{const C=X(J(D()),O);C&&Z(C)})}function Q(){const i=X(J(D()));i?Z(i):w.style.display="none"}return ve().then(i=>{T=i,Q()}).catch(()=>{w.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(i=>{i.addEventListener("change",Q)}),e.querySelectorAll('input[name="debate-format"]').forEach(i=>{i.addEventListener("change",()=>{y(i.value==="oxford"&&i.checked),Q()})}),{showError(i){k.textContent=i}}}function M(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function qe(e,s,t="",n,r=null,o=[]){return new Promise(l=>{const a=document.createElement("div");a.className="steer-drawer",a.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${R(t)}</div>`:""}

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
            data-style="${R(m.style)}"
          >
            <span class="style-name">${R(m.style)}</span>
            <span class="style-desc">${R(m.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(n||document.body).appendChild(a);const h=a.querySelector("#steer-text-input"),c=a.querySelector("#evidence-query"),f=a.querySelector("#evidence-search"),u=a.querySelector("#evidence-preview");h.focus();let v=e,E="";async function k(){const m=c.value.trim();if(!(!m||!r)){f.disabled=!0,f.textContent="Searching…",u.style.display="none",E="";try{const $=await r(m);E=$.finding,u.style.display="block",u.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${R($.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,u.querySelector("#evidence-accept").addEventListener("click",()=>{u.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${R(E)}</div>`}),u.querySelector("#evidence-discard").addEventListener("click",()=>{E="",u.style.display="none"})}catch($){u.style.display="block",u.textContent=`Search failed: ${$.message}`}finally{f.disabled=!1,f.textContent="Search"}}}f.addEventListener("click",k),c.addEventListener("keydown",m=>{m.key==="Enter"&&k()}),a.querySelectorAll(".style-item").forEach(m=>{m.addEventListener("click",()=>{a.querySelectorAll(".style-item").forEach($=>$.classList.remove("style-selected")),m.classList.add("style-selected"),v=m.dataset.style,L()})});function L(){const m=h.value.trim();a.remove(),l({text:m,style:v,evidence:E})}a.querySelector("#steer-submit").addEventListener("click",L),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),l(null)}),h.addEventListener("keydown",m=>{m.key==="Enter"&&L()})})}function B(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const te=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function _e(e,s,t,n,r=null,o=null,l=null,a=null){return new Promise(p=>{var k,L,m,$;const h={};t.forEach(b=>{h[b]=0});const c=document.createElement("div");c.className="cheat-overlay",c.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${te[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(b=>`
            <div class="drink-row">
              <span class="drink-name">${B(b)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${B(b)}">−</button>
                <span class="drink-count" id="drink-count-${B(b.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${B(b)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        ${r||o?`
        <div class="cheat-utils-row">
          ${r?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          ${o?'<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>':""}
        </div>`:""}

        ${a||l?`
        <div class="cheat-section-label">── END THE EVENING ──</div>
        <div class="cheat-end-row">
          ${a?'<button class="cheat-consensus-btn" id="cheat-consensus">Force Consensus ✓</button>':""}
          ${l?'<button class="cheat-end-btn" id="cheat-end">End Game ✕</button>':""}
        </div>`:""}

        <div class="cheat-footer">
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(c);const f=c.querySelector("#cheat-heat-slider"),u=c.querySelector("#cheat-heat-value");f.addEventListener("input",()=>{const b=parseInt(f.value,10);u.textContent=`${b} — ${te[b]}`}),c.querySelectorAll(".drink-btn").forEach(b=>{b.addEventListener("click",()=>{const y=b.dataset.name,_=b.classList.contains("drink-plus")?1:-1;h[y]=Math.max(0,(h[y]||0)+_);const w=y.replace(/ /g,"_"),g=c.querySelector(`#drink-count-${w}`);g&&(g.textContent=h[y])})});function v(){c.remove(),p()}async function E(){const b=parseInt(f.value,10),y=Object.fromEntries(Object.entries(h).filter(([,w])=>w>0)),_=b!==s;try{await n(e,_?b:null,y)}catch(w){console.error("Cheat failed:",w)}v()}c.querySelector("#cheat-apply").addEventListener("click",E),c.querySelector("#cheat-close").addEventListener("click",v),(k=c.querySelector("#cheat-paper"))==null||k.addEventListener("click",()=>{v(),r()}),(L=c.querySelector("#cheat-podcast"))==null||L.addEventListener("click",()=>{v(),o()}),(m=c.querySelector("#cheat-consensus"))==null||m.addEventListener("click",()=>{v(),a()}),($=c.querySelector("#cheat-end"))==null||$.addEventListener("click",()=>{v(),l()}),c.addEventListener("click",b=>{b.target===c&&v()})})}function Ce(e,s){e.innerHTML=s.map(a=>{const p=Ne(a),h=He(a);return`
      <div class="seat" id="seat-${se(a)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${p}" alt="${V(a)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${V(h)}</div>
        </div>
        <div class="seat-name">${V(Oe(a))}</div>
      </div>
    `}).join("");let t=null;function n(a){return e.querySelector(`#seat-${se(a)}`)}function r(){clearTimeout(t),e.querySelectorAll(".seat").forEach(a=>{a.classList.remove("seat-thinking","seat-speaking")})}function o(a){var p;r(),(p=n(a))==null||p.classList.add("seat-thinking")}function l(a){r();const p=n(a);p&&(p.classList.add("seat-speaking"),t=setTimeout(()=>p.classList.remove("seat-speaking"),3e3))}return{setThinking:o,setSpeaking:l,clearAll:r}}function Ne(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function He(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function Oe(e){return e.split(" ").at(-1)}function se(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function V(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function je(e,s,t,n,r,o){e.innerHTML=`
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
  `;const l=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),p=e.querySelector("#sidebar"),h=e.querySelector("#left-col");let c="socratic",f=0,u=null,v=!1,E=!1,k="",L={},m={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const $=Ce(l,t);P(p,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const w=document.createElement("div");w.id="debate-starting",w.className="debate-starting",w.innerHTML='<span class="debate-starting-text">Opening the bar</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>',a.appendChild(w)}function b(){var w;(w=a.querySelector("#debate-starting"))==null||w.remove()}function y({type:w,data:g}){switch(w){case"speaker":b(),$.setThinking(g.name),Be(a,g.name);break;case"message":b(),j(a),g.backchannel||$.setSpeaking(g.name),Ae(a,g);break;case"bars":f=g.heat??f,Ge(p,g.heat,g.concession_total??0);break;case"debug":{const T=g.data!=null?g.data:"",O=typeof T=="object"?`
`+Object.entries(T).map(([D,Y])=>`  ${D}: ${JSON.stringify(Y)}`).join(`
`):T?` — ${T}`:"";console.log(`[${g.channel}] ${g.label}${O}`);break}case"oxford_opening_vote":m={...m,oxford_opening_vote:g},P(p,{topic:n,...m,debate_phase:k,format_roles:L});break;case"oxford_verdict":Fe(a,g);break;case"phase_update":k=g.debate_phase,L=g.format_roles||{},P(p,{topic:n,...m,debate_phase:k,format_roles:L});break;case"state":j(a),c=g.moderator_style,f=g.heat??f,g.debate_phase&&(k=g.debate_phase),g.format_roles&&Object.keys(g.format_roles).length&&(L=g.format_roles),m={...g,debate_phase:k,format_roles:L},P(p,{topic:n,...m});break;case"steer_needed":if(E)break;E=!0,c=g.current_style,g.drift_topic&&Pe(a,g.drift_topic,n),a.scrollTop=a.scrollHeight,qe(c,r,Ye(m),h,o.searchEvidence,t).then(T=>{E=!1,T===null?G(a,m,t,_,s,o):(c=T.style,P(p,{topic:n,...m,moderator_style:T.style}),o.steer(s,T.text,T.style,T.evidence||"",T.drinks||{}).catch(O=>U(a,`Steer error: ${O.message}`)))});break;case"consensus":if(v)break;v=!0,u&&(u(),u=null),j(a),$.clearAll(),ae(a,g,{onNewTopic(T){o.newTopic(s,T).then(()=>{v=!1,m={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=T,P(p,{topic:T,...m,moderator_style:c,points_of_agreement:[]}),$.clearAll(),u=o.openStream(s,y)}).catch(O=>U(a,`Error: ${O.message}`))},onQuit:_},m,s,o,t);break;case"game_over":if(v)break;v=!0,u&&(u(),u=null),j(a),$.clearAll(),G(a,{...m,...g},t,_,s,o);break;case"bar_beat":b(),Me(a,g.text);break;case"commentator":b(),Re(a,g.text);break;case"evidence":b(),Ie(a,g.finding);break;case"diagram":b(),Ue(a,g);break;case"system":b(),U(a,g.text);break;case"error":b(),U(a,`⚠ ${g.text}`);break}}function _(){u&&u(),o.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",re),e.querySelector("#help-btn").addEventListener("click",ie),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const g=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=g?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{v||_e(s,f,t,o.cheat,()=>K(s,o,t),()=>De(s,o),()=>{v=!0,u&&(u(),u=null),j(a),$.clearAll(),G(a,m,t,_,s,o)},()=>{v=!0,u&&(u(),u=null),j(a),$.clearAll(),ae(a,{summary:"The bar has called it — the evening ends in agreement.",points:m.points_of_agreement||[]},{onNewTopic(w){o.newTopic(s,w).then(()=>{v=!1,m={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=w,P(p,{topic:w,...m,moderator_style:c,points_of_agreement:[]}),$.clearAll(),u=o.openStream(s,y)}).catch(g=>U(a,`Error: ${g.message}`))},onQuit:_},m,s,o,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(v){_();return}m.turn>0?(v=!0,u&&(u(),u=null),G(a,m,t,_,s,o)):_()}),u=o.openStream(s,y)}function Ae(e,{role:s,name:t,content:n,backchannel:r,debate_label:o=""}){const l=document.createElement("div");if(r)l.className="msg msg-bc",l.innerHTML=`<span class="bc-name">${d(t)}:</span> <em>${F(n)}</em>`;else if(s==="moderator")l.className="msg msg-moderator",l.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${F(n)}</div>`;else if(s==="user")l.className="msg msg-user",l.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${F(n)}</div>`;else{const a=`/portraits/${t.replace(/ /g,"_")}.png`,p=t.split(" ").map(f=>f[0]).join("").slice(0,2).toUpperCase(),c=o.includes("Proposition")?"debate-label-prop":"debate-label-opp";l.className="msg msg-philosopher",l.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${a}" alt="${d(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${d(p)}</div></div><div class="msg-body">`+(o?`<div class="msg-debate-label ${c}">${d(o)}</div>`:"")+`<div class="msg-name">${d(t)}</div><div class="msg-content">${F(n)}</div></div>`}H(e,l)}function Me(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=F(s),H(e,t)}function U(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,H(e,t)}function Pe(e,s,t){const n=document.createElement("div");n.className="msg msg-drift",n.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${d(s)}</div><div class="drift-orig">original: ${d(t)}</div>`,H(e,n)}function Re(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${d(s)}</span>`,H(e,t)}function Ie(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${d(s)}`,H(e,t)}function Ue(e,{speaker:s,title:t,thumb_url:n,url:r,page_url:o}){const l=document.createElement("div");l.className="msg msg-diagram",l.innerHTML=`<div class="diagram-label">${d(s)} produces a diagram</div><a class="diagram-link" href="${d(o)}" target="_blank" rel="noopener"><img class="diagram-img" src="${d(n)}" alt="${d(t)}" /><div class="diagram-caption">${d(t)}</div></a>`,H(e,l)}function Fe(e,{winner:s,proposition_open:t,proposition_final:n,margin:r,persona_verdicts:o,verdict:l}){const a=s==="proposition"?"PROPOSITION WINS":"OPPOSITION WINS",p=s==="proposition"?"oxford-verdict-prop":"oxford-verdict-opp",h=n===50,c=Math.min(t,n),u=Math.max(t,n)-c,v=n>t,E=v?"var(--green)":"var(--amber)",k=(r>=0?"+":"")+r+" pts",L=`
    <div class="oxford-shift-wrap">
      <div class="oxford-shift-ends"><span>Opp 0%</span><span>Prop 100%</span></div>
      <div class="oxford-shift-track">
        <div class="oxford-shift-fill" style="left:${c}%;width:${u}%;background:${E}"></div>
        <div class="oxford-shift-mark oxford-shift-mark-open" style="left:${t}%">
          <div class="oxford-shift-pip"></div>
          <div class="oxford-shift-pip-label">${t}%</div>
        </div>
        <div class="oxford-shift-mark oxford-shift-mark-close" style="left:${n}%">
          <div class="oxford-shift-pip oxford-shift-pip-close"></div>
          <div class="oxford-shift-pip-label oxford-shift-pip-label-close">${n}%</div>
        </div>
      </div>
      <div class="oxford-shift-margin" style="color:${E}">${v?"→":"←"} ${k}</div>
    </div>
  `,m=h?'<div class="oxford-verdict-tie">The motion falls — a tie goes to the opposition.</div>':"",$=document.createElement("div");$.className="oxford-verdict-card",$.innerHTML=`
    <div class="oxford-verdict-title">── THE VERDICT ──</div>
    ${L}
    <div class="oxford-verdict-winner ${p}">${a}</div>
    ${m}
    <div class="oxford-verdict-text">${d(l)}</div>
    <ul class="oxford-verdict-personas">
      ${(o||[]).map(b=>`<li>${d(b)}</li>`).join("")}
    </ul>
  `,H(e,$)}function ae(e,{summary:s,points:t},{onNewTopic:n,onQuit:r},o={},l,a,p=[]){var f;const h=document.createElement("div");h.className="end-panel",h.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${d(s)}</blockquote>
    ${oe(o)}
    ${le(t,o)}
    <div class="end-actions">
      <div class="end-new-topic-row">
        <input class="end-topic-input" id="consensus-topic-input" type="text" placeholder="New topic…" autocomplete="off" />
        <button class="end-continue-btn" id="consensus-continue">Continue ▶</button>
      </div>
      <div class="end-btn-row">
        ${l?'<button class="end-paper-btn" id="consensus-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="consensus-end">End the evening</button>
      </div>
    </div>
  `,H(e,h);const c=h.querySelector("#consensus-topic-input");c.focus(),h.querySelector("#consensus-continue").addEventListener("click",()=>{const u=c.value.trim();u&&n(u)}),c.addEventListener("keydown",u=>{if(u.key==="Enter"){const v=c.value.trim();v&&n(v)}}),h.querySelector("#consensus-end").addEventListener("click",r),(f=h.querySelector("#consensus-paper"))==null||f.addEventListener("click",()=>K(l,a,p))}function G(e,s,t,n,r,o){var h;j(e);const l=document.createElement("div");l.className="end-panel";const a=s.turn||0,p=a?`${a} turn${a!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${d(p)}</blockquote>
    ${oe(s)}
    ${le([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${r?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,H(e,l),l.querySelector("#game-over-leave").addEventListener("click",n),(h=l.querySelector("#game-over-paper"))==null||h.addEventListener("click",()=>K(r,o,t))}async function De(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(n){alert(`Podcast failed: ${n.message}`)}finally{t.remove()}}async function K(e,s,t=[]){const n=document.createElement("div");n.className="newspaper-overlay",n.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(n);let r;try{r=await s.fetchNewspaper(e)}catch(o){n.remove(),alert(`Could not print the paper: ${o.message}`);return}n.innerHTML=`
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
          ${t.map(o=>`
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/newspaper_portraits/${encodeURIComponent(o.replace(/ /g,"_"))}.png"
                   alt="${d(o)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${d(o)}</div>
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
  `,n.querySelector("#newspaper-close").addEventListener("click",()=>n.remove()),n.addEventListener("click",o=>{o.target===n&&n.remove()}),n.querySelector("#newspaper-download").addEventListener("click",()=>{var a,p;const o=n.querySelector(".newspaper-modal").cloneNode(!0);o.querySelectorAll("img").forEach(h=>{h.src&&!h.src.startsWith("http")&&(h.src=window.location.origin+h.getAttribute("src"))}),(a=o.querySelector("#newspaper-close"))==null||a.remove(),(p=o.querySelector("#newspaper-download"))==null||p.remove();const l=window.open("","_blank");l.document.write(`<!DOCTYPE html>
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
</head><body>${o.outerHTML}</body></html>`),l.document.close(),l.addEventListener("load",()=>{l.focus(),l.print()})})}function oe(e){const{turn:s=0,heat:t=0,concession_total:n=0}=e;if(!s)return"";const r=de(t),o=pe(t);return`
    <div class="end-scoreboard">
      <div class="end-stat">
        <span class="end-stat-num">${s}</span>
        <span class="end-stat-lbl">turns</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num" style="color:${r}">${t}<span class="end-stat-denom">/10</span></span>
        <span class="end-stat-lbl">${o}</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num">${n}</span>
        <span class="end-stat-lbl">concessions</span>
      </div>
    </div>
  `}function le(e,s){const{partial_agreements:t=[],points_of_agreement:n=[],remaining_disagreements:r=[]}=s,o=[...new Set([...e,...n])];let l="";return o.length&&(l+=`<div class="end-section end-section-agree">
      <div class="end-section-label">agreements reached</div>
      ${o.map(a=>`<div class="end-item-agree">✓ ${d(a)}</div>`).join("")}
    </div>`),t.length&&(l+=`<div class="end-section end-section-partial">
      <div class="end-section-label">alignments that formed</div>
      ${t.map(a=>`<div class="end-partial">
          <span class="end-partial-names">${d(a.participants.join(" + "))}</span>
          <span class="end-partial-on">${d(a.on)}</span>
        </div>`).join("")}
    </div>`),r.length&&(l+=`<div class="end-section end-section-tension">
      <div class="end-section-label">still unresolved</div>
      ${r.map(a=>typeof a=="object"&&a!==null?`<div class="end-tension">
            <span class="end-tension-topic">${d(a.topic)}</span>
            <span class="end-tension-stances">${d(a.participant_a)}: ${d(a.stance_a)} · ${d(a.participant_b)}: ${d(a.stance_b)}</span>
          </div>`:`<div class="end-tension">${d(String(a))}</div>`).join("")}
    </div>`),l}function Be(e,s){j(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${d(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,H(e,t)}function j(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function P(e,s){var $,b;const{topic:t,turn:n=0,heat:r=0,concession_total:o=0,moderator_style:l="socratic",partial_agreements:a=[],points_of_agreement:p=[],remaining_disagreements:h=[],debate_phase:c="",format_roles:f={},oxford_opening_vote:u=null}=s,v={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},E=c&&v[c]?`<div class="sb-phase-banner">${v[c].toUpperCase()}</div>`:"",k=c&&(f.proposition||f.opposition)?'<div class="sb-roles">'+(($=f.proposition)!=null&&$.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${f.proposition.map(y=>d(y)).join(", ")}</div>`:"")+((b=f.opposition)!=null&&b.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${f.opposition.map(y=>d(y)).join(", ")}</div>`:"")+"</div>":"",L=u?`<details class="oxford-opening-banner">
        <summary class="oxford-opening-summary">
          Opening position: <strong>${u.proposition_pct}%</strong> for proposition
        </summary>
        <div class="oxford-opening-detail">
          <div class="oxford-opening-rationale">${d(u.rationale||"")}</div>
          <ul class="oxford-opening-leanings">
            ${(u.persona_leanings||[]).map(y=>`<li>${d(y)}</li>`).join("")}
          </ul>
        </div>
      </details>`:"";let m=`
    ${E}
    ${k}
    ${L}
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${d(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${n}</div>
  `;p.length&&(m+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${p.map(y=>`<div class="sb-agree-item">✓ ${d(y)}</div>`).join("")}
      </div>
    `),a.length&&(m+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${a.map(y=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${d(y.participants.join(" + "))}</div>
            <div class="sb-partial-on">${d(y.on)}</div>
          </div>
        `).join("")}
      </div>
    `),h.length&&(m+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${h.map(y=>typeof y=="object"&&y!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${d(y.topic)}</div>
                <div class="sb-tension-stance">${d(y.participant_a)}: ${d(y.stance_a)}</div>
                <div class="sb-tension-stance">${d(y.participant_b)}: ${d(y.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${d(String(y))}</div>`).join("")}
      </div>
    `),m+=`
    <div class="sb-section" id="sb-bars">
      ${ce(r,o)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${d(l)}</div>
    </div>
  `,e.innerHTML=m}function F(e){return d(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function H(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ce(e,s){const t=de(e),n=pe(e),r="█".repeat(e),o="░".repeat(10-e),l=Math.min(s,10),a=ze(s),p="█".repeat(l),h="░".repeat(10-l),c=We(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${r}</span><span class="sb-heat-empty">${o}</span>
      <span class="sb-heat-label" style="color:${t}">${n}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${a}">${p}</span><span class="sb-heat-empty">${h}</span>
      <span class="sb-heat-label" style="color:${a}">${c} (${s})</span>
    </div>
  `}function Ge(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=ce(s,t))}function de(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function pe(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function ze(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function We(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Ye(e,s){const{turn:t,heat:n,partial_agreements:r,remaining_disagreements:o,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const a=r||[],p=o||[];if(a.length&&p.length){const c=a[0],f=p[0],u=c.participants.join(" and "),v=typeof f=="object"?f.topic:String(f);return`${u} are finding common ground, but the group remains divided on ${v}.`}if(a.length){const c=a[0];return`${c.participants.join(" and ")} are converging on ${c.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(p.length){const c=p[0];return typeof c=="object"?`${c.participant_a} and ${c.participant_b} are sharply divided over ${c.topic}.`:`The room is deadlocked — ${String(c)}.`}const h=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${h}.`}const z=document.querySelector("#app");let W={};async function ue(){let e,s;try{[e,s,W]=await Promise.all([he(),ge(),fe()])}catch(r){z.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${r.message}</div>`;return}const t=!!W.local,n=Te(z,e,async({characters:r,topic:o,commentator:l=!0,moderator:a=!0,diagrams:p=!1,audienceLevel:h="university",philosopherLength:c="normal",commentatorLength:f="normal",moderatorLength:u="normal",debateFormat:v="",formatRoles:E=null})=>{try{const k=await be(r,o,l,a,p,h,c,f,u,v,E);Qe(k.session_id,r,o,s)}catch(k){n.showError(`Could not start session: ${k.message}`)}},{isLocal:t})}function Qe(e,s,t,n){je(z,e,s,t,n,{steer:ye,cheat:xe,deleteSession:Ee,newTopic:we,openStream:Le,searchEvidence:$e,fetchNewspaper:Se,exportPodcast:W.podcast?ke:null,isLocal:!!W.local}),z.addEventListener("debate:quit",()=>ue(),{once:!0})}ue();
