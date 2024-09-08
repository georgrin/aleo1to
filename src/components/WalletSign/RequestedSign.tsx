import { IconCheckSmall } from "../icons/IconCheckSmall";

const RequestedSign = ({ text }: { text?: string }) => (
  <div className="text-xs">
    <div className="border border-primary rounded flex justify-between items-center w-full py-[10px] pr-[6px] px-4">
      <div className="flex items-center justify-center w-full">
        <span className="mr-1">
          <IconCheckSmall />
        </span>
        <span className="text-default">{text || "Requested..."}</span>
      </div>
    </div>
  </div>
);
export default RequestedSign;
