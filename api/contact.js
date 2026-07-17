export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const body = request.headers["content-type"]?.includes("application/json")
      ? request.body
      : Object.fromEntries(new URLSearchParams(request.body || ""));

    const name = sanitize(body.name);
    const email = sanitize(body.email);
    const project = sanitize(body.project);
    const message = sanitize(body.message);

    if (!name || !email || !project || !message) {
      return response.status(400).json({ ok: false, message: "Missing required fields" });
    }

    const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (!telegramToken || !telegramChatId) {
      return response.status(500).json({ ok: false, message: "Telegram is not configured" });
    }

    const telegramMessage = [
      "New Shopify portfolio message",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Project: ${project}`,
      "",
      `Message: ${message}`
    ].join("\n");

    const telegramResult = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: telegramMessage,
        disable_web_page_preview: true
      })
    });

    if (!telegramResult.ok) {
      return response.status(502).json({ ok: false, message: "Telegram delivery failed" });
    }

    if (process.env.RESEND_API_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
          to: process.env.CONTACT_TO_EMAIL || "hridoybugfinder@gmail.com",
          subject: "New Shopify portfolio message",
          text: telegramMessage,
          reply_to: email
        })
      });
    }

    return response.status(200).json({ ok: true, message: "Message sent" });
  } catch (error) {
    return response.status(500).json({ ok: false, message: "Server error" });
  }
}

function sanitize(value) {
  return String(value || "").replace(/[<>]/g, "").trim().slice(0, 2000);
}
