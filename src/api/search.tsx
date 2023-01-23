import axios from "axios";

export async function searchAddress(address: string) {
  return axios.get(`/api/wallets/${address}`).then((request) => request.data);
}
