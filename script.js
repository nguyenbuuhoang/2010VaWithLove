"use strict";

// Chỉnh nội dung, màu sắc và mật độ hạt tại đây.
const CONFIG = {
  colors: { pink: "#ff9ecb", gold: "#ffe5b5", violet: "#bdadff", white: "#fff7ff" },
  particleScale: 1,
  maxDpr: 1.35,
  autoAdvanceMs: 7200,
  scenes: [
    { title: "", shape: "planet", duration: 7200 },
    { title: "", shape: "particleText", lines: ["3"], fontScale: .18, duration: 1250 },
    { title: "", shape: "particleText", lines: ["2"], fontScale: .18, duration: 1050 },
    { title: "", shape: "particleText", lines: ["1"], fontScale: .18, duration: 1050 },
    { title: "", shape: "particleText", lines: ["20/10"], fontScale: .145, duration: 2300 },
    { title: "", shape: "particleText", lines: ["Mừng ngày của em"], fontScale: .085, duration: 2600 },
    { title: "", shape: "particleText", lines: ["Anh muốn nói là…"], fontScale: .078, duration: 2600 },
    { eyebrow: "", title: "Anh yêu em", body: "", signoff: "", shape: "love", duration: 2900 },
    { eyebrow: "", title: "Lê Nguyễn Thanh\nVân Anh", body: "", signoff: "", shape: "name", duration: 3900 },
    { eyebrow: "", title: "", body: "", signoff: "", shape: "envelope" },
    { eyebrow: "", title: "Chúc mừng 20/10", body: "Vân Anh yêu dấu,\n\nChúc em một ngày 20/10 thật hạnh phúc.\nMong em luôn rạng rỡ, bình yên,\nvà được yêu thương thật nhiều —\nhôm nay và mỗi ngày sau đó.\n\nCảm ơn em vì đã làm thế giới của anh\nấm áp và đẹp hơn.", signoff: "Anh yêu em ❤️", shape: "letter" }
  ]
};

const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d", { alpha: true });
const titleEl = document.getElementById("messageTitle");
const bodyEl = document.getElementById("messageBody");
const eyebrowEl = document.getElementById("eyebrow");
const signoffEl = document.getElementById("signoff");
const counterEl = document.getElementById("counter");
const hintEl = document.getElementById("hint");
const letterCard = document.getElementById("letterCard");
const envelope = document.getElementById("envelope");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const rand = (min, max) => min + Math.random() * (max - min);
const particles = [];
const stars = [];
const hearts = [];
let width = 0, height = 0, dpr = 1, sceneIndex = 0, sceneStarted = 0, lastTime = 0;
let targets = [], targetKind = "orbit", pointerWave = 0, waveX = 0, waveY = 0, frameCount = 0;
let advanceTimer = 0, resizeTimer = 0, typingTimer = 0, opened = false;

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  dpr = Math.min(CONFIG.maxDpr, window.devicePixelRatio || 1);
  if (w === width && h === height && canvas.width) return;
  width = w; height = h;
  canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  canvas.style.width = w + "px"; canvas.style.height = h + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  seedStars();
  setTargets(CONFIG.scenes[sceneIndex].shape, true);
}

function seedStars() {
  stars.length = 0;
  const count = Math.min(150, Math.max(55, Math.round(width * height / 8500)));
  for (let i = 0; i < count; i++) stars.push({ x: rand(0,width), y: rand(0,height), r: rand(.35,1.25), a: rand(.12,.6), phase: rand(0,Math.PI*2), speed: rand(.3,1.3) });
}

function ensureParticles(count) {
  while (particles.length < count) {
    particles.push({ x: rand(0,width), y: rand(0,height), vx: rand(-.3,.3), vy: rand(-.3,.3), tx: width/2, ty: height/2, r: rand(.7,1.9), alpha: rand(.35,.9), phase: rand(0,Math.PI*2), speed: rand(.8,1.2), orbit: rand(0,Math.PI*2), hue: Math.random(), drift:rand(0,Math.PI*2) });
  }
  if (particles.length > count) particles.length = count;
}

function textTargets(lines, opts = {}) {
  const off = document.createElement("canvas");
  const octx = off.getContext("2d", { willReadFrequently: true });
  const maxWidth = Math.min(width * (opts.width || .86), 660);
  const mobile = width < 560;
  const fontSize = opts.size || Math.min(mobile ? width * .095 : width * .075, height * (lines.length > 1 ? .105 : .17), 72);
  const lineHeight = fontSize * 1.28;
  off.width = Math.ceil(maxWidth); off.height = Math.ceil(lines.length * lineHeight + 24);
  octx.clearRect(0,0,off.width,off.height);
  octx.textAlign = "center"; octx.textBaseline = "middle";
  octx.font = `600 ${fontSize}px "Be Vietnam Pro", Arial, sans-serif`;
  octx.fillStyle = "white";
  for (let i=0;i<lines.length;i++) {
    let line = lines[i];
    while (octx.measureText(line).width > maxWidth * .98 && line.length > 2) {
      // Keep user-facing text intact while scaling to fit the available width.
      octx.font = `600 ${Math.max(16, parseFloat(octx.font.match(/\d+(?:\.\d+)?px/)[0]) * .94)}px "Be Vietnam Pro", Arial, sans-serif`;
    }
    octx.fillText(line, off.width/2, 12 + lineHeight*(i+.5));
  }
  const data = octx.getImageData(0,0,off.width,off.height).data;
  const stride = opts.stride || 3;
  const pts = [];
  for (let y=0;y<off.height;y+=stride) for (let x=0;x<off.width;x+=stride) {
    const idx=(y*off.width+x)*4;
    if (data[idx+3] > 75 && (opts.keepAll || Math.random() < .98)) pts.push({x:width/2-off.width/2+x,y:height*.5-off.height/2+y});
  }
  return pts;
}

function evenlySample(points,count){
  if(points.length<=count)return points;
  const sampled=new Array(count),step=points.length/count;
  for(let i=0;i<count;i++)sampled[i]=points[Math.floor((i+.5)*step)];
  return sampled;
}

function makeTargets(shape,targetCount) {
  const cx=width*.5, cy=height*.51;
  let pts=[];
  if (shape === "planet") {
    // A Fibonacci sphere avoids clumps and keeps the glowing surface evenly filled.
    const radius=Math.min(width,height)*.158;
    const count=Math.max(1350,Math.min(2600,Math.round(width*height/175)));
    const goldenAngle=Math.PI*(3-Math.sqrt(5));
    for(let i=0;i<count;i++){
      const ny=1-2*(i+.5)/count;
      const ring=Math.sqrt(1-ny*ny),a=i*goldenAngle;
      const sx=Math.cos(a)*ring,sz=Math.sin(a)*ring;
      pts.push({x:cx+sx*radius,y:cy+ny*radius,z:sz,globe:true,sx,sy:ny,sz,radius,seed:i});
    }
  } else if(shape === "particleText") {
    const scene=CONFIG.scenes[sceneIndex];
    const size=Math.min(width*(scene.fontScale||.1),height*.17,76);
    pts=evenlySample(textTargets(scene.lines||[""],{size,width:.88,stride:2,keepAll:true}),targetCount);
  } else if(shape === "love" || shape === "name") {
    const lines=shape==="love"?["Anh yêu em"]:["Lê Nguyễn Thanh","Vân Anh"];
    const text=textTargets(lines,{size:shape==="love"?Math.min(width*.125,66):Math.min(width*.088,46),width:.91});
    const textLift=height*(shape==="love"?.2:.22);
    for(let i=0;i<text.length;i++)text[i].y-=textLift;
    pts=text;
    pts.push(...heartTargets(cx,height*.7,Math.min(width,height)*.14,260,3));
  } else if(shape === "letter") {
    // Particle envelope outline and a heart seal frame the readable letter.
    const w=Math.min(width*.74,410),h=Math.min(height*.38,250),top=cy-h*.24;
    for(let i=0;i<130;i++){
      const t=i/129,x=cx-w/2+w*t;
      pts.push({x,y:top-h/2,letter:true},{x,y:top+h/2,letter:true});
      pts.push({x:cx-w/2,y:top-h/2+h*t,letter:true},{x:cx+w/2,y:top-h/2+h*t,letter:true});
      pts.push({x,y:top+h/2-Math.sin(t*Math.PI)*h*.48,letter:true});
      pts.push({x,y:top+h/2-Math.sin((1-t)*Math.PI)*h*.48,letter:true});
    }
    pts.push(...heartTargets(cx,top+h*.37,Math.min(width,height)*.028,80));
  } else if(shape === "envelope") {
    const cx2=width*.5,cy2=height*.56,w=Math.min(width*.68,360),h=Math.min(height*.24,150);
    for(let i=0;i<220;i++){
      const t=i/219;
      pts.push({x:cx2-w/2+w*t,y:cy2-h/2,envelope:true},{x:cx2-w/2+w*t,y:cy2+h/2,envelope:true});
      pts.push({x:cx2-w/2,y:cy2-h/2+h*t,envelope:true},{x:cx2+w/2,y:cy2-h/2+h*t,envelope:true});
      pts.push({x:cx2-w/2+w*t,y:cy2-h/2+h*t,envelope:true});
      pts.push({x:cx2+w/2-w*t,y:cy2-h/2+h*t,envelope:true});
    }
    pts.push(...heartTargets(cx2,cy2,Math.min(width,height)*.045,100));
  } else if(shape === "orbit") {
    const radius=Math.min(width,height)*.2;
    for(let i=0;i<370;i++){let a=Math.random()*Math.PI*2,r=radius*rand(.84,1.16);pts.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r*.34});}
    for(let i=0;i<110;i++){let a=Math.random()*Math.PI*2,r=radius*.46*Math.sqrt(Math.random());pts.push({x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r*.6});}
  } else if(shape === "words") {
    pts=textTargets(["Em là điều","dịu dàng nhất"],{size:Math.min(width*.093,height*.11,64)});
    const radius=Math.min(width,height)*.17;
    for(let i=0;i<150;i++){let a=Math.random()*Math.PI*2;pts.push({x:cx+Math.cos(a)*radius,y:cy+Math.sin(a)*radius*.34});}
  } else {
    const titleLines=["Chúc bé Vân Anh của anh","20/10 thật hạnh phúc ❤️"];
    const bodyLines=["Mong em luôn rạng rỡ, bình yên","và được yêu thương thật nhiều."];
    pts=textTargets(titleLines,{size:Math.min(width<560?width*.071:width*.052,height*.086,44),width:.94});
    const subtitle=textTargets(bodyLines,{size:Math.min(width<560?width*.034:width*.025,height*.043,17),width:.92});
    for(let i=0;i<subtitle.length;i++){subtitle[i].y+=Math.min(height*.16,100);pts.push(subtitle[i]);}
    // Orbit remains visible beside the centered text, shifted outward when narrow.
    const rad=Math.min(width,height)*.17, side=width<560?1:1;
    for(let i=0;i<170;i++){const a=Math.random()*Math.PI*2,r=rad*rand(.94,1.06);pts.push({x:cx+Math.cos(a)*r*side,y:cy+Math.sin(a)*r*.32-height*.16});}
  }
  return pts;
}

function heartTargets(cx,cy,scale,count,layers=1){
  const out=[],wanted=Math.max(1,count*layers),boundary=[];
  let minY=Infinity,maxY=-Infinity;
  for(let i=0;i<160;i++){
    const t=i/160*Math.PI*2;
    const x=16*Math.pow(Math.sin(t),3);
    const y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    boundary.push([x/16.5,y]);minY=Math.min(minY,y);maxY=Math.max(maxY,y);
  }
  const centerY=(minY+maxY)*.5,halfY=(maxY-minY)*.5;
  for(let i=0;i<boundary.length;i++)boundary[i][1]=(boundary[i][1]-centerY)/halfY;
  const step=Math.max(1.7,scale*1.3/Math.sqrt(wanted));
  const half=scale*.9,rows=Math.ceil(half*2/step);
  for(let row=0;row<=rows;row++){
    const py=-half+row*step,ny=-py/half;
    for(let col=0;col<=rows;col++){
      const px=-half+col*step+(row%2)*step*.5,nx=px/half;
      let inside=false;
      for(let i=0,j=boundary.length-1;i<boundary.length;j=i++){
        const [xi,yi]=boundary[i],[xj,yj]=boundary[j];
        if((yi>ny)!==(yj>ny)&&nx<(xj-xi)*(ny-yi)/(yj-yi)+xi)inside=!inside;
      }
      if(inside)out.push({x:cx+px,y:cy-ny*half,heart:true});
    }
  }
  return out;
}

function ringTextTargets(text,cx,cy,radius,fontSize){
  const off=document.createElement("canvas"),o=off.getContext("2d",{willReadFrequently:true});
  off.width=1000;off.height=120;
  o.font='700 '+fontSize+'px "Be Vietnam Pro", Arial, sans-serif';
  o.textAlign="center";o.textBaseline="middle";o.fillStyle="#fff";o.fillText(text,500,60,960);
  const data=o.getImageData(0,0,off.width,off.height).data,pts=[];
  for(let y=0;y<off.height;y+=4)for(let x=0;x<off.width;x+=4){
    if(data[(y*off.width+x)*4+3]>100&&Math.random()<.8){
      const a=(x/1000-.5)*Math.PI*1.78-Math.PI/2,band=y<60?-1:1;
      pts.push({x:cx+Math.cos(a)*(radius+band*fontSize*.8),y:cy+Math.sin(a)*(radius*.62+band*fontSize*.55),orbit:true,ringLetter:true});
    }
  }
  return pts;
}

function orbitalTextTargets(text,cx,cy,radius,tilt,fontSize,band){
  const off=document.createElement("canvas"),o=off.getContext("2d",{willReadFrequently:true});
  off.width=1500;off.height=130;
  o.font='600 '+fontSize+'px "Be Vietnam Pro", Arial, sans-serif';o.textAlign="center";o.textBaseline="middle";o.fillStyle="#fff";
  const repeat=(text+"      ✦      ").repeat(8);o.fillText(repeat,750,65,1460);
  const data=o.getImageData(0,0,off.width,off.height).data,pts=[];
  const step=3;
  for(let y=0;y<off.height;y+=step)for(let x=0;x<off.width;x+=step){
    if(data[(y*off.width+x)*4+3]<100||Math.random()>.88)continue;
    const along=(x/off.width-.5)*Math.PI*2;
    const normal=((y/off.height)-.5)*fontSize*1.45;
    const px=Math.cos(along)*(radius+normal),py=Math.sin(along)*(radius*.52+normal);
    const bx=px*Math.cos(tilt)-py*Math.sin(tilt),by=px*Math.sin(tilt)+py*Math.cos(tilt);
    pts.push({x:cx+bx,y:cy+by,orbit:true,orbitBand:band,orbitAngle:along,orbitNormal:normal,orbitRadius:radius,orbitTilt:tilt,baseX:bx,baseY:by});
  }
  return pts;
}

function setTargets(shape, snap=false) {
  const isTextShape=shape==="love"||shape==="name"||shape==="particleText";
  let count=shape==="planet"?Math.round(Math.min(2600,Math.max(1350,width*height/175))*CONFIG.particleScale):shape==="particleText"?Math.round(Math.min(1600,Math.max(950,width*height/280))*CONFIG.particleScale):Math.round(Math.min(isTextShape?1600:1250,Math.max(isTextShape?850:500,width*height/(isTextShape?360:520)))*CONFIG.particleScale);
  targetKind=shape; targets=makeTargets(shape,count);
  if(shape==="particleText"&&targets.length<count)count=targets.length;
  else count=Math.max(count,targets.length);
  ensureParticles(count);
  const len=targets.length;
  for(let i=0;i<particles.length;i++){
    const p=particles[i];
    if(len){const t=targets[i%len];p.tx=t.x;p.ty=t.y;p.baseX=t.baseX===undefined?t.x:t.baseX;p.baseY=t.baseY===undefined?t.y:t.baseY;p.orbitBand=t.orbitBand;p.orbitAngle=t.orbitAngle;p.orbitNormal=t.orbitNormal;p.orbitRadius=t.orbitRadius;p.orbitTilt=t.orbitTilt;p.headline=!!t.headline;p.heart=!!t.heart;p.globe=!!t.globe;p.sx=t.sx;p.sy=t.sy;p.sz=t.sz;p.globeRadius=t.radius;p.globeSeed=t.seed;}
    else {p.tx=width/2;p.ty=height/2;}
    if(snap){p.x=p.tx+rand(-40,40);p.y=p.ty+rand(-40,40);p.vx=0;p.vy=0;}
    p.sceneTx=p.tx;p.sceneTy=p.ty;
  }
}

function showScene(index) {
  sceneIndex=Math.max(0,Math.min(index,CONFIG.scenes.length-1));
  const scene=CONFIG.scenes[sceneIndex];
  [titleEl,bodyEl,eyebrowEl,signoffEl].forEach(el=>el.classList.remove("visible"));
  const stage=document.getElementById("stage");
  stage.classList.toggle("letter-scene",scene.shape==="letter");
  stage.classList.toggle("envelope-scene",scene.shape==="envelope");
  letterCard.classList.remove("open");
  envelope.hidden=scene.shape!=="envelope";
  envelope.classList.remove("opened");
  titleEl.textContent=scene.title; bodyEl.textContent=""; eyebrowEl.textContent=scene.eyebrow; signoffEl.textContent="";
  setTargets(scene.shape);
  sceneStarted=performance.now();
  clearTimeout(advanceTimer);
  if(scene.shape==="envelope") return;
  if(scene.shape!=="planet"&&scene.shape!=="particleText")requestAnimationFrame(()=>titleEl.classList.add("visible"));
  if(scene.shape!=="envelope"&&scene.shape!=="letter"&&sceneIndex<CONFIG.scenes.length-2){
    advanceTimer=setTimeout(()=>showScene(sceneIndex+1),scene.duration||CONFIG.autoAdvanceMs);
  }
}

function openLetter(){
  if(opened)return;
  opened=true;clearTimeout(advanceTimer);
  showScene(CONFIG.scenes.length-1);
  envelope.classList.add("opened");
  letterCard.classList.add("open");
  const finalScene=CONFIG.scenes[CONFIG.scenes.length-1];
  let i=0;
  bodyEl.textContent="";bodyEl.classList.add("visible");signoffEl.textContent="";signoffEl.classList.add("visible");
  const typeNext=()=>{
    if(i>=finalScene.body.length){signoffEl.textContent=finalScene.signoff;return;}
    bodyEl.textContent=finalScene.body.slice(0,++i);
    typingTimer=setTimeout(typeNext,finalScene.body[i-1]==="\n"?210:34);
  };
  setTimeout(typeNext,1000);
}
function drawPlanet(time) {
  if(targetKind!=="planet") return;
  const cx=width*.5,cy=height*.49,r=Math.min(width,height)*.158;
  const breathe=1+Math.sin(time*.0007)*.012;
  ctx.save();ctx.translate(cx,cy);
  const orbitA=-.72+Math.sin(time*.00016)*.04,orbitB=.72-Math.sin(time*.00016)*.04;
  const orbit=(radius,tilt,speed,front)=>{
    ctx.beginPath();let drawing=false;
    for(let i=0;i<=72;i++){
      const a=i/72*Math.PI*2+time*speed,z=Math.sin(a);
      if(front?z<0:z>=0){drawing=false;continue;}
      const x0=Math.cos(a)*radius,y0=Math.sin(a)*radius*.3;
      const px=(x0*Math.cos(tilt)-y0*Math.sin(tilt))*(1+z*.07);
      const py=(x0*Math.sin(tilt)+y0*Math.cos(tilt))*(1+z*.07);
      if(!drawing){ctx.moveTo(px,py);drawing=true;}else ctx.lineTo(px,py);
    }
    ctx.strokeStyle=front?"rgba(255,211,239,.78)":"rgba(205,187,239,.34)";
    ctx.lineWidth=front?1.25:.8;ctx.shadowBlur=0;ctx.stroke();
  };
  orbit(r*1.58,orbitA,.00019,false);orbit(r*1.88,orbitB,-.00015,false);
  const halo=ctx.createRadialGradient(0,0,r*.55,0,0,r*1.45);
  halo.addColorStop(0,"rgba(220,145,225,.13)");halo.addColorStop(.7,"rgba(166,110,200,.1)");halo.addColorStop(1,"rgba(80,60,130,0)");
  ctx.fillStyle=halo;ctx.beginPath();ctx.arc(0,0,r*1.45*breathe,0,Math.PI*2);ctx.fill();
  const sphere=ctx.createRadialGradient(-r*.38,-r*.42,r*.02,r*.08,r*.1,r*1.12);
  sphere.addColorStop(0,"rgba(255,241,255,.38)");sphere.addColorStop(.38,"rgba(226,151,232,.25)");sphere.addColorStop(.76,"rgba(197,120,211,.18)");sphere.addColorStop(1,"rgba(105,72,145,.13)");
  ctx.beginPath();ctx.arc(0,0,r*breathe,0,Math.PI*2);ctx.fillStyle=sphere;ctx.fill();
  ctx.save();ctx.beginPath();ctx.arc(0,0,r*breathe,0,Math.PI*2);ctx.clip();
  const drift=Math.sin(time*.0002)*r*.2;
  for(let band=0;band<3;band++){
    const y=-r*.55+band*r*.52,g=ctx.createLinearGradient(-r,y,r,y);
    g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.35,"rgba(255,239,255,.18)");g.addColorStop(.55,"rgba(255,189,235,.34)");g.addColorStop(1,"rgba(255,255,255,0)");
    ctx.beginPath();ctx.moveTo(-r,y+drift*.2);ctx.bezierCurveTo(-r*.45,y-r*.14+drift,r*.35,y+r*.13-drift,r,y+drift*.25);ctx.strokeStyle=g;ctx.lineWidth=r*.16;ctx.stroke();
  }
  const shade=ctx.createLinearGradient(-r,0,r,0);shade.addColorStop(0,"rgba(41,31,72,.4)");shade.addColorStop(.5,"rgba(80,60,120,.05)");shade.addColorStop(1,"rgba(255,255,255,.12)");ctx.fillStyle=shade;ctx.fillRect(-r,-r,2*r,2*r);
  ctx.restore();
  const shine=ctx.createRadialGradient(-r*.38,-r*.4,0,-r*.38,-r*.4,r*.48);shine.addColorStop(0,"rgba(255,255,255,.45)");shine.addColorStop(.36,"rgba(255,231,255,.14)");shine.addColorStop(1,"rgba(255,255,255,0)");
  ctx.beginPath();ctx.arc(0,0,r*breathe,0,Math.PI*2);ctx.fillStyle=shine;ctx.fill();
  orbit(r*1.58,orbitA,.00019,true);orbit(r*1.88,orbitB,-.00015,true);
  ctx.restore();
}
function burst(x,y) {
  waveX=x;waveY=y;pointerWave=performance.now();
  for(let i=0;i<9;i++){hearts.push({x:x+rand(-25,25),y:y+rand(-20,20),vx:rand(-.45,.45),vy:rand(-1.4,-.55),life:1,phase:rand(0,6)});}
}

function draw(time) {
  const dt=Math.min(0.034,Math.max(0.001,(time-(lastTime||time))/1000));lastTime=time;frameCount++;
  ctx.clearRect(0,0,width,height);
  for(let i=0;i<stars.length;i++){const s=stars[i];const a=s.a*(.62+.38*Math.sin(time*.001*s.speed+s.phase));ctx.fillStyle=`rgba(235,222,255,${a})`;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,6.283);ctx.fill();}
  // Subtle connector lines appear among neighboring forming particles.
  if(targetKind!=="letter"&&targetKind!=="envelope"&&particles.length<1250){
    const maxD=width<600?19:25, maxD2=maxD*maxD;
    for(let i=0;i<particles.length;i+=3){const a=particles[i];for(let j=i+3;j<Math.min(i+12,particles.length);j+=3){const b=particles[j],dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;if(d<maxD2){ctx.strokeStyle=`rgba(221,190,255,${(1-d/maxD2)*.11})`;ctx.lineWidth=.55;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}}}
  }
  let waveAge=(time-pointerWave)/1000;
  const waveOn=waveAge>=0&&waveAge<1.15;
  const waveR=waveOn?waveAge*(Math.min(width,height)*.68):0;
  if(waveOn){ctx.beginPath();ctx.arc(waveX,waveY,waveR,0,6.283);ctx.strokeStyle=`rgba(255,208,237,${(1-waveAge/1.15)*.33})`;ctx.lineWidth=1.5;ctx.shadowBlur=12;ctx.shadowColor=CONFIG.colors.pink;ctx.stroke();ctx.shadowBlur=0;}
  const orbiting=targetKind==="planet"||targetKind==="orbit"||targetKind==="final"||targetKind==="words"||targetKind==="love"||targetKind==="name";
  if(targetKind==="planet")drawPlanet(time);
  for(let i=0;i<particles.length;i++){
    const p=particles[i];const phase=time*.001*p.speed+p.phase;
    let ox=0,oy=0;
    if(targetKind==="planet"&&p.globe){
      const spin=time*.00032,cs=Math.cos(spin),sn=Math.sin(spin);
      const x=p.sx*cs+p.sz*sn,z=-p.sx*sn+p.sz*cs,radius=p.globeRadius;
      p.tx=width*.5+x*radius;p.ty=height*.49+p.sy*radius;p.globeDepth=z;
    } else if(targetKind==="planet"&&p.headline){
      p.tx=p.sceneTx;p.ty=p.sceneTy;
    } else if(targetKind==="planet"&&p.orbitBand!==undefined){
      const spin=time*(p.orbitBand===0?.00019:-.00015);
      const angle=p.orbitAngle+spin,rr=p.orbitRadius+p.orbitNormal;
      const z=Math.sin(angle)*rr*.68,lx=Math.cos(angle)*rr,ly=Math.sin(angle)*rr*.28;
      const tilt=p.orbitTilt,perspective=1+z/(Math.min(width,height)*.15*7);
      p.tx=width*.5+(lx*Math.cos(tilt)-ly*Math.sin(tilt))*perspective;
      p.ty=height*.49+(lx*Math.sin(tilt)+ly*Math.cos(tilt))*perspective;
    }
    // One time-based spring keeps motion consistent across 30/60/120 Hz screens.
    const textShape=targetKind==="love"||targetKind==="name"||targetKind==="particleText";
    const heartBeat=1+.075*Math.pow(Math.max(0,Math.sin(time*.0042)),5)+.018*Math.sin(time*.0021);
    if(textShape){
      ox+=Math.sin(time*.00048)*1.15;
      oy+=Math.cos(time*.00042)*.9;
    } else {
      const wobble=targetKind==="planet"?.32:.45;
      ox+=Math.sin(time*.00042+p.drift*.12)*wobble;
      oy+=Math.cos(time*.00038+p.drift*.12)*wobble;
    }
    if(waveOn){const dx=p.x-waveX,dy=p.y-waveY,dist=Math.hypot(dx,dy)||1,err=dist-waveR;if(Math.abs(err)<27){const push=(1-Math.abs(err)/27)*12;ox+=dx/dist*push;oy+=dy/dist*push;}}
    let targetX=p.tx+ox,targetY=p.ty+oy;
    if(textShape&&p.heart){
      const cx=width*.5,cy=height*.51;
      targetX=cx+(targetX-cx)*heartBeat;
      targetY=cy+(targetY-cy)*heartBeat;
    }
    const stiffness=targetKind==="planet"?34:targetKind==="love"||targetKind==="name"?42:32;
    const damping=2*Math.sqrt(stiffness)*1.04;
    p.vx+=(stiffness*(targetX-p.x)-damping*p.vx)*dt;
    p.vy+=(stiffness*(targetY-p.y)-damping*p.vy)*dt;
    p.x+=p.vx*dt;p.y+=p.vy*dt;
    const twinkle=textShape?.9+.1*(.5+.5*Math.sin(time*.0015+p.phase*.15)):.78+.22*Math.sin(phase*1.4);const glow=p.hue<.42?CONFIG.colors.pink:p.hue<.72?CONFIG.colors.violet:CONFIG.colors.gold;
    let depthAlpha=1;
    if(targetKind==="planet"&&p.orbitBand!==undefined)depthAlpha=.68+.32*Math.sin(phase*1.3);
    const textScene=targetKind==="love"||targetKind==="name"||targetKind==="particleText";
    const headlineParticle=targetKind==="planet"&&p.headline;
    const crispText=textScene||headlineParticle;
    const globePoint=targetKind==="planet"&&p.globe;
    if(globePoint)depthAlpha=.13+.87*Math.max(0,(p.globeDepth+1)*.5);
    ctx.globalAlpha=globePoint?depthAlpha*(.7+.3*twinkle):(crispText?.98:p.alpha)*twinkle*depthAlpha;
    ctx.fillStyle=globePoint?(p.globeDepth>.48?"#fffaff":p.globeDepth>-.18?"#ffc9f0":"#876aab"):p.heart?(p.hue<.68?"#ff9fcf":"#ffd8eb"):headlineParticle?"#ffffff":textScene?(p.hue<.24?"#fff4f9":p.hue<.5?"#ffd0e4":p.hue<.76?"#fff0c9":"#f5edff"):glow;
    ctx.shadowBlur=0;
    const pointSize=globePoint?(1.1+(p.globeSeed%7)*.12)*(p.globeDepth>.25?1.08:.82):p.heart?1.1+p.hue*.25:textShape?1.35+(p.hue*.28):p.r*(headlineParticle?1.45:p.halo?.7:1)*(crispText?1.12:(.78+.22*twinkle));
    ctx.beginPath();ctx.arc(p.x,p.y,pointSize,0,6.283);ctx.fill();
  }
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  if(targetKind!=="planet")drawPlanet(time);
  for(let i=hearts.length-1;i>=0;i--){const h=hearts[i];h.x+=h.vx*dt;h.y+=h.vy*dt;h.life-=dt/1700;if(h.life<=0){hearts.splice(i,1);continue;}ctx.globalAlpha=h.life;ctx.font="13px serif";ctx.fillStyle=i%2?CONFIG.colors.pink:CONFIG.colors.gold;ctx.fillText(i%3===0?"✦":"♥",h.x+Math.sin(time*.003+h.phase)*4,h.y);}
  ctx.globalAlpha=1;ctx.shadowBlur=0;
  requestAnimationFrame(draw);
}



document.getElementById("stage").addEventListener("pointerdown",e=>burst(e.clientX,e.clientY));
envelope.addEventListener("click",openLetter);
window.addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resize,120);});
resize();
showScene(0);
requestAnimationFrame(draw);
