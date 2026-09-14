// @ts-nocheck
import svgPaths from "./svg-r1qodl1rhe";
import imgImage5 from "figma:asset/68ecd344e89a519ff309570057dbcb9785f437ee.png";
import imgChatGptImageAug212025061041Pm1 from "figma:asset/fbfa16bafb5e6ed909c13d6fef046569ac24882e.png";

function H1AndDescriptionOfModal() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start leading-[0] not-italic relative shrink-0 w-[348.494px]" data-name="H1 and description of modal">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',_sans-serif] h-7 justify-center relative shrink-0 text-[21px] text-neutral-950 w-full">
        <p className="leading-[28px]">Create new order</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',_sans-serif] h-[21px] justify-center relative shrink-0 text-[#717182] text-[14px] w-full">
        <p className="leading-[21px]">Select how your customer will complete the payment</p>
      </div>
    </div>
  );
}

function Background() {
  return <div className="h-[120px] shrink-0 w-full" data-name="Background" />;
}

function GenerateQrCodeDescriptionHeader() {
  return (
    <div className="content-stretch flex flex-col gap-[17px] items-start justify-start leading-[0] not-italic relative shrink-0 w-full" data-name="generate qr code description + header">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',_sans-serif] h-6 justify-center relative shrink-0 text-[#1e2939] text-[15.8px] w-full">
        <p className="leading-[24px]">Generate QR Code</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',_sans-serif] h-[34.5px] justify-center relative shrink-0 text-[#4a5565] text-[12.3px] w-full">
        <p className="leading-[20px]">customer scans the QR code to pay with Koko in-store.</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#e8effe] box-border content-stretch flex gap-2.5 items-center justify-center overflow-clip px-2 py-1 relative rounded-[6.75px] shrink-0" data-name="Background">
      <div className="flex flex-col font-['SF_Pro_Text:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#4b68ba] text-[10.5px] text-center w-[151px]">
        <p className="leading-[14px]">Best for In-Store check out</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-start justify-start relative shrink-0 w-[257.922px]">
      <GenerateQrCodeDescriptionHeader />
      <Background1 />
    </div>
  );
}

function Svg() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path d={svgPaths.p3b6a9400} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.09375" />
        </g>
      </svg>
    </div>
  );
}

function GenerateQrCodeHeaderAndDesc() {
  return (
    <div className="content-stretch flex gap-[35px] items-start justify-start relative shrink-0" data-name="generate qr code header and desc">
      <Frame19 />
      <Svg />
    </div>
  );
}

function Frame20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[21px] items-center justify-start left-0 top-0 w-[352.5px]">
      <Background />
      <GenerateQrCodeHeaderAndDesc />
    </div>
  );
}

function FrameWithImage() {
  return (
    <div className="absolute h-[120.633px] left-0 top-0 w-[352.5px]" data-name="frame with image">
      <Frame20 />
      <div className="absolute bg-[0%_22.66%] bg-no-repeat bg-size-[100%_232.24%] h-[120.133px] left-[83px] top-[0.5px] w-[186px]" data-name="image 5" style={{ backgroundImage: `url('${imgImage5}')` }} />
    </div>
  );
}

function BackgroundShadow() {
  return (
    <div className="bg-[#ffffff] h-[273.5px] overflow-clip relative rounded-[14px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] shrink-0 w-[352.5px]" data-name="Background+Shadow">
      <FrameWithImage />
    </div>
  );
}

function BackgroundShadow1() {
  return <div className="bg-[#ffffff] h-[273.5px] rounded-[14px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] shrink-0 w-[352.5px]" data-name="Background+Shadow" />;
}

function SelectionGrid() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="selection grid">
      <BackgroundShadow />
      <BackgroundShadow1 />
    </div>
  );
}

function ModalLayout() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[53px] items-start justify-start left-[29px] top-[29px] w-[726px]" data-name="modal layout">
      <H1AndDescriptionOfModal />
      <SelectionGrid />
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

function Background2() {
  return <div className="absolute bottom-[0.5px] left-0 top-[0.5px] w-[352.5px]" data-name="Background" />;
}

function ImageFrame() {
  return (
    <div className="h-[121px] relative shrink-0 w-full" data-name="image frame">
      <Background2 />
      <div className="absolute flex h-[121px] items-center justify-center left-[78.5px] top-0 w-[190px]">
        <div className="flex-none rotate-[180deg] scale-y-[-100%]">
          <div className="bg-[100%_15.1%] bg-no-repeat bg-size-[120.21%_188.46%] h-[121px] w-[190px]" data-name="ChatGPT Image Aug 21, 2025, 06_10_41 PM 1" style={{ backgroundImage: `url('${imgChatGptImageAug212025061041Pm1}')` }} />
        </div>
      </div>
    </div>
  );
}

function SendSmsLinkHeaderAndDescription() {
  return (
    <div className="content-stretch flex flex-col gap-[17px] items-start justify-start leading-[0] not-italic relative shrink-0 w-[232.606px]" data-name="send sms link header and description">
      <div className="flex flex-col font-['SF_Pro_Text:Semibold',_sans-serif] h-6 justify-center relative shrink-0 text-[#1e2939] text-[15.8px] w-full">
        <p className="leading-[24px]">Send SMS Link</p>
      </div>
      <div className="flex flex-col font-['SF_Pro_Text:Regular',_sans-serif] h-[34.5px] justify-center relative shrink-0 text-[#4a5565] text-[12.3px] w-full">
        <p className="leading-[20px]">Send your customer a link to pay with Koko though SMS.</p>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[17.5px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="SVG">
          <path d={svgPaths.p3b6a9400} id="Vector" stroke="var(--stroke-0, #717182)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.09375" />
        </g>
      </svg>
    </div>
  );
}

function Background3() {
  return (
    <div className="bg-[#faf1fb] box-border content-stretch flex gap-2.5 items-center justify-center overflow-clip px-0 py-1 relative rounded-[6.75px] shrink-0 w-[238px]" data-name="Background">
      <div className="flex flex-col font-['SF_Pro_Text:Medium',_sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#c431ab] text-[10.5px] text-center text-nowrap">
        <p className="leading-[14px] whitespace-pre">Best for online and social media check out</p>
      </div>
    </div>
  );
}

function SmsLinkDescription() {
  return (
    <div className="content-start flex flex-wrap gap-[60px] items-start justify-start relative shrink-0 w-[310.106px]" data-name="Sms link description">
      <SendSmsLinkHeaderAndDescription />
      <Svg1 />
      <Background3 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-col gap-[21px] items-center justify-start relative shrink-0 w-full">
      <ImageFrame />
      <SmsLinkDescription />
    </div>
  );
}

function SendSmsGridCard() {
  return (
    <div className="relative shrink-0 w-full" data-name="send sms grid card">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2.5 items-start justify-start p-[10px] relative w-full">
          <Frame18 />
        </div>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="absolute box-border content-stretch flex flex-col gap-2.5 items-start justify-start left-[382.5px] p-[10px] top-[110px] w-[392.5px]">
      <SendSmsGridCard />
    </div>
  );
}

export default function PopUpModal() {
  return (
    <div className="bg-[#ffffff] relative rounded-[8.75px] size-full" data-name="pop up modal">
      <div className="overflow-clip relative size-full">
        <ModalLayout />
        <ButtonSvg />
        <Frame21 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8.75px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]" />
    </div>
  );
}