#!/usr/bin/env node
// Deterministic compiler for content/storylets/ambitions/second-acts.v1.json
import {readFileSync,writeFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
const src=new URL("../content/storylets/ambitions/second-acts.v1.json",import.meta.url);
const dest=new URL("../content/second-acts.generated.js",import.meta.url);
const spec=JSON.parse(readFileSync(src,"utf8"));
if(spec.schema_version!==1||spec.content_type!=="ambition-collection"||spec.chapters?.length!==66)throw Error("Expected 66 version-one second-act chapters");
const code="// Generated from content/storylets/ambitions/second-acts.v1.json. Do not edit directly.\n"+
'(function(){\n"use strict";\nconst e=window.UndercityExpansions ||= {stories:[],cards:[],items:{},professions:[],destinies:[]};\n'+
'const raw='+JSON.stringify(spec.chapters)+';\n'+
'for(const st of raw){\n const choices=st.choices.map(c=>({...c,when:c.requirement?function(s){return Object.entries(c.requirement).every(([k,v])=>s[k]===v)}:null}));\n'+
' e.stories.push({id:st.id,title:st.title,description:st.description,where:st.where,category:"ambition",once:true,chapter:st.progress+1,next_storylet:st.next_storylet,\n'+
'  when:s=>s.path===st.unlock.path&&s.pathProgress===st.unlock.ambition_progress,choices});\n}\n})();\n';
if(process.argv.includes("--check")){if(readFileSync(dest,"utf8")!==code){console.error("Second-act browser bundle is stale; run node scripts/build-second-acts.mjs");process.exitCode=1;}else console.log("Verified 66 additional chapters");}
else{writeFileSync(dest,code);console.log("Generated 66 ambition chapters");}
