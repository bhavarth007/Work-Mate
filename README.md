# WorkMate (वर्कमेट): आपका भरोसेमंद लेबर साथी
### On-Demand Blue-Collar Labour & Services Platform (Python + Flutter)

Built according to the project proposal, business roadmap, and UI mockups in [Photo.pdf](Photo.pdf).

---

## 🌟 Overview & Features

WorkMate is a full-stack on-demand marketplace bridging unorganized blue-collar workers/helpers with customers, contractors, and businesses within 10 to 15 minutes.

### 4 Core Service Categories & 16 Sub-Trades
1. **Construction & Renovation (निर्माण एवं मरम्मत कार्य)**:
   - Rajmistri / Masons (राजमिस्त्री): Brickwork, cement, tiles & wall construction
   - Plumber & Electrician (प्लंबर और इलेक्ट्रीशियन): Sanitary fittings & repairs
   - Painter & Carpenter (पेंटर और कारपेंटर): Wall painting & woodwork
   - Construction Helper (कंस्ट्रक्शन हेल्पर): Sand, gravel & material hauling
2. **Events & Catering (कार्यक्रम एवं कैटरिंग सेवाएं)**:
   - Catering Serving Staff (कैटरिंग सर्विंग स्टाफ): Wedding & banquet waiters
   - Kitchen Helper & Chef (किचन हेल्पर व शेफ): Veg chopping & cooking support
   - Cleaning & Housekeeping (सफाई व हाउसकीपिंग): Pre/post event sanitization
   - Tent & Decoration Labor (टेंट व डेकोरेशन लेबर): Heavy stage & tent rigging
3. **House Shifting & General Labour (घर का सामान व सामान्य मजदूरी)**:
   - Packing & Loading Helper (पैकिंग व लोडिंग): Household goods packing & loading
   - Unloading & Setup (अनलोडिंग व सेटअप): Room placement & unboxing
   - Garden & Deep Cleaning (गार्डन व डीप क्लीनिंग): Farmhouse & terrace cleaning
   - Commercial Loading Labor (कमर्शियल लोडिंग): Truck & freight warehouse unloading
4. **Textile Helper (कपड़ा उद्योग एवं मिल हेल्पर)**:
   - Textile Mill Helper (कपड़ा मिल हेल्पर): Fabric cutting, folding & bundling
   - Quality Checking (क्वालिटी चेकिंग): Thread snipping & finishing check
   - Machine Operator Helper (मशीन ऑपरेटर हेल्पर): Loom & printing support
   - Warehouse & Roll Loading (गोदाम व थान लोडिंग): Heavy cloth bale handling

---

## 📱 4 Core Screens (Matching Page 1 Mockups)
1. **Home Screen (होम)**:
   - Location selector (`Flat 402, Sector 14, Noida`), User greeting (`नमस्ते, रमेश!`), voice search bar (`किसे ढूंढ रहे हैं? राजमिस्त्री...`).
   - 4 Category Cards with ratings (4.8 ★) and Hindi/English subtitles.
   - **Active Booking Card** with Verified Worker Mukesh Verma, ETA: 15 मिनट, Security OTP: 4567, Live GPS tracking button, and Verify & Finish button.
   - Trust banner (`100% सत्यापन | सुरक्षित भुगतान` - UPI, Razorpay, UIDAI).
   - Satisfied customer reviews carousel.
2. **My Bookings Screen (मेरी बुकिंग)**:
   - Upcoming & History tabs, status badges, cost calculation, and live GPS route button.
3. **Payments & Security Screen (भुगतान & सुरक्षा)**:
   - WorkMate Wallet card showing balance (₹13,000), `+ Add Money` and `Payout` buttons.
   - Connected methods (Verified UPI `ramesh@okhdfcbank`, HDFC Platinum Card, Razorpay Secure Badge).
   - Full transaction history ledger with credit/debit filters and status pills.
4. **My Account Screen (मेरा अकाउंट)**:
   - Profile Header (Ramesh, Verified badge).
   - Instant bilingual Hindi/English switch.
   - Micro-Insurance enrollment card (₹2,00,000 accidental cover).
   - Worker Partner KYC Onboarding modal (12-digit Aadhaar validation).
   - 24/7 Call and WhatsApp support helpdesk.

---

## 🛠️ Architecture & Tech Stack

```
c:\Work Mate\
├── backend/
│   ├── app.py                # FastAPI server, REST routes & static client mount
│   ├── models.py             # Pydantic schemas (Categories, Services, Bookings, Wallet, Reviews)
│   ├── database.py           # SQLite persistence layer with thread-safe CRUD operations
│   ├── seed_data.py          # Initial seed dataset matching Photo.pdf mockups
│   └── requirements.txt      # Python dependencies (fastapi, uvicorn, pydantic, httpx)
├── web_app/                  # Responsive Web & Mobile Interactive App
│   ├── index.html            # High-fidelity UI matching Page 1 mockups
│   ├── css/style.css         # Modern design system, mobile phone frame & desktop toggle
│   └── js/
│       ├── app.js            # Frontend application logic, bilingual i18n & zero-error validations
│       ├── tracking.js       # Live canvas GPS route tracking with animated worker & ETA countdown
│       └── wallet.js         # Razorpay & UPI wallet deposit & payout simulator
├── flutter_app/              # Complete Cross-Platform Flutter Codebase
│   ├── pubspec.yaml          # Flutter dependencies
│   ├── lib/
│   │   ├── main.dart         # Flutter entry point with WorkMate theme & bottom navigation
│   │   ├── models/           # Dart data models (service, worker, booking, wallet)
│   │   ├── services/         # HTTP API client connected to FastAPI
│   │   ├── state/            # WorkMateProvider for reactive state management
│   │   └── screens/          # Home, Bookings, Wallet, Account & Live Tracking screens
│   └── web/index.html        # Flutter Web entry point
├── tests/
│   └── test_api.py           # Comprehensive automated test suite (10/10 tests passed)
├── start_workmate.bat        # 1-click startup launcher
└── README.md                 # Complete documentation
```

---

## 🚀 How to Run

### Option 1: 1-Click Startup (Recommended)
Double-click `start_workmate.bat` in File Explorer, or run in terminal:
```powershell
.\start_workmate.bat
```
This will start the backend server on `http://127.0.0.1:8000` and automatically open your default browser.

### Option 2: Running the Python Backend Manually
```powershell
python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000 --reload
```
- Interactive Web & Mobile App: Open [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Swagger / OpenAPI Docs: Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Option 3: Running Automated Tests
```powershell
python tests/test_api.py
```

### Option 4: Running the Flutter App
When the Flutter SDK is installed:
```bash
cd flutter_app
flutter pub get
flutter run -d chrome      # Run in Chrome Web
# or
flutter run               # Run on connected Android / iOS device
```
