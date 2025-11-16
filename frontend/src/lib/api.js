/**
 * API utility functions for frontend-backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

/**
 * Test if backend is reachable
 * @returns {Promise<boolean>} - True if backend is reachable
 */
export async function testBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/test`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (response.ok) {
      const text = await response.text();
      console.log('✅ Backend connection successful:', text);
      return true;
    }
  } catch (err) {
    console.error('❌ Backend connection failed:', err);
  }
  
  return false;
}

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
    cartItems: cartItems.map((item) => ({
      eventId: item.eventId,
      ticketType: item.ticketType || "Standard",
      quantity: item.quantity,
      pricePerTicket: item.pricePerTicket,
    })),
  };

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
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
      "Content-Type": "application/json",
    },
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
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user orders: ${response.statusText}`);
  }

  const orders = await response.json();
  return orders;
}

// ============ USER MANAGEMENT ============

/**
 * Update user role to organizer
 * @param {string} userId - User ID
 * @param {string} role - New role (organizer, attendee, moderator)
 * @param {string} authToken - Firebase auth token
 * @returns {Promise<Object>} - Update result
 */
export async function updateUserRole(userId, role, authToken) {
  const headers = {
    "Content-Type": "application/json"
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/auth/set-role`, {
    method: "POST",
    headers,
    body: JSON.stringify({ userId, role })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return { error: error.message || `Failed to update role: ${response.statusText}` };
  }

  return await response.json();
}

/**
 * Get current user info
 * @param {string} authToken - Firebase auth token
 * @returns {Promise<Object>} - User info
 */
export async function getCurrentUser(authToken) {
  if (!authToken) {
    return { error: "No auth token provided" };
  }

  const response = await fetch(`${API_BASE_URL}/auth/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return { error: error.message || `Failed to fetch user: ${response.statusText}` };
  }

  return await response.json();
}

// ============ EVENT DISCOVERY ============

/**
 * Get all events from the backend
 * @param {boolean} includeUnapproved - Whether to include unapproved events (for organizers)
 * @returns {Promise<Array>} - Array of all events
 */
export async function getAllEvents(includeUnapproved = false) {
  try {
    const endpoint = includeUnapproved 
      ? `${API_BASE_URL}/events?includeUnapproved=true` 
      : `${API_BASE_URL}/events`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    console.error('getAllEvents error:', err);
    return []; // Return empty array on error
  }
}

// ============ ORGANIZER EVENT MANAGEMENT ============

/**
 * Get all events for a specific organizer
 * @param {string} organizerId - Organizer/User ID
 * @returns {Promise<Array>} - Array of organizer's events
 */
export async function getEventsByOrganizer(organizerId) {
  const response = await fetch(
    `${API_BASE_URL}/events/organizer/${organizerId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    return {
      error:
        error.message ||
        `Failed to fetch organizer events: ${response.statusText}`,
    };
  }

  const events = await response.json();
  return events;
}

/**
 * Create a new event
 * @param {Object} eventData - Event details
 * @param {string} authToken - Firebase auth token (optional)
 * @returns {Promise<Object>} - Created event with ID
 */
export async function createOrganizerEvent(eventData, authToken = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(
        errorData.message || `Failed to create event: ${response.statusText}`
      );
    }

    const result = await response.json();
    console.log('Event created successfully:', result);
    return result;
  } catch (err) {
    console.error('createOrganizerEvent error:', err);
    throw err;
  }
}

/**
 * Get event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Event details
 */
export async function getEventDetails(eventId) {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch event: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Update an existing event
 * @param {string} eventId - Event ID
 * @param {Object} updateData - Updated event details
 * @param {string} authToken - Firebase auth token (optional)
 * @returns {Promise<Object>} - Updated event
 */
export async function updateOrganizerEvent(
  eventId,
  updateData,
  authToken = null
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to update event: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Delete an event
 * @param {string} eventId - Event ID
 * @param {string} authToken - Firebase auth token (optional)
 * @returns {Promise<Object>} - Deletion confirmation
 */
export async function deleteOrganizerEvent(eventId, authToken = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to delete event: ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Get event metrics
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} - Event metrics (visits, sales, etc.)
 */
export async function getEventMetrics(eventId) {
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/metrics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    console.warn(`Failed to fetch metrics for event ${eventId}`);
    return null;
  }

  return response.json();
}
