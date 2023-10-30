import axios from 'axios';

export interface AuthResponse {
  app: string;
  nonce: string;
  wallet: string;
}

export async function startSign(address: string) {
  const response = await axios.get<AuthResponse>(`api/auth/${address}`);
  return response.data;
}

export async function payout(token: string) {
  const response = await axios.get(
    `api/payout`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}
