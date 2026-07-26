"use client";

import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-md mx-auto card-standard mt-12 text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">You must log in to checkout.</p>
        <button onClick={() => router.push("/login")} className="btn-primary w-full">
          Go to Login
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto card-standard mt-12 text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Cart Empty</h2>
        <button onClick={() => router.push("/")} className="btn-secondary w-full">
          Return to Shop
        </button>
      </div>
    );
  }

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      // For this demo, we process the first item in the cart.
      const item = items[0];
      
      // 1. Create Order in Firebase
      await addDoc(collection(db, "orders"), {
        productId: item.product.id,
        productTitle: item.product.title,
        productImage: item.product.image || "",
        buyerId: user.id,
        status: "pending",
        createdAt: serverTimestamp(),
        buyerLat: 6.5244,
        buyerLng: 3.3792,
        price: item.product.final_price
      });

      // Clear cart
      clearCart();

      // Redirect to home (in a real app, this would redirect to a success page or payment gateway)
      alert("Order placed successfully!");
      router.push("/");

    } catch (err: any) {
      setError(err.message || "Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  const item = items[0];

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">Checkout</h1>
      
      <div className="card-standard p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">Order Item</h2>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.product.title}</span>
            <span className="font-semibold text-foreground">
              ₦{(item.product.final_price / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </span>
          </div>
          {items.length > 1 && (
            <p className="text-xs text-warning mt-2">
              * Note: Only the first item will be processed in this demo.
            </p>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2 text-foreground">Delivery Location</h2>
          <p className="text-sm text-muted-foreground">Main Campus (6.5244, 3.3792)</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-error rounded-md text-sm border border-red-100">
            {error}
          </div>
        )}

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full btn-primary flex justify-center items-center"
        >
          {loading ? "Processing..." : "Confirm & Pay"}
        </button>
      </div>
    </div>
  );
}
