import { mande } from 'mande';
import { AuthObject } from 'src/stores/authentication';
import { APIError, isAPIError } from 'models/types/apiError';

const api = mande('http://localhost:3001/local/auth');

export async function getAuthObjectFromAuthCode(
  code: string
): Promise<AuthObject> {
  const response = await api.get<AuthObject | APIError>(
    'getAuthObjectFromAuthCode',
    { query: { code } }
  );
  if (isAPIError(response)) {
    throw new Error(response.message);
  } else {
    return response;
  }
}
