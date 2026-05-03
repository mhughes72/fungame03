(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const l of o.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function t(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(r){if(r.ep)return;r.ep=!0;const o=t(r);fetch(r.href,o)}})();const j="/api";async function U(e,s){const t=await fetch(`${j}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function me(e){await fetch(`${j}${e}`,{method:"DELETE"})}async function he(e=null){const s=e?`${j}/topics?level=${encodeURIComponent(e)}`:`${j}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function ve(){const e=await fetch(`${j}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function ge(){const e=await fetch(`${j}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function be(){const e=await fetch(`${j}/features`);return e.ok?e.json():{}}async function fe(e,s,t=!0,n=!0,r=!1,o="university",l="normal",a="normal",p="normal",m="",c=null){return U("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:n,diagrams_enabled:r,audience_level:o,philosopher_length:l,commentator_length:a,moderator_length:p,debate_format:m,format_roles:c})}async function ye(e,s,t,n="",r={}){return U(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:r})}async function we(e){return U("/search",{query:e})}async function $e(e,s){return U(`/sessions/${e}/new-topic`,{topic:s})}async function Ee(e){return me(`/sessions/${e}`)}async function Se(e){return U(`/sessions/${e}/newspaper`,{})}async function ke(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const o=await s.json().catch(()=>({detail:s.statusText}));throw new Error(o.detail||s.statusText)}const t=await s.blob(),n=URL.createObjectURL(t),r=document.createElement("a");r.href=n,r.download="philosophers-bar-podcast.mp3",document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(n)}async function Le(e,s,t={}){const n={drinks:t};return s!==null&&(n.heat=s),U(`/sessions/${e}/cheat`,n)}function xe(e,s){const t=new EventSource(`${j}/sessions/${e}/stream`);return t.onmessage=n=>{try{const r=JSON.parse(n.data);s(r)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const ee="https://github.com/mhughes72/fungame03";function ne(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
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
  `)}function qe(e,s,t,{isLocal:n=!1}={}){e.innerHTML=`
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
  `;const r=e.querySelectorAll("#char-list input[type=checkbox]"),o=e.querySelectorAll(".char-row"),l=e.querySelector("#char-no-results"),a=e.querySelector("#char-filter");a.addEventListener("input",()=>{const i=a.value.toLowerCase().trim();let S=0;o.forEach($=>{const C=!i||$.dataset.name.includes(i);$.style.display=C?"":"none",C&&S++}),l.style.display=S===0?"":"none"});const p=document.createElement("div");p.className="char-tooltip",p.style.display="none",document.body.appendChild(p);function m(i){const{desc:S,category:$,portrait:C}=i.currentTarget.dataset;if(!S)return;const q=`/portraits/${C}.png`;p.innerHTML=`
      <div class="tt-inner">
        <img class="tt-portrait" src="${q}" alt="" onerror="this.style.display='none'" />
        <div class="tt-body">
          ${$?`<span class="tt-category">${M($)}</span>`:""}
          <span class="tt-desc">${M(S)}</span>
        </div>
      </div>`,p.style.display="block",c(i)}function c(i){const $=p.offsetWidth,C=p.offsetHeight;let q=i.clientX+14,_=i.clientY+14;q+$>window.innerWidth-14&&(q=i.clientX-$-14),_+C>window.innerHeight-14&&(_=i.clientY-C-14),p.style.left=q+"px",p.style.top=_+"px"}function f(){p.style.display="none"}o.forEach(i=>{i.addEventListener("mouseenter",m),i.addEventListener("mousemove",c),i.addEventListener("mouseleave",f)});const u=new MutationObserver(()=>{document.body.contains(e)||(p.remove(),u.disconnect())});u.observe(document.body,{childList:!0,subtree:!0}),e.querySelector("#setup-format").style.display="",n&&(e.querySelector("#setup-lengths").style.display="");const v=e.querySelector("#selection-hint"),k=e.querySelector("#start-btn"),E=e.querySelector("#setup-error");function x(){const i=[...r].filter(S=>S.checked).length;i<2?(v.textContent=i===0?"Select 2 to 4 thinkers":"Select 1 more",v.classList.remove("hint-ok","hint-warn")):i>4?(v.textContent=`Too many — deselect ${i-4}`,v.classList.add("hint-warn"),v.classList.remove("hint-ok")):(v.textContent=`${i} selected`,v.classList.add("hint-ok"),v.classList.remove("hint-warn")),k.disabled=i<2||i>4}const h=e.querySelector("#char-list"),b=e.querySelector("#char-filter"),y=e.querySelector("#topic-input");function H(i){h.classList.toggle("oxford-locked",i),b.disabled=i,y.disabled=i,r.forEach(S=>{S.disabled=i}),i?(k.disabled=!0,v.textContent="Select a suggested Oxford debate below",v.classList.remove("hint-ok","hint-warn")):x()}x(),r.forEach(i=>i.addEventListener("change",x));function T(){const i=e.querySelector('input[name="audience"]:checked'),S=e.querySelector('input[name="phil-length"]:checked'),$=e.querySelector('input[name="comm-length"]:checked'),C=e.querySelector('input[name="mod-length"]:checked'),q=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:i?i.value:"university",philosopherLength:S?S.value:"normal",commentatorLength:$?$.value:"normal",moderatorLength:C?C.value:"normal",debateFormat:q?q.value:""}}k.addEventListener("click",()=>{const i=[...r].filter($=>$.checked).map($=>$.value),S=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";E.textContent="",t({characters:i,topic:S,...T()})}),e.querySelector("#topic-input").addEventListener("keydown",i=>{i.key==="Enter"&&!k.disabled&&k.click()}),e.querySelector("#setup-about").addEventListener("click",re),e.querySelector("#setup-help").addEventListener("click",ie);const w=e.querySelector("#dotd-card"),g={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let L=[],A=null;function B(){const i=e.querySelector('input[name="audience"]:checked');return i?i.value:"university"}function Y(){const i=e.querySelector('input[name="debate-format"]:checked');return i?i.value:""}function J(i){const S=Y();return L.filter($=>$.audience_level===i&&(S==="oxford"?$.format==="oxford":$.format!=="oxford"))}function X(i,S=null){if(!i.length)return null;const $=S?i.filter(_=>_.id!==S.id):i,C=$.length?$:i,q=[];for(const _ of C)q.push(_),_.source==="curated"&&(q.push(_),q.push(_));return q[Math.floor(Math.random()*q.length)]}function Z(i){A=i;const S=g[i.category]||"var(--text-dim)",$=i.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',C=i.format==="oxford"?'<span class="dotd-oxford">Oxford</span>':"",q=i.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${i.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${i.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${i.characters.join(" · ")}</div>`;w.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── SUGGESTED DEBATE ──</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${S}">${i.category.toUpperCase()}</span>
          ${C}
          ${$}
        </span>
      </div>
      ${q}
      <div class="dotd-topic">${M(i.topic)}</div>
      <div class="dotd-tagline">${M(i.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Next suggestion ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,w.querySelector("#dotd-start").addEventListener("click",()=>{const _=i.format==="oxford"?"oxford":"";t({characters:i.characters,topic:i.topic,...T(),debateFormat:_,formatRoles:i.roles||null})}),w.querySelector("#dotd-new").addEventListener("click",()=>{const _=X(J(B()),A);_&&Z(_)})}function Q(){const i=X(J(B()));i?Z(i):w.style.display="none"}return he().then(i=>{L=i,Q()}).catch(()=>{w.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(i=>{i.addEventListener("change",Q)}),e.querySelectorAll('input[name="debate-format"]').forEach(i=>{i.addEventListener("change",()=>{H(i.value==="oxford"&&i.checked),Q()})}),{showError(i){E.textContent=i}}}function M(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function P(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Te(e,s,t="",n,r=null,o=[]){return new Promise(l=>{const a=document.createElement("div");a.className="steer-drawer",a.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${P(t)}</div>`:""}

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
            data-style="${P(h.style)}"
          >
            <span class="style-name">${P(h.style)}</span>
            <span class="style-desc">${P(h.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(n||document.body).appendChild(a);const m=a.querySelector("#steer-text-input"),c=a.querySelector("#evidence-query"),f=a.querySelector("#evidence-search"),u=a.querySelector("#evidence-preview");m.focus();let v=e,k="";async function E(){const h=c.value.trim();if(!(!h||!r)){f.disabled=!0,f.textContent="Searching…",u.style.display="none",k="";try{const b=await r(h);k=b.finding,u.style.display="block",u.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${P(b.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,u.querySelector("#evidence-accept").addEventListener("click",()=>{u.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${P(k)}</div>`}),u.querySelector("#evidence-discard").addEventListener("click",()=>{k="",u.style.display="none"})}catch(b){u.style.display="block",u.textContent=`Search failed: ${b.message}`}finally{f.disabled=!1,f.textContent="Search"}}}f.addEventListener("click",E),c.addEventListener("keydown",h=>{h.key==="Enter"&&E()}),a.querySelectorAll(".style-item").forEach(h=>{h.addEventListener("click",()=>{a.querySelectorAll(".style-item").forEach(b=>b.classList.remove("style-selected")),h.classList.add("style-selected"),v=h.dataset.style,x()})});function x(){const h=m.value.trim();a.remove(),l({text:h,style:v,evidence:k})}a.querySelector("#steer-submit").addEventListener("click",x),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),l(null)}),m.addEventListener("keydown",h=>{h.key==="Enter"&&x()})})}function I(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const te=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function _e(e,s,t,n,r=null,o=null,l=null,a=null){return new Promise(p=>{var E,x,h,b;const m={};t.forEach(y=>{m[y]=0});const c=document.createElement("div");c.className="cheat-overlay",c.innerHTML=`
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
          ${t.map(y=>`
            <div class="drink-row">
              <span class="drink-name">${I(y)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${I(y)}">−</button>
                <span class="drink-count" id="drink-count-${I(y.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${I(y)}">+</button>
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
    `,document.body.appendChild(c);const f=c.querySelector("#cheat-heat-slider"),u=c.querySelector("#cheat-heat-value");f.addEventListener("input",()=>{const y=parseInt(f.value,10);u.textContent=`${y} — ${te[y]}`}),c.querySelectorAll(".drink-btn").forEach(y=>{y.addEventListener("click",()=>{const H=y.dataset.name,T=y.classList.contains("drink-plus")?1:-1;m[H]=Math.max(0,(m[H]||0)+T);const w=H.replace(/ /g,"_"),g=c.querySelector(`#drink-count-${w}`);g&&(g.textContent=m[H])})});function v(){c.remove(),p()}async function k(){const y=parseInt(f.value,10),H=Object.fromEntries(Object.entries(m).filter(([,w])=>w>0)),T=y!==s;try{await n(e,T?y:null,H)}catch(w){console.error("Cheat failed:",w)}v()}c.querySelector("#cheat-apply").addEventListener("click",k),c.querySelector("#cheat-close").addEventListener("click",v),(E=c.querySelector("#cheat-paper"))==null||E.addEventListener("click",()=>{v(),r()}),(x=c.querySelector("#cheat-podcast"))==null||x.addEventListener("click",()=>{v(),o()}),(h=c.querySelector("#cheat-consensus"))==null||h.addEventListener("click",()=>{v(),a()}),(b=c.querySelector("#cheat-end"))==null||b.addEventListener("click",()=>{v(),l()}),c.addEventListener("click",y=>{y.target===c&&v()})})}function Ce(e,s){e.innerHTML=s.map(a=>{const p=He(a),m=Ne(a);return`
      <div class="seat" id="seat-${se(a)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${p}" alt="${K(a)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${K(m)}</div>
        </div>
        <div class="seat-name">${K(Ae(a))}</div>
      </div>
    `}).join("");let t=null;function n(a){return e.querySelector(`#seat-${se(a)}`)}function r(){clearTimeout(t),e.querySelectorAll(".seat").forEach(a=>{a.classList.remove("seat-thinking","seat-speaking")})}function o(a){var p;r(),(p=n(a))==null||p.classList.add("seat-thinking")}function l(a){r();const p=n(a);p&&(p.classList.add("seat-speaking"),t=setTimeout(()=>p.classList.remove("seat-speaking"),3e3))}return{setThinking:o,setSpeaking:l,clearAll:r}}function He(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Ne(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function Ae(e){return e.split(" ").at(-1)}function se(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function K(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Oe(e,s,t,n,r,o){e.innerHTML=`
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
  `;const l=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),p=e.querySelector("#sidebar"),m=e.querySelector("#left-col");let c="socratic",f=0,u=null,v=!1,k=!1,E="",x={},h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const b=Ce(l,t);R(p,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const w=document.createElement("div");w.id="debate-starting",w.className="debate-starting",w.innerHTML='<span class="debate-starting-text">Opening the bar</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>',a.appendChild(w)}function y(){var w;(w=a.querySelector("#debate-starting"))==null||w.remove()}function H({type:w,data:g}){switch(w){case"speaker":y(),b.setThinking(g.name),Be(a,g.name);break;case"message":y(),O(a),g.backchannel||b.setSpeaking(g.name),je(a,g);break;case"bars":f=g.heat??f,Ie(p,g.heat,g.concession_total??0);break;case"debug":{const L=g.data!=null?g.data:"",A=typeof L=="object"?`
`+Object.entries(L).map(([B,Y])=>`  ${B}: ${JSON.stringify(Y)}`).join(`
`):L?` — ${L}`:"";console.log(`[${g.channel}] ${g.label}${A}`);break}case"phase_update":E=g.debate_phase,x=g.format_roles||{},R(p,{topic:n,...h,debate_phase:E,format_roles:x});break;case"state":O(a),c=g.moderator_style,f=g.heat??f,g.debate_phase&&(E=g.debate_phase),g.format_roles&&Object.keys(g.format_roles).length&&(x=g.format_roles),h={...g,debate_phase:E,format_roles:x},R(p,{topic:n,...h});break;case"steer_needed":if(k)break;k=!0,c=g.current_style,g.drift_topic&&Pe(a,g.drift_topic,n),a.scrollTop=a.scrollHeight,Te(c,r,We(h),m,o.searchEvidence,t).then(L=>{k=!1,L===null?G(a,h,t,T,s,o):(c=L.style,R(p,{topic:n,...h,moderator_style:L.style}),o.steer(s,L.text,L.style,L.evidence||"",L.drinks||{}).catch(A=>F(a,`Steer error: ${A.message}`)))});break;case"consensus":if(v)break;v=!0,u&&(u(),u=null),O(a),b.clearAll(),ae(a,g,{onNewTopic(L){o.newTopic(s,L).then(()=>{v=!1,h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=L,R(p,{topic:L,...h,moderator_style:c,points_of_agreement:[]}),b.clearAll(),u=o.openStream(s,H)}).catch(A=>F(a,`Error: ${A.message}`))},onQuit:T},h,s,o,t);break;case"game_over":if(v)break;v=!0,u&&(u(),u=null),O(a),b.clearAll(),G(a,{...h,...g},t,T,s,o);break;case"bar_beat":y(),Me(a,g.text);break;case"commentator":y(),Re(a,g.text);break;case"evidence":y(),Ue(a,g.finding);break;case"diagram":y(),Fe(a,g);break;case"system":y(),F(a,g.text);break;case"error":y(),F(a,`⚠ ${g.text}`);break}}function T(){u&&u(),o.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",re),e.querySelector("#help-btn").addEventListener("click",ie),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const g=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=g?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{v||_e(s,f,t,o.cheat,()=>V(s,o,t),()=>De(s,o),()=>{v=!0,u&&(u(),u=null),O(a),b.clearAll(),G(a,h,t,T,s,o)},()=>{v=!0,u&&(u(),u=null),O(a),b.clearAll(),ae(a,{summary:"The bar has called it — the evening ends in agreement.",points:h.points_of_agreement||[]},{onNewTopic(w){o.newTopic(s,w).then(()=>{v=!1,h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=w,R(p,{topic:w,...h,moderator_style:c,points_of_agreement:[]}),b.clearAll(),u=o.openStream(s,H)}).catch(g=>F(a,`Error: ${g.message}`))},onQuit:T},h,s,o,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(v){T();return}h.turn>0?(v=!0,u&&(u(),u=null),G(a,h,t,T,s,o)):T()}),u=o.openStream(s,H)}function je(e,{role:s,name:t,content:n,backchannel:r,debate_label:o=""}){const l=document.createElement("div");if(r)l.className="msg msg-bc",l.innerHTML=`<span class="bc-name">${d(t)}:</span> <em>${D(n)}</em>`;else if(s==="moderator")l.className="msg msg-moderator",l.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${D(n)}</div>`;else if(s==="user")l.className="msg msg-user",l.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${D(n)}</div>`;else{const a=`/portraits/${t.replace(/ /g,"_")}.png`,p=t.split(" ").map(f=>f[0]).join("").slice(0,2).toUpperCase(),c=o.includes("Proposition")?"debate-label-prop":"debate-label-opp";l.className="msg msg-philosopher",l.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${a}" alt="${d(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${d(p)}</div></div><div class="msg-body">`+(o?`<div class="msg-debate-label ${c}">${d(o)}</div>`:"")+`<div class="msg-name">${d(t)}</div><div class="msg-content">${D(n)}</div></div>`}N(e,l)}function Me(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=D(s),N(e,t)}function F(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,N(e,t)}function Pe(e,s,t){const n=document.createElement("div");n.className="msg msg-drift",n.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${d(s)}</div><div class="drift-orig">original: ${d(t)}</div>`,N(e,n)}function Re(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${d(s)}</span>`,N(e,t)}function Ue(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${d(s)}`,N(e,t)}function Fe(e,{speaker:s,title:t,thumb_url:n,url:r,page_url:o}){const l=document.createElement("div");l.className="msg msg-diagram",l.innerHTML=`<div class="diagram-label">${d(s)} produces a diagram</div><a class="diagram-link" href="${d(o)}" target="_blank" rel="noopener"><img class="diagram-img" src="${d(n)}" alt="${d(t)}" /><div class="diagram-caption">${d(t)}</div></a>`,N(e,l)}function ae(e,{summary:s,points:t},{onNewTopic:n,onQuit:r},o={},l,a,p=[]){var f;const m=document.createElement("div");m.className="end-panel",m.innerHTML=`
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
  `,N(e,m);const c=m.querySelector("#consensus-topic-input");c.focus(),m.querySelector("#consensus-continue").addEventListener("click",()=>{const u=c.value.trim();u&&n(u)}),c.addEventListener("keydown",u=>{if(u.key==="Enter"){const v=c.value.trim();v&&n(v)}}),m.querySelector("#consensus-end").addEventListener("click",r),(f=m.querySelector("#consensus-paper"))==null||f.addEventListener("click",()=>V(l,a,p))}function G(e,s,t,n,r,o){var m;O(e);const l=document.createElement("div");l.className="end-panel";const a=s.turn||0,p=a?`${a} turn${a!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
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
  `,N(e,l),l.querySelector("#game-over-leave").addEventListener("click",n),(m=l.querySelector("#game-over-paper"))==null||m.addEventListener("click",()=>V(r,o,t))}async function De(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(n){alert(`Podcast failed: ${n.message}`)}finally{t.remove()}}async function V(e,s,t=[]){const n=document.createElement("div");n.className="newspaper-overlay",n.innerHTML=`
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
  `,n.querySelector("#newspaper-close").addEventListener("click",()=>n.remove()),n.addEventListener("click",o=>{o.target===n&&n.remove()}),n.querySelector("#newspaper-download").addEventListener("click",()=>{var a,p;const o=n.querySelector(".newspaper-modal").cloneNode(!0);o.querySelectorAll("img").forEach(m=>{m.src&&!m.src.startsWith("http")&&(m.src=window.location.origin+m.getAttribute("src"))}),(a=o.querySelector("#newspaper-close"))==null||a.remove(),(p=o.querySelector("#newspaper-download"))==null||p.remove();const l=window.open("","_blank");l.document.write(`<!DOCTYPE html>
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
    </div>`),l}function Be(e,s){O(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${d(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,N(e,t)}function O(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function R(e,s){var x,h;const{topic:t,turn:n=0,heat:r=0,concession_total:o=0,moderator_style:l="socratic",partial_agreements:a=[],points_of_agreement:p=[],remaining_disagreements:m=[],debate_phase:c="",format_roles:f={}}=s,u={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},v=c&&u[c]?`<div class="sb-phase-banner">${u[c].toUpperCase()}</div>`:"",k=c&&(f.proposition||f.opposition)?'<div class="sb-roles">'+((x=f.proposition)!=null&&x.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${f.proposition.map(b=>d(b)).join(", ")}</div>`:"")+((h=f.opposition)!=null&&h.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${f.opposition.map(b=>d(b)).join(", ")}</div>`:"")+"</div>":"";let E=`
    ${v}
    ${k}
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${d(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${n}</div>
  `;p.length&&(E+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${p.map(b=>`<div class="sb-agree-item">✓ ${d(b)}</div>`).join("")}
      </div>
    `),a.length&&(E+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${a.map(b=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${d(b.participants.join(" + "))}</div>
            <div class="sb-partial-on">${d(b.on)}</div>
          </div>
        `).join("")}
      </div>
    `),m.length&&(E+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${m.map(b=>typeof b=="object"&&b!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${d(b.topic)}</div>
                <div class="sb-tension-stance">${d(b.participant_a)}: ${d(b.stance_a)}</div>
                <div class="sb-tension-stance">${d(b.participant_b)}: ${d(b.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${d(String(b))}</div>`).join("")}
      </div>
    `),E+=`
    <div class="sb-section" id="sb-bars">
      ${ce(r,o)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${d(l)}</div>
    </div>
  `,e.innerHTML=E}function D(e){return d(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function N(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ce(e,s){const t=de(e),n=pe(e),r="█".repeat(e),o="░".repeat(10-e),l=Math.min(s,10),a=Ge(s),p="█".repeat(l),m="░".repeat(10-l),c=ze(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${r}</span><span class="sb-heat-empty">${o}</span>
      <span class="sb-heat-label" style="color:${t}">${n}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${a}">${p}</span><span class="sb-heat-empty">${m}</span>
      <span class="sb-heat-label" style="color:${a}">${c} (${s})</span>
    </div>
  `}function Ie(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=ce(s,t))}function de(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function pe(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Ge(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function ze(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function We(e,s){const{turn:t,heat:n,partial_agreements:r,remaining_disagreements:o,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const a=r||[],p=o||[];if(a.length&&p.length){const c=a[0],f=p[0],u=c.participants.join(" and "),v=typeof f=="object"?f.topic:String(f);return`${u} are finding common ground, but the group remains divided on ${v}.`}if(a.length){const c=a[0];return`${c.participants.join(" and ")} are converging on ${c.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(p.length){const c=p[0];return typeof c=="object"?`${c.participant_a} and ${c.participant_b} are sharply divided over ${c.topic}.`:`The room is deadlocked — ${String(c)}.`}const m=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${m}.`}const z=document.querySelector("#app");let W={};async function ue(){let e,s;try{[e,s,W]=await Promise.all([ve(),ge(),be()])}catch(r){z.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${r.message}</div>`;return}const t=!!W.local,n=qe(z,e,async({characters:r,topic:o,commentator:l=!0,moderator:a=!0,diagrams:p=!1,audienceLevel:m="university",philosopherLength:c="normal",commentatorLength:f="normal",moderatorLength:u="normal",debateFormat:v="",formatRoles:k=null})=>{try{const E=await fe(r,o,l,a,p,m,c,f,u,v,k);Ye(E.session_id,r,o,s)}catch(E){n.showError(`Could not start session: ${E.message}`)}},{isLocal:t})}function Ye(e,s,t,n){Oe(z,e,s,t,n,{steer:ye,cheat:Le,deleteSession:Ee,newTopic:$e,openStream:xe,searchEvidence:we,fetchNewspaper:Se,exportPodcast:W.podcast?ke:null,isLocal:!!W.local}),z.addEventListener("debate:quit",()=>ue(),{once:!0})}ue();
