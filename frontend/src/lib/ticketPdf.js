import jsPDF from "jspdf";
import QRCode from "qrcode";

/**
 * Generate a PDF ticket for an order
 * @param {Object} order - Order object with id, items, total, etc.
 * @param {Object} event - Event details (title, date, location, etc.)
 * @param {Object} user - User details (name, email)
 * @returns {Promise<void>}
 */
export async function generateTicketPDF(order, event, user) {
  try {
    // Generate QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(
      JSON.stringify({
        orderId: order.id,
        eventId: event.id,
        userId: user.id,
        ticketCode: `FOMO-${order.id}-${Date.now()}`,
      }),
      { width: 200 }
    );

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Color scheme (FOMO brand colors)
    const primaryColor = [255, 107, 53]; // #FF6B35
    const secondaryColor = [108, 92, 231]; // #6C5CE7
    const darkColor = [51, 51, 51]; // Dark gray

    // Header with gradient effect
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, "F");
    
    // White text on colored header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, "bold");
    doc.text("FOMO", 20, 25);
    
    doc.setFontSize(12);
    doc.setFont(undefined, "normal");
    doc.text("Event Ticket", pageWidth - 20, 25, { align: "right" });

    yPosition = 50;

    // Order and Ticket Info
    doc.setTextColor(...darkColor);
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Ticket Information", 20, yPosition);
    yPosition += 10;

    // Draw info box
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.rect(20, yPosition - 5, pageWidth - 40, 40);

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Order ID: #${order.id}`, 25, yPosition + 3);
    doc.text(`Ticket Holder: ${user.name}`, 25, yPosition + 10);
    doc.text(`Email: ${user.email}`, 25, yPosition + 17);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 25, yPosition + 24);
    doc.text(`Status: CONFIRMED`, 25, yPosition + 31);

    yPosition += 50;

    // Event Details
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Event Details", 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Event: ${event.title}`, 25, yPosition);
    doc.text(`Category: ${event.category}`, 25, yPosition + 7);
    doc.text(`Date: ${event.date}`, 25, yPosition + 14);
    doc.text(`Time: ${event.time}`, 25, yPosition + 21);
    doc.text(`Location: ${event.location}`, 25, yPosition + 28);
    if (event.address) {
      doc.text(`Address: ${event.address}`, 25, yPosition + 35);
      yPosition += 42;
    } else {
      yPosition += 35;
    }

    // Ticket Items
    doc.setFontSize(14);
    doc.setFont(undefined, "bold");
    doc.text("Tickets", 20, yPosition);
    yPosition += 10;

    // Table header
    doc.setFillColor(...secondaryColor);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, "bold");
    doc.setFontSize(9);
    
    const tableY = yPosition;
    doc.rect(20, tableY - 5, pageWidth - 40, 7, "F");
    doc.text("Quantity", 25, tableY);
    doc.text("Event", 60, tableY);
    doc.text("Unit Price", 120, tableY);
    doc.text("Total", 160, tableY);

    // Table rows
    doc.setTextColor(...darkColor);
    doc.setFont(undefined, "normal");
    yPosition = tableY + 8;

    order.items.forEach((item, index) => {
      const itemPrice = item.pricePerTicket || event.price || 0;
      const itemTotal = itemPrice * item.quantity;
      
      doc.text(String(item.quantity), 25, yPosition);
      doc.text(event.title.substring(0, 30), 60, yPosition);
      doc.text(`KShs ${itemPrice.toLocaleString()}`, 120, yPosition);
      doc.text(`KShs ${itemTotal.toLocaleString()}`, 160, yPosition);
      
      yPosition += 8;
    });

    yPosition += 5;

    // Total Amount Box
    doc.setFillColor(...primaryColor);
    doc.rect(20, yPosition, pageWidth - 40, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`Total Amount: KShs ${order.total?.toLocaleString() || getOrderTotal(order).toLocaleString()}`, 25, yPosition + 10);

    yPosition += 25;

    // QR Code (if space available)
    if (yPosition < pageHeight - 50) {
      doc.setTextColor(...darkColor);
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("Scan to Verify Ticket", 20, yPosition);
      yPosition += 8;

      // Add QR code to PDF
      doc.addImage(qrCodeDataUrl, "PNG", 20, yPosition, 40, 40);
    }

    // Footer
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text(
      "This is a digital ticket. Please keep it safe for event entry. Non-transferable.",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`FOMO_Ticket_${order.id}.pdf`);
  } catch (error) {
    console.error("Error generating PDF ticket:", error);
    throw error;
  }
}

/**
 * Calculate total from order items
 */
function getOrderTotal(order) {
  if (order.total) return order.total;
  return order.items.reduce((sum, item) => {
    return sum + (item.quantity * (item.pricePerTicket || 0));
  }, 0);
}
