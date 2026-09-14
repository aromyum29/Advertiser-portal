// @ts-nocheck
function Label() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-center justify-start relative shrink-0" data-name="label">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[16px] text-center text-nowrap">
        <p className="leading-[28px] whitespace-pre">days</p>
      </div>
    </div>
  );
}

function CountdownItem() {
  return (
    <div className="bg-[#2b3440] box-border content-stretch flex flex-col gap-1 items-center justify-center p-[16px] relative rounded-2xl shrink-0" data-name="Countdown/item">
      <div className="font-['Menlo:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[48px] text-center text-nowrap">
        <p className="leading-[48px] whitespace-pre">01</p>
      </div>
      <Label />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-center justify-start relative shrink-0" data-name="label">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[16px] text-center text-nowrap">
        <p className="leading-[28px] whitespace-pre">hours</p>
      </div>
    </div>
  );
}

function CountdownItem1() {
  return (
    <div className="bg-[#2b3440] box-border content-stretch flex flex-col gap-1 items-center justify-center p-[16px] relative rounded-2xl shrink-0" data-name="Countdown/item">
      <div className="font-['Menlo:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[48px] text-center text-nowrap">
        <p className="leading-[48px] whitespace-pre">01</p>
      </div>
      <Label1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-center justify-start relative shrink-0" data-name="label">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[16px] text-center text-nowrap">
        <p className="leading-[28px] whitespace-pre">minutes</p>
      </div>
    </div>
  );
}

function CountdownItem2() {
  return (
    <div className="bg-[#2b3440] box-border content-stretch flex flex-col gap-1 items-center justify-center p-[16px] relative rounded-2xl shrink-0" data-name="Countdown/item">
      <div className="font-['Menlo:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[48px] text-center text-nowrap">
        <p className="leading-[48px] whitespace-pre">01</p>
      </div>
      <Label2 />
    </div>
  );
}

function Label3() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-center justify-start relative shrink-0" data-name="label">
      <div className="font-['Inter:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[16px] text-center text-nowrap">
        <p className="leading-[28px] whitespace-pre">sec</p>
      </div>
    </div>
  );
}

function CountdownItem3() {
  return (
    <div className="bg-[#2b3440] box-border content-stretch flex flex-col gap-1 items-center justify-center p-[16px] relative rounded-2xl shrink-0" data-name="Countdown/item">
      <div className="font-['Menlo:Regular',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[48px] text-center text-nowrap">
        <p className="leading-[48px] whitespace-pre">01</p>
      </div>
      <Label3 />
    </div>
  );
}

export default function Countdown() {
  return (
    <div className="content-stretch flex gap-4 items-end justify-start relative size-full" data-name="Countdown">
      <CountdownItem />
      <CountdownItem1 />
      <CountdownItem2 />
      <CountdownItem3 />
    </div>
  );
}