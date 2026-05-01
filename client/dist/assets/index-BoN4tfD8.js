(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();const L="/api";async function x(e,n){const t=await fetch(`${L}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function Z(e){await fetch(`${L}${e}`,{method:"DELETE"})}async function R(e=0){const n=await fetch(`${L}/debate-of-the-day?index=${e}`);if(!n.ok)throw new Error("Failed to load debate of the day");return n.json()}async function X(){const e=await fetch(`${L}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function ee(){const e=await fetch(`${L}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function te(e,n){return x("/sessions",{characters:e,topic:n})}async function se(e,n,t,a="",i={}){return x(`/sessions/${e}/steer`,{text:n,style:t,evidence:a,drinks:i})}async function ne(e){return x("/search",{query:e})}async function ae(e,n){return x(`/sessions/${e}/new-topic`,{topic:n})}async function re(e){return Z(`/sessions/${e}`)}async function ie(e){return x(`/sessions/${e}/newspaper`,{})}async function oe(e,n,t={}){const a={drinks:t};return n!==null&&(a.heat=n),x(`/sessions/${e}/cheat`,a)}function ce(e,n){const t=new EventSource(`${L}/sessions/${e}/stream`);return t.onmessage=a=>{try{const i=JSON.parse(a.data);n(i)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),n({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const P="https://github.com/mhughes72/fungame03";function U(e,n){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${n}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",i=>{i.target===t&&a()}),document.addEventListener("keydown",function i(r){r.key==="Escape"&&(a(),document.removeEventListener("keydown",i))})}function B(){U("ABOUT",`
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
    <p><a class="info-link" href="${P}" target="_blank" rel="noopener">${P}</a></p>
  `)}function G(){U("HOW TO PLAY",`
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
  `;const a=e.querySelectorAll("input[type=checkbox]"),i=e.querySelectorAll(".char-row"),r=e.querySelector("#char-no-results"),d=e.querySelector("#char-filter");d.addEventListener("input",()=>{const l=d.value.toLowerCase().trim();let g=0;i.forEach(b=>{const T=!l||b.dataset.name.includes(l);b.style.display=T?"":"none",T&&g++}),r.style.display=g===0?"":"none"});const s=e.querySelector("#selection-hint"),p=e.querySelector("#start-btn"),m=e.querySelector("#setup-error");function c(){const l=[...a].filter(g=>g.checked).length;l<2?(s.textContent=l===0?"Select 2 to 4 thinkers":"Select 1 more",s.classList.remove("hint-ok","hint-warn")):l>4?(s.textContent=`Too many — deselect ${l-4}`,s.classList.add("hint-warn"),s.classList.remove("hint-ok")):(s.textContent=`${l} selected`,s.classList.add("hint-ok"),s.classList.remove("hint-warn")),p.disabled=l<2||l>4}c(),a.forEach(l=>l.addEventListener("change",c)),p.addEventListener("click",()=>{const l=[...a].filter(b=>b.checked).map(b=>b.value),g=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";m.textContent="",t({characters:l,topic:g})}),e.querySelector("#topic-input").addEventListener("keydown",l=>{l.key==="Enter"&&!p.disabled&&p.click()}),e.querySelector("#setup-about").addEventListener("click",B),e.querySelector("#setup-help").addEventListener("click",G);const o=e.querySelector("#dotd-card"),h={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let v=0;function y(l){const g=h[l.category]||"var(--text-dim)";o.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── DEBATE OF THE DAY ──</span>
        <span class="dotd-category" style="color:${g}">${l.category.toUpperCase()}</span>
      </div>
      <div class="dotd-cast">${l.characters.join(" · ")}</div>
      <div class="dotd-topic">${I(l.topic)}</div>
      <div class="dotd-tagline">${I(l.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Generate new one ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,o.querySelector("#dotd-start").addEventListener("click",()=>{t({characters:l.characters,topic:l.topic})}),o.querySelector("#dotd-new").addEventListener("click",()=>{v++,w(v)})}function w(l){o.innerHTML='<div class="dotd-loading">generating…</div>',R(l).then(y).catch(()=>{l===0?o.style.display="none":(v--,R(v).then(y).catch(()=>{o.style.display="none"}))})}return w(0),{showError(l){m.textContent=l}}}function I(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function de(e,n,t="",a,i=null,r=[]){return new Promise(d=>{const s=document.createElement("div");s.className="steer-drawer",s.innerHTML=`
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
        ${n.map(g=>`
          <button
            class="style-item${g.style===e?" style-selected":""}"
            data-style="${S(g.style)}"
          >
            <span class="style-name">${S(g.style)}</span>
            <span class="style-desc">${S(g.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(a||document.body).appendChild(s);const m=s.querySelector("#steer-text-input"),c=s.querySelector("#evidence-query"),o=s.querySelector("#evidence-search"),h=s.querySelector("#evidence-preview");m.focus();let v=e,y="";async function w(){const g=c.value.trim();if(!(!g||!i)){o.disabled=!0,o.textContent="Searching…",h.style.display="none",y="";try{const b=await i(g);y=b.finding,h.style.display="block",h.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${S(b.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,h.querySelector("#evidence-accept").addEventListener("click",()=>{h.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${S(y)}</div>`}),h.querySelector("#evidence-discard").addEventListener("click",()=>{y="",h.style.display="none"})}catch(b){h.style.display="block",h.textContent=`Search failed: ${b.message}`}finally{o.disabled=!1,o.textContent="Search"}}}o.addEventListener("click",w),c.addEventListener("keydown",g=>{g.key==="Enter"&&w()}),s.querySelectorAll(".style-item").forEach(g=>{g.addEventListener("click",()=>{s.querySelectorAll(".style-item").forEach(b=>b.classList.remove("style-selected")),g.classList.add("style-selected"),v=g.dataset.style,l()})});function l(){const g=m.value.trim();s.remove(),d({text:g,style:v,evidence:y})}s.querySelector("#steer-submit").addEventListener("click",l),s.querySelector("#steer-quit").addEventListener("click",()=>{s.remove(),d(null)}),m.addEventListener("keydown",g=>{g.key==="Enter"&&l()})})}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const D=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function pe(e,n,t,a,i=null){return new Promise(r=>{var h;const d={};t.forEach(v=>{d[v]=0});const s=document.createElement("div");s.className="cheat-overlay",s.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${n}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${n} — ${D[n]}</span>
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
          ${i?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(s);const p=s.querySelector("#cheat-heat-slider"),m=s.querySelector("#cheat-heat-value");p.addEventListener("input",()=>{const v=parseInt(p.value,10);m.textContent=`${v} — ${D[v]}`}),s.querySelectorAll(".drink-btn").forEach(v=>{v.addEventListener("click",()=>{const y=v.dataset.name,w=v.classList.contains("drink-plus")?1:-1;d[y]=Math.max(0,(d[y]||0)+w);const l=y.replace(/ /g,"_"),g=s.querySelector(`#drink-count-${l}`);g&&(g.textContent=d[y])})});function c(){s.remove(),r()}async function o(){const v=parseInt(p.value,10),y=Object.fromEntries(Object.entries(d).filter(([,l])=>l>0)),w=v!==n;try{await a(e,w?v:null,y)}catch(l){console.error("Cheat failed:",l)}c()}s.querySelector("#cheat-apply").addEventListener("click",o),s.querySelector("#cheat-close").addEventListener("click",c),(h=s.querySelector("#cheat-paper"))==null||h.addEventListener("click",()=>{c(),i()}),s.addEventListener("click",v=>{v.target===s&&c()})})}function ue(e,n){e.innerHTML=n.map(s=>{const p=me(s),m=ve(s);return`
      <div class="seat" id="seat-${F(s)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${p}" alt="${O(s)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${O(m)}</div>
        </div>
        <div class="seat-name">${O(he(s))}</div>
      </div>
    `}).join("");let t=null;function a(s){return e.querySelector(`#seat-${F(s)}`)}function i(){clearTimeout(t),e.querySelectorAll(".seat").forEach(s=>{s.classList.remove("seat-thinking","seat-speaking")})}function r(s){var p;i(),(p=a(s))==null||p.classList.add("seat-thinking")}function d(s){i();const p=a(s);p&&(p.classList.add("seat-speaking"),t=setTimeout(()=>p.classList.remove("seat-speaking"),3e3))}return{setThinking:r,setSpeaking:d,clearAll:i}}function me(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ve(e){return e.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}function he(e){return e.split(" ").at(-1)}function F(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function O(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ge(e,n,t,a,i,r){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${u(a)}</span>
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
  `;const d=e.querySelector("#seats-bar"),s=e.querySelector("#convo-pane"),p=e.querySelector("#sidebar"),m=e.querySelector("#left-col");let c="socratic",o=0,h=null,v=!1,y=!1,w={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const l=ue(d,t);N(p,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function g({type:T,data:f}){switch(T){case"speaker":l.setThinking(f.name),$e(s,f.name);break;case"message":C(s),f.backchannel||l.setSpeaking(f.name),fe(s,f);break;case"bars":o=f.heat??o,Ee(p,f.heat,f.concession_total??0);break;case"debug":{const $=f.data!=null?f.data:"",q=typeof $=="object"?`
`+Object.entries($).map(([J,V])=>`  ${J}: ${JSON.stringify(V)}`).join(`
`):$?` — ${$}`:"";console.log(`[${f.channel}] ${f.label}${q}`);break}case"state":c=f.moderator_style,o=f.heat??o,w=f,N(p,{topic:a,...f});break;case"steer_needed":if(y)break;y=!0,c=f.current_style,f.drift_topic&&(k(s,`── DRIFT ── conversation has shifted to: ${f.drift_topic}`),k(s,`   original topic: ${a}`)),s.scrollTop=s.scrollHeight,de(c,i,Le(w),m,r.searchEvidence,t).then($=>{y=!1,$===null?j(s,w,t,b,n,r):(c=$.style,N(p,{topic:a,...w,moderator_style:$.style}),r.steer(n,$.text,$.style,$.evidence||"",$.drinks||{}).catch(q=>k(s,`Steer error: ${q.message}`)))});break;case"consensus":if(v)break;v=!0,h&&(h(),h=null),C(s),l.clearAll(),we(s,f,{onNewTopic($){r.newTopic(n,$).then(()=>{v=!1,w={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=$,N(p,{topic:$,...w,moderator_style:c,points_of_agreement:[]}),l.clearAll(),h=r.openStream(n,g)}).catch(q=>k(s,`Error: ${q.message}`))},onQuit:b},w,n,r,t);break;case"game_over":if(v)break;v=!0,h&&(h(),h=null),C(s),l.clearAll(),j(s,f,t,b,n,r);break;case"bar_beat":be(s,f.text);break;case"evidence":ye(s,f.finding);break;case"system":k(s,f.text);break;case"error":k(s,`⚠ ${f.text}`);break}}function b(){h&&h(),r.deleteSession(n).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",B),e.querySelector("#help-btn").addEventListener("click",G),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const f=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=f?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{pe(n,o,t,r.cheat,()=>M(n,r,t))}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(v){b();return}w.turn>0?(v=!0,h&&(h(),h=null),j(s,w,t,b,n,r)):b()}),h=r.openStream(n,g)}function fe(e,{role:n,name:t,content:a,backchannel:i}){const r=document.createElement("div");if(i)r.className="msg msg-bc",r.innerHTML=`<span class="bc-name">${u(t)}:</span> <em>${_(a)}</em>`;else if(n==="moderator")r.className="msg msg-moderator",r.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${_(a)}</div>`;else if(n==="user")r.className="msg msg-user",r.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${_(a)}</div>`;else{const d=`/portraits/${t.replace(/ /g,"_")}.png`,s=t.split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase();r.className="msg msg-philosopher",r.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${d}" alt="${u(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${u(s)}</div></div><div class="msg-body"><div class="msg-name">${u(t)}</div><div class="msg-content">${_(a)}</div></div>`}E(e,r)}function be(e,n){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=_(n),E(e,t)}function k(e,n){const t=document.createElement("div");t.className="msg msg-system",t.textContent=n,E(e,t)}function ye(e,n){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${u(n)}`,E(e,t)}function we(e,{summary:n,points:t},{onNewTopic:a,onQuit:i},r={},d,s,p=[]){const m=document.createElement("div");m.className="consensus-panel",m.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${u(n)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(o=>`<li>${u(o)}</li>`).join("")}
      </ul>
    `:""}
    ${z(r)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="newspaper-btn" id="consensus-paper">Read the morning paper 📰</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,E(e,m);const c=m.querySelector("#consensus-topic-input");c.focus(),m.querySelector("#consensus-continue").addEventListener("click",()=>{const o=c.value.trim();o&&a(o)}),c.addEventListener("keydown",o=>{if(o.key==="Enter"){const h=c.value.trim();h&&a(h)}}),m.querySelector("#consensus-end").addEventListener("click",i),m.querySelector("#consensus-paper").addEventListener("click",()=>M(d,s,p))}function j(e,n,t,a,i,r){var m;C(e);const d=document.createElement("div");d.className="game-over-panel";const s=n.turn||0,p=s?`${s} turn${s!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";d.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${u(p)}</div>
    ${z(n)}
    <div class="game-over-actions">
      ${i?'<button class="newspaper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,E(e,d),d.querySelector("#game-over-leave").addEventListener("click",a),i&&((m=d.querySelector("#game-over-paper"))==null||m.addEventListener("click",()=>M(i,r,t)))}async function M(e,n,t=[]){const a=document.createElement("div");a.className="newspaper-overlay",a.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(a);let i;try{i=await n.fetchNewspaper(e)}catch(r){a.remove(),alert(`Could not print the paper: ${r.message}`);return}a.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${u(i.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${u(i.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${u(i.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${u(i.headline)}</div>
        <div class="newspaper-subhead">${u(i.subheadline)}</div>

        ${t.length?`
        <div class="newspaper-portrait-strip">
          ${t.map(r=>`
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/newspaper_portraits/${encodeURIComponent(r.replace(/ /g,"_"))}.png"
                   alt="${u(r)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${u(r)}</div>
            </div>
          `).join("")}
        </div>
        `:""}

        <div class="newspaper-columns">
          <div class="newspaper-main-col">
            <p class="newspaper-lede">${u(i.lede)}</p>
            <p class="newspaper-body">${u(i.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${u(i.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${u(i.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${u(i.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${u(i.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,a.querySelector("#newspaper-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",r=>{r.target===a&&a.remove()}),a.querySelector("#newspaper-download").addEventListener("click",()=>{var s,p;const r=a.querySelector(".newspaper-modal").cloneNode(!0);r.querySelectorAll("img").forEach(m=>{m.src&&!m.src.startsWith("http")&&(m.src=window.location.origin+m.getAttribute("src"))}),(s=r.querySelector("#newspaper-close"))==null||s.remove(),(p=r.querySelector("#newspaper-download"))==null||p.remove();const d=window.open("","_blank");d.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${u(i.newspaper_name)}</title>
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
</head><body>${r.outerHTML}</body></html>`),d.document.close(),d.addEventListener("load",()=>{d.focus(),d.print()})})}function z(e){const{turn:n=0,heat:t=0,partial_agreements:a=[],points_of_agreement:i=[],remaining_disagreements:r=[]}=e;if(!n)return"";const d=Q(t),s=W(t),p="█".repeat(t),m="░".repeat(10-t);let c='<div class="report-stats">';return c+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${n}</span>
  </div>`,c+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${s}">${p}<span style="color:var(--text-dim)">${m}</span> ${d}</span>
  </div>`,i.length&&(c+='<div class="report-section-label">agreements reached</div>',c+=i.map(o=>`<div class="report-agree-item">✓ ${u(o)}</div>`).join("")),a.length&&(c+='<div class="report-section-label">alignments that formed</div>',c+=a.map(o=>`<div class="report-partial"><span class="report-partial-names">${u(o.participants.join(" + "))}</span> — <span class="report-partial-on">${u(o.on)}</span></div>`).join("")),r.length&&(c+='<div class="report-section-label">still unresolved</div>',c+=r.map(o=>typeof o=="object"&&o!==null?`<div class="report-tension">
          <span class="report-tension-topic">${u(o.topic)}</span>
          <span class="report-tension-stance">${u(o.participant_a)}: ${u(o.stance_a)}</span>
          <span class="report-tension-stance">${u(o.participant_b)}: ${u(o.stance_b)}</span>
        </div>`:`<div class="report-tension">${u(String(o))}</div>`).join("")),c+="</div>",c}function $e(e,n){C(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${u(n)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,E(e,t)}function C(e){var n;(n=e.querySelector("#typing-indicator"))==null||n.remove()}function N(e,n){const{topic:t,turn:a=0,heat:i=0,concession_total:r=0,moderator_style:d="socratic",partial_agreements:s=[],points_of_agreement:p=[],remaining_disagreements:m=[]}=n;let c=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${u(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;p.length&&(c+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${p.map(o=>`<div class="sb-agree-item">✓ ${u(o)}</div>`).join("")}
      </div>
    `),s.length&&(c+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${s.map(o=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${u(o.participants.join(" + "))}</div>
            <div class="sb-partial-on">${u(o.on)}</div>
          </div>
        `).join("")}
      </div>
    `),m.length&&(c+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${m.map(o=>typeof o=="object"&&o!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${u(o.topic)}</div>
                <div class="sb-tension-stance">${u(o.participant_a)}: ${u(o.stance_a)}</div>
                <div class="sb-tension-stance">${u(o.participant_b)}: ${u(o.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${u(String(o))}</div>`).join("")}
      </div>
    `),c+=`
    <div class="sb-section" id="sb-bars">
      ${Y(i,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${u(d)}</div>
    </div>
  `,e.innerHTML=c}function _(e){return u(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function E(e,n){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(n),t&&(e.scrollTop=e.scrollHeight)}function u(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Y(e,n){const t=W(e),a=Q(e),i="█".repeat(e),r="░".repeat(10-e),d=Math.min(n,10),s=Se(n),p="█".repeat(d),m="░".repeat(10-d),c=ke(n);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${i}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${s}">${p}</span><span class="sb-heat-empty">${m}</span>
      <span class="sb-heat-label" style="color:${s}">${c} (${n})</span>
    </div>
  `}function Ee(e,n,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=Y(n,t))}function W(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function Q(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Se(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function ke(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Le(e,n){const{turn:t,heat:a,partial_agreements:i,remaining_disagreements:r,drift_topic:d}=e;if(!t)return"The debate is just getting started.";if(d)return`The conversation has drifted from the original topic toward ${d}.`;const s=i||[],p=r||[];if(s.length&&p.length){const c=s[0],o=p[0],h=c.participants.join(" and "),v=typeof o=="object"?o.topic:String(o);return`${h} are finding common ground, but the group remains divided on ${v}.`}if(s.length){const c=s[0];return`${c.participants.join(" and ")} are converging on ${c.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(p.length){const c=p[0];return typeof c=="object"?`${c.participant_a} and ${c.participant_b} are sharply divided over ${c.topic}.`:`The room is deadlocked — ${String(c)}.`}const m=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${m}.`}const A=document.querySelector("#app");async function K(){let e,n;try{[e,n]=await Promise.all([X(),ee()])}catch(a){A.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${a.message}</div>`;return}const t=le(A,e,async({characters:a,topic:i})=>{try{const r=await te(a,i);xe(r.session_id,a,i,n)}catch(r){t.showError(`Could not start session: ${r.message}`)}})}function xe(e,n,t,a){ge(A,e,n,t,a,{steer:se,cheat:oe,deleteSession:re,newTopic:ae,openStream:ce,searchEvidence:ne,fetchNewspaper:ie}),A.addEventListener("debate:quit",()=>K(),{once:!0})}K();
