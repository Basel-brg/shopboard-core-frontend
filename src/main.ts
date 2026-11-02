import './style.css'
import { PRODUCTS, CATEGORIES } from './products'
import { ICONS } from './icons'
import { cart } from './cart'
import { auth } from './auth'
import type { CartState, User, SortOption, Product } from './types'
import {
  validateField,
  validateForm,
  attachLiveValidation,
  clearValidationErrors
} from './validation'

// Application State
interface AppState {
  selectedCategory: string;
  searchQuery: string;
  sortBy: SortOption;
  maxPrice: number;
  isCartOpen: boolean;
}

const state: AppState = {
  selectedCategory: 'الكل',
  searchQuery: '',
  sortBy: 'default',
  maxPrice: 6000,
  isCartOpen: false
}

// Helper to compute discount percentage
function getDiscountPercent(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

// Inline SVG icons for Comp-1 rail and badges
const COMP_SVGS = {
  home: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6h-5v6H4a1 1 0 0 1-1-1v-9.5z"/></svg>`,
  store: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l1.8-5h14.4L21 9"/><path d="M3 9c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3c0 1.7 1.3 3 3 3s3-1.3 3-3"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8"/></svg>`,
  cube: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  cart: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2.5 4h2.8l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.8a1.5 1.5 0 0 0 1.5-1.1L21 7H6.2"/></svg>`,
  badgeCheck: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.2l2.3 2.3 4.8-4.8"/></svg>`,
  badgeSliders: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="7" x2="20" y2="7"/><circle cx="9" cy="7" r="2" fill="#f2eada"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="15" cy="12" r="2" fill="#f2eada"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="11" cy="17" r="2" fill="#f2eada"/></svg>`,
  badgeAward: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="5.5"/><path d="M9.2 13.8L8 21l4-2.2L16 21l-1.2-7.2"/></svg>`
}

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <!-- First Viewport: Comp-1 Atelier Rail & Stage (1376x768) -->
  <section id="hero-stage" class="comp-frame" aria-labelledby="hero-title">
    <!-- Right Bamboo Sidebar Rail Surface -->
    <aside class="sidebar-rail-bg" aria-label="شريط الأتيليه الجانبي"></aside>
    <div class="hero-stage-divider" aria-hidden="true"></div>

    <!-- 4 Bordered Catalog Card Frames in First Viewport -->
    <div class="comp-card-frame comp-card-frame-1" aria-hidden="true"></div>
    <div class="comp-card-frame comp-card-frame-2" aria-hidden="true"></div>
    <div class="comp-card-frame comp-card-frame-3" aria-hidden="true"></div>
    <div class="comp-card-frame comp-card-frame-4" aria-hidden="true"></div>

    <!-- 1. hero-desk-photo (Plate) -->
    <figure class="r-hero-desk-photo region plate" data-region="hero-desk-photo">
      <img
        src="/assets/plates/hero-desk-photo.png"
        alt="ركن عمل احترافي من خشب البلوط مع لوحة مفاتيح ميكانيكية وسماعة استوديو وفانوس أكاري"
      />
    </figure>

    <!-- 2. hero-headline -->
    <header class="r-hero-headline region text" data-region="hero-headline">
      <h1 id="hero-title">ارتقِ بمساحة عملك</h1>
      <p class="hero-subline">معدات مكتب احترافية تجمع بين الدقة والأناقة</p>
    </header>

    <!-- 3. hero-subhead (measured scaffold slot) -->
    <div class="r-hero-subhead region text" data-region="hero-subhead" aria-hidden="true">
      <span>معدات مكتب احترافية</span>
    </div>

    <!-- 4. hero-cta-primary -->
    <div class="r-hero-cta-primary region control" data-region="hero-cta-primary">
      <a href="#products-section" class="cta-pill-primary">
        <span aria-hidden="true">←</span>
        <span>استكشف المجموعة</span>
      </a>
    </div>

    <!-- 5. hero-cta-secondary -->
    <div class="r-hero-cta-secondary region control" data-region="hero-cta-secondary">
      <button type="button" id="hero-filter-electronics" class="cta-pill-secondary">
        تكوين المكتب
      </button>
    </div>

    <!-- 6. hero-badges -->
    <div class="r-hero-badges region text" data-region="hero-badges">
      <div class="hero-badges-strip">
        <div class="hero-badge-col">
          <span class="hero-badge-icon">${COMP_SVGS.badgeCheck}</span>
          <span class="hero-badge-text">تصميم هندسي<br />لمساحة العمل</span>
        </div>
        <div class="hero-badge-col">
          <span class="hero-badge-icon">${COMP_SVGS.badgeSliders}</span>
          <span class="hero-badge-text">معايرة صوتية<br />وميكانيكية</span>
        </div>
        <div class="hero-badge-col">
          <span class="hero-badge-icon">${COMP_SVGS.badgeAward}</span>
          <span class="hero-badge-text">ضمان شامل<br />لمدة سنتين</span>
        </div>
      </div>
    </div>

    <!-- 7. sidebar-brand -->
    <div class="r-sidebar-brand region text" data-region="sidebar-brand">
      <div class="brand-titles">
        <span class="brand-en">ShopBoard</span>
        <span class="brand-ar">شوب بورد</span>
      </div>
      <span class="vermilion-seal" aria-hidden="true">شوب<br />بورد</span>
    </div>

    <!-- 8. sidebar-nav -->
    <nav class="r-sidebar-nav region control" data-region="sidebar-nav" aria-label="التنقل الرئيسي">
      <ul class="rail-nav-list">
        <li>
          <a href="#hero-stage" class="rail-nav-btn">
            <span>الرئيسية</span>
            <span class="rail-nav-icon">${COMP_SVGS.home}</span>
          </a>
        </li>
        <li>
          <a href="#products-section" class="rail-nav-btn">
            <span>المتجر</span>
            <span class="rail-nav-icon">${COMP_SVGS.store}</span>
          </a>
        </li>
        <li>
          <button
            type="button"
            id="btn-open-desk-builder"
            class="rail-nav-btn"
            aria-label="تكوين مساحة العمل 3D"
            aria-haspopup="dialog"
          >
            <span>تكوين مكتب</span>
            <span class="rail-nav-icon">${COMP_SVGS.cube}</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            id="auth-toggle-btn"
            class="rail-nav-btn"
            aria-label="الإعدادات وتسجيل الدخول"
            aria-haspopup="dialog"
          >
            <span id="auth-btn-label">الإعدادات</span>
            <span class="rail-nav-icon">${COMP_SVGS.gear}</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            id="cart-toggle-btn"
            class="rail-nav-btn"
            aria-label="سلة المشتريات"
            aria-expanded="false"
            aria-controls="cart-drawer"
          >
            <span>السلة</span>
            <span id="cart-badge" class="rail-cart-badge" aria-live="polite">0</span>
            <span id="header-cart-total" class="sr-only">0 ر.س</span>
            <span class="rail-nav-icon">${COMP_SVGS.cart}</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- 9. enso-mark (Plate) -->
    <figure class="r-enso-mark region plate" data-region="enso-mark">
      <img src="/assets/plates/enso-mark.png" alt="شعار حلقة إنسو الحبرية" />
    </figure>

    <!-- 12 & 13. card-1-photo & card-1-meta -->
    <figure class="r-card-1-photo region plate" data-region="card-1-photo">
      <img src="/assets/products/keyboard.jpg" alt="${PRODUCTS[0].name}" />
    </figure>
    <div class="r-card-1-meta region control" data-region="card-1-meta">
      <div>
        <p class="comp-card-title">${PRODUCTS[0].name}</p>
        <p class="comp-card-sub">${PRODUCTS[0].subtitle}</p>
      </div>
      <div class="comp-card-foot">
        <span class="comp-card-price" aria-label="${PRODUCTS[0].price} ريال سعودي">${PRODUCTS[0].price} ر.س</span>
        <button type="button" class="comp-card-btn" data-hero-add="1">أضف للسلة</button>
      </div>
    </div>

    <!-- 14 & 15. card-2-photo & card-2-meta -->
    <figure class="r-card-2-photo region plate" data-region="card-2-photo">
      <img src="/assets/products/headphones.jpg" alt="${PRODUCTS[1].name}" />
    </figure>
    <div class="r-card-2-meta region control" data-region="card-2-meta">
      <div>
        <p class="comp-card-title">${PRODUCTS[1].name}</p>
        <p class="comp-card-sub">${PRODUCTS[1].subtitle}</p>
      </div>
      <div class="comp-card-foot">
        <span class="comp-card-price" aria-label="${PRODUCTS[1].price} ريال سعودي">${PRODUCTS[1].price} ر.س</span>
        <button type="button" class="comp-card-btn" data-hero-add="2">أضف للسلة</button>
      </div>
    </div>

    <!-- 16 & 17. card-3-photo & card-3-meta -->
    <figure class="r-card-3-photo region plate" data-region="card-3-photo">
      <img src="/assets/products/lamp.jpg" alt="${PRODUCTS[2].name}" />
    </figure>
    <div class="r-card-3-meta region control" data-region="card-3-meta">
      <div>
        <p class="comp-card-title">${PRODUCTS[2].name}</p>
        <p class="comp-card-sub">${PRODUCTS[2].subtitle}</p>
      </div>
      <div class="comp-card-foot">
        <span class="comp-card-price" aria-label="${PRODUCTS[2].price} ريال سعودي">${PRODUCTS[2].price} ر.س</span>
        <button type="button" class="comp-card-btn" data-hero-add="3">أضف للسلة</button>
      </div>
    </div>

    <!-- 18 & 19. card-4-photo & card-4-meta -->
    <figure class="r-card-4-photo region plate" data-region="card-4-photo">
      <img src="/assets/products/mouse.jpg" alt="${PRODUCTS[3].name}" />
    </figure>
    <div class="r-card-4-meta region control" data-region="card-4-meta">
      <div>
        <p class="comp-card-title">${PRODUCTS[3].name}</p>
        <p class="comp-card-sub">${PRODUCTS[3].subtitle}</p>
      </div>
      <div class="comp-card-foot">
        <span class="comp-card-price" aria-label="${PRODUCTS[3].price} ريال سعودي">${PRODUCTS[3].price} ر.س</span>
        <button type="button" class="comp-card-btn" data-hero-add="4">أضف للسلة</button>
      </div>
    </div>
  </section>

  <!-- Full Interactive Workshop Catalog Section -->
  <main id="products-section" class="container store-main">
    <section class="controls-panel" aria-label="خيارات البحث والتصفية والفرز">
      <div class="controls-top-row">
        <form class="search-form" id="search-form" role="search" novalidate>
          <div class="form-field search-field-wrap">
            <label for="search-input" class="sr-only">البحث عن معدات المكتب</label>
            <div class="search-box">
              <span class="search-icon">${ICONS.search}</span>
              <input
                type="search"
                id="search-input"
                name="q"
                placeholder="ابحث عن لوحة مفاتيح، سماعة استوديو، مصباح نحاسي..."
                autocomplete="off"
              />
              <button type="submit" class="search-submit" aria-label="تنفيذ البحث">
                بحث
              </button>
            </div>
          </div>
        </form>

        <nav class="categories-nav" aria-label="تصنيفات معدات المكتب" id="categories-nav"></nav>
      </div>

      <form class="filters-row" id="filters-form" novalidate>
        <div class="form-field price-filter-field">
          <label for="price-range-input" class="filter-label">
            الحد الأقصى للسعر: <strong id="price-range-output">6000 ر.س</strong>
          </label>
          <input
            type="range"
            id="price-range-input"
            name="maxPrice"
            min="50"
            max="6000"
            step="50"
            value="6000"
          />
        </div>

        <div class="form-field sort-filter-field">
          <label for="sort-select" class="filter-label">ترتيب حسب:</label>
          <select id="sort-select" name="sort">
            <option value="default">الافتراضي (ترتيب الكتالوج)</option>
            <option value="price-asc">السعر: الأقل أولاً</option>
            <option value="price-desc">السعر: الأعلى أولاً</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>
      </form>
    </section>

    <section class="catalog-section" aria-labelledby="catalog-title">
      <header class="catalog-header">
        <div>
          <h2 id="catalog-title">كتالوج معدات المكتب الاحترافية</h2>
          <p class="catalog-subtitle">قطع هندسية مختارة بعناية لبيئة عمل هادئة ومنظمة</p>
        </div>
        <p id="products-count" class="products-count" aria-live="polite"></p>
      </header>

      <div id="products-grid" class="products-grid" role="region" aria-live="polite"></div>
    </section>
  </main>

  <!-- Cart Drawer Overlay & Panel -->
  <div id="cart-backdrop" class="cart-backdrop" aria-hidden="true"></div>
  <aside
    id="cart-drawer"
    class="cart-drawer"
    aria-labelledby="cart-drawer-title"
    aria-hidden="true"
  >
    <header class="drawer-header">
      <div class="drawer-title-wrap">
        <h2 id="cart-drawer-title">حقيبة التسوق</h2>
        <span id="drawer-items-count" class="drawer-items-count">0 عناصر</span>
        <button
          type="button"
          id="cart-clear-btn"
          class="cart-clear-btn"
          aria-label="تفريغ سلة المشتريات بالكامل"
        >
          تفريغ السلة
        </button>
      </div>
      <button
        type="button"
        id="cart-close-btn"
        class="icon-close-btn"
        aria-label="إغلاق سلة المشتريات"
      >
        ${ICONS.close}
      </button>
    </header>

    <div class="drawer-body">
      <section class="shipping-banner" id="shipping-banner" aria-label="حالة الشحن المجاني">
        <p id="shipping-banner-text" class="shipping-banner-text"></p>
        <div
          class="shipping-progress-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          id="shipping-progressbar"
          aria-valuenow="0"
        >
          <div id="shipping-progress-fill" class="shipping-progress-fill"></div>
        </div>
      </section>

      <div id="cart-empty-view" class="cart-empty-view">
        <div class="empty-bag-illustration">${ICONS.bag}</div>
        <p class="empty-title">حقيبة التسوق فارغة</p>
        <p class="empty-desc">اختر معدات مكتبك المفضلة وأضفها للسلة للاستفادة من الشحن المجاني.</p>
      </div>

      <ul id="cart-items-list" class="cart-items-list" aria-label="عناصر السلة"></ul>

      <!-- Promo Coupon Form -->
      <form id="coupon-form" class="coupon-form" novalidate>
        <div class="form-field">
          <label for="coupon-code" class="field-label">كود الخصم (جرّب SHOP20 أو WELCOME10):</label>
          <div class="coupon-row">
            <input
              type="text"
              id="coupon-code"
              name="coupon"
              placeholder="أدخل الكود هنا..."
              dir="ltr"
              autocomplete="off"
            />
            <button type="submit" class="btn btn-secondary">تطبيق</button>
          </div>
        </div>
        <div id="applied-coupon-tag" class="applied-coupon-tag" hidden>
          <span id="applied-coupon-text"></span>
          <button type="button" id="remove-coupon-btn" class="remove-coupon-btn" aria-label="إلغاء كود الخصم">إزالة</button>
        </div>
      </form>

      <!-- Checkout Form -->
      <form id="checkout-form" class="checkout-form" novalidate>
        <h3 class="checkout-title">بيانات التوصيل والدفع</h3>

        <div class="form-field">
          <label for="customer-name" class="field-label">الاسم الثلاثي:</label>
          <input
            type="text"
            id="customer-name"
            name="name"
            required
            placeholder="مثال: خالد العتيبي"
          />
        </div>

        <div class="form-field">
          <label for="customer-phone" class="field-label">رقم الجوال للتواصل:</label>
          <input
            type="tel"
            id="customer-phone"
            name="phone"
            required
            placeholder="05XXXXXXXX"
            dir="ltr"
          />
        </div>

        <div class="form-field">
          <label for="customer-city" class="field-label">المدينة والعنوان التفصيلي:</label>
          <input
            type="text"
            id="customer-city"
            name="city"
            required
            placeholder="الرياض، حي العليا، شارع التحلية"
          />
        </div>

        <div class="form-field">
          <label for="payment-method" class="field-label">وسيلة الدفع المفضلة:</label>
          <select id="payment-method" name="payment">
            <option value="cod">الدفع عند الاستلام</option>
            <option value="card">بطاقة مدى / بطاقة ائتمانية</option>
            <option value="applepay">Apple Pay</option>
          </select>
        </div>

        <dl class="order-summary">
          <div class="summary-line">
            <dt>المجموع الفرعي</dt>
            <dd id="summary-subtotal">0 ر.س</dd>
          </div>
          <div class="summary-line summary-discount" id="summary-discount-row" hidden>
            <dt>قيمة الخصم</dt>
            <dd id="summary-discount">-0 ر.س</dd>
          </div>
          <div class="summary-line">
            <dt>رسوم التوصيل</dt>
            <dd id="summary-shipping">مجاني</dd>
          </div>
          <div class="summary-line summary-total">
            <dt>الإجمالي المستحق</dt>
            <dd><strong id="summary-total">0 ر.س</strong></dd>
          </div>
        </dl>

        <button type="submit" id="checkout-submit-btn" class="btn btn-primary btn-block btn-lg">
          تأكيد وإتمام الطلب
        </button>
      </form>
    </div>
  </aside>

  <!-- Product Quick View Dialog -->
  <dialog id="product-dialog" class="modal-dialog product-dialog" aria-labelledby="quick-view-title">
    <div class="modal-card product-modal-card" id="product-modal-body"></div>
  </dialog>

  <!-- Login & Register Dialog -->
  <dialog id="auth-dialog" class="modal-dialog auth-dialog" aria-labelledby="auth-modal-title">
    <div class="modal-card auth-dialog-content">
      <header class="dialog-header">
        <h2 id="auth-modal-title">تسجيل الدخول إلى ShopBoard</h2>
        <button
          type="button"
          id="auth-close-btn"
          class="icon-close-btn"
          aria-label="إغلاق نافذة الحساب"
        >
          ${ICONS.close}
        </button>
      </header>

      <div id="auth-anonymous-section">
        <div class="auth-tabs" role="tablist" aria-label="خيارات الحساب">
          <button
            type="button"
            id="tab-login"
            class="auth-tab is-active"
            role="tab"
            aria-selected="true"
            aria-controls="login-form"
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            id="tab-register"
            class="auth-tab"
            role="tab"
            aria-selected="false"
            aria-controls="register-form"
          >
            إنشاء حساب جديد
          </button>
        </div>

        <!-- Login Form -->
        <form id="login-form" class="auth-form" role="tabpanel" aria-labelledby="tab-login" novalidate>
          <div class="form-field">
            <label for="login-email" class="field-label">البريد الإلكتروني:</label>
            <input
              type="email"
              id="login-email"
              name="email"
              required
              placeholder="name@example.com"
              autocomplete="email"
              dir="ltr"
            />
          </div>

          <div class="form-field">
            <label for="login-password" class="field-label">كلمة المرور:</label>
            <input
              type="password"
              id="login-password"
              name="password"
              required
              placeholder="••••••••"
              autocomplete="current-password"
              dir="ltr"
            />
          </div>

          <div class="form-checkbox">
            <input type="checkbox" id="login-remember" name="remember" checked />
            <label for="login-remember" class="checkbox-label">تذكر تسجيل دخولي على هذا الجهاز</label>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg auth-submit-btn">
            دخول إلى الحساب
          </button>
        </form>

        <!-- Register Form -->
        <form id="register-form" class="auth-form" role="tabpanel" aria-labelledby="tab-register" novalidate hidden>
          <div class="form-field">
            <label for="register-name" class="field-label">الاسم الكامل:</label>
            <input
              type="text"
              id="register-name"
              name="name"
              required
              placeholder="مثال: عبدالله محمد"
              autocomplete="name"
            />
          </div>

          <div class="form-field">
            <label for="register-email" class="field-label">البريد الإلكتروني:</label>
            <input
              type="email"
              id="register-email"
              name="email"
              required
              placeholder="name@example.com"
              autocomplete="email"
              dir="ltr"
            />
          </div>

          <div class="form-field">
            <label for="register-phone" class="field-label">رقم الجوال:</label>
            <input
              type="tel"
              id="register-phone"
              name="phone"
              required
              placeholder="05XXXXXXXX"
              autocomplete="tel"
              dir="ltr"
            />
          </div>

          <div class="form-field">
            <label for="register-password" class="field-label">كلمة المرور الجديدة:</label>
            <input
              type="password"
              id="register-password"
              name="password"
              required
              minlength="6"
              placeholder="6 خانات على الأقل"
              autocomplete="new-password"
              dir="ltr"
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg auth-submit-btn">
            إنشاء الحساب الآن
          </button>
        </form>
      </div>

      <!-- Logged-in User Profile Section -->
      <div id="auth-authenticated-section" class="auth-authenticated-section" hidden>
        <h3 id="auth-user-name" class="auth-profile-name"></h3>
        <p id="auth-user-email" class="auth-profile-email"></p>
        <div class="auth-profile-actions">
          <button type="button" id="auth-logout-btn" class="btn btn-outline btn-block">
            تسجيل الخروج من الحساب
          </button>
        </div>
      </div>
    </div>
  </dialog>

  <!-- Order Confirmation Modal -->
  <dialog id="order-dialog" class="modal-dialog order-dialog" aria-labelledby="order-confirm-title">
    <div class="modal-card order-dialog-card">
      <h2 id="order-confirm-title">تم استلام طلبك بنجاح</h2>
      <p id="dialog-order-msg" class="dialog-message"></p>
      <div class="dialog-details" id="dialog-details"></div>
      <button type="button" id="dialog-close-btn" class="btn btn-primary btn-block btn-lg">
        متابعة التسوق
      </button>
    </div>
  </dialog>

  <!-- 3D Desk Builder Studio Dialog -->
  <dialog id="desk-builder-modal" class="desk-builder-dialog" aria-labelledby="desk-builder-title">
    <div class="desk-builder-container" oncontextmenu="return false;">
      <!-- Top Bar -->
      <header class="studio-topbar">
        <div class="studio-branding">
          <span class="studio-badge">3D WebGL</span>
          <h2 id="desk-builder-title">استوديو تكوين مساحة العمل 3D</h2>
        </div>
        <div class="studio-top-actions">
          <button type="button" id="studio-clear-btn" class="studio-btn studio-btn-secondary" aria-label="تفريغ المكتب">
            تفريغ السطح
          </button>
          <button type="button" id="desk-builder-close-btn" class="icon-close-btn studio-close" aria-label="إغلاق استوديو 3D">
            ${ICONS.close}
          </button>
        </div>
      </header>

      <!-- 3D Canvas Stage -->
      <div id="studio-3d-canvas" class="studio-canvas"></div>

      <!-- Floating Right Catalog Drawer -->
      <aside class="studio-catalog-drawer" aria-label="كتالوج قطع المكتب ثلاثية الأبعاد">
        <div class="studio-drawer-header">
          <h3>📦 منتجات التجهيز</h3>
          <p>اضغط مطولاً واسحب القطعة مباشرة نحو المكتب</p>
        </div>
        <div id="studio-catalog-list" class="studio-catalog-items"></div>
        <div class="studio-drawer-footer">
          <div class="studio-total-row">
            <span>مجموع التشكيلة:</span>
            <span id="studio-total-price" class="studio-total-val">0 ر.س</span>
          </div>
          <button type="button" id="studio-add-cart-btn" class="studio-checkout-btn">
            🛒 إضافة التشكيلة كاملة للسلة
          </button>
        </div>
      </aside>

      <!-- Floating Bottom Selection & Rotation Bar -->
      <div id="studio-selected-bar" class="studio-selected-bar" aria-label="التحكم بالقطعة المحددة">
        <div class="selected-meta">
          <span class="meta-label">القطعة:</span>
          <span id="studio-selected-name" class="meta-val">شاشة</span>
        </div>
        <div class="selected-rotation">
          <label for="studio-rotate-slider">🔄 التدوير:</label>
          <input type="range" id="studio-rotate-slider" min="0" max="360" value="0">
          <span id="studio-rotate-val" class="rotation-deg">0°</span>
        </div>
        <button type="button" id="studio-delete-btn" class="studio-delete-btn" aria-label="حذف القطعة المحددة">
          🗑️ حذف
        </button>
      </div>

      <!-- Quick Guidance Pill -->
      <div class="studio-guide-pill" aria-hidden="true">
        <span>💡 اسحب أي قطعة على الطاولة لنقلها، ولف الكاميرا بالماوس 360°</span>
      </div>
    </div>
  </dialog>

  <!-- Live Toast Container -->
  <div id="toast-container" class="toast-container" aria-live="polite"></div>

  <footer class="store-footer">
    <div class="container footer-grid">
      <div class="footer-col">
        <div class="r-sidebar-brand" style="position:static;justify-content:flex-start;">
          <span class="vermilion-seal" aria-hidden="true">شوب<br />بورد</span>
          <div class="brand-titles">
            <span class="brand-en">ShopBoard</span>
            <span class="brand-ar">شوب بورد</span>
          </div>
        </div>
        <p class="footer-text">
          متجر متخصص في الأجهزة التقنية الاحترافية ومعدات المكتب المختارة بعناية، مستوحى من حرفية ورق الواشي ودفء خشب البلوط والنحاس.
        </p>
      </div>

      <div class="footer-col">
        <h3 class="footer-heading">أقسام الأتيليه</h3>
        <ul class="footer-links">
          <li><a href="#products-section" data-footer-cat="الكل">جميع معدات المكتب</a></li>
          <li><a href="#products-section" data-footer-cat="لوحات مفاتيح">لوحات المفاتيح الميكانيكية</a></li>
          <li><a href="#products-section" data-footer-cat="صوتيات المكتب">صوتيات الاستوديو</a></li>
          <li><a href="#products-section" data-footer-cat="إضاءة المكتب">إضاءة المكتب المعمارية</a></li>
          <li><a href="#products-section" data-footer-cat="تنظيم المكتب">أدوات تنظيم المكتب</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h3 class="footer-heading">النشرة البريدية</h3>
        <p class="footer-text">اشترك الآن واحصل على كود خصم ترحيبي بقيمة 10% على تجهيز مكتبك الأول.</p>
        <form class="newsletter-form" id="newsletter-form" novalidate>
          <div class="form-field">
            <label for="newsletter-email" class="field-label">البريد الإلكتروني:</label>
            <div class="newsletter-input-group">
              <input
                type="email"
                id="newsletter-email"
                name="email"
                required
                placeholder="name@example.com"
                dir="ltr"
              />
              <button type="submit" class="btn btn-primary">اشتراك</button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div class="footer-bottom container">
      <p>© 2026 ShopBoard (شوب بورد). جميع الحقوق محفوظة.</p>
      <p class="footer-meta">الأسعار شاملة ضريبة القيمة المضافة • ضمان سنتين</p>
    </div>
  </footer>
`

// DOM Elements Helpers
const $ = <T extends HTMLElement = HTMLElement>(sel: string): T => {
  const el = document.querySelector<T>(sel)
  if (!el) throw new Error(`Required element not found: ${sel}`)
  return el
}

const $opt = <T extends HTMLElement = HTMLElement>(sel: string): T | null => {
  return document.querySelector<T>(sel)
}

// DOM Elements
const categoryNav = $<HTMLElement>('#categories-nav')
const productsGrid = $<HTMLElement>('#products-grid')
const productsCount = $<HTMLElement>('#products-count')
const searchForm = $<HTMLFormElement>('#search-form')
const searchInput = $<HTMLInputElement>('#search-input')
const sortSelect = $<HTMLSelectElement>('#sort-select')
const priceRangeInput = $<HTMLInputElement>('#price-range-input')
const priceRangeOutput = $<HTMLElement>('#price-range-output')
const heroFilterElectronics = $opt<HTMLElement>('#hero-filter-electronics')

const cartToggleBtn = $<HTMLButtonElement>('#cart-toggle-btn')
const cartCloseBtn = $<HTMLButtonElement>('#cart-close-btn')
const cartDrawer = $<HTMLElement>('#cart-drawer')
const cartBackdrop = $<HTMLElement>('#cart-backdrop')
const cartBadge = $<HTMLElement>('#cart-badge')
const headerCartTotal = $<HTMLElement>('#header-cart-total')
const drawerItemsCount = $<HTMLElement>('#drawer-items-count')
const cartClearBtn = $opt<HTMLButtonElement>('#cart-clear-btn')
const shippingBanner = $<HTMLElement>('#shipping-banner')
const shippingBannerText = $<HTMLElement>('#shipping-banner-text')
const shippingProgressFill = $<HTMLElement>('#shipping-progress-fill')
const shippingProgressbar = $<HTMLElement>('#shipping-progressbar')
const cartEmptyView = $<HTMLElement>('#cart-empty-view')
const cartItemsList = $<HTMLElement>('#cart-items-list')

const couponForm = $<HTMLFormElement>('#coupon-form')
const couponInput = $<HTMLInputElement>('#coupon-code')
const appliedCouponTag = $<HTMLElement>('#applied-coupon-tag')
const appliedCouponText = $<HTMLElement>('#applied-coupon-text')
const removeCouponBtn = $<HTMLButtonElement>('#remove-coupon-btn')

const checkoutForm = $<HTMLFormElement>('#checkout-form')
const customerNameInput = $<HTMLInputElement>('#customer-name')
const customerPhoneInput = $<HTMLInputElement>('#customer-phone')
const summarySubtotal = $<HTMLElement>('#summary-subtotal')
const summaryDiscountRow = $<HTMLElement>('#summary-discount-row')
const summaryDiscount = $<HTMLElement>('#summary-discount')
const summaryShipping = $<HTMLElement>('#summary-shipping')
const summaryTotal = $<HTMLElement>('#summary-total')

const productDialog = $<HTMLDialogElement>('#product-dialog')
const productModalBody = $<HTMLElement>('#product-modal-body')

const orderDialog = $<HTMLDialogElement>('#order-dialog')
const dialogOrderMsg = $<HTMLElement>('#dialog-order-msg')
const dialogDetails = $<HTMLElement>('#dialog-details')
const dialogCloseBtn = $<HTMLButtonElement>('#dialog-close-btn')
const toastContainer = $<HTMLElement>('#toast-container')
const newsletterForm = $<HTMLFormElement>('#newsletter-form')

// Auth Elements
const authToggleBtn = $<HTMLButtonElement>('#auth-toggle-btn')
const authBtnLabel = $<HTMLElement>('#auth-btn-label')
const authDialog = $<HTMLDialogElement>('#auth-dialog')
const authCloseBtn = $<HTMLButtonElement>('#auth-close-btn')
const authModalTitle = $<HTMLElement>('#auth-modal-title')
const authAnonymousSection = $<HTMLElement>('#auth-anonymous-section')
const authAuthenticatedSection = $<HTMLElement>('#auth-authenticated-section')
const tabLogin = $<HTMLButtonElement>('#tab-login')
const tabRegister = $<HTMLButtonElement>('#tab-register')
const loginForm = $<HTMLFormElement>('#login-form')
const registerForm = $<HTMLFormElement>('#register-form')
const authUserName = $<HTMLElement>('#auth-user-name')
const authUserEmail = $<HTMLElement>('#auth-user-email')
const authLogoutBtn = $<HTMLButtonElement>('#auth-logout-btn')

// Toast Notification
function showToast(message: string, _type: string = 'success'): void {
  const toast = document.createElement('div')
  toast.className = 'toast'
  toast.innerHTML = `<span class="toast-check">${ICONS.check}</span> <span>${message}</span>`
  toastContainer.appendChild(toast)

  setTimeout(() => {
    toast.classList.add('toast-fade')
    setTimeout(() => toast.remove(), 300)
  }, 2800)
}

// Render Categories with product counts
function renderCategories() {
  categoryNav.innerHTML = CATEGORIES.map((cat) => {
    const count =
      cat === 'الكل'
        ? PRODUCTS.length
        : PRODUCTS.filter((item) => item.category === cat).length
    const isActive = state.selectedCategory === cat

    return `
      <button
        type="button"
        class="category-btn ${isActive ? 'is-active' : ''}"
        data-category="${cat}"
        aria-pressed="${isActive}"
      >
        <span>${cat}</span>
        <span class="category-count">${count}</span>
      </button>
    `
  }).join('')
}

// Filter and Sort Products
function getFilteredProducts(): Product[] {
  const list = PRODUCTS.filter((item) => {
    const matchesCategory =
      state.selectedCategory === 'الكل' || item.category === state.selectedCategory
    const matchesPrice = item.price <= state.maxPrice
    const query = state.searchQuery.trim().toLowerCase()
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    return matchesCategory && matchesPrice && matchesSearch
  })

  switch (state.sortBy) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'rating':
      return list.sort((a, b) => b.rating - a.rating)
    case 'default':
    default:
      return list.sort((a, b) => PRODUCTS.indexOf(a) - PRODUCTS.indexOf(b))
  }
}

// Render Product Catalog
function renderProducts(): void {
  const products = getFilteredProducts()
  productsCount.textContent = `عرض ${products.length} من أصل ${PRODUCTS.length} قطع مكتبية`

  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="empty-results">
        <h3>لا توجد منتجات مطابقة لمعايير البحث</h3>
        <p>جرّب توسيع الحد الأقصى للسعر أو اختيار تصنيف آخر.</p>
        <button type="button" class="btn btn-primary" id="reset-filters">
          إعادة ضبط جميع الفلاتر
        </button>
      </div>
    `
    document.querySelector('#reset-filters')?.addEventListener('click', () => {
      state.selectedCategory = 'الكل'
      state.searchQuery = ''
      state.sortBy = 'default'
      state.maxPrice = 6000
      searchInput.value = ''
      sortSelect.value = 'default'
      priceRangeInput.value = '6000'
      priceRangeOutput.textContent = '6000 ر.س'
      clearValidationErrors(searchForm)
      renderCategories()
      renderProducts()
    })
    return
  }

  productsGrid.innerHTML = products.map((item) => {
    const discountPct = getDiscountPercent(item.price, item.originalPrice)
    const specsList = item.specs ? item.specs.slice(0, 2).map((spec: string) => `<li>${spec}</li>`).join('') : ''

    return `
      <article class="product-card" data-id="${item.id}">
        <figure class="product-media">
          <img
            src="${item.image}"
            alt="${item.name}"
            class="product-img"
            loading="lazy"
            width="400"
            height="300"
          />

          <div class="product-badges">
            ${item.tag ? `<span class="badge-editorial">${item.tag}</span>` : ''}
            ${discountPct > 0 ? `<span class="badge-discount">خصم ${discountPct}%</span>` : ''}
          </div>

          <button
            type="button"
            class="quick-view-trigger"
            data-quick-id="${item.id}"
            aria-label="معاينة تفاصيل ${item.name}"
          >
            ${ICONS.eye}
            <span>معاينة</span>
          </button>
        </figure>

        <div class="product-body">
          <div class="product-meta-row">
            <span class="product-cat">${item.category}</span>
            <div class="product-rating" aria-label="التقييم ${item.rating} من 5">
              <span class="star-svg">${ICONS.star}</span>
              <strong>${item.rating}</strong>
              <span class="rating-count">(${item.reviewsCount})</span>
            </div>
          </div>

          <h3 class="product-name">${item.name}</h3>
          <p class="product-desc">${item.description}</p>

          <ul class="product-specs" aria-label="أبرز المواصفات">
            ${specsList}
          </ul>

          <div class="product-price-row">
            <div class="product-price">
              <div class="price-current">
                <span class="amount">${item.price}</span>
                <span class="currency">ر.س</span>
              </div>
              ${item.originalPrice ? `<s class="original-price">${item.originalPrice} ر.س</s>` : ''}
            </div>

            <button
              type="button"
              class="btn btn-add-cart"
              data-add-id="${item.id}"
              aria-label="أضف ${item.name} إلى السلة"
            >
              ${ICONS.plus}
              <span>أضف للسلة</span>
            </button>
          </div>
        </div>
      </article>
    `
  }).join('')
}

// Open Quick View Modal for a Product
function openQuickView(productId: number): void {
  const item = PRODUCTS.find((p) => p.id === productId)
  if (!item) return

  const discountPct = getDiscountPercent(item.price, item.originalPrice)
  const fullSpecs = item.specs ? item.specs.map((s: string) => `<li>${s}</li>`).join('') : ''

  productModalBody.innerHTML = `
    <header class="dialog-header">
      <div>
        <h2 id="quick-view-title">${item.name}</h2>
        <p class="catalog-subtitle">${item.category} • كود المنتج ${item.sku}</p>
      </div>
      <button type="button" class="icon-close-btn" id="quick-view-close" aria-label="إغلاق المعاينة">
        ${ICONS.close}
      </button>
    </header>

    <div class="quick-view-grid">
      <figure class="quick-view-figure">
        <img
          src="${item.image}"
          alt="${item.name}"
          class="quick-view-img"
          width="500"
          height="420"
        />
      </figure>

      <div class="quick-view-details">
        <p class="quick-view-desc">${item.description}</p>

        <div class="quick-view-specs-box">
          <h3>المواصفات التقنية والضمان:</h3>
          <ul class="product-specs">
            ${fullSpecs}
            ${item.warranty ? `<li>${item.warranty}</li>` : ''}
          </ul>
        </div>

        <div class="product-price-row">
          <div class="product-price">
            <div class="price-current">
              <span class="amount">${item.price}</span>
              <span class="currency">ر.س</span>
            </div>
            ${item.originalPrice ? `<s class="original-price">${item.originalPrice} ر.س</s>` : ''}
            ${discountPct > 0 ? `<span class="badge-discount">توفير ${discountPct}%</span>` : ''}
          </div>

          <button type="button" class="btn btn-primary btn-lg" id="quick-view-add-btn">
            أضف إلى حقيبة التسوق
          </button>
        </div>
      </div>
    </div>
  `

  productModalBody.querySelector('#quick-view-close')?.addEventListener('click', () => {
    productDialog.close()
  })

  productModalBody.querySelector('#quick-view-add-btn')?.addEventListener('click', () => {
    cart.addItem(item)
    showToast(`تمت إضافة "${item.name}" إلى السلة`)
    productDialog.close()
  })

  productDialog.showModal()
}

// Cart Drawer open/close
function openCart() {
  state.isCartOpen = true
  cartDrawer.classList.add('is-open')
  cartDrawer.setAttribute('aria-hidden', 'false')
  cartBackdrop.classList.add('is-visible')
  cartToggleBtn.setAttribute('aria-expanded', 'true')
  document.body.classList.add('drawer-locked')
}

function closeCart() {
  state.isCartOpen = false
  cartDrawer.classList.remove('is-open')
  cartDrawer.setAttribute('aria-hidden', 'true')
  cartBackdrop.classList.remove('is-visible')
  cartToggleBtn.setAttribute('aria-expanded', 'false')
  document.body.classList.remove('drawer-locked')
}

// Render Cart UI from CartManager state
function updateCartUI(cartState: CartState): void {
  cartBadge.textContent = String(cartState.count)
  headerCartTotal.textContent = `${cartState.total} ر.س`
  drawerItemsCount.textContent = `${cartState.count} عناصر`
  if (cartClearBtn) {
    cartClearBtn.disabled = cartState.items.length === 0
  }

  shippingProgressFill.style.width = `${cartState.shippingProgress}%`
  shippingProgressbar.setAttribute('aria-valuenow', String(cartState.shippingProgress))
  if (cartState.remainingForFreeShipping === 0 && cartState.count > 0) {
    shippingBannerText.innerHTML = `<strong>تهانينا!</strong> طلبك مؤهل للحصول على شحن مجاني بالكامل.`
    shippingBanner.classList.add('is-unlocked')
  } else {
    shippingBannerText.innerHTML = `أضف <strong>${cartState.remainingForFreeShipping} ر.س</strong> إضافية للحصول على <strong>شحن مجاني</strong>`
    shippingBanner.classList.remove('is-unlocked')
  }

  if (cartState.appliedCoupon) {
    appliedCouponTag.hidden = false
    appliedCouponText.textContent = `تم تفعيل الكود ${cartState.appliedCoupon.code} (${cartState.appliedCoupon.label})`
  } else {
    appliedCouponTag.hidden = true
  }

  if (cartState.items.length === 0) {
    cartEmptyView.style.display = 'flex'
    cartItemsList.style.display = 'none'
    couponForm.style.display = 'none'
    checkoutForm.style.display = 'none'
  } else {
    cartEmptyView.style.display = 'none'
    cartItemsList.style.display = 'flex'
    couponForm.style.display = 'flex'
    checkoutForm.style.display = 'flex'

    cartItemsList.innerHTML = cartState.items.map((item) => {
      const productImg =
        item.image || PRODUCTS.find((p) => p.id === item.id)?.image || ''
      return `
        <li class="cart-item" data-id="${item.id}">
          <div class="cart-item-thumb">
            <img
              src="${productImg}"
              alt="${item.name}"
              class="cart-item-img"
              loading="lazy"
              width="68"
              height="68"
            />
          </div>
          <div class="item-details">
            <h4 class="item-name">${item.name}</h4>
            <span class="item-price">${item.price} ر.س × ${item.quantity} = <strong>${item.price * item.quantity} ر.س</strong></span>
            <div class="quantity-controls" aria-label="التحكم بالكمية">
              <button
                type="button"
                class="qty-btn"
                data-action="decrease"
                data-id="${item.id}"
                aria-label="إنقاص الكمية لمنتج ${item.name}"
              >
                −
              </button>
              <span class="qty-display" aria-label="الكمية الحالية">${item.quantity}</span>
              <button
                type="button"
                class="qty-btn"
                data-action="increase"
                data-id="${item.id}"
                aria-label="زيادة الكمية لمنتج ${item.name}"
              >
                +
              </button>
              <button
                type="button"
                class="item-delete-btn"
                data-action="delete"
                data-id="${item.id}"
                aria-label="حذف منتج ${item.name} من السلة"
              >
                ${ICONS.trash}
                <span>حذف</span>
              </button>
            </div>
          </div>
        </li>
      `
    }).join('')

    summarySubtotal.textContent = `${cartState.subtotal} ر.س`
    if (cartState.discountAmount > 0) {
      summaryDiscountRow.hidden = false
      summaryDiscount.textContent = `-${cartState.discountAmount} ر.س`
    } else {
      summaryDiscountRow.hidden = true
    }
    summaryShipping.textContent = cartState.shipping === 0 ? 'مجاني' : `${cartState.shipping} ر.س`
    summaryTotal.textContent = `${cartState.total} ر.س`
  }
}

// Auth UI Updates
function updateAuthUI(user: User | null): void {
  if (user) {
    authBtnLabel.textContent = user.name || 'حسابي'
    authToggleBtn.classList.add('is-authenticated')
    authUserName.textContent = user.name || 'عميل ShopBoard'
    authUserEmail.textContent = user.email || ''
    authModalTitle.textContent = 'الملف الشخصي'

    authAnonymousSection.hidden = true
    authAuthenticatedSection.hidden = false

    if (!customerNameInput.value && user.name) {
      customerNameInput.value = user.name
    }
    if (!customerPhoneInput.value && user.phone) {
      customerPhoneInput.value = user.phone
    }
  } else {
    authBtnLabel.textContent = 'الإعدادات'
    authToggleBtn.classList.remove('is-authenticated')
    authModalTitle.textContent = 'تسجيل الدخول إلى ShopBoard'

    authAnonymousSection.hidden = false
    authAuthenticatedSection.hidden = true
  }
}

// Switch between login and register tabs
function switchAuthTab(target: 'login' | 'register'): void {
  clearValidationErrors(loginForm)
  clearValidationErrors(registerForm)

  if (target === 'login') {
    tabLogin.classList.add('is-active')
    tabLogin.setAttribute('aria-selected', 'true')
    tabRegister.classList.remove('is-active')
    tabRegister.setAttribute('aria-selected', 'false')
    loginForm.hidden = false
    registerForm.hidden = true
    authModalTitle.textContent = 'تسجيل الدخول إلى ShopBoard'
  } else {
    tabRegister.classList.add('is-active')
    tabRegister.setAttribute('aria-selected', 'true')
    tabLogin.classList.remove('is-active')
    tabLogin.setAttribute('aria-selected', 'false')
    registerForm.hidden = false
    loginForm.hidden = true
    authModalTitle.textContent = 'إنشاء حساب جديد في ShopBoard'
  }
}

// Events Setup
function setupEvents(): void {
  // Setup Live Realtime Validations for all inputs
  attachLiveValidation('search-input', 'search', { validateOnBlur: false })
  attachLiveValidation('price-range-input', 'priceRange', { validateOnBlur: false })
  attachLiveValidation('coupon-code', 'coupon')
  attachLiveValidation('login-email', 'email')
  attachLiveValidation('login-password', 'password')
  attachLiveValidation('register-name', 'name')
  attachLiveValidation('register-email', 'email')
  attachLiveValidation('register-phone', 'phone')
  attachLiveValidation('register-password', 'password')
  attachLiveValidation('customer-name', 'name')
  attachLiveValidation('customer-phone', 'phone')
  attachLiveValidation('customer-city', 'city')
  attachLiveValidation('newsletter-email', 'email')

  // Category clicks
  categoryNav.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    const btn = target?.closest<HTMLButtonElement>('[data-category]')
    if (!btn || !btn.dataset.category) return
    state.selectedCategory = btn.dataset.category
    renderCategories()
    renderProducts()
  })

  // Hero desk setup shortcut
  if (heroFilterElectronics) {
    heroFilterElectronics.addEventListener('click', () => {
      state.selectedCategory = 'تنظيم المكتب'
      renderCategories()
      renderProducts()
      document.querySelector('#products-section')?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  // Sidebar featured item quick view / add
  document.querySelector('[data-spotlight-add]')?.addEventListener('click', () => {
    openQuickView(5)
  })

  // First-viewport 4 catalog card Add-to-Cart buttons
  document.querySelectorAll<HTMLButtonElement>('[data-hero-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.heroAdd)
      const product = PRODUCTS.find((p) => p.id === id)
      if (product) {
        cart.addItem(product)
        showToast(`تمت إضافة "${product.name}" إلى السلة`)
      }
    })
  })

  // Footer category links
  document.querySelectorAll<HTMLElement>('[data-footer-cat]').forEach((link) => {
    link.addEventListener('click', () => {
      if (link.dataset.footerCat) {
        state.selectedCategory = link.dataset.footerCat
        renderCategories()
        renderProducts()
      }
    })
  })

  // Search form
  searchForm.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault()
    if (!validateField(searchInput, 'search')) return
    state.searchQuery = searchInput.value
    renderProducts()
  })

  searchInput.addEventListener('input', (e: Event) => {
    if (!validateField(searchInput, 'search')) return
    state.searchQuery = (e.target as HTMLInputElement).value
    renderProducts()
  })

  // Price range slider
  priceRangeInput.addEventListener('input', (e: Event) => {
    if (!validateField(priceRangeInput, 'priceRange')) return
    state.maxPrice = Number((e.target as HTMLInputElement).value)
    priceRangeOutput.textContent = `${state.maxPrice} ر.س`
    renderProducts()
  })

  // Sort change
  sortSelect.addEventListener('change', (e: Event) => {
    state.sortBy = (e.target as HTMLSelectElement).value as SortOption
    renderProducts()
  })

  // Product Grid Actions (Add to Cart & Quick View)
  productsGrid.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    if (!target) return

    const quickBtn = target.closest<HTMLElement>('[data-quick-id]')
    if (quickBtn && quickBtn.dataset.quickId) {
      openQuickView(Number(quickBtn.dataset.quickId))
      return
    }

    const addBtn = target.closest<HTMLElement>('[data-add-id]')
    if (!addBtn || !addBtn.dataset.addId) return
    const id = Number(addBtn.dataset.addId)
    const product = PRODUCTS.find((p) => p.id === id)
    if (product) {
      cart.addItem(product)
      showToast(`تمت إضافة "${product.name}" إلى السلة`)
    }
  })

  // Cart toggles
  cartToggleBtn.addEventListener('click', openCart)
  cartCloseBtn.addEventListener('click', closeCart)
  cartBackdrop.addEventListener('click', closeCart)
  cartClearBtn?.addEventListener('click', () => {
    if (cart.getState().items.length === 0) return
    cart.clear()
    showToast('تم إفراغ سلة التسوق بالكامل', 'info')
  })

  // Coupon Form submission
  couponForm.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault()
    const isValid = validateForm(couponForm, [{ inputId: 'coupon-code', ruleKey: 'coupon' }])
    if (!isValid) return

    const coupon = cart.applyCoupon(couponInput.value)
    if (coupon) {
      showToast(`تم تفعيل كود الخصم ${coupon.code} (${coupon.label})`)
      couponInput.value = ''
      clearValidationErrors(couponForm)
    }
  })

  removeCouponBtn.addEventListener('click', () => {
    cart.removeCoupon()
    showToast('تم إلغاء كود الخصم')
  })

  // 3D Desk Builder open
  const deskBuilderBtn = document.querySelector<HTMLButtonElement>('#btn-open-desk-builder')
  if (deskBuilderBtn) {
    deskBuilderBtn.addEventListener('click', async () => {
      const { initDeskBuilder } = await import('./desk-builder/index')
      initDeskBuilder()
    })
  }

  // Auth Dialog open/close
  authToggleBtn.addEventListener('click', () => {
    authDialog.showModal()
  })

  authCloseBtn.addEventListener('click', () => {
    authDialog.close()
  })

  tabLogin.addEventListener('click', () => switchAuthTab('login'))
  tabRegister.addEventListener('click', () => switchAuthTab('register'))

  // Login submission
  loginForm.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault()
    const isValid = validateForm(loginForm, [
      { inputId: 'login-email', ruleKey: 'email' },
      { inputId: 'login-password', ruleKey: 'password' }
    ])
    if (!isValid) return

    const email = document.querySelector<HTMLInputElement>('#login-email')?.value || ''
    const password = document.querySelector<HTMLInputElement>('#login-password')?.value || ''
    const remember = document.querySelector<HTMLInputElement>('#login-remember')?.checked || false

    const user = auth.login(email, password, remember)
    showToast(`أهلاً بك مجدداً يا ${user.name}`)
    loginForm.reset()
    clearValidationErrors(loginForm)
    authDialog.close()
  })

  // Register submission
  registerForm.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault()
    const isValid = validateForm(registerForm, [
      { inputId: 'register-name', ruleKey: 'name' },
      { inputId: 'register-email', ruleKey: 'email' },
      { inputId: 'register-phone', ruleKey: 'phone' },
      { inputId: 'register-password', ruleKey: 'password' }
    ])
    if (!isValid) return

    const name = document.querySelector<HTMLInputElement>('#register-name')?.value || ''
    const email = document.querySelector<HTMLInputElement>('#register-email')?.value || ''
    const phone = document.querySelector<HTMLInputElement>('#register-phone')?.value || ''

    const user = auth.register({ name, email, phone })
    showToast(`تم إنشاء حسابك بنجاح، مرحباً ${user.name}`)
    registerForm.reset()
    clearValidationErrors(registerForm)
    authDialog.close()
  })

  // Logout
  authLogoutBtn.addEventListener('click', () => {
    auth.logout()
    showToast('تم تسجيل الخروج من حسابك')
    authDialog.close()
  })

  // Cart quantity & delete actions
  cartItemsList.addEventListener('click', (e: MouseEvent) => {
    const target = e.target as HTMLElement | null
    const btn = target?.closest<HTMLButtonElement>('button[data-action]')
    if (!btn || !btn.dataset.id || !btn.dataset.action) return
    const id = Number(btn.dataset.id)
    const action = btn.dataset.action

    if (action === 'increase') {
      cart.updateQuantity(id, 1)
    } else if (action === 'decrease') {
      cart.updateQuantity(id, -1)
    } else if (action === 'delete') {
      cart.removeItem(id)
      showToast('تم حذف المنتج من السلة')
    }
  })

  // Checkout submission
  checkoutForm.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault()
    const cartState = cart.getState()
    if (cartState.items.length === 0) return

    const isValid = validateForm(checkoutForm, [
      { inputId: 'customer-name', ruleKey: 'name' },
      { inputId: 'customer-phone', ruleKey: 'phone' },
      { inputId: 'customer-city', ruleKey: 'city' }
    ])
    if (!isValid) return

    const formData = new FormData(checkoutForm)
    const name = (formData.get('name') as string) || ''
    const phone = (formData.get('phone') as string) || ''
    const city = (formData.get('city') as string) || ''
    const payment = (formData.get('payment') as string) || 'card'

    const paymentLabels: Record<string, string> = {
      cod: 'الدفع عند الاستلام',
      card: 'بطاقة مدى / ائتمانية',
      applepay: 'Apple Pay'
    }

    dialogOrderMsg.textContent = `شكراً لثقتك يا ${name}! سيتم تجهيز وشحن طلبك إلى ${city} خلال 24 ساعة.`
    dialogDetails.innerHTML = `
      <div class="summary-line"><span>رقم الطلب المرجعي:</span> <strong dir="ltr">#SB-${Math.floor(100000 + Math.random() * 900000)}</strong></div>
      <div class="summary-line"><span>رقم التواصل:</span> <strong dir="ltr">${phone}</strong></div>
      <div class="summary-line"><span>طريقة الدفع:</span> <strong>${paymentLabels[payment] || payment}</strong></div>
      <div class="summary-line"><span>عدد القطع:</span> <strong>${cartState.count}</strong></div>
      <div class="summary-line summary-total"><span>المبلغ الإجمالي:</span> <strong>${cartState.total} ر.س</strong></div>
    `

    cart.clear()
    closeCart()
    checkoutForm.reset()
    clearValidationErrors(checkoutForm)
    orderDialog.showModal()
  })

  dialogCloseBtn.addEventListener('click', () => {
    orderDialog.close()
  })

  // Newsletter form
  newsletterForm.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault()
    const isValid = validateForm(newsletterForm, [
      { inputId: 'newsletter-email', ruleKey: 'email' }
    ])
    if (!isValid) return

    showToast('تم اشتراكك بنجاح! استخدم الكود WELCOME10 لخصم 10%')
    newsletterForm.reset()
    clearValidationErrors(newsletterForm)
  })

  // Close dialogs when clicking backdrop
  ;([productDialog, authDialog, orderDialog] as HTMLDialogElement[]).forEach((dialogEl) => {
    dialogEl.addEventListener('click', (e: MouseEvent) => {
      if (e.target === dialogEl) {
        dialogEl.close()
      }
    })
  })

  // Escape key closes drawer
  window.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && state.isCartOpen) {
      closeCart()
    }
  })
}

// Initialise App
renderCategories()
renderProducts()
cart.subscribe(updateCartUI)
auth.subscribe(updateAuthUI)
setupEvents()
