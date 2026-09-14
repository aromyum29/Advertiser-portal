// @ts-nocheck
import svgPaths from "./svg-skbz3lz34v";

function DaisyIconRadio() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0" data-name="daisy-icon/radio">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="daisy-icon/radio">
          <path clipRule="evenodd" d={svgPaths.p78d1c00} fill="var(--fill-0, #1F2937)" fillRule="evenodd" id="Subtract" />
        </g>
      </svg>
    </div>
  );
}

function Radio() {
  return (
    <div className="box-border content-stretch flex items-center justify-center p-[4px] relative rounded-[1000px] shrink-0 size-6" data-name="Radio">
      <div aria-hidden="true" className="absolute border border-gray-800 border-solid inset-0 pointer-events-none rounded-[1000px]" />
      <DaisyIconRadio />
    </div>
  );
}

function CheckboxLabelContainer1() {
  return (
    <div className="content-stretch flex gap-0.5 items-center justify-end relative shrink-0" data-name="Checkbox - Label - Container">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-gray-800 text-nowrap">
        <p className="leading-[28px] whitespace-pre">{`Koko's Gateway`}</p>
      </div>
    </div>
  );
}

function RadioRadioLabel() {
  return (
    <div className="absolute content-stretch flex gap-2 items-center justify-start left-[49px] top-[162px]" data-name="Radio / ◉ Radio + Label">
      <Radio />
      <CheckboxLabelContainer1 />
    </div>
  );
}

function Radio1() {
  return (
    <div className="opacity-20 relative rounded-[1000px] shrink-0 size-6" data-name="Radio">
      <div aria-hidden="true" className="absolute border border-gray-800 border-solid inset-0 pointer-events-none rounded-[1000px]" />
    </div>
  );
}

function CheckboxLabelContainer3() {
  return (
    <div className="content-stretch flex gap-0.5 items-center justify-end relative shrink-0" data-name="Checkbox - Label - Container">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-gray-800 text-nowrap">
        <p className="leading-[28px] whitespace-pre">{`Koko's Gateway`}</p>
      </div>
    </div>
  );
}

function RadioRadioLabel1() {
  return (
    <div className="absolute content-stretch flex gap-2 items-center justify-start left-[49px] top-[120px]" data-name="Radio / ◉ Radio + Label">
      <Radio1 />
      <CheckboxLabelContainer3 />
    </div>
  );
}

export default function Frame24() {
  return (
    <div className="bg-[#ffffff] relative size-full">
      <RadioRadioLabel />
      <RadioRadioLabel1 />
    </div>
  );
}