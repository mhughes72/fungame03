(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();const w="/api";async function q(e,a){const t=await fetch(`${w}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!t.ok){const i=await t.text();throw new Error(`${t.status} ${t.statusText}: ${i}`)}return t.json()}async function D(e){await fetch(`${w}${e}`,{method:"DELETE"})}async function G(){const e=await fetch(`${w}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function W(){const e=await fetch(`${w}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function F(e,a){return q("/sessions",{characters:e,topic:a})}async function Q(e,a,t){return q(`/sessions/${e}/steer`,{text:a,style:t})}async function Y(e,a){return q(`/sessions/${e}/new-topic`,{topic:a})}async function K(e){return D(`/sessions/${e}`)}function J(e,a){const t=new EventSource(`${w}/sessions/${e}/stream`);return t.onmessage=i=>{try{const s=JSON.parse(i.data);a(s)}catch{console.error("Unparseable SSE frame:",i.data)}},t.onerror=i=>{console.error("SSE error",i),a({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const A="https://github.com/mhughes72/fungame03";function N(e,a){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${a}</div>
    </div>
  `,document.body.appendChild(t);function i(){t.remove()}t.querySelector(".info-close").addEventListener("click",i),t.addEventListener("click",s=>{s.target===t&&i()}),document.addEventListener("keydown",function s(n){n.key==="Escape"&&(i(),document.removeEventListener("keydown",s))})}function j(){N("ABOUT",`
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
    <p><a class="info-link" href="${A}" target="_blank" rel="noopener">${A}</a></p>
  `)}function M(){N("HOW TO PLAY",`
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
  `)}function Z(e,a,t){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${a.map(o=>`
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
  `;const i=e.querySelectorAll("input[type=checkbox]"),s=e.querySelector("#selection-hint"),n=e.querySelector("#start-btn"),d=e.querySelector("#setup-error");function c(){const o=[...i].filter(l=>l.checked).length;o<2?(s.textContent=`Select ${2-o} more`,s.classList.remove("hint-ok","hint-warn")):o>4?(s.textContent=`Too many — deselect ${o-4}`,s.classList.add("hint-warn"),s.classList.remove("hint-ok")):(s.textContent=`${o} selected`,s.classList.add("hint-ok"),s.classList.remove("hint-warn")),n.disabled=o<2||o>4}return c(),i.forEach(o=>o.addEventListener("change",c)),n.addEventListener("click",()=>{const o=[...i].filter(r=>r.checked).map(r=>r.value),l=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";d.textContent="",t({characters:o,topic:l})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!n.disabled&&n.click()}),e.querySelector("#setup-about").addEventListener("click",j),e.querySelector("#setup-help").addEventListener("click",M),{showError(o){d.textContent=o}}}function T(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function z(e,a,t="",i){return new Promise(s=>{const n=document.createElement("div");n.className="steer-drawer",n.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── STEER THE DEBATE ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      ${t?`<div class="steer-summary">${T(t)}</div>`:""}

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
        ${a.map(r=>`
          <button
            class="style-item${r.style===e?" style-selected":""}"
            data-style="${T(r.style)}"
          >
            <span class="style-name">${T(r.style)}</span>
            <span class="style-desc">${T(r.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(i||document.body).appendChild(n);const c=n.querySelector("#steer-text-input");c.focus();let o=e;n.querySelectorAll(".style-item").forEach(r=>{r.addEventListener("click",()=>{n.querySelectorAll(".style-item").forEach(u=>u.classList.remove("style-selected")),r.classList.add("style-selected"),o=r.dataset.style,l()})});function l(){const r=c.value.trim();n.remove(),s({text:r,style:o})}n.querySelector("#steer-submit").addEventListener("click",l),n.querySelector("#steer-quit").addEventListener("click",()=>{n.remove(),s(null)}),c.addEventListener("keydown",r=>{r.key==="Enter"&&l()})})}const O={2:[[18,50],[82,50]],3:[[14,24],[86,24],[50,84]],4:[[14,20],[86,20],[14,80],[86,80]]};function V(e,a){const t=Math.min(a.length,4),i=O[t]||O[4];e.innerHTML=`
    <div class="seating-area">
      <div class="seating-table">
        <span class="seating-table-label">THE BAR</span>
      </div>
      ${a.map((l,r)=>{const[u,g]=i[r]||[50,50],v=X(l),h=ee(l);return`
          <div class="seat" id="seat-${C(l)}"
               style="left:${u}%;top:${g}%">
            <div class="seat-portrait-wrap">
              <img class="seat-img" src="${v}" alt="${H(l)}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
              <div class="seat-initials" style="display:none">${H(h)}</div>
            </div>
            <div class="seat-name">${H(te(l))}</div>
          </div>
        `}).join("")}
    </div>
  `;let s=null;function n(l){return e.querySelector(`#seat-${C(l)}`)}function d(){clearTimeout(s),e.querySelectorAll(".seat").forEach(l=>{l.classList.remove("seat-thinking","seat-speaking")})}function c(l){var r;d(),(r=n(l))==null||r.classList.add("seat-thinking")}function o(l){d();const r=n(l);r&&(r.classList.add("seat-speaking"),s=setTimeout(()=>r.classList.remove("seat-speaking"),3e3))}return{setThinking:c,setSpeaking:o,clearAll:d}}function X(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function ee(e){return e.split(" ").map(a=>a[0]).join("").slice(0,2).toUpperCase()}function te(e){return e.split(" ").at(-1)}function C(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function se(e,a,t,i,s,n){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${p(i)}</span>
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
  `;const d=e.querySelector("#seats-bar"),c=e.querySelector("#convo-pane"),o=e.querySelector("#sidebar"),l=e.querySelector("#left-col");let r="socratic",u=null,g={turn:0,heat:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const v=V(d,t);x(o,{topic:i,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function h({type:U,data:m}){switch(U){case"speaker":v.setThinking(m.name),re(c,m.name);break;case"message":S(c),m.backchannel||v.setSpeaking(m.name),ne(c,m);break;case"state":r=m.moderator_style,g=m,x(o,{topic:i,...m});break;case"steer_needed":r=m.current_style,m.drift_topic&&(f(c,`── DRIFT ── conversation has shifted to: ${m.drift_topic}`),f(c,`   original topic: ${i}`)),d.style.display="none",c.scrollTop=c.scrollHeight,z(r,s,oe(g),l).then($=>{d.style.display="",$===null?_(c,g,t,y):n.steer(a,$.text,$.style).catch(L=>f(c,`Steer error: ${L.message}`))});break;case"consensus":S(c),v.clearAll(),ie(c,m,{onNewTopic($){n.newTopic(a,$).catch(L=>f(c,`Error: ${L.message}`))},onQuit:y},g);break;case"game_over":S(c),v.clearAll(),_(c,m,t,y);break;case"bar_beat":ae(c,m.text);break;case"system":f(c,m.text);break;case"error":f(c,`⚠ ${m.text}`);break}}function y(){u&&u(),n.deleteSession(a).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",j),e.querySelector("#help-btn").addEventListener("click",M),e.querySelector("#quit-btn").addEventListener("click",()=>{g.turn>0?_(c,g,t,y):y()}),u=n.openStream(a,h)}function ne(e,{role:a,name:t,content:i,backchannel:s}){const n=document.createElement("div");s?(n.className="msg msg-bc",n.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${E(i)}</em>`):a==="moderator"?(n.className="msg msg-moderator",n.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${E(i)}</div>`):a==="user"?(n.className="msg msg-user",n.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${E(i)}</div>`):(n.className="msg msg-philosopher",n.innerHTML=`<div class="msg-name">${p(t)}</div><div class="msg-content">${E(i)}</div>`),b(e,n)}function ae(e,a){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=E(a),b(e,t)}function f(e,a){const t=document.createElement("div");t.className="msg msg-system",t.textContent=a,b(e,t)}function ie(e,{summary:a,points:t},{onNewTopic:i,onQuit:s},n={}){const d=document.createElement("div");d.className="consensus-panel",d.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${p(a)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(o=>`<li>${p(o)}</li>`).join("")}
      </ul>
    `:""}
    ${P(n)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,b(e,d);const c=d.querySelector("#consensus-topic-input");c.focus(),d.querySelector("#consensus-continue").addEventListener("click",()=>{const o=c.value.trim();o&&i(o)}),c.addEventListener("keydown",o=>{if(o.key==="Enter"){const l=c.value.trim();l&&i(l)}}),d.querySelector("#consensus-end").addEventListener("click",s)}function _(e,a,t,i){S(e);const s=document.createElement("div");s.className="game-over-panel";const n=a.turn||0,d=n?`${n} turn${n!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";s.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${p(d)}</div>
    ${P(a)}
    <div class="game-over-actions">
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,b(e,s),s.querySelector("#game-over-leave").addEventListener("click",i)}function P(e){const{turn:a=0,heat:t=0,partial_agreements:i=[],points_of_agreement:s=[],remaining_disagreements:n=[]}=e;if(!a)return"";const d=I(t),c=R(t),o="█".repeat(t),l="░".repeat(10-t);let r='<div class="report-stats">';return r+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${a}</span>
  </div>`,r+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${c}">${o}<span style="color:var(--text-dim)">${l}</span> ${d}</span>
  </div>`,s.length&&(r+='<div class="report-section-label">agreements reached</div>',r+=s.map(u=>`<div class="report-agree-item">✓ ${p(u)}</div>`).join("")),i.length&&(r+='<div class="report-section-label">alignments that formed</div>',r+=i.map(u=>`<div class="report-partial"><span class="report-partial-names">${p(u.participants.join(" + "))}</span> — <span class="report-partial-on">${p(u.on)}</span></div>`).join("")),n.length&&(r+='<div class="report-section-label">still unresolved</div>',r+=n.map(u=>typeof u=="object"&&u!==null?`<div class="report-tension">
          <span class="report-tension-topic">${p(u.topic)}</span>
          <span class="report-tension-stance">${p(u.participant_a)}: ${p(u.stance_a)}</span>
          <span class="report-tension-stance">${p(u.participant_b)}: ${p(u.stance_b)}</span>
        </div>`:`<div class="report-tension">${p(String(u))}</div>`).join("")),r+="</div>",r}function re(e,a){S(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(a)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,b(e,t)}function S(e){var a;(a=e.querySelector("#typing-indicator"))==null||a.remove()}function x(e,a){const{topic:t,turn:i=0,heat:s=0,moderator_style:n="socratic",partial_agreements:d=[],points_of_agreement:c=[],remaining_disagreements:o=[]}=a,l=R(s),r=I(s),u="█".repeat(s),g="░".repeat(10-s);let v=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${i}</div>
  `;c.length&&(v+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${c.map(h=>`<div class="sb-agree-item">✓ ${p(h)}</div>`).join("")}
      </div>
    `),d.length&&(v+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${d.map(h=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(h.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(h.on)}</div>
          </div>
        `).join("")}
      </div>
    `),o.length&&(v+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${o.map(h=>typeof h=="object"&&h!==null?`
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
        <span style="color:${l}">${u}</span><span class="sb-heat-empty">${g}</span>
        <span class="sb-heat-label" style="color:${l}">${r}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(n)}</div>
    </div>
  `,e.innerHTML=v}function E(e){let t=p(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>');return t=t.replace(/\*([A-Z][^*]+?)\*(?!\])/g,(i,s)=>s.includes("[")||s.includes("]")?i:`<em class="stage-dir">[${s}]</em>`),t.replace(/\n/g,"<br>")}function b(e,a){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(a),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function I(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function oe(e,a){const{turn:t,heat:i,partial_agreements:s,remaining_disagreements:n,drift_topic:d}=e;if(!t)return"The debate is just getting started.";if(d)return`The conversation has drifted from the original topic toward ${d}.`;const c=s||[],o=n||[];if(c.length&&o.length){const r=c[0],u=o[0],g=r.participants.join(" and "),v=typeof u=="object"?u.topic:String(u);return`${g} are finding common ground, but the group remains divided on ${v}.`}if(c.length){const r=c[0];return`${r.participants.join(" and ")} are converging on ${r.on}, ${i>=6?"though tempers are running high":"with the room following closely"}.`}if(o.length){const r=o[0];return typeof r=="object"?`${r.participant_a} and ${r.participant_b} are sharply divided over ${r.topic}.`:`The room is deadlocked — ${String(r)}.`}const l=i>=8?"at flashpoint":i>=5?"heating up":i>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${l}.`}const k=document.querySelector("#app");async function B(){let e,a;try{[e,a]=await Promise.all([G(),W()])}catch(i){k.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${i.message}</div>`;return}const t=Z(k,e,async({characters:i,topic:s})=>{try{const n=await F(i,s);ce(n.session_id,i,s,a)}catch(n){t.showError(`Could not start session: ${n.message}`)}})}function ce(e,a,t,i){se(k,e,a,t,i,{steer:Q,deleteSession:K,newTopic:Y,openStream:J}),k.addEventListener("debate:quit",()=>B(),{once:!0})}B();
