// @ts-nocheck
import svgPaths from "./svg-m1ysu2qama";

function TooltipContainer() {
  return (
    <div className="bg-[#2b3440] box-border content-stretch flex flex-col items-center justify-start max-w-80 px-2 py-1 relative rounded shrink-0" data-name="Tooltip - Container">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[14px] text-center text-nowrap">
        <p className="leading-[20px] whitespace-pre">tooltip</p>
      </div>
    </div>
  );
}

function TooltipTail2() {
  return (
    <div className="h-1 relative shrink-0 w-[7px]" data-name="_Tooltip / ◇ Tail">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 4">
        <g id="_Tooltip / â Tail">
          <path d={svgPaths.p52cff00} id="Tooltip - Pointer" stroke="var(--stroke-0, #2B3440)" strokeWidth="3" />
        </g>
      </svg>
    </div>
  );
}

function TooltipPointerContainer2() {
  return (
    <div className="content-stretch flex flex-col items-center justify-start relative shrink-0 w-full" data-name="Tooltip - Pointer - Container">
      <TooltipTail2 />
    </div>
  );
}

function TooltipPointerTopBotContainer() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0" data-name="tooltip-pointer / (top/bot) - container">
      <TooltipContainer />
      <TooltipPointerContainer2 />
    </div>
  );
}

export default function Tooltip() {
  return (
    <div className="content-stretch flex items-start justify-start relative size-full" data-name="❖ Tooltip">
      <TooltipPointerTopBotContainer />
    </div>
  );
}