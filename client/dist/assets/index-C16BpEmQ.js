const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/theme-CJEpj9dL.css","assets/theme-ClQV55ib.css"])))=>i.map(i=>d[i]);
(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();const ze="modulepreload",Ye=function(e){return"/"+e},Se={},re=function(s,t,a){let n=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),c=(l==null?void 0:l.nonce)||(l==null?void 0:l.getAttribute("nonce"));n=Promise.allSettled(t.map(u=>{if(u=Ye(u),u in Se)return;Se[u]=!0;const o=u.endsWith(".css"),d=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${d}`))return;const w=document.createElement("link");if(w.rel=o?"stylesheet":ze,o||(w.as="script"),w.crossOrigin="",w.href=u,c&&w.setAttribute("nonce",c),document.head.appendChild(w),o)return new Promise((f,S)=>{w.addEventListener("load",f),w.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${u}`)))})}))}function i(l){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=l,window.dispatchEvent(c),!c.defaultPrevented)throw l}return n.then(l=>{for(const c of l||[])c.status==="rejected"&&i(c.reason);return s().catch(i)})},ke=(e,s,t)=>{const a=e[s];return a?typeof a=="function"?a():Promise.resolve(a):new Promise((n,i)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(i.bind(null,new Error("Unknown variable dynamic import: "+s+(s.split("/").length!==t?". Note that variables only represent file names one level deep.":""))))})},G="/api";async function V(e,s){const t=await fetch(`${G}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});if(!t.ok){let a=`${t.status} ${t.statusText}`;try{const n=await t.json();n.detail&&(a=String(n.detail))}catch{const n=await t.text().catch(()=>"");n&&(a=n)}throw new Error(a)}return t.json()}async function Ke(e){await fetch(`${G}${e}`,{method:"DELETE"})}async function Qe(e=null){const s=e?`${G}/topics?level=${encodeURIComponent(e)}`:`${G}/topics`,t=await fetch(s);if(!t.ok)throw new Error("Failed to load topics");return t.json()}async function Xe(){const e=await fetch(`${G}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function Je(){const e=await fetch(`${G}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function Ze(){const e=await fetch(`${G}/features`);return e.ok?e.json():{}}async function et(e,s,t=!0,a=!0,n=!1,i="university",l="normal",c="normal",u="normal",o="",d=null){return V("/sessions",{characters:e,topic:s,commentator_enabled:t,moderator_enabled:a,diagrams_enabled:n,audience_level:i,philosopher_length:l,commentator_length:c,moderator_length:u,debate_format:o,format_roles:d})}async function tt(e,s,t,a="",n={},i=""){return V(`/sessions/${e}/steer`,{text:s,style:t,evidence:a,drinks:n,producer_directive:i})}async function st(e){return V("/search",{query:e})}async function at(e){return V("/suggest-cast",{topic:e})}async function nt(e){return V("/suggest-topic",{characters:e})}async function rt(e,s){return V(`/sessions/${e}/new-topic`,{topic:s})}async function it(e){return Ke(`/sessions/${e}`)}async function ot(e){return V(`/sessions/${e}/newspaper`,{})}async function lt(e){const s=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!s.ok){const i=await s.json().catch(()=>({detail:s.statusText}));throw new Error(i.detail||s.statusText)}const t=await s.blob(),a=URL.createObjectURL(t),n=document.createElement("a");n.href=a,n.download="philosophers-bar-podcast.mp3",document.body.appendChild(n),n.click(),n.remove(),URL.revokeObjectURL(a)}async function ct(e,s,t={}){const a={drinks:t};return s!==null&&(a.heat=s),V(`/sessions/${e}/cheat`,a)}function dt(e,s){const t=new EventSource(`${G}/sessions/${e}/stream`);return t.onmessage=a=>{try{const n=JSON.parse(a.data);s(n)}catch{console.error("Unparseable SSE frame:",a.data)}},t.onerror=a=>{console.error("SSE error",a),s({type:"error",data:{text:"Connection lost."}})},()=>t.close()}const xe="https://github.com/mhughes72/fungame03";function Oe(e,s){const t=document.createElement("div");t.className="info-overlay",t.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${s}</div>
    </div>
  `,document.body.appendChild(t);function a(){t.remove()}t.querySelector(".info-close").addEventListener("click",a),t.addEventListener("click",n=>{n.target===t&&a()}),document.addEventListener("keydown",function n(i){i.key==="Escape"&&(a(),document.removeEventListener("keydown",n))})}function Ae(){Oe("ABOUT",`
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
    <p><a class="info-link" href="${xe}" target="_blank" rel="noopener">${xe}</a></p>
  `)}function He(){Oe("HOW TO PLAY",`
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
  `)}function pt(e,s,t,{isLocal:a=!1,skin:n={}}={}){const i=n.appName??"THE PHILOSOPHER'S BAR",l=n.setupSub??"Select 2–4 thinkers for tonight's debate",c=n.charFilterPlaceholder??"Filter thinkers…",u=n.topicLabel??"What should they discuss?",o=n.topicPlaceholder??"What is the nature of justice?",d=n.startLabel??"Open the bar ▶";n.orLabel;const w=n.dotdLoadingText??"generating tonight's debate…";e.innerHTML=`
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
          ${(()=>{const r=["Philosophy","Theology","Science","Politics","Arts","Literature","Technology","Media","Psychology"],b={};for(const h of s){const $=h.category||"Other";(b[$]=b[$]||[]).push(h)}return r.filter(h=>b[h]).map(h=>`
              <div class="char-category-group">
                <div class="char-category-label">${H(h)}</div>
                <div class="char-category-cards">
                  ${b[h].map($=>{const C=$.name.replace(/ /g,"_"),M=$.name.split(" ").map(I=>I[0]).join("").slice(0,2).toUpperCase();return`<label class="char-card"
                        data-name="${$.name.toLowerCase()}"
                        data-desc="${H($.known_for)}"
                        data-category="${H(h)}">
                        <input type="checkbox" value="${H($.name)}" />
                        <div class="char-card-img">
                          <img src="/portrait_thumbs/${C}.webp" alt=""
                            data-portrait="${C}"
                            loading="lazy" />
                          <div class="char-card-initials" style="display:none">${H(M)}</div>
                        </div>
                        <div class="char-card-name">${H($.name)}</div>
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
            placeholder="${H(o)}"
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
  `;const f=e.querySelectorAll("#char-list input[type=checkbox]"),S=e.querySelectorAll(".char-card"),m=e.querySelector("#char-no-results"),L=e.querySelector("#char-filter");e.querySelectorAll(".char-card-img img").forEach(r=>{r.addEventListener("error",function b(){r.removeEventListener("error",b),r.src.includes("/portrait_thumbs/")?(r.addEventListener("error",()=>{r.style.display="none",r.nextElementSibling.style.display="flex"}),r.src=`/portraits/${r.dataset.portrait}.png`):(r.style.display="none",r.nextElementSibling.style.display="flex")})}),L.addEventListener("input",()=>{const r=L.value.toLowerCase().trim();let b=0;S.forEach(h=>{const $=!r||h.dataset.name.includes(r);h.style.display=$?"":"none",$&&b++}),e.querySelectorAll(".char-category-group").forEach(h=>{const $=[...h.querySelectorAll(".char-card")].some(C=>C.style.display!=="none");h.style.display=$?"":"none"}),m.style.display=b===0?"":"none"});const x=document.createElement("div");x.className="char-tooltip",x.style.display="none",document.body.appendChild(x);function k(r){const{desc:b,category:h}=r.currentTarget.dataset;b&&(x.innerHTML=`
      <div class="tt-body">
        ${h?`<span class="tt-category">${H(h)}</span>`:""}
        <span class="tt-desc">${H(b)}</span>
      </div>`,x.style.display="block",_(r))}function _(r){const h=x.offsetWidth,$=x.offsetHeight;let C=r.clientX+14,M=r.clientY+14;C+h>window.innerWidth-14&&(C=r.clientX-h-14),M+$>window.innerHeight-14&&(M=r.clientY-$-14),x.style.left=C+"px",x.style.top=M+"px"}function g(){x.style.display="none"}S.forEach(r=>{r.addEventListener("mouseenter",k),r.addEventListener("mousemove",_),r.addEventListener("mouseleave",g)}),e.querySelectorAll(".format-opt").forEach(r=>{r.addEventListener("mouseenter",k),r.addEventListener("mousemove",_),r.addEventListener("mouseleave",g)});const E=new MutationObserver(()=>{document.body.contains(e)||(x.remove(),E.disconnect())});E.observe(document.body,{childList:!0,subtree:!0}),a&&(e.querySelector("#setup-lengths").style.display="");const q=e.querySelector("#setup-box"),O=e.querySelector("#mode-to-advanced"),A=e.querySelector("#mode-to-simple"),B=e.querySelector(".setup-title");O.addEventListener("click",()=>{q.classList.replace("setup-box--simple","setup-box--advanced"),B.textContent="THE PHILOSOPHER'S EXPERIMENT";const r=e.querySelector('input[name="debate-format"][value="oxford"]');r&&!r.checked&&(r.checked=!0,se())}),A.addEventListener("click",()=>{q.classList.replace("setup-box--advanced","setup-box--simple"),B.textContent=i;const r=e.querySelector('input[name="debate-format"][value=""]');r&&!r.checked&&(r.checked=!0,se())});const N=e.querySelector("#selection-hint"),y=e.querySelector("#start-btn"),v=e.querySelector("#setup-error"),T=e.querySelector("#topic-error"),j=e.querySelector("#start-error");function W(){const r=[...f].filter($=>$.checked).length,b=z.value.trim().length>0;e.querySelector("#char-list").classList.toggle("char-list--maxed",r>=4),r<2?(N.textContent=r===0?"Select 2 to 4 thinkers":"Select 1 more",N.classList.remove("hint-ok","hint-warn")):r>4?(N.textContent=`Too many — deselect ${r-4}`,N.classList.add("hint-warn"),N.classList.remove("hint-ok")):b?(N.textContent=`${r} selected`,N.classList.add("hint-ok"),N.classList.remove("hint-warn")):(N.textContent="Enter a debate topic",N.classList.remove("hint-ok","hint-warn")),y.disabled=r<2||r>4||!b;const h=e.querySelector("#suggest-topic-btn");h&&(h.disabled=r<2||r>4)}e.querySelector("#char-list"),e.querySelector("#char-filter");const z=e.querySelector("#topic-input");z.addEventListener("input",()=>{T.textContent="",W()}),e.querySelector(".setup-or"),e.querySelector(".topic-label"),e.querySelector(".topic-row"),e.querySelector("#cast-suggestion"),W();const Z=e.querySelector("#suggest-btn"),Y=e.querySelector("#cast-suggestion");let de=!1;Z.addEventListener("click",async()=>{const r=z.value.trim();if(!r){z.focus();return}T.textContent="",Z.disabled=!0,Z.textContent="thinking…";const b=q.classList.contains("setup-box--advanced");b||(Y.innerHTML='<div class="cs-loading">selecting the best minds for this topic…</div>',Y.style.display="");try{const{picks:h}=await at(r);if(!h||!h.length)return;if(f.forEach($=>{$.checked=!1}),h.forEach(({name:$})=>{const C=e.querySelector(`#char-list input[value="${CSS.escape($)}"]`);C&&(C.checked=!0)}),de=!0,W(),b){e.querySelectorAll('input[name="debate-format"]').forEach(I=>{(I.value==="oxford"||I.value==="cable_news")&&(I.checked=!1)});const C=e.querySelector('input[name="debate-format"][value=""]');C&&(C.checked=!0);const M={id:"_suggested",topic:r,tagline:h.map(I=>I.reason).join(" · "),characters:h.map(I=>I.name),category:"philosophical",audience_level:pe(),format:"",source:"generated"};K=[M],D=0,U.style.display="",te(M),Y.style.display="none",U.scrollIntoView({block:"nearest",behavior:"smooth"})}else{Y.innerHTML='<div class="cs-header">── suggested cast ──</div>'+h.map(C=>`<div class="cs-pick">
              <span class="cs-name">${H(C.name)}</span>
              <span class="cs-reason">${H(C.reason)}</span>
            </div>`).join(""),Y.style.display="";const $=e.querySelector(`.char-card[data-name="${h[0].name.toLowerCase()}"]`);$&&$.scrollIntoView({block:"nearest",behavior:"smooth"})}}catch(h){Y.style.display="none",T.textContent=h.message||"Could not suggest a cast — please try again."}finally{Z.disabled=!1,Z.textContent="Suggest cast ✦"}});const ee=e.querySelector("#suggest-topic-btn"),X=e.querySelector("#topic-suggestion");ee.addEventListener("click",async()=>{const r=[...f].filter(b=>b.checked).map(b=>b.value);if(!(r.length<2)){ee.disabled=!0,ee.textContent="thinking…",X.innerHTML='<div class="cs-loading">finding the perfect flashpoint…</div>',X.style.display="";try{const{topic:b,reason:h}=await nt(r);if(!b)return;z.value=b,X.innerHTML=`<div class="cs-header">── suggested topic ──</div><div class="cs-pick">
          <span class="cs-name">${H(b)}</span>
          <span class="cs-reason">${H(h)}</span>
        </div>`,X.style.display=""}catch(b){console.error("suggest topic failed",b),X.style.display="none"}finally{ee.disabled=!1,ee.textContent="Suggest topic ✦"}}}),f.forEach(r=>r.addEventListener("change",()=>{de&&(Y.style.display="none",de=!1),X.style.display="none",W()}));function ge(){const r=e.querySelector('input[name="audience"]:checked'),b=e.querySelector('input[name="phil-length"]:checked'),h=e.querySelector('input[name="comm-length"]:checked'),$=e.querySelector('input[name="mod-length"]:checked'),C=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:r?r.value:"university",philosopherLength:b?b.value:"normal",commentatorLength:h?h.value:"normal",moderatorLength:$?$.value:"normal",debateFormat:C?C.value:""}}y.addEventListener("click",async()=>{const r=[...f].filter($=>$.checked).map($=>$.value),b=e.querySelector("#topic-input").value.trim();T.textContent="",j.textContent="",v.textContent="";const h=y.textContent;y.disabled=!0,y.textContent="opening…";try{await t({characters:r,topic:b,...ge()})}catch{}finally{document.contains(y)&&(y.textContent=h,W())}}),e.querySelector("#topic-input").addEventListener("keydown",r=>{r.key==="Enter"&&!y.disabled&&y.click()}),e.querySelector("#setup-about").addEventListener("click",Ae),e.querySelector("#setup-help").addEventListener("click",He);const U=e.querySelector("#dotd-card"),Fe={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let fe=[],K=[],D=-1;function pe(){const r=e.querySelector('input[name="audience"]:checked');return r?r.value:"university"}function be(){const r=e.querySelector('input[name="debate-format"]:checked');return r?r.value:""}function ye(r){const b=be();return fe.filter(h=>(b==="oxford"?h.format==="oxford":b==="cable_news"?h.format==="cable_news":h.format!=="oxford"&&h.format!=="cable_news")&&(b==="oxford"||b==="cable_news"||h.audience_level===r))}function we(r,b=null){if(!r.length)return null;const h=b?r.filter(M=>M.id!==b.id):r,$=h.length?h:r,C=[];for(const M of $)C.push(M),M.source==="curated"&&(C.push(M),C.push(M));return C[Math.floor(Math.random()*C.length)]}function te(r){const b=Fe[r.category]||"var(--text-dim)",h=r.format==="oxford",$=r.format==="cable_news";U.classList.toggle("dotd-card--cable",$);const C=q.classList.contains("setup-box--advanced"),I={grade5:"Grade 5",highschool:"High School",university:"University",expert:"Expert"}[r.audience_level]||"",Ue=h?'<span class="dotd-oxford">🎓 Oxford</span>':$?"":C&&I?`<span class="dotd-freeform">${H(I)}</span>`:'<span class="dotd-freeform">Freeform</span>',Ge=h?"":r.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',Ve=r.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${r.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${r.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${r.characters.join(" · ")}</div>`,We=$?`
      <div class="cable-dotd-bar">
        <span class="cable-dotd-live"><span class="cable-dotd-dot"></span>LIVE</span>
        <span class="cable-dotd-breaking">BREAKING NOW</span>
        <span class="cable-dotd-channel">📺 DEBATE ZONE</span>
      </div>`:"";U.innerHTML=`
      ${We}
      <div class="dotd-header">
        <span class="dotd-label">${$?"TONIGHT'S SHOWDOWN":"── SUGGESTED DEBATE ──"}</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${b}">${r.category.toUpperCase()}</span>
          ${Ue}
          ${Ge}
        </span>
      </div>
      ${Ve}
      <div class="dotd-topic">${H(r.topic)}</div>
      <div class="dotd-tagline">${H(r.tagline)}</div>
      <div class="dotd-actions">
        ${r.id==="_suggested"?"":`<button class="dotd-new-btn" id="dotd-prev" ${D<=0?"disabled":""}>← Prev</button>`}
        <button class="dotd-start-btn" id="dotd-start">${$?"🔴 GO LIVE ▶":"Start this debate ▶"}</button>
        ${r.id==="_suggested"?"":'<button class="dotd-new-btn" id="dotd-next">Next →</button>'}
      </div>
    `,U.querySelector("#dotd-start").addEventListener("click",()=>{const ae=h?"oxford":$?"cable_news":"";t({characters:r.characters,topic:r.topic,...ge(),debateFormat:ae,formatRoles:r.roles||null})});const Ee=U.querySelector("#dotd-prev");Ee&&Ee.addEventListener("click",()=>{D>0&&(D--,te(K[D]))});const $e=U.querySelector("#dotd-next");$e&&$e.addEventListener("click",()=>{if(D<K.length-1)D++,te(K[D]);else{const ae=we(ye(pe()),K[D]);ae&&(K.push(ae),D++,te(ae))}})}function se(){const r=we(ye(pe()));r?(K=[r],D=0,te(r)):U.style.display="none"}return Qe().then(r=>{fe=r,se()}).catch(()=>{U.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(r=>{r.addEventListener("change",()=>{const b=be();if(b==="oxford"||b==="cable_news"){const h=e.querySelector('input[name="debate-format"][value=""]');h&&(h.checked=!0)}se()})}),e.querySelectorAll('input[name="debate-format"]').forEach(r=>{r.addEventListener("change",se)}),{showError(r){q.classList.contains("setup-box--advanced")?(j.textContent=r,T.textContent=""):(T.textContent=r,j.textContent="")}}}function H(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function P(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ut(e){const s=(e-.2)/3.8*100,t=Math.max(0,Math.min(100,s)).toFixed(1),a=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030";return`<div class="ratings-bar-track"><div class="ratings-bar-fill" style="width:${t}%;background:${a}"></div></div>`}const vt={get_them_fighting:"🥊",force_soundbite:"💬",push_narrative:"📢",wrap_it_up:"⏱️",go_soft:"🕊️"},mt={get_them_fighting:"fight",force_soundbite:"soundbite",push_narrative:"narrative",wrap_it_up:"wrap up",go_soft:"go soft"},ht={socratic:"💭",combative:"⚔️","devil's advocate":"😈",koan:"☯️",journalist:"🎤","straw man":"🪆","steel man":"🛡️","last call":"🔔"};function gt(e,s,t="",a,n=null,i=[],l={}){const c=l.moderatorStyleNames??{},u=l.steerTitle??"── STEER THE DEBATE ──",o=l.steerQuitLabel??"Quit game",d=l.steerInputPlaceholder??"Speak into the debate — or leave blank for the moderator…",w=l.steerSubmitLabel??"Steer ▶",f=l.evidencePlaceholder??"Search term — result will be injected as empirical fact…";return new Promise(S=>{const m=document.createElement("div");m.className="steer-drawer",m.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">${u}</div>
        <button class="steer-quit-btn" id="steer-quit">${P(o)}</button>
      </div>

      ${t?`<div class="steer-summary">${P(t)}</div>`:""}

      <div class="steer-input-row">
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="${P(d)}"
          autocomplete="off"
        />
        <button class="steer-submit-btn" id="steer-submit">${P(w)}</button>
      </div>

      <div class="style-grid" id="style-grid">
        ${s.map(y=>{const v=ht[y.style]??"◆",T=c[y.style]??y.style;return`<button
            class="style-icon-btn${y.style===e?" style-selected":""}"
            data-style="${P(y.style)}"
            title="${P(T+" — "+y.description)}"
          >
            <span class="style-icon-glyph">${v}</span>
            <span class="style-icon-name">${P(T)}</span>
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
            placeholder="${P(f)}"
            autocomplete="off"
          />
          <button class="steer-search-btn" id="evidence-search">Search</button>
        </div>
        <div id="evidence-preview" class="evidence-preview" style="display:none"></div>
      </div>
    `,(a||document.body).appendChild(m);const x=m.querySelector("#steer-text-input");x.focus();let k=e,_="";m.querySelectorAll(".style-icon-btn").forEach(y=>{y.addEventListener("click",()=>{m.querySelectorAll(".style-icon-btn").forEach(v=>v.classList.remove("style-selected")),y.classList.add("style-selected"),k=y.dataset.style,N()})});const g=m.querySelector("#evidence-toggle"),E=m.querySelector("#evidence-panel"),q=m.querySelector("#evidence-preview"),O=m.querySelector("#evidence-query"),A=m.querySelector("#evidence-search");g.addEventListener("click",()=>{const y=E.style.display==="none";E.style.display=y?"":"none",g.classList.toggle("steer-pill--active",y),y&&O.focus()});async function B(){const y=O.value.trim();if(!(!y||!n)){A.disabled=!0,A.textContent="Searching…",q.style.display="none",_="";try{const v=await n(y);_=v.finding,q.style.display="block",q.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${P(v.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,q.querySelector("#evidence-accept").addEventListener("click",()=>{q.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${P(_)}</div>`}),q.querySelector("#evidence-discard").addEventListener("click",()=>{_="",q.style.display="none"})}catch(v){q.style.display="block",q.textContent=`Search failed: ${v.message}`}finally{A.disabled=!1,A.textContent="Search"}}}A.addEventListener("click",B),O.addEventListener("keydown",y=>{y.key==="Enter"&&B()});function N(){m.remove(),S({text:x.value.trim(),style:k,evidence:_})}m.querySelector("#steer-submit").addEventListener("click",N),m.querySelector("#steer-quit").addEventListener("click",()=>{m.remove(),S(null)}),x.addEventListener("keydown",y=>{y.key==="Enter"&&N()})})}function ft(e,s,t={}){const{ratings:a=.8,peak_ratings:n=.8,producer_note:i="",producer_stress:l=0,directives:c=[]}=e,u=["","nervous","stressed","PANICKING","MELTDOWN","FIRE FIRE FIRE"],o=l>0?` (${u[Math.min(l,5)]})`:"",d=l>=3;return new Promise(w=>{const f=document.createElement("div");f.className="steer-drawer",f.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── COMMERCIAL BREAK ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      <div class="commercial-ratings-row">
        <span class="commercial-ratings-num">📺 ${a.toFixed(1)}M</span>
        <span class="commercial-ratings-peak">peak ${n.toFixed(1)}M</span>
        ${ut(a)}
      </div>

      ${i?`
        <div class="commercial-producer-note${d?" commercial-producer-high":""}">
          <span class="producer-tag">[PRODUCER${o}]</span> ${P(i)}
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
        ${c.map(([k,_])=>{const g=vt[k]??"◆",E=mt[k]??k.replace(/_/g," ");return`<button
            class="style-icon-btn"
            data-directive="${P(k)}"
            title="${P(E+" — "+_)}"
          >
            <span class="style-icon-glyph">${g}</span>
            <span class="style-icon-name">${P(E)}</span>
          </button>`}).join("")}
      </div>
    `,(s||document.body).appendChild(f);const m=f.querySelector("#steer-text-input");m.focus();let L="";f.querySelectorAll("#directive-list .style-icon-btn").forEach(k=>{k.addEventListener("click",()=>{f.querySelectorAll("#directive-list .style-icon-btn").forEach(_=>_.classList.remove("style-selected")),k.classList.add("style-selected"),L=k.dataset.directive,x()})});function x(){const k=m.value.trim();f.remove(),w({text:k,producer_directive:L})}f.querySelector("#steer-submit").addEventListener("click",x),f.querySelector("#steer-quit").addEventListener("click",()=>{f.remove(),w(null)}),m.addEventListener("keydown",k=>{k.key==="Enter"&&x()})})}function ie(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Le=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function bt(e,s,t,a,n=null,i=null,l=null,c=null){return new Promise(u=>{var L,x,k,_;const o={};t.forEach(g=>{o[g]=0});const d=document.createElement("div");d.className="cheat-overlay",d.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${s}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${s} — ${Le[s]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${t.map(g=>`
            <div class="drink-row">
              <span class="drink-name">${ie(g)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${ie(g)}">−</button>
                <span class="drink-count" id="drink-count-${ie(g.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${ie(g)}">+</button>
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
    `,document.body.appendChild(d);const w=d.querySelector("#cheat-heat-slider"),f=d.querySelector("#cheat-heat-value");w.addEventListener("input",()=>{const g=parseInt(w.value,10);f.textContent=`${g} — ${Le[g]}`}),d.querySelectorAll(".drink-btn").forEach(g=>{g.addEventListener("click",()=>{const E=g.dataset.name,q=g.classList.contains("drink-plus")?1:-1;o[E]=Math.max(0,(o[E]||0)+q);const O=E.replace(/ /g,"_"),A=d.querySelector(`#drink-count-${O}`);A&&(A.textContent=o[E])})});function S(){d.remove(),u()}async function m(){const g=parseInt(w.value,10),E=Object.fromEntries(Object.entries(o).filter(([,O])=>O>0)),q=g!==s;try{await a(e,q?g:null,E)}catch(O){console.error("Cheat failed:",O)}S()}d.querySelector("#cheat-apply").addEventListener("click",m),d.querySelector("#cheat-close").addEventListener("click",S),(L=d.querySelector("#cheat-paper"))==null||L.addEventListener("click",()=>{S(),n()}),(x=d.querySelector("#cheat-podcast"))==null||x.addEventListener("click",()=>{S(),i()}),(k=d.querySelector("#cheat-consensus"))==null||k.addEventListener("click",()=>{S(),c()}),(_=d.querySelector("#cheat-end"))==null||_.addEventListener("click",()=>{S(),l()}),d.addEventListener("click",g=>{g.target===d&&S()})})}function yt(e,s,t={}){e.innerHTML=s.map(u=>{if(t.renderSeat)return t.renderSeat(u,_e(u),ue(u),qe(u),Te(u));const o=_e(u),d=Te(u);return`
      <div class="seat" id="seat-${ue(u)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${o}" alt="${ve(u)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${ve(d)}</div>
        </div>
        <div class="seat-name">${ve(qe(u))}</div>
      </div>
    `}).join("");let a=null;function n(u){return e.querySelector(`#seat-${ue(u)}`)}function i(){clearTimeout(a),e.querySelectorAll(".seat").forEach(u=>{u.classList.remove("seat-thinking","seat-speaking")})}function l(u){var o;i(),(o=n(u))==null||o.classList.add("seat-thinking")}function c(u){i();const o=n(u);o&&(o.classList.add("seat-speaking"),a=setTimeout(()=>o.classList.remove("seat-speaking"),3e3))}return{setThinking:l,setSpeaking:c,clearAll:i}}function _e(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function Te(e){return e.split(" ").map(s=>s[0]).join("").slice(0,2).toUpperCase()}function qe(e){return e.split(" ").at(-1)}function ue(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function ve(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function wt(e,s,t,a,n,i){const l=i.skin??{},c=l.appName??"THE PHILOSOPHER'S BAR";e.innerHTML=`
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
  `;const u=e.querySelector("#seats-bar"),o=e.querySelector("#convo-pane"),d=e.querySelector("#sidebar"),w=e.querySelector("#left-col");let f="socratic",S=0,m=null,L=!1,x=!1,k="",_={},g={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},E=.8,q=[];const O=yt(u,t,l);Q(d,{topic:a,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const y=document.createElement("div");y.id="debate-starting",y.className="debate-starting",y.innerHTML=`<span class="debate-starting-text">${l.debateStartingText??"Opening the bar"}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,o.appendChild(y)}function A(){var y;(y=o.querySelector("#debate-starting"))==null||y.remove()}function B({type:y,data:v}){switch(y){case"speaker":A(),O.setThinking(v.name),Ot(o,v.name);break;case"message":A(),F(o),v.backchannel||O.setSpeaking(v.name),Et(o,v);break;case"bars":S=v.heat??S,At(d,v.heat,v.concession_total??0);break;case"debug":{const T=v.data!=null?v.data:"",j=typeof T=="object"?`
`+Object.entries(T).map(([W,z])=>`  ${W}: ${JSON.stringify(z)}`).join(`
`):T?` — ${T}`:"";console.log(`[${v.channel}] ${v.label}${j}`);break}case"oxford_opening_vote":g={...g,oxford_opening_vote:v},Q(d,{topic:a,...g,debate_phase:k,format_roles:_});break;case"oxford_verdict":Ct(o,v);break;case"phase_update":k=v.debate_phase,_=v.format_roles||{},Q(d,{topic:a,...g,debate_phase:k,format_roles:_});break;case"state":F(o),f=v.moderator_style,S=v.heat??S,v.debate_phase&&(k=v.debate_phase),v.format_roles&&Object.keys(v.format_roles).length&&(_=v.format_roles),g={...v,debate_phase:k,format_roles:_},Q(d,{topic:a,...g});break;case"cable_ratings":E=v.ratings??E,q=v.history??q,Ht(d,E,q);break;case"chyron":v.text&&_t(o,v.text);break;case"breaking_news":v.headline&&Tt(o,v.headline);break;case"producer_whisper":qt(o,v.note,v.stress);break;case"commercial_break":if(x)break;x=!0,E=v.ratings??E,o.scrollTop=o.scrollHeight,ft(v,w,l).then(T=>{x=!1,T===null?Ce(o,{reason:"quit",report:{}},t,N):i.steer(s,T.text,"socratic","",{},T.producer_directive).catch(j=>J(o,`Error: ${j.message}`))});break;case"cable_news_end":if(L)break;L=!0,m&&(m(),m=null),F(o),O.clearAll(),Ce(o,v,t,N);break;case"steer_needed":if(x)break;x=!0,f=v.current_style,v.drift_topic&&St(o,v.drift_topic,a),o.scrollTop=o.scrollHeight,gt(f,n,Pt(g),w,i.searchEvidence,t,l).then(T=>{x=!1,T===null?oe(o,g,t,N,s,i):(f=T.style,Q(d,{topic:a,...g,moderator_style:T.style}),i.steer(s,T.text,T.style,T.evidence||"",T.drinks||{}).catch(j=>J(o,`Steer error: ${j.message}`)))});break;case"consensus":if(L)break;L=!0,m&&(m(),m=null),F(o),O.clearAll(),Ne(o,v,{onNewTopic(T){i.newTopic(s,T).then(()=>{L=!1,g={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=T,Q(d,{topic:T,...g,moderator_style:f,points_of_agreement:[]}),O.clearAll(),m=i.openStream(s,B)}).catch(j=>J(o,`Error: ${j.message}`))},onQuit:N},g,s,i,t);break;case"game_over":if(L)break;L=!0,m&&(m(),m=null),F(o),O.clearAll(),oe(o,{...g,...v},t,N,s,i);break;case"bar_beat":A(),$t(o,v.text);break;case"commentator":A(),kt(o,v.text);break;case"evidence":A(),xt(o,v.finding);break;case"diagram":A(),Lt(o,v);break;case"system":A(),J(o,v.text);break;case"error":A(),J(o,`⚠ ${v.text}`);break}}function N(){m&&m(),i.deleteSession(s).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",Ae),e.querySelector("#help-btn").addEventListener("click",He),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const v=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=v?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{L||bt(s,S,t,i.cheat,()=>me(s,i,t),()=>Nt(s,i),()=>{L=!0,m&&(m(),m=null),F(o),O.clearAll(),oe(o,g,t,N,s,i)},()=>{L=!0,m&&(m(),m=null),F(o),O.clearAll(),Ne(o,{summary:"The bar has called it — the evening ends in agreement.",points:g.points_of_agreement||[]},{onNewTopic(y){i.newTopic(s,y).then(()=>{L=!1,g={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=y,Q(d,{topic:y,...g,moderator_style:f,points_of_agreement:[]}),O.clearAll(),m=i.openStream(s,B)}).catch(v=>J(o,`Error: ${v.message}`))},onQuit:N},g,s,i,t)})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(L){N();return}g.turn>0?(L=!0,m&&(m(),m=null),oe(o,g,t,N,s,i)):N()}),m=i.openStream(s,B)}function Et(e,{role:s,name:t,content:a,backchannel:n,debate_label:i="",catchphrase:l=""}){const c=document.createElement("div");if(n)c.className="msg msg-bc",c.innerHTML=`<span class="bc-name">${p(t)}:</span> <em>${ne(a)}</em>`;else if(s==="moderator")c.className="msg msg-moderator",c.innerHTML=`<div class="msg-mod-label">― ${p(t)} ―</div><div class="msg-content">${ne(a)}</div>`;else if(s==="user")c.className="msg msg-user",c.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${ne(a)}</div>`;else{const u=`/portraits/${t.replace(/ /g,"_")}.png`,o=t.split(" ").map(f=>f[0]).join("").slice(0,2).toUpperCase(),w=i.includes("Proposition")?"debate-label-prop":"debate-label-opp";c.className="msg msg-philosopher",c.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${u}" alt="${p(t)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${p(o)}</div></div><div class="msg-body">`+(i?`<div class="msg-debate-label ${w}">${p(i)}</div>`:"")+`<div class="msg-name">${p(t)}</div><div class="msg-content">${ne(a,l)}</div></div>`}R(e,c)}function $t(e,s){const t=document.createElement("div");t.className="msg msg-beat",t.innerHTML=ne(s),R(e,t)}function J(e,s){const t=document.createElement("div");t.className="msg msg-system",s.endsWith("…")?t.innerHTML=p(s.slice(0,-1))+'<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>':t.textContent=s,R(e,t)}function St(e,s,t){const a=document.createElement("div");a.className="msg msg-drift",a.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${p(s)}</div><div class="drift-orig">original: ${p(t)}</div>`,R(e,a)}function kt(e,s){const t=document.createElement("div");t.className="msg msg-commentator",t.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${p(s)}</span>`,R(e,t)}function xt(e,s){const t=document.createElement("div");t.className="msg msg-evidence",t.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${p(s)}`,R(e,t)}function Lt(e,{speaker:s,title:t,thumb_url:a,url:n,page_url:i}){const l=document.createElement("div");l.className="msg msg-diagram",l.innerHTML=`<div class="diagram-label">${p(s)} produces a diagram</div><a class="diagram-link" href="${p(i)}" target="_blank" rel="noopener"><img class="diagram-img" src="${p(a)}" alt="${p(t)}" /><div class="diagram-caption">${p(t)}</div></a>`,R(e,l)}function _t(e,s){const t=document.createElement("div");t.className="msg msg-chyron",t.textContent=s,R(e,t)}function Tt(e,s){const t=document.createElement("div");t.className="msg msg-breaking-news",t.innerHTML=`<div class="breaking-label">🔴 BREAKING NEWS</div><div class="breaking-headline">${p(s)}</div>`,R(e,t)}function qt(e,s,t){if(!s)return;const a=document.createElement("div");a.className="msg msg-producer-whisper";const n=t>=3?"[PRODUCER!!!]":"[PRODUCER]";a.innerHTML=`<span class="producer-tag${t>=3?" producer-tag-high":""}">${n}</span> ${p(s)}`,R(e,a)}function Ce(e,{reason:s,report:t={}},a,n,i,l){F(e);const c=s==="viral",o=c?"📺 SHOW WENT VIRAL":s==="cancelled"?"📺 SHOW CANCELLED":"📺 LAST CALL",d=c?"cable-end-viral":"cable-end-cancelled",{final_ratings:w=0,peak_ratings:f=0,turn_count:S=0,breaking_news_count:m=0,network_offers:L={},catchphrases:x={},guest_stats:k={}}=t,_=Object.entries(L).length?`<div class="end-section cable-end-offers">
        <div class="end-section-label" style="color:var(--amber)">network offers</div>
        ${Object.entries(L).map(([O,A])=>`<div class="cable-offer-row">
            <span class="cable-offer-name">${p(O)}</span>
            <span class="cable-offer-text">${p(A)}</span>
          </div>`).join("")}
      </div>`:"",g=Object.keys(x).length?`<div class="end-section">
        <div class="end-section-label" style="color:var(--blue)">guest catchphrases</div>
        ${Object.entries(x).map(([O,A])=>{const N=(k[O]||{}).catchphrase_count||0;return`<div class="cable-catchphrase-row">
            <span class="cable-cp-name">${p(O)}:</span>
            <span class="cable-cp-phrase">"${p(A)}"</span>
            <span class="cable-cp-count">${N}×</span>
          </div>`}).join("")}
      </div>`:"",E=S?`<div class="end-scoreboard">
        <div class="end-stat">
          <span class="end-stat-num">${S}</span>
          <span class="end-stat-lbl">turns</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--amber)">${w.toFixed(1)}M</span>
          <span class="end-stat-lbl">final ratings</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--green)">${f.toFixed(1)}M</span>
          <span class="end-stat-lbl">peak</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num">${m}</span>
          <span class="end-stat-lbl">breaking news</span>
        </div>
      </div>`:"",q=document.createElement("div");q.className="end-panel",q.innerHTML=`
    <div class="end-title ${d}">━━━ ${o} ━━━</div>
    ${E}
    ${_}
    ${g}
    <div class="end-actions">
      <div class="end-btn-row">
        <button class="end-leave-btn" id="cable-end-leave">Leave the studio</button>
      </div>
    </div>
  `,R(e,q),q.querySelector("#cable-end-leave").addEventListener("click",n)}function Ct(e,{winner:s,proposition_open:t,proposition_final:a,margin:n,persona_verdicts:i,verdict:l}){const c=s==="proposition"?"PROPOSITION WINS":"OPPOSITION WINS",u=s==="proposition"?"oxford-verdict-prop":"oxford-verdict-opp",o=a===50,d=Math.min(t,a),f=Math.max(t,a)-d,S=a>t,m=S?"var(--green)":"var(--amber)",L=(n>=0?"+":"")+n+" pts",x=`
    <div class="oxford-shift-wrap">
      <div class="oxford-shift-ends"><span>Opp 0%</span><span>Prop 100%</span></div>
      <div class="oxford-shift-track">
        <div class="oxford-shift-fill" style="left:${d}%;width:${f}%;background:${m}"></div>
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
  `,k=o?'<div class="oxford-verdict-tie">The motion falls — a tie goes to the opposition.</div>':"",_=document.createElement("div");_.className="oxford-verdict-card",_.innerHTML=`
    <div class="oxford-verdict-title">── THE VERDICT ──</div>
    ${x}
    <div class="oxford-verdict-winner ${u}">${c}</div>
    ${k}
    <div class="oxford-verdict-text">${p(l)}</div>
    <ul class="oxford-verdict-personas">
      ${(i||[]).map(g=>`<li>${p(g)}</li>`).join("")}
    </ul>
  `,R(e,_)}function Ne(e,{summary:s,points:t},{onNewTopic:a,onQuit:n},i={},l,c,u=[]){var w;const o=document.createElement("div");o.className="end-panel",o.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${p(s)}</blockquote>
    ${Me(i)}
    ${Re(t,i)}
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
  `,R(e,o);const d=o.querySelector("#consensus-topic-input");d.focus(),o.querySelector("#consensus-continue").addEventListener("click",()=>{const f=d.value.trim();f&&a(f)}),d.addEventListener("keydown",f=>{if(f.key==="Enter"){const S=d.value.trim();S&&a(S)}}),o.querySelector("#consensus-end").addEventListener("click",n),(w=o.querySelector("#consensus-paper"))==null||w.addEventListener("click",()=>me(l,c,u))}function oe(e,s,t,a,n,i){var o;F(e);const l=document.createElement("div");l.className="end-panel";const c=s.turn||0,u=c?`${c} turn${c!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";l.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${p(u)}</blockquote>
    ${Me(s)}
    ${Re([],s)}
    <div class="end-actions">
      <div class="end-btn-row">
        ${n?'<button class="end-paper-btn" id="game-over-paper">Read the morning paper 📰</button>':""}
        <button class="end-leave-btn" id="game-over-leave">Leave the bar</button>
      </div>
    </div>
  `,R(e,l),l.querySelector("#game-over-leave").addEventListener("click",a),(o=l.querySelector("#game-over-paper"))==null||o.addEventListener("click",()=>me(n,i,t))}async function Nt(e,s){const t=document.createElement("div");t.className="newspaper-overlay",t.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(t);try{await s.exportPodcast(e)}catch(a){alert(`Podcast failed: ${a.message}`)}finally{t.remove()}}async function me(e,s,t=[]){const a=document.createElement("div");a.className="newspaper-overlay",a.innerHTML=`
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
  `,a.querySelector("#newspaper-close").addEventListener("click",()=>a.remove()),a.addEventListener("click",i=>{i.target===a&&a.remove()}),a.querySelector("#newspaper-download").addEventListener("click",()=>{var c,u;const i=a.querySelector(".newspaper-modal").cloneNode(!0);i.querySelectorAll("img").forEach(o=>{o.src&&!o.src.startsWith("http")&&(o.src=window.location.origin+o.getAttribute("src"))}),(c=i.querySelector("#newspaper-close"))==null||c.remove(),(u=i.querySelector("#newspaper-download"))==null||u.remove();const l=window.open("","_blank");l.document.write(`<!DOCTYPE html>
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
</head><body>${i.outerHTML}</body></html>`),l.document.close(),l.addEventListener("load",()=>{l.focus(),l.print()})})}function Me(e){const{turn:s=0,heat:t=0,concession_total:a=0}=e;if(!s)return"";const n=je(t),i=De(t);return`
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
  `}function Re(e,s){const{partial_agreements:t=[],points_of_agreement:a=[],remaining_disagreements:n=[]}=s,i=[...new Set([...e,...a])];let l="";return i.length&&(l+=`<div class="end-section end-section-agree">
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
    </div>`),l}function Ot(e,s){F(e);const t=document.createElement("div");t.className="msg msg-typing",t.id="typing-indicator",t.innerHTML=`<span class="typing-name">${p(s)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,R(e,t)}function F(e){var s;(s=e.querySelector("#typing-indicator"))==null||s.remove()}function Q(e,s){var _,g;const{topic:t,turn:a=0,heat:n=0,concession_total:i=0,moderator_style:l="socratic",partial_agreements:c=[],points_of_agreement:u=[],remaining_disagreements:o=[],debate_phase:d="",format_roles:w={},oxford_opening_vote:f=null}=s,S={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},m=d&&S[d]?`<div class="sb-phase-banner">${S[d].toUpperCase()}</div>`:"",L=d&&(w.proposition||w.opposition)?'<div class="sb-roles">'+((_=w.proposition)!=null&&_.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${w.proposition.map(E=>p(E)).join(", ")}</div>`:"")+((g=w.opposition)!=null&&g.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${w.opposition.map(E=>p(E)).join(", ")}</div>`:"")+"</div>":"",x=f?`<details class="oxford-opening-banner">
        <summary class="oxford-opening-summary">
          Opening position: <strong>${f.proposition_pct}%</strong> for proposition
        </summary>
        <div class="oxford-opening-detail">
          <div class="oxford-opening-rationale">${p(f.rationale||"")}</div>
          <ul class="oxford-opening-leanings">
            ${(f.persona_leanings||[]).map(E=>`<li>${p(E)}</li>`).join("")}
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
        ${u.map(E=>`<div class="sb-agree-item">✓ ${p(E)}</div>`).join("")}
      </div>
    `),c.length&&(k+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${c.map(E=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${p(E.participants.join(" + "))}</div>
            <div class="sb-partial-on">${p(E.on)}</div>
          </div>
        `).join("")}
      </div>
    `),o.length&&(k+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${o.map(E=>typeof E=="object"&&E!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${p(E.topic)}</div>
                <div class="sb-tension-stance">${p(E.participant_a)}: ${p(E.stance_a)}</div>
                <div class="sb-tension-stance">${p(E.participant_b)}: ${p(E.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${p(String(E))}</div>`).join("")}
      </div>
    `),k+=`
    <div class="sb-section" id="sb-bars">
      ${Pe(n,i)}
    </div>

    <div class="sb-section" id="sb-cable-ratings" style="${s.cable_ratings!=null?"":"display:none"}">
      ${s.cable_ratings!=null?Ie(s.cable_ratings,s.cable_ratings_history||[]):""}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${p(l)}</div>
    </div>
  `,e.innerHTML=k}function ne(e,s=""){let t=p(e);if(s){const n=p(s),i=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");t=t.replace(i,l=>`<mark class="catchphrase-hl">${l}</mark>`)}return t.replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function R(e,s){const t=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(s),t&&(e.scrollTop=e.scrollHeight)}function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Pe(e,s){const t=je(e),a=De(e),n="█".repeat(e),i="░".repeat(10-e),l=Math.min(s,10),c=Mt(s),u="█".repeat(l),o="░".repeat(10-l),d=Rt(s);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${t}">${n}</span><span class="sb-heat-empty">${i}</span>
      <span class="sb-heat-label" style="color:${t}">${a}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${c}">${u}</span><span class="sb-heat-empty">${o}</span>
      <span class="sb-heat-label" style="color:${c}">${d} (${s})</span>
    </div>
  `}function At(e,s,t){const a=e.querySelector("#sb-bars");a&&(a.innerHTML=Pe(s,t))}function Ht(e,s,t){const a=e.querySelector("#sb-cable-ratings");a&&(a.style.display="",a.innerHTML=Ie(s,t))}function Ie(e,s){const t=(e-.2)/3.8*100,a=Math.max(0,Math.min(100,t)).toFixed(1),n=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030",i=s.length>=2?s[s.length-1]>s[s.length-2]?"▲":s[s.length-1]<s[s.length-2]?"▼":"─":"";return`
    <div class="sb-label">── RATINGS ──</div>
    <div class="sb-ratings-num" style="color:${n}">${e.toFixed(1)}M viewers <span class="sb-trend">${i}</span></div>
    <div class="ratings-bar-track">
      <div class="ratings-bar-fill" style="width:${a}%;background:${n}"></div>
    </div>
    <div class="sb-ratings-scale"><span>cancelled</span><span>viral</span></div>
  `}function je(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function De(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Mt(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Rt(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Pt(e,s){const{turn:t,heat:a,partial_agreements:n,remaining_disagreements:i,drift_topic:l}=e;if(!t)return"The debate is just getting started.";if(l)return`The conversation has drifted from the original topic toward ${l}.`;const c=n||[],u=i||[];if(c.length&&u.length){const d=c[0],w=u[0],f=d.participants.join(" and "),S=typeof w=="object"?w.topic:String(w);return`${f} are finding common ground, but the group remains divided on ${S}.`}if(c.length){const d=c[0];return`${d.participants.join(" and ")} are converging on ${d.on}, ${a>=6?"though tempers are running high":"with the room following closely"}.`}if(u.length){const d=u[0];return typeof d=="object"?`${d.participant_a} and ${d.participant_b} are sharply divided over ${d.topic}.`:`The room is deadlocked — ${String(d)}.`}const o=a>=8?"at flashpoint":a>=5?"heating up":a>=3?"warming up":"still feeling each other out";return`${t} turns in, no clear alignments yet — the room is ${o}.`}const le=document.querySelector("#app");let ce={},he={};const It=new Set(["production","development","staging"]);async function jt(){const e=It.has("production")?"default":"production",[s]=await Promise.all([ke(Object.assign({"./skins/default/skin.js":()=>re(()=>import("./skin-D7HGMV-G.js"),[]),"./skins/kids/skin.js":()=>re(()=>import("./skin-DZ74tMJe.js"),[])}),`./skins/${e}/skin.js`,4),ke(Object.assign({"./skins/default/theme.css":()=>re(()=>Promise.resolve({}),__vite__mapDeps([0])),"./skins/kids/theme.css":()=>re(()=>Promise.resolve({}),__vite__mapDeps([1]))}),`./skins/${e}/theme.css`,4)]);return s}async function Be(){let e,s;try{[e,s,ce]=await Promise.all([Xe(),Je(),Ze()])}catch(n){le.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${n.message}</div>`;return}const t=!!ce.local,a=pt(le,e,async({characters:n,topic:i,commentator:l=!0,moderator:c=!0,diagrams:u=!1,audienceLevel:o="university",philosopherLength:d="normal",commentatorLength:w="normal",moderatorLength:f="normal",debateFormat:S="",formatRoles:m=null})=>{try{const L=await et(n,i,l,c,u,o,d,w,f,S,m);Dt(L.session_id,n,i,s)}catch(L){throw a.showError(L.message),L}},{isLocal:t,skin:he})}function Dt(e,s,t,a){wt(le,e,s,t,a,{skin:he,steer:tt,cheat:ct,deleteSession:it,newTopic:rt,openStream:dt,searchEvidence:st,fetchNewspaper:ot,exportPodcast:ce.podcast?lt:null,isLocal:!!ce.local}),le.addEventListener("debate:quit",()=>Be(),{once:!0})}jt().then(e=>{he=e}).catch(()=>{}).finally(()=>Be());
