// @ts-nocheck
import imgImagePlaceholder from "figma:asset/54d2de41825d6ac73b250aeeb3aae377ae298d0d.png";

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
    <div className="basis-0 content-stretch flex grow items-center justify-center min-h-px min-w-px overflow-clip relative shrink-0 w-full" data-name="_Card / ◇ Figure">
      <ImagePlaceholder />
    </div>
  );
}

function BodyHeading() {
  return (
    <div className="content-stretch flex gap-3 items-center justify-start relative shrink-0 w-full" data-name="body - heading">
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] max-w-80 not-italic relative shrink-0 text-[20px] text-gray-800 text-nowrap">
        <p className="leading-[28px] whitespace-pre">Shoes!</p>
      </div>
    </div>
  );
}

function BodyText() {
  return (
    <div className="content-stretch flex flex-col items-start justify-start relative shrink-0 w-full" data-name="body - text">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[28px] max-w-80 not-italic relative shrink-0 text-[16px] text-gray-800 w-full">
        <p className="mb-0">If a dog chews shoes whose shoes does he</p>
        <p>choose?</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#4a00ff] box-border content-stretch flex gap-2 h-12 items-center justify-center px-4 py-0 relative rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] shrink-0" data-name="Button">
      <div className="flex flex-col font-['Inter:Semi_Bold',_sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#d1dbff] text-[14px] text-center text-nowrap">
        <p className="leading-[14px] whitespace-pre">Buy Now</p>
      </div>
    </div>
  );
}

function SlotContainer() {
  return (
    <div className="content-stretch flex gap-2.5 items-center justify-end relative shrink-0 w-full" data-name="Slot - Container">
      <Button />
    </div>
  );
}

function CardContent() {
  return (
    <div className="content-stretch flex flex-col gap-2 items-end justify-center relative shrink-0 w-full" data-name="_Card / ◇ Content">
      <BodyHeading />
      <BodyText />
      <SlotContainer />
    </div>
  );
}

function CardBody() {
  return (
    <div className="relative shrink-0 w-full" data-name="_Card / ◇ Body">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col items-start justify-start p-[32px] relative w-full">
          <CardContent />
        </div>
      </div>
    </div>
  );
}

export default function Card() {
  return (
    <div className="bg-[#ffffff] box-border content-stretch flex flex-col items-start justify-start overflow-clip relative rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] size-full" data-name="Card">
      <CardFigure />
      <CardBody />
    </div>
  );
}