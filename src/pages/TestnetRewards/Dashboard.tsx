import React, { useEffect, useState } from "react";
import { IconDatabase } from "../../components/icons/IconDatabase";
import IconNotFound from "../../components/icons/IconNoFound";
import { Testnet2, Testnet3 } from "../../model/Testnet";
import { useCookies } from "react-cookie";

interface Props {
  title: JSX.Element;
  description: JSX.Element;
  style?: string;
  version: number;
  checkFunc: (search: string) => Promise<Testnet3 | Testnet2>;
  table: (address: string, data: Testnet3 | Testnet2) => JSX.Element;
  saveAddress: (address: string) => void;
  defaultAddress: string;
}

const Dashboard: React.FC<Props> = ({
  title,
  description,
  style,
  table,
  checkFunc,
  version,
  saveAddress,
  defaultAddress,
}) => {
  const [search, setSearch] = useState(defaultAddress);
  const [requestedAddress, setRequestedAddress] = useState("");
  const [data, setData] = useState<Testnet3 | Testnet2 | null>();
  const [submited, setSubmited] = useState(false);
  const [loading, setLoading] = useState(false);
  const abortController = new AbortController();

  useEffect(() => {
    if (defaultAddress) onSubmit();

    return () => abortController.abort();
  }, []);

  const onSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    clear();
    setRequestedAddress(search);
    if (!search) {
      saveAddress("");
      return;
    }
    try {
      setLoading(true);
      const response = await checkFunc(search);
      setData(response);
      saveAddress(search);
    } catch {
    } finally {
      setSubmited(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, [data]);

  const clear = () => {
    setData(null);
    setSubmited(false);
  };

  return (
    <div className={`p-6 font-medium flex flex-col ${style}`}>
      {title}
      <div>{description}</div>
      <div className="pt-2">
        <label
          htmlFor="testnet-address"
          className="block text-sm mb-[8px] text-default"
        >
          Testnet {version} address
        </label>
        <form
          className="flex items-center rounded space-x-2 text-xs"
          onSubmit={onSubmit}
        >
          <input
            type="text"
            id="testnet-address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Testnet ${version} address`}
            className="flex-1 px-4 py-2 leading-[18px] rounded outline-none bg-default border-primary"
          />
          <button className="px-4 py-2.5 rounded bg-primary-2 hover:shadow-primary font-bold">
            Check
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex items-center flex-col flex-1 justify-center">
          <span className="loader-big"></span>
        </div>
      )}

      {!submited && !loading && (
        <div className="flex items-center flex-col flex-1 justify-center">
          <IconDatabase />
          <div className="mt-[8px] text-center">
            <span>Input your address&nbsp;</span>
            <span className="text-default">
              to see if
              <br /> rewards are available to you
            </span>
          </div>
        </div>
      )}

      {submited && !data && (
        <div className="flex items-center flex-col flex-1 justify-center">
          <IconNotFound />
          <div className="mt-[8px] text-center">
            <span>Sorry, there are no&nbsp;</span>
            <span className="text-default">
              rewards
              <br /> available for address
            </span>
          </div>
          <p className="text-xs mt-2">{requestedAddress}</p>
        </div>
      )}

      {data && <>{table(requestedAddress, data)}</>}
    </div>
  );
};

export default Dashboard;
