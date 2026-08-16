import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowUpLeft,
  BadgeCheck,
  Bot,
  Box,
  BrainCircuit,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  CreditCard,
  Eye,
  EyeOff,
  Headphones,
  Heart,
  Instagram,
  LayoutGrid,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  LogOut,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  Package,
  Palette,
  Phone,
  Plus,
  Search,
  Send,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Tag,
  Trash2,
  UserPlus,
  UserRound,
  UsersRound,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

type Product = {
  id: number;
  title: string;
  subtitle: string;
  type: "bot" | "item";
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  icon: LucideIcon;
  tone: string;
};

type CartLine = { product: Product; quantity: number };
type AuthMode = "login" | "register";
type AuthUser = { name: string; contact: string };

const products: Product[] = [
  {
    id: 1,
    title: "ربات فروشگاهی پلاس",
    subtitle: "فروش خودکار، درگاه پرداخت و مدیریت سفارش‌ها",
    type: "bot",
    category: "فروش و پرداخت",
    price: 1_490_000,
    oldPrice: 1_790_000,
    rating: 4.9,
    reviews: 128,
    badge: "پرفروش",
    icon: ShoppingBag,
    tone: "violet",
  },
  {
    id: 2,
    title: "دستیار هوشمند آریا",
    subtitle: "پاسخ‌گویی ۲۴ ساعته با هوش مصنوعی فارسی",
    type: "bot",
    category: "هوش مصنوعی",
    price: 2_190_000,
    rating: 4.8,
    reviews: 94,
    badge: "جدید",
    icon: BrainCircuit,
    tone: "blue",
  },
  {
    id: 3,
    title: "مدیر گروه حرفه‌ای",
    subtitle: "ضد اسپم، خوش‌آمدگویی و گزارش‌های دقیق",
    type: "bot",
    category: "مدیریت گروه",
    price: 890_000,
    oldPrice: 1_050_000,
    rating: 4.7,
    reviews: 76,
    icon: UsersRound,
    tone: "orange",
  },
  {
    id: 4,
    title: "قالب نئونی مینی‌اپ",
    subtitle: "قالب راست‌چین فروشگاهی با ۱۲ صفحه آماده",
    type: "item",
    category: "قالب و رابط کاربری",
    price: 640_000,
    rating: 4.9,
    reviews: 58,
    badge: "ویژه",
    icon: Palette,
    tone: "pink",
  },
  {
    id: 5,
    title: "پک استیکر سه‌بعدی",
    subtitle: "بیش از ۱۲۰ استیکر با فایل منبع و کیفیت بالا",
    type: "item",
    category: "محتوای گرافیکی",
    price: 290_000,
    oldPrice: 390_000,
    rating: 4.6,
    reviews: 41,
    icon: Sparkles,
    tone: "green",
  },
  {
    id: 6,
    title: "افزونه پرداخت سریع",
    subtitle: "اتصال امن به درگاه‌ها با نصب یک‌کلیکی",
    type: "item",
    category: "افزونه",
    price: 480_000,
    rating: 4.8,
    reviews: 67,
    icon: CreditCard,
    tone: "cyan",
  },
];

const categories = [
  { title: "ربات‌های فروش", count: 32, icon: Store, tone: "violet" },
  { title: "هوش مصنوعی", count: 18, icon: BrainCircuit, tone: "blue" },
  { title: "مدیریت گروه", count: 24, icon: UsersRound, tone: "orange" },
  { title: "آیتم‌های طراحی", count: 46, icon: Palette, tone: "pink" },
];

const formatNumber = (value: number) => value.toLocaleString("fa-IR");

function Logo() {
  return (
    <a href="#home" className="brand" aria-label="بات‌زون">
      <span className="brand-mark"><Bot size={23} strokeWidth={2.2} /></span>
      <span className="brand-name">بات‌زون</span>
    </a>
  );
}

function Navbar({
  cartCount,
  onCart,
  onLogin,
  onRegister,
  onLogout,
  user,
  search,
  setSearch,
}: {
  cartCount: number;
  onCart: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onLogout: () => void;
  user: AuthUser | null;
  search: string;
  setSearch: (value: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const initial = user?.name.trim().charAt(0) || "ک";

  return (
    <header className={`nav-wrap ${scrolled ? "scrolled" : ""}`}>
      <nav className="topbar" aria-label="ناوبری اصلی">
        <Logo />

        <div className="nav-links">
          <a className="active" href="#home">خانه</a>
          <a href="#market">فروشگاه ربات‌ها</a>
          <a href="#market">فروشگاه آیتم</a>
          <a href="#why-us">چرا بات‌زون؟</a>
          <a href="#footer">پشتیبانی</a>
        </div>

        <div className="nav-actions">
          <button className="circle-button search-toggle" onClick={() => setSearchOpen((value) => !value)} aria-label="جستجو">
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
          <button className="cart-button" onClick={onCart} aria-label="سبد خرید">
            <ShoppingCart size={19} />
            <span className="cart-label">سبد خرید</span>
            {cartCount > 0 && <span className="cart-count">{formatNumber(cartCount)}</span>}
          </button>
          {user ? (
            <div className="user-menu-wrap">
              <button className="user-chip" onClick={() => setAccountOpen((value) => !value)} aria-expanded={accountOpen}>
                <span className="user-avatar">{initial}</span>
                <span className="user-chip-copy"><small>حساب من</small><strong>{user.name}</strong></span>
                <ChevronDown size={15} className={accountOpen ? "rotated" : ""} />
              </button>
              {accountOpen && (
                <div className="account-dropdown">
                  <div><span className="user-avatar large">{initial}</span><p><strong>{user.name}</strong><small>{user.contact}</small></p></div>
                  <a href="#market" onClick={() => setAccountOpen(false)}><Package size={17} /> سفارش‌های من</a>
                  <button onClick={() => { setAccountOpen(false); onLogout(); }}><LogOut size={17} /> خروج از حساب</button>
                </div>
              )}
            </div>
          ) : (
            <div className="desktop-auth">
              <button className="login-button secondary" onClick={onLogin}>ورود</button>
              <button className="register-button" onClick={onRegister}><UserPlus size={17} /> ثبت‌نام</button>
            </div>
          )}
          <button className="circle-button menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="منو">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {searchOpen && (
          <div className="nav-search-panel">
            <Search size={20} />
            <input
              autoFocus
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجو میان ربات‌ها و آیتم‌ها..."
            />
            {search && <button onClick={() => setSearch("")}><X size={18} /></button>}
          </div>
        )}
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {user && <div className="mobile-user"><span className="user-avatar">{initial}</span><div><strong>{user.name}</strong><small>{user.contact}</small></div></div>}
          <a href="#home" onClick={closeMenu}>خانه</a>
          <a href="#market" onClick={closeMenu}>فروشگاه ربات‌ها</a>
          <a href="#market" onClick={closeMenu}>فروشگاه آیتم</a>
          <a href="#why-us" onClick={closeMenu}>چرا بات‌زون؟</a>
          <a href="#footer" onClick={closeMenu}>پشتیبانی</a>
          {user ? (
            <button className="mobile-logout" onClick={() => { closeMenu(); onLogout(); }}><LogOut size={18} /> خروج از حساب</button>
          ) : (
            <div className="mobile-auth-row">
              <button className="mobile-login" onClick={() => { closeMenu(); onLogin(); }}><LogIn size={18} /> ورود</button>
              <button className="mobile-register" onClick={() => { closeMenu(); onRegister(); }}><UserPlus size={18} /> ثبت‌نام رایگان</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function Hero({ onRegister }: { onRegister: () => void }) {
  const heroImage = `${import.meta.env.BASE_URL}bot-hero.png`;
  return (
    <main id="home" className="hero section-shell">
      <div className="hero-panel">
        <img className="hero-image" src={heroImage} alt="ربات هوشمند بات‌زون" />
        <div className="hero-overlay" />
        <div className="hero-grid" />

        <div className="hero-copy">
          <div className="eyebrow light"><span className="pulse-dot" /> بازار شماره یک ابزارهای هوشمند</div>
          <h1>یک ربات،<br /><span>هزار راهِ رشد.</span></h1>
          <p>ربات‌ها و آیتم‌های آماده‌ای که فروش، پشتیبانی و مدیریت کسب‌وکارت را ساده‌تر و سریع‌تر می‌کنند.</p>
          <div className="hero-actions">
            <button onClick={onRegister} className="primary-hero-button"><UserPlus size={18} /> ساخت حساب رایگان</button>
            <a href="#market" className="ghost-hero-button"><span className="play-dot"><ShoppingBag size={15} /></span> مشاهده فروشگاه</a>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>م</span><span>س</span><span>ع</span><span>+</span>
            </div>
            <div><strong>بیش از ۲,۵۰۰ کاربر</strong><small>به بات‌زون اعتماد کرده‌اند</small></div>
          </div>
        </div>

        <div className="floating-card hero-rating">
          <span className="float-icon"><Star size={18} fill="currentColor" /></span>
          <div><strong>۴.۹ از ۵</strong><small>رضایت کاربران</small></div>
        </div>
        <div className="floating-card hero-support">
          <span className="float-icon mint"><Headphones size={18} /></span>
          <div><strong>پشتیبانی واقعی</strong><small>هر روز، کنار شما</small></div>
        </div>
      </div>

      <div className="hero-stats">
        <div><strong>+۱۲۰</strong><span>محصول حرفه‌ای</span></div>
        <i />
        <div><strong>+۲,۵۰۰</strong><span>مشتری راضی</span></div>
        <i />
        <div><strong>٪۹۸</strong><span>رضایت از خرید</span></div>
        <i />
        <div><strong>۲۴/۷</strong><span>پشتیبانی فنی</span></div>
      </div>
    </main>
  );
}

function CategoryStrip() {
  return (
    <section className="categories section-shell reveal" aria-label="دسته‌بندی‌ها">
      <div className="section-kicker"><LayoutGrid size={17} /> دسته‌بندی‌های محبوب</div>
      <div className="category-grid">
        {categories.map(({ title, count, icon: Icon, tone }) => (
          <a href="#market" className="category-card" key={title}>
            <span className={`category-icon ${tone}`}><Icon size={25} /></span>
            <span className="category-info"><strong>{title}</strong><small>{formatNumber(count)} محصول</small></span>
            <span className="category-arrow"><ArrowUpLeft size={18} /></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  favorite,
  onFavorite,
  onAdd,
}: {
  product: Product;
  favorite: boolean;
  onFavorite: () => void;
  onAdd: () => void;
}) {
  const ProductIcon = product.icon;
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <article className="product-card">
      <div className={`product-visual ${product.tone}`}>
        <div className="visual-orbit orbit-one" />
        <div className="visual-orbit orbit-two" />
        <span className="product-big-icon"><ProductIcon size={52} strokeWidth={1.45} /></span>
        <span className="mini-cube cube-one"><Sparkles size={15} /></span>
        <span className="mini-cube cube-two"><Zap size={14} /></span>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button onClick={onFavorite} className={`favorite-button ${favorite ? "selected" : ""}`} aria-label="افزودن به علاقه‌مندی">
          <Heart size={19} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-body">
        <div className="product-meta">
          <span><Tag size={13} /> {product.category}</span>
          <span className="rating"><Star size={13} fill="currentColor" /> {product.rating.toLocaleString("fa-IR")} <i>({formatNumber(product.reviews)})</i></span>
        </div>
        <h3>{product.title}</h3>
        <p>{product.subtitle}</p>
        <div className="product-bottom">
          <div className="price-wrap">
            {product.oldPrice && <span className="old-price">{formatNumber(product.oldPrice)}</span>}
            <span className="current-price">{formatNumber(product.price)} <small>تومان</small></span>
          </div>
          <button className="add-button" onClick={onAdd} aria-label={`افزودن ${product.title} به سبد`}>
            <ShoppingBag size={19} />
          </button>
        </div>
        {discount > 0 && <span className="discount">٪{formatNumber(discount)} تخفیف</span>}
      </div>
    </article>
  );
}

function Marketplace({ onAdd, search, setSearch }: { onAdd: (product: Product) => void; search: string; setSearch: (value: string) => void }) {
  const [filter, setFilter] = useState<"all" | "bot" | "item">("all");
  const [favorites, setFavorites] = useState<Set<number>>(() => new Set());

  const filteredProducts = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return products.filter((product) => {
      const inTab = filter === "all" || product.type === filter;
      const inSearch = !normalized || `${product.title} ${product.subtitle} ${product.category}`.toLowerCase().includes(normalized);
      return inTab && inSearch;
    });
  }, [filter, search]);

  const toggleFavorite = (id: number) => {
    setFavorites((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section className="market section-shell reveal" id="market">
      <div className="section-heading">
        <div>
          <div className="eyebrow"><Sparkles size={16} /> انتخاب‌های حرفه‌ای</div>
          <h2>محبوب‌ترین‌های <span>این هفته</span></h2>
          <p>محصولات تست‌شده و آماده نصب برای یک شروع سریع و مطمئن.</p>
        </div>
        <a href="#market" className="view-all">مشاهده همه محصولات <ArrowLeft size={18} /></a>
      </div>

      <div className="market-toolbar">
        <div className="filter-tabs">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}><LayoutGrid size={17} /> همه محصولات</button>
          <button className={filter === "bot" ? "active" : ""} onClick={() => setFilter("bot")}><Bot size={17} /> ربات‌ها</button>
          <button className={filter === "item" ? "active" : ""} onClick={() => setFilter("item")}><Box size={17} /> آیتم‌ها</button>
        </div>
        <label className="market-search">
          <Search size={18} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جستجوی محصول..." />
          {search && <button onClick={() => setSearch("")}><X size={16} /></button>}
        </label>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              favorite={favorites.has(product.id)}
              onFavorite={() => toggleFavorite(product.id)}
              onAdd={() => onAdd(product)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-products">
          <span><Search size={30} /></span>
          <h3>محصولی پیدا نشد</h3>
          <p>عبارت دیگری را امتحان کنید یا فیلتر را تغییر دهید.</p>
          <button onClick={() => { setSearch(""); setFilter("all"); }}>پاک کردن فیلترها</button>
        </div>
      )}
    </section>
  );
}

function WhyUs() {
  const benefits = [
    { icon: ShieldCheck, title: "خرید امن و مطمئن", text: "پرداخت امن و تضمین بازگشت وجه تا ۷ روز" },
    { icon: WandSparkles, title: "نصب رایگان", text: "راه‌اندازی اولیه توسط تیم فنی بات‌زون" },
    { icon: Clock3, title: "تحویل فوری", text: "دسترسی به فایل‌ها بلافاصله پس از خرید" },
    { icon: Headphones, title: "پشتیبانی همیشگی", text: "پاسخ‌گویی سریع قبل و بعد از خرید" },
  ];

  return (
    <section className="why section-shell reveal" id="why-us">
      <div className="why-card">
        <div className="why-intro">
          <div className="eyebrow light"><BadgeCheck size={16} /> خرید بدون دغدغه</div>
          <h2>چرا حرفه‌ای‌ها<br />بات‌زون را انتخاب می‌کنند؟</h2>
          <p>از انتخاب محصول تا راه‌اندازی و رشد، تیم ما در تمام مسیر کنار شماست.</p>
          <a href="#footer">مشاوره رایگان <ArrowLeft size={18} /></a>
        </div>
        <div className="benefits-grid">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div className="benefit" key={title}>
              <span><Icon size={24} /></span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
  };

  return (
    <section className="newsletter section-shell reveal">
      <div className="newsletter-card">
        <div className="newsletter-glow" />
        <div className="newsletter-copy">
          <span><Send size={22} /></span>
          <div><h2>از تازه‌های بات‌زون جا نمانید</h2><p>تخفیف‌ها و محصولات جدید، مستقیم در ایمیل شما.</p></div>
        </div>
        {sent ? (
          <div className="success-message"><Check size={20} /> ایمیل شما با موفقیت ثبت شد.</div>
        ) : (
          <form onSubmit={submit}>
            <Mail size={19} />
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ایمیل شما" aria-label="ایمیل شما" required />
            <button>عضویت</button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer" className="reveal">
      <div className="footer-main section-shell">
        <div className="footer-brand">
          <Logo />
          <p>بازار تخصصی ربات‌ها و ابزارهای دیجیتال؛ برای ساختن کسب‌وکاری هوشمندتر.</p>
          <div className="socials">
            <a href="#footer" aria-label="اینستاگرام"><Instagram size={19} /></a>
            <a href="#footer" aria-label="تلگرام"><Send size={18} /></a>
            <a href="#footer" aria-label="گفتگو"><MessageCircle size={19} /></a>
          </div>
        </div>
        <div className="footer-links"><h3>فروشگاه</h3><a href="#market">ربات‌ها</a><a href="#market">آیتم‌ها</a><a href="#market">جدیدترین‌ها</a><a href="#market">پرفروش‌ها</a></div>
        <div className="footer-links"><h3>بات‌زون</h3><a href="#why-us">درباره ما</a><a href="#footer">همکاری با ما</a><a href="#footer">وبلاگ</a><a href="#footer">قوانین استفاده</a></div>
        <div className="footer-contact"><h3>نیاز به راهنمایی دارید؟</h3><a href="tel:02191000000"><span><Headphones size={20} /></span><div><small>هر روز از ۹ تا ۲۱</small><strong>۰۲۱ - ۹۱۰۰ ۰۰۰۰</strong></div></a></div>
      </div>
      <div className="footer-bottom section-shell"><span>© ۱۴۰۵ بات‌زون؛ همه حقوق محفوظ است.</span><span>ساخته شده با <Heart size={14} fill="currentColor" /> برای کسب‌وکارهای ایرانی</span></div>
    </footer>
  );
}

function CartDrawer({ lines, open, onClose, onChange, onRemove }: { lines: CartLine[]; open: boolean; onClose: () => void; onChange: (id: number, change: number) => void; onRemove: (id: number) => void }) {
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

  return (
    <>
      <div className={`overlay ${open ? "visible" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="drawer-head"><div><ShoppingCart size={21} /><h2>سبد خرید</h2><span>{formatNumber(lines.reduce((sum, item) => sum + item.quantity, 0))} محصول</span></div><button onClick={onClose}><X size={21} /></button></div>
        <div className="drawer-content">
          {lines.length === 0 ? (
            <div className="empty-cart"><span><ShoppingBag size={34} /></span><h3>سبد خرید شما خالی است</h3><p>یک محصول کاربردی برای شروع انتخاب کنید.</p><button onClick={onClose}>رفتن به فروشگاه</button></div>
          ) : lines.map(({ product, quantity }) => {
            const Icon = product.icon;
            return (
              <div className="cart-line" key={product.id}>
                <span className={`cart-thumb ${product.tone}`}><Icon size={25} /></span>
                <div className="cart-info"><h3>{product.title}</h3><span>{formatNumber(product.price)} تومان</span><div className="quantity"><button onClick={() => onChange(product.id, 1)}><Plus size={14} /></button><strong>{formatNumber(quantity)}</strong><button onClick={() => onChange(product.id, -1)}><Minus size={14} /></button></div></div>
                <button className="remove-line" onClick={() => onRemove(product.id)}><Trash2 size={18} /></button>
              </div>
            );
          })}
        </div>
        {lines.length > 0 && (
          <div className="drawer-footer">
            <div><span>مبلغ نهایی</span><strong>{formatNumber(subtotal)} <small>تومان</small></strong></div>
            <button>ادامه فرایند خرید <ArrowLeft size={18} /></button>
            <p><ShieldCheck size={15} /> پرداخت امن و تضمین بازگشت وجه</p>
          </div>
        )}
      </aside>
    </>
  );
}

function AuthModal({
  mode,
  onClose,
  onModeChange,
  onAuthenticated,
}: {
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onAuthenticated: (user: AuthUser, mode: AuthMode) => void;
}) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setError(""), [mode]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (mode === "register" && name.trim().length < 2) {
      setError("لطفاً نام و نام خانوادگی خود را وارد کنید.");
      return;
    }
    if (contact.trim().length < 5) {
      setError("شماره موبایل یا ایمیل معتبر وارد کنید.");
      return;
    }
    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 650));
    onAuthenticated({ name: mode === "register" ? name.trim() : "کاربر بات‌زون", contact: contact.trim() }, mode);
    setLoading(false);
  };

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label={mode === "login" ? "ورود به حساب" : "ساخت حساب"}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="login-modal auth-modal">
        <button className="modal-close" onClick={onClose} aria-label="بستن"><X size={20} /></button>
        <div className="auth-header">
          <span className="modal-logo"><Bot size={28} /></span>
          <div><h2>{mode === "login" ? "خوش برگشتی!" : "به بات‌زون بپیوند"}</h2><p>{mode === "login" ? "وارد حساب خود شوید و ادامه دهید." : "در کمتر از یک دقیقه حساب رایگان بسازید."}</p></div>
        </div>

        <div className="auth-tabs" role="tablist">
          <button className={mode === "login" ? "active" : ""} onClick={() => onModeChange("login")}><LogIn size={17} /> ورود</button>
          <button className={mode === "register" ? "active" : ""} onClick={() => onModeChange("register")}><UserPlus size={17} /> ثبت‌نام</button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <div className={`auth-fields ${mode}`} key={mode}>
            {mode === "register" && (
              <label className="field">
                <span>نام و نام خانوادگی</span>
                <div className="input-shell"><UserRound size={18} /><input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="مثلاً علی رضایی" autoComplete="name" /></div>
              </label>
            )}
            <label className="field">
              <span>شماره موبایل یا ایمیل</span>
              <div className="input-shell"><Phone size={18} /><input autoFocus={mode === "login"} value={contact} onChange={(event) => setContact(event.target.value)} placeholder="۰۹۱۲۱۲۳۴۵۶۷" autoComplete="username" /></div>
            </label>
            <label className="field">
              <span>رمز عبور</span>
              <div className="input-shell"><LockKeyhole size={18} /><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="حداقل ۶ کاراکتر" autoComplete={mode === "login" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="نمایش رمز">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </label>
          </div>

          <div className="form-options">
            <label className="remember"><input type="checkbox" defaultChecked /><span><Check size={12} /></span>{mode === "login" ? "مرا به خاطر بسپار" : "قوانین بات‌زون را می‌پذیرم"}</label>
            {mode === "login" && <button type="button" className="forgot-link">رمز را فراموش کرده‌اید؟</button>}
          </div>
          {error && <div className="form-error">{error}</div>}
          <button className="submit-auth" disabled={loading}>
            {loading ? <><LoaderCircle className="spinner" size={19} /> کمی صبر کنید...</> : <>{mode === "login" ? "ورود به حساب" : "ساخت حساب رایگان"}<ArrowLeft size={18} /></>}
          </button>
        </form>

        <div className="auth-trust"><ShieldCheck size={16} /><span>اطلاعات شما با رمزگذاری امن نگهداری می‌شود</span></div>
        <p className="auth-switch">{mode === "login" ? "هنوز حساب ندارید؟" : "قبلاً ثبت‌نام کرده‌اید؟"}<button onClick={() => onModeChange(mode === "login" ? "register" : "login")}>{mode === "login" ? "ثبت‌نام رایگان" : "وارد شوید"}</button></p>
      </div>
    </div>
  );
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />;
}

function App() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("botzone_session");
      return saved ? JSON.parse(saved) as AuthUser : null;
    } catch {
      return null;
    }
  });
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.body.style.overflow = cartOpen || authMode ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen, authMode]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -45px" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const addToCart = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) return current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { product, quantity: 1 }];
    });
    showToast(`${product.title} به سبد خرید اضافه شد`);
  };

  const changeQuantity = (id: number, change: number) => {
    setCart((current) => current
      .map((line) => line.product.id === id ? { ...line, quantity: line.quantity + change } : line)
      .filter((line) => line.quantity > 0));
  };

  const authenticate = (candidate: AuthUser, mode: AuthMode) => {
    let authenticated = candidate;
    if (mode === "register") {
      localStorage.setItem("botzone_profile", JSON.stringify(candidate));
    } else {
      try {
        const profile = localStorage.getItem("botzone_profile");
        const parsed = profile ? JSON.parse(profile) as AuthUser : null;
        if (parsed?.contact === candidate.contact) authenticated = parsed;
      } catch {
        // Continue with a generic account when no local profile exists.
      }
    }
    localStorage.setItem("botzone_session", JSON.stringify(authenticated));
    setUser(authenticated);
    setAuthMode(null);
    showToast(mode === "register" ? "حساب شما با موفقیت ساخته شد" : "با موفقیت وارد حساب شدید");
  };

  const logout = () => {
    localStorage.removeItem("botzone_session");
    setUser(null);
    showToast("از حساب خود خارج شدید");
  };

  return (
    <div className="app">
      <ScrollProgress />
      <Navbar
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
        onLogout={logout}
        user={user}
        search={search}
        setSearch={setSearch}
      />
      <Hero onRegister={() => setAuthMode("register")} />
      <CategoryStrip />
      <Marketplace onAdd={addToCart} search={search} setSearch={setSearch} />
      <WhyUs />
      <Newsletter />
      <Footer />
      <CartDrawer lines={cart} open={cartOpen} onClose={() => setCartOpen(false)} onChange={changeQuantity} onRemove={(id) => setCart((current) => current.filter((line) => line.product.id !== id))} />
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} onAuthenticated={authenticate} />}
      <div className={`toast ${toast ? "show" : ""}`}><Check size={17} /> {toast}</div>
      <button className="support-fab" aria-label="پشتیبانی آنلاین"><CircleHelp size={23} /><span>پشتیبانی آنلاین</span><i /></button>
    </div>
  );
}

export default App;
