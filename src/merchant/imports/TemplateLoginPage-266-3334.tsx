// @ts-nocheck
import svgPaths from "./svg-ij4w73gz73";
import imgImagePlaceholder from "figma:asset/ee6401960eb09df7517c11a348794caea40eeaf6.png";

function ImagePlaceholder() {
  return (
    <div className="basis-0 bg-center bg-cover bg-no-repeat grow h-full min-h-px min-w-px relative shrink-0" data-name="Image-placeholder" style={{ backgroundImage: `url('${imgImagePlaceholder}')` }}>
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function CardFigure() {
  return (
    <div className="basis-0 content-stretch flex grow h-full items-center justify-center min-h-px min-w-px overflow-clip relative shrink-0" data-name="_Card / ◇ Figure">
      <ImagePlaceholder />
    </div>
  );
}

function LabelMainContainer() {
  return (
    <div className="basis-0 content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-gray-800">
        <p className="leading-[20px]">Name</p>
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
    <div className="absolute bottom-0 left-0 opacity-20 right-[0.14%] rounded-[8px] top-0" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border border-gray-800 border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function InputContainer() {
  return (
    <div className="bg-white h-12 min-h-12 relative rounded-[8px] shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-2 h-12 items-center justify-start min-h-inherit px-4 py-3 relative w-full">
          <ColorModifierStroke />
          <div className="basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[16px] text-gray-400" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[24px]">Name</p>
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
        <p className="leading-[20px]">Email</p>
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
    <div className="absolute bottom-0 left-0 opacity-20 right-[0.14%] rounded-[8px] top-0" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border border-gray-800 border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function InputContainer1() {
  return (
    <div className="bg-white h-12 min-h-12 relative rounded-[8px] shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-2 h-12 items-center justify-start min-h-inherit px-4 py-3 relative w-full">
          <ColorModifierStroke1 />
          <div className="basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[16px] text-gray-400" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[24px]">Email</p>
          </div>
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
    </div>
  );
}

function LabelMainContainer2() {
  return (
    <div className="basis-0 content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-gray-800">
        <p className="leading-[20px]">Password</p>
      </div>
    </div>
  );
}

function LabelTopContainer2() {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Top - Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-start px-1 py-2 relative w-full">
          <LabelMainContainer2 />
        </div>
      </div>
    </div>
  );
}

function ColorModifierStroke2() {
  return (
    <div className="absolute bottom-0 left-0 opacity-20 right-[0.14%] rounded-[8px] top-0" data-name="ColorModifier - Stroke">
      <div aria-hidden="true" className="absolute border border-gray-800 border-solid inset-[-1px] pointer-events-none rounded-[9px]" />
    </div>
  );
}

function InputContainer2() {
  return (
    <div className="bg-white h-12 min-h-12 relative rounded-[8px] shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-2 h-12 items-center justify-start min-h-inherit px-4 py-3 relative w-full">
          <ColorModifierStroke2 />
          <div className="basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[16px] text-gray-400" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[24px]">Password</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="Text input">
      <LabelTopContainer2 />
      <InputContainer2 />
    </div>
  );
}

function DIconChekboxCheck() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
      <g id="d-icon/chekbox-check">
        <path clipRule="evenodd" d={svgPaths.pc2b1e00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
      </g>
    </svg>
  );
}

function CheckBoxIcon() {
  return (
    <div className="basis-0 grow h-full min-h-px min-w-px overflow-clip relative shrink-0" data-name="_CheckBox / ● Icon">
      <DIconChekboxCheck />
    </div>
  );
}

function CheckBox() {
  return (
    <div className="bg-gray-800 box-border content-stretch flex items-center justify-center p-[4px] relative rounded-[8px] shrink-0 size-6" data-name="CheckBox">
      <CheckBoxIcon />
    </div>
  );
}

function CheckBoxCheckBoxLabel() {
  return (
    <div className="basis-0 content-stretch flex gap-2 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="CheckBox / ◉ CheckBox + Label">
      <CheckBox />
    </div>
  );
}

function Button() {
  return (
    <div className="box-border content-stretch flex gap-2 h-8 items-center justify-center px-3 py-0 relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-gray-800 text-nowrap">
        <p className="leading-[14px] whitespace-pre">Forgot password ?</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-2.5 items-center justify-start relative shrink-0 w-full">
      <CheckBoxCheckBoxLabel />
      <Button />
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#2b3440] h-12 min-h-12 relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-2 h-12 items-center justify-center min-h-inherit px-4 py-0 relative w-full">
          <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d7dde4] text-[14px] text-center text-nowrap">
            <p className="leading-[14px] whitespace-pre">Login</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoGoogle1() {
  return (
    <div className="relative shrink-0 size-4" data-name="Logo/Google">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_266_3625)" id="Logo/Google">
          <path d={svgPaths.p152f3ac0} fill="var(--fill-0, #4285F4)" id="Logo / Vector" />
          <path d={svgPaths.p2250b680} fill="var(--fill-0, #34A853)" id="Logo / Vector_2" />
          <path d={svgPaths.p11e84b80} fill="var(--fill-0, #FBBC05)" id="Logo / Vector_3" />
          <path d={svgPaths.p2499cb00} fill="var(--fill-0, #EB4335)" id="Logo / Vector_4" />
        </g>
        <defs>
          <clipPath id="clip0_266_3625">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[#f2f2f2] h-12 min-h-12 relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0 w-full" data-name="Button">
      <div className="flex flex-row items-center justify-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-2 h-12 items-center justify-center min-h-inherit px-4 py-0 relative w-full">
          <LogoGoogle1 />
          <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-gray-800 text-nowrap">
            <p className="leading-[14px] whitespace-pre">Login with Google</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="box-border content-stretch flex gap-2 h-12 items-center justify-center min-h-12 px-4 py-0 relative rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-gray-800 text-nowrap">
        <p className="leading-[14px] whitespace-pre">Login to existing account</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-2.5 items-end justify-center relative shrink-0 w-full">
      <Button3 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="content-stretch flex flex-col gap-4 items-start justify-start relative shrink-0 w-full" data-name="_Card / ◇ Content">
      <TextInput />
      <TextInput1 />
      <TextInput2 />
      <Frame2 />
      <Button1 />
      <Button2 />
      <Frame1 />
    </div>
  );
}

function CardBody() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0" data-name="_Card / ◇ Body">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start pb-14 pt-11 px-12 relative w-full">
          <CardContent />
        </div>
      </div>
    </div>
  );
}

export default function TemplateLoginPage() {
  return (
    <div className="bg-white box-border content-stretch flex items-center justify-end overflow-clip relative rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full" data-name="Template / Login Page">
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <CardFigure />
      </div>
      <CardBody />
    </div>
  );
}