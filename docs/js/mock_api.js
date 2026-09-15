/**
 * WorkMate In-Browser API & Storage Engine (GitHub Pages & Offline Standalone Provider)
 * Transparently handles /api/* endpoints when running on GitHub Pages (github.io)
 * or when the backend server is unreachable across different networks.
 */

(function() {
  const isGitHubPages = window.location.hostname.includes("github.io") || window.location.protocol === "file:";

  // Default seed database
  const DEFAULT_DB = {
    schemaVersion: 5,
    categories: [
      { id: "construction", name_en: "Construction & Masonry", name_hi: "निर्माण एवं राजमिस्त्री कार्य", subtext_en: "Brickwork, Tiling, Plastering & Painting", subtext_hi: "चिनाई, टाइल्स, प्लास्टर व पेंटिंग", icon: "fa-trowel-bricks", count: 18, rating: 4.9, color: "#dbeafe", textColor: "#1d4ed8" },
      { id: "events", name_en: "Events & Catering", name_hi: "इवेंट्स एवं कैटरिंग स्टाफ", subtext_en: "Waiters, Halwai Chefs & Tent Labor", subtext_hi: "वेटर, हलवाई-कुक, सफाई व टेंट", icon: "fa-champagne-glasses", count: 12, rating: 4.8, color: "#fce7f3", textColor: "#be185d" },
      { id: "shifting", name_en: "House & Office Shifting", name_hi: "सामान शिफ्टिंग एवं लोडिंग", subtext_en: "Packing, Luggage Loading & Unloading", subtext_hi: "पैकिंग, लोडिंग, अनलोडिंग व सफाई", icon: "fa-truck-ramp-box", count: 15, rating: 4.9, color: "#fef3c7", textColor: "#b45309" },
      { id: "textile", name_en: "Textile Mill & Fabric", name_hi: "टेक्सटाइल मिल एवं थान हेल्पर", subtext_en: "Fabric Cutting, Roll Loading & Machine", subtext_hi: "कपड़ा कटिंग, रोल लोडिंग व मिल हेल्पर", icon: "fa-scissors", count: 22, rating: 4.8, color: "#dcfce7", textColor: "#15803d" }
    ],
    services: [
      // 1. Construction (5 trades)
      { id: "const_mason", category_id: "construction", name_en: "Bricklayer / Master Mason", name_hi: "राजमिस्त्री (चिनाई कार्य)", desc_en: "Brickwork, cement plastering, stone masonry & wall construction.", desc_hi: "ईंट, सीमेंट, चिनाई और दीवार निर्माण कार्य।", base_rate: 850.0, unit: "day", popular: true },
      { id: "const_plaster", category_id: "construction", name_en: "Wall Plaster & Cement Helper", name_hi: "प्लास्टर एवं सीमेंट मजदूर", desc_en: "Smooth wall plastering, cement mortar mixing, ceiling preparation.", desc_hi: "दीवार प्लास्टर, सीमेंट मसाला मिश्रण व छत फिनिशिंग।", base_rate: 600.0, unit: "day", popular: false },
      { id: "const_tiles", category_id: "construction", name_en: "Tiles & Flooring Specialist", name_hi: "टाइल एवं फर्श मिस्त्री", desc_en: "Vitrified tiles, granite slab installation, bathroom marble tiling.", desc_hi: "विट्रीफाइड टाइल, ग्रेनाइट पत्थर व बाथरूम फ्लोरिंग फिटिंग।", base_rate: 900.0, unit: "day", popular: true },
      { id: "const_plumb", category_id: "construction", name_en: "Plumbing & Sanitary Helper", name_hi: "प्लंबिंग एवं पाइप हेल्पर", desc_en: "Water pipe fitting, leakage repair, sanitary fittings & drainage work.", desc_hi: "पानी पाइप फिटिंग, नल रिपेयर, सेनेटरी एवं ड्रेनेज कार्य।", base_rate: 700.0, unit: "day", popular: false },
      { id: "const_paint", category_id: "construction", name_en: "Painter & Wall Putty Artisan", name_hi: "पेंटर एवं दीवार पुट्टी मिस्त्री", desc_en: "Primer coating, interior emulsion, exterior weather coat & putty application.", desc_hi: "प्राइमर, आंतरिक व बाहरी डिस्टेंपर, पुट्टी एवं पेंटिंग कार्य।", base_rate: 750.0, unit: "day", popular: true },

      // 2. Events & Catering (5 trades)
      { id: "event_waiter", category_id: "events", name_en: "Wedding Buffet & Table Waiter", name_hi: "शादी-ब्याह व पार्टी वेटर", desc_en: "Uniformed table service, banquet buffet refill, guest hospitality.", desc_hi: "शादी, पार्टी एवं बैंक्वेट में वेटर व अतिथि सेवा।", base_rate: 650.0, unit: "day", popular: true },
      { id: "event_halwai", category_id: "events", name_en: "Kitchen Cook Assistant / Halwai", name_hi: "रसोई हलवाई सहायक", desc_en: "Indian sweets, frying snacks, bulk curry prep & chef assistant.", desc_hi: "मिठाई, नाश्ता, सब्जी कटिंग व मुख्य हलवाई की सहायता।", base_rate: 750.0, unit: "day", popular: true },
      { id: "event_clean", category_id: "events", name_en: "Event Cleaning & Dishwashing Crew", name_hi: "इवेंट सफाई व बर्तन धोने वाले", desc_en: "Continuous crockery sanitizing, hall floor sweep, waste disposal.", desc_hi: "बर्तन सफाई, हॉल झाड़ू-पोछा व कचरा निस्तारण कार्य।", base_rate: 550.0, unit: "day", popular: false },
      { id: "event_tent", category_id: "events", name_en: "Tent & Mandap Setup Labor", name_hi: "टेंट व मंडप लगाने वाले मजदूर", desc_en: "Heavy iron pole anchoring, canopy stretching, stage framing & carpet.", desc_hi: "भारी लोहे के पाइप, मंडप, शामियाना व स्टेज फिटिंग।", base_rate: 700.0, unit: "day", popular: false },
      { id: "event_beverage", category_id: "events", name_en: "Welcome Drinks & Mocktail Server", name_hi: "वेलकम ड्रिंक्स व शरबत स्टाफ", desc_en: "Fruit juice dispensing, cold beverage tables, glass arrangements.", desc_hi: "जूस, शरबत व ड्रिंक्स काउंटर सर्विस व ग्लास व्यवस्था।", base_rate: 600.0, unit: "day", popular: false },

      // 3. House & Office Shifting (5 trades)
      { id: "shift_loader", category_id: "shifting", name_en: "Heavy Luggage & Furniture Loader", name_hi: "भारी सामान लोडर मजदूर", desc_en: "Sofas, wardrobes, beds carrying with balance straps & ramp dollies.", desc_hi: "सोफा, अलमारी, बेड व भारी सामान सुरक्षित चढ़ाना व उतारना।", base_rate: 750.0, unit: "day", popular: true },
      { id: "shift_packing", category_id: "shifting", name_en: "Packing & Bubble-Wrap Specialist", name_hi: "पैकिंग व बबल-रैप विशेषज्ञ", desc_en: "Fragile crockery packaging, corrugated box taping, furniture padding.", desc_hi: "कांच का सामान पैकिंग, कार्टन बॉक्स टेपिंग व फर्नीचर सुरक्षा।", base_rate: 650.0, unit: "day", popular: true },
      { id: "shift_unloader", category_id: "shifting", name_en: "Truck Unloading & Room Setup Helper", name_hi: "अनलोडिंग व कमरा सेटअप हेल्पर", desc_en: "Floor-by-floor carry, room placement, carton unboxing assistance.", desc_hi: "मंजिल अनुसार सामान चढ़ाना, कमरे में सेट करना व अनबॉक्सिंग।", base_rate: 700.0, unit: "day", popular: false },
      { id: "shift_truck", category_id: "shifting", name_en: "Commercial Freight & Tempo Loader", name_hi: "कमर्शियल लोडिंग व टेम्पो लेबर", desc_en: "Warehouse dispatch, industrial pallet loading, logistics handling.", desc_hi: "गोदाम माल डिस्पैच, टेम्पो लोडिंग व ट्रांसपोर्ट माल ढुलाई।", base_rate: 750.0, unit: "day", popular: false },
      { id: "shift_deepclean", category_id: "shifting", name_en: "Move-In & Garden Deep Cleaning", name_hi: "शिफ्टिंग पश्चात घर व गार्डन सफाई", desc_en: "Floor chemical scrubbing, window cleaning, garden leaves clearance.", desc_hi: "फ्लोर स्क्रबिंग, खिड़कियों की सफाई व बगीचे का कचरा हटाना।", base_rate: 600.0, unit: "day", popular: false },

      // 4. Textile Mill & Fabric (5 trades)
      { id: "textile_roller", category_id: "textile", name_en: "Fabric Roll Loading Labour", name_hi: "थान लोडिंग एवं ट्रांसपोर्ट हेल्पर", desc_en: "Lifting grey cloth rolls, truck dispatching, bale warehouse stacking.", desc_hi: "कपड़े के थान उठाना, ट्रक में भरना व गोदाम में बंडल थप्पी लगाना।", base_rate: 650.0, unit: "day", popular: true },
      { id: "textile_cutter", category_id: "textile", name_en: "Fabric Cutting & Folding Worker", name_hi: "कपड़ा कटिंग व फोल्डिंग कारीगर", desc_en: "Exact meter measurement cutting, batch folding, polybag packing.", desc_hi: "मीटर अनुसार थान कटिंग, तह लगाना व प्लास्टिक पैकिंग।", base_rate: 600.0, unit: "day", popular: true },
      { id: "textile_machine", category_id: "textile", name_en: "Textile Mill Machine Helper", name_hi: "कपड़ा मिल मशीन हेल्पर", desc_en: "Loom yarn bobbin reload, circular knitting assist, dyeing vat helper.", desc_hi: "लूम चरखा बॉबिन बदलना, डाइंग व बुनाई मशीन में सहायता।", base_rate: 700.0, unit: "day", popular: false },
      { id: "textile_qc", category_id: "textile", name_en: "Quality Checking & Tagging Artisan", name_hi: "क्वालिटी चेकिंग व टैगिंग वर्कर", desc_en: "Detecting weaving defects, stain inspection, size label tagging.", desc_hi: "कपड़े के डिफेक्ट्स पहचानना, दाग जांच व बारकोड टैग लगाना।", base_rate: 650.0, unit: "day", popular: false },
      { id: "textile_press", category_id: "textile", name_en: "Fabric Steam Press & Bale Stacking", name_hi: "स्टीम प्रेस व गट्ठा बांधने वाले", desc_en: "Heavy industrial steam ironing, bale press packing & banding.", desc_hi: "कपड़े की स्टीम प्रेसिंग, गट्ठे बांधना व पैकिंग कार्य।", base_rate: 600.0, unit: "day", popular: false }
    ],
    workers: [
      { id: "w-101", name: "Mukesh Verma", phone: "+91 98234 11092", category_id: "construction", primary_trade: "Bricklayer / Master Mason", primary_trade_hi: "राजमिस्त्री (चिनाई)", rating: 4.9, reviews_count: 142, daily_rate: 850.0, city: "Surat", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", is_available: 1, available: true },
      { id: "w-102", name: "Ramprasad Meena", phone: "+91 98765 22001", category_id: "shifting", primary_trade: "Heavy Luggage & Furniture Loader", primary_trade_hi: "सामान शिफ्टिंग विशेषज्ञ", rating: 4.9, reviews_count: 98, daily_rate: 750.0, city: "Surat", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", is_available: 1, available: true },
      { id: "w-103", name: "Rajesh Kumar", phone: "+91 98112 33445", category_id: "events", primary_trade: "Wedding Buffet & Table Waiter", primary_trade_hi: "पार्टी वेटर", rating: 4.8, reviews_count: 110, daily_rate: 650.0, city: "Surat", photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", is_available: 1, available: true },
      { id: "w-104", name: "Suresh Soni", phone: "+91 98980 11223", category_id: "textile", primary_trade: "Fabric Roll Loading Labour", primary_trade_hi: "थान लोडिंग हेल्पर", rating: 4.8, reviews_count: 76, daily_rate: 650.0, city: "Surat", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", is_available: 1, available: true },
      { id: "w-105", name: "Dinesh Patel", phone: "+91 98251 66778", category_id: "construction", primary_trade: "Tiles & Flooring Specialist", primary_trade_hi: "टाइल एवं फर्श मिस्त्री", rating: 4.9, reviews_count: 85, daily_rate: 900.0, city: "Surat", photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", is_available: 1, available: true },
      { id: "w-106", name: "Kailash Halwai", phone: "+91 98790 55443", category_id: "events", primary_trade: "Kitchen Cook Assistant / Halwai", primary_trade_hi: "रसोई हलवाई सहायक", rating: 4.8, reviews_count: 92, daily_rate: 750.0, city: "Surat", photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face", kyc_status: "verified", is_available: 1, available: true }
    ],
    bookings: [
      {
        id: "b-active-1",
        customer_id: "u-1",
        customer_name: "Ramesh Kumar",
        customer_phone: "9876543210",
        service_id: "const_mason",
        service_name: "Bricklayer / Master Mason",
        service_name_hi: "राजमिस्त्री (चिनाई कार्य)",
        worker_id: "w-101",
        worker_name: "Mukesh Verma",
        worker_phone: "+91 98234 11092",
        worker_trade: "Bricklayer / Master Mason",
        worker_trade_hi: "राजमिस्त्री (चिनाई)",
        worker_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        worker_rating: 4.9,
        booking_type: "instant",
        scheduled_date_time: "Today, Immediate",
        duration_hours: 8,
        total_cost: 935.0,
        commission_amount: 85.0,
        worker_payout_amount: 850.0,
        otp: "5603",
        eta_minutes: 12,
        status: "in_progress",
        location_address: "Flat 402, Lotus Tower, Sector 14, Surat",
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
            "id": "admin-1",
            "name": "admin",
            "phone": "7878193644",
            "email": "bhavarthhapani7@gmail.com",
            "address": "WorkMate Admin HQ",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 1000",
            "member_id": "WM-ADMIN-001",
            "account_type": "System Administrator",
            "joined_date": "September 14, 2026",
            "trust_score": 5.0,
            "kyc_status": "verified",
            "password": "admin123",
            "role": "admin"
      },
      {
            "id": "c-101",
            "name": "Ramesh Kumar (Tivari)",
            "phone": "9876543210",
            "email": "ramesh.tivari@workmate.in",
            "address": "Flat 402, Lotus Tower, Sector 14",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 9012",
            "member_id": "WM-USER-89104",
            "account_type": "Customer Premium",
            "joined_date": "September 14, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "customer"
      },
      {
            "id": "c-102",
            "name": "Priya Sharma",
            "phone": "9820112345",
            "email": "priya.sharma@example.com",
            "address": "B-104, Green Acres, Vesu",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4421",
            "member_id": "WM-USER-89105",
            "account_type": "Customer Verified",
            "joined_date": "September 14, 2026",
            "trust_score": 4.8,
            "kyc_status": "verified",
            "password": "password123",
            "role": "customer"
      },
      {
            "id": "c-103",
            "name": "Hardik Patel",
            "phone": "9898223344",
            "email": "hardik.patel@example.com",
            "address": "45, Narayan Nagar, Katargam",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 5591",
            "member_id": "WM-USER-89106",
            "account_type": "Customer Verified",
            "joined_date": "September 14, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "customer"
      },
      {
            "id": "c-104",
            "name": "Ananya Verma",
            "phone": "9819334455",
            "email": "ananya.verma@example.com",
            "address": "Villa 12, Riverfront Enclave",
            "city": "Ahmedabad, Gujarat",
            "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 6612",
            "member_id": "WM-USER-89107",
            "account_type": "Customer Verified",
            "joined_date": "September 15, 2026",
            "trust_score": 4.7,
            "kyc_status": "verified",
            "password": "password123",
            "role": "customer"
      },
      {
            "id": "c-105",
            "name": "Manoj Agrawal",
            "phone": "9825445566",
            "email": "manoj.agrawal@example.com",
            "address": "Shop 8, Textile Market, Ring Road",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 7731",
            "member_id": "WM-USER-89108",
            "account_type": "Customer Verified",
            "joined_date": "September 15, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "customer"
      },
      {
            "id": "c-106",
            "name": "Sneha Kulkarni",
            "phone": "9833556677",
            "email": "sneha.k@example.com",
            "address": "Flat 701, Sunshine Heights, Adajan",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 8841",
            "member_id": "WM-USER-89109",
            "account_type": "Customer Verified",
            "joined_date": "September 15, 2026",
            "trust_score": 4.8,
            "kyc_status": "verified",
            "password": "password123",
            "role": "customer"
      },
      {
            "id": "c-107",
            "name": "Chirag Mehta",
            "phone": "9879667788",
            "email": "chirag.mehta@example.com",
            "address": "102, Shivalik Avenue, City Light",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 9951",
            "member_id": "WM-USER-89110",
            "account_type": "Customer Verified",
            "joined_date": "September 15, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "customer"
      },
      {
            "id": "c-108",
            "name": "Pooja Deshmukh",
            "phone": "9822778899",
            "email": "pooja.deshmukh@example.com",
            "address": "54, Silver Palm Society, Althan",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 1161",
            "member_id": "WM-USER-89111",
            "account_type": "Customer Verified",
            "joined_date": "September 15, 2026",
            "trust_score": 4.8,
            "kyc_status": "verified",
            "password": "password123",
            "role": "customer"
      },
      {
            "id": "w-101",
            "name": "Mukesh Verma",
            "phone": "9823411092",
            "email": "mukesh.verma@workmate.in",
            "address": "Varachha Labour Colony",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 2271",
            "member_id": "WM-WRK-20101",
            "account_type": "Worker Partner (Masonry)",
            "joined_date": "September 14, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "worker"
      },
      {
            "id": "w-102",
            "name": "Ramprasad Meena",
            "phone": "9876522001",
            "email": "ramprasad.meena@workmate.in",
            "address": "Udhna GIDC Labour Quarter",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 3381",
            "member_id": "WM-WRK-20102",
            "account_type": "Worker Partner (Shifting)",
            "joined_date": "September 14, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "worker"
      },
      {
            "id": "w-103",
            "name": "Rajesh Mistri",
            "phone": "9811233445",
            "email": "rajesh.mistri@workmate.in",
            "address": "Sarthana Jakat Naka",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4491",
            "member_id": "WM-WRK-20103",
            "account_type": "Worker Partner (Tiling)",
            "joined_date": "September 14, 2026",
            "trust_score": 4.8,
            "kyc_status": "verified",
            "password": "password123",
            "role": "worker"
      },
      {
            "id": "w-104",
            "name": "Suresh Soni",
            "phone": "9898011223",
            "email": "suresh.soni@workmate.in",
            "address": "Pandesara Industrial Area",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 5501",
            "member_id": "WM-WRK-20104",
            "account_type": "Worker Partner (Textile)",
            "joined_date": "September 14, 2026",
            "trust_score": 4.8,
            "kyc_status": "verified",
            "password": "password123",
            "role": "worker"
      },
      {
            "id": "w-105",
            "name": "Kailash Halwai",
            "phone": "9879055443",
            "email": "kailash.halwai@workmate.in",
            "address": "Nanpura Sweets Bazaar",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 6611",
            "member_id": "WM-WRK-20105",
            "account_type": "Worker Partner (Catering)",
            "joined_date": "September 14, 2026",
            "trust_score": 4.8,
            "kyc_status": "verified",
            "password": "password123",
            "role": "worker"
      },
      {
            "id": "w-106",
            "name": "Bablu Paswan",
            "phone": "9825166778",
            "email": "bablu.paswan@workmate.in",
            "address": "Amroli Labour Naka",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 7721",
            "member_id": "WM-WRK-20106",
            "account_type": "Worker Partner (Plaster/Paint)",
            "joined_date": "September 15, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "worker"
      },
      {
            "id": "w-107",
            "name": "Govind Yadav",
            "phone": "9819077889",
            "email": "govind.yadav@workmate.in",
            "address": "Majura Gate Service Hub",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 8831",
            "member_id": "WM-WRK-20107",
            "account_type": "Worker Partner (Events Waiter)",
            "joined_date": "September 15, 2026",
            "trust_score": 4.8,
            "kyc_status": "verified",
            "password": "password123",
            "role": "worker"
      },
      {
            "id": "d-301",
            "name": "Kishorebhai Thekedar",
            "phone": "9820044556",
            "email": "kishore.thekedar@workmate.in",
            "address": "Ring Road Labour Office",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 9941",
            "member_id": "WM-DL-30101",
            "account_type": "Contractor / Dalal (Construction)",
            "joined_date": "September 14, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "dalal"
      },
      {
            "id": "d-302",
            "name": "Vikram Singh Contractor",
            "phone": "9898055667",
            "email": "vikram.contractor@workmate.in",
            "address": "Kamrej Cross Road",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 1051",
            "member_id": "WM-DL-30102",
            "account_type": "Contractor / Dalal (Civil Works)",
            "joined_date": "September 14, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "dalal"
      },
      {
            "id": "d-303",
            "name": "Abdul Rahman Dalal",
            "phone": "9825066778",
            "email": "abdul.dalal@workmate.in",
            "address": "Sachin GIDC Textile Zone",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 2161",
            "member_id": "WM-DL-30103",
            "account_type": "Contractor / Dalal (Textile Mills)",
            "joined_date": "September 14, 2026",
            "trust_score": 4.8,
            "kyc_status": "verified",
            "password": "password123",
            "role": "dalal"
      },
      {
            "id": "d-304",
            "name": "Jagdish Bhai Mandapwala",
            "phone": "9879077889",
            "email": "jagdish.mandap@workmate.in",
            "address": "Bhatar Road Event Complex",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 3271",
            "member_id": "WM-DL-30104",
            "account_type": "Contractor / Dalal (Events & Tent)",
            "joined_date": "September 15, 2026",
            "trust_score": 4.8,
            "kyc_status": "verified",
            "password": "password123",
            "role": "dalal"
      },
      {
            "id": "d-305",
            "name": "Mahendra Yadav",
            "phone": "9821088990",
            "email": "mahendra.transport@workmate.in",
            "address": "Kadodara Highway Transport Nagar",
            "city": "Surat, Gujarat",
            "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4381",
            "member_id": "WM-DL-30105",
            "account_type": "Contractor / Dalal (Shifting & Transport)",
            "joined_date": "September 15, 2026",
            "trust_score": 4.9,
            "kyc_status": "verified",
            "password": "password123",
            "role": "dalal"
      }
],
    wallet: { balance: 13000.0, currency: "INR", symbol: "₹" },
    transactions: [
      { id: "tx-init-1", type: "deposit", amount: 15000.0, direction: "credit", title_en: "Wallet Top-Up (Google Pay UPI)", title_hi: "वॉलेट में पैसे जोड़े (गूगल पे)", status: "success", date_str: "Sep 14, 2026", method: "Google Pay (UPI)", reference_id: "UPI_GPAY_991823" },
      { id: "tx-init-2", type: "payment", amount: 935.0, direction: "debit", title_en: "Labour Escrow Reserve (Masonry)", title_hi: "लेबर एस्क्रो आरक्षण (राजमिस्त्री)", status: "success", date_str: "Sep 14, 2026", method: "WorkMate Escrow", reference_id: "ESC_BK_101" }
    ],
    reviews: [
      { id: "rev-1", booking_id: "b-prev-1", worker_id: "w-101", worker_name: "Mukesh Verma", customer_name: "Vikram Shah", rating: 5, tags: ["Punctual", "Skillful"], comment: "Mukesh arrived on time and finished the brickwork flawlessly.", date_str: "Yesterday" }
    ],
    adminBanks: [
      { id: "bank-hdfc-1", bank_name: "HDFC Bank Corporate", account_name: "WorkMate Escrow & Clearing Pvt Ltd", account_masked: "•••• 9921", account_number_masked: "•••• 9921", ifsc: "HDFC0000240", ifsc_code: "HDFC0000240", branch: "Surat Central", upi_id: "workmate.escrow@hdfcbank", is_primary: true, total_routed_inr: 245000.0, status: "ACTIVE" },
      { id: "bank-icici-2", bank_name: "ICICI Bank Business", account_name: "WorkMate Clearing & Settlement", account_masked: "•••• 4410", account_number_masked: "•••• 4410", ifsc: "ICIC0001092", ifsc_code: "ICIC0001092", branch: "Ring Road", upi_id: "workmate.ops@icici", is_primary: false, total_routed_inr: 120000.0, status: "STANDBY" },
      { id: "bank-axis-3", bank_name: "Axis Bank Corporate Reserve", account_name: "WorkMate Reserve & Payouts", account_masked: "•••• 8104", account_number_masked: "•••• 8104", ifsc: "UTIB0000451", ifsc_code: "UTIB0000451", branch: "Varachha", upi_id: "workmate.reserve@axisbank", is_primary: false, total_routed_inr: 85000.0, status: "STANDBY" }
    ],
    config: { platform_charge_percent: 10.0 }
  };

  function loadLocalDb() {
    try {
      const stored = localStorage.getItem("workmate_client_db");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.schemaVersion >= 4 && parsed.services && parsed.services.length >= 20) {
          return parsed;
        }
        // Upgrade existing local storage with all 20 services and schema
        parsed.schemaVersion = 5;
        parsed.users = DEFAULT_DB.users;
        parsed.categories = DEFAULT_DB.categories;
        parsed.services = DEFAULT_DB.services;
        parsed.workers = DEFAULT_DB.workers;
        if (parsed.users) {
          parsed.users.forEach(u => {
            if (!u.password) u.password = (u.role === 'admin' || u.id === 'admin-1') ? 'admin123' : '123456';
            if (!u.role) u.role = (u.id === 'admin-1' || u.phone === '7878193644') ? 'admin' : 'customer';
          });
        } else {
          parsed.users = DEFAULT_DB.users;
        }
        parsed.adminBanks = DEFAULT_DB.adminBanks;
        localStorage.setItem("workmate_client_db", JSON.stringify(parsed));
        return parsed;
      }
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

  function cleanPhone(raw) {
    if (!raw) return "";
    let digits = String(raw).replace(/[^0-9]/g, "");
    if (digits.length > 10 && digits.startsWith("91")) {
      digits = digits.slice(2);
    }
    return digits.slice(-10);
  }

  async function mockApiHandler(urlStr, init = {}) {
    const url = new URL(urlStr, window.location.origin);
    const pathname = url.pathname;
    const method = (init.method || "GET").toUpperCase();
    let body = {};
    if (init.body) {
      try {
        body = JSON.parse(init.body);
      } catch (e) {
        body = {};
      }
    }

    const db = loadLocalDb();

    // 1. Auth Login (Supports Admin 7878193644 + admin123 and customer 9876543210 + 123456)
    if (pathname === "/api/auth/login" && method === "POST") {
      const identRaw = (body.identifier || body.phone || "").trim();
      const pass = (body.password || "").trim();
      const idStr = identRaw.toLowerCase();
      const targetPhone = cleanPhone(identRaw);

      let user = null;
      const isAdminLogin = (idStr === "admin" || idStr === "admin-1" || targetPhone === "7878193644");

      if (isAdminLogin) {
        user = db.users.find(u => u.id === "admin-1" || u.role === "admin" || cleanPhone(u.phone) === "7878193644") || db.users[1];
        if (user) {
          user.role = "admin";
          user.phone = "7878193644";
        }
      } else if (targetPhone) {
        user = db.users.find(u => cleanPhone(u.phone) === targetPhone);
      }
      if (!user) {
        user = db.users.find(u => (u.id || "").toLowerCase() === idStr || (u.email || "").toLowerCase() === idStr);
      }

      if (!user) {
        return jsonResponse({
          detail: "Account not found with this mobile number or ID. Please register first to create an account."
        }, 404);
      }

      // Password verification
      let isValidPass = false;
      if (isAdminLogin) {
        isValidPass = (pass === "admin123" || pass === "123456" || pass === (user.password || "admin123"));
      } else {
        isValidPass = (pass === (user.password || "123456"));
      }

      if (!isValidPass) {
        return jsonResponse({
          detail: "Incorrect password. Please verify and try again."
        }, 401);
      }

      const role = isAdminLogin ? "admin" : (user.role || "customer");
      return jsonResponse({
        success: true,
        token: role === "admin" ? "wm_admin_sec_token_9901" : `wm_cust_token_${user.id}`,
        role: role,
        user: user
      });
    }

    // 2. Auth Register (With role selection: customer, worker, dalal)
    if (pathname === "/api/auth/register" && method === "POST") {
      const targetPhone = cleanPhone(body.phone);
      if (targetPhone.length !== 10) {
        return jsonResponse({ detail: "Mobile number must be exactly 10 digits." }, 400);
      }
      const pass = (body.password || "").trim();
      if (!pass || pass.length < 6) {
        return jsonResponse({ detail: "Password must be at least 6 characters." }, 400);
      }

      let existing = db.users.find(u => cleanPhone(u.phone) === targetPhone);
      if (existing) {
        return jsonResponse({ detail: "An account with this mobile number already exists. Please login." }, 400);
      }

      const role = (body.role || "customer").toLowerCase();
      const newId = "u-" + Math.random().toString(16).slice(2, 8);
      const isWorker = role === "worker";
      const isDalal = role === "dalal" || role === "contractor";

      let accType = "Customer Verified";
      let memPrefix = "WM-USER-";
      let photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face";

      if (isWorker) {
        accType = "Worker Partner";
        memPrefix = "WM-WRK-";
        photoUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
      } else if (isDalal) {
        accType = "Labour Contractor / Dalal";
        memPrefix = "WM-DL-";
        photoUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face";
      }

      const newUser = {
        id: newId,
        name: body.name.trim(),
        phone: targetPhone,
        email: (body.email || "").trim(),
        address: (body.address || "").trim(),
        city: (body.city || "").trim(),
        photo: photoUrl,
        aadhaar_masked: "•••• •••• " + Math.floor(1000 + Math.random() * 9000),
        member_id: memPrefix + Math.floor(10000 + Math.random() * 90000),
        account_type: accType,
        joined_date: "September 14, 2026",
        trust_score: 5.0,
        kyc_status: "verified",
        password: pass,
        role: role
      };

      db.users.unshift(newUser);

      // If registered as worker, also add to active worker directory
      if (isWorker) {
        db.workers.push({
          id: "w-" + newId.replace("u-", ""),
          name: newUser.name,
          phone: "+91 " + newUser.phone,
          category_id: "construction",
          primary_trade: "General Construction & Craft Artisan",
          primary_trade_hi: "कुशल निर्माण कारीगर",
          rating: 5.0,
          reviews_count: 0,
          daily_rate: 750.0,
          city: newUser.city || "Surat",
          photo: newUser.photo,
          kyc_status: "verified",
          is_available: 1,
          available: true
        });
      }

      saveLocalDb(db);
      return jsonResponse({
        success: true,
        token: `wm_cust_token_${newUser.id}`,
        role: role,
        user: newUser,
        message: "Account registered successfully! Welcome to WorkMate."
      });
    }

    // 2b. Admin User Management Endpoints
    if (pathname === "/api/admin/users" && method === "GET") {
      return jsonResponse(db.users);
    }
    if (pathname === "/api/admin/users" && method === "POST") {
      const phoneDigits = cleanPhone(body.phone);
      if (phoneDigits.length !== 10) {
        return jsonResponse({ detail: "Mobile number must be exactly 10 digits." }, 400);
      }
      if (!body.password || body.password.length < 6) {
        return jsonResponse({ detail: "Password must be at least 6 characters." }, 400);
      }
      if (db.users.some(u => cleanPhone(u.phone) === phoneDigits)) {
        return jsonResponse({ detail: "A user with this mobile number already exists." }, 400);
      }

      const newId = "u-" + Math.random().toString(16).slice(2, 8);
      const role = (body.role || "customer").toLowerCase();
      const isAdm = role === "admin";
      const isWorker = role === "worker";
      const isDalal = role === "dalal" || role === "contractor";
      
      let accType = "Customer Verified";
      let photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face";
      let memPrefix = "WM-USER-";

      if (isAdm) {
        accType = "System Administrator";
        photoUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face";
        memPrefix = "WM-ADMIN-";
      } else if (isWorker) {
        accType = "Worker Partner";
        photoUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";
        memPrefix = "WM-WRK-";
      } else if (isDalal) {
        accType = "Labour Contractor / Dalal";
        photoUrl = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face";
        memPrefix = "WM-DL-";
      }

      const createdUser = {
        id: newId,
        name: body.name.trim(),
        phone: phoneDigits,
        email: (body.email || "").trim(),
        address: (body.address || "").trim(),
        city: (body.city || "").trim(),
        photo: photoUrl,
        aadhaar_masked: isAdm ? "" : "•••• •••• " + Math.floor(1000 + Math.random() * 9000),
        member_id: memPrefix + Math.floor(10000 + Math.random() * 90000),
        account_type: accType,
        joined_date: "September 14, 2026",
        trust_score: 5.0,
        kyc_status: "verified",
        password: body.password.trim(),
        role: role
      };

      db.users.unshift(createdUser);
      saveLocalDb(db);
      return jsonResponse({ success: true, user: createdUser }, 201);
    }

    if (pathname.startsWith("/api/admin/users/") && method === "PUT") {
      const uid = pathname.split("/")[4];
      const idx = db.users.findIndex(u => u.id === uid);
      if (idx === -1) {
        return jsonResponse({ detail: "User not found" }, 404);
      }

      if (body.name) db.users[idx].name = body.name.trim();
      if (body.phone) {
        const phoneDigits = cleanPhone(body.phone);
        if (phoneDigits.length !== 10) {
          return jsonResponse({ detail: "Mobile number must be exactly 10 digits." }, 400);
        }
        db.users[idx].phone = phoneDigits;
      }
      if (body.password && body.password.length >= 6) {
        db.users[idx].password = body.password.trim();
      }
      if (body.role) {
        db.users[idx].role = body.role.toLowerCase();
        if (db.users[idx].role === "admin") db.users[idx].account_type = "System Administrator";
        else if (db.users[idx].role === "worker") db.users[idx].account_type = "Worker Partner";
        else if (db.users[idx].role === "dalal") db.users[idx].account_type = "Labour Contractor / Dalal";
        else db.users[idx].account_type = "Customer Verified";
      }
      if (body.address !== undefined) db.users[idx].address = body.address.trim();
      if (body.city !== undefined) db.users[idx].city = body.city.trim();
      if (body.email !== undefined) db.users[idx].email = body.email.trim();

      saveLocalDb(db);
      return jsonResponse({ success: true, user: db.users[idx] });
    }

    if (pathname.startsWith("/api/admin/users/") && method === "DELETE") {
      const uid = pathname.split("/")[4];
      if (uid === "admin-1") {
        return jsonResponse({ detail: "Primary system administrator account cannot be deleted." }, 400);
      }
      const initialLen = db.users.length;
      db.users = db.users.filter(u => u.id !== uid);
      if (db.users.length === initialLen) {
        return jsonResponse({ detail: "User not found" }, 404);
      }
      saveLocalDb(db);
      return jsonResponse({ success: true, message: "User account deleted successfully." });
    }

    // 3. User Profile
    if (pathname === "/api/user/profile") {
      const uid = url.searchParams.get("user_id") || (db.users[0] ? db.users[0].id : "u-1");
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
        return jsonResponse({ success: true, user: u, profile: u });
      }
    }

    // 4. User Avatar
    if (pathname.startsWith("/api/user/avatar") && method === "POST") {
      const uid = url.searchParams.get("user_id") || "u-1";
      const u = db.users.find(item => item.id === uid);
      if (u) {
        u.photo = body.photo;
        saveLocalDb(db);
      }
      return jsonResponse({ success: true, photo: body.photo, profile: u });
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
    if (pathname === "/api/workers") {
      const cat = url.searchParams.get("category_id");
      const availableOnly = url.searchParams.get("available_only") === "true";
      let list = db.workers;
      if (cat) list = list.filter(w => w.category_id === cat);
      if (availableOnly) list = list.filter(w => w.is_available === 1 || w.available === true);
      return jsonResponse(list);
    }

    // 7. Bookings
    if (pathname === "/api/bookings") {
      if (method === "GET") return jsonResponse(db.bookings);
      if (method === "POST") {
        const srv = db.services.find(s => s.id === body.service_id) || db.services[0];
        // Support direct worker selection if passed, or matching available worker
        let wkr = null;
        if (body.worker_id) {
          wkr = db.workers.find(w => w.id === body.worker_id);
        }
        if (!wkr) {
          wkr = db.workers.find(w => w.category_id === srv.category_id && (w.is_available === 1 || w.available === true)) || db.workers[0];
        }

        const chargeRate = (db.config.platform_charge_percent || 10) / 100;
        const total = (body.custom_offer_rate || srv.base_rate) * (1 + chargeRate);

        const newBk = {
          id: "b-" + Math.random().toString(16).slice(2, 10),
          booking_number: "WM-2026-" + Math.floor(100 + Math.random() * 900),
          customer_id: body.customer_id || "u-1",
          customer_name: body.customer_name || "Customer",
          customer_phone: body.customer_phone || "+91 98765 43210",
          service_id: srv.id,
          service_name: srv.name_en,
          service_name_hi: srv.name_hi,
          worker_id: wkr ? wkr.id : "w-101",
          worker_name: wkr ? wkr.name : "Mukesh Verma",
          worker_phone: wkr ? wkr.phone : "+91 98234 11092",
          worker_trade: wkr ? wkr.primary_trade : "Bricklayer / Master Mason",
          worker_trade_hi: wkr ? wkr.primary_trade_hi : "राजमिस्त्री (चिनाई)",
          worker_photo: wkr ? wkr.photo : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          worker_rating: wkr ? wkr.rating : 4.9,
          booking_type: body.booking_type || "instant",
          scheduled_date_time: "Today, Immediate",
          duration_hours: parseInt(body.duration_hours || 8, 10),
          total_cost: Math.round(total),
          commission_amount: Math.round(total * chargeRate),
          worker_payout_amount: Math.round(total * (1 - chargeRate)),
          otp: String(Math.floor(1000 + Math.random() * 9000)),
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

        // Mark worker temporarily busy
        if (wkr) {
          wkr.is_available = 0;
          wkr.available = false;
        }

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
        wkr.rating = Math.max(1.0, Math.round(((wkr.rating * (wkr.reviews_count || 10) + 1) / ((wkr.reviews_count || 10) + 1)) * 10) / 10);
        wkr.reviews_count = (wkr.reviews_count || 0) + 1;
        wkr.is_available = 1;
        wkr.available = true;
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
        // Free up the worker
        const wkr = db.workers.find(w => w.id === b.worker_id);
        if (wkr) {
          wkr.is_available = 1;
          wkr.available = true;
        }
      }
      saveLocalDb(db);
      return jsonResponse({ success: true, message: "Work completed successfully! Payout released." });
    }

    // 10. Wallet endpoints (Persistent real UPI, Net Banking, and QR deposits)
    if (pathname === "/api/wallet") return jsonResponse(db.wallet);
    if (pathname === "/api/wallet/transactions") return jsonResponse(db.transactions);
    if (pathname === "/api/wallet/deposit" && method === "POST") {
      const amt = parseFloat(body.amount);
      db.wallet.balance += amt;
      const refCode = "WM_UPI_" + Math.random().toString(16).slice(2, 8).toUpperCase();
      const methodLabel = body.method || "Google Pay (UPI)";
      db.transactions.unshift({
        id: "tx-dep-" + Math.random().toString(16).slice(2, 8),
        type: "deposit",
        amount: amt,
        direction: "credit",
        title_en: `Deposit via ${methodLabel}`,
        title_hi: `${methodLabel} द्वारा जमा`,
        status: "success",
        date_str: "Just Now",
        method: methodLabel,
        reference_id: refCode
      });
      saveLocalDb(db);
      return jsonResponse({ wallet: db.wallet, success: true, reference_id: refCode });
    }
    if (pathname === "/api/wallet/payout" && method === "POST") {
      const amt = parseFloat(body.amount);
      db.wallet.balance = Math.max(0, db.wallet.balance - amt);
      const refCode = "PAY_" + Math.random().toString(16).slice(2, 8).toUpperCase();
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
        reference_id: refCode
      });
      saveLocalDb(db);
      return jsonResponse({ wallet: db.wallet, success: true, reference_id: refCode });
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
      const b = db.bookings[0] || {};
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

    // 14. Full Database Records Explorer
    if (pathname === "/api/database/records") {
      return jsonResponse({
        success: true,
        schema_version: db.schemaVersion || 4,
        storage_type: "In-Browser SQLite / LocalStorage Engine",
        stats: {
          total_users: db.users.length,
          total_bookings: db.bookings.length,
          total_services: db.services.length,
          total_workers: db.workers.length,
          total_transactions: db.transactions.length
        },
        users: db.users,
        bookings: db.bookings,
        services: db.services,
        workers: db.workers,
        transactions: db.transactions,
        categories: db.categories
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
