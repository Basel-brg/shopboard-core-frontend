import type { Product, CategoryType } from './products.types';
import { PRODUCTS, CATEGORIES } from './products.api';
import { getDiscountPercent } from './products.logic';
import { ICONS } from '../../shared/ui/icons';

export function renderCategories(
  container: HTMLElement,
  selectedCategory: string
): void {
  container.innerHTML = CATEGORIES.map((cat: CategoryType) => {
    const count =
      cat === 'الكل'
        ? PRODUCTS.length
        : PRODUCTS.filter((item) => item.category === cat).length;
    const isActive = selectedCategory === cat;

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
    `;
  }).join('');
}

export function renderProducts(
  container: HTMLElement,
  countEl: HTMLElement,
  products: Product[],
  onReset?: () => void
): void {
  countEl.textContent = `عرض ${products.length} من أصل ${PRODUCTS.length} قطع مكتبية`;

  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-results">
        <h3>لا توجد منتجات مطابقة لمعايير البحث</h3>
        <p>جرّب توسيع الحد الأقصى للسعر أو اختيار تصنيف آخر.</p>
        <button type="button" class="btn btn-primary" id="reset-filters">
          إعادة ضبط جميع الفلاتر
        </button>
      </div>
    `;
    if (onReset) {
      container.querySelector('#reset-filters')?.addEventListener('click', onReset);
    }
    return;
  }

  container.innerHTML = products.map((item) => {
    const discountPct = getDiscountPercent(item.price, item.originalPrice);
    const specsList = item.specs ? item.specs.slice(0, 2).map((spec: string) => `<li>${spec}</li>`).join('') : '';

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
    `;
  }).join('');
}

export function openQuickView(
  productId: number,
  modalBody: HTMLElement,
  modalDialog: HTMLDialogElement,
  onAddToCart: (item: Product) => void
): void {
  const item = PRODUCTS.find((p) => p.id === productId);
  if (!item) return;

  const discountPct = getDiscountPercent(item.price, item.originalPrice);
  const fullSpecs = item.specs ? item.specs.map((s: string) => `<li>${s}</li>`).join('') : '';

  modalBody.innerHTML = `
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
  `;

  modalBody.querySelector('#quick-view-close')?.addEventListener('click', () => {
    modalDialog.close();
  });

  modalBody.querySelector('#quick-view-add-btn')?.addEventListener('click', () => {
    onAddToCart(item);
    modalDialog.close();
  });

  modalDialog.showModal();
}
