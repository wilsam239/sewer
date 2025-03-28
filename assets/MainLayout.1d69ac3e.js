import{c as te,b as y,h as V,P as be,y as Ie,V as N,W as He,r as _,w,A as We,a6 as pt,g as Re,a7 as yt,S as H,Z as gt,a8 as bt,a9 as Z,aa as ce,L as Pe,U as fe,ab as ye,ac as ve,F as wt,ad as _t,ae as Ct,u as qt,af as kt,a as xt,ag as Bt,ah as Tt,ai as St,o as we,H as De,aj as R,ak as Oe,al as Pt,v as D,d as ae,e as Ue,i as L,j as A,k as c,l as d,am as U,x as k,s as X,p as Xe,Q as Ye,an as Ke,m as $,ao as Ge,t as Ze,ap as Le,N as Dt,aq as $e,ar as me,as as J,at as W,au as Ve,av as Me,aw as Ot,ax as Lt,ay as $t,G as Je,az as Qe,aA as E,aB as Vt,aC as Mt,aD as Qt}from"./index.72207687.js";import{c as At,Q as Ft,a as ge,b as zt}from"./QLayout.b45005d3.js";var _e=te({name:"QToolbarTitle",props:{shrink:Boolean},setup(t,{slots:l}){const u=y(()=>"q-toolbar__title ellipsis"+(t.shrink===!0?" col-shrink":""));return()=>V("div",{class:u.value},be(l.default))}}),Ce=te({name:"QToolbar",props:{inset:Boolean},setup(t,{slots:l}){const u=y(()=>"q-toolbar row no-wrap items-center"+(t.inset===!0?" q-toolbar--inset":""));return()=>V("div",{class:u.value,role:"toolbar"},be(l.default))}}),Et=te({name:"QHeader",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,revealOffset:{type:Number,default:250},bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(t,{slots:l,emit:u}){const{proxy:{$q:i}}=Re(),e=Ie(He,N);if(e===N)return console.error("QHeader needs to be child of QLayout"),N;const a=_(parseInt(t.heightHint,10)),r=_(!0),f=y(()=>t.reveal===!0||e.view.value.indexOf("H")>-1||i.platform.is.ios&&e.isContainer.value===!0),m=y(()=>{if(t.modelValue!==!0)return 0;if(f.value===!0)return r.value===!0?a.value:0;const v=a.value-e.scroll.value.position;return v>0?v:0}),s=y(()=>t.modelValue!==!0||f.value===!0&&r.value!==!0),o=y(()=>t.modelValue===!0&&s.value===!0&&t.reveal===!0),q=y(()=>"q-header q-layout__section--marginal "+(f.value===!0?"fixed":"absolute")+"-top"+(t.bordered===!0?" q-header--bordered":"")+(s.value===!0?" q-header--hidden":"")+(t.modelValue!==!0?" q-layout--prevent-focus":"")),C=y(()=>{const v=e.rows.value.top,S={};return v[0]==="l"&&e.left.space===!0&&(S[i.lang.rtl===!0?"right":"left"]=`${e.left.size}px`),v[2]==="r"&&e.right.space===!0&&(S[i.lang.rtl===!0?"left":"right"]=`${e.right.size}px`),S});function g(v,S){e.update("header",v,S)}function p(v,S){v.value!==S&&(v.value=S)}function P({height:v}){p(a,v),g("size",v)}function x(v){o.value===!0&&p(r,!0),u("focusin",v)}w(()=>t.modelValue,v=>{g("space",v),p(r,!0),e.animate()}),w(m,v=>{g("offset",v)}),w(()=>t.reveal,v=>{v===!1&&p(r,t.modelValue)}),w(r,v=>{e.animate(),u("reveal",v)}),w(e.scroll,v=>{t.reveal===!0&&p(r,v.direction==="up"||v.position<=t.revealOffset||v.position-v.inflectionPoint<100)});const b={};return e.instances.header=b,t.modelValue===!0&&g("size",a.value),g("space",t.modelValue),g("offset",m.value),We(()=>{e.instances.header===b&&(e.instances.header=void 0,g("size",0),g("offset",0),g("space",!1))}),()=>{const v=pt(l.default,[]);return t.elevated===!0&&v.push(V("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),v.push(V(At,{debounce:0,onResize:P})),V("header",{class:q.value,style:C.value,onFocusin:x},v)}}});const qe={left:!0,right:!0,up:!0,down:!0,horizontal:!0,vertical:!0},Nt=Object.keys(qe);qe.all=!0;function Ae(t){const l={};for(const u of Nt)t[u]===!0&&(l[u]=!0);return Object.keys(l).length===0?qe:(l.horizontal===!0?l.left=l.right=!0:l.left===!0&&l.right===!0&&(l.horizontal=!0),l.vertical===!0?l.up=l.down=!0:l.up===!0&&l.down===!0&&(l.vertical=!0),l.horizontal===!0&&l.vertical===!0&&(l.all=!0),l)}const jt=["INPUT","TEXTAREA"];function Fe(t,l){return l.event===void 0&&t.target!==void 0&&t.target.draggable!==!0&&typeof l.handler=="function"&&jt.includes(t.target.nodeName.toUpperCase())===!1&&(t.qClonedBy===void 0||t.qClonedBy.indexOf(l.uid)===-1)}function he(t,l,u){const i=ye(t);let e,a=i.left-l.event.x,r=i.top-l.event.y,f=Math.abs(a),m=Math.abs(r);const s=l.direction;s.horizontal===!0&&s.vertical!==!0?e=a<0?"left":"right":s.horizontal!==!0&&s.vertical===!0?e=r<0?"up":"down":s.up===!0&&r<0?(e="up",f>m&&(s.left===!0&&a<0?e="left":s.right===!0&&a>0&&(e="right"))):s.down===!0&&r>0?(e="down",f>m&&(s.left===!0&&a<0?e="left":s.right===!0&&a>0&&(e="right"))):s.left===!0&&a<0?(e="left",f<m&&(s.up===!0&&r<0?e="up":s.down===!0&&r>0&&(e="down"))):s.right===!0&&a>0&&(e="right",f<m&&(s.up===!0&&r<0?e="up":s.down===!0&&r>0&&(e="down")));let o=!1;if(e===void 0&&u===!1){if(l.event.isFirst===!0||l.event.lastDir===void 0)return{};e=l.event.lastDir,o=!0,e==="left"||e==="right"?(i.left-=a,f=0,a=0):(i.top-=r,m=0,r=0)}return{synthetic:o,payload:{evt:t,touch:l.event.mouse!==!0,mouse:l.event.mouse===!0,position:i,direction:e,isFirst:l.event.isFirst,isFinal:u===!0,duration:Date.now()-l.event.time,distance:{x:f,y:m},offset:{x:a,y:r},delta:{x:i.left-l.event.lastX,y:i.top-l.event.lastY}}}}let It=0;var pe=yt({name:"touch-pan",beforeMount(t,{value:l,modifiers:u}){if(u.mouse!==!0&&H.has.touch!==!0)return;function i(a,r){u.mouse===!0&&r===!0?wt(a):(u.stop===!0&&fe(a),u.prevent===!0&&Pe(a))}const e={uid:"qvtp_"+It++,handler:l,modifiers:u,direction:Ae(u),noop:gt,mouseStart(a){Fe(a,e)&&bt(a)&&(Z(e,"temp",[[document,"mousemove","move","notPassiveCapture"],[document,"mouseup","end","passiveCapture"]]),e.start(a,!0))},touchStart(a){if(Fe(a,e)){const r=a.target;Z(e,"temp",[[r,"touchmove","move","notPassiveCapture"],[r,"touchcancel","end","passiveCapture"],[r,"touchend","end","passiveCapture"]]),e.start(a)}},start(a,r){if(H.is.firefox===!0&&ce(t,!0),e.lastEvt=a,r===!0||u.stop===!0){if(e.direction.all!==!0&&(r!==!0||e.modifiers.mouseAllDir!==!0&&e.modifiers.mousealldir!==!0)){const s=a.type.indexOf("mouse")>-1?new MouseEvent(a.type,a):new TouchEvent(a.type,a);a.defaultPrevented===!0&&Pe(s),a.cancelBubble===!0&&fe(s),Object.assign(s,{qKeyEvent:a.qKeyEvent,qClickOutside:a.qClickOutside,qAnchorHandled:a.qAnchorHandled,qClonedBy:a.qClonedBy===void 0?[e.uid]:a.qClonedBy.concat(e.uid)}),e.initialEvent={target:a.target,event:s}}fe(a)}const{left:f,top:m}=ye(a);e.event={x:f,y:m,time:Date.now(),mouse:r===!0,detected:!1,isFirst:!0,isFinal:!1,lastX:f,lastY:m}},move(a){if(e.event===void 0)return;const r=ye(a),f=r.left-e.event.x,m=r.top-e.event.y;if(f===0&&m===0)return;e.lastEvt=a;const s=e.event.mouse===!0,o=()=>{i(a,s);let g;u.preserveCursor!==!0&&u.preservecursor!==!0&&(g=document.documentElement.style.cursor||"",document.documentElement.style.cursor="grabbing"),s===!0&&document.body.classList.add("no-pointer-events--children"),document.body.classList.add("non-selectable"),_t(),e.styleCleanup=p=>{if(e.styleCleanup=void 0,g!==void 0&&(document.documentElement.style.cursor=g),document.body.classList.remove("non-selectable"),s===!0){const P=()=>{document.body.classList.remove("no-pointer-events--children")};p!==void 0?setTimeout(()=>{P(),p()},50):P()}else p!==void 0&&p()}};if(e.event.detected===!0){e.event.isFirst!==!0&&i(a,e.event.mouse);const{payload:g,synthetic:p}=he(a,e,!1);g!==void 0&&(e.handler(g)===!1?e.end(a):(e.styleCleanup===void 0&&e.event.isFirst===!0&&o(),e.event.lastX=g.position.left,e.event.lastY=g.position.top,e.event.lastDir=p===!0?void 0:g.direction,e.event.isFirst=!1));return}if(e.direction.all===!0||s===!0&&(e.modifiers.mouseAllDir===!0||e.modifiers.mousealldir===!0)){o(),e.event.detected=!0,e.move(a);return}const q=Math.abs(f),C=Math.abs(m);q!==C&&(e.direction.horizontal===!0&&q>C||e.direction.vertical===!0&&q<C||e.direction.up===!0&&q<C&&m<0||e.direction.down===!0&&q<C&&m>0||e.direction.left===!0&&q>C&&f<0||e.direction.right===!0&&q>C&&f>0?(e.event.detected=!0,e.move(a)):e.end(a,!0))},end(a,r){if(e.event!==void 0){if(ve(e,"temp"),H.is.firefox===!0&&ce(t,!1),r===!0)e.styleCleanup!==void 0&&e.styleCleanup(),e.event.detected!==!0&&e.initialEvent!==void 0&&e.initialEvent.target.dispatchEvent(e.initialEvent.event);else if(e.event.detected===!0){e.event.isFirst===!0&&e.handler(he(a===void 0?e.lastEvt:a,e).payload);const{payload:f}=he(a===void 0?e.lastEvt:a,e,!0),m=()=>{e.handler(f)};e.styleCleanup!==void 0?e.styleCleanup(m):m()}e.event=void 0,e.initialEvent=void 0,e.lastEvt=void 0}}};if(t.__qtouchpan=e,u.mouse===!0){const a=u.mouseCapture===!0||u.mousecapture===!0?"Capture":"";Z(e,"main",[[t,"mousedown","mouseStart",`passive${a}`]])}H.has.touch===!0&&Z(e,"main",[[t,"touchstart","touchStart",`passive${u.capture===!0?"Capture":""}`],[t,"touchmove","noop","notPassiveCapture"]])},updated(t,l){const u=t.__qtouchpan;u!==void 0&&(l.oldValue!==l.value&&(typeof value!="function"&&u.end(),u.handler=l.value),u.direction=Ae(l.modifiers))},beforeUnmount(t){const l=t.__qtouchpan;l!==void 0&&(l.event!==void 0&&l.end(),ve(l,"main"),ve(l,"temp"),H.is.firefox===!0&&ce(t,!1),l.styleCleanup!==void 0&&l.styleCleanup(),delete t.__qtouchpan)}});function ee(t,l,u){return u<=l?l:Math.min(u,Math.max(l,t))}const ze=150;var Ht=te({name:"QDrawer",inheritAttrs:!1,props:{...Ct,...qt,side:{type:String,default:"left",validator:t=>["left","right"].includes(t)},width:{type:Number,default:300},mini:Boolean,miniToOverlay:Boolean,miniWidth:{type:Number,default:57},noMiniAnimation:Boolean,breakpoint:{type:Number,default:1023},showIfAbove:Boolean,behavior:{type:String,validator:t=>["default","desktop","mobile"].includes(t),default:"default"},bordered:Boolean,elevated:Boolean,overlay:Boolean,persistent:Boolean,noSwipeOpen:Boolean,noSwipeClose:Boolean,noSwipeBackdrop:Boolean},emits:[...kt,"onLayout","miniState"],setup(t,{slots:l,emit:u,attrs:i}){const e=Re(),{proxy:{$q:a}}=e,r=xt(t,a),{preventBodyScroll:f}=Pt(),{registerTimeout:m,removeTimeout:s}=Bt(),o=Ie(He,N);if(o===N)return console.error("QDrawer needs to be child of QLayout"),N;let q,C=null,g;const p=_(t.behavior==="mobile"||t.behavior!=="desktop"&&o.totalWidth.value<=t.breakpoint),P=y(()=>t.mini===!0&&p.value!==!0),x=y(()=>P.value===!0?t.miniWidth:t.width),b=_(t.showIfAbove===!0&&p.value===!1?!0:t.modelValue===!0),v=y(()=>t.persistent!==!0&&(p.value===!0||at.value===!0));function S(n,h){if(et(),n!==!1&&o.animate(),T(0),p.value===!0){const B=o.instances[K.value];B!==void 0&&B.belowBreakpoint===!0&&B.hide(!1),M(1),o.isContainer.value!==!0&&f(!0)}else M(0),n!==!1&&ie(!1);m(()=>{n!==!1&&ie(!0),h!==!0&&u("show",n)},ze)}function ke(n,h){tt(),n!==!1&&o.animate(),M(0),T(F.value*x.value),se(),h!==!0?m(()=>{u("hide",n)},ze):s()}const{show:le,hide:j}=Tt({showing:b,hideOnRouteChange:v,handleShow:S,handleHide:ke}),{addToHistory:et,removeFromHistory:tt}=St(b,j,v),Y={belowBreakpoint:p,hide:j},O=y(()=>t.side==="right"),F=y(()=>(a.lang.rtl===!0?-1:1)*(O.value===!0?1:-1)),xe=_(0),z=_(!1),ne=_(!1),Be=_(x.value*F.value),K=y(()=>O.value===!0?"left":"right"),oe=y(()=>b.value===!0&&p.value===!1&&t.overlay===!1?t.miniToOverlay===!0?t.miniWidth:x.value:0),ue=y(()=>t.overlay===!0||t.miniToOverlay===!0||o.view.value.indexOf(O.value?"R":"L")>-1||a.platform.is.ios===!0&&o.isContainer.value===!0),I=y(()=>t.overlay===!1&&b.value===!0&&p.value===!1),at=y(()=>t.overlay===!0&&b.value===!0&&p.value===!1),lt=y(()=>"fullscreen q-drawer__backdrop"+(b.value===!1&&z.value===!1?" hidden":"")),nt=y(()=>({backgroundColor:`rgba(0,0,0,${xe.value*.4})`})),Te=y(()=>O.value===!0?o.rows.value.top[2]==="r":o.rows.value.top[0]==="l"),ot=y(()=>O.value===!0?o.rows.value.bottom[2]==="r":o.rows.value.bottom[0]==="l"),ut=y(()=>{const n={};return o.header.space===!0&&Te.value===!1&&(ue.value===!0?n.top=`${o.header.offset}px`:o.header.space===!0&&(n.top=`${o.header.size}px`)),o.footer.space===!0&&ot.value===!1&&(ue.value===!0?n.bottom=`${o.footer.offset}px`:o.footer.space===!0&&(n.bottom=`${o.footer.size}px`)),n}),rt=y(()=>{const n={width:`${x.value}px`,transform:`translateX(${Be.value}px)`};return p.value===!0?n:Object.assign(n,ut.value)}),it=y(()=>"q-drawer__content fit "+(o.isContainer.value!==!0?"scroll":"overflow-auto")),st=y(()=>`q-drawer q-drawer--${t.side}`+(ne.value===!0?" q-drawer--mini-animate":"")+(t.bordered===!0?" q-drawer--bordered":"")+(r.value===!0?" q-drawer--dark q-dark":"")+(z.value===!0?" no-transition":b.value===!0?"":" q-layout--prevent-focus")+(p.value===!0?" fixed q-drawer--on-top q-drawer--mobile q-drawer--top-padding":` q-drawer--${P.value===!0?"mini":"standard"}`+(ue.value===!0||I.value!==!0?" fixed":"")+(t.overlay===!0||t.miniToOverlay===!0?" q-drawer--on-top":"")+(Te.value===!0?" q-drawer--top-padding":""))),dt=y(()=>{const n=a.lang.rtl===!0?t.side:K.value;return[[pe,mt,void 0,{[n]:!0,mouse:!0}]]}),ct=y(()=>{const n=a.lang.rtl===!0?K.value:t.side;return[[pe,Se,void 0,{[n]:!0,mouse:!0}]]}),ft=y(()=>{const n=a.lang.rtl===!0?K.value:t.side;return[[pe,Se,void 0,{[n]:!0,mouse:!0,mouseAllDir:!0}]]});function re(){ht(p,t.behavior==="mobile"||t.behavior!=="desktop"&&o.totalWidth.value<=t.breakpoint)}w(p,n=>{n===!0?(q=b.value,b.value===!0&&j(!1)):t.overlay===!1&&t.behavior!=="mobile"&&q!==!1&&(b.value===!0?(T(0),M(0),se()):le(!1))}),w(()=>t.side,(n,h)=>{o.instances[h]===Y&&(o.instances[h]=void 0,o[h].space=!1,o[h].offset=0),o.instances[n]=Y,o[n].size=x.value,o[n].space=I.value,o[n].offset=oe.value}),w(o.totalWidth,()=>{(o.isContainer.value===!0||document.qScrollPrevented!==!0)&&re()}),w(()=>t.behavior+t.breakpoint,re),w(o.isContainer,n=>{b.value===!0&&f(n!==!0),n===!0&&re()}),w(o.scrollbarWidth,()=>{T(b.value===!0?0:void 0)}),w(oe,n=>{Q("offset",n)}),w(I,n=>{u("onLayout",n),Q("space",n)}),w(O,()=>{T()}),w(x,n=>{T(),de(t.miniToOverlay,n)}),w(()=>t.miniToOverlay,n=>{de(n,x.value)}),w(()=>a.lang.rtl,()=>{T()}),w(()=>t.mini,()=>{t.noMiniAnimation||t.modelValue===!0&&(vt(),o.animate())}),w(P,n=>{u("miniState",n)});function T(n){n===void 0?De(()=>{n=b.value===!0?0:x.value,T(F.value*n)}):(o.isContainer.value===!0&&O.value===!0&&(p.value===!0||Math.abs(n)===x.value)&&(n+=F.value*o.scrollbarWidth.value),Be.value=n)}function M(n){xe.value=n}function ie(n){const h=n===!0?"remove":o.isContainer.value!==!0?"add":"";h!==""&&document.body.classList[h]("q-body--drawer-toggle")}function vt(){C!==null&&clearTimeout(C),e.proxy&&e.proxy.$el&&e.proxy.$el.classList.add("q-drawer--mini-animate"),ne.value=!0,C=setTimeout(()=>{C=null,ne.value=!1,e&&e.proxy&&e.proxy.$el&&e.proxy.$el.classList.remove("q-drawer--mini-animate")},150)}function mt(n){if(b.value!==!1)return;const h=x.value,B=ee(n.distance.x,0,h);if(n.isFinal===!0){B>=Math.min(75,h)===!0?le():(o.animate(),M(0),T(F.value*h)),z.value=!1;return}T((a.lang.rtl===!0?O.value!==!0:O.value)?Math.max(h-B,0):Math.min(0,B-h)),M(ee(B/h,0,1)),n.isFirst===!0&&(z.value=!0)}function Se(n){if(b.value!==!0)return;const h=x.value,B=n.direction===t.side,G=(a.lang.rtl===!0?B!==!0:B)?ee(n.distance.x,0,h):0;if(n.isFinal===!0){Math.abs(G)<Math.min(75,h)===!0?(o.animate(),M(1),T(0)):j(),z.value=!1;return}T(F.value*G),M(ee(1-G/h,0,1)),n.isFirst===!0&&(z.value=!0)}function se(){f(!1),ie(!0)}function Q(n,h){o.update(t.side,n,h)}function ht(n,h){n.value!==h&&(n.value=h)}function de(n,h){Q("size",n===!0?t.miniWidth:h)}return o.instances[t.side]=Y,de(t.miniToOverlay,x.value),Q("space",I.value),Q("offset",oe.value),t.showIfAbove===!0&&t.modelValue!==!0&&b.value===!0&&t["onUpdate:modelValue"]!==void 0&&u("update:modelValue",!0),we(()=>{u("onLayout",I.value),u("miniState",P.value),q=t.showIfAbove===!0;const n=()=>{(b.value===!0?S:ke)(!1,!0)};if(o.totalWidth.value!==0){De(n);return}g=w(o.totalWidth,()=>{g(),g=void 0,b.value===!1&&t.showIfAbove===!0&&p.value===!1?le(!1):n()})}),We(()=>{g!==void 0&&g(),C!==null&&(clearTimeout(C),C=null),b.value===!0&&se(),o.instances[t.side]===Y&&(o.instances[t.side]=void 0,Q("size",0),Q("offset",0),Q("space",!1))}),()=>{const n=[];p.value===!0&&(t.noSwipeOpen===!1&&n.push(R(V("div",{key:"open",class:`q-drawer__opener fixed-${t.side}`,"aria-hidden":"true"}),dt.value)),n.push(Oe("div",{ref:"backdrop",class:lt.value,style:nt.value,"aria-hidden":"true",onClick:j},void 0,"backdrop",t.noSwipeBackdrop!==!0&&b.value===!0,()=>ft.value)));const h=P.value===!0&&l.mini!==void 0,B=[V("div",{...i,key:""+h,class:[it.value,i.class]},h===!0?l.mini():be(l.default))];return t.elevated===!0&&b.value===!0&&B.push(V("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),n.push(Oe("aside",{ref:"content",class:st.value,style:rt.value},B,"contentclose",t.noSwipeClose!==!0&&p.value===!0,()=>ct.value)),V("div",{class:"q-drawer-container"},n)}}}),Ee;const Wt=typeof window!="undefined",Ne=()=>{};Wt&&((Ee=window==null?void 0:window.navigator)==null?void 0:Ee.userAgent)&&/iP(ad|hone|od)/.test(window.navigator.userAgent);function je(t){return typeof t=="function"?t():D(t)}function Rt(t,l){function u(...i){return new Promise((e,a)=>{Promise.resolve(t(()=>l.apply(this,i),{fn:l,thisArg:this,args:i})).then(e).catch(a)})}return u}function Ut(t,l={}){let u,i,e=Ne;const a=f=>{clearTimeout(f),e(),e=Ne};return f=>{const m=je(t),s=je(l.maxWait);return u&&a(u),m<=0||s!==void 0&&s<=0?(i&&(a(i),i=null),Promise.resolve(f())):new Promise((o,q)=>{e=l.rejectOnCancel?q:o,s&&!i&&(i=setTimeout(()=>{u&&a(u),i=null,o(f())},s)),u=setTimeout(()=>{i&&a(i),i=null,o(f())},m)})}}function Xt(t,l=200,u={}){return Rt(Ut(l,u),t)}const Yt=$("img",{src:"https://cdn.quasar.dev/logo-v2/svg/logo.svg"},null,-1),Kt=ae({__name:"NewPipelineDialog",props:{project:{}},setup(t){const l=t;Ue();const u=_(null);w(()=>l.project,e=>{});function i(){}return(e,a)=>(L(),A(D(Ke),{onHide:a[0]||(a[0]=r=>void 0),ref_key:"dialog",ref:u},{default:c(()=>[d(Ye,null,{default:c(()=>[d(Ce,null,{default:c(()=>[d(U,null,{default:c(()=>[Yt]),_:1}),d(_e,null,{default:c(()=>[k("Configure New Pipeline ")]),_:1}),R(d(X,{flat:"",round:"",dense:"",icon:"close"},null,512),[[Ge]])]),_:1}),d(Xe,null,{default:c(()=>[k(" TODO ")]),_:1})]),_:1})]),_:1},512))}}),Gt=$("img",{src:"https://cdn.quasar.dev/logo-v2/svg/logo.svg"},null,-1),Zt=ae({__name:"NewReleaseDialog",props:{project:{}},setup(t){const l=t;Ue();const u=_(null);w(()=>l.project,e=>{});function i(){}return(e,a)=>(L(),A(D(Ke),{onHide:a[0]||(a[0]=r=>void 0),ref_key:"dialog",ref:u},{default:c(()=>[d(Ye,null,{default:c(()=>[d(Ce,null,{default:c(()=>[d(U,null,{default:c(()=>[Gt]),_:1}),d(_e,null,{default:c(()=>[k("Configure New Release ")]),_:1}),R(d(X,{flat:"",round:"",dense:"",icon:"close"},null,512),[[Ge]])]),_:1}),d(Xe,null,{default:c(()=>[k(" TODO ")]),_:1})]),_:1})]),_:1},512))}}),Jt={class:"text-weight-medium"},ea={class:"text-grey-8"},ta={class:"text-weight-medium"},aa={class:"text-grey-8"},la={class:"text-grey-8 q-gutter-xs"},na=ae({__name:"ProjectList",setup(t){let l=[];const u=_([]),i=_(""),e=Je,a=_(void 0),r=_(void 0),f=Xt(()=>{console.log("Filtering with: "+i.value),i.value||(u.value=l),u.value=l.filter(m=>m.name.toLowerCase().includes(i.value.toLowerCase()))},300);return we(()=>{e.fetchProjects().pipe(Ze(m=>{l=m,u.value=m,e.loading=!1})).subscribe()}),(m,s)=>(L(),Le(Me,null,[d(Ft,{square:"",outlined:"",modelValue:i.value,"onUpdate:modelValue":[s[0]||(s[0]=o=>i.value=o),D(f)],label:"Filter Projects"},{prepend:c(()=>[d(Dt,{name:"search"})]),_:1},8,["modelValue","onUpdate:modelValue"]),d(Lt,{bordered:"",class:"rounded-borders"},{default:c(()=>[R((L(),A(Ve,{clickable:"",to:"all"},{default:c(()=>[d(U,{rounded:"",class:"q-mr-md",style:$e({backgroundColor:D(e).generateColor("all")})},{default:c(()=>[k(" A ")]),_:1},8,["style"]),d(me,null,{default:c(()=>[d(J,{lines:"1"},{default:c(()=>[$("span",Jt,[d(W,null,{default:c(()=>[k("Favourite Projects")]),_:1}),k(" Favourite Projects ")])]),_:1}),d(J,{lines:"1"},{default:c(()=>[$("span",ea,[d(W,null,{default:c(()=>[k("View pipelines for all projects")]),_:1}),k(" View pipelines for all projects ")])]),_:1})]),_:1})]),_:1})),[[Qe]]),(L(!0),Le(Me,null,Ot(u.value,o=>R((L(),A(Ve,{key:o.id,clickable:"",to:"/dashboard/"+o.id},{default:c(()=>[d(U,{rounded:"",class:"q-mr-md",style:$e({backgroundColor:D(e).generateColor(o.name)})},{default:c(()=>[k(E(o.name[0].toUpperCase()),1)]),_:2},1032,["style"]),d(me,null,{default:c(()=>[d(J,{lines:"1"},{default:c(()=>[$("span",ta,[d(W,null,{default:c(()=>[k(E(o.name),1)]),_:2},1024),k(" "+E(o.name),1)])]),_:2},1024),d(J,{lines:"1"},{default:c(()=>[$("span",aa,[d(W,null,{default:c(()=>[k(E(o.description),1)]),_:2},1024),k(" "+E(o.description),1)])]),_:2},1024)]),_:2},1024),d(me,{side:""},{default:c(()=>[$("div",la,[d(X,{size:"12px",flat:"",dense:"",round:"",icon:D(e).favourites.has(o.id)?"favorite":"favorite_border",onClick:Vt(q=>D(e).alterFavourite(o),["stop"])},null,8,["icon","onClick"])])]),_:2},1024)]),_:2},1032,["to"])),[[Qe]])),128))]),_:1}),r.value==="pipeline"?(L(),A(ge,{key:0},{default:c(()=>[d(Kt,{project:a.value},null,8,["project"])]),_:1})):r.value==="release"?(L(),A(ge,{key:1},{default:c(()=>[d(Zt,{project:a.value},null,8,["project"])]),_:1})):$t("",!0)],64))}}),oa=$("img",{src:"icons/pipe-white.png"},null,-1),sa=ae({__name:"MainLayout",setup(t){const l=Je,u=_(0),i=_(!1);_(!1),_(!1);const e=_(!1);function a(){i.value=!i.value}return we(()=>{l.loadingState.pipe(Ze(r=>{e.value=r})).subscribe(),setInterval(()=>{u.value=Math.round((l.expiry-Date.now())/1e3/60)},5e3)}),(r,f)=>{const m=Mt("router-view");return L(),A(zt,{view:"hHh LpR fFf"},{default:c(()=>[d(Et,{elevated:"",class:"bg-primary text-white"},{default:c(()=>[d(Ce,null,{default:c(()=>[d(X,{dense:"",flat:"",round:"",icon:"menu",onClick:a}),d(_e,null,{default:c(()=>[d(U,null,{default:c(()=>[oa]),_:1}),k(" Sewer "),$("span",null,"v"+E(D(Qt)),1)]),_:1}),d(X,{dense:"",flat:"",round:"",icon:"logout",onClick:f[0]||(f[0]=s=>D(l).logout())},{default:c(()=>[d(W,null,{default:c(()=>[k("Logout")]),_:1})]),_:1})]),_:1})]),_:1}),d(Ht,{"show-if-above":"",modelValue:i.value,"onUpdate:modelValue":f[1]||(f[1]=s=>i.value=s),side:"left",bordered:""},{default:c(()=>[d(na)]),_:1},8,["modelValue"]),d(ge,null,{default:c(()=>[d(m)]),_:1})]),_:1})}}});export{sa as default};
