(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))s(c);new MutationObserver(c=>{for(const t of c)if(t.type==="childList")for(const o of t.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function i(c){const t={};return c.integrity&&(t.integrity=c.integrity),c.referrerPolicy&&(t.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?t.credentials="include":c.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(c){if(c.ep)return;c.ep=!0;const t=i(c);fetch(c.href,t)}})();const $="/api";async function q(e,n){const i=await fetch(`${$}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!i.ok){const s=await i.text();throw new Error(`${i.status} ${i.statusText}: ${s}`)}return i.json()}async function N(e){await fetch(`${$}${e}`,{method:"DELETE"})}async function O(){const e=await fetch(`${$}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function A(){const e=await fetch(`${$}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function M(e,n){return q("/sessions",{characters:e,topic:n})}async function j(e,n,i){return q(`/sessions/${e}/steer`,{text:n,style:i})}async function P(e,n){return q(`/sessions/${e}/new-topic`,{topic:n})}async function B(e){return N(`/sessions/${e}`)}function R(e,n){const i=new EventSource(`${$}/sessions/${e}/stream`);return i.onmessage=s=>{try{const c=JSON.parse(s.data);n(c)}catch{console.error("Unparseable SSE frame:",s.data)}},i.onerror=s=>{console.error("SSE error",s),n({type:"error",data:{text:"Connection lost."}})},()=>i.close()}function I(e,n,i){e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">THE PHILOSOPHER'S BAR</h1>
        <p class="setup-sub">Select 2–4 thinkers for tonight's debate</p>

        <div class="char-list" id="char-list">
          ${n.map(r=>`
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
  `;const s=e.querySelectorAll("input[type=checkbox]"),c=new Set(["Abraham Lincoln","Nikola Tesla"]);s.forEach(r=>{c.has(r.value)&&(r.checked=!0)});const t=e.querySelector("#selection-hint"),o=e.querySelector("#start-btn"),a=e.querySelector("#setup-error");function u(){const r=[...s].filter(l=>l.checked).length;r<2?(t.textContent=`Select ${2-r} more`,t.classList.remove("hint-ok","hint-warn")):r>4?(t.textContent=`Too many — deselect ${r-4}`,t.classList.add("hint-warn"),t.classList.remove("hint-ok")):(t.textContent=`${r} selected`,t.classList.add("hint-ok"),t.classList.remove("hint-warn")),o.disabled=r<2||r>4}return u(),s.forEach(r=>r.addEventListener("change",u)),o.addEventListener("click",()=>{const r=[...s].filter(v=>v.checked).map(v=>v.value),l=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";a.textContent="",i({characters:r,topic:l})}),e.querySelector("#topic-input").addEventListener("keydown",r=>{r.key==="Enter"&&!o.disabled&&o.click()}),{showError(r){a.textContent=r}}}function k(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function D(e,n){return new Promise(i=>{const s=document.createElement("div");s.className="steer-overlay",s.innerHTML=`
      <div class="steer-box">
        <div class="steer-title">── STEER THE DEBATE ──</div>

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
          ${n.map(a=>`
            <label class="style-item${a.style===e?" style-selected":""}">
              <input type="radio" name="mod-style" value="${k(a.style)}"
                     ${a.style===e?"checked":""} />
              <span class="style-name">${k(a.style)}</span>
              <span class="style-desc">${k(a.description)}</span>
            </label>
          `).join("")}
        </div>

        <div class="steer-actions">
          <button class="steer-quit-btn" id="steer-quit">Quit game</button>
          <button class="steer-submit-btn" id="steer-submit">Steer  ▶</button>
        </div>
      </div>
    `,document.body.appendChild(s);const c=s.querySelector("#steer-text-input");c.focus(),s.querySelectorAll(".style-item input").forEach(a=>{a.addEventListener("change",()=>{s.querySelectorAll(".style-item").forEach(u=>u.classList.remove("style-selected")),a.closest(".style-item").classList.add("style-selected")})});function t(){const a=s.querySelector("input[name=mod-style]:checked");return a?a.value:e}function o(){const a=c.value.trim(),u=t();s.remove(),i({text:a,style:u})}s.querySelector("#steer-submit").addEventListener("click",o),s.querySelector("#steer-quit").addEventListener("click",()=>{s.remove(),i(null)}),c.addEventListener("keydown",a=>{a.key==="Enter"&&o()}),s.addEventListener("click",a=>{a.target===s&&o()})})}const H={2:[[18,50],[82,50]],3:[[14,24],[86,24],[50,84]],4:[[14,20],[86,20],[14,80],[86,80]]};function F(e,n){const i=Math.min(n.length,4),s=H[i]||H[4];e.innerHTML=`
    <div class="seating-area">
      <div class="seating-table">
        <span class="seating-table-label">THE BAR</span>
      </div>
      ${n.map((r,l)=>{const[v,h]=s[l]||[50,50],b=U(r),p=Q(r);return`
          <div class="seat" id="seat-${x(r)}"
               style="left:${v}%;top:${h}%">
            <div class="seat-portrait-wrap">
              <img class="seat-img" src="${b}" alt="${T(r)}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
              <div class="seat-initials" style="display:none">${T(p)}</div>
            </div>
            <div class="seat-name">${T(W(r))}</div>
          </div>
        `}).join("")}
    </div>
  `;let c=null;function t(r){return e.querySelector(`#seat-${x(r)}`)}function o(){clearTimeout(c),e.querySelectorAll(".seat").forEach(r=>{r.classList.remove("seat-thinking","seat-speaking")})}function a(r){var l;o(),(l=t(r))==null||l.classList.add("seat-thinking")}function u(r){o();const l=t(r);l&&(l.classList.add("seat-speaking"),c=setTimeout(()=>l.classList.remove("seat-speaking"),3e3))}return{setThinking:a,setSpeaking:u,clearAll:o}}function U(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Q(e){return e.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}function W(e){return e.split(" ").at(-1)}function x(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function T(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function J(e,n,i,s,c,t){e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">THE PHILOSOPHER'S BAR</span>
        <span class="debate-topic">${d(s)}</span>
        <button class="quit-btn" id="quit-btn">Quit</button>
      </header>

      <div class="seats-bar" id="seats-bar"></div>

      <div class="debate-layout">
        <div class="convo-pane" id="convo-pane"></div>
        <div class="sidebar" id="sidebar"></div>
      </div>
    </div>
  `;const o=e.querySelector("#seats-bar"),a=e.querySelector("#convo-pane"),u=e.querySelector("#sidebar");let r="socratic",l=null;const v=F(o,i);C(u,{topic:s,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});function h({type:p,data:m}){switch(p){case"speaker":v.setThinking(m.name),Y(a,m.name);break;case"message":w(a),m.backchannel||v.setSpeaking(m.name),z(a,m);break;case"state":r=m.moderator_style,C(u,{topic:s,...m});break;case"steer_needed":r=m.current_style,m.drift_topic&&(f(a,`── DRIFT ── conversation has shifted to: ${m.drift_topic}`),f(a,`   original topic: ${s}`)),D(r,c).then(g=>{g===null?b():t.steer(n,g.text,g.style).catch(L=>f(a,`Steer error: ${L.message}`))});break;case"consensus":w(a),v.clearAll(),K(a,m,{onNewTopic(g){t.newTopic(n,g).catch(L=>f(a,`Error: ${L.message}`))},onQuit:b});break;case"bar_beat":G(a,m.text);break;case"system":f(a,m.text);break;case"error":f(a,`⚠ ${m.text}`);break}}function b(){l&&l(),t.deleteSession(n).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#quit-btn").addEventListener("click",b),l=t.openStream(n,h)}function z(e,{role:n,name:i,content:s,backchannel:c}){const t=document.createElement("div");c?(t.className="msg msg-bc",t.innerHTML=`<span class="bc-name">${d(i)}:</span> <em>${y(s)}</em>`):n==="moderator"?(t.className="msg msg-moderator",t.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${y(s)}</div>`):n==="user"?(t.className="msg msg-user",t.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${y(s)}</div>`):(t.className="msg msg-philosopher",t.innerHTML=`<div class="msg-name">${d(i)}</div><div class="msg-content">${y(s)}</div>`),S(e,t)}function G(e,n){const i=document.createElement("div");i.className="msg msg-beat",i.innerHTML=y(n),S(e,i)}function f(e,n){const i=document.createElement("div");i.className="msg msg-system",i.textContent=n,S(e,i)}function K(e,{summary:n,points:i},{onNewTopic:s,onQuit:c}){const t=document.createElement("div");t.className="consensus-panel",t.innerHTML=`
    <div class="consensus-title">━━━ CONSENSUS REACHED ━━━</div>
    <div class="consensus-summary">${d(n)}</div>
    ${i.length?`
      <ul class="consensus-points">
        ${i.map(a=>`<li>${d(a)}</li>`).join("")}
      </ul>
    `:""}
    <div class="consensus-new-topic">
      <input class="consensus-topic-input" id="consensus-topic-input"
             type="text" placeholder="New topic…" autocomplete="off" />
      <button class="consensus-continue-btn" id="consensus-continue">Continue ▶</button>
      <button class="consensus-end-btn" id="consensus-end">End the evening</button>
    </div>
  `,S(e,t);const o=t.querySelector("#consensus-topic-input");o.focus(),t.querySelector("#consensus-continue").addEventListener("click",()=>{const a=o.value.trim();a&&s(a)}),o.addEventListener("keydown",a=>{if(a.key==="Enter"){const u=o.value.trim();u&&s(u)}}),t.querySelector("#consensus-end").addEventListener("click",c)}function Y(e,n){w(e);const i=document.createElement("div");i.className="msg msg-typing",i.id="typing-indicator",i.innerHTML=`<span class="typing-name">${d(n)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,S(e,i)}function w(e){var n;(n=e.querySelector("#typing-indicator"))==null||n.remove()}function C(e,n){const{topic:i,turn:s=0,heat:c=0,moderator_style:t="socratic",partial_agreements:o=[],points_of_agreement:a=[],remaining_disagreements:u=[]}=n,r=Z(c),l=V(c),v="█".repeat(c),h="░".repeat(10-c);let b=`
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${d(i)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${s}</div>
  `;a.length&&(b+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${a.map(p=>`<div class="sb-agree-item">✓ ${d(p)}</div>`).join("")}
      </div>
    `),o.length&&(b+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${o.map(p=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${d(p.participants.join(" + "))}</div>
            <div class="sb-partial-on">${d(p.on)}</div>
          </div>
        `).join("")}
      </div>
    `),u.length&&(b+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${u.map(p=>typeof p=="object"&&p!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${d(p.topic)}</div>
                <div class="sb-tension-stance">${d(p.participant_a)}: ${d(p.stance_a)}</div>
                <div class="sb-tension-stance">${d(p.participant_b)}: ${d(p.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${d(String(p))}</div>`).join("")}
      </div>
    `),b+=`
    <div class="sb-section">
      <div class="sb-label">── HEAT ──</div>
      <div class="sb-heat">
        <span style="color:${r}">${v}</span><span class="sb-heat-empty">${h}</span>
        <span class="sb-heat-label" style="color:${r}">${l}</span>
      </div>
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${d(t)}</div>
    </div>
  `,e.innerHTML=b}function y(e){return d(e).replace(/\n/g,"<br>").replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>')}function S(e,n){const i=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(n),i&&(e.scrollTop=e.scrollHeight)}function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Z(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function V(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}const E=document.querySelector("#app");async function _(){let e,n;try{[e,n]=await Promise.all([O(),A()])}catch(s){E.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${s.message}</div>`;return}const i=I(E,e,async({characters:s,topic:c})=>{try{const t=await M(s,c);X(t.session_id,s,c,n)}catch(t){i.showError(`Could not start session: ${t.message}`)}})}function X(e,n,i,s){J(E,e,n,i,s,{steer:j,deleteSession:B,newTopic:P,openStream:R}),E.addEventListener("debate:quit",()=>_(),{once:!0})}_();
