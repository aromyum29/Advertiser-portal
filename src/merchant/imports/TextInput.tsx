// @ts-nocheck
import React from 'react';

interface TextInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  prefix?: string;
  step?: string;
  min?: string;
  className?: string;
}

function LabelMainContainer({ label }: { label: string }) {
  return (
    <div className="basis-0 content-stretch flex gap-2.5 grow items-center justify-start min-h-px min-w-px relative shrink-0" data-name="Label / Main - Container">
      <div className="basis-0 flex flex-col font-['Inter:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[14px] text-gray-800">
        <p className="leading-[20px]" dangerouslySetInnerHTML={{ __html: label }} />
      </div>
    </div>
  );
}

function LabelTopContainer({ label }: { label: string }) {
  return (
    <div className="relative shrink-0 w-full" data-name="Label / Top - Container">
      <div className="flex flex-row items-center relative size-full">
        <div className="box-border content-stretch flex items-center justify-start px-1 py-2 relative w-full">
          <LabelMainContainer label={label} />
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

function InputContainer({ 
  id, 
  placeholder, 
  value, 
  onChange, 
  type = "text", 
  required, 
  prefix, 
  step, 
  min 
}: Omit<TextInputProps, 'label' | 'className'>) {
  return (
    <div className="bg-[#ffffff] h-16 min-h-16 relative rounded-lg shrink-0 w-full" data-name="Input - Container">
      <div className="flex flex-row items-center min-h-inherit relative size-full">
        <div className="box-border content-stretch flex gap-2 h-16 items-center justify-start min-h-inherit px-6 py-4 relative w-full">
          <ColorModifierStroke />
          {prefix && (
            <span className="flex flex-col font-['Roboto:Regular',_sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[18px] text-gray-400 mr-2" style={{ fontVariationSettings: "'wdth' 100" }}>
              <p className="leading-[28px]">{prefix}</p>
            </span>
          )}
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            step={step}
            min={min}
            className="basis-0 flex flex-col font-['Roboto:Regular',_sans-serif] font-normal grow justify-center leading-[0] min-h-px min-w-px relative shrink-0 text-[18px] text-gray-800 bg-transparent border-none outline-none placeholder:text-gray-400"
            style={{ fontVariationSettings: "'wdth' 100" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TextInput(props: TextInputProps) {
  return (
    <div className={`content-stretch flex flex-col items-start justify-start relative shrink-0 w-full ${props.className || ''}`} data-name="Text input">
      <LabelTopContainer label={props.label} />
      <InputContainer {...props} />
    </div>
  );
}