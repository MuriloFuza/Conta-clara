import React, { FC } from 'react'
import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

interface ISelectInputProps {
  values: {
    [key: string]: string
  }
  onChange: (value: string) => void
  selectedValue: string
  label: string
  placeholder: string
}

export const SelectKeyInput: FC<ISelectInputProps> = ({
  values,
  onChange,
  selectedValue,
  label,
  placeholder,
}) => (
  <div className="flex flex-col gap-y-1 w-52 max-w-52">
    <label>{label}</label>
    <Select.Root onValueChange={onChange} value={selectedValue}>
      <Select.Trigger
        className="flex justify-between rounded-lg border-0 py-2 px-4 bg-neutral-950 text-gray-500 w-f"
        aria-label="Food"
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          className="p-2 bg-neutral-900 border mt-2 w-[--radix-select-trigger-width] max-h-[16rem]"
        >
          <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <ChevronUp />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            {Object.keys(values).map((item) => (
              <Select.Item
                key={item}
                value={item}
                className={`text-sm text-gray-400 rounded-lg flex items-center h-7 pr-10 pl-7 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-white data-[highlighted]:text-black`}
              >
                <Select.ItemText>{values[item]}</Select.ItemText>
                <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
                  <Check />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
            <ChevronDown />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  </div>
)
