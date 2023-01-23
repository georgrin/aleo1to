import { useState } from "react";
import { IoChevronUpSharp, IoChevronDownSharp } from "react-icons/io5";
import { Tooltip } from "react-tooltip";

export const JoinPool = (props: any) => {
  const { joinPoolCommand, hasUpDownSwitch, isDown, setIsDown } = props;

  const [showCopied, setShowCopied] = useState(false);

  const command = joinPoolCommand
    ? joinPoolCommand
    : "curl -sSf -L https://1to.sh/join | sudo sh";

  const title = joinPoolCommand
    ? `Your address not found, to join a pool run the following in your terminal`
    : `To join a pool run the following in your terminal`;

  return (
    <div className="container">
      <div
        className={`bg-surface p-2 sm:p-6 top-line
                border-[rgba(255,255,255,0.15)]
                ${hasUpDownSwitch && !isDown ? `` : `rounded-b-[5px]`}
            `}
      >
        {Header()}

        <div className="relative w-full mt-6">
          {CommandLine()}
          {CommandCopyIcon()}
        </div>

        {Footer()}
      </div>
    </div>
  );

  function Header() {
    return (
      <div className="flex justify-between">
        <p className="text-base sm:text-xl font-medium">{title}</p>
        {hasUpDownSwitch && UpDownSwitch()}
      </div>
    );
  }

  function UpDownSwitch() {
    return (
      <div
        className="flex text-default items-center cursor-pointer select-none"
        onClick={() => {
          setIsDown((v: boolean) => !v);
        }}
      >
        <div className="mr-2">
          {isDown ? (
            <IoChevronUpSharp size={22} color="inherit" />
          ) : (
            <IoChevronDownSharp size={22} color="inherit" />
          )}
        </div>
        {isDown ? "Up" : "Down"}
      </div>
    );
  }

  function CommandLine() {
    return (
      <div
        className={`
                    w-full pl-4 py-3 pr-10
                    bg-default border-[rgba(255,255,255,0.15)] border-[1px]
                    outline-none rounded-[5px]
                    font-medium
                    text-default
                    text-sm sm:text-base
                `}
      >
        {command}
      </div>
    );
  }

  function CommandCopyIcon() {
    return (
      <div
        className={`
                    absolute top-[15px]
                    right-4 w-[20px] h-[20px]
                    icon copy-grey-icon
                    cursor-pointer
                `}
        onClick={async () => {
          await navigator.clipboard.writeText(command);
          setShowCopied(true);
          setTimeout(() => {
            setShowCopied(false);
          }, 1000);
        }}
      >
        <Tooltip
          className={`
                        text-[rgba(247,163,40,1)] 
                        bg-[rgba(30,32,35,1)]
                        absolute
                        border
                        border-[rgba(255,255,255,0.15)]
                        rounded-[5px] p-[14px]
                        top-12
                        px-10
                        left-[-30px]
                        translate-x-[-50%]
                    `}
          variant="info"
          noArrow
          delayHide={300}
          place="bottom"
          events={["click"]}
          isOpen={showCopied}
        >
          Copied!
        </Tooltip>
      </div>
    );
  }

  function Footer() {
    return (
      <div className="mt-4 text-sm text-default font-medium">
        {!joinPoolCommand && (
          <>
            Script will generate <span className="text-white">private key</span>{" "}
            and <span className="text-white">address</span>, it appears on
            console and will be saved on your disk. If you already have an
            address — <span className="text-white">type it above</span> for
            autofill.
            <br />
          </>
        )}
        If it not works or too easy for you, see our{" "}
        <a
          className="text-primary hover:underline font-bold"
          href="https://docs.aleo1.to/join/"
          target="_blank"
        >
          detailed guide
        </a>
      </div>
    );
  }
};
