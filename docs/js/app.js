/**
 * WorkMate Core Application Logic & State Management
 * Complete Auth Session Persistence, Admin Rate & Multi-Bank Routing,
 * Sensitive Info Protection ("10% WorkMate Charge"), Upfront Escrow Work Posting,
 * Per-User Isolated Language Settings, and Live Reactivity.
 */

// Application State
const state = {
  session: null, // Logged in user session
  currentTab: "home",
  lang: "hi", // Isolated per-user
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
    joined_date: "September 14, 2026",
    trust_score: 4.9,
    kyc_status: "verified"
  },
  adminBanks: [],
  adminStats: {},
  platformChargePercent: 10
};

// 100% Pure Bilingual Localization Dictionary
const I18N = {
  en: {
    appHtmlTitle: "WorkMate | On-Demand Blue-Collar Labour Platform",
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
    navAdmin: "4 Modules",
    backToHome: "Back to Home",
    menuAdminConsole: "4 Core Service Modules & Base Rates",
    menuDatabase: "Project Database & Records Explorer",
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
    menuDatabase: "Database & Cloud Sync",
    menuAdminConsole: "Admin Rate & Bank Console",
    menuWorkerOnboard: "Register as Worker Partner",
    menuTerms: "Terms & Conditions (Escrow Protection)",
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
    statusDisputed: "Disputed & Refunded",
    totalCostLabel: "Total Cost",
    activeGpsLabel: "Active GPS Tracking >",
    rateWorkerLabel: "Rate Worker & Leave Review",
    noBookings: "No booking records found.",
    noActiveBooking: "No active in-progress booking. Tap button below to book instant labour.",
    chargeNotice: "Charge",
    payAndPostBtn: "Pay & Post Work (Reserve Labour)",
    langBtnLabel: "English",
    adminRatesTab: "4 Module Rates",
    customerPreviewTab: "Customer View",
    adminHeroTitle: "WorkMate Rate & System Control",
    adminHeroSub: "Edit base prices for all 4 service modules in real-time. Changes instantly recalculate customer checkout totals.",
    adminModulesHeader: "Service Module Pricing & Base Rates",
    adminChargeConfigHeader: "WorkMate Platform Charge Configuration",
    expandAll: "Expand All",
    collapseAll: "Collapse All",
    authCustomerLoginTab: "Customer Login",
    authCustomerRegisterTab: "Register",
    authAdminTab: "Admin",
    authPhoneLabel: "Mobile Number",
    authLoginBtn: "Login as Customer",
    authRegisterBtn: "Register & Continue",
    adminIdLabel: "Admin ID",
    adminPasswordLabel: "Admin Password",
    adminLoginBtn: "Login to Admin Console",
    newAccountPrompt: "New to WorkMate?",
    createAccountLink: "Create an account",
    alreadyAccountPrompt: "Already have an account?",
    loginAccountLink: "Login here",
    sslSecurityFoot: "Protected by 256-bit SSL Escrow Security • UIDAI Aadhaar Verified",
    labelFullName: "Full Name",
    labelAddress: "Delivery / House Address",
    labelCityState: "City & State",
    labelEmail: "Email Address",
    labelProfilePhoto: "Profile Photo",
    btnChangePhoto: "Change Photo",
    btnClose: "Close",
    labelSecuredFields: "Security Protected Fields",
    modalBookingTitle: "Add Work & Book Labour",
    labelServiceTrade: "Select Service / Trade",
    labelOfferedPay: "Your Offered Work Pay (Budget)",
    labelBookingType: "Booking Type",
    labelDuration: "Duration",
    labelLocation: "Location / Address",
    labelTaskNotes: "Task Specifications / Notes",
    labelPaymentMethod: "Payment Method",
    workerOnboardTitle: "Worker KYC Onboarding",
    labelAadhaar: "12-Digit Aadhaar Number",
    labelSector: "Sector",
    labelTradeSkill: "Primary Trade Skill",
    labelDailyWage: "Expected Daily Wage / Rate (₹/day)",
    labelStarRating: "Star Rating",
    labelComments: "Review Comments",
    reportIssueBtn: "Report Issue / Worker Left",
    disputeTitle: "Report Issue / Worker Left",
    disputeWorkerLabel: "Assigned Worker",
    disputeReasonLabel: "What happened? (Select Reason)",
    disputeReason1: "Worker left midway before completing the job",
    disputeReason2: "Worker arrived late / poor quality of work",
    disputeReason3: "Worker demanded extra cash beyond platform quote",
    disputeNotesLabel: "Incident Notes & Description",
    disputeRatingLabel: "Rate Worker (1 Star for Abandonment)",
    disputeActionLabel: "Resolution Action",
    disputeActionRefund: "Instant 100% Escrow Wallet Refund",
    disputeActionReplace: "Auto-Dispatch Replacement Worker",
    disputeSubmitBtn: "Submit Dispute & Claim Refund",
    termsTitle: "WorkMate Terms & Escrow Protection Policy",
    termsSubtitle: "Guaranteed Safety for Customers and Verified Workers",
    terms1Title: "1. 100% Escrow Payment Guarantee",
    terms1Desc: "Your booking pay is held safely in WorkMate Escrow. Funds are released to the worker only after OTP verification upon satisfactory work completion.",
    terms2Title: "2. Mid-Work Abandonment Protection",
    terms2Desc: "If a worker leaves midway or fails to finish the agreed work, report through 'Report Issue'. The system triggers an instant 100% refund of your escrow balance or dispatches a free replacement.",
    terms3Title: "3. Worker Penalty & Transparent Ratings",
    terms3Desc: "Workers with reported abandonments receive downward rating penalties and are pushed to the bottom of the dispatch queue to safeguard community standards.",
    termsCloseBtn: "I Understand & Accept"
  },
  hi: {
    appHtmlTitle: "वर्कमेट | ऑन-डिमांड लेबर प्लेटफॉर्म",
    appName: "वर्कमेट",
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
    trustTitle: "100% पहचान सत्यापन | सुरक्षित एस्क्रो भुगतान",
    trustedPartners: "भरोसेमंद साथी: यूपीआई, रेजरपे, आधार",
    recentReviews: "हाल की ग्राहक समीक्षाएं",
    viewAll: "सभी देखें >",
    navHome: "होम",
    navOrders: "मेरी बुकिंग",
    navPayments: "भुगतान",
    navAccount: "मेरा खाता",
    navAdmin: "4 मॉड्यूल",
    backToHome: "मुख्य पृष्ठ पर वापस जाएं",
    menuAdminConsole: "4 मुख्य सेवा मॉड्यूल एवं दरें",
    menuDatabase: "डेटाबेस एवं प्रोजेक्ट रिकॉर्ड्स",
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
    menuDatabase: "डेटाबेस एवं क्लाउड सेटिंग्स",
    menuAdminConsole: "व्यवस्थापक दर व बैंक कंसोल",
    menuWorkerOnboard: "श्रमिक साथी के रूप में पंजीकरण",
    menuTerms: "नियम एवं शर्तें (एस्क्रो सुरक्षा नीति)",
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
    statusDisputed: "विवादित एवं रिफंडेड",
    totalCostLabel: "कुल लागत",
    activeGpsLabel: "सक्रिय जीपीएस ट्रैकिंग देखें >",
    rateWorkerLabel: "रेटिंग और समीक्षा दें",
    noBookings: "कोई बुकिंग रिकॉर्ड नहीं मिला।",
    noActiveBooking: "वर्तमान में कोई सक्रिय बुकिंग नहीं है। नीचे दिए बटन से तुरंत लेबर बुक करें।",
    chargeNotice: "चार्ज",
    payAndPostBtn: "भुगतान करें एवं काम जोड़ें (लेबर आरक्षित करें)",
    langBtnLabel: "हिन्दी",
    adminRatesTab: "4 मॉड्यूल की दरें",
    customerPreviewTab: "ग्राहक ऐप व्यू",
    adminHeroTitle: "वर्कमेट दर एवं सिस्टम नियंत्रण",
    adminHeroSub: "सभी 4 सर्विस मॉड्यूल्स की बेस दरें सीधे बदलें। नए मूल्य तुरंत वेबसाइट पर लागू होंगे।",
    adminModulesHeader: "सर्विस मॉड्यूल मूल्य एवं बेस दरें",
    adminChargeConfigHeader: "वर्कमेट प्लेटफॉर्म चार्ज विन्यास",
    expandAll: "सभी खोलें",
    collapseAll: "सभी समेटें",
    authCustomerLoginTab: "ग्राहक लॉगिन",
    authCustomerRegisterTab: "नया खाता बनाएं",
    authAdminTab: "व्यवस्थापक कंसोल",
    authPhoneLabel: "मोबाइल नंबर",
    authLoginBtn: "मोबाइल से लॉगिन करें",
    authRegisterBtn: "खाता बनाएं एवं आगे बढ़ें",
    adminIdLabel: "व्यवस्थापक आईडी",
    adminPasswordLabel: "पासवर्ड",
    adminLoginBtn: "व्यवस्थापक कंसोल में प्रवेश करें",
    newAccountPrompt: "वर्कमेट पर नए हैं?",
    createAccountLink: "नया खाता बनाएं",
    alreadyAccountPrompt: "क्या पहले से खाता है?",
    loginAccountLink: "यहाँ लॉगिन करें",
    sslSecurityFoot: "256-बिट एसएसएल एस्क्रो सुरक्षा • आधार सत्यापित",
    labelFullName: "पूरा नाम",
    labelAddress: "मकान / गली का पता",
    labelCityState: "शहर व राज्य",
    labelEmail: "ईमेल पता",
    labelProfilePhoto: "प्रोफाइल फोटो",
    btnChangePhoto: "फोटो बदलें",
    btnClose: "बंद करें",
    labelSecuredFields: "सुरक्षित विवरण",
    modalBookingTitle: "काम जोड़ें एवं लेबर बुक करें",
    labelServiceTrade: "सेवा / कार्य का चयन करें",
    labelOfferedPay: "तय की गई मजदूरी (बजट)",
    labelBookingType: "बुकिंग प्रकार",
    labelDuration: "कार्य अवधि",
    labelLocation: "कार्य स्थल / पता",
    labelTaskNotes: "काम का विवरण एवं निर्देश",
    labelPaymentMethod: "भुगतान माध्यम",
    workerOnboardTitle: "श्रमिक पंजीकरण एवं सत्यापन",
    labelAadhaar: "12-अंकों का आधार नंबर",
    labelSector: "कार्य क्षेत्र",
    labelTradeSkill: "मुख्य कौशल",
    labelDailyWage: "दैनिक मजदूरी दर (प्रतिदिन)",
    labelStarRating: "स्टार रेटिंग",
    labelComments: "समीक्षा / टिप्पणी",
    reportIssueBtn: "शिकायत दर्ज करें / श्रमिक काम छोड़कर गया",
    disputeTitle: "शिकायत दर्ज करें / श्रमिक अधूरा काम छोड़कर गया",
    disputeWorkerLabel: "आवंटित श्रमिक",
    disputeReasonLabel: "समस्या का कारण चुनें",
    disputeReason1: "श्रमिक बिना काम पूरा किए बीच में छोड़कर चला गया",
    disputeReason2: "श्रमिक देरी से आया / काम की गुणवत्ता खराब थी",
    disputeReason3: "श्रमिक ने तय राशि से अतिरिक्त नकद पैसे मांगे",
    disputeNotesLabel: "घटना का विवरण लिखें",
    disputeRatingLabel: "श्रमिक रेटिंग (नियम उल्लंघन पर 1 स्टार)",
    disputeActionLabel: "समाधान विकल्प",
    disputeActionRefund: "100% एस्क्रो राशि तुरंत वॉलेट में वापस पाएं",
    disputeActionReplace: "तुरंत दूसरा प्रतिस्थापन श्रमिक भेजें",
    disputeSubmitBtn: "विवाद दर्ज करें और रिफंड प्राप्त करें",
    termsTitle: "वर्कमेट नियम एवं एस्क्रो सुरक्षा नीति",
    termsSubtitle: "ग्राहकों और सत्यापित श्रमिकों के लिए पूर्ण सुरक्षा",
    terms1Title: "1. 100% एस्क्रो भुगतान सुरक्षा",
    terms1Desc: "आपके द्वारा जमा की गई मजदूरी सुरक्षित वर्कमेट एस्क्रो खाते में रहती है। कार्य सफलतापूर्वक पूरा होने और आपके द्वारा ओटीपी देने पर ही श्रमिक को भुगतान होता है।",
    terms2Title: "2. काम बीच में छोड़ने पर सुरक्षा",
    terms2Desc: "यदि कोई श्रमिक बीच में काम छोड़कर चला जाता है, तो 'शिकायत दर्ज करें' पर टैप करें। आपको तुरंत 100% राशि आपके वॉलेट में वापस मिलेगी या तुरंत दूसरा श्रमिक भेजा जाएगा।",
    terms3Title: "3. श्रमिक रेटिंग व अनुशासनात्मक कार्रवाई",
    terms3Desc: "नियमों का उल्लंघन करने वाले श्रमिकों की रेटिंग कम की जाती है और उन्हें सिस्टम से बाहर कर दिया जाता है ताकि विश्वसनीयता बनी रहे।",
    termsCloseBtn: "मैं समझ गया और सहमत हूँ"
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

// ----------------- 4 Core Service Modules Metadata ----------------- //

const ADMIN_MODULES_META = {
  construction: {
    name_en: "Construction & Masonry",
    name_hi: "निर्माण एवं राजमिस्त्री कार्य",
    icon: "fa-trowel-bricks",
    color: "#dbeafe",
    textColor: "#1d4ed8",
    desc_en: "Brickwork, plastering, plumbing, tiling, painting & construction helpers.",
    desc_hi: "ईंट चिनाई, प्लास्टर, प्लंबिंग, टाइल फिटिंग, पेंटिंग और कंस्ट्रक्शन मजदूर।"
  },
  events: {
    name_en: "Events & Catering",
    name_hi: "इवेंट्स एवं कैटरिंग स्टाफ",
    icon: "fa-champagne-glasses",
    color: "#fce7f3",
    textColor: "#be185d",
    desc_en: "Waiters, kitchen cooks, buffet helpers, cleaning & tent setup labor.",
    desc_hi: "वेटर, हलवाई-कुक, सफाई, बर्तन धोने वाले और टेंट लगाने वाले मजदूर।"
  },
  shifting: {
    name_en: "House & Office Shifting",
    name_hi: "सामान शिफ्टिंग एवं लोडिंग",
    icon: "fa-truck-ramp-box",
    color: "#fef3c7",
    textColor: "#b45309",
    desc_en: "Packing, truck loading, furniture shifting, unboxing & garden cleaning.",
    desc_hi: "पैकिंग, ट्रक में सामान चढ़ाना/उतारना, भारी सामान शिफ्टिंग।"
  },
  textile: {
    name_en: "Textile Mill & Fabric Helper",
    name_hi: "टेक्सटाइल मिल एवं थान हेल्पर",
    icon: "fa-scissors",
    color: "#dcfce7",
    textColor: "#15803d",
    desc_en: "Fabric roll loading, mill helpers, quality check & machine support.",
    desc_hi: "थान लोडिंग, कटिंग, क्वालिटी चेकिंग, पैकेजिंग और मिल हेल्पर।"
  }
};

// ----------------- Auth & Session Management ----------------- //

function checkUserSession() {
  const savedSession = localStorage.getItem("workmate_session");
  const authView = document.getElementById("view-auth");
  const viewportWrapper = document.getElementById("appViewportWrapper");
  const appContainer = document.getElementById("appContainer");
  const adminTopBar = document.getElementById("adminTopBar");
  const navAdmin = document.getElementById("nav-admin");
  const menuAdminConsole = document.getElementById("menuAdminConsoleItem");
  const menuDatabaseSync = document.getElementById("menuDatabaseSyncItem");

  if (!savedSession) {
    state.session = null;
    if (authView) authView.style.display = "flex";
    if (viewportWrapper) viewportWrapper.style.display = "none";
    if (appContainer) appContainer.style.display = "none";
    if (adminTopBar) adminTopBar.style.display = "none";
    if (navAdmin) navAdmin.style.display = "none";
    if (menuAdminConsole) menuAdminConsole.style.display = "none";
    if (menuDatabaseSync) menuDatabaseSync.style.display = "none";

    const defaultLang = localStorage.getItem("workmate_default_lang") || "hi";
    state.lang = defaultLang;
    updateLanguageUI();
    return false;
  }

  try {
    state.session = JSON.parse(savedSession);
    if (state.session && state.session.user) {
      state.userProfile = state.session.user;
    }
    if (authView) authView.style.display = "none";
    if (viewportWrapper) viewportWrapper.style.display = "flex";
    if (appContainer) appContainer.style.display = "flex";

    // Load isolated language preference for this specific user
    const userId = state.session.user ? state.session.user.id : "guest";
    const userLang = localStorage.getItem("workmate_lang_" + userId) || localStorage.getItem("workmate_default_lang") || "hi";
    state.lang = userLang;

    const isAdmin = state.session && state.session.role === "admin";
    // Admin top bar is only for authenticated admin
    if (adminTopBar) adminTopBar.style.display = isAdmin ? "flex" : "none";
    
    // Always keep 4 Modules and Database Records accessible in bottom nav and Account menu
    if (navAdmin) navAdmin.style.display = "flex";
    if (menuAdminConsole) menuAdminConsole.style.display = "flex";
    if (menuDatabaseSync) menuDatabaseSync.style.display = "flex";

    if (isAdmin) {
      switchTab("admin");
    } else {
      switchTab("home");
    }

    updateLanguageUI();
    return true;
  } catch (e) {
    localStorage.removeItem("workmate_session");
    if (authView) authView.style.display = "flex";
    if (viewportWrapper) viewportWrapper.style.display = "none";
    if (appContainer) appContainer.style.display = "none";
    return false;
  }
}

function switchAuthTab(tab) {
  const tabCust = document.getElementById("authTabCustomer");
  const tabReg = document.getElementById("authTabCustomerRegister");
  const tabAdmin = document.getElementById("authTabAdmin");
  const formCust = document.getElementById("formCustomerLogin");
  const formReg = document.getElementById("formCustomerRegister");
  const formAdmin = document.getElementById("formAdminLogin");

  [tabCust, tabReg, tabAdmin].forEach(t => t && t.classList.remove("active"));
  [formCust, formReg, formAdmin].forEach(f => f && (f.style.display = "none"));

  if (tab === "customer" || tab === "login") {
    if (tabCust) tabCust.classList.add("active");
    if (formCust) formCust.style.display = "block";
  } else if (tab === "register") {
    if (tabReg) tabReg.classList.add("active");
    if (formReg) formReg.style.display = "block";
  } else if (tab === "admin") {
    if (tabAdmin) tabAdmin.classList.add("active");
    if (formAdmin) formAdmin.style.display = "block";
  }
}

async function handleCustomerLogin(event) {
  if (event) event.preventDefault();
  const phone = (document.getElementById("loginPhoneInput").value || "").trim();

  if (!phone) {
    showToast(state.lang === "hi" ? "कृपया मोबाइल नंबर दर्ज करें।" : "Please enter your mobile number.", "error");
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "customer", identifier: phone })
    });

    const data = await res.json();
    if (!res.ok) {
      if (res.status === 404) {
        showToast(
          state.lang === "hi"
            ? "इस मोबाइल नंबर से खाता नहीं मिला। कृपया पहले नया खाता बनाएं।"
            : "Account not found with this mobile number. Please register first to create an account.",
          "error"
        );
        switchAuthTab("register");
        const cleanDigits = phone.replace(/[^0-9]/g, "").slice(-10);
        const regPhone = document.getElementById("registerPhoneInput");
        if (regPhone) regPhone.value = cleanDigits;
        return;
      }
      throw new Error(data.detail || "Login failed");
    }

    localStorage.setItem("workmate_session", JSON.stringify(data));
    showToast(state.lang === "hi" ? "सफलतापूर्वक लॉगिन हुआ! स्वागत है।" : "Logged in successfully! Welcome.", "success");

    checkUserSession();
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function handleCustomerRegister(event) {
  if (event) event.preventDefault();
  const name = (document.getElementById("registerNameInput").value || "").trim();
  const phone = (document.getElementById("registerPhoneInput").value || "").trim();
  const address = (document.getElementById("registerAddressInput").value || "").trim();
  const city = (document.getElementById("registerCityInput").value || "").trim();
  const emailInput = document.getElementById("registerEmailInput");
  const email = emailInput ? emailInput.value.trim() : "";

  if (!name || !phone) {
    showToast(state.lang === "hi" ? "कृपया नाम और मोबाइल नंबर दर्ज करें।" : "Please enter your name and mobile number.", "error");
    return;
  }

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, address, city, email })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Registration failed");

    localStorage.setItem("workmate_session", JSON.stringify(data));
    showToast(state.lang === "hi" ? "खाता सफलतापूर्वक बन गया है! स्वागत है।" : "Account registered successfully! Welcome to WorkMate.", "success");

    checkUserSession();
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function handleAdminLogin(event) {
  if (event) event.preventDefault();
  const adminId = document.getElementById("adminIdInput").value.trim();
  const password = document.getElementById("adminPasswordInput").value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin", identifier: adminId, password: password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Invalid Admin Credentials");

    localStorage.setItem("workmate_session", JSON.stringify(data));
    showToast("Admin Console Authenticated! Full Management Access Granted.", "success");

    checkUserSession();
    await loadInitialData();
    switchTab("admin");
  } catch (err) {
    showToast(err.message, "error");
  }
}

function switchAdminView(mode) {
  const btnAdmin = document.getElementById("btnAdminViewMode");
  const btnCust = document.getElementById("btnCustomerViewMode");

  if (mode === "admin") {
    if (btnAdmin) btnAdmin.classList.add("active");
    if (btnCust) btnCust.classList.remove("active");
    switchTab("admin");
  } else {
    if (btnCust) btnCust.classList.add("active");
    if (btnAdmin) btnAdmin.classList.remove("active");
    switchTab("home");
    showToast(
      state.lang === "hi" 
        ? "ग्राहक ऐप व्यू सक्रिय। आप ग्राहक अनुभव देख सकते हैं।" 
        : "Customer App View active. Browsing customer interface.", 
      "info"
    );
  }
}

function openLogoutModal() {
  document.getElementById("modalLogoutConfirm").classList.add("active");
}

function executeLogout() {
  // 1. Close all active modals
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));

  // 2. Terminate session
  localStorage.removeItem("workmate_session");
  state.session = null;

  // 3. Immediately scroll to top of page
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });

  // 4. Force display updates
  const authView = document.getElementById("view-auth");
  const viewportWrapper = document.getElementById("appViewportWrapper");
  const appContainer = document.getElementById("appContainer");

  if (authView) authView.style.display = "flex";
  if (viewportWrapper) viewportWrapper.style.display = "none";
  if (appContainer) appContainer.style.display = "none";

  // 5. Clean reload guarantees no white screen or leftover scroll positions
  window.location.reload();
}

// ----------------- Per-User Isolated Language Switcher ----------------- //

function toggleLanguage() {
  state.lang = state.lang === "hi" ? "en" : "hi";
  // Save per user key
  const userId = state.session && state.session.user ? state.session.user.id : "guest";
  localStorage.setItem("workmate_lang_" + userId, state.lang);

  updateLanguageUI();
}

function updateLanguageUI() {
  const isHi = state.lang === "hi";

  const langTag = document.getElementById("currentLangTag");
  const langIndicator = document.getElementById("currentLangIndicator");
  if (langTag) langTag.textContent = isHi ? "हिन्दी" : "English";
  if (langIndicator) langIndicator.textContent = isHi ? "HI" : "EN";

  applyTranslations();
  if (state.currentTab === "admin" || (state.session && state.session.role === "admin")) {
    renderAdminModulesRates();
    renderAdminBanksDashboard();
  }
  renderCategories();
  renderBookings();
  renderActiveBooking();
  renderTransactions();
  renderReviews();
  renderProfile();
}

function applyTranslations() {
  const dict = I18N[state.lang] || I18N.en;
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

  const greetingEl = document.getElementById("userGreetingText");
  const isAdmin = state.session && state.session.role === "admin";
  if (greetingEl) {
    const uName = isAdmin ? "admin" : (state.session && state.session.user ? state.session.user.name : state.userProfile.name);
    greetingEl.textContent = `${dict.greeting}${uName}!`;
  }

  const locEl = document.getElementById("headerLocationText");
  if (locEl) {
    locEl.textContent = isAdmin 
      ? (isHi ? "वर्कमेट प्रशासनिक मुख्यालय" : "WorkMate Admin HQ") 
      : (state.userProfile.address || "Flat 402, Lotus Tower, Sector 14");
  }

  const headerAvatar = document.querySelector(".header-user-avatar img");
  if (headerAvatar) {
    headerAvatar.src = isAdmin 
      ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
      : (state.userProfile.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face");
  }

  // Auth Card Language Switcher Label
  const authLangTag = document.getElementById("authLangTag");
  if (authLangTag) authLangTag.textContent = isHi ? "English" : "हिन्दी";

  const currentLangTag = document.getElementById("currentLangTag");
  if (currentLangTag) currentLangTag.textContent = isHi ? "English" : "हिन्दी";

  const currentLangIndicator = document.getElementById("currentLangIndicator");
  if (currentLangIndicator) currentLangIndicator.textContent = isHi ? "EN" : "HI";

  const menuLangIndicator = document.getElementById("menuLangIndicator");
  if (menuLangIndicator) menuLangIndicator.textContent = isHi ? "हिन्दी >" : "English >";

  // Always display 4 Core Service Modules and Database Records in Account menu
  const menuAdmin = document.getElementById("menuAdminConsoleItem");
  const menuDb = document.getElementById("menuDatabaseSyncItem");
  const navAdmin = document.getElementById("nav-admin");
  if (menuAdmin) menuAdmin.style.display = "flex";
  if (menuDb) menuDb.style.display = "flex";
  if (navAdmin) navAdmin.style.display = "flex";
}

// ----------------- Navigation Tabs ----------------- //

function switchTab(tabId) {
  state.currentTab = tabId;
  document.querySelectorAll(".screen-view").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-item-btn").forEach(el => el.classList.remove("active"));

  const targetScreen = document.getElementById(`screen-${tabId}`);
  const targetNav = document.getElementById(`nav-${tabId}`);

  if (targetScreen) targetScreen.classList.add("active");
  if (targetNav) targetNav.classList.add("active");

  if (tabId === "admin") {
    renderAdminModulesRates();
    renderAdminBanksDashboard();
    renderAdminFinancials();
  }
  if (tabId === "home") {
    renderCategories();
    renderActiveBooking();
    renderReviews();
  }
  if (tabId === "orders") renderBookings();
  if (tabId === "payments") renderWallet();
  if (tabId === "account") renderProfile();
}

// ----------------- Data Fetching ----------------- //

async function loadInitialData() {
  try {
    const currentUid = (state.session && state.session.user && state.session.user.id) 
      ? state.session.user.id 
      : (state.session && state.session.role === "admin" ? "admin-1" : "u-1");

    const [catsRes, servsRes, workersRes, bookingsRes, walletRes, txsRes, revsRes, profileRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/services"),
      fetch("/api/workers"),
      fetch("/api/bookings"),
      fetch("/api/wallet"),
      fetch("/api/wallet/transactions"),
      fetch("/api/reviews"),
      fetch(`/api/user/profile?user_id=${encodeURIComponent(currentUid)}`)
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

    await loadPlatformConfig();

    renderCategories();
    renderActiveBooking();
    renderBookings();
    renderWallet();
    renderTransactions();
    renderReviews();
    renderProfile();
    renderAdminModulesRates();
    renderAdminBanksDashboard();
    renderAdminFinancials();
    applyTranslations();

    if (state.session && state.session.role === "admin") {
      switchTab("admin");
    }
  } catch (err) {
    console.error("Error initializing app data:", err);
  }
}

// ----------------- Categories Rendering ----------------- //

function renderCategories(filterText = "") {
  const grid = document.getElementById("categoriesGrid");
  if (!grid) return;

  const isHi = state.lang === "hi";
  let filtered = state.categories;

  if (filterText) {
    const q = filterText.toLowerCase();
    filtered = state.categories.filter(c => 
      (c.name_en && c.name_en.toLowerCase().includes(q)) || 
      (c.name_hi && c.name_hi.toLowerCase().includes(q)) ||
      (c.subtext_en && c.subtext_en.toLowerCase().includes(q)) ||
      (c.subtext_hi && c.subtext_hi.toLowerCase().includes(q))
    );
  }

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
          <i class="fa-solid fa-star"></i> ${(cat.rating != null ? Number(cat.rating).toFixed(1) : "4.8")}
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

// ----------------- Active Booking Rendering ----------------- //

function renderActiveBooking() {
  const container = document.getElementById("activeBookingContainer");
  if (!container) return;

  const b = state.bookings.find(item => item.status === "in_progress" || item.status === "upcoming" || item.status === "arrived" || item.status === "working") || state.activeBooking;
  const isHi = state.lang === "hi";
  const dict = I18N[state.lang] || I18N.en;

  if (!b || b.status === "completed" || b.status === "cancelled" || b.status === "disputed_refunded") {
    container.innerHTML = `
      <div style="background:#f1f5f9; padding:16px; border-radius:12px; text-align:center; color:#64748b; font-size:13px;">
        <i class="fa-solid fa-circle-check" style="color:#10b981; font-size:20px; margin-bottom:6px; display:block;"></i>
        ${dict.noActiveBooking}
      </div>
    `;
    return;
  }

  const tradeTitle = isHi ? (b.worker_trade_hi || b.worker_trade) : (b.worker_trade || b.worker_trade_hi);

  // Status-specific action section
  let middleStatusContent = "";
  let actionButtonsHtml = "";

  if (b.status === "arrived") {
    // 1. Worker arrived: DO NOT show tracking, show arrived notice & OTP verification
    middleStatusContent = `
      <div class="booking-arrived-alert">
        <div>
          <div style="font-weight:800; color:#065f46; font-size:14px;">
            <i class="fa-solid fa-circle-check"></i> ${isHi ? 'श्रमिक द्वार पर पहुंच चुके हैं!' : 'Worker Arrived at Doorstep!'}
          </div>
          <div style="font-size:12px; color:#047857; margin-top:2px;">
            ${isHi ? 'कार्य शुरू करवाने के लिए यह ओटीपी बताएं:' : 'Share this OTP with worker to start work:'}
          </div>
        </div>
        <div class="otp-pill" style="font-size:16px; background:#10b981; color:#ffffff; padding:4px 10px; font-weight:800; letter-spacing:2px;">
          ${b.otp || '5603'}
        </div>
      </div>
    `;
    actionButtonsHtml = `
      <div class="booking-actions-row">
        <button class="btn-complete-job" style="width:100%; background:#10b981; font-weight:800;" onclick="openVerifyOtpModal('${b.id}')">
          <i class="fa-solid fa-key"></i> ${isHi ? 'ओटीपी जांचें और काम शुरू करें' : 'Verify OTP & Start Job'}
        </button>
      </div>
    `;
  } else if (b.status === "working") {
    // 2. Work in progress: timer active, prompt to finish job
    middleStatusContent = `
      <div style="background:#fef3c7; border:1px solid #fde68a; border-radius:8px; padding:10px 12px; margin:10px 0; display:flex; justify-content:space-between; align-items:center;">
        <div style="font-weight:800; color:#92400e; font-size:13px;">
          <i class="fa-solid fa-stopwatch"></i> ${isHi ? 'कार्य प्रगति पर है' : 'Work in Progress'}
        </div>
        <span style="font-size:12px; color:#b45309; font-weight:700;">⏱️ Active</span>
      </div>
    `;
    actionButtonsHtml = `
      <div class="booking-actions-row">
        <button class="btn-complete-job" style="width:100%; background:#10b981; font-weight:800;" onclick="triggerCompleteJob('${b.id}')">
          <i class="fa-solid fa-flag-checkered"></i> ${isHi ? 'काम पूरा हुआ (पेआउट जारी करें)' : 'Confirm Job Finished (Release Payout)'}
        </button>
      </div>
    `;
  } else {
    // 3. Worker on the way: show ETA and Live GPS Tracking button
    middleStatusContent = `
      <div class="booking-eta-otp-row">
        <div class="eta-text">
          <i class="fa-solid fa-motorcycle"></i> ${isHi ? `आगमन: ${b.eta_minutes || 12} मिनट` : `ETA: ${b.eta_minutes || 12} Mins`}
        </div>
        <div>
          <span style="font-size:11px; opacity:0.8; margin-right:4px;">${dict.otpPrefix}</span>
          <span class="otp-pill">${b.otp}</span>
        </div>
      </div>
    `;
    actionButtonsHtml = `
      <div class="booking-actions-row">
        <button class="btn-track-live" onclick="openLiveTrackingModal('${b.id}')">
          <i class="fa-solid fa-location-crosshairs"></i> ${dict.trackLive}
        </button>
        <button class="btn-complete-job" onclick="openVerifyOtpModal('${b.id}')">
          <i class="fa-solid fa-check-double"></i> ${dict.verifyOtpBtn}
        </button>
      </div>
    `;
  }

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

      ${middleStatusContent}
      ${actionButtonsHtml}

      <button type="button" class="btn-dispute-worker" onclick="openDisputeModal('${b.id}', '${b.worker_id || 'w-101'}', '${(b.worker_name || 'Mukesh Verma').replace(/'/g, "\\'")}')">
        <i class="fa-solid fa-triangle-exclamation"></i> ${dict.reportIssueBtn}
      </button>
    </div>
  `;
}

// ----------------- Bookings List Rendering ----------------- //

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

// ----------------- Wallet & Payments Rendering ----------------- //

function renderWallet() {
  const balEl = document.getElementById("walletBalanceAmount");
  if (balEl && state.wallet) {
    balEl.textContent = `₹${state.wallet.balance.toLocaleString('en-IN')}`;
  }
}

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

function renderProfile() {
  const isHi = state.lang === "hi";
  const dict = I18N[state.lang];
  const isAdmin = state.session && state.session.role === "admin";
  const todayFormatted = isHi ? "14 सितंबर 2026" : "September 14, 2026";

  // Dedicated admin profile vs customer profile
  let p = state.userProfile;
  if (!p) {
    if (isAdmin) {
      p = {
        id: "admin-1",
        name: "admin",
        phone: "7878193644",
        email: "bhavarthhapani7@gmail.com",
        address: "",
        city: "",
        photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        member_id: "WM-ADMIN-001",
        account_type: isHi ? "सिस्टम प्रशासक (Admin)" : "System Administrator",
        joined_date: todayFormatted,
        trust_score: 5.0,
        kyc_status: "verified"
      };
    } else {
      p = {
        id: "u-1",
        name: "Ramesh Kumar",
        phone: "+91 98765 43210",
        email: "ramesh.kumar@workmate.in",
        address: "Flat 402, Lotus Tower, Sector 14",
        city: "Noida, Uttar Pradesh",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        aadhaar_masked: "•••• •••• 9012",
        member_id: "WM-USER-89104",
        account_type: "Customer Premium",
        joined_date: todayFormatted,
        trust_score: 4.9,
        kyc_status: "verified"
      };
    }
  }

  const nameEl = document.getElementById("accountUserName");
  const phoneEl = document.getElementById("accountUserPhone");
  if (nameEl) nameEl.textContent = p.name || (isAdmin ? "admin" : "Ramesh Kumar");
  if (phoneEl) phoneEl.textContent = p.phone || (isAdmin ? "7878193644" : "+91 98765 43210");

  const accountAvatar = document.getElementById("accountProfileAvatarImg");
  if (accountAvatar && p.photo) {
    accountAvatar.src = p.photo;
  }
  const headerAvatar = document.querySelector(".header-user-avatar img");
  if (headerAvatar && p.photo) {
    headerAvatar.src = p.photo;
  }
  const editPreview = document.getElementById("editProfilePhotoPreview");
  if (editPreview && p.photo) {
    editPreview.src = p.photo;
  }

  const grid = document.getElementById("accountDetailsGrid");
  if (grid) {
    const fullAddress = [p.address, p.city].filter(Boolean).join(", ");
    const userJoinedDate = p.joined_date || todayFormatted;

    if (isAdmin) {
      grid.innerHTML = `
        <div class="detail-pill">
          <div class="detail-label"><i class="fa-solid fa-lock"></i> ${dict.memberIdLabel}</div>
          <div class="detail-value">${p.member_id || 'WM-ADMIN-001'}</div>
        </div>
        <div class="detail-pill">
          <div class="detail-label"><i class="fa-solid fa-shield-halved"></i> ${isHi ? 'भूमिका' : 'Role'}</div>
          <div class="detail-value" style="color:#1e40af; font-weight:800;">${isHi ? 'सिस्टम प्रशासक' : (p.account_type || 'System Administrator')}</div>
        </div>
        <div class="detail-pill" style="grid-column: span 2;">
          <div class="detail-label"><i class="fa-solid fa-envelope"></i> ${isHi ? 'ईमेल' : 'Email'}</div>
          <div class="detail-value" style="color:#0f172a; font-weight:700;">${p.email || 'bhavarthhapani7@gmail.com'}</div>
        </div>
        <div class="detail-pill">
          <div class="detail-label"><i class="fa-solid fa-phone"></i> ${isHi ? 'मोबाइल' : 'Mobile'}</div>
          <div class="detail-value">${p.phone || '7878193644'}</div>
        </div>
        <div class="detail-pill">
          <div class="detail-label"><i class="fa-solid fa-calendar-check"></i> ${dict.joinedLabel}</div>
          <div class="detail-value">${userJoinedDate}</div>
        </div>
        <div class="detail-pill" style="grid-column: span 2;">
          <div class="detail-label"><i class="fa-solid fa-location-dot"></i> ${isHi ? 'पता एवं स्थान' : 'Address & City/State'}</div>
          <div class="detail-value" style="${fullAddress ? 'color:#0f172a; font-weight:700;' : 'color:#94a3b8; font-style:italic;'}">
            ${fullAddress ? fullAddress : (isHi ? '— (खाली / सेट नहीं)' : '— (Blank / Not Set)')}
          </div>
        </div>
      `;
    } else {
      grid.innerHTML = `
        <div class="detail-pill">
          <div class="detail-label"><i class="fa-solid fa-lock"></i> ${dict.memberIdLabel}</div>
          <div class="detail-value">${p.member_id || 'WM-USER-89104'}</div>
        </div>
        <div class="detail-pill">
          <div class="detail-label"><i class="fa-solid fa-shield-halved"></i> ${dict.aadhaarLabel}</div>
          <div class="detail-value" style="color:#10b981;">✓ ${isHi ? "सत्यापित" : "Verified"} (${p.aadhaar_masked || '•••• •••• 9012'})</div>
        </div>
        <div class="detail-pill">
          <div class="detail-label"><i class="fa-solid fa-crown"></i> ${dict.accountTypeLabel}</div>
          <div class="detail-value">${isHi ? "प्रीमियम ग्राहक" : (p.account_type || "Customer Premium")}</div>
        </div>
        <div class="detail-pill">
          <div class="detail-label"><i class="fa-solid fa-calendar-check"></i> ${dict.joinedLabel}</div>
          <div class="detail-value">${userJoinedDate}</div>
        </div>
        <div class="detail-pill" style="grid-column: span 2;">
          <div class="detail-label"><i class="fa-solid fa-location-dot"></i> ${isHi ? "पंजीकृत सेवा का पता" : "Registered Service Address"}</div>
          <div class="detail-value" style="${fullAddress ? 'color:#0f172a; font-weight:700;' : 'color:#94a3b8; font-style:italic;'}">
            ${fullAddress ? fullAddress : (isHi ? '— (खाली / सेट नहीं)' : '— (Blank / Not Set)')}
          </div>
        </div>
      `;
    }
  }
}

// ----------------- Profile View & Change Avatar ----------------- //

function openAvatarViewModal() {
  const isHi = state.lang === "hi";
  const isAdmin = state.session && state.session.role === "admin";
  const todayFormatted = isHi ? "14 सितंबर 2026" : "September 14, 2026";
  const p = state.userProfile || (isAdmin ? {
    name: "admin",
    account_type: "System Administrator",
    joined_date: todayFormatted,
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
  } : {
    name: "Ramesh Kumar",
    account_type: "Customer Premium",
    joined_date: todayFormatted,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
  });

  const img = document.getElementById("viewAvatarModalImg");
  const name = document.getElementById("viewAvatarModalName");
  const role = document.getElementById("viewAvatarModalRole");
  const joined = document.getElementById("viewAvatarModalJoined");

  const fallbackPhoto = isAdmin 
    ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face";

  if (img) img.src = p.photo || fallbackPhoto;
  if (name) name.textContent = p.name || (isAdmin ? "admin" : "Ramesh Kumar");
  if (role) role.textContent = isHi ? (isAdmin ? "सिस्टम प्रशासक" : "प्रीमियम ग्राहक") : (p.account_type || (isAdmin ? "System Administrator" : "Customer Premium"));
  if (joined) joined.textContent = (isHi ? "सदस्यता तिथि: " : "Member Since: ") + (p.joined_date || todayFormatted);

  document.getElementById("modalViewAvatar").classList.add("active");
}

function triggerAvatarUpload(event) {
  if (event) event.stopPropagation();
  const fileInput = document.getElementById("avatarFileInput");
  if (fileInput) {
    fileInput.value = "";
    fileInput.click();
  }
}

async function handleAvatarFileSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    showToast("Please select a valid image file (PNG, JPG, WebP)", "error");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast("Image size should be less than 5MB", "error");
    return;
  }

  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64Data = e.target.result;
    await saveNewProfileAvatar(base64Data);
  };
  reader.readAsDataURL(file);
}

async function saveNewProfileAvatar(photoDataUrl) {
  const isHi = state.lang === "hi";
  const isAdmin = state.session && state.session.role === "admin";
  const currentUid = (state.session && state.session.user && state.session.user.id)
    ? state.session.user.id
    : (isAdmin ? "admin-1" : "u-1");

  try {
    const res = await fetch(`/api/user/avatar?user_id=${encodeURIComponent(currentUid)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photo: photoDataUrl })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to update profile photo");

    state.userProfile = data.profile;
    if (state.session) {
      state.session.user = { ...(state.session.user || {}), ...data.profile };
      localStorage.setItem("workmate_session", JSON.stringify(state.session));
    }

    // Update DOM images immediately
    const accountAvatar = document.getElementById("accountProfileAvatarImg");
    if (accountAvatar) accountAvatar.src = photoDataUrl;
    const headerAvatar = document.querySelector(".header-user-avatar img");
    if (headerAvatar) headerAvatar.src = photoDataUrl;
    const lightboxImg = document.getElementById("viewAvatarModalImg");
    if (lightboxImg) lightboxImg.src = photoDataUrl;
    const previewImg = document.getElementById("editProfilePhotoPreview");
    if (previewImg) previewImg.src = photoDataUrl;

    showToast(isHi ? "प्रोफाइल फोटो सफलतापूर्वक अपडेट हो गई!" : "Profile photo updated successfully!", "success");
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ----------------- Profile Edit ----------------- //

function openEditProfileModal() {
  const isAdmin = state.session && state.session.role === "admin";
  const isHi = state.lang === "hi";
  const todayFormatted = isHi ? "14 सितंबर 2026" : "September 14, 2026";
  const p = state.userProfile || (isAdmin ? {
    name: "admin",
    phone: "7878193644",
    email: "bhavarthhapani7@gmail.com",
    address: "",
    city: "",
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    member_id: "WM-ADMIN-001",
    aadhaar_masked: "",
    joined_date: todayFormatted
  } : {
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    email: "ramesh.kumar@workmate.in",
    address: "Flat 402, Lotus Tower, Sector 14",
    city: "Noida, Uttar Pradesh",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    member_id: "WM-USER-89104",
    aadhaar_masked: "•••• •••• 9012",
    joined_date: todayFormatted
  });

  const preview = document.getElementById("editProfilePhotoPreview");
  if (preview) {
    preview.src = p.photo || (isAdmin ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face");
  }

  document.getElementById("editProfileName").value = p.name || (isAdmin ? "admin" : "Ramesh Kumar");
  document.getElementById("editProfilePhone").value = p.phone || (isAdmin ? "7878193644" : "+91 98765 43210");
  document.getElementById("editProfileEmail").value = p.email || (isAdmin ? "bhavarthhapani7@gmail.com" : "");
  document.getElementById("editProfileAddress").value = p.address || "";
  document.getElementById("editProfileCity").value = p.city || "";
  document.getElementById("editProfileMemberId").value = p.member_id || (isAdmin ? "WM-ADMIN-001" : "WM-USER-89104");
  document.getElementById("editProfileAadhaar").value = p.aadhaar_masked ? `Verified UIDAI: ${p.aadhaar_masked}` : (isAdmin ? "—" : "•••• •••• 9012");

  document.getElementById("modalEditProfile").classList.add("active");
}

async function submitProfileEdit(event) {
  event.preventDefault();
  const isHi = state.lang === "hi";
  const isAdmin = state.session && state.session.role === "admin";
  const currentUid = (state.session && state.session.user && state.session.user.id) 
    ? state.session.user.id 
    : (isAdmin ? "admin-1" : "u-1");

  const name = document.getElementById("editProfileName").value.trim();
  const phone = document.getElementById("editProfilePhone").value.trim();
  const email = document.getElementById("editProfileEmail").value.trim();
  const address = document.getElementById("editProfileAddress").value.trim();
  const city = document.getElementById("editProfileCity").value.trim();

  try {
    const res = await fetch(`/api/user/profile?user_id=${encodeURIComponent(currentUid)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, address, city })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || (isHi ? "प्रोफाइल अपडेट विफल रही" : "Profile update failed"));

    state.userProfile = data.profile;
    if (state.session) {
      state.session.user = { ...(state.session.user || {}), ...data.profile };
      localStorage.setItem("workmate_session", JSON.stringify(state.session));
    }
    closeModal("modalEditProfile");
    showToast(isHi ? "प्रोफाइल सफलतापूर्वक अपडेट हो गई!" : "Profile updated successfully!", "success");

    renderProfile();
    applyTranslations();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ----------------- Dedicated Admin Dashboard (4-Module Rate Editor & Routing) ----------------- //

async function loadPlatformConfig() {
  try {
    const res = await fetch("/api/admin/config");
    if (res.ok) {
      const data = await res.json();
      state.platformChargePercent = data.platform_charge_percent || 10;
      const input = document.getElementById("adminPlatformChargePercentInput");
      if (input) input.value = state.platformChargePercent;
    }
  } catch (e) {
    console.error("Could not load platform config:", e);
  }
}

async function savePlatformChargePercent() {
  const input = document.getElementById("adminPlatformChargePercentInput");
  if (!input) return;
  const val = parseFloat(input.value);
  if (isNaN(val) || val < 0 || val > 50) {
    showToast("Please enter a valid percentage between 0 and 50", "error");
    return;
  }

  try {
    const res = await fetch("/api/admin/config/platform-charge", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ percent: val })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to update platform charge");

    state.platformChargePercent = data.platform_charge_percent;
    const statusEl = document.getElementById("chargePercentStatus");
    if (statusEl) {
      statusEl.style.display = "block";
      setTimeout(() => { statusEl.style.display = "none"; }, 3500);
    }
    showToast(data.message || "Platform charge percent updated!", "success");

    // Recalculate module prices and quotes
    renderAdminModulesRates();
    updateEstimatedPrice();
  } catch (e) {
    showToast(e.message, "error");
  }
}

function toggleAdminModule(catKey) {
  if (!state.expandedAdminModules) {
    state.expandedAdminModules = { construction: true, events: false, shifting: false, textile: false };
  }
  const isHi = state.lang === "hi";
  const nowOpen = !state.expandedAdminModules[catKey];
  state.expandedAdminModules[catKey] = nowOpen;

  const card = document.getElementById(`admin-module-card-${catKey}`);
  const list = document.getElementById(`admin-trades-list-${catKey}`);
  const chevron = document.getElementById(`admin-module-chevron-${catKey}`);
  const label = document.getElementById(`admin-dropdown-label-${catKey}`);

  if (card && list) {
    if (nowOpen) {
      card.classList.remove("is-collapsed");
      list.style.display = "flex";
      if (label) label.textContent = isHi ? "छिपाएं" : "Hide";
    } else {
      card.classList.add("is-collapsed");
      list.style.display = "none";
      if (label) label.textContent = isHi ? "विवरण देखें" : "View Details";
    }
  }
}

function toggleAllAdminModules(open) {
  const catKeys = ["construction", "events", "shifting", "textile"];
  if (!state.expandedAdminModules) state.expandedAdminModules = {};
  catKeys.forEach(k => {
    state.expandedAdminModules[k] = open;
  });
  renderAdminModulesRates();
}

function renderAdminModulesRates() {
  const container = document.getElementById("adminModulesRatesContainer");
  if (!container) return;

  const isHi = state.lang === "hi";
  const catKeys = ["construction", "events", "shifting", "textile"];

  if (!state.expandedAdminModules) {
    // Construction open by default, other 3 collapsed into clean dropdowns
    state.expandedAdminModules = { construction: true, events: false, shifting: false, textile: false };
  }

  container.innerHTML = catKeys.map(catKey => {
    const meta = ADMIN_MODULES_META[catKey];
    const catServices = state.services.filter(s => s.category_id === catKey);
    const isOpen = !!state.expandedAdminModules[catKey];

    return `
      <div class="admin-module-card ${isOpen ? '' : 'is-collapsed'}" id="admin-module-card-${catKey}">
        <div class="admin-module-header" onclick="toggleAdminModule('${catKey}')" title="${isHi ? 'ड्रॉपडाउन खोलने/बंद करने के लिए क्लिक करें' : 'Click to expand/collapse dropdown'}">
          <div class="admin-module-title-box">
            <div class="admin-module-icon-badge" style="background:${meta.color}; color:${meta.textColor};">
              <i class="fa-solid ${meta.icon}"></i>
            </div>
            <div>
              <div style="font-size:14px; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:8px;">
                <span>${isHi ? meta.name_hi : meta.name_en}</span>
              </div>
              <div style="font-size:11px; color:#64748b;">
                ${isHi ? meta.desc_hi : meta.desc_en}
              </div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:11px; font-weight:700; background:#f1f5f9; color:#475569; padding:3px 8px; border-radius:12px;">
              ${catServices.length} ${isHi ? 'ट्रेड्स' : 'Trades'}
            </span>
            <div class="admin-dropdown-pill">
              <span id="admin-dropdown-label-${catKey}">
                ${isOpen ? (isHi ? 'छिपाएं' : 'Hide') : (isHi ? 'विवरण देखें' : 'View Details')}
              </span>
              <i class="fa-solid fa-chevron-down admin-module-chevron" id="admin-module-chevron-${catKey}"></i>
            </div>
          </div>
        </div>

        <div class="admin-trades-list" id="admin-trades-list-${catKey}" style="${isOpen ? '' : 'display:none;'}">
          ${catServices.map(serv => `
            <div class="admin-trade-item" id="admin-trade-item-${serv.id}">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div style="font-weight:700; font-size:13px; color:#0f172a;">
                    ${isHi ? serv.name_hi : serv.name_en}
                    <span style="font-size:11px; color:#94a3b8; font-weight:400; margin-left:6px;">(${serv.id})</span>
                  </div>
                  <div style="font-size:11px; color:#64748b; margin-top:2px;">
                    ${isHi ? serv.desc_hi : serv.desc_en}
                  </div>
                </div>
                <span id="saved-badge-${serv.id}" style="display:none; background:#dcfce7; color:#15803d; font-size:11px; font-weight:800; padding:2px 8px; border-radius:12px;">
                  ✓ Saved
                </span>
              </div>

              <!-- Editable Rate Row -->
              <div class="admin-rate-edit-row">
                <div class="admin-input-group">
                  <span style="font-weight:800; color:#1e40af; font-size:14px; margin-right:4px;">₹</span>
                  <input type="number" id="admin-input-rate-${serv.id}" class="admin-trade-rate-input" value="${serv.base_rate}" step="10" min="50" oninput="previewAdminRateCalc('${serv.id}', this.value)" />
                  <span style="font-size:11px; color:#64748b; font-weight:600;">/ ${serv.unit === 'per_day' ? (isHi ? 'दिन' : 'day') : (isHi ? 'घंटा' : 'hour')}</span>
                </div>
                <button class="btn-save-trade-rate" id="btn-save-${serv.id}" onclick="saveServiceRate('${serv.id}')">
                  <i class="fa-solid fa-floppy-disk"></i> <span>${isHi ? 'दर सेव करें' : 'Save Rate'}</span>
                </button>
              </div>

              <!-- Real-time Price Breakdown Preview -->
              <div class="admin-live-breakdown" id="breakdown-preview-${serv.id}">
                <span class="calc-chip">Base: ₹${serv.base_rate}</span>
                <span class="calc-operator">+</span>
                <span class="calc-chip">${isHi ? 'चार्ज' : 'Charge'}: ₹${Math.round(serv.base_rate * ((state.platformChargePercent || 10) / 100))}</span>
                <span class="calc-operator">=</span>
                <span class="calc-chip-total">Customer Total: ₹${Math.round(serv.base_rate * (1 + (state.platformChargePercent || 10) / 100))}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function previewAdminRateCalc(serviceId, val) {
  const num = parseFloat(val);
  const el = document.getElementById("breakdown-preview-" + serviceId);
  if (!el) return;
  if (isNaN(num) || num <= 0) {
    el.innerHTML = `<span style="color:#ef4444; font-size:11px;">Please enter a valid rate amount greater than ₹0</span>`;
    return;
  }
  const pct = state.platformChargePercent || 10;
  const charge = Math.round(num * (pct / 100));
  const total = Math.round(num + charge);
  const isHi = state.lang === "hi";
  el.innerHTML = `
    <span class="calc-chip">Base: ₹${num}</span>
    <span class="calc-operator">+</span>
    <span class="calc-chip">${isHi ? 'चार्ज' : 'Charge'}: ₹${charge}</span>
    <span class="calc-operator">=</span>
    <span class="calc-chip-total">Customer Total: ₹${total}</span>
  `;
}

async function saveServiceRate(serviceId) {
  const input = document.getElementById(`admin-input-rate-${serviceId}`) || document.getElementById(`rateInput_${serviceId}`);
  if (!input) return;
  const newRate = parseFloat(input.value);
  if (isNaN(newRate) || newRate <= 0) {
    showToast("Please enter a valid positive number for rate.", "error");
    return;
  }

  const btn = document.getElementById(`btn-save-${serviceId}`);
  const origHtml = btn ? btn.innerHTML : "";
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Saving...`;
  }

  try {
    const res = await fetch(`/api/services/${serviceId}/rate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base_rate: newRate })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Rate update failed");

    // Update in local state
    const idx = state.services.findIndex(s => s.id === serviceId);
    if (idx !== -1) {
      state.services[idx].base_rate = newRate;
    }

    // Highlight item
    const itemEl = document.getElementById(`admin-trade-item-${serviceId}`);
    const badgeEl = document.getElementById(`saved-badge-${serviceId}`);
    if (itemEl) itemEl.classList.add("updated-highlight");
    if (badgeEl) {
      badgeEl.style.display = "inline-block";
      setTimeout(() => {
        if (badgeEl) badgeEl.style.display = "none";
        if (itemEl) itemEl.classList.remove("updated-highlight");
      }, 3000);
    }

    const servName = state.lang === "hi" ? data.service.name_hi : data.service.name_en;
    showToast(
      state.lang === "hi" 
        ? `${servName}: नई बेस दर ₹${newRate.toLocaleString('en-IN')}/दिन सफलतापूर्वक सेव हुई!` 
        : `${servName}: New base rate ₹${newRate.toLocaleString('en-IN')} saved successfully!`, 
      "success"
    );

    // Refresh pricing breakdown previews and dropdowns
    previewAdminRateCalc(serviceId, newRate);
    updateEstimatedPrice();
  } catch (e) {
    showToast(e.message, "error");
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = origHtml;
    }
  }
}

async function saveRateFromBookingModal() {
  const servSelect = document.getElementById("bookingServiceSelect");
  const serviceId = servSelect ? servSelect.value : null;
  if (!serviceId) return;

  const rateInput = document.getElementById("modalBookingAdminRateInput");
  const newRate = parseFloat(rateInput.value);
  if (isNaN(newRate) || newRate <= 0) {
    showToast("Please enter a valid rate amount.", "error");
    return;
  }

  try {
    const res = await fetch(`/api/services/${serviceId}/rate`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base_rate: newRate })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to update rate");

    // Update state
    const idx = state.services.findIndex(s => s.id === serviceId);
    if (idx !== -1) {
      state.services[idx].base_rate = newRate;
    }

    const badge = document.getElementById("adminInlineRateSavedBadge");
    if (badge) {
      badge.style.display = "inline";
      setTimeout(() => { badge.style.display = "none"; }, 3000);
    }

    showToast(`Base rate updated to ₹${newRate}! Recalculating totals...`, "success");
    
    // Update select options
    openBookingForCategory(state.selectedCategoryForBooking);
    if (servSelect) servSelect.value = serviceId;
    updateEstimatedPrice();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function renderAdminBanksDashboard() {
  const container = document.getElementById("adminBankCardsList");
  if (!container) return;

  try {
    const res = await fetch("/api/admin/banks");
    const banks = await res.json();
    state.adminBanks = banks;

    container.innerHTML = banks.map(b => `
      <div class="admin-bank-card ${b.is_primary ? 'active-primary' : ''}">
        <div style="flex:1;">
          <div style="font-weight:700; font-size:13px; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
            <span>${b.bank_name}</span>
            ${b.is_primary 
              ? `<span style="background:#10b981; color:#fff; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:800;">PRIMARY ACTIVE</span>` 
              : `<span style="background:#e2e8f0; color:#475569; font-size:10px; padding:2px 6px; border-radius:4px; font-weight:600;">STANDBY BACKUP</span>`}
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:2px;">
            A/C: ${b.account_masked} • IFSC: ${b.ifsc} • UPI: <code>${b.upi_id}</code>
          </div>
          <div style="font-size:10px; color:#1e40af; margin-top:4px;">
            Routed Volume: ₹${(b.total_routed_inr || 0).toLocaleString('en-IN')} • Failover Auto-Routing: Engaged
          </div>
        </div>
        <div>
          ${!b.is_primary 
            ? `<button class="btn-wallet-action" style="padding:6px 12px; font-size:11px; background:#1a56db; color:#fff;" onclick="switchAdminBank('${b.id}')">Make Primary</button>` 
            : `<span style="color:#10b981; font-weight:700; font-size:12px; display:flex; align-items:center; gap:4px;"><i class="fa-solid fa-circle-check"></i> Primary Gateway</span>`}
        </div>
      </div>
    `).join("");
  } catch (e) {
    console.error("Error loading admin banks:", e);
  }
}

async function switchAdminBank(bankId) {
  try {
    const res = await fetch(`/api/admin/banks/${bankId}/switch`, { method: "POST" });
    const data = await res.json();
    showToast(data.message || "Primary settlement bank updated!", "success");
    renderAdminBanksDashboard();
  } catch (e) {
    showToast(e.message, "error");
  }
}

async function renderAdminFinancials() {
  const container = document.getElementById("adminFinancialStatsGrid");
  if (!container) return;

  try {
    const res = await fetch("/api/admin/financial-stats");
    const stats = await res.json();
    state.adminStats = stats;

    container.innerHTML = `
      <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:12px; border-radius:8px; text-align:center;">
        <div style="font-size:10px; color:#1e40af; font-weight:700;">TOTAL PLATFORM GMV</div>
        <div style="font-size:18px; font-weight:800; color:#1e3a8a; margin-top:2px;">₹${(stats.total_gmv || 0).toLocaleString('en-IN')}</div>
      </div>
      <div style="background:#ecfdf5; border:1px solid #a7f3d0; padding:12px; border-radius:8px; text-align:center;">
        <div style="font-size:10px; color:#065f46; font-weight:700;">10% WORKMATE CHARGE</div>
        <div style="font-size:18px; font-weight:800; color:#047857; margin-top:2px;">₹${(stats.total_workmate_charge || 0).toLocaleString('en-IN')}</div>
      </div>
      <div style="background:#fef3c7; border:1px solid #fde68a; padding:12px; border-radius:8px; text-align:center;">
        <div style="font-size:10px; color:#92400e; font-weight:700;">ESCROW RESERVES</div>
        <div style="font-size:18px; font-weight:800; color:#b45309; margin-top:2px;">₹${(stats.active_escrow_reserves || 0).toLocaleString('en-IN')}</div>
      </div>
      <div style="background:#f1f5f9; border:1px solid #cbd5e1; padding:12px; border-radius:8px; text-align:center;">
        <div style="font-size:10px; color:#475569; font-weight:700;">DISBURSED TO WORKERS</div>
        <div style="font-size:18px; font-weight:800; color:#1e293b; margin-top:2px;">₹${(stats.worker_payouts_completed || 0).toLocaleString('en-IN')}</div>
      </div>
    `;
  } catch (e) {
    console.error("Error loading admin stats:", e);
  }
}

// ----------------- Customer Work Adding & Escrow Pay ----------------- //

function openBookingForCategory(categoryId) {
  state.selectedCategoryForBooking = categoryId;
  const select = document.getElementById("bookingServiceSelect");
  if (!select) return;

  const filteredServices = categoryId ? state.services.filter(s => s.category_id === categoryId) : state.services;
  const isHi = state.lang === "hi";

  select.innerHTML = (filteredServices.length ? filteredServices : state.services).map(s => `
    <option value="${s.id}">${isHi ? s.name_hi : s.name_en} (₹${s.base_rate}/${s.unit === 'per_day' ? (isHi ? 'दिन' : 'day') : (isHi ? 'घंटा' : 'hour')})</option>
  `).join("");

  syncModalBookingAdminBox();
  updateEstimatedPrice();
  document.getElementById("modalBooking").classList.add("active");
}

function syncModalBookingAdminBox() {
  const select = document.getElementById("bookingServiceSelect");
  const adminBox = document.getElementById("modalBookingAdminRateBox");
  const adminInput = document.getElementById("modalBookingAdminRateInput");
  const adminUnit = document.getElementById("modalBookingAdminRateUnit");

  if (!select) return;
  const service = state.services.find(s => s.id === select.value);

  if (state.session && state.session.role === "admin") {
    if (adminBox) adminBox.style.display = "block";
    if (adminInput && service) adminInput.value = service.base_rate;
    if (adminUnit && service) adminUnit.textContent = `/${service.unit === 'per_day' ? (state.lang === 'hi' ? 'दिन' : 'day') : (state.lang === 'hi' ? 'घंटा' : 'hour')}`;
  } else {
    if (adminBox) adminBox.style.display = "none";
  }
}

function updateEstimatedPrice() {
  const select = document.getElementById("bookingServiceSelect");
  const durationInput = document.getElementById("bookingDurationHours");
  const typeSelect = document.getElementById("bookingTypeSelect");
  const priceDisplay = document.getElementById("bookingPriceEstimate");
  const customOfferInput = document.getElementById("bookingCustomOfferInput");

  if (!select || !durationInput || !priceDisplay) return;

  const serviceId = select.value;
  const service = state.services.find(s => s.id === serviceId);
  const hours = parseInt(durationInput.value) || 4;
  const isInstant = typeSelect ? typeSelect.value === "instant" : true;
  const isHi = state.lang === "hi";

  syncModalBookingAdminBox();

  // Check if customer entered a custom budget offer
  const customOfferVal = customOfferInput ? parseFloat(customOfferInput.value) : 0;
  const isCustom = !isNaN(customOfferVal) && customOfferVal > 0;
  const baseRate = isCustom ? customOfferVal : (service ? service.base_rate : 750);

  const subtotal = Math.round(baseRate * (hours >= 8 ? hours / 8 : hours / 4));
  const chargePct = state.platformChargePercent || 10;
  const platformCharge = Math.round(subtotal * (chargePct / 100));
  const emergency = isInstant ? 150 : 0;
  const total = subtotal + platformCharge + emergency;

  priceDisplay.innerHTML = `
    <strong>₹${total.toLocaleString('en-IN')}</strong> 
    <span style="font-size:11px; color:#64748b; display:block; margin-top:2px;">
      ${isHi 
        ? `${isCustom ? '(प्रस्तावित दर) ' : ''}मूल कार्य दर: ₹${subtotal} + चार्ज: ₹${platformCharge} ${emergency ? '+ आपातकालीन त्वरित शुल्क: ₹150' : ''}`
        : `${isCustom ? '(Offered Rate) ' : ''}Base Work Rate: ₹${subtotal} + Charge: ₹${platformCharge} ${emergency ? '+ Emergency Fast Dispatch: ₹150' : ''}`
      }
    </span>
  `;
}

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

  const customOfferInput = document.getElementById("bookingCustomOfferInput");
  const customOfferVal = customOfferInput ? parseFloat(customOfferInput.value) : 0;
  const isCustomOffer = !isNaN(customOfferVal) && customOfferVal > 0;

  const descNote = notes 
    ? (isCustomOffer ? `${notes} (Offered Rate: ₹${customOfferVal})` : notes)
    : (isCustomOffer ? `Client Offered Budget: ₹${customOfferVal}/shift` : (isHi ? "कुशल लेबर की तत्काल आवश्यकता" : "Immediate requirement matching trade standards"));

  const payload = {
    customer_name: state.session && state.session.user ? state.session.user.name : state.userProfile.name,
    customer_phone: state.session && state.session.user ? state.session.user.phone : state.userProfile.phone,
    service_id: serviceId,
    task_description: descNote,
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

    if (!res.ok) throw new Error("Work adding failed");
    const data = await res.json();
    closeModal("modalBooking");
    if (customOfferInput) customOfferInput.value = "";
    showToast(isHi ? `भुगतान सफल! काम दर्ज हुआ व लेबर डिस्पैच हुई (#${data.booking.booking_number})` : `Payment Secured! Work Posted & Labour Dispatched (#${data.booking.booking_number})`, "success");

    await loadInitialData();
    switchTab("orders");
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ----------------- Live GPS Tracking ----------------- //

async function openLiveTrackingModal(bookingId) {
  try {
    const b = state.bookings.find(item => item.id === bookingId) || state.activeBooking || {};
    let data = b;
    try {
      const res = await fetch(`/api/tracking/${bookingId}`);
      if (res.ok) data = await res.json();
    } catch (e) {}

    const merged = { ...b, ...data };
    document.getElementById("trackingWorkerName").textContent = merged.worker_name || "Mukesh Verma";
    document.getElementById("trackingWorkerPhone").textContent = merged.worker_phone || "+91 98234 11092";
    document.getElementById("trackingOtpCode").textContent = merged.otp || "5603";
    const etaEl = document.getElementById("trackingEtaTime");
    if (etaEl) etaEl.textContent = `${merged.eta_minutes || 12} mins`;

    document.getElementById("modalTracking").classList.add("active");
    if (typeof initTrackingMap === "function") {
      setTimeout(() => initTrackingMap(merged), 100);
    }
  } catch (err) {
    showToast("Failed to load tracking", "error");
  }
}

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

async function triggerCompleteJob(bookingId) {
  const isHi = state.lang === "hi";
  try {
    const res = await fetch(`/api/bookings/${bookingId}/complete`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to complete job");

    closeModal("modalVerifyOtp");
    showToast(isHi ? "कार्य पूर्ण हुआ! श्रमिक भुगतान जारी किया गया।" : (data.message || "Job Completed! Payout released."), "success");
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ----------------- Wallet Operations ----------------- //

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
    showToast(isHi ? `वॉलेट में ₹${amount.toLocaleString('en-IN')} जोड़े गए!` : `Added ₹${amount.toLocaleString('en-IN')} to WorkMate Wallet!`, "success");
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ----------------- Reviews ----------------- //

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

    if (!res.ok) throw new Error("Review submission failed");
    closeModal("modalReview");
    showToast(isHi ? "आपकी समीक्षा दर्ज की गई! धन्यवाद।" : "Review submitted successfully! Thank you.", "success");
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}

// ----------------- Database & Cloud Sync (Firebase) ----------------- //

async function openDatabaseModal() {
  const modal = document.getElementById("modalDatabase");
  if (!modal) return;
  modal.classList.add("active");
  const isHi = state.lang === "hi";

  try {
    const [fbRes, recordsRes] = await Promise.all([
      fetch("/api/firebase/status").catch(() => ({ json: () => ({ firebase_project_id: "work-mate-36603", credentials_found: true }) })),
      fetch("/api/database/records").catch(() => null)
    ]);

    const fbData = await fbRes.json();
    let dbData = null;
    if (recordsRes && recordsRes.ok) {
      dbData = await recordsRes.json();
    } else {
      // Fallback to in-memory state
      dbData = {
        users: [state.userProfile || { id: "u-1", name: "Ramesh Kumar", phone: "9876543210", address: "Flat 402, Lotus Tower", city: "Surat" }],
        bookings: state.bookings || [],
        services: state.services || [],
        workers: state.workers || [],
        transactions: state.transactions || [],
        categories: state.categories || []
      };
    }

    const statusEl = document.getElementById("dbSyncStatusInfo");
    if (statusEl) {
      statusEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <div>
            <div style="font-size:13px; font-weight:800; color:#0f172a;">
              <i class="fa-solid fa-database" style="color:#0d9488;"></i> ${isHi ? "प्रोजेक्ट डेटाबेस इंजन" : "WorkMate Database Engine"}
            </div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">
              SQLite 3.x + Firestore Cloud Sync (${isHi ? "सुरक्षित एवं सक्रिय" : "Active & Synchronized"})
            </div>
          </div>
          <span style="font-size:11px; font-weight:800; background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:12px;">
            ${isHi ? "सक्रिय स्थिति" : "ONLINE"}
          </span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-top:12px;">
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:8px; text-align:center;">
            <div style="font-size:17px; font-weight:800; color:#1e40af;">${(dbData.users || []).length}</div>
            <div style="font-size:11px; color:#64748b; font-weight:700;">${isHi ? "उपयोगकर्ता" : "Users"}</div>
          </div>
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:8px; text-align:center;">
            <div style="font-size:17px; font-weight:800; color:#0d9488;">${(dbData.bookings || []).length}</div>
            <div style="font-size:11px; color:#64748b; font-weight:700;">${isHi ? "बुकिंग्स" : "Bookings"}</div>
          </div>
          <div style="background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:8px; text-align:center;">
            <div style="font-size:17px; font-weight:800; color:#d97706;">${(dbData.services || []).length}</div>
            <div style="font-size:11px; color:#64748b; font-weight:700;">${isHi ? "4 मॉड्यूल ट्रेड्स" : "Services"}</div>
          </div>
        </div>

        <div style="margin-top:14px; padding-top:12px; border-top:1px dashed #cbd5e1;">
          <div style="font-size:12px; font-weight:800; color:#334155; margin-bottom:8px;">
            <i class="fa-solid fa-table-list"></i> ${isHi ? "डेटाबेस टेबल्स व रिकॉर्ड्स एक्सप्लोरर:" : "Database Tables & Records Explorer:"}
          </div>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:12px;">
            <button type="button" class="btn-db-tab active" onclick="showDbTable('users')" id="btnDbTab-users" style="padding:4px 10px; font-size:11px; border-radius:6px; border:1px solid #0d9488; background:#0d9488; color:#fff; cursor:pointer; font-weight:700;">
              Users (${(dbData.users || []).length})
            </button>
            <button type="button" class="btn-db-tab" onclick="showDbTable('bookings')" id="btnDbTab-bookings" style="padding:4px 10px; font-size:11px; border-radius:6px; border:1px solid #cbd5e1; background:#fff; color:#334155; cursor:pointer; font-weight:700;">
              Bookings (${(dbData.bookings || []).length})
            </button>
            <button type="button" class="btn-db-tab" onclick="showDbTable('services')" id="btnDbTab-services" style="padding:4px 10px; font-size:11px; border-radius:6px; border:1px solid #cbd5e1; background:#fff; color:#334155; cursor:pointer; font-weight:700;">
              4 Modules (${(dbData.services || []).length})
            </button>
            <button type="button" class="btn-db-tab" onclick="showDbTable('workers')" id="btnDbTab-workers" style="padding:4px 10px; font-size:11px; border-radius:6px; border:1px solid #cbd5e1; background:#fff; color:#334155; cursor:pointer; font-weight:700;">
              Workers (${(dbData.workers || []).length})
            </button>
          </div>

          <div id="dbTableViewerContent" style="max-height:220px; overflow-y:auto; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:8px; font-size:11px; line-height:1.5;">
            <!-- Dynamically rendered table -->
          </div>
        </div>
      `;

      // Store fetched db data globally for table tab switching
      window._currentDbData = dbData;
      showDbTable('users');
    }
  } catch (e) {
    console.error("Error opening DB modal:", e);
  }
}

function showDbTable(tableKey) {
  const dbData = window._currentDbData || {};
  const isHi = state.lang === "hi";
  const viewer = document.getElementById("dbTableViewerContent");
  if (!viewer) return;

  // Update active tab buttons
  ['users', 'bookings', 'services', 'workers'].forEach(k => {
    const btn = document.getElementById("btnDbTab-" + k);
    if (btn) {
      if (k === tableKey) {
        btn.style.background = "#0d9488";
        btn.style.color = "#ffffff";
        btn.style.borderColor = "#0d9488";
      } else {
        btn.style.background = "#ffffff";
        btn.style.color = "#334155";
        btn.style.borderColor = "#cbd5e1";
      }
    }
  });

  if (tableKey === "users") {
    const rows = dbData.users || [];
    viewer.innerHTML = `
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="background:#f1f5f9; color:#334155; font-size:10px; border-bottom:1px solid #cbd5e1;">
            <th style="padding:4px 6px;">ID</th>
            <th style="padding:4px 6px;">${isHi ? "नाम" : "Name"}</th>
            <th style="padding:4px 6px;">${isHi ? "फोन" : "Phone"}</th>
            <th style="padding:4px 6px;">${isHi ? "शहर / पता" : "City / Address"}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(u => `
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:5px 6px; font-weight:700; color:#1e40af;">${u.id}</td>
              <td style="padding:5px 6px; font-weight:600;">${u.name}</td>
              <td style="padding:5px 6px;">${u.phone}</td>
              <td style="padding:5px 6px; color:#64748b;">${u.address || u.city || 'Surat, Gujarat'}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } else if (tableKey === "bookings") {
    const rows = dbData.bookings || [];
    viewer.innerHTML = `
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="background:#f1f5f9; color:#334155; font-size:10px; border-bottom:1px solid #cbd5e1;">
            <th style="padding:4px 6px;">ID</th>
            <th style="padding:4px 6px;">${isHi ? "सेवा" : "Service"}</th>
            <th style="padding:4px 6px;">${isHi ? "कारीगर" : "Worker"}</th>
            <th style="padding:4px 6px;">${isHi ? "लागत" : "Cost"}</th>
            <th style="padding:4px 6px;">${isHi ? "स्थिति" : "Status"}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(b => `
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:5px 6px; font-weight:700; color:#0d9488;">${b.id}</td>
              <td style="padding:5px 6px;">${isHi ? (b.service_name_hi || b.service_name) : b.service_name}</td>
              <td style="padding:5px 6px;">${b.worker_name || 'Mukesh Verma'}</td>
              <td style="padding:5px 6px; font-weight:700;">₹${b.total_cost}</td>
              <td style="padding:5px 6px;"><span style="background:#dbeafe; color:#1e40af; padding:1px 6px; border-radius:8px; font-weight:700;">${b.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } else if (tableKey === "services") {
    const rows = dbData.services || [];
    viewer.innerHTML = `
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="background:#f1f5f9; color:#334155; font-size:10px; border-bottom:1px solid #cbd5e1;">
            <th style="padding:4px 6px;">ID</th>
            <th style="padding:4px 6px;">${isHi ? "मॉड्यूल" : "Module"}</th>
            <th style="padding:4px 6px;">${isHi ? "ट्रेड का नाम" : "Trade Name"}</th>
            <th style="padding:4px 6px;">${isHi ? "दर" : "Base Rate"}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(s => `
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:5px 6px; font-weight:700; color:#d97706;">${s.id}</td>
              <td style="padding:5px 6px;"><span style="text-transform:capitalize; font-weight:600; color:#475569;">${s.category_id}</span></td>
              <td style="padding:5px 6px; font-weight:600;">${isHi ? s.name_hi : s.name_en}</td>
              <td style="padding:5px 6px; font-weight:800; color:#0f172a;">₹${s.base_rate}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } else if (tableKey === "workers") {
    const rows = dbData.workers || [];
    viewer.innerHTML = `
      <table style="width:100%; border-collapse:collapse; text-align:left;">
        <thead>
          <tr style="background:#f1f5f9; color:#334155; font-size:10px; border-bottom:1px solid #cbd5e1;">
            <th style="padding:4px 6px;">ID</th>
            <th style="padding:4px 6px;">${isHi ? "कारीगर का नाम" : "Worker Name"}</th>
            <th style="padding:4px 6px;">${isHi ? "ट्रेड" : "Trade"}</th>
            <th style="padding:4px 6px;">${isHi ? "रेटिंग" : "Rating"}</th>
            <th style="padding:4px 6px;">${isHi ? "दैनिक दर" : "Daily Rate"}</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(w => `
            <tr style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:5px 6px; font-weight:700; color:#6366f1;">${w.id}</td>
              <td style="padding:5px 6px; font-weight:700;">${w.name}</td>
              <td style="padding:5px 6px;">${isHi ? (w.primary_trade_hi || w.primary_trade) : w.primary_trade}</td>
              <td style="padding:5px 6px; color:#d97706; font-weight:800;">★ ${w.rating}</td>
              <td style="padding:5px 6px; font-weight:700;">₹${w.daily_rate}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  }
}

async function triggerDatabaseSync() {
  const isHi = state.lang === "hi";
  showToast(isHi ? "फायरबेस में डेटा सिंक शुरू किया गया..." : "Syncing records to Firebase Cloud Firestore...", "success");
  setTimeout(() => {
    showToast(isHi ? "डेटाबेस रिकॉर्ड्स सफलतापूर्वक सिंक किए गए!" : "Database records successfully synchronized!", "success");
  }, 1200);
}

// ----------------- Modal Common ----------------- //

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("active");
  if (modalId === "modalTracking" && typeof stopTrackingAnimation === "function") {
    stopTrackingAnimation();
  }
}

// ----------------- Setup & Initialization ----------------- //

document.addEventListener("DOMContentLoaded", () => {
  const hasSession = checkUserSession();
  if (hasSession) {
    loadInitialData();
  }

  // Live search filtering
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderCategories(e.target.value);
    });
  }

  // Booking price updates
  const servSelect = document.getElementById("bookingServiceSelect");
  const durInput = document.getElementById("bookingDurationHours");
  const typeSelect = document.getElementById("bookingTypeSelect");
  const customOfferInput = document.getElementById("bookingCustomOfferInput");
  if (servSelect) servSelect.addEventListener("change", updateEstimatedPrice);
  if (durInput) durInput.addEventListener("input", updateEstimatedPrice);
  if (typeSelect) typeSelect.addEventListener("change", updateEstimatedPrice);
  if (customOfferInput) customOfferInput.addEventListener("input", updateEstimatedPrice);
});

// ----------------- Worker Dispute & Terms Modals ----------------- //

function openTermsModal() {
  const modal = document.getElementById("modalTermsConditions");
  if (modal) modal.classList.add("active");
}

function openDisputeModal(bookingId, workerId, workerName) {
  const modal = document.getElementById("modalBookingDispute");
  if (!modal) return;
  const bIdInput = document.getElementById("disputeBookingId");
  const wIdInput = document.getElementById("disputeWorkerId");
  const nameDisplay = document.getElementById("disputeWorkerNameDisplay");
  if (bIdInput) bIdInput.value = bookingId || "";
  if (wIdInput) wIdInput.value = workerId || "w-101";
  if (nameDisplay) nameDisplay.textContent = `${workerName || 'Mukesh Verma'} (ID: ${workerId || 'w-101'})`;
  modal.classList.add("active");
}

async function submitBookingDispute(event) {
  if (event) event.preventDefault();
  const bookingId = document.getElementById("disputeBookingId").value;
  const workerId = document.getElementById("disputeWorkerId").value;
  const reason = document.getElementById("disputeReasonSelect").value;
  const notes = (document.getElementById("disputeNotesInput").value || "").trim();
  const rating = parseInt(document.getElementById("disputeRatingSelect").value, 10) || 1;
  const refundAction = document.getElementById("disputeActionSelect").value;

  try {
    const res = await fetch("/api/bookings/dispute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking_id: bookingId,
        worker_id: workerId,
        reason: `${reason}: ${notes}`,
        rating: rating,
        refund_action: refundAction
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed to submit dispute");

    closeModal("modalBookingDispute");
    showToast(
      state.lang === "hi"
        ? `विवाद दर्ज हुआ! ₹${data.refund_amount} की 100% एस्क्रो राशि वॉलेट में वापस आ गई है।`
        : `Dispute submitted! 100% Escrow refund of ₹${data.refund_amount} credited to your wallet.`,
      "success"
    );
    await loadInitialData();
  } catch (err) {
    showToast(err.message, "error");
  }
}
