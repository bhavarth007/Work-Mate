"""
WorkMate Data Models
Pydantic schemas for data validation and serialization.
"""
from typing import List, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class Category(BaseModel):
    id: str
    name_en: str
    name_hi: str
    subtext_en: str
    subtext_hi: str
    icon: str
    rating: float = 4.8
    services_count: int = 4

class Service(BaseModel):
    id: str
    category_id: str
    name_en: str
    name_hi: str
    desc_en: str
    desc_hi: str
    base_rate: float
    unit: str  # "per_hour", "per_day", "per_task"
    popular: bool = False

class Worker(BaseModel):
    id: str
    name: str
    phone: str
    photo: str
    primary_trade: str
    primary_trade_hi: str
    category_id: str
    rating: float = 4.8
    reviews_count: int = 124
    hourly_rate: float
    daily_rate: float
    aadhaar_verified: bool = True
    police_verified: bool = True
    kyc_status: Literal["verified", "pending", "rejected"] = "verified"
    experience_years: int = 5
    is_available: bool = True
    current_lat: float = 28.6139
    current_lng: float = 77.2090
    bio_en: Optional[str] = None
    bio_hi: Optional[str] = None

class BookingCreate(BaseModel):
    customer_name: str = "Ramesh Kumar"
    customer_phone: str = "+91 98765 43210"
    service_id: str
    task_description: str
    booking_type: Literal["instant", "scheduled"] = "instant"
    scheduled_date: Optional[str] = None
    scheduled_time: Optional[str] = None
    duration_hours: int = 4
    location_address: str = "Flat 402, Sector 14, Noida, UP"
    lat: float = 28.6139
    lng: float = 77.2090

class Booking(BaseModel):
    id: str
    booking_number: str
    customer_name: str
    customer_phone: str
    worker_id: Optional[str] = None
    worker_name: Optional[str] = None
    worker_photo: Optional[str] = None
    worker_rating: float = 4.8
    worker_trade: Optional[str] = None
    worker_trade_hi: Optional[str] = None
    service_id: str
    service_name_en: str
    service_name_hi: str
    task_description: str
    booking_type: str
    scheduled_date_time: str
    duration_hours: int
    total_cost: float
    commission_amount: float
    worker_payout_amount: float
    otp: str = "4567"
    eta_minutes: int = 15
    status: Literal["upcoming", "in_progress", "completed", "cancelled", "disputed_refunded", "disputed_replacement"] = "upcoming"
    location_address: str
    lat: float
    lng: float
    worker_lat: float = 28.6150
    worker_lng: float = 77.2100
    created_at: str
    completed_at: Optional[str] = None
    is_rated: bool = False

class OTPVerifyRequest(BaseModel):
    booking_id: str
    otp: str

class BookingStatusUpdateRequest(BaseModel):
    booking_id: str
    status: Literal["upcoming", "in_progress", "completed", "cancelled", "disputed_refunded", "disputed_replacement"]

class WalletTransaction(BaseModel):
    id: str
    type: Literal["deposit", "payout", "payment", "commission", "refund"]
    amount: float
    direction: Literal["credit", "debit"]
    title_en: str
    title_hi: str
    status: Literal["success", "processing", "failed"] = "success"
    date_str: str
    method: str
    reference_id: str

class WalletDepositRequest(BaseModel):
    amount: float = Field(..., gt=0)
    method: Literal["UPI", "Cards", "NetBanking"] = "UPI"
    upi_id: Optional[str] = "ramesh@okhdfcbank"

class WalletPayoutRequest(BaseModel):
    amount: float = Field(..., gt=0)
    worker_id: Optional[str] = "w-1"
    upi_id: str = "worker@upi"

class WorkerOnboardRequest(BaseModel):
    name: str
    phone: str
    aadhaar_number: str
    category_id: str
    primary_trade: str
    experience_years: int = 3
    daily_rate: float
    city: str
    police_check_consent: bool = True

class ReviewCreate(BaseModel):
    booking_id: str
    worker_id: str
    rating: int = Field(..., ge=1, le=5)
    tags: List[str] = []
    comment: str
    customer_name: str = "Ramesh Kumar"

class Review(BaseModel):
    id: str
    booking_id: str
    worker_id: str
    worker_name: str
    customer_name: str
    rating: int
    tags: List[str]
    comment: str
    date_str: str

class UserProfileUpdate(BaseModel):
    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=5)
    address: Optional[str] = ""
    city: Optional[str] = ""
    email: Optional[str] = None
    photo: Optional[str] = None
    joined_date: Optional[str] = None

class UserAvatarUpdate(BaseModel):
    photo: str

class AuthLoginRequest(BaseModel):
    role: Literal["customer", "admin"] = "customer"
    identifier: str  # Phone number for customer, username/email for admin
    password: Optional[str] = None
    otp: Optional[str] = "1234"

class ServiceRateUpdate(BaseModel):
    base_rate: float = Field(..., gt=0)

class CustomerRegisterRequest(BaseModel):
    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=5)
    address: Optional[str] = ""
    city: Optional[str] = ""
    email: Optional[str] = None

class BookingDisputeRequest(BaseModel):
    booking_id: str
    worker_id: str
    reason: str = Field(..., min_length=3)
    rating: int = Field(1, ge=1, le=5)
    refund_action: Literal["refund_wallet", "replacement_worker", "instant_wallet_refund", "dispatch_replacement"] = "instant_wallet_refund"

