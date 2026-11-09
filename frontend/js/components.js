/**
 * Fredy Bills Bakery System — Unified Components Suite
 * Supports all 5 Roles: Customer, Counter Staff, Baker, Delivery Staff, Administrator
 * Strictly NO emojis used in UI (Clean SVG line icons only).
 */

const C = {

  // ==========================================
  // SHARED STAFF HEADER
  // ==========================================
  StaffHeader(state) {
    const user = state.currentUser || { name: "Staff Member", role: "Staff" };
    return `
      <header class="staff-header" id="site-header">
        <div class="staff-header-inner">
          <div class="staff-brand">
            <span class="logo-text">Fredy Bills<span class="logo-dot">.</span></span>
            <span class="staff-role-tag">${user.role} Portal</span>
          </div>

          <div class="staff-header-actions">
            <!-- Dark / Light Theme Toggle -->
            <button class="action-icon" title="Toggle Theme" onclick="store.toggleTheme();">
              ${state.theme === 'dark' ? Icons.sun() : Icons.moon()}
            </button>

            <!-- User Info -->
            <div class="staff-user-chip">
              <div class="staff-user-avatar">${Icons.user()}</div>
              <div class="staff-user-meta">
                <span class="staff-user-name">${user.name}</span>
                <span class="staff-user-sub">${user.role}</span>
              </div>
            </div>

            <!-- Sign Out -->
            <button class="btn btn-outline btn-sm" onclick="store.logoutUser();" style="gap:0.4rem;">
              ${Icons.logout()} Sign Out
            </button>
          </div>
        </div>
      </header>
    `;
  },

  // ==========================================
  // 1. ADMINISTRATOR PORTAL (AdminApp)
  // ==========================================
  AdminApp(state) {
    const tab = state.adminTab || 'dashboard';

    return `
      <div class="admin-layout">
        <!-- Staff Topbar -->
        ${C.StaffHeader(state)}

        <div class="admin-body">
          <!-- Sidebar Navigation -->
          <aside class="admin-sidebar">
            <div class="admin-sidebar-menu">
              <button class="admin-nav-item ${tab==='dashboard'?'active':''}" onclick="store.setAdminTab('dashboard');">
                ${Icons.dashboard()} <span>Dashboard</span>
              </button>
              <button class="admin-nav-item ${tab==='orders'?'active':''}" onclick="store.setAdminTab('orders');">
                ${Icons.clipboard()} <span>Orders</span>
              </button>
              <button class="admin-nav-item ${tab==='products'?'active':''}" onclick="store.setAdminTab('products');">
                ${Icons.box()} <span>Products</span>
              </button>
              <button class="admin-nav-item ${tab==='categories'?'active':''}" onclick="store.setAdminTab('categories');">
                ${Icons.tag()} <span>Categories</span>
              </button>
              <button class="admin-nav-item ${tab==='inventory'?'active':''}" onclick="store.setAdminTab('inventory');">
                ${Icons.package()} <span>Raw Inventory</span>
              </button>
              <button class="admin-nav-item ${tab==='production'?'active':''}" onclick="store.setAdminTab('production');">
                ${Icons.chefHat()} <span>Production Queue</span>
              </button>
              <button class="admin-nav-item ${tab==='deliveries'?'active':''}" onclick="store.setAdminTab('deliveries');">
                ${Icons.truck()} <span>Courier Dispatch</span>
              </button>
              <button class="admin-nav-item ${tab==='sales'?'active':''}" onclick="store.setAdminTab('sales');">
                ${Icons.chart()} <span>Sales & Ledger</span>
              </button>
              <button class="admin-nav-item ${tab==='suppliers'?'active':''}" onclick="store.setAdminTab('suppliers');">
                ${Icons.wallet()} <span>Suppliers & POs</span>
              </button>
              <button class="admin-nav-item ${tab==='users'?'active':''}" onclick="store.setAdminTab('users');">
                ${Icons.users()} <span>Staff Accounts</span>
              </button>
            </div>
          </aside>

          <!-- Main Admin View Area -->
          <main class="admin-content">
            ${(() => {
              switch(tab) {
                case 'dashboard': return C.AdminDashboardView(state);
                case 'orders': return C.AdminOrdersView(state);
                case 'products': return C.AdminProductsView(state);
                case 'categories': return C.AdminCategoriesView(state);
                case 'inventory': return C.AdminInventoryView(state);
                case 'production': return C.AdminProductionView(state);
                case 'deliveries': return C.AdminDeliveriesView(state);
                case 'sales': return C.AdminSalesView(state);
                case 'suppliers': return C.AdminSuppliersView(state);
                case 'users': return C.AdminUsersView(state);
                default: return C.AdminDashboardView(state);
              }
            })()}
          </main>
        </div>

        <!-- Admin Modals -->
        ${C.AdminProductModal(state)}
        ${C.AdminCategoryModal(state)}
        ${C.AdminInventoryModal(state)}
        ${C.AdminRestockModal(state)}
        ${C.AdminUserModal(state)}
        ${C.AdminPOModal(state)}
        ${C.AdminOrderDetailsModal(state)}
      </div>
    `;
  },

  // ADMIN: Dashboard View
  AdminDashboardView(state) {
    const orders = state.orders || [];
    const products = state.products || [];
    const inventory = state.inventory || [];
    const prodTasks = state.productionTasks || [];
    const sales = state.salesReport || {};

    const totalRev = sales.total_revenue || orders.reduce((acc, o) => acc + (o.status !== 'cancelled' ? o.total : 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    const lowStockItems = inventory.filter(i => i.is_low_stock || (i.current_stock <= i.minimum_stock));
    const activeBakes = prodTasks.filter(t => t.status !== 'Completed').length;

    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Executive Dashboard</h1>
          <p class="view-sub">Real-time bakery operations, live revenue, and kitchen inventory.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline btn-sm" onclick="store.syncAdminData();">${Icons.refresh()} Refresh Data</button>
        </div>
      </div>

      <!-- KPI Stat Cards -->
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-icon">${Icons.chart()}</div>
          <div class="stat-meta">
            <span class="stat-label">Total Gross Revenue</span>
            <span class="stat-val">&#8369;${totalRev.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            <span class="stat-note positive">Live SQLite Financial Ledger</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">${Icons.clipboard()}</div>
          <div class="stat-meta">
            <span class="stat-label">Active Orders</span>
            <span class="stat-val">${orders.length}</span>
            <span class="stat-note">${pendingOrders} pending fulfillment</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">${Icons.chefHat()}</div>
          <div class="stat-meta">
            <span class="stat-label">Kitchen Production</span>
            <span class="stat-val">${activeBakes} Batches</span>
            <span class="stat-note">Live Baker Queue</span>
          </div>
        </div>

        <div class="stat-card ${lowStockItems.length > 0 ? 'alert' : ''}">
          <div class="stat-icon">${Icons.alertCircle()}</div>
          <div class="stat-meta">
            <span class="stat-label">Low Stock Alerts</span>
            <span class="stat-val">${lowStockItems.length} Items</span>
            <span class="stat-note ${lowStockItems.length > 0 ? 'negative' : ''}">Action Required</span>
          </div>
        </div>
      </div>

      <!-- Two Column Layout: Low Stock + Recent Orders -->
      <div class="dash-grid" style="margin-top:2rem;">
        <!-- Left: Low Stock Materials -->
        <div class="dash-panel">
          <div class="panel-header">
            <h3>${Icons.package()} Low Stock Raw Ingredients</h3>
            <button class="btn-text" onclick="store.setAdminTab('inventory');">Manage Inventory ${Icons.arrowRight()}</button>
          </div>
          <div class="panel-body">
            ${lowStockItems.length > 0 ? `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Current</th>
                    <th>Min Level</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${lowStockItems.slice(0, 5).map(item => `
                    <tr>
                      <td><strong>${item.item_name}</strong></td>
                      <td>${item.category}</td>
                      <td><span class="badge badge-danger">${item.current_stock} ${item.unit}</span></td>
                      <td>${item.minimum_stock} ${item.unit}</td>
                      <td>
                        <button class="btn btn-outline btn-xs" onclick="store.state.adminRestockItem=${JSON.stringify(item).replace(/"/g, '&quot;')};store.state.adminRestockModalOpen=true;store.notify();">Restock</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            ` : `
              <div class="empty-panel">
                ${Icons.checkCircle()}
                <p>All inventory raw materials are above threshold levels.</p>
              </div>
            `}
          </div>
        </div>

        <!-- Right: Recent Live Orders -->
        <div class="dash-panel">
          <div class="panel-header">
            <h3>${Icons.clipboard()} Recent Orders</h3>
            <button class="btn-text" onclick="store.setAdminTab('orders');">View All Orders ${Icons.arrowRight()}</button>
          </div>
          <div class="panel-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${orders.slice(0, 5).map(o => `
                  <tr>
                    <td><strong>#${o.id}</strong></td>
                    <td>${o.customer_name}</td>
                    <td>&#8369;${o.total.toLocaleString()}</td>
                    <td><span class="status-pill status-${o.status}">${o.status}</span></td>
                    <td>
                      <button class="btn btn-outline btn-xs" onclick="store.state.adminViewingOrder=${JSON.stringify(o).replace(/"/g, '&quot;')};store.state.adminOrderModalOpen=true;store.notify();">Inspect</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // ADMIN: Orders View
  AdminOrdersView(state) {
    const orders = state.orders || [];

    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Order Management</h1>
          <p class="view-sub">Track, inspect, and update customer and walk-in sales orders.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline btn-sm" onclick="store.syncAdminData();">${Icons.refresh()} Refresh</button>
        </div>
      </div>

      <div class="card-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Channel</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map(o => `
              <tr>
                <td><strong>#${o.id}</strong></td>
                <td>
                  <div><strong>${o.customer_name}</strong></div>
                  <div style="font-size:0.8rem;color:var(--c-muted);">${o.customer_phone || o.customer_email || ''}</div>
                </td>
                <td><span class="badge">${o.fulfillment_type || 'Delivery'}</span></td>
                <td>${(o.items || []).map(i => `${i.quantity}x ${i.product_name}`).join(', ') || 'Bakery Items'}</td>
                <td><strong>&#8369;${o.total.toLocaleString()}</strong></td>
                <td><span class="badge badge-success">${o.payment_method || 'GCash'} (${o.payment_status || 'Paid'})</span></td>
                <td><span class="status-pill status-${o.status}">${o.status}</span></td>
                <td>
                  <button class="btn btn-outline btn-xs" onclick="store.state.adminViewingOrder=${JSON.stringify(o).replace(/"/g, '&quot;')};store.state.adminOrderModalOpen=true;store.notify();">
                    ${Icons.eye()} View & Update
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ADMIN: Products View (With Image Upload Support)
  AdminProductsView(state) {
    const products = state.products || [];

    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Product Catalog</h1>
          <p class="view-sub">Manage bakery products, live prices, inventory stock, and upload product photos.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-fill btn-sm" onclick="
            (async () => {
              if (!store.state.categories || store.state.categories.length === 0) {
                try {
                  const cats = await API.getCategories();
                  if (cats && cats.length) store.state.categories = cats;
                } catch(e) {}
              }
              if (!store.state.categories || store.state.categories.length === 0) {
                store.showToast('Categories not loaded yet. Please wait and try again.', 'error');
                return;
              }
              store.state.adminEditingProduct = null;
              store.state.adminProductModalOpen = true;
              store.notify();
            })();
          ">
            ${Icons.plus()} Add New Product
          </button>
        </div>
      </div>

      <div class="card-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Retail Price</th>
              <th>Cost Price</th>
              <th>Stock Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(p => `
              <tr>
                <td>
                  <div class="tbl-img-wrap">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100';">
                  </div>
                </td>
                <td>
                  <strong>${p.name}</strong>
                  ${p.badge ? `<span class="tbl-badge">${p.badge}</span>` : ''}
                  <div style="font-size:0.8rem;color:var(--c-muted);">${p.shortDescription || ''}</div>
                </td>
                <td>${p.category}</td>
                <td><strong>&#8369;${p.price.toLocaleString()}</strong></td>
                <td>&#8369;${(p.cost_price || (p.price * 0.4)).toLocaleString()}</td>
                <td><strong>${p.stock_quantity || (p.in_stock ? 50 : 0)} pcs</strong></td>
                <td>
                  <span class="badge ${p.in_stock ? 'badge-success' : 'badge-danger'}">
                    ${p.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <div style="display:flex;gap:0.4rem;">
                    <button class="btn btn-outline btn-xs" onclick="store.state.adminEditingProduct=${JSON.stringify(p).replace(/"/g, '&quot;')};store.state.adminProductModalOpen=true;store.notify();">
                      ${Icons.edit()} Edit
                    </button>
                    <button class="btn btn-outline btn-xs btn-danger" onclick="store.deleteProduct('${p.id}');">
                      ${Icons.trash()}
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ADMIN: Categories View
  AdminCategoriesView(state) {
    const cats = state.categories || [];
    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Product Categories</h1>
          <p class="view-sub">Organize artisanal bakery catalog groupings.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-fill btn-sm" onclick="store.state.adminCategoryModalOpen=true;store.notify();">
            ${Icons.plus()} Add Category
          </button>
        </div>
      </div>

      <div class="card-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Image URL</th>
            </tr>
          </thead>
          <tbody>
            ${cats.map(c => `
              <tr>
                <td><code>${c.id}</code></td>
                <td><strong>${c.name}</strong></td>
                <td>${c.description || 'N/A'}</td>
                <td><div style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.8rem;color:var(--c-muted);">${c.image}</div></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ADMIN: Raw Inventory View
  AdminInventoryView(state) {
    const inventory = state.inventory || [];
    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Raw Material Inventory</h1>
          <p class="view-sub">Track flour, butter, dairy, yeast, sugar, packaging materials, and log stock inflows.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-fill btn-sm" onclick="store.state.adminEditingInventory=null;store.state.adminInventoryModalOpen=true;store.notify();">
            ${Icons.plus()} Add Raw Material
          </button>
        </div>
      </div>

      <div class="card-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Material Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Min Threshold</th>
              <th>Unit Cost</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.map(item => `
              <tr>
                <td><strong>${item.item_name}</strong></td>
                <td>${item.category}</td>
                <td><strong>${item.current_stock} ${item.unit}</strong></td>
                <td>${item.minimum_stock} ${item.unit}</td>
                <td>&#8369;${item.unit_cost.toFixed(2)}</td>
                <td>${item.supplier_name || 'N/A'}</td>
                <td>
                  <span class="badge ${item.is_low_stock ? 'badge-danger' : 'badge-success'}">
                    ${item.is_low_stock ? 'Low Stock Alert' : 'Optimal'}
                  </span>
                </td>
                <td>
                  <div style="display:flex;gap:0.4rem;">
                    <button class="btn btn-outline btn-xs" onclick="store.state.adminRestockItem=${JSON.stringify(item).replace(/"/g, '&quot;')};store.state.adminRestockModalOpen=true;store.notify();">
                      Restock +
                    </button>
                    <button class="btn btn-outline btn-xs" onclick="store.state.adminEditingInventory=${JSON.stringify(item).replace(/"/g, '&quot;')};store.state.adminInventoryModalOpen=true;store.notify();">
                      ${Icons.edit()} Edit
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ADMIN: Kitchen Production View
  AdminProductionView(state) {
    const tasks = state.productionTasks || [];
    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Kitchen Production Monitoring</h1>
          <p class="view-sub">Live baking queue, recipe ingredient consumption, and finished goods replenishment.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline btn-sm" onclick="store.syncAdminData();">${Icons.refresh()} Refresh Queue</button>
        </div>
      </div>

      <div class="card-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Task Code</th>
              <th>Product Target</th>
              <th>Assigned Baker</th>
              <th>Target Qty</th>
              <th>Completed</th>
              <th>Status</th>
              <th>Ingredients Linkage</th>
            </tr>
          </thead>
          <tbody>
            ${tasks.map(t => `
              <tr>
                <td><strong>${t.task_code}</strong></td>
                <td><strong>${t.product_name}</strong></td>
                <td>${t.baker_name || 'Baker Chef'}</td>
                <td>${t.target_quantity} pcs</td>
                <td>${t.completed_quantity || 0} pcs</td>
                <td><span class="status-pill status-${t.status.toLowerCase()}">${t.status}</span></td>
                <td>
                  <div style="font-size:0.8rem;color:var(--c-muted);">
                    ${(t.ingredients || []).map(i => `${i.item_name} (${i.required_quantity} ${i.unit})`).join(', ') || 'Standard Recipe'}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ADMIN: Courier Dispatch & Deliveries View
  AdminDeliveriesView(state) {
    const deliveries = state.deliveries || [];
    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Courier Dispatch & Deliveries</h1>
          <p class="view-sub">Live monitoring of customer orders assigned to Delivery Staff.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-outline btn-sm" onclick="store.syncAdminData();">${Icons.refresh()} Refresh</button>
        </div>
      </div>

      <div class="card-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Delivery #</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Assigned Courier</th>
              <th>Status</th>
              <th>Notes / Proof</th>
            </tr>
          </thead>
          <tbody>
            ${deliveries.map(d => `
              <tr>
                <td><strong>#${d.id}</strong></td>
                <td><strong>#${d.order_id}</strong></td>
                <td>
                  <div><strong>${d.customer_name}</strong></div>
                  <div style="font-size:0.8rem;color:var(--c-muted);">${d.customer_phone || ''}</div>
                </td>
                <td style="max-width:240px;">${d.delivery_address}</td>
                <td><strong>${d.delivery_staff_name || 'Unassigned Courier'}</strong></td>
                <td><span class="status-pill status-${d.status.toLowerCase().replace(/\s+/g, '-')}">${d.status}</span></td>
                <td>
                  ${d.failure_reason ? `<span class="badge badge-danger">Issue: ${d.failure_reason}</span>` : ''}
                  ${d.proof_note ? `<div style="font-size:0.8rem;color:var(--c-muted);">${d.proof_note}</div>` : ''}
                  ${!d.failure_reason && !d.proof_note ? 'Normal' : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ADMIN: Financial Sales & Ledger View
  AdminSalesView(state) {
    const sales = state.salesReport || {
      total_revenue: 0,
      total_orders: 0,
      total_customers: 0,
      net_profit: 0,
      daily_sales: [],
      top_selling_products: [],
      sales_by_category: []
    };

    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Sales Analytics & Financial Ledger</h1>
          <p class="view-sub">Consolidated business revenue, gross profits, and top artisanal sellers.</p>
        </div>
      </div>

      <!-- Financial Metrics -->
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-icon">${Icons.wallet()}</div>
          <div class="stat-meta">
            <span class="stat-label">Total Gross Sales</span>
            <span class="stat-val">&#8369;${(sales.total_revenue || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            <span class="stat-note positive">Orders Completed</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">${Icons.chart()}</div>
          <div class="stat-meta">
            <span class="stat-label">Estimated Gross Profit</span>
            <span class="stat-val">&#8369;${(sales.net_profit || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
            <span class="stat-note positive">58% Margin</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">${Icons.box()}</div>
          <div class="stat-meta">
            <span class="stat-label">Products Sold</span>
            <span class="stat-val">${sales.total_products_sold || 0} Units</span>
            <span class="stat-note">Across all channels</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">${Icons.users()}</div>
          <div class="stat-meta">
            <span class="stat-label">Active Customer Accounts</span>
            <span class="stat-val">${sales.total_customers || 0}</span>
            <span class="stat-note">Registered patrons</span>
          </div>
        </div>
      </div>

      <!-- Breakdown Grid -->
      <div class="dash-grid" style="margin-top:2rem;">
        <!-- Top Products -->
        <div class="dash-panel">
          <div class="panel-header">
            <h3>Top Selling Bakery Creations</h3>
          </div>
          <div class="panel-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${(sales.top_selling_products || []).map(p => `
                  <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.units_sold} pcs</td>
                    <td><strong>&#8369;${p.revenue.toLocaleString()}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Revenue by Category -->
        <div class="dash-panel">
          <div class="panel-header">
            <h3>Revenue by Category</h3>
          </div>
          <div class="panel-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Revenue Generated</th>
                </tr>
              </thead>
              <tbody>
                ${(sales.sales_by_category || []).map(c => `
                  <tr>
                    <td><strong>${c.category}</strong></td>
                    <td><strong>&#8369;${c.revenue.toLocaleString()}</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // ADMIN: Suppliers & Purchase Orders
  AdminSuppliersView(state) {
    const suppliers = state.suppliers || [];
    const pos = state.purchaseOrders || [];

    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Suppliers & Purchase Orders</h1>
          <p class="view-sub">Supplier vendor database and inventory restocking shipments.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-fill btn-sm" onclick="store.state.adminPOModalOpen=true;store.notify();">
            ${Icons.plus()} Create Purchase Order
          </button>
        </div>
      </div>

      <div class="dash-grid">
        <!-- Suppliers Directory -->
        <div class="dash-panel">
          <div class="panel-header">
            <h3>${Icons.users()} Supplier Directory</h3>
          </div>
          <div class="panel-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Contact Person</th>
                  <th>Phone / Email</th>
                  <th>Lead Time</th>
                </tr>
              </thead>
              <tbody>
                ${suppliers.map(s => `
                  <tr>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.contact_person || 'N/A'}</td>
                    <td>${s.phone || s.email || 'N/A'}</td>
                    <td>${s.lead_time_days || 3} days</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Purchase Orders -->
        <div class="dash-panel">
          <div class="panel-header">
            <h3>${Icons.clipboard()} Active Purchase Orders</h3>
          </div>
          <div class="panel-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>PO #</th>
                  <th>Supplier</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${pos.map(po => `
                  <tr>
                    <td><strong>${po.po_number}</strong></td>
                    <td>${po.supplier_name}</td>
                    <td>&#8369;${po.total_amount.toLocaleString()}</td>
                    <td><span class="status-pill status-${po.status.toLowerCase()}">${po.status}</span></td>
                    <td>
                      ${po.status !== 'Received' ? `
                        <button class="btn btn-outline btn-xs" onclick="store.receivePurchaseOrder(${po.id});">
                          Receive Shipment
                        </button>
                      ` : `
                        <span class="badge badge-success">Completed</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // ADMIN: Staff Users Management
  AdminUsersView(state) {
    const users = state.usersList || [];

    return `
      <div class="view-header">
        <div>
          <h1 class="view-title">Staff & User Management</h1>
          <p class="view-sub">Manage system roles: Counter Staff, Baker, Delivery Staff, and Administrators.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-fill btn-sm" onclick="store.state.adminUserModalOpen=true;store.notify();">
            ${Icons.plus()} Create Staff User
          </button>
        </div>
      </div>

      <div class="card-table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Staff Name</th>
              <th>Email</th>
              <th>System Role</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(u => `
              <tr>
                <td><strong>${u.name}</strong></td>
                <td>${u.email}</td>
                <td><span class="badge badge-role">${u.role}</span></td>
                <td>${u.phone || 'N/A'}</td>
                <td><span class="badge ${u.is_active ? 'badge-success' : 'badge-danger'}">${u.is_active ? 'Active' : 'Suspended'}</span></td>
                <td>
                  <button class="btn btn-outline btn-xs btn-danger" onclick="store.deleteStaffUser(${u.id});">
                    ${Icons.trash()} Remove
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ADMIN: Add/Edit Product Modal with Real Image Upload
  AdminProductModal(state) {
    if (!state.adminProductModalOpen) return '';
    const p = state.adminEditingProduct;
    const cats = state.categories || [];

    return `
      <div class="modal-overlay open" onclick="if(event.target===this){store.state.adminProductModalOpen=false;store.notify();}">
        <div class="modal modal-md">
          <button class="modal-close" onclick="store.state.adminProductModalOpen=false;store.notify();">${Icons.close()}</button>
          <div style="padding:2rem;">
            <h2 class="modal-title" style="margin-bottom:1.5rem;">${p ? 'Edit Bakery Product' : 'Add New Product'}</h2>
            
            <form id="admin-prod-form" onsubmit="event.preventDefault(); C.handleProductSubmit();">
              <div class="form-grp">
                <label>Product ID (Slug) *</label>
                <input type="text" id="p-id" class="form-input" value="${p ? p.id : ''}" ${p ? 'readonly style="opacity:0.6;"' : ''} placeholder="e.g. ube-cake (auto-generated if blank)">
              </div>

              <div class="form-grp">
                <label>Product Name *</label>
                <input type="text" id="p-name" required class="form-input" value="${p ? p.name : ''}" placeholder="e.g. Artisanal Ube Halaya Layer Cake">
              </div>

              <div class="form-row">
                <div class="form-grp">
                  <label>Category *</label>
                  <select id="p-cat" class="form-input" required>
                    ${cats.map(c => `<option value="${c.id}" ${p && (p.category_id===c.id || p.category===c.name) ? 'selected' : ''}>${c.name}</option>`).join('')}
                  </select>
                </div>
                <div class="form-grp">
                  <label>Badge / Tag</label>
                  <input type="text" id="p-badge" class="form-input" value="${p ? (p.badge || '') : ''}" placeholder="e.g. Signature, Best Seller, New">
                </div>
              </div>

              <div class="form-row">
                <div class="form-grp">
                  <label>Retail Price (&#8369;) *</label>
                  <input type="number" step="0.01" id="p-price" required class="form-input" value="${p ? p.price : ''}" placeholder="1250.00">
                </div>
                <div class="form-grp">
                  <label>Cost Price (&#8369;)</label>
                  <input type="number" step="0.01" id="p-cost" class="form-input" value="${p ? (p.cost_price || '') : ''}" placeholder="500.00">
                </div>
              </div>

              <div class="form-row">
                <div class="form-grp">
                  <label>Stock Quantity</label>
                  <input type="number" id="p-stock" class="form-input" value="${p ? (p.stock_quantity || 50) : 50}">
                </div>
                <div class="form-grp">
                  <label>In Stock Status</label>
                  <select id="p-instock" class="form-input">
                    <option value="true" ${!p || p.in_stock ? 'selected' : ''}>In Stock</option>
                    <option value="false" ${p && !p.in_stock ? 'selected' : ''}>Out of Stock</option>
                  </select>
                </div>
              </div>

              <!-- Product Image File Upload / URL -->
              <div class="form-grp">
                <label>Product Photo</label>
                <div class="image-upload-zone" id="img-upload-zone">
                  <input type="file" id="p-file" accept="image/jpeg,image/png,image/webp" style="display:none;" onchange="C.previewUploadImage(this);">
                  <div class="upload-trigger" onclick="document.getElementById('p-file').click();">
                    ${Icons.upload()} <span>Choose Image File (JPEG, PNG, WebP)</span>
                  </div>
                  <div id="img-preview-container" style="margin-top:0.75rem;${p && p.image ? '' : 'display:none;'}">
                    <img id="p-preview-img" src="${p ? p.image : ''}" style="max-height:140px;border-radius:4px;border:1px solid var(--c-border);">
                  </div>
                  <input type="hidden" id="p-img-url" value="${p ? p.image : ''}">
                </div>
              </div>

              <div class="form-grp">
                <label>Short Description</label>
                <input type="text" id="p-shortdesc" class="form-input" value="${p ? (p.shortDescription || '') : ''}" placeholder="Brief 1-line bakery description">
              </div>

              <div class="form-grp">
                <label>Full Description</label>
                <textarea id="p-desc" class="form-input" rows="3" placeholder="Artisan recipe details, flavors, notes">${p ? (p.description || '') : ''}</textarea>
              </div>

              <!-- RECIPE INGREDIENTS — shown in Baker KDS -->
              <div class="form-grp" style="margin-top:1.25rem;">
                <label style="display:flex;align-items:center;justify-content:space-between;">
                  <span>${Icons.chefHat()} Recipe Ingredients <span style="font-size:0.72rem;font-weight:400;color:var(--c-muted);margin-left:0.4rem;">(shown to Baker per batch)</span></span>
                  <button type="button" class="btn btn-outline btn-xs" onclick="C.addRecipeRow();">+ Add Ingredient</button>
                </label>
                <div id="recipe-rows" style="display:flex;flex-direction:column;gap:0.5rem;margin-top:0.5rem;">
                  ${(p && p.recipe && p.recipe.length > 0) ? p.recipe.map((r, ri) => `
                    <div class="recipe-row" style="display:grid;grid-template-columns:1fr 80px 70px 32px;gap:0.4rem;align-items:center;">
                      <input class="form-input form-input-sm recipe-name" placeholder="Ingredient name (e.g. All-purpose Flour)" value="${r.item_name || ''}">
                      <input class="form-input form-input-sm recipe-qty" type="number" step="0.01" min="0.01" placeholder="Qty" value="${r.quantity || 1}">
                      <input class="form-input form-input-sm recipe-unit" placeholder="Unit" value="${r.unit || 'kg'}">
                      <button type="button" class="btn btn-outline btn-xs btn-danger" onclick="this.parentElement.remove();" style="padding:0.3rem;">${Icons.trash()}</button>
                    </div>
                  `).join('') : `
                    <div class="recipe-row" style="display:grid;grid-template-columns:1fr 80px 70px 32px;gap:0.4rem;align-items:center;">
                      <input class="form-input form-input-sm recipe-name" placeholder="Ingredient name (e.g. All-purpose Flour)" value="">
                      <input class="form-input form-input-sm recipe-qty" type="number" step="0.01" min="0.01" placeholder="Qty" value="0.5">
                      <input class="form-input form-input-sm recipe-unit" placeholder="Unit" value="kg">
                      <button type="button" class="btn btn-outline btn-xs btn-danger" onclick="this.parentElement.remove();" style="padding:0.3rem;">${Icons.trash()}</button>
                    </div>
                  `}
                </div>
                <p style="font-size:0.72rem;color:var(--c-muted);margin-top:0.4rem;">Qty is per unit (Baker gets qty x batch size). e.g. 0.5 kg flour per cake.</p>
              </div>

              <div style="display:flex;gap:1rem;margin-top:2rem;">
                <button type="submit" class="btn btn-fill" id="save-prod-btn" style="flex:1;">Save Product</button>
                <button type="button" class="btn btn-outline" onclick="store.state.adminProductModalOpen=false;store.notify();">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  // Handler for product form submit
  handleProductSubmit() {
    let id = document.getElementById('p-id').value.trim();
    const name = document.getElementById('p-name').value.trim();
    const category_id = document.getElementById('p-cat').value;
    const badge = document.getElementById('p-badge').value.trim();
    const price = parseFloat(document.getElementById('p-price').value);
    const cost_price = parseFloat(document.getElementById('p-cost').value) || (price * 0.4);
    const stock_quantity = parseInt(document.getElementById('p-stock').value) || 50;
    const in_stock = document.getElementById('p-instock').value === 'true';
    const short_description = document.getElementById('p-shortdesc').value.trim();
    const description = document.getElementById('p-desc').value.trim();
    const existingUrl = document.getElementById('p-img-url').value;
    const fileInput = document.getElementById('p-file');
    const imageFile = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

    if (!name) {
      alert("Please enter a product name.");
      return;
    }
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid retail price.");
      return;
    }

    // Auto-generate slug ID if blank
    if (!id) {
      id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ('prod-' + Date.now());
    }

    // Collect recipe ingredient rows
    const recipeRows = document.querySelectorAll('#recipe-rows .recipe-row');
    const recipe = [];
    recipeRows.forEach(row => {
      const nameEl = row.querySelector('.recipe-name');
      const qtyEl  = row.querySelector('.recipe-qty');
      const unitEl = row.querySelector('.recipe-unit');
      if (nameEl && nameEl.value.trim()) {
        recipe.push({
          item_name: nameEl.value.trim(),
          quantity: parseFloat(qtyEl?.value) || 1.0,
          unit: unitEl?.value.trim() || 'kg'
        });
      }
    });

    const payload = {
      id,
      name,
      category_id,
      badge,
      price,
      cost_price,
      stock_quantity,
      in_stock,
      short_description,
      description,
      image: existingUrl || "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600",
      recipe
    };

    store.saveProduct(payload, imageFile);
  },

  // Dynamically append a new empty ingredient row
  addRecipeRow() {
    const container = document.getElementById('recipe-rows');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'recipe-row';
    row.style.cssText = 'display:grid;grid-template-columns:1fr 80px 70px 32px;gap:0.4rem;align-items:center;';
    row.innerHTML = `
      <input class="form-input form-input-sm recipe-name" placeholder="Ingredient name (e.g. Whole Eggs)" value="">
      <input class="form-input form-input-sm recipe-qty" type="number" step="0.01" min="0.01" placeholder="Qty" value="1">
      <input class="form-input form-input-sm recipe-unit" placeholder="Unit" value="pcs">
      <button type="button" class="btn btn-outline btn-xs btn-danger" onclick="this.parentElement.remove();" style="padding:0.3rem;">${Icons.trash()}</button>
    `;
    container.appendChild(row);
  },

  previewUploadImage(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = document.getElementById('p-preview-img');
        const container = document.getElementById('img-preview-container');
        if (preview && container) {
          preview.src = e.target.result;
          container.style.display = 'block';
        }
      };
      reader.readAsDataURL(input.files[0]);
    }
  },

  // ADMIN: Category Modal
  AdminCategoryModal(state) {
    if (!state.adminCategoryModalOpen) return '';
    return `
      <div class="modal-overlay open" onclick="if(event.target===this){store.state.adminCategoryModalOpen=false;store.notify();}">
        <div class="modal modal-sm">
          <button class="modal-close" onclick="store.state.adminCategoryModalOpen=false;store.notify();">${Icons.close()}</button>
          <div style="padding:2rem;">
            <h2 class="modal-title" style="margin-bottom:1.5rem;">Add Category</h2>
            <form onsubmit="event.preventDefault(); const id=document.getElementById('c-id').value.trim(); const name=document.getElementById('c-name').value.trim(); const desc=document.getElementById('c-desc').value.trim(); API.createCategory({id,name,description:desc}).then(()=>{store.state.adminCategoryModalOpen=false;store.syncInitialData();store.showToast('Category created!');});">
              <div class="form-grp">
                <label>Category ID Slug *</label>
                <input type="text" id="c-id" required class="form-input" placeholder="e.g. pastries">
              </div>
              <div class="form-grp">
                <label>Category Name *</label>
                <input type="text" id="c-name" required class="form-input" placeholder="e.g. Viennoiserie & Pastries">
              </div>
              <div class="form-grp">
                <label>Description</label>
                <input type="text" id="c-desc" class="form-input" placeholder="e.g. Flaky butter croissants and danishes">
              </div>
              <button type="submit" class="btn btn-fill" style="width:100%;margin-top:1.5rem;">Create Category</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  // ADMIN: Add/Edit Inventory Modal
  AdminInventoryModal(state) {
    if (!state.adminInventoryModalOpen) return '';
    const item = state.adminEditingInventory;
    const suppliers = state.suppliers || [];

    return `
      <div class="modal-overlay open" onclick="if(event.target===this){store.state.adminInventoryModalOpen=false;store.notify();}">
        <div class="modal modal-sm">
          <button class="modal-close" onclick="store.state.adminInventoryModalOpen=false;store.notify();">${Icons.close()}</button>
          <div style="padding:2rem;">
            <h2 class="modal-title" style="margin-bottom:1.5rem;">${item ? 'Edit Raw Material' : 'Add Raw Material'}</h2>
            <form onsubmit="event.preventDefault(); const item_name=document.getElementById('inv-name').value; const category=document.getElementById('inv-cat').value; const unit=document.getElementById('inv-unit').value; const current_stock=parseFloat(document.getElementById('inv-stock').value); const minimum_stock=parseFloat(document.getElementById('inv-min').value); const unit_cost=parseFloat(document.getElementById('inv-cost').value); const supplier_id=parseInt(document.getElementById('inv-sup').value)||null; store.saveInventoryItem({item_name,category,unit,current_stock,minimum_stock,unit_cost,supplier_id});">
              <div class="form-grp">
                <label>Item Name *</label>
                <input type="text" id="inv-name" required class="form-input" value="${item ? item.item_name : ''}" placeholder="e.g. Unbleached Bread Flour">
              </div>
              <div class="form-row">
                <div class="form-grp">
                  <label>Category</label>
                  <select id="inv-cat" class="form-input">
                    <option value="Flour & Grains">Flour & Grains</option>
                    <option value="Dairy & Eggs">Dairy & Eggs</option>
                    <option value="Sugars & Sweeteners">Sugars & Sweeteners</option>
                    <option value="Yeast & Leavening">Yeast & Leavening</option>
                    <option value="Chocolates & Fillings">Chocolates & Fillings</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>
                <div class="form-grp">
                  <label>Unit of Measure</label>
                  <input type="text" id="inv-unit" required class="form-input" value="${item ? item.unit : 'kg'}" placeholder="kg, L, pcs, box">
                </div>
              </div>
              <div class="form-row">
                <div class="form-grp">
                  <label>Initial Stock</label>
                  <input type="number" step="0.1" id="inv-stock" required class="form-input" value="${item ? item.current_stock : '100'}">
                </div>
                <div class="form-grp">
                  <label>Min Alert Level</label>
                  <input type="number" step="0.1" id="inv-min" required class="form-input" value="${item ? item.minimum_stock : '25'}">
                </div>
              </div>
              <div class="form-row">
                <div class="form-grp">
                  <label>Unit Cost (&#8369;)</label>
                  <input type="number" step="0.01" id="inv-cost" required class="form-input" value="${item ? item.unit_cost : '50.00'}">
                </div>
                <div class="form-grp">
                  <label>Supplier</label>
                  <select id="inv-sup" class="form-input">
                    <option value="">None / Local</option>
                    ${suppliers.map(s => `<option value="${s.id}" ${item && item.supplier_id===s.id ? 'selected':''}>${s.name}</option>`).join('')}
                  </select>
                </div>
              </div>
              <button type="submit" class="btn btn-fill" style="width:100%;margin-top:1.5rem;">Save Material</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  // ADMIN: Restock Modal
  AdminRestockModal(state) {
    if (!state.adminRestockModalOpen || !state.adminRestockItem) return '';
    const item = state.adminRestockItem;

    return `
      <div class="modal-overlay open" onclick="if(event.target===this){store.state.adminRestockModalOpen=false;store.notify();}">
        <div class="modal modal-sm">
          <button class="modal-close" onclick="store.state.adminRestockModalOpen=false;store.notify();">${Icons.close()}</button>
          <div style="padding:2rem;">
            <h2 class="modal-title" style="margin-bottom:0.5rem;">Restock Stock Inflow</h2>
            <p style="color:var(--c-muted);font-size:0.9rem;margin-bottom:1.5rem;">Item: <strong>${item.item_name}</strong> (Current: ${item.current_stock} ${item.unit})</p>
            
            <form onsubmit="event.preventDefault(); const qty=document.getElementById('rst-qty').value; const cost=document.getElementById('rst-cost').value; const note=document.getElementById('rst-note').value; store.restockInventoryItem(${item.id}, qty, cost, note);">
              <div class="form-grp">
                <label>Quantity to Inflow (${item.unit}) *</label>
                <input type="number" step="0.1" id="rst-qty" required class="form-input" placeholder="e.g. 50">
              </div>
              <div class="form-grp">
                <label>Unit Cost (&#8369;)</label>
                <input type="number" step="0.01" id="rst-cost" class="form-input" value="${item.unit_cost}">
              </div>
              <div class="form-grp">
                <label>Notes / Reference</label>
                <input type="text" id="rst-note" class="form-input" placeholder="e.g. Direct Supplier Delivery">
              </div>
              <button type="submit" class="btn btn-fill" style="width:100%;margin-top:1.5rem;">Log Inflow & Restock</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  // ADMIN: Create Staff Modal
  AdminUserModal(state) {
    if (!state.adminUserModalOpen) return '';

    return `
      <div class="modal-overlay open" onclick="if(event.target===this){store.state.adminUserModalOpen=false;store.notify();}">
        <div class="modal modal-sm">
          <button class="modal-close" onclick="store.state.adminUserModalOpen=false;store.notify();">${Icons.close()}</button>
          <div style="padding:2rem;">
            <h2 class="modal-title" style="margin-bottom:1.5rem;">Create Staff Account</h2>
            <form onsubmit="event.preventDefault(); const name=document.getElementById('u-name').value; const email=document.getElementById('u-email').value; const password=document.getElementById('u-pass').value; const role=document.getElementById('u-role').value; const phone=document.getElementById('u-phone').value; store.createStaffUser({name,email,password,role,phone});">
              <div class="form-grp">
                <label>Full Name *</label>
                <input type="text" id="u-name" required class="form-input" placeholder="e.g. Chef Marco Reyes">
              </div>
              <div class="form-grp">
                <label>Email Address *</label>
                <input type="email" id="u-email" required class="form-input" placeholder="e.g. marco@fredybills.ph">
              </div>
              <div class="form-grp">
                <label>Password *</label>
                <input type="password" id="u-pass" required class="form-input" placeholder="••••••••">
              </div>
              <div class="form-grp">
                <label>System Role *</label>
                <select id="u-role" class="form-input" required>
                  <option value="Counter Staff">Counter Staff</option>
                  <option value="Baker">Baker</option>
                  <option value="Delivery Staff">Delivery Staff</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>
              <div class="form-grp">
                <label>Phone Number</label>
                <input type="text" id="u-phone" class="form-input" placeholder="+63 917 000 0000">
              </div>
              <button type="submit" class="btn btn-fill" style="width:100%;margin-top:1.5rem;">Create Staff Member</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  // ADMIN: Purchase Order Modal
  AdminPOModal(state) {
    if (!state.adminPOModalOpen) return '';
    const suppliers = state.suppliers || [];
    const inventory = state.inventory || [];

    return `
      <div class="modal-overlay open" onclick="if(event.target===this){store.state.adminPOModalOpen=false;store.notify();}">
        <div class="modal modal-md">
          <button class="modal-close" onclick="store.state.adminPOModalOpen=false;store.notify();">${Icons.close()}</button>
          <div style="padding:2rem;">
            <h2 class="modal-title" style="margin-bottom:1.5rem;">Create Purchase Order</h2>
            <form onsubmit="event.preventDefault(); const supId=parseInt(document.getElementById('po-sup').value); const itemId=parseInt(document.getElementById('po-item').value); const qty=parseFloat(document.getElementById('po-qty').value); const cost=parseFloat(document.getElementById('po-cost').value); const date=document.getElementById('po-date').value; const item=store.state.inventory.find(i=>i.id===itemId); API.createPurchaseOrder({supplier_id:supId,expected_delivery_date:date,items:[{inventory_item_id:itemId,item_name:item?item.item_name:'Raw Material',quantity_ordered:qty,unit_cost:cost}]}).then(()=>{store.state.adminPOModalOpen=false;store.syncAdminData();store.showToast('PO Created!');});">
              <div class="form-grp">
                <label>Supplier Vendor *</label>
                <select id="po-sup" class="form-input" required>
                  ${suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-row">
                <div class="form-grp">
                  <label>Raw Material Item *</label>
                  <select id="po-item" class="form-input" required>
                    ${inventory.map(i => `<option value="${i.id}">${i.item_name} (${i.unit})</option>`).join('')}
                  </select>
                </div>
                <div class="form-grp">
                  <label>Quantity Ordered *</label>
                  <input type="number" step="1" id="po-qty" required class="form-input" value="50">
                </div>
              </div>
              <div class="form-row">
                <div class="form-grp">
                  <label>Unit Cost (&#8369;) *</label>
                  <input type="number" step="0.01" id="po-cost" required class="form-input" value="65.00">
                </div>
                <div class="form-grp">
                  <label>Expected Delivery Date</label>
                  <input type="date" id="po-date" class="form-input">
                </div>
              </div>
              <button type="submit" class="btn btn-fill" style="width:100%;margin-top:1.5rem;">Submit Purchase Order</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  // ADMIN: Order Details Modal
  AdminOrderDetailsModal(state) {
    if (!state.adminOrderModalOpen || !state.adminViewingOrder) return '';
    const o = state.adminViewingOrder;

    return `
      <div class="modal-overlay open" onclick="if(event.target===this){store.state.adminOrderModalOpen=false;store.notify();}">
        <div class="modal modal-md">
          <button class="modal-close" onclick="store.state.adminOrderModalOpen=false;store.notify();">${Icons.close()}</button>
          <div style="padding:2.5rem;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1.5rem;border-bottom:1px solid var(--c-border);padding-bottom:1rem;">
              <div>
                <span class="section-eyebrow">Order Inspection</span>
                <h2 class="modal-title">#${o.id}</h2>
              </div>
              <span class="status-pill status-${o.status}">${o.status}</span>
            </div>

            <div class="form-row" style="margin-bottom:1.5rem;">
              <div>
                <div style="font-size:0.75rem;text-transform:uppercase;color:var(--c-muted);font-weight:600;">Customer</div>
                <div style="font-size:1.1rem;font-weight:700;color:var(--c-cream);">${o.customer_name}</div>
                <div style="font-size:0.85rem;color:var(--c-muted-light);">${o.customer_email} | ${o.customer_phone}</div>
              </div>
              <div>
                <div style="font-size:0.75rem;text-transform:uppercase;color:var(--c-muted);font-weight:600;">Fulfillment</div>
                <div style="font-size:1rem;font-weight:600;color:var(--c-cream);">${o.fulfillment_type || 'Delivery'}</div>
                <div style="font-size:0.85rem;color:var(--c-muted-light);">${o.delivery_address || 'Store Pickup'}</div>
              </div>
            </div>

            <!-- Order Items Table -->
            <div style="margin-bottom:1.5rem;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${(o.items || []).map(i => `
                    <tr>
                      <td><strong>${i.product_name}</strong></td>
                      <td>${i.quantity}</td>
                      <td>&#8369;${i.unit_price.toLocaleString()}</td>
                      <td>&#8369;${(i.quantity * i.unit_price).toLocaleString()}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              <div style="text-align:right;margin-top:1rem;font-size:1.2rem;font-weight:700;color:var(--c-accent-bright);">
                Grand Total: &#8369;${o.total.toLocaleString()}
              </div>
            </div>

            <!-- Status Updater -->
            <div class="form-grp">
              <label>Update Order Status</label>
              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                ${['confirmed', 'baking', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].map(st => `
                  <button class="btn btn-outline btn-xs ${o.status===st?'btn-fill':''}" onclick="API.updateOrderStatus('${o.id}','${st}').then(()=>{store.state.adminOrderModalOpen=false;store.syncAdminData();store.showToast('Order status updated!');});">
                    ${st}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 2. COUNTER STAFF PORTAL (POS & Intake)
  // ==========================================
  CounterStaffApp(state) {
    const cats = [{id:'all', name:'All Items'}, ...(state.categories || [])];
    let prods = [...(state.products || [])];
    
    if (state.posCategory && state.posCategory !== 'all') {
      prods = prods.filter(p => p.category_id === state.posCategory || p.category === state.posCategory);
    }
    if (state.posSearch) {
      const q = state.posSearch.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(q));
    }

    const { subtotal, discount, total, change } = store.getPOSCalculations();

    return `
      <div class="pos-layout">
        ${C.StaffHeader(state)}

        <div class="pos-main">
          <!-- LEFT: Products POS Catalog -->
          <div class="pos-catalog">
            <div class="pos-catalog-top">
              <!-- Search Bar -->
              <div class="search-box" style="flex:1;">
                ${Icons.search()}
                <input type="text" placeholder="Quick Search (e.g. Sourdough, Croissant, Ube)..." value="${state.posSearch}" oninput="store.setPOSSearch(this.value);">
              </div>
              
              <!-- Category Filter Pills -->
              <div class="pills" style="margin-top:1rem;">
                ${cats.map(c => `
                  <button class="pill ${state.posCategory===c.id?'active':''}" onclick="store.setPOSCategory('${c.id}');">
                    ${c.name}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Product Grid -->
            <div class="pos-grid">
              ${prods.map(p => `
                <div class="pos-card" onclick="store.addToPOSCart(${JSON.stringify(p).replace(/"/g, '&quot;')});">
                  <div class="pos-card-img">
                    <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200';">
                  </div>
                  <div class="pos-card-body">
                    <div class="pos-card-name">${p.name}</div>
                    <div class="pos-card-price">&#8369;${p.price.toLocaleString()}</div>
                    <span class="badge ${p.in_stock ? 'badge-success' : 'badge-danger'}" style="font-size:0.65rem;">
                      ${p.in_stock ? 'Available' : 'Out'}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- RIGHT: POS Register & Cart -->
          <div class="pos-sidebar">
            <div class="pos-ticket-header">
              <h3>${Icons.clipboard()} Current Ticket</h3>
              <button class="btn-text" onclick="store.clearPOSCart();" style="color:var(--c-red);font-size:0.8rem;">Clear</button>
            </div>

            <!-- Customer Info -->
            <div class="pos-cust-bar">
              <input type="text" class="form-input" style="padding:0.5rem 0.75rem;font-size:0.85rem;" placeholder="Customer Name (Walk-in Guest)" value="${state.posCustomerName}" oninput="store.state.posCustomerName=this.value;">
            </div>

            <!-- Ticket Items -->
            <div class="pos-items-scroll">
              ${state.posCart.length > 0 ? state.posCart.map((item, idx) => `
                <div class="pos-ticket-item">
                  <div style="flex:1;">
                    <div style="font-weight:600;font-size:0.9rem;color:var(--c-cream);">${item.name}</div>
                    <div style="font-size:0.8rem;color:var(--c-accent);">&#8369;${item.unitPrice.toLocaleString()} each</div>
                  </div>
                  <div class="qty-ctrl">
                    <button onclick="store.updatePOSCartQty(${idx}, ${item.quantity - 1});">${Icons.minus()}</button>
                    <span>${item.quantity}</span>
                    <button onclick="store.updatePOSCartQty(${idx}, ${item.quantity + 1});">${Icons.plus()}</button>
                  </div>
                  <div style="font-weight:700;font-size:0.95rem;color:var(--c-cream);min-width:65px;text-align:right;">
                    &#8369;${(item.unitPrice * item.quantity).toLocaleString()}
                  </div>
                </div>
              `).join('') : `
                <div class="empty-panel" style="padding:3rem 1rem;">
                  ${Icons.cart()}
                  <p>No items in ticket. Click products on the left to add.</p>
                </div>
              `}
            </div>

            <!-- Discount & Payment Controls -->
            <div class="pos-calc-box">
              <div class="pos-line">
                <span>Subtotal</span>
                <span>&#8369;${subtotal.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
              </div>

              <div class="pos-line" style="align-items:center;">
                <span>Discount</span>
                <select class="form-input" style="width:110px;padding:0.3rem 0.5rem;font-size:0.8rem;" onchange="store.state.posDiscountPercent=parseFloat(this.value);store.notify();">
                  <option value="0" ${state.posDiscountPercent===0?'selected':''}>0%</option>
                  <option value="5" ${state.posDiscountPercent===5?'selected':''}>5% Promo</option>
                  <option value="10" ${state.posDiscountPercent===10?'selected':''}>10% VIP</option>
                  <option value="20" ${state.posDiscountPercent===20?'selected':''}>20% Senior/PWD</option>
                </select>
              </div>

              <div class="pos-line total">
                <span>Total Due</span>
                <span>&#8369;${total.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
              </div>

              <!-- Payment Method Selector -->
              <div style="margin-top:1rem;">
                <label style="font-size:0.75rem;font-weight:600;text-transform:uppercase;color:var(--c-muted);">Payment Method</label>
                <div class="fulfillment-toggle" style="margin-top:0.3rem;margin-bottom:0.75rem;">
                  <div class="toggle-opt ${state.posPaymentMethod==='Cash'?'active':''}" onclick="store.state.posPaymentMethod='Cash';store.notify();">Cash</div>
                  <div class="toggle-opt ${state.posPaymentMethod==='GCash'?'active':''}" onclick="store.state.posPaymentMethod='GCash';store.notify();">GCash</div>
                  <div class="toggle-opt ${state.posPaymentMethod==='Card'?'active':''}" onclick="store.state.posPaymentMethod='Card';store.notify();">Card</div>
                </div>
              </div>

              ${state.posPaymentMethod === 'Cash' ? `
                <div class="form-row" style="margin-bottom:0.5rem;">
                  <div>
                    <label style="font-size:0.75rem;color:var(--c-muted);">Cash Tendered</label>
                    <input type="number" class="form-input" style="padding:0.4rem 0.6rem;" placeholder="0.00" value="${state.posCashTendered || ''}" oninput="store.state.posCashTendered=parseFloat(this.value)||0;store.notify();">
                  </div>
                  <div>
                    <label style="font-size:0.75rem;color:var(--c-muted);">Change</label>
                    <div style="font-size:1.1rem;font-weight:700;color:var(--c-green);padding-top:0.3rem;">&#8369;${change.toFixed(2)}</div>
                  </div>
                </div>
              ` : ''}

              <button class="btn btn-fill" style="width:100%;margin-top:0.75rem;" onclick="store.submitPOSOrder();">
                Complete Sale & Print Receipt ${Icons.arrowRight()}
              </button>
            </div>
          </div>
        </div>

        <!-- POS Printable Receipt Modal -->
        ${C.POSReceiptModal(state)}
      </div>
    `;
  },

  POSReceiptModal(state) {
    if (!state.posReceiptModalOpen || !state.posLastReceipt) return '';
    const r = state.posLastReceipt;

    return `
      <div class="modal-overlay open" onclick="if(event.target===this) store.closePOSReceipt();">
        <div class="modal modal-sm" style="background:#fff;color:#111;">
          <button class="modal-close" style="background:#f1f1f1;color:#111;" onclick="store.closePOSReceipt();">${Icons.close()}</button>
          
          <div class="receipt-print-box" id="printable-receipt" style="padding:2.5rem 2rem;font-family:monospace;font-size:0.85rem;line-height:1.5;">
            <div style="text-align:center;margin-bottom:1.5rem;">
              <h2 style="font-family:var(--f-serif);font-size:1.4rem;font-weight:700;margin-bottom:0.2rem;">FREDY BILLS BAKERY</h2>
              <div>IT Park, Lahug, Cebu City</div>
              <div>Tel: +63 32 888 1234</div>
              <div>VAT Reg TIN: 458-921-003-000</div>
              <div style="margin-top:0.5rem;border-top:1px dashed #444;border-bottom:1px dashed #444;padding:0.3rem 0;">
                OFFICIAL POS INVOICE #${r.id}
              </div>
            </div>

            <div style="margin-bottom:1rem;">
              <div>Date: ${new Date().toLocaleString()}</div>
              <div>Cashier: ${r.cashier}</div>
              <div>Customer: ${r.customer_name}</div>
            </div>

            <table style="width:100%;border-collapse:collapse;margin-bottom:1rem;">
              <thead>
                <tr style="border-bottom:1px dashed #444;">
                  <th style="text-align:left;padding:0.3rem 0;">Item</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:right;">Price</th>
                  <th style="text-align:right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${(r.items || []).map(i => `
                  <tr>
                    <td style="padding:0.25rem 0;">${i.name}</td>
                    <td style="text-align:center;">${i.quantity}</td>
                    <td style="text-align:right;">${i.unitPrice.toFixed(2)}</td>
                    <td style="text-align:right;">${(i.unitPrice * i.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="border-top:1px dashed #444;padding-top:0.5rem;margin-bottom:1rem;">
              <div style="display:flex;justify-content:space-between;"><span>Subtotal:</span><span>&#8369;${r.subtotal.toFixed(2)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span>Discount:</span><span>-&#8369;${(r.discount || 0).toFixed(2)}</span></div>
              <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:1rem;margin-top:0.3rem;">
                <span>TOTAL:</span><span>&#8369;${r.total.toFixed(2)}</span>
              </div>
              <div style="display:flex;justify-content:space-between;margin-top:0.3rem;">
                <span>Paid via ${r.payment_method}:</span><span>&#8369;${(r.cashTendered || r.total).toFixed(2)}</span>
              </div>
              ${r.change > 0 ? `<div style="display:flex;justify-content:space-between;"><span>Change:</span><span>&#8369;${r.change.toFixed(2)}</span></div>` : ''}
            </div>

            <div style="text-align:center;margin-top:1.5rem;font-size:0.8rem;">
              <div>Thank you for choosing Fredy Bills!</div>
              <div>Freshly Baked with Passion Daily.</div>
            </div>
          </div>

          <div style="padding:1rem 2rem 2rem;display:flex;gap:1rem;">
            <button class="btn btn-fill" style="flex:1;" onclick="window.print();">${Icons.printer()} Print Receipt</button>
            <button class="btn btn-outline" style="color:#111;border-color:#ccc;" onclick="store.closePOSReceipt();">Close</button>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 3. BAKER PORTAL (BakerApp)
  // ==========================================
  BakerApp(state) {
    const tasks = state.productionTasks || [];
    const filter = state.bakerFilterStatus || 'All';
    const filteredTasks = filter === 'All' ? tasks : tasks.filter(t => t.status === filter);

    return `
      <div class="baker-layout">
        ${C.StaffHeader(state)}

        <main class="container--wide" style="padding:2.5rem 2rem;">
          <div class="view-header">
            <div>
              <p class="section-eyebrow">Kitchen Display System (KDS)</p>
              <h1 class="view-title">Baker Production Queue</h1>
              <p class="view-sub">Real-time baking batches, recipe ingredient lists, and stock consumption.</p>
            </div>
            <div class="view-actions">
              <button class="btn btn-outline btn-sm" onclick="store.syncBakerData();">${Icons.refresh()} Refresh Queue</button>
            </div>
          </div>

          <!-- Status Filters -->
          <div class="pills" style="margin-bottom:2rem;">
            ${['All', 'Scheduled', 'Preparing', 'Baking', 'Cooling', 'Ready', 'Completed'].map(st => `
              <button class="pill ${filter===st?'active':''}" onclick="store.state.bakerFilterStatus='${st}';store.notify();">
                ${st}
              </button>
            `).join('')}
          </div>

          <!-- Production Cards Grid -->
          <div class="baker-grid">
            ${filteredTasks.map(task => `
              <div class="baker-card ${task.status.toLowerCase()}">
                <div class="baker-card-header">
                  <div>
                    <span class="badge">${task.task_code}</span>
                    <h3 class="baker-card-title">${task.product_name}</h3>
                  </div>
                  <span class="status-pill status-${task.status.toLowerCase()}">${task.status}</span>
                </div>

                <div class="baker-card-meta">
                  <div><strong>Target:</strong> ${task.target_quantity} pcs</div>
                  <div><strong>Date:</strong> ${task.scheduled_date || 'Today'}</div>
                  <div><strong>Assigned:</strong> ${task.baker_name || 'Chef Baker'}</div>
                </div>

                <!-- Recipe Ingredients Checklist -->
                <div class="baker-ingredients-box">
                  <div style="font-size:0.75rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--c-accent-bright);margin-bottom:0.5rem;">
                    Recipe Ingredients:
                  </div>
                  <ul class="baker-ing-list">
                    ${(task.ingredients || []).map(ing => `
                      <li>
                        <span>${ing.item_name}</span>
                        <strong>${ing.required_quantity} ${ing.unit}</strong>
                      </li>
                    `).join('')}
                  </ul>
                </div>

                <!-- Baker Progression Action Stepper -->
                <div class="baker-card-actions">
                  ${task.status === 'Scheduled' ? `
                    <button class="btn btn-fill btn-sm" style="width:100%;" onclick="store.advanceBakerTask(${task.id}, 'Preparing');">
                      Start Preparation ${Icons.arrowRight()}
                    </button>
                  ` : ''}

                  ${task.status === 'Preparing' ? `
                    <button class="btn btn-fill btn-sm" style="width:100%;" onclick="store.advanceBakerTask(${task.id}, 'Baking');">
                      Send to Oven (Baking) ${Icons.arrowRight()}
                    </button>
                  ` : ''}

                  ${task.status === 'Baking' ? `
                    <button class="btn btn-fill btn-sm" style="width:100%;" onclick="store.advanceBakerTask(${task.id}, 'Cooling');">
                      Out of Oven (Cooling) ${Icons.arrowRight()}
                    </button>
                  ` : ''}

                  ${task.status === 'Cooling' ? `
                    <button class="btn btn-fill btn-sm" style="width:100%;" onclick="store.advanceBakerTask(${task.id}, 'Ready');">
                      Ready for Packaging ${Icons.arrowRight()}
                    </button>
                  ` : ''}

                  ${task.status === 'Ready' ? `
                    <button class="btn btn-fill btn-sm" style="width:100%;" onclick="store.advanceBakerTask(${task.id}, 'Completed');">
                      Complete Batch & Auto-Deduct Stock ${Icons.check()}
                    </button>
                  ` : ''}

                  ${task.status === 'Completed' ? `
                    <div style="text-align:center;color:var(--c-green);font-weight:600;font-size:0.85rem;padding:0.5rem 0;">
                      ${Icons.checkCircle()} Batch Complete & Inventory Synchronized
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </main>
      </div>
    `;
  },

  // ==========================================
  // 4. DELIVERY STAFF PORTAL (DeliveryStaffApp)
  // ==========================================
  DeliveryStaffApp(state) {
    const deliveries = state.deliveries || [];
    const filter = state.deliveryFilterStatus || 'All';
    const filtered = filter === 'All' ? deliveries : deliveries.filter(d => d.status === filter);

    return `
      <div class="delivery-layout">
        ${C.StaffHeader(state)}

        <main class="container--narrow" style="padding:2.5rem 1.5rem;">
          <div class="view-header">
            <div>
              <p class="section-eyebrow">Courier Dispatch Interface</p>
              <h1 class="view-title">My Deliveries</h1>
              <p class="view-sub">Active order drop-offs, customer contact, and delivery confirmations.</p>
            </div>
            <div class="view-actions">
              <button class="btn btn-outline btn-sm" onclick="store.syncDeliveryData();">${Icons.refresh()} Refresh</button>
            </div>
          </div>

          <!-- Status Tabs -->
          <div class="pills" style="margin-bottom:2rem;">
            ${['All', 'Assigned', 'Accepted', 'Out for Delivery', 'Delivered'].map(st => `
              <button class="pill ${filter===st?'active':''}" onclick="store.state.deliveryFilterStatus='${st}';store.notify();">
                ${st}
              </button>
            `).join('')}
          </div>

          <!-- Delivery Cards List -->
          <div class="delivery-cards-list">
            ${filtered.map(d => `
              <div class="delivery-card">
                <div class="delivery-card-top">
                  <div>
                    <span class="badge">Order #${d.order_id}</span>
                    <h3 style="font-family:var(--f-serif);font-size:1.3rem;margin-top:0.3rem;">${d.customer_name}</h3>
                  </div>
                  <span class="status-pill status-${d.status.toLowerCase().replace(/\s+/g, '-')}">${d.status}</span>
                </div>

                <div class="delivery-info-row">
                  <div class="delivery-info-icon">${Icons.mapPin()}</div>
                  <div class="delivery-info-text">
                    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--c-muted);font-weight:600;">Destination Address</div>
                    <div style="color:var(--c-cream);font-size:0.95rem;">${d.delivery_address}</div>
                  </div>
                </div>

                <div class="delivery-info-row">
                  <div class="delivery-info-icon">${Icons.phone()}</div>
                  <div class="delivery-info-text">
                    <div style="font-size:0.75rem;text-transform:uppercase;color:var(--c-muted);font-weight:600;">Customer Contact</div>
                    <a href="tel:${d.customer_phone}" style="color:var(--c-accent-bright);font-weight:700;">${d.customer_phone || '+63 917 000 0000'}</a>
                  </div>
                </div>

                ${d.failure_reason ? `
                  <div class="alert-box-danger" style="margin-top:1rem;padding:0.75rem;background:rgba(196,91,63,0.15);border:1px solid var(--c-red);border-radius:4px;font-size:0.85rem;">
                    <strong>Delivery Issue Reported:</strong> ${d.failure_reason}
                  </div>
                ` : ''}

                <!-- Status Buttons -->
                <div class="delivery-card-actions" style="margin-top:1.5rem;display:flex;gap:0.75rem;flex-wrap:wrap;">
                  ${d.status === 'Assigned' ? `
                    <button class="btn btn-fill btn-sm" style="flex:1;" onclick="store.advanceDeliveryStatus(${d.id}, 'Accepted');">
                      Accept Order ${Icons.check()}
                    </button>
                  ` : ''}

                  ${d.status === 'Accepted' ? `
                    <button class="btn btn-fill btn-sm" style="flex:1;" onclick="store.advanceDeliveryStatus(${d.id}, 'Out for Delivery');">
                      Picked Up & Out for Delivery ${Icons.truck()}
                    </button>
                  ` : ''}

                  ${d.status === 'Out for Delivery' ? `
                    <button class="btn btn-fill btn-sm" style="flex:1;" onclick="store.advanceDeliveryStatus(${d.id}, 'Delivered');">
                      Confirm Delivered ${Icons.checkCircle()}
                    </button>
                    <button class="btn btn-outline btn-sm btn-danger" onclick="store.openDeliveryIssueModal(${JSON.stringify(d).replace(/"/g, '&quot;')});">
                      Report Issue
                    </button>
                  ` : ''}

                  ${d.status === 'Delivered' ? `
                    <div style="color:var(--c-green);font-weight:700;font-size:0.9rem;">
                      ${Icons.checkCircle()} Successfully Delivered
                    </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </main>

        <!-- Delivery Issue Modal -->
        ${C.DeliveryIssueModal(state)}
      </div>
    `;
  },

  DeliveryIssueModal(state) {
    if (!state.deliveryIssueModalOpen || !state.deliveryActiveDelivery) return '';
    const d = state.deliveryActiveDelivery;

    return `
      <div class="modal-overlay open" onclick="if(event.target===this) store.closeDeliveryIssueModal();">
        <div class="modal modal-sm">
          <button class="modal-close" onclick="store.closeDeliveryIssueModal();">${Icons.close()}</button>
          <div style="padding:2rem;">
            <h2 class="modal-title" style="margin-bottom:1rem;">Report Delivery Issue</h2>
            <p style="font-size:0.85rem;color:var(--c-muted);margin-bottom:1.5rem;">Order #${d.order_id} for ${d.customer_name}</p>

            <form onsubmit="event.preventDefault(); const reason=document.getElementById('del-reason').value; const note=document.getElementById('del-note').value; store.advanceDeliveryStatus(${d.id}, 'Failed', reason, note);">
              <div class="form-grp">
                <label>Reason for Issue *</label>
                <select id="del-reason" class="form-input" required>
                  <option value="Customer Unreachable">Customer Unreachable</option>
                  <option value="Incorrect Address">Incorrect Address / Location</option>
                  <option value="Customer Cancelled / Refused">Customer Cancelled / Refused</option>
                  <option value="Severe Weather / Road Block">Severe Weather / Road Block</option>
                </select>
              </div>

              <div class="form-grp">
                <label>Additional Notes / Proof</label>
                <textarea id="del-note" class="form-input" rows="3" placeholder="Describe attempt details, landmarks, etc."></textarea>
              </div>

              <button type="submit" class="btn btn-fill btn-danger" style="width:100%;margin-top:1.5rem;">Submit Issue Report</button>
            </form>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================
  // 5. CUSTOMER PORTAL (CustomerApp)
  // ==========================================
  Header(state) {
    const { cartCount } = store.getCartCalculations();
    const favCount = state.favorites.length;
    const v = state.activeView;
    const user = state.currentUser;

    return `
      <header class="site-header" id="site-header">
        <div class="header-inner">
          <a href="#" class="logo-link" onclick="event.preventDefault(); store.setView('home');">
            <span class="logo-text">Fredy Bills</span><span class="logo-dot">.</span>
          </a>

          <nav class="nav-desktop">
            <a href="#" class="nav-link ${v==='home'?'active':''}" onclick="event.preventDefault(); store.setView('home');">Home</a>
            <a href="#" class="nav-link ${v==='menu'?'active':''}" onclick="event.preventDefault(); store.setView('menu');">Menu</a>
            <a href="#" class="nav-link ${v==='orders'?'active':''}" onclick="event.preventDefault(); store.setView('orders');">My Orders</a>
            <a href="#" class="nav-link ${v==='track'?'active':''}" onclick="event.preventDefault(); store.setView('track');">Track Order</a>
          </nav>

          <div class="header-actions">
            <!-- Dark / Light Mode Toggle -->
            <button class="action-icon" title="Toggle Light/Dark Theme" onclick="store.toggleTheme();">
              ${state.theme === 'dark' ? Icons.sun() : Icons.moon()}
            </button>
            <button class="action-icon" title="Search Menu" onclick="store.setView('menu');">${Icons.search()}</button>
            <button class="action-icon" title="Favorites" onclick="store.setView('favorites');">
              ${Icons.heart()}
              ${favCount > 0 ? '<span class="badge-dot"></span>' : ''}
            </button>
            <button class="action-icon" title="Cart" onclick="app.openCart();">
              ${Icons.cart()}
              ${cartCount > 0 ? `<span class="badge-num">${cartCount}</span>` : ''}
            </button>
            <button class="action-icon" title="Sign Out" onclick="store.logoutUser();">${Icons.logout()}</button>
            <button class="action-icon mobile-menu-btn" onclick="app.toggleMobile(true);">${Icons.menu()}</button>
          </div>
        </div>
      </header>
    `;
  },

  MobileNav(state) {
    return `
      <nav class="mobile-nav ${app?.mobileOpen ? 'open' : ''}" id="mobile-nav">
        <div class="mobile-nav-header">
          <span class="logo-text" style="font-family:var(--f-serif);font-size:1.4rem;font-weight:700;">Fredy Bills<span class="logo-dot">.</span></span>
          <button class="action-icon" onclick="app.toggleMobile(false);">${Icons.close()}</button>
        </div>
        <div class="mobile-nav-links">
          <a href="#" class="mobile-nav-link" onclick="event.preventDefault(); app.toggleMobile(false); store.setView('home');">Home</a>
          <a href="#" class="mobile-nav-link" onclick="event.preventDefault(); app.toggleMobile(false); store.setView('menu');">Menu</a>
          <a href="#" class="mobile-nav-link" onclick="event.preventDefault(); app.toggleMobile(false); store.setView('orders');">My Orders</a>
          <a href="#" class="mobile-nav-link" onclick="event.preventDefault(); app.toggleMobile(false); store.setView('track');">Track Order</a>
          <a href="#" class="mobile-nav-link" onclick="event.preventDefault(); app.toggleMobile(false); store.setView('favorites');">Favorites</a>
          <a href="#" class="mobile-nav-link" onclick="event.preventDefault(); app.toggleMobile(false); store.logoutUser();">Sign Out</a>
        </div>
      </nav>
    `;
  },

  // Storefront Home — Streamlined with Direct Real Menu
  Home(state) {
    let products = [...(state.products || [])];
    if (state.activeCategory && state.activeCategory !== 'all') {
      products = products.filter(p => p.category_id === state.activeCategory || p.category === state.activeCategory);
    }
    if (state.searchQuery && state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      products = products.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) || 
        (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    if (state.sortBy === 'price-low') products.sort((a,b)=>a.price-b.price);
    else if (state.sortBy === 'price-high') products.sort((a,b)=>b.price-a.price);
    else if (state.sortBy === 'rating') products.sort((a,b)=>(b.rating||5)-(a.rating||5));

    const cats = [{id:'all', name:'All Items'}, ...(state.categories || [])];

    return `
      <!-- HERO -->
      <section class="hero" id="hero">
        <div class="hero-bg" id="hero-bg">
          <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80" alt="Fresh bakery display" loading="eager">
        </div>
        <div class="hero-overlay"></div>
        <div class="container hero-content">
          <p class="hero-eyebrow reveal">Artisanal Bakery & Confectionery</p>
          <h1 class="hero-title reveal reveal-delay-1">Freshly<br><em>Baked Daily.</em></h1>
          <p class="hero-subtitle reveal reveal-delay-2">Handcrafted artisan sourdough, French pastries, celebration cakes, and Filipino confections — baked fresh from scratch and ready for delivery or pickup.</p>
          <div class="hero-actions reveal reveal-delay-3">
            <button class="btn btn-fill" onclick="document.getElementById('home-menu-section')?.scrollIntoView({ behavior: 'smooth' });">Explore Menu ${Icons.arrowRight()}</button>
            <button class="btn btn-outline" onclick="store.setView('track');">Track Live Order</button>
          </div>
        </div>
      </section>

      <!-- HIGHLIGHTS BAR -->
      <section class="home-highlights-bar">
        <div class="container">
          <div class="highlights-grid">
            <div class="highlight-item reveal">
              <div class="highlight-icon">${Icons.chefHat()}</div>
              <div>
                <h4 class="highlight-title">Baked Fresh from 3:00 AM</h4>
                <p class="highlight-desc">100% scratch-made daily with zero preservatives</p>
              </div>
            </div>
            <div class="highlight-item reveal reveal-delay-1">
              <div class="highlight-icon">${Icons.package()}</div>
              <div>
                <h4 class="highlight-title">Pure Artisan Ingredients</h4>
                <p class="highlight-desc">Normandy butter, organic flour & locally sourced fruit</p>
              </div>
            </div>
            <div class="highlight-item reveal reveal-delay-2">
              <div class="highlight-icon">${Icons.truck()}</div>
              <div>
                <h4 class="highlight-title">Fast Delivery & Pickup</h4>
                <p class="highlight-desc">Carefully packaged and delivered straight to your door</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- REAL LIVE MENU SECTION -->
      <section class="home-menu-section" id="home-menu-section">
        <div class="container">
          <div class="menu-section-header reveal">
            <div>
              <p class="section-eyebrow">Our Daily Offerings</p>
              <h2 class="section-heading">Fresh From The Oven</h2>
            </div>
            <p class="section-desc" style="margin-top:0.5rem;">Select your bakery favorites below for instant ordering.</p>
          </div>

          <!-- Filter & Search Toolbar -->
          <div class="filter-bar reveal reveal-delay-1">
            <div class="filter-top">
              <div class="search-box">
                ${Icons.search()}
                <input type="text" placeholder="Search breads, cakes, pastries..." value="${state.searchQuery || ''}" oninput="store.setSearchQuery(this.value);">
              </div>
              <select class="sort-select" onchange="store.setSortBy(this.value);">
                <option value="featured" ${state.sortBy==='featured'?'selected':''}>Featured Items</option>
                <option value="price-low" ${state.sortBy==='price-low'?'selected':''}>Price: Low to High</option>
                <option value="price-high" ${state.sortBy==='price-high'?'selected':''}>Price: High to Low</option>
              </select>
            </div>
            <div class="pills">
              ${cats.map(c => `
                <button class="pill ${(!state.activeCategory && c.id==='all') || state.activeCategory===c.id ? 'active' : ''}" onclick="store.setCategory('${c.id}');">
                  ${c.name}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="results-count">Showing <strong>${products.length}</strong> items available today</div>

          <!-- Product Grid -->
          ${products.length > 0 ? `
            <div class="products-grid" style="padding-bottom:6rem;">
              ${products.map(p => C.GridCard(p, state)).join('')}
            </div>
          ` : `
            <div class="empty-state" style="padding:6rem 2rem;">
              <h3>No Products Found</h3>
              <p>No items found matching your current filter. Try resetting your search or category.</p>
              <button class="btn btn-outline" onclick="store.setSearchQuery(''); store.setCategory('all');">Show All Products</button>
            </div>
          `}
        </div>
      </section>
    `;
  },

  // Storefront Menu
  Menu(state) {
    let products = [...(state.products || [])];
    if (state.activeCategory !== 'all') {
      products = products.filter(p => p.category_id === state.activeCategory || p.category === state.activeCategory);
    }
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || (p.shortDescription && p.shortDescription.toLowerCase().includes(q)));
    }
    if (state.sortBy === 'price-low') products.sort((a,b)=>a.price-b.price);
    else if (state.sortBy === 'price-high') products.sort((a,b)=>b.price-a.price);
    else if (state.sortBy === 'rating') products.sort((a,b)=>(b.rating||5)-(a.rating||5));

    const cats = [{id:'all',name:'All'}, ...(state.categories || [])];

    return `
      <div class="menu-hero">
        <div class="container">
          <p class="section-eyebrow">Our Collection</p>
          <h1 class="section-heading">Menu</h1>
          <p class="section-desc" style="margin:0.75rem auto 0;">Freshly baked every day in our Cebu City kitchen.</p>
        </div>
      </div>
      <div class="container">
        <div class="filter-bar">
          <div class="filter-top">
            <div class="search-box">
              ${Icons.search()}
              <input type="text" placeholder="Search products..." value="${state.searchQuery}" oninput="store.setSearchQuery(this.value);">
            </div>
            <select class="sort-select" onchange="store.setSortBy(this.value);">
              <option value="featured" ${state.sortBy==='featured'?'selected':''}>Featured</option>
              <option value="price-low" ${state.sortBy==='price-low'?'selected':''}>Price: Low to High</option>
              <option value="price-high" ${state.sortBy==='price-high'?'selected':''}>Price: High to Low</option>
            </select>
          </div>
          <div class="pills">
            ${cats.map(c => `<button class="pill ${state.activeCategory===c.id?'active':''}" onclick="store.setCategory('${c.id}');">${c.name}</button>`).join('')}
          </div>
        </div>
        <div class="results-count">Showing <strong>${products.length}</strong> products</div>
        ${products.length > 0 ? `
          <div class="products-grid" style="padding-bottom:5rem;">
            ${products.map(p => C.GridCard(p, state)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <h3>No Products Found</h3>
            <p>Try a different search or category filter.</p>
            <button class="btn btn-outline" onclick="store.setSearchQuery(''); store.setCategory('all');">Reset Filters</button>
          </div>
        `}
      </div>
    `;
  },

  GridCard(p, state) {
    const isFav = state.favorites.includes(p.id);
    return `
      <div class="pg-card reveal">
        <div class="pg-card-img" onclick="store.openProductDetails('${p.id}');">
          <img src="${p.image}" alt="${p.name}" loading="lazy">
          ${p.badge ? `<span class="pg-card-badge">${p.badge}</span>` : ''}
          <button class="pg-card-fav ${isFav?'active':''}" onclick="event.stopPropagation(); store.toggleFavorite('${p.id}');">${Icons.heart('',isFav)}</button>
        </div>
        <div class="pg-card-body">
          <div class="pg-card-cat">${p.category}</div>
          <div class="pg-card-name" onclick="store.openProductDetails('${p.id}');">${p.name}</div>
          <div class="pg-card-desc">${p.shortDescription || ''}</div>
          <div class="pg-card-footer">
            <span class="pg-card-price">&#8369;${p.price.toLocaleString()}</span>
            <button class="add-btn" onclick="store.addToCart(store.state.products.find(x=>x.id==='${p.id}'));">${Icons.plus()} Add</button>
          </div>
        </div>
      </div>
    `;
  },

  // Storefront Product Details Modal
  ProductModal(product, state) {
    if (!product) return '';
    const isFav = state.favorites.includes(product.id);
    return `
      <div class="modal-overlay open" id="product-modal" onclick="if(event.target===this) store.closeProductDetails();">
        <div class="modal">
          <button class="modal-close" onclick="store.closeProductDetails();">${Icons.close()}</button>
          <div class="modal-inner">
            <div class="modal-img"><img src="${product.image}" alt="${product.name}"></div>
            <div class="modal-body">
              <div class="modal-cat">${product.category}</div>
              <h2 class="modal-title">${product.name}</h2>
              <div class="modal-price">&#8369;${product.price.toLocaleString()}</div>
              <p class="modal-desc">${product.description || product.shortDescription || ''}</p>
              ${product.allergens && product.allergens.length > 0 ? `<div class="allergen-list">${product.allergens.map(a => `<span class="allergen">${a}</span>`).join('')}</div>` : ''}
              
              <div class="qty-row">
                <label style="font-size:0.82rem;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">Quantity</label>
                <div class="qty-ctrl">
                  <button onclick="const e=document.getElementById('modal-qty');e.textContent=Math.max(1,parseInt(e.textContent)-1);">${Icons.minus()}</button>
                  <span id="modal-qty">1</span>
                  <button onclick="const e=document.getElementById('modal-qty');e.textContent=parseInt(e.textContent)+1;">${Icons.plus()}</button>
                </div>
              </div>
              <div class="modal-actions">
                <button class="btn btn-fill" onclick="app.addCustomized('${product.id}');">${Icons.cart()} Add to Cart</button>
                <button class="action-icon ${isFav?'active':''}" style="border:1px solid var(--c-border);width:48px;height:48px;flex-shrink:0;" onclick="store.toggleFavorite('${product.id}');">${Icons.heart('',isFav)}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Cart Drawer
  CartDrawer(state) {
    const { cart } = state;
    const { subtotal, discount, deliveryFee, total } = store.getCartCalculations();
    return `
      <div class="cart-overlay ${app?.cartOpen?'open':''}" id="cart-overlay" onclick="if(event.target===this) app.closeCart();">
        <div class="cart-drawer">
          <div class="cart-header">
            <h3>Cart (${cart.length})</h3>
            <button class="action-icon" onclick="app.closeCart();">${Icons.close()}</button>
          </div>
          <div class="cart-body">
            ${cart.length > 0 ? cart.map((item, i) => `
              <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                  <div class="cart-item-name">${item.name}</div>
                  <div class="cart-item-price">&#8369;${(item.unitPrice * item.quantity).toLocaleString()}</div>
                  <div class="cart-item-row">
                    <div class="qty-ctrl">
                      <button onclick="store.updateCartQty(${i}, ${item.quantity - 1});">${Icons.minus()}</button>
                      <span>${item.quantity}</span>
                      <button onclick="store.updateCartQty(${i}, ${item.quantity + 1});">${Icons.plus()}</button>
                    </div>
                    <button class="cart-item-remove" onclick="store.removeFromCart(${i});">${Icons.trash()}</button>
                  </div>
                </div>
              </div>
            `).join('') : `
              <div class="cart-empty">
                <h4>Your Cart is Empty</h4>
                <p>Browse our artisanal selection.</p>
                <button class="btn btn-outline btn-sm" onclick="app.closeCart(); store.setView('menu');">Explore Menu</button>
              </div>
            `}
          </div>
          ${cart.length > 0 ? `
            <div class="cart-footer">
              <div class="summary-line"><span>Subtotal</span><span>&#8369;${subtotal.toLocaleString()}</span></div>
              ${discount > 0 ? `<div class="summary-line" style="color:var(--c-accent-bright);"><span>Discount</span><span>-&#8369;${discount.toLocaleString()}</span></div>` : ''}
              <div class="summary-line"><span>Delivery</span><span>&#8369;${deliveryFee.toLocaleString()}</span></div>
              <div class="summary-line total"><span>Total</span><span>&#8369;${total.toLocaleString()}</span></div>
              <button class="btn btn-fill" style="width:100%;margin-top:1.25rem;" onclick="app.closeCart(); store.setView('checkout');">Proceed to Checkout ${Icons.arrowRight()}</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  // Checkout View
  Checkout(state) {
    const { subtotal, discount, deliveryFee, total } = store.getCartCalculations();
    const user = state.currentUser || {};
    const branches = state.branches || [{name:'IT Park Flagship', address:'Cebu City'}];

    return `
      <div class="checkout-hero">
        <div class="container">
          <p class="section-eyebrow">Final Step</p>
          <h1 class="section-heading">Checkout</h1>
        </div>
      </div>
      <div class="container">
        <div class="checkout-layout">
          <div>
            <!-- Fulfillment Type -->
            <div class="chk-card">
              <h3 class="chk-card-title">${Icons.mapPin()} Fulfillment Method</h3>
              <div class="fulfillment-toggle">
                <div class="toggle-opt active" id="tog-del" onclick="app.setFulfillment('delivery');">Delivery</div>
                <div class="toggle-opt" id="tog-pic" onclick="app.setFulfillment('pickup');">Store Pickup</div>
              </div>
              <div id="del-fields">
                <div class="form-grp">
                  <label>Delivery Address *</label>
                  <input type="text" id="chk-address" class="form-input" value="${user.address || ''}" placeholder="Street, Building, Unit, Barangay, City">
                </div>
              </div>
              <div id="pic-fields" style="display:none;">
                <div class="form-grp">
                  <label>Select Pickup Branch *</label>
                  <select id="chk-branch" class="form-input">
                    ${branches.map(b => `<option value="${b.name}">${b.name} (${b.address})</option>`).join('')}
                  </select>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="chk-card">
              <h3 class="chk-card-title">${Icons.user()} Contact Details</h3>
              <div class="form-grp">
                <label>Full Name *</label>
                <input type="text" id="chk-name" class="form-input" value="${user.name || ''}" placeholder="Juan Dela Cruz">
              </div>
              <div class="form-row">
                <div class="form-grp">
                  <label>Email Address *</label>
                  <input type="email" id="chk-email" class="form-input" value="${user.email || ''}" placeholder="juan@example.ph">
                </div>
                <div class="form-grp">
                  <label>Phone Number *</label>
                  <input type="tel" id="chk-phone" class="form-input" value="${user.phone || ''}" placeholder="+63 917 123 4567">
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="chk-card">
              <h3 class="chk-card-title">${Icons.creditCard()} Payment Method</h3>
              <div style="display:flex;flex-direction:column;gap:0.75rem;">
                <label style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border:1px solid var(--c-border);cursor:pointer;">
                  <input type="radio" name="payment" value="GCash" checked>
                  <strong>GCash (Instant Digital E-Wallet)</strong>
                </label>
                <label style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border:1px solid var(--c-border);cursor:pointer;">
                  <input type="radio" name="payment" value="Credit Card">
                  <strong>Credit / Debit Card (Visa, Mastercard)</strong>
                </label>
                <label style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;border:1px solid var(--c-border);cursor:pointer;">
                  <input type="radio" name="payment" value="Cash on Delivery">
                  <strong>Cash on Delivery (COD)</strong>
                </label>
              </div>
            </div>
          </div>

          <!-- Summary Sticky Column -->
          <div>
            <div class="chk-card chk-summary">
              <h3 class="chk-card-title">${Icons.cart()} Order Summary</h3>
              <div style="margin-bottom:1.5rem;max-height:220px;overflow-y:auto;">
                ${state.cart.map(item => `
                  <div style="display:flex;justify-content:space-between;font-size:0.88rem;margin-bottom:0.6rem;">
                    <span>${item.quantity}x ${item.name}</span>
                    <strong>&#8369;${(item.unitPrice * item.quantity).toLocaleString()}</strong>
                  </div>
                `).join('')}
              </div>

              <!-- Promo Code Input -->
              <div style="display:flex;gap:0.5rem;margin-bottom:1.5rem;">
                <input type="text" id="promo-input" class="form-input" placeholder="Promo code (e.g. FREDY10)" style="text-transform:uppercase;">
                <button class="btn btn-outline btn-sm" onclick="store.applyPromoCode(document.getElementById('promo-input').value);">Apply</button>
              </div>

              <div class="summary-line"><span>Subtotal</span><span>&#8369;${subtotal.toLocaleString()}</span></div>
              ${discount > 0 ? `<div class="summary-line" style="color:var(--c-accent-bright);"><span>Discount</span><span>-&#8369;${discount.toLocaleString()}</span></div>` : ''}
              <div class="summary-line"><span>Delivery Fee</span><span>&#8369;${deliveryFee.toLocaleString()}</span></div>
              <div class="summary-line total"><span>Total Amount</span><span>&#8369;${total.toLocaleString()}</span></div>

              <button class="btn btn-fill" id="place-order-btn" style="width:100%;margin-top:1.5rem;" onclick="app.submitCheckout();">
                Place Order & Confirm ${Icons.arrowRight()}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Order Confirmation View
  Confirmation(state) {
    const o = state.activeOrderForConfirmation || { id: "FB-8942", total: 1250 };
    return `
      <div class="container--narrow" style="padding:10rem 1.5rem 6rem;text-align:center;">
        <div style="width:72px;height:72px;border-radius:50%;background:var(--c-green);display:inline-flex;align-items:center;justify-content:center;color:#fff;margin-bottom:1.5rem;">
          ${Icons.checkCircle()}
        </div>
        <p class="section-eyebrow">Order Placed Successfully</p>
        <h1 class="section-heading">Thank You!</h1>
        <p class="section-desc" style="margin:1rem auto 2rem;">
          Your order <strong>#${o.id}</strong> has been transmitted to our kitchen and is now scheduled for baking.
        </p>

        <div class="hero-actions" style="justify-content:center;">
          <button class="btn btn-fill" onclick="store.setView('track', { orderId: '${o.id}' });">Track Live Progress ${Icons.arrowRight()}</button>
          <button class="btn btn-outline" onclick="store.setView('home');">Back to Store</button>
        </div>
      </div>
    `;
  },

  // Order Tracking View
  Track(state) {
    const id = state.trackingOrderId || "FB-8942";
    const order = state.orders.find(o => o.id === id) || {
      id: id,
      status: "preparing",
      total: 1250,
      customer_name: "Juan Dela Cruz",
      timeline_json: JSON.stringify([
        { title: "Order Placed", time: "09:30 AM", done: true },
        { title: "Confirmed by Bakery", time: "09:35 AM", done: true },
        { title: "Baking in Oven", time: "10:15 AM", done: false, active: true },
        { title: "Cooling & Decorated", time: "Pending", done: false },
        { title: "Out for Delivery", time: "Pending", done: false },
        { title: "Delivered", time: "Pending", done: false }
      ])
    };

    let timeline = [];
    try {
      if (Array.isArray(order.timeline)) {
        timeline = order.timeline;
      } else if (typeof order.timeline_json === 'string') {
        timeline = JSON.parse(order.timeline_json);
      } else if (Array.isArray(order.timeline_json)) {
        timeline = order.timeline_json;
      }
    } catch(e) {
      timeline = [];
    }

    const custName = order.customerName || order.customer_name || 'Valued Customer';
    const statusClass = (order.status || 'confirmed').toLowerCase().replace(/\s+/g, '-');

    return `
      <div class="container--narrow" style="padding:8rem 1.5rem 5rem;">
        <div style="text-align:center;margin-bottom:3rem;">
          <p class="section-eyebrow">Live Fulfillment Timeline</p>
          <h1 class="section-heading">Track Order #${order.id}</h1>
        </div>

        <div class="tracking-box">
          <div class="tracking-header">
            <div>
              <div style="font-size:0.8rem;text-transform:uppercase;color:var(--c-muted);font-weight:600;">Customer</div>
              <div style="font-weight:700;font-size:1.1rem;color:var(--c-cream);">${custName}</div>
            </div>
            <span class="status-badge ${statusClass}">Status: ${(order.status || 'Confirmed').toUpperCase()}</span>
          </div>

          <!-- Timeline Stepper -->
          <div class="timeline">
            ${timeline.map(step => `
              <div class="tl-step ${step.done?'done':''} ${step.active?'active':''} ${step.failed?'failed':''}">
                <div class="tl-marker" style="${step.failed?'background:var(--c-red);color:#fff;':''}">${step.failed ? Icons.alertCircle() : (step.done ? Icons.check() : '')}</div>
                <div class="tl-title">${step.title || step.step || 'Step'}</div>
                <div class="tl-time">${step.time || ''}</div>
              </div>
            `).join('')}
          </div>

          <div style="text-align:center;margin-top:2rem;">
            <button class="btn btn-outline btn-sm" onclick="store.syncTrackedOrder();">${Icons.refresh()} Refresh Status</button>
          </div>
        </div>
      </div>
    `;
  },

  // Customer Orders View
  Orders(state) {
    const orders = state.orders || [];
    return `
      <div class="container" style="padding:8rem 1.5rem 5rem;">
        <div style="margin-bottom:3rem;">
          <p class="section-eyebrow">Account</p>
          <h1 class="section-heading">My Orders</h1>
        </div>

        ${orders.length > 0 ? `
          <div class="card-table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${orders.map(o => `
                  <tr>
                    <td><strong>#${o.id}</strong></td>
                    <td>${o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today'}</td>
                    <td>${(o.items || []).map(i => `${i.quantity}x ${i.name || i.product_name || 'Item'}`).join(', ') || 'Bakery Items'}</td>
                    <td><strong>&#8369;${o.total.toLocaleString()}</strong></td>
                    <td><span class="status-pill status-${o.status}">${o.status}</span></td>
                    <td>
                      <button class="btn btn-outline btn-xs" onclick="store.setView('track', { orderId: '${o.id}' });">Track</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="empty-state">
            <h3>No Orders Yet</h3>
            <p>You haven't placed any bakery orders yet.</p>
            <button class="btn btn-fill" onclick="store.setView('menu');">Explore Menu</button>
          </div>
        `}
      </div>
    `;
  },

  // Customer Favorites View
  Favorites(state) {
    const favProds = (state.products || []).filter(p => state.favorites.includes(p.id));
    return `
      <div class="container" style="padding:8rem 1.5rem 5rem;">
        <div style="margin-bottom:3rem;">
          <p class="section-eyebrow">Saved Items</p>
          <h1 class="section-heading">My Favorites</h1>
        </div>

        ${favProds.length > 0 ? `
          <div class="products-grid">
            ${favProds.map(p => C.GridCard(p, state)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <h3>No Favorites Saved</h3>
            <p>Click the heart icon on any product to save it here.</p>
            <button class="btn btn-fill" onclick="store.setView('menu');">Browse Menu</button>
          </div>
        `}
      </div>
    `;
  },

  // Toast System
  Toasts(state) {
    if (!state.toasts || state.toasts.length === 0) return '';
    return `
      <div class="toast-wrap">
        ${state.toasts.map(t => `
          <div class="toast ${t.type || 'success'}">
            ${t.type === 'error' ? Icons.alertCircle() : Icons.checkCircle()}
            <span>${t.message}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  // Storefront Footer
  Footer() {
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <h4>Fredy Bills<span class="logo-dot">.</span></h4>
              <p>Artisanal bakery and specialty pastry house in Cebu City, Philippines. Baked fresh daily from 3:00 AM.</p>
            </div>
            <div>
              <div class="footer-heading">Collections</div>
              <ul class="footer-links">
                <li><a href="#" onclick="event.preventDefault(); store.setView('menu', {category:'cakes'});">Artisanal Cakes</a></li>
                <li><a href="#" onclick="event.preventDefault(); store.setView('menu', {category:'breads'});">Sourdough Breads</a></li>
                <li><a href="#" onclick="event.preventDefault(); store.setView('menu', {category:'pastries'});">French Viennoiserie</a></li>
              </ul>
            </div>
            <div>
              <div class="footer-heading">Portal Links</div>
              <ul class="footer-links">
                <li><a href="#" onclick="event.preventDefault(); store.setView('track');">Track Order</a></li>
                <li><a href="#" onclick="event.preventDefault(); store.setView('orders');">Order History</a></li>
                <li><a href="login.html">Role Login Portal</a></li>
              </ul>
            </div>
            <div>
              <div class="footer-heading">Bakery Location</div>
              <p style="font-size:0.88rem;color:var(--c-muted-light);line-height:1.6;">
                Unit 102, Ground Floor, Central Bloc,<br>Cebu IT Park, Lahug, Cebu City 6000<br>
                Open Daily: 6:00 AM - 10:00 PM
              </p>
            </div>
          </div>
          <div class="footer-bottom">
            &copy; 2026 Fredy Bills Bakery Management System. All rights reserved.
          </div>
        </div>
      </footer>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.C = C;
}
