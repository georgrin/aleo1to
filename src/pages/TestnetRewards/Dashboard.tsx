import React, { useState } from "react";
import { IconDatabase } from "../../components/icons/IconDatabase";

interface Props {
  title: JSX.Element;
  description: JSX.Element;
  style?: string;
  table: (address: string) => JSX.Element;
}

const Dashboard: React.FC<Props> = ({ title, description, style, table }) => {
  const [search, setSearch] = useState("");
  const [submited, setSubmited] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmited(true);
  };

  return (
    <div className={`p-6 font-medium flex flex-col ${style}`}>
      {title}
      <div>{description}</div>
      <div className="pt-4">
        <label
          htmlFor="testnet-address"
          className="block text-sm mb-[8px] text-default"
        >
          Testnet 2 address
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
            placeholder="Testnet 2 address"
            className="flex-1 px-4 py-2 leading-[18px] rounded outline-none bg-default border-primary"
          />
          <button className="px-4 py-2.5 rounded bg-primary-2 hover:shadow-primary font-bold">
            Check
          </button>
        </form>
      </div>
      {submited ? (
        <>{table(search)}</>
      ) : (
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
    </div>
  );
};

export default Dashboard;
