"use client";

import { useCart } from "../../contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeFromCart, totalPrice, totalItems } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center card-standard mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/" className="btn-primary inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-foreground mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="card-standard flex justify-between items-center p-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">{item.product.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{item.product.description}</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="font-semibold text-foreground">
                  ₦{(item.product.final_price / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-error hover:text-error/80 text-sm font-medium transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="card-standard p-6 sticky top-24">
            <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6 text-sm text-muted-foreground border-b border-gray-100 pb-4">
              <div className="flex justify-between">
                <span>Items ({totalItems})</span>
                <span>₦{(totalPrice / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg text-foreground mb-6">
              <span>Subtotal</span>
              <span>₦{(totalPrice / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="w-full btn-primary text-center"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
