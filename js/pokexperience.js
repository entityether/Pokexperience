const KEY='pokexperience_v044',OLD='pokexperience_v043',OLDER='pokexperience_v042',OLDEST='pokexperience_v041';
const EMBEDDED_SPRITES={"1": "assets/pokemon/pokemon_1.png", "19": "assets/pokemon/pokemon_19.png", "16": "assets/pokemon/pokemon_16.png", "10": "assets/pokemon/pokemon_10.png", "13": "assets/pokemon/pokemon_13.png", "7": "assets/pokemon/pokemon_7.png", "4": "assets/pokemon/pokemon_4.png", "25": "assets/pokemon/pokemon_25.png"};
const USER_SPRITES={"1":"assets/pokemon/user_pokemon_1.png","2":"assets/pokemon/user_pokemon_2.png","3":"assets/pokemon/user_pokemon_3.png","4":"assets/pokemon/user_pokemon_4.png","5":"assets/pokemon/user_pokemon_5.png","6":"assets/pokemon/user_pokemon_6.png","7":"assets/pokemon/user_pokemon_7.png","8":"assets/pokemon/user_pokemon_8.png","9":"assets/pokemon/user_pokemon_9.png","10":"assets/pokemon/user_pokemon_10.png","19":"assets/pokemon/user_pokemon_19.png","16":"assets/pokemon/user_pokemon_16.png","25":"assets/pokemon/user_pokemon_25.png","11":"assets/pokemon/user_pokemon_11.png","14":"assets/pokemon/user_pokemon_14.png","17":"assets/pokemon/user_pokemon_17.png"};
const FOREST_SPRITE_FIX={"11":"assets/pokemon/forest_pokemon_11.png","13":"assets/pokemon/forest_pokemon_13.png","17":"assets/pokemon/forest_pokemon_17.png"};
const spr=n=>FOREST_SPRITE_FIX[String(n)]||USER_SPRITES[String(n)]||EMBEDDED_SPRITES[String(n)]||'';
const starters={Bulbasaur:{id:1,type:'Planta/Veneno'},Charmander:{id:4,type:'Fuego'},Squirtle:{id:7,type:'Agua'}};

const POKEMON_TYPES={
 1:['Planta','Veneno'],2:['Planta','Veneno'],3:['Planta','Veneno'],
 4:['Fuego'],5:['Fuego'],6:['Fuego','Volador'],
 7:['Agua'],8:['Agua'],9:['Agua'],
 10:['Bicho'],11:['Bicho'],13:['Bicho','Veneno'],14:['Bicho','Veneno'],16:['Normal','Volador'],17:['Normal','Volador'],
 19:['Normal'],25:['Eléctrico']
};
const TYPE_CLASS={
 'Normal':'normal','Fuego':'fuego','Agua':'agua','Eléctrico':'electrico',
 'Planta':'planta','Hielo':'hielo','Lucha':'lucha','Veneno':'veneno',
 'Tierra':'tierra','Volador':'volador','Psíquico':'psiquico','Bicho':'bicho',
 'Roca':'roca','Fantasma':'fantasma','Dragón':'dragon'
};
function typesFor(monOrId,name=''){
 const id=typeof monOrId==='object' ? monOrId.id : monOrId;
 if(POKEMON_TYPES[id])return POKEMON_TYPES[id];
 const raw=typeof monOrId==='object' ? (monOrId.type||'') : '';
 if(raw)return raw.split('/').map(x=>x.trim()).filter(Boolean);
 return [];
}
function typeBadges(monOrId,name=''){
 const ts=typesFor(monOrId,name);
 return `<div class="type-row">${ts.map(t=>`<span class="type-badge type-${TYPE_CLASS[t]||'normal'}">${t}</span>`).join('')}</div>`;
}
function primaryTypeClass(monOrId){
 const t=typesFor(monOrId)[0]||'Normal';
 return TYPE_CLASS[t]||'normal';
}

let pick='Bulbasaur',S=null;
const missionDefs=[
{id:'m1',icon:'⚔️',title:'Primeros pasos',desc:'Ganale 3 combates a Pokémon salvajes.',goal:3,reward:450,xp:45},
{id:'m2',icon:'🔎',title:'Observador de Oak',desc:'Registrá 3 especies distintas en la Pokédex.',goal:3,reward:300,xp:35},
{id:'m3',icon:'🌲',title:'El bosque te llama',desc:'Realizá 3 encuentros en Bosque Verde.',goal:3,reward:600,xp:60}
];
const enemies=[
{name:'Caterpie',id:10,lv:3},{name:'Weedle',id:13,lv:4},{name:'Pikachu',id:25,lv:6},{name:'???',id:null,lv:'?'}
];
function pokemon(n){let d=starters[n];return{name:n,id:d.id,type:d.type,level:5,hp:45,maxHp:45}}
function fresh(n,st){return{version:'0.44.7',trainer:{name:n,level:1,xp:0,next:100,energy:100,maxEnergy:100,money:1500,prestige:0,talents:1,
stats:{Tecnica:5,Estrategia:5,Exploracion:5,Captura:5,Carisma:5,Resistencia:5}},team:[pokemon(st)],pc:[],bag:{pokeball:5,potion:2},
seen:[st],caught:[st],location:'Pueblo Paleta',missions:[],completedMissions:[],equipped:{head:null,body:null,legs:null,back:null,feet:null,accessory:null},battleStats:{battles:0,wins:0,losses:0,streak:0,bestStreak:0,moneyWon:0},progress:{wins:0,forest:0},outfits:[],gearInventory:[],boutiqueStock:[],boutiqueRefreshAt:0,daily:{date:new Date().toDateString(),battles:0,maxBattles:20},work:null,travel:null,avatar:null,avatarChosen:false,repelSteps:0,forestLootDate:'',lastEnergyTick:Date.now(),history:[`${st} se convirtió en tu primer compañero.`],lastSave:Date.now()}}
function migrate(x){
 if(!x.trainer.stats)x.trainer.stats={Tecnica:5,Estrategia:5,Exploracion:5,Captura:5,Carisma:5,Resistencia:5};
 if(x.trainer.talents==null)x.trainer.talents=1;if(!x.missions)x.missions=[];if(!x.progress)x.progress={wins:0,forest:0};
 if(!x.outfits)x.outfits=[];if(!x.completedMissions)x.completedMissions=[];
 if(!x.camp)x.camp={rest:null,owned:[],lastIncident:0};if(!Array.isArray(x.camp.owned))x.camp.owned=[];
 if(!x.missionCycle)x.missionCycle={dailyKey:'',weeklyKey:'',daily:[],weekly:[],stats:{dailyDone:0,streak:0}};if(!x.missionCycle.stats)x.missionCycle.stats={dailyDone:0,streak:0};
 if(!x.centerHeal)x.centerHeal=null;
 if(!x.playerIdentity)x.playerIdentity={nick:'',titleId:''};if(!x.achievementState)x.achievementState={unlocked:[],npcVisits:{}};if(!Array.isArray(x.achievementState.unlocked))x.achievementState.unlocked=[];if(!x.achievementState.npcVisits)x.achievementState.npcVisits={};
 if(!Array.isArray(x.gearInventory))x.gearInventory=[];if(!Array.isArray(x.boutiqueStock))x.boutiqueStock=[];if(!x.boutiqueRefreshAt)x.boutiqueRefreshAt=0;
 if(!x.equipped)x.equipped={head:null,body:null,legs:null,back:null,feet:null,accessory:null};
 if(x.equipped.legs===undefined)x.equipped.legs=null;
 if(!x.battleStats)x.battleStats={battles:0,wins:0,losses:0,streak:0,bestStreak:0,moneyWon:0};
 if(x.trainer.next==null)x.trainer.next=x.trainer.xpNext||100;
 if(!x.daily)x.daily={date:new Date().toDateString(),battles:0,maxBattles:20};
 if(x.work===undefined)x.work=null;
 if(x.travel===undefined)x.travel=null;
 if(x.avatar===undefined)x.avatar=null;
 if(x.avatarChosen===undefined)x.avatarChosen=!!x.avatar;
 if(x.repelSteps===undefined)x.repelSteps=0;
 if(x.forestLootDate===undefined)x.forestLootDate='';

 if(!x.lastEnergyTick)x.lastEnergyTick=Date.now();
 [...(x.team||[]),...(x.pc||[])].forEach(m=>{
   if(!m.maxHp)m.maxHp=Math.max(30,35+(m.level||5)*2);
   if(m.hp==null)m.hp=m.maxHp;
   m.hp=Math.max(0,Math.min(m.maxHp,m.hp));
 });
 x.version='0.44.2';
 if(x.location==='Pueblo Verde')x.location='Ciudad Verde';
 if(x.travel){
   if(x.travel.from==='Pueblo Verde')x.travel.from='Ciudad Verde';
   if(x.travel.to==='Pueblo Verde')x.travel.to='Ciudad Verde';
 }
return x
}

const ENERGY_REGEN_MS=4*60*1000;
let battleRunning=false;


const OAK_JOBS=[
 {id:'short',label:'Ayuda rápida',mins:25,money:180,xp:10,prestige:0,desc:'Ordenar cajas, limpiar material y clasificar notas.'},
 {id:'six',label:'Turno de laboratorio',mins:360,money:1600,xp:90,prestige:1,desc:'Asistir con registros, muestras y observación de Pokémon.'},
 {id:'twelve',label:'Jornada de investigación',mins:720,money:3400,xp:180,prestige:2,desc:'Trabajo prolongado de campo y laboratorio.'},
 {id:'full',label:'Guardia completa',mins:1440,money:7200,xp:360,prestige:4,desc:'Una jornada completa ayudando a Oak con su investigación.'}
];

function isWorking(){
 return !!(S && S.work && S.work.endAt>Date.now());
}
function workRemainingMs(){
 if(!isWorking())return 0;
 return Math.max(0,S.work.endAt-Date.now());
}
function fmtDuration(ms){
 const sec=Math.max(0,Math.floor(ms/1000));
 const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
 if(h>0)return `${h}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
 return `${m}m ${String(s).padStart(2,'0')}s`;
}
function currentJob(){
 if(!S||!S.work)return null;
 return OAK_JOBS.find(j=>j.id===S.work.jobId)||null;
}
function checkWorkCompletion(){
 if(!S||!S.work)return false;
 if(S.work.endAt>Date.now())return false;

 const finishedWork=S.work;
 const job=OAK_JOBS.find(j=>j.id===finishedWork.jobId)||null;

 // Cerramos primero el trabajo para evitar que save()/hud()
 // vuelvan a detectar el mismo trabajo durante el cobro.
 S.work=null;

 if(job && !finishedWork.claimed){
   S.trainer.money+=job.money;
   S.trainer.prestige+=job.prestige||0;

   // Aplicar EXP sin llamar addXP(), porque addXP() guarda y actualiza el HUD.
   S.trainer.xp+=job.xp;
   while(S.trainer.xp>=S.trainer.next){
     S.trainer.xp-=S.trainer.next;
     S.trainer.level++;
     S.trainer.next=Math.floor(S.trainer.next*1.35);
     if(S.trainer.level%3===0)S.trainer.talents++;
   }

   S.history.push(`Terminaste "${job.label}" con Oak: +₽${job.money}, +${job.xp} EXP${job.prestige?`, +${job.prestige} Prestigio`:''}.`);
 }
 return true;
}
function beginOakJob(id){
 checkWorkCompletion();
 if(isWorking()){alert('Ya estás trabajando con el Profesor Oak.');return}
 const job=OAK_JOBS.find(j=>j.id===id);
 if(!job)return;
 const now=Date.now();
 S.work={jobId:job.id,startAt:now,endAt:now+job.mins*60*1000,claimed:false};
 S.history.push(`Empezaste "${job.label}" con Oak.`);
 save();hud();oak();
}
function cancelOakJob(){
 if(!isWorking())return;
 const job=currentJob();
 if(!confirm(`¿Cancelar "${job?job.label:'el trabajo'}"? No recibirás recompensa.`))return;
 S.history.push(`Cancelaste el trabajo con Oak antes de terminar.`);
 S.work=null;
 save();hud();oak();
}
function workBlocked(action='hacer eso'){
 checkWorkCompletion();
 if(!isWorking())return false;
 const job=currentJob();
 alert(`Estás trabajando con Oak (${job?job.label:'trabajo activo'}). No podés ${action} hasta terminar o cancelar el trabajo.`);
 return true;
}
function oakWorkHTML(){
 checkWorkCompletion();
 if(isWorking()){
   const job=currentJob(),remaining=workRemainingMs();
   const total=(S.work.endAt-S.work.startAt),done=Math.max(0,Math.min(100,100-(remaining/total*100)));
   return `<div class="work-active">
     <h4>🧪 Trabajo en curso: ${job.label}</h4>
     <div>${job.desc}</div>
     <div class="work-time" id="workCountdown">${fmtDuration(remaining)}</div>
     <div class="work-progress"><i id="workProgress" style="width:${done}%"></i></div>
     <div class="work-actions">
       <span class="work-badge">💰 ₽${job.money}</span>
       <span class="work-badge">⭐ ${job.xp} EXP</span>
       ${job.prestige?`<span class="work-badge">🏅 +${job.prestige} Prestigio</span>`:''}
       <button class="primary" onclick="cancelOakJob()">Cancelar trabajo</button>
     </div>
     <small>Mientras trabajás podés revisar menús, equipo, Pokédex y misiones; no podés combatir, explorar ni viajar.</small>
   </div>`;
 }
 return `<div class="work-panel">
   <b>Trabajos disponibles con Oak</b>
   <p class="muted">Elegí cuánto tiempo querés ayudar. Podés cancelar cuando quieras, pero un trabajo cancelado no paga recompensa.</p>
   <div class="work-options">
     ${OAK_JOBS.map(j=>`<button class="work-option" onclick="beginOakJob('${j.id}')">
       <b>${j.label} · ${j.mins<60?j.mins+' min':j.mins/60+' h'}</b>
       <small>${j.desc}</small>
       <small>💰 ₽${j.money} · ⭐ ${j.xp} EXP${j.prestige?` · 🏅 +${j.prestige}`:''}</small>
     </button>`).join('')}
   </div>
 </div>`;
}

function ensureDaily(){
 if(!S)return;
 const today=new Date().toDateString();
 if(!S.daily)S.daily={date:today,battles:0,maxBattles:20};
 if(S.daily.date!==today){
   S.daily={date:today,battles:0,maxBattles:S.daily.maxBattles||20};
   S.history.push('Tus combates diarios de aventura se renovaron.');
 }
}
function dailyRemaining(){
 ensureDaily();
 return Math.max(0,(S.daily.maxBattles||20)-(S.daily.battles||0));
}
function recoverEnergy(){
 if(!S)return;
 const now=Date.now();
 if(!S.lastEnergyTick)S.lastEnergyTick=now;
 if(S.trainer.energy>=S.trainer.maxEnergy){
   S.trainer.energy=S.trainer.maxEnergy;
   S.lastEnergyTick=now;
   return;
 }
 const elapsed=now-S.lastEnergyTick;
 const gained=Math.floor(elapsed/ENERGY_REGEN_MS);
 if(gained>0){
   S.trainer.energy=Math.min(S.trainer.maxEnergy,S.trainer.energy+gained);
   S.lastEnergyTick+=gained*ENERGY_REGEN_MS;
 }
}
function energyCountdown(){
 if(!S||S.trainer.energy>=S.trainer.maxEnergy)return 'FULL';
 const elapsed=Date.now()-(S.lastEnergyTick||Date.now());
 const left=Math.max(0,ENERGY_REGEN_MS-(elapsed%ENERGY_REGEN_MS));
 const s=Math.ceil(left/1000);
 return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
}

function save(){if(!S)return;S.lastSave=Date.now();localStorage.setItem(KEY,JSON.stringify(S));hud()}
function load(){try{let r=localStorage.getItem(KEY)||localStorage.getItem(OLD)||localStorage.getItem(OLDER)||localStorage.getItem(OLDEST)||localStorage.getItem('pokexperience_v006')||localStorage.getItem('pokexperience_v005')||localStorage.getItem('pokexperience_v004')||localStorage.getItem('pokexperience_v003')||localStorage.getItem('pokexperience_v002')||localStorage.getItem('pokexperience_v001');if(!r)return false;S=migrate(JSON.parse(r));ensureDaily();recoverEnergy();checkWorkCompletion();save();return true}catch(e){return false}}
function startersUI(){starterList.innerHTML=Object.keys(starters).map(n=>{const d=starters[n];return `<button class="mon" onclick="pick='${n}';startersUI()"
style="${pick==n?'outline:3px solid #b88624':''}"><img src="${spr(d.id)}"><b>${n}</b><div class="poke-type-strip strip-${primaryTypeClass(d.id)}"></div>${typeBadges(d.id)}</button>`}).join('')}

function avatarOptionsHTML(){
 return `<div class="avatar-grid">${Object.entries(AVATAR_ART).map(([id,art])=>`
 <button class="avatar-card ${S&&S.avatar===id?'selected':''}" onclick="selectAvatar('${id}')"><img src="${art}"><b>${id.startsWith('adult')?'Adulto':'Joven'} ${id.replace(/\D/g,'')}</b></button>`).join('')}</div>`;
}
function ensureAvatarChoice(){
 if(!S||S.avatarChosen)return;
 try{
  modal.innerHTML=`<div class="modalbox"><h3>Elegí tu avatar de entrenador</h3><p>La primera elección es gratuita y permanente hasta que decidas pagar por cambiarla.</p>${avatarOptionsHTML()}<p class="muted">Después de elegir, cambiar cuesta ₽40.000.</p></div>`;
  modal.classList.remove('hidden');
 }catch(e){
  console.error('Error al cargar avatares:',e);
  modal.classList.add('hidden');
 }
}
function selectAvatar(id){
 if(!S||!AVATAR_ART[id])return;
 if(!S.avatarChosen){
  S.avatar=id;S.avatarChosen=true;S.history.push('Elegiste tu avatar de entrenador.');save();closeM();trainerSheetPage();return;
 }
 if(S.avatar===id){closeM();return}
 if(S.trainer.money<40000){alert('Cambiar de avatar cuesta ₽40.000.');return}
 if(!confirm('Cambiar de avatar cuesta ₽40.000. ¿Confirmar?'))return;
 S.trainer.money-=40000;S.avatar=id;S.history.push('Cambiaste tu avatar de entrenador por ₽40.000.');save();hud();closeM();trainerSheetPage();
}
function openAvatarChange(){
 if(!S.avatarChosen){ensureAvatarChoice();return}
 modal.classList.remove('hidden');
 modal.innerHTML=`<div class="modalbox"><h3>Cambiar avatar</h3><p>Cada cambio cuesta <b>₽40.000</b>.</p>${avatarOptionsHTML()}<button class="primary" onclick="closeM()">Cerrar</button></div>`;
}

function createGame(){S=fresh((newName.value||'Entrenador').trim(),pick);save();show()}
function boot(){startersUI();load()?show():(setup.classList.remove('hidden'),game.classList.add('hidden'))}
function show(){setup.classList.add('hidden');game.classList.remove('hidden');ensureDaily();recoverEnergy();checkTravelCompletion();hud();go('overview');setTimeout(()=>ensureAvatarChoice(),120);
 if(!window.__pokeClock)window.__pokeClock=setInterval(()=>{if(S?.centerHeal?.endAt){if(Date.now()>=S.centerHeal.endAt)finishPokemonCenterHeal();else renderCenterHeal();}ensureMissionCycle();const _dr=document.getElementById('dailyReset');if(_dr)_dr.textContent=formatDuration(nextDailyReset());const _wr=document.getElementById('weeklyReset');if(_wr)_wr.textContent=formatDuration(nextWeeklyReset());const cc=document.getElementById('campCountdown');if(cc&&S?.camp?.rest)cc.textContent=formatDuration(campRestRemaining());if(S){
   ensureDaily();recoverEnergy();checkWorkCompletion();checkTravelCompletion();checkCampCompletion();hud();
   const bc=document.getElementById('boutiqueClock');if(bc){ensureBoutiqueStock();bc.textContent=boutiqueCountdown();}
   if(isWorking()){
     const cd=document.getElementById('workCountdown'),pg=document.getElementById('workProgress');
     if(cd)cd.textContent=fmtDuration(workRemainingMs());
     if(pg&&S.work){const total=S.work.endAt-S.work.startAt;pg.style.width=Math.max(0,Math.min(100,100-workRemainingMs()/total*100))+'%';}
   }
   if(isTravelling()){
     const cd=document.getElementById('travelCountdown'),pg=document.getElementById('travelProgress');
     if(cd)cd.textContent=Math.ceil(travelRemaining()/1000)+'s';
     if(pg&&S.travel){const total=S.travel.endAt-S.travel.startAt;pg.style.width=Math.max(0,Math.min(100,100-travelRemaining()/total*100))+'%';}
   }else if(document.getElementById('travelCountdown')) city();
 }},1000);
}

function renderZoneMenu(){
 const z=document.getElementById('zoneMenu');if(!z||!S)return;
 const b=(txt,act,disabled=false,active=false)=>`<button ${disabled?'disabled':''} class="${active?'zone-current':''}" ${disabled?'':`onclick="${act}"`}>${txt}</button>`;
 if(isTravelling()){z.innerHTML=b(`🚶 Viajando a ${S.travel.to}`,'travelPage()',false,true)+b(`📍 Origen: ${S.travel.from}`,'',true);return}
 const l=S.location;
 if(l==='Pueblo Paleta')z.innerHTML=b('🧑‍🔬 Profesor Oak',"go('oak')")+b('🏠 Tu casa','homePage()')+b('💬 Vecinos y consejos','palletTutorials()')+b('👤 Casa del rival','rivalHouse()')+b('🌿 Salida a Ruta 1',"travel('Ruta 1')");
 else if(l==='Ruta 1')z.innerHTML=b('🌿 Explorar Ruta 1','route1()',false,true)+b('⬇ Pueblo Paleta',"travel('Pueblo Paleta')")+b('⬆ Ciudad Verde',"travel('Ciudad Verde')");
 else if(l==='Ciudad Verde')z.innerHTML=b('❤️ Centro Pokémon','pokemonCenterPage()')+b('💻 PC','pcStorage()')+b('🔴 Tienda Pokémon',"go('shop')")+b('⬇ Ruta 1',"travel('Ruta 1')")+b('🌲 Bosque Verde',"travel('Bosque Verde')");
 else if(l==='Bosque Verde')z.innerHTML=b('🌲 Mapa del Bosque Verde','forest()',false,true)+b('⚔ Encuentros','forestExplore()')+b('💬 Guardabosques',"forestAction('ranger')")+b('⬇ Ciudad Verde',"travel('Ciudad Verde')")+b('🏛️ Ciudad Plateada 🔒','',true);
 else z.innerHTML=b(`📍 ${l}`,'city()',false,true)+b('🗺️ Mapa de Kanto',"go('map')");
}

function hud(){if(!S)return;ensureMissionCycle();syncAchievements();S.team.forEach(ensurePokemonExp);syncDerivedStats();checkTravelCompletion();renderZoneMenu();money.textContent='₽ '+S.trainer.money.toLocaleString('es-AR');level.textContent=S.trainer.level;energy.textContent=S.trainer.energy+'/'+S.trainer.maxEnergy+' · '+(S.trainer.energy>=S.trainer.maxEnergy?'FULL':'+1 '+energyCountdown());
talents.textContent=S.trainer.talents;name.textContent=S.trainer.name;rank.textContent=S.trainer.prestige>=50?'Entrenador reconocido':'Novato de Kanto';
xp.textContent=S.trainer.xp+'/'+S.trainer.next;prestige.textContent=S.trainer.prestige;location.textContent=S.location;
checkWorkCompletion();
 saveState.innerHTML='Guardado '+new Date(S.lastSave).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})+
 '<div class="energy-info"><span class="energy-chip">⚡ +1 cada 3 min</span><span class="energy-chip">⚔ '+dailyRemaining()+'/'+(S.daily.maxBattles||20)+' hoy</span>'+
 (isWorking()?'<span class="energy-chip">🧪 Trabajando · '+fmtDuration(workRemainingMs())+'</span>':'')+'</div>';
miniTeam.innerHTML=S.team.slice(0,6).map(m=>{ensurePokemonHp(m);ensurePokemonExp(m);const danger=m.hp/m.maxHp<=.3?' danger':'';return `<div class="mini-poke mini-poke-exp">${pokemonNoticeBadge(m)}<img src="${spr(m.id)}"><div class="mini-poke-copy"><b>${m.name} Nv.${m.level}</b><div class="hp-inline${danger}">PS ${m.hp}/${m.maxHp}</div>${typeBadges(m)}</div>${pokemonExpCircle(m)}</div>`}).join('');
log.innerHTML=S.history.slice().reverse().slice(0,7).map(x=>`<div>${x}</div>`).join('')}
function addXP(n){S.trainer.xp+=n;while(S.trainer.xp>=S.trainer.next){S.trainer.xp-=S.trainer.next;S.trainer.level++;S.trainer.next=Math.floor(S.trainer.next*1.35);if(S.trainer.level%3===0)S.trainer.talents++;}save()}
function go(p){if(battleRunning)return;document.querySelectorAll('.menu button').forEach(b=>b.classList.remove('active'));({overview,missions,ranking,training,boutique,shop,city,map,oak,route1,viridian,forest,pewter,patch}[p]||overview)()}


/* =========================================================
   v0.42 — MISIONES DIARIAS / SEMANALES
   ========================================================= */
const DAILY_MISSION_POOL=[
 {id:'d_win3',title:'Racha de combates',desc:'Ganá 3 combates.',goal:3,track:'wins',reward:{money:180,exp:18}},
 {id:'d_explore5',title:'Explorador diario',desc:'Explorá 5 veces.',goal:5,track:'explores',reward:{money:150,exp:15}},
 {id:'d_wild2',title:'Control de ruta',desc:'Derrotá 2 Pokémon salvajes.',goal:2,track:'wildWins',reward:{money:170,exp:16}},
 {id:'d_trainer1',title:'Desafío local',desc:'Derrotá 1 entrenador.',goal:1,track:'trainerWins',reward:{money:220,exp:20,prestige:1}},
 {id:'d_capture1',title:'Nueva captura',desc:'Capturá 1 Pokémon.',goal:1,track:'captures',reward:{money:200,exp:18,prestige:1}},
 {id:'d_potion1',title:'Primeros auxilios',desc:'Usá 1 Poción.',goal:1,track:'potions',reward:{money:120,exp:12}},
 {id:'d_visit2',title:'Moverse por Kanto',desc:'Visitá 2 zonas distintas.',goal:2,track:'zones',reward:{money:160,exp:14}},
 {id:'d_camp1',title:'Descanso de campo',desc:'Completá 1 descanso de Campamento.',goal:1,track:'camp',reward:{money:160,exp:14}},
 {id:'d_cleanwin',title:'Victoria limpia',desc:'Ganá 1 combate sin que se debilite ningún Pokémon.',goal:1,track:'cleanWins',reward:{money:230,exp:22,prestige:1}}
];
const WEEKLY_MISSION_POOL=[
 {id:'w_win15',title:'Semana competitiva',desc:'Ganá 15 combates.',goal:15,track:'wins',reward:{money:900,exp:90,prestige:3}},
 {id:'w_capture5',title:'Coleccionista',desc:'Capturá 5 Pokémon.',goal:5,track:'captures',reward:{money:850,exp:85,prestige:3}},
 {id:'w_trainer6',title:'Circuito de entrenadores',desc:'Derrotá 6 entrenadores.',goal:6,track:'trainerWins',reward:{money:1000,exp:95,prestige:4}},
 {id:'w_explore25',title:'Explorador de Kanto',desc:'Explorá 25 veces.',goal:25,track:'explores',reward:{money:800,exp:80,prestige:2}},
 {id:'w_zone5',title:'Kilómetros de ruta',desc:'Visitá 5 zonas distintas.',goal:5,track:'zones',reward:{money:750,exp:75,prestige:2}},
 {id:'w_wild8',title:'Dominio salvaje',desc:'Ganá 8 combates contra Pokémon salvajes.',goal:8,track:'wildWins',reward:{money:900,exp:85,prestige:3}},
 {id:'w_daily3',title:'Constancia',desc:'Completá 3 misiones diarias.',goal:3,track:'dailyDone',reward:{money:950,exp:90,prestige:3}},
 {id:'w_streak5',title:'Imparable',desc:'Alcanzá 5 victorias consecutivas.',goal:5,track:'streak',reward:{money:1100,exp:100,prestige:4}}
];

function localDayKey(d=new Date()){
 return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function localWeekKey(d=new Date()){
 const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());
 const mondayOffset=(x.getDay()+6)%7;
 x.setDate(x.getDate()-mondayOffset);
 return localDayKey(x);
}
function missionSeed(str){
 let h=2166136261>>>0;
 for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}
 return h>>>0;
}
function seededMissionPick(pool,key,count){
 let arr=pool.slice(),seed=missionSeed(key),out=[];
 const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 while(arr.length&&out.length<count)out.push(arr.splice(Math.floor(rnd()*arr.length),1)[0]);
 return out;
}
function makeCycleMission(m){return {...m,progress:0,claimed:false,done:false,zoneSet:[]}}
function ensureMissionCycle(){
 if(!S.missionCycle)S.missionCycle={dailyKey:'',weeklyKey:'',daily:[],weekly:[],stats:{dailyDone:0,streak:0}};
 if(!S.missionCycle.stats)S.missionCycle.stats={dailyDone:0,streak:0};
 const dk=localDayKey(),wk=localWeekKey();
 if(S.missionCycle.dailyKey!==dk){
   S.missionCycle.dailyKey=dk;
   S.missionCycle.daily=seededMissionPick(DAILY_MISSION_POOL,dk,3).map(makeCycleMission);
 }
 if(S.missionCycle.weeklyKey!==wk){
   S.missionCycle.weeklyKey=wk;
   S.missionCycle.weekly=seededMissionPick(WEEKLY_MISSION_POOL,wk,3).map(makeCycleMission);
   S.missionCycle.stats.dailyDone=0;
 }
}
function nextDailyReset(){
 const n=new Date();n.setHours(24,0,0,0);return n-Date.now();
}
function nextWeeklyReset(){
 const n=new Date();
 const days=(8-n.getDay())%7 || 7;
 n.setDate(n.getDate()+days);n.setHours(0,0,0,0);return n-Date.now();
}
function missionRewardText(r){
 const x=[];if(r.money)x.push(`₽${r.money}`);if(r.exp)x.push(`${r.exp} EXP`);if(r.prestige)x.push(`+${r.prestige} Prestigio`);
 return x.join(' · ');
}
function cycleMissionPct(m){return Math.max(0,Math.min(100,m.goal?m.progress/m.goal*100:0))}
function registerMissionEvent(track,amount=1,zoneName=null){
 if(!S)return;ensureMissionCycle();
 for(const list of [S.missionCycle.daily,S.missionCycle.weekly]){
  for(const m of list){
   if(m.claimed||m.done)continue;
   if(m.track==='zones'&&track==='zones'){
    m.zoneSet=m.zoneSet||[];
    if(zoneName&&!m.zoneSet.includes(zoneName))m.zoneSet.push(zoneName);
    m.progress=m.zoneSet.length;
   }else if(m.track===track){
    if(track==='streak')m.progress=Math.max(m.progress,S.missionCycle.stats.streak||0);
    else if(track==='dailyDone')m.progress=Math.max(m.progress,S.missionCycle.stats.dailyDone||0);
    else m.progress+=amount;
   }
   if(m.progress>=m.goal){m.progress=m.goal;m.done=true}
  }
 }
}
function claimCycleMission(kind,index){
 ensureMissionCycle();
 const list=kind==='weekly'?S.missionCycle.weekly:S.missionCycle.daily;
 const m=list[index];if(!m||!m.done||m.claimed)return;
 m.claimed=true;
 if(m.reward.money)S.trainer.money+=m.reward.money;
 if(m.reward.prestige)S.trainer.prestige+=m.reward.prestige;
 if(m.reward.exp)addXP(m.reward.exp);
 if(kind==='daily'){
  S.missionCycle.stats.dailyDone=(S.missionCycle.stats.dailyDone||0)+1;
  registerMissionEvent('dailyDone',0);
 }
 S.history.push(`Cobraste "${m.title}": ${missionRewardText(m.reward)}.`);
 save();hud();missions();
}
function cycleMissionCard(m,kind,i){
 return `<div class="cycle-mission ${m.done?'done':''} ${m.claimed?'claimed':''}">
  <div class="cycle-mission-copy"><b>${m.title}</b><span>${m.desc}</span>
   <div class="mission-progress-line"><div><i style="width:${cycleMissionPct(m)}%"></i></div><strong>${m.progress}/${m.goal}</strong></div>
   <small>Recompensa: ${missionRewardText(m.reward)}</small>
  </div>
  <button class="primary ${m.done&&!m.claimed?'green':''}" onclick="claimCycleMission('${kind}',${i})" ${!m.done||m.claimed?'disabled':''}>${m.claimed?'COBRADA':m.done?'COBRAR':'EN PROGRESO'}</button>
 </div>`;
}
function cycleMissionsHTML(){
 ensureMissionCycle();
 return `<div class="card cycle-missions">
  <div class="cycle-reset-row">
   <span>🌞 Diarias · <b id="dailyReset">${formatDuration(nextDailyReset())}</b></span>
   <span>📅 Semanales · <b id="weeklyReset">${formatDuration(nextWeeklyReset())}</b></span>
  </div>
  <div class="cycle-tabs"><button class="tab active" onclick="showCycleTab('daily',this)">Diarias</button><button class="tab" onclick="showCycleTab('weekly',this)">Semanales</button></div>
  <div id="cycleDaily">${S.missionCycle.daily.map((m,i)=>cycleMissionCard(m,'daily',i)).join('')}</div>
  <div id="cycleWeekly" style="display:none">${S.missionCycle.weekly.map((m,i)=>cycleMissionCard(m,'weekly',i)).join('')}</div>
 </div>`;
}
function showCycleTab(which,btn){
 const d=document.getElementById('cycleDaily'),w=document.getElementById('cycleWeekly');
 if(d)d.style.display=which==='daily'?'block':'none';
 if(w)w.style.display=which==='weekly'?'block':'none';
 btn.parentElement.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');
}

/* =========================================================
   v0.42 — ESTADOS ALTERADOS
   ========================================================= */
const STATUS_META={
 poison:{label:'ENVENENADO',color:'#8e4fb2'},
 burn:{label:'QUEMADO',color:'#d65a31'},
 paralyze:{label:'PARALIZADO',color:'#d6ad22'},
 sleep:{label:'DORMIDO',color:'#4f83d6'},
 freeze:{label:'CONGELADO',color:'#69c5df'}
};
function statusBadge(mon){
 if(!mon||!mon.status||!STATUS_META[mon.status])return '';
 const s=STATUS_META[mon.status];
 return `<span class="status-pill" style="background:${s.color}">${s.label}</span>`;
}
function applyStatus(mon,status,chance=1){
 if(!mon||mon.hp<=0||mon.status||Math.random()>chance)return false;
 const t=typesFor(mon);
 if(status==='poison'&&t.includes('Veneno'))return false;
 mon.status=status;return true;
}
function statusCanMove(mon){
 if(!mon||!mon.status)return {ok:true,msg:''};
 if(mon.status==='paralyze'&&Math.random()<.25)return {ok:false,msg:`${mon.name} está paralizado y no puede moverse.`};
 if(mon.status==='sleep'&&Math.random()<.65)return {ok:false,msg:`${mon.name} está dormido.`};
 if(mon.status==='freeze'&&Math.random()<.65)return {ok:false,msg:`${mon.name} está congelado y no puede moverse.`};
 return {ok:true,msg:''};
}

/* Desgaste por combate prolongado: sólo existe dentro de esta batalla.
   No se guarda como estadística de Fatiga del Pokémon. */
function applyRoundFatigue(mon,chron){
 if(!currentBattle||currentBattle.round<4||!mon||mon.hp<=0)return;
 const pct=currentBattle.round>=5?.05:.035;
 const dmg=Math.max(1,Math.round(mon.maxHp*pct));
 mon.hp=Math.max(0,mon.hp-dmg);
 if(chron){
  const d=document.createElement('div');d.className='line fatigue-note';
  d.textContent=`El desgaste del combate prolongado le resta ${dmg} PS a ${mon.name}.`;
  chron.appendChild(d);chron.scrollTop=chron.scrollHeight;
 }
}

function applyResidualStatus(mon,chron){
 if(!mon||mon.hp<=0)return;
 let dmg=0,label='';
 if(mon.status==='poison'){dmg=Math.max(1,Math.round(mon.maxHp*.08));label='veneno'}
 if(mon.status==='burn'){dmg=Math.max(1,Math.round(mon.maxHp*.06));label='quemadura'}
 if(!dmg)return;
 mon.hp=Math.max(0,mon.hp-dmg);
 if(chron){const d=document.createElement('div');d.className='line status-note';d.textContent=`${mon.name} pierde ${dmg} PS por ${label}.`;chron.appendChild(d);chron.scrollTop=chron.scrollHeight}
}


/* =========================================================
   v0.43 — CRECIMIENTO POKÉMON
   ========================================================= */
const LEVEL_MOVES={
 Bulbasaur:{7:'Drenadoras',9:'Hoja Afilada',13:'Somnífero'},
 Charmander:{7:'Ascuas',10:'Pantalla de Humo',13:'Garra Metal'},
 Squirtle:{7:'Burbuja',10:'Mordisco',13:'Pistola Agua'},
 Pidgey:{5:'Ataque Arena',9:'Tornado',13:'Ataque Rápido'},
 Rattata:{7:'Ataque Rápido',10:'Foco Energía',13:'Hipercolmillo'},
 Caterpie:{7:'Disparo Demora'},
 Weedle:{7:'Picotazo Venenoso'},
 Pikachu:{7:'Impactrueno',10:'Onda Trueno',13:'Ataque Rápido'}
};
const EVOLUTION_LEVELS={
 Bulbasaur:{level:16,to:'Ivysaur'},Ivysaur:{level:32,to:'Venusaur'},
 Charmander:{level:16,to:'Charmeleon'},Charmeleon:{level:36,to:'Charizard'},
 Squirtle:{level:16,to:'Wartortle'},Wartortle:{level:36,to:'Blastoise'},
 Caterpie:{level:7,to:'Metapod'},Metapod:{level:10,to:'Butterfree'},
 Weedle:{level:7,to:'Kakuna'},Kakuna:{level:10,to:'Beedrill'},
 Pidgey:{level:18,to:'Pidgeotto'},Pidgeotto:{level:36,to:'Pidgeot'},
 Rattata:{level:20,to:'Raticate'}
};
function pokemonBattleExpReward(enemy,isTrainer=false){
 const lv=Math.max(1,Number(enemy?.level)||1);
 return Math.max(8,Math.round(8+lv*4+(isTrainer?lv*2+8:0)));
}
function ensureMoveList(mon){
 if(!mon.moves||!Array.isArray(mon.moves)||!mon.moves.length)mon.moves=(MOVE_POOLS[mon.name]||['Placaje']).slice(0,4);
}
function levelUpPokemon(mon,chron=null){
 ensurePokemonExp(mon);ensurePokemonHp(mon);ensureMoveList(mon);
 let levels=0;
 while(mon.exp>=mon.expToNext && levels<20){
   mon.exp-=mon.expToNext;
   mon.level++;
   levels++;markPokemonLevelNotice(mon);
   const oldMax=mon.maxHp;
   mon.maxHp=Math.max(oldMax+2,Math.round(oldMax*1.07)+1);
   mon.hp=Math.min(mon.maxHp,mon.hp+(mon.maxHp-oldMax)+2);
   mon.expToNext=pokemonExpNeeded(mon.level);
   if(chron){
     const d=document.createElement('div');d.className='line level-up-note';
     d.textContent=`¡${mon.name} alcanzó Nv. ${mon.level}!`;
     chron.appendChild(d);
   }
   checkLevelMove(mon,chron);
   checkEvolution(mon,chron);
 }
 return levels;
}
function givePokemonExp(mon,amount,chron=null){
 ensurePokemonExp(mon);
 mon.exp+=Math.max(0,Math.round(amount));
 if(chron){
   const d=document.createElement('div');d.className='line exp-note';
   d.textContent=`${mon.name} ganó ${Math.round(amount)} EXP.`;
   chron.appendChild(d);chron.scrollTop=chron.scrollHeight;
 }
 levelUpPokemon(mon,chron);
}
function checkLevelMove(mon,chron=null){
 const move=LEVEL_MOVES[mon.name]?.[mon.level];
 if(!move)return;
 ensureMoveList(mon);
 if(mon.moves.includes(move))return;
 if(mon.moves.length<4){
   mon.moves.push(move);
   if(chron){const d=document.createElement('div');d.className='line move-note';d.textContent=`¡${mon.name} aprendió ${move}!`;chron.appendChild(d)}
 }else{
   mon.pendingMove=move;
   if(chron){const d=document.createElement('div');d.className='line move-note';d.textContent=`${mon.name} puede aprender ${move}. Revisá su ficha para elegir qué movimiento olvidar.`;chron.appendChild(d)}
 }
}
function pendingMoveUI(mon,index){
 if(!mon.pendingMove)return '';
 return `<div class="pending-move"><b>✨ Puede aprender ${mon.pendingMove}</b><small>Elegí un movimiento para reemplazar.</small>
 ${mon.moves.map((mv,i)=>`<button class="smallbtn" onclick="replacePokemonMove(${index},${i})">${mv}</button>`).join('')}
 <button class="smallbtn ghost" onclick="declinePokemonMove(${index})">No aprender</button></div>`;
}
function replacePokemonMove(teamIndex,moveIndex){
 const mon=S.team[teamIndex];if(!mon||!mon.pendingMove)return;
 ensureMoveList(mon);const old=mon.moves[moveIndex];mon.moves[moveIndex]=mon.pendingMove;
 S.history.push(`${mon.name} olvidó ${old} y aprendió ${mon.pendingMove}.`);
 mon.pendingMove=null;clearPokemonNotice(teamIndex);save();pokemonTeamPage();
}
function declinePokemonMove(teamIndex){
 const mon=S.team[teamIndex];if(!mon)return;
 S.history.push(`${mon.name} decidió no aprender ${mon.pendingMove}.`);
 mon.pendingMove=null;clearPokemonNotice(teamIndex);save();pokemonTeamPage();
}
function checkEvolution(mon,chron=null){
 const ev=EVOLUTION_LEVELS[mon.name];
 if(!ev||mon.level<ev.level||mon.pendingEvolution)return;
 if(mon.evolutionDeclinedAt===mon.level)return;
 mon.pendingEvolution={to:ev.to,from:mon.name,atLevel:mon.level};
 if(chron){const d=document.createElement('div');d.className='line evolution-note';d.textContent=`✨ ¡${mon.name} puede evolucionar a ${ev.to}! Revisá su ficha.`;chron.appendChild(d)}
}
function evolutionUI(mon,index){
 if(!mon.pendingEvolution)return '';
 return `<div class="pending-evolution"><b>✨ ¡${mon.pendingEvolution.from} está listo para evolucionar!</b>
 <span>${mon.pendingEvolution.from} → ${mon.pendingEvolution.to}</span>
 <button class="primary green" onclick="evolvePokemon(${index})">Evolucionar</button>
 <button class="smallbtn ghost" onclick="stopEvolution(${index})">Detener evolución</button></div>`;
}
function evolvePokemon(index){
 const mon=S.team[index];if(!mon?.pendingEvolution)return;
 const old=mon.name,to=mon.pendingEvolution.to;
 mon.name=to;
 const sid=Object.keys(species).find(k=>species[k]?.name===to);
 if(sid)mon.id=sid;
 mon.maxHp=Math.round(mon.maxHp*1.12)+2;mon.hp=mon.maxHp;
 mon.pendingEvolution=null;mon.evolutionDeclinedAt=null;mon.justLeveled=false;
 ensureMoveList(mon);
 S.history.push(`¡${old} evolucionó a ${to}!`);
 save();hud();pokemonTeamPage();
}
function stopEvolution(index){
 const mon=S.team[index];if(!mon?.pendingEvolution)return;
 mon.evolutionDeclinedAt=mon.level;mon.pendingEvolution=null;mon.justLeveled=false;
 S.history.push(`${mon.name} detuvo su evolución. Volverá a intentarlo más adelante.`);
 save();pokemonTeamPage();
}
function battleParticipants(b){
 if(!b)return [];
 if(!Array.isArray(b.participants))b.participants=[b.activeIndex??0];
 return [...new Set(b.participants)].filter(i=>S.team[i]);
}
function awardBattlePokemonExp(b,enemy,chron){
 const ids=battleParticipants(b);if(!ids.length)return;
 const total=pokemonBattleExpReward(enemy,!!b.trainer);
 const each=Math.max(1,Math.round(total/ids.length));
 ids.forEach(i=>givePokemonExp(S.team[i],each,chron));
}


/* =========================================================
   v0.44 — ALERTAS DE PROGRESO, LOGROS, HALLAZGOS Y CENTROS
   ========================================================= */
const ACHIEVEMENTS=[
 {id:'first_win',name:'Primer paso',desc:'Ganá tu primer combate.',track:'wins',goal:1,title:'Entrenador Novato'},
 {id:'wins10',name:'Ritmo de batalla',desc:'Ganá 10 combates.',track:'wins',goal:10,title:'Combatiente de Ruta'},
 {id:'capture5',name:'Coleccionista',desc:'Capturá 5 Pokémon.',track:'captures',goal:5,title:'Capturador'},
 {id:'explore20',name:'De punta a punta',desc:'Explorá 20 veces.',track:'explores',goal:20,title:'Explorador de Kanto'},
 {id:'trainer5',name:'Cara a cara',desc:'Derrotá 5 entrenadores.',track:'trainerWins',goal:5,title:'Desafiante'},
 {id:'camp3',name:'Vida de campamento',desc:'Completá 3 descansos en Campamento.',track:'camp',goal:3,title:'Campista'},
 {id:'daily5',name:'Constancia diaria',desc:'Cobr á 5 misiones diarias.',track:'dailyDone',goal:5,title:'Constante'}
];
function achievementMetric(a){
 if(!S)return 0;
 const s=S.achievementState||{unlocked:[],npcVisits:{}};
 const map={
  wins:S.progress?.wins||0,
  captures:S.caught?.length||0,
  explores:S.battleStats?.explores||0,
  trainerWins:S.battleStats?.trainerWins||0,
  camp:S.battleStats?.campRests||0,
  dailyDone:S.missionCycle?.stats?.dailyDone||0
 };
 return map[a.track]||0;
}
function syncAchievements(){
 if(!S.achievementState)S.achievementState={unlocked:[],npcVisits:{}};
 for(const a of ACHIEVEMENTS){
  if(!S.achievementState.unlocked.includes(a.id)&&achievementMetric(a)>=a.goal){
   S.achievementState.unlocked.push(a.id);
   S.history.push(`🏆 Logro desbloqueado: ${a.name}. Título disponible: ${a.title}.`);
  }
 }
}
function achievementById(id){return ACHIEVEMENTS.find(a=>a.id===id)}
function currentPlayerTitle(){
 const a=achievementById(S.playerIdentity?.titleId);
 return a?.title||'';
}
function playerDisplayName(){
 const nick=(S.playerIdentity?.nick||'').trim();
 return nick||S.trainer.name;
}
function setPlayerNick(){
 const old=S.playerIdentity?.nick||'';
 const v=prompt('Elegí tu nick de jugador:',old||S.trainer.name);
 if(v===null)return;
 const clean=v.trim().slice(0,18);
 if(!clean){alert('El nick no puede quedar vacío.');return}
 S.playerIdentity.nick=clean;save();hud();achievementsPage();
}
function equipPlayerTitle(id){
 if(!S.achievementState.unlocked.includes(id))return;
 S.playerIdentity.titleId=id;save();hud();achievementsPage();
}
function clearPlayerTitle(){S.playerIdentity.titleId='';save();hud();achievementsPage()}
function achievementsPage(){
 syncAchievements();
 const active=profileTabs('achievements');
 content.innerHTML=`${active}<div class="card">
  <div class="identity-panel">
   <div><h3>Identidad de jugador</h3><b>${playerDisplayName()}</b>${currentPlayerTitle()?`<span>${currentPlayerTitle()}</span>`:'<span>Sin título equipado</span>'}</div>
   <div><button class="primary" onclick="setPlayerNick()">Cambiar nick</button>${currentPlayerTitle()?'<button class="buy" onclick="clearPlayerTitle()">Quitar título</button>':''}</div>
  </div>
 </div>
 <div class="card"><h3>Logros</h3>
  <div class="achievement-grid">${ACHIEVEMENTS.map(a=>{
   const value=Math.min(a.goal,achievementMetric(a)),unlocked=S.achievementState.unlocked.includes(a.id),equipped=S.playerIdentity.titleId===a.id;
   return `<div class="achievement-card ${unlocked?'unlocked':''}">
    <div class="achievement-sprite-placeholder">🏆</div>
    <div><b>${a.name}</b><p>${a.desc}</p><div class="ach-progress"><i style="width:${Math.min(100,value/a.goal*100)}%"></i></div><small>${value}/${a.goal}</small>
    <span>Título: ${a.title}</span></div>
    <button class="buy" ${!unlocked?'disabled':''} onclick="equipPlayerTitle('${a.id}')">${equipped?'EQUIPADO':unlocked?'Usar título':'BLOQUEADO'}</button>
   </div>`;
  }).join('')}</div>
 </div>`;
}
function pokemonNeedsAttention(mon){
 return !!(mon?.pendingMove||mon?.pendingEvolution||mon?.justLeveled);
}
function pokemonNoticeBadge(mon){
 return pokemonNeedsAttention(mon)?`<span class="poke-notice" title="Este Pokémon tiene una novedad pendiente">!</span>`:'';
}
function markPokemonLevelNotice(mon){
 mon.justLeveled=true;
}
function clearPokemonNotice(index){
 const mon=S.team[index];if(!mon)return;
 if(!mon.pendingMove&&!mon.pendingEvolution)mon.justLeveled=false;
}
function randomExploreFind(zone){
 if(Math.random()>.18)return null;
 const roll=Math.random();
 if(roll<.28){
  const money=40+Math.floor(Math.random()*81);
  S.trainer.money+=money;
  return `Encontraste ₽${money} perdidos cerca del camino.`;
 }
 if(roll<.56){
  S.bag.pokeball=(S.bag.pokeball||0)+1;
  return 'Encontraste una Poké Ball.';
 }
 if(roll<.82){
  S.bag.potion=(S.bag.potion||0)+1;
  return 'Encontraste una Poción.';
 }
 S.bag.repel=(S.bag.repel||0)+1;
 return 'Encontraste un Repelente.';
}
function maybeExploreFind(zone){
 const msg=randomExploreFind(zone);
 if(!msg)return;
 S.history.push(`🎁 ${zone}: ${msg}`);
 save();hud();
 setTimeout(()=>alert(msg),50);
}
const CENTER_HEAL_MS=4500;
function pokemonCenterPage(){
 content.innerHTML=`<div class="card center-page">
  <h3>❤️ Centro Pokémon</h3>
  <p>Podés curar completamente al equipo, eliminar estados alterados y acceder a la PC.</p>
  <div class="center-actions">
   <button class="primary" onclick="startPokemonCenterHeal()">Curar equipo</button>
   <button class="primary" onclick="pcStorage()">💻 Usar PC</button>
  </div>
  <div id="centerHealArea"></div>
 </div>`;
}
function startPokemonCenterHeal(){
 if(S.centerHeal?.endAt>Date.now())return;
 S.centerHeal={startAt:Date.now(),endAt:Date.now()+CENTER_HEAL_MS};
 save();renderCenterHeal();
}
function renderCenterHeal(){
 const box=document.getElementById('centerHealArea');if(!box||!S.centerHeal)return;
 const remain=Math.max(0,S.centerHeal.endAt-Date.now());
 if(remain<=0){finishPokemonCenterHeal();return}
 const pct=Math.max(0,Math.min(100,100-remain/CENTER_HEAL_MS*100));
 box.innerHTML=`<div class="center-healing"><b>Curando equipo...</b><span>${Math.ceil(remain/1000)}s</span><div><i style="width:${pct}%"></i></div><small>La máquina restaura PS y elimina todos los estados alterados.</small></div>`;
}
function finishPokemonCenterHeal(){
 if(!S.centerHeal)return;
 S.team.forEach(m=>{ensurePokemonHp(m);m.hp=m.maxHp;m.status=null;});
 S.centerHeal=null;S.history.push('Tu equipo fue atendido en el Centro Pokémon.');
 save();hud();
 const box=document.getElementById('centerHealArea');
 if(box)box.innerHTML='<div class="center-done">✨ Tu equipo quedó completamente recuperado.</div>';
}
function npcVariant(npcKey,lines){
 if(!S.achievementState)S.achievementState={unlocked:[],npcVisits:{}};
 const visits=S.achievementState.npcVisits[npcKey]||0;
 S.achievementState.npcVisits[npcKey]=visits+1;
 const hour=new Date().getHours();
 let pool=lines.slice();
 if(hour<7)pool.push('«Es bastante temprano para andar recorriendo Kanto, ¿no?»');
 else if(hour>=20)pool.push('«Se está haciendo tarde. No te alejes demasiado sin Pociones.»');
 if((S.progress?.wins||0)>=5)pool.push('«Se nota que ya no sos el mismo entrenador que salió de Paleta.»');
 save();
 return pool[visits%pool.length]||choice(pool);
}

function overview(){trainerSheetPage()}


const MOVE_CATEGORY={
 'Placaje':'Físico','Arañazo':'Físico','Ascuas':'Especial','Látigo Cepa':'Físico','Pistola Agua':'Especial',
 'Tornado':'Especial','Picotazo Venenoso':'Físico','Impactrueno':'Especial','Ataque Rápido':'Físico','Mordisco':'Físico',
 'Gruñido':'Estado','Látigo':'Estado','Ataque Arena':'Estado','Disparo Demora':'Estado','Fortaleza':'Estado','Polvo Veneno':'Estado'
};
function pokemonMovesForUI(m){
 return (MOVE_POOLS[m.name]||['Placaje']).slice(0,4);
}
function pokemonMovesTooltip(m){
 const moves=pokemonMovesForUI(m);
 return `<div class="poke-tooltip"><b>${m.name} Nv.${m.level}</b><span>PS ${m.hp}/${m.maxHp}</span><strong>Movimientos</strong>${moves.map(name=>`<em>${name} <small>(${MOVE_CATEGORY[name]||((MOVE_DATA[name]&&MOVE_DATA[name].damage)?'Físico':'Estado')})</small></em>`).join('')}</div>`;
}

function usePotionFromTeam(){
 if((S.bag.potion||0)<=0){alert('No te quedan Pociones.');return}
 const injured=S.team.map((m,i)=>{ensurePokemonHp(m);return {m,i}}).filter(x=>x.m.hp>0&&x.m.hp<x.m.maxHp);
 if(!injured.length){alert('No tenés ningún Pokémon herido que pueda usar una Poción.');return}
 if(injured.length===1){applyPotionToPokemon(injured[0].i);return}
 potionTargetModal(injured);
}
function applyPotionToPokemon(index){
 const m=S.team[index];if(!m)return;ensurePokemonHp(m);
 if((S.bag.potion||0)<=0){alert('No te quedan Pociones.');return}
 if(m.hp<=0){alert(`${m.name} está debilitado. Una Poción común no puede reanimarlo.`);return}
 if(m.hp>=m.maxHp){alert(`${m.name} ya tiene todos sus PS.`);return}
 const amount=Math.max(12,Math.round(m.maxHp*.42)),before=m.hp;
 m.hp=Math.min(m.maxHp,m.hp+amount);
 S.bag.potion--;registerMissionEvent('potions',1);
 S.history.push(`Usaste una Poción sobre ${m.name}: +${m.hp-before} PS.`);
 closeModal();
 save();hud();pokemonTeamPage();
}
function potionTargetModal(injured){
 openModal(`<h3>¿A qué Pokémon querés curar?</h3>
 <p>Elegí uno de tus Pokémon heridos. La Poción se consumirá al confirmar.</p>
 <div class="potion-target-list">
 ${injured.map(({m,i})=>`<button class="potion-target" onclick="applyPotionToPokemon(${i})">
   <img src="${spr(m.id)}">
   <span><b>${m.name} Nv.${m.level}</b><small>PS ${m.hp}/${m.maxHp}</small>${pokemonExpCircle(m)}</span>
 </button>`).join('')}
 </div>
 <div class="modal-actions"><button class="buy" onclick="closeModal()">Cancelar</button></div>`);
}


const CAMP_ITEMS=[
 {id:'tent_basic',name:'Carpa liviana',icon:'⛺',price:1800,desc:'Protege del clima y reduce el tiempo de descanso.',effect:'-10% tiempo',timePct:10},
 {id:'sleepbag',name:'Saco de dormir térmico',icon:'🛏️',price:2400,desc:'Mejora la recuperación de energía.',effect:'+15% recuperación',energyPct:15},
 {id:'camp_repel',name:'Repelente de perímetro',icon:'🧴',price:3200,desc:'Reduce mucho la posibilidad de incidentes con Pokémon salvajes.',effect:'-45% riesgo',riskPct:45},
 {id:'campfire',name:'Fogón portátil',icon:'🔥',price:4200,desc:'Permite descansar mejor durante paradas cortas.',effect:'+8 energía extra',flatEnergy:8},
 {id:'lantern',name:'Linterna de explorador',icon:'🔦',price:2800,desc:'Mejora la seguridad al descansar de noche.',effect:'-20% riesgo',riskPct:20},
 {id:'campkit',name:'Kit de campamento avanzado',icon:'🎒',price:7600,desc:'Equipo completo para montar y desmontar más rápido.',effect:'-18% tiempo',timePct:18}
];
const CAMP_RESTS=[
 {id:'quick',name:'Descanso breve',mins:15,energy:12,risk:0.06},
 {id:'short',name:'Parada de campamento',mins:60,energy:30,risk:0.10},
 {id:'medium',name:'Descanso profundo',mins:180,energy:60,risk:0.16},
 {id:'long',name:'Noche de campamento',mins:360,energy:100,risk:0.22}
];
function campItem(id){return CAMP_ITEMS.find(x=>x.id===id)}
function campOwned(id){return S.camp&&S.camp.owned&&S.camp.owned.includes(id)}
function campTimeReduction(){
 return CAMP_ITEMS.filter(x=>campOwned(x.id)).reduce((a,x)=>a+(x.timePct||0),0)
}
function campEnergyBonusPct(){
 return CAMP_ITEMS.filter(x=>campOwned(x.id)).reduce((a,x)=>a+(x.energyPct||0),0)
}
function campFlatEnergy(){
 return CAMP_ITEMS.filter(x=>campOwned(x.id)).reduce((a,x)=>a+(x.flatEnergy||0),0)
}
function campRiskReduction(){
 return Math.min(80,CAMP_ITEMS.filter(x=>campOwned(x.id)).reduce((a,x)=>a+(x.riskPct||0),0))
}
function campRestRemaining(){
 if(!S.camp?.rest)return 0;
 return Math.max(0,S.camp.rest.endAt-Date.now());
}
function formatDuration(ms){
 let sec=Math.max(0,Math.ceil(ms/1000));
 let h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
 if(h>0)return `${h}h ${String(m).padStart(2,'0')}m`;
 if(m>0)return `${m}m ${String(s).padStart(2,'0')}s`;
 return `${s}s`;
}
function startCampRest(id){
 if(S.camp?.rest){alert('Ya estás descansando en el campamento.');return}
 if(typeof isWorking==='function'&&isWorking()){alert('No podés acampar mientras estás trabajando.');return}
 if(typeof isTravelling==='function'&&isTravelling()){alert('No podés montar el campamento mientras estás viajando.');return}
 const r=CAMP_RESTS.find(x=>x.id===id);if(!r)return;
 const reduction=Math.min(45,campTimeReduction());
 const realMins=Math.max(5,Math.round(r.mins*(1-reduction/100)));
 S.camp.rest={id:r.id,name:r.name,startAt:Date.now(),endAt:Date.now()+realMins*60*1000,baseMins:r.mins,realMins,energy:r.energy,risk:r.risk};
 S.history.push(`Montaste el campamento: ${r.name} (${realMins} min).`);
 save();hud();campPage();
}
function cancelCampRest(){
 if(!S.camp?.rest)return;
 S.history.push(`Cancelaste el descanso de campamento.`);
 S.camp.rest=null;save();hud();campPage();
}
function checkCampCompletion(){
 if(!S?.camp?.rest)return;
 if(Date.now()<S.camp.rest.endAt)return;
 const rest=S.camp.rest;
 const bonus=Math.round(rest.energy*campEnergyBonusPct()/100)+campFlatEnergy();
 const gain=Math.max(1,rest.energy+bonus);
 const risk=Math.max(0,rest.risk*(1-campRiskReduction()/100));
 const incident=Math.random()<risk;
 S.camp.rest=null;
 registerMissionEvent('camp',1);S.battleStats.campRests=(S.battleStats.campRests||0)+1;
 syncDerivedStats();
 S.trainer.energy=Math.min(S.trainer.maxEnergy,S.trainer.energy+gain);
 if(incident){
   const alive=S.team.filter(p=>{ensurePokemonHp(p);return p.hp>0});
   if(alive.length){
     const victim=choice(alive),dmg=Math.max(2,Math.round(victim.maxHp*(.08+Math.random()*.10)));
     victim.hp=Math.max(1,victim.hp-dmg);
     S.history.push(`Un Pokémon salvaje se acercó al campamento. ${victim.name} perdió ${dmg} PS protegiendo el lugar.`);
   }else{
     S.history.push(`Un Pokémon salvaje rondó el campamento, pero no pudo causar daños importantes.`);
   }
 }else{
   S.history.push(`Terminaste de descansar en el campamento: +${gain} energía.`);
 }
 save();hud();
 if(document.getElementById('campPageRoot'))campPage();
}
function buyCampItem(id){
 const it=campItem(id);if(!it||campOwned(id))return;
 if(S.trainer.money<it.price){alert('No tenés suficiente dinero.');return}
 S.trainer.money-=it.price;S.camp.owned.push(id);
 S.history.push(`Compraste ${it.name} para el campamento.`);
 save();hud();campPage();
}
function campPage(){
 checkCampCompletion();
 const resting=!!S.camp.rest;
 const timeRed=Math.min(45,campTimeReduction()),riskRed=campRiskReduction(),energyBonus=campEnergyBonusPct();
 content.innerHTML=`<div id="campPageRoot" class="card camp-page">
  <div class="camp-hero">
   <div><h3>⛺ Campamento</h3>
   <p>Tu base improvisada para descansar, organizarte y recuperar energía durante el viaje.</p></div>
   <div class="camp-summary">
    <span>⏱️ -${timeRed}% tiempo</span>
    <span>🛡️ -${riskRed}% riesgo</span>
    <span>⚡ +${energyBonus}% recuperación</span>
   </div>
  </div>
  ${resting?`
   <div class="camp-active">
    <h4>${S.camp.rest.name}</h4>
    <p>Tu entrenador está descansando. Mientras acampás podés revisar menús, equipo y estadísticas, pero no viajar ni combatir.</p>
    <b id="campCountdown">${formatDuration(campRestRemaining())}</b>
    <button class="buy" onclick="cancelCampRest()">Cancelar descanso</button>
   </div>`:`
   <h4>Descansar</h4>
   <div class="camp-rest-grid">
   ${CAMP_RESTS.map(r=>{
      const real=Math.max(5,Math.round(r.mins*(1-timeRed/100)));
      const bonus=Math.round(r.energy*energyBonus/100)+campFlatEnergy();
      const finalRisk=Math.round(r.risk*(1-riskRed/100)*100);
      return `<div class="camp-rest-card">
       <b>${r.name}</b>
       <span>${real<60?real+' min':(real/60).toFixed(real%60?1:0)+' h'}</span>
       <small>⚡ +${r.energy+bonus} energía · ⚠️ ${finalRisk}% riesgo</small>
       <button class="buy" onclick="startCampRest('${r.id}')">Acampar</button>
      </div>`
   }).join('')}
   </div>`}
  <h4>Mejoras del campamento</h4>
  <div class="camp-shop-grid">
   ${CAMP_ITEMS.map(it=>`<div class="camp-item">
     <div class="camp-icon">${it.icon}</div>
     <div><b>${it.name}</b><p>${it.desc}</p><small>${it.effect}</small></div>
     <button class="buy" onclick="buyCampItem('${it.id}')" ${campOwned(it.id)?'disabled':''}>${campOwned(it.id)?'Comprado':'₽'+it.price.toLocaleString('es-AR')}</button>
    </div>`).join('')}
  </div>
 </div>`;
}


/* v0.40 — Experiencia individual Pokémon */
function pokemonExpNeeded(level){
 level=Math.max(1,Number(level)||1);
 return Math.max(20,Math.round(28 + level*18 + level*level*4));
}
function ensurePokemonExp(p){
 if(!p)return;
 if(typeof p.exp!=='number'||!isFinite(p.exp)){
   p.exp=Math.max(0,Math.round((p.level-1)*pokemonExpNeeded(Math.max(1,p.level-1))*.18));
 }
 if(typeof p.expToNext!=='number'||!isFinite(p.expToNext)||p.expToNext<=0){
   p.expToNext=pokemonExpNeeded(p.level);
 }
 p.exp=Math.max(0,p.exp);
}
function pokemonExpPct(p){
 ensurePokemonExp(p);
 return Math.max(0,Math.min(100,(p.exp/p.expToNext)*100));
}
function pokemonExpBar(p,compact=false){
 ensurePokemonExp(p);
 const pct=pokemonExpPct(p);
 return `<div class="poke-exp-wrap ${compact?'compact':''}">
   <div class="poke-exp-label"><span>EXP</span><b>${p.exp}/${p.expToNext}</b></div>
   <div class="poke-exp-bar"><i style="width:${pct}%"></i></div>
 </div>`;
}
function pokemonExpCircle(p){
 ensurePokemonExp(p);
 const pct=pokemonExpPct(p);
 return `<div class="poke-exp-circle" style="--exp:${pct}" title="EXP ${p.exp}/${p.expToNext}">
   <span>${Math.round(pct)}%</span>
 </div>`;
}

function profileTabs(active){
 return `<div class="profile-tabs">
  <button class="profile-tab ${active==='trainer'?'active':''}" onclick="trainerSheetPage()">🧑 Hoja del entrenador</button>
  <button class="profile-tab ${active==='pokemon'?'active':''}" onclick="pokemonTeamPage()">⚡ Equipo Pokémon</button>
  <button class="profile-tab ${active==='stats'?'active':''}" onclick="statsPage()">📊 Estadísticas</button>
  <button class="profile-tab ${active==='achievements'?'active':''}" onclick="achievementsPage()">🏆 Logros</button>
 </div>`;
}

function trainerSheetPage(){
 content.innerHTML=`${profileTabs('stats')}
 <div class="trainer-sheet trainer-sheet-gladiatus">
  <div class="trainer-paper trainer-left-panel">
   <div class="trainer-avatar">${S.avatar?`<img src="${AVATAR_ART[S.avatar]}">`:'🧍'}</div>
   <button class="primary avatar-change" onclick="openAvatarChange()">${S.avatarChosen?'Cambiar avatar · ₽40.000':'Elegir avatar'}</button>

   <div class="trainer-identity">
    <h3>${S.trainer.name}</h3>
    <div><b>Nivel ${S.trainer.level}</b></div>
    <div>Prestigio ${S.trainer.prestige}</div>
    <div>Talentos ${S.trainer.talents}</div>
   </div>

   <div class="trainer-mini-stats">
    <h3>Estadísticas</h3>
    ${statsHTML(false)}
   </div>
  </div>

  <div class="trainer-main-panel">
   <div class="card equipment-main-card">
    <h3>Equipo y objetos equipados</h3>
    ${equipmentHTML()}
   </div>


  </div>
 </div>`;
}

function pokemonTeamPage(){
 content.innerHTML=`${profileTabs('pokemon')}
 <div class="card"><h3>Equipo Pokémon</h3>
  <div class="team-page-grid">${S.team.map((m,i)=>{ensurePokemonHp(m);return `<div class="team-card-full pokemon-info-card">${pokemonNoticeBadge(m)}
   ${pokemonMovesTooltip(m)}
   <div class="poke-card-sprite"><img src="${spr(m.id)}"></div>
   <div><h3>${m.name}</h3><b>Nv. ${m.level}</b>
   <div class="hpwrap team-hpwrap"><div class="hptext"><span>PS</span><span>${m.hp}/${m.maxHp}</span></div><div class="hpbar"><i style="width:${m.hp/m.maxHp*100}%"></i></div></div>
   ${pokemonExpBar(m)}
   ${pendingMoveUI(m,i)}${evolutionUI(m,i)}
   <div class="poke-type-strip strip-${primaryTypeClass(m)}"></div>${typeBadges(m)}
   ${statusBadge(m)}
   </div></div>`}).join('')}</div>
 </div>
 <div class="card team-bag-card">
  <h3>Mochila</h3>
  <p class="team-bag-help">Usá los objetos desde acá. Las Pociones te permiten elegir qué Pokémon herido querés curar.</p>
  <div class="team-bag-grid">
   <div class="team-bag-item">
    <img src="${ITEM_ART.pokeball}"><div><b>Poké Ball</b><span>Cantidad: ${S.bag.pokeball||0}</span><small>Se usa durante una captura.</small></div>
   </div>
   <div class="team-bag-item usable">
    <img src="${ITEM_ART.potion}"><div><b>Poción</b><span>Cantidad: ${S.bag.potion||0}</span><small>Cura a un Pokémon herido.</small><button class="buy" onclick="usePotionFromTeam()" ${(S.bag.potion||0)<=0?'disabled':''}>Usar</button></div>
   </div>
   <div class="team-bag-item">
    <img src="${ITEM_ART.repel}"><div><b>Repelente</b><span>Cantidad: ${S.bag.repel||0}</span><small>Se usa durante la exploración.</small></div>
   </div>
  </div>
 </div>`;
}
function inventoryHTML(){
 const data=[
  ['pokeball','Poké Ball',S.bag.pokeball||0],
  ['potion','Poción',S.bag.potion||0],
  ['repel','Repelente',S.bag.repel||0]
 ];
 return `<div class="inventory-row">${data.map(x=>`<div class="inventory-card"><img src="${ITEM_ART[x[0]]}"><div><b>${x[1]}</b><span>Cantidad: ${x[2]}</span>
 ${x[0]==='potion'?`<button class="buy inventory-use" onclick="usePotionOutside()">Usar</button>`:x[0]==='repel'?`<button class="buy inventory-use" onclick="useRepel()">Usar</button>`:'<small>Se usa durante una captura.</small>'}
 </div></div>`).join('')}</div>`;
}

function usePotionOutside(){
 const target=S.team.find(m=>{ensurePokemonHp(m);return m.hp>0&&m.hp<m.maxHp});
 if(!target){alert('No tenés ningún Pokémon herido que pueda usar una Poción.');return}
 if((S.bag.potion||0)<=0){alert('No te quedan Pociones.');return}
 const amount=Math.max(12,Math.round(target.maxHp*.42)),before=target.hp;
 target.hp=Math.min(target.maxHp,target.hp+amount);S.bag.potion--;
 S.history.push(`Usaste una Poción sobre ${target.name}: +${target.hp-before} PS.`);
 save();hud();trainerSheetPage();
}
function useRepel(){
 if((S.bag.repel||0)<=0){alert('No te quedan Repelentes.');return}
 if(S.repelSteps>0){alert(`Ya tenés Repelente activo por ${S.repelSteps} exploraciones más.`);return}
 S.bag.repel--;S.repelSteps=3;
 S.history.push('Usaste un Repelente: reducirá encuentros salvajes durante 3 exploraciones en Bosque Verde.');
 save();hud();
 if(S.location==='Bosque Verde')forest();
 else trainerSheetPage();
}

const ITEM_ART={"pokeball":"assets/items/item_pokeball.png","potion":"assets/items/item_potion.png","repel":"assets/items/item_repel.png"};
const GEAR_ART={"Gorra cl\u00e1sica":"assets/items/gear_u00e1sica.png","Chaqueta de ruta":"assets/items/gear_ruta.png","Mochila aventurera":"assets/items/gear_aventurera.png","Zapatillas r\u00e1pidas":"assets/items/gear_u00e1pidas.png","Gafas oscuras":"assets/items/gear_oscuras.png","Pa\u00f1uelo rojo":"assets/items/gear_rojo.png"};
const NEW_GEAR_ART={"pants_brown":"assets/items/new_gear_pants_brown.png","pants_jeans":"assets/items/new_gear_pants_jeans.png","pants_sport":"assets/items/new_gear_pants_sport.png","cap_black":"assets/items/new_gear_cap_black.png","watch":"assets/items/new_gear_watch.png","necklace":"assets/items/new_gear_necklace.png","bag_cross":"assets/items/new_gear_bag_cross.png","hat_safari":"assets/items/new_gear_hat_safari.png","sweater_green":"assets/items/new_gear_sweater_green.png","bag_classic":"assets/items/new_gear_bag_classic.png","loafers":"assets/items/new_gear_loafers.png","glasses_round":"assets/items/new_gear_glasses_round.png","scarf_blue":"assets/items/new_gear_scarf_blue.png"};

const outfitCatalog={
 'Gorra clásica':{slot:'head',art:GEAR_ART['Gorra clásica'],effects:{Exploracion:1}},
 'Chaqueta de ruta':{slot:'body',art:GEAR_ART['Chaqueta de ruta'],effects:{Resistencia:1}},
 'Mochila aventurera':{slot:'back',art:GEAR_ART['Mochila aventurera'],effects:{Exploracion:1,Captura:1}},
 'Zapatillas rápidas':{slot:'feet',art:GEAR_ART['Zapatillas rápidas'],effects:{travelPct:6}},
 'Gafas oscuras':{slot:'accessory',art:GEAR_ART['Gafas oscuras'],effects:{Tecnica:1}},
 'Pañuelo rojo':{slot:'accessory',art:GEAR_ART['Pañuelo rojo'],effects:{Carisma:1}}
};
const slotNames={head:'Cabeza',body:'Torso',legs:'Piernas',back:'Mochila',feet:'Calzado',accessory:'Accesorio'};
const GEAR_TEMPLATES=[
 {sprite:'pants_brown',slot:'legs',base:'Pantalón de viaje'},{sprite:'pants_jeans',slot:'legs',base:'Jeans de entrenador'},
 {sprite:'pants_sport',slot:'legs',base:'Pantalón deportivo'},{sprite:'cap_black',slot:'head',base:'Gorra urbana'},
 {sprite:'watch',slot:'accessory',base:'Reloj digital'},{sprite:'necklace',slot:'accessory',base:'Colgante rayo'},
 {sprite:'bag_cross',slot:'back',base:'Bolso cruzado'},{sprite:'hat_safari',slot:'head',base:'Sombrero de campo'},
 {sprite:'sweater_green',slot:'body',base:'Suéter de ruta'},{sprite:'bag_classic',slot:'back',base:'Bolso clásico'},
 {sprite:'loafers',slot:'feet',base:'Mocasines cómodos'},{sprite:'glasses_round',slot:'accessory',base:'Gafas de lectura'},
 {sprite:'scarf_blue',slot:'accessory',base:'Bufanda azul'}
];
const GEAR_TIERS=[
 {min:1,max:4,label:'Sencillo',prefix:['Básico','Sencillo','Inicial'],power:1,price:1},
 {min:5,max:9,label:'Entrenador',prefix:['Entrenador','Ruta','Práctico'],power:1.35,price:1.5},
 {min:10,max:14,label:'Experto',prefix:['Experto','Técnico','Explorador'],power:1.7,price:2.1},
 {min:15,max:19,label:'Avanzado',prefix:['Avanzado','Profesional','Veterano'],power:2.05,price:2.8},
 {min:20,max:999,label:'Élite',prefix:['Élite','Maestro','Campeón'],power:2.45,price:3.6}
];
function gearTier(){return GEAR_TIERS.find(t=>S.trainer.level>=t.min&&S.trainer.level<=t.max)||GEAR_TIERS[0]}
function gearUid(){return 'g'+Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
function effectLabel(k,v){
 const L={Tecnica:'Técnica',Estrategia:'Estrategia',Exploracion:'Exploración',Captura:'Captura',Carisma:'Carisma',Resistencia:'Resistencia',
 capturePct:'Captura',explorePct:'Hallazgo',travelPct:'Velocidad de viaje',moneyPct:'Recompensas',damagePct:'Daño',maxEnergy:'Energía máx.'};
 if(k==='maxEnergy'||['Tecnica','Estrategia','Exploracion','Captura','Carisma','Resistencia'].includes(k))return `+${v} ${L[k]}`;
 return `+${v}% ${L[k]}`;
}
function randomGearEffects(slot,p){
 const map={head:['Exploracion','Estrategia','explorePct'],body:['Resistencia','maxEnergy','damagePct'],
 legs:['Resistencia','Tecnica','travelPct'],back:['Exploracion','Captura','explorePct','maxEnergy'],
 feet:['travelPct','Resistencia','Tecnica'],accessory:['Tecnica','Estrategia','Captura','Carisma','capturePct','moneyPct']};
 let arr=[...(map[slot]||['Exploracion'])],k=choice(arr),pct=k.endsWith('Pct');
 let effects={[k]:pct?Math.max(2,Math.round(2*p+Math.random()*2*p)):Math.max(1,Math.round(p))};
 if(Math.random()<.34){arr=arr.filter(x=>x!==k);if(arr.length){let q=choice(arr),qp=q.endsWith('Pct');effects[q]=qp?Math.max(1,Math.round(1.2*p+Math.random()*p)):1}}
 return effects;
}
function generateBoutiqueStock(){
 const t=gearTier(), stock=[];
 for(let i=0;i<12;i++){
  const base=choice(GEAR_TEMPLATES),level=Math.max(1,S.trainer.level+Math.floor(Math.random()*3)-1),effects=randomGearEffects(base.slot,t.power);
  const price=Math.max(250,Math.round((420+level*110+Object.values(effects).reduce((a,v)=>a+v*90,0))*t.price/50)*50);
  stock.push({id:gearUid()+i,name:`${base.base} ${choice(t.prefix)}`,template:base.sprite,slot:base.slot,level,quality:Object.keys(effects).length>1?'Especial':'Común',price,effects,art:NEW_GEAR_ART[base.sprite]});
 }
 S.boutiqueStock=stock;S.boutiqueRefreshAt=Date.now()+6*60*60*1000;save();
}
function ensureBoutiqueStock(){if(!S.boutiqueStock?.length||S.boutiqueStock.length!==12||Date.now()>=S.boutiqueRefreshAt)generateBoutiqueStock()}
function boutiqueCountdown(){let ms=Math.max(0,S.boutiqueRefreshAt-Date.now()),h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`}
function getGear(ref){if(!ref)return null;if(outfitCatalog[ref])return{id:ref,name:ref,...outfitCatalog[ref],level:1,quality:'Clásico'};return S.gearInventory.find(g=>g.id===ref)||null}
function allGearEffects(){let o={};Object.values(S.equipped).forEach(ref=>{let g=getGear(ref);if(g)Object.entries(g.effects||{}).forEach(([k,v])=>o[k]=(o[k]||0)+v)});return o}
function gearEffect(k){return allGearEffects()[k]||0}
function effectiveStat(k){return (S.trainer.stats[k]||0)+gearEffect(k)}
function effectiveMaxEnergy(){return 100+Math.max(0,Math.floor((effectiveStat('Resistencia')-5)/2))+gearEffect('maxEnergy')}
function syncDerivedStats(){S.trainer.maxEnergy=effectiveMaxEnergy();S.trainer.energy=Math.min(S.trainer.energy,S.trainer.maxEnergy)}
function gearTooltip(g){return `<div class="gear-tooltip"><b>${g.name}</b><span>${slotNames[g.slot]} · Nv. ${g.level||1} · ${g.quality||'Común'}</span>${Object.entries(g.effects||{}).map(([k,v])=>`<em>${effectLabel(k,v)}</em>`).join('')}</div>`}
function equipmentHTML(){
 syncDerivedStats();
 return `<div class="equip-grid">${Object.keys(slotNames).map(slot=>{let g=getGear(S.equipped[slot]);return `<div class="equip-slot" data-slot="${slot}"><b>${slotNames[slot]}</b>${g?`<div class="gear-hover"><img src="${g.art}">${gearTooltip(g)}</div><small>${g.name}</small><div class="equip-effects">${Object.entries(g.effects||{}).map(([k,v])=>effectLabel(k,v)).join(' · ')}</div><button class="buy" onclick="unequip('${slot}')">Quitar</button>`:`<div class="empty">＋</div><small>Vacío</small>`}</div>`}).join('')}</div>
 <h4>Guardarropa</h4><div class="wardrobe-grid">
 ${S.outfits.map(n=>{let g=getGear(n),w=Object.values(S.equipped).includes(n);return `<div class="wardrobe-card"><div class="gear-hover"><img src="${g.art}">${gearTooltip(g)}</div><b>${n}</b><button class="buy" onclick="equipOutfit('${n}')">${w?'Puesto':'Equipar'}</button></div>`}).join('')}
 ${S.gearInventory.map(g=>{let w=Object.values(S.equipped).includes(g.id);return `<div class="wardrobe-card"><div class="gear-hover"><img src="${g.art}">${gearTooltip(g)}</div><b>${g.name}</b><small>Nv. ${g.level}</small><div class="mini-effects">${Object.entries(g.effects).map(([k,v])=>effectLabel(k,v)).join('<br>')}</div><button class="buy" onclick="equipGear('${g.id}')">${w?'Puesto':'Equipar'}</button></div>`}).join('')}
 ${!S.outfits.length&&!S.gearInventory.length?'<div class="muted">Todavía no compraste ropa.</div>':''}</div>`;
}
function equipOutfit(n){let g=getGear(n);if(!g||!S.outfits.includes(n))return;S.equipped[g.slot]=n;syncDerivedStats();save();trainerSheetPage()}
function equipGear(id){let g=getGear(id);if(!g)return;S.equipped[g.slot]=id;syncDerivedStats();S.history.push(`Te equipaste ${g.name}.`);save();trainerSheetPage()}
function unequip(slot){S.equipped[slot]=null;syncDerivedStats();save();trainerSheetPage()}
function statsPage(){let b=S.battleStats;content.innerHTML=`<div class="tabs"><button class="tab" onclick="overview()">🏠 Visión general</button><button class="tab" onclick="statsPage()">Estadísticas</button><button class="tab" onclick="victoriesPage()">Victorias</button></div>
<div class="card"><h3>Estadísticas de batalla</h3><table class="statsTable">
<tr><td>Batallas</td><td><b>${b.battles}</b></td></tr><tr><td>Victorias</td><td><b>${b.wins}</b></td></tr><tr><td>Derrotas</td><td><b>${b.losses}</b></td></tr>
<tr><td>Victorias consecutivas</td><td><b>${b.streak}</b></td></tr><tr><td>Mejor racha</td><td><b>${b.bestStreak}</b></td></tr><tr><td>Dinero ganado en batalla</td><td><b>₽${b.moneyWon}</b></td></tr></table></div>
<div class="card"><h3>Progreso</h3><table class="statsTable"><tr><td>Misiones completadas</td><td><b>${S.completedMissions.length}</b></td></tr>
<tr><td>Pokémon vistos</td><td><b>${S.seen.length}</b></td></tr><tr><td>Pokémon capturados</td><td><b>${S.caught.length}</b></td></tr>
<tr><td>Encuentros en Bosque Verde</td><td><b>${S.progress.forest}</b></td></tr><tr><td>Prestigio</td><td><b>${S.trainer.prestige}</b></td></tr></table></div>`}
function victoriesPage(){content.innerHTML=`<div class="tabs"><button class="tab" onclick="overview()">🏠 Visión general</button><button class="tab" onclick="statsPage()">Estadísticas</button><button class="tab" onclick="victoriesPage()">Victorias</button></div>
<div class="card"><h3>Historial de victorias</h3><p><b>${S.battleStats.wins}</b> victorias registradas.</p><p>Mejor racha: <b>${S.battleStats.bestStreak}</b>.</p>
<p class="muted">Más adelante esta pestaña separará combates salvajes, entrenadores, gimnasios y PvP.</p></div>`}

const statInfo={
 Tecnica:{title:'Técnica',desc:'Representa tu dominio práctico como entrenador. Mejora levemente la consistencia de tus decisiones durante combates y entrenamientos.',effect:'Aumenta el aporte del entrenador a la probabilidad de victoria.'},
 Estrategia:{title:'Estrategia',desc:'Mide tu capacidad para leer al rival, elegir enfoques y aprovechar ventajas.',effect:'Mejora el rendimiento general en combates y futuros duelos de entrenador.'},
 Exploracion:{title:'Exploración',desc:'Tu experiencia recorriendo rutas, bosques, cuevas y lugares poco transitados.',effect:'Aumentará la posibilidad de descubrir eventos, objetos y encuentros poco comunes.'},
 Captura:{title:'Captura',desc:'Tu conocimiento sobre comportamiento Pokémon, lanzamiento y elección de Poké Ball.',effect:'Mejorará la eficacia de captura cuando implementemos capturas manuales.'},
 Carisma:{title:'Carisma',desc:'Tu facilidad para tratar con NPC, comerciantes, investigadores y otros entrenadores.',effect:'Podrá desbloquear diálogos, descuentos, recompensas y soluciones alternativas.'},
 Resistencia:{title:'Resistencia',desc:'Tu capacidad física y mental para soportar viajes largos y jornadas exigentes.',effect:'Influirá en energía máxima, recuperación y algunas expediciones extensas.'}
};
function statsHTML(train){syncDerivedStats();return Object.entries(S.trainer.stats).map(([k,v])=>{let cost=100+v*v*18,info=statInfo[k]||{title:k,desc:'',effect:''},bonus=gearEffect(k),eff=v+bonus;return `<div class="stat">
<span class="statname">${info.title}<span class="tooltip"><b>${info.title}: ${v}${bonus?` + ${bonus} = ${eff}`:''}</b><br>${info.desc}<span class="formula">${info.effect}</span></span></span>
<div class="bar"><i style="width:${Math.min(100,eff*5)}%"></i></div><b>${v}${bonus?` <span class="statbonus">+${bonus}</span>`:''}</b>${train?`<button class="buy" onclick="train('${k}')" ${S.trainer.money<cost?'disabled':''}>₽${cost}</button>`:''}</div>`}).join('')}
function training(){content.innerHTML=`<div class="tabs"><button class="tab">⚔️ Entrenamiento</button></div><div class="card"><h3>Academia de Entrenadores</h3>
<p>Mejorá tus cualidades con dinero. Cada atributo tendrá efectos propios sobre captura, exploración, combate y relaciones con NPC.</p>${statsHTML(true)}
<p class="muted">Cada 3 niveles recibís además 1 Punto de Talento. Más adelante servirán para especializaciones permanentes.</p></div>`}
function train(k){let v=S.trainer.stats[k],cost=100+v*v*18;if(S.trainer.money<cost)return;S.trainer.money-=cost;S.trainer.stats[k]++;S.history.push(`Entrenaste ${k}: ahora es ${v+1}.`);save();training()}
function missions(){ensureMissionCycle();content.innerHTML=`<div class="tabs"><button class="tab">👥 Misiones</button><button class="tab">Objetivos</button></div>
${cycleMissionsHTML()}
<div class="card"><h3>Misiones de historia / Oak</h3>
${missionDefs.map(m=>{let a=S.missions.find(x=>x.id==m.id),done=S.completedMissions.includes(m.id),prog=Math.min(m.goal,missionProgress(m));return `<div class="mission ${done?'done':''}"><div class="icon">${done?'✅':m.icon}</div><div><b>${m.title}</b><br>${m.desc}<br><small>Progreso: ${prog}/${m.goal} · Recompensa ₽${m.reward} + ${m.xp} EXP</small></div>
${done?`<span class="claimed">COMPLETADA</span>`:a?(prog>=m.goal?`<button class="primary green" onclick="claimMission('${m.id}')">Cobrar</button>`:`<b>ACEPTADA</b>`):`<button class="primary" onclick="acceptMission('${m.id}')">Aceptar</button>`}</div>`}).join('')}</div>`}
function missionProgress(m){if(m.id==='m1')return S.progress.wins;if(m.id==='m2')return S.seen.length;if(m.id==='m3')return S.progress.forest;return 0}
function acceptMission(id){if(S.completedMissions.includes(id)||S.missions.some(x=>x.id===id))return;if(S.missions.length>=2){alert('Podés tener hasta 2 misiones activas.');return}S.missions.push({id});S.history.push('Aceptaste una nueva misión.');save();missions()}
function claimMission(id){
 let m=missionDefs.find(x=>x.id==id);
 if(!m||S.completedMissions.includes(id)||!S.missions.some(x=>x.id===id)||missionProgress(m)<m.goal)return;
 S.trainer.money+=m.reward;
 S.missions=S.missions.filter(x=>x.id!==id);
 S.completedMissions.push(id);
 S.history.push(`Completaste "${m.title}" y cobraste su recompensa.`);
 addXP(m.xp);save();missions()
}
function ranking(){content.innerHTML=`<div class="card"><h3>Clasificación de entrenadores</h3><p>Próximamente: ranking persistente. En una versión online, esta tabla comparará entrenadores reales.</p>
${['Red','Blue','Leaf',S.trainer.name].map((n,i)=>`<div class="stat"><b>#${i+1}</b><span>${n}</span><div></div><b>${[340,280,210,S.trainer.prestige][i]} PR</b></div>`).join('')}</div>`}


function charismaDiscount(){return Math.min(.10,Math.max(0,(effectiveStat('Carisma')-5)*.005))}
function boutique(){
 ensureBoutiqueStock();syncDerivedStats();let discount=charismaDiscount();
 content.innerHTML=`<div class="card"><div class="boutique-head"><div><h3>👕 Boutique rotativa</h3><p>12 objetos adaptados a tu nivel. El escaparate cambia cada 6 horas reales.</p></div><div class="shop-clock">Nuevos objetos en<br><b id="boutiqueClock">${boutiqueCountdown()}</b></div></div>
 <div class="boutique-info">Nivel <b>${S.trainer.level}</b> · Tier <b>${gearTier().label}</b>${discount?` · Carisma: <b>-${Math.round(discount*100)}%</b>`:''}</div>
 <div class="shop boutique-grid">${S.boutiqueStock.map(g=>{let price=Math.max(50,Math.round(g.price*(1-discount)/50)*50),owned=S.gearInventory.some(x=>x.id===g.id);return `<div class="item gear-shop-item"><div class="gear-hover pic"><img src="${g.art}">${gearTooltip(g)}</div><b>${g.name}</b><small>${slotNames[g.slot]} · Nv. ${g.level} · ${g.quality}</small><div class="shop-effects">${Object.entries(g.effects).map(([k,v])=>effectLabel(k,v)).join('<br>')}</div><p>${owned?'Comprado':'₽'+price.toLocaleString('es-AR')}</p><button class="buy" ${owned?'disabled':''} onclick="buyRotatingGear('${g.id}',${price})">${owned?'Comprado':'Comprar'}</button></div>`}).join('')}</div></div>`;
}
function buyRotatingGear(id,price){ensureBoutiqueStock();let g=S.boutiqueStock.find(x=>x.id===id);if(!g||S.gearInventory.some(x=>x.id===id)||S.trainer.money<price)return;S.trainer.money-=price;S.gearInventory.push(JSON.parse(JSON.stringify(g)));S.history.push(`Compraste ${g.name}.`);save();hud();boutique()}
function shop(){
 const goods=[
  ['pokeball','Poké Ball',200,'Captura Pokémon salvajes debilitados.'],
  ['potion','Poción',300,'Recupera PS. También puede utilizarse durante un combate.'],
  ['repel','Repelente',350,'Reduce encuentros salvajes durante una exploración.']
 ];
 content.innerHTML=`<div class="card"><h3>🏪 Tienda Pokémon</h3><p>Poké Balls, medicina y suministros para expediciones.</p>
 <div class="shop">${goods.map(x=>`<div class="item"><div class="pic"><img src="${ITEM_ART[x[0]]}"></div><b>${x[1]}</b><p class="muted">${x[3]}</p><p>₽${x[2]}</p>
 <button class="buy" onclick="buyItem('${x[0]}',${x[2]})">Comprar</button></div>`).join('')}</div></div>`;
}
function buyItem(k,c){if(S.trainer.money<c)return;S.trainer.money-=c;S.bag[k]=(S.bag[k]||0)+1;S.history.push('Compraste un objeto en la Tienda Pokémon.');save();shop()}



function forestAction(kind){
 if(S.location!=='Bosque Verde'){
   alert('Primero tenés que estar en Bosque Verde.');
   return;
 }
 if(kind==='explore'){forestExplore();return}
 if(kind==='trainer'){forestTrainerSpot();return}
 if(kind==='loot'){forestLoot();return}
 if(kind==='ranger'){forestRanger();return}
 if(kind==='south'){travel('Ciudad Verde');return}
}
function forestRanger(){
 const lines=[
  '«El Bosque Verde cambia mucho según el sector que recorras. No siempre vas a encontrar los mismos Pokémon.»',
  '«Los Cazabichos suelen moverse por los senderos laterales. Si buscás combate, probá por ahí.»',
  '«Si tu equipo está muy herido, volver a Ciudad Verde antes de seguir es una buena idea.»',
  '«La salida norte conduce hacia Ciudad Plateada, pero todavía no está habilitada para continuar el viaje.»'
 ];
 const text=npcVariant('forest_ranger',lines);
 content.innerHTML=`<div class="tabs"><button class="tab" onclick="forest()">← Bosque Verde</button></div>
 <div class="card npc-dialog-card">
  <img class="pallet-npc-img large" src="${FOREST_RANGER_ART}">
  <div>
   <h3>🌲 Guardabosques</h3>
   <div class="npc-dialog">${text}</div>
   <button class="primary" onclick="forestRanger()">Otro consejo</button>
   <button class="primary" onclick="forest()">← Volver</button>
  </div>
 </div>`;
}
function forestMapHTML(){
 const lootUsed=S.forestLootDate===new Date().toDateString();
 return `<div class="forest-map" style="background-image:url('${FOREST_MAP_ART}')">
   <button type="button" class="forest-hit" style="left:28%;top:40%" onclick="forestAction('explore')">🌿
    <span class="tip"><b>Hierba occidental</b>Zona de encuentros variables. Consume 3 de energía.</span>
   </button>
   <button type="button" class="forest-hit" style="left:65%;top:55%" onclick="forestAction('explore')">🌿
    <span class="tip"><b>Hierba profunda</b>Pokémon y desafíos del bosque.</span>
   </button>
   <button type="button" class="forest-hit trainer" style="left:50%;top:35%" onclick="forestAction('trainer')">⚔
    <span class="tip"><b>Cazabichos</b>Buscá un entrenador especializado.</span>
   </button>
   <button type="button" class="forest-hit trainer" style="left:76%;top:70%" onclick="forestAction('trainer')">⚔
    <span class="tip"><b>Sendero de Cazabichos</b>Puede aparecer un rival con 1 o 2 Pokémon.</span>
   </button>

   <button type="button" class="forest-hit lock" style="left:16%;top:15%" disabled>🔒
    <span class="tip"><b>Salida hacia Ciudad Plateada</b>Este es el camino norte. Todavía no está disponible.</span>
   </button>

   <button type="button" class="forest-hit ranger" style="left:39%;top:72%" onclick="forestAction('ranger')">💬
    <span class="tip"><b>Guardabosques</b>Hablar con el encargado del bosque.</span>
   </button>

   <button type="button" class="forest-hit item ${lootUsed?'used':''}" style="left:50%;top:5%" onclick="forestAction('loot')">${lootUsed?'✓':'🎁'}
    <span class="tip"><b>Objeto entre la hierba</b>${lootUsed?'Ya revisaste este punto hoy.':'Una vez por día podés encontrar un suministro.'}</span>
   </button>

   <button type="button" class="forest-hit exit" style="left:50%;top:94%" onclick="forestAction('south')">↓
    <span class="tip"><b>Salida sur</b>Regresar a Ciudad Verde.</span>
   </button>
 </div>`;
}

function city(){
 const l=S.location;
 let scene='';

 if(l==='Pueblo Paleta'){
   scene=`<div class="local-map" style="background-image:url('assets/items/new_gear.png')">
    <button class="local-hit open" style="left:46%;top:28%" onclick="homePage()">⌂
      <span class="tip"><b>Tu casa</b>Hablar con mamá, descansar y usar la PC.</span>
    </button>
    <button class="local-hit open" style="left:75%;top:31%" onclick="go('oak')">O
      <span class="tip"><b>Laboratorio de Oak</b>Hablar con el Profesor Oak.</span>
    </button>
    <button class="local-hit open" style="left:21%;top:68%" onclick="rivalHouse()">R
      <span class="tip"><b>Casa de tu rival</b>Eventos futuros del rival.</span>
    </button>
    <button class="local-hit open" style="left:34%;top:51%" onclick="palletNPC(1)">?
      <span class="tip"><b>Vecino curioso</b>Consejos sobre energía y viajes.</span>
    </button>
    <button class="local-hit open" style="left:65%;top:60%" onclick="palletNPC(2)">?
      <span class="tip"><b>Entrenador novato</b>Tutorial de combate; después ofrece consejos.</span>
    </button>
    <button class="local-hit open" style="left:47%;top:91%" onclick="travel('Ruta 1')">1
      <span class="tip"><b>Salida a Ruta 1</b>Continuar hacia Ciudad Verde.</span>
    </button>
    <button class="local-hit lock" style="left:88%;top:91%" disabled>🔒
      <span class="tip"><b>Ruta marítima</b>Contenido futuro.</span>
    </button>
   </div>
   <div class="mapnote">Pueblo Paleta · pasá el mouse sobre los puntos para interactuar.</div>`;
 }else if(l==='Ruta 1'){
   scene=`<div class="local-map" style="background-image:url('assets/maps/pueblo_paleta.png')">
    <button class="local-hit open" style="left:50%;top:8%" onclick="travel('Ciudad Verde')">V
      <span class="tip"><b>Ciudad Verde</b>Continuar hacia la ciudad.</span>
    </button>
    <button class="local-hit open" style="left:50%;top:92%" onclick="travel('Pueblo Paleta')">P
      <span class="tip"><b>Pueblo Paleta</b>Regresar al inicio.</span>
    </button>
    <button class="local-hit open" style="left:68%;top:50%" onclick="route1()">⚔
      <span class="tip"><b>Zona de encuentros</b>Buscar Pokémon y entrenadores.</span>
    </button>
    <button class="local-hit open" style="left:28%;top:53%" onclick="go('missions')">!
      <span class="tip"><b>Camino secundario</b>Revisar misiones relacionadas con la ruta.</span>
    </button>
   </div>
   <div class="mapnote">Ruta 1 · conectá Pueblo Paleta con Ciudad Verde y explorá la hierba alta.</div>`;
 }else if(l==='Ciudad Verde'){
   scene=`<div class="local-map" style="background-image:url('assets/maps/pueblo_paleta_2.png')">
    <button class="local-hit open" style="left:63%;top:63%" onclick="heal()">❤️
      <span class="tip"><b>Centro Pokémon</b>Curar completamente tu equipo.</span>
    </button>
    <button class="local-hit open" style="left:72%;top:46%" onclick="go('shop')">🛒
      <span class="tip"><b>Tienda Pokémon</b>Comprar Poké Balls y objetos.</span>
    </button>
    <button class="local-hit open" style="left:50%;top:95%" onclick="travel('Ruta 1')">1
      <span class="tip"><b>Ruta 1</b>Regresar hacia Pueblo Paleta.</span>
    </button>
    <button class="local-hit open" style="left:49%;top:5%" onclick="travel('Bosque Verde')">🌲
      <span class="tip"><b>Salida norte</b>Continuar hacia Bosque Verde.</span>
    </button>
    <button class="local-hit lock gym-hit" style="left:77%;top:20%" disabled>🔒
      <span class="tip"><b>Gimnasio de Ciudad Verde</b>El gimnasio está cerrado por ahora.</span>
    </button>

    <button class="local-hit npc-hit" style="left:58%;top:39%" onclick="viridianNpc('rookie','Entrenador novato')">💬
      <span class="tip"><b>Entrenador novato</b>Está practicando antes de entrar al bosque.</span>
    </button>

    <button class="local-hit npc-hit" style="left:39%;top:51%" onclick="viridianNpc('resident','Vecino de Ciudad Verde')">💬
      <span class="tip"><b>Vecino de Ciudad Verde</b>Conoce algunos rumores de la ciudad.</span>
    </button>

    <button class="local-hit npc-hit" style="left:67%;top:72%" onclick="viridianNpc('scout','Explorador de ruta')">💬
      <span class="tip"><b>Explorador de ruta</b>Puede darte consejos antes de seguir viaje.</span>
    </button>
   </div>
   <div class="mapnote">Ciudad Verde · primera ciudad importante del viaje, con Centro Pokémon, Tienda y Gimnasio.</div>`;
 }else if(l==='Bosque Verde'){
   scene=`${S.repelSteps>0?`<div class="forest-status">🧴 Repelente activo: ${S.repelSteps} exploraciones restantes.</div>`:''}
   ${forestMapHTML()}
   <div class="mapnote">Bosque Verde · tocá directamente los puntos del mapa para explorar, combatir, hablar o viajar.</div>`;
 }else{
   scene=`<div class="citymap"><div class="road h"></div><div class="road v"></div>
    <button class="building" style="left:10%;top:15%;width:150px;height:85px" onclick="go('map')">🗺️ Volver al mapa<br><small>Kanto</small></button>
   </div>`;
 }

 content.innerHTML=`<div class="tabs"><button class="tab">🏠 Portal de la ciudad</button><button class="tab" onclick="go('map')">🗺️ Mapa de Kanto</button></div>
 <div class="card"><h3>${l}</h3>
 <p>Esta vista representa los lugares importantes de la zona donde estás. Usá los puntos interactivos sobre el mapa.</p>
 ${scene}</div>`;
}

const MOM_LINES=[
 '«No hace falta correr todo el tiempo. Si volvés lastimado, descansá antes de salir otra vez.»',
 '«Tu equipo también necesita un respiro. Una buena expedición empieza con todos sanos.»',
 '«El Profesor Oak siempre tiene algo para enseñarte. Preguntale consejos de vez en cuando.»',
 '«No gastes toda tu energía si todavía te queda mucho camino por recorrer.»',
 '«Si tu equipo se llena, usá la PC para organizar tus Pokémon.»'
];

function homePage(){
 content.innerHTML=`<div class="tabs"><button class="tab" onclick="city()">← Pueblo Paleta</button></div>
 <div class="card"><h3>🏠 Tu casa</h3>
  <div class="home-grid">
   <div class="home-portrait"><img class="pallet-npc-img" src="${PALLET_NPC_ART.mom}"></div>
   <div>
    <h3>Mamá</h3><p>Tu madre sigue tus primeros pasos como entrenador y siempre tiene algo para decir.</p>
    <button class="primary" onclick="talkMom()">Hablar con mamá</button>
    <button class="primary" onclick="homeRest()">🛏️ Descansar</button>
    <button class="primary" onclick="pcStorage()">💻 Usar la PC</button>
    <button class="primary" onclick="city()">← Volver</button>
    <div id="momReply" class="npc-dialog">«¿Cómo va la aventura?»</div>
   </div>
  </div>
 </div>`;
}
function talkMom(){
 const box=document.getElementById('momReply');
 if(box)box.innerHTML=npcVariant('mom',MOM_LINES)+`<br><button class="primary" style="margin-top:8px" onclick="talkMom()">Seguir charlando</button>`;
}
function homeRest(){
 S.team.forEach(x=>{ensurePokemonHp(x);x.hp=x.maxHp;x.status=null;});
 S.history.push('Descansaste en tu casa de Pueblo Paleta. Tu equipo quedó completamente recuperado.');
 save();hud();homePage();
}
function palletTutorials(){
 const done=!!S.palletNoviceTutorialDone;
 content.innerHTML=`<div class="tabs"><button class="tab" onclick="city()">← Pueblo Paleta</button></div>
 <div class="tutorial-npc npc-with-art"><img class="pallet-npc-img" src="${PALLET_NPC_ART.neighbor}"><div><h3>Vecino curioso</h3><p>«La energía se recupera con el tiempo. Explorar, viajar y combatir tienen costes diferentes, así que conviene planificar el recorrido.»</p>
 <button class="primary" onclick="palletNPC(1)">Hablar</button></div></div>
 <div class="tutorial-npc npc-with-art"><img class="pallet-npc-img" src="${PALLET_NOVICE_ART}"><div><h3>Entrenador novato</h3><p>${done?'«Después de nuestro combate aprendí bastante. Si querés, ahora puedo darte algunos consejos.»':'«¡Estoy practicando! Podemos hacer un combate corto para aprender cómo funcionan los duelos.»'}</p>
 <button class="primary" onclick="${done?'palletNPC(2)':'startPalletNoviceTutorial()'}">${done?'Pedir consejo':'Comenzar tutorial de combate'}</button></div></div>`;
}
function startPalletNoviceTutorial(){
 const encounter={
  kind:'trainer',
  name:'Entrenador novato',
  sprite:'novice',
  tutorialId:'palletNovice',
  party:[{name:'Rattata',id:19,level:2,maxHp:36,hp:36,status:null}]
 };
 startTrainerBattle(encounter,'Pueblo Paleta');
}
function palletNPC(id){
 const messages=id===1?[
  '«Viajar entre zonas gasta energía y tarda unos segundos. Si tenés dinero, también podés hacer dedo para llegar al instante.»',
  '«Explorar una ruta cuesta energía incluso antes del combate. Conviene administrar bien cada salida.»',
  '«Oak ofrece trabajos largos: sirven para conseguir dinero cuando no vas a estar jugando.»'
 ]:[
  '«Una Poción puede salvarte en combate, pero el reloj no se detiene mientras la usás.»',
  '«Los movimientos de estado pueden darte una ventaja aunque no hagan daño directo.»',
  '«Cambiar de Pokémon a tiempo puede ser mejor que aguantar un enfrentamiento desfavorable.»',
  '«Antes de salir mirá los PS de tu equipo: el daño permanece después del combate.»'
 ];
 content.innerHTML=`<div class="tabs"><button class="tab" onclick="city()">← Pueblo Paleta</button></div>
 <div class="card npc-dialog-card">
  <img class="pallet-npc-img large" src="${id===1?PALLET_NPC_ART.neighbor:PALLET_NOVICE_ART}">
  <div>
   <h3>${id===1?'Vecino curioso':'Entrenador novato'}</h3>
   <div id="tutorialReply" class="npc-dialog">${npcVariant(id===1?'neighbor':'trainerNovice',messages)}</div>
   <button class="primary" onclick="palletNPC(${id})">Otro consejo</button>
   <button class="primary" onclick="city()">Volver</button>
  </div>
 </div>`;
}

function pcStorage(){
 S.team.forEach(ensurePokemonHp);S.pc=(S.pc||[]);S.pc.forEach(ensurePokemonHp);
 content.innerHTML=`<div class="tabs"><button class="tab" onclick="city()">← Volver</button></div>
 <div class="card"><h3>💻 Sistema de almacenamiento Pokémon</h3><p>Podés llevar hasta 6 Pokémon. El resto queda guardado en la PC.</p>
 <div class="pc-grid">
  <div class="pc-box"><h3>Equipo · ${S.team.length}/6</h3>
   ${S.team.map((m,i)=>`<div class="pc-mon"><img src="${spr(m.id)}"><div><b>${m.name} Nv.${m.level}</b><br><small>PS ${m.hp}/${m.maxHp}</small></div>
   <button class="buy" ${S.team.length<=1?'disabled':''} onclick="sendToPC(${i})">Guardar</button></div>`).join('')}
  </div>
  <div class="pc-box"><h3>PC · ${S.pc.length}</h3>
   ${S.pc.length?S.pc.map((m,i)=>`<div class="pc-mon"><img src="${spr(m.id)}"><div><b>${m.name} Nv.${m.level}</b><br><small>PS ${m.hp}/${m.maxHp}</small></div>
   <button class="buy" ${S.team.length>=6?'disabled':''} onclick="takeFromPC(${i})">Retirar</button></div>`).join(''):'<p class="muted">No hay Pokémon almacenados.</p>'}
  </div>
 </div></div>`;
}
function sendToPC(i){
 if(S.team.length<=1)return;
 const m=S.team.splice(i,1)[0];S.pc.push(m);S.history.push(`${m.name} fue enviado a la PC.`);save();hud();pcStorage();
}
function takeFromPC(i){
 if(S.team.length>=6)return;
 const m=S.pc.splice(i,1)[0];S.team.push(m);S.history.push(`${m.name} volvió al equipo desde la PC.`);save();hud();pcStorage();
}
function rivalHouse(){
 content.innerHTML=`<div class="tabs"><button class="tab" onclick="city()">← Pueblo Paleta</button></div>
 <div class="card"><h3>Casa de tu rival</h3><p>La casa está tranquila. Esta ubicación quedará reservada para el sistema de rival y sus eventos personales.</p>
 <button class="primary" onclick="city()">Volver</button></div>`;
}

function map(){
 const hit=(name,label,x,y,state='locked',desc='Todavía bloqueado')=>{
   const action=state==='locked'?'disabled':`onclick="travel('${name}')"`;
   return `<button class="map-hit ${state==='locked'?'locked':''}" style="left:${x}%;top:${y}%" ${action}>
      <span class="tip"><b>${label}</b>${desc}</span>
   </button>`;
 };
 content.innerHTML=`<div class="tabs"><button class="tab" onclick="city()">🏠 Portal de la ciudad</button><button class="tab">🗺️ Mapa de Kanto</button></div>
 <div class="card"><h3>Mapa de Kanto</h3>
 <p>Los candados ya no forman parte del dibujo. Pasá el mouse sobre los marcadores para ver cada destino.</p>
 <div class="kanto-art" style="background-image:url('assets/maps/kanto.png');background-size:cover;background-position:center">
   ${hit('Pueblo Paleta','Pueblo Paleta',8,75,'open','Inicio de tu aventura.')}
   ${hit('Ruta 1','Ruta 1',14,67,'open','Camino entre Paleta y Verde.')}
   ${hit('Ciudad Verde','Ciudad Verde',18,55,'open','Primera ciudad del viaje.')}
   ${hit('Bosque Verde','Bosque Verde',18,43,'open','Zona de Pokémon Bicho.')}
   ${hit('Ciudad Plateada','Ciudad Plateada',31,26,'locked','Próximo objetivo importante.')}
   ${hit('Monte Moon','Mt. Moon',48,15,'locked')}
   ${hit('Ciudad Celeste','Ciudad Celeste',65,20,'locked')}
   ${hit('Ciudad Azulona','Ciudad Azulona',31,53,'locked')}
   ${hit('Ciudad Azafrán','Ciudad Azafrán',50,41,'locked')}
   ${hit('Pueblo Lavanda','Pueblo Lavanda',76,53,'locked')}
   ${hit('Ciudad Carmín','Ciudad Carmín',54,67,'locked')}
   ${hit('Ciudad Fucsia','Ciudad Fucsia',50,84,'locked')}
   ${hit('Isla Canela','Isla Canela',26,90,'locked')}
   ${hit('Meseta Añil','Meseta Añil',12,9,'locked')}
 </div>
 <div class="kanto-legend"><span>🔴 ubicación actual</span><span>🟢 disponible</span><span>🟡 próximo objetivo</span></div></div>`;
}
const TRAVEL_DURATION_MS=12*1000;
const TRAVEL_ENERGY_COST=2;
function isTravelling(){return !!(S&&S.travel&&S.travel.endAt>Date.now())}
function travelRemaining(){return isTravelling()?Math.max(0,S.travel.endAt-Date.now()):0}
function checkTravelCompletion(){
 if(!S||!S.travel||S.travel.endAt>Date.now())return false;
 const t=S.travel;S.location=t.to;S.travel=null;S.history.push(`Llegaste a ${t.to} desde ${t.from}.`);registerMissionEvent('zones',1,t.to);save();renderZoneMenu();return true;
}
function travel(l){
 if(S.camp?.rest){alert('No podés viajar mientras estás acampando.');return;}
 checkTravelCompletion();if(workBlocked('viajar'))return;
 if(isTravelling()){alert('Ya estás viajando.');return}
 if(l===S.location){city();return}
 travelChoicePage(l);
}
function travelFare(from,to){
 const key=[from,to].sort().join('|');
 const fares={
  'Pueblo Paleta|Ruta 1':120,
  'Ciudad Verde|Ruta 1':160,
  'Bosque Verde|Ciudad Verde':240,
  'Bosque Verde|Ciudad Plateada':320
 };
 return fares[key]||Math.max(140,100+(S.trainer.level||1)*20);
}
function travelChoicePage(to){
 const from=S.location, fare=travelFare(from,to);
 content.innerHTML=`<div class="card travel-choice">
  <h3>🧭 Viajar hacia ${to}</h3>
  <p>Elegí cómo querés hacer el trayecto desde <b>${from}</b>.</p>
  <div class="travel-method-grid">
   <div class="travel-method">
    <div class="travel-method-icon">🚶</div>
    <h3>Caminar</h3>
    <p>El método habitual. Consume energía y tarda unos segundos.</p>
    <b>⚡ ${TRAVEL_ENERGY_COST} energía</b>
    <button class="primary" onclick='startWalkingTravel(${JSON.stringify(to)})'>Caminar</button>
   </div>
   <div class="travel-method">
    <div class="travel-method-icon">👍</div>
    <h3>Hacemos dedo</h3>
    <p>Pagás el viaje y alguien te acerca. Llegás inmediatamente.</p>
    <b>💰 ₽ ${fare.toLocaleString('es-AR')}</b>
    <button class="primary" ${S.trainer.money<fare?'disabled':''} onclick='hitchhikeTravel(${JSON.stringify(to)})'>Hacemos dedo</button>
   </div>
  </div>
  <button class="buy" style="margin-top:12px" onclick="city()">Cancelar</button>
 </div>`;
}
function startWalkingTravel(l){
 recoverEnergy();
 if(S.trainer.energy<TRAVEL_ENERGY_COST){alert(`Necesitás ${TRAVEL_ENERGY_COST} de energía para viajar.`);return}
 S.trainer.energy-=TRAVEL_ENERGY_COST;S.lastEnergyTick=Date.now();
 const travelMs=Math.max(4000,Math.round(TRAVEL_DURATION_MS*(1-gearEffect('travelPct')/100)));
 S.travel={from:S.location,to:l,startAt:Date.now(),endAt:Date.now()+travelMs,cost:TRAVEL_ENERGY_COST};
 S.history.push(`Saliste de ${S.location} rumbo a ${l}: -${TRAVEL_ENERGY_COST} energía.`);
 save();hud();travelPage();
}
function hitchhikeTravel(l){
 const from=S.location, fare=travelFare(from,l);
 if(S.trainer.money<fare){alert(`Necesitás ₽ ${fare.toLocaleString('es-AR')} para hacer dedo en este trayecto.`);return}
 S.trainer.money-=fare;
 S.location=l;
 S.travel=null;
 S.history.push(`Hiciste dedo desde ${from} hasta ${l}: -₽${fare}. Llegaste inmediatamente.`);
 save();hud();city();
}
function travelPage(){
 if(!isTravelling()){checkTravelCompletion();city();return}
 const t=S.travel,rem=travelRemaining(),total=t.endAt-t.startAt,pct=Math.max(0,Math.min(100,100-rem/total*100));
 content.innerHTML=`<div class="travel-screen"><h3>🚶 Viajando hacia ${t.to}</h3><p>Saliste de <b>${t.from}</b>.</p><div class="travel-time" id="travelCountdown">${Math.ceil(rem/1000)}s</div><div class="travel-bar"><i id="travelProgress" style="width:${pct}%"></i></div><p>⚡ Coste: ${t.cost} energía</p><small>Podés mirar otros menús, pero no combatir, explorar ni iniciar otro viaje.</small></div>`;
}
function oak(){content.innerHTML=`<div class="card trainergrid"><div><img class="oak-portrait" src="${OAK_SPRITE}"></div><div><h3>👨‍🔬 Profesor Oak</h3><p>«Un buen entrenador no sólo gana combates. Aprende a observar a sus Pokémon y el mundo que los rodea.»</p>
<p>Pokédex: <b>${S.seen.length} vistos / ${S.caught.length} capturados</b></p>
<button class="primary" onclick="oakTalk('dex')">Mostrar Pokédex</button>
<button class="primary" onclick="oakTalk('advice')">Pedir consejo</button>
<button class="primary" onclick="document.getElementById('oakWorkArea').scrollIntoView({behavior:'smooth'})">Preguntar por trabajo</button>
<button class="primary" onclick="city()">← Volver</button>
<div id="npcReply" class="npc-reply">Elegí una opción para hablar con Oak.</div></div></div><div id="oakWorkArea">${oakWorkHTML()}</div>`}
const OAK_ADVICE=[
 '«Los PS perdidos se conservan entre combates. Curá a tu equipo antes de una expedición larga.»',
 '«Los movimientos de estado pueden cambiar un duelo aunque no hagan daño directo.»',
 '«Cuanto más debilitado esté un Pokémon salvaje, mejor será tu oportunidad de capturarlo.»',
 '«Ruta 1 es sencilla: Pidgey y Rattata. Bosque Verde es mucho más impredecible.»',
 '«Cambiar de Pokémon puede darte una ventaja de tipo, pero también expone a otro compañero.»',
 '«La energía vuelve con el tiempo. Administrarla bien es parte del viaje.»',
 '«Viajar también consume recursos; no te alejes demasiado si tu equipo está lastimado.»',
 '«El veneno resta PS durante el combate. Una curación completa también elimina ese estado.»',
 '«Algunos entrenadores llevan dos Pokémon. Guardá recursos para peleas que se alargan.»',
 '«El Prestigio va a abrir oportunidades especiales a medida que tu carrera avance.»'
];
function oakTalk(t){
 const box=document.getElementById('npcReply');if(!box)return;
 if(t==='dex')box.innerHTML=`Oak revisa tus datos. «Tenés <b>${S.seen.length}</b> especies vistas y <b>${S.caught.length}</b> capturadas.»`;
 else if(t==='advice')box.innerHTML=`${npcVariant('oak',OAK_ADVICE)}<br><button class="primary" style="margin-top:8px" onclick="oakTalk('advice')">Otro consejo</button>`;
 else box.innerHTML='«Tengo varias tareas pendientes. Más abajo podés elegir cuánto tiempo querés ayudarme.»';
}
const AVATAR_ART={"adult1":"assets/avatars/avatar_adult1.png","adult2":"assets/avatars/avatar_adult2.png","adult3":"assets/avatars/avatar_adult3.png","adult4":"assets/avatars/avatar_adult4.png","adult5":"assets/avatars/avatar_adult5.png","adult6":"assets/avatars/avatar_adult6.png","young1":"assets/avatars/avatar_young1.png","young2":"assets/avatars/avatar_young2.png","young3":"assets/avatars/avatar_young3.png","young4":"assets/avatars/avatar_young4.png","young5":"assets/avatars/avatar_young5.png","young6":"assets/avatars/avatar_young6.png"};
const TRAINER_SPRITES={"t1":"assets/characters/trainer_t1.png","t2":"assets/characters/trainer_t2.png","t3":"assets/characters/trainer_t3.png","t4":"assets/characters/trainer_t4.png","bug_boy":"assets/characters/trainer_bug_boy.png","bug_girl":"assets/characters/trainer_bug_girl.png","bug_man":"assets/characters/trainer_bug_man.png","bug_woman":"assets/characters/trainer_bug_woman.png"};
const FOREST_MAP_ART="assets/characters/trainer.png";
const PALLET_NOVICE_ART="assets/characters/entrenador_novato_paleta.png";
const PALLET_NPC_ART={"neighbor":"assets/characters/pallet_npc_neighbor.png","trainer":"assets/characters/pallet_npc_trainer.png","mom":"assets/characters/pallet_npc_mom.png"};
const OAK_SPRITE="assets/characters/pallet_npc.png";
TRAINER_SPRITES.novice=PALLET_NOVICE_ART;

const ROUTE1_POOL=[
 {kind:'wild',name:'Pidgey',id:16,lv:[2,4]},
 {kind:'wild',name:'Rattata',id:19,lv:[2,4]}
];

const TRAINER_ARCHETYPES=[
 {name:'Entrenador joven',sprite:'t1'},
 {name:'Entrenador viajero',sprite:'t2'},
 {name:'Entrenadora novata',sprite:'t3'},
 {name:'Exploradora',sprite:'t4'}
];
const BUG_TRAINER_ARCHETYPES=[
 {name:'Cazabichos niño',sprite:'bug_boy'},
 {name:'Cazabichos niña',sprite:'bug_girl'},
 {name:'Cazabichos adulto',sprite:'bug_man'},
 {name:'Cazabichos adulta',sprite:'bug_woman'}
];
const FOREST_POOL=[
 {kind:'wild',name:'Caterpie',id:10,lv:[3,5]},
 {kind:'wild',name:'Metapod',id:11,lv:[4,6]},
 {kind:'wild',name:'Weedle',id:13,lv:[3,5]},
 {kind:'wild',name:'Kakuna',id:14,lv:[4,6]},
 {kind:'wild',name:'Pikachu',id:25,lv:[4,6],rare:true},
 {kind:'wild',name:'Pidgeotto',id:17,lv:[6,8],rare:true}
];
const BUG_TRAINER_POKEMON=[
 {name:'Caterpie',id:10},{name:'Metapod',id:11},{name:'Weedle',id:13},
 {name:'Kakuna',id:14},{name:'Pidgeotto',id:17,rare:true},{name:'Pikachu',id:25,rare:true}
];


const TRAINER_POKEMON=[
 {name:'Pidgey',id:16,types:['Normal','Volador']},
 {name:'Rattata',id:19,types:['Normal']},
 {name:'Caterpie',id:10,types:['Bicho']},
 {name:'Pikachu',id:25,types:['Eléctrico']},
 {name:'Bulbasaur',id:1,types:['Planta','Veneno'],starter:true},
 {name:'Charmander',id:4,types:['Fuego'],starter:true},
 {name:'Squirtle',id:7,types:['Agua'],starter:true}
];

function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function choice(a){return a[Math.floor(Math.random()*a.length)]}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}


function makeBugTrainerEncounter(){
 const arch=choice(BUG_TRAINER_ARCHETYPES),count=Math.random()<0.30?2:1;
 let pool=shuffle(BUG_TRAINER_POKEMON.filter(p=>!p.rare||Math.random()<0.22));
 if(pool.length<count)pool=BUG_TRAINER_POKEMON.filter(p=>!p.rare);
 const party=pool.slice(0,count).map((p,i)=>({
  name:p.name,id:p.id,level:(p.id===17?rand(6,8):rand(4,6))+(i?1:0),
  type:(POKEMON_TYPES[p.id]||[]).join('/'),maxHp:34+rand(0,8)+(i?4:0),hp:null,status:null
 }));
 party.forEach(p=>p.hp=p.maxHp);
 return {kind:'trainer',name:arch.name,sprite:arch.sprite,party};
}
function generateForestEncounters(){
 const count=rand(3,6),out=[];
 for(let i=0;i<count;i++){
  if(Math.random()<0.40)out.push(makeBugTrainerEncounter());
  else{
   let c=FOREST_POOL.filter(x=>!x.rare||Math.random()<0.18);
   if(!c.length)c=FOREST_POOL.filter(x=>!x.rare);
   const p=choice(c);out.push({kind:'wild',name:p.name,id:p.id,lv:rand(p.lv[0],p.lv[1])});
  }
 }
 return out;
}
function makeTrainerEncounter(){
 const arch=choice(TRAINER_ARCHETYPES);
 const count=Math.random()<0.28?2:1;
 let pool=shuffle(TRAINER_POKEMON);
 if(Math.random()<0.22){
   const starter=choice(TRAINER_POKEMON.filter(p=>p.starter));
   pool=[starter,...pool.filter(p=>p.id!==starter.id)];
 }
 const party=pool.slice(0,count).map((p,i)=>({
   name:p.name,id:p.id,level:rand(3,5)+(i?1:0),
   type:(POKEMON_TYPES[p.id]||p.types||[]).join('/'),
   maxHp:Math.max(28,32+rand(0,7)+(i?3:0)),hp:null
 }));
 party.forEach(p=>p.hp=p.maxHp);
 return {kind:'trainer',name:arch.name,sprite:arch.sprite,party};
}

function generateRoute1Encounters(){
 const count=rand(2,5);
 const out=[];
 for(let i=0;i<count;i++){
   if(Math.random()<0.34) out.push(makeTrainerEncounter());
   else {
     let candidates=ROUTE1_POOL.filter(x=>!x.rare || Math.random()<0.22);
     const p=choice(candidates);
     out.push({kind:'wild',name:p.name,id:p.id,lv:rand(p.lv[0],p.lv[1])});
   }
 }
 return out;
}

function spendExploreEnergy(cost,where){
 checkTravelCompletion();if(isTravelling()){alert('No podés explorar mientras viajás.');return false;}
 if(workBlocked('explorar'))return false;
 recoverEnergy();
 if(S.trainer.energy<cost){
   alert(`Necesitás ${cost} de energía para explorar ${where}.`);
   return false;
 }
 S.trainer.energy-=cost;
 S.lastEnergyTick=Date.now();
 S.history.push(`Exploraste ${where}: -${cost} energía.`);registerMissionEvent('explores',1);S.battleStats.explores=(S.battleStats.explores||0)+1;maybeExploreFind(where);
 save();hud();
 return true;
}

function route1(){
 if(!spendExploreEnergy(2,'Ruta 1'))return;
 const list=generateRoute1Encounters();
 zonePage('Ruta 1',list,true);
}

const FOREST_RANGER_ART="assets/characters/pallet_npc_2.png";
const VIRIDIAN_NPCS={
 scout:[
  '«Si vas al Bosque Verde, llevá alguna Poción. Los Cazabichos pueden encadenar varios combates.»',
  '«El bosque está al norte. En la hierba alta nunca sabés qué puede salir.»',
  '«No todos los entrenadores de una ruta aparecen cada vez que explorás.»'
 ],
 resident:[
  '«Ciudad Verde parece tranquila, pero por acá pasan entrenadores de toda la región.»',
  '«El Centro Pokémon es el mejor lugar para recuperarte antes de seguir viaje.»',
  '«Dicen que el gimnasio de la ciudad no recibe a cualquiera todavía.»'
 ],
 rookie:[
  '«Estoy entrenando antes de entrar al bosque. No quiero que un Weedle me arruine el día.»',
  '«Cambiar de Pokémon durante un duelo puede ser una ventaja enorme.»',
  '«Yo revisaría bien los tipos antes de desafiar a un entrenador.»'
 ]
};
function viridianNpc(key,title){
 const lines=VIRIDIAN_NPCS[key]||['«Buen viaje.»'];
 const text=npcVariant(`viridian_${key}`,lines);
 openModal(`<div class="npc-modal-card"><h3>💬 ${title}</h3><p>${text}</p><button class="primary" onclick="closeModal()">Continuar</button></div>`);
}

function viridian(){content.innerHTML=`<div class="card"><h3>❤️ Centro Pokémon de Ciudad Verde</h3><p>Acá podés recuperar por completo a tu equipo y acceder al sistema de almacenamiento.</p>
<button class="primary" onclick="startPokemonCenterHeal()">❤️ Curar equipo</button>
<button class="primary" onclick="pcStorage()">💻 Usar PC</button>
<button class="primary" onclick="go('shop')">🏪 Tienda Pokémon</button></div>`}
function forest(){
 content.innerHTML=`<div class="tabs"><button class="tab">🌲 Bosque Verde</button><button class="tab" onclick="forestExplore()">Encuentros</button></div>
 <div class="card"><h3>Mapa del Bosque Verde</h3>
 <p>Explorá claros, hierba alta y caminos. Los puntos del mapa son interactivos.</p>
 ${S.repelSteps>0?`<div class="forest-status">🧴 Repelente activo: ${S.repelSteps} exploraciones restantes. Habrá muchos menos Pokémon salvajes.</div>`:''}
 <div class="forest-toolbar">
  <button class="primary" onclick="forestExplore()">🌿 Explorar hierba · ⚡3</button>
  <button class="primary" onclick="forestTrainerSpot()">🪲 Buscar Cazabichos</button>
  <button class="primary" onclick="forestLoot()">🎁 Revisar objeto perdido</button>
  <button class="primary" ${(S.bag.repel||0)<=0||S.repelSteps>0?'disabled':''} onclick="useRepel()">🧴 Usar Repelente (${S.bag.repel||0})</button>
 </div>
 ${forestMapHTML()}
 <div class="mapnote">Bosque Verde · algunos encuentros cambian cada vez que explorás.</div>
 </div>`;
}
function forestExplore(){
 if(!spendExploreEnergy(3,'Bosque Verde'))return;
 let list=generateForestEncounters();
 if(S.repelSteps>0){
  S.repelSteps--;
  const trainers=list.filter(e=>e.kind==='trainer');
  const wild=list.filter(e=>e.kind!=='trainer');
  list=[...trainers,...wild.slice(0,Math.random()<.35?1:0)];
  if(!list.length)list=[makeBugTrainerEncounter()];
  S.history.push(`El Repelente redujo los encuentros salvajes. Quedan ${S.repelSteps} exploraciones.`);
  save();hud();
 }
 zonePage('Bosque Verde',list,true);
}
function forestTrainerSpot(){
 const e=makeBugTrainerEncounter();
 zonePage('Bosque Verde',[e],false);
}
function forestLoot(){
 const today=new Date().toDateString();
 if(S.forestLootDate===today){alert('Ya revisaste los objetos perdidos del Bosque Verde hoy.');return}
 const pool=[['pokeball','Poké Ball'],['potion','Poción'],['repel','Repelente']];
 const pick=choice(pool),extra=Math.min(.45,Math.max(0,(effectiveStat('Exploracion')-5)*.025+gearEffect('explorePct')/100)),qty=Math.random()<extra?2:1;
 S.bag[pick[0]]=(S.bag[pick[0]]||0)+qty;S.forestLootDate=today;
 S.history.push(`Encontraste ${qty} ${pick[1]} entre la hierba del Bosque Verde.`);
 save();hud();alert(`Encontraste: ${pick[1]} x${qty}`);forest();
}

function zonePage(name,list,explored=false){
 content.innerHTML=`<div class="tabs"><button class="tab">${name}</button><button class="tab">Encuentros</button></div>
 <div class="card">
 ${explored?`<div class="explore-head"><div><b>Exploración generada</b><br><small>Los encuentros cambian cada vez que recorrés la zona.</small></div><div class="explore-cost">⚡ ${name==='Bosque Verde'?3:2} explorar</div></div>`:''}
 <h3>Encuentros disponibles</h3>
 <div class="encounters">${list.map((e,i)=>{
   if(e.kind==='trainer'){
     const first=e.party[0];
     return `<div class="enemy encounter-trainer">
       <b>${e.name}</b>
       <img class="trainer-face" src="${TRAINER_SPRITES[e.sprite]}">
       <div class="encounter-meta">${e.party.length} Pokémon · ${e.party.length===2?'duelo largo':'duelo simple'}</div>
       <div class="mini-poke"><img src="${spr(first.id)}"><div><b>${first.name} Nv.${first.level}</b>${typeBadges(first.id)}</div></div>
       ${e.party.length>1?`<small>+ 1 Pokémon oculto</small>`:''}
       <button class="primary" onclick='startTrainerBattle(${JSON.stringify(e)},${JSON.stringify(name)})'>Combatir</button>
     </div>`;
   }
   return `<div class="enemy">
     <b>${e.name}</b>
     ${e.id?`<img src="${spr(e.id)}"><div class="poke-type-strip strip-${primaryTypeClass(e.id)}"></div>${typeBadges(e.id)}`:`<div style="height:92px;color:white;font-size:55px;display:grid;place-items:center;border-radius:8px">?</div>`}
     <p>Nv. ${e.lv}</p>
     <button class="primary" ${e.name==='???'?'disabled':''} onclick="fight('${name}','${e.name}',${e.id||0},${e.lv==='?'?99:e.lv})">Combatir</button>
   </div>`;
 }).join('')}</div>
 <p class="muted">${name==='Ruta 1'?'Explorar cuesta 2 de energía. Los únicos salvajes aquí son Pidgey y Rattata; también pueden aparecer entrenadores.':name==='Bosque Verde'?'Explorar cuesta 3 de energía. Cambian los Pokémon y cazabichos en cada visita.':'Cada combate consume 6 de energía.'}</p>
 </div>`;
}

/* ---------------- MOVIMIENTOS ---------------- */
const MOVE_DATA={
 'Placaje':{damage:true,power:16},'Arañazo':{damage:true,power:16},'Ascuas':{damage:true,power:20,status:'burn',statusChance:.10},
 'Látigo Cepa':{damage:true,power:21},'Pistola Agua':{damage:true,power:21},'Ataque Rápido':{damage:true,power:18},
 'Tornado':{damage:true,power:19},'Picotazo Venenoso':{damage:true,power:18,status:'poison',statusChance:.30},'Impactrueno':{damage:true,power:21,status:'paralyze',statusChance:.10},
 'Mordisco':{damage:true,power:19},'Polvo Veneno':{damage:false,status:'poison',statusChance:.85,statusText:'puede envenenar al rival'},
 'Gruñido':{damage:false,status:'baja el Ataque del rival'},'Látigo':{damage:false,status:'reduce la Defensa del rival'},
 'Ataque Arena':{damage:false,status:'reduce la precisión del rival'},'Disparo Demora':{damage:false,status:'reduce la Velocidad del rival'},'Fortaleza':{damage:false,status:'aumenta la Defensa del usuario'}
};
const MOVE_POOLS={
 Bulbasaur:['Placaje','Gruñido','Látigo Cepa','Polvo Veneno'],Charmander:['Arañazo','Gruñido','Ascuas'],
 Squirtle:['Placaje','Látigo','Pistola Agua'],Pidgey:['Placaje','Tornado','Ataque Arena'],
 Rattata:['Placaje','Látigo','Ataque Rápido','Mordisco'],Caterpie:['Placaje','Disparo Demora'],
 Weedle:['Picotazo Venenoso','Disparo Demora'],Metapod:['Fortaleza'],Kakuna:['Fortaleza','Picotazo Venenoso'],Pidgeotto:['Placaje','Tornado','Ataque Arena','Ataque Rápido'],Pikachu:['Impactrueno','Gruñido','Látigo']
};
function pickMove(name,side='foe'){
 const pool=MOVE_POOLS[name]||['Placaje'];
 const mem=currentBattle?.moveMemory?.[side]||[];
 const last2=mem.slice(-2);
 let allowed=[...pool];

 // Evitar que un Pokémon encadene tres movimientos sin daño.
 if(last2.length===2 && last2.every(m=>!moveInfo(m).damage)){
   const damaging=allowed.filter(m=>moveInfo(m).damage);
   if(damaging.length)allowed=damaging;
 }

 // A medida que el duelo se alarga, favorecer ataques ofensivos.
 if(currentBattle && currentBattle.round>=3){
   const damaging=allowed.filter(m=>moveInfo(m).damage);
   if(damaging.length && Math.random()<0.72)allowed=damaging;
 }

 const picked=choice(allowed);
 if(currentBattle?.moveMemory){
   currentBattle.moveMemory[side].push(picked);
   if(currentBattle.moveMemory[side].length>4)currentBattle.moveMemory[side].shift();
 }
 return picked;
}
function moveInfo(name){return MOVE_DATA[name]||{damage:true,power:15}}
function moveSentence(user,target,move){
 const m=moveInfo(move);
 if(m.damage)return `${user} usa ${move} contra ${target}.`;
 if(m.statusText)return `${user} usa ${move}: ${m.statusText}.`;
 const texts={poison:'intenta envenenar al rival',burn:'intenta quemar al rival',paralyze:'intenta paralizar al rival'};
 return `${user} usa ${move}: ${texts[m.status]||m.status||'movimiento de estado'}.`;
}
function typeEdge(attacker,defender){
 const a=(typesFor(attacker)[0]||'Normal'),d=(typesFor(defender)[0]||'Normal');
 const good={Fuego:['Planta','Bicho'],Agua:['Fuego','Roca'],Planta:['Agua','Roca'],Eléctrico:['Agua','Volador'],Volador:['Bicho','Planta'],Bicho:['Planta']};
 const bad={Fuego:['Agua'],Agua:['Planta'],Planta:['Fuego'],Eléctrico:['Tierra']};
 if((good[a]||[]).includes(d))return 1.13;
 if((bad[a]||[]).includes(d))return .9;
 return 1;
}
function roundDamageMultiplier(){
 if(!currentBattle)return 1;
 const r=Math.max(1,currentBattle.round||1);
 if(r===1)return 1;
 if(r===2)return 1.10;
 if(r===3)return 1.20;
 return 1.30;
}
function damageAmount(move,attacker,defender){
 const m=moveInfo(move);if(!m.damage)return 0;
 const raw=m.power*(.82+Math.random()*.36)*typeEdge(attacker,defender)/2.05;
 return Math.max(3,Math.round(raw*roundDamageMultiplier()*(1+gearEffect('damagePct')/100)));
}

/* ---------------- COMBATE PERSISTENTE ---------------- */
let currentBattle=null;

function healthyTeam(){return S.team.filter(m=>(m.hp??m.maxHp)>0)}
function ensurePokemonHp(m){
 if(!m.maxHp)m.maxHp=Math.max(30,35+(m.level||5)*2);
 if(m.hp==null)m.hp=m.maxHp;if(m.status===undefined)m.status=null;
}
function chooseActivePokemon(){
 S.team.forEach(ensurePokemonHp);
 return S.team.find(m=>m.hp>0)||null;
}
function battleChance(ally,foe){
 const base=.51;
 const trainer=(effectiveStat('Estrategia')+effectiveStat('Tecnica'))/180;
 const level=((ally.level||5)-(foe.level||3))*.025;
 const hp=(ally.hp/ally.maxHp-.5)*.12;
 const edge=(typeEdge(ally,foe)-1)*.45;
 return Math.max(.22,Math.min(.82,base+trainer+level+hp+edge));
}

function fight(zone,n,id,lv){
 const foe={name:n,id,level:lv,type:(POKEMON_TYPES[id]||[]).join('/'),maxHp:Math.max(28,30+lv*3),hp:Math.max(28,30+lv*3),status:null};
 startBattle({zone,wild:id>0&&!String(n).toLowerCase().includes('entrenador'),trainer:null,enemyParty:[foe]});
}

function startTrainerBattle(encounter,zone='Ruta 1'){
 startBattle({zone,wild:false,trainer:encounter,enemyParty:encounter.party.map(p=>({...p}))});
}

function startBattle(cfg){if(S.camp?.rest){alert('No podés combatir mientras estás descansando en el campamento.');return;}
 if(battleRunning)return;
 checkTravelCompletion();if(isTravelling()){alert('No podés combatir mientras viajás.');return;}
 if(workBlocked('combatir'))return;
 ensureDaily();recoverEnergy();
 const ally=chooseActivePokemon();
 if(!ally){alert('Todos tus Pokémon están debilitados. Visitá un Centro Pokémon o descansa un momento.');return}

 const battleCost=cfg.wild?4:5;
 if(S.trainer.energy<battleCost){alert(`Necesitás ${battleCost} de energía para este combate.`);return}

 S.trainer.energy-=battleCost;
 S.daily.battles++;
 S.lastEnergyTick=Date.now();
 S.battleStats.battles++;
 battleRunning=true;

 currentBattle={
   zone:cfg.zone,wild:cfg.wild,trainer:cfg.trainer,enemyParty:cfg.enemyParty,
   enemyIndex:0,activeIndex:S.team.indexOf(ally),elapsed:0,interval:null,
   captureUsed:false,round:0,totalSeconds:20,
   moveMemory:{ally:[],foe:[]}
 ,participants:[S.team.indexOf(ally)]};
 beginBattleRound();
}

function beginBattleRound(){
 const b=currentBattle;
 const ally=S.team[b.activeIndex];ensurePokemonHp(ally);
 const foe=b.enemyParty[b.enemyIndex];ensurePokemonHp(foe);
 if(ally.hp<=0){
   const idx=S.team.findIndex(m=>{ensurePokemonHp(m);return m.hp>0});
   if(idx<0){finishWholeBattle(false);return}
   b.activeIndex=idx;
 }
 b.elapsed=0;b.round++;
 const currentAlly=S.team[b.activeIndex];
 const stageWin=Math.random()<battleChance(currentAlly,foe);
 b.stageWin=stageWin; // sólo orientación interna; ya no fuerza el resultado del tramo
 b.captureUsed=false;

 content.innerHTML=`<div class="battle-screen">
  <div class="battle-head">
   <div><b>${b.zone}</b><br><small>${b.trainer?b.trainer.name:(b.wild?'Pokémon salvaje':'Duelo')}</small></div>
   <div class="battle-timer" id="battleTimer">20s</div>
  </div>
  ${b.trainer?`<div class="trainer-opponent"><img class="trainer-face" src="${TRAINER_SPRITES[b.trainer.sprite]}"><div><b>${b.trainer.name}</b><div class="party-dots">${b.enemyParty.map((_,i)=>`<span class="party-dot ${i<b.enemyIndex?'done':i===b.enemyIndex?'active':''}"></span>`).join('')}</div><small>Pokémon ${b.enemyIndex+1}/${b.enemyParty.length}</small></div></div>`:''}
  <div class="round-banner">Ronda ${b.round} · 20 s
  ${b.round===1?'· ritmo normal':b.round===2?'· +10% daño':b.round===3?'· +20% daño':b.round===4?'· +30% daño + desgaste':'· combate prolongado: +30% daño + desgaste'}</div>
  <div class="battle-stage">
   <div class="battler">
    <img id="allySprite" src="${spr(currentAlly.id)}"><b id="allyName">${currentAlly.name}</b><span id="allyStatus">${statusBadge(currentAlly)}</span><small id="allyLevel">Nv. ${currentAlly.level}</small>
    <div class="poke-type-strip strip-${primaryTypeClass(currentAlly)}"></div>${typeBadges(currentAlly)}
    <div class="hpwrap"><div class="hptext"><span>PS</span><span id="allyHpText">${currentAlly.hp}/${currentAlly.maxHp}</span></div><div class="hpbar" id="allyHpBar"><i style="width:${currentAlly.hp/currentAlly.maxHp*100}%"></i></div></div>
    ${pokemonExpBar(currentAlly,true)}
   </div>
   <div class="vs">VS</div>
   <div class="battler">
    <img src="${spr(foe.id)}"><b>${foe.name}</b><span id="foeStatus">${statusBadge(foe)}</span><small>Nv. ${foe.level}</small>
    <div class="poke-type-strip strip-${primaryTypeClass(foe)}"></div>${typeBadges(foe)}
    <div class="hpwrap"><div class="hptext"><span>PS</span><span id="foeHpText">${foe.hp}/${foe.maxHp}</span></div><div class="hpbar" id="foeHpBar"><i style="width:${foe.hp/foe.maxHp*100}%"></i></div></div>
   </div>
  </div>
  <div class="chronicle" id="chronicle"><div class="line neutral">El combate continúa con los PS reales de tu equipo.</div></div>
  <div class="battle-controls">
   <button class="primary" onclick="toggleSwitchPanel()">🔄 Cambiar Pokémon</button>
   <button class="primary potion" onclick="useBattlePotion()" ${(S.bag.potion||0)<=0?'disabled':''}>🧪 Poción (${S.bag.potion||0})</button>
   ${b.wild?`<button class="primary" id="captureBtn" onclick="throwPokeBall()" disabled>🔴 Lanzar Poké Ball</button>
   <button class="primary retreat" onclick="retreatBattle()">🏃 Retirada</button>`:''}
  </div>
  <div class="battle-item-note">La Poción cura al Pokémon activo sin detener el reloj. Retirada sólo está disponible contra Pokémon salvajes.</div>
  <div class="switch-panel" id="switchPanel"><b>Elegí otro Pokémon</b><div class="switch-list">${switchChoicesHTML()}</div></div>
  <div id="battleResult"></div>
 </div>`;
 hud();save();
 runRoundTicker();
}

function switchChoicesHTML(){
 return S.team.map((m,i)=>{
   ensurePokemonHp(m);
   return `<button class="switch-mon" ${m.hp<=0||i===currentBattle.activeIndex?'disabled':''} onclick="switchPokemon(${i})">
    <img src="${spr(m.id)}">
    <div class="switch-info">
      <b class="switch-name">${m.name}</b>
      <span class="switch-hp">PS ${m.hp}/${m.maxHp}</span>
      <div class="switch-types">${typeBadges(m)}</div>
    </div>
   </button>`;
 }).join('');
}

function useBattlePotion(){
 if(!currentBattle)return;
 const mon=S.team[currentBattle.activeIndex];
 ensurePokemonHp(mon);

 if((S.bag.potion||0)<=0){
   alert('No te quedan Pociones.');
   return;
 }
 if(mon.hp<=0){
   alert('No podés usar una Poción sobre un Pokémon debilitado durante este combate.');
   return;
 }
 if(mon.hp>=mon.maxHp){
   alert(`${mon.name} ya tiene todos sus PS.`);
   return;
 }

 const healAmount=Math.max(12,Math.round(mon.maxHp*.42));
 const before=mon.hp;
 mon.hp=Math.min(mon.maxHp,mon.hp+healAmount);
 const healed=mon.hp-before;
 S.bag.potion--;registerMissionEvent('potions',1);

 const chron=document.getElementById('chronicle');
 if(chron){
   const d=document.createElement('div');
   d.className='line status-note';
   d.textContent=`Usás una Poción sobre ${mon.name}. Recupera ${healed} PS.`;
   chron.appendChild(d);
   chron.scrollTop=chron.scrollHeight;
 }

 updateBattleBars();
 save();hud();

 // refrescar contador del botón sin reconstruir la pantalla
 const btn=[...document.querySelectorAll('.battle-controls button')].find(x=>x.textContent.includes('Poción'));
 if(btn){
   btn.textContent=`🧪 Poción (${S.bag.potion||0})`;
   btn.disabled=(S.bag.potion||0)<=0;
 }
}

function retreatBattle(){
 if(!currentBattle || !currentBattle.wild)return;

 if(currentBattle.interval){
   clearInterval(currentBattle.interval);
   currentBattle.interval=null;
 }

 const b=currentBattle;
 const ally=S.team[b.activeIndex];
 ensurePokemonHp(ally);

 S.history.push(`Te retiraste de un combate salvaje en ${b.zone}.`);
 save();hud();

 const chron=document.getElementById('chronicle');
 if(chron){
   const d=document.createElement('div');
   d.className='line neutral';
   d.innerHTML=`<b>Retirada.</b> Conservás los PS actuales de tu equipo.`;
   chron.appendChild(d);
   chron.scrollTop=chron.scrollHeight;
 }

 const timer=document.getElementById('battleTimer');
 if(timer)timer.textContent='FIN';

 const res=document.getElementById('battleResult');
 if(res){
   res.innerHTML=`<div class="battle-result">
     <h3>🏃 Te retiraste</h3>
     <div>No recibís dinero, EXP ni Prestigio. ${ally.name} queda con <b>${ally.hp}/${ally.maxHp} PS</b>.</div>${pokemonExpBar(ally,true)}
     <div class="result-actions">
       <button class="primary" onclick="continueExploring('${b.zone}')">🌿 Seguir explorando</button>
       <button class="primary" onclick="returnToPortal()">🏘️ Volver al Portal</button>
       <button class="primary" onclick="pokemonTeamPage()">⚡ Ver equipo</button>
     </div>
   </div>`;
 }

 battleRunning=false;
 currentBattle=null;
}

function toggleSwitchPanel(){
 const p=document.getElementById('switchPanel');if(p)p.classList.toggle('show');
}
function switchPokemon(idx){
 if(!currentBattle)return;
 const m=S.team[idx];ensurePokemonHp(m);
 if(m.hp<=0||idx===currentBattle.activeIndex)return;
 currentBattle.activeIndex=idx;
 const c=document.getElementById('chronicle');
 if(c){const d=document.createElement('div');d.className='line neutral';d.textContent=`Retirás a tu Pokémon y enviás a ${m.name}.`;c.appendChild(d);c.scrollTop=c.scrollHeight}
 refreshBattleAlly();
 toggleSwitchPanel();
}
function refreshBattleAlly(){
 const m=S.team[currentBattle.activeIndex];ensurePokemonHp(m);
 const sp=document.getElementById('allySprite'),nm=document.getElementById('allyName'),lv=document.getElementById('allyLevel');
 if(sp)sp.src=spr(m.id);if(nm)nm.textContent=m.name;if(lv)lv.textContent='Nv. '+m.level;
 updateBattleBars();
}


function refreshStatusUI(){
 if(!currentBattle)return;
 const a=S.team[currentBattle.activeIndex],f=currentBattle.enemyParty[currentBattle.enemyIndex];
 const ae=document.getElementById('allyStatus'),fe=document.getElementById('foeStatus');
 if(ae)ae.innerHTML=statusBadge(a);
 if(fe)fe.innerHTML=statusBadge(f);
}
function maybeApplyStatus(move,target,chron){
 const info=moveInfo(move);
 if(!info.status||!STATUS_META[info.status])return;
 if(applyStatus(target,info.status,info.statusChance??1)){
  if(chron){const d=document.createElement('div');d.className='line status-note';d.textContent=`${target.name} queda ${STATUS_META[info.status].label}.`;chron.appendChild(d);chron.scrollTop=chron.scrollHeight}
  refreshStatusUI();
 }
}

function runRoundTicker(){
 const b=currentBattle,foe=b.enemyParty[b.enemyIndex];
 if(b.interval)clearInterval(b.interval);
 b.interval=setInterval(()=>{
   b.elapsed++;
   const ally=S.team[b.activeIndex];ensurePokemonHp(ally);
   const timer=document.getElementById('battleTimer');if(timer)timer.textContent=Math.max(0,20-b.elapsed)+'s';
   const chron=document.getElementById('chronicle');

   if([5,9,13,17].includes(b.elapsed)){
     applyResidualStatus(ally,chron);applyResidualStatus(foe,chron);updateBattleBars();
       if(b.round>=4){
         applyRoundFatigue(ally,chron);applyRoundFatigue(foe,chron);updateBattleBars();
         if(ally.hp<=0||foe.hp<=0){setTimeout(resolveRound,550);return}
       }
     if(ally.hp<=0||foe.hp<=0){clearInterval(b.interval);b.interval=null;setTimeout(resolveRound,450);return}
   }
   if([3,7,11,15].includes(b.elapsed)){
     const enemyTurn=(b.elapsed===3||b.elapsed===11);
     const user=enemyTurn?foe:ally,target=enemyTurn?ally:foe;
     const gate=statusCanMove(user);
     if(!gate.ok){
      if(chron){const d=document.createElement('div');d.className='line status-note';d.textContent=gate.msg;chron.appendChild(d);chron.scrollTop=chron.scrollHeight}
      updateBattleBars();
      return;
     }
     const move=pickMove(user.name,enemyTurn?'foe':'ally'),info=moveInfo(move);
     let dmg=0;
     if(info.damage){
       dmg=damageAmount(move,user,target);
       target.hp=Math.max(0,target.hp-dmg);
     }
     maybeApplyStatus(move,target,chron);
     if(chron){
       const d=document.createElement('div');
       d.className='line '+(enemyTurn?'bad':'good');
       d.textContent=moveSentence(user.name,target.name,move)+(info.damage?` ${target.name} pierde ${dmg} PS.`:'');
       chron.appendChild(d);chron.scrollTop=chron.scrollHeight;
     }
     updateBattleBars();
     if(target===foe)updateCaptureButton();
     if(ally.hp<=0||foe.hp<=0){
       clearInterval(b.interval);b.interval=null;
       setTimeout(resolveRound,550);return;
     }
   }

   if(b.elapsed>=20){
     clearInterval(b.interval);b.interval=null;
     const allyNow=S.team[b.activeIndex];
     ensurePokemonHp(allyNow);ensurePokemonHp(foe);

     // Si nadie cayó, los 20 segundos sólo marcan el fin de un tramo narrativo.
     // El combate continúa con los PS y estados actuales, sin forzar un ganador.
     if(allyNow.hp>0 && foe.hp>0){
       if(chron){
         const d=document.createElement('div');
         d.className='line neutral';
         d.textContent=`La ronda termina sin vencedor. ${allyNow.name} y ${foe.name} continúan combatiendo.`;
         chron.appendChild(d);
         chron.scrollTop=chron.scrollHeight;
       }
       setTimeout(beginBattleRound,900);
       return;
     }
     resolveRound();
   }
 },1000);
}

function updateBattleBars(){
 if(!currentBattle)return;
 const ally=S.team[currentBattle.activeIndex],foe=currentBattle.enemyParty[currentBattle.enemyIndex];
 ensurePokemonHp(ally);ensurePokemonHp(foe);
 const vals=[['ally',ally],['foe',foe]];
 vals.forEach(([w,m])=>{
   const pct=Math.max(0,m.hp/m.maxHp*100);
   const i=document.querySelector(`#${w}HpBar i`),txt=document.getElementById(`${w}HpText`),bar=document.getElementById(`${w}HpBar`);
   if(i)i.style.width=pct+'%';if(txt)txt.textContent=`${m.hp}/${m.maxHp}`;
   if(bar)bar.classList.toggle('low',pct<=30);
 });
 hud();save();
}

function resolveRound(){
 const b=currentBattle,foe=b.enemyParty[b.enemyIndex],ally=S.team[b.activeIndex];
 ensurePokemonHp(ally);ensurePokemonHp(foe);

 if(foe.hp<=0){
   if(b.enemyIndex<b.enemyParty.length-1){
     b.enemyIndex++;
     const c=document.getElementById('chronicle');
     if(c){const d=document.createElement('div');d.className='line good';d.innerHTML=`<b>${foe.name} fue derrotado.</b> ${b.trainer.name} prepara su siguiente Pokémon. Se añaden 20 segundos.`;c.appendChild(d)}
     save();
     setTimeout(beginBattleRound,1500);
   }else{
     finishWholeBattle(true);
   }
   return;
 }

 if(ally.hp<=0){
   const another=S.team.findIndex((m,i)=>{ensurePokemonHp(m);return i!==b.activeIndex&&m.hp>0});
   if(another>=0){
     b.activeIndex=another;
     const c=document.getElementById('chronicle');
     if(c){const d=document.createElement('div');d.className='line bad';d.textContent=`${ally.name} quedó debilitado. Enviás automáticamente a ${S.team[another].name}.`;c.appendChild(d)}
     setTimeout(beginBattleRound,1500);
   }else finishWholeBattle(false);
   return;
 }

 // Si ambos siguen en pie, no se fuerza ningún KO.
 // Simplemente comienza otro tramo conservando PS, estado y Pokémon activos.
 if(ally.hp>0 && foe.hp>0){
   setTimeout(beginBattleRound,700);
   return;
 }
}

function finishWholeBattle(win){
 const b=currentBattle;
 const completedPalletTutorial=!!(b?.trainer?.tutorialId==='palletNovice');
 if(b.interval)clearInterval(b.interval);
 let cash=0,xpGain=0;
 if(win){
   S.progress.wins++;S.battleStats.wins++;S.battleStats.streak++;
   S.battleStats.bestStreak=Math.max(S.battleStats.bestStreak,S.battleStats.streak);
   registerMissionEvent('wins',1);
   if(b.trainer){registerMissionEvent('trainerWins',1);S.battleStats.trainerWins=(S.battleStats.trainerWins||0)+1;}else{registerMissionEvent('wildWins',1);}
   S.missionCycle.stats.streak=(S.missionCycle.stats.streak||0)+1;
   registerMissionEvent('streak',0);
   if(S.team.every(p=>{ensurePokemonHp(p);return p.hp>0}))registerMissionEvent('cleanWins',1);
   const levels=b.enemyParty.reduce((a,p)=>a+(p.level||3),0);
   cash=90+levels*32+(b.trainer?80:0);xpGain=22+levels*7;
   S.trainer.money+=cash;S.battleStats.moneyWon+=cash;S.trainer.prestige+=b.trainer?4:2;
   S.history.push(`Ganaste en ${b.zone}: +₽${cash}.`);
   awardBattlePokemonExp(b,foe,document.getElementById('chronicle'));
   addXP(xpGain);
 }else{
   S.battleStats.losses++;S.battleStats.streak=0;if(S.missionCycle)S.missionCycle.stats.streak=0;
   S.history.push(`Perdiste un combate en ${b.zone}.`);
 }
 if(completedPalletTutorial){S.palletNoviceTutorialDone=true;S.history.push('Completaste el tutorial de combate del Entrenador novato en Pueblo Paleta.');}
 save();hud();
 const res=document.getElementById('battleResult');
 if(res)res.innerHTML=`<div class="battle-result ${win?'win':'loss'}">
  <h3>${win?'🏆 ¡Victoria!':'💥 Derrota'}</h3>
  <div>${win?`Ganaste <b>₽${cash}</b>, <b>${xpGain} EXP</b> y prestigio.`:'Tus Pokémon conservan exactamente los PS con los que terminaron el duelo.'}</div>
  <div class="result-actions">
   <button class="primary" onclick="continueExploring('${b.zone}')">🌿 Seguir explorando</button>
   <button class="primary" onclick="returnToPortal()">🏘️ Volver al Portal</button>
   <button class="primary" onclick="overview()">👥 Ver equipo</button>
  </div></div>`;
 const timer=document.getElementById('battleTimer');if(timer)timer.textContent='FIN';
 battleRunning=false;currentBattle=null;
}

function updateCaptureButton(){
 if(!currentBattle||!currentBattle.wild||currentBattle.captureUsed)return;
 const foe=currentBattle.enemyParty[currentBattle.enemyIndex];
 const btn=document.getElementById('captureBtn');if(!btn)return;
 btn.disabled=!(foe.hp>0 && foe.hp/foe.maxHp<=.35 && (S.bag.pokeball||0)>0);
}
function throwPokeBall(){
 if(!currentBattle||!currentBattle.wild||currentBattle.captureUsed)return;
 const foe=currentBattle.enemyParty[currentBattle.enemyIndex];
 if(foe.hp<=0||foe.hp/foe.maxHp>.35||(S.bag.pokeball||0)<=0)return;
 currentBattle.captureUsed=true;S.bag.pokeball--;save();
 const chance=Math.min(.90,(.34+(1-foe.hp/foe.maxHp)*.30+effectiveStat('Captura')*.025)*(1+gearEffect('capturePct')/100));
 const success=Math.random()<chance;
 const c=document.getElementById('chronicle');
 if(c){const d=document.createElement('div');d.className='line neutral';d.textContent=`Lanzás una Poké Ball hacia ${foe.name}...`;c.appendChild(d)}
 setTimeout(()=>{
  if(!currentBattle)return;
  if(success){
    if(currentBattle.interval)clearInterval(currentBattle.interval);
    const mon={name:foe.name,id:foe.id,type:typesFor(foe.id).join('/'),level:foe.level,xp:0,maxHp:foe.maxHp,hp:Math.max(1,foe.hp),status:foe.status||null};
    if(S.team.length<6)S.team.push(mon);else S.pc.push(mon);
    if(!S.caught.includes(foe.name))S.caught.push(foe.name);
    S.trainer.prestige++;registerMissionEvent('captures',1);S.history.push(`Capturaste a ${foe.name}.`);save();
    const res=document.getElementById('battleResult');
    if(res)res.innerHTML=`<div class="battle-result win"><h3>🔴 ¡${foe.name} capturado!</h3><div>Conserva ${mon.hp}/${mon.maxHp} PS.</div>
    <div class="result-actions"><button class="primary" onclick="continueExploring('${currentBattle.zone}')">🌿 Seguir explorando</button><button class="primary" onclick="returnToPortal()">🏘️ Volver</button></div></div>`;
    battleRunning=false;currentBattle=null;
  }else{
    currentBattle.captureUsed=false;
    if(c){const d=document.createElement('div');d.className='line bad';d.textContent=`${foe.name} escapó. Podrás volver a intentarlo si sigue debilitado.`;c.appendChild(d)}
    updateCaptureButton();
  }
 },1100);
}

function continueExploring(zone){
 if(zone==='Ruta 1')route1();
 else if(zone==='Bosque Verde')forest();
 else city();
}
function returnToPortal(){city();}
function pewter(){content.innerHTML=`<div class="card"><h3>🔒 Ciudad Plateada</h3><p>El camino todavía no está disponible. En un próximo parche, Brock y el primer gimnasio abrirán esta etapa del viaje.</p></div>`}
function heal(){S.team.forEach(x=>{ensurePokemonHp(x);x.hp=x.maxHp;x.status=null;});S.history.push('Tu equipo fue curado por completo en el Centro Pokémon.');save();hud();pokemonCenterPage()}
function teamHTML(){return `<div class="team">${S.team.map(m=>{ensurePokemonHp(m);return `<div class="mon"><img src="${spr(m.id)}"><b>${m.name}</b><small>Nv. ${m.level} · PS ${m.hp}/${m.maxHp}</small><div class="poke-type-strip strip-${primaryTypeClass(m)}"></div>${typeBadges(m)}</div>`}).join('')}</div>`}
function patch(){content.innerHTML=`<div class="card patch"><h3>Historial de parches</h3><b>v0.44.8 — Texto de equipo debilitado</b><br>• El aviso ya no indica descansar en casa: ahora dice «Visitá un Centro Pokémon o descansa un momento».<br><br><b>v0.44.8 — Combates reparados y Bosque Verde reorganizado</b><br>
• Reparado el bloqueo de todos los combates: una referencia incorrecta a «activeIndex» impedía iniciar tanto combates salvajes como duelos contra entrenadores.<br>
• El sistema vuelve a registrar correctamente al primer Pokémon participante usando el miembro activo real del equipo.<br>
• La salida hacia Ciudad Plateada fue movida al hotspot superior izquierdo, donde corresponde el camino norte del Bosque Verde.<br>
• El Guardabosques fue trasladado al antiguo punto del objeto perdido y ahora funciona como NPC completo.<br>
• El Guardabosques muestra sprite, diálogos variables, botón «Otro consejo» y botón «← Volver».<br>
• El objeto perdido fue recolocado en el antiguo hotspot de la salida a Ciudad Plateada y conserva su límite diario.<br>
• Se mantuvieron intactos los dos puntos de hierba, los encuentros con Cazabichos y la salida sur hacia Ciudad Verde.<br><br>
<b>v0.44.6 — Utilidades de prueba y navegación NPC</b><br>
• En Partida se agregó «💰 TEST: Restaurar dinero», que devuelve el saldo de pruebas a ₽5.000.<br>
• Profesor Oak ahora tiene botón «← Volver» como el resto de NPC de Pueblo Paleta.<br>
• Casa / Mamá ahora también tiene botón «← Volver» dentro de sus acciones.<br>
• Se conserva el botón superior de regreso en Casa para facilitar la navegación.<br><br>
<b>v0.44.5 — Hotfix de arranque + viajes alternativos</b><br>
• Reparado el crash de v0.44.4 causado por una inserción incorrecta dentro de los datos Base64 de un sprite.<br>
• La versión fue reconstruida desde v0.44.3 y validada sintácticamente antes de publicarse.<br>
• En Pueblo Paleta, la Entrenadora local fue reemplazada por el Entrenador novato.<br>
• El Entrenador novato ofrece un tutorial de combate la primera vez y, al terminar ese duelo, pasa a funcionar como NPC de consejos.<br>
• Los hotspots de viaje ahora abren una pantalla con dos métodos: Caminar o Hacemos dedo.<br>
• Caminar conserva el consumo de energía, la espera en segundos y la barra de progreso.<br>
• Hacemos dedo cobra dinero y traslada al jugador inmediatamente, sin barra de espera.<br>
• Tarifas iniciales: Paleta–Ruta 1 ₽120, Ruta 1–Ciudad Verde ₽160 y Ciudad Verde–Bosque Verde ₽240.<br>
• Los trayectos futuros pueden tener tarifas mayores según la distancia y la progresión.<br><br>
<b>v0.44.3 — Bosque Verde unificado y hotspots reparados</b><br>
• Al llegar al Bosque Verde ya no aparece la antigua pantalla provisional verde: se carga directamente el mapa ilustrado completo.<br>
• La vista Portal de la ciudad y la vista Explorar Bosque Verde utilizan ahora exactamente el mismo mapa y los mismos hotspots.<br>
• Se centralizó la lógica de los hotspots para evitar botones visuales que no ejecutaban correctamente su acción.<br>
• Los puntos de hierba abren exploraciones, los puntos de combate buscan Cazabichos y el objeto perdido conserva su límite diario.<br>
• El objeto perdido cambia a una marca de verificación cuando ya fue recogido ese día, dejando claro por qué no entrega otro premio.<br>
• Se añadió un hotspot funcional de Guardabosques con diálogos variables.<br>
• Se añadió al mapa la salida norte hacia Ciudad Plateada como contenido visible pero todavía bloqueado.<br>
• La salida sur vuelve a Ciudad Verde desde el propio mapa.<br>
• Se reforzó el área clickeable y la prioridad visual de todos los hotspots para mejorar su funcionamiento con mouse y pantallas táctiles.<br><br>
<b>v0.44.2 — Corrección de Ciudad Verde y NPC del mapa</b><br>
• «Pueblo Verde» pasa a llamarse correctamente «Ciudad Verde» en todo el juego.<br>
• Las partidas anteriores que estaban guardadas en Pueblo Verde se migran automáticamente a Ciudad Verde.<br>
• El indicador del Gimnasio fue retirado de la montaña y colocado sobre el edificio correspondiente en la zona superior derecha del mapa.<br>
• El Gimnasio de Ciudad Verde continúa bloqueado por progresión, pero ahora su hotspot coincide con el edificio real.<br>
• Se añadieron tres NPC interactivos sobre el mapa: Entrenador novato, Vecino de Ciudad Verde y Explorador de ruta.<br>
• Los NPC cuentan con diálogos variables y reutilizan el sistema de visitas/horarios incorporado anteriormente.<br>
• Se ajustó la descripción inferior del mapa para incluir Centro Pokémon, Tienda y Gimnasio.<br><br>
<b>v0.44.1 — Hotfix de arranque</b><br>
• Corregido un error de sintaxis que impedía montar la interfaz y dejaba visible únicamente el fondo del juego.<br>
• Corregida la lógica de victoria contra entrenador/salvaje usada por las misiones.<br>
• Corregida la función de curación del Centro Pokémon, que había conservado una parte del código anterior.<br>
• No cambia contenido ni balance respecto de v0.44; es una versión de reparación.<br><br>

<b>v0.44 — Mundo vivo, Centro Pokémon y Logros</b><br>
• Los Pokémon que suben de nivel o tienen una evolución/movimiento pendiente muestran ahora un signo «!» dorado visible en Equipo Pokémon y en el equipo lateral.<br>
• El aviso permanece hasta que el jugador revisa/resuelve la novedad correspondiente.<br>
• Explorar rutas puede encontrar dinero perdido, Poké Balls, Pociones o Repelentes. No se añadieron frutas ni equipables Pokémon al pool actual.<br>
• Los hallazgos son ocasionales y quedan registrados en Actividad.<br>
• Los Centros Pokémon pasan a una pantalla de servicio completa con Curación y acceso a la PC.<br>
• La curación del Centro tarda unos segundos y restaura PS además de eliminar todos los estados alterados.<br>
• Los Pokémon debilitados permanecen en 0 PS y no pueden seleccionarse para combatir hasta ser curados.<br>
• Mamá, Oak, el Vecino curioso y la Entrenadora local reciben diálogos variables según visitas, hora del día y parte del progreso del entrenador.<br>
• Nueva pestaña «Logros» junto a Hoja del entrenador, Equipo Pokémon y Estadísticas.<br>
• Se corrigió el estado visual de estas pestañas: sólo la sección activa queda resaltada.<br>
• Logros incorpora objetivos progresivos de victorias, capturas, exploración, entrenadores, Campamento y constancia diaria.<br>
• Los logros desbloquean títulos equipables para la identidad del jugador.<br>
• Nueva identidad de jugador: se puede elegir un nick y equipar un título desbloqueado.<br>
• Las tarjetas de Logros incluyen un espacio visual preparado para reemplazar el icono temporal por sprites personalizados más adelante.<br><br>

<b>v0.43 — Crecimiento Pokémon y regreso del desgaste por rounds</b><br>
• La EXP individual deja de ser sólo visual: los Pokémon que participan en una victoria reciben experiencia real.<br>
• Los entrenadores otorgan más EXP que los Pokémon salvajes de nivel equivalente.<br>
• Si participan varios Pokémon, la EXP se reparte entre quienes realmente entraron al combate.<br>
• Al completar la barra, el Pokémon sube de nivel, aumenta sus PS y puede encadenar más de una subida si obtuvo suficiente EXP.<br>
• Se añadió una primera tabla de movimientos aprendidos por nivel para los Pokémon iniciales y especies tempranas de Kanto.<br>
• Si el Pokémon ya conoce 4 movimientos, su ficha permite elegir cuál olvidar o rechazar el nuevo movimiento.<br>
• Primera versión de evoluciones por nivel: la ficha avisa cuando una especie está preparada para evolucionar y permite evolucionar o detener el proceso.<br>
• Detener una evolución no la cancela permanentemente: podrá volver a intentarse más adelante.<br>
• Regresa el desgaste de combates prolongados desde el round 4. Este desgaste sólo pertenece al combate actual y NO es una estadística persistente de Fatiga.<br>
• Round 4: +30% de daño y desgaste; rounds posteriores mantienen la presión para evitar combates eternos.<br>
• Se mantienen las misiones diarias/semanales y los estados alterados incorporados en v0.42.<br><br>

<b>v0.42 — Misiones diarias/semanales y estados alterados</b><br>
• La sección Misiones incorpora 3 objetivos diarios y 3 semanales además de las misiones de historia/Oak.<br>
• Las diarias se reinician automáticamente cada día a las 00:00 hora local; las semanales, cada lunes a las 00:00.<br>
• El conjunto de misiones queda fijado para cada período: recargar el archivo no permite regenerarlas.<br>
• Cada misión muestra progreso, recompensa y botón COBRAR al completarse.<br>
• Hay objetivos de victorias, exploración, capturas, entrenadores, zonas visitadas, Pociones, Campamento y rachas.<br>
• Las recompensas incluyen dinero, EXP de entrenador y, en ciertos desafíos, Prestigio.<br>
• Se amplió el sistema de estados persistentes: Envenenado, Quemado, Paralizado, Dormido y Congelado, cada uno con color propio.<br>
• Veneno y Quemadura causan daño periódico durante el combate; Parálisis, Sueño y Congelamiento pueden impedir actuar.<br>
• Polvo Veneno de Bulbasaur ahora aplica de verdad ENVENENADO con alta probabilidad.<br>
• Picotazo Venenoso puede envenenar e Impactrueno puede paralizar; Ascuas puede quemar.<br>
• Se eliminó el daño por «fatiga/desgaste» de combates largos: no existe un sistema de Fatiga.<br>
• Los objetos equipables de Pokémon siguen reservados para hallazgos/eventos futuros y no se venden en tiendas.<br><br>
<b>v0.41 — Lectura visual de PS y EXP</b><br>
• Equipo Pokémon usa ahora la misma barra visual de PS que aparece durante los combates.<br>
• Corregida la barra de EXP del Pokémon aliado en combate: aparece inmediatamente debajo de sus PS.<br>
• La columna derecha de Equipo muestra correctamente el círculo compacto de progreso de EXP, con espacio reservado para no encimar nombre, PS, sprite ni tipos.<br>
• Se mantiene el valor numérico de PS para lectura precisa junto con las barras visuales.<br><br>

<b>v0.40 — Experiencia individual de los Pokémon</b><br>
• Cada Pokémon del equipo registra ahora experiencia individual y la experiencia necesaria para alcanzar el siguiente nivel.<br>
• La pantalla Equipo Pokémon muestra una barra de EXP debajo de los PS de cada integrante.<br>
• Durante los combates, el Pokémon del jugador muestra también su barra de experiencia debajo de la barra de vida.<br>
• La columna derecha utiliza un círculo de progreso compacto junto a los PS para mostrar el porcentaje de EXP sin ocupar demasiado espacio.<br>
• El círculo fue diseñado con tamaño reducido para no superponerse con nombre, sprite, PS ni etiquetas de tipo.<br>
• Las partidas anteriores reciben automáticamente valores válidos de EXP para evitar incompatibilidades con Pokémon ya existentes.<br><br>

<b>v0.39 — Campamento / Base secreta</b><br>
• Nueva sección «Campamento» dentro del bloque Entrenador.<br>
• El entrenador puede montar una base temporal y descansar para recuperar energía.<br>
• Se añadieron cuatro descansos: 15 minutos, 1 hora, 3 horas y 6 horas.<br>
• Los descansos pueden cancelarse en cualquier momento, pero un descanso cancelado no entrega recuperación.<br>
• Mientras el entrenador está acampando puede revisar menús y equipo, pero no puede viajar ni combatir.<br>
• Cada tipo de descanso tiene un riesgo de incidente con Pokémon salvajes; un incidente puede hacer perder PS a uno de tus Pokémon.<br>
• Se añadió una tienda permanente de mejoras de campamento: Carpa liviana, Saco de dormir, Repelente de perímetro, Fogón portátil, Linterna y Kit avanzado.<br>
• Las mejoras pueden reducir tiempo de descanso, reducir el riesgo de ataques o aumentar la energía recuperada.<br>
• Las mejoras compradas quedan guardadas permanentemente en la partida.<br>
• La pantalla muestra los bonos totales activos de tiempo, seguridad y recuperación.<br><br>

<b>v0.38 — Tooltips de equipo y uso de Pociones corregidos</b><br>
• El tooltip de movimientos ya no depende únicamente del sprite del Pokémon.<br>
• Ahora aparece al pasar el mouse por cualquier parte de la tarjeta completa del Pokémon.<br>
• El globo se posiciona dentro de la tarjeta para evitar recortes y apariciones fuera del panel.<br>
• Se eliminó el sistema de arrastrar y soltar consumibles porque resultaba poco claro e inconsistente.<br>
• La Poción vuelve a utilizar un botón «Usar» dentro de la Mochila.<br>
• Al usar una Poción, si hay varios Pokémon heridos se abre una selección para elegir exactamente cuál querés curar.<br>
• Si sólo existe un Pokémon herido, se cura directamente sin mostrar una selección innecesaria.<br>
• La Poción no puede gastarse sobre un Pokémon con PS completos ni sobre uno debilitado.<br><br>

<b>v0.37 — Mochila Pokémon y movimientos interactivos</b><br>
• La Mochila se eliminó de la Hoja del entrenador y se trasladó debajo de Equipo Pokémon.<br>
• Poké Ball, Poción y Repelente aparecen ahora junto al equipo para concentrar en una sola pantalla todo lo relacionado con el cuidado de los Pokémon.<br>
• Los consumibles de la Mochila pueden arrastrarse sobre la tarjeta del Pokémon elegido.<br>
• Arrastrar una Poción cura al Pokémon seleccionado, descuenta una unidad y conserva sus PS reales.<br>
• La Poción no se consume si el Pokémon ya tiene todos los PS o está debilitado.<br>
• Poké Ball y Repelente no se gastan por error al soltarlos sobre un Pokémon; el juego informa dónde corresponde utilizarlos.<br>
• Al pasar el mouse por el sprite de cada Pokémon aparece un tooltip con sus movimientos conocidos.<br>
• Los movimientos muestran entre paréntesis su categoría: Físico, Especial o Estado.<br>
• Las tarjetas del equipo funcionan además como zonas de destino visuales para el sistema de arrastrar y soltar.<br><br>

<b>v0.36 — Tipografía limpia y globos de mapa corregidos</b><br>
• Se eliminó la tipografía pixel/retro de toda la interfaz.<br>
• Textos, botones, menús, estadísticas, tienda, combates y paneles utilizan ahora una fuente moderna y mucho más legible basada en Inter/Segoe UI.<br>
• El logotipo y los títulos principales conservan una serif elegante para mantener personalidad sin convertir toda la interfaz en texto retro.<br>
• Se reajustó tamaño, peso e interlineado de menús, botones y HUD.<br>
• Los globos de información de Pueblo Paleta, Ruta 1 y demás mapas locales ya no aparecen obligatoriamente hacia la derecha.<br>
• Los tooltips ahora se muestran centrados sobre cada punto, con ancho máximo, salto de línea y una pequeña flecha visual.<br>
• Los mapas permiten que los globos sobresalgan del borde sin ser recortados.<br>
• Los puntos situados cerca de los extremos izquierdo o derecho desplazan automáticamente el globo hacia el interior.<br><br>

<b>v0.35 — Fondo panorámico de Kanto</b><br>
• Se añadió una ilustración panorámica fija detrás de toda la interfaz, inspirada en la forma en que Gladiatus utiliza su Coliseo como escenario de fondo.<br>
• El fondo ocupa toda la ventana y permanece detrás de las tres columnas principales.<br>
• Se añadió un oscurecido suave para que el paisaje no compita con botones, textos ni paneles.<br>
• Las barras y columnas laterales reciben transparencia y una sombra ligera para integrarse mejor con el escenario.<br>
• En escritorio se dejó más aire lateral para que puedan verse árboles, montañas y paisaje a ambos lados del juego.<br>
• Los mapas interactivos y las mecánicas no fueron modificados.<br>
• En pantallas pequeñas el fondo deja de estar fijo para evitar problemas de rendimiento y scroll.<br><br>

<b>v0.34 — Nueva identidad tipográfica retro</b><br>
• Toda la interfaz adopta una nueva tipografía pixel/retro inspirada en la estética de los RPG clásicos de Pokémon.<br>
• Se utiliza Pixelify Sans para conservar el aspecto de videojuego sin sacrificar legibilidad en crónicas, diálogos y descripciones largas.<br>
• Botones, navegación, pestañas, estadísticas, tienda, combates, diálogos y paneles utilizan ahora una identidad tipográfica unificada.<br>
• Los botones y títulos ganan mayor peso visual para acercarse al aspecto de interfaces Game Boy/GBA.<br>
• Se ajustó el interlineado de crónicas y diálogos para que la fuente pixel no amontone el texto.<br>
• Si el dispositivo no puede cargar la fuente web, el juego utiliza automáticamente una fuente monoespaciada de respaldo y continúa funcionando.<br><br>

<b>v0.33 — Boutique rotativa y equipamiento con efectos</b><br>
• Boutique con 12 objetos por rotación y renovación automática cada 6 horas reales.<br>
• La rotación queda guardada: recargar el juego no cambia gratuitamente el escaparate.<br>
• Los objetos se adaptan al nivel mediante tiers Sencillo, Entrenador, Experto, Avanzado y Élite.<br>
• Un mismo sprite puede aparecer con nombre, nivel, precio y efectos diferentes.<br>
• Integrados 13 sprites nuevos: pantalones, jeans, deportivo, gorra negra, reloj, colgante, bolso cruzado, sombrero, suéter, bolso clásico, mocasines, gafas y bufanda.<br>
• Piernas funciona como categoría real de equipamiento.<br>
• Los objetos pueden otorgar stats planos y pequeños porcentajes de Captura, Hallazgo, Velocidad de viaje, Daño, Recompensas o Energía máxima.<br>
• Técnica y Estrategia de equipo influyen en combate; Captura influye en Poké Balls; Velocidad reduce viaje; Daño modifica ataques; Exploración mejora hallazgos; Resistencia aumenta energía máxima.<br>
• Carisma concede hasta 10% de descuento en Boutique.<br>
• La Hoja muestra stat base + bono de equipo y tooltips con nivel, calidad y efectos.<br><br>

<b>v0.32 — Sexto slot de equipamiento: Piernas</b><br>
• La Hoja del entrenador pasa de 5 a 6 espacios de equipamiento.<br>
• Se añadió la categoría real «Piernas» para pantalones, jeans y prendas inferiores.<br>
• El orden queda: Cabeza / Torso / Piernas y Mochila / Calzado / Accesorio.<br>
• La cuadrícula principal queda organizada en dos filas exactas de tres espacios en escritorio.<br>
• Las partidas anteriores se migran automáticamente y reciben el nuevo espacio Piernas vacío sin perder ningún objeto equipado.<br>
• El sistema queda preparado para que los nuevos pantalones de la Boutique utilicen directamente el slot Piernas.<br><br>

<b>v0.31 — Hoja del entrenador estilo Gladiatus</b><br>
• Se reorganizó por completo la Hoja del entrenador siguiendo la estructura visual de Gladiatus.<br>
• Avatar, nombre, nivel, Prestigio y Talentos quedan ahora agrupados en la columna izquierda.<br>
• Las estadísticas del entrenador pasan debajo del avatar y de sus datos personales.<br>
• El bloque principal de la derecha queda dedicado al Equipo y objetos equipados.<br>
• Los slots de Cabeza, Torso, Mochila, Calzado y Accesorio ganan más espacio y muestran sprites más grandes.<br>
• Guardarropa continúa debajo de los objetos equipados y la Mochila queda como bloque secundario inferior.<br>
• Se compactaron las barras de estadísticas para que funcionen como información auxiliar y no ocupen el centro de la ficha.<br>
• En pantallas angostas la ficha vuelve automáticamente a una sola columna.<br><br>

<b>v0.30 — Rondas de presión y NPCs de Pueblo Paleta</b><br>
• Se implementó una escalada real de combate sin volver al KO forzado.<br>
• Ronda 1 mantiene el daño normal; ronda 2 aumenta el daño un 10%; ronda 3 un 20%; ronda 4 en adelante un 30%.<br>
• Desde la ronda 4 aparece desgaste por cansancio al finalizar cada tramo: 3,5% de PS máximos; desde la ronda 5, 5%.<br>
• El desgaste puede provocar un KO real, pero no existe ningún golpe decisivo artificial por tiempo.<br>
• Los movimientos de estado ya no pueden encadenarse indefinidamente: después de dos movimientos no ofensivos seguidos se prioriza un ataque con daño si el Pokémon dispone de uno.<br>
• Desde la ronda 3 los Pokémon favorecen movimientos ofensivos para evitar combates eternos.<br>
• Se aumentó moderadamente el daño base para que los combates de niveles bajos tengan un ritmo más natural.<br>
• El panel de cambio de Pokémon fue corregido: nombre, PS y tipos aparecen en líneas separadas y ya no se muestra texto pegado como “Pikachu5/48 PS”.<br>
• Se integró el sprite definitivo de Mamá dentro de Tu casa.<br>
• Se integró el sprite del Vecino curioso en las pantallas tutoriales de Pueblo Paleta.<br>
• Se integró el sprite de la Entrenadora local en las pantallas tutoriales de Pueblo Paleta.<br>
• Se corrigió además el balance energético que no había quedado aplicado correctamente en v0.29: +1 energía cada 4 minutos, combates salvajes 4 y entrenadores 5, viajes 2.<br>
• Se conserva el botón de testing para rellenar o elegir manualmente la energía.<br><br>

<b>v0.29 — Balance de energía y herramientas de testing</b><br>
• La energía máxima base se mantiene en 100.<br>
• La regeneración pasa a +1 de energía cada 4 minutos.<br>
• Viajar entre zonas cuesta 2 de energía.<br>
• Explorar Ruta 1 mantiene un coste de 2 y Bosque Verde de 3.<br>
• Los combates salvajes cuestan 4 de energía y los combates contra entrenadores 5.<br>
• Cambiar Pokémon, capturar y utilizar objetos no añaden costes de energía.<br>
• Descansar con Mamá cura PS y estados alterados, pero ya no rellena la energía del entrenador.<br>
• Se elimina el límite rígido de 20 combates diarios como barrera de juego; la energía pasa a ser el límite principal.<br>
• En Partida se añadieron herramientas exclusivas de testing: Cargar energía restaura instantáneamente el máximo y Elegir energía permite fijar manualmente cualquier valor entre 0 y el máximo.<br>
• Las acciones de testing quedan marcadas en el historial con la etiqueta [TEST].<br><br>

<b>v0.28 — Reinicio para testing</b><br>
• Se añadió el botón «Reiniciar partida» dentro del menú Partida.<br>
• El reinicio utiliza doble confirmación para evitar borrar una partida por accidente.<br>
• Al confirmar, elimina el guardado local actual y vuelve a la creación de entrenador y elección de starter.<br>
• Exportar una partida antes de reiniciar permite conservar una copia de seguridad para pruebas.<br>
• El balance de energía se mantiene sin cambios en esta versión mientras se define el modelo definitivo.<br><br>

<b>v0.27 — Bosque Verde interactivo, casa y PC</b><br>
• Bosque Verde recibe un mapa visual completo basado en la imagen entregada.<br>
• Entrar al Bosque ya no consume energía automáticamente; la energía se gasta al elegir explorar.<br>
• El mapa incluye zonas de hierba interactiva, dos puntos de Cazabichos, un objeto perdido y la salida a Ciudad Verde.<br>
• Explorar Bosque Verde continúa costando 3 de energía y genera encuentros variables.<br>
• Se añadió un objeto perdido diario en el Bosque Verde que entrega una Poké Ball, Poción o Repelente al azar.<br>
• El Repelente ahora es un objeto funcional: dura 3 exploraciones y reduce fuertemente los encuentros salvajes del Bosque Verde.<br>
• La Poción puede utilizarse también fuera del combate desde la mochila.<br>
• La mochila muestra botones de uso para Poción y Repelente; la Poké Ball continúa reservada para capturas.<br>
• Tu casa en Pueblo Paleta pasa a ser una localización propia con Mamá, descanso y acceso a la PC.<br>
• Mamá tiene varios diálogos y consejos y puede seguir conversando sin cerrar la pantalla.<br>
• Descansar en casa restaura energía, PS y elimina estados alterados.<br>
• Se creó un sistema de PC para mover Pokémon entre el equipo y el almacenamiento.<br>
• La PC está disponible tanto en tu casa como en el Centro Pokémon de Ciudad Verde.<br>
• Pueblo Paleta incorpora dos NPC tutoriales interactivos con consejos sobre energía, viajes, PS, tipos, capturas, objetos y trabajos de Oak.<br>
• El mapa de Pueblo Paleta incorpora puntos interactivos para estos dos nuevos NPC.<br><br>
<b>v0.26 — Combates sin KO forzado</b><br>
• Los 20 segundos dejan de funcionar como un límite obligatorio para decidir un ganador.<br>
• Se eliminó el golpe decisivo artificial que aparecía al final del tramo para llevar a uno de los Pokémon a 0 PS.<br>
• Si ambos Pokémon siguen con PS al terminar los 20 segundos, comienza automáticamente otro tramo de 20 segundos.<br>
• Los PS, estados alterados y Pokémon activos se conservan exactamente entre un tramo y el siguiente.<br>
• El combate sólo termina por un KO real, captura, retirada o porque un entrenador se queda sin Pokémon disponibles.<br>
• El azar continúa influyendo en golpes, daño, estados y ventaja de combate, pero ya no obliga a fabricar un vencedor por tiempo.<br>
• La crónica informa cuando un tramo termina sin vencedor y el duelo continúa.<br><br>
<b>v0.25.1 — Corrección del selector de avatar</b><br>
• Corregido el bloqueo de pantalla borrosa al iniciar la v0.25.<br>
• Los 12 avatares quedan ahora correctamente embebidos en el HTML.<br>
• Corregida la función de cierre del selector de avatar.<br>
• Añadido un mecanismo de seguridad para que un fallo visual del selector nunca bloquee todo el juego.<br>
• Se conservan todos los cambios de viaje, curación, Oak y navegación contextual de v0.25.<br><br>

<b>v0.25 — Avatares, viaje y navegación contextual</b><br>
• Se integraron 12 avatares de entrenador a partir de las dos láminas nuevas.<br>
• La primera elección de avatar es gratuita y sólo se realiza una vez; cambiarlo después cuesta ₽40.000.<br>
• La Hoja del entrenador muestra el avatar seleccionado.<br>
• Se corrigió definitivamente el sprite de Pidgeotto por el sprite correcto.<br>
• Descansar en casa o curarse en el Centro Pokémon restaura PS y elimina ENVENENADO.<br>
• Viajar entre zonas cuesta 3 de energía y tarda 12 segundos.<br>
• Durante el trayecto no se puede combatir, explorar ni iniciar otro viaje, aunque sí revisar menús.<br>
• ZONA ACTUAL en el menú izquierdo ahora muestra únicamente acciones y salidas relacionadas con la ubicación presente.<br>
• Pueblo Paleta muestra Oak, casa, rival y Ruta 1; Ruta 1 muestra exploración y sus dos salidas; Ciudad Verde muestra Centro, Tienda, Ruta 1 y Bosque; Bosque Verde muestra exploración y sus salidas.<br>
• Oak tiene ahora varios consejos sobre PS, estados, capturas, energía, viajes, tipos y entrenadores con varios Pokémon.<br>
• Los consejos permanecen en pantalla y pueden recorrerse con Otro consejo; ya no desaparecen por el refresco automático.<br>
• Se corrigió el coste visual de Bosque Verde y el registro de zona de los combates contra cazabichos.<br><br>
<b>v0.24 — Poción y retirada en combate</b><br>
• Se añadió el botón Poción a los combates.<br>
• Usar una Poción consume una unidad de la mochila y cura al Pokémon activo sin detener el reloj del combate.<br>
• La curación equivale aproximadamente al 42% de los PS máximos, con un mínimo de 12 PS.<br>
• No se puede gastar una Poción si el Pokémon ya tiene todos sus PS ni sobre un Pokémon debilitado en pleno combate.<br>
• El botón muestra en tiempo real cuántas Pociones quedan.<br>
• Se añadió Retirada únicamente contra Pokémon salvajes.<br>
• Retirarse termina el encuentro sin dinero, EXP ni Prestigio y conserva exactamente los PS actuales del equipo.<br>
• Los combates contra entrenadores no permiten Retirada.<br>
• Poké Ball, cambio de Pokémon, Poción y Retirada conviven ahora como acciones contextuales del duelo.<br><br>
<b>v0.23.2 — Corrección de interfaz vacía</b><br>
• Corregida la referencia faltante a los sprites de objetos y ropa.<br>
• La interfaz vuelve a iniciar normalmente en lugar de quedar en blanco.<br>
• Se restauran Poké Ball, Poción, Repelente y los seis sprites de equipamiento dentro del HTML.<br>
• Se conserva la corrección del trabajo de Oak de v0.23.1.<br><br>
<b>v0.23.1 — Corrección de arranque</b><br>
• Corregido un bucle al cargar partidas con un trabajo del Profesor Oak ya finalizado.<br>
• La recompensa del trabajo se acredita una sola vez y el juego puede iniciar normalmente.<br>
• Se conserva íntegramente el rediseño de Hoja del entrenador, Equipo Pokémon y los nuevos sprites de objetos de v0.23.<br><br>

<b>v0.23 — Hoja del entrenador y arte de objetos</b><br>
• Se rediseñó Visión general como una ficha integrada inspirada en la estructura de Gladiatus.<br>
• La sección ahora tiene pestañas: Hoja del entrenador, Equipo Pokémon y Estadísticas.<br>
• Hoja del entrenador reúne estadísticas, objetos equipados, guardarropa y mochila en una sola pantalla.<br>
• Equipo Pokémon pasa a una pestaña propia con sprite, nivel, PS, tipos y estados de cada integrante.<br>
• Se integraron sprites reales para Poké Ball, Poción y Repelente en la Tienda Pokémon y la mochila.<br>
• Se integraron sprites reales para Gorra clásica, Chaqueta de ruta, Mochila aventurera, Zapatillas rápidas, Gafas oscuras y Pañuelo rojo.<br>
• Los slots de Cabeza, Torso, Mochila, Calzado y Accesorio muestran la imagen real del objeto equipado.<br>
• El guardarropa dejó de usar emojis y muestra las prendas adquiridas como tarjetas visuales.<br>
• La Boutique fue actualizada para mostrar los nuevos sprites de ropa y accesorios.<br>
• Los objetos siguen conservando el sistema de compra, equipar y quitar ya existente.<br><br>
<b>v0.22 — Corrección de sprites del Bosque Verde</b><br>
• Se reemplazó el sprite defectuoso de Metapod por el sprite entregado.<br>
• Se reemplazó el sprite defectuoso de Weedle por el sprite entregado.<br>
• Ambos sprites quedan embebidos directamente en el HTML y tienen prioridad sobre versiones antiguas.<br>
• La corrección se aplica tanto a encuentros salvajes como a Pokémon usados por Cazabichos.<br>
• Se mantiene el fondo transparente de ambos PNG para evitar recuadros negros.<br><br>

<b>v0.21 — Trabajos con el Profesor Oak</b><br>
• Preguntar por trabajo a Oak abre cuatro opciones de duración: 25 minutos, 6 horas, 12 horas y 24 horas.<br>
• Cada trabajo tiene recompensas propias de dinero, EXP y, en los turnos largos, Prestigio.<br>
• Los trabajos continúan avanzando aunque cierres el juego; al volver se calcula el tiempo transcurrido.<br>
• Mientras trabajás podés revisar equipo, Pokédex, misiones, tienda, estadísticas y otras pantallas informativas.<br>
• Mientras haya un trabajo activo no podés combatir, explorar zonas ni viajar entre ubicaciones.<br>
• Los trabajos pueden cancelarse en cualquier momento.<br>
• Cancelar un trabajo no entrega recompensa.<br>
• La pantalla de Oak muestra el tiempo restante y una barra de progreso.<br>
• El panel del entrenador muestra un indicador de trabajo activo y la cuenta regresiva.<br>
• Al completar un trabajo las recompensas se acreditan automáticamente y se registran en Actividad.<br><br>

<b>v0.20 — Oak, Bosque Verde dinámico y veneno</b><br>
• Se integró el sprite nuevo del Profesor Oak.<br>
• Se integraron cuatro cazabichos: niño, niña, adulto y adulta.<br>
• Bosque Verde usa exploración dinámica como Ruta 1 y consume 3 de energía por exploración.<br>
• En Bosque Verde aparecen entre 3 y 6 desafíos variables: salvajes o cazabichos.<br>
• Los cazabichos pueden tener 1 o 2 Pokémon, agregando segmentos extra de 20 segundos.<br>
• Ruta 1 fue corregida: los únicos Pokémon salvajes son Pidgey y Rattata.<br>
• Caterpie y Pikachu ya no aparecen como salvajes en Ruta 1.<br>
• Bosque Verde incluye Caterpie, Weedle, Metapod, Kakuna, Pikachu raro y Pidgeotto raro como guiño a la serie.<br>
• Se integraron sprites de Metapod, Kakuna y Pidgeotto.<br>
• Metapod usa Fortaleza; Kakuna puede usar Fortaleza y Picotazo Venenoso; Pidgeotto tiene movimientos acordes y nivel más alto.<br>
• Picotazo Venenoso ahora tiene probabilidad real de envenenar.<br>
• El veneno descuenta PS periódicamente y aparece narrado en la crónica.<br>
• La interfaz muestra ENVENENADO junto al Pokémon afectado.<br>
• El estado puede conservarse si el Pokémon es capturado estando envenenado.<br><br>

<b>v0.19 — PS persistentes, exploración y entrenadores</b><br>
• Los PS del equipo ahora persisten después del combate: recibir daño deja al Pokémon herido hasta que sea curado.<br>
• Un Pokémon que termina en 0 PS queda debilitado y no puede iniciar otro duelo.<br>
• Centro Pokémon y descanso siguen siendo las formas de recuperar completamente al equipo.<br>
• Se eliminó el fondo negro de los sprites Pokémon y se corrigió su alineación en encuentros, equipo y combate.<br>
• Se integraron cuatro sprites de entrenadores entregados por el usuario y se asignan de manera variable a los rivales de Ruta 1.<br>
• Explorar Ruta 1 consume 2 de energía y genera una selección nueva de encuentros cada vez.<br>
• Ya no aparecen siempre tres rivales: pueden aparecer entre 2 y 5 encuentros diferentes.<br>
• En Ruta 1 pueden salir Pokémon salvajes o entrenadores.<br>
• Los entrenadores tienen equipos variables; algunos pueden poseer starters y aproximadamente una cuarta parte lleva 2 Pokémon.<br>
• Cada Pokémon adicional del rival agrega un nuevo segmento de 20 segundos al duelo.<br>
• Se añadió el botón Cambiar Pokémon durante el combate para usar otro integrante sano del equipo.<br>
• El cambio conserva los PS y permite aprovechar o sufrir diferencias de nivel y tipo.<br>
• El azar continúa determinando el desenlace, pero ahora considera nivel, PS restantes, estadísticas del entrenador y una pequeña ventaja/desventaja de tipos.<br>
• Las capturas salvajes conservan los PS que tenía el Pokémon al momento de ser capturado.<br><br>

<b>v0.18 — Sprites oficiales y tipos Pokémon</b><br>
• Se integraron los sprites entregados para Bulbasaur, Ivysaur, Venusaur, Charmander, Charmeleon, Charizard, Squirtle, Wartortle, Blastoise, Caterpie, Rattata, Pidgey y Pikachu.<br>
• Estos sprites quedan embebidos dentro del HTML y tienen prioridad sobre los sprites provisionales anteriores.<br>
• Los sprites se normalizaron a un mismo lienzo visual sin deformarlos.<br>
• Se añadió un sistema visual de tipos Pokémon con colores propios.<br>
• Planta aparece en verde, Veneno en violeta, Fuego en naranja, Agua en azul, Normal en gris, Volador en azul lavanda, Bicho en verde lima y Eléctrico en amarillo.<br>
• Los tipos aparecen ahora en el panel lateral del equipo, las tarjetas del equipo, selección de starter, encuentros y pantalla de combate.<br>
• Cada tarjeta Pokémon incorpora además una pequeña barra del color de su tipo principal.<br>
• Las capturas nuevas guardan automáticamente el tipo correcto de la especie.<br>
• Se conserva la interfaz moderna introducida en v0.17.<br><br>
<b>v0.17 — Renovación visual</b><br>
• Interfaz general modernizada: HUD oscuro, navegación lateral más limpia, tarjetas modernas y mayor protagonismo de los mapas.<br><br>
<b>v0.16 — Mapas locales de Kanto</b><br>
• Se integraron como mapas reales las tres imágenes aportadas para Pueblo Paleta, Ruta 1 y Ciudad Verde.<br>
• Los tres fondos están embebidos dentro del HTML y no necesitan archivos externos.<br>
• Pueblo Paleta mantiene Tu casa, Laboratorio de Oak, Casa del rival y salida a Ruta 1.<br>
• Ruta 1 ahora tiene su propio mapa navegable, salida a Paleta, salida a Verde y acceso a encuentros.<br>
• Ciudad Verde ahora tiene su propio mapa con Centro Pokémon, Tienda, salida a Ruta 1 y salida hacia Bosque Verde.<br>
• Los mapas usan puntos interactivos discretos con tooltips para no tapar las ilustraciones.<br>
• La navegación entre estas tres zonas actualiza la ubicación persistente del entrenador.<br><br>
<b>v0.15 — Movimientos correctos y capturas en combate</b><br>
• Los movimientos ahora distinguen entre ataques de daño y movimientos de estado.<br>
• Gruñido, Látigo, Ataque Arena y Disparo Demora ya no reducen PS.<br>
• Los movimientos de estado aparecen en la crónica explicando su efecto sin causar daño directo.<br>
• Cuando un Pokémon salvaje baja a 35% de PS o menos aparece el botón Lanzar Poké Ball.<br>
• El botón de captura nunca aparece contra entrenadores.<br>
• Cada intento consume 1 Poké Ball y sólo puede intentarse una vez por combate en esta versión.<br>
• La probabilidad de captura mejora cuanto menos PS tenga el Pokémon y cuanto mayor sea la estadística Captura del entrenador.<br>
• Si la Poké Ball falla, el Pokémon escapa y el combate continúa normalmente.<br>
• Si la captura tiene éxito, el combate termina y el Pokémon se envía al equipo o al PC.<br>
• Una captura exitosa otorga +1 Prestigio.<br><br>
<b>v0.14 — Combate con PS y cierre manual</b><br>
• Al terminar un duelo, la pantalla permanece abierta para poder leer el resultado.<br>
• Se añadieron botones: Seguir explorando, Volver al Portal y Mapa de Kanto.<br>
• Los combates incorporan barras visuales de PS para ambos Pokémon.<br>
• Las barras acompañan la narración pero no alteran el resultado azaroso predefinido del combate.<br>
• Cada especie dispone ahora de varios movimientos posibles y se eligen al azar en cada duelo.<br>
• Pidgey, Rattata, Caterpie, Weedle, Pikachu y los tres starters ya tienen pequeños pools de movimientos.<br>
• La crónica puede variar entre combates aun enfrentando al mismo Pokémon.<br>
• Se mantienen los 20 segundos de duración, el coste de energía, el límite diario y las probabilidades existentes.<br><br>
<b>v0.13 — Duelos narrados y energía</b><br>
• Cada combate Pokémon dura 20 segundos reales.<br>
• Durante esos 20 segundos aparece una crónica progresiva del duelo.<br>
• Los relatos usan movimientos distintos según el Pokémon enfrentado y el starter utilizado.<br>
• El desenlace se muestra al final y recién entonces se acreditan EXP, dinero y prestigio.<br>
• Cada combate consume 6 de energía.<br>
• La energía recupera 1 punto cada 3 minutos, incluso con el juego cerrado.<br>
• La barra superior muestra la cuenta regresiva para el próximo punto de energía.<br>
• Se añadieron 20 combates de aventura diarios; se renuevan automáticamente cada día.<br>
• Mientras un duelo está activo se bloquea la navegación para evitar acciones simultáneas.<br><br>
<b>v0.12 — Kanto sin candados incrustados</b><br>• Se sustituyó el fondo de Kanto por la versión limpia aprobada.<br>• Los candados dejaron de formar parte del arte del mapa.<br>• Se eliminaron pines HTML visibles duplicados.<br>• La interacción se conserva mediante hotspots transparentes y tooltips.<br>• Los destinos futuros siguen bloqueados por lógica, sin ensuciar la ilustración.<br><br><b>v0.11 — Limpieza de mapas</b><br>• Se eliminaron los grandes rótulos superpuestos sobre los mapas.<br>• Pueblo Paleta usa un fondo limpiado y puntos interactivos compactos.<br>• Kanto usa una imagen limpia con pines discretos.<br>• Los nombres y descripciones aparecen únicamente al pasar el mouse.<br>• Se redujo el ruido visual y se mantiene toda la navegación.<br>• Los mapas permanecen embebidos dentro del HTML.<br><br><b>v0.10 — Rediseño de interfaz</b><br>• La interfaz real adopta la composición visual del mockup aprobado.<br>• Menú izquierdo más ancho, con mayor separación vertical, iconos y divisores claros.<br>• Panel central más limpio y con mayor margen interno.<br>• Columna derecha más legible para Entrenador, Equipo y Actividad.<br>• Cabecera oscura y recursos superiores rediseñados.<br>• Botones, pestañas, paneles y tarjetas armonizados en una misma estética.<br>• Se mantienen todas las mecánicas y partidas anteriores.<br><br><b>v0.09 — Mapa de Kanto ilustrado</b><br>• Se reemplazó el mapa provisional por el mapa ilustrado aprobado.<br>• El mapa mantiene el estilo pixel-art detallado de Pueblo Paleta.<br>• Los destinos de Kanto están ubicados sobre la imagen y conservan estados disponible/bloqueado.<br>• Pueblo Paleta, Ruta 1, Ciudad Verde y Bosque Verde siguen siendo navegables.<br>• La imagen está embebida dentro del HTML, sin archivos externos.<br>• Se mantiene migración automática de partidas anteriores.<br><br><b>v0.08 — Sprites sin internet</b><br>• CORRECCIÓN DEFINITIVA: los Pokémon principales de la demo ya no usan URLs externas.<br>• Bulbasaur, Charmander, Squirtle, Pidgey, Rattata, Caterpie, Weedle y Pikachu están embebidos dentro del propio HTML.<br>• El juego puede mostrar estos sprites incluso abierto como archivo local y sin conexión.<br>• Se eliminó la dependencia de GitHub/PokeAPI para estas especies.<br>• Se mantiene migración automática de partidas anteriores.<br><br><b>v0.07 — Corrección de Kanto y sprites</b><br>• CORRECCIÓN: Pueblo Paleta ya no tiene Centro Pokémon.<br>• Se limpiaron los rótulos que venían pegados dentro de la ilustración y se mantienen sólo los botones reales de la interfaz.<br>• Tu casa queda como punto de descanso inicial antes de llegar a un Centro Pokémon.<br>• Sprites cambiados de GIF animado de Generación V a sprites PNG estáticos, más compatibles.<br>• Mapa de Kanto redibujado con una disposición mucho más fiel a la región y sin aspecto de isla cerrada.<br>• Se añadieron Azafrán, Fucsia e Isla Canela al mapa futuro.<br>• Los fondos siguen embebidos dentro del HTML.<br>• Migración automática de partidas anteriores.<br><br><b>v0.06 — Mapas autocontenidos</b><br>• CORRECCIÓN: el mapa de Pueblo Paleta ahora está embebido dentro del HTML y funciona aunque abras el archivo suelto.<br>• PokExperience vuelve a distribuirse como un único HTML sin depender de imágenes externas.<br>• Mapa de Kanto completamente rediseñado: costa, relieve, bosques, caminos, lagos, ciudades y rutas.<br>• La ubicación actual queda marcada con un borde rojo.<br>• Se añadieron futuras ubicaciones visibles y bloqueadas para dar sensación de mundo y progresión.<br>• Portal local y mapa regional mantienen funciones diferentes.<br>• Migración automática de partidas anteriores.<br><br><b>v0.05 — Pueblo Paleta ilustrado</b><br>• Primer Portal de la ciudad con escenario pixel-art completo.<br>• Se eliminó el dibujo/indicador del personaje dentro del mapa.<br>• Los lugares funcionan como hotspots discretos sobre el escenario.<br>• Centro Pokémon, casa, Laboratorio de Oak, casa del rival y salida a Ruta 1 son interactivos.<br>• Tu casa ahora permite recuperar energía y curar el equipo.<br>• La casa del rival queda preparada para futuros eventos.<br>• Se mantiene la zona costera como contenido bloqueado.<br>• Migración automática de partidas anteriores.<br><br><b>v0.04 — Perfil e inventario</b><br>• Nueva sección visual de objetos equipados en la hoja del entrenador.<br>• Guardarropa con slots de Cabeza, Torso, Mochila, Calzado y Accesorio.<br>• Las prendas compradas ahora pueden equiparse y quitarse.<br>• Boutique reconoce objetos ya comprados y evita recomprarlos.<br>• Pestaña Estadísticas funcional con batallas, victorias, derrotas, rachas, dinero ganado y progreso.<br>• Pestaña Victorias funcional.<br>• CORRECCIÓN: una misión cobrada pasa a COMPLETADA y no puede volver a aceptarse ni entregar recompensas infinitas.<br>• Corrección de partidas antiguas cuyo campo de EXP máxima aparecía como undefined.<br>• Migración automática desde v0.03/v0.02/v0.01.<br><br><b>v0.03 — Ciudad interactiva</b><br>• Tooltips explicativos al pasar el mouse por cada cualidad del entrenador.<br>• Cada tooltip explica qué representa el atributo y qué sistemas afectará.<br>• Nuevo Portal de la ciudad visual e interactivo.<br>• Los edificios, NPC y salidas cambian según la ubicación actual.<br>• Indicador visible de posición del entrenador dentro de la zona.<br>• Portal de la ciudad y Mapa de Kanto ahora son sistemas separados y complementarios.<br>• Migración automática desde v0.02 y v0.01.<br><br><b>v0.02 — Browser RPG</b><br>
• Nueva hoja de entrenador y seis cualidades mejorables.<br>• Academia de Entrenadores con costes progresivos.<br>• Puntos de Talento.<br>
• Sistema de misiones aceptables y recompensas.<br>• Boutique de ropa y accesorios.<br>• Tienda Pokémon.<br>
• Profesor Oak como primer NPC interactivo.<br>• Mapa navegable de Kanto y ubicación persistente.<br>• Encuentros estilo Gladiatus en Ruta 1 y Bosque Verde.<br>
• Clasificación prototipo.<br>• Migración automática de partidas v0.01.<br>• Guardado, exportación e importación actualizados.<br><br>
<b>v0.01 — Fundación</b><br>• Creación de entrenador y starter.<br>• Equipo, energía, dinero, prestigio y Pokédex.<br>• Guardado local automático.</div>`}
function openSave(){modal.innerHTML=`<div class="modalbox"><h3>Partida</h3><p>Guardado automático activo.</p><button class="primary" onclick="save();closeM()">Guardar</button>
<button class="primary" onclick="exportSave()">Exportar</button><button class="primary" onclick="document.getElementById('imp').click()">Importar</button>
<input id="imp" type="file" class="hidden" onchange="importSave(this.files[0])">
<hr style="border:0;border-top:1px solid #8d7540;margin:14px 0">
<p><b>Zona de pruebas</b><br><small>Reiniciar borra la partida local y vuelve a la creación de entrenador.</small></p>
<button class="primary" style="background:#8b2d2d;color:#fff;border-color:#b75a5a" onclick="resetGame()">↻ Reiniciar partida</button>
<button class="primary" style="background:#315f83;color:#fff;border-color:#4d82a8" onclick="testerRefillEnergy()">⚡ TEST: Cargar energía</button>
<button class="primary" style="background:#315f83;color:#fff;border-color:#4d82a8" onclick="testerSetEnergy()">🧪 TEST: Elegir energía</button>
<button class="primary" style="background:#315f83;color:#fff;border-color:#4d82a8" onclick="testerRestoreMoney()">💰 TEST: Restaurar dinero</button>
<button class="primary" onclick="closeM()">Cerrar</button></div>`;modal.classList.remove('hidden')}
function closeM(){modal.classList.add('hidden')}
function testerRefillEnergy(){
 if(!S)return;
 S.trainer.energy=S.trainer.maxEnergy;
 S.lastEnergyTick=Date.now();
 S.history.push('[TEST] Energía restaurada al máximo.');
 save();hud();
 alert(`Energía restaurada: ${S.trainer.energy}/${S.trainer.maxEnergy}`);
}
function testerSetEnergy(){
 if(!S)return;
 const raw=prompt(`Energía actual: ${S.trainer.energy}/${S.trainer.maxEnergy}\nIngresá un valor entre 0 y ${S.trainer.maxEnergy}:`,String(S.trainer.energy));
 if(raw===null)return;
 const value=Math.floor(Number(raw));
 if(!Number.isFinite(value)||value<0||value>S.trainer.maxEnergy){
   alert(`Ingresá un número entre 0 y ${S.trainer.maxEnergy}.`);
   return;
 }
 S.trainer.energy=value;
 S.lastEnergyTick=Date.now();
 S.history.push(`[TEST] Energía ajustada manualmente a ${value}.`);
 save();hud();
 alert(`Energía de prueba: ${value}/${S.trainer.maxEnergy}`);
}

function testerRestoreMoney(){
 if(!S)return;
 const TEST_MONEY=5000;
 S.trainer.money=TEST_MONEY;
 S.history.push(`[TEST] Dinero restaurado a ₽${TEST_MONEY.toLocaleString('es-AR')}.`);
 save();hud();
 alert(`Dinero restaurado: ₽${TEST_MONEY.toLocaleString('es-AR')}`);
}

function resetGame(){
 if(!confirm('¿Reiniciar la partida? Se borrará todo el progreso guardado en este navegador.'))return;
 if(!confirm('Última confirmación: esta acción no se puede deshacer salvo que hayas exportado una copia.'))return;
 try{
   localStorage.removeItem(KEY);
   localStorage.removeItem(OLD);
 }catch(e){}
 S=null;pick=null;battleRunning=false;currentBattle=null;
 closeM();
 location.reload();
}

function exportSave(){save();let b=new Blob([JSON.stringify(S,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='PokExperience_v0448_'+S.trainer.name+'.json';a.click()}
function importSave(f){if(!f)return;let r=new FileReader();r.onload=()=>{try{S=migrate(JSON.parse(r.result));save();closeM();show()}catch(e){alert('Partida inválida')}};r.readAsText(f)}
boot();
