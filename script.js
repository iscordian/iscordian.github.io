document.addEventListener("DOMContentLoaded", () => {
    initCanvasBackground();
    loadPortfolioData();
});

// ==========================================
// 1. ANIME CHERRY BLOSSOM CANVAS ANIMATION
// ==========================================
function initCanvasBackground() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const petals = [];
    const maxPetals = 60; // Adjust for density

    // Handle Resize
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Petal {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height - height;
            this.size = Math.random() * 4 + 2;
            this.speedX = Math.random() * 1.5 - 0.5;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.rotation += this.rotationSpeed;

            // Reset when it falls off screen
            if (this.y > height || this.x > width || this.x < -10) {
                this.x = Math.random() * width;
                this.y = -10;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = "#fbcfe8"; // Tailwind pink-200
            
            // Draw a simple petal shape
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size * 1.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize petals
    for (let i = 0; i < maxPetals; i++) {
        petals.push(new Petal());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ==========================================
// 2. DATA FETCHING & DYNAMIC DOM GENERATION
// ==========================================
async function loadPortfolioData() {
    const appContainer = document.getElementById('app');
    
    try {
        const response = await fetch('info.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        
        // Remove loading spinner and inject layout
        appContainer.innerHTML = generateLayout(data);
        
        // Initialize scroll animations
        initScrollAnimations();

    } catch (error) {
        console.error("Error loading info.json:", error);
        appContainer.innerHTML = `
            <div class="glass-panel p-8 rounded-2xl text-center fade-up max-w-lg mx-auto mt-20">
                <svg class="w-16 h-16 text-rose-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h2 class="text-2xl font-bold text-white mb-2">Failed to load content</h2>
                <p class="text-white/70">Make sure you are running a local web server (e.g. VS Code Live Server) to prevent CORS issues.</p>
            </div>
        `;
        // Trigger fade up for error message
        setTimeout(() => { document.querySelector('.fade-up').classList.add('visible'); }, 50);
    }
}

function generateLayout(data) {
    return `
        <!-- HEADER / HERO -->
        <header class="mb-24 mt-16 text-center md:text-left fade-up">
            <h1 class="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400">
                ${data.name}
            </h1>
            <h2 class="text-xl md:text-2xl text-white/80 font-light mb-6 uppercase tracking-widest">
                ${data.title}
            </h2>
            <div class="h-1 w-24 bg-pink-500 rounded-full mx-auto md:mx-0 opacity-80"></div>
        </header>

        <!-- ABOUT SECTION -->
        <section class="mb-24 fade-up">
            <h3 class="text-3xl font-bold mb-6 flex items-center gap-3">
                <span class="text-pink-400">01.</span> About Me
            </h3>
            <div class="glass-panel p-8 rounded-2xl transition-all duration-300 hover:bg-white/5">
                <p class="text-lg text-white/80 leading-relaxed font-light">
                    ${data.about}
                </p>
            </div>
        </section>

        <!-- PROJECTS SECTION -->
        <section class="mb-24">
            <h3 class="text-3xl font-bold mb-8 flex items-center gap-3 fade-up">
                <span class="text-pink-400">02.</span> Projects & Logs
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                ${generateProjectsHTML(data.projects)}
            </div>
        </section>

        <!-- CONTACT SECTION -->
        <section class="mb-12 fade-up text-center">
            <h3 class="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
                <span class="text-pink-400">03.</span> Connect
            </h3>
            <div class="glass-panel p-10 rounded-3xl inline-block w-full max-w-2xl mx-auto shadow-2xl">
                <p class="text-white/70 mb-8 font-light">Interested in collaborating on hardware mods, science experiments, or software logic? Let's get in touch.</p>
                <div class="flex justify-center gap-6 flex-wrap">
                    <a href="mailto:${data.contact.email}" class="px-8 py-3 rounded-full bg-pink-500/10 border border-pink-500/50 text-pink-300 hover:bg-pink-500 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]">
                        Email Me
                    </a>
                    <a href="${data.contact.github}" target="_blank" class="px-8 py-3 rounded-full bg-white/5 border border-white/20 text-white/90 hover:bg-white hover:text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                        GitHub Profile
                    </a>
                </div>
            </div>
        </section>
        
        <!-- FOOTER -->
        <footer class="text-center text-white/40 text-sm pb-8 fade-up">
            <p>Designed and built dynamically. &copy; ${new Date().getFullYear()} ${data.name}.</p>
        </footer>
    `;
}

function generateProjectsHTML(projects) {
    if (!projects || projects.length === 0) {
        return `
            <div class="col-span-1 md:col-span-2 glass-panel p-12 rounded-2xl text-center fade-up">
                <div class="text-4xl mb-4">🚀</div>
                <h4 class="text-2xl font-bold text-white/90 mb-2">Projects Coming Soon</h4>
                <p class="text-white/60">I'm currently working on exciting hardware modifications and software builds. Check back later!</p>
            </div>
        `;
    }

    return projects.map((project, index) => {
        const delay = index * 100; // Stagger effect
        const tags = project.tech_stack.map(tech => 
            `<span class="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${tech}</span>`
        ).join('');
        
        // Dynamically create a link button if the project has a URL
        const linkButton = project.link ? 
            `<a href="${project.link}" target="_blank" class="inline-flex items-center gap-2 mt-4 text-pink-400 hover:text-pink-300 font-semibold text-sm transition-colors group">
                View Project 
                <span class="transition-transform group-hover:translate-x-1">→</span>
            </a>` : '';

        return `
            <div class="glass-panel p-8 rounded-2xl fade-up transition-all duration-300 hover:-translate-y-2 hover:border-pink-400/50 hover:shadow-[0_10px_30px_rgba(244,114,182,0.1)] flex flex-col h-full" style="transition-delay: ${delay}ms;">
                <h4 class="text-2xl font-bold mb-3 text-white">${project.name}</h4>
                <p class="text-white/70 font-light mb-2 flex-grow leading-relaxed">
                    ${project.description}
                </p>
                ${linkButton}
                <div class="flex flex-wrap gap-2 mt-6 pt-4 border-t border-white/10">
                    ${tags}
                </div>
            </div>
        `;
    }).join('');
}

// ==========================================
// 3. INTERSECTION OBSERVER (SCROLL ANIMATIONS)
// ==========================================
function initScrollAnimations() {
    const elements = document.querySelectorAll('.fade-up');
    
    // Reset inline transition delays applied dynamically so they don't break scroll behavior later
    setTimeout(() => {
        elements.forEach(el => el.style.transitionDelay = '0ms');
    }, 1000);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after fading in if you only want it to happen once
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slightly offset the trigger point
    });

    elements.forEach(el => observer.observe(el));
}
