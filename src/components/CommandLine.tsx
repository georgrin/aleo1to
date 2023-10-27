export const CommandLine = ({ command }: { command: string }) => {
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
};
