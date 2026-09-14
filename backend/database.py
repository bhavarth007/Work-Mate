"""
WorkMate Database Persistence Layer
SQLite storage with thread-safe access and robust validation.
"""
import sqlite3
import json
import os
import threading
import uuid
import re
import random
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_FILE = os.path.join(os.path.dirname(__file__), "workmate.db")
_lock = threading.Lock()

def get_connection():
    conn = sqlite3.connect(DB_FILE, check_same_thread=False, timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema and seeds initial data if empty."""
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()

        # Categories
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                name_en TEXT NOT NULL,
                name_hi TEXT NOT NULL,
                subtext_en TEXT,
                subtext_hi TEXT,
                icon TEXT,
                rating REAL DEFAULT 4.8,
                services_count INTEGER DEFAULT 4
            )
        """)

        # Services
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS services (
                id TEXT PRIMARY KEY,
                category_id TEXT NOT NULL,
                name_en TEXT NOT NULL,
                name_hi TEXT NOT NULL,
                desc_en TEXT,
                desc_hi TEXT,
                base_rate REAL NOT NULL,
                unit TEXT NOT NULL,
                popular INTEGER DEFAULT 0,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )
        """)

        # Workers
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS workers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                photo TEXT,
                primary_trade TEXT NOT NULL,
                primary_trade_hi TEXT NOT NULL,
                category_id TEXT NOT NULL,
                rating REAL DEFAULT 4.8,
                reviews_count INTEGER DEFAULT 0,
                hourly_rate REAL NOT NULL,
                daily_rate REAL NOT NULL,
                aadhaar_verified INTEGER DEFAULT 1,
                police_verified INTEGER DEFAULT 1,
                kyc_status TEXT DEFAULT 'verified',
                experience_years INTEGER DEFAULT 3,
                is_available INTEGER DEFAULT 1,
                current_lat REAL DEFAULT 28.6139,
                current_lng REAL DEFAULT 77.2090,
                bio_en TEXT,
                bio_hi TEXT
            )
        """)

        # Bookings
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id TEXT PRIMARY KEY,
                booking_number TEXT UNIQUE NOT NULL,
                customer_name TEXT NOT NULL,
                customer_phone TEXT NOT NULL,
                worker_id TEXT,
                worker_name TEXT,
                worker_photo TEXT,
                worker_rating REAL DEFAULT 4.8,
                worker_trade TEXT,
                worker_trade_hi TEXT,
                service_id TEXT NOT NULL,
                service_name_en TEXT NOT NULL,
                service_name_hi TEXT NOT NULL,
                task_description TEXT NOT NULL,
                booking_type TEXT NOT NULL,
                scheduled_date_time TEXT NOT NULL,
                duration_hours INTEGER DEFAULT 4,
                total_cost REAL NOT NULL,
                commission_amount REAL NOT NULL,
                worker_payout_amount REAL NOT NULL,
                otp TEXT NOT NULL,
                eta_minutes INTEGER DEFAULT 15,
                status TEXT NOT NULL,
                location_address TEXT NOT NULL,
                lat REAL NOT NULL,
                lng REAL NOT NULL,
                worker_lat REAL NOT NULL,
                worker_lng REAL NOT NULL,
                created_at TEXT NOT NULL,
                completed_at TEXT,
                is_rated INTEGER DEFAULT 0
            )
        """)

        # Wallet
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS wallet (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                balance REAL DEFAULT 13000.0,
                currency TEXT DEFAULT 'INR',
                symbol TEXT DEFAULT '₹',
                upi_verified TEXT DEFAULT 'ramesh@okhdfcbank',
                card_verified TEXT DEFAULT 'HDFC Platinum Debit (•••• 4092)',
                razorpay_connected INTEGER DEFAULT 1
            )
        """)

        # Transactions
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                amount REAL NOT NULL,
                direction TEXT NOT NULL,
                title_en TEXT NOT NULL,
                title_hi TEXT NOT NULL,
                status TEXT DEFAULT 'success',
                date_str TEXT NOT NULL,
                method TEXT NOT NULL,
                reference_id TEXT NOT NULL
            )
        """)

        # Reviews
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS reviews (
                id TEXT PRIMARY KEY,
                booking_id TEXT NOT NULL,
                worker_id TEXT NOT NULL,
                worker_name TEXT NOT NULL,
                customer_name TEXT NOT NULL,
                rating INTEGER NOT NULL,
                tags_json TEXT,
                comment TEXT,
                date_str TEXT NOT NULL
            )
        """)

        # Users Profile (Editable vs Read-Only Fields)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                email TEXT,
                address TEXT NOT NULL,
                city TEXT NOT NULL,
                photo TEXT,
                aadhaar_masked TEXT DEFAULT '•••• •••• 9012',
                member_id TEXT DEFAULT 'WM-USER-89104',
                account_type TEXT DEFAULT 'Customer Premium',
                joined_date TEXT DEFAULT 'September 14, 2026',
                trust_score REAL DEFAULT 4.9,
                kyc_status TEXT DEFAULT 'verified',
                password TEXT DEFAULT '123456',
                role TEXT DEFAULT 'customer'
            )
        """)

        cursor.execute("""
            INSERT OR IGNORE INTO users (
                id, name, phone, email, address, city, photo,
                aadhaar_masked, member_id, account_type, joined_date, trust_score, kyc_status
            ) VALUES (
                'u-1', 'Ramesh Kumar', '+91 98765 43210', 'ramesh.kumar@workmate.in',
                'Flat 402, Lotus Tower, Sector 14', 'Noida, Uttar Pradesh',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
                '•••• •••• 9012', 'WM-USER-89104', 'Customer Premium', 'September 14, 2026', 4.9, 'verified'
            )
        """)

        # System Administrator Profile (bhavarthhapani7@gmail.com / 7878193644)
        cursor.execute("""
            INSERT OR IGNORE INTO users (
                id, name, phone, email, address, city, photo,
                aadhaar_masked, member_id, account_type, joined_date, trust_score, kyc_status
            ) VALUES (
                'admin-1', 'admin', '7878193644', 'bhavarthhapani7@gmail.com',
                '', '',
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
                '', 'WM-ADMIN-001', 'System Administrator', 'September 14, 2026', 5.0, 'verified'
            )
        """)

        # Column migration for password and role
        user_cols = [c[1] for c in cursor.execute("PRAGMA table_info(users)").fetchall()]
        if "password" not in user_cols:
            cursor.execute("ALTER TABLE users ADD COLUMN password TEXT DEFAULT '123456'")
        if "role" not in user_cols:
            cursor.execute("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'customer'")

        # Ensure admin account has role admin and password
        cursor.execute("""
            UPDATE users
            SET role = 'admin', password = COALESCE(NULLIF(password, ''), 'admin123')
            WHERE id = 'admin-1' OR phone = '7878193644' OR name = 'admin'
        """)

        # Ensure customer u-1 has password
        cursor.execute("""
            UPDATE users
            SET role = 'customer', password = COALESCE(NULLIF(password, ''), '123456')
            WHERE id = 'u-1'
        """)

        # Sync joined_date for active accounts to accurate launch date
        cursor.execute("""
            UPDATE users
            SET joined_date = 'September 14, 2026'
            WHERE joined_date LIKE '%January%' OR joined_date IS NULL OR joined_date = ''
        """)

        # System Configuration Table (e.g. Configurable Platform Charge % - Default 10%)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS system_config (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            )
        """)
        cursor.execute("""
            INSERT OR IGNORE INTO system_config (key, value)
            VALUES ('platform_charge_percent', '10.0')
        """)

        # Admin Multi-Bank Routing & Auto-Failover Accounts
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admin_banks (
                id TEXT PRIMARY KEY,
                bank_name TEXT NOT NULL,
                account_masked TEXT NOT NULL,
                ifsc TEXT NOT NULL,
                upi_id TEXT NOT NULL,
                account_holder TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                is_primary INTEGER DEFAULT 0,
                status TEXT DEFAULT 'STANDBY',
                failure_count INTEGER DEFAULT 0,
                total_routed_inr REAL DEFAULT 0.0
            )
        """)

        # Seed 3 Admin Bank Accounts for Failover Protection
        cursor.execute("""
            INSERT OR IGNORE INTO admin_banks (id, bank_name, account_masked, ifsc, upi_id, account_holder, is_active, is_primary, status, failure_count, total_routed_inr)
            VALUES 
            ('bank-1', 'HDFC Bank (Primary Gateway)', '•••• 8819', 'HDFC0001234', 'workmate.admin@hdfcbank', 'WorkMate India Tech Pvt Ltd', 1, 1, 'ACTIVE', 0, 184500.0),
            ('bank-2', 'ICICI Bank (Instant Failover Backup 1)', '•••• 4412', 'ICIC0005678', 'workmate.payout@icici', 'WorkMate Escrow Reserves', 1, 0, 'STANDBY', 0, 92000.0),
            ('bank-3', 'State Bank of India (Secondary Backup 2)', '•••• 9931', 'SBIN0009876', 'workmate.reserve@sbi', 'WorkMate National Settlement', 1, 0, 'STANDBY', 0, 45000.0)
        """)

        conn.commit()

        # Check if seeder is needed
        cursor.execute("SELECT COUNT(*) FROM categories")
        if cursor.fetchone()[0] == 0:
            from .seed_data import (
                INITIAL_CATEGORIES, INITIAL_SERVICES, INITIAL_WORKERS,
                INITIAL_BOOKINGS, INITIAL_WALLET, INITIAL_TRANSACTIONS, INITIAL_REVIEWS
            )

            # Insert categories
            for c in INITIAL_CATEGORIES:
                cursor.execute("""
                    INSERT INTO categories (id, name_en, name_hi, subtext_en, subtext_hi, icon, rating, services_count)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (c["id"], c["name_en"], c["name_hi"], c["subtext_en"], c["subtext_hi"], c["icon"], c["rating"], c["services_count"]))

            # Insert services
            for s in INITIAL_SERVICES:
                cursor.execute("""
                    INSERT INTO services (id, category_id, name_en, name_hi, desc_en, desc_hi, base_rate, unit, popular)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (s["id"], s["category_id"], s["name_en"], s["name_hi"], s["desc_en"], s["desc_hi"], s["base_rate"], s["unit"], 1 if s.get("popular") else 0))

            # Insert workers
            for w in INITIAL_WORKERS:
                cursor.execute("""
                    INSERT INTO workers (id, name, phone, photo, primary_trade, primary_trade_hi, category_id, rating, reviews_count, hourly_rate, daily_rate, aadhaar_verified, police_verified, kyc_status, experience_years, is_available, current_lat, current_lng, bio_en, bio_hi)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (w["id"], w["name"], w["phone"], w["photo"], w["primary_trade"], w["primary_trade_hi"], w["category_id"], w["rating"], w["reviews_count"], w["hourly_rate"], w["daily_rate"], 1 if w["aadhaar_verified"] else 0, 1 if w["police_verified"] else 0, w["kyc_status"], w["experience_years"], 1 if w["is_available"] else 0, w["current_lat"], w["current_lng"], w.get("bio_en"), w.get("bio_hi")))

            # Insert wallet
            cursor.execute("""
                INSERT OR REPLACE INTO wallet (id, balance, currency, symbol, upi_verified, card_verified, razorpay_connected)
                VALUES (1, ?, ?, ?, ?, ?, ?)
            """, (INITIAL_WALLET["balance"], INITIAL_WALLET["currency"], INITIAL_WALLET["symbol"], INITIAL_WALLET["upi_verified"], INITIAL_WALLET["card_verified"], 1 if INITIAL_WALLET["razorpay_connected"] else 0))

            # Insert transactions
            for tx in INITIAL_TRANSACTIONS:
                cursor.execute("""
                    INSERT INTO transactions (id, type, amount, direction, title_en, title_hi, status, date_str, method, reference_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (tx["id"], tx["type"], tx["amount"], tx["direction"], tx["title_en"], tx["title_hi"], tx["status"], tx["date_str"], tx["method"], tx["reference_id"]))

            # Insert bookings
            for b in INITIAL_BOOKINGS:
                cursor.execute("""
                    INSERT INTO bookings (id, booking_number, customer_name, customer_phone, worker_id, worker_name, worker_photo, worker_rating, worker_trade, worker_trade_hi, service_id, service_name_en, service_name_hi, task_description, booking_type, scheduled_date_time, duration_hours, total_cost, commission_amount, worker_payout_amount, otp, eta_minutes, status, location_address, lat, lng, worker_lat, worker_lng, created_at, completed_at, is_rated)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (b["id"], b["booking_number"], b["customer_name"], b["customer_phone"], b["worker_id"], b["worker_name"], b["worker_photo"], b["worker_rating"], b["worker_trade"], b["worker_trade_hi"], b["service_id"], b["service_name_en"], b["service_name_hi"], b["task_description"], b["booking_type"], b["scheduled_date_time"], b["duration_hours"], b["total_cost"], b["commission_amount"], b["worker_payout_amount"], b["otp"], b["eta_minutes"], b["status"], b["location_address"], b["lat"], b["lng"], b["worker_lat"], b["worker_lng"], b["created_at"], b["completed_at"], 1 if b["is_rated"] else 0))

            # Insert reviews
            for r in INITIAL_REVIEWS:
                cursor.execute("""
                    INSERT INTO reviews (id, booking_id, worker_id, worker_name, customer_name, rating, tags_json, comment, date_str)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (r["id"], r["booking_id"], r["worker_id"], r["worker_name"], r["customer_name"], r["rating"], json.dumps(r["tags"]), r["comment"], r["date_str"]))

            conn.commit()

        conn.close()

# Repository Operations

def get_categories() -> List[Dict[str, Any]]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM categories ORDER BY id").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_services(category_id: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    if category_id:
        rows = conn.execute("SELECT * FROM services WHERE category_id = ? ORDER BY popular DESC, name_en", (category_id,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM services ORDER BY category_id, popular DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_service_by_id(service_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    row = conn.execute("SELECT * FROM services WHERE id = ?", (service_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def get_workers(category_id: Optional[str] = None, available_only: bool = False) -> List[Dict[str, Any]]:
    conn = get_connection()
    query = "SELECT * FROM workers WHERE 1=1"
    params = []
    if category_id:
        query += " AND category_id = ?"
        params.append(category_id)
    if available_only:
        query += " AND is_available = 1"
    query += " ORDER BY rating DESC, reviews_count DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_worker_by_id(worker_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    row = conn.execute("SELECT * FROM workers WHERE id = ?", (worker_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def create_worker(worker_data: Dict[str, Any]) -> Dict[str, Any]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        worker_id = f"w-{uuid.uuid4().hex[:6]}"
        cursor.execute("""
            INSERT INTO workers (
                id, name, phone, photo, primary_trade, primary_trade_hi, category_id,
                rating, reviews_count, hourly_rate, daily_rate, aadhaar_verified,
                police_verified, kyc_status, experience_years, is_available,
                current_lat, current_lng, bio_en, bio_hi
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            worker_id,
            worker_data["name"],
            worker_data["phone"],
            worker_data.get("photo") or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
            worker_data["primary_trade"],
            worker_data.get("primary_trade_hi") or worker_data["primary_trade"],
            worker_data["category_id"],
            5.0,  # New worker starts with top rating
            0,
            round(worker_data["daily_rate"] / 8.0, 2),
            worker_data["daily_rate"],
            1,  # Verified KYC
            1 if worker_data.get("police_check_consent") else 0,
            "verified",
            worker_data.get("experience_years", 2),
            1,
            28.6139,
            77.2090,
            f"Verified professional in {worker_data['primary_trade']}",
            f"{worker_data['primary_trade']} में सत्यापित कारीगर"
        ))
        conn.commit()
        created = get_worker_by_id(worker_id)
        conn.close()
        return created

def get_bookings(status: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_connection()
    if status:
        rows = conn.execute("SELECT * FROM bookings WHERE status = ? ORDER BY created_at DESC", (status,)).fetchall()
    else:
        rows = conn.execute("SELECT * FROM bookings ORDER BY CASE status WHEN 'in_progress' THEN 1 WHEN 'upcoming' THEN 2 WHEN 'completed' THEN 3 ELSE 4 END, created_at DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_booking_by_id(booking_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    row = conn.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def create_booking(data: Dict[str, Any]) -> Dict[str, Any]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        
        booking_id = f"b-{uuid.uuid4().hex[:8]}"
        # Generate booking number format like WM-2026-049
        cursor.execute("SELECT COUNT(*) FROM bookings")
        cnt = cursor.fetchone()[0] + 50
        booking_number = f"WM-2026-{cnt:03d}"

        # Fetch service details
        service = get_service_by_id(data["service_id"])
        if not service:
            service = {
                "name_en": "General Skilled Labour",
                "name_hi": "कुशल लेबर",
                "base_rate": 600.0,
                "category_id": "construction"
            }

        # Dynamic worker matching algorithm (Phase 3 of Photo.pdf)
        cursor.execute("""
            SELECT * FROM workers 
            WHERE category_id = ? AND is_available = 1 
            ORDER BY rating DESC LIMIT 1
        """, (service.get("category_id", "construction"),))
        matched_worker = cursor.fetchone()

        if matched_worker:
            worker_dict = dict(matched_worker)
            worker_id = worker_dict["id"]
            worker_name = worker_dict["name"]
            worker_photo = worker_dict["photo"]
            worker_rating = worker_dict["rating"]
            worker_trade = worker_dict["primary_trade"]
            worker_trade_hi = worker_dict["primary_trade_hi"]
            worker_lat = worker_dict["current_lat"]
            worker_lng = worker_dict["current_lng"]
            # Mark worker temporarily busy
            cursor.execute("UPDATE workers SET is_available = 0 WHERE id = ?", (worker_id,))
        else:
            # Fallback assigned worker
            worker_id = "w-1"
            worker_name = "Mukesh Verma"
            worker_photo = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            worker_rating = 4.8
            worker_trade = "Rajmistri (Mason)"
            worker_trade_hi = "राजमिस्त्री"
            worker_lat = 28.6180
            worker_lng = 77.2140

        duration = data.get("duration_hours", 4)
        base_rate = service.get("base_rate", 600.0)
        # Cost calculation: Rate * (hours/8 if daily, or hours * hourly rate)
        subtotal = round(base_rate * (duration / 8.0 if duration >= 8 else duration / 4.0), 2)
        # 10% WorkMate commission per booking (from Photo.pdf)
        commission = round(subtotal * 0.10, 2)
        # Emergency charge if instant (<30 min dispatch)
        emergency_charge = 150.0 if data.get("booking_type") == "instant" else 0.0
        total_cost = subtotal + emergency_charge
        worker_payout = subtotal - commission

        import random
        otp = f"{random.randint(1000, 9999)}"
        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        status = "in_progress" if data.get("booking_type") == "instant" else "upcoming"

        scheduled_text = (
            "Right Now (15 Min Instant Arrival)"
            if data.get("booking_type") == "instant"
            else f"{data.get('scheduled_date', 'Today')}, {data.get('scheduled_time', '10:00 AM')}"
        )

        cursor.execute("""
            INSERT INTO bookings (
                id, booking_number, customer_name, customer_phone, worker_id, worker_name,
                worker_photo, worker_rating, worker_trade, worker_trade_hi, service_id,
                service_name_en, service_name_hi, task_description, booking_type,
                scheduled_date_time, duration_hours, total_cost, commission_amount,
                worker_payout_amount, otp, eta_minutes, status, location_address,
                lat, lng, worker_lat, worker_lng, created_at, completed_at, is_rated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            booking_id, booking_number, data.get("customer_name", "Ramesh Kumar"),
            data.get("customer_phone", "+91 98765 43210"), worker_id, worker_name,
            worker_photo, worker_rating, worker_trade, worker_trade_hi,
            service["id"], service["name_en"], service["name_hi"],
            data["task_description"], data.get("booking_type", "instant"),
            scheduled_text, duration, total_cost, commission, worker_payout,
            otp, 15 if data.get("booking_type") == "instant" else 60,
            status, data.get("location_address", "Flat 402, Sector 14, Noida"),
            data.get("lat", 28.6139), data.get("lng", 77.2090),
            worker_lat, worker_lng, created_at, None, 0
        ))

        # Add escrow transaction
        tx_id = f"tx-{uuid.uuid4().hex[:6]}"
        cursor.execute("""
            INSERT INTO transactions (id, type, amount, direction, title_en, title_hi, status, date_str, method, reference_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tx_id, "payment", total_cost, "debit",
            f"Booking #{booking_number}", f"बुकिंग #{booking_number}",
            "success", datetime.now().strftime("%b %d, %Y"),
            "WorkMate Wallet / Escrow", f"ESCROW_{booking_id[:6].upper()}"
        ))

        conn.commit()
        new_booking = get_booking_by_id(booking_id)
        conn.close()
        return new_booking

def update_booking_status(booking_id: str, new_status: str) -> Optional[Dict[str, Any]]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        completed_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S") if new_status == "completed" else None
        
        cursor.execute("""
            UPDATE bookings 
            SET status = ?, completed_at = COALESCE(?, completed_at)
            WHERE id = ?
        """, (new_status, completed_at, booking_id))
        
        # If completed, free up the worker and trigger direct worker payout
        if new_status == "completed":
            booking = get_booking_by_id(booking_id)
            if booking and booking["worker_id"]:
                cursor.execute("UPDATE workers SET is_available = 1 WHERE id = ?", (booking["worker_id"],))
                # Add worker payout transaction record
                tx_id = f"tx-{uuid.uuid4().hex[:6]}"
                cursor.execute("""
                    INSERT INTO transactions (id, type, amount, direction, title_en, title_hi, status, date_str, method, reference_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    tx_id, "payout", booking["worker_payout_amount"], "debit",
                    f"Worker Payout: {booking['worker_name']}",
                    f"श्रमिक भुगतान: {booking['worker_name']}",
                    "success", datetime.now().strftime("%b %d, %Y"),
                    "Direct UPI Payout", f"WM_PAY_{uuid.uuid4().hex[:6].upper()}"
                ))

        conn.commit()
        updated = get_booking_by_id(booking_id)
        conn.close()
        return updated

def verify_booking_otp(booking_id: str, submitted_otp: str) -> Dict[str, Any]:
    booking = get_booking_by_id(booking_id)
    if not booking:
        return {"success": False, "message": "Booking not found"}
    if booking["otp"].strip() == submitted_otp.strip():
        # OTP verified! Job status is set to in_progress
        update_booking_status(booking_id, "in_progress")
        return {"success": True, "message": "OTP Verified successfully! Service commenced."}
    return {"success": False, "message": "Incorrect OTP. Please enter the 4-digit OTP shown on customer screen."}

def get_wallet() -> Dict[str, Any]:
    conn = get_connection()
    row = conn.execute("SELECT * FROM wallet WHERE id = 1").fetchone()
    conn.close()
    return dict(row) if row else {"balance": 13000.0, "currency": "INR", "symbol": "₹"}

def deposit_wallet(amount: float, method: str = "UPI", upi_id: str = "ramesh@okhdfcbank") -> Dict[str, Any]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE wallet SET balance = balance + ? WHERE id = 1", (amount,))
        tx_id = f"tx-{uuid.uuid4().hex[:6]}"
        ref_id = f"RZP_DEP_{uuid.uuid4().hex[:6].upper()}"
        cursor.execute("""
            INSERT INTO transactions (id, type, amount, direction, title_en, title_hi, status, date_str, method, reference_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tx_id, "deposit", amount, "credit",
            "Add Money", "पैसे जोड़े", "success",
            datetime.now().strftime("%b %d, %Y"),
            f"{method} ({upi_id})", ref_id
        ))
        conn.commit()
        updated_wallet = get_wallet()
        conn.close()
        return {"wallet": updated_wallet, "transaction_id": tx_id}

def payout_wallet(amount: float, upi_id: str = "ramesh@okhdfcbank") -> Dict[str, Any]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        wallet = get_wallet()
        if wallet["balance"] < amount:
            conn.close()
            return {"success": False, "message": "Insufficient wallet balance"}
        
        cursor.execute("UPDATE wallet SET balance = balance - ? WHERE id = 1", (amount,))
        tx_id = f"tx-{uuid.uuid4().hex[:6]}"
        ref_id = f"RZP_PAY_{uuid.uuid4().hex[:6].upper()}"
        cursor.execute("""
            INSERT INTO transactions (id, type, amount, direction, title_en, title_hi, status, date_str, method, reference_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            tx_id, "payout", amount, "debit",
            "Wallet Payouts", "वॉलेट पेआउट", "success",
            datetime.now().strftime("%b %d, %Y"),
            f"Instant UPI Transfer ({upi_id})", ref_id
        ))
        conn.commit()
        updated_wallet = get_wallet()
        conn.close()
        return {"success": True, "wallet": updated_wallet, "transaction_id": tx_id}

def get_transactions() -> List[Dict[str, Any]]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM transactions ORDER BY rowid DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_reviews() -> List[Dict[str, Any]]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM reviews ORDER BY rowid DESC").fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["tags"] = json.loads(d["tags_json"]) if d.get("tags_json") else []
        result.append(d)
    return result

def create_review(data: Dict[str, Any]) -> Dict[str, Any]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        rev_id = f"rev-{uuid.uuid4().hex[:6]}"
        
        # Get worker name
        worker = get_worker_by_id(data["worker_id"])
        worker_name = worker["name"] if worker else "Verified Worker"

        cursor.execute("""
            INSERT INTO reviews (id, booking_id, worker_id, worker_name, customer_name, rating, tags_json, comment, date_str)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            rev_id, data["booking_id"], data["worker_id"], worker_name,
            data.get("customer_name", "Ramesh Kumar"), data["rating"],
            json.dumps(data.get("tags", [])), data.get("comment", ""),
            datetime.now().strftime("%b %d, %Y")
        ))

        # Mark booking as rated
        cursor.execute("UPDATE bookings SET is_rated = 1 WHERE id = ?", (data["booking_id"],))

        # Update worker rating average
        cursor.execute("""
            UPDATE workers 
            SET reviews_count = reviews_count + 1,
                rating = ROUND((rating * 4 + ?) / 5.0, 1)
            WHERE id = ?
        """, (data["rating"], data["worker_id"]))

        conn.commit()
        conn.close()
        return {"id": rev_id, "success": True}

def get_all_users() -> List[Dict[str, Any]]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM users ORDER BY joined_date DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def get_user_profile(user_id: Optional[str] = None) -> Dict[str, Any]:
    conn = get_connection()
    uid = user_id or 'u-1'
    row = conn.execute("SELECT * FROM users WHERE id = ?", (uid,)).fetchone()
    conn.close()
    if row:
        return dict(row)
    if uid in ['admin-1', 'admin']:
        return {
            "id": "admin-1",
            "name": "admin",
            "phone": "7878193644",
            "email": "bhavarthhapani7@gmail.com",
            "address": "",
            "city": "",
            "photo": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
            "aadhaar_masked": "",
            "member_id": "WM-ADMIN-001",
            "account_type": "System Administrator",
            "joined_date": "September 14, 2026",
            "trust_score": 5.0,
            "kyc_status": "verified"
        }
    return {
        "id": "u-1",
        "name": "Ramesh Kumar",
        "phone": "+91 98765 43210",
        "email": "ramesh.kumar@workmate.in",
        "address": "Flat 402, Lotus Tower, Sector 14",
        "city": "Noida, Uttar Pradesh",
        "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        "aadhaar_masked": "•••• •••• 9012",
        "member_id": "WM-USER-89104",
        "account_type": "Customer Premium",
        "joined_date": "September 14, 2026",
        "trust_score": 4.9,
        "kyc_status": "verified"
    }

def update_user_profile(
    name: str,
    phone: str,
    address: str,
    city: str,
    email: Optional[str] = None,
    photo: Optional[str] = None,
    joined_date: Optional[str] = None,
    user_id: str = "u-1"
) -> Dict[str, Any]:
    uid = user_id or "u-1"
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE id = ?", (uid,))
        exists = cursor.fetchone()
        if exists:
            cursor.execute("""
                UPDATE users
                SET name = ?,
                    phone = ?,
                    address = ?,
                    city = ?,
                    email = COALESCE(?, email),
                    photo = COALESCE(?, photo),
                    joined_date = COALESCE(?, joined_date)
                WHERE id = ?
            """, (name, phone, address or "", city or "", email, photo, joined_date, uid))
        else:
            is_admin = uid in ["admin-1", "admin"]
            def_photo = photo or ("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face" if is_admin else "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face")
            member_id = "WM-ADMIN-001" if is_admin else "WM-USER-89104"
            acc_type = "System Administrator" if is_admin else "Customer Premium"
            joined = joined_date or "September 14, 2026"
            cursor.execute("""
                INSERT INTO users (id, name, phone, email, address, city, photo, aadhaar_masked, member_id, account_type, joined_date, trust_score, kyc_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, 5.0, 'verified')
            """, (uid, name, phone, email or "", address or "", city or "", def_photo, member_id, acc_type, joined))
        conn.commit()
        conn.close()
        return get_user_profile(uid)

def update_user_avatar(photo: str, user_id: str = "u-1") -> Dict[str, Any]:
    uid = user_id or "u-1"
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE users SET photo = ? WHERE id = ?", (photo, uid))
        conn.commit()
        conn.close()
        return get_user_profile(uid)

def get_user_by_phone(phone: str) -> Optional[Dict[str, Any]]:
    target = re.sub(r'\D', '', phone)
    if len(target) > 10 and target.startswith('91'):
        target = target[2:]
    conn = get_connection()
    rows = conn.execute("SELECT * FROM users").fetchall()
    conn.close()
    for r in rows:
        stored = re.sub(r'\D', '', r["phone"] or '')
        if len(stored) > 10 and stored.startswith('91'):
            stored = stored[2:]
        if stored and target and (stored == target or target in stored):
            return dict(r)
    return None

def register_user(name: str, phone: str, address: str, city: str, email: Optional[str] = None, password: str = "123456") -> Dict[str, Any]:
    existing = get_user_by_phone(phone)
    if existing:
        raise ValueError("A user with this mobile number is already registered.")
    uid = f"u-{uuid.uuid4().hex[:6]}"
    mem_num = random.randint(10000, 99999)
    member_id = f"WM-USER-{mem_num}"
    def_photo = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    joined = "September 14, 2026"
    
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (id, name, phone, email, address, city, photo, aadhaar_masked, member_id, account_type, joined_date, trust_score, kyc_status, password, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, 'Customer Verified', ?, 5.0, 'verified', ?, 'customer')
        """, (uid, name, phone, email or "", address or "", city or "", def_photo, member_id, joined, password))
        conn.commit()
        conn.close()
        return get_user_profile(uid)

def get_user_by_identifier(identifier: str) -> Optional[Dict[str, Any]]:
    ident = identifier.strip().lower()
    clean_digits = re.sub(r'\D', '', ident)
    if len(clean_digits) > 10 and clean_digits.startswith('91'):
        clean_digits = clean_digits[2:]

    conn = get_connection()
    rows = conn.execute("SELECT * FROM users").fetchall()
    conn.close()

    for r in rows:
        d = dict(r)
        u_id = (d.get("id") or "").lower()
        u_name = (d.get("name") or "").lower()
        u_email = (d.get("email") or "").lower()
        u_phone = re.sub(r'\D', '', d.get("phone") or '')
        if len(u_phone) > 10 and u_phone.startswith('91'):
            u_phone = u_phone[2:]

        if ident in ["admin", "admin-1"] and (u_id in ["admin-1", "admin"] or d.get("role") == "admin" or u_name == "admin"):
            return d
        if ident and (ident == u_id or ident == u_email or ident == u_name):
            return d
        if clean_digits and u_phone and (clean_digits == u_phone or clean_digits in u_phone):
            return d

    return None

def admin_create_user(name: str, phone: str, password: str, address: str, city: str, email: Optional[str] = None, role: str = "customer") -> Dict[str, Any]:
    existing = get_user_by_phone(phone)
    if existing:
        raise ValueError(f"User with phone {phone} already exists.")
    uid = f"u-{uuid.uuid4().hex[:6]}"
    mem_num = random.randint(10000, 99999)
    member_id = f"WM-USER-{mem_num}"
    def_photo = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" if role != "admin" else "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
    joined = "September 14, 2026"
    acc_type = "System Administrator" if role == "admin" else "Customer Verified"

    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (id, name, phone, email, address, city, photo, aadhaar_masked, member_id, account_type, joined_date, trust_score, kyc_status, password, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, '', ?, ?, ?, 5.0, 'verified', ?, ?)
        """, (uid, name, phone, email or "", address or "", city or "", def_photo, member_id, acc_type, joined, password, role))
        conn.commit()
        conn.close()
        return get_user_profile(uid)

def admin_update_user(user_id: str, name: str, phone: str, address: str, city: str, email: Optional[str] = None, password: Optional[str] = None, role: Optional[str] = None) -> Dict[str, Any]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        row = cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if not row:
            conn.close()
            raise ValueError(f"User {user_id} not found.")

        current = dict(row)
        new_name = name.strip() if name else current["name"]
        new_phone = phone.strip() if phone else current["phone"]
        new_addr = address.strip() if address is not None else current["address"]
        new_city = city.strip() if city is not None else current["city"]
        new_email = email.strip() if email is not None else current["email"]
        new_pass = password.strip() if password else current.get("password", "123456")
        new_role = role.strip() if role else current.get("role", "customer")
        acc_type = "System Administrator" if new_role == "admin" else "Customer Verified"

        cursor.execute("""
            UPDATE users
            SET name = ?, phone = ?, address = ?, city = ?, email = ?, password = ?, role = ?, account_type = ?
            WHERE id = ?
        """, (new_name, new_phone, new_addr, new_city, new_email, new_pass, new_role, acc_type, user_id))
        conn.commit()
        conn.close()
        return get_user_profile(user_id)

def admin_delete_user(user_id: str) -> bool:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        row = cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        if not row:
            conn.close()
            raise ValueError(f"User {user_id} not found.")

        u = dict(row)
        if u.get("id") == "admin-1" or u.get("phone") == "7878193644" or u.get("name") == "admin":
            conn.close()
            raise ValueError("Primary System Administrator cannot be deleted.")

        cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
        conn.commit()
        conn.close()
        return True

def report_booking_dispute(booking_id: str, worker_id: str, reason: str, rating: int, refund_action: str = "refund_wallet") -> Dict[str, Any]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        
        # 1. Fetch booking
        b_row = cursor.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,)).fetchone()
        if not b_row:
            conn.close()
            raise ValueError(f"Booking {booking_id} not found")
        booking = dict(b_row)
        
        # 2. Update booking status
        is_refund = refund_action in ["refund_wallet", "instant_wallet_refund"]
        new_status = "disputed_refunded" if is_refund else "disputed_replacement"
        cursor.execute("""
            UPDATE bookings 
            SET status = ?, 
                task_description = task_description || ?
            WHERE id = ?
        """, (new_status, f" [DISPUTE: {reason}]", booking_id))
        
        # 3. Credit wallet if refund requested
        refund_amount = 0.0
        if is_refund:
            refund_amount = float(booking.get("total_cost", 0.0))
            cursor.execute("UPDATE wallet SET balance = balance + ? WHERE id = 1", (refund_amount,))
            
            tx_id = f"tx-{uuid.uuid4().hex[:6]}"
            cursor.execute("""
                INSERT INTO transactions (id, type, amount, direction, title_en, title_hi, status, date_str, method, reference_id)
                VALUES (?, 'refund', ?, 'credit', ?, ?, 'success', ?, 'WorkMate Escrow', ?)
            """, (
                tx_id,
                refund_amount,
                f"Escrow Refund: Booking #{booking_id} (Worker Abandoned)",
                f"एस्क्रो रिफंड: बुकिंग #{booking_id} (श्रमिक ने काम छोड़ा)",
                datetime.now().strftime("%b %d, %Y • %I:%M %p"),
                f"REF-{uuid.uuid4().hex[:8].upper()}"
            ))
            
        # 4. Record negative review & penalize worker rating
        rev_id = f"rev-{uuid.uuid4().hex[:6]}"
        cursor.execute("""
            INSERT INTO reviews (id, booking_id, worker_id, worker_name, customer_name, rating, tags_json, comment, date_str)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            rev_id,
            booking_id,
            worker_id,
            booking.get("worker_name", "Worker"),
            booking.get("customer_name", "Customer"),
            max(1, min(rating, 5)),
            json.dumps(["Mid-Work Issue", "Abandoned"]),
            f"Incident Reported: {reason}",
            datetime.now().strftime("%b %d, %Y")
        ))
        
        # Calculate new worker rating downwards
        cursor.execute("""
            UPDATE workers 
            SET rating = ROUND(MAX(1.0, (rating * reviews_count + ?) / (reviews_count + 1)), 1),
                reviews_count = reviews_count + 1
            WHERE id = ?
        """, (max(1, min(rating, 5)), worker_id))
        
        w_row = cursor.execute("SELECT rating FROM workers WHERE id = ?", (worker_id,)).fetchone()
        penalized_rating = w_row["rating"] if w_row else rating

        conn.commit()
        conn.close()
        return {
            "success": True,
            "booking_id": booking_id,
            "status": new_status,
            "refund_amount": refund_amount,
            "worker_penalized_rating": penalized_rating,
            "message": "Dispute recorded and escrow refund credited successfully" if is_refund else "Replacement worker requested"
        }

def get_system_config() -> Dict[str, Any]:
    conn = get_connection()
    rows = conn.execute("SELECT key, value FROM system_config").fetchall()
    conn.close()
    config = {"platform_charge_percent": 10.0}
    for r in rows:
        try:
            config[r["key"]] = float(r["value"])
        except (ValueError, TypeError):
            config[r["key"]] = r["value"]
    return config

def set_platform_charge_percent(percent: float) -> float:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO system_config (key, value)
            VALUES ('platform_charge_percent', ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        """, (str(percent),))
        conn.commit()
        conn.close()
        return percent

# ----------------- Admin Console Management ----------------- #

def update_service_rate(service_id: str, new_base_rate: float) -> Optional[Dict[str, Any]]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE services
            SET base_rate = ?
            WHERE id = ?
        """, (new_base_rate, service_id))
        conn.commit()
        updated = get_service_by_id(service_id)
        conn.close()
        return updated

def get_admin_banks() -> List[Dict[str, Any]]:
    conn = get_connection()
    rows = conn.execute("SELECT * FROM admin_banks ORDER BY is_primary DESC, id").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def switch_primary_bank(bank_id: str) -> List[Dict[str, Any]]:
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        # Set all to standby
        cursor.execute("UPDATE admin_banks SET is_primary = 0, status = 'STANDBY'")
        # Set selected to primary
        cursor.execute("UPDATE admin_banks SET is_primary = 1, status = 'ACTIVE' WHERE id = ?", (bank_id,))
        conn.commit()
        conn.close()
        return get_admin_banks()

def record_bank_routing(amount: float) -> Dict[str, Any]:
    """Routes customer charge into the primary admin bank account, auto-failing over if error."""
    with _lock:
        conn = get_connection()
        cursor = conn.cursor()
        # Find active primary
        row = cursor.execute("SELECT * FROM admin_banks WHERE is_primary = 1 AND is_active = 1").fetchone()
        if not row:
            # Auto failover to first active bank
            row = cursor.execute("SELECT * FROM admin_banks WHERE is_active = 1 ORDER BY id LIMIT 1").fetchone()
            if row:
                cursor.execute("UPDATE admin_banks SET is_primary = 1, status = 'ACTIVE' WHERE id = ?", (row["id"],))

        bank = dict(row) if row else None
        if bank:
            cursor.execute("""
                UPDATE admin_banks 
                SET total_routed_inr = total_routed_inr + ?
                WHERE id = ?
            """, (amount, bank["id"]))
            conn.commit()

        conn.close()
        return bank or {"bank_name": "HDFC Primary", "account_masked": "•••• 8819"}

def get_admin_financial_stats() -> Dict[str, Any]:
    conn = get_connection()
    bookings = conn.execute("SELECT * FROM bookings").fetchall()
    banks = conn.execute("SELECT * FROM admin_banks").fetchall()
    conn.close()

    total_charge_collected = sum(b["commission_amount"] for b in bookings)
    total_gmv = sum(b["total_cost"] for b in bookings)
    total_worker_payouts = sum(b["worker_payout_amount"] for b in bookings if b["status"] == "completed")

    return {
        "total_gmv": round(total_gmv, 2),
        "total_workmate_charge": round(total_charge_collected, 2),
        "total_worker_payouts": round(total_worker_payouts, 2),
        "active_banks_count": len([b for b in banks if b["is_active"]]),
        "primary_bank": next((dict(b) for b in banks if b["is_primary"]), None)
    }
