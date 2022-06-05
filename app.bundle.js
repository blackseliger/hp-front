(()=>{var e,t={6114:(e,t,r)=>{var n={"./editor/index.js":[234,762,856],"./error404/index.js":[7232,854]};function a(e){if(!r.o(n,e))return Promise.resolve().then(()=>{var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t});var t=n[e],a=t[0];return Promise.all(t.slice(1).map(r.e)).then(()=>r(a))}a.keys=()=>Object.keys(n),a.id=6114,e.exports=a}},r={};function n(e){var a=r[e];if(void 0!==a)return a.exports;var o=r[e]={id:e,loaded:!1,exports:{}};return t[e].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}n.m=t,n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce((t,r)=>(n.f[r](e,t),t),[])),n.u=e=>(({854:"error404-index-js",856:"editor-index-js"}[e]||e)+"-"+e+".js"),n.miniCssF=e=>{},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},n.l=(t,r,a,o)=>{if(e[t])e[t].push(r);else{var i,s;if(void 0!==a)for(var d=document.getElementsByTagName("script"),u=0;u<d.length;u++){var l=d[u];if(l.getAttribute("src")==t||l.getAttribute("data-webpack")=="hp-front:"+a){i=l;break}}i||(s=!0,(i=document.createElement("script")).charset="utf-8",i.timeout=120,n.nc&&i.setAttribute("nonce",n.nc),i.setAttribute("data-webpack","hp-front:"+a),i.src=t),e[t]=[r];var c=(r,n)=>{i.onerror=i.onload=null,clearTimeout(h);var a=e[t];if(delete e[t],i.parentNode&&i.parentNode.removeChild(i),a&&a.forEach(e=>e(n)),r)return r(n)},h=setTimeout(c.bind(null,void 0,{type:"timeout",target:i}),12e4);i.onerror=c.bind(null,i.onerror),i.onload=c.bind(null,i.onload),s&&document.head.appendChild(i)}},n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),n.p="",(()=>{var e={143:0};n.f.j=(t,r)=>{var a=n.o(e,t)?e[t]:void 0;if(0!==a)if(a)r.push(a[2]);else{var o=new Promise((r,n)=>a=e[t]=[r,n]);r.push(a[2]=o);var i=n.p+n.u(t),s=new Error;n.l(i,r=>{if(n.o(e,t)&&(0!==(a=e[t])&&(e[t]=void 0),a)){var o=r&&("load"===r.type?"missing":r.type),i=r&&r.target&&r.target.src;s.message="Loading chunk "+t+" failed.\n("+o+": "+i+")",s.name="ChunkLoadError",s.type=o,s.request=i,a[1](s)}},"chunk-"+t,t)}};var t=(t,r)=>{var a,o,[i,s,d]=r,u=0;if(i.some(t=>0!==e[t])){for(a in s)n.o(s,a)&&(n.m[a]=s[a]);if(d)d(n)}for(t&&t(r);u<i.length;u++)o=i[u],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0},r=self.webpackChunkhp_front=self.webpackChunkhp_front||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})(),(()=>{"use strict";class e{constructor(){this.routes=[],this.initEventListeners()}initEventListeners(){document.addEventListener("click",e=>{const t=e.target.closest("a");if(!t)return;const r=t.getAttribute("href");r&&r.startsWith("/")&&(e.preventDefault(),this.navigate(r))})}static instance(){return this._instance||(this._instance=new e),this._instance}async route(){let e,t=decodeURI(window.location.pathname).replace(/^\/|\/$/,"");for(let r of this.routes)if(e=t.match(r.pattern),e){this.page=await this.changePage(r.path,e);break}e||(this.page=await this.changePage(this.notFoundPagePath)),document.dispatchEvent(new CustomEvent("route",{detail:{page:this.page}}))}async changePage(e,t){return this.page&&this.page.destroy&&this.page.destroy(),await async function(e,t){const r=document.querySelector("main");r.classList.add("is-loading");const{default:a}=await n(6114)(`./${e}/index.js`),o=new a,i=await o.render();r.classList.remove("is-loading");const s=document.querySelector("#content");return s.innerHTML="",s.append(i),o}(e)}navigate(e){history.pushState(null,null,e),this.route()}addRoute(e,t){return this.routes.push({pattern:e,path:t}),this}setNotFoundPagePath(e){return this.notFoundPagePath=e,this}listen(){window.addEventListener("popstate",()=>this.route()),this.route()}}e.instance().addRoute(/^$/,"editor").addRoute(/^404\/?$/,"error404").setNotFoundPagePath("editor").listen()})()})();
//# sourceMappingURL=app.bundle.js.map