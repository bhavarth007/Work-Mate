"""
WorkMate Initial Seed Data
Authentic bilingual data matching Photo.pdf specifications.
"""

INITIAL_CATEGORIES = [
    {
        "id": "construction",
        "name_en": "Construction",
        "name_hi": "राजमिस्त्री",
        "subtext_en": "Masonry, Tiling, Plumbing & Electrical",
        "subtext_hi": "निर्माण एवं मरम्मत कार्य",
        "icon": "fa-trowel-bricks",
        "rating": 4.8,
        "services_count": 4
    },
    {
        "id": "events",
        "name_en": "Events",
        "name_hi": "कैटरिंग स्टाफ",
        "subtext_en": "Catering Servers, Kitchen Helpers & Tents",
        "subtext_hi": "कार्यक्रम एवं कैटरिंग सेवाएं",
        "icon": "fa-champagne-glasses",
        "rating": 4.8,
        "services_count": 4
    },
    {
        "id": "shifting",
        "name_en": "House Shifting",
        "name_hi": "सामान उठाना",
        "subtext_en": "Packing, Loading, Unloading & Setup",
        "subtext_hi": "घर का सामान व सामान्य मजदूरी",
        "icon": "fa-truck-ramp-box",
        "rating": 4.8,
        "services_count": 4
    },
    {
        "id": "textile",
        "name_en": "Textile Helper",
        "name_hi": "टेक्सटाइल हेल्पर",
        "subtext_en": "Fabric Cutting, Loom Help & Packing",
        "subtext_hi": "कपड़ा उद्योग एवं मिल हेल्पर",
        "icon": "fa-scissors",
        "rating": 4.8,
        "services_count": 4
    }
]

INITIAL_SERVICES = [
    # Construction
    {
        "id": "const_mason",
        "category_id": "construction",
        "name_en": "Rajmistri (Masons)",
        "name_hi": "राजमिस्त्री (Masons)",
        "desc_en": "Brickwork, cement plastering, tile fitting & wall construction.",
        "desc_hi": "ईंट, सीमेंट, टाइल्स और दीवार निर्माण।",
        "base_rate": 750.0,
        "unit": "per_day",
        "popular": True
    },
    {
        "id": "const_plumb_elec",
        "category_id": "construction",
        "name_en": "Plumber & Electrician",
        "name_hi": "प्लंबर और इलेक्ट्रीशियन",
        "desc_en": "Sanitary piping, conduit wiring, fixture fittings & repairs.",
        "desc_hi": "नई फिटिंग व रिपेयरिंग।",
        "base_rate": 650.0,
        "unit": "per_day",
        "popular": True
    },
    {
        "id": "const_paint_carp",
        "category_id": "construction",
        "name_en": "Painter & Carpenter",
        "name_hi": "पेंटर और कारपेंटर",
        "desc_en": "Wall putty, priming, painting, woodwork and furniture repair.",
        "desc_hi": "दीवार पेंटिंग और लकड़ी का काम।",
        "base_rate": 700.0,
        "unit": "per_day",
        "popular": False
    },
    {
        "id": "const_helper",
        "category_id": "construction",
        "name_en": "Construction Helper",
        "name_hi": "कंस्ट्रक्शन हेल्पर",
        "desc_en": "Sand, gravel transport, debris clearance & material loading.",
        "desc_hi": "रेती, गिट्टी उठाना और माल ढुलाई।",
        "base_rate": 500.0,
        "unit": "per_day",
        "popular": True
    },
    # Events & Catering
    {
        "id": "event_server",
        "category_id": "events",
        "name_en": "Catering Serving Staff",
        "name_hi": "कैटरिंग सर्विंग स्टाफ",
        "desc_en": "Professional waiters, buffet and table food servers for weddings & parties.",
        "desc_hi": "शादी/पार्टी में वेटर और सर्वर।",
        "base_rate": 600.0,
        "unit": "per_day",
        "popular": True
    },
    {
        "id": "event_kitchen",
        "category_id": "events",
        "name_en": "Kitchen Helper & Chef",
        "name_hi": "किचन हेल्पर व शेफ",
        "desc_en": "Vegetable cutting, ingredient preparation, dish cooking support.",
        "desc_hi": "सब्जी कटिंग, खाना पकाने में मदद।",
        "base_rate": 700.0,
        "unit": "per_day",
        "popular": True
    },
    {
        "id": "event_clean",
        "category_id": "events",
        "name_en": "Cleaning & Housekeeping",
        "name_hi": "सफाई व हाउसकीपिंग",
        "desc_en": "Pre-event setup cleaning, trash clearing, post-party deep sanitization.",
        "desc_hi": "इवेंट से पहले व बाद सफाई।",
        "base_rate": 500.0,
        "unit": "per_day",
        "popular": False
    },
    {
        "id": "event_tent",
        "category_id": "events",
        "name_en": "Tent & Decoration Labor",
        "name_hi": "टेंट व डेकोरेशन लेबर",
        "desc_en": "Stage setup, heavy poles, floral frames, carpets & fabric draping.",
        "desc_hi": "भारी सामान, स्टेज व टेंट लगाना।",
        "base_rate": 650.0,
        "unit": "per_day",
        "popular": False
    },
    # House Shifting & General Labour
    {
        "id": "shift_pack_load",
        "category_id": "shifting",
        "name_en": "Packing & Loading Helper",
        "name_hi": "पैकिंग व लोडिंग हेल्पर",
        "desc_en": "Careful bubble wrapping, box packing and truck loading.",
        "desc_hi": "घर का सामान ध्यान से लोड करना।",
        "base_rate": 600.0,
        "unit": "per_day",
        "popular": True
    },
    {
        "id": "shift_unload_setup",
        "category_id": "shifting",
        "name_en": "Unloading & Setup",
        "name_hi": "अनलोडिंग व सेटअप",
        "desc_en": "Unloading freight, carrying to upper floors, unboxing & room positioning.",
        "desc_hi": "सामान उतारना और कमरे में जमाना।",
        "base_rate": 600.0,
        "unit": "per_day",
        "popular": True
    },
    {
        "id": "shift_garden_clean",
        "category_id": "shifting",
        "name_en": "Garden & Deep Cleaning",
        "name_hi": "गार्डन व डीप क्लीनिंग",
        "desc_en": "Lawn pruning, dry leaf disposal, farmhouse & terrace wash.",
        "desc_hi": "बगीचे का काम व फार्महाउस सफाई।",
        "base_rate": 550.0,
        "unit": "per_day",
        "popular": False
    },
    {
        "id": "shift_comm_load",
        "category_id": "shifting",
        "name_en": "Commercial Loading Labor",
        "name_hi": "कमर्शियल लोडिंग लेबर",
        "desc_en": "Heavy container handling, warehouse dispatch, truck loading/unloading.",
        "desc_hi": "ट्रकों व गोदामों से माल उतारना।",
        "base_rate": 700.0,
        "unit": "per_day",
        "popular": True
    },
    # Textile Helper
    {
        "id": "textile_mill",
        "category_id": "textile",
        "name_en": "Textile Mill Helper",
        "name_hi": "कपड़ा मिल हेल्पर",
        "desc_en": "Fabric roll cutting, folding, stacking and poly-pack boxing.",
        "desc_hi": "थान कटिंग, फोल्डिंग व पैकिंग।",
        "base_rate": 550.0,
        "unit": "per_day",
        "popular": True
    },
    {
        "id": "textile_qc",
        "category_id": "textile",
        "name_en": "Quality Checking",
        "name_hi": "क्वालिटी चेकिंग",
        "desc_en": "Thread snipping, finishing checks, stitch defect tagging.",
        "desc_hi": "धागा काटना और फिनिशिंग चेक।",
        "base_rate": 600.0,
        "unit": "per_day",
        "popular": True
    },
    {
        "id": "textile_machine",
        "category_id": "textile",
        "name_en": "Machine Operator Helper",
        "name_hi": "मशीन ऑपरेटर हेल्पर",
        "desc_en": "Loom bobbin replacement, dye vat assist, printing machine helper.",
        "desc_hi": "बुनाई व छपाई मशीन में सहायता।",
        "base_rate": 650.0,
        "unit": "per_day",
        "popular": False
    },
    {
        "id": "textile_warehouse",
        "category_id": "textile",
        "name_en": "Warehouse & Roll Loading",
        "name_hi": "गोदाम व थान लोडिंग",
        "desc_en": "Heavy denim & polyester bale lifting, inventory sorting.",
        "desc_hi": "भारी कपड़ों के रोल और बंडल उठाना।",
        "base_rate": 600.0,
        "unit": "per_day",
        "popular": False
    }
]

INITIAL_WORKERS = [
    {
        "id": "w-1",
        "name": "Mukesh Verma",
        "phone": "+91 98234 11092",
        "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        "primary_trade": "Rajmistri (Mason)",
        "primary_trade_hi": "राजमिस्त्री",
        "category_id": "construction",
        "rating": 4.8,
        "reviews_count": 142,
        "hourly_rate": 120.0,
        "daily_rate": 750.0,
        "aadhaar_verified": True,
        "police_verified": True,
        "kyc_status": "verified",
        "experience_years": 7,
        "is_available": False,  # Currently assigned to active booking
        "current_lat": 28.6180,
        "current_lng": 77.2140,
        "bio_en": "Specialist in brickwork, mosaic floor tiles, and waterproofing plaster.",
        "bio_hi": "ईंट, टाइल और वाटरप्रूफिंग प्लास्टर के अनुभवी कारीगर।"
    },
    {
        "id": "w-2",
        "name": "Sunil Kumar Meena",
        "phone": "+91 97123 44589",
        "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        "primary_trade": "Catering Serving Captain",
        "primary_trade_hi": "कैटरिंग स्टाफ",
        "category_id": "events",
        "rating": 4.9,
        "reviews_count": 98,
        "hourly_rate": 100.0,
        "daily_rate": 650.0,
        "aadhaar_verified": True,
        "police_verified": True,
        "kyc_status": "verified",
        "experience_years": 5,
        "is_available": True,
        "current_lat": 28.6145,
        "current_lng": 77.2085,
        "bio_en": "Experienced event server, polite customer etiquette and uniform ready.",
        "bio_hi": "शादी और आयोजनों में सम्मानपूर्वक सेवा।"
    },
    {
        "id": "w-3",
        "name": "Raju Yadav",
        "phone": "+91 94567 89012",
        "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        "primary_trade": "Heavy Shifting Expert",
        "primary_trade_hi": "सामान उठाना",
        "category_id": "shifting",
        "rating": 4.8,
        "reviews_count": 210,
        "hourly_rate": 110.0,
        "daily_rate": 700.0,
        "aadhaar_verified": True,
        "police_verified": True,
        "kyc_status": "verified",
        "experience_years": 8,
        "is_available": True,
        "current_lat": 28.6160,
        "current_lng": 77.2050,
        "bio_en": "Careful household furniture moving, straps & trolley equipped.",
        "bio_hi": "सुरक्षित पैकिंग और लोडिंग विशेषज्ञ।"
    },
    {
        "id": "w-4",
        "name": "Manoj Ansari",
        "phone": "+91 93456 78123",
        "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        "primary_trade": "Textile Master Helper",
        "primary_trade_hi": "टेक्सटाइल हेल्पर",
        "category_id": "textile",
        "rating": 4.7,
        "reviews_count": 84,
        "hourly_rate": 90.0,
        "daily_rate": 600.0,
        "aadhaar_verified": True,
        "police_verified": True,
        "kyc_status": "verified",
        "experience_years": 4,
        "is_available": True,
        "current_lat": 28.6120,
        "current_lng": 77.2110,
        "bio_en": "Precision cloth cutting, roll bundle packing, mill experience.",
        "bio_hi": "कपड़ा मिल और थान कटिंग में दक्ष।"
    }
]

INITIAL_BOOKINGS = [
    # Active booking matching Page 1 mockup
    {
        "id": "b-active-1",
        "booking_number": "WM-2026-042",
        "customer_name": "Ramesh Kumar",
        "customer_phone": "+91 98765 43210",
        "worker_id": "w-1",
        "worker_name": "Mukesh Verma",
        "worker_photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        "worker_rating": 4.8,
        "worker_trade": "Rajmistri (Mason)",
        "worker_trade_hi": "राजमिस्त्री",
        "service_id": "const_mason",
        "service_name_en": "Rajmistri (Masons)",
        "service_name_hi": "राजमिस्त्री (Masons)",
        "task_description": "Brickwork & Wall Plastering in living room renovation",
        "booking_type": "instant",
        "scheduled_date_time": "Today, 1:00 PM",
        "duration_hours": 8,
        "total_cost": 10500.0,
        "commission_amount": 1050.0,
        "worker_payout_amount": 9450.0,
        "otp": "4567",
        "eta_minutes": 15,
        "status": "in_progress",
        "location_address": "Flat 402, Lotus Tower, Sector 14, Noida",
        "lat": 28.6139,
        "lng": 77.2090,
        "worker_lat": 28.6185,
        "worker_lng": 77.2145,
        "created_at": "2026-06-29 12:45:00",
        "completed_at": None,
        "is_rated": False
    },
    # Upcoming scheduled booking
    {
        "id": "b-upcoming-1",
        "booking_number": "WM-2026-043",
        "customer_name": "Ramesh Kumar",
        "customer_phone": "+91 98765 43210",
        "worker_id": "w-4",
        "worker_name": "Manoj Ansari",
        "worker_photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        "worker_rating": 4.7,
        "worker_trade": "Textile Helper",
        "worker_trade_hi": "टेक्सटाइल हेल्पर",
        "service_id": "textile_mill",
        "service_name_en": "Textile Mill Helper",
        "service_name_hi": "कपड़ा मिल हेल्पर",
        "task_description": "Fabric roll sorting and packaging for warehouse dispatch",
        "booking_type": "scheduled",
        "scheduled_date_time": "Tomorrow, 10:00 AM",
        "duration_hours": 4,
        "total_cost": 1800.0,
        "commission_amount": 180.0,
        "worker_payout_amount": 1620.0,
        "otp": "8291",
        "eta_minutes": 60,
        "status": "upcoming",
        "location_address": "Gala No 14, Industrial Area Phase II, Surat",
        "lat": 21.1702,
        "lng": 72.8311,
        "worker_lat": 21.1750,
        "worker_lng": 72.8350,
        "created_at": "2026-06-29 11:20:00",
        "completed_at": None,
        "is_rated": False
    },
    # History booking 1
    {
        "id": "b-history-1",
        "booking_number": "WM-2026-028",
        "customer_name": "Ramesh Kumar",
        "customer_phone": "+91 98765 43210",
        "worker_id": "w-3",
        "worker_name": "Raju Yadav",
        "worker_photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
        "worker_rating": 4.8,
        "worker_trade": "House Shifting Helper",
        "worker_trade_hi": "सामान उठाना",
        "service_id": "shift_pack_load",
        "service_name_en": "Packing & Loading Helper",
        "service_name_hi": "पैकिंग व लोडिंग हेल्पर",
        "task_description": "Moved 2BHK furniture into tempo, loaded safely",
        "booking_type": "instant",
        "scheduled_date_time": "Jun 20, 2026 • 2:30 PM",
        "duration_hours": 4,
        "total_cost": 2400.0,
        "commission_amount": 240.0,
        "worker_payout_amount": 2160.0,
        "otp": "3104",
        "eta_minutes": 0,
        "status": "completed",
        "location_address": "Tower 4, Green View Apartments, Delhi",
        "lat": 28.6139,
        "lng": 77.2090,
        "worker_lat": 28.6139,
        "worker_lng": 77.2090,
        "created_at": "2026-06-20 14:00:00",
        "completed_at": "2026-06-20 18:30:00",
        "is_rated": True
    },
    # History booking 2
    {
        "id": "b-history-2",
        "booking_number": "WM-2026-015",
        "customer_name": "Ramesh Kumar",
        "customer_phone": "+91 98765 43210",
        "worker_id": "w-2",
        "worker_name": "Sunil Kumar Meena",
        "worker_photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        "worker_rating": 4.9,
        "worker_trade": "Catering Serving Captain",
        "worker_trade_hi": "कैटरिंग स्टाफ",
        "service_id": "event_server",
        "service_name_en": "Catering Serving Staff",
        "service_name_hi": "कैटरिंग सर्विंग स्टाफ",
        "task_description": "Family anniversary banquet dinner servers",
        "booking_type": "scheduled",
        "scheduled_date_time": "Jun 12, 2026 • 7:00 PM",
        "duration_hours": 5,
        "total_cost": 3500.0,
        "commission_amount": 350.0,
        "worker_payout_amount": 3150.0,
        "otp": "9921",
        "eta_minutes": 0,
        "status": "completed",
        "location_address": "Community Hall, Indirapuram, Ghaziabad",
        "lat": 28.6380,
        "lng": 77.3620,
        "worker_lat": 28.6380,
        "worker_lng": 77.3620,
        "created_at": "2026-06-12 18:00:00",
        "completed_at": "2026-06-12 23:00:00",
        "is_rated": True
    }
]

INITIAL_WALLET = {
    "balance": 13000.0,
    "currency": "INR",
    "symbol": "₹",
    "upi_verified": "ramesh@okhdfcbank",
    "card_verified": "HDFC Platinum Debit (•••• 4092)",
    "razorpay_connected": True
}

INITIAL_TRANSACTIONS = [
    {
        "id": "tx-1",
        "type": "payout",
        "amount": 10000.0,
        "direction": "debit",
        "title_en": "Wallet Payouts",
        "title_hi": "वॉलेट पेआउट",
        "status": "success",
        "date_str": "Jun 17, 2026",
        "method": "Direct UPI (ramesh@okhdfcbank)",
        "reference_id": "RZP_PAY_991823"
    },
    {
        "id": "tx-2",
        "type": "deposit",
        "amount": 5000.0,
        "direction": "credit",
        "title_en": "Add Money",
        "title_hi": "पैसे जोड़े",
        "status": "success",
        "date_str": "Jun 27, 2026",
        "method": "UPI Gateway (Razorpay)",
        "reference_id": "RZP_DEP_881290"
    },
    {
        "id": "tx-3",
        "type": "payout",
        "amount": 9000.0,
        "direction": "debit",
        "title_en": "Worker Payout",
        "title_hi": "श्रमिक भुगतान",
        "status": "success",
        "date_str": "Jun 29, 2026",
        "method": "Escrow Auto-Release",
        "reference_id": "WM_ESCROW_4412"
    },
    {
        "id": "tx-4",
        "type": "payout",
        "amount": 1100.0,
        "direction": "debit",
        "title_en": "Worker Payouts",
        "title_hi": "श्रमिक भुगतान",
        "status": "success",
        "date_str": "Jun 29, 2026",
        "method": "Overtime Adjustment",
        "reference_id": "WM_PAY_11009"
    }
]

INITIAL_REVIEWS = [
    {
        "id": "rev-1",
        "booking_id": "b-history-1",
        "worker_id": "w-3",
        "worker_name": "Raju Yadav",
        "customer_name": "Ramesh Kumar",
        "rating": 5,
        "tags": ["Punctual", "Careful with glass", "Polite"],
        "comment": "Raju and his team arrived within 15 minutes! Very careful while moving heavy wooden wardrobe and refrigerator.",
        "date_str": "Jun 20, 2026"
    },
    {
        "id": "rev-2",
        "booking_id": "b-history-2",
        "worker_id": "w-2",
        "worker_name": "Sunil Kumar Meena",
        "customer_name": "Vikas Agarwal (Contractor)",
        "rating": 5,
        "tags": ["Neat Uniform", "Quick Service", "Hardworking"],
        "comment": "Excellent catering staff. Handled 150 guests seamlessly with zero delays. Highly recommended!",
        "date_str": "Jun 12, 2026"
    },
    {
        "id": "rev-3",
        "booking_id": "b-history-0",
        "worker_id": "w-1",
        "worker_name": "Mukesh Verma",
        "customer_name": "Pooja Sharma",
        "rating": 5,
        "tags": ["Expert Mason", "Honest Rate", "Clean Work"],
        "comment": "Mukesh ji did perfect brick lining and smooth plastering. Done in 1 day without any mess.",
        "date_str": "May 30, 2026"
    }
]
