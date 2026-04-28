(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const s of n)if(s.type==="childList")for(const p of s.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&i(p)}).observe(document,{childList:!0,subtree:!0});function t(n){const s={};return n.integrity&&(s.integrity=n.integrity),n.referrerPolicy&&(s.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?s.credentials="include":n.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(n){if(n.ep)return;n.ep=!0;const s=t(n);fetch(n.href,s)}})();const k="/api";async function A(e,a){const t=await fetch(`${k}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!t.ok){const i=await t.text();throw new Error(`${t.status} ${t.statusText}: ${i}`)}return t.json()}async function G(e){await fetch(`${k}${e}`,{method:"DELETE"})}async function W(){const e=await fetch(`${k}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function F(){const e=await fetch(`${k}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function Q(e,a){return A("/sessions",{characters:e,topic:a})}async function Y(e,a,t){return A(`/sessions/${e}/steer`,{text:a,style:t})}async function K(e,a){return A(`/sessions/${e}/new-topic`,{topic:a})}async function J(e){return G(`/sessions/${e}`)}function Z(e,a){const t=new EventSource(`${k}/sessions/${e}/stream`);return t.onmessage=i=>{try{const n=JSON.parse(i.data);a(n)}catch{console.error("Unparseable SSE frame:",i.data)}},t.onerror=i=>{console.error("SSE error",i),a({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const O="https://github.com/mhughes72/fungame03";function j(e,a){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${a}</div>
    </div>
  `,document.body.appendChild(t);function i(){t.remove()}t.querySelector(".info-close").addEventListener("click",i),t.addEventListener("click",n=>{n.target===t&&i()}),document.addEventListener("keydown",function n(s){s.key==="Escape"&&(i(),document.removeEventListener("keydown",n))})}function M(){j("ABOUT",`
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
  `)}function P(){j("HOW TO PLAY",`
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
  `)}function z(e,a,t){e.innerHTML=`
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
  `;const i=e.querySelectorAll("input[type=checkbox]"),n=e.querySelector("#selection-hint"),s=e.querySelector("#start-btn"),p=e.querySelector("#setup-error");function c(){const o=[...i].filter(d=>d.checked).length;o<2?(n.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",n.classList.remove("hint-ok","hint-warn")):o>4?(n.textContent=`Too many — deselect ${o-4}`,n.classList.add("hint-warn"),n.classList.remove("hint-ok")):(n.textContent=`${o} selected`,n.classList.add("hint-ok"),n.classList.remove("hint-warn")),s.disabled=o<2||o>4}return c(),i.forEach(o=>o.addEventListener("change",c)),s.addEventListener("click",()=>{const o=[...i].filter(r=>r.checked).map(r=>r.value),d=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";p.textContent="",t({characters:o,topic:d})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!s.disabled&&s.click()}),e.querySelector("#setup-about").addEventListener("click",M),e.querySelector("#setup-help").addEventListener("click",P),{showError(o){p.textContent=o}}}function w(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function V(e,a,t="",i){return new Promise(n=>{const s=document.createElement("div");s.className="steer-drawer",s.innerHTML=`
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
        ${a.map(r=>`
          <button
            class="style-item${r.style===e?" style-selected":""}"
            data-style="${w(r.style)}"
          >
            <span class="style-name">${w(r.style)}</span>
            <span class="style-desc">${w(r.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(i||document.body).appendChild(s);const c=s.querySelector("#steer-text-input");c.focus();let o=e;s.querySelectorAll(".style-item").forEach(r=>{r.addEventListener("click",()=>{s.querySelectorAll(".style-item").forEach(l=>l.classList.remove("style-selected")),r.classList.add("style-selected"),o=r.dataset.style,d()})});function d(){const r=c.value.trim();s.remove(),n({text:r,style:o})}s.querySelector("#steer-submit").addEventListener("click",d),s.querySelector("#steer-quit").addEventListener("click",()=>{s.remove(),n(null)}),c.addEventListener("keydown",r=>{r.key==="Enter"&&d()})})}const x={2:[[18,50],[82,50]],3:[[14,24],[86,24],[50,84]],4:[[14,20],[86,20],[14,80],[86,80]]};function X(e,a){const t=Math.min(a.length,4),i=x[t]||x[4];e.innerHTML=`
    <div class="seating-area">
      <div class="seating-table">
        <span class="seating-table-label">THE BAR</span>
      </div>
      ${a.map((d,r)=>{const[l,g]=i[r]||[50,50],h=ee(d),m=te(d);return`
          <div class="seat" id="seat-${N(d)}"
               style="left:${l}%;top:${g}%">
            <div class="seat-portrait-wrap">
              <img class="seat-img" src="${h}" alt="${_(d)}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
              <div class="seat-initials" style="display:none">${_(m)}</div>
            </div>
            <div class="seat-name">${_(se(d))}</div>
          </div>
        `}).join("")}
    </div>
  `;let n=null;function s(d){return e.querySelector(`#seat-${N(d)}`)}function p(){clearTimeout(n),e.querySelectorAll(".seat").forEach(d=>{d.classList.remove("seat-thinking","seat-speaking")})}function c(d){var r;p(),(r=s(d))==null||r.classList.add("seat-thinking")}function o(d){p();const r=s(d);r&&(r.classList.add("seat-speaking"),n=setTimeout(()=>r.classList.remove("seat-speaking"),3e3))}return{setThinking:c,setSpeaking:o,clearAll:p}}function ee(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function te(e){return e.split(" ").map(a=>a[0]).join("").slice(0,2).toUpperCase()}function se(e){return e.split(" ").at(-1)}function N(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function _(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ne(e,a,t,i,n,s){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${u(i)}</span>
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
  `;const p=e.querySelector("#seats-bar"),c=e.querySelector("#convo-pane"),o=e.querySelector("#sidebar"),d=e.querySelector("#left-col");let r="socratic",l=null,g=!1,h={turn:0,heat:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const m=X(p,t);q(o,{topic:i,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function C({type:D,data:v}){switch(D){case"speaker":m.setThinking(v.name),oe(c,v.name);break;case"message":E(c),v.backchannel||m.setSpeaking(v.name),ae(c,v);break;case"state":r=v.moderator_style,h=v,q(o,{topic:i,...v});break;case"steer_needed":r=v.current_style,v.drift_topic&&(y(c,`── DRIFT ── conversation has shifted to: ${v.drift_topic}`),y(c,`   original topic: ${i}`)),p.style.display="none",c.scrollTop=c.scrollHeight,V(r,n,ce(h),d).then(f=>{p.style.display="",f===null?H(c,h,t,b):s.steer(a,f.text,f.style).catch(L=>y(c,`Steer error: ${L.message}`))});break;case"consensus":if(g)break;g=!0,l&&(l(),l=null),E(c),m.clearAll(),re(c,v,{onNewTopic(f){s.newTopic(a,f).then(()=>{g=!1,h={turn:0,heat:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=f,q(o,{topic:f,...h,moderator_style:r,points_of_agreement:[]}),m.clearAll(),l=s.openStream(a,C)}).catch(L=>y(c,`Error: ${L.message}`))},onQuit:b},h);break;case"game_over":if(g)break;g=!0,l&&(l(),l=null),E(c),m.clearAll(),H(c,v,t,b);break;case"bar_beat":ie(c,v.text);break;case"system":y(c,v.text);break;case"error":y(c,`⚠ ${v.text}`);break}}function b(){l&&l(),s.deleteSession(a).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",M),e.querySelector("#help-btn").addEventListener("click",P),e.querySelector("#quit-btn").addEventListener("click",()=>{if(g){b();return}h.turn>0?(g=!0,l&&(l(),l=null),H(c,h,t,b)):b()}),l=s.openStream(a,C)}function ae(e,{role:a,name:t,content:i,backchannel:n}){const s=document.createElement("div");n?(s.className="msg msg-bc",s.innerHTML=`<span class="bc-name">${u(t)}:</span> <em>${S(i)}</em>`):a==="moderator"?(s.className="msg msg-moderator",s.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${S(i)}</div>`):a==="user"?(s.className="msg msg-user",s.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${S(i)}</div>`):(s.className="msg msg-philosopher",s.innerHTML=`<div class="msg-name">${u(t)}</div><div class="msg-content">${S(i)}</div>`),$(e,s)}function ie(e,a){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=S(a),$(e,t)}function y(e,a){const t=document.createElement("div");t.className="msg msg-system",t.textContent=a,$(e,t)}function re(e,{summary:a,points:t},{onNewTopic:i,onQuit:n},s={}){const p=document.createElement("div");p.className="consensus-panel",p.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${u(a)}</div>
    ${t.length?`
      <ul class="consensus-points">
        ${t.map(o=>`<li>${u(o)}</li>`).join("")}
      </ul>
    `:""}
    ${R(s)}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,$(e,p);const c=p.querySelector("#consensus-topic-input");c.focus(),p.querySelector("#consensus-continue").addEventListener("click",()=>{const o=c.value.trim();o&&i(o)}),c.addEventListener("keydown",o=>{if(o.key==="Enter"){const d=c.value.trim();d&&i(d)}}),p.querySelector("#consensus-end").addEventListener("click",n)}function H(e,a,t,i){E(e);const n=document.createElement("div");n.className="game-over-panel";const s=a.turn||0,p=s?`${s} turn${s!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";n.innerHTML=`
    <div class="game-over-title">━━━ LAST CALL ━━━</div>
    <div class="game-over-subtitle">${u(p)}</div>
    ${R(a)}
    <div class="game-over-actions">
      <button class="consensus-end-btn" id="game-over-leave">Leave the bar</button>
    </div>
  `,$(e,n),n.querySelector("#game-over-leave").addEventListener("click",i)}function R(e){const{turn:a=0,heat:t=0,partial_agreements:i=[],points_of_agreement:n=[],remaining_disagreements:s=[]}=e;if(!a)return"";const p=B(t),c=I(t),o="█".repeat(t),d="░".repeat(10-t);let r='<div class="report-stats">';return r+=`<div class="report-stat-row">
    <span class="report-stat-label">turns</span>
    <span class="report-stat-value">${a}</span>
  </div>`,r+=`<div class="report-stat-row">
    <span class="report-stat-label">heat at close</span>
    <span class="report-stat-value" style="color:${c}">${o}<span style="color:var(--text-dim)">${d}</span> ${p}</span>
  </div>`,n.length&&(r+='<div class="report-section-label">agreements reached</div>',r+=n.map(l=>`<div class="report-agree-item">✓ ${u(l)}</div>`).join("")),i.length&&(r+='<div class="report-section-label">alignments that formed</div>',r+=i.map(l=>`<div class="report-partial"><span class="report-partial-names">${u(l.participants.join(" + "))}</span> — <span class="report-partial-on">${u(l.on)}</span></div>`).join("")),s.length&&(r+='<div class="report-section-label">still unresolved</div>',r+=s.map(l=>typeof l=="object"&&l!==null?`<div class="report-tension">
          <span class="report-tension-topic">${u(l.topic)}</span>
          <span class="report-tension-stance">${u(l.participant_a)}: ${u(l.stance_a)}</span>
          <span class="report-tension-stance">${u(l.participant_b)}: ${u(l.stance_b)}</span>
        </div>`:`<div class="report-tension">${u(String(l))}</div>`).join("")),r+="</div>",r}function oe(e,a){E(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${u(a)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,$(e,t)}function E(e){var a;(a=e.querySelector("#typing-indicator"))==null||a.remove()}function q(e,a){const{topic:t,turn:i=0,heat:n=0,moderator_style:s="socratic",partial_agreements:p=[],points_of_agreement:c=[],remaining_disagreements:o=[]}=a,d=I(n),r=B(n),l="█".repeat(n),g="░".repeat(10-n);let h=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${u(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${i}</div>
  `;c.length&&(h+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${c.map(m=>`<div class="sb-agree-item">✓ ${u(m)}</div>`).join("")}
      </div>
    `),p.length&&(h+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${p.map(m=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${u(m.participants.join(" + "))}</div>
            <div class="sb-partial-on">${u(m.on)}</div>
          </div>
        `).join("")}
      </div>
    `),o.length&&(h+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${o.map(m=>typeof m=="object"&&m!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${u(m.topic)}</div>
                <div class="sb-tension-stance">${u(m.participant_a)}: ${u(m.stance_a)}</div>
                <div class="sb-tension-stance">${u(m.participant_b)}: ${u(m.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${u(String(m))}</div>`).join("")}
      </div>
    `),h+=`
    <div class="sb-section">
      <div class="sb-label">── HEAT ──</div>
      <div class="sb-heat">
        <span style="color:${d}">${l}</span><span class="sb-heat-empty">${g}</span>
        <span class="sb-heat-label" style="color:${d}">${r}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${u(s)}</div>
    </div>
  `,e.innerHTML=h}function S(e){let t=u(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>');return t=t.replace(/\*([A-Z][^*]+?)\*(?!\])/g,(i,n)=>n.includes("[")||n.includes("]")?i:`<em class="stage-dir">[${n}]</em>`),t.replace(/\n/g,"<br>")}function $(e,a){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(a),t&&(e.scrollTop=e.scrollHeight)}function u(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function I(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function B(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function ce(e,a){const{turn:t,heat:i,partial_agreements:n,remaining_disagreements:s,drift_topic:p}=e;if(!t)return"The debate is just getting started.";if(p)return`The conversation has drifted from the original topic toward ${p}.`;const c=n||[],o=s||[];if(c.length&&o.length){const r=c[0],l=o[0],g=r.participants.join(" and "),h=typeof l=="object"?l.topic:String(l);return`${g} are finding common ground, but the group remains divided on ${h}.`}if(c.length){const r=c[0];return`${r.participants.join(" and ")} are converging on ${r.on}, ${i>=6?"though tempers are running high":"with the room following closely"}.`}if(o.length){const r=o[0];return typeof r=="object"?`${r.participant_a} and ${r.participant_b} are sharply divided over ${r.topic}.`:`The room is deadlocked — ${String(r)}.`}const d=i>=8?"at flashpoint":i>=5?"heating up":i>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${d}.`}const T=document.querySelector("#app");async function U(){let e,a;try{[e,a]=await Promise.all([W(),F()])}catch(i){T.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${i.message}</div>`;return}const t=z(T,e,async({characters:i,topic:n})=>{try{const s=await Q(i,n);le(s.session_id,i,n,a)}catch(s){t.showError(`Could not start session: ${s.message}`)}})}function le(e,a,t,i){ne(T,e,a,t,i,{steer:Y,deleteSession:J,newTopic:K,openStream:Z}),T.addEventListener("debate:quit",()=>U(),{once:!0})}U();
