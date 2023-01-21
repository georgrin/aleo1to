import { useEffect, useState } from "react";

export const Header = ({ info }: any) => {
  const linksData = [
    {
      label: "Join",
      value: "https://docs.aleo1.to/join/ubuntu",
    },
    {
      label: "PPLNS",
      value: "https://docs.aleo1.to/rewards/pool-rewards",
    },
    {
      label: "Solo",
      value: "https://docs.aleo1.to/rewards/solo-rewards",
    },
    {
      label: "Team",
      value: "https://docs.aleo1.to/about/team",
    },
  ];

  const socialData = {
    github: {
      label: "github",
      value: "https://github.com/1to-team/1to-miner/releases",
    },
    telegram: {
      label: "telegram",
      value: "https://t.me/aleo1to",
    },
  };

  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    function click(e: MouseEvent) {
      if (!(e.target as HTMLElement).classList.contains("menu")) {
        setShowMenu(false);
      }
    }
    window.addEventListener("click", click);
    return () => {
      window.removeEventListener("click", click);
    };
  }, []);

  return (
    <div className="bg-surface fixed t-0 w-full z-50 bottom-line">
      <div className="container h-[68px] sm:h-[56px] flex items-center flex-wrap">
        <div className="flex items-center">
          <a href="/" className="font-bold text-xl">
            <span className="relative sm:top-[3px] inline-block icon logo-blue-white-icon w-[160px] h-[50px]"></span>
          </a>
          <div className="text-default ml-4 hidden md:block font-medium mr-4">
            Highly optimized pool for maximum performance
          </div>
        </div>
        <div className="hidden lg:flex items-center ml-auto">
          {linksData.map(({ label, value }) => {
            return (
              <a
                key={label}
                className="block text-base font-bold mr-[10px] last:mr-0 hover:text-primary transition-colors"
                href={value}
                target="_blank"
              >
                {label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center ml-[auto] lg:ml-[20px] mr-[10px]">
          <a target="_blank" href={socialData.telegram.value} className="relative inline-block icon telegram-icon w-[25px] h-[25px] mr-[10px] last:mr-0"/>
          <a target="_blank" href={socialData.github.value} className="relative inline-block icon github-icon w-[25px] h-[25px] mr-[10px] last:mr-0"/>
        </div>

        <div className="lg:hidden">
          <div className="menu" onClick={(e) => setShowMenu((v) => !v)}>
            <div className="menu w-4 h-[3px] bg-primary"></div>
            <div className="menu w-4 h-[3px] bg-primary mt-[3px]"></div>
            <div className="menu w-4 h-[3px] bg-primary mt-[3px]"></div>
          </div>
          <div
            className={`${
              showMenu ? `` : `hidden`
            } absolute bg-surface flex flex-col p-4 right-0`}
          >
            {linksData.map(({ label, value }) => {
              return (
                <a
                  key={label}
                  href={`/${value}`}
                  target="_blank"
                  className="font-medium hover:text-primary mb-[10px] last:mb-0"
                >
                  {label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};