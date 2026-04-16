import nodemailer from "nodemailer";

function createTransport() {
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  // Fallback: ethereal test account (dev only)
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER ?? "",
      pass: process.env.ETHEREAL_PASS ?? "",
    },
  });
}

export interface DownloadItem {
  productTitle: string;
  downloadUrl: string;
  expiresAt: string;
}

export async function sendOrderConfirmationEmail(
  to: string,
  customerName: string,
  orderId: string,
  items: DownloadItem[]
) {
  const transport = createTransport();
  const storeName = process.env.STORE_NAME ?? "MindfulStore";
  const storeUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0; border-bottom:1px solid #eee;">${item.productTitle}</td>
      <td style="padding:8px 0; border-bottom:1px solid #eee; text-align:right;">
        <a href="${item.downloadUrl}" style="background:#4f46e5;color:#fff;padding:6px 14px;border-radius:4px;text-decoration:none;font-size:13px;">Download</a>
      </td>
    </tr>
  `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
  <div style="background:#4f46e5;padding:24px;text-align:center;">
    <h1 style="color:#fff;margin:0;">${storeName}</h1>
  </div>
  <div style="padding:24px;">
    <h2>Thank you for your order, ${customerName}!</h2>
    <p>Your order <strong>#${orderId.slice(-8).toUpperCase()}</strong> has been confirmed.</p>
    <p>Your digital downloads are ready. Each link is valid for 7 days and can be used up to 5 times.</p>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 0;border-bottom:2px solid #4f46e5;">Product</th>
          <th style="text-align:right;padding:8px 0;border-bottom:2px solid #4f46e5;">Download</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    <p style="margin-top:24px;font-size:13px;color:#666;">
      If you have any issues, reply to this email or visit <a href="${storeUrl}">${storeUrl}</a>.
    </p>
    <p style="font-size:12px;color:#999;">
      All products are digital and AI-generated. No physical goods will be shipped.
      See our <a href="${storeUrl}/legal/refunds">Refund Policy</a> for details.
    </p>
  </div>
</body>
</html>`;

  await transport.sendMail({
    from: `"${storeName}" <${process.env.SMTP_FROM ?? "noreply@mindfulstore.example.com"}>`,
    to,
    subject: `Your ${storeName} Order — Downloads Ready`,
    html,
  });
}
