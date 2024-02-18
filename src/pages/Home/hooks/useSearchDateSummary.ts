import { adjustNumber, numberFormat as n } from "../../../helpers/numbers";
import { formatTimestampToDate } from "../../../helpers/time";
import { Earnings, Payouts } from "../../../model";

type DayData = (Earnings | Payouts)[];
export const isEarnings = (item: Earnings | Payouts): item is Earnings =>
  "epoch_number" in item;
export const isPayouts = (item: Earnings | Payouts): item is Payouts =>
  "txid" in item;
export enum StatusMap {
  PENDING = "Pending",
  CREATED = "Created",
  SENT = "Sent",
  DONE = "Done",
}
function getEpochDiapason(earnings: DayData): string {
  const epochs = earnings.filter(isEarnings).map((item) => item.epoch_number);

  if (epochs.length === 0) {
    return "0";
  }

  const minEpoch = Math.min(...epochs);
  const maxEpoch = Math.max(...epochs);

  return `${minEpoch}-${maxEpoch}`;
}

function sumField(
  dataArray: (Earnings | Payouts)[],
  fieldName: keyof Earnings | keyof Payouts
): number {
  return adjustNumber(
    // @ts-ignore
    dataArray.reduce((acc, item) => acc + (Number(item[fieldName]) || 0), 0),
    6
  );
}

function findSmallestStatus(dataArray: DayData): string {
  const statusOrder: { [key in Payouts["status"]]: number } = {
    PENDING: 1,
    CREATED: 2,
    SENT: 3,
    DONE: 4,
  };

  const statusValues = dataArray
    .filter(isPayouts)
    .map((item) => statusOrder[item.status]);

  const smallestValue = Math.min(...statusValues);
  const smallestStatus = Object.keys(statusOrder).find(
    (key) => statusOrder[key as Payouts["status"]] === smallestValue
  );

  return StatusMap[smallestStatus as keyof typeof StatusMap] || "-";
}

function averageField(
  dataArray: DayData,
  fieldName: keyof Earnings,
  depth: number
): number {
  const filteredEarnings = dataArray.filter(isEarnings);

  if (filteredEarnings.length === 0) {
    return 0;
  }

  const sum = filteredEarnings.reduce((acc, curr) => {
    const value = Number(curr[fieldName]);
    return acc + value;
  }, 0);

  const average = sum / filteredEarnings.length;
  const roundedAverage = Number(Number(average).toFixed(depth));

  return roundedAverage;
}

export const useSearchDateSummary = (dateItems: (Earnings | Payouts)[]) => {
  const summary = {
    created_at: formatTimestampToDate(dateItems[0].created_at),
    epoch_number: getEpochDiapason(dateItems as Earnings[]),
    pool_shares: n(sumField(dateItems, "pool_shares")),
    address_shares: n(sumField(dateItems, "address_shares")),
    hashrate_estimated: n(
      Math.round(averageField(dateItems, "hashrate_estimated", 2) / 1000) * 1000
    ),
    pool_earnings: n(sumField(dateItems, "pool_earnings")),
    pool_fee: `${Number(averageField(dateItems, "pool_fee", 2) * 100)} %`,
    address_earnings: n(sumField(dateItems, "address_earnings")),
    amount: n(sumField(dateItems, "amount")),
    fee: n(sumField(dateItems, "fee")),
    status: findSmallestStatus(dateItems),
  };

  return { summary };
};
