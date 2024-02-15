export interface SearchResult {
  address: string;
  data: ISearchAddressResponse | null;
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
  timestamp: string;
  epoch_number: string;
  pool_shares: number;
  address_shares: number;
  hashrate_estimated: number;
  pool_earnings: number;
  pool_fee: number;
  address_earnings: number;
  amount: number;
  fee: number;
  status: string;
};
