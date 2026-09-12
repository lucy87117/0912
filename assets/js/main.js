/**
 * ============================================================================
 * 企業報價單管理系統 - 原生 JavaScript (Vanilla JS ES6+) 核心邏輯
 * 檔案路徑：assets/js/main.js
 * 
 * 核心職責：
 * 1. 本地狀態管理 (客戶/廠商/產品/報價單) 與 LocalStorage 資料持久化
 * 2. 嚴格表單防呆機制（必填檢核、統編驗證、Email 格式、數字與關聯驗證、防連點）
 * 3. 模組聯動（產品下拉帶入單價與規格、報價單多品項動態增刪與複價即時計算）
 * 4. 模態視窗操作與純前端 CRUD、報價單預覽列印
 * ============================================================================
 */

'use strict';

// 系統預設範例資料（供初次載入即時體驗）
const INITIAL_DATA = {
  customers: [
    {
      id: 'CUST-1001',
      companyName: '台積創新科技股份有限公司',
      contactName: '林俊豪',
      englishName: 'TSMC Innovation Tech Ltd.',
      department: '資訊工程處',
      title: '技術副理',
      phone: '02-27891234',
      email: 'jhlin@tsmc-innov.com.tw',
      taxId: '23456789',
      address: '新竹市東區力行六路 8 號',
      paymentTerms: '月結 30 天電匯',
      notes: '半導體供應鏈優質客戶，固定季約採購'
    },
    {
      id: 'CUST-1002',
      companyName: '鴻聯智能雲端科技',
      contactName: '陳雅筑',
      englishName: 'FoxCloud Systems Co.',
      department: '採購部',
      title: '採購主管',
      phone: '03-3123456',
      email: 'yachen@foxcloud.com.tw',
      taxId: '84561234',
      address: '新北市板橋區縣民大道二段 68 號 15 樓',
      paymentTerms: '簽約預付 30%，驗收 70%',
      notes: '雲端機房專案客戶'
    }
  ],
  vendors: [
    {
      id: 'VEND-2001',
      companyName: '聯騰企業伺服硬體供應商',
      contactName: '張世杰',
      englishName: 'LianTeng Server Supplies Inc.',
      department: '企業通路部',
      title: '專案業務經理',
      phone: '02-87654321',
      email: 'schang@lianteng.com.tw',
      taxId: '12345678',
      address: '台北市內湖區瑞光路 513 號 8 樓',
      paymentTerms: '月結 45 天',
      notes: '主要伺服器與硬碟核心供應商，配合良好'
    },
    {
      id: 'VEND-2002',
      companyName: '巨峰網路交換設備製造廠',
      contactName: '王怡君',
      englishName: 'GiantPeak Networks Corp.',
      department: '業務處',
      title: '資深業務專員',
      phone: '04-23567890',
      email: 'ycwang@giantpeak.com.tw',
      taxId: '56781234',
      address: '台中市西屯區工業區一路 98 號',
      paymentTerms: '貨到付款',
      notes: '高品質 10G/40G 交換機專業廠商'
    }
  ],
  products: [
    {
      id: 'PROD-3001',
      name: '企業級 2U 機架伺服器 R750',
      cost: 95000,
      price: 135000,
      unit: '台',
      image: '',
      brand: 'DELL EMC',
      spec: 'Intel Xeon 64C / 128G RAM / 2TB NVMe SSD*2 / 冗餘電源',
      description: '具備雙備援電源與 iDRAC9 遠端管理晶片',
      stock: 8,
      vendorId: 'VEND-2001'
    },
    {
      id: 'PROD-3002',
      name: '48埠 L3 核心網路交換器',
      cost: 42000,
      price: 68000,
      unit: '台',
      image: '',
      brand: 'Cisco',
      spec: '48 Port 10G SFP+ / 6 Port 40G QSFP+ / 模組化備援',
      description: '支援 BGP/OSPF 高速封包路由轉發',
      stock: 15,
      vendorId: 'VEND-2002'
    },
    {
      id: 'PROD-3003',
      name: '高容量 16TB 企業級 SATA 伺服硬碟',
      cost: 7200,
      price: 11500,
      unit: '顆',
      image: '',
      brand: 'Seagate Exos',
      spec: '16TB 7200RPM 256MB 512e/4Kn SATA 6Gb/s',
      description: '原廠 5 年保固，MTBF 250 萬小時',
      stock: 40,
      vendorId: 'VEND-2001'
    }
  ],
  quotations: [
    {
      id: 'QUO-2026-0001',
      date: '2026-09-12',
      validUntil: '2026-10-12',
      customerId: 'CUST-1001',
      salesPerson: '黃大維',
      salesPhone: '0912-345-678',
      salesAddress: '台北市信義區忠孝東路五段 1 號 22 樓',
      items: [
        {
          productId: 'PROD-3001',
          productName: '企業級 2U 機架伺服器 R750',
          unitPrice: 135000,
          spec: 'Intel Xeon 64C / 128G RAM / 2TB NVMe SSD*2 / 冗餘電源',
          quantity: 2,
          subtotal: 270000
        },
        {
          productId: 'PROD-3003',
          productName: '高容量 16TB 企業級 SATA 伺服硬碟',
          unitPrice: 11500,
          spec: '16TB 7200RPM 256MB 512e/4Kn SATA 6Gb/s',
          quantity: 8,
          subtotal: 92000
        }
      ],
      subtotal: 362000,
      taxRate: 0.05,
      taxAmount: 18100,
      totalAmount: 380100,
      paymentTerms: '月結 30 天電匯',
      notes: '包含第一年原廠 5x8 到府硬體維修保固與安裝設定'
    }
  ]
};

// 全域狀態管理器 (State Manager)
const state = {
  customers: [],
  vendors: [],
  products: [],
  quotations: [],
  activeTab: 'overview',
  activeQuoteItems: [], // 報價單編輯中多品項暫存
  deleteTarget: null // 待刪除對象暫存 { type, id, name }
};

// 本地儲存讀寫工具
const Storage = {
  load() {
    const raw = localStorage.getItem('APEX_QUOTATION_DATA');
    if (!raw) {
      state.customers = [...INITIAL_DATA.customers];
      state.vendors = [...INITIAL_DATA.vendors];
      state.products = [...INITIAL_DATA.products];
      state.quotations = [...INITIAL_DATA.quotations];
      Storage.save();
    } else {
      try {
        const parsed = JSON.parse(raw);
        state.customers = parsed.customers || [];
        state.vendors = parsed.vendors || [];
        state.products = parsed.products || [];
        state.quotations = parsed.quotations || [];
      } catch (err) {
        console.error('資料解析失敗，載入預設值', err);
        state.customers = [...INITIAL_DATA.customers];
        state.vendors = [...INITIAL_DATA.vendors];
        state.products = [...INITIAL_DATA.products];
        state.quotations = [...INITIAL_DATA.quotations];
      }
    }
  },
  save() {
    localStorage.setItem(
      'APEX_QUOTATION_DATA',
      JSON.stringify({
        customers: state.customers,
        vendors: state.vendors,
        products: state.products,
        quotations: state.quotations
      })
    );
  }
};

// 編號自動生成工具 (產生格式化代碼)
const IDGenerator = {
  getNextCustomerId() {
    const numbers = state.customers.map(c => parseInt(c.id.replace('CUST-', ''), 10) || 1000);
    const max = numbers.length > 0 ? Math.max(...numbers) : 1000;
    return `CUST-${max + 1}`;
  },
  getNextVendorId() {
    const numbers = state.vendors.map(v => parseInt(v.id.replace('VEND-', ''), 10) || 2000);
    const max = numbers.length > 0 ? Math.max(...numbers) : 2000;
    return `VEND-${max + 1}`;
  },
  getNextProductId() {
    const numbers = state.products.map(p => parseInt(p.id.replace('PROD-', ''), 10) || 3000);
    const max = numbers.length > 0 ? Math.max(...numbers) : 3000;
    return `PROD-${max + 1}`;
  },
  getNextQuotationId() {
    const year = new Date().getFullYear();
    const prefix = `QUO-${year}-`;
    const numbers = state.quotations
      .filter(q => q.id.startsWith(prefix))
      .map(q => parseInt(q.id.replace(prefix, ''), 10) || 0);
    const max = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNum = String(max + 1).padStart(4, '0');
    return `${prefix}${nextNum}`;
  }
};

// 格式化輔助函式
const Format = {
  currency(num) {
    const val = Number(num) || 0;
    return 'NT$ ' + val.toLocaleString('zh-TW');
  },
  escape(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
};

// 表單防呆與驗證工具 (Validation & Throttling)
const Validator = {
  // 檢查台灣統編 8 位數純數字
  isTaxId(value) {
    return /^\d{8}$/.test(value.trim());
  },
  // 檢查 Email 格式
  isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  },
  // 檢查電話 (至少含 7-15 位號碼及分機字元)
  isPhone(value) {
    return /^[\d\s\-+#()]{7,20}$/.test(value.trim());
  },
  // 單一欄位設定狀態 class
  setFieldState(inputEl, isValid, message) {
    if (!inputEl) return;
    const parent = inputEl.closest('.mb-3') || inputEl.parentElement;
    const feedback = parent.querySelector('.invalid-feedback');

    if (isValid) {
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
    } else {
      inputEl.classList.remove('is-valid');
      inputEl.classList.add('is-invalid');
      if (feedback && message) {
        feedback.textContent = message;
      }
    }
  },
  // 清除整個表單驗證狀態
  resetFormState(formEl) {
    if (!formEl) return;
    formEl.reset();
    formEl.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
      el.classList.remove('is-valid', 'is-invalid');
    });
  }
};

// DOM 渲染器 (UI Renderer)
const UI = {
  // 初始化與綁定各區塊
  init() {
    Storage.load();
    UI.bindNavigation();
    UI.bindModals();
    UI.bindQuickStats();
    UI.renderOverview();
    UI.renderCustomers();
    UI.renderVendors();
    UI.renderProducts();
    UI.renderQuotations();
  },

  // 導覽切換綁定
  bindNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-tab]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.getAttribute('data-tab');
        UI.switchTab(tabName);
      });
    });

    // 行動版選單自動收合
    const navbarCollapse = document.getElementById('mainNavbar');
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  },

  // 分頁切換邏輯
  switchTab(tabName) {
    state.activeTab = tabName;
    document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
      if (link.getAttribute('data-tab') === tabName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    document.querySelectorAll('.tab-content-panel').forEach(panel => {
      if (panel.id === `tab-${tabName}`) {
        panel.classList.remove('d-none');
      } else {
        panel.classList.add('d-none');
      }
    });

    // 視窗切換時刷新對應列表
    if (tabName === 'overview') UI.renderOverview();
    if (tabName === 'customers') UI.renderCustomers();
    if (tabName === 'vendors') UI.renderVendors();
    if (tabName === 'products') UI.renderProducts();
    if (tabName === 'quotations') UI.renderQuotations();

    // 滾動至頂部確保體驗
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // 概覽與統計數據更新
  renderOverview() {
    const custCount = document.getElementById('stat-cust-count');
    const vendCount = document.getElementById('stat-vend-count');
    const prodCount = document.getElementById('stat-prod-count');
    const quoTotal = document.getElementById('stat-quo-total');

    if (custCount) custCount.textContent = state.customers.length;
    if (vendCount) vendCount.textContent = state.vendors.length;
    if (prodCount) prodCount.textContent = state.products.length;

    const totalMoney = state.quotations.reduce((sum, q) => sum + (Number(q.totalAmount) || 0), 0);
    if (quoTotal) quoTotal.textContent = Format.currency(totalMoney);

    // 渲染最近報價單表格
    const recentTable = document.getElementById('recent-quotes-table');
    if (recentTable) {
      if (state.quotations.length === 0) {
        recentTable.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">目前尚無報價單資料</td></tr>`;
      } else {
        const sorted = [...state.quotations].reverse().slice(0, 5);
        recentTable.innerHTML = sorted.map(q => {
          const cust = state.customers.find(c => c.id === q.customerId);
          const custName = cust ? cust.companyName : '未指定客戶';
          return `
            <tr>
              <td><span class="badge bg-purple-subtle text-purple border code-badge">${Format.escape(q.id)}</span></td>
              <td class="fw-medium">${Format.escape(custName)}</td>
              <td>${q.date}</td>
              <td class="fw-bold text-end">${Format.currency(q.totalAmount)}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-primary py-1 px-2" onclick="UI.viewQuotationDetail('${q.id}')">
                  <i class="fa-solid fa-eye me-1"></i>明細
                </button>
              </td>
            </tr>
          `;
        }).join('');
      }
    }
  },

  // 快速統計卡片按鈕導航
  bindQuickStats() {
    document.querySelectorAll('[data-goto-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-goto-tab');
        UI.switchTab(target);
      });
    });
  },

  // ==========================================================================
  // 客戶管理 (Customer Management)
  // ==========================================================================
  renderCustomers() {
    const tableBody = document.getElementById('customer-table-body');
    if (!tableBody) return;

    if (state.customers.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">暫無客戶資料，請點擊上方「新增客戶」</td></tr>`;
      return;
    }

    tableBody.innerHTML = state.customers.map(c => `
      <tr>
        <td><span class="badge bg-primary-subtle text-primary border border-primary-subtle code-badge">${Format.escape(c.id)}</span></td>
        <td>
          <div class="fw-bold text-dark">${Format.escape(c.companyName)}</div>
          <small class="text-muted">${Format.escape(c.englishName || '—')}</small>
        </td>
        <td>
          <div>${Format.escape(c.contactName)}</div>
          <small class="text-muted">${Format.escape(c.department || '')} ${Format.escape(c.title || '')}</small>
        </td>
        <td>
          <div><i class="fa-solid fa-phone me-1 text-muted small"></i>${Format.escape(c.phone)}</div>
          <div><i class="fa-solid fa-envelope me-1 text-muted small"></i>${Format.escape(c.email)}</div>
        </td>
        <td><span class="badge bg-light text-secondary border font-monospace">${Format.escape(c.taxId)}</span></td>
        <td class="small text-truncate" style="max-width: 180px;" title="${Format.escape(c.address)}">${Format.escape(c.address)}</td>
        <td class="text-end">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" title="查看明細" onclick="UI.viewCustomerDetail('${c.id}')">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-outline-primary" title="編輯客戶" onclick="UI.openCustomerModal('${c.id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-outline-danger" title="刪除客戶" onclick="UI.confirmDelete('customer', '${c.id}', '${Format.escape(c.companyName)}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  openCustomerModal(id = null) {
    const modalEl = document.getElementById('customerModal');
    const form = document.getElementById('customerForm');
    Validator.resetFormState(form);

    const titleEl = document.getElementById('customerModalTitle');
    const idInput = document.getElementById('cust_id');

    if (id) {
      const customer = state.customers.find(c => c.id === id);
      if (!customer) return;
      titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square me-2 text-primary"></i>編輯客戶資料`;
      idInput.value = customer.id;
      document.getElementById('cust_companyName').value = customer.companyName;
      document.getElementById('cust_contactName').value = customer.contactName;
      document.getElementById('cust_englishName').value = customer.englishName || '';
      document.getElementById('cust_department').value = customer.department || '';
      document.getElementById('cust_title').value = customer.title || '';
      document.getElementById('cust_phone').value = customer.phone;
      document.getElementById('cust_email').value = customer.email;
      document.getElementById('cust_taxId').value = customer.taxId;
      document.getElementById('cust_address').value = customer.address;
      document.getElementById('cust_paymentTerms').value = customer.paymentTerms || '';
      document.getElementById('cust_notes').value = customer.notes || '';
    } else {
      titleEl.innerHTML = `<i class="fa-solid fa-user-plus me-2 text-primary"></i>新增客戶`;
      idInput.value = IDGenerator.getNextCustomerId();
      document.getElementById('cust_companyName').value = '';
      document.getElementById('cust_contactName').value = '';
      document.getElementById('cust_englishName').value = '';
      document.getElementById('cust_department').value = '';
      document.getElementById('cust_title').value = '';
      document.getElementById('cust_phone').value = '';
      document.getElementById('cust_email').value = '';
      document.getElementById('cust_taxId').value = '';
      document.getElementById('cust_address').value = '';
      document.getElementById('cust_paymentTerms').value = '月結 30 天電匯';
      document.getElementById('cust_notes').value = '';
    }

    const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
    bsModal.show();
  },

  saveCustomer() {
    const form = document.getElementById('customerForm');
    const saveBtn = document.getElementById('saveCustomerBtn');

    const id = document.getElementById('cust_id').value.trim();
    const companyName = document.getElementById('cust_companyName').value.trim();
    const contactName = document.getElementById('cust_contactName').value.trim();
    const englishName = document.getElementById('cust_englishName').value.trim();
    const department = document.getElementById('cust_department').value.trim();
    const title = document.getElementById('cust_title').value.trim();
    const phone = document.getElementById('cust_phone').value.trim();
    const email = document.getElementById('cust_email').value.trim();
    const taxId = document.getElementById('cust_taxId').value.trim();
    const address = document.getElementById('cust_address').value.trim();
    const paymentTerms = document.getElementById('cust_paymentTerms').value.trim();
    const notes = document.getElementById('cust_notes').value.trim();

    // 嚴格表單防呆校驗
    let hasError = false;

    // 1. 公司名稱
    if (!companyName) {
      Validator.setFieldState(document.getElementById('cust_companyName'), false, '請填寫公司名稱');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('cust_companyName'), true);
    }

    // 2. 聯絡窗口
    if (!contactName) {
      Validator.setFieldState(document.getElementById('cust_contactName'), false, '請填寫聯絡窗口姓名');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('cust_contactName'), true);
    }

    // 3. 電話
    if (!Validator.isPhone(phone)) {
      Validator.setFieldState(document.getElementById('cust_phone'), false, '請輸入有效的聯絡電話格式');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('cust_phone'), true);
    }

    // 4. Email
    if (!Validator.isEmail(email)) {
      Validator.setFieldState(document.getElementById('cust_email'), false, '請填寫正確的電子信箱格式');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('cust_email'), true);
    }

    // 5. 統一編號
    if (!Validator.isTaxId(taxId)) {
      Validator.setFieldState(document.getElementById('cust_taxId'), false, '統一編號必須為 8 位純數字');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('cust_taxId'), true);
    }

    // 6. 地址
    if (!address) {
      Validator.setFieldState(document.getElementById('cust_address'), false, '請填寫完整營業住址');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('cust_address'), true);
    }

    if (hasError) return;

    // 防連點鎖定
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>儲存中...`;

    setTimeout(() => {
      const existingIdx = state.customers.findIndex(c => c.id === id);
      const customerData = {
        id, companyName, contactName, englishName, department, title,
        phone, email, taxId, address, paymentTerms, notes
      };

      if (existingIdx >= 0) {
        state.customers[existingIdx] = customerData;
      } else {
        state.customers.push(customerData);
      }

      Storage.save();
      UI.renderCustomers();
      UI.renderOverview();

      saveBtn.disabled = false;
      saveBtn.innerHTML = `<i class="fa-solid fa-check me-1"></i>儲存客戶`;

      const modalEl = document.getElementById('customerModal');
      bootstrap.Modal.getInstance(modalEl).hide();
    }, 400);
  },

  viewCustomerDetail(id) {
    const c = state.customers.find(item => item.id === id);
    if (!c) return;
    const body = document.getElementById('detailModalBody');
    document.getElementById('detailModalTitle').innerHTML = `<i class="fa-solid fa-building me-2 text-primary"></i>客戶明細 - ${Format.escape(c.companyName)}`;

    body.innerHTML = `
      <div class="row g-3">
        <div class="col-sm-6"><strong>客戶代碼：</strong> <span class="badge bg-primary-subtle text-primary">${c.id}</span></div>
        <div class="col-sm-6"><strong>統一編號：</strong> ${Format.escape(c.taxId)}</div>
        <div class="col-sm-6"><strong>公司名稱：</strong> ${Format.escape(c.companyName)}</div>
        <div class="col-sm-6"><strong>英文名稱：</strong> ${Format.escape(c.englishName || '—')}</div>
        <div class="col-sm-6"><strong>聯絡窗口：</strong> ${Format.escape(c.contactName)} (${Format.escape(c.department || '')} ${Format.escape(c.title || '')})</div>
        <div class="col-sm-6"><strong>聯絡電話：</strong> ${Format.escape(c.phone)}</div>
        <div class="col-sm-6"><strong>電子郵件：</strong> ${Format.escape(c.email)}</div>
        <div class="col-sm-6"><strong>付款條件：</strong> ${Format.escape(c.paymentTerms || '—')}</div>
        <div class="col-12"><strong>通訊地址：</strong> ${Format.escape(c.address)}</div>
        <div class="col-12"><strong>備註說明：</strong> ${Format.escape(c.notes || '無')}</div>
      </div>
    `;

    bootstrap.Modal.getOrCreateInstance(document.getElementById('detailModal')).show();
  },

  // ==========================================================================
  // 廠商管理 (Vendor Management)
  // ==========================================================================
  renderVendors() {
    const tableBody = document.getElementById('vendor-table-body');
    if (!tableBody) return;

    if (state.vendors.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">暫無廠商資料，請點擊上方「新增廠商」</td></tr>`;
      return;
    }

    tableBody.innerHTML = state.vendors.map(v => `
      <tr>
        <td><span class="badge bg-teal-subtle text-teal border border-teal-subtle code-badge" style="background-color: #ccfbf1; color: #0f766e;">${Format.escape(v.id)}</span></td>
        <td>
          <div class="fw-bold text-dark">${Format.escape(v.companyName)}</div>
          <small class="text-muted">${Format.escape(v.englishName || '—')}</small>
        </td>
        <td>
          <div>${Format.escape(v.contactName)}</div>
          <small class="text-muted">${Format.escape(v.department || '')} ${Format.escape(v.title || '')}</small>
        </td>
        <td>
          <div><i class="fa-solid fa-phone me-1 text-muted small"></i>${Format.escape(v.phone)}</div>
          <div><i class="fa-solid fa-envelope me-1 text-muted small"></i>${Format.escape(v.email)}</div>
        </td>
        <td><span class="badge bg-light text-secondary border font-monospace">${Format.escape(v.taxId)}</span></td>
        <td class="small text-truncate" style="max-width: 180px;" title="${Format.escape(v.address)}">${Format.escape(v.address)}</td>
        <td class="text-end">
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary" title="查看明細" onclick="UI.viewVendorDetail('${v.id}')">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn btn-outline-primary" title="編輯廠商" onclick="UI.openVendorModal('${v.id}')">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-outline-danger" title="刪除廠商" onclick="UI.confirmDelete('vendor', '${v.id}', '${Format.escape(v.companyName)}')">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  openVendorModal(id = null) {
    const modalEl = document.getElementById('vendorModal');
    const form = document.getElementById('vendorForm');
    Validator.resetFormState(form);

    const titleEl = document.getElementById('vendorModalTitle');
    const idInput = document.getElementById('vend_id');

    if (id) {
      const vendor = state.vendors.find(v => v.id === id);
      if (!vendor) return;
      titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square me-2 text-teal"></i>編輯廠商資料`;
      idInput.value = vendor.id;
      document.getElementById('vend_companyName').value = vendor.companyName;
      document.getElementById('vend_contactName').value = vendor.contactName;
      document.getElementById('vend_englishName').value = vendor.englishName || '';
      document.getElementById('vend_department').value = vendor.department || '';
      document.getElementById('vend_title').value = vendor.title || '';
      document.getElementById('vend_phone').value = vendor.phone;
      document.getElementById('vend_email').value = vendor.email;
      document.getElementById('vend_taxId').value = vendor.taxId;
      document.getElementById('vend_address').value = vendor.address;
      document.getElementById('vend_paymentTerms').value = vendor.paymentTerms || '';
      document.getElementById('vend_notes').value = vendor.notes || '';
    } else {
      titleEl.innerHTML = `<i class="fa-solid fa-truck-ramp-box me-2 text-teal"></i>新增合作廠商`;
      idInput.value = IDGenerator.getNextVendorId();
      document.getElementById('vend_companyName').value = '';
      document.getElementById('vend_contactName').value = '';
      document.getElementById('vend_englishName').value = '';
      document.getElementById('vend_department').value = '';
      document.getElementById('vend_title').value = '';
      document.getElementById('vend_phone').value = '';
      document.getElementById('vend_email').value = '';
      document.getElementById('vend_taxId').value = '';
      document.getElementById('vend_address').value = '';
      document.getElementById('vend_paymentTerms').value = '月結 30 天';
      document.getElementById('vend_notes').value = '';
    }

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  },

  saveVendor() {
    const form = document.getElementById('vendorForm');
    const saveBtn = document.getElementById('saveVendorBtn');

    const id = document.getElementById('vend_id').value.trim();
    const companyName = document.getElementById('vend_companyName').value.trim();
    const contactName = document.getElementById('vend_contactName').value.trim();
    const englishName = document.getElementById('vend_englishName').value.trim();
    const department = document.getElementById('vend_department').value.trim();
    const title = document.getElementById('vend_title').value.trim();
    const phone = document.getElementById('vend_phone').value.trim();
    const email = document.getElementById('vend_email').value.trim();
    const taxId = document.getElementById('vend_taxId').value.trim();
    const address = document.getElementById('vend_address').value.trim();
    const paymentTerms = document.getElementById('vend_paymentTerms').value.trim();
    const notes = document.getElementById('vend_notes').value.trim();

    // 防呆驗證
    let hasError = false;

    if (!companyName) {
      Validator.setFieldState(document.getElementById('vend_companyName'), false, '請填寫廠商公司名稱');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('vend_companyName'), true);
    }

    if (!contactName) {
      Validator.setFieldState(document.getElementById('vend_contactName'), false, '請填寫廠商聯絡窗口');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('vend_contactName'), true);
    }

    if (!Validator.isPhone(phone)) {
      Validator.setFieldState(document.getElementById('vend_phone'), false, '請輸入有效的電話號碼');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('vend_phone'), true);
    }

    if (!Validator.isEmail(email)) {
      Validator.setFieldState(document.getElementById('vend_email'), false, '請輸入正確的電子信箱');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('vend_email'), true);
    }

    if (!Validator.isTaxId(taxId)) {
      Validator.setFieldState(document.getElementById('vend_taxId'), false, '統一編號須為 8 碼數字');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('vend_taxId'), true);
    }

    if (!address) {
      Validator.setFieldState(document.getElementById('vend_address'), false, '請填寫廠商登記住址');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('vend_address'), true);
    }

    if (hasError) return;

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>儲存中...`;

    setTimeout(() => {
      const existingIdx = state.vendors.findIndex(v => v.id === id);
      const vendorData = {
        id, companyName, contactName, englishName, department, title,
        phone, email, taxId, address, paymentTerms, notes
      };

      if (existingIdx >= 0) {
        state.vendors[existingIdx] = vendorData;
      } else {
        state.vendors.push(vendorData);
      }

      Storage.save();
      UI.renderVendors();
      UI.renderOverview();

      saveBtn.disabled = false;
      saveBtn.innerHTML = `<i class="fa-solid fa-check me-1"></i>儲存廠商`;
      bootstrap.Modal.getInstance(document.getElementById('vendorModal')).hide();
    }, 400);
  },

  viewVendorDetail(id) {
    const v = state.vendors.find(item => item.id === id);
    if (!v) return;
    const body = document.getElementById('detailModalBody');
    document.getElementById('detailModalTitle').innerHTML = `<i class="fa-solid fa-truck-ramp-box me-2 text-teal"></i>廠商明細 - ${Format.escape(v.companyName)}`;

    body.innerHTML = `
      <div class="row g-3">
        <div class="col-sm-6"><strong>廠商代碼：</strong> <span class="badge bg-teal-subtle text-teal" style="background-color:#ccfbf1; color:#0f766e;">${v.id}</span></div>
        <div class="col-sm-6"><strong>統一編號：</strong> ${Format.escape(v.taxId)}</div>
        <div class="col-sm-6"><strong>廠商名稱：</strong> ${Format.escape(v.companyName)}</div>
        <div class="col-sm-6"><strong>英文名稱：</strong> ${Format.escape(v.englishName || '—')}</div>
        <div class="col-sm-6"><strong>聯絡窗口：</strong> ${Format.escape(v.contactName)} (${Format.escape(v.department || '')} ${Format.escape(v.title || '')})</div>
        <div class="col-sm-6"><strong>聯絡電話：</strong> ${Format.escape(v.phone)}</div>
        <div class="col-sm-6"><strong>電子郵件：</strong> ${Format.escape(v.email)}</div>
        <div class="col-sm-6"><strong>付款條件：</strong> ${Format.escape(v.paymentTerms || '—')}</div>
        <div class="col-12"><strong>廠商住址：</strong> ${Format.escape(v.address)}</div>
        <div class="col-12"><strong>備註說明：</strong> ${Format.escape(v.notes || '無')}</div>
      </div>
    `;

    bootstrap.Modal.getOrCreateInstance(document.getElementById('detailModal')).show();
  },

  // ==========================================================================
  // 產品管理 (Product Management)
  // ==========================================================================
  renderProducts() {
    const tableBody = document.getElementById('product-table-body');
    if (!tableBody) return;

    if (state.products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-muted">暫無產品資料，請點擊上方「新增產品」</td></tr>`;
      return;
    }

    tableBody.innerHTML = state.products.map(p => {
      const vendor = state.vendors.find(v => v.id === p.vendorId);
      const vendorName = vendor ? vendor.companyName : '無供應商';
      const profit = Number(p.price) - Number(p.cost);

      return `
        <tr>
          <td><span class="badge bg-amber-subtle text-amber border border-warning-subtle code-badge" style="background-color: #fef3c7; color: #b45309;">${Format.escape(p.id)}</span></td>
          <td>
            <div class="fw-bold text-dark">${Format.escape(p.name)}</div>
            <small class="text-muted">${Format.escape(p.brand || '')} ${Format.escape(p.spec || '')}</small>
          </td>
          <td><span class="badge bg-light text-secondary border">${Format.escape(vendorName)}</span></td>
          <td class="text-end font-monospace text-muted">${Format.currency(p.cost)}</td>
          <td class="text-end font-monospace fw-bold text-primary">${Format.currency(p.price)}</td>
          <td class="text-center">${Format.escape(p.unit || '個')}</td>
          <td class="text-center">
            <span class="badge ${p.stock > 5 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} border">
              ${p.stock}
            </span>
          </td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-secondary" title="查看明細" onclick="UI.viewProductDetail('${p.id}')">
                <i class="fa-solid fa-eye"></i>
              </button>
              <button class="btn btn-outline-primary" title="編輯產品" onclick="UI.openProductModal('${p.id}')">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-outline-danger" title="刪除產品" onclick="UI.confirmDelete('product', '${p.id}', '${Format.escape(p.name)}')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openProductModal(id = null) {
    const modalEl = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    Validator.resetFormState(form);

    const titleEl = document.getElementById('productModalTitle');
    const idInput = document.getElementById('prod_id');
    const vendorSelect = document.getElementById('prod_vendorId');

    // 動態填入廠商管理下拉清單
    vendorSelect.innerHTML = `<option value="">-- 請選擇供應商（來自廠商管理） --</option>` +
      state.vendors.map(v => `<option value="${v.id}">${Format.escape(v.companyName)} (${v.id})</option>`).join('');

    if (id) {
      const product = state.products.find(p => p.id === id);
      if (!product) return;
      titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square me-2 text-warning"></i>編輯產品`;
      idInput.value = product.id;
      document.getElementById('prod_name').value = product.name;
      document.getElementById('prod_cost').value = product.cost;
      document.getElementById('prod_price').value = product.price;
      document.getElementById('prod_unit').value = product.unit || '台';
      document.getElementById('prod_brand').value = product.brand || '';
      document.getElementById('prod_spec').value = product.spec || '';
      document.getElementById('prod_description').value = product.description || '';
      document.getElementById('prod_stock').value = product.stock ?? 0;
      document.getElementById('prod_image').value = product.image || '';
      vendorSelect.value = product.vendorId || '';
    } else {
      titleEl.innerHTML = `<i class="fa-solid fa-boxes-stacked me-2 text-warning"></i>新增產品項目`;
      idInput.value = IDGenerator.getNextProductId();
      document.getElementById('prod_name').value = '';
      document.getElementById('prod_cost').value = '';
      document.getElementById('prod_price').value = '';
      document.getElementById('prod_unit').value = '台';
      document.getElementById('prod_brand').value = '';
      document.getElementById('prod_spec').value = '';
      document.getElementById('prod_description').value = '';
      document.getElementById('prod_stock').value = '10';
      document.getElementById('prod_image').value = '';
      vendorSelect.value = '';
    }

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  },

  saveProduct() {
    const form = document.getElementById('productForm');
    const saveBtn = document.getElementById('saveProductBtn');

    const id = document.getElementById('prod_id').value.trim();
    const name = document.getElementById('prod_name').value.trim();
    const cost = parseFloat(document.getElementById('prod_cost').value);
    const price = parseFloat(document.getElementById('prod_price').value);
    const unit = document.getElementById('prod_unit').value.trim();
    const brand = document.getElementById('prod_brand').value.trim();
    const spec = document.getElementById('prod_spec').value.trim();
    const description = document.getElementById('prod_description').value.trim();
    const stock = parseInt(document.getElementById('prod_stock').value, 10);
    const vendorId = document.getElementById('prod_vendorId').value;
    const image = document.getElementById('prod_image').value.trim();

    let hasError = false;

    // 必填檢查 1: 產品名稱
    if (!name) {
      Validator.setFieldState(document.getElementById('prod_name'), false, '請輸入產品名稱');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('prod_name'), true);
    }

    // 必填檢查 2: 成本
    if (isNaN(cost) || cost < 0) {
      Validator.setFieldState(document.getElementById('prod_cost'), false, '成本必須為大於或等於 0 的數字');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('prod_cost'), true);
    }

    // 必填檢查 3: 售價
    if (isNaN(price) || price < 0) {
      Validator.setFieldState(document.getElementById('prod_price'), false, '售價必須為大於或等於 0 的數字');
      hasError = true;
    } else if (price < cost) {
      // 防呆：售價若低於成本給予警示
      Validator.setFieldState(document.getElementById('prod_price'), false, `售價 (${price}) 不宜低於進貨成本 (${cost})`);
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('prod_price'), true);
    }

    if (hasError) return;

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>儲存中...`;

    setTimeout(() => {
      const existingIdx = state.products.findIndex(p => p.id === id);
      const productData = {
        id, name, cost, price, unit, brand, spec, description,
        stock: isNaN(stock) ? 0 : stock,
        vendorId, image
      };

      if (existingIdx >= 0) {
        state.products[existingIdx] = productData;
      } else {
        state.products.push(productData);
      }

      Storage.save();
      UI.renderProducts();
      UI.renderOverview();

      saveBtn.disabled = false;
      saveBtn.innerHTML = `<i class="fa-solid fa-check me-1"></i>儲存產品`;
      bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
    }, 400);
  },

  viewProductDetail(id) {
    const p = state.products.find(item => item.id === id);
    if (!p) return;
    const vendor = state.vendors.find(v => v.id === p.vendorId);
    const body = document.getElementById('detailModalBody');
    document.getElementById('detailModalTitle').innerHTML = `<i class="fa-solid fa-box-open me-2 text-warning"></i>產品明細 - ${Format.escape(p.name)}`;

    body.innerHTML = `
      <div class="row g-3">
        <div class="col-sm-6"><strong>產品代碼：</strong> <span class="badge bg-amber-subtle text-amber" style="background-color:#fef3c7; color:#b45309;">${p.id}</span></div>
        <div class="col-sm-6"><strong>供應廠商：</strong> ${Format.escape(vendor ? vendor.companyName : '未指定')}</div>
        <div class="col-sm-6"><strong>廠牌品牌：</strong> ${Format.escape(p.brand || '—')}</div>
        <div class="col-sm-6"><strong>計價單位：</strong> ${Format.escape(p.unit || '個')}</div>
        <div class="col-sm-6"><strong>進貨成本：</strong> ${Format.currency(p.cost)}</div>
        <div class="col-sm-6"><strong>建議售價：</strong> <span class="text-primary fw-bold">${Format.currency(p.price)}</span></div>
        <div class="col-sm-6"><strong>目前庫存：</strong> <span class="badge bg-secondary">${p.stock}</span></div>
        <div class="col-12"><strong>硬體規格：</strong> ${Format.escape(p.spec || '無')}</div>
        <div class="col-12"><strong>產品說明：</strong> ${Format.escape(p.description || '無')}</div>
      </div>
    `;

    bootstrap.Modal.getOrCreateInstance(document.getElementById('detailModal')).show();
  },

  // ==========================================================================
  // 報價單管理 (Quotation Management)
  // ==========================================================================
  renderQuotations() {
    const tableBody = document.getElementById('quotation-table-body');
    if (!tableBody) return;

    if (state.quotations.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">暫無報價單資料，請點擊上方「開立報價單」</td></tr>`;
      return;
    }

    tableBody.innerHTML = state.quotations.map(q => {
      const customer = state.customers.find(c => c.id === q.customerId);
      const customerName = customer ? customer.companyName : '未指定客戶';
      const itemCount = (q.items && q.items.length) || 0;

      return `
        <tr>
          <td><span class="badge bg-purple-subtle text-purple border code-badge" style="background-color:#f3e8ff; color:#7e22ce;">${Format.escape(q.id)}</span></td>
          <td>
            <div class="fw-bold text-dark">${Format.escape(customerName)}</div>
            <small class="text-muted">業務：${Format.escape(q.salesPerson)}</small>
          </td>
          <td>${q.date}</td>
          <td class="text-center"><span class="badge bg-light text-dark border">${itemCount} 項</span></td>
          <td class="text-end font-monospace fw-bold text-primary">${Format.currency(q.totalAmount)}</td>
          <td><small class="text-muted">${Format.escape(q.paymentTerms || '—')}</small></td>
          <td class="text-end">
            <div class="btn-group btn-group-sm">
              <button class="btn btn-outline-success" title="列印/查看正式報價單" onclick="UI.viewQuotationDetail('${q.id}')">
                <i class="fa-solid fa-print me-1"></i>檢視
              </button>
              <button class="btn btn-outline-primary" title="編輯報價單" onclick="UI.openQuotationModal('${q.id}')">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-outline-danger" title="刪除報價單" onclick="UI.confirmDelete('quotation', '${q.id}', '${Format.escape(q.id)} (${Format.escape(customerName)})')">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  openQuotationModal(id = null) {
    const modalEl = document.getElementById('quotationModal');
    const form = document.getElementById('quotationForm');
    Validator.resetFormState(form);

    const titleEl = document.getElementById('quotationModalTitle');
    const idInput = document.getElementById('quo_id');
    const custSelect = document.getElementById('quo_customerId');

    // 填充客戶下拉選單
    custSelect.innerHTML = `<option value="">-- 請選擇客戶（來自客戶管理） --</option>` +
      state.customers.map(c => `<option value="${c.id}">${Format.escape(c.companyName)} (${c.contactName})</option>`).join('');

    // 客戶選擇時聯動提示
    custSelect.onchange = () => {
      const selected = state.customers.find(c => c.id === custSelect.value);
      if (selected) {
        document.getElementById('quo_customerInfoHint').textContent =
          `統編: ${selected.taxId} | 聯絡人: ${selected.contactName} | 電話: ${selected.phone} | 地址: ${selected.address}`;
      } else {
        document.getElementById('quo_customerInfoHint').textContent = '';
      }
    };

    if (id) {
      const quote = state.quotations.find(q => q.id === id);
      if (!quote) return;
      titleEl.innerHTML = `<i class="fa-solid fa-pen-to-square me-2 text-primary"></i>編輯報價單 - ${quote.id}`;
      idInput.value = quote.id;
      document.getElementById('quo_date').value = quote.date;
      document.getElementById('quo_validUntil').value = quote.validUntil || '';
      custSelect.value = quote.customerId;
      document.getElementById('quo_salesPerson').value = quote.salesPerson;
      document.getElementById('quo_salesPhone').value = quote.salesPhone;
      document.getElementById('quo_salesAddress').value = quote.salesAddress;
      document.getElementById('quo_paymentTerms').value = quote.paymentTerms || '';
      document.getElementById('quo_notes').value = quote.notes || '';

      state.activeQuoteItems = JSON.parse(JSON.stringify(quote.items || []));
    } else {
      titleEl.innerHTML = `<i class="fa-solid fa-file-invoice-dollar me-2 text-primary"></i>開立新報價單`;
      idInput.value = IDGenerator.getNextQuotationId();
      const today = new Date().toISOString().split('T')[0];
      document.getElementById('quo_date').value = today;

      // 預設有效天數 30 天
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 30);
      document.getElementById('quo_validUntil').value = validDate.toISOString().split('T')[0];

      custSelect.value = '';
      document.getElementById('quo_customerInfoHint').textContent = '';
      document.getElementById('quo_salesPerson').value = '林業務專員';
      document.getElementById('quo_salesPhone').value = '02-2345-6789';
      document.getElementById('quo_salesAddress').value = '台北市信義區忠孝東路五段 1 號 22 樓';
      document.getElementById('quo_paymentTerms').value = '月結 30 天電匯';
      document.getElementById('quo_notes').value = '報價有效期限內下單保證供貨。含原廠保固與基本裝機。';

      // 預設加入第一筆空白品項
      state.activeQuoteItems = [
        {
          productId: state.products.length > 0 ? state.products[0].id : '',
          productName: state.products.length > 0 ? state.products[0].name : '',
          unitPrice: state.products.length > 0 ? state.products[0].price : 0,
          spec: state.products.length > 0 ? state.products[0].spec : '',
          quantity: 1,
          subtotal: state.products.length > 0 ? state.products[0].price : 0
        }
      ];
    }

    UI.renderQuotationItemRows();
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  },

  // 渲染報價單多品項清單
  renderQuotationItemRows() {
    const container = document.getElementById('quote-items-container');
    if (!container) return;

    if (state.activeQuoteItems.length === 0) {
      container.innerHTML = `<tr><td colspan="6" class="text-center py-3 text-muted">尚未加入任何產品品項，請點選下方「新增品項」</td></tr>`;
      UI.calculateQuotationTotal();
      return;
    }

    const productOptions = state.products.map(p =>
      `<option value="${p.id}">${Format.escape(p.name)} (${Format.currency(p.price)})</option>`
    ).join('');

    container.innerHTML = state.activeQuoteItems.map((item, index) => `
      <tr class="quote-item-row" data-index="${index}">
        <td style="min-width: 200px;">
          <select class="form-select form-select-sm quote-product-select" data-index="${index}">
            <option value="">-- 選擇產品（產品管理） --</option>
            ${state.products.map(p => `
              <option value="${p.id}" ${p.id === item.productId ? 'selected' : ''}>
                ${Format.escape(p.name)}
              </option>
            `).join('')}
          </select>
        </td>
        <td style="min-width: 180px;">
          <input type="text" class="form-control form-control-sm quote-spec-input" data-index="${index}" value="${Format.escape(item.spec || '')}" placeholder="規格/說明">
        </td>
        <td style="width: 130px;">
          <div class="input-group input-group-sm">
            <span class="input-group-text">$</span>
            <input type="number" class="form-control form-control-sm text-end quote-price-input" data-index="${index}" value="${item.unitPrice}" min="0">
          </div>
        </td>
        <td style="width: 90px;">
          <input type="number" class="form-control form-control-sm text-center quote-qty-input" data-index="${index}" value="${item.quantity}" min="1">
        </td>
        <td class="text-end fw-bold font-monospace align-middle" style="width: 140px;">
          <span class="quote-subtotal-display" data-index="${index}">${Format.currency(item.subtotal)}</span>
        </td>
        <td class="text-center align-middle" style="width: 50px;">
          <button type="button" class="btn btn-sm btn-link text-danger p-0" onclick="UI.removeQuoteItem(${index})" title="移除此品項">
            <i class="fa-solid fa-circle-minus fa-lg"></i>
          </button>
        </td>
      </tr>
    `).join('');

    // 綁定品項下拉與數值改變事件
    container.querySelectorAll('.quote-product-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const idx = parseInt(select.getAttribute('data-index'), 10);
        const prodId = select.value;
        const prod = state.products.find(p => p.id === prodId);
        if (prod) {
          state.activeQuoteItems[idx].productId = prod.id;
          state.activeQuoteItems[idx].productName = prod.name;
          state.activeQuoteItems[idx].unitPrice = prod.price;
          state.activeQuoteItems[idx].spec = prod.spec || prod.description || '';
          state.activeQuoteItems[idx].subtotal = prod.price * (state.activeQuoteItems[idx].quantity || 1);
        } else {
          state.activeQuoteItems[idx].productId = '';
          state.activeQuoteItems[idx].productName = '';
        }
        UI.renderQuotationItemRows();
      });
    });

    container.querySelectorAll('.quote-price-input').forEach(input => {
      input.addEventListener('input', () => {
        const idx = parseInt(input.getAttribute('data-index'), 10);
        const val = parseFloat(input.value) || 0;
        state.activeQuoteItems[idx].unitPrice = val;
        state.activeQuoteItems[idx].subtotal = val * (state.activeQuoteItems[idx].quantity || 0);
        const subtotalEl = container.querySelector(`.quote-subtotal-display[data-index="${idx}"]`);
        if (subtotalEl) subtotalEl.textContent = Format.currency(state.activeQuoteItems[idx].subtotal);
        UI.calculateQuotationTotal();
      });
    });

    container.querySelectorAll('.quote-qty-input').forEach(input => {
      input.addEventListener('input', () => {
        const idx = parseInt(input.getAttribute('data-index'), 10);
        const val = parseInt(input.value, 10) || 0;
        state.activeQuoteItems[idx].quantity = val;
        state.activeQuoteItems[idx].subtotal = (state.activeQuoteItems[idx].unitPrice || 0) * val;
        const subtotalEl = container.querySelector(`.quote-subtotal-display[data-index="${idx}"]`);
        if (subtotalEl) subtotalEl.textContent = Format.currency(state.activeQuoteItems[idx].subtotal);
        UI.calculateQuotationTotal();
      });
    });

    container.querySelectorAll('.quote-spec-input').forEach(input => {
      input.addEventListener('input', () => {
        const idx = parseInt(input.getAttribute('data-index'), 10);
        state.activeQuoteItems[idx].spec = input.value;
      });
    });

    UI.calculateQuotationTotal();
  },

  addQuoteItem() {
    const firstProd = state.products.length > 0 ? state.products[0] : null;
    state.activeQuoteItems.push({
      productId: firstProd ? firstProd.id : '',
      productName: firstProd ? firstProd.name : '',
      unitPrice: firstProd ? firstProd.price : 0,
      spec: firstProd ? (firstProd.spec || firstProd.description || '') : '',
      quantity: 1,
      subtotal: firstProd ? firstProd.price : 0
    });
    UI.renderQuotationItemRows();
  },

  removeQuoteItem(index) {
    if (state.activeQuoteItems.length <= 1) {
      alert('報價單至少必須保留一項產品項目！');
      return;
    }
    state.activeQuoteItems.splice(index, 1);
    UI.renderQuotationItemRows();
  },

  calculateQuotationTotal() {
    const subtotal = state.activeQuoteItems.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const subEl = document.getElementById('quo_calc_subtotal');
    const taxEl = document.getElementById('quo_calc_tax');
    const totalEl = document.getElementById('quo_calc_total');

    if (subEl) subEl.textContent = Format.currency(subtotal);
    if (taxEl) taxEl.textContent = Format.currency(tax);
    if (totalEl) totalEl.textContent = Format.currency(total);
  },

  saveQuotation() {
    const saveBtn = document.getElementById('saveQuotationBtn');

    const id = document.getElementById('quo_id').value.trim();
    const date = document.getElementById('quo_date').value.trim();
    const validUntil = document.getElementById('quo_validUntil').value.trim();
    const customerId = document.getElementById('quo_customerId').value;
    const salesPerson = document.getElementById('quo_salesPerson').value.trim();
    const salesPhone = document.getElementById('quo_salesPhone').value.trim();
    const salesAddress = document.getElementById('quo_salesAddress').value.trim();
    const paymentTerms = document.getElementById('quo_paymentTerms').value.trim();
    const notes = document.getElementById('quo_notes').value.trim();

    let hasError = false;

    // 必填檢查 1: 客戶名稱
    if (!customerId) {
      Validator.setFieldState(document.getElementById('quo_customerId'), false, '請選擇報價客戶');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('quo_customerId'), true);
    }

    // 必填檢查 2: 報價人員
    if (!salesPerson) {
      Validator.setFieldState(document.getElementById('quo_salesPerson'), false, '請輸入報價人員姓名');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('quo_salesPerson'), true);
    }

    // 必填檢查 3: 聯絡電話
    if (!Validator.isPhone(salesPhone)) {
      Validator.setFieldState(document.getElementById('quo_salesPhone'), false, '請輸入正確的聯絡電話');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('quo_salesPhone'), true);
    }

    // 必填檢查 4: 住址
    if (!salesAddress) {
      Validator.setFieldState(document.getElementById('quo_salesAddress'), false, '請輸入報價方地址');
      hasError = true;
    } else {
      Validator.setFieldState(document.getElementById('quo_salesAddress'), true);
    }

    // 必填檢查 5: 多品項品名與數量防呆
    if (state.activeQuoteItems.length === 0) {
      alert('報價單至少必須有一項產品！');
      return;
    }

    for (let i = 0; i < state.activeQuoteItems.length; i++) {
      const it = state.activeQuoteItems[i];
      if (!it.productId) {
        alert(`第 ${i + 1} 個品項尚未選擇產品！`);
        return;
      }
      if (it.quantity <= 0) {
        alert(`第 ${i + 1} 個品項數量必須大於 0！`);
        return;
      }
    }

    if (hasError) return;

    saveBtn.disabled = true;
    saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>開立中...`;

    setTimeout(() => {
      const subtotal = state.activeQuoteItems.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);
      const taxAmount = Math.round(subtotal * 0.05);
      const totalAmount = subtotal + taxAmount;

      const quotationData = {
        id, date, validUntil, customerId, salesPerson, salesPhone, salesAddress,
        items: JSON.parse(JSON.stringify(state.activeQuoteItems)),
        subtotal,
        taxRate: 0.05,
        taxAmount,
        totalAmount,
        paymentTerms,
        notes
      };

      const existingIdx = state.quotations.findIndex(q => q.id === id);
      if (existingIdx >= 0) {
        state.quotations[existingIdx] = quotationData;
      } else {
        state.quotations.push(quotationData);
      }

      Storage.save();
      UI.renderQuotations();
      UI.renderOverview();

      saveBtn.disabled = false;
      saveBtn.innerHTML = `<i class="fa-solid fa-check me-1"></i>儲存報價單`;
      bootstrap.Modal.getInstance(document.getElementById('quotationModal')).hide();
    }, 400);
  },

  viewQuotationDetail(id) {
    const q = state.quotations.find(item => item.id === id);
    if (!q) return;
    const customer = state.customers.find(c => c.id === q.customerId);
    const body = document.getElementById('quotationPrintModalBody');

    body.innerHTML = `
      <div class="print-area p-3 p-md-4">
        <!-- 報價單抬頭與公司標籤 -->
        <div class="d-flex justify-content-between align-items-start border-bottom pb-4 mb-4">
          <div>
            <h2 class="text-primary fw-bold mb-1">
              <i class="fa-solid fa-building-shield me-2"></i>鼎峰企業智能系統股份有限公司
            </h2>
            <div class="text-muted small">APEX SMART ENTERPRISE CO., LTD.</div>
            <div class="small mt-2">地址：${Format.escape(q.salesAddress)}</div>
            <div class="small">電話：${Format.escape(q.salesPhone)} | 統一編號：88997766</div>
          </div>
          <div class="text-end">
            <div class="display-6 fw-bold text-dark" style="font-size: 1.8rem;">正式報價單</div>
            <div class="badge bg-purple-subtle text-purple border code-badge fs-6 mt-1" style="background-color:#f3e8ff; color:#7e22ce;">
              ${Format.escape(q.id)}
            </div>
            <div class="small text-muted mt-2">報價日期：${q.date}</div>
            <div class="small text-muted">有效期限：${q.validUntil || '自報價日起30天'}</div>
          </div>
        </div>

        <!-- 買方與賣方資訊雙欄佈局 -->
        <div class="row g-4 mb-4">
          <div class="col-md-6">
            <div class="p-3 bg-light rounded border h-100">
              <h6 class="fw-bold text-primary border-bottom pb-2 mb-2">
                <i class="fa-solid fa-user-tie me-1"></i>客戶資訊 (Customer)
              </h6>
              <div><strong>客戶名稱：</strong> ${Format.escape(customer ? customer.companyName : '—')}</div>
              <div><strong>統一編號：</strong> ${Format.escape(customer ? customer.taxId : '—')}</div>
              <div><strong>聯絡窗口：</strong> ${Format.escape(customer ? customer.contactName : '—')} (${Format.escape(customer ? customer.department || '' : '')})</div>
              <div><strong>聯絡電話：</strong> ${Format.escape(customer ? customer.phone : '—')}</div>
              <div><strong>送貨住址：</strong> ${Format.escape(customer ? customer.address : '—')}</div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-3 bg-light rounded border h-100">
              <h6 class="fw-bold text-primary border-bottom pb-2 mb-2">
                <i class="fa-solid fa-briefcase me-1"></i>報價窗口 (Sales Representative)
              </h6>
              <div><strong>報價業務：</strong> ${Format.escape(q.salesPerson)}</div>
              <div><strong>業務專線：</strong> ${Format.escape(q.salesPhone)}</div>
              <div><strong>付款條件：</strong> ${Format.escape(q.paymentTerms || '月結 30 天電匯')}</div>
              <div><strong>報價幣別：</strong> 新台幣 (NTD / TWD)</div>
              <div><strong>發票開立：</strong> 二聯式 / 三聯式電子發票</div>
            </div>
          </div>
        </div>

        <!-- 報價品項明細表格 -->
        <div class="table-responsive mb-4">
          <table class="table table-bordered align-middle">
            <thead class="table-light">
              <tr>
                <th style="width: 50px;" class="text-center">項次</th>
                <th>產品名稱</th>
                <th>規格與說明</th>
                <th style="width: 120px;" class="text-end">單價</th>
                <th style="width: 80px;" class="text-center">數量</th>
                <th style="width: 140px;" class="text-end">複價 (小計)</th>
              </tr>
            </thead>
            <tbody>
              ${(q.items || []).map((it, idx) => `
                <tr>
                  <td class="text-center font-monospace">${idx + 1}</td>
                  <td class="fw-bold">${Format.escape(it.productName)}</td>
                  <td class="small text-muted">${Format.escape(it.spec || '—')}</td>
                  <td class="text-end font-monospace">${Format.currency(it.unitPrice)}</td>
                  <td class="text-center font-monospace">${it.quantity}</td>
                  <td class="text-end font-monospace fw-bold">${Format.currency(it.subtotal)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" class="text-end border-0">未稅金額小計 (Subtotal)：</td>
                <td colspan="2" class="text-end font-monospace border-0">${Format.currency(q.subtotal)}</td>
              </tr>
              <tr>
                <td colspan="4" class="text-end border-0">營業稅 5% (VAT 5%)：</td>
                <td colspan="2" class="text-end font-monospace border-0">${Format.currency(q.taxAmount)}</td>
              </tr>
              <tr class="table-light">
                <td colspan="4" class="text-end fw-bold fs-6">報價總計 (Grand Total)：</td>
                <td colspan="2" class="text-end font-monospace fw-bold text-primary fs-5">${Format.currency(q.totalAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <!-- 備註與客戶簽署區塊 -->
        <div class="row g-4 mt-2">
          <div class="col-md-7">
            <div class="p-3 border rounded">
              <h6 class="fw-bold text-secondary mb-2"><i class="fa-solid fa-circle-info me-1"></i>交易條款與備註事項：</h6>
              <div class="small text-muted" style="white-space: pre-line;">${Format.escape(q.notes || '無特殊條款。')}</div>
            </div>
          </div>
          <div class="col-md-5">
            <div class="p-3 border rounded text-center" style="min-height: 120px;">
              <div class="small text-muted mb-4">客戶確認簽章 (請簽署後回傳)：</div>
              <div class="border-bottom border-dark mx-auto" style="width: 80%; height: 40px;"></div>
              <div class="small text-muted mt-2">簽署日期：____ 年 ____ 月 ____ 日</div>
            </div>
          </div>
        </div>
      </div>
    `;

    bootstrap.Modal.getOrCreateInstance(document.getElementById('quotationPrintModal')).show();
  },

  // ==========================================================================
  // 通用刪除確認機制 (Delete Confirmation with safety dialog)
  // ==========================================================================
  confirmDelete(type, id, name) {
    state.deleteTarget = { type, id, name };
    const modalEl = document.getElementById('deleteConfirmModal');
    document.getElementById('deleteTargetName').textContent = `${name} [代碼: ${id}]`;
    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  },

  executeDelete() {
    if (!state.deleteTarget) return;
    const { type, id } = state.deleteTarget;

    if (type === 'customer') {
      state.customers = state.customers.filter(c => c.id !== id);
      UI.renderCustomers();
    } else if (type === 'vendor') {
      state.vendors = state.vendors.filter(v => v.id !== id);
      UI.renderVendors();
    } else if (type === 'product') {
      state.products = state.products.filter(p => p.id !== id);
      UI.renderProducts();
    } else if (type === 'quotation') {
      state.quotations = state.quotations.filter(q => q.id !== id);
      UI.renderQuotations();
    }

    Storage.save();
    UI.renderOverview();

    state.deleteTarget = null;
    bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
  },

  bindModals() {
    // 綁定客戶儲存按鈕
    document.getElementById('saveCustomerBtn').addEventListener('click', UI.saveCustomer);
    // 綁定廠商儲存按鈕
    document.getElementById('saveVendorBtn').addEventListener('click', UI.saveVendor);
    // 綁定產品儲存按鈕
    document.getElementById('saveProductBtn').addEventListener('click', UI.saveProduct);
    // 綁定報價單儲存按鈕
    document.getElementById('saveQuotationBtn').addEventListener('click', UI.saveQuotation);
    // 綁定品項新增按鈕
    document.getElementById('addQuoteItemBtn').addEventListener('click', UI.addQuoteItem);
    // 綁定確認刪除按鈕
    document.getElementById('confirmDeleteBtn').addEventListener('click', UI.executeDelete);
    // 綁定列印按鈕
    document.getElementById('printQuotationBtn').addEventListener('click', () => {
      window.print();
    });
  }
};

// 頁面加載後啟動系統
document.addEventListener('DOMContentLoaded', () => {
  UI.init();
});
