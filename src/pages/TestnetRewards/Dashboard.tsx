import React from "react";
import { IconDatabase } from "../../components/icons/IconDatabase";
import NewPhaseRewardTable from "./components/NewPhaseRewardTable";

interface Props {
  title: JSX.Element;
  description: string;
  style?: string;
}

const Dashboard: React.FC<Props> = ({ title, description, style }) => {
  return (
    <div className={`p-6 font-medium ${style}`}>
      {title}
      <div>{description}</div>
      <div className="pt-4">
        <label
          htmlFor="testnet-address"
          className="block text-sm mb-[8px] text-default"
        >
          Testnet 2 address
        </label>
        <form className="flex items-center rounded space-x-2 text-xs">
          <input
            type="text"
            id="testnet-address"
            placeholder="Testnet 2 address"
            className="flex-1 px-4 py-2 leading-[18px] rounded outline-none bg-default border-primary"
          />
          <button className="px-4 py-2.5 rounded bg-primary-2 hover:shadow-primary font-bold">
            Check
          </button>
        </form>
      </div>
      <NewPhaseRewardTable />
      {/* <div className="flex items-center flex-col mt-[50%]">
        <IconDatabase />
        <div className="mt-[8px] text-center">
          <span>Input your address&nbsp;</span>
          <span className="text-default">
            to see if
            <br /> rewards are available to you
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
