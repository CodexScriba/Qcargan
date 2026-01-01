<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tesla Model 3 – Pure Electric Performance</title>
  <meta name="description" content="High-end, dark-mode product page for Tesla EV. Premium, futuristic, minimal, and performance-driven." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --bg: #0b0f14;
      --card: #101622;
      --muted: #9aa4b2;
      --text: #e6edf3;
      --accent: #41c1ff;
      --accent-2: #a88bff;
      --ring: rgba(65,193,255,0.35);
      --gradient: radial-gradient(1200px 600px at 70% -10%, rgba(65,193,255,0.25), transparent 60%), radial-gradient(900px 500px at 10% 10%, rgba(168,139,255,0.2), transparent 60%), linear-gradient(180deg, #0b0f14, #0b0f14);
    }
    html, body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      scroll-behavior: smooth;
    }
    .glass {
      background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
      border: 1px solid rgba(255,255,255,0.08);
      backdrop-filter: blur(8px);
    }
    .card {
      background: var(--card);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px 18px;
      border-radius: 12px;
      font-weight: 600;
      transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
      background: linear-gradient(180deg, #1f2937, #111827);
      border: 1px solid rgba(255,255,255,0.08);
    }
    .btn:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(0,0,0,0.35); }
    .btn-primary {
      background: linear-gradient(180deg, #1fa2ff, #0077ff);
      border: 1px solid rgba(0,119,255,0.5);
      box-shadow: 0 10px 24px rgba(0,119,255,0.35);
    }
    .btn-primary:hover { filter: brightness(1.05); transform: translateY(-1px); }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(65,193,255,0.15), rgba(65,193,255,0.05));
      border: 1px solid rgba(65,193,255,0.35);
      color: #cfefff;
      font-weight: 600;
      letter-spacing: 0.2px;
    }
    .hero-gradient {
      background: var(--gradient);
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
    }
    .text-muted { color: var(--muted); }
    .ring-focus { outline: none; box-shadow: 0 0 0 3px var(--ring); }
    .shadow-soft { box-shadow: 0 12px 40px rgba(0,0,0,0.35); }
    .glow {
      box-shadow: 0 0 0 0 rgba(65,193,255,0.6);
      animation: pulseGlow 2.5s ease-in-out infinite;
    }
    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(65,193,255,0.45); }
      50% { box-shadow: 0 0 0 12px rgba(65,193,255,0); }
    }
    .model-3 { background: linear-gradient(180deg, #0f1624, #0b111b); }
    .model-3::after {
      content: "";
      position: absolute; inset: 0;
      background: radial-gradient(200px 200px at 70% 30%, rgba(255,255,255,0.08), transparent 60%);
      pointer-events: none;
    }
    .model-s { background: linear-gradient(180deg, #0b1019, #090f18); }
    .model-s::after {
      content: "";
      position: absolute; inset: 0;
      background: radial-gradient(160px 160px at 60% 40%, rgba(255,255,255,0.06), transparent 60%);
      pointer-events: none;
    }
    .model-x { background: linear-gradient(180deg, #0d1320, #0a0f18); }
    .model-x::after {
      content: "";
      position: absolute; inset: 0;
      background: radial-gradient(220px 220px at 50% 30%, rgba(255,255,255,0.07), transparent 60%);
      pointer-events: none;
    }
    .range-badge {
      background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 10px 12px;
      font-weight: 700;
      color: #d9e6ff;
    }
    .chip {
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      font-size: 12px;
      color: #cfe3ff;
    }
    .seller-card:hover { transform: translateY(-2px); }
    .scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
    .scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 8px; }
    .link {
      color: #9bd0ff;
      text-decoration: none;
    }
    .link:hover { text-decoration: underline; }
    .focus-visible:focus-visible { box-shadow: 0 0 0 3px var(--ring); outline: none; border-radius: 12px; }
  </style>
</head>
<body>
  <header class="hero-gradient relative">
    <nav class="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M12 3v18" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <span class="text-lg font-extrabold tracking-tight">Tesla</span>
      </div>
      <div class="hidden md:flex items-center gap-8 text-sm text-gray-300">
        <a href="#" class="hover:text-white">Models</a>
        <a href="#" class="hover:text-white">Charging</a>
        <a href="#" class="hover:text-white">Roadside</a>
        <a href="#" class="hover:text-white">Support</a>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn" aria-label="Account">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM20 22a8 8 0 10-16 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Account
        </button>
        <button class="btn btn-primary" aria-label="Sign in">
          Sign in
        </button>
      </div>
    </nav>

    <section class="max-w-7xl mx-auto px-6 pb-16 pt-6 md:pt-10">
      <div class="grid md:grid-cols-2 gap-10 items-center">
        <div class="space-y-6">
          <div class="inline-flex items-center gap-2 badge">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Plaid & Tesla North America
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold leading-tight">
            Model 3
            <span class="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Performance</span>
          </h1>
          <p class="text-muted max-w-xl">
            A premium electric sports sedan with effortless acceleration, cutting-edge Autopilot, and a range that redefines what’s possible on the road.
          </p>
          <div class="flex flex-wrap items-center gap-3">
            <button class="btn btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 12h12M12 6l6 6-6 6" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
              Buy Now
            </button>
            <button class="btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              See More
            </button>
            <div class="chip">4680 Battery</div>
            <div class="chip">FSD Beta</div>
            <div class="chip">Dayna Design</div>
          </div>
          <div class="flex items-center gap-6 pt-2">
            <div>
              <div class="text-2xl font-bold">768 miles</div>
              <div class="text-muted text-sm">Est. range</div>
            </div>
            <div>
              <div class="text-2xl font-bold">0–60 mph</div>
              <div class="text-muted text-sm">2.6 sec</div>
            </div>
            <div>
              <div class="text-2xl font-bold">1,000+</div>
              <div class="text-muted text-sm">Volts peak</div>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-indigo-500/10 blur-2xl"></div>
          <div class="relative card overflow-hidden">
            <div class="model-3 h-80 md:h-[420px] relative">
              <img src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1600&auto=format&fit=crop" alt="Tesla Model 3" class="absolute inset-0 w-full h-full object-cover opacity-80">
              <div class="absolute inset-0 bg-gradient-to-t from-[#0b0f14] via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div class="range-badge flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  768 miles
                </div>
                <div class="badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l2.09 6.26H21l-5.17 3.76L17.91 21 12 16.77 6.09 21l2.08-7.98L3 9.26h6.91L12 3z" stroke="currentColor" stroke-width="1.5"/></svg>
                  AutoPilot
                </div>
              </div>
              <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div class="text-sm text-gray-200">
                  <div class="font-semibold">Model 3</div>
                  <div class="text-muted">Long Range</div>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </header>

  <main class="max-w-7xl mx-auto px-6 py-12 md:py-16">
    <div class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-8">
        <section class="card p-6 md:p-8">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 class="text-2xl md:text-3xl font-bold">Specification</h2>
              <p class="text-muted">Detailed performance and features for Model 3 Long Range</p>
            </div>
            <div class="flex items-center gap-2">
              <button class="btn">Specs</button>
              <button class="btn">Compare</button>
            </div>
          </div>
          <div class="divider my-6"></div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <div class="text-sm text-muted">Battery</div>
              <div class="font-semibold">100 kWh</div>
            </div>
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <div class="text-sm text-muted">Electric Range</div>
              <div class="font-semibold">768 mi EPA</div>
            </div>
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <div class="text-sm text-muted">0–60 mph</div>
              <div class="font-semibold">2.6 sec</div>
            </div>
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <div class="text-sm text-muted">Top Speed</div>
              <div class="font-semibold">130 mph</div>
            </div>
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <div class="text-sm text-muted">Charging</div>
              <div class="font-semibold">480 kW Supercharger</div>
            </div>
            <div class="p-4 rounded-xl bg-white/5 border border-white/10">
              <div class="text-sm text-muted">Seats</div>
              <div class="font-semibold">5</div>
            </div>
          </div>
        </section>

        <section class="card p-6 md:p-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">Highlights</h2>
            <div class="text-muted text-sm">Curated features</div>
          </div>
          <div class="divider my-6"></div>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="p-5 rounded-xl bg-white/5 border border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400/30 to-blue-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" stroke-width="1.5"/></svg>
                </div>
                <div class="font-semibold">Autopilot</div>
              </div>
              <p class="text-muted mt-2 text-sm">Advanced driver assistance with adaptive cruise, lane centering, and more.</p>
            </div>
            <div class="p-5 rounded-xl bg-white/5 border border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-400/30 to-purple-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12h16M12 4v16" stroke="currentColor" stroke-width="1.5"/></svg>
                </div>
                <div class="font-semibold">Dayna Design</div>
              </div>
              <p class="text-muted mt-2 text-sm">Sleek silhouette with signature fast-charging columns and panoramic glass.</p>
            </div>
            <div class="p-5 rounded-xl bg-white/5 border border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400/30 to-cyan-500/30 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="1.5"/></svg>
                </div>
                <div class="font-semibold">4680 Battery</div>
              </div>
              <p class="text-muted mt-2 text-sm">Denser energy density with improved thermal and safety performance.</p>
            </div>
          </div>
        </section>

        <section class="card p-6 md:p-8">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold">Pricing</h2>
            <div class="text-muted text-sm">Starting from</div>
          </div>
          <div class="mt-6 grid md:grid-cols-2 gap-6">
            <div class="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-muted">Model 3</div>
                  <div class="text-3xl font-extrabold">$69,990</div>
                </div>
                <div class="range-badge">Long Range</div>
              </div>
              <ul class="mt-4 space-y-2 text-sm text-gray-300">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Standard Package</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Autopilot</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Premium Package</li>
              </ul>
              <button class="btn btn-primary w-full mt-6">Choose Trim</button>
            </div>
            <div class="p-6 rounded-xl bg-white/5 border border-white/10">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm text-muted">Model 3</div>
                  <div class="text-3xl font-extrabold">$79,990</div>
                </div>
                <div class="range-badge">High Performance</div>
              </div>
              <ul class="mt-4 space-y-2 text-sm text-gray-300">
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> All Performance Package</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Autopilot</li>
                <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> Premium Package</li>
              </ul>
              <button class="btn w-full mt-6">Choose Trim</button>
            </div>
          </div>
        </section>
      </div>

      <aside class="space-y-8">
        <div class="card p-6 md:p-8">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">Sellers</h3>
            <a href="#" class="text-sm link">See all</a>
          </div>
          <div class="divider my-6"></div>
          <div class="space-y-6">
            <div class="seller-card transition relative p-5 rounded-xl bg-white/5 border border-white/10">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">TS</div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="font-semibold">Official Tesla San Francisco</div>
                    <div class="chip">Plaid • FSD</div>
                  </div>
                  <div class="text-sm text-muted mt-1">3.2 mi • Open today 9–6</div>
                  <div class="mt-3 flex items-center gap-2">
                    <div class="range-badge">120+ units</div>
                    <div class="text-sm text-gray-300">4.9 ★ (21k)</div>
                  </div>
                  <button class="btn btn-primary w-full mt-4">Schedule Test Drive</button>
                </div>
              </div>
            </div>

            <div class="seller-card transition relative p-5 rounded-xl bg-white/5 border border-white/10">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold">TL</div>
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <div class="font-semibold">Tesla Long Beach</div>
                    <div class="chip">North America</div>
                  </div>
                  <div class="text-sm text-muted mt-1">1.8 mi • Open today 8–7</div>
                  <div class="mt-3 flex items-center gap-2">
                    <div class="range-badge">180+ units</div>
                    <div class="text-sm text-gray-300">4.8 ★ (12k)</div>
                  </div>
                  <button class="btn w-full mt-4">View Inventory</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card p-6 md:p-8">
          <h3 class="text-xl font-bold">Certifications</h3>
          <div class="divider my-6"></div>
          <ul class="space-y-3 text-sm">
            <li class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 7L9 18l-5-5" stroke="#34d399" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              EPA Zero-Emissions Vehicle
            </li>
            <li class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 7L9 18l-5-5" stroke="#34d399" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              National Highway Traffic Safety Administration
            </li>
            <li class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 7L9 18l-5-5" stroke="#34d399" stroke-width="2" stroke-linecap="round"/></svg>
              </div>
              ISO/IEC 27001 Privacy
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </main>

  <footer class="max-w-7xl mx-auto px-6 pb-12">
    <div class="card p-6 md:p-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div class="text-lg font-bold">Stay in the loop</div>
          <div class="text-muted text-sm">Get updates on new models, pricing, and tech.</div>
        </div>
        <form class="flex w-full md:w-auto gap-3" onsubmit="event.preventDefault(); this.querySelector('button').click();">
          <input type="email" required placeholder="Your email" class="flex-1 md:w-80 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-cyan-500/40 focus:outline-none" />
          <button class="btn btn-primary">Subscribe</button>
        </form>
      </div>
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 text-sm text-muted">
      <div>© 2025 Tesla, Inc. All rights reserved.</div>
      <div class="flex items-center gap-4">
        <a href="#" class="hover:text-white">Privacy</a>
        <a href="#" class="hover:text-white">Terms</a>
        <a href="#" class="hover:text-white">Contact</a>
      </div>
    </div>
  </footer>

  <script>
    // Simple parallax effect on hero image container
    (function() {
      const card = document.querySelector('.model-3');
      if (!card) return;
      let rect;
      function update(e) {
        if (!rect) rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const tiltX = (py - 0.5) * 8;
        const tiltY = (0.5 - px) * 8;
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        card.style.transition = 'transform 80ms ease';
      }
      function reset() {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      }
      card.addEventListener('mousemove', update);
      card.addEventListener('mouseleave', reset);
      // Touch support
      let touchStart = null;
      card.addEventListener('touchstart', e => touchStart = e.touches[0], {passive:true});
      card.addEventListener('touchmove', e => {
        if (!touchStart) return;
        update(e.touches[0]);
      }, {passive:true});
      card.addEventListener('touchend', () => { touchStart = null; reset(); });
    })();

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const href = a.getAttribute('href');
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
      });
    });

    // Button focus-visible style
    document.querySelectorAll('button, a, input').forEach(el => {
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' && el.tagName === 'A') el.click();
      });
    });
  </script>
</body>
</html>