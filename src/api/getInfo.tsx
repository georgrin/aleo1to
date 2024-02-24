import axios from "axios";

export interface IGetInfoResponse {
  miners: Miners;
  solutions: Solutions;
  hashrate: Hashrate;
  balance: number;
}

interface Hashrate {
  total: number;
  pool: Pool;
  solo: Pool;
  network: number;
}

interface Pool {
  estimated: number;
}

interface Solutions {
  sent: number;
  confirmed: number;
}

interface Miners {
  active: number;
  inactive: number;
}

export interface IGetHistoryInfoResponse {
  date: string;
  miners_active: number;
  miners_total: number;
  solutions_confirmed: number;
  solutions_sent: number;
  hashrate_network: number;
  hashrate_total: number;
  hashrate_pool_estimated: number;
  hashrate_solo_estimated: number;
  balance_pool: number;
}

export async function getInfo() {
  return await axios.get<IGetInfoResponse>(`/api/info`).then((request) => {
    if (typeof request.data === "string") {
      throw new Error("Error fetching data");
    } else {
      return request.data;
    }
  });
}

export async function getHistoryInfo() {
  return await axios
    .get<IGetHistoryInfoResponse[]>(`api/history/info`)
    .then((request) => {
      if (typeof request.data === "string") {
        throw new Error("Error fetching data");
      } else {
        return request.data;
      }
    });
}
