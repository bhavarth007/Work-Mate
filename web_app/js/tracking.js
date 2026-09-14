/**
 * WorkMate Live GPS Tracking & Route Simulation
 * Renders dynamic route visualization and real-time worker movement.
 */
let trackingAnimId = null;
let workerProgress = 0.0; // 0 to 1

function initTrackingMap(booking) {
  const canvas = document.getElementById("trackingCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Adjust for retina display
  const width = canvas.clientWidth || 360;
  const height = canvas.clientHeight || 240;
  canvas.width = width * 2;
  canvas.height = height * 2;
  ctx.scale(2, 2);

  // Stop previous animation loop
  if (trackingAnimId) {
    cancelAnimationFrame(trackingAnimId);
  }

  // Define route waypoints in relative coordinates
  const customerPt = { x: width * 0.75, y: height * 0.3 };
  const workerStartPt = { x: width * 0.2, y: height * 0.75 };
  const waypoint1 = { x: width * 0.45, y: height * 0.75 };
  const waypoint2 = { x: width * 0.45, y: height * 0.3 };

  function drawMap() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw city grid background
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, width, height);

    // City blocks
    ctx.fillStyle = "#f1f5f9";
    const blockSize = 40;
    for (let x = 10; x < width; x += blockSize + 10) {
      for (let y = 10; y < height; y += blockSize + 10) {
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }

    // 2. Draw roads
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Main road route
    ctx.beginPath();
    ctx.moveTo(workerStartPt.x, workerStartPt.y);
    ctx.lineTo(waypoint1.x, waypoint1.y);
    ctx.lineTo(waypoint2.x, waypoint2.y);
    ctx.lineTo(customerPt.x, customerPt.y);
    ctx.stroke();

    // 3. Draw active route highlight line
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 6;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(workerStartPt.x, workerStartPt.y);
    ctx.lineTo(waypoint1.x, waypoint1.y);
    ctx.lineTo(waypoint2.x, waypoint2.y);
    ctx.lineTo(customerPt.x, customerPt.y);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // 4. Calculate current worker position based on progress
    let curX, curY;
    if (workerProgress <= 0.33) {
      const segP = workerProgress / 0.33;
      curX = workerStartPt.x + (waypoint1.x - workerStartPt.x) * segP;
      curY = workerStartPt.y;
    } else if (workerProgress <= 0.66) {
      const segP = (workerProgress - 0.33) / 0.33;
      curX = waypoint1.x;
      curY = waypoint1.y + (waypoint2.y - waypoint1.y) * segP;
    } else {
      const segP = (workerProgress - 0.66) / 0.34;
      curX = waypoint2.x + (customerPt.x - waypoint2.x) * segP;
      curY = waypoint2.y;
    }

    // 5. Draw Customer Destination Pin (Pulsing Green)
    const pulse = (Math.sin(Date.now() / 200) + 1) * 4;
    ctx.beginPath();
    ctx.arc(customerPt.x, customerPt.y, 14 + pulse, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(customerPt.x, customerPt.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#10b981";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Destination Label
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.fillText("Your Flat 402", customerPt.x - 30, customerPt.y - 14);

    // 6. Draw Worker Vehicle / Person Pin (Blue)
    ctx.beginPath();
    ctx.arc(curX, curY, 12, 0, Math.PI * 2);
    ctx.fillStyle = "#1d4ed8";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Worker Icon (small bike or person dot)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 10px FontAwesome, sans-serif";
    ctx.fillText("🏍️", curX - 6, curY + 4);

    // Worker Label
    ctx.fillStyle = "#1e40af";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.fillText(booking.worker_name || "Verified Worker", curX - 35, curY + 22);

    // Advance worker progress gradually
    workerProgress += 0.0015;
    if (workerProgress > 0.95) workerProgress = 0.05; // loop smoothly

    // Update ETA countdown on screen
    const liveEtaEl = document.getElementById("trackingEtaTime");
    if (liveEtaEl) {
      const remainingMinutes = Math.max(1, Math.round(15 * (1 - workerProgress)));
      liveEtaEl.textContent = `${remainingMinutes} mins (${Math.round(remainingMinutes * 250)}m away)`;
    }

    trackingAnimId = requestAnimationFrame(drawMap);
  }

  drawMap();
}

function stopTrackingAnimation() {
  if (trackingAnimId) {
    cancelAnimationFrame(trackingAnimId);
    trackingAnimId = null;
  }
}
