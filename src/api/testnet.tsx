import axios from "axios";
import { Testnet2, Testnet3, Testnet4 } from "../model/Testnet";

export async function testnet3Check(address: string) {
  const response = await axios.get<Testnet3>(`api/testnet3/check/${address.toLowerCase()}`);
  return response.data;
}

export async function testnet4Check(address: string) {
  const response = await axios.get<Testnet4>(`api/testnet4/check/${address.toLowerCase()}`);
  return response.data;
}

export async function combinedCheck(address: string) {
  let testnet3Response: Testnet3 | null = null;
  let testnet4Response: Testnet4 | null = null;

  await testnet3Check(address)
    .then((res) => (testnet3Response = res))
    .catch(() => (testnet3Response = null));

  await testnet4Check(address)
    .then((res) => (testnet4Response = res))
    .catch(() => (testnet4Response = null));

  return {
    testnet3: testnet3Response,
    testnet4: testnet4Response,
  };
}

export async function testnet2Check(address: string) {
  const response = await axios.get<Testnet2>(`api/testnet2/check/${address.toLowerCase()}`);
  return response.data;
}

export async function testnet3Payout(address: string, signature: string) {
  const response = await axios.post(`api/testnet3/payout/${address.toLowerCase()}`, {
    signature,
  });
  return response.data;
}

export async function testnet4Payout(address: string, signature: string) {
  const response = await axios.post(`api/testnet4/payout/${address.toLowerCase()}`, {
    signature,
  });
  return response.data;
}

export async function testnet2Payout(address: string, signature: string, mainnet: string) {
  const response = await axios.post(`api/testnet2/payout/${address.toLowerCase()}`, {
    signature,
    wallet_mainnet: mainnet,
  });
  return response.data;
}

export async function getChallenge(address: string) {
  const response = await axios.get<string>(`api/testnet3/payout/${address.toLowerCase()}`, {
    transformResponse: (res) => {
      return res;
    },
    responseType: "json",
  });
  return response.data;
}

export async function getTestnet4Challenge(address: string) {
  const response = await axios.get<string>(`api/testnet4/payout/${address.toLowerCase()}`, {
    transformResponse: (res) => {
      return res;
    },
    responseType: "json",
  });
  return response.data;
}
