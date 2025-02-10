// pages/api/auth/verify-sms.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }
  
    const { phone_number, otp } = req.body;
  
    try {
      const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: "http://auth0.com/oauth/grant-type/passwordless/otp",
          client_id: process.env.AUTH0_CLIENT_ID,
          client_secret: process.env.AUTH0_CLIENT_SECRET, // Include the client secret
          otp,
          realm: "sms",  // This must match the connection name in your Auth0 dashboard
          username: phone_number
        })
      });
  
      const data = await response.json();
      if (data.error) {
        return res.status(400).json({ error: data.error });
      }
      res.status(200).json({ success: true, token: data.access_token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  