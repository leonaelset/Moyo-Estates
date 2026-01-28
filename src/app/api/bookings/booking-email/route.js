import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const booking = await req.json();

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,        // e.g., smtp.gmail.com
      port: process.env.SMTP_PORT || 465,
      secure: true,                       // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,      // your email
        pass: process.env.SMTP_PASS,      // your email password or app password
      },
    });

    // Build email content
    const mailOptions = {
      from: `"Moyo Estates" <${process.env.SMTP_USER}>`,
      to: booking.email, // must include customer email in summary
      subject: `Booking Confirmation - ${booking.packageName}`,
      html: `
        <h1>Thank You for Booking with Moyo Estates!</h1>
        <p>Hi ${booking.customerName},</p>
        <p>Your booking has been confirmed. Here are your details:</p>
        <ul>
          <li>Package: ${booking.packageName}</li>
          <li>Nights: ${booking.nights}</li>
          <li>Guests: ${booking.adults + booking.children}</li>
          <li>Total Paid: $${(booking.packageRate * booking.nights * (1 + booking.taxRate)).toFixed(2)}</li>
        </ul>
        <p>We look forward to hosting you!</p>
        <p>- Moyo Estates</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
