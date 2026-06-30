// ---- Year ----
document.getElementById('year').textContent = new Date().getFullYear();

// ---- Typed hero phrases ----
const phrases = ['reliable pipelines.', 'clean data models.', 'real-time insight.', 'elegant code.'];
const typed = document.getElementById('typed');
let pi = 0, ci = 0, deleting = false;
(function type(){
  const word = phrases[pi];
  typed.textContent = word.slice(0, ci);
  if(!deleting && ci < word.length){ ci++; }
  else if(!deleting && ci === word.length){ deleting = true; return setTimeout(type, 1600); }
  else if(deleting && ci > 0){ ci--; }
  else { deleting = false; pi = (pi+1) % phrases.length; }
  setTimeout(type, deleting ? 45 : 85);
})();

// ---- Animated terminal code ----
const codeLines = [
  ['c','# etl_pipeline.py — ingest · transform · serve'],
  ['k','import ','f','pandas ','k','as ','f','pd'],
  ['k','from ','f','airflow ','k','import ','f','DAG\n'],
  ['k','def ','f','transform','c','(df):'],
  ['s','    df = df.dropna().drop_duplicates()'],
  ['s','    df["clean"] = df["raw"].str.lower()'],
  ['k','    return ','f','df.pipe(validate)\n'],
  ['c','# orchestrate the flow ⚙️'],
  ['f','pipeline ','c','>> ','f','warehouse ','c','>> ','s','dashboards ✅'],
];
const codeEl = document.getElementById('code-anim');
let li = 0, idx = 0;
function renderCode(){
  if(li >= codeLines.length) return;
  const parts = codeLines[li];
  let html = '';
  for(let p=0;p<parts.length;p+=2){
    html += `<span class="${parts[p]}">${parts[p+1].replace(/</g,'&lt;')}</span>`;
  }
  const built = codeEl.innerHTML.split('\n');
  built[li] = html;
  codeEl.innerHTML = built.join('\n') + (li < codeLines.length-1 ? '\n' : '');
  li++;
  setTimeout(renderCode, 280);
}
setTimeout(renderCode, 600);

// ---- Reveal on scroll ----
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
}, {threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ---- Count up stats ----
const counters = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.count;
    let n = 0; const step = Math.max(1, Math.round(target/40));
    const t = setInterval(()=>{ n+=step; if(n>=target){n=target;clearInterval(t);} el.textContent=n; }, 30);
    cio.unobserve(el);
  });
},{threshold:.6});
counters.forEach(c=>cio.observe(c));

// ---- Skill bars ----
const bars = document.querySelectorAll('.bar');
const bio = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.style.setProperty('--w', e.target.dataset.level + '%');
    e.target.classList.add('show');
    bio.unobserve(e.target);
  });
},{threshold:.4});
bars.forEach(b=>bio.observe(b));

// ---- Animated data-flow background ----
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W,H,nodes;
function resize(){
  W = canvas.width = innerWidth; H = canvas.height = innerHeight;
  const count = Math.min(70, Math.floor(W*H/24000));
  nodes = Array.from({length:count},()=>({
    x:Math.random()*W, y:Math.random()*H,
    vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4
  }));
}
resize(); addEventListener('resize', resize);
function draw(){
  ctx.clearRect(0,0,W,H);
  for(let i=0;i<nodes.length;i++){
    const a = nodes[i];
    a.x+=a.vx; a.y+=a.vy;
    if(a.x<0||a.x>W)a.vx*=-1;
    if(a.y<0||a.y>H)a.vy*=-1;
    for(let j=i+1;j<nodes.length;j++){
      const b = nodes[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
      if(d<130){
        ctx.strokeStyle=`rgba(52,224,192,${.12*(1-d/130)})`;
        ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
    ctx.fillStyle='rgba(108,140,255,.6)';
    ctx.beginPath();ctx.arc(a.x,a.y,1.6,0,7);ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();
