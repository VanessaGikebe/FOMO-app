/**
 * API utility functions for frontend-backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

/**
 * Submit a ticket order to the backend
 * @param {Array} cartItems - Array of cart items with eventId, quantity, pricePerTicket, etc.
 * @param {string} userId - User ID (optional, defaults to "guest")
 * @returns {Promise<Object>} - Order result with status, orderId, and order details
 */
export async function submitTicketOrder(cartItems, userId = "guest") {
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const orderPayload = {
    userId,
    cartItems: cartItems.map(item => ({
      eventId: item.eventId,
      ticketType: item.ticketType || "Standard",
      quantity: item.quantity,
      pricePerTicket: item.pricePerTicket
    }))
  };

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderPayload)
  });

  if (!response.ok) {
    throw new Error(`Order submission failed: ${response.statusText}`);
  }

  const orderResult = await response.json();
  return orderResult;
}

/**
 * Get order details by order ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} - Order details
 */
export async function getOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }

  const order = await response.json();
  return order;
}

/**
 * Get user's orders
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of orders
 */
export async function getUserOrders(userId) {
  const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user orders: ${response.statusText}`);
  }

  const orders = await response.json();
  return orders;
}
