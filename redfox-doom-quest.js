(function () {
"use strict";
const script=document.currentScript;
const host=document.querySelector(".oPos.nobr")||(script&&script.parentElement)||document.body;
if(!host||host.querySelector(".rf-doom-mount"))return;
const mount=document.createElement("div");mount.className="rf-doom-mount";host.appendChild(mount);
const root=mount.attachShadow?mount.attachShadow({mode:"open"}):mount;
root.innerHTML=`
<style>
:host{display:block}*{box-sizing:border-box}.box{max-width:900px;width:100%;margin:10px auto;background:#08090b;color:#ddd;border:1px solid #49423d;font:12px monospace;overflow:hidden}
.head{height:32px;padding:8px 12px;background:linear-gradient(#343434,#151515);display:flex;justify-content:space-between;letter-spacing:1px}.head b{color:#c33}
.view{position:relative;aspect-ratio:16/9;min-height:210px;background:#000}canvas{width:100%;height:100%;display:block;image-rendering:pixelated;cursor:crosshair}
.hud{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));background:linear-gradient(#35312c,#101010);border-top:3px solid #82796a}.stat{padding:8px;border-right:1px solid #514b43}.stat span{display:block;color:#999;font-size:10px}.stat strong{display:block;font-size:18px;color:#e4d8c6}.stat:first-child strong{color:#d65b4e}.stat:nth-child(3) strong{color:#e6c16d}
.hint{text-align:center;background:#151515;padding:7px;color:#999;font-size:10px}.cover{position:absolute;inset:0;background:#050607e8;display:flex;align-items:center;justify-content:center;text-align:center;padding:15px}.panel{background:#121416;border:2px solid #7a2923;padding:22px;max-width:470px;box-shadow:0 0 0 5px #222}.logo{font:bold clamp(26px,5vw,44px) Impact,Arial;color:#c33;letter-spacing:3px;text-shadow:3px 3px #411}.sub{color:#aaa;margin:7px 0 15px;letter-spacing:2px}.desc{line-height:1.7}button{background:#76231e;color:white;border:1px solid #b34;padding:10px 17px;font:bold 12px monospace;cursor:pointer;margin-top:12px}
.mobile-controls{display:none;align-items:center;justify-content:space-between;gap:12px;padding:12px 10px;background:#101010;border-top:1px solid #514b43;user-select:none;-webkit-user-select:none}.move-pad{display:grid;grid-template-columns:repeat(3,minmax(52px,1fr));grid-template-rows:repeat(2,1fr);gap:8px}.move-pad [data-touch="forward"]{grid-column:2;grid-row:1}.move-pad [data-touch="left"]{grid-column:1;grid-row:2}.move-pad [data-touch="back"]{grid-column:2;grid-row:2}.move-pad [data-touch="right"]{grid-column:3;grid-row:2}.action-pad{display:flex;gap:8px}.mobile-controls button{margin:0;min-width:70px;height:66px;padding:5px;background:linear-gradient(#333,#171717);border:2px solid #81796d;border-radius:8px;color:#fff;font:bold 12px monospace;touch-action:none;-webkit-tap-highlight-color:transparent;user-select:none}.mobile-controls button:active{background:#76231e;border-color:#d66}.mobile-controls .fire{min-width:82px;background:linear-gradient(#9a3028,#50130f);border-color:#c45}.mobile-controls .use{min-width:82px;background:linear-gradient(#6c572b,#332713);border-color:#b18a4c}.mobile-controls button span{display:block;font-size:22px;line-height:1.15}.mobile-controls button small{display:block;font-size:9px;margin-top:3px;color:#ddd}@media(max-width:760px){.mobile-controls{display:flex}.stat{padding:5px}.stat strong{font-size:15px}.hint{font-size:9px}.view{min-height:190px}.box{margin:4px auto}.mobile-controls button{min-width:clamp(62px,17vw,82px);height:clamp(62px,16vw,76px)}.mobile-controls .fire,.mobile-controls .use{min-width:clamp(72px,19vw,92px)}}
</style>
<div class="box"><div class="head"><span><b>RED FOX</b> // DOOM QUEST</span><span>RED FOX</span></div>
<div class="view"><canvas id="c" width="640" height="360"></canvas>
<div class="cover" id="cover"><div class="panel"><div class="logo">DOOM QUEST</div><div class="sub">RED FOX</div><div class="desc">НАЙДИ ТРИ КОДА<br>ДОБЕРИСЬ ДО ВЫХОДА</div><button id="start">НАЧАТЬ МИССИЮ</button></div></div>

</div><div class="hud"><div class="stat"><span>ЗДОРОВЬЕ</span><strong id="hp">100%</strong></div><div class="stat"><span>ЖИЗНИ</span><strong id="life">3</strong></div><div class="stat"><span>ПАТРОНЫ</span><strong id="ammo">48</strong></div><div class="stat"><span>ОРУЖИЕ</span><strong id="weapon">PISTOL</strong></div><div class="stat"><span>НАЙДЕНО</span><strong id="codes">0/3</strong></div></div>\n<div class="mobile-controls"><div class="move-pad"><button data-touch="forward"><span>▲</span><small>ВПЕРЁД</small></button><button data-touch="left"><span>◀</span><small>ВЛЕВО</small></button><button data-touch="back"><span>▼</span><small>НАЗАД</small></button><button data-touch="right"><span>▶</span><small>ВПРАВО</small></button></div><div class="action-pad"><button class="fire" data-a="fire"><span>✹</span><small>ОГОНЬ</small></button><button class="use" data-a="use"><span> E </span><small>ДЕЙСТВИЕ</small></button></div></div>
<div class="hint">WASD — ДВИЖЕНИЕ · ← → — ПОВОРОТ · МЫШЬ — ОБЗОР · ЛКМ / SPACE — ОГОНЬ · E — ДЕЙСТВИЕ · ESC — ПАУЗА</div></div>`;
const $=id=>root.getElementById(id),canvas=$("c"),ctx=canvas.getContext("2d"),cover=$("cover"),W=640,H=360,z=new Float32Array(W),keys={},touch={};
const map=[
"1111111111111111111111111",
"1000000000100000000000001",
"1011111100101111110111101",
"1000000100001000010000101",
"1111100111101001011110101",
"1000100000000001000000101",
"1010111110111101111101101",
"1010000010000001000000001",
"1011101011110111011111101",
"1000001000000100000000001",
"1110101111100101110111101",
"1000100000100001000100001",
"1011111100111101110101101",
"1000000100000000000100001",
"1011100111110111111101101",
"1000100000000100000000001",
"1010111110111101111110101",
"1000000000000000000000001",
"1111111111111111111111111"].map(r=>r.split("").map(Number));
let player,enemies,items,codes,doors,lives=3,ammo=48,sgAmmo=0,weapon="PISTOL",running=false,paused=false,gameover=false,won=false,raf=0,last=0,shot=0,flash=0,msg="",msgT=0,fireHeld=false,locked=false,exitBlockedNotice=false;
const codeSetup=[{x:3.5,y:3.5,text:"Normal",color:"#f0cf72"},{x:19.5,y:5.5,text:"Nightmare",color:"#ed685b"},{x:12.5,y:14.5,text:"Hell",color:"#8bd8ff"}];
function reset(){
 player={x:2.5,y:1.5,a:0,hp:100,cd:0};enemies=[
 {x:6.5,y:3.5,hp:55,type:0,cd:0},{x:16.5,y:3.5,hp:55,type:0,cd:0},{x:21.5,y:9.5,hp:55,type:0,cd:0},
 {x:5.5,y:13.5,hp:100,type:1,cd:0},{x:14.5,y:15.5,hp:100,type:1,cd:0},{x:22.5,y:15.5,hp:55,type:0,cd:0}];
 items=[{x:3.5,y:5.5,t:"med"},{x:11.5,y:7.5,t:"ammo"},{x:18.5,y:10.5,t:"ammo"},{x:8.5,y:15.5,t:"med"},{x:21.5,y:3.5,t:"gun"}];
 codes=codeSetup.map(o=>({...o,found:false}));doors=[{x:12.5,y:1.5,open:false},{x:7.5,y:9.5,open:false},{x:17.5,y:13.5,open:false}];
 ammo=48;sgAmmo=0;weapon="PISTOL";won=false;gameover=false;exitBlockedNotice=false;msg="НАЙДИ ТРИ КОДА";msgT=3;hud();
}
function wall(x,y){let a=Math.floor(x),b=Math.floor(y);return b<0||b>=map.length||a<0||a>=map[0].length||map[b][a]!==0||doors.some(d=>!d.open&&Math.floor(d.x)===a&&Math.floor(d.y)===b);}
function free(x,y){let r=.18;return !wall(x-r,y-r)&&!wall(x+r,y-r)&&!wall(x-r,y+r)&&!wall(x+r,y+r);}
function move(dx,dy){if(free(player.x+dx,player.y))player.x+=dx;if(free(player.x,player.y+dy))player.y+=dy;}
function ray(a){let dx=Math.cos(a),dy=Math.sin(a),mx=Math.floor(player.x),my=Math.floor(player.y),ddx=Math.abs(1/(dx||.00001)),ddy=Math.abs(1/(dy||.00001)),sx,sy,sdx,sdy;
if(dx<0){sx=-1;sdx=(player.x-mx)*ddx}else{sx=1;sdx=(mx+1-player.x)*ddx}if(dy<0){sy=-1;sdy=(player.y-my)*ddy}else{sy=1;sdy=(my+1-player.y)*ddy}
let side=0,hit=0,n=0;while(!hit&&n++<60){if(sdx<sdy){sdx+=ddx;mx+=sx;side=0}else{sdy+=ddy;my+=sy;side=1}if(my<0||my>=map.length||mx<0||mx>=map[0].length){hit=1;break}if(map[my][mx])hit=map[my][mx];else if(doors.some(d=>!d.open&&Math.floor(d.x)===mx&&Math.floor(d.y)===my))hit=2}
let dist=(side? sdy-ddy:sdx-ddx)*Math.cos(a-player.a);let hx=side?player.x+dist*Math.cos(a):player.y+dist*Math.sin(a);return {d:Math.max(.01,dist),side,hit,u:hx-Math.floor(hx)};}
function world(){
let ceiling=ctx.createLinearGradient(0,0,0,H/2);ceiling.addColorStop(0,"#17191d");ceiling.addColorStop(1,"#45403a");ctx.fillStyle=ceiling;ctx.fillRect(0,0,W,H/2);
let floor=ctx.createLinearGradient(0,H/2,0,H);floor.addColorStop(0,"#39312b");floor.addColorStop(1,"#100f10");ctx.fillStyle=floor;ctx.fillRect(0,H/2,W,H/2);
for(let y=H/2+8;y<H;y+=Math.max(8,(y-H/2)*.12)){ctx.fillStyle="rgba(0,0,0,.10)";ctx.fillRect(0,y,W,1)}
for(let x=0;x<W;x++){let a=player.a-Math.PI/6+x/W*Math.PI/3,h=ray(a);z[x]=h.d;let hh=Math.min(H*2,H/h.d),top=(H-hh)/2;let pal={1:[116,72,55],2:[143,111,62],3:[74,83,88],4:[105,48,39]},c=pal[h.hit]||pal[1];let light=Math.max(.28,1-h.d*.055)*(h.side?.68:1),tx=Math.floor(h.u*8),variation=((tx*13+Math.floor(h.d*3))%5)*2;let base=c.map(v=>Math.max(0,Math.floor((v+variation)*light)));ctx.fillStyle="rgb("+base.join(",")+")";ctx.fillRect(x,top,1.2,hh);if(tx===0||tx===7){ctx.fillStyle="rgba(12,10,10,.42)";ctx.fillRect(x,top,1.2,hh)}for(let row=1;row<4;row++){let yy=top+hh*row/4;if(yy>=0&&yy<H){ctx.fillStyle="rgba(12,10,10,.42)";ctx.fillRect(x,yy,1.2,Math.max(1,hh*.008))}}if(h.hit===2){ctx.fillStyle="#c19a55";ctx.fillRect(x,top+hh*.48,1.2,Math.max(2,hh*.035));ctx.fillStyle="rgba(0,0,0,.35)";ctx.fillRect(x,top+hh*.18,1.2,Math.max(1,hh*.012))}}
}function project(x,y){let dx=x-player.x,dy=y-player.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx)-player.a;while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;if(Math.abs(a)>Math.PI/3||d<.1)return null;return {d,x:W/2+Math.tan(a)*W/(2*Math.tan(Math.PI/6))};}
function sprite(x,y,draw){let p=project(x,y);if(!p||p.x<0||p.x>=W||p.d>z[Math.floor(p.x)])return;draw(p);}
function px(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h)}
function drawMonster(e,p){
let h=Math.min(128,H/p.d*.86),w=h*.72,x=p.x-w/2,y=H/2-h*.48,anim=Math.sin(performance.now()*.009+e.x)*2.2;ctx.save();ctx.translate(x,y);ctx.scale(w/48,h/64);
if(e.type===0){px(14,18,20,26,"#63382e");px(10,25,8,18,"#8b4a36");px(30,25,8,18,"#8b4a36");px(13,10,22,17,"#a45a3c");px(16,5,5,8,"#d1a17a");px(27,5,5,8,"#d1a17a");px(14,12,20,5,"#512d2a");px(17,16,4,3,"#ffe18a");px(27,16,4,3,"#ffe18a");px(20,23,8,4,"#321c1b");px(15,43,8,15,"#49302a");px(26,43,8,15,"#49302a");px(12,56,13,5,"#242020");px(25,56,13,5,"#242020");px(8,27+anim,5,16,"#b36a48");px(35,27-anim,5,16,"#b36a48");px(6,40+anim,7,5,"#d5b18a");px(35,40-anim,7,5,"#d5b18a");px(10,3,4,8,"#d2b08a");px(34,3,4,8,"#d2b08a")}
else{px(11,18,26,28,"#713c3b");px(5,23,10,21,"#9c5550");px(33,23,10,21,"#9c5550");px(10,8,28,18,"#b76c64");px(14,3,20,9,"#8c4b49");px(15,15,5,4,"#ffdc87");px(28,15,5,4,"#ffdc87");px(19,22,11,5,"#351d1c");px(15,44,9,13,"#573b37");px(26,44,9,13,"#573b37");px(11,56,14,6,"#282020");px(26,56,13,6,"#282020");px(3,41,8,5,"#d19a80");px(37,41,8,5,"#d19a80")}
ctx.restore()}
function drawEntities(){
enemies.slice().sort((a,b)=>Math.hypot(b.x-player.x,b.y-player.y)-Math.hypot(a.x-player.x,a.y-player.y)).forEach(e=>{if(e.hp<=0)return;sprite(e.x,e.y,p=>{drawMonster(e,p);let h=Math.min(128,H/p.d*.86),w=h*.72,x=p.x-w/2,y=H/2-h*.48;if(e.hp<(e.type?100:55)){ctx.fillStyle="#321";ctx.fillRect(x,y-7,w,4);ctx.fillStyle="#d43b32";ctx.fillRect(x,y-7,w*e.hp/(e.type?100:55),4)}})});
items.forEach(it=>{if(it.taken)return;sprite(it.x,it.y,p=>{let s=Math.min(42,H/p.d*.22),yy=H/2+s*.12;if(it.t==="med"){px(p.x-s*.48,yy-s*.25,s*.96,s*.72,"#b8b7aa");px(p.x-s*.4,yy-s*.33,s*.8,s*.12,"#e0ded0");px(p.x-s*.1,yy-s*.12,s*.2,s*.48,"#a92825");px(p.x-s*.28,yy+s*.02,s*.56,s*.16,"#a92825")}else if(it.t==="gun"){px(p.x-s*.5,yy,s,s*.24,"#51483b");px(p.x-s*.18,yy-s*.22,s*.56,s*.23,"#9b927e");px(p.x-s*.05,yy-s*.36,s*.22,s*.18,"#282a2b")}else{px(p.x-s*.45,yy-s*.18,s*.9,s*.56,"#77603b");px(p.x-s*.32,yy-s*.28,s*.64,s*.12,"#b28a4e");for(let q=0;q<3;q++)px(p.x-s*.3+q*s*.22,yy-s*.08,s*.09,s*.35,"#d5b36c")}})});
codes.forEach(c=>{if(c.found)return;sprite(c.x,c.y,p=>{let s=Math.min(86,H/p.d*.36),y=H/2-s*.1;ctx.fillStyle="#090909";ctx.fillRect(p.x-s*.58,y-s*.35,s*1.16,s*.58);ctx.strokeStyle=c.color;ctx.lineWidth=2;ctx.strokeRect(p.x-s*.58,y-s*.35,s*1.16,s*.58);ctx.textAlign="center";ctx.font="bold "+Math.max(8,s*.22)+"px monospace";ctx.fillStyle=c.color;ctx.shadowColor=c.color;ctx.shadowBlur=7;ctx.fillText(c.text,p.x,y);ctx.shadowBlur=0})});sprite(23.5,17.5,p=>{let w=Math.min(92,H/p.d*.42),h=w*.38,y=H/2-h*.15;ctx.fillStyle="#17120c";ctx.fillRect(p.x-w/2,y-h/2,w,h);ctx.strokeStyle="#e5bd65";ctx.lineWidth=3;ctx.strokeRect(p.x-w/2,y-h/2,w,h);ctx.fillStyle="#ffe19a";ctx.textAlign="center";ctx.font="bold "+Math.max(10,h*.58)+"px monospace";ctx.shadowColor="#d99b39";ctx.shadowBlur=8;ctx.fillText("ВЫХОД",p.x,y+h*.2);ctx.shadowBlur=0});
}function render(){
world();drawEntities();let moving=(keys.w||keys.s||keys.ArrowUp||keys.ArrowDown||touch.forward||touch.back),bob=moving?Math.sin(performance.now()*.012)*3:0,cx=W/2,base=H-5+bob;
if(weapon==="SHOTGUN"){px(cx-39,base-39,78,35,"#292a29");px(cx-30,base-51,60,25,"#66513c");px(cx-24,base-68,48,20,"#9a8b70");px(cx-18,base-78,36,13,"#393b39");px(cx-12,base-88,24,14,"#17191a");px(cx-29,base-18,22,20,"#514337");px(cx+8,base-18,22,20,"#514337");px(cx-6,base-65,12,6,"#c3b08a")}
else{px(cx-29,base-31,58,31,"#252729");px(cx-21,base-47,42,26,"#77766d");px(cx-15,base-59,30,18,"#555951");px(cx-7,base-78,14,23,"#25292a");px(cx-4,base-88,8,14,"#111516");px(cx-19,base-25,15,20,"#51473b");px(cx+4,base-25,15,20,"#51473b");px(cx-12,base-50,24,4,"#c4b99d")}
if(shot>0){ctx.fillStyle="#ffd27a";ctx.beginPath();ctx.moveTo(cx,base-104);ctx.lineTo(cx-20,base-78);ctx.lineTo(cx,base-57);ctx.lineTo(cx+20,base-78);ctx.fill();ctx.fillStyle="#fff1b0";ctx.fillRect(cx-4,base-85,8,17)}
ctx.strokeStyle="#ddd";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx-5,H/2);ctx.lineTo(cx+5,H/2);ctx.moveTo(cx,H/2-5);ctx.lineTo(cx,H/2+5);ctx.stroke();
if(flash>0){ctx.fillStyle="rgba(190,0,0,"+(flash*.2)+")";ctx.fillRect(0,0,W,H)}
if(msgT>0){ctx.textAlign="center";ctx.font="bold 14px monospace";ctx.fillStyle="#f0d18b";ctx.shadowColor="#000";ctx.shadowBlur=4;ctx.fillText(msg,W/2,26);ctx.shadowBlur=0}
}function hud(){$("hp").textContent=Math.ceil(player.hp)+"%";$("life").textContent=lives;$("ammo").textContent=weapon==="SHOTGUN"?sgAmmo:ammo;$("weapon").textContent=weapon;$("codes").textContent=codes.filter(c=>c.found).length+"/3";}
function fire(){if(player.cd>0)return;if(weapon==="SHOTGUN"&&sgAmmo<=0){weapon="PISTOL";return}if(weapon==="SHOTGUN")sgAmmo--;else ammo=Math.max(0,ammo-1);player.cd=weapon==="SHOTGUN"?.65:.32;shot=.12;let target=null,best=weapon==="SHOTGUN"?5:8;enemies.forEach(e=>{if(e.hp<=0)return;let dx=e.x-player.x,dy=e.y-player.y,d=Math.hypot(dx,dy),a=Math.atan2(dy,dx)-player.a;while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;if(Math.abs(a)<(weapon==="SHOTGUN"?.16:.055)&&d<best&&ray(Math.atan2(dy,dx)).d>d-.25){best=d;target=e}});if(target){target.hp-=weapon==="SHOTGUN"?65:28;if(target.hp<=0){msg="ПРОТИВНИК УНИЧТОЖЕН";msgT=1.4}}}
function use(){let d=doors.find(o=>Math.hypot(player.x-o.x,player.y-o.y)<1.3);if(d){d.open=!d.open;msg=d.open?"ДВЕРЬ ОТКРЫТА":"ДВЕРЬ ЗАКРЫТА";msgT=1.5;return}let c=codes.find(o=>!o.found&&Math.hypot(player.x-o.x,player.y-o.y)<1.5);if(c){c.found=true;msg="КОД НАЙДЕН: "+c.text;msgT=3;}}
function collect(){items.forEach(i=>{if(i.taken||Math.hypot(player.x-i.x,player.y-i.y)>.5)return;i.taken=true;if(i.t==="med"){player.hp=Math.min(100,player.hp+35);msg="АПТЕЧКА +35"}if(i.t==="ammo"){ammo+=18;msg="ПАТРОНЫ +18"}if(i.t==="gun"){weapon="SHOTGUN";sgAmmo+=12;msg="ДРОБОВИК ПОЛУЧЕН"}msgT=1.5});codes.forEach(c=>{if(!c.found&&Math.hypot(player.x-c.x,player.y-c.y)<.8){c.found=true;msg="КОД НАЙДЕН: "+c.text+" · "+codes.filter(v=>v.found).length+"/3";msgT=3;hud()}});let atExit=Math.hypot(player.x-23.5,player.y-17.5)<.8;if(atExit){if(codes.every(c=>c.found)){won=true;end("Игра пройдена!","ФО: название на английском")}else if(!exitBlockedNotice){msg="ВЫХОД ЗАБЛОКИРОВАН · НЕ НАЙДЕНЫ ВСЕ 3 КОДА · "+codes.filter(c=>c.found).length+"/3";msgT=2.5;exitBlockedNotice=true}}else{exitBlockedNotice=false}}
function hurt(dt){enemies.forEach(e=>{if(e.hp<=0)return;let dx=player.x-e.x,dy=player.y-e.y,d=Math.hypot(dx,dy);e.cd-=dt;if(d>1.05&&d<8){let step=(e.type?.45:.62)*dt,nx=e.x+dx/d*step,ny=e.y+dy/d*step;if(!wall(nx,e.y))e.x=nx;if(!wall(e.x,ny))e.y=ny}else if(d<=1.05&&e.cd<=0){player.hp-=e.type?17:10;e.cd=1.2;flash=.7;if(player.hp<=0)loseLife()}})}
function loseLife(){lives--;if(lives<=0){gameover=true;end("МИССИЯ ПРОВАЛЕНА","Все жизни потеряны.");return}let l=lives;reset();lives=l;msg="РЕСПАУН · ЖИЗНЕЙ: "+l;msgT=2}
function update(dt){if(!running||paused||won||gameover)return;let f=(keys.w||keys.ArrowUp||touch.forward?1:0)-(keys.s||keys.ArrowDown||touch.back?1:0),st=0,turn=(keys.ArrowRight||touch.right?1:0)-(keys.ArrowLeft||touch.left?1:0);player.a+=turn*2.2*dt;let v=(keys.Shift?3.3:2.4)*dt,n=Math.hypot(f,st)||1;if(f||st)move((Math.cos(player.a)*f+Math.cos(player.a+Math.PI/2)*st)/n*v,(Math.sin(player.a)*f+Math.sin(player.a+Math.PI/2)*st)/n*v);player.cd=Math.max(0,player.cd-dt);shot=Math.max(0,shot-dt);flash=Math.max(0,flash-dt);msgT-=dt;if(keys[" "]||fireHeld||touch.fire)fire();hurt(dt);collect();hud()}
function end(title,desc){cover.innerHTML='<div class="panel"><div class="logo">'+title+'</div><div class="sub">RED FOX</div><div class="desc">'+desc+'</div><button id="again">ИГРАТЬ СНОВА</button></div>';cover.style.display="flex";$("again").onclick=start}
function loop(t){let dt=Math.min(.05,(t-last)/1000||0);last=t;update(dt);render();if(running&&!won&&!gameover)raf=requestAnimationFrame(loop)}
function start(){reset();running=true;paused=false;cover.style.display="none";cancelAnimationFrame(raf);last=performance.now();raf=requestAnimationFrame(loop)}
function pause(){if(!running||won||gameover)return;paused=!paused;if(paused){cover.innerHTML='<div class="panel"><div class="logo">ПАУЗА</div><button id="resume">ПРОДОЛЖИТЬ</button></div>';cover.style.display="flex";$("resume").onclick=()=>{cover.style.display="none";paused=false;last=performance.now();raf=requestAnimationFrame(loop)}}}
function key(e,down){let k=e.key===" "?" ":e.key;if([" ","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(k))e.preventDefault();keys[k]=down;if(down&&!e.repeat){if(k.toLowerCase()==="e")use();if(k==="Escape")pause();if(k==="1"){weapon="PISTOL";hud()}if(k==="2"&&sgAmmo>0){weapon="SHOTGUN";hud()}}}
window.addEventListener("keydown",e=>key(e,true),{passive:false});window.addEventListener("keyup",e=>key(e,false),{passive:false});window.addEventListener("blur",()=>{Object.keys(keys).forEach(k=>keys[k]=false);fireHeld=false});
canvas.addEventListener("click",()=>{if(running&&canvas.requestPointerLock)canvas.requestPointerLock()});document.addEventListener("pointerlockchange",()=>locked=document.pointerLockElement===canvas);document.addEventListener("mousemove",e=>{if(locked&&running&&!paused)player.a+=e.movementX*.0025});
canvas.addEventListener("mousedown",e=>{if(e.button===0)fireHeld=true});window.addEventListener("mouseup",()=>fireHeld=false);
root.querySelectorAll("[data-touch]").forEach(b=>{let k=b.dataset.touch;const release=()=>{touch[k]=false};b.addEventListener("pointerdown",e=>{e.preventDefault();touch[k]=true;try{b.setPointerCapture(e.pointerId)}catch(_){}});["pointerup","pointerleave","pointercancel","lostpointercapture"].forEach(v=>b.addEventListener(v,release))});
let fb=root.querySelector('[data-a="fire"]');fb.addEventListener("pointerdown",e=>{e.preventDefault();touch.fire=true});["pointerup","pointerleave","pointercancel"].forEach(v=>fb.addEventListener(v,()=>touch.fire=false));root.querySelector('[data-a="use"]').onclick=use;
$("start").onclick=start;reset();render();
})();