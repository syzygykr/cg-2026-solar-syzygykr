/* Free-fly camera: the inspection model stays fixed in world space. */
window.InspectionControls = function(canvas) {
  const worldUp=[0,1,0];
  const state={
    position:[3,8,28],yaw:-Math.PI/2,pitch:-0.16,
    front:[0,0,-1],right:[1,0,0],up:[0,1,0],
    speed:9,mouseSensitivity:0.0025,fov:45,actions:0,currentWaypointIndex:-1
  };
  const waypoints=[
    {name:'P1',position:[-2.3,2.0,7.8],yaw:-Math.PI/2,pitch:0},
    {name:'P2',position:[3.1,1.3,0.5],yaw:-Math.PI/2,pitch:0},
    {name:'P3',position:[-2.9,4.1,2.9],yaw:-Math.PI/2,pitch:0},
    {name:'P4',position:[0.7,9.7,3.3],yaw:-Math.PI/2,pitch:0},
    {name:'P5',position:[-0.3,5.5,-7.4],yaw:Math.PI/2,pitch:0},
    {name:'P6',position:[11.1,1.3,4.1],yaw:-Math.PI/2,pitch:0},
    {name:'O1',position:[10.9,4.8,14.3],yaw:-Math.PI/2,pitch:0},
    {name:'O2',position:[29.8,4.7,-0.6],yaw:Math.PI,pitch:0}
  ];
  const keys=new Set();
  let previousTime=null;

  const normalize=v=>{const n=Math.hypot(...v)||1;return v.map(x=>x/n);};
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  function updateBasis(){
    const cp=Math.cos(state.pitch);
    state.front=normalize([Math.cos(state.yaw)*cp,Math.sin(state.pitch),Math.sin(state.yaw)*cp]);
    state.right=normalize(cross(state.front,worldUp));
    state.up=normalize(cross(state.right,state.front));
  }
  function home(){
    // Frames the complete site (approximately x=-8..14.5, y=-.55..9.7, z=-7.5..7.5).
    state.position=[3,8,30];state.yaw=-Math.PI/2;state.pitch=-0.15;updateBasis();previousTime=null;
  }
  function camera(){
    return {eye:[...state.position],target:state.position.map((v,i)=>v+state.front[i]),up:[...state.up],fov:state.fov};
  }
  function selectWaypoint(index){
    if(index<0||index>=waypoints.length)return;
    state.currentWaypointIndex=index;
    state.position=[...waypoints[index].position];
    state.yaw=waypoints[index].yaw;
    state.pitch=waypoints[index].pitch;
    updateBasis();
  }
  function update(now){
    if(previousTime===null){previousTime=now;return;}
    const dt=Math.min((now-previousTime)/1000,0.05);previousTime=now;
    const move=[0,0,0];
    if(keys.has('KeyW'))for(let i=0;i<3;i++)move[i]+=state.front[i];
    if(keys.has('KeyS'))for(let i=0;i<3;i++)move[i]-=state.front[i];
    if(keys.has('KeyD'))for(let i=0;i<3;i++)move[i]+=state.right[i];
    if(keys.has('KeyA'))for(let i=0;i<3;i++)move[i]-=state.right[i];
    if(keys.has('Space'))move[1]+=1;
    if(keys.has('ShiftLeft'))move[1]-=1;
    const length=Math.hypot(...move);
    if(length>0){for(let i=0;i<3;i++)state.position[i]+=move[i]/length*state.speed*dt;}
  }
  canvas.style.touchAction='none';
  canvas.addEventListener('click',()=>{canvas.focus();if(document.pointerLockElement!==canvas)canvas.requestPointerLock?.();});
  document.addEventListener('mousemove',e=>{
    if(document.pointerLockElement!==canvas)return;
    state.yaw+=e.movementX*state.mouseSensitivity;
    state.pitch-=e.movementY*state.mouseSensitivity;
    state.pitch=Math.max(-89*Math.PI/180,Math.min(89*Math.PI/180,state.pitch));
    updateBasis();
  });
  canvas.addEventListener('keydown',e=>{
    if(['KeyW','KeyA','KeyS','KeyD','Space','ShiftLeft'].includes(e.code)){e.preventDefault();keys.add(e.code);}
    if(e.code==='KeyR'){home();state.actions++;}
    if((e.code==='KeyQ'||e.code==='KeyE')&&!e.repeat){
      e.preventDefault();
      const next=state.currentWaypointIndex+(e.code==='KeyQ'?-1:1);
      if(next>=0&&next<waypoints.length){selectWaypoint(next);state.actions++;}
    }
  });
  canvas.addEventListener('keyup',e=>keys.delete(e.code));
  window.addEventListener('blur',()=>keys.clear());
  document.addEventListener('pointerlockchange',()=>{canvas.style.cursor=document.pointerLockElement===canvas?'none':'grab';});
  function releaseKeys(){keys.clear();}
  document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseKeys();});
  home();
  return {state,waypoints,home,camera,update};
};
