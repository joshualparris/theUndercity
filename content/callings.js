/* Careers and destinies: player-facing choices for theUndercity, all original. */
(function(){
"use strict";
const e=window.UndercityExpansions ||= {stories:[],cards:[],items:{},professions:[],destinies:[]};
const first=[
["lamp-tender","Lamp Tender","resolve","wardens","court",9,"silver-flame","A shift keeping the public lanterns alight when the roof begins to move."],
["margin-clerk","Margin Clerk","observation","ledger","ink",8,"margin-pen","File a correct account of something the city prefers to forget."],
["harbour-runner","Harbour Runner","guile","hands","quays",10,"runner-boots","Carry an urgent parcel through customs without breaking an innocent person's trust."],
["street-poet","Street Poet","persuasion","choir","choir",8,"songbook","Give a crowd a song about the names no longer written in the municipal register."],
["furnace-minder","Furnace Minder","resolve","hands","soot",9,"ember-tool","Keep an exhausted crew safe during a shift the clocks insist has already ended."],
["glass-appraiser","Glass Appraiser","observation","ledger","market",9,"glass-rule","Determine which of two identical memories is a forgery."],
["whisper-broker","Whisper Broker","guile","ledger","market",11,"coded-card","Sell information without exposing the person who trusted you with it."],
["roof-patroller","Roof Patroller","resolve","wardens","soot",10,"roof-whistle","Patrol the high roofs where something enormous scratches at the false sky."],
["choir-gardener","Choir Gardener","persuasion","choir","choir",8,"singing-pot","Grow a light-bearing plant in a ward that cannot afford oil."],
["court-mediator","Court Mediator","persuasion","dawn","court",9,"civic-ribbon","Resolve a dispute between neighbours whose homes are missing from official plans."]
];
const advanced=[
["light-warden","Light Warden","resolve","wardens","court",22,"silver-oath","Lead a watch that must decide whether to guard the law or the people it has failed."],
["chief-archivist","Chief Archivist","observation","ledger","ink",21,"sealed-index","Protect the truth of an erased person against an order from above."],
["night-courier","Night Courier","guile","hands","quays",23,"shadow-route","Bring medicine through a street closed by the Council without endangering a household."],
["master-chorister","Master Chorister","persuasion","choir","choir",22,"harmonic-stone","Lead a forbidden concert that can restore a name to public memory."],
["furnace-surveyor","Furnace Surveyor","observation","hands","soot",21,"surveyor-lens","Expose the mechanism by which the city's fires consume more than fuel."],
["veil-diplomat","Veil Diplomat","persuasion","ledger","market",24,"silver-invitation","Negotiate a peaceful passage between factions that no longer speak."],
["cavern-sentinel","Cavern Sentinel","resolve","wardens","stairs",23,"sentinel-badge","Find a lost patrol beneath the Stairs before the thirteenth bell."],
["charter-keeper","Charter Keeper","guile","dawn","court",24,"new-charter","Make the Council honour a civic promise hidden from the public for decades."]
];
const professions=(data,tier)=>data.map(([id,name,stat,faction,place,wage,item,scene])=>({id,name,stat,faction,place,wage,tier,item,scene}));
e.professions=[...professions(first,1),...professions(advanced,2)];
Object.assign(e.items,Object.fromEntries(e.professions.map(p=>[p.item,p.name+"'s emblem"])));
for(const p of e.professions){
 e.stories.push({id:"profession-work-"+p.id,where:[p.place],title:"At work: "+p.name,description:p.scene,
  category:"profession",when:s=>s.profession===p.id,
  choices:[
   {label:"Perform the work carefully ("+p.stat+")",stat:p.stat,difficulty:p.tier===1?5:7,
    effects:{coin:p.tier===1?5:9,relation:{[p.faction]:1}},
    fail:p.stat==="resolve"?{health:-1}:{suspicion:1},
    success:"The work is done, though you know the city is not made safer by one shift. Your employer pays fairly for once.",
    failure:"The shift goes badly. Someone is helped, but you do not earn the extra payment or reputation this time."},
   {label:"Help a colleague with the most dangerous task",stat:"persuasion",difficulty:p.tier===1?5:7,
    effects:{coin:2,quirks:{generous:1},relation:{[p.faction]:1}},fail:{health:-1},
    success:"You share the work and learn the name of a person who has been trying to get by without being seen.",
    failure:"The colleague is grateful, but your help makes you both late. Neither forgets the effort."}
  ]});
}
const ordinary=[
["keeper-of-lanterns","Keeper of Lanterns","Your home will always have a light for a neighbour in need.","wardens"],
["river-witness","River Witness","You become a keeper of testimony that the Siltway cannot speak aloud.","hands"],
["friend-of-moss","Friend of Moss","The singing gardens will recognise your footsteps and open their gates.","choir"],
["margin-reader","Margin Reader","You are allowed to correct the smallest errors in the city's ledgers.","ledger"],
["unclaimed-courier","Unclaimed Courier","Letters without names will still find their way through your hands.","hands"],
["night-watch-guest","Guest of the Night Watch","The Wardens will share their fires with you on cold patrols.","wardens"],
["harbour-memory","The Harbour's Memory","Every boat that returns will carry a story you can remember.","dawn"],
["glass-hearted","The Glass-Hearted","You learn to recognise a counterfeit memory without hating its owner.","choir"],
["quiet-citizen","A Quiet Citizen","You build a small, defended peace, knowing what it does and does not cost.","dawn"]
];
const greater=[
["thirteenth-hour","Keeper of the Thirteenth Hour","You can hear when an erased hour begins, and bear witness to its passing.","ledger"],
["sunless-architect","Architect of the Sunless City","You help the city's districts design a safer light than the Council's furnace.","dawn"],
["moth-oath","Oath-Bearer of the Moths","No lamp may be denied to a household merely because its name is missing.","wardens"],
["true-shore","Witness of the True Shore","You preserve the river's promised coastline in law and in memory.","hands"],
["mirror-guardian","Guardian of First Memories","You defend the right of children to own their own remembered lives.","choir"],
["ash-honour","Honour of the Ash","The foundry workers choose you to keep the engine's cost visible.","hands"],
["unwritten-judge","Judge of the Unwritten","You weigh public truth against protection for those who cannot safely be named.","ledger"],
["singer-above","The Singer Above","You help every voice in the Moss Choir find its own verse.","choir"],
["night-ambassador","Ambassador to the Dark","You speak for the city at the very edge of things that refuse to be named.","dawn"],
["council-end","Breaker of the Council's Seal","You can call a public assembly when law is used to bury a person.","dawn"],
["last-light","The Last Light","You carry an independent lantern that burns when all official lamps fail.","wardens"]
];
e.destinies=[
 ...ordinary.map(([id,name,description,faction])=>({id,name,description,faction,tier:"ordinary",bonus:4})),
 ...greater.map(([id,name,description,faction])=>({id,name,description,faction,tier:"greater",bonus:10}))
];
})();