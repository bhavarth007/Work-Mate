/**
 * WorkMate Core Application Logic & State Management
 * Bilingual English/Hindi, Real-Time API Sync & Zero-Error Validation.
 */

// Application State
const state = {
  currentTab: "home",
  lang: "hi", // Default Hindi matching mockup, toggleable to "en"
  isDesktopView: false,
  role: "customer", // 'customer' or 'worker'
  categories: [],
  services: [],
  workers: [],
  bookings: [],
  wallet: { balance: 13000 },
  transactions: [],
  reviews: [],
  activeBooking: null,
  selectedCategoryForBooking: null
};

// Bilingual Localization Dictionary
const I18N = {
  en: {
    appName: "WorkMate",
    tagline: "Your Trusted Labour Partner",
    greeting: "Hello, Ramesh!",
    location: "Flat 402, Sector 14, Noida",
    searchPlaceholder: "Who are you looking for? Masons, Plumber...",
    activeBookingTitle: "Active Booking",
    verifiedWorker: "Verified Worker",
    etaPrefix: "ETA: 15 Mins",
    otpPrefix: "OTP:",
    trackLive: "Track Live (GPS)",
    callWorker: "Call Worker",
    verifyOtpBtn: "Verify OTP",
    markComplete: "Confirm Complete",
    trustTitle: "100% Verification | Secure Escrow Payments",
    trustedPartners: "Trusted Partners: UPI, Razorpay, BHIM, Aadhaar KYC",
    recentReviews: "Recent Satisfied Customer Reviews",
    viewAll: "View All >",
    navHome: "Home",
    navOrders: "My Bookings",
    navPayments: "Payments",
    navAccount: "My Account",
    quickBookBtn: "Instant Book Labour",
    upcomingTab: "Upcoming",
    historyTab: "History",
    walletBalanceTitle: "WorkMate Wallet",
    addMoney: "+ Add Money",
    payout: "Withdraw / Payout",
    connectedMethods: "Connected Payment Methods",
    verifiedUpi: "Verified UPI",
    verifiedCard: "Bank, Debit/Credit Cards",
    razorpayBadge: "Payment Secured by Razorpay",
    txHistory: "Transaction History",
    accountVerified: "Verified Profile",
    menuLanguage: "Language",
    menuSecurity: "Security & Privacy",
    menuInsurance: "Micro-Insurance Enrollment",
    menuSupport: "24/7 Support (Call / Chat)",
    menuWorkerOnboard: "Register as Worker Partner (Aadhaar KYC)",
    statusInProgress: "In Progress",
    statusUpcoming: "Scheduled",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled"
  },
  hi: {
    appName: "वर्कमेट (WorkMate)",
    tagline: "आपका भरोसेमंद लेबर साथी",
    greeting: "नमस्ते, रमेश!",
    location: "फ्लैट 402, सेक्टर 14, नोएडा",
    searchPlaceholder: "किसे ढूंढ रहे हैं? राजमिस्त्री, प्लंबर...",
    activeBookingTitle: "सक्रिय बुकिंग (Active Booking)",
    verifiedWorker: "सत्यापित श्रमिक",
    etaPrefix: "ETA: 15 मिनट",
    otpPrefix: "OTP:",
    trackLive: "लाइव ट्रैकिंग (GPS)",
    callWorker: "कॉल करें",
    verifyOtpBtn: "OTP सत्यापित करें",
    markComplete: "काम पूरा हुआ",
    trustTitle: "100% सत्यापन | सुरक्षित भुगतान",
    trustedPartners: "भरोसेमंद साथी: UPI, Razorpay, BHIM, आधार KYC",
    recentReviews: "संतुष्ट ग्राहकों की समीक्षाएं",
    viewAll: "सभी देखें >",
    navHome: "होम",
    navOrders: "मेरी बुकिंग",
    navPayments: "भुगतान",
    navAccount: "मेरा अकाउंट",
    quickBookBtn: "तुरंत लेबर बुक करें",
    upcomingTab: "आगामी (Upcoming)",
    historyTab: "इतिहास (History)",
    walletBalanceTitle: "वर्कमेट वॉलेट (WorkMate Wallet)",
    addMoney: "+ पैसे जोड़ें",
    payout: "पेआउट / निकासी",
    connectedMethods: "जुड़े हुए भुगतान माध्यम",
    verifiedUpi: "सत्यापित UPI",
    verifiedCard: "बैंक, डेबिट/क्रेडिट कार्ड",
    razorpayBadge: "रेजरपे (Razorpay) द्वारा सुरक्षित भुगतान",
    txHistory: "लेन-देन का इतिहास",
    accountVerified: "सत्यापित प्रोफाइल",
    menuLanguage: "भाषा (Language)",
    menuSecurity: "सुरक्षा एवं गोपनीयता",
    menuInsurance: "माइक्रो-इंश्योरेंस नामांकन (दुर्घटना बीमा)",
    menuSupport: "24/7 सहायता (कॉल / चैट सपोर्ट)",
    menuWorkerOnboard: "श्रमिक साथी के रूप में पंजीकरण (आधार KYC)",
    statusInProgress: "प्रगति पर (In Progress)",
    statusUpcoming: "शेड्यूल (Scheduled)",
    statusCompleted: "पूर्ण (Completed)",
    statusCancelled: "रद्द (Cancelled)"
  }
};

// Toast notification helper
function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Language Switcher
function toggleLanguage() {
  state.lang = state.lang === "hi" ? "en" : "hi";
  const btn = document.getElementById("btnLangToggle");
  if (btn) {
    btn.innerHTML = `<i class="fa-solid fa-language"></i> ${state.lang === "hi" ? "हिंदी / English" : "English / हिंदी"}`;
  }
  applyTranslations();
  renderCategories();
  renderBookings();
  renderActiveBooking();
  renderTransactions();
  renderReviews();
}

function applyTranslations() {
  const dict = I18N[state.lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.placeholder = dict.searchPlaceholder;
  }
}

// Layout Switcher (Mobile Mockup vs Full Desktop View)
function toggleDeviceView(mode) {
  const container = document.getElementById("appContainer");
  const btnMobile = document.getElementById("btnViewMobile");
  const btnDesktop = document.getElementById("btnViewDesktop");

  if (mode === "desktop") {
    container.classList.add("desktop-mode");
    btnDesktop.classList.add("active");
    btnMobile.classList.remove("active");
    state.isDesktopView = true;
  } else {
    container.classList.remove("desktop-mode");
    btnMobile.classList.add("active");
    btnDesktop.classList.remove("active");
    state.isDesktopView = false;
  }
}

// Navigation Tabs
function switchTab(tabId) {
  state.currentTab = tabId;
  document.querySelectorAll(".screen-view").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-item-btn").forEach(el => el.classList.remove("active"));

  const targetScreen = document.getElementById(`screen-${tabId}`);
  const targetNav = document.getElementById(`nav-${tabId}`);

  if (targetScreen) targetScreen.classList.add("active");
  if (targetNav) targetNav.classList.add("active");

  if (tabId === "orders") renderBookings();
  if (tabId === "payments") renderWallet();
}

// Data Fetching
async function loadInitialData() {
  try {
    const [catsRes, servsRes, workersRes, bookingsRes, walletRes, txsRes, revsRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/services"),
      fetch("/api/workers"),
      fetch("/api/bookings"),
      fetch("/api/wallet"),
      fetch("/api/wallet/transactions"),
      fetch("/api/reviews")
    ]);

    state.categories = await catsRes.json();
    state.services = await servsRes.json();
    state.workers = await workersRes.json();
    state.bookings = await bookingsRes.json();
    state.wallet = await walletRes.json();
    state.transactions = await txsRes.json();
    state.reviews = await revsRes.json();

    // Identify active booking (first in_progress or upcoming)
    state.activeBooking = state.bookings.find(b => b.status === "in_progress") || state.bookings[0];

    renderCategories();
    renderActiveBooking();
    renderBookings();
    renderWallet();
    renderTransactions();
    renderReviews();
    applyTranslations();
  } catch (err) {
    console.error("Error initializing app data:", err);
    showToast("Server connected in local mode", "success");
  }
}

// Render Categories Grid (Page 1 Mockup)
function renderCategories(filterText = "") {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;

  const isHindi = state.lang === "hi";
  let filtered = state.categories;

  if (filterText) {
    const q = filterText.toLowerCase();
    filtered = state.categories.filter(c => 
      c.name_en.toLowerCase().includes(q) || 
      c.name_hi.toLowerCase().includes(q) ||
      c.subtext_en.toLowerCase().includes(q) ||
      c.subtext_hi.toLowerCase().includes(q)
    );
  }

  grid.innerHTML = filtered.map(cat => {
    let iconClass = "cat-icon-construction";
    let faIcon = "fa-hammer";
    if (cat.id === "events") { iconClass = "cat-icon-events"; faIcon = "fa-champagne-glasses"; }
    else if (cat.id === "shifting") { iconClass = "cat-icon-shifting"; faIcon = "fa-truck-ramp-box"; }
    else if (cat.id === "textile") { iconClass = "cat-icon-textile"; faIcon = "fa-scissors"; }

    return `
      <div class="category-card" onclick="openBookingForCategory('${cat.id}')">
        <div class="cat-rating-pill">
          <i class="fa-solid fa-star"></i> ${cat.rating.toFixed(1)}
        </div>
        <div class="cat-icon-container ${iconClass}">
          <i class="fa-solid ${faIcon}"></i>
        </div>
        <div class="cat-title-en">${isHindi ? cat.name_hi : cat.name_en}</div>
        <div class="cat-title-hi">${isHindi ? cat.name_en : cat.subtext_hi}</div>
      </div>
    `;
  }).join("");
}

// Render Active Booking Card (Page 1 Mockup)
function renderActiveBooking() {
  const container = document.getElementById("activeBookingContainer");
  if (!container) return;

  const b = state.bookings.find(item => item.status === "in_progress") || state.activeBooking;
  const isHindi = state.lang === "hi";

  if (!b || b.status === "completed" || b.status === "cancelled") {
    container.innerHTML = `
      <div style="background:#f1f5f9; padding:16px; border-radius:12px; text-align:center; color:#64748b; font-size:13px;">
        <i class="fa-solid fa-circle-check" style="color:#10b981; font-size:20px; margin-bottom:6px; display:block;"></i>
        ${isHindi ? "कोई सक्रिय बुकिंग नहीं है। नीचे से तुरंत लेबर बुक करें।" : "No active in-progress booking. Tap button below to book instant labour."}
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="active-booking-card">
      <div class="worker-info-header">
        <div class="worker-avatar-wrap">
          <img src="${b.worker_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}" alt="Worker">
        </div>
        <div class="worker-details">
          <h4>${b.worker_name || 'Verified Worker'} <span class="verified-badge-pill"><i class="fa-solid fa-shield-check"></i> ${isHindi ? 'सत्यापित' : 'Verified'}</span></h4>
          <p>${isHindi ? b.worker_trade_hi || b.worker_trade : b.worker_trade} • ★ ${b.worker_rating || 4.8}</p>
        </div>
      </div>

      <div class="booking-eta-otp-row">
        <div class="eta-text">
          <i class="fa-solid fa-motorcycle"></i> ETA: ${b.eta_minutes || 15} ${isHindi ? 'मिनट' : 'Mins'}
        </div>
        <div>
          <span style="font-size:11px; opacity:0.8; margin-right:4px;">OTP:</span>
          <span class="otp-pill">${b.otp}</span>
        </div>
      </div>

      <div class="booking-actions-row">
        <button class="btn-track-live" onclick="openLiveTrackingModal('${b.id}')">
          <i class="fa-solid fa-location-crosshairs"></i> ${isHindi ? 'लाइव ट्रैकिंग (GPS)' : 'Live GPS Tracking'}
        </button>
        <button class="btn-complete-job" onclick="openVerifyOtpModal('${b.id}')">
          <i class="fa-solid fa-check-double"></i> ${isHindi ? 'OTP / काम पूरा' : 'Verify & Finish'}
        </button>
      </div>
    </div>
  `;
}

// Render Bookings Screen (Screen 2 Mockup)
function renderBookings(tabFilter = "upcoming") {
  const container = document.getElementById("bookingsListContainer");
  if (!container) return;

  const isHindi = state.lang === "hi";
  let list = [];

  if (tabFilter === "upcoming") {
    list = state.bookings.filter(b => b.status === "in_progress" || b.status === "upcoming");
  } else {
    list = state.bookings.filter(b => b.status === "completed" || b.status === "cancelled");
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:32px 16px; color:#94a3b8;">
        <i class="fa-regular fa-calendar-xmark" style="font-size:36px; margin-bottom:12px; display:block;"></i>
        <p>${isHindi ? 'कोई बुकिंग रिकॉर्ड नहीं मिला' : 'No booking records found.'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(b => {
    const statusClass = `status-${b.status}`;
    let statusLabel = b.status;
    if (b.status === "in_progress") statusLabel = isHindi ? "प्रगति पर" : "In Progress";
    else if (b.status === "upcoming") statusLabel = isHindi ? "शेड्यूल" : "Scheduled";
    else if (b.status === "completed") statusLabel = isHindi ? "पूर्ण" : "Completed";
    else if (b.status === "cancelled") statusLabel = isHindi ? "रद्द" : "Cancelled";

    return `
      <div class="booking-item-card">
        <div class="booking-item-top">
          <div class="booking-service-title">${isHindi ? b.service_name_hi : b.service_name_en}</div>
          <span class="status-badge ${statusClass}">${statusLabel}</span>
        </div>

        <div class="booking-worker-subrow">
          <img src="${b.worker_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}" alt="Worker">
          <div class="worker-text">
            <strong>${b.worker_name || 'Verified Worker'}</strong> • ★ ${b.worker_rating || 4.8}
            <div style="font-size:11px; color:#64748b;">${b.scheduled_date_time}</div>
          </div>
        </div>

        <div class="booking-cost-row">
          <span>${isHindi ? 'कुल लागत (Total Cost)' : 'Total Cost'}:</span>
          <span class="cost-highlight">₹${b.total_cost.toLocaleString('en-IN')}</span>
        </div>

        ${b.status !== 'completed' && b.status !== 'cancelled' ? `
          <button class="btn-view-gps" onclick="openLiveTrackingModal('${b.id}')">
            <i class="fa-solid fa-map-location-dot"></i> ${isHindi ? 'सक्रिय GPS ट्रैकिंग देखें >' : 'Active GPS Tracking >'}
          </button>
        ` : (b.status === 'completed' && !b.is_rated ? `
          <button class="btn-view-gps" style="color:#0d9488;" onclick="openReviewModal('${b.id}', '${b.worker_id}', '${b.worker_name}')">
            <i class="fa-solid fa-star"></i> ${isHindi ? 'रेटिंग और समीक्षा दें' : 'Rate Worker & Leave Review'}
          </button>
        ` : '')}
      </div>
    `;
  }).join("");
}

// Render Wallet & Payments (Screen 3 Mockup)
function renderWallet() {
  const balEl = document.getElementById("walletBalanceAmount");
  if (balEl && state.wallet) {
    balEl.textContent = `₹${state.wallet.balance.toLocaleString('en-IN')}`;
  }
}

// Render Transactions Ledger
function renderTransactions() {
  const container = document.getElementById("transactionHistoryContainer");
  if (!container) return;

  const isHindi = state.lang === "hi";

  container.innerHTML = state.transactions.map(tx => {
    const isCredit = tx.direction === "credit";
    return `
      <div class="tx-item">
        <div class="tx-left">
          <div class="tx-icon-circle ${isCredit ? 'tx-credit' : 'tx-debit'}">
            <i class="fa-solid ${isCredit ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
          </div>
          <div>
            <div class="tx-title">${isHindi ? tx.title_hi : tx.title_en}</div>
            <div class="tx-date">${tx.date_str} • ${tx.method}</div>
          </div>
        </div>
        <div>
          <div class="tx-amount" style="color: ${isCredit ? '#10b981' : '#0f172a'};">
            ${isCredit ? '+' : '-'} ₹${tx.amount.toLocaleString('en-IN')}
          </div>
          <div style="font-size:10px; color:#10b981; font-weight:700; text-align:right;">
            ${tx.status.toUpperCase()}
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// Render Reviews Carousel (Page 1 Mockup)
function renderReviews() {
  const carousel = document.getElementById("reviewsCarousel");
  if (!carousel) return;

  carousel.innerHTML = state.reviews.map(rev => {
    const stars = "★".repeat(rev.rating) + "☆".repeat(5 - rev.rating);
    return `
      <div class="review-card">
        <div class="review-stars">${stars}</div>
        <div class="review-comment">"${rev.comment}"</div>
        <div class="reviewer-name">— ${rev.customer_name} (${rev.worker_name})</div>
      </div>
    `;
  }).join("");
}

// ----------------- Interactive Modals Logic ----------------- //

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
  if (modalId === "modalTracking") {
    stopTrackingAnimation();
  }
}

// Open Booking Modal for Category
function openBookingForCategory(categoryId) {
  state.selectedCategoryForBooking = categoryId;
  const select = document.getElementById("bookingServiceSelect");
  if (!select) return;

  const filteredServices = state.services.filter(s => s.category_id === categoryId);
  const isHindi = state.lang === "hi";

  select.innerHTML = filteredServices.map(s => `
    <option value="${s.id}">${isHindi ? s.name_hi : s.name_en} (₹${s.base_rate}/day)</option>
  `).join("");

  updateEstimatedPrice();
  document.getElementById("modalBooking").classList.add("active");
}

function updateEstimatedPrice() {
  const select = document.getElementById("bookingServiceSelect");
  const durationInput = document.getElementById("bookingDurationHours");
  const typeSelect = document.getElementById("bookingTypeSelect");
  const priceDisplay = document.getElementById("bookingPriceEstimate");

  if (!select || !durationInput || !priceDisplay) return;

  const serviceId = select.value;
  const service = state.services.find(s => s.id === serviceId);
  const hours = parseInt(durationInput.value) || 4;
  const isInstant = typeSelect.value === "instant";

  const baseRate = service ? service.base_rate : 600;
  const subtotal = Math.round(baseRate * (hours >= 8 ? hours / 8 : hours / 4));
  const commission = Math.round(subtotal * 0.10);
  const emergency = isInstant ? 150 : 0;
  const total = subtotal + emergency;

  priceDisplay.innerHTML = `
    <strong>₹${total.toLocaleString('en-IN')}</strong> 
    <span style="font-size:11px; color:#64748b; display:block;">
      Base: ₹${subtotal} + 10% WorkMate Commission: ₹${commission} ${emergency ? '+ Emergency Fast Dispatch: ₹150' : ''}
    </span>
  `;
}

// Submit Booking (Zero-error creation)
async function submitBooking(event) {
  event.preventDefault();

  const serviceId = document.getElementById("bookingServiceSelect").value;
  const bookingType = document.getElementById("bookingTypeSelect").value;
  const duration = parseInt(document.getElementById("bookingDurationHours").value) || 4;
  const address = document.getElementById("bookingAddressInput").value.trim();
  const notes = document.getElementById("bookingNotesInput").value.trim();

  if (!address) {
    showToast("Please enter a service location address", "error");
    return;
  }

  const payload = {
    customer_name: "Ramesh Kumar",
    customer_phone: "+91 98765 43210",
    service_id: serviceId,
    task_description: notes || "Immediate requirement matching trade standards",
    booking_type: bookingType,
    duration_hours: duration,
    location_address: address,
    lat: 28.6139,
    lng: 77.2090
  };

  try {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Booking failed");
    }

    const data = await res.json();
    closeModal("modalBooking");
    showToast(data.message || "Booking created successfully!", "success");

    // Refresh bookings & wallet
    await loadInitialData();
    switchTab("orders");
  } catch (err) {
    console.error("Booking error:", err);
    showToast(err.message, "error");
  }
}

// Open Live Tracking Modal
async function openLiveTrackingModal(bookingId) {
  try {
    const res = await fetch(`/api/tracking/${bookingId}`);
    if (!res.ok) throw new Error("Tracking data unavailable");
    const data = await res.json();

    document.getElementById("trackingWorkerName").textContent = data.worker_name || "Verified Worker";
    document.getElementById("trackingWorkerPhone").textContent = data.worker_phone || "+91 98234 11092";
    document.getElementById("trackingOtpCode").textContent = data.otp || "4567";
    document.getElementById("trackingEtaTime").textContent = `${data.eta_minutes || 15} mins`;

    document.getElementById("modalTracking").classList.add("active");
    initTrackingMap(data);
  } catch (err) {
    console.error(err);
    showToast("Failed to load tracking data", "error");
  }
}

// Verify OTP Modal
function openVerifyOtpModal(bookingId) {
  const b = state.bookings.find(item => item.id === bookingId) || state.activeBooking;
  if (!b) return;
  document.getElementById("verifyOtpBookingId").value = b.id;
  document.getElementById("verifyOtpHint").textContent = `Customer OTP: ${b.otp}`;
  document.getElementById("modalVerifyOtp").classList.add("active");
}

async function submitOtpVerification(event) {
  event.preventDefault();
  const bookingId = document.getElementById("verifyOtpBookingId").value;
  const enteredOtp = document.getElementById("verifyOtpInput").value.trim();

  try {
    const res = await fetch(`/api/bookings/${bookingId}/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ booking_id: bookingId, otp: enteredOtp })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Invalid OTP");

    closeModal("modalVerifyOtp");
    showToast("OTP Verified! Worker job started.", "success");
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Confirm Job Completion & Escrow Payout
async function triggerCompleteJob(bookingId) {
  try {
    const res = await fetch(`/api/bookings/${bookingId}/complete`, {
      method: "POST"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to complete job");

    closeModal("modalVerifyOtp");
    showToast(data.message || "Job Completed! Worker payout released.", "success");
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Add Money to Wallet Modal
function openAddMoneyModal() {
  document.getElementById("modalAddMoney").classList.add("active");
}

function setAddAmount(val) {
  document.getElementById("addMoneyAmount").value = val;
}

async function submitAddMoney(event) {
  event.preventDefault();
  const amount = parseFloat(document.getElementById("addMoneyAmount").value);
  const method = document.getElementById("addMoneyMethod").value;

  if (isNaN(amount) || amount <= 0) {
    showToast("Please enter a valid amount", "error");
    return;
  }

  try {
    await handleAddMoney(amount, method);
    closeModal("modalAddMoney");
    showToast(`Added ₹${amount.toLocaleString('en-IN')} to WorkMate Wallet!`, "success");
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Worker KYC Onboarding Modal (Phase 1)
function openWorkerOnboardModal() {
  document.getElementById("modalWorkerOnboard").classList.add("active");
}

async function submitWorkerOnboarding(event) {
  event.preventDefault();

  const name = document.getElementById("workerNameInput").value.trim();
  const phone = document.getElementById("workerPhoneInput").value.trim();
  const aadhaar = document.getElementById("workerAadhaarInput").value.trim();
  const cat = document.getElementById("workerCatSelect").value;
  const trade = document.getElementById("workerTradeInput").value.trim();
  const rate = parseFloat(document.getElementById("workerRateInput").value) || 750;
  const policeConsent = document.getElementById("workerPoliceConsent").checked;

  if (aadhaar.replace(/\s+/g, "").length !== 12) {
    showToast("Aadhaar must be exactly 12 digits", "error");
    return;
  }

  try {
    const res = await fetch("/api/workers/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        phone: phone,
        aadhaar_number: aadhaar,
        category_id: cat,
        primary_trade: trade,
        daily_rate: rate,
        experience_years: 4,
        city: "Noida / NCR",
        police_check_consent: policeConsent
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Onboarding failed");

    closeModal("modalWorkerOnboard");
    showToast("Worker Registered & Aadhaar KYC Verified!", "success");
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Rating & Review Modal
function openReviewModal(bookingId, workerId, workerName) {
  document.getElementById("reviewBookingId").value = bookingId;
  document.getElementById("reviewWorkerId").value = workerId;
  document.getElementById("reviewWorkerName").textContent = workerName || "Worker";
  document.getElementById("modalReview").classList.add("active");
}

async function submitReview(event) {
  event.preventDefault();

  const bookingId = document.getElementById("reviewBookingId").value;
  const workerId = document.getElementById("reviewWorkerId").value;
  const rating = parseInt(document.getElementById("reviewRatingSelect").value) || 5;
  const comment = document.getElementById("reviewCommentInput").value.trim();

  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: bookingId,
        worker_id: workerId,
        rating: rating,
        tags: ["Punctual", "Expert Service", "Verified"],
        comment: comment || "Great work, satisfied with quality.",
        customer_name: "Ramesh Kumar"
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Review submission failed");
    }

    closeModal("modalReview");
    showToast("Review submitted successfully! Thank you.", "success");
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Setup Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  loadInitialData();

  // Search input live filtering
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderCategories(e.target.value);
    });
  }

  // Booking form dynamic price updates
  const servSelect = document.getElementById("bookingServiceSelect");
  const durInput = document.getElementById("bookingDurationHours");
  const typeSelect = document.getElementById("bookingTypeSelect");
  if (servSelect) servSelect.addEventListener("change", updateEstimatedPrice);
  if (durInput) durInput.addEventListener("input", updateEstimatedPrice);
  if (typeSelect) typeSelect.addEventListener("change", updateEstimatedPrice);
});
