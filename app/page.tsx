"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { Product } from "../contexts/CartContext";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  Calendar,
  Shirt,
  Briefcase,
  Brush,
  ShoppingBasket,
  Bed,
  Utensils,
  Heart,
  Recycle,
  Cookie,
  Book,
  Smartphone,
  LayoutGrid,
  Globe
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  icon?: string;
};

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("event")) return <Calendar size={16} />;
  if (n.includes("fashion") || n.includes("shirt")) return <Shirt size={16} />;
  if (n.includes("service")) return <Briefcase size={16} />;
  if (n.includes("clean") || n.includes("home")) return <Brush size={16} />;
  if (n.includes("grocer")) return <ShoppingBasket size={16} />;
  if (n.includes("hostel") || n.includes("bed")) return <Bed size={16} />;
  if (n.includes("kitchen") || n.includes("utensil")) return <Utensils size={16} />;
  if (n.includes("care") || n.includes("heart")) return <Heart size={16} />;
  if (n.includes("second") || n.includes("deal")) return <Recycle size={16} />;
  if (n.includes("snack") || n.includes("cookie")) return <Cookie size={16} />;
  if (n.includes("study") || n.includes("book")) return <Book size={16} />;
  if (n.includes("tech") || n.includes("gadget")) return <Smartphone size={16} />;
  return <LayoutGrid size={16} />;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catQuery = query(collection(db, "categories"));
        const catSnap = await getDocs(catQuery);
        const fetchedCats = catSnap.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name || doc.id,
          icon: doc.data().icon
        }));
        // Optional: Sort categories alphabetically
        fetchedCats.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(fetchedCats);

        // Fetch Products
        const q = query(collection(db, "listings"));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled Product",
            description: data.description || "",
            final_price: data.price || 0,
            seller_lat: data.seller_lat || 0,
            seller_lng: data.seller_lng || 0,
            image: data.image || data.imageUrl || data.images?.[0] || "",
            category: data.category || ""
          };
        });
        setProducts(fetchedProducts);
      } catch (err: any) {
        setError(err.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-primary font-bold text-xl animate-pulse">Loading Unimart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-error font-semibold">Failed to load: {error}</div>
      </div>
    );
  }

  const filteredProducts = activeCategory 
    ? products.filter(p => p.category === activeCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Categories Sidebar (Jumia Style) */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded shadow-sm overflow-hidden border border-gray-100">
            <h3 className="px-4 py-3 bg-gray-50 border-b font-bold text-foreground flex items-center gap-2 text-sm uppercase">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              Categories
            </h3>
            <ul className="text-sm">
              <li 
                onClick={() => setActiveCategory(null)}
                className={`cursor-pointer px-4 py-3 flex items-center gap-3 transition-colors ${
                  activeCategory === null 
                    ? "bg-orange-50 text-primary font-semibold border-l-4 border-primary" 
                    : "text-foreground hover:text-primary hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                <Globe size={16} />
                <span>All Products</span>
              </li>
              
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li 
                    key={cat.id} 
                    onClick={() => setActiveCategory(cat.id)}
                    className={`cursor-pointer px-4 py-3 flex items-center gap-3 transition-colors ${
                      activeCategory === cat.id 
                        ? "bg-orange-50 text-primary font-semibold border-l-4 border-primary" 
                        : "text-foreground hover:text-primary hover:bg-gray-50 border-l-4 border-transparent"
                    }`}
                  >
                    {getCategoryIcon(cat.name)}
                    <span>{cat.name}</span>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-muted-foreground italic">No categories found.</li>
              )}
            </ul>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {/* Promo Banner Placeholder */}
          {!activeCategory && (
            <div className="w-full h-48 md:h-64 bg-gradient-to-r from-orange-400 to-primary rounded shadow-sm mb-6 flex items-center justify-center text-white text-3xl font-extrabold text-center px-4">
              UNIMART FLASH SALES<br/>UP TO 50% OFF!
            </div>
          )}

          <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-foreground mb-4 border-b border-gray-200 pb-2">
              {activeCategory 
                ? `${categories.find(c => c.id === activeCategory)?.name || "Category"} Products` 
                : "Top Selling Items"}
            </h2>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                <p className="text-lg font-semibold text-foreground">No products found in this category.</p>
                <p className="text-muted-foreground mt-2">Try browsing other categories.</p>
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="mt-4 btn-primary"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
