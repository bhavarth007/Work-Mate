"""
WorkMate FastAPI Application Server
REST API for On-Demand Blue-Collar Labour Platform with Web Client Serving.
"""
import os
import math
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from .models import (
    Category, Service, Worker, Booking, BookingCreate,
    OTPVerifyRequest, BookingStatusUpdateRequest,
    WalletTransaction, WalletDepositRequest, WalletPayoutRequest,
    WorkerOnboardRequest, ReviewCreate, Review, UserProfileUpdate,
    AuthLoginRequest, ServiceRateUpdate
)
from .database import (
    init_db, get_categories, get_services, get_service_by_id,
    get_workers, get_worker_by_id, create_worker,
    get_bookings, get_booking_by_id, create_booking,
    update_booking_status, verify_booking_otp,
    get_wallet, deposit_wallet, payout_wallet,
    get_transactions, get_reviews, create_review,
    get_user_profile, update_user_profile,
    update_service_rate, get_admin_banks, switch_primary_bank,
    get_admin_financial_stats, get_system_config, set_platform_charge_percent
)

# Initialize database schema and seeds
init_db()

app = FastAPI(
    title="WorkMate (वर्कमेट) API",
    description="Backend REST API for On-Demand Blue-Collar Labour & Services Platform",
    version="1.0.0"
)

# Enable CORS for Flutter Web, Flutter Mobile, and local testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Core Health & Stats ----------------- #

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "WorkMate API",
        "version": "1.0.0",
        "platform": "On-Demand Blue-Collar Labour Platform"
    }

@app.get("/api/firebase/status")
def firebase_status():
    from .firebase_config import FIREBASE_PROJECT_ID, get_firebase_credentials_path, is_firebase_ready
    key_path = get_firebase_credentials_path()
    return {
        "firebase_project_id": FIREBASE_PROJECT_ID,
        "credentials_found": key_path is not None,
        "credentials_path": os.path.basename(key_path) if key_path else None,
        "firestore_connected": is_firebase_ready(),
        "instruction": "Download serviceAccountKey.json from Firebase Console -> Project Settings -> Service accounts and place it in backend/ directory."
    }

@app.get("/api/stats")
def get_stats():
    workers = get_workers()
    bookings = get_bookings()
    wallet = get_wallet()
    active_jobs = [b for b in bookings if b["status"] in ["in_progress", "upcoming"]]
    completed_jobs = [b for b in bookings if b["status"] == "completed"]

    return {
        "total_workers": len(workers),
        "verified_workers": len([w for w in workers if w.get("kyc_status") == "verified"]),
        "active_bookings": len(active_jobs),
        "completed_bookings": len(completed_jobs),
        "wallet_balance": wallet["balance"],
        "customer_rating_average": 4.8
    }

# ----------------- Categories & Services ----------------- #

@app.get("/api/categories", response_model=List[Category])
def list_categories():
    return get_categories()

@app.get("/api/services", response_model=List[Service])
def list_services(category_id: Optional[str] = None):
    return get_services(category_id)

@app.get("/api/services/{service_id}", response_model=Service)
def get_single_service(service_id: str):
    s = get_service_by_id(service_id)
    if not s:
        raise HTTPException(status_code=404, detail="Service not found")
    return s

# ----------------- Workers & Onboarding ----------------- #

@app.get("/api/workers", response_model=List[Worker])
def list_workers(category_id: Optional[str] = None, available_only: bool = False):
    return get_workers(category_id, available_only)

@app.get("/api/workers/{worker_id}", response_model=Worker)
def get_single_worker(worker_id: str):
    w = get_worker_by_id(worker_id)
    if not w:
        raise HTTPException(status_code=404, detail="Worker not found")
    return w

@app.post("/api/workers/onboard", status_code=status.HTTP_201_CREATED)
def onboard_worker(payload: WorkerOnboardRequest):
    # Phase 1: On-Boarding & Aadhaar KYC Verification
    clean_aadhaar = payload.aadhaar_number.replace(" ", "").replace("-", "")
    if len(clean_aadhaar) != 12 or not clean_aadhaar.isdigit():
        raise HTTPException(
            status_code=400,
            detail="Aadhaar must be a valid 12-digit number (e.g. 1234 5678 9012)"
        )

    # Category matching
    cat_id = payload.category_id
    if not cat_id or cat_id not in ["construction", "events", "shifting", "textile"]:
        cat_id = "construction"

    worker_dict = {
        "name": payload.name,
        "phone": payload.phone,
        "primary_trade": payload.primary_trade,
        "category_id": cat_id,
        "daily_rate": payload.daily_rate,
        "experience_years": payload.experience_years,
        "police_check_consent": payload.police_check_consent,
        "city": payload.city
    }

    created = create_worker(worker_dict)
    return {
        "success": True,
        "message": "Worker successfully registered and KYC verified!",
        "worker": created
    }

# ----------------- Customer Bookings & Dispatch ----------------- #

@app.get("/api/bookings", response_model=List[Booking])
def list_bookings(status_filter: Optional[str] = None):
    return get_bookings(status_filter)

@app.get("/api/bookings/{booking_id}", response_model=Booking)
def get_single_booking(booking_id: str):
    b = get_booking_by_id(booking_id)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    return b

@app.post("/api/bookings", status_code=status.HTTP_201_CREATED)
def place_booking(payload: BookingCreate):
    # Phase 2 & Phase 3: Booking creation and worker dispatch
    new_booking = create_booking(payload.model_dump())
    return {
        "success": True,
        "message": f"Booking {new_booking['booking_number']} placed successfully!",
        "booking": new_booking
    }

@app.post("/api/bookings/{booking_id}/verify-otp")
def verify_otp(booking_id: str, payload: OTPVerifyRequest):
    # Phase 3: OTP Handshake upon worker arrival
    result = verify_booking_otp(booking_id, payload.otp)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result

@app.post("/api/bookings/{booking_id}/complete")
def complete_job(booking_id: str):
    # Phase 4: Job Completion & Escrow Payout release
    b = get_booking_by_id(booking_id)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    updated = update_booking_status(booking_id, "completed")
    return {
        "success": True,
        "message": f"Work confirmed completed! Worker payout of ₹{b['worker_payout_amount']} processed.",
        "booking": updated
    }

@app.post("/api/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: str):
    b = get_booking_by_id(booking_id)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    updated = update_booking_status(booking_id, "cancelled")
    return {
        "success": True,
        "message": "Booking cancelled successfully.",
        "booking": updated
    }

@app.get("/api/tracking/{booking_id}")
def get_tracking_coordinates(booking_id: str):
    """Simulates live movement of worker towards customer location."""
    b = get_booking_by_id(booking_id)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Coordinates
    cust_lat = b.get("lat", 28.6139)
    cust_lng = b.get("lng", 77.2090)
    worker_lat = b.get("worker_lat", 28.6180)
    worker_lng = b.get("worker_lng", 77.2140)

    # Approximate distance in meters
    d_lat = (cust_lat - worker_lat) * 111000
    d_lng = (cust_lng - worker_lng) * 111000 * math.cos(math.radians(cust_lat))
    dist_meters = math.sqrt(d_lat**2 + d_lng**2)
    eta_mins = max(2, int(dist_meters / 300))  # approx speed 18 km/h in city traffic

    return {
        "booking_id": booking_id,
        "booking_number": b["booking_number"],
        "status": b["status"],
        "worker_name": b["worker_name"],
        "worker_phone": "+91 98234 11092",
        "worker_photo": b["worker_photo"],
        "worker_rating": b["worker_rating"],
        "otp": b["otp"],
        "customer_location": {
            "address": b["location_address"],
            "lat": cust_lat,
            "lng": cust_lng
        },
        "worker_location": {
            "lat": worker_lat,
            "lng": worker_lng
        },
        "distance_meters": round(dist_meters, 0),
        "eta_minutes": b.get("eta_minutes", eta_mins) if b["status"] != "completed" else 0
    }

# ----------------- Wallet & Payments (Phase 4) ----------------- #

@app.get("/api/wallet")
def view_wallet():
    return get_wallet()

@app.post("/api/wallet/deposit")
def add_funds(payload: WalletDepositRequest):
    # Simulated Razorpay/UPI wallet top-up
    res = deposit_wallet(payload.amount, payload.method, payload.upi_id or "ramesh@okhdfcbank")
    return {
        "success": True,
        "message": f"Successfully added ₹{payload.amount:,.2f} to WorkMate Wallet via {payload.method}",
        "data": res
    }

@app.post("/api/wallet/payout")
def request_payout(payload: WalletPayoutRequest):
    # Simulated direct worker/customer bank payout
    res = payout_wallet(payload.amount, payload.upi_id)
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("message"))
    return {
        "success": True,
        "message": f"Instant payout of ₹{payload.amount:,.2f} transferred to {payload.upi_id}",
        "data": res
    }

@app.get("/api/wallet/transactions")
def list_transactions():
    return get_transactions()

# ----------------- Reviews & Feedback ----------------- #

@app.get("/api/reviews", response_model=List[Review])
def list_reviews():
    return get_reviews()

@app.post("/api/reviews", status_code=status.HTTP_201_CREATED)
def submit_review(payload: ReviewCreate):
    result = create_review(payload.model_dump())
    return {
        "success": True,
        "message": "Thank you for your rating! Feedback recorded.",
        "data": result
    }

# ----------------- User Profile Management ----------------- #

@app.get("/api/user/profile")
def view_profile(user_id: Optional[str] = None):
    return get_user_profile(user_id)

@app.put("/api/user/profile")
def edit_profile(payload: UserProfileUpdate, user_id: Optional[str] = None):
    uid = user_id or "u-1"
    updated = update_user_profile(
        name=payload.name,
        phone=payload.phone,
        address=payload.address,
        city=payload.city,
        email=payload.email,
        user_id=uid
    )
    return {
        "success": True,
        "message": "Profile updated successfully!",
        "profile": updated
    }

# ----------------- Auth & Session Management ----------------- #

@app.post("/api/auth/login")
def login(payload: AuthLoginRequest):
    ident = payload.identifier.strip().lower()
    valid_admins = ["admin", "admin@workmate.in", "bhavarthhapani7@gmail.com"]
    if payload.role == "admin" or ident in valid_admins:
        # Admin authentication
        if ident in valid_admins and payload.password == "admin123":
            admin_prof = get_user_profile("admin-1")
            return {
                "success": True,
                "token": "wm_admin_sec_token_9901",
                "role": "admin",
                "user": admin_prof
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Admin ID or Password. (Default: admin / admin123)"
            )
    else:
        # Customer Phone login
        profile = get_user_profile("u-1")
        return {
            "success": True,
            "token": "wm_cust_sec_token_4402",
            "role": "customer",
            "user": profile
        }

# ----------------- Platform Configuration ----------------- #

@app.get("/api/admin/config")
def get_config():
    return get_system_config()

@app.put("/api/admin/config/platform-charge")
def set_platform_charge(payload: Dict[str, Any]):
    val = float(payload.get("percent", 10.0))
    if val < 0 or val > 50:
        raise HTTPException(status_code=400, detail="Percentage must be between 0% and 50%")
    saved = set_platform_charge_percent(val)
    return {
        "success": True,
        "message": f"Platform Charge updated to {saved}%",
        "platform_charge_percent": saved
    }

# ----------------- Admin Service Rate & Bank Routing ----------------- #

@app.put("/api/services/{service_id}/rate")
def admin_update_rate(service_id: str, payload: ServiceRateUpdate):
    updated = update_service_rate(service_id, payload.base_rate)
    if not updated:
        raise HTTPException(status_code=404, detail="Service not found")
    return {
        "success": True,
        "message": f"Updated {updated['name_en']} base rate to ₹{payload.base_rate:,.2f}",
        "service": updated
    }

@app.get("/api/admin/banks")
def admin_list_banks():
    return get_admin_banks()

@app.post("/api/admin/banks/{bank_id}/switch")
def admin_switch_bank(bank_id: str):
    updated_banks = switch_primary_bank(bank_id)
    return {
        "success": True,
        "message": "Primary settlement bank account switched successfully! Failover standby engaged.",
        "banks": updated_banks
    }

@app.get("/api/admin/financial-stats")
def admin_financial_stats():
    return get_admin_financial_stats()

# ----------------- Static Web Client Mount ----------------- #

WEB_APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "web_app"))

if os.path.isdir(WEB_APP_DIR):
    app.mount("/static", StaticFiles(directory=WEB_APP_DIR), name="static")

    @app.get("/")
    def serve_frontend_root():
        index_file = os.path.join(WEB_APP_DIR, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "WorkMate Web App index.html not yet created."}

    # Also handle route fallbacks for SPA
    @app.get("/bookings")
    @app.get("/payments")
    @app.get("/account")
    def serve_frontend_routes():
        return FileResponse(os.path.join(WEB_APP_DIR, "index.html"))
