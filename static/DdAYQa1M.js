import{_ as q,r as c,h as B,f as U,ag as W,q as w,G as P,c as j,a as s,b as l,w as o,S as F,o as S,d,l as H,m as X}from"#entry";import{V as K,f as J,b as Q,d as Y,a as Z,c as ee}from"./CUuAJ6Ty.js";import{V as te}from"./BLczs9VA.js";import{V as le}from"./D5rSoGI3.js";import{V as ae}from"./Caygb5uM.js";import{V as y}from"./DnvMyz26.js";import{V}from"./B-Hxcajx.js";import{V as oe,a as C}from"./DZIxpjna.js";import{V as k}from"./BJ3gVbLe.js";import"./BsiP8vYj.js";import"./D8bvMAuO.js";import"./BUz42rcT.js";import"./r6yzdEX_.js";import"./olVGSFH9.js";import"./D9cJH8h2.js";import"./CpIx0c_z.js";import"./Ci80T-cT.js";import"./DskjslOh.js";import"./Dn88HoyX.js";import"./BWZpj2fS.js";import"./I2Lz-SGT.js";import"./DNe2gOCb.js";import"./DZueW8-K.js";import"./v4BGuXz-.js";import"./DkogjsBj.js";const re=`輔一甲
特教一
教博一
復碩一
高照原民專班一
科博一
數一甲
物一甲
生一
化一
光博一
統資碩一
理學位碩一
科技機電產攜專班一
人管博一
車輛碩一
AI碩士學程一
智車一
技職碩一
英一
國一甲
地一
美一
科英碩一
翻譯碩一
台文碩一
歷碩一
機電一
電機一
電機博一
電子一
資工一
工學位碩一
資管一
會一甲
企管一
財金一
運一
運碩一
運健碩一
公育一
特殊學籍班(大學部)
特殊學籍學士班
特殊學籍碩博班
核心通識
物碩博
光電碩博
大三、四體育
歷大學
語文課
產業學士班
產業碩士班
地碩博
電機碩博
機電碩博
台碩博
國碩博
科技碩博
數碩博
科碩博
教碩博
輔導碩博

`,ne={class:"d-flex justify-center"},se={class:"d-flex"},ie={class:"conditional-area d-flex align-center"},ue={class:"d-flex flex-column ga-5"},ce={__name:"ClassToOthers",setup(de){const m=c(new Map),i=c(""),f=c(""),b=c(null),_=c(null),u=c("系所簡稱"),A=["系所簡稱","系所全名","學院簡稱","學院全名","系辦助理","系辦助理分機","系辦助理Email","課務承辦人","課務承辦人分機","課務承辦人Email"],v=c(!1);let g=null,x=null;const{$curridataAPI:N}=B(),L=e=>{e.preventDefault();const t=e.clipboardData.getData("text");i.value=t.trim()},I=()=>{i.value="",f.value=""},G=async()=>{try{if(!navigator.clipboard){alert("你的瀏覽器不支援剪貼簿功能，請手動複製。");return}await navigator.clipboard.writeText(f.value),v.value=!0}catch(e){console.error("複製失敗:",e),alert("複製失敗，請手動複製。")}},O=async()=>{try{if(!navigator.clipboard){alert("你的瀏覽器不支援剪貼簿功能，請手動複製。");return}await navigator.clipboard.writeText(re),v.value=!0}catch(e){console.error("複製失敗:",e),alert("複製失敗，請手動複製。")}},z=async()=>{const e=u.value==="系辦助理Email",t=u.value==="課務承辦人Email";if(!i.value||!e&&!t||!m.value.size)return;const a=e?"AGENT_EMAIL":"CAGENT_EMAIL",r=i.value.split(`
`),n=[];r.forEach(T=>{const R=T.trim(),E=m.value.get(R);E&&E[a]&&E[a]!=="查無資料"&&n.push(E[a])});const h=[...new Set(n)].join(`
`);try{if(!navigator.clipboard){alert("你的瀏覽器不支援剪貼簿功能，請手動複製。");return}await navigator.clipboard.writeText(h),v.value=!0}catch(T){console.error("複製失敗:",T),alert("複製失敗，請手動複製。")}};U(async()=>{try{const{data:a}=await N.get("/get_all_data");a.forEach(r=>{m.value.set(r.CLASS,r)}),console.log("資料已成功載入")}catch(a){console.error("載入資料失敗:",a)}const e=b.value?.$el.querySelector("textarea"),t=_.value?.$el.querySelector("textarea");if(e&&t){const a=p=>{p.target===e?t.scrollTop=e.scrollTop:p.target===t&&(e.scrollTop=t.scrollTop)};e.addEventListener("scroll",a),t.addEventListener("scroll",a);const r=()=>{t.style.height=`${e.offsetHeight}px`,t.style.width=`${e.offsetWidth}px`},n=()=>{e.style.height=`${t.offsetHeight}px`,e.style.width=`${t.offsetWidth}px`};g=new ResizeObserver(r),x=new ResizeObserver(n),g.observe(e),x.observe(t)}}),W(()=>{g&&g.disconnect(),x&&x.disconnect()});const M={系所全名:e=>e.DEPT,系所簡稱:e=>e.DEPT_S,學院全名:e=>e.COLLEGE,學院簡稱:e=>e.COLLEGE_S,系辦助理:e=>e.AGENT_NAME,系辦助理分機:e=>e.AGENT_EXT,系辦助理Email:e=>e.AGENT_EMAIL,課務承辦人:e=>e.CAGENT_NAME,課務承辦人分機:e=>e.CAGENT_EXT,課務承辦人Email:e=>e.CAGENT_EMAIL},D=w(()=>{if(!i.value||!m.value.size)return"";const e=i.value.split(`
`),t=M[u.value];return t?e.map(r=>{const n=r.trim(),p=m.value.get(n);return p&&t(p)||"查無資料"}).join(`
`):"無效選項"});P(D,e=>{f.value=e});const $=w(()=>A.reduce((r,n)=>r.length>n.length?r:n,"").length*10+80);return(e,t)=>(S(),j("div",ne,[s("div",null,[t[12]||(t[12]=s("h1",null,"班級簡稱轉換(114以後)",-1)),s("div",se,[l(K,{class:"my-2 my-card-wrapper",variant:"tonal",color:"indigo"},{default:o(()=>[l(J,null,{default:o(()=>[l(Q,null,{default:o(()=>[...t[4]||(t[4]=[d("使用教學",-1)])]),_:1}),l(Y,null,{default:o(()=>[...t[5]||(t[5]=[d("輸入限制：班級簡稱",-1)])]),_:1})]),_:1}),l(Z,null,{default:o(()=>[...t[6]||(t[6]=[s("ul",null,[s("li",null," 在左輸入框貼上從Excel複製的班級簡稱，右邊輸入框會自動產出結果。 "),s("li",null,"貼上後想看不同結果可選擇下拉選項"),s("li",null,"可將結果複製貼回Excel中使用。")],-1)])]),_:1}),l(ee,null,{default:o(()=>[l(y,{color:"indigo-lighten-3 text-white",variant:"elevated",onClick:O},{default:o(()=>[t[7]||(t[7]=d(" 點我複製範例 ",-1)),l(V,{icon:"mdi-content-copy",end:""})]),_:1})]),_:1})]),_:1})]),s("div",ie,[l(te,{modelValue:u.value,"onUpdate:modelValue":t[0]||(t[0]=a=>u.value=a),class:"function-selector mt-4 listitemheight",items:A,label:"功能選擇",style:F({maxWidth:`${$.value}px`}),density:"comfortable"},null,8,["modelValue","style"])]),l(le,{id:"mpage",class:"px-0"},{default:o(()=>[l(oe,{"no-gutters":"",class:"align-center"},{default:o(()=>[l(C,{cols:"auto"},{default:o(()=>[l(k,{ref_key:"inputRef",ref:b,modelValue:i.value,"onUpdate:modelValue":t[1]||(t[1]=a=>i.value=a),class:"resizable-textarea text-right",label:"輸入框",onPaste:L},null,8,["modelValue"])]),_:1}),l(C,{cols:"auto",class:"px-2 pb-5"},{default:o(()=>[s("div",ue,[u.value==="系辦助理Email"||u.value==="課務承辦人Email"?(S(),H(y,{key:0,color:"purple-lighten-3 text-grey-darken-4",onClick:z,variant:"elevated"},{default:o(()=>[t[8]||(t[8]=d(" Email ",-1)),l(V,{icon:"mdi-email-multiple-outline",end:""})]),_:1})):X("",!0),l(y,{color:"green-lighten-3 text-grey-darken-4",onClick:G},{default:o(()=>[t[9]||(t[9]=d(" Copy ",-1)),l(V,{icon:"mdi-content-copy",end:""})]),_:1}),l(y,{color:"blue-lighten-3 text-grey-darken-4",onClick:I},{default:o(()=>[t[10]||(t[10]=d(" Clear ",-1)),l(V,{icon:"mdi-close-circle-outline",end:""})]),_:1})])]),_:1}),l(C,{cols:"auto"},{default:o(()=>[l(k,{ref_key:"outputRef",ref:_,modelValue:f.value,"onUpdate:modelValue":t[2]||(t[2]=a=>f.value=a),class:"resizable-textarea",label:"輸出框"},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),l(ae,{modelValue:v.value,"onUpdate:modelValue":t[3]||(t[3]=a=>v.value=a),timeout:2e3,color:"success",location:"bottom right"},{default:o(()=>[...t[11]||(t[11]=[d(" 已複製到剪貼簿 ",-1)])]),_:1},8,["modelValue"])])]))}},De=q(ce,[["__scopeId","data-v-d757fe96"]]);export{De as default};
