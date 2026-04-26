(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const p of n.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&i(p)}).observe(document,{childList:!0,subtree:!0});function a(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=a(s);fetch(s.href,n)}})();const E="/api";async function x(e,t){const a=await fetch(`${E}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!a.ok){const i=await a.text();throw new Error(`${a.status} ${a.statusText}: ${i}`)}return a.json()}async function A(e){await fetch(`${E}${e}`,{method:"DELETE"})}async function M(){const e=await fetch(`${E}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function P(){const e=await fetch(`${E}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function B(e,t){return x("/sessions",{characters:e,topic:t})}async function R(e,t,a){return x(`/sessions/${e}/steer`,{text:t,style:a})}async function I(e,t){return x(`/sessions/${e}/new-topic`,{topic:t})}async function D(e){return A(`/sessions/${e}`)}function F(e,t){const a=new EventSource(`${E}/sessions/${e}/stream`);return a.onmessage=i=>{try{const s=JSON.parse(i.data);t(s)}catch{console.error("Unparseable SSE frame:",i.data)}},a.onerror=i=>{console.error("SSE error",i),t({type:"error",data:{text:"Connection lost."}})},()=>a.close()}function U(e,t,a){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${t.map(r=>`
            <label class="char-row" data-name="${r.name}">
              <input type="checkbox" value="${r.name}" />
              <span class="char-name">${r.name}</span>
              <span class="char-era">${r.era}</span>
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
      </div>
    </div>
  `;const i=e.querySelectorAll("input[type=checkbox]"),s=new Set(["Abraham Lincoln","Nikola Tesla"]);i.forEach(r=>{s.has(r.value)&&(r.checked=!0)});const n=e.querySelector("#selection-hint"),p=e.querySelector("#start-btn"),c=e.querySelector("#setup-error");function o(){const r=[...i].filter(u=>u.checked).length;r<2?(n.textContent=`Select ${2-r} more`,n.classList.remove("hint-ok","hint-warn")):r>4?(n.textContent=`Too many — deselect ${r-4}`,n.classList.add("hint-warn"),n.classList.remove("hint-ok")):(n.textContent=`${r} selected`,n.classList.add("hint-ok"),n.classList.remove("hint-warn")),p.disabled=r<2||r>4}return o(),i.forEach(r=>r.addEventListener("change",o)),p.addEventListener("click",()=>{const r=[...i].filter(l=>l.checked).map(l=>l.value),u=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";c.textContent="",a({characters:r,topic:u})}),e.querySelector("#topic-input").addEventListener("keydown",r=>{r.key==="Enter"&&!p.disabled&&p.click()}),{showError(r){c.textContent=r}}}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Q(e,t,a=""){return new Promise(i=>{const s=document.createElement("div");s.className="steer-overlay",s.innerHTML=`
      <div class="steer-box">
        <div class="steer-title">── STEER THE DEBATE ──</div>

        ${a?`<div class="steer-summary">${k(a)}</div>`:""}

        <label class="steer-field-label" for="steer-text-input">
          Speak directly into the debate:
        </label>
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="Leave blank to let the moderator intervene…"
          autocomplete="off"
        />

        <div class="steer-or">── or choose a moderator approach ──</div>

        <div class="style-list" id="style-list">
          ${t.map(o=>`
            <label class="style-item${o.style===e?" style-selected":""}">
              <input type="radio" name="mod-style" value="${k(o.style)}"
                     ${o.style===e?"checked":""} />
              <span class="style-name">${k(o.style)}</span>
              <span class="style-desc">${k(o.description)}</span>
            </label>
          `).join("")}
        </div>

        <div class="steer-actions">
          <button class="steer-quit-btn" id="steer-quit">Quit game</button>
          <button class="steer-submit-btn" id="steer-submit">Steer  ▶</button>
        </div>
      </div>
    `,document.body.appendChild(s),s.addEventListener("mouseenter",()=>{s.classList.add("overlay-focused")}),s.addEventListener("mouseleave",()=>{s.classList.remove("overlay-focused")});const n=s.querySelector("#steer-text-input");n.focus(),s.querySelectorAll(".style-item input").forEach(o=>{o.addEventListener("change",()=>{s.querySelectorAll(".style-item").forEach(r=>r.classList.remove("style-selected")),o.closest(".style-item").classList.add("style-selected")})});function p(){const o=s.querySelector("input[name=mod-style]:checked");return o?o.value:e}function c(){const o=n.value.trim(),r=p();s.remove(),i({text:o,style:r})}s.querySelector("#steer-submit").addEventListener("click",c),s.querySelector("#steer-quit").addEventListener("click",()=>{s.remove(),i(null)}),n.addEventListener("keydown",o=>{o.key==="Enter"&&c()}),s.addEventListener("click",o=>{o.target===s&&c()})})}const H={2:[[18,50],[82,50]],3:[[14,24],[86,24],[50,84]],4:[[14,20],[86,20],[14,80],[86,80]]};function W(e,t){const a=Math.min(t.length,4),i=H[a]||H[4];e.innerHTML=`
    <div class="seating-area">
      <div class="seating-table">
        <span class="seating-table-label">THE BAR</span>
      </div>
      ${t.map((r,u)=>{const[l,h]=i[u]||[50,50],m=J(r),d=Y(r);return`
          <div class="seat" id="seat-${C(r)}"
               style="left:${l}%;top:${h}%">
            <div class="seat-portrait-wrap">
              <img class="seat-img" src="${m}" alt="${q(r)}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
              <div class="seat-initials" style="display:none">${q(d)}</div>
            </div>
            <div class="seat-name">${q(z(r))}</div>
          </div>
        `}).join("")}
    </div>
  `;let s=null;function n(r){return e.querySelector(`#seat-${C(r)}`)}function p(){clearTimeout(s),e.querySelectorAll(".seat").forEach(r=>{r.classList.remove("seat-thinking","seat-speaking")})}function c(r){var u;p(),(u=n(r))==null||u.classList.add("seat-thinking")}function o(r){p();const u=n(r);u&&(u.classList.add("seat-speaking"),s=setTimeout(()=>u.classList.remove("seat-speaking"),3e3))}return{setThinking:c,setSpeaking:o,clearAll:p}}function J(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Y(e){return e.split(" ").map(t=>t[0]).join("").slice(0,2).toUpperCase()}function z(e){return e.split(" ").at(-1)}function C(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function G(e){e.innerHTML="";const t=document.createElement("div");t.className="tl-canvas",e.appendChild(t);let a=!1,i=null;function s(l){return l<=2?"#4a7ab5":l<=4?"#8a9040":l<=6?"#c8a030":l<=8?"#c86030":"#c83030"}function n(l){return l<=2?"cool":l<=4?"warm":l<=6?"charged":l<=8?"heated":"flashpoint"}function p({turn:l,heat:h,agreements:m=0}){const d=document.createElement("div");d.className="tl-block",d.style.background=s(h),m>0&&d.classList.add("tl-block--agreement"),a&&d.classList.add("tl-block--steered");const b=document.createElement("div");b.className="tl-block-label",b.textContent=l,d.appendChild(b),a=!1,d.addEventListener("mouseenter",y=>o(y,{turn:l,heat:h,agreements:m,steered:d.classList.contains("tl-block--steered")})),d.addEventListener("mouseleave",u),t.appendChild(d),t.scrollLeft=t.scrollWidth}function c(){a=!0;const l=t.querySelector(".tl-block:last-child");l&&l.classList.add("tl-block--steered")}function o(l,{turn:h,heat:m,agreements:d,steered:b}){u(),i=document.createElement("div"),i.className="tl-tooltip",i.innerHTML=`<span class="tl-tt-turn">Turn ${h}</span><span class="tl-tt-heat" style="color:${s(m)}">heat ${m} — ${n(m)}</span>`+(d>0?`<span class="tl-tt-agree">+${d} agreement${d>1?"s":""}</span>`:"")+(b?'<span class="tl-tt-steer">steered here</span>':""),document.body.appendChild(i),r(l)}function r(l){i&&(i.style.left=l.clientX+12+"px",i.style.top=l.clientY-40+"px")}function u(){i&&(i.remove(),i=null)}return{addPoint:p,markSteered:c}}function K(e,t,a,i,s,n){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${f(i)}</span>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="seats-bar" id="seats-bar"></div>

      <div class="debate-layout">
        <div class="left-col">
          <div class="convo-pane" id="convo-pane"></div>
          <div class="timeline-strip" id="timeline-strip"></div>
        </div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `;const p=e.querySelector("#seats-bar"),c=e.querySelector("#convo-pane"),o=e.querySelector("#sidebar"),r=e.querySelector("#timeline-strip");let u="socratic",l=null,h={turn:0,heat:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const m=G(r),d=W(p,a);N(o,{topic:i,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function b({type:O,data:v}){switch(O){case"speaker":d.setThinking(v.name),ee(c,v.name);break;case"message":_(c),v.backchannel||d.setSpeaking(v.name),X(c,v);break;case"state":u=v.moderator_style,h=v,N(o,{topic:i,...v}),m.addPoint({turn:v.turn,heat:v.heat,agreements:(v.partial_agreements||[]).length+(v.points_of_agreement||[]).length});break;case"steer_needed":u=v.current_style,v.drift_topic&&(g(c,`── DRIFT ── conversation has shifted to: ${v.drift_topic}`),g(c,`   original topic: ${i}`)),Q(u,s,ne(h)).then($=>{$===null?y():(m.markSteered(),n.steer(t,$.text,$.style).catch(w=>g(c,`Steer error: ${w.message}`)))});break;case"consensus":_(c),d.clearAll(),V(c,v,{onNewTopic($){n.newTopic(t,$).catch(w=>g(c,`Error: ${w.message}`))},onQuit:y});break;case"bar_beat":Z(c,v.text);break;case"system":g(c,v.text);break;case"error":g(c,`⚠ ${v.text}`);break}}function y(){l&&l(),n.deleteSession(t).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#quit-btn").addEventListener("click",y),l=n.openStream(t,b)}function X(e,{role:t,name:a,content:i,backchannel:s}){const n=document.createElement("div");s?(n.className="msg msg-bc",n.innerHTML=`<span class="bc-name">${f(a)}:</span> <em>${S(i)}</em>`):t==="moderator"?(n.className="msg msg-moderator",n.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${S(i)}</div>`):t==="user"?(n.className="msg msg-user",n.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${S(i)}</div>`):(n.className="msg msg-philosopher",n.innerHTML=`<div class="msg-name">${f(a)}</div><div class="msg-content">${S(i)}</div>`),L(e,n)}function Z(e,t){const a=document.createElement("div");a.className="msg msg-beat",a.innerHTML=S(t),L(e,a)}function g(e,t){const a=document.createElement("div");a.className="msg msg-system",a.textContent=t,L(e,a)}function V(e,{summary:t,points:a},{onNewTopic:i,onQuit:s}){const n=document.createElement("div");n.className="consensus-panel",n.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${f(t)}</div>
    ${a.length?`
      <ul class="consensus-points">
        ${a.map(c=>`<li>${f(c)}</li>`).join("")}
      </ul>
    `:""}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,L(e,n);const p=n.querySelector("#consensus-topic-input");p.focus(),n.querySelector("#consensus-continue").addEventListener("click",()=>{const c=p.value.trim();c&&i(c)}),p.addEventListener("keydown",c=>{if(c.key==="Enter"){const o=p.value.trim();o&&i(o)}}),n.querySelector("#consensus-end").addEventListener("click",s)}function ee(e,t){_(e);const a=document.createElement("div");a.className="msg msg-typing",a.id="typing-indicator",a.innerHTML=`<span class="typing-name">${f(t)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,L(e,a)}function _(e){var t;(t=e.querySelector("#typing-indicator"))==null||t.remove()}function N(e,t){const{topic:a,turn:i=0,heat:s=0,moderator_style:n="socratic",partial_agreements:p=[],points_of_agreement:c=[],remaining_disagreements:o=[]}=t,r=te(s),u=se(s),l="█".repeat(s),h="░".repeat(10-s);let m=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${f(a)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${i}</div>
  `;c.length&&(m+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${c.map(d=>`<div class="sb-agree-item">✓ ${f(d)}</div>`).join("")}
      </div>
    `),p.length&&(m+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${p.map(d=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${f(d.participants.join(" + "))}</div>
            <div class="sb-partial-on">${f(d.on)}</div>
          </div>
        `).join("")}
      </div>
    `),o.length&&(m+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${o.map(d=>typeof d=="object"&&d!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${f(d.topic)}</div>
                <div class="sb-tension-stance">${f(d.participant_a)}: ${f(d.stance_a)}</div>
                <div class="sb-tension-stance">${f(d.participant_b)}: ${f(d.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${f(String(d))}</div>`).join("")}
      </div>
    `),m+=`
    <div class="sb-section">
      <div class="sb-label">── HEAT ──</div>
      <div class="sb-heat">
        <span style="color:${r}">${l}</span><span class="sb-heat-empty">${h}</span>
        <span class="sb-heat-label" style="color:${r}">${u}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${f(n)}</div>
    </div>
  `,e.innerHTML=m}function S(e){return f(e).replace(/\n/g,"<br>").replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>')}function L(e,t){const a=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(t),a&&(e.scrollTop=e.scrollHeight)}function f(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function te(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function se(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function ne(e,t){const{turn:a,heat:i,partial_agreements:s,remaining_disagreements:n,drift_topic:p}=e;if(!a)return"The debate is just getting started.";if(p)return`The conversation has drifted from the original topic toward ${p}.`;const c=s||[],o=n||[];if(c.length&&o.length){const u=c[0],l=o[0],h=u.participants.join(" and "),m=typeof l=="object"?l.topic:String(l);return`${h} are finding common ground, but the group remains divided on ${m}.`}if(c.length){const u=c[0];return`${u.participants.join(" and ")} are converging on ${u.on}, ${i>=6?"though tempers are running high":"with the room following closely"}.`}if(o.length){const u=o[0];return typeof u=="object"?`${u.participant_a} and ${u.participant_b} are sharply divided over ${u.topic}.`:`The room is deadlocked — ${String(u)}.`}const r=i>=8?"at flashpoint":i>=5?"heating up":i>=3?"warming up":"still feeling each other out";return`${a} turns in, no clear alignments yet — the room is ${r}.`}const T=document.querySelector("#app");async function j(){let e,t;try{[e,t]=await Promise.all([M(),P()])}catch(i){T.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${i.message}</div>`;return}const a=U(T,e,async({characters:i,topic:s})=>{try{const n=await B(i,s);ie(n.session_id,i,s,t)}catch(n){a.showError(`Could not start session: ${n.message}`)}})}function ie(e,t,a,i){K(T,e,t,a,i,{steer:R,deleteSession:D,newTopic:I,openStream:F}),T.addEventListener("debate:quit",()=>j(),{once:!0})}j();
