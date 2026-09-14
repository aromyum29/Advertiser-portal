// @ts-nocheck
import svgPaths from "./svg-fxp87oqzqi";

function HIconOutlineSun() {
  return (
    <div className="relative shrink-0 size-6" data-name="h-icon/outline/sun">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="h-icon/outline/sun">
          <path clipRule="evenodd" d={svgPaths.pe62c280} fill="var(--fill-0, #A6ADBB)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ToggleLabelContainer() {
  return (
    <div className="content-stretch flex gap-0.5 items-center justify-start relative shrink-0" data-name="Toggle - Label - Container">
      <HIconOutlineSun />
    </div>
  );
}

function ToggleIndicator() {
  return <div className="bg-[#a6adbb] opacity-80 rounded-[1000px] shrink-0 size-[26px]" data-name="Toggle - Indicator" />;
}

function Toggle() {
  return (
    <div className="box-border content-stretch flex h-8 items-center justify-start opacity-50 p-[3px] relative rounded-[1000px] shrink-0 w-16" data-name="Toggle">
      <div aria-hidden="true" className="absolute border border-[#a6adbb] border-solid inset-0 pointer-events-none rounded-[1000px]" />
      <ToggleIndicator />
    </div>
  );
}

function ToggleToggleLabel() {
  return (
    <div className="content-stretch flex gap-2 items-center justify-start relative shrink-0" data-name="Toggle / ◉ Toggle + label">
      <ToggleLabelContainer />
      <Toggle />
    </div>
  );
}

export default function ThemeControllerThemeToggleIcon() {
  return (
    <div className="content-stretch flex items-start justify-start relative size-full" data-name="Theme controller / ★ Theme.Toggle-Icon">
      <ToggleToggleLabel />
    </div>
  );
}