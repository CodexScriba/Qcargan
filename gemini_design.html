<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tesla Model S Plaid | Configure</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Three.js (for background effect) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        tesla: {
                            red: '#e82127',
                            dark: '#0a0a0a',
                            gray: '#171a20',
                            light: '#f4f4f4'
                        }
                    },
                    animation: {
                        'fade-in': 'fadeIn 0.8s ease-out forwards',
                        'slide-up': 'slideUp 0.8s ease-out forwards',
                        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    },
                    keyframes: {
                        fadeIn: {
                            '0%': { opacity: '0' },
                            '100%': { opacity: '1' },
                        },
                        slideUp: {
                            '0%': { opacity: '0', transform: 'translateY(20px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        }
                    }
                }
            }
        }
    </script>

    <style>
        body {
            background-color: #050505;
            color: white;
            overflow-x: hidden;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }

        /* Glassmorphism Utilities */
        .glass-panel {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        
        .glass-panel:hover {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .text-glow {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }

        /* Custom Radio Button Styling */
        .custom-radio:checked + div {
            border-color: #e82127;
            background-color: rgba(232, 33, 39, 0.1);
        }

        .custom-radio:checked + div .radio-circle {
            background-color: #e82127;
            border-color: #e82127;
        }

        /* Canvas for ThreeJS */
        #bg-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.6;
        }

        /* Car Image Floating Animation */
        .float-car {
            animation: carFloat 6s ease-in-out infinite;
        }

        @keyframes carFloat {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
        }

        /* Range Badge Gradient */
        .range-badge {
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.01) 100%);
        }
    </style>
</head>
<body class="selection:bg-tesla-red selection:text-white">

    <!-- ThreeJS Background -->
    <canvas id="bg-canvas"></canvas>

    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center glass-panel border-b-0">
        <div class="flex items-center gap-2 cursor-pointer">
            <svg class="w-24 text-white fill-current" viewBox="0 0 342 35" xmlns="http://www.w3.org/2000/svg"><path d="M0 .1a9.7 9.7 0 0 0 7 7h11l.5.1v27.6h6.8V7.3L26 7h11a9.8 9.8 0 0 0 7-7H0zm238.6 0h-6.8v34.8H263a9.7 9.7 0 0 0 6-6.8h-30.3V0zm-52.3 6.8c3.6-1 6.6-3.8 7.4-6.9l-38.1.1v20.6h31.1v7.2h-24.4a13.6 13.6 0 0 0-8.7 7h39.9v-21h-31.2v-7h24zm116.2 28h6.7v-14h24.6v14h6.7v-21h-38zM85.3 7h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 13.8h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zm0 14.1h26a9.6 9.6 0 0 0 7.1-7H78.3a9.6 9.6 0 0 0 7 7zM308.5 7h26a9.6 9.6 0 0 0 7-7h-40a9.6 9.6 0 0 0 7 7z"/></svg>
        </div>
        <div class="hidden md:flex gap-8 text-sm font-medium tracking-wide text-gray-300">
            <a href="#" class="hover:text-white transition-colors">Model S</a>
            <a href="#" class="hover:text-white transition-colors">Model 3</a>
            <a href="#" class="hover:text-white transition-colors">Model X</a>
            <a href="#" class="hover:text-white transition-colors">Model Y</a>
            <a href="#" class="hover:text-white transition-colors">Cybertruck</a>
        </div>
        <div class="flex items-center gap-6">
            <button class="text-sm font-medium hover:text-white text-gray-300 hidden sm:block">Shop</button>
            <button class="text-sm font-medium hover:text-white text-gray-300 hidden sm:block">Account</button>
            <button class="glass-panel px-4 py-2 rounded-full text-xs font-semibold hover:bg-white/10 transition-all">Menu</button>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-24 pb-12 px-4 md:px-8 lg:px-12 max-w-[1600px] mx-auto min-h-screen flex items-center">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            
            <!-- LEFT COLUMN: Primary Visual -->
            <div class="col-span-1 lg:col-span-7 relative flex flex-col justify-center min-h-[50vh] lg:min-h-[80vh]">
                
                <!-- Headers -->
                <div class="mb-4 animate-fade-in z-10">
                    <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-2 text-glow">Model S</h1>
                    <div class="flex items-center gap-3">
                        <span class="text-tesla-red text-xl md:text-2xl font-semibold tracking-widest uppercase border border-tesla-red/30 px-3 py-1 rounded bg-tesla-red/10 backdrop-blur-sm">Plaid</span>
                        <span class="text-gray-400 text-sm md:text-base tracking-wide">Tri-Motor All-Wheel Drive</span>
                    </div>
                </div>

                <!-- Product Image Container -->
                <div class="relative w-full aspect-[16/9] flex items-center justify-center perspective-1000 my-4" id="car-container">
                    <!-- Dynamic Glow Behind Car -->
                    <div class="absolute w-[80%] h-[60%] bg-tesla-red opacity-20 blur-[100px] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0"></div>
                    
                    <!-- Car Image -->
                    <img src="https://pngimg.com/d/tesla_car_PNG46.png" 
                         alt="Tesla Model S Plaid" 
                         class="relative z-10 w-full object-contain float-car drop-shadow-2xl transition-all duration-700 ease-out transform scale-100 hover:scale-105"
                         id="main-car-img">
                </div>

                <!-- Stats Overlay -->
                <div class="grid grid-cols-3 gap-4 mt-8 glass-panel rounded-2xl p-6 max-w-2xl animate-slide-up" style="animation-delay: 0.2s;">
                    <div class="text-center border-r border-white/10">
                        <div class="text-2xl md:text-3xl font-bold">396<span class="text-sm font-normal text-gray-400">mi</span></div>
                        <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Range (EPA)</div>
                    </div>
                    <div class="text-center border-r border-white/10">
                        <div class="text-2xl md:text-3xl font-bold">1.99<span class="text-sm font-normal text-gray-400">s</span></div>
                        <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">0-60 mph</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl md:text-3xl font-bold">200<span class="text-sm font-normal text-gray-400">mph</span></div>
                        <div class="text-xs text-gray-400 uppercase tracking-wider mt-1">Top Speed</div>
                    </div>
                </div>

                <!-- Interactive Color Picker (Just for Visual Flair) -->
                <div class="absolute bottom-0 right-0 lg:bottom-12 lg:right-12 flex gap-3 z-20 animate-slide-up" style="animation-delay: 0.4s;">
                    <button class="w-8 h-8 rounded-full bg-gray-900 border-2 border-white ring-2 ring-transparent transition-all hover:scale-110" aria-label="Black Paint"></button>
                    <button class="w-8 h-8 rounded-full bg-white border-2 border-gray-400 ring-2 ring-transparent transition-all hover:scale-110" aria-label="White Paint"></button>
                    <button class="w-8 h-8 rounded-full bg-tesla-red border-2 border-gray-400 ring-2 ring-transparent transition-all hover:scale-110" aria-label="Red Paint"></button>
                    <button class="w-8 h-8 rounded-full bg-blue-600 border-2 border-gray-400 ring-2 ring-transparent transition-all hover:scale-110" aria-label="Blue Paint"></button>
                </div>
            </div>

            <!-- RIGHT COLUMN: Commerce & Sellers -->
            <div class="col-span-1 lg:col-span-5 flex flex-col gap-6 pt-0 lg:pt-12 animate-slide-up" style="animation-delay: 0.3s;">
                
                <!-- Pricing Toggle -->
                <div class="flex bg-white/5 rounded-full p-1 self-start glass-panel mb-2">
                    <button class="px-6 py-2 rounded-full text-sm font-medium bg-white text-black shadow-sm transition-all" onclick="togglePricing(this)">Purchase</button>
                    <button class="px-6 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-all" onclick="togglePricing(this)">Lease</button>
                </div>

                <!-- Seller Card 1: Official Tesla -->
                <div class="glass-panel rounded-3xl p-6 relative overflow-hidden group border border-white/10 transition-all duration-300 hover:border-tesla-red/50">
                    <!-- Glow effect on hover -->
                    <div class="absolute -top-20 -right-20 w-40 h-40 bg-tesla-red/20 blur-[50px] transition-all duration-500 group-hover:bg-tesla-red/30"></div>

                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div class="flex items-center gap-2">
                            <i class="fa-brands fa-tesla text-lg"></i>
                            <span class="font-semibold text-sm tracking-wide">Tesla, Inc.</span>
                            <i class="fa-solid fa-circle-check text-blue-400 text-xs"></i>
                        </div>
                        <span class="bg-white/10 text-[10px] font-bold px-2 py-1 rounded text-white uppercase tracking-wider">New Inventory</span>
                    </div>

                    <div class="mb-6 relative z-10">
                        <h3 class="text-3xl font-bold mb-1">$89,990</h3>
                        <p class="text-gray-400 text-sm">Est. Lease: $1,149 /mo</p>
                    </div>

                    <ul class="space-y-3 mb-8 text-sm text-gray-300 relative z-10">
                        <li class="flex items-center gap-3">
                            <i class="fa-solid fa-check text-green-400 text-xs"></i>
                            <span>Autopilot Included</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <i class="fa-solid fa-check text-green-400 text-xs"></i>
                            <span>1-Year Premium Connectivity</span>
                        </li>
                        <li class="flex items-center gap-3">
                            <i class="fa-solid fa-calendar text-gray-400 text-xs"></i>
                            <span>Est. Delivery: Oct – Nov 2023</span>
                        </li>
                    </ul>

                    <div class="flex flex-col gap-3 relative z-10">
                        <button class="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Order Now
                            <i class="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                        </button>
                    </div>
                </div>

                <!-- Seller Card 2: Certified Pre-Owned -->
                <div class="glass-panel rounded-3xl p-6 relative overflow-hidden group border border-white/5 bg-black/40 hover:bg-black/60 transition-all duration-300">
                    
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-certificate text-yellow-500"></i>
                            <span class="font-semibold text-sm tracking-wide text-gray-200">Tesla Certified</span>
                        </div>
                        <span class="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Used</span>
                    </div>

                    <div class="flex justify-between items-end mb-4">
                        <div>
                            <div class="text-xs text-gray-500 mb-1">2021 Model S Plaid</div>
                            <h3 class="text-2xl font-bold text-gray-100">$72,500</h3>
                        </div>
                        <div class="text-right">
                            <div class="text-xs text-gray-500">Odometer</div>
                            <div class="text-sm font-medium text-gray-300">12,402 mi</div>
                        </div>
                    </div>

                    <div class="border-t border-white/10 pt-4 mb-6">
                        <div class="flex items-center justify-between text-xs text-gray-400 mb-2">
                            <span>Condition</span>
                            <span class="text-white">Excellent</span>
                        </div>
                        <div class="w-full bg-gray-800 rounded-full h-1.5">
                            <div class="bg-green-500 h-1.5 rounded-full w-[95%]"></div>
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <button class="flex-1 border border-white/20 text-white font-medium py-3 rounded-xl hover:bg-white/5 transition-colors">
                            View Details
                        </button>
                        <button class="px-4 border border-white/20 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>
                </div>

                <!-- Trust Badges -->
                <div class="flex justify-center gap-6 text-gray-500 text-xs mt-2">
                    <span class="flex items-center gap-1"><i class="fa-solid fa-shield-halved"></i> Secure Checkout</span>
                    <span class="flex items-center gap-1"><i class="fa-solid fa-bolt"></i> Instant Reservation</span>
                </div>

            </div>
        </div>
    </main>

    <!-- Footer Simple -->
    <footer class="fixed bottom-4 left-6 text-[10px] text-gray-600 hidden md:block z-40">
        <p>Specs displayed are values for Model S Plaid. <br>Prices subject to change.</p>
    </footer>

    <!-- ThreeJS & Interaction Scripts -->
    <script>
        // --- ThreeJS Background Effect (Subtle Starfield/Flow) ---
        const initThreeJS = () => {
            const canvas = document.getElementById('bg-canvas');
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            // Create particles
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 700;
            
            const posArray = new Float32Array(particlesCount * 3);
            
            for(let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 25; // Spread
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            // Material
            const material = new THREE.PointsMaterial({
                size: 0.02,
                color: 0xffffff,
                transparent: true,
                opacity: 0.4,
            });
            
            // Mesh
            const particlesMesh = new THREE.Points(particlesGeometry, material);
            scene.add(particlesMesh);
            
            // Lights
            const pointLight = new THREE.PointLight(0xe82127, 2);
            pointLight.position.set(2, 3, 4);
            scene.add(pointLight);

            camera.position.z = 3;

            // Mouse interaction
            let mouseX = 0;
            let mouseY = 0;
            let targetX = 0;
            let targetY = 0;

            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;

            document.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX - windowHalfX);
                mouseY = (event.clientY - windowHalfY);
            });

            // Animate
            const clock = new THREE.Clock();

            const animate = () => {
                targetX = mouseX * 0.001;
                targetY = mouseY * 0.001;

                const elapsedTime = clock.getElapsedTime();

                // Gentle rotation
                particlesMesh.rotation.y = .1 * elapsedTime;
                particlesMesh.rotation.x += .05 * (targetY - particlesMesh.rotation.x);
                particlesMesh.rotation.y += .05 * (targetX - particlesMesh.rotation.y);

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            };

            animate();

            // Resize handler
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        };

        // --- Pricing Toggle Logic ---
        window.togglePricing = (btn) => {
            const parent = btn.parentElement;
            const buttons = parent.querySelectorAll('button');
            buttons.forEach(b => {
                b.classList.remove('bg-white', 'text-black', 'shadow-sm');
                b.classList.add('text-gray-400', 'hover:text-white');
            });
            btn.classList.remove('text-gray-400', 'hover:text-white');
            btn.classList.add('bg-white', 'text-black', 'shadow-sm');
        };

        // --- 3D Tilt Effect for Cards ---
        const initTiltEffect = () => {
            const cards = document.querySelectorAll('.glass-panel');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
                    const rotateY = ((x - centerX) / centerX) * 5;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });

                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                });
            });
        };

        // --- Parallax for Car Image ---
        const initCarParallax = () => {
            const container = document.getElementById('car-container');
            const car = document.getElementById('main-car-img');
            
            if(container && car) {
                container.addEventListener('mousemove', (e) => {
                    const { left, top, width, height } = container.getBoundingClientRect();
                    const x = (e.clientX - left) / width;
                    const y = (e.clientY - top) / height;
                    
                    const moveX = (x - 0.5) * 30; // 30px movement
                    const moveY = (y - 0.5) * 30;

                    car.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
                });
                
                container.addEventListener('mouseleave', () => {
                    car.style.transform = `translate(0px, 0px) scale(1)`;
                });
            }
        };

        // Initialize all
        document.addEventListener('DOMContentLoaded', () => {
            initThreeJS();
            // Only apply tilt on desktop to save battery/performance on mobile
            if (window.innerWidth > 768) {
                initTiltEffect();
                initCarParallax();
            }
        });

    </script>
</body>
</html>