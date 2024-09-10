import React from "react";
import Dashboard from "./Dashboard";
import NewPhaseRewardTable from "./components/NewRewardTable";
import OldRewardTable from "./components/OldRewardTable";
import { testnet2Check, combinedCheck } from "../../api/testnet";
import { Testnet2, TestnetCombined } from "../../model/Testnet";
import { useCookies } from "react-cookie";

enum Testnet {
  Testnet2 = "testnet2Rewards",
  Testnet3 = "testnet3Rewards",
}

const TestnetRewards: React.FC = () => {
  const [cookies, setCookie] = useCookies([Testnet.Testnet2, Testnet.Testnet3]);

  const saveTestnetSearch = (cookieName: Testnet, searchString: string) => {
    setCookie(cookieName, searchString);
  };

  return (
    <div className="pt-[68px] sm:pt-[56px] overflow-x-hidden">
      <div className="container pt-3 grid lg:grid-cols-2 grid-cols-1 gap-5 fit">
        <Dashboard
          title={
            <div className="flex text-[32px] leading-[35px] font-orbiton flex-wrap">
              <h2>Testnet 3&nbsp;</h2>
              <h2 className="gradient-main">Phase 2&nbsp;</h2>
              <h2> & Testnet 4</h2>
            </div>
          }
          description={
            <div className="text-xs my-[8px] min-h-[128px]">
              <p>
                Testnet 3 Phase 2 ran from <b>December 2, 2022, at 00:00 UTC until January 31, 2023, at 23:59 UTC</b>.
                If you participated during this time, your rewards are now available for claim.
                <br />
                <br />
                Testnet 4 ran from <b>July 1, 2024, at 16:00 UTC until July 15, 2024, at 16:00 UTC</b>.
                <br />
                <br />
                We also promised to distribute 10% of the rewards allocated for the validator phase among Testnet 3 pool
                participants, but Aleo has canceled the rewards for the validator phase.
              </p>
            </div>
          }
          style="gradient-bg bg-cover"
          table={(address, data) => <NewPhaseRewardTable address={address} data={data as TestnetCombined} />}
          version={"3 & 4"}
          checkFunc={(address: string) => combinedCheck(address)}
          defaultAddress={cookies[Testnet.Testnet3]}
          saveAddress={(address) => saveTestnetSearch(Testnet.Testnet3, address)}
        />
        <Dashboard
          title={<h2 className="text-[32px] leading-[35px] font-orbiton">Testnet 2</h2>}
          description={
            <div className="text-xs my-[8px] min-h-[128px]">
              <p>
                <b>
                  Testnet 2 lasted from December 6, 2021, starting at 00:00 UTC, to February 15, 2022, ending at 23:59
                  UTC.
                </b>
                &nbsp;The reward is our grant, received from Aleo for developing the pool.
              </p>
              <br />
              <p>
                We have decided to distribute this grant among the participants of our pool,&nbsp;
                <a href="https://1to.sh" className="text-link underline cursor-pointer" target="_blank">
                  1to.sh
                </a>
                , because the pool has already secured a place in the top 100. You are eligible to receive this reward
                if you participated in our pool during Testnet 2 and kept your machines running until the end of the
                testnet.
              </p>
            </div>
          }
          style="bg-surface"
          table={(address, data) => <OldRewardTable address={address} data={data as Testnet2} />}
          version={2}
          checkFunc={testnet2Check}
          defaultAddress={cookies[Testnet.Testnet2]}
          saveAddress={(address) => saveTestnetSearch(Testnet.Testnet2, address)}
        />
      </div>
    </div>
  );
};

export default TestnetRewards;
