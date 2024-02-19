import axios from "axios";
import { Testnet2, Testnet3 } from "../model/Testnet";

export async function testnet3Check(address: string) {
  const response = await axios.get<Testnet3>(`api/testnet3/check/${address}`);
  return response.data;
}

export async function testnet2Check(address: string) {
  const response = await axios.get<Testnet2>(`api/testnet2/check/${address}`);
  return response.data;
}

export async function testnet3Payout(address: string, signature: string) {
  const response = await axios.post(`api/testnet3/payout/${address}`, {
    signature,
  });
  return response.data;
}

export async function testnet2Payout(
  address: string,
  signature: string,
  mainnet: string
) {
  const response = await axios.post(`api/testnet2/payout/${address}`, {
    signature,
    wallet_mainnet: mainnet,
  });
  return response.data;
}

export async function getChallenge(address: string) {
  const response = await axios.get<string>(`api/testnet3/payout/${address}`, {
    transformResponse: (res) => {
      return res;
    },
    responseType: "json",
  });
  return response.data;
}
