import assert from "node:assert/strict";
import {chromium} from "playwright";
import AxeBuilder from "@axe-core/playwright";

const browser=await chromium.launch({headless:true});
const base="http://127.0.0.1:8123";
let failures=0;
try{
 for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:820},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",err=>errors.push(err.message));
  const response=await page.goto(base,{waitUntil:"networkidle"});
  assert.equal(response.status(),200,"home page HTTP");
  assert.match(await page.title(),/The Undercity/);
  await page.locator('[data-act="intro"]').first().click();
  await page.locator('[data-act="origin"]').first().click();
  await page.locator('[data-act="faction"]').first().click();
  await page.locator('[data-act="escape"]').first().click();
  await page.locator("main h1").first().waitFor();
  if(width===390){
   const dims=await page.evaluate(()=>({w:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(dims.w<=dims.viewport+2,"mobile horizontal overflow: "+JSON.stringify(dims));
  }
  const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
  const severe=axe.violations.filter(v=>v.impact==="critical"||v.impact==="serious");
  for(const v of axe.violations)console.log("AXE "+width+"px "+v.impact+" "+v.id+" ("+v.nodes.length+" nodes): "+v.help);
  assert.equal(severe.length,0,"serious accessibility violations at "+width+"px");
  assert.deepEqual(errors,[],"runtime JavaScript errors at "+width+"px");
  console.log("BROWSER PASS "+width+"px · title, onboarding, escape, 0 JS errors, WCAG A/AA checks");
  await context.close();
 }
 const cmsContext=await browser.newContext({viewport:{width:1280,height:820}});
 const cmsPage=await cmsContext.newPage();
 const cmsErrors=[];
 cmsPage.on("pageerror",err=>cmsErrors.push(err.message));
 const cmsResponse=await cmsPage.goto(base+"/tools/cms/",{waitUntil:"networkidle"});
 assert.equal(cmsResponse.status(),200,"Narrative Studio HTML must load");
 assert.match(await cmsPage.title(),/QBN Studio/);
 await cmsPage.locator("#new-story").click();
 await cmsPage.locator("#editor").waitFor({state:"visible"});
 assert.deepEqual(cmsErrors,[],"Narrative Studio browser errors");
 console.log("BROWSER PASS Narrative Studio · editor creates draft and loads without JavaScript errors");
 await cmsContext.close();
}finally{await browser.close();}
