import { useMemo } from "react";
import { Earnings, Payouts } from "../../../model";

export type CombinedData = {
  [date: string]: (Earnings | Payouts)[];
};

interface Props {
  earnings: Array<Earnings>;
  payouts: Array<Payouts>;
}

const useSearchResults = ({ earnings, payouts }: Props) => {
  const getDateString = (item: Payouts | Earnings): string =>
    item.created_at.split("T")[0];

  const combinedData: CombinedData = {};

  // Combine earnings and payouts into combinedData object
  [...earnings, ...payouts].forEach((item) => {
    const date = getDateString(item);
    if (!combinedData[date]) {
      combinedData[date] = [];
    }
    combinedData[date].push(item);
  });

  // Sort each date array within the combinedData object by timestamp in ascending order
  Object.values(combinedData).forEach((data: (Payouts | Earnings)[]) =>
    data.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  );

  // Sort the combinedData object by date in ascending order
  const sortedCombinedData = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(combinedData)
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
          .reverse()
      ),
    []
  );

  return { sortedCombinedData };
};

export default useSearchResults;
