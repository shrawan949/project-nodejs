// Nexus E-Commerce Client-side Shopping Cart Engine
const CART_STORAGE_KEY = 'nexus_cart_v1';
const COUPON_STORAGE_KEY = 'nexus_applied_coupon';

const Cart = {
  getItems() {
    try {
      const data = localStorage.getItem(CART_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  save(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    this.updateBadge();
  },

  addItem(product, qty = 1) {
    const items = this.getItems();
    const existingIndex = items.findIndex((i) => i.id === product.id);

    if (existingIndex > -1) {
      items[existingIndex].qty += Number(qty);
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
        slug: product.slug,
        countInStock: product.countInStock || 10,
        qty: Number(qty),
      });
    }

    this.save(items);
    this.showToast(`Added ${product.name} to cart!`, 'success');
  },

  updateQty(productId, qty) {
    let items = this.getItems();
    const newQty = parseInt(qty, 10);

    if (newQty <= 0) {
      this.removeItem(productId);
      return;
    }

    items = items.map((i) => (i.id === productId ? { ...i, qty: newQty } : i));
    this.save(items);
  },

  removeItem(productId) {
    let items = this.getItems();
    items = items.filter((i) => i.id !== productId);
    this.save(items);
    this.showToast('Item removed from cart', 'info');
  },

  clear() {
    localStorage.removeItem(CART_STORAGE_KEY);
    sessionStorage.removeItem(COUPON_STORAGE_KEY);
    this.updateBadge();
  },

  getCount() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.qty, 0);
  },

  getSubtotal() {
    const items = this.getItems();
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  },

  updateBadge() {
    const count = this.getCount();
    const badges = document.querySelectorAll('.cart-count-badge');
    badges.forEach((b) => {
      b.textContent = count;
      if (count > 0) {
        b.classList.remove('hidden');
      } else {
        b.classList.add('hidden');
      }
    });
  },

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-emerald-600 text-white',
      error: 'bg-rose-600 text-white',
      info: 'bg-slate-900 text-white',
    };

    toast.className = `toast px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium ${
      bgColors[type] || bgColors.info
    }`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  },
};

// Global helper accessible to inline onclick handlers
window.addToCartDirect = function (btn) {
  const product = {
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: btn.dataset.price,
    image: btn.dataset.image,
    slug: btn.dataset.slug,
    countInStock: parseInt(btn.dataset.stock, 10),
  };
  Cart.addItem(product, 1);
};

document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
});
