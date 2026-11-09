/**
 * Fredy Bills Bakery — Central App Controller & Role Router
 * Routes across 5 roles: Administrator, Counter Staff, Baker, Delivery Staff, and Customer
 */

class App {
  constructor() {
    this.cartOpen = false;
    this.mobileOpen = false;
    this.fulfillment = 'delivery';
  }

  init() {
    store.subscribe(state => this.render(state));
    this.render(store.state);
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    // Sticky header & Parallax scroll
    window.addEventListener('scroll', () => {
      const hdr = document.getElementById('site-header');
      if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 60);
      this.parallaxHero();
    }, { passive: true });

    // Resize handler
    window.addEventListener('resize', () => this.observeReveals(), { passive: true });
  }

  // --- Hero parallax ---
  parallaxHero() {
    const heroBg = document.getElementById('hero-bg');
    if (!heroBg) return;
    const img = heroBg.querySelector('img');
    if (!img) return;
    const scrollY = window.scrollY;
    const heroH = document.getElementById('hero')?.offsetHeight || 800;
    if (scrollY < heroH) {
      const scale = 1 + scrollY * 0.0003;
      const translateY = scrollY * 0.25;
      img.style.transform = `scale(${scale}) translateY(${translateY}px)`;
    }
  }

  // --- IntersectionObserver for reveal animations ---
  observeReveals() {
    const els = document.querySelectorAll('.reveal:not(.visible)');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
  }

  // --- Mobile Navigation ---
  toggleMobile(open) {
    this.mobileOpen = open;
    const nav = document.getElementById('mobile-nav');
    if (nav) nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  // --- Cart Drawer ---
  openCart() {
    this.cartOpen = true;
    store.notify();
    document.body.style.overflow = 'hidden';
  }

  closeCart() {
    this.cartOpen = false;
    store.notify();
    document.body.style.overflow = '';
  }

  // --- Storefront Fulfillment Toggle ---
  setFulfillment(type) {
    this.fulfillment = type;
    const dEl = document.getElementById('del-fields');
    const pEl = document.getElementById('pic-fields');
    const dBtn = document.getElementById('tog-del');
    const pBtn = document.getElementById('tog-pic');
    if (dEl && pEl) {
      dEl.style.display = type === 'delivery' ? 'block' : 'none';
      pEl.style.display = type === 'pickup' ? 'block' : 'none';
    }
    if (dBtn && pBtn) {
      dBtn.classList.toggle('active', type === 'delivery');
      pBtn.classList.toggle('active', type === 'pickup');
    }
  }

  // --- Add product with options from details modal ---
  addCustomized(productId) {
    const product = store.state.products.find(p => p.id === productId);
    if (!product) return;
    const qtyEl = document.getElementById('modal-qty');
    const quantity = qtyEl ? parseInt(qtyEl.textContent) || 1 : 1;
    let options = {};
    const sizeEl = document.getElementById('modal-size');
    if (sizeEl && product.customization && product.customization.sizes) {
      options.size = product.customization.sizes[parseInt(sizeEl.value)];
    }
    store.addToCart(product, quantity, options);
    store.closeProductDetails();
  }

  // --- Customer Checkout submit ---
  submitCheckout() {
    const name = document.getElementById('chk-name').value.trim();
    const phone = document.getElementById('chk-phone').value.trim();
    const email = document.getElementById('chk-email').value.trim();
    const address = document.getElementById('chk-address')?.value.trim() || '';
    const branch = document.getElementById('chk-branch')?.value || '';
    const paymentEl = document.querySelector('input[name="payment"]:checked');
    const paymentMethod = paymentEl ? paymentEl.value : 'GCash';
    const { subtotal, discount, deliveryFee, total } = store.getCartCalculations();

    if (!name || !email) {
      store.showToast("Please provide your name and email.", "error");
      return;
    }

    const btn = document.getElementById('place-order-btn');
    if (btn) {
      btn.innerHTML = 'Submitting Order...';
      btn.disabled = true;
    }

    store.createOrder({
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      fulfillmentType: this.fulfillment,
      address,
      branchName: branch,
      paymentMethod,
      subtotal,
      discount,
      deliveryFee,
      total
    });
  }

  // --- Render Loop & 5 Role Dispatcher ---
  render(state) {
    const el = document.getElementById('app');
    if (!el) return;

    // Check if user is logged in
    const user = state.currentUser;
    if (!user) {
      window.location.href = 'login.html';
      return;
    }

    const role = user.role;

    // 1. ADMINISTRATOR ROLE
    if (role === 'Administrator') {
      el.innerHTML = `
        ${C.AdminApp(state)}
        ${C.Toasts(state)}
      `;
      return;
    }

    // 2. COUNTER STAFF ROLE (POS)
    if (role === 'Counter Staff') {
      el.innerHTML = `
        ${C.CounterStaffApp(state)}
        ${C.Toasts(state)}
      `;
      return;
    }

    // 3. BAKER ROLE
    if (role === 'Baker') {
      el.innerHTML = `
        ${C.BakerApp(state)}
        ${C.Toasts(state)}
      `;
      return;
    }

    // 4. DELIVERY STAFF ROLE
    if (role === 'Delivery Staff') {
      el.innerHTML = `
        ${C.DeliveryStaffApp(state)}
        ${C.Toasts(state)}
      `;
      return;
    }

    // 5. CUSTOMER ROLE (Storefront E-Commerce)
    let content = '';
    switch (state.activeView) {
      case 'home': content = C.Home(state); break;
      case 'menu': content = C.Menu(state); break;
      case 'checkout': content = C.Checkout(state); break;
      case 'confirmation': content = C.Confirmation(state); break;
      case 'track': content = C.Track(state); break;
      case 'orders': content = C.Orders(state); break;
      case 'favorites': content = C.Favorites(state); break;
      default: content = C.Home(state);
    }

    el.innerHTML = `
      ${C.Header(state)}
      ${C.MobileNav(state)}
      <main style="min-height:65vh;">${content}</main>
      ${C.ProductModal(state.selectedProduct, state)}
      ${C.CartDrawer(state)}
      ${C.Toasts(state)}
      ${C.Footer()}
    `;

    // Re-apply animations and scroll state
    requestAnimationFrame(() => {
      this.observeReveals();
      const hdr = document.getElementById('site-header');
      if (hdr) hdr.classList.toggle('scrolled', window.scrollY > 60);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.init();
});
