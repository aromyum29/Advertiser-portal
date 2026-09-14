// @ts-nocheck
function Tab() {
  return (
    <div className="box-border content-stretch flex gap-2 h-8 items-center justify-center px-4 py-0 relative shrink-0" data-name="Tab">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-gray-800 text-nowrap">
        <p className="leading-[20px] whitespace-pre">Tab 1</p>
      </div>
    </div>
  );
}

function Tab1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Tab">
      <Tab />
      <div className="h-0 relative shrink-0 w-full" data-name="Stroke - ColorModifier">
        <div className="absolute bottom-[-1px] left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(31, 41, 55, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 2">
            <path d="M0 1H67" id="Stroke - ColorModifier" opacity="0.2" stroke="var(--stroke-0, #1F2937)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Tab2() {
  return (
    <div className="box-border content-stretch flex gap-2 h-8 items-center justify-center px-4 py-0 relative shrink-0" data-name="Tab">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-gray-800 text-nowrap">
        <p className="leading-[20px] whitespace-pre">Tab 2</p>
      </div>
    </div>
  );
}

function Tab3() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Tab">
      <Tab2 />
      <div className="h-0 relative shrink-0 w-full" data-name="Stroke - ColorModifier">
        <div className="absolute bottom-[-1px] left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(31, 41, 55, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 69 2">
            <path d="M0 1H69" id="Stroke - ColorModifier" stroke="var(--stroke-0, #1F2937)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Tab4() {
  return (
    <div className="box-border content-stretch flex gap-2 h-8 items-center justify-center px-4 py-0 relative shrink-0" data-name="Tab">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-gray-800 text-nowrap">
        <p className="leading-[20px] whitespace-pre">Tab 3</p>
      </div>
    </div>
  );
}

function Tab5() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Tab">
      <Tab4 />
      <div className="h-0 relative shrink-0 w-full" data-name="Stroke - ColorModifier">
        <div className="absolute bottom-[-1px] left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(31, 41, 55, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 70 2">
            <path d="M0 1H70" id="Stroke - ColorModifier" opacity="0.2" stroke="var(--stroke-0, #1F2937)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function TabStacked() {
  return (
    <div className="content-stretch flex items-start justify-start overflow-clip relative rounded-lg size-full" data-name="Tab / ◉ Stacked">
      <Tab1 />
      <Tab3 />
      <Tab5 />
    </div>
  );
}