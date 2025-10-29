const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: `Garden Grains Restaurant <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #d4af37;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #2c5530;
              margin-bottom: 10px;
            }
            .tagline {
              color: #666;
              font-style: italic;
            }
            .content {
              margin-bottom: 30px;
            }
            .footer {
              border-top: 1px solid #eee;
              padding-top: 20px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background-color: #d4af37;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 0;
            }
            .highlight {
              background-color: #f0f8f0;
              padding: 15px;
              border-left: 4px solid #d4af37;
              margin: 15px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🌱 Garden Grains</div>
              <div class="tagline">Fresh • Healthy • Delicious</div>
            </div>
            <div class="content">
              ${htmlContent}
            </div>
            <div class="footer">
              <p>Garden Grains Restaurant</p>
              <p>123 Green Street, Garden City, GC 12345</p>
              <p>Phone: +1 (555) 123-4567 | Email: info@gardengrains.com</p>
              <p>© 2024 Garden Grains Restaurant. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };
