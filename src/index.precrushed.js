b=200,h=1,k=0,l=0;c.fillStyle="#000";c.fillRect(0,0,1024,720);for(m=0;1024>m+35;m+=35)for(n=0;720>n;n+=35)c.fillStyle="rgba("+[255*Math.random()|0,255*Math.random()|0,255*Math.random()|0].join()+",0.5)",c.font="25px monospace",c.fillText(9*Math.random()|0,m,n,25);ww=c.getImageData(0,0,1024,720); with(new AudioContext){for(p=createBuffer(1,44100,44100),q=0;44100>q;q++)p.getChannelData(0)[q]=2*Math.random()-1;(a1=()=>{a=currentTime,g=a+.2,d=createOscillator(),f=createGain();d.type="triangle";d.frequency.value=18;f.gain.setValueAtTime(7,a);f.gain.exponentialRampToValueAtTime(.001,g);d.connect(f);f.connect(destination);d.start(a);d.stop(g);a+=1;g=a+.03;d=createBufferSource();f=createGain();d.buffer=p;f.gain.value=.2;d.connect(f);f.connect(destination);d.start(a);d.stop(g);setTimeout(a1, 2E3)})()}c.font="700 "+c.font;r=0;r=(e)=>{l-=.5;c.putImageData(ww,l,0);c.putImageData(ww,l+1024,0);-1024>l&&(l=0);350<b+45&&1===h&&(h=-1);150>b&&-1===h&&(h=1);a=150/(b||1);b+=3*h*Math.sin(3.14*a);c.fillStyle="#ffd";c.beginPath();c.ellipse(512,b,45,45,0,0,6.2832);c.fill();c.fillStyle="#000";c.beginPath();c.ellipse(487,b,5,15,0,0,6.2832);c.fill();c.beginPath();c.ellipse(537,b,5,15,0,0,6.2832);c.fill();c.fillStyle="#10b";c.beginPath();c.moveTo(467,b-22.5);c.lineTo(512,b-45-70);c.lineTo(557, b-22.5);c.lineTo(467,b-22.5);c.fill();if(!k||4E3<e-k)k=e,xx=5E4*Math.random()|0,yy=5E4*Math.random()|0,zz=xx*yy;a=(e-k)/4E3;e=1+2*a;g=1-a;c.rotate(1.57-2*a);c.scale(e,e);c.fillStyle="rgba(255, 255, 255, "+g+")";c.fillText(xx+" x "+yy+" \x3d "+zz,150,50);c.resetTransform();requestAnimationFrame(r)};r()