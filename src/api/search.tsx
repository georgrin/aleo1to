import axios from "axios";
import { Earnings, Machines, Payouts, SearchResult } from "../model";

export interface EarningsResponse {
  earnings: Array<Earnings>;
  general_info: {
    earnings_total: number;
    payouts_total: number;
    fee_total: number;
    balance: number;
  };
}

export interface MachinesResponse {
  machines: Array<Machines>;
  general_info: {
    active: number;
    total: number;
  };
}

export interface RequestPayout {
  requested: number;
  done: number;
  available: number;
}

export interface Miner {
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

export interface BalanceOne {
  total: number;
  change_1h: number;
  change_24h: number;
}

export interface BalancePhase2 {
  in_pool: {
    total: number;
    change_1h: number;
    change_24h: number;
  };
  in_pool_incentivize: {
    total: number;
    change_1h: number;
    change_24h: number;
  };
}

export async function searchAddress(address: string) {
  return Promise.all([
    axios.get<EarningsResponse>(`/api/earnings/${address}`),
    axios.get<Array<Payouts>>(`/api/payouts/${address}`),
    axios.get<MachinesResponse>(`/api/machines/${address}`),
  ]).then((response) => {
    return {
      ...response[0].data,
      payouts: response[1].data,
      machines: { ...response[2].data },
    };
  });
}
