import{R as v,c as s,M as i,a,P as p,K as d,$ as n,o,F as g,a0 as k,J as h}from"./index-7e9e7429.js";const f={class:"my-page"},y={class:"user-info"},B=["src"],C={class:"username"},U={__name:"user",setup(x){const e=v({avatarUrl:"./user.jpg",username:"jacklove",menuItems:[{title:"我的标记",icon:"star-o",action:"myBookmarks"},{title:"意见反馈",icon:"chat-o",action:"feedback"},{title:"账号管理",icon:"setting-o",action:"accountManagement"},{title:"关于我们",icon:"info-o",action:"aboutUs"}]}),r=c=>{switch(c.action){}};return(c,b)=>{const l=n("van-image"),_=n("van-cell"),u=n("van-cell-group");return o(),s("div",f,[i(l,{src:"./userback.png",fit:"cover"}),a("div",y,[a("img",{class:"avatar",src:e.avatarUrl},null,8,B),a("div",C,p(e.username),1)]),i(u,null,{default:d(()=>[(o(!0),s(g,null,k(e.menuItems,(t,m)=>(o(),h(_,{key:m,title:t.title,icon:t.icon,"arrow-direction":"right",onClick:w=>r(t)},null,8,["title","icon","onClick"]))),128))]),_:1})])}}};export{U as default};
