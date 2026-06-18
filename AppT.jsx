import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Heart, ShoppingBag, Sparkles, TrendingUp, MapPin, Package,
  Star, BadgeCheck, Bell, Store, Plus, Zap, Play,
  User, X, Truck, Award, Eye, Clock, Gavel, Shield,
  FileText, CreditCard, AlertCircle, CheckCircle, TrendingDown,
  Users, ArrowLeft, Upload, Instagram, Send,
  MessageCircle, Image, Video, LogOut, Megaphone, Tag,
  Palette, Camera, BarChart3, Bookmark, Settings, ChevronRight,
  RefreshCw, Home, LayoutGrid, ShoppingCart
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// GLOBAL STYLES & CSS
// ─────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600;1,700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { display: none; }
  input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
  input, button, select { font-family: 'DM Sans', sans-serif; }
  @keyframes slideDown { from { transform: translateY(-16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes slideUp   { from { transform: translateY(20px);  opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes fadeIn    { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pulseDot  { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
  @keyframes confettiFall { to { transform: translateY(105vh) rotate(720deg); opacity: 0; } }
  @keyframes shimmer { 0% { left: -100%; } 100% { left: 200%; } }
  @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─────────────────────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────────────────────
const C = {
  cream: "#faf8f4", cream2: "#f0ebe0", cream3: "#e8dfd0",
  ink: "#1a1a1a", ink2: "#2d2d2d", ink3: "#555",
  muted: "#888", faint: "#bbb",
  sage: "#4a9a6a", sageLight: "#e8f5e9",
  gold: "#C9A84C", goldLight: "rgba(201,168,76,0.15)",
  red: "#ff4458", redLight: "#fff0f0",
  purple: "#7b68ee", purpleLight: "#f3e5f5",
  auBg: "#0d0d1a", auSurf: "#131325", auSurf2: "#1a1a30",
  white: "#ffffff",
  radius: { sm: 10, md: 14, lg: 18, xl: 22, xxl: 28 },
  shadow: { sm: "0 2px 12px rgba(0,0,0,0.06)", md: "0 4px 24px rgba(0,0,0,0.1)", lg: "0 8px 40px rgba(0,0,0,0.15)" },
};

const fmtN = n => (n ?? 0).toLocaleString("tr-TR");
const fmtP = n => `₺${fmtN(n)}`;

// ─────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id:1, emoji:"🪨", title:"Doğal Taş Kolye Seti", seller:"Anadolu Takı Atölyesi", sellerId:"s1", price:85, origPrice:120, moq:5, unit:"adet", cat:"Takı", location:"İstanbul", delivery:1, rating:4.9, reviews:312, verified:true, trending:true, sponsored:true, sponsorTag:"Vitrin", sampleOk:true, mov:1500, desc:"Doğal akik ve kuvars taşlardan el işçiliği ile üretilen kolye seti. Her parça benzersizdir.", tiers:[{min:5,price:85,label:"5–19"},{min:20,price:72,label:"20–49"},{min:50,price:55,label:"50+"}] },
  { id:2, emoji:"🕯️", title:"Soya Mumları 50'li Set", seller:"EcoLite Mum Fabrikası", sellerId:"s2", price:45, origPrice:60, moq:10, unit:"kutu", cat:"Ev & Dekor", location:"Bursa", delivery:2, rating:4.8, reviews:186, verified:true, trending:false, sponsored:false, sampleOk:true, mov:2000, desc:"%100 soya bazlı, vegan sertifikalı. 50 saate kadar yanma süresi.", tiers:[{min:10,price:45,label:"10–29"},{min:30,price:38,label:"30–59"},{min:60,price:30,label:"60+"}] },
  { id:3, emoji:"🧺", title:"Makrome Sepet Koleksiyon", seller:"Bohem Studio", sellerId:"s3", price:120, origPrice:150, moq:3, unit:"adet", cat:"El Sanatları", location:"İzmir", delivery:2, rating:4.7, reviews:94, verified:true, trending:true, sponsored:true, sponsorTag:"Kategori Üstü", sampleOk:false, mov:1000, desc:"El örgüsü makrome sepetler. 3 farklı boyut seçeneği mevcut.", tiers:[{min:3,price:120,label:"3–9"},{min:10,price:105,label:"10–24"},{min:25,price:88,label:"25+"}] },
  { id:4, emoji:"👜", title:"Premium Keten Tote", seller:"Sürdürülebilir Tekstil", sellerId:"s4", price:38, origPrice:55, moq:20, unit:"adet", cat:"Tekstil", location:"İstanbul", delivery:1, rating:4.6, reviews:524, verified:true, trending:false, sponsored:false, sampleOk:true, mov:2500, desc:"GOTS sertifikalı organik keten kumaş. Özel baskı seçeneği mevcut.", tiers:[{min:20,price:38,label:"20–49"},{min:50,price:32,label:"50–99"},{min:100,price:27,label:"100+"}] },
  { id:5, emoji:"☕", title:"Seramik Fincan Seti", seller:"Çömlek Sanatevi", sellerId:"s5", price:95, origPrice:130, moq:6, unit:"set", cat:"Mutfak", location:"Çanakkale", delivery:3, rating:4.9, reviews:201, verified:true, trending:true, sponsored:false, sampleOk:true, mov:1800, desc:"Çark tekniği ile üretilen sırsız seramik fincanlar. Her set 4 kişiliktir.", tiers:[{min:6,price:95,label:"6–11"},{min:12,price:82,label:"12–23"},{min:24,price:68,label:"24+"}] },
];

const ARTWORKS = [
  { id:"a1", emoji:"🌊", title:"Boğaz'ın Sesi #3", artist:"Elif Karadağ", year:2024, medium:"Yağlı Boya / Tuval", size:"80×120 cm", story:"İstanbul Boğazı'nın sisli sabahlarından ilham alan bu eser, 6 ay süren yoğun bir çalışma döneminin ürünüdür. Sanatçı her katmanı ayrı bir gün sürdü.", currentBid:24600, buyNow:45000, startBid:8500, bidCount:18, watcherCount:142, endsIn:8*60+37, accent:"#C9A84C", certified:true, status:"live", provenance:"Koleksiyoner Özel", edition:"Tekil Eser", artistScore:98, topBidders:[{name:"K****n",score:94,amount:24600},{name:"M****z",score:91,amount:19500},{name:"Sen",score:87,amount:22000,isUser:true}] },
  { id:"a2", emoji:"🌐", title:"Dijital Rüya / 001", artist:"Cem Arslan", year:2024, medium:"Generatif Dijital Baskı", size:"60×90 cm", story:"Yapay zeka ile işbirliği içinde üretilen bu seri, algoritmanın tesadüfi güzelliğini arşiv baskıya dönüştürüyor.", currentBid:9800, buyNow:18000, startBid:3200, bidCount:11, watcherCount:87, endsIn:23*60+14, accent:"#7B68EE", certified:true, status:"live", provenance:"Sanatçı Stüdyosu", edition:"5/10 Edisyon", artistScore:95, topBidders:[{name:"A****r",score:89,amount:9800}] },
  { id:"a3", emoji:"🏛️", title:"Sükunet", artist:"Zeynep Oral", year:2023, medium:"Seramik Heykel", size:"32×18 cm", story:"Yüksek ısı fırınında pişirilen bu heykel, suskunluğun biçimsel karşılığını arıyor. Anadolu toprak geleneğinden besleniyor.", currentBid:14200, buyNow:28000, startBid:5000, bidCount:9, watcherCount:63, endsIn:60*60*2, accent:"#B87333", certified:true, status:"live", provenance:"Galeri Onaylı", edition:"Tekil Eser", artistScore:92, topBidders:[{name:"T****k",score:99,amount:14200}] },
];

const POOLS = [
  { id:"p1", emoji:"🧵", title:"El Dokuması Keten Kumaş", seller:"Ege Tekstil A.Ş.", target:1000, filled:740, unitPrice:18, unit:"metre", participants:8, maxParticipants:10, deadlineH:47, minPer:50, maxPer:200, desc:"1000 metre üretim için havuz. Her butikten min 50 metre.", savings:"%32", accent:"#4a9a6a", watchers:23, interested:4, sampleOk:true },
  { id:"p2", emoji:"📦", title:"Özel Baskılı Kraft Ambalaj", seller:"Ambalaj Pro", target:5000, filled:3200, unitPrice:4.5, unit:"adet", participants:6, maxParticipants:10, deadlineH:72, minPer:200, maxPer:1000, desc:"5000 adet baskı. Logo özelleştirme dahil.", savings:"%41", accent:"#b87c2a", watchers:14, interested:2, sampleOk:false },
  { id:"p3", emoji:"🏺", title:"Osmanlı Motifli Çini Tabak", seller:"İznik Çini Fabrikası", target:500, filled:120, unitPrice:95, unit:"adet", participants:2, maxParticipants:5, deadlineH:120, minPer:50, maxPer:150, desc:"El yapımı çini, min 500 adet üretim.", savings:"%28", accent:"#7b68ee", watchers:9, interested:1, sampleOk:true },
];

const ADS = [
  { id:"ad1", icon:"🏠", name:"Ana Sayfa Vitrini", dur:"3 Gün", price:299, color:"#e8f5e9", tc:"#2e7d32", bc:"#a5d6a7", desc:"Hero bölümde gösterilir. ~800 günlük gösterim." },
  { id:"ad2", icon:"📌", name:"Kategori Üstü", dur:"7 Gün", price:499, color:"#e3f2fd", tc:"#1565c0", bc:"#90caf9", desc:"Kategorin en üstünde sabit. ~400 günlük gösterim." },
  { id:"ad3", icon:"✨", name:"Havuzda Parlat", dur:"5 Gün", price:349, color:"#fff8e1", tc:"#f57f17", bc:"#ffe082", desc:"Havuz listesinde öne çıkar. Yüksek dönüşüm." },
];

const DM_THREADS = [
  { id:"dm1", seller:"Anadolu Takı Atölyesi", emoji:"🪨", msgs:[{from:"seller",text:"Merhaba! Yeni koleksiyonumuzu paylaşıyorum.",time:"10:23"},{from:"seller",type:"media",text:"📸 koleksiyon_2024.jpg",time:"10:24"},{from:"me",text:"Harika görünüyor! Numune alabilir miyim?",time:"10:31"}], unread:0 },
  { id:"dm2", seller:"EcoLite Mum Fabrikası", emoji:"🕯️", msgs:[{from:"seller",text:"Numuneniz kargoya verildi!",time:"Dün"},{from:"seller",type:"media",text:"📹 uretim_video.mp4",time:"Dün"},{from:"me",text:"Teşekkürler, bekliyorum.",time:"Dün"}], unread:2 },
  { id:"dm3", seller:"Bohem Studio", emoji:"🧺", msgs:[{from:"seller",text:"Havuza katılım için teşekkürler! Süreç hakkında sorularınız var mı?",time:"2 gün önce"}], unread:1 },
];

// ─────────────────────────────────────────────────────────────────
// SHARED UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────
function Btn({ children, onClick, variant="primary", disabled=false, size="md", style={} }) {
  const base = { border:"none", cursor: disabled?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontWeight:800, fontFamily:"'DM Sans',sans-serif", transition:"all .2s", borderRadius: C.radius.lg };
  const sizes = { sm:{ padding:"8px 16px", fontSize:13 }, md:{ padding:"14px 20px", fontSize:15 }, lg:{ padding:"17px 24px", fontSize:16 } };
  const variants = {
    primary: { background: disabled?"#d0cec8":"#1a1a1a", color: disabled?"#9a9690":"white" },
    ghost:   { background:"transparent", color:"#1a1a1a", border:"1.5px solid rgba(0,0,0,0.15)" },
    gold:    { background: disabled?`${C.gold}50`:C.gold, color:"#0d0d1a" },
    danger:  { background: disabled?"#f0f0f0":"#c62828", color: disabled?"#aaa":"white" },
    sage:    { background: disabled?"#ccc":C.sage, color:"white" },
  };
  return <button onClick={!disabled?onClick:undefined} style={{...base,...sizes[size],...variants[variant],...style}}>{children}</button>;
}

function Badge({ children, color="#e8f5e9", tc="#2e7d32", icon=null, style={} }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:4, padding:"3px 9px", borderRadius:8, background:color, ...style }}>
      {icon && <span style={{ fontSize:10 }}>{icon}</span>}
      <span style={{ fontSize:10, fontWeight:700, color:tc }}>{children}</span>
    </div>
  );
}

function Card({ children, style={}, onClick }) {
  return <div onClick={onClick} style={{ background:C.white, borderRadius:C.radius.xl, border:"1px solid rgba(0,0,0,0.08)", boxShadow:C.shadow.sm, ...style }}>{children}</div>;
}

function ModalSheet({ children, onClose, title="" }) {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:300, background:"rgba(0,0,0,0.65)", display:"flex", alignItems:"flex-end", justifyContent:"center", animation:"fadeIn .2s" }} onClick={onClose}>
      <div style={{ background:C.cream, borderRadius:"24px 24px 0 0", width:"100%", maxWidth:430, maxHeight:"92vh", overflowY:"auto", animation:"slideUp .25s" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 12px", borderBottom:"1px solid rgba(0,0,0,0.06)", position:"sticky", top:0, background:C.cream, zIndex:1 }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.ink }}>{title}</span>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:"50%", background:"rgba(0,0,0,0.07)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><X size={15} color={C.ink}/></button>
        </div>
        <div style={{ padding:"16px 20px 32px" }}>{children}</div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      {label && <div style={{ fontSize:12, fontWeight:700, color:C.ink3, marginBottom:5 }}>{label}</div>}
      <input style={{ width:"100%", height:46, borderRadius:C.radius.md, border:"1px solid rgba(0,0,0,0.12)", background:C.cream, padding:"0 14px", fontSize:14, color:C.ink, outline:"none" }} {...props}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// TOAST + CONFETTI
// ─────────────────────────────────────────────────────────────────
function Toasts({ toasts }) {
  const colors = { success:"#1a6a3a", warn:"#8a5a00", error:"#8a1a1a", info:"#1a1a2e" };
  const icons  = { success:"🎉", warn:"⚠️", error:"❌", info:"ℹ️" };
  return (
    <div style={{ position:"fixed", top:68, left:"50%", transform:"translateX(-50%)", zIndex:9999, display:"flex", flexDirection:"column", gap:8, width:380, pointerEvents:"none", padding:"0 16px" }}>
      {toasts.map(t => (
        <div key={t.id} style={{ padding:"12px 16px", borderRadius:14, background:colors[t.type||"info"], color:"white", boxShadow:C.shadow.lg, display:"flex", alignItems:"center", gap:10, animation:"slideDown .3s ease", fontSize:13, fontWeight:600 }}>
          <span style={{ fontSize:18 }}>{icons[t.type||"info"]}</span>
          <span style={{ flex:1, lineHeight:1.4 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function Confetti({ active }) {
  if (!active) return null;
  const palette = [C.gold, C.sage, C.red, C.purple, "#FFD700", "#ff6b6b", "#00b894"];
  return (
    <div style={{ position:"fixed", inset:0, zIndex:8888, pointerEvents:"none", overflow:"hidden" }}>
      {Array.from({ length:70 }).map((_, i) => (
        <div key={i} style={{
          position:"absolute", left:`${Math.random()*100}%`, top:-20,
          width: 6+Math.random()*9, height: 6+Math.random()*9,
          borderRadius: Math.random()>.5 ? "50%" : "3px",
          background: palette[i % palette.length],
          animation: `confettiFall ${1+Math.random()*.9}s ${Math.random()*.8}s ease-in forwards`,
        }}/>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COUNTDOWN COMPONENT
// ─────────────────────────────────────────────────────────────────
function Countdown({ endsAt, accentColor="#C9A84C", dark=true }) {
  const [rem, setRem] = useState(Math.max(0, endsAt - Date.now()));
  useEffect(() => { const iv = setInterval(() => setRem(Math.max(0, endsAt - Date.now())), 1000); return () => clearInterval(iv); }, [endsAt]);
  const h = Math.floor(rem/3600000), m = Math.floor((rem%3600000)/60000), s = Math.floor((rem%60000)/1000);
  const urgent = rem < 60000, critical = rem < 10000;
  const bg = critical ? "#c0392b" : urgent ? "#d35400" : dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)";
  const numColor = critical||urgent ? "white" : accentColor;
  return (
    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
      {[[h,"SA"],[m,"DK"],[s,"SN"]].map(([v,l],i) => (
        <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ background:bg, borderRadius:8, padding:"5px 10px", minWidth:44, textAlign:"center", transition:"background .5s" }}>
            <div style={{ fontSize:20, fontWeight:900, color:numColor, fontVariantNumeric:"tabular-nums", lineHeight:1 }}>{String(v).padStart(2,"0")}</div>
            <div style={{ fontSize:9, color: dark?"rgba(255,255,255,0.4)":"#aaa", letterSpacing:1 }}>{l}</div>
          </div>
          {i<2 && <span style={{ color:accentColor, fontWeight:900, fontSize:18, opacity:.6 }}>:</span>}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AUTH SCREEN
// ─────────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [step, setStep] = useState("welcome"); // welcome | role | buyer | seller | login
  const [role, setRole] = useState("");
  const [form, setForm] = useState({ name:"", email:"", pass:"", ig:"", interests:[], capacity:"", portfolio:false, taxDoc:false });
  const upd = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const toggleInt = v => setForm(f => ({ ...f, interests: f.interests.includes(v) ? f.interests.filter(x=>x!==v) : [...f.interests, v] }));
  const done = () => onAuth({ name: form.name || "Kullanıcı", email: form.email, role, interests: form.interests, instagram: form.ig });

  const INTERESTS = ["Takı","Dekor","Tekstil","Seramik","El Sanatları","Sanat","Organik","Moda","Ambalaj"];

  if (step === "welcome") return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(160deg, ${C.cream}, ${C.cream2})`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 28px" }}>
      <div style={{ width:72, height:72, borderRadius:22, background:C.ink, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, marginBottom:24, boxShadow:C.shadow.md }}>🛍</div>
      <h1 style={{ fontSize:30, fontWeight:900, color:C.ink, textAlign:"center", marginBottom:8, letterSpacing:-.5 }}>Boutique & Art Hub</h1>
      <p style={{ fontSize:14, color:C.muted, textAlign:"center", lineHeight:1.6, marginBottom:40, maxWidth:300 }}>Üreticiler, sanatçılar ve butik sahiplerini buluşturan Türkiye'nin ilk B2B platform.</p>
      <div style={{ width:"100%", maxWidth:360, display:"flex", flexDirection:"column", gap:10 }}>
        <Btn onClick={() => setStep("role")}>🚀 Hemen Başla</Btn>
        <Btn variant="ghost" onClick={() => setStep("login")}>Zaten hesabım var</Btn>
        <div style={{ display:"flex", gap:8 }}>
          {[{s:"G",l:"Google",bg:C.white,border:"rgba(0,0,0,0.15)",c:"#444"},{s:"A",l:"Apple",bg:C.ink,border:"transparent",c:C.white}].map(x => (
            <button key={x.s} onClick={() => onAuth({ name:"Sosyal Kullanıcı", email:"social@example.com", role:"buyer", interests:[] })}
              style={{ flex:1, padding:"12px 0", borderRadius:C.radius.md, background:x.bg, border:`1.5px solid ${x.border}`, color:x.c, fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
              <span style={{ fontWeight:900, fontSize:15 }}>{x.s}</span>{x.l} ile Giriş
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (step === "login") return (
    <div style={{ minHeight:"100vh", background:C.cream, padding:"60px 24px 32px", overflowY:"auto" }}>
      <button onClick={() => setStep("welcome")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:C.muted, fontSize:14, marginBottom:28, padding:0 }}><ArrowLeft size={16}/> Geri</button>
      <h2 style={{ fontSize:24, fontWeight:900, color:C.ink, marginBottom:4 }}>Tekrar hoş geldin 👋</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:28 }}>Hesabına giriş yap</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
        <Input label="E-posta" placeholder="ornek@mail.com" value={form.email} onChange={upd("email")}/>
        <Input label="Şifre" type="password" placeholder="••••••••" value={form.pass} onChange={upd("pass")}/>
      </div>
      <Btn onClick={done} style={{ width:"100%" }}>Giriş Yap</Btn>
      <p style={{ textAlign:"center", fontSize:13, color:C.muted, marginTop:16 }}>Hesabın yok mu? <span style={{ color:C.ink, fontWeight:700, cursor:"pointer" }} onClick={() => setStep("role")}>Kayıt ol</span></p>
    </div>
  );

  if (step === "role") return (
    <div style={{ minHeight:"100vh", background:C.cream, padding:"60px 24px 32px", overflowY:"auto" }}>
      <button onClick={() => setStep("welcome")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:C.muted, fontSize:14, marginBottom:28, padding:0 }}><ArrowLeft size={16}/> Geri</button>
      <h2 style={{ fontSize:24, fontWeight:900, color:C.ink, marginBottom:4 }}>Platform'da ne yapacaksın?</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Deneyimini kişiselleştirmek için rol seç.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {[
          { r:"buyer", emoji:"🛍️", title:"Girişimci / Butik Sahibi", desc:"Toptan ürün almak, havuza katılmak ve sanat eseri keşfetmek istiyorum." },
          { r:"seller_corp", emoji:"🏭", title:"Kurumsal Toptancı / Üretici", desc:"Vergi levhalı şirket olarak toptan satış ve havuz yönetimi yapacağım." },
          { r:"seller_artist", emoji:"🎨", title:"Bireysel Sanatçı", desc:"Eserlerimi galeride satmak ve açık artırmaya koymak istiyorum." },
        ].map(o => (
          <button key={o.r} onClick={() => { setRole(o.r); setStep(o.r==="buyer"?"buyer":"seller"); }}
            style={{ padding:"18px 16px", borderRadius:C.radius.xl, background:C.white, border:`2px solid ${role===o.r?C.ink:"rgba(0,0,0,0.08)"}`, cursor:"pointer", textAlign:"left", transition:"border-color .2s" }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{o.emoji}</div>
            <div style={{ fontSize:15, fontWeight:800, color:C.ink, marginBottom:4 }}>{o.title}</div>
            <div style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>{o.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (step === "buyer") return (
    <div style={{ minHeight:"100vh", background:C.cream, padding:"56px 24px 40px", overflowY:"auto" }}>
      <button onClick={() => setStep("role")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:C.muted, fontSize:14, marginBottom:24, padding:0 }}><ArrowLeft size={16}/> Geri</button>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.ink, marginBottom:4 }}>Profil oluştur ✨</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Birkaç saniye, hepsi bu kadar.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
        <Input label="Adın veya butik adın" placeholder="Örn: Nişantaşı Butik" value={form.name} onChange={upd("name")}/>
        <Input label="E-posta" placeholder="sen@butik.com" value={form.email} onChange={upd("email")}/>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:C.ink3, marginBottom:5 }}>Instagram (isteğe bağlı)</div>
          <div style={{ position:"relative" }}>
            <Instagram size={14} color={C.faint} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}/>
            <input style={{ width:"100%", height:46, borderRadius:C.radius.md, border:"1px solid rgba(0,0,0,0.12)", background:C.cream, padding:"0 14px 0 38px", fontSize:14, color:C.ink, outline:"none" }} placeholder="@kullaniciadı" value={form.ig} onChange={upd("ig")}/>
          </div>
        </div>
      </div>
      <div style={{ fontSize:13, fontWeight:700, color:C.ink, marginBottom:10 }}>İlgi alanların:</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:28 }}>
        {INTERESTS.map(i => (
          <button key={i} onClick={() => toggleInt(i)} style={{ padding:"7px 13px", borderRadius:C.radius.md, border:`1.5px solid ${form.interests.includes(i)?C.ink:"rgba(0,0,0,0.12)"}`, background:form.interests.includes(i)?C.ink:C.white, color:form.interests.includes(i)?C.white:C.ink3, fontSize:13, fontWeight:600, cursor:"pointer" }}>
            {i}
          </button>
        ))}
      </div>
      <Btn onClick={done} style={{ width:"100%" }}>Platforma Giriş Yap →</Btn>
    </div>
  );

  if (step === "seller") return (
    <div style={{ minHeight:"100vh", background:C.cream, padding:"56px 24px 40px", overflowY:"auto" }}>
      <button onClick={() => setStep("role")} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, color:C.muted, fontSize:14, marginBottom:24, padding:0 }}><ArrowLeft size={16}/> Geri</button>
      <h2 style={{ fontSize:22, fontWeight:900, color:C.ink, marginBottom:4 }}>{role==="seller_artist"?"Sanatçı Profili 🎨":"Üretici Kaydı 🏭"}</h2>
      <p style={{ fontSize:13, color:C.muted, marginBottom:24 }}>Doğrulanmış rozet için belgeni yükle.</p>
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
        <Input label={role==="seller_artist"?"Sanatçı adın":"Şirket / marka adı"} placeholder={role==="seller_artist"?"Elif Karadağ":"Anadolu Takı A.Ş."} value={form.name} onChange={upd("name")}/>
        <Input label="E-posta" placeholder="iletisim@firma.com" value={form.email} onChange={upd("email")}/>
        {role!=="seller_artist" && <Input label="Aylık üretim kapasitesi" placeholder="Örn: 5000 adet" value={form.capacity} onChange={upd("capacity")}/>}
      </div>
      {[{ k:"portfolio", label: role==="seller_artist"?"Portfolyo Yükle (PDF/JPG)":"Vergi Levhası Yükle", icon:"📄" }, { k:"taxDoc", label:"Banka Hesap Bilgisi", icon:"🏦" }].map(d => (
        <button key={d.k} onClick={() => setForm(f => ({ ...f, [d.k]: !f[d.k] }))}
          style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"13px 16px", borderRadius:C.radius.md, background:form[d.k]?C.sageLight:C.white, border:`1.5px solid ${form[d.k]?C.sage:"rgba(0,0,0,0.15)"}`, cursor:"pointer", marginBottom:10, textAlign:"left" }}>
          <span style={{ fontSize:20 }}>{form[d.k]?"✅":d.icon}</span>
          <span style={{ fontSize:13, fontWeight:600, color:form[d.k]?"#2e7d32":C.ink3, flex:1 }}>{d.label}</span>
          <Upload size={14} color={form[d.k]?C.sage:C.faint}/>
        </button>
      ))}
      <div style={{ padding:"12px 14px", borderRadius:C.radius.md, background:"#fff8e1", border:"1px solid #ffe082", marginBottom:24 }}>
        <p style={{ fontSize:12, color:"#92400e", lineHeight:1.5 }}>📋 Belgeler 24 saat içinde incelenir. Onaylanınca "Doğrulanmış Üretici" rozeti verilir.</p>
      </div>
      <Btn onClick={done} style={{ width:"100%" }}>Kaydı Tamamla →</Btn>
    </div>
  );

  return null;
}

// ─────────────────────────────────────────────────────────────────
// TIERED PRICE TABLE
// ─────────────────────────────────────────────────────────────────
function TierTable({ tiers, qty, unit }) {
  const active = [...tiers].reverse().find(t => qty >= t.min) || tiers[0];
  return (
    <div style={{ borderRadius:C.radius.md, overflow:"hidden", border:"1px solid rgba(0,0,0,0.09)", marginBottom:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 68px", padding:"7px 12px", background:C.cream2 }}>
        {["Miktar","Birim Fiyat","Tasarruf"].map(h => <span key={h} style={{ fontSize:10, fontWeight:700, color:"#7a6a50", letterSpacing:.5 }}>{h}</span>)}
      </div>
      {tiers.map((t, i) => {
        const isA = t === active, pct = Math.round((1-t.price/tiers[0].price)*100);
        return (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 68px", padding:"10px 12px", alignItems:"center", background:isA?C.ink:i%2?C.cream:"white", borderTop:"1px solid rgba(0,0,0,0.05)", transition:"background .2s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5 }}>
              {isA && <div style={{ width:5, height:5, borderRadius:"50%", background:"#4CAF50", flexShrink:0 }}/>}
              <span style={{ fontSize:12, fontWeight:isA?700:500, color:isA?"white":C.ink3 }}>{t.label} {unit}</span>
            </div>
            <span style={{ fontSize:14, fontWeight:800, color:isA?"#FFD700":C.ink }}>{fmtP(t.price)}<span style={{ fontSize:10, fontWeight:400, color:isA?"rgba(255,255,255,0.4)":C.faint }}>/{unit}</span></span>
            {pct > 0
              ? <div style={{ padding:"2px 6px", borderRadius:7, background:isA?"rgba(76,175,80,0.25)":"#e8f5e9", width:"fit-content" }}><span style={{ fontSize:10, fontWeight:700, color:isA?"#4CAF50":"#2e7d32" }}>-{pct}%</span></div>
              : <span style={{ fontSize:11, color:C.faint }}>—</span>}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PRODUCT DETAIL
// ─────────────────────────────────────────────────────────────────
function ProductDetail({ product, onClose, liked, onLike, addToast }) {
  const [qty, setQty] = useState(product.moq);
  const [added, setAdded] = useState(false);
  const [sampleModal, setSampleModal] = useState(false);
  const [sampleDone, setSampleDone] = useState(false);
  const [dmMsg, setDmMsg] = useState("");

  const activeTier = [...product.tiers].reverse().find(t => qty >= t.min) || product.tiers[0];
  const price = activeTier.price;
  const total = qty * price;
  const movOk = total >= product.mov;
  const setQ = v => setQty(Math.max(product.moq, v));

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:C.cream, overflowY:"auto" }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", position:"sticky", top:0, background:"rgba(250,248,244,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,0,0,0.06)", zIndex:5 }}>
        <button onClick={onClose} style={{ width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.07)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ArrowLeft size={15}/></button>
        <span style={{ fontSize:14, fontWeight:700 }}>Ürün Detayı</span>
        <button onClick={() => onLike(product.id)} style={{ width:36, height:36, borderRadius:"50%", background:liked?"#ff4458":"rgba(0,0,0,0.07)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Heart size={14} fill={liked?"white":"none"} color={liked?"white":C.ink}/>
        </button>
      </div>

      <div style={{ padding:"0 20px 140px" }}>
        {product.sponsored && (
          <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:8, background:"#fff8e1", border:"1px solid #ffe082", margin:"12px 0 0", width:"fit-content" }}>
            <Megaphone size={10} color="#f59e0b"/><span style={{ fontSize:10, fontWeight:700, color:"#92400e" }}>Öne Çıkan · {product.sponsorTag}</span>
          </div>
        )}

        {/* Hero */}
        <div style={{ height:220, borderRadius:C.radius.xl, background:"linear-gradient(135deg,#f0ebe0,#e8dfd0)", display:"flex", alignItems:"center", justifyContent:"center", margin:"12px 0", position:"relative", overflow:"hidden" }}>
          <div style={{ fontSize:100, opacity:.15, filter:"blur(2px)", position:"absolute" }}>{product.emoji}</div>
          <div style={{ fontSize:72, position:"relative", zIndex:2 }}>{product.emoji}</div>
        </div>

        {/* Seller */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:5 }}>
          {product.verified && <BadgeCheck size={13} color={C.sage} fill={C.sage}/>}
          <span style={{ fontSize:13, fontWeight:700 }}>{product.seller}</span>
          <Star size={11} fill="#FFB800" color="#FFB800"/>
          <span style={{ fontSize:12, fontWeight:700 }}>{product.rating}</span>
          <span style={{ fontSize:11, color:C.faint }}>({product.reviews})</span>
          <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:4, fontSize:11, color:C.muted }}>
            <MapPin size={10}/>{product.location}
          </div>
        </div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.ink, marginBottom:10 }}>{product.title}</h2>

        {/* Tiered pricing */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
          <TrendingDown size={13}/><span style={{ fontSize:13, fontWeight:800 }}>Kademeli Fiyat Tablosu</span>
          <Badge color="#e8f5e9" tc="#2e7d32" style={{ marginLeft:"auto" }}>Fazla al, az öde</Badge>
        </div>
        <TierTable tiers={product.tiers} qty={qty} unit={product.unit}/>

        {/* Qty selector */}
        <div style={{ background:C.ink, borderRadius:C.radius.xl, padding:18, marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
            <span style={{ fontSize:13, fontWeight:700, color:"white" }}>Adet Seç</span>
            <span style={{ fontSize:12, fontWeight:800, color:"#FFD700" }}>{fmtP(price)}/{product.unit}</span>
          </div>
          {/* Quick-select pills */}
          <div style={{ display:"flex", gap:6, marginBottom:12, overflowX:"auto", scrollbarWidth:"none" }}>
            {product.tiers.map((t, i) => {
              const isCur = qty >= t.min && (product.tiers[i+1] ? qty < product.tiers[i+1].min : true);
              return <button key={i} onClick={() => setQ(t.min)} style={{ flexShrink:0, padding:"5px 10px", borderRadius:9, border:"none", cursor:"pointer", background:isCur?"#FFD700":"rgba(255,255,255,0.12)", color:isCur?C.ink:"rgba(255,255,255,0.6)", fontSize:11, fontWeight:700 }}>{t.min}</button>;
            })}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={() => setQ(qty-1)} style={{ width:38, height:38, borderRadius:11, background:"rgba(255,255,255,0.15)", border:"none", color:"white", fontSize:20, cursor:"pointer" }}>−</button>
            <div style={{ flex:1, textAlign:"center" }}><span style={{ fontSize:26, fontWeight:900, color:"white" }}>{qty}</span><span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}> {product.unit}</span></div>
            <button onClick={() => setQ(qty+1)} style={{ width:38, height:38, borderRadius:11, background:"rgba(255,255,255,0.15)", border:"none", color:"white", fontSize:20, cursor:"pointer" }}>+</button>
          </div>
          <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid rgba(255,255,255,0.12)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div><div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>TOPLAM TUTAR</div><span style={{ fontSize:22, fontWeight:900, color:"white" }}>{fmtP(total)}</span></div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginBottom:2 }}>MİN. SEPET (MOV)</div>
              <div style={{ fontSize:13, fontWeight:700, color:movOk?"#4CAF50":"#ff8a80" }}>{movOk?"✓ ":""}{fmtP(product.mov)}</div>
            </div>
          </div>
        </div>

        {/* MOV warning */}
        {!movOk && (
          <div style={{ display:"flex", gap:9, padding:"11px 13px", borderRadius:C.radius.md, background:"#fff8e1", border:"1px solid #ffe082", marginBottom:12 }}>
            <AlertCircle size={14} color="#f59e0b" style={{ flexShrink:0, marginTop:1 }}/>
            <div style={{ fontSize:12, color:"#78350f", lineHeight:1.5 }}>Bu satıcıdan alışverişe devam etmek için sepetinize <strong>{fmtP(product.mov - total)}</strong> daha eklemelisiniz.</div>
          </div>
        )}

        {/* Sample-to-Scale */}
        {product.sampleOk && !sampleDone && (
          <Card style={{ padding:14, marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <Package size={14} color={C.purple}/>
              <span style={{ fontSize:13, fontWeight:800 }}>Sample-to-Scale 🔬</span>
              <Badge color={C.purpleLight} tc={C.purple} style={{ marginLeft:"auto" }}>Önce Dene</Badge>
            </div>
            <p style={{ fontSize:12, color:C.ink3, lineHeight:1.6, marginBottom:10 }}>Toplu siparişten önce 1 numune al. Havuza katılırsan numune bedeli ana siparişinden düşülür.</p>
            <Btn variant="primary" style={{ width:"100%", background:`linear-gradient(135deg,${C.purple},#6c5ce7)` }} onClick={() => setSampleModal(true)}>
              Numune İste · {fmtP(Math.round(product.price * 1.1))}
            </Btn>
          </Card>
        )}
        {sampleDone && (
          <div style={{ display:"flex", gap:8, alignItems:"center", padding:"11px 13px", borderRadius:C.radius.md, background:C.sageLight, border:"1px solid #a5d6a7", marginBottom:14 }}>
            <CheckCircle size={14} color="#2e7d32"/><span style={{ fontSize:12, color:"#1b5e20", fontWeight:600 }}>Numune talebiniz alındı — beğenirseniz bedel siparişten düşülür.</span>
          </div>
        )}

        {/* DM with seller */}
        <Card style={{ padding:14, marginBottom:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
            <MessageCircle size={13}/><span style={{ fontSize:13, fontWeight:800 }}>Satıcıya Mesaj / Medya Gönder</span>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:8 }}>
            {[{Icon:Image,l:"Fotoğraf"},{Icon:Video,l:"Video"},{Icon:FileText,l:"Dosya"}].map(({Icon,l}) => (
              <button key={l} onClick={() => addToast({ type:"info", message:`${l} seçici açıldı (demo)` })} style={{ flex:1, padding:"8px 0", borderRadius:10, background:"#f5f5f5", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
                <Icon size={14} color={C.muted}/><span style={{ fontSize:10, color:C.muted }}>{l}</span>
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:6 }}>
            <input value={dmMsg} onChange={e => setDmMsg(e.target.value)} placeholder="Soru veya not yaz…" style={{ flex:1, height:38, borderRadius:10, border:"1px solid rgba(0,0,0,0.1)", background:C.cream, padding:"0 12px", fontSize:13, outline:"none" }}/>
            <button onClick={() => { if(dmMsg.trim()){ addToast({type:"success", message:"Mesajın iletildi!"}); setDmMsg(""); }}} style={{ width:38, height:38, borderRadius:10, background:C.ink, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Send size={14} color="white"/>
            </button>
          </div>
        </Card>

        <p style={{ fontSize:13, color:C.ink3, lineHeight:1.7 }}>{product.desc}</p>
      </div>

      {/* CTA footer */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, maxWidth:430, margin:"0 auto", padding:"12px 16px 22px", background:"rgba(250,248,244,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(0,0,0,0.07)" }}>
        {!movOk && <div style={{ fontSize:11, color:"#f59e0b", fontWeight:600, textAlign:"center", marginBottom:6 }}>⚠ Min. {fmtP(product.mov)} tutara ulaşın</div>}
        <button disabled={!movOk} onClick={() => movOk && setAdded(true)}
          style={{ width:"100%", padding:"15px", borderRadius:C.radius.lg, border:"none", cursor:movOk?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontWeight:800, fontSize:15, transition:"all .3s", background:added?"#4a9a6a":movOk?C.ink:"#d0cec8", color:movOk?"white":"#9a9690" }}>
          {added ? <><BadgeCheck size={17} color="white"/>Sepete Eklendi ✓</> : <><ShoppingCart size={17} color={movOk?"white":"#9a9690"}/>{movOk ? `Sepete Ekle · ${fmtP(total)}` : "Minimum Tutara Ulaşın"}</>}
        </button>
      </div>

      {/* Sample modal */}
      {sampleModal && (
        <ModalSheet title="Numune Talep Et 🔬" onClose={() => setSampleModal(false)}>
          <div style={{ textAlign:"center", marginBottom:18 }}>
            <div style={{ fontSize:40, marginBottom:8 }}>📦</div>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.6 }}>1 adet numune için <strong>{fmtP(Math.round(product.price*1.1))}</strong> ödenir.<br/>Havuza katılırsan bu tutar ana siparişten düşülür.</p>
          </div>
          <Card style={{ padding:14, marginBottom:16 }}>
            {[["Numune Bedeli", fmtP(Math.round(product.price*1.1))],["Teslimat","3–5 iş günü"],["Havuza Katılırsan","Tutar düşülür ✓"]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid rgba(0,0,0,0.04)" }}>
                <span style={{ fontSize:13, color:C.muted }}>{k}</span><span style={{ fontSize:13, fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </Card>
          <Btn style={{ width:"100%", background:`linear-gradient(135deg,${C.purple},#6c5ce7)` }} onClick={() => { setSampleDone(true); setSampleModal(false); addToast({ type:"success", message:"Numune talebin iletildi! Satıcı 48 saat içinde yanıt verir." }); }}>
            Numune İste · {fmtP(Math.round(product.price*1.1))}
          </Btn>
        </ModalSheet>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// DISCOVER SCREEN
// ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
// LIVE AI TICKER  (animated horizontal scroll)
// ─────────────────────────────────────────────────────────────────
const TICKER_ITEMS = [
  "🪨 Doğal Taş Takılar +%34 (son 30 gün)",
  "🕯️ Mum Kategorisi +%52 büyüdü",
  "🚀 İstanbul içi hızlı üreticiler revaçta!",
  "💎 Kristal & Enerji Taşı +%28 trend",
  "🧵 Organik Keten Kumaş tükeniyor — havuza katıl!",
  "🏺 El Yapımı Seramik +%19 büyüdü",
];

function LiveTicker() {
  return (
    <div style={{ overflow:"hidden", background:"linear-gradient(90deg,#1a1a1a,#2d2d2d)", borderRadius:C.radius.md, height:32, display:"flex", alignItems:"center", marginBottom:12, position:"relative" }}>
      <div style={{ display:"flex", gap:40, whiteSpace:"nowrap", animation:"tickerScroll 28s linear infinite", paddingLeft:20 }}>
        {[...TICKER_ITEMS,...TICKER_ITEMS].map((t,i)=>(
          <span key={i} style={{ fontSize:11, color:"rgba(255,255,255,0.82)", fontWeight:500, display:"inline-flex", alignItems:"center", gap:6 }}>
            <span style={{ color:"#FFD700", fontWeight:700 }}>✨</span>{t}
          </span>
        ))}
      </div>
      {/* fade edges */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:24, background:"linear-gradient(90deg,#1a1a1a,transparent)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:24, background:"linear-gradient(270deg,#1a1a1a,transparent)", pointerEvents:"none" }}/>
    </div>
  );
}

function DiscoverScreen({ likedProducts, onLike, onOpenProduct, sponsoredProducts={} }) {
  const [filter, setFilter] = useState("all");
  const FILTERS = [
    {id:"all",label:"Tümü",icon:"◈"},{id:"low_moq",label:"Düşük MOQ",icon:"📦"},
    {id:"istanbul",label:"İstanbul",icon:"🗺️"},{id:"trending",label:"Trend",icon:"🔥"},
    {id:"verified",label:"Onaylı",icon:"✅"},{id:"sponsored",label:"Öne Çıkan",icon:"⭐"},
  ];
  const filtered = PRODUCTS.filter(p => {
    if (filter==="all") return true;
    if (filter==="low_moq") return p.moq <= 5;
    if (filter==="istanbul") return p.location==="İstanbul";
    if (filter==="trending") return p.trending;
    if (filter==="verified") return p.verified;
    if (filter==="sponsored") return p.sponsored || !!sponsoredProducts?.[p.id];
    return true;
  });

  return (
    <div style={{ paddingBottom:100 }}>
      {/* ── HERO BANNER ── */}
      <div style={{ margin:"0 0 0 0", padding:"20px 20px 0" }}>
        <div style={{ borderRadius:C.radius.xxl, overflow:"hidden", background:"linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 55%,#0d2818 100%)", padding:"24px 22px 20px", marginBottom:14, position:"relative" }}>
          {/* Decorative dots */}
          <div style={{ position:"absolute", top:16, right:16, display:"flex", gap:6 }}>
            {[C.gold, C.sage, C.purple].map((c,i)=>(
              <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:c, opacity:.7 }}/>
            ))}
          </div>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 10px", borderRadius:99, background:`${C.sage}25`, border:`1px solid ${C.sage}50`, marginBottom:10 }}>
            <div style={{ width:5, height:5, borderRadius:"50%", background:C.sage, animation:"pulseDot 2s infinite" }}/>
            <span style={{ fontSize:10, fontWeight:700, color:C.sage, letterSpacing:.8 }}>TÜRKİYE'NİN İLK B2B PLATFORM</span>
          </div>
          <h1 style={{ fontSize:22, fontWeight:900, color:"white", lineHeight:1.25, marginBottom:8, letterSpacing:-.3 }}>
            toptanla <span style={{ color:C.gold }}>—</span><br/>
            <span style={{ fontSize:15, fontWeight:500, color:"rgba(255,255,255,0.65)", letterSpacing:0 }}>Ortak satın alma ve sanat açık artırma platformu.</span>
          </h1>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6, marginBottom:16 }}>
            Butikler ve sanatçılar için yeni nesil ekosistem.
          </p>
          {/* Stats row */}
          <div style={{ display:"flex", gap:0, background:"rgba(255,255,255,0.07)", borderRadius:14, overflow:"hidden" }}>
            {[["2.400+","Aktif Butik"],["340","Üretici"],["₺12M+","İşlem Hacmi"]].map(([v,l],i)=>(
              <div key={l} style={{ flex:1, padding:"10px 0", textAlign:"center", borderRight: i<2?"1px solid rgba(255,255,255,0.1)":"none" }}>
                <div style={{ fontSize:15, fontWeight:900, color:C.gold }}>{v}</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", marginTop:1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live AI Ticker */}
        <LiveTicker/>

        {/* Search */}
        <div style={{ position:"relative", marginBottom:12 }}>
          <Search size={14} color={C.faint} style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)" }}/>
          <input placeholder="Ürün, satıcı veya kategori ara…" style={{ width:"100%", height:46, borderRadius:C.radius.md, border:"1px solid rgba(0,0,0,0.09)", background:C.white, paddingLeft:40, fontSize:13, outline:"none", boxShadow:C.shadow.sm }}/>
        </div>

        {/* AI insight panel */}
        <div style={{ borderRadius:C.radius.lg, padding:"12px 14px", marginBottom:12, background:"linear-gradient(135deg,#1a1a1a,#2d2d2d)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:9 }}>
            <Sparkles size={13} color="#FFD700"/>
            <span style={{ fontSize:12, fontWeight:800, color:"#FFD700" }}>AI Öneri — Son 30 Gün</span>
            <div style={{ marginLeft:"auto", padding:"2px 7px", borderRadius:8, background:"rgba(76,175,80,0.2)" }}>
              <span style={{ fontSize:9, fontWeight:800, color:"#4CAF50" }}>CANLI</span>
            </div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {[
              {e:"🪨",t:"Doğal Taş Takılar trend — 34 butik bu hafta sipariş verdi",v:"+%34"},
              {e:"🕯️",t:"Mum Kategorisi patlama yaptı — stok azalıyor",v:"+%52"},
              {e:"🚀",t:"İstanbul içi hızlı üreticiler revaçta — 1 günde teslimat",v:"🔥 Hot"},
            ].map((s,i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:9, background:"rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize:16, flexShrink:0 }}>{s.e}</span>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.72)", flex:1, lineHeight:1.4 }}>{s.t}</span>
                <span style={{ fontSize:11, fontWeight:800, color:"#4CAF50", flexShrink:0 }}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:7, overflowX:"auto", scrollbarWidth:"none", marginBottom:16 }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink:0, display:"flex", alignItems:"center", gap:5, padding:"7px 12px", borderRadius:12, border:filter===f.id?"none":"1px solid rgba(0,0,0,0.1)", background:filter===f.id?C.ink:C.white, color:filter===f.id?"white":C.ink3, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all .15s" }}>
              <span style={{ fontSize:13 }}>{f.icon}</span>{f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── PRODUCT CARDS — fixed equal height ── */}
      <div style={{ padding:"0 20px" }}>
        {filtered.map(p => {
          const isSponsored = p.sponsored || !!sponsoredProducts?.[p.id];
          const sponsorLabel = sponsoredProducts?.[p.id] || p.sponsorTag || "Öne Çıkan";
          return (
            <div key={p.id}
              style={{ borderRadius:C.radius.xl, overflow:"hidden", background:`linear-gradient(135deg,${C.cream},${C.cream2})`, border:`1.5px solid ${isSponsored?"rgba(245,158,11,0.35)":"rgba(0,0,0,0.07)"}`, marginBottom:14, cursor:"pointer", boxShadow:isSponsored?`0 0 0 1px rgba(245,158,11,0.15),${C.shadow.md}`:C.shadow.sm, display:"flex", flexDirection:"column" }}
              onClick={() => onOpenProduct(p)}>
              {/* Sponsored strip */}
              {isSponsored && (
                <div style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 14px", background:"linear-gradient(90deg,#fff8e1,#fffde7)", borderBottom:"1px solid #ffe082", flexShrink:0 }}>
                  <Megaphone size={10} color="#f59e0b"/>
                  <span style={{ fontSize:10, fontWeight:700, color:"#92400e" }}>Sponsorlu / Öne Çıkan · {sponsorLabel}</span>
                  <span style={{ marginLeft:"auto", fontSize:10, color:"#c88500" }}>⭐</span>
                </div>
              )}
              {/* Visual — FIXED height 200px */}
              <div style={{ height:200, background:"linear-gradient(160deg,#f8f4ee,#ede8dc)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0 }}>
                <div style={{ fontSize:86, opacity:.18, filter:"blur(1px)", position:"absolute" }}>{p.emoji}</div>
                <div style={{ fontSize:60, position:"relative", zIndex:2 }}>{p.emoji}</div>
                {p.trending && (
                  <div style={{ position:"absolute", top:10, left:10, display:"flex", alignItems:"center", gap:3, padding:"4px 8px", borderRadius:8, background:C.ink }}>
                    <TrendingUp size={9} color="white"/><span style={{ fontSize:10, fontWeight:700, color:"white" }}>TREND</span>
                  </div>
                )}
                <button style={{ position:"absolute", top:8, right:8, width:32, height:32, borderRadius:"50%", background:likedProducts.has(p.id)?"#ff4458":"rgba(255,255,255,0.88)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}
                  onClick={e => { e.stopPropagation(); onLike(p.id); }}>
                  <Heart size={13} fill={likedProducts.has(p.id)?"white":"none"} color={likedProducts.has(p.id)?"white":"#666"}/>
                </button>
                <div style={{ position:"absolute", bottom:8, right:8, padding:"3px 7px", borderRadius:7, background:C.red }}>
                  <span style={{ fontSize:10, fontWeight:800, color:"white" }}>%{Math.round((1-p.price/p.origPrice)*100)} İND</span>
                </div>
              </div>
              {/* Content — flex-col justify-between ensures uniform height */}
              <div style={{ padding:"12px 14px", display:"flex", flexDirection:"column", flex:1, justifyContent:"space-between" }}>
                <div>
                  {/* Seller row */}
                  <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:4 }}>
                    {p.verified && <BadgeCheck size={11} color={C.sage} fill={C.sage}/>}
                    <span style={{ fontSize:11, color:C.sage, fontWeight:600 }}>{p.seller}</span>
                    <span style={{ fontSize:11, color:C.faint }}>·</span>
                    <MapPin size={9} color={C.faint}/>
                    <span style={{ fontSize:11, color:C.faint }}>{p.location}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.ink, marginBottom:8, lineHeight:1.3 }}>{p.title}</div>
                  {/* Chip row */}
                  <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:3, padding:"4px 8px", borderRadius:8, background:C.ink }}>
                      <Package size={9} color="white"/>
                      <span style={{ fontSize:10, fontWeight:700, color:"white" }}>Min. {p.moq} {p.unit}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:3, padding:"4px 8px", borderRadius:8, background:p.delivery===1?C.sageLight:"#fff3e0" }}>
                      <Truck size={9} color={p.delivery===1?"#2e7d32":"#e65100"}/>
                      <span style={{ fontSize:10, fontWeight:600, color:p.delivery===1?"#2e7d32":"#e65100" }}>{p.delivery}g teslimat</span>
                    </div>
                  </div>
                </div>
                {/* Price row — always at bottom */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:8, borderTop:"1px solid rgba(0,0,0,0.05)" }}>
                  <div>
                    <span style={{ fontSize:18, fontWeight:800 }}>{fmtP(p.price)}</span>
                    <span style={{ fontSize:11, color:C.faint, textDecoration:"line-through", marginLeft:5 }}>{fmtP(p.origPrice)}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:3 }}>
                    <Star size={11} fill="#FFB800" color="#FFB800"/>
                    <span style={{ fontSize:12, fontWeight:700 }}>{p.rating}</span>
                    <span style={{ fontSize:11, color:C.faint }}>({p.reviews})</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// QR CERTIFICATE MODAL
// ─────────────────────────────────────────────────────────────────
function QRCertModal({ artwork, onClose }) {
  if (!artwork) return null;

  /* ── deterministic QR-like SVG generated from artwork id ── */
  const seed = artwork.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rng  = (i) => ((seed * 1103515245 + i * 12345) >>> 0) % 100;

  const MODULES = 21; // 21×21 version-1 QR matrix size
  // Fixed QR structural elements + pseudo-random data cells
  const isFinderCorner = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= MODULES - 7) || (r >= MODULES - 7 && c < 7);
  const isFinderBorder = (r, c) => {
    const inTL = r <= 7 && c <= 7;
    const inTR = r <= 7 && c >= MODULES - 8;
    const inBL = r >= MODULES - 8 && c <= 7;
    if (!inTL && !inTR && !inBL) return false;
    const lr = inTL ? r : inTR ? r : r - (MODULES - 8);
    const lc = inTL ? c : inTR ? c - (MODULES - 8) : c;
    return lr === 0 || lr === 6 || lc === 0 || lc === 6;
  };
  const isFinderFill  = (r, c) => {
    const inTL = r <= 7 && c <= 7;
    const inTR = r <= 7 && c >= MODULES - 8;
    const inBL = r >= MODULES - 8 && c <= 7;
    if (!inTL && !inTR && !inBL) return false;
    const lr = inTL ? r : inTR ? r : r - (MODULES - 8);
    const lc = inTL ? c : inTR ? c - (MODULES - 8) : c;
    return lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
  };
  const isTiming  = (r, c) => (r === 6 || c === 6) && !isFinderCorner(r, c);
  const isReserved = (r, c) => isFinderCorner(r, c) || isTiming(r, c);

  const cellColor = (r, c) => {
    if (isFinderBorder(r, c) || isFinderFill(r, c)) return "#1a1a1a";
    if (isTiming(r, c)) return (r + c) % 2 === 0 ? "#1a1a1a" : "none";
    if (isReserved(r, c)) return "none";
    // data cell — pseudo-random but stable per artwork
    return rng(r * MODULES + c + seed) < 52 ? "#1a1a1a" : "none";
  };

  const CELL = 9; // px per module
  const QR_SIZE = MODULES * CELL;
  const PADDING  = 12;
  const SVG_SIZE = QR_SIZE + PADDING * 2;

  const gold = artwork.accent || "#C9A84C";

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 28px" }}
      onClick={onClose}
    >
      {/* blurred backdrop */}
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.72)", backdropFilter:"blur(14px)" }}/>

      {/* modal card */}
      <div
        style={{ position:"relative", zIndex:1, background:"#0d0d1a", border:`1.5px solid ${gold}50`, borderRadius:C.radius.xxl, width:"100%", maxWidth:320, boxShadow:`0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px ${gold}20`, animation:"slideUp .25s ease", overflow:"hidden" }}
        onClick={e => e.stopPropagation()}
      >
        {/* header strip */}
        <div style={{ padding:"18px 20px 0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:32, height:32, borderRadius:10, background:`${gold}20`, border:`1px solid ${gold}40`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Shield size={15} color={gold}/>
            </div>
            <div>
              <div style={{ fontSize:12, fontWeight:800, color:"#f0f0ff", letterSpacing:.3 }}>Orijinallik Sertifikası</div>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>Dijital · Blok Zinciri Doğrulamalı</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.08)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <X size={13} color="rgba(255,255,255,0.6)"/>
          </button>
        </div>

        {/* QR code */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"18px 20px 0" }}>
          {/* outer glow ring */}
          <div style={{ padding:6, borderRadius:18, background:`linear-gradient(135deg,${gold}30,rgba(255,255,255,0.06))`, boxShadow:`0 0 28px ${gold}25` }}>
            <div style={{ background:"white", borderRadius:12, padding:PADDING, lineHeight:0 }}>
              <svg width={SVG_SIZE} height={SVG_SIZE} xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
                <rect width={SVG_SIZE} height={SVG_SIZE} fill="white"/>
                {Array.from({ length:MODULES }, (_, r) =>
                  Array.from({ length:MODULES }, (_, c) => {
                    const fill = cellColor(r, c);
                    if (fill === "none") return null;
                    return (
                      <rect
                        key={`${r}-${c}`}
                        x={PADDING + c * CELL}
                        y={PADDING + r * CELL}
                        width={CELL - 1}
                        height={CELL - 1}
                        rx={1.5}
                        fill={fill}
                      />
                    );
                  })
                )}
              </svg>
            </div>
          </div>

          {/* cert number */}
          <div style={{ marginTop:12, padding:"4px 12px", borderRadius:99, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.45)", letterSpacing:1.5, fontVariantNumeric:"tabular-nums" }}>
              CERT · TRT-{artwork.id.toUpperCase()}-{artwork.year}
            </span>
          </div>
        </div>

        {/* artwork meta */}
        <div style={{ padding:"14px 20px 0" }}>
          <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:14, padding:"12px 14px" }}>
            {[
              ["Eser",    artwork.title],
              ["Sanatçı", artwork.artist],
              ["Medium",  artwork.medium],
              ["Boyut",   artwork.size],
              ["Edisyon", artwork.edition],
            ].map(([k, v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{k}</span>
                <span style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.85)", textAlign:"right", maxWidth:"60%" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* green verified banner */}
        <div style={{ margin:"14px 20px", padding:"12px 14px", borderRadius:14, background:"linear-gradient(135deg,rgba(46,125,50,0.25),rgba(76,175,80,0.12))", border:"1px solid rgba(76,175,80,0.4)", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"rgba(76,175,80,0.2)", border:"1px solid rgba(76,175,80,0.5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <CheckCircle size={15} color="#4CAF50" fill="rgba(76,175,80,0.3)"/>
          </div>
          <div>
            <div style={{ fontSize:12, fontWeight:800, color:"#81C784", lineHeight:1.3 }}>Sanatçı imzalı dijital sertifika doğrulandı.</div>
            <div style={{ fontSize:11, color:"rgba(129,199,132,0.8)", marginTop:2 }}>Eser orijinaldir. ✓</div>
          </div>
        </div>

        {/* artist signature line */}
        <div style={{ margin:"0 20px 20px", padding:"10px 14px", borderRadius:12, background:`${gold}10`, border:`1px solid ${gold}30`, textAlign:"center" }}>
          <span style={{ fontSize:11, color:gold }}>✍️ <em style={{ fontFamily:"'Cormorant Garamond',serif" }}>{artwork.artist}</em> tarafından dijital olarak imzalanmıştır</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ART GALLERY SCREEN — Pinterest aesthetic, unique art distinction
// ─────────────────────────────────────────────────────────────────
function GalleryScreen({ addToast }) {
  const [selected,    setSelected]    = useState(null);
  const [certArtwork, setCertArtwork] = useState(null);
  const [showUpload,  setShowUpload]  = useState(false);
  const [uploadType, setUploadType] = useState("unique"); // "unique" | "wholesale"
  const [uploadForm, setUploadForm] = useState({ title:"", startPrice:"", buyNow:"", desc:"" });

  if (selected) return <ArtworkDetail artwork={selected} onClose={() => setSelected(null)} addToast={addToast}/>;

  return (
    <div style={{ paddingBottom:100 }}>
      {/* QR Certificate modal — rendered inside gallery */}
      {certArtwork && <QRCertModal artwork={certArtwork} onClose={() => setCertArtwork(null)}/>}
      {/* Header */}
      <div style={{ padding:"14px 20px 0" }}>
        <div style={{ borderRadius:C.radius.lg, padding:"14px 16px", marginBottom:14, background:"linear-gradient(135deg,#0d0d1a,#1a1a30)", border:"1px solid rgba(201,168,76,0.2)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:4 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><Palette size={14} color={C.gold}/><span style={{ fontSize:13, fontWeight:700, color:C.gold }}>Sanat Galerisi</span></div>
            <button onClick={() => setShowUpload(true)} style={{ display:"flex", alignItems:"center", gap:5, padding:"5px 10px", borderRadius:9, background:`${C.gold}20`, border:`1px solid ${C.gold}40`, cursor:"pointer" }}>
              <Plus size={11} color={C.gold}/><span style={{ fontSize:11, fontWeight:700, color:C.gold }}>Eser Ekle</span>
            </button>
          </div>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>Tekil eserler · Sertifikalı sanatçılar · Her parça imzalı</p>
        </div>

        {/* Unique art legend */}
        <div style={{ display:"flex", gap:8, marginBottom:14 }}>
          <Badge color="#fff8e1" tc="#92400e" icon="🖼️">Tekil Eser (Unique)</Badge>
          <Badge color={C.purpleLight} tc={C.purple} icon="🔢">Sınırlı Edisyon</Badge>
          <Badge color={C.sageLight} tc="#2e7d32" icon="📜">Sertifikalı</Badge>
        </div>
      </div>

      {/* Uniform 2-column grid — FIXED equal card heights */}
      <div style={{ padding:"0 20px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        {ARTWORKS.map((a) => {
          const isUnique = a.edition?.includes("Tekil");
          return (
            <div key={a.id} onClick={() => setSelected(a)}
              style={{ borderRadius:C.radius.lg, overflow:"hidden", background:"linear-gradient(135deg,#131325,#0f0f20)", border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer", display:"flex", flexDirection:"column", minHeight:300 }}>
              {/* Art visual — fixed 160px */}
              <div style={{ height:160, background:"linear-gradient(160deg,#1a1a30,#0d0d1a)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", flexShrink:0 }}>
                <div style={{ fontSize:110, opacity:.1, filter:"blur(3px)", position:"absolute", lineHeight:1 }}>{a.emoji}</div>
                <div style={{ fontSize:64, position:"relative", zIndex:2 }}>{a.emoji}</div>
                {a.status==="live" && (
                  <div style={{ position:"absolute", top:6, left:6, display:"flex", alignItems:"center", gap:2, padding:"3px 6px", borderRadius:6, background:"rgba(231,76,60,0.92)" }}>
                    <div style={{ width:4, height:4, borderRadius:"50%", background:"white", animation:"pulseDot 1.5s infinite" }}/>
                    <span style={{ fontSize:8, fontWeight:800, color:"white" }}>CANLI</span>
                  </div>
                )}
                {isUnique && (
                  <div style={{ position:"absolute", top:6, right:6, padding:"2px 6px", borderRadius:6, background:"rgba(255,215,0,0.18)", border:"1px solid rgba(255,215,0,0.5)" }}>
                    <span style={{ fontSize:8, fontWeight:800, color:"#FFD700" }}>UNIQUE</span>
                  </div>
                )}
              </div>
              {/* Info — flex-col justify-between for symmetry */}
              <div style={{ padding:"10px 11px", display:"flex", flexDirection:"column", flex:1, justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, color:a.accent, marginBottom:3 }}>{a.artist}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:"#f0f0ff", fontStyle:"italic", lineHeight:1.3, marginBottom:6, fontFamily:"'Cormorant Garamond',serif" }}>&ldquo;{a.title}&rdquo;</div>
                </div>
                {/* Bottom: cert badge + price row — always aligned */}
                <div>
                  {a.certified && (
                    <button
                      onClick={e => { e.stopPropagation(); setCertArtwork(a); }}
                      style={{ display:"flex", alignItems:"center", gap:3, marginBottom:6, background:"none", border:"none", cursor:"pointer", padding:"3px 6px", borderRadius:6, transition:"background .15s" }}
                      title="Sertifikayı doğrula"
                    >
                      <Shield size={9} color={a.accent}/>
                      <span style={{ fontSize:9, color:a.accent, fontWeight:700, textDecoration:"underline", textUnderlineOffset:2 }}>SERTİFİKALI</span>
                    </button>
                  )}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", paddingTop:6, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
                    <div>
                      <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>GÜNCEL</div>
                      <div style={{ fontSize:14, fontWeight:800, color:a.accent }}>{fmtP(a.currentBid)}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:9, color:"rgba(255,255,255,0.3)" }}>{a.bidCount} teklif</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <ModalSheet title="Eser / Ürün Ekle ✨" onClose={() => setShowUpload(false)}>
          {/* Type selector */}
          <div style={{ display:"flex", gap:8, marginBottom:16 }}>
            {[{id:"unique",label:"🖼️ Tekil Sanat Eseri",desc:"MOQ yok, açık artırma"},{id:"wholesale",label:"📦 Toptan Ürün",desc:"MOQ + kademeli fiyat"}].map(t => (
              <button key={t.id} onClick={() => setUploadType(t.id)}
                style={{ flex:1, padding:"12px 8px", borderRadius:C.radius.lg, border:`2px solid ${uploadType===t.id?C.ink:"rgba(0,0,0,0.1)"}`, background:uploadType===t.id?C.cream2:C.white, cursor:"pointer", textAlign:"left" }}>
                <div style={{ fontSize:13, fontWeight:800, color:C.ink, marginBottom:3 }}>{t.label}</div>
                <div style={{ fontSize:11, color:C.muted }}>{t.desc}</div>
              </button>
            ))}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Eser / Ürün Adı" placeholder={uploadType==="unique"?"Örn: Boğaz'ın Sesi #4":"Örn: El Dokuması Keten"} value={uploadForm.title} onChange={e=>setUploadForm(f=>({...f,title:e.target.value}))}/>

            {uploadType==="unique" ? (
              <>
                {/* Unique art fields */}
                <div style={{ padding:"10px 14px", borderRadius:12, background:"#fff8e1", border:"1px solid #ffe082", display:"flex", gap:8 }}>
                  <Tag size={13} color="#f59e0b" style={{ flexShrink:0, marginTop:2 }}/>
                  <div style={{ fontSize:12, color:"#78350f", lineHeight:1.5 }}>Bu eser <strong>"Unique Art / Artist Piece"</strong> rozeti alacak. MOQ alanı uygulanmaz — açık artırma veya hemen al fiyatı belirlenir.</div>
                </div>
                <Input label="Açık Artırma Başlangıç Fiyatı (₺)" placeholder="Örn: 5000" value={uploadForm.startPrice} onChange={e=>setUploadForm(f=>({...f,startPrice:e.target.value}))}/>
                <Input label="Hemen Al Fiyatı (₺)" placeholder="Örn: 15000" value={uploadForm.buyNow} onChange={e=>setUploadForm(f=>({...f,buyNow:e.target.value}))}/>
                <Input label="Eser Hikayesi (isteğe bağlı)" placeholder="Bu eseri nasıl yarattığını anlat…" value={uploadForm.desc} onChange={e=>setUploadForm(f=>({...f,desc:e.target.value}))}/>
              </>
            ) : (
              <>
                {/* Wholesale fields */}
                <Input label="Birim Fiyat (₺)" placeholder="Örn: 85" value={uploadForm.startPrice} onChange={e=>setUploadForm(f=>({...f,startPrice:e.target.value}))}/>
                <Input label="Minimum Sipariş Miktarı (MOQ)" placeholder="Örn: 5 adet" value={uploadForm.buyNow} onChange={e=>setUploadForm(f=>({...f,buyNow:e.target.value}))}/>
                <Input label="Ürün Açıklaması" placeholder="Malzeme, boyut, üretim süreci…" value={uploadForm.desc} onChange={e=>setUploadForm(f=>({...f,desc:e.target.value}))}/>
              </>
            )}

            {/* Media upload area */}
            <div style={{ border:"2px dashed rgba(0,0,0,0.15)", borderRadius:C.radius.lg, padding:"20px", textAlign:"center", background:C.cream2, cursor:"pointer" }}>
              <div style={{ fontSize:28, marginBottom:6 }}>📸</div>
              <div style={{ fontSize:13, fontWeight:600, color:C.muted }}>Fotoğraf & Video Yükle</div>
              <div style={{ fontSize:11, color:C.faint, marginTop:2 }}>JPG, PNG, MP4 — max 50MB</div>
            </div>
          </div>

          <Btn style={{ width:"100%", marginTop:20 }} onClick={() => {
            setShowUpload(false);
            addToast({ type:"success", message: uploadType==="unique" ? "Eseriniz galeride yayına alındı! 🎨" : "Toptan ürününüz listeye eklendi! 📦" });
          }}>
            {uploadType==="unique" ? "Galeri'ye Ekle → Açık Artırma Başlat" : "Toptan Ürün Olarak Yayınla"}
          </Btn>
        </ModalSheet>
      )}
    </div>
  );
}

function ArtCard({ artwork: a, onClick }) {
  const [rem, setRem] = useState(a.endsAt ? Math.max(0, a.endsAt-Date.now()) : a.endsIn*1000);
  const [certArtwork, setCertArtwork] = useState(null);
  useEffect(() => { const iv = setInterval(() => setRem(p => Math.max(0,p-1000)), 1000); return () => clearInterval(iv); }, []);
  const h = Math.floor(rem/3600000), m = Math.floor((rem%3600000)/60000), s = Math.floor((rem%60000)/1000);
  const urgent = rem < 300000;
  return (
    <>
      {certArtwork && <QRCertModal artwork={certArtwork} onClose={() => setCertArtwork(null)}/>}
    <div onClick={onClick} style={{ borderRadius:C.radius.xl, overflow:"hidden", background:"linear-gradient(135deg,#131325,#0f0f20)", border:"1px solid rgba(255,255,255,0.07)", cursor:"pointer", boxShadow:urgent?`0 0 20px ${a.accent}35`:"none", transition:"box-shadow .5s" }}>
      <div style={{ height:200, background:"linear-gradient(160deg,#1a1a30,#0d0d1a)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <div style={{ fontSize:86, opacity:.12, filter:"blur(2px)", position:"absolute" }}>{a.emoji}</div>
        <div style={{ fontSize:60, position:"relative", zIndex:2 }}>{a.emoji}</div>
        {a.status==="live" && <div style={{ position:"absolute", top:10, left:10, display:"flex", alignItems:"center", gap:4, padding:"4px 9px", borderRadius:8, background:"rgba(231,76,60,0.9)" }}><div style={{ width:5, height:5, borderRadius:"50%", background:"white", animation:"pulseDot 1.5s infinite" }}/><span style={{ fontSize:10, fontWeight:800, color:"white", letterSpacing:1 }}>CANLI</span></div>}
        <div style={{ position:"absolute", top:10, right:10 }}>
          <button
            onClick={e => { e.stopPropagation(); setCertArtwork(a); }}
            style={{ display:"flex", alignItems:"center", gap:3, padding:"4px 8px", borderRadius:8, background:`${a.accent}25`, border:`1px solid ${a.accent}50`, cursor:"pointer" }}
            title="Sertifikayı doğrula"
          >
            <Shield size={9} color={a.accent}/>
            <span style={{ fontSize:9, color:a.accent, fontWeight:700 }}>SERTİFİKALI ↗</span>
          </button>
        </div>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"8px 12px", background:"linear-gradient(transparent,rgba(0,0,0,0.82))", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={10} color={urgent?"#e74c3c":"rgba(255,255,255,0.6)"}/><span style={{ fontSize:12, fontWeight:800, color:urgent?"#e74c3c":"rgba(255,255,255,0.85)" }}>{String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}:{String(s).padStart(2,"0")}</span></div>
          <div style={{ display:"flex", alignItems:"center", gap:3 }}><Eye size={10} color="rgba(255,255,255,0.45)"/><span style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>{a.watcherCount}</span></div>
        </div>
      </div>
      <div style={{ padding:"13px 15px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}><span style={{ fontSize:11, fontWeight:700, color:a.accent }}>{a.artist}</span><span style={{ fontSize:10, color:"rgba(255,255,255,0.25)" }}>· {a.medium} · {a.edition}</span></div>
        <div style={{ fontSize:16, fontWeight:600, color:"#f0f0ff", marginBottom:10, fontStyle:"italic", fontFamily:"'Cormorant Garamond',serif" }}>&ldquo;{a.title}&rdquo;</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
          <div><div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:2 }}>GÜNCEL TEKLİF</div><div style={{ fontSize:19, fontWeight:800, color:a.accent }}>{fmtP(a.currentBid)}</div></div>
          <div style={{ textAlign:"right" }}><div style={{ fontSize:10, color:"rgba(255,255,255,0.35)", marginBottom:2 }}>{a.bidCount} TEKLİF</div><div style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Şimdi Al {fmtP(a.buyNow)}</div></div>
        </div>
      </div>
    </div>
    </>
  );
}

function ArtworkDetail({ artwork: initA, onClose, addToast }) {
  const [artwork, setArtwork] = useState({ ...initA, endsAt: Date.now() + initA.endsIn*1000 });
  const [provisionPaid, setProvisionPaid] = useState(false);
  const [isOut, setIsOut] = useState(false);
  const [bidAmt, setBidAmt] = useState(initA.currentBid + 500);
  const [showCert, setShowCert] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const STORY_STEPS = ["🎨 Konsept","✏️ Eskiz","🖌️ Uygulama","🔏 İmzalama","📜 Sertifika"];

  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() < 0.2) {
        const inc = [500,1000,1500][Math.floor(Math.random()*3)];
        setArtwork(a => {
          const nb = a.currentBid + inc, remMs = a.endsAt - Date.now();
          const newEnd = remMs < 10000 ? a.endsAt + 30000 : a.endsAt;
          if (remMs < 10000) addToast({ type:"warn", message:"Son saniye teklifi! Süre +30 saniye uzatıldı." });
          else addToast({ type:"info", message:`Yeni teklif: ${fmtP(nb)}` });
          return { ...a, currentBid:nb, bidCount:a.bidCount+1, endsAt:newEnd };
        });
      }
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const handleBid = () => {
    if (!provisionPaid) { addToast({ type:"warn", message:"Önce ₺500 provizyon ödemesini onayla." }); return; }
    if (isOut) return;
    const nb = artwork.currentBid + 500;
    setArtwork(a => ({ ...a, currentBid:nb, bidCount:a.bidCount+1 }));
    setBidAmt(nb + 500);
    addToast({ type:"success", message:`Teklifiniz verildi: ${fmtP(nb)}` });
  };

  const bg="#0d0d1a", surf2="#1a1a30", gold=artwork.accent;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:bg, overflowY:"auto", color:"white" }}>
      <style>{`@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.25}}`}</style>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px", position:"sticky", top:0, background:"rgba(13,13,26,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.06)", zIndex:5 }}>
        <button onClick={onClose} style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.08)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ArrowLeft size={15} color="white"/></button>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", background:"#e74c3c", animation:"pulseDot 1.5s infinite" }}/>
          <span style={{ fontSize:11, fontWeight:800, color:"#e74c3c", letterSpacing:2 }}>CANLI AÇIK ARTIRMA</span>
        </div>
        <button onClick={() => setShowCert(true)} style={{ width:36, height:36, borderRadius:"50%", background:`${gold}20`, border:`1px solid ${gold}40`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <FileText size={14} color={gold}/>
        </button>
      </div>

      <div style={{ padding:"0 20px 120px" }}>
        {/* Story strip */}
        <div style={{ display:"flex", gap:10, overflowX:"auto", scrollbarWidth:"none", padding:"14px 0 4px" }}>
          {STORY_STEPS.map((step, i) => (
            <div key={i} onClick={() => setStoryStep(i)} style={{ flexShrink:0, textAlign:"center", cursor:"pointer" }}>
              <div style={{ width:58, height:90, borderRadius:13, background:`linear-gradient(160deg,${surf2},#0f0f22)`, border:`2px solid ${storyStep===i?gold:"rgba(255,255,255,0.1)"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:4, transition:"border-color .2s", position:"relative" }}>
                {step.split(" ")[0]}
                {storyStep===i && <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:gold, borderRadius:"0 0 10px 10px" }}/>}
              </div>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.4)", lineHeight:1.3, maxWidth:58 }}>{step.split(" ").slice(1).join(" ")}</div>
            </div>
          ))}
        </div>

        {/* Artwork visual */}
        <div style={{ height:230, borderRadius:C.radius.xl, background:`linear-gradient(135deg,${surf2},#0f0f22)`, border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", margin:"12px 0", position:"relative", overflow:"hidden" }}>
          <div style={{ fontSize:110, opacity:.12, filter:"blur(2px)", position:"absolute" }}>{artwork.emoji}</div>
          <div style={{ fontSize:78, position:"relative", zIndex:2 }}>{artwork.emoji}</div>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"9px 14px", background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", gap:6 }}>
            <Shield size={11} color={gold}/><span style={{ fontSize:11, color:gold, fontWeight:600 }}>Sanatçı tarafından imzalanmış dijital sertifika dahildir</span>
          </div>
        </div>

        {/* Artist + title */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:`${gold}20`, border:`1px solid ${gold}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>🎨</div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:14, fontWeight:700 }}>{artwork.artist}</span><div style={{ padding:"2px 6px", borderRadius:6, background:`${gold}20`, border:`1px solid ${gold}40` }}><span style={{ fontSize:10, color:gold, fontWeight:700 }}>Skor: {artwork.artistScore}</span></div></div>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>{artwork.year} · {artwork.medium} · {artwork.size} · {artwork.provenance}</span>
          </div>
        </div>
        <h1 style={{ fontSize:24, fontWeight:600, color:"white", fontStyle:"italic", marginBottom:4, fontFamily:"'Cormorant Garamond',serif" }}>&ldquo;{artwork.title}&rdquo;</h1>

        {/* Artist story */}
        <div style={{ padding:"12px 14px", borderRadius:C.radius.md, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", marginBottom:14 }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4, letterSpacing:.5 }}>SANATÇI HİKAYESİ</div>
          <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", lineHeight:1.65 }}>{artwork.story}</p>
        </div>

        {/* FOMO watchers */}
        <div style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 12px", borderRadius:10, background:"rgba(123,104,238,0.12)", border:"1px solid rgba(123,104,238,0.25)", marginBottom:14 }}>
          <Eye size={12} color={C.purple}/><span style={{ fontSize:12, color:"rgba(255,255,255,0.7)", fontWeight:600 }}><strong style={{ color:"white" }}>{artwork.watcherCount}</strong> kişi şu an izliyor · <strong style={{ color:"white" }}>{artwork.bidCount}</strong> aktif teklif</span>
        </div>

        {/* Countdown */}
        <div style={{ background:surf2, borderRadius:C.radius.lg, padding:14, marginBottom:12, border:"1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}><div style={{ display:"flex", alignItems:"center", gap:5 }}><Clock size={13} color={gold}/><span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Kapanışa Kalan</span></div><span style={{ fontSize:11, color:"rgba(255,255,255,0.4)" }}>Anti-Snipe aktif</span></div>
          <Countdown endsAt={artwork.endsAt} accentColor={gold}/>
        </div>

        {/* Current bid */}
        <div style={{ background:surf2, borderRadius:C.radius.lg, padding:16, marginBottom:12, border:`1px solid ${gold}25` }}>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>GÜNCEL EN YÜKSEK TEKLİF</div>
          <div style={{ fontSize:34, fontWeight:800, color:gold, marginBottom:10 }}>{fmtP(artwork.currentBid)}</div>
          {artwork.topBidders.map((b,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 8px", borderRadius:8, background:b.isUser?`${gold}18`:"transparent" }}>
              <span style={{ fontSize:12, fontWeight:800, color:i===0?gold:"rgba(255,255,255,0.3)", width:18 }}>{i+1}.</span>
              <span style={{ flex:1, fontSize:12, color:b.isUser?gold:"rgba(255,255,255,0.55)" }}>{b.name}{b.isUser?" 👤":""}</span>
              <Shield size={10} color="rgba(255,255,255,0.3)"/><span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{b.score}</span>
              <span style={{ fontSize:13, fontWeight:700, color:i===0?gold:"rgba(255,255,255,0.4)" }}>{fmtP(b.amount)}</span>
            </div>
          ))}
        </div>

        {/* Provision */}
        {!provisionPaid && (
          <div style={{ padding:"12px 14px", borderRadius:C.radius.md, background:`${gold}10`, border:`1px solid ${gold}25`, marginBottom:12 }}>
            <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
              <CreditCard size={14} color={gold} style={{ flexShrink:0, marginTop:2 }}/>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:gold, marginBottom:2 }}>₺500 Ön Provizyon Gerekli</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", lineHeight:1.5 }}>Kazanırsan fiyata sayılır, kaybedersen iade edilir. Trol teklifleri engeller.</div>
                <button onClick={() => { setProvisionPaid(true); addToast({ type:"success", message:"₺500 provizyon onaylandı!" }); }} style={{ marginTop:8, padding:"6px 14px", borderRadius:8, background:gold, border:"none", color:"#0d0d1a", fontSize:12, fontWeight:800, cursor:"pointer" }}>Onayla</button>
              </div>
            </div>
          </div>
        )}

        {/* Bid input */}
        {!isOut && (
          <div style={{ display:"flex", gap:8, marginBottom:10, alignItems:"center" }}>
            <div style={{ flex:1, display:"flex", alignItems:"center", background:surf2, border:`1px solid ${gold}35`, borderRadius:C.radius.md, padding:"0 14px" }}>
              <span style={{ color:gold, fontWeight:800, fontSize:16, marginRight:4 }}>₺</span>
              <input type="number" value={bidAmt} onChange={e => setBidAmt(Number(e.target.value))} style={{ flex:1, background:"none", border:"none", outline:"none", color:"white", fontSize:18, fontWeight:700, padding:"13px 0" }}/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
              {[500,1000,2000].map(inc => <button key={inc} onClick={() => setBidAmt(p=>p+inc)} style={{ padding:"4px 8px", borderRadius:8, background:surf2, border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.5)", fontSize:10, cursor:"pointer", fontWeight:700 }}>+{fmtN(inc)}</button>)}
            </div>
          </div>
        )}

        {!isOut ? (
          <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:20 }}>
            <button onClick={handleBid} style={{ padding:"15px", borderRadius:C.radius.lg, background:provisionPaid?gold:`${gold}45`, border:"none", color:"#0d0d1a", fontSize:15, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Gavel size={17} color="#0d0d1a"/> Teklif Ver — {fmtP(bidAmt)}
            </button>
            <button onClick={() => addToast({ type:"success", message:`Şimdi Al: ${fmtP(artwork.buyNow)}` })} style={{ padding:"13px", borderRadius:C.radius.lg, background:"transparent", border:`1.5px solid ${gold}`, color:gold, fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Zap size={15} color={gold}/> Şimdi Al — {fmtP(artwork.buyNow)}
            </button>
            <button onClick={() => { setIsOut(true); addToast({ type:"info", message:"Çekildiniz. Güven skorunuz korundu." }); }} style={{ padding:"12px", borderRadius:C.radius.lg, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.4)", fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <TrendingDown size={14} color="rgba(255,255,255,0.3)"/> Çekiliyorum — Onurlu Çıkış
            </button>
          </div>
        ) : (
          <div style={{ padding:20, borderRadius:C.radius.lg, background:"rgba(255,255,255,0.04)", textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🤝</div>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:4 }}>Onurlu Çıkış Yaptınız</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>Güven skorunuz güncellendi.</div>
          </div>
        )}
      </div>

      {showCert && <QRCertModal artwork={artwork} onClose={() => setShowCert(false)}/>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AUTH GUARD MODAL (blur overlay quick register)
// ─────────────────────────────────────────────────────────────────
function AuthGuardModal({ onClose, onAuth }) {
  const [form, setForm] = useState({ name:"", email:"", phone:"" });
  const upd = k => e => setForm(f=>({...f,[k]:e.target.value}));
  const submit = () => {
    if (!form.name || !form.email) return;
    onAuth({ name:form.name, email:form.email, role:"buyer", interests:[] });
    onClose();
  };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      {/* Blurred backdrop */}
      <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(12px)" }} onClick={onClose}/>
      <div style={{ position:"relative", zIndex:1, background:C.cream, borderRadius:C.radius.xxl, padding:"28px 24px", width:"100%", maxWidth:360, boxShadow:C.shadow.lg, animation:"slideUp .25s" }}>
        <div style={{ textAlign:"center", marginBottom:20 }}>
          <div style={{ fontSize:40, marginBottom:8 }}>🔐</div>
          <div style={{ fontSize:18, fontWeight:800, color:C.ink, marginBottom:4 }}>Hızlı Kayıt / Giriş</div>
          <div style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>Devam etmek için bilgilerini gir.<br/>10 saniyede tamamlanır.</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          <Input label="Adın" placeholder="Nişantaşı Butik" value={form.name} onChange={upd("name")}/>
          <Input label="E-posta" placeholder="sen@butik.com" value={form.email} onChange={upd("email")}/>
          <Input label="Telefon (isteğe bağlı)" placeholder="+90 5xx xxx xx xx" value={form.phone} onChange={upd("phone")}/>
        </div>
        <Btn style={{ width:"100%" }} onClick={submit} disabled={!form.name||!form.email}>
          Giriş Yap & Devam Et →
        </Btn>
        <div style={{ display:"flex", gap:8, marginTop:10 }}>
          {[{s:"G",l:"Google"},{s:"A",l:"Apple"}].map(x=>(
            <button key={x.s} onClick={submit} style={{ flex:1, padding:"10px 0", borderRadius:C.radius.md, background:x.s==="A"?C.ink:C.white, border:`1.5px solid ${x.s==="A"?"transparent":"rgba(0,0,0,0.15)"}`, color:x.s==="A"?"white":"#444", fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
              <span style={{ fontWeight:900 }}>{x.s}</span>{x.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────
function PoolScreen({ user, addToast, userPools, setUserPools, onNeedAuth }) {
  const [pools, setPools] = useState(POOLS.map(p => ({ ...p, joined:false, userQty:0 })));
  const [joinTarget, setJoinTarget] = useState(null);
  const [exitTarget, setExitTarget] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [joinQty, setJoinQty] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const openJoin = pool => {
    if (!user) { onNeedAuth(); return; }
    setJoinQty(pool.minPer); setAgreed(false); setJoinTarget(pool);
  };

  const confirmJoin = () => {
    if (!agreed) return;
    const p = joinTarget;
    const newFilled = Math.min(p.target, p.filled + joinQty);
    setPools(prev => prev.map(x => x.id===p.id ? {...x, filled:newFilled, participants:x.participants+1, joined:true, userQty:joinQty} : x));
    setUserPools(prev => [...prev.filter(x=>x.id!==p.id), {...p, userQty:joinQty, joinedAt:new Date().toLocaleString("tr-TR")}]);
    const rem = p.target - newFilled;
    setJoinTarget(null);
    setConfetti(true);
    setSuccessMsg({ title:p.title, remaining:Math.max(0,rem), unit:p.unit });
    addToast({ type:"success", message:rem>0?`Havuza katıldın! ${fmtN(rem)} ${p.unit} daha gerekli.`:"Havuz doldu — üretim başlıyor! 🏭" });
    setTimeout(() => setConfetti(false), 3500);
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const tryExit = pool => {
    const pct = Math.round((pool.filled/pool.target)*100);
    if (pct >= 90 || pool.deadlineH <= 24) { addToast({ type:"warn", message:`Havuz %${pct} dolu veya son 24 saat — çıkış yapılamaz.` }); return; }
    setExitTarget(pool);
  };

  const confirmExit = () => {
    const p = exitTarget;
    setPools(prev => prev.map(x => x.id===p.id ? {...x, filled:Math.max(0,x.filled-x.userQty), participants:Math.max(0,x.participants-1), joined:false, userQty:0} : x));
    setUserPools(prev => prev.filter(x=>x.id!==p.id));
    setExitTarget(null);
    addToast({ type:"success", message:"Havuzdan ayrıldın. Ödeme 3 iş günü içinde iade edilir." });
  };

  return (
    <div style={{ paddingBottom:100 }}>
      <Confetti active={confetti}/>

      {/* Hero */}
      <div style={{ margin:"14px 20px 0", borderRadius:C.radius.xl, padding:"18px 20px", background:"linear-gradient(135deg,#1a1a1a,#2d2d2d)", color:"white" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}><Users size={15} color="#FFD700"/><span style={{ fontSize:14, fontWeight:800 }}>Toptan Havuzu</span><div style={{ marginLeft:"auto", padding:"3px 8px", borderRadius:8, background:"rgba(255,215,0,0.15)", border:"1px solid rgba(255,215,0,0.3)" }}><span style={{ fontSize:10, fontWeight:700, color:"#FFD700" }}>🔗 Birleştirici Güç</span></div></div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.6)", lineHeight:1.6, marginBottom:12 }}>Büyük üreticilerin minimumları çok yüksek mi? Diğer butiklerle birleşin.</p>
        <div style={{ display:"flex", gap:16 }}>
          {[["3","Aktif Havuz"],["16","Katılımcı"],["%35","Ort. Tasarruf"]].map(([v,l]) => <div key={l}><div style={{ fontSize:18, fontWeight:900, color:"#FFD700" }}>{v}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{l}</div></div>)}
        </div>
      </div>

      {/* How it works */}
      <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none", padding:"14px 20px 0" }}>
        {[{n:"1",e:"🔍",t:"Havuzu bul"},{n:"2",e:"📋",t:"Adetini rezerve et"},{n:"3",e:"👥",t:"Havuz dolsun"},{n:"4",e:"🏭",t:"Üretim başlar"}].map((s,i) => (
          <div key={i} style={{ flexShrink:0, width:86, padding:"10px 8px", borderRadius:C.radius.md, background:"white", border:"1px solid rgba(0,0,0,0.08)", textAlign:"center" }}>
            <div style={{ fontSize:20, marginBottom:4 }}>{s.e}</div>
            <div style={{ width:15, height:15, borderRadius:"50%", background:C.ink, color:"white", fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 4px" }}>{s.n}</div>
            <div style={{ fontSize:10, fontWeight:700, color:C.ink, lineHeight:1.3 }}>{s.t}</div>
          </div>
        ))}
      </div>

      {/* Create pool CTA */}
      <div style={{ padding:"14px 20px 0" }}>
        <button onClick={() => setCreateOpen(true)} style={{ width:"100%", padding:"13px", borderRadius:C.radius.lg, background:C.cream2, border:`1.5px dashed rgba(0,0,0,0.2)`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <Plus size={15} color={C.ink3}/><span style={{ fontSize:13, fontWeight:700, color:C.ink3 }}>Yeni Havuz Başlat</span>
        </button>
      </div>

      {/* Pool cards */}
      <div style={{ padding:"14px 20px 0" }}>
        {pools.map(pool => {
          const pct = Math.min(100, Math.round((pool.filled/pool.target)*100));
          const canExit = pct < 90 && pool.deadlineH > 24;
          const almostFull = pct >= 75;
          return (
            <Card key={pool.id} style={{ marginBottom:14, overflow:"hidden", boxShadow:almostFull?`0 0 0 2px ${pool.accent}40`:C.shadow.sm }}>
              <div style={{ padding:"16px 16px 0" }}>
                {/* FOMO bar */}
                <div style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 10px", borderRadius:9, background:"#f9f0ff", border:"1px solid #e1bee7", marginBottom:12 }}>
                  <Eye size={11} color={C.purple}/>
                  <span style={{ fontSize:11, color:"#6a1b9a", fontWeight:600 }}><strong>{pool.watchers}</strong> kişi inceliyor · <strong>{pool.interested}</strong> kişi sepetine ekledi</span>
                </div>
                <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                  <div style={{ width:46, height:46, borderRadius:13, background:`${pool.accent}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{pool.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:800, color:C.ink, lineHeight:1.3, marginBottom:2 }}>{pool.title}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{pool.seller}</div>
                  </div>
                  {almostFull && <Badge color="#fff3e0" tc="#e65100">🔥 Doluyor</Badge>}
                </div>
                {/* Progress */}
                <div style={{ marginBottom:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:12, fontWeight:700 }}>{fmtN(pool.filled)} / {fmtN(pool.target)} {pool.unit}</span>
                    <span style={{ fontSize:13, fontWeight:900, color:pool.accent }}>{pct}%</span>
                  </div>
                  <div style={{ height:10, borderRadius:99, background:"#f0f0f0", overflow:"hidden", position:"relative" }}>
                    <div style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${pool.accent},${pool.accent}cc)`, width:`${pct}%`, transition:"width .6s", position:"relative", overflow:"hidden" }}>
                      <div style={{ position:"absolute", top:0, bottom:0, width:"40%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)", animation:"shimmer 2s infinite", left:"-40%" }}/>
                    </div>
                  </div>
                  {pct >= 90 && <div style={{ fontSize:11, color:pool.accent, fontWeight:700, marginTop:4 }}>🔒 %90 doldu — çıkış artık yapılamaz</div>}
                </div>
                {/* Chips */}
                <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:12 }}>
                  <Badge color="#f5f5f5" tc={C.ink3} icon="👥">{pool.participants}/{pool.maxParticipants} butik</Badge>
                  <Badge color="#f5f5f5" tc={C.ink3} icon="⏱">{pool.deadlineH}s kaldı</Badge>
                  <Badge color={C.sageLight} tc="#2e7d32" icon="📉">{pool.savings} ucuz</Badge>
                  {pool.sampleOk && <Badge color={C.purpleLight} tc={C.purple} icon="🔬">Numune Mevcut</Badge>}
                </div>
                <div style={{ fontSize:20, fontWeight:900, marginBottom:4 }}>{fmtP(pool.unitPrice)} <span style={{ fontSize:12, fontWeight:400, color:C.faint }}>/ {pool.unit}</span></div>
                <div style={{ fontSize:12, color:C.ink3, lineHeight:1.5, marginBottom:12 }}>{pool.desc}</div>
              </div>
              <div style={{ padding:"0 16px 16px", display:"flex", gap:8 }}>
                {pool.joined ? (
                  <button onClick={() => tryExit(pool)} style={{ flex:1, padding:"12px", borderRadius:C.radius.md, background:canExit?C.redLight:"#f5f5f5", border:`1px solid ${canExit?"#ffcdd2":"rgba(0,0,0,0.1)"}`, color:canExit?"#c62828":"#aaa", fontSize:13, fontWeight:700, cursor:canExit?"pointer":"not-allowed" }}>
                    {canExit?"Havuzdan Çık":"Çıkış Engellendi 🔒"}
                  </button>
                ) : (
                  <button onClick={() => openJoin(pool)} style={{ flex:1, padding:"12px", borderRadius:C.radius.md, background:C.ink, border:"none", color:"white", fontSize:13, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                    <Users size={13} color="white"/>Havuza Katıl · {fmtN(pool.target-pool.filled)} {pool.unit} kaldı
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Join modal */}
      {joinTarget && (
        <ModalSheet title={`${joinTarget.emoji} ${joinTarget.title}`} onClose={() => setJoinTarget(null)}>
          <div style={{ textAlign:"center", marginBottom:14 }}>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>Havuza katılmak istediğin miktarı seç.<br/>Min {joinTarget.minPer} — Max {joinTarget.maxPer} {joinTarget.unit}</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14, background:C.cream2, borderRadius:C.radius.md, padding:"12px 14px" }}>
            <button onClick={() => setJoinQty(q => Math.max(joinTarget.minPer, q-joinTarget.minPer))} style={{ width:36, height:36, borderRadius:10, background:C.white, border:"1px solid rgba(0,0,0,0.1)", fontSize:20, cursor:"pointer" }}>−</button>
            <div style={{ flex:1, textAlign:"center" }}><div style={{ fontSize:26, fontWeight:900 }}>{joinQty}</div><div style={{ fontSize:11, color:C.muted }}>{joinTarget.unit}</div></div>
            <button onClick={() => setJoinQty(q => Math.min(joinTarget.maxPer, q+joinTarget.minPer))} style={{ width:36, height:36, borderRadius:10, background:C.white, border:"1px solid rgba(0,0,0,0.1)", fontSize:20, cursor:"pointer" }}>+</button>
          </div>
          <Card style={{ padding:"12px 14px", marginBottom:14 }}>
            {[["Birim Fiyat",`${fmtP(joinTarget.unitPrice)} / ${joinTarget.unit}`],["Toplam",fmtP(joinQty*joinTarget.unitPrice)],["Tasarruf",joinTarget.savings],["Güvence","Escrow — ürün onayına kadar platformda"]].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(0,0,0,0.04)" }}>
                <span style={{ fontSize:12, color:C.muted }}>{k}</span><span style={{ fontSize:12, fontWeight:700 }}>{v}</span>
              </div>
            ))}
          </Card>
          <button onClick={() => setAgreed(a=>!a)} style={{ display:"flex", alignItems:"flex-start", gap:10, width:"100%", border:"none", background:"none", cursor:"pointer", textAlign:"left", padding:0, marginBottom:16 }}>
            <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${agreed?C.ink:"rgba(0,0,0,0.25)"}`, background:agreed?C.ink:"transparent", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", marginTop:1 }}>
              {agreed && <CheckCircle size={11} color="white"/>}
            </div>
            <span style={{ fontSize:12, color:C.muted, lineHeight:1.5 }}>Havuz kurallarını okudum: %90 doluluktan sonra ve son 24 saatte çıkış yapılamaz. Ödeme escrow ile güvencede tutulur.</span>
          </button>
          <Btn style={{ width:"100%" }} disabled={!agreed} onClick={confirmJoin}>
            Havuza Katıl · {fmtP(joinQty * joinTarget.unitPrice)}
          </Btn>
        </ModalSheet>
      )}

      {/* Exit modal */}
      {exitTarget && (
        <ModalSheet title="Havuzdan Ayrıl 🚪" onClose={() => setExitTarget(null)}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontSize:40, marginBottom:10 }}>🚪</div>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>Ayrılırsan yeriniz serbest kalır. Ödemen 3 iş günü içinde iade edilir.</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="ghost" style={{ flex:1 }} onClick={() => setExitTarget(null)}>İptal</Btn>
            <Btn variant="danger" style={{ flex:1 }} onClick={confirmExit}>Ayrıl</Btn>
          </div>
        </ModalSheet>
      )}

      {/* Create pool modal */}
      {createOpen && (
        <ModalSheet title="Yeni Havuz Başlat ✨" onClose={() => setCreateOpen(false)}>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Ürün / Hammadde Adı" placeholder="Örn: Organik Pamuk Kumaş"/>
            <Input label="Hedef Miktar" placeholder="Örn: 1000 metre"/>
            <Input label="Birim Fiyat (₺)" placeholder="Örn: 25"/>
            <Input label="Kayıtlı Üretici Seç veya Öner" placeholder="Üretici adı veya öner…"/>
            <Input label="Kişi Başı Min. Miktar" placeholder="Örn: 50"/>
            <Input label="Havuz Süresi (Saat)" placeholder="Örn: 72"/>
          </div>
          <Btn style={{ width:"100%", marginTop:20 }} onClick={() => { setCreateOpen(false); addToast({ type:"success", message:"Havuz talebin incelemeye alındı!" }); }}>Havuzu Başlat</Btn>
        </ModalSheet>
      )}

      {/* Success overlay */}
      {successMsg && (
        <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", zIndex:9000, background:C.white, borderRadius:C.radius.xl, padding:"28px 24px", textAlign:"center", boxShadow:C.shadow.lg, width:300, animation:"fadeIn .3s" }}>
          <div style={{ fontSize:48, marginBottom:10 }}>🎉</div>
          <div style={{ fontSize:18, fontWeight:800, color:C.ink, marginBottom:6 }}>Havuza Katıldın!</div>
          <div style={{ fontSize:13, color:C.muted, lineHeight:1.5 }}>
            {successMsg.remaining > 0 ? `Dolmasına ${fmtN(successMsg.remaining)} ${successMsg.unit} kaldı.` : "Havuz doldu — üretim başlıyor! 🏭"}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADS SCREEN
// ─────────────────────────────────────────────────────────────────
function AdsScreen({ addToast, sponsoredProducts, setSponsoredProducts }) {
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [selectedProd, setSelectedProd] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleBuy = () => {
    if (!selectedProd || !selectedPkg) return;
    setSponsoredProducts(prev => ({ ...prev, [selectedProd]: selectedPkg.name }));
    setSuccess(selectedPkg);
    addToast({ type:"success", message:`"${selectedPkg.name}" paketi aktifleştirildi! Ürün kartında rozet beliriyor.` });
  };

  if (success) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"60vh", padding:24, textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:12 }}>🎉</div>
      <div style={{ fontSize:22, fontWeight:800, marginBottom:6 }}>Reklam Yayında!</div>
      <div style={{ fontSize:13, color:C.muted, lineHeight:1.6, marginBottom:8 }}>"{success.name}" paketi aktif edildi. Ürününüz {success.dur} boyunca öne çıkacak.</div>
      <div style={{ padding:"10px 16px", borderRadius:12, background:"#fff8e1", border:"1px solid #ffe082", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}><Megaphone size={13} color="#f59e0b"/><span style={{ fontSize:12, fontWeight:700, color:"#92400e" }}>Sponsorlu / Öne Çıkan rozeti ürün kartında aktif!</span></div>
      </div>
      <Btn onClick={() => { setSuccess(null); setSelectedPkg(null); setSelectedProd(null); }}>Yeni Reklam Ekle</Btn>
    </div>
  );

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ margin:"14px 20px 0", borderRadius:C.radius.xl, padding:"18px 20px", background:"linear-gradient(135deg,#1a1a1a,#2d2d2d)", color:"white" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}><Megaphone size={15} color="#FFD700"/><span style={{ fontSize:14, fontWeight:800 }}>Ürününü Öne Çıkar</span></div>
        <p style={{ fontSize:12, color:"rgba(255,255,255,0.6)", lineHeight:1.6, marginBottom:10 }}>Ürünlerinizi binlerce butik sahibine öne çıkarın. Hemen aktiflenir.</p>
        <div style={{ display:"flex", gap:14 }}>
          {[["~800","Günlük Gösterim"],["3.2%","Ort. CTR"],["48s","Aktivasyon"]].map(([v,l]) => <div key={l}><div style={{ fontSize:17, fontWeight:900, color:"#FFD700" }}>{v}</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>{l}</div></div>)}
        </div>
      </div>

      <div style={{ padding:"14px 20px 0" }}>
        <div style={{ fontSize:14, fontWeight:800, marginBottom:12 }}>Paket Seç</div>
        {ADS.map(pkg => (
          <Card key={pkg.id} style={{ padding:16, marginBottom:10, border:`2px solid ${selectedPkg?.id===pkg.id?C.ink:pkg.bc}`, cursor:"pointer" }} onClick={() => setSelectedPkg(selectedPkg?.id===pkg.id?null:pkg)}>
            <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
              <div style={{ width:44, height:44, borderRadius:12, background:pkg.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{pkg.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                  <span style={{ fontSize:14, fontWeight:800 }}>{pkg.name}</span>
                  <span style={{ fontSize:16, fontWeight:900 }}>{fmtP(pkg.price)}</span>
                </div>
                <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>{pkg.dur}</div>
                <div style={{ fontSize:12, color:C.ink3, lineHeight:1.5 }}>{pkg.desc}</div>
              </div>
            </div>
            {selectedPkg?.id === pkg.id && (
              <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid rgba(0,0,0,0.07)" }}>
                <div style={{ fontSize:13, fontWeight:700, marginBottom:8 }}>Hangi ürün için?</div>
                {PRODUCTS.map(p => (
                  <button key={p.id} onClick={e => { e.stopPropagation(); setSelectedProd(p.id); }}
                    style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px", borderRadius:10, border:`1.5px solid ${selectedProd===p.id?C.ink:"rgba(0,0,0,0.1)"}`, background:selectedProd===p.id?C.cream2:"transparent", marginBottom:5, cursor:"pointer", textAlign:"left" }}>
                    <span style={{ fontSize:18 }}>{p.emoji}</span>
                    <span style={{ fontSize:13, fontWeight:600, flex:1 }}>{p.title}</span>
                    {sponsoredProducts?.[p.id] && <Badge color="#fff8e1" tc="#92400e">Aktif</Badge>}
                    {selectedProd===p.id && <CheckCircle size={14} color={C.ink}/>}
                  </button>
                ))}
                <Btn disabled={!selectedProd} style={{ width:"100%", marginTop:10 }} onClick={handleBuy}>
                  Satın Al · {fmtP(pkg.price)}
                </Btn>
              </div>
            )}
          </Card>
        ))}

        <div style={{ fontSize:14, fontWeight:800, marginTop:20, marginBottom:12 }}>Aktif Reklamlarım</div>
        {Object.keys(sponsoredProducts||{}).length === 0 ? (
          <div style={{ textAlign:"center", padding:"24px 0", color:C.muted }}>
            <div style={{ fontSize:32, marginBottom:6 }}>📣</div>
            <div style={{ fontSize:13 }}>Henüz aktif reklamın yok.</div>
          </div>
        ) : (
          Object.entries(sponsoredProducts||{}).map(([prodId, pkgName]) => {
            const prod = PRODUCTS.find(p=>p.id===Number(prodId));
            if (!prod) return null;
            return (
              <Card key={prodId} style={{ padding:14, marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span style={{ fontSize:22 }}>{prod.emoji}</span>
                  <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700 }}>{prod.title}</div><div style={{ fontSize:11, color:C.muted }}>{pkgName} · Aktif</div></div>
                  <Badge color="#fff8e1" tc="#f59e0b" icon="⭐">SPONSORLU</Badge>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// DM / MESSAGES SCREEN
// ─────────────────────────────────────────────────────────────────
function MessagesScreen({ addToast }) {
  const [threads, setThreads] = useState(DM_THREADS);
  const [activeThread, setActiveThread] = useState(null);
  const [input, setInput] = useState("");

  const sendMsg = () => {
    if (!input.trim()) return;
    setThreads(prev => prev.map(t => t.id===activeThread.id ? {...t, msgs:[...t.msgs,{from:"me",text:input,time:"Şimdi"}], unread:0} : t));
    setActiveThread(prev => ({ ...prev, msgs:[...prev.msgs,{from:"me",text:input,time:"Şimdi"}] }));
    setInput("");
    addToast({ type:"success", message:"Mesaj gönderildi!" });
  };

  const sendMedia = type => {
    const label = type==="photo"?"📸 foto_butik.jpg":type==="video"?"📹 tanitim.mp4":"📄 katalog.pdf";
    setThreads(prev => prev.map(t => t.id===activeThread.id ? {...t, msgs:[...t.msgs,{from:"me",type:"media",text:label,time:"Şimdi"}]} : t));
    setActiveThread(prev => ({ ...prev, msgs:[...prev.msgs,{from:"me",type:"media",text:label,time:"Şimdi"}] }));
    addToast({ type:"info", message:"Medya paylaşıldı (demo)" });
  };

  if (activeThread) return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:C.cream, display:"flex", flexDirection:"column" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 20px", background:"rgba(250,248,244,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,0,0,0.06)", flexShrink:0 }}>
        <button onClick={() => setActiveThread(null)} style={{ width:34, height:34, borderRadius:"50%", background:"rgba(0,0,0,0.07)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ArrowLeft size={14}/></button>
        <div style={{ width:34, height:34, borderRadius:"50%", background:"#f0f0f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{activeThread.emoji}</div>
        <div><div style={{ fontSize:13, fontWeight:700 }}>{activeThread.seller}</div><div style={{ fontSize:11, color:C.muted }}>Satıcı · Aktif</div></div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px 20px", display:"flex", flexDirection:"column", gap:8 }}>
        {activeThread.msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.from==="me"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"76%", padding:"9px 13px", borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px", background:m.from==="me"?C.ink:C.white, border:m.from!=="me"?"1px solid rgba(0,0,0,0.08)":"none" }}>
              <div style={{ fontSize:13, color:m.from==="me"?"white":C.ink, lineHeight:1.5 }}>{m.text}</div>
              <div style={{ fontSize:10, color:m.from==="me"?"rgba(255,255,255,0.5)":C.muted, marginTop:2, textAlign:m.from==="me"?"right":"left" }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"10px 16px 20px", background:"rgba(250,248,244,0.97)", borderTop:"1px solid rgba(0,0,0,0.07)", flexShrink:0 }}>
        <div style={{ display:"flex", gap:8, marginBottom:8 }}>
          {[{icon:Image,t:"photo"},{icon:Video,t:"video"},{icon:FileText,t:"file"}].map(({icon:Icon,t}) => (
            <button key={t} onClick={() => sendMedia(t)} style={{ width:34, height:34, borderRadius:10, background:C.cream2, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Icon size={14} color={C.muted}/></button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==="Enter" && sendMsg()} placeholder="Mesaj yaz…" style={{ flex:1, height:40, borderRadius:12, border:"1px solid rgba(0,0,0,0.1)", background:C.cream, padding:"0 14px", fontSize:13, outline:"none" }}/>
          <button onClick={sendMsg} style={{ width:40, height:40, borderRadius:12, background:C.ink, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Send size={15} color="white"/></button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ padding:"14px 20px 0" }}>
        <div style={{ fontSize:16, fontWeight:800, marginBottom:14 }}>Mesajlar</div>
        {threads.map(t => (
          <Card key={t.id} style={{ padding:"14px 16px", marginBottom:10, cursor:"pointer" }} onClick={() => { setActiveThread({...t, unread:0}); setThreads(prev => prev.map(x => x.id===t.id?{...x,unread:0}:x)); }}>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:44, height:44, borderRadius:"50%", background:C.cream2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, position:"relative" }}>
                {t.emoji}
                {t.unread>0 && <div style={{ position:"absolute", top:-2, right:-2, width:16, height:16, borderRadius:"50%", background:C.red, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:9, fontWeight:800, color:"white" }}>{t.unread}</span></div>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <span style={{ fontSize:13, fontWeight:700 }}>{t.seller}</span>
                  <span style={{ fontSize:11, color:C.muted }}>{t.msgs.at(-1)?.time}</span>
                </div>
                <div style={{ fontSize:12, color:C.muted, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{t.msgs.at(-1)?.text}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PAYMENT SCREEN
// ─────────────────────────────────────────────────────────────────
function PaymentScreen({ onClose, addToast }) {
  const [step, setStep] = useState("cart");
  const [card, setCard] = useState({ num:"", exp:"", cvv:"", name:"" });
  const [addr, setAddr] = useState({ line:"", city:"", zip:"" });

  const fmtCard = v => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
  const fmtExp  = v => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

  const CART_ITEMS = [{ emoji:"🪨", title:"Doğal Taş Kolye Seti", qty:10, price:850 }, { emoji:"🕯️", title:"Soya Mumları 50'li Set", qty:20, price:900 }];

  if (step === "success") return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:C.cream, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:24, textAlign:"center" }}>
      <div style={{ fontSize:60, marginBottom:16 }}>🔒</div>
      <div style={{ fontSize:22, fontWeight:800, marginBottom:8 }}>Ödeme Güvende!</div>
      <div style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:24, maxWidth:280 }}>Ödemeniz platform güvencesindedir.<br/><strong>Ürün teslim edilene kadar üreticiye aktarılmaz.</strong></div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, width:"100%", maxWidth:300, marginBottom:24 }}>
        {[["🛡️","Escrow Sistemi Aktif"],["✅","SSL 256-bit Şifreli"],["🔄","İade Garantisi"]].map(([icon,text]) => (
          <div key={text} style={{ display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:C.radius.md, background:C.white, border:"1px solid rgba(0,0,0,0.08)" }}>
            <span style={{ fontSize:20 }}>{icon}</span><span style={{ fontSize:13, fontWeight:600 }}>{text}</span>
          </div>
        ))}
      </div>
      <Btn onClick={onClose}>Siparişi Görüntüle</Btn>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, zIndex:200, background:C.cream, overflowY:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"16px 20px", position:"sticky", top:0, background:"rgba(250,248,244,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(0,0,0,0.07)" }}>
        <button onClick={step==="cart"?onClose:()=>setStep(step==="address"?"cart":"address")} style={{ width:36, height:36, borderRadius:"50%", background:"rgba(0,0,0,0.07)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><ArrowLeft size={15}/></button>
        <span style={{ fontSize:14, fontWeight:700 }}>{step==="cart"?"Sepetim":step==="address"?"Teslimat Adresi":"Ödeme"}</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:6 }}>
          {["cart","address","card"].map((s,i) => <div key={s} style={{ width:6, height:6, borderRadius:"50%", background:["cart","address","card"].indexOf(step)>=i?C.ink:C.faint }}/>)}
        </div>
      </div>

      {/* Escrow banner */}
      <div style={{ margin:"12px 20px 0", padding:"10px 14px", borderRadius:C.radius.md, background:C.sageLight, border:"1px solid #a5d6a7", display:"flex", gap:8, alignItems:"center" }}>
        <Shield size={14} color="#2e7d32"/><span style={{ fontSize:12, color:"#1b5e20", fontWeight:600, lineHeight:1.4 }}>Paranız platform güvencesindedir — ürün teslim edilene kadar üreticiye aktarılmaz.</span>
      </div>

      <div style={{ padding:"14px 20px 120px" }}>
        {step==="cart" && (
          <>
            {CART_ITEMS.map((item,i) => (
              <Card key={i} style={{ padding:"12px 14px", marginBottom:8, display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ width:48, height:48, borderRadius:12, background:C.cream2, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{item.emoji}</div>
                <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700 }}>{item.title}</div><div style={{ fontSize:11, color:C.muted }}>{item.qty} adet</div></div>
                <div style={{ fontSize:15, fontWeight:800 }}>{fmtP(item.price)}</div>
              </Card>
            ))}
            <Card style={{ padding:"12px 14px", marginTop:4 }}>
              {[["Ara Toplam","₺1.750"],["Kargo","Ücretsiz"],["İndirim","-₺320"]].map(([k,v]) => (
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:"1px solid rgba(0,0,0,0.04)" }}><span style={{ fontSize:13, color:C.muted }}>{k}</span><span style={{ fontSize:13, fontWeight:700, color:v.startsWith("-")?"#2e7d32":C.ink }}>{v}</span></div>
              ))}
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:10, marginTop:2 }}><span style={{ fontSize:15, fontWeight:800 }}>Toplam</span><span style={{ fontSize:20, fontWeight:900 }}>₺1.430</span></div>
            </Card>
          </>
        )}
        {step==="address" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <Input label="Adres" placeholder="Sokak, No, Mahalle" value={addr.line} onChange={e=>setAddr(a=>({...a,line:e.target.value}))}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Input label="Şehir" placeholder="İstanbul" value={addr.city} onChange={e=>setAddr(a=>({...a,city:e.target.value}))}/>
              <Input label="Posta Kodu" placeholder="34000" value={addr.zip} onChange={e=>setAddr(a=>({...a,zip:e.target.value}))}/>
            </div>
          </div>
        )}
        {step==="card" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ height:150, borderRadius:C.radius.xl, background:"linear-gradient(135deg,#1a1a1a,#333)", padding:"18px 20px", display:"flex", flexDirection:"column", justifyContent:"space-between", marginBottom:4 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><span style={{ color:"rgba(255,255,255,0.45)", fontSize:11 }}>KART NO</span><div style={{ width:34, height:20, borderRadius:4, background:"rgba(255,215,0,0.3)", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ color:"#FFD700", fontSize:8, fontWeight:800 }}>VISA</span></div></div>
              <div style={{ fontSize:16, fontWeight:700, color:"white", letterSpacing:2 }}>{card.num||"•••• •••• •••• ••••"}</div>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <div><div style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>SAHİBİ</div><div style={{ fontSize:13, color:"white", fontWeight:600 }}>{card.name||"AD SOYAD"}</div></div>
                <div><div style={{ fontSize:9, color:"rgba(255,255,255,0.4)" }}>SON TARİH</div><div style={{ fontSize:13, color:"white", fontWeight:600 }}>{card.exp||"MM/YY"}</div></div>
              </div>
            </div>
            <Input label="Kart Numarası" placeholder="•••• •••• •••• ••••" value={card.num} onChange={e=>setCard(c=>({...c,num:fmtCard(e.target.value)}))}/>
            <Input label="Kart Sahibi" placeholder="Adınız Soyadınız" value={card.name} onChange={e=>setCard(c=>({...c,name:e.target.value}))}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <Input label="Son Kullanma" placeholder="MM/YY" value={card.exp} onChange={e=>setCard(c=>({...c,exp:fmtExp(e.target.value)}))}/>
              <Input label="CVV" placeholder="•••" maxLength={3} value={card.cvv} onChange={e=>setCard(c=>({...c,cvv:e.target.value.replace(/\D/g,"").slice(0,3)}))}/>
            </div>
            <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
              {["🔒 SSL","🛡️ 3D Secure","✅ PCI DSS"].map(l=><span key={l} style={{ fontSize:11, color:C.muted, fontWeight:600 }}>{l}</span>)}
            </div>
          </div>
        )}
      </div>

      <div style={{ position:"fixed", bottom:0, left:0, right:0, maxWidth:430, margin:"0 auto", padding:"12px 16px 22px", background:"rgba(250,248,244,0.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(0,0,0,0.07)" }}>
        <Btn size="lg" style={{ width:"100%" }} onClick={() => {
          if (step==="cart") setStep("address");
          else if (step==="address") setStep("card");
          else { addToast({ type:"success", message:"Ödeme alındı! Escrow'a aktarıldı." }); setStep("success"); }
        }}>
          {step==="cart" ? "Adrese Geç →" : step==="address" ? "Ödemeye Geç →" : <><Shield size={16} color="white"/>Güvenli Öde · ₺1.430</>}
        </Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PROFILE — SOCIAL COMMERCE DASHBOARD  (full gamification rebuild)
// ─────────────────────────────────────────────────────────────────

/* ── mini animated progress bar ── */
function ProgressBar({ pct, color="#4a9a6a", height=7 }) {
  return (
    <div style={{ height, borderRadius:99, background:"#f0f0f0", overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${pct}%`, borderRadius:99, background:`linear-gradient(90deg,${color},${color}cc)`, transition:"width .8s ease", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, bottom:0, width:"40%", background:"linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent)", animation:"shimmer 2s infinite", left:"-40%" }}/>
      </div>
    </div>
  );
}

/* ── XP / level ring ── */
function LevelRing({ level="Gold", xp=72 }) {
  const size = 68, stroke = 5, r = (size-stroke*2)/2, circ = 2*Math.PI*r;
  const dash = circ * xp/100;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.gold} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:16 }}>🏆</span>
        <span style={{ fontSize:9, fontWeight:800, color:C.gold, lineHeight:1 }}>{level}</span>
      </div>
    </div>
  );
}

function ProfileScreen({ user, userPools, setUserPools, addToast, onLogout }) {
  const [tab,       setTab]      = useState("overview");
  const [favSec,    setFavSec]   = useState("producers");
  const [dmThread,  setDmThread] = useState(null);
  const [dmMsg,     setDmMsg]    = useState("");
  const [dmThreads, setDmThreads]= useState(DM_THREADS);
  const [bids, setBids] = useState([
    { id:"b1", emoji:"🌊", artwork:"Boğaz'ın Sesi #3",  amount:22000, leading:false, withdrawn:false, endTime:"2s 14dk"  },
    { id:"b2", emoji:"🌐", artwork:"Dijital Rüya / 001", amount:9800,  leading:true,  withdrawn:false, endTime:"23s 14dk" },
  ]);

  const withdrawBid = id => {
    setBids(p => p.map(b => b.id===id ? {...b, withdrawn:true} : b));
    addToast({ type:"info", message:"Bu açık artırmadan çıktınız. Provizyon blokeniz güvenle kaldırıldı." });
  };
  const exitPool = (poolId, pct) => {
    if (pct >= 90) { addToast({ type:"warn",    message:"Havuz tamamlanmak üzere — çıkış yapılamaz."   }); return; }
    setUserPools(p => p.filter(x => x.id !== poolId));
    addToast({ type:"success", message:"Havuzdan çıkıldı. Ödeme 3 iş günü içinde iade edilir." });
  };
  const sendDm = () => {
    if (!dmMsg.trim() || !dmThread) return;
    const m = { from:"me", text:dmMsg, time:"Şimdi" };
    setDmThreads(p => p.map(t => t.id===dmThread.id ? {...t, msgs:[...t.msgs,m]} : t));
    setDmThread(p => ({...p, msgs:[...p.msgs,m]}));
    setDmMsg("");
  };

  /* ── inline DM chat ── */
  if (dmThread) return (
    <div style={{ paddingBottom:100 }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,padding:"16px 20px 12px",borderBottom:"1px solid rgba(0,0,0,0.06)" }}>
        <button onClick={()=>setDmThread(null)} style={{ width:34,height:34,borderRadius:"50%",background:"rgba(0,0,0,0.07)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><ArrowLeft size={14}/></button>
        <div style={{ width:34,height:34,borderRadius:"50%",background:C.cream2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>{dmThread.emoji}</div>
        <div><div style={{ fontSize:13,fontWeight:700 }}>{dmThread.seller}</div><div style={{ fontSize:11,color:C.muted }}>Çevrimiçi</div></div>
      </div>
      <div style={{ padding:"12px 20px",display:"flex",flexDirection:"column",gap:8,minHeight:280 }}>
        {dmThread.msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"78%",padding:"9px 13px",borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",background:m.from==="me"?C.ink:C.white,border:m.from!=="me"?"1px solid rgba(0,0,0,0.08)":"none" }}>
              <div style={{ fontSize:13,color:m.from==="me"?"white":C.ink,lineHeight:1.5 }}>{m.text}</div>
              <div style={{ fontSize:10,color:m.from==="me"?"rgba(255,255,255,.4)":C.muted,marginTop:2 }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"10px 20px 24px",borderTop:"1px solid rgba(0,0,0,0.07)" }}>
        <div style={{ display:"flex",gap:8,marginBottom:8 }}>
          {[{Icon:Image,l:"Fotoğraf"},{Icon:Video,l:"Video"},{Icon:FileText,l:"Dosya"}].map(({Icon,l})=>(
            <button key={l} onClick={()=>addToast({type:"info",message:`${l} paylaşıldı (demo)`})} style={{ flex:1,padding:"7px 0",borderRadius:10,background:C.cream2,border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3 }}>
              <Icon size={13} color={C.muted}/><span style={{ fontSize:10,color:C.muted }}>{l}</span>
            </button>
          ))}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <input value={dmMsg} onChange={e=>setDmMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendDm()} placeholder="Mesaj yaz…" style={{ flex:1,height:40,borderRadius:12,border:"1px solid rgba(0,0,0,0.1)",background:C.cream,padding:"0 14px",fontSize:13,outline:"none" }}/>
          <button onClick={sendDm} style={{ width:40,height:40,borderRadius:12,background:C.ink,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}><Send size={15} color="white"/></button>
        </div>
      </div>
    </div>
  );

  const TABS = [
    { id:"overview",  l:"Genel"        },
    { id:"orders",    l:"Siparişlerim" },
    { id:"bids",      l:"Tekliflerim"  },
    { id:"favorites", l:"Favorilerim"  },
  ];
  const FAV_SECTIONS = [
    { id:"producers", icon:"🏭", label:"Üreticiler" },
    { id:"artworks",  icon:"🖼️", label:"Eserler"   },
    { id:"pools",     icon:"🌊", label:"Havuzlar"   },
    { id:"artists",   icon:"🎨", label:"Sanatçılar" },
  ];

  return (
    <div style={{ paddingBottom:120 }}>

      {/* ── PROFILE CARD ── */}
      <div style={{ margin:"14px 20px 0",borderRadius:C.radius.xl,overflow:"hidden",background:C.white,border:"1px solid rgba(0,0,0,0.08)",boxShadow:C.shadow.md }}>
        <div style={{ height:54,background:"linear-gradient(120deg,#1a2e1a 0%,#2e7d32 55%,#1b5e20 100%)",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 80% 50%,rgba(255,255,255,.09) 0%,transparent 60%)" }}/>
          <div style={{ position:"absolute",top:9,left:18,display:"flex",gap:8,opacity:.45 }}>
            {[C.gold,"#fff",C.sage].map((c,i)=><div key={i} style={{ width:5,height:5,borderRadius:"50%",background:c }}/>)}
          </div>
          <button onClick={onLogout} style={{ position:"absolute",top:12,right:14,display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:9,background:"rgba(255,255,255,0.18)",border:"none",color:"white",fontSize:11,fontWeight:700,cursor:"pointer" }}>
            <LogOut size={11} color="white"/>Çıkış
          </button>
        </div>
        <div style={{ padding:"0 18px 18px" }}>
          <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginTop:-28,marginBottom:12 }}>
            <div style={{ width:58,height:58,borderRadius:"50%",background:"linear-gradient(135deg,#4a9a6a,#2e7d32)",border:"3px solid white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:"0 3px 14px rgba(0,0,0,0.2)" }}>
              {user?.role==="buyer"?"🛍️":user?.role==="seller_artist"?"🎨":"🏭"}
            </div>
            <LevelRing level="Gold" xp={72}/>
          </div>
          <div style={{ fontSize:20,fontWeight:900,color:C.ink,letterSpacing:-.4,marginBottom:2 }}>{user?.name||"Kullanıcı"}</div>
          <div style={{ fontSize:12,color:C.muted,marginBottom:user?.instagram?5:12 }}>{user?.email}</div>
          {user?.instagram && (
            <div style={{ display:"flex",alignItems:"center",gap:4,marginBottom:12 }}>
              <Instagram size={11} color={C.purple}/>
              <span style={{ fontSize:12,color:C.purple,fontWeight:600 }}>@{user.instagram}</span>
            </div>
          )}
          {/* ── ROLE BADGES ── */}
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:14 }}>
            {[
              { icon:"🏪", label:"Butik Sahibi",        bg:"#e8f5e9", tc:"#2e7d32", bc:"#a5d6a7" },
              { icon:"⭐", label:"Güvenilir Alıcı",     bg:"#fff8e1", tc:"#e65100", bc:"#ffcc80" },
              { icon:"🎨", label:"Sanat Koleksiyoncusu",bg:"#f3e5f5", tc:"#6a1b9a", bc:"#ce93d8" },
            ].map(b=>(
              <div key={b.label} style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:99,background:b.bg,border:`1px solid ${b.bc}`,boxShadow:"0 1px 4px rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize:13 }}>{b.icon}</span>
                <span style={{ fontSize:11,fontWeight:700,color:b.tc }}>{b.label}</span>
              </div>
            ))}
          </div>
          {/* XP bar */}
          <div>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:5 }}>
              <span style={{ fontSize:11,color:C.muted }}>Gold → Platinum</span>
              <span style={{ fontSize:11,fontWeight:800,color:C.gold }}>72 / 100 XP</span>
            </div>
            <ProgressBar pct={72} color={C.gold} height={8}/>
          </div>
        </div>
      </div>

      {/* ── METRICS ── */}
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,padding:"12px 20px 0" }}>
        {[
          { icon:"💰", value:"₺12.480", label:"Toplam Tasarruf", sub:"Havuz kârı",    grad:"135deg,#1a2e0a,#2e4a1a", vc:"#a5d6a7" },
          { icon:"✅", value:"37",       label:"Başarılı İşlem",  sub:"Tüm zamanlar",  grad:"135deg,#0d1a2e,#1a2e44", vc:"#64b5f6" },
          { icon:"🏆", value:"Gold",     label:"Koleksiyon Skoru",sub:"Tier seviyesi", grad:"135deg,#2e1a00,#4a2e00", vc:C.gold    },
        ].map(m=>(
          <div key={m.label} style={{ borderRadius:C.radius.lg,padding:"14px 8px",background:`linear-gradient(${m.grad})`,textAlign:"center",boxShadow:C.shadow.md }}>
            <div style={{ fontSize:22,marginBottom:5 }}>{m.icon}</div>
            <div style={{ fontSize:15,fontWeight:900,color:m.vc,lineHeight:1,marginBottom:4 }}>{m.value}</div>
            <div style={{ fontSize:9, fontWeight:700,color:"rgba(255,255,255,.75)",lineHeight:1.3 }}>{m.label}</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,.4)",marginTop:2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── SANA ÖZEL ── */}
      <div style={{ margin:"12px 20px 0",borderRadius:C.radius.lg,padding:"14px 16px",background:"linear-gradient(135deg,#0a1a0a,#1a2e1a)",border:`1px solid ${C.sage}25`,boxShadow:C.shadow.sm }}>
        <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:10 }}>
          <span style={{ fontSize:16 }}>🎯</span>
          <span style={{ fontSize:13,fontWeight:800,color:C.gold }}>Sana Özel</span>
          <div style={{ marginLeft:"auto",padding:"2px 8px",borderRadius:8,background:"rgba(231,76,60,0.2)",border:"1px solid rgba(231,76,60,0.4)" }}>
            <span style={{ fontSize:9,fontWeight:800,color:"#ef9a9a" }}>2 YENİ</span>
          </div>
        </div>
        {[
          { icon:"🖼️", text:"Elif Karadağ'dan 2 yeni eser yüklendi — erkenden teklif ver!", cta:"İncele"    },
          { icon:"⏳", text:"Katıldığın El Dokuması Keten Kumaş havuzu kapanmak üzere.",   cta:"Görüntüle" },
        ].map((n,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"8px 0",borderTop:i>0?"1px solid rgba(255,255,255,0.06)":"none" }}>
            <span style={{ fontSize:18,flexShrink:0,marginTop:1 }}>{n.icon}</span>
            <span style={{ fontSize:12,color:"rgba(255,255,255,.72)",flex:1,lineHeight:1.5 }}>{n.text}</span>
            <button style={{ flexShrink:0,padding:"5px 10px",borderRadius:9,background:`${C.sage}22`,border:`1px solid ${C.sage}40`,color:C.sage,fontSize:11,fontWeight:700,cursor:"pointer" }}>{n.cta}</button>
          </div>
        ))}
      </div>

      <div style={{ padding:"12px 20px 0" }}>

        {/* ── TABS ── */}
        <div style={{ display:"flex",gap:3,marginBottom:16,background:"rgba(0,0,0,0.05)",borderRadius:C.radius.md,padding:3 }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              style={{ flex:1,padding:"9px 2px",borderRadius:10,border:"none",cursor:"pointer",background:tab===t.id?C.white:"transparent",color:tab===t.id?C.ink:C.muted,fontSize:11,fontWeight:tab===t.id?800:500,boxShadow:tab===t.id?C.shadow.sm:"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",transition:"all .18s" }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* ── GENEL ── */}
        {tab==="overview" && (
          <div>
            <Card style={{ padding:14,marginBottom:12 }}>
              <div style={{ fontSize:13,fontWeight:800,marginBottom:10 }}>Hesap Özeti</div>
              {[
                ["🔵","Aktif Havuz",      `${userPools.length} havuz`],
                ["🟡","Açık Teklif",      `${bids.filter(b=>!b.withdrawn).length} teklif`],
                ["🟢","Toplam Sipariş",   "37 sipariş"],
                ["🏆","Koleksiyon Puanı", "Gold Tier — 72 XP"],
              ].map(([dot,lbl,val],i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:i<3?"1px solid rgba(0,0,0,0.04)":"none" }}>
                  <span style={{ fontSize:13,color:C.muted }}><span style={{ marginRight:8 }}>{dot}</span>{lbl}</span>
                  <span style={{ fontSize:13,fontWeight:700,color:C.ink }}>{val}</span>
                </div>
              ))}
            </Card>
            {user?.interests?.length>0 && (
              <Card style={{ padding:14,marginBottom:12 }}>
                <div style={{ fontSize:13,fontWeight:800,marginBottom:8 }}>İlgi Alanlarım</div>
                <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
                  {user.interests.map(i=><div key={i} style={{ padding:"5px 10px",borderRadius:9,background:C.cream2,fontSize:12,fontWeight:600,color:"#7a6a50" }}>{i}</div>)}
                </div>
              </Card>
            )}
            <Card style={{ padding:14 }}>
              <div style={{ fontSize:13,fontWeight:800,marginBottom:8 }}>Son Mesajlar</div>
              {dmThreads.slice(0,2).map((t,i)=>(
                <div key={t.id} onClick={()=>setDmThread({...t,unread:0})} style={{ display:"flex",gap:10,alignItems:"center",padding:"8px 0",borderBottom:i<1?"1px solid rgba(0,0,0,0.04)":"none",cursor:"pointer" }}>
                  <div style={{ width:36,height:36,borderRadius:"50%",background:C.cream2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,position:"relative" }}>
                    {t.emoji}
                    {t.unread>0&&<div style={{ position:"absolute",top:-2,right:-2,width:14,height:14,borderRadius:"50%",background:C.red,display:"flex",alignItems:"center",justifyContent:"center" }}><span style={{ fontSize:8,fontWeight:800,color:"white" }}>{t.unread}</span></div>}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:12,fontWeight:700 }}>{t.seller}</div>
                    <div style={{ fontSize:11,color:C.muted,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis" }}>{t.msgs.at(-1)?.text}</div>
                  </div>
                  <ChevronRight size={14} color={C.faint}/>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── SİPARİŞLERİM ── */}
        {tab==="orders" && (
          <div>
            {[
              { emoji:"🪨",product:"Doğal Taş Kolye Seti",  shop:"Nişantaşı Butik",    qty:10,amount:850, status:"Teslim Edildi",sBg:C.sageLight,sTc:"#2e7d32",date:"12 Kas 2024" },
              { emoji:"☕",product:"Seramik Fincan Seti",    shop:"Çömlek Sanatevi",    qty:6, amount:570, status:"Kargoda",      sBg:"#e3f2fd",  sTc:"#1565c0",date:"18 Kas 2024" },
              { emoji:"🕯️",product:"Soya Mum 50'li Set",  shop:"EcoLite Fabrika",    qty:20,amount:900, status:"Hazırlanıyor", sBg:"#fff8e1",  sTc:"#e65100",date:"22 Kas 2024" },
              { emoji:"👜",product:"Premium Keten Tote",     shop:"Sürdürülebilir Txt", qty:25,amount:950, status:"Onaylandı",   sBg:"#f3e5f5",  sTc:"#6a1b9a",date:"25 Kas 2024" },
            ].map((o,i)=>(
              <Card key={i} style={{ padding:14,marginBottom:10 }}>
                <div style={{ display:"flex",gap:12,alignItems:"flex-start",marginBottom:10 }}>
                  <div style={{ width:48,height:48,borderRadius:14,background:C.cream2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{o.emoji}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
                      <div style={{ fontSize:13,fontWeight:800,color:C.ink,flex:1,marginRight:8 }}>{o.product}</div>
                      <div style={{ padding:"3px 9px",borderRadius:8,background:o.sBg,flexShrink:0 }}><span style={{ fontSize:10,fontWeight:700,color:o.sTc }}>{o.status}</span></div>
                    </div>
                    <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>{o.shop} · {o.qty} adet · {o.date}</div>
                  </div>
                </div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:"1px solid rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize:11,color:C.muted }}>Sipariş tutarı</span>
                  <span style={{ fontSize:16,fontWeight:900,color:C.ink }}>{fmtP(o.amount)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── TEKLİFLERİM ── */}
        {tab==="bids" && (
          <div>
            {bids.every(b=>b.withdrawn)
              ? <div style={{ textAlign:"center",padding:"40px 0",color:C.muted }}><div style={{ fontSize:44,marginBottom:10 }}>🎨</div><div style={{ fontSize:14,fontWeight:600 }}>Aktif teklifin yok.</div></div>
              : bids.map(b=>(
                <Card key={b.id} style={{ padding:14,marginBottom:12,opacity:b.withdrawn?.55:1 }}>
                  <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
                    <div style={{ width:50,height:50,borderRadius:14,background:"linear-gradient(135deg,#131325,#0f0f20)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>{b.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13,fontWeight:800,color:C.ink }}>{b.artwork}</div>
                      <div style={{ fontSize:11,color:C.muted,marginTop:2 }}>Kalan: {b.endTime}</div>
                    </div>
                    <div style={{ padding:"4px 10px",borderRadius:9,background:b.withdrawn?"#f5f5f5":b.leading?C.sageLight:"#ffebee",flexShrink:0 }}>
                      <span style={{ fontSize:10,fontWeight:700,color:b.withdrawn?"#aaa":b.leading?"#2e7d32":"#c62828" }}>
                        {b.withdrawn?"Çekildiniz":b.leading?"En Yüksek 🏆":"Geride kaldın"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:10,borderTop:"1px solid rgba(0,0,0,0.05)" }}>
                    <div>
                      <div style={{ fontSize:10,color:C.muted,marginBottom:2 }}>MEVCUTTEKLİFİNİZ</div>
                      <div style={{ fontSize:22,fontWeight:900,color:b.withdrawn?C.faint:C.ink }}>{fmtP(b.amount)}</div>
                    </div>
                    {!b.withdrawn && (
                      <button onClick={()=>withdrawBid(b.id)}
                        style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:12,background:"#fff0f0",border:"1px solid #ffcdd2",color:"#c62828",fontSize:12,fontWeight:700,cursor:"pointer" }}>
                        🔕 Bu Artırmadan Çık
                      </button>
                    )}
                  </div>
                </Card>
              ))
            }
          </div>
        )}

        {/* ── FAVORİLERİM ── */}
        {tab==="favorites" && (
          <div>
            <div style={{ display:"flex",gap:6,marginBottom:14,overflowX:"auto",scrollbarWidth:"none" }}>
              {FAV_SECTIONS.map(s=>(
                <button key={s.id} onClick={()=>setFavSec(s.id)}
                  style={{ flexShrink:0,display:"flex",alignItems:"center",gap:5,padding:"7px 13px",borderRadius:12,border:favSec===s.id?"none":"1px solid rgba(0,0,0,0.1)",background:favSec===s.id?C.ink:C.white,color:favSec===s.id?"white":C.ink3,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all .15s" }}>
                  <span>{s.icon}</span>{s.label}
                </button>
              ))}
            </div>

            {/* Favori Üreticiler */}
            {favSec==="producers" && (
              <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                {[
                  { name:"Anadolu Takı Atölyesi",emoji:"🪨",rating:4.9,sales:240,loc:"İstanbul",  online:true  },
                  { name:"EcoLite Mum Fabrikası", emoji:"🕯️",rating:4.8,sales:186,loc:"Bursa",    online:true  },
                  { name:"Çömlek Sanatevi",        emoji:"☕",rating:4.9,sales:201,loc:"Çanakkale",online:false },
                ].map((p,i)=>(
                  <Card key={i} style={{ padding:16 }}>
                    <div style={{ display:"flex",gap:14,alignItems:"center",marginBottom:12 }}>
                      <div style={{ width:52,height:52,borderRadius:14,background:C.cream2,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0 }}>{p.emoji}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:4 }}>
                          <span style={{ fontSize:14,fontWeight:800,color:C.ink }}>{p.name}</span>
                          <BadgeCheck size={13} color={C.sage} fill={C.sage}/>
                        </div>
                        <div style={{ display:"flex",gap:10,flexWrap:"wrap",marginBottom:4 }}>
                          <span style={{ fontSize:11,color:C.muted }}>⭐ {p.rating}</span>
                          <span style={{ fontSize:11,color:C.muted }}>📦 {p.sales} Satış</span>
                          <span style={{ fontSize:11,color:C.muted }}>📍 {p.loc}</span>
                        </div>
                        <div style={{ display:"flex",alignItems:"center",gap:5 }}>
                          <div style={{ width:7,height:7,borderRadius:"50%",background:p.online?"#4CAF50":"#bbb" }}/>
                          <span style={{ fontSize:11,fontWeight:600,color:p.online?"#4CAF50":C.muted }}>{p.online?"🟢 Çevrimiçi":"Çevrimdışı"}</span>
                        </div>
                      </div>
                    </div>
                    <button style={{ width:"100%",padding:"10px",borderRadius:12,background:C.cream2,border:"1px solid rgba(0,0,0,0.09)",color:C.ink,fontSize:13,fontWeight:700,cursor:"pointer" }}>Profili Gör →</button>
                  </Card>
                ))}
              </div>
            )}

            {/* Favori Eserler */}
            {favSec==="artworks" && (
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
                {ARTWORKS.map(a=>(
                  <div key={a.id} style={{ borderRadius:C.radius.lg,overflow:"hidden",background:"linear-gradient(135deg,#131325,#0f0f20)",border:"1px solid rgba(255,255,255,0.08)",display:"flex",flexDirection:"column" }}>
                    <div style={{ height:110,background:"linear-gradient(160deg,#1a1a30,#0d0d1a)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",flexShrink:0 }}>
                      <div style={{ fontSize:66,opacity:.1,filter:"blur(2px)",position:"absolute" }}>{a.emoji}</div>
                      <div style={{ fontSize:46,position:"relative",zIndex:2 }}>{a.emoji}</div>
                      {a.status==="live"&&<div style={{ position:"absolute",top:6,left:6,padding:"2px 6px",borderRadius:6,background:"rgba(231,76,60,.92)" }}><span style={{ fontSize:8,fontWeight:800,color:"white" }}>CANLI</span></div>}
                    </div>
                    <div style={{ padding:"9px 10px",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between" }}>
                      <div style={{ fontSize:9,color:a.accent,fontWeight:700,marginBottom:2 }}>{a.artist}</div>
                      <div style={{ fontSize:11,fontWeight:600,color:"#f0f0ff",fontStyle:"italic",lineHeight:1.3,fontFamily:"'Cormorant Garamond',serif" }}>&ldquo;{a.title}&rdquo;</div>
                      <div style={{ fontSize:13,fontWeight:800,color:a.accent,marginTop:6 }}>{fmtP(a.currentBid)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Favori Havuzlar */}
            {favSec==="pools" && (
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {POOLS.map(pool=>{
                  const pct=Math.min(100,Math.round((pool.filled/pool.target)*100));
                  const isJoined=userPools.some(p=>p.id===pool.id);
                  return (
                    <Card key={pool.id} style={{ padding:14,border:pct>=90?`1px solid ${pool.accent}40`:"1px solid rgba(0,0,0,0.08)" }}>
                      <div style={{ display:"flex",gap:10,alignItems:"flex-start",marginBottom:10 }}>
                        <div style={{ width:44,height:44,borderRadius:12,background:`${pool.accent}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>{pool.emoji}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13,fontWeight:800,color:C.ink,marginBottom:2 }}>{pool.title}</div>
                          <div style={{ fontSize:11,color:C.muted }}>{pool.seller} · {pool.deadlineH}s kaldı</div>
                        </div>
                        <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4 }}>
                          <Badge color={pct>=90?"#fff3e0":C.sageLight} tc={pct>=90?"#e65100":"#2e7d32"}>{pct}%</Badge>
                          {isJoined&&<Badge color="#e3f2fd" tc="#1565c0">Katıldın ✓</Badge>}
                        </div>
                      </div>
                      <ProgressBar pct={pct} color={pool.accent}/>
                      <div style={{ display:"flex",justifyContent:"space-between",marginTop:8,marginBottom:isJoined?10:0 }}>
                        <span style={{ fontSize:11,color:C.muted }}>{fmtN(pool.filled)} / {fmtN(pool.target)} {pool.unit}</span>
                        <span style={{ fontSize:12,fontWeight:700,color:pool.accent }}>{pool.savings} ucuz</span>
                      </div>
                      {isJoined&&(
                        <button onClick={()=>exitPool(pool.id,pct)} disabled={pct>=90}
                          style={{ width:"100%",padding:"9px",borderRadius:12,background:pct>=90?"#f5f5f5":"#fff0f0",border:`1px solid ${pct>=90?"rgba(0,0,0,0.08)":"#ffcdd2"}`,color:pct>=90?"#bbb":"#c62828",fontSize:12,fontWeight:700,cursor:pct>=90?"not-allowed":"pointer" }}>
                          {pct>=90?"Çıkış Engellendi 🔒":"Havuzdan Çık"}
                        </button>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Takip Edilen Sanatçılar */}
            {favSec==="artists" && (
              <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
                {[
                  { name:"Elif Karadağ", emoji:"🌊", score:98, works:12, style:"Yağlı Boya",    newWorks:2, following:true  },
                  { name:"Cem Arslan",   emoji:"🌐", score:95, works:8,  style:"Dijital Sanat",  newWorks:0, following:true  },
                  { name:"Zeynep Oral",  emoji:"🏛️", score:92, works:6,  style:"Seramik Heykel", newWorks:0, following:false },
                ].map((a,i)=>(
                  <Card key={i} style={{ padding:14 }}>
                    <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:12 }}>
                      <div style={{ width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#131325,#1a1a30)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,border:`2px solid ${C.gold}40`,flexShrink:0,position:"relative" }}>
                        {a.emoji}
                        {a.newWorks>0&&<div style={{ position:"absolute",top:-3,right:-3,width:16,height:16,borderRadius:"50%",background:C.red,display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid white" }}><span style={{ fontSize:8,fontWeight:800,color:"white" }}>{a.newWorks}</span></div>}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14,fontWeight:800,color:C.ink,marginBottom:2 }}>{a.name}</div>
                        <div style={{ fontSize:11,color:C.muted,marginBottom:3 }}>{a.style} · {a.works} eser</div>
                        <div style={{ display:"flex",alignItems:"center",gap:4 }}>
                          <Shield size={10} color={C.gold}/>
                          <span style={{ fontSize:10,fontWeight:700,color:C.gold }}>Skor {a.score}/100</span>
                          {a.newWorks>0&&<span style={{ fontSize:10,fontWeight:700,color:C.red,marginLeft:6 }}>🔴 {a.newWorks} yeni eser!</span>}
                        </div>
                      </div>
                      <button style={{ padding:"8px 13px",borderRadius:11,background:a.following?C.sageLight:C.ink,border:"none",color:a.following?"#2e7d32":"white",fontSize:11,fontWeight:700,cursor:"pointer" }}>
                        {a.following?"Takiptesin ✓":"Takip Et"}
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── BAŞARIMLAR (always visible) ── */}
        <div style={{ marginTop:24 }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:12 }}>
            <span style={{ fontSize:18 }}>🏅</span>
            <span style={{ fontSize:15,fontWeight:800,color:C.ink }}>Başarımlarım</span>
            <div style={{ marginLeft:"auto",padding:"2px 8px",borderRadius:8,background:C.cream2 }}>
              <span style={{ fontSize:10,fontWeight:700,color:C.muted }}>2 / 6 Açık</span>
            </div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8 }}>
            {[
              { icon:"🏅",label:"İlk Havuz Katılımı",locked:false,xp:"+10 XP",bg:"#e8f5e9",bc:"#c8e6c9",tc:"#2e7d32" },
              { icon:"🎨",label:"İlk Açık Artırma",  locked:false,xp:"+15 XP",bg:"#e3f2fd",bc:"#bbdefb",tc:"#1565c0" },
              { icon:"💎",label:"İlk Koleksiyon",     locked:true, xp:"+25 XP",bg:"#f5f5f5",bc:"#e0e0e0",tc:"#9e9e9e" },
              { icon:"🔥",label:"Ateşli Alıcı",       locked:true, xp:"+20 XP",bg:"#f5f5f5",bc:"#e0e0e0",tc:"#9e9e9e" },
              { icon:"💫",label:"Havuz Ustası",        locked:true, xp:"+30 XP",bg:"#f5f5f5",bc:"#e0e0e0",tc:"#9e9e9e" },
              { icon:"🌟",label:"Gold Sanatçı",        locked:true, xp:"+50 XP",bg:"#f5f5f5",bc:"#e0e0e0",tc:"#9e9e9e" },
            ].map((a,i)=>(
              <div key={i} style={{ borderRadius:C.radius.md,padding:"13px 8px",background:a.bg,border:`1.5px solid ${a.bc}`,textAlign:"center",opacity:a.locked?.5:1,position:"relative",boxShadow:a.locked?"none":"0 1px 6px rgba(0,0,0,0.07)" }}>
                {a.locked&&<div style={{ position:"absolute",top:5,right:7,fontSize:11 }}>🔒</div>}
                <div style={{ fontSize:26,marginBottom:6 }}>{a.icon}</div>
                <div style={{ fontSize:10,fontWeight:700,color:a.tc,lineHeight:1.3,marginBottom:5 }}>{a.label}</div>
                <div style={{ display:"inline-block",fontSize:9,fontWeight:800,color:a.locked?"#bbb":a.tc,background:a.locked?"rgba(0,0,0,0.04)":"rgba(0,0,0,0.08)",padding:"2px 6px",borderRadius:5 }}>{a.xp}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ROOT APP
// ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [showAuthGuard, setShowAuthGuard] = useState(false);
  const [world, setWorld] = useState("wholesale"); // wholesale | auction
  const [tab, setTab] = useState("discover");
  const [liked, setLiked] = useState(new Set([1,5]));
  const [selectedProd, setSelectedProd] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [userPools, setUserPools] = useState([]);
  const [sponsoredProducts, setSponsoredProducts] = useState({ 1:"Vitrin" }); // product id -> package name
  const [toasts, setToasts] = useState([]);
  const toastRef = useRef(0);

  const addToast = useCallback(t => {
    const id = ++toastRef.current;
    setToasts(p => [...p, { ...t, id }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 4500);
  }, []);

  const toggleLike = id => setLiked(p => { const n = new Set(p); n.has(id)?n.delete(id):n.add(id); return n; });

  const isAuction = world === "auction";
  const bgColor = isAuction ? C.auBg : C.cream;

  const NAV_ITEMS = [
    { id:"discover", Icon:Home,      label:"Keşfet" },
    { id:"gallery",  Icon:Palette,   label:"Galeri" },
    { id:"pool",     Icon:Users,     label:"Havuz",    badge:POOLS.length },
    { id:"messages", Icon:MessageCircle, label:"Mesajlar", badge: DM_THREADS.reduce((a,t)=>a+t.unread,0) },
    { id:"profile",  Icon:User,      label:"Profil" },
  ];

  return (
    <div style={{ maxWidth:430, margin:"0 auto", minHeight:"100vh", background:bgColor, fontFamily:"'DM Sans','Helvetica Neue',sans-serif", position:"relative", overflowX:"hidden" }}>
      <style>{GLOBAL_CSS}</style>
      <Toasts toasts={toasts}/>

      {/* AUTH GATE */}
      {!user && <AuthScreen onAuth={u => setUser(u)}/>}

      {user && (
        <>
          {/* Auth guard overlay */}
          {showAuthGuard && <AuthGuardModal onClose={() => setShowAuthGuard(false)} onAuth={u => { setUser(u); setShowAuthGuard(false); }}/>}

          {/* Overlays */}
          {selectedProd && <ProductDetail product={selectedProd} onClose={() => setSelectedProd(null)} liked={liked.has(selectedProd.id)} onLike={toggleLike} addToast={addToast}/>}
          {showPayment && <PaymentScreen onClose={() => setShowPayment(false)} addToast={addToast}/>}

          {/* ── TOP HEADER ── */}
          <div style={{ padding:"12px 20px 0", position:"sticky", top:0, zIndex:40, background:isAuction?"rgba(13,13,26,0.97)":"rgba(250,248,244,0.97)", backdropFilter:"blur(24px)", borderBottom:`1px solid ${isAuction?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)"}` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ fontSize:20, fontWeight:900, color:isAuction?"#f0f0ff":C.ink, letterSpacing:-.5 }}>toptanla</span>
                <div style={{ width:5, height:5, borderRadius:"50%", background:isAuction?C.gold:C.sage }}/>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button style={{ width:34, height:34, borderRadius:"50%", background:isAuction?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.07)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                  <Bell size={15} color={isAuction?"#f0f0ff":C.ink}/>
                  <div style={{ position:"absolute", top:6, right:6, width:7, height:7, borderRadius:"50%", background:C.red, border:`2px solid ${isAuction?C.auBg:C.cream}` }}/>
                </button>
                <button onClick={() => setShowPayment(true)} style={{ width:34, height:34, borderRadius:"50%", background:isAuction?"rgba(255,255,255,0.08)":C.ink, border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                  <ShoppingCart size={15} color={isAuction?"#f0f0ff":"white"}/>
                  <div style={{ position:"absolute", top:-1, right:-1, width:16, height:16, borderRadius:"50%", background:C.red, border:`2px solid ${isAuction?C.auBg:C.cream}`, display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:8, fontWeight:800, color:"white" }}>2</span></div>
                </button>
              </div>
            </div>

            {/* World toggle */}
            <div style={{ display:"flex", background:isAuction?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.06)", borderRadius:12, padding:3, marginBottom:12 }}>
              {[{ id:"wholesale",label:"🛍 Toptan" },{ id:"auction",label:"🔨 Açık Artırma" }].map(w => (
                <button key={w.id} onClick={() => { setWorld(w.id); setTab("discover"); }}
                  style={{ flex:1, padding:"8px 10px", borderRadius:9, border:"none", cursor:"pointer", transition:"all .2s", background:world===w.id?(isAuction?`${C.gold}20`:C.white):"transparent", color:world===w.id?(isAuction?C.gold:C.ink):(isAuction?"rgba(255,255,255,0.3)":C.muted), fontSize:13, fontWeight:800, boxShadow:world===w.id&&!isAuction?C.shadow.sm:"none" }}>
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── SCREENS ── */}
          {world==="wholesale" && tab==="discover"  && <DiscoverScreen likedProducts={liked} onLike={toggleLike} onOpenProduct={setSelectedProd} sponsoredProducts={sponsoredProducts}/>}
          {world==="wholesale" && tab==="gallery"   && <GalleryScreen addToast={addToast}/>}
          {world==="wholesale" && tab==="pool"      && <PoolScreen user={user} addToast={addToast} userPools={userPools} setUserPools={setUserPools} onNeedAuth={() => setShowAuthGuard(true)}/>}
          {world==="wholesale" && tab==="messages"  && <MessagesScreen addToast={addToast}/>}
          {world==="wholesale" && tab==="profile"   && <ProfileScreen user={user} userPools={userPools} setUserPools={setUserPools} addToast={addToast} onLogout={() => setUser(null)}/>}
          {world==="wholesale" && tab==="ads"       && <AdsScreen addToast={addToast} sponsoredProducts={sponsoredProducts} setSponsoredProducts={setSponsoredProducts}/>}
          {world==="auction"                        && <GalleryScreen addToast={addToast}/>}

          {/* ── BOTTOM NAV ── */}
          {world==="wholesale" && (
            <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(250,248,244,0.97)", backdropFilter:"blur(24px)", borderTop:"1px solid rgba(0,0,0,0.07)", zIndex:30 }}>
              <div style={{ display:"flex", justifyContent:"space-around", padding:"8px 12px 20px" }}>
                {NAV_ITEMS.map(({ id, Icon, label, badge }) => (
                  <button key={id} onClick={() => setTab(id)} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2, border:"none", background:"none", cursor:"pointer", position:"relative", padding:"4px 6px", borderRadius:12, transition:"background .15s", minWidth:52 }}>
                    <div style={{ position:"relative" }}>
                      <Icon size={22} color={tab===id?C.ink:C.faint} strokeWidth={tab===id?2.5:1.8}/>
                      {badge>0 && (
                        <div style={{ position:"absolute", top:-3, right:-5, minWidth:14, height:14, borderRadius:7, background:id==="pool"?C.sage:C.red, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 3px" }}>
                          <span style={{ fontSize:8, fontWeight:800, color:"white" }}>{badge}</span>
                        </div>
                      )}
                    </div>
                    <span style={{ fontSize:10, fontWeight:tab===id?800:400, color:tab===id?C.ink:C.faint }}>{label}</span>
                    {tab===id && <div style={{ width:4, height:4, borderRadius:"50%", background:C.ink, position:"absolute", bottom:-2 }}/>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auction nav pill */}
          {world==="auction" && (
            <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:30 }}>
              <div style={{ display:"flex", gap:6, background:"rgba(19,19,37,0.95)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:99, padding:"8px 12px" }}>
                {[{id:"gallery",label:"🎨 Galeri"},{id:"ads",label:"📌 Öne Çıkar"},{id:"profile",label:"👤 Profil"}].map(x => (
                  <button key={x.id} onClick={() => { setWorld("wholesale"); setTab(x.id); }} style={{ padding:"7px 14px", borderRadius:99, border:"none", cursor:"pointer", background:tab===x.id?`${C.gold}25`:"transparent", color:tab===x.id?C.gold:"rgba(255,255,255,0.5)", fontSize:12, fontWeight:700 }}>{x.label}</button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
