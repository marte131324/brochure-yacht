/* ========================================
   AZURE HORIZON — Ultra-Premium Engine v4
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {

    const params = new URLSearchParams(window.location.search);
    const guestName = params.get('guest') || '';
    const haptic = (ms = 10) => { if ('vibrate' in navigator) navigator.vibrate(ms); };

    /* ═══ GOLD PARTICLE SYSTEM ═══ */
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas(); window.addEventListener('resize', resizeCanvas);
    class Particle {
        constructor() { this.reset(); }
        reset() { this.x = Math.random()*canvas.width; this.y = canvas.height+Math.random()*100; this.size = Math.random()*1.8+0.4; this.speedY = -(Math.random()*0.4+0.15); this.speedX = (Math.random()-0.5)*0.15; this.opacity = 0; this.maxOpacity = Math.random()*0.35+0.08; this.fadeIn = true; }
        update() { this.y += this.speedY; this.x += this.speedX + Math.sin(this.y*0.005)*0.1; if (this.fadeIn) { this.opacity = Math.min(this.opacity+0.004, this.maxOpacity); if (this.opacity>=this.maxOpacity) this.fadeIn=false; } else { this.opacity-=0.001; } if (this.y<-20 || this.opacity<=0) this.reset(); }
        draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fillStyle = `rgba(201,169,110,${this.opacity})`; ctx.fill(); }
    }
    for (let i=0; i<30; i++) { const p = new Particle(); p.y = Math.random()*canvas.height; particles.push(p); }
    let particlesActive = false;
    function animateParticles() { if (!particlesActive) { requestAnimationFrame(animateParticles); return; } ctx.clearRect(0,0,canvas.width,canvas.height); particles.forEach(p=>{p.update();p.draw();}); requestAnimationFrame(animateParticles); }
    animateParticles();

    /* ═══ 1. PIN ACCESS SCREEN ═══ */
    const PIN_CODE = '2026';
    const pinScreen = document.getElementById('pinScreen');
    const pinInputs = document.querySelectorAll('.pin-input');
    const pinError = document.getElementById('pinError');
    let pinValue = ['','','',''];

    pinInputs.forEach((inp, i) => {
        inp.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g,'');
            e.target.value = val; pinValue[i] = val;
            if (val && i < 3) pinInputs[i+1].focus();
            if (pinValue.join('').length === 4) checkPin();
            // User gesture to unlock audio
            startOceanSound();
        });
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !inp.value && i > 0) { pinInputs[i-1].focus(); pinInputs[i-1].value=''; pinValue[i-1]=''; }
        });
        inp.addEventListener('click', startOceanSound, { once: true });
    });

    function checkPin() {
        if (pinValue.join('') === PIN_CODE) {
            haptic(30);
            pinScreen.style.transition = 'opacity 1s ease, transform 1s ease';
            pinScreen.style.opacity = '0';
            pinScreen.style.transform = 'scale(1.05)';
            setTimeout(() => { pinScreen.style.display = 'none'; revealBrochure(); }, 800);
        } else {
            haptic([50,30,50]);
            pinError.classList.add('show');
            pinInputs.forEach(inp => { inp.classList.add('error'); inp.value=''; }); pinValue = ['','','',''];
            setTimeout(() => { pinError.classList.remove('show'); pinInputs.forEach(inp=>inp.classList.remove('error')); pinInputs[0].focus(); }, 1500);
        }
    }

    /* ═══ 2. SPLASH SCREEN (INTRO) ═══ */
    const splashScreen = document.getElementById('loadingScreen');
    const splashGreeting = document.getElementById('loadingGreeting');
    startSplash();

    function startSplash() {
        document.body.style.overflow = 'hidden';
        setTimeout(() => splashScreen.classList.add('active'), 100);
        if (guestName) splashGreeting.innerHTML = `Preparada para <strong>${decodeURIComponent(guestName)}</strong>`;
        else splashGreeting.innerHTML = 'Presentación Exclusiva';

        // Attempt pre-sound (might fail, but handled in startOceanSound)
        startOceanSound();

        setTimeout(() => {
            splashScreen.classList.add('revealed');
            pinScreen.classList.add('active'); 
            setTimeout(() => { if(pinInputs[0]) pinInputs[0].focus(); }, 1000);
        }, 3200);

        setTimeout(() => { splashScreen.style.display = 'none'; }, 4500);
    }

    function revealBrochure() {
        document.body.style.overflow = '';
        const nav = document.getElementById('mainNav'); const hero = document.querySelector('.hero');
        nav.style.transition = 'opacity 1s ease'; hero.style.transition = 'opacity 1.5s ease';
        nav.style.opacity = '1'; hero.style.opacity = '1';
        setTimeout(() => {
            document.querySelector('.wa-float').style.transition = 'opacity 0.8s ease'; document.querySelector('.wa-float').style.opacity = '1';
            document.getElementById('pdfBtn').style.transition = 'opacity 0.8s ease'; document.getElementById('pdfBtn').style.opacity = '1';
        }, 800);
        animateHero();
        document.querySelector('.nav-brand').classList.add('shimmer-text');
        particlesActive = true; canvas.style.opacity = '1';
    }

    /* ═══ 3. HERO ANIMATIONS ═══ */
    function animateHero() {
        const title = document.getElementById('heroTitle'); const raw = title.innerHTML;
        title.innerHTML = raw.replace(/(\S+)/g, '<span class="word-reveal"><span>$1</span></span>');
        const eyebrow = document.getElementById('heroEyebrow'); const desc = document.getElementById('heroDesc'); const cta = document.getElementById('heroCta');
        setTimeout(() => eyebrow.classList.add('hero-animated'), 100);
        setTimeout(() => title.querySelectorAll('.word-reveal').forEach((w,i) => setTimeout(() => w.classList.add('revealed'), i * 150)), 400);
        setTimeout(() => desc.classList.add('hero-animated'), 1200);
        setTimeout(() => cta.classList.add('hero-animated'), 1600);
    }

    /* ═══ 4. NAVIGATION ═══ */
    const nav = document.getElementById('mainNav'); const navToggle = document.getElementById('navToggle'); const navLinks = document.getElementById('navLinks');
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.pageYOffset > 80), { passive: true });
    navToggle.addEventListener('click', () => { haptic(); navToggle.classList.toggle('active'); navLinks.classList.toggle('open'); });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', (e) => { e.preventDefault(); haptic(); navToggle.classList.remove('active'); navLinks.classList.remove('open'); const t = document.querySelector(a.getAttribute('href')); if(t) window.scrollTo({ top: t.offsetTop - 60, behavior:'smooth' }); }));

    /* ═══ 5. AUDIO SYSTEM ═══ */
    let audioCtx = null, masterGain = null;
    function createOceanSound() {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = audioCtx.createGain(); masterGain.gain.value = 0; masterGain.connect(audioCtx.destination);
        const bufSz = 2 * audioCtx.sampleRate;
        const buf = audioCtx.createBuffer(1, bufSz, audioCtx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i=0;i<bufSz;i++) d[i] = Math.random()*2-1;
        const noise = audioCtx.createBufferSource(); noise.buffer = buf; noise.loop = true;
        const filt = audioCtx.createBiquadFilter(); filt.type='lowpass'; filt.frequency.value=400;
        const lfo = audioCtx.createOscillator(); const lfoG = audioCtx.createGain();
        lfo.frequency.value=0.12; lfoG.gain.value=150; lfo.connect(lfoG); lfoG.connect(filt.frequency); lfo.start();
        noise.connect(filt); filt.connect(masterGain); noise.start();
    }
    function startOceanSound() {
        try {
            if (!audioCtx) createOceanSound();
            if (audioCtx && audioCtx.state==='suspended') audioCtx.resume();
            if (masterGain && masterGain.gain.value === 0) {
                masterGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime+4);
            }
        } catch(e){}
    }
    document.addEventListener('visibilitychange', () => { if (!audioCtx||!masterGain) return; if (document.hidden) masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.3); else masterGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime+0.5); });

    /* ═══ 6. FADE ANIMATIONS ═══ */
    const fadeObs = new IntersectionObserver((entries) => { entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible'); fadeObs.unobserve(e.target);} }); }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

    /* ═══ 7. GAUGES ═══ */
    const gaugesGrid = document.getElementById('gaugesGrid'); const circumference = 2 * Math.PI * 40;
    gaugesGrid.querySelectorAll('.gauge-card').forEach(card => {
        const v = card.dataset.value, mx = card.dataset.max, u = card.dataset.unit, lb = card.dataset.label, ic = card.dataset.icon;
        const pct = Math.min(v/mx, 1);
        card.innerHTML = `<div class="gauge-icon">${ic}</div><svg class="gauge-svg" viewBox="0 0 100 100"><circle class="gauge-track" cx="50" cy="50" r="40"/><circle class="gauge-fill" cx="50" cy="50" r="40" stroke-dasharray="${circumference}" stroke-dashoffset="${circumference}" data-target="${circumference - circumference*pct}"/><text class="gauge-value-text" x="50" y="46" text-anchor="middle" dominant-baseline="middle">${v}</text><text class="gauge-unit" x="50" y="62" text-anchor="middle">${u}</text></svg><div class="gauge-label">${lb}</div>`;
    });
    const gaugeObs = new IntersectionObserver((entries) => { entries.forEach(e => { if(e.isIntersecting) { e.target.querySelectorAll('.gauge-fill').forEach(f => setTimeout(() => f.style.strokeDashoffset = f.dataset.target, 300)); gaugeObs.unobserve(e.target); } }); }, { threshold: 0.3 });
    gaugeObs.observe(gaugesGrid);

    /* ═══ 8. GALLERY ═══ */
    const gImgs = [{ src:'assets/images/hero.png', caption:'Vista Exterior' },{ src:'assets/images/interior.png', caption:'Salón Principal' },{ src:'assets/images/master-suite.png', caption:'Suite Master' },{ src:'assets/images/sundeck.png', caption:'Sundeck & Jacuzzi' }];
    let fsIdx = 0; const fsG = document.getElementById('fsGallery'), fsImg = document.getElementById('fsImg'), fsCap = document.getElementById('fsCaption'), fsCnt = document.getElementById('fsCounter');
    function updateFS() { fsImg.src=gImgs[fsIdx].src; fsCap.textContent=gImgs[fsIdx].caption; fsCnt.textContent=`${fsIdx+1} / ${gImgs.length}`; }
    document.querySelectorAll('.gallery-thumb').forEach(t => t.addEventListener('click', ()=>{haptic(); fsIdx=parseInt(t.dataset.idx); updateFS(); fsG.classList.add('active'); document.body.style.overflow='hidden';}));
    document.getElementById('openGalleryBtn').addEventListener('click', ()=>{haptic(); fsIdx=0; updateFS(); fsG.classList.add('active'); document.body.style.overflow='hidden';});
    document.getElementById('fsClose').addEventListener('click', ()=>{haptic(); fsG.classList.remove('active'); document.body.style.overflow='';});
    document.getElementById('fsPrev').addEventListener('click', (e)=>{e.stopPropagation(); haptic(); fsIdx=(fsIdx-1+gImgs.length)%gImgs.length; updateFS();});
    document.getElementById('fsNext').addEventListener('click', (e)=>{e.stopPropagation(); haptic(); fsIdx=(fsIdx+1)%gImgs.length; updateFS();});

    /* ═══ 9. CALENDAR ═══ */
    const calC = document.getElementById('calendarsRow'), mos = ['Abril','Mayo','Junio'], mNums = [3,4,5], dN = ['Lu','Ma','Mi','Ju','Vi','Sá','Do'], bk = { 3:[5,6,7,12,13,14,20,21,22], 4:[1,2,3,8,9,15,16,25,26,27], 5:[6,7,10,11,18,19,20,28,29,30] };
    mos.forEach((n,i) => {
        const m=mNums[i], y=2026, fd=new Date(y,m,1).getDay(), dim=new Date(y,m+1,0).getDate(), off=(fd+6)%7;
        let h = `<div class="cal-month"><div class="cal-month-title">${n} 2026</div><div class="cal-grid">`; dN.forEach(d => h+=`<div class="cal-day-name">${d}</div>`); for(let j=0;j<off;j++) h+=`<div class="cal-day empty"></div>`; for(let d=1;d<=dim;d++) h+=`<div class="cal-day ${bk[m]&&bk[m].includes(d)?'booked':'available'}">${d}</div>`; h+='</div></div>'; calC.innerHTML += h;
    });

    /* ═══ 10. CALCULATOR ═══ */
    const bP = {'4h':55000,'8h':85000,'day':120000,'week':650000}; let selDur = '8h';
    const cDur = document.getElementById('calcDuration'), gR = document.getElementById('guestRange'), gC = document.getElementById('guestCount'), cP = document.getElementById('calcPrice'), cEx = document.getElementById('calcExtras');
    cDur.querySelectorAll('.calc-option').forEach(b => b.addEventListener('click', () => { haptic(); cDur.querySelectorAll('.calc-option').forEach(x=>x.classList.remove('active')); b.classList.add('active'); selDur=b.dataset.val; updPrice(); })); gR.addEventListener('input', () => { gC.textContent=gR.value; updPrice(); });
    cEx.querySelectorAll('.calc-extra').forEach(x => x.addEventListener('click', ()=>{haptic(); x.classList.toggle('active'); updPrice();}));
    function updPrice() {
        let t = bP[selDur]||85000; const g = parseInt(gR.value); if(g>8) t += (g-8)*5000; cEx.querySelectorAll('.calc-extra.active').forEach(x => t += parseInt(x.dataset.price)); cP.textContent = '$'+t.toLocaleString('es-MX')+' MXN';
    }
    document.getElementById('calcCta').addEventListener('click', () => { haptic(20); document.getElementById('contact').scrollIntoView({behavior:'smooth'}); });

    /* ═══ 11. FORM ═══ */
    document.getElementById('inquiryForm').addEventListener('submit', (e) => {
        e.preventDefault(); haptic(20);
        let msg = `🛥️ *Solicitud — Azure Horizon*\n\n*Nombre:* ${document.getElementById('firstName').value} ${document.getElementById('lastName').value}\n*Email:* ${document.getElementById('email').value}\n*Tel:* ${document.getElementById('phone').value}\n*Interés:* ${document.getElementById('interest').value}\n*Fechas:* ${document.getElementById('dates').value}\n*Mensaje:* ${document.getElementById('message').value}`;
        const btn = e.target.querySelector('.f-submit'); btn.textContent = 'Enviando...'; setTimeout(() => { window.open(`https://wa.me/529211234567?text=${encodeURIComponent(msg)}`,'_blank'); btn.textContent='✓ Enviado'; }, 600);
    });
    document.getElementById('pdfBtn').addEventListener('click', () => { haptic(); window.print(); });
});
