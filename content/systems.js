/* Supporting systems for The Undercity: no external dependencies. */
(function(){
"use strict";
// All twenty categories explicitly named in the design specification.
const slots=["boon","hat","clothing","adornment","gloves","weapon","boots","luggage","companion","treasure","destiny","tools of the trade","affiliation","transport","home comfort","ship","crew","airship","spouse","club"];
const gear={
charcoal:["tools of the trade","observation",1],hook:["weapon","guile",1],silk:["gloves","persuasion",1],
badge:["affiliation","resolve",1],lure:["companion","observation",1],map:["luggage","observation",1],
"moth-lance":["weapon","resolve",4],"quiet-bell":["tools of the trade","observation",3],
"mirror-key":["treasure","guile",3],"ember-crown":["hat","persuasion",3],
"reader-lens":["hat","observation",4],"runner-token":["transport","guile",4],
"warden-scar":["clothing","resolve",4],"speaker-song":["affiliation","persuasion",4],
"silver-flame":["tools of the trade","resolve",1],"margin-pen":["tools of the trade","observation",1],
"runner-boots":["boots","guile",1],"songbook":["treasure","persuasion",1],
"roof-whistle":["tools of the trade","resolve",1],"surveyor-lens":["hat","observation",2],
"new-charter":["treasure","persuasion",2]
};
const living=[
 {id:"clockmaker-post",delay:3600000,title:"A note from the clockmaker",
 text:"Eda found a fingerprint inside the handless clock that belongs to nobody on the city register. She encloses three pennies for your investigation.",
 trigger:s=>s.ambition>=1,effects:{coin:3,clues:1}},
 {id:"personal-warning",delay:14400000,title:"A warning for your private undertaking",
 text:"A stranger has written down the cause you chose. The signature is missing, but the warning is clear: the Council is listening.",
 trigger:s=>s.pathProgress>=2,effects:{coin:4}},
 {id:"choir-reply",delay:86400000,title:"The Choir remembers",
 text:"The Moss Choir has composed a verse for somebody you helped. They invite you back to hear it among the flowers.",
 trigger:s=>(s.renown?.persuasion||0)>=2||(s.relation?.choir||0)>=4,effects:{relation:{choir:1},sanity:1}},
 {id:"watch-response",delay:604800000,title:"A letter from the Ash Wardens",
 text:"A place has been prepared beside the Wardens' watch fires. The sealed letter is an invitation rather than a summons.",
 trigger:s=>s.clues>=4,effects:{relation:{wardens:2},coin:5}}
];
for(const entry of Object.values(gear)){
 const old=entry[0];entry[0]=({"tool":"tools of the trade","route":"luggage","possession":"adornment","burden":"luggage","menace":"boon"})[old]||old;
}
window.UndercitySystems={slots,gear,living};
})();