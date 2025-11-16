"use client";

import { useEvents } from "@/contexts/EventsContext";
import { useRouter } from "next/navigation";
import Button from "@/components/UI Components/Button";

export default function CartPage() {
  // Use EventsContext cart API
  const { cartItems = [], updateCartQuantity, removeFromCart, getCartTotal } = useEvents();
  const router = useRouter();

  const handleCheckout = () => {
    if (!cartItems || cartItems.length === 0) return;
    router.push("/eg-checkout");
  };

  const handleContinueShopping = () => {
    router.push("/eg-events");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">Review Your Tickets Before You Purchase Them</p>
          </div>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {(!cartItems || cartItems.length === 0) ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <div className="mb-4">
                  <span className="text-6xl">🛒</span>
                </div>
                <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
                <Button 
                  variant="primary" 
                  onClick={handleContinueShopping}
                >
                  Browse Events
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateCartQuantity}
                  onDelete={removeFromCart}
                />
              ))
            )}
          </div>

          {/* Total Amount Section */}
          {cartItems && cartItems.length > 0 && (
            <>
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">
                    Kshs {getCartTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  size="large" 
                  className="flex-1"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="primary" 
                  size="large" 
                  className="flex-1"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </div>    </div>
  );
}

// Cart Item Component - handles individual cart items
function CartItem({ item, onUpdateQuantity, onDelete }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Section - Event Details */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xl font-bold text-gray-900">{item.eventName}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-semibold text-gray-900">Venue: </span>
              <span className="text-gray-600">{item.venue}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Date: </span>
              <span className="text-gray-600">{item.date}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Time: </span>
              <span className="text-gray-600">{item.time}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div>
              <span className="font-semibold text-gray-900">Ticket Type: </span>
              <span className="text-gray-600">{item.ticketType}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Tickets Available: </span>
              <span className="text-gray-600">{item.ticketsAvailable}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-900">Kshs </span>
              <span className="text-gray-600">{(Number(item.pricePerTicket) || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Subtotal for this item */}
          <div className="pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-900">Subtotal: </span>
            <span className="text-gray-900 font-bold">
              Kshs {((Number(item.pricePerTicket) || 0) * (item.quantity || 0)).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Right Section - Quantity & Delete */}
        <div className="flex flex-col justify-between items-end gap-3">
          {/* Quantity Input */}
          <div className="flex flex-col items-end gap-1">
            <label className="text-xs text-gray-600 font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              max={item.ticketsAvailable}
              value={item.quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                const validQuantity = Math.min(value, item.ticketsAvailable);
                // EventsContext expects updateCartQuantity(itemId, quantity)
                onUpdateQuantity(item.id, validQuantity);
              }}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(item.id)}
            className="bg-black text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors w-full"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
