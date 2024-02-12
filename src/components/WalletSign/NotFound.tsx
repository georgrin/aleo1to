import { IconLogoLeo } from "../icons/IconLogoLeo";
import StatusBar from "./StatusBar";

const NotFound = () => (
  <div className="text-xs">
    <div className="border border-primary rounded flex justify-between items-center w-full py-[6px] pr-[6px] px-4">
      <div className="flex gap-2 items-center">
        <IconLogoLeo />
        <div>
          <span className="text-grey">Leo wallet required,&nbsp;</span>
          <span className="">please install it</span>
        </div>
      </div>
      <a
        href="https://www.leo.app/"
        target="_blank"
        className="inline-block text-aleo-cyan bg-aleo-cyan/10 py-[10px] px-4 rounded leading-none font-medium"
      >
        Install Wallet
      </a>
    </div>
    <StatusBar message="Install wallet extension" />
  </div>
);
export default NotFound;
