export async function POST(req) {
  const { phone_number } = await req.json();
  try {
    const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/passwordless/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET, // Include the client secret
        connection: "sms",
        phone_number,
        send: "code",
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: errorText }), { status: 500 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
