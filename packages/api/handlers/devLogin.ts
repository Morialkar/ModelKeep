import axios from "axios";

export async function getDevLogin(event: any) {
  // Get the code from the query string parameters
  const code = event.queryStringParameters?.code;

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No code provided" }),
    };
  }

  try {
    // Exchange the code for tokens
    const response = await axios.post(
      `https://${process.env.COGNITO_DOMAIN!}/oauth2/token`,
      null,
      {
        params: {
          grant_type: "authorization_code",
          client_id: process.env.COGNITO_CLIENTID!,
          client_secret: process.env.COGNITO_CLIENTSECRET!,
          redirect_uri: "http://localhost:3001/local/devLogin",
          code,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Return the tokens to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
