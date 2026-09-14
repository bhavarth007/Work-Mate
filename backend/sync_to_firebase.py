"""
Sync WorkMate Database to Firebase Cloud Firestore
Usage: python backend/sync_to_firebase.py
"""
import sys
import os

# Ensure backend path is included
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database import (
    init_db, get_categories, get_services, get_workers,
    get_bookings, get_wallet, get_transactions, get_reviews
)
from backend.firebase_config import (
    init_firebase, get_firestore_db, FIREBASE_PROJECT_ID, get_firebase_credentials_path
)

def sync_all():
    print(f"================================================================")
    print(f"      WorkMate -> Firebase Cloud Firestore Data Sync")
    print(f"      Target Firebase Project: {FIREBASE_PROJECT_ID}")
    print(f"================================================================")

    init_db()
    cred_path = get_firebase_credentials_path()

    if not cred_path:
        print(f"\n[!] Notice: Firebase Service Account Private Key not found.")
        print(f"To sync your data to Firebase project '{FIREBASE_PROJECT_ID}':")
        print(f"  1. Go to Firebase Console -> Project Settings (gear icon) -> Service accounts")
        print(f"  2. Click 'Generate new private key'")
        print(f"  3. Save the downloaded JSON file as 'backend/serviceAccountKey.json'")
        print(f"  4. Re-run: python backend/sync_to_firebase.py\n")
        return False

    db = get_firestore_db()
    if not db:
        print("[!] Could not connect to Firestore. Check internet and credentials.")
        return False

    print(">> Syncing Categories to Firestore 'categories' collection...")
    for cat in get_categories():
        db.collection("categories").document(cat["id"]).set(cat)

    print(">> Syncing Services to Firestore 'services' collection...")
    for s in get_services():
        db.collection("services").document(s["id"]).set(s)

    print(">> Syncing Workers to Firestore 'workers' collection...")
    for w in get_workers():
        db.collection("workers").document(w["id"]).set(w)

    print(">> Syncing Bookings to Firestore 'bookings' collection...")
    for b in get_bookings():
        db.collection("bookings").document(b["id"]).set(b)

    print(">> Syncing Wallet to Firestore 'wallet' collection...")
    wallet = get_wallet()
    db.collection("wallet").document("main").set(wallet)

    print(">> Syncing Transactions to Firestore 'transactions' collection...")
    for tx in get_transactions():
        db.collection("transactions").document(tx["id"]).set(tx)

    print(">> Syncing Reviews to Firestore 'reviews' collection...")
    for r in get_reviews():
        db.collection("reviews").document(r["id"]).set(r)

    print("\n[✓] All collections successfully synced to Firebase Cloud Firestore!")
    return True

if __name__ == "__main__":
    sync_all()
