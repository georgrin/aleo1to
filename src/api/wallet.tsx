import axios from 'axios';

export interface AuthResponse {
  app: string;
  nonce: string;
  wallet: string;
}
export interface TokenResponse {
  token: string;
}
export interface TokenRequest {
  message: string,
  signature: string,
}

export async function getChallenge(address: string) {
  const response = await axios.get<string>(`api/auth/${address}`, {
    transformResponse: (res) => {
        return res;
    },
    responseType: 'json'
});
  return response.data;
}
export async function getToken(address: string, data: TokenRequest) {
  const response = await axios.post<TokenResponse>(`api/auth`, data);
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
