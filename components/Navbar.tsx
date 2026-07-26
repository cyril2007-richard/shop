"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-0">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center md:h-20 gap-3 md:gap-8">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center order-1">
            <Link href="/" className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">
              Unimart
            </Link>
          </div>
          
          {/* Search Bar (Jumia Style) */}
          <div className="w-full md:flex-1 max-w-2xl flex order-3 md:order-2 mt-2 md:mt-0">
            <div className="relative w-full flex">
              <input
                type="text"
                placeholder="Search products, brands and categories"
                className="w-full border border-gray-400 rounded-l-md px-4 py-2.5 focus:outline-none focus:border-primary text-foreground placeholder:text-gray-500 text-sm md:text-base"
              />
              <button className="bg-primary hover:bg-primary-hover text-white px-4 md:px-6 font-semibold rounded-r-md transition-colors shadow-sm text-sm md:text-base">
                SEARCH
              </button>
            </div>
          </div>

          {/* Right Links */}
          <div className="flex items-center space-x-4 md:space-x-6 order-2 md:order-3 ml-auto md:ml-0">
            
            {/* Account / Login */}
            {user ? (
              <div className="flex items-center space-x-4 md:space-x-6">
                <Link href="/orders" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-bold text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v13H3V8"/><path d="M1 3h22v5H1z"/><path d="M10 12h4"/></svg>
                  <span className="hidden md:inline">Orders</span>
                </Link>
                <div className="flex items-center space-x-2 md:space-x-4 cursor-pointer hover:text-primary transition-colors">
                  <div className="flex flex-col items-end md:items-start">
                    <span className="text-xs text-muted-foreground font-semibold hidden md:block">Hi, {user.name}</span>
                    <button onClick={logout} className="text-sm font-bold text-foreground text-left hover:text-primary">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors font-bold text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span className="hidden md:inline">Login</span>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center space-x-1 text-foreground hover:text-primary transition-colors font-bold text-sm">
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Cart</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
