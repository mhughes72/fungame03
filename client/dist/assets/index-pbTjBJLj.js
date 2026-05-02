(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const p of i.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&n(p)}).observe(document,{childList:!0,subtree:!0});function t(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=t(r);fetch(r.href,i)}})();const H="/api";async function N(e,s){const t=await fetch(`${H}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const n=await t.text();throw new Error(`${t.status} ${t.statusText}: ${n}`)}return t.json()}async function te(e){await fetch(`${H}${e}`,{method:"DELETE"})}async function B(e=0){const s=await fetch(`${H}/debate-of-the-day?index=${e}`);if(!s.ok)throw new Error("Failed to load debate of the day");return s.json()}async function se(){const e=await fetch(`${H}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function ae(){const e=await fetch(`${H}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function ne(e,s,t=!0,n=!0,r=!1){return N("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:n,diagrams_enabled:r})}async function re(e,s,t,n="",r={}){return N(`/sessions/${e}/steer`,{text:s,style:t,evidence:n,drinks:r})}async function ie(e){return N("/search",{query:e})}async function oe(e,s){return N(`/sessions/${e}/new-topic`,{topic:s})}async function ce(e){return te(`/sessions/${e}`)}async function le(e){return N(`/sessions/${e}/newspaper`,{})}async function de(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const i=await s.json().catch(()=>({detail:s.statusText}));throw new Error(i.detail||s.statusText)}const t=await s.blob(),n=URL.createObjectURL(t),r=document.createElement("a");r.href=n,r.download="philosophers-bar-podcast.mp3",document.body.appendChild(r),r.click(),r.remove(),URL.revokeObjectURL(n)}async function pe(e,s,t={}){const n={drinks:t};return s!==null&&(n.heat=s),N(`/sessions/${e}/cheat`,n)}function ue(e,s){const t=new EventSource(`${H}/sessions/${e}/stream`);return t.onmessage=n=>{try{const r=JSON.parse(n.data);s(r)}catch{console.error("Unparseable SSE frame:",n.data)}},t.onerror=n=>{console.error("SSE error",n),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const G="https://github.com/mhughes72/fungame03";function W(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function n(){t.remove()}t.querySelector(".info-close").addEventListener("click",n),t.addEventListener("click",r=>{r.target===t&&n()}),document.addEventListener("keydown",function r(i){i.key==="Escape"&&(n(),document.removeEventListener("keydown",r))})}function Q(){W("ABOUT",`
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
    <p><a class="info-link" href="${G}" target="_blank" rel="noopener">${G}</a></p>
  `)}function K(){W("HOW TO PLAY",`
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
  `)}function me(e,s,t){e.innerHTML=`
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
            <label class="char-row" data-name="${o.name.toLowerCase()}" data-desc="${I(o.known_for)}">
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
            <span class="toggle-desc">characters produce supporting images</span>
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
  `;const n=e.querySelectorAll("#char-list input[type=checkbox]"),r=e.querySelectorAll(".char-row"),i=e.querySelector("#char-no-results"),p=e.querySelector("#char-filter");p.addEventListener("input",()=>{const o=p.value.toLowerCase().trim();let w=0;r.forEach(L=>{const T=!o||L.dataset.name.includes(o);L.style.display=T?"":"none",T&&w++}),i.style.display=w===0?"":"none"});const a=document.createElement("div");a.className="char-tooltip",a.style.display="none",document.body.appendChild(a);function l(o){const w=o.currentTarget.dataset.desc;w&&(a.textContent=w,a.style.display="block",m(o))}function m(o){const L=a.offsetWidth,T=a.offsetHeight;let P=o.clientX+14,R=o.clientY+14;P+L>window.innerWidth-14&&(P=o.clientX-L-14),R+T>window.innerHeight-14&&(R=o.clientY-T-14),a.style.left=P+"px",a.style.top=R+"px"}function u(){a.style.display="none"}r.forEach(o=>{o.addEventListener("mouseenter",l),o.addEventListener("mousemove",m),o.addEventListener("mouseleave",u)});const c=new MutationObserver(()=>{document.body.contains(e)||(a.remove(),c.disconnect())});c.observe(document.body,{childList:!0,subtree:!0});const h=e.querySelector("#selection-hint"),f=e.querySelector("#start-btn"),E=e.querySelector("#setup-error");function g(){const o=[...n].filter(w=>w.checked).length;o<2?(h.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",h.classList.remove("hint-ok","hint-warn")):o>4?(h.textContent=`Too many — deselect ${o-4}`,h.classList.add("hint-warn"),h.classList.remove("hint-ok")):(h.textContent=`${o} selected`,h.classList.add("hint-ok"),h.classList.remove("hint-warn")),f.disabled=o<2||o>4}g(),n.forEach(o=>o.addEventListener("change",g));function y(){return{commentator:e.querySelector("#toggle-commentator").checked,moderator:e.querySelector("#toggle-moderator").checked,diagrams:e.querySelector("#toggle-diagrams").checked}}f.addEventListener("click",()=>{const o=[...n].filter(L=>L.checked).map(L=>L.value),w=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";E.textContent="",t({characters:o,topic:w,...y()})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!f.disabled&&f.click()}),e.querySelector("#setup-about").addEventListener("click",Q),e.querySelector("#setup-help").addEventListener("click",K);const v=e.querySelector("#dotd-card"),$={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let S=0;function k(o){const w=$[o.category]||"var(--text-dim)";v.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── DEBATE OF THE DAY ──</span>
        <span class="dotd-category" style="color:${w}">${o.category.toUpperCase()}</span>
      </div>
      <div class="dotd-cast">${o.characters.join(" · ")}</div>
      <div class="dotd-topic">${I(o.topic)}</div>
      <div class="dotd-tagline">${I(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Generate new one ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,v.querySelector("#dotd-start").addEventListener("click",()=>{t({characters:o.characters,topic:o.topic,...y()})}),v.querySelector("#dotd-new").addEventListener("click",()=>{S++,b(S)})}function b(o){v.innerHTML='<div class="dotd-loading">generating…</div>',B(o).then(k).catch(()=>{o===0?v.style.display="none":(S--,B(S).then(k).catch(()=>{v.style.display="none"}))})}return b(0),{showError(o){E.textContent=o}}}function I(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function he(e,s,t="",n,r=null,i=[]){return new Promise(p=>{const a=document.createElement("div");a.className="steer-drawer",a.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${q(t)}</div>`:""}

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
        ${s.map(v=>`
          <button
            class="style-item${v.style===e?" style-selected":""}"
            data-style="${q(v.style)}"
          >
            <span class="style-name">${q(v.style)}</span>
            <span class="style-desc">${q(v.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(n||document.body).appendChild(a);const m=a.querySelector("#steer-text-input"),u=a.querySelector("#evidence-query"),c=a.querySelector("#evidence-search"),h=a.querySelector("#evidence-preview");m.focus();let f=e,E="";async function g(){const v=u.value.trim();if(!(!v||!r)){c.disabled=!0,c.textContent="Searching…",h.style.display="none",E="";try{const $=await r(v);E=$.finding,h.style.display="block",h.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${q($.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,h.querySelector("#evidence-accept").addEventListener("click",()=>{h.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${q(E)}</div>`}),h.querySelector("#evidence-discard").addEventListener("click",()=>{E="",h.style.display="none"})}catch($){h.style.display="block",h.textContent=`Search failed: ${$.message}`}finally{c.disabled=!1,c.textContent="Search"}}}c.addEventListener("click",g),u.addEventListener("keydown",v=>{v.key==="Enter"&&g()}),a.querySelectorAll(".style-item").forEach(v=>{v.addEventListener("click",()=>{a.querySelectorAll(".style-item").forEach($=>$.classList.remove("style-selected")),v.classList.add("style-selected"),f=v.dataset.style,y()})});function y(){const v=m.value.trim();a.remove(),p({text:v,style:f,evidence:E})}a.querySelector("#steer-submit").addEventListener("click",y),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),p(null)}),m.addEventListener("keydown",v=>{v.key==="Enter"&&y()})})}function A(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const z=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function ve(e,s,t,n,r=null,i=null){return new Promise(p=>{var f,E;const a={};t.forEach(g=>{a[g]=0});const l=document.createElement("div");l.className="cheat-overlay",l.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${z[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(g=>`
            <div class="drink-row">
              <span class="drink-name">${A(g)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${A(g)}">−</button>
                <span class="drink-count" id="drink-count-${A(g.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${A(g)}">+</button>
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
    `,document.body.appendChild(l);const m=l.querySelector("#cheat-heat-slider"),u=l.querySelector("#cheat-heat-value");m.addEventListener("input",()=>{const g=parseInt(m.value,10);u.textContent=`${g} — ${z[g]}`}),l.querySelectorAll(".drink-btn").forEach(g=>{g.addEventListener("click",()=>{const y=g.dataset.name,v=g.classList.contains("drink-plus")?1:-1;a[y]=Math.max(0,(a[y]||0)+v);const $=y.replace(/ /g,"_"),S=l.querySelector(`#drink-count-${$}`);S&&(S.textContent=a[y])})});function c(){l.remove(),p()}async function h(){const g=parseInt(m.value,10),y=Object.fromEntries(Object.entries(a).filter(([,$])=>$>0)),v=g!==s;try{await n(e,v?g:null,y)}catch($){console.error("Cheat failed:",$)}c()}l.querySelector("#cheat-apply").addEventListener("click",h),l.querySelector("#cheat-close").addEventListener("click",c),(f=l.querySelector("#cheat-paper"))==null||f.addEventListener("click",()=>{c(),r()}),(E=l.querySelector("#cheat-podcast"))==null||E.addEventListener("click",()=>{c(),i()}),l.addEventListener("click",g=>{g.target===l&&c()})})}function ge(e,s){e.innerHTML=s.map(a=>{const l=be(a),m=fe(a);return`
      <div class="seat" id="seat-${Y(a)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${l}" alt="${U(a)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${U(m)}</div>
        </div>
        <div class="seat-name">${U(ye(a))}</div>
      </div>
    `}).join("");let t=null;function n(a){return e.querySelector(`#seat-${Y(a)}`)}function r(){clearTimeout(t),e.querySelectorAll(".seat").forEach(a=>{a.classList.remove("seat-thinking","seat-speaking")})}function i(a){var l;r(),(l=n(a))==null||l.classList.add("seat-thinking")}function p(a){r();const l=n(a);l&&(l.classList.add("seat-speaking"),t=setTimeout(()=>l.classList.remove("seat-speaking"),3e3))}return{setThinking:i,setSpeaking:p,clearAll:r}}function be(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function fe(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function ye(e){return e.split(" ").at(-1)}function Y(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function U(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function we(e,s,t,n,r,i){e.innerHTML=`
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
  `;const p=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),l=e.querySelector("#sidebar"),m=e.querySelector("#left-col");let u="socratic",c=0,h=null,f=!1,E=!1,g={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const y=ge(p,t);j(l,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const k=document.createElement("div");k.id="debate-starting",k.className="debate-starting",k.innerHTML='<span class="debate-starting-text">Opening the bar</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>',a.appendChild(k)}function v(){var k;(k=a.querySelector("#debate-starting"))==null||k.remove()}function $({type:k,data:b}){switch(k){case"speaker":v(),y.setThinking(b.name),qe(a,b.name);break;case"message":v(),C(a),b.backchannel||y.setSpeaking(b.name),$e(a,b);break;case"bars":c=b.heat??c,_e(l,b.heat,b.concession_total??0);break;case"debug":{const o=b.data!=null?b.data:"",w=typeof o=="object"?`
`+Object.entries(o).map(([L,T])=>`  ${L}: ${JSON.stringify(T)}`).join(`
`):o?` — ${o}`:"";console.log(`[${b.channel}] ${b.label}${w}`);break}case"state":C(a),u=b.moderator_style,c=b.heat??c,g=b,j(l,{topic:n,...b});break;case"steer_needed":if(E)break;E=!0,u=b.current_style,b.drift_topic&&(_(a,`── DRIFT ── conversation has shifted to: ${b.drift_topic}`),_(a,`   original topic: ${n}`)),a.scrollTop=a.scrollHeight,he(u,r,Ne(g),m,i.searchEvidence,t).then(o=>{E=!1,o===null?D(a,g,t,S,s,i):(u=o.style,j(l,{topic:n,...g,moderator_style:o.style}),i.steer(s,o.text,o.style,o.evidence||"",o.drinks||{}).catch(w=>_(a,`Steer error: ${w.message}`)))});break;case"consensus":if(f)break;f=!0,h&&(h(),h=null),C(a),y.clearAll(),xe(a,b,{onNewTopic(o){i.newTopic(s,o).then(()=>{f=!1,g={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=o,j(l,{topic:o,...g,moderator_style:u,points_of_agreement:[]}),y.clearAll(),h=i.openStream(s,$)}).catch(w=>_(a,`Error: ${w.message}`))},onQuit:S},g,s,i,t);break;case"game_over":if(f)break;f=!0,h&&(h(),h=null),C(a),y.clearAll(),D(a,b,t,S,s,i);break;case"bar_beat":v(),Ee(a,b.text);break;case"commentator":v(),Se(a,b.text);break;case"evidence":v(),ke(a,b.finding);break;case"diagram":v(),Le(a,b);break;case"system":v(),_(a,b.text);break;case"error":v(),_(a,`⚠ ${b.text}`);break}}function S(){h&&h(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",Q),e.querySelector("#help-btn").addEventListener("click",K),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const b=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=b?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{ve(s,c,t,i.cheat,()=>F(s,i,t),()=>Te(s,i))}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(f){S();return}g.turn>0?(f=!0,h&&(h(),h=null),D(a,g,t,S,s,i)):S()}),h=i.openStream(s,$)}function $e(e,{role:s,name:t,content:n,backchannel:r}){const i=document.createElement("div");if(r)i.className="msg msg-bc",i.innerHTML=`<span class="bc-name">${d(t)}:</span> <em>${O(n)}</em>`;else if(s==="moderator")i.className="msg msg-moderator",i.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${O(n)}</div>`;else if(s==="user")i.className="msg msg-user",i.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${O(n)}</div>`;else{const p=`/portraits/${t.replace(/ /g,"_")}.png`,a=t.split(" ").map(l=>l[0]).join("").slice(0,2).toUpperCase();i.className="msg msg-philosopher",i.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${p}" alt="${d(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${d(a)}</div></div><div class="msg-body"><div class="msg-name">${d(t)}</div><div class="msg-content">${O(n)}</div></div>`}x(e,i)}function Ee(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=O(s),x(e,t)}function _(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,x(e,t)}function Se(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${d(s)}</span>`,x(e,t)}function ke(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${d(s)}`,x(e,t)}function Le(e,{speaker:s,title:t,thumb_url:n,url:r,page_url:i}){const p=document.createElement("div");p.className="msg msg-diagram",p.innerHTML=`<div class="diagram-label">${d(s)} produces a diagram</div><a class="diagram-link" href="${d(i)}" target="_blank" rel="noopener"><img class="diagram-img" src="${d(n)}" alt="${d(t)}" /><div class="diagram-caption">${d(t)}</div></a>`,x(e,p)}function xe(e,{summary:s,points:t},{onNewTopic:n,onQuit:r},i={},p,a,l=[]){const m=document.createElement("div");m.className="consensus-panel",m.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${d(s)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(c=>`<li>${d(c)}</li>`).join("")}
      </ul>
    `:""}
    ${J(i)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="newspaper-btn" id="consensus-paper">Read the morning paper 📰</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,x(e,m);const u=m.querySelector("#consensus-topic-input");u.focus(),m.querySelector("#consensus-continue").addEventListener("click",()=>{const c=u.value.trim();c&&n(c)}),u.addEventListener("keydown",c=>{if(c.key==="Enter"){const h=u.value.trim();h&&n(h)}}),m.querySelector("#consensus-end").addEventListener("click",r),m.querySelector("#consensus-paper").addEventListener("click",()=>F(p,a,l))}function D(e,s,t,n,r,i){var m;C(e);const p=document.createElement("div");p.className="game-over-panel";const a=s.turn||0,l=a?`${a} turn${a!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";p.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${d(l)}</div>
    ${J(s)}
    <div class="game-over-actions">
      ${r?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,x(e,p),p.querySelector("#game-over-leave").addEventListener("click",n),r&&((m=p.querySelector("#game-over-paper"))==null||m.addEventListener("click",()=>F(r,i,t)))}async function Te(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(n){alert(`Podcast failed: ${n.message}`)}finally{t.remove()}}async function F(e,s,t=[]){const n=document.createElement("div");n.className="newspaper-overlay",n.innerHTML=`
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
</head><body>${i.outerHTML}</body></html>`),p.document.close(),p.addEventListener("load",()=>{p.focus(),p.print()})})}function J(e){const{turn:s=0,heat:t=0,partial_agreements:n=[],points_of_agreement:r=[],remaining_disagreements:i=[]}=e;if(!s)return"";const p=Z(t),a=X(t),l="█".repeat(t),m="░".repeat(10-t);let u='<div class="report-stats">';return u+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,u+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${a}">${l}<span style="color:var(--text-dim)">${m}</span> ${p}</span>
  </div>`,r.length&&(u+='<div class="report-section-label">agreements reached</div>',u+=r.map(c=>`<div class="report-agree-item">✓ ${d(c)}</div>`).join("")),n.length&&(u+='<div class="report-section-label">alignments that formed</div>',u+=n.map(c=>`<div class="report-partial"><span class="report-partial-names">${d(c.participants.join(" + "))}</span> — <span class="report-partial-on">${d(c.on)}</span></div>`).join("")),i.length&&(u+='<div class="report-section-label">still unresolved</div>',u+=i.map(c=>typeof c=="object"&&c!==null?`<div class="report-tension">
          <span class="report-tension-topic">${d(c.topic)}</span>
          <span class="report-tension-stance">${d(c.participant_a)}: ${d(c.stance_a)}</span>
          <span class="report-tension-stance">${d(c.participant_b)}: ${d(c.stance_b)}</span>
        </div>`:`<div class="report-tension">${d(String(c))}</div>`).join("")),u+="</div>",u}function qe(e,s){C(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${d(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,x(e,t)}function C(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function j(e,s){const{topic:t,turn:n=0,heat:r=0,concession_total:i=0,moderator_style:p="socratic",partial_agreements:a=[],points_of_agreement:l=[],remaining_disagreements:m=[]}=s;let u=`
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
      ${V(r,i)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${d(p)}</div>
    </div>
  `,e.innerHTML=u}function O(e){return d(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function x(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function V(e,s){const t=X(e),n=Z(e),r="█".repeat(e),i="░".repeat(10-e),p=Math.min(s,10),a=Ce(s),l="█".repeat(p),m="░".repeat(10-p),u=He(s);return`
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
  `}function _e(e,s,t){const n=e.querySelector("#sb-bars");n&&(n.innerHTML=V(s,t))}function X(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function Z(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Ce(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function He(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Ne(e,s){const{turn:t,heat:n,partial_agreements:r,remaining_disagreements:i,drift_topic:p}=e;if(!t)return"The debate is just getting started.";if(p)return`The conversation has drifted from the original topic toward ${p}.`;const a=r||[],l=i||[];if(a.length&&l.length){const u=a[0],c=l[0],h=u.participants.join(" and "),f=typeof c=="object"?c.topic:String(c);return`${h} are finding common ground, but the group remains divided on ${f}.`}if(a.length){const u=a[0];return`${u.participants.join(" and ")} are converging on ${u.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(l.length){const u=l[0];return typeof u=="object"?`${u.participant_a} and ${u.participant_b} are sharply divided over ${u.topic}.`:`The room is deadlocked — ${String(u)}.`}const m=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${m}.`}const M=document.querySelector("#app");async function ee(){let e,s;try{[e,s]=await Promise.all([se(),ae()])}catch(n){M.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=me(M,e,async({characters:n,topic:r,commentator:i=!0,moderator:p=!0,diagrams:a=!1})=>{try{const l=await ne(n,r,i,p,a);Oe(l.session_id,n,r,s)}catch(l){t.showError(`Could not start session: ${l.message}`)}})}function Oe(e,s,t,n){we(M,e,s,t,n,{steer:re,cheat:pe,deleteSession:ce,newTopic:oe,openStream:ue,searchEvidence:ie,fetchNewspaper:le,exportPodcast:de}),M.addEventListener("debate:quit",()=>ee(),{once:!0})}ee();
