const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/theme-CJEpj9dL.css","assets/theme-ClQV55ib.css"])))=>i.map(i=>d[i]);
(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const Be="modulepreload",Ue=function(e){return"/"+e},we={},ne=function(s,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=Promise.allSettled(t.map(u=>{if(u=Ue(u),u in we)return;we[u]=!0;const r=u.endsWith(".css"),d=r?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${d}`))return;const w=document.createElement("link");if(w.rel=r?"stylesheet":Be,r||(w.as="script"),w.crossOrigin="",w.href=u,c&&w.setAttribute("nonce",c),document.head.appendChild(w),r)return new Promise((h,S)=>{w.addEventListener("load",h),w.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return n.then(l=>{for(const c of l||[])c.status==="rejected"&&i(c.reason);return s().catch(i)})},$e=(e,s,t)=>{const a=e[s];return a?typeof a=="function"?a():Promise.resolve(a):new Promise((n,i)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(i.bind(null,new Error("Unknown variable dynamic import: "+s+(s.split("/").length!==t?". Note that variables only represent file names one level deep.":""))))})},B="/api";async function U(e,s){const t=await fetch(`${B}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){let a=`${t.status} ${t.statusText}`;try{const n=await t.json();n.detail&&(a=String(n.detail))}catch{const n=await t.text().catch(()=>"");n&&(a=n)}throw new Error(a)}return t.json()}async function Ge(e){await fetch(`${B}${e}`,{method:"DELETE"})}async function Ve(e=null){const s=e?`${B}/topics?level=${encodeURIComponent(e)}`:`${B}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function We(){const e=await fetch(`${B}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function ze(){const e=await fetch(`${B}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function Ye(){const e=await fetch(`${B}/features`);return e.ok?e.json():{}}async function Ke(e,s,t=!0,a=!0,n=!1,i="university",l="normal",c="normal",u="normal",r="",d=null){return U("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:a,diagrams_enabled:n,audience_level:i,philosopher_length:l,commentator_length:c,moderator_length:u,debate_format:r,format_roles:d})}async function Qe(e,s,t,a="",n={},i=""){return U(`/sessions/${e}/steer`,{text:s,style:t,evidence:a,drinks:n,producer_directive:i})}async function Xe(e){return U("/search",{query:e})}async function Je(e){return U("/suggest-cast",{topic:e})}async function Ze(e){return U("/suggest-topic",{characters:e})}async function et(e,s){return U(`/sessions/${e}/new-topic`,{topic:s})}async function tt(e){return Ge(`/sessions/${e}`)}async function st(e){return U(`/sessions/${e}/newspaper`,{})}async function at(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const i=await s.json().catch(()=>({detail:s.statusText}));throw new Error(i.detail||s.statusText)}const t=await s.blob(),a=URL.createObjectURL(t),n=document.createElement("a");n.href=a,n.download="philosophers-bar-podcast.mp3",document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(a)}async function nt(e,s,t={}){const a={drinks:t};return s!==null&&(a.heat=s),U(`/sessions/${e}/cheat`,a)}function it(e,s){const t=new EventSource(`${B}/sessions/${e}/stream`);return t.onmessage=a=>{try{const n=JSON.parse(a.data);s(n)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const Ee="https://github.com/mhughes72/fungame03";function qe(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
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
  `)}function rt(e,s,t,{isLocal:a=!1,skin:n={}}={}){const i=n.appName??"THE PHILOSOPHER'S BAR",l=n.setupSub??"Select 2–4 thinkers for tonight's debate",c=n.charFilterPlaceholder??"Filter thinkers…",u=n.topicLabel??"What should they discuss?",r=n.topicPlaceholder??"What is the nature of justice?",d=n.startLabel??"Open the bar ▶";n.orLabel;const w=n.dotdLoadingText??"generating tonight's debate…";e.innerHTML=`
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
          <div class="dotd-loading">${H(w)}</div>
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
          ${(()=>{const o=["Philosophy","Science","Politics","Arts","Literature","Technology","Media","Psychology","Religion"],b={};for(const y of s){const E=y.category||"Other";(b[E]=b[E]||[]).push(y)}return o.filter(y=>b[y]).map(y=>`
              <div class="char-category-group">
                <div class="char-category-label">${H(y)}</div>
                <div class="char-category-cards">
                  ${b[y].map(E=>{const A=E.name.replace(/ /g,"_"),P=E.name.split(" ").map(de=>de[0]).join("").slice(0,2).toUpperCase();return`<label class="char-card"
                        data-name="${E.name.toLowerCase()}"
                        data-desc="${H(E.known_for)}"
                        data-category="${H(y)}">
                        <input type="checkbox" value="${H(E.name)}" />
                        <div class="char-card-img">
                          <img src="/portraits/${A}.png" alt=""
                            onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
                          <div class="char-card-initials" style="display:none">${H(P)}</div>
                        </div>
                        <div class="char-card-name">${H(E.name)}</div>
                      </label>`}).join("")}
                </div>
              </div>`).join("")})()}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">${u}</label>
        <div class="advanced-generate-heading">or generate a debate</div>
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
        <div class="topic-error" id="topic-error"></div>

        <div class="adv-section-title">more experimental features</div>

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
            <div class="adv-inner-title">character response style</div>
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
        <div class="start-error" id="start-error"></div>

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
  `;const h=e.querySelectorAll("#char-list input[type=checkbox]"),S=e.querySelectorAll(".char-card"),m=e.querySelector("#char-no-results"),L=e.querySelector("#char-filter");L.addEventListener("input",()=>{const o=L.value.toLowerCase().trim();let b=0;S.forEach(y=>{const E=!o||y.dataset.name.includes(o);y.style.display=E?"":"none",E&&b++}),e.querySelectorAll(".char-category-group").forEach(y=>{const E=[...y.querySelectorAll(".char-card")].some(A=>A.style.display!=="none");y.style.display=E?"":"none"}),m.style.display=b===0?"":"none"});const x=document.createElement("div");x.className="char-tooltip",x.style.display="none",document.body.appendChild(x);function k(o){const{desc:b,category:y}=o.currentTarget.dataset;b&&(x.innerHTML=`
      <div class="tt-body">
        ${y?`<span class="tt-category">${H(y)}</span>`:""}
        <span class="tt-desc">${H(b)}</span>
      </div>`,x.style.display="block",_(o))}function _(o){const y=x.offsetWidth,E=x.offsetHeight;let A=o.clientX+14,P=o.clientY+14;A+y>window.innerWidth-14&&(A=o.clientX-y-14),P+E>window.innerHeight-14&&(P=o.clientY-E-14),x.style.left=A+"px",x.style.top=P+"px"}function v(){x.style.display="none"}S.forEach(o=>{o.addEventListener("mouseenter",k),o.addEventListener("mousemove",_),o.addEventListener("mouseleave",v)}),e.querySelectorAll(".format-opt").forEach(o=>{o.addEventListener("mouseenter",k),o.addEventListener("mousemove",_),o.addEventListener("mouseleave",v)});const $=new MutationObserver(()=>{document.body.contains(e)||(x.remove(),$.disconnect())});$.observe(document.body,{childList:!0,subtree:!0}),a&&(e.querySelector("#setup-lengths").style.display="");const C=e.querySelector("#setup-box"),N=e.querySelector("#mode-to-advanced"),O=e.querySelector("#mode-to-simple"),j=e.querySelector(".setup-title");N.addEventListener("click",()=>{C.classList.replace("setup-box--simple","setup-box--advanced"),j.textContent="THE PHILOSOPHER'S EXPERIMENT";const o=e.querySelector('input[name="debate-format"][value="oxford"]');o&&!o.checked&&(o.checked=!0,ee())}),O.addEventListener("click",()=>{C.classList.replace("setup-box--advanced","setup-box--simple"),j.textContent=i;const o=e.querySelector('input[name="debate-format"][value=""]');o&&!o.checked&&(o.checked=!0,ee())});const q=e.querySelector("#selection-hint"),f=e.querySelector("#start-btn"),g=e.querySelector("#setup-error"),T=e.querySelector("#topic-error"),I=e.querySelector("#start-error");function G(){const o=[...h].filter(E=>E.checked).length,b=V.value.trim().length>0;e.querySelector("#char-list").classList.toggle("char-list--maxed",o>=4),o<2?(q.textContent=o===0?"Select 2 to 4 thinkers":"Select 1 more",q.classList.remove("hint-ok","hint-warn")):o>4?(q.textContent=`Too many — deselect ${o-4}`,q.classList.add("hint-warn"),q.classList.remove("hint-ok")):b?(q.textContent=`${o} selected`,q.classList.add("hint-ok"),q.classList.remove("hint-warn")):(q.textContent="Enter a debate topic",q.classList.remove("hint-ok","hint-warn")),f.disabled=o<2||o>4||!b;const y=e.querySelector("#suggest-topic-btn");y&&(y.disabled=o<2||o>4)}e.querySelector("#char-list"),e.querySelector("#char-filter");const V=e.querySelector("#topic-input");V.addEventListener("input",()=>{T.textContent="",G()}),e.querySelector(".setup-or"),e.querySelector(".topic-label"),e.querySelector(".topic-row"),e.querySelector("#cast-suggestion"),G();const J=e.querySelector("#suggest-btn"),Y=e.querySelector("#cast-suggestion");let ce=!1;J.addEventListener("click",async()=>{const o=V.value.trim();if(!o){V.focus();return}T.textContent="",J.disabled=!0,J.textContent="thinking…",Y.innerHTML='<div class="cs-loading">selecting the best minds for this topic…</div>',Y.style.display="";try{const{picks:b}=await Je(o);if(!b||!b.length)return;h.forEach(E=>{E.checked=!1}),b.forEach(({name:E})=>{const A=e.querySelector(`#char-list input[value="${CSS.escape(E)}"]`);A&&(A.checked=!0)}),ce=!0,G(),Y.innerHTML='<div class="cs-header">── suggested cast ──</div>'+b.map(E=>`<div class="cs-pick">
            <span class="cs-name">${H(E.name)}</span>
            <span class="cs-reason">${H(E.reason)}</span>
          </div>`).join(""),Y.style.display="";const y=e.querySelector(`.char-card[data-name="${b[0].name.toLowerCase()}"]`);y&&y.scrollIntoView({block:"nearest",behavior:"smooth"})}catch(b){Y.style.display="none",T.textContent=b.message||"Could not suggest a cast — please try again."}finally{J.disabled=!1,J.textContent="Suggest cast ✦"}});const Z=e.querySelector("#suggest-topic-btn"),K=e.querySelector("#topic-suggestion");Z.addEventListener("click",async()=>{const o=[...h].filter(b=>b.checked).map(b=>b.value);if(!(o.length<2)){Z.disabled=!0,Z.textContent="thinking…",K.innerHTML='<div class="cs-loading">finding the perfect flashpoint…</div>',K.style.display="";try{const{topic:b,reason:y}=await Ze(o);if(!b)return;V.value=b,K.innerHTML=`<div class="cs-header">── suggested topic ──</div><div class="cs-pick">
          <span class="cs-name">${H(b)}</span>
          <span class="cs-reason">${H(y)}</span>
        </div>`,K.style.display=""}catch(b){console.error("suggest topic failed",b),K.style.display="none"}finally{Z.disabled=!1,Z.textContent="Suggest topic ✦"}}}),h.forEach(o=>o.addEventListener("change",()=>{ce&&(Y.style.display="none",ce=!1),K.style.display="none",G()}));function ve(){const o=e.querySelector('input[name="audience"]:checked'),b=e.querySelector('input[name="phil-length"]:checked'),y=e.querySelector('input[name="comm-length"]:checked'),E=e.querySelector('input[name="mod-length"]:checked'),A=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:o?o.value:"university",philosopherLength:b?b.value:"normal",commentatorLength:y?y.value:"normal",moderatorLength:E?E.value:"normal",debateFormat:A?A.value:""}}f.addEventListener("click",async()=>{const o=[...h].filter(E=>E.checked).map(E=>E.value),b=e.querySelector("#topic-input").value.trim();T.textContent="",I.textContent="",g.textContent="";const y=f.textContent;f.disabled=!0,f.textContent="opening…";try{await t({characters:o,topic:b,...ve()})}catch{}finally{document.contains(f)&&(f.textContent=y,G())}}),e.querySelector("#topic-input").addEventListener("keydown",o=>{o.key==="Enter"&&!f.disabled&&f.click()}),e.querySelector("#setup-about").addEventListener("click",Ce),e.querySelector("#setup-help").addEventListener("click",Ne);const W=e.querySelector("#dotd-card"),je={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let he=[],Q=[],D=-1;function fe(){const o=e.querySelector('input[name="audience"]:checked');return o?o.value:"university"}function De(){const o=e.querySelector('input[name="debate-format"]:checked');return o?o.value:""}function be(o){const b=De();return he.filter(y=>(b==="oxford"?y.format==="oxford":b==="cable_news"?y.format==="cable_news":y.format!=="oxford"&&y.format!=="cable_news")&&(b==="cable_news"||y.audience_level===o))}function ye(o,b=null){if(!o.length)return null;const y=b?o.filter(P=>P.id!==b.id):o,E=y.length?y:o,A=[];for(const P of E)A.push(P),P.source==="curated"&&(A.push(P),A.push(P));return A[Math.floor(Math.random()*A.length)]}function ae(o){const b=je[o.category]||"var(--text-dim)",y=o.format==="oxford",E=o.format==="cable_news";W.classList.toggle("dotd-card--cable",E);const A=y?'<span class="dotd-oxford">🎓 Oxford</span>':E?"":'<span class="dotd-freeform">Freeform</span>',P=y?"":o.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',de=o.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${o.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${o.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${o.characters.join(" · ")}</div>`,Fe=E?`
      <div class="cable-dotd-bar">
        <span class="cable-dotd-live"><span class="cable-dotd-dot"></span>LIVE</span>
        <span class="cable-dotd-breaking">BREAKING NOW</span>
        <span class="cable-dotd-channel">📺 DEBATE ZONE</span>
      </div>`:"";W.innerHTML=`
      ${Fe}
      <div class="dotd-header">
        <span class="dotd-label">${E?"TONIGHT'S SHOWDOWN":"── SUGGESTED DEBATE ──"}</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${b}">${o.category.toUpperCase()}</span>
          ${A}
          ${P}
        </span>
      </div>
      ${de}
      <div class="dotd-topic">${H(o.topic)}</div>
      <div class="dotd-tagline">${H(o.tagline)}</div>
      <div class="dotd-actions">
        <button class="dotd-new-btn" id="dotd-prev" ${D<=0?"disabled":""}>← Prev</button>
        <button class="dotd-start-btn" id="dotd-start">${E?"🔴 GO LIVE ▶":"Start this debate ▶"}</button>
        <button class="dotd-new-btn" id="dotd-next">Next →</button>
      </div>
    `,W.querySelector("#dotd-start").addEventListener("click",()=>{const te=y?"oxford":E?"cable_news":"";t({characters:o.characters,topic:o.topic,...ve(),debateFormat:te,formatRoles:o.roles||null})}),W.querySelector("#dotd-prev").addEventListener("click",()=>{D>0&&(D--,ae(Q[D]))}),W.querySelector("#dotd-next").addEventListener("click",()=>{if(D<Q.length-1)D++,ae(Q[D]);else{const te=ye(be(fe()),Q[D]);te&&(Q.push(te),D++,ae(te))}})}function ee(){const o=ye(be(fe()));o?(Q=[o],D=0,ae(o)):W.style.display="none"}return Ve().then(o=>{he=o,ee()}).catch(()=>{W.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(o=>{o.addEventListener("change",ee)}),e.querySelectorAll('input[name="debate-format"]').forEach(o=>{o.addEventListener("change",ee)}),{showError(o){C.classList.contains("setup-box--advanced")?(I.textContent=o,T.textContent=""):(T.textContent=o,I.textContent="")}}}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function R(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ot(e){const s=(e-.2)/3.8*100,t=Math.max(0,Math.min(100,s)).toFixed(1),a=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030";return`<div class="ratings-bar-track"><div class="ratings-bar-fill" style="width:${t}%;background:${a}"></div></div>`}const lt={get_them_fighting:"🥊",force_soundbite:"💬",push_narrative:"📢",wrap_it_up:"⏱️",go_soft:"🕊️"},ct={get_them_fighting:"fight",force_soundbite:"soundbite",push_narrative:"narrative",wrap_it_up:"wrap up",go_soft:"go soft"},dt={socratic:"💭",combative:"⚔️","devil's advocate":"😈",koan:"☯️",journalist:"🎤","straw man":"🪆","steel man":"🛡️","last call":"🔔"};function pt(e,s,t="",a,n=null,i=[],l={}){const c=l.moderatorStyleNames??{},u=l.steerTitle??"── STEER THE DEBATE ──",r=l.steerQuitLabel??"Quit game",d=l.steerInputPlaceholder??"Speak into the debate — or leave blank for the moderator…",w=l.steerSubmitLabel??"Steer ▶",h=l.evidencePlaceholder??"Search term — result will be injected as empirical fact…";return new Promise(S=>{const m=document.createElement("div");m.className="steer-drawer",m.innerHTML=`
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
        <button class="steer-submit-btn" id="steer-submit">${R(w)}</button>
      </div>

      <div class="style-grid" id="style-grid">
        ${s.map(f=>{const g=dt[f.style]??"◆",T=c[f.style]??f.style;return`<button
            class="style-icon-btn${f.style===e?" style-selected":""}"
            data-style="${R(f.style)}"
            title="${R(T+" — "+f.description)}"
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
            placeholder="${R(h)}"
            autocomplete="off"
          />
          <button class="steer-search-btn" id="evidence-search">Search</button>
        </div>
        <div id="evidence-preview" class="evidence-preview" style="display:none"></div>
      </div>
    `,(a||document.body).appendChild(m);const x=m.querySelector("#steer-text-input");x.focus();let k=e,_="";m.querySelectorAll(".style-icon-btn").forEach(f=>{f.addEventListener("click",()=>{m.querySelectorAll(".style-icon-btn").forEach(g=>g.classList.remove("style-selected")),f.classList.add("style-selected"),k=f.dataset.style,q()})});const v=m.querySelector("#evidence-toggle"),$=m.querySelector("#evidence-panel"),C=m.querySelector("#evidence-preview"),N=m.querySelector("#evidence-query"),O=m.querySelector("#evidence-search");v.addEventListener("click",()=>{const f=$.style.display==="none";$.style.display=f?"":"none",v.classList.toggle("steer-pill--active",f),f&&N.focus()});async function j(){const f=N.value.trim();if(!(!f||!n)){O.disabled=!0,O.textContent="Searching…",C.style.display="none",_="";try{const g=await n(f);_=g.finding,C.style.display="block",C.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${R(g.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,C.querySelector("#evidence-accept").addEventListener("click",()=>{C.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${R(_)}</div>`}),C.querySelector("#evidence-discard").addEventListener("click",()=>{_="",C.style.display="none"})}catch(g){C.style.display="block",C.textContent=`Search failed: ${g.message}`}finally{O.disabled=!1,O.textContent="Search"}}}O.addEventListener("click",j),N.addEventListener("keydown",f=>{f.key==="Enter"&&j()});function q(){m.remove(),S({text:x.value.trim(),style:k,evidence:_})}m.querySelector("#steer-submit").addEventListener("click",q),m.querySelector("#steer-quit").addEventListener("click",()=>{m.remove(),S(null)}),x.addEventListener("keydown",f=>{f.key==="Enter"&&q()})})}function ut(e,s,t={}){const{ratings:a=.8,peak_ratings:n=.8,producer_note:i="",producer_stress:l=0,directives:c=[]}=e,u=["","nervous","stressed","PANICKING","MELTDOWN","FIRE FIRE FIRE"],r=l>0?` (${u[Math.min(l,5)]})`:"",d=l>=3;return new Promise(w=>{const h=document.createElement("div");h.className="steer-drawer",h.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── COMMERCIAL BREAK ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      <div class="commercial-ratings-row">
        <span class="commercial-ratings-num">📺 ${a.toFixed(1)}M</span>
        <span class="commercial-ratings-peak">peak ${n.toFixed(1)}M</span>
        ${ot(a)}
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
        ${c.map(([k,_])=>{const v=lt[k]??"◆",$=ct[k]??k.replace(/_/g," ");return`<button
            class="style-icon-btn"
            data-directive="${R(k)}"
            title="${R($+" — "+_)}"
          >
            <span class="style-icon-glyph">${v}</span>
            <span class="style-icon-name">${R($)}</span>
          </button>`}).join("")}
      </div>
    `,(s||document.body).appendChild(h);const m=h.querySelector("#steer-text-input");m.focus();let L="";h.querySelectorAll("#directive-list .style-icon-btn").forEach(k=>{k.addEventListener("click",()=>{h.querySelectorAll("#directive-list .style-icon-btn").forEach(_=>_.classList.remove("style-selected")),k.classList.add("style-selected"),L=k.dataset.directive,x()})});function x(){const k=m.value.trim();h.remove(),w({text:k,producer_directive:L})}h.querySelector("#steer-submit").addEventListener("click",x),h.querySelector("#steer-quit").addEventListener("click",()=>{h.remove(),w(null)}),m.addEventListener("keydown",k=>{k.key==="Enter"&&x()})})}function ie(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Se=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function gt(e,s,t,a,n=null,i=null,l=null,c=null){return new Promise(u=>{var L,x,k,_;const r={};t.forEach(v=>{r[v]=0});const d=document.createElement("div");d.className="cheat-overlay",d.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${Se[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(v=>`
            <div class="drink-row">
              <span class="drink-name">${ie(v)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${ie(v)}">−</button>
                <span class="drink-count" id="drink-count-${ie(v.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${ie(v)}">+</button>
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
    `,document.body.appendChild(d);const w=d.querySelector("#cheat-heat-slider"),h=d.querySelector("#cheat-heat-value");w.addEventListener("input",()=>{const v=parseInt(w.value,10);h.textContent=`${v} — ${Se[v]}`}),d.querySelectorAll(".drink-btn").forEach(v=>{v.addEventListener("click",()=>{const $=v.dataset.name,C=v.classList.contains("drink-plus")?1:-1;r[$]=Math.max(0,(r[$]||0)+C);const N=$.replace(/ /g,"_"),O=d.querySelector(`#drink-count-${N}`);O&&(O.textContent=r[$])})});function S(){d.remove(),u()}async function m(){const v=parseInt(w.value,10),$=Object.fromEntries(Object.entries(r).filter(([,N])=>N>0)),C=v!==s;try{await a(e,C?v:null,$)}catch(N){console.error("Cheat failed:",N)}S()}d.querySelector("#cheat-apply").addEventListener("click",m),d.querySelector("#cheat-close").addEventListener("click",S),(L=d.querySelector("#cheat-paper"))==null||L.addEventListener("click",()=>{S(),n()}),(x=d.querySelector("#cheat-podcast"))==null||x.addEventListener("click",()=>{S(),i()}),(k=d.querySelector("#cheat-consensus"))==null||k.addEventListener("click",()=>{S(),c()}),(_=d.querySelector("#cheat-end"))==null||_.addEventListener("click",()=>{S(),l()}),d.addEventListener("click",v=>{v.target===d&&S()})})}function mt(e,s,t={}){e.innerHTML=s.map(u=>{if(t.renderSeat)return t.renderSeat(u,ke(u),pe(u),Le(u),xe(u));const r=ke(u),d=xe(u);return`
      <div class="seat" id="seat-${pe(u)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${r}" alt="${ue(u)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${ue(d)}</div>
        </div>
        <div class="seat-name">${ue(Le(u))}</div>
      </div>
    `}).join("");let a=null;function n(u){return e.querySelector(`#seat-${pe(u)}`)}function i(){clearTimeout(a),e.querySelectorAll(".seat").forEach(u=>{u.classList.remove("seat-thinking","seat-speaking")})}function l(u){var r;i(),(r=n(u))==null||r.classList.add("seat-thinking")}function c(u){i();const r=n(u);r&&(r.classList.add("seat-speaking"),a=setTimeout(()=>r.classList.remove("seat-speaking"),3e3))}return{setThinking:l,setSpeaking:c,clearAll:i}}function ke(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function xe(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function Le(e){return e.split(" ").at(-1)}function pe(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function ue(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function vt(e,s,t,a,n,i){const l=i.skin??{},c=l.appName??"THE PHILOSOPHER'S BAR";e.innerHTML=`
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
  `;const u=e.querySelector("#seats-bar"),r=e.querySelector("#convo-pane"),d=e.querySelector("#sidebar"),w=e.querySelector("#left-col");let h="socratic",S=0,m=null,L=!1,x=!1,k="",_={},v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},$=.8,C=[];const N=mt(u,t,l);z(d,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const f=document.createElement("div");f.id="debate-starting",f.className="debate-starting",f.innerHTML=`<span class="debate-starting-text">${l.debateStartingText??"Opening the bar"}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,r.appendChild(f)}function O(){var f;(f=r.querySelector("#debate-starting"))==null||f.remove()}function j({type:f,data:g}){switch(f){case"speaker":O(),N.setThinking(g.name),_t(r,g.name);break;case"message":O(),F(r),g.backchannel||N.setSpeaking(g.name),ht(r,g);break;case"bars":S=g.heat??S,Tt(d,g.heat,g.concession_total??0);break;case"debug":{const T=g.data!=null?g.data:"",I=typeof T=="object"?`
`+Object.entries(T).map(([G,V])=>`  ${G}: ${JSON.stringify(V)}`).join(`
`):T?` — ${T}`:"";console.log(`[${g.channel}] ${g.label}${I}`);break}case"oxford_opening_vote":v={...v,oxford_opening_vote:g},z(d,{topic:a,...v,debate_phase:k,format_roles:_});break;case"oxford_verdict":xt(r,g);break;case"phase_update":k=g.debate_phase,_=g.format_roles||{},z(d,{topic:a,...v,debate_phase:k,format_roles:_});break;case"state":F(r),h=g.moderator_style,S=g.heat??S,g.debate_phase&&(k=g.debate_phase),g.format_roles&&Object.keys(g.format_roles).length&&(_=g.format_roles),v={...g,debate_phase:k,format_roles:_},z(d,{topic:a,...v});break;case"cable_ratings":$=g.ratings??$,C=g.history??C,qt(d,$,C);break;case"chyron":g.text&&Et(r,g.text);break;case"breaking_news":g.headline&&St(r,g.headline);break;case"producer_whisper":kt(r,g.note,g.stress);break;case"commercial_break":if(x)break;x=!0,$=g.ratings??$,r.scrollTop=r.scrollHeight,ut(g,w,l).then(T=>{x=!1,T===null?_e(r,{reason:"quit",report:{}},t,q):i.steer(s,T.text,"socratic","",{},T.producer_directive).catch(I=>X(r,`Error: ${I.message}`))});break;case"cable_news_end":if(L)break;L=!0,m&&(m(),m=null),F(r),N.clearAll(),_e(r,g,t,q);break;case"steer_needed":if(x)break;x=!0,h=g.current_style,g.drift_topic&&bt(r,g.drift_topic,a),r.scrollTop=r.scrollHeight,pt(h,n,Ot(v),w,i.searchEvidence,t,l).then(T=>{x=!1,T===null?re(r,v,t,q,s,i):(h=T.style,z(d,{topic:a,...v,moderator_style:T.style}),i.steer(s,T.text,T.style,T.evidence||"",T.drinks||{}).catch(I=>X(r,`Steer error: ${I.message}`)))});break;case"consensus":if(L)break;L=!0,m&&(m(),m=null),F(r),N.clearAll(),Te(r,g,{onNewTopic(T){i.newTopic(s,T).then(()=>{L=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=T,z(d,{topic:T,...v,moderator_style:h,points_of_agreement:[]}),N.clearAll(),m=i.openStream(s,j)}).catch(I=>X(r,`Error: ${I.message}`))},onQuit:q},v,s,i,t);break;case"game_over":if(L)break;L=!0,m&&(m(),m=null),F(r),N.clearAll(),re(r,{...v,...g},t,q,s,i);break;case"bar_beat":O(),ft(r,g.text);break;case"commentator":O(),yt(r,g.text);break;case"evidence":O(),wt(r,g.finding);break;case"diagram":O(),$t(r,g);break;case"system":O(),X(r,g.text);break;case"error":O(),X(r,`⚠ ${g.text}`);break}}function q(){m&&m(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",Ce),e.querySelector("#help-btn").addEventListener("click",Ne),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const g=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=g?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{L||gt(s,S,t,i.cheat,()=>ge(s,i,t),()=>Lt(s,i),()=>{L=!0,m&&(m(),m=null),F(r),N.clearAll(),re(r,v,t,q,s,i)},()=>{L=!0,m&&(m(),m=null),F(r),N.clearAll(),Te(r,{summary:"The bar has called it — the evening ends in agreement.",points:v.points_of_agreement||[]},{onNewTopic(f){i.newTopic(s,f).then(()=>{L=!1,v={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=f,z(d,{topic:f,...v,moderator_style:h,points_of_agreement:[]}),N.clearAll(),m=i.openStream(s,j)}).catch(g=>X(r,`Error: ${g.message}`))},onQuit:q},v,s,i,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(L){q();return}v.turn>0?(L=!0,m&&(m(),m=null),re(r,v,t,q,s,i)):q()}),m=i.openStream(s,j)}function ht(e,{role:s,name:t,content:a,backchannel:n,debate_label:i="",catchphrase:l=""}){const c=document.createElement("div");if(n)c.className="msg msg-bc",c.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${se(a)}</em>`;else if(s==="moderator")c.className="msg msg-moderator",c.innerHTML=`<div class="msg-mod-label">― ${p(t)} ―</div><div class="msg-content">${se(a)}</div>`;else if(s==="user")c.className="msg msg-user",c.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${se(a)}</div>`;else{const u=`/portraits/${t.replace(/ /g,"_")}.png`,r=t.split(" ").map(h=>h[0]).join("").slice(0,2).toUpperCase(),w=i.includes("Proposition")?"debate-label-prop":"debate-label-opp";c.className="msg msg-philosopher",c.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${u}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(r)}</div></div><div class="msg-body">`+(i?`<div class="msg-debate-label ${w}">${p(i)}</div>`:"")+`<div class="msg-name">${p(t)}</div><div class="msg-content">${se(a,l)}</div></div>`}M(e,c)}function ft(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=se(s),M(e,t)}function X(e,s){const t=document.createElement("div");t.className="msg msg-system",s.endsWith("…")?t.innerHTML=p(s.slice(0,-1))+'<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>':t.textContent=s,M(e,t)}function bt(e,s,t){const a=document.createElement("div");a.className="msg msg-drift",a.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${p(s)}</div><div class="drift-orig">original: ${p(t)}</div>`,M(e,a)}function yt(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${p(s)}</span>`,M(e,t)}function wt(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,M(e,t)}function $t(e,{speaker:s,title:t,thumb_url:a,url:n,page_url:i}){const l=document.createElement("div");l.className="msg msg-diagram",l.innerHTML=`<div class="diagram-label">${p(s)} produces a diagram</div><a class="diagram-link" href="${p(i)}" target="_blank" rel="noopener"><img class="diagram-img" src="${p(a)}" alt="${p(t)}" /><div class="diagram-caption">${p(t)}</div></a>`,M(e,l)}function Et(e,s){const t=document.createElement("div");t.className="msg msg-chyron",t.textContent=s,M(e,t)}function St(e,s){const t=document.createElement("div");t.className="msg msg-breaking-news",t.innerHTML=`<div class="breaking-label">🔴 BREAKING NEWS</div><div class="breaking-headline">${p(s)}</div>`,M(e,t)}function kt(e,s,t){if(!s)return;const a=document.createElement("div");a.className="msg msg-producer-whisper";const n=t>=3?"[PRODUCER!!!]":"[PRODUCER]";a.innerHTML=`<span class="producer-tag${t>=3?" producer-tag-high":""}">${n}</span> ${p(s)}`,M(e,a)}function _e(e,{reason:s,report:t={}},a,n,i,l){F(e);const c=s==="viral",r=c?"📺 SHOW WENT VIRAL":s==="cancelled"?"📺 SHOW CANCELLED":"📺 LAST CALL",d=c?"cable-end-viral":"cable-end-cancelled",{final_ratings:w=0,peak_ratings:h=0,turn_count:S=0,breaking_news_count:m=0,network_offers:L={},catchphrases:x={},guest_stats:k={}}=t,_=Object.entries(L).length?`<div class="end-section cable-end-offers">
        <div class="end-section-label" style="color:var(--amber)">network offers</div>
        ${Object.entries(L).map(([N,O])=>`<div class="cable-offer-row">
            <span class="cable-offer-name">${p(N)}</span>
            <span class="cable-offer-text">${p(O)}</span>
          </div>`).join("")}
      </div>`:"",v=Object.keys(x).length?`<div class="end-section">
        <div class="end-section-label" style="color:var(--blue)">guest catchphrases</div>
        ${Object.entries(x).map(([N,O])=>{const q=(k[N]||{}).catchphrase_count||0;return`<div class="cable-catchphrase-row">
            <span class="cable-cp-name">${p(N)}:</span>
            <span class="cable-cp-phrase">"${p(O)}"</span>
            <span class="cable-cp-count">${q}×</span>
          </div>`}).join("")}
      </div>`:"",$=S?`<div class="end-scoreboard">
        <div class="end-stat">
          <span class="end-stat-num">${S}</span>
          <span class="end-stat-lbl">turns</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--amber)">${w.toFixed(1)}M</span>
          <span class="end-stat-lbl">final ratings</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--green)">${h.toFixed(1)}M</span>
          <span class="end-stat-lbl">peak</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num">${m}</span>
          <span class="end-stat-lbl">breaking news</span>
        </div>
      </div>`:"",C=document.createElement("div");C.className="end-panel",C.innerHTML=`
    <div class="end-title ${d}">━━━ ${r} ━━━</div>
    ${$}
    ${_}
    ${v}
    <div class="end-actions">
      <div class="end-btn-row">
        <button class="end-leave-btn" id="cable-end-leave">Leave the studio</button>
      </div>
    </div>
  `,M(e,C),C.querySelector("#cable-end-leave").addEventListener("click",n)}function xt(e,{winner:s,proposition_open:t,proposition_final:a,margin:n,persona_verdicts:i,verdict:l}){const c=s==="proposition"?"PROPOSITION WINS":"OPPOSITION WINS",u=s==="proposition"?"oxford-verdict-prop":"oxford-verdict-opp",r=a===50,d=Math.min(t,a),h=Math.max(t,a)-d,S=a>t,m=S?"var(--green)":"var(--amber)",L=(n>=0?"+":"")+n+" pts",x=`
    <div class="oxford-shift-wrap">
      <div class="oxford-shift-ends"><span>Opp 0%</span><span>Prop 100%</span></div>
      <div class="oxford-shift-track">
        <div class="oxford-shift-fill" style="left:${d}%;width:${h}%;background:${m}"></div>
        <div class="oxford-shift-mark oxford-shift-mark-open" style="left:${t}%">
          <div class="oxford-shift-pip"></div>
          <div class="oxford-shift-pip-label">${t}%</div>
        </div>
        <div class="oxford-shift-mark oxford-shift-mark-close" style="left:${a}%">
          <div class="oxford-shift-pip oxford-shift-pip-close"></div>
          <div class="oxford-shift-pip-label oxford-shift-pip-label-close">${a}%</div>
        </div>
      </div>
      <div class="oxford-shift-margin" style="color:${m}">${S?"→":"←"} ${L}</div>
    </div>
  `,k=r?'<div class="oxford-verdict-tie">The motion falls — a tie goes to the opposition.</div>':"",_=document.createElement("div");_.className="oxford-verdict-card",_.innerHTML=`
    <div class="oxford-verdict-title">── THE VERDICT ──</div>
    ${x}
    <div class="oxford-verdict-winner ${u}">${c}</div>
    ${k}
    <div class="oxford-verdict-text">${p(l)}</div>
    <ul class="oxford-verdict-personas">
      ${(i||[]).map(v=>`<li>${p(v)}</li>`).join("")}
    </ul>
  `,M(e,_)}function Te(e,{summary:s,points:t},{onNewTopic:a,onQuit:n},i={},l,c,u=[]){var w;const r=document.createElement("div");r.className="end-panel",r.innerHTML=`
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
  `,M(e,r);const d=r.querySelector("#consensus-topic-input");d.focus(),r.querySelector("#consensus-continue").addEventListener("click",()=>{const h=d.value.trim();h&&a(h)}),d.addEventListener("keydown",h=>{if(h.key==="Enter"){const S=d.value.trim();S&&a(S)}}),r.querySelector("#consensus-end").addEventListener("click",n),(w=r.querySelector("#consensus-paper"))==null||w.addEventListener("click",()=>ge(l,c,u))}function re(e,s,t,a,n,i){var r;F(e);const l=document.createElement("div");l.className="end-panel";const c=s.turn||0,u=c?`${c} turn${c!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${p(u)}</blockquote>
    ${Oe(s)}
    ${Ae([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${n?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,M(e,l),l.querySelector("#game-over-leave").addEventListener("click",a),(r=l.querySelector("#game-over-paper"))==null||r.addEventListener("click",()=>ge(n,i,t))}async function Lt(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
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
    </div>`),l}function _t(e,s){F(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,M(e,t)}function F(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function z(e,s){var _,v;const{topic:t,turn:a=0,heat:n=0,concession_total:i=0,moderator_style:l="socratic",partial_agreements:c=[],points_of_agreement:u=[],remaining_disagreements:r=[],debate_phase:d="",format_roles:w={},oxford_opening_vote:h=null}=s,S={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},m=d&&S[d]?`<div class="sb-phase-banner">${S[d].toUpperCase()}</div>`:"",L=d&&(w.proposition||w.opposition)?'<div class="sb-roles">'+((_=w.proposition)!=null&&_.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${w.proposition.map($=>p($)).join(", ")}</div>`:"")+((v=w.opposition)!=null&&v.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${w.opposition.map($=>p($)).join(", ")}</div>`:"")+"</div>":"",x=h?`<details class="oxford-opening-banner">
        <summary class="oxford-opening-summary">
          Opening position: <strong>${h.proposition_pct}%</strong> for proposition
        </summary>
        <div class="oxford-opening-detail">
          <div class="oxford-opening-rationale">${p(h.rationale||"")}</div>
          <ul class="oxford-opening-leanings">
            ${(h.persona_leanings||[]).map($=>`<li>${p($)}</li>`).join("")}
          </ul>
        </div>
      </details>`:"";let k=`
    ${m}
    ${L}
    ${x}
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${p(t)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${a}</div>
  `;u.length&&(k+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${u.map($=>`<div class="sb-agree-item">✓ ${p($)}</div>`).join("")}
      </div>
    `),c.length&&(k+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${c.map($=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p($.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p($.on)}</div>
          </div>
        `).join("")}
      </div>
    `),r.length&&(k+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${r.map($=>typeof $=="object"&&$!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p($.topic)}</div>
                <div class="sb-tension-stance">${p($.participant_a)}: ${p($.stance_a)}</div>
                <div class="sb-tension-stance">${p($.participant_b)}: ${p($.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String($))}</div>`).join("")}
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
  `,e.innerHTML=k}function se(e,s=""){let t=p(e);if(s){const n=p(s),i=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");t=t.replace(i,l=>`<mark class="catchphrase-hl">${l}</mark>`)}return t.replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function M(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function He(e,s){const t=Pe(e),a=Re(e),n="█".repeat(e),i="░".repeat(10-e),l=Math.min(s,10),c=Ct(s),u="█".repeat(l),r="░".repeat(10-l),d=Nt(s);return`
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
  `}function Tt(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=He(s,t))}function qt(e,s,t){const a=e.querySelector("#sb-cable-ratings");a&&(a.style.display="",a.innerHTML=Me(s,t))}function Me(e,s){const t=(e-.2)/3.8*100,a=Math.max(0,Math.min(100,t)).toFixed(1),n=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030",i=s.length>=2?s[s.length-1]>s[s.length-2]?"▲":s[s.length-1]<s[s.length-2]?"▼":"─":"";return`
    <div class="sb-label">── RATINGS ──</div>
    <div class="sb-ratings-num" style="color:${n}">${e.toFixed(1)}M viewers <span class="sb-trend">${i}</span></div>
    <div class="ratings-bar-track">
      <div class="ratings-bar-fill" style="width:${a}%;background:${n}"></div>
    </div>
    <div class="sb-ratings-scale"><span>cancelled</span><span>viral</span></div>
  `}function Pe(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function Re(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Ct(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Nt(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Ot(e,s){const{turn:t,heat:a,partial_agreements:n,remaining_disagreements:i,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const c=n||[],u=i||[];if(c.length&&u.length){const d=c[0],w=u[0],h=d.participants.join(" and "),S=typeof w=="object"?w.topic:String(w);return`${h} are finding common ground, but the group remains divided on ${S}.`}if(c.length){const d=c[0];return`${d.participants.join(" and ")} are converging on ${d.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(u.length){const d=u[0];return typeof d=="object"?`${d.participant_a} and ${d.participant_b} are sharply divided over ${d.topic}.`:`The room is deadlocked — ${String(d)}.`}const r=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${r}.`}const oe=document.querySelector("#app");let le={},me={};const At=new Set(["production","development","staging"]);async function Ht(){const e=At.has("production")?"default":"production",[s]=await Promise.all([$e(Object.assign({"./skins/default/skin.js":()=>ne(()=>import("./skin-D7HGMV-G.js"),[]),"./skins/kids/skin.js":()=>ne(()=>import("./skin-DZ74tMJe.js"),[])}),`./skins/${e}/skin.js`,4),$e(Object.assign({"./skins/default/theme.css":()=>ne(()=>Promise.resolve({}),__vite__mapDeps([0])),"./skins/kids/theme.css":()=>ne(()=>Promise.resolve({}),__vite__mapDeps([1]))}),`./skins/${e}/theme.css`,4)]);return s}async function Ie(){let e,s;try{[e,s,le]=await Promise.all([We(),ze(),Ye()])}catch(n){oe.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=!!le.local,a=rt(oe,e,async({characters:n,topic:i,commentator:l=!0,moderator:c=!0,diagrams:u=!1,audienceLevel:r="university",philosopherLength:d="normal",commentatorLength:w="normal",moderatorLength:h="normal",debateFormat:S="",formatRoles:m=null})=>{try{const L=await Ke(n,i,l,c,u,r,d,w,h,S,m);Mt(L.session_id,n,i,s)}catch(L){throw a.showError(L.message),L}},{isLocal:t,skin:me})}function Mt(e,s,t,a){vt(oe,e,s,t,a,{skin:me,steer:Qe,cheat:nt,deleteSession:tt,newTopic:et,openStream:it,searchEvidence:Xe,fetchNewspaper:st,exportPodcast:le.podcast?at:null,isLocal:!!le.local}),oe.addEventListener("debate:quit",()=>Ie(),{once:!0})}Ht().then(e=>{me=e}).catch(()=>{}).finally(()=>Ie());
