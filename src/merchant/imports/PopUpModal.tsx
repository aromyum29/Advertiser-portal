// @ts-nocheck
import svgPaths from "./svg-8f8y185nha";
import imgImage5 from "figma:asset/68ecd344e89a519ff309570057dbcb9785f437ee.png";
import imgChatGptImageAug212025061041Pm1 from "figma:asset/fbfa16bafb5e6ed909c13d6fef046569ac24882e.png";

function Svg() {
  return (
    <div className="absolute left-[314px] size-[17.5px] translate-y-[-50%]" data-name="SVG" style={{ top: "calc(50% + 16.25px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path d={svgPaths.p3b6a9400} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.09375" />
        </g>
      </svg>
    </div>
  );
}

function GenerateQrCodeDescriptionHeader() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[17px] items-start justify-start leading-[0] left-[21px] not-italic top-[141px] w-[257.922px]" data-name="generate qr code description + header">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',_sans-serif] h-6 justify-center relative shrink-0 text-[#1e2939] text-[15.8px] w-full">
        <p className="leading-[24px]">Generate QR Code</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',_sans-serif] h-[34.5px] justify-center relative shrink-0 text-[#4a5565] text-[12.3px] w-full">
        <p className="leading-[20px]">customer scans the QR code to pay with Koko in-store.</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="absolute bg-[#e8effe] box-border content-stretch flex gap-2.5 items-center justify-center left-[21px] overflow-clip px-2 py-1 rounded-[6.75px] translate-y-[-50%]" data-name="Background" style={{ top: "calc(50% + 106px)" }}>
      <div className="flex flex-col font-['SF_Pro_Text:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b68ba] text-[10.5px] text-center w-[151px]">
        <p className="leading-[14px]">Best for In-Store check out</p>
      </div>
    </div>
  );
}

function Background1() {
  return <div className="absolute bottom-[0.63px] left-0 top-0 w-[352.5px]" data-name="Background" />;
}

function FrameWithImage() {
  return (
    <div className="absolute h-[120.633px] left-0 top-0 w-[352.5px]" data-name="frame with image">
      <Background1 />
      <div className="absolute bg-[0%_22.66%] bg-no-repeat bg-size-[100%_232.24%] h-[120.133px] left-[83px] top-[0.5px] w-[186px]" data-name="image 5" style={{ backgroundImage: `url('${imgImage5}')` }} />
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="bg-[#ffffff] h-[273.5px] overflow-clip relative rounded-[14px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] shrink-0 w-[352.5px]" data-name="Background+Shadow">
      <Svg />
      <GenerateQrCodeDescriptionHeader />
      <Background />
      <FrameWithImage />
    </div>
  );
}

function Svg1() {
  return (
    <div className="absolute left-[314px] size-[17.5px] translate-y-[-50%]" data-name="SVG" style={{ top: "calc(50% + 16.25px)" }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path d={svgPaths.p3b6a9400} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.09375" />
        </g>
      </svg>
    </div>
  );
}

function SendSmsLinkHeaderAndDescription() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[17px] items-start justify-start leading-[0] left-[21px] not-italic top-[141px] w-[232.606px]" data-name="send sms link header and description">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',_sans-serif] h-6 justify-center relative shrink-0 text-[#1e2939] text-[15.8px] w-full">
        <p className="leading-[24px]">Send SMS Link</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',_sans-serif] h-[34.5px] justify-center relative shrink-0 text-[#4a5565] text-[12.3px] w-full">
        <p className="leading-[20px]">Send your customer a link to pay with Koko though SMS.</p>
      </div>
    </div>
  );
}

function Background2() {
  return (
    <div className="absolute bg-[#faf1fb] box-border content-stretch flex gap-2.5 items-center justify-center left-[21.5px] overflow-clip px-0 py-1 rounded-[6.75px] translate-y-[-50%] w-[238px]" data-name="Background" style={{ top: "calc(50% + 105.75px)" }}>
      <div className="flex flex-col font-['SF_Pro_Text:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#c431ab] text-[10.5px] text-center text-nowrap">
        <p className="leading-[14px] whitespace-pre">Best for online and social media check out</p>
      </div>
    </div>
  );
}

function BackgroundShadow1() {
  return (
    <div className="bg-[#ffffff] h-[273.5px] overflow-clip relative rounded-[14px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] shrink-0 w-[352.5px]" data-name="Background+Shadow">
      <Svg1 />
      <SendSmsLinkHeaderAndDescription />
      <Background2 />
    </div>
  );
}

function SelectionGrid() {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[29px] top-[130.5px] w-[726px]" data-name="selection grid">
      <BackgroundShadow />
      <BackgroundShadow1 />
    </div>
  );
}

function ButtonSvg() {
  return (
    <div className="absolute left-[755px] size-3.5 top-[15px]" data-name="Button → SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Button â SVG" opacity="0.7">
          <path d="M10.5 3.5L3.5 10.5" id="Vector" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d="M3.5 3.5L10.5 10.5" id="Vector_2" stroke="var(--stroke-0, #0A0A0A)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return <div className="absolute bottom-[0.5px] left-0 top-[0.5px] w-[352.5px]" data-name="Background" />;
}

function ImageFrame() {
  return (
    <div className="absolute h-[121px] left-[402.5px] top-[130px] w-[352.5px]" data-name="image frame">
      <Background3 />
      <div className="absolute flex h-[121px] items-center justify-center left-[78.5px] top-0 w-[190px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="bg-[100%_15.1%] bg-no-repeat bg-size-[120.21%_188.46%] h-[121px] w-[190px]" data-name="ChatGPT Image Aug 21, 2025, 06_10_41 PM 1" style={{ backgroundImage: `url('${imgChatGptImageAug212025061041Pm1}')` }} />
        </div>
      </div>
    </div>
  );
}

export default function PopUpModal() {
  return (
    <div className="bg-[#ffffff] relative rounded-[8.75px] size-full" data-name="pop up modal">
      <div className="overflow-clip relative size-full">
        <div className="absolute flex flex-col font-['SF_Pro_Text:Semibold',_sans-serif] h-7 justify-center leading-[0] left-[29px] not-italic text-[21px] text-neutral-950 top-[43px] translate-y-[-50%] w-[257.681px]">
          <p className="leading-[28px]">Choose Payment Method</p>
        </div>
        <div className="absolute flex flex-col font-['SF_Pro_Text:Regular',_sans-serif] h-[21px] justify-center leading-[0] left-[29px] not-italic text-[#717182] text-[14px] top-[85px] translate-y-[-50%] w-[348.494px]">
          <p className="leading-[21px]">Select how your customer will complete the payment</p>
        </div>
        <SelectionGrid />
        <ButtonSvg />
        <ImageFrame />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8.75px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
    </div>
  );
}