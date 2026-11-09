/**
 * Fredy Bills Bakery System - Reactive Central State Manager
 * Synchronizes with FastAPI Python backend & SQLite database across all 5 roles
 */

class BakeryStore {
  constructor() {
    this.subscribers = [];
    
    // Check if user is already authorized
    const storedUser = this.loadFromStorage("fb_user", null);

    // If on main page without session, redirect to login.html
    if (!storedUser && typeof window !== 'undefined' && (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/'))) {
      window.location.href = 'login.html';
    }

    this.state = {
      activeView: "home",
      activeCategory: "all",
      searchQuery: "",
      sortBy: "featured",
      inStockOnly: false,
      selectedProduct: null,
      trackingOrderId: "FB-8942",
      activeOrderForConfirmation: null,
      
      // Authentication & Role state
      currentUser: storedUser,
      selectedSignUpRole: "Customer",

      // Storefront & Operations live data
      categories: window.BAKERY_DATA ? window.BAKERY_DATA.categories : [],
      products: window.BAKERY_DATA ? window.BAKERY_DATA.products : [],
      orders: window.BAKERY_DATA ? window.BAKERY_DATA.initialOrders : [],
      inventory: [],
      productionTasks: [],
      deliveries: [],
      suppliers: [],
      purchaseOrders: [],
      usersList: [],
      customersList: [],
      salesReport: null,
      notifications: [],
      settings: {},
      branches: [],

      // Admin & Sub-views Active Tabs
      adminTab: "dashboard",
      adminProductModalOpen: false,
      adminEditingProduct: null,
      adminCategoryModalOpen: false,
      adminInventoryModalOpen: false,
      adminEditingInventory: null,
      adminRestockModalOpen: false,
      adminRestockItem: null,
      adminUserModalOpen: false,
      adminPOModalOpen: false,
      adminOrderModalOpen: false,
      adminViewingOrder: null,

      // POS / Counter Staff Terminal State
      posCategory: "all",
      posSearch: "",
      posCart: [],
      posCustomerName: "Walk-in Guest",
      posCustomerPhone: "",
      posPaymentMethod: "Cash",
      posCashTendered: 0,
      posDiscountPercent: 0,
      posReceiptModalOpen: false,
      posLastReceipt: null,

      // Baker View State
      bakerFilterStatus: "All",
      bakerActiveTask: null,

      // Delivery Staff View State
      deliveryFilterStatus: "All",
      deliveryIssueModalOpen: false,
      deliveryActiveDelivery: null,

      // Theme & Persisted items
      theme: this.loadFromStorage("fb_theme", "dark"),
      cart: this.loadFromStorage("fb_cart", []),
      favorites: this.loadFromStorage("fb_favorites", ["p101", "p201"]),
      profile: this.loadFromStorage("fb_profile", {
        name: storedUser ? storedUser.name : "Juan Dela Cruz",
        email: storedUser ? storedUser.email : "customer@fredybills.ph",
        phone: "+63 917 123 4567",
        address: "Unit 12B, Horizon Tower, IT Park, Lahug, Cebu City",
        notes: "Ring doorbell twice please."
      }),
      appliedPromo: this.loadFromStorage("fb_promo", null),
      toasts: []
    };

    // Apply theme attribute on boot
    this.applyThemeAttribute(this.state.theme);

    // Initial data synchronization from backend
    this.syncInitialData();
  }

  loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Storage load failed for ${key}:`, e);
      return fallback;
    }
  }

  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage save failed for ${key}:`, e);
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.state));
  }

  applyThemeAttribute(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleTheme() {
    const newTheme = this.state.theme === 'dark' ? 'light' : 'dark';
    this.state.theme = newTheme;
    this.applyThemeAttribute(newTheme);
    this.saveToStorage("fb_theme", newTheme);
    this.showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`);
    this.notify();
  }

  // --- Initial Data Sync from FastAPI Backend ---
  async syncInitialData() {
    try {
      // Sync Categories & Products
      const [cats, prods, branches] = await Promise.all([
        API.getCategories().catch(() => null),
        API.getProducts().catch(() => null),
        API.getBranches().catch(() => null)
      ]);

      if (cats && Array.isArray(cats) && cats.length > 0) this.state.categories = cats;
      if (prods && Array.isArray(prods)) {
        this.state.products = prods;
        if (window.BAKERY_DATA) window.BAKERY_DATA.products = prods;
      }
      if (branches && Array.isArray(branches) && branches.length > 0) this.state.branches = branches;

      // Sync role-specific datasets if authorized
      const role = this.state.currentUser?.role;
      if (role === 'Administrator') {
        this.syncAdminData();
      } else if (role === 'Counter Staff') {
        this.syncPOSData();
      } else if (role === 'Baker') {
        this.syncBakerData();
      } else if (role === 'Delivery Staff') {
        this.syncDeliveryData();
      } else if (role === 'Customer') {
        this.syncCustomerOrders();
      }

      this.notify();
    } catch (err) {
      console.warn("[Store] Sync initial data warning:", err.message);
    }
  }

  async syncAdminData() {
    try {
      const [orders, inventory, prodTasks, deliveries, suppliers, pos, users, sales, notifs] = await Promise.all([
        API.getOrders().catch(() => []),
        API.getInventory().catch(() => []),
        API.getProductionTasks().catch(() => []),
        API.getDeliveries().catch(() => []),
        API.getSuppliers().catch(() => []),
        API.getPurchaseOrders().catch(() => []),
        API.getUsers().catch(() => []),
        API.getSalesReport().catch(() => null),
        API.getNotifications().catch(() => [])
      ]);

      if (orders) this.state.orders = orders;
      if (inventory) this.state.inventory = inventory;
      if (prodTasks) this.state.productionTasks = prodTasks;
      if (deliveries) this.state.deliveries = deliveries;
      if (suppliers) this.state.suppliers = suppliers;
      if (pos) this.state.purchaseOrders = pos;
      if (users) this.state.usersList = users;
      if (sales) this.state.salesReport = sales;
      if (notifs) this.state.notifications = notifs;

      this.notify();
    } catch (err) {
      console.warn("[Admin Sync] Error:", err);
    }
  }

  async syncPOSData() {
    try {
      const [orders, prods, customers] = await Promise.all([
        API.getOrders().catch(() => []),
        API.getProducts().catch(() => []),
        API.getCustomers().catch(() => [])
      ]);
      if (orders) this.state.orders = orders;
      if (prods) this.state.products = prods;
      if (customers) this.state.customersList = customers;
      this.notify();
    } catch (err) {
      console.warn("[POS Sync] Error:", err);
    }
  }

  async syncBakerData() {
    try {
      const tasks = await API.getProductionTasks().catch(() => []);
      if (tasks) this.state.productionTasks = tasks;
      this.notify();
    } catch (err) {
      console.warn("[Baker Sync] Error:", err);
    }
  }

  async syncDeliveryData() {
    try {
      const deliveries = await API.getDeliveries().catch(() => []);
      if (deliveries) this.state.deliveries = deliveries;
      this.notify();
    } catch (err) {
      console.warn("[Delivery Sync] Error:", err);
    }
  }

  async syncCustomerOrders() {
    try {
      const email = this.state.currentUser?.email;
      if (email) {
        const orders = await API.getOrders(email).catch(() => []);
        if (orders && orders.length > 0) this.state.orders = orders;
      }
      this.notify();
    } catch (err) {
      console.warn("[Customer Orders Sync] Error:", err);
    }
  }

  // --- Auth Session Actions ---
  logoutUser() {
    this.state.currentUser = null;
    localStorage.removeItem("fb_user");
    localStorage.removeItem("fb_token");
    this.showToast("Signed out. Redirecting to login...", "info");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 400);
  }

  setView(viewName, params = {}) {
    this.state.activeView = viewName;
    if (params.category) this.state.activeCategory = params.category;
    if (params.orderId) this.state.trackingOrderId = params.orderId;
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.notify();
  }

  setAdminTab(tabName) {
    this.state.adminTab = tabName;
    this.syncAdminData();
    this.notify();
  }

  setCategory(catId) {
    this.state.activeCategory = catId;
    this.notify();
  }

  setSearchQuery(q) {
    this.state.searchQuery = q;
    this.notify();
  }

  setSortBy(val) {
    this.state.sortBy = val;
    this.notify();
  }

  // --- Storefront Product Modal ---
  openProductDetails(productId) {
    const product = this.state.products.find(p => p.id === productId);
    this.state.selectedProduct = product || null;
    this.notify();
  }

  closeProductDetails() {
    this.state.selectedProduct = null;
    this.notify();
  }

  // --- Favorites & Cart ---
  toggleFavorite(productId) {
    const idx = this.state.favorites.indexOf(productId);
    if (idx > -1) {
      this.state.favorites.splice(idx, 1);
      this.showToast("Removed from Favorites");
    } else {
      this.state.favorites.push(productId);
      this.showToast("Saved to Favorites");
    }
    this.saveToStorage("fb_favorites", this.state.favorites);
    this.notify();
  }

  addToCart(product, quantity = 1, options = {}) {
    if (!product) return;
    const existing = this.state.cart.find(item => item.id === product.id && JSON.stringify(item.options || {}) === JSON.stringify(options));
    
    let price = product.price;
    if (options.size && options.size.priceDelta) {
      price += options.size.priceDelta;
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.state.cart.push({
        id: product.id,
        name: product.name,
        price: price,
        unitPrice: price,
        image: product.image,
        category: product.category,
        quantity,
        options
      });
    }

    this.saveToStorage("fb_cart", this.state.cart);
    this.showToast(`Added ${quantity}x "${product.name}" to cart`);
    this.notify();
  }

  updateCartQty(index, newQty) {
    if (newQty <= 0) {
      this.state.cart.splice(index, 1);
    } else {
      this.state.cart[index].quantity = newQty;
    }
    this.saveToStorage("fb_cart", this.state.cart);
    this.notify();
  }

  removeFromCart(index) {
    this.state.cart.splice(index, 1);
    this.saveToStorage("fb_cart", this.state.cart);
    this.showToast("Item removed from cart");
    this.notify();
  }

  clearCart() {
    this.state.cart = [];
    this.saveToStorage("fb_cart", []);
    this.notify();
  }

  getCartCalculations() {
    const subtotal = this.state.cart.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    let discount = 0;
    let deliveryFee = subtotal > 0 ? 80 : 0;

    if (this.state.appliedPromo) {
      if (this.state.appliedPromo.discountPercent) {
        discount = subtotal * (this.state.appliedPromo.discountPercent / 100);
      }
      if (this.state.appliedPromo.freeShipping) {
        deliveryFee = 0;
      }
    }

    const total = Math.max(0, subtotal - discount + deliveryFee);
    const cartCount = this.state.cart.reduce((acc, item) => acc + item.quantity, 0);

    return { subtotal, discount, deliveryFee, total, cartCount };
  }

  async applyPromoCode(codeStr) {
    try {
      const res = await API.validatePromo(codeStr);
      if (res.valid) {
        this.state.appliedPromo = res;
        this.saveToStorage("fb_promo", res);
        this.showToast(res.message || "Promo applied successfully!");
      } else {
        this.showToast(res.message || "Invalid promo code", "error");
      }
      this.notify();
    } catch (err) {
      this.showToast("Failed to validate promo code", "error");
    }
  }

  removePromo() {
    this.state.appliedPromo = null;
    this.saveToStorage("fb_promo", null);
    this.showToast("Promo removed");
    this.notify();
  }

  // --- Customer Order Creation ---
  async createOrder(orderData) {
    try {
      // Build items using the field names the backend schema expects:
      // OrderItemCreate: { id, name, quantity, price, options }
      const items = this.state.cart.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.unitPrice,
        options: i.options || {}
      }));

      // OrderCreate schema (backend) uses camelCase fields
      const payload = {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone || "",
        fulfillmentType: orderData.fulfillmentType || "delivery",
        address: orderData.address || "",
        branchName: orderData.branchName || "",
        paymentMethod: orderData.paymentMethod || "GCash",
        subtotal: orderData.subtotal,
        discount: orderData.discount || 0,
        deliveryFee: orderData.deliveryFee || 0,
        total: orderData.total,
        notes: this.state.appliedPromo?.code ? `Promo: ${this.state.appliedPromo.code}` : "",
        items
      };

      const created = await API.createOrder(payload);

      this.clearCart();
      this.removePromo();
      this.state.activeOrderForConfirmation = created;
      this.state.trackingOrderId = created.id;
      this.state.orders.unshift(created);

      this.showToast(`Order #${created.id} placed successfully!`);
      this.setView("confirmation");
    } catch (err) {
      this.showToast(`Failed to place order: ${err.message}`, "error");
      // Re-enable the place order button on failure
      const btn = document.getElementById('place-order-btn');
      if (btn) { btn.innerHTML = 'Place Order & Confirm'; btn.disabled = false; }
    }
  }

  // --- POS / Counter Staff Terminal Methods ---
  setPOSCategory(cat) {
    this.state.posCategory = cat;
    this.notify();
  }

  setPOSSearch(q) {
    this.state.posSearch = q;
    this.notify();
  }

  addToPOSCart(product) {
    const existing = this.state.posCart.find(i => i.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.state.posCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        unitPrice: product.price,
        quantity: 1
      });
    }
    this.notify();
  }

  updatePOSCartQty(index, newQty) {
    if (newQty <= 0) {
      this.state.posCart.splice(index, 1);
    } else {
      this.state.posCart[index].quantity = newQty;
    }
    this.notify();
  }

  clearPOSCart() {
    this.state.posCart = [];
    this.state.posCustomerName = "Walk-in Guest";
    this.state.posCustomerPhone = "";
    this.state.posDiscountPercent = 0;
    this.state.posCashTendered = 0;
    this.notify();
  }

  getPOSCalculations() {
    const subtotal = this.state.posCart.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);
    const discount = subtotal * (this.state.posDiscountPercent / 100);
    const total = Math.max(0, subtotal - discount);
    const change = Math.max(0, this.state.posCashTendered - total);
    return { subtotal, discount, total, change };
  }

  async submitPOSOrder() {
    if (this.state.posCart.length === 0) {
      this.showToast("POS cart is empty!", "error");
      return;
    }

    const { subtotal, discount, total, change } = this.getPOSCalculations();

    try {
      const items = this.state.posCart.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.unitPrice || i.price,
        options: {}
      }));

      const payload = {
        customerName: this.state.posCustomerName || "Walk-in Guest",
        customerEmail: "pos_walkin@fredybills.ph",
        customerPhone: this.state.posCustomerPhone || "+63 900 000 0000",
        fulfillmentType: "dine-in",
        address: "Counter POS Station 1",
        branchName: "IT Park Cebu Flagship",
        paymentMethod: this.state.posPaymentMethod,
        subtotal: subtotal,
        discount: discount,
        deliveryFee: 0,
        total: total,
        notes: "POS Transaction",
        items
      };

      const created = await API.createOrder(payload);
      
      // Mark as Paid immediately in backend if POS cash or card
      await API.updateOrderStatus(created.id, "confirmed", "POS Completed payment");

      this.state.posLastReceipt = {
        ...created,
        items: this.state.posCart,
        cashTendered: this.state.posCashTendered,
        change: change,
        cashier: this.state.currentUser?.name || "Counter Staff"
      };

      this.state.posReceiptModalOpen = true;
      this.clearPOSCart();
      this.syncPOSData();
      this.showToast(`POS Order #${created.id} completed!`);
      this.notify();
    } catch (err) {
      this.showToast(`POS Transaction Error: ${err.message}`, "error");
    }
  }

  closePOSReceipt() {
    this.state.posReceiptModalOpen = false;
    this.notify();
  }

  // --- Baker Kitchen Queue Actions ---
  async advanceBakerTask(taskId, nextStatus, notes = "") {
    try {
      const updated = await API.updateProductionStatus(taskId, nextStatus, null, notes);
      const idx = this.state.productionTasks.findIndex(t => t.id === taskId);
      if (idx > -1) this.state.productionTasks[idx] = updated;
      
      this.showToast(`Batch #${updated.task_code} updated to ${nextStatus}`);
      this.syncBakerData();
      this.notify();
    } catch (err) {
      this.showToast(`Failed to update production: ${err.message}`, "error");
    }
  }

  // --- Delivery Staff Actions ---
  async advanceDeliveryStatus(deliveryId, nextStatus, failureReason = "", proofNote = "") {
    try {
      const staffId = this.state.currentUser?.id;
      const updated = await API.updateDeliveryStatus(deliveryId, nextStatus, failureReason, proofNote, staffId);
      const idx = this.state.deliveries.findIndex(d => d.id === deliveryId);
      if (idx > -1) this.state.deliveries[idx] = updated;

      this.state.deliveryIssueModalOpen = false;
      this.state.deliveryActiveDelivery = null;
      this.showToast(`Delivery for Order #${updated.order_id} updated to ${nextStatus}`);
      this.syncDeliveryData();
      this.notify();
    } catch (err) {
      this.showToast(`Delivery status error: ${err.message}`, "error");
    }
  }

  openDeliveryIssueModal(delivery) {
    this.state.deliveryActiveDelivery = delivery;
    this.state.deliveryIssueModalOpen = true;
    this.notify();
  }

  closeDeliveryIssueModal() {
    this.state.deliveryIssueModalOpen = false;
    this.state.deliveryActiveDelivery = null;
    this.notify();
  }

  // --- Administrator Product CRUD ---
  async saveProduct(productData, imageFile = null) {
    try {
      let imageUrl = productData.image || '';

      if (imageFile) {
        this.showToast("Uploading product image...", "info");
        try {
          const uploadRes = await API.uploadImage(imageFile);
          if (uploadRes && uploadRes.url) imageUrl = uploadRes.url;
        } catch (uploadErr) {
          this.showToast("Image upload failed, saving without image.", "error");
        }
      }

      const payload = { ...productData, image: imageUrl };

      if (this.state.adminEditingProduct) {
        await API.updateProduct(this.state.adminEditingProduct.id, payload);
        this.showToast(`Product "${payload.name}" updated!`);
      } else {
        await API.createProduct(payload);
        this.showToast(`Product "${payload.name}" added to menu!`);
      }

      this.state.adminProductModalOpen = false;
      this.state.adminEditingProduct = null;
      this.notify(); // close modal immediately

      // Fetch fresh products list then re-render
      try {
        const freshProds = await API.getProducts();
        if (Array.isArray(freshProds)) {
          this.state.products = freshProds;
          if (window.BAKERY_DATA) window.BAKERY_DATA.products = freshProds;
          this.notify();
        }
      } catch (e) {
        await this.syncInitialData();
      }
    } catch (err) {
      this.showToast(`Product Save Failed: ${err.message}`, "error");
    }
  }

  async deleteProduct(productId) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.deleteProduct(productId);
      this.showToast("Product deleted successfully");
      await this.syncInitialData();
      this.syncAdminData();
    } catch (err) {
      this.showToast(`Delete failed: ${err.message}`, "error");
    }
  }

  // --- Administrator Inventory Actions ---
  async saveInventoryItem(itemData) {
    try {
      if (this.state.adminEditingInventory) {
        await API.updateInventoryItem(this.state.adminEditingInventory.id, itemData);
        this.showToast(`Inventory item updated!`);
      } else {
        await API.createInventoryItem(itemData);
        this.showToast(`Inventory item added!`);
      }
      this.state.adminInventoryModalOpen = false;
      this.state.adminEditingInventory = null;
      this.syncAdminData();
    } catch (err) {
      this.showToast(`Inventory Save Failed: ${err.message}`, "error");
    }
  }

  async restockInventoryItem(itemId, qty, cost, notes = "") {
    try {
      await API.recordStockTransaction({
        inventory_item_id: itemId,
        transaction_type: "IN",
        quantity: parseFloat(qty),
        unit_price: parseFloat(cost),
        notes: notes || "Manual Restock Inflow"
      });
      this.showToast("Stock added successfully!");
      this.state.adminRestockModalOpen = false;
      this.state.adminRestockItem = null;
      this.syncAdminData();
    } catch (err) {
      this.showToast(`Restock Failed: ${err.message}`, "error");
    }
  }

  // --- Purchase Orders ---
  async receivePurchaseOrder(poId) {
    try {
      await API.receivePurchaseOrder(poId);
      this.showToast(`PO #${poId} received and inventory updated!`);
      this.syncAdminData();
    } catch (err) {
      this.showToast(`PO Receive Failed: ${err.message}`, "error");
    }
  }

  // --- Staff User Management ---
  async createStaffUser(userData) {
    try {
      await API.createUser(userData);
      this.showToast(`Staff account for "${userData.name}" created!`);
      this.state.adminUserModalOpen = false;
      this.syncAdminData();
    } catch (err) {
      this.showToast(`User Creation Failed: ${err.message}`, "error");
    }
  }

  async deleteStaffUser(userId) {
    if (!confirm("Are you sure you want to remove this staff user?")) return;
    try {
      await API.deleteUser(userId);
      this.showToast("User deleted");
      this.syncAdminData();
    } catch (err) {
      this.showToast(`Delete User Failed: ${err.message}`, "error");
    }
  }

  // --- Toast Notifications ---
  showToast(message, type = "success") {
    const id = Date.now() + Math.random();
    this.state.toasts.push({ id, message, type });
    this.notify();
    setTimeout(() => {
      this.state.toasts = this.state.toasts.filter(t => t.id !== id);
      this.notify();
    }, 4000);
  }
}

// Instantiate global store
const store = new BakeryStore();
if (typeof window !== "undefined") {
  window.store = store;
}
