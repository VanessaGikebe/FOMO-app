"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/contexts/EventsContext";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Footer from "@/components/UI Components/Footer";
import Button from "@/components/UI Components/Button";

export default function CheckoutPage() {
  const { cartItems, getCartTotal, clearCart } = useEvents();
  const { currentUser } = useUser();
  const router = useRouter();

  // Form state with pre-filled user data if available
  const [formData, setFormData] = useState({
    firstName: currentUser?.name?.split(" ")[0] || "",
    lastName: currentUser?.name?.split(" ").slice(1).join(" ") || "",
    phone: currentUser?.phone || "",
    email: currentUser?.email || "",
    paymentMethod: "MPESA",
    mpesaNumber: ""
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to cart if empty 
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      router.push("/eg-cart");
    }
  }, [cartItems, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+254|0)7\d{8}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid Kenyan phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.paymentMethod === "MPESA" && !formData.mpesaNumber.trim()) {
      newErrors.mpesaNumber = "MPESA number is required";
    } else if (formData.paymentMethod === "MPESA" && !/^(\+254|0)7\d{8}$/.test(formData.mpesaNumber.replace(/\s/g, ""))) {
      newErrors.mpesaNumber = "Please enter a valid MPESA number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompletePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));


      // Clear cart after successful payment
      if (typeof clearCart === 'function') {
        clearCart();
      }
      
      // Show success message
      alert("Payment successful! Your tickets have been confirmed.");
      
      // Redirect to events page
      router.push("/eg-events");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const totalAmount = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Ready to Complete Your Purchase</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Phone Number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Information</h2>
              <p className="text-sm text-gray-600 mb-6">Choose Your Payment Method</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Method Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="MPESA">MPESA</option>
                    <option value="Card">Card</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>

                {/* MPESA Number */}
                {formData.paymentMethod === "MPESA" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter MPESA Number
                    </label>
                    <input
                      type="tel"
                      name="mpesaNumber"
                      value={formData.mpesaNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black ${
                        errors.mpesaNumber ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="MPESA Number"
                    />
                    {errors.mpesaNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.mpesaNumber}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900">Total Amount</span>
                <span className="text-xl font-bold text-gray-900">
                  Kshs {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Complete Payment Button */}
            <Button
              variant="primary"
              size="large"
              className="w-full"
              disabled={isProcessing}
              onClick={handleCompletePayment}
            >
              {isProcessing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
