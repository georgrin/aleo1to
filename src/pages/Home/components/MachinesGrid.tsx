import Pagination from "../../../components/Pagination";
import IconCPU from "../../../components/icons/IconCPU";
import IconGPU from "../../../components/icons/IconGPU";
import { formatNumber } from "../../../formatNumber";
import { Machines } from "../../../model";
import { usePagination } from "../hooks/usePagination";

const MachinesGrid = ({ machines }: { machines: Machines[] }) => {
  const { pageData, jumpToPage, currentPage, totalPages } = usePagination({
    pageSize: 14,
    data: machines,
  });

  return (
    <>
      <div className="font-default sm:mx-[-24px] mx-[-10px] mt-[20px] overflow-x-auto overflow-y-hidden">
        <div className="grid machine-grid items-center top-line text-grey py-2 px-6 text-xs min-w-min">
          <p>IP</p>
          <p className="col-span-2">Hostname</p>
          <p className="col-span-4">Hardware</p>
          <div>
            Cuda<p>version</p>
          </div>
          <div>
            Prover<p>version</p>
          </div>
          <div>
            Estimated<p>speed, c/s</p>
          </div>
          <div>
            Reported<p>speed, c/s</p>
          </div>
        </div>
        {pageData.map(({ ip, hostname, hardware, params, hashrate, hashrate_estimated }, index) => (
          <div
            key={index}
            className={
              "grid machine-grid items-center w-full text-white py-[6px] px-6 text-xs min-w-min" +
              (index % 2 ? "bg-surface" : "bg-default")
            }
          >
            <p>{ip}</p>
            <p className="text-grey col-span-2">{hostname}</p>
            <div className="col-span-4">
              <div className="flex">
                <span className="text-grey font-extrabold flex">
                  <IconCPU />
                  &nbsp;CPU:&nbsp;
                </span>
                {hardware.cpu?.[0]?.model}&nbsp;
                <span className="text-grey">
                  ({hardware.cpu?.[0].cores}&nbsp;
                  {hardware.cpu?.[0].cores > 1 ? "cores" : "core"})
                </span>
              </div>
              <div className="pt-[2px] flex">
                <span className="text-grey font-extrabold flex">
                  <IconGPU />
                  &nbsp;GPU:&nbsp;
                </span>
                {hardware.gpu.length}&nbsp;x&nbsp;
                {hardware.gpu?.[0]?.model}
              </div>
            </div>
            <p>{params.cuda_version}</p>
            <p>{params.version}</p>
            <p>{formatNumber(hashrate_estimated)}</p>
            <p>{formatNumber(hashrate)}</p>
          </div>
        ))}
      </div>
      <div className="flex top-line text-xs px-6 py-2 sm:mx-[-24px] mx-[-10px] text-grey">
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={jumpToPage} />
      </div>
    </>
  );
};

export default MachinesGrid;
