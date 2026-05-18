const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/theme-CJEpj9dL.css","assets/theme-ClQV55ib.css"])))=>i.map(i=>d[i]);
(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const De="modulepreload",Fe=function(e){return"/"+e},be={},se=function(s,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=Promise.allSettled(t.map(u=>{if(u=Fe(u),u in be)return;be[u]=!0;const r=u.endsWith(".css"),d=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${d}`))return;const y=document.createElement("link");if(y.rel=r?"stylesheet":De,r||(y.as="script"),y.crossOrigin="",y.href=u,c&&y.setAttribute("nonce",c),document.head.appendChild(y),r)return new Promise((v,E)=>{y.addEventListener("load",v),y.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return n.then(l=>{for(const c of l||[])c.status==="rejected"&&i(c.reason);return s().catch(i)})},ye=(e,s,t)=>{const a=e[s];return a?typeof a=="function"?a():Promise.resolve(a):new Promise((n,i)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(i.bind(null,new Error("Unknown variable dynamic import: "+s+(s.split("/").length!==t?". Note that variables only represent file names one level deep.":""))))})},U="/api";async function G(e,s){const t=await fetch(`${U}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){const a=await t.text();throw new Error(`${t.status} ${t.statusText}: ${a}`)}return t.json()}async function Be(e){await fetch(`${U}${e}`,{method:"DELETE"})}async function Ue(e=null){const s=e?`${U}/topics?level=${encodeURIComponent(e)}`:`${U}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function Ge(){const e=await fetch(`${U}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function Ve(){const e=await fetch(`${U}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function We(){const e=await fetch(`${U}/features`);return e.ok?e.json():{}}async function ze(e,s,t=!0,a=!0,n=!1,i="university",l="normal",c="normal",u="normal",r="",d=null){return G("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:a,diagrams_enabled:n,audience_level:i,philosopher_length:l,commentator_length:c,moderator_length:u,debate_format:r,format_roles:d})}async function Ye(e,s,t,a="",n={},i=""){return G(`/sessions/${e}/steer`,{text:s,style:t,evidence:a,drinks:n,producer_directive:i})}async function Ke(e){return G("/search",{query:e})}async function Qe(e){return G("/suggest-cast",{topic:e})}async function Xe(e){return G("/suggest-topic",{characters:e})}async function Je(e,s){return G(`/sessions/${e}/new-topic`,{topic:s})}async function Ze(e){return Be(`/sessions/${e}`)}async function et(e){return G(`/sessions/${e}/newspaper`,{})}async function tt(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const i=await s.json().catch(()=>({detail:s.statusText}));throw new Error(i.detail||s.statusText)}const t=await s.blob(),a=URL.createObjectURL(t),n=document.createElement("a");n.href=a,n.download="philosophers-bar-podcast.mp3",document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(a)}async function st(e,s,t={}){const a={drinks:t};return s!==null&&(a.heat=s),G(`/sessions/${e}/cheat`,a)}function at(e,s){const t=new EventSource(`${U}/sessions/${e}/stream`);return t.onmessage=a=>{try{const n=JSON.parse(a.data);s(n)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const we="https://github.com/mhughes72/fungame03";function _e(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",function n(i){i.key==="Escape"&&(a(),document.removeEventListener("keydown",n))})}function Te(){_e("ABOUT",`
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
    <p><a class="info-link" href="${we}" target="_blank" rel="noopener">${we}</a></p>
  `)}function qe(){_e("HOW TO PLAY",`
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
  `)}function nt(e,s,t,{isLocal:a=!1,skin:n={}}={}){const i=n.appName??"THE PHILOSOPHER'S BAR",l=n.setupSub??"Select 2–4 thinkers for tonight's debate",c=n.charFilterPlaceholder??"Filter thinkers…",u=n.topicLabel??"What should they discuss?",r=n.topicPlaceholder??"What is the nature of justice?",d=n.startLabel??"Open the bar ▶";n.orLabel;const y=n.dotdLoadingText??"generating tonight's debate…";e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box setup-box--simple" id="setup-box">
        <h1 class="setup-title">${i}</h1>
        <p class="setup-sub">${l}</p>

        <div class="format-selector">
          <label class="format-opt format-opt--freeform" data-desc="Open philosophical debate — the moderator guides the conversation freely with no fixed sides">
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
          ${(()=>{const o=["Philosophy","Science","Politics","Arts","Literature","Technology","Media","Psychology","Religion"],b={};for(const f of s){const x=f.category||"Other";(b[x]=b[x]||[]).push(f)}return o.filter(f=>b[f]).map(f=>`
              <div class="char-category-group">
                <div class="char-category-label">${H(f)}</div>
                <div class="char-category-cards">
                  ${b[f].map(x=>{const A=x.name.replace(/ /g,"_"),P=x.name.split(" ").map(le=>le[0]).join("").slice(0,2).toUpperCase();return`<label class="char-card"
                        data-name="${x.name.toLowerCase()}"
                        data-desc="${H(x.known_for)}"
                        data-category="${H(f)}">
                        <input type="checkbox" value="${H(x.name)}" />
                        <div class="char-card-img">
                          <img src="/portraits/${A}.png" alt=""
                            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
                          <div class="char-card-initials" style="display:none">${H(P)}</div>
                        </div>
                        <div class="char-card-name">${H(x.name)}</div>
                      </label>`}).join("")}
                </div>
              </div>`).join("")})()}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">${u}</label>
        <div class="advanced-generate-heading">── Generate a Debate ──</div>
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

        <div class="setup-spacer"></div>
        <div class="setup-dotd-sep">── or try a suggested debate ──</div>

        <div class="mode-toggle-row">
          <button class="mode-toggle-btn" id="mode-to-advanced">⚗ Experimental features</button>
          <button class="mode-toggle-btn" id="mode-to-simple">← Simple view</button>
        </div>

        <p class="setup-error" id="setup-error"></p>

        <div class="setup-footer">
          <button class="setup-info-btn" id="setup-about">About</button>
          <span class="setup-footer-sep">·</span>
          <button class="setup-info-btn" id="setup-help">Help</button>
        </div>
      </div>
    </div>
  `;const v=e.querySelectorAll("#char-list input[type=checkbox]"),E=e.querySelectorAll(".char-card"),m=e.querySelector("#char-no-results"),L=e.querySelector("#char-filter");L.addEventListener("input",()=>{const o=L.value.toLowerCase().trim();let b=0;E.forEach(f=>{const x=!o||f.dataset.name.includes(o);f.style.display=x?"":"none",x&&b++}),e.querySelectorAll(".char-category-group").forEach(f=>{const x=[...f.querySelectorAll(".char-card")].some(A=>A.style.display!=="none");f.style.display=x?"":"none"}),m.style.display=b===0?"":"none"});const k=document.createElement("div");k.className="char-tooltip",k.style.display="none",document.body.appendChild(k);function S(o){const{desc:b,category:f}=o.currentTarget.dataset;b&&(k.innerHTML=`
      <div class="tt-body">
        ${f?`<span class="tt-category">${H(f)}</span>`:""}
        <span class="tt-desc">${H(b)}</span>
      </div>`,k.style.display="block",_(o))}function _(o){const f=k.offsetWidth,x=k.offsetHeight;let A=o.clientX+14,P=o.clientY+14;A+f>window.innerWidth-14&&(A=o.clientX-f-14),P+x>window.innerHeight-14&&(P=o.clientY-x-14),k.style.left=A+"px",k.style.top=P+"px"}function h(){k.style.display="none"}E.forEach(o=>{o.addEventListener("mouseenter",S),o.addEventListener("mousemove",_),o.addEventListener("mouseleave",h)}),e.querySelectorAll(".format-opt").forEach(o=>{o.addEventListener("mouseenter",S),o.addEventListener("mousemove",_),o.addEventListener("mouseleave",h)});const w=new MutationObserver(()=>{document.body.contains(e)||(k.remove(),w.disconnect())});w.observe(document.body,{childList:!0,subtree:!0}),a&&(e.querySelector("#setup-lengths").style.display="");const C=e.querySelector("#setup-box"),q=e.querySelector("#mode-to-advanced"),O=e.querySelector("#mode-to-simple"),j=e.querySelector(".setup-title");q.addEventListener("click",()=>{C.classList.replace("setup-box--simple","setup-box--advanced"),j.textContent="THE PHILOSOPHER'S EXPERIMENT"}),O.addEventListener("click",()=>{C.classList.replace("setup-box--advanced","setup-box--simple"),j.textContent=i;const o=e.querySelector('input[name="debate-format"][value=""]');o&&!o.checked&&(o.checked=!0,te())});const N=e.querySelector("#selection-hint"),$=e.querySelector("#start-btn"),g=e.querySelector("#setup-error");function T(){const o=[...v].filter(f=>f.checked).length;e.querySelector("#char-list").classList.toggle("char-list--maxed",o>=4),o<2?(N.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",N.classList.remove("hint-ok","hint-warn")):o>4?(N.textContent=`Too many — deselect ${o-4}`,N.classList.add("hint-warn"),N.classList.remove("hint-ok")):(N.textContent=`${o} selected`,N.classList.add("hint-ok"),N.classList.remove("hint-warn")),$.disabled=o<2||o>4;const b=e.querySelector("#suggest-topic-btn");b&&(b.disabled=o<2||o>4)}e.querySelector("#char-list"),e.querySelector("#char-filter");const I=e.querySelector("#topic-input");e.querySelector(".setup-or"),e.querySelector(".topic-label"),e.querySelector(".topic-row"),e.querySelector("#cast-suggestion"),T();const V=e.querySelector("#suggest-btn"),B=e.querySelector("#cast-suggestion");let oe=!1;V.addEventListener("click",async()=>{const o=I.value.trim();if(!o){I.focus();return}V.disabled=!0,V.textContent="thinking…",B.innerHTML='<div class="cs-loading">selecting the best minds for this topic…</div>',B.style.display="";try{const{picks:b}=await Qe(o);if(!b||!b.length)return;v.forEach(x=>{x.checked=!1}),b.forEach(({name:x})=>{const A=e.querySelector(`#char-list input[value="${CSS.escape(x)}"]`);A&&(A.checked=!0)}),oe=!0,T(),B.innerHTML='<div class="cs-header">── suggested cast ──</div>'+b.map(x=>`<div class="cs-pick">
            <span class="cs-name">${H(x.name)}</span>
            <span class="cs-reason">${H(x.reason)}</span>
          </div>`).join(""),B.style.display="";const f=e.querySelector(`.char-card[data-name="${b[0].name.toLowerCase()}"]`);f&&f.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(b){console.error("suggest cast failed",b),B.style.display="none"}finally{V.disabled=!1,V.textContent="Suggest cast ✦"}});const X=e.querySelector("#suggest-topic-btn"),Y=e.querySelector("#topic-suggestion");X.addEventListener("click",async()=>{const o=[...v].filter(b=>b.checked).map(b=>b.value);if(!(o.length<2)){X.disabled=!0,X.textContent="thinking…",Y.innerHTML='<div class="cs-loading">finding the perfect flashpoint…</div>',Y.style.display="";try{const{topic:b,reason:f}=await Xe(o);if(!b)return;I.value=b,Y.innerHTML=`<div class="cs-header">── suggested topic ──</div><div class="cs-pick">
          <span class="cs-name">${H(b)}</span>
          <span class="cs-reason">${H(f)}</span>
        </div>`,Y.style.display=""}catch(b){console.error("suggest topic failed",b),Y.style.display="none"}finally{X.disabled=!1,X.textContent="Suggest topic ✦"}}}),v.forEach(o=>o.addEventListener("change",()=>{oe&&(B.style.display="none",oe=!1),Y.style.display="none",T()}));function ge(){const o=e.querySelector('input[name="audience"]:checked'),b=e.querySelector('input[name="phil-length"]:checked'),f=e.querySelector('input[name="comm-length"]:checked'),x=e.querySelector('input[name="mod-length"]:checked'),A=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:o?o.value:"university",philosopherLength:b?b.value:"normal",commentatorLength:f?f.value:"normal",moderatorLength:x?x.value:"normal",debateFormat:A?A.value:""}}$.addEventListener("click",()=>{const o=[...v].filter(f=>f.checked).map(f=>f.value),b=e.querySelector("#topic-input").value.trim()||"What is the nature of justice?";g.textContent="",t({characters:o,topic:b,...ge()})}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!$.disabled&&$.click()}),e.querySelector("#setup-about").addEventListener("click",Te),e.querySelector("#setup-help").addEventListener("click",qe);const W=e.querySelector("#dotd-card"),Re={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let me=[],K=[],D=-1;function he(){const o=e.querySelector('input[name="audience"]:checked');return o?o.value:"university"}function Ie(){const o=e.querySelector('input[name="debate-format"]:checked');return o?o.value:""}function ve(o){const b=Ie();return me.filter(f=>(b==="oxford"?f.format==="oxford":b==="cable_news"?f.format==="cable_news":f.format!=="oxford"&&f.format!=="cable_news")&&(b==="cable_news"||f.audience_level===o))}function fe(o,b=null){if(!o.length)return null;const f=b?o.filter(P=>P.id!==b.id):o,x=f.length?f:o,A=[];for(const P of x)A.push(P),P.source==="curated"&&(A.push(P),A.push(P));return A[Math.floor(Math.random()*A.length)]}function ee(o){const b=Re[o.category]||"var(--text-dim)",f=o.format==="oxford",x=o.format==="cable_news";W.classList.toggle("dotd-card--cable",x);const A=f?'<span class="dotd-oxford">🎓 Oxford</span>':x?"":'<span class="dotd-freeform">Freeform</span>',P=f?"":o.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',le=o.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${o.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${o.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${o.characters.join(" · ")}</div>`,je=x?`
      <div class="cable-dotd-bar">
        <span class="cable-dotd-live"><span class="cable-dotd-dot"></span>LIVE</span>
        <span class="cable-dotd-breaking">BREAKING NOW</span>
        <span class="cable-dotd-channel">📺 DEBATE ZONE</span>
      </div>`:"";W.innerHTML=`
      ${je}
      <div class="dotd-header">
        <span class="dotd-label">${x?"TONIGHT'S SHOWDOWN":"── SUGGESTED DEBATE ──"}</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${b}">${o.category.toUpperCase()}</span>
          ${A}
          ${P}
        </span>
      </div>
      ${le}
      <div class="dotd-topic">${H(o.topic)}</div>
      <div class="dotd-tagline">${H(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-prev" ${D<=0?"disabled":""}>← Prev</button>
        <button class="dotd-start-btn" id="dotd-start">${x?"🔴 GO LIVE ▶":"Start this debate ▶"}</button>
        <button class="dotd-new-btn" id="dotd-next">Next →</button>
      </div>
    `,W.querySelector("#dotd-start").addEventListener("click",()=>{const J=f?"oxford":x?"cable_news":"";t({characters:o.characters,topic:o.topic,...ge(),debateFormat:J,formatRoles:o.roles||null})}),W.querySelector("#dotd-prev").addEventListener("click",()=>{D>0&&(D--,ee(K[D]))}),W.querySelector("#dotd-next").addEventListener("click",()=>{if(D<K.length-1)D++,ee(K[D]);else{const J=fe(ve(he()),K[D]);J&&(K.push(J),D++,ee(J))}})}function te(){const o=fe(ve(he()));o?(K=[o],D=0,ee(o)):W.style.display="none"}return Ue().then(o=>{me=o,te()}).catch(()=>{W.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(o=>{o.addEventListener("change",te)}),e.querySelectorAll('input[name="debate-format"]').forEach(o=>{o.addEventListener("change",te)}),{showError(o){g.textContent=o}}}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function it(e){const s=(e-.2)/3.8*100,t=Math.max(0,Math.min(100,s)).toFixed(1),a=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030";return`<div class="ratings-bar-track"><div class="ratings-bar-fill" style="width:${t}%;background:${a}"></div></div>`}const rt={get_them_fighting:"🥊",force_soundbite:"💬",push_narrative:"📢",wrap_it_up:"⏱️",go_soft:"🕊️"},ot={get_them_fighting:"fight",force_soundbite:"soundbite",push_narrative:"narrative",wrap_it_up:"wrap up",go_soft:"go soft"},lt={socratic:"💭",combative:"⚔️","devil's advocate":"😈",koan:"☯️",journalist:"🎤","straw man":"🪆","steel man":"🛡️","last call":"🔔"};function ct(e,s,t="",a,n=null,i=[],l={}){const c=l.moderatorStyleNames??{},u=l.steerTitle??"── STEER THE DEBATE ──",r=l.steerQuitLabel??"Quit game",d=l.steerInputPlaceholder??"Speak into the debate — or leave blank for the moderator…",y=l.steerSubmitLabel??"Steer ▶",v=l.evidencePlaceholder??"Search term — result will be injected as empirical fact…";return new Promise(E=>{const m=document.createElement("div");m.className="steer-drawer",m.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">${u}</div>
        <button class="steer-quit-btn" id="steer-quit">${R(r)}</button>
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
        <button class="steer-submit-btn" id="steer-submit">${R(y)}</button>
      </div>

      <div class="style-grid" id="style-grid">
        ${s.map($=>{const g=lt[$.style]??"◆",T=c[$.style]??$.style;return`<button
            class="style-icon-btn${$.style===e?" style-selected":""}"
            data-style="${R($.style)}"
            title="${R(T+" — "+$.description)}"
          >
            <span class="style-icon-glyph">${g}</span>
            <span class="style-icon-name">${R(T)}</span>
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
            placeholder="${R(v)}"
            autocomplete="off"
          />
          <button class="steer-search-btn" id="evidence-search">Search</button>
        </div>
        <div id="evidence-preview" class="evidence-preview" style="display:none"></div>
      </div>
    `,(a||document.body).appendChild(m);const k=m.querySelector("#steer-text-input");k.focus();let S=e,_="";m.querySelectorAll(".style-icon-btn").forEach($=>{$.addEventListener("click",()=>{m.querySelectorAll(".style-icon-btn").forEach(g=>g.classList.remove("style-selected")),$.classList.add("style-selected"),S=$.dataset.style,N()})});const h=m.querySelector("#evidence-toggle"),w=m.querySelector("#evidence-panel"),C=m.querySelector("#evidence-preview"),q=m.querySelector("#evidence-query"),O=m.querySelector("#evidence-search");h.addEventListener("click",()=>{const $=w.style.display==="none";w.style.display=$?"":"none",h.classList.toggle("steer-pill--active",$),$&&q.focus()});async function j(){const $=q.value.trim();if(!(!$||!n)){O.disabled=!0,O.textContent="Searching…",C.style.display="none",_="";try{const g=await n($);_=g.finding,C.style.display="block",C.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${R(g.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,C.querySelector("#evidence-accept").addEventListener("click",()=>{C.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${R(_)}</div>`}),C.querySelector("#evidence-discard").addEventListener("click",()=>{_="",C.style.display="none"})}catch(g){C.style.display="block",C.textContent=`Search failed: ${g.message}`}finally{O.disabled=!1,O.textContent="Search"}}}O.addEventListener("click",j),q.addEventListener("keydown",$=>{$.key==="Enter"&&j()});function N(){m.remove(),E({text:k.value.trim(),style:S,evidence:_})}m.querySelector("#steer-submit").addEventListener("click",N),m.querySelector("#steer-quit").addEventListener("click",()=>{m.remove(),E(null)}),k.addEventListener("keydown",$=>{$.key==="Enter"&&N()})})}function dt(e,s,t={}){const{ratings:a=.8,peak_ratings:n=.8,producer_note:i="",producer_stress:l=0,directives:c=[]}=e,u=["","nervous","stressed","PANICKING","MELTDOWN","FIRE FIRE FIRE"],r=l>0?` (${u[Math.min(l,5)]})`:"",d=l>=3;return new Promise(y=>{const v=document.createElement("div");v.className="steer-drawer",v.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── COMMERCIAL BREAK ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      <div class="commercial-ratings-row">
        <span class="commercial-ratings-num">📺 ${a.toFixed(1)}M</span>
        <span class="commercial-ratings-peak">peak ${n.toFixed(1)}M</span>
        ${it(a)}
      </div>

      ${i?`
        <div class="commercial-producer-note${d?" commercial-producer-high":""}">
          <span class="producer-tag">[PRODUCER${r}]</span> ${R(i)}
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
        ${c.map(([S,_])=>{const h=rt[S]??"◆",w=ot[S]??S.replace(/_/g," ");return`<button
            class="style-icon-btn"
            data-directive="${R(S)}"
            title="${R(w+" — "+_)}"
          >
            <span class="style-icon-glyph">${h}</span>
            <span class="style-icon-name">${R(w)}</span>
          </button>`}).join("")}
      </div>
    `,(s||document.body).appendChild(v);const m=v.querySelector("#steer-text-input");m.focus();let L="";v.querySelectorAll("#directive-list .style-icon-btn").forEach(S=>{S.addEventListener("click",()=>{v.querySelectorAll("#directive-list .style-icon-btn").forEach(_=>_.classList.remove("style-selected")),S.classList.add("style-selected"),L=S.dataset.directive,k()})});function k(){const S=m.value.trim();v.remove(),y({text:S,producer_directive:L})}v.querySelector("#steer-submit").addEventListener("click",k),v.querySelector("#steer-quit").addEventListener("click",()=>{v.remove(),y(null)}),m.addEventListener("keydown",S=>{S.key==="Enter"&&k()})})}function ae(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const $e=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function pt(e,s,t,a,n=null,i=null,l=null,c=null){return new Promise(u=>{var L,k,S,_;const r={};t.forEach(h=>{r[h]=0});const d=document.createElement("div");d.className="cheat-overlay",d.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${$e[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(h=>`
            <div class="drink-row">
              <span class="drink-name">${ae(h)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${ae(h)}">−</button>
                <span class="drink-count" id="drink-count-${ae(h.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${ae(h)}">+</button>
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
    `,document.body.appendChild(d);const y=d.querySelector("#cheat-heat-slider"),v=d.querySelector("#cheat-heat-value");y.addEventListener("input",()=>{const h=parseInt(y.value,10);v.textContent=`${h} — ${$e[h]}`}),d.querySelectorAll(".drink-btn").forEach(h=>{h.addEventListener("click",()=>{const w=h.dataset.name,C=h.classList.contains("drink-plus")?1:-1;r[w]=Math.max(0,(r[w]||0)+C);const q=w.replace(/ /g,"_"),O=d.querySelector(`#drink-count-${q}`);O&&(O.textContent=r[w])})});function E(){d.remove(),u()}async function m(){const h=parseInt(y.value,10),w=Object.fromEntries(Object.entries(r).filter(([,q])=>q>0)),C=h!==s;try{await a(e,C?h:null,w)}catch(q){console.error("Cheat failed:",q)}E()}d.querySelector("#cheat-apply").addEventListener("click",m),d.querySelector("#cheat-close").addEventListener("click",E),(L=d.querySelector("#cheat-paper"))==null||L.addEventListener("click",()=>{E(),n()}),(k=d.querySelector("#cheat-podcast"))==null||k.addEventListener("click",()=>{E(),i()}),(S=d.querySelector("#cheat-consensus"))==null||S.addEventListener("click",()=>{E(),c()}),(_=d.querySelector("#cheat-end"))==null||_.addEventListener("click",()=>{E(),l()}),d.addEventListener("click",h=>{h.target===d&&E()})})}function ut(e,s,t={}){e.innerHTML=s.map(u=>{if(t.renderSeat)return t.renderSeat(u,Ee(u),ce(u),ke(u),Se(u));const r=Ee(u),d=Se(u);return`
      <div class="seat" id="seat-${ce(u)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${r}" alt="${de(u)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${de(d)}</div>
        </div>
        <div class="seat-name">${de(ke(u))}</div>
      </div>
    `}).join("");let a=null;function n(u){return e.querySelector(`#seat-${ce(u)}`)}function i(){clearTimeout(a),e.querySelectorAll(".seat").forEach(u=>{u.classList.remove("seat-thinking","seat-speaking")})}function l(u){var r;i(),(r=n(u))==null||r.classList.add("seat-thinking")}function c(u){i();const r=n(u);r&&(r.classList.add("seat-speaking"),a=setTimeout(()=>r.classList.remove("seat-speaking"),3e3))}return{setThinking:l,setSpeaking:c,clearAll:i}}function Ee(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Se(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function ke(e){return e.split(" ").at(-1)}function ce(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function de(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function gt(e,s,t,a,n,i){const l=i.skin??{},c=l.appName??"THE PHILOSOPHER'S BAR";e.innerHTML=`
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
  `;const u=e.querySelector("#seats-bar"),r=e.querySelector("#convo-pane"),d=e.querySelector("#sidebar"),y=e.querySelector("#left-col");let v="socratic",E=0,m=null,L=!1,k=!1,S="",_={},h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},w=.8,C=[];const q=ut(u,t,l);z(d,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const $=document.createElement("div");$.id="debate-starting",$.className="debate-starting",$.innerHTML=`<span class="debate-starting-text">${l.debateStartingText??"Opening the bar"}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,r.appendChild($)}function O(){var $;($=r.querySelector("#debate-starting"))==null||$.remove()}function j({type:$,data:g}){switch($){case"speaker":O(),q.setThinking(g.name),xt(r,g.name);break;case"message":O(),F(r),g.backchannel||q.setSpeaking(g.name),mt(r,g);break;case"bars":E=g.heat??E,Lt(d,g.heat,g.concession_total??0);break;case"debug":{const T=g.data!=null?g.data:"",I=typeof T=="object"?`
`+Object.entries(T).map(([V,B])=>`  ${V}: ${JSON.stringify(B)}`).join(`
`):T?` — ${T}`:"";console.log(`[${g.channel}] ${g.label}${I}`);break}case"oxford_opening_vote":h={...h,oxford_opening_vote:g},z(d,{topic:a,...h,debate_phase:S,format_roles:_});break;case"oxford_verdict":St(r,g);break;case"phase_update":S=g.debate_phase,_=g.format_roles||{},z(d,{topic:a,...h,debate_phase:S,format_roles:_});break;case"state":F(r),v=g.moderator_style,E=g.heat??E,g.debate_phase&&(S=g.debate_phase),g.format_roles&&Object.keys(g.format_roles).length&&(_=g.format_roles),h={...g,debate_phase:S,format_roles:_},z(d,{topic:a,...h});break;case"cable_ratings":w=g.ratings??w,C=g.history??C,_t(d,w,C);break;case"chyron":g.text&&wt(r,g.text);break;case"breaking_news":g.headline&&$t(r,g.headline);break;case"producer_whisper":Et(r,g.note,g.stress);break;case"commercial_break":if(k)break;k=!0,w=g.ratings??w,r.scrollTop=r.scrollHeight,dt(g,y,l).then(T=>{k=!1,T===null?xe(r,{reason:"quit",report:{}},t,N):i.steer(s,T.text,"socratic","",{},T.producer_directive).catch(I=>Q(r,`Error: ${I.message}`))});break;case"cable_news_end":if(L)break;L=!0,m&&(m(),m=null),F(r),q.clearAll(),xe(r,g,t,N);break;case"steer_needed":if(k)break;k=!0,v=g.current_style,g.drift_topic&&vt(r,g.drift_topic,a),r.scrollTop=r.scrollHeight,ct(v,n,Ct(h),y,i.searchEvidence,t,l).then(T=>{k=!1,T===null?ne(r,h,t,N,s,i):(v=T.style,z(d,{topic:a,...h,moderator_style:T.style}),i.steer(s,T.text,T.style,T.evidence||"",T.drinks||{}).catch(I=>Q(r,`Steer error: ${I.message}`)))});break;case"consensus":if(L)break;L=!0,m&&(m(),m=null),F(r),q.clearAll(),Le(r,g,{onNewTopic(T){i.newTopic(s,T).then(()=>{L=!1,h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=T,z(d,{topic:T,...h,moderator_style:v,points_of_agreement:[]}),q.clearAll(),m=i.openStream(s,j)}).catch(I=>Q(r,`Error: ${I.message}`))},onQuit:N},h,s,i,t);break;case"game_over":if(L)break;L=!0,m&&(m(),m=null),F(r),q.clearAll(),ne(r,{...h,...g},t,N,s,i);break;case"bar_beat":O(),ht(r,g.text);break;case"commentator":O(),ft(r,g.text);break;case"evidence":O(),bt(r,g.finding);break;case"diagram":O(),yt(r,g);break;case"system":O(),Q(r,g.text);break;case"error":O(),Q(r,`⚠ ${g.text}`);break}}function N(){m&&m(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",Te),e.querySelector("#help-btn").addEventListener("click",qe),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const g=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=g?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{L||pt(s,E,t,i.cheat,()=>pe(s,i,t),()=>kt(s,i),()=>{L=!0,m&&(m(),m=null),F(r),q.clearAll(),ne(r,h,t,N,s,i)},()=>{L=!0,m&&(m(),m=null),F(r),q.clearAll(),Le(r,{summary:"The bar has called it — the evening ends in agreement.",points:h.points_of_agreement||[]},{onNewTopic($){i.newTopic(s,$).then(()=>{L=!1,h={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=$,z(d,{topic:$,...h,moderator_style:v,points_of_agreement:[]}),q.clearAll(),m=i.openStream(s,j)}).catch(g=>Q(r,`Error: ${g.message}`))},onQuit:N},h,s,i,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(L){N();return}h.turn>0?(L=!0,m&&(m(),m=null),ne(r,h,t,N,s,i)):N()}),m=i.openStream(s,j)}function mt(e,{role:s,name:t,content:a,backchannel:n,debate_label:i="",catchphrase:l=""}){const c=document.createElement("div");if(n)c.className="msg msg-bc",c.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${Z(a)}</em>`;else if(s==="moderator")c.className="msg msg-moderator",c.innerHTML=`<div class="msg-mod-label">― ${p(t)} ―</div><div class="msg-content">${Z(a)}</div>`;else if(s==="user")c.className="msg msg-user",c.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${Z(a)}</div>`;else{const u=`/portraits/${t.replace(/ /g,"_")}.png`,r=t.split(" ").map(v=>v[0]).join("").slice(0,2).toUpperCase(),y=i.includes("Proposition")?"debate-label-prop":"debate-label-opp";c.className="msg msg-philosopher",c.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${u}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(r)}</div></div><div class="msg-body">`+(i?`<div class="msg-debate-label ${y}">${p(i)}</div>`:"")+`<div class="msg-name">${p(t)}</div><div class="msg-content">${Z(a,l)}</div></div>`}M(e,c)}function ht(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=Z(s),M(e,t)}function Q(e,s){const t=document.createElement("div");t.className="msg msg-system",s.endsWith("…")?t.innerHTML=p(s.slice(0,-1))+'<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>':t.textContent=s,M(e,t)}function vt(e,s,t){const a=document.createElement("div");a.className="msg msg-drift",a.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${p(s)}</div><div class="drift-orig">original: ${p(t)}</div>`,M(e,a)}function ft(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${p(s)}</span>`,M(e,t)}function bt(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,M(e,t)}function yt(e,{speaker:s,title:t,thumb_url:a,url:n,page_url:i}){const l=document.createElement("div");l.className="msg msg-diagram",l.innerHTML=`<div class="diagram-label">${p(s)} produces a diagram</div><a class="diagram-link" href="${p(i)}" target="_blank" rel="noopener"><img class="diagram-img" src="${p(a)}" alt="${p(t)}" /><div class="diagram-caption">${p(t)}</div></a>`,M(e,l)}function wt(e,s){const t=document.createElement("div");t.className="msg msg-chyron",t.textContent=s,M(e,t)}function $t(e,s){const t=document.createElement("div");t.className="msg msg-breaking-news",t.innerHTML=`<div class="breaking-label">🔴 BREAKING NEWS</div><div class="breaking-headline">${p(s)}</div>`,M(e,t)}function Et(e,s,t){if(!s)return;const a=document.createElement("div");a.className="msg msg-producer-whisper";const n=t>=3?"[PRODUCER!!!]":"[PRODUCER]";a.innerHTML=`<span class="producer-tag${t>=3?" producer-tag-high":""}">${n}</span> ${p(s)}`,M(e,a)}function xe(e,{reason:s,report:t={}},a,n,i,l){F(e);const c=s==="viral",r=c?"📺 SHOW WENT VIRAL":s==="cancelled"?"📺 SHOW CANCELLED":"📺 LAST CALL",d=c?"cable-end-viral":"cable-end-cancelled",{final_ratings:y=0,peak_ratings:v=0,turn_count:E=0,breaking_news_count:m=0,network_offers:L={},catchphrases:k={},guest_stats:S={}}=t,_=Object.entries(L).length?`<div class="end-section cable-end-offers">
        <div class="end-section-label" style="color:var(--amber)">network offers</div>
        ${Object.entries(L).map(([q,O])=>`<div class="cable-offer-row">
            <span class="cable-offer-name">${p(q)}</span>
            <span class="cable-offer-text">${p(O)}</span>
          </div>`).join("")}
      </div>`:"",h=Object.keys(k).length?`<div class="end-section">
        <div class="end-section-label" style="color:var(--blue)">guest catchphrases</div>
        ${Object.entries(k).map(([q,O])=>{const N=(S[q]||{}).catchphrase_count||0;return`<div class="cable-catchphrase-row">
            <span class="cable-cp-name">${p(q)}:</span>
            <span class="cable-cp-phrase">"${p(O)}"</span>
            <span class="cable-cp-count">${N}×</span>
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
          <span class="end-stat-num" style="color:var(--green)">${v.toFixed(1)}M</span>
          <span class="end-stat-lbl">peak</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num">${m}</span>
          <span class="end-stat-lbl">breaking news</span>
        </div>
      </div>`:"",C=document.createElement("div");C.className="end-panel",C.innerHTML=`
    <div class="end-title ${d}">━━━ ${r} ━━━</div>
    ${w}
    ${_}
    ${h}
    <div class="end-actions">
      <div class="end-btn-row">
        <button class="end-leave-btn" id="cable-end-leave">Leave the studio</button>
      </div>
    </div>
  `,M(e,C),C.querySelector("#cable-end-leave").addEventListener("click",n)}function St(e,{winner:s,proposition_open:t,proposition_final:a,margin:n,persona_verdicts:i,verdict:l}){const c=s==="proposition"?"PROPOSITION WINS":"OPPOSITION WINS",u=s==="proposition"?"oxford-verdict-prop":"oxford-verdict-opp",r=a===50,d=Math.min(t,a),v=Math.max(t,a)-d,E=a>t,m=E?"var(--green)":"var(--amber)",L=(n>=0?"+":"")+n+" pts",k=`
    <div class="oxford-shift-wrap">
      <div class="oxford-shift-ends"><span>Opp 0%</span><span>Prop 100%</span></div>
      <div class="oxford-shift-track">
        <div class="oxford-shift-fill" style="left:${d}%;width:${v}%;background:${m}"></div>
        <div class="oxford-shift-mark oxford-shift-mark-open" style="left:${t}%">
          <div class="oxford-shift-pip"></div>
          <div class="oxford-shift-pip-label">${t}%</div>
        </div>
        <div class="oxford-shift-mark oxford-shift-mark-close" style="left:${a}%">
          <div class="oxford-shift-pip oxford-shift-pip-close"></div>
          <div class="oxford-shift-pip-label oxford-shift-pip-label-close">${a}%</div>
        </div>
      </div>
      <div class="oxford-shift-margin" style="color:${m}">${E?"→":"←"} ${L}</div>
    </div>
  `,S=r?'<div class="oxford-verdict-tie">The motion falls — a tie goes to the opposition.</div>':"",_=document.createElement("div");_.className="oxford-verdict-card",_.innerHTML=`
    <div class="oxford-verdict-title">── THE VERDICT ──</div>
    ${k}
    <div class="oxford-verdict-winner ${u}">${c}</div>
    ${S}
    <div class="oxford-verdict-text">${p(l)}</div>
    <ul class="oxford-verdict-personas">
      ${(i||[]).map(h=>`<li>${p(h)}</li>`).join("")}
    </ul>
  `,M(e,_)}function Le(e,{summary:s,points:t},{onNewTopic:a,onQuit:n},i={},l,c,u=[]){var y;const r=document.createElement("div");r.className="end-panel",r.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${p(s)}</blockquote>
    ${Ce(i)}
    ${Ne(t,i)}
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
  `,M(e,r);const d=r.querySelector("#consensus-topic-input");d.focus(),r.querySelector("#consensus-continue").addEventListener("click",()=>{const v=d.value.trim();v&&a(v)}),d.addEventListener("keydown",v=>{if(v.key==="Enter"){const E=d.value.trim();E&&a(E)}}),r.querySelector("#consensus-end").addEventListener("click",n),(y=r.querySelector("#consensus-paper"))==null||y.addEventListener("click",()=>pe(l,c,u))}function ne(e,s,t,a,n,i){var r;F(e);const l=document.createElement("div");l.className="end-panel";const c=s.turn||0,u=c?`${c} turn${c!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${p(u)}</blockquote>
    ${Ce(s)}
    ${Ne([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${n?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,M(e,l),l.querySelector("#game-over-leave").addEventListener("click",a),(r=l.querySelector("#game-over-paper"))==null||r.addEventListener("click",()=>pe(n,i,t))}async function kt(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(a){alert(`Podcast failed: ${a.message}`)}finally{t.remove()}}async function pe(e,s,t=[]){const a=document.createElement("div");a.className="newspaper-overlay",a.innerHTML=`
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
  `,a.querySelector("#newspaper-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",i=>{i.target===a&&a.remove()}),a.querySelector("#newspaper-download").addEventListener("click",()=>{var c,u;const i=a.querySelector(".newspaper-modal").cloneNode(!0);i.querySelectorAll("img").forEach(r=>{r.src&&!r.src.startsWith("http")&&(r.src=window.location.origin+r.getAttribute("src"))}),(c=i.querySelector("#newspaper-close"))==null||c.remove(),(u=i.querySelector("#newspaper-download"))==null||u.remove();const l=window.open("","_blank");l.document.write(`<!DOCTYPE html>
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
</head><body>${i.outerHTML}</body></html>`),l.document.close(),l.addEventListener("load",()=>{l.focus(),l.print()})})}function Ce(e){const{turn:s=0,heat:t=0,concession_total:a=0}=e;if(!s)return"";const n=He(t),i=Me(t);return`
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
  `}function Ne(e,s){const{partial_agreements:t=[],points_of_agreement:a=[],remaining_disagreements:n=[]}=s,i=[...new Set([...e,...a])];let l="";return i.length&&(l+=`<div class="end-section end-section-agree">
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
    </div>`),l}function xt(e,s){F(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,M(e,t)}function F(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function z(e,s){var _,h;const{topic:t,turn:a=0,heat:n=0,concession_total:i=0,moderator_style:l="socratic",partial_agreements:c=[],points_of_agreement:u=[],remaining_disagreements:r=[],debate_phase:d="",format_roles:y={},oxford_opening_vote:v=null}=s,E={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},m=d&&E[d]?`<div class="sb-phase-banner">${E[d].toUpperCase()}</div>`:"",L=d&&(y.proposition||y.opposition)?'<div class="sb-roles">'+((_=y.proposition)!=null&&_.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${y.proposition.map(w=>p(w)).join(", ")}</div>`:"")+((h=y.opposition)!=null&&h.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${y.opposition.map(w=>p(w)).join(", ")}</div>`:"")+"</div>":"",k=v?`<details class="oxford-opening-banner">
        <summary class="oxford-opening-summary">
          Opening position: <strong>${v.proposition_pct}%</strong> for proposition
        </summary>
        <div class="oxford-opening-detail">
          <div class="oxford-opening-rationale">${p(v.rationale||"")}</div>
          <ul class="oxford-opening-leanings">
            ${(v.persona_leanings||[]).map(w=>`<li>${p(w)}</li>`).join("")}
          </ul>
        </div>
      </details>`:"";let S=`
    ${m}
    ${L}
    ${k}
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;u.length&&(S+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${u.map(w=>`<div class="sb-agree-item">✓ ${p(w)}</div>`).join("")}
      </div>
    `),c.length&&(S+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${c.map(w=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(w.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(w.on)}</div>
          </div>
        `).join("")}
      </div>
    `),r.length&&(S+=`
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
    `),S+=`
    <div class="sb-section" id="sb-bars">
      ${Oe(n,i)}
    </div>

    <div class="sb-section" id="sb-cable-ratings" style="${s.cable_ratings!=null?"":"display:none"}">
      ${s.cable_ratings!=null?Ae(s.cable_ratings,s.cable_ratings_history||[]):""}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(l)}</div>
    </div>
  `,e.innerHTML=S}function Z(e,s=""){let t=p(e);if(s){const n=p(s),i=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");t=t.replace(i,l=>`<mark class="catchphrase-hl">${l}</mark>`)}return t.replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function M(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Oe(e,s){const t=He(e),a=Me(e),n="█".repeat(e),i="░".repeat(10-e),l=Math.min(s,10),c=Tt(s),u="█".repeat(l),r="░".repeat(10-l),d=qt(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${n}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${c}">${u}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${c}">${d} (${s})</span>
    </div>
  `}function Lt(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=Oe(s,t))}function _t(e,s,t){const a=e.querySelector("#sb-cable-ratings");a&&(a.style.display="",a.innerHTML=Ae(s,t))}function Ae(e,s){const t=(e-.2)/3.8*100,a=Math.max(0,Math.min(100,t)).toFixed(1),n=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030",i=s.length>=2?s[s.length-1]>s[s.length-2]?"▲":s[s.length-1]<s[s.length-2]?"▼":"─":"";return`
    <div class="sb-label">── RATINGS ──</div>
    <div class="sb-ratings-num" style="color:${n}">${e.toFixed(1)}M viewers <span class="sb-trend">${i}</span></div>
    <div class="ratings-bar-track">
      <div class="ratings-bar-fill" style="width:${a}%;background:${n}"></div>
    </div>
    <div class="sb-ratings-scale"><span>cancelled</span><span>viral</span></div>
  `}function He(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function Me(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Tt(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function qt(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Ct(e,s){const{turn:t,heat:a,partial_agreements:n,remaining_disagreements:i,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const c=n||[],u=i||[];if(c.length&&u.length){const d=c[0],y=u[0],v=d.participants.join(" and "),E=typeof y=="object"?y.topic:String(y);return`${v} are finding common ground, but the group remains divided on ${E}.`}if(c.length){const d=c[0];return`${d.participants.join(" and ")} are converging on ${d.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(u.length){const d=u[0];return typeof d=="object"?`${d.participant_a} and ${d.participant_b} are sharply divided over ${d.topic}.`:`The room is deadlocked — ${String(d)}.`}const r=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${r}.`}const ie=document.querySelector("#app");let re={},ue={};const Nt=new Set(["production","development","staging"]);async function Ot(){const e=Nt.has("production")?"default":"production",[s]=await Promise.all([ye(Object.assign({"./skins/default/skin.js":()=>se(()=>import("./skin-D7HGMV-G.js"),[]),"./skins/kids/skin.js":()=>se(()=>import("./skin-DZ74tMJe.js"),[])}),`./skins/${e}/skin.js`,4),ye(Object.assign({"./skins/default/theme.css":()=>se(()=>Promise.resolve({}),__vite__mapDeps([0])),"./skins/kids/theme.css":()=>se(()=>Promise.resolve({}),__vite__mapDeps([1]))}),`./skins/${e}/theme.css`,4)]);return s}async function Pe(){let e,s;try{[e,s,re]=await Promise.all([Ge(),Ve(),We()])}catch(n){ie.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=!!re.local,a=nt(ie,e,async({characters:n,topic:i,commentator:l=!0,moderator:c=!0,diagrams:u=!1,audienceLevel:r="university",philosopherLength:d="normal",commentatorLength:y="normal",moderatorLength:v="normal",debateFormat:E="",formatRoles:m=null})=>{try{const L=await ze(n,i,l,c,u,r,d,y,v,E,m);At(L.session_id,n,i,s)}catch(L){a.showError(`Could not start session: ${L.message}`)}},{isLocal:t,skin:ue})}function At(e,s,t,a){gt(ie,e,s,t,a,{skin:ue,steer:Ye,cheat:st,deleteSession:Ze,newTopic:Je,openStream:at,searchEvidence:Ke,fetchNewspaper:et,exportPodcast:re.podcast?tt:null,isLocal:!!re.local}),ie.addEventListener("debate:quit",()=>Pe(),{once:!0})}Ot().then(e=>{ue=e}).catch(()=>{}).finally(()=>Pe());
