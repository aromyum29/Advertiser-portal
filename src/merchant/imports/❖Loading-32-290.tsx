// @ts-nocheck
import svgPaths from "./svg-8h3sn6ckp6";

function LoadingIcons() {
  return (
    <div className="absolute inset-[5%]" data-name="_Loading / ⏺ Icons">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
        <g clipPath="url(#clip0_32_297)" id="_Loading / âº Icons">
          <path clipRule="evenodd" d={svgPaths.pb525e00} fill="var(--fill-0, #1F2937)" fillRule="evenodd" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_32_297">
            <rect fill="white" height="36" width="36" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="relative size-full" data-name="❖ Loading">
      <LoadingIcons />
    </div>
  );
}