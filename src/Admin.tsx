import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  Bot,
  Box,
  Check,
  ChevronLeft,
  CircleAlert,
  Eye,
  EyeOff,
  LayoutDashboard,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  Moon,
  PackagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  ShieldCheck,
  ShoppingBag,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import "./admin.css";

type Theme = "light" | "dark";
type AdminProduct = {
  id: number;
  title: string;
  subtitle: string;
  type: "bot" | "item";
  category: string;
  price: number;
  old_price: number | null;
  badge: string | null;
  tone: "violet" | "blue" | "orange" | "pink" | "green" | "cyan";
  rating: number;
  reviews: number;
  active: boolean;
  created_at: string;
};

type ProductDraft = Omit<AdminProduct, "id" | "rating" | "reviews" | "created_at">;
type AdminStage = "checking" | "login" | "dashboard";

const emptyDraft: ProductDraft = {
  title: "",
  subtitle: "",
  type: "bot",
  category: "",
  price: 0,
  old_price: null,
  badge: null,
  tone: "violet",
  active: true,
};

const formatNumber = (value: number) => value.toLocaleString("fa-IR");

function ThemeButton({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button className="admin-icon-button" onClick={onToggle} aria-label="تغییر پوسته">
      {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}

function AdminLogin({ theme, onToggleTheme, onAuthenticated }: { theme: Theme; onToggleTheme: () => void; onAuthenticated: () => Promise<void> }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || loading) return;
    setError("");
    setLoading(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setPassword("");
    if (loginError) {
      setError("ایمیل یا رمز عبور صحیح نیست.");
      setLoading(false);
      return;
    }
    await onAuthenticated();
    setLoading(false);
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-orb orb-a" />
      <div className="admin-login-orb orb-b" />
      <div className="admin-login-top">
        <a href={`${import.meta.env.BASE_URL}`}><ArrowLeft size={17} /> بازگشت به فروشگاه</a>
        <ThemeButton theme={theme} onToggle={onToggleTheme} />
      </div>
      <section className="admin-login-card">
        <div className="admin-login-brand"><span><Bot size={29} /></span><div><strong>بات‌زون</strong><small>مرکز مدیریت امن</small></div></div>
        <div className="admin-security-badge"><ShieldCheck size={15} /> ورود محافظت‌شده مدیر</div>
        <h1>ورود به پنل مدیریت</h1>
        <p>برای مدیریت محصولات، با حساب مدیر تأییدشده وارد شوید.</p>
        <form onSubmit={submit}>
          <label>
            <span>ایمیل مدیر</span>
            <div className="admin-input"><Mail size={18} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@example.com" autoComplete="username" required autoFocus /></div>
          </label>
          <label>
            <span>رمز عبور</span>
            <div className="admin-input"><LockKeyhole size={18} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="رمز عبور امن" autoComplete="current-password" minLength={8} required /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
          </label>
          {error && <div className="admin-form-error"><CircleAlert size={16} /> {error}</div>}
          <button className="admin-login-submit" disabled={loading}>{loading ? <><LoaderCircle className="spinner" size={19} /> در حال بررسی...</> : <><LogIn size={18} /> ورود امن</>}</button>
        </form>
        <div className="admin-login-foot"><LockKeyhole size={14} /> دسترسی فقط برای حساب‌های تأییدشده در سرور</div>
      </section>
    </main>
  );
}

function ProductEditor({ product, onClose, onSaved }: { product: AdminProduct | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [draft, setDraft] = useState<ProductDraft>(() => product ? {
    title: product.title,
    subtitle: product.subtitle,
    type: product.type,
    category: product.category,
    price: product.price,
    old_price: product.old_price,
    badge: product.badge,
    tone: product.tone,
    active: product.active,
  } : { ...emptyDraft });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const update = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase || saving) return;
    if (!draft.title.trim() || !draft.category.trim() || draft.price < 0) {
      setError("عنوان، دسته‌بندی و قیمت معتبر الزامی است.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      ...draft,
      title: draft.title.trim(),
      subtitle: draft.subtitle.trim(),
      category: draft.category.trim(),
      badge: draft.badge?.trim() || null,
      old_price: draft.old_price || null,
    };
    const result = product
      ? await supabase.from("products").update(payload).eq("id", product.id)
      : await supabase.from("products").insert(payload);
    if (result.error) {
      setError("ذخیره محصول انجام نشد. مقادیر را بررسی کنید.");
      setSaving(false);
      return;
    }
    await onSaved();
    setSaving(false);
    onClose();
  };

  return (
    <div className="admin-modal-layer">
      <div className="admin-modal-backdrop" onClick={onClose} />
      <form className="product-editor" onSubmit={submit}>
        <div className="editor-head"><div><span><PackagePlus size={20} /></span><div><h2>{product ? "ویرایش محصول" : "محصول جدید"}</h2><p>اطلاعاتی که در فروشگاه نمایش داده می‌شود.</p></div></div><button type="button" onClick={onClose}><X size={20} /></button></div>
        <div className="editor-grid">
          <label className="wide"><span>عنوان محصول</span><input value={draft.title} onChange={(event) => update("title", event.target.value)} maxLength={100} placeholder="مثلاً ربات فروشگاهی پلاس" required /></label>
          <label className="wide"><span>توضیح کوتاه</span><textarea value={draft.subtitle} onChange={(event) => update("subtitle", event.target.value)} maxLength={240} placeholder="یک توضیح کوتاه و واضح" rows={3} /></label>
          <label><span>نوع محصول</span><select value={draft.type} onChange={(event) => update("type", event.target.value as ProductDraft["type"])}><option value="bot">ربات</option><option value="item">آیتم</option></select></label>
          <label><span>دسته‌بندی</span><input value={draft.category} onChange={(event) => update("category", event.target.value)} maxLength={80} placeholder="فروش و پرداخت" required /></label>
          <label><span>قیمت (تومان)</span><input type="number" min="0" value={draft.price || ""} onChange={(event) => update("price", Number(event.target.value))} required /></label>
          <label><span>قیمت قبل از تخفیف</span><input type="number" min="0" value={draft.old_price ?? ""} onChange={(event) => update("old_price", event.target.value ? Number(event.target.value) : null)} /></label>
          <label><span>برچسب</span><input value={draft.badge ?? ""} onChange={(event) => update("badge", event.target.value || null)} maxLength={30} placeholder="جدید" /></label>
          <label><span>رنگ کارت</span><select value={draft.tone} onChange={(event) => update("tone", event.target.value as ProductDraft["tone"])}><option value="violet">بنفش</option><option value="blue">آبی</option><option value="orange">نارنجی</option><option value="pink">صورتی</option><option value="green">سبز</option><option value="cyan">فیروزه‌ای</option></select></label>
          <label className="editor-switch wide"><input type="checkbox" checked={draft.active} onChange={(event) => update("active", event.target.checked)} /><span><Check size={13} /></span><div><strong>نمایش در فروشگاه</strong><small>محصول برای همه بازدیدکنندگان قابل مشاهده باشد.</small></div></label>
        </div>
        {error && <div className="admin-form-error"><CircleAlert size={16} /> {error}</div>}
        <div className="editor-actions"><button type="button" onClick={onClose}>انصراف</button><button className="save-product" disabled={saving}>{saving ? <LoaderCircle className="spinner" size={18} /> : <Save size={18} />} ذخیره محصول</button></div>
      </form>
    </div>
  );
}

function AdminDashboard({ theme, onToggleTheme, onLogout }: { theme: Theme; onToggleTheme: () => void; onLogout: () => Promise<void> }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editor, setEditor] = useState<AdminProduct | "new" | null>(null);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    setError("");
    const { data, error: fetchError } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (fetchError) setError("دریافت محصولات انجام نشد.");
    else setProducts((data ?? []) as AdminProduct[]);
    setLoading(false);
  }, []);

  useEffect(() => { void loadProducts(); }, [loadProducts]);

  const remove = async (product: AdminProduct) => {
    if (!supabase || !window.confirm(`محصول «${product.title}» حذف شود؟`)) return;
    const { error: deleteError } = await supabase.from("products").delete().eq("id", product.id);
    if (deleteError) setError("حذف محصول انجام نشد.");
    else await loadProducts();
  };

  const toggleActive = async (product: AdminProduct) => {
    if (!supabase) return;
    const { error: updateError } = await supabase.from("products").update({ active: !product.active }).eq("id", product.id);
    if (updateError) setError("تغییر وضعیت محصول انجام نشد.");
    else await loadProducts();
  };

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <a className="admin-brand" href={`${import.meta.env.BASE_URL}`}><span><Bot size={23} /></span><div><strong>بات‌زون</strong><small>پنل مدیریت</small></div></a>
        <nav><a className="active" href="#products"><LayoutDashboard size={19} /> محصولات</a><a href={`${import.meta.env.BASE_URL}`}><ShoppingBag size={19} /> مشاهده فروشگاه <ChevronLeft size={15} /></a></nav>
        <div className="admin-secure-note"><ShieldCheck size={21} /><div><strong>اتصال امن</strong><small>دسترسی با سیاست‌های سطح‌ردیف محافظت می‌شود.</small></div></div>
        <button className="admin-logout" onClick={() => void onLogout()}><LogOut size={18} /> خروج امن</button>
      </aside>
      <section className="admin-main" id="products">
        <header className="admin-topbar"><div><p>مدیریت فروشگاه</p><h1>محصولات</h1></div><div><ThemeButton theme={theme} onToggle={onToggleTheme} /><button className="refresh-button" onClick={() => void loadProducts()}><RefreshCw size={18} /></button><button className="new-product-button" onClick={() => setEditor("new")}><Plus size={18} /> محصول جدید</button></div></header>
        <div className="admin-stats"><div><span className="stat-icon violet"><Box size={21} /></span><div><small>همه محصولات</small><strong>{formatNumber(products.length)}</strong></div></div><div><span className="stat-icon green"><Eye size={21} /></span><div><small>فعال در فروشگاه</small><strong>{formatNumber(products.filter((product) => product.active).length)}</strong></div></div><div><span className="stat-icon orange"><Bot size={21} /></span><div><small>ربات‌ها</small><strong>{formatNumber(products.filter((product) => product.type === "bot").length)}</strong></div></div></div>
        {error && <div className="admin-page-error"><CircleAlert size={18} /> {error}<button onClick={() => void loadProducts()}>تلاش دوباره</button></div>}
        <section className="admin-products-panel">
          <div className="panel-heading"><div><h2>فهرست محصولات</h2><p>محصولات فعال بلافاصله در فروشگاه نمایش داده می‌شوند.</p></div><span>{formatNumber(products.length)} محصول</span></div>
          {loading ? (
            <div className="admin-loading"><LoaderCircle className="spinner" size={28} /><span>در حال دریافت محصولات...</span></div>
          ) : products.length === 0 ? (
            <div className="admin-empty"><span><PackagePlus size={31} /></span><h3>هنوز محصولی ندارید</h3><p>فروشگاه در حال حاضر خالی است. اولین محصول را اضافه کنید.</p><button onClick={() => setEditor("new")}><Plus size={17} /> افزودن اولین محصول</button></div>
          ) : (
            <div className="admin-product-list">
              {products.map((product) => (
                <article key={product.id} className="admin-product-row">
                  <span className={`admin-product-icon ${product.tone}`}>{product.type === "bot" ? <Bot size={23} /> : <Box size={23} />}</span>
                  <div className="admin-product-title"><strong>{product.title}</strong><small>{product.category} · {product.type === "bot" ? "ربات" : "آیتم"}</small></div>
                  <div className="admin-product-price"><strong>{formatNumber(product.price)}</strong><small>تومان</small></div>
                  <button className={`status-pill ${product.active ? "active" : "inactive"}`} onClick={() => void toggleActive(product)}><i /> {product.active ? "فعال" : "پنهان"}</button>
                  <div className="row-actions"><button onClick={() => setEditor(product)} aria-label="ویرایش"><Pencil size={17} /></button><button className="delete" onClick={() => void remove(product)} aria-label="حذف"><Trash2 size={17} /></button></div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
      {editor && <ProductEditor product={editor === "new" ? null : editor} onClose={() => setEditor(null)} onSaved={loadProducts} />}
    </main>
  );
}

function AdminSetup({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  return (
    <main className="admin-setup-page">
      <div className="admin-login-top"><a href={`${import.meta.env.BASE_URL}`}><ArrowLeft size={17} /> بازگشت به فروشگاه</a><ThemeButton theme={theme} onToggle={onToggleTheme} /></div>
      <section><span><ShieldCheck size={32} /></span><h1>اتصال امن مدیریت آماده نیست</h1><p>متغیرهای عمومی Supabase باید هنگام ساخت سایت تنظیم شوند. هیچ رمز مدیریتی در فایل‌های سایت قرار نگرفته است.</p><div><code>VITE_SUPABASE_URL</code><code>VITE_SUPABASE_PUBLISHABLE_KEY</code></div></section>
    </main>
  );
}

export default function AdminApp() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("botzone_theme");
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [stage, setStage] = useState<AdminStage>("checking");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("botzone_theme", theme);
  }, [theme]);

  const verifyAdmin = useCallback(async () => {
    if (!supabase) return;
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      setStage("login");
      return;
    }
    const { data, error } = await supabase.from("admin_users").select("user_id").eq("user_id", sessionData.session.user.id).maybeSingle();
    if (error || !data) {
      await supabase.auth.signOut();
      setStage("login");
      return;
    }
    setStage("dashboard");
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    void verifyAdmin();
  }, [verifyAdmin]);

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setStage("login");
  };

  const toggleTheme = () => setTheme((current) => current === "light" ? "dark" : "light");

  if (!isSupabaseConfigured) return <AdminSetup theme={theme} onToggleTheme={toggleTheme} />;
  if (stage === "checking") return <div className="admin-boot"><LoaderCircle className="spinner" size={30} /><span>در حال بررسی دسترسی امن...</span></div>;
  if (stage === "login") return <AdminLogin theme={theme} onToggleTheme={toggleTheme} onAuthenticated={verifyAdmin} />;
  return <AdminDashboard theme={theme} onToggleTheme={toggleTheme} onLogout={logout} />;
}
