const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/theme-CJEpj9dL.css","assets/theme-ClQV55ib.css"])))=>i.map(i=>d[i]);
(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(n){if(n.ep)return;n.ep=!0;const r=t(n);fetch(n.href,r)}})();const Ge="modulepreload",We=function(e){return"/"+e},fe={},ee=function(s,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=Promise.allSettled(t.map(m=>{if(m=We(m),m in fe)return;fe[m]=!0;const i=m.endsWith(".css"),d=i?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${m}"]${d}`))return;const f=document.createElement("link");if(f.rel=i?"stylesheet":Ge,i||(f.as="script"),f.crossOrigin="",f.href=m,c&&f.setAttribute("nonce",c),document.head.appendChild(f),i)return new Promise((g,E)=>{f.addEventListener("load",g),f.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${m}`)))})}))}function r(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return n.then(l=>{for(const c of l||[])c.status==="rejected"&&r(c.reason);return s().catch(r)})},ye=(e,s,t)=>{const a=e[s];return a?typeof a=="function"?a():Promise.resolve(a):new Promise((n,r)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+s+(s.split("/").length!==t?". Note that variables only represent file names one level deep.":""))))})},U="/api";async function W(e,s){const t=await fetch(`${U}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function Ve(e){await fetch(`${U}${e}`,{method:"DELETE"})}async function ze(e=null){const s=e?`${U}/topics?level=${encodeURIComponent(e)}`:`${U}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function Ye(){const e=await fetch(`${U}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function Qe(){const e=await fetch(`${U}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function Ke(){const e=await fetch(`${U}/features`);return e.ok?e.json():{}}async function Je(e,s,t=!0,a=!0,n=!1,r="university",l="normal",c="normal",m="normal",i="",d=null){return W("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:a,diagrams_enabled:n,audience_level:r,philosopher_length:l,commentator_length:c,moderator_length:m,debate_format:i,format_roles:d})}async function Xe(e,s,t,a="",n={},r=""){return W(`/sessions/${e}/steer`,{text:s,style:t,evidence:a,drinks:n,producer_directive:r})}async function Ze(e){return W("/search",{query:e})}async function et(e){return W("/suggest-cast",{topic:e})}async function tt(e,s){return W(`/sessions/${e}/new-topic`,{topic:s})}async function st(e){return Ve(`/sessions/${e}`)}async function at(e){return W(`/sessions/${e}/newspaper`,{})}async function nt(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const r=await s.json().catch(()=>({detail:s.statusText}));throw new Error(r.detail||s.statusText)}const t=await s.blob(),a=URL.createObjectURL(t),n=document.createElement("a");n.href=a,n.download="philosophers-bar-podcast.mp3",document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(a)}async function rt(e,s,t={}){const a={drinks:t};return s!==null&&(a.heat=s),W(`/sessions/${e}/cheat`,a)}function it(e,s){const t=new EventSource(`${U}/sessions/${e}/stream`);return t.onmessage=a=>{try{const n=JSON.parse(a.data);s(n)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const $e="https://github.com/mhughes72/fungame03";function _e(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",function n(r){r.key==="Escape"&&(a(),document.removeEventListener("keydown",n))})}function Te(){_e("ABOUT",`
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
    <p><a class="info-link" href="${$e}" target="_blank" rel="noopener">${$e}</a></p>
  `)}function qe(){_e("HOW TO PLAY",`
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
  `)}function ot(e,s,t,{isLocal:a=!1,skin:n={}}={}){const r=n.appName??"THE PHILOSOPHER'S BAR",l=n.setupSub??"Select 2–4 thinkers for tonight's debate",c=n.charFilterPlaceholder??"Filter thinkers…",m=n.topicLabel??"What should they discuss?",i=n.topicPlaceholder??"What is the nature of justice?",d=n.startLabel??"Open the bar ▶";n.orLabel;const f=n.dotdLoadingText??"generating tonight's debate…";e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">${r}</h1>
        <p class="setup-sub">${l}</p>

        <div class="format-selector">
          <label class="format-opt" data-desc="Open philosophical debate — the moderator guides the conversation freely with no fixed sides">
            <input type="radio" name="debate-format" value="" checked />
            <span class="format-opt-icon">💭</span>
            <span class="format-opt-name">Freeform</span>
          </label>
          <label class="format-opt" data-desc="Structured Oxford-style debate with proposition and opposition sides — characters are pre-assigned to argue for or against the motion">
            <input type="radio" name="debate-format" value="oxford" />
            <span class="format-opt-icon">🎓</span>
            <span class="format-opt-name">Oxford</span>
          </label>
          <label class="format-opt" data-desc="Chaotic cable TV showdown — ratings-driven, catchphrases, commercial breaks, and a host fighting for airtime">
            <input type="radio" name="debate-format" value="cable_news" />
            <span class="format-opt-icon">📺</span>
            <span class="format-opt-name">Cable News</span>
          </label>
        </div>

        <div class="dotd-card" id="dotd-card">
          <div class="dotd-loading">${M(f)}</div>
        </div>

        <div class="setup-or">── or build your own ──</div>

        <input
          id="char-filter"
          class="char-filter-input"
          type="text"
          placeholder="${M(c)}"
          autocomplete="off"
          spellcheck="false"
        />

        <div class="char-list" id="char-list">
          ${(()=>{const o=["Philosophy","Science","Politics","Arts","Literature","Technology","Media","Psychology","Religion"],$={};for(const b of s){const k=b.category||"Other";($[k]=$[k]||[]).push(b)}return o.filter(b=>$[b]).map(b=>`
              <div class="char-category-group">
                <div class="char-category-label">${M(b)}</div>
                <div class="char-category-cards">
                  ${$[b].map(k=>{const H=k.name.replace(/ /g,"_"),j=k.name.split(" ").map(le=>le[0]).join("").slice(0,2).toUpperCase();return`<label class="char-card"
                        data-name="${k.name.toLowerCase()}"
                        data-desc="${M(k.known_for)}"
                        data-category="${M(b)}">
                        <input type="checkbox" value="${M(k.name)}" />
                        <div class="char-card-img">
                          <img src="/portraits/${H}.png" alt=""
                            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
                          <div class="char-card-initials" style="display:none">${M(j)}</div>
                        </div>
                        <div class="char-card-name">${M(k.name)}</div>
                      </label>`}).join("")}
                </div>
              </div>`).join("")})()}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">${m}</label>
        <div class="topic-row">
          <input
            id="topic-input"
            class="topic-input"
            type="text"
            placeholder="${M(i)}"
            maxlength="500"
            autocomplete="off"
          />
          <button class="suggest-btn" id="suggest-btn" title="Let AI pick the best characters for this topic">Suggest cast ✦</button>
        </div>
        <div class="cast-suggestion" id="cast-suggestion" style="display:none"></div>

        <button class="advanced-toggle" id="advanced-toggle">Advanced ▾</button>
        <div class="advanced-panel" id="advanced-panel">
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
        </div>

        <button class="start-btn" id="start-btn" disabled>${M(d)}</button>
        <p class="setup-error" id="setup-error"></p>

        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `;const g=e.querySelectorAll("#char-list input[type=checkbox]"),E=e.querySelectorAll(".char-card"),v=e.querySelector("#char-no-results"),x=e.querySelector("#char-filter");x.addEventListener("input",()=>{const o=x.value.toLowerCase().trim();let $=0;E.forEach(b=>{const k=!o||b.dataset.name.includes(o);b.style.display=k?"":"none",k&&$++}),e.querySelectorAll(".char-category-group").forEach(b=>{const k=[...b.querySelectorAll(".char-card")].some(H=>H.style.display!=="none");b.style.display=k?"":"none"}),v.style.display=$===0?"":"none"});const S=document.createElement("div");S.className="char-tooltip",S.style.display="none",document.body.appendChild(S);function L(o){const{desc:$,category:b}=o.currentTarget.dataset;$&&(S.innerHTML=`
      <div class="tt-body">
        ${b?`<span class="tt-category">${M(b)}</span>`:""}
        <span class="tt-desc">${M($)}</span>
      </div>`,S.style.display="block",_(o))}function _(o){const b=S.offsetWidth,k=S.offsetHeight;let H=o.clientX+14,j=o.clientY+14;H+b>window.innerWidth-14&&(H=o.clientX-b-14),j+k>window.innerHeight-14&&(j=o.clientY-k-14),S.style.left=H+"px",S.style.top=j+"px"}function h(){S.style.display="none"}E.forEach(o=>{o.addEventListener("mouseenter",L),o.addEventListener("mousemove",_),o.addEventListener("mouseleave",h)}),e.querySelectorAll(".format-opt").forEach(o=>{o.addEventListener("mouseenter",L),o.addEventListener("mousemove",_),o.addEventListener("mouseleave",h)});const y=new MutationObserver(()=>{document.body.contains(e)||(S.remove(),y.disconnect())});y.observe(document.body,{childList:!0,subtree:!0}),a&&(e.querySelector("#setup-lengths").style.display="");const C=e.querySelector("#advanced-toggle"),T=e.querySelector("#advanced-panel");let q=!1;C.addEventListener("click",()=>{q=!q,T.style.display=q?"block":"none",C.textContent=q?"Advanced ▴":"Advanced ▾"});const A=e.querySelector("#selection-hint"),O=e.querySelector("#start-btn"),w=e.querySelector("#setup-error");function u(){const o=[...g].filter($=>$.checked).length;e.querySelector("#char-list").classList.toggle("char-list--maxed",o>=4),o<2?(A.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",A.classList.remove("hint-ok","hint-warn")):o>4?(A.textContent=`Too many — deselect ${o-4}`,A.classList.add("hint-warn"),A.classList.remove("hint-ok")):(A.textContent=`${o} selected`,A.classList.add("hint-ok"),A.classList.remove("hint-warn")),O.disabled=o<2||o>4}const N=e.querySelector("#char-list"),F=e.querySelector("#char-filter"),X=e.querySelector("#topic-input"),re=e.querySelector(".setup-or"),je=e.querySelector(".topic-label"),Re=e.querySelector(".topic-row"),Ie=e.querySelector("#cast-suggestion");function De(o){[re,F,N,A,je,Re].forEach($=>{$.style.display=o?"none":""}),o&&(Ie.style.display="none"),o?O.disabled=!0:u()}u();const Q=e.querySelector("#suggest-btn"),V=e.querySelector("#cast-suggestion");let ie=!1;Q.addEventListener("click",async()=>{const o=X.value.trim();if(!o){X.focus();return}Q.disabled=!0,Q.textContent="thinking…",V.innerHTML='<div class="cs-loading">selecting the best minds for this topic…</div>',V.style.display="";try{const{picks:$}=await et(o);if(!$||!$.length)return;g.forEach(k=>{k.checked=!1}),$.forEach(({name:k})=>{const H=e.querySelector(`#char-list input[value="${CSS.escape(k)}"]`);H&&(H.checked=!0)}),ie=!0,u(),V.innerHTML='<div class="cs-header">── suggested cast ──</div>'+$.map(k=>`<div class="cs-pick">
            <span class="cs-name">${M(k.name)}</span>
            <span class="cs-reason">${M(k.reason)}</span>
          </div>`).join(""),V.style.display="";const b=e.querySelector(`.char-card[data-name="${$[0].name.toLowerCase()}"]`);b&&b.scrollIntoView({block:"nearest",behavior:"smooth"})}catch($){console.error("suggest cast failed",$),V.style.display="none"}finally{Q.disabled=!1,Q.textContent="Suggest cast ✦"}}),g.forEach(o=>o.addEventListener("change",()=>{ie&&(V.style.display="none",ie=!1),u()}));function me(){const o=e.querySelector('input[name="audience"]:checked'),$=e.querySelector('input[name="phil-length"]:checked'),b=e.querySelector('input[name="comm-length"]:checked'),k=e.querySelector('input[name="mod-length"]:checked'),H=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:o?o.value:"university",philosopherLength:$?$.value:"normal",commentatorLength:b?b.value:"normal",moderatorLength:k?k.value:"normal",debateFormat:H?H.value:""}}O.addEventListener("click",()=>{const o=[...g].filter(b=>b.checked).map(b=>b.value),$=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";w.textContent="",t({characters:o,topic:$,...me()})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!O.disabled&&O.click()}),e.querySelector("#setup-about").addEventListener("click",Te),e.querySelector("#setup-help").addEventListener("click",qe);const B=e.querySelector("#dotd-card"),Fe={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let ve=[],z=[],I=-1;function he(){const o=e.querySelector('input[name="audience"]:checked');return o?o.value:"university"}function Ue(){const o=e.querySelector('input[name="debate-format"]:checked');return o?o.value:""}function ge(o){const $=Ue();return ve.filter(b=>($==="oxford"?b.format==="oxford":$==="cable_news"?b.format==="cable_news":b.format!=="oxford"&&b.format!=="cable_news")&&($==="cable_news"||b.audience_level===o))}function be(o,$=null){if(!o.length)return null;const b=$?o.filter(j=>j.id!==$.id):o,k=b.length?b:o,H=[];for(const j of k)H.push(j),j.source==="curated"&&(H.push(j),H.push(j));return H[Math.floor(Math.random()*H.length)]}function Z(o){const $=Fe[o.category]||"var(--text-dim)",b=o.format==="oxford",k=o.format==="cable_news";B.classList.toggle("dotd-card--cable",k);const H=b?'<span class="dotd-oxford">🎓 Oxford</span>':k?"":'<span class="dotd-freeform">Freeform</span>',j=b?"":o.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',le=o.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${o.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${o.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${o.characters.join(" · ")}</div>`,Be=k?`
      <div class="cable-dotd-bar">
        <span class="cable-dotd-live"><span class="cable-dotd-dot"></span>LIVE</span>
        <span class="cable-dotd-breaking">BREAKING NOW</span>
        <span class="cable-dotd-channel">📺 DEBATE ZONE</span>
      </div>`:"";B.innerHTML=`
      ${Be}
      <div class="dotd-header">
        <span class="dotd-label">${k?"TONIGHT'S SHOWDOWN":"── SUGGESTED DEBATE ──"}</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${$}">${o.category.toUpperCase()}</span>
          ${H}
          ${j}
        </span>
      </div>
      ${le}
      <div class="dotd-topic">${M(o.topic)}</div>
      <div class="dotd-tagline">${M(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-prev" ${I<=0?"disabled":""}>← Prev</button>
        <button class="dotd-start-btn" id="dotd-start">${k?"🔴 GO LIVE ▶":"Start this debate ▶"}</button>
        <button class="dotd-new-btn" id="dotd-next">Next →</button>
      </div>
    `,B.querySelector("#dotd-start").addEventListener("click",()=>{const K=b?"oxford":k?"cable_news":"";t({characters:o.characters,topic:o.topic,...me(),debateFormat:K,formatRoles:o.roles||null})}),B.querySelector("#dotd-prev").addEventListener("click",()=>{I>0&&(I--,Z(z[I]))}),B.querySelector("#dotd-next").addEventListener("click",()=>{if(I<z.length-1)I++,Z(z[I]);else{const K=be(ge(he()),z[I]);K&&(z.push(K),I++,Z(K))}})}function oe(){const o=be(ge(he()));o?(z=[o],I=0,Z(o)):B.style.display="none"}return ze().then(o=>{ve=o,oe()}).catch(()=>{B.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(o=>{o.addEventListener("change",oe)}),e.querySelectorAll('input[name="debate-format"]').forEach(o=>{o.addEventListener("change",()=>{var b;const $=((b=e.querySelector('input[name="debate-format"]:checked'))==null?void 0:b.value)||"";De($==="oxford"||$==="cable_news"),oe()})}),{showError(o){w.textContent=o}}}function M(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function lt(e){const s=(e-.2)/3.8*100,t=Math.max(0,Math.min(100,s)).toFixed(1),a=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030";return`<div class="ratings-bar-track"><div class="ratings-bar-fill" style="width:${t}%;background:${a}"></div></div>`}const ct={socratic:"💭",combative:"⚔️","devil's advocate":"😈",koan:"☯️",journalist:"🎤","straw man":"🪆","steel man":"🛡️","last call":"🔔"};function dt(e,s,t="",a,n=null,r=[],l={}){const c=l.moderatorStyleNames??{},m=l.steerTitle??"── STEER THE DEBATE ──",i=l.steerQuitLabel??"Quit game",d=l.steerInputPlaceholder??"Speak into the debate — or leave blank for the moderator…",f=l.steerSubmitLabel??"Steer ▶",g=l.evidencePlaceholder??"Search term — result will be injected as empirical fact…";return new Promise(E=>{const v=document.createElement("div");v.className="steer-drawer",v.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">${m}</div>
        <button class="steer-quit-btn" id="steer-quit">${R(i)}</button>
      </div>

      ${t?`<div class="steer-summary">${R(t)}</div>`:""}

      <div class="steer-input-row">
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="${R(d)}"
          autocomplete="off"
        />
        <button class="steer-submit-btn" id="steer-submit">${R(f)}</button>
      </div>

      <div class="style-grid" id="style-grid">
        ${s.map(w=>{const u=ct[w.style]??"◆",N=c[w.style]??w.style;return`<button
            class="style-icon-btn${w.style===e?" style-selected":""}"
            data-style="${R(w.style)}"
            title="${R(N+" — "+w.description)}"
          >
            <span class="style-icon-glyph">${u}</span>
            <span class="style-icon-name">${R(N)}</span>
          </button>`}).join("")}
      </div>

      <div class="steer-secondary-row">
        <button class="steer-pill" id="evidence-toggle">⚡ Evidence</button>
      </div>

      <div id="evidence-panel" style="display:none">
        <div class="evidence-search-row">
          <input
            class="steer-text-input"
            id="evidence-query"
            type="text"
            placeholder="${R(g)}"
            autocomplete="off"
          />
          <button class="steer-search-btn" id="evidence-search">Search</button>
        </div>
        <div id="evidence-preview" class="evidence-preview" style="display:none"></div>
      </div>
    `,(a||document.body).appendChild(v);const S=v.querySelector("#steer-text-input");S.focus();let L=e,_="";v.querySelectorAll(".style-icon-btn").forEach(w=>{w.addEventListener("click",()=>{v.querySelectorAll(".style-icon-btn").forEach(u=>u.classList.remove("style-selected")),w.classList.add("style-selected"),L=w.dataset.style,O()})});const h=v.querySelector("#evidence-toggle"),y=v.querySelector("#evidence-panel"),C=v.querySelector("#evidence-preview"),T=v.querySelector("#evidence-query"),q=v.querySelector("#evidence-search");h.addEventListener("click",()=>{const w=y.style.display==="none";y.style.display=w?"":"none",h.classList.toggle("steer-pill--active",w),w&&T.focus()});async function A(){const w=T.value.trim();if(!(!w||!n)){q.disabled=!0,q.textContent="Searching…",C.style.display="none",_="";try{const u=await n(w);_=u.finding,C.style.display="block",C.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${R(u.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,C.querySelector("#evidence-accept").addEventListener("click",()=>{C.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${R(_)}</div>`}),C.querySelector("#evidence-discard").addEventListener("click",()=>{_="",C.style.display="none"})}catch(u){C.style.display="block",C.textContent=`Search failed: ${u.message}`}finally{q.disabled=!1,q.textContent="Search"}}}q.addEventListener("click",A),T.addEventListener("keydown",w=>{w.key==="Enter"&&A()});function O(){v.remove(),E({text:S.value.trim(),style:L,evidence:_})}v.querySelector("#steer-submit").addEventListener("click",O),v.querySelector("#steer-quit").addEventListener("click",()=>{v.remove(),E(null)}),S.addEventListener("keydown",w=>{w.key==="Enter"&&O()})})}function pt(e,s,t={}){const{ratings:a=.8,peak_ratings:n=.8,producer_note:r="",producer_stress:l=0,directives:c=[]}=e,m=["","nervous","stressed","PANICKING","MELTDOWN","FIRE FIRE FIRE"],i=l>0?` (${m[Math.min(l,5)]})`:"",d=l>=3;return new Promise(f=>{const g=document.createElement("div");g.className="steer-drawer",g.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── COMMERCIAL BREAK ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      <div class="commercial-ratings-row">
        <span class="commercial-ratings-num">📺 ${a.toFixed(1)}M</span>
        <span class="commercial-ratings-peak">peak ${n.toFixed(1)}M</span>
        ${lt(a)}
      </div>

      ${r?`
        <div class="commercial-producer-note${d?" commercial-producer-high":""}">
          <span class="producer-tag">[PRODUCER${i}]</span> ${R(r)}
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
        ${c.map(([L,_])=>`
          <button class="style-item" data-directive="${R(L)}">
            <span class="style-name">${R(L.replace(/_/g," "))}</span>
            <span class="style-desc">${R(_)}</span>
          </button>
        `).join("")}
      </div>
    `,(s||document.body).appendChild(g);const v=g.querySelector("#steer-text-input");v.focus();let x="";g.querySelectorAll(".style-item").forEach(L=>{L.addEventListener("click",()=>{g.querySelectorAll(".style-item").forEach(_=>_.classList.remove("style-selected")),L.classList.add("style-selected"),x=L.dataset.directive,S()})});function S(){const L=v.value.trim();g.remove(),f({text:L,producer_directive:x})}g.querySelector("#steer-submit").addEventListener("click",S),g.querySelector("#steer-quit").addEventListener("click",()=>{g.remove(),f(null)}),v.addEventListener("keydown",L=>{L.key==="Enter"&&S()})})}function te(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const we=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function ut(e,s,t,a,n=null,r=null,l=null,c=null){return new Promise(m=>{var x,S,L,_;const i={};t.forEach(h=>{i[h]=0});const d=document.createElement("div");d.className="cheat-overlay",d.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${we[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(h=>`
            <div class="drink-row">
              <span class="drink-name">${te(h)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${te(h)}">−</button>
                <span class="drink-count" id="drink-count-${te(h.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${te(h)}">+</button>
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
    `,document.body.appendChild(d);const f=d.querySelector("#cheat-heat-slider"),g=d.querySelector("#cheat-heat-value");f.addEventListener("input",()=>{const h=parseInt(f.value,10);g.textContent=`${h} — ${we[h]}`}),d.querySelectorAll(".drink-btn").forEach(h=>{h.addEventListener("click",()=>{const y=h.dataset.name,C=h.classList.contains("drink-plus")?1:-1;i[y]=Math.max(0,(i[y]||0)+C);const T=y.replace(/ /g,"_"),q=d.querySelector(`#drink-count-${T}`);q&&(q.textContent=i[y])})});function E(){d.remove(),m()}async function v(){const h=parseInt(f.value,10),y=Object.fromEntries(Object.entries(i).filter(([,T])=>T>0)),C=h!==s;try{await a(e,C?h:null,y)}catch(T){console.error("Cheat failed:",T)}E()}d.querySelector("#cheat-apply").addEventListener("click",v),d.querySelector("#cheat-close").addEventListener("click",E),(x=d.querySelector("#cheat-paper"))==null||x.addEventListener("click",()=>{E(),n()}),(S=d.querySelector("#cheat-podcast"))==null||S.addEventListener("click",()=>{E(),r()}),(L=d.querySelector("#cheat-consensus"))==null||L.addEventListener("click",()=>{E(),c()}),(_=d.querySelector("#cheat-end"))==null||_.addEventListener("click",()=>{E(),l()}),d.addEventListener("click",h=>{h.target===d&&E()})})}function mt(e,s,t={}){e.innerHTML=s.map(m=>{if(t.renderSeat)return t.renderSeat(m,Ee(m),ce(m),ke(m),Se(m));const i=Ee(m),d=Se(m);return`
      <div class="seat" id="seat-${ce(m)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${i}" alt="${de(m)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${de(d)}</div>
        </div>
        <div class="seat-name">${de(ke(m))}</div>
      </div>
    `}).join("");let a=null;function n(m){return e.querySelector(`#seat-${ce(m)}`)}function r(){clearTimeout(a),e.querySelectorAll(".seat").forEach(m=>{m.classList.remove("seat-thinking","seat-speaking")})}function l(m){var i;r(),(i=n(m))==null||i.classList.add("seat-thinking")}function c(m){r();const i=n(m);i&&(i.classList.add("seat-speaking"),a=setTimeout(()=>i.classList.remove("seat-speaking"),3e3))}return{setThinking:l,setSpeaking:c,clearAll:r}}function Ee(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Se(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function ke(e){return e.split(" ").at(-1)}function ce(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function de(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function vt(e,s,t,a,n,r){const l=r.skin??{},c=l.appName??"THE PHILOSOPHER'S BAR";e.innerHTML=`
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
  `;const m=e.querySelector("#seats-bar"),i=e.querySelector("#convo-pane"),d=e.querySelector("#sidebar"),f=e.querySelector("#left-col");let g="socratic",E=0,v=null,x=!1,S=!1,L="",_={},h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},y=.8,C=[];const T=mt(m,t,l);G(d,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const w=document.createElement("div");w.id="debate-starting",w.className="debate-starting",w.innerHTML=`<span class="debate-starting-text">${l.debateStartingText??"Opening the bar"}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,i.appendChild(w)}function q(){var w;(w=i.querySelector("#debate-starting"))==null||w.remove()}function A({type:w,data:u}){switch(w){case"speaker":q(),T.setThinking(u.name),xt(i,u.name);break;case"message":q(),D(i),u.backchannel||T.setSpeaking(u.name),ht(i,u);break;case"bars":E=u.heat??E,_t(d,u.heat,u.concession_total??0);break;case"debug":{const N=u.data!=null?u.data:"",F=typeof N=="object"?`
`+Object.entries(N).map(([X,re])=>`  ${X}: ${JSON.stringify(re)}`).join(`
`):N?` — ${N}`:"";console.log(`[${u.channel}] ${u.label}${F}`);break}case"oxford_opening_vote":h={...h,oxford_opening_vote:u},G(d,{topic:a,...h,debate_phase:L,format_roles:_});break;case"oxford_verdict":kt(i,u);break;case"phase_update":L=u.debate_phase,_=u.format_roles||{},G(d,{topic:a,...h,debate_phase:L,format_roles:_});break;case"state":D(i),g=u.moderator_style,E=u.heat??E,u.debate_phase&&(L=u.debate_phase),u.format_roles&&Object.keys(u.format_roles).length&&(_=u.format_roles),h={...u,debate_phase:L,format_roles:_},G(d,{topic:a,...h});break;case"cable_ratings":y=u.ratings??y,C=u.history??C,Tt(d,y,C);break;case"chyron":u.text&&wt(i,u.text);break;case"breaking_news":u.headline&&Et(i,u.headline);break;case"producer_whisper":St(i,u.note,u.stress);break;case"commercial_break":if(S)break;S=!0,y=u.ratings??y,i.scrollTop=i.scrollHeight,pt(u,f,l).then(N=>{S=!1,N===null?Le(i,{reason:"quit",report:{}},t,O):r.steer(s,N.text,"socratic","",{},N.producer_directive).catch(F=>Y(i,`Error: ${F.message}`))});break;case"cable_news_end":if(x)break;x=!0,v&&(v(),v=null),D(i),T.clearAll(),Le(i,u,t,O);break;case"steer_needed":if(S)break;S=!0,g=u.current_style,u.drift_topic&&bt(i,u.drift_topic,a),i.scrollTop=i.scrollHeight,dt(g,n,Nt(h),f,r.searchEvidence,t,l).then(N=>{S=!1,N===null?se(i,h,t,O,s,r):(g=N.style,G(d,{topic:a,...h,moderator_style:N.style}),r.steer(s,N.text,N.style,N.evidence||"",N.drinks||{}).catch(F=>Y(i,`Steer error: ${F.message}`)))});break;case"consensus":if(x)break;x=!0,v&&(v(),v=null),D(i),T.clearAll(),xe(i,u,{onNewTopic(N){r.newTopic(s,N).then(()=>{x=!1,h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=N,G(d,{topic:N,...h,moderator_style:g,points_of_agreement:[]}),T.clearAll(),v=r.openStream(s,A)}).catch(F=>Y(i,`Error: ${F.message}`))},onQuit:O},h,s,r,t);break;case"game_over":if(x)break;x=!0,v&&(v(),v=null),D(i),T.clearAll(),se(i,{...h,...u},t,O,s,r);break;case"bar_beat":q(),gt(i,u.text);break;case"commentator":q(),ft(i,u.text);break;case"evidence":q(),yt(i,u.finding);break;case"diagram":q(),$t(i,u);break;case"system":q(),Y(i,u.text);break;case"error":q(),Y(i,`⚠ ${u.text}`);break}}function O(){v&&v(),r.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",Te),e.querySelector("#help-btn").addEventListener("click",qe),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const u=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=u?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{x||ut(s,E,t,r.cheat,()=>pe(s,r,t),()=>Lt(s,r),()=>{x=!0,v&&(v(),v=null),D(i),T.clearAll(),se(i,h,t,O,s,r)},()=>{x=!0,v&&(v(),v=null),D(i),T.clearAll(),xe(i,{summary:"The bar has called it — the evening ends in agreement.",points:h.points_of_agreement||[]},{onNewTopic(w){r.newTopic(s,w).then(()=>{x=!1,h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=w,G(d,{topic:w,...h,moderator_style:g,points_of_agreement:[]}),T.clearAll(),v=r.openStream(s,A)}).catch(u=>Y(i,`Error: ${u.message}`))},onQuit:O},h,s,r,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(x){O();return}h.turn>0?(x=!0,v&&(v(),v=null),se(i,h,t,O,s,r)):O()}),v=r.openStream(s,A)}function ht(e,{role:s,name:t,content:a,backchannel:n,debate_label:r="",catchphrase:l=""}){const c=document.createElement("div");if(n)c.className="msg msg-bc",c.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${J(a)}</em>`;else if(s==="moderator")c.className="msg msg-moderator",c.innerHTML=`<div class="msg-mod-label">― ${p(t)} ―</div><div class="msg-content">${J(a)}</div>`;else if(s==="user")c.className="msg msg-user",c.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${J(a)}</div>`;else{const m=`/portraits/${t.replace(/ /g,"_")}.png`,i=t.split(" ").map(g=>g[0]).join("").slice(0,2).toUpperCase(),f=r.includes("Proposition")?"debate-label-prop":"debate-label-opp";c.className="msg msg-philosopher",c.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${m}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(i)}</div></div><div class="msg-body">`+(r?`<div class="msg-debate-label ${f}">${p(r)}</div>`:"")+`<div class="msg-name">${p(t)}</div><div class="msg-content">${J(a,l)}</div></div>`}P(e,c)}function gt(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=J(s),P(e,t)}function Y(e,s){const t=document.createElement("div");t.className="msg msg-system",s.endsWith("…")?t.innerHTML=p(s.slice(0,-1))+'<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>':t.textContent=s,P(e,t)}function bt(e,s,t){const a=document.createElement("div");a.className="msg msg-drift",a.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${p(s)}</div><div class="drift-orig">original: ${p(t)}</div>`,P(e,a)}function ft(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${p(s)}</span>`,P(e,t)}function yt(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,P(e,t)}function $t(e,{speaker:s,title:t,thumb_url:a,url:n,page_url:r}){const l=document.createElement("div");l.className="msg msg-diagram",l.innerHTML=`<div class="diagram-label">${p(s)} produces a diagram</div><a class="diagram-link" href="${p(r)}" target="_blank" rel="noopener"><img class="diagram-img" src="${p(a)}" alt="${p(t)}" /><div class="diagram-caption">${p(t)}</div></a>`,P(e,l)}function wt(e,s){const t=document.createElement("div");t.className="msg msg-chyron",t.textContent=s,P(e,t)}function Et(e,s){const t=document.createElement("div");t.className="msg msg-breaking-news",t.innerHTML=`<div class="breaking-label">🔴 BREAKING NEWS</div><div class="breaking-headline">${p(s)}</div>`,P(e,t)}function St(e,s,t){if(!s)return;const a=document.createElement("div");a.className="msg msg-producer-whisper";const n=t>=3?"[PRODUCER!!!]":"[PRODUCER]";a.innerHTML=`<span class="producer-tag${t>=3?" producer-tag-high":""}">${n}</span> ${p(s)}`,P(e,a)}function Le(e,{reason:s,report:t={}},a,n,r,l){D(e);const c=s==="viral",i=c?"📺 SHOW WENT VIRAL":s==="cancelled"?"📺 SHOW CANCELLED":"📺 LAST CALL",d=c?"cable-end-viral":"cable-end-cancelled",{final_ratings:f=0,peak_ratings:g=0,turn_count:E=0,breaking_news_count:v=0,network_offers:x={},catchphrases:S={},guest_stats:L={}}=t,_=Object.entries(x).length?`<div class="end-section cable-end-offers">
        <div class="end-section-label" style="color:var(--amber)">network offers</div>
        ${Object.entries(x).map(([T,q])=>`<div class="cable-offer-row">
            <span class="cable-offer-name">${p(T)}</span>
            <span class="cable-offer-text">${p(q)}</span>
          </div>`).join("")}
      </div>`:"",h=Object.keys(S).length?`<div class="end-section">
        <div class="end-section-label" style="color:var(--blue)">guest catchphrases</div>
        ${Object.entries(S).map(([T,q])=>{const O=(L[T]||{}).catchphrase_count||0;return`<div class="cable-catchphrase-row">
            <span class="cable-cp-name">${p(T)}:</span>
            <span class="cable-cp-phrase">"${p(q)}"</span>
            <span class="cable-cp-count">${O}×</span>
          </div>`}).join("")}
      </div>`:"",y=E?`<div class="end-scoreboard">
        <div class="end-stat">
          <span class="end-stat-num">${E}</span>
          <span class="end-stat-lbl">turns</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--amber)">${f.toFixed(1)}M</span>
          <span class="end-stat-lbl">final ratings</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--green)">${g.toFixed(1)}M</span>
          <span class="end-stat-lbl">peak</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num">${v}</span>
          <span class="end-stat-lbl">breaking news</span>
        </div>
      </div>`:"",C=document.createElement("div");C.className="end-panel",C.innerHTML=`
    <div class="end-title ${d}">━━━ ${i} ━━━</div>
    ${y}
    ${_}
    ${h}
    <div class="end-actions">
      <div class="end-btn-row">
        <button class="end-leave-btn" id="cable-end-leave">Leave the studio</button>
      </div>
    </div>
  `,P(e,C),C.querySelector("#cable-end-leave").addEventListener("click",n)}function kt(e,{winner:s,proposition_open:t,proposition_final:a,margin:n,persona_verdicts:r,verdict:l}){const c=s==="proposition"?"PROPOSITION WINS":"OPPOSITION WINS",m=s==="proposition"?"oxford-verdict-prop":"oxford-verdict-opp",i=a===50,d=Math.min(t,a),g=Math.max(t,a)-d,E=a>t,v=E?"var(--green)":"var(--amber)",x=(n>=0?"+":"")+n+" pts",S=`
    <div class="oxford-shift-wrap">
      <div class="oxford-shift-ends"><span>Opp 0%</span><span>Prop 100%</span></div>
      <div class="oxford-shift-track">
        <div class="oxford-shift-fill" style="left:${d}%;width:${g}%;background:${v}"></div>
        <div class="oxford-shift-mark oxford-shift-mark-open" style="left:${t}%">
          <div class="oxford-shift-pip"></div>
          <div class="oxford-shift-pip-label">${t}%</div>
        </div>
        <div class="oxford-shift-mark oxford-shift-mark-close" style="left:${a}%">
          <div class="oxford-shift-pip oxford-shift-pip-close"></div>
          <div class="oxford-shift-pip-label oxford-shift-pip-label-close">${a}%</div>
        </div>
      </div>
      <div class="oxford-shift-margin" style="color:${v}">${E?"→":"←"} ${x}</div>
    </div>
  `,L=i?'<div class="oxford-verdict-tie">The motion falls — a tie goes to the opposition.</div>':"",_=document.createElement("div");_.className="oxford-verdict-card",_.innerHTML=`
    <div class="oxford-verdict-title">── THE VERDICT ──</div>
    ${S}
    <div class="oxford-verdict-winner ${m}">${c}</div>
    ${L}
    <div class="oxford-verdict-text">${p(l)}</div>
    <ul class="oxford-verdict-personas">
      ${(r||[]).map(h=>`<li>${p(h)}</li>`).join("")}
    </ul>
  `,P(e,_)}function xe(e,{summary:s,points:t},{onNewTopic:a,onQuit:n},r={},l,c,m=[]){var f;const i=document.createElement("div");i.className="end-panel",i.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${p(s)}</blockquote>
    ${Ce(r)}
    ${Ne(t,r)}
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
  `,P(e,i);const d=i.querySelector("#consensus-topic-input");d.focus(),i.querySelector("#consensus-continue").addEventListener("click",()=>{const g=d.value.trim();g&&a(g)}),d.addEventListener("keydown",g=>{if(g.key==="Enter"){const E=d.value.trim();E&&a(E)}}),i.querySelector("#consensus-end").addEventListener("click",n),(f=i.querySelector("#consensus-paper"))==null||f.addEventListener("click",()=>pe(l,c,m))}function se(e,s,t,a,n,r){var i;D(e);const l=document.createElement("div");l.className="end-panel";const c=s.turn||0,m=c?`${c} turn${c!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${p(m)}</blockquote>
    ${Ce(s)}
    ${Ne([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${n?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,P(e,l),l.querySelector("#game-over-leave").addEventListener("click",a),(i=l.querySelector("#game-over-paper"))==null||i.addEventListener("click",()=>pe(n,r,t))}async function Lt(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(a){alert(`Podcast failed: ${a.message}`)}finally{t.remove()}}async function pe(e,s,t=[]){const a=document.createElement("div");a.className="newspaper-overlay",a.innerHTML=`
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
  `,a.querySelector("#newspaper-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",r=>{r.target===a&&a.remove()}),a.querySelector("#newspaper-download").addEventListener("click",()=>{var c,m;const r=a.querySelector(".newspaper-modal").cloneNode(!0);r.querySelectorAll("img").forEach(i=>{i.src&&!i.src.startsWith("http")&&(i.src=window.location.origin+i.getAttribute("src"))}),(c=r.querySelector("#newspaper-close"))==null||c.remove(),(m=r.querySelector("#newspaper-download"))==null||m.remove();const l=window.open("","_blank");l.document.write(`<!DOCTYPE html>
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
</head><body>${r.outerHTML}</body></html>`),l.document.close(),l.addEventListener("load",()=>{l.focus(),l.print()})})}function Ce(e){const{turn:s=0,heat:t=0,concession_total:a=0}=e;if(!s)return"";const n=Ae(t),r=Me(t);return`
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
  `}function Ne(e,s){const{partial_agreements:t=[],points_of_agreement:a=[],remaining_disagreements:n=[]}=s,r=[...new Set([...e,...a])];let l="";return r.length&&(l+=`<div class="end-section end-section-agree">
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
    </div>`),l}function xt(e,s){D(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,P(e,t)}function D(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function G(e,s){var _,h;const{topic:t,turn:a=0,heat:n=0,concession_total:r=0,moderator_style:l="socratic",partial_agreements:c=[],points_of_agreement:m=[],remaining_disagreements:i=[],debate_phase:d="",format_roles:f={},oxford_opening_vote:g=null}=s,E={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},v=d&&E[d]?`<div class="sb-phase-banner">${E[d].toUpperCase()}</div>`:"",x=d&&(f.proposition||f.opposition)?'<div class="sb-roles">'+((_=f.proposition)!=null&&_.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${f.proposition.map(y=>p(y)).join(", ")}</div>`:"")+((h=f.opposition)!=null&&h.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${f.opposition.map(y=>p(y)).join(", ")}</div>`:"")+"</div>":"",S=g?`<details class="oxford-opening-banner">
        <summary class="oxford-opening-summary">
          Opening position: <strong>${g.proposition_pct}%</strong> for proposition
        </summary>
        <div class="oxford-opening-detail">
          <div class="oxford-opening-rationale">${p(g.rationale||"")}</div>
          <ul class="oxford-opening-leanings">
            ${(g.persona_leanings||[]).map(y=>`<li>${p(y)}</li>`).join("")}
          </ul>
        </div>
      </details>`:"";let L=`
    ${v}
    ${x}
    ${S}
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;m.length&&(L+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${m.map(y=>`<div class="sb-agree-item">✓ ${p(y)}</div>`).join("")}
      </div>
    `),c.length&&(L+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${c.map(y=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(y.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(y.on)}</div>
          </div>
        `).join("")}
      </div>
    `),i.length&&(L+=`
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
    `),L+=`
    <div class="sb-section" id="sb-bars">
      ${Oe(n,r)}
    </div>

    <div class="sb-section" id="sb-cable-ratings" style="${s.cable_ratings!=null?"":"display:none"}">
      ${s.cable_ratings!=null?He(s.cable_ratings,s.cable_ratings_history||[]):""}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(l)}</div>
    </div>
  `,e.innerHTML=L}function J(e,s=""){let t=p(e);if(s){const n=p(s),r=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");t=t.replace(r,l=>`<mark class="catchphrase-hl">${l}</mark>`)}return t.replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function P(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Oe(e,s){const t=Ae(e),a=Me(e),n="█".repeat(e),r="░".repeat(10-e),l=Math.min(s,10),c=qt(s),m="█".repeat(l),i="░".repeat(10-l),d=Ct(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${n}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${c}">${m}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${c}">${d} (${s})</span>
    </div>
  `}function _t(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=Oe(s,t))}function Tt(e,s,t){const a=e.querySelector("#sb-cable-ratings");a&&(a.style.display="",a.innerHTML=He(s,t))}function He(e,s){const t=(e-.2)/3.8*100,a=Math.max(0,Math.min(100,t)).toFixed(1),n=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030",r=s.length>=2?s[s.length-1]>s[s.length-2]?"▲":s[s.length-1]<s[s.length-2]?"▼":"─":"";return`
    <div class="sb-label">── RATINGS ──</div>
    <div class="sb-ratings-num" style="color:${n}">${e.toFixed(1)}M viewers <span class="sb-trend">${r}</span></div>
    <div class="ratings-bar-track">
      <div class="ratings-bar-fill" style="width:${a}%;background:${n}"></div>
    </div>
    <div class="sb-ratings-scale"><span>cancelled</span><span>viral</span></div>
  `}function Ae(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function Me(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function qt(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Ct(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Nt(e,s){const{turn:t,heat:a,partial_agreements:n,remaining_disagreements:r,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const c=n||[],m=r||[];if(c.length&&m.length){const d=c[0],f=m[0],g=d.participants.join(" and "),E=typeof f=="object"?f.topic:String(f);return`${g} are finding common ground, but the group remains divided on ${E}.`}if(c.length){const d=c[0];return`${d.participants.join(" and ")} are converging on ${d.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(m.length){const d=m[0];return typeof d=="object"?`${d.participant_a} and ${d.participant_b} are sharply divided over ${d.topic}.`:`The room is deadlocked — ${String(d)}.`}const i=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${i}.`}const ae=document.querySelector("#app");let ne={},ue={};const Ot=new Set(["production","development","staging"]);async function Ht(){const e=Ot.has("production")?"default":"production",[s]=await Promise.all([ye(Object.assign({"./skins/default/skin.js":()=>ee(()=>import("./skin-D7HGMV-G.js"),[]),"./skins/kids/skin.js":()=>ee(()=>import("./skin-DZ74tMJe.js"),[])}),`./skins/${e}/skin.js`,4),ye(Object.assign({"./skins/default/theme.css":()=>ee(()=>Promise.resolve({}),__vite__mapDeps([0])),"./skins/kids/theme.css":()=>ee(()=>Promise.resolve({}),__vite__mapDeps([1]))}),`./skins/${e}/theme.css`,4)]);return s}async function Pe(){let e,s;try{[e,s,ne]=await Promise.all([Ye(),Qe(),Ke()])}catch(n){ae.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=!!ne.local,a=ot(ae,e,async({characters:n,topic:r,commentator:l=!0,moderator:c=!0,diagrams:m=!1,audienceLevel:i="university",philosopherLength:d="normal",commentatorLength:f="normal",moderatorLength:g="normal",debateFormat:E="",formatRoles:v=null})=>{try{const x=await Je(n,r,l,c,m,i,d,f,g,E,v);At(x.session_id,n,r,s)}catch(x){a.showError(`Could not start session: ${x.message}`)}},{isLocal:t,skin:ue})}function At(e,s,t,a){vt(ae,e,s,t,a,{skin:ue,steer:Xe,cheat:rt,deleteSession:st,newTopic:tt,openStream:it,searchEvidence:Ze,fetchNewspaper:at,exportPodcast:ne.podcast?nt:null,isLocal:!!ne.local}),ae.addEventListener("debate:quit",()=>Pe(),{once:!0})}Ht().then(e=>{ue=e}).catch(()=>{}).finally(()=>Pe());
