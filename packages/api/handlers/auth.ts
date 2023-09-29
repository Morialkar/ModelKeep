import axios from "axios";
import { APIError } from "models/types/APIError";

export async function getAuthObjectFromAuthCode(event: any) {
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
          redirect_uri: "http://localhost:9000/",
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
    console.error(JSON.stringify(error));
    const toSendError: APIError = {
      status: 500,
      message: JSON.stringify(error),
      error: "error",
    };
    return {
      statusCode: 500,
      body: JSON.stringify(toSendError),
    };
  }
}

export async function loginUser(event: any) {}
