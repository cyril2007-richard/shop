"use client";

import { useCart, Product } from "../contexts/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, items } = useCart();
  const isInCart = items.some((item) => item.product.id === product.id);

  return (
    <div className="card-standard flex flex-col h-full group relative bg-white border border-transparent hover:border-gray-200 overflow-hidden cursor-pointer">
      <div className="relative w-full aspect-square bg-gray-100 rounded-sm mb-3 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img src={product.image} alt={product.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-sm font-normal text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <div className="mt-auto">
          <div className="text-lg font-extrabold text-foreground mb-1">
            ₦{(product.final_price).toLocaleString("en-NG", { minimumFractionDigits: 0 })}
          </div>
          {/* Fake old price for Jumia style */}
          <div className="text-xs text-muted-foreground line-through mb-3">
            ₦{(product.final_price * 1.2).toLocaleString("en-NG", { minimumFractionDigits: 0 })}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            disabled={isInCart}
            className={`w-full py-2 px-4 rounded text-sm font-semibold uppercase shadow-sm transition-colors ${
              isInCart 
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : "bg-primary text-white hover:bg-primary-hover"
            }`}
          >
            {isInCart ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
