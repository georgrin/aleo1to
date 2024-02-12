import shortenAddress from "../../helpers/shortenAddress";
import { IconLogoLeo } from "../icons/IconLogoLeo";
import IconRetry from "../icons/IconRetry";
import StatusBar from "./StatusBar";

const ErrorSign = ({
  publicKey,
  resetStatus,
}: {
  publicKey: string;
  resetStatus: () => void;
}) => (
  <div className="text-xs">
    <div className="border border-primary rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4">
      <div className="flex gap-2 items-center">
        <IconLogoLeo />
        <span>{shortenAddress(publicKey)}</span>
      </div>
    </div>
    <StatusBar
      message={
        <div className="flex gap-2">
          <span className="text-red-500">Error: some error</span>
          <button onClick={resetStatus}>
            <IconRetry />
          </button>
          <button onClick={resetStatus} className="underline">
            Try again
          </button>
        </div>
      }
    />
  </div>
);
export default ErrorSign;
