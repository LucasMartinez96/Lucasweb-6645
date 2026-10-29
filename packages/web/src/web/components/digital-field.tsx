import { useEffect, useRef } from 'react';
export function DigitalField({enabled}:{enabled:boolean}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
 let width=0,height=0,frame=0,last=0,visible=true; const pointer={x:.6,y:.4};
 const points=Array.from({length:window.innerWidth<700?18:38},(_,i)=>({x:((i*73+19)%100)/100,y:((i*37+7)%100)/100,size:i%4===0?3:1.5}));
 const resize=()=>{const rect=canvas.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);draw(0)};
 const draw=(time:number)=>{ctx.clearRect(0,0,width,height);points.forEach((p,i)=>{const drift=enabled?Math.sin(time*.00025+i)*7:0;const x=p.x*width+(pointer.x-.5)*12;const y=p.y*height+drift;ctx.fillStyle=i%4===0?'rgba(56,205,255,.7)':'rgba(41,136,219,.38)';ctx.fillRect(x,y,p.size,p.size);if(i%7===0){ctx.strokeStyle='rgba(31,130,200,.12)';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+35,y);ctx.lineTo(x+55,y+20);ctx.lineTo(x+90,y+20);ctx.stroke()}})};
 const loop=(time:number)=>{if(visible&&!document.hidden&&time-last>33){draw(time);last=time}frame=requestAnimationFrame(loop)};
 const move=(e:PointerEvent)=>{if(e.pointerType==='mouse'){const r=canvas.getBoundingClientRect();pointer.x=e.clientX/r.width;pointer.y=(e.clientY-r.top)/r.height}};
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting});observer.observe(canvas);resize();window.addEventListener('resize',resize);if(enabled){frame=requestAnimationFrame(loop);window.addEventListener('pointermove',move)}
 return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',resize);window.removeEventListener('pointermove',move)};
 },[enabled]);return <canvas ref={ref} className="digital-field" aria-hidden="true"/>;
}
