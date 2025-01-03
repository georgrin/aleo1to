import { useEffect, useRef, useState } from "react";
import { formatNumber, toGigaNumber } from "../../formatNumber";
// TODO: Add dynamic load
import Chart from "chart.js/auto";

export const Stat = ({ info, historyInfo, updateHistoryInfo }: any) => {
  const [openedStat, setOpenedStat] = useState<null | string>(null);
  const lightningIcon = renderLightningIcon(`bg-[rgb(0,255,240)]`, `lightning-icon`);
  const lightning2Icon = renderLightningIcon(`bg-[rgba(0,133,255,0.1)]`, `lightning-2-icon`);
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
                    return str.slice(0, -k * 3) + "." + str.slice(-k * 3, -k * 3 + 1) + Array(k).fill("k").join("");
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
        const gradient = ctx?.createLinearGradient(0, 0, chartRef.current!.clientWidth, 1);
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
    <div className="container">
      <div className="pt-[22px] pb-[19px]">
        <div className="relative flex justify-center flex-wrap gap-10 lg:gap-16">
          {renderItem({
            id: "current_epoch",
            title: "Current Epoch",
            value: (
              <div className="flex items-end">
                <span>{formatNumber(info.blockchain.epoch)}</span>{" "}
                <span className="text-xs pl-2 mb-1 text-grey">
                  ({info.blockchain.height % 360}
                  /360)
                </span>
              </div>
            ),
          })}
          {renderItem({
            id: "blocks_height",
            title: "Block Height",
            value: `${formatNumber(info.blockchain.height)}`,
          })}
          {renderItem({
            id: "hashrate_network",
            title: "Network Speed",
            value: `${formatNumber(toGigaNumber(info.hashrate.network))} Gc/s`,
          })}
          {renderItem({
            id: "miners_active",
            title: "Machines",
            value: formatNumber(info.miners.active),
          })}
          {renderItem({
            id: "hashrate_total",
            title: "Pool Speed",
            value: `${formatNumber(toGigaNumber(info.hashrate.total))} Gc/s`,
          })}
          {renderItem({
            id: "pool_fee",
            title: "Pool Fee",
            value: `${formatNumber(Number(info.pool_fee) * 100)} %`,
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
                openedStat === "hashrate_network") && <div className="text-default font-medium">c/s</div>}
              {openedStat === "balance_pool" && <div className="text-default font-medium">Credits</div>}
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
    </div>
  );

  function openStatGraph(id: string) {
    openedStat === id ? setOpenedStat(null) : setOpenedStat(id);
    !historyInfo && updateHistoryInfo();
  }

  function renderLightningIcon(bg: string, icon: string) {
    return (
      <div className={"flex w-5 h-5 ml-2 rounded-[5px] items-center justify-center" + ` ${bg}`}>
        <i className={"icon block w-[12px] h-[8px]" + ` ${icon}`}></i>
      </div>
    );
  }

  function renderItem(props: any) {
    return (
      <div
        className={`
                flex flex-col h-max items-center justify-center 
                md:w-max
            `}
      >
        <div className="flex items-center text-default text-md font-medium">
          {props.title}
          {(props.id === "hashrate_total" || props.id === "hashrate_network") && (
            <div className="cursor-pointer" onClick={(e) => openStatGraph(props.id)}>
              {openedStat === props.id ? lightningIcon : lightning2Icon}
            </div>
          )}
        </div>
        <div className="flex items-center text-[22px] font-medium mt-[6px]">{props.value}</div>
      </div>
    );
  }
};
