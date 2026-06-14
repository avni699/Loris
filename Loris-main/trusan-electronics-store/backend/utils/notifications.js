// Email and SMS notification utilities
const nodemailer = require('nodemailer');

// Configure email service (using a default or environment variable)
let emailTransporter = null;

function initializeEmailTransport() {
  if (process.env.SENDGRID_API_KEY) {
    // Using SendGrid
    const sgTransport = require('nodemailer-sendgrid-transport');
    emailTransporter = nodemailer.createTransport(
      sgTransport({
        auth: {
          api_key: process.env.SENDGRID_API_KEY
        }
      })
    );
  } else {
    // Fallback: console logging for development
    console.warn('No email service configured. Set SENDGRID_API_KEY for email functionality.');
  }
}

// Initialize on module load
initializeEmailTransport();

async function sendEmailVerification(email, code) {
  if (!emailTransporter) {
    console.log(`[DEV MODE] Email verification code for ${email}: ${code}`);
    return Promise.resolve();
  }

  const mailOptions = {
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@trusan-electronics.com',
    to: email,
    subject: 'Email Verification - Loris E-9',
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `
  };

  try {
    await emailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

async function sendEmail(email, subject, html) {
  if (!emailTransporter) {
    console.log(`[DEV MODE] Email to ${email}: ${subject}`);
    return Promise.resolve();
  }

  const mailOptions = {
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@trusan-electronics.com',
    to: email,
    subject,
    html
  };

  try {
    await emailTransporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}

module.exports = {
  sendEmailVerification,
  sendEmail
};
