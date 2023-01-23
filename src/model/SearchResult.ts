import { ISearchAddressResponse } from "../api";

export interface SearchResult {
  address: string;
  data: ISearchAddressResponse | null;
  interval?: any;
}
