import React from "react";
import Dashboard from "./Dashboard";
import NewPhaseRewardTable from "./components/NewRewardTable";
import OldRewardTable from "./components/OldRewardTable";

const TestnetRewards: React.FC = () => {
  return (
    <div className="pt-[68px] sm:pt-[56px] overflow-x-hidden">
      <div className="container py-4 grid lg:grid-cols-2 grid-cols-1 gap-5 fit">
        <Dashboard
          title={
            <div className="flex text-[32px] leading-[35px] font-orbiton">
              <h2>Testnet 3&nbsp;</h2>
              <h2 className="gradient-main">Phase 2</h2>
            </div>
          }
          description={
            <div className="text-xs my-[8px]">
              <p>
                The incentivized period of&nbsp;
                <b>
                  Testnet 3 Phase 2 was from December 2, 2022, starting at 00:00
                  UTC, to January 31, 2023, ending at 23:59 UTC.
                </b>
                &nbsp;If you participated in our pool during this timeframe,
                your rewards are available for claim.
              </p>
              <br />
              <p>
                Additionally, at the start of the testnet, we promised that if
                we progressed to the validator phase, we would distribute 10% of
                the reward allocated for this phase proportionally among the
                pool participants. Having successfully reached this phase, you
                can now see your bonus included in the reward calculations.
              </p>
            </div>
          }
          style="gradient-bg bg-cover"
          table={(address: string) => <NewPhaseRewardTable address={address} />}
        />
        <Dashboard
          title={
            <h2 className="text-[32px] leading-[35px] font-orbiton">
              Testnet 2
            </h2>
          }
          description={
            <div className="text-xs my-[8px] min-h-[128px]">
              <p>
                <b>
                  Testnet 2 lasted from December 6, 2021, starting at 00:00 UTC,
                  to February 15, 2022, ending at 23:59 UTC.
                </b>
                &nbsp;The reward is our grant, received from Aleo for developing
                the pool.
              </p>
              <br />
              <p>
                We have decided to distribute this grant among the participants
                of our pool,&nbsp;
                <a
                  href="https://1to.sh"
                  className="text-link underline cursor-pointer"
                >
                  1to.sh
                </a>
                , because the pool has already secured a place in the top 100.
                You are eligible to receive this reward if you participated in
                our pool during Testnet 2 and kept your machines running until
                the end of the testnet.
              </p>
            </div>
          }
          style="bg-surface"
          table={(address: string) => <OldRewardTable address={address} />}
        />
      </div>
    </div>
  );
};

export default TestnetRewards;