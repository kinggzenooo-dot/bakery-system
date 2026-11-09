/**
 * Fredy Bills Bakery System — Python Backend API Client
 * Enterprise REST API Bridge with token auth and multipart uploads
 */

const API_BASE_URL = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? "http://127.0.0.1:8000/api"
  : `${window.location.origin}/api`;

const API = {
  async fetchJson(endpoint, options = {}) {
    try {
      const token = localStorage.getItem("fb_token");
      const isFormData = options.body instanceof FormData;
      
      const headers = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...(options.headers || {})
      };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP Error ${res.status}`);
      }

      return await res.json();
    } catch (err) {
      console.warn(`[API] ${endpoint} request failed:`, err.message);
      throw err;
    }
  },

  // --- Auth APIs ---
  async login(credentials) {
    const data = await this.fetchJson("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials)
    });
    if (data.access_token) {
      localStorage.setItem("fb_token", data.access_token);
      localStorage.setItem("fb_user", JSON.stringify(data.user));
    }
    return data;
  },

  async register(userData) {
    const data = await this.fetchJson("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData)
    });
    if (data.access_token) {
      localStorage.setItem("fb_token", data.access_token);
      localStorage.setItem("fb_user", JSON.stringify(data.user));
    }
    return data;
  },

  async getMe() {
    return await this.fetchJson("/auth/me");
  },

  // --- Image Upload API ---
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    return await this.fetchJson("/upload/image", {
      method: "POST",
      body: formData
    });
  },

  // --- Categories APIs ---
  async getCategories() {
    return await this.fetchJson("/categories");
  },

  async createCategory(catData) {
    return await this.fetchJson("/categories", {
      method: "POST",
      body: JSON.stringify(catData)
    });
  },

  async updateCategory(catId, catData) {
    return await this.fetchJson(`/categories/${catId}`, {
      method: "PATCH",
      body: JSON.stringify(catData)
    });
  },

  async deleteCategory(catId) {
    return await this.fetchJson(`/categories/${catId}`, {
      method: "DELETE"
    });
  },

  // --- Products APIs ---
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.append("category", params.category);
    if (params.search) query.append("search", params.search);
    if (params.sort) query.append("sort", params.sort);
    if (params.inStockOnly) query.append("in_stock_only", "true");

    const qs = query.toString();
    return await this.fetchJson(`/products${qs ? '?' + qs : ''}`);
  },

  async getProductDetail(id) {
    return await this.fetchJson(`/products/${id}`);
  },

  async createProduct(prodData) {
    return await this.fetchJson("/products", {
      method: "POST",
      body: JSON.stringify(prodData)
    });
  },

  async updateProduct(prodId, prodData) {
    return await this.fetchJson(`/products/${prodId}`, {
      method: "PATCH",
      body: JSON.stringify(prodData)
    });
  },

  async deleteProduct(prodId) {
    return await this.fetchJson(`/products/${prodId}`, {
      method: "DELETE"
    });
  },

  // --- Orders APIs ---
  async createOrder(orderPayload) {
    return await this.fetchJson("/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload)
    });
  },

  async getOrders(email = null) {
    const qs = email ? `?email=${encodeURIComponent(email)}` : "";
    return await this.fetchJson(`/orders${qs}`);
  },

  async getOrder(orderId) {
    return await this.fetchJson(`/orders/${orderId}`);
  },

  async updateOrderStatus(orderId, status, note = "") {
    return await this.fetchJson(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, note })
    });
  },

  // --- Inventory APIs ---
  async getInventory(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append("category", params.category);
    if (params.lowStockOnly) query.append("low_stock_only", "true");
    if (params.search) query.append("search", params.search);

    const qs = query.toString();
    return await this.fetchJson(`/inventory${qs ? '?' + qs : ''}`);
  },

  async createInventoryItem(itemData) {
    return await this.fetchJson("/inventory", {
      method: "POST",
      body: JSON.stringify(itemData)
    });
  },

  async updateInventoryItem(itemId, itemData) {
    return await this.fetchJson(`/inventory/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify(itemData)
    });
  },

  async recordStockTransaction(transData) {
    return await this.fetchJson("/inventory/transaction", {
      method: "POST",
      body: JSON.stringify(transData)
    });
  },

  async getInventoryTransactions(limit = 50) {
    return await this.fetchJson(`/inventory/transactions?limit=${limit}`);
  },

  // --- Production APIs (Baker) ---
  async getProductionTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append("status", params.status);
    if (params.bakerId) query.append("baker_id", params.bakerId);

    const qs = query.toString();
    return await this.fetchJson(`/production${qs ? '?' + qs : ''}`);
  },

  async createProductionTask(taskData) {
    return await this.fetchJson("/production", {
      method: "POST",
      body: JSON.stringify(taskData)
    });
  },

  async updateProductionStatus(taskId, status, completedQty = null, notes = "") {
    const body = { status, notes };
    if (completedQty !== null) body.completed_quantity = completedQty;

    return await this.fetchJson(`/production/${taskId}/status`, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
  },

  // --- Delivery APIs (Delivery Staff) ---
  async getDeliveries(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'All') query.append("status", params.status);
    if (params.staffId) query.append("staff_id", params.staffId);

    const qs = query.toString();
    return await this.fetchJson(`/deliveries${qs ? '?' + qs : ''}`);
  },

  async updateDeliveryStatus(deliveryId, status, failureReason = "", proofNote = "", deliveryStaffId = null) {
    const body = { status };
    if (failureReason) body.failure_reason = failureReason;
    if (proofNote) body.proof_note = proofNote;
    if (deliveryStaffId) body.delivery_staff_id = deliveryStaffId;

    return await this.fetchJson(`/deliveries/${deliveryId}/status`, {
      method: "PATCH",
      body: JSON.stringify(body)
    });
  },

  // --- Supplier & Purchase Order APIs ---
  async getSuppliers() {
    return await this.fetchJson("/suppliers");
  },

  async createSupplier(supData) {
    return await this.fetchJson("/suppliers", {
      method: "POST",
      body: JSON.stringify(supData)
    });
  },

  async getPurchaseOrders(status = null) {
    const qs = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
    return await this.fetchJson(`/purchase-orders${qs}`);
  },

  async createPurchaseOrder(poData) {
    return await this.fetchJson("/purchase-orders", {
      method: "POST",
      body: JSON.stringify(poData)
    });
  },

  async receivePurchaseOrder(poId, items = null) {
    const body = items ? { items } : {};
    return await this.fetchJson(`/purchase-orders/${poId}/receive`, {
      method: "POST",
      body: JSON.stringify(body)
    });
  },

  // --- User / Staff Management APIs (Admin) ---
  async getUsers(params = {}) {
    const query = new URLSearchParams();
    if (params.role && params.role !== 'All') query.append("role", params.role);
    if (params.search) query.append("search", params.search);
    if (params.status) query.append("status", params.status);

    const qs = query.toString();
    return await this.fetchJson(`/users${qs ? '?' + qs : ''}`);
  },

  async createUser(userData) {
    return await this.fetchJson("/users", {
      method: "POST",
      body: JSON.stringify(userData)
    });
  },

  async updateUser(userId, userData) {
    return await this.fetchJson(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(userData)
    });
  },

  async deleteUser(userId) {
    return await this.fetchJson(`/users/${userId}`, {
      method: "DELETE"
    });
  },

  // --- Reports & Payments APIs ---
  async getSalesReport() {
    return await this.fetchJson("/reports/sales");
  },

  async getPayments() {
    return await this.fetchJson("/payments");
  },

  // --- Store, Customers, Settings & Notifications ---
  async getCustomers(search = "") {
    const qs = search ? `?search=${encodeURIComponent(search)}` : "";
    return await this.fetchJson(`/customers${qs}`);
  },

  async getBranches() {
    return await this.fetchJson("/branches");
  },

  async validatePromo(code) {
    return await this.fetchJson("/promo/validate", {
      method: "POST",
      body: JSON.stringify({ code })
    });
  },

  async getNotifications() {
    return await this.fetchJson("/notifications");
  },

  async markNotificationRead(id) {
    return await this.fetchJson(`/notifications/${id}/read`, {
      method: "PATCH"
    });
  },

  async getSettings() {
    return await this.fetchJson("/settings");
  },

  async updateSetting(key, value, description = "") {
    return await this.fetchJson("/settings", {
      method: "POST",
      body: JSON.stringify({ key, value, description })
    });
  }
};

if (typeof window !== "undefined") {
  window.API = API;
}
