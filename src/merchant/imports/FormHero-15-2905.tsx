// @ts-nocheck
function LabelMainContainer() {
  return (
    <div className="basis-0 content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-gray-800">
        <p className="leading-[20px]">Email</p>
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

function ColorModifierStroke() {
  return (
    <div className="absolute bottom-0 left-0 opacity-20 right-[0.14%] rounded-lg top-0" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border border-gray-800 border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function InputContainer() {
  return (
    <div className="bg-[#ffffff] h-12 min-h-12 relative rounded-lg shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-2 h-12 items-center justify-start min-h-inherit px-4 py-3 relative w-full">
          <ColorModifierStroke />
          <div className="basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[16px] text-gray-400" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[24px]">email</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Text input">
      <LabelTopContainer />
      <InputContainer />
    </div>
  );
}

function LabelMainContainer1() {
  return (
    <div className="basis-0 content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-gray-800">
        <p className="leading-[20px]">Password</p>
      </div>
    </div>
  );
}

function LabelTopContainer1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Top - Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-start px-1 py-2 relative w-full">
          <LabelMainContainer1 />
        </div>
      </div>
    </div>
  );
}

function ColorModifierStroke1() {
  return (
    <div className="absolute bottom-0 left-0 opacity-20 right-[0.14%] rounded-lg top-0" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border border-gray-800 border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function InputContainer1() {
  return (
    <div className="bg-[#ffffff] h-12 min-h-12 relative rounded-lg shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-2 h-12 items-center justify-start min-h-inherit px-4 py-3 relative w-full">
          <ColorModifierStroke1 />
          <div className="basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[16px] text-gray-400" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[24px]">password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LabelBotRightContainer() {
  return (
    <div className="basis-0 content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="Label / Bot-Right - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-gray-800">
        <p className="leading-[16px]">Forgot password?</p>
      </div>
    </div>
  );
}

function LabelBotContainer() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Bot - Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-start px-1 py-2 relative w-full">
          <LabelBotRightContainer />
        </div>
      </div>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Text input">
      <LabelTopContainer1 />
      <InputContainer1 />
      <LabelBotContainer />
    </div>
  );
}

function FormContainer() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-start justify-start relative shrink-0 w-full" data-name="Form.Container">
      <TextInput />
      <TextInput1 />
    </div>
  );
}

function Button() {
  return (
    <div className="basis-0 bg-[#4a00ff] grow h-12 min-h-px min-w-px relative rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex gap-2 h-12 items-center justify-center px-4 py-0 relative w-full">
          <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d1dbff] text-[14px] text-center text-nowrap">
            <p className="leading-[14px] whitespace-pre">Login</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormButtonContainer() {
  return (
    <div className="box-border content-stretch flex gap-2.5 items-end justify-end pb-0 pt-6 px-0 relative shrink-0 w-full" data-name="Form - Button - Container">
      <Button />
    </div>
  );
}

export default function FormHero() {
  return (
    <div className="bg-[#ffffff] relative rounded-2xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] size-full" data-name="Form / Hero">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start p-[32px] relative size-full">
          <FormContainer />
          <FormButtonContainer />
        </div>
      </div>
    </div>
  );
}