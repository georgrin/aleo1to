import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../../formatNumber";
import { MdInfoOutline } from "react-icons/md";
import { Tooltip } from "react-tooltip";
// TODO: Add dynamic load
import Chart from "chart.js/auto";

export const Stat = ({ info, historyInfo, updateHistoryInfo }: any) => {
  const [openedStat, setOpenedStat] = useState<null | string>(null);
  const lightningIcon = renderLightningIcon(
    `bg-[rgb(0,255,240)]`,
    `lightning-icon`
  );
  const lightning2Icon = renderLightningIcon(
    `bg-[rgba(0,133,255,0.1)]`,
    `lightning-2-icon`
  );
  const chartRef = useRef<null | HTMLCanvasElement>(null);
  const [chart, setChart] = useState<null | Chart>(null);

  useEffect(() => {
    if (!historyInfo) {
      return;
    }
    if (!openedStat) {
      return;
    }
    if (!chartRef.current) {
      return;
    }

    if (chart) {
      chart.destroy();
    }

    {
      const ctx = chartRef.current.getContext("2d");
      const gradient = ctx?.createLinearGradient(0, 0, 1000, 1);
      gradient?.addColorStop(0, "rgba(0, 255, 171, 0.2)");
      gradient?.addColorStop(0.7, "rgba(0, 117, 255, 0.15)");
      gradient?.addColorStop(1, "rgba(0, 117, 255, 0.15)");
      const chart = new Chart(chartRef.current, {
        type: "line",
        options: {
          events: [],
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              title: {
                display: false,
              },
              grid: {
                lineWidth: 1,
                color: "rgba(108,118,131,0.16)",
              },
              ticks: {
                color: "#ffffff",
              },
            },
            y: {
              title: {
                color: "#ffffff",
              },
              grid: {
                lineWidth: 1,
                color: "rgba(108,118,131,0.16)",
              },
              ticks: {
                color: "#ffffff",
                callback: function (value, index, ticks) {
                  if (value === 0) {
                    return 0;
                  }
                  const str = (value as number).toFixed(0);
                  const k = Math.floor((str.length - 1) / 3);
                  if (str.slice(-k * 3, -k * 3 + 1) !== "0") {
                    return (
                      str.slice(0, -k * 3) +
                      "." +
                      str.slice(-k * 3, -k * 3 + 1) +
                      Array(k).fill("k").join("")
                    );
                  }
                  return str.slice(0, -k * 3) + Array(k).fill("k").join("");
                },
                maxTicksLimit: 5,
              },
            },
          },
        },
        data: {
          labels: historyInfo.map((item: any) => {
            const date = new Date(item.date);
            return `${date.getMonth() + 1}-${date.getDate()}`;
          }),
          datasets: [
            {
              data: historyInfo.map((item: any) => item[openedStat]),
              fill: true,
              backgroundColor: gradient,
              pointBackgroundColor: "transparent",
              pointBorderColor: "transparent",
              borderColor: "rgb(0, 117, 255)",
              borderWidth: 1,
              tension: 0.4,
            },
          ],
        },
      });
      setChart(chart);
      function resize() {
        const gradient = ctx?.createLinearGradient(
          0,
          0,
          chartRef.current!.clientWidth,
          1
        );
        gradient?.addColorStop(0, "rgba(0, 255, 171, 0.2)");
        gradient?.addColorStop(0.7, "rgba(0, 117, 255, 0.15)");
        gradient?.addColorStop(1, "rgba(0, 117, 255, 0.15)");
        chart.data.datasets[0].backgroundColor = gradient;
      }
      window.addEventListener("resize", resize);
      return () => {
        window.removeEventListener("resize", resize);
      };
    }
  }, [chartRef, historyInfo, openedStat]);

  return (
    <div className="container pt-[22px] pb-[19px]">
      <div className="relative overflow-hidden flex lg:justify-between flex-wrap gap-[15px] md:gap-[30px]">
        {renderItem({
          id: "miners_active",
          title: "Miners",
          value: formatNumber(info.miners.active),
        })}
        {renderItem({
          id: "solutions_confirmed",
          title: "Solutions Found",
          value: formatNumber(info.solutions.confirmed),
        })}
        {renderItem({
          id: "balance_pool",
          title: (
            <>
              Pool Rewards
              <div
                id="pool-rewards"
                className="hover:text-primary cursor-pointer fill-current ml-2 mt-[2px]"
              >
                <MdInfoOutline size={22} color="inherit" />
              </div>
              <Tooltip
                className={`
                                text-[rgba(247,163,40,1)] 
                                bg-[rgba(30,32,35,1)]
                                border
                                border-[rgba(255,255,255,0.15)]
                                rounded-[5px] transition-none p-[14px]
                                opacity-100
                            `}
                variant="info"
                noArrow
                place="bottom"
                anchorId="pool-rewards"
                events={["click"]}
              >
                Testnet3 credits
              </Tooltip>
            </>
          ),
          value: formatNumber(Math.round(info.balance)),
        })}
        {renderItem({
          id: "hashrate_pool_estimated",
          title: "Pool Hashrate",
          value: `${formatNumber(info.hashrate.pool.estimated)} c/s`,
        })}
        {renderItem({
          id: "hashrate_solo_estimated",
          title: "Solo Hashrate",
          value: `${formatNumber(info.hashrate.solo.estimated)} c/s`,
        })}
        {renderItem({
          id: "hashrate_network",
          title: "Network Hashrate",
          value: `${formatNumber(info.hashrate.network)} c/s`,
        })}
      </div>
      {openedStat && (
        <div className="rounded-[5px] border-[1px] border-[rgba(108,118,131,0.16)] pt-4 px-4 pb-[25px] mt-[23px]">
          <div className="flex justify-between">
            <div
              className="flex items-center font-medium select-none cursor-pointer"
              onClick={(e) => {
                setOpenedStat(null);
              }}
            >
              <div className="icon cancel-black-icon w-[20px] h-[20px] mr-2"></div>
              Hide Graph
            </div>
            {(openedStat === "hashrate_pool_estimated" ||
              openedStat === "hashrate_solo_estimated" ||
              openedStat === "hashrate_network") && (
              <div className="text-default font-medium">c/s</div>
            )}
            {openedStat === "balance_pool" && (
              <div className="text-default font-medium">Credits</div>
            )}
          </div>
          <canvas
            ref={chartRef}
            className={`
                    mt-[20px]
                    w-full
                    h-[150px]
                    min-h-[150px]
                    max-h-[150px]
                `}
          />
        </div>
      )}
    </div>
  );

  function openStatGraph(id: string) {
    setOpenedStat(id);
    !historyInfo && updateHistoryInfo();
  }

  function renderLightningIcon(bg: string, icon: string) {
    return (
      <div
        className={
          "flex w-8 h-8 ml-2 rounded-[5px] items-center justify-center" +
          ` ${bg}`
        }
      >
        <i className={"icon block w-[20px] h-[13px]" + ` ${icon}`}></i>
      </div>
    );
  }

  function renderItem(props: any) {
    return (
      <div
        className={`
                flex flex-col h-max items-start
                w-full
                md:w-max
            `}
      >
        <div className="flex items-center text-default text-md font-medium">
          {props.title}
        </div>
        <div className="flex items-center text-[22px] font-medium mt-[6px]">
          {props.value}
          <div
            className="cursor-pointer"
            onClick={(e) => openStatGraph(props.id)}
          >
            {openedStat === props.id ? lightningIcon : lightning2Icon}
          </div>
        </div>
      </div>
    );
  }
};
