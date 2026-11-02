import type { CartState } from './cart.types';
import { PRODUCTS } from '../products/products.api';
import { ICONS } from '../../shared/ui/icons';

export interface CartUIElements {
  badge: HTMLElement;
  headerTotal: HTMLElement;
  drawerCount: HTMLElement;
  clearBtn: HTMLButtonElement | null;
  progressFill: HTMLElement;
  progressBar: HTMLElement;
  bannerText: HTMLElement;
  banner: HTMLElement;
  couponTag: HTMLElement;
  couponText: HTMLElement;
  emptyView: HTMLElement;
  itemsList: HTMLElement;
  subtotal: HTMLElement;
  discountRow: HTMLElement;
  discount: HTMLElement;
  shipping: HTMLElement;
  total: HTMLElement;
  couponForm: HTMLElement;
  checkoutForm: HTMLElement;
}

export function renderCartUI(elements: CartUIElements, state: CartState): void {
  elements.badge.textContent = String(state.count);
  elements.headerTotal.textContent = `${state.total} ر.س`;
  elements.drawerCount.textContent = `${state.count} عناصر`;
  if (elements.clearBtn) {
    elements.clearBtn.disabled = state.items.length === 0;
  }

  elements.progressFill.style.width = `${state.shippingProgress}%`;
  elements.progressBar.setAttribute('aria-valuenow', String(state.shippingProgress));

  if (state.remainingForFreeShipping === 0 && state.count > 0) {
    elements.bannerText.innerHTML = `<strong>تهانينا!</strong> طلبك مؤهل للحصول على شحن مجاني بالكامل.`;
    elements.banner.classList.add('is-unlocked');
  } else {
    elements.bannerText.innerHTML = `أضف <strong>${state.remainingForFreeShipping} ر.س</strong> إضافية للحصول على <strong>شحن مجاني</strong>`;
    elements.banner.classList.remove('is-unlocked');
  }

  if (state.appliedCoupon) {
    elements.couponTag.hidden = false;
    elements.couponText.textContent = `تم تفعيل الكود ${state.appliedCoupon.code} (${state.appliedCoupon.label})`;
  } else {
    elements.couponTag.hidden = true;
  }

  if (state.items.length === 0) {
    elements.emptyView.style.display = 'flex';
    elements.itemsList.style.display = 'none';
    elements.couponForm.style.display = 'none';
    elements.checkoutForm.style.display = 'none';
  } else {
    elements.emptyView.style.display = 'none';
    elements.itemsList.style.display = 'flex';
    elements.couponForm.style.display = 'flex';
    elements.checkoutForm.style.display = 'flex';

    elements.itemsList.innerHTML = state.items.map((item) => {
      const productImg =
        item.image || PRODUCTS.find((p) => p.id === item.id)?.image || '';
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
      `;
    }).join('');

    elements.subtotal.textContent = `${state.subtotal} ر.س`;
    if (state.discountAmount > 0) {
      elements.discountRow.hidden = false;
      elements.discount.textContent = `-${state.discountAmount} ر.س`;
    } else {
      elements.discountRow.hidden = true;
    }
    elements.shipping.textContent = state.shipping === 0 ? 'مجاني' : `${state.shipping} ر.س`;
    elements.total.textContent = `${state.total} ر.س`;
  }
}
