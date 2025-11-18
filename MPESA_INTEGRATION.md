# M-PESA Daraja API Integration Guide

## Overview
This application now uses M-PESA's Daraja API for secure payment processing. M-PESA is Kenya's leading mobile money platform with over 30 million users.

## Features Implemented

### Backend (NestJS)
- **M-PESA Service** (`mpesa.service.ts`): Handles all M-PESA API interactions
  - OAuth token generation
  - STK Push (Lipa na M-Pesa Online) initiation
  - Payment callback handling
  - Transaction status queries
  - Firestore integration for transaction tracking

- **M-PESA Controller** (`mpesa.controller.ts`): REST endpoints
  - `POST /mpesa/initiate` - Initiate payment
  - `POST /mpesa/callback` - M-PESA callback (webhook)
  - `GET /mpesa/status/:checkoutRequestId` - Check payment status
  - `GET /mpesa/query/:checkoutRequestId` - Query M-PESA API directly

- **Payment Flow**:
  1. User submits order (creates order in Firestore)
  2. Backend initiates STK Push to user's phone
  3. User enters M-PESA PIN on their phone
  4. M-PESA sends callback to backend
  5. Backend updates order status to "confirmed" and payment to "paid"
  6. Frontend polls status and shows success message

### Frontend (Next.js)
- **Enhanced Checkout Page**: Beautiful M-PESA-branded UI
  - Removed Card and Bank Transfer options
  - M-PESA green branding with icons
  - Real-time payment status tracking
  - STK push instructions
  - Phone number validation (254XXXXXXXXX format)
  - Payment status indicators (pending, checking, success, failed)

- **API Functions** (`lib/api.js`):
  - `initiateMpesaPayment()` - Trigger STK push
  - `getMpesaPaymentStatus()` - Check transaction status

## Setup Instructions

### 1. Get M-PESA Daraja API Credentials

#### For Testing (Sandbox)
1. Go to https://developer.safaricom.co.ke/
2. Click "Get Started" or "Sign Up"
3. Create an account with your email
4. Verify your email
5. Log in to the Daraja Portal
6. Click "My Apps" in the navigation
7. Click "Create New App"
8. Fill in app details:
   - **App Name**: FOMO Ticket System (or your choice)
   - **Description**: Event ticketing platform
9. Select APIs to enable:
   - ✅ **Lipa Na M-Pesa Online** (STK Push)
10. Click "Create App"
11. You'll receive:
   - **Consumer Key** (like: `XYZ123abc...`)
   - **Consumer Secret** (like: `ABC456def...`)

#### Get Sandbox Credentials
1. In your app dashboard, you'll see sandbox credentials
2. Copy the following:
   - **Consumer Key**
   - **Consumer Secret**
   - **Shortcode**: Usually `174379` for sandbox
   - **Passkey**: Provided in sandbox documentation (check "Test Credentials" section)

### 2. Configure Backend Environment Variables

Edit `backend/.env` file:

```env
# M-Pesa Daraja API Configuration
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_sandbox_passkey_here
MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback
```

**Important Notes**:
- For **sandbox testing**, use test phone numbers provided by Safaricom (usually starts with 254708...)
- The **callback URL** must be publicly accessible. For local development:
  - Use ngrok: `ngrok http 3002` to get a public URL
  - Or use a tool like localtunnel
  - Update `MPESA_CALLBACK_URL` with the public URL + `/mpesa/callback`
  - Example: `https://abc123.ngrok.io/mpesa/callback`

### 3. Production Setup (When Ready to Go Live)

1. **Apply for Production Access**:
   - Go to Daraja Portal
   - Navigate to "Go Live" section
   - Fill out the application form
   - Provide business details and KYC documents
   - Wait for approval (usually 3-5 business days)

2. **Get Production Credentials**:
   - Once approved, you'll receive production credentials
   - Your **Shortcode** will be your actual M-PESA Paybill/Till number
   - Production **Passkey** will be different from sandbox

3. **Update Environment Variables**:
```env
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=prod_consumer_key
MPESA_CONSUMER_SECRET=prod_consumer_secret
MPESA_SHORTCODE=your_paybill_number
MPESA_PASSKEY=prod_passkey
MPESA_CALLBACK_URL=https://fomo-app.com/api/mpesa/callback
```

4. **SSL Certificate Required**:
   - Production callback URL MUST use HTTPS
   - Ensure your domain has a valid SSL certificate

### 4. Testing the Integration

#### Test with Sandbox:
1. Start backend: `cd backend && npm run start:dev`
2. Start frontend: `cd frontend && npm run dev`
3. Add items to cart and proceed to checkout
4. Use a test phone number: `254708374149` (Safaricom sandbox test number)
5. Click "Pay via M-PESA"
6. You'll see a simulated STK push (in sandbox, it auto-completes)

#### Test Phone Numbers (Sandbox):
- Success: `254708374149`
- Insufficient Funds: `254708374150`
- Invalid PIN: `254708374151`

### 5. Firestore Collections Created

The integration creates/uses these collections:

#### `mpesa_transactions`
```javascript
{
  checkoutRequestId: "ws_CO_12345678",
  merchantRequestId: "12345-67890",
  orderId: "ord000001",
  phoneNumber: "254712345678",
  amount: 5000,
  status: "pending" | "completed" | "failed",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  mpesaReceiptNumber: "ABC123XYZ", // on success
  resultCode: 0, // 0 = success
  resultDescription: "The service request is processed successfully"
}
```

#### `orders` (Updated Fields)
```javascript
{
  // ... existing fields
  status: "reserved" | "confirmed" | "cancelled",
  paymentStatus: "pending" | "paid" | "failed",
  mpesaReceiptNumber: "ABC123XYZ",
  failureReason: "User cancelled transaction"
}
```

## API Endpoints

### Initiate Payment
```bash
POST http://localhost:3002/mpesa/initiate
Content-Type: application/json

{
  "phoneNumber": "254712345678",
  "amount": 5000,
  "orderId": "ord000001",
  "accountReference": "FOMO Tickets",
  "transactionDesc": "Event tickets payment"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment request sent to your phone",
  "checkoutRequestId": "ws_CO_12345678",
  "merchantRequestId": "12345-67890"
}
```

### Check Payment Status
```bash
GET http://localhost:3002/mpesa/status/ws_CO_12345678
```

**Response**:
```json
{
  "success": true,
  "transaction": {
    "status": "completed",
    "mpesaReceiptNumber": "ABC123XYZ",
    "amount": 5000,
    "phoneNumber": "254712345678"
  }
}
```

### M-PESA Callback (Webhook)
```bash
POST http://localhost:3002/mpesa/callback
Content-Type: application/json

# This endpoint receives automatic callbacks from M-PESA
# You don't call this manually - M-PESA calls it
```

## Security Best Practices

1. **Never commit credentials to Git**:
   - Add `.env` to `.gitignore`
   - Use environment variables in production

2. **Validate callback authenticity**:
   - The current implementation logs all callbacks
   - Consider adding IP whitelisting for M-PESA IPs

3. **Use HTTPS in production**:
   - M-PESA requires HTTPS for callbacks
   - Get SSL certificate (Let's Encrypt is free)

4. **Rate limiting**:
   - Consider adding rate limiting to prevent abuse
   - Use NestJS throttler module

5. **Monitor transactions**:
   - Set up logging and monitoring
   - Track failed transactions
   - Set up alerts for anomalies

## Troubleshooting

### Common Issues:

#### "Failed to authenticate with M-PESA"
- Check Consumer Key and Secret are correct
- Ensure no extra spaces in .env file
- Verify you're using correct environment (sandbox vs production)

#### "Invalid phone number format"
- Phone must be in format: `254XXXXXXXXX`
- Must be a valid Safaricom number (starts with 254)
- Remove any spaces or special characters

#### "Callback not received"
- Ensure callback URL is publicly accessible
- Check firewall/security settings
- Verify URL is correct (no typos)
- For local testing, use ngrok or similar

#### "Transaction timeout"
- User might have delayed entering PIN
- Check M-PESA service status
- Verify transaction in Firestore manually

#### "Insufficient balance"
- In sandbox, some test numbers simulate this
- In production, user actually has insufficient M-PESA balance

## Support Resources

- **Daraja Documentation**: https://developer.safaricom.co.ke/Documentation
- **API Explorer**: https://developer.safaricom.co.ke/APIs
- **Support Email**: apisupport@safaricom.co.ke
- **Developer Forum**: https://developer.safaricom.co.ke/forum

## Next Steps

1. **Get your Daraja credentials** from https://developer.safaricom.co.ke/
2. **Update backend/.env** with your credentials
3. **Set up ngrok** for local callback testing: `ngrok http 3002`
4. **Update MPESA_CALLBACK_URL** in .env with ngrok URL
5. **Restart backend** to load new environment variables
6. **Test payment** with sandbox test number
7. **Go live** when ready (apply for production access)

## Files Modified

### Backend:
- `src/mpesa/mpesa.service.ts` - Core M-PESA logic
- `src/mpesa/mpesa.controller.ts` - API endpoints
- `src/mpesa/mpesa.module.ts` - NestJS module
- `src/mpesa/dto/initiate-payment.dto.ts` - Request validation
- `src/mpesa/dto/mpesa-callback.dto.ts` - Callback data structure
- `src/app.module.ts` - Added MpesaModule import
- `.env` - M-PESA credentials
- `package.json` - Added axios dependency

### Frontend:
- `src/app/(eventGoer)/eg-checkout/page.js` - M-PESA UI and payment flow
- `src/lib/api.js` - M-PESA API functions
- Payment method dropdown removed
- M-PESA branding and instructions added
- Real-time payment status tracking
- STK push polling mechanism

---

**Happy Coding! 🎉**

For questions or issues, check the troubleshooting section or refer to Safaricom's official documentation.
