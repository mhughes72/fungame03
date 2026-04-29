(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const u of r.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const _="/api";async function H(e,s){const t=await fetch(`${_}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function Q(e){await fetch(`${_}${e}`,{method:"DELETE"})}async function Y(){const e=await fetch(`${_}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function K(){const e=await fetch(`${_}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function J(e,s){return H("/sessions",{characters:e,topic:s})}async function Z(e,s,t,a="",n={}){return H(`/sessions/${e}/steer`,{text:s,style:t,evidence:a,drinks:n})}async function z(e){return H("/search",{query:e})}async function V(e,s){return H(`/sessions/${e}/new-topic`,{topic:s})}async function X(e){return Q(`/sessions/${e}`)}function ee(e,s){const t=new EventSource(`${_}/sessions/${e}/stream`);return t.onmessage=a=>{try{const n=JSON.parse(a.data);s(n)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const M="https://github.com/mhughes72/fungame03";function P(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",function n(r){r.key==="Escape"&&(a(),document.removeEventListener("keydown",n))})}function R(){P("ABOUT",`
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
  `)}function B(){P("HOW TO PLAY",`
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
  `)}function te(e,s,t){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${s.map(o=>`
            <label class="char-row" data-name="${o.name}">
              <input type="checkbox" value="${o.name}" />
              <span class="char-name">${o.name}</span>
              <span class="char-era">${o.era}</span>
            </label>
          `).join("")}
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
  `;const a=e.querySelectorAll("input[type=checkbox]"),n=e.querySelector("#selection-hint"),r=e.querySelector("#start-btn"),u=e.querySelector("#setup-error");function i(){const o=[...a].filter(p=>p.checked).length;o<2?(n.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",n.classList.remove("hint-ok","hint-warn")):o>4?(n.textContent=`Too many — deselect ${o-4}`,n.classList.add("hint-warn"),n.classList.remove("hint-ok")):(n.textContent=`${o} selected`,n.classList.add("hint-ok"),n.classList.remove("hint-warn")),r.disabled=o<2||o>4}return i(),a.forEach(o=>o.addEventListener("change",i)),r.addEventListener("click",()=>{const o=[...a].filter(d=>d.checked).map(d=>d.value),p=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";u.textContent="",t({characters:o,topic:p})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!r.disabled&&r.click()}),e.querySelector("#setup-about").addEventListener("click",R),e.querySelector("#setup-help").addEventListener("click",B),{showError(o){u.textContent=o}}}function $(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function se(e,s,t="",a,n=null,r=[]){return new Promise(u=>{const i={};r.forEach(l=>{i[l]=0});const o=r.length?`
      <div class="steer-or">── buy a round ──</div>
      <div class="drinks-grid" id="drinks-grid">
        ${r.map(l=>`
          <div class="drink-row" data-name="${$(l)}">
            <span class="drink-name">${$(l)}</span>
            <div class="drink-controls">
              <button class="drink-btn drink-minus" data-name="${$(l)}">−</button>
              <span class="drink-count" id="drink-count-${$(l.replace(/ /g,"_"))}">0</span>
              <button class="drink-btn drink-plus" data-name="${$(l)}">+</button>
            </div>
          </div>
        `).join("")}
      </div>
    `:"",p=document.createElement("div");p.className="steer-drawer",p.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${$(t)}</div>`:""}

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

      ${o}

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
        ${s.map(l=>`
          <button
            class="style-item${l.style===e?" style-selected":""}"
            data-style="${$(l.style)}"
          >
            <span class="style-name">${$(l.style)}</span>
            <span class="style-desc">${$(l.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(a||document.body).appendChild(p);const c=p.querySelector("#steer-text-input"),g=p.querySelector("#evidence-query"),b=p.querySelector("#evidence-search"),f=p.querySelector("#evidence-preview");c.focus();let k=e,y="";p.querySelectorAll(".drink-btn").forEach(l=>{l.addEventListener("click",()=>{const h=l.dataset.name,w=l.classList.contains("drink-plus")?1:-1;i[h]=Math.max(0,(i[h]||0)+w);const x=h.replace(/ /g,"_"),j=p.querySelector(`#drink-count-${x}`);j&&(j.textContent=i[h])})});async function q(){const l=g.value.trim();if(!(!l||!n)){b.disabled=!0,b.textContent="Searching…",f.style.display="none",y="";try{const h=await n(l);y=h.finding,f.style.display="block",f.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${$(h.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,f.querySelector("#evidence-accept").addEventListener("click",()=>{f.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${$(y)}</div>`}),f.querySelector("#evidence-discard").addEventListener("click",()=>{y="",f.style.display="none"})}catch(h){f.style.display="block",f.textContent=`Search failed: ${h.message}`}finally{b.disabled=!1,b.textContent="Search"}}}b.addEventListener("click",q),g.addEventListener("keydown",l=>{l.key==="Enter"&&q()}),p.querySelectorAll(".style-item").forEach(l=>{l.addEventListener("click",()=>{p.querySelectorAll(".style-item").forEach(h=>h.classList.remove("style-selected")),l.classList.add("style-selected"),k=l.dataset.style,m()})});function m(){const l=c.value.trim(),h=Object.fromEntries(Object.entries(i).filter(([,w])=>w>0));p.remove(),u({text:l,style:k,evidence:y,drinks:h})}p.querySelector("#steer-submit").addEventListener("click",m),p.querySelector("#steer-quit").addEventListener("click",()=>{p.remove(),u(null)}),c.addEventListener("keydown",l=>{l.key==="Enter"&&m()})})}function ne(e,s){e.innerHTML=s.map(i=>{const o=ae(i),p=ie(i);return`
      <div class="seat" id="seat-${I(i)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${o}" alt="${O(i)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${O(p)}</div>
        </div>
        <div class="seat-name">${O(re(i))}</div>
      </div>
    `}).join("");let t=null;function a(i){return e.querySelector(`#seat-${I(i)}`)}function n(){clearTimeout(t),e.querySelectorAll(".seat").forEach(i=>{i.classList.remove("seat-thinking","seat-speaking")})}function r(i){var o;n(),(o=a(i))==null||o.classList.add("seat-thinking")}function u(i){n();const o=a(i);o&&(o.classList.add("seat-speaking"),t=setTimeout(()=>o.classList.remove("seat-speaking"),3e3))}return{setThinking:r,setSpeaking:u,clearAll:n}}function ae(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ie(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function re(e){return e.split(" ").at(-1)}function I(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function O(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function oe(e,s,t,a,n,r){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${v(a)}</span>
        <button class="info-btn" id="about-btn">About</button>
        <button class="info-btn" id="help-btn">Help</button>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="debate-layout">
        <div class="left-col" id="left-col">
          <div class="convo-pane" id="convo-pane"></div>
        </div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `;const u=e.querySelector("#seats-bar"),i=e.querySelector("#convo-pane"),o=e.querySelector("#sidebar"),p=e.querySelector("#left-col");let d="socratic",c=null,g=!1,b={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const f=ne(u,t);N(o,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function k({type:q,data:m}){switch(q){case"speaker":f.setThinking(m.name),ue(i,m.name);break;case"message":T(i),m.backchannel||f.setSpeaking(m.name),ce(i,m);break;case"bars":ve(o,m.heat,m.concession_total??0);break;case"debug":{const l=m.data!=null?m.data:"",h=typeof l=="object"?`
`+Object.entries(l).map(([w,x])=>`  ${w}: ${JSON.stringify(x)}`).join(`
`):l?` — ${l}`:"";console.log(`[${m.channel}] ${m.label}${h}`);break}case"state":d=m.moderator_style,b=m,N(o,{topic:a,...m});break;case"steer_needed":d=m.current_style,m.drift_topic&&(S(i,`── DRIFT ── conversation has shifted to: ${m.drift_topic}`),S(i,`   original topic: ${a}`)),i.scrollTop=i.scrollHeight,se(d,n,be(b),p,r.searchEvidence,t).then(l=>{l===null?A(i,b,t,y):r.steer(s,l.text,l.style,l.evidence||"",l.drinks||{}).catch(h=>S(i,`Steer error: ${h.message}`))});break;case"consensus":if(g)break;g=!0,c&&(c(),c=null),T(i),f.clearAll(),pe(i,m,{onNewTopic(l){r.newTopic(s,l).then(()=>{g=!1,b={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=l,N(o,{topic:l,...b,moderator_style:d,points_of_agreement:[]}),f.clearAll(),c=r.openStream(s,k)}).catch(h=>S(i,`Error: ${h.message}`))},onQuit:y},b);break;case"game_over":if(g)break;g=!0,c&&(c(),c=null),T(i),f.clearAll(),A(i,m,t,y);break;case"bar_beat":le(i,m.text);break;case"evidence":de(i,m.finding);break;case"system":S(i,m.text);break;case"error":S(i,`⚠ ${m.text}`);break}}function y(){c&&c(),r.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",R),e.querySelector("#help-btn").addEventListener("click",B),e.querySelector("#quit-btn").addEventListener("click",()=>{if(g){y();return}b.turn>0?(g=!0,c&&(c(),c=null),A(i,b,t,y)):y()}),c=r.openStream(s,k)}function ce(e,{role:s,name:t,content:a,backchannel:n}){const r=document.createElement("div");if(n)r.className="msg msg-bc",r.innerHTML=`<span class="bc-name">${v(t)}:</span> <em>${L(a)}</em>`;else if(s==="moderator")r.className="msg msg-moderator",r.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${L(a)}</div>`;else if(s==="user")r.className="msg msg-user",r.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${L(a)}</div>`;else{const u=`/portraits/${t.replace(/ /g,"_")}.png`,i=t.split(" ").map(o=>o[0]).join("").slice(0,2).toUpperCase();r.className="msg msg-philosopher",r.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${u}" alt="${v(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${v(i)}</div></div><div class="msg-body"><div class="msg-name">${v(t)}</div><div class="msg-content">${L(a)}</div></div>`}E(e,r)}function le(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=L(s),E(e,t)}function S(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,E(e,t)}function de(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${v(s)}`,E(e,t)}function pe(e,{summary:s,points:t},{onNewTopic:a,onQuit:n},r={}){const u=document.createElement("div");u.className="consensus-panel",u.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${v(s)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(o=>`<li>${v(o)}</li>`).join("")}
      </ul>
    `:""}
    ${U(r)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,E(e,u);const i=u.querySelector("#consensus-topic-input");i.focus(),u.querySelector("#consensus-continue").addEventListener("click",()=>{const o=i.value.trim();o&&a(o)}),i.addEventListener("keydown",o=>{if(o.key==="Enter"){const p=i.value.trim();p&&a(p)}}),u.querySelector("#consensus-end").addEventListener("click",n)}function A(e,s,t,a){T(e);const n=document.createElement("div");n.className="game-over-panel";const r=s.turn||0,u=r?`${r} turn${r!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";n.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${v(u)}</div>
    ${U(s)}
    <div class="game-over-actions">
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,E(e,n),n.querySelector("#game-over-leave").addEventListener("click",a)}function U(e){const{turn:s=0,heat:t=0,partial_agreements:a=[],points_of_agreement:n=[],remaining_disagreements:r=[]}=e;if(!s)return"";const u=G(t),i=F(t),o="█".repeat(t),p="░".repeat(10-t);let d='<div class="report-stats">';return d+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${s}</span>
  </div>`,d+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${i}">${o}<span style="color:var(--text-dim)">${p}</span> ${u}</span>
  </div>`,n.length&&(d+='<div class="report-section-label">agreements reached</div>',d+=n.map(c=>`<div class="report-agree-item">✓ ${v(c)}</div>`).join("")),a.length&&(d+='<div class="report-section-label">alignments that formed</div>',d+=a.map(c=>`<div class="report-partial"><span class="report-partial-names">${v(c.participants.join(" + "))}</span> — <span class="report-partial-on">${v(c.on)}</span></div>`).join("")),r.length&&(d+='<div class="report-section-label">still unresolved</div>',d+=r.map(c=>typeof c=="object"&&c!==null?`<div class="report-tension">
          <span class="report-tension-topic">${v(c.topic)}</span>
          <span class="report-tension-stance">${v(c.participant_a)}: ${v(c.stance_a)}</span>
          <span class="report-tension-stance">${v(c.participant_b)}: ${v(c.stance_b)}</span>
        </div>`:`<div class="report-tension">${v(String(c))}</div>`).join("")),d+="</div>",d}function ue(e,s){T(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${v(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,E(e,t)}function T(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function N(e,s){const{topic:t,turn:a=0,heat:n=0,concession_total:r=0,moderator_style:u="socratic",partial_agreements:i=[],points_of_agreement:o=[],remaining_disagreements:p=[]}=s;let d=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${v(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;o.length&&(d+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${o.map(c=>`<div class="sb-agree-item">✓ ${v(c)}</div>`).join("")}
      </div>
    `),i.length&&(d+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${i.map(c=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${v(c.participants.join(" + "))}</div>
            <div class="sb-partial-on">${v(c.on)}</div>
          </div>
        `).join("")}
      </div>
    `),p.length&&(d+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${p.map(c=>typeof c=="object"&&c!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${v(c.topic)}</div>
                <div class="sb-tension-stance">${v(c.participant_a)}: ${v(c.stance_a)}</div>
                <div class="sb-tension-stance">${v(c.participant_b)}: ${v(c.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${v(String(c))}</div>`).join("")}
      </div>
    `),d+=`
    <div class="sb-section" id="sb-bars">
      ${D(n,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${v(u)}</div>
    </div>
  `,e.innerHTML=d}function L(e){let t=v(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>');return t=t.replace(/\*([A-Z][^*]+?)\*(?!\])/g,(a,n)=>n.includes("[")||n.includes("]")?a:`<em class="stage-dir">[${n}]</em>`),t.replace(/\n/g,"<br>")}function E(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function v(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function D(e,s){const t=F(e),a=G(e),n="█".repeat(e),r="░".repeat(10-e),u=Math.min(s,10),i=me(s),o="█".repeat(u),p="░".repeat(10-u),d=he(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${n}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${i}">${o}</span><span class="sb-heat-empty">${p}</span>
      <span class="sb-heat-label" style="color:${i}">${d} (${s})</span>
    </div>
  `}function ve(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=D(s,t))}function F(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function G(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function me(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function he(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function be(e,s){const{turn:t,heat:a,partial_agreements:n,remaining_disagreements:r,drift_topic:u}=e;if(!t)return"The debate is just getting started.";if(u)return`The conversation has drifted from the original topic toward ${u}.`;const i=n||[],o=r||[];if(i.length&&o.length){const d=i[0],c=o[0],g=d.participants.join(" and "),b=typeof c=="object"?c.topic:String(c);return`${g} are finding common ground, but the group remains divided on ${b}.`}if(i.length){const d=i[0];return`${d.participants.join(" and ")} are converging on ${d.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(o.length){const d=o[0];return typeof d=="object"?`${d.participant_a} and ${d.participant_b} are sharply divided over ${d.topic}.`:`The room is deadlocked — ${String(d)}.`}const p=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${p}.`}const C=document.querySelector("#app");async function W(){let e,s;try{[e,s]=await Promise.all([Y(),K()])}catch(a){C.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${a.message}</div>`;return}const t=te(C,e,async({characters:a,topic:n})=>{try{const r=await J(a,n);fe(r.session_id,a,n,s)}catch(r){t.showError(`Could not start session: ${r.message}`)}})}function fe(e,s,t,a){oe(C,e,s,t,a,{steer:Z,deleteSession:X,newTopic:V,openStream:ee,searchEvidence:z}),C.addEventListener("debate:quit",()=>W(),{once:!0})}W();
