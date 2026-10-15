const ext=globalThis.UndercityExpansions||{stories:[],items:{}};
export const project={
 game:"undercity",name:"The Undercity Studio",
 stats:["observation","guile","persuasion","resolve"],
 menaces:["suspicion","notoriety","wounds","delirium"],
 quirks:["generous","ruthless","cautious","bold","honest","devious","steadfast","fickle","subtle"],
 locations:["cell","court","ink","quays","market","choir","soot","stairs","edge","watch-house","tribunal","ward","pale-rooms"].filter(Boolean),
 items:Object.keys(ext.items||{}),knownIds:(ext.stories||[]).map(x=>x.id),
 forbidden:["Fallen London","Watchful","Shadowy","Dangerous"],
 sourceInfo:"Existing stories remain in their original JavaScript and JSON packs. New approved JSON is compiled into content/cms-published.js.",
 published:(ext.stories||[]).map(s=>({id:s.id,title:s.title||s.id,location:s.where?.[0]||"court",text:s.description||"",choices:s.choices||[]}))
};