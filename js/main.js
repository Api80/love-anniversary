const start = new Date('2026-05-01T00:00:00');
function update(){
 const now=new Date();
 const diff=now-start;
 const days=Math.floor(diff/86400000);
 const hours=Math.floor(diff/3600000)%24;
 const mins=Math.floor(diff/60000)%60;
 const secs=Math.floor(diff/1000)%60;
 document.getElementById('counter').innerHTML=`已经相伴 ${days} 天 ${hours} 小时 ${mins} 分 ${secs} 秒 ❤️`;
}
setInterval(update,1000);update();

const items=document.querySelectorAll('.memory');
const observer=new IntersectionObserver(entries=>{
 entries.forEach(e=>{if(e.isIntersecting)e.target.style.opacity=1;});
});
items.forEach(i=>observer.observe(i));

document.getElementById('music').onclick=()=>{
 alert('这里可以放你们喜欢的背景音乐 🎵');
};