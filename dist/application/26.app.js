(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{326:function(e,n,t){"use strict";t.r(n),t.d(n,"HeaderView",function(){return p});var a=t(0),c=t(8),l=t(3),o=t(7),i=t(148),r=t(138),s=t(141),m=t(1);let p=class extends m.Component{render(){return m.createElement("div",{className:"header-component"},m.createElement(c.k,null,m.createElement(c.c,{span:8},m.createElement("section",{className:"menu-button"},m.createElement(i.a,{onClick:()=>{l.r.show()},disabled:!1,iconProps:{iconName:"GlobalNavButton"},title:"GlobalNavButton",ariaLabel:"GlobalNavButton"}))),m.createElement(c.c,{span:8},m.createElement("section",{className:"title"},Object(l.A)(l.x.currentNamespace||"Home"))),m.createElement(c.c,{span:8},m.createElement("section",{className:"right-buttons"},l.z.online?m.createElement(r.a,{content:Object(l.A)("Sync with server")},m.createElement(i.a,{onClick:()=>a.b(this,void 0,void 0,function*(){l.x.reSyncing=!0,yield l.w.resync(),l.x.reSyncing=!1}),iconProps:{iconName:"Sync"},className:l.x.reSyncing?"rotate":"",title:"Re-Sync"})):m.createElement("span",{className:"offline"},m.createElement(s.a,{iconName:"WifiWarning4"})),m.createElement(r.a,{content:Object(l.A)("User panel")},m.createElement(i.a,{onClick:()=>l.B.visible=!0,disabled:!1,iconProps:{iconName:"Contact"}}))))))}};p=a.c([o.a],p)}}]);