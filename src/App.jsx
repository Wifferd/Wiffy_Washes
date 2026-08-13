import React, { useState, useEffect, useRef } from "react";
import {
  Car, MessageCircle, Calendar, Check, Send, Wrench,
  ChevronRight, ChevronLeft, Plus, User, Phone,
  AlertCircle, CheckCircle2, XCircle, ClipboardList,
  Menu, X, Info, LogIn, LogOut, Users, UserPlus, Trash2, Tag,
  Settings2, Handshake, Home as HomeIcon, Lightbulb, ShieldCheck,
  ShoppingBag, Link2, Instagram, MapPin, ArrowRight, Lock, Eye, EyeOff, Star, KeyRound, Heart, Copy, Camera, Sparkles, Droplets
} from "lucide-react";

// ---------- palette (Wiffed_ Detailing: dark/light aware) ----------
const DARK = {
  bg: "#0A0A0C", panel: "#16141A", panelBorder: "#2B2733", chip: "#1C1922", chipAlt: "#231F29",
  input: "#0F0D13", ink: "#1A1A1D", paper: "#D9DBDE", purple: "#8B5CF6", purpleDeep: "#4C1D7A",
  silver: "#C9CBCE", blue: "#3E8C9C", green: "#4C8C5B", red: "#C4483C", mute: "#8B8A93",
  text: "#FFFFFF", chatOther: "#26222E",
  hintBg: "rgba(139,92,246,0.10)", hintBorder: "rgba(139,92,246,0.35)", hintText: "#D8CCF5",
};
const LIGHT = {
  bg: "#FAFAFC", panel: "#FFFFFF", panelBorder: "#E5E1EC", chip: "#F4F1FA", chipAlt: "#EAE4F5",
  input: "#FFFFFF", ink: "#1A1A1D", paper: "#FFFFFF", purple: "#7C3AED", purpleDeep: "#6D3FA0",
  silver: "#4B4854", blue: "#2E7480", green: "#3E7A4C", red: "#B23A30", mute: "#6B6775",
  text: "#15121B", chatOther: "#F0EDF7",
  hintBg: "rgba(124,58,237,0.07)", hintBorder: "rgba(124,58,237,0.28)", hintText: "#4C2F8C",
};
// eslint-disable-next-line prefer-const
let C = { ...LIGHT };
function applyTheme(name) {
  const src = name === "light" ? LIGHT : DARK;
  Object.keys(src).forEach((k) => { C[k] = src[k]; });
}

const PHONE_DISPLAY = "+1 (945) 361-7551";
const PHONE_TEL = "+19453617551";
const INSTAGRAM_HANDLE = "@Wiffed_";
const INSTAGRAM_URL = "https://www.instagram.com/Wiffed_";
const MOBILE_FEE = 30;
const MOBILE_PER_MILE = 2;
// TODO: replace with the real business inbox — this is where "Request team access" emails go.
const BUSINESS_EMAIL = "owner@wiffeddetailing.com";
// TODO: fill in once Zelle is set up (a phone number or email, whichever the bank account
// uses) — the Support Us page automatically switches from "coming soon" to a live
// tap-to-copy donate flow the moment this isn't empty.
const ZELLE_CONTACT = "";

const EXTERIOR_SERVICES = [
  { id: "basic-wash", name: "Basic Wash", price: 29.99, desc: "Quick and simple — a water rinse and contact wash, plus brake cleaner." },
  { id: "professional-wash", name: "Professional Wash", price: 79.99, desc: "Takes longer: a pre-wash first, then a full contact wash, finished with brake cleaner and tire shine." },
  { id: "xtra-pro-wash", name: "Xtra Pro Wash", price: 99.99, desc: "Everything in the Professional Wash, plus engine bay cleaning and an exhaust clean." },
  { id: "deep-clean-ext", name: "Deep Clean", price: 159.99, desc: "Everything in the Xtra Pro Wash — we also pull your tires off and clean everything around and behind them." },
];
const INTERIOR_SERVICES = [
  { id: "basic-detail", name: "Basic Detail", price: 39.99, desc: "Full interior vacuum and wipe-down." },
  { id: "deep-clean-int", name: "Deep Clean", price: 89.99, desc: "A full scrub of the interior and mats, plus steam clean and water vacuum." },
  { id: "professional-clean", name: "Professional Clean", price: 109.99, desc: "Everything in the Deep Clean, plus plastic restoration — inside and out." },
];
// Custom / quote-only work — not part of the structured booking flow, shown as
// informational content that points people to call directly.
const MORE_SERVICES = ["Headlight Restoration", "Waxing / Ceramic Wash", "Ceramic Coating", "Paint Correction", "Polishing"];
const SERVICES = [...EXTERIOR_SERVICES, ...INTERIOR_SERVICES];
function money(n) { return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`; }
// Handles both the exterior+interior ticket shape and any older tickets saved
// before this menu existed, which only had a single flat `serviceType`.
function ticketServiceLabel(ticket) {
  const ext = SERVICES.find((s) => s.id === ticket.exteriorType);
  const intr = SERVICES.find((s) => s.id === ticket.interiorType);
  const combined = [ext?.name, intr?.name].filter(Boolean).join(" + ");
  if (combined) return combined;
  const legacy = SERVICES.find((s) => s.id === ticket.serviceType);
  return legacy?.name || "—";
}

const MODS = [
  "Lowered / Coilovers", "Aftermarket Wheels", "Wide Body Kit",
  "Vinyl Wrap / PPF", "Aftermarket Exhaust", "Carbon Fiber Parts", "Window Tint", "Other",
];
const COLORS = ["Black", "White", "Silver", "Gray", "Red", "Blue", "Green", "Yellow", "Orange", "Brown", "Beige", "Gold", "Purple", "Other"];
const CONTACT_METHODS = ["Phone number", "Email", "Instagram"];
const OTHER_OPTION = "Other / Not Listed";

// Curated makes — mainstream current + common legacy/luxury/EV brands people still bring
// in for washes. Models are pulled live from NHTSA's public vehicle database, filtered
// to the model year selected; the lists below are only a fallback if that lookup fails.
const MAKES = [
  "Acura", "Alfa Romeo", "AMC", "Audi", "Bentley", "BMW", "Buick", "Cadillac", "Chevrolet",
  "Chrysler", "Datsun", "DeLorean", "Dodge", "Eagle", "Fiat", "Ford", "Genesis", "Geo", "GMC",
  "Honda", "Hummer", "Hyundai", "Infiniti", "Isuzu", "Jaguar", "Jeep", "Kia", "Land Rover",
  "Lexus", "Lincoln", "Lotus", "Lucid", "Maserati", "Mazda", "McLaren", "Mercedes-Benz",
  "Mercury", "Mini", "Mitsubishi", "Nissan", "Oldsmobile", "Plymouth", "Polestar", "Pontiac",
  "Porsche", "Ram", "Rivian", "Rolls-Royce", "Saab", "Saturn", "Scion", "Smart", "Subaru",
  "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
].sort();
const FALLBACK_MODELS = {
  Acura: ["Integra", "ILX", "TLX", "RDX", "MDX"],
  "Alfa Romeo": ["Giulia", "Stelvio", "4C"],
  AMC: ["Eagle", "Gremlin", "Pacer", "Concord"],
  Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "Q8", "e-tron"],
  Bentley: ["Continental GT", "Flying Spur", "Bentayga"],
  BMW: ["2 Series", "3 Series", "4 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X7"],
  Buick: ["Encore", "Encore GX", "Envision", "Enclave"],
  Cadillac: ["CT4", "CT5", "XT4", "XT5", "XT6", "Escalade"],
  Chevrolet: ["Spark", "Malibu", "Camaro", "Corvette", "Trax", "Trailblazer", "Equinox", "Blazer", "Traverse", "Tahoe", "Suburban", "Colorado", "Silverado 1500"],
  Chrysler: ["300", "Pacifica"],
  Datsun: ["240Z", "280Z", "510", "B210"],
  DeLorean: ["DMC-12"],
  Dodge: ["Charger", "Challenger", "Durango", "Hornet"],
  Eagle: ["Talon", "Vision", "Summit"],
  Fiat: ["500", "500X", "500L"],
  Ford: ["Focus", "Mustang", "Bronco", "Bronco Sport", "Escape", "Edge", "Explorer", "Expedition", "Maverick", "Ranger", "F-150"],
  Genesis: ["G70", "G80", "G90", "GV60", "GV70", "GV80"],
  Geo: ["Metro", "Prizm", "Tracker"],
  GMC: ["Terrain", "Acadia", "Yukon", "Canyon", "Sierra 1500"],
  Honda: ["Civic", "Accord", "Insight", "HR-V", "CR-V", "Passport", "Pilot", "Ridgeline", "Odyssey"],
  Hummer: ["H1", "H2", "H3"],
  Hyundai: ["Venue", "Kona", "Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade", "Ioniq 5"],
  Infiniti: ["Q50", "Q60", "QX50", "QX55", "QX60", "QX80"],
  Isuzu: ["Rodeo", "Trooper", "Ascender"],
  Jaguar: ["XE", "XF", "F-PACE", "E-PACE", "F-TYPE"],
  Jeep: ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator"],
  Kia: ["Rio", "Forte", "K5", "Soul", "Seltos", "Sportage", "Sorento", "Telluride", "EV6"],
  "Land Rover": ["Range Rover", "Range Rover Sport", "Range Rover Evoque", "Discovery", "Defender"],
  Lexus: ["IS", "ES", "GS", "LS", "UX", "NX", "RX", "GX", "LX"],
  Lincoln: ["Corsair", "Nautilus", "Aviator", "Navigator"],
  Lotus: ["Elise", "Evora", "Emira"],
  Lucid: ["Air", "Gravity"],
  Maserati: ["Ghibli", "Quattroporte", "Levante", "Grecale"],
  Mazda: ["Mazda3", "Mazda6", "CX-30", "CX-5", "CX-9", "MX-5 Miata"],
  McLaren: ["570S", "720S", "Artura"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "S-Class", "GLA", "GLB", "GLC", "GLE", "GLS"],
  Mercury: ["Grand Marquis", "Sable", "Cougar"],
  Mini: ["Cooper", "Countryman", "Clubman"],
  Mitsubishi: ["Mirage", "Outlander", "Outlander Sport", "Eclipse Cross"],
  Nissan: ["Versa", "Sentra", "Altima", "Maxima", "Kicks", "Rogue", "Murano", "Pathfinder", "Armada", "Frontier", "Titan"],
  Oldsmobile: ["Cutlass", "Delta 88", "Alero"],
  Plymouth: ["Barracuda", "Duster", "Voyager"],
  Polestar: ["Polestar 2", "Polestar 3"],
  Pontiac: ["G6", "Grand Prix", "Vibe", "Solstice"],
  Porsche: ["718", "911", "Panamera", "Macan", "Cayenne", "Taycan"],
  Ram: ["1500", "2500", "3500", "ProMaster"],
  Rivian: ["R1T", "R1S"],
  "Rolls-Royce": ["Ghost", "Phantom", "Cullinan", "Wraith"],
  Saab: ["9-3", "9-5"],
  Saturn: ["Ion", "Aura", "Vue", "Outlook"],
  Scion: ["tC", "xB", "xD", "FR-S"],
  Smart: ["Fortwo"],
  Subaru: ["Impreza", "Legacy", "Crosstrek", "Forester", "Outback", "Ascent", "WRX", "BRZ"],
  Suzuki: ["Samurai", "Vitara", "SX4"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  Toyota: ["Corolla", "Camry", "Avalon", "Prius", "C-HR", "RAV4", "Venza", "Highlander", "4Runner", "Sequoia", "Tacoma", "Tundra", "Sienna", "Supra"],
  Volkswagen: ["Jetta", "Passat", "Golf GTI", "Taos", "Tiguan", "Atlas", "ID.4"],
  Volvo: ["S60", "S90", "XC40", "XC60", "XC90"],
};
const YEARS = Array.from({ length: 2027 - 1960 }, (_, i) => 2026 - i);

const STATUS_STYLE = {
  pending: { label: "PENDING", color: () => C.silver },
  accepted: { label: "ACCEPTED", color: () => C.purple },
  confirmed: { label: "CONFIRMED", color: () => C.blue },
  completed: { label: "COMPLETED", color: () => C.green },
  declined: { label: "DECLINED", color: () => C.red },
};

function genId(n) { return `WD-${new Date().getFullYear()}-${String(n).padStart(4, "0")}`; }
function fmtDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " · " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}
function nowTime() { return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); }
function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing 0/O/1/I
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// ---------- profanity filter ----------
const BLOCKED_WORDS = [
  "fuck", "fuk", "fck", "shit", "shyt", "bitch", "biatch", "asshole", "dick", "pussy", "cunt",
  "fag", "faggot", "nigger", "nigga", "whore", "slut", "bastard", "cock", "piss", "crap",
  "douche", "retard", "rape", "kys", "cum", "porn", "nazi", "twat", "wanker", "jackass",
];
function normalizeForFilter(s) {
  return (s || "").toLowerCase()
    .replace(/[\s\-_.]+/g, "")
    .replace(/0/g, "o").replace(/4/g, "a").replace(/1/g, "i").replace(/3/g, "e")
    .replace(/5/g, "s").replace(/7/g, "t").replace(/@/g, "a").replace(/\$/g, "s");
}
function isClean(v) {
  const norm = normalizeForFilter(v);
  return !BLOCKED_WORDS.some((w) => norm.includes(w));
}

// ---------- validation helpers ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HANDLE_RE = /^@?[A-Za-z0-9._]{2,30}$/;
const FREE_RE = /^[A-Za-z0-9][A-Za-z0-9.\-\/,# ]{0,59}$/;
const NAME_WORD_RE = /^[A-Za-z][A-Za-z'\-]{1,19}$/;
const GIBBERISH_SNIPPETS = ["asdf", "qwer", "zxcv", "test", "xxxx", "yyyy", "zzzz", "aaaa", "1234", "abcd"];

function looksLikeGibberish(word) {
  const w = word.toLowerCase();
  if (/^(.)\1+$/.test(w)) return true;
  return GIBBERISH_SNIPPETS.some((g) => w.includes(g));
}
function isValidName(v) {
  const parts = (v || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length < 2) return false;
  return parts.every((p) => NAME_WORD_RE.test(p) && !looksLikeGibberish(p)) && isClean(v);
}
function isValidDisplayName(v) {
  const s = (v || "").trim();
  return s.length >= 2 && s.length <= 30 && isClean(s);
}
function isValidPhone(v) { return (v || "").replace(/\D/g, "").length === 10; }
function isValidEmail(v) { return EMAIL_RE.test((v || "").trim()); }
function isValidHandle(v) { return HANDLE_RE.test((v || "").trim()); }
function isValidFreeText(v) { return FREE_RE.test((v || "").trim()) && isClean(v); }
function isValidUsername(v) { return /^[A-Za-z0-9]{4,20}$/.test((v || "").trim()) && isClean(v); }
function isValidStrongPassword(v) {
  const s = v || "";
  return s.length >= 8 && /[A-Z]/.test(s) && /[a-z]/.test(s) && /[0-9]/.test(s) && /[^A-Za-z0-9]/.test(s);
}
function formatPhone(v) {
  const d = (v || "").replace(/\D/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

// ---------- live vehicle data (NHTSA vPIC public API) ----------
async function fetchModelsForMake(make) {
  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(make)}?format=json`);
    const data = await res.json();
    const names = Array.from(new Set((data.Results || []).map((r) => (r.Model_Name || "").trim()))).filter(Boolean).sort();
    return names.length ? names : (FALLBACK_MODELS[make] || []);
  } catch {
    return FALLBACK_MODELS[make] || [];
  }
}
// vPIC's year+make filtered lookup only reliably covers model year 1981+, so classics
// fall back to the unfiltered (still real, just not year-narrowed) make lookup.
async function fetchModelsForMakeYear(make, year) {
  const yr = parseInt(year, 10);
  try {
    if (yr && yr >= 1981) {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${encodeURIComponent(make)}/modelyear/${yr}?format=json`);
      const data = await res.json();
      const names = Array.from(new Set((data.Results || []).map((r) => (r.Model_Name || "").trim()))).filter(Boolean).sort();
      if (names.length) return names;
    }
  } catch { /* fall through to unfiltered lookup */ }
  return fetchModelsForMake(make);
}

// ---------- storage ----------
async function loadKey(key, fallback, shared = true) {
  try {
    const res = await window.storage.get(key, shared);
    return res ? JSON.parse(res.value) : fallback;
  } catch { return fallback; }
}
async function saveKey(key, value, shared = true) {
  try { await window.storage.set(key, JSON.stringify(value), shared); } catch (e) { console.error("storage save failed", e); }
}

// ---------- global styles (animations + performance mode) ----------
function GlobalStyle() {
  return (
    <style>{`
      @keyframes c4rdFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes c4rdSlideIn { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
      @keyframes c4rdPulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.35); } 50% { box-shadow: 0 0 18px 3px rgba(139,92,246,0.25); } }
      @keyframes c4rdDissolveIn { from { opacity: 0; filter: blur(6px); transform: scale(0.96); } to { opacity: 1; filter: blur(0); transform: scale(1); } }
      @keyframes c4rdTwinkle { 0%, 100% { opacity: 0.15; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.15); } }
      @keyframes c4rdShineRing { 0% { box-shadow: 0 0 0 0 rgba(139,92,246,0.5), 0 0 20px 2px rgba(139,92,246,0.25); } 50% { box-shadow: 0 0 0 8px rgba(139,92,246,0), 0 0 34px 8px rgba(139,92,246,0.45); } 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0), 0 0 20px 2px rgba(139,92,246,0.25); } }
      @keyframes c4rdSheenSweep { 0% { left: -150%; } 55%, 100% { left: 150%; } }
      .c4rd-fade { animation: c4rdFadeUp 0.4s ease both; }
      .c4rd-slide { animation: c4rdSlideIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .c4rd-pulse { animation: c4rdPulseGlow 3s ease-in-out infinite; }
      .c4rd-dissolve { animation: c4rdDissolveIn 0.5s ease both; }
      .c4rd-twinkle { animation: c4rdTwinkle 2.4s ease-in-out infinite; }
      .c4rd-shine-ring { animation: c4rdShineRing 2.8s ease-in-out infinite; }
      .c4rd-sheen { position: relative; overflow: hidden; }
      .c4rd-sheen::after { content: ""; position: absolute; top: 0; left: -150%; width: 55%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,0.4), transparent); animation: c4rdSheenSweep 3.2s ease-in-out infinite; pointer-events: none; }
      .c4rd-lift { transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; }
      .c4rd-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(139,92,246,0.14); }
      .c4rd-glow-btn { transition: box-shadow 0.25s ease, transform 0.2s ease; }
      .c4rd-glow-btn:hover { box-shadow: 0 0 0 1px rgba(139,92,246,0.5), 0 0 26px 6px rgba(139,92,246,0.4); }
      .c4rd-glow-card:hover { border-color: rgba(139,92,246,0.6) !important; box-shadow: 0 0 0 1px rgba(139,92,246,0.25), 0 10px 28px rgba(139,92,246,0.16); }
      .c4rd-input-glow { transition: box-shadow 0.2s ease, border-color 0.2s ease; }
      .c4rd-input-glow:focus-within { border-color: #8B5CF6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.22); }
      .c4rd-perf .c4rd-fade, .c4rd-perf .c4rd-slide, .c4rd-perf .c4rd-pulse, .c4rd-perf .c4rd-dissolve, .c4rd-perf .c4rd-twinkle, .c4rd-perf .c4rd-shine-ring { animation: none !important; }
      .c4rd-perf .c4rd-sheen::after { animation: none !important; display: none; }
      .c4rd-perf .c4rd-lift, .c4rd-perf .c4rd-lift:hover, .c4rd-perf .c4rd-glow-btn:hover, .c4rd-perf .c4rd-glow-card:hover { transition: none !important; transform: none !important; box-shadow: none !important; border-color: inherit !important; }
    `}</style>
  );
}

// ---------- atoms ----------
function Stamp({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  const color = s.color();
  return (
    <div className="inline-block px-3 py-1 text-xs font-black tracking-widest uppercase rounded-sm"
      style={{ color, border: `2px solid ${color}`, transform: "rotate(-4deg)", letterSpacing: "0.12em" }}>
      {s.label}
    </div>
  );
}
function SectionLabel({ children }) {
  return <div className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: C.mute, letterSpacing: "0.15em" }}>{children}</div>;
}
function Field({ icon, placeholder, value, onChange, maxLength }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 rounded-2xl c4rd-input-glow" style={{ backgroundColor: C.input, border: `1px solid ${C.panelBorder}` }}>
      {icon && <span style={{ color: C.mute }}>{icon}</span>}
      <input value={value} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ color: C.text }} className="bg-transparent outline-none text-sm w-full" />
    </div>
  );
}
function ValidatedField({ icon, placeholder, value, onChange, isValidFn, errorMsg, inputMode, format, maxLength }) {
  const v = value || "";
  const showError = v.length > 0 && isValidFn && !isValidFn(v);
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl c4rd-input-glow" style={{ backgroundColor: C.input, border: `1px solid ${showError ? C.red : C.panelBorder}` }}>
        {icon && <span style={{ color: C.mute }}>{icon}</span>}
        <input value={v} inputMode={inputMode} maxLength={maxLength} onChange={(e) => onChange(format ? format(e.target.value) : e.target.value)} placeholder={placeholder}
          style={{ color: C.text }} className="bg-transparent outline-none text-sm w-full" />
      </div>
      {showError && <div className="text-[11px] mt-1" style={{ color: C.red }}>{errorMsg}</div>}
    </div>
  );
}
function TextArea({ placeholder, value, onChange, rows = 3, maxLen = 300 }) {
  const v = value || "";
  const showError = v.length > 0 && !isClean(v);
  return (
    <div>
      <div className="rounded-2xl c4rd-input-glow" style={{ border: `1px solid ${showError ? C.red : C.panelBorder}` }}>
        <textarea value={v} onChange={(e) => onChange(e.target.value.slice(0, maxLen))} placeholder={placeholder} rows={rows}
          className="w-full px-4 py-3 rounded-2xl text-sm outline-none resize-none"
          style={{ backgroundColor: C.input, color: C.text, border: "none" }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[11px]" style={{ color: C.red }}>{showError ? "Please keep it respectful." : ""}</span>
        <span className="text-[10px]" style={{ color: C.mute }}>{v.length}/{maxLen}</span>
      </div>
    </div>
  );
}
function PasswordField({ placeholder, value, onChange, isValidFn, errorMsg }) {
  const [show, setShow] = useState(false);
  const v = value || "";
  const showError = v.length > 0 && isValidFn && !isValidFn(v);
  return (
    <div>
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl c4rd-input-glow" style={{ backgroundColor: C.input, border: `1px solid ${showError ? C.red : C.panelBorder}` }}>
        <Lock size={14} color={C.mute} />
        <input type={show ? "text" : "password"} value={v} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          style={{ color: C.text }} className="bg-transparent outline-none text-sm w-full" />
        <button type="button" onClick={() => setShow((s) => !s)}>{show ? <EyeOff size={14} color={C.mute} /> : <Eye size={14} color={C.mute} />}</button>
      </div>
      {showError && <div className="text-[11px] mt-1" style={{ color: C.red }}>{errorMsg}</div>}
    </div>
  );
}
function PasswordChecklist({ password }) {
  const v = password || "";
  const rules = [
    { label: "8+ characters", pass: v.length >= 8 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(v) },
    { label: "One lowercase letter", pass: /[a-z]/.test(v) },
    { label: "One number", pass: /[0-9]/.test(v) },
    { label: "One symbol", pass: /[^A-Za-z0-9]/.test(v) },
  ];
  return (
    <div className="space-y-1 pt-1">
      {rules.map((r) => (
        <div key={r.label} className="flex items-center gap-1.5 text-[11px]" style={{ color: r.pass ? C.green : C.mute }}>
          {r.pass ? <Check size={12} /> : <X size={12} />} {r.label}
        </div>
      ))}
    </div>
  );
}
function Select({ value, onChange, options, placeholder, disabled }) {
  return (
    <div className="rounded-2xl c4rd-input-glow" style={{ border: `1px solid ${C.panelBorder}`, opacity: disabled ? 0.5 : 1 }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
        className="w-full px-4 py-3 rounded-2xl text-sm outline-none"
        style={{ backgroundColor: C.input, color: value ? C.text : C.mute, border: "none" }}>
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function ReviewRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-1.5 text-sm" style={{ borderBottom: `1px dashed ${C.panelBorder}` }}>
      <span style={{ color: C.mute }}>{label}</span>
      <span className="text-right" style={{ color: C.text }}>{value}</span>
    </div>
  );
}
function HintBox({ children }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-md" style={{ backgroundColor: C.hintBg, border: `1px solid ${C.hintBorder}` }}>
      <Lightbulb size={16} color={C.purple} className="shrink-0 mt-0.5" />
      <div className="text-xs leading-relaxed" style={{ color: C.hintText }}>{children}</div>
    </div>
  );
}
function PhotoPlaceholder({ icon, label, gradient }) {
  return (
    <div className="rounded-2xl mb-4 flex flex-col items-center justify-center relative overflow-hidden" style={{ height: 120, backgroundImage: gradient }}>
      {icon}
      <span className="text-[10px] uppercase tracking-widest font-bold mt-2" style={{ color: "rgba(255,255,255,0.75)" }}>{label}</span>
    </div>
  );
}
function ServiceTierRow({ name, price, desc, last }) {
  return (
    <div className="py-3" style={last ? {} : { borderBottom: `1px dashed ${C.panelBorder}` }}>
      <div className="flex justify-between items-baseline gap-3">
        <span className="font-bold text-sm" style={{ color: C.text }}>{name}</span>
        <span className="font-black font-mono text-base shrink-0" style={{ color: C.purple }}>{money(price)}</span>
      </div>
      <div className="text-xs mt-1" style={{ color: C.mute, lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}
function ServicesSection() {
  return (
    <div>
      <SectionLabel>Our Plans &amp; Services</SectionLabel>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-3xl p-6 c4rd-lift c4rd-glow-card" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <PhotoPlaceholder icon={<Droplets size={30} color="#fff" />} label="Exterior photos coming soon" gradient={`linear-gradient(135deg, ${C.purpleDeep}, ${C.input})`} />
          <div className="font-black uppercase tracking-tight text-lg mb-1" style={{ color: C.text }}>Exterior Detailing</div>
          <div>
            {EXTERIOR_SERVICES.map((s, i) => <ServiceTierRow key={s.id} name={s.name} price={s.price} desc={s.desc} last={i === EXTERIOR_SERVICES.length - 1} />)}
          </div>
        </div>

        <div className="rounded-3xl p-6 c4rd-lift c4rd-glow-card" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <PhotoPlaceholder icon={<Sparkles size={30} color="#fff" />} label="Interior photos coming soon" gradient={`linear-gradient(135deg, ${C.blue}, ${C.input})`} />
          <div className="font-black uppercase tracking-tight text-lg mb-1" style={{ color: C.text }}>Interior Detail</div>
          <div>
            {INTERIOR_SERVICES.map((s, i) => <ServiceTierRow key={s.id} name={s.name} price={s.price} desc={s.desc} last={i === INTERIOR_SERVICES.length - 1} />)}
          </div>
        </div>

        <div className="rounded-3xl p-6 c4rd-lift c4rd-glow-card" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <PhotoPlaceholder icon={<Heart size={28} color="#fff" />} label="Deals & More" gradient={`linear-gradient(135deg, ${C.purple}, ${C.purpleDeep})`} />
          <div className="font-black uppercase tracking-tight text-lg mb-1" style={{ color: C.text }}>Deals &amp; More Services</div>
          <div className="py-3" style={{ borderBottom: `1px dashed ${C.panelBorder}` }}>
            <div className="text-sm font-bold" style={{ color: C.text }}>Looking for both interior and exterior?</div>
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-1.5 mt-2 px-3 py-2 rounded-full text-xs font-bold c4rd-glow-btn" style={{ backgroundColor: C.purple, color: "#fff" }}>
              <Phone size={12} /> Call {PHONE_DISPLAY} for a combo price
            </a>
          </div>
          <div className="py-3">
            <div className="text-sm font-bold mb-2" style={{ color: C.text }}>More services (call for pricing)</div>
            <ul className="space-y-1.5">
              {MORE_SERVICES.map((m) => (
                <li key={m} className="text-xs flex items-center gap-2" style={{ color: C.mute, lineHeight: 1.7 }}>
                  <Sparkles size={11} color={C.purple} /> {m}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between flex-wrap gap-3 rounded-2xl p-4" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: C.text }}><Car size={14} color={C.purple} /> Mobile Wash (we come to you)</span>
        <span className="font-mono text-sm font-black" style={{ color: C.purple }}>+${MOBILE_FEE} &amp; ${MOBILE_PER_MILE}/mi</span>
      </div>
      <div className="text-[11px] mt-3 italic" style={{ color: C.mute }}>*Prices can vary depending on condition and size. Mobile wash is an add-on — we're based at a fixed location, not a mobile-only company.</div>
    </div>
  );
}
function TicketStub({ ticket, onClick, active }) {
  const s = STATUS_STYLE[ticket.status] || STATUS_STYLE.pending;
  const color = s.color();
  return (
    <button onClick={onClick} className="w-full text-left p-4 mb-3 rounded-md relative c4rd-lift"
      style={{
        backgroundColor: C.paper, color: C.ink, border: active ? `2px solid ${color}` : "2px solid transparent",
        backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(26,26,29,0.08) 6px, rgba(26,26,29,0.08) 7px)",
        backgroundSize: "100% 2px", backgroundRepeat: "no-repeat", backgroundPosition: "bottom 34px left",
      }}>
      <div className="flex justify-between items-start gap-3">
        <div>
          <div className="text-[10px] font-mono tracking-wider opacity-60">{ticket.id}</div>
          <div className="font-black text-lg leading-tight mt-0.5">{ticket.car.year} {ticket.car.make} {ticket.car.model}</div>
          <div className="text-sm opacity-70">{ticket.client.name}</div>
        </div>
        <Stamp status={ticket.status} />
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 text-xs font-mono flex-wrap" style={{ borderTop: `1px dashed ${C.ink}55` }}>
        <span className="flex items-center gap-1"><Wrench size={12} />{ticketServiceLabel(ticket)}</span>
        {ticket.confirmedTime && <span className="flex items-center gap-1"><Calendar size={12} />{fmtDateTime(ticket.confirmedTime)}</span>}
        {ticket.assignedWorker && <span className="flex items-center gap-1"><Handshake size={12} />{ticket.assignedWorker.name}</span>}
        {ticket.serviceLocation === "mobile" && <span className="flex items-center gap-1"><Car size={12} />Mobile</span>}
        {(ticket.hasCeramicCoating || ticket.hasPPF) && <span className="flex items-center gap-1"><ShieldCheck size={12} />{[ticket.hasCeramicCoating && "Ceramic", ticket.hasPPF && "PPF"].filter(Boolean).join(" + ")}</span>}
      </div>
    </button>
  );
}

// ---------- generic chat ----------
function Chat({ title, thread, sender, onSend }) {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [thread?.messages?.length]);
  if (!thread) return null;

  const trySend = () => {
    if (!text.trim()) return;
    if (!isClean(text)) { setErr("Please keep messages respectful."); return; }
    onSend(text.trim());
    setText(""); setErr("");
  };

  return (
    <div className="flex flex-col rounded-md overflow-hidden" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: `1px solid ${C.panelBorder}` }}>
        <MessageCircle size={16} color={C.purple} />
        <span className="text-sm font-bold" style={{ color: C.text }}>{title}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2" style={{ maxHeight: 260, minHeight: 140 }}>
        {thread.messages.length === 0 && <div className="text-sm italic" style={{ color: C.mute }}>No messages yet — say hello.</div>}
        {thread.messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.sender === sender ? "items-end" : "items-start"}`}>
            {m.sender !== sender && m.fromName && <span className="text-[10px] mb-0.5" style={{ color: C.mute }}>{m.fromName}</span>}
            <div className="max-w-[75%] px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: m.sender === sender ? C.purple : C.chatOther, color: m.sender === sender ? "#fff" : C.text }}>
              {m.text}
              <div className="text-[10px] opacity-60 mt-1 font-mono">{m.time}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="p-3" style={{ borderTop: `1px solid ${C.panelBorder}` }}>
        <div className="flex gap-2">
          <input value={text} onChange={(e) => { setText(e.target.value); setErr(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") trySend(); }}
            placeholder="Type a message…" className="flex-1 px-3 py-2 rounded text-sm outline-none"
            style={{ backgroundColor: C.input, color: C.text, border: `1px solid ${C.panelBorder}` }} />
          <button onClick={trySend} className="px-3 rounded flex items-center justify-center transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: C.purple }}>
            <Send size={16} color="#fff" />
          </button>
        </div>
        {err && <div className="text-[11px] mt-1" style={{ color: C.red }}>{err}</div>}
      </div>
    </div>
  );
}

// ---------- booking wizard ----------
const STEP_LABELS = ["You", "Vehicle", "Service", "Mods", "Notes", "Review"];

function BookingWizard({ prefillName, prefillPhone, onSubmit, onCancel }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: prefillName || "", phone: prefillPhone || "", contactMethod: "", contactDetail: "",
    year: "", make: "", model: "", customMake: "", customModel: "", color: "", colorOther: "",
    exteriorType: "", interiorType: "", serviceLocation: "", mobileAddress: "",
    hasMods: null, modsList: [], modsNotes: "", hasCeramicCoating: false, hasPPF: false,
    description: "", availabilityNotes: "",
  });
  const [modelOptions, setModelOptions] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleIn = (k, val) => setForm((f) => ({ ...f, [k]: f[k].includes(val) ? f[k].filter((x) => x !== val) : [...f[k], val] }));
  const renderServiceGroup = (list, selectedId, onSelect) => (
    <div className="space-y-3">
      {list.map((s) => {
        const isSel = selectedId === s.id;
        return (
          <button key={s.id} onClick={() => onSelect(isSel ? "" : s.id)} className="w-full text-left p-4 rounded-2xl flex items-center justify-between transition-colors c4rd-glow-card"
            style={{ backgroundColor: isSel ? C.purpleDeep : C.chip, border: `2px solid ${isSel ? C.purple : C.panelBorder}` }}>
            <div className="pr-3">
              <div className="text-base font-bold" style={{ color: "#fff" }}>{s.name}</div>
              <div className="text-xs mt-0.5" style={{ color: isSel ? "#E9E2F7" : C.mute, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="font-mono text-base font-black" style={{ color: isSel ? "#fff" : C.purple }}>{money(s.price)}</span>
              {isSel && <Check size={16} color="#fff" />}
            </div>
          </button>
        );
      })}
    </div>
  );

  useEffect(() => {
    if (!form.make || form.make === OTHER_OPTION || !form.year) { setModelOptions([]); return; }
    let cancelled = false;
    setModelsLoading(true);
    fetchModelsForMakeYear(form.make, form.year).then((names) => { if (!cancelled) { setModelOptions(names); setModelsLoading(false); } });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.make, form.year]);

  const usingCustomMake = form.make === OTHER_OPTION;
  const usingCustomModel = usingCustomMake || form.model === OTHER_OPTION;
  const effectiveMake = usingCustomMake ? form.customMake.trim() : form.make;
  const effectiveModel = usingCustomModel ? form.customModel.trim() : form.model;
  const finalColor = form.color === "Other" ? form.colorOther : form.color;
  const effectiveContactDetail = form.contactMethod === "Phone number" ? form.phone : form.contactDetail;
  const exteriorService = EXTERIOR_SERVICES.find((s) => s.id === form.exteriorType);
  const interiorService = INTERIOR_SERVICES.find((s) => s.id === form.interiorType);
  const exteriorPrice = exteriorService ? exteriorService.price : 0;
  const interiorPrice = interiorService ? interiorService.price : 0;
  const servicePrice = exteriorPrice + interiorPrice;

  const canNext = () => {
    if (step === 0) {
      if (!isValidName(form.name) || !isValidPhone(form.phone) || !form.contactMethod) return false;
      if (form.contactMethod === "Email") return isValidEmail(form.contactDetail);
      if (form.contactMethod === "Instagram") return isValidHandle(form.contactDetail);
      return true;
    }
    if (step === 1) return form.year && effectiveMake && isValidFreeText(effectiveMake) && effectiveModel && isValidFreeText(effectiveModel) && form.color && (form.color !== "Other" || isValidFreeText(form.colorOther));
    if (step === 2) {
      if ((!form.exteriorType && !form.interiorType) || !form.serviceLocation) return false;
      if (form.serviceLocation === "mobile" && !(form.mobileAddress && isValidFreeText(form.mobileAddress))) return false;
      return true;
    }
    if (step === 3) return form.hasMods !== null && (!form.modsNotes || isClean(form.modsNotes));
    if (step === 4) return (!form.description || isClean(form.description)) && (!form.availabilityNotes || isClean(form.availabilityNotes));
    return true;
  };

  return (
    <div className="rounded-md overflow-hidden c4rd-fade" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
      <div className="flex items-center gap-1 px-5 pt-5">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors" style={{ backgroundColor: i <= step ? C.purple : C.chipAlt, color: i <= step ? "#fff" : C.mute }}>{i + 1}</div>
              <span className="text-[9px] uppercase tracking-wide" style={{ color: i === step ? C.text : C.mute }}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && <div className="flex-1 h-[2px] mb-4 transition-colors" style={{ backgroundColor: i < step ? C.purple : C.chipAlt }} />}
          </React.Fragment>
        ))}
      </div>

      <div className="p-5 c4rd-slide" key={step}>
        {step === 0 && (
          <div className="space-y-3">
            <SectionLabel>Who's booking?</SectionLabel>
            <ValidatedField icon={<User size={14} />} placeholder="Full name" value={form.name} onChange={(v) => set("name", v)} isValidFn={isValidName} errorMsg="Enter your full name (first and last, letters only, no vulgar language)." maxLength={50} />
            <ValidatedField icon={<Phone size={14} />} placeholder="Phone number" value={form.phone} onChange={(v) => set("phone", v)} isValidFn={isValidPhone} errorMsg="Enter a valid 10-digit phone number." inputMode="numeric" format={formatPhone} />
            <SectionLabel>Preferred contact method</SectionLabel>
            <Select placeholder="How should we reach you?" value={form.contactMethod} onChange={(v) => set("contactMethod", v)} options={CONTACT_METHODS} />
            {form.contactMethod === "Email" && (
              <ValidatedField icon={<Send size={14} />} placeholder="Email address" value={form.contactDetail} onChange={(v) => set("contactDetail", v)} isValidFn={isValidEmail} errorMsg="Enter a valid email address." />
            )}
            {form.contactMethod === "Instagram" && (
              <ValidatedField icon={<Instagram size={14} />} placeholder="@yourhandle" value={form.contactDetail} onChange={(v) => set("contactDetail", v)} isValidFn={isValidHandle} errorMsg="Enter a valid Instagram handle." />
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <SectionLabel>Your vehicle</SectionLabel>
            <div className="grid grid-cols-2 gap-3">
              <Select placeholder="Year" value={form.year} onChange={(v) => { set("year", v); set("model", ""); set("customModel", ""); }} options={YEARS.map(String)} />
              <Select placeholder="Color" value={form.color} onChange={(v) => set("color", v)} options={COLORS} />
              <Select placeholder="Make" value={form.make} onChange={(v) => { set("make", v); set("model", ""); set("customModel", ""); }} options={[...MAKES, OTHER_OPTION]} />
              {!usingCustomMake && (
                <Select placeholder={!form.year ? "Pick a year first" : modelsLoading ? "Loading models…" : "Model"} value={form.model} onChange={(v) => set("model", v)}
                  options={[...modelOptions, OTHER_OPTION]} disabled={!form.make || !form.year || modelsLoading} />
              )}
            </div>
            {form.color === "Other" && <ValidatedField placeholder="Describe the color" value={form.colorOther} onChange={(v) => set("colorOther", v)} isValidFn={isValidFreeText} errorMsg="Enter a color." maxLength={30} />}
            {usingCustomMake && (
              <div className="space-y-2 pt-1">
                <ValidatedField placeholder="Enter your car's make" value={form.customMake} onChange={(v) => set("customMake", v)} isValidFn={isValidFreeText} errorMsg="Enter a valid make." maxLength={40} />
                <ValidatedField placeholder="Enter your car's model" value={form.customModel} onChange={(v) => set("customModel", v)} isValidFn={isValidFreeText} errorMsg="Enter a valid model." maxLength={40} />
              </div>
            )}
            {!usingCustomMake && form.model === OTHER_OPTION && (
              <ValidatedField placeholder="Enter your car's model" value={form.customModel} onChange={(v) => set("customModel", v)} isValidFn={isValidFreeText} errorMsg="Enter a valid model." maxLength={40} />
            )}
            <div className="text-[11px] flex items-center gap-1" style={{ color: C.mute }}>
              <AlertCircle size={12} /> Models load live, matched to the exact year you picked — pick "{OTHER_OPTION}" if yours isn't listed.
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <SectionLabel>Exterior (optional)</SectionLabel>
              {renderServiceGroup(EXTERIOR_SERVICES, form.exteriorType, (id) => set("exteriorType", id))}
            </div>
            <div>
              <SectionLabel>Interior (optional)</SectionLabel>
              {renderServiceGroup(INTERIOR_SERVICES, form.interiorType, (id) => set("interiorType", id))}
              <div className="text-[11px] mt-2 italic" style={{ color: C.mute }}>*Prices can vary depending on condition and size. Pick one from each side to combine an exterior wash with an interior detail — at least one is required.</div>
            </div>
            <div>
              <SectionLabel>Where should we wash your car?</SectionLabel>
              <div className="space-y-3">
                <button onClick={() => set("serviceLocation", "here")} className="w-full text-left p-4 rounded-2xl flex items-center justify-between transition-colors c4rd-glow-card"
                  style={{ backgroundColor: form.serviceLocation === "here" ? C.purpleDeep : C.chip, border: `2px solid ${form.serviceLocation === "here" ? C.purple : C.panelBorder}` }}>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} color={form.serviceLocation === "here" ? "#fff" : C.mute} />
                    <div>
                      <div className="text-base font-bold" style={{ color: "#fff" }}>At our location</div>
                      <div className="text-xs mt-0.5" style={{ color: form.serviceLocation === "here" ? "#E9E2F7" : C.mute }}>Included — bring your car to us</div>
                    </div>
                  </div>
                  {form.serviceLocation === "here" && <Check size={18} color="#fff" />}
                </button>
                <button onClick={() => set("serviceLocation", "mobile")} className="w-full text-left p-4 rounded-2xl flex items-center justify-between transition-colors c4rd-glow-card"
                  style={{ backgroundColor: form.serviceLocation === "mobile" ? C.purpleDeep : C.chip, border: `2px solid ${form.serviceLocation === "mobile" ? C.purple : C.panelBorder}` }}>
                  <div className="flex items-center gap-3">
                    <Car size={18} color={form.serviceLocation === "mobile" ? "#fff" : C.mute} />
                    <div>
                      <div className="text-base font-bold" style={{ color: "#fff" }}>Mobile — we come to you</div>
                      <div className="text-xs mt-0.5" style={{ color: form.serviceLocation === "mobile" ? "#E9E2F7" : C.mute }}>+${MOBILE_FEE} flat + ${MOBILE_PER_MILE}/mile driven</div>
                    </div>
                  </div>
                  {form.serviceLocation === "mobile" && <Check size={18} color="#fff" />}
                </button>
              </div>
              {form.serviceLocation === "mobile" && (
                <div className="space-y-2 pt-2">
                  <ValidatedField placeholder="Your address" value={form.mobileAddress} onChange={(v) => set("mobileAddress", v)} isValidFn={isValidFreeText} errorMsg="Enter the address you'd like us to come to." maxLength={80} />
                  <div className="text-[11px] flex items-center gap-1" style={{ color: C.mute }}>
                    <AlertCircle size={12} /> Mileage is calculated from our location and confirmed with you before your appointment is locked in.
                  </div>
                </div>
              )}
            </div>
            <HintBox>
              If you plan to drop off your car, please have a ride home — everything except the Basic Wash takes about 1–3 hours depending on your package. We can hold onto a dropped-off car, but that adds some time to your wash.
            </HintBox>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-3">
              <SectionLabel>Any modifications?</SectionLabel>
              <div className="flex gap-2">
                {[["yes", true], ["no", false]].map(([label, val]) => (
                  <button key={label} onClick={() => set("hasMods", val)} className="flex-1 py-2 rounded font-bold text-sm uppercase transition-colors"
                    style={{ backgroundColor: form.hasMods === val ? C.purple : C.chip, color: form.hasMods === val ? "#fff" : C.mute, border: `1px solid ${form.hasMods === val ? C.purple : C.panelBorder}` }}>
                    {label}
                  </button>
                ))}
              </div>
              {form.hasMods === true && (
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap gap-2">
                    {MODS.map((m) => (
                      <button key={m} onClick={() => toggleIn("modsList", m)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                        style={{ backgroundColor: form.modsList.includes(m) ? C.blue : C.chip, color: form.modsList.includes(m) ? "#fff" : C.mute, border: `1px solid ${form.modsList.includes(m) ? C.blue : C.panelBorder}` }}>
                        {m}
                      </button>
                    ))}
                  </div>
                  <TextArea placeholder="Details on mods (ride height, sensitive panels, etc.)" value={form.modsNotes} onChange={(v) => set("modsNotes", v)} rows={2} maxLen={150} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <SectionLabel>Protective coatings on your vehicle?</SectionLabel>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => set("hasCeramicCoating", !form.hasCeramicCoating)} className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors"
                  style={{ backgroundColor: form.hasCeramicCoating ? C.purple : C.chip, color: form.hasCeramicCoating ? "#fff" : C.mute, border: `1px solid ${form.hasCeramicCoating ? C.purple : C.panelBorder}` }}>
                  <ShieldCheck size={14} /> Ceramic Coating {form.hasCeramicCoating && <Check size={14} />}
                </button>
                <button onClick={() => set("hasPPF", !form.hasPPF)} className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors"
                  style={{ backgroundColor: form.hasPPF ? C.purple : C.chip, color: form.hasPPF ? "#fff" : C.mute, border: `1px solid ${form.hasPPF ? C.purple : C.panelBorder}` }}>
                  <ShieldCheck size={14} /> PPF (Paint Protection Film) {form.hasPPF && <Check size={14} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <SectionLabel>What would you like done?</SectionLabel>
            <HintBox>If you have any damages you've noticed on your vehicle, notify us prior to your wash.</HintBox>
            <TextArea placeholder="e.g. Focus on pet hair in the back seat, sap on the hood, don't use armor-all on the dash…" value={form.description} onChange={(v) => set("description", v)} rows={3} maxLen={300} />
            <SectionLabel>Your general availability (optional)</SectionLabel>
            <TextArea placeholder="e.g. Weekday evenings or weekends work best for me" value={form.availabilityNotes} onChange={(v) => set("availabilityNotes", v)} rows={2} maxLen={150} />
            <div className="text-xs flex items-center gap-1" style={{ color: C.mute }}>
              <AlertCircle size={12} /> Appointment times are scheduled by our team — we'll confirm a time with you directly.
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-2">
            <SectionLabel>Review your request</SectionLabel>
            <ReviewRow label="Name" value={`${form.name} · ${form.phone}`} />
            <ReviewRow label="Contact via" value={`${form.contactMethod}${form.contactMethod !== "Phone number" ? " · " + form.contactDetail : ""}`} />
            <ReviewRow label="Vehicle" value={`${form.year} ${finalColor} ${effectiveMake} ${effectiveModel}`} />
            <ReviewRow label="Exterior" value={exteriorService ? `${exteriorService.name} — ${money(exteriorPrice)}` : "None"} />
            <ReviewRow label="Interior" value={interiorService ? `${interiorService.name} — ${money(interiorPrice)}` : "None"} />
            <ReviewRow label="Total" value={money(servicePrice)} />
            <ReviewRow label="Location" value={form.serviceLocation === "mobile" ? `Mobile — ${form.mobileAddress} (+$${MOBILE_FEE} & $${MOBILE_PER_MILE}/mi)` : "At our location"} />
            <ReviewRow label="Mods" value={form.hasMods ? (form.modsList.join(", ") || "Yes (see notes)") : "None"} />
            {(form.hasCeramicCoating || form.hasPPF) && <ReviewRow label="Coatings" value={[form.hasCeramicCoating && "Ceramic Coating", form.hasPPF && "PPF"].filter(Boolean).join(", ")} />}
            {form.description && <ReviewRow label="Notes" value={form.description} />}
            {form.availabilityNotes && <ReviewRow label="Availability" value={form.availabilityNotes} />}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-5 py-4" style={{ borderTop: `1px solid ${C.panelBorder}` }}>
        <button onClick={() => (step === 0 ? onCancel() : setStep((s) => s - 1))} className="flex items-center gap-1 text-sm px-3 py-2 rounded" style={{ color: C.mute }}>
          <ChevronLeft size={16} /> {step === 0 ? "Cancel" : "Back"}
        </button>
        {step < STEP_LABELS.length - 1 ? (
          <button disabled={!canNext()} onClick={() => setStep((s) => s + 1)} className="flex items-center gap-1 text-sm font-bold px-5 py-2.5 rounded-full transition-transform hover:scale-105 active:scale-95 c4rd-glow-btn"
            style={{ backgroundColor: canNext() ? C.purple : C.chipAlt, color: canNext() ? "#fff" : C.mute }}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={() => onSubmit({ ...form, color: finalColor, make: effectiveMake, model: effectiveModel, contactDetail: effectiveContactDetail, totalPrice: servicePrice, exteriorType: form.exteriorType, interiorType: form.interiorType })}
            className="flex items-center gap-1 text-sm font-bold px-5 py-2.5 rounded-full transition-transform hover:scale-105 active:scale-95 c4rd-glow-btn" style={{ backgroundColor: C.green, color: "#fff" }}>
            Send request <Send size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- top bar + account menu + side menu ----------
function AccountMenu({ session, onNav, onLogout }) {
  const [open, setOpen] = useState(false);
  const [confirmingOut, setConfirmingOut] = useState(false);
  const label = session.displayName || session.name || "Account";

  return (
    <div className="relative">
      <button onClick={() => { setOpen((o) => !o); setConfirmingOut(false); }} title="My Account"
        className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: C.chip, border: `1px solid ${C.panelBorder}` }}>
        {session.avatarDataUrl ? <img src={session.avatarDataUrl} alt="" className="w-full h-full object-cover" /> : <User size={16} color={C.mute} />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 w-60 rounded-md z-50 p-2 c4rd-dissolve"
            style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}`, boxShadow: "0 14px 30px rgba(0,0,0,0.35)" }}>
            <div className="px-2 py-2 mb-1 flex items-center gap-2" style={{ borderBottom: `1px solid ${C.panelBorder}` }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden shrink-0" style={{ backgroundColor: C.chip }}>
                {session.avatarDataUrl ? <img src={session.avatarDataUrl} alt="" className="w-full h-full object-cover" /> : <User size={14} color={C.mute} />}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold truncate" style={{ color: C.text }}>{label}</div>
                <div className="text-[11px] truncate" style={{ color: C.mute }}>{session.username ? `@${session.username}` : "Guest"}</div>
              </div>
            </div>
            {!confirmingOut ? (
              <>
                <button onClick={() => { setOpen(false); onNav("customize"); }} className="w-full text-left flex items-center gap-2 px-2 py-2 rounded text-sm font-medium transition-colors hover:bg-white/5" style={{ color: C.text }}>
                  <Settings2 size={14} /> Customize
                </button>
                <button onClick={() => { setOpen(false); onNav("editProfile"); }} className="w-full text-left flex items-center gap-2 px-2 py-2 rounded text-sm font-medium transition-colors hover:bg-white/5" style={{ color: C.text }}>
                  <User size={14} /> Edit Profile
                </button>
                <button onClick={() => { setOpen(false); onNav(session.type === "staff" ? "garage" : "requests"); }} className="w-full text-left flex items-center gap-2 px-2 py-2 rounded text-sm font-medium transition-colors hover:bg-white/5" style={{ color: C.text }}>
                  {session.type === "staff" ? <Users size={14} /> : <ClipboardList size={14} />} {session.type === "staff" ? "Your Garage" : "Appointments"}
                </button>
                <div className="my-1" style={{ borderTop: `1px solid ${C.panelBorder}` }} />
                <button onClick={() => setConfirmingOut(true)} className="w-full text-left flex items-center gap-2 px-2 py-2 rounded text-sm font-medium transition-colors hover:bg-white/5" style={{ color: C.red }}>
                  <LogOut size={14} /> Log out
                </button>
              </>
            ) : (
              <div className="p-2">
                <div className="text-sm font-bold mb-2" style={{ color: C.text }}>Are you sure?</div>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmingOut(false)} className="flex-1 py-2 rounded text-xs font-bold" style={{ backgroundColor: C.chip, color: C.text }}>Exit</button>
                  <button onClick={() => { setOpen(false); onLogout(); }} className="flex-1 py-2 rounded text-xs font-bold" style={{ backgroundColor: C.red, color: "#fff" }}>Continue</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function TopBar({ onMenu, onLogo, session, onNav, onLogin, onLogout, onSchedule }) {
  return (
    <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="w-9 h-9 rounded flex items-center justify-center transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <Menu size={18} color={C.text} />
        </button>
        <button onClick={onLogo} className="flex items-center gap-2">
          <WDBadge size={40} fontSize={14} />
          <div className="text-left hidden sm:block">
            <div className="font-black uppercase tracking-tight leading-none" style={{ color: C.text }}>Wiffed_ <span style={{ color: C.purple }}>Detailing</span></div>
            <div className="text-[10px] font-mono" style={{ color: C.mute }}>detailing studio · booking</div>
          </div>
        </button>
      </div>
      <div className="flex items-center gap-2">
        {session ? (
          <AccountMenu session={session} onNav={onNav} onLogout={onLogout} />
        ) : (
          <button onClick={onLogin} title="Log in" className="w-9 h-9 rounded-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
            <LogIn size={16} color={C.text} />
          </button>
        )}
        <button onClick={onSchedule} className="flex items-center gap-1 px-3 py-2 rounded text-xs font-bold uppercase transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: C.purple, color: "#fff" }}>
          <Plus size={14} /> Schedule Now
        </button>
      </div>
    </div>
  );
}

function MenuDrawer({ open, onClose, onNav, session }) {
  if (!open) return null;
  const items = [
    { key: "about", label: "About", icon: <Info size={16} /> },
    { key: "team", label: "Our Team", icon: <Users size={16} /> },
    { key: "reviews", label: "Reviews", icon: <Star size={16} /> },
    { key: "merch", label: "Merch", icon: <ShoppingBag size={16} /> },
    { key: "linktree", label: "Link Tree", icon: <Link2 size={16} /> },
    { key: "messages", label: "Messages", icon: <MessageCircle size={16} /> },
    { key: "support", label: "Support Us", icon: <Heart size={16} /> },
  ];
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div className="relative w-72 h-full p-4 flex flex-col c4rd-fade" style={{ backgroundColor: C.panel, borderRight: `1px solid ${C.panelBorder}` }}>
        <div className="flex items-center justify-between mb-6">
          <span className="font-black uppercase tracking-tight" style={{ color: C.text }}>Menu</span>
          <button onClick={onClose}><X size={18} color={C.mute} /></button>
        </div>
        <button onClick={() => onNav("home")} className="flex items-center gap-2 text-left px-3 py-3 rounded text-sm font-bold mb-1 transition-colors hover:bg-white/5" style={{ backgroundColor: C.chip, color: C.text }}>
          <HomeIcon size={16} /> Home
        </button>
        {items.map((it) => (
          <button key={it.key} onClick={() => onNav(it.key)} className="flex items-center gap-2 text-left px-3 py-3 rounded text-sm font-bold mb-1 transition-colors hover:bg-white/5" style={{ backgroundColor: C.chip, color: C.text }}>
            {it.icon} {it.label}
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => onNav(session ? (session.type === "staff" ? "garage" : "requests") : "login")}
          className="flex items-center gap-2 text-left px-3 py-3 rounded text-sm font-bold transition-transform hover:scale-[1.02]" style={{ backgroundColor: C.purple, color: "#fff" }}>
          {session ? (session.type === "staff" ? <><Users size={16} /> Your Garage</> : <><ClipboardList size={16} /> My Requests</>) : <><LogIn size={16} /> Login</>}
        </button>
      </div>
    </div>
  );
}

// ---------- WD monogram badge + hero ----------
function WDBadge({ size = 40, fontSize = 14, ring = 1 }) {
  return (
    <div className="rounded-full flex items-center justify-center shrink-0" style={{ width: size, height: size, backgroundColor: C.input, border: `${ring}px solid ${C.purple}` }}>
      <span className="font-black" style={{ fontSize }}>
        <span style={{ color: C.silver }}>W</span><span style={{ color: C.purple }}>D</span>
      </span>
    </div>
  );
}
function Sparkle({ top, left, delay, size = 10 }) {
  return (
    <div className="absolute c4rd-twinkle" style={{ top, left, animationDelay: delay }}>
      <Star size={size} color={C.purple} fill={C.purple} />
    </div>
  );
}
function WDHero() {
  return (
    <div className="relative flex justify-center items-center c4rd-fade" style={{ height: 130 }}>
      <Sparkle top="4%" left="20%" delay="0s" size={13} />
      <Sparkle top="70%" left="14%" delay="0.7s" size={9} />
      <Sparkle top="8%" left="78%" delay="1.2s" size={11} />
      <Sparkle top="76%" left="80%" delay="0.35s" size={8} />
      <div className="rounded-full flex items-center justify-center c4rd-shine-ring" style={{ width: 104, height: 104, backgroundColor: C.input, border: `3px solid ${C.purple}` }}>
        <span className="font-black" style={{ fontSize: 32 }}>
          <span style={{ color: C.silver }}>W</span><span style={{ color: C.purple }}>D</span>
        </span>
      </div>
    </div>
  );
}

// ---------- home ----------
function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-md p-4 c4rd-lift" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: C.purpleDeep }}>{icon}</div>
      <div className="text-sm font-bold" style={{ color: C.text }}>{title}</div>
      <div className="text-xs mt-1" style={{ color: C.mute }}>{text}</div>
    </div>
  );
}

function HomeScreen({ session, onSchedule, onNav }) {
  return (
    <div className="max-w-2xl mx-auto space-y-10 pb-10">
      <div className="rounded-3xl p-8 text-center" style={{ backgroundColor: C.panel, backgroundImage: `radial-gradient(circle at 50% 0%, ${C.purpleDeep}33, transparent 60%)`, border: `1px solid ${C.panelBorder}` }}>
        <WDHero />
        <div className="font-black text-2xl uppercase tracking-tight mt-4" style={{ color: C.text }}>Wiffed_ Detailing</div>
        <div className="text-sm mt-3" style={{ color: C.mute, lineHeight: 2 }}>Car wash &amp; detailing at our place — with a mobile option if you'd rather we come to you.</div>

        {session ? (
          <button onClick={onSchedule} className="c4rd-sheen c4rd-glow-btn mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase transition-transform hover:scale-[1.02] active:scale-95" style={{ backgroundColor: C.purple, color: "#fff" }}>
            <Plus size={16} /> Schedule Now
          </button>
        ) : (
          <>
            <button onClick={() => onNav("signup")} className="c4rd-sheen c4rd-glow-btn mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm uppercase transition-transform hover:scale-[1.02] active:scale-95" style={{ backgroundColor: C.purple, color: "#fff" }}>
              <UserPlus size={16} /> Create an account
            </button>
            <button onClick={() => onNav("login")} className="mt-4 text-sm font-bold underline" style={{ color: C.mute }}>
              Already have an account?
            </button>
            <div className="text-[11px] mt-4" style={{ color: C.mute, lineHeight: 1.8 }}>Log in or create an account to schedule a wash.</div>
          </>
        )}
      </div>

      <div>
        <SectionLabel>Why Wiffed_</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FeatureCard icon={<MapPin size={16} color="#fff" />} title="Drop-off based" text="We wash at our own location — mobile service is available for a fee if you need us to come to you." />
          <FeatureCard icon={<ShieldCheck size={16} color="#fff" />} title="Professional-grade" text="Koch-Chemie and P&S chemicals, applied with a proper foam cannon setup — not gas-station wash soap." />
          <FeatureCard icon={<MessageCircle size={16} color="#fff" />} title="Real communication" text="Chat directly with whoever accepts your job." />
        </div>
      </div>

      <div>
        <SectionLabel>About us</SectionLabel>
        <p className="text-base" style={{ color: C.text, lineHeight: 2 }}>
          Wiffed_ Detailing isn't a mobile-only outfit — most washes happen at our own location,
          where we run the full lineup of exterior and interior packages, from a quick basic
          wash to a full combo detail. Every request goes through our team so we can confirm
          a time that actually fits before anything's locked in.
        </p>
        <p className="text-base mt-4" style={{ color: C.text, lineHeight: 2 }}>
          We run on professional-grade Koch-Chemie and P&amp;S products with a proper foam
          cannon setup, not whatever's cheapest — the same standard whether it's a quick wash
          or a full detail.
        </p>
        <button onClick={() => onNav("about")} className="mt-4 flex items-center gap-1 text-sm font-bold" style={{ color: C.purple }}>
          Read more <ArrowRight size={14} />
        </button>
      </div>

      <ServicesSection />

      <div className="rounded-3xl p-6 c4rd-lift c4rd-glow-card" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <div className="flex items-center justify-between mb-1">
          <SectionLabel>Reviews</SectionLabel>
          <button onClick={() => onNav("reviews")} className="text-xs font-bold flex items-center gap-1" style={{ color: C.purple }}>See all <ArrowRight size={12} /></button>
        </div>
        <div className="text-sm" style={{ color: C.mute, lineHeight: 1.8 }}>See what customers are saying, or leave your own.</div>
      </div>

      <div className="rounded-3xl p-6 flex items-center justify-between flex-wrap gap-3 c4rd-lift c4rd-glow-card" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <div>
          <SectionLabel>Follow / Contact</SectionLabel>
          <div className="text-sm" style={{ color: C.text }}>{PHONE_DISPLAY} · {INSTAGRAM_HANDLE}</div>
        </div>
        <button onClick={() => onNav("linktree")} className="flex items-center gap-1 text-sm font-bold px-4 py-2.5 rounded-full transition-transform hover:scale-105 active:scale-95 c4rd-glow-btn" style={{ backgroundColor: C.purple, color: "#fff" }}>
          <Link2 size={14} /> Link Tree
        </button>
      </div>
    </div>
  );
}

function AboutScreen() {
  return (
    <div className="max-w-lg mx-auto space-y-4 c4rd-fade">
      <div className="rounded-md p-5" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <SectionLabel>About Wiffed_ Detailing</SectionLabel>
        <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: C.purple }}>Clean. Correct. Protect.</p>
        <p className="text-sm leading-relaxed" style={{ color: C.text }}>
          Wiffed_ Detailing isn't a mobile-only outfit — most washes happen at our own location,
          where we run the full lineup of exterior and interior packages, from a quick basic
          wash to a full combo detail. Every request goes through our team so we can confirm
          a time that actually fits our schedule and yours.
        </p>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: C.text }}>
          Need us to come to you instead? We offer a mobile wash for a ${MOBILE_FEE} flat fee
          plus ${MOBILE_PER_MILE} per mile we have to drive, confirmed with you before your
          appointment is locked in.
        </p>
        <p className="text-sm mt-3 leading-relaxed" style={{ color: C.text }}>
          We pay close attention to modified vehicles, ceramic coatings, and PPF — tell us
          what's on your car up front and we'll treat it accordingly.
        </p>
        <p className="text-sm mt-3" style={{ color: C.mute }}>Have questions before booking? Use the Messages tab to reach our team directly.</p>
      </div>
    </div>
  );
}

function TeamScreen({ workers }) {
  return (
    <div className="max-w-lg mx-auto space-y-4 c4rd-fade">
      <SectionLabel>Our Team</SectionLabel>
      {workers.length === 0 && (
        <div className="rounded-md p-8 text-center" style={{ backgroundColor: C.panel, border: `1px dashed ${C.panelBorder}` }}>
          <Users size={26} color={C.mute} className="mx-auto mb-2" />
          <div className="text-sm" style={{ color: C.mute }}>Our team will show up here once added.</div>
        </div>
      )}
      {workers.map((w) => (
        <div key={w.id} className="flex items-center gap-3 p-4 rounded-md c4rd-lift" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg overflow-hidden" style={{ backgroundColor: C.purpleDeep, color: "#fff", border: `2px solid ${C.purple}` }}>
            {w.avatarDataUrl ? <img src={w.avatarDataUrl} alt="" className="w-full h-full object-cover" /> : (w.displayName || w.name).charAt(0)}
          </div>
          <div>
            <div className="font-bold" style={{ color: C.text }}>{w.displayName || w.name}</div>
            {w.role && <div className="text-xs" style={{ color: C.mute }}>{w.role}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function MerchScreen() {
  return (
    <div className="max-w-lg mx-auto c4rd-fade">
      <div className="rounded-md p-10 text-center" style={{ backgroundColor: C.panel, border: `1px dashed ${C.panelBorder}` }}>
        <ShoppingBag size={32} color={C.purple} className="mx-auto mb-3" />
        <div className="font-black text-lg uppercase tracking-tight" style={{ color: C.text }}>Merch</div>
        <div className="text-sm mt-2" style={{ color: C.mute }}>Coming soon — we're working on some Wiffed_ gear. Check back later.</div>
      </div>
    </div>
  );
}

const DONATION_GOAL = 5000;
function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard permission unavailable — the value is still shown on screen to copy by hand
    }
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold shrink-0 transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: copied ? C.green : C.purple, color: "#fff" }}>
      {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
    </button>
  );
}
function SupportUsScreen() {
  const raised = 0; // no real payment processing yet — kept honest at $0 until donations actually go live
  const pct = Math.min(100, Math.round((raised / DONATION_GOAL) * 100));
  const zelleReady = ZELLE_CONTACT.trim().length > 0;
  return (
    <div className="max-w-lg mx-auto c4rd-fade">
      <div className="rounded-md p-8 text-center" style={{ backgroundColor: C.panel, border: `1px dashed ${C.panelBorder}` }}>
        <Heart size={32} color={C.purple} className="mx-auto mb-3" />
        <div className="font-black text-lg uppercase tracking-tight" style={{ color: C.text }}>Support Us</div>
        <div className="text-sm mt-2" style={{ color: C.mute }}>Help us hit our goal to fully build out Wiffed_ Detailing — equipment, supplies, and room to grow.</div>

        <div className="mt-6 text-left">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="font-black text-xl" style={{ color: C.text }}>${raised.toLocaleString()}</span>
            <span className="text-xs font-bold" style={{ color: C.mute }}>of ${DONATION_GOAL.toLocaleString()} goal</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: C.chipAlt }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: C.purple, transition: "width 0.6s ease" }} />
          </div>
          <div className="text-[11px] mt-1" style={{ color: C.mute }}>{pct}% funded</div>
        </div>

        {zelleReady ? (
          <div className="mt-6 p-4 rounded-md text-left" style={{ backgroundColor: C.chip, border: `1px solid ${C.panelBorder}` }}>
            <div className="text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: C.mute }}><Heart size={12} color={C.purple} /> Donate via Zelle</div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold" style={{ color: C.text }}>{ZELLE_CONTACT}</span>
              <CopyButton value={ZELLE_CONTACT} />
            </div>
            <div className="text-[11px] mt-2" style={{ color: C.mute }}>Open your banking app, choose Zelle, and send to the info above — no fees on either end.</div>
          </div>
        ) : (
          <>
            <div className="text-xs mt-6" style={{ color: C.mute }}>Donations aren't set up yet — we're setting up Zelle so you can support us with zero fees. Check back soon.</div>
            <button disabled className="mt-4 px-6 py-3 rounded font-bold text-sm uppercase" style={{ backgroundColor: C.chipAlt, color: C.mute, cursor: "not-allowed" }}>
              Donate — Coming Soon
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LinkTreeScreen() {
  return (
    <div className="max-w-sm mx-auto space-y-4 text-center c4rd-fade">
      <div className="mx-auto" style={{ width: "fit-content" }}>
        <WDBadge size={64} fontSize={22} ring={2} />
      </div>
      <div className="font-black uppercase tracking-tight" style={{ color: C.text }}>Wiffed_ Detailing</div>
      <a href={`tel:${PHONE_TEL}`} className="flex items-center justify-center gap-2 p-4 rounded-md font-bold text-sm c4rd-lift transition-transform hover:scale-[1.02]" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}`, color: C.text }}>
        <Phone size={16} color={C.purple} /> {PHONE_DISPLAY}
      </a>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-4 rounded-md font-bold text-sm c4rd-lift transition-transform hover:scale-[1.02]" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}`, color: C.text }}>
        <Instagram size={16} color={C.purple} /> {INSTAGRAM_HANDLE}
      </a>
    </div>
  );
}

// ---------- customize (theme + performance) ----------
function CustomizeScreen({ theme, setTheme, performanceMode, setPerformanceMode, onBack }) {
  return (
    <div className="max-w-md mx-auto space-y-4 c4rd-fade">
      <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back</button>
      <SectionLabel>Customize</SectionLabel>
      <div className="rounded-md p-5 space-y-3" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <div className="text-sm font-bold" style={{ color: C.text }}>Appearance</div>
        <div className="flex gap-2">
          {[["dark", "Dark"], ["light", "Light"]].map(([key, label]) => (
            <button key={key} onClick={() => setTheme(key)} className="flex-1 py-3 rounded font-bold text-sm uppercase transition-colors"
              style={{ backgroundColor: theme === key ? C.purple : C.chip, color: theme === key ? "#fff" : C.mute }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-md p-5" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold" style={{ color: C.text }}>Performance mode</div>
            <div className="text-xs mt-0.5" style={{ color: C.mute }}>Turns off animations and glow effects — smoother on older devices or slow connections.</div>
          </div>
          <button onClick={() => setPerformanceMode((p) => !p)} className="w-12 h-7 rounded-full relative shrink-0 transition-colors" style={{ backgroundColor: performanceMode ? C.purple : C.chipAlt }}>
            <div className="w-5 h-5 rounded-full absolute top-1 transition-all" style={{ backgroundColor: "#fff", left: performanceMode ? 26 : 4 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- edit profile ----------
function EditProfileScreen({ session, onSave, onBack }) {
  const [displayName, setDisplayName] = useState(session.displayName || session.name || "");
  const [avatarDataUrl, setAvatarDataUrl] = useState(session.avatarDataUrl || "");
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarDataUrl(reader.result);
    reader.readAsDataURL(file);
  };
  const nameOk = isValidDisplayName(displayName);

  return (
    <div className="max-w-md mx-auto space-y-4 c4rd-fade">
      <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back</button>
      <div className="rounded-md p-6 space-y-4 text-center" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <div className="w-24 h-24 rounded-full mx-auto overflow-hidden flex items-center justify-center" style={{ backgroundColor: C.chip, border: `2px solid ${C.purple}` }}>
          {avatarDataUrl ? <img src={avatarDataUrl} alt="" className="w-full h-full object-cover" /> : <User size={36} color={C.mute} />}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <div className="flex justify-center gap-4">
          <button onClick={() => fileRef.current?.click()} className="text-sm font-bold underline" style={{ color: C.purple }}>Change photo</button>
          {avatarDataUrl && <button onClick={() => setAvatarDataUrl("")} className="text-sm underline" style={{ color: C.mute }}>Remove</button>}
        </div>
        <div className="text-left">
          <SectionLabel>Display name</SectionLabel>
          <ValidatedField icon={<User size={14} />} placeholder="How you'll appear on reviews & chat" value={displayName} onChange={setDisplayName} isValidFn={isValidDisplayName} errorMsg="2-30 characters, keep it respectful." maxLength={30} />
        </div>
        {session.type === "guest" && <div className="text-[11px]" style={{ color: C.mute }}>You're browsing as a guest, so this only applies to your current visit.</div>}
        <button disabled={!nameOk} onClick={() => onSave({ displayName: displayName.trim(), avatarDataUrl })} className="w-full py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: nameOk ? C.purple : C.chipAlt, color: "#fff" }}>
          Save changes
        </button>
      </div>
    </div>
  );
}

// ---------- reviews ----------
function StarRow({ value, onChange, size = 20 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange && onChange(n)} disabled={!onChange} style={{ cursor: onChange ? "pointer" : "default" }}>
          <Star size={size} color={C.purple} fill={n <= value ? C.purple : "none"} />
        </button>
      ))}
    </div>
  );
}
function ReviewsScreen({ reviews, setReviews, session }) {
  const [name, setName] = useState(session?.displayName || session?.name || "");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [posted, setPosted] = useState(false);
  const canPost = isValidName(name) && rating > 0 && text.trim().length >= 5 && isClean(text);
  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  const submit = () => {
    const r = { id: `rev-${Date.now()}`, name: name.trim(), rating, text: text.trim(), createdAt: new Date().toISOString() };
    const next = [r, ...reviews];
    setReviews(next);
    saveKey("reviews", next);
    setPosted(true); setRating(0); setText("");
  };

  return (
    <div className="max-w-lg mx-auto space-y-4 c4rd-fade">
      <div className="rounded-md p-5" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <SectionLabel>Leave a review</SectionLabel>
        {posted && <div className="text-xs mb-2" style={{ color: C.green }}>Thanks — your review is posted below, publicly visible.</div>}
        <ValidatedField icon={<User size={14} />} placeholder="Your name" value={name} onChange={setName} isValidFn={isValidName} errorMsg="Enter your full name (first and last, letters only)." maxLength={50} />
        <div className="py-2"><StarRow value={rating} onChange={setRating} /></div>
        <TextArea placeholder="How was your wash?" value={text} onChange={setText} rows={3} maxLen={400} />
        <button disabled={!canPost} onClick={submit} className="mt-3 w-full py-2.5 rounded font-bold text-sm transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: canPost ? C.purple : C.chipAlt, color: "#fff" }}>
          Post review
        </button>
      </div>
      <div>
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>What people are saying</SectionLabel>
          {avg && <div className="flex items-center gap-1 text-sm font-bold" style={{ color: C.text }}><Star size={14} color={C.purple} fill={C.purple} /> {avg} · {reviews.length}</div>}
        </div>
        {reviews.length === 0 && <div className="text-sm text-center py-8" style={{ color: C.mute }}>No reviews yet — be the first.</div>}
        {reviews.map((r) => (
          <div key={r.id} className="p-4 rounded-md mb-2 c4rd-lift" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm" style={{ color: C.text }}>{r.name}</span>
              <StarRow value={r.rating} size={13} />
            </div>
            <div className="text-sm mt-1" style={{ color: C.mute }}>{r.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- signup (progressive reveal boxes) ----------
function SignupBox({ show, confirmed, label, value, children, onConfirm, confirmLabel, confirmDisabled }) {
  if (!show) return null;
  return (
    <div className="c4rd-dissolve rounded-md p-6" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }} key={confirmed ? "done" : "open"}>
      {confirmed ? (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: C.mute }}>{label}</div>
            <div className="font-bold text-sm mt-0.5" style={{ color: C.text }}>{value}</div>
          </div>
          <CheckCircle2 size={20} color={C.green} />
        </div>
      ) : (
        <div className="space-y-3">
          <SectionLabel>{label}</SectionLabel>
          {children}
          <div className="flex justify-center pt-2">
            <button disabled={confirmDisabled} onClick={onConfirm}
              className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-wide transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: confirmDisabled ? C.chipAlt : C.purple, color: confirmDisabled ? C.mute : "#fff" }}>
              {confirmLabel || "Confirm"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SignupScreen({ clientAccounts, onCreateAccount, onCancel }) {
  const [boxIndex, setBoxIndex] = useState(0);
  const [name, setName] = useState("");
  const [contactType, setContactType] = useState(""); // "phone" | "email"
  const [contactValue, setContactValue] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const usernameTaken = clientAccounts.some((a) => a.username.toLowerCase() === username.trim().toLowerCase());
  const contactValid = contactType === "phone" ? isValidPhone(contactValue) : contactType === "email" ? isValidEmail(contactValue) : false;
  const contactSummary = contactType === "phone" ? contactValue : contactType === "email" ? contactValue : "";

  return (
    <div className="max-w-md mx-auto space-y-4 c4rd-fade">
      <button onClick={onCancel} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back</button>
      <SectionLabel>Create your account</SectionLabel>

      <SignupBox show={boxIndex >= 0} confirmed={boxIndex > 0} label="Full name" value={name}
        confirmDisabled={!isValidName(name)} onConfirm={() => setBoxIndex(1)}>
        <ValidatedField icon={<User size={14} />} placeholder="Full name" value={name} onChange={setName} isValidFn={isValidName} errorMsg="Enter your full name (first and last, letters only — no odd or vulgar names)." maxLength={50} />
      </SignupBox>

      <SignupBox show={boxIndex >= 1} confirmed={boxIndex > 1} label="Contact info" value={contactSummary}
        confirmDisabled={!contactValid} onConfirm={() => setBoxIndex(2)}>
        <div className="flex gap-2">
          {[["phone", "Phone number"], ["email", "Email address"]].map(([key, label]) => (
            <button key={key} onClick={() => { setContactType(key); setContactValue(""); }} className="flex-1 py-2 rounded text-xs font-bold uppercase transition-colors"
              style={{ backgroundColor: contactType === key ? C.purple : C.chip, color: contactType === key ? "#fff" : C.mute, border: `1px solid ${contactType === key ? C.purple : C.panelBorder}` }}>
              {label}
            </button>
          ))}
        </div>
        {contactType === "phone" && (
          <ValidatedField icon={<Phone size={14} />} placeholder="Phone number" value={contactValue} onChange={setContactValue} isValidFn={isValidPhone} errorMsg="Enter a valid 10-digit phone number." inputMode="numeric" format={formatPhone} />
        )}
        {contactType === "email" && (
          <ValidatedField icon={<Send size={14} />} placeholder="Email address" value={contactValue} onChange={setContactValue} isValidFn={isValidEmail} errorMsg="Enter a valid email address." />
        )}
        {contactType === "email" && (
          <div className="text-[11px]" style={{ color: C.mute }}>We'll use this for booking confirmations, and — if we start sending them — news and special deals.</div>
        )}
      </SignupBox>

      <SignupBox show={boxIndex >= 2} confirmed={boxIndex > 2} label="Username" value={`@${username}`}
        confirmDisabled={!isValidUsername(username) || usernameTaken} onConfirm={() => setBoxIndex(3)}>
        <ValidatedField icon={<User size={14} />} placeholder="Username" value={username} onChange={setUsername} isValidFn={isValidUsername} errorMsg="4+ characters, letters and numbers only, no symbols." maxLength={20} />
        {isValidUsername(username) && usernameTaken && <div className="text-[11px]" style={{ color: C.red }}>That username is already taken.</div>}
      </SignupBox>

      <SignupBox show={boxIndex >= 3} confirmed={false} label="Password" value=""
        confirmLabel="Create Account"
        confirmDisabled={!isValidStrongPassword(password) || password !== confirmPassword}
        onConfirm={() => onCreateAccount({
          name, username, password,
          phone: contactType === "phone" ? formatPhone(contactValue) : "",
          email: contactType === "email" ? contactValue.trim() : "",
        })}>
        <PasswordField placeholder="Password" value={password} onChange={setPassword} />
        <PasswordField placeholder="Confirm password" value={confirmPassword} onChange={setConfirmPassword} />
        {confirmPassword && password !== confirmPassword && <div className="text-[11px]" style={{ color: C.red }}>Passwords don't match.</div>}
        <PasswordChecklist password={password} />
      </SignupBox>
    </div>
  );
}

// ---------- login hub + guest + forgot password ----------
function LoginScreen({ clientAccounts, onCustomerLogin, onNav }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const tryLogin = () => {
    const acct = clientAccounts.find((a) => a.username.toLowerCase() === username.trim().toLowerCase());
    if (acct && acct.password === password) { setError(""); onCustomerLogin(acct); }
    else setError("Incorrect username or password.");
  };

  return (
    <div className="max-w-md mx-auto space-y-4 c4rd-fade">
      <div className="rounded-md p-7 space-y-4" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <SectionLabel>Log in</SectionLabel>
        <Field icon={<User size={14} />} placeholder="Username" value={username} onChange={(v) => { setUsername(v); setError(""); }} />
        <PasswordField placeholder="Password" value={password} onChange={(v) => { setPassword(v); setError(""); }} />
        {error && <div className="text-[11px]" style={{ color: C.red }}>{error}</div>}
        <button disabled={!username || !password} onClick={tryLogin} className="w-full py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02] active:scale-95"
          style={{ backgroundColor: (username && password) ? C.purple : C.chipAlt, color: (username && password) ? "#fff" : C.mute }}>
          Log In
        </button>
      </div>

      <div className="rounded-md p-6 space-y-3 text-center" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <button onClick={() => onNav("signup")} className="w-full py-3 rounded font-bold text-sm uppercase transition-transform hover:scale-[1.02]" style={{ backgroundColor: C.purpleDeep, color: "#fff" }}>
          Create an account
        </button>
        <button onClick={() => onNav("guestLogin")} className="text-sm block w-full pt-1" style={{ color: C.mute }}>Continue as Guest</button>
        <button onClick={() => onNav("forgotPassword")} className="text-xs underline block w-full" style={{ color: C.mute }}>Forgot password?</button>
      </div>

      <div className="text-center pt-2">
        <button onClick={() => onNav("staffLogin")} className="text-xs underline" style={{ color: C.mute }}>Team member? Log in here</button>
      </div>
    </div>
  );
}

function GuestLoginScreen({ onGuestLogin, onBack }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <div className="max-w-md mx-auto space-y-4 c4rd-fade">
      <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back</button>
      <div className="rounded-md p-7 space-y-4" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <SectionLabel>Continue as Guest</SectionLabel>
        <div className="text-xs" style={{ color: C.mute }}>No account needed — we'll just use your name and number to track your requests.</div>
        <ValidatedField icon={<User size={14} />} placeholder="Full name" value={name} onChange={setName} isValidFn={isValidName} errorMsg="Enter your full name (first and last, letters only)." maxLength={50} />
        <ValidatedField icon={<Phone size={14} />} placeholder="Phone number" value={phone} onChange={setPhone} isValidFn={isValidPhone} errorMsg="Enter a valid 10-digit phone number." inputMode="numeric" format={formatPhone} />
        <button disabled={!isValidName(name) || !isValidPhone(phone)} onClick={() => onGuestLogin({ name, phone })} className="w-full py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02] active:scale-95"
          style={{ backgroundColor: (isValidName(name) && isValidPhone(phone)) ? C.purple : C.chipAlt, color: (isValidName(name) && isValidPhone(phone)) ? "#fff" : C.mute }}>
          Continue
        </button>
      </div>
    </div>
  );
}

function ForgotPasswordScreen({ clientAccounts, setClientAccounts, onBack, onRecovered }) {
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const verify = () => {
    const uname = username.trim().toLowerCase();
    const input = contact.trim();
    const looksEmail = input.includes("@");
    const acct = clientAccounts.find((a) => {
      if (a.username.toLowerCase() !== uname) return false;
      return looksEmail ? (a.email && a.email.toLowerCase() === input.toLowerCase()) : a.phone === formatPhone(input);
    });
    if (acct) { setVerified(true); setError(""); }
    else setError("We couldn't match that username with a phone number or email on the account.");
  };
  const submit = () => {
    if (!isValidStrongPassword(newPassword)) return;
    const next = clientAccounts.map((a) => a.username.toLowerCase() === username.trim().toLowerCase() ? { ...a, password: newPassword } : a);
    setClientAccounts(next);
    saveKey("clientAccounts", next);
    onRecovered(next.find((a) => a.username.toLowerCase() === username.trim().toLowerCase()));
  };

  return (
    <div className="max-w-md mx-auto space-y-4 c4rd-fade">
      <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back</button>
      <div className="rounded-md p-7 space-y-4" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <SectionLabel>Reset your password</SectionLabel>
        {!verified ? (
          <>
            <Field icon={<User size={14} />} placeholder="Username" value={username} onChange={(v) => { setUsername(v); setError(""); }} />
            <Field icon={<Phone size={14} />} placeholder="Phone number or email on the account" value={contact} onChange={(v) => { setContact(v); setError(""); }} />
            {error && <div className="text-[11px]" style={{ color: C.red }}>{error}</div>}
            <button disabled={!username || !contact} onClick={verify} className="w-full py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: (username && contact) ? C.purple : C.chipAlt, color: "#fff" }}>
              Verify
            </button>
          </>
        ) : (
          <>
            <PasswordField placeholder="New password" value={newPassword} onChange={setNewPassword} />
            <PasswordChecklist password={newPassword} />
            <button disabled={!isValidStrongPassword(newPassword)} onClick={submit} className="w-full py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: isValidStrongPassword(newPassword) ? C.purple : C.chipAlt, color: "#fff" }}>
              Reset password & log in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function StaffLoginScreen({ workers, setWorkers, onStaffLogin, onBack, onNav }) {
  const bootstrap = workers.length === 0;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const tryLogin = () => {
    const w = workers.find((x) => x.username && x.username.toLowerCase() === username.trim().toLowerCase());
    if (w && w.password === password) { setError(""); onStaffLogin(w); }
    else setError("Incorrect username or password.");
  };
  const bootstrapCreate = () => {
    if (!isValidName(name) || !isValidUsername(newUsername) || !isValidStrongPassword(newPassword)) return;
    const w = { id: `w-${Date.now()}`, name: name.trim(), role: role.trim(), username: newUsername.trim(), password: newPassword };
    const next = [w];
    setWorkers(next);
    saveKey("workers", next);
    onStaffLogin(w);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 c4rd-fade">
      <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back</button>
      <div className="rounded-md p-7 space-y-4" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <SectionLabel>Team login</SectionLabel>
        {bootstrap ? (
          <div className="space-y-3">
            <div className="text-xs" style={{ color: C.mute }}>No team accounts exist yet. Set up the first (owner) account below — after this, team accounts can only be created using a Member Code.</div>
            <ValidatedField icon={<User size={14} />} placeholder="Full name" value={name} onChange={setName} isValidFn={isValidName} errorMsg="Enter your full name (first and last, letters only)." maxLength={50} />
            <ValidatedField icon={<Tag size={14} />} placeholder="Role (e.g. Owner)" value={role} onChange={setRole} isValidFn={(v) => v.length <= 30 && isClean(v)} errorMsg="Keep it short and respectful." maxLength={30} />
            <ValidatedField icon={<User size={14} />} placeholder="Username" value={newUsername} onChange={setNewUsername} isValidFn={isValidUsername} errorMsg="4+ characters, letters and numbers only." maxLength={20} />
            <PasswordField placeholder="Password" value={newPassword} onChange={setNewPassword} />
            <PasswordChecklist password={newPassword} />
            <button disabled={!isValidName(name) || !isValidUsername(newUsername) || !isValidStrongPassword(newPassword)} onClick={bootstrapCreate}
              className="w-full py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02]" style={{ backgroundColor: (isValidName(name) && isValidUsername(newUsername) && isValidStrongPassword(newPassword)) ? C.purple : C.chipAlt, color: "#fff" }}>
              Create account & log in
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <Field icon={<User size={14} />} placeholder="Username" value={username} onChange={(v) => { setUsername(v); setError(""); }} />
            <PasswordField placeholder="Password" value={password} onChange={(v) => { setPassword(v); setError(""); }} />
            {error && <div className="text-[11px]" style={{ color: C.red }}>{error}</div>}
            <button disabled={!username || !password} onClick={tryLogin} className="w-full py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: (username && password) ? C.purple : C.chipAlt, color: (username && password) ? "#fff" : C.mute }}>
              Enter Your Garage
            </button>
            <div className="text-xs text-center pt-1" style={{ color: C.mute }}>Team accounts are created by the business — no self-serve signup.</div>
            <div className="flex gap-2">
              <button onClick={() => onNav("accessRequest")} className="flex-1 text-xs font-bold py-2 rounded" style={{ backgroundColor: C.chip, color: C.text }}>Request access</button>
              <button onClick={() => onNav("redeemCode")} className="flex-1 text-xs font-bold py-2 rounded flex items-center justify-center gap-1" style={{ backgroundColor: C.chip, color: C.text }}><KeyRound size={12} /> Have a code?</button>
            </div>
            <div className="text-[11px] text-center" style={{ color: C.mute }}>Forgot your password? Contact the business directly to have it reset.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function RedeemCodeScreen({ accessRequests, setAccessRequests, workers, setWorkers, onStaffLogin, onBack }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [matched, setMatched] = useState(null);
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const tryRedeem = () => {
    const req = accessRequests.find((r) => r.code && r.code.toUpperCase() === code.trim().toUpperCase());
    if (req) { setMatched(req); setError(""); }
    else setError("That code wasn't recognized — double check with the business.");
  };
  const finish = () => {
    if (!isValidUsername(username) || !isValidStrongPassword(password)) return;
    const w = { id: `w-${Date.now()}`, name: matched.name, role: role.trim(), username: username.trim(), password };
    const nextWorkers = [...workers, w];
    setWorkers(nextWorkers);
    saveKey("workers", nextWorkers);
    const nextRequests = accessRequests.filter((r) => r.id !== matched.id);
    setAccessRequests(nextRequests);
    saveKey("accessRequests", nextRequests);
    onStaffLogin(w);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 c4rd-fade">
      <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back</button>
      <div className="rounded-md p-7 space-y-3" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <SectionLabel>Enter your member code</SectionLabel>
        {!matched ? (
          <>
            <div className="text-xs" style={{ color: C.mute }}>The business gives this to you directly after approving your access request.</div>
            <Field icon={<KeyRound size={14} />} placeholder="6-character code" value={code} onChange={(v) => { setCode(v.toUpperCase()); setError(""); }} maxLength={6} />
            {error && <div className="text-[11px]" style={{ color: C.red }}>{error}</div>}
            <button disabled={!code} onClick={tryRedeem} className="w-full py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02]" style={{ backgroundColor: code ? C.purple : C.chipAlt, color: "#fff" }}>
              Verify code
            </button>
          </>
        ) : (
          <>
            <div className="text-sm" style={{ color: C.text }}>Code verified for <b>{matched.name}</b> — set up your login.</div>
            <ValidatedField icon={<Tag size={14} />} placeholder="Role (optional)" value={role} onChange={setRole} isValidFn={(v) => v.length <= 30 && isClean(v)} errorMsg="Keep it short and respectful." maxLength={30} />
            <ValidatedField icon={<User size={14} />} placeholder="Username" value={username} onChange={setUsername} isValidFn={isValidUsername} errorMsg="4+ characters, letters and numbers only." maxLength={20} />
            <PasswordField placeholder="Password" value={password} onChange={setPassword} />
            <PasswordChecklist password={password} />
            <button disabled={!isValidUsername(username) || !isValidStrongPassword(password)} onClick={finish} className="w-full py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: (isValidUsername(username) && isValidStrongPassword(password)) ? C.purple : C.chipAlt, color: "#fff" }}>
              Create account & log in
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AccessRequestScreen({ onBack, onSubmitted }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const ready = isValidName(name) && isValidPhone(phone);

  const subject = encodeURIComponent(`Wiffed_ Team Access Request — ${name || "New applicant"}`);
  const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nNote: ${note}`);
  const mailtoHref = `mailto:${BUSINESS_EMAIL}?subject=${subject}&body=${body}`;

  const handleSend = () => {
    onSubmitted({ id: `req-${Date.now()}`, name, phone, note, requestedAt: new Date().toISOString(), code: null });
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto space-y-4 c4rd-fade text-center">
        <div className="rounded-md p-8" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <CheckCircle2 size={28} color={C.green} className="mx-auto mb-2" />
          <div className="font-bold" style={{ color: C.text }}>Request sent</div>
          <div className="text-sm mt-1" style={{ color: C.mute }}>The business will generate a member code and send it to you directly.</div>
          <button onClick={onBack} className="mt-4 text-sm underline" style={{ color: C.purple }}>Back to login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 c4rd-fade">
      <button onClick={onBack} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back</button>
      <div className="rounded-md p-7 space-y-3" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <SectionLabel>Request team access</SectionLabel>
        <div className="text-xs" style={{ color: C.mute }}>This opens an email to Wiffed_ Detailing. The business will issue you a one-time member code to finish creating your account.</div>
        <ValidatedField icon={<User size={14} />} placeholder="Full name" value={name} onChange={setName} isValidFn={isValidName} errorMsg="Enter your full name (first and last, letters only)." maxLength={50} />
        <ValidatedField icon={<Phone size={14} />} placeholder="Phone number" value={phone} onChange={setPhone} isValidFn={isValidPhone} errorMsg="Enter a valid 10-digit phone number." inputMode="numeric" format={formatPhone} />
        <TextArea placeholder="Anything you'd like to add (optional)" value={note} onChange={setNote} rows={2} maxLen={200} />
        <a href={ready ? mailtoHref : undefined} onClick={ready ? handleSend : (e) => e.preventDefault()} className="w-full block text-center py-3 rounded font-bold text-sm transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: ready ? C.purple : C.chipAlt, color: "#fff", cursor: ready ? "pointer" : "default" }}>
          Send Request
        </a>
      </div>
    </div>
  );
}

// ---------- client: requests + messages ----------
function RequestsScreen({ tickets, setTickets, session }) {
  const [phone, setPhone] = useState(session?.phone ? formatPhone(session.phone) : "");
  const [activeId, setActiveId] = useState(null);
  const mine = tickets.filter((t) => phone && t.client.phone === phone);
  const active = tickets.find((t) => t.id === activeId);

  const sendTicketMessage = (text) => {
    const next = tickets.map((t) => t.id === activeId ? { ...t, messages: [...t.messages, { sender: "client", text, time: nowTime() }] } : t);
    setTickets(next);
    saveKey("tickets", next);
  };

  if (active) {
    return (
      <div className="max-w-lg mx-auto space-y-4 c4rd-fade">
        <button onClick={() => setActiveId(null)} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back to your requests</button>
        <div className="rounded-md p-5" style={{ backgroundColor: C.paper, color: C.ink }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[10px] font-mono opacity-60">{active.id}</div>
              <div className="font-black text-xl">{active.car.year} {active.car.make} {active.car.model}</div>
            </div>
            <Stamp status={active.status} />
          </div>
          <div className="mt-3 text-sm space-y-1">
            <div><b>Service:</b> {ticketServiceLabel(active)} — {money(active.totalPrice)}</div>
            <div><b>Location:</b> {active.serviceLocation === "mobile" ? `Mobile at ${active.mobileAddress} (+$${MOBILE_FEE} & $${MOBILE_PER_MILE}/mi)` : "At our location"}</div>
            {active.confirmedTime && <div><b>Confirmed time:</b> {fmtDateTime(active.confirmedTime)}</div>}
            {active.mods.hasMods && <div><b>Mods:</b> {active.mods.list.join(", ") || active.mods.notes}</div>}
            {(active.hasCeramicCoating || active.hasPPF) && <div><b>Coatings:</b> {[active.hasCeramicCoating && "Ceramic Coating", active.hasPPF && "PPF"].filter(Boolean).join(", ")}</div>}
            {active.contactMethod && <div><b>Preferred contact:</b> {active.contactMethod}{active.contactMethod !== "Phone number" ? ` (${active.contactDetail})` : ""}</div>}
          </div>
          {active.assignedWorker && (
            <div className="mt-3 pt-3 flex items-center gap-2 text-sm font-bold" style={{ borderTop: `1px dashed ${C.ink}55`, color: C.purpleDeep }}>
              <Handshake size={14} /> Accepted by {active.assignedWorker.name} — chat below to work out details
            </div>
          )}
        </div>
        <Chat title={`Chat about ${active.id}`} thread={active} sender="client" onSend={sendTicketMessage} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4 c4rd-fade">
      <SectionLabel>Look up your requests</SectionLabel>
      <ValidatedField icon={<Phone size={14} />} placeholder="Phone number used for booking" value={phone} onChange={setPhone} isValidFn={isValidPhone} errorMsg="Enter a valid 10-digit phone number." inputMode="numeric" format={formatPhone} />
      {isValidPhone(phone) && mine.length === 0 && <div className="text-sm text-center py-6" style={{ color: C.mute }}>No requests found for that number yet.</div>}
      {mine.map((t) => <TicketStub key={t.id} ticket={t} onClick={() => setActiveId(t.id)} />)}
    </div>
  );
}

function MessagesScreen({ workers, conversations, setConversations, session }) {
  const [name, setName] = useState(session?.name || "");
  const [phone, setPhone] = useState(session?.phone ? formatPhone(session.phone) : "");
  const [activeWorkerId, setActiveWorkerId] = useState(null);

  const openConvo = (workerId) => {
    let convo = conversations.find((c) => c.clientPhone === phone && c.workerId === workerId);
    if (!convo) {
      convo = { id: `${phone}__${workerId}`, clientPhone: phone, clientName: name, workerId, messages: [] };
      const next = [...conversations, convo];
      setConversations(next);
      saveKey("conversations", next);
    }
    setActiveWorkerId(workerId);
  };
  const sendConvoMessage = (text) => {
    const next = conversations.map((c) => (c.clientPhone === phone && c.workerId === activeWorkerId) ? { ...c, messages: [...c.messages, { sender: "client", text, time: nowTime() }] } : c);
    setConversations(next);
    saveKey("conversations", next);
  };
  const currentConvo = conversations.find((c) => c.clientPhone === phone && c.workerId === activeWorkerId);
  const ready = isValidName(name) && isValidPhone(phone);

  if (activeWorkerId) {
    return (
      <div className="max-w-lg mx-auto space-y-3 c4rd-fade">
        <button onClick={() => setActiveWorkerId(null)} className="flex items-center gap-1 text-sm" style={{ color: C.mute }}><ChevronLeft size={16} /> Back to team list</button>
        <Chat title={workers.find((w) => w.id === activeWorkerId)?.name || "Chat"} thread={currentConvo} sender="client" onSend={sendConvoMessage} />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-3 c4rd-fade">
      <SectionLabel>Your info</SectionLabel>
      <ValidatedField icon={<User size={14} />} placeholder="Your name" value={name} onChange={setName} isValidFn={isValidName} errorMsg="Enter your full name (first and last, letters only)." maxLength={50} />
      <ValidatedField icon={<Phone size={14} />} placeholder="Your phone number" value={phone} onChange={setPhone} isValidFn={isValidPhone} errorMsg="Enter a valid 10-digit phone number." inputMode="numeric" format={formatPhone} />
      <SectionLabel>Message our team</SectionLabel>
      {workers.length === 0 && <div className="text-sm" style={{ color: C.mute }}>No team members have been added yet.</div>}
      {workers.map((w) => (
        <button key={w.id} disabled={!ready} onClick={() => openConvo(w.id)} className="w-full flex items-center justify-between p-3 rounded c4rd-lift" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}`, opacity: ready ? 1 : 0.5 }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden" style={{ backgroundColor: C.purpleDeep, color: "#fff" }}>
              {w.avatarDataUrl ? <img src={w.avatarDataUrl} alt="" className="w-full h-full object-cover" /> : (w.displayName || w.name).charAt(0)}
            </div>
            <div className="text-left">
              <div className="text-sm font-bold" style={{ color: C.text }}>{w.displayName || w.name}</div>
              {w.role && <div className="text-xs" style={{ color: C.mute }}>{w.role}</div>}
            </div>
          </div>
          <MessageCircle size={16} color={C.mute} />
        </button>
      ))}
      {!ready && <div className="text-xs italic" style={{ color: C.mute }}>Enter a valid name and phone number above to start a conversation.</div>}
    </div>
  );
}

// ---------- provider dashboard (Your Garage) ----------
function TeamMemberRow({ worker, onRemove, onResetPassword }) {
  const [resetting, setResetting] = useState(false);
  const [pw, setPw] = useState("");
  return (
    <div className="p-3 rounded mb-2" style={{ backgroundColor: C.chip }}>
      <div className="flex items-center justify-between text-sm">
        <span style={{ color: C.text }}>{worker.displayName || worker.name}{worker.role ? ` — ${worker.role}` : ""} <span className="font-mono text-xs" style={{ color: C.mute }}>@{worker.username}</span></span>
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setResetting((s) => !s)} title="Reset password"><Lock size={14} color={C.mute} /></button>
          <button onClick={onRemove}><Trash2 size={14} color={C.red} /></button>
        </div>
      </div>
      {resetting && (
        <div className="mt-2 space-y-2">
          <PasswordField placeholder="New password" value={pw} onChange={setPw} />
          <PasswordChecklist password={pw} />
          <button disabled={!isValidStrongPassword(pw)} onClick={() => { onResetPassword(pw); setPw(""); setResetting(false); }}
            className="text-xs font-bold px-3 py-1.5 rounded" style={{ backgroundColor: isValidStrongPassword(pw) ? C.purple : C.chipAlt, color: "#fff" }}>
            Set new password
          </button>
        </div>
      )}
    </div>
  );
}
function AccessRequestRow({ request, onIssueCode, onDismiss }) {
  return (
    <div className="p-3 rounded mb-2" style={{ backgroundColor: C.chip }}>
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-bold" style={{ color: C.text }}>{request.name}</div>
          <div className="text-xs font-mono" style={{ color: C.mute }}>{request.phone}</div>
          {request.note && <div className="text-xs mt-1" style={{ color: C.mute }}>{request.note}</div>}
        </div>
        <button onClick={onDismiss} className="shrink-0"><Trash2 size={14} color={C.red} /></button>
      </div>
      {request.code ? (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm font-black px-3 py-1 rounded" style={{ backgroundColor: C.purpleDeep, color: "#fff", letterSpacing: "0.12em" }}>{request.code}</span>
          <span className="text-[11px]" style={{ color: C.mute }}>Share this with them directly — they'll enter it under "Have a code?"</span>
        </div>
      ) : (
        <button onClick={onIssueCode} className="mt-2 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1" style={{ backgroundColor: C.purple, color: "#fff" }}>
          <KeyRound size={13} /> Generate Member Code
        </button>
      )}
    </div>
  );
}

function GarageScreen({ tickets, setTickets, workers, setWorkers, conversations, setConversations, accessRequests, setAccessRequests, session }) {
  const [filter, setFilter] = useState("pending");
  const [activeId, setActiveId] = useState(null);
  const [scheduleTime, setScheduleTime] = useState("");
  const [showTeam, setShowTeam] = useState(false);
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerRole, setNewWorkerRole] = useState("");
  const [newWorkerUsername, setNewWorkerUsername] = useState("");
  const [newWorkerPassword, setNewWorkerPassword] = useState("");
  const [activeConvoId, setActiveConvoId] = useState(null);

  const acting = session;
  const active = tickets.find((t) => t.id === activeId);
  const filtered = tickets.filter((t) => t.status === filter);
  const counts = tickets.reduce((acc, t) => ({ ...acc, [t.status]: (acc[t.status] || 0) + 1 }), {});
  const workerConvos = conversations.filter((c) => c.workerId === acting.id);
  const activeConvo = conversations.find((c) => c.id === activeConvoId);

  const update = (id, patch) => {
    const next = tickets.map((t) => (t.id === id ? { ...t, ...patch } : t));
    setTickets(next);
    saveKey("tickets", next);
  };
  const sendTicketMessage = (text) => {
    const next = tickets.map((t) => t.id === activeId ? { ...t, messages: [...t.messages, { sender: "provider", fromName: acting.name, text, time: nowTime() }] } : t);
    setTickets(next);
    saveKey("tickets", next);
  };
  const sendConvoMessage = (text) => {
    const next = conversations.map((c) => c.id === activeConvoId ? { ...c, messages: [...c.messages, { sender: "provider", fromName: acting.name, text, time: nowTime() }] } : c);
    setConversations(next);
    saveKey("conversations", next);
  };
  const addWorker = () => {
    if (!isValidName(newWorkerName) || !isValidUsername(newWorkerUsername) || !isValidStrongPassword(newWorkerPassword)) return;
    const w = { id: `w-${Date.now()}`, name: newWorkerName.trim(), role: newWorkerRole.trim(), username: newWorkerUsername.trim(), password: newWorkerPassword };
    const next = [...workers, w];
    setWorkers(next);
    saveKey("workers", next);
    setNewWorkerName(""); setNewWorkerRole(""); setNewWorkerUsername(""); setNewWorkerPassword("");
  };
  const removeWorker = (id) => {
    const next = workers.filter((w) => w.id !== id);
    setWorkers(next);
    saveKey("workers", next);
  };
  const resetWorkerPassword = (id, newPass) => {
    const next = workers.map((w) => w.id === id ? { ...w, password: newPass } : w);
    setWorkers(next);
    saveKey("workers", next);
  };
  const issueCode = (id) => {
    const next = accessRequests.map((r) => r.id === id ? { ...r, code: generateCode() } : r);
    setAccessRequests(next);
    saveKey("accessRequests", next);
  };
  const dismissRequest = (id) => {
    const next = accessRequests.filter((r) => r.id !== id);
    setAccessRequests(next);
    saveKey("accessRequests", next);
  };
  const addWorkerValid = isValidName(newWorkerName) && isValidUsername(newWorkerUsername) && isValidStrongPassword(newWorkerPassword);

  return (
    <div className="max-w-5xl mx-auto space-y-4 c4rd-fade">
      <div className="flex items-center justify-between gap-3 flex-wrap p-3 rounded-md" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
        <div className="flex items-center gap-2 text-sm">
          <Users size={16} color={C.purple} />
          <span style={{ color: C.mute }}>Logged in as</span>
          <span className="font-bold" style={{ color: C.text }}>{acting.displayName || acting.name}</span>
          {acting.role && <span className="text-xs" style={{ color: C.mute }}>({acting.role})</span>}
        </div>
        <button onClick={() => setShowTeam((s) => !s)} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded uppercase transition-transform hover:scale-105" style={{ backgroundColor: C.chip, color: C.mute }}>
          <Settings2 size={14} /> Team {accessRequests.length > 0 && <span className="ml-1 px-1.5 rounded-full text-[10px]" style={{ backgroundColor: C.purple, color: "#fff" }}>{accessRequests.length}</span>}
        </button>
      </div>

      {showTeam && (
        <div className="rounded-md p-5 space-y-5 c4rd-fade" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
          <div>
            <SectionLabel>Team members</SectionLabel>
            {workers.map((w) => <TeamMemberRow key={w.id} worker={w} onRemove={() => removeWorker(w.id)} onResetPassword={(pw) => resetWorkerPassword(w.id, pw)} />)}
            <div className="pt-2 space-y-2">
              <div className="text-xs" style={{ color: C.mute }}>Add someone directly:</div>
              <div className="grid grid-cols-2 gap-2">
                <ValidatedField placeholder="Name" value={newWorkerName} onChange={setNewWorkerName} isValidFn={isValidName} errorMsg="Full name required." maxLength={50} />
                <ValidatedField placeholder="Role (optional)" value={newWorkerRole} onChange={setNewWorkerRole} isValidFn={(v) => v.length <= 30 && isClean(v)} errorMsg="Keep it respectful." maxLength={30} />
                <ValidatedField placeholder="Username" value={newWorkerUsername} onChange={setNewWorkerUsername} isValidFn={isValidUsername} errorMsg="4+ letters/numbers." maxLength={20} />
                <PasswordField placeholder="Password" value={newWorkerPassword} onChange={setNewWorkerPassword} />
              </div>
              <PasswordChecklist password={newWorkerPassword} />
              <button disabled={!addWorkerValid} onClick={addWorker} className="px-3 py-2 rounded flex items-center gap-1 text-sm font-bold transition-transform hover:scale-105" style={{ backgroundColor: addWorkerValid ? C.purple : C.chipAlt, color: "#fff" }}>
                <UserPlus size={14} /> Add teammate
              </button>
            </div>
          </div>

          <div style={{ borderTop: `1px dashed ${C.panelBorder}`, paddingTop: 16 }}>
            <SectionLabel>Member code requests</SectionLabel>
            {accessRequests.length === 0 && <div className="text-xs" style={{ color: C.mute }}>No pending requests.</div>}
            {accessRequests.map((r) => <AccessRequestRow key={r.id} request={r} onIssueCode={() => issueCode(r.id)} onDismiss={() => dismissRequest(r.id)} />)}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <div className="flex gap-2 mb-4 flex-wrap">
            {Object.keys(STATUS_STYLE).map((key) => (
              <button key={key} onClick={() => { setFilter(key); setActiveConvoId(null); }} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors"
                style={{ backgroundColor: filter === key ? STATUS_STYLE[key].color() : C.chip, color: filter === key ? "#0A0A0C" : C.mute }}>
                {STATUS_STYLE[key].label} <span className="opacity-70">{counts[key] || 0}</span>
              </button>
            ))}
            <button onClick={() => { setFilter("__messages"); setActiveId(null); }} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 transition-colors"
              style={{ backgroundColor: filter === "__messages" ? C.purple : C.chip, color: filter === "__messages" ? "#fff" : C.mute }}>
              <MessageCircle size={12} /> Direct Messages
            </button>
          </div>

          {filter !== "__messages" && (
            <>
              {filtered.length === 0 && <div className="text-sm text-center py-10" style={{ color: C.mute }}>Nothing here yet.</div>}
              {filtered.map((t) => <TicketStub key={t.id} ticket={t} active={t.id === activeId} onClick={() => { setActiveId(t.id); setScheduleTime(t.confirmedTime || ""); }} />)}
            </>
          )}
          {filter === "__messages" && (
            <>
              {workerConvos.length === 0 && <div className="text-sm text-center py-10" style={{ color: C.mute }}>No direct messages yet.</div>}
              {workerConvos.map((c) => (
                <button key={c.id} onClick={() => setActiveConvoId(c.id)} className="w-full text-left p-3 mb-2 rounded flex items-center justify-between transition-colors"
                  style={{ backgroundColor: c.id === activeConvoId ? C.purpleDeep : C.panel, border: `1px solid ${C.panelBorder}` }}>
                  <div>
                    <div className="text-sm font-bold" style={{ color: c.id === activeConvoId ? "#fff" : C.text }}>{c.clientName}</div>
                    <div className="text-xs font-mono" style={{ color: c.id === activeConvoId ? "#E9E2F7" : C.mute }}>{c.clientPhone}</div>
                  </div>
                  <Tag size={14} color={c.id === activeConvoId ? "#fff" : C.mute} />
                </button>
              ))}
            </>
          )}
        </div>

        <div>
          {filter === "__messages" ? (
            activeConvo ? <Chat title={`${activeConvo.clientName} · ${activeConvo.clientPhone}`} thread={activeConvo} sender="provider" onSend={sendConvoMessage} /> : <EmptyPanel text="Select a conversation" />
          ) : !active ? (
            <EmptyPanel text="Select a job ticket to view details" />
          ) : (
            <div className="space-y-4 c4rd-fade">
              <div className="rounded-md p-5" style={{ backgroundColor: C.paper, color: C.ink }}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] font-mono opacity-60">{active.id}</div>
                    <div className="font-black text-xl">{active.car.year} {active.car.color} {active.car.make} {active.car.model}</div>
                    <div className="text-sm opacity-70 flex items-center gap-1 mt-0.5"><User size={12} />{active.client.name} · {active.client.phone}</div>
                  </div>
                  <Stamp status={active.status} />
                </div>
                <div className="mt-3 space-y-1.5 text-sm">
                  <div><b>Service:</b> {ticketServiceLabel(active)} ({money(active.totalPrice)})</div>
                  <div><b>Location:</b> {active.serviceLocation === "mobile" ? `Mobile at ${active.mobileAddress} (+$${MOBILE_FEE} & $${MOBILE_PER_MILE}/mi)` : "At our location"}</div>
                  <div><b>Mods:</b> {active.mods.hasMods ? <span>{active.mods.list.join(", ") || "Yes"}{active.mods.notes ? ` — ${active.mods.notes}` : ""}</span> : "None reported"}</div>
                  {(active.hasCeramicCoating || active.hasPPF) && <div><b>Coatings:</b> {[active.hasCeramicCoating && "Ceramic Coating", active.hasPPF && "PPF"].filter(Boolean).join(", ")}</div>}
                  {active.contactMethod && <div><b>Preferred contact:</b> {active.contactMethod}{active.contactMethod !== "Phone number" ? ` (${active.contactDetail})` : ""}</div>}
                  {active.description && <div><b>Notes:</b> {active.description}</div>}
                  {active.availabilityNotes && <div><b>Availability:</b> {active.availabilityNotes}</div>}
                  {active.assignedWorker && <div><b>Accepted by:</b> {active.assignedWorker.name}</div>}
                </div>
              </div>

              {active.status === "pending" && (
                <div className="rounded-md p-4 space-y-2" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
                  <SectionLabel>Claim this request</SectionLabel>
                  <div className="flex gap-2">
                    <button onClick={() => update(active.id, { status: "accepted", assignedWorker: { id: acting.id, name: acting.name } })}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded font-bold text-sm transition-transform hover:scale-[1.02]" style={{ backgroundColor: C.purple, color: "#fff" }}>
                      <Handshake size={16} /> Accept
                    </button>
                    <button onClick={() => update(active.id, { status: "declined" })} className="flex-1 flex items-center justify-center gap-1 py-2 rounded font-bold text-sm transition-transform hover:scale-[1.02]" style={{ backgroundColor: C.chip, color: C.red, border: `1px solid ${C.red}` }}>
                      <XCircle size={16} /> Decline
                    </button>
                  </div>
                </div>
              )}
              {active.status === "accepted" && (
                <div className="rounded-md p-4 space-y-3" style={{ backgroundColor: C.panel, border: `1px solid ${C.panelBorder}` }}>
                  <SectionLabel>Lock in a time</SectionLabel>
                  <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="w-full px-3 py-2 rounded text-sm outline-none" style={{ backgroundColor: C.input, color: C.text, border: `1px solid ${C.panelBorder}` }} />
                  <button disabled={!scheduleTime} onClick={() => update(active.id, { status: "confirmed", confirmedTime: scheduleTime })}
                    className="w-full flex items-center justify-center gap-1 py-2 rounded font-bold text-sm transition-transform hover:scale-[1.02]" style={{ backgroundColor: scheduleTime ? C.blue : C.chipAlt, color: "#fff" }}>
                    <CheckCircle2 size={16} /> Confirm appointment
                  </button>
                </div>
              )}
              {active.status === "confirmed" && (
                <button onClick={() => update(active.id, { status: "completed" })} className="w-full flex items-center justify-center gap-1 py-2 rounded font-bold text-sm transition-transform hover:scale-[1.02]" style={{ backgroundColor: C.green, color: "#fff" }}>
                  <Check size={16} /> Mark job complete
                </button>
              )}
              <Chat title={`Chat about ${active.id}`} thread={active} sender="provider" onSend={sendTicketMessage} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyPanel({ text }) {
  return (
    <div className="rounded-md p-8 text-center h-full flex flex-col items-center justify-center" style={{ backgroundColor: C.panel, border: `1px dashed ${C.panelBorder}` }}>
      <ClipboardList size={28} color={C.mute} className="mb-2" />
      <div className="text-sm" style={{ color: C.mute }}>{text}</div>
    </div>
  );
}

// ---------- app ----------
export default function App() {
  const [screen, setScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [clientAccounts, setClientAccounts] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [theme, setTheme] = useState("light");
  const [performanceMode, setPerformanceMode] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [nextIdCounter, setNextIdCounter] = useState(1);

  applyTheme(theme);

  useEffect(() => {
    Promise.all([
      loadKey("tickets", []), loadKey("workers", []), loadKey("conversations", []),
      loadKey("clientAccounts", []), loadKey("accessRequests", []), loadKey("reviews", []),
      loadKey("theme", "light", false), loadKey("performanceMode", false, false),
    ]).then(([t, w, c, ca, ar, rv, th, pm]) => {
      setTickets(t); setWorkers(w); setConversations(c); setClientAccounts(ca);
      setAccessRequests(ar); setReviews(rv); setTheme(th); setPerformanceMode(pm);
      setLoaded(true); setNextIdCounter(t.length + 1);
    });
  }, []);

  const nav = (key) => { setScreen(key); setMenuOpen(false); };
  const goSchedule = () => nav(session ? "book" : "login");
  const handleSetTheme = (t) => { setTheme(t); saveKey("theme", t, false); };
  const handleSetPerformanceMode = (updater) => {
    setPerformanceMode((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      saveKey("performanceMode", next, false);
      return next;
    });
  };

  const submitBooking = (form) => {
    const id = genId(nextIdCounter);
    setNextIdCounter((n) => n + 1);
    const ticket = {
      id, createdAt: new Date().toISOString(),
      client: { name: form.name, phone: form.phone },
      contactMethod: form.contactMethod, contactDetail: form.contactDetail,
      car: { year: form.year, make: form.make, model: form.model, color: form.color },
      exteriorType: form.exteriorType, interiorType: form.interiorType, totalPrice: form.totalPrice,
      serviceLocation: form.serviceLocation, mobileAddress: form.mobileAddress,
      mods: { hasMods: form.hasMods, list: form.modsList, notes: form.modsNotes },
      hasCeramicCoating: form.hasCeramicCoating, hasPPF: form.hasPPF,
      description: form.description, availabilityNotes: form.availabilityNotes,
      confirmedTime: null, assignedWorker: null, status: "pending", messages: [],
    };
    const next = [ticket, ...tickets];
    setTickets(next);
    saveKey("tickets", next);
    nav("requests");
  };

  const handleCreateAccount = ({ name, phone, email, username, password }) => {
    const acct = { id: `c-${Date.now()}`, name: name.trim(), phone: phone || "", email: email || "", username: username.trim(), password };
    const next = [...clientAccounts, acct];
    setClientAccounts(next);
    saveKey("clientAccounts", next);
    setSession({ type: "customer", ...acct });
    nav("home");
  };
  const handleSubmitAccessRequest = (req) => {
    const next = [...accessRequests, req];
    setAccessRequests(next);
    saveKey("accessRequests", next);
  };
  const handleSaveProfile = ({ displayName, avatarDataUrl }) => {
    setSession((s) => ({ ...s, displayName, avatarDataUrl }));
    if (session.type === "customer") {
      const next = clientAccounts.map((a) => a.id === session.id ? { ...a, displayName, avatarDataUrl } : a);
      setClientAccounts(next); saveKey("clientAccounts", next);
    } else if (session.type === "staff") {
      const next = workers.map((w) => w.id === session.id ? { ...w, displayName, avatarDataUrl } : w);
      setWorkers(next); saveKey("workers", next);
    }
    nav("home");
  };

  return (
    <div className={`min-h-screen w-full ${performanceMode ? "c4rd-perf" : ""}`} style={{ backgroundColor: C.bg }}>
      <GlobalStyle />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} onNav={nav} session={session} />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <TopBar onMenu={() => setMenuOpen(true)} onLogo={() => nav("home")} session={session} onNav={nav}
          onLogin={() => nav("login")} onLogout={() => { setSession(null); nav("home"); }} onSchedule={goSchedule} />

        {!loaded ? (
          <div className="text-center py-20 text-sm" style={{ color: C.mute }}>Loading…</div>
        ) : (
          <div key={screen} className="c4rd-fade">
            {screen === "home" && <HomeScreen session={session} onSchedule={goSchedule} onNav={nav} />}
            {screen === "about" && <AboutScreen />}
            {screen === "team" && <TeamScreen workers={workers} />}
            {screen === "merch" && <MerchScreen />}
            {screen === "support" && <SupportUsScreen />}
            {screen === "linktree" && <LinkTreeScreen />}
            {screen === "reviews" && <ReviewsScreen reviews={reviews} setReviews={setReviews} session={session} />}
            {screen === "customize" && (
              <CustomizeScreen theme={theme} setTheme={handleSetTheme} performanceMode={performanceMode} setPerformanceMode={handleSetPerformanceMode} onBack={() => nav(session ? (session.type === "staff" ? "garage" : "home") : "home")} />
            )}
            {screen === "editProfile" && session && (
              <EditProfileScreen session={session} onSave={handleSaveProfile} onBack={() => nav(session.type === "staff" ? "garage" : "home")} />
            )}

            {screen === "login" && (
              <LoginScreen clientAccounts={clientAccounts} onNav={nav}
                onCustomerLogin={(acct) => { setSession({ type: "customer", ...acct }); nav("requests"); }} />
            )}
            {screen === "signup" && (
              <SignupScreen clientAccounts={clientAccounts} onCreateAccount={handleCreateAccount} onCancel={() => nav("login")} />
            )}
            {screen === "guestLogin" && (
              <GuestLoginScreen onBack={() => nav("login")} onGuestLogin={(g) => { setSession({ type: "guest", ...g }); nav("requests"); }} />
            )}
            {screen === "forgotPassword" && (
              <ForgotPasswordScreen clientAccounts={clientAccounts} setClientAccounts={setClientAccounts} onBack={() => nav("login")}
                onRecovered={(acct) => { setSession({ type: "customer", ...acct }); nav("requests"); }} />
            )}
            {screen === "staffLogin" && (
              <StaffLoginScreen workers={workers} setWorkers={setWorkers} onBack={() => nav("login")} onNav={nav}
                onStaffLogin={(w) => { setSession({ type: "staff", ...w }); nav("garage"); }} />
            )}
            {screen === "redeemCode" && (
              <RedeemCodeScreen accessRequests={accessRequests} setAccessRequests={setAccessRequests} workers={workers} setWorkers={setWorkers}
                onBack={() => nav("staffLogin")} onStaffLogin={(w) => { setSession({ type: "staff", ...w }); nav("garage"); }} />
            )}
            {screen === "accessRequest" && (
              <AccessRequestScreen onBack={() => nav("staffLogin")} onSubmitted={handleSubmitAccessRequest} />
            )}

            {screen === "book" && (
              <div className="max-w-lg mx-auto">
                <BookingWizard prefillName={session?.name} prefillPhone={session?.phone ? formatPhone(session.phone) : ""} onSubmit={submitBooking} onCancel={() => nav("home")} />
              </div>
            )}
            {screen === "requests" && <RequestsScreen tickets={tickets} setTickets={setTickets} session={session} />}
            {screen === "messages" && <MessagesScreen workers={workers} conversations={conversations} setConversations={setConversations} session={session} />}
            {screen === "garage" && (
              session?.type === "staff"
                ? <GarageScreen tickets={tickets} setTickets={setTickets} workers={workers} setWorkers={setWorkers} conversations={conversations} setConversations={setConversations}
                    accessRequests={accessRequests} setAccessRequests={setAccessRequests} session={session} />
                : <StaffLoginScreen workers={workers} setWorkers={setWorkers} onBack={() => nav("home")} onNav={nav}
                    onStaffLogin={(w) => { setSession({ type: "staff", ...w }); nav("garage"); }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
