import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const filenames = ["content/ambitions.js","content/moth.generated.js","content/world.js","content/penalties.js","content/callings.js","content/systems.js","src/game/rules.global.js"];
const main = html.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1];
assert.ok(main, "the main browser script must exist");

function launch(save = null) {
 const nodes = new Map(), handlers = {};
 const store = new Map(save ? [["the-undercity-v1",JSON.stringify(save)]] : []);
 const storage = { getItem(k){return store.get(k)??null;},setItem(k,v){store.set(k,v);},removeItem(k){store.delete(k);} };
 const document = {
  getElementById(k){if(!nodes.has(k)) nodes.set(k,{innerHTML:"",classList:{toggle:()=>false},setAttribute(){},click(){},style:{}});return nodes.get(k);},
  addEventListener(k,cb){handlers[k]=cb;},documentElement:{style:{setProperty(){}}}
 };
 const window={};
 const sandbox=vm.createContext({window,document,localStorage:storage,Date,console,
  setInterval(){},clearInterval(){},Math:Math, URL,Blob,confirm:()=>true,
  alert(t){throw Error(t)},getComputedStyle:()=>({getPropertyValue:()=>"1"})});
 // Deterministic success on every eligible challenge during the smoke run.
 vm.runInContext("Math.random = () => 0",sandbox);
 for(const file of filenames)vm.runInContext(readFileSync(new URL("../"+file,import.meta.url),"utf8"),sandbox,{filename:file});
 vm.runInContext(main,sandbox,{filename:"index.html:inline"});
 const act=(name,target,index=0,card="0")=>handlers.click({target:{closest:()=>({dataset:{act:name,target,index:String(index),card},classList:{toggle:()=>false},setAttribute(){}})}});
 return {window,act,storage,nodes};
}

test("all scripts parse and the document includes the expansion files",()=>{
 for(const file of filenames){assert.ok(html.includes(file));new vm.Script(readFileSync(new URL("../"+file,import.meta.url),"utf8"));}
 new vm.Script(main);
});

test("the original UI starts, and full content is accessible to the same engine",()=>{
 const app=launch(),d=app.window.UndercityDiagnostics;
 assert.ok(d,"runtime diagnostics are installed");
 assert.ok(d.storyCount>=125,"expected full expansion content");
 assert.ok(d.cardCount>=16);
 assert.equal(d.professionCount,34);
 assert.equal(d.destinyCount,20);
 assert.equal(d.equipmentSlots,20);
 assert.equal(d.livingStoryCount,4);
 assert.match(app.nodes.get("main").innerHTML,/THE.*UNDERCITY/s);
});

test("onboarding, four-path escape, navigation and selecting an ambition",()=>{
 const a=launch();
 a.act("intro");a.act("origin","scribe");a.act("faction","ledger");a.act("escape","observation");
 assert.equal(a.window.UndercityDiagnostics.checkState().place,"ink");
 a.act("travel","court");
 a.act("choose","choose-personal-ambition",0);
 assert.equal(a.window.UndercityDiagnostics.checkState().path,"moth");
 a.act("choose","path-moth-1",0);
 assert.equal(a.window.UndercityDiagnostics.checkState().pathProgress,1);
 a.act("tab","paths");assert.match(a.nodes.get("main").innerHTML,/Making Your Name/);
 assert.match(a.nodes.get("main").innerHTML,/Profession/);
 assert.match(a.nodes.get("main").innerHTML,/Destiny/);
});

test("previous version-one saves migrate without losing progress",()=>{
 const saved={version:1,stage:"explore",tab:"story",name:"Tester",background:"runner",faction:"hands",place:"court",
 stats:{observation:13,guile:25,persuasion:10,resolve:10},
 actions:7,lastTick:Date.now(),lastCard:Date.now(),coin:17,items:{map:1},flags:{remember:true},hand:["card_bell"],done:{ambition1:true},ambition:2,
 journal:[],relation:{ledger:0,wardens:0,choir:0,hands:2,dawn:0}};
 const a=launch(saved),s=JSON.parse(a.storage.getItem("the-undercity-v1"));
 assert.equal(s.ambition,2);assert.equal(s.coin,17);assert.equal(s.items.map,1);
 assert.equal(s.path,"");assert.deepEqual(Object.keys(s.renown).sort(),["guile","observation","persuasion","resolve"]);
});

test("weekly pay accrues through elapsed real time and does not recur on refresh",()=>{
 const past=Date.now()-8*86400000;
 const saved={version:1,stage:"explore",tab:"story",place:"court",stats:{observation:10,guile:10,persuasion:10,resolve:10},actions:5,
 coin:5,lastTick:Date.now(),lastCard:Date.now(),profession:"lamp-tender",lastWage:past,
 hand:[],items:{},relation:{ledger:0,wardens:0,choir:0,hands:0,dawn:0},flags:{},done:{},journal:[]};
 const a=launch(saved),s=JSON.parse(a.storage.getItem("the-undercity-v1"));
 assert.equal(s.coin,14);
 const b=launch(s),t=JSON.parse(b.storage.getItem("the-undercity-v1"));
 assert.equal(t.coin,14);
});

test("all new story locations, choices, effects and gates are internally valid",()=>{
 const a=launch(),e=a.window.UndercityExpansions,places=new Set(a.window.UndercityDiagnostics.locations());
 const ids=new Set();const items=e.items;
 for(const story of e.stories){
  assert.ok(story.id&&story.title&&story.description,story.id);
  assert.ok(!ids.has(story.id),"duplicate story id: "+story.id);ids.add(story.id);
  assert.ok(Array.isArray(story.where)&&story.where.every(p=>places.has(p)),story.id+" invalid place");
  if(story.category==="penalty-arrival") {
   assert.equal(story.autofire,true,story.id+" must fire on arrival");
   assert.ok(story.choices.length>=1,story.id+" needs an acknowledgement");
   assert.equal(story.choices[0].cost,0,story.id+" must cost no actions");
  } else if(story.category==="penalty-recovery") {
   // The three recovery options are separate selectable storylets in the same hub.
   assert.ok(story.choices.length>=1,story.id+" needs a recovery branch");
  } else assert.ok(story.choices.length>=2,story.id+" needs genuine choice");
  for(const c of story.choices){assert.ok(c.label&&c.success,story.id+" incomplete branch");
   if(c.stat)assert.ok(["observation","guile","persuasion","resolve"].includes(c.stat),story.id);
   for(const x of [c.effects,c.fail])for(const id of Object.keys(x?.items||{})){
    assert.ok(items[id] || ["brass","charcoal","silk","hook","badge","ticket","glass","ledger","moss","lure","map","relic"].includes(id),story.id+" unknown item "+id);
   }
  }
 }
 assert.ok(ids.size>=100);
 assert.equal(e.ambitions.length,4);
 assert.equal(e.makingNames.length,4);
 assert.equal(e.quirks.length,9);
 assert.equal(e.exceptionalStories.length,3);
 assert.equal(e.seasonalEvents.length,6);
});

test("equipping a real owned item raises effective challenge odds",()=>{
 const a=launch();
 a.act("intro");a.act("origin","scribe");a.act("faction","ledger");a.act("escape","observation");
 const first=a.window.UndercityDiagnostics.broadCheck("observation",6);
 a.act("equip","charcoal");
 const second=a.window.UndercityDiagnostics.broadCheck("observation",6);
 assert.ok(second>first,"equip bonus must affect odds");
 const save=JSON.parse(a.storage.getItem("the-undercity-v1"));
 assert.equal(save.equipment["tools of the trade"],"charcoal");
 a.act("equip","charcoal");
 const unequipped=JSON.parse(a.storage.getItem("the-undercity-v1"));
 assert.ok(!unequipped.equipment["tools of the trade"]);
});

test("a delayed Living Story resolves once and saves its message",()=>{
 const past=Date.now()-3700000;
 const saved={version:1,stage:"explore",tab:"messages",place:"court",
  stats:{observation:10,guile:10,persuasion:10,resolve:10},actions:5,coin:5,ambition:1,clues:0,
  lastTick:Date.now(),lastCard:Date.now(),hand:[],items:{},done:{},
  relation:{ledger:0,wardens:0,choir:0,hands:0,dawn:0},
  flags:{},journal:[],living:{"clockmaker-post":past},messages:[]};
 const a=launch(saved),first=JSON.parse(a.storage.getItem("the-undercity-v1"));
 assert.equal(first.flags["living:complete:clockmaker-post"],true);
 assert.equal(first.coin,8);
 assert.equal(first.clues,1);
 assert.equal(first.messages.length,1);
 assert.match(a.nodes.get("main").innerHTML,/note from the clockmaker/i);
 const b=launch(first),again=JSON.parse(b.storage.getItem("the-undercity-v1"));
 assert.equal(again.messages.length,1);
 assert.equal(again.coin,8);
});

test("legacy menace values migrate to four named penalty hubs and recover safely",()=>{
 const base={version:1,stage:"explore",tab:"story",place:"court",stats:{observation:10,guile:10,persuasion:10,resolve:10},
  actions:5,lastTick:Date.now(),lastCard:Date.now(),items:{},hand:[],journal:[]};
 const cases=[
  [{suspicion:8},"the_watch_house","suspicion"],
  [{notoriety:8},"the_tribunal","notoriety"],
  [{health:0},"the_ward","wounds"],
  [{sanity:0},"the_pale_rooms","delirium"]
 ];
 for(const [extras,hub,menace] of cases){
  const app=launch({...base,...extras});
  const at=JSON.parse(app.storage.getItem("the-undercity-v1"));
  assert.equal(at.place,hub);
  assert.ok(at.qualities[menace].level>=8);
  if(menace==="suspicion")assert.equal(at.criminalRecord,1);
  app.act("recover");
  const returned=JSON.parse(app.storage.getItem("the-undercity-v1"));
  assert.equal(returned.place,"court");
  assert.ok(returned.qualities[menace].level<8);
 }
});
