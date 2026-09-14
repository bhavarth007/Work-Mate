"""
WorkMate Firebase Integration Configuration
Connects to Firebase Project 'work-mate-eadb9' (Cloud Firestore & Realtime DB).
"""
import os
import firebase_admin
from firebase_admin import credentials, firestore

FIREBASE_PROJECT_ID = "work-mate-eadfb"

# Potential credential key paths
POSSIBLE_KEY_PATHS = [
    os.path.join(os.path.dirname(__file__), "firebase_credentials.json"),
    os.path.join(os.path.dirname(__file__), "serviceAccountKey.json"),
    os.path.join(os.path.dirname(__file__), "..", "serviceAccountKey.json"),
    os.path.join(os.path.dirname(__file__), "..", "firebase_credentials.json"),
]

_firestore_client = None
_firebase_initialized = False

def get_firebase_credentials_path():
    for p in POSSIBLE_KEY_PATHS:
        if os.path.isfile(p):
            return p
    return None

def init_firebase():
    """Initializes Firebase Admin SDK if service account credentials exist."""
    global _firestore_client, _firebase_initialized

    if _firebase_initialized:
        return _firestore_client

    key_path = get_firebase_credentials_path()
    try:
        if key_path:
            cred = credentials.Certificate(key_path)
            firebase_admin.initialize_app(cred, {
                "projectId": FIREBASE_PROJECT_ID,
                "databaseURL": f"https://{FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com"
            })
            _firestore_client = firestore.client()
            _firebase_initialized = True
            print(f">> [Firebase] Initialized with credentials from: {key_path}")
        else:
            # Fallback app initialization with project ID (for environments with ADC)
            try:
                firebase_admin.initialize_app(options={"projectId": FIREBASE_PROJECT_ID})
                _firestore_client = firestore.client()
                _firebase_initialized = True
                print(f">> [Firebase] Initialized with Project ID: {FIREBASE_PROJECT_ID}")
            except Exception:
                print(f">> [Firebase] Credentials file not found. Place 'serviceAccountKey.json' in backend/ to enable Firestore cloud sync.")
    except Exception as e:
        print(f">> [Firebase] Initialization notice: {e}")

    return _firestore_client

def get_firestore_db():
    if not _firebase_initialized:
        return init_firebase()
    return _firestore_client

def is_firebase_ready():
    return get_firestore_db() is not None
