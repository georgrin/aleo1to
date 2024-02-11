import React from "react";
import Dashboard from "./Dashboard";

const TestnetRewards: React.FC = () => {
  return (
    <div className="pt-[68px] sm:pt-[56px] overflow-x-hidden">
      <div className="container py-4 grid grid-cols-2 gap-5 fit">
        <Dashboard
          title={
            <div className="flex text-[32px] leading-[35px] font-orbiton">
              <h2>Testnet 3&nbsp;</h2>
              <h2 className="gradient-main">Phase 2</h2>
            </div>
          }
          description="The"
          style="gradient-bg bg-cover"
        />
        <Dashboard
          title={
            <h2 className="text-[32px] leading-[35px] font-orbiton">
              Testnet 2
            </h2>
          }
          description="The"
          style="bg-surface"
        />
      </div>
    </div>
  );
};

export default TestnetRewards;