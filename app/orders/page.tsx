"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/navigation";

type Order = {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  status: string;
  createdAt: any;
};

const STATUS_MAP: Record<string, { label: string; color: string; progress: number }> = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-100", progress: 10 },
  WAITING_RIDER: { label: "Waiting for Rider", color: "text-blue-600 bg-blue-100", progress: 25 },
  RIDER_ASSIGNED: { label: "Rider Assigned", color: "text-indigo-600 bg-indigo-100", progress: 40 },
  AT_PICKUP: { label: "At Pickup Location", color: "text-purple-600 bg-purple-100", progress: 60 },
  IN_TRANSIT: { label: "In Transit", color: "text-orange-600 bg-orange-100", progress: 80 },
  DELIVERED: { label: "Delivered", color: "text-green-600 bg-green-100", progress: 100 },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, "orders"),
          where("buyerId", "==", user.id)
          // Note: orderBy requires a composite index in Firestore if combined with where.
          // For simplicity, we fetch and sort on the client if index doesn't exist, but let's try direct first.
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            productId: data.productId,
            productTitle: data.productTitle || "Unknown Product",
            productImage: data.productImage || "",
            price: data.price || 0,
            status: data.status || "pending",
            createdAt: data.createdAt?.toDate() || new Date(),
          };
        });
        
        // Sort descending by date
        fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setOrders(fetchedOrders);
      } catch (err: any) {
        setError(err.message || "Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-primary font-bold text-xl animate-pulse">Loading Orders...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-extrabold text-foreground mb-6">My Orders & Tracking</h1>

      {error && (
        <div className="p-4 bg-red-50 text-error rounded-md text-sm border border-red-100 mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="card-standard text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <h2 className="text-xl font-bold text-foreground mb-2">You haven't placed any orders yet.</h2>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
          <button onClick={() => router.push("/")} className="btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.pending;

            return (
              <div key={order.id} className="card-standard border border-gray-200">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {order.productImage ? (
                        <img src={order.productImage} alt={order.productTitle} className="object-cover w-full h-full" />
                      ) : (
                        <span className="text-gray-400 text-xs">No Image</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{order.productTitle}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Order ID: {order.id}</p>
                      <p className="text-sm text-muted-foreground">Date: {order.createdAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xl font-extrabold text-foreground mb-2">
                      ₦{order.price.toLocaleString("en-NG", { minimumFractionDigits: 0 })}
                    </p>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Progress Bar for Tracking */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2">
                    <span>Order Placed</span>
                    <span>Processing</span>
                    <span>In Transit</span>
                    <span>Delivered</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${statusInfo.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
