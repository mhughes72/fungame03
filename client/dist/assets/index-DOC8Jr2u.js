const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/theme-CJEpj9dL.css","assets/theme-ClQV55ib.css"])))=>i.map(i=>d[i]);
(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const We="modulepreload",ze=function(e){return"/"+e},we={},se=function(s,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=Promise.allSettled(t.map(g=>{if(g=ze(g),g in we)return;we[g]=!0;const r=g.endsWith(".css"),d=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${d}`))return;const y=document.createElement("link");if(y.rel=r?"stylesheet":We,r||(y.as="script"),y.crossOrigin="",y.href=g,c&&y.setAttribute("nonce",c),document.head.appendChild(y),r)return new Promise((b,E)=>{y.addEventListener("load",b),y.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${g}`)))})}))}function i(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return n.then(l=>{for(const c of l||[])c.status==="rejected"&&i(c.reason);return s().catch(i)})},$e=(e,s,t)=>{const a=e[s];return a?typeof a=="function"?a():Promise.resolve(a):new Promise((n,i)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(i.bind(null,new Error("Unknown variable dynamic import: "+s+(s.split("/").length!==t?". Note that variables only represent file names one level deep.":""))))})},B="/api";async function U(e,s){const t=await fetch(`${B}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function Ye(e){await fetch(`${B}${e}`,{method:"DELETE"})}async function Ke(e=null){const s=e?`${B}/topics?level=${encodeURIComponent(e)}`:`${B}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function Qe(){const e=await fetch(`${B}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function Je(){const e=await fetch(`${B}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function Xe(){const e=await fetch(`${B}/features`);return e.ok?e.json():{}}async function Ze(e,s,t=!0,a=!0,n=!1,i="university",l="normal",c="normal",g="normal",r="",d=null){return U("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:a,diagrams_enabled:n,audience_level:i,philosopher_length:l,commentator_length:c,moderator_length:g,debate_format:r,format_roles:d})}async function et(e,s,t,a="",n={},i=""){return U(`/sessions/${e}/steer`,{text:s,style:t,evidence:a,drinks:n,producer_directive:i})}async function tt(e){return U("/search",{query:e})}async function st(e){return U("/suggest-cast",{topic:e})}async function at(e){return U("/suggest-topic",{characters:e})}async function nt(e,s){return U(`/sessions/${e}/new-topic`,{topic:s})}async function it(e){return Ye(`/sessions/${e}`)}async function rt(e){return U(`/sessions/${e}/newspaper`,{})}async function ot(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const i=await s.json().catch(()=>({detail:s.statusText}));throw new Error(i.detail||s.statusText)}const t=await s.blob(),a=URL.createObjectURL(t),n=document.createElement("a");n.href=a,n.download="philosophers-bar-podcast.mp3",document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(a)}async function lt(e,s,t={}){const a={drinks:t};return s!==null&&(a.heat=s),U(`/sessions/${e}/cheat`,a)}function ct(e,s){const t=new EventSource(`${B}/sessions/${e}/stream`);return t.onmessage=a=>{try{const n=JSON.parse(a.data);s(n)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const Ee="https://github.com/mhughes72/fungame03";function qe(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",function n(i){i.key==="Escape"&&(a(),document.removeEventListener("keydown",n))})}function Ce(){qe("ABOUT",`
    <p class="info-lead">
      A debate simulator where 2–4 historical figures argue a topic of your choosing,
      powered by <strong>LangGraph</strong> and <strong>OpenAI</strong>.
      Three formats: open <strong>Freeform</strong>, structured <strong>Oxford</strong>, and ratings-driven <strong>Cable News</strong>.
    </p>

    <div class="info-section-label">SPEAKER SELECTION</div>
    <p>Each turn, every character is scored by keyword overlap with the most recent message — whoever is most activated by what was just said speaks next. On a tie, a selector LLM arbitrates. The debate naturally chases the argument rather than rotating mechanically. If you name a character in a steer message, they are forced to speak next regardless of scoring.</p>

    <div class="info-section-label">STEER BREAKS &amp; MODERATOR</div>
    <p>Every N×2 turns (N = participant count) the debate pauses. You can inject a message directly or let the moderator intervene. Eight moderator styles are available — Socratic, combative, devil's advocate, koan, journalist, straw man, steel man, and last call — each nudging the conversation differently. Style takes effect immediately and persists until changed.</p>

    <div class="info-section-label">CONSENSUS &amp; AGREEMENTS</div>
    <p>A <strong>gpt-4o</strong> consensus checker runs at every steer break. It detects full group agreement (ends the debate), partial alignments between subsets, open tensions with per-character attribution, and topic drift. All findings surface live in the sidebar and feed back into each character's next prompt so they are aware of forming coalitions and who to challenge.</p>

    <div class="info-section-label">HEAT &amp; CONCESSION TRACKING</div>
    <p>After every turn a structured output call scores the response: +1 for combative exchanges, −1 for genuine concessions. The <strong>heat meter</strong> (0–10) shifts accordingly — at heat 6+ characters are nudged toward pointed personal challenges; at 10 the instruction becomes a personal jab. Concessions are also counted per character and fed back into their own prompt so they build forward rather than quietly retreating.</p>

    <div class="info-section-label">CONTEXT MANAGEMENT</div>
    <p>Each candidate call receives a trimmed history: a leading summary block (if present) plus the last 6 messages. Once the full history exceeds 14 entries, older messages are compressed into a <strong>gpt-4o</strong> SystemMessage summary and each character gets a first-person debate arc recap generated in parallel. The arc replaces static citation hints in the system prompt for the rest of the debate, keeping characters coherent across long runs.</p>

    <div class="info-section-label">EVIDENCE INJECTION</div>
    <p>At any steer break you can run a live web search via <strong>Tavily</strong>. The top results are distilled by <strong>gpt-4o-mini</strong> into a single 1–2 sentence factual finding. If accepted, a styled evidence block enters the message history and every character's system prompt for that batch includes a hard instruction to engage with the finding — they may reframe, question scope, or accept it, but cannot ignore it.</p>

    <div class="info-section-label">OTHER MECHANICS</div>
    <ul class="info-list">
      <li><strong>Backchannel reactions</strong> — 50% chance per turn of a short interjection from a non-speaking character, rendered dim italic. Skipped by the next-speaker scorer.</li>
      <li><strong>Stage directions</strong> — characters are prompted to include brief <em>*[italicised asides]*</em>; the bar itself emits atmosphere beats between batches.</li>
      <li><strong>Variable length</strong> — each persona has a verbosity setting (terse / normal / expansive); very short prior messages trigger a single punchy sentence in response.</li>
      <li><strong>Suggest cast / suggest topic</strong> — both use <strong>gpt-4o-mini</strong> structured output: suggest cast scores character hot-topics against the debate topic; suggest topic finds the flashpoint a given cast will clash hardest on.</li>
    </ul>

    <div class="info-section-label">OXFORD FORMAT</div>
    <p>Characters are pre-assigned to Proposition or Opposition and must argue their side. A <strong>gpt-4o-mini</strong> call generates opening leanings for five audience personas before debate begins. The same call runs at the end to produce a final vote; the shift bar shows how much ground each side gained. A tie goes to the opposition.</p>

    <div class="info-section-label">CABLE NEWS FORMAT</div>
    <p>A ratings-driven TV panel. Ratings (0.2M–4.0M) update after every turn based on response length, punctuation, catchphrase deployment, concessions, and a 5% mean-reversion nudge toward 2.0M. The Host is a separate LLM persona that reads call-in questions and reacts to producer directives during commercial breaks. Each guest gets a character-aware catchphrase generated at session start; usage is tracked and highlighted in the transcript. Chyrons (sensationalist misrepresentations of the last speaker) fire at 50% chance per turn. A producer stress level (0–5) rises when ratings stagnate or fall, escalating the urgency of break-time notes.</p>

    <div class="info-section-label">MODELS</div>
    <ul class="info-list">
      <li><strong>gpt-4o</strong> — consensus checker, history summariser</li>
      <li><strong>gpt-4o-mini</strong> — all philosopher turns, moderator steer, selector, heat scoring, backchannels, character arc summaries, Oxford votes, cable news host, catchphrase generation, evidence distillation, suggest cast / suggest topic</li>
    </ul>

    <div class="info-section-label">SOURCE</div>
    <p><a class="info-link" href="${Ee}" target="_blank" rel="noopener">${Ee}</a></p>
  `)}function Ne(){qe("HOW TO PLAY",`
    <div class="info-section-label">SETUP</div>
    <p>Choose a <strong>format</strong> (Freeform, Oxford, or Cable News), pick 2–4 historical figures, and enter a topic. The more specific the topic, the sharper the debate. Press Enter or click <em>Open the bar</em> to start.</p>
    <ul class="info-list">
      <li><strong>Suggest cast ✦</strong> — type a topic first, then let AI pick the best cast for it.</li>
      <li><strong>Suggest topic ✦</strong> — select characters first, then let AI find the topic they'll clash hardest on.</li>
      <li><strong>Suggested debate</strong> — browse curated and AI-generated debate cards. One click launches the full setup. Use <em>Advanced</em> to filter by audience level.</li>
    </ul>

    <div class="info-section-label">WATCHING THE DEBATE</div>
    <p>Characters speak based on who is most activated by the last message — whoever has the strongest keyword overlap goes next. The seating chart shows who is thinking (pulsing ring) and who is speaking (solid glow). Open the <strong>Stats</strong> sidebar to track agreements forming, tensions holding, heat, and concessions in real time.</p>

    <div class="info-section-label">STEER BREAKS</div>
    <p>Every several turns the debate pauses and the steer panel slides up. You have three options:</p>
    <ul class="info-list">
      <li><strong>Type a message</strong> — injected directly as a human voice. Characters will respond to it.</li>
      <li><strong>Leave it blank</strong> — the moderator intervenes using the current style.</li>
      <li><strong>Pick a moderator style</strong> — eight approaches, from Socratic bridge-building to combative contradiction-hunting. Hover any icon to read what it does.</li>
    </ul>
    <p>To force a specific character to respond next, include their name in your message. They will take the floor regardless of keyword scoring.</p>

    <div class="info-section-label">EVIDENCE INJECTION</div>
    <p>In the steer panel, click <strong>⚡ Evidence</strong> to run a live web search. The result is distilled to a single factual finding. If you accept it, it is inserted into the debate as a system fact — every character must engage with it directly. They can reframe it, question its scope, or accept it, but they cannot ignore it.</p>

    <div class="info-section-label">HEAT &amp; CONCESSIONS</div>
    <p>The <strong>heat meter</strong> (0–10) rises on combative exchanges and falls when someone concedes a point. At heat 6+ characters are nudged toward personal shots; at 10 (flashpoint) the gloves are off. The <strong>concessions bar</strong> tracks how often the group has granted each other points — a high count means the debate is evolving.</p>

    <div class="info-section-label">TOPIC DRIFT</div>
    <p>If the consensus checker detects the conversation has wandered from the original topic, a drift notice appears before the steer panel. You can steer back or follow the new thread.</p>

    <div class="info-section-label">OXFORD FORMAT</div>
    <p>Characters are pre-assigned to <strong>Proposition</strong> or <strong>Opposition</strong> and must argue their assigned side. An opening vote gauges where the audience stands before debate begins. At the end, a final vote determines whether the motion carried — a tie goes to the opposition.</p>

    <div class="info-section-label">CABLE NEWS FORMAT</div>
    <p>Guests compete for ratings on a live TV panel. At every <strong>commercial break</strong> you see current viewership and can take two actions:</p>
    <ul class="info-list">
      <li><strong>Call-in question</strong> — typed question read on air by the Host, directed to a specific guest.</li>
      <li><strong>Producer directive</strong> — one of five instructions (get them fighting, force a soundbite, push the narrative, wrap it up, go soft). Click one to submit immediately.</li>
    </ul>
    <p>The <strong>Producer</strong> gets increasingly stressed as ratings fall — watch for the stress escalation in the break header. Each guest has a catchphrase they deploy mid-debate; usage is tracked in the end-of-show report.</p>

    <div class="info-section-label">ENDING THE DEBATE</div>
    <p>The debate ends when all participants reach full consensus, or when you quit via the header or steer panel. You'll get a closing report: turn count, final heat, all agreements reached, partial alignments, and tensions still unresolved. In Cable News, the report includes ratings, network offers, and catchphrase tallies. In Oxford, the final vote verdict is displayed with a shift bar showing how much ground each side gained.</p>
  `)}function dt(e,s,t,{isLocal:a=!1,skin:n={}}={}){const i=n.appName??"THE PHILOSOPHER'S BAR",l=n.setupSub??"Select 2–4 thinkers for tonight's debate",c=n.charFilterPlaceholder??"Filter thinkers…",g=n.topicLabel??"What should they discuss?",r=n.topicPlaceholder??"What is the nature of justice?",d=n.startLabel??"Open the bar ▶";n.orLabel;const y=n.dotdLoadingText??"generating tonight's debate…";e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box">
        <h1 class="setup-title">${i}</h1>
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
          <div class="dotd-loading">${H(y)}</div>
        </div>

        <div class="setup-or">── or build your own ──</div>

        <input
          id="char-filter"
          class="char-filter-input"
          type="text"
          placeholder="${H(c)}"
          autocomplete="off"
          spellcheck="false"
        />

        <div class="char-list" id="char-list">
          ${(()=>{const o=["Philosophy","Science","Politics","Arts","Literature","Technology","Media","Psychology","Religion"],m={};for(const f of s){const L=f.category||"Other";(m[L]=m[L]||[]).push(f)}return o.filter(f=>m[f]).map(f=>`
              <div class="char-category-group">
                <div class="char-category-label">${H(f)}</div>
                <div class="char-category-cards">
                  ${m[f].map(L=>{const A=L.name.replace(/ /g,"_"),R=L.name.split(" ").map(de=>de[0]).join("").slice(0,2).toUpperCase();return`<label class="char-card"
                        data-name="${L.name.toLowerCase()}"
                        data-desc="${H(L.known_for)}"
                        data-category="${H(f)}">
                        <input type="checkbox" value="${H(L.name)}" />
                        <div class="char-card-img">
                          <img src="/portraits/${A}.png" alt=""
                            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
                          <div class="char-card-initials" style="display:none">${H(R)}</div>
                        </div>
                        <div class="char-card-name">${H(L.name)}</div>
                      </label>`}).join("")}
                </div>
              </div>`).join("")})()}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">${g}</label>
        <div class="topic-row">
          <input
            id="topic-input"
            class="topic-input"
            type="text"
            placeholder="${H(r)}"
            maxlength="500"
            autocomplete="off"
          />
          <button class="suggest-btn" id="suggest-btn" title="Let AI pick the best characters for this topic">Suggest cast ✦</button>
          <button class="suggest-btn" id="suggest-topic-btn" title="Let AI suggest a topic for your selected cast" disabled>Suggest topic ✦</button>
        </div>
        <div class="topic-suggestion" id="topic-suggestion" style="display:none"></div>
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

        <button class="start-btn" id="start-btn" disabled>${H(d)}</button>
        <p class="setup-error" id="setup-error"></p>

        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `;const b=e.querySelectorAll("#char-list input[type=checkbox]"),E=e.querySelectorAll(".char-card"),h=e.querySelector("#char-no-results"),x=e.querySelector("#char-filter");x.addEventListener("input",()=>{const o=x.value.toLowerCase().trim();let m=0;E.forEach(f=>{const L=!o||f.dataset.name.includes(o);f.style.display=L?"":"none",L&&m++}),e.querySelectorAll(".char-category-group").forEach(f=>{const L=[...f.querySelectorAll(".char-card")].some(A=>A.style.display!=="none");f.style.display=L?"":"none"}),h.style.display=m===0?"":"none"});const S=document.createElement("div");S.className="char-tooltip",S.style.display="none",document.body.appendChild(S);function k(o){const{desc:m,category:f}=o.currentTarget.dataset;m&&(S.innerHTML=`
      <div class="tt-body">
        ${f?`<span class="tt-category">${H(f)}</span>`:""}
        <span class="tt-desc">${H(m)}</span>
      </div>`,S.style.display="block",_(o))}function _(o){const f=S.offsetWidth,L=S.offsetHeight;let A=o.clientX+14,R=o.clientY+14;A+f>window.innerWidth-14&&(A=o.clientX-f-14),R+L>window.innerHeight-14&&(R=o.clientY-L-14),S.style.left=A+"px",S.style.top=R+"px"}function v(){S.style.display="none"}E.forEach(o=>{o.addEventListener("mouseenter",k),o.addEventListener("mousemove",_),o.addEventListener("mouseleave",v)}),e.querySelectorAll(".format-opt").forEach(o=>{o.addEventListener("mouseenter",k),o.addEventListener("mousemove",_),o.addEventListener("mouseleave",v)});const w=new MutationObserver(()=>{document.body.contains(e)||(S.remove(),w.disconnect())});w.observe(document.body,{childList:!0,subtree:!0}),a&&(e.querySelector("#setup-lengths").style.display="");const C=e.querySelector("#advanced-toggle"),T=e.querySelector("#advanced-panel");let q=!1;C.addEventListener("click",()=>{q=!q,T.style.display=q?"block":"none",C.textContent=q?"Advanced ▴":"Advanced ▾"});const M=e.querySelector("#selection-hint"),O=e.querySelector("#start-btn"),$=e.querySelector("#setup-error");function u(){const o=[...b].filter(f=>f.checked).length;e.querySelector("#char-list").classList.toggle("char-list--maxed",o>=4),o<2?(M.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",M.classList.remove("hint-ok","hint-warn")):o>4?(M.textContent=`Too many — deselect ${o-4}`,M.classList.add("hint-warn"),M.classList.remove("hint-ok")):(M.textContent=`${o} selected`,M.classList.add("hint-ok"),M.classList.remove("hint-warn")),O.disabled=o<2||o>4;const m=e.querySelector("#suggest-topic-btn");m&&(m.disabled=o<2||o>4)}const N=e.querySelector("#char-list"),F=e.querySelector("#char-filter"),Q=e.querySelector("#topic-input"),oe=e.querySelector(".setup-or"),je=e.querySelector(".topic-label"),De=e.querySelector(".topic-row"),Fe=e.querySelector("#cast-suggestion");function Be(o){[oe,F,N,M,je,De].forEach(m=>{m.style.display=o?"none":""}),o&&(Fe.style.display="none"),o?O.disabled=!0:u()}u();const J=e.querySelector("#suggest-btn"),W=e.querySelector("#cast-suggestion");let le=!1;J.addEventListener("click",async()=>{const o=Q.value.trim();if(!o){Q.focus();return}J.disabled=!0,J.textContent="thinking…",W.innerHTML='<div class="cs-loading">selecting the best minds for this topic…</div>',W.style.display="";try{const{picks:m}=await st(o);if(!m||!m.length)return;b.forEach(L=>{L.checked=!1}),m.forEach(({name:L})=>{const A=e.querySelector(`#char-list input[value="${CSS.escape(L)}"]`);A&&(A.checked=!0)}),le=!0,u(),W.innerHTML='<div class="cs-header">── suggested cast ──</div>'+m.map(L=>`<div class="cs-pick">
            <span class="cs-name">${H(L.name)}</span>
            <span class="cs-reason">${H(L.reason)}</span>
          </div>`).join(""),W.style.display="";const f=e.querySelector(`.char-card[data-name="${m[0].name.toLowerCase()}"]`);f&&f.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(m){console.error("suggest cast failed",m),W.style.display="none"}finally{J.disabled=!1,J.textContent="Suggest cast ✦"}});const X=e.querySelector("#suggest-topic-btn"),z=e.querySelector("#topic-suggestion");X.addEventListener("click",async()=>{const o=[...b].filter(m=>m.checked).map(m=>m.value);if(!(o.length<2)){X.disabled=!0,X.textContent="thinking…",z.innerHTML='<div class="cs-loading">finding the perfect flashpoint…</div>',z.style.display="";try{const{topic:m,reason:f}=await at(o);if(!m)return;Q.value=m,z.innerHTML=`<div class="cs-header">── suggested topic ──</div><div class="cs-pick">
          <span class="cs-name">${H(m)}</span>
          <span class="cs-reason">${H(f)}</span>
        </div>`,z.style.display=""}catch(m){console.error("suggest topic failed",m),z.style.display="none"}finally{X.disabled=!1,X.textContent="Suggest topic ✦"}}}),b.forEach(o=>o.addEventListener("change",()=>{le&&(W.style.display="none",le=!1),z.style.display="none",u()}));function ve(){const o=e.querySelector('input[name="audience"]:checked'),m=e.querySelector('input[name="phil-length"]:checked'),f=e.querySelector('input[name="comm-length"]:checked'),L=e.querySelector('input[name="mod-length"]:checked'),A=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:o?o.value:"university",philosopherLength:m?m.value:"normal",commentatorLength:f?f.value:"normal",moderatorLength:L?L.value:"normal",debateFormat:A?A.value:""}}O.addEventListener("click",()=>{const o=[...b].filter(f=>f.checked).map(f=>f.value),m=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";$.textContent="",t({characters:o,topic:m,...ve()})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!O.disabled&&O.click()}),e.querySelector("#setup-about").addEventListener("click",Ce),e.querySelector("#setup-help").addEventListener("click",Ne);const G=e.querySelector("#dotd-card"),Ue={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let me=[],Y=[],j=-1;function fe(){const o=e.querySelector('input[name="audience"]:checked');return o?o.value:"university"}function Ge(){const o=e.querySelector('input[name="debate-format"]:checked');return o?o.value:""}function be(o){const m=Ge();return me.filter(f=>(m==="oxford"?f.format==="oxford":m==="cable_news"?f.format==="cable_news":f.format!=="oxford"&&f.format!=="cable_news")&&(m==="cable_news"||f.audience_level===o))}function ye(o,m=null){if(!o.length)return null;const f=m?o.filter(R=>R.id!==m.id):o,L=f.length?f:o,A=[];for(const R of L)A.push(R),R.source==="curated"&&(A.push(R),A.push(R));return A[Math.floor(Math.random()*A.length)]}function te(o){const m=Ue[o.category]||"var(--text-dim)",f=o.format==="oxford",L=o.format==="cable_news";G.classList.toggle("dotd-card--cable",L);const A=f?'<span class="dotd-oxford">🎓 Oxford</span>':L?"":'<span class="dotd-freeform">Freeform</span>',R=f?"":o.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',de=o.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${o.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${o.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${o.characters.join(" · ")}</div>`,Ve=L?`
      <div class="cable-dotd-bar">
        <span class="cable-dotd-live"><span class="cable-dotd-dot"></span>LIVE</span>
        <span class="cable-dotd-breaking">BREAKING NOW</span>
        <span class="cable-dotd-channel">📺 DEBATE ZONE</span>
      </div>`:"";G.innerHTML=`
      ${Ve}
      <div class="dotd-header">
        <span class="dotd-label">${L?"TONIGHT'S SHOWDOWN":"── SUGGESTED DEBATE ──"}</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${m}">${o.category.toUpperCase()}</span>
          ${A}
          ${R}
        </span>
      </div>
      ${de}
      <div class="dotd-topic">${H(o.topic)}</div>
      <div class="dotd-tagline">${H(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-prev" ${j<=0?"disabled":""}>← Prev</button>
        <button class="dotd-start-btn" id="dotd-start">${L?"🔴 GO LIVE ▶":"Start this debate ▶"}</button>
        <button class="dotd-new-btn" id="dotd-next">Next →</button>
      </div>
    `,G.querySelector("#dotd-start").addEventListener("click",()=>{const Z=f?"oxford":L?"cable_news":"";t({characters:o.characters,topic:o.topic,...ve(),debateFormat:Z,formatRoles:o.roles||null})}),G.querySelector("#dotd-prev").addEventListener("click",()=>{j>0&&(j--,te(Y[j]))}),G.querySelector("#dotd-next").addEventListener("click",()=>{if(j<Y.length-1)j++,te(Y[j]);else{const Z=ye(be(fe()),Y[j]);Z&&(Y.push(Z),j++,te(Z))}})}function ce(){const o=ye(be(fe()));o?(Y=[o],j=0,te(o)):G.style.display="none"}return Ke().then(o=>{me=o,ce()}).catch(()=>{G.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(o=>{o.addEventListener("change",ce)}),e.querySelectorAll('input[name="debate-format"]').forEach(o=>{o.addEventListener("change",()=>{var f;const m=((f=e.querySelector('input[name="debate-format"]:checked'))==null?void 0:f.value)||"";Be(m==="oxford"||m==="cable_news"),ce()})}),{showError(o){$.textContent=o}}}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function I(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function pt(e){const s=(e-.2)/3.8*100,t=Math.max(0,Math.min(100,s)).toFixed(1),a=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030";return`<div class="ratings-bar-track"><div class="ratings-bar-fill" style="width:${t}%;background:${a}"></div></div>`}const ut={get_them_fighting:"🥊",force_soundbite:"💬",push_narrative:"📢",wrap_it_up:"⏱️",go_soft:"🕊️"},gt={get_them_fighting:"fight",force_soundbite:"soundbite",push_narrative:"narrative",wrap_it_up:"wrap up",go_soft:"go soft"},ht={socratic:"💭",combative:"⚔️","devil's advocate":"😈",koan:"☯️",journalist:"🎤","straw man":"🪆","steel man":"🛡️","last call":"🔔"};function vt(e,s,t="",a,n=null,i=[],l={}){const c=l.moderatorStyleNames??{},g=l.steerTitle??"── STEER THE DEBATE ──",r=l.steerQuitLabel??"Quit game",d=l.steerInputPlaceholder??"Speak into the debate — or leave blank for the moderator…",y=l.steerSubmitLabel??"Steer ▶",b=l.evidencePlaceholder??"Search term — result will be injected as empirical fact…";return new Promise(E=>{const h=document.createElement("div");h.className="steer-drawer",h.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">${g}</div>
        <button class="steer-quit-btn" id="steer-quit">${I(r)}</button>
      </div>

      ${t?`<div class="steer-summary">${I(t)}</div>`:""}

      <div class="steer-input-row">
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="${I(d)}"
          autocomplete="off"
        />
        <button class="steer-submit-btn" id="steer-submit">${I(y)}</button>
      </div>

      <div class="style-grid" id="style-grid">
        ${s.map($=>{const u=ht[$.style]??"◆",N=c[$.style]??$.style;return`<button
            class="style-icon-btn${$.style===e?" style-selected":""}"
            data-style="${I($.style)}"
            title="${I(N+" — "+$.description)}"
          >
            <span class="style-icon-glyph">${u}</span>
            <span class="style-icon-name">${I(N)}</span>
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
            placeholder="${I(b)}"
            autocomplete="off"
          />
          <button class="steer-search-btn" id="evidence-search">Search</button>
        </div>
        <div id="evidence-preview" class="evidence-preview" style="display:none"></div>
      </div>
    `,(a||document.body).appendChild(h);const S=h.querySelector("#steer-text-input");S.focus();let k=e,_="";h.querySelectorAll(".style-icon-btn").forEach($=>{$.addEventListener("click",()=>{h.querySelectorAll(".style-icon-btn").forEach(u=>u.classList.remove("style-selected")),$.classList.add("style-selected"),k=$.dataset.style,O()})});const v=h.querySelector("#evidence-toggle"),w=h.querySelector("#evidence-panel"),C=h.querySelector("#evidence-preview"),T=h.querySelector("#evidence-query"),q=h.querySelector("#evidence-search");v.addEventListener("click",()=>{const $=w.style.display==="none";w.style.display=$?"":"none",v.classList.toggle("steer-pill--active",$),$&&T.focus()});async function M(){const $=T.value.trim();if(!(!$||!n)){q.disabled=!0,q.textContent="Searching…",C.style.display="none",_="";try{const u=await n($);_=u.finding,C.style.display="block",C.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${I(u.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,C.querySelector("#evidence-accept").addEventListener("click",()=>{C.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${I(_)}</div>`}),C.querySelector("#evidence-discard").addEventListener("click",()=>{_="",C.style.display="none"})}catch(u){C.style.display="block",C.textContent=`Search failed: ${u.message}`}finally{q.disabled=!1,q.textContent="Search"}}}q.addEventListener("click",M),T.addEventListener("keydown",$=>{$.key==="Enter"&&M()});function O(){h.remove(),E({text:S.value.trim(),style:k,evidence:_})}h.querySelector("#steer-submit").addEventListener("click",O),h.querySelector("#steer-quit").addEventListener("click",()=>{h.remove(),E(null)}),S.addEventListener("keydown",$=>{$.key==="Enter"&&O()})})}function mt(e,s,t={}){const{ratings:a=.8,peak_ratings:n=.8,producer_note:i="",producer_stress:l=0,directives:c=[]}=e,g=["","nervous","stressed","PANICKING","MELTDOWN","FIRE FIRE FIRE"],r=l>0?` (${g[Math.min(l,5)]})`:"",d=l>=3;return new Promise(y=>{const b=document.createElement("div");b.className="steer-drawer",b.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── COMMERCIAL BREAK ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      <div class="commercial-ratings-row">
        <span class="commercial-ratings-num">📺 ${a.toFixed(1)}M</span>
        <span class="commercial-ratings-peak">peak ${n.toFixed(1)}M</span>
        ${pt(a)}
      </div>

      ${i?`
        <div class="commercial-producer-note${d?" commercial-producer-high":""}">
          <span class="producer-tag">[PRODUCER${r}]</span> ${I(i)}
        </div>
      `:""}

      <div class="steer-input-row">
        <input class="steer-text-input" id="steer-text-input" type="text"
               placeholder="📞 Call-in question — or press Enter to let The Host decide…"
               autocomplete="off" />
        <button class="steer-submit-btn" id="steer-submit">On air ▶</button>
      </div>

      <div class="steer-or">── producer directive ──</div>

      <div class="style-grid" id="directive-list">
        ${c.map(([k,_])=>{const v=ut[k]??"◆",w=gt[k]??k.replace(/_/g," ");return`<button
            class="style-icon-btn"
            data-directive="${I(k)}"
            title="${I(w+" — "+_)}"
          >
            <span class="style-icon-glyph">${v}</span>
            <span class="style-icon-name">${I(w)}</span>
          </button>`}).join("")}
      </div>
    `,(s||document.body).appendChild(b);const h=b.querySelector("#steer-text-input");h.focus();let x="";b.querySelectorAll("#directive-list .style-icon-btn").forEach(k=>{k.addEventListener("click",()=>{b.querySelectorAll("#directive-list .style-icon-btn").forEach(_=>_.classList.remove("style-selected")),k.classList.add("style-selected"),x=k.dataset.directive,S()})});function S(){const k=h.value.trim();b.remove(),y({text:k,producer_directive:x})}b.querySelector("#steer-submit").addEventListener("click",S),b.querySelector("#steer-quit").addEventListener("click",()=>{b.remove(),y(null)}),h.addEventListener("keydown",k=>{k.key==="Enter"&&S()})})}function ae(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const ke=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function ft(e,s,t,a,n=null,i=null,l=null,c=null){return new Promise(g=>{var x,S,k,_;const r={};t.forEach(v=>{r[v]=0});const d=document.createElement("div");d.className="cheat-overlay",d.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${ke[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(v=>`
            <div class="drink-row">
              <span class="drink-name">${ae(v)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${ae(v)}">−</button>
                <span class="drink-count" id="drink-count-${ae(v.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${ae(v)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        ${n||i?`
        <div class="cheat-utils-row">
          ${n?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          ${i?'<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>':""}
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
    `,document.body.appendChild(d);const y=d.querySelector("#cheat-heat-slider"),b=d.querySelector("#cheat-heat-value");y.addEventListener("input",()=>{const v=parseInt(y.value,10);b.textContent=`${v} — ${ke[v]}`}),d.querySelectorAll(".drink-btn").forEach(v=>{v.addEventListener("click",()=>{const w=v.dataset.name,C=v.classList.contains("drink-plus")?1:-1;r[w]=Math.max(0,(r[w]||0)+C);const T=w.replace(/ /g,"_"),q=d.querySelector(`#drink-count-${T}`);q&&(q.textContent=r[w])})});function E(){d.remove(),g()}async function h(){const v=parseInt(y.value,10),w=Object.fromEntries(Object.entries(r).filter(([,T])=>T>0)),C=v!==s;try{await a(e,C?v:null,w)}catch(T){console.error("Cheat failed:",T)}E()}d.querySelector("#cheat-apply").addEventListener("click",h),d.querySelector("#cheat-close").addEventListener("click",E),(x=d.querySelector("#cheat-paper"))==null||x.addEventListener("click",()=>{E(),n()}),(S=d.querySelector("#cheat-podcast"))==null||S.addEventListener("click",()=>{E(),i()}),(k=d.querySelector("#cheat-consensus"))==null||k.addEventListener("click",()=>{E(),c()}),(_=d.querySelector("#cheat-end"))==null||_.addEventListener("click",()=>{E(),l()}),d.addEventListener("click",v=>{v.target===d&&E()})})}function bt(e,s,t={}){e.innerHTML=s.map(g=>{if(t.renderSeat)return t.renderSeat(g,Se(g),pe(g),xe(g),Le(g));const r=Se(g),d=Le(g);return`
      <div class="seat" id="seat-${pe(g)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${r}" alt="${ue(g)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${ue(d)}</div>
        </div>
        <div class="seat-name">${ue(xe(g))}</div>
      </div>
    `}).join("");let a=null;function n(g){return e.querySelector(`#seat-${pe(g)}`)}function i(){clearTimeout(a),e.querySelectorAll(".seat").forEach(g=>{g.classList.remove("seat-thinking","seat-speaking")})}function l(g){var r;i(),(r=n(g))==null||r.classList.add("seat-thinking")}function c(g){i();const r=n(g);r&&(r.classList.add("seat-speaking"),a=setTimeout(()=>r.classList.remove("seat-speaking"),3e3))}return{setThinking:l,setSpeaking:c,clearAll:i}}function Se(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Le(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function xe(e){return e.split(" ").at(-1)}function pe(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function ue(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function yt(e,s,t,a,n,i){const l=i.skin??{},c=l.appName??"THE PHILOSOPHER'S BAR";e.innerHTML=`
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
  `;const g=e.querySelector("#seats-bar"),r=e.querySelector("#convo-pane"),d=e.querySelector("#sidebar"),y=e.querySelector("#left-col");let b="socratic",E=0,h=null,x=!1,S=!1,k="",_={},v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},w=.8,C=[];const T=bt(g,t,l);V(d,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const $=document.createElement("div");$.id="debate-starting",$.className="debate-starting",$.innerHTML=`<span class="debate-starting-text">${l.debateStartingText??"Opening the bar"}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,r.appendChild($)}function q(){var $;($=r.querySelector("#debate-starting"))==null||$.remove()}function M({type:$,data:u}){switch($){case"speaker":q(),T.setThinking(u.name),Nt(r,u.name);break;case"message":q(),D(r),u.backchannel||T.setSpeaking(u.name),wt(r,u);break;case"bars":E=u.heat??E,Ot(d,u.heat,u.concession_total??0);break;case"debug":{const N=u.data!=null?u.data:"",F=typeof N=="object"?`
`+Object.entries(N).map(([Q,oe])=>`  ${Q}: ${JSON.stringify(oe)}`).join(`
`):N?` — ${N}`:"";console.log(`[${u.channel}] ${u.label}${F}`);break}case"oxford_opening_vote":v={...v,oxford_opening_vote:u},V(d,{topic:a,...v,debate_phase:k,format_roles:_});break;case"oxford_verdict":qt(r,u);break;case"phase_update":k=u.debate_phase,_=u.format_roles||{},V(d,{topic:a,...v,debate_phase:k,format_roles:_});break;case"state":D(r),b=u.moderator_style,E=u.heat??E,u.debate_phase&&(k=u.debate_phase),u.format_roles&&Object.keys(u.format_roles).length&&(_=u.format_roles),v={...u,debate_phase:k,format_roles:_},V(d,{topic:a,...v});break;case"cable_ratings":w=u.ratings??w,C=u.history??C,At(d,w,C);break;case"chyron":u.text&&xt(r,u.text);break;case"breaking_news":u.headline&&_t(r,u.headline);break;case"producer_whisper":Tt(r,u.note,u.stress);break;case"commercial_break":if(S)break;S=!0,w=u.ratings??w,r.scrollTop=r.scrollHeight,mt(u,y,l).then(N=>{S=!1,N===null?_e(r,{reason:"quit",report:{}},t,O):i.steer(s,N.text,"socratic","",{},N.producer_directive).catch(F=>K(r,`Error: ${F.message}`))});break;case"cable_news_end":if(x)break;x=!0,h&&(h(),h=null),D(r),T.clearAll(),_e(r,u,t,O);break;case"steer_needed":if(S)break;S=!0,b=u.current_style,u.drift_topic&&Et(r,u.drift_topic,a),r.scrollTop=r.scrollHeight,vt(b,n,Pt(v),y,i.searchEvidence,t,l).then(N=>{S=!1,N===null?ne(r,v,t,O,s,i):(b=N.style,V(d,{topic:a,...v,moderator_style:N.style}),i.steer(s,N.text,N.style,N.evidence||"",N.drinks||{}).catch(F=>K(r,`Steer error: ${F.message}`)))});break;case"consensus":if(x)break;x=!0,h&&(h(),h=null),D(r),T.clearAll(),Te(r,u,{onNewTopic(N){i.newTopic(s,N).then(()=>{x=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=N,V(d,{topic:N,...v,moderator_style:b,points_of_agreement:[]}),T.clearAll(),h=i.openStream(s,M)}).catch(F=>K(r,`Error: ${F.message}`))},onQuit:O},v,s,i,t);break;case"game_over":if(x)break;x=!0,h&&(h(),h=null),D(r),T.clearAll(),ne(r,{...v,...u},t,O,s,i);break;case"bar_beat":q(),$t(r,u.text);break;case"commentator":q(),kt(r,u.text);break;case"evidence":q(),St(r,u.finding);break;case"diagram":q(),Lt(r,u);break;case"system":q(),K(r,u.text);break;case"error":q(),K(r,`⚠ ${u.text}`);break}}function O(){h&&h(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",Ce),e.querySelector("#help-btn").addEventListener("click",Ne),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const u=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=u?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{x||ft(s,E,t,i.cheat,()=>ge(s,i,t),()=>Ct(s,i),()=>{x=!0,h&&(h(),h=null),D(r),T.clearAll(),ne(r,v,t,O,s,i)},()=>{x=!0,h&&(h(),h=null),D(r),T.clearAll(),Te(r,{summary:"The bar has called it — the evening ends in agreement.",points:v.points_of_agreement||[]},{onNewTopic($){i.newTopic(s,$).then(()=>{x=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=$,V(d,{topic:$,...v,moderator_style:b,points_of_agreement:[]}),T.clearAll(),h=i.openStream(s,M)}).catch(u=>K(r,`Error: ${u.message}`))},onQuit:O},v,s,i,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(x){O();return}v.turn>0?(x=!0,h&&(h(),h=null),ne(r,v,t,O,s,i)):O()}),h=i.openStream(s,M)}function wt(e,{role:s,name:t,content:a,backchannel:n,debate_label:i="",catchphrase:l=""}){const c=document.createElement("div");if(n)c.className="msg msg-bc",c.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${ee(a)}</em>`;else if(s==="moderator")c.className="msg msg-moderator",c.innerHTML=`<div class="msg-mod-label">― ${p(t)} ―</div><div class="msg-content">${ee(a)}</div>`;else if(s==="user")c.className="msg msg-user",c.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${ee(a)}</div>`;else{const g=`/portraits/${t.replace(/ /g,"_")}.png`,r=t.split(" ").map(b=>b[0]).join("").slice(0,2).toUpperCase(),y=i.includes("Proposition")?"debate-label-prop":"debate-label-opp";c.className="msg msg-philosopher",c.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${g}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(r)}</div></div><div class="msg-body">`+(i?`<div class="msg-debate-label ${y}">${p(i)}</div>`:"")+`<div class="msg-name">${p(t)}</div><div class="msg-content">${ee(a,l)}</div></div>`}P(e,c)}function $t(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=ee(s),P(e,t)}function K(e,s){const t=document.createElement("div");t.className="msg msg-system",s.endsWith("…")?t.innerHTML=p(s.slice(0,-1))+'<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>':t.textContent=s,P(e,t)}function Et(e,s,t){const a=document.createElement("div");a.className="msg msg-drift",a.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${p(s)}</div><div class="drift-orig">original: ${p(t)}</div>`,P(e,a)}function kt(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${p(s)}</span>`,P(e,t)}function St(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,P(e,t)}function Lt(e,{speaker:s,title:t,thumb_url:a,url:n,page_url:i}){const l=document.createElement("div");l.className="msg msg-diagram",l.innerHTML=`<div class="diagram-label">${p(s)} produces a diagram</div><a class="diagram-link" href="${p(i)}" target="_blank" rel="noopener"><img class="diagram-img" src="${p(a)}" alt="${p(t)}" /><div class="diagram-caption">${p(t)}</div></a>`,P(e,l)}function xt(e,s){const t=document.createElement("div");t.className="msg msg-chyron",t.textContent=s,P(e,t)}function _t(e,s){const t=document.createElement("div");t.className="msg msg-breaking-news",t.innerHTML=`<div class="breaking-label">🔴 BREAKING NEWS</div><div class="breaking-headline">${p(s)}</div>`,P(e,t)}function Tt(e,s,t){if(!s)return;const a=document.createElement("div");a.className="msg msg-producer-whisper";const n=t>=3?"[PRODUCER!!!]":"[PRODUCER]";a.innerHTML=`<span class="producer-tag${t>=3?" producer-tag-high":""}">${n}</span> ${p(s)}`,P(e,a)}function _e(e,{reason:s,report:t={}},a,n,i,l){D(e);const c=s==="viral",r=c?"📺 SHOW WENT VIRAL":s==="cancelled"?"📺 SHOW CANCELLED":"📺 LAST CALL",d=c?"cable-end-viral":"cable-end-cancelled",{final_ratings:y=0,peak_ratings:b=0,turn_count:E=0,breaking_news_count:h=0,network_offers:x={},catchphrases:S={},guest_stats:k={}}=t,_=Object.entries(x).length?`<div class="end-section cable-end-offers">
        <div class="end-section-label" style="color:var(--amber)">network offers</div>
        ${Object.entries(x).map(([T,q])=>`<div class="cable-offer-row">
            <span class="cable-offer-name">${p(T)}</span>
            <span class="cable-offer-text">${p(q)}</span>
          </div>`).join("")}
      </div>`:"",v=Object.keys(S).length?`<div class="end-section">
        <div class="end-section-label" style="color:var(--blue)">guest catchphrases</div>
        ${Object.entries(S).map(([T,q])=>{const O=(k[T]||{}).catchphrase_count||0;return`<div class="cable-catchphrase-row">
            <span class="cable-cp-name">${p(T)}:</span>
            <span class="cable-cp-phrase">"${p(q)}"</span>
            <span class="cable-cp-count">${O}×</span>
          </div>`}).join("")}
      </div>`:"",w=E?`<div class="end-scoreboard">
        <div class="end-stat">
          <span class="end-stat-num">${E}</span>
          <span class="end-stat-lbl">turns</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--amber)">${y.toFixed(1)}M</span>
          <span class="end-stat-lbl">final ratings</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--green)">${b.toFixed(1)}M</span>
          <span class="end-stat-lbl">peak</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num">${h}</span>
          <span class="end-stat-lbl">breaking news</span>
        </div>
      </div>`:"",C=document.createElement("div");C.className="end-panel",C.innerHTML=`
    <div class="end-title ${d}">━━━ ${r} ━━━</div>
    ${w}
    ${_}
    ${v}
    <div class="end-actions">
      <div class="end-btn-row">
        <button class="end-leave-btn" id="cable-end-leave">Leave the studio</button>
      </div>
    </div>
  `,P(e,C),C.querySelector("#cable-end-leave").addEventListener("click",n)}function qt(e,{winner:s,proposition_open:t,proposition_final:a,margin:n,persona_verdicts:i,verdict:l}){const c=s==="proposition"?"PROPOSITION WINS":"OPPOSITION WINS",g=s==="proposition"?"oxford-verdict-prop":"oxford-verdict-opp",r=a===50,d=Math.min(t,a),b=Math.max(t,a)-d,E=a>t,h=E?"var(--green)":"var(--amber)",x=(n>=0?"+":"")+n+" pts",S=`
    <div class="oxford-shift-wrap">
      <div class="oxford-shift-ends"><span>Opp 0%</span><span>Prop 100%</span></div>
      <div class="oxford-shift-track">
        <div class="oxford-shift-fill" style="left:${d}%;width:${b}%;background:${h}"></div>
        <div class="oxford-shift-mark oxford-shift-mark-open" style="left:${t}%">
          <div class="oxford-shift-pip"></div>
          <div class="oxford-shift-pip-label">${t}%</div>
        </div>
        <div class="oxford-shift-mark oxford-shift-mark-close" style="left:${a}%">
          <div class="oxford-shift-pip oxford-shift-pip-close"></div>
          <div class="oxford-shift-pip-label oxford-shift-pip-label-close">${a}%</div>
        </div>
      </div>
      <div class="oxford-shift-margin" style="color:${h}">${E?"→":"←"} ${x}</div>
    </div>
  `,k=r?'<div class="oxford-verdict-tie">The motion falls — a tie goes to the opposition.</div>':"",_=document.createElement("div");_.className="oxford-verdict-card",_.innerHTML=`
    <div class="oxford-verdict-title">── THE VERDICT ──</div>
    ${S}
    <div class="oxford-verdict-winner ${g}">${c}</div>
    ${k}
    <div class="oxford-verdict-text">${p(l)}</div>
    <ul class="oxford-verdict-personas">
      ${(i||[]).map(v=>`<li>${p(v)}</li>`).join("")}
    </ul>
  `,P(e,_)}function Te(e,{summary:s,points:t},{onNewTopic:a,onQuit:n},i={},l,c,g=[]){var y;const r=document.createElement("div");r.className="end-panel",r.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${p(s)}</blockquote>
    ${Oe(i)}
    ${Ae(t,i)}
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
  `,P(e,r);const d=r.querySelector("#consensus-topic-input");d.focus(),r.querySelector("#consensus-continue").addEventListener("click",()=>{const b=d.value.trim();b&&a(b)}),d.addEventListener("keydown",b=>{if(b.key==="Enter"){const E=d.value.trim();E&&a(E)}}),r.querySelector("#consensus-end").addEventListener("click",n),(y=r.querySelector("#consensus-paper"))==null||y.addEventListener("click",()=>ge(l,c,g))}function ne(e,s,t,a,n,i){var r;D(e);const l=document.createElement("div");l.className="end-panel";const c=s.turn||0,g=c?`${c} turn${c!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${p(g)}</blockquote>
    ${Oe(s)}
    ${Ae([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${n?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,P(e,l),l.querySelector("#game-over-leave").addEventListener("click",a),(r=l.querySelector("#game-over-paper"))==null||r.addEventListener("click",()=>ge(n,i,t))}async function Ct(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(a){alert(`Podcast failed: ${a.message}`)}finally{t.remove()}}async function ge(e,s,t=[]){const a=document.createElement("div");a.className="newspaper-overlay",a.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(a);let n;try{n=await s.fetchNewspaper(e)}catch(i){a.remove(),alert(`Could not print the paper: ${i.message}`);return}a.innerHTML=`
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
          ${t.map(i=>`
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/newspaper_portraits/${encodeURIComponent(i.replace(/ /g,"_"))}.png"
                   alt="${p(i)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${p(i)}</div>
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
  `,a.querySelector("#newspaper-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",i=>{i.target===a&&a.remove()}),a.querySelector("#newspaper-download").addEventListener("click",()=>{var c,g;const i=a.querySelector(".newspaper-modal").cloneNode(!0);i.querySelectorAll("img").forEach(r=>{r.src&&!r.src.startsWith("http")&&(r.src=window.location.origin+r.getAttribute("src"))}),(c=i.querySelector("#newspaper-close"))==null||c.remove(),(g=i.querySelector("#newspaper-download"))==null||g.remove();const l=window.open("","_blank");l.document.write(`<!DOCTYPE html>
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
</head><body>${i.outerHTML}</body></html>`),l.document.close(),l.addEventListener("load",()=>{l.focus(),l.print()})})}function Oe(e){const{turn:s=0,heat:t=0,concession_total:a=0}=e;if(!s)return"";const n=Pe(t),i=Re(t);return`
    <div class="end-scoreboard">
      <div class="end-stat">
        <span class="end-stat-num">${s}</span>
        <span class="end-stat-lbl">turns</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num" style="color:${n}">${t}<span class="end-stat-denom">/10</span></span>
        <span class="end-stat-lbl">${i}</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num">${a}</span>
        <span class="end-stat-lbl">concessions</span>
      </div>
    </div>
  `}function Ae(e,s){const{partial_agreements:t=[],points_of_agreement:a=[],remaining_disagreements:n=[]}=s,i=[...new Set([...e,...a])];let l="";return i.length&&(l+=`<div class="end-section end-section-agree">
      <div class="end-section-label">agreements reached</div>
      ${i.map(c=>`<div class="end-item-agree">✓ ${p(c)}</div>`).join("")}
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
    </div>`),l}function Nt(e,s){D(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,P(e,t)}function D(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function V(e,s){var _,v;const{topic:t,turn:a=0,heat:n=0,concession_total:i=0,moderator_style:l="socratic",partial_agreements:c=[],points_of_agreement:g=[],remaining_disagreements:r=[],debate_phase:d="",format_roles:y={},oxford_opening_vote:b=null}=s,E={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},h=d&&E[d]?`<div class="sb-phase-banner">${E[d].toUpperCase()}</div>`:"",x=d&&(y.proposition||y.opposition)?'<div class="sb-roles">'+((_=y.proposition)!=null&&_.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${y.proposition.map(w=>p(w)).join(", ")}</div>`:"")+((v=y.opposition)!=null&&v.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${y.opposition.map(w=>p(w)).join(", ")}</div>`:"")+"</div>":"",S=b?`<details class="oxford-opening-banner">
        <summary class="oxford-opening-summary">
          Opening position: <strong>${b.proposition_pct}%</strong> for proposition
        </summary>
        <div class="oxford-opening-detail">
          <div class="oxford-opening-rationale">${p(b.rationale||"")}</div>
          <ul class="oxford-opening-leanings">
            ${(b.persona_leanings||[]).map(w=>`<li>${p(w)}</li>`).join("")}
          </ul>
        </div>
      </details>`:"";let k=`
    ${h}
    ${x}
    ${S}
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;g.length&&(k+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${g.map(w=>`<div class="sb-agree-item">✓ ${p(w)}</div>`).join("")}
      </div>
    `),c.length&&(k+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${c.map(w=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(w.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(w.on)}</div>
          </div>
        `).join("")}
      </div>
    `),r.length&&(k+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${r.map(w=>typeof w=="object"&&w!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(w.topic)}</div>
                <div class="sb-tension-stance">${p(w.participant_a)}: ${p(w.stance_a)}</div>
                <div class="sb-tension-stance">${p(w.participant_b)}: ${p(w.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(w))}</div>`).join("")}
      </div>
    `),k+=`
    <div class="sb-section" id="sb-bars">
      ${He(n,i)}
    </div>

    <div class="sb-section" id="sb-cable-ratings" style="${s.cable_ratings!=null?"":"display:none"}">
      ${s.cable_ratings!=null?Me(s.cable_ratings,s.cable_ratings_history||[]):""}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(l)}</div>
    </div>
  `,e.innerHTML=k}function ee(e,s=""){let t=p(e);if(s){const n=p(s),i=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");t=t.replace(i,l=>`<mark class="catchphrase-hl">${l}</mark>`)}return t.replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function P(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function He(e,s){const t=Pe(e),a=Re(e),n="█".repeat(e),i="░".repeat(10-e),l=Math.min(s,10),c=Ht(s),g="█".repeat(l),r="░".repeat(10-l),d=Mt(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${n}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${c}">${g}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${c}">${d} (${s})</span>
    </div>
  `}function Ot(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=He(s,t))}function At(e,s,t){const a=e.querySelector("#sb-cable-ratings");a&&(a.style.display="",a.innerHTML=Me(s,t))}function Me(e,s){const t=(e-.2)/3.8*100,a=Math.max(0,Math.min(100,t)).toFixed(1),n=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030",i=s.length>=2?s[s.length-1]>s[s.length-2]?"▲":s[s.length-1]<s[s.length-2]?"▼":"─":"";return`
    <div class="sb-label">── RATINGS ──</div>
    <div class="sb-ratings-num" style="color:${n}">${e.toFixed(1)}M viewers <span class="sb-trend">${i}</span></div>
    <div class="ratings-bar-track">
      <div class="ratings-bar-fill" style="width:${a}%;background:${n}"></div>
    </div>
    <div class="sb-ratings-scale"><span>cancelled</span><span>viral</span></div>
  `}function Pe(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function Re(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Ht(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Mt(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Pt(e,s){const{turn:t,heat:a,partial_agreements:n,remaining_disagreements:i,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const c=n||[],g=i||[];if(c.length&&g.length){const d=c[0],y=g[0],b=d.participants.join(" and "),E=typeof y=="object"?y.topic:String(y);return`${b} are finding common ground, but the group remains divided on ${E}.`}if(c.length){const d=c[0];return`${d.participants.join(" and ")} are converging on ${d.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(g.length){const d=g[0];return typeof d=="object"?`${d.participant_a} and ${d.participant_b} are sharply divided over ${d.topic}.`:`The room is deadlocked — ${String(d)}.`}const r=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${r}.`}const ie=document.querySelector("#app");let re={},he={};const Rt=new Set(["production","development","staging"]);async function It(){const e=Rt.has("production")?"default":"production",[s]=await Promise.all([$e(Object.assign({"./skins/default/skin.js":()=>se(()=>import("./skin-D7HGMV-G.js"),[]),"./skins/kids/skin.js":()=>se(()=>import("./skin-DZ74tMJe.js"),[])}),`./skins/${e}/skin.js`,4),$e(Object.assign({"./skins/default/theme.css":()=>se(()=>Promise.resolve({}),__vite__mapDeps([0])),"./skins/kids/theme.css":()=>se(()=>Promise.resolve({}),__vite__mapDeps([1]))}),`./skins/${e}/theme.css`,4)]);return s}async function Ie(){let e,s;try{[e,s,re]=await Promise.all([Qe(),Je(),Xe()])}catch(n){ie.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=!!re.local,a=dt(ie,e,async({characters:n,topic:i,commentator:l=!0,moderator:c=!0,diagrams:g=!1,audienceLevel:r="university",philosopherLength:d="normal",commentatorLength:y="normal",moderatorLength:b="normal",debateFormat:E="",formatRoles:h=null})=>{try{const x=await Ze(n,i,l,c,g,r,d,y,b,E,h);jt(x.session_id,n,i,s)}catch(x){a.showError(`Could not start session: ${x.message}`)}},{isLocal:t,skin:he})}function jt(e,s,t,a){yt(ie,e,s,t,a,{skin:he,steer:et,cheat:lt,deleteSession:it,newTopic:nt,openStream:ct,searchEvidence:tt,fetchNewspaper:rt,exportPodcast:re.podcast?ot:null,isLocal:!!re.local}),ie.addEventListener("debate:quit",()=>Ie(),{once:!0})}It().then(e=>{he=e}).catch(()=>{}).finally(()=>Ie());
