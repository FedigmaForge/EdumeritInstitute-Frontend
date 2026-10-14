// Loads Razorpay Checkout and opens it for an order created by
// POST /api/main-mock-test/create-order. Resolves with Razorpay's
// { razorpay_order_id, razorpay_payment_id, razorpay_signature }, or rejects
// with { cancelled: true } if the student closes the popup.

let loader = null;
const loadScript = () => {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve();
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = resolve;
      s.onerror = () => { loader = null; reject(new Error("Could not load the payment window. Check your internet connection.")); };
      document.body.appendChild(s);
    });
  }
  return loader;
};

export async function openRazorpay({ keyId, order, name, description, prefill }) {
  await loadScript();
  return new Promise((resolve, reject) => {
    const rz = new window.Razorpay({
      key: keyId,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      name: name || "EduMerit Institute",
      description,
      prefill,
      theme: { color: "#0a1f44" },
      handler: resolve,
      modal: { ondismiss: () => reject({ cancelled: true }) },
    });
    rz.on("payment.failed", (r) => reject(new Error(r?.error?.description || "Payment failed.")));
    rz.open();
  });
}
