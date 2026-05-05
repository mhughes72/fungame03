const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/theme-CJEpj9dL.css","assets/theme-ClQV55ib.css"])))=>i.map(i=>d[i]);
(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const Ne="modulepreload",He=function(e){return"/"+e},de={},Y=function(s,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=Promise.allSettled(t.map(u=>{if(u=He(u),u in de)return;de[u]=!0;const i=u.endsWith(".css"),d=i?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${d}`))return;const g=document.createElement("link");if(g.rel=i?"stylesheet":Ne,i||(g.as="script"),g.crossOrigin="",g.href=u,c&&g.setAttribute("nonce",c),document.head.appendChild(g),i)return new Promise((h,$)=>{g.addEventListener("load",h),g.addEventListener("error",()=>$(new Error(`Unable to preload CSS for ${u}`)))})}))}function r(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return n.then(l=>{for(const c of l||[])c.status==="rejected"&&r(c.reason);return s().catch(r)})},pe=(e,s,t)=>{const a=e[s];return a?typeof a=="function"?a():Promise.resolve(a):new Promise((n,r)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+s+(s.split("/").length!==t?". Note that variables only represent file names one level deep.":""))))})},D="/api";async function W(e,s){const t=await fetch(`${D}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function Oe(e){await fetch(`${D}${e}`,{method:"DELETE"})}async function Ae(e=null){const s=e?`${D}/topics?level=${encodeURIComponent(e)}`:`${D}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function Me(){const e=await fetch(`${D}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function je(){const e=await fetch(`${D}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function Pe(){const e=await fetch(`${D}/features`);return e.ok?e.json():{}}async function Re(e,s,t=!0,a=!0,n=!1,r="university",l="normal",c="normal",u="normal",i="",d=null){return W("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:a,diagrams_enabled:n,audience_level:r,philosopher_length:l,commentator_length:c,moderator_length:u,debate_format:i,format_roles:d})}async function Ie(e,s,t,a="",n={},r=""){return W(`/sessions/${e}/steer`,{text:s,style:t,evidence:a,drinks:n,producer_directive:r})}async function Fe(e){return W("/search",{query:e})}async function De(e,s){return W(`/sessions/${e}/new-topic`,{topic:s})}async function Ue(e){return Oe(`/sessions/${e}`)}async function Be(e){return W(`/sessions/${e}/newspaper`,{})}async function Ge(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const r=await s.json().catch(()=>({detail:s.statusText}));throw new Error(r.detail||s.statusText)}const t=await s.blob(),a=URL.createObjectURL(t),n=document.createElement("a");n.href=a,n.download="philosophers-bar-podcast.mp3",document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(a)}async function We(e,s,t={}){const a={drinks:t};return s!==null&&(a.heat=s),W(`/sessions/${e}/cheat`,a)}function ze(e,s){const t=new EventSource(`${D}/sessions/${e}/stream`);return t.onmessage=a=>{try{const n=JSON.parse(a.data);s(n)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const ue="https://github.com/mhughes72/fungame03";function ye(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",function n(r){r.key==="Escape"&&(a(),document.removeEventListener("keydown",n))})}function $e(){ye("ABOUT",`
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
    <p><a class="info-link" href="${ue}" target="_blank" rel="noopener">${ue}</a></p>
  `)}function we(){ye("HOW TO PLAY",`
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
  `)}function Ve(e,s,t,{isLocal:a=!1,skin:n={}}={}){const r=n.appName??"THE PHILOSOPHER'S BAR",l=n.setupSub??"Select 2–4 thinkers for tonight's debate",c=n.charFilterPlaceholder??"Filter thinkers…",u=n.topicLabel??"What should they discuss?",i=n.topicPlaceholder??"What is the nature of justice?",d=n.startLabel??"Open the bar ▶",g=n.orLabel??"── or ──",h=n.dotdLoadingText??"generating tonight's debate…";e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">${r}</h1>
        <p class="setup-sub">${l}</p>

        <input
          id="char-filter"
          class="char-filter-input"
          type="text"
          placeholder="${P(c)}"
          autocomplete="off"
          spellcheck="false"
        />

        <div class="char-list" id="char-list">
          ${s.map(o=>`
            <label class="char-row"
              data-name="${o.name.toLowerCase()}"
              data-desc="${P(o.known_for)}"
              data-category="${P(o.category||"")}"
              data-portrait="${P(o.name.replace(/ /g,"_"))}">
              <input type="checkbox" value="${o.name}" />
              <span class="char-name">${o.name}</span>
              <span class="char-era">${o.era}</span>
            </label>
          `).join("")}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">${u}</label>
        <input
          id="topic-input"
          class="topic-input"
          type="text"
          placeholder="${P(i)}"
          maxlength="500"
          autocomplete="off"
        />

        <div class="setup-toggles">
          <label class="setup-toggle">
            <input type="checkbox" id="toggle-diagrams" />
            <span class="toggle-label">Diagrams</span>
            <span class="toggle-desc">characters produce supporting images <span class="toggle-wip">· work in progress</span></span>
          </label>
        </div>

        <div class="setup-audience">
          <span class="audience-label">Audience level</span>
          <div class="audience-options">
            <label class="audience-opt"><input type="radio" name="audience" value="grade5" /> Grade 5</label>
            <label class="audience-opt"><input type="radio" name="audience" value="highschool" /> High School</label>
            <label class="audience-opt"><input type="radio" name="audience" value="university" checked /> University</label>
            <label class="audience-opt"><input type="radio" name="audience" value="expert" /> Expert</label>
          </div>
        </div>

        <div class="setup-format" id="setup-format" style="display:none">
          <span class="length-label">Debate format</span>
          <div class="length-options">
            <label class="length-opt"><input type="radio" name="debate-format" value="" checked /> Freeform</label>
            <label class="length-opt"><input type="radio" name="debate-format" value="oxford" /> Oxford-style</label>
            <label class="length-opt"><input type="radio" name="debate-format" value="cable_news" /> 📺 Cable News</label>
          </div>
        </div>

        <div class="setup-lengths" id="setup-lengths" style="display:none">
          <div class="length-group">
            <span class="length-label">Philosopher length</span>
            <div class="length-options">
              <label class="length-opt"><input type="radio" name="phil-length" value="punchy" /> Punchy</label>
              <label class="length-opt"><input type="radio" name="phil-length" value="normal" checked /> Normal</label>
              <label class="length-opt"><input type="radio" name="phil-length" value="conversational" /> Conversational</label>
              <label class="length-opt"><input type="radio" name="phil-length" value="expansive" /> Expansive</label>
            </div>
          </div>
          <div class="length-group">
            <span class="length-label">Commentator</span>
            <div class="length-options">
              <label class="length-opt"><input type="radio" name="comm-length" value="off" /> Off</label>
              <label class="length-opt"><input type="radio" name="comm-length" value="normal" checked /> Normal</label>
              <label class="length-opt"><input type="radio" name="comm-length" value="verbose" /> Verbose</label>
            </div>
          </div>
          <div class="length-group">
            <span class="length-label">Moderator</span>
            <div class="length-options">
              <label class="length-opt"><input type="radio" name="mod-length" value="off" /> Off</label>
              <label class="length-opt"><input type="radio" name="mod-length" value="brief" /> Brief</label>
              <label class="length-opt"><input type="radio" name="mod-length" value="normal" checked /> Normal</label>
              <label class="length-opt"><input type="radio" name="mod-length" value="elaborate" /> Elaborate</label>
            </div>
          </div>
        </div>

        <button class="start-btn" id="start-btn" disabled>${P(d)}</button>
        <p class="setup-error" id="setup-error"></p>

        <div class="setup-or">${g}</div>

        <div class="dotd-card" id="dotd-card">
          <div class="dotd-loading">${P(h)}</div>
        </div>

        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `;const $=e.querySelectorAll("#char-list input[type=checkbox]"),b=e.querySelectorAll(".char-row"),E=e.querySelector("#char-no-results"),w=e.querySelector("#char-filter");w.addEventListener("input",()=>{const o=w.value.toLowerCase().trim();let C=0;b.forEach(T=>{const M=!o||T.dataset.name.includes(o);T.style.display=M?"":"none",M&&C++}),E.style.display=C===0?"":"none"});const f=document.createElement("div");f.className="char-tooltip",f.style.display="none",document.body.appendChild(f);function x(o){const{desc:C,category:T,portrait:M}=o.currentTarget.dataset;if(!C)return;const H=`/portraits/${M}.png`;f.innerHTML=`
      <div class="tt-inner">
        <img class="tt-portrait" src="${H}" alt="" onerror="this.style.display='none'" />
        <div class="tt-body">
          ${T?`<span class="tt-category">${P(T)}</span>`:""}
          <span class="tt-desc">${P(C)}</span>
        </div>
      </div>`,f.style.display="block",v(o)}function v(o){const T=f.offsetWidth,M=f.offsetHeight;let H=o.clientX+14,O=o.clientY+14;H+T>window.innerWidth-14&&(H=o.clientX-T-14),O+M>window.innerHeight-14&&(O=o.clientY-M-14),f.style.left=H+"px",f.style.top=O+"px"}function y(){f.style.display="none"}b.forEach(o=>{o.addEventListener("mouseenter",x),o.addEventListener("mousemove",v),o.addEventListener("mouseleave",y)});const _=new MutationObserver(()=>{document.body.contains(e)||(f.remove(),_.disconnect())});_.observe(document.body,{childList:!0,subtree:!0}),e.querySelector("#setup-format").style.display="",a&&(e.querySelector("#setup-lengths").style.display="");const S=e.querySelector("#selection-hint"),L=e.querySelector("#start-btn"),R=e.querySelector("#setup-error");function N(){const o=[...$].filter(C=>C.checked).length;o<2?(S.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",S.classList.remove("hint-ok","hint-warn")):o>4?(S.textContent=`Too many — deselect ${o-4}`,S.classList.add("hint-warn"),S.classList.remove("hint-ok")):(S.textContent=`${o} selected`,S.classList.add("hint-ok"),S.classList.remove("hint-warn")),L.disabled=o<2||o>4}const k=e.querySelector("#char-list"),m=e.querySelector("#char-filter"),q=e.querySelector("#topic-input");function F(o){k.classList.toggle("oxford-locked",o),m.disabled=o,q.disabled=o,$.forEach(C=>{C.disabled=o}),o?(L.disabled=!0,S.textContent=n.oxfordHint??"Select a suggested Oxford debate below",S.classList.remove("hint-ok","hint-warn")):N()}N(),$.forEach(o=>o.addEventListener("change",N));function V(){const o=e.querySelector('input[name="audience"]:checked'),C=e.querySelector('input[name="phil-length"]:checked'),T=e.querySelector('input[name="comm-length"]:checked'),M=e.querySelector('input[name="mod-length"]:checked'),H=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:o?o.value:"university",philosopherLength:C?C.value:"normal",commentatorLength:T?T.value:"normal",moderatorLength:M?M.value:"normal",debateFormat:H?H.value:""}}L.addEventListener("click",()=>{const o=[...$].filter(T=>T.checked).map(T=>T.value),C=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";R.textContent="",t({characters:o,topic:C,...V()})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!L.disabled&&L.click()}),e.querySelector("#setup-about").addEventListener("click",$e),e.querySelector("#setup-help").addEventListener("click",we);const U=e.querySelector("#dotd-card"),qe={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let ne=[],re=null;function ie(){const o=e.querySelector('input[name="audience"]:checked');return o?o.value:"university"}function Ce(){const o=e.querySelector('input[name="debate-format"]:checked');return o?o.value:""}function oe(o){const C=Ce();return ne.filter(T=>T.audience_level===o&&(C==="oxford"?T.format==="oxford":T.format!=="oxford"))}function le(o,C=null){if(!o.length)return null;const T=C?o.filter(O=>O.id!==C.id):o,M=T.length?T:o,H=[];for(const O of M)H.push(O),O.source==="curated"&&(H.push(O),H.push(O));return H[Math.floor(Math.random()*H.length)]}function ce(o){re=o;const C=qe[o.category]||"var(--text-dim)",T=o.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',M=o.format==="oxford"?'<span class="dotd-oxford">Oxford</span>':"",H=o.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${o.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${o.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${o.characters.join(" · ")}</div>`;U.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── SUGGESTED DEBATE ──</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${C}">${o.category.toUpperCase()}</span>
          ${M}
          ${T}
        </span>
      </div>
      ${H}
      <div class="dotd-topic">${P(o.topic)}</div>
      <div class="dotd-tagline">${P(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Next suggestion ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,U.querySelector("#dotd-start").addEventListener("click",()=>{const O=o.format==="oxford"?"oxford":"";t({characters:o.characters,topic:o.topic,...V(),debateFormat:O,formatRoles:o.roles||null})}),U.querySelector("#dotd-new").addEventListener("click",()=>{const O=le(oe(ie()),re);O&&ce(O)})}function Z(){const o=le(oe(ie()));o?ce(o):U.style.display="none"}return Ae().then(o=>{ne=o,Z()}).catch(()=>{U.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(o=>{o.addEventListener("change",Z)}),e.querySelectorAll('input[name="debate-format"]').forEach(o=>{o.addEventListener("change",()=>{F(o.value==="oxford"&&o.checked),Z()})}),{showError(o){R.textContent=o}}}function P(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function j(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ye(e){const s=(e-.2)/3.8*100,t=Math.max(0,Math.min(100,s)).toFixed(1),a=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030";return`<div class="ratings-bar-track"><div class="ratings-bar-fill" style="width:${t}%;background:${a}"></div></div>`}function Qe(e,s,t="",a,n=null,r=[],l={}){const c=l.moderatorStyleNames??{},u=l.steerTitle??"── STEER THE DEBATE ──",i=l.steerQuitLabel??"Quit game",d=l.steerInputPlaceholder??"Speak into the debate — or leave blank for the moderator…",g=l.steerSubmitLabel??"Steer ▶",h=l.evidenceLabel??"── inject evidence ──",$=l.evidencePlaceholder??"Search term — result will be injected as empirical fact…",b=l.moderatorStyleLabel??"── choose a moderator approach ──";return new Promise(E=>{const w=document.createElement("div");w.className="steer-drawer",w.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">${u}</div>
        <button class="steer-quit-btn" id="steer-quit">${j(i)}</button>
      </div>

      ${t?`<div class="steer-summary">${j(t)}</div>`:""}

      <div class="steer-input-row">
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="${j(d)}"
          autocomplete="off"
        />
        <button class="steer-submit-btn" id="steer-submit">${j(g)}</button>
      </div>

      <div class="steer-or">${h}</div>

      <div class="evidence-search-row">
        <input
          class="steer-text-input"
          id="evidence-query"
          type="text"
          placeholder="${j($)}"
          autocomplete="off"
        />
        <button class="steer-search-btn" id="evidence-search">Search</button>
      </div>

      <div id="evidence-preview" class="evidence-preview" style="display:none"></div>

      <div class="steer-or">${b}</div>

      <div class="style-list" id="style-list">
        ${s.map(k=>`
          <button
            class="style-item${k.style===e?" style-selected":""}"
            data-style="${j(k.style)}"
          >
            <span class="style-name">${j(c[k.style]??k.style)}</span>
            <span class="style-desc">${j(k.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(a||document.body).appendChild(w);const x=w.querySelector("#steer-text-input"),v=w.querySelector("#evidence-query"),y=w.querySelector("#evidence-search"),_=w.querySelector("#evidence-preview");x.focus();let S=e,L="";async function R(){const k=v.value.trim();if(!(!k||!n)){y.disabled=!0,y.textContent="Searching…",_.style.display="none",L="";try{const m=await n(k);L=m.finding,_.style.display="block",_.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${j(m.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,_.querySelector("#evidence-accept").addEventListener("click",()=>{_.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${j(L)}</div>`}),_.querySelector("#evidence-discard").addEventListener("click",()=>{L="",_.style.display="none"})}catch(m){_.style.display="block",_.textContent=`Search failed: ${m.message}`}finally{y.disabled=!1,y.textContent="Search"}}}y.addEventListener("click",R),v.addEventListener("keydown",k=>{k.key==="Enter"&&R()}),w.querySelectorAll(".style-item").forEach(k=>{k.addEventListener("click",()=>{w.querySelectorAll(".style-item").forEach(m=>m.classList.remove("style-selected")),k.classList.add("style-selected"),S=k.dataset.style,N()})});function N(){const k=x.value.trim();w.remove(),E({text:k,style:S,evidence:L})}w.querySelector("#steer-submit").addEventListener("click",N),w.querySelector("#steer-quit").addEventListener("click",()=>{w.remove(),E(null)}),x.addEventListener("keydown",k=>{k.key==="Enter"&&N()})})}function Ke(e,s,t={}){const{ratings:a=.8,peak_ratings:n=.8,producer_note:r="",producer_stress:l=0,directives:c=[]}=e,u=["","nervous","stressed","PANICKING","MELTDOWN","FIRE FIRE FIRE"],i=l>0?` (${u[Math.min(l,5)]})`:"",d=l>=3;return new Promise(g=>{const h=document.createElement("div");h.className="steer-drawer",h.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── COMMERCIAL BREAK ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      <div class="commercial-ratings-row">
        <span class="commercial-ratings-num">📺 ${a.toFixed(1)}M</span>
        <span class="commercial-ratings-peak">peak ${n.toFixed(1)}M</span>
        ${Ye(a)}
      </div>

      ${r?`
        <div class="commercial-producer-note${d?" commercial-producer-high":""}">
          <span class="producer-tag">[PRODUCER${i}]</span> ${j(r)}
        </div>
      `:""}

      <div class="steer-input-row">
        <input class="steer-text-input" id="steer-text-input" type="text"
               placeholder="📞 Call-in question — or press Enter to let The Host decide…"
               autocomplete="off" />
        <button class="steer-submit-btn" id="steer-submit">On air ▶</button>
      </div>

      <div class="steer-or">── producer directive ──</div>

      <div class="style-list" id="directive-list">
        ${c.map(([f,x])=>`
          <button class="style-item" data-directive="${j(f)}">
            <span class="style-name">${j(f.replace(/_/g," "))}</span>
            <span class="style-desc">${j(x)}</span>
          </button>
        `).join("")}
      </div>
    `,(s||document.body).appendChild(h);const b=h.querySelector("#steer-text-input");b.focus();let E="";h.querySelectorAll(".style-item").forEach(f=>{f.addEventListener("click",()=>{h.querySelectorAll(".style-item").forEach(x=>x.classList.remove("style-selected")),f.classList.add("style-selected"),E=f.dataset.directive,w()})});function w(){const f=b.value.trim();h.remove(),g({text:f,producer_directive:E})}h.querySelector("#steer-submit").addEventListener("click",w),h.querySelector("#steer-quit").addEventListener("click",()=>{h.remove(),g(null)}),b.addEventListener("keydown",f=>{f.key==="Enter"&&w()})})}function Q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const me=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function Je(e,s,t,a,n=null,r=null,l=null,c=null){return new Promise(u=>{var E,w,f,x;const i={};t.forEach(v=>{i[v]=0});const d=document.createElement("div");d.className="cheat-overlay",d.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${me[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(v=>`
            <div class="drink-row">
              <span class="drink-name">${Q(v)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${Q(v)}">−</button>
                <span class="drink-count" id="drink-count-${Q(v.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${Q(v)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        ${n||r?`
        <div class="cheat-utils-row">
          ${n?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          ${r?'<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>':""}
        </div>`:""}

        ${c||l?`
        <div class="cheat-section-label">── END THE EVENING ──</div>
        <div class="cheat-end-row">
          ${c?'<button class="cheat-consensus-btn" id="cheat-consensus">Force Consensus ✓</button>':""}
          ${l?'<button class="cheat-end-btn" id="cheat-end">End Game ✕</button>':""}
        </div>`:""}

        <div class="cheat-footer">
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(d);const g=d.querySelector("#cheat-heat-slider"),h=d.querySelector("#cheat-heat-value");g.addEventListener("input",()=>{const v=parseInt(g.value,10);h.textContent=`${v} — ${me[v]}`}),d.querySelectorAll(".drink-btn").forEach(v=>{v.addEventListener("click",()=>{const y=v.dataset.name,_=v.classList.contains("drink-plus")?1:-1;i[y]=Math.max(0,(i[y]||0)+_);const S=y.replace(/ /g,"_"),L=d.querySelector(`#drink-count-${S}`);L&&(L.textContent=i[y])})});function $(){d.remove(),u()}async function b(){const v=parseInt(g.value,10),y=Object.fromEntries(Object.entries(i).filter(([,S])=>S>0)),_=v!==s;try{await a(e,_?v:null,y)}catch(S){console.error("Cheat failed:",S)}$()}d.querySelector("#cheat-apply").addEventListener("click",b),d.querySelector("#cheat-close").addEventListener("click",$),(E=d.querySelector("#cheat-paper"))==null||E.addEventListener("click",()=>{$(),n()}),(w=d.querySelector("#cheat-podcast"))==null||w.addEventListener("click",()=>{$(),r()}),(f=d.querySelector("#cheat-consensus"))==null||f.addEventListener("click",()=>{$(),c()}),(x=d.querySelector("#cheat-end"))==null||x.addEventListener("click",()=>{$(),l()}),d.addEventListener("click",v=>{v.target===d&&$()})})}function Xe(e,s,t={}){e.innerHTML=s.map(u=>{if(t.renderSeat)return t.renderSeat(u,ve(u),ee(u),ge(u),he(u));const i=ve(u),d=he(u);return`
      <div class="seat" id="seat-${ee(u)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${i}" alt="${te(u)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${te(d)}</div>
        </div>
        <div class="seat-name">${te(ge(u))}</div>
      </div>
    `}).join("");let a=null;function n(u){return e.querySelector(`#seat-${ee(u)}`)}function r(){clearTimeout(a),e.querySelectorAll(".seat").forEach(u=>{u.classList.remove("seat-thinking","seat-speaking")})}function l(u){var i;r(),(i=n(u))==null||i.classList.add("seat-thinking")}function c(u){r();const i=n(u);i&&(i.classList.add("seat-speaking"),a=setTimeout(()=>i.classList.remove("seat-speaking"),3e3))}return{setThinking:l,setSpeaking:c,clearAll:r}}function ve(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function he(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function ge(e){return e.split(" ").at(-1)}function ee(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function te(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ze(e,s,t,a,n,r){const l=r.skin??{},c=l.appName??"THE PHILOSOPHER'S BAR";e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">${c}</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${p(a)}</span>
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
  `;const u=e.querySelector("#seats-bar"),i=e.querySelector("#convo-pane"),d=e.querySelector("#sidebar"),g=e.querySelector("#left-col");let h="socratic",$=0,b=null,E=!1,w=!1,f="",x={},v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},y=.8,_=[];const S=Xe(u,t,l);B(d,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const k=document.createElement("div");k.id="debate-starting",k.className="debate-starting",k.innerHTML=`<span class="debate-starting-text">${l.debateStartingText??"Opening the bar"}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,i.appendChild(k)}function L(){var k;(k=i.querySelector("#debate-starting"))==null||k.remove()}function R({type:k,data:m}){switch(k){case"speaker":L(),S.setThinking(m.name),pt(i,m.name);break;case"message":L(),I(i),m.backchannel||S.setSpeaking(m.name),et(i,m);break;case"bars":$=m.heat??$,ut(d,m.heat,m.concession_total??0);break;case"debug":{const q=m.data!=null?m.data:"",F=typeof q=="object"?`
`+Object.entries(q).map(([V,U])=>`  ${V}: ${JSON.stringify(U)}`).join(`
`):q?` — ${q}`:"";console.log(`[${m.channel}] ${m.label}${F}`);break}case"oxford_opening_vote":v={...v,oxford_opening_vote:m},B(d,{topic:a,...v,debate_phase:f,format_roles:x});break;case"oxford_verdict":ct(i,m);break;case"phase_update":f=m.debate_phase,x=m.format_roles||{},B(d,{topic:a,...v,debate_phase:f,format_roles:x});break;case"state":I(i),h=m.moderator_style,$=m.heat??$,m.debate_phase&&(f=m.debate_phase),m.format_roles&&Object.keys(m.format_roles).length&&(x=m.format_roles),v={...m,debate_phase:f,format_roles:x},B(d,{topic:a,...v});break;case"cable_ratings":y=m.ratings??y,_=m.history??_,mt(d,y,_);break;case"chyron":m.text&&it(i,m.text);break;case"breaking_news":m.headline&&ot(i,m.headline);break;case"producer_whisper":lt(i,m.note,m.stress);break;case"commercial_break":if(w)break;w=!0,y=m.ratings??y,i.scrollTop=i.scrollHeight,Ke(m,g,l).then(q=>{w=!1,q===null?be(i,{reason:"quit",report:{}},t,N):r.steer(s,q.text,"socratic","",{},q.producer_directive).catch(F=>G(i,`Error: ${F.message}`))});break;case"cable_news_end":if(E)break;E=!0,b&&(b(),b=null),I(i),S.clearAll(),be(i,m,t,N);break;case"steer_needed":if(w)break;w=!0,h=m.current_style,m.drift_topic&&st(i,m.drift_topic,a),i.scrollTop=i.scrollHeight,Qe(h,n,gt(v),g,r.searchEvidence,t,l).then(q=>{w=!1,q===null?K(i,v,t,N,s,r):(h=q.style,B(d,{topic:a,...v,moderator_style:q.style}),r.steer(s,q.text,q.style,q.evidence||"",q.drinks||{}).catch(F=>G(i,`Steer error: ${F.message}`)))});break;case"consensus":if(E)break;E=!0,b&&(b(),b=null),I(i),S.clearAll(),fe(i,m,{onNewTopic(q){r.newTopic(s,q).then(()=>{E=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=q,B(d,{topic:q,...v,moderator_style:h,points_of_agreement:[]}),S.clearAll(),b=r.openStream(s,R)}).catch(F=>G(i,`Error: ${F.message}`))},onQuit:N},v,s,r,t);break;case"game_over":if(E)break;E=!0,b&&(b(),b=null),I(i),S.clearAll(),K(i,{...v,...m},t,N,s,r);break;case"bar_beat":L(),tt(i,m.text);break;case"commentator":L(),at(i,m.text);break;case"evidence":L(),nt(i,m.finding);break;case"diagram":L(),rt(i,m);break;case"system":L(),G(i,m.text);break;case"error":L(),G(i,`⚠ ${m.text}`);break}}function N(){b&&b(),r.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",$e),e.querySelector("#help-btn").addEventListener("click",we),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const m=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=m?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{E||Je(s,$,t,r.cheat,()=>se(s,r,t),()=>dt(s,r),()=>{E=!0,b&&(b(),b=null),I(i),S.clearAll(),K(i,v,t,N,s,r)},()=>{E=!0,b&&(b(),b=null),I(i),S.clearAll(),fe(i,{summary:"The bar has called it — the evening ends in agreement.",points:v.points_of_agreement||[]},{onNewTopic(k){r.newTopic(s,k).then(()=>{E=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=k,B(d,{topic:k,...v,moderator_style:h,points_of_agreement:[]}),S.clearAll(),b=r.openStream(s,R)}).catch(m=>G(i,`Error: ${m.message}`))},onQuit:N},v,s,r,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(E){N();return}v.turn>0?(E=!0,b&&(b(),b=null),K(i,v,t,N,s,r)):N()}),b=r.openStream(s,R)}function et(e,{role:s,name:t,content:a,backchannel:n,debate_label:r="",catchphrase:l=""}){const c=document.createElement("div");if(n)c.className="msg msg-bc",c.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${z(a)}</em>`;else if(s==="moderator")c.className="msg msg-moderator",c.innerHTML=`<div class="msg-mod-label">― ${p(t)} ―</div><div class="msg-content">${z(a)}</div>`;else if(s==="user")c.className="msg msg-user",c.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${z(a)}</div>`;else{const u=`/portraits/${t.replace(/ /g,"_")}.png`,i=t.split(" ").map(h=>h[0]).join("").slice(0,2).toUpperCase(),g=r.includes("Proposition")?"debate-label-prop":"debate-label-opp";c.className="msg msg-philosopher",c.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${u}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(i)}</div></div><div class="msg-body">`+(r?`<div class="msg-debate-label ${g}">${p(r)}</div>`:"")+`<div class="msg-name">${p(t)}</div><div class="msg-content">${z(a,l)}</div></div>`}A(e,c)}function tt(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=z(s),A(e,t)}function G(e,s){const t=document.createElement("div");t.className="msg msg-system",s.endsWith("…")?t.innerHTML=p(s.slice(0,-1))+'<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>':t.textContent=s,A(e,t)}function st(e,s,t){const a=document.createElement("div");a.className="msg msg-drift",a.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${p(s)}</div><div class="drift-orig">original: ${p(t)}</div>`,A(e,a)}function at(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${p(s)}</span>`,A(e,t)}function nt(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,A(e,t)}function rt(e,{speaker:s,title:t,thumb_url:a,url:n,page_url:r}){const l=document.createElement("div");l.className="msg msg-diagram",l.innerHTML=`<div class="diagram-label">${p(s)} produces a diagram</div><a class="diagram-link" href="${p(r)}" target="_blank" rel="noopener"><img class="diagram-img" src="${p(a)}" alt="${p(t)}" /><div class="diagram-caption">${p(t)}</div></a>`,A(e,l)}function it(e,s){const t=document.createElement("div");t.className="msg msg-chyron",t.textContent=s,A(e,t)}function ot(e,s){const t=document.createElement("div");t.className="msg msg-breaking-news",t.innerHTML=`<div class="breaking-label">🔴 BREAKING NEWS</div><div class="breaking-headline">${p(s)}</div>`,A(e,t)}function lt(e,s,t){if(!s)return;const a=document.createElement("div");a.className="msg msg-producer-whisper";const n=t>=3?"[PRODUCER!!!]":"[PRODUCER]";a.innerHTML=`<span class="producer-tag${t>=3?" producer-tag-high":""}">${n}</span> ${p(s)}`,A(e,a)}function be(e,{reason:s,report:t={}},a,n,r,l){I(e);const c=s==="viral",i=c?"📺 SHOW WENT VIRAL":s==="cancelled"?"📺 SHOW CANCELLED":"📺 LAST CALL",d=c?"cable-end-viral":"cable-end-cancelled",{final_ratings:g=0,peak_ratings:h=0,turn_count:$=0,breaking_news_count:b=0,network_offers:E={},catchphrases:w={},guest_stats:f={}}=t,x=Object.entries(E).length?`<div class="end-section cable-end-offers">
        <div class="end-section-label" style="color:var(--amber)">network offers</div>
        ${Object.entries(E).map(([S,L])=>`<div class="cable-offer-row">
            <span class="cable-offer-name">${p(S)}</span>
            <span class="cable-offer-text">${p(L)}</span>
          </div>`).join("")}
      </div>`:"",v=Object.keys(w).length?`<div class="end-section">
        <div class="end-section-label" style="color:var(--blue)">guest catchphrases</div>
        ${Object.entries(w).map(([S,L])=>{const N=(f[S]||{}).catchphrase_count||0;return`<div class="cable-catchphrase-row">
            <span class="cable-cp-name">${p(S)}:</span>
            <span class="cable-cp-phrase">"${p(L)}"</span>
            <span class="cable-cp-count">${N}×</span>
          </div>`}).join("")}
      </div>`:"",y=$?`<div class="end-scoreboard">
        <div class="end-stat">
          <span class="end-stat-num">${$}</span>
          <span class="end-stat-lbl">turns</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--amber)">${g.toFixed(1)}M</span>
          <span class="end-stat-lbl">final ratings</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--green)">${h.toFixed(1)}M</span>
          <span class="end-stat-lbl">peak</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num">${b}</span>
          <span class="end-stat-lbl">breaking news</span>
        </div>
      </div>`:"",_=document.createElement("div");_.className="end-panel",_.innerHTML=`
    <div class="end-title ${d}">━━━ ${i} ━━━</div>
    ${y}
    ${x}
    ${v}
    <div class="end-actions">
      <div class="end-btn-row">
        <button class="end-leave-btn" id="cable-end-leave">Leave the studio</button>
      </div>
    </div>
  `,A(e,_),_.querySelector("#cable-end-leave").addEventListener("click",n)}function ct(e,{winner:s,proposition_open:t,proposition_final:a,margin:n,persona_verdicts:r,verdict:l}){const c=s==="proposition"?"PROPOSITION WINS":"OPPOSITION WINS",u=s==="proposition"?"oxford-verdict-prop":"oxford-verdict-opp",i=a===50,d=Math.min(t,a),h=Math.max(t,a)-d,$=a>t,b=$?"var(--green)":"var(--amber)",E=(n>=0?"+":"")+n+" pts",w=`
    <div class="oxford-shift-wrap">
      <div class="oxford-shift-ends"><span>Opp 0%</span><span>Prop 100%</span></div>
      <div class="oxford-shift-track">
        <div class="oxford-shift-fill" style="left:${d}%;width:${h}%;background:${b}"></div>
        <div class="oxford-shift-mark oxford-shift-mark-open" style="left:${t}%">
          <div class="oxford-shift-pip"></div>
          <div class="oxford-shift-pip-label">${t}%</div>
        </div>
        <div class="oxford-shift-mark oxford-shift-mark-close" style="left:${a}%">
          <div class="oxford-shift-pip oxford-shift-pip-close"></div>
          <div class="oxford-shift-pip-label oxford-shift-pip-label-close">${a}%</div>
        </div>
      </div>
      <div class="oxford-shift-margin" style="color:${b}">${$?"→":"←"} ${E}</div>
    </div>
  `,f=i?'<div class="oxford-verdict-tie">The motion falls — a tie goes to the opposition.</div>':"",x=document.createElement("div");x.className="oxford-verdict-card",x.innerHTML=`
    <div class="oxford-verdict-title">── THE VERDICT ──</div>
    ${w}
    <div class="oxford-verdict-winner ${u}">${c}</div>
    ${f}
    <div class="oxford-verdict-text">${p(l)}</div>
    <ul class="oxford-verdict-personas">
      ${(r||[]).map(v=>`<li>${p(v)}</li>`).join("")}
    </ul>
  `,A(e,x)}function fe(e,{summary:s,points:t},{onNewTopic:a,onQuit:n},r={},l,c,u=[]){var g;const i=document.createElement("div");i.className="end-panel",i.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${p(s)}</blockquote>
    ${Ee(r)}
    ${ke(t,r)}
    <div class="end-actions">
      <div class="end-new-topic-row">
        <input class="end-topic-input" id="consensus-topic-input" type="text" placeholder="New topic…" autocomplete="off" />
        <button class="end-continue-btn" id="consensus-continue">Continue ▶</button>
      </div>
      <div class="end-btn-row">
        ${l?'<button class="end-paper-btn" id="consensus-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="consensus-end">End the evening</button>
      </div>
    </div>
  `,A(e,i);const d=i.querySelector("#consensus-topic-input");d.focus(),i.querySelector("#consensus-continue").addEventListener("click",()=>{const h=d.value.trim();h&&a(h)}),d.addEventListener("keydown",h=>{if(h.key==="Enter"){const $=d.value.trim();$&&a($)}}),i.querySelector("#consensus-end").addEventListener("click",n),(g=i.querySelector("#consensus-paper"))==null||g.addEventListener("click",()=>se(l,c,u))}function K(e,s,t,a,n,r){var i;I(e);const l=document.createElement("div");l.className="end-panel";const c=s.turn||0,u=c?`${c} turn${c!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${p(u)}</blockquote>
    ${Ee(s)}
    ${ke([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${n?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,A(e,l),l.querySelector("#game-over-leave").addEventListener("click",a),(i=l.querySelector("#game-over-paper"))==null||i.addEventListener("click",()=>se(n,r,t))}async function dt(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(a){alert(`Podcast failed: ${a.message}`)}finally{t.remove()}}async function se(e,s,t=[]){const a=document.createElement("div");a.className="newspaper-overlay",a.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(a);let n;try{n=await s.fetchNewspaper(e)}catch(r){a.remove(),alert(`Could not print the paper: ${r.message}`);return}a.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${p(n.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${p(n.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${p(n.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${p(n.headline)}</div>
        <div class="newspaper-subhead">${p(n.subheadline)}</div>

        ${t.length?`
        <div class="newspaper-portrait-strip">
          ${t.map(r=>`
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/newspaper_portraits/${encodeURIComponent(r.replace(/ /g,"_"))}.png"
                   alt="${p(r)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${p(r)}</div>
            </div>
          `).join("")}
        </div>
        `:""}

        <div class="newspaper-columns">
          <div class="newspaper-main-col">
            <p class="newspaper-lede">${p(n.lede)}</p>
            <p class="newspaper-body">${p(n.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${p(n.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${p(n.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${p(n.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${p(n.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,a.querySelector("#newspaper-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",r=>{r.target===a&&a.remove()}),a.querySelector("#newspaper-download").addEventListener("click",()=>{var c,u;const r=a.querySelector(".newspaper-modal").cloneNode(!0);r.querySelectorAll("img").forEach(i=>{i.src&&!i.src.startsWith("http")&&(i.src=window.location.origin+i.getAttribute("src"))}),(c=r.querySelector("#newspaper-close"))==null||c.remove(),(u=r.querySelector("#newspaper-download"))==null||u.remove();const l=window.open("","_blank");l.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${p(n.newspaper_name)}</title>
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
</head><body>${r.outerHTML}</body></html>`),l.document.close(),l.addEventListener("load",()=>{l.focus(),l.print()})})}function Ee(e){const{turn:s=0,heat:t=0,concession_total:a=0}=e;if(!s)return"";const n=Le(t),r=_e(t);return`
    <div class="end-scoreboard">
      <div class="end-stat">
        <span class="end-stat-num">${s}</span>
        <span class="end-stat-lbl">turns</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num" style="color:${n}">${t}<span class="end-stat-denom">/10</span></span>
        <span class="end-stat-lbl">${r}</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num">${a}</span>
        <span class="end-stat-lbl">concessions</span>
      </div>
    </div>
  `}function ke(e,s){const{partial_agreements:t=[],points_of_agreement:a=[],remaining_disagreements:n=[]}=s,r=[...new Set([...e,...a])];let l="";return r.length&&(l+=`<div class="end-section end-section-agree">
      <div class="end-section-label">agreements reached</div>
      ${r.map(c=>`<div class="end-item-agree">✓ ${p(c)}</div>`).join("")}
    </div>`),t.length&&(l+=`<div class="end-section end-section-partial">
      <div class="end-section-label">alignments that formed</div>
      ${t.map(c=>`<div class="end-partial">
          <span class="end-partial-names">${p(c.participants.join(" + "))}</span>
          <span class="end-partial-on">${p(c.on)}</span>
        </div>`).join("")}
    </div>`),n.length&&(l+=`<div class="end-section end-section-tension">
      <div class="end-section-label">still unresolved</div>
      ${n.map(c=>typeof c=="object"&&c!==null?`<div class="end-tension">
            <span class="end-tension-topic">${p(c.topic)}</span>
            <span class="end-tension-stances">${p(c.participant_a)}: ${p(c.stance_a)} · ${p(c.participant_b)}: ${p(c.stance_b)}</span>
          </div>`:`<div class="end-tension">${p(String(c))}</div>`).join("")}
    </div>`),l}function pt(e,s){I(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,A(e,t)}function I(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function B(e,s){var x,v;const{topic:t,turn:a=0,heat:n=0,concession_total:r=0,moderator_style:l="socratic",partial_agreements:c=[],points_of_agreement:u=[],remaining_disagreements:i=[],debate_phase:d="",format_roles:g={},oxford_opening_vote:h=null}=s,$={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},b=d&&$[d]?`<div class="sb-phase-banner">${$[d].toUpperCase()}</div>`:"",E=d&&(g.proposition||g.opposition)?'<div class="sb-roles">'+((x=g.proposition)!=null&&x.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${g.proposition.map(y=>p(y)).join(", ")}</div>`:"")+((v=g.opposition)!=null&&v.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${g.opposition.map(y=>p(y)).join(", ")}</div>`:"")+"</div>":"",w=h?`<details class="oxford-opening-banner">
        <summary class="oxford-opening-summary">
          Opening position: <strong>${h.proposition_pct}%</strong> for proposition
        </summary>
        <div class="oxford-opening-detail">
          <div class="oxford-opening-rationale">${p(h.rationale||"")}</div>
          <ul class="oxford-opening-leanings">
            ${(h.persona_leanings||[]).map(y=>`<li>${p(y)}</li>`).join("")}
          </ul>
        </div>
      </details>`:"";let f=`
    ${b}
    ${E}
    ${w}
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;u.length&&(f+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${u.map(y=>`<div class="sb-agree-item">✓ ${p(y)}</div>`).join("")}
      </div>
    `),c.length&&(f+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${c.map(y=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(y.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(y.on)}</div>
          </div>
        `).join("")}
      </div>
    `),i.length&&(f+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${i.map(y=>typeof y=="object"&&y!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(y.topic)}</div>
                <div class="sb-tension-stance">${p(y.participant_a)}: ${p(y.stance_a)}</div>
                <div class="sb-tension-stance">${p(y.participant_b)}: ${p(y.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(y))}</div>`).join("")}
      </div>
    `),f+=`
    <div class="sb-section" id="sb-bars">
      ${Se(n,r)}
    </div>

    <div class="sb-section" id="sb-cable-ratings" style="${s.cable_ratings!=null?"":"display:none"}">
      ${s.cable_ratings!=null?xe(s.cable_ratings,s.cable_ratings_history||[]):""}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(l)}</div>
    </div>
  `,e.innerHTML=f}function z(e,s=""){let t=p(e);if(s){const n=p(s),r=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");t=t.replace(r,l=>`<mark class="catchphrase-hl">${l}</mark>`)}return t.replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function A(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Se(e,s){const t=Le(e),a=_e(e),n="█".repeat(e),r="░".repeat(10-e),l=Math.min(s,10),c=vt(s),u="█".repeat(l),i="░".repeat(10-l),d=ht(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${n}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${c}">${u}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${c}">${d} (${s})</span>
    </div>
  `}function ut(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=Se(s,t))}function mt(e,s,t){const a=e.querySelector("#sb-cable-ratings");a&&(a.style.display="",a.innerHTML=xe(s,t))}function xe(e,s){const t=(e-.2)/3.8*100,a=Math.max(0,Math.min(100,t)).toFixed(1),n=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030",r=s.length>=2?s[s.length-1]>s[s.length-2]?"▲":s[s.length-1]<s[s.length-2]?"▼":"─":"";return`
    <div class="sb-label">── RATINGS ──</div>
    <div class="sb-ratings-num" style="color:${n}">${e.toFixed(1)}M viewers <span class="sb-trend">${r}</span></div>
    <div class="ratings-bar-track">
      <div class="ratings-bar-fill" style="width:${a}%;background:${n}"></div>
    </div>
    <div class="sb-ratings-scale"><span>cancelled</span><span>viral</span></div>
  `}function Le(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function _e(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function vt(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function ht(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function gt(e,s){const{turn:t,heat:a,partial_agreements:n,remaining_disagreements:r,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const c=n||[],u=r||[];if(c.length&&u.length){const d=c[0],g=u[0],h=d.participants.join(" and "),$=typeof g=="object"?g.topic:String(g);return`${h} are finding common ground, but the group remains divided on ${$}.`}if(c.length){const d=c[0];return`${d.participants.join(" and ")} are converging on ${d.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(u.length){const d=u[0];return typeof d=="object"?`${d.participant_a} and ${d.participant_b} are sharply divided over ${d.topic}.`:`The room is deadlocked — ${String(d)}.`}const i=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${i}.`}const J=document.querySelector("#app");let X={},ae={};const bt=new Set(["production","development","staging"]);async function ft(){const e=bt.has("production")?"default":"production",[s]=await Promise.all([pe(Object.assign({"./skins/default/skin.js":()=>Y(()=>import("./skin-D7HGMV-G.js"),[]),"./skins/kids/skin.js":()=>Y(()=>import("./skin-DZ74tMJe.js"),[])}),`./skins/${e}/skin.js`,4),pe(Object.assign({"./skins/default/theme.css":()=>Y(()=>Promise.resolve({}),__vite__mapDeps([0])),"./skins/kids/theme.css":()=>Y(()=>Promise.resolve({}),__vite__mapDeps([1]))}),`./skins/${e}/theme.css`,4)]);return s}async function Te(){let e,s;try{[e,s,X]=await Promise.all([Me(),je(),Pe()])}catch(n){J.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=!!X.local,a=Ve(J,e,async({characters:n,topic:r,commentator:l=!0,moderator:c=!0,diagrams:u=!1,audienceLevel:i="university",philosopherLength:d="normal",commentatorLength:g="normal",moderatorLength:h="normal",debateFormat:$="",formatRoles:b=null})=>{try{const E=await Re(n,r,l,c,u,i,d,g,h,$,b);yt(E.session_id,n,r,s)}catch(E){a.showError(`Could not start session: ${E.message}`)}},{isLocal:t,skin:ae})}function yt(e,s,t,a){Ze(J,e,s,t,a,{skin:ae,steer:Ie,cheat:We,deleteSession:Ue,newTopic:De,openStream:ze,searchEvidence:Fe,fetchNewspaper:Be,exportPodcast:X.podcast?Ge:null,isLocal:!!X.local}),J.addEventListener("debate:quit",()=>Te(),{once:!0})}ft().then(e=>{ae=e}).catch(()=>{}).finally(()=>Te());
