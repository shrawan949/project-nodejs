// Nexus E-Commerce Client-side Shopping Cart Engine
const CART_STORAGE_KEY = 'nexus_cart_v1';
const COUPON_STORAGE_KEY = 'nexus_applied_coupon';
const RECENTLY_VIEWED_KEY = 'nexus_recently_viewed';

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
    // Also clear legacy key
    sessionStorage.removeItem('nexus_coupon');
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

// ──────────────────────────────────────────────
// Recently Viewed Products
// ──────────────────────────────────────────────
const RecentlyViewed = {
  getItems() {
    try {
      const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  addItem(product) {
    if (!product || !product.id) return;
    let items = this.getItems();
    // Remove if already viewed, put at front
    items = items.filter((i) => i.id !== product.id);
    items.unshift({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
    });
    // Keep max 12
    if (items.length > 12) items = items.slice(0, 12);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(items));
  },

  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = this.getItems();
    if (items.length === 0) {
      container.closest('.recently-viewed-section')?.classList.add('hidden');
      return;
    }
    container.innerHTML = items
      .slice(0, 6)
      .map(
        (item) => `
      <a href="/product/${item.slug}" class="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
        <div class="aspect-square overflow-hidden bg-slate-50">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy">
        </div>
        <div class="p-3">
          <p class="text-xs font-bold text-slate-800 truncate">${item.name}</p>
          <p class="text-xs font-bold text-primary-600 mt-1">$${Number(item.price).toFixed(2)}</p>
        </div>
      </a>
    `
      )
      .join('');
  },
};

// ──────────────────────────────────────────────
// Search Autocomplete
// ──────────────────────────────────────────────
function initSearchAutocomplete() {
  const searchInputs = document.querySelectorAll('input[name="keyword"]');
  searchInputs.forEach((input) => {
    const form = input.closest('form');
    if (!form) return;

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'search-autocomplete hidden absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-80 overflow-y-auto';
    const wrapper = form.closest('.relative') || form;
    if (getComputedStyle(wrapper).position === 'static') {
      wrapper.style.position = 'relative';
    }
    wrapper.appendChild(dropdown);

    let debounceTimer;

    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      const query = input.value.trim();
      if (query.length < 2) {
        dropdown.classList.add('hidden');
        return;
      }
      debounceTimer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/v1/products/autocomplete?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          if (data.suggestions && data.suggestions.length > 0) {
            dropdown.innerHTML = data.suggestions
              .map(
                (s) => `
              <a href="/product/${s.slug}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                <img src="${s.image}" alt="" class="w-9 h-9 rounded-lg object-cover bg-slate-100 shrink-0">
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-800 truncate">${s.name}</p>
                  <p class="text-[10px] text-slate-400">${s.brand} · ${s.category}</p>
                </div>
                <span class="text-xs font-bold text-primary-600 shrink-0">$${s.price.toFixed(2)}</span>
              </a>
            `
              )
              .join('');
            dropdown.innerHTML += `
              <a href="/shop?keyword=${encodeURIComponent(query)}" class="block px-4 py-2.5 text-xs font-bold text-primary-600 hover:bg-primary-50 border-t border-slate-100 text-center">
                View all results for "${query}" →
              </a>
            `;
            dropdown.classList.remove('hidden');
          } else {
            dropdown.innerHTML = `<div class="px-4 py-3 text-xs text-slate-400 text-center">No products found for "${query}"</div>`;
            dropdown.classList.remove('hidden');
          }
        } catch {
          dropdown.classList.add('hidden');
        }
      }, 300);
    });

    // Hide on blur (with delay so clicks register)
    input.addEventListener('blur', () => {
      setTimeout(() => dropdown.classList.add('hidden'), 200);
    });

    // Show on focus if has content
    input.addEventListener('focus', () => {
      if (dropdown.innerHTML && input.value.trim().length >= 2) {
        dropdown.classList.remove('hidden');
      }
    });
  });
}

// ──────────────────────────────────────────────
// Global helpers
// ──────────────────────────────────────────────

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

// Wishlist toggle (requires authentication)
window.toggleWishlist = async function (btn, productId) {
  try {
    const res = await fetch('/api/v1/wishlist/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    if (res.status === 401) {
      Cart.showToast('Please sign in to use the wishlist', 'info');
      return;
    }

    const data = await res.json();
    if (res.ok) {
      const added = data.action === 'added';
      Cart.showToast(added ? 'Added to wishlist!' : 'Removed from wishlist', added ? 'success' : 'info');
      // Update the icon if button element is provided
      if (btn) {
        const icon = btn.querySelector('i');
        if (icon) {
          if (added) {
            icon.className = 'fas fa-heart text-rose-500 text-sm';
          } else {
            icon.className = 'far fa-heart text-slate-500 text-sm';
          }
        }
      }
    } else {
      Cart.showToast(data.message || 'Error updating wishlist', 'error');
    }
  } catch {
    Cart.showToast('Please sign in to use the wishlist', 'info');
  }
};

// Track product view for recently viewed
window.trackProductView = function (product) {
  RecentlyViewed.addItem(product);
};

document.addEventListener('DOMContentLoaded', () => {
  Cart.updateBadge();
  initSearchAutocomplete();

  // Render recently viewed on homepage and product pages
  RecentlyViewed.render('recently-viewed-grid');
});
