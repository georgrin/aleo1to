export interface SearchResult {
  address: string;
  data: {
    earnings: Earnings[];
    general_info: {
      earnings_total: number;
      payouts_total: number;
      fee_total: number;
      balance: number;
    };
    machines: {
      machines: Machines[];
      general_info: {
        active: number;
        total: number;
      };
    };
    payouts: Payouts[];
  } | null;
  interval?: any;
}

export type Earnings = {
  epoch_number: number;
  pool_earnings: number | null;
  pool_shares: number | null;
  address_earnings: number | null;
  address_shares: number | null;
  hashrate_estimated: number;
  pool_fee: number;
  created_at: string;
};

export type Payouts = {
  txid: string;
  amount: number;
  status: string;
  fee: number;
  amount_sent: number;
  done_at: string;
  created_at: string;
};

export type DaySummary = {
  created_at: string;
  epoch_number: string;
  pool_shares: string;
  address_shares: string;
  hashrate_estimated: string;
  pool_earnings: string;
  pool_fee: string;
  address_earnings: string;
  amount: string;
  fee: string;
  status: string;
};

export type Machines = {
  id: number;
  params: {
    threads: number;
    threads_in_pool: number;
    version: string;
    cuda_version: string;
    solo: boolean;
  };
  ip: string;
  caption: string;
  hardware: {
    gpu: [
      {
        model: string;
      }
    ];
    cpu: [
      {
        model: string;
        cores: number;
      }
    ];
  };
  hardware_id: string;
  hostname: string;
  hashrate: number;
  hashrate_estimated: number;
};
