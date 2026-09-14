// @ts-nocheck
import React from 'react';

interface CheckBoxProps {
  id?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  subText?: string;
  className?: string;
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <div className={`relative rounded-lg shrink-0 size-6 ${checked ? 'opacity-100' : 'opacity-20'}`} data-name="CheckBox">
      <div aria-hidden="true" className="absolute border border-gray-800 dark:border-white border-solid inset-0 pointer-events-none rounded-lg bg-transparent dark:bg-white" />
      {checked && (
        <div className="absolute inset-0 bg-[#1D232A] dark:bg-white rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white dark:text-[#1D232A]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
}

function CheckboxLabelContainer({ label, subText }: { label: string; subText?: string }) {
  return (
    <div className="content-stretch flex flex-col gap-1 items-start justify-start relative flex-1" data-name="Checkbox - Label - Container">
      <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-gray-800">
        <p className="leading-[20px] dark:text-white">{label}</p>
      </div>
      {subText && (
        <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-gray-500">
          <p className="leading-[16px] dark:text-gray-300">{subText}</p>
        </div>
      )}
    </div>
  );
}

export default function CheckBoxCheckBoxLabel({ 
  id, 
  checked, 
  onChange, 
  label, 
  subText, 
  className 
}: CheckBoxProps) {
  return (
    <div className={`content-stretch flex gap-3 items-start justify-start relative w-full py-2 ${className || ''}`} data-name="CheckBox / ◉ CheckBox + Label">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label htmlFor={id} className="flex gap-3 items-center cursor-pointer w-full dark:text-foreground">
        <CheckBox checked={checked} />
        <CheckboxLabelContainer label={label} subText={subText} />
      </label>
    </div>
  );
}