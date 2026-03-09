
document.addEventListener('DOMContentLoaded',()=>{
  // Copy buttons
  document.querySelectorAll('pre').forEach(pre=>{
    const btn=document.createElement('button');
    btn.className='copy-btn';btn.textContent='نسخ';
    pre.appendChild(btn);
    btn.addEventListener('click',()=>{
      navigator.clipboard.writeText(pre.querySelector('code').innerText).then(()=>{
        btn.textContent='✓ تم';btn.classList.add('copied');
        setTimeout(()=>{btn.textContent='نسخ';btn.classList.remove('copied');},2000);
      });
    });
  });

  // Sidebar search
  const s=document.getElementById('sidebar-search');
  if(s) s.addEventListener('input',()=>{
    const q=s.value.trim().toLowerCase();
    document.querySelectorAll('.sidebar nav a').forEach(a=>{
      a.style.display=a.textContent.toLowerCase().includes(q)?'':'none';
    });
  });

  // Active sidebar link on scroll
  const sections=document.querySelectorAll('.section');
  const links=document.querySelectorAll('.sidebar nav a');
  if(sections.length&&links.length){
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          links.forEach(l=>l.classList.remove('active'));
          const link=document.querySelector(`.sidebar nav a[href="#${e.target.id}"]`);
          if(link) link.classList.add('active');
        }
      });
    },{rootMargin:'-60px 0px -70% 0px'});
    sections.forEach(s=>obs.observe(s));
  }
});
