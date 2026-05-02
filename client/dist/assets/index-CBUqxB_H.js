(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const u of i.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();const x="/api";async function T(e,s){const t=await fetch(`${x}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const r=await t.text();throw new Error(`${t.status} ${t.statusText}: ${r}`)}return t.json()}async function X(e){await fetch(`${x}${e}`,{method:"DELETE"})}async function P(e=0){const s=await fetch(`${x}/debate-of-the-day?index=${e}`);if(!s.ok)throw new Error("Failed to load debate of the day");return s.json()}async function ee(){const e=await fetch(`${x}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function te(){const e=await fetch(`${x}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function se(e,s){return T("/sessions",{characters:e,topic:s})}async function ae(e,s,t,r="",a={}){return T(`/sessions/${e}/steer`,{text:s,style:t,evidence:r,drinks:a})}async function ne(e){return T("/search",{query:e})}async function re(e,s){return T(`/sessions/${e}/new-topic`,{topic:s})}async function ie(e){return X(`/sessions/${e}`)}async function oe(e){return T(`/sessions/${e}/newspaper`,{})}async function ce(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const i=await s.json().catch(()=>({detail:s.statusText}));throw new Error(i.detail||s.statusText)}const t=await s.blob(),r=URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.download="philosophers-bar-podcast.mp3",document.body.appendChild(a),a.click(),a.remove(),URL.revokeObjectURL(r)}async function le(e,s,t={}){const r={drinks:t};return s!==null&&(r.heat=s),T(`/sessions/${e}/cheat`,r)}function de(e,s){const t=new EventSource(`${x}/sessions/${e}/stream`);return t.onmessage=r=>{try{const a=JSON.parse(r.data);s(a)}catch{console.error("Unparseable SSE frame:",r.data)}},t.onerror=r=>{console.error("SSE error",r),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const U="https://github.com/mhughes72/fungame03";function G(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function r(){t.remove()}t.querySelector(".info-close").addEventListener("click",r),t.addEventListener("click",a=>{a.target===t&&r()}),document.addEventListener("keydown",function a(i){i.key==="Escape"&&(r(),document.removeEventListener("keydown",a))})}function B(){G("ABOUT",`
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
    <p><a class="info-link" href="${U}" target="_blank" rel="noopener">${U}</a></p>
  `)}function z(){G("HOW TO PLAY",`
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
  `;const r=e.querySelectorAll("input[type=checkbox]"),a=e.querySelectorAll(".char-row"),i=e.querySelector("#char-no-results"),u=e.querySelector("#char-filter");u.addEventListener("input",()=>{const d=u.value.toLowerCase().trim();let h=0;a.forEach(b=>{const E=!d||b.dataset.name.includes(d);b.style.display=E?"":"none",E&&h++}),i.style.display=h===0?"":"none"});const n=e.querySelector("#selection-hint"),c=e.querySelector("#start-btn"),m=e.querySelector("#setup-error");function l(){const d=[...r].filter(h=>h.checked).length;d<2?(n.textContent=d===0?"Select 2 to 4 thinkers":"Select 1 more",n.classList.remove("hint-ok","hint-warn")):d>4?(n.textContent=`Too many — deselect ${d-4}`,n.classList.add("hint-warn"),n.classList.remove("hint-ok")):(n.textContent=`${d} selected`,n.classList.add("hint-ok"),n.classList.remove("hint-warn")),c.disabled=d<2||d>4}l(),r.forEach(d=>d.addEventListener("change",l)),c.addEventListener("click",()=>{const d=[...r].filter(b=>b.checked).map(b=>b.value),h=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";m.textContent="",t({characters:d,topic:h})}),e.querySelector("#topic-input").addEventListener("keydown",d=>{d.key==="Enter"&&!c.disabled&&c.click()}),e.querySelector("#setup-about").addEventListener("click",B),e.querySelector("#setup-help").addEventListener("click",z);const o=e.querySelector("#dotd-card"),g={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let y=0;function $(d){const h=g[d.category]||"var(--text-dim)";o.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── DEBATE OF THE DAY ──</span>
        <span class="dotd-category" style="color:${h}">${d.category.toUpperCase()}</span>
      </div>
      <div class="dotd-cast">${d.characters.join(" · ")}</div>
      <div class="dotd-topic">${I(d.topic)}</div>
      <div class="dotd-tagline">${I(d.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Generate new one ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,o.querySelector("#dotd-start").addEventListener("click",()=>{t({characters:d.characters,topic:d.topic})}),o.querySelector("#dotd-new").addEventListener("click",()=>{y++,v(y)})}function v(d){o.innerHTML='<div class="dotd-loading">generating…</div>',P(d).then($).catch(()=>{d===0?o.style.display="none":(y--,P(y).then($).catch(()=>{o.style.display="none"}))})}return v(0),{showError(d){m.textContent=d}}}function I(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ue(e,s,t="",r,a=null,i=[]){return new Promise(u=>{const n=document.createElement("div");n.className="steer-drawer",n.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${k(t)}</div>`:""}

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
            data-style="${k(h.style)}"
          >
            <span class="style-name">${k(h.style)}</span>
            <span class="style-desc">${k(h.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(r||document.body).appendChild(n);const m=n.querySelector("#steer-text-input"),l=n.querySelector("#evidence-query"),o=n.querySelector("#evidence-search"),g=n.querySelector("#evidence-preview");m.focus();let y=e,$="";async function v(){const h=l.value.trim();if(!(!h||!a)){o.disabled=!0,o.textContent="Searching…",g.style.display="none",$="";try{const b=await a(h);$=b.finding,g.style.display="block",g.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${k(b.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,g.querySelector("#evidence-accept").addEventListener("click",()=>{g.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${k($)}</div>`}),g.querySelector("#evidence-discard").addEventListener("click",()=>{$="",g.style.display="none"})}catch(b){g.style.display="block",g.textContent=`Search failed: ${b.message}`}finally{o.disabled=!1,o.textContent="Search"}}}o.addEventListener("click",v),l.addEventListener("keydown",h=>{h.key==="Enter"&&v()}),n.querySelectorAll(".style-item").forEach(h=>{h.addEventListener("click",()=>{n.querySelectorAll(".style-item").forEach(b=>b.classList.remove("style-selected")),h.classList.add("style-selected"),y=h.dataset.style,d()})});function d(){const h=m.value.trim();n.remove(),u({text:h,style:y,evidence:$})}n.querySelector("#steer-submit").addEventListener("click",d),n.querySelector("#steer-quit").addEventListener("click",()=>{n.remove(),u(null)}),m.addEventListener("keydown",h=>{h.key==="Enter"&&d()})})}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const D=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function me(e,s,t,r,a=null,i=null){return new Promise(u=>{var y,$;const n={};t.forEach(v=>{n[v]=0});const c=document.createElement("div");c.className="cheat-overlay",c.innerHTML=`
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
              <span class="drink-name">${H(v)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${H(v)}">−</button>
                <span class="drink-count" id="drink-count-${H(v.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${H(v)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="cheat-footer">
          ${a?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          ${i?'<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>':""}
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(c);const m=c.querySelector("#cheat-heat-slider"),l=c.querySelector("#cheat-heat-value");m.addEventListener("input",()=>{const v=parseInt(m.value,10);l.textContent=`${v} — ${D[v]}`}),c.querySelectorAll(".drink-btn").forEach(v=>{v.addEventListener("click",()=>{const d=v.dataset.name,h=v.classList.contains("drink-plus")?1:-1;n[d]=Math.max(0,(n[d]||0)+h);const b=d.replace(/ /g,"_"),E=c.querySelector(`#drink-count-${b}`);E&&(E.textContent=n[d])})});function o(){c.remove(),u()}async function g(){const v=parseInt(m.value,10),d=Object.fromEntries(Object.entries(n).filter(([,b])=>b>0)),h=v!==s;try{await r(e,h?v:null,d)}catch(b){console.error("Cheat failed:",b)}o()}c.querySelector("#cheat-apply").addEventListener("click",g),c.querySelector("#cheat-close").addEventListener("click",o),(y=c.querySelector("#cheat-paper"))==null||y.addEventListener("click",()=>{o(),a()}),($=c.querySelector("#cheat-podcast"))==null||$.addEventListener("click",()=>{o(),i()}),c.addEventListener("click",v=>{v.target===c&&o()})})}function ve(e,s){e.innerHTML=s.map(n=>{const c=he(n),m=ge(n);return`
      <div class="seat" id="seat-${F(n)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${c}" alt="${j(n)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${j(m)}</div>
        </div>
        <div class="seat-name">${j(fe(n))}</div>
      </div>
    `}).join("");let t=null;function r(n){return e.querySelector(`#seat-${F(n)}`)}function a(){clearTimeout(t),e.querySelectorAll(".seat").forEach(n=>{n.classList.remove("seat-thinking","seat-speaking")})}function i(n){var c;a(),(c=r(n))==null||c.classList.add("seat-thinking")}function u(n){a();const c=r(n);c&&(c.classList.add("seat-speaking"),t=setTimeout(()=>c.classList.remove("seat-speaking"),3e3))}return{setThinking:i,setSpeaking:u,clearAll:a}}function he(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ge(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function fe(e){return e.split(" ").at(-1)}function F(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function j(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function be(e,s,t,r,a,i){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${p(r)}</span>
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
  `;const u=e.querySelector("#seats-bar"),n=e.querySelector("#convo-pane"),c=e.querySelector("#sidebar"),m=e.querySelector("#left-col");let l="socratic",o=0,g=null,y=!1,$=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const d=ve(u,t);N(c,{topic:r,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function h({type:E,data:f}){switch(E){case"speaker":d.setThinking(f.name),Se(n,f.name);break;case"message":C(n),f.backchannel||d.setSpeaking(f.name),ye(n,f);break;case"bars":o=f.heat??o,ke(c,f.heat,f.concession_total??0);break;case"debug":{const w=f.data!=null?f.data:"",q=typeof w=="object"?`
`+Object.entries(w).map(([V,Z])=>`  ${V}: ${JSON.stringify(Z)}`).join(`
`):w?` — ${w}`:"";console.log(`[${f.channel}] ${f.label}${q}`);break}case"state":l=f.moderator_style,o=f.heat??o,v=f,N(c,{topic:r,...f});break;case"steer_needed":if($)break;$=!0,l=f.current_style,f.drift_topic&&(L(n,`── DRIFT ── conversation has shifted to: ${f.drift_topic}`),L(n,`   original topic: ${r}`)),n.scrollTop=n.scrollHeight,ue(l,a,Te(v),m,i.searchEvidence,t).then(w=>{$=!1,w===null?A(n,v,t,b,s,i):(l=w.style,N(c,{topic:r,...v,moderator_style:w.style}),i.steer(s,w.text,w.style,w.evidence||"",w.drinks||{}).catch(q=>L(n,`Steer error: ${q.message}`)))});break;case"consensus":if(y)break;y=!0,g&&(g(),g=null),C(n),d.clearAll(),Ee(n,f,{onNewTopic(w){i.newTopic(s,w).then(()=>{y=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=w,N(c,{topic:w,...v,moderator_style:l,points_of_agreement:[]}),d.clearAll(),g=i.openStream(s,h)}).catch(q=>L(n,`Error: ${q.message}`))},onQuit:b},v,s,i,t);break;case"game_over":if(y)break;y=!0,g&&(g(),g=null),C(n),d.clearAll(),A(n,f,t,b,s,i);break;case"bar_beat":we(n,f.text);break;case"evidence":$e(n,f.finding);break;case"system":L(n,f.text);break;case"error":L(n,`⚠ ${f.text}`);break}}function b(){g&&g(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",B),e.querySelector("#help-btn").addEventListener("click",z),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const f=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=f?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{me(s,o,t,i.cheat,()=>R(s,i,t),()=>M(s,i))}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(y){b();return}v.turn>0?(y=!0,g&&(g(),g=null),A(n,v,t,b,s,i)):b()}),g=i.openStream(s,h)}function ye(e,{role:s,name:t,content:r,backchannel:a}){const i=document.createElement("div");if(a)i.className="msg msg-bc",i.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${_(r)}</em>`;else if(s==="moderator")i.className="msg msg-moderator",i.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${_(r)}</div>`;else if(s==="user")i.className="msg msg-user",i.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${_(r)}</div>`;else{const u=`/portraits/${t.replace(/ /g,"_")}.png`,n=t.split(" ").map(c=>c[0]).join("").slice(0,2).toUpperCase();i.className="msg msg-philosopher",i.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${u}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(n)}</div></div><div class="msg-body"><div class="msg-name">${p(t)}</div><div class="msg-content">${_(r)}</div></div>`}S(e,i)}function we(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=_(s),S(e,t)}function L(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,S(e,t)}function $e(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,S(e,t)}function Ee(e,{summary:s,points:t},{onNewTopic:r,onQuit:a},i={},u,n,c=[]){const m=document.createElement("div");m.className="consensus-panel",m.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(s)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(o=>`<li>${p(o)}</li>`).join("")}
      </ul>
    `:""}
    ${Y(i)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="newspaper-btn" id="consensus-paper">Read the morning paper 📰</button>
      <button class="newspaper-btn" id="consensus-podcast">Export as Podcast 🎙</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,S(e,m);const l=m.querySelector("#consensus-topic-input");l.focus(),m.querySelector("#consensus-continue").addEventListener("click",()=>{const o=l.value.trim();o&&r(o)}),l.addEventListener("keydown",o=>{if(o.key==="Enter"){const g=l.value.trim();g&&r(g)}}),m.querySelector("#consensus-end").addEventListener("click",a),m.querySelector("#consensus-paper").addEventListener("click",()=>R(u,n,c)),m.querySelector("#consensus-podcast").addEventListener("click",()=>M(u,n))}function A(e,s,t,r,a,i){var m,l;C(e);const u=document.createElement("div");u.className="game-over-panel";const n=s.turn||0,c=n?`${n} turn${n!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";u.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(c)}</div>
    ${Y(s)}
    <div class="game-over-actions">
      ${a?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      ${a?'<button class="newspaper-btn" id="game-over-podcast">Export as Podcast 🎙</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,S(e,u),u.querySelector("#game-over-leave").addEventListener("click",r),a&&((m=u.querySelector("#game-over-paper"))==null||m.addEventListener("click",()=>R(a,i,t))),a&&((l=u.querySelector("#game-over-podcast"))==null||l.addEventListener("click",()=>M(a,i)))}async function M(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="podcast-loading">
      <div class="podcast-loading-icon">🎙</div>
      <div class="podcast-loading-title">RECORDING IN PROGRESS</div>
      <div class="podcast-loading-steps" id="podcast-steps">
        <div class="podcast-step active" id="pstep-1">── preprocessing transcript ──</div>
        <div class="podcast-step" id="pstep-2">── synthesising voices ──</div>
        <div class="podcast-step" id="pstep-3">── encoding audio ──</div>
      </div>
      <div class="podcast-loading-note">This may take a minute…</div>
    </div>
  `,document.body.appendChild(t);const r=[setTimeout(()=>{var a,i;(a=t.querySelector("#pstep-1"))==null||a.classList.add("done"),(i=t.querySelector("#pstep-2"))==null||i.classList.add("active")},8e3),setTimeout(()=>{var a,i;(a=t.querySelector("#pstep-2"))==null||a.classList.add("done"),(i=t.querySelector("#pstep-3"))==null||i.classList.add("active")},2e4)];try{await s.exportPodcast(e)}catch(a){t.remove(),r.forEach(clearTimeout),alert(`Podcast export failed: ${a.message}`);return}r.forEach(clearTimeout),t.remove()}async function R(e,s,t=[]){const r=document.createElement("div");r.className="newspaper-overlay",r.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(r);let a;try{a=await s.fetchNewspaper(e)}catch(i){r.remove(),alert(`Could not print the paper: ${i.message}`);return}r.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
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
  `,r.querySelector("#newspaper-close").addEventListener("click",()=>r.remove()),r.addEventListener("click",i=>{i.target===r&&r.remove()}),r.querySelector("#newspaper-download").addEventListener("click",()=>{var n,c;const i=r.querySelector(".newspaper-modal").cloneNode(!0);i.querySelectorAll("img").forEach(m=>{m.src&&!m.src.startsWith("http")&&(m.src=window.location.origin+m.getAttribute("src"))}),(n=i.querySelector("#newspaper-close"))==null||n.remove(),(c=i.querySelector("#newspaper-download"))==null||c.remove();const u=window.open("","_blank");u.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${p(a.newspaper_name)}</title>
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
</head><body>${i.outerHTML}</body></html>`),u.document.close(),u.addEventListener("load",()=>{u.focus(),u.print()})})}function Y(e){const{turn:s=0,heat:t=0,partial_agreements:r=[],points_of_agreement:a=[],remaining_disagreements:i=[]}=e;if(!s)return"";const u=K(t),n=Q(t),c="█".repeat(t),m="░".repeat(10-t);let l='<div class="report-stats">';return l+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,l+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${n}">${c}<span style="color:var(--text-dim)">${m}</span> ${u}</span>
  </div>`,a.length&&(l+='<div class="report-section-label">agreements reached</div>',l+=a.map(o=>`<div class="report-agree-item">✓ ${p(o)}</div>`).join("")),r.length&&(l+='<div class="report-section-label">alignments that formed</div>',l+=r.map(o=>`<div class="report-partial"><span class="report-partial-names">${p(o.participants.join(" + "))}</span> — <span class="report-partial-on">${p(o.on)}</span></div>`).join("")),i.length&&(l+='<div class="report-section-label">still unresolved</div>',l+=i.map(o=>typeof o=="object"&&o!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(o.topic)}</span>
          <span class="report-tension-stance">${p(o.participant_a)}: ${p(o.stance_a)}</span>
          <span class="report-tension-stance">${p(o.participant_b)}: ${p(o.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(o))}</div>`).join("")),l+="</div>",l}function Se(e,s){C(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,S(e,t)}function C(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function N(e,s){const{topic:t,turn:r=0,heat:a=0,concession_total:i=0,moderator_style:u="socratic",partial_agreements:n=[],points_of_agreement:c=[],remaining_disagreements:m=[]}=s;let l=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${r}</div>
  `;c.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${c.map(o=>`<div class="sb-agree-item">✓ ${p(o)}</div>`).join("")}
      </div>
    `),n.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${n.map(o=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(o.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(o.on)}</div>
          </div>
        `).join("")}
      </div>
    `),m.length&&(l+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${m.map(o=>typeof o=="object"&&o!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(o.topic)}</div>
                <div class="sb-tension-stance">${p(o.participant_a)}: ${p(o.stance_a)}</div>
                <div class="sb-tension-stance">${p(o.participant_b)}: ${p(o.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(o))}</div>`).join("")}
      </div>
    `),l+=`
    <div class="sb-section" id="sb-bars">
      ${W(a,i)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(u)}</div>
    </div>
  `,e.innerHTML=l}function _(e){return p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function S(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function W(e,s){const t=Q(e),r=K(e),a="█".repeat(e),i="░".repeat(10-e),u=Math.min(s,10),n=Le(s),c="█".repeat(u),m="░".repeat(10-u),l=xe(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${a}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${t}">${r}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${n}">${c}</span><span class="sb-heat-empty">${m}</span>
      <span class="sb-heat-label" style="color:${n}">${l} (${s})</span>
    </div>
  `}function ke(e,s,t){const r=e.querySelector("#sb-bars");r&&(r.innerHTML=W(s,t))}function Q(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function K(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Le(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function xe(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Te(e,s){const{turn:t,heat:r,partial_agreements:a,remaining_disagreements:i,drift_topic:u}=e;if(!t)return"The debate is just getting started.";if(u)return`The conversation has drifted from the original topic toward ${u}.`;const n=a||[],c=i||[];if(n.length&&c.length){const l=n[0],o=c[0],g=l.participants.join(" and "),y=typeof o=="object"?o.topic:String(o);return`${g} are finding common ground, but the group remains divided on ${y}.`}if(n.length){const l=n[0];return`${l.participants.join(" and ")} are converging on ${l.on}, ${r>=6?"though tempers are running high":"with the room following closely"}.`}if(c.length){const l=c[0];return typeof l=="object"?`${l.participant_a} and ${l.participant_b} are sharply divided over ${l.topic}.`:`The room is deadlocked — ${String(l)}.`}const m=r>=8?"at flashpoint":r>=5?"heating up":r>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${m}.`}const O=document.querySelector("#app");async function J(){let e,s;try{[e,s]=await Promise.all([ee(),te()])}catch(r){O.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${r.message}</div>`;return}const t=pe(O,e,async({characters:r,topic:a})=>{try{const i=await se(r,a);qe(i.session_id,r,a,s)}catch(i){t.showError(`Could not start session: ${i.message}`)}})}function qe(e,s,t,r){be(O,e,s,t,r,{steer:ae,cheat:le,deleteSession:ie,newTopic:re,openStream:de,searchEvidence:ne,fetchNewspaper:oe,exportPodcast:ce}),O.addEventListener("debate:quit",()=>J(),{once:!0})}J();
