import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900 origin-left z-[100] pointer-events-none"
      style={{ scaleX }}
    />
  );
}

/* ---------- Animation helpers ---------- */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" } as const,
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true, margin: "-80px" } as const,
};

const staggerItem = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="w-full max-w-5xl pointer-events-auto">
        <motion.nav
          animate={{
            backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.70)",
            boxShadow: scrolled
              ? "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)"
              : "0 4px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)",
          }}
          transition={{ duration: 0.4 }}
          className={`relative flex items-center justify-between gap-4 px-3 sm:px-5 py-2.5 sm:py-3 rounded-full border backdrop-blur-2xl ${
            scrolled ? "border-black/[0.08]" : "border-black/[0.06]"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 pl-1">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg shadow-black/10"
            >
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </motion.div>
            <span className="text-[17px] font-bold tracking-tight text-gray-900">بات‌زون</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 bg-black/[0.03] rounded-full p-1">
            {[
              { label: "امکانات", href: "/#features" },
              { label: "تعرفه‌ها", href: "/#pricing" },
              { label: "درباره ما", href: "/about" },
              { label: "وبلاگ", href: "/blog" },
            ].map((item) => (
              <Link key={item.label} to={item.href} className="text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-white px-4 py-2 rounded-full transition-all duration-200">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link to="/" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-black/[0.04] transition-all">
              ورود
            </Link>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/" className="text-[13px] font-semibold text-white bg-gray-900 hover:bg-black px-5 py-2.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.15)] block">
                شروع کنید
              </Link>
            </motion.div>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] flex items-center justify-center text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </motion.button>
        </motion.nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden mt-3 p-2 rounded-[24px] bg-white/90 backdrop-blur-2xl border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
            >
              <div className="rounded-[18px] bg-gray-50/80 border border-black/[0.03] p-2 space-y-1">
                {[
                  { label: "امکانات", href: "/#features", icon: "✨" },
                  { label: "تعرفه‌ها", href: "/#pricing", icon: "💳" },
                  { label: "درباره ما", href: "/about", icon: "👥" },
                  { label: "وبلاگ", href: "/blog", icon: "📝" },
                ].map((item) => (
                  <Link key={item.label} to={item.href} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition-all">
                    <span className="w-8 h-8 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-sm">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <motion.div animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-gray-200/50 rounded-full blur-[120px]" />
      <motion.div animate={{ x: [0, -15, 0], y: [0, 20, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-gray-300/30 rounded-full blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.2] mb-6">
          <span className="text-gray-900">ربات‌های هوشمند</span>
          <br />
          <span className="bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">برای سروش</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          بات‌زون، پلتفرم طراحی و توسعه ربات‌های حرفه‌ای روی پیام‌رسان سروش. ابزارهای قدرتمند، راه‌اندازی سریع، بدون پیچیدگی.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <motion.button whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }} className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 px-8 py-4 rounded-full shadow-xl">
            شروع رایگان
            <motion.svg animate={{ x: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></motion.svg>
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-medium text-gray-600 hover:text-gray-900 bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06] px-8 py-4 rounded-full">مشاهده دمو</motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-300/50 to-gray-400/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          <div className="relative rounded-2xl border border-black/[0.08] bg-white overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 bg-gray-50/80">
              <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400" /><div className="w-3 h-3 rounded-full bg-yellow-400" /><div className="w-3 h-3 rounded-full bg-green-400" /></div>
              <div className="flex-1 mx-12"><div className="bg-black/[0.04] rounded-md px-3 py-1 text-xs text-gray-400 text-center max-w-xs mx-auto" dir="ltr">botzone.ir/dashboard</div></div>
            </div>
            <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "پیام‌ها", value: "۴۸,۲۰۰", change: "+۱۲.۵٪", color: "emerald" },
                  { label: "کاربران", value: "۲,۸۴۷", change: "+۸.۱٪", color: "gray" },
                  { label: "آپتایم", value: "۹۹.۹۸٪", change: "+۰.۰۲٪", color: "gray" },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }} className="rounded-xl bg-white border border-black/[0.06] p-4 shadow-sm">
                    <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <span className={`text-xs font-medium ${stat.color === "emerald" ? "text-emerald-500" : "text-gray-500"}`}>{stat.change}</span>
                  </motion.div>
                ))}
              </div>
              <div className="rounded-xl bg-white border border-black/[0.06] p-4 h-40 flex items-end gap-2 shadow-sm overflow-hidden">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.9 + i * 0.05, ease: "easeOut" }} className="flex-1 rounded-t-md bg-gradient-to-t from-gray-800 to-gray-400" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-100" />
    </section>
  );
}

function Features() {
  const features = [
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />, title: "سرعت بالا", description: "پاسخگویی در کسری از ثانیه با زیرساخت پیشرفته و بهینه‌سازی شده برای عملکرد حداکثری." },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />, title: "امنیت بالا", description: "رمزنگاری سرتاسری، کنترل دسترسی مبتنی بر نقش و ثبت کامل لاگ‌های فعالیت." },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />, title: "توسعه‌دهنده محور", description: "APIهای جامع، مستندات کامل و ابزارهای یکپارچه‌سازی با سرویس‌های محبوب شما." },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />, title: "آمار لحظه‌ای", description: "پیگیری عملکرد ربات‌ها با داشبوردهای سفارشی و نمایش داده‌ها به صورت زنده." },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />, title: "مدیریت تیمی", description: "ابزارهای همکاری تیمی با فضای کار مشترک، نظرات و ویرایش همزمان." },
    { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />, title: "مقیاس‌پذیری خودکار", description: "زیرساختی که به‌صورت خودکار برای مدیریت هر حجمی از ترافیک مقیاس‌بندی می‌شود." },
  ];

  return (
    <section id="features" className="relative py-32 bg-gray-100">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-20">
          <span className="text-sm font-semibold text-gray-400 tracking-widest mb-4 block">امکانات</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5">هر آنچه برای ساخت ربات نیاز دارید</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">امکانات قدرتمند برای توسعه سریع‌تر ربات‌های سروش و ارائه بهترین تجربه به کاربران.</p>
        </motion.div>

        <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true, margin: "-80px" }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.08)" }}
              className="group relative rounded-2xl bg-white border border-black/[0.06] hover:border-black/10 p-8 transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 shadow-lg mb-5 text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>{feature.icon}</svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-300" />
    </section>
  );
}

function Stats() {
  const stats = [
    {
      value: "+۱ هزار",
      label: "کاربر فعال",
      icon: (
        <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      ),
    },
  ];

  return (
    <section className="relative py-24 bg-gray-300 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="flex justify-center"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              custom={i}
              whileHover={{ scale: 1.05 }}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-black/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-gray-900 mb-4 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  {stat.icon}
                </svg>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
                className="text-5xl sm:text-6xl font-bold text-gray-900 mb-3 tracking-tight"
              >
                {stat.value}
              </motion.div>
              <div className="text-base text-gray-600 font-medium tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-500" />
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    { quote: "بات‌زون فرایند توسعه ربات‌های ما رو کاملاً متحول کرد. سه برابر سریع‌تر از حد انتظار ربات‌مون رو راه‌اندازی کردیم.", author: "مهدی احمدی", role: "مدیر فنی، تک‌نوآوران", avatar: "https://images.pexels.com/photos/7640741/pexels-photo-7640741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100" },
    { quote: "بهترین تجربه توسعه‌ای که داشتم. انگار یه ابرقدرت برای ساخت ربات در اختیارتون قرار میده.", author: "سارا رضایی", role: "توسعه‌دهنده ارشد، دیجی‌سرویس", avatar: "https://images.pexels.com/photos/8837261/pexels-photo-8837261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100" },
    { quote: "هزینه‌های زیرساختمون رو ۶۰ درصد کاهش دادیم و در عین حال عملکرد بهتری هم داریم. واقعاً عالیه.", author: "علی محمدی", role: "معاون مهندسی، آسان‌تک", avatar: "https://images.pexels.com/photos/18459701/pexels-photo-18459701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100" },
  ];

  return (
    <section id="about" className="relative py-32 bg-gray-500">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div {...fadeUp} className="text-center mb-16">
          <span className="text-sm font-semibold text-gray-200 tracking-widest mb-4 block">نظرات مشتریان</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5">مورد اعتماد تیم‌های حرفه‌ای</h2>
        </motion.div>
        <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.author} variants={staggerItem} whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.15)" }} className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-8">
              <div className="flex gap-1 mb-4">{[...Array(5)].map((_, j) => <motion.svg key={j} initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: i * 0.1 + j * 0.05 }} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></motion.svg>)}</div>
              <p className="text-white/90 leading-relaxed mb-6 text-sm">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20" />
                <div><p className="text-white font-medium text-sm">{t.author}</p><p className="text-white/50 text-xs">{t.role}</p></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-700" />
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-32 bg-gray-700 overflow-hidden">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.h2 {...fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">آماده‌اید ربات<span className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">خودتون رو بسازید؟</span></motion.h2>
        <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">به هزاران تیمی بپیوندید که با بات‌زون سریع‌تر ربات می‌سازند. شروع رایگان — بدون نیاز به کارت بانکی.</motion.p>
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-gray-900 bg-white hover:bg-gray-100 px-8 py-4 rounded-full shadow-xl">شروع رایگان <span className="group-hover:-translate-x-1 transition-transform">→</span></motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto text-base font-medium text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 px-8 py-4 rounded-full">تماس با فروش</motion.button>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-900" />
    </section>
  );
}

function Footer({ onOpenLegal }: { onOpenLegal: (page: string) => void }) {
  const legalPages = ["حریم خصوصی", "قوانین استفاده", "امنیت", "کوکی‌ها"];
  const companyLinks = [
    { label: "درباره ما", to: "/about" },
    { label: "وبلاگ", to: "/blog" },
    { label: "فرصت‌های شغلی", to: "/careers" },
    { label: "اخبار", to: "/news" },
    { label: "همکاران", to: "/partners" },
  ];
  const footerLinks = {
    "محصول": ["امکانات", "تعرفه‌ها", "یکپارچه‌سازی", "تغییرات", "مستندات"],
    "شرکت": companyLinks.map(c => c.label),
    "منابع": ["انجمن", "تماس با ما", "پشتیبانی", "وضعیت سرور", "API"],
    "قوانین": legalPages,
  };
  return (
    <footer className="relative bg-gray-900 pt-20 pb-10">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          <motion.div variants={staggerItem} className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4"><div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"><svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg></div><span className="text-lg font-bold text-white">بات‌زون</span></Link>
            <p className="text-sm text-gray-500 leading-relaxed">ساخت آینده‌ ربات‌ها، روی پیام‌رسان سروش.</p>
          </motion.div>
          {Object.entries(footerLinks).map(([category, links]) => (
            <motion.div key={category} variants={staggerItem}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => {
                  if (link === "پشتیبانی") return <li key={link}><a href="https://sapp.ir/Veltorix" target="_blank" className="text-sm text-gray-500 hover:text-gray-300 inline-flex gap-1.5">پشتیبانی <span className="text-xs text-gray-600" dir="ltr">@Veltorix</span></a></li>;
                  if (legalPages.includes(link)) return <li key={link}><button onClick={() => onOpenLegal(link)} className="text-sm text-gray-500 hover:text-gray-300">{link}</button></li>;
                  const company = companyLinks.find(c => c.label === link);
                  if (company) return <li key={link}><Link to={company.to} className="text-sm text-gray-500 hover:text-gray-300">{link}</Link></li>;
                  return <li key={link}><span className="text-sm text-gray-500 hover:text-gray-300">{link}</span></li>;
                })}
              </ul>
            </motion.div>
          ))}
        </motion.div>
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-xs text-gray-600">© ۱۴۰۵ بات‌زون. تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-4">
            {["𝕏", "GH", "IN"].map((s) => <div key={s} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 text-xs hover:text-white hover:bg-white/10 transition-colors cursor-pointer">{s}</div>)}
          </div>
        </div>

        {/* Made with love - gray text + red heart SVG */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 pt-6 border-t border-white/[0.03] flex items-center justify-center gap-2 text-[13px] text-gray-500"
        >
          <span>ساخته شده با</span>
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1 }}
            className="inline-flex"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_2px_6px_rgba(239,68,68,0.4)]">
              <path d="M12 21s-6.5-4.35-9.17-8.33A5.5 5.5 0 0112 6.5a5.5 5.5 0 019.17 6.17C18.5 16.65 12 21 12 21z" />
            </svg>
          </motion.span>
          <span>برای شما</span>
        </motion.div>
      </div>
    </footer>
  );
}

const legalContent: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  "حریم خصوصی": { title: "سیاست حریم خصوصی", sections: [{ heading: "جمع‌آوری اطلاعات", body: "بات‌زون اطلاعات شخصی شما شامل نام، آدرس ایمیل و شماره تلفن را هنگام ثبت‌نام جمع‌آوری می‌کند." }, { heading: "استفاده از اطلاعات", body: "اطلاعات برای بهبود خدمات و پشتیبانی فنی استفاده می‌شود." }, { heading: "حفاظت از داده‌ها", body: "تمامی داده‌ها با پروتکل‌های رمزنگاری پیشرفته محافظت می‌شوند." }, { heading: "حقوق کاربران", body: "شما حق دسترسی و حذف اطلاعات خود را دارید." }] },
  "قوانین استفاده": { title: "قوانین و شرایط استفاده", sections: [{ heading: "پذیرش شرایط", body: "با استفاده از خدمات بات‌زون، موافقت خود را با قوانین اعلام می‌کنید." }, { heading: "استفاده مجاز", body: "ربات‌ها باید مطابق قوانین ایران و سروش باشند." }, { heading: "مسئولیت‌ها", body: "هر کاربر مسئول ربات خود می‌باشد." }, { heading: "تعلیق حساب", body: "حق تعلیق حساب‌های متخلف محفوظ است." }] },
  "امنیت": { title: "سیاست امنیتی", sections: [{ heading: "رمزنگاری داده‌ها", body: "ارتباطات با TLS 1.3 و AES-256 رمزنگاری می‌شود." }, { heading: "احراز هویت", body: "از احراز هویت چند مرحله‌ای پشتیبانی می‌کنیم." }, { heading: "نظارت و پایش", body: "سیستم‌ها ۲۴ ساعته نظارت می‌شوند." }, { heading: "گزارش آسیب‌پذیری", body: "از طریق پشتیبانی گزارش دهید." }] },
  "کوکی‌ها": { title: "سیاست کوکی‌ها", sections: [{ heading: "کوکی چیست؟", body: "فایل‌های متنی کوچک در مرورگر شما." }, { heading: "کوکی‌های ضروری", body: "برای عملکرد صحیح الزامی هستند." }, { heading: "کوکی‌های تحلیلی", body: "برای تحلیل استفاده کاربران." }, { heading: "مدیریت کوکی‌ها", body: "می‌توانید از طریق مرورگر مدیریت کنید." }] },
};

function LegalModal({ page, onClose }: { page: string; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-2xl max-h-[85vh] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-white/[0.02]"><h2 className="text-xl font-bold text-white">{legalContent[page]?.title}</h2><button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">✕</button></div>
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-6">
          {legalContent[page]?.sections.map((s, i) => <div key={i}><h3 className="text-white font-semibold mb-2">{i + 1}. {s.heading}</h3><p className="text-sm text-gray-400 leading-7">{s.body}</p></div>)}
        </div>
      </motion.div>
    </motion.div>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-gray-200/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-gray-300/30 rounded-full blur-[100px]" />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.04] border border-black/[0.06] text-xs font-medium text-gray-500 mb-8">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> خطای ۴۰۴ — صفحه یافت نشد
        </motion.div>
        <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 100, delay: 0.2 }} className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.08)] flex items-center justify-center mb-8">
          <span className="text-5xl sm:text-6xl font-black bg-gradient-to-br from-gray-900 via-gray-600 to-gray-400 bg-clip-text text-transparent">۴۰۴</span>
        </motion.div>
        <motion.h1 {...fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">صفحه مورد نظر<br /><span className="bg-gradient-to-r from-gray-500 via-gray-900 to-gray-500 bg-clip-text text-transparent">پیدا نشد</span></motion.h1>
        <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="text-base sm:text-lg text-gray-500 max-w-md mx-auto mb-3">متأسفیم! صفحه‌ای که به دنبال آن هستید وجود ندارد.</motion.p>
        <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mb-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-black/[0.06] text-xs font-mono text-gray-500"><span dir="ltr">{location.pathname}</span></motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/")} className="text-sm font-semibold text-white bg-gray-900 px-7 py-3.5 rounded-full shadow-xl">بازگشت به خانه</motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(-1)} className="text-sm font-medium text-gray-600 bg-black/[0.04] border border-black/[0.06] px-7 py-3.5 rounded-full">بازگشت قبل</motion.button>
        </motion.div>
      </div>
    </div>
  );
}

function PageHero({ title, subtitle, badge }: { title: string; subtitle: string; badge: string }) {
  return (
    <section className="relative pt-36 pb-20 bg-white overflow-hidden">
      <motion.div animate={{ x: [0, 15, 0], y: [0, -10, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-gray-200/40 rounded-full blur-[120px]" />
      <motion.div animate={{ x: [0, -10, 0], y: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity }} className="absolute bottom-[-20%] right-[10%] w-[400px] h-[400px] bg-gray-300/20 rounded-full blur-[100px]" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.04] border border-black/[0.06] text-xs font-medium text-gray-600 mb-6"><span className="w-2 h-2 rounded-full bg-gray-900" />{badge}</motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.7 }} className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-4">{title}</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }} className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{subtitle}</motion.p>
      </div>
    </section>
  );
}

function AboutPage({ onOpenLegal }: { onOpenLegal: (page: string) => void }) {
  return (
    <PageTransition>
      <PageHero badge="شرکت" title="درباره بات‌زون" subtitle="ما آینده‌ ربات‌های سروش را می‌سازیم — ساده، سریع و امن" />
      <section className="py-20 bg-gray-50 border-t border-black/[0.06]">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}><h2 className="text-3xl font-bold mb-4">ماموریت ما</h2><p className="text-gray-500 leading-7">بات‌زون در ۱۴۰۳ با هدف ساده‌سازی توسعه ربات روی سروش آغاز شد. امروز بیش از ۳۰۰ ربات فعال داریم.</p></motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="rounded-2xl bg-white border p-8 shadow-xl grid grid-cols-2 gap-6 text-center">
            <div><div className="text-3xl font-bold">۱۴۰۳</div><div className="text-xs text-gray-500">سال تأسیس</div></div>
            <div><div className="text-3xl font-bold">۱۲ نفر</div><div className="text-xs text-gray-500">اعضای تیم</div></div>
            <div><div className="text-3xl font-bold">+۳۰۰</div><div className="text-xs text-gray-500">ربات فعال</div></div>
            <div><div className="text-3xl font-bold">۹۹.۹۹٪</div><div className="text-xs text-gray-500">آپتایم</div></div>
          </motion.div>
        </div>
      </section>
      <Footer onOpenLegal={onOpenLegal} />
    </PageTransition>
  );
}

function BlogPage({ onOpenLegal }: { onOpenLegal: (page: string) => void }) {
  const posts = [
    { title: "چگونه ربات سروش بسازیم؟ راهنمای کامل ۱۴۰۴", date: "۲۱ مرداد ۱۴۰۴", tag: "آموزش" },
    { title: "۵ ترفند برای افزایش سرعت ربات‌ها", date: "۱۵ مرداد ۱۴۰۴", tag: "بهینه‌سازی" },
    { title: "معرفی نسخه ۲.۰ بات‌زون", date: "۱۰ مرداد ۱۴۰۴", tag: "اخبار" },
    { title: "امنیت ربات‌ها: بهترین شیوه‌ها", date: "۵ مرداد ۱۴۰۴", tag: "امنیت" },
    { title: "مقایسه بات‌زون با رقبا", date: "۱ مرداد ۱۴۰۴", tag: "بررسی" },
    { title: "ساخت فروشگاه رباتیک", date: "۲۸ تیر ۱۴۰۴", tag: "کسب‌وکار" },
  ];
  return (
    <PageTransition>
      <PageHero badge="وبلاگ" title="وبلاگ بات‌زون" subtitle="آخرین آموزش‌ها و اخبار" />
      <section className="py-16 bg-gray-50 border-t">
        <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="max-w-5xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <motion.div key={p.title} variants={staggerItem} whileHover={{ y: -6 }} className="rounded-2xl bg-white border p-6 hover:shadow-xl transition-all">
              <div className="flex justify-between mb-4"><span className="text-xs px-3 py-1 rounded-full bg-black/[0.04] border">{p.tag}</span><span className="text-xs text-gray-400">{p.date}</span></div>
              <h3 className="font-semibold leading-relaxed">{p.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <Footer onOpenLegal={onOpenLegal} />
    </PageTransition>
  );
}

function CareersPage({ onOpenLegal }: { onOpenLegal: (page: string) => void }) {
  const jobs = [
    { role: "مهندس بک‌اند (Node.js)", type: "تمام‌وقت • ریموت", loc: "تهران / ریموت" },
    { role: "طراح محصول UI/UX", type: "تمام‌وقت • حضوری", loc: "تهران" },
    { role: "متخصص DevOps", type: "پاره‌وقت • ریموت", loc: "ریموت" },
    { role: "پشتیبان فنی", type: "تمام‌وقت • ریموت", loc: "ریموت" },
  ];
  return (
    <PageTransition>
      <PageHero badge="فرصت‌های شغلی" title="به تیم ما بپیوندید" subtitle="افراد باانگیزه برای ساخت آینده‌ ربات‌ها" />
      <section className="py-16 bg-gray-50 border-t">
        <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="max-w-4xl mx-auto px-6 space-y-4">
          {jobs.map((job) => (
            <motion.div key={job.role} variants={staggerItem} whileHover={{ scale: 1.01 }} className="flex flex-col sm:flex-row justify-between gap-4 rounded-2xl bg-white border p-6">
              <div><h3 className="font-semibold">{job.role}</h3><div className="flex gap-2 mt-2"><span className="text-xs px-3 py-1 rounded-full bg-black/[0.04] border">{job.type}</span><span className="text-xs px-3 py-1 rounded-full bg-white border">{job.loc}</span></div></div>
              <button className="text-sm bg-gray-900 text-white px-5 py-2.5 rounded-full">ارسال رزومه</button>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <Footer onOpenLegal={onOpenLegal} />
    </PageTransition>
  );
}

function NewsPage({ onOpenLegal }: { onOpenLegal: (page: string) => void }) {
  const news = [
    { date: "۲۲ مرداد ۱۴۰۴", title: "بات‌زون به ۳۰۰ ربات فعال رسید", desc: "رشد ۱۲۰٪ در ۶ ماه." },
    { date: "۱۸ مرداد ۱۴۰۴", title: "همکاری با سروش برای API جدید", desc: "دسترسی سریع‌تر." },
    { date: "۱۰ مرداد ۱۴۰۴", title: "داشبورد جدید آنالیتیکس", desc: "آمار لحظه‌ای پیشرفته." },
  ];
  return (
    <PageTransition>
      <PageHero badge="اخبار" title="آخرین اخبار" subtitle="به‌روزرسانی‌ها و دستاوردها" />
      <section className="py-16 bg-gray-50 border-t"><div className="max-w-3xl mx-auto px-6 border-r border-black/10 pr-8 space-y-12">{news.map((n, i) => <motion.div key={n.title} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative"><div className="absolute -right-[37px] w-3 h-3 rounded-full bg-gray-900 ring-4 ring-white" /><div className="text-xs text-gray-400">{n.date}</div><h3 className="font-semibold text-lg">{n.title}</h3><p className="text-sm text-gray-500 mt-2">{n.desc}</p></motion.div>)}</div></section>
      <Footer onOpenLegal={onOpenLegal} />
    </PageTransition>
  );
}

function PartnersPage({ onOpenLegal }: { onOpenLegal: (page: string) => void }) {
  const partners = ["سروش", "تک‌نوآوران", "دیجی‌سرویس", "آسان‌تک", "ابرآروان", "پارس‌پک"];
  return (
    <PageTransition>
      <PageHero badge="همکاران" title="همکاران ما" subtitle="سازمان‌هایی که به بات‌زون اعتماد کرده‌اند" />
      <section className="py-16 bg-gray-50 border-t">
        <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" viewport={{ once: true }} className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 gap-6">
          {partners.map((name) => <motion.div key={name} variants={staggerItem} whileHover={{ y: -4, scale: 1.02 }} className="rounded-2xl bg-white border p-8 h-32 flex items-center justify-center hover:shadow-lg"><span className="font-bold text-gray-400">{name}</span></motion.div>)}
        </motion.div>
      </section>
      <Footer onOpenLegal={onOpenLegal} />
    </PageTransition>
  );
}

function HomePage({ onOpenLegal }: { onOpenLegal: (page: string) => void }) {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer onOpenLegal={onOpenLegal} />
    </>
  );
}

function AnimatedRoutes({ onOpenLegal }: { onOpenLegal: (p: string) => void }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage onOpenLegal={onOpenLegal} /></PageTransition>} />
        <Route path="/about" element={<AboutPage onOpenLegal={onOpenLegal} />} />
        <Route path="/blog" element={<BlogPage onOpenLegal={onOpenLegal} />} />
        <Route path="/careers" element={<CareersPage onOpenLegal={onOpenLegal} />} />
        <Route path="/news" element={<NewsPage onOpenLegal={onOpenLegal} />} />
        <Route path="/partners" element={<PartnersPage onOpenLegal={onOpenLegal} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [legalPage, setLegalPage] = useState<string | null>(null);
  return (
    <BrowserRouter basename="/BotZone">
      <div className="antialiased overflow-x-hidden">
        <ScrollProgress />
        <Navbar />
        <AnimatedRoutes onOpenLegal={(p) => setLegalPage(p)} />
        <AnimatePresence>
          {legalPage && <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}
