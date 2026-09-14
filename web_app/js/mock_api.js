/**
 * WorkMate In-Browser API & Storage Engine (GitHub Pages & Offline Standalone Provider)
 * Transparently handles /api/* endpoints when running on GitHub Pages (github.io)
 * or when the backend server is unreachable across different networks.
 */

(function() {
  const isGitHubPages = window.location.hostname.includes("github.io") || window.location.protocol === "file:";

  // Default seed database
  const DEFAULT_DB = {
    categories: [
      { id: "construction", name_en: "Construction & Masonry", name_hi: "निर्माण एवं राजमिस्त्री", icon: "fa-trowel-bricks", count: 18, color: "#dbeafe", textColor: "#1d4ed8" },
      { id: "events", name_en: "Events & Catering", name_hi: "इवेंट्स एवं कैटरिंग", icon: "fa-champagne-glasses", count: 12, color: "#fce7f3", textColor: "#be185d" },
      { id: "shifting", name_en: "House & Office Shifting", name_hi: "सामान शिफ्टिंग एवं लोडिंग", icon: "fa-truck-ramp-box", count: 15, color: "#fef3c7", textColor: "#b45309" },
      { id: "textile", name_en: "Textile Mill & Fabric", name_hi: "टेक्सटाइल मिल एवं थान हेल्पर", icon: "fa-scissors", count: 22, color: "#dcfce7", textColor: "#15803d" }
    ],
    services: [
      { id: "srv-1", category_id: "construction", name_en: "Bricklayer / Master Mason", name_hi: "राजमिस्त्री (चिनाई कार्य)", base_rate: 850.0, unit: "day", popular: true },
      { id: "srv-2", category_id: "construction", name_en: "Wall Plaster & Cement Helper", name_hi: "प्लास्टर एवं सीमेंट मजदूर", base_rate: 600.0, unit: "day", popular: false },
      { id: "srv-3", category_id: "construction", name_en: "Tiles & Flooring Specialist", name_hi: "टाइल एवं फर्श मिस्त्री", base_rate: 900.0, unit: "day", popular: true },
      { id: "srv-4", category_id: "construction", name_en: "Plumbing & Sanitary Helper", name_hi: "प्लंबिंग एवं पाइप हेल्पर", base_rate: 700.0, unit: "day", popular: false },
      { id: "srv-5", category_id: "events", name_en: "Wedding Buffet & Table Waiter", name_hi: "शादी-ब्याह व पार्टी वेटर", base_rate: 650.0, unit: "day", popular: true },
      { id: "srv-6", category_id: "events", name_en: "Kitchen Cook Assistant / Halwai", name_hi: "रसोई हलवाई सहायक", base_rate: 750.0, unit: "day", popular: false },
      { id: "srv-7", category_id: "shifting", name_en: "Heavy Luggage & Furniture Loader", name_hi: "भारी सामान लोडर मजदूर", base_rate: 750.0, unit: "day", popular: true },
      { id: "srv-8", category_id: "shifting", name_en: "Packing & Truck Unloading Crew", name_hi: "पैकिंग व अनलोडिंग हेल्पर", base_rate: 700.0, unit: "day", popular: false },
      { id: "srv-9", category_id: "textile", name_en: "Fabric Roll Loading Labour", name_hi: "थान लोडिंग एवं ट्रांसपोर्ट हेल्पर", base_rate: 600.0, unit: "day", popular: true },
      { id: "srv-10", category_id: "textile", name_en: "Textile Mill Machine Helper", name_hi: "कपड़ा मिल मशीन हेल्पर", base_rate: 650.0, unit: "day", popular: false }
    ],
    workers: [
      { id: "w-101", name: "Mukesh Verma", phone: "+91 98234 11092", category_id: "construction", primary_trade: "Master Mason / Plaster", primary_trade_hi: "राजमिस्त्री (चिनाई)", rating: 4.8, reviews_count: 142, daily_rate: 850.0, city: "Surat", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", available: true },
      { id: "w-102", name: "Ramprasad Meena", phone: "+91 98765 22001", category_id: "shifting", primary_trade: "Heavy Furniture Shifter", primary_trade_hi: "सामान शिफ्टिंग विशेषज्ञ", rating: 4.9, reviews_count: 98, daily_rate: 750.0, city: "Surat", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", available: true },
      { id: "w-103", name: "Rajesh Kumar", phone: "+91 98112 33445", category_id: "events", primary_trade: "Event Waiter & Hospitality", primary_trade_hi: "पार्टी वेटर", rating: 4.7, reviews_count: 110, daily_rate: 650.0, city: "Surat", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", available: true },
      { id: "w-104", name: "Suresh Soni", phone: "+91 98980 11223", category_id: "textile", primary_trade: "Fabric Roll Loader", primary_trade_hi: "थान लोडिंग हेल्पर", rating: 4.8, reviews_count: 76, daily_rate: 600.0, city: "Surat", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", available: true }
    ],
    bookings: [
      {
        id: "b-active-1",
        customer_id: "u-1",
        customer_name: "Ramesh Kumar",
        customer_phone: "+91 98765 43210",
        service_id: "srv-1",
        service_name: "Bricklayer / Master Mason",
        service_name_hi: "राजमिस्त्री (चिनाई कार्य)",
        worker_id: "w-101",
        worker_name: "Mukesh Verma",
        worker_phone: "+91 98234 11092",
        worker_trade: "Master Mason / Plaster",
        worker_trade_hi: "राजमिस्त्री (चिनाई)",
        worker_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        worker_rating: 4.8,
        booking_type: "instant",
        scheduled_date_time: "Today, Immediate",
        duration_hours: 8,
        total_cost: 900.0,
        commission_amount: 90.0,
        worker_payout_amount: 810.0,
        otp: "5603",
        eta_minutes: 12,
        status: "in_progress",
        location_address: "Flat 402, Lotus Tower, Sector 14",
        lat: 21.2050,
        lng: 72.8450,
        worker_lat: 21.2180,
        worker_lng: 72.8310,
        created_at: "Today, 10:15 AM",
        completed_at: null,
        is_rated: false
      }
    ],
    users: [
      {
        id: "u-1",
        name: "Ramesh Kumar",
        phone: "9876543210",
        email: "ramesh.kumar@workmate.in",
        address: "Flat 402, Lotus Tower, Sector 14",
        city: "Surat, Gujarat",
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        aadhaar_masked: "•••• •••• 9012",
        member_id: "WM-USER-89104",
        account_type: "Customer Premium",
        joined_date: "September 14, 2026",
        trust_score: 4.9,
        kyc_status: "verified"
      },
      {
        id: "admin-1",
        name: "admin",
        phone: "7878193644",
        email: "bhavarthhapani7@gmail.com",
        address: "",
        city: "",
        photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        aadhaar_masked: "",
        member_id: "WM-ADMIN-001",
        account_type: "System Administrator",
        joined_date: "September 14, 2026",
        trust_score: 5.0,
        kyc_status: "verified"
      }
    ],
    wallet: { balance: 13000.0, currency: "INR", symbol: "₹" },
    transactions: [
      { id: "tx-init-1", type: "deposit", amount: 15000.0, direction: "credit", title_en: "Wallet Top-Up (Razorpay)", title_hi: "वॉलेट में पैसे जोड़े (रेजरपे)", status: "success", date_str: "Sep 14, 2026", method: "UPI (ramesh@okhdfc)", reference_id: "RZP_INIT_001" },
      { id: "tx-init-2", type: "payment", amount: 900.0, direction: "debit", title_en: "Labour Escrow Reserve (Masonry)", title_hi: "लेबर एस्क्रो आरक्षण (राजमिस्त्री)", status: "success", date_str: "Sep 14, 2026", method: "WorkMate Escrow", reference_id: "ESC_BK_101" }
    ],
    reviews: [
      { id: "rev-1", booking_id: "b-prev-1", worker_id: "w-101", worker_name: "Mukesh Verma", customer_name: "Vikram Shah", rating: 5, tags: ["Punctual", "Skillful"], comment: "Mukesh arrived on time and finished the brickwork flawlessly.", date_str: "Yesterday" }
    ],
    adminBanks: [
      { id: "bank-hdfc-1", bank_name: "HDFC Bank Corporate", account_name: "WorkMate Escrow & Clearing Pvt Ltd", account_number_masked: "•••• •••• 9921", ifsc_code: "HDFC0000240", branch: "Surat Central", upi_id: "workmate.escrow@hdfcbank", is_primary: true, failover_status: "Active Primary", balance_held: 245000.0 },
      { id: "bank-icici-2", bank_name: "ICICI Bank Business", account_name: "WorkMate Clearing & Settlement", account_number_masked: "•••• •••• 4410", ifsc_code: "ICIC0001092", branch: "Ring Road", upi_id: "workmate.ops@icici", is_primary: false, failover_status: "Standby Failover Ready", balance_held: 120000.0 },
      { id: "bank-axis-3", bank_name: "Axis Bank Corporate Reserve", account_name: "WorkMate Reserve & Payouts", account_number_masked: "•••• •••• 8104", ifsc_code: "UTIB0000451", branch: "Varachha", upi_id: "workmate.reserve@axisbank", is_primary: false, failover_status: "Standby Reserve", balance_held: 85000.0 }
    ],
    config: { platform_charge_percent: 10.0 }
  };

  function loadLocalDb() {
    try {
      const stored = localStorage.getItem("workmate_client_db");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    localStorage.setItem("workmate_client_db", JSON.stringify(DEFAULT_DB));
    return DEFAULT_DB;
  }

  function saveLocalDb(db) {
    try {
      localStorage.setItem("workmate_client_db", JSON.stringify(db));
    } catch (e) {}
  }

  function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status: status,
      headers: { "Content-Type": "application/json" }
    });
  }

  function cleanPhone(p) {
    let d = (p || "").toString().replace(/[^0-9]/g, "");
    if (d.length > 10 && d.startsWith("91")) d = d.slice(2);
    return d.slice(-10);
  }

  async function mockApiHandler(url, options = {}) {
    const method = (options.method || "GET").toUpperCase();
    const parsedUrl = new URL(url, window.location.origin);
    const pathname = parsedUrl.pathname.replace(/^\/Work-Mate/, ""); // Handle gh-pages subpath
    const body = options.body ? (typeof options.body === "string" ? JSON.parse(options.body) : options.body) : {};
    const db = loadLocalDb();

    // 1. Auth Login
    if (pathname === "/api/auth/login" && method === "POST") {
      const { role, identifier, password } = body;
      const idStr = (identifier || "").trim();

      if (role === "admin" || idStr.toLowerCase() === "admin") {
        if (password === "admin123" || !password) {
          const adminUser = db.users.find(u => u.id === "admin-1") || db.users[1];
          return jsonResponse({
            success: true,
            token: "wm_admin_sec_token_9901",
            role: "admin",
            user: adminUser
          });
        } else {
          return jsonResponse({ detail: "Invalid Admin Credentials (Default: admin / admin123)" }, 401);
        }
      }

      // Customer Phone Login
      const targetPhone = cleanPhone(idStr);
      const user = db.users.find(u => cleanPhone(u.phone) === targetPhone);
      if (!user) {
        return jsonResponse({
          detail: "Account not found with this mobile number. Please register first to create an account."
        }, 404);
      }
      return jsonResponse({
        success: true,
        token: `wm_cust_token_${user.id}`,
        role: "customer",
        user: user
      });
    }

    // 2. Auth Register
    if (pathname === "/api/auth/register" && method === "POST") {
      const targetPhone = cleanPhone(body.phone);
      let user = db.users.find(u => cleanPhone(u.phone) === targetPhone);
      if (user) {
        return jsonResponse({ detail: "An account with this phone number already exists. Please login." }, 400);
      }
      const newId = "u-" + Math.random().toString(16).slice(2, 8);
      user = {
        id: newId,
        name: body.name.trim(),
        phone: body.phone.trim(),
        address: body.address || "",
        city: body.city || "",
        email: body.email || null,
        photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        aadhaar_masked: "•••• •••• " + Math.floor(1000 + Math.random() * 9000),
        member_id: "WM-USER-" + Math.floor(10000 + Math.random() * 90000),
        account_type: "Customer Verified",
        joined_date: "September 14, 2026",
        trust_score: 5.0,
        kyc_status: "verified"
      };
      db.users.push(user);
      saveLocalDb(db);
      return jsonResponse({
        success: true,
        token: `wm_cust_token_${user.id}`,
        role: "customer",
        user: user,
        message: "Account registered successfully! Welcome to WorkMate."
      });
    }

    // 3. User Profile
    if (pathname.startsWith("/api/user/profile")) {
      const uid = parsedUrl.searchParams.get("user_id") || "u-1";
      if (method === "GET") {
        const u = db.users.find(item => item.id === uid) || db.users[0];
        return jsonResponse(u);
      }
      if (method === "PUT") {
        let u = db.users.find(item => item.id === uid);
        if (u) {
          Object.assign(u, body);
        } else {
          u = { id: uid, ...body };
          db.users.push(u);
        }
        saveLocalDb(db);
        return jsonResponse({ success: true, user: u });
      }
    }

    // 4. User Avatar
    if (pathname.startsWith("/api/user/avatar") && method === "POST") {
      const uid = parsedUrl.searchParams.get("user_id") || "u-1";
      const u = db.users.find(item => item.id === uid);
      if (u) {
        u.photo = body.photo;
        saveLocalDb(db);
      }
      return jsonResponse({ success: true, photo: body.photo });
    }

    // 5. Categories & Services
    if (pathname === "/api/categories") return jsonResponse(db.categories);
    if (pathname === "/api/services") return jsonResponse(db.services);
    if (pathname.startsWith("/api/services/") && pathname.endsWith("/rate") && method === "PUT") {
      const srvId = pathname.split("/")[3];
      const srv = db.services.find(s => s.id === srvId);
      if (srv) {
        srv.base_rate = parseFloat(body.base_rate);
        saveLocalDb(db);
        return jsonResponse({ success: true, service: srv, message: `Updated ${srv.name_en} rate` });
      }
    }

    // 6. Workers
    if (pathname === "/api/workers") return jsonResponse(db.workers);

    // 7. Bookings
    if (pathname === "/api/bookings") {
      if (method === "GET") return jsonResponse(db.bookings);
      if (method === "POST") {
        const srv = db.services.find(s => s.id === body.service_id) || db.services[0];
        const wkr = db.workers.find(w => w.category_id === srv.category_id) || db.workers[0];
        const chargeRate = (db.config.platform_charge_percent || 10) / 100;
        const total = (body.custom_offer_rate || srv.base_rate) * (1 + chargeRate);

        const newBk = {
          id: "b-" + Math.random().toString(16).slice(2, 10),
          customer_id: "u-1",
          customer_name: "Customer",
          customer_phone: "+91 98765 43210",
          service_id: srv.id,
          service_name: srv.name_en,
          service_name_hi: srv.name_hi,
          worker_id: wkr.id,
          worker_name: wkr.name,
          worker_phone: wkr.phone,
          worker_trade: wkr.primary_trade,
          worker_trade_hi: wkr.primary_trade_hi,
          worker_photo: wkr.photo,
          worker_rating: wkr.rating,
          booking_type: body.booking_type || "instant",
          scheduled_date_time: "Today, Immediate",
          duration_hours: parseInt(body.duration_hours || 8, 10),
          total_cost: Math.round(total),
          commission_amount: Math.round(total * chargeRate),
          worker_payout_amount: Math.round(total * (1 - chargeRate)),
          otp: "5603",
          eta_minutes: 15,
          status: "in_progress",
          location_address: body.location_address || "Surat, Gujarat",
          lat: 21.2050,
          lng: 72.8450,
          worker_lat: 21.2180,
          worker_lng: 72.8310,
          created_at: "Just Now",
          completed_at: null,
          is_rated: false
        };
        db.bookings.unshift(newBk);
        saveLocalDb(db);
        return jsonResponse({ success: true, booking: newBk }, 201);
      }
    }

    // 8. Dispute Worker
    if (pathname === "/api/bookings/dispute" && method === "POST") {
      const b = db.bookings.find(item => item.id === body.booking_id);
      const refundAmt = b ? b.total_cost : 900.0;
      if (b) {
        b.status = "disputed_refunded";
      }
      db.wallet.balance += refundAmt;
      const tx = {
        id: "tx-disp-" + Math.random().toString(16).slice(2, 8),
        type: "refund",
        amount: refundAmt,
        direction: "credit",
        title_en: `100% Escrow Refund (Worker Abandoned #${body.booking_id})`,
        title_hi: `100% एस्क्रो रिफंड (श्रमिक ने काम छोड़ा #${body.booking_id})`,
        status: "success",
        date_str: "Just Now",
        method: "WorkMate Escrow Guarantee",
        reference_id: "ESC_REF_" + Math.random().toString(16).slice(2, 8).toUpperCase()
      };
      db.transactions.unshift(tx);

      // Penalize worker rating downwards
      const wkr = db.workers.find(w => w.id === body.worker_id);
      if (wkr) {
        wkr.rating = Math.max(1.0, Math.round(((wkr.rating * wkr.reviews_count + 1) / (wkr.reviews_count + 1)) * 10) / 10);
        wkr.reviews_count += 1;
      }
      saveLocalDb(db);
      return jsonResponse({
        success: true,
        booking_id: body.booking_id,
        status: "disputed_refunded",
        refund_amount: refundAmt,
        worker_penalized_rating: wkr ? wkr.rating : 4.6,
        message: "Dispute recorded and 100% escrow refund credited successfully"
      });
    }

    // 9. Booking Status Updates (arrived, verify-otp, complete)
    if (pathname.includes("/verify-otp") && method === "POST") {
      const bkId = pathname.split("/")[3];
      const b = db.bookings.find(item => item.id === bkId);
      if (b) b.status = "working";
      saveLocalDb(db);
      return jsonResponse({ success: true, message: "OTP Verified! Service started." });
    }
    if (pathname.includes("/complete") && method === "POST") {
      const bkId = pathname.split("/")[3];
      const b = db.bookings.find(item => item.id === bkId);
      if (b) {
        b.status = "completed";
        b.completed_at = "Just Now";
      }
      saveLocalDb(db);
      return jsonResponse({ success: true, message: "Work completed successfully! Payout released." });
    }

    // 10. Wallet endpoints
    if (pathname === "/api/wallet") return jsonResponse(db.wallet);
    if (pathname === "/api/wallet/transactions") return jsonResponse(db.transactions);
    if (pathname === "/api/wallet/deposit" && method === "POST") {
      const amt = parseFloat(body.amount);
      db.wallet.balance += amt;
      db.transactions.unshift({
        id: "tx-dep-" + Math.random().toString(16).slice(2, 8),
        type: "deposit",
        amount: amt,
        direction: "credit",
        title_en: "Add Money (Razorpay)",
        title_hi: "पैसे जोड़े (रेजरपे)",
        status: "success",
        date_str: "Just Now",
        method: body.method || "UPI",
        reference_id: "RZP_" + Math.random().toString(16).slice(2, 8).toUpperCase()
      });
      saveLocalDb(db);
      return jsonResponse({ wallet: db.wallet });
    }
    if (pathname === "/api/wallet/payout" && method === "POST") {
      const amt = parseFloat(body.amount);
      db.wallet.balance = Math.max(0, db.wallet.balance - amt);
      db.transactions.unshift({
        id: "tx-pay-" + Math.random().toString(16).slice(2, 8),
        type: "payout",
        amount: amt,
        direction: "debit",
        title_en: "Payout Withdrawal (UPI)",
        title_hi: "निकासी पेआउट (यूपीआई)",
        status: "success",
        date_str: "Just Now",
        method: "UPI (" + (body.upi_id || "user@upi") + ")",
        reference_id: "PAY_" + Math.random().toString(16).slice(2, 8).toUpperCase()
      });
      saveLocalDb(db);
      return jsonResponse({ wallet: db.wallet, success: true });
    }

    // 11. Admin Config & Banks
    if (pathname === "/api/admin/config") return jsonResponse(db.config);
    if (pathname === "/api/admin/config/platform-charge" && method === "PUT") {
      db.config.platform_charge_percent = parseFloat(body.percent || 10);
      saveLocalDb(db);
      return jsonResponse({ success: true, platform_charge_percent: db.config.platform_charge_percent });
    }
    if (pathname === "/api/admin/banks") return jsonResponse(db.adminBanks);
    if (pathname === "/api/admin/financial-stats") {
      return jsonResponse({
        total_revenue: 148500.0,
        platform_commission_earned: 14850.0,
        worker_payouts_settled: 133650.0,
        active_escrow_holding: 900.0
      });
    }

    // 12. Tracking endpoint
    if (pathname.startsWith("/api/tracking/")) {
      const b = db.bookings[0];
      return jsonResponse({
        booking_id: b.id,
        worker_name: b.worker_name,
        lat: b.lat,
        lng: b.lng,
        worker_lat: b.worker_lat,
        worker_lng: b.worker_lng,
        eta_minutes: b.eta_minutes || 12,
        otp: b.otp || "5603",
        status: b.status || "in_progress"
      });
    }

    // 13. Reviews
    if (pathname === "/api/reviews") return jsonResponse(db.reviews);
    if (pathname === "/api/firebase/status") {
      return jsonResponse({ configured: true, connected: true, provider: "Local & Firestore Sync Ready" });
    }

    // Fallback 404
    return jsonResponse({ detail: "Not found" }, 404);
  }

  // Hook global fetch
  const originalFetch = window.fetch;
  window.fetch = async function(resource, init) {
    const urlStr = typeof resource === "string" ? resource : (resource ? resource.url : "");

    if (urlStr && (urlStr.startsWith("/api/") || urlStr.startsWith("api/") || urlStr.includes("/api/"))) {
      if (isGitHubPages) {
        return mockApiHandler(urlStr, init);
      }
      try {
        const response = await originalFetch.apply(this, arguments);
        if (response.status === 404 && urlStr.includes("/api/")) {
          return mockApiHandler(urlStr, init);
        }
        return response;
      } catch (networkError) {
        console.warn("Backend server not reachable, switching to in-browser mock API:", networkError);
        return mockApiHandler(urlStr, init);
      }
    }

    return originalFetch.apply(this, arguments);
  };
})();
