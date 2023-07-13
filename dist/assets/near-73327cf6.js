import{h as U,r,R as j,c as y,a as o,M as l,K as i,F as C,a0 as I,u as k,E as Y,G as z,$ as p,o as g,I as G,P as u,J as B}from"./index-7e9e7429.js";import{$ as K,a as O,q as R,g as W}from"./displayArea-3dfd8e31.js";const Q={class:"near_box"},X={id:"first_row"},Z={class:"first_row_col2"},nn={class:"noticebar"},en={class:"wanrn_detaill"},tn={class:"classification"},an={class:"no_data"},pn={__name:"near",setup(on){U(()=>{F(),x("hydrographicStation",h.value)});const M=["冰雹橙色.png","冰雹红色.png","冰雹黄色.png","台风橙色.png","台风红色.png","台风蓝色.png","台风黄色.png","大雾橙色.png","大雾红色.png","大雾蓝色.png","大雾黄色.png","大风橙色.png","大风红色.png","大风蓝色.png","大风黄色.png","干旱橙色.png","干旱红色.png","干旱蓝色.png","干旱黄色.png","暴雨橙色.png","暴雨红色.png","暴雨蓝色.png","暴雨黄色.png","暴雪橙色.png","暴雪红色.png","暴雪蓝色.png","暴雪黄色.png","沙尘暴橙色.png","沙尘暴红色.png","沙尘暴蓝色.png","沙尘暴黄色.png","海上大雾橙色.png","海上大风橙色.png","海上大风蓝色.png","海上大风黄色.png","雷暴大雨红色.png","雷暴大风橙色.png","雷暴大风蓝色.png","雷暴大风黄色.png","雷电橙色.png","雷电红色.png","雷电蓝色.png","雷电黄色.png","雷雨大风橙色.png","雷雨大风红色.png","雷雨大风蓝色.png","雷雨大风黄色.png","高温橙色.png","高温红色.png","高温蓝色.png","高温黄色.png"],D=r(0),S=[{text:"东莞市",value:0},{text:"河源市",value:1},{text:"惠州市",value:2},{text:"深圳市",value:3},{text:"广州市",value:4},{text:"韶关市",value:5},{text:"梅州市",value:6}];let h=r("东莞市");const q=n=>{let e=S.find((s,a)=>a==n);h.value=e.text,x("hydrographicStation",h.value),d.length>=0&&V(0)},A=n=>{const e=new Date(n),s=e.getFullYear(),a=e.getMonth()+1,_=e.getDate(),v=e.getHours(),m=e.getMinutes();return`${s}年${a}月${_}日${v}时${m}分`};let c=j([]);const F=()=>{K.ajax({url:"http://open.gd121.cn/share/data/getYJ.do?type=json&key=0b9fdc1c7526ae60e6ba59f82453aa3a&logType=warn",method:"get",success:function(n){c.push(n.东莞[0]),c.push(n.河源[0]),c.push(n.惠州[0]),c.push(n.深圳[0]),c.push(n.广州[0]),c.push(n.韶关[0]),c.forEach(e=>{e.publishtime=A(e.publishtime)}),c.forEach(e=>{const s=M.find(a=>a.includes(e.warn));s&&(e.pic=`./warning/${s}`)}),console.log("warningCityArr",c)}})},N=[{image:"./classIcon/stations.png",text:"水文站",type:"hydrographicStation"},{image:"./classIcon/aqueduct.png",text:"人工渠",type:"artificialCanal"},{image:"./classIcon/river.png",text:"河流",type:"river"},{image:"./classIcon/lake.png",text:"湖泊",type:"lake"},{image:"./classIcon/disaster.png",text:"灾害",type:"disaster"},{image:"./classIcon/humanact.png",text:"人文活动",type:"humanisticActivity"},{image:"./classIcon/cityview.png",text:"城市景点",type:""},{image:"./classIcon/heritage.png",text:"文化遗产",type:"culturalHeritage"},{image:"./classIcon/museum.png",text:"博物馆",type:"museum"},{image:"./classIcon/more.png",text:"更多",type:""}];let d=j([]);const b=r(null),V=(n,e)=>{b.value=e,d.length=0,x(n.type,h.value)},f=r(null),w=r(null),$=r(null),H=r(null),J=()=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(n=>{console.log("position",n),f.value=n.coords.latitude,w.value=n.coords.longitude;const e=f.value,s=w.value;$.value=null,W(s,e).then(a=>{a.street&&(H.value=a)})},n=>{n.value=n.message,f.value=null,w.value=null}):$.value="浏览器不支持地理位置获取"},x=(n,e)=>{console.log("city",e);const s={type:n,localtion:{district:"",nation:"中国",province:"广东省",city:e,street:"",street_number:""}};O.post("https://eslab.dgut.edu.cn/getDongjiangTypeList",R.stringify(s)).then(a=>{console.log("分类数据",a),a.data.data.forEach(_=>{d.push(_)})}).catch(a=>{console.error(a)})};return(n,e)=>{const s=p("van-dropdown-item"),a=p("van-dropdown-menu"),_=p("van-search"),v=p("van-image"),m=p("van-col"),E=p("van-row"),P=p("van-swipe-item"),T=p("van-swipe");return g(),y("div",Q,[o("div",X,[o("div",{class:"first_row_col1",onClick:J},[l(a,null,{default:i(()=>[l(s,{modelValue:D.value,"onUpdate:modelValue":e[0]||(e[0]=t=>D.value=t),options:S,onChange:q},null,8,["modelValue"])]),_:1})]),o("div",Z,[l(_,{modelValue:n.value,"onUpdate:modelValue":e[1]||(e[1]=t=>n.value=t),placeholder:"搜索附近",onSearch:n.onSearch,onCancel:n.onCancel},null,8,["modelValue","onSearch","onCancel"])])]),o("div",null,[l(E,null,{default:i(()=>[(g(),y(C,null,I(N,(t,L)=>l(m,{id:"each_detail",key:t.text,span:4.8},{default:i(()=>[l(v,{src:t.image,onClick:sn=>V(t,L),fit:"contain",class:G({selected:L==b.value})},null,8,["src","onClick","class"]),o("p",null,u(t.text),1)]),_:2},1032,["span"])),64))]),_:1})]),o("div",nn,[l(T,{class:"wanring-swipe",autoplay:3e3,"indicator-color":"gray"},{default:i(()=>[(g(!0),y(C,null,I(k(c),t=>(g(),B(P,{key:t.city},{default:i(()=>[l(v,{class:"swiperImage",src:t.pic,fit:"contain"},null,8,["src"]),o("div",en,[o("div",null,u(t.publishtime),1),o("div",null,u(t.city),1),o("div",null,u(t.warn),1)])]),_:2},1024))),128))]),_:1})]),o("div",tn,[(g(!0),y(C,null,I(k(d),t=>(g(),B(E,{key:t.text,class:"each_classify",justify:"center"},{default:i(()=>[l(m,{span:"10"},{default:i(()=>[l(v,{class:"swiperImage",src:"./no-image.png",fit:"cover"})]),_:1}),l(m,{class:"each_classify_detail",span:"14"},{default:i(()=>[o("div",null,u(t.name),1),o("div",null,u(t.intro),1)]),_:2},1024)]),_:2},1024))),128)),Y(o("div",an,"暂无数据",512),[[z,k(d).length==0]])])])}}};export{pn as default};