import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-4 sm:top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="w-full max-w-5xl pointer-events-auto">
        {/* Pill Navbar - modern floating island */}
        <nav
          className={`relative flex items-center justify-between gap-4 px-3 sm:px-5 py-2.5 sm:py-3 rounded-full border transition-all duration-500 ${
            scrolled
              ? "bg-white/85 backdrop-blur-2xl border-black/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)]"
              : "bg-white/70 backdrop-blur-xl border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.03)]"
          }`}
        >
          {/* Logo - circular accent */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 pl-1">
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-lg shadow-black/10 group-hover:shadow-black/20 group-hover:scale-105 transition-all duration-300">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>
            <span className="text-[17px] font-bold tracking-tight text-gray-900">بات‌زون</span>
          </Link>

          {/* Desktop Nav - pill inside pill */}
          <div className="hidden lg:flex items-center gap-1 bg-black/[0.03] rounded-full p-1">
            {[
              { label: "امکانات", href: "/#features" },
              { label: "تعرفه‌ها", href: "/#pricing" },
              { label: "درباره ما", href: "/#about" },
              { label: "وبلاگ", href: "/#blog" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-white px-4 py-2 rounded-full transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA - circular buttons */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link to="/" className="text-[13px] font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-full hover:bg-black/[0.04] transition-all">
              ورود
            </Link>
            <Link to="/" className="text-[13px] font-semibold text-white bg-gray-900 hover:bg-black px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98]">
              شروع کنید
            </Link>
          </div>

          {/* Mobile Menu Button - circular */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all duration-200 shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu - floating circle card */}
        {menuOpen && (
          <div className="md:hidden mt-3 p-2 rounded-[24px] bg-white/90 backdrop-blur-2xl border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.05)] animate-[fadeIn_0.2s_ease]">
            <div className="rounded-[18px] bg-gray-50/80 border border-black/[0.03] p-2 space-y-1">
              {[
                { label: "امکانات", href: "/#features", icon: "✨" },
                { label: "تعرفه‌ها", href: "/#pricing", icon: "💳" },
                { label: "درباره ما", href: "/#about", icon: "👥" },
                { label: "وبلاگ", href: "/#blog", icon: "📝" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-sm transition-all"
                >
                  <span className="w-8 h-8 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-sm">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="p-2 mt-2 flex items-center gap-2">
              <button className="flex-1 text-sm font-medium text-gray-600 hover:text-gray-900 bg-black/[0.04] hover:bg-black/[0.06] border border-black/[0.06] rounded-full py-3 transition-colors">
                ورود
              </button>
              <button className="flex-1 text-sm font-semibold text-white bg-gray-900 hover:bg-black rounded-full py-3 shadow-lg shadow-black/10 transition-all">
                شروع کنید
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle light background effects */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-gray-200/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-gray-300/30 rounded-full blur-[100px]" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.2] mb-6">
          <span className="text-gray-900">ربات‌های هوشمند</span>
          <br />
          <span className="bg-gradient-to-r from-gray-900 via-gray-500 to-gray-900 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">
            برای سروش
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          بات‌زون، پلتفرم طراحی و توسعه ربات‌های حرفه‌ای روی پیام‌رسان سروش.
          ابزارهای قدرتمند، راه‌اندازی سریع، بدون پیچیدگی.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-black/10 hover:shadow-black/20 hover:scale-105">
            شروع رایگان
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-medium text-gray-600 hover:text-gray-900 bg-black/[0.03] hover:bg-black/[0.06] border border-black/[0.06] hover:border-black/10 px-8 py-4 rounded-full transition-all duration-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none" />
            </svg>
            مشاهده دمو
          </button>
        </div>

        {/* Hero Image / Dashboard Preview */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-300/50 to-gray-400/30 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
          <div className="relative rounded-2xl border border-black/[0.08] bg-white overflow-hidden shadow-2xl shadow-black/10">
            {/* Fake Browser Bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 bg-gray-50/80">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-12">
                <div className="bg-black/[0.04] rounded-md px-3 py-1 text-xs text-gray-400 text-center max-w-xs mx-auto" dir="ltr">
                  botzone.ir/dashboard
                </div>
              </div>
            </div>
            {/* Dashboard Content */}
            <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "پیام‌ها", value: "۴۸,۲۰۰", change: "+۱۲.۵٪", color: "emerald" },
                  { label: "کاربران", value: "۲,۸۴۷", change: "+۸.۱٪", color: "gray" },
                  { label: "آپتایم", value: "۹۹.۹۸٪", change: "+۰.۰۲٪", color: "gray" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white border border-black/[0.06] p-4 shadow-sm">
                    <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <span className={`text-xs font-medium ${stat.color === "emerald" ? "text-emerald-500" : "text-gray-500"}`}>
                      {stat.change}
                    </span>
                  </div>
                ))}
              </div>
              {/* Fake chart bars */}
              <div className="rounded-xl bg-white border border-black/[0.06] p-4 h-40 flex items-end gap-2 shadow-sm">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md bg-gradient-to-t from-gray-800 to-gray-400"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-100" />
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: "سرعت بالا",
      description: "پاسخگویی در کسری از ثانیه با زیرساخت پیشرفته و بهینه‌سازی شده برای عملکرد حداکثری.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: "امنیت بالا",
      description: "رمزنگاری سرتاسری، کنترل دسترسی مبتنی بر نقش و ثبت کامل لاگ‌های فعالیت.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
      title: "توسعه‌دهنده محور",
      description: "APIهای جامع، مستندات کامل و ابزارهای یکپارچه‌سازی با سرویس‌های محبوب شما.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
      title: "آمار لحظه‌ای",
      description: "پیگیری عملکرد ربات‌ها با داشبوردهای سفارشی و نمایش داده‌ها به صورت زنده.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      title: "مدیریت تیمی",
      description: "ابزارهای همکاری تیمی با فضای کار مشترک، نظرات و ویرایش همزمان.",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      ),
      title: "مقیاس‌پذیری خودکار",
      description: "زیرساختی که به‌صورت خودکار برای مدیریت هر حجمی از ترافیک مقیاس‌بندی می‌شود.",
    },
  ];

  return (
    <section id="features" className="relative py-32 bg-gray-100">
      {/* Top fade from hero */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-sm font-semibold text-gray-400 tracking-widest mb-4 block">امکانات</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5">
            هر آنچه برای ساخت ربات نیاز دارید
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            امکانات قدرتمند برای توسعه سریع‌تر ربات‌های سروش و ارائه بهترین تجربه به کاربران.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl bg-white border border-black/[0.06] hover:border-black/10 p-8 transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 shadow-lg shadow-black/10 mb-5 text-white group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade into darker section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-300" />
    </section>
  );
}

function Stats() {
  const stats = [
    {
      value: "۹۹.۹۹٪",
      label: "آپتایم تضمینی",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
    {
      value: "+۵۰ هزار",
      label: "کاربر فعال",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
    },
    {
      value: "+۳۰۰",
      label: "ربات فعال",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.25 3v1.5M4.5 21v-1.5M19.5 21v-1.5M15.75 3v1.5M12 3v1.5m0 15V21m-4.5-1.5h9M6 10.5a.75.75 0 01.75-.75h10.5a.75.75 0 01.75.75v6a.75.75 0 01-.75.75H6.75A.75.75 0 016 16.5v-6zM9 13.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm9 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>
      ),
    },
    {
      value: "‏<۵۰ms",
      label: "میانگین تأخیر",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 6v6h4.5m-4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a2.25 2.25 0 00-2.25-2.25z" opacity={0.5} />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative py-24 bg-gray-300">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-black/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.06)] text-gray-900 mb-4 group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] transition-all duration-300">
                {stat.icon}
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom fade into darker */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-500" />
    </section>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "بات‌زون فرایند توسعه ربات‌های ما رو کاملاً متحول کرد. سه برابر سریع‌تر از حد انتظار ربات‌مون رو راه‌اندازی کردیم.",
      author: "مهدی احمدی",
      role: "مدیر فنی، تک‌نوآوران",
      avatar: "https://images.pexels.com/photos/7640741/pexels-photo-7640741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100",
    },
    {
      quote: "بهترین تجربه توسعه‌ای که داشتم. انگار یه ابرقدرت برای ساخت ربات در اختیارتون قرار میده.",
      author: "سارا رضایی",
      role: "توسعه‌دهنده ارشد، دیجی‌سرویس",
      avatar: "https://images.pexels.com/photos/8837261/pexels-photo-8837261.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100",
    },
    {
      quote: "هزینه‌های زیرساختمون رو ۶۰ درصد کاهش دادیم و در عین حال عملکرد بهتری هم داریم. واقعاً عالیه.",
      author: "علی محمدی",
      role: "معاون مهندسی، آسان‌تک",
      avatar: "https://images.pexels.com/photos/18459701/pexels-photo-18459701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100&w=100",
    },
  ];

  return (
    <section id="about" className="relative py-32 bg-gray-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-gray-200 tracking-widest mb-4 block">نظرات مشتریان</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5">
            مورد اعتماد تیم‌های حرفه‌ای
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-8 hover:bg-white/15 hover:border-white/25 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/90 leading-relaxed mb-6 text-sm">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                />
                <div>
                  <p className="text-white font-medium text-sm">{t.author}</p>
                  <p className="text-white/50 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Bottom fade into darker */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-700" />
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-32 bg-gray-700 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/5 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          آماده‌اید ربات
          <span className="block bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
            خودتون رو بسازید؟
          </span>
        </h2>
        <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
          به هزاران تیمی بپیوندید که با بات‌زون سریع‌تر ربات می‌سازند.
          شروع رایگان — بدون نیاز به کارت بانکی.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 text-base font-semibold text-gray-900 bg-white hover:bg-gray-100 px-8 py-4 rounded-full transition-all duration-300 shadow-xl shadow-black/20 hover:shadow-black/30 hover:scale-105">
            شروع رایگان
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button className="w-full sm:w-auto text-base font-medium text-gray-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 px-8 py-4 rounded-full transition-all duration-300">
            تماس با فروش
          </button>
        </div>
      </div>
      {/* Bottom fade into footer */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-gray-900" />
    </section>
  );
}

function Footer({ onOpenLegal }: { onOpenLegal: (page: string) => void }) {
  const legalPages = ["حریم خصوصی", "قوانین استفاده", "امنیت", "کوکی‌ها"];

  const footerLinks = {
    "محصول": ["امکانات", "تعرفه‌ها", "یکپارچه‌سازی", "تغییرات", "مستندات"],
    "شرکت": ["درباره ما", "وبلاگ", "فرصت‌های شغلی", "اخبار", "همکاران"],
    "منابع": ["انجمن", "تماس با ما", "پشتیبانی", "وضعیت سرور", "API"],
    "قوانین": legalPages,
  };

  return (
    <footer className="relative bg-gray-900 pt-20 pb-10">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <span className="text-lg font-bold text-white">بات‌زون</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              ساخت آینده‌ ربات‌ها، روی پیام‌رسان سروش.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => {
                  if (link === "پشتیبانی") {
                    return (
                      <li key={link}>
                        <a
                          href="https://sapp.ir/Veltorix"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-gray-500 hover:text-gray-300 transition-colors inline-flex items-center gap-1.5"
                        >
                          پشتیبانی
                          <span className="text-xs text-gray-600" dir="ltr">@Veltorix</span>
                        </a>
                      </li>
                    );
                  }
                  if (legalPages.includes(link)) {
                    return (
                      <li key={link}>
                        <button
                          onClick={() => onOpenLegal(link)}
                          className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
                        >
                          {link}
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-xs text-gray-600">
            © ۱۴۰۵ بات‌زون. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            {[
              <svg key="twitter" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
              <svg key="github" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
              <svg key="linkedin" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
            ].map((icon) => (
              <a
                key={String(icon.key)}
                href="#"
                className="text-gray-600 hover:text-gray-300 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const legalContent: Record<string, { title: string; sections: { heading: string; body: string }[] }> = {
  "حریم خصوصی": {
    title: "سیاست حریم خصوصی",
    sections: [
      {
        heading: "جمع‌آوری اطلاعات",
        body: "بات‌زون اطلاعات شخصی شما شامل نام، آدرس ایمیل و شماره تلفن را هنگام ثبت‌نام جمع‌آوری می‌کند. این اطلاعات صرفاً برای ارائه خدمات بهتر و ارتباط با شما استفاده می‌شود.",
      },
      {
        heading: "استفاده از اطلاعات",
        body: "اطلاعات جمع‌آوری شده برای بهبود خدمات، ارسال اطلاع‌رسانی‌های مهم، پشتیبانی فنی و تحلیل آماری عملکرد پلتفرم مورد استفاده قرار می‌گیرد. ما هرگز اطلاعات شما را به اشخاص ثالث نمی‌فروشیم.",
      },
      {
        heading: "حفاظت از داده‌ها",
        body: "تمامی داده‌های کاربران با استفاده از پروتکل‌های رمزنگاری پیشرفته محافظت می‌شوند. سرورهای ما دارای گواهینامه‌های امنیتی معتبر هستند و به‌صورت مداوم مورد بازرسی قرار می‌گیرند.",
      },
      {
        heading: "حقوق کاربران",
        body: "شما در هر زمان حق دسترسی، ویرایش و حذف اطلاعات شخصی خود را دارید. برای اعمال این حقوق می‌توانید از طریق پشتیبانی با ما در ارتباط باشید.",
      },
    ],
  },
  "قوانین استفاده": {
    title: "قوانین و شرایط استفاده",
    sections: [
      {
        heading: "پذیرش شرایط",
        body: "با استفاده از خدمات بات‌زون، شما موافقت خود را با تمامی قوانین و شرایط ذکر شده در این صفحه اعلام می‌کنید. در صورت عدم موافقت، لطفاً از استفاده خدمات خودداری کنید.",
      },
      {
        heading: "استفاده مجاز",
        body: "ربات‌های ساخته شده روی پلتفرم بات‌زون باید مطابق با قوانین جمهوری اسلامی ایران و قوانین پیام‌رسان سروش باشند. هرگونه استفاده غیرقانونی، ارسال هرزنامه یا محتوای نامناسب ممنوع است.",
      },
      {
        heading: "مسئولیت‌ها",
        body: "بات‌زون مسئولیتی در قبال محتوای تولید شده توسط ربات‌های کاربران ندارد. هر کاربر مسئول عملکرد و محتوای ربات خود می‌باشد.",
      },
      {
        heading: "تعلیق حساب",
        body: "بات‌زون حق تعلیق یا حذف حساب‌هایی که قوانین استفاده را نقض کنند، بدون اطلاع قبلی محفوظ می‌دارد.",
      },
    ],
  },
  "امنیت": {
    title: "سیاست امنیتی",
    sections: [
      {
        heading: "رمزنگاری داده‌ها",
        body: "تمامی ارتباطات بین کاربران و سرورهای بات‌زون با پروتکل TLS 1.3 رمزنگاری می‌شود. داده‌های حساس در حالت سکون نیز با الگوریتم AES-256 رمزنگاری شده‌اند.",
      },
      {
        heading: "احراز هویت",
        body: "ما از سیستم احراز هویت چند مرحله‌ای (MFA) پشتیبانی می‌کنیم. توصیه اکید داریم که کاربران این قابلیت را فعال کنند تا امنیت حساب خود را افزایش دهند.",
      },
      {
        heading: "نظارت و پایش",
        body: "سیستم‌های ما به‌صورت ۲۴ ساعته تحت نظارت هستند. هرگونه فعالیت مشکوک به‌سرعت شناسایی و بررسی می‌شود. لاگ‌های دسترسی به‌مدت ۹۰ روز نگهداری می‌شوند.",
      },
      {
        heading: "گزارش آسیب‌پذیری",
        body: "اگر آسیب‌پذیری امنیتی در پلتفرم بات‌زون یافتید، لطفاً از طریق پشتیبانی (@Veltorix در سروش) به ما اطلاع دهید. ما برنامه پاداش باگ‌بانتی داریم.",
      },
    ],
  },
  "کوکی‌ها": {
    title: "سیاست کوکی‌ها",
    sections: [
      {
        heading: "کوکی چیست؟",
        body: "کوکی‌ها فایل‌های متنی کوچکی هستند که در مرورگر شما ذخیره می‌شوند. ما از کوکی‌ها برای بهبود تجربه کاربری و عملکرد بهتر سایت استفاده می‌کنیم.",
      },
      {
        heading: "کوکی‌های ضروری",
        body: "این کوکی‌ها برای عملکرد صحیح وب‌سایت الزامی هستند و شامل احراز هویت، تنظیمات جلسه و ترجیحات زبان می‌شوند. بدون این کوکی‌ها سایت به درستی کار نخواهد کرد.",
      },
      {
        heading: "کوکی‌های تحلیلی",
        body: "ما از کوکی‌های تحلیلی برای درک نحوه استفاده کاربران از سایت استفاده می‌کنیم. این اطلاعات به ما کمک می‌کند تا خدمات خود را بهبود دهیم.",
      },
      {
        heading: "مدیریت کوکی‌ها",
        body: "شما می‌توانید تنظیمات کوکی‌ها را از طریق مرورگر خود مدیریت کنید. توجه داشته باشید که غیرفعال کردن برخی کوکی‌ها ممکن است بر عملکرد سایت تأثیر بگذارد.",
      },
    ],
  },
};

function LegalModal({ page, onClose }: { page: string; onClose: () => void }) {
  const content = legalContent[page];
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[85vh] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-white/[0.02]">
          <h2 className="text-xl font-bold text-white">{content.title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 overflow-y-auto max-h-[calc(85vh-80px)] space-y-8">
          {content.sections.map((section, i) => (
            <div key={i}>
              <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-xs text-gray-400 font-mono">
                  {i + 1}
                </span>
                {section.heading}
              </h3>
              <p className="text-sm text-gray-400 leading-7 pr-8">{section.body}</p>
            </div>
          ))}

          {/* Support note */}
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-5 flex items-start gap-3">
            <span className="text-lg mt-0.5">💬</span>
            <div>
              <p className="text-sm text-gray-300 font-medium mb-1">سؤالی دارید؟</p>
              <p className="text-xs text-gray-500">
                برای هرگونه سؤال در مورد این سیاست، با پشتیبانی ما تماس بگیرید:{" "}
                <a
                  href="https://sapp.ir/Veltorix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                  dir="ltr"
                >
                  @Veltorix
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex flex-col">
      {/* Background Effects - same as Hero */}
      <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-gray-200/50 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-gray-300/30 rounded-full blur-[100px]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        {/* 404 Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/[0.04] border border-black/[0.06] text-xs font-medium text-gray-500 mb-8">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          خطای ۴۰۴ — صفحه یافت نشد
        </div>

        {/* Big 404 Circle Design - Modern Style */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200/50 to-gray-300/30 rounded-full blur-[40px] scale-110" />
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white border border-black/[0.06] shadow-[0_16px_48px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)] flex items-center justify-center">
            <span className="text-5xl sm:text-6xl font-black tracking-tight bg-gradient-to-br from-gray-900 via-gray-600 to-gray-400 bg-clip-text text-transparent">
              ۴۰۴
            </span>
          </div>
          {/* Floating small circles */}
          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 shadow-lg flex items-center justify-center">
            <span className="text-[10px]">⚠️</span>
          </div>
          <div className="absolute -bottom-1 -left-3 w-8 h-8 rounded-full bg-white border border-black/[0.06] shadow-md flex items-center justify-center text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75L4.5 4.5m0 0l5.25 5.25m-5.25-5.25v4.5m4.5-4.5h4.5m-9 9l5.25 5.25m-5.25-5.25v-4.5m4.5 4.5h4.5" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
          صفحه مورد نظر
          <br />
          <span className="bg-gradient-to-r from-gray-500 via-gray-900 to-gray-500 bg-clip-text text-transparent">
            پیدا نشد
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-500 max-w-md mx-auto mb-3 leading-relaxed">
          متأسفیم! صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
        </p>
        
        {/* Show attempted path */}
        <div className="mb-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-black/[0.06] text-xs font-mono text-gray-500 max-w-full truncate">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
          <span dir="ltr" className="truncate">{location.pathname}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-gray-900 hover:bg-black px-7 py-3.5 rounded-full transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            بازگشت به خانه
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-black/[0.04] hover:bg-black/[0.06] border border-black/[0.06] hover:border-black/10 px-7 py-3.5 rounded-full transition-all duration-300"
          >
            بازگشت به صفحه قبل
          </button>
        </div>

        {/* Helpful Links - circular pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-2 max-w-lg">
          <span className="text-xs text-gray-400 w-full text-center mb-2">شاید به دنبال این باشید:</span>
          {[
            { label: "امکانات", to: "/#features" },
            { label: "تعرفه‌ها", to: "/#pricing" },
            { label: "مستندات", to: "/" },
            { label: "پشتیبانی", to: "https://sapp.ir/Veltorix", external: true },
          ].map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 border border-black/[0.06] hover:border-black/10 px-4 py-2 rounded-full transition-all"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.to}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-50 border border-black/[0.06] hover:border-black/10 px-4 py-2 rounded-full transition-all"
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
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

export default function App() {
  const [legalPage, setLegalPage] = useState<string | null>(null);

  return (
    <BrowserRouter basename="/BotZone">
      <div className="antialiased">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage onOpenLegal={(page) => setLegalPage(page)} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        {legalPage && (
          <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />
        )}
      </div>
    </BrowserRouter>
  );
}
