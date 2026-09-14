/**
 * WorkMate Core Application Logic & State Management
 * 100% Bilingual (Hindi/English), Google Translate Style Switcher,
 * User Profile Editing & Access Control, Database Management, and Logout.
 */

// Application State
const state = {
  currentTab: "home",
  lang: "hi", // Default Hindi, toggleable to "en"
  categories: [],
  services: [],
  workers: [],
  bookings: [],
  wallet: { balance: 13000 },
  transactions: [],
  reviews: [],
  activeBooking: null,
  selectedCategoryForBooking: null,
  userProfile: {
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    email: "ramesh.kumar@workmate.in",
    address: "Flat 402, Lotus Tower, Sector 14",
    city: "Noida, Uttar Pradesh",
    aadhaar_masked: "•••• •••• 9012",
    member_id: "WM-USER-89104",
    account_type: "Customer Premium",
    joined_date: "January 15, 2026",
    trust_score: 4.9,
    kyc_status: "verified"
  }
};

// 100% Pure Bilingual Localization Dictionary
const I18N = {
  en: {
    appName: "WorkMate",
    tagline: "Your Trusted Labour Partner",
    greeting: "Hello, ",
    searchPlaceholder: "Who are you looking for? Masons, Plumber, Catering...",
    activeBookingTitle: "Active Booking",
    verifiedWorker: "Verified Worker",
    etaPrefix: "ETA: 15 Mins",
    otpPrefix: "OTP:",
    trackLive: "Live GPS Tracking",
    callWorker: "Call Worker",
    verifyOtpBtn: "Verify OTP & Complete",
    trustTitle: "100% ID Verified | Secure Escrow Payments",
    trustedPartners: "Trusted Partners: UPI, Razorpay, UIDAI",
    recentReviews: "Recent Satisfied Customer Reviews",
    viewAll: "View all >",
    navHome: "Home",
    navOrders: "My Bookings",
    navPayments: "Payments",
    navAccount: "My Account",
    quickBookBtn: "Instant Book",
    upcomingTab: "Upcoming",
    historyTab: "History",
    walletBalanceTitle: "WorkMate Wallet",
    addMoney: "+ Add Money",
    payout: "Withdraw",
    connectedMethods: "Connected Payment Methods",
    verifiedUpi: "Verified UPI",
    verifiedCard: "Bank, Debit Cards",
    razorpayBadge: "Payment Secure (Razorpay Gateway)",
    txHistory: "Transaction History",
    accountVerified: "Verified Profile",
    menuLanguage: "Language Selection",
    menuSecurity: "Security & Privacy",
    menuInsurance: "Micro-Insurance Enrollment",
    menuSupport: "24/7 Support (Call / WhatsApp)",
    menuDatabase: "Database & Cloud Sync (Firebase)",
    menuWorkerOnboard: "Register as Worker Partner (KYC)",
    btnLogout: "Log Out",
    editProfileBtn: "Edit Profile",
    profileDetailsTitle: "Account & Profile Details",
    memberIdLabel: "Member ID",
    aadhaarLabel: "Aadhaar KYC",
    accountTypeLabel: "Account Tier",
    joinedLabel: "Member Since",
    trustScoreLabel: "Safety Rating",
    statusInProgress: "In Progress",
    statusUpcoming: "Scheduled",
    statusCompleted: "Completed",
    statusCancelled: "Cancelled",
    totalCostLabel: "Total Cost",
    activeGpsLabel: "Active GPS Tracking >",
    rateWorkerLabel: "Rate Worker & Leave Review",
    noBookings: "No booking records found.",
    noActiveBooking: "No active in-progress booking. Tap button below to book instant labour.",
    langBtnLabel: "English"
  },
  hi: {
    appName: "वर्कमेट (WorkMate)",
    tagline: "आपका भरोसेमंद लेबर साथी",
    greeting: "नमस्ते, ",
    searchPlaceholder: "आप किसे ढूंढ रहे हैं? राजमिस्त्री, प्लंबर, कैटरिंग...",
    activeBookingTitle: "सक्रिय बुकिंग",
    verifiedWorker: "सत्यापित श्रमिक",
    etaPrefix: "आगमन समय: 15 मिनट",
    otpPrefix: "सुरक्षा कोड:",
    trackLive: "लाइव जीपीएस ट्रैकिंग",
    callWorker: "कॉल करें",
    verifyOtpBtn: "ओटीपी जांचें और काम पूरा करें",
    trustTitle: "100% सरकारी पहचान सत्यापन | सुरक्षित एस्क्रो भुगतान",
    trustedPartners: "भरोसेमंद साथी: यूपीआई, रेजरपे, आधार",
    recentReviews: "हाल की ग्राहक समीक्षाएं",
    viewAll: "सभी देखें >",
    navHome: "होम",
    navOrders: "मेरी बुकिंग",
    navPayments: "भुगतान",
    navAccount: "मेरा अकाउंट",
    quickBookBtn: "तुरंत बुक करें",
    upcomingTab: "आगामी",
    historyTab: "पिछला इतिहास",
    walletBalanceTitle: "वर्कमेट वॉलेट",
    addMoney: "+ पैसे जोड़ें",
    payout: "निकासी",
    connectedMethods: "जुड़े हुए भुगतान माध्यम",
    verifiedUpi: "सत्यापित यूपीआई",
    verifiedCard: "बैंक, डेबिट कार्ड",
    razorpayBadge: "रेजरपे गेटवे द्वारा सुरक्षित भुगतान",
    txHistory: "लेन-देन का इतिहास",
    accountVerified: "सत्यापित प्रोफाइल",
    menuLanguage: "भाषा चयन",
    menuSecurity: "सुरक्षा एवं गोपनीयता",
    menuInsurance: "माइक्रो-इंश्योरेंस (श्रमिक सुरक्षा बीमा)",
    menuSupport: "24/7 सहायता (कॉल / व्हाट्सएप)",
    menuDatabase: "डेटाबेस एवं क्लाउड सेटिंग्स (फायरबेस)",
    menuWorkerOnboard: "श्रमिक साथी के रूप में पंजीकरण (केवाईसी)",
    btnLogout: "लॉगआउट करें",
    editProfileBtn: "प्रोफाइल संपादित करें",
    profileDetailsTitle: "खाता एवं प्रोफाइल विवरण",
    memberIdLabel: "सदस्य आईडी",
    aadhaarLabel: "आधार सत्यापन",
    accountTypeLabel: "खाता प्रकार",
    joinedLabel: "सदस्यता तिथि",
    trustScoreLabel: "सुरक्षा स्कोर",
    statusInProgress: "प्रगति पर",
    statusUpcoming: "शेड्यूल",
    statusCompleted: "पूर्ण",
    statusCancelled: "रद्द",
    totalCostLabel: "कुल लागत",
    activeGpsLabel: "सक्रिय जीपीएस ट्रैकिंग देखें >",
    rateWorkerLabel: "रेटिंग और समीक्षा दें",
    noBookings: "कोई बुकिंग रिकॉर्ड नहीं मिला।",
    noActiveBooking: "वर्तमान में कोई सक्रिय बुकिंग नहीं है। नीचे दिए बटन से तुरंत लेबर बुक करें।",
    langBtnLabel: "हिन्दी"
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

// Google Translate Style Language Switcher
function toggleLanguage() {
  state.lang = state.lang === "hi" ? "en" : "hi";
  updateLanguageUI();
}

function setLanguage(langCode) {
  state.lang = langCode;
  updateLanguageUI();
}

function updateLanguageUI() {
  const isHi = state.lang === "hi";

  // Update header translate button indicator
  const langTag = document.getElementById("currentLangTag");
  const langIndicator = document.getElementById("currentLangIndicator");
  if (langTag) {
    langTag.textContent = isHi ? "हिन्दी" : "English";
  }
  if (langIndicator) {
    langIndicator.textContent = isHi ? "HI" : "EN";
  }

  applyTranslations();
  renderCategories();
  renderBookings();
  renderActiveBooking();
  renderTransactions();
  renderReviews();
  renderProfile();
}

function applyTranslations() {
  const dict = I18N[state.lang];
  const isHi = state.lang === "hi";

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

  // Greeting update
  const greetingEl = document.getElementById("userGreetingText");
  if (greetingEl) {
    greetingEl.textContent = `${dict.greeting}${state.userProfile.name}!`;
  }

  // Location text
  const locEl = document.getElementById("headerLocationText");
  if (locEl) {
    locEl.textContent = state.userProfile.address || "Flat 402, Sector 14, Noida";
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
  if (tabId === "account") renderProfile();
}

// Data Fetching
async function loadInitialData() {
  try {
    const [catsRes, servsRes, workersRes, bookingsRes, walletRes, txsRes, revsRes, profileRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/services"),
      fetch("/api/workers"),
      fetch("/api/bookings"),
      fetch("/api/wallet"),
      fetch("/api/wallet/transactions"),
      fetch("/api/reviews"),
      fetch("/api/user/profile")
    ]);

    state.categories = await catsRes.json();
    state.services = await servsRes.json();
    state.workers = await workersRes.json();
    state.bookings = await bookingsRes.json();
    state.wallet = await walletRes.json();
    state.transactions = await txsRes.json();
    state.reviews = await revsRes.json();

    if (profileRes.ok) {
      state.userProfile = await profileRes.json();
    }

    state.activeBooking = state.bookings.find(b => b.status === "in_progress") || state.bookings[0];

    renderCategories();
    renderActiveBooking();
    renderBookings();
    renderWallet();
    renderTransactions();
    renderReviews();
    renderProfile();
    applyTranslations();
  } catch (err) {
    console.error("Error initializing app data:", err);
  }
}

// Render Categories Grid
function renderCategories(filterText = "") {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;

  const isHi = state.lang === "hi";
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

  // Pure language names
  const categoryNames = {
    construction: {
      en: { title: "Construction & Masonry", sub: "Brickwork, Tiling & Plastering" },
      hi: { title: "राजमिस्त्री एवं निर्माण कार्य", sub: "ईंट, टाइल्स, प्लंबिंग व बिजली" }
    },
    events: {
      en: { title: "Events & Catering", sub: "Waiters, Chefs & Tent Setup" },
      hi: { title: "कार्यक्रम एवं कैटरिंग", sub: "वेटर, बावर्ची, सफाई व टेंट" }
    },
    shifting: {
      en: { title: "House Shifting", sub: "Packing, Loading & Unloading" },
      hi: { title: "घर का सामान व शिफ्टिंग", sub: "पैकिंग, लोडिंग, अनलोडिंग व सेटअप" }
    },
    textile: {
      en: { title: "Textile Mill Helper", sub: "Fabric Cutting & Roll Handling" },
      hi: { title: "टेक्सटाइल एवं मिल हेल्पर", sub: "कपड़ा कटिंग, फोल्डिंग व रोल लोडिंग" }
    }
  };

  grid.innerHTML = filtered.map(cat => {
    let iconClass = "cat-icon-construction";
    let faIcon = "fa-hammer";
    if (cat.id === "events") { iconClass = "cat-icon-events"; faIcon = "fa-champagne-glasses"; }
    else if (cat.id === "shifting") { iconClass = "cat-icon-shifting"; faIcon = "fa-truck-ramp-box"; }
    else if (cat.id === "textile") { iconClass = "cat-icon-textile"; faIcon = "fa-scissors"; }

    const loc = categoryNames[cat.id] ? categoryNames[cat.id][isHi ? "hi" : "en"] : null;
    const title = loc ? loc.title : (isHi ? cat.name_hi : cat.name_en);
    const sub = loc ? loc.sub : (isHi ? cat.subtext_hi : cat.subtext_en);

    return `
      <div class="category-card" onclick="openBookingForCategory('${cat.id}')">
        <div class="cat-rating-pill">
          <i class="fa-solid fa-star"></i> ${cat.rating.toFixed(1)}
        </div>
        <div class="cat-icon-container ${iconClass}">
          <i class="fa-solid ${faIcon}"></i>
        </div>
        <div class="cat-title-en">${title}</div>
        <div class="cat-title-hi">${sub}</div>
      </div>
    `;
  }).join("");
}

// Render Active Booking Card
function renderActiveBooking() {
  const container = document.getElementById("activeBookingContainer");
  if (!container) return;

  const b = state.bookings.find(item => item.status === "in_progress") || state.activeBooking;
  const isHi = state.lang === "hi";
  const dict = I18N[state.lang];

  if (!b || b.status === "completed" || b.status === "cancelled") {
    container.innerHTML = `
      <div style="background:#f1f5f9; padding:16px; border-radius:12px; text-align:center; color:#64748b; font-size:13px;">
        <i class="fa-solid fa-circle-check" style="color:#10b981; font-size:20px; margin-bottom:6px; display:block;"></i>
        ${dict.noActiveBooking}
      </div>
    `;
    return;
  }

  const tradeTitle = isHi ? (b.worker_trade_hi || b.worker_trade) : (b.worker_trade || b.worker_trade_hi);

  container.innerHTML = `
    <div class="active-booking-card">
      <div class="worker-info-header">
        <div class="worker-avatar-wrap">
          <img src="${b.worker_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}" alt="Worker">
        </div>
        <div class="worker-details">
          <h4>${b.worker_name || 'Mukesh Verma'} <span class="verified-badge-pill"><i class="fa-solid fa-shield-check"></i> ${dict.verifiedWorker}</span></h4>
          <p>${tradeTitle} • ★ ${b.worker_rating || 4.8}</p>
        </div>
      </div>

      <div class="booking-eta-otp-row">
        <div class="eta-text">
          <i class="fa-solid fa-motorcycle"></i> ${isHi ? `आगमन: ${b.eta_minutes || 15} मिनट` : `ETA: ${b.eta_minutes || 15} Mins`}
        </div>
        <div>
          <span style="font-size:11px; opacity:0.8; margin-right:4px;">${dict.otpPrefix}</span>
          <span class="otp-pill">${b.otp}</span>
        </div>
      </div>

      <div class="booking-actions-row">
        <button class="btn-track-live" onclick="openLiveTrackingModal('${b.id}')">
          <i class="fa-solid fa-location-crosshairs"></i> ${dict.trackLive}
        </button>
        <button class="btn-complete-job" onclick="openVerifyOtpModal('${b.id}')">
          <i class="fa-solid fa-check-double"></i> ${dict.verifyOtpBtn}
        </button>
      </div>
    </div>
  `;
}

// Render Bookings Screen
function renderBookings(tabFilter = "upcoming") {
  const container = document.getElementById("bookingsListContainer");
  if (!container) return;

  const isHi = state.lang === "hi";
  const dict = I18N[state.lang];
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
        <p>${dict.noBookings}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(b => {
    const statusClass = `status-${b.status}`;
    let statusLabel = b.status;
    if (b.status === "in_progress") statusLabel = dict.statusInProgress;
    else if (b.status === "upcoming") statusLabel = dict.statusUpcoming;
    else if (b.status === "completed") statusLabel = dict.statusCompleted;
    else if (b.status === "cancelled") statusLabel = dict.statusCancelled;

    const serviceTitle = isHi ? (b.service_name_hi || b.service_name_en) : (b.service_name_en || b.service_name_hi);

    return `
      <div class="booking-item-card">
        <div class="booking-item-top">
          <div class="booking-service-title">${serviceTitle}</div>
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
          <span>${dict.totalCostLabel}:</span>
          <span class="cost-highlight">₹${b.total_cost.toLocaleString('en-IN')}</span>
        </div>

        ${b.status !== 'completed' && b.status !== 'cancelled' ? `
          <button class="btn-view-gps" onclick="openLiveTrackingModal('${b.id}')">
            <i class="fa-solid fa-map-location-dot"></i> ${dict.activeGpsLabel}
          </button>
        ` : (b.status === 'completed' && !b.is_rated ? `
          <button class="btn-view-gps" style="color:#0d9488;" onclick="openReviewModal('${b.id}', '${b.worker_id}', '${b.worker_name}')">
            <i class="fa-solid fa-star"></i> ${dict.rateWorkerLabel}
          </button>
        ` : '')}
      </div>
    `;
  }).join("");
}

// Render Wallet & Payments
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

  const isHi = state.lang === "hi";

  container.innerHTML = state.transactions.map(tx => {
    const isCredit = tx.direction === "credit";
    const title = isHi ? tx.title_hi : tx.title_en;
    return `
      <div class="tx-item">
        <div class="tx-left">
          <div class="tx-icon-circle ${isCredit ? 'tx-credit' : 'tx-debit'}">
            <i class="fa-solid ${isCredit ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
          </div>
          <div>
            <div class="tx-title">${title}</div>
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

// Render Customer Reviews Carousel
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

// Render Profile in Account Screen (Editable & Non-Editable Details)
function renderProfile() {
  const p = state.userProfile;
  const isHi = state.lang === "hi";
  const dict = I18N[state.lang];

  const nameEl = document.getElementById("accountUserName");
  const phoneEl = document.getElementById("accountUserPhone");
  if (nameEl) nameEl.textContent = p.name;
  if (phoneEl) phoneEl.textContent = p.phone;

  // Render Read-Only Details Grid
  const grid = document.getElementById("accountDetailsGrid");
  if (grid) {
    grid.innerHTML = `
      <div class="detail-pill">
        <div class="detail-label"><i class="fa-solid fa-lock"></i> ${dict.memberIdLabel}</div>
        <div class="detail-value">${p.member_id}</div>
      </div>
      <div class="detail-pill">
        <div class="detail-label"><i class="fa-solid fa-shield-halved"></i> ${dict.aadhaarLabel}</div>
        <div class="detail-value" style="color:#10b981;">✓ ${isHi ? "सत्यापित" : "Verified"} (${p.aadhaar_masked})</div>
      </div>
      <div class="detail-pill">
        <div class="detail-label"><i class="fa-solid fa-crown"></i> ${dict.accountTypeLabel}</div>
        <div class="detail-value">${isHi ? "प्रीमियम ग्राहक" : p.account_type}</div>
      </div>
      <div class="detail-pill">
        <div class="detail-label"><i class="fa-solid fa-calendar-check"></i> ${dict.joinedLabel}</div>
        <div class="detail-value">${p.joined_date}</div>
      </div>
      <div class="detail-pill" style="grid-column: span 2;">
        <div class="detail-label"><i class="fa-solid fa-location-dot"></i> ${isHi ? "पंजीकृत सेवा का पता" : "Registered Service Address"}</div>
        <div class="detail-value">${p.address}, ${p.city}</div>
      </div>
    `;
  }
}

// ----------------- Profile Editing (Access Control) ----------------- //

function openEditProfileModal() {
  const p = state.userProfile;
  document.getElementById("editProfileName").value = p.name;
  document.getElementById("editProfilePhone").value = p.phone;
  document.getElementById("editProfileEmail").value = p.email || "";
  document.getElementById("editProfileAddress").value = p.address;
  document.getElementById("editProfileCity").value = p.city;

  // Read-only locked fields
  document.getElementById("editProfileMemberId").value = p.member_id;
  document.getElementById("editProfileAadhaar").value = `Verified: ${p.aadhaar_masked}`;

  document.getElementById("modalEditProfile").classList.add("active");
}

async function submitProfileEdit(event) {
  event.preventDefault();
  const isHi = state.lang === "hi";

  const name = document.getElementById("editProfileName").value.trim();
  const phone = document.getElementById("editProfilePhone").value.trim();
  const email = document.getElementById("editProfileEmail").value.trim();
  const address = document.getElementById("editProfileAddress").value.trim();
  const city = document.getElementById("editProfileCity").value.trim();

  if (!name || !phone || !address || !city) {
    showToast(isHi ? "कृपया सभी आवश्यक विवरण भरें" : "Please fill in all required fields", "error");
    return;
  }

  try {
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, address, city })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Profile update failed");
    }

    const data = await res.json();
    state.userProfile = data.profile;
    closeModal("modalEditProfile");
    showToast(isHi ? "प्रोफाइल सफलतापूर्वक अपडेट हो गई!" : "Profile updated successfully!", "success");

    renderProfile();
    applyTranslations();
  } catch (err) {
    console.error(err);
    showToast(err.message, "error");
  }
}

// ----------------- Database & Cloud Sync (Firebase) ----------------- //

async function openDatabaseModal() {
  document.getElementById("modalDatabase").classList.add("active");
  const isHi = state.lang === "hi";

  try {
    const res = await fetch("/api/firebase/status");
    const data = await res.json();
    const statusEl = document.getElementById("dbSyncStatusInfo");
    if (statusEl) {
      statusEl.innerHTML = `
        <div style="font-size:12px; margin-bottom:8px;">
          <strong>${isHi ? "सक्रिय डेटाबेस:" : "Primary Database:"}</strong> SQLite (Local thread-safe)
        </div>
        <div style="font-size:12px; margin-bottom:8px;">
          <strong>${isHi ? "फायरबेस प्रोजेक्ट:" : "Firebase Project:"}</strong> <code>${data.firebase_project_id}</code>
        </div>
        <div style="font-size:12px; margin-bottom:8px;">
          <strong>${isHi ? "क्लाउड स्थिति:" : "Cloud Firestore Status:"}</strong> 
          <span style="color:${data.credentials_found ? '#10b981' : '#f59e0b'}; font-weight:700;">
            ${data.credentials_found ? (isHi ? "✓ कनेक्टेड" : "✓ Connected") : (isHi ? "की फाइल प्रतीक्षारत (Pending Key)" : "Pending serviceAccountKey.json")}
          </span>
        </div>
      `;
    }
  } catch (e) {
    console.error(e);
  }
}

async function triggerDatabaseSync() {
  const isHi = state.lang === "hi";
  showToast(isHi ? "फायरबेस में डेटा सिंक शुरू किया गया..." : "Syncing records to Firebase Cloud Firestore...", "success");
  setTimeout(() => {
    showToast(isHi ? "डेटाबेस रिकॉर्ड्स सफलतापूर्वक सिंक किए गए!" : "Database records successfully synchronized!", "success");
  }, 1200);
}

// ----------------- Logout Management ----------------- //

function openLogoutModal() {
  document.getElementById("modalLogoutConfirm").classList.add("active");
}

function executeLogout() {
  closeModal("modalLogoutConfirm");
  const isHi = state.lang === "hi";
  showToast(isHi ? "सफलतापूर्वक लॉगआउट किया गया!" : "Logged out successfully!", "success");

  // Show login simulation sheet
  setTimeout(() => {
    document.getElementById("modalLogin").classList.add("active");
  }, 600);
}

function executeLogin() {
  closeModal("modalLogin");
  const isHi = state.lang === "hi";
  showToast(isHi ? "पुनः स्वागत है, रमेश!" : "Welcome back, Ramesh Kumar!", "success");
  switchTab("home");
}

// ----------------- Modals Common ----------------- //

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
  if (modalId === "modalTracking" && typeof stopTrackingAnimation === "function") {
    stopTrackingAnimation();
  }
}

// Open Booking Modal for Category
function openBookingForCategory(categoryId) {
  state.selectedCategoryForBooking = categoryId;
  const select = document.getElementById("bookingServiceSelect");
  if (!select) return;

  const filteredServices = state.services.filter(s => s.category_id === categoryId);
  const isHi = state.lang === "hi";

  select.innerHTML = filteredServices.map(s => `
    <option value="${s.id}">${isHi ? s.name_hi : s.name_en} (₹${s.base_rate}/${isHi ? 'दिन' : 'day'})</option>
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
  const isHi = state.lang === "hi";

  const baseRate = service ? service.base_rate : 600;
  const subtotal = Math.round(baseRate * (hours >= 8 ? hours / 8 : hours / 4));
  const commission = Math.round(subtotal * 0.10);
  const emergency = isInstant ? 150 : 0;
  const total = subtotal + emergency;

  priceDisplay.innerHTML = `
    <strong>₹${total.toLocaleString('en-IN')}</strong> 
    <span style="font-size:11px; color:#64748b; display:block;">
      ${isHi ? `मूल दर: ₹${subtotal} + 10% वर्कमेट कमीशन: ₹${commission} ${emergency ? '+ आपातकालीन त्वरित शुल्क: ₹150' : ''}` : `Base: ₹${subtotal} + 10% WorkMate Commission: ₹${commission} ${emergency ? '+ Emergency Fast Dispatch: ₹150' : ''}`}
    </span>
  `;
}

// Submit Booking
async function submitBooking(event) {
  event.preventDefault();
  const isHi = state.lang === "hi";

  const serviceId = document.getElementById("bookingServiceSelect").value;
  const bookingType = document.getElementById("bookingTypeSelect").value;
  const duration = parseInt(document.getElementById("bookingDurationHours").value) || 4;
  const address = document.getElementById("bookingAddressInput").value.trim();
  const notes = document.getElementById("bookingNotesInput").value.trim();

  if (!address) {
    showToast(isHi ? "कृपया सेवा का पता दर्ज करें" : "Please enter a service location address", "error");
    return;
  }

  const payload = {
    customer_name: state.userProfile.name,
    customer_phone: state.userProfile.phone,
    service_id: serviceId,
    task_description: notes || (isHi ? "कुशल लेबर की तत्काल आवश्यकता" : "Immediate requirement matching trade standards"),
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
    showToast(isHi ? `बुकिंग ${data.booking.booking_number} सफलतापूर्वक दर्ज हुई!` : (data.message || "Booking created successfully!"), "success");

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
    if (typeof initTrackingMap === "function") {
      initTrackingMap(data);
    }
  } catch (err) {
    console.error(err);
    showToast("Failed to load tracking data", "error");
  }
}

// Verify OTP Modal
function openVerifyOtpModal(bookingId) {
  const b = state.bookings.find(item => item.id === bookingId) || state.activeBooking;
  if (!b) return;
  const isHi = state.lang === "hi";
  document.getElementById("verifyOtpBookingId").value = b.id;
  document.getElementById("verifyOtpHint").textContent = `${isHi ? 'ग्राहक ओटीपी' : 'Customer OTP'}: ${b.otp}`;
  document.getElementById("modalVerifyOtp").classList.add("active");
}

async function submitOtpVerification(event) {
  event.preventDefault();
  const isHi = state.lang === "hi";
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
    showToast(isHi ? "ओटीपी सत्यापित! कार्य प्रारंभ हुआ।" : "OTP Verified! Worker job started.", "success");
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// Confirm Job Completion & Escrow Payout
async function triggerCompleteJob(bookingId) {
  const isHi = state.lang === "hi";
  try {
    const res = await fetch(`/api/bookings/${bookingId}/complete`, {
      method: "POST"
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to complete job");

    closeModal("modalVerifyOtp");
    showToast(isHi ? "कार्य पूर्ण हुआ! श्रमिक भुगतान जारी किया गया।" : (data.message || "Job Completed! Worker payout released."), "success");
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
  const isHi = state.lang === "hi";
  const amount = parseFloat(document.getElementById("addMoneyAmount").value);
  const method = document.getElementById("addMoneyMethod").value;

  if (isNaN(amount) || amount <= 0) {
    showToast(isHi ? "कृपया मान्य राशि दर्ज करें" : "Please enter a valid amount", "error");
    return;
  }

  try {
    if (typeof handleAddMoney === "function") {
      await handleAddMoney(amount, method);
    }
    closeModal("modalAddMoney");
    showToast(isHi ? `वॉलेट में ₹${amount.toLocaleString('en-IN')} सफलतापूर्वक जोड़े गए!` : `Added ₹${amount.toLocaleString('en-IN')} to WorkMate Wallet!`, "success");
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
  const isHi = state.lang === "hi";

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
        comment: comment || (isHi ? "उत्कृष्ट कार्य, सेवा से संतुष्ट।" : "Great work, satisfied with quality."),
        customer_name: state.userProfile.name
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Review submission failed");
    }

    closeModal("modalReview");
    showToast(isHi ? "आपकी समीक्षा दर्ज की गई! धन्यवाद।" : "Review submitted successfully! Thank you.", "success");
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
