(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))i(c);new MutationObserver(c=>{for(const r of c)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&i(l)}).observe(document,{childList:!0,subtree:!0});function t(c){const r={};return c.integrity&&(r.integrity=c.integrity),c.referrerPolicy&&(r.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?r.credentials="include":c.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(c){if(c.ep)return;c.ep=!0;const r=t(c);fetch(c.href,r)}})();const C="/api";async function L(e,n){const t=await fetch(`${C}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!t.ok){const i=await t.text();throw new Error(`${t.status} ${t.statusText}: ${i}`)}return t.json()}async function V(e){await fetch(`${C}${e}`,{method:"DELETE"})}async function z(){const e=await fetch(`${C}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function Z(){const e=await fetch(`${C}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function X(e,n){return L("/sessions",{characters:e,topic:n})}async function ee(e,n,t,i="",c={}){return L(`/sessions/${e}/steer`,{text:n,style:t,evidence:i,drinks:c})}async function te(e){return L("/search",{query:e})}async function se(e,n){return L(`/sessions/${e}/new-topic`,{topic:n})}async function ne(e){return V(`/sessions/${e}`)}async function ae(e){return L(`/sessions/${e}/newspaper`,{})}async function ie(e,n,t={}){const i={drinks:t};return n!==null&&(i.heat=n),L(`/sessions/${e}/cheat`,i)}function re(e,n){const t=new EventSource(`${C}/sessions/${e}/stream`);return t.onmessage=i=>{try{const c=JSON.parse(i.data);n(c)}catch{console.error("Unparseable SSE frame:",i.data)}},t.onerror=i=>{console.error("SSE error",i),n({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const M="https://github.com/mhughes72/fungame03";function I(e,n){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${n}</div>
    </div>
  `,document.body.appendChild(t);function i(){t.remove()}t.querySelector(".info-close").addEventListener("click",i),t.addEventListener("click",c=>{c.target===t&&i()}),document.addEventListener("keydown",function c(r){r.key==="Escape"&&(i(),document.removeEventListener("keydown",c))})}function U(){I("ABOUT",`
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
    <p><a class="info-link" href="${M}" target="_blank" rel="noopener">${M}</a></p>
  `)}function B(){I("HOW TO PLAY",`
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
  `)}function ce(e,n,t){e.innerHTML=`
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
          ${n.map(s=>`
            <label class="char-row" data-name="${s.name.toLowerCase()}">
              <input type="checkbox" value="${s.name}" />
              <span class="char-name">${s.name}</span>
              <span class="char-era">${s.era}</span>
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
      </div>
    </div>
  `;const i=e.querySelectorAll("input[type=checkbox]"),c=e.querySelectorAll(".char-row"),r=e.querySelector("#char-no-results"),l=e.querySelector("#char-filter");l.addEventListener("input",()=>{const s=l.value.toLowerCase().trim();let p=0;c.forEach(m=>{const g=!s||m.dataset.name.includes(s);m.style.display=g?"":"none",g&&p++}),r.style.display=p===0?"":"none"});const a=e.querySelector("#selection-hint"),u=e.querySelector("#start-btn"),v=e.querySelector("#setup-error");function o(){const s=[...i].filter(p=>p.checked).length;s<2?(a.textContent=s===0?"Select 2 to 4 thinkers":"Select 1 more",a.classList.remove("hint-ok","hint-warn")):s>4?(a.textContent=`Too many — deselect ${s-4}`,a.classList.add("hint-warn"),a.classList.remove("hint-ok")):(a.textContent=`${s} selected`,a.classList.add("hint-ok"),a.classList.remove("hint-warn")),u.disabled=s<2||s>4}return o(),i.forEach(s=>s.addEventListener("change",o)),u.addEventListener("click",()=>{const s=[...i].filter(m=>m.checked).map(m=>m.value),p=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";v.textContent="",t({characters:s,topic:p})}),e.querySelector("#topic-input").addEventListener("keydown",s=>{s.key==="Enter"&&!u.disabled&&u.click()}),e.querySelector("#setup-about").addEventListener("click",U),e.querySelector("#setup-help").addEventListener("click",B),{showError(s){v.textContent=s}}}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function oe(e,n,t="",i,c=null,r=[]){return new Promise(l=>{const a=document.createElement("div");a.className="steer-drawer",a.innerHTML=`
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
    `,(i||document.body).appendChild(a);const v=a.querySelector("#steer-text-input"),o=a.querySelector("#evidence-query"),s=a.querySelector("#evidence-search"),p=a.querySelector("#evidence-preview");v.focus();let m=e,g="";async function y(){const b=o.value.trim();if(!(!b||!c)){s.disabled=!0,s.textContent="Searching…",p.style.display="none",g="";try{const $=await c(b);g=$.finding,p.style.display="block",p.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${S($.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,p.querySelector("#evidence-accept").addEventListener("click",()=>{p.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${S(g)}</div>`}),p.querySelector("#evidence-discard").addEventListener("click",()=>{g="",p.style.display="none"})}catch($){p.style.display="block",p.textContent=`Search failed: ${$.message}`}finally{s.disabled=!1,s.textContent="Search"}}}s.addEventListener("click",y),o.addEventListener("keydown",b=>{b.key==="Enter"&&y()}),a.querySelectorAll(".style-item").forEach(b=>{b.addEventListener("click",()=>{a.querySelectorAll(".style-item").forEach($=>$.classList.remove("style-selected")),b.classList.add("style-selected"),m=b.dataset.style,w()})});function w(){const b=v.value.trim();a.remove(),l({text:b,style:m,evidence:g})}a.querySelector("#steer-submit").addEventListener("click",w),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),l(null)}),v.addEventListener("keydown",b=>{b.key==="Enter"&&w()})})}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const R=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function le(e,n,t,i){return new Promise(c=>{const r={};t.forEach(s=>{r[s]=0});const l=document.createElement("div");l.className="cheat-overlay",l.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${n}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${n} — ${R[n]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(s=>`
            <div class="drink-row">
              <span class="drink-name">${H(s)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${H(s)}">−</button>
                <span class="drink-count" id="drink-count-${H(s.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${H(s)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="cheat-footer">
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(l);const a=l.querySelector("#cheat-heat-slider"),u=l.querySelector("#cheat-heat-value");a.addEventListener("input",()=>{const s=parseInt(a.value,10);u.textContent=`${s} — ${R[s]}`}),l.querySelectorAll(".drink-btn").forEach(s=>{s.addEventListener("click",()=>{const p=s.dataset.name,m=s.classList.contains("drink-plus")?1:-1;r[p]=Math.max(0,(r[p]||0)+m);const g=p.replace(/ /g,"_"),y=l.querySelector(`#drink-count-${g}`);y&&(y.textContent=r[p])})});function v(){l.remove(),c()}async function o(){const s=parseInt(a.value,10),p=Object.fromEntries(Object.entries(r).filter(([,g])=>g>0)),m=s!==n;try{await i(e,m?s:null,p)}catch(g){console.error("Cheat failed:",g)}v()}l.querySelector("#cheat-apply").addEventListener("click",o),l.querySelector("#cheat-close").addEventListener("click",v),l.addEventListener("click",s=>{s.target===l&&v()})})}function de(e,n){e.innerHTML=n.map(a=>{const u=pe(a),v=ue(a);return`
      <div class="seat" id="seat-${P(a)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${u}" alt="${A(a)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${A(v)}</div>
        </div>
        <div class="seat-name">${A(ve(a))}</div>
      </div>
    `}).join("");let t=null;function i(a){return e.querySelector(`#seat-${P(a)}`)}function c(){clearTimeout(t),e.querySelectorAll(".seat").forEach(a=>{a.classList.remove("seat-thinking","seat-speaking")})}function r(a){var u;c(),(u=i(a))==null||u.classList.add("seat-thinking")}function l(a){c();const u=i(a);u&&(u.classList.add("seat-speaking"),t=setTimeout(()=>u.classList.remove("seat-speaking"),3e3))}return{setThinking:r,setSpeaking:l,clearAll:c}}function pe(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ue(e){return e.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}function ve(e){return e.split(" ").at(-1)}function P(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function A(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function he(e,n,t,i,c,r){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${d(i)}</span>
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
  `;const l=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),u=e.querySelector("#sidebar"),v=e.querySelector("#left-col");let o="socratic",s=0,p=null,m=!1,g=!1,y={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const w=de(l,t);x(u,{topic:i,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function b({type:j,data:h}){switch(j){case"speaker":w.setThinking(h.name),ye(a,h.name);break;case"message":_(a),h.backchannel||w.setSpeaking(h.name),me(a,h);break;case"bars":s=h.heat??s,$e(u,h.heat,h.concession_total??0);break;case"debug":{const f=h.data!=null?h.data:"",T=typeof f=="object"?`
`+Object.entries(f).map(([K,J])=>`  ${K}: ${JSON.stringify(J)}`).join(`
`):f?` — ${f}`:"";console.log(`[${h.channel}] ${h.label}${T}`);break}case"state":o=h.moderator_style,s=h.heat??s,y=h,x(u,{topic:i,...h});break;case"steer_needed":if(g)break;g=!0,o=h.current_style,h.drift_topic&&(k(a,`── DRIFT ── conversation has shifted to: ${h.drift_topic}`),k(a,`   original topic: ${i}`)),a.scrollTop=a.scrollHeight,oe(o,c,Se(y),v,r.searchEvidence,t).then(f=>{g=!1,f===null?O(a,y,t,$,n,r):(o=f.style,x(u,{topic:i,...y,moderator_style:f.style}),r.steer(n,f.text,f.style,f.evidence||"",f.drinks||{}).catch(T=>k(a,`Steer error: ${T.message}`)))});break;case"consensus":if(m)break;m=!0,p&&(p(),p=null),_(a),w.clearAll(),fe(a,h,{onNewTopic(f){r.newTopic(n,f).then(()=>{m=!1,y={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=f,x(u,{topic:f,...y,moderator_style:o,points_of_agreement:[]}),w.clearAll(),p=r.openStream(n,b)}).catch(T=>k(a,`Error: ${T.message}`))},onQuit:$},y,n,r,t);break;case"game_over":if(m)break;m=!0,p&&(p(),p=null),_(a),w.clearAll(),O(a,h,t,$,n,r);break;case"bar_beat":be(a,h.text);break;case"evidence":ge(a,h.finding);break;case"system":k(a,h.text);break;case"error":k(a,`⚠ ${h.text}`);break}}function $(){p&&p(),r.deleteSession(n).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",U),e.querySelector("#help-btn").addEventListener("click",B),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const h=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=h?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{le(n,s,t,r.cheat)}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(m){$();return}y.turn>0?(m=!0,p&&(p(),p=null),O(a,y,t,$,n,r)):$()}),p=r.openStream(n,b)}function me(e,{role:n,name:t,content:i,backchannel:c}){const r=document.createElement("div");if(c)r.className="msg msg-bc",r.innerHTML=`<span class="bc-name">${d(t)}:</span> <em>${q(i)}</em>`;else if(n==="moderator")r.className="msg msg-moderator",r.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${q(i)}</div>`;else if(n==="user")r.className="msg msg-user",r.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${q(i)}</div>`;else{const l=`/portraits/${t.replace(/ /g,"_")}.png`,a=t.split(" ").map(u=>u[0]).join("").slice(0,2).toUpperCase();r.className="msg msg-philosopher",r.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${l}" alt="${d(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${d(a)}</div></div><div class="msg-body"><div class="msg-name">${d(t)}</div><div class="msg-content">${q(i)}</div></div>`}E(e,r)}function be(e,n){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=q(n),E(e,t)}function k(e,n){const t=document.createElement("div");t.className="msg msg-system",t.textContent=n,E(e,t)}function ge(e,n){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${d(n)}`,E(e,t)}function fe(e,{summary:n,points:t},{onNewTopic:i,onQuit:c},r={},l,a,u=[]){const v=document.createElement("div");v.className="consensus-panel",v.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${d(n)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(s=>`<li>${d(s)}</li>`).join("")}
      </ul>
    `:""}
    ${F(r)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="newspaper-btn" id="consensus-paper">Read the morning paper 📰</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,E(e,v);const o=v.querySelector("#consensus-topic-input");o.focus(),v.querySelector("#consensus-continue").addEventListener("click",()=>{const s=o.value.trim();s&&i(s)}),o.addEventListener("keydown",s=>{if(s.key==="Enter"){const p=o.value.trim();p&&i(p)}}),v.querySelector("#consensus-end").addEventListener("click",c),v.querySelector("#consensus-paper").addEventListener("click",()=>D(l,a,u))}function O(e,n,t,i,c,r){var v;_(e);const l=document.createElement("div");l.className="game-over-panel";const a=n.turn||0,u=a?`${a} turn${a!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${d(u)}</div>
    ${F(n)}
    <div class="game-over-actions">
      ${c?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,E(e,l),l.querySelector("#game-over-leave").addEventListener("click",i),c&&((v=l.querySelector("#game-over-paper"))==null||v.addEventListener("click",()=>D(c,r,t)))}async function D(e,n,t=[]){const i=document.createElement("div");i.className="newspaper-overlay",i.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(i);let c;try{c=await n.fetchNewspaper(e)}catch(r){i.remove(),alert(`Could not print the paper: ${r.message}`);return}i.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${d(c.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${d(c.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${d(c.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${d(c.headline)}</div>
        <div class="newspaper-subhead">${d(c.subheadline)}</div>

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
            <p class="newspaper-lede">${d(c.lede)}</p>
            <p class="newspaper-body">${d(c.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${d(c.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${d(c.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${d(c.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${d(c.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,i.querySelector("#newspaper-close").addEventListener("click",()=>i.remove()),i.addEventListener("click",r=>{r.target===i&&i.remove()})}function F(e){const{turn:n=0,heat:t=0,partial_agreements:i=[],points_of_agreement:c=[],remaining_disagreements:r=[]}=e;if(!n)return"";const l=Y(t),a=W(t),u="█".repeat(t),v="░".repeat(10-t);let o='<div class="report-stats">';return o+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${n}</span>
  </div>`,o+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${a}">${u}<span style="color:var(--text-dim)">${v}</span> ${l}</span>
  </div>`,c.length&&(o+='<div class="report-section-label">agreements reached</div>',o+=c.map(s=>`<div class="report-agree-item">✓ ${d(s)}</div>`).join("")),i.length&&(o+='<div class="report-section-label">alignments that formed</div>',o+=i.map(s=>`<div class="report-partial"><span class="report-partial-names">${d(s.participants.join(" + "))}</span> — <span class="report-partial-on">${d(s.on)}</span></div>`).join("")),r.length&&(o+='<div class="report-section-label">still unresolved</div>',o+=r.map(s=>typeof s=="object"&&s!==null?`<div class="report-tension">
          <span class="report-tension-topic">${d(s.topic)}</span>
          <span class="report-tension-stance">${d(s.participant_a)}: ${d(s.stance_a)}</span>
          <span class="report-tension-stance">${d(s.participant_b)}: ${d(s.stance_b)}</span>
        </div>`:`<div class="report-tension">${d(String(s))}</div>`).join("")),o+="</div>",o}function ye(e,n){_(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${d(n)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,E(e,t)}function _(e){var n;(n=e.querySelector("#typing-indicator"))==null||n.remove()}function x(e,n){const{topic:t,turn:i=0,heat:c=0,concession_total:r=0,moderator_style:l="socratic",partial_agreements:a=[],points_of_agreement:u=[],remaining_disagreements:v=[]}=n;let o=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${d(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${i}</div>
  `;u.length&&(o+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${u.map(s=>`<div class="sb-agree-item">✓ ${d(s)}</div>`).join("")}
      </div>
    `),a.length&&(o+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${a.map(s=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${d(s.participants.join(" + "))}</div>
            <div class="sb-partial-on">${d(s.on)}</div>
          </div>
        `).join("")}
      </div>
    `),v.length&&(o+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${v.map(s=>typeof s=="object"&&s!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${d(s.topic)}</div>
                <div class="sb-tension-stance">${d(s.participant_a)}: ${d(s.stance_a)}</div>
                <div class="sb-tension-stance">${d(s.participant_b)}: ${d(s.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${d(String(s))}</div>`).join("")}
      </div>
    `),o+=`
    <div class="sb-section" id="sb-bars">
      ${G(c,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${d(l)}</div>
    </div>
  `,e.innerHTML=o}function q(e){return d(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function E(e,n){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(n),t&&(e.scrollTop=e.scrollHeight)}function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function G(e,n){const t=W(e),i=Y(e),c="█".repeat(e),r="░".repeat(10-e),l=Math.min(n,10),a=we(n),u="█".repeat(l),v="░".repeat(10-l),o=Ee(n);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${c}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${i}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${a}">${u}</span><span class="sb-heat-empty">${v}</span>
      <span class="sb-heat-label" style="color:${a}">${o} (${n})</span>
    </div>
  `}function $e(e,n,t){const i=e.querySelector("#sb-bars");i&&(i.innerHTML=G(n,t))}function W(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function Y(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function we(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Ee(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Se(e,n){const{turn:t,heat:i,partial_agreements:c,remaining_disagreements:r,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const a=c||[],u=r||[];if(a.length&&u.length){const o=a[0],s=u[0],p=o.participants.join(" and "),m=typeof s=="object"?s.topic:String(s);return`${p} are finding common ground, but the group remains divided on ${m}.`}if(a.length){const o=a[0];return`${o.participants.join(" and ")} are converging on ${o.on}, ${i>=6?"though tempers are running high":"with the room following closely"}.`}if(u.length){const o=u[0];return typeof o=="object"?`${o.participant_a} and ${o.participant_b} are sharply divided over ${o.topic}.`:`The room is deadlocked — ${String(o)}.`}const v=i>=8?"at flashpoint":i>=5?"heating up":i>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${v}.`}const N=document.querySelector("#app");async function Q(){let e,n;try{[e,n]=await Promise.all([z(),Z()])}catch(i){N.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${i.message}</div>`;return}const t=ce(N,e,async({characters:i,topic:c})=>{try{const r=await X(i,c);ke(r.session_id,i,c,n)}catch(r){t.showError(`Could not start session: ${r.message}`)}})}function ke(e,n,t,i){he(N,e,n,t,i,{steer:ee,cheat:ie,deleteSession:ne,newTopic:se,openStream:re,searchEvidence:te,fetchNewspaper:ae}),N.addEventListener("debate:quit",()=>Q(),{once:!0})}Q();
