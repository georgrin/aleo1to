import { useMemo } from "react";
import { adjustNumber } from "../../../helpers/numbers";
import { formatTimestampToDate } from "../../../helpers/time";
import { DaySummary, Earnings, Payouts } from "../../../model";

type DayData = (Earnings | Payouts)[];

function isEarnings(item: Payouts | Earnings): item is Earnings {
  return (item as Earnings).epoch_number !== undefined;
}
function isPayouts(item: Payouts | Earnings): item is Payouts {
  return (item as Payouts).amount !== undefined;
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
    4
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

  return smallestStatus || "DONE";
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
  const roundedAverage = Number(average.toFixed(depth));

  return roundedAverage;
}

export const useSearchDateSummary = (dateItems: (Earnings | Payouts)[]) => {
  const summary = useMemo(
    () => ({
      timestamp: formatTimestampToDate(dateItems[0].created_at),
      epoch_number: getEpochDiapason(dateItems as Earnings[]),
      pool_shares: sumField(dateItems, "pool_shares"),
      address_shares: sumField(dateItems, "address_shares"),
      hashrate_estimated: averageField(dateItems, "hashrate_estimated", 2),
      pool_earnings: sumField(dateItems, "pool_earnings"),
      pool_fee: averageField(dateItems, "pool_fee", 2),
      address_earnings: sumField(dateItems, "address_earnings"),
      amount: sumField(dateItems, "amount"),
      fee: sumField(dateItems, "fee"),
      status: findSmallestStatus(dateItems),
    }),
    []
  );

  return { summary };
};
