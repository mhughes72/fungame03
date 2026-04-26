(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const s of a)if(s.type==="childList")for(const d of s.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function i(a){const s={};return a.integrity&&(s.integrity=a.integrity),a.referrerPolicy&&(s.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?s.credentials="include":a.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(a){if(a.ep)return;a.ep=!0;const s=i(a);fetch(a.href,s)}})();const E="/api";async function H(e,t){const i=await fetch(`${E}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});if(!i.ok){const n=await i.text();throw new Error(`${i.status} ${i.statusText}: ${n}`)}return i.json()}async function M(e){await fetch(`${E}${e}`,{method:"DELETE"})}async function A(){const e=await fetch(`${E}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function P(){const e=await fetch(`${E}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function B(e,t){return H("/sessions",{characters:e,topic:t})}async function R(e,t,i){return H(`/sessions/${e}/steer`,{text:t,style:i})}async function I(e,t){return H(`/sessions/${e}/new-topic`,{topic:t})}async function D(e){return M(`/sessions/${e}`)}function F(e,t){const i=new EventSource(`${E}/sessions/${e}/stream`);return i.onmessage=n=>{try{const a=JSON.parse(n.data);t(a)}catch{console.error("Unparseable SSE frame:",n.data)}},i.onerror=n=>{console.error("SSE error",n),t({type:"error",data:{text:"Connection lost."}})},()=>i.close()}function U(e,t,i){e.innerHTML=`
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
  `;const n=e.querySelectorAll("input[type=checkbox]"),a=new Set(["Abraham Lincoln","Nikola Tesla"]);n.forEach(r=>{a.has(r.value)&&(r.checked=!0)});const s=e.querySelector("#selection-hint"),d=e.querySelector("#start-btn"),o=e.querySelector("#setup-error");function l(){const r=[...n].filter(c=>c.checked).length;r<2?(s.textContent=`Select ${2-r} more`,s.classList.remove("hint-ok","hint-warn")):r>4?(s.textContent=`Too many — deselect ${r-4}`,s.classList.add("hint-warn"),s.classList.remove("hint-ok")):(s.textContent=`${r} selected`,s.classList.add("hint-ok"),s.classList.remove("hint-warn")),d.disabled=r<2||r>4}return l(),n.forEach(r=>r.addEventListener("change",l)),d.addEventListener("click",()=>{const r=[...n].filter(p=>p.checked).map(p=>p.value),c=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";o.textContent="",i({characters:r,topic:c})}),e.querySelector("#topic-input").addEventListener("keydown",r=>{r.key==="Enter"&&!d.disabled&&d.click()}),{showError(r){o.textContent=r}}}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Q(e,t,i=""){return new Promise(n=>{const a=document.createElement("div");a.className="steer-overlay",a.innerHTML=`
      <div class="steer-box">
        <div class="steer-title">── STEER THE DEBATE ──</div>

        ${i?`<div class="steer-summary">${k(i)}</div>`:""}

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
          ${t.map(l=>`
            <label class="style-item${l.style===e?" style-selected":""}">
              <input type="radio" name="mod-style" value="${k(l.style)}"
                     ${l.style===e?"checked":""} />
              <span class="style-name">${k(l.style)}</span>
              <span class="style-desc">${k(l.description)}</span>
            </label>
          `).join("")}
        </div>

        <div class="steer-actions">
          <button class="steer-quit-btn" id="steer-quit">Quit game</button>
          <button class="steer-submit-btn" id="steer-submit">Steer  ▶</button>
        </div>
      </div>
    `,document.body.appendChild(a);const s=a.querySelector("#steer-text-input");s.focus(),a.querySelectorAll(".style-item input").forEach(l=>{l.addEventListener("change",()=>{a.querySelectorAll(".style-item").forEach(r=>r.classList.remove("style-selected")),l.closest(".style-item").classList.add("style-selected")})});function d(){const l=a.querySelector("input[name=mod-style]:checked");return l?l.value:e}function o(){const l=s.value.trim(),r=d();a.remove(),n({text:l,style:r})}a.querySelector("#steer-submit").addEventListener("click",o),a.querySelector("#steer-quit").addEventListener("click",()=>{a.remove(),n(null)}),s.addEventListener("keydown",l=>{l.key==="Enter"&&o()}),a.addEventListener("click",l=>{l.target===a&&o()})})}const C={2:[[18,50],[82,50]],3:[[14,24],[86,24],[50,84]],4:[[14,20],[86,20],[14,80],[86,80]]};function W(e,t){const i=Math.min(t.length,4),n=C[i]||C[4];e.innerHTML=`
    <div class="seating-area">
      <div class="seating-table">
        <span class="seating-table-label">THE BAR</span>
      </div>
      ${t.map((r,c)=>{const[p,f]=n[c]||[50,50],h=J(r),u=Y(r);return`
          <div class="seat" id="seat-${N(r)}"
               style="left:${p}%;top:${f}%">
            <div class="seat-portrait-wrap">
              <img class="seat-img" src="${h}" alt="${x(r)}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
              <div class="seat-initials" style="display:none">${x(u)}</div>
            </div>
            <div class="seat-name">${x(z(r))}</div>
          </div>
        `}).join("")}
    </div>
  `;let a=null;function s(r){return e.querySelector(`#seat-${N(r)}`)}function d(){clearTimeout(a),e.querySelectorAll(".seat").forEach(r=>{r.classList.remove("seat-thinking","seat-speaking")})}function o(r){var c;d(),(c=s(r))==null||c.classList.add("seat-thinking")}function l(r){d();const c=s(r);c&&(c.classList.add("seat-speaking"),a=setTimeout(()=>c.classList.remove("seat-speaking"),3e3))}return{setThinking:o,setSpeaking:l,clearAll:d}}function J(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Y(e){return e.split(" ").map(t=>t[0]).join("").slice(0,2).toUpperCase()}function z(e){return e.split(" ").at(-1)}function N(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function x(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function G(e){e.innerHTML="";const t=document.createElement("div");t.className="tl-canvas",e.appendChild(t);let i=!1,n=null;function a(c){return c<=2?"#4a7ab5":c<=4?"#8a9040":c<=6?"#c8a030":c<=8?"#c86030":"#c83030"}function s({turn:c,heat:p,agreements:f=0,steered:h=!1}){const u=document.createElement("div");u.className="tl-turn";const y=document.createElement("div");y.className="tl-steer-tick"+(i?" tl-steer-tick--active":""),u.appendChild(y);const g=document.createElement("div");g.className="tl-bar";const w=Math.max(4,p/10*100);g.style.height=w+"%",g.style.background=a(p),u.appendChild(g);const m=document.createElement("div");m.className="tl-dot"+(f>0?" tl-dot--active":""),u.appendChild(m),i=!1,u.addEventListener("mouseenter",b=>o(b,{turn:c,heat:p,agreements:f,steered:y.classList.contains("tl-steer-tick--active")})),u.addEventListener("mouseleave",r),t.appendChild(u),t.scrollLeft=t.scrollWidth}function d(){i=!0;const c=t.querySelector(".tl-turn:last-child .tl-steer-tick");c&&c.classList.add("tl-steer-tick--active")}function o(c,{turn:p,heat:f,agreements:h,steered:u}){r(),n=document.createElement("div"),n.className="tl-tooltip";const g=["","","cool","","warm","","charged","","heated","","flashpoint"][f]||"";n.innerHTML=`<span class="tl-tt-turn">Turn ${p}</span><span class="tl-tt-heat" style="color:${a(f)}">heat ${f} — ${g}</span>`+(h>0?`<span class="tl-tt-agree">+${h} agreement${h>1?"s":""}</span>`:"")+(u?'<span class="tl-tt-steer">steered here</span>':""),document.body.appendChild(n),l(c)}function l(c){if(!n)return;const p=c.clientX,f=c.clientY;n.style.left=p+12+"px",n.style.top=f-40+"px"}function r(){n&&(n.remove(),n=null)}return{addPoint:s,markSteered:d}}function K(e,t,i,n,a,s){e.innerHTML=`
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
  `;const d=e.querySelector("#seats-bar"),o=e.querySelector("#convo-pane"),l=e.querySelector("#sidebar"),r=e.querySelector("#timeline-strip");let c="socratic",p=null,f={turn:0,heat:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const h=G(r),u=W(d,i);j(l,{topic:n,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function y({type:w,data:m}){switch(w){case"speaker":u.setThinking(m.name),ee(o,m.name);break;case"message":_(o),m.backchannel||u.setSpeaking(m.name),X(o,m);break;case"state":c=m.moderator_style,f=m,j(l,{topic:n,...m}),h.addPoint({turn:m.turn,heat:m.heat,agreements:(m.partial_agreements||[]).length+(m.points_of_agreement||[]).length});break;case"steer_needed":c=m.current_style,m.drift_topic&&($(o,`── DRIFT ── conversation has shifted to: ${m.drift_topic}`),$(o,`   original topic: ${n}`)),Q(c,a,ne(f)).then(b=>{b===null?g():(h.markSteered(),s.steer(t,b.text,b.style).catch(q=>$(o,`Steer error: ${q.message}`)))});break;case"consensus":_(o),u.clearAll(),V(o,m,{onNewTopic(b){s.newTopic(t,b).catch(q=>$(o,`Error: ${q.message}`))},onQuit:g});break;case"bar_beat":Z(o,m.text);break;case"system":$(o,m.text);break;case"error":$(o,`⚠ ${m.text}`);break}}function g(){p&&p(),s.deleteSession(t).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#quit-btn").addEventListener("click",g),p=s.openStream(t,y)}function X(e,{role:t,name:i,content:n,backchannel:a}){const s=document.createElement("div");a?(s.className="msg msg-bc",s.innerHTML=`<span class="bc-name">${v(i)}:</span> <em>${S(n)}</em>`):t==="moderator"?(s.className="msg msg-moderator",s.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${S(n)}</div>`):t==="user"?(s.className="msg msg-user",s.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${S(n)}</div>`):(s.className="msg msg-philosopher",s.innerHTML=`<div class="msg-name">${v(i)}</div><div class="msg-content">${S(n)}</div>`),L(e,s)}function Z(e,t){const i=document.createElement("div");i.className="msg msg-beat",i.innerHTML=S(t),L(e,i)}function $(e,t){const i=document.createElement("div");i.className="msg msg-system",i.textContent=t,L(e,i)}function V(e,{summary:t,points:i},{onNewTopic:n,onQuit:a}){const s=document.createElement("div");s.className="consensus-panel",s.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${v(t)}</div>
    ${i.length?`
      <ul class="consensus-points">
        ${i.map(o=>`<li>${v(o)}</li>`).join("")}
      </ul>
    `:""}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,L(e,s);const d=s.querySelector("#consensus-topic-input");d.focus(),s.querySelector("#consensus-continue").addEventListener("click",()=>{const o=d.value.trim();o&&n(o)}),d.addEventListener("keydown",o=>{if(o.key==="Enter"){const l=d.value.trim();l&&n(l)}}),s.querySelector("#consensus-end").addEventListener("click",a)}function ee(e,t){_(e);const i=document.createElement("div");i.className="msg msg-typing",i.id="typing-indicator",i.innerHTML=`<span class="typing-name">${v(t)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,L(e,i)}function _(e){var t;(t=e.querySelector("#typing-indicator"))==null||t.remove()}function j(e,t){const{topic:i,turn:n=0,heat:a=0,moderator_style:s="socratic",partial_agreements:d=[],points_of_agreement:o=[],remaining_disagreements:l=[]}=t,r=te(a),c=se(a),p="█".repeat(a),f="░".repeat(10-a);let h=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${v(i)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${n}</div>
  `;o.length&&(h+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${o.map(u=>`<div class="sb-agree-item">✓ ${v(u)}</div>`).join("")}
      </div>
    `),d.length&&(h+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${d.map(u=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${v(u.participants.join(" + "))}</div>
            <div class="sb-partial-on">${v(u.on)}</div>
          </div>
        `).join("")}
      </div>
    `),l.length&&(h+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${l.map(u=>typeof u=="object"&&u!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${v(u.topic)}</div>
                <div class="sb-tension-stance">${v(u.participant_a)}: ${v(u.stance_a)}</div>
                <div class="sb-tension-stance">${v(u.participant_b)}: ${v(u.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${v(String(u))}</div>`).join("")}
      </div>
    `),h+=`
    <div class="sb-section">
      <div class="sb-label">── HEAT ──</div>
      <div class="sb-heat">
        <span style="color:${r}">${p}</span><span class="sb-heat-empty">${f}</span>
        <span class="sb-heat-label" style="color:${r}">${c}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${v(s)}</div>
    </div>
  `,e.innerHTML=h}function S(e){return v(e).replace(/\n/g,"<br>").replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>')}function L(e,t){const i=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(t),i&&(e.scrollTop=e.scrollHeight)}function v(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function te(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function se(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function ne(e,t){const{turn:i,heat:n,partial_agreements:a,remaining_disagreements:s,drift_topic:d}=e;if(!i)return"The debate is just getting started.";if(d)return`The conversation has drifted from the original topic toward ${d}.`;const o=a||[],l=s||[];if(o.length&&l.length){const c=o[0],p=l[0],f=c.participants.join(" and "),h=typeof p=="object"?p.topic:String(p);return`${f} are finding common ground, but the group remains divided on ${h}.`}if(o.length){const c=o[0];return`${c.participants.join(" and ")} are converging on ${c.on}, ${n>=6?"though tempers are running high":"with the room following closely"}.`}if(l.length){const c=l[0];return typeof c=="object"?`${c.participant_a} and ${c.participant_b} are sharply divided over ${c.topic}.`:`The room is deadlocked — ${String(c)}.`}const r=n>=8?"at flashpoint":n>=5?"heating up":n>=3?"warming up":"still feeling each other out";return`${i} turns in, no clear alignments yet — the room is ${r}.`}const T=document.querySelector("#app");async function O(){let e,t;try{[e,t]=await Promise.all([A(),P()])}catch(n){T.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const i=U(T,e,async({characters:n,topic:a})=>{try{const s=await B(n,a);ie(s.session_id,n,a,t)}catch(s){i.showError(`Could not start session: ${s.message}`)}})}function ie(e,t,i,n){K(T,e,t,i,n,{steer:R,deleteSession:D,newTopic:I,openStream:F}),T.addEventListener("debate:quit",()=>O(),{once:!0})}O();
