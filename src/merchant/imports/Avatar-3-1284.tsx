// @ts-nocheck
function Avatar() {
  return (
    <div className="basis-0 bg-[#2b3440] grow h-full min-h-px min-w-px relative rounded-[1000px] shrink-0" data-name="Avatar">
      <div className="absolute flex flex-col font-['Inter:Regular',_sans-serif] font-normal inset-[31.25%_38.54%] justify-center leading-[0] not-italic text-[#d7dde4] text-[30px] text-center text-nowrap">
        <p className="leading-[36px] whitespace-pre">D</p>
      </div>
    </div>
  );
}

function StrokeGroup() {
  return (
    <div className="basis-0 content-stretch flex grow h-full items-start justify-start min-h-px min-w-px relative rounded-[1000px] shrink-0" data-name="Stroke - Group">
      <div aria-hidden="true" className="absolute border-2 border-[#ffffff] border-solid inset-[-2px] pointer-events-none rounded-[1002px]" />
      <Avatar />
    </div>
  );
}

export default function Avatar1() {
  return (
    <div className="content-stretch flex items-start justify-start relative rounded-[1000px] size-full" data-name="Avatar">
      <div aria-hidden="true" className="absolute border-[#4a00ff] border-[6px] border-solid inset-[-6px] pointer-events-none rounded-[1006px]" />
      <StrokeGroup />
    </div>
  );
}