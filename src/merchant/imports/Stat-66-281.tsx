// @ts-nocheck
function StatInfos() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center leading-[0] not-italic relative shrink-0 text-gray-800 text-nowrap" data-name="Stat - Infos">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center opacity-60 relative shrink-0 text-[16px]">
        <p className="leading-[28px] text-nowrap whitespace-pre">Page Views</p>
      </div>
      <div className="flex flex-col font-['Inter:Extra_Bold',_sans-serif] font-extrabold justify-center relative shrink-0 text-[36px]">
        <p className="leading-[40px] text-nowrap whitespace-pre">2.6M</p>
      </div>
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center opacity-60 relative shrink-0 text-[12px]">
        <p className="leading-[16px] text-nowrap whitespace-pre">21% more than last month</p>
      </div>
    </div>
  );
}

function StatBody() {
  return (
    <div className="content-stretch flex gap-4 items-center justify-start relative shrink-0 w-full" data-name="Stat - Body">
      <StatInfos />
    </div>
  );
}

function StatContent() {
  return (
    <div className="box-border content-stretch flex flex-col gap-4 items-start justify-center px-6 py-4 relative shrink-0" data-name="Stat - Content">
      <StatBody />
    </div>
  );
}

function StatSepratorBot() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative shrink-0" data-name="Stat - Seprator / Bot">
      <div className="h-0 relative shrink-0 w-full" data-name="Stat - Separator">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(31, 41, 55, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 236 1">
            <line id="Stat - Separator" opacity="0.1" stroke="var(--stroke-0, #1F2937)" x2="236" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <StatContent />
    </div>
  );
}

function StatItem() {
  return (
    <div className="content-stretch flex items-center justify-start relative shrink-0 w-[236px]" data-name="_Stat / ◇ Item">
      <div className="flex flex-row items-center self-stretch">
        <div className="flex h-full items-center justify-center relative shrink-0" style={{ "--transform-inner-width": "116", "--transform-inner-height": "116", width: "calc(1px * ((var(--transform-inner-height) * 1) + (var(--transform-inner-width) * 0)))" } as React.CSSProperties}>
          <div className="flex-none h-full rotate-[90deg]">
            <div className="h-full relative w-[116px]" data-name="Stat - Separator">
              <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(31, 41, 55, 1)" } as React.CSSProperties}>
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 116 1">
                  <line id="Stat - Separator" opacity="0.1" stroke="var(--stroke-0, #1F2937)" x2="116" y1="0.5" y2="0.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StatSepratorBot />
    </div>
  );
}

export default function Stat() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex items-start justify-start overflow-clip relative rounded-2xl shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] size-full" data-name="Stat">
      {[...Array(3).keys()].map((_, i) => (
        <StatItem key={i} />
      ))}
    </div>
  );
}