(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(i){if(i.ep)return;i.ep=!0;const s=t(i);fetch(i.href,s)}})();const E="/api";async function q(e,n){const t=await fetch(`${E}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function D(e){await fetch(`${E}${e}`,{method:"DELETE"})}async function G(){const e=await fetch(`${E}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function W(){const e=await fetch(`${E}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function F(e,n){return q("/sessions",{characters:e,topic:n})}async function Q(e,n,t){return q(`/sessions/${e}/steer`,{text:n,style:t})}async function Y(e,n){return q(`/sessions/${e}/new-topic`,{topic:n})}async function K(e){return D(`/sessions/${e}`)}function J(e,n){const t=new EventSource(`${E}/sessions/${e}/stream`);return t.onmessage=a=>{try{const i=JSON.parse(a.data);n(i)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),n({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const O="https://github.com/mhughes72/fungame03";function x(e,n){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${n}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",i=>{i.target===t&&a()}),document.addEventListener("keydown",function i(s){s.key==="Escape"&&(a(),document.removeEventListener("keydown",i))})}function j(){x("ABOUT",`
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
    <p><a class="info-link" href="${O}" target="_blank" rel="noopener">${O}</a></p>
  `)}function M(){x("HOW TO PLAY",`
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
  `)}function z(e,n,t){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${n.map(o=>`
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
  `;const a=e.querySelectorAll("input[type=checkbox]"),i=new Set(["Abraham Lincoln","Nikola Tesla"]);a.forEach(o=>{i.has(o.value)&&(o.checked=!0)});const s=e.querySelector("#selection-hint"),l=e.querySelector("#start-btn"),c=e.querySelector("#setup-error");function u(){const o=[...a].filter(r=>r.checked).length;o<2?(s.textContent=`Select ${2-o} more`,s.classList.remove("hint-ok","hint-warn")):o>4?(s.textContent=`Too many — deselect ${o-4}`,s.classList.add("hint-warn"),s.classList.remove("hint-ok")):(s.textContent=`${o} selected`,s.classList.add("hint-ok"),s.classList.remove("hint-warn")),l.disabled=o<2||o>4}return u(),a.forEach(o=>o.addEventListener("change",u)),l.addEventListener("click",()=>{const o=[...a].filter(d=>d.checked).map(d=>d.value),r=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";c.textContent="",t({characters:o,topic:r})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!l.disabled&&l.click()}),e.querySelector("#setup-about").addEventListener("click",j),e.querySelector("#setup-help").addEventListener("click",M),{showError(o){c.textContent=o}}}function w(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Z(e,n,t="",a){return new Promise(i=>{const s=document.createElement("div");s.className="steer-drawer",s.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${w(t)}</div>`:""}

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

      <div class="steer-or">── choose a moderator approach ──</div>

      <div class="style-list" id="style-list">
        ${n.map(r=>`
          <button
            class="style-item${r.style===e?" style-selected":""}"
            data-style="${w(r.style)}"
          >
            <span class="style-name">${w(r.style)}</span>
            <span class="style-desc">${w(r.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(a||document.body).appendChild(s);const c=s.querySelector("#steer-text-input");c.focus();let u=e;s.querySelectorAll(".style-item").forEach(r=>{r.addEventListener("click",()=>{s.querySelectorAll(".style-item").forEach(d=>d.classList.remove("style-selected")),r.classList.add("style-selected"),u=r.dataset.style})});function o(){const r=c.value.trim();s.remove(),i({text:r,style:u})}s.querySelector("#steer-submit").addEventListener("click",o),s.querySelector("#steer-quit").addEventListener("click",()=>{s.remove(),i(null)}),c.addEventListener("keydown",r=>{r.key==="Enter"&&o()})})}const _={2:[[18,50],[82,50]],3:[[14,24],[86,24],[50,84]],4:[[14,20],[86,20],[14,80],[86,80]]};function V(e,n){const t=Math.min(n.length,4),a=_[t]||_[4];e.innerHTML=`
    <div class="seating-area">
      <div class="seating-table">
        <span class="seating-table-label">THE BAR</span>
      </div>
      ${n.map((o,r)=>{const[d,g]=a[r]||[50,50],v=X(o),h=ee(o);return`
          <div class="seat" id="seat-${A(o)}"
               style="left:${d}%;top:${g}%">
            <div class="seat-portrait-wrap">
              <img class="seat-img" src="${v}" alt="${H(o)}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
              <div class="seat-initials" style="display:none">${H(h)}</div>
            </div>
            <div class="seat-name">${H(te(o))}</div>
          </div>
        `}).join("")}
    </div>
  `;let i=null;function s(o){return e.querySelector(`#seat-${A(o)}`)}function l(){clearTimeout(i),e.querySelectorAll(".seat").forEach(o=>{o.classList.remove("seat-thinking","seat-speaking")})}function c(o){var r;l(),(r=s(o))==null||r.classList.add("seat-thinking")}function u(o){l();const r=s(o);r&&(r.classList.add("seat-speaking"),i=setTimeout(()=>r.classList.remove("seat-speaking"),3e3))}return{setThinking:c,setSpeaking:u,clearAll:l}}function X(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ee(e){return e.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}function te(e){return e.split(" ").at(-1)}function A(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function se(e,n,t,a,i,s){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${p(a)}</span>
        <button class="info-btn" id="about-btn">About</button>
        <button class="info-btn" id="help-btn">Help</button>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="seats-bar" id="seats-bar"></div>

      <div class="debate-layout">
        <div class="left-col" id="left-col">
          <div class="convo-pane" id="convo-pane"></div>
        </div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `;const l=e.querySelector("#seats-bar"),c=e.querySelector("#convo-pane"),u=e.querySelector("#sidebar"),o=e.querySelector("#left-col");let r="socratic",d=null,g={turn:0,heat:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const v=V(l,t);N(u,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function h({type:U,data:m}){switch(U){case"speaker":v.setThinking(m.name),re(c,m.name);break;case"message":k(c),m.backchannel||v.setSpeaking(m.name),ne(c,m);break;case"state":r=m.moderator_style,g=m,N(u,{topic:a,...m});break;case"steer_needed":r=m.current_style,m.drift_topic&&(f(c,`── DRIFT ── conversation has shifted to: ${m.drift_topic}`),f(c,`   original topic: ${a}`)),Z(r,i,oe(g),o).then(y=>{y===null?C(c,g,t,S):s.steer(n,y.text,y.style).catch(L=>f(c,`Steer error: ${L.message}`))});break;case"consensus":k(c),v.clearAll(),ie(c,m,{onNewTopic(y){s.newTopic(n,y).catch(L=>f(c,`Error: ${L.message}`))},onQuit:S},g);break;case"bar_beat":ae(c,m.text);break;case"system":f(c,m.text);break;case"error":f(c,`⚠ ${m.text}`);break}}function S(){d&&d(),s.deleteSession(n).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",j),e.querySelector("#help-btn").addEventListener("click",M),e.querySelector("#quit-btn").addEventListener("click",()=>{g.turn>0?C(c,g,t,S):S()}),d=s.openStream(n,h)}function ne(e,{role:n,name:t,content:a,backchannel:i}){const s=document.createElement("div");i?(s.className="msg msg-bc",s.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${$(a)}</em>`):n==="moderator"?(s.className="msg msg-moderator",s.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${$(a)}</div>`):n==="user"?(s.className="msg msg-user",s.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${$(a)}</div>`):(s.className="msg msg-philosopher",s.innerHTML=`<div class="msg-name">${p(t)}</div><div class="msg-content">${$(a)}</div>`),b(e,s)}function ae(e,n){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=$(n),b(e,t)}function f(e,n){const t=document.createElement("div");t.className="msg msg-system",t.textContent=n,b(e,t)}function ie(e,{summary:n,points:t},{onNewTopic:a,onQuit:i},s={}){const l=document.createElement("div");l.className="consensus-panel",l.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(n)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(u=>`<li>${p(u)}</li>`).join("")}
      </ul>
    `:""}
    ${P(s)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,b(e,l);const c=l.querySelector("#consensus-topic-input");c.focus(),l.querySelector("#consensus-continue").addEventListener("click",()=>{const u=c.value.trim();u&&a(u)}),c.addEventListener("keydown",u=>{if(u.key==="Enter"){const o=c.value.trim();o&&a(o)}}),l.querySelector("#consensus-end").addEventListener("click",i)}function C(e,n,t,a){k(e);const i=document.createElement("div");i.className="game-over-panel";const s=n.turn||0,l=s?`${s} turn${s!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";i.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(l)}</div>
    ${P(n)}
    <div class="game-over-actions">
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,b(e,i),i.querySelector("#game-over-leave").addEventListener("click",a)}function P(e){const{turn:n=0,heat:t=0,partial_agreements:a=[],points_of_agreement:i=[],remaining_disagreements:s=[]}=e;if(!n)return"";const l=I(t),c=R(t),u="█".repeat(t),o="░".repeat(10-t);let r='<div class="report-stats">';return r+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${n}</span>
  </div>`,r+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${c}">${u}<span style="color:var(--text-dim)">${o}</span> ${l}</span>
  </div>`,i.length&&(r+='<div class="report-section-label">agreements reached</div>',r+=i.map(d=>`<div class="report-agree-item">✓ ${p(d)}</div>`).join("")),a.length&&(r+='<div class="report-section-label">alignments that formed</div>',r+=a.map(d=>`<div class="report-partial"><span class="report-partial-names">${p(d.participants.join(" + "))}</span> — <span class="report-partial-on">${p(d.on)}</span></div>`).join("")),s.length&&(r+='<div class="report-section-label">still unresolved</div>',r+=s.map(d=>typeof d=="object"&&d!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(d.topic)}</span>
          <span class="report-tension-stance">${p(d.participant_a)}: ${p(d.stance_a)}</span>
          <span class="report-tension-stance">${p(d.participant_b)}: ${p(d.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(d))}</div>`).join("")),r+="</div>",r}function re(e,n){k(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(n)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,b(e,t)}function k(e){var n;(n=e.querySelector("#typing-indicator"))==null||n.remove()}function N(e,n){const{topic:t,turn:a=0,heat:i=0,moderator_style:s="socratic",partial_agreements:l=[],points_of_agreement:c=[],remaining_disagreements:u=[]}=n,o=R(i),r=I(i),d="█".repeat(i),g="░".repeat(10-i);let v=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;c.length&&(v+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${c.map(h=>`<div class="sb-agree-item">✓ ${p(h)}</div>`).join("")}
      </div>
    `),l.length&&(v+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${l.map(h=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(h.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(h.on)}</div>
          </div>
        `).join("")}
      </div>
    `),u.length&&(v+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${u.map(h=>typeof h=="object"&&h!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(h.topic)}</div>
                <div class="sb-tension-stance">${p(h.participant_a)}: ${p(h.stance_a)}</div>
                <div class="sb-tension-stance">${p(h.participant_b)}: ${p(h.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(h))}</div>`).join("")}
      </div>
    `),v+=`
    <div class="sb-section">
      <div class="sb-label">── HEAT ──</div>
      <div class="sb-heat">
        <span style="color:${o}">${d}</span><span class="sb-heat-empty">${g}</span>
        <span class="sb-heat-label" style="color:${o}">${r}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(s)}</div>
    </div>
  `,e.innerHTML=v}function $(e){return p(e).replace(/\n/g,"<br>").replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>')}function b(e,n){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(n),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function I(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function oe(e,n){const{turn:t,heat:a,partial_agreements:i,remaining_disagreements:s,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const c=i||[],u=s||[];if(c.length&&u.length){const r=c[0],d=u[0],g=r.participants.join(" and "),v=typeof d=="object"?d.topic:String(d);return`${g} are finding common ground, but the group remains divided on ${v}.`}if(c.length){const r=c[0];return`${r.participants.join(" and ")} are converging on ${r.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(u.length){const r=u[0];return typeof r=="object"?`${r.participant_a} and ${r.participant_b} are sharply divided over ${r.topic}.`:`The room is deadlocked — ${String(r)}.`}const o=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${o}.`}const T=document.querySelector("#app");async function B(){let e,n;try{[e,n]=await Promise.all([G(),W()])}catch(a){T.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${a.message}</div>`;return}const t=z(T,e,async({characters:a,topic:i})=>{try{const s=await F(a,i);ce(s.session_id,a,i,n)}catch(s){t.showError(`Could not start session: ${s.message}`)}})}function ce(e,n,t,a){se(T,e,n,t,a,{steer:Q,deleteSession:K,newTopic:Y,openStream:J}),T.addEventListener("debate:quit",()=>B(),{once:!0})}B();
