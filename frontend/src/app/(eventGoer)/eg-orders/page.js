"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { getUserOrders } from "@/lib/api";
import Button from "@/components/UI Components/Button";
import Footer from "@/components/UI Components/Footer";
import { Calendar, MapPin, Ticket, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OrderHistoryPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser?.uid) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await getUserOrders(currentUser.uid);
        if (result?.orders) {
          setOrders(result.orders);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [currentUser?.uid]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your order history.
          </p>
          <Button onClick={() => router.push("/signin")}>Sign In</Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.back()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-4xl font-bold text-gray-900">Order History</h1>
              </div>
              <p className="text-gray-600">View and manage your past ticket purchases</p>
            </div>
            <Ticket className="w-12 h-12 text-purple-600" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start exploring events and purchase tickets to see them here!
              </p>
              <Link href="/eg-events">
                <Button>Browse Events</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order }) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTotalPrice = () => {
    if (!order.items) return 0;
    return order.items.reduce((sum, item) => {
      return sum + (item.quantity * item.pricePerTicket || 0);
    }, 0);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      reserved: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return statusStyles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Order Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
            <p className="text-sm text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(order.status)}`}>
            {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-6 py-4">
        <div className="space-y-3">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-purple-600" />
                <span className="text-gray-900 font-medium">
                  {item.quantity}x {item.ticketType || "Standard"} Ticket
                  {item.quantity > 1 ? "s" : ""}
                </span>
              </div>
              <span className="font-semibold text-gray-900">
                KES {(item.quantity * item.pricePerTicket || 0).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-purple-600">
            KES {getTotalPrice().toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
