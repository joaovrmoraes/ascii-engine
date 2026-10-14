(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ml="186",Gp=0,Mh=1,Hp=2,gr=1,Vp=2,ur=3,Ii=0,hn=1,Sn=2,hi=0,xr=1,Sh=2,bh=3,wh=4,Wp=5,ws=100,Xp=101,$p=102,qp=103,Yp=104,Kp=200,Jp=201,Zp=202,jp=203,mf=204,gf=205,Qp=206,e0=207,t0=208,n0=209,i0=210,s0=211,r0=212,o0=213,a0=214,xc=0,ko=1,vc=2,Er=3,_c=4,yc=5,Mc=6,Sc=7,xf=0,c0=1,l0=2,$n=0,vf=1,_f=2,yf=3,Mf=4,Sf=5,bf=6,wf=7,Eh="attached",h0="detached",Ef=300,Qi=301,Os=302,pa=303,ma=304,ta=306,es=1e3,Wn=1001,Go=1002,Bt=1003,Af=1004,fr=1005,ft=1006,Co=1007,wn=1008,pn=1009,Tf=1010,Rf=1011,Ar=1012,Sl=1013,Nn=1014,cn=1015,Yn=1016,bl=1017,wl=1018,Tr=1020,Cf=35902,Pf=35899,If=1021,Lf=1022,rn=1023,fi=1026,$i=1027,zr=1028,El=1029,ts=1030,Al=1031,Tl=1033,Po=33776,Io=33777,Lo=33778,Do=33779,bc=35840,wc=35841,Ec=35842,Ac=35843,Tc=36196,Rc=37492,Cc=37496,Pc=37488,Ic=37489,Ho=37490,Lc=37491,Dc=37808,Nc=37809,Uc=37810,Fc=37811,Oc=37812,zc=37813,Bc=37814,kc=37815,Gc=37816,Hc=37817,Vc=37818,Wc=37819,Xc=37820,$c=37821,qc=36492,Yc=36494,Kc=36495,Jc=36283,Zc=36284,Vo=36285,jc=36286,u0=2200,f0=2201,d0=2202,Rr=2300,Cr=2301,ga=2302,Ah=2303,Ts=2400,Rs=2401,Wo=2402,Rl=2500,p0=2501,m0=0,Df=1,Qc=2,g0=3200,el=0,x0=1,Ti="",Gt="srgb",un="srgb-linear",Xo="linear",_t="srgb",xa=7680,v0=519,_0=512,y0=513,M0=514,Cl=515,S0=516,b0=517,Pl=518,w0=519,Nf=35044,Pi=35048,Th="300 es",Xn=2e3,Pr=2001;function E0(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function A0(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Ir(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function T0(){const i=Ir("canvas");return i.style.display="block",i}const Rh={};function $o(...i){const e="THREE."+i.shift();console.log(e,...i)}function Uf(i){const e=i[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=i[1];t&&t.isStackTrace?i[0]+=" "+t.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Xe(...i){i=Uf(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...i)}}function Ze(...i){i=Uf(i);const e="THREE."+i.shift();{const t=i[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...i)}}function Ls(...i){const e=i.join(" ");e in Rh||(Rh[e]=!0,Xe(...i))}function R0(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const C0={[xc]:ko,[vc]:Mc,[_c]:Sc,[Er]:yc,[ko]:xc,[Mc]:vc,[Sc]:_c,[yc]:Er};class Ui{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const s=n[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ch=1234567;const vr=Math.PI/180,zs=180/Math.PI;function Dn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]).toLowerCase()}function it(i,e,t){return Math.max(e,Math.min(t,i))}function Il(i,e){return(i%e+e)%e}function P0(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function I0(i,e,t){return i!==e?(t-i)/(e-i):0}function _r(i,e,t){return(1-t)*i+t*e}function L0(i,e,t,n){return _r(i,e,1-Math.exp(-t*n))}function D0(i,e=1){return e-Math.abs(Il(i,e*2)-e)}function N0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function U0(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function F0(i,e){return i+Math.floor(Math.random()*(e-i+1))}function O0(i,e){return i+Math.random()*(e-i)}function z0(i){return i*(.5-Math.random())}function B0(i){i!==void 0&&(Ch=i);let e=Ch+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function k0(i){return i*vr}function G0(i){return i*zs}function H0(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function V0(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function W0(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function X0(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),h=o((e+n)/2),f=r((e-n)/2),u=o((e-n)/2),d=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,c*f,c*u,a*l);break;case"YZY":i.set(c*u,a*h,c*f,a*l);break;case"ZXZ":i.set(c*f,c*u,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*d,a*l);break;case"YXY":i.set(c*d,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*d,a*h,a*l);break;default:Xe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Pn(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function yt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const zt={DEG2RAD:vr,RAD2DEG:zs,generateUUID:Dn,clamp:it,euclideanModulo:Il,mapLinear:P0,inverseLerp:I0,lerp:_r,damp:L0,pingpong:D0,smoothstep:N0,smootherstep:U0,randInt:F0,randFloat:O0,randFloatSpread:z0,seededRandom:B0,degToRad:k0,radToDeg:G0,isPowerOfTwo:H0,ceilPowerOfTwo:V0,floorPowerOfTwo:W0,setQuaternionFromProperEuler:X0,normalize:yt,denormalize:Pn};class Ne{static{Ne.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(it(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class En{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],f=n[s+3],u=r[o+0],d=r[o+1],g=r[o+2],x=r[o+3];if(f!==x||c!==u||l!==d||h!==g){let p=c*u+l*d+h*g+f*x;p<0&&(u=-u,d=-d,g=-g,x=-x,p=-p);let m=1-a;if(p<.9995){const S=Math.acos(p),w=Math.sin(S);m=Math.sin(m*S)/w,a=Math.sin(a*S)/w,c=c*m+u*a,l=l*m+d*a,h=h*m+g*a,f=f*m+x*a}else{c=c*m+u*a,l=l*m+d*a,h=h*m+g*a,f=f*m+x*a;const S=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=S,l*=S,h*=S,f*=S}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],f=r[o],u=r[o+1],d=r[o+2],g=r[o+3];return e[t]=a*g+h*f+c*d-l*u,e[t+1]=c*g+h*u+l*f-a*d,e[t+2]=l*g+h*d+a*u-c*f,e[t+3]=h*g-a*f-c*u-l*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),f=a(r/2),u=c(n/2),d=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=u*h*f+l*d*g,this._y=l*d*f-u*h*g,this._z=l*h*g+u*d*f,this._w=l*h*f-u*d*g;break;case"YXZ":this._x=u*h*f+l*d*g,this._y=l*d*f-u*h*g,this._z=l*h*g-u*d*f,this._w=l*h*f+u*d*g;break;case"ZXY":this._x=u*h*f-l*d*g,this._y=l*d*f+u*h*g,this._z=l*h*g+u*d*f,this._w=l*h*f-u*d*g;break;case"ZYX":this._x=u*h*f-l*d*g,this._y=l*d*f+u*h*g,this._z=l*h*g-u*d*f,this._w=l*h*f+u*d*g;break;case"YZX":this._x=u*h*f+l*d*g,this._y=l*d*f+u*h*g,this._z=l*h*g-u*d*f,this._w=l*h*f-u*d*g;break;case"XZY":this._x=u*h*f-l*d*g,this._y=l*d*f-u*h*g,this._z=l*h*g+u*d*f,this._w=l*h*f+u*d*g;break;default:Xe("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],f=t[10],u=n+a+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-c)*d,this._y=(r-l)*d,this._z=(o-s)*d}else if(n>a&&n>f){const d=2*Math.sqrt(1+n-a-f);this._w=(h-c)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+l)/d}else if(a>f){const d=2*Math.sqrt(1+a-n-f);this._w=(r-l)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(c+h)/d}else{const d=2*Math.sqrt(1+f-n-a);this._w=(o-s)/d,this._x=(r+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(it(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){let n=e._x,s=e._y,r=e._z,o=e._w,a=this.dot(e);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let c=1-t;if(a<.9995){const l=Math.acos(a),h=Math.sin(l);c=Math.sin(c*l)/h,t=Math.sin(t*l)/h,this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this._onChangeCallback()}else this._x=this._x*c+n*t,this._y=this._y*c+s*t,this._z=this._z*c+r*t,this._w=this._w*c+o*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{static{F.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ph.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ph.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),h=2*(a*t-r*s),f=2*(r*n-o*t);return this.x=t+c*l+o*f-a*h,this.y=n+c*h+a*l-r*f,this.z=s+c*f+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return va.copy(this).projectOnVector(e),this.sub(va)}reflect(e){return this.sub(va.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(it(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const va=new F,Ph=new En;class je{static{je.prototype.isMatrix3=!0}constructor(e,t,n,s,r,o,a,c,l){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],f=n[7],u=n[2],d=n[5],g=n[8],x=s[0],p=s[3],m=s[6],S=s[1],w=s[4],_=s[7],M=s[2],y=s[5],E=s[8];return r[0]=o*x+a*S+c*M,r[3]=o*p+a*w+c*y,r[6]=o*m+a*_+c*E,r[1]=l*x+h*S+f*M,r[4]=l*p+h*w+f*y,r[7]=l*m+h*_+f*E,r[2]=u*x+d*S+g*M,r[5]=u*p+d*w+g*y,r[8]=u*m+d*_+g*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],f=h*o-a*l,u=a*c-h*r,d=l*r-o*c,g=t*f+n*u+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/g;return e[0]=f*x,e[1]=(s*l-h*n)*x,e[2]=(a*n-s*o)*x,e[3]=u*x,e[4]=(h*t-s*c)*x,e[5]=(s*r-a*t)*x,e[6]=d*x,e[7]=(n*c-l*t)*x,e[8]=(o*t-n*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return Ls("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(_a.makeScale(e,t)),this}rotate(e){return Ls("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(_a.makeRotation(-e)),this}translate(e,t){return Ls("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(_a.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const _a=new je,Ih=new je().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Lh=new je().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $0(){const i={enabled:!0,workingColorSpace:un,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===_t&&(s.r=ui(s.r),s.g=ui(s.g),s.b=ui(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===_t&&(s.r=Ds(s.r),s.g=Ds(s.g),s.b=Ds(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ti?Xo:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ls("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ls("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[un]:{primaries:e,whitePoint:n,transfer:Xo,toXYZ:Ih,fromXYZ:Lh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Gt},outputColorSpaceConfig:{drawingBufferColorSpace:Gt}},[Gt]:{primaries:e,whitePoint:n,transfer:_t,toXYZ:Ih,fromXYZ:Lh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Gt}}}),i}const ht=$0();function ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ds(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let as;class q0{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{as===void 0&&(as=Ir("canvas")),as.width=e.width,as.height=e.height;const s=as.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),n=as}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ir("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=ui(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(ui(t[n]/255)*255):t[n]=ui(t[n]);return{data:t,width:e.width,height:e.height}}else return Xe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Y0=0;class Ll{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Y0++}),this.uuid=Dn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ya(s[o].image)):r.push(ya(s[o]))}else r=ya(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function ya(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?q0.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Xe("Texture: Unable to serialize Texture."),{})}let K0=0;const Ma=new F;class kt extends Ui{constructor(e=kt.DEFAULT_IMAGE,t=kt.DEFAULT_MAPPING,n=Wn,s=Wn,r=ft,o=wn,a=rn,c=pn,l=kt.DEFAULT_ANISOTROPY,h=Ti){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:K0++}),this.uuid=Dn(),this.name="",this.source=new Ll(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Ne(0,0),this.repeat=new Ne(1,1),this.center=new Ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ma).x}get height(){return this.source.getSize(Ma).y}get depth(){return this.source.getSize(Ma).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Xe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Xe(`Texture.setValues(): property '${t}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Ef)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case es:e.x=e.x-Math.floor(e.x);break;case Wn:e.x=e.x<0?0:1;break;case Go:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case es:e.y=e.y-Math.floor(e.y);break;case Wn:e.y=e.y<0?0:1;break;case Go:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kt.DEFAULT_IMAGE=null;kt.DEFAULT_MAPPING=Ef;kt.DEFAULT_ANISOTROPY=1;class st{static{st.prototype.isVector4=!0}constructor(e=0,t=0,n=0,s=1){this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],f=c[8],u=c[1],d=c[5],g=c[9],x=c[2],p=c[6],m=c[10];if(Math.abs(h-u)<.01&&Math.abs(f-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+x)<.1&&Math.abs(g+p)<.1&&Math.abs(l+d+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(l+1)/2,_=(d+1)/2,M=(m+1)/2,y=(h+u)/4,E=(f+x)/4,v=(g+p)/4;return w>_&&w>M?w<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(w),s=y/n,r=E/n):_>M?_<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(_),n=y/s,r=v/s):M<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(M),n=E/r,s=v/r),this.set(n,s,r,t),this}let S=Math.sqrt((p-g)*(p-g)+(f-x)*(f-x)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(p-g)/S,this.y=(f-x)/S,this.z=(u-h)/S,this.w=Math.acos((l+d+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=it(this.x,e.x,t.x),this.y=it(this.y,e.y,t.y),this.z=it(this.z,e.z,t.z),this.w=it(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=it(this.x,e,t),this.y=it(this.y,e,t),this.z=it(this.z,e,t),this.w=it(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(it(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class J0 extends Ui{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ft,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new st(0,0,e,t),this.scissorTest=!1,this.viewport=new st(0,0,e,t),this.textures=[];const s={width:e,height:t,depth:n.depth},r=new kt(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:ft,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ll(s)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class mn extends J0{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ff extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Z0 extends kt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Bt,this.minFilter=Bt,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class Je{static{Je.prototype.isMatrix4=!0}constructor(e,t,n,s,r,o,a,c,l,h,f,u,d,g,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,h,f,u,d,g,x,p)}set(e,t,n,s,r,o,a,c,l,h,f,u,d,g,x,p){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=s,m[1]=r,m[5]=o,m[9]=a,m[13]=c,m[2]=l,m[6]=h,m[10]=f,m[14]=u,m[3]=d,m[7]=g,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Je().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,s=1/cs.setFromMatrixColumn(e,0).length(),r=1/cs.setFromMatrixColumn(e,1).length(),o=1/cs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const u=o*h,d=o*f,g=a*h,x=a*f;t[0]=c*h,t[4]=-c*f,t[8]=l,t[1]=d+g*l,t[5]=u-x*l,t[9]=-a*c,t[2]=x-u*l,t[6]=g+d*l,t[10]=o*c}else if(e.order==="YXZ"){const u=c*h,d=c*f,g=l*h,x=l*f;t[0]=u+x*a,t[4]=g*a-d,t[8]=o*l,t[1]=o*f,t[5]=o*h,t[9]=-a,t[2]=d*a-g,t[6]=x+u*a,t[10]=o*c}else if(e.order==="ZXY"){const u=c*h,d=c*f,g=l*h,x=l*f;t[0]=u-x*a,t[4]=-o*f,t[8]=g+d*a,t[1]=d+g*a,t[5]=o*h,t[9]=x-u*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const u=o*h,d=o*f,g=a*h,x=a*f;t[0]=c*h,t[4]=g*l-d,t[8]=u*l+x,t[1]=c*f,t[5]=x*l+u,t[9]=d*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const u=o*c,d=o*l,g=a*c,x=a*l;t[0]=c*h,t[4]=x-u*f,t[8]=g*f+d,t[1]=f,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=d*f+g,t[10]=u-x*f}else if(e.order==="XZY"){const u=o*c,d=o*l,g=a*c,x=a*l;t[0]=c*h,t[4]=-f,t[8]=l*h,t[1]=u*f+x,t[5]=o*h,t[9]=d*f-g,t[2]=g*f-d,t[6]=a*h,t[10]=x*f+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(j0,e,Q0)}lookAt(e,t,n){const s=this.elements;return fn.subVectors(e,t),fn.lengthSq()===0&&(fn.z=1),fn.normalize(),vi.crossVectors(n,fn),vi.lengthSq()===0&&(Math.abs(n.z)===1?fn.x+=1e-4:fn.z+=1e-4,fn.normalize(),vi.crossVectors(n,fn)),vi.normalize(),Wr.crossVectors(fn,vi),s[0]=vi.x,s[4]=Wr.x,s[8]=fn.x,s[1]=vi.y,s[5]=Wr.y,s[9]=fn.y,s[2]=vi.z,s[6]=Wr.z,s[10]=fn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],f=n[5],u=n[9],d=n[13],g=n[2],x=n[6],p=n[10],m=n[14],S=n[3],w=n[7],_=n[11],M=n[15],y=s[0],E=s[4],v=s[8],b=s[12],C=s[1],R=s[5],T=s[9],P=s[13],I=s[2],U=s[6],k=s[10],D=s[14],z=s[3],O=s[7],B=s[11],V=s[15];return r[0]=o*y+a*C+c*I+l*z,r[4]=o*E+a*R+c*U+l*O,r[8]=o*v+a*T+c*k+l*B,r[12]=o*b+a*P+c*D+l*V,r[1]=h*y+f*C+u*I+d*z,r[5]=h*E+f*R+u*U+d*O,r[9]=h*v+f*T+u*k+d*B,r[13]=h*b+f*P+u*D+d*V,r[2]=g*y+x*C+p*I+m*z,r[6]=g*E+x*R+p*U+m*O,r[10]=g*v+x*T+p*k+m*B,r[14]=g*b+x*P+p*D+m*V,r[3]=S*y+w*C+_*I+M*z,r[7]=S*E+w*R+_*U+M*O,r[11]=S*v+w*T+_*k+M*B,r[15]=S*b+w*P+_*D+M*V,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],f=e[6],u=e[10],d=e[14],g=e[3],x=e[7],p=e[11],m=e[15],S=c*d-l*u,w=a*d-l*f,_=a*u-c*f,M=o*d-l*h,y=o*u-c*h,E=o*f-a*h;return t*(x*S-p*w+m*_)-n*(g*S-p*M+m*y)+s*(g*w-x*M+m*E)-r*(g*_-x*y+p*E)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[1],o=e[5],a=e[9],c=e[2],l=e[6],h=e[10];return t*(o*h-a*l)-n*(r*h-a*c)+s*(r*l-o*c)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],f=e[9],u=e[10],d=e[11],g=e[12],x=e[13],p=e[14],m=e[15],S=t*a-n*o,w=t*c-s*o,_=t*l-r*o,M=n*c-s*a,y=n*l-r*a,E=s*l-r*c,v=h*x-f*g,b=h*p-u*g,C=h*m-d*g,R=f*p-u*x,T=f*m-d*x,P=u*m-d*p,I=S*P-w*T+_*R+M*C-y*b+E*v;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/I;return e[0]=(a*P-c*T+l*R)*U,e[1]=(s*T-n*P-r*R)*U,e[2]=(x*E-p*y+m*M)*U,e[3]=(u*y-f*E-d*M)*U,e[4]=(c*C-o*P-l*b)*U,e[5]=(t*P-s*C+r*b)*U,e[6]=(p*_-g*E-m*w)*U,e[7]=(h*E-u*_+d*w)*U,e[8]=(o*T-a*C+l*v)*U,e[9]=(n*C-t*T-r*v)*U,e[10]=(g*y-x*_+m*S)*U,e[11]=(f*_-h*y-d*S)*U,e[12]=(a*b-o*R-c*v)*U,e[13]=(t*R-n*b+s*v)*U,e[14]=(x*w-g*M-p*S)*U,e[15]=(h*M-f*w+u*S)*U,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,f=a+a,u=r*l,d=r*h,g=r*f,x=o*h,p=o*f,m=a*f,S=c*l,w=c*h,_=c*f,M=n.x,y=n.y,E=n.z;return s[0]=(1-(x+m))*M,s[1]=(d+_)*M,s[2]=(g-w)*M,s[3]=0,s[4]=(d-_)*y,s[5]=(1-(u+m))*y,s[6]=(p+S)*y,s[7]=0,s[8]=(g+w)*E,s[9]=(p-S)*E,s[10]=(1-(u+x))*E,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;e.x=s[12],e.y=s[13],e.z=s[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let o=cs.set(s[0],s[1],s[2]).length();const a=cs.set(s[4],s[5],s[6]).length(),c=cs.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Tn.copy(this);const l=1/o,h=1/a,f=1/c;return Tn.elements[0]*=l,Tn.elements[1]*=l,Tn.elements[2]*=l,Tn.elements[4]*=h,Tn.elements[5]*=h,Tn.elements[6]*=h,Tn.elements[8]*=f,Tn.elements[9]*=f,Tn.elements[10]*=f,t.setFromRotationMatrix(Tn),n.x=o,n.y=a,n.z=c,this}makePerspective(e,t,n,s,r,o,a=Xn,c=!1){const l=this.elements,h=2*r/(t-e),f=2*r/(n-s),u=(t+e)/(t-e),d=(n+s)/(n-s);let g,x;if(c)g=r/(o-r),x=o*r/(o-r);else if(a===Xn)g=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Pr)g=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=f,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=Xn,c=!1){const l=this.elements,h=2/(t-e),f=2/(n-s),u=-(t+e)/(t-e),d=-(n+s)/(n-s);let g,x;if(c)g=1/(o-r),x=o/(o-r);else if(a===Xn)g=-2/(o-r),x=-(o+r)/(o-r);else if(a===Pr)g=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=h,l[4]=0,l[8]=0,l[12]=u,l[1]=0,l[5]=f,l[9]=0,l[13]=d,l[2]=0,l[6]=0,l[10]=g,l[14]=x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const cs=new F,Tn=new Je,j0=new F(0,0,0),Q0=new F(1,1,1),vi=new F,Wr=new F,fn=new F,Dh=new Je,Nh=new En;class Li{constructor(e=0,t=0,n=0,s=Li.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(t){case"XYZ":this._y=Math.asin(it(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-it(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(it(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-it(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(it(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-it(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Xe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Dh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Dh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Nh.setFromEuler(this),this.setFromQuaternion(Nh,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Li.DEFAULT_ORDER="XYZ";class Dl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let em=0;const Uh=new F,ls=new En,jn=new Je,Xr=new F,js=new F,tm=new F,nm=new En,Fh=new F(1,0,0),Oh=new F(0,1,0),zh=new F(0,0,1),Bh={type:"added"},im={type:"removed"},hs={type:"childadded",child:null},Sa={type:"childremoved",child:null};class bt extends Ui{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:em++}),this.uuid=Dn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bt.DEFAULT_UP.clone();const e=new F,t=new Li,n=new En,s=new F(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Je},normalMatrix:{value:new je}}),this.matrix=new Je,this.matrixWorld=new Je,this.matrixAutoUpdate=bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ls.setFromAxisAngle(e,t),this.quaternion.multiply(ls),this}rotateOnWorldAxis(e,t){return ls.setFromAxisAngle(e,t),this.quaternion.premultiply(ls),this}rotateX(e){return this.rotateOnAxis(Fh,e)}rotateY(e){return this.rotateOnAxis(Oh,e)}rotateZ(e){return this.rotateOnAxis(zh,e)}translateOnAxis(e,t){return Uh.copy(e).applyQuaternion(this.quaternion),this.position.add(Uh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fh,e)}translateY(e){return this.translateOnAxis(Oh,e)}translateZ(e){return this.translateOnAxis(zh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(jn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Xr.copy(e):Xr.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),js.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?jn.lookAt(js,Xr,this.up):jn.lookAt(Xr,js,this.up),this.quaternion.setFromRotationMatrix(jn),s&&(jn.extractRotation(s.matrixWorld),ls.setFromRotationMatrix(jn),this.quaternion.premultiply(ls.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(Ze("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Bh),hs.child=e,this.dispatchEvent(hs),hs.child=null):Ze("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(im),Sa.child=e,this.dispatchEvent(Sa),Sa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),jn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),jn.multiply(e.parent.matrixWorld)),e.applyMatrix4(jn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Bh),hs.child=e,this.dispatchEvent(hs),hs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(js,e,tm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(js,nm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,s=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*s,r[13]+=n-r[1]*t-r[5]*n-r[9]*s,r[14]+=s-r[2]*t-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const s=this.parent;if(e===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const f=c[l];r(e.shapes,f)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),f=o(e.shapes),u=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}bt.DEFAULT_UP=new F(0,1,0);bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class et extends bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const sm={type:"move"};class ba{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new et,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new et,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new et,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const x of e.hand.values()){const p=t.getJointPose(x,n),m=this._getHandJoint(l,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,g=.005;l.inputState.pinching&&u>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1,c.eventsEnabled&&c.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(sm)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new et;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const Of={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},_i={h:0,s:0,l:0},$r={h:0,s:0,l:0};function wa(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Oe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Gt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ht.colorSpaceToWorking(this,t),this}setRGB(e,t,n,s=ht.workingColorSpace){return this.r=e,this.g=t,this.b=n,ht.colorSpaceToWorking(this,s),this}setHSL(e,t,n,s=ht.workingColorSpace){if(e=Il(e,1),t=it(t,0,1),n=it(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=wa(o,r,e+1/3),this.g=wa(o,r,e),this.b=wa(o,r,e-1/3)}return ht.colorSpaceToWorking(this,s),this}setStyle(e,t=Gt){function n(r){r!==void 0&&parseFloat(r)<1&&Xe("Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Xe("Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);Xe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Gt){const n=Of[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Xe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ui(e.r),this.g=ui(e.g),this.b=ui(e.b),this}copyLinearToSRGB(e){return this.r=Ds(e.r),this.g=Ds(e.g),this.b=Ds(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Gt){return ht.workingToColorSpace(Zt.copy(this),e),Math.round(it(Zt.r*255,0,255))*65536+Math.round(it(Zt.g*255,0,255))*256+Math.round(it(Zt.b*255,0,255))}getHexString(e=Gt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ht.workingColorSpace){ht.workingToColorSpace(Zt.copy(this),t);const n=Zt.r,s=Zt.g,r=Zt.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const f=o-a;switch(l=h<=.5?f/(o+a):f/(2-o-a),o){case n:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-n)/f+2;break;case r:c=(n-s)/f+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=ht.workingColorSpace){return ht.workingToColorSpace(Zt.copy(this),t),e.r=Zt.r,e.g=Zt.g,e.b=Zt.b,e}getStyle(e=Gt){ht.workingToColorSpace(Zt.copy(this),e);const t=Zt.r,n=Zt.g,s=Zt.b;return e!==Gt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(_i),this.setHSL(_i.h+e,_i.s+t,_i.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(_i),e.getHSL($r);const n=_r(_i.h,$r.h,t),s=_r(_i.s,$r.s,t),r=_r(_i.l,$r.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Zt=new Oe;Oe.NAMES=Of;class Nl{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Oe(e),this.density=t}clone(){return new Nl(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Cs extends bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Li,this.environmentIntensity=1,this.environmentRotation=new Li,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Rn=new F,Qn=new F,Ea=new F,ei=new F,us=new F,fs=new F,kh=new F,Aa=new F,Ta=new F,Ra=new F,Ca=new st,Pa=new st,Ia=new st;class bn{constructor(e=new F,t=new F,n=new F){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Rn.subVectors(e,t),s.cross(Rn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Rn.subVectors(s,t),Qn.subVectors(n,t),Ea.subVectors(e,t);const o=Rn.dot(Rn),a=Rn.dot(Qn),c=Rn.dot(Ea),l=Qn.dot(Qn),h=Qn.dot(Ea),f=o*l-a*a;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(l*c-a*h)*u,g=(o*h-a*c)*u;return r.set(1-d-g,g,d)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,ei)===null?!1:ei.x>=0&&ei.y>=0&&ei.x+ei.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,ei)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,ei.x),c.addScaledVector(o,ei.y),c.addScaledVector(a,ei.z),c)}static getInterpolatedAttribute(e,t,n,s,r,o){return Ca.setScalar(0),Pa.setScalar(0),Ia.setScalar(0),Ca.fromBufferAttribute(e,t),Pa.fromBufferAttribute(e,n),Ia.fromBufferAttribute(e,s),o.setScalar(0),o.addScaledVector(Ca,r.x),o.addScaledVector(Pa,r.y),o.addScaledVector(Ia,r.z),o}static isFrontFacing(e,t,n,s){return Rn.subVectors(n,t),Qn.subVectors(e,t),Rn.cross(Qn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Rn.subVectors(this.c,this.b),Qn.subVectors(this.a,this.b),Rn.cross(Qn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return bn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return bn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return bn.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return bn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return bn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;us.subVectors(s,n),fs.subVectors(r,n),Aa.subVectors(e,n);const c=us.dot(Aa),l=fs.dot(Aa);if(c<=0&&l<=0)return t.copy(n);Ta.subVectors(e,s);const h=us.dot(Ta),f=fs.dot(Ta);if(h>=0&&f<=h)return t.copy(s);const u=c*f-h*l;if(u<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(us,o);Ra.subVectors(e,r);const d=us.dot(Ra),g=fs.dot(Ra);if(g>=0&&d<=g)return t.copy(r);const x=d*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(fs,a);const p=h*g-d*f;if(p<=0&&f-h>=0&&d-g>=0)return kh.subVectors(r,s),a=(f-h)/(f-h+(d-g)),t.copy(s).addScaledVector(kh,a);const m=1/(p+x+u);return o=x*m,a=u*m,t.copy(n).addScaledVector(us,o).addScaledVector(fs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Kn{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Cn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Cn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Cn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Cn):Cn.fromBufferAttribute(r,o),Cn.applyMatrix4(e.matrixWorld),this.expandByPoint(Cn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),qr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),qr.copy(n.boundingBox)),qr.applyMatrix4(e.matrixWorld),this.union(qr)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Cn),Cn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qs),Yr.subVectors(this.max,Qs),ds.subVectors(e.a,Qs),ps.subVectors(e.b,Qs),ms.subVectors(e.c,Qs),yi.subVectors(ps,ds),Mi.subVectors(ms,ps),Oi.subVectors(ds,ms);let t=[0,-yi.z,yi.y,0,-Mi.z,Mi.y,0,-Oi.z,Oi.y,yi.z,0,-yi.x,Mi.z,0,-Mi.x,Oi.z,0,-Oi.x,-yi.y,yi.x,0,-Mi.y,Mi.x,0,-Oi.y,Oi.x,0];return!La(t,ds,ps,ms,Yr)||(t=[1,0,0,0,1,0,0,0,1],!La(t,ds,ps,ms,Yr))?!1:(Kr.crossVectors(yi,Mi),t=[Kr.x,Kr.y,Kr.z],La(t,ds,ps,ms,Yr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Cn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Cn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ti[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ti[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ti[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ti[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ti[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ti[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ti[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ti[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ti),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const ti=[new F,new F,new F,new F,new F,new F,new F,new F],Cn=new F,qr=new Kn,ds=new F,ps=new F,ms=new F,yi=new F,Mi=new F,Oi=new F,Qs=new F,Yr=new F,Kr=new F,zi=new F;function La(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){zi.fromArray(i,r);const a=s.x*Math.abs(zi.x)+s.y*Math.abs(zi.y)+s.z*Math.abs(zi.z),c=e.dot(zi),l=t.dot(zi),h=n.dot(zi);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Ot=new F,Jr=new Ne;let rm=0;class Nt extends Ui{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Nf,this.updateRanges=[],this.gpuType=cn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Jr.fromBufferAttribute(this,t),Jr.applyMatrix3(e),this.setXY(t,Jr.x,Jr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix3(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyMatrix4(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.applyNormalMatrix(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ot.fromBufferAttribute(this,t),Ot.transformDirection(e),this.setXYZ(t,Ot.x,Ot.y,Ot.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Pn(t,this.array)),t}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Pn(t,this.array)),t}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Pn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Pn(t,this.array)),t}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array),r=yt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class zf extends Nt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class Bf extends Nt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class ct extends Nt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const om=new Kn,er=new F,Da=new F;class Jn{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):om.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;er.subVectors(e,this.center);const t=er.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(er,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Da.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(er.copy(e.center).add(Da)),this.expandByPoint(er.copy(e.center).sub(Da))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let am=0;const _n=new Je,Na=new bt,gs=new F,dn=new Kn,tr=new Kn,Xt=new F;class Tt extends Ui{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:am++}),this.uuid=Dn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(E0(e)?Bf:zf)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new je().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return _n.makeRotationFromQuaternion(e),this.applyMatrix4(_n),this}rotateX(e){return _n.makeRotationX(e),this.applyMatrix4(_n),this}rotateY(e){return _n.makeRotationY(e),this.applyMatrix4(_n),this}rotateZ(e){return _n.makeRotationZ(e),this.applyMatrix4(_n),this}translate(e,t,n){return _n.makeTranslation(e,t,n),this.applyMatrix4(_n),this}scale(e,t,n){return _n.makeScale(e,t,n),this.applyMatrix4(_n),this}lookAt(e){return Na.lookAt(e),Na.updateMatrix(),this.applyMatrix4(Na.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gs).negate(),this.translate(gs.x,gs.y,gs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let s=0,r=e.length;s<r;s++){const o=e[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new ct(n,3))}else{const n=Math.min(e.length,t.count);for(let s=0;s<n;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&Xe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Kn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ze("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];dn.setFromBufferAttribute(r),this.morphTargetsRelative?(Xt.addVectors(this.boundingBox.min,dn.min),this.boundingBox.expandByPoint(Xt),Xt.addVectors(this.boundingBox.max,dn.max),this.boundingBox.expandByPoint(Xt)):(this.boundingBox.expandByPoint(dn.min),this.boundingBox.expandByPoint(dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Ze('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ze("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const n=this.boundingSphere.center;if(dn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];tr.setFromBufferAttribute(a),this.morphTargetsRelative?(Xt.addVectors(dn.min,tr.min),dn.expandByPoint(Xt),Xt.addVectors(dn.max,tr.max),dn.expandByPoint(Xt)):(dn.expandByPoint(tr.min),dn.expandByPoint(tr.max))}dn.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Xt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Xt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Xt.fromBufferAttribute(a,l),c&&(gs.fromBufferAttribute(e,l),Xt.add(gs)),s=Math.max(s,n.distanceToSquared(Xt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Ze('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ze("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;let o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Nt(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));const a=[],c=[];for(let v=0;v<n.count;v++)a[v]=new F,c[v]=new F;const l=new F,h=new F,f=new F,u=new Ne,d=new Ne,g=new Ne,x=new F,p=new F;function m(v,b,C){l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,b),f.fromBufferAttribute(n,C),u.fromBufferAttribute(r,v),d.fromBufferAttribute(r,b),g.fromBufferAttribute(r,C),h.sub(l),f.sub(l),d.sub(u),g.sub(u);const R=1/(d.x*g.y-g.x*d.y);isFinite(R)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(R),p.copy(f).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(R),a[v].add(x),a[b].add(x),a[C].add(x),c[v].add(p),c[b].add(p),c[C].add(p))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let v=0,b=S.length;v<b;++v){const C=S[v],R=C.start,T=C.count;for(let P=R,I=R+T;P<I;P+=3)m(e.getX(P+0),e.getX(P+1),e.getX(P+2))}const w=new F,_=new F,M=new F,y=new F;function E(v){M.fromBufferAttribute(s,v),y.copy(M);const b=a[v];w.copy(b),w.sub(M.multiplyScalar(M.dot(b))).normalize(),_.crossVectors(y,b);const R=_.dot(c[v])<0?-1:1;o.setXYZW(v,w.x,w.y,w.z,R)}for(let v=0,b=S.length;v<b;++v){const C=S[v],R=C.start,T=C.count;for(let P=R,I=R+T;P<I;P+=3)E(e.getX(P+0)),E(e.getX(P+1)),E(e.getX(P+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Nt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const s=new F,r=new F,o=new F,a=new F,c=new F,l=new F,h=new F,f=new F;if(e)for(let u=0,d=e.count;u<d;u+=3){const g=e.getX(u+0),x=e.getX(u+1),p=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,x),o.fromBufferAttribute(t,p),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let u=0,d=t.count;u<d;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Xt.fromBufferAttribute(e,t),Xt.normalize(),e.setXYZ(t,Xt.x,Xt.y,Xt.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,f=a.normalized,u=new l.constructor(c.length*h);let d=0,g=0;for(let x=0,p=c.length;x<p;x++){a.isInterleavedBufferAttribute?d=c[x]*a.data.stride+a.offset:d=c[x]*h;for(let m=0;m<h;m++)u[g++]=l[d++]}return new Nt(u,h,f)}if(this.index===null)return Xe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Tt,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,f=l.length;h<f;h++){const u=l[h],d=e(u,n);c.push(d)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let f=0,u=l.length;f<u;f++){const d=l[f];h.push(d.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],f=r[l];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class cm{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Nf,this.updateRanges=[],this.version=0,this.uuid=Dn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Dn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const tn=new F;class Ul{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyMatrix4(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.applyNormalMatrix(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)tn.fromBufferAttribute(this,t),tn.transformDirection(e),this.setXYZ(t,tn.x,tn.y,tn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Pn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=yt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=yt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Pn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Pn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Pn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Pn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=yt(t,this.array),n=yt(n,this.array),s=yt(s,this.array),r=yt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){$o("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Nt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ul(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){$o("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Ua=new F,lm=new F,hm=new je;class Hn{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Ua.subVectors(n,t).cross(lm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const s=e.delta(Ua),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(s,o)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||hm.getNormalMatrix(e),s=this.coplanarPoint(Ua).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let um=0;class qn extends Ui{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:um++}),this.uuid=Dn(),this.name="",this.type="Material",this.blending=xr,this.side=Ii,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=mf,this.blendDst=gf,this.blendEquation=ws,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=Er,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=v0,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=xa,this.stencilZFail=xa,this.stencilZPass=xa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Xe(`Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){Xe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Oe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new Hn().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Ne().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Ne().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const ni=new F,Fa=new F,Zr=new F,jr=new F;class Br{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ni)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ni.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ni.copy(this.origin).addScaledVector(this.direction,t),ni.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Fa.copy(e).add(t).multiplyScalar(.5),Zr.copy(t).sub(e).normalize(),jr.copy(this.origin).sub(Fa);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Zr),a=jr.dot(this.direction),c=-jr.dot(Zr),l=jr.lengthSq(),h=Math.abs(1-o*o);let f,u,d,g;if(h>0)if(f=o*c-a,u=o*a-c,g=r*h,f>=0)if(u>=-g)if(u<=g){const x=1/h;f*=x,u*=x,d=f*(f+o*u+2*a)+u*(o*f+u+2*c)+l}else u=r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*c)+l;else u=-r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*c)+l;else u<=-g?(f=Math.max(0,-(-o*r+a)),u=f>0?-r:Math.min(Math.max(-r,-c),r),d=-f*f+u*(u+2*c)+l):u<=g?(f=0,u=Math.min(Math.max(-r,-c),r),d=u*(u+2*c)+l):(f=Math.max(0,-(o*r+a)),u=f>0?r:Math.min(Math.max(-r,-c),r),d=-f*f+u*(u+2*c)+l);else u=o>0?-r:r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Fa).addScaledVector(Zr,u),d}intersectSphere(e,t){if(e.radius<0)return null;ni.subVectors(e.center,this.origin);const n=ni.dot(this.direction),s=ni.dot(ni)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,s=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,s=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(e.min.z-u.z)*f,c=(e.max.z-u.z)*f):(a=(e.max.z-u.z)*f,c=(e.min.z-u.z)*f),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ni)!==null}intersectTriangle(e,t,n,s,r){const o=this.origin,a=this.direction,c=a.x,l=a.y,h=a.z,f=e.x-o.x,u=e.y-o.y,d=e.z-o.z,g=t.x-o.x,x=t.y-o.y,p=t.z-o.z,m=n.x-o.x,S=n.y-o.y,w=n.z-o.z,_=Math.abs(c),M=Math.abs(l),y=Math.abs(h);let E,v,b,C,R,T,P,I,U,k,D,z;if(_>=M&&_>=y?(b=c,T=f,U=g,z=m,c>=0?(E=l,v=h,C=u,R=d,P=x,I=p,k=S,D=w):(E=h,v=l,C=d,R=u,P=p,I=x,k=w,D=S)):M>=y?(b=l,T=u,U=x,z=S,l>=0?(E=h,v=c,C=d,R=f,P=p,I=g,k=w,D=m):(E=c,v=h,C=f,R=d,P=g,I=p,k=m,D=w)):(b=h,T=d,U=p,z=w,h>=0?(E=c,v=l,C=f,R=u,P=g,I=x,k=m,D=S):(E=l,v=c,C=u,R=f,P=x,I=g,k=S,D=m)),b===0)return null;const O=E/b,B=v/b,V=1/b,j=C-O*T,W=R-B*T,H=P-O*U,X=I-B*U,Q=k-O*z,$=D-B*z,Z=Q*X-$*H,ie=j*$-W*Q,fe=H*W-X*j;if(s){if(Z<0||ie<0||fe<0)return null}else if((Z<0||ie<0||fe<0)&&(Z>0||ie>0||fe>0))return null;const le=Z+ie+fe;if(le===0)return null;const Se=V*(Z*T+ie*U+fe*z);return(le>0?Se<0:Se>0)?null:this.at(Se/le,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ri extends qn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Li,this.combine=xf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Gh=new Je,Bi=new Br,Qr=new Jn,Hh=new F,eo=new F,to=new F,no=new F,Oa=new F,io=new F,Vh=new F,so=new F;class Ye extends bt{constructor(e=new Tt,t=new Ri){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){io.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],f=r[c];h!==0&&(Oa.fromBufferAttribute(f,e),o?io.addScaledVector(Oa,h):io.addScaledVector(Oa.sub(t),h))}t.add(io)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Qr.copy(n.boundingSphere),Qr.applyMatrix4(r),Bi.copy(e.ray).recast(e.near),!(Qr.containsPoint(Bi.origin)===!1&&(Bi.intersectSphere(Qr,Hh)===null||Bi.origin.distanceToSquared(Hh)>(e.far-e.near)**2))&&(Gh.copy(r).invert(),Bi.copy(e.ray).applyMatrix4(Gh),!(n.boundingBox!==null&&Bi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,Bi)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){const p=u[g],m=o[p.materialIndex],S=Math.max(p.start,d.start),w=Math.min(a.count,Math.min(p.start+p.count,d.start+d.count));for(let _=S,M=w;_<M;_+=3){const y=a.getX(_),E=a.getX(_+1),v=a.getX(_+2);s=ro(this,m,e,n,l,h,f,y,E,v),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){const S=a.getX(p),w=a.getX(p+1),_=a.getX(p+2);s=ro(this,o,e,n,l,h,f,S,w,_),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){const p=u[g],m=o[p.materialIndex],S=Math.max(p.start,d.start),w=Math.min(c.count,Math.min(p.start+p.count,d.start+d.count));for(let _=S,M=w;_<M;_+=3){const y=_,E=_+1,v=_+2;s=ro(this,m,e,n,l,h,f,y,E,v),s&&(s.faceIndex=Math.floor(_/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const g=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){const S=p,w=p+1,_=p+2;s=ro(this,o,e,n,l,h,f,S,w,_),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function fm(i,e,t,n,s,r,o,a){let c;if(e.side===hn?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===Ii,a),c===null)return null;so.copy(a),so.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(so);return l<t.near||l>t.far?null:{distance:l,point:so.clone(),object:i}}function ro(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,eo),i.getVertexPosition(c,to),i.getVertexPosition(l,no);const h=fm(i,e,t,n,eo,to,no,Vh);if(h){const f=new F;bn.getBarycoord(Vh,eo,to,no,f),s&&(h.uv=bn.getInterpolatedAttribute(s,a,c,l,f,new Ne)),r&&(h.uv1=bn.getInterpolatedAttribute(r,a,c,l,f,new Ne)),o&&(h.normal=bn.getInterpolatedAttribute(o,a,c,l,f,new F),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new F,materialIndex:0};bn.getNormal(eo,to,no,u.normal),h.face=u,h.barycoord=f}return h}const nr=new st,Wh=new st,Xh=new st,dm=new st,$h=new Je,oo=new F,za=new Jn,qh=new Je,Ba=new Br;class Fl extends Ye{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Eh,this.bindMatrix=new Je,this.bindMatrixInverse=new Je,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Kn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,oo),this.boundingBox.expandByPoint(oo)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Jn),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,oo),this.boundingSphere.expandByPoint(oo)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,s=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),za.copy(this.boundingSphere),za.applyMatrix4(s),e.ray.intersectsSphere(za)!==!1&&(qh.copy(s).invert(),Ba.copy(e.ray).applyMatrix4(qh),!(this.boundingBox!==null&&Ba.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Ba)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new st,t=this.geometry.attributes.skinWeight;for(let n=0,s=t.count;n<s;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===Eh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===h0?this.bindMatrixInverse.copy(this.bindMatrix).invert():Xe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,s=this.geometry;Wh.fromBufferAttribute(s.attributes.skinIndex,e),Xh.fromBufferAttribute(s.attributes.skinWeight,e),t.isVector4?(nr.copy(t),t.set(0,0,0,0)):(nr.set(...t,1),t.set(0,0,0)),nr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const o=Xh.getComponent(r);if(o!==0){const a=Wh.getComponent(r);$h.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),t.addScaledVector(dm.copy(nr).applyMatrix4($h),o)}}return t.isVector4&&(t.w=nr.w),t.applyMatrix4(this.bindMatrixInverse)}}class Ol extends bt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class Di extends kt{constructor(e=null,t=1,n=1,s,r,o,a,c,l=Bt,h=Bt,f,u){super(null,o,a,c,l,h,s,r,f,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Yh=new Je,pm=new Je;class zl{constructor(e=[],t=[]){this.uuid=Dn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){Xe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,s=this.bones.length;n<s;n++)this.boneInverses.push(new Je)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new Je;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,s=this.boneTexture;for(let r=0,o=e.length;r<o;r++){const a=e[r]?e[r].matrixWorld:pm;Yh.multiplyMatrices(a,t[r]),Yh.toArray(n,r*16)}s!==null&&(s.needsUpdate=!0)}clone(){return new zl(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new Di(t,e,e,rn,cn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const s=this.bones[t];if(s.name===e)return s}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,s=e.bones.length;n<s;n++){const r=e.bones[n];let o=t[r];o===void 0&&(Xe("Skeleton: No bone found with UUID:",r),o=new Ol),this.bones.push(o),this.boneInverses.push(new Je().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let s=0,r=t.length;s<r;s++){const o=t[s];e.bones.push(o.uuid);const a=n[s];e.boneInverses.push(a.toArray())}return e}}class Ki extends Nt{constructor(e,t,n,s=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const xs=new Je,Kh=new Je,ao=[],Jh=new Kn,mm=new Je,ir=new Ye,sr=new Jn;class Ji extends Ye{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ki(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,mm)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Kn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xs),Jh.copy(e.boundingBox).applyMatrix4(xs),this.boundingBox.union(Jh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new Jn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xs),sr.copy(e.boundingSphere).applyMatrix4(xs),this.boundingSphere.union(sr)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,s=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let a=0;a<n.length;a++)n[a]=s[o+a]}raycast(e,t){const n=this.matrixWorld,s=this.count;if(ir.geometry=this.geometry,ir.material=this.material,ir.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),sr.copy(this.boundingSphere),sr.applyMatrix4(n),e.ray.intersectsSphere(sr)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,xs),Kh.multiplyMatrices(n,xs),ir.matrixWorld=Kh,ir.raycast(e,ao);for(let o=0,a=ao.length;o<a;o++){const c=ao[o];c.instanceId=r,c.object=this,t.push(c)}ao.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ki(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Di(new Float32Array(s*this.count),s,this.count,zr,cn));const r=this.morphTexture.source.data.data;let o=0;for(let l=0;l<n.length;l++)o+=n[l];const a=this.geometry.morphTargetsRelative?1:1-o,c=s*e;return r[c]=a,r.set(n,c+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const ki=new Jn,gm=new Ne(.5,.5),co=new F;class na{constructor(e=new Hn,t=new Hn,n=new Hn,s=new Hn,r=new Hn,o=new Hn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Xn,n=!1){const s=this.planes,r=e.elements,o=r[0],a=r[1],c=r[2],l=r[3],h=r[4],f=r[5],u=r[6],d=r[7],g=r[8],x=r[9],p=r[10],m=r[11],S=r[12],w=r[13],_=r[14],M=r[15];if(s[0].setComponents(l-o,d-h,m-g,M-S).normalize(),s[1].setComponents(l+o,d+h,m+g,M+S).normalize(),s[2].setComponents(l+a,d+f,m+x,M+w).normalize(),s[3].setComponents(l-a,d-f,m-x,M-w).normalize(),n)s[4].setComponents(c,u,p,_).normalize(),s[5].setComponents(l-c,d-u,m-p,M-_).normalize();else if(s[4].setComponents(l-c,d-u,m-p,M-_).normalize(),t===Xn)s[5].setComponents(l+c,d+u,m+p,M+_).normalize();else if(t===Pr)s[5].setComponents(c,u,p,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ki.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ki.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ki)}intersectsSprite(e){ki.center.set(0,0,0);const t=gm.distanceTo(e.center);return ki.radius=.7071067811865476+t,ki.applyMatrix4(e.matrixWorld),this.intersectsSphere(ki)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(co.x=s.normal.x>0?e.max.x:e.min.x,co.y=s.normal.y>0?e.max.y:e.min.y,co.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(co)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class kf extends qn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const qo=new F,Yo=new F,Zh=new Je,rr=new Br,lo=new Jn,ka=new F,jh=new F;class Bl extends bt{constructor(e=new Tt,t=new kf){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)qo.fromBufferAttribute(t,s-1),Yo.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=qo.distanceTo(Yo);e.setAttribute("lineDistance",new ct(n,1))}else Xe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),lo.copy(n.boundingSphere),lo.applyMatrix4(s),lo.radius+=r,e.ray.intersectsSphere(lo)===!1)return;Zh.copy(s).invert(),rr.copy(e.ray).applyMatrix4(Zh);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=d,p=g-1;x<p;x+=l){const m=h.getX(x),S=h.getX(x+1),w=ho(this,e,rr,c,m,S,x);w&&t.push(w)}if(this.isLineLoop){const x=h.getX(g-1),p=h.getX(d),m=ho(this,e,rr,c,x,p,g-1);m&&t.push(m)}}else{const d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=d,p=g-1;x<p;x+=l){const m=ho(this,e,rr,c,x,x+1,x);m&&t.push(m)}if(this.isLineLoop){const x=ho(this,e,rr,c,g-1,d,g-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function ho(i,e,t,n,s,r,o){const a=i.geometry.attributes.position;if(qo.fromBufferAttribute(a,s),Yo.fromBufferAttribute(a,r),t.distanceSqToSegment(qo,Yo,ka,jh)>n)return;ka.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(ka);if(!(l<e.near||l>e.far))return{distance:l,point:jh.clone().applyMatrix4(i.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:i}}const Qh=new F,eu=new F;class kl extends Bl{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Qh.fromBufferAttribute(t,s),eu.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Qh.distanceTo(eu);e.setAttribute("lineDistance",new ct(n,1))}else Xe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class xm extends Bl{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class Gf extends qn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const tu=new Je,tl=new Br,uo=new Jn,fo=new F;class Bs extends bt{constructor(e=new Tt,t=new Gf){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),uo.copy(n.boundingSphere),uo.applyMatrix4(s),uo.radius+=r,e.ray.intersectsSphere(uo)===!1)return;tu.copy(s).invert(),tl.copy(e.ray).applyMatrix4(tu);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,f=n.attributes.position;if(l!==null){const u=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=u,x=d;g<x;g++){const p=l.getX(g);fo.fromBufferAttribute(f,p),nu(fo,p,c,s,e,t,this)}}else{const u=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let g=u,x=d;g<x;g++)fo.fromBufferAttribute(f,g),nu(fo,g,c,s,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function nu(i,e,t,n,s,r,o){const a=tl.distanceSqToPoint(i);if(a<t){const c=new F;tl.closestPointToPoint(i,c),c.applyMatrix4(n);const l=s.ray.origin.distanceTo(c);if(l<s.near||l>s.far)return;r.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class Hf extends kt{constructor(e=[],t=Qi,n,s,r,o,a,c,l,h){super(e,t,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class is extends kt{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ks extends kt{constructor(e,t,n=Nn,s,r,o,a=Bt,c=Bt,l,h=fi,f=1){if(h!==fi&&h!==$i)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:f};super(u,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ll(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class vm extends ks{constructor(e,t=Nn,n=Qi,s,r,o=Bt,a=Bt,c,l=fi){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,n,s,r,o,a,c,l),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Vf extends kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Un extends Tt{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],f=[];let u=0,d=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new ct(l,3)),this.setAttribute("normal",new ct(h,3)),this.setAttribute("uv",new ct(f,2));function g(x,p,m,S,w,_,M,y,E,v,b){const C=_/E,R=M/v,T=_/2,P=M/2,I=y/2,U=E+1,k=v+1;let D=0,z=0;const O=new F;for(let B=0;B<k;B++){const V=B*R-P;for(let j=0;j<U;j++){const W=j*C-T;O[x]=W*S,O[p]=V*w,O[m]=I,l.push(O.x,O.y,O.z),O[x]=0,O[p]=0,O[m]=y>0?1:-1,h.push(O.x,O.y,O.z),f.push(j/E),f.push(1-B/v),D+=1}}for(let B=0;B<v;B++)for(let V=0;V<E;V++){const j=u+V+U*B,W=u+V+U*(B+1),H=u+(V+1)+U*(B+1),X=u+(V+1)+U*B;c.push(j,W,X),c.push(W,H,X),z+=6}a.addGroup(d,z,b),d+=z,u+=D}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Un(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ko extends Tt{constructor(e=1,t=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:s},t=Math.max(3,t);const r=[],o=[],a=[],c=[],l=new F,h=new Ne;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let f=0,u=3;f<=t;f++,u+=3){const d=n+f/t*s;l.x=e*Math.cos(d),l.y=e*Math.sin(d),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[u]/e+1)/2,h.y=(o[u+1]/e+1)/2,c.push(h.x,h.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new ct(o,3)),this.setAttribute("normal",new ct(a,3)),this.setAttribute("uv",new ct(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ko(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Pt extends Tt{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],f=[],u=[],d=[];let g=0;const x=[],p=n/2;let m=0;S(),o===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new ct(f,3)),this.setAttribute("normal",new ct(u,3)),this.setAttribute("uv",new ct(d,2));function S(){const _=new F,M=new F;let y=0;const E=(t-e)/n;for(let v=0;v<=r;v++){const b=[],C=v/r,R=C*(t-e)+e;for(let T=0;T<=s;T++){const P=T/s,I=P*c+a,U=Math.sin(I),k=Math.cos(I);M.x=R*U,M.y=-C*n+p,M.z=R*k,f.push(M.x,M.y,M.z),_.set(U,E,k).normalize(),u.push(_.x,_.y,_.z),d.push(P,1-C),b.push(g++)}x.push(b)}for(let v=0;v<s;v++)for(let b=0;b<r;b++){const C=x[b][v],R=x[b+1][v],T=x[b+1][v+1],P=x[b][v+1];(e>0||b!==0)&&(h.push(C,R,P),y+=3),(t>0||b!==r-1)&&(h.push(R,T,P),y+=3)}l.addGroup(m,y,0),m+=y}function w(_){const M=g,y=new Ne,E=new F;let v=0;const b=_===!0?e:t,C=_===!0?1:-1;for(let T=1;T<=s;T++)f.push(0,p*C,0),u.push(0,C,0),d.push(.5,.5),g++;const R=g;for(let T=0;T<=s;T++){const I=T/s*c+a,U=Math.cos(I),k=Math.sin(I);E.x=b*k,E.y=p*C,E.z=b*U,f.push(E.x,E.y,E.z),u.push(0,C,0),y.x=U*.5+.5,y.y=k*.5*C+.5,d.push(y.x,y.y),g++}for(let T=0;T<s;T++){const P=M+T,I=R+T;_===!0?h.push(I,I+1,P):h.push(I+1,I,P),v+=3}l.addGroup(m,v,_===!0?1:2),m+=v}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class In extends Pt{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new In(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class kr extends Tt{constructor(e=[],t=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:s};const r=[],o=[];a(s),l(n),h(),this.setAttribute("position",new ct(r,3)),this.setAttribute("normal",new ct(r.slice(),3)),this.setAttribute("uv",new ct(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(S){const w=new F,_=new F,M=new F;for(let y=0;y<t.length;y+=3)d(t[y+0],w),d(t[y+1],_),d(t[y+2],M),c(w,_,M,S)}function c(S,w,_,M){const y=M+1,E=[];for(let v=0;v<=y;v++){E[v]=[];const b=S.clone().lerp(_,v/y),C=w.clone().lerp(_,v/y),R=y-v;for(let T=0;T<=R;T++)T===0&&v===y?E[v][T]=b:E[v][T]=b.clone().lerp(C,T/R)}for(let v=0;v<y;v++)for(let b=0;b<2*(y-v)-1;b++){const C=Math.floor(b/2);b%2===0?(u(E[v][C+1]),u(E[v+1][C]),u(E[v][C])):(u(E[v][C+1]),u(E[v+1][C+1]),u(E[v+1][C]))}}function l(S){const w=new F;for(let _=0;_<r.length;_+=3)w.x=r[_+0],w.y=r[_+1],w.z=r[_+2],w.normalize().multiplyScalar(S),r[_+0]=w.x,r[_+1]=w.y,r[_+2]=w.z}function h(){const S=new F;for(let w=0;w<r.length;w+=3){S.x=r[w+0],S.y=r[w+1],S.z=r[w+2];const _=p(S)/2/Math.PI+.5,M=m(S)/Math.PI+.5;o.push(_,1-M)}g(),f()}function f(){for(let S=0;S<o.length;S+=6){const w=o[S+0],_=o[S+2],M=o[S+4],y=Math.max(w,_,M),E=Math.min(w,_,M);y>.9&&E<.1&&(w<.2&&(o[S+0]+=1),_<.2&&(o[S+2]+=1),M<.2&&(o[S+4]+=1))}}function u(S){r.push(S.x,S.y,S.z)}function d(S,w){const _=S*3;w.x=e[_+0],w.y=e[_+1],w.z=e[_+2]}function g(){const S=new F,w=new F,_=new F,M=new F,y=new Ne,E=new Ne,v=new Ne;for(let b=0,C=0;b<r.length;b+=9,C+=6){S.set(r[b+0],r[b+1],r[b+2]),w.set(r[b+3],r[b+4],r[b+5]),_.set(r[b+6],r[b+7],r[b+8]),y.set(o[C+0],o[C+1]),E.set(o[C+2],o[C+3]),v.set(o[C+4],o[C+5]),M.copy(S).add(w).add(_).divideScalar(3);const R=p(M);x(y,C+0,S,R),x(E,C+2,w,R),x(v,C+4,_,R)}}function x(S,w,_,M){M<0&&S.x===1&&(o[w]=S.x-1),_.x===0&&_.z===0&&(o[w]=M/2/Math.PI+.5)}function p(S){return Math.atan2(S.z,-S.x)}function m(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new kr(e.vertices,e.indices,e.radius,e.detail)}}class ss extends kr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=1/n,r=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-s,-n,0,-s,n,0,s,-n,0,s,n,-s,-n,0,-s,n,0,s,-n,0,s,n,0,-n,0,-s,n,0,-s,-n,0,s,n,0,s],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(r,o,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ss(e.radius,e.detail)}}class pi{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Xe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let s=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],u=n[s+1]-h,d=(o-h)/u;return(s+d)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new Ne:new F);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new F,s=[],r=[],o=[],a=new F,c=new Je;for(let d=0;d<=e;d++){const g=d/e;s[d]=this.getTangentAt(g,new F)}r[0]=new F,o[0]=new F;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),f=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),f<=l&&(l=f,n.set(0,1,0)),u<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(s[d-1],s[d]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(it(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(a,g))}o[d].crossVectors(s[d],r[d])}if(t===!0){let d=Math.acos(it(r[0].dot(r[e]),-1,1));d/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(d=-d);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],d*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Wf extends pi{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new Ne){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=c-this.aX,d=l-this.aY;c=u*h-d*f+this.aX,l=u*f+d*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class _m extends Wf{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Gl(){let i=0,e=0,t=0,n=0;function s(r,o,a,c){i=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,f){let u=(o-r)/l-(a-r)/(l+h)+(a-o)/h,d=(a-o)/h-(c-o)/(h+f)+(c-a)/f;u*=h,d*=h,s(o,a,u,d)},calc:function(r){const o=r*r,a=o*r;return i+e*r+t*o+n*a}}}const iu=new F,su=new F,Ga=new Gl,Ha=new Gl,Va=new Gl;class Xf extends pi{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new F){const n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(su.subVectors(s[0],s[1]).add(s[0]),l=su);const f=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(iu.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=iu),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(f),d),x=Math.pow(f.distanceToSquared(u),d),p=Math.pow(u.distanceToSquared(h),d);x<1e-4&&(x=1),g<1e-4&&(g=x),p<1e-4&&(p=x),Ga.initNonuniformCatmullRom(l.x,f.x,u.x,h.x,g,x,p),Ha.initNonuniformCatmullRom(l.y,f.y,u.y,h.y,g,x,p),Va.initNonuniformCatmullRom(l.z,f.z,u.z,h.z,g,x,p)}else this.curveType==="catmullrom"&&(Ga.initCatmullRom(l.x,f.x,u.x,h.x,this.tension),Ha.initCatmullRom(l.y,f.y,u.y,h.y,this.tension),Va.initCatmullRom(l.z,f.z,u.z,h.z,this.tension));return n.set(Ga.calc(c),Ha.calc(c),Va.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new F().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function ru(i,e,t,n,s){const r=(n-e)*.5,o=(s-t)*.5,a=i*i,c=i*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*i+t}function ym(i,e){const t=1-i;return t*t*e}function Mm(i,e){return 2*(1-i)*i*e}function Sm(i,e){return i*i*e}function yr(i,e,t,n){return ym(i,e)+Mm(i,t)+Sm(i,n)}function bm(i,e){const t=1-i;return t*t*t*e}function wm(i,e){const t=1-i;return 3*t*t*i*e}function Em(i,e){return 3*(1-i)*i*i*e}function Am(i,e){return i*i*i*e}function Mr(i,e,t,n,s){return bm(i,e)+wm(i,t)+Em(i,n)+Am(i,s)}class Tm extends pi{constructor(e=new Ne,t=new Ne,n=new Ne,s=new Ne){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new Ne){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Mr(e,s.x,r.x,o.x,a.x),Mr(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Rm extends pi{constructor(e=new F,t=new F,n=new F,s=new F){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new F){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(Mr(e,s.x,r.x,o.x,a.x),Mr(e,s.y,r.y,o.y,a.y),Mr(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Cm extends pi{constructor(e=new Ne,t=new Ne){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ne){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ne){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Pm extends pi{constructor(e=new F,t=new F){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new F){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new F){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Im extends pi{constructor(e=new Ne,t=new Ne,n=new Ne){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new Ne){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(yr(e,s.x,r.x,o.x),yr(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $f extends pi{constructor(e=new F,t=new F,n=new F){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new F){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(yr(e,s.x,r.x,o.x),yr(e,s.y,r.y,o.y),yr(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Lm extends pi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ne){const n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],f=s[o>s.length-3?s.length-1:o+2];return n.set(ru(a,c.x,l.x,h.x,f.x),ru(a,c.y,l.y,h.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new Ne().fromArray(s))}return this}}var Dm=Object.freeze({__proto__:null,ArcCurve:_m,CatmullRomCurve3:Xf,CubicBezierCurve:Tm,CubicBezierCurve3:Rm,EllipseCurve:Wf,LineCurve:Cm,LineCurve3:Pm,QuadraticBezierCurve:Im,QuadraticBezierCurve3:$f,SplineCurve:Lm});class gn extends kr{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new gn(e.radius,e.detail)}}class Ni extends kr{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ni(e.radius,e.detail)}}class xn extends Tt{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,f=e/a,u=t/c,d=[],g=[],x=[],p=[];for(let m=0;m<h;m++){const S=m*u-o;for(let w=0;w<l;w++){const _=w*f-r;g.push(_,-S,0),x.push(0,0,1),p.push(w/a),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let S=0;S<a;S++){const w=S+l*m,_=S+l*(m+1),M=S+1+l*(m+1),y=S+1+l*m;d.push(w,_,y),d.push(_,M,y)}this.setIndex(d),this.setAttribute("position",new ct(g,3)),this.setAttribute("normal",new ct(x,3)),this.setAttribute("uv",new ct(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new xn(e.width,e.height,e.widthSegments,e.heightSegments)}}class qi extends Tt{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],f=new F,u=new F,d=[],g=[],x=[],p=[];for(let m=0;m<=n;m++){const S=[],w=m/n,_=o+w*a,M=e*Math.cos(_),y=Math.sqrt(e*e-M*M);let E=0;m===0&&o===0?E=.5/t:m===n&&c===Math.PI&&(E=-.5/t);for(let v=0;v<=t;v++){const b=v/t,C=s+b*r;f.x=-y*Math.cos(C),f.y=M,f.z=y*Math.sin(C),g.push(f.x,f.y,f.z),u.copy(f).normalize(),x.push(u.x,u.y,u.z),p.push(b+E,1-w),S.push(l++)}h.push(S)}for(let m=0;m<n;m++)for(let S=0;S<t;S++){const w=h[m][S+1],_=h[m][S],M=h[m+1][S],y=h[m+1][S+1];(m!==0||o>0)&&d.push(w,_,y),(m!==n-1||c<Math.PI)&&d.push(_,M,y)}this.setIndex(d),this.setAttribute("position",new ct(g,3)),this.setAttribute("normal",new ct(x,3)),this.setAttribute("uv",new ct(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qi(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ia extends Tt{constructor(e=1,t=.4,n=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},n=Math.floor(n),s=Math.floor(s);const c=[],l=[],h=[],f=[],u=new F,d=new F,g=new F;for(let x=0;x<=n;x++){const p=o+x/n*a;for(let m=0;m<=s;m++){const S=m/s*r;d.x=(e+t*Math.cos(p))*Math.cos(S),d.y=(e+t*Math.cos(p))*Math.sin(S),d.z=t*Math.sin(p),l.push(d.x,d.y,d.z),u.x=e*Math.cos(S),u.y=e*Math.sin(S),g.subVectors(d,u).normalize(),h.push(g.x,g.y,g.z),f.push(m/s),f.push(x/n)}}for(let x=1;x<=n;x++)for(let p=1;p<=s;p++){const m=(s+1)*x+p-1,S=(s+1)*(x-1)+p-1,w=(s+1)*(x-1)+p,_=(s+1)*x+p;c.push(m,S,_),c.push(S,w,_)}this.setIndex(c),this.setAttribute("position",new ct(l,3)),this.setAttribute("normal",new ct(h,3)),this.setAttribute("uv",new ct(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ia(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}class Hl extends Tt{constructor(e=new $f(new F(-1,-1,0),new F(-1,1,0),new F(1,1,0)),t=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:n,radialSegments:s,closed:r};const o=e.computeFrenetFrames(t,r);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;const a=new F,c=new F,l=new Ne;let h=new F;const f=[],u=[],d=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new ct(f,3)),this.setAttribute("normal",new ct(u,3)),this.setAttribute("uv",new ct(d,2));function x(){for(let w=0;w<t;w++)p(w);p(r===!1?t:0),S(),m()}function p(w){h=e.getPointAt(w/t,h);const _=o.normals[w],M=o.binormals[w];for(let y=0;y<=s;y++){const E=y/s*Math.PI*2,v=Math.sin(E),b=-Math.cos(E);c.x=b*_.x+v*M.x,c.y=b*_.y+v*M.y,c.z=b*_.z+v*M.z,c.normalize(),u.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,f.push(a.x,a.y,a.z)}}function m(){for(let w=1;w<=t;w++)for(let _=1;_<=s;_++){const M=(s+1)*(w-1)+(_-1),y=(s+1)*w+(_-1),E=(s+1)*w+_,v=(s+1)*(w-1)+_;g.push(M,y,v),g.push(y,E,v)}}function S(){for(let w=0;w<=t;w++)for(let _=0;_<=s;_++)l.x=w/t,l.y=_/s,d.push(l.x,l.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Hl(new Dm[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}function Gs(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];if(ou(s))s.isRenderTargetTexture?(Xe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone();else if(Array.isArray(s))if(ou(s[0])){const r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();e[t][n]=r}else e[t][n]=s.slice();else e[t][n]=s}}return e}function nn(i){const e={};for(let t=0;t<i.length;t++){const n=Gs(i[t]);for(const s in n)e[s]=n[s]}return e}function ou(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Nm(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function qf(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ht.workingColorSpace}const Um={clone:Gs,merge:nn};var Fm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Om=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ht extends qn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Fm,this.fragmentShader=Om,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Gs(e.uniforms),this.uniformsGroups=Nm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const s=e.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=t[s.value]||null;break;case"c":this.uniforms[n].value=new Oe().setHex(s.value);break;case"v2":this.uniforms[n].value=new Ne().fromArray(s.value);break;case"v3":this.uniforms[n].value=new F().fromArray(s.value);break;case"v4":this.uniforms[n].value=new st().fromArray(s.value);break;case"m3":this.uniforms[n].value=new je().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Je().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class zm extends Ht{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ut extends qn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=el,this.normalScale=new Ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Li,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Zn extends ut{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Ne(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return it(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Oe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Oe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Oe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Bm extends qn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=g0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class km extends qn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Ai(i,e){return!i||i.constructor===e?i:typeof e.BYTES_PER_ELEMENT=="number"?new e(i):Array.prototype.slice.call(i)}function No(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}function Gm(i){function e(s,r){return i[s]-i[r]}const t=i.length,n=new Array(t);for(let s=0;s!==t;++s)n[s]=s;return n.sort(e),n}function au(i,e,t){const n=i.length,s=new i.constructor(n);for(let r=0,o=0;o!==n;++r){const a=t[r]*e;for(let c=0;c!==e;++c)s[o++]=i[a+c]}return s}function Hm(i,e,t,n){let s=1,r=i[0];for(;r!==void 0&&r[n]===void 0;)r=i[s++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=i[s++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=i[s++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=i[s++];while(r!==void 0)}class Vs{constructor(e,t,n,s){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,s=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<s)){for(let a=n+2;;){if(s===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=t[++n],e<s)break t}o=t.length;break n}if(!(e>=r)){const a=t[1];e<a&&(n=2,r=a);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){const a=n+o>>>1;e<t[a]?o=a:n=a+1}if(s=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,e,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s;for(let o=0;o!==s;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Vm extends Vs{constructor(e,t,n,s){super(e,t,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Ts,endingEnd:Ts}}intervalChanged_(e,t,n){const s=this.parameterPositions;let r=e-2,o=e+1,a=s[r],c=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Rs:r=e,a=2*t-n;break;case Wo:r=s.length-2,a=t+s[r]-s[r+1];break;default:r=e,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Rs:o=e,c=2*n-t;break;case Wo:o=1,c=n+s[1]-s[0];break;default:o=e-1,c=t}const l=(n-t)*.5,h=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(c-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,g=(n-t)/(s-t),x=g*g,p=x*g,m=-u*p+2*u*x-u*g,S=(1+u)*p+(-1.5-2*u)*x+(-.5+u)*g+1,w=(-1-d)*p+(1.5+d)*x+.5*g,_=d*p-d*x;for(let M=0;M!==a;++M)r[M]=m*o[h+M]+S*o[l+M]+w*o[c+M]+_*o[f+M];return r}}class Yf extends Vs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=(n-t)/(s-t),f=1-h;for(let u=0;u!==a;++u)r[u]=o[l+u]*f+o[c+u]*h;return r}}class Wm extends Vs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e){return this.copySampleValue_(e-1)}}class Xm extends Vs{interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=e*a,l=c-a,h=this.inTangents,f=this.outTangents;if(!h||!f){const g=(n-t)/(s-t),x=1-g;for(let p=0;p!==a;++p)r[p]=o[l+p]*x+o[c+p]*g;return r}const u=a*2,d=e-1;for(let g=0;g!==a;++g){const x=o[l+g],p=o[c+g],m=d*u+g*2,S=f[m],w=f[m+1],_=e*u+g*2,M=h[_],y=h[_+1],E=qm(n,t,S,M,s);r[g]=Kf(E,x,w,y,p)}return r}}function Kf(i,e,t,n,s){const r=1-i;return r*r*r*e+3*r*r*i*t+3*r*i*i*n+i*i*i*s}function $m(i,e,t,n,s){const r=1-i;return 3*r*r*(t-e)+6*r*i*(n-t)+3*i*i*(s-n)}function qm(i,e,t,n,s){let r=(i-e)/(s-e);for(let o=0;o<8;o++){const a=Kf(r,e,t,n,s)-i;if(Math.abs(a)<1e-10)break;const c=$m(r,e,t,n,s);if(Math.abs(c)<1e-10)break;r=Math.max(0,Math.min(1,r-a/c))}return r}class Fn{constructor(e,t,n,s){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ai(t,this.TimeBufferType),this.values=Ai(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ai(e.times,Array),values:Ai(e.values,Array)};const s=e.getInterpolation();s!==e.DefaultInterpolation&&(n.interpolation=s),No(e.settings)&&(n.settings={inTangents:Ai(e.settings.inTangents,Array),outTangents:Ai(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Wm(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Yf(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Vm(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Xm(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Rr:t=this.InterpolantFactoryMethodDiscrete;break;case Cr:t=this.InterpolantFactoryMethodLinear;break;case ga:t=this.InterpolantFactoryMethodSmooth;break;case Ah:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Xe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Rr;case this.InterpolantFactoryMethodLinear:return Cr;case this.InterpolantFactoryMethodSmooth:return ga;case this.InterpolantFactoryMethodBezier:return Ah}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,s=t.length;n!==s;++n)t[n]*=e;No(this.settings)&&(cu(this.settings.inTangents,e),cu(this.settings.outTangents,e))}return this}trim(e,t){const n=this.times,s=n.length;let r=0,o=s-1;for(;r!==s&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);const a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(Ze("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,s=this.values,r=n.length;r===0&&(Ze("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==r;a++){const c=n[a];if(typeof c=="number"&&isNaN(c)){Ze("KeyframeTrack: Time is not a valid number.",this,a,c),e=!1;break}if(o!==null&&o>c){Ze("KeyframeTrack: Out of order keys.",this,a,c,o),e=!1;break}o=c}if(s!==void 0&&A0(s))for(let a=0,c=s.length;a!==c;++a){const l=s[a];if(isNaN(l)){Ze("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ga,r=e.length-1;let o=1;for(let a=1;a<r;++a){let c=!1;const l=e[a],h=e[a+1];if(l!==h&&(a!==1||l!==e[0]))if(s)c=!0;else{const f=a*n,u=f-n,d=f+n;for(let g=0;g!==n;++g){const x=t[f+g];if(x!==t[u+g]||x!==t[d+g]){c=!0;break}}}if(c){if(a!==o){e[o]=e[a];const f=a*n,u=o*n;for(let d=0;d!==n;++d)t[u+d]=t[f+d]}++o}}if(r>0){e[o]=e[r];for(let a=r*n,c=o*n,l=0;l!==n;++l)t[c+l]=t[a+l];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,s=new n(this.name,e,t);return s.createInterpolant=this.createInterpolant,No(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}}function cu(i,e){for(let t=0,n=i.length;t!==n;t+=2)i[t]*=e}Fn.prototype.ValueTypeName="";Fn.prototype.TimeBufferType=Float32Array;Fn.prototype.ValueBufferType=Float32Array;Fn.prototype.DefaultInterpolation=Cr;class Ws extends Fn{constructor(e,t,n){super(e,t,n)}}Ws.prototype.ValueTypeName="bool";Ws.prototype.ValueBufferType=Array;Ws.prototype.DefaultInterpolation=Rr;Ws.prototype.InterpolantFactoryMethodLinear=void 0;Ws.prototype.InterpolantFactoryMethodSmooth=void 0;class Jf extends Fn{constructor(e,t,n,s){super(e,t,n,s)}}Jf.prototype.ValueTypeName="color";class Lr extends Fn{constructor(e,t,n,s){super(e,t,n,s)}}Lr.prototype.ValueTypeName="number";class Ym extends Vs{constructor(e,t,n,s){super(e,t,n,s)}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-t)/(s-t);let l=e*a;for(let h=l+a;l!==h;l+=4)En.slerpFlat(r,0,o,l-a,o,l,c);return r}}class Dr extends Fn{constructor(e,t,n,s){super(e,t,n,s)}InterpolantFactoryMethodLinear(e){return new Ym(this.times,this.values,this.getValueSize(),e)}}Dr.prototype.ValueTypeName="quaternion";Dr.prototype.InterpolantFactoryMethodSmooth=void 0;class Xs extends Fn{constructor(e,t,n){super(e,t,n)}}Xs.prototype.ValueTypeName="string";Xs.prototype.ValueBufferType=Array;Xs.prototype.DefaultInterpolation=Rr;Xs.prototype.InterpolantFactoryMethodLinear=void 0;Xs.prototype.InterpolantFactoryMethodSmooth=void 0;class Jo extends Fn{constructor(e,t,n,s){super(e,t,n,s)}}Jo.prototype.ValueTypeName="vector";class nl{constructor(e="",t=-1,n=[],s=Rl){this.name=e,this.tracks=n,this.duration=t,this.blendMode=s,this.uuid=Dn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,s=1/(e.fps||1);for(let o=0,a=n.length;o!==a;++o)t.push(Jm(n[o]).scale(s));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,s={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,o=n.length;r!==o;++r)t.push(Fn.toJSON(n[r]));return s}static CreateFromMorphTargetSequence(e,t,n,s){const r=t.length,o=[];for(let a=0;a<r;a++){let c=[],l=[];c.push((a+r-1)%r,a,(a+1)%r),l.push(0,1,0);const h=Gm(c);c=au(c,1,h),l=au(l,1,h),!s&&c[0]===0&&(c.push(r),l.push(l[0])),o.push(new Lr(".morphTargetInfluences["+t[a].name+"]",c,l).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const s=e;n=s.geometry&&s.geometry.animations||s.animations}for(let s=0;s<n.length;s++)if(n[s].name===t)return n[s];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const s={},r=/^([\w-]*?)([\d]+)$/;for(let a=0,c=e.length;a<c;a++){const l=e[a],h=l.name.match(r);if(h&&h.length>1){const f=h[1];let u=s[f];u||(s[f]=u=[]),u.push(l)}}const o=[];for(const a in s)o.push(this.CreateFromMorphTargetSequence(a,s[a],t,n));return o}resetDuration(){const e=this.tracks;let t=0;for(let n=0,s=e.length;n!==s;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function Km(i){switch(i.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Lr;case"vector":case"vector2":case"vector3":case"vector4":return Jo;case"color":return Jf;case"quaternion":return Dr;case"bool":case"boolean":return Ws;case"string":return Xs}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+i)}function Jm(i){if(i.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Km(i.type);if(i.times===void 0){const n=[],s=[];Hm(i.keys,n,s,"value"),i.times=n,i.values=s}let t;return e.parse!==void 0?t=e.parse(i):t=new e(i.name,i.times,i.values,i.interpolation),No(i.settings)&&(t.settings={inTangents:Ai(i.settings.inTangents,Float32Array),outTangents:Ai(i.settings.outTangents,Float32Array)}),t}const ci={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(lu(i)||(this.files[i]=e))},get:function(i){if(this.enabled!==!1&&!lu(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function lu(i){try{const e=i.slice(i.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Zm{constructor(e,t,n){const s=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,f){return l.push(h,f),this},this.removeHandler=function(h){const f=l.indexOf(h);return f!==-1&&l.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=l.length;f<u;f+=2){const d=l[f],g=l[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const jm=new Zm;class $s{constructor(e){this.manager=e!==void 0?e:jm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}$s.DEFAULT_MATERIAL_NAME="__DEFAULT";const ii={};class Qm extends Error{constructor(e,t){super(e),this.response=t}}class Zf extends $s{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=ci.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(ii[e]!==void 0){ii[e].push({onLoad:t,onProgress:n,onError:s});return}ii[e]=[],ii[e].push({onLoad:t,onProgress:n,onError:s});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&Xe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=ii[e],f=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=u?parseInt(u):0,g=d!==0;let x=0;const p=new ReadableStream({start(m){S();function S(){f.read().then(({done:w,value:_})=>{if(w)m.close();else{x+=_.byteLength;const M=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:d});for(let y=0,E=h.length;y<E;y++){const v=h[y];v.onProgress&&v.onProgress(M)}m.enqueue(_),S()}},w=>{m.error(w)})}}});return new Response(p)}else throw new Qm(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a==="")return l.text();{const f=/charset="?([^;"\s]*)"?/i.exec(a),u=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(u);return l.arrayBuffer().then(g=>d.decode(g))}}}).then(l=>{ci.add(`file:${e}`,l);const h=ii[e];delete ii[e];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onLoad&&d.onLoad(l)}}).catch(l=>{const h=ii[e];if(h===void 0)throw this.manager.itemError(e),l;delete ii[e];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onError&&d.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const vs=new WeakMap;class eg extends $s{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=ci.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let f=vs.get(o);f===void 0&&(f=[],vs.set(o,f)),f.push({onLoad:t,onError:s})}return o}const a=Ir("img");function c(){h(),t&&t(this);const f=vs.get(this)||[];for(let u=0;u<f.length;u++){const d=f[u];d.onLoad&&d.onLoad(this)}vs.delete(this),r.manager.itemEnd(e)}function l(f){h(),s&&s(f),ci.remove(`image:${e}`);const u=vs.get(this)||[];for(let d=0;d<u.length;d++){const g=u[d];g.onError&&g.onError(f)}vs.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),ci.add(`image:${e}`,a),r.manager.itemStart(e),a.src=e,a}}class tg extends $s{constructor(e){super(e)}load(e,t,n,s){const r=new kt,o=new eg(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class sa extends bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class ng extends sa{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Oe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Wa=new Je,hu=new F,uu=new F;class Vl{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ne(512,512),this.mapType=pn,this.map=null,this.mapPass=null,this.matrix=new Je,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new na,this._frameExtents=new Ne(1,1),this._viewportCount=1,this._viewports=[new st(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;hu.setFromMatrixPosition(e.matrixWorld),t.position.copy(hu),uu.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(uu),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,s){Wa.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Wa,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,c=s?s.x/r.x:0,l=s?s.y/r.y:0;e.coordinateSystem===Pr||e.reversedDepth?t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,1,0,0,0,0,1):t.set(.5*o,0,0,.5*o+c,0,.5*a,0,.5*a+l,0,0,.5,.5,0,0,0,1),t.multiply(Wa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const po=new F,mo=new En,Bn=new F;class Wl extends bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Je,this.projectionMatrix=new Je,this.projectionMatrixInverse=new Je,this.coordinateSystem=Xn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(po,mo,Bn),Bn.x===1&&Bn.y===1&&Bn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(po,mo,Bn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(po,mo,Bn),Bn.x===1&&Bn.y===1&&Bn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(po,mo,Bn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Si=new F,fu=new Ne,du=new Ne;class an extends Wl{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=zs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(vr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return zs*2*Math.atan(Math.tan(vr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Si.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Si.x,Si.y).multiplyScalar(-e/Si.z),Si.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Si.x,Si.y).multiplyScalar(-e/Si.z)}getViewSize(e,t){return this.getViewBounds(e,fu,du),t.subVectors(du,fu)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(vr*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class ig extends Vl{constructor(){super(new an(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=zs*2*e.angle*this.focus,s=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||s!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=s,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class sg extends sa{constructor(e,t,n=0,s=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.distance=n,this.angle=s,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new ig}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class rg extends Vl{constructor(){super(new an(90,1,.5,500)),this.isPointLightShadow=!0}}class di extends sa{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new rg}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class qs extends Wl{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class og extends Vl{constructor(){super(new qs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class il extends sa{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.shadow=new og}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Sr{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class ag extends Tt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}const Xa=new WeakMap;class cg extends $s{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&Xe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&Xe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=ci.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(l=>{Xa.has(o)===!0?(s&&s(Xa.get(o)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(l),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);return}const a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader,a.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const c=fetch(e,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(l){return ci.add(`image-bitmap:${e}`,l),t&&t(l),r.manager.itemEnd(e),l}).catch(function(l){s&&s(l),Xa.set(c,l),ci.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});ci.add(`image-bitmap:${e}`,c),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const _s=-90,ys=1;class lg extends bt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new an(_s,ys,e,t);s.layers=this.layers,this.add(s);const r=new an(_s,ys,e,t);r.layers=this.layers,this.add(r);const o=new an(_s,ys,e,t);o.layers=this.layers,this.add(o);const a=new an(_s,ys,e,t);a.layers=this.layers,this.add(a);const c=new an(_s,ys,e,t);c.layers=this.layers,this.add(c);const l=new an(_s,ys,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===Xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Pr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(n,0,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,2,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,3,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),e.setRenderTarget(n,4,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),n.texture.generateMipmaps=x,e.setRenderTarget(n,5,s),p&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,u,d),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class hg extends an{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class ug{constructor(e,t,n){this.binding=e,this.valueSize=n;let s,r,o;switch(t){case"quaternion":s=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":s=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:s=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=s,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const n=this.buffer,s=this.valueSize,r=e*s+s;let o=this.cumulativeWeight;if(o===0){for(let a=0;a!==s;++a)n[r+a]=n[a];o=t}else{o+=t;const a=t/o;this._mixBufferRegion(n,r,0,a,s)}this.cumulativeWeight=o}accumulateAdditive(e){const t=this.buffer,n=this.valueSize,s=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,s,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,n=this.buffer,s=e*t+t,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){const c=t*this._origIndex;this._mixBufferRegion(n,s,c,1-r,t)}o>0&&this._mixBufferRegionAdditive(n,s,this._addIndex*t,1,t);for(let c=t,l=t+t;c!==l;++c)if(n[c]!==n[c+t]){a.setValue(n,s);break}}saveOriginalState(){const e=this.binding,t=this.buffer,n=this.valueSize,s=n*this._origIndex;e.getValue(t,s);for(let r=n,o=s;r!==o;++r)t[r]=t[s+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,s,r){if(s>=.5)for(let o=0;o!==r;++o)e[t+o]=e[n+o]}_slerp(e,t,n,s){En.slerpFlat(e,t,e,t,e,n,s)}_slerpAdditive(e,t,n,s,r){const o=this._workIndex*r;En.multiplyQuaternionsFlat(e,o,e,t,e,n),En.slerpFlat(e,t,e,t,e,o,s)}_lerp(e,t,n,s,r){const o=1-s;for(let a=0;a!==r;++a){const c=t+a;e[c]=e[c]*o+e[n+a]*s}}_lerpAdditive(e,t,n,s,r){for(let o=0;o!==r;++o){const a=t+o;e[a]=e[a]+e[n+o]*s}}}const Xl="\\[\\]\\.:\\/",fg=new RegExp("["+Xl+"]","g"),$l="[^"+Xl+"]",dg="[^"+Xl.replace("\\.","")+"]",pg=/((?:WC+[\/:])*)/.source.replace("WC",$l),mg=/(WCOD+)?/.source.replace("WCOD",dg),gg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",$l),xg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",$l),vg=new RegExp("^"+pg+mg+gg+xg+"$"),_g=["material","materials","bones","map"];class yg{constructor(e,t,n){const s=n||vt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,s)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class vt{constructor(e,t,n){this.path=t,this.parsedPath=n||vt.parseTrackName(t),this.node=vt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new vt.Composite(e,t,n):new vt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(fg,"")}static parseTrackName(e){const t=vg.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){const r=n.nodeName.substring(s+1);_g.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let o=0;o<r.length;o++){const a=r[o];if(a.name===t||a.uuid===t)return a;const c=n(a.children);if(c)return c}return null},s=n(e.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)e[t++]=n[s]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,s=t.propertyName;let r=t.propertyIndex;if(e||(e=vt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Xe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ze("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ze("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===l){l=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ze("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ze("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ze("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Ze("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}const o=e[s];if(o===void 0){const l=t.nodeName;Ze("PropertyBinding: Trying to update property for track: "+l+"."+s+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!e.geometry){Ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ze("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}vt.Composite=yg;vt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};vt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};vt.prototype.GetterByBindingType=[vt.prototype._getValue_direct,vt.prototype._getValue_array,vt.prototype._getValue_arrayElement,vt.prototype._getValue_toArray];vt.prototype.SetterByBindingTypeAndVersioning=[[vt.prototype._setValue_direct,vt.prototype._setValue_direct_setNeedsUpdate,vt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_array,vt.prototype._setValue_array_setNeedsUpdate,vt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_arrayElement,vt.prototype._setValue_arrayElement_setNeedsUpdate,vt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[vt.prototype._setValue_fromArray,vt.prototype._setValue_fromArray_setNeedsUpdate,vt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class Mg{constructor(e,t,n=null,s=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=s;const r=t.tracks,o=r.length,a=new Array(o),c={endingStart:Ts,endingEnd:Ts};for(let l=0;l!==o;++l){const h=r[l].createInterpolant(null);a[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._restoreTimeScale=null,this._weightInterpolant=null,this.loop=f0,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){const s=this._clip.duration,r=e._clip.duration,o=r/s,a=s/r;e._restoreTimeScale=e.timeScale,this._restoreTimeScale=this.timeScale,e.warp(1,o,t),this.warp(a,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){const s=this._mixer,r=s.time,o=this.timeScale;let a=this._timeScaleInterpolant;a===null&&(a=s._lendControlInterpolant(),this._timeScaleInterpolant=a);const c=a.parameterPositions,l=a.sampleValues;return c[0]=r,c[1]=r+n,l[0]=e/o,l[1]=t/o,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this._restoreTimeScale=null,this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,s){if(!this.enabled){this._updateWeight(e);return}const r=this._startTime;if(r!==null){const c=(e-r)*n;c<0||n===0?t=0:(this._startTime=null,t=n*c)}t*=this._updateTimeScale(e);const o=this._updateTime(t),a=this._updateWeight(e);if(a>0){const c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case p0:for(let h=0,f=c.length;h!==f;++h)c[h].evaluate(o),l[h].accumulateAdditive(a);break;case Rl:default:for(let h=0,f=c.length;h!==f;++h)c[h].evaluate(o),l[h].accumulate(s,a)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const n=this._weightInterpolant;if(n!==null){const s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(this.stopFading(),s===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const n=this._timeScaleInterpolant;if(n!==null){const s=n.evaluate(e)[0];t*=s,e>n.parameterPositions[1]&&(t===0?this.paused=!0:(this._restoreTimeScale!==null&&(t=this._restoreTimeScale),this.timeScale=t),this.stopWarping())}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,n=this.loop;let s=this.time+e,r=this._loopCount;const o=n===d0;if(e===0)return r===-1?s:o&&(r&1)===1?t-s:s;if(n===u0){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(s>=t)s=t;else if(s<0)s=0;else{this.time=s;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),s>=t||s<0){const a=Math.floor(s/t);s-=t*a,r+=Math.abs(a);const c=this.repetitions-r;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,s=e>0?t:0,this.time=s,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(c===1){const l=e<0;this._setEndings(l,!l,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=s,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this._loopCount=r,this.time=s;if(o&&(r&1)===1)return t-s}return s}_setEndings(e,t,n){const s=this._interpolantSettings;n?(s.endingStart=Rs,s.endingEnd=Rs):(e?s.endingStart=this.zeroSlopeAtStart?Rs:Ts:s.endingStart=Wo,t?s.endingEnd=this.zeroSlopeAtEnd?Rs:Ts:s.endingEnd=Wo)}_scheduleFading(e,t,n){const s=this._mixer,r=s.time;let o=this._weightInterpolant;o===null&&(o=s._lendControlInterpolant(),this._weightInterpolant=o);const a=o.parameterPositions,c=o.sampleValues;return a[0]=r,c[0]=t,a[1]=r+e,c[1]=n,this}}const Sg=new Float32Array(1);class bg extends Ui{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(e,t){const n=e._localRoot||this._root,s=e._clip.tracks,r=s.length,o=e._propertyBindings,a=e._interpolants,c=n.uuid,l=this._bindingsByRootAndName;let h=l[c];h===void 0&&(h={},l[c]=h);for(let f=0;f!==r;++f){const u=s[f],d=u.name;let g=h[d];if(g!==void 0)++g.referenceCount,o[f]=g;else{if(g=o[f],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,c,d));continue}const x=t&&t._propertyBindings[f].binding.parsedPath;g=new ug(vt.create(n,d,x),u.ValueTypeName,u.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,c,d),o[f]=g}a[f].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const n=(e._localRoot||this._root).uuid,s=e._clip.uuid,r=this._actionsByClip[s];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,s,n)}const t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){const r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){const r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){const s=this._actions,r=this._actionsByClip;let o=r[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=o;else{const a=o.knownActions;e._byClipCacheIndex=a.length,a.push(e)}e._cacheIndex=s.length,s.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){const t=this._actions,n=t[t.length-1],s=e._cacheIndex;n._cacheIndex=s,t[s]=n,t.pop(),e._cacheIndex=null;const r=e._clip.uuid,o=this._actionsByClip,a=o[r],c=a.knownActions,l=c[c.length-1],h=e._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),e._byClipCacheIndex=null;const f=a.actionByRoot,u=(e._localRoot||this._root).uuid;delete f[u],c.length===0&&delete o[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let n=0,s=t.length;n!==s;++n){const r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){const t=this._actions,n=e._cacheIndex,s=this._nActiveActions++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){const t=this._actions,n=e._cacheIndex,s=--this._nActiveActions,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){const s=this._bindingsByRootAndName,r=this._bindings;let o=s[t];o===void 0&&(o={},s[t]=o),o[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){const t=this._bindings,n=e.binding,s=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,a=o[s],c=t[t.length-1],l=e._cacheIndex;c._cacheIndex=l,t[l]=c,t.pop(),delete a[r],Object.keys(a).length===0&&delete o[s]}_lendBinding(e){const t=this._bindings,n=e._cacheIndex,s=this._nActiveBindings++,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){const t=this._bindings,n=e._cacheIndex,s=--this._nActiveBindings,r=t[s];e._cacheIndex=s,t[s]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let n=e[t];return n===void 0&&(n=new Yf(new Float32Array(2),new Float32Array(2),1,Sg),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){const t=this._controlInterpolants,n=e.__cacheIndex,s=--this._nActiveControlInterpolants,r=t[s];e.__cacheIndex=s,t[s]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){const s=t||this._root,r=s.uuid;let o=typeof e=="string"?nl.findByName(s,e):e;const a=o!==null?o.uuid:e,c=this._actionsByClip[a];let l=null;if(n===void 0&&(o!==null?n=o.blendMode:n=Rl),c!==void 0){const f=c.actionByRoot[r];if(f!==void 0&&f.blendMode===n)return f;l=c.knownActions[0],o===null&&(o=l._clip)}if(o===null)return null;const h=new Mg(this,o,t,n);return this._bindAction(h,l),this._addInactiveAction(h,a,r),h}existingAction(e,t){const n=t||this._root,s=n.uuid,r=typeof e=="string"?nl.findByName(n,e):e,o=r?r.uuid:e,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[s]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;const t=this._actions,n=this._nActiveActions,s=this.time+=e,r=Math.sign(e),o=this._accuIndex^=1;for(let l=0;l!==n;++l)t[l]._update(s,e,r,o);const a=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)a[l].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,n=e.uuid,s=this._actionsByClip,r=s[n];if(r!==void 0){const o=r.knownActions;for(let a=0,c=o.length;a!==c;++a){const l=o[a];this._deactivateAction(l);const h=l._cacheIndex,f=t[t.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,f._cacheIndex=h,t[h]=f,t.pop(),this._removeInactiveBindingsForAction(l)}delete s[n]}}uncacheRoot(e){const t=e.uuid,n=this._actionsByClip;for(const o in n){const a=n[o].actionByRoot,c=a[t];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}const s=this._bindingsByRootAndName,r=s[t];if(r!==void 0)for(const o in r){const a=r[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(e,t){const n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}}const pu=new Je;class wg{constructor(e,t,n=0,s=1/0){this.ray=new Br(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new Dl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):Ze("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return pu.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(pu),this}intersectObject(e,t=!0,n=[]){return sl(e,this,n,t),n.sort(mu),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)sl(e[s],this,n,t);return n.sort(mu),n}}function mu(i,e){return i.distance-e.distance}function sl(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)sl(r[o],e,t,!0)}}class jf{static{jf.prototype.isMatrix2=!0}constructor(e,t,n,s){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,s){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=s,this}}function gu(i,e,t,n){const s=Eg(n);switch(t){case If:return i*e;case zr:return i*e/s.components*s.byteLength;case El:return i*e/s.components*s.byteLength;case ts:return i*e*2/s.components*s.byteLength;case Al:return i*e*2/s.components*s.byteLength;case Lf:return i*e*3/s.components*s.byteLength;case rn:return i*e*4/s.components*s.byteLength;case Tl:return i*e*4/s.components*s.byteLength;case Po:case Io:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Lo:case Do:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case wc:case Ac:return Math.max(i,16)*Math.max(e,8)/4;case bc:case Ec:return Math.max(i,8)*Math.max(e,8)/2;case Tc:case Rc:case Pc:case Ic:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Cc:case Ho:case Lc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Dc:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Nc:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Uc:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Fc:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Oc:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case zc:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Bc:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case kc:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Gc:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Hc:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Vc:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Wc:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Xc:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case $c:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case qc:case Yc:case Kc:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Jc:case Zc:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Vo:case jc:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Eg(i){switch(i){case pn:case Tf:return{byteLength:1,components:1};case Ar:case Rf:case Yn:return{byteLength:2,components:1};case bl:case wl:return{byteLength:2,components:4};case Nn:case Sl:case cn:return{byteLength:4,components:1};case Cf:case Pf:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ml}}));typeof window<"u"&&(window.__THREE__?Xe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ml);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Qf(){let i=null,e=!1,t=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),t(r,o)}return{start:function(){e!==!0&&t!==null&&i!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Ag(i){const e=new WeakMap;function t(a,c){const l=a.array,h=a.usage,f=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&l instanceof Float16Array)d=i.HALF_FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=i.SHORT;else if(l instanceof Uint32Array)d=i.UNSIGNED_INT;else if(l instanceof Int32Array)d=i.INT;else if(l instanceof Int8Array)d=i.BYTE;else if(l instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,c,l){const h=c.array,f=c.updateRanges;if(i.bindBuffer(l,a),f.length===0)i.bufferSubData(l,0,h);else{f.sort((d,g)=>d.start-g.start);let u=0;for(let d=1;d<f.length;d++){const g=f[u],x=f[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++u,f[u]=x)}f.length=u+1;for(let d=0,g=f.length;d<g;d++){const x=f[d];i.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}var Tg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Rg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Cg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Pg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ig=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Lg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Dg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Ng=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ug=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Fg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Og=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,zg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Bg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,kg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Gg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Hg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Vg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Wg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Xg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$g=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,qg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Yg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Kg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Jg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Zg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,jg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Qg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ex=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,tx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,nx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ix="gl_FragColor = linearToOutputTexel( gl_FragColor );",sx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,rx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,ox=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,ax=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,cx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,lx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,hx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ux=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fx=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,dx=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,px=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,mx=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,gx=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xx=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,vx=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,_x=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,yx=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Mx=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Sx=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,bx=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,wx=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ex=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ax=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Tx=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Rx=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Cx=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Px=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Ix=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Lx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Dx=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Nx=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ux=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Fx=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ox=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,zx=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Bx=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,kx=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gx=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Hx=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Vx=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Wx=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xx=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,$x=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,qx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Yx=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Kx=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Jx=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Zx=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,jx=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Qx=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ev=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,tv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,nv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,iv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,sv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,rv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ov=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,av=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,lv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,hv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,uv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,fv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,dv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,pv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,mv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,gv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,xv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,vv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_v=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,yv=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Mv=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Sv=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,bv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,wv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ev=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Av=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Tv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Rv=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Pv=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Iv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Lv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Nv=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Uv=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Fv=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,Ov=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zv=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bv=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,kv=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Gv=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Hv=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Vv=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wv=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xv=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,$v=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,qv=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Yv=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Kv=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Jv=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zv=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,jv=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qv=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,e_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,t_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,n_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,i_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,s_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,r_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,o_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,nt={alphahash_fragment:Tg,alphahash_pars_fragment:Rg,alphamap_fragment:Cg,alphamap_pars_fragment:Pg,alphatest_fragment:Ig,alphatest_pars_fragment:Lg,aomap_fragment:Dg,aomap_pars_fragment:Ng,batching_pars_vertex:Ug,batching_vertex:Fg,begin_vertex:Og,beginnormal_vertex:zg,bsdfs:Bg,iridescence_fragment:kg,bumpmap_pars_fragment:Gg,clipping_planes_fragment:Hg,clipping_planes_pars_fragment:Vg,clipping_planes_pars_vertex:Wg,clipping_planes_vertex:Xg,color_fragment:$g,color_pars_fragment:qg,color_pars_vertex:Yg,color_vertex:Kg,common:Jg,cube_uv_reflection_fragment:Zg,defaultnormal_vertex:jg,displacementmap_pars_vertex:Qg,displacementmap_vertex:ex,emissivemap_fragment:tx,emissivemap_pars_fragment:nx,colorspace_fragment:ix,colorspace_pars_fragment:sx,envmap_fragment:rx,envmap_common_pars_fragment:ox,envmap_pars_fragment:ax,envmap_pars_vertex:cx,envmap_physical_pars_fragment:_x,envmap_vertex:lx,fog_vertex:hx,fog_pars_vertex:ux,fog_fragment:fx,fog_pars_fragment:dx,gradientmap_pars_fragment:px,lightmap_pars_fragment:mx,lights_lambert_fragment:gx,lights_lambert_pars_fragment:xx,lights_pars_begin:vx,lights_toon_fragment:yx,lights_toon_pars_fragment:Mx,lights_phong_fragment:Sx,lights_phong_pars_fragment:bx,lights_physical_fragment:wx,lights_physical_pars_fragment:Ex,lights_fragment_begin:Ax,lights_fragment_maps:Tx,lights_fragment_end:Rx,lightprobes_pars_fragment:Cx,logdepthbuf_fragment:Px,logdepthbuf_pars_fragment:Ix,logdepthbuf_pars_vertex:Lx,logdepthbuf_vertex:Dx,map_fragment:Nx,map_pars_fragment:Ux,map_particle_fragment:Fx,map_particle_pars_fragment:Ox,metalnessmap_fragment:zx,metalnessmap_pars_fragment:Bx,morphinstance_vertex:kx,morphcolor_vertex:Gx,morphnormal_vertex:Hx,morphtarget_pars_vertex:Vx,morphtarget_vertex:Wx,normal_fragment_begin:Xx,normal_fragment_maps:$x,normal_pars_fragment:qx,normal_pars_vertex:Yx,normal_vertex:Kx,normalmap_pars_fragment:Jx,clearcoat_normal_fragment_begin:Zx,clearcoat_normal_fragment_maps:jx,clearcoat_pars_fragment:Qx,iridescence_pars_fragment:ev,opaque_fragment:tv,packing:nv,premultiplied_alpha_fragment:iv,project_vertex:sv,dithering_fragment:rv,dithering_pars_fragment:ov,roughnessmap_fragment:av,roughnessmap_pars_fragment:cv,shadowmap_pars_fragment:lv,shadowmap_pars_vertex:hv,shadowmap_vertex:uv,shadowmask_pars_fragment:fv,skinbase_vertex:dv,skinning_pars_vertex:pv,skinning_vertex:mv,skinnormal_vertex:gv,specularmap_fragment:xv,specularmap_pars_fragment:vv,tonemapping_fragment:_v,tonemapping_pars_fragment:yv,transmission_fragment:Mv,transmission_pars_fragment:Sv,uv_pars_fragment:bv,uv_pars_vertex:wv,uv_vertex:Ev,worldpos_vertex:Av,background_vert:Tv,background_frag:Rv,backgroundCube_vert:Cv,backgroundCube_frag:Pv,cube_vert:Iv,cube_frag:Lv,depth_vert:Dv,depth_frag:Nv,distance_vert:Uv,distance_frag:Fv,equirect_vert:Ov,equirect_frag:zv,linedashed_vert:Bv,linedashed_frag:kv,meshbasic_vert:Gv,meshbasic_frag:Hv,meshlambert_vert:Vv,meshlambert_frag:Wv,meshmatcap_vert:Xv,meshmatcap_frag:$v,meshnormal_vert:qv,meshnormal_frag:Yv,meshphong_vert:Kv,meshphong_frag:Jv,meshphysical_vert:Zv,meshphysical_frag:jv,meshtoon_vert:Qv,meshtoon_frag:e_,points_vert:t_,points_frag:n_,shadow_vert:i_,shadow_frag:s_,sprite_vert:r_,sprite_frag:o_},Pe={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new Ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new F},probesMax:{value:new F},probesResolution:{value:new F}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new Ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},Vn={basic:{uniforms:nn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.fog]),vertexShader:nt.meshbasic_vert,fragmentShader:nt.meshbasic_frag},lambert:{uniforms:nn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Oe(0)},envMapIntensity:{value:1}}]),vertexShader:nt.meshlambert_vert,fragmentShader:nt.meshlambert_frag},phong:{uniforms:nn([Pe.common,Pe.specularmap,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,Pe.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:nt.meshphong_vert,fragmentShader:nt.meshphong_frag},standard:{uniforms:nn([Pe.common,Pe.envmap,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.roughnessmap,Pe.metalnessmap,Pe.fog,Pe.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag},toon:{uniforms:nn([Pe.common,Pe.aomap,Pe.lightmap,Pe.emissivemap,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.gradientmap,Pe.fog,Pe.lights,{emissive:{value:new Oe(0)}}]),vertexShader:nt.meshtoon_vert,fragmentShader:nt.meshtoon_frag},matcap:{uniforms:nn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,Pe.fog,{matcap:{value:null}}]),vertexShader:nt.meshmatcap_vert,fragmentShader:nt.meshmatcap_frag},points:{uniforms:nn([Pe.points,Pe.fog]),vertexShader:nt.points_vert,fragmentShader:nt.points_frag},dashed:{uniforms:nn([Pe.common,Pe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:nt.linedashed_vert,fragmentShader:nt.linedashed_frag},depth:{uniforms:nn([Pe.common,Pe.displacementmap]),vertexShader:nt.depth_vert,fragmentShader:nt.depth_frag},normal:{uniforms:nn([Pe.common,Pe.bumpmap,Pe.normalmap,Pe.displacementmap,{opacity:{value:1}}]),vertexShader:nt.meshnormal_vert,fragmentShader:nt.meshnormal_frag},sprite:{uniforms:nn([Pe.sprite,Pe.fog]),vertexShader:nt.sprite_vert,fragmentShader:nt.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:nt.background_vert,fragmentShader:nt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:nt.backgroundCube_vert,fragmentShader:nt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:nt.cube_vert,fragmentShader:nt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:nt.equirect_vert,fragmentShader:nt.equirect_frag},distance:{uniforms:nn([Pe.common,Pe.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:nt.distance_vert,fragmentShader:nt.distance_frag},shadow:{uniforms:nn([Pe.lights,Pe.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:nt.shadow_vert,fragmentShader:nt.shadow_frag}};Vn.physical={uniforms:nn([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new Ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new Ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new Ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:nt.meshphysical_vert,fragmentShader:nt.meshphysical_frag};const go={r:0,b:0,g:0},a_=new Je,ed=new je;ed.set(-1,0,0,0,1,0,0,0,1);function c_(i,e,t,n,s,r){const o=new Oe(0);let a=s===!0?0:1,c,l,h=null,f=0,u=null;function d(S){let w=S.isScene===!0?S.background:null;if(w&&w.isTexture){const _=S.backgroundBlurriness>0;w=e.get(w,_)}return w}function g(S){let w=!1;const _=d(S);_===null?p(o,a):_&&_.isColor&&(p(_,1),w=!0);const M=i.xr.getEnvironmentBlendMode();M==="additive"?t.buffers.color.setClear(0,0,0,1,r):M==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(i.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(S,w){const _=d(w);_&&(_.isCubeTexture||_.mapping===ta)?(l===void 0&&(l=new Ye(new Un(1,1,1),new Ht({name:"BackgroundCubeMaterial",uniforms:Gs(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),l.geometry.deleteAttribute("uv"),l.onBeforeRender=function(M,y,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(l)),l.material.uniforms.envMap.value=_,l.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(a_.makeRotationFromEuler(w.backgroundRotation)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(ed),l.material.toneMapped=ht.getTransfer(_.colorSpace)!==_t,(h!==_||f!==_.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=_,f=_.version,u=i.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null)):_&&_.isTexture&&(c===void 0&&(c=new Ye(new xn(2,2),new Ht({name:"BackgroundMaterial",uniforms:Gs(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:Ii,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(c)),c.material.uniforms.t2D.value=_,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=ht.getTransfer(_.colorSpace)!==_t,_.matrixAutoUpdate===!0&&_.updateMatrix(),c.material.uniforms.uvTransform.value.copy(_.matrix),(h!==_||f!==_.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=_,f=_.version,u=i.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null))}function p(S,w){S.getRGB(go,qf(i)),t.buffers.color.setClear(go.r,go.g,go.b,w,r)}function m(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,w=1){o.set(S),a=w,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,p(o,a)},render:g,addToRenderList:x,dispose:m}}function l_(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(R,T,P,I,U){let k=!1;const D=f(R,I,P,T);r!==D&&(r=D,l(r.object)),k=d(R,I,P,U),k&&g(R,I,P,U),U!==null&&e.update(U,i.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,_(R,T,P,I),U!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function c(){return i.createVertexArray()}function l(R){return i.bindVertexArray(R)}function h(R){return i.deleteVertexArray(R)}function f(R,T,P,I){const U=I.wireframe===!0;let k=n[T.id];k===void 0&&(k={},n[T.id]=k);const D=R.isInstancedMesh===!0?R.id:0;let z=k[D];z===void 0&&(z={},k[D]=z);let O=z[P.id];O===void 0&&(O={},z[P.id]=O);let B=O[U];return B===void 0&&(B=u(c()),O[U]=B),B}function u(R){const T=[],P=[],I=[];for(let U=0;U<t;U++)T[U]=0,P[U]=0,I[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:T,enabledAttributes:P,attributeDivisors:I,object:R,attributes:{},index:null}}function d(R,T,P,I){const U=r.attributes,k=T.attributes;let D=0;const z=P.getAttributes();for(const O in z)if(z[O].location>=0){const V=U[O];let j=k[O];if(j===void 0&&(O==="instanceMatrix"&&R.instanceMatrix&&(j=R.instanceMatrix),O==="instanceColor"&&R.instanceColor&&(j=R.instanceColor)),V===void 0||V.attribute!==j||j&&V.data!==j.data)return!0;D++}return r.attributesNum!==D||r.index!==I}function g(R,T,P,I){const U={},k=T.attributes;let D=0;const z=P.getAttributes();for(const O in z)if(z[O].location>=0){let V=k[O];V===void 0&&(O==="instanceMatrix"&&R.instanceMatrix&&(V=R.instanceMatrix),O==="instanceColor"&&R.instanceColor&&(V=R.instanceColor));const j={};j.attribute=V,V&&V.data&&(j.data=V.data),U[O]=j,D++}r.attributes=U,r.attributesNum=D,r.index=I}function x(){const R=r.newAttributes;for(let T=0,P=R.length;T<P;T++)R[T]=0}function p(R){m(R,0)}function m(R,T){const P=r.newAttributes,I=r.enabledAttributes,U=r.attributeDivisors;P[R]=1,I[R]===0&&(i.enableVertexAttribArray(R),I[R]=1),U[R]!==T&&(i.vertexAttribDivisor(R,T),U[R]=T)}function S(){const R=r.newAttributes,T=r.enabledAttributes;for(let P=0,I=T.length;P<I;P++)T[P]!==R[P]&&(i.disableVertexAttribArray(P),T[P]=0)}function w(R,T,P,I,U,k,D){D===!0?i.vertexAttribIPointer(R,T,P,U,k):i.vertexAttribPointer(R,T,P,I,U,k)}function _(R,T,P,I){x();const U=I.attributes,k=P.getAttributes(),D=T.defaultAttributeValues;for(const z in k){const O=k[z];if(O.location>=0){let B=U[z];if(B===void 0&&(z==="instanceMatrix"&&R.instanceMatrix&&(B=R.instanceMatrix),z==="instanceColor"&&R.instanceColor&&(B=R.instanceColor)),B!==void 0){const V=B.normalized,j=B.itemSize,W=e.get(B);if(W===void 0)continue;const H=W.buffer,X=W.type,Q=W.bytesPerElement,$=X===i.INT||X===i.UNSIGNED_INT||B.gpuType===Sl;if(B.isInterleavedBufferAttribute){const Z=B.data,ie=Z.stride,fe=B.offset;if(Z.isInstancedInterleavedBuffer){for(let le=0;le<O.locationSize;le++)m(O.location+le,Z.meshPerAttribute);R.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let le=0;le<O.locationSize;le++)p(O.location+le);i.bindBuffer(i.ARRAY_BUFFER,H);for(let le=0;le<O.locationSize;le++)w(O.location+le,j/O.locationSize,X,V,ie*Q,(fe+j/O.locationSize*le)*Q,$)}else{if(B.isInstancedBufferAttribute){for(let Z=0;Z<O.locationSize;Z++)m(O.location+Z,B.meshPerAttribute);R.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=B.meshPerAttribute*B.count)}else for(let Z=0;Z<O.locationSize;Z++)p(O.location+Z);i.bindBuffer(i.ARRAY_BUFFER,H);for(let Z=0;Z<O.locationSize;Z++)w(O.location+Z,j/O.locationSize,X,V,j*Q,j/O.locationSize*Z*Q,$)}}else if(D!==void 0){const V=D[z];if(V!==void 0)switch(V.length){case 2:i.vertexAttrib2fv(O.location,V);break;case 3:i.vertexAttrib3fv(O.location,V);break;case 4:i.vertexAttrib4fv(O.location,V);break;default:i.vertexAttrib1fv(O.location,V)}}}}S()}function M(){b();for(const R in n){const T=n[R];for(const P in T){const I=T[P];for(const U in I){const k=I[U];for(const D in k)h(k[D].object),delete k[D];delete I[U]}}delete n[R]}}function y(R){if(n[R.id]===void 0)return;const T=n[R.id];for(const P in T){const I=T[P];for(const U in I){const k=I[U];for(const D in k)h(k[D].object),delete k[D];delete I[U]}}delete n[R.id]}function E(R){for(const T in n){const P=n[T];for(const I in P){const U=P[I];if(U[R.id]===void 0)continue;const k=U[R.id];for(const D in k)h(k[D].object),delete k[D];delete U[R.id]}}}function v(R){for(const T in n){const P=n[T],I=R.isInstancedMesh===!0?R.id:0,U=P[I];if(U!==void 0){for(const k in U){const D=U[k];for(const z in D)h(D[z].object),delete D[z];delete U[k]}delete P[I],Object.keys(P).length===0&&delete n[T]}}}function b(){C(),o=!0,r!==s&&(r=s,l(r.object))}function C(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:b,resetDefaultState:C,dispose:M,releaseStatesOfGeometry:y,releaseStatesOfObject:v,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:p,disableUnusedAttributes:S}}function h_(i,e,t){let n;function s(c){n=c}function r(c,l){i.drawArrays(n,c,l),t.update(l,n,1)}function o(c,l,h){h!==0&&(i.drawArraysInstanced(n,c,l,h),t.update(l,n,h))}function a(c,l,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,l,0,h);let u=0;for(let d=0;d<h;d++)u+=l[d];t.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function u_(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(E){return!(E!==rn&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const v=E===Yn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==pn&&E!==cn&&!v&&n.convert(E)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function c(E){if(E==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(Xe("WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const f=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&Xe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),S=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),_=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=i.getParameter(i.MAX_SAMPLES),y=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:S,maxVaryings:w,maxFragmentUniforms:_,maxSamples:M,samples:y}}function f_(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new Hn,a=new je,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){t=h(f,u,0)},this.setState=function(f,u,d){const g=f.clippingPlanes,x=f.clipIntersection,p=f.clipShadows,m=i.get(f);if(!s||g===null||g.length===0||r&&!p)r?h(null):l();else{const S=r?0:n,w=S*4;let _=m.clippingState||null;c.value=_,_=h(g,u,w,d);for(let M=0;M!==w;++M)_[M]=t[M];m.clippingState=_,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(f,u,d,g){const x=f!==null?f.length:0;let p=null;if(x!==0){if(p=c.value,g!==!0||p===null){const m=d+x*4,S=u.matrixWorldInverse;a.getNormalMatrix(S),(p===null||p.length<m)&&(p=new Float32Array(m));for(let w=0,_=d;w!==x;++w,_+=4)o.copy(f[w]).applyMatrix4(S,a),o.normal.toArray(p,_),p[_+3]=o.constant}c.value=p,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}const Ps=4,d_=6,p_=20,m_=256,or=new qs,xu=new Oe;let $a=null,qa=0,Ya=0,Ka=!1;const g_=new F,Gi=new F;class vu{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,s=100,r={}){const{size:o=256,position:a=g_}=r;$a=this._renderer.getRenderTarget(),qa=this._renderer.getActiveCubeFace(),Ya=this._renderer.getActiveMipmapLevel(),Ka=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const c=this._allocateTargets();return c.depthBuffer=!0,this._sceneToCubeUV(e,n,s,c,a),t>0&&this._blur(c,0,0,t),this._applyPMREM(c),this._cleanup(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Mu(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yu(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget($a,qa,Ya),this._renderer.xr.enabled=Ka,e.scissorTest=!1,Ms(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Qi||e.mapping===Os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$a=this._renderer.getRenderTarget(),qa=this._renderer.getActiveCubeFace(),Ya=this._renderer.getActiveMipmapLevel(),Ka=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:ft,minFilter:ft,generateMipmaps:!1,type:Yn,format:rn,colorSpace:un,depthBuffer:!1},s=_u(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=_u(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=x_(r)),this._blurMaterial=__(r,e,t),this._ggxMaterial=v_(r,e,t)}return s}_compileMaterial(e){const t=new Ye(new Tt,e);this._renderer.compile(t,or)}_sceneToCubeUV(e,t,n,s,r){const c=new an(90,1,t,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(xu),f.toneMapping=$n,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ye(new Un,new Ri({name:"PMREM.Background",side:hn,depthWrite:!1,depthTest:!1})));const x=this._backgroundBox,p=x.material;let m=!1;const S=e.background;S?S.isColor&&(p.color.copy(S),e.background=null,m=!0):(p.color.copy(xu),m=!0);for(let w=0;w<6;w++){const _=w%3;_===0?(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x+h[w],r.y,r.z)):_===1?(c.up.set(0,0,l[w]),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y+h[w],r.z)):(c.up.set(0,l[w],0),c.position.set(r.x,r.y,r.z),c.lookAt(r.x,r.y,r.z+h[w]));const M=this._cubeSize;Ms(s,_*M,w>2?M:0,M,M),f.setRenderTarget(s),m&&f.render(x,c),f.render(e,c)}f.toneMapping=d,f.autoClear=u,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Qi||e.mapping===Os;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Mu()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=yu());const r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;const a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;Ms(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,or)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const c=o.uniforms,l=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(l*l-h*h),u=l*1.25,d=f*u,{_lodMax:g}=this,x=this._sizeLods[n],p=3*x*(n>g-Ps?n-g+Ps:0),m=4*(this._cubeSize-x);c.envMap.value=e.texture,c.roughness.value=d,c.mipInt.value=g-t,Ms(r,p,m,3*x,2*x),s.setRenderTarget(r),s.render(a,or),c.envMap.value=r.texture,c.roughness.value=0,c.mipInt.value=g-n,Ms(e,p,m,3*x,2*x),s.setRenderTarget(e),s.render(a,or)}_blur(e,t,n,s){const r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,o),this._blurPass(r,e,n,n,o)}_blurPass(e,t,n,s,r){const o=this._renderer,a=this._blurMaterial,c=this._lodMeshes[s];c.material=a;const l=a.uniforms;l.envMap.value=e.texture,l.sigma.value=r,l.mipInt.value=this._lodMax-n;const h=this._sizeLods[s],f=3*h*(s>this._lodMax-Ps?s-this._lodMax+Ps:0),u=4*(this._cubeSize-h);Ms(t,f,u,3*h,2*h),o.setRenderTarget(t),o.render(c,or)}}function x_(i){const e=[],t=[];let n=i;const s=i-Ps+1+d_;for(let r=0;r<s;r++){const o=Math.pow(2,n);e.push(o);const a=1/(o-2),c=-a,l=1+a,h=[c,c,l,c,l,l,c,c,l,l,c,l],f=6,u=6,d=3,g=new Float32Array(d*u*f),x=new Float32Array(d*u*f);for(let m=0;m<f;m++){const S=m%3*2/3-1,w=m>2?0:-1,_=[S,w,0,S+2/3,w,0,S+2/3,w+1,0,S,w,0,S+2/3,w+1,0,S,w+1,0];g.set(_,d*u*m);for(let M=0;M<u;M++){const y=h[M*2]*2-1,E=h[M*2+1]*2-1;m===0?Gi.set(1,E,y):m===1?Gi.set(-y,1,-E):m===2?Gi.set(-y,E,1):m===3?Gi.set(-1,E,-y):m===4?Gi.set(-y,-1,E):Gi.set(y,E,-1),Gi.toArray(x,(m*u+M)*d)}}const p=new Tt;p.setAttribute("position",new Nt(g,d)),p.setAttribute("outputDirection",new Nt(x,d)),t.push(new Ye(p,null)),n>Ps&&n--}return{lodMeshes:t,sizeLods:e}}function _u(i,e,t){const n=new mn(i,e,t);return n.texture.mapping=ta,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ms(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function v_(i,e,t){return new Ht({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:m_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ra(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function __(i,e,t){return new Ht({name:"SphericalGaussianBlur",defines:{SAMPLES:p_,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ra(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function yu(){return new Ht({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function Mu(){return new Ht({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ra(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:hi,depthTest:!1,depthWrite:!1})}function ra(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class td extends mn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new Hf(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Un(5,5,5),r=new Ht({name:"CubemapFromEquirect",uniforms:Gs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:hn,blending:hi});r.uniforms.tEquirect.value=t;const o=new Ye(s,r),a=t.minFilter;return t.minFilter===wn&&(t.minFilter=ft),new lg(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,s=!0){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}function y_(i){let e=new WeakMap,t=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?o(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===pa||d===ma)if(e.has(u)){const g=e.get(u).texture;return a(g,u.mapping)}else{const g=u.image;if(g&&g.height>0){const x=new td(g.height);return x.fromEquirectangularTexture(i,u),e.set(u,x),u.addEventListener("dispose",l),a(x.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){const d=u.mapping,g=d===pa||d===ma,x=d===Qi||d===Os;if(g||x){let p=t.get(u);const m=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new vu(i)),p=g?n.fromEquirectangular(u,p):n.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),p.texture;if(p!==void 0)return p.texture;{const S=u.image;return g&&S&&S.height>0||x&&S&&c(S)?(n===null&&(n=new vu(i)),p=g?n.fromEquirectangular(u):n.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,t.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function a(u,d){return d===pa?u.mapping=Qi:d===ma&&(u.mapping=Os),u}function c(u){let d=0;const g=6;for(let x=0;x<g;x++)u[x]!==void 0&&d++;return d===g}function l(u){const d=u.target;d.removeEventListener("dispose",l);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function M_(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const s=i.getExtension(n);return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Ls("WebGLRenderer: "+n+" extension not supported."),s}}}function S_(i,e,t,n){const s={},r=new WeakMap;function o(f){const u=f.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete s[u.id];const d=r.get(u);d&&(e.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(f,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,t.memory.geometries++),u}function c(f){const u=f.attributes;for(const d in u)e.update(u[d],i.ARRAY_BUFFER)}function l(f){const u=[],d=f.index,g=f.attributes.position;let x=0;if(g===void 0)return;if(d!==null){const S=d.array;x=d.version;for(let w=0,_=S.length;w<_;w+=3){const M=S[w+0],y=S[w+1],E=S[w+2];u.push(M,y,y,E,E,M)}}else{const S=g.array;x=g.version;for(let w=0,_=S.length/3-1;w<_;w+=3){const M=w+0,y=w+1,E=w+2;u.push(M,y,y,E,E,M)}}const p=new(g.count>=65535?Bf:zf)(u,1);p.version=x;const m=r.get(f);m&&e.remove(m),r.set(f,p)}function h(f){const u=r.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&l(f)}else l(f);return r.get(f)}return{get:a,update:c,getWireframeAttribute:h}}function b_(i,e,t){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function c(f,u){i.drawElements(n,u,r,f*o),t.update(u,n,1)}function l(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,r,f*o,d),t.update(u,n,d))}function h(f,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let x=0;for(let p=0;p<d;p++)x+=u[p];t.update(x,n,1)}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h}function w_(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:Ze("WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function E_(i,e,t){const n=new WeakMap,s=new st;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==f){let b=function(){E.dispose(),n.delete(a),a.removeEventListener("dispose",b)};u!==void 0&&u.texture.dispose();const d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],S=a.morphAttributes.color||[];let w=0;d===!0&&(w=1),g===!0&&(w=2),x===!0&&(w=3);let _=a.attributes.position.count*w,M=1;_>e.maxTextureSize&&(M=Math.ceil(_/e.maxTextureSize),_=e.maxTextureSize);const y=new Float32Array(_*M*4*f),E=new Ff(y,_,M,f);E.type=cn,E.needsUpdate=!0;const v=w*4;for(let C=0;C<f;C++){const R=p[C],T=m[C],P=S[C],I=_*M*4*C;for(let U=0;U<R.count;U++){const k=U*v;d===!0&&(s.fromBufferAttribute(R,U),y[I+k+0]=s.x,y[I+k+1]=s.y,y[I+k+2]=s.z,y[I+k+3]=0),g===!0&&(s.fromBufferAttribute(T,U),y[I+k+4]=s.x,y[I+k+5]=s.y,y[I+k+6]=s.z,y[I+k+7]=0),x===!0&&(s.fromBufferAttribute(P,U),y[I+k+8]=s.x,y[I+k+9]=s.y,y[I+k+10]=s.z,y[I+k+11]=P.itemSize===4?s.w:1)}}u={count:f,texture:E,size:new Ne(_,M)},n.set(a,u),a.addEventListener("dispose",b)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let d=0;for(let x=0;x<l.length;x++)d+=l[x];const g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(i,"morphTargetBaseInfluence",g),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function A_(i,e,t,n,s){let r=new WeakMap;function o(l){const h=s.render.frame,f=l.geometry,u=e.get(l,f);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",c)===!1&&l.addEventListener("dispose",c),r.get(l)!==h&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function a(){r=new WeakMap}function c(l){const h=l.target;h.removeEventListener("dispose",c),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:o,dispose:a}}const T_={[vf]:"LINEAR_TONE_MAPPING",[_f]:"REINHARD_TONE_MAPPING",[yf]:"CINEON_TONE_MAPPING",[Mf]:"ACES_FILMIC_TONE_MAPPING",[bf]:"AGX_TONE_MAPPING",[wf]:"NEUTRAL_TONE_MAPPING",[Sf]:"CUSTOM_TONE_MAPPING"};function R_(i,e,t,n,s,r){const o=new mn(e,t,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let a=null,c=null;const l=new Tt;l.setAttribute("position",new ct([-1,3,0,-1,-1,0,3,-1,0],3)),l.setAttribute("uv",new ct([0,2,0,0,2,0],2));const h=new zm({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new Ye(l,h),u=new qs(-1,1,1,-1,0,1);let d=null,g=null,x=!1,p,m=null,S=[],w=!1;this.setSize=function(_,M){o.setSize(_,M),a!==null&&a.setSize(_,M),c!==null&&c.setSize(_,M);for(let y=0;y<S.length;y++){const E=S[y];E.setSize&&E.setSize(_,M)}},this.setEffects=function(_){S=_,w=S.length>0&&S[0].isRenderPass===!0;const M=o.width,y=o.height;S.length>0&&a===null&&(a=new mn(M,y,{type:Yn,depthBuffer:!1,stencilBuffer:!1}),c=new mn(M,y,{type:Yn,depthBuffer:!1,stencilBuffer:!1}));for(let E=0;E<S.length;E++){const v=S[E];v.setSize&&v.setSize(M,y)}},this.begin=function(_,M){if(x||_.toneMapping===$n&&S.length===0)return!1;if(m=M,M!==null){const y=M.width,E=M.height;(o.width!==y||o.height!==E)&&this.setSize(y,E)}return w===!1&&_.setRenderTarget(o),p=_.toneMapping,_.toneMapping=$n,!0},this.hasRenderPass=function(){return w},this.end=function(_,M){_.toneMapping=p,x=!0;let y=o,E=a;for(let v=0;v<S.length;v++){const b=S[v];b.enabled!==!1&&(b.render(_,E,y,M),b.needsSwap!==!1&&(y=E,E=E===a?c:a))}if(d!==_.outputColorSpace||g!==_.toneMapping){d=_.outputColorSpace,g=_.toneMapping,h.defines={},ht.getTransfer(d)===_t&&(h.defines.SRGB_TRANSFER="");const v=T_[g];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=y.texture,_.setRenderTarget(m),_.render(f,u),m=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),c!==null&&c.dispose(),l.dispose(),h.dispose()}}const nd=new kt,rl=new ks(1,1),id=new Ff,sd=new Z0,rd=new Hf,Su=[],bu=[],wu=new Float32Array(16),Eu=new Float32Array(9),Au=new Float32Array(4);function Ys(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Su[s];if(r===void 0&&(r=new Float32Array(s),Su[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function Vt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function Wt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function oa(i,e){let t=bu[e];t===void 0&&(t=new Int32Array(e),bu[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function C_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function P_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2fv(this.addr,e),Wt(t,e)}}function I_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Vt(t,e))return;i.uniform3fv(this.addr,e),Wt(t,e)}}function L_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4fv(this.addr,e),Wt(t,e)}}function D_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),Wt(t,e)}else{if(Vt(t,n))return;Au.set(n),i.uniformMatrix2fv(this.addr,!1,Au),Wt(t,n)}}function N_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),Wt(t,e)}else{if(Vt(t,n))return;Eu.set(n),i.uniformMatrix3fv(this.addr,!1,Eu),Wt(t,n)}}function U_(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Vt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),Wt(t,e)}else{if(Vt(t,n))return;wu.set(n),i.uniformMatrix4fv(this.addr,!1,wu),Wt(t,n)}}function F_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function O_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2iv(this.addr,e),Wt(t,e)}}function z_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3iv(this.addr,e),Wt(t,e)}}function B_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4iv(this.addr,e),Wt(t,e)}}function k_(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function G_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Vt(t,e))return;i.uniform2uiv(this.addr,e),Wt(t,e)}}function H_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Vt(t,e))return;i.uniform3uiv(this.addr,e),Wt(t,e)}}function V_(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Vt(t,e))return;i.uniform4uiv(this.addr,e),Wt(t,e)}}function W_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(rl.compareFunction=t.isReversedDepthBuffer()?Pl:Cl,r=rl):r=nd,t.setTexture2D(e||r,s)}function X_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||sd,s)}function $_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||rd,s)}function q_(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||id,s)}function Y_(i){switch(i){case 5126:return C_;case 35664:return P_;case 35665:return I_;case 35666:return L_;case 35674:return D_;case 35675:return N_;case 35676:return U_;case 5124:case 35670:return F_;case 35667:case 35671:return O_;case 35668:case 35672:return z_;case 35669:case 35673:return B_;case 5125:return k_;case 36294:return G_;case 36295:return H_;case 36296:return V_;case 35678:case 36198:case 36298:case 36306:case 35682:return W_;case 35679:case 36299:case 36307:return X_;case 35680:case 36300:case 36308:case 36293:return $_;case 36289:case 36303:case 36311:case 36292:return q_}}function K_(i,e){i.uniform1fv(this.addr,e)}function J_(i,e){const t=Ys(e,this.size,2);i.uniform2fv(this.addr,t)}function Z_(i,e){const t=Ys(e,this.size,3);i.uniform3fv(this.addr,t)}function j_(i,e){const t=Ys(e,this.size,4);i.uniform4fv(this.addr,t)}function Q_(i,e){const t=Ys(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function e1(i,e){const t=Ys(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function t1(i,e){const t=Ys(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function n1(i,e){i.uniform1iv(this.addr,e)}function i1(i,e){i.uniform2iv(this.addr,e)}function s1(i,e){i.uniform3iv(this.addr,e)}function r1(i,e){i.uniform4iv(this.addr,e)}function o1(i,e){i.uniform1uiv(this.addr,e)}function a1(i,e){i.uniform2uiv(this.addr,e)}function c1(i,e){i.uniform3uiv(this.addr,e)}function l1(i,e){i.uniform4uiv(this.addr,e)}function h1(i,e,t){const n=this.cache,s=e.length,r=oa(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=rl:o=nd;for(let a=0;a!==s;++a)t.setTexture2D(e[a]||o,r[a])}function u1(i,e,t){const n=this.cache,s=e.length,r=oa(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||sd,r[o])}function f1(i,e,t){const n=this.cache,s=e.length,r=oa(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||rd,r[o])}function d1(i,e,t){const n=this.cache,s=e.length,r=oa(t,s);Vt(n,r)||(i.uniform1iv(this.addr,r),Wt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||id,r[o])}function p1(i){switch(i){case 5126:return K_;case 35664:return J_;case 35665:return Z_;case 35666:return j_;case 35674:return Q_;case 35675:return e1;case 35676:return t1;case 5124:case 35670:return n1;case 35667:case 35671:return i1;case 35668:case 35672:return s1;case 35669:case 35673:return r1;case 5125:return o1;case 36294:return a1;case 36295:return c1;case 36296:return l1;case 35678:case 36198:case 36298:case 36306:case 35682:return h1;case 35679:case 36299:case 36307:return u1;case 35680:case 36300:case 36308:case 36293:return f1;case 36289:case 36303:case 36311:case 36292:return d1}}class m1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Y_(t.type)}}class g1{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=p1(t.type)}}class x1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const Ja=/(\w+)(\])?(\[|\.)?/g;function Tu(i,e){i.seq.push(e),i.map[e.id]=e}function v1(i,e,t){const n=i.name,s=n.length;for(Ja.lastIndex=0;;){const r=Ja.exec(n),o=Ja.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Tu(t,l===void 0?new m1(a,i,e):new g1(a,i,e));break}else{let f=t.map[a];f===void 0&&(f=new x1(a),Tu(t,f)),t=f}}}class Uo{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);v1(a,c,this)}const s=[],r=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function Ru(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const _1=37297;let y1=0;function M1(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}const Cu=new je;function S1(i){ht._getMatrix(Cu,ht.workingColorSpace,i);const e=`mat3( ${Cu.elements.map(t=>t.toFixed(4))} )`;switch(ht.getTransfer(i)){case Xo:return[e,"LinearTransferOETF"];case _t:return[e,"sRGBTransferOETF"];default:return Xe("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Pu(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const o=/ERROR: 0:(\d+)/.exec(r);if(o){const a=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+M1(i.getShaderSource(e),a)}else return r}function b1(i,e){const t=S1(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const w1={[vf]:"Linear",[_f]:"Reinhard",[yf]:"Cineon",[Mf]:"ACESFilmic",[bf]:"AgX",[wf]:"Neutral",[Sf]:"Custom"};function E1(i,e){const t=w1[e];return t===void 0?(Xe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const xo=new F;function A1(){ht.getLuminanceCoefficients(xo);const i=xo.x.toFixed(4),e=xo.y.toFixed(4),t=xo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function T1(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(dr).join(`
`)}function R1(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function C1(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function dr(i){return i!==""}function Iu(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Lu(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const P1=/^[ \t]*#include +<([\w\d./]+)>/gm;function ol(i){return i.replace(P1,L1)}const I1=new Map;function L1(i,e){let t=nt[e];if(t===void 0){const n=I1.get(e);if(n!==void 0)t=nt[n],Xe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return ol(t)}const D1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Du(i){return i.replace(D1,N1)}function N1(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Nu(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const U1={[gr]:"SHADOWMAP_TYPE_PCF",[ur]:"SHADOWMAP_TYPE_VSM"};function F1(i){return U1[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const O1={[Qi]:"ENVMAP_TYPE_CUBE",[Os]:"ENVMAP_TYPE_CUBE",[ta]:"ENVMAP_TYPE_CUBE_UV"};function z1(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":O1[i.envMapMode]||"ENVMAP_TYPE_CUBE"}const B1={[Os]:"ENVMAP_MODE_REFRACTION"};function k1(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":B1[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}const G1={[xf]:"ENVMAP_BLENDING_MULTIPLY",[c0]:"ENVMAP_BLENDING_MIX",[l0]:"ENVMAP_BLENDING_ADD"};function H1(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":G1[i.combine]||"ENVMAP_BLENDING_NONE"}function V1(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function W1(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=F1(t),l=z1(t),h=k1(t),f=H1(t),u=V1(t),d=T1(t),g=R1(r),x=s.createProgram();let p,m,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(dr).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(dr).join(`
`),m.length>0&&(m+=`
`)):(p=[Nu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(dr).join(`
`),m=[Nu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==$n?"#define TONE_MAPPING":"",t.toneMapping!==$n?nt.tonemapping_pars_fragment:"",t.toneMapping!==$n?E1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",nt.colorspace_pars_fragment,b1("linearToOutputTexel",t.outputColorSpace),A1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(dr).join(`
`)),o=ol(o),o=Iu(o,t),o=Lu(o,t),a=ol(a),a=Iu(a,t),a=Lu(a,t),o=Du(o),a=Du(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,p=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",t.glslVersion===Th?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Th?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const w=S+p+o,_=S+m+a,M=Ru(s,s.VERTEX_SHADER,w),y=Ru(s,s.FRAGMENT_SHADER,_);s.attachShader(x,M),s.attachShader(x,y),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.hasPositionAttribute===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function E(R){if(i.debug.checkShaderErrors){const T=s.getProgramInfoLog(x)||"",P=s.getShaderInfoLog(M)||"",I=s.getShaderInfoLog(y)||"",U=T.trim(),k=P.trim(),D=I.trim();let z=!0,O=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,x,M,y);else{const B=Pu(s,M,"vertex"),V=Pu(s,y,"fragment");Ze("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+U+`
`+B+`
`+V)}else U!==""?Xe("WebGLProgram: Program Info Log:",U):(k===""||D==="")&&(O=!1);O&&(R.diagnostics={runnable:z,programLog:U,vertexShader:{log:k,prefix:p},fragmentShader:{log:D,prefix:m}})}s.deleteShader(M),s.deleteShader(y),v=new Uo(s,x),b=C1(s,x)}let v;this.getUniforms=function(){return v===void 0&&E(this),v};let b;this.getAttributes=function(){return b===void 0&&E(this),b};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=s.getProgramParameter(x,_1)),C},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=y1++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=M,this.fragmentShader=y,this}let X1=0;class $1{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const s=this._getShaderCacheForMaterial(e);return s.has(t)===!1&&(s.add(t),t.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new q1(e),t.set(e,n)),n}}class q1{constructor(e){this.id=X1++,this.code=e,this.usedTimes=0}}function Y1(i){return i===ts||i===Ho||i===Vo}function K1(i,e,t,n,s,r){const o=new Dl,a=new $1,c=new Set,l=[],h=new Map,f=n.logarithmicDepthBuffer;let u=n.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return c.add(v),v===0?"uv":`uv${v}`}function x(v,b,C,R,T,P){const I=R.fog,U=T.geometry,k=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?R.environment:null,D=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,z=e.get(v.envMap||k,D),O=z&&z.mapping===ta?z.image.height:null,B=d[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Xe("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));const V=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,j=V!==void 0?V.length:0;let W=0;U.morphAttributes.position!==void 0&&(W=1),U.morphAttributes.normal!==void 0&&(W=2),U.morphAttributes.color!==void 0&&(W=3);let H,X,Q,$;if(B){const wt=Vn[B];H=wt.vertexShader,X=wt.fragmentShader}else{H=v.vertexShader,X=v.fragmentShader;const wt=a.getVertexShaderStage(v),gt=a.getFragmentShaderStage(v);a.update(v,wt,gt),Q=wt.id,$=gt.id}const Z=i.getRenderTarget(),ie=i.state.buffers.depth.getReversed(),fe=T.isInstancedMesh===!0,le=T.isBatchedMesh===!0,Se=!!v.map,ue=!!v.matcap,be=!!z,ge=!!v.aoMap,xe=!!v.lightMap,pe=!!v.bumpMap&&v.wireframe===!1,ve=!!v.normalMap,Ce=!!v.displacementMap,ze=!!v.emissiveMap,Y=!!v.metalnessMap,de=!!v.roughnessMap,G=v.anisotropy>0,_e=v.clearcoat>0,ye=v.dispersion>0,N=v.retroreflectivity>0,A=v.iridescence>0,q=v.sheen>0,ee=v.transmission>0,re=G&&!!v.anisotropyMap,Me=_e&&!!v.clearcoatMap,se=_e&&!!v.clearcoatNormalMap,ae=_e&&!!v.clearcoatRoughnessMap,ce=A&&!!v.iridescenceMap,we=A&&!!v.iridescenceThicknessMap,Be=q&&!!v.sheenColorMap,Ee=q&&!!v.sheenRoughnessMap,Ae=!!v.specularMap,He=!!v.specularColorMap,Ke=!!v.specularIntensityMap,Qe=ee&&!!v.transmissionMap,J=ee&&!!v.thicknessMap,Te=!!v.gradientMap,he=!!v.alphaMap,Re=v.alphaTest>0,De=!!v.alphaHash,me=!!v.extensions;let qe=$n;v.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(qe=i.toneMapping);const Ve={shaderID:B,shaderType:v.type,shaderName:v.name,vertexShader:H,fragmentShader:X,defines:v.defines,customVertexShaderID:Q,customFragmentShaderID:$,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:le,batchingColor:le&&T._colorsTexture!==null,instancing:fe,instancingColor:fe&&T.instanceColor!==null,instancingMorph:fe&&T.morphTexture!==null,outputColorSpace:Z===null?i.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:ht.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Se,matcap:ue,envMap:be,envMapMode:be&&z.mapping,envMapCubeUVHeight:O,aoMap:ge,lightMap:xe,bumpMap:pe,normalMap:ve,displacementMap:Ce,emissiveMap:ze,normalMapObjectSpace:ve&&v.normalMapType===x0,normalMapTangentSpace:ve&&v.normalMapType===el,packedNormalMap:ve&&v.normalMapType===el&&Y1(v.normalMap.format),metalnessMap:Y,roughnessMap:de,anisotropy:G,anisotropyMap:re,clearcoat:_e,clearcoatMap:Me,clearcoatNormalMap:se,clearcoatRoughnessMap:ae,dispersion:ye,retroreflection:N,iridescence:A,iridescenceMap:ce,iridescenceThicknessMap:we,sheen:q,sheenColorMap:Be,sheenRoughnessMap:Ee,specularMap:Ae,specularColorMap:He,specularIntensityMap:Ke,transmission:ee,transmissionMap:Qe,thicknessMap:J,gradientMap:Te,opaque:v.transparent===!1&&v.blending===xr&&v.alphaToCoverage===!1,alphaMap:he,alphaTest:Re,alphaHash:De,combine:v.combine,mapUv:Se&&g(v.map.channel),aoMapUv:ge&&g(v.aoMap.channel),lightMapUv:xe&&g(v.lightMap.channel),bumpMapUv:pe&&g(v.bumpMap.channel),normalMapUv:ve&&g(v.normalMap.channel),displacementMapUv:Ce&&g(v.displacementMap.channel),emissiveMapUv:ze&&g(v.emissiveMap.channel),metalnessMapUv:Y&&g(v.metalnessMap.channel),roughnessMapUv:de&&g(v.roughnessMap.channel),anisotropyMapUv:re&&g(v.anisotropyMap.channel),clearcoatMapUv:Me&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:se&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:ce&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:we&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&g(v.sheenRoughnessMap.channel),specularMapUv:Ae&&g(v.specularMap.channel),specularColorMapUv:He&&g(v.specularColorMap.channel),specularIntensityMapUv:Ke&&g(v.specularIntensityMap.channel),transmissionMapUv:Qe&&g(v.transmissionMap.channel),thicknessMapUv:J&&g(v.thicknessMap.channel),alphaMapUv:he&&g(v.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(ve||G),vertexNormals:!!U.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:T.isPoints===!0&&!!U.attributes.uv&&(Se||he),fog:!!I,useFog:v.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||U.attributes.normal===void 0&&ve===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:ie,skinning:T.isSkinnedMesh===!0,hasPositionAttribute:U.attributes.position!==void 0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:j,morphTextureStride:W,numSunLights:b.sun.length,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numSunLightShadows:b.sunShadowMap.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numLightProbeGrids:P.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&C.length>0,shadowMapType:i.shadowMap.type,toneMapping:qe,decodeVideoTexture:Se&&v.map.isVideoTexture===!0&&ht.getTransfer(v.map.colorSpace)===_t,decodeVideoTextureEmissive:ze&&v.emissiveMap.isVideoTexture===!0&&ht.getTransfer(v.emissiveMap.colorSpace)===_t,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Sn,flipSided:v.side===hn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:me&&v.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&v.extensions.multiDraw===!0||le)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Ve.vertexUv1s=c.has(1),Ve.vertexUv2s=c.has(2),Ve.vertexUv3s=c.has(3),c.clear(),Ve}function p(v){const b=[];if(v.shaderID?b.push(v.shaderID):(b.push(v.customVertexShaderID),b.push(v.customFragmentShaderID)),v.defines!==void 0)for(const C in v.defines)b.push(C),b.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(m(b,v),S(b,v),b.push(i.outputColorSpace)),b.push(v.customProgramCacheKey),b.join()}function m(v,b){v.push(b.precision),v.push(b.outputColorSpace),v.push(b.envMapMode),v.push(b.envMapCubeUVHeight),v.push(b.mapUv),v.push(b.alphaMapUv),v.push(b.lightMapUv),v.push(b.aoMapUv),v.push(b.bumpMapUv),v.push(b.normalMapUv),v.push(b.displacementMapUv),v.push(b.emissiveMapUv),v.push(b.metalnessMapUv),v.push(b.roughnessMapUv),v.push(b.anisotropyMapUv),v.push(b.clearcoatMapUv),v.push(b.clearcoatNormalMapUv),v.push(b.clearcoatRoughnessMapUv),v.push(b.iridescenceMapUv),v.push(b.iridescenceThicknessMapUv),v.push(b.sheenColorMapUv),v.push(b.sheenRoughnessMapUv),v.push(b.specularMapUv),v.push(b.specularColorMapUv),v.push(b.specularIntensityMapUv),v.push(b.transmissionMapUv),v.push(b.thicknessMapUv),v.push(b.combine),v.push(b.fogExp2),v.push(b.sizeAttenuation),v.push(b.morphTargetsCount),v.push(b.morphAttributeCount),v.push(b.numSunLights),v.push(b.numDirLights),v.push(b.numPointLights),v.push(b.numSpotLights),v.push(b.numSpotLightMaps),v.push(b.numHemiLights),v.push(b.numRectAreaLights),v.push(b.numSunLightShadows),v.push(b.numDirLightShadows),v.push(b.numPointLightShadows),v.push(b.numSpotLightShadows),v.push(b.numSpotLightShadowsWithMaps),v.push(b.numLightProbes),v.push(b.shadowMapType),v.push(b.toneMapping),v.push(b.numClippingPlanes),v.push(b.numClipIntersection),v.push(b.depthPacking)}function S(v,b){o.disableAll(),b.instancing&&o.enable(0),b.instancingColor&&o.enable(1),b.instancingMorph&&o.enable(2),b.matcap&&o.enable(3),b.envMap&&o.enable(4),b.normalMapObjectSpace&&o.enable(5),b.normalMapTangentSpace&&o.enable(6),b.clearcoat&&o.enable(7),b.iridescence&&o.enable(8),b.alphaTest&&o.enable(9),b.vertexColors&&o.enable(10),b.vertexAlphas&&o.enable(11),b.vertexUv1s&&o.enable(12),b.vertexUv2s&&o.enable(13),b.vertexUv3s&&o.enable(14),b.vertexTangents&&o.enable(15),b.anisotropy&&o.enable(16),b.alphaHash&&o.enable(17),b.batching&&o.enable(18),b.dispersion&&o.enable(19),b.retroreflection&&o.enable(24),b.batchingColor&&o.enable(20),b.gradientMap&&o.enable(21),b.packedNormalMap&&o.enable(22),b.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),b.numLightProbeGrids>0&&o.enable(22),b.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function w(v){const b=d[v.type];let C;if(b){const R=Vn[b];C=Um.clone(R.uniforms)}else C=v.uniforms;return C}function _(v,b){let C=h.get(b);return C!==void 0?++C.usedTimes:(C=new W1(i,b,v,s),l.push(C),h.set(b,C)),C}function M(v){if(--v.usedTimes===0){const b=l.indexOf(v);l[b]=l[l.length-1],l.pop(),h.delete(v.cacheKey),v.destroy()}}function y(v){a.remove(v)}function E(){a.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:w,acquireProgram:_,releaseProgram:M,releaseShaderCache:y,programs:l,dispose:E}}function J1(){let i=new WeakMap;function e(o){return i.has(o)}function t(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,c){i.get(o)[a]=c}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:s,dispose:r}}function Z1(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.materialVariant!==e.materialVariant?i.materialVariant-e.materialVariant:i.z!==e.z?i.z-e.z:i.id-e.id}function Uu(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Fu(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function a(u,d,g,x,p,m){let S=i[e];return S===void 0?(S={id:u.id,object:u,geometry:d,material:g,materialVariant:o(u),groupOrder:x,renderOrder:u.renderOrder,z:p,group:m},i[e]=S):(S.id=u.id,S.object=u,S.geometry=d,S.material=g,S.materialVariant=o(u),S.groupOrder=x,S.renderOrder=u.renderOrder,S.z=p,S.group=m),e++,S}function c(u,d,g,x,p,m,S){S.reversedDepth===!0&&(p=-p);const w=a(u,d,g,x,p,m);g.transmission>0?n.push(w):g.transparent===!0?s.push(w):t.push(w)}function l(u,d,g,x,p,m){const S=a(u,d,g,x,p,m);g.transmission>0?n.unshift(S):g.transparent===!0?s.unshift(S):t.unshift(S)}function h(u,d){t.length>1&&t.sort(u||Z1),n.length>1&&n.sort(d||Uu),s.length>1&&s.sort(d||Uu)}function f(){for(let u=e,d=i.length;u<d;u++){const g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:c,unshift:l,finish:f,sort:h}}function j1(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new Fu,i.set(n,[o])):s>=r.length?(o=new Fu,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function Q1(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new F,color:new Oe};break;case"SpotLight":t={position:new F,direction:new F,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":t={color:new Oe,position:new F,halfWidth:new F,halfHeight:new F};break}return i[e.id]=t,t}}}function ey(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let ty=0;function ny(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function iy(i){const e=new Q1,t=ey(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new F);const s=new F,r=new Je,o=new Je;function a(l){let h=0,f=0,u=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let d=0,g=0,x=0,p=0,m=0,S=0,w=0,_=0,M=0,y=0,E=0,v=0,b=0,C=0;l.sort(ny);for(let T=0,P=l.length;T<P;T++){const I=l[T],U=I.color,k=I.intensity,D=I.distance;let z=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===ts?z=I.shadow.map.texture:z=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)h+=U.r*k,f+=U.g*k,u+=U.b*k;else if(I.isLightProbe){for(let O=0;O<9;O++)n.probe[O].addScaledVector(I.sh.coefficients[O],k);C++}else if(I.isSunLight){const O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const B=I.shadow,V=t.get(I);V.shadowIntensity=B.intensity,V.shadowBias=B.bias,V.shadowNormalBias=B.normalBias,V.shadowRadius=B.radius,V.shadowMapSize.copy(B.mapSize).multiply(B.getFrameExtents()),n.sunShadow[g]=V,n.sunShadowMap[g]=z;const j=B.getViewportCount();for(let W=0;W<j;W++)n.sunShadowMatrix[x+W]=B.getMatrix(W),n.sunShadowCascade[x+W]=B._cascadeData[W];x+=j,g++}n.sun[d]=O,d++}else if(I.isDirectionalLight){const O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const B=I.shadow,V=t.get(I);V.shadowIntensity=B.intensity,V.shadowBias=B.bias,V.shadowNormalBias=B.normalBias,V.shadowRadius=B.radius,V.shadowMapSize=B.mapSize,n.directionalShadow[p]=V,n.directionalShadowMap[p]=z,n.directionalShadowMatrix[p]=I.shadow.matrix,M++}n.directional[p]=O,p++}else if(I.isSpotLight){const O=e.get(I);O.position.setFromMatrixPosition(I.matrixWorld),O.color.copy(U).multiplyScalar(k),O.distance=D,O.coneCos=Math.cos(I.angle),O.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),O.decay=I.decay,n.spot[S]=O;const B=I.shadow;if(I.map&&(n.spotLightMap[v]=I.map,v++,B.updateMatrices(I),I.castShadow&&b++),n.spotLightMatrix[S]=B.matrix,I.castShadow){const V=t.get(I);V.shadowIntensity=B.intensity,V.shadowBias=B.bias,V.shadowNormalBias=B.normalBias,V.shadowRadius=B.radius,V.shadowMapSize=B.mapSize,n.spotShadow[S]=V,n.spotShadowMap[S]=z,E++}S++}else if(I.isRectAreaLight){const O=e.get(I);O.color.copy(U).multiplyScalar(k),O.halfWidth.set(I.width*.5,0,0),O.halfHeight.set(0,I.height*.5,0),n.rectArea[w]=O,w++}else if(I.isPointLight){const O=e.get(I);if(O.color.copy(I.color).multiplyScalar(I.intensity),O.distance=I.distance,O.decay=I.decay,I.castShadow){const B=I.shadow,V=t.get(I);V.shadowIntensity=B.intensity,V.shadowBias=B.bias,V.shadowNormalBias=B.normalBias,V.shadowRadius=B.radius,V.shadowMapSize=B.mapSize,V.shadowCameraNear=B.camera.near,V.shadowCameraFar=B.camera.far,n.pointShadow[m]=V,n.pointShadowMap[m]=z,n.pointShadowMatrix[m]=I.shadow.matrix,y++}n.point[m]=O,m++}else if(I.isHemisphereLight){const O=e.get(I);O.skyColor.copy(I.color).multiplyScalar(k),O.groundColor.copy(I.groundColor).multiplyScalar(k),n.hemi[_]=O,_++}}w>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Pe.LTC_FLOAT_1,n.rectAreaLTC2=Pe.LTC_FLOAT_2):(n.rectAreaLTC1=Pe.LTC_HALF_1,n.rectAreaLTC2=Pe.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;const R=n.hash;(R.sunLength!==d||R.directionalLength!==p||R.pointLength!==m||R.spotLength!==S||R.rectAreaLength!==w||R.hemiLength!==_||R.numSunShadows!==g||R.numDirectionalShadows!==M||R.numPointShadows!==y||R.numSpotShadows!==E||R.numSpotMaps!==v||R.numLightProbes!==C)&&(n.sun.length=d,n.directional.length=p,n.spot.length=S,n.rectArea.length=w,n.point.length=m,n.hemi.length=_,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.directionalShadowMatrix.length=M,n.pointShadow.length=y,n.pointShadowMap.length=y,n.pointShadowMatrix.length=y,n.spotShadow.length=E,n.spotShadowMap.length=E,n.spotLightMatrix.length=E+v-b,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=C,R.sunLength=d,R.directionalLength=p,R.pointLength=m,R.spotLength=S,R.rectAreaLength=w,R.hemiLength=_,R.numSunShadows=g,R.numDirectionalShadows=M,R.numPointShadows=y,R.numSpotShadows=E,R.numSpotMaps=v,R.numLightProbes=C,n.version=ty++)}function c(l,h){let f=0,u=0,d=0,g=0,x=0,p=0;const m=h.matrixWorldInverse;for(let S=0,w=l.length;S<w;S++){const _=l[S];if(_.isSunLight){const M=n.sun[f];M.direction.setFromMatrixPosition(_.matrixWorld),M.direction.transformDirection(m),f++}else if(_.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),u++}else if(_.isSpotLight){const M=n.spot[g];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(_.matrixWorld),s.setFromMatrixPosition(_.target.matrixWorld),M.direction.sub(s),M.direction.transformDirection(m),g++}else if(_.isRectAreaLight){const M=n.rectArea[x];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(m),o.identity(),r.copy(_.matrixWorld),r.premultiply(m),o.extractRotation(r),M.halfWidth.set(_.width*.5,0,0),M.halfHeight.set(0,_.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),x++}else if(_.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){const M=n.hemi[p];M.direction.setFromMatrixPosition(_.matrixWorld),M.direction.transformDirection(m),p++}}}return{setup:a,setupView:c,state:n}}function Ou(i){const e=new iy(i),t=[],n=[],s=[];function r(u){f.camera=u,t.length=0,n.length=0,s.length=0}function o(u){t.push(u)}function a(u){n.push(u)}function c(u){s.push(u)}function l(){e.setup(t)}function h(u){e.setupView(t,u)}const f={lightsArray:t,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:l,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:c}}function sy(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new Ou(i),e.set(s,[a])):r>=o.length?(a=new Ou(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}const ry=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,oy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ay=[new F(1,0,0),new F(-1,0,0),new F(0,1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1)],cy=[new F(0,-1,0),new F(0,-1,0),new F(0,0,1),new F(0,0,-1),new F(0,-1,0),new F(0,-1,0)],zu=new Je,ar=new F,Za=new F;function ly(i,e,t){let n=new na;const s=new Ne,r=new Ne,o=new st,a=new Bm,c=new km,l={},h=t.maxTextureSize,f={[Ii]:hn,[hn]:Ii,[Sn]:Sn},u=new Ht({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ne},radius:{value:4}},vertexShader:ry,fragmentShader:oy}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const g=new Tt;g.setAttribute("position",new Nt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Ye(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=gr;let m=this.type;this.render=function(y,E,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||y.length===0)return;this.type===Vp&&(Xe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=gr);const b=i.getRenderTarget(),C=i.getActiveCubeFace(),R=i.getActiveMipmapLevel(),T=i.state;T.setBlending(hi),T.buffers.depth.getReversed()===!0?T.buffers.color.setClear(0,0,0,0):T.buffers.color.setClear(1,1,1,1),T.buffers.depth.setTest(!0),T.setScissorTest(!1);const P=m!==this.type;P&&E.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(U=>U.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,U=y.length;I<U;I++){const k=y[I],D=k.shadow;if(D===void 0){Xe("WebGLShadowMap:",k,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;s.copy(D.mapSize);const z=D.getFrameExtents();s.multiply(z),r.copy(D.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/z.x),s.x=r.x*z.x,D.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/z.y),s.y=r.y*z.y,D.mapSize.y=r.y));const O=i.state.buffers.depth.getReversed();if(D.camera._reversedDepth=O,D.map===null||P===!0){if(D.map!==null&&(D.map.depthTexture!==null&&(D.map.depthTexture.dispose(),D.map.depthTexture=null),D.map.dispose()),this.type===ur){if(k.isPointLight){Xe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}D.map=new mn(s.x,s.y,{format:ts,type:Yn,minFilter:ft,magFilter:ft,generateMipmaps:!1}),D.map.texture.name=k.name+".shadowMap",D.map.depthTexture=new ks(s.x,s.y,cn),D.map.depthTexture.name=k.name+".shadowMapDepth",D.map.depthTexture.format=fi,D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=Bt,D.map.depthTexture.magFilter=Bt}else k.isPointLight?(D.map=new td(s.x),D.map.depthTexture=new vm(s.x,Nn)):(D.map=new mn(s.x,s.y),D.map.depthTexture=new ks(s.x,s.y,Nn)),D.map.depthTexture.name=k.name+".shadowMap",D.map.depthTexture.format=fi,this.type===gr?(D.map.depthTexture.compareFunction=O?Pl:Cl,D.map.depthTexture.minFilter=ft,D.map.depthTexture.magFilter=ft):(D.map.depthTexture.compareFunction=null,D.map.depthTexture.minFilter=Bt,D.map.depthTexture.magFilter=Bt);D.camera.updateProjectionMatrix()}D.map.isWebGLCubeRenderTarget!==!0&&(D.map.width!==s.x||D.map.height!==s.y)&&D.map.setSize(s.x,s.y);const B=D.map.isWebGLCubeRenderTarget?6:D.getViewportCount();k.isPointLight!==!0&&D.updateMatrices(k,v);for(let V=0;V<B;V++){const j=D.getCamera(V);if(k.isPointLight){const W=D.camera,H=D.matrix,X=k.distance||W.far;X!==W.far&&(W.far=X,W.updateProjectionMatrix()),ar.setFromMatrixPosition(k.matrixWorld),W.position.copy(ar),Za.copy(W.position),Za.add(ay[V]),W.up.copy(cy[V]),W.lookAt(Za),W.updateMatrixWorld(),H.makeTranslation(-ar.x,-ar.y,-ar.z),zu.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),D._frustum.setFromProjectionMatrix(zu,W.coordinateSystem,W.reversedDepth)}if(D.map.isWebGLCubeRenderTarget)i.setRenderTarget(D.map,V),i.clear();else{V===0&&(i.setRenderTarget(D.map),i.clear());const W=D.getViewport(V);o.set(r.x*W.x,r.y*W.y,r.x*W.z,r.y*W.w),T.viewport(o)}n=D.getFrustum(V),_(E,v,j,k,this.type)}D.isPointLightShadow!==!0&&this.type===ur&&S(D,v),D.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(b,C,R)};function S(y,E){const v=e.update(x);u.defines.VSM_SAMPLES!==y.blurSamples&&(u.defines.VSM_SAMPLES=y.blurSamples,d.defines.VSM_SAMPLES=y.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),y.mapPass===null?y.mapPass=new mn(s.x,s.y,{format:ts,type:Yn}):(y.mapPass.width!==y.map.width||y.mapPass.height!==y.map.height)&&y.mapPass.setSize(y.map.width,y.map.height),u.uniforms.shadow_pass.value=y.map.depthTexture,u.uniforms.resolution.value.set(y.map.width,y.map.height),u.uniforms.radius.value=y.radius,i.setRenderTarget(y.mapPass),i.clear(),i.renderBufferDirect(E,null,v,u,x,null),d.uniforms.shadow_pass.value=y.mapPass.texture,d.uniforms.resolution.value.set(y.map.width,y.map.height),d.uniforms.radius.value=y.radius,i.setRenderTarget(y.map),i.clear(),i.renderBufferDirect(E,null,v,d,x,null)}function w(y,E,v,b){let C=null;const R=v.isPointLight===!0?y.customDistanceMaterial:y.customDepthMaterial;if(R!==void 0)C=R;else if(C=v.isPointLight===!0?c:a,i.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){const T=C.uuid,P=E.uuid;let I=l[T];I===void 0&&(I={},l[T]=I);let U=I[P];U===void 0&&(U=C.clone(),I[P]=U,E.addEventListener("dispose",M)),C=U}if(C.visible=E.visible,C.wireframe=E.wireframe,b===ur?C.side=E.shadowSide!==null?E.shadowSide:E.side:C.side=E.shadowSide!==null?E.shadowSide:f[E.side],C.alphaMap=E.alphaMap,C.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,C.map=E.map,C.clipShadows=E.clipShadows,C.clippingPlanes=E.clippingPlanes,C.clipIntersection=E.clipIntersection,C.displacementMap=E.displacementMap,C.displacementScale=E.displacementScale,C.displacementBias=E.displacementBias,C.wireframeLinewidth=E.wireframeLinewidth,C.linewidth=E.linewidth,v.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const T=i.properties.get(C);T.light=v}return C}function _(y,E,v,b,C){if(y.visible===!1)return;if(y.layers.test(E.layers)&&(y.isMesh||y.isLine||y.isPoints)&&(y.castShadow||y.receiveShadow&&C===ur)&&(!y.frustumCulled||y.intersectsFrustum(n))){y.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,y.matrixWorld);const P=e.update(y),I=y.material;if(Array.isArray(I)){const U=P.groups;for(let k=0,D=U.length;k<D;k++){const z=U[k],O=I[z.materialIndex];if(O&&O.visible){const B=w(y,O,b,C);y.onBeforeShadow(i,y,E,v,P,B,z),i.renderBufferDirect(v,null,P,B,y,z),y.onAfterShadow(i,y,E,v,P,B,z)}}}else if(I.visible){const U=w(y,I,b,C);y.onBeforeShadow(i,y,E,v,P,U,null),i.renderBufferDirect(v,null,P,U,y,null),y.onAfterShadow(i,y,E,v,P,U,null)}}const T=y.children;for(let P=0,I=T.length;P<I;P++)_(T[P],E,v,b,C)}function M(y){y.target.removeEventListener("dispose",M);for(const v in l){const b=l[v],C=y.target.uuid;C in b&&(b[C].dispose(),delete b[C])}}}function hy(i,e){function t(){let J=!1;const Te=new st;let he=null;const Re=new st(0,0,0,0);return{setMask:function(De){he!==De&&!J&&(i.colorMask(De,De,De,De),he=De)},setLocked:function(De){J=De},setClear:function(De,me,qe,Ve,wt){wt===!0&&(De*=Ve,me*=Ve,qe*=Ve),Te.set(De,me,qe,Ve),Re.equals(Te)===!1&&(i.clearColor(De,me,qe,Ve),Re.copy(Te))},reset:function(){J=!1,he=null,Re.set(-1,0,0,0)}}}function n(){let J=!1,Te=!1,he=null,Re=null,De=null;return{setReversed:function(me){if(Te!==me){const qe=e.get("EXT_clip_control");me?qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.ZERO_TO_ONE_EXT):qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.NEGATIVE_ONE_TO_ONE_EXT),Te=me;const Ve=De;De=null,this.setClear(Ve)}},getReversed:function(){return Te},setTest:function(me){me?Z(i.DEPTH_TEST):ie(i.DEPTH_TEST)},setMask:function(me){he!==me&&!J&&(i.depthMask(me),he=me)},setFunc:function(me){if(Te&&(me=C0[me]),Re!==me){switch(me){case xc:i.depthFunc(i.NEVER);break;case ko:i.depthFunc(i.ALWAYS);break;case vc:i.depthFunc(i.LESS);break;case Er:i.depthFunc(i.LEQUAL);break;case _c:i.depthFunc(i.EQUAL);break;case yc:i.depthFunc(i.GEQUAL);break;case Mc:i.depthFunc(i.GREATER);break;case Sc:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Re=me}},setLocked:function(me){J=me},setClear:function(me){De!==me&&(De=me,Te&&(me=1-me),i.clearDepth(me))},reset:function(){J=!1,he=null,Re=null,De=null,Te=!1}}}function s(){let J=!1,Te=null,he=null,Re=null,De=null,me=null,qe=null,Ve=null,wt=null;return{setTest:function(gt){J||(gt?Z(i.STENCIL_TEST):ie(i.STENCIL_TEST))},setMask:function(gt){Te!==gt&&!J&&(i.stencilMask(gt),Te=gt)},setFunc:function(gt,An,On){(he!==gt||Re!==An||De!==On)&&(i.stencilFunc(gt,An,On),he=gt,Re=An,De=On)},setOp:function(gt,An,On){(me!==gt||qe!==An||Ve!==On)&&(i.stencilOp(gt,An,On),me=gt,qe=An,Ve=On)},setLocked:function(gt){J=gt},setClear:function(gt){wt!==gt&&(i.clearStencil(gt),wt=gt)},reset:function(){J=!1,Te=null,he=null,Re=null,De=null,me=null,qe=null,Ve=null,wt=null}}}const r=new t,o=new n,a=new s,c=new WeakMap,l=new WeakMap;let h={},f={},u={},d=new WeakMap,g=[],x=null,p=!1,m=null,S=null,w=null,_=null,M=null,y=null,E=null,v=new Oe(0,0,0),b=0,C=!1,R=null,T=null,P=null,I=null,U=null;const k=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,z=0;const O=i.getParameter(i.VERSION);O.indexOf("WebGL")!==-1?(z=parseFloat(/^WebGL (\d)/.exec(O)[1]),D=z>=1):O.indexOf("OpenGL ES")!==-1&&(z=parseFloat(/^OpenGL ES (\d)/.exec(O)[1]),D=z>=2);let B=null,V={};const j=i.getParameter(i.SCISSOR_BOX),W=i.getParameter(i.VIEWPORT),H=new st().fromArray(j),X=new st().fromArray(W);function Q(J,Te,he,Re){const De=new Uint8Array(4),me=i.createTexture();i.bindTexture(J,me),i.texParameteri(J,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(J,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let qe=0;qe<he;qe++)J===i.TEXTURE_3D||J===i.TEXTURE_2D_ARRAY?i.texImage3D(Te,0,i.RGBA,1,1,Re,0,i.RGBA,i.UNSIGNED_BYTE,De):i.texImage2D(Te+qe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,De);return me}const $={};$[i.TEXTURE_2D]=Q(i.TEXTURE_2D,i.TEXTURE_2D,1),$[i.TEXTURE_CUBE_MAP]=Q(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[i.TEXTURE_2D_ARRAY]=Q(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),$[i.TEXTURE_3D]=Q(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Z(i.DEPTH_TEST),o.setFunc(Er),pe(!1),ve(Mh),Z(i.CULL_FACE),ge(hi);function Z(J){h[J]!==!0&&(i.enable(J),h[J]=!0)}function ie(J){h[J]!==!1&&(i.disable(J),h[J]=!1)}function fe(J,Te){return u[J]!==Te?(i.bindFramebuffer(J,Te),u[J]=Te,J===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Te),J===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Te),!0):!1}function le(J,Te){let he=g,Re=!1;if(J){he=d.get(Te),he===void 0&&(he=[],d.set(Te,he));const De=J.textures;if(he.length!==De.length||he[0]!==i.COLOR_ATTACHMENT0){for(let me=0,qe=De.length;me<qe;me++)he[me]=i.COLOR_ATTACHMENT0+me;he.length=De.length,Re=!0}}else he[0]!==i.BACK&&(he[0]=i.BACK,Re=!0);Re&&i.drawBuffers(he)}function Se(J){return x!==J?(i.useProgram(J),x=J,!0):!1}const ue={[ws]:i.FUNC_ADD,[Xp]:i.FUNC_SUBTRACT,[$p]:i.FUNC_REVERSE_SUBTRACT};ue[qp]=i.MIN,ue[Yp]=i.MAX;const be={[Kp]:i.ZERO,[Jp]:i.ONE,[Zp]:i.SRC_COLOR,[mf]:i.SRC_ALPHA,[i0]:i.SRC_ALPHA_SATURATE,[t0]:i.DST_COLOR,[Qp]:i.DST_ALPHA,[jp]:i.ONE_MINUS_SRC_COLOR,[gf]:i.ONE_MINUS_SRC_ALPHA,[n0]:i.ONE_MINUS_DST_COLOR,[e0]:i.ONE_MINUS_DST_ALPHA,[s0]:i.CONSTANT_COLOR,[r0]:i.ONE_MINUS_CONSTANT_COLOR,[o0]:i.CONSTANT_ALPHA,[a0]:i.ONE_MINUS_CONSTANT_ALPHA};function ge(J,Te,he,Re,De,me,qe,Ve,wt,gt){if(J===hi){p===!0&&(ie(i.BLEND),p=!1);return}if(p===!1&&(Z(i.BLEND),p=!0),J!==Wp){if(J!==m||gt!==C){if((S!==ws||M!==ws)&&(i.blendEquation(i.FUNC_ADD),S=ws,M=ws),gt)switch(J){case xr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sh:i.blendFunc(i.ONE,i.ONE);break;case bh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Ze("WebGLState: Invalid blending: ",J);break}else switch(J){case xr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Sh:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case bh:Ze("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case wh:Ze("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ze("WebGLState: Invalid blending: ",J);break}w=null,_=null,y=null,E=null,v.set(0,0,0),b=0,m=J,C=gt}return}De=De||Te,me=me||he,qe=qe||Re,(Te!==S||De!==M)&&(i.blendEquationSeparate(ue[Te],ue[De]),S=Te,M=De),(he!==w||Re!==_||me!==y||qe!==E)&&(i.blendFuncSeparate(be[he],be[Re],be[me],be[qe]),w=he,_=Re,y=me,E=qe),(Ve.equals(v)===!1||wt!==b)&&(i.blendColor(Ve.r,Ve.g,Ve.b,wt),v.copy(Ve),b=wt),m=J,C=!1}function xe(J,Te){J.side===Sn?ie(i.CULL_FACE):Z(i.CULL_FACE);let he=J.side===hn;Te&&(he=!he),pe(he),J.blending===xr&&J.transparent===!1?ge(hi):ge(J.blending,J.blendEquation,J.blendSrc,J.blendDst,J.blendEquationAlpha,J.blendSrcAlpha,J.blendDstAlpha,J.blendColor,J.blendAlpha,J.premultipliedAlpha),o.setFunc(J.depthFunc),o.setTest(J.depthTest),o.setMask(J.depthWrite),r.setMask(J.colorWrite);const Re=J.stencilWrite;a.setTest(Re),Re&&(a.setMask(J.stencilWriteMask),a.setFunc(J.stencilFunc,J.stencilRef,J.stencilFuncMask),a.setOp(J.stencilFail,J.stencilZFail,J.stencilZPass)),ze(J.polygonOffset,J.polygonOffsetFactor,J.polygonOffsetUnits),J.alphaToCoverage===!0?Z(i.SAMPLE_ALPHA_TO_COVERAGE):ie(i.SAMPLE_ALPHA_TO_COVERAGE)}function pe(J){R!==J&&(J?i.frontFace(i.CW):i.frontFace(i.CCW),R=J)}function ve(J){J!==Gp?(Z(i.CULL_FACE),J!==T&&(J===Mh?i.cullFace(i.BACK):J===Hp?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ie(i.CULL_FACE),T=J}function Ce(J){J!==P&&(D&&i.lineWidth(J),P=J)}function ze(J,Te,he){J?(Z(i.POLYGON_OFFSET_FILL),(I!==Te||U!==he)&&(I=Te,U=he,o.getReversed()&&(Te=-Te),i.polygonOffset(Te,he))):ie(i.POLYGON_OFFSET_FILL)}function Y(J){J?Z(i.SCISSOR_TEST):ie(i.SCISSOR_TEST)}function de(J){J===void 0&&(J=i.TEXTURE0+k-1),B!==J&&(i.activeTexture(J),B=J)}function G(J,Te,he){he===void 0&&(B===null?he=i.TEXTURE0+k-1:he=B);let Re=V[he];Re===void 0&&(Re={type:void 0,texture:void 0},V[he]=Re),(Re.type!==J||Re.texture!==Te)&&(B!==he&&(i.activeTexture(he),B=he),i.bindTexture(J,Te||$[J]),Re.type=J,Re.texture=Te)}function _e(){const J=V[B];J!==void 0&&J.type!==void 0&&(i.bindTexture(J.type,null),J.type=void 0,J.texture=void 0)}function ye(){try{i.compressedTexImage2D(...arguments)}catch(J){Ze("WebGLState:",J)}}function N(){try{i.compressedTexImage3D(...arguments)}catch(J){Ze("WebGLState:",J)}}function A(){try{i.texSubImage2D(...arguments)}catch(J){Ze("WebGLState:",J)}}function q(){try{i.texSubImage3D(...arguments)}catch(J){Ze("WebGLState:",J)}}function ee(){try{i.compressedTexSubImage2D(...arguments)}catch(J){Ze("WebGLState:",J)}}function re(){try{i.compressedTexSubImage3D(...arguments)}catch(J){Ze("WebGLState:",J)}}function Me(){try{i.texStorage2D(...arguments)}catch(J){Ze("WebGLState:",J)}}function se(){try{i.texStorage3D(...arguments)}catch(J){Ze("WebGLState:",J)}}function ae(){try{i.texImage2D(...arguments)}catch(J){Ze("WebGLState:",J)}}function ce(){try{i.texImage3D(...arguments)}catch(J){Ze("WebGLState:",J)}}function we(J){return f[J]!==void 0?f[J]:i.getParameter(J)}function Be(J,Te){f[J]!==Te&&(i.pixelStorei(J,Te),f[J]=Te)}function Ee(J){H.equals(J)===!1&&(i.scissor(J.x,J.y,J.z,J.w),H.copy(J))}function Ae(J){X.equals(J)===!1&&(i.viewport(J.x,J.y,J.z,J.w),X.copy(J))}function He(J,Te){let he=l.get(Te);he===void 0&&(he=new WeakMap,l.set(Te,he));let Re=he.get(J);Re===void 0&&(Re=i.getUniformBlockIndex(Te,J.name),he.set(J,Re))}function Ke(J,Te){const Re=l.get(Te).get(J);c.get(Te)!==Re&&(i.uniformBlockBinding(Te,Re,J.__bindingPointIndex),c.set(Te,Re))}function Qe(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},B=null,V={},u={},d=new WeakMap,g=[],x=null,p=!1,m=null,S=null,w=null,_=null,M=null,y=null,E=null,v=new Oe(0,0,0),b=0,C=!1,R=null,T=null,P=null,I=null,U=null,H.set(0,0,i.canvas.width,i.canvas.height),X.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:Z,disable:ie,bindFramebuffer:fe,drawBuffers:le,useProgram:Se,setBlending:ge,setMaterial:xe,setFlipSided:pe,setCullFace:ve,setLineWidth:Ce,setPolygonOffset:ze,setScissorTest:Y,activeTexture:de,bindTexture:G,unbindTexture:_e,compressedTexImage2D:ye,compressedTexImage3D:N,texImage2D:ae,texImage3D:ce,pixelStorei:Be,getParameter:we,updateUBOMapping:He,uniformBlockBinding:Ke,texStorage2D:Me,texStorage3D:se,texSubImage2D:A,texSubImage3D:q,compressedTexSubImage2D:ee,compressedTexSubImage3D:re,scissor:Ee,viewport:Ae,reset:Qe}}function uy(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Ne,h=new WeakMap,f=new Set;let u;const d=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(N,A){return g?new OffscreenCanvas(N,A):Ir("canvas")}function p(N,A,q){let ee=1;const re=ye(N);if((re.width>q||re.height>q)&&(ee=q/Math.max(re.width,re.height)),ee<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){const Me=Math.floor(ee*re.width),se=Math.floor(ee*re.height);u===void 0&&(u=x(Me,se));const ae=A?x(Me,se):u;return ae.width=Me,ae.height=se,ae.getContext("2d").drawImage(N,0,0,Me,se),Xe("WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+Me+"x"+se+")."),ae}else return"data"in N&&Xe("WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),N;return N}function m(N){return N.generateMipmaps}function S(N){i.generateMipmap(N)}function w(N){return N.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?i.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function _(N,A,q,ee,re,Me=!1){if(N!==null){if(i[N]!==void 0)return i[N];Xe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let se;ee&&(se=e.get("EXT_texture_norm16"),se||Xe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ae=A;if(A===i.RED&&(q===i.FLOAT&&(ae=i.R32F),q===i.HALF_FLOAT&&(ae=i.R16F),q===i.UNSIGNED_BYTE&&(ae=i.R8),q===i.UNSIGNED_SHORT&&se&&(ae=se.R16_EXT),q===i.SHORT&&se&&(ae=se.R16_SNORM_EXT)),A===i.RED_INTEGER&&(q===i.UNSIGNED_BYTE&&(ae=i.R8UI),q===i.UNSIGNED_SHORT&&(ae=i.R16UI),q===i.UNSIGNED_INT&&(ae=i.R32UI),q===i.BYTE&&(ae=i.R8I),q===i.SHORT&&(ae=i.R16I),q===i.INT&&(ae=i.R32I)),A===i.RG&&(q===i.FLOAT&&(ae=i.RG32F),q===i.HALF_FLOAT&&(ae=i.RG16F),q===i.UNSIGNED_BYTE&&(ae=i.RG8),q===i.UNSIGNED_SHORT&&se&&(ae=se.RG16_EXT),q===i.SHORT&&se&&(ae=se.RG16_SNORM_EXT)),A===i.RG_INTEGER&&(q===i.UNSIGNED_BYTE&&(ae=i.RG8UI),q===i.UNSIGNED_SHORT&&(ae=i.RG16UI),q===i.UNSIGNED_INT&&(ae=i.RG32UI),q===i.BYTE&&(ae=i.RG8I),q===i.SHORT&&(ae=i.RG16I),q===i.INT&&(ae=i.RG32I)),A===i.RGB_INTEGER&&(q===i.UNSIGNED_BYTE&&(ae=i.RGB8UI),q===i.UNSIGNED_SHORT&&(ae=i.RGB16UI),q===i.UNSIGNED_INT&&(ae=i.RGB32UI),q===i.BYTE&&(ae=i.RGB8I),q===i.SHORT&&(ae=i.RGB16I),q===i.INT&&(ae=i.RGB32I)),A===i.RGBA_INTEGER&&(q===i.UNSIGNED_BYTE&&(ae=i.RGBA8UI),q===i.UNSIGNED_SHORT&&(ae=i.RGBA16UI),q===i.UNSIGNED_INT&&(ae=i.RGBA32UI),q===i.BYTE&&(ae=i.RGBA8I),q===i.SHORT&&(ae=i.RGBA16I),q===i.INT&&(ae=i.RGBA32I)),A===i.RGB&&(q===i.UNSIGNED_SHORT&&se&&(ae=se.RGB16_EXT),q===i.SHORT&&se&&(ae=se.RGB16_SNORM_EXT),q===i.UNSIGNED_INT_5_9_9_9_REV&&(ae=i.RGB9_E5),q===i.UNSIGNED_INT_10F_11F_11F_REV&&(ae=i.R11F_G11F_B10F)),A===i.RGBA){const ce=Me?Xo:ht.getTransfer(re);q===i.FLOAT&&(ae=i.RGBA32F),q===i.HALF_FLOAT&&(ae=i.RGBA16F),q===i.UNSIGNED_BYTE&&(ae=ce===_t?i.SRGB8_ALPHA8:i.RGBA8),q===i.UNSIGNED_SHORT&&se&&(ae=se.RGBA16_EXT),q===i.SHORT&&se&&(ae=se.RGBA16_SNORM_EXT),q===i.UNSIGNED_SHORT_4_4_4_4&&(ae=i.RGBA4),q===i.UNSIGNED_SHORT_5_5_5_1&&(ae=i.RGB5_A1)}return(ae===i.R16F||ae===i.R32F||ae===i.RG16F||ae===i.RG32F||ae===i.RGBA16F||ae===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ae}function M(N,A){let q;return N?A===null||A===Nn||A===Tr?q=i.DEPTH24_STENCIL8:A===cn?q=i.DEPTH32F_STENCIL8:A===Ar&&(q=i.DEPTH24_STENCIL8,Xe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):A===null||A===Nn||A===Tr?q=i.DEPTH_COMPONENT24:A===cn?q=i.DEPTH_COMPONENT32F:A===Ar&&(q=i.DEPTH_COMPONENT16),q}function y(N,A){return m(N)===!0||N.isFramebufferTexture&&N.minFilter!==Bt&&N.minFilter!==ft?Math.log2(Math.max(A.width,A.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?A.mipmaps.length:1}function E(N){const A=N.target;A.removeEventListener("dispose",E),b(A),A.isVideoTexture&&h.delete(A),A.isHTMLTexture&&f.delete(A)}function v(N){const A=N.target;A.removeEventListener("dispose",v),R(A)}function b(N){const A=n.get(N);if(A.__webglInit===void 0)return;const q=N.source,ee=d.get(q);if(ee){const re=ee[A.__cacheKey];re.usedTimes--,re.usedTimes===0&&C(N),Object.keys(ee).length===0&&d.delete(q)}n.remove(N)}function C(N){const A=n.get(N);i.deleteTexture(A.__webglTexture);const q=N.source,ee=d.get(q);delete ee[A.__cacheKey],o.memory.textures--}function R(N){const A=n.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),n.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(A.__webglFramebuffer[ee]))for(let re=0;re<A.__webglFramebuffer[ee].length;re++)i.deleteFramebuffer(A.__webglFramebuffer[ee][re]);else i.deleteFramebuffer(A.__webglFramebuffer[ee]);A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer[ee])}else{if(Array.isArray(A.__webglFramebuffer))for(let ee=0;ee<A.__webglFramebuffer.length;ee++)i.deleteFramebuffer(A.__webglFramebuffer[ee]);else i.deleteFramebuffer(A.__webglFramebuffer);if(A.__webglDepthbuffer&&i.deleteRenderbuffer(A.__webglDepthbuffer),A.__webglMultisampledFramebuffer&&i.deleteFramebuffer(A.__webglMultisampledFramebuffer),A.__webglColorRenderbuffer)for(let ee=0;ee<A.__webglColorRenderbuffer.length;ee++)A.__webglColorRenderbuffer[ee]&&i.deleteRenderbuffer(A.__webglColorRenderbuffer[ee]);A.__webglDepthRenderbuffer&&i.deleteRenderbuffer(A.__webglDepthRenderbuffer)}const q=N.textures;for(let ee=0,re=q.length;ee<re;ee++){const Me=n.get(q[ee]);Me.__webglTexture&&(i.deleteTexture(Me.__webglTexture),o.memory.textures--),n.remove(q[ee])}n.remove(N)}let T=0;function P(){T=0}function I(){return T}function U(N){T=N}function k(){const N=T;return N>=s.maxTextures&&Xe("WebGLTextures: Trying to use "+(N+1)+" texture units while this GPU supports only "+s.maxTextures),T+=1,N}function D(N){const A=[];return A.push(N.wrapS),A.push(N.wrapT),A.push(N.wrapR||0),A.push(N.magFilter),A.push(N.minFilter),A.push(N.anisotropy),A.push(N.internalFormat),A.push(N.format),A.push(N.type),A.push(N.generateMipmaps),A.push(N.premultiplyAlpha),A.push(N.flipY),A.push(N.unpackAlignment),A.push(N.colorSpace),A.join()}function z(N,A){const q=n.get(N);if(N.isVideoTexture&&G(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&q.__version!==N.version){const ee=N.image;if(ee===null)Xe("WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)Xe("WebGLRenderer: Texture marked for update but image is incomplete");else{ie(q,N,A);return}}else N.isExternalTexture&&(q.__webglTexture=N.sourceTexture?N.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,q.__webglTexture,i.TEXTURE0+A)}function O(N,A){const q=n.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&q.__version!==N.version){ie(q,N,A);return}else N.isExternalTexture&&(q.__webglTexture=N.sourceTexture?N.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,q.__webglTexture,i.TEXTURE0+A)}function B(N,A){const q=n.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&q.__version!==N.version){ie(q,N,A);return}t.bindTexture(i.TEXTURE_3D,q.__webglTexture,i.TEXTURE0+A)}function V(N,A){const q=n.get(N);if(N.isCubeDepthTexture!==!0&&N.version>0&&q.__version!==N.version){fe(q,N,A);return}t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture,i.TEXTURE0+A)}const j={[es]:i.REPEAT,[Wn]:i.CLAMP_TO_EDGE,[Go]:i.MIRRORED_REPEAT},W={[Bt]:i.NEAREST,[Af]:i.NEAREST_MIPMAP_NEAREST,[fr]:i.NEAREST_MIPMAP_LINEAR,[ft]:i.LINEAR,[Co]:i.LINEAR_MIPMAP_NEAREST,[wn]:i.LINEAR_MIPMAP_LINEAR},H={[_0]:i.NEVER,[w0]:i.ALWAYS,[y0]:i.LESS,[Cl]:i.LEQUAL,[M0]:i.EQUAL,[Pl]:i.GEQUAL,[S0]:i.GREATER,[b0]:i.NOTEQUAL};function X(N,A){if(A.type===cn&&e.has("OES_texture_float_linear")===!1&&(A.magFilter===ft||A.magFilter===Co||A.magFilter===fr||A.magFilter===wn||A.minFilter===ft||A.minFilter===Co||A.minFilter===fr||A.minFilter===wn)&&Xe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(N,i.TEXTURE_WRAP_S,j[A.wrapS]),i.texParameteri(N,i.TEXTURE_WRAP_T,j[A.wrapT]),(N===i.TEXTURE_3D||N===i.TEXTURE_2D_ARRAY)&&i.texParameteri(N,i.TEXTURE_WRAP_R,j[A.wrapR]),i.texParameteri(N,i.TEXTURE_MAG_FILTER,W[A.magFilter]),i.texParameteri(N,i.TEXTURE_MIN_FILTER,W[A.minFilter]),A.compareFunction&&(i.texParameteri(N,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(N,i.TEXTURE_COMPARE_FUNC,H[A.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(A.magFilter===Bt||A.minFilter!==fr&&A.minFilter!==wn||A.type===cn&&e.has("OES_texture_float_linear")===!1)return;if(A.anisotropy>1||n.get(A).__currentAnisotropy){const q=e.get("EXT_texture_filter_anisotropic");i.texParameterf(N,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(A.anisotropy,s.getMaxAnisotropy())),n.get(A).__currentAnisotropy=A.anisotropy}}}function Q(N,A){let q=!1;N.__webglInit===void 0&&(N.__webglInit=!0,A.addEventListener("dispose",E));const ee=A.source;let re=d.get(ee);re===void 0&&(re={},d.set(ee,re));const Me=D(A);if(Me!==N.__cacheKey){re[Me]===void 0&&(re[Me]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,q=!0),re[Me].usedTimes++;const se=re[N.__cacheKey];se!==void 0&&(re[N.__cacheKey].usedTimes--,se.usedTimes===0&&C(A)),N.__cacheKey=Me,N.__webglTexture=re[Me].texture}return q}function $(N,A,q){return Math.floor(Math.floor(N/q)/A)}function Z(N,A,q,ee){const Me=N.updateRanges;if(Me.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,A.width,A.height,q,ee,A.data);else{Me.sort((Be,Ee)=>Be.start-Ee.start);let se=0;for(let Be=1;Be<Me.length;Be++){const Ee=Me[se],Ae=Me[Be],He=Ee.start+Ee.count,Ke=$(Ae.start,A.width,4),Qe=$(Ee.start,A.width,4);Ae.start<=He+1&&Ke===Qe&&$(Ae.start+Ae.count-1,A.width,4)===Ke?Ee.count=Math.max(Ee.count,Ae.start+Ae.count-Ee.start):(++se,Me[se]=Ae)}Me.length=se+1;const ae=t.getParameter(i.UNPACK_ROW_LENGTH),ce=t.getParameter(i.UNPACK_SKIP_PIXELS),we=t.getParameter(i.UNPACK_SKIP_ROWS);t.pixelStorei(i.UNPACK_ROW_LENGTH,A.width);for(let Be=0,Ee=Me.length;Be<Ee;Be++){const Ae=Me[Be],He=Math.floor(Ae.start/4),Ke=Math.ceil(Ae.count/4),Qe=He%A.width,J=Math.floor(He/A.width),Te=Ke,he=1;t.pixelStorei(i.UNPACK_SKIP_PIXELS,Qe),t.pixelStorei(i.UNPACK_SKIP_ROWS,J),t.texSubImage2D(i.TEXTURE_2D,0,Qe,J,Te,he,q,ee,A.data)}N.clearUpdateRanges(),t.pixelStorei(i.UNPACK_ROW_LENGTH,ae),t.pixelStorei(i.UNPACK_SKIP_PIXELS,ce),t.pixelStorei(i.UNPACK_SKIP_ROWS,we)}}function ie(N,A,q){let ee=i.TEXTURE_2D;(A.isDataArrayTexture||A.isCompressedArrayTexture)&&(ee=i.TEXTURE_2D_ARRAY),A.isData3DTexture&&(ee=i.TEXTURE_3D);const re=Q(N,A),Me=A.source;t.bindTexture(ee,N.__webglTexture,i.TEXTURE0+q);const se=n.get(Me);if(Me.version!==se.__version||re===!0){if(t.activeTexture(i.TEXTURE0+q),(typeof ImageBitmap<"u"&&A.image instanceof ImageBitmap)===!1){const he=ht.getPrimaries(ht.workingColorSpace),Re=A.colorSpace===Ti?null:ht.getPrimaries(A.colorSpace),De=A.colorSpace===Ti||he===Re?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,De)}t.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment);let ce=p(A.image,!1,s.maxTextureSize);ce=_e(A,ce);const we=r.convert(A.format,A.colorSpace),Be=r.convert(A.type);let Ee=_(A.internalFormat,we,Be,A.normalized,A.colorSpace,A.isVideoTexture);X(ee,A);let Ae;const He=A.mipmaps,Ke=A.isVideoTexture!==!0,Qe=se.__version===void 0||re===!0,J=Me.dataReady,Te=y(A,ce);if(A.isDepthTexture)Ee=M(A.format===$i,A.type),Qe&&(Ke?t.texStorage2D(i.TEXTURE_2D,1,Ee,ce.width,ce.height):t.texImage2D(i.TEXTURE_2D,0,Ee,ce.width,ce.height,0,we,Be,null));else if(A.isDataTexture)if(He.length>0){Ke&&Qe&&t.texStorage2D(i.TEXTURE_2D,Te,Ee,He[0].width,He[0].height);for(let he=0,Re=He.length;he<Re;he++)Ae=He[he],Ke?J&&t.texSubImage2D(i.TEXTURE_2D,he,0,0,Ae.width,Ae.height,we,Be,Ae.data):t.texImage2D(i.TEXTURE_2D,he,Ee,Ae.width,Ae.height,0,we,Be,Ae.data);A.generateMipmaps=!1}else Ke?(Qe&&t.texStorage2D(i.TEXTURE_2D,Te,Ee,ce.width,ce.height),J&&Z(A,ce,we,Be)):t.texImage2D(i.TEXTURE_2D,0,Ee,ce.width,ce.height,0,we,Be,ce.data);else if(A.isCompressedTexture)if(A.isCompressedArrayTexture){Ke&&Qe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Te,Ee,He[0].width,He[0].height,ce.depth);for(let he=0,Re=He.length;he<Re;he++)if(Ae=He[he],A.format!==rn)if(we!==null)if(Ke){if(J)if(A.layerUpdates.size>0){const De=gu(Ae.width,Ae.height,A.format,A.type);for(const me of A.layerUpdates){const qe=Ae.data.subarray(me*De/Ae.data.BYTES_PER_ELEMENT,(me+1)*De/Ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,he,0,0,me,Ae.width,Ae.height,1,we,qe)}}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,he,0,0,0,Ae.width,Ae.height,ce.depth,we,Ae.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,he,Ee,Ae.width,Ae.height,ce.depth,0,Ae.data,0,0);else Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ke?J&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,he,0,0,0,Ae.width,Ae.height,ce.depth,we,Be,Ae.data):t.texImage3D(i.TEXTURE_2D_ARRAY,he,Ee,Ae.width,Ae.height,ce.depth,0,we,Be,Ae.data);A.layerUpdates.size>0&&A.clearLayerUpdates()}else{Ke&&Qe&&t.texStorage2D(i.TEXTURE_2D,Te,Ee,He[0].width,He[0].height);for(let he=0,Re=He.length;he<Re;he++)Ae=He[he],A.format!==rn?we!==null?Ke?J&&t.compressedTexSubImage2D(i.TEXTURE_2D,he,0,0,Ae.width,Ae.height,we,Ae.data):t.compressedTexImage2D(i.TEXTURE_2D,he,Ee,Ae.width,Ae.height,0,Ae.data):Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ke?J&&t.texSubImage2D(i.TEXTURE_2D,he,0,0,Ae.width,Ae.height,we,Be,Ae.data):t.texImage2D(i.TEXTURE_2D,he,Ee,Ae.width,Ae.height,0,we,Be,Ae.data)}else if(A.isDataArrayTexture)if(Ke){if(Qe&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Te,Ee,ce.width,ce.height,ce.depth),J)if(A.layerUpdates.size>0){const he=gu(ce.width,ce.height,A.format,A.type);for(const Re of A.layerUpdates){const De=ce.data.subarray(Re*he/ce.data.BYTES_PER_ELEMENT,(Re+1)*he/ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Re,ce.width,ce.height,1,we,Be,De)}A.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,we,Be,ce.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ee,ce.width,ce.height,ce.depth,0,we,Be,ce.data);else if(A.isData3DTexture)Ke?(Qe&&t.texStorage3D(i.TEXTURE_3D,Te,Ee,ce.width,ce.height,ce.depth),J&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,we,Be,ce.data)):t.texImage3D(i.TEXTURE_3D,0,Ee,ce.width,ce.height,ce.depth,0,we,Be,ce.data);else if(A.isFramebufferTexture){if(Qe)if(Ke)t.texStorage2D(i.TEXTURE_2D,Te,Ee,ce.width,ce.height);else{let he=ce.width,Re=ce.height;for(let De=0;De<Te;De++)t.texImage2D(i.TEXTURE_2D,De,Ee,he,Re,0,we,Be,null),he>>=1,Re>>=1}}else if(A.isHTMLTexture){if("texElementImage2D"in i){const he=i.canvas;if(he.hasAttribute("layoutsubtree")||he.setAttribute("layoutsubtree","true"),ce.parentNode!==he){he.appendChild(ce),f.add(A),he.onpaint=Re=>{const De=Re.changedElements;for(const me of f)De.includes(me.image)&&(me.needsUpdate=!0)},he.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,ce);else{const De=i.RGBA,me=i.RGBA,qe=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,De,me,qe,ce)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(He.length>0){if(Ke&&Qe){const he=ye(He[0]);t.texStorage2D(i.TEXTURE_2D,Te,Ee,he.width,he.height)}for(let he=0,Re=He.length;he<Re;he++)Ae=He[he],Ke?J&&t.texSubImage2D(i.TEXTURE_2D,he,0,0,we,Be,Ae):t.texImage2D(i.TEXTURE_2D,he,Ee,we,Be,Ae);A.generateMipmaps=!1}else if(Ke){if(Qe){const he=ye(ce);t.texStorage2D(i.TEXTURE_2D,Te,Ee,he.width,he.height)}J&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,we,Be,ce)}else t.texImage2D(i.TEXTURE_2D,0,Ee,we,Be,ce);m(A)&&S(ee),se.__version=Me.version,A.onUpdate&&A.onUpdate(A)}N.__version=A.version}function fe(N,A,q){if(A.image.length!==6)return;const ee=Q(N,A),re=A.source;t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+q);const Me=n.get(re);if(re.version!==Me.__version||ee===!0){t.activeTexture(i.TEXTURE0+q);const se=ht.getPrimaries(ht.workingColorSpace),ae=A.colorSpace===Ti?null:ht.getPrimaries(A.colorSpace),ce=A.colorSpace===Ti||se===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,A.flipY),t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,A.premultiplyAlpha),t.pixelStorei(i.UNPACK_ALIGNMENT,A.unpackAlignment),t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const we=A.isCompressedTexture||A.image[0].isCompressedTexture,Be=A.image[0]&&A.image[0].isDataTexture,Ee=[];for(let me=0;me<6;me++)!we&&!Be?Ee[me]=p(A.image[me],!0,s.maxCubemapSize):Ee[me]=Be?A.image[me].image:A.image[me],Ee[me]=_e(A,Ee[me]);const Ae=Ee[0],He=r.convert(A.format,A.colorSpace),Ke=r.convert(A.type),Qe=_(A.internalFormat,He,Ke,A.normalized,A.colorSpace),J=A.isVideoTexture!==!0,Te=Me.__version===void 0||ee===!0,he=re.dataReady;let Re=y(A,Ae);X(i.TEXTURE_CUBE_MAP,A);let De;if(we){J&&Te&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,Qe,Ae.width,Ae.height);for(let me=0;me<6;me++){De=Ee[me].mipmaps;for(let qe=0;qe<De.length;qe++){const Ve=De[qe];A.format!==rn?He!==null?J?he&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,qe,0,0,Ve.width,Ve.height,He,Ve.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,qe,Qe,Ve.width,Ve.height,0,Ve.data):Xe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):J?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,qe,0,0,Ve.width,Ve.height,He,Ke,Ve.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,qe,Qe,Ve.width,Ve.height,0,He,Ke,Ve.data)}}}else{if(De=A.mipmaps,J&&Te){De.length>0&&Re++;const me=ye(Ee[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Re,Qe,me.width,me.height)}for(let me=0;me<6;me++)if(Be){J?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,Ee[me].width,Ee[me].height,He,Ke,Ee[me].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,Qe,Ee[me].width,Ee[me].height,0,He,Ke,Ee[me].data);for(let qe=0;qe<De.length;qe++){const wt=De[qe].image[me].image;J?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,qe+1,0,0,wt.width,wt.height,He,Ke,wt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,qe+1,Qe,wt.width,wt.height,0,He,Ke,wt.data)}}else{J?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,He,Ke,Ee[me]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,Qe,He,Ke,Ee[me]);for(let qe=0;qe<De.length;qe++){const Ve=De[qe];J?he&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,qe+1,0,0,He,Ke,Ve.image[me]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+me,qe+1,Qe,He,Ke,Ve.image[me])}}}m(A)&&S(i.TEXTURE_CUBE_MAP),Me.__version=re.version,A.onUpdate&&A.onUpdate(A)}N.__version=A.version}function le(N,A,q,ee,re,Me){const se=r.convert(q.format,q.colorSpace),ae=r.convert(q.type),ce=_(q.internalFormat,se,ae,q.normalized,q.colorSpace),we=n.get(A),Be=n.get(q);if(Be.__renderTarget=A,!we.__hasExternalTextures){const Ee=Math.max(1,A.width>>Me),Ae=Math.max(1,A.height>>Me);re===i.TEXTURE_3D||re===i.TEXTURE_2D_ARRAY?t.texImage3D(re,Me,ce,Ee,Ae,A.depth,0,se,ae,null):t.texImage2D(re,Me,ce,Ee,Ae,0,se,ae,null)}t.bindFramebuffer(i.FRAMEBUFFER,N),de(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ee,re,Be.__webglTexture,0,Y(A)):(re===i.TEXTURE_2D||re>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ee,re,Be.__webglTexture,Me),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Se(N,A,q){if(i.bindRenderbuffer(i.RENDERBUFFER,N),A.depthBuffer){const ee=A.depthTexture,re=ee&&ee.isDepthTexture?ee.type:null,Me=M(A.stencilBuffer,re),se=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;de(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Y(A),Me,A.width,A.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,Y(A),Me,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,Me,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,se,i.RENDERBUFFER,N)}else{const ee=A.textures;for(let re=0;re<ee.length;re++){const Me=ee[re],se=r.convert(Me.format,Me.colorSpace),ae=r.convert(Me.type),ce=_(Me.internalFormat,se,ae,Me.normalized,Me.colorSpace);de(A)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Y(A),ce,A.width,A.height):q?i.renderbufferStorageMultisample(i.RENDERBUFFER,Y(A),ce,A.width,A.height):i.renderbufferStorage(i.RENDERBUFFER,ce,A.width,A.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ue(N,A,q){const ee=A.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(i.FRAMEBUFFER,N),!(A.depthTexture&&A.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const re=n.get(A.depthTexture);if(re.__renderTarget=A,(!re.__webglTexture||A.depthTexture.image.width!==A.width||A.depthTexture.image.height!==A.height)&&(A.depthTexture.image.width=A.width,A.depthTexture.image.height=A.height,A.depthTexture.needsUpdate=!0),ee){if(re.__webglInit===void 0&&(re.__webglInit=!0,A.depthTexture.addEventListener("dispose",E)),re.__webglTexture===void 0){re.__webglTexture=i.createTexture(),t.bindTexture(i.TEXTURE_CUBE_MAP,re.__webglTexture),X(i.TEXTURE_CUBE_MAP,A.depthTexture);const we=r.convert(A.depthTexture.format),Be=r.convert(A.depthTexture.type);let Ee;A.depthTexture.format===fi?Ee=i.DEPTH_COMPONENT24:A.depthTexture.format===$i&&(Ee=i.DEPTH24_STENCIL8);for(let Ae=0;Ae<6;Ae++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Ae,0,Ee,A.width,A.height,0,we,Be,null)}}else z(A.depthTexture,0);const Me=re.__webglTexture,se=Y(A),ae=ee?i.TEXTURE_CUBE_MAP_POSITIVE_X+q:i.TEXTURE_2D,ce=A.depthTexture.format===$i?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(A.depthTexture.format===fi)de(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,ae,Me,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,ce,ae,Me,0);else if(A.depthTexture.format===$i)de(A)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ce,ae,Me,0,se):i.framebufferTexture2D(i.FRAMEBUFFER,ce,ae,Me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function be(N){const A=n.get(N),q=N.isWebGLCubeRenderTarget===!0;if(A.__boundDepthTexture!==N.depthTexture){const ee=N.depthTexture;if(A.__depthDisposeCallback&&A.__depthDisposeCallback(),ee){const re=()=>{delete A.__boundDepthTexture,delete A.__depthDisposeCallback,ee.removeEventListener("dispose",re)};ee.addEventListener("dispose",re),A.__depthDisposeCallback=re}A.__boundDepthTexture=ee}if(N.depthTexture&&!A.__autoAllocateDepthBuffer)if(q)for(let ee=0;ee<6;ee++)ue(A.__webglFramebuffer[ee],N,ee);else{const ee=N.texture.mipmaps;ee&&ee.length>0?ue(A.__webglFramebuffer[0],N,0):ue(A.__webglFramebuffer,N,0)}else if(q){A.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[ee]),A.__webglDepthbuffer[ee]===void 0)A.__webglDepthbuffer[ee]=i.createRenderbuffer(),Se(A.__webglDepthbuffer[ee],N,!1);else{const re=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=A.__webglDepthbuffer[ee];i.bindRenderbuffer(i.RENDERBUFFER,Me),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,Me)}}else{const ee=N.texture.mipmaps;if(ee&&ee.length>0?t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,A.__webglFramebuffer),A.__webglDepthbuffer===void 0)A.__webglDepthbuffer=i.createRenderbuffer(),Se(A.__webglDepthbuffer,N,!1);else{const re=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Me=A.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,Me),i.framebufferRenderbuffer(i.FRAMEBUFFER,re,i.RENDERBUFFER,Me)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function ge(N,A,q){const ee=n.get(N);A!==void 0&&le(ee.__webglFramebuffer,N,N.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),q!==void 0&&be(N)}function xe(N){const A=N.texture,q=n.get(N),ee=n.get(A);N.addEventListener("dispose",v);const re=N.textures,Me=N.isWebGLCubeRenderTarget===!0,se=re.length>1;if(se||(ee.__webglTexture===void 0&&(ee.__webglTexture=i.createTexture()),ee.__version=A.version,o.memory.textures++),Me){q.__webglFramebuffer=[];for(let ae=0;ae<6;ae++)if(A.mipmaps&&A.mipmaps.length>0){q.__webglFramebuffer[ae]=[];for(let ce=0;ce<A.mipmaps.length;ce++)q.__webglFramebuffer[ae][ce]=i.createFramebuffer()}else q.__webglFramebuffer[ae]=i.createFramebuffer()}else{if(A.mipmaps&&A.mipmaps.length>0){q.__webglFramebuffer=[];for(let ae=0;ae<A.mipmaps.length;ae++)q.__webglFramebuffer[ae]=i.createFramebuffer()}else q.__webglFramebuffer=i.createFramebuffer();if(se)for(let ae=0,ce=re.length;ae<ce;ae++){const we=n.get(re[ae]);we.__webglTexture===void 0&&(we.__webglTexture=i.createTexture(),o.memory.textures++)}if(N.samples>0&&de(N)===!1){q.__webglMultisampledFramebuffer=i.createFramebuffer(),q.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let ae=0;ae<re.length;ae++){const ce=re[ae];q.__webglColorRenderbuffer[ae]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,q.__webglColorRenderbuffer[ae]);const we=r.convert(ce.format,ce.colorSpace),Be=r.convert(ce.type),Ee=_(ce.internalFormat,we,Be,ce.normalized,ce.colorSpace,N.isXRRenderTarget===!0),Ae=Y(N);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ae,Ee,N.width,N.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,q.__webglColorRenderbuffer[ae])}i.bindRenderbuffer(i.RENDERBUFFER,null),N.depthBuffer&&(q.__webglDepthRenderbuffer=i.createRenderbuffer(),Se(q.__webglDepthRenderbuffer,N,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(Me){t.bindTexture(i.TEXTURE_CUBE_MAP,ee.__webglTexture),X(i.TEXTURE_CUBE_MAP,A);for(let ae=0;ae<6;ae++)if(A.mipmaps&&A.mipmaps.length>0)for(let ce=0;ce<A.mipmaps.length;ce++)le(q.__webglFramebuffer[ae][ce],N,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,ce);else le(q.__webglFramebuffer[ae],N,A,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0);m(A)&&S(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){for(let ae=0,ce=re.length;ae<ce;ae++){const we=re[ae],Be=n.get(we);let Ee=i.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(Ee=N.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(Ee,Be.__webglTexture),X(Ee,we),le(q.__webglFramebuffer,N,we,i.COLOR_ATTACHMENT0+ae,Ee,0),m(we)&&S(Ee)}t.unbindTexture()}else{let ae=i.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(ae=N.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,ee.__webglTexture),X(ae,A),A.mipmaps&&A.mipmaps.length>0)for(let ce=0;ce<A.mipmaps.length;ce++)le(q.__webglFramebuffer[ce],N,A,i.COLOR_ATTACHMENT0,ae,ce);else le(q.__webglFramebuffer,N,A,i.COLOR_ATTACHMENT0,ae,0);m(A)&&S(ae),t.unbindTexture()}N.depthBuffer&&be(N)}function pe(N){const A=N.textures;for(let q=0,ee=A.length;q<ee;q++){const re=A[q];if(m(re)){const Me=w(N),se=n.get(re).__webglTexture;t.bindTexture(Me,se),S(Me),t.unbindTexture()}}}const ve=[],Ce=[];function ze(N){if(N.samples>0){if(de(N)===!1){const A=N.textures,q=N.width,ee=N.height;let re=i.COLOR_BUFFER_BIT;const Me=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,se=n.get(N),ae=A.length>1;if(ae)for(let we=0;we<A.length;we++)t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,se.__webglMultisampledFramebuffer);const ce=N.texture.mipmaps;ce&&ce.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglFramebuffer);for(let we=0;we<A.length;we++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(re|=i.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(re|=i.STENCIL_BUFFER_BIT)),ae){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,se.__webglColorRenderbuffer[we]);const Be=n.get(A[we]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Be,0)}i.blitFramebuffer(0,0,q,ee,0,0,q,ee,re,i.NEAREST),c===!0&&(ve.length=0,Ce.length=0,ve.push(i.COLOR_ATTACHMENT0+we),N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&(ve.push(Me),Ce.push(Me),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ce)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ve))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ae)for(let we=0;we<A.length;we++){t.bindFramebuffer(i.FRAMEBUFFER,se.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,se.__webglColorRenderbuffer[we]);const Be=n.get(A[we]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,se.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,Be,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,se.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&c){const A=N.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[A])}}}function Y(N){return Math.min(s.maxSamples,N.samples)}function de(N){const A=n.get(N);return N.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&A.__useRenderToTexture!==!1}function G(N){const A=o.render.frame;h.get(N)!==A&&(h.set(N,A),N.update())}function _e(N,A){const q=N.colorSpace,ee=N.format,re=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||q!==un&&q!==Ti&&(ht.getTransfer(q)===_t?(ee!==rn||re!==pn)&&Xe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Ze("WebGLTextures: Unsupported texture color space:",q)),A}function ye(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(l.width=N.naturalWidth||N.width,l.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(l.width=N.displayWidth,l.height=N.displayHeight):(l.width=N.width,l.height=N.height),l}this.allocateTextureUnit=k,this.resetTextureUnits=P,this.getTextureUnits=I,this.setTextureUnits=U,this.setTexture2D=z,this.setTexture2DArray=O,this.setTexture3D=B,this.setTextureCube=V,this.rebindTextures=ge,this.setupRenderTarget=xe,this.updateRenderTargetMipmap=pe,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=le,this.useMultisampledRTT=de,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function fy(i,e){function t(n,s=Ti){let r;const o=ht.getTransfer(s);if(n===pn)return i.UNSIGNED_BYTE;if(n===bl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===wl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Cf)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Pf)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Tf)return i.BYTE;if(n===Rf)return i.SHORT;if(n===Ar)return i.UNSIGNED_SHORT;if(n===Sl)return i.INT;if(n===Nn)return i.UNSIGNED_INT;if(n===cn)return i.FLOAT;if(n===Yn)return i.HALF_FLOAT;if(n===If)return i.ALPHA;if(n===Lf)return i.RGB;if(n===rn)return i.RGBA;if(n===fi)return i.DEPTH_COMPONENT;if(n===$i)return i.DEPTH_STENCIL;if(n===zr)return i.RED;if(n===El)return i.RED_INTEGER;if(n===ts)return i.RG;if(n===Al)return i.RG_INTEGER;if(n===Tl)return i.RGBA_INTEGER;if(n===Po||n===Io||n===Lo||n===Do)if(o===_t)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Po)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Io)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Lo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Do)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Po)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Io)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Lo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Do)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===bc||n===wc||n===Ec||n===Ac)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===bc)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wc)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ec)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ac)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Tc||n===Rc||n===Cc||n===Pc||n===Ic||n===Ho||n===Lc)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Tc||n===Rc)return o===_t?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Cc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Pc)return r.COMPRESSED_R11_EAC;if(n===Ic)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Ho)return r.COMPRESSED_RG11_EAC;if(n===Lc)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Dc||n===Nc||n===Uc||n===Fc||n===Oc||n===zc||n===Bc||n===kc||n===Gc||n===Hc||n===Vc||n===Wc||n===Xc||n===$c)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Dc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Nc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Uc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Fc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Oc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===zc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Bc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===kc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Gc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Hc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Vc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Wc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Xc)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===$c)return o===_t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===qc||n===Yc||n===Kc)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===qc)return o===_t?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Yc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Kc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Jc||n===Zc||n===Vo||n===jc)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Jc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Zc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Vo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===jc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Tr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const dy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,py=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class my{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new Vf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Ht({vertexShader:dy,fragmentShader:py,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ye(new xn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class gy extends Ui{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,f=null,u=null,d=null,g=null;const x=typeof XRWebGLBinding<"u",p=new my,m={},S=t.getContextAttributes();let w=null,_=null;const M=[],y=[],E=new Ne;let v=null,b=null;const C=new an;C.viewport=new st;const R=new an;R.viewport=new st;const T=[C,R],P=new hg;let I=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let Z=M[$];return Z===void 0&&(Z=new ba,M[$]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function($){let Z=M[$];return Z===void 0&&(Z=new ba,M[$]=Z),Z.getGripSpace()},this.getHand=function($){let Z=M[$];return Z===void 0&&(Z=new ba,M[$]=Z),Z.getHandSpace()};function k($){const Z=y.indexOf($.inputSource);if(Z===-1)return;const ie=M[Z];ie!==void 0&&(ie.update($.inputSource,$.frame,l||o),ie.dispatchEvent({type:$.type,data:$.inputSource}))}function D(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",D),s.removeEventListener("inputsourceschange",z);for(let $=0;$<M.length;$++){const Z=y[$];Z!==null&&(y[$]=null,M[$].disconnect(Z))}I=null,U=null,p.reset();for(const $ in m)delete m[$];if(e.setRenderTarget(w),d=null,u=null,f=null,s=null,_=null,Q.stop(),n.isPresenting=!1,e.setPixelRatio(v),e.setSize(E.width,E.height,!1),b!==null){const $=b.camera;$.fov=b.fov,$.zoom=b.zoom,$.updateProjectionMatrix(),b=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&Xe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&Xe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(s,t)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(w=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",D),s.addEventListener("inputsourceschange",z),S.xrCompatible!==!0&&await t.makeXRCompatible(),v=e.getPixelRatio(),e.getSize(E),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let ie=null,fe=null,le=null;S.depth&&(le=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=S.stencil?$i:fi,fe=S.stencil?Tr:Nn);const Se={colorFormat:t.RGBA8,depthFormat:le,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Se),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),_=new mn(u.textureWidth,u.textureHeight,{format:rn,type:pn,depthTexture:new ks(u.textureWidth,u.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const ie={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,t,ie),s.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new mn(d.framebufferWidth,d.framebufferHeight,{format:rn,type:pn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Q.setContext(s),Q.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function z($){for(let Z=0;Z<$.removed.length;Z++){const ie=$.removed[Z],fe=y.indexOf(ie);fe>=0&&(y[fe]=null,M[fe].disconnect(ie))}for(let Z=0;Z<$.added.length;Z++){const ie=$.added[Z];let fe=y.indexOf(ie);if(fe===-1){for(let Se=0;Se<M.length;Se++)if(Se>=y.length){y.push(ie),fe=Se;break}else if(y[Se]===null){y[Se]=ie,fe=Se;break}if(fe===-1)break}const le=M[fe];le&&le.connect(ie)}}const O=new F,B=new F;function V($,Z,ie){O.setFromMatrixPosition(Z.matrixWorld),B.setFromMatrixPosition(ie.matrixWorld);const fe=O.distanceTo(B),le=Z.projectionMatrix.elements,Se=ie.projectionMatrix.elements,ue=le[14]/(le[10]-1),be=le[14]/(le[10]+1),ge=(le[9]+1)/le[5],xe=(le[9]-1)/le[5],pe=(le[8]-1)/le[0],ve=(Se[8]+1)/Se[0],Ce=ue*pe,ze=ue*ve,Y=fe/(-pe+ve),de=Y*-pe;if(Z.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(de),$.translateZ(Y),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),le[10]===-1)$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const G=ue+Y,_e=be+Y,ye=Ce-de,N=ze+(fe-de),A=ge*be/_e*G,q=xe*be/_e*G;$.projectionMatrix.makePerspective(ye,N,A,q,G,_e),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function j($,Z){Z===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(Z.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;let Z=$.near,ie=$.far;p.texture!==null&&(p.depthNear>0&&(Z=p.depthNear),p.depthFar>0&&(ie=p.depthFar)),P.near=R.near=C.near=Z,P.far=R.far=C.far=ie,(I!==P.near||U!==P.far)&&(s.updateRenderState({depthNear:P.near,depthFar:P.far}),I=P.near,U=P.far),P.layers.mask=$.layers.mask|6,C.layers.mask=P.layers.mask&-5,R.layers.mask=P.layers.mask&-3;const fe=$.parent,le=P.cameras;j(P,fe);for(let Se=0;Se<le.length;Se++)j(le[Se],fe);le.length===2?V(P,C,R):P.projectionMatrix.copy(C.projectionMatrix),b===null&&$.isPerspectiveCamera&&(b={camera:$,fov:$.fov,zoom:$.zoom}),W($,P,fe)};function W($,Z,ie){ie===null?$.matrix.copy(Z.matrixWorld):($.matrix.copy(ie.matrixWorld),$.matrix.invert(),$.matrix.multiply(Z.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(Z.projectionMatrix),$.projectionMatrixInverse.copy(Z.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=zs*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return P},this.getFoveation=function(){if(!(u===null&&d===null))return c},this.setFoveation=function($){c=$,u!==null&&(u.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(P)},this.getCameraTexture=function($){return m[$]};let H=null;function X($,Z){if(h=Z.getViewerPose(l||o),g=Z,h!==null){const ie=h.views;d!==null&&(e.setRenderTargetFramebuffer(_,d.framebuffer),e.setRenderTarget(_));let fe=!1;ie.length!==P.cameras.length&&(P.cameras.length=0,fe=!0);for(let be=0;be<ie.length;be++){const ge=ie[be];let xe=null;if(d!==null)xe=d.getViewport(ge);else{const ve=f.getViewSubImage(u,ge);xe=ve.viewport,be===0&&(e.setRenderTargetTextures(_,ve.colorTexture,ve.depthStencilTexture),e.setRenderTarget(_))}let pe=T[be];pe===void 0&&(pe=new an,pe.layers.enable(be),pe.viewport=new st,T[be]=pe),pe.matrix.fromArray(ge.transform.matrix),pe.matrix.decompose(pe.position,pe.quaternion,pe.scale),pe.projectionMatrix.fromArray(ge.projectionMatrix),pe.projectionMatrixInverse.copy(pe.projectionMatrix).invert(),pe.viewport.set(xe.x,xe.y,xe.width,xe.height),be===0&&(P.matrix.copy(pe.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale)),fe===!0&&P.cameras.push(pe)}const le=s.enabledFeatures;if(le&&le.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){f=n.getBinding();const be=f.getDepthInformation(ie[0]);be&&be.isValid&&be.texture&&p.init(be,s.renderState)}if(le&&le.includes("camera-access")&&x){e.state.unbindTexture(),f=n.getBinding();for(let be=0;be<ie.length;be++){const ge=ie[be].camera;if(ge){let xe=m[ge];xe||(xe=new Vf,m[ge]=xe);const pe=f.getCameraImage(ge);xe.sourceTexture=pe}}}}for(let ie=0;ie<M.length;ie++){const fe=y[ie],le=M[ie];fe!==null&&le!==void 0&&le.update(fe,Z,l||o)}H&&H($,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),g=null}const Q=new Qf;Q.setAnimationLoop(X),this.setAnimationLoop=function($){H=$},this.dispose=function(){}}}const xy=new Je,od=new je;od.set(-1,0,0,0,1,0,0,0,1);function vy(i,e){function t(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,qf(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,S,w,_){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),f(p,m)):m.isMeshPhongMaterial?(r(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),u(p,m),m.isMeshPhysicalMaterial&&d(p,m,_)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),x(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?c(p,m,S,w):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,t(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===hn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,t(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===hn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,t(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,t(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const S=e.get(m),w=S.envMap,_=S.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(xy.makeRotationFromEuler(_)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(od),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,S,w){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*S,p.scale.value=w*.5,m.map&&(p.map.value=m.map,t(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,t(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,t(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function f(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,S){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===hn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){const S=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function _y(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,M){const y=M.program;n.uniformBlockBinding(_,y)}function l(_,M){let y=s[_.id];y===void 0&&(p(_),y=h(_),s[_.id]=y,_.addEventListener("dispose",S));const E=M.program;n.updateUBOMapping(_,E);const v=e.render.frame;r[_.id]!==v&&(u(_),r[_.id]=v)}function h(_){const M=f();_.__bindingPointIndex=M;const y=i.createBuffer(),E=_.__size,v=_.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,E,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,y),y}function f(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return Ze("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const M=s[_.id],y=_.uniforms,E=_.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let v=0,b=y.length;v<b;v++){const C=y[v];if(Array.isArray(C))for(let R=0,T=C.length;R<T;R++)d(C[R],v,R,E);else d(C,v,0,E)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(_,M,y,E){if(x(_,M,y,E)===!0){const v=_.__offset,b=_.value;if(Array.isArray(b)){let C=0;for(let R=0;R<b.length;R++){const T=b[R],P=m(T);g(T,_.__data,C),typeof T!="number"&&typeof T!="boolean"&&!T.isMatrix3&&!ArrayBuffer.isView(T)&&(C+=P.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(b,_.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,_.__data)}}function g(_,M,y){typeof _=="number"||typeof _=="boolean"?M[0]=_:_.isMatrix3?(M[0]=_.elements[0],M[1]=_.elements[1],M[2]=_.elements[2],M[3]=0,M[4]=_.elements[3],M[5]=_.elements[4],M[6]=_.elements[5],M[7]=0,M[8]=_.elements[6],M[9]=_.elements[7],M[10]=_.elements[8],M[11]=0):ArrayBuffer.isView(_)?M.set(new _.constructor(_.buffer,_.byteOffset,M.length)):_.toArray(M,y)}function x(_,M,y,E){const v=_.value,b=M+"_"+y;if(E[b]===void 0)return typeof v=="number"||typeof v=="boolean"?E[b]=v:ArrayBuffer.isView(v)?E[b]=v.slice():E[b]=v.clone(),!0;{const C=E[b];if(typeof v=="number"||typeof v=="boolean"){if(C!==v)return E[b]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(C.equals(v)===!1)return C.copy(v),!0}}return!1}function p(_){const M=_.uniforms;let y=0;const E=16;for(let b=0,C=M.length;b<C;b++){const R=Array.isArray(M[b])?M[b]:[M[b]];for(let T=0,P=R.length;T<P;T++){const I=R[T],U=Array.isArray(I.value)?I.value:[I.value];for(let k=0,D=U.length;k<D;k++){const z=U[k],O=m(z),B=y%E,V=B%O.boundary,j=B+V;y+=V,j!==0&&E-j<O.storage&&(y+=E-j),I.__data=new Float32Array(O.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=y,y+=O.storage}}}const v=y%E;return v>0&&(y+=E-v),_.__size=y,_.__cache={},this}function m(_){const M={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(M.boundary=4,M.storage=4):_.isVector2?(M.boundary=8,M.storage=8):_.isVector3||_.isColor?(M.boundary=16,M.storage=12):_.isVector4?(M.boundary=16,M.storage=16):_.isMatrix3?(M.boundary=48,M.storage=48):_.isMatrix4?(M.boundary=64,M.storage=64):_.isTexture?Xe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(_)?(M.boundary=16,M.storage=_.byteLength):Xe("WebGLRenderer: Unsupported uniform value type.",_),M}function S(_){const M=_.target;M.removeEventListener("dispose",S);const y=o.indexOf(M.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function w(){for(const _ in s)i.deleteBuffer(s[_]);o=[],s={},r={}}return{bind:c,update:l,dispose:w}}const yy=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let kn=null;function My(){return kn===null&&(kn=new Di(yy,16,16,ts,Yn),kn.name="DFG_LUT",kn.minFilter=ft,kn.magFilter=ft,kn.wrapS=Wn,kn.wrapT=Wn,kn.generateMipmaps=!1,kn.needsUpdate=!0),kn}class Sy{constructor(e={}){const{canvas:t=T0(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=pn}=e;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;const x=d,p=new Set([Tl,Al,El]),m=new Set([pn,Nn,Ar,Tr,bl,wl]),S=new Uint32Array(4),w=new Int32Array(4),_=new F;let M=null,y=null;const E=[],v=[];let b=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=$n,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const C=this;let R=!1,T=null,P=null,I=null,U=null;this._outputColorSpace=Gt;let k=0,D=0,z=null,O=-1,B=null;const V=new st,j=new st;let W=null;const H=new Oe(0);let X=0,Q=t.width,$=t.height,Z=1,ie=null,fe=null;const le=new st(0,0,Q,$),Se=new st(0,0,Q,$);let ue=!1;const be=new na;let ge=!1,xe=!1;const pe=new Je,ve=new F,Ce=new st,ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Y=!1;function de(){return z===null?Z:1}let G=n;function _e(L,K){return t.getContext(L,K)}let ye,N,A,q,ee,re,Me,se,ae,ce,we,Be,Ee,Ae,He,Ke,Qe,J,Te,he,Re,De,me;try{const L={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ml}`),t.addEventListener("webglcontextlost",wt,!1),t.addEventListener("webglcontextrestored",gt,!1),t.addEventListener("webglcontextcreationerror",An,!1),G===null){const K="webgl2";if(G=_e(K,L),G===null)throw _e(K)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}qe()}catch(L){throw t.removeEventListener("webglcontextlost",wt,!1),t.removeEventListener("webglcontextrestored",gt,!1),t.removeEventListener("webglcontextcreationerror",An,!1),Ze("WebGLRenderer: "+L.message),L}function qe(){ye=new M_(G),ye.init(),Re=new fy(G,ye),N=new u_(G,ye,e,Re),A=new hy(G,ye),N.reversedDepthBuffer&&u&&A.buffers.depth.setReversed(!0),P=G.createFramebuffer(),I=G.createFramebuffer(),U=G.createFramebuffer(),q=new w_(G),ee=new J1,re=new uy(G,ye,A,ee,N,Re,q),Me=new y_(C),se=new Ag(G),De=new l_(G,se),ae=new S_(G,se,q,De),ce=new A_(G,ae,se,De,q),J=new E_(G,N,re),He=new f_(ee),we=new K1(C,Me,ye,N,De,He),Be=new vy(C,ee),Ee=new j1,Ae=new sy(ye),Qe=new c_(C,Me,A,ce,g,c),Ke=new ly(C,ce,N),me=new _y(G,q,N,A),Te=new h_(G,ye,q),he=new b_(G,ye,q),q.programs=we.programs,C.capabilities=N,C.extensions=ye,C.properties=ee,C.renderLists=Ee,C.shadowMap=Ke,C.state=A,C.info=q}x!==pn&&(b=new R_(x,t.width,t.height,a,s,r));const Ve=new gy(C,G);this.xr=Ve,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const L=ye.get("WEBGL_lose_context");L&&L.loseContext()},this.forceContextRestore=function(){const L=ye.get("WEBGL_lose_context");L&&L.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(L){L!==void 0&&(Z=L,this.setSize(Q,$,!1))},this.getSize=function(L){return L.set(Q,$)},this.setSize=function(L,K,oe=!0){if(Ve.isPresenting){Xe("WebGLRenderer: Can't change size while VR device is presenting.");return}Q=L,$=K,t.width=Math.floor(L*Z),t.height=Math.floor(K*Z),oe===!0&&(t.style.width=L+"px",t.style.height=K+"px"),b!==null&&b.setSize(t.width,t.height),this.setViewport(0,0,L,K)},this.getDrawingBufferSize=function(L){return L.set(Q*Z,$*Z).floor()},this.setDrawingBufferSize=function(L,K,oe){Q=L,$=K,Z=oe,t.width=Math.floor(L*oe),t.height=Math.floor(K*oe),this.setViewport(0,0,L,K)},this.setEffects=function(L){if(x===pn){Ze("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(L){for(let K=0;K<L.length;K++)if(L[K].isOutputPass===!0){Xe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}b.setEffects(L||[])},this.getCurrentViewport=function(L){return L.copy(V)},this.getViewport=function(L){return L.copy(le)},this.setViewport=function(L,K,oe,te){L.isVector4?le.set(L.x,L.y,L.z,L.w):le.set(L,K,oe,te),A.viewport(V.copy(le).multiplyScalar(Z).round())},this.getScissor=function(L){return L.copy(Se)},this.setScissor=function(L,K,oe,te){L.isVector4?Se.set(L.x,L.y,L.z,L.w):Se.set(L,K,oe,te),A.scissor(j.copy(Se).multiplyScalar(Z).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(L){A.setScissorTest(ue=L)},this.setOpaqueSort=function(L){ie=L},this.setTransparentSort=function(L){fe=L},this.getClearColor=function(L){return L.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor(...arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha(...arguments)},this.clear=function(L=!0,K=!0,oe=!0){let te=0;if(L){let ne=!1;if(z!==null){const Le=z.texture.format;ne=p.has(Le)}if(ne){const Le=z.texture.type,Fe=m.has(Le),Ie=Qe.getClearColor(),ke=Qe.getClearAlpha(),We=Ie.r,tt=Ie.g,lt=Ie.b;Fe?(S[0]=We,S[1]=tt,S[2]=lt,S[3]=ke,G.clearBufferuiv(G.COLOR,0,S)):(w[0]=We,w[1]=tt,w[2]=lt,w[3]=ke,G.clearBufferiv(G.COLOR,0,w))}else te|=G.COLOR_BUFFER_BIT}K&&(te|=G.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),oe&&(te|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),te!==0&&G.clear(te)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(L){L.setRenderer(this),T=L},this.dispose=function(){t.removeEventListener("webglcontextlost",wt,!1),t.removeEventListener("webglcontextrestored",gt,!1),t.removeEventListener("webglcontextcreationerror",An,!1),Qe.dispose(),Ee.dispose(),Ae.dispose(),ee.dispose(),Me.dispose(),ce.dispose(),De.dispose(),me.dispose(),we.dispose(),Ve.dispose(),Ve.removeEventListener("sessionstart",fh),Ve.removeEventListener("sessionend",dh),Fi.stop()};function wt(L){L.preventDefault(),$o("WebGLRenderer: Context Lost."),R=!0}function gt(){$o("WebGLRenderer: Context Restored."),R=!1;const L=q.autoReset,K=Ke.enabled,oe=Ke.autoUpdate,te=Ke.needsUpdate,ne=Ke.type;qe(),q.autoReset=L,Ke.enabled=K,Ke.autoUpdate=oe,Ke.needsUpdate=te,Ke.type=ne}function An(L){Ze("WebGLRenderer: A WebGL context could not be created. Reason: ",L.statusMessage)}function On(L){const K=L.target;K.removeEventListener("dispose",On),Np(K)}function Np(L){Up(L),ee.remove(L)}function Up(L){const K=ee.get(L).programs;K!==void 0&&(K.forEach(function(oe){we.releaseProgram(oe)}),L.isShaderMaterial&&we.releaseShaderCache(L))}this.renderBufferDirect=function(L,K,oe,te,ne,Le){K===null&&(K=ze);const Fe=ne.isMesh&&ne.matrixWorld.determinantAffine()<0,Ie=zp(L,K,oe,te,ne);A.setMaterial(te,Fe);let ke=oe.index,We=1;if(te.wireframe===!0){if(ke=ae.getWireframeAttribute(oe),ke===void 0)return;We=2}const tt=oe.drawRange,lt=oe.attributes.position;let Ge=tt.start*We,xt=(tt.start+tt.count)*We;Le!==null&&(Ge=Math.max(Ge,Le.start*We),xt=Math.min(xt,(Le.start+Le.count)*We)),ke!==null?(Ge=Math.max(Ge,0),xt=Math.min(xt,ke.count)):lt!=null&&(Ge=Math.max(Ge,0),xt=Math.min(xt,lt.count));const Ft=xt-Ge;if(Ft<0||Ft===1/0)return;De.setup(ne,te,Ie,oe,ke);let Rt,St=Te;if(ke!==null&&(Rt=se.get(ke),St=he,St.setIndex(Rt)),ne.isMesh)te.wireframe===!0?(A.setLineWidth(te.wireframeLinewidth*de()),St.setMode(G.LINES)):St.setMode(G.TRIANGLES);else if(ne.isLine){let Kt=te.linewidth;Kt===void 0&&(Kt=1),A.setLineWidth(Kt*de()),ne.isLineSegments?St.setMode(G.LINES):ne.isLineLoop?St.setMode(G.LINE_LOOP):St.setMode(G.LINE_STRIP)}else ne.isPoints?St.setMode(G.POINTS):ne.isSprite&&St.setMode(G.TRIANGLES);if(ne.isBatchedMesh)if(ye.get("WEBGL_multi_draw"))St.renderMultiDraw(ne._multiDrawStarts,ne._multiDrawCounts,ne._multiDrawCount);else{const Kt=ne._multiDrawStarts,Ue=ne._multiDrawCounts,en=ne._multiDrawCount,dt=ke?se.get(ke).bytesPerElement:1,vn=ee.get(te).currentProgram.getUniforms();for(let zn=0;zn<en;zn++)vn.setValue(G,"_gl_DrawID",zn),St.render(Kt[zn]/dt,Ue[zn])}else if(ne.isInstancedMesh)St.renderInstances(Ge,Ft,ne.count);else if(oe.isInstancedBufferGeometry){const Kt=oe._maxInstanceCount!==void 0?oe._maxInstanceCount:1/0,Ue=Math.min(oe.instanceCount,Kt);St.renderInstances(Ge,Ft,Ue)}else St.render(Ge,Ft)};function uh(L,K,oe,te){T!==null&&L.isNodeMaterial&&T.setObject(te,L),ge===!0&&He.setState(L,oe,!1),L.transparent===!0&&L.side===Sn&&L.forceSinglePass===!1?(L.side=hn,L.needsUpdate=!0,Vr(L,K,te),L.side=Ii,L.needsUpdate=!0,Vr(L,K,te),L.side=Sn):Vr(L,K,te)}this.compile=function(L,K,oe=null){oe===null&&(oe=L),T!==null&&T.renderStart(L,K,oe),y=Ae.get(oe),y.init(K),v.push(y),oe.traverseVisible(function(ne){ne.isLight&&ne.layers.test(K.layers)&&(y.pushLight(ne),ne.castShadow&&y.pushShadow(ne))}),L!==oe&&L.traverseVisible(function(ne){ne.isLight&&ne.layers.test(K.layers)&&(y.pushLight(ne),ne.castShadow&&y.pushShadow(ne))}),y.setupLights(),T!==null&&T.updateLights(y.state.lightsArray),xe=this.localClippingEnabled,ge=He.init(this.clippingPlanes,xe),ge===!0&&He.setGlobalState(this.clippingPlanes,K),T!==null&&Ke.render(y.state.shadowsArray,oe,K);const te=new Set;return L.traverse(function(ne){if(!(ne.isMesh||ne.isPoints||ne.isLine||ne.isSprite))return;const Le=ne.material;if(Le)if(Array.isArray(Le))for(let Fe=0;Fe<Le.length;Fe++){const Ie=Le[Fe];uh(Ie,oe,K,ne),te.add(Ie)}else uh(Le,oe,K,ne),te.add(Le)}),y=v.pop(),T!==null&&T.renderEnd(),te},this.compileAsync=function(L,K,oe=null){const te=this.compile(L,K,oe);return new Promise(ne=>{function Le(){if(te.forEach(function(Fe){const ke=ee.get(Fe).currentProgram;(ke===void 0||ke.isReady())&&te.delete(Fe)}),te.size===0){ne(L);return}setTimeout(Le,10)}ye.get("KHR_parallel_shader_compile")!==null?Le():setTimeout(Le,10)})};let fa=null;function Fp(L){fa&&fa(L)}function fh(){Fi.stop()}function dh(){Fi.start()}const Fi=new Qf;Fi.setAnimationLoop(Fp),typeof self<"u"&&Fi.setContext(self),this.setAnimationLoop=function(L){fa=L,Ve.setAnimationLoop(L),L===null?Fi.stop():Fi.start()},Ve.addEventListener("sessionstart",fh),Ve.addEventListener("sessionend",dh),this.render=function(L,K){if(K!==void 0&&K.isCamera!==!0){Ze("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;T!==null&&T.renderStart(L,K);const oe=Ve.enabled===!0&&Ve.isPresenting===!0,te=b!==null&&(z===null||oe)&&b.begin(C,z);if(L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),K.parent===null&&K.matrixWorldAutoUpdate===!0&&K.updateMatrixWorld(),Ve.enabled===!0&&Ve.isPresenting===!0&&(b===null||b.isCompositing()===!1)&&(Ve.cameraAutoUpdate===!0&&Ve.updateCamera(K),K=Ve.getCamera()),L.isScene===!0&&L.onBeforeRender(C,L,K,z),y=Ae.get(L,v.length),y.init(K),y.state.textureUnits=re.getTextureUnits(),v.push(y),pe.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),be.setFromProjectionMatrix(pe,Xn,K.reversedDepth),xe=this.localClippingEnabled,ge=He.init(this.clippingPlanes,xe),M=Ee.get(L,E.length),M.init(),E.push(M),Ve.enabled===!0&&Ve.isPresenting===!0){const Fe=C.xr.getDepthSensingMesh();Fe!==null&&da(Fe,K,-1/0,C.sortObjects)}da(L,K,0,C.sortObjects),M.finish(),T!==null&&T.updateLights(y.state.lightsArray),C.sortObjects===!0&&M.sort(ie,fe),Y=Ve.enabled===!1||Ve.isPresenting===!1||Ve.hasDepthSensing()===!1,Y&&Qe.addToRenderList(M,L),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ge===!0&&He.beginShadows();const ne=y.state.shadowsArray;if(Ke.render(ne,L,K),ge===!0&&He.endShadows(),(te&&b.hasRenderPass())===!1){const Fe=M.opaque,Ie=M.transmissive;if(y.setupLights(),K.isArrayCamera){const ke=K.cameras;if(Ie.length>0)for(let We=0,tt=ke.length;We<tt;We++){const lt=ke[We];mh(Fe,Ie,L,lt)}Y&&Qe.render(L);for(let We=0,tt=ke.length;We<tt;We++){const lt=ke[We];ph(M,L,lt,lt.viewport)}}else Ie.length>0&&mh(Fe,Ie,L,K),Y&&Qe.render(L),ph(M,L,K)}z!==null&&D===0&&(re.updateMultisampleRenderTarget(z),re.updateRenderTargetMipmap(z)),te&&b.end(C),L.isScene===!0&&L.onAfterRender(C,L,K),De.resetDefaultState(),O=-1,B=null,v.pop(),v.length>0?(y=v[v.length-1],re.setTextureUnits(y.state.textureUnits),ge===!0&&He.setGlobalState(C.clippingPlanes,y.state.camera)):y=null,E.pop(),E.length>0?M=E[E.length-1]:M=null,T!==null&&T.renderEnd()};function da(L,K,oe,te){if(L.visible===!1)return;if(L.layers.test(K.layers)){if(L.isGroup)oe=L.renderOrder;else if(L.isLOD)L.autoUpdate===!0&&L.update(K);else if(L.isLightProbeGrid)y.pushLightProbeGrid(L);else if(L.isLight)y.pushLight(L),L.castShadow&&y.pushShadow(L);else if(L.isSprite){if(!L.frustumCulled||L.intersectsFrustum(be)){te&&Ce.setFromMatrixPosition(L.matrixWorld).applyMatrix4(pe);const Fe=ce.update(L),Ie=L.material;Ie.visible&&M.push(L,Fe,Ie,oe,Ce.z,null,K)}}else if((L.isMesh||L.isLine||L.isPoints)&&(!L.frustumCulled||L.intersectsFrustum(be))){const Fe=ce.update(L),Ie=L.material;if(te&&(L.boundingSphere!==void 0?(L.boundingSphere===null&&L.computeBoundingSphere(),Ce.copy(L.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),Ce.copy(Fe.boundingSphere.center)),Ce.applyMatrix4(L.matrixWorld).applyMatrix4(pe)),Array.isArray(Ie)){const ke=Fe.groups;for(let We=0,tt=ke.length;We<tt;We++){const lt=ke[We],Ge=Ie[lt.materialIndex];Ge&&Ge.visible&&M.push(L,Fe,Ge,oe,Ce.z,lt,K)}}else Ie.visible&&M.push(L,Fe,Ie,oe,Ce.z,null,K)}}const Le=L.children;for(let Fe=0,Ie=Le.length;Fe<Ie;Fe++)da(Le[Fe],K,oe,te)}function ph(L,K,oe,te){const{opaque:ne,transmissive:Le,transparent:Fe}=L;y.setupLightsView(oe),ge===!0&&He.setGlobalState(C.clippingPlanes,oe),te&&A.viewport(V.copy(te)),ne.length>0&&Hr(ne,K,oe),Le.length>0&&Hr(Le,K,oe),Fe.length>0&&Hr(Fe,K,oe),A.buffers.depth.setTest(!0),A.buffers.depth.setMask(!0),A.buffers.color.setMask(!0),A.setPolygonOffset(!1)}function mh(L,K,oe,te){if((oe.isScene===!0?oe.overrideMaterial:null)!==null)return;if(y.state.transmissionRenderTarget[te.id]===void 0){const Ge=ye.has("EXT_color_buffer_half_float")||ye.has("EXT_color_buffer_float");y.state.transmissionRenderTarget[te.id]=new mn(1,1,{generateMipmaps:!0,type:Ge?Yn:pn,minFilter:wn,samples:Math.max(4,N.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ht.workingColorSpace})}const Le=y.state.transmissionRenderTarget[te.id],Fe=te.viewport||V;Le.setSize(Fe.z*C.transmissionResolutionScale,Fe.w*C.transmissionResolutionScale);const Ie=C.getRenderTarget(),ke=C.getActiveCubeFace(),We=C.getActiveMipmapLevel();C.setRenderTarget(Le),C.getClearColor(H),X=C.getClearAlpha(),X<1&&C.setClearColor(16777215,.5),C.clear(),Y&&Qe.render(oe);const tt=C.toneMapping;C.toneMapping=$n;const lt=te.viewport;if(te.viewport!==void 0&&(te.viewport=void 0),y.setupLightsView(te),ge===!0&&He.setGlobalState(C.clippingPlanes,te),Hr(L,oe,te),re.updateMultisampleRenderTarget(Le),re.updateRenderTargetMipmap(Le),ye.has("WEBGL_multisampled_render_to_texture")===!1){let Ge=!1;for(let xt=0,Ft=K.length;xt<Ft;xt++){const Rt=K[xt],{object:St,geometry:Kt,material:Ue,group:en}=Rt;if(Ue.side===Sn&&St.layers.test(te.layers)){const dt=Ue.side;Ue.side=hn,Ue.needsUpdate=!0,gh(St,oe,te,Kt,Ue,en),Ue.side=dt,Ue.needsUpdate=!0,Ge=!0}}Ge===!0&&(re.updateMultisampleRenderTarget(Le),re.updateRenderTargetMipmap(Le))}C.setRenderTarget(Ie,ke,We),C.setClearColor(H,X),lt!==void 0&&(te.viewport=lt),C.toneMapping=tt}function Hr(L,K,oe){const te=K.isScene===!0?K.overrideMaterial:null;for(let ne=0,Le=L.length;ne<Le;ne++){const Fe=L[ne],{object:Ie,geometry:ke,group:We}=Fe;let tt=Fe.material;tt.allowOverride===!0&&te!==null&&(tt=te),Ie.layers.test(oe.layers)&&gh(Ie,K,oe,ke,tt,We)}}function gh(L,K,oe,te,ne,Le){T!==null&&ne.isNodeMaterial&&T.setObject(L,ne),L.onBeforeRender(C,K,oe,te,ne,Le),L.modelViewMatrix.multiplyMatrices(oe.matrixWorldInverse,L.matrixWorld),L.normalMatrix.getNormalMatrix(L.modelViewMatrix),ne.onBeforeRender(C,K,oe,te,L,Le),ne.transparent===!0&&ne.side===Sn&&ne.forceSinglePass===!1?(ne.side=hn,ne.needsUpdate=!0,C.renderBufferDirect(oe,K,te,ne,L,Le),ne.side=Ii,ne.needsUpdate=!0,C.renderBufferDirect(oe,K,te,ne,L,Le),ne.side=Sn):C.renderBufferDirect(oe,K,te,ne,L,Le),L.onAfterRender(C,K,oe,te,ne,Le)}function Vr(L,K,oe){K.isScene!==!0&&(K=ze);const te=ee.get(L),ne=y.state.lights,Le=y.state.shadowsArray,Fe=ne.state.version,Ie=we.getParameters(L,ne.state,Le,K,oe,y.state.lightProbeGridArray),ke=we.getProgramCacheKey(Ie);let We=te.programs;te.environment=L.isMeshStandardMaterial||L.isMeshLambertMaterial||L.isMeshPhongMaterial?K.environment:null,te.fog=K.fog;const tt=L.isMeshStandardMaterial||L.isMeshLambertMaterial&&!L.envMap||L.isMeshPhongMaterial&&!L.envMap;te.envMap=Me.get(L.envMap||te.environment,tt),te.envMapRotation=te.environment!==null&&L.envMap===null?K.environmentRotation:L.envMapRotation,We===void 0&&(L.addEventListener("dispose",On),We=new Map,te.programs=We);let lt=We.get(ke);if(lt!==void 0){if(te.currentProgram===lt&&te.lightsStateVersion===Fe)return vh(L,Ie),lt}else Ie.uniforms=we.getUniforms(L),T!==null&&L.isNodeMaterial&&T.build(L,oe,Ie),L.onBeforeCompile(Ie,C),lt=we.acquireProgram(Ie,ke),We.set(ke,lt),te.uniforms=Ie.uniforms;const Ge=te.uniforms;return(!L.isShaderMaterial&&!L.isRawShaderMaterial||L.clipping===!0)&&(Ge.clippingPlanes=He.uniform),vh(L,Ie),te.needsLights=kp(L),te.lightsStateVersion=Fe,te.needsLights&&(Ge.ambientLightColor.value=ne.state.ambient,Ge.lightProbe.value=ne.state.probe,Ge.sunLights.value=ne.state.sun,Ge.sunLightShadows.value=ne.state.sunShadow,Ge.directionalLights.value=ne.state.directional,Ge.directionalLightShadows.value=ne.state.directionalShadow,Ge.spotLights.value=ne.state.spot,Ge.spotLightShadows.value=ne.state.spotShadow,Ge.rectAreaLights.value=ne.state.rectArea,Ge.ltc_1.value=ne.state.rectAreaLTC1,Ge.ltc_2.value=ne.state.rectAreaLTC2,Ge.pointLights.value=ne.state.point,Ge.pointLightShadows.value=ne.state.pointShadow,Ge.hemisphereLights.value=ne.state.hemi,Ge.sunShadowMatrix.value=ne.state.sunShadowMatrix,Ge.sunShadowCascade.value=ne.state.sunShadowCascade,Ge.directionalShadowMatrix.value=ne.state.directionalShadowMatrix,Ge.spotLightMatrix.value=ne.state.spotLightMatrix,Ge.spotLightMap.value=ne.state.spotLightMap,Ge.pointShadowMatrix.value=ne.state.pointShadowMatrix),te.lightProbeGrid=y.state.lightProbeGridArray.length>0,te.currentProgram=lt,te.uniformsList=null,lt}function xh(L){if(L.uniformsList===null){const K=L.currentProgram.getUniforms();L.uniformsList=Uo.seqWithValue(K.seq,L.uniforms)}return L.uniformsList}function vh(L,K){const oe=ee.get(L);oe.outputColorSpace=K.outputColorSpace,oe.batching=K.batching,oe.batchingColor=K.batchingColor,oe.instancing=K.instancing,oe.instancingColor=K.instancingColor,oe.instancingMorph=K.instancingMorph,oe.skinning=K.skinning,oe.morphTargets=K.morphTargets,oe.morphNormals=K.morphNormals,oe.morphColors=K.morphColors,oe.morphTargetsCount=K.morphTargetsCount,oe.numClippingPlanes=K.numClippingPlanes,oe.numIntersection=K.numClipIntersection,oe.vertexAlphas=K.vertexAlphas,oe.vertexTangents=K.vertexTangents,oe.toneMapping=K.toneMapping}function Op(L,K){if(L.length===0)return null;if(L.length===1)return L[0].texture!==null?L[0]:null;_.setFromMatrixPosition(K.matrixWorld);for(let oe=0,te=L.length;oe<te;oe++){const ne=L[oe];if(ne.texture!==null&&ne.boundingBox.containsPoint(_))return ne}return null}function zp(L,K,oe,te,ne){K.isScene!==!0&&(K=ze),re.resetTextureUnits();const Le=K.fog,Fe=te.isMeshStandardMaterial||te.isMeshLambertMaterial||te.isMeshPhongMaterial?K.environment:null,Ie=z===null?C.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:ht.workingColorSpace,ke=te.isMeshStandardMaterial||te.isMeshLambertMaterial&&!te.envMap||te.isMeshPhongMaterial&&!te.envMap,We=Me.get(te.envMap||Fe,ke),tt=te.vertexColors===!0&&!!oe.attributes.color&&oe.attributes.color.itemSize===4,lt=!!oe.attributes.tangent&&(!!te.normalMap||te.anisotropy>0),Ge=!!oe.morphAttributes.position,xt=!!oe.morphAttributes.normal,Ft=!!oe.morphAttributes.color;let Rt=$n;te.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(Rt=C.toneMapping);const St=oe.morphAttributes.position||oe.morphAttributes.normal||oe.morphAttributes.color,Kt=St!==void 0?St.length:0,Ue=ee.get(te),en=y.state.lights;if(ge===!0&&(xe===!0||L!==B)){const Et=L===B&&te.id===O;He.setState(te,L,Et)}let dt=!1;te.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==en.state.version||Ue.outputColorSpace!==Ie||ne.isBatchedMesh&&Ue.batching===!1||!ne.isBatchedMesh&&Ue.batching===!0||ne.isBatchedMesh&&Ue.batchingColor===!0&&ne._colorsTexture===null||ne.isBatchedMesh&&Ue.batchingColor===!1&&ne._colorsTexture!==null||ne.isInstancedMesh&&Ue.instancing===!1||!ne.isInstancedMesh&&Ue.instancing===!0||ne.isSkinnedMesh&&Ue.skinning===!1||!ne.isSkinnedMesh&&Ue.skinning===!0||ne.isInstancedMesh&&Ue.instancingColor===!0&&ne.instanceColor===null||ne.isInstancedMesh&&Ue.instancingColor===!1&&ne.instanceColor!==null||ne.isInstancedMesh&&Ue.instancingMorph===!0&&ne.morphTexture===null||ne.isInstancedMesh&&Ue.instancingMorph===!1&&ne.morphTexture!==null||Ue.envMap!==We||te.fog===!0&&Ue.fog!==Le||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==He.numPlanes||Ue.numIntersection!==He.numIntersection)||Ue.vertexAlphas!==tt||Ue.vertexTangents!==lt||Ue.morphTargets!==Ge||Ue.morphNormals!==xt||Ue.morphColors!==Ft||Ue.toneMapping!==Rt||Ue.morphTargetsCount!==Kt||!!Ue.lightProbeGrid!=y.state.lightProbeGridArray.length>0)&&(dt=!0):(dt=!0,Ue.__version=te.version);let vn=Ue.currentProgram;dt===!0&&(vn=Vr(te,K,ne),T&&te.isNodeMaterial&&T.onUpdateProgram(te,vn,Ue));let zn=!1,mi=!1,rs=!1;const Mt=vn.getUniforms(),Lt=Ue.uniforms;if(A.useProgram(vn.program)&&(zn=!0,mi=!0,rs=!0),te.id!==O&&(O=te.id,mi=!0),Ue.needsLights){const Et=Op(y.state.lightProbeGridArray,ne);Ue.lightProbeGrid!==Et&&(Ue.lightProbeGrid=Et,mi=!0)}if(zn||B!==L){A.buffers.depth.getReversed()&&L.reversedDepth!==!0&&(L._reversedDepth=!0,L.updateProjectionMatrix()),Mt.setValue(G,"projectionMatrix",L.projectionMatrix),Mt.setValue(G,"viewMatrix",L.matrixWorldInverse);const xi=Mt.map.cameraPosition;xi!==void 0&&xi.setValue(G,ve.setFromMatrixPosition(L.matrixWorld)),N.logarithmicDepthBuffer&&Mt.setValue(G,"logDepthBufFC",2/(Math.log(L.far+1)/Math.LN2)),(te.isMeshPhongMaterial||te.isMeshToonMaterial||te.isMeshLambertMaterial||te.isMeshBasicMaterial||te.isMeshStandardMaterial||te.isShaderMaterial)&&Mt.setValue(G,"isOrthographic",L.isOrthographicCamera===!0),B!==L&&(B=L,mi=!0,rs=!0)}if(Ue.needsLights&&(en.state.sunShadowMap.length>0&&Mt.setValue(G,"sunShadowMap",en.state.sunShadowMap,re),en.state.directionalShadowMap.length>0&&Mt.setValue(G,"directionalShadowMap",en.state.directionalShadowMap,re),en.state.spotShadowMap.length>0&&Mt.setValue(G,"spotShadowMap",en.state.spotShadowMap,re),en.state.pointShadowMap.length>0&&Mt.setValue(G,"pointShadowMap",en.state.pointShadowMap,re)),ne.isSkinnedMesh){Mt.setOptional(G,ne,"bindMatrix"),Mt.setOptional(G,ne,"bindMatrixInverse");const Et=ne.skeleton;Et&&(Et.boneTexture===null&&Et.computeBoneTexture(),Mt.setValue(G,"boneTexture",Et.boneTexture,re))}ne.isBatchedMesh&&(Mt.setOptional(G,ne,"batchingTexture"),Mt.setValue(G,"batchingTexture",ne._matricesTexture,re),Mt.setOptional(G,ne,"batchingIdTexture"),Mt.setValue(G,"batchingIdTexture",ne._indirectTexture,re),Mt.setOptional(G,ne,"batchingColorTexture"),ne._colorsTexture!==null&&Mt.setValue(G,"batchingColorTexture",ne._colorsTexture,re));const gi=oe.morphAttributes;if((gi.position!==void 0||gi.normal!==void 0||gi.color!==void 0)&&J.update(ne,oe,vn),(mi||Ue.receiveShadow!==ne.receiveShadow)&&(Ue.receiveShadow=ne.receiveShadow,Mt.setValue(G,"receiveShadow",ne.receiveShadow)),(te.isMeshStandardMaterial||te.isMeshLambertMaterial||te.isMeshPhongMaterial)&&te.envMap===null&&K.environment!==null&&(Lt.envMapIntensity.value=K.environmentIntensity),Lt.dfgLUT!==void 0&&(Lt.dfgLUT.value=My()),mi){if(Mt.setValue(G,"toneMappingExposure",C.toneMappingExposure),Ue.needsLights&&Bp(Lt,rs),Le&&te.fog===!0&&Be.refreshFogUniforms(Lt,Le),Be.refreshMaterialUniforms(Lt,te,Z,$,y.state.transmissionRenderTarget[L.id]),Ue.needsLights&&Ue.lightProbeGrid){const Et=Ue.lightProbeGrid;Lt.probesSH.value=Et.texture,Lt.probesMin.value.copy(Et.boundingBox.min),Lt.probesMax.value.copy(Et.boundingBox.max),Lt.probesResolution.value.copy(Et.resolution)}Uo.upload(G,xh(Ue),Lt,re)}if(te.isShaderMaterial&&te.uniformsNeedUpdate===!0&&(Uo.upload(G,xh(Ue),Lt,re),te.uniformsNeedUpdate=!1),te.isSpriteMaterial&&Mt.setValue(G,"center",ne.center),Mt.setValue(G,"modelViewMatrix",ne.modelViewMatrix),Mt.setValue(G,"normalMatrix",ne.normalMatrix),Mt.setValue(G,"modelMatrix",ne.matrixWorld),te.uniformsGroups!==void 0){const Et=te.uniformsGroups;for(let xi=0,os=Et.length;xi<os;xi++){const yh=Et[xi];me.update(yh,vn),me.bind(yh,vn)}}return vn}function Bp(L,K){L.ambientLightColor.needsUpdate=K,L.lightProbe.needsUpdate=K,L.sunLights.needsUpdate=K,L.sunLightShadows.needsUpdate=K,L.directionalLights.needsUpdate=K,L.directionalLightShadows.needsUpdate=K,L.pointLights.needsUpdate=K,L.pointLightShadows.needsUpdate=K,L.spotLights.needsUpdate=K,L.spotLightShadows.needsUpdate=K,L.rectAreaLights.needsUpdate=K,L.hemisphereLights.needsUpdate=K}function kp(L){return L.isMeshLambertMaterial||L.isMeshToonMaterial||L.isMeshPhongMaterial||L.isMeshStandardMaterial||L.isShadowMaterial||L.isShaderMaterial&&L.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return D},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(L,K,oe){const te=ee.get(L);te.__autoAllocateDepthBuffer=L.resolveDepthBuffer===!1,te.__autoAllocateDepthBuffer===!1&&(te.__useRenderToTexture=!1),ee.get(L.texture).__webglTexture=K,ee.get(L.depthTexture).__webglTexture=te.__autoAllocateDepthBuffer?void 0:oe,te.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(L,K){const oe=ee.get(L);oe.__webglFramebuffer=K,oe.__useDefaultFramebuffer=K===void 0},this.setRenderTarget=function(L,K=0,oe=0){z=L,k=K,D=oe;let te=null,ne=!1,Le=!1;if(L){const Ie=ee.get(L);if(Ie.__useDefaultFramebuffer!==void 0){A.bindFramebuffer(G.FRAMEBUFFER,Ie.__webglFramebuffer),V.copy(L.viewport),j.copy(L.scissor),W=L.scissorTest,A.viewport(V),A.scissor(j),A.setScissorTest(W),O=-1;return}else if(Ie.__webglFramebuffer===void 0)re.setupRenderTarget(L);else if(Ie.__hasExternalTextures)re.rebindTextures(L,ee.get(L.texture).__webglTexture,ee.get(L.depthTexture).__webglTexture);else if(L.depthBuffer){const tt=L.depthTexture;if(Ie.__boundDepthTexture!==tt){if(tt!==null&&ee.has(tt)&&(L.width!==tt.image.width||L.height!==tt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");re.setupDepthRenderbuffer(L)}}const ke=L.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(Le=!0);const We=ee.get(L).__webglFramebuffer;L.isWebGLCubeRenderTarget?(Array.isArray(We[K])?te=We[K][oe]:te=We[K],ne=!0):L.samples>0&&re.useMultisampledRTT(L)===!1?te=ee.get(L).__webglMultisampledFramebuffer:Array.isArray(We)?te=We[oe]:te=We,V.copy(L.viewport),j.copy(L.scissor),W=L.scissorTest}else V.copy(le).multiplyScalar(Z).floor(),j.copy(Se).multiplyScalar(Z).floor(),W=ue;if(oe!==0&&(te=P),A.bindFramebuffer(G.FRAMEBUFFER,te)&&A.drawBuffers(L,te),A.viewport(V),A.scissor(j),A.setScissorTest(W),ne){const Ie=ee.get(L.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+K,Ie.__webglTexture,oe)}else if(Le){const Ie=K;for(let ke=0;ke<L.textures.length;ke++){const We=ee.get(L.textures[ke]);G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0+ke,We.__webglTexture,oe,Ie)}}else if(L!==null&&oe!==0){const Ie=ee.get(L.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Ie.__webglTexture,oe)}O=-1};function _h(L){const K=ee.get(L);return(K.__readFormat!==L.format||K.__readType!==L.type)&&(K.__readFormat=L.format,K.__readType=L.type,K.__formatReadable=N.textureFormatReadable(L.format),K.__typeReadable=N.textureTypeReadable(L.type)),K}this.readRenderTargetPixels=function(L,K,oe,te,ne,Le,Fe,Ie=0){if(!(L&&L.isWebGLRenderTarget)){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ke=ee.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Fe!==void 0&&(ke=ke[Fe]),ke){A.bindFramebuffer(G.FRAMEBUFFER,ke);try{const We=L.textures[Ie],tt=We.format,lt=We.type;L.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+Ie);const Ge=_h(We);if(Ge.__formatReadable===!1){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ge.__typeReadable===!1){Ze("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}K>=0&&K<=L.width-te&&oe>=0&&oe<=L.height-ne&&G.readPixels(K,oe,te,ne,Re.convert(tt),Re.convert(lt),Le)}finally{const We=z!==null?ee.get(z).__webglFramebuffer:null;A.bindFramebuffer(G.FRAMEBUFFER,We)}}},this.readRenderTargetPixelsAsync=async function(L,K,oe,te,ne,Le,Fe,Ie=0){if(!(L&&L.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ke=ee.get(L).__webglFramebuffer;if(L.isWebGLCubeRenderTarget&&Fe!==void 0&&(ke=ke[Fe]),ke)if(K>=0&&K<=L.width-te&&oe>=0&&oe<=L.height-ne){A.bindFramebuffer(G.FRAMEBUFFER,ke);const We=L.textures[Ie],tt=We.format,lt=We.type;L.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+Ie);const Ge=_h(We);if(Ge.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ge.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const xt=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,xt),G.bufferData(G.PIXEL_PACK_BUFFER,Le.byteLength,G.STREAM_READ),G.readPixels(K,oe,te,ne,Re.convert(tt),Re.convert(lt),0),G.bindBuffer(G.PIXEL_PACK_BUFFER,null);const Ft=z!==null?ee.get(z).__webglFramebuffer:null;A.bindFramebuffer(G.FRAMEBUFFER,Ft);const Rt=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await R0(G,Rt,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,xt),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,Le),G.bindBuffer(G.PIXEL_PACK_BUFFER,null),G.deleteBuffer(xt),G.deleteSync(Rt),Le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(L,K=null,oe=0){const te=Math.pow(2,-oe),ne=Math.floor(L.image.width*te),Le=Math.floor(L.image.height*te),Fe=K!==null?K.x:0,Ie=K!==null?K.y:0;re.setTexture2D(L,0),G.copyTexSubImage2D(G.TEXTURE_2D,oe,0,0,Fe,Ie,ne,Le),A.unbindTexture()},this.copyTextureToTexture=function(L,K,oe=null,te=null,ne=0,Le=0){let Fe,Ie,ke,We,tt,lt,Ge,xt,Ft;const Rt=L.isCompressedTexture?L.mipmaps[Le]:L.image;if(oe!==null)Fe=oe.max.x-oe.min.x,Ie=oe.max.y-oe.min.y,ke=oe.isBox3?oe.max.z-oe.min.z:1,We=oe.min.x,tt=oe.min.y,lt=oe.isBox3?oe.min.z:0;else{const Lt=Math.pow(2,-ne);Fe=Math.floor(Rt.width*Lt),Ie=Math.floor(Rt.height*Lt),L.isDataArrayTexture?ke=Rt.depth:L.isData3DTexture?ke=Math.floor(Rt.depth*Lt):ke=1,We=0,tt=0,lt=0}te!==null?(Ge=te.x,xt=te.y,Ft=te.z):(Ge=0,xt=0,Ft=0);const St=Re.convert(K.format),Kt=Re.convert(K.type);let Ue;K.isData3DTexture?(re.setTexture3D(K,0),Ue=G.TEXTURE_3D):K.isDataArrayTexture||K.isCompressedArrayTexture?(re.setTexture2DArray(K,0),Ue=G.TEXTURE_2D_ARRAY):(re.setTexture2D(K,0),Ue=G.TEXTURE_2D),A.activeTexture(G.TEXTURE0),A.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,K.flipY),A.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,K.premultiplyAlpha),A.pixelStorei(G.UNPACK_ALIGNMENT,K.unpackAlignment);const en=A.getParameter(G.UNPACK_ROW_LENGTH),dt=A.getParameter(G.UNPACK_IMAGE_HEIGHT),vn=A.getParameter(G.UNPACK_SKIP_PIXELS),zn=A.getParameter(G.UNPACK_SKIP_ROWS),mi=A.getParameter(G.UNPACK_SKIP_IMAGES);A.pixelStorei(G.UNPACK_ROW_LENGTH,Rt.width),A.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Rt.height),A.pixelStorei(G.UNPACK_SKIP_PIXELS,We),A.pixelStorei(G.UNPACK_SKIP_ROWS,tt),A.pixelStorei(G.UNPACK_SKIP_IMAGES,lt);const rs=L.isDataArrayTexture||L.isData3DTexture,Mt=K.isDataArrayTexture||K.isData3DTexture;if(L.isDepthTexture){const Lt=ee.get(L),gi=ee.get(K),Et=ee.get(Lt.__renderTarget),xi=ee.get(gi.__renderTarget);A.bindFramebuffer(G.READ_FRAMEBUFFER,Et.__webglFramebuffer),A.bindFramebuffer(G.DRAW_FRAMEBUFFER,xi.__webglFramebuffer);for(let os=0;os<ke;os++)rs&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,ee.get(L).__webglTexture,ne,lt+os),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,ee.get(K).__webglTexture,Le,Ft+os)),G.blitFramebuffer(We,tt,Fe,Ie,Ge,xt,Fe,Ie,G.DEPTH_BUFFER_BIT,G.NEAREST);A.bindFramebuffer(G.READ_FRAMEBUFFER,null),A.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(ne!==0||L.isRenderTargetTexture||ee.has(L)){const Lt=ee.get(L),gi=ee.get(K);A.bindFramebuffer(G.READ_FRAMEBUFFER,I),A.bindFramebuffer(G.DRAW_FRAMEBUFFER,U);for(let Et=0;Et<ke;Et++)rs?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Lt.__webglTexture,ne,lt+Et):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Lt.__webglTexture,ne),Mt?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,gi.__webglTexture,Le,Ft+Et):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,gi.__webglTexture,Le),ne!==0?G.blitFramebuffer(We,tt,Fe,Ie,Ge,xt,Fe,Ie,G.COLOR_BUFFER_BIT,G.NEAREST):Mt?G.copyTexSubImage3D(Ue,Le,Ge,xt,Ft+Et,We,tt,Fe,Ie):G.copyTexSubImage2D(Ue,Le,Ge,xt,We,tt,Fe,Ie);A.bindFramebuffer(G.READ_FRAMEBUFFER,null),A.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else Mt?L.isDataTexture||L.isData3DTexture?G.texSubImage3D(Ue,Le,Ge,xt,Ft,Fe,Ie,ke,St,Kt,Rt.data):K.isCompressedArrayTexture?G.compressedTexSubImage3D(Ue,Le,Ge,xt,Ft,Fe,Ie,ke,St,Rt.data):G.texSubImage3D(Ue,Le,Ge,xt,Ft,Fe,Ie,ke,St,Kt,Rt):L.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,Le,Ge,xt,Fe,Ie,St,Kt,Rt.data):L.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,Le,Ge,xt,Rt.width,Rt.height,St,Rt.data):G.texSubImage2D(G.TEXTURE_2D,Le,Ge,xt,Fe,Ie,St,Kt,Rt);A.pixelStorei(G.UNPACK_ROW_LENGTH,en),A.pixelStorei(G.UNPACK_IMAGE_HEIGHT,dt),A.pixelStorei(G.UNPACK_SKIP_PIXELS,vn),A.pixelStorei(G.UNPACK_SKIP_ROWS,zn),A.pixelStorei(G.UNPACK_SKIP_IMAGES,mi),Le===0&&K.generateMipmaps&&G.generateMipmap(Ue),A.unbindTexture()},this.initRenderTarget=function(L){ee.get(L).__webglFramebuffer===void 0&&re.setupRenderTarget(L)},this.initTexture=function(L){L.isCubeTexture?re.setTextureCube(L,0):L.isData3DTexture?re.setTexture3D(L,0):L.isDataArrayTexture||L.isCompressedArrayTexture?re.setTexture2DArray(L,0):re.setTexture2D(L,0),A.unbindTexture()},this.resetState=function(){k=0,D=0,z=null,A.reset(),De.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ht._getDrawingBufferColorSpace(e),t.unpackColorSpace=ht._getUnpackColorSpace()}}const by=i=>{const e=Math.max(0,Math.min(1,i));return e*e*(3-2*e)};function ad(i,e=128,t=42){const n=t/e,s=t/2,r=new Uint8Array(e*e),o=new Float32Array(e*e),a=new Float32Array(e*e),c=new Float32Array(e*e),l=new Uint8Array(e*e*4),h=u=>Math.max(0,Math.min(e-1,Math.floor((u+s)/n)));for(const u of i)for(let d=h(u.minZ);d<=h(u.maxZ);d++)for(let g=h(u.minX);g<=h(u.maxX);g++){const x=(g+.5)*n-s,p=(d+.5)*n-s;x>=u.minX-n*.3&&x<=u.maxX+n*.3&&p>=u.minZ-n*.3&&p<=u.maxZ+n*.3&&(r[d*e+g]=1)}function f(u,d,g,x){const p=g-u,m=x-d,S=Math.ceil(Math.hypot(p,m)/(n*.65)),w=h(d)*e+h(u),_=h(x)*e+h(g);for(let M=1;M<S;M++){const y=h(d+m*M/S)*e+h(u+p*M/S);if(y!==w&&y!==_&&r[y])return!1}return!0}return{size:e,extent:t,pixels:l,illuminate(u){c.fill(0);for(const d of u)if(!(d.radius<=0))for(let g=h(d.z-d.radius);g<=h(d.z+d.radius);g++)for(let x=h(d.x-d.radius);x<=h(d.x+d.radius);x++){const p=(x+.5)*n-s,m=(g+.5)*n-s,S=Math.hypot(p-d.x,m-d.z);if(S>d.radius||!f(d.x,d.z,p,m))continue;const w=g*e+x;c[w]=Math.max(c[w],1-by((S/d.radius-.48)/.52))}},advance(u){const d=1-Math.exp(-Math.max(0,u)*5);for(let g=0;g<o.length;g++)o[g]+=(c[g]-o[g])*d,a[g]=Math.max(a[g],o[g]),l[g*4]=Math.round(o[g]*255),l[g*4+1]=Math.round(a[g]*255),l[g*4+3]=255},sample(u,d){if(Math.abs(u)>s||Math.abs(d)>s)return{visible:0,explored:0};const g=h(d)*e+h(u);return{visible:o[g],explored:a[g]}}}}const al=8,cd=`
  uniform int inkLightCount;
  uniform vec4 inkLightPosition[8], inkLightColor[8];
  uniform vec3 atmosphereTint;
  vec3 pointInk(vec3 p) {
    vec3 light = vec3(0.);
    for (int i = 0; i < 8; i++) {
      if (i >= inkLightCount) break;
      float d = distance(p, inkLightPosition[i].xyz);
      float range = inkLightPosition[i].w;
      float falloff = pow(max(0., 1. - d / range), 2.);
      light += inkLightColor[i].rgb * inkLightColor[i].w * falloff / (1. + d * d * .2);
    }
    return light;
  }
`;function ld(){return{inkLightCount:{value:0},atmosphereTint:{value:new Oe(1,1,1)},inkLightPosition:{value:Array.from({length:al},()=>new st)},inkLightColor:{value:Array.from({length:al},()=>new st)}}}const aa=`
  ${cd}
  uniform sampler2D explorationMap;
  uniform float illuminationEnabled, discoveryEnabled, explorationExtent, lanternPulse, stormFlash;
  uniform vec3 lanternPosition, hearthPosition, inkFogColor;
  uniform float inkFogDensity;
  vec3 inkFog(vec3 ink, vec3 p) {
    float distanceToEye = distance(cameraPosition, p);
    return mix(ink, inkFogColor, 1. - exp(-inkFogDensity * inkFogDensity * distanceToEye * distanceToEye));
  }
  vec2 discovered(vec3 p) {
    if (illuminationEnabled < .5 || discoveryEnabled < .5) return vec2(1.);
    vec2 uv = p.xz / explorationExtent + .5;
    if (min(uv.x, uv.y) < 0. || max(uv.x, uv.y) > 1.) return vec2(0.);
    return texture2D(explorationMap, uv).rg;
  }
  vec2 localLights(vec3 p) {
    float lamp = pow(max(0., 1. - distance(p.xz, lanternPosition.xz) / 5.8), 1.35) * lanternPulse;
    float hearth = pow(max(0., 1. - distance(p.xz, hearthPosition.xz) / 5.), 1.7);
    return vec2(lamp, hearth) * illuminationEnabled;
  }
  vec3 illuminateInk(vec3 ink, vec3 p) {
    if (illuminationEnabled < .5) return ink;
    ink *= atmosphereTint;
    vec3 point = pointInk(p);
    vec2 discovery = discovered(p), lights = localLights(p);
    if (discoveryEnabled < .5) {
      // Open sky: cool moonlight keeps the whole landscape readable. Lantern
      // and hearth add local warmth, never a circular visibility restriction.
      return inkFog(ink * (vec3(.96,1.02,1.02) + vec3(.22,.16,.07) * lights.x + vec3(.32,.17,.04) * lights.y
        + vec3(2.1,2.35,2.65) * stormFlash + point), p);
    }
    vec3 memory = vec3(.24,.29,.32) * discovery.y * .30;
    vec3 lit = vec3(.64,.69,.76) + vec3(.64,.52,.30) * lights.x + vec3(.75,.42,.16) * lights.y;
    return inkFog(ink * (memory + (lit + point) * sqrt(discovery.x)), p);
  }
`,Ci=new F(1e4,0,1e4);function Gr(){return{...ld(),inkFogColor:{value:new Oe},inkFogDensity:{value:0},explorationMap:{value:null},illuminationEnabled:{value:0},discoveryEnabled:{value:0},stormFlash:{value:0},explorationExtent:{value:42},lanternPulse:{value:1},lanternPosition:{value:Ci.clone()},hearthPosition:{value:Ci.clone()}}}function cl(i={}){const e=!!i.interior,t=ad(i.obstacles??[]),n=new Di(t.pixels,t.size,t.size,rn);n.minFilter=n.magFilter=ft,n.generateMipmaps=!1;const s=Gr();s.explorationMap.value=n,s.illuminationEnabled.value=1,s.discoveryEnabled.value=e?1:0,s.explorationExtent.value=t.extent;let r=-1;return{uniforms:s,interior:e,sample:e?t.sample:()=>({visible:1,explored:1}),place(o,a){s.lanternPosition.value.copy(o??Ci),s.hearthPosition.value.copy(a??Ci)},update(o,a){if(s.lanternPulse.value=1+Math.sin(o*3.7)*.035+Math.sin(o*7.3)*.018,!!e){if(r<0||o-r>.08){const c=s.lanternPosition.value,l=s.hearthPosition.value;t.illuminate([{x:c.x,z:c.z,radius:7.2},{x:l.x,z:l.z,radius:4.6}]),r=o}t.advance(a),n.needsUpdate=!0}},dispose(){n.dispose()}}}const Ks={reflection:0,snow:.1,bark:.2,wetgrass:.3,wood:.4,actor:.5,stone:.6,foliage:.7,water:.8,earth:.9,glyph:.85},wy=.035;function Ns(i){return Ks[i].toFixed(2)}function hd(i,e){return i.onBeforeCompile=t=>{t.fragmentShader=t.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = ${Ns(e)};`)},i.customProgramCacheKey=()=>`ascii-surface-${e}`,i.userData.asciiSurface=e,i.needsUpdate=!0,i}const Ey=Ks.glyph;function ud(i=[]){const e={generic:" .,:;-~=+*ox%#@",actor:" .:-=+*x%#@",foliage:".,;vcoax%#",stone:" .:-=coO0#",wood:".:|/\\lIvt",earth:" .,:coO*",water:" ._-~=~",wetgrass:" .,;v/\\",bark:":|/\\Il",snow:" .,:;~+*coO",reflection:" .,:-=+*ox%"};let t="";const n={};for(const[u,d]of Object.entries(e))n[u]=[t.length,d.length],t+=d;const s=t.length;t+="-|/\\";const r=document.createElement("canvas");r.width=t.length*24,r.height=32;const o=r.getContext("2d");o.fillStyle="#000",o.fillRect(0,0,r.width,r.height),o.fillStyle="#fff",o.font='29px "Courier New", monospace',o.textAlign="center",o.textBaseline="middle",Array.from(t).forEach((u,d)=>o.fillText(u,d*24+12,17));const a=new is(r);a.minFilter=ft,a.magFilter=ft,a.generateMipmaps=!1;const c=u=>`vec2(${n[u][0]}.0, ${n[u][1]}.0)`,l=new Ht({depthTest:!0,depthWrite:!0,depthFunc:ko,uniforms:{...Gr(),sceneTexture:{value:null},sceneDepth:{value:null},glyphTexture:{value:a},resolution:{value:new Ne(1,1)},cellSize:{value:6},brightness:{value:1},inverseProjection:{value:new Je},cameraWorld:{value:new Je},contacts:{value:[new st(100,100,0,0),new st(100,100,0,0)]},...Object.assign({},...i.map(u=>u.uniforms??{}))},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }",fragmentShader:`
      uniform sampler2D sceneTexture, sceneDepth, glyphTexture;
      uniform vec2 resolution;
      uniform vec4 contacts[2];
      uniform float cellSize, brightness;
      uniform mat4 inverseProjection, cameraWorld;
      varying vec2 vUv;
      ${aa}
      ${i.map(u=>u.declarations??"").join(`
`)}
      float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float isKind(float a, float kind) { return 1. - step(.035, abs(a - kind)); }
      float contactShade(vec3 p) {
        float shade = 0.;
        for (int i = 0; i < 2; i++) {
          vec2 d = (p.xz - contacts[i].xy) / max(contacts[i].z, .01);
          shade = max(shade, contacts[i].w * (1. - smoothstep(.25, 1., length(d * vec2(1., 1.15)))));
        }
        return shade;
      }
      void main() {
        vec4 direct = texture2D(sceneTexture, vUv);
        if (isKind(direct.a, ${Ey.toFixed(2)}) > .5) {
          // Letters already live on the object's surface: keep them crisp and
          // only apply the shared light treatment, never the screen lattice.
          float d = texture2D(sceneDepth, vUv).r;
          vec4 w = cameraWorld * inverseProjection * vec4(vUv * 2. - 1., d * 2. - 1., 1.);
          vec3 p = w.xyz / w.w;
          vec3 ink = pow(max(direct.rgb, vec3(0.)), vec3(.4545)) * brightness;
          ink *= 1. - contactShade(p) * .6 * (1. - smoothstep(.05, .35, p.y));
          ink = illuminateInk(ink, p);
          bool sky = illuminationEnabled > .5 && discoveryEnabled < .5;
          if (sky) { float shade = dot(ink, vec3(.2126,.7152,.0722)); ink *= mix(1.16 + .12 * (1.-smoothstep(.08,.55,shade)), 1., stormFlash); }
          else if (illuminationEnabled > .5) ink *= 1.3;
          ink = ink / (vec3(1.) + ink * .42);
          gl_FragColor = vec4(max(ink, vec3(.022,.028,.032)), 1.);
          gl_FragDepth = d;
          return;
        }
        float actor = isKind(direct.a, .5);
        float size = mix(cellSize, max(4., floor(cellSize * .84 + .5)), actor);
        vec2 cell = vec2(size, floor(size * 1.2));
        vec2 pixel = vUv * resolution, grid = floor(pixel / cell);
        vec2 center = (grid + .5) * cell / resolution;
        vec4 sampleAtCenter = texture2D(sceneTexture, center);
        float stone = isKind(sampleAtCenter.a, .6), leaf = isKind(sampleAtCenter.a, .7);
        float bark = isKind(sampleAtCenter.a, .2);
        float snow = isKind(sampleAtCenter.a, .1);
        float reflection = isKind(sampleAtCenter.a, 0.);
        float wood = max(bark,isKind(sampleAtCenter.a, .4)), earth = isKind(sampleAtCenter.a, .9), water = isKind(sampleAtCenter.a, .8);
        float wetgrass = isKind(sampleAtCenter.a, .3);
        vec4 world = cameraWorld * inverseProjection * vec4(center * 2. - 1., texture2D(sceneDepth, center).r * 2. - 1., 1.);
        // Fixed screen cells avoid re-rolling every glyph while the camera moves.
        float grain = hash(vec3(grid, 17.));
        vec2 offset = cell * .2 / resolution;
        vec3 sampleColor = sampleAtCenter.rgb * .6 + .1 * (
          texture2D(sceneTexture, center + offset).rgb + texture2D(sceneTexture, center - offset).rgb
          + texture2D(sceneTexture, center + vec2(offset.x, -offset.y)).rgb + texture2D(sceneTexture, center + vec2(-offset.x, offset.y)).rgb);
        vec3 color = pow(max(sampleColor, vec3(0.)), vec3(.4545));
        vec3 worldPoint = world.xyz / world.w;
        ${i.map(u=>u.color?`{ ${u.color} }`:"").join(`
`)}
        vec2 lamps = localLights(worldPoint);
        color += earth * (vec3(.23,.20,.12) * lamps.x + vec3(.28,.15,.05) * lamps.y);
        float light = dot(color, vec3(.2126, .7152, .0722));
        vec2 alphabet = ${c("generic")};
        float density = clamp(light * 1.35, 0., 1.);
        if (actor > .5) { alphabet = ${c("actor")}; density = clamp(light * 1.05 + .12, 0., .88); }
        else if (leaf > .5) { alphabet = ${c("foliage")}; density = clamp(.15 + light * .42 + grain * .48, .1, .95); }
        else if (stone > .5) { alphabet = ${c("stone")}; density = .22 + light * .55 + grain * .2; }
        else if (bark > .5) { alphabet = ${c("bark")}; density = .2 + grain * .79; }
        else if (wood > .5) { alphabet = ${c("wood")}; density = grain; }
        else if (earth > .5) { alphabet = ${c("earth")}; density = .1 + grain * .85; }
        else if (water > .5) { alphabet = ${c("water")}; density = .3 + grain * .65; }
        else if (wetgrass > .5) { alphabet = ${c("wetgrass")}; density = .25 + grain * .74; }
        else if (snow > .5) { alphabet = ${c("snow")}; density = .18 + light * .25 + grain * .5; }
        else if (reflection > .5) { alphabet = ${c("reflection")}; density = clamp(light * 1.5 + grain * .12, 0., .85); }
        float index = alphabet.x + floor(clamp(density, 0., .999) * alphabet.y);
        vec2 stepUv = cell * .5 / resolution;
        vec2 gradient = vec2(
          texture2D(sceneDepth, center + vec2(stepUv.x, 0.)).r - texture2D(sceneDepth, center - vec2(stepUv.x, 0.)).r,
          texture2D(sceneDepth, center + vec2(0., stepUv.y)).r - texture2D(sceneDepth, center - vec2(0., stepUv.y)).r);
        if (max(abs(gradient.x), abs(gradient.y)) > .006 && light > .12 && leaf < .5 && earth < .5) {
          float stroke = abs(gradient.x) > abs(gradient.y) * 2. ? 1. : abs(gradient.y) > abs(gradient.x) * 2. ? 0. : gradient.x * gradient.y < 0. ? 2. : 3.;
          index = ${s}.0 + stroke;
        }
        vec2 inside = fract(pixel / cell);
        float glyph = smoothstep(.14, .74, texture2D(glyphTexture, vec2((index + inside.x) / ${t.length}.0, inside.y)).r);
        float gain = actor > .5 ? 1.22 : leaf > .5 ? 1.08 : earth > .5 ? .83 : 1.05;
        vec3 ink = min(color * gain * brightness, vec3(.96));
        ink = illuminateInk(ink, worldPoint);
        if (bark > .5) ink = max(ink * 1.1, vec3(.32,.27,.18));
        if (earth > .5 || wetgrass > .5) ink *= 1. - contactShade(worldPoint) * .72;
        bool openSky = illuminationEnabled > .5 && discoveryEnabled < .5;
        if (openSky) {
          // Lift outdoor midtones without bleaching their hue or strengthening
          // the font. Interiors retain their lantern/discovery contrast.
          float shade = dot(ink, vec3(.2126,.7152,.0722));
          float lift = 1.16 + .12 * (1.-smoothstep(.08,.55,shade));
          ink *= mix(lift, 1., stormFlash);
        }
        else if (illuminationEnabled > .5) ink *= 1.3;
        // Compress highlights after lighting: the lamp must not turn the font
        // into solid white pixels. Keep character size, soften ink weight.
        ink = ink / (vec3(1.) + ink * .42);
        float coverage = openSky ? smoothstep(.05, .20, light) : smoothstep(.07, .23, light);
        if (earth > .5) coverage *= step(.27, grain);
        if (leaf > .5) coverage *= .72 + grain * .28;
        if (water > .5) coverage *= .24 + .26 * step(.74, grain);
        // Reflected silhouettes need their own readable strokes, not the sparse
        // horizontal water alphabet that used to erase them. Still softer than actors.
        if (reflection > .5) coverage *= .75 + grain * .12;
        if (wetgrass > .5) coverage *= .72;
        vec3 paper = (openSky ? vec3(.030,.040,.043) : vec3(.025,.033,.038)) + vec3(.075,.10,.13) * stormFlash;
        // Quiet colour between strokes gives a continuous silhouette, while the
        // readable detail remains entirely in the regular-weight characters.
        float surfaceColor = leaf > .5 ? .20 : actor > .5 ? .14 : wetgrass > .5 ? .09 : water > .5 ? .04 : .025;
        if (openSky) surfaceColor = leaf > .5 ? .27 : actor > .5 ? .18 : bark > .5 ? .10 : wetgrass > .5 ? .135 : water > .5 ? .09 : .07;
        else if (illuminationEnabled > .5) surfaceColor = actor > .5 ? .18 : leaf > .5 ? .24 : wood > .5 ? .28 : stone > .5 ? .30 : water > .5 ? .09 : .07;
        if (reflection > .5) surfaceColor = .13;
        paper = max(paper, ink * surfaceColor);
        gl_FragColor = vec4(mix(paper, max(paper, ink), glyph * coverage), 1.);
        // Snow uses the same light strokes as the other materials. A restrained
        // blue-grey underlayer keeps the clearing bright between readable glyphs.
        if (snow > .5) gl_FragColor.rgb = mix(ink * .58, ink, glyph * coverage * .84);
        gl_FragDepth = texture2D(sceneDepth, vUv).r;
      }
    `}),h=new Cs,f=new xn(2,2);return h.add(new Ye(f,l)),{scene:h,material:l,camera:new Wl,dispose(){a.dispose(),f.dispose(),l.dispose()}}}const Zi={cellSize:6,brightness:1,background:131330,fog:{color:131330,density:.012},hemisphere:{sky:12766916,ground:3420961,intensity:1.25},moon:{color:14739404,intensity:2.2,position:[-5,12,7],shadowIntensity:.62,shadowExtent:16,mapSize:1024},fill:{color:10207157,intensity:.3,position:[6,6,-7]},interior:!1,bodyAmbient:.3,bodyLantern:.7,atmosphere:"moon",glyphs:{},types:{}};function fd(i={}){return structuredClone({...Zi,...i})}const ql=["glyph","surface","size","color","alphabet","font","fontWeight","open","faces","rotation","palette","lighting","emissive","emissiveIntensity","spacing","density","strength","gap","contrast","toneOffset","shadowSteps"];function dd(i){return typeof i=="string"&&Array.from(i).length>=1&&Array.from(i).length<=128&&!!i.trim()&&!/[\p{C}\p{M}\p{Zl}\p{Zp}]/u.test(i)}function Yl(...i){const e={};for(const t of i)if(t)for(const[n,s]of Object.entries(t))s!==void 0&&(e[n]=s);return e}function pd(i){const e=i.part;return Yl(i.defaults,i.global,i.type?.style,e?i.type?.parts?.[e]:void 0,i.node,i.instance,e?i.instanceParts?.[e]:void 0)}function md(i){const e=i.glyph,t=i.glyphStyle;if(!(!e&&!t))return Yl(t,e?{glyph:e}:void 0)}const Ct=new bn,vo=new F,Bu=new Ne,ku=new Ne,Gu=new Ne;class Ay{constructor(e){this.geometry=e.geometry,this.randomFunction=Math.random,this.indexAttribute=this.geometry.index,this.positionAttribute=this.geometry.getAttribute("position"),this.normalAttribute=this.geometry.getAttribute("normal"),this.colorAttribute=this.geometry.getAttribute("color"),this.uvAttribute=this.geometry.getAttribute("uv"),this.weightAttribute=null,this.distribution=null}setWeightAttribute(e){return this.weightAttribute=e?this.geometry.getAttribute(e):null,this}build(){const e=this.indexAttribute,t=this.positionAttribute,n=this.weightAttribute,s=e?e.count/3:t.count/3,r=new Float32Array(s);for(let c=0;c<s;c++){let l=1,h=3*c,f=3*c+1,u=3*c+2;e&&(h=e.getX(h),f=e.getX(f),u=e.getX(u)),n&&(l=n.getX(h)+n.getX(f)+n.getX(u)),Ct.a.fromBufferAttribute(t,h),Ct.b.fromBufferAttribute(t,f),Ct.c.fromBufferAttribute(t,u),l*=Ct.getArea(),r[c]=l}const o=new Float32Array(s);let a=0;for(let c=0;c<s;c++)a+=r[c],o[c]=a;return this.distribution=o,this}setRandomGenerator(e){return this.randomFunction=e,this}sample(e,t,n,s){const r=this._sampleFaceIndex();return this._sampleFace(r,e,t,n,s)}_sampleFaceIndex(){const e=this.distribution[this.distribution.length-1];return this._binarySearch(this.randomFunction()*e)}_binarySearch(e){const t=this.distribution;let n=0,s=t.length-1,r=-1;for(;n<=s;){const o=Math.ceil((n+s)/2);if(o===0||t[o-1]<=e&&t[o]>e){r=o;break}else e<t[o]?s=o-1:n=o+1}return r}_sampleFace(e,t,n,s,r){let o=this.randomFunction(),a=this.randomFunction();o+a>1&&(o=1-o,a=1-a);const c=this.indexAttribute;let l=e*3,h=e*3+1,f=e*3+2;return c&&(l=c.getX(l),h=c.getX(h),f=c.getX(f)),Ct.a.fromBufferAttribute(this.positionAttribute,l),Ct.b.fromBufferAttribute(this.positionAttribute,h),Ct.c.fromBufferAttribute(this.positionAttribute,f),t.set(0,0,0).addScaledVector(Ct.a,o).addScaledVector(Ct.b,a).addScaledVector(Ct.c,1-(o+a)),n!==void 0&&(this.normalAttribute!==void 0?(Ct.a.fromBufferAttribute(this.normalAttribute,l),Ct.b.fromBufferAttribute(this.normalAttribute,h),Ct.c.fromBufferAttribute(this.normalAttribute,f),n.set(0,0,0).addScaledVector(Ct.a,o).addScaledVector(Ct.b,a).addScaledVector(Ct.c,1-(o+a)).normalize()):Ct.getNormal(n)),s!==void 0&&this.colorAttribute!==void 0&&(Ct.a.fromBufferAttribute(this.colorAttribute,l),Ct.b.fromBufferAttribute(this.colorAttribute,h),Ct.c.fromBufferAttribute(this.colorAttribute,f),vo.set(0,0,0).addScaledVector(Ct.a,o).addScaledVector(Ct.b,a).addScaledVector(Ct.c,1-(o+a)),s.r=vo.x,s.g=vo.y,s.b=vo.z),r!==void 0&&this.uvAttribute!==void 0&&(Bu.fromBufferAttribute(this.uvAttribute,l),ku.fromBufferAttribute(this.uvAttribute,h),Gu.fromBufferAttribute(this.uvAttribute,f),r.set(0,0).addScaledVector(Bu,o).addScaledVector(ku,a).addScaledVector(Gu,1-(o+a))),this}}function gd(i,e=!1,t={}){const n=document.createElement("canvas"),s=e?24:48,r=Array.from(i);n.width=r.length*s,n.height=e?32:64;const o=n.getContext("2d");o.fillStyle="#000",o.fillRect(0,0,n.width,n.height),o.fillStyle="#fff",o.font=`${t.fontWeight??400} ${e?25:46}px ${t.font??'"Courier New", monospace'}`,o.textAlign="center",o.textBaseline="middle",r.forEach((c,l)=>o.fillText(c,(l+.5)*s,e?17:34,s*.9));const a=new is(n);return a.generateMipmaps=!e,a.minFilter=e?ft:wn,a.magFilter=ft,a.anisotropy=e?1:4,a.userData.slot=1/r.length,a}function xd(i){if(!i)return"";const e=t=>{const n=new Oe(t);return`vec3(${n.r.toFixed(6)},${n.g.toFixed(6)},${n.b.toFixed(6)})`};return`vec3 glyphPalette(float level) {
    float value = clamp(level, 0., 1.) * ${(i.length-1).toFixed(1)};
    ${i.slice(0,-1).map((t,n)=>`if (value <= ${(n+1).toFixed(1)}) return mix(${e(t)}, ${e(i[n+1])}, clamp(value - ${n.toFixed(1)}, 0., 1.));`).join(`
`)}
    return ${e(i[i.length-1])};
  }`}function vd(i,e){i.addEventListener("dispose",()=>e.dispose())}const Kl={actor:" .:-=+*x%#@",foliage:" .,:;vYv%&#",stone:" .:-=coO0#@",snow:" .,:;+*oO@",bark:" :|!/\\lI#"};let Nr="";const _d={};for(const[i,e]of Object.entries(Kl))_d[i]=Nr.length,Nr+=e;const yd=Ks.glyph;function Md(){return{...ld(),pixelScale:{value:60},moon:{value:new F(-5,12,7).normalize()},lantern:{value:new st(0,0,0,0)},hearth:{value:new st(0,0,0,0)},ambient:{value:.32},sunPower:{value:1},sunColor:{value:new Oe(1,1,1)}}}let Hi=null;function Ty(){if(Hi)return Hi;const i=24,e=document.createElement("canvas");e.width=Nr.length*i,e.height=32;const t=e.getContext("2d");return t.fillStyle="#000",t.fillRect(0,0,e.width,e.height),t.fillStyle="#fff",t.font='25px "Courier New", monospace',t.textAlign="center",t.textBaseline="middle",Array.from(Nr).forEach((n,s)=>t.fillText(n,s*i+i/2,17)),Hi=new is(e),Hi.generateMipmaps=!1,Hi.minFilter=ft,Hi.magFilter=ft,Hi}function Ry(i,e,t,n,s,r,o){const a=!!(o.alphabet||o.font||o.fontWeight),c=o.alphabet??Kl[s],l=Array.from(c).length,h=a?gd(c,!0,o):Ty(),f=new Ht({uniforms:{...i,atlas:{value:h},tint:{value:e},glow:{value:t}},vertexShader:`
      ${cd}
      ${xd(o.palette)}
      attribute vec3 glyphColor; attribute float seed;
      uniform float pixelScale, ambient, sunPower; uniform vec3 sunColor; uniform vec3 moon, tint, glow; uniform vec4 lantern, hearth;
      varying vec3 vColor; varying float vIndex;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.);
        vec3 n = normalize(mat3(modelMatrix) * normal);
        vec4 view = viewMatrix * world;
        float facing = dot(normalize(mat3(viewMatrix) * n), vec3(0., 0., 1.));
        float diffuse = max(dot(n, moon), 0.);
        float lamp = lantern.w * pow(max(0., 1. - distance(world.xyz, lantern.xyz) / 6.), 1.5);
        float fire = hearth.w * pow(max(0., 1. - distance(world.xyz, hearth.xyz) / 5.5), 1.7);
        vec3 point = pointInk(world.xyz);
        ${o.lighting==="unlit"?"diffuse = 0.; lamp = 0.; fire = 0.; point = vec3(0.);":""}
        float light = ${o.lighting==="unlit"?"1.":"ambient + diffuse * .7 * sunPower + lamp * .9 + fire * .8 + dot(point, vec3(.2126,.7152,.0722)) * .5"};
        // Letter shape carries the shading; colour stays the material's own hue.
        float level = clamp(light * .62 + (seed - .5) * .3 + length(glow) * .5, .08, .999);
        ${o.contrast!==void 0||o.toneOffset!==void 0?`level = clamp((level - .5) * ${(o.contrast??1).toFixed(4)} + .5 + ${(o.toneOffset??0).toFixed(4)}, 0., .999);`:""}
        ${o.shadowSteps!==void 0?`level = floor(level * ${o.shadowSteps.toFixed(1)}) / ${o.shadowSteps.toFixed(1)};`:""}
        vIndex = ${o.alphabet?`floor(level * ${l}.0)`:`${a?0:_d[s]}.0 + 1.0 + floor(level * ${l-1}.0)`};
        vColor = (glyphColor * tint * (.35 + light * .8) + vec3(.95, .6, .28) * (lamp * .25 + fire * .35) * tint + glow) * ${s==="stone"?"1.45":"1."};
        vColor = vColor * mix(vec3(1.), sunColor, diffuse * .6) + glyphColor * tint * point * .35;
        ${o.palette?"vColor = (glyphPalette(level) * (.35 + light * .8) + vec3(.95, .6, .28) * (lamp * .25 + fire * .35)) * mix(vec3(1.), sunColor, diffuse * .6) + glyphPalette(level) * point * .35 + glow;":""}
        ${o.strength!==void 0?`vColor *= ${o.strength.toFixed(4)};`:""}
        gl_Position = projectionMatrix * view;
        gl_Position.z -= .002 * gl_Position.w;
        gl_PointSize = facing < ${o.faces==="both"?"-2.":o.faces==="front"||s==="stone"?".05":r?"-.2":"-.05"} ? 0. : ${n.toFixed(3)} * pixelScale;
      }`,fragmentShader:`
      uniform sampler2D atlas;
      varying vec3 vColor; varying float vIndex;
      void main() {
        vec2 uv = vec2((gl_PointCoord.x - .5) * 1.25 + .5, 1. - gl_PointCoord.y);
        ${o.rotation?`uv = mat2(${Math.cos(o.rotation).toFixed(6)},${Math.sin(o.rotation).toFixed(6)},${(-Math.sin(o.rotation)).toFixed(6)},${Math.cos(o.rotation).toFixed(6)}) * (uv - .5) + .5;`:""}
        if (uv.x < 0. || uv.x > 1.) discard;
        ${o.rotation?"if (uv.y < 0. || uv.y > 1.) discard;":""}
        float ink = texture2D(atlas, vec2((vIndex + .08 + uv.x * .84) / ${a?l:Nr.length}.0, .06 + uv.y * .88)).r;
        if (ink < .38) discard;
        gl_FragColor = vec4(vColor, ${yd.toFixed(2)});
      }`});return a&&vd(f,h),f}function Cy(i){const e=i.attributes.position,t=i.index,n=new F,s=new F,r=new F,o=t?t.count:e.count;let a=0;for(let c=0;c<o;c+=3)n.fromBufferAttribute(e,t?t.getX(c):c),s.fromBufferAttribute(e,t?t.getX(c+1):c+1),r.fromBufferAttribute(e,t?t.getX(c+2):c+2),a+=s.sub(n).cross(r.sub(n)).length()/2;return a}function Py(i,e,t,n,s,r,o,a){const c=new Ay(new Ye(i)).build(),l=Cy(i),h=[],f=[],u=[],d=[],g=new F,x=new F,p=new je,m=new F;let S=r;const w=()=>(S=Math.imul(S,1664525)+1013904223>>>0,S/4294967296);c.randomFunction=w;const _=new F,M=E=>`${Math.floor(E.x/e)},${Math.floor(E.y/e)},${Math.floor(E.z/e)}`;t.forEach((E,v)=>{m.setFromMatrixScale(E).multiply(s);const b=l*(m.x*m.y+m.y*m.z+m.x*m.z)/3,C=Math.min(3e3,Math.max(2,Math.round(b/(e*e))));p.getNormalMatrix(E);for(let R=0,T=0;R<C&&T<C*6;T++){c.sample(g,x),g.applyMatrix4(E),x.applyMatrix3(p).normalize(),_.copy(g).applyMatrix4(o);const P=M(_);a.has(P)||(a.add(P),R++,h.push(g.x,g.y,g.z),f.push(x.x,x.y,x.z),u.push(n[v].r,n[v].g,n[v].b),d.push(w()))}});const y=new Tt;return y.setAttribute("position",new ct(h,3)),y.setAttribute("normal",new ct(f,3)),y.setAttribute("glyphColor",new ct(u,3)),y.setAttribute("seed",new ct(d,1)),y}const Iy=new Oe(1,1,1),Hu=new Oe(0,0,0),Vu=new Map,Sd=new WeakSet;function Ly(i,e=.035){let t=Vu.get(i);return t||(t=new Ri({color:i.color.clone().multiplyScalar(e)}),t.onBeforeCompile=n=>{n.fragmentShader=n.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = ${yd.toFixed(2)};`)},t.customProgramCacheKey=()=>"glyph-occluder",Vu.set(i,t),Sd.add(t)),t}function Dy(i,e){const t=i.userData.asciiSurface;return t==="foliage"?"foliage":t==="snow"?"snow":t==="stone"?"stone":t==="bark"||t==="wood"?"bark":e}const Wu=new F;function bd(i,e,t=.1,n="actor",s,r={}){const o=[];if(Array.isArray(i))for(const h of i)h.updateWorldMatrix(!0,!1),h.userData.glyphDone||o.push(h);else i.updateMatrixWorld(!0),i.traverse(h=>{h instanceof Ye&&!h.userData.glyphDone&&o.push(h)});let a=9173;const c=new Set,l=[];for(const h of o){h.userData.glyphDone=!0;const f=h.material;if(!(f instanceof ut))continue;const u=s??Dy(f,n),d=r.open??(u==="foliage"||u==="snow"||u==="stone"),g=u==="stone"?t*.95:u==="foliage"||u==="snow"?t*1.25:t;Wu.setFromMatrixScale(h.matrixWorld);const x=h instanceof Ji,p=[],m=[];if(x)for(let E=0;E<h.count;E++){const v=new Je;h.getMatrixAt(E,v),p.push(v);const b=new Oe(1,1,1);h.instanceColor&&h.getColorAt(E,b),m.push(b)}else p.push(new Je),m.push(Iy);const S=g*(u==="stone"?.72:u==="foliage"||u==="snow"?.9:.82)*(r.spacing??1)/Math.sqrt(r.density??1),w=h instanceof Fl?Ny(h,S,a+=7919,c):void 0,_=w?.geometry??Py(h.geometry,S,p,m,Wu,a+=7919,h.matrixWorld,c),M=r.emissiveIntensity!==void 0?(f.emissive??Hu).clone().multiplyScalar(r.emissiveIntensity):f.emissive??Hu,y=new Bs(_,Ry(e,f.color,M,g,u,d,r));if(y.userData.glyphDone=!0,y.userData.glyphBodyOf=h,y.frustumCulled=!1,w&&(y.userData.skin=w.skin,l.push(y)),h.add(y),h.userData.glyphBodyMaterial=f,d){const E=f.clone();E.colorWrite=!1,E.depthWrite=!1,h.material=E,h.castShadow=!0}else h.material=Ly(f)}return l}function Ny(i,e,t,n){const s=i.geometry,r=s.attributes.position,o=s.index,a=(o?o.count:r.count)/3,c=(R,T)=>o?o.getX(R*3+T):R*3+T,l=new F,h=new F,f=new F,u=new Float32Array(a);let d=0;i.updateWorldMatrix(!0,!1);const g=new F().setFromMatrixScale(i.matrixWorld);for(let R=0;R<a;R++)l.fromBufferAttribute(r,c(R,0)),h.fromBufferAttribute(r,c(R,1)),f.fromBufferAttribute(r,c(R,2)),d+=h.sub(l).cross(f.sub(l)).length()/2,u[R]=d;let x=t;const p=()=>(x=Math.imul(x,1664525)+1013904223>>>0,x/4294967296),m=Math.min(3e3,Math.max(2,Math.round(d*(g.x*g.y+g.y*g.z+g.x*g.z)/3/(e*e)))),S=[],w=[],_=[],M=new F,y=new F,E=R=>`${Math.floor(R.x/e)},${Math.floor(R.y/e)},${Math.floor(R.z/e)}`;for(let R=0,T=0;R<m&&T<m*6;T++){const P=p()*d;let I=0,U=a-1;for(;I<U;){const j=I+U>>1;u[j]<P?I=j+1:U=j}let k=p(),D=p();k+D>1&&(k=1-k,D=1-D);const z=c(I,0),O=c(I,1),B=c(I,2);l.fromBufferAttribute(r,z),h.fromBufferAttribute(r,O),f.fromBufferAttribute(r,B),M.copy(l).multiplyScalar(1-k-D).addScaledVector(h,k).addScaledVector(f,D),y.copy(M).applyMatrix4(i.matrixWorld);const V=E(y);n.has(V)||(n.add(V),R++,S.push(z,O,B),w.push(1-k-D,k,D),_.push(p()))}const v=_.length,b=new Tt;b.setAttribute("position",new ct(new Float32Array(v*3),3).setUsage(Pi)),b.setAttribute("normal",new ct(new Float32Array(v*3),3).setUsage(Pi)),b.setAttribute("glyphColor",new ct(new Float32Array(v*3).fill(1),3)),b.setAttribute("seed",new ct(_,1));const C={mesh:i,corners:new Uint32Array(S),weights:new Float32Array(w)};return{geometry:b,skin:C}}const _o=new F,ja=new F,Qa=new F,yo=new F,Mo=new F;function wd(i){const e=i.userData.skin;if(!e)return;const{mesh:t,corners:n,weights:s}=e,r=i.geometry.attributes.position,o=i.geometry.attributes.normal;for(let a=0;a<s.length/3;a++)t.getVertexPosition(n[a*3],_o),t.getVertexPosition(n[a*3+1],ja),t.getVertexPosition(n[a*3+2],Qa),yo.copy(_o).multiplyScalar(s[a*3]).addScaledVector(ja,s[a*3+1]).addScaledVector(Qa,s[a*3+2]),Mo.subVectors(ja,_o).cross(Qa.sub(_o)).normalize(),r.setXYZ(a,yo.x,yo.y,yo.z),o.setXYZ(a,Mo.x,Mo.y,Mo.z);r.needsUpdate=o.needsUpdate=!0}function Ed(i,e,t,n,s,r,o,a){i.pixelScale.value=t/(e.top-e.bottom),i.lantern.value.set(n.x,n.y,n.z,s),i.hearth.value.set(r.x,r.y,r.z,o),i.ambient.value=a}function Ad(i){for(const t of[...i.children])t instanceof Bs&&t.userData.glyphBodyOf===i&&(i.remove(t),t.geometry.dispose(),t.material.dispose());const e=i.userData.glyphBodyMaterial;e&&(i.material!==e&&!Sd.has(i.material)&&i.material.dispose(),i.material=e),delete i.userData.glyphBodyMaterial,delete i.userData.glyphDone}const Td=["|","/","\\","v","Y","!","*","o",".",","];function Rd(i,e){const t=Td,n=document.createElement("canvas");n.width=t.length*32,n.height=48;const s=n.getContext("2d");s.fillStyle="#fff",s.font="34px monospace",s.textAlign="center",s.textBaseline="middle",t.forEach((M,y)=>s.fillText(M,y*32+16,24));const r=new is(n);r.minFilter=wn,r.magFilter=ft,r.generateMipmaps=!0;const o=[],a=[],c=[],l=e.extent??e.infinite?.span??26,h=e.center?.x??0,f=e.center?.z??0;for(let M=0;M<e.count;M++){const y=h+(i()-.5)*l,E=f+(i()-.5)*l;if(i()>e.density(y,E))continue;const v=e.pick(i,y,E);o.push(y,e.y(y,E),E),a.push(v.glyph,v.glyph>=6?.16+v.height*.3:v.height*.4,v.glyph>=6?.1+v.height*.5:v.height,i()*6.28),c.push(...v.color)}const u=new xn(1,1,1,3);u.translate(0,.5,0);const d=new ag;d.index=u.index,d.attributes.position=u.attributes.position,d.attributes.uv=u.attributes.uv,d.setAttribute("offset",new Ki(new Float32Array(o),3)),d.setAttribute("shape",new Ki(new Float32Array(a),4)),d.setAttribute("bladeColor",new Ki(new Float32Array(c),3)),d.instanceCount=o.length/3;const g=Array.from({length:12},()=>new st(100,100,-100,0)),x=new Ht({side:Sn,depthWrite:!0,depthTest:!0,uniforms:{...Gr(),atlas:{value:r},time:{value:0},brightness:{value:1},right:{value:new F(1,0,0)},hero:{value:new F},enemy:{value:new F(100,0,100)},trail:{value:g},focus:{value:new F},tint:{value:new Oe(1,1,1)},glow:{value:[new st,new st]},glowColor:{value:[new Oe,new Oe]},...e.infinite?.uniforms??{}},vertexShader:`
      ${e.infinite?`#define INFINITE_GROUND
#define GROUND_SPAN ${e.infinite.span.toFixed(1)}
${e.infinite.glsl}`:""}
      attribute vec3 offset, bladeColor;
      attribute vec4 shape;
      uniform float time;
      uniform vec3 right, hero, enemy, focus;
      uniform vec4 trail[12];
      varying vec2 vUv;
      varying vec3 vColor;
      varying vec3 worldPoint;
      varying float vGlyph, vFog;
      vec3 base;
      vec2 displace(vec2 center, float radius) {
        vec2 away = base.xz - center;
        float distance = length(away);
        return away / max(distance, .02) * pow(max(0., 1. - distance / radius), 2.);
      }
      void main() {
        vUv = uv; vGlyph = shape.x; vColor = bladeColor;
        base = offset;
        #ifdef INFINITE_GROUND
          base.xz = hero.xz + mod(offset.xz - hero.xz + GROUND_SPAN * .5, GROUND_SPAN) - GROUND_SPAN * .5;
          vec2 ground = forestSoil(base.xz);
          // Trail, camp clearing and stream banks stay bare; edges keep short tufts.
          if (fract(shape.w * 7.31) < ground.x * 1.15 || ground.y > .02) { gl_Position = vec4(2., 2., 2., 1.); return; }
        #endif
        vec2 force = displace(hero.xz, .8) * 1.35 + displace(enemy.xz, .75);
        for (int i = 0; i < 12; i++) {
          float age = time - trail[i].z;
          float recovery = max(0., 1. - age / 2.5) * trail[i].w;
          force += displace(trail[i].xy, .55) * recovery * .3;
        }
        float wind = sin(time * 1.65 + base.x * .65 + base.z * .35) * .11;
        wind += sin(time * 2.6 + shape.w) * .035;
        float tip = position.y * position.y;
        vec3 point = base + right * position.x * shape.y;
        point.y += position.y * shape.z * (1. - min(length(force) * .55, .78));
        point.xz += (force * .55 + vec2(wind, wind * .4)) * tip;
        worldPoint = point;
        vFog = smoothstep(10., 21., distance(base.xz, focus.xz));
        float nearby = min(distance(base.xz, hero.xz), distance(base.xz, enemy.xz));
        vColor *= mix(.62, 1., smoothstep(.65, 1.9, nearby));
        gl_Position = projectionMatrix * viewMatrix * vec4(point, 1.);
      }
    `,fragmentShader:`
      uniform sampler2D atlas;
      uniform float brightness;
      uniform vec3 tint;
      uniform vec4 glow[2];
      uniform vec3 glowColor[2];
      varying vec2 vUv;
      varying vec3 vColor;
      varying vec3 worldPoint;
      ${aa}
      varying float vGlyph, vFog;
      void main() {
        float ink = texture2D(atlas, vec2((vGlyph + vUv.x) / 10., vUv.y)).a;
        if (ink < .22) discard;
        vec3 color = vColor * tint * (.55 + .75 * vUv.y) * brightness;
        // Spell and aura lights spill over the blades, like the reference pools.
        vec3 spill = vec3(0.);
        for (int i = 0; i < 2; i++) spill += glowColor[i] * glow[i].w * pow(max(0., 1. - distance(worldPoint, glow[i].xyz) / 4.), 2.);
        color += vColor * spill * 2.2 + spill * .06;
        color = mix(color, vec3(.023, .033, .039), vFog);
        gl_FragColor = vec4(max(vec3(.035,.031,.055), illuminateInk(color * (.6 + .4 * ink), worldPoint)), 1.);
      }
    `}),p=new Ye(d,x);p.frustumCulled=!1,p.userData.glyph="carpet";const m=new Cs;m.add(p);const S=new F(100,0,100);let w=0;const _=new F(100,0,100);return{scene:m,mesh:p,uniforms:x.uniforms,count:d.instanceCount,setGlow(M,y){const E=Math.min(1.5,y.intensity/9);x.uniforms.glow.value[M].set(y.position.x,y.position.y,y.position.z,E),x.uniforms.glowColor.value[M].copy(y.color)},update(M,y,E,v,b,C,R){x.uniforms.time.value=M,x.uniforms.brightness.value=R,x.uniforms.hero.value.copy(y),x.uniforms.enemy.value.copy(E??S),x.uniforms.right.value.setFromMatrixColumn(v.matrixWorld,0),x.uniforms.focus.value.copy(b),x.uniforms.tint.value.setRGB(C==="ember"?1.3:1,C==="dusk"?.85:1,C==="ember"?.6:1),_.distanceToSquared(y)>.06&&(g[w].set(y.x,y.z,M,1),w=(w+1)%g.length,_.copy(y))},dispose(){d.dispose(),u.dispose(),x.dispose(),r.dispose()}}}const ca=".,:;oOQ0cuvn|/\\-=~*+#%^AX";function Cd(i){const e=ca,t=document.createElement("canvas");t.width=e.length*32,t.height=40;const n=t.getContext("2d");n.fillStyle="#fff",n.font='29px "Courier New", monospace',n.textAlign="center",n.textBaseline="middle",Array.from(e).forEach((x,p)=>n.fillText(x,p*32+16,21));const s=new is(t);s.generateMipmaps=!1,s.minFilter=s.magFilter=ft;const r=new Float32Array(i*3),o=new Float32Array(i*3),a=new Float32Array(i*3),c=new Tt,l=new Nt(r,3).setUsage(Pi),h=new Nt(o,3).setUsage(Pi),f=new Nt(a,3).setUsage(Pi);c.setAttribute("position",l),c.setAttribute("inkColor",h),c.setAttribute("shape",f);const u=new Ht({transparent:!0,depthTest:!0,depthWrite:!1,uniforms:{...Gr(),atlas:{value:s},pixelScale:{value:60},brightness:{value:1},worldDepth:{value:null},depthSize:{value:new Ne(1,1)},useWorldDepth:{value:0}},vertexShader:`attribute vec3 inkColor, shape; uniform float pixelScale; varying vec3 vColor, vShape;
      varying vec3 worldPoint;
      void main() { worldPoint = (modelMatrix * vec4(position, 1.)).xyz; vColor = inkColor; vShape = shape; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_PointSize = clamp(shape.y * pixelScale * 1.45, 4., 48.); }`,fragmentShader:`uniform sampler2D atlas, worldDepth; uniform float brightness, useWorldDepth; uniform vec2 depthSize; varying vec3 vColor, vShape;
      varying vec3 worldPoint;
      ${aa}
      void main() {
        if (useWorldDepth > .5 && gl_FragCoord.z > texture2D(worldDepth, gl_FragCoord.xy / depthSize).r + .00035) discard;
        vec2 uv = vec2((gl_PointCoord.x - .5) * 1.25 + .5, 1. - gl_PointCoord.y); if (uv.x < 0. || uv.x > 1.) discard;
        float ink = texture2D(atlas, vec2((vShape.x + uv.x) / ${e.length}.0, uv.y)).a;
        if (ink < .12) discard;
        vec3 lit = illuminateInk(vColor * brightness, worldPoint);
        lit = lit / (vec3(1.) + lit * .32);
        gl_FragColor = vec4(illuminationEnabled > .5 ? max(vec3(.035,.031,.055), lit) : lit, ink * vShape.z); }`}),d=new Bs(c,u);d.frustumCulled=!1,d.userData.glyph="particle";let g=0;return{mesh:d,uniforms:u.uniforms,occludeWith(x,p,m){u.depthTest=!1,u.uniforms.worldDepth.value=x,u.uniforms.depthSize.value.set(p,m),u.uniforms.useWorldDepth.value=1},clear(){g=0},push(x,p,m,S,w,_,M=1){if(g>=i)return;const y=g++*3;r[y]=x,r[y+1]=p,r[y+2]=m,o[y]=_[0],o[y+1]=_[1],o[y+2]=_[2],a[y]=Math.max(0,e.indexOf(w)),a[y+1]=S,a[y+2]=M},commit(x,p,m){c.setDrawRange(0,g),l.needsUpdate=h.needsUpdate=f.needsUpdate=!0,u.uniforms.pixelScale.value=x/(p.top-p.bottom),u.uniforms.brightness.value=m},dispose(){c.dispose(),u.dispose(),s.dispose()}}}function Pd(i,e="actor"){return hd(i,e)}const Ur={actor:" .:-=+*x%#@",foliage:" .,:;vcoa%#",stone:" .:-=coO0#",wood:".:-=|/\\lt",bark:":|/\\Il|",earth:" .,,:;;co",water:" .-_~=~-",crest:" .,:*+oO",generic:" .,:;-~=+*ox%#",snow:" .,:;~+*coO",wetgrass:" .,;v/\\"},Uy=Object.keys(Ur);let Zo="";const Yi={};for(const i of Uy)Yi[i]=[Zo.length,Ur[i].length],Zo+=Ur[i];const Jl={actor:.12,foliage:.2,stone:.18,wood:.17,bark:.17,earth:.17,generic:.18,snow:.13,wetgrass:.17},Id={actor:[2.4,.015],foliage:[2,.012],stone:[2.2,.012],wood:[2.3,.012],bark:[2.3,.012],earth:[1.8,.01],generic:[2.2,.012],snow:[1.2,.4],wetgrass:[2.1,.01]},Fy=Ks.glyph;let si=null;function la(){if(si)return si;const i=document.createElement("canvas"),e=48;i.width=Zo.length*e,i.height=64;const t=i.getContext("2d");return t.fillStyle="#000",t.fillRect(0,0,i.width,i.height),t.fillStyle="#fff",t.font='46px "Courier New", monospace',t.textAlign="center",t.textBaseline="middle",Array.from(Zo).forEach((n,s)=>t.fillText(n,s*e+e/2,34)),si=new is(i),si.generateMipmaps=!0,si.minFilter=wn,si.magFilter=ft,si.anisotropy=4,si.userData.slot=e/i.width,si}function Oy(i,e){const t=i.userData.asciiSurface;return t&&t in Jl?t:e}function Ld(i,e="generic",t={}){if(i.userData.worldGlyph)return i;const n=Oy(i,e),s=(t.size??Jl[n])*(t.spacing??1),r=!!(t.alphabet||t.font||t.fontWeight),o=t.alphabet??Ur[n],[a,c]=r?[0,Array.from(o).length]:Yi[n],[l,h]=Id[n],f=r?gd(o,!1,t):la();r&&vd(i,f),i.userData.worldGlyph=n;const u=i.onBeforeCompile;i.onBeforeCompile=(g,x)=>{u.call(i,g,x),g.fragmentShader=g.fragmentShader.replace(/\ngl_FragColor\.a = [0-9.]+;/g,""),g.uniforms.glyphAtlas={value:f},g.vertexShader=g.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vGlyphPos; varying vec3 vGlyphNormal;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vec3 glyphScale = vec3(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz), length(modelMatrix[2].xyz));
        vec3 glyphOffset = vec3(0.);
        #ifdef USE_INSTANCING
          glyphScale *= vec3(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz), length(instanceMatrix[2].xyz));
          glyphOffset = instanceMatrix[3].xyz * 1.37;
        #endif
        vGlyphPos = transformed * glyphScale + glyphOffset;
        vGlyphNormal = objectNormal / max(glyphScale, vec3(.001));`),g.fragmentShader=g.fragmentShader.replace("#include <common>",`#include <common>
        uniform sampler2D glyphAtlas;
        varying vec3 vGlyphPos; varying vec3 vGlyphNormal;
        float glyphHash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
        ${xd(t.palette)}`).replace("#include <dithering_fragment>",`#include <dithering_fragment>
        {
          // Project the lattice on the face's dominant axis, letters upright on walls.
          vec3 n = abs(normalize(vGlyphNormal));
          vec2 plane = n.y > max(n.x, n.z) ? vGlyphPos.xz : n.x > n.z ? vGlyphPos.zy : vGlyphPos.xy;
          vec2 cell = vec2(${s.toFixed(3)}, ${(s*1.25).toFixed(3)});
          vec2 grid = floor(plane / cell), inside = fract(plane / cell);
          float face = n.y > max(n.x, n.z) ? 1. : n.x > n.z ? 2. : 3.;
          float grain = glyphHash(vec3(grid, face));
          // Roll off hot lantern light first, then read the cell's value.
          vec3 lit = max(${t.lighting==="unlit"?"diffuseColor.rgb + totalEmissiveRadiance":"gl_FragColor.rgb"}, vec3(0.));
          lit = lit / (vec3(1.) + lit * .9);
          float tone = dot(pow(lit, vec3(.4545)), vec3(.2126, .7152, .0722));
          ${t.contrast!==void 0||t.toneOffset!==void 0?`tone = clamp((tone - .5) * ${(t.contrast??1).toFixed(4)} + .5 + ${(t.toneOffset??0).toFixed(4)}, 0., 1.);`:""}
          // An ASCII object, not a textured solid: shading is the choice of
          // letter (sparse . : to dense # @) in a few steps, the gap between
          // letters is near black, and each letter carries one flat colour.
          float steps = ${(t.shadowSteps??6).toFixed(1)};
          ${n==="snow"?"float level = clamp(.18 + tone * .25 + grain * .5, 0., .999);":"float level = clamp(floor(tone * 1.5 * steps + grain * .85) / steps, 0., .999);"}
          ${n==="snow"&&t.shadowSteps!==void 0?"level = floor(level * steps) / steps;":""}
          float index = ${a}.0 + floor(level * ${c}.0);
          float slot = ${f.userData.slot.toFixed(6)};
          ${t.spacing!==void 0&&t.spacing>1?`inside = (inside - .5) * ${t.spacing.toFixed(4)} + .5;`:""}
          ${t.rotation?`inside = mat2(${Math.cos(t.rotation).toFixed(6)},${Math.sin(t.rotation).toFixed(6)},${(-Math.sin(t.rotation)).toFixed(6)},${Math.cos(t.rotation).toFixed(6)}) * (inside - .5) + .5;`:""}
          float ink = texture2D(glyphAtlas, vec2((index + .08 + inside.x * .84) * slot, .06 + inside.y * .88)).r;
          ink = smoothstep(.1, .45, ink)${n==="snow"?" * .84":""};
          ${t.density!==void 0?`ink *= step(grain, ${t.density.toFixed(4)});`:""}
          ${t.spacing!==void 0&&t.spacing>1||t.rotation?"ink *= step(0., inside.x) * step(inside.x, 1.) * step(0., inside.y) * step(inside.y, 1.);":""}
          vec3 hue = lit / max(dot(lit, vec3(.2126, .7152, .0722)), .002);
          vec3 letter = ${n==="snow"?`lit * ${l.toFixed(3)}`:`hue * pow(.18 + level * .82, 2.2) * ${l.toFixed(3)} * .5`};
          ${t.palette?`letter = glyphPalette(level) * hue * (.3 + level * .9) * ${l.toFixed(3)} * .5;`:""}
          ${t.palette&&t.emissive!==void 0?"letter += totalEmissiveRadiance;":""}
          ${t.strength!==void 0?`letter *= ${t.strength.toFixed(4)};`:""}
          ${t.open===!0?"if (ink < .02) discard;":""}
          gl_FragColor.rgb = mix(lit * ${(t.open===!0?0:t.gap??h).toFixed(4)}, letter, ink);
          gl_FragColor.a = ${Fy.toFixed(2)};
        }`)};const d=i.customProgramCacheKey.call(i);return i.customProgramCacheKey=()=>`world-glyph-${n}-${s.toFixed(3)}-${JSON.stringify(t)}-${d}`,i.needsUpdate=!0,i}function zy(i,e=129){return{kind:"paint",x:0,z:0,angle:0,size:i/2,mask:{resolution:e,values:new Array(e**2).fill(-i*2)}}}function Fr(i,e,t,n=i.mask?.values){const s=i.mask;if(!s||!n)return-1/0;const r=e-i.x,o=t-i.z,a=Math.cos(i.angle),c=Math.sin(i.angle),l=(a*r+c*o)/(i.size*2)+.5,h=(-c*r+a*o)/(i.size*2)+.5;if(l<0||h<0||l>1||h>1)return-1-Math.hypot(Math.max(0,-l,l-1),Math.max(0,-h,h-1))*i.size*2;const f=s.resolution,u=l*(f-1),d=h*(f-1),g=Math.min(f-2,Math.floor(u)),x=Math.min(f-2,Math.floor(d)),p=u-g,m=d-x,S=n[x*f+g],w=n[x*f+g+1],_=n[(x+1)*f+g],M=n[(x+1)*f+g+1];return(S*(1-p)+w*p)*(1-m)+(_*(1-p)+M*p)*m}function By(i,e,t,n,s=!1){if(i.kind!=="paint"||!i.mask)return!1;const{resolution:r,values:o}=i.mask,a=Math.cos(i.angle),c=Math.sin(i.angle),l=t.x-e.x,h=t.z-e.z,f=l*l+h*h;let u=!1;for(let d=0;d<r;d++)for(let g=0;g<r;g++){const x=(g/(r-1)-.5)*i.size*2,p=(d/(r-1)-.5)*i.size*2,m=i.x+a*x-c*p,S=i.z+c*x+a*p,w=f?Math.max(0,Math.min(1,((m-e.x)*l+(S-e.z)*h)/f)):0,_=n-Math.hypot(m-e.x-l*w,S-e.z-h*w),M=d*r+g,y=Math.round((s?Math.min(o[M],-_):Math.max(o[M],_))*1e4)/1e4;y!==o[M]&&(o[M]=y,u=!0)}return u}function Dd(i,e,t,n=0){return i.mask?.heights?n+Fr(i,e,t,i.mask.heights):n}const Zl={enabled:!0,depth:.08,gravity:9.81,damping:2,source:.04,waves:.012};function Nd(i,e,t,n,s={}){const r={...Zl,...s},o=i,a=o*o,c=e/(o-1),l=new Float32Array(a),h=new Float32Array(a),f=new Float32Array(a),u=new Float32Array(a),d=new Float32Array(a),g=new Float32Array(a),x=new Uint8Array(a);for(let w=0;w<o;w++)for(let _=0;_<o;_++){const M=w*o+_;if(!n[M])continue;l[M]=r.depth;const y=[_>0?M-1:M,_<o-1?M+1:M,w>0?M-o:M,w<o-1?M+o:M],E=y.some(b=>n[b]&&t[b]<t[M]-.005),v=y.some(b=>n[b]&&t[b]>t[M]+.005);x[M]=E&&!v?1:0}function p(w){if(!r.enabled||w<=0)return;let _=Math.min(w,.08);for(;_>1e-7;){let M=r.depth;for(let b=0;b<a;b++)M=Math.max(M,l[b]);const y=Math.min(_,1/60,.2*c/Math.sqrt(r.gravity*Math.max(.01,M)));_-=y;const E=Math.exp(-r.damping*y),v=y/c;for(let b=0;b<o;b++)for(let C=0;C<o;C++){let R=function(P,I){if(!n[P])return 0;const U=Math.max(t[T],t[P]),k=Math.max(0,t[T]+l[T]-U),D=Math.max(0,t[P]+l[P]-U);return(I+r.gravity*(k+D)*.5*(k-D)*v)*E};const T=b*o+C;n[T]&&(h[T]=C<o-1?R(T+1,h[T]):0,f[T]=b<o-1?R(T+o,f[T]):0)}for(let b=0;b<o;b++)for(let C=0;C<o;C++){const R=b*o+C,T=Math.max(0,h[R])+Math.max(0,f[R])+(C?Math.max(0,-h[R-1]):0)+(b?Math.max(0,-f[R-o]):0);g[R]=T?Math.min(1,l[R]/(T*v)):1}for(let b=0;b<o;b++)for(let C=0;C<o;C++){const R=b*o+C;if(C<o-1){const T=h[R]*g[h[R]>0?R:R+1];h[R]=T,l[R]-=T*v,l[R+1]+=T*v}if(b<o-1){const T=f[R]*g[f[R]>0?R:R+o];f[R]=T,l[R]-=T*v,l[R+o]+=T*v}}for(let b=0;b<a;b++)l[b]=Math.max(0,l[b]),x[b]&&(l[b]+=Math.min(r.source*y,Math.max(0,r.depth-l[b])));for(let b=0;b<o;b++)for(let C=0;C<o;C++){const R=b*o+C,T=l[R];if(!n[R]||T<.002){d[R]=0;continue}const P=(h[R]+(C?h[R-1]:0))/Math.max(.015,2*T),I=(f[R]+(b?f[R-o]:0))/Math.max(.015,2*T),U=(C?h[R-1]:0)+(b?f[R-o]:0)-h[R]-f[R],k=Math.max(0,U/c-.035)*Math.min(1,Math.hypot(P,I)*.5),D=S(u,(C/(o-1)-.5)*e-P*y,(b/(o-1)-.5)*e-I*y);d[R]=Math.min(.65,D*Math.exp(-y*1.1)+k*y*3)}u.set(d)}}function m(w,_,M=.18,y=.6){for(let E=0;E<o;E++)for(let v=0;v<o;v++){const b=E*o+v;if(!n[b]||l[b]<.001)continue;const C=(v/(o-1)-.5)*e-w,R=(E/(o-1)-.5)*e-_,T=Math.hypot(C,R),P=Math.exp(-T*T/Math.max(.01,y*y))*M;T>y*3||(v<o-1&&n[b+1]&&(h[b]+=(C+c*.5)/Math.max(y,T)*P),E<o-1&&n[b+o]&&(f[b]+=(R+c*.5)/Math.max(y,T)*P))}}function S(w,_,M){const y=Math.max(0,Math.min(o-1,(_/e+.5)*(o-1))),E=Math.max(0,Math.min(o-1,(M/e+.5)*(o-1))),v=Math.min(o-2,Math.floor(y)),b=Math.min(o-2,Math.floor(E)),C=y-v,R=E-b,T=b*o+v;return(w[T]*(1-C)+w[T+1]*C)*(1-R)+(w[T+o]*(1-C)+w[T+o+1]*C)*R}return{settings:r,depth:l,flowX:h,flowZ:f,foam:u,bed:t,wet:n,resolution:i,size:e,step:p,disturb:m,sample:S}}function Ud(i,e=new st){return e.set(i.x,i.z,i.angle,i.kind==="stream"?i.size:-i.size)}function li(i,e,t){if(i.kind==="paint")return Fr(i,e,t);const n=e-i.x,s=t-i.z,r=i.angle;if(i.kind==="stream"){const c=Math.cos(r)*n+Math.sin(r)*s;if(Math.abs(c)>17)return-9;const l=-Math.sin(r)*n+Math.cos(r)*s-Math.sin(c*.29+r*7)*2.3-Math.sin(c*.83+1)*.5,h=Math.max(0,Math.sin(c*.23+r*3))**3*2.2;return i.size*(1+.45*Math.sin(c*.47+1.7))+h-Math.abs(l)}const o=Math.atan2(s,n);return i.size*(1+.2*Math.sin(o*3+r*5)+.1*Math.sin(o*5+r*11)+.05*Math.sin(o*9+r))-Math.hypot(n,s*1.2)}const jl=`
  // Water features: w > 0 a meandering stream (centre, angle, half width);
  // w < 0 an organic pond (radius -w). Returns > 0 inside the water.
  float waterEdge(vec2 p, vec4 s) {
    vec2 d = p - s.xy;
    if (s.w > 0.) {
      vec2 dir = vec2(cos(s.z), sin(s.z));
      float along = dot(d, dir);
      if (abs(along) > 17.) return -9.;
      float across = dot(d, vec2(-dir.y, dir.x)) - sin(along * .29 + s.z * 7.) * 2.3 - sin(along * .83 + 1.) * .5;
      float pool = pow(max(0., sin(along * .23 + s.z * 3.)), 3.) * 2.2;
      return s.w * (1. + .45 * sin(along * .47 + 1.7)) + pool - abs(across);
    }
    float a = atan(d.y, d.x);
    float r = -s.w * (1. + .2 * sin(a * 3. + s.z * 5.) + .1 * sin(a * 5. + s.z * 11.) + .05 * sin(a * 9. + s.z));
    return r - length(d * vec2(1., 1.2));
  }
`,ns={cell:[.15,.19],flow:.35,pondDrift:[.02,.015],open:[.07,.17,.22],sheen:[.12,.16,.18],sparse:.22,foam:[.32,.52,.62],bank:.25,reflection:{enabled:!0,threshold:.05,rows:4,tint:[.85,.97,1.1]}},jt=i=>i.toFixed(4),So=i=>`vec3(${jt(i[0])}, ${jt(i[1])}, ${jt(i[2])})`;function Fd(i=ns,e=!1,t=!1){const n=la(),s=n.userData.slot.toFixed(6),[r,o]=Yi.water,[a,c]=Yi.crest,[l,h]=Yi.actor,[f,u]=Yi.wetgrass,d=i.reflection;return`
    uniform sampler2D glyphAtlas, reflection;
    uniform mat4 reflectionMatrix;
    uniform float reflectionOn;
    uniform vec3 waterViewDirection, waterLightDirection, waterLightColor;
    uniform float waterLightPower, waterReflectionLevel;
    ${t?"uniform float waterWaveStrength;":""}
    ${t?"vec2 waterGlyphDx, waterGlyphDy;":""}
    float waterHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float waterGlyph(float index, vec2 inside) {
      return smoothstep(.1, .45, ${t?"textureGrad":"texture2D"}(glyphAtlas, vec2((index + .08 + inside.x * .84) * ${s}, .06 + inside.y * .88)${t?",waterGlyphDx,waterGlyphDy":""}).r);
    }
    ${t?`
    // Long connected wave fronts, sampled once per glyph. Two short advection
    // phases avoid flow*time exploding when the simulated current changes.
    float waveBands(vec2 p, float time) {
      float bend = sin(p.x*.8 + p.y*.3 + time*.16)*.9;
      float a = sin(p.y*4.2 + p.x*.8 - time*.7 + bend);
      float b = sin(p.x*2.2 - p.y*.6 - time*.4)*.3;
      return smoothstep(-.65,1.1,a+b);
    }
    float flowingBands(vec2 p, vec2 flow, float time) {
      flow *= min(1.,3./max(.001,length(flow)));
      float a = fract(time/3.), b = fract(time/3.+.5);
      return mix(waveBands(p-flow*a*3.,time),waveBands(p-flow*b*3.,time),abs(a-.5)*2.);
    }`:""}
    // Pure ASCII water: every cell is one letter of one flat colour on a dark
    // gap. The mirror is sampled once per cell (at its centre) and turned into
    // a letter, so reflections are characters, never a continuous image.
    vec3 waterLettersNormal(vec3 p, float time, float crest, vec2 flow, float vegetation, vec3 weed, vec3 normal) {
      vec2 cell = vec2(${jt(i.cell[0])}, ${jt(i.cell[1])});
      vec2 plane = p.xz ${e||t?"":"- flow * time"};
      vec2 drift = flow;
      ${e?"if (normal.y < .6) { bool side = abs(normal.x) > abs(normal.z); plane = side ? p.zy : p.xy; drift = vec2(side ? flow.y : flow.x, -length(flow)); }":""}
      // Derivatives of the continuous lattice, before fract and glyph selection.
      // Otherwise adjacent atlas slots look like a huge texture minification:
      // shallow views smear glyphs into the bank or make entire rows disappear.
      ${t?`waterGlyphDx=dFdx(plane/cell)*vec2(.84*${s},.88); waterGlyphDy=dFdy(plane/cell)*vec2(.84*${s},.88);`:""}
      vec2 grid = floor(plane / cell), inside = fract(plane / cell);
      float grain = waterHash(grid);
      vec3 centre = vec3((grid + .5) * cell ${e||t?"":"+ flow * time"}, p.y).xzy;
      centre.x += sin(grid.y * .7 + time * 1.2) * .05;
      vec4 mirror = reflectionMatrix * vec4(centre, 1.);
      vec2 uv = mirror.xy / mirror.w;
      // The mirror trembles row by row, like a reflection on moving water.
      uv.x += (sin(grid.y * 1.3 + time * 2.1) * .002 + sin(grid.y * .41 - time * .9) * .001) ${t?"* waterWaveStrength":""};
      vec4 seen = texture2D(reflection, clamp(uv, vec2(.001), vec2(.999)));
      float object = (1. - step(.96, seen.a)) * step(.0, min(min(uv.x, uv.y), min(1. - uv.x, 1. - uv.y))) * reflectionOn;
      // A horizontal mirror cannot describe the side of a waterfall. Keep it
      // on the calm level; sloping water reflects directional light below.
      ${e?"object *= smoothstep(.85,.98,normal.y) * (1.-smoothstep(.12,.35,abs(p.y-waterReflectionLevel)));":""}
      vec3 shown = pow(max(seen.rgb, vec3(0.)), vec3(.4545));
      float lum = dot(shown, vec3(.2126, .7152, .0722));
      vec3 gap = vec3(0.);
      // Reflection: drop rows so it reads as a broken mirror on water.
      float row = step(.5, mod(grid.y, ${jt(d.rows)}));
      if (object > .5 && lum > ${jt(d.threshold)} && row > .5) {
        float level = clamp(lum * 1.4, 0., .999);
        vec3 hue = shown / max(lum, .01);
        float fresnel = pow(1.-max(0.,dot(normal,waterViewDirection)),3.);
        vec3 ink = pow(hue * (.42 + level * .8), vec3(2.2)) * ${So(d.tint)} * (1.+fresnel*.5);
        return mix(gap, ink, waterGlyph(${l}.0 + 1. + floor(level * ${h-1}.0), inside));
      }
      ${t?"float bands = mix(.5,flowingBands((grid+.5)*cell,drift,time),min(1.,waterWaveStrength+length(drift)*.15)); crest *= .45 + bands*.55;":""}
      // Foam letters where waves break or boots disturb the surface.
      if (crest > .12 && grain < crest * 1.4) {
        float level = clamp(crest * ${t?".7 + grain * .18, 0., .65":"1.5 + grain * .3, 0., .999"});
        return mix(gap, ${So(i.foam)} * (.4 + crest), waterGlyph(${a}.0 + 1. + floor(level * ${c-1}.0), inside));
      }
      // Submerged weed as sparse green strokes.
      if (vegetation > .3 && grain > .55) {
        return mix(gap, weed, waterGlyph(${f}.0 + 1. + floor(grain * ${u-1}.0), inside) * .8);
      }
      // Open water: sparse rows of ~ - = drifting with the current.
      float swell = ${t?"bands":`.5 + .5 * sin(${e?"dot(grid, normalize(drift + vec2(.00001))) * .9 - time * (1.4 + length(drift) * 2.)":"grid.y * .9 + grid.x * .15 - time * 1.4"} + grain * 2.)`};
      if (grain < ${jt(i.sparse)} + ${t?"(1.-swell)":"swell"} * ${jt(i.sparse)}) return gap;
      float level = clamp(swell * ${t?".8 + grain * .12":".75 + grain * .3"}, 0., .999);
      // Moon sheen drifts across the surface in slow bands.
      vec3 waveNormal = normalize(normal + vec3(sin(centre.z*2.3+time*1.7)*.1,0.,cos(centre.x*1.9-time*1.2)*.12) ${t?"* waterWaveStrength":""});
      vec3 reflected = reflect(-waterLightDirection, waveNormal);
      float alignment = max(0.,dot(reflected,waterViewDirection));
      float sheen = (pow(alignment,32.)*.7 + pow(alignment,180.)*1.8) * waterLightPower * reflectionOn * max(0.,waterLightDirection.y);
      ${t?"level = min(.999,floor(level*5.)/4.); sheen = floor(min(sheen,2.)*6.)/6.;":""}
      vec3 ink = ${So(i.open)} * (${t?".32 + level * 1.9":".6 + level * 1.2"}) + waterLightColor * ${So(i.sheen)} * sheen * 5.;
      return mix(gap, ink, waterGlyph(${r}.0 + 1. + floor(level * ${o-1}.0), inside));
    }
    vec3 waterLetters(vec3 p, float time, float crest, vec2 flow, float vegetation, vec3 weed) { return waterLettersNormal(p,time,crest,flow,vegetation,weed,vec3(0.,1.,0.)); }`}const ky=new Je().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),Gy=new F(0,1,0),pr=new F,bo=new F,Xu=new F;function Od(i,e,t,n){i.updateMatrixWorld(),i.getWorldPosition(pr),i.getWorldDirection(bo).add(pr),Xu.set(0,1,0).applyQuaternion(i.getWorldQuaternion(e.quaternion)).reflect(Gy),e.copy(i),e.position.copy(pr),e.position.y=t*2-pr.y,bo.y=t*2-bo.y,e.up.copy(Xu),e.lookAt(bo),e.updateMatrixWorld(),n.copy(ky).multiply(e.projectionMatrix).multiply(e.matrixWorldInverse)}function Ql(i,e,t=640){const n=new mn(t,t,{minFilter:ft,magFilter:ft}),s=new qs,r=new Map;function o(c){let l=r.get(c);if(!l){l=c.clone();const h=c.onBeforeCompile;l.onBeforeCompile=function(f,u){h.call(this,f,u),f.fragmentShader=f.fragmentShader.replace("#include <dithering_fragment>",`#include <dithering_fragment>
gl_FragColor.a = .85;`)},l.customProgramCacheKey=()=>`water-source-${c.customProgramCacheKey()}`,l.colorWrite=!0,l.depthWrite=!0,r.set(c,l)}return l}const a=new Hn(new F(0,1,0),0);return e.reflection.value=n.texture,{render(c,l,h){e.reflection.value=n.texture,i.updateWorldMatrix(!0,!1);const f=i.userData.waterReflectionLevel??i.getWorldPosition(pr).y;Od(h,s,f,e.reflectionMatrix.value);const u=c.getRenderTarget(),d=c.clippingPlanes,g=c.shadowMap.autoUpdate,x=i.visible,p=d.length===1?d[0]:void 0,m=p?.clone();p?p.set(a.normal,-f):(a.constant=-f,c.clippingPlanes=[a]),i.visible=!1,c.shadowMap.autoUpdate=!1;const S=[],w=[];l.traverseVisible(_=>{if(_.userData.glyphBodyOf||_.userData.glyph==="water"){w.push(_),_.visible=!1;return}if(!(_ instanceof Ye))return;const M=_.userData.glyphBodyMaterial??_.userData.asciiOriginal;M&&(S.push([_,_.material]),_.material=Array.isArray(M)?M.map(o):o(M))});try{c.setRenderTarget(n),c.render(l,s)}finally{for(const[_,M]of S)_.material=M;for(const _ of w)_.visible=!0;c.setRenderTarget(u),p&&m?p.copy(m):c.clippingPlanes=d,c.shadowMap.autoUpdate=g,i.visible=x}},dispose(){r.forEach(c=>c.dispose()),r.clear(),n.dispose()}}}function zd(i,e={}){const t={...ns,...e.look,reflection:{...ns.reflection,...e.look?.reflection}},n=i.kind==="paint"?i.mask:void 0,s={...Zl,enabled:!e.edgeGLSL||!!e.distance,...e.physics},r=n?i.size*2:e.size??(i.kind==="stream"?38:i.size*2.8+2),o=n?.resolution??Math.max(9,Math.min(129,Math.ceil(r/.22)+1)),a=Math.min(129,o),c=new Float32Array(a**2*4),l=new Di(c,a,a,rn,cn);l.minFilter=l.magFilter=ft;let h;const f=new Map,u=n?new Di(new Float32Array(n.values),n.resolution,n.resolution,zr,cn):void 0;u&&(u.minFilter=u.magFilter=Bt,u.needsUpdate=!0);const d={waterMask:{value:u??null},maskResolution:{value:n?.resolution??1},time:{value:0},centre:{value:Ud(i)},reflection:{value:null},reflectionMatrix:{value:new Je},reflectionOn:{value:t.reflection.enabled?1:0},glyphAtlas:{value:la()},waterViewDirection:{value:new F(0,1,0)},waterLightDirection:{value:new F(-5,12,7).normalize()},waterLightColor:{value:new Oe(14739404)},waterLightPower:{value:1},waterReflectionLevel:{value:e.level??.018},waterWaveStrength:{value:Math.min(2,s.waves/.012)},waterDynamics:{value:l},dynamicsSize:{value:r},dynamicsOn:{value:s.enabled?1:0}},g=e.flow?`vec2(${jt(e.flow[0])}, ${jt(e.flow[1])})`:i.kind==="stream"?`vec2(cos(centre.z), sin(centre.z)) * ${jt(t.flow)}`:`vec2(${jt(t.pondDrift[0])}, ${jt(t.pondDrift[1])})`,x=new Ht({uniforms:d,vertexShader:`varying vec3 p; varying vec3 waterNormalWorld;
      void main(){vec4 w=modelMatrix*vec4(position,1.);p=w.xyz;waterNormalWorld=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}`,fragmentShader:`varying vec3 p; varying vec3 waterNormalWorld; uniform float time; uniform vec4 centre;
      uniform sampler2D waterDynamics; uniform float dynamicsSize, dynamicsOn;
      ${jl}
      ${n?`
      uniform sampler2D waterMask; uniform float maskResolution;
      float paintedEdge(vec2 point) {
        vec2 d = point - centre.xy;
        vec2 uv = vec2(cos(centre.z)*d.x + sin(centre.z)*d.y, -sin(centre.z)*d.x + cos(centre.z)*d.y) / (-centre.w * 2.) + .5;
        if (min(uv.x,uv.y)<0. || max(uv.x,uv.y)>1.) return -1.;
        vec2 grid = uv * (maskResolution - 1.), base = min(floor(grid), vec2(maskResolution - 2.)), t = grid - base;
        vec2 texel = (base + .5) / maskResolution; float step = 1. / maskResolution;
        float a = texture2D(waterMask, texel).r, b = texture2D(waterMask, texel + vec2(step,0.)).r;
        float c = texture2D(waterMask, texel + vec2(0.,step)).r, d1 = texture2D(waterMask, texel + vec2(step)).r;
        return mix(mix(a,b,t.x),mix(c,d1,t.x),t.y);
      }`:""}
      ${Fd(t,!!n?.heights,!0)}
      void main(){
        ${e.edgeGLSL??(n?"float inside=paintedEdge(p.xz);":"float inside=waterEdge(p.xz,centre);")}
        if(inside<0.)discard;
        float edge=1.-smoothstep(0.,${jt(t.bank)},inside);
        vec2 current = ${g};
        ${n?.heights?`float slope=length(waterNormalWorld.xz); if(slope>.02) current=normalize(waterNormalWorld.xz)*(${jt(t.flow)} + slope*.8);`:""}
        vec2 d=p.xz-centre.xy;
        vec2 local=vec2(cos(centre.z)*d.x+sin(centre.z)*d.y,-sin(centre.z)*d.x+cos(centre.z)*d.y);
        vec4 dynamics=texture2D(waterDynamics,local/dynamicsSize+.5);
        if(dynamicsOn>.5 && dynamics.z<.002) discard;
        current += dynamics.xy * dynamicsOn;
        float turbulence = dynamics.w * dynamicsOn;
        gl_FragColor=vec4(waterLettersNormal(p,time,max(${e.crestGLSL??"edge*.28"},turbulence),current,0.,vec3(0.),normalize(waterNormalWorld)),${Ns("glyph")});
      }`}),p=new xn(r,r,o-1,o-1);p.rotateX(-Math.PI/2);const m=new Ye(p,x);m.rotation.y=-i.angle,m.position.set(i.x,e.level??.018,i.z),m.userData.glyph="water";const S=new Float32Array(o**2);function w(E,v){const b=E-i.x,C=v-i.z,R=Math.cos(i.angle),T=Math.sin(i.angle);return[R*b+T*C,-T*b+R*C]}function _(E){const v=a,b=Math.cos(i.angle),C=Math.sin(i.angle);for(let T=0;T<v*v;T++){const P=T%v,I=Math.floor(T/v),U=h.depth[T],k=(h.flowX[T]+(P?h.flowX[T-1]:0))/Math.max(.015,2*U),D=(h.flowZ[T]+(I?h.flowZ[T-v]:0))/Math.max(.015,2*U);c[T*4]=b*k-C*D,c[T*4+1]=C*k+b*D,c[T*4+2]=U,c[T*4+3]=h.foam[T]}l.needsUpdate=!0;const R=p.attributes.position;for(let T=0;T<R.count;T++){const P=R.getX(T),I=R.getZ(T),U=h.sample(h.depth,P,I),k=Math.sin(P*2.3+E*1.7)*Math.cos(I*1.9-E*1.2)*Math.min(s.waves,U*.15);R.setY(T,S[T]+(s.enabled?U-(n?.heights?.045:s.depth)+k:0))}R.needsUpdate=!0,p.computeVertexNormals(),p.computeBoundingSphere(),p.computeBoundingBox()}function M(){n&&u&&(u.image.data.set(n.values),u.needsUpdate=!0);const E=a,v=new Float32Array(E*E),b=new Uint8Array(E*E),C=Math.cos(i.angle),R=Math.sin(i.angle);for(let T=0;T<E*E;T++){const P=(T%E/(E-1)-.5)*r,I=(Math.floor(T/E)/(E-1)-.5)*r,U=i.x+C*P-R*I,k=i.z+R*P+C*I;b[T]=(e.edgeGLSL&&e.distance?e.distance(U,k)<=0:li(i,U,k)>=0)?1:0,v[T]=n?.heights?Fr(i,U,k,n.heights)-.045:-s.depth}for(let T=0;T<S.length;T++)S[T]=n?.heights?.[T]??0;h=Nd(E,r,v,b,s),f.clear(),_(0)}M();const y=Ql(m,d);return{mesh:m,material:x,shape:i,look:t,reflection:y,uniforms:d,physics:s,get dynamics(){return h},updateDynamics(E,v){s.enabled&&E>0&&(h.step(E),_(v))},heightAt(E,v){const[b,C]=w(E,v);return m.position.y+(s.enabled?h.sample(h.bed,b,C)+h.sample(h.depth,b,C):n?.heights?Fr(i,E,v,n.heights):0)},disturb(E,v,b=.18,C=.6){if((e.distance?e.distance(E,v)>0:li(i,E,v)<0)||!s.enabled)return;const[R,T]=w(E,v);h.disturb(R,T,b,C)},interact(E,v,b=.45){const C=f.get(E),R=C?.distanceTo(v)??0;if(R>.015&&R<4){const T=Math.max(1,Math.ceil(R/.2));for(let P=1;P<=T;P++){const I=C.clone().lerp(v,P/T);Math.abs(I.y-this.heightAt(I.x,I.z))<.65&&this.disturb(I.x,I.z,Math.min(.25,R*.6),b)}}f.size>256&&!C&&f.delete(f.keys().next().value),f.set(E,v.clone())},reflectionLevel(E,v){if(!n?.heights)return m.position.y;const b=a,C=Math.cos(i.angle),R=Math.sin(i.angle),T=r/(b-1);let P=1/0,I=m.position.y,U=1/0,k=I;for(let D=0;D<b;D++)for(let z=0;z<b;z++){const O=D*b+z;if(!h.wet[O]||s.enabled&&h.depth[O]<.004)continue;const B=(z/(b-1)-.5)*r,V=(D/(b-1)-.5)*r,j=(i.x+C*B-R*V-E)**2+(i.z+R*B+C*V-v)**2,W=$=>h.bed[$]+(s.enabled?h.depth[$]:.045),H=W(O)+m.position.y;j<U&&(U=j,k=H);const X=z<b-1&&h.wet[O+1]?Math.abs(W(O+1)-W(O))/T:0,Q=D<b-1&&h.wet[O+b]?Math.abs(W(O+b)-W(O))/T:0;j<P&&Math.max(X,Q)<.25&&(P=j,I=H)}return Number.isFinite(P)?I:k},refresh:M,distance(E,v){return e.distance?e.distance(E,v):Math.max(0,-li(i,E,v))},dispose(){l.dispose(),u?.dispose(),y.dispose(),x.dispose(),m.geometry.dispose()}}}const Bd=i=>i-Math.floor(i),mr=i=>Bd(Math.sin(i*127.1+19.7)*43758.5453);function ll(i,e,t=26){const n=Bd(e*(1.1+mr(i)*.35)+mr(i+2e3)),s=-t/2+mr(i*3+1)*t,r=-t/2+mr(i*3+2)*t;return{phase:n,x:s+n*.75,z:r+n*.25,impactX:s+.75,impactZ:r+.25}}function kd(i){const e=new Tt,t=new Float32Array(i*4*3),n=new Float32Array(i*4),s=new Nt(t,3).setUsage(Pi),r=new Nt(n,1).setUsage(Pi);e.setAttribute("position",s),e.setAttribute("opacity",r);const o=new Ht({transparent:!0,depthTest:!0,depthWrite:!1,uniforms:{brightness:{value:1},color:{value:new Oe(.68,.78,.84)},worldDepth:{value:null},depthSize:{value:new Ne(1,1)},useWorldDepth:{value:0}},vertexShader:`attribute float opacity; varying float alpha;
      void main() { alpha=opacity; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,fragmentShader:`uniform sampler2D worldDepth; uniform vec2 depthSize; uniform vec3 color;
      uniform float brightness,useWorldDepth; varying float alpha;
      void main() {
        if(useWorldDepth>.5 && gl_FragCoord.z>texture2D(worldDepth,gl_FragCoord.xy/depthSize).r+.00035)discard;
        vec3 ink=color*brightness;
        gl_FragColor=vec4(ink/(vec3(1.)+ink*.32),alpha);
      }`}),a=new kl(e,o);a.frustumCulled=!1;let c=0;function l(h,f,u,d){const g=c*3;t[g]=h,t[g+1]=f,t[g+2]=u,n[c++]=d}return{mesh:a,material:o,occludeWith(h,f,u){o.depthTest=!1,o.uniforms.worldDepth.value=h,o.uniforms.depthSize.value.set(f,u),o.uniforms.useWorldDepth.value=1},clear(){c=0},push(h,f,u,d,g){if(c+4>n.length)return;const x=-.75/6.5*d,p=-.25/6.5*d;l(h,f,u,g),l(h+x*.54,f+d*.54,u+p*.54,g*.7),l(h+x*.63,f+d*.63,u+p*.63,g*.6),l(h+x,f+d,u+p,g*.1)},commit(h){e.setDrawRange(0,c),s.needsUpdate=r.needsUpdate=!0,o.uniforms.brightness.value=h},dispose(){e.dispose(),o.dispose()}}}function eh(i,e,t={}){const n=t.count??800,s=t.span??26,r=t.radius??10,o=t.height??6.5;let a=-1;const c=new F,l=new F;return{count:n,span:s,drop:(h,f)=>ll(h,f,s),update(h,f,u,d,g,x){f.getWorldDirection(l);let p=0;x&&x.id!==a&&(a=x.id,c.set(u.x+x.side*2.8,d,u.z-3.2));for(let m=0;m<n;m++){const{x:S,z:w,phase:_}=ll(m,h,s);if(Math.hypot(S-u.x,w-u.z)>r)continue;const M=d+(1-_)*o,y=(S-u.x)*l.x+(M-1)*l.y+(w-u.z)*l.z,E=zt.clamp((2-y)/7,0,1),v=.23+E*.15+mr(m+4e3)*.06,C=(Math.hypot(S-u.x,w-u.z)<.65&&M<2.35?.34:.7+E*.15)*Math.min(1,_*10)*g;i.push(S,M,w,v,C),p++}if(x&&x.bolt>0)for(let m=0;m<40;m++){const S=m*.16,w=Math.sin(m*.63+x.id)*.19+Math.sin(m*.19)*.32;e.push(c.x+w,c.y+S,c.z,.23,m%3===0?"|":m%3===1?"/":"\\",[1.8,2,2.4],x.bolt),m>18&&m<31&&e.push(c.x+w+(m-18)*.095,c.y+S,c.z+.15,.18,"/",[1.1,1.4,1.9],x.bolt*.65)}return p}}}const th={cols:5,rows:13,cell:[.15,.19],letter:.21,toward:.45,ramp:[["@",[1.3,1.15,.55]],["#",[1.3,.98,.3]],["%",[1.25,.78,.16]],["x",[1.2,.6,.1]],["*",[1.1,.45,.07]],["+",[1,.32,.05]],[":",[.85,.2,.04]],[".",[.65,.12,.03]]],embers:{count:26,letters:["*","+",":"]},sparks:22,smoke:{count:12,letters:",;:~",color:[.38,.36,.35]},light:{color:16755797,intensity:14,distance:7,decay:1.65,height:1.05}},ec=(i,e,t)=>i===void 0?e:typeof i=="number"?i:i[0]+(i[1]-i[0])*t();function tc(i,e){if(!i.length)return 1;if(e<=i[0].t)return i[0].v;for(let t=1;t<i.length;t++)if(e<=i[t].t){const n=i[t-1],s=i[t],r=(e-n.t)/Math.max(1e-6,s.t-n.t);return n.v+(s.v-n.v)*r}return i[i.length-1].v}function Hy(i,e){if(!i.length)return[1,1,1];if(e<=i[0].t)return i[0].color;for(let t=1;t<i.length;t++)if(e<=i[t].t){const n=i[t-1],s=i[t],r=(e-n.t)/Math.max(1e-6,s.t-n.t);return[n.color[0]+(s.color[0]-n.color[0])*r,n.color[1]+(s.color[1]-n.color[1])*r,n.color[2]+(s.color[2]-n.color[2])*r]}return i[i.length-1].color}const $u=i=>Array.isArray(i)&&typeof i[0]=="object",Vy=i=>Array.isArray(i)&&typeof i[0]=="object";function Gd(i){return Array.from(i).filter(e=>ca.includes(e)).join("")}const Vi=new F,wo=new F,nc=new F,Wi=new F;function Hd(i,e,t={}){const n=new Map,s=[],r=t.budget??6e3;let o=4242;const a=()=>(o=Math.imul(o,1664525)+1013904223>>>0,o/4294967296);let c=0;function l(h,f,u={}){const d=typeof h=="string"?n.get(h):h;if(!d)throw new Error(`ascii-engine: unknown effect "${h}"`);const g=d.name,x=d,p=x.emitters.map(D=>({def:D,letters:[],carry:0,burstsDone:0,trail:[]})),m=f instanceof F?f.clone():new F;let S=f instanceof bt?f:null,w=0,_=!1;const M=u.loop??x.loop??!1,y=x.light?new di(x.light.color,0,x.light.distance??6,x.light.decay??2):void 0;y&&e.add(y);const E=new F,v={name:g,position:m,emitterCount:p.length,get time(){return w},get letters(){return p.reduce((D,z)=>D+z.letters.length,0)},get done(){return _&&p.every(D=>D.letters.length===0)},attach(D){S=D},stop(){_=!0},cancel(){_=!0;const D=s.indexOf(v);D>=0&&(c-=v.letters,s.splice(D,1));for(const z of p)z.letters.length=0,z.trail.length=0;v.dispose()},dispose(){y&&(y.removeFromParent(),y.dispose())},tick(D,z,O,B=!1){if(B||(w+=D),!B&&w>x.duration)if(M&&!_){w-=x.duration;for(const V of p)V.burstsDone=0}else _=!0;if(S&&S.getWorldPosition(m),E.copy(m),Vi.setFromMatrixColumn(O.matrixWorld,0),wo.setFromMatrixColumn(O.matrixWorld,1),nc.setFromMatrixColumn(O.matrixWorld,2),y&&x.light){const V=x.light.fade?tc(x.light.fade,Math.min(1,w/x.duration)):1,j=1+(x.light.flicker??0)*(Math.sin(z*5.3)*.6+Math.sin(z*8.7+.8)*.4);y.intensity=_?0:x.light.intensity*V*j,y.position.copy(E).add(Wi.set(...x.light.offset??[0,1,0]))}for(const V of p)R(V,D,z,O,B)}};function b(D){const z=D.def,O=z.shape??{kind:"point"},B=z.max??600;if(D.letters.length>=B||c>=r)return;const V=O.radius??0;let j=0,W=0,H=0,X=0,Q=1,$=0;switch(O.kind){case"sphere":{const ge=a()*2-1,xe=a()*Math.PI*2,pe=Math.sqrt(1-ge*ge);X=pe*Math.cos(xe),Q=ge,$=pe*Math.sin(xe);const ve=O.surface?V:V*Math.cbrt(a());j=X*ve,W=Q*ve,H=$*ve;break}case"cone":{const ge=a()*Math.PI*2,xe=a()*(O.angle??.4);X=Math.sin(xe)*Math.cos(ge),Q=Math.cos(xe),$=Math.sin(xe)*Math.sin(ge);const pe=a()*V;j=Math.cos(ge)*pe,H=Math.sin(ge)*pe;break}case"ring":{const ge=a()*Math.PI*2,xe=O.surface===!1?V*Math.sqrt(a()):V;X=Math.cos(ge),Q=0,$=Math.sin(ge),j=X*xe,H=$*xe;break}case"box":{const[ge,xe,pe]=O.size??[1,1,1];j=(a()-.5)*ge,W=(a()-.5)*xe,H=(a()-.5)*pe;break}case"line":{const[ge,xe,pe]=O.to??[0,1,0],ve=a();j=ge*ve,W=xe*ve,H=pe*ve;break}}const[Z,ie,fe]=z.offset??[0,0,0],le=ec(z.speed,0,a),[Se,ue,be]=z.velocity??[0,0,0];D.letters.push({x:E.x+Z+j,y:E.y+ie+W,z:E.z+fe+H,vx:X*le+Se,vy:Q*le+ue,vz:$*le+be,age:0,life:Math.max(.05,ec(z.life,1,a)),seed:a(),settled:!1}),c++}function C(D,z,O){const B=Gd(D.glyphs??"."),V=B[Math.min(B.length-1,Math.floor(z*B.length))]??".",j=$u(D.size)?tc(D.size,z):ec(D.size,.16,()=>O),W=Vy(D.color)?Hy(D.color,z):D.color??[1,1,1],H=D.glow??1,X=$u(D.alpha)?tc(D.alpha,z):D.alpha??1;return{glyph:V,size:j,color:[W[0]*H,W[1]*H,W[2]*H],alpha:X}}function R(D,z,O,B,V){const j=D.def,W=j.start??0,H=W+(j.duration??x.duration),X=!_&&w>=W&&w<=H,Q=j.render??"particle";if(Q==="heat"){X&&U(j,O,B);return}if(Q==="beam"){X&&P(j,O);return}if(Q==="flipbook"){X&&k(j,w-W);return}if(Q==="ribbon"){I(D,j,X,!V);return}if(X&&!V){if(j.rate)for(D.carry+=j.rate*z;D.carry>=1;)D.carry--,b(D);if(j.bursts)for(;D.burstsDone<j.bursts.length&&w-W>=j.bursts[D.burstsDone].at;){for(let Se=0;Se<j.bursts[D.burstsDone].count;Se++)b(D);D.burstsDone++}}const $=j.gravity??0,Z=j.drag??0,ie=j.noise??0,fe=j.attract??0,le=j.spin??0;for(let Se=D.letters.length-1;Se>=0;Se--){const ue=D.letters[Se];if(V||(ue.age+=z),!V&&ue.age>=ue.life){D.letters.splice(Se,1),c--;continue}if(!ue.settled&&!V){if(ue.vy-=$*z,ie&&(ue.vx+=(a()-.5)*ie*z,ue.vy+=(a()-.5)*ie*z,ue.vz+=(a()-.5)*ie*z),fe){Wi.set(E.x-ue.x,E.y-ue.y,E.z-ue.z);const pe=Math.max(.1,Wi.length());ue.vx+=Wi.x/pe*fe*z,ue.vy+=Wi.y/pe*fe*z,ue.vz+=Wi.z/pe*fe*z}if(le){const pe=ue.x-E.x,ve=ue.z-E.z,Ce=Math.cos(le*z),ze=Math.sin(le*z);ue.x=E.x+pe*Ce-ve*ze,ue.z=E.z+pe*ze+ve*Ce}const xe=Math.max(0,1-Z*z);ue.vx*=xe,ue.vy*=xe,ue.vz*=xe,ue.x+=ue.vx*z,ue.y+=ue.vy*z,ue.z+=ue.vz*z,j.ground&&ue.y<E.y+.02&&(ue.y=E.y+.02,ue.settled=!0)}const be=ue.age/ue.life,ge=C(j,be,ue.seed);Q==="ring"&&j.ring?T(j,ue,be,ge):Q==="decal"?i.push(ue.x,E.y+.03,ue.z,ge.size,ge.glyph,ge.color,ge.alpha):i.push(ue.x,ue.y,ue.z,ge.size,ge.glyph,ge.color,ge.alpha)}}function T(D,z,O,B){const V=D.ring,j=V.from+(V.to-V.from)*O;for(let W=0;W<V.count;W++){const H=W/V.count*Math.PI*2,X=Math.cos(H),Q=Math.sin(H);let $=B.glyph;if(V.tangent){const Z=X*Vi.x+Q*Vi.z,ie=X*-nc.x+Q*-nc.z;$=Math.abs(ie)>Math.abs(Z)*1.9?ie>0?"-":"_":Math.abs(Z)>Math.abs(ie)*1.9?"|":Z*ie>0?"/":"\\"}i.push(z.x+X*j,z.y,z.z+Q*j,B.size,$,B.color,B.alpha)}}function P(D,z){const O=D.beam??{segments:20},[B,V,j]=D.shape?.to??[0,4,0],[W,H,X]=D.offset??[0,0,0],Q=Math.min(1,w/Math.max(.01,D.duration??x.duration)),$=C(D,Q,.5),Z=Math.floor(z*(O.jitter??24)),ie=O.amplitude??.14;let fe=0,le=0;for(let Se=0;Se<=O.segments;Se++){const ue=Se/O.segments,be=Math.sin(Z*3.1+Se*2.7)*ie;fe+=be*Vi.x,le+=be*Vi.z;const ge=Math.abs(be)<ie*.35?"|":be>0?"/":"\\";i.push(E.x+W+B*ue+fe,E.y+H+V*ue,E.z+X+j*ue+le,$.size,ge,$.color,$.alpha)}}function I(D,z,O,B){const V=z.ribbon??{length:2,spacing:.15},j=D.trail[0];for(B&&O&&(!j||j.distanceTo(E)>=V.spacing)&&D.trail.unshift(E.clone()),B&&!O&&D.trail.length&&D.trail.pop();D.trail.length*V.spacing>V.length;)D.trail.pop();D.trail.forEach((W,H)=>{const X=C(z,H/Math.max(1,D.trail.length-1),.5);i.push(W.x+(z.offset?.[0]??0),W.y+(z.offset?.[1]??0),W.z+(z.offset?.[2]??0),X.size,X.glyph,X.color,X.alpha)})}function U(D,z,O){const B={...th,...D.heat},[V,j,W]=D.offset??[0,0,0],H=B.cols,X=B.rows,[Q,$]=B.cell,Z=Wi.setFromMatrixColumn(O.matrixWorld,0).setY(0).normalize(),ie=Z.x,fe=Z.z,le=new F().setFromMatrixColumn(O.matrixWorld,2).setY(0).normalize().multiplyScalar(B.toward),Se=ue=>ue-Math.floor(ue);for(let ue=0;ue<X;ue++)for(let be=-H;be<=H;be++){const ge=ue/(X-1),xe=(H+.5)*(1-ge*.8)*(.85+.15*Math.sin(z*2.3+ue*.7)),pe=1-Math.abs(be+Math.sin(z*1.7+ue*.45)*ge*1.6)/Math.max(.6,xe);if(pe<=0)continue;const ve=Math.sin(be*1.7+ue*.9-z*7.5)*Math.sin(be*.6-ue*1.3-z*5.1+1.3),Ce=Se(Math.sin((be+13)*12.9+(ue-Math.floor(z*9))*78.2)*43758.5),ze=Math.pow(pe,1.6)*(1-ge*.85)*1.7+ve*.3+Ce*.2-.12;if(ze<.14||ge>.55&&Ce>.8)continue;const Y=Math.min(B.ramp.length-1,Math.floor((1-Math.min(1,ze))*B.ramp.length)),[de,G]=B.ramp[Y];i.push(E.x+V+le.x+ie*be*Q,E.y+j+.2+ue*$,E.z+W+le.z+fe*be*Q,B.letter,de,G,.9+Math.min(.1,ze*.1))}}function k(D,z){const O=D.flipbook;if(!O.frames.length)return;let B=Math.floor(z*O.fps);B=O.loop===!1?Math.min(B,O.frames.length-1):B%O.frames.length;const V=O.frames[B],j=O.colors?.[B],W=V.length,H=Math.max(...V.map(ie=>ie.length)),[X,Q,$]=D.offset??[0,0,0],Z=C(D,.5,.5);for(let ie=0;ie<W;ie++)for(let fe=0;fe<V[ie].length;fe++){const le=V[ie][fe];if(le===" "||!ca.includes(le))continue;const Se=(fe-H/2)*O.cell,ue=(W/2-ie)*O.cell*1.25,be=j?.[ie]?.[fe]??Z.color;O.facing==="ground"?i.push(E.x+X+Se,E.y+Q+.03,E.z+$-ue,Z.size,le,be,Z.alpha):i.push(E.x+X+Vi.x*Se+wo.x*ue,E.y+Q+wo.y*ue+W/2*O.cell*1.25,E.z+$+Vi.z*Se+wo.z*ue,Z.size,le,be,Z.alpha)}}return s.push(v),v}return{library:n,register(...h){for(const f of h)n.set(f.name,f)},play:l,get stats(){return{letters:c,effects:s.length,emitters:s.reduce((h,f)=>h+f.emitterCount,0),budget:r}},get playing(){return s},update(h,f,u,d=!1){for(let g=s.length-1;g>=0;g--){const x=s[g];x.tick(h,f,u,d),!d&&x.done&&(c-=x.letters,x.dispose(),s.splice(g,1))}},stopAll(){for(const h of s)h.stop()},dispose(){for(const h of s)h.dispose();s.length=0,c=0}}}const Wy={actor:"actor",foliage:"foliage",stone:"stone",snow:"snow",bark:"bark",wood:"bark"};function Vd(i,e={}){const t=new Sy({canvas:i,antialias:!1,powerPreference:"high-performance"}),n=e.maxPixelRatio??1.5;t.setPixelRatio(Math.max(1,Math.min(window.devicePixelRatio,n))),t.outputColorSpace=un,t.shadowMap.enabled=!0,t.shadowMap.type=gr,t.clippingPlanes=[new Hn(new F(0,1,0),1e9)];const s=fd(e.style);let r=structuredClone(s);const o=new Cs,a=new Cs,c=new Cs,l=new Cs,h=new qs(-6,6,5,-5,.1,90),f=new mn(1,1),u=new ks(1,1,Nn);f.depthTexture=u;const d=ud(e.hooks);d.material.uniforms.sceneTexture.value=f.texture,d.material.uniforms.sceneDepth.value=f.depthTexture;let g=e.obstacles??[],x=cl({interior:r.interior,obstacles:g});function p(){const Y=x.uniforms.stormFlash.value;x.dispose(),x=cl({interior:r.interior,obstacles:g}),x.uniforms.stormFlash.value=Y,H(d.material.uniforms),H(m);for(const de of S)H(de.uniforms);for(const de of w)H(de.uniforms)}const m=Md(),S=[],w=[],_=[],M=[];let y=[];const E=new Map,v=new WeakMap;let b=11;const C=new Map,R={...r.types},T=new et;T.name="ascii-style-lights";const P=new ng,I=new il;I.castShadow=!0,I.shadow.bias=-.001,I.shadow.normalBias=.04;const U=new il;T.add(P,I,I.target,U),o.add(T);const k={position:Ci.clone(),on:!1},D={position:Ci.clone(),power:1,on:!1},z={hero:null,foe:null,foeHeight:1},O=new F;let B=1,V=1,j=0;function W(){o.background=new Oe(r.background),o.fog=r.fog?new Nl(r.fog.color,r.fog.density):null,P.color.setHex(r.hemisphere.sky),P.groundColor.setHex(r.hemisphere.ground),P.intensity=r.hemisphere.intensity,I.color.setHex(r.moon.color),I.intensity=r.moon.intensity,I.position.set(...r.moon.position),I.shadow.mapSize.set(r.moon.mapSize,r.moon.mapSize);const Y=r.moon.shadowExtent;Object.assign(I.shadow.camera,{left:-Y,right:Y,top:Y,bottom:-Y,far:40}),I.shadow.camera.updateProjectionMatrix(),I.shadow.intensity=r.moon.shadowIntensity,U.color.setHex(r.fill.color),U.intensity=r.fill.intensity,U.position.set(...r.fill.position);for(const de of S)de.uniforms.brightness.value=r.brightness}W();function H(Y){Object.assign(Y,x.uniforms)}H(d.material.uniforms),H(m);const X=new F,Q=new Oe(Zi.moon.color);function $(){B=Math.max(i.clientWidth,1),V=Math.max(i.clientHeight,1),t.setSize(B,V,!1);const Y=t.getDrawingBufferSize(new Ne);f.setSize(Y.x,Y.y);for(const de of w)de.occludeWith(u,Y.x,Y.y);for(const de of M)de.occludeWith(u,Y.x,Y.y);d.material.uniforms.resolution.value.set(B,V)}const Z=new Map;function ie(Y,de,G){let _e=Z.get(Y);_e||Z.set(Y,_e=new Map);let ye=_e.get(de);if(!ye){const N=Y.clone();N.onBeforeCompile=Y.onBeforeCompile,Object.prototype.hasOwnProperty.call(Y,"customProgramCacheKey")&&(N.customProgramCacheKey=Y.customProgramCacheKey),ye=G(N),ye.userData.asciiOriginal=Y,_e.set(de,ye)}return ye}function fe(Y,de,G){Y.userData.asciiOriginal||(Y.userData.asciiOriginal=Y.material);const _e=Y.userData.asciiOriginal;Y.material=Array.isArray(_e)?_e.map(ye=>ie(ye,de,G)):ie(_e,de,G)}function le(Y){const{object:de,options:G}=Y,_e=G.type?R[G.type]:void 0;if(G.type&&!_e)throw new Error(`ascii-engine: unknown object type "${G.type}"`);const ye=new Set([...Object.keys(_e?.parts??{}),...Object.keys(G.parts??{})]),N=new Map,A=[],{type:q,parts:ee,...re}=G,Me=(se,ae,ce,we)=>{if(se.userData.glyphBodyOf||se!==de&&C.has(se))return;se.name&&ye.has(se.name)&&(ae=se.name);const Be=md(se.userData);if(Be&&se.userData.glyphDefault?we={...we,...Be}:Be&&(ce={...ce,...Be}),se instanceof Ye||se instanceof Bs||se instanceof kl){const Ee=pd({defaults:we,global:r.glyphs,type:_e,part:ae,node:ce,instance:re,instanceParts:G.parts});if(!Ee.glyph)A.push(se.name||se.type);else{se.userData.glyphResolved=Ee,se.userData.glyphPart=ae;const Ae=`${ae??""}|${JSON.stringify(Ee)}`;let He=N.get(Ae);He||N.set(Ae,He={style:Ee,meshes:[]}),He.meshes.push(se)}}for(const Ee of[...se.children])Me(Ee,ae,ce,we)};if(Me(de,void 0,void 0,void 0),A.length)throw new Error(`ascii-engine: no declared technique (glyph) on ${A.slice(0,5).join(", ")}`);for(const{style:se,meshes:ae}of N.values())ue(se,ae)}const Se=Y=>![Y.material].flat().some(de=>de instanceof Ht);function ue(Y,de){const G=de.filter(ye=>ye instanceof Ye),_e=ye=>(ye instanceof ut&&(Y.palette?ye.color.setHex(16777215):Y.color!==void 0&&ye.color.setHex(Y.color),Y.emissive!==void 0&&ye.emissive.setHex(Y.emissive),Y.emissiveIntensity!==void 0&&(ye.emissiveIntensity=Y.emissiveIntensity)),ye);switch(Y.glyph){case"surface":for(const ye of G.filter(Se))fe(ye,`surface:${JSON.stringify(Y)}`,N=>N instanceof ut?(_e(N),Y.surface&&(N.userData.asciiSurface=Y.surface),Ld(N,"generic",Y)):N);return;case"screen":for(const ye of G.filter(Se))fe(ye,`screen:${Y.surface??"actor"}:${Y.color??""}`,N=>Pd(_e(N),Y.surface??"actor"));return;case"body":{if(Y.color!==void 0||Y.palette||Y.emissive!==void 0||Y.emissiveIntensity!==void 0)for(const A of G.filter(Se))fe(A,`body-color:${Y.color}:${!!Y.palette}:${Y.emissive}:${Y.emissiveIntensity}`,_e);const ye=Y.surface?Wy[Y.surface]:void 0,N=ye&&ye!=="actor";y.push(...bd(G,m,Y.size??(N?.19:.155),"actor",ye,Y));return}case"carpet":for(const ye of de){if(!S.some(N=>N.mesh===ye))throw new Error("ascii-engine: carpet must come from engine.createCarpet()");a.add(ye)}return;case"particle":for(const ye of de){if(!w.some(N=>N.mesh===ye)&&!M.some(N=>N.mesh===ye))throw new Error("ascii-engine: particle must come from engine.createParticles() or createRainStreaks()");l.add(ye)}return;case"water":for(const ye of de){if(!_.some(N=>N.mesh===ye))throw new Error("ascii-engine: water must come from engine.createWater()");ye.parent||o.add(ye)}return}}function be(Y){const de=[],G=_e=>{if(!(_e!==Y.object&&C.has(_e))){_e instanceof Ye&&de.push(_e);for(const ye of _e.children)G(ye)}};G(Y.object);for(const _e of de)_e.userData.glyphBodyMaterial&&Ad(_e),_e.userData.asciiOriginal&&(_e.material=_e.userData.asciiOriginal,delete _e.userData.asciiOriginal)}let ge,xe,pe=0;const ve={raw:!1},Ce=new wg,ze={debug:ve,renderer:t,scene:o,camera:h,carpetScene:a,waterScene:c,particleScene:l,lights:{hemisphere:P,moon:I,fill:U},get style(){return r},get time(){return j},get dt(){return pe},add(Y,de={}){Y.traverse(ye=>{v.get(ye)?.(),v.delete(ye)});const G={object:Y,options:{...de,parts:{...de.parts}}};!(Y.userData.glyph==="carpet"||Y.userData.glyph==="particle")&&!Y.parent&&o.add(Y);try{le(G),C.set(Y,G)}catch(ye){throw be(G),Y.removeFromParent(),ye}return Y},remove(Y,de={}){de.dispose&&Y.traverse(q=>{v.get(q)?.(),v.delete(q)});const G=new Set;Y.traverse(q=>G.add(q)),Y.traverse(q=>{const ee=C.get(q);ee&&(be(ee),C.delete(q))}),Y.removeFromParent();const _e=new Set,ye=q=>{for(let ee=q.length-1;ee>=0;ee--)if(G.has(q[ee].mesh)){const re=q[ee],Me=E.get(re);E.delete(re),q.splice(ee,1),de.dispose?(re.dispose(),_e.add(re.mesh)):v.set(re.mesh,()=>{q.push(re),Me!==void 0&&E.set(re,Me)})}};if(ye(S),ye(w),ye(M),y=y.filter(q=>q.parent&&!G.has(q.parent)),!de.dispose)return;const N=new Set,A=new Set;Y.traverse(q=>{if(_e.has(q))return;if(q instanceof Ji&&q.dispose(),q instanceof Ye||q instanceof Bs){q.userData.sharedGeometry||N.add(q.geometry);for(const re of Array.isArray(q.material)?q.material:[q.material])A.add(re)}const ee=_.findIndex(re=>re.mesh===q);ee>=0&&(_[ee].dispose(),_.splice(ee,1))}),N.forEach(q=>q.dispose());for(const q of A){if(q.userData.shared)continue;const ee=Z.get(q);ee&&(ee.forEach(re=>re.dispose()),Z.delete(q)),q.dispose()}},setPartStyle(Y,de,G){const _e=C.get(Y);if(!_e)throw new Error("ascii-engine: object was not added with engine.add");_e.options.parts={..._e.options.parts,[de]:{..._e.options.parts?.[de],...G}},be(_e),le(_e)},setInstanceStyle(Y,de){const G=C.get(Y);if(!G)throw new Error("ascii-engine: object was not added with engine.add");G.options={...G.options,...de},be(G),le(G)},setTypeStyle(Y,de){const G=R[Y];R[Y]={style:{...G?.style,...de.style},parts:{...G?.parts}};for(const[_e,ye]of Object.entries(de.parts??{}))R[Y].parts[_e]={...G?.parts?.[_e],...ye};for(const _e of C.values())_e.options.type===Y&&(be(_e),le(_e))},getTypeStyle(Y){return R[Y]},get types(){return R},pick(Y,de){Ce.setFromCamera(new Ne(Y,de),h);for(const G of Ce.intersectObjects(o.children,!0)){if(!(G.object instanceof Ye)||!G.object.visible)continue;let _e=G.object.parent,ye=!1;for(;_e;){if(!_e.visible){ye=!0;break}_e=_e.parent}if(ye)continue;let N=G.object,A;for(;N&&!C.has(N);)!A&&N.name&&(A=N.name),N=N.parent;if(!N)continue;const q=C.get(N);return A===N.name&&(A=void 0),{object:N,node:G.object,part:G.object.userData.glyphPart??A,type:q.options.type,style:G.object.userData.glyphResolved,instance:q.options,point:G.point}}},exportStyle(){return JSON.parse(JSON.stringify({...r,types:R}))},instanceStyle(Y){return C.get(Y)?.options},createCarpet(Y,de=48017){let G=de;const _e=Rd(()=>(G=G*1664525+1013904223>>>0,G/4294967296),Y);return H(_e.uniforms),_e.uniforms.brightness.value=r.brightness,S.push(_e),_e},createParticles(Y=1600){const de=Cd(Y);H(de.uniforms),de.mesh.renderOrder=2,w.push(de);const G=t.getDrawingBufferSize(new Ne);return de.occludeWith(u,G.x,G.y),de},setStyle(Y,de={}){const G=r.interior;if(de.replace)for(const _e of Object.keys(R))delete R[_e];if(r={...de.replace?structuredClone(s):r,...Y},de.replace&&Object.assign(R,r.types),Y.types&&Object.assign(R,Y.types),W(),de.replace||Y.glyphs||Y.types)for(const _e of C.values())be(_e),le(_e);r.interior!==G&&p()},setObstacles(Y){g=Y,p()},setLights(Y){Y.lantern!==void 0&&(k.on=!!Y.lantern,k.position.copy(Y.lantern??Ci)),Y.hearth!==void 0&&(D.on=!!Y.hearth,D.position.copy(Y.hearth??Ci)),Y.hearthPower!==void 0&&(D.power=Y.hearthPower)},setActors(Y){Y.hero!==void 0&&(z.hero=Y.hero),Y.foe!==void 0&&(z.foe=Y.foe),Y.foeHeight!==void 0&&(z.foeHeight=Y.foeHeight)},frame(Y,de,G=Math.PI/7,_e=Math.atan2(18,15)){O.copy(Y);const ye=B/V;h.left=-de*ye,h.right=de*ye,h.top=de,h.bottom=-de;const N=Math.hypot(15,18),A=Math.cos(_e)*N;h.zoom=1,h.near=.1,h.far=90,h.position.set(Y.x+Math.sin(G)*A,Y.y+Math.sin(_e)*N,Y.z+Math.cos(G)*A),h.lookAt(Y),h.updateProjectionMatrix(),h.updateMatrixWorld()},createWater(Y,de){const G=zd(Y,de);return _.push(G),G},addWater(Y){return Y.mesh.userData.glyph="water",_.push(Y),Y},get waters(){return _},createRainStreaks(Y=800){const de=kd(Y);de.mesh.userData.glyph="particle",M.push(de);const G=t.getDrawingBufferSize(new Ne);return de.occludeWith(u,G.x,G.y),de},setGain(Y,de){E.set(Y,de)},get fx(){return ge||(xe=ze.createParticles(8e3),ze.add(xe.mesh,{glyph:"particle"}),ge=Hd(xe,o),ge.register(...e.effects??[])),ge},setFlash(Y){x.uniforms.stormFlash.value=Y},set reflectionRange(Y){b=Y},get size(){return{width:B,height:V}},get resources(){return{objects:C.size,carpets:S.length,particles:w.length,rain:M.length,waters:_.length}},resize:$,render(Y,de={}){(i.clientWidth!==B||i.clientHeight!==V)&&$(),Y=de.redraw?0:zt.clamp(Y,0,.08),j+=Y,h.updateMatrixWorld(),x.place(k.on?k.position:null,D.on?D.position:null),x.update(j,Y);const G=d.material.uniforms;G.cellSize.value=r.cellSize,G.brightness.value=r.brightness,G.inverseProjection.value.copy(h.projectionMatrixInverse),G.cameraWorld.value.copy(h.matrixWorld);const _e=G.contacts.value;if(z.hero?_e[0].set(z.hero.x,z.hero.z,.55,1):_e[0].set(100,100,0,0),z.foe?_e[1].set(z.foe.x,z.foe.z,Math.max(.5,z.foeHeight*.45),1):_e[1].set(100,100,0,0),y=y.filter(se=>se.parent),y.length){o.updateMatrixWorld();for(const se of y)wd(se)}Ed(m,h,V,k.position,k.on?r.bodyLantern:0,D.position,D.on?D.power:0,r.bodyAmbient);const ye=z.hero??new F(100,0,100);for(const se of S)se.update(j,ye,z.foe,h,O,r.inkTint?"moon":r.atmosphere,r.brightness);ge&&xe&&(xe.clear(),ge.update(Y,j,h,de.redraw));const N=x.uniforms,A=r.inkTint??(r.atmosphere==="dusk"?[1.25,.8,.65]:r.atmosphere==="ember"?[1.5,.65,.36]:[1,1,1]);N.atmosphereTint.value.setRGB(A[0],A[1],A[2]),m.sunPower.value=r.bodySceneLighting?r.moon.intensity/Zi.moon.intensity:1,r.bodySceneLighting?(m.sunColor.value.setHex(r.moon.color),m.sunColor.value.r/=Q.r,m.sunColor.value.g/=Q.g,m.sunColor.value.b/=Q.b):m.sunColor.value.setRGB(1,1,1),m.moon.value.set(...r.bodySceneLighting?r.moon.position:Zi.moon.position).normalize(),N.inkFogDensity.value=r.inkFog?r.fog?.density??0:0,N.inkFogColor.value.setHex(r.fog?.color??r.background).convertLinearToSRGB();let q=0;o.updateMatrixWorld(),o.traverseVisible(se=>{!(se instanceof di)||se.intensity<=0||q>=al||(se.getWorldPosition(X),!(k.on&&X.distanceTo(k.position)<1.5||D.on&&X.distanceTo(D.position)<1.5)&&(N.inkLightPosition.value[q].set(X.x,X.y,X.z,se.distance||20),N.inkLightColor.value[q].set(se.color.r,se.color.g,se.color.b,Math.min(8,se.intensity*.25)),q++))}),N.inkLightCount.value=q,pe=Y;for(const se of w)se.commit(V,h,r.brightness*(E.get(se)??1));for(const se of M)se.commit(r.brightness*(E.get(se)??1));const ee=z.hero??O,re=new Map,Me=new na().setFromProjectionMatrix(new Je().multiplyMatrices(h.projectionMatrix,h.matrixWorldInverse));t.autoClear=!0;for(const se of _){if(de.redraw||(z.hero&&se.interact?.("hero",z.hero),z.foe&&se.interact?.("foe",z.foe),se.updateDynamics?.(Y,j)),se.uniforms.time.value=j,se.uniforms.waterViewDirection&&h.getWorldDirection(se.uniforms.waterViewDirection.value).negate(),se.uniforms.waterLightDirection&&(I.getWorldPosition(se.uniforms.waterLightDirection.value),I.target.getWorldPosition(X),se.uniforms.waterLightDirection.value.sub(X).normalize()),se.uniforms.waterLightColor?.value.copy(I.color),se.uniforms.waterLightPower&&(se.uniforms.waterLightPower.value=I.intensity/2.2),se.uniforms.reflectionOn&&(se.uniforms.reflectionOn.value=0),!se.mesh.parent||!se.mesh.visible||!se.look.reflection.enabled||(se.mesh.updateWorldMatrix(!0,!1),!Me.intersectsObject(se.mesh))||se.distance(ee.x,ee.z)>b+(h.right-h.left)/h.zoom)continue;const ae=se.reflectionLevel?.(ee.x,ee.z)??se.mesh.getWorldPosition(X).y;se.mesh.userData.waterReflectionLevel=ae,se.uniforms.waterReflectionLevel&&(se.uniforms.waterReflectionLevel.value=ae);const ce=re.get(ae);ce?.uniforms.reflection&&ce.uniforms.reflectionMatrix&&se.uniforms.reflection&&se.uniforms.reflectionMatrix?(se.uniforms.reflection.value=ce.uniforms.reflection.value,se.uniforms.reflectionMatrix.value.copy(ce.uniforms.reflectionMatrix.value)):(se.reflection.render(t,o,h),re.set(ae,se)),se.uniforms.reflectionOn&&(se.uniforms.reflectionOn.value=1)}if(ve.raw){t.setRenderTarget(null),t.render(o,h);return}t.setRenderTarget(f),t.render(o,h),t.setRenderTarget(null),t.render(d.scene,d.camera),t.autoClear=!1,t.render(a,h),t.render(c,h),t.render(l,h),t.autoClear=!0},dispose(){ge?.dispose();for(const Y of C.values())be(Y);for(const Y of S)Y.dispose();for(const Y of w)Y.dispose();for(const Y of _)Y.dispose();for(const Y of M)Y.dispose();for(const Y of Z.values())for(const de of Y.values())de.dispose();x.dispose(),I.shadow.dispose(),u.dispose(),f.dispose(),d.dispose(),t.dispose()}};return $(),ze}function Wd(i,e=20){const t=Math.max(1,Math.round(i/e)),n=t*e,s=n/(Math.PI*2),r=Math.max(1,Math.round(s*.043)),o=Math.max(2,Math.round(s*.11)),a=Math.max(3,Math.round(s*.27)),c=u=>2.4*Math.sin(r*u)+1.2*Math.sin(o*u+1.3)+.45*Math.sin(a*u+.4),l=u=>2.4*r*Math.cos(r*u)+1.2*o*Math.cos(o*u+1.3)+.45*a*Math.cos(a*u+.4),h=u=>(u%n+n)%n,f=-s;return{length:n,radius:s,chunks:t,chunkLength:e,point(u){const d=h(u)/s,g=s+c(d),x=l(d),p=Math.sin(d),m=Math.cos(d),S=g*p,w=f+g*m;let _=x*p+g*m,M=x*m-g*p;const y=Math.hypot(_,M)||1;return _/=y,M/=y,{x:S,z:w,tx:_,tz:M,nx:p,nz:m}},nearest(u,d){return h(Math.atan2(u,d-f)*s)},offset(u,d){const g=Math.atan2(u,d-f);return Math.hypot(u,d-f)-(s+c(g))},shape:[s,f,r,o,a]}}const Xd=`
  uniform float loopShape[5];
  float trailOffset(vec2 p) {
    vec2 d = vec2(p.x, p.y - loopShape[1]);
    float t = atan(d.x, d.y);
    float w = 2.4 * sin(loopShape[2] * t) + 1.2 * sin(loopShape[3] * t + 1.3) + .45 * sin(loopShape[4] * t + .4);
    return length(d) - (loopShape[0] + w);
  }
`;function $d(i){const e=new Map,t=i.behind??1,n=i.ahead??2;let s=Number.NaN;const r=o=>Number.isFinite(i.count)?(o%i.count+i.count)%i.count:o;return{chunks:e,get current(){return s},update(o){if(o===s)return!1;s=o;const a=new Set;for(let c=-t;c<=n;c++)a.add(r(o+c));for(const[c,l]of e)a.has(c)||(i.dispose(l,c),e.delete(c));for(const c of a)e.has(c)||e.set(c,i.build(c));return!0},ring(o,a){if(!Number.isFinite(i.count))return Math.abs(o-a);const c=i.count;return Math.min(((o-a)%c+c)%c,((a-o)%c+c)%c)},clear(){for(const[o,a]of e)i.dispose(a,o);e.clear(),s=Number.NaN}}}const Fo=i=>{const e=Math.sin(i*127.1+31.7)*43758.5453;return e-Math.floor(e)},qu=i=>i===0?4.2:i*24+3+Fo(i)*6;function qd(i){let e=Math.floor(Math.max(0,i)/24);if(i<qu(e)&&e--,e<0)return;const t=qu(e),n=i-t,s=.8+Fo(e+11)*.2,r=n<.95?Math.min(1,n/.025)*Math.exp(-Math.max(0,n-.065)*5.8)*s:0;return{id:e,at:t,age:n,flash:r,bolt:n<.24?Math.min(1,n/.012)*(1-n/.24):0,thunderAt:t+1.2+Fo(e+71)*1.2,power:s,side:Fo(e+5)>.5?1:-1}}function Yd(i=112,e=24){let t=new Float32Array(i*i),n=new Float32Array(i*i);const s=new Uint8Array(i*i).fill(1),r=e/(i-1),o=1/60,a=(2.6*o/r)**2;let c=0;return{size:i,extent:e,get heights(){return t},setShore(l){for(let h=0;h<i;h++)for(let f=0;f<i;f++){const u=h*i+f;s[u]=Number(l(f*r-e/2,h*r-e/2)),s[u]||(t[u]=n[u]=0)}},disturb(l,h,f,u=.3){const d=(l+e/2)/r,g=(h+e/2)/r,x=Math.ceil(u*2/r);for(let p=Math.max(1,Math.floor(g)-x);p<=Math.min(i-2,Math.ceil(g)+x);p++)for(let m=Math.max(1,Math.floor(d)-x);m<=Math.min(i-2,Math.ceil(d)+x);m++){const S=p*i+m;s[S]&&(t[S]+=Math.exp(-((m-d)**2+(p-g)**2)*r*r/(u*u))*f)}},advance(l){for(c+=Math.min(.1,Math.max(0,l));c+1e-9>=o;){c-=o;for(let f=1;f<i-1;f++)for(let u=1;u<i-1;u++){const d=f*i+u,g=t[d],x=(s[d-1]?t[d-1]:g)+(s[d+1]?t[d+1]:g)+(s[d-i]?t[d-i]:g)+(s[d+i]?t[d+i]:g)-g*4;n[d]=s[d]?Math.max(-2,Math.min(2,(g*2-n[d]+a*x)*.988)):0}const h=n;n=t,t=h}}}}function Yu(i,e){if(e===m0)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),i;if(e===Qc||e===Df){let t=i.getIndex();if(t===null){const r=[],o=i.getAttribute("position");if(o!==void 0){for(let a=0;a<o.count;a++)r.push(a);i.setIndex(r),t=i.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),i}const n=t.count-2,s=[];if(e===Qc)for(let r=1;r<=n;r++)s.push(t.getX(0)),s.push(t.getX(r)),s.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(s.push(t.getX(r)),s.push(t.getX(r+1)),s.push(t.getX(r+2))):(s.push(t.getX(r+2)),s.push(t.getX(r+1)),s.push(t.getX(r)));return s.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),i.setIndex(s),i.clearGroups(),i}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),i}function Kd(i){const e=new Map,t=new Map,n=i.clone();return Jd(i,n,function(s,r){e.set(r,s),t.set(s,r)}),n.traverse(function(s){if(!s.isSkinnedMesh)return;const r=s,o=e.get(s),a=o.skeleton.bones;r.skeleton=o.skeleton.clone(),r.bindMatrix.copy(o.bindMatrix),r.skeleton.bones=a.map(function(c){return t.get(c)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Jd(i,e,t){t(i,e);for(let n=0;n<i.children.length;n++)Jd(i.children[n],e.children[n],t)}class Xy extends $s{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new Jy(t)}),this.register(function(t){return new Zy(t)}),this.register(function(t){return new oM(t)}),this.register(function(t){return new aM(t)}),this.register(function(t){return new cM(t)}),this.register(function(t){return new Qy(t)}),this.register(function(t){return new eM(t)}),this.register(function(t){return new tM(t)}),this.register(function(t){return new nM(t)}),this.register(function(t){return new Ky(t)}),this.register(function(t){return new iM(t)}),this.register(function(t){return new jy(t)}),this.register(function(t){return new rM(t)}),this.register(function(t){return new sM(t)}),this.register(function(t){return new qy(t)}),this.register(function(t){return new Ku(t,at.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ku(t,at.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new lM(t)})}load(e,t,n,s){const r=this;let o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){const l=Sr.extractUrlBase(e);o=Sr.resolveURL(l,this.path)}else o=Sr.extractUrlBase(e);this.manager.itemStart(e);const a=function(l){s?s(l):console.error(l),r.manager.itemError(e),r.manager.itemEnd(e)},c=new Zf(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(this.withCredentials),c.load(e,function(l){try{r.parse(l,o,function(h){t(h),r.manager.itemEnd(e)},a)}catch(h){a(h)}},n,a)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,s){let r;const o={},a={},c=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(c.decode(new Uint8Array(e,0,4))===Zd){try{o[at.KHR_BINARY_GLTF]=new hM(e)}catch(f){s&&s(f);return}r=JSON.parse(o[at.KHR_BINARY_GLTF].content)}else r=JSON.parse(c.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){s&&s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const l=new bM(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});l.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const f=this.pluginCallbacks[h](l);f.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),a[f.name]=f,o[f.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const f=r.extensionsUsed[h],u=r.extensionsRequired||[];switch(f){case at.KHR_MATERIALS_UNLIT:o[f]=new Yy;break;case at.KHR_DRACO_MESH_COMPRESSION:o[f]=new uM(r,this.dracoLoader);break;case at.KHR_TEXTURE_TRANSFORM:o[f]=new fM;break;case at.KHR_MESH_QUANTIZATION:o[f]=new dM;break;default:u.indexOf(f)>=0&&a[f]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+f+'".')}}l.setExtensions(o),l.setPlugins(a),l.parse(n,s)}parseAsync(e,t){const n=this;return new Promise(function(s,r){n.parse(e,t,s,r)})}}function $y(){let i={};return{get:function(e){return i[e]},add:function(e,t){i[e]=t},remove:function(e){delete i[e]},removeAll:function(){i={}}}}function Ut(i,e,t){const n=i.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const at={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class qy{constructor(e){this.parser=e,this.name=at.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,s=t.length;n<s;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let s=t.cache.get(n);if(s)return s;const r=t.json,c=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let l;const h=new Oe(16777215);c.color!==void 0&&h.setRGB(c.color[0],c.color[1],c.color[2],un);const f=c.range!==void 0?c.range:0;switch(c.type){case"directional":l=new il(h),l.target.position.set(0,0,-1),l.add(l.target);break;case"point":l=new di(h),l.distance=f;break;case"spot":l=new sg(h),l.distance=f,c.spot=c.spot||{},c.spot.innerConeAngle=c.spot.innerConeAngle!==void 0?c.spot.innerConeAngle:0,c.spot.outerConeAngle=c.spot.outerConeAngle!==void 0?c.spot.outerConeAngle:Math.PI/4,l.angle=c.spot.outerConeAngle,l.penumbra=1-c.spot.innerConeAngle/c.spot.outerConeAngle,l.target.position.set(0,0,-1),l.add(l.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+c.type)}return l.position.set(0,0,0),Gn(l,c),c.intensity!==void 0&&(l.intensity=c.intensity),l.name=t.createUniqueName(c.name||"light_"+e),s=Promise.resolve(l),t.cache.add(n,s),s}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],a=(r.extensions&&r.extensions[this.name]||{}).light;return a===void 0?null:this._loadLight(a).then(function(c){return n._getNodeRef(t.cache,a,c)})}}class Yy{constructor(){this.name=at.KHR_MATERIALS_UNLIT}getMaterialType(){return Ri}extendParams(e,t,n){const s=[];e.color=new Oe(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],un),e.opacity=o[3]}r.baseColorTexture!==void 0&&s.push(n.assignTexture(e,"map",r.baseColorTexture,Gt))}return Promise.all(s)}}class Ky{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class Jy{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(s.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Ne(r,r)}return Promise.all(s)}}class Zy{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class jy{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(s)}}class Qy{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];if(t.sheenColor=new Oe(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],un)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Gt)),n.sheenRoughnessTexture!==void 0&&s.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(s)}}class eM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&s.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(s)}}class tM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&s.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Oe().setRGB(r[0],r[1],r[2],un),Promise.all(s)}}class nM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_IOR}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class iM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new Oe().setRGB(r[0],r[1],r[2],un),n.specularColorTexture!==void 0&&s.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Gt)),Promise.all(s)}}class sM{constructor(e){this.parser=e,this.name=at.EXT_MATERIALS_BUMP}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&s.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(s)}}class rM{constructor(e){this.parser=e,this.name=at.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?Zn:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const s=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&s.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(s)}}class oM{constructor(e){this.parser=e,this.name=at.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,s=n.textures[e];if(!s.extensions||!s.extensions[this.name])return null;const r=s.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}}class aM{constructor(e){this.parser=e,this.name=at.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}}class cM{constructor(e){this.parser=e,this.name=at.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,s=n.json,r=s.textures[e];if(!r.extensions||!r.extensions[t])return null;const o=r.extensions[t],a=s.images[o.source];let c=n.textureLoader;if(a.uri){const l=n.options.manager.getHandler(a.uri);l!==null&&(c=l)}return n.loadTextureImage(e,o.source,c)}}class Ku{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const s=n.extensions[this.name],r=this.parser.getDependency("buffer",s.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(a){const c=s.byteOffset||0,l=s.byteLength||0,h=s.count,f=s.byteStride,u=new Uint8Array(a,c,l);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(h,f,u,s.mode,s.filter).then(function(d){return d.buffer}):o.ready.then(function(){const d=new ArrayBuffer(h*f);return o.decodeGltfBuffer(new Uint8Array(d),h,f,u,s.mode,s.filter),d})})}else return null}}class lM{constructor(e){this.name=at.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const s=t.meshes[n.mesh];for(const l of s.primitives)if(l.mode!==Mn.TRIANGLES&&l.mode!==Mn.TRIANGLE_STRIP&&l.mode!==Mn.TRIANGLE_FAN&&l.mode!==void 0)return null;const o=n.extensions[this.name].attributes,a=[],c={};for(const l in o)a.push(this.parser.getDependency("accessor",o[l]).then(h=>(c[l]=h,c[l])));return a.length<1?null:(a.push(this.parser.createNodeMesh(e)),Promise.all(a).then(l=>{const h=l.pop(),f=h.isGroup?h.children:[h],u=l[0].count,d=[];for(const g of f){const x=new Je,p=new F,m=new En,S=new F(1,1,1),w=new Ji(g.geometry,g.material,u);for(let M=0;M<u;M++)c.TRANSLATION&&p.fromBufferAttribute(c.TRANSLATION,M),c.ROTATION&&m.fromBufferAttribute(c.ROTATION,M),c.SCALE&&S.fromBufferAttribute(c.SCALE,M),w.setMatrixAt(M,x.compose(p,m,S));let _=null;for(const M in c)if(M==="_COLOR_0"){const y=c[M];w.instanceColor=new Ki(y.array,y.itemSize,y.normalized)}else if(M!=="TRANSLATION"&&M!=="ROTATION"&&M!=="SCALE"){if(_===null){const E=w.geometry;_=new Tt,_.name=E.name;for(const v in E.attributes)_.setAttribute(v,E.attributes[v]);for(const v in E.morphAttributes)_.morphAttributes[v]=E.morphAttributes[v];E.index!==null&&_.setIndex(E.index),_.morphTargetsRelative=E.morphTargetsRelative;for(const v of E.groups)_.addGroup(v.start,v.count,v.materialIndex);E.boundingBox!==null&&(_.boundingBox=E.boundingBox.clone()),E.boundingSphere!==null&&(_.boundingSphere=E.boundingSphere.clone()),_.drawRange.start=E.drawRange.start,_.drawRange.count=E.drawRange.count,_.userData=Object.assign({},E.userData),w.geometry=_}const y=c[M];_.setAttribute(M,new Ki(y.array,y.itemSize,y.normalized))}bt.prototype.copy.call(w,g),this.parser.assignFinalMaterial(w),d.push(w)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}}const Zd="glTF",cr=12,Ju={JSON:1313821514,BIN:5130562};class hM{constructor(e){this.name=at.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,cr),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Zd)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const s=this.header.length-cr,r=new DataView(e,cr);let o=0;for(;o<s;){const a=r.getUint32(o,!0);o+=4;const c=r.getUint32(o,!0);if(o+=4,c===Ju.JSON){const l=new Uint8Array(e,cr+o,a);this.content=n.decode(l)}else if(c===Ju.BIN){const l=cr+o;this.body=e.slice(l,l+a)}o+=a}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class uM{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=at.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,s=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,a={},c={},l={};for(const h in o){const f=hl[h]||h.toLowerCase();a[f]=o[h]}for(const h in e.attributes){const f=hl[h]||h.toLowerCase();if(o[h]!==void 0){const u=n.accessors[e.attributes[h]],d=Us[u.componentType];l[f]=d.name,c[f]=u.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(f,u){s.decodeDracoFile(h,function(d){for(const g in d.attributes){const x=d.attributes[g],p=c[g];p!==void 0&&(x.normalized=p)}f(d)},a,l,un,u)})})}}class fM{constructor(){this.name=at.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){const n=Math.cos(e.rotation),s=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*s,e.offset.x,-e.repeat.x*s,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class dM{constructor(){this.name=at.KHR_MESH_QUANTIZATION}}class jd extends Vs{constructor(e,t,n,s){super(e,t,n,s)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=e*s*3+s;for(let o=0;o!==s;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,s){const r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=a*2,l=a*3,h=s-t,f=(n-t)/h,u=f*f,d=u*f,g=e*l,x=g-l,p=-2*d+3*u,m=d-u,S=1-p,w=m-u+f;for(let _=0;_!==a;_++){const M=o[x+_+a],y=o[x+_+c]*h,E=o[g+_+a],v=o[g+_]*h;r[_]=S*M+w*y+p*E+m*v}return r}}const pM=new En;class mM extends jd{interpolate_(e,t,n,s){const r=super.interpolate_(e,t,n,s);return pM.fromArray(r).normalize().toArray(r),r}}const Mn={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Us={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Zu={9728:Bt,9729:ft,9984:Af,9985:Co,9986:fr,9987:wn},ju={33071:Wn,33648:Go,10497:es},ic={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},hl={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},bi={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},gM={CUBICSPLINE:void 0,LINEAR:Cr,STEP:Rr},sc={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function xM(i){return i.DefaultMaterial===void 0&&(i.DefaultMaterial=new ut({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Ii})),i.DefaultMaterial}function Xi(i,e,t){for(const n in t.extensions)i[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Gn(i,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(i.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function vM(i,e,t){let n=!1,s=!1,r=!1;for(let l=0,h=e.length;l<h;l++){const f=e[l];if(f.POSITION!==void 0&&(n=!0),f.NORMAL!==void 0&&(s=!0),f.COLOR_0!==void 0&&(r=!0),n&&s&&r)break}if(!n&&!s&&!r)return Promise.resolve(i);const o=[],a=[],c=[];for(let l=0,h=e.length;l<h;l++){const f=e[l];if(n){const u=f.POSITION!==void 0?t.getDependency("accessor",f.POSITION):i.attributes.position;o.push(u)}if(s){const u=f.NORMAL!==void 0?t.getDependency("accessor",f.NORMAL):i.attributes.normal;a.push(u)}if(r){const u=f.COLOR_0!==void 0?t.getDependency("accessor",f.COLOR_0):i.attributes.color;c.push(u)}}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c)]).then(function(l){const h=l[0],f=l[1],u=l[2];return n&&(i.morphAttributes.position=h),s&&(i.morphAttributes.normal=f),r&&(i.morphAttributes.color=u),i.morphTargetsRelative=!0,i})}function _M(i,e){if(i.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)i.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(i.morphTargetInfluences.length===t.length){i.morphTargetDictionary={};for(let n=0,s=t.length;n<s;n++)i.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function yM(i){let e;const t=i.extensions&&i.extensions[at.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+rc(t.attributes):e=i.indices+":"+rc(i.attributes)+":"+i.mode,i.targets!==void 0)for(let n=0,s=i.targets.length;n<s;n++)e+=":"+rc(i.targets[n]);return e}function rc(i){let e="";const t=Object.keys(i).sort();for(let n=0,s=t.length;n<s;n++)e+=t[n]+":"+i[t[n]]+";";return e}function ul(i){switch(i){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function MM(i){return i.search(/\.jpe?g($|\?)/i)>0||i.search(/^data\:image\/jpeg/)===0?"image/jpeg":i.search(/\.webp($|\?)/i)>0||i.search(/^data\:image\/webp/)===0?"image/webp":i.search(/\.ktx2($|\?)/i)>0||i.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const SM=new Je;class bM{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new $y,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,s=-1,r=!1,o=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const a=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(a)===!0;const c=a.match(/Version\/(\d+)/);s=n&&c?parseInt(c[1],10):-1,r=a.indexOf("Firefox")>-1,o=r?a.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&s<17||r&&o<98?this.textureLoader=new tg(this.options.manager):this.textureLoader=new cg(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Zf(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,s=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){const a={scene:o[0][s.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:s.asset,parser:n,userData:{}};return Xi(r,a,s),Gn(a,s),Promise.all(n._invokeAll(function(c){return c.afterRoot&&c.afterRoot(a)})).then(function(){for(const c of a.scenes)c.updateMatrixWorld();e(a)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let s=0,r=t.length;s<r;s++){const o=t[s].joints;for(let a=0,c=o.length;a<c;a++)e[o[a]].isBone=!0}for(let s=0,r=e.length;s<r;s++){const o=e[s];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const s=n.clone(),r=(o,a)=>{const c=this.associations.get(o);c!=null&&this.associations.set(a,c);for(const[l,h]of o.children.entries())r(h,a.children[l])};return r(n,s),s.name+="_instance_"+e.uses[t]++,s}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const s=e(t[n]);if(s)return s}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let s=0;s<t.length;s++){const r=e(t[s]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let s=this.cache.get(n);if(!s){switch(e){case"scene":s=this.loadScene(t);break;case"node":s=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":s=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":s=this.loadAccessor(t);break;case"bufferView":s=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":s=this.loadBuffer(t);break;case"material":s=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":s=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":s=this.loadSkin(t);break;case"animation":s=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":s=this.loadCamera(t);break;default:if(s=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!s)throw new Error("Unknown type: "+e);break}this.cache.add(n,s)}return s}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,s=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(s.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[at.KHR_BINARY_GLTF].body);const s=this.options;return new Promise(function(r,o){n.load(Sr.resolveURL(t.uri,s.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const s=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+s)})}loadAccessor(e){const t=this,n=this.json,s=this.json.accessors[e];if(s.bufferView===void 0&&s.sparse===void 0){const o=ic[s.type],a=Us[s.componentType],c=s.normalized===!0,l=new a(s.count*o);return Promise.resolve(new Nt(l,o,c))}const r=[];return s.bufferView!==void 0?r.push(this.getDependency("bufferView",s.bufferView)):r.push(null),s.sparse!==void 0&&(r.push(this.getDependency("bufferView",s.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",s.sparse.values.bufferView))),Promise.all(r).then(function(o){const a=o[0],c=ic[s.type],l=Us[s.componentType],h=l.BYTES_PER_ELEMENT,f=h*c,u=s.byteOffset||0,d=s.bufferView!==void 0?n.bufferViews[s.bufferView].byteStride:void 0,g=s.normalized===!0;let x,p;if(d&&d!==f){const m=Math.floor(u/d),S="InterleavedBuffer:"+s.bufferView+":"+s.componentType+":"+m+":"+s.count;let w=t.cache.get(S);w||(x=new l(a,m*d,s.count*d/h),w=new cm(x,d/h),t.cache.add(S,w)),p=new Ul(w,c,u%d/h,g)}else a===null?x=new l(s.count*c):x=new l(a,u,s.count*c),p=new Nt(x,c,g);if(s.sparse!==void 0){const m=ic.SCALAR,S=Us[s.sparse.indices.componentType],w=s.sparse.indices.byteOffset||0,_=s.sparse.values.byteOffset||0,M=new S(o[1],w,s.sparse.count*m),y=new l(o[2],_,s.sparse.count*c);a!==null&&(p=new Nt(p.array.slice(),p.itemSize,p.normalized)),p.normalized=!1;for(let E=0,v=M.length;E<v;E++){const b=M[E];if(p.setX(b,y[E*c]),c>=2&&p.setY(b,y[E*c+1]),c>=3&&p.setZ(b,y[E*c+2]),c>=4&&p.setW(b,y[E*c+3]),c>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}p.normalized=g}return p})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r];let a=this.textureLoader;if(o.uri){const c=n.manager.getHandler(o.uri);c!==null&&(a=c)}return this.loadTextureImage(e,r,a)}loadTextureImage(e,t,n){const s=this,r=this.json,o=r.textures[e],a=r.images[t],c=(a.uri||a.bufferView)+":"+o.sampler;if(this.textureCache[c])return this.textureCache[c];const l=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=o.name||a.name||"",h.name===""&&typeof a.uri=="string"&&a.uri.startsWith("data:image/")===!1&&(h.name=a.uri);const u=(r.samplers||{})[o.sampler]||{};return h.magFilter=Zu[u.magFilter]||ft,h.minFilter=Zu[u.minFilter]||wn,h.wrapS=ju[u.wrapS]||es,h.wrapT=ju[u.wrapT]||es,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Bt&&h.minFilter!==ft,s.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[c]=l,l}loadImageSource(e,t){const n=this,s=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());const o=s.images[e],a=self.URL||self.webkitURL;let c=o.uri||"",l=!1;if(o.bufferView!==void 0)c=n.getDependency("bufferView",o.bufferView).then(function(f){l=!0;const u=new Blob([f],{type:o.mimeType});return c=a.createObjectURL(u),c});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(c).then(function(f){return new Promise(function(u,d){let g=u;t.isImageBitmapLoader===!0&&(g=function(x){const p=new kt(x);p.needsUpdate=!0,u(p)}),t.load(Sr.resolveURL(f,r.path),g,void 0,d)})}).then(function(f){return l===!0&&a.revokeObjectURL(c),Gn(f,o),f.userData.mimeType=o.mimeType||MM(o.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",c),f});return this.sourceCache[e]=h,h}assignTexture(e,t,n,s){const r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[at.KHR_TEXTURE_TRANSFORM]){const a=n.extensions!==void 0?n.extensions[at.KHR_TEXTURE_TRANSFORM]:void 0;if(a){const c=r.associations.get(o);o=r.extensions[at.KHR_TEXTURE_TRANSFORM].extendTexture(o,a),r.associations.set(o,c)}}return s!==void 0&&(o.colorSpace=s),e[t]=o,o})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const s=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){const a="PointsMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new Gf,qn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,c.sizeAttenuation=!1,this.cache.add(a,c)),n=c}else if(e.isLine){const a="LineBasicMaterial:"+n.uuid;let c=this.cache.get(a);c||(c=new kf,qn.prototype.copy.call(c,n),c.color.copy(n.color),c.map=n.map,this.cache.add(a,c)),n=c}if(s||r||o){let a="ClonedMaterial:"+n.uuid+":";s&&(a+="derivative-tangents:"),r&&(a+="vertex-colors:"),o&&(a+="flat-shading:");let c=this.cache.get(a);c||(c=n.clone(),r&&(c.vertexColors=!0),o&&(c.flatShading=!0),s&&(c.normalScale&&(c.normalScale.y*=-1),c.clearcoatNormalScale&&(c.clearcoatNormalScale.y*=-1)),this.cache.add(a,c),this.associations.set(c,this.associations.get(n))),n=c}e.material=n}getMaterialType(){return ut}loadMaterial(e){const t=this,n=this.json,s=this.extensions,r=n.materials[e];let o;const a={},c=r.extensions||{},l=[];if(c[at.KHR_MATERIALS_UNLIT]){const f=s[at.KHR_MATERIALS_UNLIT];o=f.getMaterialType(),l.push(f.extendParams(a,r,t))}else{const f=r.pbrMetallicRoughness||{};if(a.color=new Oe(1,1,1),a.opacity=1,Array.isArray(f.baseColorFactor)){const u=f.baseColorFactor;a.color.setRGB(u[0],u[1],u[2],un),a.opacity=u[3]}f.baseColorTexture!==void 0&&l.push(t.assignTexture(a,"map",f.baseColorTexture,Gt)),a.metalness=f.metallicFactor!==void 0?f.metallicFactor:1,a.roughness=f.roughnessFactor!==void 0?f.roughnessFactor:1,f.metallicRoughnessTexture!==void 0&&(l.push(t.assignTexture(a,"metalnessMap",f.metallicRoughnessTexture)),l.push(t.assignTexture(a,"roughnessMap",f.metallicRoughnessTexture))),o=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),l.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,a)})))}r.doubleSided===!0&&(a.side=Sn);const h=r.alphaMode||sc.OPAQUE;if(h===sc.BLEND?(a.transparent=!0,a.depthWrite=!1):(a.transparent=!1,h===sc.MASK&&(a.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Ri&&(l.push(t.assignTexture(a,"normalMap",r.normalTexture)),a.normalScale=new Ne(1,1),r.normalTexture.scale!==void 0)){const f=r.normalTexture.scale;a.normalScale.set(f,f)}if(r.occlusionTexture!==void 0&&o!==Ri&&(l.push(t.assignTexture(a,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(a.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Ri){const f=r.emissiveFactor;a.emissive=new Oe().setRGB(f[0],f[1],f[2],un)}return r.emissiveTexture!==void 0&&o!==Ri&&l.push(t.assignTexture(a,"emissiveMap",r.emissiveTexture,Gt)),Promise.all(l).then(function(){const f=new o(a);return r.name&&(f.name=r.name),Gn(f,r),t.associations.set(f,{materials:e}),r.extensions&&Xi(s,f,r),f})}createUniqueName(e){const t=vt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,s=this.primitiveCache;function r(a){return n[at.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a,t).then(function(c){return Qu(c,a,t)})}const o=[];for(let a=0,c=e.length;a<c;a++){const l=e[a],h=yM(l),f=s[h];if(f)o.push(f.promise);else{let u;l.extensions&&l.extensions[at.KHR_DRACO_MESH_COMPRESSION]?u=r(l):u=Qu(new Tt,l,t),l.mode===Mn.TRIANGLE_STRIP?u=u.then(d=>Yu(d,Df)):l.mode===Mn.TRIANGLE_FAN&&(u=u.then(d=>Yu(d,Qc))),s[h]={primitive:l,promise:u},o.push(u)}}return Promise.all(o)}loadMesh(e){const t=this,n=this.json,s=this.extensions,r=n.meshes[e],o=r.primitives,a=[];for(let c=0,l=o.length;c<l;c++){const h=o[c].material===void 0?xM(this.cache):this.getDependency("material",o[c].material);a.push(h)}return a.push(t.loadGeometries(o)),Promise.all(a).then(async function(c){const l=c.slice(0,c.length-1),h=c[c.length-1],f=[];for(let d=0,g=h.length;d<g;d++){const x=h[d],p=o[d];let m;const S=l[d];if(p.mode===Mn.TRIANGLES||p.mode===Mn.TRIANGLE_STRIP||p.mode===Mn.TRIANGLE_FAN||p.mode===void 0){const w=r.isSkinnedMesh===!0,_=x.hasAttribute("skinIndex")&&x.hasAttribute("skinWeight");w&&_===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),m=w&&_?new Fl(x,S):new Ye(x,S),m.isSkinnedMesh===!0&&m.normalizeSkinWeights()}else if(p.mode===Mn.LINES)m=new kl(x,S);else if(p.mode===Mn.LINE_STRIP)m=new Bl(x,S);else if(p.mode===Mn.LINE_LOOP)m=new xm(x,S);else if(p.mode===Mn.POINTS)m=new Bs(x,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+p.mode);Object.keys(m.geometry.morphAttributes).length>0&&_M(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),Gn(m,r),p.extensions&&Xi(s,m,p),t.assignFinalMaterial(m),f.push(m)}for(let d=0,g=f.length;d<g;d++)t.associations.set(f[d],{meshes:e,primitives:d});if(f.length===1)return r.extensions&&Xi(s,f[0],r),f[0];const u=new et;r.extensions&&Xi(s,u,r),t.associations.set(u,{meshes:e});for(let d=0,g=f.length;d<g;d++)u.add(f[d]);return u})}loadCamera(e){let t;const n=this.json.cameras[e],s=n[n.type];if(!s){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new an(zt.radToDeg(s.yfov),s.aspectRatio||1,s.znear||1,s.zfar||2e6):n.type==="orthographic"&&(t=new qs(-s.xmag,s.xmag,s.ymag,-s.ymag,s.znear,s.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Gn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let s=0,r=t.joints.length;s<r;s++)n.push(this._loadNodeShallow(t.joints[s]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(s){const r=s.pop(),o=s,a=[],c=[];for(let l=0,h=o.length;l<h;l++){const f=o[l];if(f){a.push(f);const u=new Je;r!==null&&u.fromArray(r.array,l*16),c.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[l])}return new zl(a,c)})}loadAnimation(e){const t=this.json,n=this,s=t.animations[e],r=s.name?s.name:"animation_"+e,o=[],a=[],c=[],l=[],h=[];for(let f=0,u=s.channels.length;f<u;f++){const d=s.channels[f],g=s.samplers[d.sampler],x=d.target,p=x.node,m=s.parameters!==void 0?s.parameters[g.input]:g.input,S=s.parameters!==void 0?s.parameters[g.output]:g.output;x.node!==void 0&&(o.push(this.getDependency("node",p)),a.push(this.getDependency("accessor",m)),c.push(this.getDependency("accessor",S)),l.push(g),h.push(x))}return Promise.all([Promise.all(o),Promise.all(a),Promise.all(c),Promise.all(l),Promise.all(h)]).then(function(f){const u=f[0],d=f[1],g=f[2],x=f[3],p=f[4],m=[];for(let w=0,_=u.length;w<_;w++){const M=u[w],y=d[w],E=g[w],v=x[w],b=p[w];if(M===void 0)continue;M.updateMatrix&&M.updateMatrix();const C=n._createAnimationTracks(M,y,E,v,b);if(C)for(let R=0;R<C.length;R++)m.push(C[R])}const S=new nl(r,void 0,m);return Gn(S,s),S})}createNodeMesh(e){const t=this.json,n=this,s=t.nodes[e];return s.mesh===void 0?null:n.getDependency("mesh",s.mesh).then(function(r){const o=n._getNodeRef(n.meshCache,s.mesh,r);return s.weights!==void 0&&o.traverse(function(a){if(a.isMesh)for(let c=0,l=s.weights.length;c<l;c++)a.morphTargetInfluences[c]=s.weights[c]}),o})}loadNode(e){const t=this.json,n=this,s=t.nodes[e],r=n._loadNodeShallow(e),o=[],a=s.children||[];for(let l=0,h=a.length;l<h;l++)o.push(n.getDependency("node",a[l]));const c=s.skin===void 0?Promise.resolve(null):n.getDependency("skin",s.skin);return Promise.all([r,Promise.all(o),c]).then(function(l){const h=l[0],f=l[1],u=l[2];u!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(u,SM)});for(let d=0,g=f.length;d<g;d++)h.add(f[d]);if(h.userData.pivot!==void 0&&f.length>0){const d=h.userData.pivot,g=f[0];h.pivot=new F().fromArray(d),h.position.x-=d[0],h.position.y-=d[1],h.position.z-=d[2],g.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,s=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],o=r.name?s.createUniqueName(r.name):"",a=[],c=s._invokeOne(function(l){return l.createNodeMesh&&l.createNodeMesh(e)});return c&&a.push(c),r.camera!==void 0&&a.push(s.getDependency("camera",r.camera).then(function(l){return s._getNodeRef(s.cameraCache,r.camera,l)})),s._invokeAll(function(l){return l.createNodeAttachment&&l.createNodeAttachment(e)}).forEach(function(l){a.push(l)}),this.nodeCache[e]=Promise.all(a).then(function(l){let h;if(r.isBone===!0?h=new Ol:l.length>1?h=new et:l.length===1?h=l[0]:h=new bt,h!==l[0])for(let f=0,u=l.length;f<u;f++)h.add(l[f]);if(r.name&&(h.userData.name=r.name,h.name=o),Gn(h,r),r.extensions&&Xi(n,h,r),r.matrix!==void 0){const f=new Je;f.fromArray(r.matrix),h.applyMatrix4(f)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!s.associations.has(h))s.associations.set(h,{});else if(r.mesh!==void 0&&s.meshCache.refs[r.mesh]>1){const f=s.associations.get(h);s.associations.set(h,{...f})}return s.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],s=this,r=new et;n.name&&(r.name=s.createUniqueName(n.name)),Gn(r,n),n.extensions&&Xi(t,r,n);const o=n.nodes||[],a=[];for(let c=0,l=o.length;c<l;c++)a.push(s.getDependency("node",o[c]));return Promise.all(a).then(function(c){for(let h=0,f=c.length;h<f;h++){const u=c[h];u.parent!==null?r.add(Kd(u)):r.add(u)}const l=h=>{const f=new Map;for(const[u,d]of s.associations)(u instanceof qn||u instanceof kt)&&f.set(u,d);return h.traverse(u=>{const d=s.associations.get(u);d!=null&&f.set(u,d)}),f};return s.associations=l(r),r})}_createAnimationTracks(e,t,n,s,r){const o=[],a=e.name?e.name:e.uuid,c=[];function l(d){d.morphTargetInfluences&&c.push(d.name?d.name:d.uuid)}bi[r.path]===bi.weights?(l(e),e.isGroup&&e.children.forEach(l)):c.push(a);let h;switch(bi[r.path]){case bi.weights:h=Lr;break;case bi.rotation:h=Dr;break;case bi.translation:case bi.scale:h=Jo;break;default:switch(n.itemSize){case 1:h=Lr;break;case 2:case 3:default:h=Jo;break}break}const f=s.interpolation!==void 0?gM[s.interpolation]:Cr,u=this._getArrayFromAccessor(n);for(let d=0,g=c.length;d<g;d++){const x=new h(c[d]+"."+bi[r.path],t.array,u,f);s.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(x),o.push(x)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=ul(t.constructor),s=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)s[r]=t[r]*n;t=s}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const s=this instanceof Dr?mM:jd;return new s(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function wM(i,e,t){const n=e.attributes,s=new Kn;if(n.POSITION!==void 0){const a=t.json.accessors[n.POSITION],c=a.min,l=a.max;if(c!==void 0&&l!==void 0){if(s.set(new F(c[0],c[1],c[2]),new F(l[0],l[1],l[2])),a.normalized){const h=ul(Us[a.componentType]);s.min.multiplyScalar(h),s.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const a=new F,c=new F;for(let l=0,h=r.length;l<h;l++){const f=r[l];if(f.POSITION!==void 0){const u=t.json.accessors[f.POSITION],d=u.min,g=u.max;if(d!==void 0&&g!==void 0){if(c.setX(Math.max(Math.abs(d[0]),Math.abs(g[0]))),c.setY(Math.max(Math.abs(d[1]),Math.abs(g[1]))),c.setZ(Math.max(Math.abs(d[2]),Math.abs(g[2]))),u.normalized){const x=ul(Us[u.componentType]);c.multiplyScalar(x)}a.max(c)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}s.expandByVector(a)}i.boundingBox=s;const o=new Jn;s.getCenter(o.center),o.radius=s.min.distanceTo(s.max)/2,i.boundingSphere=o}function Qu(i,e,t){const n=e.attributes,s=[];function r(o,a){return t.getDependency("accessor",o).then(function(c){i.setAttribute(a,c)})}for(const o in n){const a=hl[o]||o.toLowerCase();a in i.attributes||s.push(r(n[o],a))}if(e.indices!==void 0&&!i.index){const o=t.getDependency("accessor",e.indices).then(function(a){i.setIndex(a)});s.push(o)}return ht.workingColorSpace!==un&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ht.workingColorSpace}" not supported.`),Gn(i,e),wM(i,e,t),Promise.all(s).then(function(){return e.targets!==void 0?vM(i,e.targets,t):i})}const EM=["screen","surface","body","carpet","particle","water"],AM=["reflection","snow","bark","wetgrass","wood","actor","stone","foliage","water","earth","glyph"];function Qd(i){let e={};const t=i.glyphStyle??i.glyph_style;if(typeof t=="string")try{e=JSON.parse(t)}catch{}else t&&typeof t=="object"&&(e={...t});const n=i.glyph_surface??i.glyphSurface;typeof n=="string"&&AM.includes(n)&&(e.surface=n);const s=Number(i.glyph_size??i.glyphSize);Number.isFinite(s)&&s>0&&(e.size=s);const r=typeof i.glyph=="string"?i.glyph.toLowerCase():void 0;return r&&EM.includes(r)?i.glyph=r:delete i.glyph,Object.keys(e).length?i.glyphStyle=e:delete i.glyphStyle,i}const TM=[[/leaf|leaves|foliage|crown|copa|folha|bush|arbusto|moss|musgo|grass|grama|reed|junco/i,"foliage"],[/bark|trunk|tronco|branch|galho|casca/i,"bark"],[/wood|plank|tabua|tábua|madeira|crate|caixa|fence|cerca|bridge|ponte|beam|viga/i,"wood"],[/rock|stone|pedra|rocha|boulder|wall|muro|brick|tijolo|crystal|cristal/i,"stone"],[/ground|floor|terrain|chao|chão|terra|soil|dirt/i,"earth"],[/snow|neve|ice|gelo/i,"snow"]];function ep(i){const e=[i.name,i.parent?.name??"",...[i.material].flat().map(r=>r.name)].join(" "),t=TM.find(([r])=>r.test(e))?.[1];if(i instanceof Fl)return{glyph:"body",surface:t??"actor",size:.155};const n=i.geometry,s=n instanceof ss||n instanceof gn||n instanceof Ni;return t==="foliage"||t==="snow"||s?{glyph:"body",surface:t??"stone",size:.19}:{glyph:"surface",surface:t}}function tp(i){const e=(t,n)=>{Qd(t.userData);const s=n||!!t.userData.glyph;if(!s&&t instanceof Ye){const r=ep(t);t.userData.glyph=r.glyph;const{glyph:o,...a}=r;t.userData.glyphStyle={...a,...t.userData.glyphStyle},t.userData.glyphDefault=!0}for(const r of t.children)e(r,s)};return e(i,!1),i}function nh(i,e=[]){tp(i),i.traverse(s=>{s instanceof Ye&&(s.castShadow=!0,s.receiveShadow=!0)});const t=[];i.traverse(s=>{s!==i&&s.name&&!(s instanceof Ol)&&t.push(s.name)});const n=new bg(i);for(const s of e)n.clipAction(s).play();return{scene:i,animations:e,mixer:n,parts:t,update:s=>n.update(s)}}async function np(i){const e=new Xy,t=typeof i=="string"?await e.loadAsync(i):await e.parseAsync(i,"");return nh(t.scene,t.animations)}const ip=[{name:"musgo",color:3955238,grass:1},{name:"terra",color:6182211,grass:.08},{name:"pedra",color:6120032,grass:0},{name:"neve",color:12175825,grass:0}];function sp(i=32,e=129,t=ip){const n=e*e,s=new Array(n*4).fill(0);for(let r=0;r<n;r++)s[r*4]=255;return{size:i,resolution:e,heights:new Array(n).fill(0),paint:s,layers:t.map(r=>({...r}))}}const RM=i=>{const e=Math.max(0,1-i);return e*e*(3-2*e)};function rp(i=sp()){const{size:e,resolution:t}=i,n=e/(t-1),s=new xn(e,e,t-1,t-1);s.rotateX(-Math.PI/2);const r=new Float32Array(t*t*3);s.setAttribute("color",new Nt(r,3));const o=new ut({vertexColors:!0,roughness:1,color:16777215}),a=new Ye(s,o);a.receiveShadow=!0,a.castShadow=!0,a.name="terrain",a.userData.glyph="surface",a.userData.glyphStyle={surface:"earth"};const c=()=>i.layers.map(p=>new Oe(p.color));let l=c();const h=(p,m)=>m*t+p,f=(p,m)=>({x:-e/2+p*n,z:-e/2+m*n});function u(p=0,m=t*t){const S=s.attributes.position,w=new Oe;for(let _=p;_<m;_++){S.setY(_,i.heights[_]),w.setRGB(0,0,0);let M=0;for(let y=0;y<4&&y<l.length;y++)M+=i.paint[_*4+y];for(let y=0;y<4&&y<l.length;y++){const E=i.paint[_*4+y]/Math.max(1,M);w.r+=l[y].r*E,w.g+=l[y].g*E,w.b+=l[y].b*E}r[_*3]=w.r,r[_*3+1]=w.g,r[_*3+2]=w.b}S.needsUpdate=!0,s.attributes.color.needsUpdate=!0,s.computeVertexNormals(),s.computeBoundingSphere(),s.computeBoundingBox()}u();function d(p,m){const S=zt.clamp((p+e/2)/n,0,t-1.001),w=zt.clamp((m+e/2)/n,0,t-1.001),_=Math.floor(S),M=Math.floor(w),y=S-_,E=w-M,v=i.heights,b=v[h(_,M)],C=v[h(_+1,M)],R=v[h(_,M+1)],T=v[h(_+1,M+1)];return(b*(1-y)+C*y)*(1-E)+(R*(1-y)+T*y)*E}function g(p,m){const S=Math.round(zt.clamp((p+e/2)/n,0,t-1)),w=Math.round(zt.clamp((m+e/2)/n,0,t-1)),_=h(S,w);let M=0;for(let y=1;y<4;y++)i.paint[_*4+y]>i.paint[_*4+M]&&(M=y);return M}function x(p){const{x:m,z:S,radius:w}=p,_=Math.max(0,Math.floor((m-w+e/2)/n)),M=Math.min(t-1,Math.ceil((m+w+e/2)/n)),y=Math.max(0,Math.floor((S-w+e/2)/n)),E=Math.min(t-1,Math.ceil((S+w+e/2)/n));if(_>M||y>E)return!1;const v=p.height??d(m,S),b=p.brush==="smooth"?i.heights.slice():i.heights;for(let C=y;C<=E;C++)for(let R=_;R<=M;R++){const T=f(R,C),P=RM(Math.hypot(T.x-m,T.z-S)/w);if(P<=0)continue;const I=h(R,C);switch(p.brush){case"raise":i.heights[I]+=p.strength*P;break;case"lower":i.heights[I]-=p.strength*P;break;case"dig":i.heights[I]=Math.min(i.heights[I],i.heights[I]-p.strength*P);break;case"flatten":i.heights[I]+=(v-i.heights[I])*Math.min(1,p.strength*P);break;case"smooth":{let U=0,k=0;for(let D=-1;D<=1;D++)for(let z=-1;z<=1;z++){const O=R+z,B=C+D;O<0||B<0||O>=t||B>=t||(U+=b[h(O,B)],k++)}i.heights[I]+=(U/k-i.heights[I])*Math.min(1,p.strength*P);break}case"paint":{const U=p.layer??0,k=Math.min(1,p.strength*P);for(let D=0;D<4;D++){const z=i.paint[I*4+D];i.paint[I*4+D]=Math.round(D===U?z+(255-z)*k:z*(1-k))}break}}}return u(h(0,y),h(t-1,E)+1),!0}return{mesh:a,data:i,heightAt:d,layerAt:g,apply:x,refresh:u,setLayers(p){i.layers=p.map(m=>({...m})),l=c(),u()},grassAt(p,m,S=-1/0){return d(p,m)<S+.02?0:i.layers[g(p,m)]?.grass??0},toJSON(){return{...i,heights:i.heights.map(p=>Math.round(p*1e3)/1e3),paint:[...i.paint]}},dispose(){s.dispose(),o.dispose()}}}function op(i){const e=f=>{throw new Error(`Invalid effect: ${f}`)},t=(f,u)=>((!f||typeof f!="object"||Array.isArray(f))&&e(u),f),n=(f,u,d=-1e4,g=1e4)=>{(typeof f!="number"||!Number.isFinite(f)||f<d||f>g)&&e(u)},s=(f,u)=>{(!Array.isArray(f)||f.length!==3)&&e(u),f.forEach(d=>n(d,u))},r=(f,u,d=256)=>((!Array.isArray(f)||f.length>d)&&e(u),f),o=(f,u)=>{f!==void 0&&typeof f!="boolean"&&e(u)},a=(f,u,d=0)=>{Array.isArray(f)?(f.length!==2&&e(u),f.forEach(g=>n(g,u,d)),f[0]>f[1]&&e(u)):n(f,u,d)},c=(f,u,d=!1)=>{let g=-1;for(const x of r(f,u)){const p=t(x,u);n(p.t,u,0,1),p.t<g&&e(u),g=p.t,d?s(p.color,u):n(p.v,u,0)}};function l(f,u=0){if(u>24&&e("data nested too deeply"),typeof f=="number"&&n(f,"non-finite number",-Number.MAX_VALUE,Number.MAX_VALUE),f&&typeof f=="object")for(const[d,g]of Object.entries(f))["__proto__","constructor","prototype"].includes(d)&&e(d),l(g,u+1)}l(i);const h=t(i,"document");(typeof h.name!="string"||!h.name.trim()||h.name.length>120)&&e("name"),n(h.duration,"duration",.01,3600),o(h.loop,"loop");for(const[f,u]of r(h.emitters,"emitters",32).entries()){const d=t(u,`emitter ${f+1}`),g=`emitter ${f+1}`;d.name!==void 0&&(typeof d.name!="string"||d.name.length>120)&&e(`${g}: name`),d.render!==void 0&&!["particle","ring","beam","ribbon","heat","decal","flipbook"].includes(String(d.render))&&e(`${g}: technique`);for(const x of["rate","start","duration","gravity","drag","noise","glow","max"])d[x]!==void 0&&n(d[x],`${g}.${x}`,0);for(const x of["attract","spin"])d[x]!==void 0&&n(d[x],`${g}.${x}`);for(const x of["velocity","offset"])d[x]!==void 0&&s(d[x],`${g}.${x}`);for(const x of["life","speed"])d[x]!==void 0&&a(d[x],`${g}.${x}`,x==="life"?.001:0);if(d.glyphs!==void 0&&(typeof d.glyphs!="string"||d.glyphs.length>256)&&e(`${g}: glyphs`),o(d.ground,`${g}.ground`),d.size!==void 0&&(Array.isArray(d.size)&&typeof d.size[0]=="object"?c(d.size,`${g}.size`):a(d.size,`${g}.size`,.001)),d.alpha!==void 0&&(Array.isArray(d.alpha)?c(d.alpha,`${g}.alpha`):n(d.alpha,`${g}.alpha`,0,1)),d.color!==void 0&&(Array.isArray(d.color)&&typeof d.color[0]=="object"?c(d.color,`${g}.color`,!0):s(d.color,`${g}.color`)),d.bursts!==void 0)for(const x of r(d.bursts,`${g}.bursts`)){const p=t(x,g);n(p.at,`${g}.burst.at`,0,3600),n(p.count,`${g}.burst.count`,0,1e4)}if(d.shape!==void 0){const x=t(d.shape,`${g}.shape`);["point","sphere","cone","ring","box","line"].includes(String(x.kind))||e(`${g}: shape`);for(const p of["radius","angle"])x[p]!==void 0&&n(x[p],`${g}.shape.${p}`,0);for(const p of["size","to"])x[p]!==void 0&&s(x[p],`${g}.shape.${p}`);o(x.surface,`${g}.shape.surface`)}if(d.ring!==void 0){const x=t(d.ring,g);n(x.from,"initial radius",0),n(x.to,"final radius",0),n(x.count,"ring glyphs",1,1e4),o(x.tangent,"tangent")}if(d.beam!==void 0){const x=t(d.beam,g);n(x.segments,"segments",1,1e4);for(const p of["jitter","amplitude"])x[p]!==void 0&&n(x[p],p,0)}if(d.ribbon!==void 0){const x=t(d.ribbon,g);n(x.length,"length",.001),n(x.spacing,"spacing",.001)}if(d.heat!==void 0){const x=t(d.heat,g);for(const[p,m,S]of[["cols",1,64],["rows",2,128],["letter",.001,100],["toward",-100,100],["sparks",0,1e4]])x[p]!==void 0&&n(x[p],`heat.${p}`,m,S);if(x.cell!==void 0){const p=r(x.cell,"fire cell",2);p.length!==2&&e("fire cell"),p.forEach(m=>n(m,"fire cell",.001,100))}if(x.ramp!==void 0){const p=r(x.ramp,"fire ramp",64);p.length||e("empty ramp");for(const m of p){const S=r(m,"glyph/color",2);(S.length!==2||typeof S[0]!="string"||!S[0])&&e("fire glyph"),s(S[1],"fire color")}}if(x.embers!==void 0){const p=t(x.embers,"embers");n(p.count,"embers",0);const m=r(p.letters,"ember glyphs",3);(m.length!==3||m.some(S=>typeof S!="string"))&&e("ember glyphs")}if(x.smoke!==void 0){const p=t(x.smoke,"smoke");n(p.count,"smoke",0),typeof p.letters!="string"&&e("smoke glyphs"),s(p.color,"smoke color")}if(x.light!==void 0){const p=t(x.light,"fire light");for(const m of["color","intensity","distance","decay","height"])n(p[m],`fire light.${m}`,0,16777215)}}if(d.flipbook!==void 0){const x=t(d.flipbook,g);n(x.fps,"frames/s",.01,120),n(x.cell,"cell",.001,100),o(x.loop,"loop flipbook"),x.facing!==void 0&&!["camera","ground"].includes(String(x.facing))&&e("flipbook orientation");for(const p of r(x.frames,"frames",600))for(const m of r(p,"rows",256))(typeof m!="string"||m.length>256)&&e("flipbook row");if(x.colors!==void 0)for(const p of r(x.colors,"colors",600))for(const m of r(p,"row colors"))for(const S of r(m,"cell color"))s(S,"cell color")}}if(h.light!==void 0){const f=t(h.light,"light");n(f.color,"light color",0,16777215),n(f.intensity,"intensity",0,1e3);for(const u of["distance","decay","flicker"])f[u]!==void 0&&n(f[u],`light.${u}`,0);f.offset!==void 0&&s(f.offset,"light position"),f.fade!==void 0&&c(f.fade,"light curve")}return JSON.parse(JSON.stringify(i))}const jo=["atmosphere","inkTint","bodySceneLighting","inkFog","brightness","background","fog","hemisphere","moon","fill","bodyAmbient"];function CM(i){return structuredClone(Object.fromEntries(jo.filter(e=>i[e]!==void 0).map(e=>[e,i[e]])))}const PM=["screen","surface","body","water","particle","carpet"];function $e(i,e){throw new Error(`Invalid scene: ${i} ${e}`)}function mt(i,e){return(!i||typeof i!="object"||Array.isArray(i))&&$e(e,"must be an object"),i}function pt(i,e,t=-1e8,n=1e8){return(typeof i!="number"||!Number.isFinite(i)||i<t||i>n)&&$e(e,`must be a number between ${t} and ${n}`),i}function wi(i,e,t,n=-1e8){(!Array.isArray(i)||i.length!==t)&&$e(e,`must contain ${t} numbers`),i.forEach((s,r)=>pt(s,`${e}[${r}]`,n))}function Ei(i,e){return Array.isArray(i)||$e(e,"must be an array"),i}function Es(i,e){const t=mt(i,e);t.glyph!==void 0&&!PM.includes(String(t.glyph))&&$e(e,"contains an unknown technique"),t.surface!==void 0&&!Object.hasOwn(Ks,String(t.surface))&&$e(e,"contains an unknown family"),t.size!==void 0&&pt(t.size,`${e}.size`,.01,10);for(const n of["color","emissive"])t[n]!==void 0&&(pt(t[n],`${e}.${n}`,0,16777215),Number.isInteger(t[n])||$e(`${e}.${n}`,"must be an integer RGB colour"));if(t.alphabet!==void 0&&!dd(t.alphabet)&&$e(`${e}.alphabet`,"must contain 1–128 visible single characters, without control or combining sequences"),t.font!==void 0&&(typeof t.font!="string"||!t.font.trim()||t.font.length>100||/[\p{C}]/u.test(t.font))&&$e(`${e}.font`,"must be a font family of 1–100 characters"),t.fontWeight!==void 0&&t.fontWeight!==400&&t.fontWeight!==700&&$e(`${e}.fontWeight`,"must be 400 or 700"),t.open!==void 0&&typeof t.open!="boolean"&&$e(`${e}.open`,"must be a boolean"),t.faces!==void 0&&!["front","both"].includes(String(t.faces))&&$e(`${e}.faces`,"must be front or both"),t.lighting!==void 0&&!["scene","unlit"].includes(String(t.lighting))&&$e(`${e}.lighting`,"must be scene or unlit"),t.palette!==void 0){const n=Ei(t.palette,`${e}.palette`);(n.length<2||n.length>8)&&$e(`${e}.palette`,"must contain 2–8 RGB colors"),n.forEach((s,r)=>{pt(s,`${e}.palette[${r}]`,0,16777215),Number.isInteger(s)||$e(`${e}.palette`,"must contain integer RGB colors")})}for(const[n,s,r]of[["spacing",.5,4],["density",.05,1],["strength",0,4],["gap",0,.015],["contrast",.1,4],["toneOffset",-1,1],["shadowSteps",2,16],["rotation",-Math.PI,Math.PI],["emissiveIntensity",0,4]])t[n]!==void 0&&pt(t[n],`${e}.${n}`,s,r);if(t.shadowSteps!==void 0&&!Number.isInteger(t.shadowSteps)&&$e(`${e}.shadowSteps`,"must be an integer"),t.type!==void 0&&typeof t.type!="string"&&$e(`${e}.type`,"must be text"),t.body!==void 0){const n=mt(t.body,`${e}.body`);n.occlude!==void 0&&typeof n.occlude!="boolean"&&$e(`${e}.body.occlude`,"must be a boolean")}if(t.parts)for(const[n,s]of Object.entries(mt(t.parts,`${e}.parts`)))Es(s,`${e}.parts.${n}`)}function ap(i,e){if(typeof i=="number"&&pt(i,e,-Number.MAX_VALUE,Number.MAX_VALUE),i&&typeof i=="object")for(const[t,n]of Object.entries(i))["__proto__","constructor","prototype"].includes(t)&&$e(e,"contains a reserved key"),ap(n,`${e}.${t}`)}function fl(i,e,t){if(typeof e=="number"){pt(i,t);return}if(typeof e=="boolean"){typeof i!="boolean"&&$e(t,"must be a boolean");return}if(Array.isArray(e)){wi(i,t,e.length);return}if(e&&typeof e=="object"){const n=mt(i,t);for(const[s,r]of Object.entries(e))fl(n[s],r,`${t}.${s}`)}}function ji(i,e){const t=mt(i,"document");if(t.version!==1&&$e("version","is not supported (expected: 1)"),t.name!==void 0&&typeof t.name!="string"&&$e("name","must be text"),t.environment!==void 0){const o=mt(t.environment,"environment");["none","rain","snow"].includes(String(o.weather))||$e("environment.weather","unknown"),o.intensity!==void 0&&pt(o.intensity,"environment.intensity",0,1)}ap(t,"document");const n=Ei(t.objects,"objects");if(n.length>2e4&&$e("objects","exceeds 20000 objects"),t.assets!==void 0)for(const[o,a]of Object.entries(mt(t.assets,"assets"))){const c=mt(a,`assets.${o}`);(typeof c.name!="string"||typeof c.source!="string"||!c.source.startsWith("data:"))&&$e(`assets.${o}`,"must contain a name and an embedded source (data URI)")}const s=new Set;if(t.cameras!==void 0){const o=mt(t.cameras,"cameras");Object.keys(o).length>128&&$e("cameras","exceeds 128 cameras");for(const[a,c]of Object.entries(o)){const l=mt(c,`cameras.${a}`),h=`cameras.${a}`;(!a||typeof l.name!="string"||!l.name.trim())&&$e(h,"needs an identifier and name"),l.projection!=="orthographic"&&$e(h,"unsupported projection"),wi(l.position,`${h}.position`,3),wi(l.rotation,`${h}.rotation`,3),pt(l.span,`${h}.span`,.01,1e4),pt(l.aspect,`${h}.aspect`,.1,10),l.near!==void 0&&pt(l.near,`${h}.near`,.001,1e4),l.far!==void 0&&pt(l.far,`${h}.far`,.002,1e5),Number(l.near??.1)>=Number(l.far??1e3)&&$e(h,"far plane must be greater than the near plane")}}if(t.activeCamera!==void 0&&(typeof t.activeCamera!="string"||!Object.hasOwn(t.cameras??{},t.activeCamera))&&$e("activeCamera","camera not found"),t.atmospheres!==void 0){const o=mt(t.atmospheres,"atmospheres");Object.keys(o).length>256&&$e("atmospheres","exceeds 256 atmospheres");for(const[a,c]of Object.entries(o)){const l=mt(c,`atmospheres.${a}`);(!a||typeof l.name!="string"||!l.name.trim())&&$e(`atmospheres.${a}`,"needs an identifier and name");const h=mt(l.style,`atmospheres.${a}.style`);for(const f of Object.keys(h))jo.includes(f)||$e(`atmospheres.${a}.style.${f}`,"is not a lighting field");ji({version:1,objects:[],style:h})}}if(t.textures!==void 0){const o=mt(t.textures,"textures");Object.keys(o).length>256&&$e("textures","exceeds 256 textures");for(const[a,c]of Object.entries(o)){const l=mt(c,`textures.${a}`);(!a||typeof l.name!="string"||!l.name.trim())&&$e(`textures.${a}`,"needs an identifier and name");const h=mt(l.style,`textures.${a}.style`);for(const f of Object.keys(h))ql.includes(f)||$e(`textures.${a}.style.${f}`,"is not an appearance field");if(h.glyph!==void 0&&!["surface","body"].includes(String(h.glyph))&&$e(`textures.${a}.style.glyph`,"must use surface or body glyphs"),Es(h,`textures.${a}.style`),l.previewLighting!==void 0){const f=mt(l.previewLighting,`textures.${a}.previewLighting`);for(const u of Object.keys(f))jo.includes(u)||$e(`textures.${a}.previewLighting.${u}`,"is not a lighting field");ji({version:1,objects:[],style:f})}}}if(t.effects!==void 0){const o=mt(t.effects,"effects");Object.keys(o).length>256&&$e("effects","exceeds 256 effects");for(const[a,c]of Object.entries(o))a.startsWith("fx:custom-")||$e(`effects.${a}`,"needs an fx:custom- identifier"),op(c)}if(n.forEach((o,a)=>{const c=mt(o,`objects[${a}]`),l=`objects[${a}]`;(typeof c.prefab!="string"||!c.prefab)&&$e(`${l}.prefab`,"is required"),e&&!Object.hasOwn(e,c.prefab)&&!Object.hasOwn(t.effects??{},c.prefab)&&$e(`${l}.prefab`,`does not exist: ${c.prefab}`),wi(c.position,`${l}.position`,3),c.rotation!==void 0&&pt(c.rotation,`${l}.rotation`),c.scale!==void 0&&pt(c.scale,`${l}.scale`,.001,1e3),c.rotation3!==void 0&&wi(c.rotation3,`${l}.rotation3`,3),c.scale3!==void 0&&wi(c.scale3,`${l}.scale3`,3,.001),c.seed!==void 0&&pt(c.seed,`${l}.seed`,0,4294967295),c.options!==void 0&&Es(c.options,`${l}.options`),c.visible!==void 0&&typeof c.visible!="boolean"&&$e(`${l}.visible`,"must be a boolean"),c.animation!==void 0&&c.animation!==null&&typeof c.animation!="string"&&$e(`${l}.animation`,"must be a clip name or null"),c.name!==void 0&&typeof c.name!="string"&&$e(`${l}.name`,"must be text");const h=c.id??`object-${a+1}`;(typeof h!="string"||!h||s.has(h))&&$e(`${l}.id`,"must be unique and non-empty"),s.add(h)}),t.style!==void 0){const o=mt(t.style,"style");for(const[a,c]of Object.entries(o))if(c!==void 0)if(a==="glyphs")Es(c,"style.glyphs");else if(a==="types")for(const[l,h]of Object.entries(mt(c,"style.types"))){const f=mt(h,`style.types.${l}`);f.style&&Es(f.style,`style.types.${l}.style`),f.parts&&Es({parts:f.parts},`style.types.${l}`)}else{if(a==="fog"&&c===null)continue;a==="bodySceneLighting"||a==="inkFog"?typeof c!="boolean"&&$e(`style.${a}`,"must be a boolean"):a==="inkTint"?wi(c,"style.inkTint",3,0):a==="atmosphere"?["moon","dusk","ember"].includes(String(c))||$e("style.atmosphere","unknown"):a in Zi&&fl(c,Zi[a],`style.${a}`)}o.cellSize!==void 0&&pt(o.cellSize,"style.cellSize",1,100),o.brightness!==void 0&&pt(o.brightness,"style.brightness",0,10)}if(t.terrain!==void 0){const o=mt(t.terrain,"terrain"),a=pt(o.resolution,"terrain.resolution",2,513);Number.isInteger(a)||$e("terrain.resolution","must be an integer"),pt(o.size,"terrain.size",1,4096);const c=Ei(o.heights,"terrain.heights"),l=Ei(o.paint,"terrain.paint"),h=Ei(o.layers,"terrain.layers");(c.length!==a*a||l.length!==a*a*4)&&$e("terrain","has incompatible dimensions"),c.forEach(f=>pt(f,"terrain.heights",-4096,4096)),l.forEach(f=>pt(f,"terrain.paint",0,255)),(!h.length||h.length>4)&&$e("terrain.layers","needs 1 to 4 layers"),h.forEach(f=>{const u=mt(f,"terrain.layers");pt(u.color,"layer.color",0,16777215),pt(u.grass,"layer.grass",0,1),typeof u.name!="string"&&$e("layer.name","must be text")})}if(t.carpet!==void 0){const o=mt(t.carpet,"carpet");pt(o.count,"carpet.count",0,3e5),o.seed!==void 0&&pt(o.seed,"carpet.seed",0,4294967295)}t.waters!==void 0&&Ei(t.waters,"waters").forEach((o,a)=>{const c=mt(o,`waters[${a}]`),l=mt(c.shape,`waters[${a}].shape`);["pond","stream","paint"].includes(String(l.kind))||$e(`waters[${a}].shape.kind`,"unknown");for(const h of["x","z","angle"])pt(l[h],`waters[${a}].${h}`);if(pt(l.size,`waters[${a}].size`,.01,4096),l.kind==="paint"){const h=mt(l.mask,`waters[${a}].shape.mask`);pt(h.resolution,`waters[${a}].shape.mask.resolution`,2,513),Number.isInteger(h.resolution)||$e(`waters[${a}].shape.mask.resolution`,"must be an integer");const f=Ei(h.values,`waters[${a}].shape.mask.values`);if(f.length!==Number(h.resolution)**2&&$e(`waters[${a}].shape.mask.values`,"incompatible size"),h.heights!==void 0){const u=Ei(h.heights,`waters[${a}].shape.mask.heights`);u.length!==f.length&&$e(`waters[${a}].shape.mask.heights`,"incompatible size"),u.forEach(d=>pt(d,`waters[${a}].shape.mask.heights`,-1e4,1e4))}f.forEach((u,d)=>pt(u,`waters[${a}].shape.mask.values[${d}]`,-1e6,1e6))}if(c.level!==void 0&&pt(c.level,`waters[${a}].level`),c.physics!==void 0){const h=mt(c.physics,`waters[${a}].physics`);h.enabled!==void 0&&typeof h.enabled!="boolean"&&$e("physics.enabled","must be a boolean");for(const[f,u,d]of[["depth",.005,5],["gravity",.1,30],["damping",0,20],["source",0,5],["waves",0,.3]])h[f]!==void 0&&pt(h[f],`waters[${a}].physics.${f}`,u,d)}if(c.look!==void 0){const h=mt(c.look,`waters[${a}].look`);for(const[f,u]of Object.entries(h))f in ns&&fl(u,ns[f],`waters[${a}].look.${f}`);h.cell&&wi(h.cell,`waters[${a}].look.cell`,2,.001),h.reflection&&pt(mt(h.reflection,"reflection").rows,"reflection.rows",1,1e4)}});const r=JSON.parse(JSON.stringify(t));return r.objects.forEach((o,a)=>{o.id??=`object-${a+1}`,o.seed??=Math.imul(a+1,2654435761)+48017>>>0}),r}const cp=i=>i-Math.floor(i),lr=i=>cp(Math.sin(i*127.1+311.7)*43758.5453);function ih(i,e){const t=.48+lr(i+23)*.48,n=cp(lr(i+7)+e*t/8);return{x:(lr(i*3+1)-.5)*26+Math.sin(e*.42+i)*.45+Math.sin(e*.13)*.65,y:8*(1-n),z:(lr(i*3+2)-.5)*26+Math.cos(e*.31+i*2.4)*.35,size:.085+lr(i+9)*.105,phase:n}}function IM(i,e,t=32){const n=e?.intensity??1;if(!e||e.weather==="none"||n===0)return{update(c){},dispose(){}};const s=new F,r=i.createParticles(e.weather==="snow"?1800:1);i.add(r.mesh,{glyph:"particle"});const o=e.weather==="rain"?i.createRainStreaks(800):void 0;o&&i.add(o.mesh,{glyph:"particle"});const a=o?eh(o,r,{span:t,radius:t}):void 0;return{update(c){if(r.clear(),o?.clear(),a)a.update(c,i.camera,s,0,n);else for(let l=0;l<Math.floor(1600*n);l++){const h=ih(l,c);r.push(h.x*t/26,h.y,h.z*t/26,h.size,[".","+","*"][l%3],[.78,.88,.94],Math.min(1,h.phase*8))}},dispose(){i.remove(r.mesh,{dispose:!0}),o&&i.remove(o.mesh,{dispose:!0})}}}function lp(i,e={}){return Object.fromEntries(Object.entries(e).map(([t,n])=>{const s=new WeakMap;return[t,{title:`effect: ${n.name}`,create(){return new et},update(r){if(!r.visible){s.get(r)?.cancel(),s.delete(r);return}s.has(r)||s.set(r,i.fx.play(n,r))},dispose(r){s.get(r)?.cancel(),s.delete(r)}}]}))}function LM(i="scene"){return{version:1,name:i,objects:[]}}function hp(i){return()=>(i=Math.imul(i,1664525)+1013904223>>>0,i/4294967296)}const DM=(i,e)=>i[Math.floor(e()*i.length)];function dl(i,e,t=-1/0){return{count:e,extent:i.data.size,y:(n,s)=>i.heightAt(n,s)-.06,density:(n,s)=>i.grassAt(n,s,typeof t=="number"?t:Math.max(-1/0,...t.filter(r=>li(r.shape,n,s)>0).map(r=>Dd(r.shape,n,s,r.level??0)))),pick(n){const s=n()<.012,r=.55+n()*.6,o=n();return s?{glyph:6+Math.floor(n()*2),height:.2,color:[.62*r,.66*r,.5*r]}:{glyph:DM([0,0,1,2,5,5,3],n),height:.12+n()*.16,color:[(.2+o*.14)*r,(.46+o*.06)*r,(.26-o*.1)*r]}}}}function NM(i,e,t){const n=ji(e,t);t={...t,...lp(i,n.effects)};const s=i.exportStyle();let r,o,a;const c=[],l=[];function h(){a?.dispose();for(const u of l)t[u.doc.prefab]?.dispose?.(u.object),i.remove(u.object,{dispose:!0});r&&i.remove(r.mesh,{dispose:!0});for(const u of c)i.remove(u.mesh,{dispose:!0});o&&i.remove(o.mesh,{dispose:!0})}try{for(const[u,d]of Object.entries(t))d.style&&i.setTypeStyle(u,d.style);n.style&&i.setStyle(n.style),r=n.terrain?rp(n.terrain):void 0,r&&i.add(r.mesh);for(const u of n.waters??[]){const d=i.createWater(u.shape,{look:u.look,level:u.level,physics:u.physics});c.push(d),i.add(d.mesh,{glyph:"water"})}n.objects.forEach(f),o=n.carpet&&r?i.createCarpet(dl(r,n.carpet.count,n.waters??[]),n.carpet.seed):void 0,o&&i.add(o.mesh,{glyph:"carpet"}),a=IM(i,n.environment,n.terrain?.size)}catch(u){throw h(),i.setStyle(s,{replace:!0}),u}function f(u){const d=t[u.prefab];if(!d)throw new Error(`ascii-engine: unknown prefab "${u.prefab}"`);const g=u.seed??48017,x=d.create({seed:g,random:hp(g),item:u});x.position.set(...u.position),x.rotation.y=u.rotation??0,x.scale.setScalar(u.scale??1),u.rotation3&&x.rotation.set(...u.rotation3),u.scale3&&x.scale.set(...u.scale3),x.visible=u.visible??!0,x.name=u.name??d.title,x.userData.sceneId=u.id,x.userData.prefab=u.prefab;try{i.add(x,{type:d.style?u.prefab:void 0,...u.options})}catch(p){throw d.dispose?.(x),i.remove(x,{dispose:!0}),p}return l.push({doc:u,object:x}),x}return{terrain:r,waters:c,placed:l,place(u){const d=ji({version:1,objects:[{...u,id:u.id??crypto.randomUUID(),seed:u.seed??Math.floor(Math.random()*4294967296)}]},t).objects[0],g=f(d);return n.objects.push(d),g},remove(u){const d=l.findIndex(g=>g.object===u);d<0||(n.objects.splice(n.objects.indexOf(l[d].doc),1),t[l[d].doc.prefab]?.dispose?.(u),l.splice(d,1),i.remove(u,{dispose:!0}))},addWater(u){ji({version:1,objects:[],waters:[u]});const d=i.createWater(u.shape,{look:u.look,level:u.level,physics:u.physics});return i.add(d.mesh,{glyph:"water"}),c.push(d),n.waters=[...n.waters??[],u],d},regrow(u=n.carpet?.count??4e4){r&&(o&&i.remove(o.mesh,{dispose:!0}),n.carpet={count:u,seed:n.carpet?.seed},o=i.createCarpet(dl(r,u,n.waters??[]),n.carpet.seed),i.add(o.mesh,{glyph:"carpet"}))},update(u){a?.update(u);for(const d of l)if(t[d.doc.prefab]?.update?.(d.object,u),d.object.visible)for(const g of c)g.interact(d.object.uuid,d.object.position)},toJSON(){return JSON.parse(JSON.stringify({...n,style:i.exportStyle(),terrain:r?.toJSON()??n.terrain,objects:l.map(({doc:u,object:d})=>({...u,name:d.name,visible:d.visible,position:d.position.toArray(),rotation3:[d.rotation.x,d.rotation.y,d.rotation.z],scale3:d.scale.toArray(),options:i.instanceStyle(d)}))}))},dispose:h}}function UM(i,e){let t=i;for(let n=0;n<(e%4+4)%4;n++)t={n:t.w,e:t.n,s:t.e,w:t.s};return t}function FM(i){const{width:e,height:t}=i,n=i.biome?i.library.filter(u=>!u.biome||u.biome===i.biome):i.library;let s=i.seed>>>0||1;const r=()=>(s=Math.imul(s,1664525)+1013904223>>>0,s/4294967296),o=new Map(n.map(u=>[u.id,u])),a=new Array(e*t),c=new Map((i.fixed??[]).map(u=>[u.z*e+u.x,u.id])),l=(u,d,g)=>{const x=d>0?a[g*e+d-1]:void 0,p=g>0?a[(g-1)*e+d]:void 0;if(x&&x.connectors.e!==u.connectors.w||p&&p.connectors.s!==u.connectors.n||i.edge!==void 0&&(d===0&&u.connectors.w!==i.edge||g===0&&u.connectors.n!==i.edge||d===e-1&&u.connectors.e!==i.edge||g===t-1&&u.connectors.s!==i.edge))return!1;const m=c.get(g*e+d+1),S=c.get((g+1)*e+d);return!(d+1<e&&m&&o.get(m)?.connectors.w!==u.connectors.e||g+1<t&&S&&o.get(S)?.connectors.n!==u.connectors.s)};let h=0;const f=u=>{if(u===e*t)return!0;if(++h>2e5)return!1;const d=u%e,g=Math.floor(u/e),x=c.get(u);let p=x?[o.get(x)].filter(Boolean):n.filter(S=>l(S,d,g));x&&p.length&&!l(p[0],d,g)&&(p=[]);const m=p.map(S=>({c:S,k:Math.pow(r(),1/Math.max(.001,S.weight??1))})).sort((S,w)=>w.k-S.k);for(const{c:S}of m)if(a[u]=S,f(u+1))return!0;return a[u]=void 0,!1};if(f(0))return a.map((u,d)=>({id:u.id,x:d%e,z:Math.floor(d/e)}))}function OM(i,e=40,t=64*1024*1024){let n=[JSON.stringify(i)],s=0;const r=()=>JSON.parse(n[s]);return{get canUndo(){return s>0},get canRedo(){return s<n.length-1},current:r,commit(o){const a=JSON.stringify(o);if(a===n[s])return!1;n=n.slice(0,s+1),n.push(a);let c=n.reduce((l,h)=>l+h.length*2,0);for(;n.length>1&&(n.length>Math.max(0,e)+1||c>t);)c-=n.shift().length*2;return s=n.length-1,!0},undo(){return s>0&&s--,r()},redo(){return s<n.length-1&&s++,r()},reset(o){n=[JSON.stringify(o)],s=0}}}async function zM(i){const e=[],t=new WeakMap,n={},s=r=>{r.mixer.stopAllAction(),r.mixer.uncacheRoot(r.scene);const o=new Set,a=new Set,c=new Set;r.scene.traverse(l=>{if(l instanceof Ye){o.add(l.geometry);for(const h of[l.material].flat()){a.add(h);for(const f of Object.values(h))f instanceof kt&&c.add(f)}}}),o.forEach(l=>l.dispose()),a.forEach(l=>l.dispose()),c.forEach(l=>l.dispose())};try{for(const[r,o]of Object.entries(i.assets??{})){const a=await np(o.source);a.mixer.stopAllAction(),e.push(a),n[r]={title:o.name,style:{},create({item:c}){const l=Kd(a.scene);l.traverse(u=>{(u.userData.glyph||u.userData.glyphStyle)&&(u.userData.glyphDefault=!0),u instanceof Ye&&(u.geometry=u.geometry.clone(),u.material=Array.isArray(u.material)?u.material.map(d=>d.clone()):u.material.clone())});const h=nh(l,a.animations);h.mixer.stopAllAction();const f=c.animation===null?void 0:a.animations.find(u=>u.name===c.animation)??a.animations[0];return f&&h.mixer.clipAction(f).play(),t.set(l,{model:h,last:-1}),l.userData.animationClips=a.animations.map(u=>u.name),l},update(c,l){const h=t.get(c);h&&(h.model.update(h.last<0?0:Math.max(0,Math.min(.08,l-h.last))),h.last=l)},dispose(c){const l=t.get(c);l&&(l.model.mixer.stopAllAction(),l.model.mixer.uncacheRoot(l.model.scene),t.delete(c))}}}}catch(r){throw e.forEach(s),r}return{library:n,dispose(){e.forEach(s),e.length=0}}}function up(i,e){i.position.set(...e.position),i.rotation.set(...e.rotation,"XYZ"),i.zoom=1,i.left=-e.span*e.aspect,i.right=e.span*e.aspect,i.top=e.span,i.bottom=-e.span,i.near=e.near??.1,i.far=e.far??1e3,i.updateProjectionMatrix(),i.updateMatrixWorld()}function BM(i){return structuredClone(Object.fromEntries(ql.filter(e=>i[e]!==void 0).map(e=>[e,i[e]])))}function ha(i,e){const{cols:t,rows:n}=e,s=e.alphabet??" .:-=+*#%@",r=e.threshold??.06,o=e.gain??1,a=[],c=[],l=i.width/t,h=i.height/n;for(let f=0;f<n;f++){let u="";const d=[];for(let g=0;g<t;g++){let x=0,p=0,m=0,S=0,w=0;for(let E=Math.floor(f*h);E<Math.max(Math.floor(f*h)+1,Math.floor((f+1)*h));E++)for(let v=Math.floor(g*l);v<Math.max(Math.floor(g*l)+1,Math.floor((g+1)*l));v++){const b=(E*i.width+v)*4;x+=i.data[b],p+=i.data[b+1],m+=i.data[b+2],S+=i.data[b+3],w++}x/=w*255,p/=w*255,m/=w*255,S/=w*255;const _=(x*.2126+p*.7152+m*.0722)*S;if(_<r){u+=" ",d.push([0,0,0]);continue}const M=1+Math.min(s.length-2,Math.floor((_-r)/(1-r)*(s.length-1)));u+=s[M];const y=Math.max(x,p,m,.001);d.push([x/y*o,p/y*o,m/y*o])}a.push(u),c.push(d)}return{text:a,colors:c}}function sh(i,e,t,n,s,r,o){const a=document.createElement("canvas");a.width=r,a.height=o;const c=a.getContext("2d",{willReadFrequently:!0});return c.drawImage(i,e,t,n,s,0,0,r,o),c.getImageData(0,0,r,o)}function kM(i,e,t,n){const s=i.width/e,r=i.height/t,o=n.count??e*t,a=[],c=[];for(let l=0;l<o;l++){const h=sh(i,l%e*s,Math.floor(l/e)*r,s,r,n.cols*4,n.rows*4),f=ha(h,n);a.push(f.text),c.push(f.colors)}return{frames:a,colors:c,fps:n.fps??12}}async function GM(i,e,t){const n=globalThis.ImageDecoder;if(!n)throw new Error("ImageDecoder unavailable in this browser: use a sprite sheet or video");const s=new n({data:i,type:e});await s.tracks.ready;const r=Math.min(t.maxFrames??120,s.tracks.selectedTrack?.frameCount??1),o=[],a=[];for(let c=0;c<r;c++){const{image:l}=await s.decode({frameIndex:c}),h=sh(l,0,0,l.displayWidth,l.displayHeight,t.cols*4,t.rows*4);l.close();const f=ha(h,t);o.push(f.text),a.push(f.colors)}return s.close(),{frames:o,colors:a,fps:t.fps??12}}async function HM(i,e){const t=e.fps??12;i.readyState<1&&await new Promise(o=>i.addEventListener("loadedmetadata",o,{once:!0}));const n=Math.min(e.maxFrames??90,Math.floor(i.duration*t)),s=[],r=[];for(let o=0;o<n;o++){i.currentTime=o/t,await new Promise(l=>i.addEventListener("seeked",l,{once:!0}));const a=sh(i,0,0,i.videoWidth,i.videoHeight,e.cols*4,e.rows*4),c=ha(a,e);s.push(c.text),r.push(c.colors)}return{frames:s,colors:r,fps:t}}const fp="0.1.0",VM=Object.freeze(Object.defineProperty({__proto__:null,ATMOSPHERE_KEYS:jo,BODY_RAMPS:Kl,CARPET_GLYPHS:Td,DEFAULT_ASCII_STYLE:Zi,DEFAULT_HEAT_GRID:th,DEFAULT_LAYERS:ip,DEFAULT_WATER_LOOK:ns,DEFAULT_WATER_PHYSICS:Zl,ENGINE_VERSION:fp,GLYPH_STYLE_KEYS:ql,PARTICLE_GLYPHS:ca,SURFACE_ALPHA:Ks,SURFACE_ALPHABETS:Ur,SURFACE_CELL:Jl,SURFACE_INK:Id,SURFACE_RANGES:Yi,SURFACE_TOLERANCE:wy,applyDefaultGlyphs:tp,applySceneCamera:up,atmosphereStyle:CM,bodyUniforms:Md,buildScene:NM,circuitGLSL:Xd,createAsciiEngine:Vd,createAsciiPass:ud,createCarpet:Rd,createChunkStreamer:$d,createCircuit:Wd,createEffectPrefabs:lp,createEffectSystem:Hd,createExploration:ad,createGlyphCloud:Cd,createHistory:OM,createIllumination:cl,createRain:eh,createRainStreaks:kd,createRippleField:Yd,createTerrain:rp,createTerrainData:sp,createWater:zd,createWaterDynamics:Nd,createWaterPaint:zy,createWaterReflection:Ql,defaultGlyphStyle:ep,drawableGlyphs:Gd,emptyScene:LM,engineStyle:fd,generateChunkGrid:FM,gifToFlipbook:GM,glyphBody:bd,illuminationGLSL:aa,illuminationUniforms:Gr,imageToGlyphFrame:ha,loadGlyphModel:np,loadSceneAssets:zM,markScreen:Pd,mergeGlyphStyles:Yl,nodeGlyphStyle:md,normalizeGlyphData:Qd,paintWater:By,parseEffect:op,parseScene:ji,prepareGlyphModel:nh,rainDrop:ll,removeGlyphBody:Ad,resolveGlyphStyle:pd,rotateConnectors:UM,seededRandom:hp,snowflake:ih,spriteSheetToFlipbook:kM,stormAt:qd,surfaceAlpha:Ns,surfaceAtlas:la,surfaceMaterial:Ld,tagSurface:hd,terrainCover:dl,textureStyle:BM,updateGlyphBodies:Ed,updateReflectionCamera:Od,updateSkinnedBody:wd,validGlyphAlphabet:dd,videoToFlipbook:HM,waterEdge:li,waterEdgeGLSL:jl,waterHeightAt:Dd,waterLettersGLSL:Fd,waterMaskEdge:Fr,waterVec4:Ud},Symbol.toStringTag,{value:"Module"})),br={cellSize:6,brightness:1,background:131330,fog:{color:131330,density:.012},hemisphere:{sky:12766916,ground:3420961,intensity:1.25},moon:{color:14739404,intensity:2.2,position:[-5,12,7],shadowIntensity:.62,shadowExtent:16,mapSize:1024},fill:{color:10207157,intensity:.3,position:[6,6,-7]},interior:!1,bodyAmbient:.3,bodyLantern:.7,atmosphere:"moon",glyphs:{},types:{tree:{style:{glyph:"surface",surface:"bark"},parts:{crown:{glyph:"body",surface:"foliage",size:.19},trunk:{glyph:"surface",surface:"bark"}}},rock:{style:{glyph:"body",surface:"stone",size:.19}},creature:{style:{glyph:"body",size:.155}},hero:{style:{glyph:"screen",surface:"actor"}},prop:{style:{glyph:"surface",surface:"wood"}},ground:{style:{glyph:"surface",surface:"earth"}}}},WM={...br,hemisphere:{sky:10926534,ground:2435358,intensity:.95},moon:{...br.moon,color:12241355,intensity:1.5,shadowIntensity:1},fill:{...br.fill,color:8558017},interior:!0,bodyAmbient:.12,bodyLantern:1.2};function XM(i,e,t=.9,n=!1){const s=Math.max(3.8,Math.min(4.7,i/145));return Math.max(Math.max(s,4.6/e)/Math.min(t,n?1.5:2.2),n?2.35/e:1.8)}const Ss=i=>i-Math.floor(i),$M=structuredClone(th);function dp(i,e,t=$M){const n=t.ramp,s=n.length-1,r=new di(t.light.color,t.light.intensity,t.light.distance,t.light.decay);r.position.set(e.x,t.light.height,e.z);const o=new F,a=new F;return{light:r,position:e,update(c,l,h=1,f=0){const u=e;r.position.set(u.x,t.light.height,u.z),r.intensity=(t.light.intensity-1+Math.sin(c*5.3)*1.1+Math.sin(c*8.7+.8)*.65)*h,o.setFromMatrixColumn(l.matrixWorld,0).setY(0).normalize(),a.setFromMatrixColumn(l.matrixWorld,2).setY(0).normalize().multiplyScalar(t.toward);const{cols:d,rows:g}=t,[x,p]=t.cell;for(let y=0;y<g;y++)for(let E=-d;E<=d;E++){const v=y/(g-1),b=(d+.5)*(1-v*.8)*(.85+.15*Math.sin(c*2.3+y*.7)),C=1-Math.abs(E+Math.sin(c*1.7+y*.45)*v*1.6)/Math.max(.6,b);if(C<=0)continue;const R=Math.sin(E*1.7+y*.9-c*7.5)*Math.sin(E*.6-y*1.3-c*5.1+1.3),T=Ss(Math.sin((E+13)*12.9+(y-Math.floor(c*9))*78.2)*43758.5),P=(Math.pow(C,1.6)*(1-v*.85)*1.7+R*.3+T*.2-.12)*h;if(P<.14||v>.55&&T>.8)continue;const I=Math.min(s,Math.floor((1-Math.min(1,P))*n.length)),[U,k]=n[I];i.push(u.x+a.x+o.x*E*x+(f>0?v*.25:0),.2+y*p,u.z+a.z+o.z*E*x,t.letter,U,k,.9+Math.min(.1,P*.1))}const[m,S,w]=t.embers.letters,_=t.embers.count;for(let y=0;y<_;y++){const E=y/_*Math.PI*2,v=.2+Ss(y*.618)*.32,b=.55+.45*Math.sin(c*2.7+y*1.9);i.push(u.x+Math.cos(E)*v,.1,u.z+Math.sin(E)*v,.15,b>.75?m:b>.45?S:w,b>.75?[1,.66,.25]:[.85,.3,.08],(.45+b*.5)*h)}const M=t.smoke.letters;for(let y=0;y<t.sparks+t.smoke.count;y++){const E=Ss(c*(.32+Ss(y*.41)*.3)+y*.618),v=y<t.sparks,b=E*5+y;i.push(u.x+Math.sin(b)*(.12+E*.45),.55+E*(v?2.6:2.2)*h,u.z+Math.cos(b)*(.12+E*.35),v?.13:.2,v?E<.2?"*":".":M[y%M.length],v?[1,.75-E*.3,.3]:t.smoke.color,(1-E)*(v?1:.5)*h)}if(f>0){for(let y=0;y<58;y++){const E=Ss(c*.42+y*.618),v=y*2.399,b=.12+E*.48;i.push(u.x+Math.cos(v+E*3)*b+E*.4,.2+E*1.65,u.z+Math.sin(v)*b,.11+E*.07,".,:~"[y%4],[.56,.63,.67],Math.sin(E*Math.PI)*f*.6)}for(let y=0;y<8;y++){const E=Ss(c*2.1+y*.618),v=y*2.399;i.push(u.x+Math.cos(v)*(.16+E*.38),.18+Math.sin(E*Math.PI)*.28,u.z+Math.sin(v)*(.16+E*.38),.08,",",[.58,.68,.73],(1-E)*.55)}}}}}structuredClone(ns);const Is=i=>i-Math.floor(i),ef=(i,e)=>(i%e+e)%e-e/2;function pp(i,e,t,n={}){const s=n.count??70,r=n.span??18,o=n.dim??1,a=[.82,.96,.72],c=[1,.94,.64];for(let l=0;l<s;l++){const h=e.x+ef(Is(l*.618)*r+Math.sin(t*.21+l)*.6-e.x,r),f=e.z+ef(Is(l*.382+.17)*r+Math.cos(t*.17+l*1.3)*.6-e.z,r),u=Math.max(0,Math.sin(t*(1.1+Is(l*.71)*1.6)+l*2.1))**6;i.push(h,.25+Is(l*.37)*1.5+Math.sin(t*.6+l)*.14,f,.15+u*.07,u>.55?"*":"+",l%4?a:c,(.22+u*.78)*o)}}function mp(i,e,t){for(let n=0;n<24;n++){const s=n*2.399+t*.06,r=1.1+Is(n*.618)*2.7,o=Math.sin(t*.55+n*1.7)**6;i.push(e.x+Math.cos(s)*r,.35+Is(n*.37)*1.8+Math.sin(t*.45+n)*.13,e.z+Math.sin(s)*r,.055,".",[.85,.67,.35],o*.3)}}function rh(){const i=[];let e=-1;return{add(t,n,s,r=.16){s-e>r&&(i.push({x:t,z:n,t:s}),e=s)},push(t,n){for(let s=i.length-1;s>=0;s--){const r=i[s],o=n-r.t;if(o>1.1||o<0){i.splice(s,1);continue}for(let a=0;a<3;a++){const c=a*2.1+r.t*13;t.push(r.x+Math.cos(c)*o*.5,.08+o*.55+a*.05,r.z+Math.sin(c)*o*.5,.17+o*.08,a?".":",:"[Math.floor(r.t*20)%2],[.48,.44,.36],(1-o/1.1)*.75)}}}}}const oc=[[1.3,1.15,.55],[1.3,.98,.3],[1.25,.78,.16],[1.1,.45,.07],[.65,.12,.03]],qM=[{name:"fogueira",duration:4,loop:!0,light:{color:16755797,intensity:14,distance:7,decay:1.65,flicker:.08,offset:[0,1.05,0]},emitters:[{render:"heat"},{shape:{kind:"ring",radius:.36,surface:!1},rate:40,life:[.6,1.2],glyphs:"*+:",size:.15,color:[{t:0,color:[1,.66,.25]},{t:1,color:[.85,.3,.08]}],alpha:[{t:0,v:.9},{t:1,v:.3}]},{offset:[0,.55,0],shape:{kind:"sphere",radius:.15},rate:14,life:[1.2,2.2],speed:[.2,.4],velocity:[0,1.4,0],spin:2.5,glyphs:"*...",size:.13,color:[1,.75,.3],alpha:[{t:0,v:1},{t:1,v:0}]},{offset:[0,.7,0],shape:{kind:"sphere",radius:.2},rate:6,life:[2,3],velocity:[.05,.9,0],noise:.6,glyphs:",;:~",size:.2,color:[.38,.36,.35],alpha:[{t:0,v:.5},{t:1,v:0}]}]},{name:"poeira",duration:.2,emitters:[{bursts:[{at:0,count:6}],shape:{kind:"sphere",radius:.1},life:1.1,speed:[.3,.5],velocity:[0,.55,0],drag:.5,glyphs:",:.",size:[{t:0,v:.17},{t:1,v:.26}],color:[.48,.44,.36],alpha:[{t:0,v:.75},{t:1,v:0}]}]},{name:"vagalumes",duration:10,loop:!0,emitters:[{shape:{kind:"box",size:[14,1.5,14]},offset:[0,1,0],rate:7,life:[4,8],noise:.4,glyphs:"+*+",size:[{t:0,v:.15},{t:.5,v:.22},{t:1,v:.15}],color:[.82,.96,.72],alpha:[{t:0,v:0},{t:.3,v:1},{t:.6,v:.2},{t:1,v:0}]}]},{name:"morte",duration:1.6,emitters:[{bursts:[{at:0,count:60}],shape:{kind:"sphere",radius:.4},offset:[0,.7,0],life:[1.1,1.6],speed:[.3,.8],velocity:[0,1.3,0],glyphs:"@#%*+:.",size:.24,color:[{t:0,color:[.9,.82,.66]},{t:1,color:[1,.6,.25]}],alpha:[{t:0,v:1},{t:1,v:0}]}]},{name:"aura",duration:1.1,light:{color:16762475,intensity:9,distance:4.5,decay:1.6,offset:[0,.9,0],fade:[{t:0,v:0},{t:.5,v:1},{t:1,v:0}]},emitters:[{bursts:[{at:0,count:36}],shape:{kind:"ring",radius:.62},offset:[0,.95,0],spin:5,life:1.1,glyphs:"o*",size:.2,color:[1,.82,.38],alpha:[{t:0,v:0},{t:.5,v:.9},{t:1,v:0}]},{rate:24,shape:{kind:"ring",radius:.35,surface:!1},offset:[0,.1,0],velocity:[0,2,0],life:1,glyphs:"*+",size:.18,color:[1,.82,.38],alpha:[{t:0,v:.9},{t:1,v:0}]}]},{name:"raio",duration:.5,light:{color:9218815,intensity:12,distance:7,offset:[0,1,0],fade:[{t:0,v:1},{t:1,v:0}]},emitters:[{render:"beam",offset:[0,.9,0],shape:{kind:"line",to:[0,5.7,0]},beam:{segments:26,jitter:24,amplitude:.14},size:.34,color:[.92,.96,1],alpha:[{t:0,v:1},{t:1,v:0}]},{render:"ring",bursts:[{at:0,count:1}],offset:[0,.06,0],life:.7,ring:{from:.3,to:2,count:36},glyphs:"~-=+",size:.25,color:[.58,.78,1],alpha:[{t:0,v:1},{t:1,v:0}]}]},{name:"explosao-de-fogo",duration:.9,light:{color:16750879,intensity:12,distance:7,offset:[0,.9,0],fade:[{t:0,v:1},{t:1,v:0}]},emitters:[{render:"ring",bursts:[{at:0,count:1}],offset:[0,.1,0],life:.8,ring:{from:0,to:1.8,count:28},glyphs:"Oo",size:.31,color:[1,.85,.5],alpha:[{t:0,v:1},{t:1,v:0}]},{bursts:[{at:0,count:54}],shape:{kind:"cone",radius:.45,angle:.25},speed:[1,2.2],gravity:1.5,life:[.5,.9],glyphs:"@#%x+.",size:[{t:0,v:.31},{t:1,v:.2}],color:[{t:0,color:oc[0]},{t:.4,color:oc[2]},{t:1,color:oc[4]}],alpha:[{t:0,v:1},{t:1,v:0}]}]},{name:"gelo",duration:1.25,emitters:[{bursts:[{at:0,count:13}],shape:{kind:"ring",radius:.6},velocity:[0,1.5,0],drag:3,life:1.2,glyphs:"##A^",size:.3,color:[{t:0,color:[.58,.78,1]},{t:1,color:[.85,.95,1]}],alpha:[{t:0,v:1},{t:.8,v:1},{t:1,v:0}]},{rate:16,shape:{kind:"sphere",radius:.6},offset:[0,.3,0],velocity:[0,1.2,0],life:.8,glyphs:"*",size:.22,color:[.85,.95,1],alpha:[{t:0,v:1},{t:1,v:0}]}]},{name:"anel-de-chuva",duration:.1,emitters:[{render:"ring",bursts:[{at:0,count:1}],life:.65,ring:{from:.025,to:.27,count:10,tangent:!0},size:.13,color:[.35,.43,.48],alpha:[{t:0,v:.34},{t:1,v:0}]}]},{name:"rastro",duration:6,loop:!0,emitters:[{render:"ribbon",ribbon:{length:2.4,spacing:.16},offset:[0,.9,0],glyphs:"#/-:.",size:.25,color:[{t:0,color:[1,.94,.64]},{t:1,color:[.75,.88,1]}],alpha:[{t:0,v:1},{t:1,v:0}]}]}];function YM(i,e={}){return Vd(i,{...e,style:{...br,...e.style},effects:e.effects??qM})}function KM(i){const e=new Oe(i).getHSL({h:0,s:0,l:0},Gt);return e.s>.18&&e.h>.2&&e.h<.45?"foliage":e.s>.15&&(e.h<.14||e.h>.95)?"wood":"stone"}const ac=new Map;function JM(i){if(!ac.has(i)){const e=new ut({color:i,roughness:1,flatShading:!0});e.userData.shared=!0,ac.set(i,e)}return ac.get(i)}const ZM=new Un(1,1,1),Ln=new ss(1,0),jM=new Pt(1,1,1,8),tf=new qi(1,8,5,0,Math.PI*2,0,Math.PI/2);function QM(i,e,t,n,s,r=1,o=r,a=r){const c=new Ye(i,JM(e));return c.position.set(t,n,s),c.scale.set(r,o,a),c.castShadow=!0,c.receiveShadow=!0,c.userData.sharedGeometry=!0,c}function oh(i,e=KM(i.material.color.getHex())){const t=i.geometry,n=t instanceof ss||t instanceof gn||t instanceof Ni;return i.userData.glyph=e==="foliage"||n?"body":"surface",i.userData.glyphStyle={surface:e,...i.userData.glyph==="body"?{size:.19}:{}},i}function ah(){const i=(t,n,s,r,o,a=1,c=a,l=a,h,f)=>{const u=oh(QM(t,n,s,r,o,a,c,l),f);return h?.add(u),u};return{add:i,box:(t,n,s,r,o,a,c,l,h)=>i(ZM,t,n,s,r,o,a,c,l,h)}}function gp(i,e=!0){const t=new et;t.name="camp";for(let n=0;n<9;n++){const s=n/9*Math.PI*2;i.add(Ln,6845034,Math.cos(s)*.53,.08,Math.sin(s)*.53,.18,.13,.17,t)}for(const n of[-.7,.7])i.box(4736056,0,.11,0,.76,.17,.15,t).rotation.y=n;if(i.box(7031354,-1.1,.13,.2,.75,.22,1.3,t),i.box(8219218,-1.1,.27,-.35,.72,.2,.22,t),i.box(6579030,-.3,.35,1.4,.63,.65,.58,t).name="crate",i.box(7889996,1.2,.23,.1,.55,.45,.85,t),e){for(let n=0;n<10;n++)i.box(6379331,-2.3+n*.17,1.35+Math.abs(n-4.5)*-.11,.3,.15,.08,1.75,t).rotation.z=n<5?.58:-.58;for(const n of[-2.3,-.8])i.box(5589308,n,.54,.95,.09,1.1,.09,t)}return t}function xp(i,e,t,n,s=!1){const r=()=>(n=Math.imul(n,1664525)+1013904223>>>0,n/4294967296),o=new et;o.position.set(i,0,e),o.name="tree";const a=new et;a.name="trunk",o.add(a);const c=new et;c.name="crown",o.add(c);const l=new ut({color:9731417,roughness:.92,flatShading:!0}),h=new Pt(.58,1,1,7),f=new F(0,1,0);function u(E,v,b){const C=new Ye(h,l);C.position.copy(E).lerp(v,.5),C.quaternion.setFromUnitVectors(f,v.clone().sub(E).normalize()),C.scale.set(b,E.distanceTo(v),b),C.castShadow=C.receiveShadow=!0,a.add(C)}const d=new F(0,.08,0),g=new F(.19,t*.47,-.12);u(d,g,.29),u(g,new F(-.12,t*.88,.1),.17);for(let E=0;E<7;E++){const v=E*2.399;u(new F(.03,.65,0),new F(Math.cos(v)*(.8+r()*.4),.14,Math.sin(v)*.9),.14)}const x=new ut({color:16777215,roughness:1,flatShading:!0,emissive:2771767,emissiveIntensity:.16}),p=new gn(1,0),m=[];let S;const w=new bt,_=[5077333,7378282,9546357,4090962,10860166];let M=0;function y(E,v,b,C,R,T){w.position.set(E,v,b),w.scale.set(C,R,T),w.rotation.set(r()*.4,r()*6,r()*.35),w.updateMatrix(),S.setMatrixAt(M,w.matrix),S.setColorAt(M++,new Oe(_[Math.floor(r()*_.length)]))}for(let E=0;E<6;E++){S=new Ji(p,x,36),M=0;const v=E*2.399+r()*.25,b=1.15+r()*.65,C=new F(Math.cos(v)*b,t*(.72+r()*.12),Math.sin(v)*b);u(g,C,.1),u(C,C.clone().add(new F(Math.cos(v)*.42,.15,Math.sin(v)*.42)),.045);for(let R=0;R<24;R++){const T=r()*Math.PI*2,P=Math.sqrt(r())*.95;y(C.x+Math.cos(T)*P,C.y+.08+r()*.52,C.z+Math.sin(T)*P,.17+r()*.23,.1+r()*.16,.2+r()*.23)}for(let R=0;R<4;R++){const T=v+(R-1.5)*.38,P=(s?.55:.25)+r()*.65,I=Math.cos(T)*(b+.42),U=Math.sin(T)*(b+.42);for(let k=0;k<3;k++){const D=1-k*.2;y(I+Math.sin(k*.8+T)*.09,C.y-k*P/3,U,.16*D,P*.28,.2*D)}}S.count=M,S.castShadow=S.receiveShadow=!0,m.push(S),c.add(S)}return{root:o,animate(E){m.forEach((v,b)=>{v.rotation.z=Math.sin(E*.85+i*.7+b*.6)*.012,v.rotation.x=Math.sin(E*.62+e*.4+b*.4)*.009})}}}const Qo=.2,pl=.22,ln=(i,e,t,n)=>i+(e-i)*(1-Math.exp(-t*n)),Qt=i=>{const e=Math.max(0,Math.min(1,i));return e*e*(3-2*e)};function Hs(i,e,t,n){return i+Math.atan2(Math.sin(e-i),Math.cos(e-i))*(1-Math.exp(-t*n))}function Js(i){if(i<0||i>.76)return{windup:0,swing:0,recoil:0};const e=Qt(i/.14)*(1-Qt((i-.14)/.1)),t=Qt((i-.14)/.09)*(1-Qt((i-.3)/.46)),n=Math.sin(Math.max(0,Math.min(1,(i-.23)/.45))*Math.PI);return{windup:e,swing:t,recoil:n}}const Zs=i=>i<0?0:Math.exp(-i*9)*Math.sin(Math.min(1,i/.075)*Math.PI/2);function eS(i,e){const t=(i%1+1)%1;if(t<.6)return{z:e*(.5-t/.6),lift:0};const n=(t-.6)/.4;return{z:e*(-.5+Qt(n)),lift:Math.sin(Math.PI*n)**2*.17}}const ai=i=>new ut({color:i,roughness:.83,flatShading:!0}),on=(i,e,t,n,s,r,o=1,a=o,c=o)=>{const l=new Ye(e,t);return l.position.set(n,s,r),l.scale.set(o,a,c),l.castShadow=!0,l.receiveShadow=!0,i.add(l),l};function tS(){const i=new et,e=new et,t=new et;e.name="slime-body",t.name="slime-crown",i.add(e),e.add(t);const n=ai(8492915),s=ai(5269332),r=ai(14929803),o=ai(2370856);r.emissive.setHex(4469781),r.emissiveIntensity=.3;const a=new gn(1,1);on(t,a,n,0,.5,0,.58,.58,.55),on(t,a,s,-.2,.52,-.13,.2,.22,.18);const c=Array.from({length:9},(u,d)=>{const g=d*Math.PI*2/9;return{a:g,mesh:on(e,a,n,Math.cos(g)*.43,.18,Math.sin(g)*.42,.25,.19,.25)}}),l=[-1,1].map(u=>{const d=new et;return d.position.set(u*.19,.62,.48),t.add(d),on(d,a,o,0,0,0,.13,.11,.06),on(d,a,r,0,0,.04,.085,.075,.035),on(d,a,o,u*.015,0,.075,.027,.068,.022),d});let h=0,f=0;return{root:i,height:1.35,waterAnchor:e,animate({time:u,dt:d,speed:g,distance:x,attackAge:p,hurtAge:m,death:S=0}){if(d===0)return;h+=x/.8,f=ln(f,Math.min(1,g/1.2),9,d);const{windup:w,swing:_}=Js(p),M=Zs(m),y=Math.sin(h*Math.PI*2),E=Math.sin(u*2.7),v=p>.24&&p<1.1?Math.sin((p-.24)*23)*Math.exp(-(p-.24)*4.5):0,b=E*.115+y*.12*f+w*.28-_*.23+v*.14+M*.25;e.position.set(Math.sin(u*1.4)*.045*(1-S),Math.max(0,y)*.13*f+_*.17-S*.18,-w*.24+_*.9-M*.25),e.rotation.set(-_*.18+w*.12,0,Math.sin(u*2.1)*.07+M*.15),e.scale.set(1+S*.65,1-S*.9,1+S*.65),t.scale.set(1+b*.48,1-b,1+b*.35),t.position.set(Math.sin(u*2.7-.7)*.065,-.015,_*.1);for(const{a:T,mesh:P}of c){const I=Math.sin(u*3.1-T*1.6)*.065+Math.sin(h*Math.PI*2-T)*f*.12,U=.43+b*.16+I;P.position.set(Math.cos(T)*U,.16+Math.max(0,I)*.8,Math.sin(T)*U-_*.13),P.scale.set(.25+I*.4,.18-b*.06,.25+I*.6)}const C=u%4.7,R=Qt((C-4.35)/.09)*(1-Qt((C-4.47)/.13));l.forEach((T,P)=>{T.scale.y=Math.max(.1,1-R*.9-w*.32),T.rotation.z=(P?1:-1)*(w*.2-M*.15)}),n.emissive.setRGB(M*.32,M*.065,.015)}}}function nS(){const i=new et,e=new et,t=new et,n=new et;e.name="serpent-body",t.name="serpent-head",i.add(e),e.add(t),t.add(n);const s=ai(8623989),r=ai(11710860),o=ai(3492152),a=ai(14338680);a.emissive.setHex(4798730),a.emissiveIntensity=.4;const c=new gn(1,1);on(t,c,s,0,.04,.08,.28,.19,.34),on(t,c,o,0,-.035,.2,.245,.055,.28),n.position.set(0,-.025,-.04),on(n,c,r,0,-.095,.2,.22,.07,.27);for(const v of[-1,1]){on(t,c,a,v*.235,.115,.16,.052,.065,.072);const b=on(t,new In(.034,.15,5),r,v*.14,-.05,.36);b.rotation.z=Math.PI}const l=on(n,new Un(.04,.025,.28),ai(9787211),0,-.07,.53),h=24,f=7,u=Array.from({length:h+1},()=>new F),d=new Float32Array((h+1)*f*3),g=[];for(let v=0;v<h;v++)for(let b=0;b<f;b++){const C=v*f+b,R=v*f+(b+1)%f,T=C+f,P=R+f;g.push(C,T,R,R,T,P)}const x=new Tt;x.setAttribute("position",new Nt(d,3).setUsage(Pi)),x.setIndex(g);const p=on(e,x,s,0,0,0);p.frustumCulled=!1;const m=new F,S=new F,w=new F,_=Array.from({length:10},()=>on(e,c,o,0,0,0,.15,.055,.08));let M=0,y=0;function E(v,b,C,R,T,P){const I=.18+y*.14+b*.12,U=v*(1.8+y*1.2)+M*2;e.position.set(Math.sin(v*1.1)*.04,-T*.27,-b*.24+C*1.05-R*.24),e.rotation.z=R*.18;for(let k=0;k<=h;k++){const D=k/h,z=Math.exp(-D*7);u[k].set(Math.sin(U-D*7)*I*(.55+D*.7)*(1-C*z*.75),(P?.34:.2)+z*(.42+b*.35-C*.14)+Math.sin(U-D*7)*.04-T*z*.4,.62-D*2.3-b*z*.16+C*z*.2)}for(let k=0;k<=h;k++){m.subVectors(u[Math.min(h,k+1)],u[Math.max(0,k-1)]).normalize(),S.set(-m.z,0,m.x).normalize(),w.crossVectors(S,m).normalize();const D=(.205*(1-(k/h)**1.5)+.018)*(1-T*.45);for(let z=0;z<f;z++){const O=z/f*Math.PI*2,B=(k*f+z)*3;d[B]=u[k].x+D*(Math.cos(O)*S.x+Math.sin(O)*w.x),d[B+1]=u[k].y+D*(Math.cos(O)*S.y+Math.sin(O)*w.y),d[B+2]=u[k].z+D*(Math.cos(O)*S.z+Math.sin(O)*w.z)}}x.attributes.position.needsUpdate=!0,x.computeVertexNormals(),t.position.copy(u[0]),t.rotation.set(-b*.28+C*.36+R*.2+T*.45,Math.atan2(u[0].x-u[2].x,u[0].z-u[2].z),Math.sin(v*1.8)*.075),n.rotation.x=b*.55+C*.7+Math.max(0,Math.sin(v*1.9))*.08,l.visible=T<.1&&(b>.1||v%3.6>3.1),l.scale.z=.7+Math.sin(v*28)*.3,_.forEach((k,D)=>{const z=u[3+D*2];k.position.copy(z),k.position.y+=.16*(1-D/12),k.scale.x=.16*(1-D/12)}),s.emissive.setRGB(R*.32,R*.065,.008)}return E(0,0,0,0,0,!1),{root:i,height:1.4,waterAnchor:e,animate({time:v,dt:b,speed:C,distance:R,attackAge:T,hurtAge:P,death:I=0,wading:U=!1}){if(b===0)return;M+=R/.9,y=ln(y,Math.min(1,C/1.2),8,b);const{windup:k,swing:D}=Js(T);E(v,k,D,Zs(P),I,U)}}}const $t=(i,e=0,t=1)=>new ut({color:i,emissive:e,emissiveIntensity:t,roughness:1,flatShading:!0}),rt={ball:new gn(1,1),cone:new In(1,1,6),limb:new Pt(.75,1,1,6),box:new Un(1,1,1)};function ot(i,e,t,n,s,r,o,a=o,c=o){const l=new Ye(e,t);return l.position.set(n,s,r),l.scale.set(o,a,c),l.castShadow=!0,l.receiveShadow=!0,i.add(l),l}function Dt(i,e,t,n){const s=new et;return s.position.set(e,t,n),i.add(s),s}function wr(i,e,t,n,s=n*.7){const r=ot(i,rt.limb,e,0,-t/2,0,1,t,1);return r.scale.set((n+s)/2,t,(n+s)/2),r}const ml={forest_wolf:{hide:7301732,belly:12037015,dark:3157034,eye:15254618,size:1,length:1,legs:1,neck:.9,snout:1,ears:"pointed",tail:"long"},dire_wolf:{hide:4145735,belly:9146259,dark:1908257,eye:16734778,size:1.3,length:1.05,legs:1.05,neck:.95,snout:1.1,ears:"pointed",tail:"long",spines:!0},thicket_panther:{hide:3029548,belly:6253903,dark:1317396,eye:10285162,size:1.05,length:1.25,legs:.9,neck:.8,snout:.7,ears:"round",tail:"long",stripes:1712920},gilded_lion:{hide:12884556,belly:14862212,dark:6176029,eye:16773280,size:1.3,length:1.15,legs:1,neck:.85,snout:.8,ears:"round",mane:9329188,tail:"tuft"},tusk_brute:{hide:7229245,belly:10123874,dark:3088665,eye:16747072,size:1.35,length:1.05,legs:.8,neck:.6,snout:.9,ears:"pointed",tusks:!0,tail:"short",spines:!0},horned_maw:{hide:8141619,belly:12946540,dark:2757906,eye:16765514,size:1.15,length:.95,legs:.85,neck:.7,snout:1.2,ears:"none",horns:"curl",tail:"short",jaw:1.6},stone_wyrm:{hide:6252130,belly:10133911,dark:2764332,eye:8380671,size:1.4,length:1.5,legs:.65,neck:1.2,snout:1.15,ears:"none",horns:"spike",tail:"long",spines:!0}};function iS(i){const e=ml[i]??ml.forest_wolf,t=$t(e.hide),n=$t(e.belly),s=$t(e.dark),r=$t(e.eye,e.eye,.9),o=new et,a=Dt(o,0,0,0);a.scale.setScalar(e.size);const c=.5*e.length,l=.62*e.legs,h=Dt(a,0,l,-c),f=Dt(a,0,l+.06,c*.55);if(ot(h,rt.ball,t,0,.05,0,.27,.27,.34),ot(a,rt.ball,t,0,l+.05,-c*.2,.26,.25,.42),ot(a,rt.ball,n,0,l-.07,-c*.1,.2,.14,.4),ot(f,rt.ball,t,0,.05,0,.3,.32,.32),ot(f,rt.ball,n,0,-.1,.14,.2,.2,.18),e.stripes)for(let M=0;M<5;M++)ot(a,rt.box,$t(e.stripes),0,l+.2,-c+M*c*.38,.5,.03,.06);if(e.spines)for(let M=0;M<6;M++){const y=ot(a,rt.cone,s,0,l+.28+Math.sin(M/5*Math.PI)*.05,-c*.9+M*c*.33,.05,.2,.07);y.rotation.x=-.35}const u=Dt(f,0,.12,.18);if(u.rotation.x=-.55+(1-e.neck)*.4,ot(u,rt.limb,t,0,.16*e.neck,0,.15,.34*e.neck,.15),e.mane){const M=$t(e.mane);ot(u,rt.ball,M,0,.14,-.02,.36,.4,.3);for(let y=0;y<9;y++){const E=y/9*Math.PI*2,v=ot(u,rt.cone,M,Math.cos(E)*.3,.2+Math.sin(E)*.28,-.05,.09,.26,.09);v.rotation.z=E-Math.PI/2}}const d=Dt(u,0,.34*e.neck,.02);d.rotation.x=.55,ot(d,rt.ball,t,0,.02,0,.19,.17,.2),ot(d,rt.box,t,0,0,.2*e.snout,.14,.1,.26*e.snout),ot(d,rt.ball,s,0,.03,.34*e.snout,.05,.045,.04);const g=Dt(d,0,-.06,.05);ot(g,rt.box,n,0,-.02,.14*e.snout,.12,.05,.24*e.snout);for(const M of[-1,1]){if(ot(d,rt.ball,r,M*.1,.07,.12,.035,.03,.02),e.ears==="pointed"){const y=ot(d,rt.cone,s,M*.1,.2,-.05,.06,.16,.04);y.rotation.z=M*-.25}else e.ears==="round"&&ot(d,rt.ball,s,M*.12,.15,-.06,.06,.06,.03);if(e.horns==="curl")for(let y=0;y<4;y++)ot(d,rt.ball,$t(14207911),M*(.16+y*.06),.18+Math.sin(y*.9)*.08,-.08-y*.06,.06-y*.008);else if(e.horns==="spike"){const y=ot(d,rt.cone,$t(13222568),M*.08,.2,-.12,.05,.3,.05);y.rotation.x=-.8}if(e.tusks){const y=ot(g,rt.cone,$t(15655618),M*.07,.1,.26*e.snout,.03,.16,.03);y.rotation.x=-.4}if(i==="horned_maw"||e.jaw)for(let y=0;y<3;y++){const E=ot(d,rt.cone,$t(15919826),M*(.03+y*.02),-.07,.18+y*.06,.015,.06,.015);E.rotation.x=Math.PI}}const x=[];for(const M of[!0,!1])for(const y of[-1,1]){const E=Dt(M?f:h,y*.16,M?-.05:0,M?.04:0),v=l*.52,b=l*.5;ot(E,rt.ball,t,0,-.04,0,.11,.14,.13),wr(E,t,v,.08);const C=Dt(E,0,-v,0);wr(C,s,b,.055),ot(C,rt.ball,s,0,-b,.04,.06,.035,.08),x.push({hip:E,knee:C,front:M,side:y})}const p=[];let m=Dt(h,0,.1,-.26);const S=e.tail==="short"?2:5;for(let M=0;M<S;M++){const y=Dt(m,0,0,M?-.13:0);y.rotation.x=M?.12:-2.1,ot(y,rt.limb,M%2?s:t,0,.07,0,.055-M*.007,.16,.055-M*.007),m=Dt(y,0,.14,0),p.push(y)}e.tail==="tuft"&&ot(m,rt.ball,$t(e.mane??e.dark),0,.02,0,.08,.1,.08);let w=0,_=0;return{root:o,waterAnchor:a,height:(l+.62)*e.size+.2,animate({time:M,dt:y,speed:E,distance:v,attackAge:b,hurtAge:C,death:R=0}){w+=v/(.9*e.size),_=ln(_,Math.min(1,E/1.2),9,y);const{windup:T,swing:P,recoil:I}=Js(b),U=Zs(C),k=w*Math.PI*2,D=Math.sin(M*2.1);a.position.y=Math.abs(Math.sin(k))*.04*_-T*.08-R*.35,a.position.z=-T*.12+P*.42-U*.16,a.rotation.x=T*.12-P*.16-U*.14,a.rotation.z=R*1.4,f.position.y=l+.06+D*.012-T*.05,u.rotation.x=-.55+(1-e.neck)*.4-T*.25+P*.35+Math.sin(M*.9)*.04*(1-_),d.rotation.x=.55+T*.2-P*.3+U*.3,d.rotation.y=Math.sin(M*.6)*.18*(1-_)*(1-P),g.rotation.x=.08+D*.03+(T*.35+P*.7+I*.2)*(e.jaw??1);for(const z of x){const O=k+(z.front===z.side>0?0:Math.PI),B=Math.max(0,Math.sin(O));z.hip.rotation.x=Math.cos(O)*.45*_+(z.front?-P*.5:P*.2)+T*(z.front?.2:-.15),z.knee.rotation.x=(z.front?-1:1)*(B*.7*_+T*.25+.08)}p.forEach((z,O)=>{z.rotation.y=Math.sin(M*2.4-O*.7)*(.12+_*.1+U*.4),z.rotation.x=(O?.12:-2.1)+Math.sin(M*1.6-O*.6)*.05+T*.1})}}}const gl={giant_spider:{shell:2826792,under:6109754,dark:1314578,eye:16726832,size:1.1,legs:4,abdomen:1.5,mandibles:!0,eyes:8},carapace_beetle:{shell:3103314,under:1911593,dark:922900,eye:11992970,size:1.05,legs:3,abdomen:1.2,mandibles:!0,eyes:2,shellPlates:!0},forest_wasp:{shell:14198842,under:2760725,dark:1446154,eye:16742954,size:.9,legs:3,abdomen:1,wings:!0,eyes:2},tide_crawler:{shell:4025734,under:13087372,dark:1715254,eye:16773800,size:1.15,legs:3,abdomen:.9,claws:!0,eyes:2,shellPlates:!0}};function sS(i){const e=gl[i]??gl.carapace_beetle,t=$t(e.shell),n=$t(e.under),s=$t(e.dark),r=$t(e.eye,e.eye,1.2),o=new et,a=Dt(o,0,0,0);a.scale.setScalar(e.size);const c=e.wings?.9:0,l=.36+c,h=Dt(a,0,l,.05);ot(h,rt.ball,t,0,0,0,.2,.17,.22);const f=Dt(h,0,.04,-.18);if(f.rotation.x=e.wings?.5:-.12,ot(f,rt.ball,t,0,0,-.26*e.abdomen,.27*e.abdomen,.24*e.abdomen,.34*e.abdomen),e.wings)for(let S=0;S<3;S++)ot(f,rt.box,n,0,0,-.12-S*.14,.5,.05,.04);if(e.wings){const S=ot(f,rt.cone,s,0,-.02,-.62,.04,.2,.04);S.rotation.x=-Math.PI/2}if(e.shellPlates)for(const S of[-1,1]){const w=ot(f,rt.ball,$t(e.shell+657930),S*.1,.1,-.3,.17,.1,.36);w.rotation.z=S*.25}i==="giant_spider"&&ot(f,rt.box,$t(11549230,5904400),0,.25,-.36,.1,.02,.16);const u=Dt(h,0,.02,.22);ot(u,rt.ball,s,0,0,.04,.14,.12,.13);for(let S=0;S<e.eyes;S++){const w=S%2?1:-1,_=Math.floor(S/2);ot(u,rt.ball,r,w*(.05+_*.025),.06+_*.03,.15-_*.02,.028-_*.003)}const d=[];if(e.mandibles||e.claws)for(const S of[-1,1]){const w=Dt(u,S*.07,-.05,.14);if(e.claws){const _=Dt(h,S*.2,0,.15);_.rotation.set(-.4,S*.5,S*.6),wr(_,t,.3,.05);const M=Dt(_,0,-.3,0);M.rotation.x=-1.1,ot(M,rt.ball,t,0,-.12,0,.1,.16,.08),ot(M,rt.cone,s,S*.04,-.28,0,.04,.14,.04),d.push(_)}else ot(w,rt.cone,$t(10193514),0,0,.06,.025,.14,.025).rotation.set(Math.PI/2,0,S*.5),d.push(w)}const g=[];for(const S of[-1,1])for(let w=0;w<e.legs;w++){const _=Dt(h,S*.15,-.03,.12-w*.3/Math.max(1,e.legs-1));_.rotation.set(0,S*(-.5+w*1/Math.max(1,e.legs-1)),S*-1.05),wr(_,s,.36,.03);const M=Dt(_,0,-.36,0);M.rotation.z=S*1.6,wr(M,s,.42+c*.12,.025,.012),g.push({hip:_,knee:M,side:S,i:w})}const x=[];if(e.wings)for(const S of[-1,1]){const w=new ut({color:13624298,emissive:3228234,roughness:1,transparent:!0,opacity:.55}),_=Dt(h,S*.08,.12,0);ot(_,rt.ball,w,S*.32,0,-.05,.32,.015,.12),x.push(_)}let p=0,m=0;return{root:o,waterAnchor:a,height:(l+.45)*e.size,animate({time:S,dt:w,speed:_,distance:M,attackAge:y,hurtAge:E,death:v=0}){p+=M/.45,m=ln(m,Math.min(1,_/1.2),9,w);const{windup:b,swing:C}=Js(y),R=Zs(E),T=p*Math.PI*2;a.position.y=(e.wings?Math.sin(S*3.1)*.08:Math.abs(Math.sin(T*2))*.015)-v*(l*.8),a.position.z=-b*.1+C*.38-R*.12,a.rotation.z=v*2.6,h.rotation.x=-b*.45+C*.3-R*.2,f.rotation.x=(e.wings?.5+C*.9:-.12+Math.sin(S*1.8)*.04)+b*.2,u.rotation.y=Math.sin(S*1.1)*.1,d.forEach((P,I)=>{P.rotation.y=(I?-1:1)*(Math.sin(S*4)*.1+b*.6-C*.5)}),x.forEach((P,I)=>{P.rotation.z=(I?-1:1)*Math.sin(S*38)*.6});for(const P of g){const I=T+(P.i+(P.side>0?1:0))%2*Math.PI,U=Math.max(0,Math.sin(I))*m,k=P.i===0;P.hip.rotation.x=Math.cos(I)*.35*m+(k?-b*.9+C*.4:0),P.hip.rotation.z=P.side*(-1.05+U*.35+(k?b*.5:0))+(e.wings?P.side*.5:0),P.knee.rotation.z=P.side*(1.6-U*.4+Math.sin(S*2+P.i)*.04)}}}}const rS=i=>i in ml,oS=i=>i in gl,aS={goblin_scout:{scale:.72,skin:7311164,cloth:5914919,armor:8022610},gremlin:{scale:.6,skin:9071262,cloth:3878725,armor:6247784},lizard_raider:{scale:.95,skin:5013339,cloth:8079914,armor:9140826},scale_sentinel:{scale:1.12,skin:4157282,cloth:3099242,armor:6130304},hollow_cultist:{scale:1,skin:13616816,cloth:4008527,armor:2761267,glow:5909130},stone_ogre:{scale:1.45,skin:8225657,cloth:5195318,armor:6183504},bone_knight:{scale:1.08,cloth:6954012,armor:4475478},bone_crawler:{scale:.85,cloth:3815984},pale_wraith:{scale:1.05,skin:12572392,cloth:9416904,armor:10994390,glow:6129320,float:!0},pyre_shade:{scale:1,skin:2759702,cloth:3809304,armor:3023904,glow:11683599,float:!0}};function cS(i,e){const t=aS[e];if(!t)return i;i.root.scale.setScalar(t.scale),i.height*=t.scale;const n=new Set;if(i.root.traverse(s=>{if(!(s instanceof Ye)||!(s.material instanceof ut)||n.has(s.material))return;const r=s.material;n.add(r);const o=r.color.getHex();(o===11708557||o===12960167)&&t.skin?r.color.setHex(t.skin):(o===9065795||o===5264489)&&t.cloth?r.color.setHex(t.cloth):o===10590084&&t.armor&&r.color.setHex(t.armor),t.glow&&o!==2698797&&(r.emissive.setHex(t.glow),r.emissiveIntensity=.35)}),t.float){const s=i.animate;i.animate=r=>{s(r),i.root.children[0].position.y+=.25+Math.sin(r.time*1.8)*.08}}return i}function ch(i=!1,e=!1){const t=new et,n=new et;n.scale.set(i?.72:.73,1,1),t.add(n);const s=new et;s.scale.z=.78,n.add(s);const r=new ut({color:i?10590084:12892065,roughness:.9,flatShading:!0}),o=new ut({color:i?9065795:11948866,roughness:1,flatShading:!0}),a=new ut({color:2698797,roughness:1,flatShading:!0}),c=new ut({color:11708557,roughness:1,flatShading:!0}),l=new ut({color:13938023,roughness:.8,flatShading:!0});function h(b,C,R,T,P,I=s){const U=new Ye(b,C);return U.position.set(R,T,P),U.castShadow=!0,U.receiveShadow=!0,I.add(U),U}const f=(b,C,R,T,P,I,U,k=s)=>h(new Un(b,C,R),T,P,I,U,k),u=(b,C,R,T=s)=>{const P=new et;return P.position.set(b,C,R),T.add(P),P};h(new Pt(.245,.19,.59,8),r,0,1.3,0),f(.36,.12,.29,a,0,.99,0),f(.12,.09,.03,r,0,1.01,.2),h(new Pt(.2,.245,.34,8,1,!0),o,0,.88,-.02),f(.25,.57,.065,o,0,1.29,.28),f(.3,.39,.16,a,0,1.34,-.24);const d=u(0,1.78,0);if(d.scale.setScalar(i?.76:.81),e){r.color.setHex(12960167),o.color.setHex(5264489),h(new qi(.25,8,6),r,0,.015,0,d);for(const b of[-.1,.1])f(.12,.12,.06,a,b,.03,.23,d);f(.09,.09,.05,a,0,-.08,.24,d),f(.22,.075,.11,r,0,-.2,.15,d);for(let b=0;b<4;b++)f(.37-b*.025,.045,.09,r,0,1.47-b*.105,.32)}else{h(new qi(.27,7,6),i?r:o,0,0,-.025,d),f(.29,.23,.09,a,0,-.015,.22,d),f(.23,.075,.02,c,0,-.065,.272,d);for(const b of[-.065,.065])f(.045,.028,.022,l,b,.025,.272,d);h(new In(.26,.19,5),i?r:o,0,.2,-.05,d),f(.38,.12,.33,o,0,1.57,0),f(.1,.1,.035,l,-.15,1.56,.245)}const g=[-1,1].map(b=>{const C=u(b*.32,1.48,0);C.rotation.z=b*.1,h(new qi(.115,6,4),r,0,-.03,0,C),h(new Pt(.085,.067,.34,6),o,0,-.21,0,C);const R=u(0,-.36,.015,C);return h(new Pt(.078,.06,.3,6),r,0,-.14,0,R),h(new qi(.08,6,4),a,0,-.33,.02,R),{arm:C,forearm:R}}),x=[-1,1].map(b=>{const C=u(b*.14,.83,0,n);h(new Pt(.092,.073,.37,6),o,0,-.17,0,C);const R=u(0,-.36,0,C);h(new Pt(.1,.08,.3,6),r,0,-.15,0,R);const T=f(.14,.13,.25,a,0,-.32,.065,R);return{leg:C,shin:R,boot:T}}),p=f(.085,.75,.1,a,-.32,.78,-.04);if(p.rotation.z=-.23,f(.27,.055,.07,r,-.4,1.15,-.04),i){const b=h(new Pt(.04,.045,1.5,5),o,0,.12,.1,g[1].forearm);b.rotation.x=-.12,h(new Ni(.07),r,0,.88,.02,g[1].forearm)}else{const b=u(0,-.28,.06,g[1].forearm);b.rotation.x=-.38,f(.1,.25,.09,a,0,0,0,b),f(.34,.07,.1,l,0,.15,0,b);const C=h(new Pt(0,.12,.78,4),r,0,.58,0,b);C.scale.z=.35,h(new Ni(.09),l,0,-.17,0,b),h(new gn(.16,0),r,-.33,1.49,0).scale.set(1,.65,1),f(.22,.04,.25,l,-.33,1.49,.045),f(.12,.55,.045,a,-.1,1.28,.33).rotation.z=-.46;const T=u(-.43,1.01,.25);T.name="traveller-lantern";const P=new ut({color:16766613,emissive:16757568,emissiveIntensity:1.5,roughness:1});f(.17,.24,.14,P,0,0,0,T);for(const I of[-.14,.14])f(.23,.04,.2,l,0,I,0,T);for(const I of[-.1,.1])f(.025,.28,.025,a,I,0,.085,T);h(new ia(.08,.018,4,8),l,0,.23,0,T)}const m=[];let S=u(0,1.51,-.31);for(let b=0;b<3;b++){const C=u(0,b?-.24:0,0,S);f((i?.33:.37)+b*.025,.29,.025,o,0,-.14,0,C),m.push(C),S=C}let w=0,_=0,M=0,y=0,E=0;const v=x.map(({boot:b})=>({anchor:b,step:0,grounded:!0}));return{root:t,height:2.15,feet:v,animate({time:b,dt:C,speed:R,distance:T,attackAge:P,hurtAge:I,sitting:U=0,looting:k=!1,casting:D=!1,death:z=0,wading:O=!1}){if(C===0)return;_=ln(_,Math.min(1,R/1.2),10,C),E=ln(E,Qt((R-1.55)/.9),6,C);const B=w;w+=T/(1.05+E*.2),M=ln(M,k&&R<.15?1:0,5,C);const V=w*Math.PI*2,j=_*(1-U),{windup:W,swing:H,recoil:X}=Js(P),Q=Zs(I),$=Math.sin(b*1.9),Z=Qt(U);n.position.y=(Math.cos(V*2)*(.028+E*.045)-.028-E*.03)*j+$*.009*(1-j)-Z*.52-M*.12-z*.4,n.position.x=Math.sin(V)*.023*j,n.position.z=-W*.08+H*.34-Q*.12,n.rotation.x=.045*j+E*.24-W*.08+H*.13-Q*.17+Z*.13+M*.42,n.rotation.z=Math.sin(V)*.035*j-Q*.08+z*1.45,s.rotation.y=Math.sin(V)*.13*j-W*.3+H*.38,s.rotation.z=-Math.sin(V)*.018*j,r.emissive.setRGB(Q*.42,Q*.08,Q*.025),g.forEach(({arm:ie,forearm:fe},le)=>{const Se=Math.sin(V+le*Math.PI)*j*(1+E*.9);ie.rotation.x=Se*.32-.08-Z*.84-M*.58,ie.rotation.z=(le?1:-1)*(.1+Z*.1)+$*.012,fe.rotation.x=-.18-E*.75-Math.max(0,-Se)*.24-Z*.43,fe.rotation.y=0,le===1?(ie.rotation.x+=W*.7-H*(D?1.35:1.55)-X*.08,ie.rotation.z+=-W*.24+H*.13,fe.rotation.x+=-W*1.15+H*.12,fe.rotation.y=-W*.35+H*.2):(ie.rotation.x-=W*.25+H*.3,fe.rotation.x-=W*.4+(D?H*.7:H*.15))}),x.forEach(({leg:ie,shin:fe,boot:le},Se)=>{v[Se].step+=Math.floor(w+Se*.5)-Math.floor(B+Se*.5),v[Se].grounded=(w+Se*.5)%1<.6;const ue=eS(w+Se*.5,(.63+E*.12)*j),be=ue.z+(Se?-.08:.1)*H,ge=.68-ue.lift*j*(O?1.18:1)+n.position.y*(1-Z),xe=Math.min(.719,Math.max(.25,Math.hypot(be,ge))),pe=Math.PI-Math.acos(zt.clamp((.36**2+.36**2-xe**2)/(2*.36**2),-1,1)),ve=Math.atan2(-be,ge)-pe/2;ie.rotation.x=zt.lerp(ve,-1.5,Z),ie.rotation.z=(Se?1:-1)*Z*.07,fe.rotation.x=zt.lerp(pe,1.5,Z),le.rotation.x=-(ve+pe)*(1-Z)+ue.lift*j*.65}),d.rotation.y=Math.sin(b*.65)*.06*(1-j)-s.rotation.y*.55,d.rotation.x=Z*.14+M*.3+W*.06-H*.09-Q*.12,y=ln(y,j*.24+E*.35+H*.24-W*.1,4,C),m.forEach((ie,fe)=>{ie.rotation.x=.12+y+Math.sin(V-fe*.7)*j*.07+Math.sin(b*2.2-fe*.8)*.025+Z*.28,ie.rotation.z=Math.sin(V-fe*.8)*j*.035-s.rotation.y*.16})}}}function lS(i,e){if(/slime/.test(e))return tS();if(/serpent|snake/.test(e))return nS();if(rS(e))return iS(e);if(oS(e))return sS(e);if(i==="humanoid"||i==="undead")return cS(ch(!0,i==="undead"),e);const t=new et,n=new et;t.add(n);const s=new ut({color:i==="insect"?11639144:11640457,roughness:1,flatShading:!0}),r=new ut({color:6574923,roughness:1,flatShading:!0}),o=[];function a(p,m,S,w,_,M,y=s){const E=new Ye(new gn(1,1),y);return E.position.set(p,m,S),E.scale.set(w,_,M),E.castShadow=!0,n.add(E),E}const c=/snail/.test(e),l=/grub/.test(e),h=/gazer|watcher|seraph/.test(e),f=i==="elemental";if(h){s.color.setHex(11448512),r.color.setHex(5589091),a(0,1.1,0,.63,.55,.55),a(0,1.12,.48,.32,.34,.13,r);const p=new ut({color:14007155,emissive:3418382});a(0,1.12,.59,.19,.23,.04,p),a(0,1.12,.63,.08,.16,.025,r);for(let m=0;m<6;m++){const S=m/6*Math.PI*2,w=new Ye(new In(.11,.85,6),r);w.position.set(Math.cos(S)*.38,.46,Math.sin(S)*.35),w.rotation.z=Math.PI+Math.cos(S)*.4,n.add(w),o.push(w)}}else if(f){s.color.setHex(14326874),s.emissive.setHex(6500364),a(0,.95,0,.34,.53,.32),a(0,1.5,.02,.27,.25,.24);for(const p of[-1,1]){const m=new Ye(new In(.13,.43,5),r);m.position.set(p*.24,1.72,.01),m.rotation.z=p*-.4,n.add(m),a(p*.11,1.52,.24,.065,.07,.03,r),o.push(a(p*.45,.92,0,.13,.38,.15));const S=new Ye(new In(.15,.7,5),s);S.position.set(p*.19,.35,-.08),S.rotation.z=p*.3,n.add(S),o.push(S)}}else if(c){a(0,.17,.15,.32,.16,.85,r),a(0,.65,-.12,.4,.56,.58);const p=new ut({color:5258028,roughness:1});for(const m of[-1,1]){const S=Array.from({length:65},(_,M)=>{const y=M/64,E=.025+y*.49,v=y*Math.PI*4;return new F(m*.41*Math.sqrt(1-(E/.6)**2),.65+Math.cos(v)*E,-.12+Math.sin(v)*E)});n.add(new Ye(new Hl(new Xf(S),64,.038,5,!1),p));const w=new Ye(new Pt(.035,.05,.43,6),r);w.position.set(m*.16,.47,.78),w.rotation.z=m*-.3,n.add(w),o.push(w),a(m*.22,.69,.78,.065,.07,.065)}}else if(l){s.color.setHex(12087905);for(let p=0;p<7;p++)o.push(a(0,.25,.72-p*.22,.3,.26,.22));a(0,.27,.93,.22,.2,.19,r)}else if(i==="insect"){a(0,.42,0,.47,.33,.65),a(0,.4,.63,.27,.23,.27,r);const p=/spider/.test(e)?4:3;for(const m of[-1,1])for(let S=0;S<p;S++){const w=new Ye(new Pt(.035,.025,.75,5),r);w.position.set(m*.5,.25,-.4+S*.8/(p-1)),w.rotation.z=m*1.1,n.add(w),o.push(w)}}else{a(0,.73,0,.31,.4,.65),a(0,.91,.58,.25,.28,.33),a(0,.78,.89,.16,.14,.26,r);for(const m of[-1,1]){const S=new Ye(new In(.1,.29,4),r);S.position.set(m*.17,1.2,.5),n.add(S);for(const w of[-.43,.4]){const _=new Ye(new Pt(.08,.055,.57,5),r);_.position.set(m*.23,.31,w),_.castShadow=!0,n.add(_),o.push(_)}}const p=new Ye(new In(.13,.65,6),r);p.position.set(0,.7,-.84),p.rotation.x=-1.1,n.add(p)}const u=o.map(p=>({position:p.position.clone(),rotation:p.rotation.clone()})),d=s.emissive.clone();let g=0,x=0;return{root:t,waterAnchor:n,height:h?1.9:f?2.1:i==="insect"?1.1:l?.7:c?1.35:1.5,animate({time:p,dt:m,speed:S,distance:w,attackAge:_,hurtAge:M,death:y=0}){g+=w/(i==="insect"?.52:.85),x=ln(x,Math.min(1,S/1.2),9,m);const{windup:E,swing:v}=Js(_),b=Zs(M),C=h||f,R=g*Math.PI*2;n.position.y=Math.sin(p*2.2)*(C?.12:.035)+Math.cos(R*2)*.045*x-y*(C?.85:.18),n.position.z=-E*.15+v*.45-b*.13,n.rotation.x=E*.2-v*.26-b*.2+Math.sin(p*1.7)*.035,n.rotation.z=y*1.35+Math.sin(p*1.4)*.025*(1-y),n.scale.set(1,1,1),s.emissive.copy(d),s.emissive.r+=b*.4,s.emissive.g+=b*.08,o.forEach((T,P)=>{const I=u[P],U=R+P%2*Math.PI+Math.floor(P/2)*.6;T.position.copy(I.position),T.rotation.copy(I.rotation),h?(T.rotation.x+=Math.sin(p*2.1-P*.65)*.18+v*.3,T.rotation.z+=Math.sin(p*1.6-P*.7)*.12):f?(T.rotation.x+=Math.sin(p*2.6+P*1.8)*.16-v*.65,T.position.y+=Math.sin(p*3-P)*.05):c?T.rotation.x+=Math.sin(p*1.3+P)*.09-E*.3:l?(T.position.x+=Math.sin(p*2.5-P*.65)*(.025+x*.12),T.position.y+=Math.sin(p*3-P*.75)*.025):i==="insect"?(T.rotation.y+=Math.sin(U)*.28*x,T.rotation.z+=Math.max(0,Math.sin(U))*.18*x*(I.position.x>0?-1:1),T.rotation.x+=Math.sin(p*2.2-P*.7)*.12*(1-x)-v*.3):(T.rotation.x+=Math.sin(U)*.52*x-v*.15,T.position.y+=Math.max(0,Math.sin(U))*.07*x)})}}}const nf=20,hS=1.05;function uS(i){return Math.max(4,Math.round(i*hS/nf))*nf}const fS=i=>i-Math.floor(i);function vp(i){const e=Math.floor(i/9),t=fS(Math.sin(e*91.7)*43758.5),n=i-e*9;return t<.22?n<3.2?0:1:t<.5?2.1:1}const dS=(()=>{let i=0;const e=4e3;for(let t=0;t<e;t++)i+=vp(t*.9+.37);return i/e})();function pS(i,e){return e<=.5?1.45:Math.min(1.45,Math.max(.35,i/e/dS))}const yn=i=>i-Math.floor(i),sf=i=>{const e=Math.max(0,Math.min(1,i));return e*e*(3-2*e)},cc=[1,.63,.2],hr=[1,.94,.64],Eo=[.58,.78,1],rf=[.57,.51,.94],of=[.95,.3,.22],af=[1,.82,.38];function mS(i){const e=new F,t=new F,n=new di(16755285,0,7,2),s=new di(16762475,0,4.5,1.6),r=rh();let o=-10,a="slash",c=-10,l=-10,h=-1;return{light:n,aura:s,hit(f,u){u.target==="foe"&&u.spell&&(c=f),u.target==="hero"&&u.damage&&(l=f),u.damage&&(u.spell||a==="slash"||f-o>1.25)&&(o=f+Qo,a=u.spell??"slash",e.copy(u.target==="hero"?u.hero:u.foe??u.hero),e.y=.9,t.copy(u.target==="hero"?u.foe??u.hero:u.hero),t.y=1.25)},update(f,u,d){const{hero:g,foe:x,foeDead:p=!1,spawnAge:m=9,entry:S="charge",anchor:w}=d,_=f-o;n.position.copy(e),n.color.setHex(a==="fire"?16750879:9218815),n.intensity=a==="slash"||_<0?0:Math.max(0,1-_/1.25)*12;const M=(R,T,P,I,U,k,D=1)=>i.push(R,T,P,I*1.4,U,k,D);if(_>=0&&_<1.25){const R=e.x-t.x,T=e.z-t.z,P=Math.hypot(R,T)||1,I=R/P,U=T/P,k=-U,D=I,z=(O,B,V,j,W,H,X)=>{for(let Q=0;Q<8;Q++){const $=Q/8*Math.PI*2,Z="-\\|/-\\|/"[Q];for(let ie=1;ie<=3;ie++)M(O+k*Math.cos($)*j*ie/3,B+Math.sin($)*j*ie/3,V+D*Math.cos($)*j*ie/3,X,Z,H,W*(1.1-ie*.25))}};if(a==="fire"){const O=Math.min(1,_/pl),B=Math.max(0,_-pl),V=zt.lerp(t.x,e.x,O),j=zt.lerp(t.z,e.z,O),W=zt.lerp(t.y,e.y,O)+Math.sin(O*Math.PI)*.7;if(O<1){n.position.set(V,W,j),M(V,W,j,.32,"@",hr,1);for(let H=1;H<16;H++){const X=Math.max(0,O-H*.045);M(zt.lerp(t.x,e.x,X)+Math.sin(H*3+f*20)*.04,zt.lerp(t.y,e.y,X)+Math.sin(X*Math.PI)*.7,zt.lerp(t.z,e.z,X),.28-H*.014,"#%x*+:.."[Math.min(7,Math.floor(H/2))],H<4?[1,.85,.45]:cc,1-H/16)}}else{const H=B;for(let X=0;X<2;X++)for(let Q=0;Q<28;Q++){const $=Q/28*Math.PI*2,Z=H*(2.2-X*.7);M(e.x+Math.cos($)*Z,.1+X*.25,e.z+Math.sin($)*Z,.22,X?"o":"O",X?cc:[1,.85,.5],Math.max(0,1-H/.8))}for(let X=0;X<9;X++){const Q=X*2.399,$=.15+yn(X*.618)*.45;for(let Z=0;Z<6;Z++){const ie=Z/5;M(e.x+Math.cos(Q)*$,.1+ie*(1.3*Math.min(1,H*4)),e.z+Math.sin(Q)*$,.22-ie*.08,"@#%x+."[Z],ie<.3?hr:cc,Math.max(0,1-H/.9)*(1-ie*.4))}}H<.3&&z(e.x,e.y,e.z,.4+H*3,1-H/.3,[1,.9,.55],.2)}}else if(a==="lightning"){const O=.6+.4*Math.cos(_*60)**2,B=Math.max(0,1-_*2.4)*O;let V=e.x,j=e.z;for(let W=0;W<26;W++){const H=e.y+W*.22,X=Math.sin(Math.floor(_*24)*3.1+W*2.7)*.14,Q=Math.abs(X)<.05?"|":X>0?"/":"\\";if(M(V,H,j,.24,Q,[.92,.96,1],B),M(V+k*.1,H,j+D*.1,.2,Q,Eo,B*.8),M(V-k*.1,H,j-D*.1,.2,Q,rf,B*.6),V+=k*X,j+=D*X,W%7===3)for(let $=1;$<4;$++)M(V+k*$*.14*(W%2?1:-1),H-$*.12,j+D*$*.14,.16,W%2?"\\":"/",Eo,B*.7)}for(let W=0;W<36;W++){const H=W/36*Math.PI*2,X=.3+_*2.4*(.6+yn(W*.4)*.4);M(e.x+Math.cos(H)*X,.06,e.z+Math.sin(H)*X,.18,"~-=+"[W%4],W%3?Eo:rf,Math.max(0,1-_*1.4))}_<.25&&z(e.x,e.y,e.z,.7,1-_/.25,[.85,.92,1],.22)}else if(a==="frost"){for(let O=0;O<13;O++){const B=O/13*Math.PI*2,V=.55+_*.4,j=(.7+yn(O*.618)*1.4)*sf((_-O*.012)*6);for(let W=0;W<9;W++){const H=W/8;M(e.x+Math.cos(B)*V*(1-H*.25),.08+H*j,e.z+Math.sin(B)*V*(1-H*.25),.24-H*.08,W===8?"^":W>5?"A":"#",W>5?[.85,.95,1]:Eo,Math.min(1,(1.25-_)*3))}}for(let O=0;O<20;O++){const B=yn(_*1.5+O*.618),V=O*2.399;M(e.x+Math.cos(V)*B*1.2,.3+B*1.4,e.z+Math.sin(V)*B*1.2,.16,"*",[.85,.95,1],(1-B)*Math.min(1,(1.25-_)*3))}}else if(_<.6){const O=Math.min(1,_/.16);for(let B=0;B<3;B++)for(let V=0;V<18;V++){const j=V/17;if(j>O)continue;const W=O-j,H=Math.max(0,1-W*2.2)*Math.max(0,1-Math.max(0,_-.16)/.3);if(H<=0)continue;const X=-1.1+j*2.2,Q=.75+B*.12,$=W<.12?B===1?"#":"/":W<.35?B===1?"/":"-":B===1?":":".";M(e.x+k*Math.sin(X)*Q-I*.25,e.y+Math.cos(X)*Q*.6-.15,e.z+D*Math.sin(X)*Q-U*.25,.2+(B===1?.04:0),$,W<.12?hr:[.75,.88,1],H)}_>.12&&_<.4&&z(e.x,e.y,e.z,.25+(_-.12)*2.5,1-(_-.12)/.28,hr,.2);for(let B=0;B<18;B++){const V=Math.max(0,_-.12),j=B*2.399,W=1.4+yn(B*.37)*1.6;V<=0||M(e.x+k*Math.cos(j)*W*V-I*V*.6,e.y+Math.sin(j)*W*V*.7+1.2*V-4.5*V*V,e.z+D*Math.cos(j)*W*V-U*V*.6,.14,B%3?".":"*",[1,.85,.5],Math.max(0,1-V/.45))}}}const y=f-l-Qo+.05;if(y>=0&&y<.5){const R=Math.min(1,y/.12),T=Math.max(0,1-Math.max(0,y-.12)/.38),P=new F().setFromMatrixColumn(u.matrixWorld,0),I=P.x,U=P.z;for(let k=0;k<3;k++)for(let D=0;D<9;D++){const z=D/8;if(z>R)continue;const O=(k-1)*.2;M(g.x+I*(O+(z-.5)*.5),1.75-z*1.1,g.z+U*(O+(z-.5)*.5),.22,z>R-.2?"#":"\\",[1,.28+z*.1,.22],T)}}x&&p?h<0&&(h=f):h=-1;const E=h<0?-1:f-h;if(E>=0&&E<1.6)for(let R=0;R<60;R++){const T=Math.min(1,E/1.6),P=R*2.399,I=yn(R*.618),U=Math.max(0,E-I*.4);U<=0||M(x.x+Math.cos(P)*(.2+U*.6),.2+I*1.1+U*1.3,x.z+Math.sin(P)*(.2+U*.5),.17,"@#%*+:."[Math.min(6,Math.floor(U*5))],R%4?[.9,.82,.66]:[1,.6,.25],Math.max(0,1-U/1.2)*(1-T*.3))}if(x&&(x&&!p)&&m>.5){const R=sf((m-.5)/.6),T=.95;for(let P=0;P<64;P++){const I=P/64*Math.PI*2+f*.25;i.push(x.x+Math.cos(I)*T,.05,x.z+Math.sin(I)*T*.92,P%8?.15:.19,P%8?"o":"*",of,.8*R*(P%2?.65:1))}}const b=f-l;if(b>=0&&b<.6){const R=Math.min(1,b/.28),T=b<.28?1.2-R*.8:.4+(b-.28)*2.2,P=b<.28?.35+R*.6:Math.max(0,1-(b-.28)/.32);for(let I=0;I<40;I++){const U=I/40*Math.PI*2;i.push(g.x+Math.cos(U)*T,.06,g.z+Math.sin(U)*T,b<.28?.15:.2,b<.28?"o":"*",of,P)}}const C=f-c;if(s.intensity=0,C>=0&&C<1.1){const R=Math.sin(Math.min(1,C/1.1)*Math.PI);s.intensity=R*9,s.position.set(g.x,.9,g.z);for(let T=0;T<36;T++){const P=T/36*Math.PI*2+C*5,I=Math.sin(P*2+C*3)*.12;i.push(g.x+Math.cos(P)*.62,.95+I,g.z+Math.sin(P)*.62,T%3?.15:.2,T%3?"o":"*",af,R*.9)}for(let T=0;T<26;T++){const P=yn(C*1.4+T*.618),I=T*2.399;i.push(g.x+Math.cos(I)*(.25+P*.3),.1+P*2.1,g.z+Math.sin(I)*(.25+P*.3),T%2?.13:.17,T%2?"+":"*",T%3?af:hr,R*(1-P))}}if(x&&w&&m<2.2){const R=[.5,.4,.27];if(S==="rise"){const T=Math.min(1,m/.3),P=Math.max(0,1-Math.max(0,m-1.2)/1);for(let I=0;I<10;I++){const U=I/10*Math.PI*2+.3,k="-\\|/-\\|/-\\"[Math.round(I/10*8)%8];for(let D=1;D<=4;D++){if(D/4>T)continue;const z=.25+D*.22*(1+yn(I*.37)*.4);i.push(w.x+Math.cos(U)*z,.04,w.z+Math.sin(U)*z,.2,k,[.3,.24,.16],P*.95)}}for(let I=0;I<46;I++){const U=m-.2-yn(I*.618)*.9;if(U<0||U>.9)continue;const k=I*2.399,D=1+yn(I*.41)*1.5;i.push(w.x+Math.cos(k)*(.2+D*U*.6),.1+D*U*1.6-3.2*U*U,w.z+Math.sin(k)*(.2+D*U*.6),.18,",.`;:o*"[I%7],I%5?R:[.62,.56,.44],1-U/.9)}}else if(S==="charge")m<1.4&&r.add(x.x,x.z,f,.045);else for(let T=0;T<24;T++){const P=m-yn(T*.618)*.8;P<0||P>.7||i.push(x.x+Math.sin(T*3.1)*.6,x.y+.4+P*1.6+yn(T*.37)*.6,x.z+Math.cos(T*2.3)*.6,.18,T%2?"~":"-",[.7,.78,.82],(1-P/.7)*.8)}}r.push(i,f)}}}const lc=[{id:"forest_wolf",family:"beast",name:"Forest Wolf"},{id:"crimson_grub",family:"insect",name:"Crimson Grub"},{id:"giant_spider",family:"insect",name:"Giant Spider"},{id:"forest_wasp",family:"insect",name:"Forest Wasp"},{id:"goblin_scout",family:"humanoid",name:"Goblin Scout"}],hc=[{target:"foe",damage:!0},{target:"hero",damage:!0},{target:"foe",damage:!0,spell:!0},{target:"hero",damage:!1},{target:"foe",damage:!0},{target:"hero",damage:!0},{target:"foe",damage:!0,spell:!0}],gS=1.6,xS=.85,vS=1.4,_S=3.2,cf=i=>Qo+(i==="fire"?pl:0);function yS(i,e,t){const n=i.createParticles(1600);i.add(n.mesh,{glyph:"particle"});const s=mS(n);i.scene.add(s.light,s.aura),t&&(t.setGlow(0,s.light),t.setGlow(1,s.aura));const r=new et,o=new ut({color:14006906,roughness:1}),a=new Ye(new gn(.2,1),o);a.scale.set(.85,1,.7),r.add(a);const c=new Ye(new ia(.08,.025,4,6),o);c.position.y=.19,c.rotation.x=Math.PI/2,r.add(c),i.add(r,{type:"hero"}),r.visible=!1;let l=null,h=lc[0],f=0,u=-1,d=0,g=-1,x="charge",p=0,m="lightning",S=-10,w=-10,_=-10,M=-10,y=!1;const E=new F,v=new F,b=new F;function C(){l&&i.remove(l.root,{dispose:!0}),l=null,r.visible=!1,i.setActors({foe:null})}return{get active(){return u>=0},get foe(){return l?.root.position},get name(){return l?h.name:""},get state(){return u<0?"walk":g>=0?"defeat":"fight"},begin(R,T,P){C(),h=lc[f++%lc.length],m=["lightning","fire","frost"][f%3],l=lS(h.family,h.id),i.add(l.root,{type:"creature"}),u=d=R,g=-1,p=0;const I=new F().setFromMatrixColumn(P.matrixWorld,0).setY(0).normalize();v.copy(T).addScaledVector(I,Math.sign(I.dot(T)||1)*.9).normalize(),E.copy(e.root.position).addScaledVector(v,2.35),E.y=0,x=h.family==="undead"||/grub|snail|crawler|slime/.test(h.id)?"rise":/wasp|gazer|watcher|seraph|orb|grimoire|imp|wraith|shade/.test(h.id)?"swoop":"charge",l.root.position.copy(E).addScaledVector(v,x==="charge"?11:x==="swoop"?9:0),x==="rise"&&(l.root.position.y-=l.height+.2),l.root.rotation.y=Math.atan2(-v.x,-v.z)+.25},update(R,T){if(u<0||!l)return n.clear(),s.update(R,i.camera,{hero:e.root.position}),!1;const P=R-u;for(;p<hc.length&&P>=gS+p*xS;){const V=hc[p++],j=p===hc.length,W=V.spell||j?m:void 0;s.hit(R,{target:V.target,damage:V.damage,spell:V.target==="foe"?W:void 0,hero:e.root.position,foe:l.root.position}),V.target==="foe"?(_=R,y=!!W,V.damage&&(w=R+cf(W))):(S=R,V.damage&&(M=R+Qo)),j&&(g=R+cf(W))}const I=R-d;if(b.copy(l.root.position),x==="charge"){const V=Math.min(1,I/1.6),j=V<.75?1-V*1.08:.19*(1-Qt((V-.75)/.25));l.root.position.copy(E).addScaledVector(v,Math.max(0,j)*11)}else if(x==="swoop"){const V=1-(1-Math.min(1,I/1.5))**2;l.root.position.copy(E).addScaledVector(v,(1-V)*9),l.root.position.y=E.y+(1-V)*4}else{const V=Qt((I-.25)/1.25);l.root.position.copy(E),l.root.position.y=E.y-(1-V)*(l.height+.2),l.root.position.x+=Math.sin(I*40)*.025*(1-V)}const U=b.distanceTo(l.root.position),k=Math.atan2(e.root.position.x-l.root.position.x,e.root.position.z-l.root.position.z);l.root.rotation.y=Hs(l.root.rotation.y,k+.25,7,T),e.root.rotation.y=Hs(e.root.rotation.y,k+Math.PI-.2,6,T);const D=g>=0&&R>=g,z=D?Qt((R-g)/.85):0;l.root.visible=z<1;const O=Math.min(U,T*3.2);l.animate({time:R,dt:T,speed:T>0?O/T:0,distance:O,attackAge:R-S,hurtAge:R-w,death:z}),e.animate({time:R,dt:T,speed:0,distance:0,attackAge:R-_,hurtAge:R-M,casting:y}),i.setActors({foe:l.root.visible?l.root.position:null,foeHeight:l.height});const B=D?Math.max(0,R-g-.55):0;return r.visible=D&&R-g>.55,r.position.set(l.root.position.x,.24+Math.abs(Math.sin(Math.min(1,B/.7)*Math.PI*2))*.14*Math.exp(-B*3),l.root.position.z),r.rotation.y=Math.min(B,.7)*2,n.clear(),s.update(R,i.camera,{hero:e.root.position,foe:l.root.position,foeDead:D,spawnAge:I,entry:x,anchor:E}),D&&R-g>vS+_S&&(C(),u=-1),!0}}}const ri=20,xl=3,MS=30,lf=3,_p=`
  uniform vec4 streams[${xl}];
  uniform vec3 campAt;
  ${Xd}
  float soilHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float soilNoise(vec2 p) {
    vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
    return mix(mix(soilHash(i), soilHash(i + vec2(1., 0.)), f.x), mix(soilHash(i + vec2(0., 1.)), soilHash(i + 1.), f.x), f.y);
  }
  ${jl}
  // .x: bare soil 0-1 (trail, camp clearing, banks). .y: water bed.
  vec2 forestSoil(vec2 p) {
    float edge = (soilNoise(p * 2.4) - .5) * .5;
    float path = 1. - smoothstep(.26, .6, abs(trailOffset(p)) + edge);
    float clearing = 1. - smoothstep(.75, 1.25, distance(p, campAt.xz) + edge);
    float bank = 0., bed = 0.;
    for (int i = 0; i < ${xl}; i++) {
      if (streams[i].w == 0.) continue;
      float inside = waterEdge(p, streams[i]);
      bank = max(bank, smoothstep(-.75 + edge * .4, -.1, inside));
      bed = max(bed, smoothstep(-.05, .1, inside));
    }
    return vec2(min(1., max(path * .85, max(clearing, bank * .8))), bed);
  }
`,SS=(i,e)=>i[Math.floor(e()*i.length)];function bS(i){return{count:Math.round(9e4*(36/26)**2),y:()=>-.06,density:()=>1,infinite:{glsl:_p,uniforms:i,span:36},pick(e){const t=e()<.012,n=.55+e()*.6,s=e();return t?{glyph:6+Math.floor(e()*2),height:.2,color:[.62*n,.66*n,.5*n]}:{glyph:SS([0,0,1,2,5,5,3],e),height:.12+e()*.16,color:[(.2+s*.14)*n,(.46+s*.06)*n,(.26-s*.1)*n]}}}}function wS(i,e={}){const t=ah(),n=e.hunt??90;let s=Wd(uS(n),ri);const r={loopShape:{value:[...s.shape]},streams:{value:Array.from({length:xl},()=>new st(0,0,0,0))},campAt:{value:new F(0,0,9999)}},o=new ut({color:16777215,roughness:1});o.onBeforeCompile=W=>{Object.assign(W.uniforms,r),W.vertexShader=W.vertexShader.replace("#include <common>",`#include <common>
varying vec3 forestWorld;`).replace("#include <begin_vertex>",`#include <begin_vertex>
forestWorld = (modelMatrix * vec4(transformed, 1.)).xyz;`),W.fragmentShader=W.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 forestWorld;
${_p}`).replace("#include <color_fragment>",`#include <color_fragment>
        vec2 fp = forestWorld.xz;
        float mottle = soilNoise(fp * .32) * .55 + soilNoise(fp * .7 + 7.) * .3 + soilNoise(fp * 1.4 + 3.) * .15;
        float tuft = soilNoise(fp * 1.7 + 30.);
        vec3 moss = vec3(.15 + mottle * .09 + tuft * .07, .34 + mottle * .18 + tuft * .1, .11 + (1. - mottle) * .05);
        float dry = max(0., soilNoise(fp * .18 + 11.) - .55) * 2.2;
        moss += vec3(.13, .04, 0.) * dry;
        vec2 soil = forestSoil(fp);
        vec3 dirt = vec3(.36, .33, .26) * (.75 + tuft * .5);
        vec3 ground = mix(moss, dirt, soil.x) * .62;
        ground *= 1. - soil.y * .9;
        diffuseColor.rgb = pow(ground, vec3(2.2));`)},o.customProgramCacheKey=()=>"forest-world-floor";const a=new Ye(new xn(64,64),o);a.rotation.x=-Math.PI/2,a.position.y=-.07,a.receiveShadow=!0,i.add(a,e.screen?{glyph:"screen",surface:"earth"}:{type:"ground"});const c=new F,l=new F,h=gp(t);i.add(h,e.screen?{glyph:"screen"}:{});const f=i.createParticles(1600);i.add(f.mesh,{glyph:"particle"});const u=dp(f,c);i.scene.add(u.light);function d(){const W=s.point(0);c.set(W.x-W.nx*2.6,0,W.z-W.nz*2.6),l.set(W.x-W.nx*1.4,0,W.z-W.nz*1.4),h.position.copy(c),h.rotation.y=Math.atan2(-W.nz,W.nx),r.campAt.value.copy(c),h.updateMatrixWorld(!0)}d(),i.setLights({hearth:c});const g=i.createCarpet(bS(r));e.screen||i.add(g.mesh,{glyph:"carpet"});function x(W){let H=(Math.imul(W+7919,2654435761)^1540483477)>>>0;return()=>(H=Math.imul(H,1664525)+1013904223>>>0,H/4294967296)}function p(W){if(W<1||W>=s.chunks-1)return;const H=x(W*31+5),X=H();if(X>.46)return;const Q=s.point(W*ri+ri/2+(H()-.5)*8);if(X<.2)return{kind:"stream",x:Q.x,z:Q.z,angle:Math.atan2(Q.nz,Q.nx)+(H()-.5)*.6,size:.9+H()*.6};const $=2.4+H()*2.2,Z=H()<.5?-1:1,ie=Z*($*1.25+1.6);return{kind:"pond",x:Q.x+Q.nx*ie,z:Q.z+Q.nz*ie,angle:H()*6,size:$}}function m(W){const H=x(W),X=new et;X.name=`chunk-${W}`;const Q=[],$=W*ri,Z=(xe,pe)=>{const ve=s.point($+xe);return{x:ve.x+ve.nx*pe,z:ve.z+ve.nz*pe}},ie=p(W),fe=(xe,pe,ve)=>!(Math.abs(s.offset(xe,pe))<ve||Math.hypot(xe-c.x,pe-c.z)<4.5+ve||ie&&li(ie,xe,pe)>-ve*.6);for(let xe=0;xe<11;xe++){const{x:pe,z:ve}=Z(H()*ri,(H()<.5?-1:1)*(2.6+H()*11));if(!fe(pe,ve,2.4))continue;const Ce=xp(pe,ve,3.6+H()*1.3,Math.floor(H()*1e6),!1);X.add(Ce.root),Q.push(Ce);for(let ze=0;ze<4;ze++)t.add(Ln,5200466,pe+Math.cos(ze*2.4)*.6,.16,ve+Math.sin(ze*2.4)*.6,.35,.26,.4,X,"stone")}for(let xe=0;xe<34;xe++){const{x:pe,z:ve}=Z(H()*ri,(H()-.5)*1.4);if(ie&&li(ie,pe,ve)>-.2||Math.hypot(pe-c.x,ve-c.z)<2.2)continue;const Ce=t.add(Ln,[7105122,8092272,6251616][xe%3],pe,-.005,ve,.08+H()*.19,.035,.1+H()*.19,X,"stone");Ce.rotation.y=H()*6}for(let xe=0;xe<6;xe++){const{x:pe,z:ve}=Z(H()*ri,(H()<.5?-1:1)*(2+H()*9));if(fe(pe,ve,1.6))for(let Ce=0;Ce<3;Ce++){const ze=.25+H()*.5;t.add(Ln,[6975596,7896440,6054495][Ce],pe+(H()-.5)*1.2,ze*.4,ve+(H()-.5)*1.2,ze,ze*.8,ze*.9,X,"stone").rotation.set(H(),H()*6,H())}}const le=H(),Se=H()<.5?-1:1,{x:ue,z:be}=Z(ri*(.3+H()*.4),Se*(3.2+H()*2));if(W>0&&le<.22&&fe(ue,be,2.4)){const xe=new et;xe.position.set(ue,0,be),xe.rotation.y=H()*Math.PI,X.add(xe);const pe=[6645620,7435650,5593961,8093576];for(let ve=0;ve<9;ve++)for(let Ce=-3;Ce<=3;Ce++){const ze=Ce*.49+ve%2*.23;ve>3&&Math.abs(ze)<.4||ve>5+Math.sin(Ce*1.7+W)*2||t.box(pe[Math.floor(H()*4)],ze,.17+ve*.32,0,.45,.29,.55,xe,"stone")}for(const ve of[-1.8,1.8])t.box(6975098,ve,1.2,.2,.45,2.4,.9,xe,"stone");for(let ve=0;ve<7;ve++){const Ce=ve/12*Math.PI,ze=t.box(7435650,Math.cos(Ce)*.7,2+Math.sin(Ce)*.8,.2,.25,.36,.5,xe,"stone");ze.rotation.z=Ce-Math.PI/2}}else if(le<.45&&fe(ue,be,1.8)){t.add(jM,7166530,ue,.22,be,.22,3+H()*1.5,.22,X,"bark").rotation.set(Math.PI/2,0,H()*Math.PI);for(let pe=0;pe<5;pe++)t.add(tf,13216107,ue+(H()-.5)*1.4,.35,be+(H()-.5)*.3,.12,.06,.12,X,"wood")}else if(le<.65&&fe(ue,be,2))for(let xe=0;xe<5;xe++){const pe=xe/5*Math.PI*2,ve=.9+H()*.8;t.box(8028038,ue+Math.cos(pe)*1.3,ve/2,be+Math.sin(pe)*1.3,.35,ve,.28,X,"stone").rotation.set((H()-.5)*.15,pe,(H()-.5)*.15)}else if(le<.85&&fe(ue,be,1.4)){const xe=new ut({color:10473924,roughness:1,flatShading:!0,emissive:3108195});for(let pe=0;pe<9;pe++){const ve=ue+(H()-.5)*1.6,Ce=be+(H()-.5)*1.6,ze=.1+H()*.18;t.box(14078141,ve,ze/2,Ce,.03,ze,.03,X,"wood");const Y=t.add(tf,10473924,ve,ze,Ce,.07+H()*.06,.05,.07+H()*.06,X,"stone");Y.material=xe}}let ge;if(ie){if(ge=i.createWater(ie),X.add(ge.mesh),ie.kind==="stream"){const ve=s.nearest(ie.x,ie.z),Ce=N=>{const A=s.point(ve+N);return li(ie,A.x,A.z)>-.1};let ze=.5,Y=.5;for(;ze<7&&Ce(ze);)ze+=.25;for(;Y<7&&Ce(-Y);)Y+=.25;const de=s.point(ve+(ze-Y)/2),G=(ze+Y)/2,_e=new et;_e.position.set(de.x,0,de.z),_e.rotation.y=Math.atan2(de.tx,de.tz),X.add(_e);const ye=G*2+.8;for(let N=0;N<Math.ceil(ye/.17);N++)t.box(N%3?6510924:8483164,0,.16,-ye/2+N*.17,1.25,.13,.15,_e,"wood");for(const N of[-.66,.66]){t.box(7300180,N,.5,0,.1,.1,ye,_e,"wood");for(const A of[-ye/2,0,ye/2])t.box(9075296,N,.5,A,.09,1,.09,_e,"wood")}}const xe=ie.kind==="stream"?30:ie.size*2.8,pe=ie.kind==="stream"?30:ie.size*2.6;for(let ve=0;ve<70;ve++){const Ce=ie.x+(H()-.5)*xe,ze=ie.z+(H()-.5)*pe,Y=li(ie,Ce,ze);if(!(Y>0||Y<-.45||Math.abs(s.offset(Ce,ze))<1))if(H()<.55)t.add(Ln,[4279375,5595229][ve%2],Ce,.045,ze,.1+H()*.18,.06+H()*.1,.15,X,"stone");else for(let de=0;de<3;de++){const G=t.box(6059117,Ce+(H()-.5)*.2,.3,ze+(H()-.5)*.2,.025,.6+H()*.4,.025,X,"foliage");G.rotation.z=(H()-.5)*.3}}}for(const xe of Q)i.add(xe.root,e.screen?{glyph:"screen",parts:{trunk:{surface:"bark"},crown:{surface:"foliage"}}}:{type:"tree"});return i.add(X,e.screen?{glyph:"screen"}:{}),ge&&e.screen&&(ge.look.reflection.enabled=!1),{index:W,group:X,trees:Q,water:ge,shape:ie}}let S=$d({count:s.chunks,build:m,dispose:W=>i.remove(W.group,{dispose:!0})});const w=ch();if(i.add(w.root,e.screen?{glyph:"screen",surface:"actor"}:{type:"hero"}),w.root.position.copy(l),e.at){const W=s.point(e.at);w.root.position.set(W.x,0,W.z),w.root.rotation.y=Math.atan2(W.tx,W.tz)}const _=new di(16764547,7,9,1.65);i.scene.add(_);const M=w.root.getObjectByName("traveller-lantern"),y=i.createParticles(1200);i.add(y.mesh,{glyph:"particle"});const E=rh();i.setActors({hero:w.root.position});const v=[6,16,12,18,14],b=yS(i,w,e.screen?void 0:g);let C=0,R=0;const T=new F;let P=s.nearest(w.root.position.x,w.root.position.z),I=0,U=0,k=0,D=0,z=e.camp?"camp":e.at?"hunt":"depart";e.at&&(I=e.at);const O=new F,B=new F,V=i.lights.moon;function j(){const W=Math.floor(s.nearest(w.root.position.x,w.root.position.z)/ri);if(!S.update(W))return;const H=[...S.chunks.values()].filter(X=>X.shape).sort((X,Q)=>S.ring(X.index,W)-S.ring(Q.index,W));r.streams.value.forEach((X,Q)=>{const $=H[Q]?.shape;$?X.set($.x,$.z,$.angle,$.kind==="stream"?$.size:-$.size):X.set(0,0,0,0)})}return j(),{id:"dark_forest",title:"Dark Forest",hero:w.root.position,get state(){return`${z} ${b.state} ${b.name} ${I.toFixed(0)}/${s.length} camp:${w.root.position.distanceTo(l).toFixed(1)}`},focus(W,H){const X=b.foe;return H.copy(w.root.position),H.y=X?.75:1.05,H.x-=Math.sin(W)*(X?1.25:2),H.z-=Math.cos(W)*(X?1.25:2),X&&(H.lerp(X,.32),H.y=.75),H},update(W,H){const X=W-D;z==="hunt"&&(I>=s.length-1.5||X>n*1.6)?(z="camp",D=W):z==="camp"&&X>MS&&!e.camp?(z="depart",D=W):z==="depart"&&X>lf&&(z="hunt",D=W,I=0);const Q=z==="camp"||z==="depart"&&X<lf*.5;if(z==="hunt"&&!b.active&&!e.peaceful&&(C+=H,C>v[R%v.length])){C=0,R++;const Ce=s.point(P+4);T.set(Ce.x-w.root.position.x,0,Ce.z-w.root.position.z).normalize(),b.begin(W,T,i.camera)}const $=b.update(W,H);if(Q){const Ce=s.length-P;if(Math.min(P,Ce)>2.2&&w.root.position.distanceTo(l)>2.4){const ze=s.point(P+(Ce<P?2.4:-2.4));O.set(ze.x,0,ze.z)}else O.copy(l)}else{const Ce=s.point(P+2.4),ze=Math.sin(P*.23)*.35;O.set(Ce.x+Ce.nx*ze,0,Ce.z+Ce.nz*ze)}B.subVectors(O,w.root.position),B.y=0;const Z=B.length(),ie=Q&&Z<.12;k=ln(k,ie?1:0,ie?3.2:5.5,H);let fe=1,le=1.28;Q?fe=w.root.position.distanceTo(l)>6?2.1:1:(fe=vp(W),le=pS(s.length-I,Math.max(1,n-X)));const Se=ie||$?0:le*fe*Qt(Z/.45)*(1-Qt(k*1.5));U=ln(U,Se,Se>U?6:10,H);let ue=0;if(Z>.015&&U>.005&&!$){const Ce=Math.atan2(B.x,B.z);w.root.rotation.y=Hs(w.root.rotation.y,Ce,6,H);const ze=.4+.6*Math.max(0,Math.cos(Ce-w.root.rotation.y));ue=Math.min(Z,H*U*ze),w.root.position.addScaledVector(B.normalize(),ue)}const be=s.nearest(w.root.position.x,w.root.position.z),ge=s.length;let xe=be-P;if(xe>ge/2&&(xe-=ge),xe<-ge/2&&(xe+=ge),Q||(I+=xe),P=be,ie){const Ce=Math.atan2(c.x-w.root.position.x,c.z-w.root.position.z);w.root.rotation.y=Hs(w.root.rotation.y,Ce,5,H)}$||w.animate({time:W,dt:H,speed:U,distance:ue,attackAge:9,hurtAge:9,sitting:k}),w.root.updateMatrixWorld(!0),M.getWorldPosition(_.position),_.position.y+=.5,_.intensity=7+Math.sin(W*3.7)*.7+Math.sin(W*7.3)*.35,i.setLights({lantern:_.position});const pe=w.root.position;V.position.set(pe.x-5,12,pe.z+7),V.target.position.set(pe.x,0,pe.z),V.target.updateMatrixWorld();const ve=3.4;a.position.set(Math.round(pe.x/ve)*ve,-.07,Math.round(pe.z/ve)*ve),j();for(const Ce of S.chunks.values())Ce.trees.forEach(ze=>ze.animate(W));f.clear(),u.update(W,i.camera),y.clear(),mp(y,pe,W),pp(y,pe,W),U>1.85&&E.add(pe.x,pe.z,W),E.push(y,W)},dispose(){S.clear();for(const W of[a,h,w.root,f.mesh,y.mesh,g.mesh])i.remove(W);i.scene.remove(_,u.light),S=void 0}}}const yp=i=>i-Math.floor(i),bs=i=>yp(Math.sin(i*127.1+311.7)*43758.5453),ES=`
  uniform sampler2D reflection;
  varying vec4 mirrorUv;
  vec4 reflectedWater(vec3 p, float time, vec3 disturbance, float vegetation) {
    vec2 uv = mirrorUv.xy / mirrorUv.w;
    // Gentle horizontal shear retains the silhouette; boot/rain waves bend it locally.
    uv += vec2(sin(p.z * 10. + time * 1.3) * .0014 + disturbance.g * .035,
      sin(p.x * 6. - time * .65) * .0007 + disturbance.b * .018);
    float border = min(min(uv.x, uv.y), min(1. - uv.x, 1. - uv.y));
    float valid = smoothstep(0., .015, border);
    vec4 reflected = texture2D(reflection, clamp(uv, vec2(.001), vec2(.999)));
    // The opaque background has alpha 1; tagged geometry carries its material ID.
    float object = 1. - step(.96, reflected.a);
    float bands = .68 + .32 * smoothstep(-.55, .65, sin(p.z * 17. + p.x * .6 - time * 1.1));
    float weight = .56 * valid * object * bands * (1. - clamp(vegetation, 0., 1.) * .42);
    return vec4(reflected.rgb * vec3(.82, .92, .98), weight);
  }
`;function Mp(i){return`float marshShore(vec2 p) {
    float shore=10.;
    ${i.map(e=>`shore=min(shore,length((p-vec2(${e.x.toFixed(2)},${e.z.toFixed(2)}))/vec2(${e.rx.toFixed(3)},${e.rz.toFixed(3)})));`).join(`
`)}
    return shore;
  }`}function AS(i,e){const t=e.islands,n=e.baseLevel??.18,s=e.extent??24,r=e.isWood??(()=>!1);let o=n;const a=(D,z)=>Math.min(...t.map(O=>Math.hypot((D-O.x)/O.rx,(z-O.z)/O.rz))),c=(D,z,O=o)=>{const B=1-Math.max(0,O-n)*1.35;return Math.max(0,Math.min(1,(a(D,z)-B+.06)/.14))},l=(D,z,O=o)=>r(D,z)?"wood":c(D,z,O)>.5?"water":"grass",h=Mp(t),f=Yd(112,s),u=new Uint8Array(f.size*f.size*4),d=new Di(u,f.size,f.size,rn);d.minFilter=d.magFilter=ft,d.generateMipmaps=!1;let g=-1;const x={time:{value:0},level:{value:n},waves:{value:d},reflection:{value:null},reflectionMatrix:{value:new Je}},p=new Ht({uniforms:x,vertexShader:"varying vec3 p; varying vec4 mirrorUv; uniform mat4 reflectionMatrix; void main(){vec4 w=modelMatrix*vec4(position,1.);p=w.xyz;mirrorUv=reflectionMatrix*w;gl_Position=projectionMatrix*viewMatrix*w;}",fragmentShader:`varying vec3 p; uniform float time, level; uniform sampler2D waves;
      ${h}
      ${ES}
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.)),f.x),f.y);}
      void main(){
        float shore=marshShore(p.xz), bank=1.-(level-${n.toFixed(3)})*1.35;
        if(shore<bank)discard;
        vec3 disturbance=texture2D(waves,p.xz/${s.toFixed(1)}+.5).rgb-vec3(.502);
        float ripple=sin(p.z*5.+p.x*.8+time*.8)*sin(p.x*3.-time*.5);
        float shine=pow(max(0.,sin(p.z*3.+p.x*.45+time*.45)),18.);
        float crest=clamp(dot(disturbance.gb,vec2(-1.2,1.6))+abs(disturbance.r)*.45,0.,.6);
        float shoreFoam=(1.-smoothstep(0.,.065,shore-bank))*(.6+.4*sin(p.x*8.+p.z*6.-time*1.5));
        vec3 ink=vec3(.006,.029,.025)+vec3(.002,.007,.006)*ripple+vec3(.015,.033,.030)*shine;
        ink+=vec3(.16,.29,.38)*crest+vec3(.035,.06,.075)*shoreFoam;
        // Algae and flattened grass remain visible through shallow water, in
        // broad irregular patches separated by open, blue-grey channels.
        vec2 bed=p.xz+vec2(sin(p.z*4.+time*.7),cos(p.x*3.-time*.6))*.025;
        float meadow=noise(bed*.65)*.7+noise(bed*1.8)*.3;
        float grass=smoothstep(.49,.69,meadow)+(1.-smoothstep(bank,bank+.28,shore))*.26;
        float blade=step(.3,noise(bed*8.));
        vec3 sod=mix(vec3(.025,.070,.009),vec3(.063,.145,.018),noise(bed*3.));
        ink=mix(ink,sod+vec3(.009,.016,.018)*shine+vec3(.13,.24,.3)*crest,clamp(grass*.85,0.,.85));
        vec4 reflected=reflectedWater(p,time,disturbance,grass);
        ink=mix(ink,reflected.rgb,reflected.a);
        float signal=dot(reflected.rgb,vec3(.2126,.7152,.0722))*reflected.a;
        gl_FragColor=vec4(ink,signal>.009?${Ns("reflection")}:grass*blade>.55?${Ns("wetgrass")}:${Ns("water")});
      }`}),m=new Ye(new xn(30,30),p);m.rotation.x=-Math.PI/2,m.position.y=n,m.userData.glyph="screen";const S=Ql(m,x),w=[];for(let D=-12;D<12;D+=.38)for(let z=-11;z<11;z+=.38)c(z,D,n+.13)>.5&&w.push({x:z,z:D,seed:bs(z*12+D*53)});const _=[];let M=new Float32Array(0);const y=[];let E=0,v,b=0,C=0;const R=(D,z,O,B,V=!1,j)=>{l(D,z)==="water"&&_.push({x:D,z,at:O,strength:B,rain:V,footHeading:j})};function T(D,z,O,B,V,j=!1){for(let W=0;W<13;W++){if(!j&&(W===3||W===9))continue;const H=j?(W/12-.5)*Math.PI*1.25:W/13*Math.PI*2,X=Math.sin(H)*B*.8,Q=Math.cos(H)*B,$=D+Math.cos(O)*X+Math.sin(O)*Q,Z=z-Math.sin(O)*X+Math.cos(O)*Q;l($,Z)==="water"&&i.push($,o+.028,Z,.11,W%3?"~":"-",[.46,.62,.68],V)}}const P=new F(1,0,0),I=new F(0,0,-1);function U(D,z,O,B,V,j,W=!1){const H=Math.max(W?8:14,Math.ceil(O*(W?26:22)));for(let X=0;X<H;X++){if(!W&&bs(X+j*7)<.1)continue;const Q=X/H*Math.PI*2,$=Math.cos(Q),Z=Math.sin(Q),ie=D+$*O,fe=z+Z*O,le=l(ie,fe);if(le==="wood")continue;const Se=$*P.x+Z*P.z,ue=$*I.x+Z*I.z,be=Math.abs(ue)>Math.abs(Se)*1.9?ue>0?"-":"_":Math.abs(Se)>Math.abs(ue)*1.9?"|":Se*ue>0?"/":"\\",ge=le==="water"?1:.7;i.push(ie,le==="water"?o+.045:.2,fe,W?.13:.19,be,[V*.72*ge,V*.9*ge,V*ge],B*ge)}}function k(D,z,O,B){return D.map((V,j)=>{const{x:W,y:H,z:X}=V.position,Q=y[j],$=Q?W-Q.x:0,Z=Q?X-Q.z:0,ie=Math.hypot($,Z),fe=O&&z>0&&ie<.5?Math.min(4,ie/z):0,le=H-.065<o&&l(W,X)==="water",Se=!!Q&&O&&B>0&&le&&V.step>Q.step,ue=!O&&Q?Q.heading:Math.atan2($,Z),be=!O&&Q?Q.drag:le&&!V.grounded&&B>0?Math.min(1,fe/1.6):0;y[j]={x:W,z:X,step:V.step,heading:ue,drag:be};const ge=!!Q&&O&&B>0&&!le&&V.step>Q.step&&l(W,X)!=="wood";return{x:W,z:X,wet:le,landed:Se,heading:ue,drag:be,puddle:ge}})}return{mesh:m,material:p,reflection:S,uniforms:x,field:f,surface:l,wetness:c,get level(){return o},distance:()=>0,look:{reflection:{enabled:!0}},get wakes(){return _.filter(D=>!D.rain).length},update(D,z,O,B){o=z,x.time.value=D,x.level.value=o,m.position.y=o,P.setFromMatrixColumn(O.matrixWorld,0).setY(0).normalize(),O.getWorldDirection(I).setY(0).normalize();const V=B.hero;for(const H of k(B.feet??[],B.dt,B.active,B.travelled))H.landed?R(H.x,H.z,D,.8,!1,B.heading):H.puddle&&R(H.x,H.z,D,.45,!1,B.heading),H.drag>.12&&(T(H.x,H.z,H.heading,.12,H.drag*.52,!0),B.active&&f.disturb(H.x,H.z,H.drag*B.dt*.5,.12));if(B.active){if(E+=B.foeTravelled??0,E>=.4&&D>=C&&B.foe&&!B.foeDead&&(E=0,C=D+.6,R(B.foe.x,B.foe.z,D,.75)),B.foe&&!B.foeDead&&D>b&&(b=D+1.4,R(B.foe.x,B.foe.z,D,.45)),B.hit&&B.hit.id!==v){const H=B.hit.target==="hero"?V:B.foe;H&&R(H.x,H.z,D+.2,B.foeDead?1.7:.85),v=B.hit.id}if(B.rain){M.length!==B.rain.count&&(M=new Float32Array(B.rain.count).fill(-1));for(let H=0;H<B.rain.count;H++){const X=B.rain.drop(H,D);M[H]>=0&&X.phase<M[H]&&Math.hypot(X.x-V.x,X.z-V.z)<9&&H%3===0&&R(X.impactX,X.impactZ,D,.24+bs(H)*.18,!0),M[H]=X.phase}}}for(const H of w){if(Math.hypot(H.x-V.x,H.z-V.z)>10||l(H.x,H.z)!=="water")continue;const X=Math.sin(H.z*8+Math.sin(H.x*1.5)+D*.9)+Math.sin(H.x*6-D*.8)*.35;if(X<1.05||H.seed<.65)continue;const Q=.21+X*.055;i.push(H.x,o+.025,H.z,.11,H.seed>.7?"~":"-",[Q*.53,Q*.79,Q],.5);const $=Math.exp(-((H.x-V.x)**2*2.8+(H.z-V.z-.65)**2*.7));$>.15&&i.push(H.x,o+.04,H.z,.11,"-",[.55,.38,.18],$*.55)}for(let H=_.length-1;H>=0;H--){const X=_[H],Q=D-X.at,$=X.rain?.65:X.footHeading!==void 0?1.05:1.6;if(Q>$){_.splice(H,1);continue}if(Q<0)continue;X.displaced||(f.disturb(X.x,X.z,X.strength*(X.rain?.14:.65),X.rain?.13:.28),X.displaced=!0);const Z=Math.max(0,1-Q/$),ie=Math.min(1,X.strength);if(X.footHeading!==void 0){if(T(X.x,X.z,X.footHeading,.09+Q*.46,Z*.65),Q>.12&&T(X.x,X.z,X.footHeading,.055+(Q-.12)*.33,Z*.22),Q<.3)for(let fe=0;fe<5;fe++){const le=X.footHeading+Math.PI+(fe-2)*.55,Se=.04+Q*(.25+bs(fe)*.5),ue=o+.025+Math.max(0,Q*(.7+bs(fe+8)*.25)-Q*Q*3.8);i.push(X.x+Math.sin(le)*Se,ue,X.z+Math.cos(le)*Se,.08,fe%2?".":",",[.53,.7,.77],(1-Q/.3)*.7)}continue}if(U(X.x,X.z,(X.rain?.025:.12)+Q*(X.rain?.38:.64*Math.sqrt(ie)),Z*(X.rain?.34:.62*ie),X.rain?.48:.66,X.at,X.rain),X.rain&&Q<.12)for(const fe of[-1,1])i.push(X.x+fe*Q*.42,o+.04+Math.sin(Q/.12*Math.PI)*.075,X.z+fe*Q*.18,.085,fe<0?",":".",[.6,.74,.8],(1-Q/.12)*.6);if(!X.rain&&Q<1.2&&ie>.6&&U(X.x,X.z,.12+Q*.55,(1-Q/1.2)*.3*ie,.6,X.at+2),Q<.5&&!X.rain)for(let fe=0;fe<11;fe++){const le=fe*2.399,Se=Q*(.7+bs(fe)*1.3),ue=Math.max(o,o+Q*2.2*X.strength-Q*Q*5);i.push(X.x+Math.cos(le)*Se,ue,X.z+Math.sin(le)*Se,.105,fe%2?".":",",[.5,.7,.82],(1-Q/.5)*.9)}}if(B.rain){for(const[H,X]of[[V,1.75],[B.foe,B.foeHeight??.8]])if(!(!H||H===B.foe&&B.foeDead))for(let Q=0;Q<9;Q++){const $=yp(D*1.4+Q*.618),Z=Q*2.399,ie=.15+$*.5,fe=H.y+X-.1+$*.5-$*$*2.5;fe<o||i.push(H.x+Math.cos(Z)*ie,fe,H.z+Math.sin(Z)*ie,.075,$<.2?",":".",[.52,.68,.8],(1-$)*.65)}}(g<0||D-g>.5)&&(f.setShore((H,X)=>l(H,X)==="water"),g=D),f.advance(B.active?B.dt:0);const j=f.heights,W=f.size;for(let H=1;H<W-1;H++)for(let X=1;X<W-1;X++){const Q=H*W+X,$=Q*4;u[$]=Math.max(0,Math.min(255,128+j[Q]*75)),u[$+1]=Math.max(0,Math.min(255,128+(j[Q+1]-j[Q-1])*110)),u[$+2]=Math.max(0,Math.min(255,128+(j[Q+W]-j[Q-W])*110)),u[$+3]=255}d.needsUpdate=!0},shoreGLSL:h,dispose(){S.dispose(),p.dispose(),m.geometry.dispose(),d.dispose()}}}function TS(i,e){let t=18371;const n=()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296),s={value:0},r=new ut({color:16777215,side:Sn,roughness:1,emissive:2706997,emissiveIntensity:.16});r.onBeforeCompile=m=>{m.uniforms.bankTime=s,m.vertexShader=`uniform float bankTime;
`+m.vertexShader,m.vertexShader=m.vertexShader.replace("#include <begin_vertex>",`
      #include <begin_vertex>
      float phase = instanceMatrix[3].x * 1.7 + instanceMatrix[3].z * .8;
      transformed.x += sin(bankTime * 1.45 + phase) * position.y * position.y * .16;
      transformed.z += cos(bankTime * .93 + phase) * position.y * .05;
    `)},r.customProgramCacheKey=()=>"ascii-shore-grass-v1";const o=[];for(let m=0;m<3;m++){const S=m*2.399,w=.065,_=.24+m*.06,M=(R,T,P)=>[Math.cos(S)*R-Math.sin(S)*P,T,Math.sin(S)*R+Math.cos(S)*P],y=M(-w,0,0),E=M(w,0,0),v=M(_-w*.45,.6,0),b=M(_+w*.45,.6,0),C=M(_*1.8,.84+m*.08,0);o.push(...y,...E,...v,...E,...b,...v,...v,...b,...C)}const a=new Tt;a.setAttribute("position",new ct(o,3)),a.computeVertexNormals();const c=new Ji(a,r,2200),l=new Ji(new ss(1,0),new ut({color:16777215,roughness:.88,flatShading:!0}),180),h=new Ji(new gn(1,0),new ut({color:16777215,roughness:1,flatShading:!0}),180),f=new bt,u=new Oe;let d=0,g=0;const x=[5405009,6590039,8428134,3694152,4683614];for(let m=0;m<4800;m++){const S=-8+n()*16,w=-10+n()*22,_=Math.min(...i.map(b=>Math.hypot((S-b.x)/b.rx,(w-b.z)/b.rz)));if(!(_>.72&&_<1.22)||Math.hypot(S+3,w-2.6)<1.15||e(S,w))continue;const y=.5+.5*Math.sin(S*4.7+Math.sin(w*2.8));if(n()<.12+y*.2)continue;const E=.14;if(d<c.count){f.position.set(S,E,w);const b=.22+n()*.35;f.scale.set(.7+n()*.7,b,.7+n()*.7),f.rotation.set(0,n()*Math.PI*2,0),f.updateMatrix(),c.setMatrixAt(d,f.matrix),c.setColorAt(d++,u.setHex(x[Math.floor(n()*x.length)]))}if(n()>.13||g>=l.count)continue;const v=.1+Math.pow(n(),3)*.53;f.position.set(S,E+v*.33,w),f.scale.set(v,v*(.65+n()*.3),v*(.8+n()*.4)),f.rotation.set(n()*.3,n()*6,n()*.2),f.updateMatrix(),l.setMatrixAt(g,f.matrix),l.setColorAt(g,u.setHex([8031113,10133137,6385265][g%3])),f.position.y+=v*.55,f.scale.multiply(new F(.86,.25,.82)),f.updateMatrix(),h.setMatrixAt(g,f.matrix),h.setColorAt(g++,u.setHex(x[Math.floor(n()*x.length)]))}c.count=d,l.count=h.count=g,c.userData.glyph="surface",c.userData.glyphStyle={surface:"wetgrass"},l.userData.glyph="surface",l.userData.glyphStyle={surface:"stone"},h.userData.glyph="body",h.userData.glyphStyle={surface:"foliage",size:.19};const p=new et;p.name="shore";for(const m of[c,l,h])m.receiveShadow=!0,p.add(m);return{group:p,animate(m){s.value=m}}}const As=new F(-3,0,2.6),RS=new F(-1.8,0,2.7),hf=70,CS=25;function PS(i=!1){const e=new Ht({uniforms:{forest:{value:i?1:0}},vertexShader:"varying vec3 world; void main() { vec4 p = modelMatrix * vec4(position, 1.); world = p.xyz; gl_Position = projectionMatrix * viewMatrix * p; }",fragmentShader:`varying vec3 world; uniform float forest;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      void main() {
        float cluster = sin(world.x * 4.1 + sin(world.z * 1.2)) * sin(world.z * 3.3) + sin(world.x * 8. + world.z * 3.) * .3;
        float grains = hash(floor(world.xz * 15.));
        float groundCoverage = smoothstep(-.3, .6, cluster) * step(.23, grains);
        vec3 ground = mix(vec3(.0018,.0014,.003), mix(vec3(.035,.032,.05),vec3(.046,.052,.018),forest), groundCoverage * (.3 + grains * .7));
        float river = forest * (1. - smoothstep(1.1,1.3,abs(world.x - 3.95 - sin(world.z * .45) * .5)));
        gl_FragColor = vec4(mix(ground, vec3(.0005), river), .9);
      }`}),t=new Ye(new xn(42,40),e);return t.rotation.x=-Math.PI/2,t.position.y=-.07,t.userData.glyph="screen",t}function lh(i,e,t){const n=ah(),s=gp(n,t.leanTo??!1);s.position.copy(As),i.add(s,e.screen?{glyph:"screen"}:{});const r=i.createParticles(1600);i.add(r.mesh,{glyph:"particle"});const o=dp(r,As);i.scene.add(o.light),i.setLights({hearth:As});const a=ch();i.add(a.root,e.screen?{glyph:"screen",surface:"actor"}:{type:"hero"}),a.root.position.set(-.8,0,2.7);const c=t.lantern??7,l=new di(16764547,c,9,1.65);i.scene.add(l);const h=a.root.getObjectByName("traveller-lantern"),f=i.createParticles(1200);i.add(f.mesh,{glyph:"particle"});const u=rh();i.setActors({hero:a.root.position});let d=0,g=0,x=0;const p=new F,m=new F,S=a.feet.map(()=>({position:new F,step:0,grounded:!0})),w={travelled:0,wading:!1,camping:!!e.camp,seated:!1};return{player:a,feet:S,state:w,fire:o,fireLetters:r,ambient:f,campGroup:s,kit:n,update(_,M){const y=_%(hf+CS);if(w.camping=!!e.camp||y>hf,w.camping)p.copy(RS);else{const R=t.route[d];p.set(R[0],0,R[1]),Math.hypot(a.root.position.x-p.x,a.root.position.z-p.z)<.2&&(d=(d+1)%t.route.length)}m.subVectors(p,a.root.position),m.y=0;const E=m.length();w.seated=w.camping&&E<.12,x=ln(x,w.seated?1:0,w.seated?3.2:5.5,M);const v=a.root.position;w.wading=t.wadingAt?.(v.x,v.z)??!1;const b=w.seated?0:(w.wading?1.12/1.28:1)*1.28*Qt(E/.45)*(1-Qt(x*1.5));g=ln(g,b,b>g?6:10,M);let C=0;if(E>.015&&g>.005){const R=Math.atan2(m.x,m.z);a.root.rotation.y=Hs(a.root.rotation.y,R,6,M);const T=.4+.6*Math.max(0,Math.cos(R-a.root.rotation.y));C=Math.min(E,M*g*T),a.root.position.addScaledVector(m.normalize(),C)}return t.heightAt&&(v.y=ln(v.y,t.heightAt(v.x,v.z),10,M)),w.seated&&(a.root.rotation.y=Hs(a.root.rotation.y,Math.atan2(As.x-v.x,As.z-v.z),5,M)),a.animate({time:_,dt:M,speed:g,distance:C,attackAge:9,hurtAge:9,sitting:x,wading:w.wading}),a.root.updateMatrixWorld(!0),a.feet.forEach((R,T)=>{R.anchor.getWorldPosition(S[T].position),S[T].step=R.step,S[T].grounded=R.grounded}),h.getWorldPosition(l.position),l.position.y+=.5,l.intensity=c+Math.sin(_*3.7)*.7+Math.sin(_*7.3)*.35,i.setLights({lantern:l.position}),w.travelled=C,f.clear(),mp(f,v,_),g>1.85&&u.add(v.x,v.z,_),u.push(f,_),C},burn(_,M=1,y=0){r.clear(),o.update(_,i.camera,M,y)},fireflies(_,M,y=1){pp(_,a.root.position,M,{dim:y})},focus(_,M){return M.copy(a.root.position),M.y=1.05,M.x-=Math.sin(_)*2,M.z-=Math.cos(_)*2,M}}}const Fs=.18,Oo=[{x:-3,z:2.6,rx:2.65,rz:2.05},{x:-5.7,z:-4.9,rx:1.8,rz:1.4},{x:5.4,z:-3,rx:1.45,rz:1.7}];function uf(i){const e=1-Math.exp(-Math.max(0,i)/24),t=.5+.5*Math.sin(i*.48+.7),n=Math.pow(Math.max(0,Math.sin(i*.79-.6)),4);return{level:Fs+e*.13,flood:e,rain:.65+t*.35,fire:.78-n*.62,steam:.15+n*.85}}const uc=(i,e)=>i>-4.1&&i<1.8&&Math.abs(e-4.95)<.6,Sp={wetWeather:{value:1},waterLevel:{value:Fs}},IS=[{uniforms:Sp,declarations:`uniform float wetWeather, waterLevel;
${Mp(Oo)}`,color:`if (wetWeather > .5 && actor > .5) {
    float wet = (1.-smoothstep(waterLevel, waterLevel+.45, worldPoint.y))
      * step(1.-(waterLevel-${Fs.toFixed(2)})*1.35, marshShore(worldPoint.xz));
    color = mix(color, color * vec3(.55,.74,.85) + vec3(.025,.065,.085), wet*.7);
  }`}];function LS(i,e={}){const t=new et;t.name="marsh";let n=7401;const s=()=>(n=Math.imul(n,1664525)+1013904223>>>0,n/4294967296),r=new Un(1,1,1),o=new ss(1,0),a=new Pt(.72,1,1,7),c=new Map;function l(P,I){const U=`${P}:${I}`;let k=c.get(U);return k||(k=new ut({color:P,roughness:.82,flatShading:!0}),(I==="wood"||I==="bark")&&(k.emissive.setHex(6649734),k.emissiveIntensity=.22),c.set(U,k)),k}function h(P,I,U,k,D,z,O,B,V="wood"){const j=new Ye(P,l(I,V));return j.position.set(U,k,D),j.scale.set(z,O,B),j.castShadow=!0,j.receiveShadow=!0,t.add(j),oh(j,V)}const f=PS();i.add(f);const u=i.createParticles(16e3);i.add(u.mesh,{glyph:"particle"});const d=AS(u,{islands:Oo,baseLevel:Fs,isWood:uc}),g=i.addWater(d);i.add(g.mesh,{glyph:"water"});for(const P of Oo){const I=h(new Ko(1,40),5201990,P.x,.17,P.z,P.rx,P.rz,1,"earth");I.rotation.x=-Math.PI/2;for(let U=0;U<28;U++){const k=U/28*Math.PI*2,D=.94+s()*.12;h(o,5989989,P.x+Math.cos(k)*P.rx*D,.12,P.z+Math.sin(k)*P.rz*D,.12+s()*.18,.12,.14,"stone")}}for(const[P,I,U]of[[-2.8,-.1,.65],[3.2,1.5,.52],[3.2,-3.8,.7],[-3.4,-4.4,.56],[-4.2,4.3,.48]]){const k=h(o,9608857,P,.2+U*.38,I,U,U*.85,U*.78,"stone");k.rotation.set(.16,P*1.7,-.12);const D=h(o,6586714,P-U*.12,.2+U*1.08,I,U*.8,U*.12,U*.64,"foliage");D.rotation.y=k.rotation.y,h(o,6847607,P+U*.8,.22,I+U*.3,U*.4,U*.3,U*.45,"stone")}const x=[];for(let P=0;P<90;P++){const I=(P%2?-1:1)*(3.1+s()*4.4),U=-9+s()*18;if(!(Math.hypot(I+3,U-2.6)<2.7))for(let k=0;k<3;k++){const D=.45+s()*.65,z=I+(s()-.5)*.4,O=U+(s()-.5)*.4,B=h(a,6059117,z,.17+D/2,O,.025,D,.025,"foliage");x.push({mesh:B,rest:(s()-.5)*.2,phase:P+k}),k===0&&h(a,7300689,z,.2+D,O,.065,.23,.065)}}for(let P=0;P<29;P++)h(r,P%3?7170910:8749171,-4+P*.2,.29,4.95,.18,.1,1.1).rotation.y=(s()-.5)*.05;for(const P of[-3.8,-1.4,1.5])for(const I of[4.35,5.55])h(a,6910314,P,.5,I,.06,.95,.06);for(const P of[-6.5,-4.8])for(const I of[-5.6,-4.1])h(r,6713707,P,.8,I,.12,1.6,.12);for(let P=0;P<11;P++)h(r,6251100,-6.6+P*.18,.48,-4.8,.16,.1,1.8),h(r,7962742,-6.7+P*.2,2.1-Math.abs(P-5)*.1,-4.8,.18,.07,2.1).rotation.z=P<5?.46:-.46;const p=[];for(let P=0;P<60;P++){const I=-7+s()*14,U=-8+s()*16;if(d.wetness(I,U,Fs)<.5||Math.abs(I)<1.8)continue;const k=h(new Ko(.16+s()*.09,7,.15,Math.PI*1.8),4810590,I,.195,U,1,1,1,"foliage");k.rotation.x=-Math.PI/2,k.rotation.z=s()*6,p.push(k)}const m=TS(Oo,uc);t.add(m.group),i.add(t,e.screen?{glyph:"screen"}:{});const S=[[-4,-.4,3.9],[4.5,-2.2,4.2],[-4.8,-6,4.6],[4.1,-7.2,4.7],[-6.7,5.4,4.1],[6.8,6.5,4.4],[.6,-10,4.5]].map(([P,I,U],k)=>{const D=xp(P,I,U,931+k*137,!0);return i.add(D.root,e.screen?{glyph:"screen",parts:{trunk:{surface:"bark"},crown:{surface:"foliage"}}}:{type:"tree"}),D}),w=(P,I)=>P[Math.floor(I()*P.length)],_={count:4e4,y:()=>.17,density:(P,I)=>d.wetness(P,I,Fs)<.42?.9:0,pick(P){const I=.5+P()*.55,U=P();return{glyph:w([0,0,1,2,5,3],P),height:.14+P()*.2,color:[(.16+U*.12)*I,(.38+U*.06)*I,(.3-U*.08)*I]}}},M=i.createCarpet(_);e.screen||i.add(M.mesh,{glyph:"carpet"});const y=lh(i,e,{route:[[-.3,3.4],[1.3,3.4],[2.2,1.2],[.7,-1.2],[-.4,-3.7],[-2.6,-4.1],[-.5,-1.7],[1.2,1.2],[1.3,4.95],[-2.5,4.95],[-1.4,3.1]],heightAt:(P,I)=>uc(P,I)?.34:0,wadingAt:(P,I)=>d.surface(P,I)==="water"}),E=i.createRainStreaks(800);i.add(E.mesh,{glyph:"particle"});const v=i.createParticles(64);i.add(v.mesh,{glyph:"particle"});const b=eh(E,v),{hemisphere:C,fill:R}=i.lights;let T=0;return{id:"rain_marsh",title:"Rain Marsh",hero:y.player.root.position,get state(){return`level:${d.level.toFixed(3)} fire:${uf(i.time).fire.toFixed(2)} wakes:${d.wakes} flash:${T.toFixed(2)} wading:${y.state.wading}`},focus:y.focus,update(P,I){const U=uf(P),k=qd(P);T=k?.flash??0,i.setFlash(T),C.intensity=i.style.hemisphere.intensity+T*1.9,R.intensity=i.style.fill.intensity+T*3.5,Sp.waterLevel.value=U.level;const D=y.update(P,I),z=y.player.root.position;E.clear(),v.clear(),b.update(P,i.camera,z,U.level,U.rain,k),i.setGain(E,1+T*.55),i.setGain(v,1+T*.8),u.clear(),d.update(P,U.level,i.camera,{hero:z,heading:y.player.root.rotation.y,travelled:D,active:!0,dt:I,feet:y.feet,rain:b}),y.burn(P,U.fire,U.steam),y.fireflies(y.ambient,P,1-U.rain*.6),m.animate(P),S.forEach(O=>O.animate(P)),p.forEach((O,B)=>{O.position.y=U.level+.016+Math.sin(P*1.5+B)*.007}),x.forEach(({mesh:O,rest:B,phase:V})=>{O.rotation.z=B+Math.sin(P*1.6+V)*.045})},dispose(){}}}const ff=110,DS=i=>Math.max(0,Math.min(1,i)),NS=i=>{const e=DS(i);return e*e*(3-2*e)},US={hemisphere:{sky:13230061,ground:6715783,intensity:1.35},moon:{...br.moon,color:14675452,intensity:2},bodyAmbient:.42},df=i=>.28+.72*(1-Math.exp(-Math.max(0,i)/42)),bp=i=>1.48+.35*(1-Math.exp(-Math.max(0,i)/38));function FS(i){const e=i.hearth,t=i.extent??32,n=(p,m,S)=>{const w=p-e.x,_=m-e.z,M=Math.sin(w*3.1+_*1.7)*.1+Math.sin(_*4.3)*.055;return NS((Math.hypot(w,_)+M-bp(S)+.2)/.55)},s=`
    float snowCoverAt(vec2 p, float time) {
      vec2 d = p - vec2(${e.x.toFixed(3)}, ${e.z.toFixed(3)});
      float edge = sin(d.x * 3.1 + d.y * 1.7) * .10 + sin(d.y * 4.3) * .055;
      float radius = 1.48 + .35 * (1. - exp(-max(0., time) / 38.));
      return smoothstep(radius - .2, radius + .35, length(d) + edge);
    }
  `,r=512,o=new Uint8Array(r*r),a=new Di(o,r,r,zr);a.minFilter=a.magFilter=ft,a.generateMipmaps=!1;const c={value:0},l=new ut({color:16777215,roughness:.94});l.onBeforeCompile=p=>{p.uniforms.snowTime=c,p.uniforms.footprintMap={value:a},p.vertexShader=`varying vec3 snowWorld;
${p.vertexShader}`.replace("#include <begin_vertex>",`#include <begin_vertex>
snowWorld=(modelMatrix*vec4(position,1.)).xyz;`),p.fragmentShader=`varying vec3 snowWorld; uniform float snowTime; uniform sampler2D footprintMap;
${s}
${p.fragmentShader}`.replace("#include <color_fragment>",`#include <color_fragment>
        float cover = snowCoverAt(snowWorld.xz, snowTime);
        float drift = sin(snowWorld.x * .8 + sin(snowWorld.z * .55)) * sin(snowWorld.z * 1.3) * .045;
        float track = texture2D(footprintMap, snowWorld.xz / ${t.toFixed(1)} + .5).r;
        vec3 powder = vec3(.52,.65,.72) + drift;
        powder *= 1. - track * .68;
        vec3 thaw = vec3(.060,.046,.029) + vec3(.022,.024,.021) * (.5+.5*sin(snowWorld.x*11.+snowWorld.z*7.));
        diffuseColor.rgb *= mix(thaw, powder, cover);`)},l.customProgramCacheKey=()=>"ascii-snow-ground-v1";const h=new Ye(new xn(t,t),l);h.rotation.x=-Math.PI/2,h.position.y=-.025,h.receiveShadow=!0,h.userData.glyph="surface",h.userData.glyphStyle={surface:"snow"};const f=[];let u=[],d=-1,g=-1;function x(p){o.fill(0);const m=t/r;for(const S of f){const w=(1-(p-S.at)/ff)**.7,_=Math.floor((S.x/t+.5)*r),M=Math.floor((S.z/t+.5)*r),y=Math.sin(S.heading),E=Math.cos(S.heading);for(let v=M-5;v<=M+5;v++)for(let b=_-5;b<=_+5;b++){if(b<0||v<0||b>=r||v>=r)continue;const C=(b+.5)*m-t/2-S.x,R=(v+.5)*m-t/2-S.z,T=C*E-R*y,P=C*y+R*E,I=Math.hypot(T/.115,(P-.045)/.16),U=Math.hypot(T/.083,(P+.12)/.075),k=Math.max(0,Math.min(1,(1-Math.min(I,U))/.32))*w,D=v*r+b;o[D]=Math.max(o[D],Math.round(k*255))}}a.needsUpdate=!0,d=p,g=f.length}return{ground:h,material:l,cover:n,coverGLSL:s,prints:f,get footprintCount(){return f.length},stamp(p,m,S,w,_){if(c.value=p,w){for(;f.length&&p-f[0].at>ff;)f.shift();m.forEach((M,y)=>{if(u[y]===void 0||M.step<=u[y]||_<=0||M.position.y>.28)return;const{x:E,z:v}=M.position;n(E,v,p)>.55&&f.push({x:E,z:v,heading:S,at:p,foot:y})}),f.length>256&&f.splice(0,f.length-256)}u=m.map(M=>M.step),(d<0||f.length!==g||p-d>.15)&&x(p)},flakes(p,m,S,w,_=950){for(let M=0;M<_;M++){const y=ih(M,m);if(Math.hypot(y.x-S.x,y.z-S.z)>10||w.some(v=>Math.hypot(y.x-v.x,y.z-v.z)<v.radius&&y.y<v.y))continue;const E=n(y.x,y.z,m)<.5?Math.min(1,Math.max(0,(y.y-.5)/1.4)):1;E<=0||p.push(y.x,y.y,y.z,y.size,M%5===0?"*":M%3===0?"+":".",[.88,.94,1],Math.min(1,.68+y.size*1.6)*E)}},dispose(){a.dispose(),l.dispose(),h.geometry.dispose()}}}function OS(i,e={}){i.setStyle(US);const t=new et;t.name="snow_pines";let n=93207;const s=()=>(n=n*1664525+1013904223>>>0,n/4294967296),r=new gn(1,1),o=new Un(1,1,1),a=new Map;function c(_,M){const y=`${_}:${M}`;return a.has(y)||a.set(y,new ut({color:_,flatShading:!0,roughness:.95})),a.get(y)}function l(_,M,y,E,v,b,C,R,T=R,P=R){const I=new Ye(_,c(M,y));return I.position.set(v,b,C),I.scale.set(R,T,P),I.castShadow=I.receiveShadow=!0,E.add(I),oh(I,y),y==="snow"&&(I.userData.glyph="body",I.userData.glyphStyle={surface:"snow",size:.19}),I}const h=FS({hearth:As});t.add(h.ground);const f=[],u=[],d=[],g=(_,M,y,E,v,b)=>{const C=l(r,14083560,"snow",_,M,y,E,v,.08,b);return f.push({mesh:C,base:y,width:v,depth:b}),C};for(const[_,M,y]of[[-4.8,-2.8,3.8],[3.6,-3.3,4.2],[-5.4,5.4,4],[5,3.8,3.9],[1.1,-6.5,4.4],[-2.6,-7.5,3.4],[5.8,-.4,3.7],[-6.3,.3,3.4]]){const E=new et;E.position.set(_,0,M),t.add(E),u.push(E),l(new Pt(.1,.22,y*.87,7),6773319,"bark",E,0,y*.43,0,1);for(let v=0;v<4;v++){const b=y*(.34+v*.16),C=1.1-v*.23;for(let R=0;R<5;R++){const T=R*Math.PI*2/5+v*.63+s()*.3,P=Math.sin(T)*C*.52,I=Math.cos(T)*C*.52,U=l(new Pt(.025,.06,C*1.25,5),7168593,"wood",E,P*.6,b-.08,I*.6,1);U.rotation.z=Math.sin(T)*1.05,U.rotation.x=Math.cos(T)*1.05;const k=C*(.72+s()*.12),D=C*(.65+s()*.16),z=l(r,[4549977,5867117,7048310][R%3],"foliage",E,P,b,I,k,.22+C*.12,D);z.rotation.y=T;const O=g(E,P,b+.21,I,k*.92,D*.91);O.rotation.y=T}}l(new In(.32,.9,7),4876635,"foliage",E,0,y-.1,0,1),g(E,0,y+.1,0,.23,.25),d.push({x:_,z:M,y:y+.25,radius:1.2});for(let v=0;v<3;v++)g(t,_+(s()-.5)*.9,.015,M+(s()-.5)*.9,.55,.5)}for(const[_,M,y]of[[-2.8,-4.9,.65],[2.5,4.6,.6],[4.1,-.7,.7],[-5,1.5,.48],[-.7,-7,.65]])l(r,6650757,"stone",t,_,y*.35,M,y,y*.6,y*.8),g(t,_,y*.72,M,y*.85,y*.68);for(let _=0;_<6;_++){const M=-4.8+_*.8,y=-4.4,E=l(o,7366488,"wood",t,M,.44,y,.11,.88,.12);E.rotation.z=(s()-.5)*.13,g(t,M,.89,y,.12,.13),_<4&&(l(o,8418405,"wood",t,M+.4,.65,y,.85,.1,.1),g(t,M+.4,.71,y,.42,.1))}for(let _=0;_<45;_++){const M=(s()-.5)*15,y=(s()-.5)*20;h.cover(M,y,0)<.8||Math.abs(M)<2.4||(l(o,9344124,"wood",t,M,.12,y,.025,.24,.025).rotation.z=(s()-.5)*.55)}i.add(t,e.screen?{glyph:"screen"}:{});const x=(_,M)=>_[Math.floor(M()*_.length)],p={count:3e4,y:()=>-.02,density:()=>.7,pick(_,M,y){const E=h.cover(M,y,0),v=.6+_()*.4;return E>.5?{glyph:x([8,9,8,6,7],_),height:.04+_()*.05,color:[.62*v,.72*v,.8*v]}:{glyph:x([0,5,1,2],_),height:.08+_()*.1,color:[.42*v,.34*v,.2*v]}}},m=i.createCarpet(p);e.screen||i.add(m.mesh,{glyph:"carpet"});const S=lh(i,e,{route:[[-.8,3.8],[.4,2],[.9,-.4],[-.2,-3.2],[-1.3,-4.9],[.8,-2.9],[2.1,.4],[1.5,3.8],[-1,4.7]]}),w=i.createParticles(1e3);return i.add(w.mesh,{glyph:"particle"}),{id:"snow_pines",title:"Snow Pines",hero:S.player.root.position,get state(){return`prints:${h.footprintCount} snow:${df(i.time).toFixed(2)} melt:${bp(i.time).toFixed(2)}`},focus:S.focus,update(_,M){const y=S.update(_,M);h.stamp(_,S.feet,S.player.root.rotation.y,!0,y);const E=df(_);f.forEach(v=>{v.mesh.scale.set(v.width*(.85+E*.15),.065+E*.19,v.depth*(.85+E*.15)),v.mesh.position.y=v.base+E*.065}),u.forEach((v,b)=>{v.rotation.z=Math.sin(_*.55+b*1.7)*.008}),w.clear(),h.flakes(w,_,S.player.root.position,d),S.burn(_)},dispose(){}}}function zS(i){const e=i==="old_mine"?[2827293,3879208,4865326]:[2764846,3423032,4212802],t=256,n=document.createElement("canvas");n.width=n.height=t;const s=n.getContext("2d");let r=4127;const o=()=>(r=Math.imul(r,1664525)+1013904223>>>0,r/4294967296);s.fillStyle=`#${e[0].toString(16).padStart(6,"0")}`,s.fillRect(0,0,t,t);for(let l=0;l<900;l++){s.fillStyle=`#${e[1+Math.floor(o()*2)].toString(16).padStart(6,"0")}`;const h=2+o()*10;s.fillRect(o()*t,o()*t,h,h*(.5+o()))}if(i==="sunken_cathedral"){s.strokeStyle="#1a1e1d",s.lineWidth=2;for(let l=0;l<=t;l+=32)s.beginPath(),s.moveTo(l,0),s.lineTo(l,t),s.moveTo(0,l),s.lineTo(t,l),s.stroke()}const a=new is(n);a.colorSpace=Gt,a.wrapS=a.wrapT=es,a.repeat.set(6,6);const c=new Ye(new xn(42,40),new ut({map:a,roughness:1}));return c.rotation.x=-Math.PI/2,c.position.y=-.07,c.receiveShadow=!0,c.userData.glyph="surface",c.userData.glyphStyle={surface:"earth"},c}function BS(i){i.updateMatrixWorld(!0);const e=[],t=new Kn;return i.traverse(n=>{!(n instanceof Ye)||n.geometry===Ln||(t.setFromObject(n),t.min.y<1.2&&t.max.y>1.2&&e.push({minX:t.min.x,maxX:t.max.x,minZ:t.min.z,maxZ:t.max.z}))}),e}const ea=(i,e)=>i[Math.floor(e()*i.length)],kS={count:26e3,y:()=>-.03,density:i=>Math.abs(i-.2)<3.3?.75:0,pick(i){const e=i()<.05,t=.45+i()*.55;return e?{glyph:ea([6,7],i),height:.12,color:i()<.5?[.85*t,.52*t,.22*t]:[.32*t,.62*t,.5*t]}:{glyph:ea([8,9,8,7,9,5],i),height:.05+i()*.07,color:[.4*t,.36*t,.3*t]}}},GS={count:22e3,y:()=>-.03,density:i=>Math.abs(i)<3.9?.6:0,pick(i){const e=i()<.55,t=.45+i()*.55;return e?{glyph:ea([9,3,9,5,8],i),height:.05+i()*.08,color:[.24*t,.42*t,.3*t]}:{glyph:ea([8,9,8],i),height:.04+i()*.04,color:[.42*t,.44*t,.42*t]}}};function wp(i,e,t){i.setStyle(WM);const n=new et;n.name=t;const s=ah();let r=8203;const o=()=>(r=r*1664525+1013904223>>>0,r/4294967296),a=(g,x,p,m,S,w=1,_=w,M=w,y=n,E)=>s.add(g,x,p,m,S,w,_,M,y,E),c=(g,x,p,m,S,w,_,M=n,y)=>s.box(g,x,p,m,S,w,_,M,y),l=[],h=[];n.add(zS(t));const f=t==="sunken_cathedral"?i.createWater({kind:"pond",x:0,z:0,angle:0,size:1},{edgeGLSL:"float shore=1.48-abs(abs(p.x)-5.2); float inside=(p.z<-10.||p.z>12.)?-1.:shore; float wave=sin(p.z*7.-time*.9+sin(p.x*2.)*.4);",crestGLSL:"(1.-smoothstep(0.,.18,inside))*.7+max(0.,wave-.85)",flow:[0,.06],size:30,distance:(g,x)=>Math.max(0,-(1.48-Math.abs(Math.abs(g)-5.2)))+Math.max(0,-10-x,x-12)}):void 0;if(f&&(f.mesh.position.set(0,.018,0),n.add(f.mesh)),t==="old_mine"){for(let x=-10;x<10;x+=.62)c(8548430,.7,-.005,x,1.85,.13,.16);for(const x of[.05,1.35])c(11114614,x,.08,0,.085,.12,22,n,"stone");for(const x of[-5,-1,4,8]){for(const p of[-3.1,3.5]){c(9728842,p,1.48,x,.26,2.96,.3);for(const S of[.28,2.62])c(6120799,p,S,x,.3,.09,.34,n,"stone");const m=c(11241301,p+(p<0?.38:-.38),2.53,x,.15,1.04,.17);m.rotation.z=p<0?-.65:.65}c(9728842,.2,3.02,x,6.95,.24,.32)}for(let x=0;x<65;x++){const p=(x%2?-1:1)*(3.85+o()*1.4),m=-10+o()*22;if(a(Ln,[6712163,8884352,7828570][x%3],p,o()*.85,m,.4+o()*.65,.6+o()*1.1,.4+o()*.8,n,"stone").rotation.set(o(),o(),o()),x%3===0){const w=a(new Ni(.5),x%2?12552006:6527617,p*.89,.3+o()*.6,m,.3,.55,.35,n,"stone");w.rotation.z=(o()-.5)*.8}}for(const[x,p]of[[-2.88,1],[3.28,-4],[-2.88,6]]){const m=new et;m.position.set(x,2.8,p),n.add(m),l.push(m),c(6842199,0,-.24,0,.025,.48,.025,m),c(14134373,0,-.6,0,.16,.25,.16,m,"stone").material.emissive.setHex(7753765);for(const _ of[-.76,-.44])c(5988953,0,_,0,.24,.055,.24,m,"stone");for(const _ of[-1,1])c(5988953,_*.1,-.6,.09,.025,.29,.025,m,"stone");const w=new di(14727803,3.8,3.2,1.7);w.position.y=-.58,m.add(w)}for(let x=0;x<110;x++){const p=(o()-.5)*5.2,m=-9+o()*19;Math.hypot(p+3,m-2.6)<1||a(Ln,x%4?7500132:5270853,p,-.025,m,.05+o()*.09,.04,.08+o()*.1,n,x%4?"stone":"foliage")}const g=new et;g.position.set(2.9,0,-.8),n.add(g),c(9074269,0,.65,0,1.1,.7,1.5,g),c(3160892,0,1.02,0,.85,.05,1.25,g);for(const x of[-.57,.57])for(const p of[-.47,.47]){const m=a(new Pt(.24,.24,.12,10),8688012,x,.26,p,1,1,1,g);m.rotation.z=Math.PI/2}for(let x=0;x<7;x++)a(Ln,10064004,(o()-.5)*.8,1.04,o()-.5,.26,.3,.28,g)}else{for(let g=-10;g<=11;g+=.92)for(let x=-3;x<=3;x++){const p=c((x+Math.round(g))%2?4544855:6648170,x*.87,-.035,g,.82,.09,.87,n,"stone");p.rotation.y=(o()-.5)*.025}for(const g of[-1,1]){c(2112072,g*5.2,-.06,0,3.1,.08,24);for(const x of[-5,.5,6]){const p=g*3.25;c(9608856,p,.15,x,.87,.3,.87,n,"stone"),a(new Pt(.24,.31,2.65,8),10201764,p,1.6,x,1,1,1,n,"stone");for(let m=0;m<4;m++){const S=m*Math.PI/2;a(new Pt(.065,.075,2.5,5),11646884,p+Math.cos(S)*.25,1.6,x+Math.sin(S)*.25,1,1,1,n,"stone")}c(12696997,p,3,x,.78,.23,.78,n,"stone");for(let m=0;m<5;m++)a(Ln,5141321,p+(o()-.5)*.8,.08,x+(o()-.5)*.8,.13,.075,.15,n,"foliage")}for(const x of[-2.3,1.3,4.8])c(6379337,g*2.6,.43,x,1.25,.18,.45),c(7430993,g*2.6,.72,x-.18,1.25,.52,.13);for(let x=0;x<35;x++){const p=c(5996426,g*(4.1+o()*2),.01,-10+o()*22,.3+o()*.6,.015,.03);h.push(p)}}for(const g of[-5,.5])for(let x=0;x<=16;x++){if(g===.5&&x>6&&x<10)continue;const p=x/16*Math.PI,m=c(x%3?10267040:11843490,Math.cos(p)*3.25,2.92+Math.sin(p)*1.7,g,.52,.3,.37,n,"stone");m.rotation.z=Math.atan2(Math.cos(p)*1.7,-Math.sin(p)*3.25)}c(9144966,0,.6,-5.2,2.4,1.15,1.05),c(12695452,0,1.22,-5.2,2.7,.14,1.2);for(let g=0;g<=14;g++){const x=g/14*Math.PI,p=c(9279136,Math.cos(x)*3.25,2.5+Math.sin(x)*3.25,-6.5,.5,.74,.6);p.rotation.z=x-Math.PI/2}for(const g of[-3.25,3.25])c(8293788,g,1.2,-6.5,.58,2.4,.6);for(const g of[-1.7,-.8,0,.8,1.7])c(g===0?11709369:6983065,g,3,-6.7,.17,2.9-Math.abs(g)*.4,.12);for(let g=0;g<5;g++)for(let x=-2;x<=2;x++){if((g+x+5)%7===0)continue;const p=c([7511185,10909778,9072767][(g+x+5)%3],x*.53,2.02+g*.43,-6.72,.39,.32,.06,n,"stone");p.material.emissive.copy(p.material.color).multiplyScalar(.25)}for(let g=0;g<55;g++){const x=g%2?-1:1,p=x*(2.8+o()*.85),m=-8+o()*17,S=a(Ln,g%4?9082505:5402438,p,.055,m,.09+o()*.15,.06+o()*.1,.12+o()*.16,n,g%4?"stone":"foliage");S.rotation.y=o()*6}for(const g of[-1,1])c(14273456,g,1.54,-5.2,.1,.5,.1),a(new Ni(.08),15124343,g,1.87,-5.2,.6,1.5,.6)}i.add(n,e.screen?{glyph:"screen"}:{});const u=i.createCarpet(t==="old_mine"?kS:GS);e.screen||i.add(u.mesh,{glyph:"carpet"});const d=lh(i,e,{route:[[-.7,3.8],[-.7,.6],[-.5,-3.1],[.6,-3.5],[1.7,.4],[1.6,5.6],[-.7,5.6]],lantern:19});return i.setObstacles(BS(n)),{id:t,title:t==="old_mine"?"Old Mine":"Sunken Cathedral",hero:d.player.root.position,state:"lantern-discovery",focus:d.focus,update(g,x){d.update(g,x),d.burn(g),l.forEach((p,m)=>{p.rotation.z=Math.sin(g*.8+m*2.1)*.035}),h.forEach((p,m)=>{p.scale.x=.6+Math.sin(g*1.4+m)*.25})},dispose(){}}}const HS=(i,e={})=>wp(i,e,"old_mine"),VS=(i,e={})=>wp(i,e,"sunken_cathedral"),WS=new Promise((i,e)=>{const t=indexedDB.open("ascii-engine-projects",1);t.onupgradeneeded=()=>t.result.createObjectStore("documents"),t.onsuccess=()=>i(t.result),t.onerror=()=>e(t.error)});WS.catch(()=>{});function XS({engine:i,view:e,areas:t,areaId:n,mode:s,capture:r,importFiles:o,changed:a,viewer:c=!1}){const l=document.getElementById("panel"),h=(p,m)=>{const S=new URLSearchParams(location.search);S.set(p,m),location.search=S.toString()};l.innerHTML=`
    <label>area <select data-k="area">${Object.entries(t).map(([p,m])=>`<option value="${p}"${p===n?" selected":""}>${m.title}</option>`).join("")}</select></label>
    <label>mode <select data-k="mode">${[["letters","glyphs"],["screen","screen (legacy)"],["raw","without screen pass"]].map(([p,m])=>`<option value="${p}"${p===s?" selected":""}>${m}</option>`).join("")}</select></label>
    <label>size <input data-k="cell" type="range" min="5" max="12" step="1"><output></output></label>
    <label>light <input data-k="light" type="range" min=".65" max="1.4" step=".05"><output></output></label>
    <label>zoom <input data-k="zoom" type="range" min="${n==="sandbox"?".18":".75"}" max="${n==="sandbox"?"4":"1.5"}" step=".05"><output></output></label>
    <label>rotation <input data-k="angle" type="range" min="-3.14" max="3.14" step=".05"><output></output></label>
    <button data-k="pause">[ pause ]</button> <button data-k="shot">[ capture ]</button>
    ${c?"":`<label class="file">[ import models and files ]<input data-k="import" type="file" multiple accept=".glb,.gltf,.bin,.png,.jpg,.jpeg,.webp" hidden></label>
    <button data-k="save">[ save preset .json ]</button>
    <label class="file">[ load preset .json ]<input data-k="load" type="file" accept=".json" hidden></label>`}`;const f=p=>l.querySelector(`[data-k="${p}"]`);l.querySelector('[data-k="area"]').onchange=p=>h("area",p.target.value),l.querySelector('[data-k="mode"]').onchange=p=>h("ascii",p.target.value);const u=(p,m,S,w=_=>_.toFixed(2))=>{const _=f(p),M=_.nextElementSibling,y=()=>{_.value=String(m()),M.textContent=w(m())};return _.oninput=()=>{S(Number(_.value)),y()},_.onchange=()=>{(p==="cell"||p==="light")&&a?.()},y},d=[u("cell",()=>i.style.cellSize,p=>i.setStyle({cellSize:p}),p=>`${p}px`),u("light",()=>i.style.brightness,p=>i.setStyle({brightness:p}),p=>`${Math.round(p*100)}%`),u("zoom",()=>e.zoom,p=>{e.zoom=p}),u("angle",()=>e.angle,p=>{e.angle=p})],g=l.querySelector('[data-k="pause"]');if(g.onclick=()=>{e.paused=!e.paused,g.textContent=e.paused?"[ resume ]":"[ pause ]"},l.querySelector('[data-k="shot"]').onclick=r,!c){const p=f("import");p.onchange=()=>{o(Array.from(p.files??[])),p.value=""},l.querySelector('[data-k="save"]').onclick=()=>{const S=new Blob([JSON.stringify(i.exportStyle(),null,2)],{type:"application/json"}),w=document.createElement("a");w.href=URL.createObjectURL(S),w.download="preset-ascii.json",w.click(),setTimeout(()=>URL.revokeObjectURL(w.href),1e3)};const m=f("load");m.onchange=async()=>{const S=m.files?.[0];if(m.value="",!!S)try{const w=ji({version:1,objects:[],style:JSON.parse(await S.text())});i.setStyle(w.style),x(),a?.()}catch(w){document.getElementById("status").dataset.note=`invalid preset: ${w}`}}}const x=()=>d.forEach(p=>p());return x(),{refresh:x}}const $S=!0,Ep={dark_forest:{title:"Dark Forest",create:wS},rain_marsh:{title:"Rain Marsh",create:LS,hooks:IS},snow_pines:{title:"Snow Pines",create:OS},old_mine:{title:"Old Mine",create:HS},sunken_cathedral:{title:"Sunken Cathedral",create:VS}},vl=Ep,qt=new URLSearchParams(location.search),Ap=void 0,hh=qt.has("player");hh&&document.body.classList.add("player");document.getElementById("selection").remove();const qS=void 0,_l=document.getElementById("app"),At=document.createElement("canvas");At.style.width=At.style.height="100%";At.style.display="block";_l.appendChild(At);const fc=qt.get("area"),Tp=fc&&Object.hasOwn(Ep,fc)?fc:"dark_forest",Rp=vl[Tp]??vl.dark_forest,Yt=YM(At,{hooks:Rp.hooks,style:Ap?.style}),Or=qt.get("ascii")??"letters";Yt.debug.raw=Or==="raw";const It=await Promise.resolve().then(()=>Rp.create(Yt,{screen:Or==="screen",camp:qt.has("camp"),hunt:qt.has("hunt")?Number(qt.get("hunt")):void 0,at:qt.has("at")?Number(qt.get("at")):void 0,peaceful:qt.has("peaceful"),scene:qS})).catch(i=>{const e=document.createElement("p");throw e.textContent=`Could not open the scene: ${i}`,e.style.cssText="position:fixed;inset:20px;z-index:10;background:#141219;padding:20px",document.body.append(e),i}),sn={angle:Number(qt.get("angle")??0),zoom:Number(qt.get("zoom")??Ap?.zoom??(It.id==="sandbox"&&!hh?.8:.9)),elevation:zt.clamp(Number(qt.get("elevation")??Math.atan2(18,15)),.02,Math.PI/2-.01),paused:!1,pauseAt:qt.has("pause")?Number(qt.get("pause")):1/0};qt.has("cell")&&Yt.setStyle({cellSize:Number(qt.get("cell"))});qt.has("light")&&Yt.setStyle({brightness:Number(qt.get("light"))});let ua=!1,Cp=!1,zo=0,Bo=0;const oi=new F,pf=new F,Ao=new F;At.addEventListener("contextmenu",i=>i.preventDefault());At.addEventListener("pointerdown",i=>{const e=It.navigation?It.navigation(i):i.button!==0||i.shiftKey?"pan":"orbit";!e||It.cameraView?.()||(ua=!0,Cp=e==="pan",zo=i.clientX,Bo=i.clientY,At.setPointerCapture(i.pointerId))});At.addEventListener("pointermove",i=>{if(ua){if(Cp&&It.pan){const e=Yt.camera,t=At.getBoundingClientRect(),n=(i.clientX-zo)*(e.right-e.left)/(t.width*e.zoom),s=(i.clientY-Bo)*(e.top-e.bottom)/(t.height*e.zoom);oi.setFromMatrixColumn(e.matrixWorld,0).multiplyScalar(-n),pf.setFromMatrixColumn(e.matrixWorld,1),oi.addScaledVector(pf,s),e.getWorldDirection(Ao),Math.abs(Ao.y)>.15?(oi.addScaledVector(Ao,-oi.y/Ao.y),It.pan(oi.x,oi.z)):It.pan(oi.x,oi.z,oi.y)}else sn.angle+=(i.clientX-zo)*.006,sn.elevation=zt.clamp(sn.elevation+(i.clientY-Bo)*.006,.02,Math.PI/2-.01);zo=i.clientX,Bo=i.clientY}});At.addEventListener("pointerup",()=>{ua=!1});At.addEventListener("pointercancel",()=>{ua=!1});At.addEventListener("editor-view-reset",()=>{sn.angle=0,sn.elevation=Math.atan2(18,15)});At.addEventListener("wheel",i=>{i.preventDefault(),!It.cameraView?.()&&(sn.zoom=zt.clamp(sn.zoom*Math.exp(-i.deltaY*.001),It.id==="sandbox"?.18:.75,It.id==="sandbox"?4:1.5))},{passive:!1});const YS=[];addEventListener("dragover",i=>i.preventDefault());const Pp=i=>{};addEventListener("drop",i=>{i.preventDefault(),Array.from(i.dataTransfer?.files??[]).length});At.addEventListener("editor-import-files",i=>Pp(i.detail));const KS=XS({engine:Yt,view:sn,areas:vl,areaId:Tp,mode:Or,viewer:$S,capture:()=>yl=!0,importFiles:Pp,changed:It.changed}),To=document.getElementById("status"),JS=new F;let Ro=0,dc=0,pc=0,mc=0,yl=!1,gc=Math.PI/7;function ZS(){const i=It.cameraView?.();if(i){const e=Math.min(_l.clientWidth,_l.clientHeight*i.aspect),t=e/i.aspect;return Object.assign(At.style,{width:`${e}px`,height:`${t}px`,position:"absolute",left:"50%",top:"50%",transform:"translate(-50%, -50%)"}),(Yt.size.width!==At.clientWidth||Yt.size.height!==At.clientHeight)&&Yt.resize(),At.dataset.cameraView=i.name,up(Yt.camera,i),!0}return At.dataset.cameraView&&(Object.assign(At.style,{width:"100%",height:"100%",position:"",left:"",top:"",transform:""}),delete At.dataset.cameraView,Yt.resize()),!1}function Ip(i){if(document.hidden){Ro=i;return}const e=Ro?(i-Ro)/1e3:0;if(Ro=i,It.renderPreview?.(Math.max(0,e))){To.textContent=`${document.body.classList.contains("texture-studio-active")?"Texture":"Effect"} studio · isolated preview · the map is paused`;return}let t=sn.paused?0:zt.clamp(e,0,.08);Yt.time+t>sn.pauseAt&&(t=Math.max(0,sn.pauseAt-Yt.time));const n=ZS(),{width:s,height:r}=Yt.size;if(gc=Math.PI/7+sn.angle,t>0){It.update(Yt.time+t,t);for(const o of YS)o.update(t)}n||Yt.frame(It.focus(gc,JS),XM(r,s/r,sn.zoom),gc,sn.elevation),It.renderCameraPreview?.(),Yt.render(t),It.renderOverlay?.(),yl&&(yl=!1,QS(At.toDataURL("image/png"))),dc++,i-pc>1e3&&(mc=Math.round(dc*1e3/(i-pc)),dc=0,pc=i,KS.refresh()),hh||(To.textContent=`ascii-engine ${fp} · ${It.title}${Or!=="letters"?` (${Or})`:""} · ${mc} fps · ${It.state}${To.dataset.note?` · ${To.dataset.note}`:""}`),At.dataset.ready="true",At.dataset.state=It.state,At.dataset.fps=String(mc)}let Lp=performance.now();function Dp(i){Lp=i,Ip(i),requestAnimationFrame(Dp)}requestAnimationFrame(Dp);const jS=setInterval(()=>{const i=performance.now();!document.hidden&&i-Lp>150&&Ip(i)},50);addEventListener("pagehide",()=>clearInterval(jS),{once:!0});function QS(i){const e=document.createElement("a");e.href=i,e.download=`${It.id}-${Date.now()}.png`,e.click()}Object.assign(window,{engine:Yt,area:It,view:sn,core:VM});
