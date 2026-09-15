/**
 * WorkMate Cloud Firestore Real-Time Sync & Storage Bridge
 * Handles bi-directional synchronization between local database and Google Cloud Firestore.
 */

const WorkMateFirebaseSync = {
  getDb() {
    return (window.workmateFirebase && window.workmateFirebase.getDb()) || null;
  },

  async isConnected() {
    const db = this.getDb();
    if (!db) return false;
    try {
      // Test read ping
      await db.collection("_ping").doc("status").set({ timestamp: Date.now() }, { merge: true });
      return true;
    } catch (e) {
      console.warn("[Firebase Sync] Connection test:", e.message);
      return false;
    }
  },

  // Save or update user
  async saveUser(user) {
    const db = this.getDb();
    if (!db || !user || !user.id) return;
    try {
      await db.collection("users").doc(String(user.id)).set(user, { merge: true });
      console.log(`[Firebase Sync] User ${user.id} synced to Cloud Firestore.`);
    } catch (e) {
      console.warn("[Firebase Sync] Failed to save user:", e);
    }
  },

  // Save or update booking
  async saveBooking(booking) {
    const db = this.getDb();
    if (!db || !booking || !booking.id) return;
    try {
      await db.collection("bookings").doc(String(booking.id)).set(booking, { merge: true });
      console.log(`[Firebase Sync] Booking ${booking.id} synced to Cloud Firestore.`);
    } catch (e) {
      console.warn("[Firebase Sync] Failed to save booking:", e);
    }
  },

  // Save deposit/payment transaction
  async saveTransaction(tx) {
    const db = this.getDb();
    if (!db || !tx || !tx.id) return;
    try {
      await db.collection("transactions").doc(String(tx.id)).set(tx, { merge: true });
      console.log(`[Firebase Sync] Transaction ${tx.id} synced to Cloud Firestore.`);
    } catch (e) {
      console.warn("[Firebase Sync] Failed to save transaction:", e);
    }
  },

  // Full Initial Cloud Sync
  async syncAllLocalData() {
    const db = this.getDb();
    if (!db) {
      throw new Error("Firebase Firestore is not initialized or offline.");
    }

    // Get current local client db or state
    let localDb = null;
    try {
      const stored = localStorage.getItem("workmate_client_db");
      if (stored) localDb = JSON.parse(stored);
    } catch (e) {}

    const categories = (localDb && localDb.categories) || (typeof state !== 'undefined' && state.categories) || [];
    const services = (localDb && localDb.services) || (typeof state !== 'undefined' && state.services) || [];
    const workers = (localDb && localDb.workers) || (typeof state !== 'undefined' && state.workers) || [];
    const bookings = (localDb && localDb.bookings) || (typeof state !== 'undefined' && state.bookings) || [];
    const users = (localDb && localDb.users) || [];
    const transactions = (localDb && localDb.transactions) || [];

    const batch = db.batch();

    // 1. Categories
    categories.forEach(cat => {
      const ref = db.collection("categories").doc(String(cat.id));
      batch.set(ref, cat, { merge: true });
    });

    // 2. Services (20 trades)
    services.forEach(s => {
      const ref = db.collection("services").doc(String(s.id));
      batch.set(ref, s, { merge: true });
    });

    // 3. Workers
    workers.forEach(w => {
      const ref = db.collection("workers").doc(String(w.id));
      batch.set(ref, w, { merge: true });
    });

    // 4. Users
    users.forEach(u => {
      const ref = db.collection("users").doc(String(u.id));
      batch.set(ref, u, { merge: true });
    });

    // 5. Bookings
    bookings.forEach(b => {
      const ref = db.collection("bookings").doc(String(b.id));
      batch.set(ref, b, { merge: true });
    });

    // 6. Transactions
    transactions.forEach(t => {
      const ref = db.collection("transactions").doc(String(t.id));
      batch.set(ref, t, { merge: true });
    });

    await batch.commit();
    console.log("[Firebase Sync] Complete database successfully synced to Firebase Cloud Firestore!");
    return {
      categories: categories.length,
      services: services.length,
      workers: workers.length,
      users: users.length,
      bookings: bookings.length,
      transactions: transactions.length
    };
  }
};

window.WorkMateFirebaseSync = WorkMateFirebaseSync;

// Auto-sync on page load when Firebase is available
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (typeof firebase !== "undefined" && window.workmateFirebase && window.workmateFirebase.getDb()) {
      console.log("[Firebase Sync] Auto-initiating cloud bridge to work-mate-eadb9...");
      WorkMateFirebaseSync.syncAllLocalData().catch(e => {
        console.log("[Firebase Sync] Notice: Enable Firestore Database in Firebase Console if not created yet:", e.message);
      });
    }
  }, 2500);
});
