// @ts-nocheck
function LabelMainContainer() {
  return (
    <div className="basis-0 content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-gray-800">
        <p className="leading-[20px]">label (main)</p>
      </div>
    </div>
  );
}

function LabelTopContainer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Top - Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-start px-1 py-2 relative w-full">
          <LabelMainContainer />
        </div>
      </div>
    </div>
  );
}

function ColorModifierFocusPadding() {
  return (
    <div className="basis-0 bg-[#ffffff] grow min-h-px min-w-px relative rounded-lg shrink-0 w-full" data-name="ColorModifier - Focus / Padding">
      <div aria-hidden="true" className="absolute border-[#ffffff] border-[3px] border-solid inset-[-3px] pointer-events-none rounded-[11px]" />
    </div>
  );
}

function ColorModifierFocus() {
  return (
    <div className="absolute content-stretch flex flex-col inset-0 items-center justify-start opacity-20 rounded-lg" data-name="ColorModifier - Focus">
      <div aria-hidden="true" className="absolute border-[5.5px] border-gray-800 border-solid inset-[-5.5px] pointer-events-none rounded-[13.5px]" />
      <ColorModifierFocusPadding />
    </div>
  );
}

function ColorModifierStroke() {
  return (
    <div className="absolute bottom-0 left-0 opacity-20 right-[0.14%] rounded-lg top-0" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border border-gray-800 border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function InputContainer() {
  return (
    <div className="bg-[#ffffff] h-16 min-h-16 relative rounded-lg shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-2 h-16 items-center justify-start min-h-inherit px-6 py-4 relative w-full">
          <ColorModifierFocus />
          <ColorModifierStroke />
          <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[18px] text-gray-800">
            <p className="leading-[28px]">Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TextInput() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative size-full" data-name="Text input">
      <LabelTopContainer />
      <InputContainer />
    </div>
  );
}