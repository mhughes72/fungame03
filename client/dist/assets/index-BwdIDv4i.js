const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/theme-CJEpj9dL.css","assets/theme-ClQV55ib.css"])))=>i.map(i=>d[i]);
(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();const et="modulepreload",tt=function(e){return"/"+e},Ne={},de=function(a,n,o){let i=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const d=document.querySelector("meta[property=csp-nonce]"),p=(d==null?void 0:d.nonce)||(d==null?void 0:d.getAttribute("nonce"));i=Promise.allSettled(n.map(t=>{if(t=tt(t),t in Ne)return;Ne[t]=!0;const s=t.endsWith(".css"),u=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${t}"]${u}`))return;const $=document.createElement("link");if($.rel=s?"stylesheet":et,s||($.as="script"),$.crossOrigin="",$.href=t,p&&$.setAttribute("nonce",p),document.head.appendChild($),s)return new Promise((g,T)=>{$.addEventListener("load",g),$.addEventListener("error",()=>T(new Error(`Unable to preload CSS for ${t}`)))})}))}function r(d){const p=new Event("vite:preloadError",{cancelable:!0});if(p.payload=d,window.dispatchEvent(p),!p.defaultPrevented)throw d}return i.then(d=>{for(const p of d||[])p.status==="rejected"&&r(p.reason);return a().catch(r)})},Oe=(e,a,n)=>{const o=e[a];return o?typeof o=="function"?o():Promise.resolve(o):new Promise((i,r)=>{(typeof queueMicrotask=="function"?queueMicrotask:setTimeout)(r.bind(null,new Error("Unknown variable dynamic import: "+a+(a.split("/").length!==n?". Note that variables only represent file names one level deep.":""))))})},te="/api";async function se(e,a){const n=await fetch(`${te}${e}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!n.ok){let o=`${n.status} ${n.statusText}`;try{const i=await n.json();i.detail&&(o=String(i.detail))}catch{const i=await n.text().catch(()=>"");i&&(o=i)}throw new Error(o)}return n.json()}async function st(e){await fetch(`${te}${e}`,{method:"DELETE"})}async function nt(e=null){const a=e?`${te}/topics?level=${encodeURIComponent(e)}`:`${te}/topics`,n=await fetch(a);if(!n.ok)throw new Error("Failed to load topics");return n.json()}async function at(){const e=await fetch(`${te}/characters`);if(!e.ok)throw new Error("Failed to load characters");return e.json()}async function ot(){const e=await fetch(`${te}/styles`);if(!e.ok)throw new Error("Failed to load styles");return e.json()}async function it(){const e=await fetch(`${te}/features`);return e.ok?e.json():{}}async function rt(e,a,n=!0,o=!0,i=!1,r="university",d="normal",p="normal",t="normal",s="",u=null){return se("/sessions",{characters:e,topic:a,commentator_enabled:n,moderator_enabled:o,diagrams_enabled:i,audience_level:r,philosopher_length:d,commentator_length:p,moderator_length:t,debate_format:s,format_roles:u})}async function lt(e,a,n,o="",i={},r=""){return se(`/sessions/${e}/steer`,{text:a,style:n,evidence:o,drinks:i,producer_directive:r})}async function ct(e){return se("/search",{query:e})}async function dt(e){return se("/suggest-cast",{topic:e})}async function pt(e){return se("/suggest-topic",{characters:e})}async function ut(e,a){return se(`/sessions/${e}/new-topic`,{topic:a})}async function ht(e){return st(`/sessions/${e}`)}async function gt(e){return se(`/sessions/${e}/newspaper`,{})}async function mt(e){const a=await fetch(`/api/sessions/${e}/podcast`,{method:"POST"});if(!a.ok){const r=await a.json().catch(()=>({detail:a.statusText}));throw new Error(r.detail||a.statusText)}const n=await a.blob(),o=URL.createObjectURL(n),i=document.createElement("a");i.href=o,i.download="philosophers-bar-podcast.mp3",document.body.appendChild(i),i.click(),i.remove(),URL.revokeObjectURL(o)}async function vt(e,a,n={}){const o={drinks:n};return a!==null&&(o.heat=a),se(`/sessions/${e}/cheat`,o)}function ft(e,a){const n=new EventSource(`${te}/sessions/${e}/stream`);return n.onmessage=o=>{try{const i=JSON.parse(o.data);a(i)}catch{console.error("Unparseable SSE frame:",o.data)}},n.onerror=o=>{console.error("SSE error",o),a({type:"error",data:{text:"Connection lost."}})},()=>n.close()}const ve="https://github.com/mhughes72/fungame03";function Ie(e,a){const n=document.createElement("div");n.className="info-overlay",n.innerHTML=`
    <div class="info-box">
      <div class="info-header">
        <div class="info-title">${e}</div>
        <button class="info-close" aria-label="Close">✕</button>
      </div>
      <div class="info-body">${a}</div>
    </div>
  `,document.body.appendChild(n);function o(){n.remove()}n.querySelector(".info-close").addEventListener("click",o),n.addEventListener("click",i=>{i.target===n&&o()}),document.addEventListener("keydown",function i(r){r.key==="Escape"&&(o(),document.removeEventListener("keydown",i))})}function ze(){Ie("ABOUT",`
    <p class="info-lead">
      A debate simulator where 2–4 historical figures argue a topic of your choosing,
      powered by <strong>LangGraph</strong> and <strong>OpenAI</strong>.
      Three formats: open <strong>Freeform</strong>, structured <strong>Oxford</strong>, and ratings-driven <strong>Cable News</strong>.
      <br><a class="info-link" href="${ve}" target="_blank" rel="noopener">${ve}</a>
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

  `)}function De(){Ie("HOW TO PLAY",`
    <p><a class="info-link" href="${ve}" target="_blank" rel="noopener">${ve}</a></p>
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
  `)}function bt(e,a,n,{isLocal:o=!1,skin:i={}}={}){const r=i.appName??"THE PHILOSOPHER'S BAR",d=i.setupSub??"Select 2–4 thinkers for tonight's debate",p=i.charFilterPlaceholder??"Filter thinkers…",t=i.topicLabel??"What should they discuss?",s=i.topicPlaceholder??"What is the nature of justice?",u=i.startLabel??"Open the bar ▶";i.orLabel;const $=i.dotdLoadingText??"generating tonight's debate…";e.innerHTML=`
    <div class="setup-overlay">
      <div class="setup-box setup-box--simple" id="setup-box">
        <h1 class="setup-title">${r}</h1>
        <p class="setup-sub">${d}</p>

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
          <div class="dotd-loading">${D($)}</div>
        </div>

        <div class="setup-or">── or build your own ──</div>

        <input
          id="char-filter"
          class="char-filter-input"
          type="text"
          placeholder="${D(p)}"
          autocomplete="off"
          spellcheck="false"
        />

        <div class="char-list" id="char-list">
          ${(()=>{const l=["Philosophy","Theology","Science","Politics","Arts","Literature","Technology","Media","Psychology"],w={};for(const b of a){const k=b.category||"Other";(w[k]=w[k]||[]).push(b)}return l.filter(b=>w[b]).map(b=>`
              <div class="char-category-group">
                <div class="char-category-label">${D(b)}</div>
                <div class="char-category-cards">
                  ${w[b].map(k=>{const H=k.name.replace(/ /g,"_"),B=k.name.split(" ").map(K=>K[0]).join("").slice(0,2).toUpperCase();return`<label class="char-card"
                        data-name="${k.name.toLowerCase()}"
                        data-desc="${D(k.known_for)}"
                        data-category="${D(b)}">
                        <input type="checkbox" value="${D(k.name)}" />
                        <div class="char-card-img">
                          <img src="/portrait_thumbs/${H}.webp" alt=""
                            data-portrait="${H}"
                            loading="lazy" />
                          <div class="char-card-initials" style="display:none">${D(B)}</div>
                        </div>
                        <div class="char-card-name">${D(k.name)}</div>
                      </label>`}).join("")}
                </div>
              </div>`).join("")})()}
          <div class="char-no-results" id="char-no-results" style="display:none">No match</div>
        </div>

        <p class="selection-hint" id="selection-hint">Select 2–4 thinkers</p>

        <label class="topic-label" for="topic-input">${t}</label>
        <div class="advanced-generate-heading">or generate a debate</div>
        <div class="topic-row">
          <input
            id="topic-input"
            class="topic-input"
            type="text"
            placeholder="${D(s)}"
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

        <button class="start-btn" id="start-btn" disabled>${D(u)}</button>
        <div class="start-error" id="start-error"></div>

        <div class="setup-spacer"></div>
        <div class="setup-dotd-sep">── or try a curated debate ──</div>

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
  `;const g=e.querySelectorAll("#char-list input[type=checkbox]"),T=e.querySelectorAll(".char-card"),m=e.querySelector("#char-no-results"),E=e.querySelector("#char-filter");e.querySelectorAll(".char-card-img img").forEach(l=>{l.addEventListener("error",function w(){l.removeEventListener("error",w),l.src.includes("/portrait_thumbs/")?(l.addEventListener("error",()=>{l.style.display="none",l.nextElementSibling.style.display="flex"}),l.src=`/portraits/${l.dataset.portrait}.png`):(l.style.display="none",l.nextElementSibling.style.display="flex")})}),E.addEventListener("input",()=>{const l=E.value.toLowerCase().trim();let w=0;T.forEach(b=>{const k=!l||b.dataset.name.includes(l);b.style.display=k?"":"none",k&&w++}),e.querySelectorAll(".char-category-group").forEach(b=>{const k=[...b.querySelectorAll(".char-card")].some(H=>H.style.display!=="none");b.style.display=k?"":"none"}),m.style.display=w===0?"":"none"});const L=document.createElement("div");L.className="char-tooltip",L.style.display="none",document.body.appendChild(L);function _(l){const{desc:w,category:b}=l.currentTarget.dataset;w&&(L.innerHTML=`
      <div class="tt-body">
        ${b?`<span class="tt-category">${D(b)}</span>`:""}
        <span class="tt-desc">${D(w)}</span>
      </div>`,L.style.display="block",q(l))}function q(l){const b=L.offsetWidth,k=L.offsetHeight;let H=l.clientX+14,B=l.clientY+14;H+b>window.innerWidth-14&&(H=l.clientX-b-14),B+k>window.innerHeight-14&&(B=l.clientY-k-14),L.style.left=H+"px",L.style.top=B+"px"}function f(){L.style.display="none"}T.forEach(l=>{l.addEventListener("mouseenter",_),l.addEventListener("mousemove",q),l.addEventListener("mouseleave",f)}),e.querySelectorAll(".format-opt").forEach(l=>{l.addEventListener("mouseenter",_),l.addEventListener("mousemove",q),l.addEventListener("mouseleave",f)});const S=new MutationObserver(()=>{document.body.contains(e)||(L.remove(),S.disconnect())});S.observe(document.body,{childList:!0,subtree:!0}),o&&(e.querySelector("#setup-lengths").style.display="");const F=e.querySelector("#setup-box"),M=e.querySelector("#mode-to-advanced"),I=e.querySelector("#mode-to-simple"),G=e.querySelector(".setup-title");M.addEventListener("click",()=>{F.classList.replace("setup-box--simple","setup-box--advanced"),G.textContent="THE PHILOSOPHER'S EXPERIMENT";const l=e.querySelector('input[name="debate-format"][value="oxford"]');l&&!l.checked&&(l.checked=!0,le())}),I.addEventListener("click",()=>{F.classList.replace("setup-box--advanced","setup-box--simple"),G.textContent=r;const l=e.querySelector('input[name="debate-format"][value=""]');l&&!l.checked&&(l.checked=!0,le())});const R=e.querySelector("#selection-hint"),x=e.querySelector("#start-btn"),P=e.querySelector("#setup-error"),j=e.querySelector("#topic-error"),Z=e.querySelector("#start-error");function z(){const l=[...g].filter(k=>k.checked).length,w=h.value.trim().length>0;e.querySelector("#char-list").classList.toggle("char-list--maxed",l>=4),l<2?(R.textContent=l===0?"Select 2 to 4 thinkers":"Select 1 more",R.classList.remove("hint-ok","hint-warn")):l>4?(R.textContent=`Too many — deselect ${l-4}`,R.classList.add("hint-warn"),R.classList.remove("hint-ok")):w?(R.textContent=`${l} selected`,R.classList.add("hint-ok"),R.classList.remove("hint-warn")):(R.textContent="Enter a debate topic",R.classList.remove("hint-ok","hint-warn")),x.disabled=l<2||l>4||!w;const b=e.querySelector("#suggest-topic-btn");b&&(b.disabled=l<2||l>4)}e.querySelector("#char-list"),e.querySelector("#char-filter");const h=e.querySelector("#topic-input");h.addEventListener("input",()=>{j.textContent="",z()}),e.querySelector(".setup-or"),e.querySelector(".topic-label"),e.querySelector(".topic-row"),e.querySelector("#cast-suggestion"),z();const c=e.querySelector("#suggest-btn"),y=e.querySelector("#cast-suggestion");let N=!1;c.addEventListener("click",async()=>{const l=h.value.trim();if(!l){h.focus();return}j.textContent="",c.disabled=!0,c.textContent="thinking…";const w=F.classList.contains("setup-box--advanced");w||(y.innerHTML='<div class="cs-loading">selecting the best minds for this topic…</div>',y.style.display="");try{const{picks:b}=await dt(l);if(!b||!b.length)return;if(g.forEach(k=>{k.checked=!1}),b.forEach(({name:k})=>{const H=e.querySelector(`#char-list input[value="${CSS.escape(k)}"]`);H&&(H.checked=!0)}),N=!0,z(),w){e.querySelectorAll('input[name="debate-format"]').forEach(K=>{(K.value==="oxford"||K.value==="cable_news")&&(K.checked=!1)});const H=e.querySelector('input[name="debate-format"][value=""]');H&&(H.checked=!0);const B={id:"_suggested",topic:l,tagline:b.map(K=>K.reason).join(" · "),characters:b.map(K=>K.name),category:"philosophical",audience_level:ye(),format:"",source:"generated"};Q=[B],X=0,W.style.display="",re(B),y.style.display="none",W.scrollIntoView({block:"nearest",behavior:"smooth"})}else{y.innerHTML='<div class="cs-header">── suggested cast ──</div>'+b.map(H=>`<div class="cs-pick">
              <span class="cs-name">${D(H.name)}</span>
              <span class="cs-reason">${D(H.reason)}</span>
            </div>`).join(""),y.style.display="";const k=e.querySelector(`.char-card[data-name="${b[0].name.toLowerCase()}"]`);k&&k.scrollIntoView({block:"nearest",behavior:"smooth"})}}catch(b){y.style.display="none",j.textContent=b.message||"Could not suggest a cast — please try again."}finally{c.disabled=!1,c.textContent="Suggest cast ✦"}});const O=e.querySelector("#suggest-topic-btn"),A=e.querySelector("#topic-suggestion");O.addEventListener("click",async()=>{const l=[...g].filter(w=>w.checked).map(w=>w.value);if(!(l.length<2)){O.disabled=!0,O.textContent="thinking…",A.innerHTML='<div class="cs-loading">finding the perfect flashpoint…</div>',A.style.display="";try{const{topic:w,reason:b}=await pt(l);if(!w)return;h.value=w,A.innerHTML=`<div class="cs-header">── suggested topic ──</div><div class="cs-pick">
          <span class="cs-name">${D(w)}</span>
          <span class="cs-reason">${D(b)}</span>
        </div>`,A.style.display=""}catch(w){console.error("suggest topic failed",w),A.style.display="none"}finally{O.disabled=!1,O.textContent="Suggest topic ✦"}}}),g.forEach(l=>l.addEventListener("change",()=>{N&&(y.style.display="none",N=!1),A.style.display="none",z()}));function oe(){const l=e.querySelector('input[name="audience"]:checked'),w=e.querySelector('input[name="phil-length"]:checked'),b=e.querySelector('input[name="comm-length"]:checked'),k=e.querySelector('input[name="mod-length"]:checked'),H=e.querySelector('input[name="debate-format"]:checked');return{commentator:!0,moderator:!0,diagrams:e.querySelector("#toggle-diagrams").checked,audienceLevel:l?l.value:"university",philosopherLength:w?w.value:"normal",commentatorLength:b?b.value:"normal",moderatorLength:k?k.value:"normal",debateFormat:H?H.value:""}}x.addEventListener("click",async()=>{const l=[...g].filter(k=>k.checked).map(k=>k.value),w=e.querySelector("#topic-input").value.trim();j.textContent="",Z.textContent="",P.textContent="";const b=x.textContent;x.disabled=!0,x.textContent="opening…";try{await n({characters:l,topic:w,...oe()})}catch{}finally{document.contains(x)&&(x.textContent=b,z())}}),e.querySelector("#topic-input").addEventListener("keydown",l=>{l.key==="Enter"&&!x.disabled&&x.click()}),e.querySelector("#setup-about").addEventListener("click",ze),e.querySelector("#setup-help").addEventListener("click",De);const W=e.querySelector("#dotd-card"),ie={heated:"var(--red)",historic:"var(--blue)",philosophical:"var(--gold-dim)",scientific:"var(--blue)",cultural:"var(--amber)",political:"var(--green)"};let ee=[],Q=[],X=-1;function ye(){const l=e.querySelector('input[name="audience"]:checked');return l?l.value:"university"}function Te(){const l=e.querySelector('input[name="debate-format"]:checked');return l?l.value:""}function _e(l){const w=Te();return ee.filter(b=>(w==="oxford"?b.format==="oxford":w==="cable_news"?b.format==="cable_news":b.format!=="oxford"&&b.format!=="cable_news")&&(w==="oxford"||w==="cable_news"||b.audience_level===l))}function Le(l,w=null){if(!l.length)return null;const b=w?l.filter(B=>B.id!==w.id):l,k=b.length?b:l,H=[];for(const B of k)H.push(B),B.source==="curated"&&(H.push(B),H.push(B));return H[Math.floor(Math.random()*H.length)]}function re(l){const w=ie[l.category]||"var(--text-dim)",b=l.format==="oxford",k=l.format==="cable_news";W.classList.toggle("dotd-card--cable",k);const H=F.classList.contains("setup-box--advanced"),K={grade5:"Grade 5",highschool:"High School",university:"University",expert:"Expert"}[l.audience_level]||"",Qe=b?'<span class="dotd-oxford">🎓 Oxford</span>':k?"":H&&K?`<span class="dotd-freeform">${D(K)}</span>`:'<span class="dotd-freeform">Freeform</span>',Xe=b?"":l.source==="curated"?'<span class="dotd-curated">★ curated</span>':'<span class="dotd-generated">AI</span>',Je=l.roles?`<div class="dotd-roles">
           <span class="dotd-role-prop">For: ${l.roles.proposition.join(", ")}</span>
           <span class="dotd-role-opp">Against: ${l.roles.opposition.join(", ")}</span>
         </div>`:`<div class="dotd-cast">${l.characters.join(" · ")}</div>`,Ze=k?`
      <div class="cable-dotd-bar">
        <span class="cable-dotd-live"><span class="cable-dotd-dot"></span>LIVE</span>
        <span class="cable-dotd-breaking">BREAKING NOW</span>
        <span class="cable-dotd-channel">📺 DEBATE ZONE</span>
      </div>`:"";W.innerHTML=`
      ${Ze}
      <div class="dotd-header">
        <span class="dotd-label">${k?"TONIGHT'S SHOWDOWN":"── CURATED DEBATE ──"}</span>
        <span class="dotd-badges">
          <span class="dotd-category" style="color:${w}">${l.category.toUpperCase()}</span>
          ${Qe}
          ${Xe}
        </span>
      </div>
      ${Je}
      <div class="dotd-topic">${D(l.topic)}</div>
      <div class="dotd-tagline">${D(l.tagline)}</div>
      <div class="dotd-actions">
        ${l.id==="_suggested"?"":`<button class="dotd-new-btn" id="dotd-prev" ${X<=0?"disabled":""}>← Prev</button>`}
        <button class="dotd-start-btn" id="dotd-start">${k?"🔴 GO LIVE ▶":"Start this debate ▶"}</button>
        ${l.id==="_suggested"?"":'<button class="dotd-new-btn" id="dotd-next">Next →</button>'}
      </div>
    `,W.querySelector("#dotd-start").addEventListener("click",()=>{const ce=b?"oxford":k?"cable_news":"";n({characters:l.characters,topic:l.topic,...oe(),debateFormat:ce,formatRoles:l.roles||null})});const Ce=W.querySelector("#dotd-prev");Ce&&Ce.addEventListener("click",()=>{X>0&&(X--,re(Q[X]))});const qe=W.querySelector("#dotd-next");qe&&qe.addEventListener("click",()=>{if(X<Q.length-1)X++,re(Q[X]);else{const ce=Le(_e(ye()),Q[X]);ce&&(Q.push(ce),X++,re(ce))}})}function le(){const l=Le(_e(ye()));l?(Q=[l],X=0,re(l)):W.style.display="none"}return nt().then(l=>{ee=l,le()}).catch(()=>{W.style.display="none"}),e.querySelectorAll('input[name="audience"]').forEach(l=>{l.addEventListener("change",()=>{const w=Te();if(w==="oxford"||w==="cable_news"){const b=e.querySelector('input[name="debate-format"][value=""]');b&&(b.checked=!0)}le()})}),e.querySelectorAll('input[name="debate-format"]').forEach(l=>{l.addEventListener("change",le)}),{showError(l){F.classList.contains("setup-box--advanced")?(Z.textContent=l,j.textContent=""):(j.textContent=l,Z.textContent="")}}}function D(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Y(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function yt(e){const a=(e-.2)/3.8*100,n=Math.max(0,Math.min(100,a)).toFixed(1),o=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030";return`<div class="ratings-bar-track"><div class="ratings-bar-fill" style="width:${n}%;background:${o}"></div></div>`}const $t={get_them_fighting:"🥊",force_soundbite:"💬",push_narrative:"📢",wrap_it_up:"⏱️",go_soft:"🕊️"},wt={get_them_fighting:"fight",force_soundbite:"soundbite",push_narrative:"narrative",wrap_it_up:"wrap up",go_soft:"go soft"},Et={socratic:"💭",combative:"⚔️","devil's advocate":"😈",koan:"☯️",journalist:"🎤","straw man":"🪆","steel man":"🛡️","last call":"🔔"};function St(e,a,n="",o,i=null,r=[],d={}){const p=d.moderatorStyleNames??{},t=d.steerTitle??"── STEER THE DEBATE ──",s=d.steerQuitLabel??"Quit game",u=d.steerInputPlaceholder??"Speak into the debate — or leave blank for the moderator…",$=d.steerSubmitLabel??"Steer ▶",g=d.evidencePlaceholder??"Search term — result will be injected as empirical fact…";return new Promise(T=>{const m=document.createElement("div");m.className="steer-drawer",m.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">${t}</div>
        <button class="steer-quit-btn" id="steer-quit">${Y(s)}</button>
      </div>

      ${n?`<div class="steer-summary">${Y(n)}</div>`:""}

      <div class="steer-input-row">
        <input
          class="steer-text-input"
          id="steer-text-input"
          type="text"
          placeholder="${Y(u)}"
          autocomplete="off"
        />
        <button class="steer-submit-btn" id="steer-submit">${Y($)}</button>
      </div>

      <div class="style-grid" id="style-grid">
        ${a.map(x=>{const P=Et[x.style]??"◆",j=p[x.style]??x.style;return`<button
            class="style-icon-btn${x.style===e?" style-selected":""}"
            data-style="${Y(x.style)}"
            title="${Y(j+" — "+x.description)}"
          >
            <span class="style-icon-glyph">${P}</span>
            <span class="style-icon-name">${Y(j)}</span>
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
            placeholder="${Y(g)}"
            autocomplete="off"
          />
          <button class="steer-search-btn" id="evidence-search">Search</button>
        </div>
        <div id="evidence-preview" class="evidence-preview" style="display:none"></div>
      </div>
    `,(o||document.body).appendChild(m);const L=m.querySelector("#steer-text-input");L.focus();let _=e,q="";m.querySelectorAll(".style-icon-btn").forEach(x=>{x.addEventListener("click",()=>{m.querySelectorAll(".style-icon-btn").forEach(P=>P.classList.remove("style-selected")),x.classList.add("style-selected"),_=x.dataset.style,R()})});const f=m.querySelector("#evidence-toggle"),S=m.querySelector("#evidence-panel"),F=m.querySelector("#evidence-preview"),M=m.querySelector("#evidence-query"),I=m.querySelector("#evidence-search");f.addEventListener("click",()=>{const x=S.style.display==="none";S.style.display=x?"":"none",f.classList.toggle("steer-pill--active",x),x&&M.focus()});async function G(){const x=M.value.trim();if(!(!x||!i)){I.disabled=!0,I.textContent="Searching…",F.style.display="none",q="";try{const P=await i(x);q=P.finding,F.style.display="block",F.innerHTML=`
          <div class="evidence-preview-label">── FINDING ──</div>
          <div class="evidence-preview-text">${Y(P.finding)}</div>
          <div class="evidence-preview-actions">
            <button id="evidence-accept" class="evidence-accept-btn">Inject ✓</button>
            <button id="evidence-discard" class="evidence-discard-btn">Discard ✗</button>
          </div>
        `,F.querySelector("#evidence-accept").addEventListener("click",()=>{F.innerHTML=`<div class="evidence-accepted">✓ Evidence will be injected: ${Y(q)}</div>`}),F.querySelector("#evidence-discard").addEventListener("click",()=>{q="",F.style.display="none"})}catch(P){F.style.display="block",F.textContent=`Search failed: ${P.message}`}finally{I.disabled=!1,I.textContent="Search"}}}I.addEventListener("click",G),M.addEventListener("keydown",x=>{x.key==="Enter"&&G()});function R(){m.remove(),T({text:L.value.trim(),style:_,evidence:q})}m.querySelector("#steer-submit").addEventListener("click",R),m.querySelector("#steer-quit").addEventListener("click",()=>{m.remove(),T(null)}),L.addEventListener("keydown",x=>{x.key==="Enter"&&R()})})}function xt(e,a,n={}){const{ratings:o=.8,peak_ratings:i=.8,producer_note:r="",producer_stress:d=0,directives:p=[]}=e,t=["","nervous","stressed","PANICKING","MELTDOWN","FIRE FIRE FIRE"],s=d>0?` (${t[Math.min(d,5)]})`:"",u=d>=3;return new Promise($=>{const g=document.createElement("div");g.className="steer-drawer",g.innerHTML=`
      <div class="steer-drawer-header">
        <div class="steer-title">── COMMERCIAL BREAK ──</div>
        <button class="steer-quit-btn" id="steer-quit">Quit game</button>
      </div>

      <div class="commercial-ratings-row">
        <span class="commercial-ratings-num">📺 ${o.toFixed(1)}M</span>
        <span class="commercial-ratings-peak">peak ${i.toFixed(1)}M</span>
        ${yt(o)}
      </div>

      ${r?`
        <div class="commercial-producer-note${u?" commercial-producer-high":""}">
          <span class="producer-tag">[PRODUCER${s}]</span> ${Y(r)}
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
        ${p.map(([_,q])=>{const f=$t[_]??"◆",S=wt[_]??_.replace(/_/g," ");return`<button
            class="style-icon-btn"
            data-directive="${Y(_)}"
            title="${Y(S+" — "+q)}"
          >
            <span class="style-icon-glyph">${f}</span>
            <span class="style-icon-name">${Y(S)}</span>
          </button>`}).join("")}
      </div>
    `,(a||document.body).appendChild(g);const m=g.querySelector("#steer-text-input");m.focus();let E="";g.querySelectorAll("#directive-list .style-icon-btn").forEach(_=>{_.addEventListener("click",()=>{g.querySelectorAll("#directive-list .style-icon-btn").forEach(q=>q.classList.remove("style-selected")),_.classList.add("style-selected"),E=_.dataset.directive,L()})});function L(){const _=m.value.trim();g.remove(),$({text:_,producer_directive:E})}g.querySelector("#steer-submit").addEventListener("click",L),g.querySelector("#steer-quit").addEventListener("click",()=>{g.remove(),$(null)}),m.addEventListener("keydown",_=>{_.key==="Enter"&&L()})})}function ge(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const Ae=["arctic","cool","cool","warm","warm","charged","charged","heated","heated","flashpoint","flashpoint"];function kt(e,a,n,o,i=null,r=null,d=null,p=null){return new Promise(t=>{var E,L,_,q;const s={};n.forEach(f=>{s[f]=0});const u=document.createElement("div");u.className="cheat-overlay",u.innerHTML=`
      <div class="cheat-modal">
        <div class="cheat-header">
          <span class="cheat-title">── PULL THE STRINGS ──</span>
          <button class="cheat-close-btn" id="cheat-close">✕</button>
        </div>

        <div class="cheat-section-label">── HEAT ──</div>
        <div class="cheat-heat-row">
          <input type="range" class="cheat-heat-slider" id="cheat-heat-slider"
                 min="0" max="10" step="1" value="${a}" />
          <span class="cheat-heat-value" id="cheat-heat-value">${a} — ${Ae[a]}</span>
        </div>

        <div class="cheat-section-label">── BUY A ROUND ──</div>
        <div class="drinks-grid" id="cheat-drinks-grid">
          ${n.map(f=>`
            <div class="drink-row">
              <span class="drink-name">${ge(f)}</span>
              <div class="drink-controls">
                <button class="drink-btn drink-minus" data-name="${ge(f)}">−</button>
                <span class="drink-count" id="drink-count-${ge(f.replace(/ /g,"_"))}">0</span>
                <button class="drink-btn drink-plus" data-name="${ge(f)}">+</button>
              </div>
            </div>
          `).join("")}
        </div>

        ${i||r?`
        <div class="cheat-utils-row">
          ${i?'<button class="cheat-paper-btn" id="cheat-paper">See Newspaper 📰</button>':""}
          ${r?'<button class="cheat-paper-btn" id="cheat-podcast">Export Podcast 🎙</button>':""}
        </div>`:""}

        ${p||d?`
        <div class="cheat-section-label">── END THE EVENING ──</div>
        <div class="cheat-end-row">
          ${p?'<button class="cheat-consensus-btn" id="cheat-consensus">Force Consensus ✓</button>':""}
          ${d?'<button class="cheat-end-btn" id="cheat-end">End Game ✕</button>':""}
        </div>`:""}

        <div class="cheat-footer">
          <button class="cheat-apply-btn" id="cheat-apply">Apply ▶</button>
        </div>
      </div>
    `,document.body.appendChild(u);const $=u.querySelector("#cheat-heat-slider"),g=u.querySelector("#cheat-heat-value");$.addEventListener("input",()=>{const f=parseInt($.value,10);g.textContent=`${f} — ${Ae[f]}`}),u.querySelectorAll(".drink-btn").forEach(f=>{f.addEventListener("click",()=>{const S=f.dataset.name,F=f.classList.contains("drink-plus")?1:-1;s[S]=Math.max(0,(s[S]||0)+F);const M=S.replace(/ /g,"_"),I=u.querySelector(`#drink-count-${M}`);I&&(I.textContent=s[S])})});function T(){u.remove(),t()}async function m(){const f=parseInt($.value,10),S=Object.fromEntries(Object.entries(s).filter(([,M])=>M>0)),F=f!==a;try{await o(e,F?f:null,S)}catch(M){console.error("Cheat failed:",M)}T()}u.querySelector("#cheat-apply").addEventListener("click",m),u.querySelector("#cheat-close").addEventListener("click",T),(E=u.querySelector("#cheat-paper"))==null||E.addEventListener("click",()=>{T(),i()}),(L=u.querySelector("#cheat-podcast"))==null||L.addEventListener("click",()=>{T(),r()}),(_=u.querySelector("#cheat-consensus"))==null||_.addEventListener("click",()=>{T(),p()}),(q=u.querySelector("#cheat-end"))==null||q.addEventListener("click",()=>{T(),d()}),u.addEventListener("click",f=>{f.target===u&&T()})})}function Tt(e,a,n={}){e.innerHTML=a.map(t=>{if(n.renderSeat)return n.renderSeat(t,Fe(t),$e(t),Me(t),He(t));const s=Fe(t),u=He(t);return`
      <div class="seat" id="seat-${$e(t)}">
        <div class="seat-portrait-wrap">
          <img class="seat-img" src="${s}" alt="${we(t)}"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
          <div class="seat-initials" style="display:none">${we(u)}</div>
        </div>
        <div class="seat-name">${we(Me(t))}</div>
      </div>
    `}).join("");let o=null;function i(t){return e.querySelector(`#seat-${$e(t)}`)}function r(){clearTimeout(o),e.querySelectorAll(".seat").forEach(t=>{t.classList.remove("seat-thinking","seat-speaking")})}function d(t){var s;r(),(s=i(t))==null||s.classList.add("seat-thinking")}function p(t){r();const s=i(t);s&&(s.classList.add("seat-speaking"),o=setTimeout(()=>s.classList.remove("seat-speaking"),3e3))}return{setThinking:d,setSpeaking:p,clearAll:r}}function Fe(e){return`/portraits/${e.replace(/ /g,"_")}.png`}function He(e){return e.split(" ").map(a=>a[0]).join("").slice(0,2).toUpperCase()}function Me(e){return e.split(" ").at(-1)}function $e(e){return e.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase()}function we(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const pe=210,Ee=297,C=18,ue=18,Pe=22,_t=22,U=pe-C-ue,Lt=["","cool","cool","warming","warming","heated","heated","fiery","fiery","flashpoint","flashpoint"];async function Se({topic:e,participants:a,format:n,transcript:o,state:i,oxfordVerdict:r,cableReport:d}){var z;const{jsPDF:p}=await de(async()=>{const{jsPDF:h}=await import("./jspdf.es.min-BmG3gXgK.js").then(c=>c.j);return{jsPDF:h}},[]),t=new p({unit:"mm",format:"a4",compress:!0});let s=Pe,u=1;function $(){t.addPage(),u++,s=Pe,t.setFont("helvetica","normal"),t.setFontSize(7),t.setTextColor(170,170,170),t.text(String(u),pe-ue,Ee-10,{align:"right"})}function g(h=8){s+h>Ee-_t&&$()}function T(h=180,c=180,y=180){t.setDrawColor(h,c,y),t.line(C,s,pe-ue,s),s+=3}function m(h=4){s+=h}function E(h,c=100,y=100,N=100){m(2),g(12),t.setFont("helvetica","bold"),t.setFontSize(7.5),t.setTextColor(c,y,N),t.text(h,C,s),s+=4,T(c,y,N),m(2)}t.setFont("helvetica","normal"),t.setFontSize(7),t.setTextColor(170,170,170),t.text("1",pe-ue,Ee-10,{align:"right"}),t.setFont("helvetica","bold"),t.setFontSize(16),t.setTextColor(25,25,25),t.text("THE PHILOSOPHER'S BAR",C,s),s+=6,t.setFont("helvetica","normal"),t.setFontSize(8),t.setTextColor(130,130,130),t.text("Debate Transcript",C,s),s+=6,T(60,60,60),m(2),t.setFont("helvetica","bold"),t.setFontSize(12),t.setTextColor(20,20,20);const L=t.splitTextToSize(e,U);t.text(L,C,s),s+=L.length*5.5+3;const _=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}),q=n==="oxford"?"Oxford":n==="cable_news"?"Cable News":"Freeform";t.setFont("helvetica","normal"),t.setFontSize(8),t.setTextColor(100,100,100),t.text(`Format: ${q}`,C,s),t.text(_,pe-ue,s,{align:"right"}),s+=5;const f=t.splitTextToSize(`Participants: ${a.join(", ")}`,U);t.setTextColor(60,60,60),t.text(f,C,s),s+=f.length*4.5+6,T(),E("TRANSCRIPT");let S=0;for(const h of o){const c=Ct(h.content||"");if(h.type==="beat"){const O=t.splitTextToSize(c,U-6);g(O.length*4+3),t.setFont("helvetica","italic"),t.setFontSize(7.5),t.setTextColor(160,130,70),t.text(O,C+6,s),s+=O.length*4+3;continue}if(h.type==="evidence"){const O=t.splitTextToSize(c,U-6),A=O.length*4.5+9;g(A),t.setFillColor(255,247,215),t.setDrawColor(190,140,40),t.roundedRect(C,s,U,A,1,1,"FD"),t.setFont("helvetica","bold"),t.setFontSize(7),t.setTextColor(150,95,0),t.text("EVIDENCE",C+3,s+4),t.setFont("helvetica","normal"),t.setFontSize(8),t.setTextColor(70,50,0),t.text(O,C+3,s+8),s+=A+3;continue}if(h.backchannel){const O=(h.name||"").replace(/_bc$/,"").replace(/_/g," "),A=t.splitTextToSize(`${O}: ${c}`,U-10);g(A.length*4+2),t.setFont("helvetica","italic"),t.setFontSize(7.5),t.setTextColor(145,145,145),t.text(A,C+10,s),s+=A.length*4+2;continue}if(h.role==="user"){const O=t.splitTextToSize(c,U-6);g(O.length*4.5+9),t.setFont("helvetica","bold"),t.setFontSize(8),t.setTextColor(60,90,160),t.text("You",C,s),s+=4.5,t.setFont("helvetica","normal"),t.setFontSize(8.5),t.setTextColor(40,60,130),t.text(O,C+4,s),s+=O.length*4.5+4;continue}if(h.role==="moderator"){const O=(h.name||"Moderator").replace(/_/g," "),A=t.splitTextToSize(c,U-6);g(A.length*4.5+9),t.setFont("helvetica","italic"),t.setFontSize(8),t.setTextColor(120,120,120),t.text(`─ ${O} ─`,C,s),s+=4.5,t.setFontSize(8),t.text(A,C+4,s),s+=A.length*4.5+4;continue}S++;const y=(h.name||"").replace(/_/g," "),N=t.splitTextToSize(c,U-6);g(N.length*4.5+10),t.setFont("helvetica","normal"),t.setFontSize(7),t.setTextColor(175,175,175),t.text(`[${S}]`,C,s),t.setFont("helvetica","bold"),t.setFontSize(9),t.setTextColor(25,25,25),t.text(y,C+8,s),s+=5,t.setFont("helvetica","normal"),t.setFontSize(8.5),t.setTextColor(40,40,40),t.text(N,C+4,s),s+=N.length*4.5+5}m(2),g(20),T(80,80,80),E("DEBATE REPORT",80,80,80);const{turn:F=0,heat:M=0,concession_total:I=0,concession_counts:G={},partial_agreements:R=[],points_of_agreement:x=[],remaining_disagreements:P=[]}=i||{};if(F){g(16);const h=[C,C+50,C+100];t.setFont("helvetica","bold"),t.setFontSize(14),t.setTextColor(30,30,30),t.text(String(F),h[0],s),t.text(String(M),h[1],s),t.text(String(I),h[2],s),t.setFont("helvetica","normal"),t.setFontSize(7),t.setTextColor(120,120,120),t.text("turns",h[0],s+5),t.text(`${Lt[M]||"heat"} (${M}/10)`,h[1],s+5),t.text("total concessions",h[2],s+5),s+=14}if(x.length){E("AGREEMENTS REACHED",35,120,65),t.setFont("helvetica","normal"),t.setFontSize(8.5),t.setTextColor(30,30,30);for(const h of x){const c=t.splitTextToSize(`• ${h}`,U-4);g(c.length*4.5+2),t.text(c,C+2,s),s+=c.length*4.5+1.5}}if(R.length){E("ALIGNMENTS THAT FORMED",55,90,160);for(const h of R){const c=(h.participants||[]).join(" + "),y=t.splitTextToSize(`${c}  —  ${h.on}`,U-4);g(y.length*4.5+2),t.setFont("helvetica","normal"),t.setFontSize(8.5),t.setTextColor(30,30,30),t.text(y,C+2,s),s+=y.length*4.5+2}}if(P.length){E("STILL UNRESOLVED",170,60,35);for(const h of P)if(typeof h=="object"&&h!==null){const c=t.splitTextToSize(h.topic||"",U-4);g(c.length*4.5+10),t.setFont("helvetica","bold"),t.setFontSize(8.5),t.setTextColor(30,30,30),t.text(c,C+2,s),s+=c.length*4.5+1;const y=`${h.participant_a}: ${h.stance_a}  ·  ${h.participant_b}: ${h.stance_b}`,N=t.splitTextToSize(y,U-6);g(N.length*4.5+3),t.setFont("helvetica","normal"),t.setFontSize(8),t.setTextColor(80,80,80),t.text(N,C+4,s),s+=N.length*4.5+4}else{const c=t.splitTextToSize(String(h),U-4);g(c.length*4.5+2),t.setFont("helvetica","normal"),t.setFontSize(8.5),t.setTextColor(30,30,30),t.text(c,C+2,s),s+=c.length*4.5+2}}const j=Object.entries(G).filter(([,h])=>h>0).sort(([,h],[,c])=>c-h);if(j.length){E("CONCESSIONS PER CHARACTER",100,100,100);const h=Math.max(...j.map(([,N])=>N),1),c=C+55,y=55;for(const[N,O]of j){g(7),t.setFont("helvetica","normal"),t.setFontSize(8.5),t.setTextColor(30,30,30),t.text(N.replace(/_/g," "),C+2,s);const A=Math.round(O/h*y);t.setFillColor(80,80,80),A>0&&t.rect(c,s-3,A,2.5,"F"),t.setFillColor(210,210,210),A<y&&t.rect(c+A,s-3,y-A,2.5,"F"),t.setFont("helvetica","normal"),t.setFontSize(7.5),t.setTextColor(80,80,80),t.text(String(O),c+y+3,s),s+=6}}if(r!=null&&r.winner){E("OXFORD VERDICT",55,75,150),t.setFont("helvetica","normal"),t.setFontSize(8.5),t.setTextColor(30,30,30);const{winner:h,proposition_open:c=50,proposition_final:y=50}=r;g(20),t.text(`Opening vote:  Proposition ${c}%  ·  Opposition ${100-c}%`,C+2,s),s+=5,t.text(`Final vote:    Proposition ${y}%  ·  Opposition ${100-y}%`,C+2,s),s+=5,t.setFont("helvetica","bold");const N=h==="proposition"?"Proposition wins":"Opposition wins",O=y===50?" (tied — opposition takes it)":"";t.text(`Verdict: ${N}${O}`,C+2,s),s+=8}if(d!=null&&d.final_ratings){E("CABLE NEWS REPORT",180,55,35),t.setFont("helvetica","normal"),t.setFontSize(8.5),t.setTextColor(30,30,30);const{final_ratings:h,peak_ratings:c,network_offers:y={},catchphrases:N={},guest_stats:O={}}=d;g(10),t.text(`Final ratings: ${h.toFixed(1)}M  ·  Peak: ${c.toFixed(1)}M`,C+2,s),s+=6;const A=Object.entries(y);if(A.length){t.setFont("helvetica","bold"),t.setFontSize(8),g(6),t.text("Network offers",C+2,s),s+=4,t.setFont("helvetica","normal"),t.setFontSize(8.5);for(const[W,ie]of A){const ee=t.splitTextToSize(`${W.replace(/_/g," ")}: ${ie}`,U-6);g(ee.length*4.5+2),t.text(ee,C+4,s),s+=ee.length*4.5+2}}const oe=Object.entries(N);if(oe.length){t.setFont("helvetica","bold"),t.setFontSize(8),m(2),g(6),t.text("Guest catchphrases",C+2,s),s+=4,t.setFont("helvetica","normal"),t.setFontSize(8.5);for(const[W,ie]of oe){const ee=((z=O[W])==null?void 0:z.catchphrase_count)||0,Q=t.splitTextToSize(`${W.replace(/_/g," ")}: "${ie}"  (used ${ee}×)`,U-6);g(Q.length*4.5+2),t.text(Q,C+4,s),s+=Q.length*4.5+2}}}const Z=e.slice(0,40).replace(/[^a-z0-9]+/gi,"-").toLowerCase().replace(/^-+|-+$/g,"");t.save(`philosophers-bar-${Z||"transcript"}.pdf`)}function Ct(e){return e.replace(/\*\[([^\]]*)\]\*/g,"[$1]").trim()}function qt(e,a,n,o,i,r){const d=r.skin??{},p=d.appName??"THE PHILOSOPHER'S BAR";e.innerHTML=`
    <div class="debate-shell">
      <header class="debate-header">
        <span class="debate-title">${p}</span>
        <div class="header-avatars" id="seats-bar"></div>
        <span class="debate-topic">${v(o)}</span>
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
  `;const t=e.querySelector("#seats-bar"),s=e.querySelector("#convo-pane"),u=e.querySelector("#sidebar"),$=e.querySelector("#left-col");let g="socratic",T=0,m=null,E=!1,L=!1,_="",q={},f={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},S=.8,F=[],M=[],I="freeform",G=null,R={};function x(h){return{transcript:M,format:I,topic:o,participants:n,oxfordVerdict:G,cableReport:R,state:h??f}}const P=Tt(t,n,d);ne(u,{topic:o,turn:0,heat:0,moderator_style:"socratic",partial_agreements:[],points_of_agreement:[],remaining_disagreements:[]});{const h=document.createElement("div");h.id="debate-starting",h.className="debate-starting",h.innerHTML=`<span class="debate-starting-text">${d.debateStartingText??"Opening the bar"}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,s.appendChild(h)}function j(){var h;(h=s.querySelector("#debate-starting"))==null||h.remove()}function Z({type:h,data:c}){switch(h){case"speaker":j(),P.setThinking(c.name),Dt(s,c.name);break;case"message":j(),J(s),c.backchannel||P.setSpeaking(c.name),M.push(c),Nt(s,c);break;case"bars":T=c.heat??T,Bt(u,c.heat,c.concession_total??0);break;case"debug":{const y=c.data!=null?c.data:"",N=typeof y=="object"?`
`+Object.entries(y).map(([O,A])=>`  ${O}: ${JSON.stringify(A)}`).join(`
`):y?` — ${y}`:"";console.log(`[${c.channel}] ${c.label}${N}`);break}case"oxford_opening_vote":f={...f,oxford_opening_vote:c},ne(u,{topic:o,...f,debate_phase:_,format_roles:q});break;case"oxford_verdict":G=c,It(s,c);break;case"phase_update":c.debate_phase&&(I="oxford"),_=c.debate_phase,q=c.format_roles||{},ne(u,{topic:o,...f,debate_phase:_,format_roles:q});break;case"state":J(s),g=c.moderator_style,T=c.heat??T,c.debate_phase&&(_=c.debate_phase),c.format_roles&&Object.keys(c.format_roles).length&&(q=c.format_roles),f={...c,debate_phase:_,format_roles:q},ne(u,{topic:o,...f});break;case"cable_ratings":S=c.ratings??S,F=c.history??F,Ut(u,S,F);break;case"chyron":c.text&&Pt(s,c.text);break;case"breaking_news":c.headline&&Rt(s,c.headline);break;case"producer_whisper":jt(s,c.note,c.stress);break;case"commercial_break":if(L)break;L=!0,I="cable_news",S=c.ratings??S,s.scrollTop=s.scrollHeight,xt(c,$,d).then(y=>{L=!1,y===null?Re(s,{reason:"quit",report:{}},n,z,a,r,x()):r.steer(a,y.text,"socratic","",{},y.producer_directive).catch(N=>ae(s,`Error: ${N.message}`))});break;case"cable_news_end":if(E)break;E=!0,m&&(m(),m=null),J(s),P.clearAll(),R=c.report||{},Re(s,c,n,z,a,r,x());break;case"steer_needed":if(L)break;L=!0,g=c.current_style,c.drift_topic&&At(s,c.drift_topic,o),s.scrollTop=s.scrollHeight,St(g,i,Wt(f),$,r.searchEvidence,n,d).then(y=>{L=!1,y===null?me(s,f,n,z,a,r,x()):(g=y.style,ne(u,{topic:o,...f,moderator_style:y.style}),r.steer(a,y.text,y.style,y.evidence||"",y.drinks||{}).catch(N=>ae(s,`Steer error: ${N.message}`)))});break;case"consensus":if(E)break;E=!0,m&&(m(),m=null),J(s),P.clearAll(),je(s,c,{onNewTopic(y){r.newTopic(a,y).then(()=>{E=!1,f={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=y,ne(u,{topic:y,...f,moderator_style:g,points_of_agreement:[]}),P.clearAll(),m=r.openStream(a,Z)}).catch(N=>ae(s,`Error: ${N.message}`))},onQuit:z},f,a,r,n,x());break;case"game_over":if(E)break;E=!0,m&&(m(),m=null),J(s),P.clearAll(),me(s,{...f,...c},n,z,a,r,x({...f,...c}));break;case"bar_beat":j(),M.push({type:"beat",content:c.text}),Ot(s,c.text);break;case"commentator":j(),Ft(s,c.text);break;case"evidence":j(),M.push({type:"evidence",content:c.finding}),Ht(s,c.finding);break;case"diagram":j(),Mt(s,c);break;case"system":j(),ae(s,c.text);break;case"error":j(),ae(s,`⚠ ${c.text}`);break}}function z(){m&&m(),r.deleteSession(a).catch(()=>{}),e.dispatchEvent(new CustomEvent("debate:quit",{bubbles:!0}))}e.querySelector("#about-btn").addEventListener("click",ze),e.querySelector("#help-btn").addEventListener("click",De),e.querySelector("#sidebar-toggle").addEventListener("click",()=>{const c=e.querySelector(".debate-shell").classList.toggle("sidebar-open");e.querySelector("#sidebar-toggle").textContent=c?"Stats ▲":"Stats"}),e.querySelector("#cheat-btn").addEventListener("click",()=>{E||kt(a,T,n,r.cheat,()=>xe(a,r,n),()=>zt(a,r),()=>{E=!0,m&&(m(),m=null),J(s),P.clearAll(),me(s,f,n,z,a,r,x())},()=>{E=!0,m&&(m(),m=null),J(s),P.clearAll(),je(s,{summary:"The bar has called it — the evening ends in agreement.",points:f.points_of_agreement||[]},{onNewTopic(h){r.newTopic(a,h).then(()=>{E=!1,f={turn:0,heat:0,concession_total:0,partial_agreements:[],remaining_disagreements:[],drift_topic:""},e.querySelector(".debate-topic").textContent=h,ne(u,{topic:h,...f,moderator_style:g,points_of_agreement:[]}),P.clearAll(),m=r.openStream(a,Z)}).catch(c=>ae(s,`Error: ${c.message}`))},onQuit:z},f,a,r,n,x())})}),e.querySelector("#quit-btn").addEventListener("click",()=>{if(E){z();return}f.turn>0?(E=!0,m&&(m(),m=null),me(s,f,n,z,a,r,x())):z()}),m=r.openStream(a,Z)}function Nt(e,{role:a,name:n,content:o,backchannel:i,debate_label:r="",catchphrase:d=""}){const p=document.createElement("div");if(i)p.className="msg msg-bc",p.innerHTML=`<span class="bc-name">${v(n)}:</span> <em>${he(o)}</em>`;else if(a==="moderator")p.className="msg msg-moderator",p.innerHTML=`<div class="msg-mod-label">― ${v(n)} ―</div><div class="msg-content">${he(o)}</div>`;else if(a==="user")p.className="msg msg-user",p.innerHTML=`<div class="msg-name msg-name-user">You</div><div class="msg-content">${he(o)}</div>`;else{const t=`/portraits/${n.replace(/ /g,"_")}.png`,s=n.split(" ").map(g=>g[0]).join("").slice(0,2).toUpperCase(),$=r.includes("Proposition")?"debate-label-prop":"debate-label-opp";p.className="msg msg-philosopher",p.innerHTML=`<div class="msg-avatar"><img class="msg-avatar-img" src="${t}" alt="${v(n)}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="msg-avatar-initials" style="display:none">${v(s)}</div></div><div class="msg-body">`+(r?`<div class="msg-debate-label ${$}">${v(r)}</div>`:"")+`<div class="msg-name">${v(n)}</div><div class="msg-content">${he(o,d)}</div></div>`}V(e,p)}function Ot(e,a){const n=document.createElement("div");n.className="msg msg-beat",n.innerHTML=he(a),V(e,n)}function ae(e,a){const n=document.createElement("div");n.className="msg msg-system",a.endsWith("…")?n.innerHTML=v(a.slice(0,-1))+'<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>':n.textContent=a,V(e,n)}function At(e,a,n){const o=document.createElement("div");o.className="msg msg-drift",o.innerHTML=`<div class="drift-heading">⇌ Topic Drift</div><div class="drift-new">${v(a)}</div><div class="drift-orig">original: ${v(n)}</div>`,V(e,o)}function Ft(e,a){const n=document.createElement("div");n.className="msg msg-commentator",n.innerHTML=`<span class="commentator-icon">📢</span><span class="commentator-text">${v(a)}</span>`,V(e,n)}function Ht(e,a){const n=document.createElement("div");n.className="msg msg-evidence",n.innerHTML=`<span class="evidence-label">── EVIDENCE ──</span> ${v(a)}`,V(e,n)}function Mt(e,{speaker:a,title:n,thumb_url:o,url:i,page_url:r}){const d=document.createElement("div");d.className="msg msg-diagram",d.innerHTML=`<div class="diagram-label">${v(a)} produces a diagram</div><a class="diagram-link" href="${v(r)}" target="_blank" rel="noopener"><img class="diagram-img" src="${v(o)}" alt="${v(n)}" /><div class="diagram-caption">${v(n)}</div></a>`,V(e,d)}function Pt(e,a){const n=document.createElement("div");n.className="msg msg-chyron",n.textContent=a,V(e,n)}function Rt(e,a){const n=document.createElement("div");n.className="msg msg-breaking-news",n.innerHTML=`<div class="breaking-label">🔴 BREAKING NEWS</div><div class="breaking-headline">${v(a)}</div>`,V(e,n)}function jt(e,a,n){if(!a)return;const o=document.createElement("div");o.className="msg msg-producer-whisper";const i=n>=3?"[PRODUCER!!!]":"[PRODUCER]";o.innerHTML=`<span class="producer-tag${n>=3?" producer-tag-high":""}">${i}</span> ${v(a)}`,V(e,o)}function Re(e,{reason:a,report:n={}},o,i,r,d,p=null){var I;J(e);const t=a==="viral",u=t?"📺 SHOW WENT VIRAL":a==="cancelled"?"📺 SHOW CANCELLED":"📺 LAST CALL",$=t?"cable-end-viral":"cable-end-cancelled",{final_ratings:g=0,peak_ratings:T=0,turn_count:m=0,breaking_news_count:E=0,network_offers:L={},catchphrases:_={},guest_stats:q={}}=n,f=Object.entries(L).length?`<div class="end-section cable-end-offers">
        <div class="end-section-label" style="color:var(--amber)">network offers</div>
        ${Object.entries(L).map(([G,R])=>`<div class="cable-offer-row">
            <span class="cable-offer-name">${v(G)}</span>
            <span class="cable-offer-text">${v(R)}</span>
          </div>`).join("")}
      </div>`:"",S=Object.keys(_).length?`<div class="end-section">
        <div class="end-section-label" style="color:var(--blue)">guest catchphrases</div>
        ${Object.entries(_).map(([G,R])=>{const P=(q[G]||{}).catchphrase_count||0;return`<div class="cable-catchphrase-row">
            <span class="cable-cp-name">${v(G)}:</span>
            <span class="cable-cp-phrase">"${v(R)}"</span>
            <span class="cable-cp-count">${P}×</span>
          </div>`}).join("")}
      </div>`:"",F=m?`<div class="end-scoreboard">
        <div class="end-stat">
          <span class="end-stat-num">${m}</span>
          <span class="end-stat-lbl">turns</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--amber)">${g.toFixed(1)}M</span>
          <span class="end-stat-lbl">final ratings</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num" style="color:var(--green)">${T.toFixed(1)}M</span>
          <span class="end-stat-lbl">peak</span>
        </div>
        <div class="end-stat">
          <span class="end-stat-num">${E}</span>
          <span class="end-stat-lbl">breaking news</span>
        </div>
      </div>`:"",M=document.createElement("div");M.className="end-panel end-panel-cable",M.innerHTML=`
    <div class="end-title ${$}">━━━ ${u} ━━━</div>
    ${p?'<div class="end-downloads"><button class="end-dl-btn end-dl-pdf" id="cable-end-pdf">⬇ Transcript</button></div>':""}
    ${F}
    ${f}
    ${S}
  `,V(e,M),(I=M.querySelector("#cable-end-pdf"))==null||I.addEventListener("click",()=>Se({...p,cableReport:n}))}function It(e,{winner:a,proposition_open:n,proposition_final:o,margin:i,persona_verdicts:r,verdict:d}){const p=a==="proposition"?"PROPOSITION WINS":"OPPOSITION WINS",t=a==="proposition"?"oxford-verdict-prop":"oxford-verdict-opp",s=o===50,u=Math.min(n,o),g=Math.max(n,o)-u,T=o>n,m=T?"var(--green)":"var(--amber)",E=(i>=0?"+":"")+i+" pts",L=`
    <div class="oxford-shift-wrap">
      <div class="oxford-shift-ends"><span>Opp 0%</span><span>Prop 100%</span></div>
      <div class="oxford-shift-track">
        <div class="oxford-shift-fill" style="left:${u}%;width:${g}%;background:${m}"></div>
        <div class="oxford-shift-mark oxford-shift-mark-open" style="left:${n}%">
          <div class="oxford-shift-pip"></div>
          <div class="oxford-shift-pip-label">${n}%</div>
        </div>
        <div class="oxford-shift-mark oxford-shift-mark-close" style="left:${o}%">
          <div class="oxford-shift-pip oxford-shift-pip-close"></div>
          <div class="oxford-shift-pip-label oxford-shift-pip-label-close">${o}%</div>
        </div>
      </div>
      <div class="oxford-shift-margin" style="color:${m}">${T?"→":"←"} ${E}</div>
    </div>
  `,_=s?'<div class="oxford-verdict-tie">The motion falls — a tie goes to the opposition.</div>':"",q=document.createElement("div");q.className="oxford-verdict-card",q.innerHTML=`
    <div class="oxford-verdict-title">── THE VERDICT ──</div>
    ${L}
    <div class="oxford-verdict-winner ${t}">${p}</div>
    ${_}
    <div class="oxford-verdict-text">${v(d)}</div>
    <ul class="oxford-verdict-personas">
      ${(r||[]).map(f=>`<li>${v(f)}</li>`).join("")}
    </ul>
  `,V(e,q)}function je(e,{summary:a,points:n},{onNewTopic:o,onQuit:i},r={},d,p,t=[],s=null){var g,T;const u=document.createElement("div");u.className="end-panel end-panel-consensus",u.innerHTML=`
    <div class="end-title end-title-consensus">━━━ CONSENSUS REACHED ━━━</div>
    <blockquote class="end-summary">${v(a)}</blockquote>
    <div class="end-downloads">
      ${s?'<button class="end-dl-btn end-dl-pdf" id="consensus-pdf">⬇ Transcript</button>':""}
      ${d?'<button class="end-dl-btn end-dl-paper" id="consensus-paper">📰 Morning Paper</button>':""}
    </div>
    ${Be(r)}
    ${Ue(n,r)}
    <div class="end-new-topic-row">
      <input class="end-topic-input" id="consensus-topic-input" type="text" placeholder="New topic…" autocomplete="off" />
      <button class="end-continue-btn" id="consensus-continue">Continue ▶</button>
    </div>
  `,V(e,u);const $=u.querySelector("#consensus-topic-input");$.focus(),u.querySelector("#consensus-continue").addEventListener("click",()=>{const m=$.value.trim();m&&o(m)}),$.addEventListener("keydown",m=>{if(m.key==="Enter"){const E=$.value.trim();E&&o(E)}}),(g=u.querySelector("#consensus-paper"))==null||g.addEventListener("click",()=>xe(d,p,t)),(T=u.querySelector("#consensus-pdf"))==null||T.addEventListener("click",()=>Se({...s,state:r}))}function me(e,a,n,o,i,r,d=null){var u,$;J(e);const p=document.createElement("div");p.className="end-panel end-panel-gameover";const t=a.turn||0,s=t?`${t} turn${t!==1?"s":""} — no consensus reached`:"The evening ends before it really began.";p.innerHTML=`
    <div class="end-title end-title-gameover">━━━ LAST CALL ━━━</div>
    <blockquote class="end-summary end-summary-dim">${v(s)}</blockquote>
    <div class="end-downloads">
      ${d?'<button class="end-dl-btn end-dl-pdf" id="game-over-pdf">⬇ Transcript</button>':""}
      ${i?'<button class="end-dl-btn end-dl-paper" id="game-over-paper">📰 Morning Paper</button>':""}
    </div>
    ${Be(a)}
    ${Ue([],a)}
  `,V(e,p),(u=p.querySelector("#game-over-paper"))==null||u.addEventListener("click",()=>xe(i,r,n)),($=p.querySelector("#game-over-pdf"))==null||$.addEventListener("click",()=>Se({...d,state:a}))}async function zt(e,a){const n=document.createElement("div");n.className="newspaper-overlay",n.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Preprocessing transcript… rendering voices… this takes a minute</div>
    </div>
  `,document.body.appendChild(n);try{await a.exportPodcast(e)}catch(o){alert(`Podcast failed: ${o.message}`)}finally{n.remove()}}async function xe(e,a,n=[]){const o=document.createElement("div");o.className="newspaper-overlay",o.innerHTML=`
    <div class="newspaper-loading">
      <div class="newspaper-loading-text">Setting type… rolling the press…</div>
    </div>
  `,document.body.appendChild(o);let i;try{i=await a.fetchNewspaper(e)}catch(r){o.remove(),alert(`Could not print the paper: ${r.message}`);return}o.innerHTML=`
    <div class="newspaper-modal">
      <button class="newspaper-close" id="newspaper-close">✕ Close</button>
      <button class="newspaper-download" id="newspaper-download">⬇ Save as PDF</button>
      <div class="newspaper-page">

        <div class="newspaper-masthead">
          <div class="newspaper-name">${v(i.newspaper_name)}</div>
          <div class="newspaper-meta">
            <span>${v(i.city)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>${v(i.date_str)}</span>
            <span class="newspaper-meta-sep">·</span>
            <span>ONE PENNY</span>
          </div>
          <div class="newspaper-rule"></div>
        </div>

        <div class="newspaper-headline">${v(i.headline)}</div>
        <div class="newspaper-subhead">${v(i.subheadline)}</div>

        ${n.length?`
        <div class="newspaper-portrait-strip">
          ${n.map(r=>`
            <div class="newspaper-portrait-item">
              <img class="newspaper-portrait-img"
                   src="/portraits/${encodeURIComponent(r.replace(/ /g,"_"))}.png"
                   alt="${v(r)}"
                   onerror="this.closest('.newspaper-portrait-item').style.display='none'">
              <div class="newspaper-portrait-name">${v(r)}</div>
            </div>
          `).join("")}
        </div>
        `:""}

        <div class="newspaper-columns">
          <div class="newspaper-main-col">
            <p class="newspaper-lede">${v(i.lede)}</p>
            <p class="newspaper-body">${v(i.body)}</p>
            <div class="newspaper-pullquote">
              <div class="newspaper-pullquote-text">"${v(i.pull_quote)}"</div>
              <div class="newspaper-pullquote-attr">— ${v(i.pull_quote_attr)}</div>
            </div>
          </div>
          <div class="newspaper-scandal-col">
            <div class="newspaper-scandal-head">${v(i.scandal_head)}</div>
            <div class="newspaper-scandal-rule"></div>
            <p class="newspaper-scandal-body">${v(i.scandal_body)}</p>
          </div>
        </div>

      </div>
    </div>
  `,o.querySelector("#newspaper-close").addEventListener("click",()=>o.remove()),o.addEventListener("click",r=>{r.target===o&&o.remove()}),o.querySelector("#newspaper-download").addEventListener("click",()=>{var p,t;const r=o.querySelector(".newspaper-modal").cloneNode(!0);r.querySelectorAll("img").forEach(s=>{s.src&&!s.src.startsWith("http")&&(s.src=window.location.origin+s.getAttribute("src"))}),(p=r.querySelector("#newspaper-close"))==null||p.remove(),(t=r.querySelector("#newspaper-download"))==null||t.remove();const d=window.open("","_blank");d.document.write(`<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>${v(i.newspaper_name)}</title>
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
</head><body>${r.outerHTML}</body></html>`),d.document.close(),d.addEventListener("load",()=>{d.focus(),d.print()})})}function Be(e){const{turn:a=0,heat:n=0,concession_total:o=0}=e;if(!a)return"";const i=We(n),r=Ye(n);return`
    <div class="end-scoreboard">
      <div class="end-stat">
        <span class="end-stat-num">${a}</span>
        <span class="end-stat-lbl">turns</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num" style="color:${i}">${n}<span class="end-stat-denom">/10</span></span>
        <span class="end-stat-lbl">${r}</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-num">${o}</span>
        <span class="end-stat-lbl">concessions</span>
      </div>
    </div>
  `}function Ue(e,a){const{partial_agreements:n=[],points_of_agreement:o=[],remaining_disagreements:i=[]}=a,r=[...new Set([...e,...o])];let d="";return r.length&&(d+=`<div class="end-section end-section-agree">
      <div class="end-section-label">agreements reached</div>
      ${r.map(p=>`<div class="end-item-agree">✓ ${v(p)}</div>`).join("")}
    </div>`),n.length&&(d+=`<div class="end-section end-section-partial">
      <div class="end-section-label">alignments that formed</div>
      ${n.map(p=>`<div class="end-partial">
          <span class="end-partial-names">${v(p.participants.join(" + "))}</span>
          <span class="end-partial-on">${v(p.on)}</span>
        </div>`).join("")}
    </div>`),i.length&&(d+=`<div class="end-section end-section-tension">
      <div class="end-section-label">still unresolved</div>
      ${i.map(p=>typeof p=="object"&&p!==null?`<div class="end-tension">
            <span class="end-tension-topic">${v(p.topic)}</span>
            <span class="end-tension-stances">${v(p.participant_a)}: ${v(p.stance_a)} · ${v(p.participant_b)}: ${v(p.stance_b)}</span>
          </div>`:`<div class="end-tension">${v(String(p))}</div>`).join("")}
    </div>`),d}function Dt(e,a){J(e);const n=document.createElement("div");n.className="msg msg-typing",n.id="typing-indicator",n.innerHTML=`<span class="typing-name">${v(a)}</span><span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>`,V(e,n)}function J(e){var a;(a=e.querySelector("#typing-indicator"))==null||a.remove()}function ne(e,a){var q,f;const{topic:n,turn:o=0,heat:i=0,concession_total:r=0,moderator_style:d="socratic",partial_agreements:p=[],points_of_agreement:t=[],remaining_disagreements:s=[],debate_phase:u="",format_roles:$={},oxford_opening_vote:g=null}=a,T={opening:"Opening Statements",floor:"Floor Debate",rebuttal:"Rebuttals"},m=u&&T[u]?`<div class="sb-phase-banner">${T[u].toUpperCase()}</div>`:"",E=u&&($.proposition||$.opposition)?'<div class="sb-roles">'+((q=$.proposition)!=null&&q.length?`<div class="sb-role sb-role-prop"><span class="sb-role-label">Proposition</span> ${$.proposition.map(S=>v(S)).join(", ")}</div>`:"")+((f=$.opposition)!=null&&f.length?`<div class="sb-role sb-role-opp"><span class="sb-role-label">Opposition</span> ${$.opposition.map(S=>v(S)).join(", ")}</div>`:"")+"</div>":"",L=g?`<details class="oxford-opening-banner">
        <summary class="oxford-opening-summary">
          Opening position: <strong>${g.proposition_pct}%</strong> for proposition
        </summary>
        <div class="oxford-opening-detail">
          <div class="oxford-opening-rationale">${v(g.rationale||"")}</div>
          <ul class="oxford-opening-leanings">
            ${(g.persona_leanings||[]).map(S=>`<li>${v(S)}</li>`).join("")}
          </ul>
        </div>
      </details>`:"";let _=`
    ${m}
    ${E}
    ${L}
    <div class="sb-section">
      <div class="sb-label">TONIGHT'S QUESTION</div>
      <div class="sb-topic">${v(n)}</div>
    </div>

    <div class="sb-section sb-turn">Turn ${o}</div>
  `;t.length&&(_+=`
      <div class="sb-section">
        <div class="sb-label sb-label-agree">Full agreements</div>
        ${t.map(S=>`<div class="sb-agree-item">✓ ${v(S)}</div>`).join("")}
      </div>
    `),p.length&&(_+=`
      <div class="sb-section">
        <div class="sb-label sb-label-partial">Emerging alignments</div>
        ${p.map(S=>`
          <div class="sb-partial">
            <div class="sb-partial-names">${v(S.participants.join(" + "))}</div>
            <div class="sb-partial-on">${v(S.on)}</div>
          </div>
        `).join("")}
      </div>
    `),s.length&&(_+=`
      <div class="sb-section">
        <div class="sb-label sb-label-tension">Open tensions</div>
        ${s.map(S=>typeof S=="object"&&S!==null?`
              <div class="sb-tension">
                <div class="sb-tension-topic">• ${v(S.topic)}</div>
                <div class="sb-tension-stance">${v(S.participant_a)}: ${v(S.stance_a)}</div>
                <div class="sb-tension-stance">${v(S.participant_b)}: ${v(S.stance_b)}</div>
              </div>
            `:`<div class="sb-tension">• ${v(String(S))}</div>`).join("")}
      </div>
    `),_+=`
    <div class="sb-section" id="sb-bars">
      ${Ge(i,r)}
    </div>

    <div class="sb-section" id="sb-cable-ratings" style="${a.cable_ratings!=null?"":"display:none"}">
      ${a.cable_ratings!=null?Ve(a.cable_ratings,a.cable_ratings_history||[]):""}
    </div>

    <div class="sb-section">
      <div class="sb-label">── APPROACH ──</div>
      <div class="sb-style">${v(d)}</div>
    </div>
  `,e.innerHTML=_}function he(e,a=""){let n=v(e);if(a){const i=v(a),r=new RegExp(i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"i");n=n.replace(r,d=>`<mark class="catchphrase-hl">${d}</mark>`)}return n.replace(/\*\[([^\]]+)\]\*/g,'<em class="stage-dir">[$1]</em>').replace(/\*([^*\n]+)\*/g,'<em class="stage-dir">[$1]</em>').replace(/\n/g,"<br>")}function V(e,a){const n=e.scrollHeight-e.scrollTop-e.clientHeight<120;e.appendChild(a),n&&(e.scrollTop=e.scrollHeight)}function v(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ge(e,a){const n=We(e),o=Ye(e),i="█".repeat(e),r="░".repeat(10-e),d=Math.min(a,10),p=Gt(a),t="█".repeat(d),s="░".repeat(10-d),u=Vt(a);return`
    <div class="sb-label">── HEAT ──</div>
    <div class="sb-heat">
      <span style="color:${n}">${i}</span><span class="sb-heat-empty">${r}</span>
      <span class="sb-heat-label" style="color:${n}">${o}</span>
    </div>
    <div class="sb-label" style="margin-top:6px">── CONCESSIONS ──</div>
    <div class="sb-heat">
      <span style="color:${p}">${t}</span><span class="sb-heat-empty">${s}</span>
      <span class="sb-heat-label" style="color:${p}">${u} (${a})</span>
    </div>
  `}function Bt(e,a,n){const o=e.querySelector("#sb-bars");o&&(o.innerHTML=Ge(a,n))}function Ut(e,a,n){const o=e.querySelector("#sb-cable-ratings");o&&(o.style.display="",o.innerHTML=Ve(a,n))}function Ve(e,a){const n=(e-.2)/3.8*100,o=Math.max(0,Math.min(100,n)).toFixed(1),i=e>=3?"#4a9b6f":e>=1.5?"#c8a030":"#c83030",r=a.length>=2?a[a.length-1]>a[a.length-2]?"▲":a[a.length-1]<a[a.length-2]?"▼":"─":"";return`
    <div class="sb-label">── RATINGS ──</div>
    <div class="sb-ratings-num" style="color:${i}">${e.toFixed(1)}M viewers <span class="sb-trend">${r}</span></div>
    <div class="ratings-bar-track">
      <div class="ratings-bar-fill" style="width:${o}%;background:${i}"></div>
    </div>
    <div class="sb-ratings-scale"><span>cancelled</span><span>viral</span></div>
  `}function We(e){return e<=2?"#4a7ab5":e<=4?"#8a9040":e<=6?"#c8a030":e<=8?"#c86030":"#c83030"}function Ye(e){return e<=2?"cool":e<=4?"warm":e<=6?"charged":e<=8?"heated":"flashpoint"}function Gt(e){return e<=2?"#4a7ab5":e<=5?"#4a9b6f":e<=8?"#6abf8a":"#a8e6bf"}function Vt(e){return e===0?"none":e<=2?"rare":e<=5?"some":e<=8?"frequent":"flowing"}function Wt(e,a){const{turn:n,heat:o,partial_agreements:i,remaining_disagreements:r,drift_topic:d}=e;if(!n)return"The debate is just getting started.";if(d)return`The conversation has drifted from the original topic toward ${d}.`;const p=i||[],t=r||[];if(p.length&&t.length){const u=p[0],$=t[0],g=u.participants.join(" and "),T=typeof $=="object"?$.topic:String($);return`${g} are finding common ground, but the group remains divided on ${T}.`}if(p.length){const u=p[0];return`${u.participants.join(" and ")} are converging on ${u.on}, ${o>=6?"though tempers are running high":"with the room following closely"}.`}if(t.length){const u=t[0];return typeof u=="object"?`${u.participant_a} and ${u.participant_b} are sharply divided over ${u.topic}.`:`The room is deadlocked — ${String(u)}.`}const s=o>=8?"at flashpoint":o>=5?"heating up":o>=3?"warming up":"still feeling each other out";return`${n} turns in, no clear alignments yet — the room is ${s}.`}const fe=document.querySelector("#app");let be={},ke={};const Yt=new Set(["production","development","staging"]);async function Kt(){const e=Yt.has("production")?"default":"production",[a]=await Promise.all([Oe(Object.assign({"./skins/default/skin.js":()=>de(()=>import("./skin-D7HGMV-G.js"),[]),"./skins/kids/skin.js":()=>de(()=>import("./skin-DZ74tMJe.js"),[])}),`./skins/${e}/skin.js`,4),Oe(Object.assign({"./skins/default/theme.css":()=>de(()=>Promise.resolve({}),__vite__mapDeps([0])),"./skins/kids/theme.css":()=>de(()=>Promise.resolve({}),__vite__mapDeps([1]))}),`./skins/${e}/theme.css`,4)]);return a}async function Ke(){let e,a;try{[e,a,be]=await Promise.all([at(),ot(),it()])}catch(i){fe.innerHTML=`<div class="fatal-error">Could not reach the server.<br/>${i.message}</div>`;return}const n=!!be.local,o=bt(fe,e,async({characters:i,topic:r,commentator:d=!0,moderator:p=!0,diagrams:t=!1,audienceLevel:s="university",philosopherLength:u="normal",commentatorLength:$="normal",moderatorLength:g="normal",debateFormat:T="",formatRoles:m=null})=>{try{const E=await rt(i,r,d,p,t,s,u,$,g,T,m);Qt(E.session_id,i,r,a)}catch(E){throw o.showError(E.message),E}},{isLocal:n,skin:ke})}function Qt(e,a,n,o){qt(fe,e,a,n,o,{skin:ke,steer:lt,cheat:vt,deleteSession:ht,newTopic:ut,openStream:ft,searchEvidence:ct,fetchNewspaper:gt,exportPodcast:be.podcast?mt:null,isLocal:!!be.local}),fe.addEventListener("debate:quit",()=>Ke(),{once:!0})}Kt().then(e=>{ke=e}).catch(()=>{}).finally(()=>Ke());export{de as _};
