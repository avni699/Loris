const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'no-reply@trusan-electronics.com';
const SUPPORT_WHATSAPP = process.env.SUPPORT_WHATSAPP || '0780275685';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

let twilioClient;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

async function sendSms(to, message) {
  if (twilioClient && TWILIO_PHONE_NUMBER) {
    try {
      const sms = await twilioClient.messages.create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to: to
      });
      console.log('[TWILIO SMS] Sent', sms.sid);
      return { success: true, provider: 'twilio', sid: sms.sid };
    } catch (error) {
      console.error('[TWILIO SMS] Error sending SMS:', error.message || error);
      return { success: false, error: error.message || error.toString() };
    }
  }

  console.log(`[SMS FALLBACK] To: ${to}, Message: ${message}`);
  return { success: false, fallback: true };
}

async function sendEmail(to, subject, html, text) {
  if (SENDGRID_API_KEY) {
    try {
      const msg = {
        to,
        from: SENDGRID_FROM_EMAIL,
        subject,
        text: text || html.replace(/<[^>]*>/g, ''),
        html
      };
      const response = await sgMail.send(msg);
      console.log('[SENDGRID] Email sent to', to);
      return { success: true, response };
    } catch (error) {
      console.error('[SENDGRID] Error sending email:', error.message || error);
      return { success: false, error: error.message || error.toString() };
    }
  }

  console.log(`[EMAIL FALLBACK] To: ${to}, Subject: ${subject}, Body: ${text || html}`);
  return { success: false, fallback: true };
}

async function sendEmailVerification(email, code) {
  const subject = 'Verify your Trusan Electronics email';
  const html = `
    <p>Hello,</p>
    <p>Your Trusan Electronics email verification code is <strong>${code}</strong>.</p>
    <p>This code is valid for 10 minutes.</p>
    <p>If you need support, message us on WhatsApp: <strong>+256 780 275 685</strong>.</p>
  `;
  const text = `Your Trusan Electronics email verification code is ${code}. Valid for 10 minutes. Support WhatsApp: +256 780 275 685.`;
  return sendEmail(email, subject, html, text);
}

async function sendOrderConfirmationEmail(email, order) {
  const subject = `Trusan Electronics Order ${order.id} Confirmation`;
  const htmlItems = order.cartItems.map((item) => `<li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>`).join('');
  const html = `
    <p>Hi ${order.customerName},</p>
    <p>Thank you for your order. Your order <strong>${order.id}</strong> has been received.</p>
    <p><strong>Order details:</strong></p>
    <ul>${htmlItems}</ul>
    <p>Total: <strong>$${order.total.toFixed(2)}</strong></p>
    <p>Shipping address:</p>
    <p>${order.shipping.address}, ${order.shipping.city}, ${order.shipping.zip}</p>
    <p>Status: ${order.status}</p>
    <p>For support, contact WhatsApp: <strong>+256 780 275 685</strong>.</p>
  `;
  const text = `Hi ${order.customerName}, your order ${order.id} has been received. Total: $${order.total.toFixed(2)}. Ship to ${order.shipping.address}, ${order.shipping.city}, ${order.shipping.zip}. Status: ${order.status}. Support WhatsApp: +256 780 275 685.`;
  return sendEmail(email, subject, html, text);
}

async function sendOrderStatusSms(phoneNumber, orderId, status, message) {
  const smsMessage = `Trusan Electronics: Order ${orderId} is now '${status}'. ${message || ''} Support WhatsApp: +256 780 275 685.`;
  return sendSms(phoneNumber, smsMessage);
}

module.exports = {
  sendSms,
  sendEmail,
  sendEmailVerification,
  sendOrderConfirmationEmail,
  sendOrderStatusSms,
  SUPPORT_WHATSAPP
};
