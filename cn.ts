@import "tailwindcss";

@theme {
  --font-sans: "Tajawal", "Cairo", system-ui, sans-serif;
  --color-brand-50: #eef1fb;
  --color-brand-100: #d6dcf3;
  --color-brand-200: #a9b4e3;
  --color-brand-300: #7a8bd1;
  --color-brand-400: #4d62bf;
  --color-brand-500: #2d44a4;
  --color-brand-600: #1B2A6B;
  --color-brand-700: #15225a;
  --color-brand-800: #101a47;
  --color-brand-900: #0a1233;
  --color-gold-400: #fbbf24;
  --color-gold-500: #F59E0B;
  --color-gold-600: #d97706;
}

html, body, #root {
  height: 100%;
}

body {
  font-family: "Tajawal", "Cairo", system-ui, sans-serif;
  background: #f5f7fb;
  color: #0f172a;
  -webkit-font-smoothing: antialiased;
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* Pulse dot */
@keyframes pulseDot {
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
.pulse-dot {
  animation: pulseDot 1.8s infinite;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-in-up { animation: fadeInUp 0.4s ease-out both; }

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
.slide-in-right { animation: slideInRight 0.35s ease-out both; }

@keyframes pop {
  0% { transform: scale(0.85); opacity: 0; }
  60% { transform: scale(1.04); opacity: 1; }
  100% { transform: scale(1); }
}
.pop { animation: pop 0.35s ease-out both; }

@keyframes shimmer {
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
.shimmer {
  background: linear-gradient(90deg, #eef2f7 0px, #f8fafc 200px, #eef2f7 400px);
  background-size: 800px 100%;
  animation: shimmer 1.4s linear infinite;
}

/* Soft card */
.soft-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(15,23,42,0.04), 0 6px 20px -8px rgba(15,23,42,0.08);
}

.btn-primary {
  background: linear-gradient(135deg, #1B2A6B, #2d44a4);
  color: #fff;
  transition: all .2s ease;
}
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 10px 24px -10px rgba(27,42,107,0.55); }

.btn-gold {
  background: linear-gradient(135deg, #F59E0B, #fbbf24);
  color: #1B2A6B;
  transition: all .2s ease;
  font-weight: 700;
}
.btn-gold:hover { transform: translateY(-1px); box-shadow: 0 10px 24px -10px rgba(245,158,11,0.6); }

/* Sidebar nav active */
.nav-active {
  background: linear-gradient(135deg, rgba(245,158,11,0.18), rgba(245,158,11,0.08));
  color: #F59E0B !important;
  border-right: 3px solid #F59E0B;
}

.gradient-header {
  background: radial-gradient(circle at 20% 0%, #2d44a4 0%, #1B2A6B 60%, #15225a 100%);
}

/* number ticker */
.tick {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}
