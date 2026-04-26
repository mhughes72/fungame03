(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const p of s.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&n(p)}).observe(document,{childList:!0,subtree:!0});function i(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(a){if(a.ep)return;a.ep=!0;const s=i(a);fetch(a.href,s)}})();const E="/api";async function x(e,t){const i=await fetch(`${E}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!i.ok){const n=await i.text();throw new Error(`${i.status} ${i.statusText}: ${n}`)}return i.json()}async function A(e){await fetch(`${E}${e}`,{method:"DELETE"})}async function M(){const e=await fetch(`${E}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function P(){const e=await fetch(`${E}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function B(e,t){return x("/sessions",{characters:e,topic:t})}async function R(e,t,i){return x(`/sessions/${e}/steer`,{text:t,style:i})}async function I(e,t){return x(`/sessions/${e}/new-topic`,{topic:t})}async function D(e){return A(`/sessions/${e}`)}function F(e,t){const i=new EventSource(`${E}/sessions/${e}/stream`);return i.onmessage=n=>{try{const a=JSON.parse(n.data);t(a)}catch{console.error("Unparseable SSE frame:",n.data)}},i.onerror=n=>{console.error("SSE error",n),t({type:"error",data:{text:"Connection lost."}})},()=>i.close()}function U(e,t,i){e.innerHTML=`
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
  `;const n=e.querySelectorAll("input[type=checkbox]"),a=new Set(["Abraham Lincoln","Nikola Tesla"]);n.forEach(r=>{a.has(r.value)&&(r.checked=!0)});const s=e.querySelector("#selection-hint"),p=e.querySelector("#start-btn"),c=e.querySelector("#setup-error");function o(){const r=[...n].filter(u=>u.checked).length;r<2?(s.textContent=`Select ${2-r} more`,s.classList.remove("hint-ok","hint-warn")):r>4?(s.textContent=`Too many — deselect ${r-4}`,s.classList.add("hint-warn"),s.classList.remove("hint-ok")):(s.textContent=`${r} selected`,s.classList.add("hint-ok"),s.classList.remove("hint-warn")),p.disabled=r<2||r>4}return o(),n.forEach(r=>r.addEventListener("change",o)),p.addEventListener("click",()=>{const r=[...n].filter(l=>l.checked).map(l=>l.value),u=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";c.textContent="",i({characters:r,topic:u})}),e.querySelector("#topic-input").addEventListener("keydown",r=>{r.key==="Enter"&&!p.disabled&&p.click()}),{showError(r){c.textContent=r}}}function L(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Q(e,t,i=""){return new Promise(n=>{const a=document.createElement("div");a.className="steer-overlay",a.innerHTML=`
      <div class="steer-box">
        <div class="steer-title">── STEER THE DEBATE ──</div>

        ${i?`<div class="steer-summary">${L(i)}</div>`:""}

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
              <input type="radio" name="mod-style" value="${L(o.style)}"
                     ${o.style===e?"checked":""} />
              <span class="style-name">${L(o.style)}</span>
              <span class="style-desc">${L(o.description)}</span>
            </label>
          `).join("")}
        </div>

        <div class="steer-actions">
          <button class="steer-quit-btn" id="steer-quit">Quit game</button>
          <button class="steer-submit-btn" id="steer-submit">Steer  ▶</button>
        </div>
      </div>
    `,document.body.appendChild(a);const s=a.querySelector("#steer-text-input");s.focus(),a.querySelectorAll(".style-item input").forEach(o=>{o.addEventListener("change",()=>{a.querySelectorAll(".style-item").forEach(r=>r.classList.remove("style-selected")),o.closest(".style-item").classList.add("style-selected")})});function p(){const o=a.querySelector("input[name=mod-style]:checked");return o?o.value:e}function c(){const o=s.value.trim(),r=p();a.remove(),n({text:o,style:r})}a.querySelector("#steer-submit").addEventListener("click",c),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),n(null)}),s.addEventListener("keydown",o=>{o.key==="Enter"&&c()}),a.addEventListener("click",o=>{o.target===a&&c()})})}const H={2:[[18,50],[82,50]],3:[[14,24],[86,24],[50,84]],4:[[14,20],[86,20],[14,80],[86,80]]};function W(e,t){const i=Math.min(t.length,4),n=H[i]||H[4];e.innerHTML=`
    <div class="seating-area">
      <div class="seating-table">
        <span class="seating-table-label">THE BAR</span>
      </div>
      ${t.map((r,u)=>{const[l,h]=n[u]||[50,50],m=J(r),d=Y(r);return`
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
  `;let a=null;function s(r){return e.querySelector(`#seat-${C(r)}`)}function p(){clearTimeout(a),e.querySelectorAll(".seat").forEach(r=>{r.classList.remove("seat-thinking","seat-speaking")})}function c(r){var u;p(),(u=s(r))==null||u.classList.add("seat-thinking")}function o(r){p();const u=s(r);u&&(u.classList.add("seat-speaking"),a=setTimeout(()=>u.classList.remove("seat-speaking"),3e3))}return{setThinking:c,setSpeaking:o,clearAll:p}}function J(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Y(e){return e.split(" ").map(t=>t[0]).join("").slice(0,2).toUpperCase()}function z(e){return e.split(" ").at(-1)}function C(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function G(e){e.innerHTML="";const t=document.createElement("div");t.className="tl-canvas",e.appendChild(t);let i=!1,n=null;function a(l){return l<=2?"#4a7ab5":l<=4?"#8a9040":l<=6?"#c8a030":l<=8?"#c86030":"#c83030"}function s(l){return l<=2?"cool":l<=4?"warm":l<=6?"charged":l<=8?"heated":"flashpoint"}function p({turn:l,heat:h,agreements:m=0}){const d=document.createElement("div");d.className="tl-block",d.style.background=a(h),m>0&&d.classList.add("tl-block--agreement"),i&&d.classList.add("tl-block--steered");const b=document.createElement("div");b.className="tl-block-label",b.textContent=l,d.appendChild(b),i=!1,d.addEventListener("mouseenter",y=>o(y,{turn:l,heat:h,agreements:m,steered:d.classList.contains("tl-block--steered")})),d.addEventListener("mouseleave",u),t.appendChild(d),t.scrollLeft=t.scrollWidth}function c(){i=!0;const l=t.querySelector(".tl-block:last-child");l&&l.classList.add("tl-block--steered")}function o(l,{turn:h,heat:m,agreements:d,steered:b}){u(),n=document.createElement("div"),n.className="tl-tooltip",n.innerHTML=`<span class="tl-tt-turn">Turn ${h}</span><span class="tl-tt-heat" style="color:${a(m)}">heat ${m} — ${s(m)}</span>`+(d>0?`<span class="tl-tt-agree">+${d} agreement${d>1?"s":""}</span>`:"")+(b?'<span class="tl-tt-steer">steered here</span>':""),document.body.appendChild(n),r(l)}function r(l){n&&(n.style.left=l.clientX+12+"px",n.style.top=l.clientY-40+"px")}function u(){n&&(n.remove(),n=null)}return{addPoint:p,markSteered:c}}function K(e,t,i,n,a,s){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${v(n)}</span>
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
  `;const p=e.querySelector("#seats-bar"),c=e.querySelector("#convo-pane"),o=e.querySelector("#sidebar"),r=e.querySelector("#timeline-strip");let u="socratic",l=null,h={turn:0,heat:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const m=G(r),d=W(p,i);N(o,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function b({type:O,data:f}){switch(O){case"speaker":d.setThinking(f.name),ee(c,f.name);break;case"message":_(c),f.backchannel||d.setSpeaking(f.name),X(c,f);break;case"state":u=f.moderator_style,h=f,N(o,{topic:n,...f}),m.addPoint({turn:f.turn,heat:f.heat,agreements:(f.partial_agreements||[]).length+(f.points_of_agreement||[]).length});break;case"steer_needed":u=f.current_style,f.drift_topic&&(g(c,`── DRIFT ── conversation has shifted to: ${f.drift_topic}`),g(c,`   original topic: ${n}`)),Q(u,a,ne(h)).then($=>{$===null?y():(m.markSteered(),s.steer(t,$.text,$.style).catch(w=>g(c,`Steer error: ${w.message}`)))});break;case"consensus":_(c),d.clearAll(),V(c,f,{onNewTopic($){s.newTopic(t,$).catch(w=>g(c,`Error: ${w.message}`))},onQuit:y});break;case"bar_beat":Z(c,f.text);break;case"system":g(c,f.text);break;case"error":g(c,`⚠ ${f.text}`);break}}function y(){l&&l(),s.deleteSession(t).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#quit-btn").addEventListener("click",y),l=s.openStream(t,b)}function X(e,{role:t,name:i,content:n,backchannel:a}){const s=document.createElement("div");a?(s.className="msg msg-bc",s.innerHTML=`<span class="bc-name">${v(i)}:</span> <em>${S(n)}</em>`):t==="moderator"?(s.className="msg msg-moderator",s.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${S(n)}</div>`):t==="user"?(s.className="msg msg-user",s.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${S(n)}</div>`):(s.className="msg msg-philosopher",s.innerHTML=`<div class="msg-name">${v(i)}</div><div class="msg-content">${S(n)}</div>`),k(e,s)}function Z(e,t){const i=document.createElement("div");i.className="msg msg-beat",i.innerHTML=S(t),k(e,i)}function g(e,t){const i=document.createElement("div");i.className="msg msg-system",i.textContent=t,k(e,i)}function V(e,{summary:t,points:i},{onNewTopic:n,onQuit:a}){const s=document.createElement("div");s.className="consensus-panel",s.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${v(t)}</div>
    ${i.length?`
      <ul class="consensus-points">
        ${i.map(c=>`<li>${v(c)}</li>`).join("")}
      </ul>
    `:""}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,k(e,s);const p=s.querySelector("#consensus-topic-input");p.focus(),s.querySelector("#consensus-continue").addEventListener("click",()=>{const c=p.value.trim();c&&n(c)}),p.addEventListener("keydown",c=>{if(c.key==="Enter"){const o=p.value.trim();o&&n(o)}}),s.querySelector("#consensus-end").addEventListener("click",a)}function ee(e,t){_(e);const i=document.createElement("div");i.className="msg msg-typing",i.id="typing-indicator",i.innerHTML=`<span class="typing-name">${v(t)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,k(e,i)}function _(e){var t;(t=e.querySelector("#typing-indicator"))==null||t.remove()}function N(e,t){const{topic:i,turn:n=0,heat:a=0,moderator_style:s="socratic",partial_agreements:p=[],points_of_agreement:c=[],remaining_disagreements:o=[]}=t,r=te(a),u=se(a),l="█".repeat(a),h="░".repeat(10-a);let m=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${v(i)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${n}</div>
  `;c.length&&(m+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${c.map(d=>`<div class="sb-agree-item">✓ ${v(d)}</div>`).join("")}
      </div>
    `),p.length&&(m+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${p.map(d=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${v(d.participants.join(" + "))}</div>
            <div class="sb-partial-on">${v(d.on)}</div>
          </div>
        `).join("")}
      </div>
    `),o.length&&(m+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${o.map(d=>typeof d=="object"&&d!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${v(d.topic)}</div>
                <div class="sb-tension-stance">${v(d.participant_a)}: ${v(d.stance_a)}</div>
                <div class="sb-tension-stance">${v(d.participant_b)}: ${v(d.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${v(String(d))}</div>`).join("")}
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
      <div class="sb-style">${v(s)}</div>
    </div>
  `,e.innerHTML=m}function S(e){return v(e).replace(/\n/g,"<br>").replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>')}function k(e,t){const i=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(t),i&&(e.scrollTop=e.scrollHeight)}function v(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function te(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function se(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function ne(e,t){const{turn:i,heat:n,partial_agreements:a,remaining_disagreements:s,drift_topic:p}=e;if(!i)return"The debate is just getting started.";if(p)return`The conversation has drifted from the original topic toward ${p}.`;const c=a||[],o=s||[];if(c.length&&o.length){const u=c[0],l=o[0],h=u.participants.join(" and "),m=typeof l=="object"?l.topic:String(l);return`${h} are finding common ground, but the group remains divided on ${m}.`}if(c.length){const u=c[0];return`${u.participants.join(" and ")} are converging on ${u.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(o.length){const u=o[0];return typeof u=="object"?`${u.participant_a} and ${u.participant_b} are sharply divided over ${u.topic}.`:`The room is deadlocked — ${String(u)}.`}const r=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${i} turns in, no clear alignments yet — the room is ${r}.`}const T=document.querySelector("#app");async function j(){let e,t;try{[e,t]=await Promise.all([M(),P()])}catch(n){T.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const i=U(T,e,async({characters:n,topic:a})=>{try{const s=await B(n,a);ie(s.session_id,n,a,t)}catch(s){i.showError(`Could not start session: ${s.message}`)}})}function ie(e,t,i,n){K(T,e,t,i,n,{steer:R,deleteSession:D,newTopic:I,openStream:F}),T.addEventListener("debate:quit",()=>j(),{once:!0})}j();
