"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/contexts/EventsContext";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import Button from "@/components/UI Components/Button";
import { submitTicketOrder, initiateMpesaPayment, getMpesaPaymentStatus } from "@/lib/api";
import { Smartphone, CreditCard, CheckCircle, Clock, XCircle, ArrowLeft } from "lucide-react";

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
    mpesaNumber: currentUser?.phone || ""
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'pending', 'checking', 'success', 'failed'
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);

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

    if (!formData.mpesaNumber.trim()) {
      newErrors.mpesaNumber = "M-PESA number is required";
    } else if (!/^(\+254|0)7\d{8}$/.test(formData.mpesaNumber.replace(/\s/g, ""))) {
      newErrors.mpesaNumber = "Please enter a valid M-PESA number (e.g., 0712345678)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompletePayment = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('pending');

    try {
      // Submit order to backend
      const orderResult = await submitTicketOrder(
        cartItems,
        currentUser?.id || "guest",
        {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone
        }
      );
      
      // Check order status
      if (orderResult.status === "insufficient_stock") {
        alert("Sorry! Some items in your cart are no longer available. Please review and try again.");
        router.push("/eg-cart");
        setIsProcessing(false);
        setPaymentStatus(null);
        return;
      }

      if (orderResult.status !== "ok") {
        alert("Order processing failed. Please try again.");
        setIsProcessing(false);
        setPaymentStatus(null);
        return;
      }

      const orderId = orderResult.orderId;

      // Initiate M-Pesa STK Push
      const mpesaResult = await initiateMpesaPayment(
        formData.mpesaNumber,
        getCartTotal(),
        orderId
      );

      if (!mpesaResult.success) {
        alert(`M-Pesa payment failed: ${mpesaResult.message || "Please try again."}`);
        setIsProcessing(false);
        setPaymentStatus('failed');
        return;
      }

      setCheckoutRequestId(mpesaResult.checkoutRequestId);
      setPaymentStatus('checking');

      // Poll for payment status (check every 3 seconds for up to 60 seconds)
      let attempts = 0;
      const maxAttempts = 20;
      
      const checkPayment = setInterval(async () => {
        attempts++;
        
        try {
          const statusResult = await getMpesaPaymentStatus(mpesaResult.checkoutRequestId);
          
          if (statusResult.success && statusResult.transaction) {
            const txStatus = statusResult.transaction.status;
            
            if (txStatus === 'completed') {
              clearInterval(checkPayment);
              setPaymentStatus('success');
              
              // Clear cart after successful payment
              if (typeof clearCart === 'function') {
                clearCart();
              }
              
              // Show success message
              setTimeout(() => {
                alert(`✅ Payment successful! Your order #${orderId} has been confirmed.\n\nReceipt: ${statusResult.transaction.mpesaReceiptNumber || 'N/A'}\n\nYour tickets are ready!`);
                router.push("/eg-orders");
              }, 1000);
              
              setIsProcessing(false);
            } else if (txStatus === 'failed') {
              clearInterval(checkPayment);
              setPaymentStatus('failed');
              alert(`❌ Payment failed: ${statusResult.transaction.resultDescription || "Transaction was not completed"}`);
              setIsProcessing(false);
            }
          }
          
          // Stop checking after max attempts
          if (attempts >= maxAttempts) {
            clearInterval(checkPayment);
            setPaymentStatus('failed');
            alert("⏱️ Payment verification timed out. Please check your M-Pesa messages and contact support if money was deducted.");
            setIsProcessing(false);
          }
        } catch (error) {
          console.error("Payment status check error:", error);
          // Continue checking unless max attempts reached
          if (attempts >= maxAttempts) {
            clearInterval(checkPayment);
            setPaymentStatus('failed');
            setIsProcessing(false);
          }
        }
      }, 3000);

    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message || "Please try again."}`);
      setIsProcessing(false);
      setPaymentStatus('failed');
    }
  };

  const totalAmount = getCartTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back to Home Button */}
          <button
            onClick={() => router.push('/eg-events')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-700 text-base">Ready to Complete Your Purchase</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., 0712345678"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="e.g., john.doe@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Information</h2>
              <p className="text-base font-medium text-gray-900 mb-6">Complete your purchase with M-PESA</p>

              {/* M-PESA Branding */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600 text-white p-3 rounded-lg">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Pay with M-PESA</h3>
                    <p className="text-sm font-semibold text-green-700">Safe, Fast & Secure</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm font-medium text-gray-900">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Enter your M-PESA phone number below</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>You'll receive an STK push on your phone</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <span>Enter your M-PESA PIN to complete payment</span>
                  </div>
                </div>
              </div>

              {/* M-PESA Number Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  M-PESA Phone Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <input
                    type="tel"
                    name="mpesaNumber"
                    value={formData.mpesaNumber}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder:text-gray-500 placeholder:font-medium ${
                      errors.mpesaNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="e.g., 0712345678 or 254712345678"
                  />
                </div>
                {errors.mpesaNumber && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    {errors.mpesaNumber}
                  </p>
                )}
                <p className="text-sm font-medium text-gray-800 mt-1">
                  This number will receive the payment prompt
                </p>
              </div>
            </div>

            {/* Payment Status Display */}
            {paymentStatus && (
              <div className={`rounded-lg p-4 mb-6 border ${
                paymentStatus === 'pending' ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700' :
                paymentStatus === 'checking' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700' :
                paymentStatus === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700' :
                'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
              }`}>
                <div className="flex items-center gap-3">
                  {paymentStatus === 'pending' && (
                    <>
                      <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                      <div>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">Initiating Payment...</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Please wait while we process your request</p>
                      </div>
                    </>
                  )}
                  {paymentStatus === 'checking' && (
                    <>
                      <Smartphone className="w-5 h-5 text-yellow-600 animate-pulse" />
                      <div>
                        <p className="font-semibold text-yellow-900 dark:text-yellow-100">Check Your Phone</p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">Enter your M-PESA PIN on the prompt sent to {formData.mpesaNumber}</p>
                      </div>
                    </>
                  )}
                  {paymentStatus === 'success' && (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900 dark:text-green-100">Payment Successful!</p>
                        <p className="text-sm text-green-700 dark:text-green-300">Your tickets have been confirmed</p>
                      </div>
                    </>
                  )}
                  {paymentStatus === 'failed' && (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-semibold text-red-900 dark:text-red-100">Payment Failed</p>
                        <p className="text-sm text-red-700 dark:text-red-300">Please try again or contact support</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Complete Payment Button */}
            <Button
              variant="primary"
              size="large"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
              onClick={handleCompletePayment}
            >
              {isProcessing ? (
                <>
                  <Clock className="w-5 h-5 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  <span>Pay KSh {totalAmount.toLocaleString()} via M-PESA</span>
                </>
              )}
            </Button>

            {/* Help Text */}
            <p className="text-center text-base text-gray-900 mt-4 font-semibold">
              🔒 Your payment is secure and encrypted
            </p>
          </div>
        </div>
      </div>    </div>
  );
}
