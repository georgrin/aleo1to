export type Testnet3 = {
  testnet_credits: number;
  testnet_mainnet_rate: number;
  mainnet_credits: number;
  total_credits_earned_by_all_users: number;
  address_share_of_total_credits: number;
  validator_phase_bonus_10: number;
  address_validator_phase_bonus: number;
  status: TestnetStatus;
  txid: string;
  total_reward: number;
};

export type Testnet2 = {
  snapshot_reward: 0;
  status: TestnetStatus;
  txid: string;
};

export enum TestnetStatus {
  READY = "Ready",
  REQUESTED = "Requested",
  SENT = "Sent",
}
