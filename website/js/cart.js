/* ==========================================================================
   CART & ONLINE ORDERING SYSTEM — FOODWAY FAMILY RESTAURANT
   Uses shared utilities from main.js (openCartDrawer, closeCartDrawer, showToast)
   ========================================================================== */

let cart = JSON.parse(localStorage.getItem('foodway_cart')) || [];

function saveCart() {
  localStorage.setItem('foodway_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(dishId) {
  const dish = window.FOODWAY_MENU?.find(d => d.id === dishId);
  if (!dish) return;

  const existingItem = cart.find(item => item.id === dishId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      qty: 1
    });
  }

  saveCart();
  if (window.FoodwayMain?.openCartDrawer) window.FoodwayMain.openCartDrawer();
  if (window.FoodwayMain?.showToast) window.FoodwayMain.showToast(`Added ${dish.name} to cart!`);
}

function removeFromCart(dishId) {
  cart = cart.filter(item => item.id !== dishId);
  saveCart();
}

function updateQty(dishId, change) {
  const item = cart.find(i => i.id === dishId);
  if (!item) return;

  item.qty += change;
  if (item.qty <= 0) {
    removeFromCart(dishId);
  } else {
    saveCart();
  }
}

function updateCartUI() {
  const badgeCount = document.querySelectorAll('.cart-badge-count');
  const cartContainer = document.getElementById('cartItemsContainer');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartTotalEl = document.getElementById('cartTotal');

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const grandTotal = subtotal + deliveryFee;

  badgeCount.forEach(el => {
    el.textContent = totalItems;
  });

  if (cartContainer) {
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-secondary);">
          <i class="fa-solid fa-basket-shopping" style="font-size: 3rem; color: var(--gold-primary); margin-bottom: 15px;"></i>
          <p>Your cart is empty.</p>
          <a href="menu.html" class="btn btn-outline-gold" style="margin-top: 15px; padding: 8px 16px; font-size: 0.85rem;">Explore Menu</a>
        </div>
      `;
    } else {
      cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div>
            <h4 style="font-size: 0.95rem; color: var(--text-primary);">${item.name}</h4>
            <span style="font-size: 0.85rem; color: var(--gold-primary);">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <button onclick="window.FoodwayCart.updateQty('${item.id}', -1)" style="background: rgba(255,255,255,0.1); width: 26px; height: 26px; border-radius: 4px;">-</button>
            <span>${item.qty}</span>
            <button onclick="window.FoodwayCart.updateQty('${item.id}', 1)" style="background: rgba(255,255,255,0.1); width: 26px; height: 26px; border-radius: 4px;">+</button>
            <button onclick="window.FoodwayCart.removeFromCart('${item.id}')" style="color: #ef5350; margin-left: 6px;"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `).join('');
    }
  }

  if (cartSubtotalEl) cartSubtotalEl.textContent = `₹${subtotal}`;
  if (cartTotalEl) cartTotalEl.textContent = `₹${grandTotal}`;
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  const cartToggleBtns = document.querySelectorAll('.cart-toggle');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const drawerOverlay = document.getElementById('drawerOverlay');

  cartToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.FoodwayMain?.openCartDrawer) window.FoodwayMain.openCartDrawer();
    });
  });

  if (closeCartBtn) closeCartBtn.addEventListener('click', () => {
    if (window.FoodwayMain?.closeCartDrawer) window.FoodwayMain.closeCartDrawer();
  });
  if (drawerOverlay) drawerOverlay.addEventListener('click', () => {
    if (window.FoodwayMain?.closeCartDrawer) window.FoodwayMain.closeCartDrawer();
  });

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        if (window.FoodwayMain?.showToast) window.FoodwayMain.showToast('Your cart is empty! Add dishes to proceed.', 'warning');
        return;
      }
      // Open order confirmation modal (real flow, not a fake toast)
      if (window.FoodwayForms?.showOrderModal) {
        window.FoodwayForms.showOrderModal();
      } else if (window.FoodwayMain?.showToast) {
        window.FoodwayMain.showToast('Order Confirmed! Thank you for ordering from Foodway Family Restaurant.', 'success');
        cart = [];
        saveCart();
        if (window.FoodwayMain?.closeCartDrawer) window.FoodwayMain.closeCartDrawer();
      }
    });
  }
});

// Expose for global access
window.FoodwayCart = {
  addToCart,
  removeFromCart,
  updateQty,
  getCart: () => cart,
  clearCart: () => { cart = []; saveCart(); },
};