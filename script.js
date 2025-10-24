const canvas = document.getElementById('particleCanvas');
        const ctx = canvas.getContext('2d');
        
        const settingsPanel = document.getElementById('settings-panel');
        const particleSlider = document.getElementById('particle-slider');
        const particleValue = document.getElementById('particle-value');
        const distanceSlider = document.getElementById('distance-slider');
        const distanceValue = document.getElementById('distance-value');

        let particlesArray;

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                if (this.x > canvas.width || this.x < 0 || this.y > canvas.height || this.y < 0) {
                    this.reset();
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
            
            reset() {
                const edge = Math.floor(Math.random() * 4);
                switch(edge) {
                    case 0: // Top
                        this.x = Math.random() * canvas.width;
                        this.y = 0;
                        break;
                    case 1: // Right
                        this.x = canvas.width;
                        this.y = Math.random() * canvas.height;
                        break;
                    case 2: // Bottom
                        this.x = Math.random() * canvas.width;
                        this.y = canvas.height;
                        break;
                    case 3: // Left
                        this.x = 0;
                        this.y = Math.random() * canvas.height;
                        break;
                }
                this.directionX = (Math.random() * 1) - 0.5;
                this.directionY = (Math.random() * 1) - 0.5;
            }
        }

        function init() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particlesArray = [];
            let numberOfParticles = parseInt(particleSlider.value);
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let directionX = (Math.random() * 1) - 0.5;
                let directionY = (Math.random() * 1) - 0.5;
                let color = '#0f0';

                let p = new Particle(x, y, directionX, directionY, size, color);
                p.reset();
                particlesArray.push(p);
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        function connect() {
            let connectDistance = parseInt(distanceSlider.value);
            let connectDistanceSquared = connectDistance * connectDistance;
            
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a + 1; b < particlesArray.length; b++) { 
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distanceSquared = dx * dx + dy * dy;

                    if (distanceSquared < connectDistanceSquared) {
                        let opacityValue = 1 - (distanceSquared / connectDistanceSquared);
                        ctx.strokeStyle = `rgba(0, 255, 0, ${opacityValue})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Event Listeners
        particleSlider.addEventListener('input', (e) => {
            particleValue.textContent = e.target.value;
        });
        particleSlider.addEventListener('change', () => {
            init(); // Re-initialize with new particle count
        });

        distanceSlider.addEventListener('input', (e) => {
            distanceValue.textContent = e.target.value;
        });

        // Function to add mouse wheel and keyboard controls to sliders
        function addFineControls(slider) {
            slider.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY < 0) {
                    slider.stepUp();
                } else {
                    slider.stepDown();
                }
                slider.dispatchEvent(new Event('input'));
                slider.dispatchEvent(new Event('change'));
            });

            slider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (e.key === 'ArrowUp') {
                        slider.stepUp();
                    } else {
                        slider.stepDown();
                    }
                    slider.dispatchEvent(new Event('input'));
                    slider.dispatchEvent(new Event('change'));
                }
            });
        }

        addFineControls(particleSlider);
        addFineControls(distanceSlider);

        window.addEventListener('resize', init);

        // Toggle settings panel with spacebar
        window.addEventListener('keydown', (event) => {
            // Check if the event target is not a slider to avoid conflict
            if (document.activeElement.type !== 'range' && event.code === 'Space') {
                event.preventDefault(); // Prevent page scrolling
                if (settingsPanel.style.display === 'none') {
                    settingsPanel.style.display = 'block';
                } else {
                    settingsPanel.style.display = 'none';
                }
            }
        });

        init();
        animate();