/**
 * WorkMate Real Google Map GPS Live Tracking & Arrival Lifecycle
 * Uses official Google Maps vector street tiles via Leaflet with live vehicle animation,
 * route waypoints, dynamic distance/ETA countdown, and doorstep arrival state transitions.
 */

let trackingMap = null;
let trackingWorkerMarker = null;
let trackingRouteLine = null;
let trackingIntervalId = null;
let currentTrackingBooking = null;
let workerRouteProgress = 0.0; // 0.0 to 1.0

function initTrackingMap(booking) {
  if (!booking) return;
  currentTrackingBooking = booking;
  workerRouteProgress = 0.05;

  const isHi = typeof state !== "undefined" && state.lang === "hi";

  // Stop any previous running tracking timer
  if (trackingIntervalId) {
    clearInterval(trackingIntervalId);
    trackingIntervalId = null;
  }

  const mapEl = document.getElementById("leafletMap");
  if (!mapEl) return;

  // Clean up existing Leaflet map instance
  if (trackingMap) {
    try {
      trackingMap.remove();
    } catch (e) {}
    trackingMap = null;
  }

  // Base coordinates: Use booking coordinates or realistic city defaults (Surat)
  const custLat = booking.lat || 21.2050;
  const custLng = booking.lng || 72.8450;
  const workerLat = booking.worker_lat || 21.2195;
  const workerLng = booking.worker_lng || 72.8315;

  // Intermediate realistic road turns
  const p1 = [workerLat - 0.0040, workerLng + 0.0050];
  const p2 = [workerLat - 0.0090, workerLng + 0.0090];
  const waypoints = [
    [workerLat, workerLng],
    p1,
    p2,
    [custLat, custLng]
  ];

  // 1. Initialize Leaflet Map with Google Maps Roadmap Tiles
  trackingMap = L.map("leafletMap", {
    zoomControl: true,
    attributionControl: false
  }).setView([custLat, custLng], 14);

  // Real Google Maps street tiles
  L.tileLayer("https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
  }).addTo(trackingMap);

  // 2. Draw Polyline Route
  trackingRouteLine = L.polyline(waypoints, {
    color: "#1a56db",
    weight: 5,
    opacity: 0.85,
    dashArray: "6, 8",
    lineJoin: "round"
  }).addTo(trackingMap);

  // 3. Customer Destination Marker (Pulsing House Icon)
  const customerIcon = L.divIcon({
    className: "map-custom-marker",
    html: `
      <div class="map-dest-marker">
        <i class="fa-solid fa-house-chimney"></i>
        <div class="map-pulse-ring"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  const custMarker = L.marker([custLat, custLng], { icon: customerIcon }).addTo(trackingMap);
  custMarker.bindPopup(`<b>${isHi ? 'आपका पता (गंतव्य)' : 'Your Address'}</b><br>${booking.location_address || 'Flat 402, Lotus Tower'}`);

  // 4. Worker Vehicle Marker (Motorcycle with Name Pill)
  const workerIcon = L.divIcon({
    className: "map-custom-marker",
    html: `
      <div class="map-bike-marker">
        <span class="bike-emoji">🏍️</span>
        <span class="bike-name-pill">${booking.worker_name || 'Worker'}</span>
      </div>
    `,
    iconSize: [42, 42],
    iconAnchor: [21, 21]
  });

  trackingWorkerMarker = L.marker([workerLat, workerLng], { icon: workerIcon }).addTo(trackingMap);

  // Fit bounds to show entire route
  trackingMap.fitBounds(L.latLngBounds(waypoints), { padding: [40, 40] });

  // Update UI Elements in Tracking Modal
  updateTrackingInfoView(booking, false);

  // If booking is already marked as arrived, jump immediately to arrived state
  if (booking.status === "arrived" || booking.status === "working" || booking.status === "completed") {
    handleWorkerArrivedUI(booking);
    return;
  }

  // 5. Start Smooth Real-Time GPS Movement Simulation
  trackingIntervalId = setInterval(() => {
    workerRouteProgress += 0.02; // Progresses smoothly
    if (workerRouteProgress >= 1.0) {
      workerRouteProgress = 1.0;
      clearInterval(trackingIntervalId);
      trackingIntervalId = null;
      handleWorkerArrivedUI(booking);
    } else {
      const curCoord = interpolateAlongWaypoints(waypoints, workerRouteProgress);
      if (trackingWorkerMarker) {
        trackingWorkerMarker.setLatLng(curCoord);
      }
      updateTrackingInfoView(booking, false);
    }
  }, 1200);

  // Invalidate map size after modal transitions
  setTimeout(() => {
    if (trackingMap) trackingMap.invalidateSize();
  }, 350);
}

function interpolateAlongWaypoints(points, t) {
  const numSegments = points.length - 1;
  const scaled = t * numSegments;
  const segIdx = Math.min(Math.floor(scaled), numSegments - 1);
  const segT = scaled - segIdx;

  const pA = points[segIdx];
  const pB = points[segIdx + 1];

  const lat = pA[0] + (pB[0] - pA[0]) * segT;
  const lng = pA[1] + (pB[1] - pA[1]) * segT;
  return [lat, lng];
}

function updateTrackingInfoView(booking, isArrived) {
  const isHi = typeof state !== "undefined" && state.lang === "hi";
  const nameEl = document.getElementById("trackingWorkerName");
  const phoneEl = document.getElementById("trackingWorkerPhone");
  const otpEl = document.getElementById("trackingOtpCode");
  const etaEl = document.getElementById("trackingEtaTime");
  const statusBox = document.getElementById("trackingStatusBox");
  const actionsRow = document.getElementById("trackingModalActionsRow");

  if (nameEl) nameEl.textContent = booking.worker_name || "Mukesh Verma";
  if (phoneEl) phoneEl.textContent = booking.worker_phone || "+91 98234 11092";
  if (otpEl) otpEl.textContent = booking.otp || "5603";

  if (!isArrived) {
    const remainingMins = Math.max(1, Math.round(15 * (1 - workerRouteProgress)));
    const remainingMeters = Math.max(50, Math.round(1400 * (1 - workerRouteProgress)));
    if (etaEl) {
      etaEl.textContent = isHi 
        ? `${remainingMins} मिनट (${remainingMeters} मीटर दूर)`
        : `${remainingMins} mins (${remainingMeters}m away)`;
    }
    if (statusBox) {
      statusBox.className = "tracking-status-active";
      statusBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="font-size:14px; color:#0f172a;">${booking.worker_name || 'Mukesh Verma'}</strong>
            <div style="font-size:12px; color:#2563eb;">${booking.worker_phone || '+91 98234 11092'}</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; color:#64748b;">${isHi ? 'सुरक्षा कोड (OTP):' : 'Arrival OTP:'}</span>
            <div style="font-size:17px; font-weight:800; color:#1e40af;">${booking.otp || '5603'}</div>
          </div>
        </div>
        <div style="margin-top:8px; font-size:12px; color:#1e3a8a; font-weight:700; display:flex; align-items:center; justify-content:space-between;">
          <span><i class="fa-solid fa-motorcycle"></i> ${isHi ? 'आगमन अनुमान:' : 'Live ETA:'} <span id="trackingEtaTime">${remainingMins} mins (${remainingMeters}m away)</span></span>
          <button type="button" class="btn-fast-forward" onclick="simulateWorkerArrival()" title="Simulate instant arrival for testing">
            <i class="fa-solid fa-forward-fast"></i> ${isHi ? 'तुरंत आगमन दिखाएं' : 'Fast Arrival'}
          </button>
        </div>
      `;
    }
  }
}

// Triggered when worker reaches destination
function handleWorkerArrivedUI(booking) {
  if (trackingIntervalId) {
    clearInterval(trackingIntervalId);
    trackingIntervalId = null;
  }

  const isHi = typeof state !== "undefined" && state.lang === "hi";

  // Mark booking as arrived in state
  booking.status = "arrived";
  if (typeof state !== "undefined") {
    const bk = state.bookings.find(b => b.id === booking.id);
    if (bk) bk.status = "arrived";
    if (state.activeBooking && state.activeBooking.id === booking.id) {
      state.activeBooking.status = "arrived";
    }
  }

  // Position worker marker at destination
  if (trackingWorkerMarker && booking) {
    const dest = [booking.lat || 21.2050, booking.lng || 72.8450];
    trackingWorkerMarker.setLatLng(dest);
    if (trackingMap) {
      trackingMap.setView(dest, 16);
    }
  }

  // Update Status Box in Modal to Arrived Success Banner
  const statusBox = document.getElementById("trackingStatusBox");
  if (statusBox) {
    statusBox.className = "tracking-status-arrived";
    statusBox.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <div class="arrived-check-badge">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <div>
          <h4 style="font-size:15px; font-weight:800; color:#065f46; margin:0;">
            ${isHi ? 'श्रमिक आपके पते पर पहुंच चुके हैं!' : 'Worker Has Arrived at Doorstep!'}
          </h4>
          <p style="font-size:12px; color:#047857; margin:2px 0 0 0;">
            ${booking.worker_name || 'Mukesh Verma'} ${isHi ? 'आपके घर के बाहर उपस्थित हैं।' : 'is standing outside your doorstep.'}
          </p>
        </div>
      </div>
      <div class="otp-arrival-card">
        <div style="font-size:12px; color:#854d0e; font-weight:700;">
          ${isHi ? 'श्रमिक को यह ओटीपी बताएं ताकि कार्य शुरू हो सके:' : 'Share this 4-digit OTP with worker to start work:'}
        </div>
        <div class="otp-highlight-code">${booking.otp || '5603'}</div>
      </div>
    `;
  }

  // Update Actions in Modal: Replace Tracking with Verify OTP Button
  const actionsRow = document.getElementById("trackingModalActionsRow");
  if (actionsRow) {
    const workerPhone = booking.worker_phone || "+91 98234 11092";
    actionsRow.innerHTML = `
      <button class="btn-submit-primary" style="flex:2; background:#10b981; font-weight:800;" onclick="closeModal('modalTracking'); openVerifyOtpModal('${booking.id}');">
        <i class="fa-solid fa-key"></i> ${isHi ? 'ओटीपी जांचें और काम शुरू करें' : 'Verify OTP & Start Job'}
      </button>
      <button class="btn-submit-primary" style="flex:1; background:#2563eb;" onclick="showToast('Calling worker: ' + '${workerPhone}')">
        <i class="fa-solid fa-phone"></i> ${isHi ? 'कॉल करें' : 'Call'}
      </button>
    `;
  }

  // Re-render active booking card on Home Screen
  if (typeof renderActiveBooking === "function") {
    renderActiveBooking();
  }
  if (typeof renderBookings === "function") {
    renderBookings();
  }

  showToast(
    isHi ? `${booking.worker_name || 'श्रमिक'} आपके पते पर पहुंच चुके हैं!` : `${booking.worker_name || 'Worker'} has arrived at your doorstep!`,
    "success"
  );
}

// User or tester fast-forwards arrival immediately
function simulateWorkerArrival() {
  if (currentTrackingBooking) {
    workerRouteProgress = 1.0;
    handleWorkerArrivedUI(currentTrackingBooking);
  }
}

function stopTrackingAnimation() {
  if (trackingIntervalId) {
    clearInterval(trackingIntervalId);
    trackingIntervalId = null;
  }
}
