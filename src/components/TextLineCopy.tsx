import { useState } from "react";
import { Tooltip } from "react-tooltip";

export const TextLineCopy = ({ command }: { command: string }) => {
    const [showCopied, setShowCopied] = useState(false);
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
  };
  