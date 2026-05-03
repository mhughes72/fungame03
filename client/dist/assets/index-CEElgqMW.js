const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/theme-CJEpj9dL.css","assets/theme-ClQV55ib.css"])))=>i.map(i=>d[i]);
(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const qe="modulepreload",Ce=function(e){return"/"+e},de={},z=function(s,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),d=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));n=Promise.allSettled(t.map(p=>{if(p=Ce(p),p in de)return;de[p]=!0;const l=p.endsWith(".css"),c=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${p}"]${c}`))return;const g=document.createElement("link");if(g.rel=l?"stylesheet":qe,l||(g.as="script"),g.crossOrigin="",g.href=p,d&&g.setAttribute("nonce",d),document.head.appendChild(g),l)return new Promise(($,b)=>{g.addEventListener("load",$),g.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${p}`)))})}))}function r(o){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=o,window.dispatchEvent(d),!d.defaultPrevented)throw o}return n.then(o=>{for(const d of o||[])d.status==="rejected"&&r(d.reason);return s().catch(r)})},pe=(e,s,t)=>{const a=e[s];return a?typeof a=="function"?a():Promise.resolve(a):new Promise((n,r)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+s+(s.split("/").length!==t?". Note that variables only represent file names one level deep.":""))))})},I="/api";async function D(e,s){const t=await fetch(`${I}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function Ne(e){await fetch(`${I}${e}`,{method:"DELETE"})}async function He(e=null){const s=e?`${I}/topics?level=${encodeURIComponent(e)}`:`${I}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function Oe(){const e=await fetch(`${I}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function je(){const e=await fetch(`${I}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function Ae(){const e=await fetch(`${I}/features`);return e.ok?e.json():{}}async function Pe(e,s,t=!0,a=!0,n=!1,r="university",o="normal",d="normal",p="normal",l="",c=null){return D("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:a,diagrams_enabled:n,audience_level:r,philosopher_length:o,commentator_length:d,moderator_length:p,debate_format:l,format_roles:c})}async function Me(e,s,t,a="",n={}){return D(`/sessions/${e}/steer`,{text:s,style:t,evidence:a,drinks:n})}async function Re(e){return D("/search",{query:e})}async function Ie(e,s){return D(`/sessions/${e}/new-topic`,{topic:s})}async function Ue(e){return Ne(`/sessions/${e}`)}async function De(e){return D(`/sessions/${e}/newspaper`,{})}async function Fe(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const r=await s.json().catch(()=>({detail:s.statusText}));throw new Error(r.detail||s.statusText)}const t=await s.blob(),a=URL.createObjectURL(t),n=document.createElement("a");n.href=a,n.download="philosophers-bar-podcast.mp3",document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(a)}async function Be(e,s,t={}){const a={drinks:t};return s!==null&&(a.heat=s),D(`/sessions/${e}/cheat`,a)}function Ge(e,s){const t=new EventSource(`${I}/sessions/${e}/stream`);return t.onmessage=a=>{try{const n=JSON.parse(a.data);s(n)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const ue="https://github.com/mhughes72/fungame03";function be(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",function n(r){r.key==="Escape"&&(a(),document.removeEventListener("keydown",n))})}function ye(){be("ABOUT",`
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
  `)}function $e(){be("HOW TO PLAY",`
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
  `)}function ze(e,s,t,{isLocal:a=!1,skin:n={}}={}){const r=n.appName??"THE PHILOSOPHER'S BAR",o=n.setupSub??"Select 2–4 thinkers for tonight's debate",d=n.charFilterPlaceholder??"Filter thinkers…",p=n.topicLabel??"What should they discuss?",l=n.topicPlaceholder??"What is the nature of justice?",c=n.startLabel??"Open the bar ▶",g=n.orLabel??"── or ──",$=n.dotdLoadingText??"generating tonight's debate…";e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">${r}</h1>
        <p class="setup-sub">${o}</p>

        <input
          id="char-filter"
          class="char-filter-input"
          type="text"
          placeholder="${A(d)}"
          autocomplete="off"
          spellcheck="false"
        />

        <div class="char-list" id="char-list">
          ${s.map(i=>`
            <label class="char-row"
              data-name="${i.name.toLowerCase()}"
              data-desc="${A(i.known_for)}"
              data-category="${A(i.category||"")}"
              data-portrait="${A(i.name.replace(/ /g,"_"))}">
              <input type="checkbox" value="${i.name}" />
              <span class="char-name">${i.name}</span>
              <span class="char-era">${i.era}</span>
            </label>
          `).join("")}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">${p}</label>
        <input
          id="topic-input"
          class="topic-input"
          type="text"
          placeholder="${A(l)}"
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

        <button class="start-btn" id="start-btn" disabled>${A(c)}</button>
        <p class="setup-error" id="setup-error"></p>

        <div class="setup-or">${g}</div>

        <div class="dotd-card" id="dotd-card">
          <div class="dotd-loading">${A($)}</div>
        </div>

        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `;const b=e.querySelectorAll("#char-list input[type=checkbox]"),y=e.querySelectorAll(".char-row"),E=e.querySelector("#char-no-results"),S=e.querySelector("#char-filter");S.addEventListener("input",()=>{const i=S.value.toLowerCase().trim();let T=0;y.forEach(x=>{const j=!i||x.dataset.name.includes(i);x.style.display=j?"":"none",j&&T++}),E.style.display=T===0?"":"none"});const w=document.createElement("div");w.className="char-tooltip",w.style.display="none",document.body.appendChild(w);function q(i){const{desc:T,category:x,portrait:j}=i.currentTarget.dataset;if(!T)return;const N=`/portraits/${j}.png`;w.innerHTML=`
      <div class="tt-inner">
        <img class="tt-portrait" src="${N}" alt="" onerror="this.style.display='none'" />
        <div class="tt-body">
          ${x?`<span class="tt-category">${A(x)}</span>`:""}
          <span class="tt-desc">${A(T)}</span>
        </div>
      </div>`,w.style.display="block",m(i)}function m(i){const x=w.offsetWidth,j=w.offsetHeight;let N=i.clientX+14,H=i.clientY+14;N+x>window.innerWidth-14&&(N=i.clientX-x-14),H+j>window.innerHeight-14&&(H=i.clientY-j-14),w.style.left=N+"px",w.style.top=H+"px"}function h(){w.style.display="none"}y.forEach(i=>{i.addEventListener("mouseenter",q),i.addEventListener("mousemove",m),i.addEventListener("mouseleave",h)});const k=new MutationObserver(()=>{document.body.contains(e)||(w.remove(),k.disconnect())});k.observe(document.body,{childList:!0,subtree:!0}),e.querySelector("#setup-format").style.display="",a&&(e.querySelector("#setup-lengths").style.display="");const L=e.querySelector("#selection-hint"),_=e.querySelector("#start-btn"),C=e.querySelector("#setup-error");function v(){const i=[...b].filter(T=>T.checked).length;i<2?(L.textContent=i===0?"Select 2 to 4 thinkers":"Select 1 more",L.classList.remove("hint-ok","hint-warn")):i>4?(L.textContent=`Too many — deselect ${i-4}`,L.classList.add("hint-warn"),L.classList.remove("hint-ok")):(L.textContent=`${i} selected`,L.classList.add("hint-ok"),L.classList.remove("hint-warn")),_.disabled=i<2||i>4}const f=e.querySelector("#char-list"),O=e.querySelector("#char-filter"),K=e.querySelector("#topic-input");function J(i){f.classList.toggle("oxford-locked",i),O.disabled=i,K.disabled=i,b.forEach(T=>{T.disabled=i}),i?(_.disabled=!0,L.textContent=n.oxfordHint??"Select a suggested Oxford debate below",L.classList.remove("hint-ok","hint-warn")):v()}v(),b.forEach(i=>i.addEventListener("change",v));function ae(){const i=e.querySelector('input[name="audience"]:checked'),T=e.querySelector('input[name="phil-length"]:checked'),x=e.querySelector('input[name="comm-length"]:checked'),j=e.querySelector('input[name="mod-length"]:checked'),N=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:i?i.value:"university",philosopherLength:T?T.value:"normal",commentatorLength:x?x.value:"normal",moderatorLength:j?j.value:"normal",debateFormat:N?N.value:""}}_.addEventListener("click",()=>{const i=[...b].filter(x=>x.checked).map(x=>x.value),T=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";C.textContent="",t({characters:i,topic:T,...ae()})}),e.querySelector("#topic-input").addEventListener("keydown",i=>{i.key==="Enter"&&!_.disabled&&_.click()}),e.querySelector("#setup-about").addEventListener("click",ye),e.querySelector("#setup-help").addEventListener("click",$e);const F=e.querySelector("#dotd-card"),_e={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let ne=[],re=null;function ie(){const i=e.querySelector('input[name="audience"]:checked');return i?i.value:"university"}function Te(){const i=e.querySelector('input[name="debate-format"]:checked');return i?i.value:""}function oe(i){const T=Te();return ne.filter(x=>x.audience_level===i&&(T==="oxford"?x.format==="oxford":x.format!=="oxford"))}function le(i,T=null){if(!i.length)return null;const x=T?i.filter(H=>H.id!==T.id):i,j=x.length?x:i,N=[];for(const H of j)N.push(H),H.source==="curated"&&(N.push(H),N.push(H));return N[Math.floor(Math.random()*N.length)]}function ce(i){re=i;const T=_e[i.category]||"var(--text-dim)",x=i.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',j=i.format==="oxford"?'<span class="dotd-oxford">Oxford</span>':"",N=i.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${i.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${i.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${i.characters.join(" · ")}</div>`;F.innerHTML=`
      <div class="dotd-header">
        <span class="dotd-label">── SUGGESTED DEBATE ──</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${T}">${i.category.toUpperCase()}</span>
          ${j}
          ${x}
        </span>
      </div>
      ${N}
      <div class="dotd-topic">${A(i.topic)}</div>
      <div class="dotd-tagline">${A(i.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-new">Next suggestion ↻</button>
        <button class="dotd-start-btn" id="dotd-start">Start this debate ▶</button>
      </div>
    `,F.querySelector("#dotd-start").addEventListener("click",()=>{const H=i.format==="oxford"?"oxford":"";t({characters:i.characters,topic:i.topic,...ae(),debateFormat:H,formatRoles:i.roles||null})}),F.querySelector("#dotd-new").addEventListener("click",()=>{const H=le(oe(ie()),re);H&&ce(H)})}function X(){const i=le(oe(ie()));i?ce(i):F.style.display="none"}return He().then(i=>{ne=i,X()}).catch(()=>{F.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(i=>{i.addEventListener("change",X)}),e.querySelectorAll('input[name="debate-format"]').forEach(i=>{i.addEventListener("change",()=>{J(i.value==="oxford"&&i.checked),X()})}),{showError(i){C.textContent=i}}}function A(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function M(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function We(e,s,t="",a,n=null,r=[],o={}){const d=o.moderatorStyleNames??{},p=o.steerTitle??"── STEER THE DEBATE ──",l=o.steerQuitLabel??"Quit game",c=o.steerInputPlaceholder??"Speak into the debate — or leave blank for the moderator…",g=o.steerSubmitLabel??"Steer ▶",$=o.evidenceLabel??"── inject evidence ──",b=o.evidencePlaceholder??"Search term — result will be injected as empirical fact…",y=o.moderatorStyleLabel??"── choose a moderator approach ──";return new Promise(E=>{const S=document.createElement("div");S.className="steer-drawer",S.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">${p}</div>
        <button class="steer-quit-btn" id="steer-quit">${M(l)}</button>
      </div>

      ${t?`<div class="steer-summary">${M(t)}</div>`:""}

      <div class="steer-input-row">
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="${M(c)}"
          autocomplete="off"
        />
        <button class="steer-submit-btn" id="steer-submit">${M(g)}</button>
      </div>

      <div class="steer-or">${$}</div>

      <div class="evidence-search-row">
        <input
          class="steer-text-input"
          id="evidence-query"
          type="text"
          placeholder="${M(b)}"
          autocomplete="off"
        />
        <button class="steer-search-btn" id="evidence-search">Search</button>
      </div>

      <div id="evidence-preview" class="evidence-preview" style="display:none"></div>

      <div class="steer-or">${y}</div>

      <div class="style-list" id="style-list">
        ${s.map(f=>`
          <button
            class="style-item${f.style===e?" style-selected":""}"
            data-style="${M(f.style)}"
          >
            <span class="style-name">${M(d[f.style]??f.style)}</span>
            <span class="style-desc">${M(f.description)}</span>
          </button>
        `).join("")}
      </div>
    `,(a||document.body).appendChild(S);const q=S.querySelector("#steer-text-input"),m=S.querySelector("#evidence-query"),h=S.querySelector("#evidence-search"),k=S.querySelector("#evidence-preview");q.focus();let L=e,_="";async function C(){const f=m.value.trim();if(!(!f||!n)){h.disabled=!0,h.textContent="Searching…",k.style.display="none",_="";try{const O=await n(f);_=O.finding,k.style.display="block",k.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${M(O.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,k.querySelector("#evidence-accept").addEventListener("click",()=>{k.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${M(_)}</div>`}),k.querySelector("#evidence-discard").addEventListener("click",()=>{_="",k.style.display="none"})}catch(O){k.style.display="block",k.textContent=`Search failed: ${O.message}`}finally{h.disabled=!1,h.textContent="Search"}}}h.addEventListener("click",C),m.addEventListener("keydown",f=>{f.key==="Enter"&&C()}),S.querySelectorAll(".style-item").forEach(f=>{f.addEventListener("click",()=>{S.querySelectorAll(".style-item").forEach(O=>O.classList.remove("style-selected")),f.classList.add("style-selected"),L=f.dataset.style,v()})});function v(){const f=q.value.trim();S.remove(),E({text:f,style:L,evidence:_})}S.querySelector("#steer-submit").addEventListener("click",v),S.querySelector("#steer-quit").addEventListener("click",()=>{S.remove(),E(null)}),q.addEventListener("keydown",f=>{f.key==="Enter"&&v()})})}function W(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const me=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function Ve(e,s,t,a,n=null,r=null,o=null,d=null){return new Promise(p=>{var E,S,w,q;const l={};t.forEach(m=>{l[m]=0});const c=document.createElement("div");c.className="cheat-overlay",c.innerHTML=`
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
          ${t.map(m=>`
            <div class="drink-row">
              <span class="drink-name">${W(m)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${W(m)}">−</button>
                <span class="drink-count" id="drink-count-${W(m.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${W(m)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        ${n||r?`
        <div class="cheat-utils-row">
          ${n?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          ${r?'<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>':""}
        </div>`:""}

        ${d||o?`
        <div class="cheat-section-label">── END THE EVENING ──</div>
        <div class="cheat-end-row">
          ${d?'<button class="cheat-consensus-btn" id="cheat-consensus">Force Consensus ✓</button>':""}
          ${o?'<button class="cheat-end-btn" id="cheat-end">End Game ✕</button>':""}
        </div>`:""}

        <div class="cheat-footer">
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(c);const g=c.querySelector("#cheat-heat-slider"),$=c.querySelector("#cheat-heat-value");g.addEventListener("input",()=>{const m=parseInt(g.value,10);$.textContent=`${m} — ${me[m]}`}),c.querySelectorAll(".drink-btn").forEach(m=>{m.addEventListener("click",()=>{const h=m.dataset.name,k=m.classList.contains("drink-plus")?1:-1;l[h]=Math.max(0,(l[h]||0)+k);const L=h.replace(/ /g,"_"),_=c.querySelector(`#drink-count-${L}`);_&&(_.textContent=l[h])})});function b(){c.remove(),p()}async function y(){const m=parseInt(g.value,10),h=Object.fromEntries(Object.entries(l).filter(([,L])=>L>0)),k=m!==s;try{await a(e,k?m:null,h)}catch(L){console.error("Cheat failed:",L)}b()}c.querySelector("#cheat-apply").addEventListener("click",y),c.querySelector("#cheat-close").addEventListener("click",b),(E=c.querySelector("#cheat-paper"))==null||E.addEventListener("click",()=>{b(),n()}),(S=c.querySelector("#cheat-podcast"))==null||S.addEventListener("click",()=>{b(),r()}),(w=c.querySelector("#cheat-consensus"))==null||w.addEventListener("click",()=>{b(),d()}),(q=c.querySelector("#cheat-end"))==null||q.addEventListener("click",()=>{b(),o()}),c.addEventListener("click",m=>{m.target===c&&b()})})}function Ye(e,s,t={}){e.innerHTML=s.map(p=>{if(t.renderSeat)return t.renderSeat(p,ve(p),Z(p),ge(p),he(p));const l=ve(p),c=he(p);return`
      <div class="seat" id="seat-${Z(p)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${l}" alt="${ee(p)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${ee(c)}</div>
        </div>
        <div class="seat-name">${ee(ge(p))}</div>
      </div>
    `}).join("");let a=null;function n(p){return e.querySelector(`#seat-${Z(p)}`)}function r(){clearTimeout(a),e.querySelectorAll(".seat").forEach(p=>{p.classList.remove("seat-thinking","seat-speaking")})}function o(p){var l;r(),(l=n(p))==null||l.classList.add("seat-thinking")}function d(p){r();const l=n(p);l&&(l.classList.add("seat-speaking"),a=setTimeout(()=>l.classList.remove("seat-speaking"),3e3))}return{setThinking:o,setSpeaking:d,clearAll:r}}function ve(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function he(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function ge(e){return e.split(" ").at(-1)}function Z(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function ee(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Qe(e,s,t,a,n,r){const o=r.skin??{},d=o.appName??"THE PHILOSOPHER'S BAR";e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">${d}</span>
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
  `;const p=e.querySelector("#seats-bar"),l=e.querySelector("#convo-pane"),c=e.querySelector("#sidebar"),g=e.querySelector("#left-col");let $="socratic",b=0,y=null,E=!1,S=!1,w="",q={},m={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""};const h=Ye(p,t,o);U(c,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const C=document.createElement("div");C.id="debate-starting",C.className="debate-starting",C.innerHTML=`<span class="debate-starting-text">${o.debateStartingText??"Opening the bar"}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,l.appendChild(C)}function k(){var C;(C=l.querySelector("#debate-starting"))==null||C.remove()}function L({type:C,data:v}){switch(C){case"speaker":k(),h.setThinking(v.name),nt(l,v.name);break;case"message":k(),R(l),v.backchannel||h.setSpeaking(v.name),Ke(l,v);break;case"bars":b=v.heat??b,rt(c,v.heat,v.concession_total??0);break;case"debug":{const f=v.data!=null?v.data:"",O=typeof f=="object"?`
`+Object.entries(f).map(([K,J])=>`  ${K}: ${JSON.stringify(J)}`).join(`
`):f?` — ${f}`:"";console.log(`[${v.channel}] ${v.label}${O}`);break}case"oxford_opening_vote":m={...m,oxford_opening_vote:v},U(c,{topic:a,...m,debate_phase:w,format_roles:q});break;case"oxford_verdict":st(l,v);break;case"phase_update":w=v.debate_phase,q=v.format_roles||{},U(c,{topic:a,...m,debate_phase:w,format_roles:q});break;case"state":R(l),$=v.moderator_style,b=v.heat??b,v.debate_phase&&(w=v.debate_phase),v.format_roles&&Object.keys(v.format_roles).length&&(q=v.format_roles),m={...v,debate_phase:w,format_roles:q},U(c,{topic:a,...m});break;case"steer_needed":if(S)break;S=!0,$=v.current_style,v.drift_topic&&Xe(l,v.drift_topic,a),l.scrollTop=l.scrollHeight,We($,n,lt(m),g,r.searchEvidence,t,o).then(f=>{S=!1,f===null?V(l,m,t,_,s,r):($=f.style,U(c,{topic:a,...m,moderator_style:f.style}),r.steer(s,f.text,f.style,f.evidence||"",f.drinks||{}).catch(O=>B(l,`Steer error: ${O.message}`)))});break;case"consensus":if(E)break;E=!0,y&&(y(),y=null),R(l),h.clearAll(),fe(l,v,{onNewTopic(f){r.newTopic(s,f).then(()=>{E=!1,m={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=f,U(c,{topic:f,...m,moderator_style:$,points_of_agreement:[]}),h.clearAll(),y=r.openStream(s,L)}).catch(O=>B(l,`Error: ${O.message}`))},onQuit:_},m,s,r,t);break;case"game_over":if(E)break;E=!0,y&&(y(),y=null),R(l),h.clearAll(),V(l,{...m,...v},t,_,s,r);break;case"bar_beat":k(),Je(l,v.text);break;case"commentator":k(),Ze(l,v.text);break;case"evidence":k(),et(l,v.finding);break;case"diagram":k(),tt(l,v);break;case"system":k(),B(l,v.text);break;case"error":k(),B(l,`⚠ ${v.text}`);break}}function _(){y&&y(),r.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",ye),e.querySelector("#help-btn").addEventListener("click",$e),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const v=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=v?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{E||Ve(s,b,t,r.cheat,()=>te(s,r,t),()=>at(s,r),()=>{E=!0,y&&(y(),y=null),R(l),h.clearAll(),V(l,m,t,_,s,r)},()=>{E=!0,y&&(y(),y=null),R(l),h.clearAll(),fe(l,{summary:"The bar has called it — the evening ends in agreement.",points:m.points_of_agreement||[]},{onNewTopic(C){r.newTopic(s,C).then(()=>{E=!1,m={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=C,U(c,{topic:C,...m,moderator_style:$,points_of_agreement:[]}),h.clearAll(),y=r.openStream(s,L)}).catch(v=>B(l,`Error: ${v.message}`))},onQuit:_},m,s,r,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(E){_();return}m.turn>0?(E=!0,y&&(y(),y=null),V(l,m,t,_,s,r)):_()}),y=r.openStream(s,L)}function Ke(e,{role:s,name:t,content:a,backchannel:n,debate_label:r=""}){const o=document.createElement("div");if(n)o.className="msg msg-bc",o.innerHTML=`<span class="bc-name">${u(t)}:</span> <em>${G(a)}</em>`;else if(s==="moderator")o.className="msg msg-moderator",o.innerHTML=`<div class="msg-mod-label">― Moderator ―</div><div class="msg-content">${G(a)}</div>`;else if(s==="user")o.className="msg msg-user",o.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${G(a)}</div>`;else{const d=`/portraits/${t.replace(/ /g,"_")}.png`,p=t.split(" ").map(g=>g[0]).join("").slice(0,2).toUpperCase(),c=r.includes("Proposition")?"debate-label-prop":"debate-label-opp";o.className="msg msg-philosopher",o.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${d}" alt="${u(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${u(p)}</div></div><div class="msg-body">`+(r?`<div class="msg-debate-label ${c}">${u(r)}</div>`:"")+`<div class="msg-name">${u(t)}</div><div class="msg-content">${G(a)}</div></div>`}P(e,o)}function Je(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=G(s),P(e,t)}function B(e,s){const t=document.createElement("div");t.className="msg msg-system",t.textContent=s,P(e,t)}function Xe(e,s,t){const a=document.createElement("div");a.className="msg msg-drift",a.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${u(s)}</div><div class="drift-orig">original: ${u(t)}</div>`,P(e,a)}function Ze(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${u(s)}</span>`,P(e,t)}function et(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${u(s)}`,P(e,t)}function tt(e,{speaker:s,title:t,thumb_url:a,url:n,page_url:r}){const o=document.createElement("div");o.className="msg msg-diagram",o.innerHTML=`<div class="diagram-label">${u(s)} produces a diagram</div><a class="diagram-link" href="${u(r)}" target="_blank" rel="noopener"><img class="diagram-img" src="${u(a)}" alt="${u(t)}" /><div class="diagram-caption">${u(t)}</div></a>`,P(e,o)}function st(e,{winner:s,proposition_open:t,proposition_final:a,margin:n,persona_verdicts:r,verdict:o}){const d=s==="proposition"?"PROPOSITION WINS":"OPPOSITION WINS",p=s==="proposition"?"oxford-verdict-prop":"oxford-verdict-opp",l=a===50,c=Math.min(t,a),$=Math.max(t,a)-c,b=a>t,y=b?"var(--green)":"var(--amber)",E=(n>=0?"+":"")+n+" pts",S=`
    <div class="oxford-shift-wrap">
      <div class="oxford-shift-ends"><span>Opp 0%</span><span>Prop 100%</span></div>
      <div class="oxford-shift-track">
        <div class="oxford-shift-fill" style="left:${c}%;width:${$}%;background:${y}"></div>
        <div class="oxford-shift-mark oxford-shift-mark-open" style="left:${t}%">
          <div class="oxford-shift-pip"></div>
          <div class="oxford-shift-pip-label">${t}%</div>
        </div>
        <div class="oxford-shift-mark oxford-shift-mark-close" style="left:${a}%">
          <div class="oxford-shift-pip oxford-shift-pip-close"></div>
          <div class="oxford-shift-pip-label oxford-shift-pip-label-close">${a}%</div>
        </div>
      </div>
      <div class="oxford-shift-margin" style="color:${y}">${b?"→":"←"} ${E}</div>
    </div>
  `,w=l?'<div class="oxford-verdict-tie">The motion falls — a tie goes to the opposition.</div>':"",q=document.createElement("div");q.className="oxford-verdict-card",q.innerHTML=`
    <div class="oxford-verdict-title">── THE VERDICT ──</div>
    ${S}
    <div class="oxford-verdict-winner ${p}">${d}</div>
    ${w}
    <div class="oxford-verdict-text">${u(o)}</div>
    <ul class="oxford-verdict-personas">
      ${(r||[]).map(m=>`<li>${u(m)}</li>`).join("")}
    </ul>
  `,P(e,q)}function fe(e,{summary:s,points:t},{onNewTopic:a,onQuit:n},r={},o,d,p=[]){var g;const l=document.createElement("div");l.className="end-panel",l.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${u(s)}</blockquote>
    ${we(r)}
    ${Ee(t,r)}
    <div class="end-actions">
      <div class="end-new-topic-row">
        <input class="end-topic-input" id="consensus-topic-input" type="text" placeholder="New topic…" autocomplete="off" />
        <button class="end-continue-btn" id="consensus-continue">Continue ▶</button>
      </div>
      <div class="end-btn-row">
        ${o?'<button class="end-paper-btn" id="consensus-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="consensus-end">End the evening</button>
      </div>
    </div>
  `,P(e,l);const c=l.querySelector("#consensus-topic-input");c.focus(),l.querySelector("#consensus-continue").addEventListener("click",()=>{const $=c.value.trim();$&&a($)}),c.addEventListener("keydown",$=>{if($.key==="Enter"){const b=c.value.trim();b&&a(b)}}),l.querySelector("#consensus-end").addEventListener("click",n),(g=l.querySelector("#consensus-paper"))==null||g.addEventListener("click",()=>te(o,d,p))}function V(e,s,t,a,n,r){var l;R(e);const o=document.createElement("div");o.className="end-panel";const d=s.turn||0,p=d?`${d} turn${d!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";o.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${u(p)}</blockquote>
    ${we(s)}
    ${Ee([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${n?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,P(e,o),o.querySelector("#game-over-leave").addEventListener("click",a),(l=o.querySelector("#game-over-paper"))==null||l.addEventListener("click",()=>te(n,r,t))}async function at(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(a){alert(`Podcast failed: ${a.message}`)}finally{t.remove()}}async function te(e,s,t=[]){const a=document.createElement("div");a.className="newspaper-overlay",a.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(a);let n;try{n=await s.fetchNewspaper(e)}catch(r){a.remove(),alert(`Could not print the paper: ${r.message}`);return}a.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${u(n.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${u(n.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${u(n.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${u(n.headline)}</div>
        <div class="newspaper-subhead">${u(n.subheadline)}</div>

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
            <p class="newspaper-lede">${u(n.lede)}</p>
            <p class="newspaper-body">${u(n.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${u(n.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${u(n.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${u(n.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${u(n.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,a.querySelector("#newspaper-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",r=>{r.target===a&&a.remove()}),a.querySelector("#newspaper-download").addEventListener("click",()=>{var d,p;const r=a.querySelector(".newspaper-modal").cloneNode(!0);r.querySelectorAll("img").forEach(l=>{l.src&&!l.src.startsWith("http")&&(l.src=window.location.origin+l.getAttribute("src"))}),(d=r.querySelector("#newspaper-close"))==null||d.remove(),(p=r.querySelector("#newspaper-download"))==null||p.remove();const o=window.open("","_blank");o.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${u(n.newspaper_name)}</title>
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
</head><body>${r.outerHTML}</body></html>`),o.document.close(),o.addEventListener("load",()=>{o.focus(),o.print()})})}function we(e){const{turn:s=0,heat:t=0,concession_total:a=0}=e;if(!s)return"";const n=ke(t),r=xe(t);return`
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
  `}function Ee(e,s){const{partial_agreements:t=[],points_of_agreement:a=[],remaining_disagreements:n=[]}=s,r=[...new Set([...e,...a])];let o="";return r.length&&(o+=`<div class="end-section end-section-agree">
      <div class="end-section-label">agreements reached</div>
      ${r.map(d=>`<div class="end-item-agree">✓ ${u(d)}</div>`).join("")}
    </div>`),t.length&&(o+=`<div class="end-section end-section-partial">
      <div class="end-section-label">alignments that formed</div>
      ${t.map(d=>`<div class="end-partial">
          <span class="end-partial-names">${u(d.participants.join(" + "))}</span>
          <span class="end-partial-on">${u(d.on)}</span>
        </div>`).join("")}
    </div>`),n.length&&(o+=`<div class="end-section end-section-tension">
      <div class="end-section-label">still unresolved</div>
      ${n.map(d=>typeof d=="object"&&d!==null?`<div class="end-tension">
            <span class="end-tension-topic">${u(d.topic)}</span>
            <span class="end-tension-stances">${u(d.participant_a)}: ${u(d.stance_a)} · ${u(d.participant_b)}: ${u(d.stance_b)}</span>
          </div>`:`<div class="end-tension">${u(String(d))}</div>`).join("")}
    </div>`),o}function nt(e,s){R(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${u(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,P(e,t)}function R(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function U(e,s){var q,m;const{topic:t,turn:a=0,heat:n=0,concession_total:r=0,moderator_style:o="socratic",partial_agreements:d=[],points_of_agreement:p=[],remaining_disagreements:l=[],debate_phase:c="",format_roles:g={},oxford_opening_vote:$=null}=s,b={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},y=c&&b[c]?`<div class="sb-phase-banner">${b[c].toUpperCase()}</div>`:"",E=c&&(g.proposition||g.opposition)?'<div class="sb-roles">'+((q=g.proposition)!=null&&q.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${g.proposition.map(h=>u(h)).join(", ")}</div>`:"")+((m=g.opposition)!=null&&m.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${g.opposition.map(h=>u(h)).join(", ")}</div>`:"")+"</div>":"",S=$?`<details class="oxford-opening-banner">
        <summary class="oxford-opening-summary">
          Opening position: <strong>${$.proposition_pct}%</strong> for proposition
        </summary>
        <div class="oxford-opening-detail">
          <div class="oxford-opening-rationale">${u($.rationale||"")}</div>
          <ul class="oxford-opening-leanings">
            ${($.persona_leanings||[]).map(h=>`<li>${u(h)}</li>`).join("")}
          </ul>
        </div>
      </details>`:"";let w=`
    ${y}
    ${E}
    ${S}
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${u(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;p.length&&(w+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${p.map(h=>`<div class="sb-agree-item">✓ ${u(h)}</div>`).join("")}
      </div>
    `),d.length&&(w+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${d.map(h=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${u(h.participants.join(" + "))}</div>
            <div class="sb-partial-on">${u(h.on)}</div>
          </div>
        `).join("")}
      </div>
    `),l.length&&(w+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${l.map(h=>typeof h=="object"&&h!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${u(h.topic)}</div>
                <div class="sb-tension-stance">${u(h.participant_a)}: ${u(h.stance_a)}</div>
                <div class="sb-tension-stance">${u(h.participant_b)}: ${u(h.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${u(String(h))}</div>`).join("")}
      </div>
    `),w+=`
    <div class="sb-section" id="sb-bars">
      ${Se(n,r)}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${u(o)}</div>
    </div>
  `,e.innerHTML=w}function G(e){return u(e).replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function P(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function u(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Se(e,s){const t=ke(e),a=xe(e),n="█".repeat(e),r="░".repeat(10-e),o=Math.min(s,10),d=it(s),p="█".repeat(o),l="░".repeat(10-o),c=ot(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${n}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${d}">${p}</span><span class="sb-heat-empty">${l}</span>
      <span class="sb-heat-label" style="color:${d}">${c} (${s})</span>
    </div>
  `}function rt(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=Se(s,t))}function ke(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function xe(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function it(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function ot(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function lt(e,s){const{turn:t,heat:a,partial_agreements:n,remaining_disagreements:r,drift_topic:o}=e;if(!t)return"The debate is just getting started.";if(o)return`The conversation has drifted from the original topic toward ${o}.`;const d=n||[],p=r||[];if(d.length&&p.length){const c=d[0],g=p[0],$=c.participants.join(" and "),b=typeof g=="object"?g.topic:String(g);return`${$} are finding common ground, but the group remains divided on ${b}.`}if(d.length){const c=d[0];return`${c.participants.join(" and ")} are converging on ${c.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(p.length){const c=p[0];return typeof c=="object"?`${c.participant_a} and ${c.participant_b} are sharply divided over ${c.topic}.`:`The room is deadlocked — ${String(c)}.`}const l=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${l}.`}const Y=document.querySelector("#app");let Q={},se={};const ct=new Set(["production","development","staging"]);async function dt(){const e=ct.has("production")?"default":"production",[s]=await Promise.all([pe(Object.assign({"./skins/default/skin.js":()=>z(()=>import("./skin-D7HGMV-G.js"),[]),"./skins/kids/skin.js":()=>z(()=>import("./skin-DZ74tMJe.js"),[])}),`./skins/${e}/skin.js`,4),pe(Object.assign({"./skins/default/theme.css":()=>z(()=>Promise.resolve({}),__vite__mapDeps([0])),"./skins/kids/theme.css":()=>z(()=>Promise.resolve({}),__vite__mapDeps([1]))}),`./skins/${e}/theme.css`,4)]);return s}async function Le(){let e,s;try{[e,s,Q]=await Promise.all([Oe(),je(),Ae()])}catch(n){Y.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=!!Q.local,a=ze(Y,e,async({characters:n,topic:r,commentator:o=!0,moderator:d=!0,diagrams:p=!1,audienceLevel:l="university",philosopherLength:c="normal",commentatorLength:g="normal",moderatorLength:$="normal",debateFormat:b="",formatRoles:y=null})=>{try{const E=await Pe(n,r,o,d,p,l,c,g,$,b,y);pt(E.session_id,n,r,s)}catch(E){a.showError(`Could not start session: ${E.message}`)}},{isLocal:t,skin:se})}function pt(e,s,t,a){Qe(Y,e,s,t,a,{skin:se,steer:Me,cheat:Be,deleteSession:Ue,newTopic:Ie,openStream:Ge,searchEvidence:Re,fetchNewspaper:De,exportPodcast:Q.podcast?Fe:null,isLocal:!!Q.local}),Y.addEventListener("debate:quit",()=>Le(),{once:!0})}dt().then(e=>{se=e}).catch(()=>{}).finally(()=>Le());
