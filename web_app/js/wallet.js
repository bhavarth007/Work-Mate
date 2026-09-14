/**
 * WorkMate Wallet & Razorpay/UPI Simulator
 */
async function fetchWalletData() {
  try {
    const res = await fetch("/api/wallet");
    const wallet = await res.json();
    return wallet;
  } catch (err) {
    console.error("Failed to load wallet data", err);
    return { balance: 13000, currency: "INR", symbol: "₹" };
  }
}

async function fetchTransactions() {
  try {
    const res = await fetch("/api/wallet/transactions");
    return await res.json();
  } catch (err) {
    console.error("Failed to load transactions", err);
    return [];
  }
}

async function handleAddMoney(amount, method = "UPI") {
  const res = await fetch("/api/wallet/deposit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: parseFloat(amount),
      method: method,
      upi_id: "ramesh@okhdfcbank"
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to add money");
  }
  return await res.json();
}

async function handlePayout(amount, upiId = "ramesh@okhdfcbank") {
  const res = await fetch("/api/wallet/payout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: parseFloat(amount),
      upi_id: upiId
    })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to process payout");
  }
  return await res.json();
}
