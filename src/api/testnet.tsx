import axios from "axios";
import { Testnet3 } from "../model/Testnet";

export async function testnetCheck(address: string) {
  const response = await axios.get<Testnet3>(`api/testnet3/check/${address}`);
  return response.data;
}
