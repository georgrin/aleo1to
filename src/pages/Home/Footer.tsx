import { useEffect } from "react";

export const Footer = (props: any) => {
  useEffect(() => {
    try {
      throw Error("This is an example error on Footer");
    } catch (error) {
      console.log('error message: ', error);
    }
  }, []);
  return (
    <>
      <div className="h-14 md:h-10"></div>
      <div className="fixed flex items-center bottom-0 w-full h-auto md:h-10 bg-surface top-line font-thirdly text-sm">
        <div className="container flex items-center justify-end">
          {/* <div className="mr-auto text-[12px]">1to (c) 2023</div> */}
          <a target="_blank" href="https://www.ingonyama.com" className="flex items-center">
            <div className="relative sm:mt-[4px] mr-[10px] text-[12px]">Built with:</div>
            <span className="inline-block top-[2px] icon logo-footer-icon w-[90px] h-[25px] sm:w-[125px] sm:h-[30px]"></span>
          </a>
        </div>
      </div>
    </>
  );
};
