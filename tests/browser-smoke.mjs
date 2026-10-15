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
  // Choosing an action must navigate into a visible, clearly announced outcome
  // without requiring a manual upward scroll (especially at mobile widths).
  const firstResult=page.locator("#action-result");
  await firstResult.waitFor({state:"visible"});
  assert.equal(await firstResult.getAttribute("role"),"region");
  assert.match(await firstResult.innerText(),/Your action has resolved/i);
  const receipt=await page.evaluate(()=>{
   const card=document.querySelector("#action-result"),header=document.querySelector("header");
   const rect=card.getBoundingClientRect();
   return {top:rect.top,headerBottom:header.getBoundingClientRect().bottom,
    focus:document.activeElement?.id,viewport:window.innerHeight};
  });
  assert.equal(receipt.focus,"action-result","result is keyboard/screen-reader focus after escape");
  assert.ok(receipt.top>=receipt.headerBottom-4,"result starts beneath sticky header: "+JSON.stringify(receipt));
  assert.ok(receipt.top<receipt.viewport*.8,"result is visible without scrolling: "+JSON.stringify(receipt));
  await page.locator('[data-act="dismiss"]').first().click();
  assert.equal(await page.locator("#action-result").count(),0);
  const choices=page.locator('main button[data-act="choose"]:not([disabled])');
  assert.ok(await choices.count()>0,"starting district has playable story choices");
  await choices.first().scrollIntoViewIfNeeded();
  await choices.first().click();
  await firstResult.waitFor({state:"visible"});
  const resultView=await page.evaluate(()=>{
   const el=document.querySelector("#action-result");
   return {top:el.getBoundingClientRect().top,headerBottom:document.querySelector("header").getBoundingClientRect().bottom,
    focus:document.activeElement?.id,viewport:innerHeight,scroll:scrollY};
  });
  assert.equal(resultView.focus,"action-result","chosen branch receives focus");
  assert.ok(resultView.top>=resultView.headerBottom-4,"branch result is not obscured: "+JSON.stringify(resultView));
  assert.ok(resultView.top<resultView.viewport*.8,"branch result appears on screen: "+JSON.stringify(resultView));
  assert.match(await firstResult.innerText(),/You chose:/,"player sees which branch was played");
  assert.match(await firstResult.innerText(),/What changed/i,"quality and action deltas shown");
  await page.locator('[data-act="dismiss"]').first().click();
  assert.equal(await page.locator("#action-result").count(),0);
  // A Read card tap from the bottom of the mobile page must present the
  // actual selected opportunity, not merely scroll to the district hero.
  const handCard=page.locator('aside.aside-right button[data-act="card"]').first();
  assert.ok(await handCard.count()>0,"opening hand has opportunity cards");
  await handCard.click();
  const openCard=page.locator("#open-storylet");
  await openCard.waitFor({state:"visible"});
  const cardView=await page.evaluate(()=>{
   const el=document.querySelector("#open-storylet");
   return {top:el.getBoundingClientRect().top,headerBottom:document.querySelector("header").getBoundingClientRect().bottom,
    focus:document.activeElement?.id,viewport:innerHeight};
  });
  assert.equal(cardView.focus,"open-storylet","Read card moves keyboard focus to actual card");
  assert.ok(cardView.top>=cardView.headerBottom-4,"open card clears header: "+JSON.stringify(cardView));
  assert.ok(cardView.top<cardView.viewport*.8,"selected card is visible: "+JSON.stringify(cardView));
  assert.match(await openCard.innerText(),/Opportunity card/i);
  await page.locator('#open-storylet button[data-act="dismiss"]').click();
  assert.equal(await openCard.count(),0,"putting card away restores the district");
  if(width===390){
   const dims=await page.evaluate(()=>({w:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(dims.w<=dims.viewport+2,"mobile horizontal overflow: "+JSON.stringify(dims));
  }
  const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
  const severe=axe.violations.filter(v=>v.impact==="critical"||v.impact==="serious");
  for(const v of axe.violations)console.log("AXE "+width+"px "+v.impact+" "+v.id+" ("+v.nodes.length+" nodes): "+v.help);
  assert.equal(severe.length,0,"serious accessibility violations at "+width+"px");
  assert.deepEqual(errors,[],"runtime JavaScript errors at "+width+"px");
  console.log("BROWSER PASS "+width+"px · outcomes, opportunity cards, auto-scroll, keyboard focus, continue, 0 JS errors, WCAG A/AA");
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
