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
const phrases = ['at the speed of thought.','one DAG at a time.','without the 3am pages.','in real time.'];
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

/* ===== Streaming console ===== */
const lines = [
  ['k','$ ','','airflow dags trigger etl_pipeline'],
  ['','[ingest]   ','ok','✓ ','','pulled ','n','1,284,902','',' rows'],
  ['','[transform]','ok',' ✓ ','','deduped → ','n','1,209,440','',' clean'],
  ['','[validate] ','ok',' ✓ ','','12 quality checks passed'],
  ['','[load]     ','ok',' ✓ ','','warehouse.fact_events updated'],
  ['k','$ ','','dbt run --select marts','',''],
  ['','[dbt]      ','ok',' ✓ ','','9 models built in ','n','4.2s',''],
  ['ok','◆ pipeline healthy · next run 11:00','','']
];
const con = document.getElementById('console');
let started=false;
function runConsole(){
  if(started) return; started=true;
  let i=0;
  (function next(){
    if(i>=lines.length){ setTimeout(()=>{con.innerHTML='';started=false;runConsole();},3500); return; }
    const parts=lines[i]; let html='';
    for(let p=0;p<parts.length;p+=2) html+=`<span class="${parts[p]}">${parts[p+1]}</span>`;
    con.innerHTML += html+'\n'; i++;
    setTimeout(next, 420);
  })();
}

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

/* ===== Interactive 3D particle globe ===== */
const cv = document.getElementById('globe');
const ctx = cv.getContext('2d');
let W,H,R,pts=[],rot=0,tmx=0,tmy=0,camx=0,camy=0;
function resize(){
  W=cv.width=cv.offsetWidth; H=cv.height=cv.offsetHeight; R=Math.min(W,H)*.34;
}
function makeGlobe(){
  pts=[]; const N=620;
  for(let i=0;i<N;i++){
    const y=1-(i/(N-1))*2;
    const r=Math.sqrt(1-y*y);
    const phi=i*Math.PI*(3-Math.sqrt(5));
    pts.push({x:Math.cos(phi)*r, y, z:Math.sin(phi)*r});
  }
}
resize(); makeGlobe(); addEventListener('resize',()=>{resize();});
addEventListener('mousemove',e=>{ tmx=(e.clientX/innerWidth-.5); tmy=(e.clientY/innerHeight-.5); });
function drawGlobe(){
  ctx.clearRect(0,0,W,H);
  camx += (tmy*.5-camx)*.05; camy += (tmx*.5-camy)*.05;
  rot += .0016;
  const cx=W/2, cy=H/2;
  const cosY=Math.cos(rot+camy), sinY=Math.sin(rot+camy);
  const cosX=Math.cos(camx), sinX=Math.sin(camx);
  const proj=pts.map(p=>{
    let x=p.x*cosY - p.z*sinY;
    let z=p.x*sinY + p.z*cosY;
    let y=p.y*cosX - z*sinX;
    z=p.y*sinX + z*cosX;
    const scale=320/(320+z*R);
    return {sx:cx+x*R*scale, sy:cy+y*R*scale, z, scale};
  });
  // connections
  for(let i=0;i<proj.length;i+=2){
    const a=proj[i];
    for(let j=i+1;j<i+6 && j<proj.length;j++){
      const b=proj[j];
      const d=Math.hypot(a.sx-b.sx,a.sy-b.sy);
      if(d<60){
        ctx.strokeStyle=`rgba(198,255,58,${.10*(1-d/60)*Math.max(0,a.scale-.6)})`;
        ctx.lineWidth=.6;
        ctx.beginPath();ctx.moveTo(a.sx,a.sy);ctx.lineTo(b.sx,b.sy);ctx.stroke();
      }
    }
  }
  // dots
  const light = document.body.classList.contains('light');
  proj.forEach(p=>{
    const op=Math.max(.08,(p.scale-.55)*1.4);
    const front = light ? `rgba(60,90,30,${op})` : `rgba(198,255,58,${op})`;
    ctx.fillStyle = p.z<0 ? `rgba(123,92,255,${op})` : front;
    ctx.beginPath();ctx.arc(p.sx,p.sy,1.5*p.scale,0,7);ctx.fill();
  });
  requestAnimationFrame(drawGlobe);
}
drawGlobe();
