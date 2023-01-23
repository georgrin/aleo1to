import axios from "axios";

export interface ISearchAddressResponse {
  balance: Balance;
  balance_solo: Balance;
  hashrate: Hashrate;
  shares: Shares;
  miners: Miner[];
}

interface Miner {
  hardware_id: string;
  caption: string;
  ip: string;
  hardware: Hardware;
  hostname: string;
  params: Params;
  hashrate: number;
  hashrate_estimated: number;
  last_active: string;
  shares_pool: number;
  shares_solo?: any;
}

interface Params {
  threads_in_pool: number;
  solo: boolean;
  cuda_version: string;
  version: string;
  threads: number;
}

interface Hardware {
  cpu: Cpu[];
  gpu: Gpu[];
}

interface Gpu {
  model: string;
}

interface Cpu {
  cores: number;
  model: string;
}

interface Shares {
  in_pool: Inpool;
  in_solo: Inpool;
}

interface Inpool {
  valid: number;
  invalid: number;
  unchecked: number;
}

interface Hashrate {
  stat: Stat;
  estimated: Stat;
}

interface Stat {
  in_pool: number;
  in_solo: number;
}

interface Balance {
  total: number;
  change_1h: number;
  change_24h: number;
}

export async function searchAddress(address: string) {
  return axios.get<ISearchAddressResponse>(`/api/wallets/${address}`);
}
