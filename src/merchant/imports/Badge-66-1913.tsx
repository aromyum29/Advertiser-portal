// @ts-nocheck
export default function Badge() {
  return (
    <div className="relative rounded-[30.4px] size-full" data-name="Badge">
      <div aria-hidden="true" className="absolute border border-[#4a00ff] border-solid inset-0 pointer-events-none rounded-[30.4px]" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-2 items-center justify-center px-2 py-0 relative size-full">
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#4a00ff] text-[14px] text-center text-nowrap">
            <p className="leading-[20px] whitespace-pre">Badge</p>
          </div>
        </div>
      </div>
    </div>
  );
}