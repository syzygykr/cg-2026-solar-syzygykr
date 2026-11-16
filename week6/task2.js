/* 실습 2 · 녹슨 금속 행성 페록스.
 * 규칙 1: 태양 거리 → 낮쪽 용융 마스크 → 주황 발광·낮은 거칠기.
 * 규칙 2: 독립적인 분사량 → 로컬 구면 에어브러시 → 하늘색 비금속 도막.
 */
(() => {
'use strict';
const cv=document.querySelector('#cv'), gl=D.context(cv); if(!gl)return;
const VS=`#version 300 es
layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUV;
uniform mat4 uVP,uModel;
out vec3 vP,vN,vLocal; out vec2 vUV;
void main(){
 vec4 world=uModel*vec4(aPos,1.0);
 vP=world.xyz;
 vN=mat3(transpose(inverse(uModel)))*aNormal;
 vLocal=aPos;vUV=aUV;
 gl_Position=uVP*world;
}`;
const FS=`#version 300 es
precision highp float;
const float PI=3.14159265;
in vec3 vP,vN,vLocal; in vec2 vUV; out vec4 outColor;
uniform sampler2D uColor,uNormal,uARM,uEnv;
uniform vec3 uEye,uLight,uTint;
uniform bool uEmissive;
uniform float uSolarDistance,uPaint;
uniform int uDisplay; // 0 변화, 1 기본, 2 용융 마스크, 3 페인트 마스크
uniform float uRough,uMetal,uNormalStrength,uPower,uAmbient,uEnvPower;

vec3 srgbToLinear(vec3 c){
 return mix(c/12.92,pow((c+.055)/1.055,vec3(2.4)),step(vec3(.04045),c));
}
vec3 linearToSrgb(vec3 c){
 return mix(12.92*c,1.055*pow(c,vec3(1./2.4))-.055,step(vec3(.0031308),c));
}

// TODO 2: D(GGX), F(Schlick), G(Smith-Schlick)를 계산해
// 직접광 PBR 결과를 반환하세요. 6주차 3-2절을 참고하세요.
vec3 directPBR(vec3 N,vec3 V,vec3 L,vec3 base,float rough,float metal){
 vec3 H = normalize(V + L);
 float nl = max(dot(N,L),0.0), nv = max(dot(N,V),0.0);
 float nh = max(dot(N,H),0.0), vh = max(dot(V,H),0.0);
 float a = rough*rough, a2 = a*a;
 float den = nh*nh*(a2-1.0)+1.0;
 // D: GGX 미세면 법선 분포 — roughness가 하이라이트 폭을 결정합니다.
 float D = a2 / max(PI*den*den, 1e-6);
 float k = (rough+1.0)*(rough+1.0)/8.0;
 // G: Smith-Schlick 차폐 및 그림자 근사.
 float G = (nl/(nl*(1.0-k)+k)) * (nv/(nv*(1.0-k)+k));
 vec3 F0 = mix(vec3(0.04), base, metal);
 // F: Schlick Fresnel — 금속은 base color로 정반사가 착색됩니다.
 vec3 F = F0 + (1.0-F0)*pow(1.0-vh,5.0);
 vec3 kd = (1.0-F)*(1.0-metal);
 return (kd*base/PI + D*G*F/max(4.0*nl*nv,1e-4))*nl*uPower;
}

// 규칙 1: 실제 중심 거리 3~7을 열량 1~0으로 환산합니다.
// 월드 법선과 태양 방향으로 낮쪽을 구분하고, 로컬 패턴으로 불규칙한 경계를 만듭니다.
float meltRegion(vec3 local,vec3 worldNormal,vec3 lightDirection){
 float heat=clamp((7.0-uSolarDistance)/4.0,0.0,1.0);
 float facing=dot(worldNormal,lightDirection);
 float ridges=sin(local.y*17.0+sin(local.x*12.0))*sin(local.z*15.0)*0.10;
 float threshold=mix(1.15,-0.12,heat);
 return smoothstep(threshold-0.12,threshold+0.12,facing+ridges)*heat;
}

// 페인트는 로컬 좌표에 고정되어 자전과 함께 회전합니다.
// 규칙 2: 하나의 분사 지점에서 구면 거리가 가까운 부분부터 부드럽게 덮습니다.
// 분사량은 태양 거리와 독립적이며 0에서는 완전히 사라집니다.
float paintRegion(vec3 local){
 float amount=uPaint;
 vec3 direction=normalize(local);
 vec3 sprayCenter=normalize(vec3(0.2,0.25,1.0));
 float angle=acos(clamp(dot(direction,sprayCenter),-1.0,1.0));
 float grain=sin(direction.x*95.0)*sin(direction.y*83.0)*sin(direction.z*71.0);
 float radius=3.5*amount*amount; // 중간 분사량에서 전체가 덮이지 않도록 확장 속도 조절
 float coverage=1.0-smoothstep(max(0.0,radius-0.42),radius+0.16,angle+grain*0.045);
 return coverage*smoothstep(0.0,0.12,amount);
}

void main(){
 // 태양은 조명을 받는 재질 대신 자체 발광색으로 표시합니다.
 if(uEmissive){outColor=vec4(linearToSrgb(uTint),1.0);return;}
 // 광원·표면·카메라를 모두 월드 좌표에서 계산합니다.
 vec3 toLight=uLight-vP;
 float attenuation=1.0/(1.0+0.02*dot(toLight,toLight));
 vec3 N=normalize(vN),V=normalize(uEye-vP),L=normalize(toLight);
 float melt=meltRegion(vLocal,N,L);
 float paint=paintRegion(vLocal);
 // 진단 화면은 조명·감마·톤 매핑 없이 계산한 마스크를 그대로 표시합니다.
 if(uDisplay==2||uDisplay==3){
  float mask=uDisplay==2?melt:paint;
  outColor=vec4(vec3(mask),1.0);return;
 }
 vec3 emission=vec3(0.0);
 vec3 base=uTint;
 // TODO 1: texture(uColor,vUV).rgb를 읽어 선형화하고 base에 사용하세요.
 // 색 맵만 sRGB에서 선형으로 변환합니다. ARM/normal은 수치 데이터입니다.
 base = srgbToLinear(texture(uColor, vUV).rgb) * uTint;

 float rough=uRough,metal=uMetal,ao=1.0;
 // TODO 3: uARM의 R(AO), G(roughness), B(metallic)를 읽으세요.
 // 슬라이더 uRough/uMetal은 맵 값에 곱하는 배율입니다.
 vec3 arm = texture(uARM, vUV).rgb;
 ao = arm.r;
 rough = max(arm.g*uRough, 0.045);
 metal = arm.b*uMetal;

 // 마스크 → PBR 연결. 기본 보기에서는 같은 위치·조명에서 변화만 제외합니다.
 if(uDisplay==0){
  base=mix(base,vec3(0.85,0.12,0.008),melt);
  rough=mix(rough,0.16,melt);
  metal=mix(metal,1.0,melt);
  emission=vec3(4.0,0.65,0.015)*melt;
  // 페인트는 금속 위의 비금속 도막. 도막이 용융색·발광을 가리는 교육용 규칙입니다.
  base=mix(base,vec3(0.35,0.75,1.0),paint);
  rough=mix(rough,0.32,paint);
  metal=mix(metal,0.0,paint);
  emission*=1.0-paint;
 }

 // TODO 4: uNormal에서 접선 공간 법선을 읽고 N을 바꾸세요.
 // vP와 vUV의 dFdx/dFdy로 TBN을 만들어도 됩니다.
 // uNormalStrength=0이면 기하 법선을 그대로 사용합니다.
 if (uNormalStrength > 0.0) {
  vec3 dp1=dFdx(vP), dp2=dFdy(vP);
  vec2 du1=dFdx(vUV), du2=dFdy(vUV);
  vec3 T=cross(dp2,N)*du1.x+cross(N,dp1)*du2.x;
  vec3 B=cross(dp2,N)*du1.y+cross(N,dp1)*du2.y;
  float inv=inversesqrt(max(max(dot(T,T),dot(B,B)),1e-8));
  vec3 mapN=texture(uNormal,vUV).xyz*2.0-1.0;
  mapN.xy *= uNormalStrength;
  N=normalize(mat3(T*inv,B*inv,N)*normalize(mapN));
 }

 // TODO 2 구현: 직접광에는 AO를 곱하지 않고 간접광에만 적용합니다.
 vec3 color = directPBR(N,V,L,base,rough,metal)*attenuation;
 vec3 F0 = mix(vec3(0.04),base,metal);
 color += uAmbient * ao * (base*(1.0-metal)*(1.0-F0)+F0);

 // TODO 5: 환경 파노라마를 reflect(-V,N) 방향으로 조회해 반사를 더하세요.
 // 금속에서 정반사색은 base, 유전체의 정면 반사율은 약 0.04입니다.
 // 이미지 밝기 uEnvPower와 상수 ambient uAmbient는 별개입니다.
 vec3 reflected = reflect(-V,N);
 vec2 envUV = vec2(atan(reflected.z,reflected.x)/(2.0*PI)+0.5,
                   asin(clamp(reflected.y,-1.0,1.0))/PI+0.5);
 vec3 envColor = srgbToLinear(textureLod(uEnv,envUV,rough*7.0).rgb);
 vec3 envF0 = mix(vec3(0.04),base,metal);
 color += uEnvPower * ao * envColor * envF0;

 color+=emission; // 용융 철의 자체 발광은 모든 광원을 꺼도 남습니다.
 color=max(color,vec3(0.0));
 color=color/(1.0+color); // HDR → 표시 범위
 outColor=vec4(linearToSrgb(color),1.0);
}`;
const prog=D.program(gl,VS,FS),U=D.uniforms(gl,prog,[
 'uSolarDistance','uPaint','uDisplay','uModel','uEmissive','uVP','uEye','uLight','uTint','uRough','uMetal','uNormalStrength','uPower','uAmbient','uEnvPower',
 'uColor','uNormal','uARM','uEnv'
]);
// 5주차 makeSphere에 UV를 추가하고 D.upload의 속성 이름에 맞췄습니다.
function makeSphere(seg=48){
 const pos=[],nrm=[],uv=[],idx=[];
 for(let i=0;i<=seg;i++){
  const phi=Math.PI*i/seg;
  for(let j=0;j<=seg*2;j++){
   const theta=2*Math.PI*j/(seg*2);
   const x=Math.sin(phi)*Math.cos(theta),y=Math.cos(phi),z=Math.sin(phi)*Math.sin(theta);
   pos.push(x,y,z);nrm.push(x,y,z);uv.push(j/(seg*2),1-i/seg);
  }
 }
 const width=seg*2+1;
 for(let i=0;i<seg;i++)for(let j=0;j<seg*2;j++){
  const a=i*width+j,b=a+width;
  idx.push(a,a+1,b,a+1,b+1,b);
 }
 return {pos:new Float32Array(pos),nrm:new Float32Array(nrm),uv:new Float32Array(uv),idx:new Uint16Array(idx)};
}
const mesh=D.upload(gl,makeSphere());
const assets={rusty_metal_04:['Diffuse','nor_gl','arm']};
const textures={},jobs=[];let failed=false;
function load(name){
 const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([128,128,255,255]));
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
 jobs.push(new Promise(resolve=>{const img=new Image();img.onload=()=>{
  gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);
  resolve();
 };img.onerror=()=>{failed=true;resolve();};
 img.src='assets/week06/'+name+(name.endsWith('_arm')?'.png':'.jpg');}));
 return tex;
}
for(const [asset,kinds] of Object.entries(assets))textures[asset]=kinds.map(kind=>load(asset+'_'+kind));
const envTex=load('studio_small_09_tonemapped');
Promise.all(jobs).then(()=>{document.querySelector('#status').textContent=failed?'텍스처 로딩 실패: HTTP 서버와 파일 경로 확인':'텍스처 로딩 완료 · PBR 재질 적용';});
document.querySelector('#ui').innerHTML='';
const S=D.UI('#ui',[
 {id:'distance',label:'태양과의 거리 (0 가까움 → 100 멂)',min:0,max:100,step:1,value:50},
 {id:'paint',label:'밝은 하늘색 페인트 분사량',min:0,max:100,step:1,value:0},
 {id:'display',type:'select',label:'계산 결과 보기',value:'0',options:[
  {value:'0',label:'변화한 표면'},{value:'1',label:'기본 표면'},
  {value:'2',label:'마스크 1 · 용융 (흑백)'},{value:'3',label:'마스크 2 · 페인트 (흑백)'}]},
 {id:'rough',label:'roughness 배율',min:.05,max:1,step:.01,value:1},
 {id:'metal',label:'metallic 배율',min:0,max:1,step:.01,value:1},
 {id:'normal',label:'normal 강도',min:0,max:10,step:.1,value:5},
 {id:'power',label:'직접광 세기',min:0,max:8,step:.1,value:4},
 {id:'ambient',label:'상수 ambient',min:0,max:1,step:.01,value:.15},
 {id:'env',label:'환경맵 반사 세기',min:0,max:3,step:.1,value:1.5},
]);

// 5주차의 시간 제어를 유지해 같은 시점에서 표면을 비교할 수 있습니다.
let sceneTime=0,previousTime=performance.now(),paused=false;
const pause=document.createElement('button');pause.textContent='자전 일시정지';
 document.querySelector('#ui').append(pause);
pause.onclick=()=>{paused=!paused;pause.textContent=paused?'자전 재생':'자전 일시정지';};
const cam=D.orbit(cv,{dist:13,pitch:.2});
document.querySelector('#reset').onclick=()=>{cam.dist=13;cam.yaw=0;cam.pitch=.2;sceneTime=0;};
const view=D.M4.create(),proj=D.M4.create(),vp=D.M4.create();
const planetModel=D.M4.create(),sunModel=D.M4.create();
const sunPosition=[-3,0,0],planetPosition=[2,0,0];
const sceneInfo=document.createElement('p');sceneInfo.className='note';document.querySelector('#ui').append(sceneInfo);
function draw(model,tint,emissive){
 gl.uniformMatrix4fv(U.uModel,false,model);
 gl.uniform3fv(U.uTint,tint);gl.uniform1i(U.uEmissive,emissive?1:0);
 gl.bindVertexArray(mesh.vao);gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0);
}
document.querySelector('#note').textContent='태양에 가까워지면 낮쪽부터 주황색으로 녹습니다. 하늘색 페인트는 한 지점부터 퍼집니다. 비교할 때 자전을 멈추세요. 페인트가 겹친 부분은 용융 발광을 가립니다.';
let visible=true;new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(cv);
D.loop(()=>{
 const now=performance.now();
 if(!paused&&visible&&!document.hidden)sceneTime+=Math.min((now-previousTime)/1000,.1);
 previousTime=now;
 if(!visible||document.hidden)return;
 D.fit(cv);gl.viewport(0,0,cv.width,cv.height);D.clearColor(gl);gl.enable(gl.DEPTH_TEST);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
 const eye=cam.eye([.5,0,0]);D.M4.lookAt(view,eye,[.5,0,0],[0,1,0]);D.M4.perspective(proj,Math.PI/4,cv.width/cv.height,.1,100);D.M4.multiply(vp,proj,view);
 gl.useProgram(prog);gl.uniformMatrix4fv(U.uVP,false,vp);gl.uniform3fv(U.uEye,eye);
 // 슬라이더가 실제 장면의 거리와 받는 빛, 용융 영역을 함께 바꿉니다.
 const distance=3+4*S.distance/100;
 planetPosition[0]=sunPosition[0]+distance;
 gl.uniform3fv(U.uLight,sunPosition);
 gl.uniform1f(U.uSolarDistance,distance);gl.uniform1f(U.uPaint,S.paint/100);
 gl.uniform1i(U.uDisplay,Number(S.display));
 sceneInfo.textContent=`태양 중심 거리 ${distance.toFixed(2)} · 분사량 ${S.paint}%`;

 for(const [key,value] of Object.entries({uRough:S.rough,uMetal:S.metal,uNormalStrength:S.normal,uPower:S.power,uAmbient:S.ambient,uEnvPower:S.env}))gl.uniform1f(U[key],value);
 [...textures.rusty_metal_04,envTex].forEach((tex,i)=>{
  gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,tex);
  gl.uniform1i(U[['uColor','uNormal','uARM','uEnv'][i]],i);
 });
 D.M4.identity(planetModel);
 D.M4.translate(planetModel,planetModel,planetPosition);
 D.M4.rotateY(planetModel,planetModel,sceneTime*.3);
 D.M4.scale(planetModel,planetModel,[1.3,1.3,1.3]);
 draw(planetModel,[.6,.6,.6],false);
 D.M4.identity(sunModel);D.M4.translate(sunModel,sunModel,sunPosition);
 D.M4.scale(sunModel,sunModel,[.7,.7,.7]);
 draw(sunModel,[1,.75,.3],true);
 gl.bindVertexArray(null);
});
})();
