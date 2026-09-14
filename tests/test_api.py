"""
Automated Test Suite for WorkMate Backend API
Tests all endpoints, record insertions, and business logic.
"""
import sys
import os
import unittest
from fastapi.testclient import TestClient

# Ensure root dir is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app import app
from backend.database import get_wallet

class TestWorkMateAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_01_health_check(self):
        res = self.client.get("/api/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "healthy")

    def test_02_get_categories(self):
        res = self.client.get("/api/categories")
        self.assertEqual(res.status_code, 200)
        categories = res.json()
        self.assertGreaterEqual(len(categories), 4)
        cat_ids = [c["id"] for c in categories]
        self.assertIn("construction", cat_ids)
        self.assertIn("events", cat_ids)
        self.assertIn("shifting", cat_ids)
        self.assertIn("textile", cat_ids)

    def test_03_get_services(self):
        res = self.client.get("/api/services")
        self.assertEqual(res.status_code, 200)
        services = res.json()
        self.assertGreaterEqual(len(services), 16)

        # Test filtering by category
        res_const = self.client.get("/api/services?category_id=construction")
        self.assertEqual(res_const.status_code, 200)
        const_services = res_const.json()
        self.assertEqual(len(const_services), 4)

    def test_04_create_instant_booking_record(self):
        payload = {
            "customer_name": "Test Customer",
            "customer_phone": "+91 99887 76655",
            "service_id": "const_mason",
            "task_description": "Urgent boundary wall plastering needed",
            "booking_type": "instant",
            "duration_hours": 4,
            "location_address": "Sector 62, Noida, UP",
            "lat": 28.6280,
            "lng": 77.3649
        }
        res = self.client.post("/api/bookings", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()
        self.assertTrue(data["success"])
        booking = data["booking"]
        self.assertEqual(booking["customer_name"], "Test Customer")
        self.assertEqual(booking["status"], "in_progress")
        self.assertIsNotNone(booking["otp"])
        self.assertEqual(len(booking["otp"]), 4)
        self.assertGreater(booking["total_cost"], 0)

        # Save booking id for OTP test
        self.__class__.created_booking_id = booking["id"]
        self.__class__.booking_otp = booking["otp"]

    def test_05_verify_otp_flow(self):
        booking_id = self.__class__.created_booking_id
        otp = self.__class__.booking_otp

        # Invalid OTP test
        res_fail = self.client.post(f"/api/bookings/{booking_id}/verify-otp", json={"booking_id": booking_id, "otp": "0000"})
        self.assertEqual(res_fail.status_code, 400)

        # Valid OTP test
        res_ok = self.client.post(f"/api/bookings/{booking_id}/verify-otp", json={"booking_id": booking_id, "otp": otp})
        self.assertEqual(res_ok.status_code, 200)
        self.assertTrue(res_ok.json()["success"])

    def test_06_complete_booking_and_payout(self):
        booking_id = self.__class__.created_booking_id
        res = self.client.post(f"/api/bookings/{booking_id}/complete")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["booking"]["status"], "completed")

    def test_07_submit_rating_and_review(self):
        booking_id = self.__class__.created_booking_id
        payload = {
            "booking_id": booking_id,
            "worker_id": "w-1",
            "rating": 5,
            "tags": ["Fast Work", "Polite", "Skillful"],
            "comment": "Outstanding work done on time with zero issues!",
            "customer_name": "Test Customer"
        }
        res = self.client.post("/api/reviews", json=payload)
        self.assertEqual(res.status_code, 201)
        self.assertTrue(res.json()["success"])

    def test_08_worker_onboarding_kyc(self):
        # Invalid Aadhaar test
        bad_payload = {
            "name": "Arjun Singh",
            "phone": "+91 91234 56789",
            "aadhaar_number": "1234",  # invalid length
            "category_id": "construction",
            "primary_trade": "Tiles Mason",
            "experience_years": 4,
            "daily_rate": 800.0,
            "city": "Delhi"
        }
        res_bad = self.client.post("/api/workers/onboard", json=bad_payload)
        self.assertEqual(res_bad.status_code, 400)

        # Valid Aadhaar onboarding
        good_payload = {
            "name": "Arjun Singh",
            "phone": "+91 91234 56789",
            "aadhaar_number": "5421 9876 1234",
            "category_id": "construction",
            "primary_trade": "Tiles Mason",
            "experience_years": 4,
            "daily_rate": 800.0,
            "city": "Delhi"
        }
        res_good = self.client.post("/api/workers/onboard", json=good_payload)
        self.assertEqual(res_good.status_code, 201)
        data = res_good.json()
        self.assertTrue(data["success"])
        worker = data["worker"]
        self.assertEqual(worker["kyc_status"], "verified")
        self.assertTrue(worker["aadhaar_verified"])

    def test_09_wallet_operations(self):
        initial_balance = get_wallet()["balance"]

        # Deposit
        dep_payload = {
            "amount": 2500.0,
            "method": "UPI",
            "upi_id": "testuser@upi"
        }
        res_dep = self.client.post("/api/wallet/deposit", json=dep_payload)
        self.assertEqual(res_dep.status_code, 200)
        new_balance = res_dep.json()["data"]["wallet"]["balance"]
        self.assertEqual(new_balance, initial_balance + 2500.0)

        # Payout
        pay_payload = {
            "amount": 1000.0,
            "upi_id": "worker@upi"
        }
        res_pay = self.client.post("/api/wallet/payout", json=pay_payload)
        self.assertEqual(res_pay.status_code, 200)
        final_balance = res_pay.json()["data"]["wallet"]["balance"]
        self.assertEqual(final_balance, new_balance - 1000.0)

        # Check transactions list
        tx_res = self.client.get("/api/wallet/transactions")
        self.assertEqual(tx_res.status_code, 200)
        self.assertGreater(len(tx_res.json()), 0)

    def test_10_live_tracking_coordinates(self):
        booking_id = self.__class__.created_booking_id
        res = self.client.get(f"/api/tracking/{booking_id}")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("worker_location", data)
        self.assertIn("customer_location", data)
        self.assertIn("distance_meters", data)

if __name__ == "__main__":
    unittest.main()
