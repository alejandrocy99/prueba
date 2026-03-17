document.addEventListener('DOMContentLoaded', () => {
    const rat = document.getElementById('the-rat');
    const ctaBtn = document.getElementById('main-cta');
    const glitchText = document.querySelector('.glitch-text');
    const guardForm = document.getElementById('guard-form');
    const dummyEmail = document.getElementById('dummy-email');
    const dummySubmit = document.getElementById('dummy-submit');

    // --- CYBER AUDIO ENGINE ---
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;
    
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playCyberSound(type) {
        if (!audioCtx) return;
        
        // Ensure context is running before playing
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        const now = audioCtx.currentTime;
        
        if (type === 'hover') {
            // Subtle digital blip (Volume increased)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'click') {
            // Sharp tech confirm (Volume increased)
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'zap') {
            // Error / Angry buzz (Volume balanced to not be too loud)
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(50, now + 0.3);
            gainNode.gain.setValueAtTime(0.12, now);
            gainNode.gain.linearRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    }

    // Initialize audio on first user interaction (browser policy)
    document.body.addEventListener('mousedown', initAudio, { once: true });
    document.body.addEventListener('keydown', initAudio, { once: true });

    // Attach sounds to UI
    document.querySelectorAll('.nav-links a, .cta-btn, .dummy-input').forEach(el => {
        el.addEventListener('mouseenter', () => playCyberSound('hover'));
    });
    
    if (ctaBtn) ctaBtn.addEventListener('mousedown', () => playCyberSound('click'));

    // Generate Cyber Particles and Matrix Code
    setInterval(() => {
        if (!document.hidden && document.body.classList.contains('blackout') === false) {
            createParticle();
            if (Math.random() < 0.3) createMatrixCode();
        }
    }, 200);

    function createMatrixCode() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
        const char = chars[Math.floor(Math.random() * chars.length)];
        const p = document.createElement('div');
        p.className = 'matrix-char';
        p.innerText = char;
        p.style.left = Math.random() * window.innerWidth + 'px';
        p.style.top = '-20px';
        const duration = Math.random() * 3 + 2;
        p.style.animationDuration = duration + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), duration * 1000);
    }

    function createParticle() {
        const p = document.createElement('div');
        p.className = 'cyber-particle';
        const size = Math.random() * 3 + 1;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * window.innerWidth + 'px';
        p.style.top = window.innerHeight + 10 + 'px';
        p.style.boxShadow = `0 0 ${size * 2}px var(--accent-color)`;
        const duration = Math.random() * 5 + 5;
        p.style.animationDuration = duration + 's';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), duration * 1000);
    }

    const holePos = () => ({ x: window.innerWidth - 120, y: window.innerHeight - 30 });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isMouseDown = false;
    let ratX = 150;
    let ratY = 150;
    
    let velocityX = 0;
    let velocityY = 0;
    let rotation = 0;
    
    const maxSpeed = 7;
    const wanderSpeed = 2.5;
    const steerForce = 0.15;
    const padding = 60;
    
    let state = 'sniffing'; 
    let stateTimer = 0;
    let targetX = ratX;
    let targetY = ratY;
    let isBlackout = false;
    let inactivityTimeout = null;
    let activeBug = null;
    let isFalling = false;
    let lastScrollY = window.scrollY;
    
    // 10 minutes in milliseconds
    const INACTIVITY_LIMIT = 600000;

    let lastFootprintTime = 0;
    function spawnFootprint(x, y) {
        if (Date.now() - lastFootprintTime < 100) return;
        lastFootprintTime = Date.now();
        
        const fp = document.createElement('div');
        fp.className = 'neon-footprint';
        fp.style.left = x + 'px';
        fp.style.top = y + 'px';
        
        const offset = Math.random() > 0.5 ? 12 : -12;
        const rad = rotation * Math.PI / 180;
        fp.style.transform = `translate(${Math.cos(rad)*offset}px, ${Math.sin(rad)*offset}px)`;
        
        document.body.appendChild(fp);
        requestAnimationFrame(() => fp.classList.add('fade'));
        setTimeout(() => fp.remove(), 1000);
    }

    setInterval(() => {
        if (!activeBug && !isBlackout && Math.random() < 0.2) {
            spawnBug();
        }
    }, 8000);

    function spawnBug() {
        activeBug = document.createElement('div');
        activeBug.className = 'sys-bug';
        activeBug.style.left = (Math.random()*(window.innerWidth-100)+50) + 'px';
        activeBug.style.top = (Math.random()*(window.innerHeight-100)+50) + 'px';
        document.body.appendChild(activeBug);
        playCyberSound('zap');
    }

    if (dummySubmit) {
        dummySubmit.addEventListener('click', (e) => {
            e.preventDefault();
            playCyberSound('click');
            if (!dummyEmail.value) {
                dummyEmail.classList.add('error');
                playCyberSound('zap');
                const box = dummyEmail.getBoundingClientRect();
                targetX = box.left + box.width - 30;
                targetY = box.top + box.height / 2 + window.scrollY;
                state = 'guardian_angry';
                setTimeout(() => dummyEmail.classList.remove('error'), 800);
            } else {
                dummySubmit.innerText = "¡SISTEMA ACCEDIDO!";
                dummySubmit.style.background = "#00ff00";
                dummySubmit.style.color = "#000";
                dummySubmit.style.boxShadow = "0 0 20px #00ff00";
            }
        });
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        const speed = currentScroll - lastScrollY;
        
        if (speed > 25 && !isFalling && state !== 'hiding' && state !== 'peeking') {
            isFalling = true;
            state = 'falling';
            rat.classList.add('rat-falling');
            ratY += window.innerHeight * 0.8;
            if (ratY > document.body.scrollHeight - 60) ratY = document.body.scrollHeight - 60;
            rat.style.top = `${ratY}px`;
            
            setTimeout(() => {
                rat.classList.remove('rat-falling');
                isFalling = false;
                state = 'sniffing';
                stateTimer = 60;
            }, 400); 
        }
        lastScrollY = currentScroll;
    });

    function resetInactivity() {
        if (isBlackout) {
            isBlackout = false;
            document.body.classList.remove('blackout');
        }
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            if (window.scrollY < 100) {
                isBlackout = true;
                document.body.classList.add('blackout');
                if (state !== 'hiding' && state !== 'peeking') {
                    state = 'sniffing';
                    stateTimer = 50;
                }
            }
        }, INACTIVITY_LIMIT);
    }

    resetInactivity();

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY + window.scrollY;
        
        // Update ambient CSS light tracker
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        
        resetInactivity();
    });

    window.addEventListener('mousedown', () => {
        isMouseDown = true;
        document.body.classList.add('cheese-mode');
        resetInactivity();
    });

    window.addEventListener('mouseup', () => {
        isMouseDown = false;
        document.body.classList.remove('cheese-mode');
    });

    window.addEventListener('blur', () => {
        isMouseDown = false;
        document.body.classList.remove('cheese-mode');
    });

    rat.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isMouseDown = false;
        document.body.classList.remove('cheese-mode');
        document.body.classList.add('glitching-global');
        
        state = 'fleeing';
        stateTimer = 80;
        
        setTimeout(() => {
            document.body.classList.remove('glitching-global');
        }, 1200);
    });
    
    // Make the hole interactive
    const holeBg = document.getElementById('rat-hole-bg');
    if (holeBg) {
        holeBg.addEventListener('mouseenter', () => {
            if (state === 'hiding') {
                state = 'peeking';
                stateTimer = 150;
            }
        });
    }

    if(ctaBtn) {
        ctaBtn.addEventListener('click', (e) => {
            for(let i=0; i<15; i++) {
                spawnMicroRat(e.clientX, e.clientY + window.scrollY);
            }
        });
    }

    function spawnMicroRat(x, y) {
        const svg = `
            <svg viewBox="0 0 100 140" class="cyber-rat">
                <path class="rat-tail" d="M50,105 C50,150 90,140 90,110 C90,80 65,90 65,70" stroke="#000" stroke-width="6" fill="none" stroke-linecap="round"/>
                <path d="M35,50 C20,70 25,100 40,110 C50,115 50,115 60,110 C75,100 80,70 65,50 C55,30 45,30 35,50 Z" fill="#6A0DAD" stroke="#000" stroke-width="2.5"/>
                <path d="M40,40 C35,20 45,10 50,8 C55,10 65,20 60,40 Z" fill="#6A0DAD" stroke="#000" stroke-width="2"/>
                <path d="M36,32 C34,22 45,18 50,22 C55,18 66,22 64,32 C66,35 55,30 50,30 C45,30 34,35 36,32 Z" fill="#00FFFF" stroke="#000" stroke-width="1.5"/>
            </svg>
        `;
        const div = document.createElement('div');
        div.className = 'micro-rat-spawn moving';
        div.innerHTML = svg;
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        document.body.appendChild(div);

        let rx = x;
        let ry = y;
        let angle = Math.random() * Math.PI * 2;
        const speed = 4 + Math.random() * 4;

        let life = 100;

        const anim = setInterval(() => {
            rx += Math.cos(angle) * speed;
            ry += Math.sin(angle) * speed;
            angle += (Math.random() - 0.5) * 0.4;
            div.style.left = `${rx}px`;
            div.style.top = `${ry}px`;
            div.style.transform = `translate(-50%, -50%) rotate(${angle * 180/Math.PI + 90}deg)`;

            life--;
            if (life === 20) {
                div.style.opacity = '0';
            }

            if (life <= 0 || rx < -50 || rx > window.innerWidth + 50 || ry < -50 || ry > document.body.scrollHeight + 50) {
                clearInterval(anim);
                // Allow CSS transition to finish if it hasn't already (0.5s transition on class)
                setTimeout(() => div.remove(), 500);
            }
        }, 16);
    }

    function getDist(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    }

    function loop() {
        const hp = holePos();
        const distToMouse = getDist(ratX, ratY, mouseX, mouseY);
        
        if (state !== 'hiding' && state !== 'peeking') {
            if (isMouseDown && !isBlackout) {
                state = 'attracted';
            } else if (distToMouse < 180 && state !== 'fleeing' && !isMouseDown && state !== 'guardian_angry') {
                state = 'fleeing';
                targetX = hp.x;
                targetY = hp.y + window.scrollY;
            } else if (activeBug && state !== 'fleeing' && state !== 'guardian_angry' && state !== 'attracted') {
                state = 'hunting';
            }
        }

        let isMoving = false;

        if (state === 'fleeing') {
            isMoving = true;
            targetX = hp.x;
            targetY = hp.y + window.scrollY;
            
            if (getDist(ratX - window.scrollX, ratY - window.scrollY, hp.x, hp.y) < 40) {
                state = 'hiding';
                stateTimer = 150;
                rotation = 180;
            }
        } else if (state === 'hiding') {
            ratX += (hp.x - (ratX - window.scrollX)) * 0.2;
            ratY += ((hp.y + 70 + window.scrollY) - ratY) * 0.2; 
            if (stateTimer <= 0) {
                state = 'peeking';
                stateTimer = 100;
            }
        } else if (state === 'peeking') {
            ratX += (hp.x - (ratX - window.scrollX)) * 0.1;
            ratY += ((hp.y + 15 + window.scrollY) - ratY) * 0.1; 
            
            if (distToMouse < 300) {
                state = 'hiding';
                stateTimer = 120;
                rotation = 180;
            } else if (stateTimer <= 0) {
                state = 'sniffing';
                stateTimer = 40;
            }
            const dx = mouseX - ratX;
            const dy = mouseY - ratY;
            const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
            if(angle > 45 && angle < 180) rotation = 45;
            else if(angle < -45 || angle >= 180) rotation = -45;
            else rotation = angle;
            
        } else if (state === 'attracted') {
            isMoving = true;
            if (isMouseDown) {
                targetX = mouseX;
                targetY = mouseY;
            } else {
                state = 'sniffing';
                stateTimer = 30;
            }
        } else if (state === 'wandering') {
            isMoving = true;
            if (getDist(ratX, ratY, targetX, targetY) < 40) {
                state = 'sniffing';
                stateTimer = Math.random() * 100 + 40;
            } else if (Math.random() < 0.01) {
                state = 'sniffing';
                stateTimer = 30;
            }
        } else if (state === 'hunting') {
            isMoving = true;
            if (activeBug) {
                const bugRect = activeBug.getBoundingClientRect();
                targetX = bugRect.left + bugRect.width/2 + window.scrollX;
                targetY = bugRect.top + bugRect.height/2 + window.scrollY;
                
                if (getDist(ratX, ratY, targetX, targetY) < 35) {
                    activeBug.remove();
                    activeBug = null;
                    state = 'sniffing';
                    stateTimer = 60;
                }
            } else {
                state = 'wandering';
            }
        } else if (state === 'sniffing') {
            if (stateTimer <= 0) {
                state = 'wandering';
                targetX = Math.max(padding, Math.min(window.innerWidth - padding, ratX + (Math.random()-0.5)*400));
                targetY = Math.max(padding + window.scrollY, Math.min(document.body.scrollHeight - padding, ratY + (Math.random()-0.5)*400));
            }
        }

        if (stateTimer > 0) stateTimer--;

        if (isMoving && !isFalling) {
            rat.classList.add('moving');
            const angle = Math.atan2(targetY - ratY, targetX - ratX);
            let currentSpeed = wanderSpeed;
            if (state === 'fleeing' || state === 'attracted' || state === 'hunting') currentSpeed = maxSpeed;
            if (state === 'guardian_angry') currentSpeed = 16;
            
            let desiredVx = Math.cos(angle) * currentSpeed;
            let desiredVy = Math.sin(angle) * currentSpeed;

            velocityX += (desiredVx - velocityX) * steerForce;
            velocityY += (desiredVy - velocityY) * steerForce;
        } else {
            rat.classList.remove('moving');
            velocityX *= 0.85; 
            velocityY *= 0.85;
        }

        if (state !== 'hiding' && state !== 'peeking' && !isFalling) {
            ratX += velocityX;
            ratY += velocityY;
            
            const pad = -60; 
            if (ratX < pad) ratX = window.innerWidth + 50;
            if (ratX > window.innerWidth + 50) ratX = pad;
            if (ratY < pad) ratY = document.body.scrollHeight + 50;
            if (ratY > document.body.scrollHeight + 50) ratY = pad;

            const speedMag = Math.hypot(velocityX, velocityY);
            if (speedMag > 3) spawnFootprint(ratX, ratY); 
            
            if (Math.abs(velocityX) > 0.5 || Math.abs(velocityY) > 0.5) {
                let angleRad = Math.atan2(velocityY, velocityX);
                let targetRot = angleRad * 180 / Math.PI + 90;
                let diff = targetRot - rotation;
                while (diff < -180) diff += 360;
                while (diff > 180) diff -= 360;
                rotation += diff * 0.25; 
            } else if (state === 'sniffing') {
                if (stateTimer % 30 > 25) {
                    rotation += (Math.random() - 0.5) * 20;
                }
            } else if (state === 'attracted' && !isMoving) {
               let angleRad = Math.atan2(mouseY - ratY, mouseX - ratX);
               let targetRot = angleRad * 180 / Math.PI + 90;
               let diff = targetRot - rotation;
               while (diff < -180) diff += 360;
               while (diff > 180) diff -= 360;
               rotation += diff * 0.15;
            }
        }

        rat.style.left = `${ratX}px`;
        rat.style.top = `${ratY}px`;
        
        document.documentElement.style.setProperty('--rat-x', (ratX - window.scrollX) + 'px');
        document.documentElement.style.setProperty('--rat-y', (ratY - window.scrollY) + 'px');

        if (state !== 'hiding') {
            rat.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
        }

        requestAnimationFrame(loop);
    }
    
    loop();
});
