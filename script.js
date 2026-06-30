document.getElementById('year').textContent = new Date().getFullYear();

/* ===== Preloader ===== */
const pre = document.getElementById('preloader');
const preFill = document.getElementById('pre-fill');
const preCount = document.getElementById('pre-count');
let pct = 0;
const preTimer = setInterval(()=>{
  pct += Math.random()*16;
  if(pct >= 100){ pct = 100; clearInterval(preTimer); setTimeout(()=>pre.classList.add('done'), 350); }
  preFill.style.width = pct+'%';
  preCount.textContent = Math.floor(pct)+'%';
}, 130);

/* ===== Theme toggle ===== */
const themeBtn = document.getElementById('theme');
if(localStorage.getItem('theme') === 'light') document.body.classList.add('light');
themeBtn.addEventListener('click', ()=>{
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

/* ===== Custom cursor ===== */
const cur = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');
let mx = innerWidth/2, my = innerHeight/2, cx = mx, cy = my;
addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx+'px'; dot.style.top = my+'px';
});
(function follow(){
  cx += (mx-cx)*.18; cy += (my-cy)*.18;
  cur.style.left = cx+'px'; cur.style.top = cy+'px';
  requestAnimationFrame(follow);
})();
document.querySelectorAll('a,button,.magnetic,.tilt,.chips span').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('grow'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('grow'));
});

/* ===== Magnetic buttons ===== */
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    el.style.transform = `translate(${x*.35}px,${y*.35}px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

/* ===== Tilt cards ===== */
document.querySelectorAll('.tilt').forEach(el=>{
  el.addEventListener('mousemove',e=>{
    const r = el.getBoundingClientRect();
    const px = (e.clientX-r.left)/r.width - .5;
    const py = (e.clientY-r.top)/r.height - .5;
    el.style.transform = `perspective(800px) rotateY(${px*8}deg) rotateX(${-py*8}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave',()=>el.style.transform='');
});

/* ===== Scroll progress ===== */
const prog = document.getElementById('progress');
addEventListener('scroll',()=>{
  const h = document.documentElement.scrollHeight - innerHeight;
  prog.style.width = (scrollY/h*100)+'%';
});

/* ===== Typewriter ===== */
const phrases = ['6 hours down to 15 minutes.','~100GB a day.','with medallion architecture.','on Delta Lake.'];
const typed = document.getElementById('typed');
let pi=0,ci=0,del=false;
(function type(){
  const w = phrases[pi];
  typed.textContent = w.slice(0,ci);
  if(!del && ci<w.length) ci++;
  else if(!del && ci===w.length){ del=true; return setTimeout(type,1700); }
  else if(del && ci>0) ci--;
  else { del=false; pi=(pi+1)%phrases.length; }
  setTimeout(type, del?40:75);
})();

/* ===== Pipeline workloads (drive the switcher) ===== */
const WORKLOADS = {
  streaming: {
    mode:'streaming', css:'#c6ff3a', rgb:'198,255,58', speed:1,
    stats:{ vol:[100,'GB/day processed'], lat:[15,'min latency (from 6 hrs)'], perf:[65,'% faster Spark jobs'] },
    nodes:['98.6 GB landed','3 sources merged','14 checks passed','12m 4s latency'],
    console:[
      ['k','>>> ','','spark.readStream.format("cloudFiles")  # CDC ingest'],
      ['','[bronze] ','ok','✓ ','','streamed ','n','98.6 GB','',' today'],
      ['','[silver] ','ok','✓ ','','merged 3 sources → ','n','unified_delta'],
      ['','[gold]   ','ok','✓ ','','KPIs built · 14 quality checks passed'],
      ['','[sync]   ','ok','✓ ','','ADLS → Azure DW synced'],
      ['k','>>> ','','latency_check()','',''],
      ['','[metric] ','ok','✓ ','','end-to-end latency ','n','12m 4s','',' (was 6h)'],
      ['ok','◆ pipeline healthy · streaming','','']
    ]
  },
  batch: {
    mode:'batch', css:'#7b5cff', rgb:'123,92,255', speed:.42,
    stats:{ vol:[10,'K records / month'], lat:[25,'% more completeness'], perf:[65,'% faster Spark jobs'] },
    nodes:['10,240 records','Oracle + SQL merge','+25% completeness','CSV → FTP'],
    console:[
      ['k','>>> ','','spark.read.format("jdbc")  # Oracle + SQL Server'],
      ['','[bronze] ','ok','✓ ','','ingested ','n','10,240 records','',' (3 sources)'],
      ['','[silver] ','ok','✓ ','','medallion merge · Dynamics 365 join'],
      ['','[gold]   ','ok','✓ ','','sales completeness ','n','+25%','',' · 18 KPIs'],
      ['','[deliver]','ok','✓ ','','CSV → FTP · 50+ business entities'],
      ['k','>>> ','','quality_report()','',''],
      ['','[metric] ','ok','✓ ','','Spark runtime ','n','-65%','',' (skew fixed)'],
      ['ok','◆ batch run complete · medallion','','']
    ]
  },
  realtime: {
    mode:'realtime', css:'#36e0ff', rgb:'54,224,255', speed:2.3,
    stats:{ vol:[4812,'events / second'], lat:[280,'ms p99 latency'], perf:[99,'% uptime'] },
    nodes:['4,812 ev/s','sub-sec dedupe','live KPIs','280 ms p99'],
    console:[
      ['k','>>> ','','readStream.trigger(processingTime="1s")'],
      ['','[tail]   ','ok','✓ ','','live events ','n','4,812 ev/s'],
      ['','[merge]  ','ok','✓ ','','sub-second dedupe + upsert'],
      ['','[gold]   ','ok','✓ ','','streaming KPIs refreshed'],
      ['','[push]   ','ok','✓ ','','→ dashboard · ','n','280 ms','',' p99'],
      ['ok','◆ realtime stream · healthy','','']
    ]
  },
  backfill: {
    mode:'backfill', css:'#ffb454', rgb:'255,180,84', speed:.22,
    stats:{ vol:[2400,'GB backfilled'], lat:[9,'hr full replay'], perf:[100,'% history rebuilt'] },
    nodes:['2.4 TB replay','full re-merge','history rebuilt','backfill done'],
    console:[
      ['k','>>> ','','spark.read.option("startingVersion",0)  # full replay'],
      ['','[bronze] ','ok','✓ ','','replaying ','n','2.4 TB','',' of history'],
      ['','[silver] ','ok','✓ ','','re-merging every partition'],
      ['','[gold]   ','ok','✓ ','','KPIs recomputed end-to-end'],
      ['','[verify] ','ok','✓ ','','row counts reconciled · ','n','100%'],
      ['k','>>> ','','progress()','',''],
      ['','[metric] ','ok','✓ ','','full replay in ','n','9h 12m'],
      ['ok','◆ backfill complete · history rebuilt','','']
    ]
  }
};

/* ===== Streaming console (restartable) ===== */
let conLines = WORKLOADS.streaming.console;
const con = document.getElementById('console');
let conGen = 0;                              // generation token cancels stale loops
function runConsole(){
  const gen = ++conGen;
  con.innerHTML = '';
  let i = 0;
  (function next(){
    if(gen !== conGen) return;               // superseded by a newer run
    if(i >= conLines.length){ setTimeout(()=>{ if(gen === conGen) runConsole(); }, 3500); return; }
    const parts = conLines[i]; let html = '';
    for(let p=0;p<parts.length;p+=2) html += `<span class="${parts[p]}">${parts[p+1]}</span>`;
    con.innerHTML += html + '\n'; i++;
    setTimeout(next, 420);
  })();
}

/* ===== Pipeline switcher — clicking a button morphs the page data ===== */
let netAccentRGB = WORKLOADS.streaming.rgb;  // background network colour
let netSpeedMul = WORKLOADS.streaming.speed; // background packet speed
let currentKey = 'streaming';
const swButtons = document.querySelectorAll('.sw-btn');
const nMetrics = document.querySelectorAll('.n-metric');
const conMode = document.getElementById('console-mode');

// reactive hero stat counters (years stays fixed via data-count)
const statSlots = {};
document.querySelectorAll('.stat b[data-slot]').forEach(b => statSlots[b.dataset.slot] = b);
let statsRevealed = false;
function animateCount(el, target){
  clearInterval(el._iv);
  let n = 0; const step = Math.max(1, target / 35);
  el._iv = setInterval(()=>{
    n += step;
    if(n >= target){ n = target; clearInterval(el._iv); }
    el.textContent = Math.round(n).toLocaleString();
  }, 28);
}
function applyStats(w, animate){
  if(!w.stats) return;
  Object.keys(statSlots).forEach(slot => {
    const conf = w.stats[slot]; if(!conf) return;
    const [val, label] = conf, b = statSlots[slot];
    if(b.nextElementSibling) b.nextElementSibling.textContent = label;
    if(animate) animateCount(b, val); else b.textContent = val.toLocaleString();
  });
}

function setWorkload(key){
  const w = WORKLOADS[key]; if(!w) return;
  currentKey = key;
  swButtons.forEach(b => b.classList.toggle('active', b.dataset.w === key));
  // flip the medallion node metrics
  nMetrics.forEach((el, i) => {
    el.classList.add('flip');
    setTimeout(()=>{ el.textContent = w.nodes[i]; el.classList.remove('flip'); }, 220);
  });
  // re-count the hero stats (only once they've been revealed)
  if(statsRevealed) applyStats(w, true);
  // re-run the console with this workload's log
  conLines = w.console;
  if(conMode) conMode.textContent = w.mode;
  runConsole();
  // re-theme: accent colour ripples across the whole page
  document.documentElement.style.setProperty('--accent', w.css);
  netAccentRGB = w.rgb;
  netSpeedMul = w.speed;
}

// animate the reactive stats when they first scroll into view
const statsEl = document.querySelector('.stats');
if(statsEl){
  new IntersectionObserver((es, ob)=>{
    es.forEach(e=>{
      if(!e.isIntersecting) return;
      statsRevealed = true;
      applyStats(WORKLOADS[currentKey], true);
      ob.unobserve(e.target);
    });
  }, { threshold:.5 }).observe(statsEl);
}

/* auto-cycle through workloads until the visitor takes over */
const CYCLE = ['streaming','batch','realtime','backfill'];
let cycleTimer = null;
function stopCycle(){ if(cycleTimer){ clearInterval(cycleTimer); cycleTimer = null; } }
function startCycle(){
  stopCycle();
  cycleTimer = setInterval(()=>{
    setWorkload(CYCLE[(CYCLE.indexOf(currentKey) + 1) % CYCLE.length]);
  }, 6000);
}
swButtons.forEach(b => b.addEventListener('click', ()=>{ stopCycle(); setWorkload(b.dataset.w); }));
// kick off the auto-tour shortly after load (respect reduced-motion)
if(!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(startCycle, 5000);

/* ===== Reveal ===== */
const io = new IntersectionObserver((es)=>{
  es.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.classList.add('in');
    if(e.target.id==='flow' || e.target.querySelector?.('#console')) runConsole();
    io.unobserve(e.target);
  });
},{threshold:.18});
document.querySelectorAll('.section .eyebrow,.big-statement,.stats,.work-row,.flow,.console,.chips,.contact-mega,.mail,.socials').forEach(el=>io.observe(el));
io.observe(document.getElementById('flow'));

/* ===== Count up ===== */
const cio = new IntersectionObserver((es)=>{
  es.forEach(e=>{
    if(!e.isIntersecting) return;
    const el=e.target, t=+el.dataset.count; let n=0, step=Math.max(1,t/35);
    const iv=setInterval(()=>{n+=step;if(n>=t){n=t;clearInterval(iv);}el.textContent=Math.round(n);},28);
    cio.unobserve(el);
  });
},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(c=>cio.observe(c));

/* ===== Stack chip fills ===== */
document.querySelectorAll('.chips span').forEach(s=>{
  s.style.setProperty('--fill', (s.dataset.w*0.6)+'%');
});

/* ===== Contact form ===== */
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const sendBtn = document.getElementById('send-btn');
form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = new FormData(form);
  // If Formspree isn't configured yet, fall back to a prefilled mailto.
  if(form.action.includes('your-form-id')){
    const body = `From: ${data.get('name')} <${data.get('email')}>\n\n${data.get('message')}`;
    window.location.href = `mailto:cnish1111@gmail.com?subject=${encodeURIComponent('Project enquiry from '+data.get('name'))}&body=${encodeURIComponent(body)}`;
    status.textContent = 'Opening your email app…';
    status.className = 'form-status ok';
    return;
  }
  sendBtn.classList.add('sending');
  status.textContent = 'Sending…'; status.className = 'form-status';
  try{
    const res = await fetch(form.action, {method:'POST',body:data,headers:{'Accept':'application/json'}});
    if(res.ok){
      form.reset();
      status.textContent = '✓ Message sent — I\'ll be in touch soon.';
      status.className = 'form-status ok';
    } else throw new Error();
  }catch{
    status.textContent = '✗ Something went wrong. Email me directly instead.';
    status.className = 'form-status err';
  }finally{ sendBtn.classList.remove('sending'); }
});

/* ===== Animated data-pipeline network (DAG) ===== */
/* A directed graph of nodes (data stores) connected by edges (pipelines),
   with packets streaming left → right through the stages — the way data
   actually moves through a medallion architecture. */
const cv = document.getElementById('globe');
const ctx = cv.getContext('2d');
let W, H, layers = [], edges = [], packets = [], tmx = 0, tmy = 0, camx = 0, camy = 0;
const COLS = 6;                 // pipeline stages across the canvas
const ROWS_RANGE = [2, 4];      // nodes per stage

function resize(){ W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; buildGraph(); }

function buildGraph(){
  layers = []; edges = []; packets = [];
  const padX = W * 0.10, padY = H * 0.12;
  const usableW = W - padX * 2, usableH = H - padY * 2;
  // lay out nodes in columns (pipeline stages)
  for(let c = 0; c < COLS; c++){
    const rows = ROWS_RANGE[0] + Math.floor(Math.random() * (ROWS_RANGE[1] - ROWS_RANGE[0] + 1));
    const col = [];
    for(let r = 0; r < rows; r++){
      col.push({
        x: padX + (usableW * c) / (COLS - 1),
        y: padY + usableH * ((r + 0.5) / rows) + (Math.random() - 0.5) * 40,
        bx: 0, by: 0,                       // parallax offset
        pulse: Math.random() * Math.PI * 2, // staggered glow
        big: Math.random() < 0.35           // some are "stores", drawn larger
      });
    }
    layers.push(col);
  }
  // connect each node to 1–2 nodes in the next stage (directed, left → right)
  for(let c = 0; c < COLS - 1; c++){
    layers[c].forEach(a => {
      const next = layers[c + 1];
      const fanout = 1 + (Math.random() < 0.5 ? 1 : 0);
      const picks = new Set();
      for(let k = 0; k < fanout; k++) picks.add(Math.floor(Math.random() * next.length));
      picks.forEach(idx => {
        const b = next[idx];
        edges.push({ a, b });
        // seed a couple of packets per edge at varied progress
        const count = 1 + Math.floor(Math.random() * 2);
        for(let p = 0; p < count; p++){
          packets.push({ a, b, t: Math.random(), speed: 0.0016 + Math.random() * 0.0026 });
        }
      });
    });
  }
}

resize();
addEventListener('resize', resize);
addEventListener('mousemove', e => { tmx = (e.clientX / innerWidth - 0.5); tmy = (e.clientY / innerHeight - 0.5); });

function drawGraph(){
  ctx.clearRect(0, 0, W, H);
  // gentle parallax that follows the cursor
  camx += (tmx * 26 - camx) * 0.05;
  camy += (tmy * 26 - camy) * 0.05;
  const light = document.body.classList.contains('light');
  const tsec = performance.now() / 1000;

  // apply parallax (deeper stages drift a touch more)
  layers.forEach((col, c) => col.forEach(n => {
    const depth = 0.4 + c / (COLS - 1);
    n.bx = camx * depth; n.by = camy * depth;
  }));

  const edge   = light ? 'rgba(40,55,20,'  : `rgba(${netAccentRGB},`;
  const accent = light ? '60,90,30'        : netAccentRGB;
  const accent2 = '123,92,255';

  // edges (pipelines)
  ctx.lineWidth = 0.7;
  edges.forEach(({ a, b }) => {
    ctx.strokeStyle = edge + '0.10)';
    ctx.beginPath();
    ctx.moveTo(a.x + a.bx, a.y + a.by);
    ctx.lineTo(b.x + b.bx, b.y + b.by);
    ctx.stroke();
  });

  // packets flowing along edges
  packets.forEach(pk => {
    pk.t += pk.speed * netSpeedMul;
    if(pk.t > 1) pk.t -= 1;
    const ax = pk.a.x + pk.a.bx, ay = pk.a.y + pk.a.by;
    const bx = pk.b.x + pk.b.bx, by = pk.b.y + pk.b.by;
    const x = ax + (bx - ax) * pk.t;
    const y = ay + (by - ay) * pk.t;
    const fade = Math.sin(pk.t * Math.PI);           // brighter mid-edge
    const col = pk.speed > 0.0032 ? accent2 : accent; // faster = streaming (purple)
    ctx.fillStyle = `rgba(${col},${0.5 * fade})`;
    ctx.beginPath(); ctx.arc(x, y, 1.7, 0, 7); ctx.fill();
    // little trailing comet
    ctx.fillStyle = `rgba(${col},${0.18 * fade})`;
    const tx = ax + (bx - ax) * Math.max(0, pk.t - 0.04);
    const ty = ay + (by - ay) * Math.max(0, pk.t - 0.04);
    ctx.beginPath(); ctx.arc(tx, ty, 1.1, 0, 7); ctx.fill();
  });

  // nodes (data stores)
  layers.forEach(col => col.forEach(n => {
    const glow = (Math.sin(tsec * 1.4 + n.pulse) + 1) / 2;     // 0→1 breathing
    const r = (n.big ? 3.6 : 2.2) + glow * 1.2;
    const op = 0.35 + glow * 0.4;
    // halo
    ctx.fillStyle = `rgba(${accent},${0.08 * glow})`;
    ctx.beginPath(); ctx.arc(n.x + n.bx, n.y + n.by, r * 3, 0, 7); ctx.fill();
    // core
    ctx.fillStyle = `rgba(${accent},${op})`;
    ctx.beginPath(); ctx.arc(n.x + n.bx, n.y + n.by, r, 0, 7); ctx.fill();
    // ring on bigger "store" nodes
    if(n.big){
      ctx.strokeStyle = `rgba(${accent},${0.25 * op})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.arc(n.x + n.bx, n.y + n.by, r + 4, 0, 7); ctx.stroke();
    }
  }));

  requestAnimationFrame(drawGraph);
}
drawGraph();
